/* =====================================================
   CHE·NU — Personalization Defaults
   
   Default configuration values for new users.
   ===================================================== */

import {
  CheNuPersonalization,
  DEFAULT_XR_PERSONALIZATION,
  DEFAULT_UI_PERSONALIZATION,
  DEFAULT_NOTIFICATION_PERSONALIZATION,
  DEFAULT_SHORTCUTS,
} from './personalization.types';

// ─────────────────────────────────────────────────────
// DEFAULT PERSONALIZATION
// ─────────────────────────────────────────────────────

export const DEFAULT_PERSONALIZATION: CheNuPersonalization = {
  version: 1,

  // Global
  themeGlobal: "realistic",
  density: "balanced",
  language: "fr-CA",

  // Collections (empty by default, populated as user interacts)
  spheres: [],
  agents: [],

  // Modules
  xr: DEFAULT_XR_PERSONALIZATION,
  ui: DEFAULT_UI_PERSONALIZATION,
  notifications: DEFAULT_NOTIFICATION_PERSONALIZATION,
  shortcuts: DEFAULT_SHORTCUTS,

  // Metadata
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

// ─────────────────────────────────────────────────────
// THEME PRESETS
// ─────────────────────────────────────────────────────

export interface PersonalizationPreset {
  id: string;
  name: string;
  description: string;
  values: Partial<CheNuPersonalization>;
}

export const PRESETS: PersonalizationPreset[] = [
  {
    id: "minimal",
    name: "Minimaliste",
    description: "Interface épurée, focus sur l'essentiel",
    values: {
      themeGlobal: "realistic",
      density: "minimal",
      ui: {
        ...DEFAULT_UI_PERSONALIZATION,
        compactMode: true,
        showMinimap: false,
        transitionSpeed: "fast",
      },
      xr: {
        ...DEFAULT_XR_PERSONALIZATION,
        particleEffects: false,
        bloomEffect: false,
        ambiance: "minimal",
      },
    },
  },
  {
    id: "immersive",
    name: "Immersif",
    description: "Expérience riche et détaillée",
    values: {
      themeGlobal: "cosmic",
      density: "rich",
      ui: {
        ...DEFAULT_UI_PERSONALIZATION,
        showMinimap: true,
        transitionSpeed: "normal",
      },
      xr: {
        ...DEFAULT_XR_PERSONALIZATION,
        enabled: true,
        particleEffects: true,
        bloomEffect: true,
        ambiance: "cosmic",
        qualityLevel: "high",
      },
    },
  },
  {
    id: "professional",
    name: "Professionnel",
    description: "Configuration optimisée pour le travail",
    values: {
      themeGlobal: "futurist",
      density: "balanced",
      ui: {
        ...DEFAULT_UI_PERSONALIZATION,
        sidebarPosition: "left",
        compactMode: false,
      },
      notifications: {
        ...DEFAULT_NOTIFICATION_PERSONALIZATION,
        meetingReminders: true,
        decisionDeadlines: true,
        agentRecommendations: true,
      },
    },
  },
  {
    id: "accessible",
    name: "Accessible",
    description: "Optimisé pour l'accessibilité",
    values: {
      themeGlobal: "realistic",
      density: "balanced",
      ui: {
        ...DEFAULT_UI_PERSONALIZATION,
        reducedMotion: true,
        highContrast: true,
        screenReaderOptimized: true,
        fontSize: "large",
        transitionSpeed: "slow",
      },
      xr: {
        ...DEFAULT_XR_PERSONALIZATION,
        teleportOnly: true,
        snapTurning: true,
        vignetteOnMove: true,
      },
    },
  },
  {
    id: "nature",
    name: "Nature",
    description: "Ambiance calme et naturelle",
    values: {
      themeGlobal: "ancient",
      density: "balanced",
      xr: {
        ...DEFAULT_XR_PERSONALIZATION,
        ambiance: "nature",
        particleEffects: true,
      },
    },
  },
];

// ─────────────────────────────────────────────────────
// DENSITY CONFIGS
// ─────────────────────────────────────────────────────

export const DENSITY_CONFIGS = {
  minimal: {
    showAgentAvatars: false,
    showSphereDescriptions: false,
    showTimestamps: false,
    maxVisibleAgents: 3,
    cardPadding: 8,
    listSpacing: 4,
  },
  balanced: {
    showAgentAvatars: true,
    showSphereDescriptions: true,
    showTimestamps: true,
    maxVisibleAgents: 5,
    cardPadding: 16,
    listSpacing: 8,
  },
  rich: {
    showAgentAvatars: true,
    showSphereDescriptions: true,
    showTimestamps: true,
    maxVisibleAgents: 10,
    cardPadding: 20,
    listSpacing: 12,
    showMetadata: true,
    showStats: true,
    showHistory: true,
  },
};

// ─────────────────────────────────────────────────────
// HELPER: Create default with overrides
// ─────────────────────────────────────────────────────

export function createPersonalization(
  overrides?: Partial<CheNuPersonalization>
): CheNuPersonalization {
  const now = Date.now();
  
  return {
    ...DEFAULT_PERSONALIZATION,
    ...overrides,
    createdAt: now,
    updatedAt: now,
  };
}

// ─────────────────────────────────────────────────────
// HELPER: Apply preset
// ─────────────────────────────────────────────────────

export function applyPreset(
  current: CheNuPersonalization,
  presetId: string
): CheNuPersonalization {
  const preset = PRESETS.find(p => p.id === presetId);
  if (!preset) return current;

  return {
    ...current,
    ...preset.values,
    xr: { ...current.xr, ...preset.values.xr },
    ui: { ...current.ui, ...preset.values.ui },
    notifications: { ...current.notifications, ...preset.values.notifications },
    updatedAt: Date.now(),
  };
}

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default DEFAULT_PERSONALIZATION;
