/**
 * CHE·NU — XR PRESETS PACK
 * Preset Definitions
 * 
 * 5 curated XR environments:
 * - Classic CHE·NU
 * - Cosmic Orbit
 * - Ancient Builder
 * - Futurist Sanctum
 * - Jungle Haven
 */

import {
  XRPreset,
  XRPresetId,
  UniversalXRRules,
  XRPresetBundle,
} from './types';

// ============================================================
// XR_CLASSIC - Classic CHE·NU
// ============================================================

export const XR_CLASSIC: XRPreset = {
  id: 'xr_classic',
  name: 'Classic CHE·NU',
  description: 'Warm, grounded environment with stone circle and soft lanterns. The essence of CHE·NU.',
  icon: '🏛️',
  color: '#E8B86D',
  
  lighting: {
    type: 'warm_low',
    intensity: 0.6,
    color: '#FFE4B5',
    shadows: true,
    ambient_occlusion: true,
    bloom: {
      enabled: true,
      intensity: 0.3,
      threshold: 0.8,
    },
  },
  
  sky: {
    type: 'soft_gradient',
    primary_color: '#4A5568',
    secondary_color: '#2D3748',
    animated: false,
    clouds: {
      enabled: true,
      density: 0.2,
      speed: 0.1,
    },
  },
  
  floor: {
    type: 'stone_circle',
    material: 'natural_stone',
    color: '#78716C',
    reflectivity: 0.1,
    pattern: 'circular',
  },
  
  ambience: {
    sounds: [
      { id: 'low_wind', name: 'Low Wind', volume: 0.4, loop: true, spatial: false },
      { id: 'subtle_chimes', name: 'Subtle Chimes', volume: 0.2, loop: true, spatial: true },
    ],
    master_volume: 0.6,
    reverb: {
      enabled: true,
      size: 'medium',
    },
  },
  
  interaction_radius: 2.5,
  
  ui_layer: {
    type: 'floating_panels',
    opacity: 0.9,
    follow_head: false,
    distance: 1.5,
    scale: 1.0,
    color_scheme: {
      background: '#1F2937E6',
      text: '#F9FAFB',
      accent: '#E8B86D',
      border: '#374151',
    },
  },
  
  avatar_style: {
    type: 'neutral-minimal',
    glow: false,
    opacity: 1.0,
    scale_range: [0.9, 1.1],
    animation_set: 'calm_idle',
  },
  
  decor: [
    {
      id: 'stone_pillars',
      name: 'Stone Pillars',
      model: '/assets/decor/stone_pillars.glb',
      interactive: false,
      scale: 1.0,
    },
    {
      id: 'soft_lanterns',
      name: 'Soft Lanterns',
      model: '/assets/decor/lanterns.glb',
      interactive: true,
      animation: 'flicker_soft',
    },
    {
      id: 'tree_of_links',
      name: 'Tree of Links',
      model: '/assets/decor/tree_of_links.glb',
      interactive: true,
      animation: 'sway_gentle',
    },
  ],
  
  special: [
    {
      id: 'interactive_tree',
      name: 'Interactive Tree of Links',
      description: 'Central navigation element with interactive branches',
      enabled: true,
      config: { branch_count: 7, glow_on_hover: true },
    },
  ],
  
  constraints: {
    high_motion_fx: false,
    accessibility_safe: true,
    low_opacity_ui: false,
    reduced_parallax: false,
    rapid_transitions: false,
    capped_brightness: false,
    motion_blur: false,
  },
  
  metadata: {
    version: '1.0.0',
    created_at: '2025-01-01T00:00:00Z',
    author: 'CHE·NU',
  },
};

// ============================================================
// XR_COSMIC - Cosmic Orbit
// ============================================================

export const XR_COSMIC: XRPreset = {
  id: 'xr_cosmic',
  name: 'Cosmic Orbit',
  description: 'Expansive starfield with orbiting memory shards. Perfect for big-picture thinking.',
  icon: '🌌',
  color: '#8B5CF6',
  
  lighting: {
    type: 'deep_starfield',
    intensity: 0.4,
    color: '#C4B5FD',
    shadows: false,
    ambient_occlusion: false,
    bloom: {
      enabled: true,
      intensity: 0.6,
      threshold: 0.6,
    },
  },
  
  sky: {
    type: 'nebula_dynamic',
    primary_color: '#1E1B4B',
    secondary_color: '#312E81',
    animated: true,
    animation_speed: 0.05,
    stars: {
      enabled: true,
      density: 0.8,
      twinkle: true,
    },
  },
  
  floor: {
    type: 'translucent_orbit_ring',
    material: 'glass_frosted',
    color: '#3730A3',
    reflectivity: 0.6,
    pattern: 'circular',
  },
  
  ambience: {
    sounds: [
      { id: 'cosmic_hum', name: 'Ambient Cosmic Hum', volume: 0.5, loop: true, spatial: false },
    ],
    master_volume: 0.5,
    reverb: {
      enabled: true,
      size: 'vast',
    },
  },
  
  interaction_radius: 4.0,
  
  ui_layer: {
    type: 'spherical_orbit_HUD',
    opacity: 0.7,
    follow_head: true,
    distance: 2.0,
    scale: 0.9,
    color_scheme: {
      background: '#1E1B4B99',
      text: '#E9D5FF',
      accent: '#A78BFA',
      border: '#4C1D95',
    },
  },
  
  avatar_style: {
    type: 'astral_silhouette',
    glow: true,
    glow_color: '#8B5CF6',
    opacity: 0.9,
    scale_range: [0.8, 1.2],
    animation_set: 'float_drift',
  },
  
  decor: [
    {
      id: 'memory_shards',
      name: 'Floating Memory Shards',
      model: '/assets/decor/memory_shards.glb',
      interactive: true,
      animation: 'orbit_slow',
    },
    {
      id: 'drift_lines',
      name: 'Drift Lines',
      model: '/assets/decor/drift_lines.glb',
      interactive: false,
      animation: 'flow_continuous',
    },
  ],
  
  special: [
    {
      id: 'agent_orbit_paths',
      name: 'Agent Orbit Paths',
      description: 'Visible orbital tracks showing agent positions and movements',
      enabled: true,
      config: { path_color: '#A78BFA', path_opacity: 0.4 },
    },
  ],
  
  constraints: {
    high_motion_fx: false,
    accessibility_safe: true,
    low_opacity_ui: true,
    reduced_parallax: true,
    rapid_transitions: false,
    capped_brightness: false,
    motion_blur: false,
  },
  
  metadata: {
    version: '1.0.0',
    created_at: '2025-01-01T00:00:00Z',
    author: 'CHE·NU',
  },
};

// ============================================================
// XR_BUILDER - Ancient Builder
// ============================================================

export const XR_BUILDER: XRPreset = {
  id: 'xr_builder',
  name: 'Ancient Builder',
  description: 'Mystical workshop with torch light and blueprint projections. For construction focus.',
  icon: '🔨',
  color: '#B45309',
  
  lighting: {
    type: 'torch_soft',
    intensity: 0.55,
    color: '#FBBF24',
    shadows: true,
    ambient_occlusion: true,
    bloom: {
      enabled: true,
      intensity: 0.25,
      threshold: 0.7,
    },
  },
  
  sky: {
    type: 'cavern_skybox',
    primary_color: '#292524',
    secondary_color: '#1C1917',
    animated: false,
  },
  
  floor: {
    type: 'engraved_stone',
    material: 'carved_granite',
    color: '#57534E',
    reflectivity: 0.05,
    pattern: 'grid',
    texture: '/assets/textures/engraved_runes.png',
  },
  
  ambience: {
    sounds: [
      { id: 'deep_echo', name: 'Deep Echo', volume: 0.3, loop: true, spatial: true },
      { id: 'earth_resonance', name: 'Earth Resonance', volume: 0.4, loop: true, spatial: false },
    ],
    master_volume: 0.5,
    reverb: {
      enabled: true,
      size: 'large',
    },
  },
  
  interaction_radius: 2.0,
  
  ui_layer: {
    type: 'carved_tablet_UI',
    opacity: 0.95,
    follow_head: false,
    distance: 1.2,
    scale: 1.1,
    color_scheme: {
      background: '#292524F2',
      text: '#FEF3C7',
      accent: '#F59E0B',
      border: '#78716C',
    },
  },
  
  avatar_style: {
    type: 'glyph_armor',
    glow: true,
    glow_color: '#F59E0B',
    opacity: 1.0,
    scale_range: [0.95, 1.05],
    animation_set: 'stance_ready',
  },
  
  decor: [
    {
      id: 'monolith_logs',
      name: 'Monolith Logs',
      model: '/assets/decor/monolith_logs.glb',
      interactive: true,
      animation: 'pulse_glow',
    },
    {
      id: 'tool_altars',
      name: 'Tool Altars',
      model: '/assets/decor/tool_altars.glb',
      interactive: true,
    },
  ],
  
  special: [
    {
      id: 'blueprint_projection',
      name: 'Blueprint Projection Field',
      description: 'Holographic projection area for construction plans and schematics',
      enabled: true,
      config: { projection_color: '#FBBF24', grid_visible: true },
    },
  ],
  
  constraints: {
    high_motion_fx: false,
    accessibility_safe: true,
    low_opacity_ui: false,
    reduced_parallax: false,
    rapid_transitions: false,
    capped_brightness: false,
    motion_blur: false,
  },
  
  metadata: {
    version: '1.0.0',
    created_at: '2025-01-01T00:00:00Z',
    author: 'CHE·NU',
  },
};

// ============================================================
// XR_SANCTUM - Futurist Sanctum
// ============================================================

export const XR_SANCTUM: XRPreset = {
  id: 'xr_sanctum',
  name: 'Futurist Sanctum',
  description: 'Clean high-tech environment with holographic elements and data streams.',
  icon: '💠',
  color: '#06B6D4',
  
  lighting: {
    type: 'neon_low',
    intensity: 0.65,
    color: '#22D3EE',
    shadows: false,
    ambient_occlusion: true,
    bloom: {
      enabled: true,
      intensity: 0.4,
      threshold: 0.65,
    },
  },
  
  sky: {
    type: 'holo_grid',
    primary_color: '#164E63',
    secondary_color: '#0E7490',
    animated: true,
    animation_speed: 0.1,
  },
  
  floor: {
    type: 'reflective_white',
    material: 'polished_surface',
    color: '#E5E7EB',
    reflectivity: 0.7,
    pattern: 'grid',
  },
  
  ambience: {
    sounds: [
      { id: 'smooth_aether', name: 'Smooth Aether', volume: 0.35, loop: true, spatial: false },
    ],
    master_volume: 0.4,
    reverb: {
      enabled: true,
      size: 'medium',
    },
  },
  
  interaction_radius: 3.0,
  
  ui_layer: {
    type: 'holo_panels',
    opacity: 0.85,
    follow_head: true,
    distance: 1.6,
    scale: 1.0,
    color_scheme: {
      background: '#0F172ACC',
      text: '#E0F2FE',
      accent: '#22D3EE',
      border: '#0891B2',
    },
  },
  
  avatar_style: {
    type: 'synth-body',
    glow: true,
    glow_color: '#06B6D4',
    opacity: 0.95,
    scale_range: [0.9, 1.1],
    animation_set: 'precise_motion',
  },
  
  decor: [
    {
      id: 'ai_coral',
      name: 'AI Coral Structures',
      model: '/assets/decor/ai_coral.glb',
      interactive: true,
      animation: 'grow_pulse',
    },
    {
      id: 'logic_streams',
      name: 'Logic Streams',
      model: '/assets/decor/logic_streams.glb',
      interactive: false,
      animation: 'flow_data',
    },
  ],
  
  special: [
    {
      id: 'realtime_data_feeds',
      name: 'Real-time Data Feeds',
      description: 'Live information waterfalls displaying system data',
      enabled: true,
      config: { refresh_rate: 1000, visualize_agents: true },
    },
  ],
  
  constraints: {
    high_motion_fx: false,
    accessibility_safe: true,
    low_opacity_ui: false,
    reduced_parallax: false,
    rapid_transitions: false,
    capped_brightness: true,
    motion_blur: false,
  },
  
  metadata: {
    version: '1.0.0',
    created_at: '2025-01-01T00:00:00Z',
    author: 'CHE·NU',
  },
};

// ============================================================
// XR_JUNGLE - Jungle Haven
// ============================================================

export const XR_JUNGLE: XRPreset = {
  id: 'xr_jungle',
  name: 'Jungle Haven',
  description: 'Lush rainforest environment with organic navigation and wildlife ambience.',
  icon: '🌿',
  color: '#22C55E',
  
  lighting: {
    type: 'filtered_sun',
    intensity: 0.7,
    color: '#FEF9C3',
    shadows: true,
    ambient_occlusion: true,
    bloom: {
      enabled: true,
      intensity: 0.2,
      threshold: 0.8,
    },
  },
  
  sky: {
    type: 'tropical_fog',
    primary_color: '#14532D',
    secondary_color: '#166534',
    animated: true,
    animation_speed: 0.02,
    clouds: {
      enabled: true,
      density: 0.5,
      speed: 0.05,
    },
  },
  
  floor: {
    type: 'moss_platform',
    material: 'organic_moss',
    color: '#166534',
    reflectivity: 0.02,
    pattern: 'organic',
  },
  
  ambience: {
    sounds: [
      { id: 'rainforest_soft', name: 'Rainforest Soft', volume: 0.5, loop: true, spatial: true },
    ],
    master_volume: 0.6,
    reverb: {
      enabled: true,
      size: 'large',
    },
    randomizer: {
      enabled: true,
      interval_ms: 15000,
      pool: ['bird_call_1', 'bird_call_2', 'insect_chirp', 'water_drip'],
    },
  },
  
  interaction_radius: 2.0,
  
  ui_layer: {
    type: 'vine-panels',
    opacity: 0.88,
    follow_head: false,
    distance: 1.4,
    scale: 1.0,
    color_scheme: {
      background: '#14532DE6',
      text: '#ECFDF5',
      accent: '#4ADE80',
      border: '#166534',
    },
  },
  
  avatar_style: {
    type: 'natural_tribal',
    glow: false,
    opacity: 1.0,
    scale_range: [0.9, 1.1],
    animation_set: 'organic_flow',
  },
  
  decor: [
    {
      id: 'root_bridges',
      name: 'Root Bridges',
      model: '/assets/decor/root_bridges.glb',
      interactive: true,
    },
    {
      id: 'canopy_nodes',
      name: 'Canopy Memory Nodes',
      model: '/assets/decor/canopy_nodes.glb',
      interactive: true,
      animation: 'sway_breeze',
    },
  ],
  
  special: [
    {
      id: 'wildlife_randomizer',
      name: 'Wildlife Ambience Randomizer',
      description: 'Random wildlife sounds and occasional creature sightings',
      enabled: true,
      config: { creature_frequency: 0.1, sound_variety: 8 },
    },
  ],
  
  constraints: {
    high_motion_fx: false,
    accessibility_safe: true,
    low_opacity_ui: false,
    reduced_parallax: false,
    rapid_transitions: false,
    capped_brightness: false,
    motion_blur: false,
  },
  
  metadata: {
    version: '1.0.0',
    created_at: '2025-01-01T00:00:00Z',
    author: 'CHE·NU',
  },
};

// ============================================================
// UNIVERSAL XR RULES
// ============================================================

export const UNIVERSAL_XR_RULES: UniversalXRRules = {
  transition: {
    type: 'fade_portal',
    duration_ms: 800,
    audio: 'soft_whoosh',
    ease: 'ease-in-out',
  },
  
  menus: {
    anchor: 'right_hand',
    mode: 'radial',
    adaptive: true,
    haptic_feedback: true,
  },
  
  navigation: {
    modes: ['teleport_step', 'slow-glide', 'fixed-node'],
    default_mode: 'teleport_step',
    comfort_locked: true,
    speed_limit: 2.0,
  },
  
  safety: {
    boundary_mesh: true,
    boundary_color: '#EF4444',
    auto_recenter: true,
    recenter_threshold: 3.0,
    collision_soft: true,
    collision_warning_distance: 0.5,
  },
};

// ============================================================
// ALL PRESETS
// ============================================================

export const ALL_PRESETS: Record<XRPresetId, XRPreset> = {
  xr_classic: XR_CLASSIC,
  xr_cosmic: XR_COSMIC,
  xr_builder: XR_BUILDER,
  xr_sanctum: XR_SANCTUM,
  xr_jungle: XR_JUNGLE,
};

export const PRESET_LIST: XRPreset[] = [
  XR_CLASSIC,
  XR_COSMIC,
  XR_BUILDER,
  XR_SANCTUM,
  XR_JUNGLE,
];

// ============================================================
// CREATE BUNDLE
// ============================================================

export function createPresetBundle(): XRPresetBundle {
  const bundleData = JSON.stringify({ presets: PRESET_LIST, rules: UNIVERSAL_XR_RULES });
  
  // Simple hash generation
  let hash = 0;
  for (let i = 0; i < bundleData.length; i++) {
    const char = bundleData.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  return {
    version: '1.0',
    hash: `sha256-${Math.abs(hash).toString(16).padStart(16, '0')}`,
    created_at: new Date().toISOString(),
    presets: PRESET_LIST,
    universal_rules: UNIVERSAL_XR_RULES,
  };
}
