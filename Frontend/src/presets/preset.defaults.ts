/* =====================================================
   CHE·NU — Preset Defaults
   
   Core system presets and factory functions.
   ===================================================== */

import {
  CheNuPreset,
  PresetCategory,
  PresetPriority,
  PresetState,
  PresetCondition,
  PersonalizationPatch,
} from './preset.types';

// ─────────────────────────────────────────────────────
// CORE PRESETS
// ─────────────────────────────────────────────────────

/**
 * Built-in system presets.
 */
export const CORE_PRESETS: CheNuPreset[] = [
  // ─── Focus Mode ───
  {
    id: 'focus',
    label: 'Focus',
    labelI18n: { 'fr-CA': 'Concentration' },
    description: 'Minimal distractions, critical information only.',
    descriptionI18n: { 'fr-CA': 'Distractions minimales, informations critiques seulement.' },
    category: 'core',
    icon: '🎯',
    color: '#f97316',
    conditions: [
      { type: 'duration', minMinutes: 45 },
      { type: 'activity', activity: 'deep_work' },
    ],
    conditionMode: 'any',
    priority: 'high',
    personalizationPatch: {
      density: 'minimal',
      xr: {
        enabled: false,
        ambiance: 'focused',
        particleEffects: false,
        bloomEffect: false,
      },
      ui: {
        compactMode: true,
        showMinimap: false,
      },
      notifications: {
        urgentOnly: true,
      },
    },
    isSystem: true,
    autoActivate: false,
  },

  // ─── Exploration Mode ───
  {
    id: 'exploration',
    label: 'Exploration',
    labelI18n: { 'fr-CA': 'Exploration' },
    description: 'Discover spheres, connections and context.',
    descriptionI18n: { 'fr-CA': 'Découvrez les sphères, connexions et contextes.' },
    category: 'core',
    icon: '🔮',
    color: '#8b5cf6',
    conditions: [
      { type: 'device', capability: 'xr', required: true },
    ],
    conditionMode: 'all',
    priority: 'medium',
    personalizationPatch: {
      density: 'rich',
      themeGlobal: 'cosmic',
      xr: {
        enabled: true,
        ambiance: 'cosmic',
        particleEffects: true,
        bloomEffect: true,
        qualityLevel: 'high',
      },
      ui: {
        showMinimap: true,
        showBreadcrumbs: true,
      },
    },
    isSystem: true,
    autoActivate: false,
  },

  // ─── Audit / Review Mode ───
  {
    id: 'audit',
    label: 'Audit / Review',
    labelI18n: { 'fr-CA': 'Audit / Révision' },
    description: 'Traceability, timelines and decision clarity.',
    descriptionI18n: { 'fr-CA': 'Traçabilité, chronologies et clarté décisionnelle.' },
    category: 'core',
    icon: '📋',
    color: '#22c55e',
    conditions: [
      { type: 'activity', activity: 'review' },
      { type: 'sphere', sphereId: 'business' },
    ],
    conditionMode: 'any',
    priority: 'medium',
    personalizationPatch: {
      density: 'balanced',
      themeGlobal: 'realistic',
      ui: {
        showBreadcrumbs: true,
        compactMode: false,
      },
      notifications: {
        decisionDeadlines: true,
      },
    },
    isSystem: true,
    autoActivate: false,
  },

  // ─── Meeting Mode ───
  {
    id: 'meeting',
    label: 'Meeting',
    labelI18n: { 'fr-CA': 'Réunion' },
    description: 'Collaborative and structured space.',
    descriptionI18n: { 'fr-CA': 'Espace collaboratif et structuré.' },
    category: 'core',
    icon: '👥',
    color: '#3b82f6',
    conditions: [
      { type: 'activity', activity: 'meeting_start' },
    ],
    conditionMode: 'all',
    priority: 'critical',
    personalizationPatch: {
      density: 'balanced',
      xr: {
        enabled: true,
        ambiance: 'focused',
        showAvatars: true,
        voiceEnabled: true,
        gesturesEnabled: true,
      },
      notifications: {
        meetingReminders: true,
        sound: false, // Mute during meeting
      },
    },
    isSystem: true,
    autoActivate: true,
  },

  // ─── Presentation Mode ───
  {
    id: 'presentation',
    label: 'Presentation',
    labelI18n: { 'fr-CA': 'Présentation' },
    description: 'Clean visuals for presenting to others.',
    descriptionI18n: { 'fr-CA': 'Visuels épurés pour présentation.' },
    category: 'core',
    icon: '📊',
    color: '#ec4899',
    conditions: [
      { type: 'activity', activity: 'presentation' },
    ],
    conditionMode: 'all',
    priority: 'high',
    personalizationPatch: {
      density: 'minimal',
      themeGlobal: 'futurist',
      ui: {
        sidebarPosition: 'hidden',
        showMinimap: false,
        fontSize: 'large',
      },
      notifications: {
        enabled: false,
      },
    },
    isSystem: true,
    autoActivate: false,
  },

  // ─── Night Mode ───
  {
    id: 'night',
    label: 'Night Mode',
    labelI18n: { 'fr-CA': 'Mode Nuit' },
    description: 'Reduced brightness for evening work.',
    descriptionI18n: { 'fr-CA': 'Luminosité réduite pour le travail en soirée.' },
    category: 'core',
    icon: '🌙',
    color: '#6366f1',
    conditions: [
      { type: 'time', startTime: '21:00', endTime: '06:00' },
    ],
    conditionMode: 'all',
    priority: 'low',
    personalizationPatch: {
      themeGlobal: 'cosmic',
      xr: {
        ambiance: 'calm',
        bloomEffect: false,
      },
      ui: {
        reducedMotion: true,
      },
      notifications: {
        quietHoursEnabled: true,
        quietHoursStart: '21:00',
        quietHoursEnd: '07:00',
      },
    },
    isSystem: true,
    autoActivate: true,
  },

  // ─── Mobile Mode ───
  {
    id: 'mobile',
    label: 'Mobile',
    labelI18n: { 'fr-CA': 'Mobile' },
    description: 'Optimized for small screens and touch.',
    descriptionI18n: { 'fr-CA': 'Optimisé pour petits écrans et tactile.' },
    category: 'core',
    icon: '📱',
    color: '#14b8a6',
    conditions: [
      { type: 'device', capability: 'mobile', required: true },
    ],
    conditionMode: 'all',
    priority: 'high',
    personalizationPatch: {
      density: 'minimal',
      xr: {
        enabled: false,
      },
      ui: {
        compactMode: true,
        sidebarPosition: 'hidden',
        fontSize: 'medium',
      },
    },
    isSystem: true,
    autoActivate: true,
  },

  // ─── Accessible Mode ───
  {
    id: 'accessible',
    label: 'Accessible',
    labelI18n: { 'fr-CA': 'Accessible' },
    description: 'High contrast and reduced motion.',
    descriptionI18n: { 'fr-CA': 'Contraste élevé et mouvement réduit.' },
    category: 'core',
    icon: '♿',
    color: '#0ea5e9',
    conditions: [
      { type: 'manual' },
    ],
    conditionMode: 'all',
    priority: 'critical',
    personalizationPatch: {
      density: 'balanced',
      ui: {
        highContrast: true,
        reducedMotion: true,
        fontSize: 'large',
        transitionSpeed: 'slow',
        screenReaderOptimized: true,
      },
      xr: {
        teleportOnly: true,
        snapTurning: true,
        vignetteOnMove: true,
      },
    },
    isSystem: true,
    autoActivate: false,
  },
];

// ─────────────────────────────────────────────────────
// WORK PRESETS
// ─────────────────────────────────────────────────────

/**
 * Work-related presets (can be customized).
 */
export const WORK_PRESETS: CheNuPreset[] = [
  {
    id: 'morning-standup',
    label: 'Morning Standup',
    labelI18n: { 'fr-CA': 'Standup du matin' },
    description: 'Quick daily sync with team.',
    descriptionI18n: { 'fr-CA': 'Sync quotidien rapide avec l\'équipe.' },
    category: 'work',
    icon: '☀️',
    color: '#fbbf24',
    conditions: [
      { type: 'time', startTime: '09:00', endTime: '10:00', daysOfWeek: [1, 2, 3, 4, 5] },
    ],
    conditionMode: 'all',
    priority: 'medium',
    personalizationPatch: {
      density: 'minimal',
      xr: {
        enabled: true,
        ambiance: 'focused',
      },
    },
    isSystem: false,
    autoActivate: false,
  },

  {
    id: 'construction-site',
    label: 'Construction Site',
    labelI18n: { 'fr-CA': 'Chantier' },
    description: 'Field work mode with essential info.',
    descriptionI18n: { 'fr-CA': 'Mode terrain avec infos essentielles.' },
    category: 'work',
    icon: '🏗️',
    color: '#f59e0b',
    conditions: [
      { type: 'device', capability: 'mobile', required: true },
      { type: 'sphere', sphereId: 'business' },
    ],
    conditionMode: 'all',
    priority: 'high',
    personalizationPatch: {
      density: 'minimal',
      themeGlobal: 'realistic',
      ui: {
        compactMode: true,
        fontSize: 'large',
      },
      notifications: {
        sound: true,
        vibration: true,
      },
    },
    isSystem: false,
    autoActivate: false,
  },

  {
    id: 'client-presentation',
    label: 'Client Presentation',
    labelI18n: { 'fr-CA': 'Présentation client' },
    description: 'Professional display for clients.',
    descriptionI18n: { 'fr-CA': 'Affichage professionnel pour clients.' },
    category: 'work',
    icon: '💼',
    color: '#1e40af',
    conditions: [
      { type: 'manual' },
    ],
    conditionMode: 'all',
    priority: 'high',
    personalizationPatch: {
      density: 'balanced',
      themeGlobal: 'futurist',
      ui: {
        sidebarPosition: 'hidden',
        showBreadcrumbs: false,
      },
      notifications: {
        enabled: false,
      },
    },
    isSystem: false,
    autoActivate: false,
  },
];

// ─────────────────────────────────────────────────────
// XR PRESETS
// ─────────────────────────────────────────────────────

/**
 * XR-specific presets.
 */
export const XR_PRESETS: CheNuPreset[] = [
  {
    id: 'xr-immersive',
    label: 'XR Immersive',
    labelI18n: { 'fr-CA': 'XR Immersif' },
    description: 'Full immersive VR experience.',
    descriptionI18n: { 'fr-CA': 'Expérience VR totalement immersive.' },
    category: 'xr',
    icon: '🥽',
    color: '#7c3aed',
    conditions: [
      { type: 'device', capability: 'xr', required: true },
    ],
    conditionMode: 'all',
    priority: 'medium',
    personalizationPatch: {
      density: 'rich',
      themeGlobal: 'cosmic',
      xr: {
        enabled: true,
        ambiance: 'cosmic',
        showHands: true,
        showAvatars: true,
        particleEffects: true,
        bloomEffect: true,
        gesturesEnabled: true,
        voiceEnabled: true,
        hapticFeedback: true,
        qualityLevel: 'ultra',
      },
    },
    isSystem: false,
    autoActivate: false,
  },

  {
    id: 'xr-comfort',
    label: 'XR Comfort',
    labelI18n: { 'fr-CA': 'XR Confort' },
    description: 'Reduced motion for VR comfort.',
    descriptionI18n: { 'fr-CA': 'Mouvement réduit pour confort VR.' },
    category: 'xr',
    icon: '🛋️',
    color: '#10b981',
    conditions: [
      { type: 'device', capability: 'xr', required: true },
    ],
    conditionMode: 'all',
    priority: 'medium',
    personalizationPatch: {
      xr: {
        enabled: true,
        ambiance: 'calm',
        teleportOnly: true,
        snapTurning: true,
        vignetteOnMove: true,
        particleEffects: false,
        bloomEffect: false,
        qualityLevel: 'medium',
      },
      ui: {
        reducedMotion: true,
        transitionSpeed: 'slow',
      },
    },
    isSystem: false,
    autoActivate: false,
  },
];

// ─────────────────────────────────────────────────────
// ALL DEFAULT PRESETS
// ─────────────────────────────────────────────────────

/**
 * All default presets combined.
 */
export const DEFAULT_PRESETS: CheNuPreset[] = [
  ...CORE_PRESETS,
  ...WORK_PRESETS,
  ...XR_PRESETS,
];

// ─────────────────────────────────────────────────────
// DEFAULT STATE
// ─────────────────────────────────────────────────────

/**
 * Default preset system state.
 */
export const DEFAULT_PRESET_STATE: PresetState = {
  presets: DEFAULT_PRESETS,
  activePresetId: null,
  previousPersonalization: null,
  history: [],
  maxHistorySize: 50,
  autoSuggestEnabled: true,
  favorites: ['focus', 'meeting'],
};

// ─────────────────────────────────────────────────────
// FACTORY FUNCTIONS
// ─────────────────────────────────────────────────────

/**
 * Create a new custom preset.
 */
export function createPreset(
  partial: Partial<CheNuPreset> & Pick<CheNuPreset, 'id' | 'label' | 'personalizationPatch'>
): CheNuPreset {
  return {
    description: '',
    category: 'custom',
    conditions: [{ type: 'manual' }],
    conditionMode: 'all',
    priority: 'medium',
    isSystem: false,
    autoActivate: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...partial,
  };
}

/**
 * Clone an existing preset with a new ID.
 */
export function clonePreset(
  source: CheNuPreset,
  newId: string,
  overrides?: Partial<CheNuPreset>
): CheNuPreset {
  return {
    ...source,
    id: newId,
    label: `${source.label} (Copy)`,
    isSystem: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...overrides,
  };
}

/**
 * Get preset by ID from list.
 */
export function getPresetById(
  presets: CheNuPreset[],
  id: string
): CheNuPreset | undefined {
  return presets.find(p => p.id === id);
}

/**
 * Get presets by category.
 */
export function getPresetsByCategory(
  presets: CheNuPreset[],
  category: PresetCategory
): CheNuPreset[] {
  return presets.filter(p => p.category === category);
}

/**
 * Get system presets only.
 */
export function getSystemPresets(presets: CheNuPreset[]): CheNuPreset[] {
  return presets.filter(p => p.isSystem);
}

/**
 * Get custom presets only.
 */
export function getCustomPresets(presets: CheNuPreset[]): CheNuPreset[] {
  return presets.filter(p => !p.isSystem);
}

/**
 * Get auto-activatable presets.
 */
export function getAutoPresets(presets: CheNuPreset[]): CheNuPreset[] {
  return presets.filter(p => p.autoActivate);
}
