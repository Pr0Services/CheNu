/**
 * CHE·NU — XR PRESETS PACK
 * Types & Interfaces
 * 
 * XR.v1.0
 * 5 curated immersive environments for CHE·NU spatial experiences.
 */

// ============================================================
// PRESET IDENTIFIERS
// ============================================================

export type XRPresetId = 
  | 'xr_classic'
  | 'xr_cosmic'
  | 'xr_builder'
  | 'xr_sanctum'
  | 'xr_jungle';

// ============================================================
// LIGHTING
// ============================================================

export type LightingType = 
  | 'warm_low'
  | 'deep_starfield'
  | 'torch_soft'
  | 'neon_low'
  | 'filtered_sun';

export interface LightingConfig {
  type: LightingType;
  intensity: number;        // 0.0 - 1.0
  color: string;            // Hex color
  shadows: boolean;
  ambient_occlusion: boolean;
  bloom?: {
    enabled: boolean;
    intensity: number;
    threshold: number;
  };
}

// ============================================================
// SKY
// ============================================================

export type SkyType = 
  | 'soft_gradient'
  | 'nebula_dynamic'
  | 'cavern_skybox'
  | 'holo_grid'
  | 'tropical_fog';

export interface SkyConfig {
  type: SkyType;
  primary_color: string;
  secondary_color: string;
  animated: boolean;
  animation_speed?: number;
  stars?: {
    enabled: boolean;
    density: number;
    twinkle: boolean;
  };
  clouds?: {
    enabled: boolean;
    density: number;
    speed: number;
  };
}

// ============================================================
// FLOOR
// ============================================================

export type FloorType = 
  | 'stone_circle'
  | 'translucent_orbit_ring'
  | 'engraved_stone'
  | 'reflective_white'
  | 'moss_platform';

export interface FloorConfig {
  type: FloorType;
  material: string;
  color: string;
  reflectivity: number;     // 0.0 - 1.0
  texture?: string;
  pattern?: 'circular' | 'grid' | 'organic' | 'none';
}

// ============================================================
// AMBIENCE
// ============================================================

export interface AmbienceSound {
  id: string;
  name: string;
  volume: number;           // 0.0 - 1.0
  loop: boolean;
  spatial: boolean;
}

export interface AmbienceConfig {
  sounds: AmbienceSound[];
  master_volume: number;
  reverb: {
    enabled: boolean;
    size: 'small' | 'medium' | 'large' | 'vast';
  };
  randomizer?: {
    enabled: boolean;
    interval_ms: number;
    pool: string[];
  };
}

// ============================================================
// UI LAYER
// ============================================================

export type UILayerType = 
  | 'floating_panels'
  | 'spherical_orbit_HUD'
  | 'carved_tablet_UI'
  | 'holo_panels'
  | 'vine-panels';

export interface UILayerConfig {
  type: UILayerType;
  opacity: number;          // 0.0 - 1.0
  follow_head: boolean;
  distance: number;         // meters
  scale: number;
  color_scheme: {
    background: string;
    text: string;
    accent: string;
    border: string;
  };
}

// ============================================================
// AVATAR STYLE
// ============================================================

export type AvatarStyleType = 
  | 'neutral-minimal'
  | 'astral_silhouette'
  | 'glyph_armor'
  | 'synth-body'
  | 'natural_tribal';

export interface AvatarStyleConfig {
  type: AvatarStyleType;
  glow: boolean;
  glow_color?: string;
  opacity: number;
  scale_range: [number, number];
  animation_set: string;
}

// ============================================================
// DECOR ELEMENTS
// ============================================================

export interface DecorElement {
  id: string;
  name: string;
  model: string;            // Asset path
  interactive: boolean;
  position?: { x: number; y: number; z: number };
  scale?: number;
  rotation?: { x: number; y: number; z: number };
  animation?: string;
}

// ============================================================
// SPECIAL FEATURES
// ============================================================

export interface SpecialFeature {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  config?: Record<string, unknown>;
}

// ============================================================
// CONSTRAINTS
// ============================================================

export interface PresetConstraints {
  high_motion_fx: boolean;
  accessibility_safe: boolean;
  low_opacity_ui: boolean;
  reduced_parallax: boolean;
  rapid_transitions: boolean;
  capped_brightness: boolean;
  motion_blur: boolean;
}

// ============================================================
// FULL PRESET
// ============================================================

export interface XRPreset {
  id: XRPresetId;
  name: string;
  description: string;
  icon: string;
  color: string;
  
  lighting: LightingConfig;
  sky: SkyConfig;
  floor: FloorConfig;
  ambience: AmbienceConfig;
  
  interaction_radius: number;  // meters
  ui_layer: UILayerConfig;
  avatar_style: AvatarStyleConfig;
  
  decor: DecorElement[];
  special?: SpecialFeature[];
  
  constraints: PresetConstraints;
  
  metadata: {
    version: string;
    created_at: string;
    author: string;
  };
}

// ============================================================
// UNIVERSAL RULES
// ============================================================

export interface TransitionConfig {
  type: 'fade_portal' | 'dissolve' | 'warp';
  duration_ms: number;
  audio: string;
  ease: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
}

export interface MenuConfig {
  anchor: 'right_hand' | 'left_hand' | 'gaze';
  mode: 'radial' | 'linear' | 'grid';
  adaptive: boolean;
  haptic_feedback: boolean;
}

export type NavigationMode = 
  | 'teleport_step'
  | 'slow-glide'
  | 'fixed-node';

export interface NavigationConfig {
  modes: NavigationMode[];
  default_mode: NavigationMode;
  comfort_locked: boolean;
  speed_limit: number;        // m/s
}

export interface SafetyConfig {
  boundary_mesh: boolean;
  boundary_color: string;
  auto_recenter: boolean;
  recenter_threshold: number; // meters
  collision_soft: boolean;
  collision_warning_distance: number;
}

export interface UniversalXRRules {
  transition: TransitionConfig;
  menus: MenuConfig;
  navigation: NavigationConfig;
  safety: SafetyConfig;
}

// ============================================================
// EXPORT BUNDLE
// ============================================================

export interface XRPresetBundle {
  version: string;
  hash: string;
  created_at: string;
  presets: XRPreset[];
  universal_rules: UniversalXRRules;
}

// ============================================================
// PRESET SELECTION
// ============================================================

export interface PresetSelectionCriteria {
  mood?: 'calm' | 'expansive' | 'focused' | 'analytical' | 'creative';
  task?: 'general' | 'construction' | 'analysis' | 'meditation' | 'collaboration';
  duration?: 'short' | 'medium' | 'long';
  accessibility_priority?: boolean;
}

// ============================================================
// RUNTIME STATE
// ============================================================

export interface XRRuntimeState {
  current_preset: XRPresetId | null;
  transitioning: boolean;
  transition_progress: number;
  loaded_assets: string[];
  active_sounds: string[];
  user_position: { x: number; y: number; z: number };
  user_rotation: { x: number; y: number; z: number };
}
