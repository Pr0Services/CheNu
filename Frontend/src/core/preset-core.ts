/* =========================================================
   CHE·NU — PRESET CORE
   
   Version simplifiée et épurée du système d'observabilité:
   1. Timeline vérité
   2. Replay XR
   3. Analytics usage
   
   Ce fichier est la référence MINIMALE pour le preset system.
   ========================================================= */

// ─────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────

/**
 * Source d'un changement de preset.
 */
export type PresetSource =
  | 'manual'   // Choix explicite de l'utilisateur
  | 'role'     // Changement de rôle
  | 'phase'    // Changement de phase
  | 'project'  // Changement de projet
  | 'sphere'   // Changement de sphère
  | 'agent';   // Suggestion d'agent acceptée

/**
 * Événement de changement de preset.
 */
export interface PresetChange {
  /** Timestamp du changement */
  timestamp: number;
  /** ID du preset activé */
  presetId: string;
  /** Source du changement */
  source: PresetSource;
  /** Contexte optionnel */
  context?: PresetChangeContext;
}

/**
 * Contexte d'un changement.
 */
export interface PresetChangeContext {
  role?: string;
  phase?: string;
  project?: string;
  sphere?: string;
}

/**
 * Métrique d'utilisation d'un preset.
 */
export interface PresetMetric {
  /** ID du preset */
  presetId: string;
  /** Nombre d'activations */
  activations: number;
  /** Temps total d'utilisation (ms) */
  totalTimeMs: number;
}

/**
 * Transition de preset (pour XR).
 */
export interface PresetTransition {
  /** Preset de départ */
  from: string;
  /** Preset d'arrivée */
  to: string;
  /** Timestamp de la transition */
  at: number;
}

// ─────────────────────────────────────────────────────────
// 1. TIMELINE (VÉRITÉ)
// ─────────────────────────────────────────────────────────

/**
 * Timeline des changements de preset.
 * C'est la SEULE source de vérité.
 */
export class PresetTimeline {
  private events: PresetChange[] = [];

  /**
   * Ajoute un événement à la timeline.
   */
  add(event: PresetChange): void {
    this.events.push(event);
  }

  /**
   * Crée et ajoute un événement.
   */
  record(
    presetId: string,
    source: PresetSource,
    context?: PresetChangeContext
  ): PresetChange {
    const event: PresetChange = {
      timestamp: Date.now(),
      presetId,
      source,
      context,
    };
    this.add(event);
    return event;
  }

  /**
   * Retourne tous les événements triés chronologiquement.
   */
  all(): PresetChange[] {
    return [...this.events].sort((a, b) => a.timestamp - b.timestamp);
  }

  /**
   * Retourne le dernier événement.
   */
  last(): PresetChange | undefined {
    const sorted = this.all();
    return sorted[sorted.length - 1];
  }

  /**
   * Retourne le preset actif actuel.
   */
  current(): string | undefined {
    return this.last()?.presetId;
  }

  /**
   * Nombre d'événements.
   */
  get length(): number {
    return this.events.length;
  }

  /**
   * Vide la timeline.
   */
  clear(): void {
    this.events = [];
  }

  /**
   * Exporte en JSON.
   */
  export(): string {
    return JSON.stringify(this.all());
  }

  /**
   * Importe depuis JSON.
   */
  import(json: string): void {
    this.events = JSON.parse(json);
  }
}

// ─────────────────────────────────────────────────────────
// 2. REPLAY XR
// ─────────────────────────────────────────────────────────

/**
 * Obtient le preset actif à un moment donné.
 * Utilisé par XR pour le replay.
 */
export function presetAtTime(
  timeline: PresetChange[],
  time: number
): PresetChange | undefined {
  return [...timeline]
    .filter((e) => e.timestamp <= time)
    .sort((a, b) => b.timestamp - a.timestamp)[0];
}

/**
 * Calcule les transitions de presets.
 * XR utilise UNIQUEMENT ces transitions pour jouer les auras.
 */
export function presetTransitions(
  timeline: PresetChange[]
): PresetTransition[] {
  const sorted = [...timeline].sort((a, b) => a.timestamp - b.timestamp);
  
  return sorted.slice(1).map((event, index) => ({
    from: sorted[index].presetId,
    to: event.presetId,
    at: event.timestamp,
  }));
}

/**
 * Obtient la transition à un moment donné.
 */
export function transitionAtTime(
  transitions: PresetTransition[],
  time: number
): PresetTransition | undefined {
  return [...transitions]
    .filter((t) => t.at <= time)
    .sort((a, b) => b.at - a.at)[0];
}

/**
 * Calcule la progression d'une transition (0-1).
 */
export function transitionProgress(
  transition: PresetTransition,
  currentTime: number,
  durationMs: number = 1000
): number {
  const elapsed = currentTime - transition.at;
  return Math.min(1, Math.max(0, elapsed / durationMs));
}

// ─────────────────────────────────────────────────────────
// 3. ANALYTICS (OBSERVER)
// ─────────────────────────────────────────────────────────

/**
 * Calcule les métriques d'utilisation des presets.
 * Les analytics n'évaluent pas la personne, ils observent.
 */
export function computePresetMetrics(
  timeline: PresetChange[]
): PresetMetric[] {
  const sorted = [...timeline].sort((a, b) => a.timestamp - b.timestamp);
  const metrics: Record<string, PresetMetric> = {};

  for (let i = 0; i < sorted.length; i++) {
    const current = sorted[i];
    const next = sorted[i + 1];

    if (!metrics[current.presetId]) {
      metrics[current.presetId] = {
        presetId: current.presetId,
        activations: 0,
        totalTimeMs: 0,
      };
    }

    metrics[current.presetId].activations += 1;

    if (next) {
      metrics[current.presetId].totalTimeMs += next.timestamp - current.timestamp;
    }
  }

  return Object.values(metrics);
}

/**
 * Obtient le preset le plus utilisé.
 */
export function mostUsedPreset(metrics: PresetMetric[]): PresetMetric | undefined {
  return [...metrics].sort((a, b) => b.activations - a.activations)[0];
}

/**
 * Obtient le preset avec le plus de temps.
 */
export function longestUsedPreset(metrics: PresetMetric[]): PresetMetric | undefined {
  return [...metrics].sort((a, b) => b.totalTimeMs - a.totalTimeMs)[0];
}

/**
 * Compte les changements par source.
 */
export function countBySource(
  timeline: PresetChange[]
): Record<PresetSource, number> {
  const counts: Record<PresetSource, number> = {
    manual: 0,
    role: 0,
    phase: 0,
    project: 0,
    sphere: 0,
    agent: 0,
  };

  for (const event of timeline) {
    counts[event.source] += 1;
  }

  return counts;
}

/**
 * Calcule le taux de changements manuels vs suggérés.
 */
export function manualVsSuggested(timeline: PresetChange[]): {
  manual: number;
  suggested: number;
  ratio: number;
} {
  const manual = timeline.filter((e) => e.source === 'manual').length;
  const suggested = timeline.length - manual;

  return {
    manual,
    suggested,
    ratio: timeline.length > 0 ? manual / timeline.length : 0,
  };
}

// ─────────────────────────────────────────────────────────
// SINGLETON GLOBAL
// ─────────────────────────────────────────────────────────

/**
 * Timeline globale (singleton).
 */
let _globalTimeline: PresetTimeline | null = null;

/**
 * Obtient la timeline globale.
 */
export function globalTimeline(): PresetTimeline {
  if (!_globalTimeline) {
    _globalTimeline = new PresetTimeline();
  }
  return _globalTimeline;
}

/**
 * Réinitialise la timeline globale.
 */
export function resetGlobalTimeline(): void {
  _globalTimeline = null;
}

// ─────────────────────────────────────────────────────────
// LOIS (NE PAS TOUCHER)
// ─────────────────────────────────────────────────────────

/**
 * LOIS FONDAMENTALES DU PRESET SYSTEM:
 * 
 * 1. La timeline est la SEULE vérité
 *    → Pas de dérivation, pas de cache parallèle
 * 
 * 2. Le replay est dérivé, jamais écrit
 *    → Calculé à la demande depuis la timeline
 * 
 * 3. Les analytics n'évaluent pas la personne
 *    → Observer, pas juger
 * 
 * 4. Rien ne s'active sans humain
 *    → Toujours suggérer, jamais forcer
 * 
 * 5. XR = visualisation, pas autorité
 *    → L'aura montre, elle ne décide pas
 */
export const PRESET_LAWS = [
  'La timeline est la SEULE vérité',
  'Le replay est dérivé, jamais écrit',
  'Les analytics n\'évaluent pas la personne',
  'Rien ne s\'active sans humain',
  'XR = visualisation, pas autorité',
] as const;
