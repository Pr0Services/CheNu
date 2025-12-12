/* =====================================================
   CHE·NU — THEME CONFIGURATION (TypeScript)
   Version: 1.0
   Scope: UI / XR / Visualization Layer
   
   📜 RULES:
   - Themes modify VISUALS only
   - Themes NEVER modify logic
   - Themes NEVER modify authority
   - Themes NEVER modify agents behavior
   - Themes NEVER modify timeline logic
   ===================================================== */

/* -------------------------
   CORE TYPES
------------------------- */

export type ThemeID =
  | 'realistic_professional'
  | 'avatar_human_centered'
  | 'ancient_builder'
  | 'cosmic_abstract'
  | 'futurist_systemic';

export type AnimationSpeed = 'very_slow' | 'slow' | 'controlled';
export type AnimationStyle = 'minimal' | 'gentle' | 'fluid' | 'precise' | 'very_slow';
export type GridStyle = 'strict' | 'soft' | 'visible' | 'none' | 'invisible';
export type AgentDominance = 'very_low' | 'low' | 'neutral';

/* -------------------------
   ANIMATION CONFIG
------------------------- */

export interface AnimationConfig {
  enabled: boolean;
  style: AnimationStyle;
  speed: AnimationSpeed;
}

/* -------------------------
   UI CONFIG
------------------------- */

export interface UIConfig {
  geometry: string;
  grid: GridStyle;
  primaryColors: [string, string, string];
  accentColor: string;
  typography: 'sans_serif_clean';
  animations: AnimationConfig;
}

/* -------------------------
   AGENT VISUAL CONFIG
------------------------- */

export interface AgentVisualConfig {
  representation: string | string[];
  shape?: string[];
  dominance?: AgentDominance;
  activityIndicator?: 'soft_pulse';
  anthropomorphic?: boolean;
  faces?: boolean;
}

/* -------------------------
   GUARD VISUAL CONFIG
------------------------- */

export interface GuardVisualConfig {
  visualStyle: 'subtle_lock' | 'shield_frame';
  alertTone?: 'neutral';
  feedback?: 'soft_pulse_with_text';
}

/* -------------------------
   AVATAR CONFIG
------------------------- */

export interface AvatarConfig {
  style: string;
  expressions: 'limited_calm';
  scale: 'human_proportion';
  personalSpace: 'respected';
}

/* -------------------------
   TIMELINE CONFIG
------------------------- */

export interface TimelineConfig {
  visualization: string;
  rollback?: string;
}

/* -------------------------
   XR CONFIG
------------------------- */

export interface XRConfig {
  environment: string;
  lighting?: string;
  panels?: string;
  ambience?: string;
  gravity?: 'none';
  referencePoint?: 'stable_center';
  motion?: 'drift';
  gestures?: 'slow';
  gaze?: 'neutral';
  horizon?: 'stable';
  particles?: boolean;
}

/* -------------------------
   THEME CONFIG
------------------------- */

export interface ThemeConfig {
  id: ThemeID;
  label: string;
  intent: string;
  ui: UIConfig;
  agents?: AgentVisualConfig;
  guards?: GuardVisualConfig;
  avatars?: AvatarConfig;
  timeline?: TimelineConfig;
  xr?: XRConfig;
}

/* =========================================================
   GLOBAL RULES
   
   📜 These rules are IMMUTABLE and CONSTITUTIONAL.
   Themes are VISUAL ONLY — they never change behavior.
   ========================================================= */

export const CHE_NU_THEME_RULES = {
  /** Themes cannot modify application logic */
  themesModifyLogic: false,
  
  /** Themes cannot modify authority structures */
  themesModifyAuthority: false,
  
  /** Themes cannot modify agent behavior */
  themesModifyAgents: false,
  
  /** Themes cannot modify timeline logic */
  themesModifyTimeline: false,
  
  /** Theme switching rules */
  themeSwitching: {
    /** Only manual switching allowed (no auto-switch) */
    manualOnly: true,
    /** Preserve session state when switching */
    preserveSession: true,
    /** Use smooth transitions between themes */
    smoothTransition: true,
  },
} as const;

export type ThemeRules = typeof CHE_NU_THEME_RULES;

/* =========================================================
   THEMES REGISTRY
   ========================================================= */

export const CHE_NU_THEMES: Record<ThemeID, ThemeConfig> = {
  /* -----------------------------------------
     REALISTIC / PROFESSIONAL
     Intent: clarity, trust, neutrality
  ----------------------------------------- */
  realistic_professional: {
    id: 'realistic_professional',
    label: 'Realistic / Professional',
    intent: 'clarity_trust_neutrality',
    ui: {
      geometry: 'rectangular_soft',
      grid: 'strict',
      primaryColors: ['#F8F9FA', '#E5E7EB', '#374151'],
      accentColor: '#2563EB',
      typography: 'sans_serif_clean',
      animations: { enabled: true, style: 'minimal', speed: 'slow' },
    },
    agents: {
      representation: 'abstract_icons',
      shape: ['circle', 'square'],
      dominance: 'low',
    },
    guards: {
      visualStyle: 'subtle_lock',
      alertTone: 'neutral',
    },
    xr: {
      environment: 'control_room',
      lighting: 'diffuse',
      panels: 'flat',
      particles: false,
    },
  },

  /* -----------------------------------------
     AVATAR / HUMAN CENTERED
     Intent: presence, relation, collaboration
  ----------------------------------------- */
  avatar_human_centered: {
    id: 'avatar_human_centered',
    label: 'Avatar / Human Centered',
    intent: 'presence_relation_collaboration',
    ui: {
      geometry: 'rounded',
      grid: 'soft',
      primaryColors: ['#F5F1EB', '#E7DED3', '#6B7280'],
      accentColor: '#8B9467',
      typography: 'sans_serif_clean',
      animations: { enabled: true, style: 'gentle', speed: 'slow' },
    },
    avatars: {
      style: 'stylized_non_realistic',
      expressions: 'limited_calm',
      scale: 'human_proportion',
      personalSpace: 'respected',
    },
    agents: {
      representation: 'presence_based',
      dominance: 'very_low',
    },
    xr: {
      environment: 'circular_room',
      lighting: 'warm_diffuse',
      gestures: 'slow',
      gaze: 'neutral',
    },
  },

  /* -----------------------------------------
     ANCIENT / BUILDER CIVILIZATION
     Intent: continuity, responsibility, time
  ----------------------------------------- */
  ancient_builder: {
    id: 'ancient_builder',
    label: 'Ancient / Builder Civilization',
    intent: 'continuity_responsibility_time',
    ui: {
      geometry: 'massive_symmetric',
      grid: 'invisible',
      primaryColors: ['#C4B5A5', '#8B7E6A', '#3F3A32'],
      accentColor: '#9A7F42',
      typography: 'sans_serif_clean',
      animations: { enabled: true, style: 'very_slow', speed: 'very_slow' },
    },
    timeline: {
      visualization: 'engraved',
      rollback: 'reading_position_shift',
    },
    agents: {
      representation: ['tablet', 'marker', 'stele'],
      anthropomorphic: false,
    },
    xr: {
      environment: 'temple_monolith_tree',
      lighting: 'natural',
      ambience: 'grounded',
    },
  },

  /* -----------------------------------------
     COSMIC / ABSTRACT
     Intent: perspective, exploration, distance
  ----------------------------------------- */
  cosmic_abstract: {
    id: 'cosmic_abstract',
    label: 'Cosmic / Abstract',
    intent: 'perspective_exploration_distance',
    ui: {
      geometry: 'floating',
      grid: 'none',
      primaryColors: ['#0B1020', '#1E1B4B', '#E0E7FF'],
      accentColor: '#38BDF8',
      typography: 'sans_serif_clean',
      animations: { enabled: true, style: 'fluid', speed: 'slow' },
    },
    timeline: {
      visualization: 'arcs_or_constellations',
    },
    agents: {
      representation: 'orbiting_nodes',
      faces: false,
    },
    xr: {
      environment: 'open_space',
      gravity: 'none',
      referencePoint: 'stable_center',
      motion: 'drift',
    },
  },

  /* -----------------------------------------
     FUTURIST / SYSTEMIC
     Intent: precision, orchestration, clarity
  ----------------------------------------- */
  futurist_systemic: {
    id: 'futurist_systemic',
    label: 'Futurist / Systemic',
    intent: 'precision_orchestration_clarity',
    ui: {
      geometry: 'modular',
      grid: 'visible',
      primaryColors: ['#020617', '#0F172A', '#CBD5E1'],
      accentColor: '#22D3EE',
      typography: 'sans_serif_clean',
      animations: { enabled: true, style: 'precise', speed: 'controlled' },
    },
    agents: {
      representation: 'functional_nodes',
      activityIndicator: 'soft_pulse',
    },
    guards: {
      visualStyle: 'shield_frame',
      feedback: 'soft_pulse_with_text',
    },
    xr: {
      environment: 'system_control_room',
      panels: 'layered_floating',
      horizon: 'stable',
    },
  },
};

/* =========================================================
   UTILITY FUNCTIONS
   ========================================================= */

/**
 * Get theme by ID with type safety.
 */
export function getTheme(id: ThemeID): ThemeConfig {
  return CHE_NU_THEMES[id];
}

/**
 * Get all theme IDs.
 */
export function getThemeIds(): ThemeID[] {
  return Object.keys(CHE_NU_THEMES) as ThemeID[];
}

/**
 * Check if a string is a valid theme ID.
 */
export function isValidThemeId(id: string): id is ThemeID {
  return id in CHE_NU_THEMES;
}

/**
 * Get default theme.
 */
export function getDefaultTheme(): ThemeConfig {
  return CHE_NU_THEMES.realistic_professional;
}

/**
 * Get theme by intent.
 */
export function getThemeByIntent(intent: string): ThemeConfig | undefined {
  return Object.values(CHE_NU_THEMES).find((theme) => theme.intent === intent);
}

/* =========================================================
   EXPORTS
   ========================================================= */

export const THEME_IDS: ThemeID[] = [
  'realistic_professional',
  'avatar_human_centered',
  'ancient_builder',
  'cosmic_abstract',
  'futurist_systemic',
];

export const DEFAULT_THEME_ID: ThemeID = 'realistic_professional';
