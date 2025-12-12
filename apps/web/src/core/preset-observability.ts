/* =========================================================
   CHE·NU — PRESET OBSERVABILITY CORE
   
   Système d'observabilité pour les presets:
   - Timeline des changements
   - Replay XR des transitions
   - Analytics d'utilisation
   ========================================================= */

// ─────────────────────────────────────────────────────────
// 1. TYPES FONDAMENTAUX
// ─────────────────────────────────────────────────────────

/**
 * Source d'un changement de preset.
 */
export type PresetChangeSource =
  | 'manual'   // Sélection manuelle par l'utilisateur
  | 'role'     // Changement de rôle
  | 'phase'    // Changement de phase
  | 'project'  // Changement de projet
  | 'sphere'   // Changement de sphère
  | 'agent';   // Suggestion d'agent acceptée

/**
 * Événement de changement de preset.
 */
export interface PresetChangeEvent {
  /** Identifiant unique de l'événement */
  id: string;
  /** Timestamp de l'événement */
  timestamp: number;
  /** ID du preset activé */
  presetId: string;
  /** Source du changement */
  source: PresetChangeSource;
  /** Contexte au moment du changement */
  context: PresetChangeContext;
  /** Métadonnées additionnelles */
  metadata?: Record<string, unknown>;
}

/**
 * Contexte au moment d'un changement de preset.
 */
export interface PresetChangeContext {
  /** Rôle actif */
  roleId?: string;
  /** Phase active */
  phase?: string;
  /** Projet actif */
  projectId?: string;
  /** Sphère active */
  sphere?: string;
  /** Session ID */
  sessionId?: string;
  /** User agent (pour analytics device) */
  userAgent?: string;
}

/**
 * Métriques d'utilisation d'un preset.
 */
export interface PresetUsageMetrics {
  /** ID du preset */
  presetId: string;
  /** Nombre total d'activations */
  totalActivations: number;
  /** Durée totale d'utilisation (ms) */
  totalDurationMs: number;
  /** Suggestions acceptées */
  acceptedSuggestions: number;
  /** Suggestions ignorées */
  ignoredSuggestions: number;
  /** Durée moyenne par activation (ms) */
  avgDurationMs?: number;
  /** Taux d'acceptation (0-1) */
  acceptanceRate?: number;
}

// ─────────────────────────────────────────────────────────
// 2. TIMELINE DES PRESETS
// ─────────────────────────────────────────────────────────

/**
 * Configuration de la timeline.
 */
export interface PresetTimelineConfig {
  /** Taille maximale de l'historique */
  maxEvents?: number;
  /** Durée de rétention (ms) */
  retentionMs?: number;
  /** Callback sur nouvel événement */
  onEvent?: (event: PresetChangeEvent) => void;
}

/**
 * Timeline des changements de presets.
 * Source de vérité pour l'historique des presets.
 */
export class PresetTimeline {
  private events: PresetChangeEvent[] = [];
  private config: PresetTimelineConfig;
  private listeners: Set<(event: PresetChangeEvent) => void> = new Set();

  constructor(config: PresetTimelineConfig = {}) {
    this.config = {
      maxEvents: config.maxEvents || 1000,
      retentionMs: config.retentionMs || 7 * 24 * 60 * 60 * 1000, // 7 jours
      onEvent: config.onEvent,
    };
  }

  /**
   * Enregistre un événement de changement.
   */
  record(event: PresetChangeEvent): void {
    this.events.push(event);
    this.cleanup();
    
    // Notifier les listeners
    this.config.onEvent?.(event);
    this.listeners.forEach((listener) => listener(event));
  }

  /**
   * Crée et enregistre un événement.
   */
  createAndRecord(
    presetId: string,
    source: PresetChangeSource,
    context: PresetChangeContext,
    metadata?: Record<string, unknown>
  ): PresetChangeEvent {
    const event: PresetChangeEvent = {
      id: this.generateId(),
      timestamp: Date.now(),
      presetId,
      source,
      context,
      metadata,
    };
    this.record(event);
    return event;
  }

  /**
   * Retourne la timeline triée chronologiquement.
   */
  getTimeline(): PresetChangeEvent[] {
    return [...this.events].sort((a, b) => a.timestamp - b.timestamp);
  }

  /**
   * Retourne la timeline inversée (plus récent en premier).
   */
  getTimelineDesc(): PresetChangeEvent[] {
    return [...this.events].sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * Retourne l'historique d'un preset spécifique.
   */
  getPresetHistory(presetId: string): PresetChangeEvent[] {
    return this.events
      .filter((e) => e.presetId === presetId)
      .sort((a, b) => a.timestamp - b.timestamp);
  }

  /**
   * Retourne les événements dans une plage de temps.
   */
  getEventsInRange(startTime: number, endTime: number): PresetChangeEvent[] {
    return this.events.filter(
      (e) => e.timestamp >= startTime && e.timestamp <= endTime
    );
  }

  /**
   * Retourne les événements par source.
   */
  getEventsBySource(source: PresetChangeSource): PresetChangeEvent[] {
    return this.events.filter((e) => e.source === source);
  }

  /**
   * Retourne le dernier événement.
   */
  getLastEvent(): PresetChangeEvent | undefined {
    return this.getTimelineDesc()[0];
  }

  /**
   * Retourne le preset actif au timestamp donné.
   */
  getActivePresetAt(time: number): PresetChangeEvent | undefined {
    return [...this.events]
      .filter((e) => e.timestamp <= time)
      .sort((a, b) => b.timestamp - a.timestamp)[0];
  }

  /**
   * Nombre total d'événements.
   */
  get length(): number {
    return this.events.length;
  }

  /**
   * Ajoute un listener pour les nouveaux événements.
   */
  subscribe(listener: (event: PresetChangeEvent) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Exporte la timeline au format JSON.
   */
  export(): string {
    return JSON.stringify({
      version: 1,
      exportedAt: Date.now(),
      events: this.getTimeline(),
    });
  }

  /**
   * Importe une timeline depuis JSON.
   */
  import(json: string): void {
    const data = JSON.parse(json);
    if (data.version === 1 && Array.isArray(data.events)) {
      this.events = data.events;
      this.cleanup();
    }
  }

  /**
   * Vide la timeline.
   */
  clear(): void {
    this.events = [];
  }

  /**
   * Nettoie les événements trop anciens ou en excès.
   */
  private cleanup(): void {
    const now = Date.now();
    const cutoff = now - (this.config.retentionMs || 0);

    // Supprimer les événements trop anciens
    this.events = this.events.filter((e) => e.timestamp >= cutoff);

    // Limiter le nombre d'événements
    if (this.events.length > (this.config.maxEvents || 1000)) {
      this.events = this.events
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, this.config.maxEvents);
    }
  }

  /**
   * Génère un ID unique.
   */
  private generateId(): string {
    return `pce_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// ─────────────────────────────────────────────────────────
// 3. XR REPLAY — TRANSITIONS
// ─────────────────────────────────────────────────────────

/**
 * Transition de preset pour le replay XR.
 */
export interface XRPresetTransition {
  /** Preset de départ (undefined si premier) */
  from?: string;
  /** Preset d'arrivée */
  to: string;
  /** Timestamp de début de la transition */
  startedAt: number;
  /** Durée de la transition (ms) */
  duration?: number;
  /** Source du changement */
  source?: PresetChangeSource;
}

/**
 * Calcule les transitions de presets pour le replay XR.
 */
export function computePresetTransitions(
  events: PresetChangeEvent[]
): XRPresetTransition[] {
  const sorted = [...events].sort((a, b) => a.timestamp - b.timestamp);
  const transitions: XRPresetTransition[] = [];

  // Première transition (entrée)
  if (sorted.length > 0) {
    transitions.push({
      from: undefined,
      to: sorted[0].presetId,
      startedAt: sorted[0].timestamp,
      source: sorted[0].source,
    });
  }

  // Transitions suivantes
  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const curr = sorted[i];

    transitions.push({
      from: prev.presetId,
      to: curr.presetId,
      startedAt: curr.timestamp,
      duration: curr.timestamp - prev.timestamp,
      source: curr.source,
    });
  }

  return transitions;
}

/**
 * Obtient le preset actif à un moment donné.
 * Utilisé par XR pour jouer les auras dans le temps.
 */
export function getPresetAtTime(
  events: PresetChangeEvent[],
  time: number
): PresetChangeEvent | undefined {
  return [...events]
    .filter((e) => e.timestamp <= time)
    .sort((a, b) => b.timestamp - a.timestamp)[0];
}

/**
 * Obtient la transition active à un moment donné.
 */
export function getTransitionAtTime(
  transitions: XRPresetTransition[],
  time: number
): XRPresetTransition | undefined {
  return [...transitions]
    .filter((t) => t.startedAt <= time)
    .sort((a, b) => b.startedAt - a.startedAt)[0];
}

/**
 * Calcule la progression d'une transition (0-1).
 */
export function getTransitionProgress(
  transition: XRPresetTransition,
  currentTime: number,
  transitionDurationMs: number = 1000
): number {
  const elapsed = currentTime - transition.startedAt;
  return Math.min(1, Math.max(0, elapsed / transitionDurationMs));
}

// ─────────────────────────────────────────────────────────
// 4. ANALYTICS D'EFFICACITÉ
// ─────────────────────────────────────────────────────────

/**
 * Calcule les métriques d'utilisation des presets.
 */
export function computePresetMetrics(
  events: PresetChangeEvent[]
): PresetUsageMetrics[] {
  const sorted = [...events].sort((a, b) => a.timestamp - b.timestamp);
  const map: Record<string, PresetUsageMetrics> = {};

  for (let i = 0; i < sorted.length; i++) {
    const ev = sorted[i];

    if (!map[ev.presetId]) {
      map[ev.presetId] = {
        presetId: ev.presetId,
        totalActivations: 0,
        totalDurationMs: 0,
        acceptedSuggestions: 0,
        ignoredSuggestions: 0,
      };
    }

    const metrics = map[ev.presetId];
    metrics.totalActivations += 1;

    // Compter les suggestions acceptées (non-manual)
    if (ev.source !== 'manual') {
      metrics.acceptedSuggestions += 1;
    }

    // Calculer la durée jusqu'au prochain événement
    const next = sorted[i + 1];
    if (next) {
      metrics.totalDurationMs += next.timestamp - ev.timestamp;
    }
  }

  // Calculer les métriques dérivées
  return Object.values(map).map((m) => ({
    ...m,
    avgDurationMs:
      m.totalActivations > 0 ? m.totalDurationMs / m.totalActivations : 0,
    acceptanceRate:
      m.totalActivations > 0 ? m.acceptedSuggestions / m.totalActivations : 0,
  }));
}

/**
 * Calcule les métriques globales.
 */
export function computeGlobalMetrics(events: PresetChangeEvent[]): {
  totalEvents: number;
  uniquePresets: number;
  manualChanges: number;
  suggestedChanges: number;
  acceptanceRate: number;
  avgSessionDurationMs: number;
} {
  const uniquePresets = new Set(events.map((e) => e.presetId)).size;
  const manualChanges = events.filter((e) => e.source === 'manual').length;
  const suggestedChanges = events.filter((e) => e.source !== 'manual').length;

  const sorted = [...events].sort((a, b) => a.timestamp - b.timestamp);
  let totalDuration = 0;
  for (let i = 1; i < sorted.length; i++) {
    totalDuration += sorted[i].timestamp - sorted[i - 1].timestamp;
  }

  return {
    totalEvents: events.length,
    uniquePresets,
    manualChanges,
    suggestedChanges,
    acceptanceRate: events.length > 0 ? suggestedChanges / events.length : 0,
    avgSessionDurationMs: events.length > 1 ? totalDuration / (events.length - 1) : 0,
  };
}

/**
 * Obtient les presets les plus utilisés.
 */
export function getTopPresets(
  metrics: PresetUsageMetrics[],
  limit: number = 5
): PresetUsageMetrics[] {
  return [...metrics]
    .sort((a, b) => b.totalActivations - a.totalActivations)
    .slice(0, limit);
}

/**
 * Obtient les presets avec la plus longue durée.
 */
export function getLongestUsedPresets(
  metrics: PresetUsageMetrics[],
  limit: number = 5
): PresetUsageMetrics[] {
  return [...metrics]
    .sort((a, b) => b.totalDurationMs - a.totalDurationMs)
    .slice(0, limit);
}

/**
 * Analyse les patterns de changement par source.
 */
export function analyzeChangePatterns(
  events: PresetChangeEvent[]
): Record<PresetChangeSource, number> {
  const patterns: Record<PresetChangeSource, number> = {
    manual: 0,
    role: 0,
    phase: 0,
    project: 0,
    sphere: 0,
    agent: 0,
  };

  for (const event of events) {
    patterns[event.source] += 1;
  }

  return patterns;
}

/**
 * Analyse les transitions fréquentes (from → to).
 */
export function analyzeTransitionPatterns(
  events: PresetChangeEvent[]
): Map<string, number> {
  const sorted = [...events].sort((a, b) => a.timestamp - b.timestamp);
  const patterns = new Map<string, number>();

  for (let i = 1; i < sorted.length; i++) {
    const key = `${sorted[i - 1].presetId} → ${sorted[i].presetId}`;
    patterns.set(key, (patterns.get(key) || 0) + 1);
  }

  return patterns;
}

// ─────────────────────────────────────────────────────────
// 5. SINGLETON GLOBAL TIMELINE
// ─────────────────────────────────────────────────────────

/**
 * Instance globale de la timeline (optionnelle).
 */
let globalTimeline: PresetTimeline | null = null;

/**
 * Obtient ou crée la timeline globale.
 */
export function getGlobalTimeline(
  config?: PresetTimelineConfig
): PresetTimeline {
  if (!globalTimeline) {
    globalTimeline = new PresetTimeline(config);
  }
  return globalTimeline;
}

/**
 * Réinitialise la timeline globale.
 */
export function resetGlobalTimeline(): void {
  globalTimeline = null;
}

// ─────────────────────────────────────────────────────────
// 6. RÈGLES D'OR
// ─────────────────────────────────────────────────────────

/**
 * RÈGLES D'OR DE L'OBSERVABILITÉ:
 * 
 * 1. Timeline = vérité, lecture seule
 *    → L'historique ne peut pas être modifié après coup
 * 
 * 2. Les transitions XR sont dérivées, jamais écrites
 *    → Calculées à la volée depuis la timeline
 * 
 * 3. Les métriques servent à observer, pas juger
 *    → Pas de scoring normatif, juste des faits
 * 
 * 4. Aucun algorithme de scoring n'est normatif
 *    → Les données informent, l'humain décide
 * 
 * 5. Compatible 2D, 3D, XR
 *    → Même données, affichage adapté
 */
export const OBSERVABILITY_GOLDEN_RULES = [
  'Timeline = vérité, lecture seule',
  'Les transitions XR sont dérivées, jamais écrites',
  'Les métriques servent à observer, pas juger',
  'Aucun algorithme de scoring n\'est normatif',
  'Compatible 2D, 3D, XR',
] as const;
