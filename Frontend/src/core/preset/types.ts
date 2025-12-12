/* =========================================
   CHE·NU — PRESET TYPES (Single Source of Truth)
   
   TOUS les autres fichiers importent depuis ici.
   NE JAMAIS dupliquer ces types ailleurs.
   
   📜 Les 5 Lois des Presets:
   1. Timeline = vérité absolue
   2. XR = visualisation, jamais décision
   3. Metrics = observation, jamais jugement
   4. Aucun preset automatique
   5. Humain > système, toujours
   ========================================= */

// === SOURCE ===

export type PresetSource =
  | 'manual'    // Choix explicite utilisateur
  | 'role'      // Changement de rôle
  | 'phase'     // Changement de phase projet
  | 'project'   // Changement de projet
  | 'sphere'    // Changement de sphère
  | 'agent';    // Suggestion agent acceptée

// === CHANGE EVENT ===

export interface PresetChange {
  /** Timestamp du changement (ms) */
  t: number;
  /** ID du preset */
  p: string;
  /** Source du changement */
  s: PresetSource;
  /** Contexte optionnel */
  ctx?: PresetContext;
}

export interface PresetContext {
  role?: string;
  phase?: string;
  project?: string;
  sphere?: string;
  agentId?: string;
  reason?: string;
  userId?: string;
}

// === AURA (XR Visualization) ===

export type AuraAnimation = 
  | 'static' 
  | 'pulse' 
  | 'wave' 
  | 'breathe' 
  | 'shimmer'
  | 'orbit';

export interface PresetAuraConfig {
  /** Couleur principale (hex) */
  color: string;
  /** Rayon de l'aura */
  radius: number;
  /** Type d'animation */
  animation?: AuraAnimation;
  /** Intensité (0-1) */
  intensity?: number;
  /** Particules activées */
  particles?: boolean;
  /** Vitesse animation */
  speed?: number;
}

// === METRICS ===

export interface PresetMetric {
  /** ID du preset */
  presetId: string;
  /** Nombre d'activations */
  count: number;
  /** Durée totale d'utilisation (ms) */
  durationMs: number;
  /** Durée moyenne par session (ms) */
  avgDurationMs?: number;
  /** Taux d'acceptation si suggéré (0-1) */
  acceptanceRate?: number;
  /** Dernière utilisation */
  lastUsedAt?: number;
}

// === TRANSITION ===

export interface PresetTransition {
  /** Preset de départ */
  from: string;
  /** Preset d'arrivée */
  to: string;
  /** Timestamp de la transition */
  at: number;
  /** Durée de l'animation (ms) */
  duration?: number;
  /** Source de la transition */
  source?: PresetSource;
}

// === RESOLUTION (Fusion Engine) ===

export interface PresetResolution {
  /** Preset résolu final */
  preset: PresetConfig;
  /** Raisons de la suggestion */
  reasons: string[];
  /** Source de la résolution */
  source: PresetSource;
  /** Timestamp de la résolution */
  timestamp: number;
  /** Confiance (0-1) */
  confidence?: number;
}

export interface PresetConfig {
  /** Identifiant unique */
  id: string;
  /** Label affichable */
  label: string;
  /** Description */
  description?: string;
  /** Niveau de densité UI */
  density: PresetDensity;
  /** Configuration XR */
  xr: PresetXRConfig;
  /** Tags pour recherche */
  tags?: string[];
}

export type PresetDensity = 'minimal' | 'balanced' | 'rich' | 'immersive';

export interface PresetXRConfig {
  /** XR activé pour ce preset */
  enabled: boolean;
  /** Configuration de l'aura */
  aura?: PresetAuraConfig;
  /** Mode 3D préféré */
  mode?: '2d' | '3d' | 'xr';
}

// === SUGGESTION ===

export interface PresetSuggestion {
  /** Preset suggéré */
  preset: PresetConfig;
  /** Raisons de la suggestion */
  reasons: string[];
  /** Score de confiance (0-1) */
  confidence: number;
  /** Source de la suggestion */
  source: PresetSource;
  /** Expiration de la suggestion */
  expiresAt?: number;
}

// === TIMELINE CONFIG ===

export interface PresetTimelineConfig {
  /** Taille max du buffer */
  maxSize?: number;
  /** Persistence activée */
  persist?: boolean;
  /** Clé de stockage */
  storageKey?: string;
  /** Callbacks */
  onAdd?: (change: PresetChange) => void;
  onClear?: () => void;
}

// === LAWS (Immuables - NEVER MODIFY) ===

export const PRESET_LAWS = [
  'Timeline = vérité absolue',
  'XR = visualisation, jamais décision',
  'Metrics = observation, jamais jugement',
  'Aucun preset automatique',
  'Humain > système, toujours',
] as const;

export type PresetLaw = typeof PRESET_LAWS[number];

// === PRIORITY ORDER ===

export const PRESET_PRIORITY: PresetSource[] = [
  'manual',   // 1. Plus haute priorité
  'project',  // 2. Contexte projet
  'sphere',   // 3. Contexte sphère
  'phase',    // 4. Phase actuelle
  'role',     // 5. Rôle utilisateur
  'agent',    // 6. Plus basse priorité
];

// === DEFAULT PRESETS ===

export const DEFAULT_PRESETS: Record<string, PresetConfig> = {
  focus: {
    id: 'focus',
    label: 'Focus',
    description: 'Concentration maximale, distractions minimales',
    density: 'minimal',
    xr: {
      enabled: true,
      aura: { color: '#4A90E2', radius: 1.2, animation: 'static' },
    },
    tags: ['concentration', 'travail', 'productivité'],
  },
  exploration: {
    id: 'exploration',
    label: 'Exploration',
    description: 'Découverte et navigation libre',
    density: 'rich',
    xr: {
      enabled: true,
      aura: { color: '#8E44AD', radius: 1.8, animation: 'pulse' },
    },
    tags: ['découverte', 'navigation', 'recherche'],
  },
  audit: {
    id: 'audit',
    label: 'Audit',
    description: 'Vérification et traçabilité complète',
    density: 'rich',
    xr: {
      enabled: true,
      aura: { color: '#27AE60', radius: 1.5, animation: 'wave' },
    },
    tags: ['vérification', 'compliance', 'historique'],
  },
  meeting: {
    id: 'meeting',
    label: 'Réunion',
    description: 'Collaboration et prise de décision',
    density: 'balanced',
    xr: {
      enabled: true,
      aura: { color: '#F39C12', radius: 2.2, animation: 'breathe' },
    },
    tags: ['collaboration', 'décision', 'équipe'],
  },
  minimal: {
    id: 'minimal',
    label: 'Minimal',
    description: 'Interface épurée au maximum',
    density: 'minimal',
    xr: {
      enabled: false,
      aura: { color: '#7F8C8D', radius: 0.8, animation: 'static' },
    },
    tags: ['simple', 'léger', 'rapide'],
  },
};

// === TYPE GUARDS ===

export function isPresetSource(value: unknown): value is PresetSource {
  return (
    typeof value === 'string' &&
    ['manual', 'role', 'phase', 'project', 'sphere', 'agent'].includes(value)
  );
}

export function isPresetChange(value: unknown): value is PresetChange {
  if (!value || typeof value !== 'object') return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.t === 'number' &&
    typeof obj.p === 'string' &&
    isPresetSource(obj.s)
  );
}

export function isPresetConfig(value: unknown): value is PresetConfig {
  if (!value || typeof value !== 'object') return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.id === 'string' &&
    typeof obj.label === 'string' &&
    typeof obj.density === 'string' &&
    obj.xr !== undefined
  );
}
