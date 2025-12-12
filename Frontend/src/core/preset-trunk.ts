/* =========================================
   CHE·NU — PRESET TRUNK (FINAL)
   
   Version finale et canonique du preset system.
   Timeline • XR Visual • Replay • Metrics • Explain
   
   ~80 lignes. Zéro dépendance. Maximum clarté.
   ========================================= */

// ─────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────

/**
 * Source d'un changement de preset.
 */
export type PresetSource =
  | 'manual'
  | 'role'
  | 'phase'
  | 'project'
  | 'sphere'
  | 'agent';

/**
 * Événement de changement de preset.
 * Compact: t=timestamp, p=presetId, s=source
 */
export interface PresetChange {
  /** Timestamp */
  t: number;
  /** Preset ID */
  p: string;
  /** Source */
  s: PresetSource;
}

/**
 * Configuration visuelle d'une aura XR.
 */
export interface PresetAuraConfig {
  color: string;
  radius: number;
}

/**
 * Transition de preset.
 */
export interface PresetTransition {
  from: string;
  to: string;
  at: number;
}

/**
 * Métrique d'un preset.
 * c=count, d=duration
 */
export interface PresetMetricData {
  c: number;
  d: number;
}

// ─────────────────────────────────────────
// TRUTH (Timeline)
// ─────────────────────────────────────────

/**
 * Timeline globale. Source de vérité unique.
 * Write once. Never modify.
 */
export const PresetTimeline: PresetChange[] = [];

/**
 * Ajoute un changement à la timeline.
 */
export const addPresetChange = (e: PresetChange): void => {
  PresetTimeline.push(e);
};

/**
 * Raccourci pour créer et ajouter.
 */
export const recordPreset = (
  presetId: string,
  source: PresetSource
): PresetChange => {
  const e: PresetChange = { t: Date.now(), p: presetId, s: source };
  addPresetChange(e);
  return e;
};

/**
 * Preset actif actuel.
 */
export const currentPreset = (): string | undefined =>
  PresetTimeline[PresetTimeline.length - 1]?.p;

/**
 * Vide la timeline (pour tests uniquement).
 */
export const clearTimeline = (): void => {
  PresetTimeline.length = 0;
};

// ─────────────────────────────────────────
// XR VISUAL (Auras)
// ─────────────────────────────────────────

/**
 * Configuration visuelle des auras par preset.
 * XR lit UNIQUEMENT ceci pour afficher les auras.
 */
export const PresetAura: Record<string, PresetAuraConfig> = {
  focus:       { color: '#4A90E2', radius: 1.2 },
  exploration: { color: '#8E44AD', radius: 1.8 },
  audit:       { color: '#27AE60', radius: 1.5 },
  meeting:     { color: '#F39C12', radius: 2.2 },
  minimal:     { color: '#7F8C8D', radius: 0.8 },
};

/**
 * Obtient la configuration d'aura pour un preset.
 * XR appelle cette fonction pour obtenir couleur + radius.
 */
export const presetAura = (presetId?: string): PresetAuraConfig | undefined =>
  presetId ? PresetAura[presetId] : undefined;

/**
 * Ajoute ou modifie une configuration d'aura.
 */
export const setPresetAura = (
  presetId: string,
  config: PresetAuraConfig
): void => {
  PresetAura[presetId] = config;
};

// ─────────────────────────────────────────
// REPLAY (XR)
// ─────────────────────────────────────────

/**
 * Preset actif à un moment donné.
 * XR utilise ceci pour le replay temporel.
 */
export const presetAt = (time: number): PresetChange | undefined =>
  [...PresetTimeline].reverse().find((e) => e.t <= time);

/**
 * Toutes les transitions.
 * XR iterate + visualise les auras dans le temps.
 */
export const transitions = (): PresetTransition[] =>
  PresetTimeline.slice(1).map((e, i) => ({
    from: PresetTimeline[i].p,
    to: e.p,
    at: e.t,
  }));

/**
 * Transition à un moment donné.
 */
export const transitionAt = (time: number): PresetTransition | undefined =>
  [...transitions()].reverse().find((t) => t.at <= time);

// ─────────────────────────────────────────
// METRICS (Observer)
// ─────────────────────────────────────────

/**
 * Métriques par preset.
 * c = count (activations), d = duration (ms)
 */
export const presetMetrics = (): Record<string, PresetMetricData> => {
  const m: Record<string, PresetMetricData> = {};
  
  PresetTimeline.forEach((e, i) => {
    m[e.p] ??= { c: 0, d: 0 };
    m[e.p].c++;
    
    if (PresetTimeline[i + 1]) {
      m[e.p].d += PresetTimeline[i + 1].t - e.t;
    }
  });
  
  return m;
};

/**
 * Top N presets par activations.
 */
export const topPresets = (n: number = 5): string[] =>
  Object.entries(presetMetrics())
    .sort(([, a], [, b]) => b.c - a.c)
    .slice(0, n)
    .map(([id]) => id);

/**
 * Comptage par source.
 */
export const sourceCount = (): Record<PresetSource, number> => {
  const counts: Record<PresetSource, number> = {
    manual: 0,
    role: 0,
    phase: 0,
    project: 0,
    sphere: 0,
    agent: 0,
  };
  
  PresetTimeline.forEach((e) => counts[e.s]++);
  
  return counts;
};

// ─────────────────────────────────────────
// EXPLAIN (Traçabilité)
// ─────────────────────────────────────────

/**
 * Explique un changement de preset en langage naturel.
 * Utilisé pour l'UI et les logs.
 */
export const explainPreset = (e: PresetChange): string =>
  `Preset "${e.p}" applied via ${e.s}.`;

/**
 * Explique le preset actuel.
 */
export const explainCurrent = (): string | undefined => {
  const last = PresetTimeline[PresetTimeline.length - 1];
  return last ? explainPreset(last) : undefined;
};

/**
 * Génère un résumé de la session.
 */
export const sessionSummary = (): string => {
  const metrics = presetMetrics();
  const total = PresetTimeline.length;
  const presets = Object.keys(metrics).length;
  
  return `Session: ${total} changes across ${presets} presets.`;
};

// ─────────────────────────────────────────
// LAWS (Inviolables)
// ─────────────────────────────────────────

/**
 * LOIS DU PRESET SYSTEM:
 * 
 * 1. Timeline = vérité
 *    → Source unique, jamais modifiée après écriture
 * 
 * 2. XR = visualisation, jamais décision
 *    → L'aura montre, elle ne choisit pas
 * 
 * 3. Metrics = observation, jamais jugement
 *    → Les données informent, pas évaluent
 * 
 * 4. Aucun preset n'est automatique
 *    → Toujours suggéré, jamais forcé
 * 
 * 5. Humain garde toujours le contrôle
 *    → Le système sert, l'humain décide
 */
export const PRESET_LAWS = [
  'Timeline = vérité',
  'XR = visualisation, jamais décision',
  'Metrics = observation, jamais jugement',
  'Aucun preset n\'est automatique',
  'Humain garde toujours le contrôle',
] as const;
