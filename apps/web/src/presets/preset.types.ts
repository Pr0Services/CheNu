/* =====================================================
   CHE·NU — Preset Types
   
   Type definitions for personalization presets.
   Presets are saved configurations that can be applied
   manually or automatically based on conditions.
   ===================================================== */

import { 
  CheNuPersonalization,
  DensityLevel,
  XRPersonalization,
  UIPersonalization,
  NotificationPersonalization,
} from '../personalization/personalization.types';

// ─────────────────────────────────────────────────────
// PRESET CONDITION TYPES
// ─────────────────────────────────────────────────────

/**
 * Time-based condition for preset activation.
 */
export interface TimeCondition {
  type: 'time';
  /** Start time in HH:MM format */
  startTime: string;
  /** End time in HH:MM format */
  endTime: string;
  /** Days of week (0=Sunday, 6=Saturday) */
  daysOfWeek?: number[];
}

/**
 * Activity-based condition.
 */
export interface ActivityCondition {
  type: 'activity';
  /** Activity type that triggers preset */
  activity: 
    | 'meeting_start'
    | 'meeting_end'
    | 'deep_work'
    | 'break'
    | 'presentation'
    | 'review'
    | 'brainstorm';
}

/**
 * Sphere-based condition.
 */
export interface SphereCondition {
  type: 'sphere';
  /** Sphere ID that triggers preset */
  sphereId: string;
  /** Optional: only when sphere is focused */
  onFocus?: boolean;
}

/**
 * Device/capability condition.
 */
export interface DeviceCondition {
  type: 'device';
  /** Device capability requirement */
  capability: 'xr' | 'mobile' | 'desktop' | 'touch';
  /** Whether capability must be present or absent */
  required: boolean;
}

/**
 * Duration-based condition.
 */
export interface DurationCondition {
  type: 'duration';
  /** Minimum session duration in minutes */
  minMinutes?: number;
  /** Maximum session duration in minutes */
  maxMinutes?: number;
}

/**
 * Manual activation only.
 */
export interface ManualCondition {
  type: 'manual';
}

/**
 * Union of all condition types.
 */
export type PresetCondition = 
  | TimeCondition 
  | ActivityCondition 
  | SphereCondition 
  | DeviceCondition
  | DurationCondition
  | ManualCondition;

// ─────────────────────────────────────────────────────
// PRESET PATCH TYPES
// ─────────────────────────────────────────────────────

/**
 * Partial XR settings for preset patch.
 */
export type XRPresetPatch = Partial<XRPersonalization>;

/**
 * Partial UI settings for preset patch.
 */
export type UIPresetPatch = Partial<UIPersonalization>;

/**
 * Partial notification settings for preset patch.
 */
export type NotificationPresetPatch = Partial<NotificationPersonalization>;

/**
 * What a preset can modify in personalization.
 */
export interface PersonalizationPatch {
  /** Global theme override */
  themeGlobal?: string;
  /** Density level */
  density?: DensityLevel;
  /** Language override */
  language?: string;
  /** XR settings patch */
  xr?: XRPresetPatch;
  /** UI settings patch */
  ui?: UIPresetPatch;
  /** Notification settings patch */
  notifications?: NotificationPresetPatch;
}

// ─────────────────────────────────────────────────────
// PRESET DEFINITION
// ─────────────────────────────────────────────────────

/**
 * Preset category for organization.
 */
export type PresetCategory = 
  | 'core'      // Built-in presets
  | 'work'      // Work-related
  | 'personal'  // Personal use
  | 'xr'        // XR-specific
  | 'custom';   // User-created

/**
 * Preset priority for auto-suggestion.
 */
export type PresetPriority = 'low' | 'medium' | 'high' | 'critical';

/**
 * Complete preset definition.
 */
export interface CheNuPreset {
  /** Unique preset identifier */
  id: string;
  
  /** Display label */
  label: string;
  
  /** Localized labels */
  labelI18n?: Record<string, string>;
  
  /** Short description */
  description: string;
  
  /** Localized descriptions */
  descriptionI18n?: Record<string, string>;
  
  /** Category for organization */
  category: PresetCategory;
  
  /** Icon emoji or identifier */
  icon?: string;
  
  /** Color for UI */
  color?: string;
  
  /** Conditions for auto-activation */
  conditions?: PresetCondition[];
  
  /** How conditions combine: all must match or any */
  conditionMode?: 'all' | 'any';
  
  /** Priority when multiple presets match */
  priority?: PresetPriority;
  
  /** The actual personalization changes */
  personalizationPatch: PersonalizationPatch;
  
  /** Whether this is a system preset (cannot be deleted) */
  isSystem?: boolean;
  
  /** Whether auto-activation is enabled */
  autoActivate?: boolean;
  
  /** Creation timestamp */
  createdAt?: number;
  
  /** Last modified timestamp */
  updatedAt?: number;
}

// ─────────────────────────────────────────────────────
// PRESET CONTEXT
// ─────────────────────────────────────────────────────

/**
 * Current context for preset suggestion.
 */
export interface PresetContext {
  /** Current time */
  currentTime: Date;
  
  /** Current day of week (0-6) */
  dayOfWeek: number;
  
  /** Active sphere ID */
  activeSphere?: string;
  
  /** Current activity */
  currentActivity?: ActivityCondition['activity'];
  
  /** Session duration in minutes */
  sessionDurationMinutes: number;
  
  /** Device capabilities */
  capabilities: {
    xr: boolean;
    mobile: boolean;
    desktop: boolean;
    touch: boolean;
  };
  
  /** Is user in a meeting */
  inMeeting: boolean;
  
  /** Number of active agents */
  activeAgentCount: number;
}

// ─────────────────────────────────────────────────────
// PRESET SUGGESTION
// ─────────────────────────────────────────────────────

/**
 * A suggested preset with match score.
 */
export interface PresetSuggestion {
  /** The preset */
  preset: CheNuPreset;
  
  /** Match score (0-100) */
  score: number;
  
  /** Which conditions matched */
  matchedConditions: PresetCondition[];
  
  /** Reason for suggestion */
  reason: string;
  
  /** Localized reason */
  reasonI18n?: Record<string, string>;
}

// ─────────────────────────────────────────────────────
// PRESET HISTORY
// ─────────────────────────────────────────────────────

/**
 * Record of preset activation.
 */
export interface PresetActivation {
  /** Preset ID */
  presetId: string;
  
  /** Activation timestamp */
  activatedAt: number;
  
  /** How it was activated */
  trigger: 'manual' | 'auto' | 'scheduled';
  
  /** Context at activation */
  context?: Partial<PresetContext>;
  
  /** Duration active (ms) */
  durationMs?: number;
}

// ─────────────────────────────────────────────────────
// PRESET STATE
// ─────────────────────────────────────────────────────

/**
 * Preset system state.
 */
export interface PresetState {
  /** All available presets */
  presets: CheNuPreset[];
  
  /** Currently active preset ID */
  activePresetId: string | null;
  
  /** Previous personalization (for revert) */
  previousPersonalization: CheNuPersonalization | null;
  
  /** Recent activations */
  history: PresetActivation[];
  
  /** Maximum history entries */
  maxHistorySize: number;
  
  /** Whether auto-suggestions are enabled */
  autoSuggestEnabled: boolean;
  
  /** Favorite preset IDs */
  favorites: string[];
}

// ─────────────────────────────────────────────────────
// PRESET EVENTS
// ─────────────────────────────────────────────────────

/**
 * Preset system events.
 */
export type PresetEvent = 
  | { type: 'PRESET_ACTIVATED'; presetId: string; trigger: 'manual' | 'auto' }
  | { type: 'PRESET_DEACTIVATED'; presetId: string }
  | { type: 'PRESET_CREATED'; preset: CheNuPreset }
  | { type: 'PRESET_UPDATED'; preset: CheNuPreset }
  | { type: 'PRESET_DELETED'; presetId: string }
  | { type: 'PRESET_FAVORITED'; presetId: string }
  | { type: 'PRESET_UNFAVORITED'; presetId: string }
  | { type: 'AUTO_SUGGEST_TOGGLED'; enabled: boolean };

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export type {
  CheNuPersonalization,
  DensityLevel,
  XRPersonalization,
  UIPersonalization,
  NotificationPersonalization,
};
