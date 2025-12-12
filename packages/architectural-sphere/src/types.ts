/**
 * CHE·NU — ARCHITECTURAL SPHERE
 * Types & Schemas
 * 
 * Foundation v1.1
 * SPACE ONLY — NO behavior, NO decisions, NO data authority
 */

// ============================================================
// ENUMS
// ============================================================

export type ArchDomain = 
  | 'personal'
  | 'business'
  | 'scholar'
  | 'xr'
  | 'institution'
  | 'creative';

export type LayoutType = 
  | 'room'      // Enclosed space
  | 'hub'       // Central connection point
  | 'radial'    // Circular arrangement
  | 'layered';  // Stacked levels

export type Dimension = '2d' | '3d' | 'xr';

export type ZonePurpose = 
  | 'conversation'  // Discussion areas
  | 'visual'        // Display/presentation
  | 'navigation'    // Wayfinding
  | 'work'          // Task-focused
  | 'reflection';   // Quiet/private

export type Visibility = 'public' | 'private' | 'invite';

export type NavigationMode = 'free' | 'guided' | 'contextual';

export type AvatarType = 'user' | 'agent' | 'system';

export type AvatarStyle = 'abstract' | 'humanoid' | 'symbolic' | 'custom';

export type AvatarAnimation = 'idle' | 'active' | 'thinking' | 'none';

export type AssetType = 'decor' | 'avatar' | 'plan' | 'theme' | 'navigation';

// ============================================================
// ZONE SCHEMA
// ============================================================

export interface Zone {
  zone_id: string;
  name: string;
  purpose: ZonePurpose;
  capacity: number;
  visibility: Visibility;
  bounds?: {
    x: number;
    y: number;
    z?: number;
    width: number;
    height: number;
    depth?: number;
  };
  decor_preset?: string;
  ambient?: {
    lighting: 'bright' | 'soft' | 'dim' | 'dark';
    sound: boolean;
    particles: boolean;
  };
}

// ============================================================
// NAVIGATION SCHEMA
// ============================================================

export interface NavigationConfig {
  mode: NavigationMode;
  minimap: boolean;
  waypoints?: Array<{
    id: string;
    label: string;
    position: { x: number; y: number; z?: number };
    zone_id?: string;
  }>;
  flow_paths?: Array<{
    from: string;
    to: string;
    bidirectional: boolean;
  }>;
  entry_point?: string;
  exit_points?: string[];
}

// ============================================================
// PLAN SCHEMA (CANONICAL)
// ============================================================

export interface Plan {
  id: string;
  name: string;
  description?: string;
  domain: ArchDomain;
  layout: LayoutType;
  dimension: Dimension;
  zones: Zone[];
  navigation: NavigationConfig;
  metadata: {
    created_at: string; // ISO-8601
    created_by: string;
    version: string;
    tags?: string[];
  };
}

// ============================================================
// AVATAR SCHEMA
// ============================================================

export interface AvatarVisual {
  style: AvatarStyle;
  primary_color: string;
  accent_color: string;
  glow: boolean;
  animation: AvatarAnimation;
  custom_asset?: string; // URL to custom model/image
}

export interface AvatarPresence {
  size: 'small' | 'medium' | 'large';
  opacity: number; // 0.0 - 1.0
  aura_radius: number; // 0 - 100
  aura_color?: string;
}

export interface AvatarRoleIndicator {
  visible: boolean;
  badge?: string; // Icon name
  label?: string;
  color?: string;
}

export interface Avatar {
  id: string;
  type: AvatarType;
  name: string;
  visual: AvatarVisual;
  presence: AvatarPresence;
  role_indicator: AvatarRoleIndicator;
  metadata: {
    created_at: string;
    created_by: string;
    version: string;
  };
}

// ============================================================
// DECOR PRESET SCHEMA
// ============================================================

export interface DecorPreset {
  id: string;
  name: string;
  domain: ArchDomain;
  dimension: Dimension;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  lighting: {
    type: 'ambient' | 'directional' | 'point' | 'mixed';
    intensity: number; // 0.0 - 1.0
    color: string;
  };
  materials?: {
    floor?: string;
    walls?: string;
    ceiling?: string;
  };
  atmosphere?: {
    fog: boolean;
    fog_density?: number;
    particles: boolean;
    particle_type?: string;
  };
  metadata: {
    created_at: string;
    created_by: string;
    version: string;
  };
}

// ============================================================
// THEME CONFIG SCHEMA
// ============================================================

export interface ThemeConfig {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    muted: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
  typography: {
    font_family: string;
    font_family_mono: string;
    scale: number; // Base font size multiplier
  };
  spacing: {
    unit: number; // Base spacing unit in px
  };
  borders: {
    radius: number;
    width: number;
  };
  shadows: {
    enabled: boolean;
    intensity: 'none' | 'subtle' | 'medium' | 'strong';
  };
  metadata: {
    created_at: string;
    created_by: string;
    version: string;
  };
}

// ============================================================
// EXPORT PACKAGE SCHEMA
// ============================================================

export interface ExportPackage<T = unknown> {
  sphere_id: 'architectural';
  asset_type: AssetType;
  version: string;
  hash_signature: string;
  compatibility_tags: Dimension[];
  created_at: string;
  payload: T;
}

// ============================================================
// VALIDATION RESULT
// ============================================================

export interface ValidationResult {
  valid: boolean;
  errors: Array<{
    field: string;
    message: string;
    severity: 'error' | 'warning';
  }>;
}

// ============================================================
// ACTIVATION REQUEST
// ============================================================

export interface ActivationRequest {
  package: ExportPackage;
  target_sphere: string;
  requested_by: string;
  requested_at: string;
}

export interface ActivationResponse {
  approved: boolean;
  activated_at?: string;
  rejection_reason?: string;
  validators_passed: string[];
  validators_failed?: string[];
}

// ============================================================
// FORBIDDEN ACTIONS (for reference)
// ============================================================

export const FORBIDDEN_ACTIONS = [
  'workflow_control',
  'logic_modification',
  'persuasion_design',
  'silent_influence',
  'permission_grants',
  'data_authority',
] as const;

export type ForbiddenAction = typeof FORBIDDEN_ACTIONS[number];

// ============================================================
// DOMAIN RESTRICTIONS
// ============================================================

export const DOMAIN_RESTRICTIONS: Record<ArchDomain, string[]> = {
  personal: ['user_controlled_only'],
  business: ['presentation_and_meetings_only', 'no_strategic_influence'],
  scholar: ['no_assessment_influence'],
  xr: [], // No restrictions
  institution: ['audit_visibility_required'],
  creative: [], // No restrictions
};

// ============================================================
// DEFAULT VALUES
// ============================================================

export const DEFAULT_ZONE: Omit<Zone, 'zone_id' | 'name'> = {
  purpose: 'work',
  capacity: 10,
  visibility: 'private',
  ambient: {
    lighting: 'soft',
    sound: false,
    particles: false,
  },
};

export const DEFAULT_NAVIGATION: NavigationConfig = {
  mode: 'free',
  minimap: true,
  waypoints: [],
  flow_paths: [],
};

export const DEFAULT_AVATAR_VISUAL: AvatarVisual = {
  style: 'abstract',
  primary_color: '#5DA9FF',
  accent_color: '#E8B86D',
  glow: true,
  animation: 'idle',
};

export const DEFAULT_AVATAR_PRESENCE: AvatarPresence = {
  size: 'medium',
  opacity: 1.0,
  aura_radius: 20,
};

export const DEFAULT_ROLE_INDICATOR: AvatarRoleIndicator = {
  visible: true,
};
