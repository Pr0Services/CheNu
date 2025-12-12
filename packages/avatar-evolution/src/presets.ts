/**
 * CHE·NU — AVATAR EVOLUTION SYSTEM + MULTI-MEETING UNIVERSE VIEW
 * Presets & Configurations
 * 
 * Evolution states, sphere configs, and coordination agents
 */

import {
  EvolutionState,
  EvolutionStateConfig,
  EvolutionMorphology,
  EvolutionContext,
  EvolutionTriggers,
  AvatarEvolution,
  SphereType,
  SphereConfig,
  UniverseNodeType,
  UniverseNodeVisual,
  UniverseNode,
  UniverseLink,
  LinkType,
  UniverseInteraction,
  InteractionConfig,
  CoordinationAgentType,
  CoordinationAgent,
  SyncRule,
  SyncRuleConfig,
  UniverseSafety,
} from './types';

// ============================================================
// EVOLUTION STATES
// ============================================================

export const EVOLUTION_BASE: EvolutionStateConfig = {
  state: 'base',
  name: 'Base',
  description: 'Neutral morphology with stable outline',
  visual: 'Minimal, clear silhouette',
  context: 'Default state',
  complexity: 0.0,
};

export const EVOLUTION_SIGNAL: EvolutionStateConfig = {
  state: 'signal',
  name: 'Signal',
  description: 'Light glyphs representing context signals',
  visual: 'Glyphs appear, no expressivity',
  context: 'Active session',
  complexity: 0.33,
};

export const EVOLUTION_STRUCTURAL: EvolutionStateConfig = {
  state: 'structural',
  name: 'Structural',
  description: 'Branching lines representing data paths',
  visual: 'Lines extend from avatar',
  context: 'Analysis mode',
  complexity: 0.66,
};

export const EVOLUTION_INTEGRATED: EvolutionStateConfig = {
  state: 'integrated',
  name: 'Integrated',
  description: 'Full context aura with structural lines',
  visual: 'Complete evolution state',
  context: 'XR analysis mode only',
  complexity: 1.0,
};

export const EVOLUTION_STATES: Record<EvolutionState, EvolutionStateConfig> = {
  base: EVOLUTION_BASE,
  signal: EVOLUTION_SIGNAL,
  structural: EVOLUTION_STRUCTURAL,
  integrated: EVOLUTION_INTEGRATED,
};

export const EVOLUTION_STATE_LIST: EvolutionStateConfig[] = [
  EVOLUTION_BASE,
  EVOLUTION_SIGNAL,
  EVOLUTION_STRUCTURAL,
  EVOLUTION_INTEGRATED,
];

// ============================================================
// DEFAULT MORPHOLOGY PER STATE
// ============================================================

export const DEFAULT_MORPHOLOGIES: Record<EvolutionState, EvolutionMorphology> = {
  base: {
    silhouette: 'normal',
    glyphs: 'none',
    aura: 'none',
    halo: 'none',
    lines: 'none',
    opacity: 1.0,
  },
  signal: {
    silhouette: 'normal',
    glyphs: 'light',
    aura: 'subtle',
    halo: 'none',
    lines: 'none',
    opacity: 1.0,
  },
  structural: {
    silhouette: 'normal',
    glyphs: 'light',
    aura: 'informational',
    halo: 'single_wire',
    lines: 'branching',
    opacity: 1.0,
  },
  integrated: {
    silhouette: 'fractal',
    glyphs: 'multi_layer',
    aura: 'context_full',
    halo: 'tri_wire',
    lines: 'data_paths',
    opacity: 1.0,
  },
};

// ============================================================
// TRIGGER-BASED MORPHOLOGY ADJUSTMENTS
// ============================================================

export const SESSION_MORPHOLOGY_ADJUSTMENTS: Record<string, Partial<EvolutionMorphology>> = {
  meeting_mode: { silhouette: 'simplified' },
  creative_mode: { silhouette: 'fluid' },
  analysis_mode: { aura: 'context_full', glyphs: 'multi_layer' },
  neutral_mode: {},
};

export const LOAD_MORPHOLOGY_ADJUSTMENTS: Record<string, Partial<EvolutionMorphology>> = {
  low_load: { glyphs: 'none' },
  med_load: { glyphs: 'light' },
  high_load: { glyphs: 'multi_layer', lines: 'branching' },
};

export const ROLE_MORPHOLOGY_ADJUSTMENTS: Record<string, Partial<EvolutionMorphology>> = {
  coordinator: { halo: 'tri_wire' },
  observer: { opacity: 0.6, aura: 'none' },
  presenter: { halo: 'single_wire', aura: 'subtle' },
  participant: {},
};

// ============================================================
// SPHERE CONFIGURATIONS
// ============================================================

export const SPHERE_BUSINESS: SphereConfig = {
  type: 'business',
  name: 'Business',
  icon: '🏢',
  color: '#3B82F6',
  description: 'Commerce and operations',
  typical_meetings: ['Planning', 'Reviews', 'Deals', 'Standups'],
};

export const SPHERE_SCHOLAR: SphereConfig = {
  type: 'scholar',
  name: 'Scholar',
  icon: '📚',
  color: '#8B5CF6',
  description: 'Research and learning',
  typical_meetings: ['Studies', 'Analysis', 'Papers', 'Lectures'],
};

export const SPHERE_CREATIVE: SphereConfig = {
  type: 'creative',
  name: 'Creative',
  icon: '🎨',
  color: '#EC4899',
  description: 'Design and art',
  typical_meetings: ['Brainstorm', 'Ideation', 'Critique', 'Workshop'],
};

export const SPHERE_INSTITUTION: SphereConfig = {
  type: 'institution',
  name: 'Institution',
  icon: '🏛️',
  color: '#F59E0B',
  description: 'Governance and policy',
  typical_meetings: ['Decisions', 'Compliance', 'Board', 'Policy'],
};

export const SPHERE_SOCIAL: SphereConfig = {
  type: 'social',
  name: 'Social',
  icon: '👥',
  color: '#10B981',
  description: 'Community and personal',
  typical_meetings: ['Casual', 'Networking', 'Team', 'Social'],
};

export const SPHERE_XR: SphereConfig = {
  type: 'xr',
  name: 'XR',
  icon: '🥽',
  color: '#06B6D4',
  description: 'Immersive spaces',
  typical_meetings: ['Spatial', 'Immersive', 'VR Sessions', 'AR Review'],
};

export const SPHERES: Record<SphereType, SphereConfig> = {
  business: SPHERE_BUSINESS,
  scholar: SPHERE_SCHOLAR,
  creative: SPHERE_CREATIVE,
  institution: SPHERE_INSTITUTION,
  social: SPHERE_SOCIAL,
  xr: SPHERE_XR,
};

export const SPHERE_LIST: SphereConfig[] = [
  SPHERE_BUSINESS,
  SPHERE_SCHOLAR,
  SPHERE_CREATIVE,
  SPHERE_INSTITUTION,
  SPHERE_SOCIAL,
  SPHERE_XR,
];

// ============================================================
// NODE VISUALS
// ============================================================

export const NODE_VISUALS: Record<UniverseNodeType, UniverseNodeVisual> = {
  live: {
    type: 'live',
    color: '#10B981',
    pulse: 'slow',
    aura: 'participant_count',
  },
  scheduled: {
    type: 'scheduled',
    color: '#9CA3AF',
    pulse: 'none',
    halo: 'calendar_ring',
  },
  replay: {
    type: 'replay',
    color: '#3B82F6',
    pulse: 'none',
    glyph: 'timeline_icon',
  },
  hub: {
    type: 'hub',
    color: '#F8FAFC',
    pulse: 'none',
    ray_lines: true,
  },
};

// ============================================================
// UNIVERSE INTERACTIONS
// ============================================================

export const UNIVERSE_INTERACTIONS: InteractionConfig[] = [
  {
    interaction: 'zoom_orbit',
    name: 'Zoom Orbit',
    icon: '🔍',
    description: 'Zoom into sphere clusters',
    enabled: true,
  },
  {
    interaction: 'enter_meeting',
    name: 'Enter Meeting',
    icon: '🚪',
    description: 'Teleport to meeting room',
    enabled: true,
  },
  {
    interaction: 'open_replay',
    name: 'Open Replay',
    icon: '🔄',
    description: 'Access timeline for replay',
    enabled: true,
  },
  {
    interaction: 'expand_links',
    name: 'Expand Links',
    icon: '🔗',
    description: 'Show connections between nodes',
    enabled: true,
  },
  {
    interaction: 'filter_by_sphere',
    name: 'Filter by Sphere',
    icon: '🌐',
    description: 'Show only specific domain',
    enabled: true,
  },
  {
    interaction: 'filter_by_agent',
    name: 'Filter by Agent',
    icon: '🤖',
    description: 'Show agent-related meetings',
    enabled: true,
  },
  {
    interaction: 'silent_review_mode',
    name: 'Silent Review',
    icon: '👁️',
    description: 'Non-intrusive observation',
    enabled: true,
  },
];

// ============================================================
// SYNCHRONIZATION RULES
// ============================================================

export const SYNC_RULES: SyncRuleConfig[] = [
  {
    rule: 'temporal',
    description: 'Sort by start_time ASC, replays by original_timestamp',
    implementation: 'time_sort_asc',
    enabled: true,
  },
  {
    rule: 'sphere',
    description: 'Cluster around domain orbits',
    implementation: 'sphere_clustering',
    enabled: true,
  },
  {
    rule: 'participants',
    description: 'Links between meetings sharing users/agents/topics',
    implementation: 'participant_links',
    enabled: true,
  },
  {
    rule: 'ethics',
    description: 'Never reveal private content, emotions, sensitive metadata',
    implementation: 'privacy_filter',
    enabled: true,
  },
];

// ============================================================
// COORDINATION AGENTS
// ============================================================

export const AGENT_MEETING_COORDINATOR: CoordinationAgent = {
  type: 'meeting_coordinator',
  name: 'Meeting Coordinator',
  icon: '🗓️',
  responsibility: 'Scheduling and metadata management',
  constraint: 'No authority on decisions',
  active: true,
};

export const AGENT_UNIVERSE_RENDERER: CoordinationAgent = {
  type: 'universe_renderer',
  name: 'Universe Renderer',
  icon: '🌌',
  responsibility: 'Graph generation and visualization',
  constraint: 'Never interprets meaning',
  active: true,
};

export const AGENT_REPLAY_ENGINE: CoordinationAgent = {
  type: 'replay_engine',
  name: 'Replay Engine',
  icon: '🔄',
  responsibility: 'Export and integrity hash verification',
  constraint: 'Exact reproduction only',
  active: true,
};

export const AGENT_EVOLUTION_MONITOR: CoordinationAgent = {
  type: 'evolution_monitor',
  name: 'Evolution Monitor',
  icon: '👤',
  responsibility: 'Avatar state updates',
  constraint: 'Never influences users',
  active: true,
};

export const COORDINATION_AGENTS: CoordinationAgent[] = [
  AGENT_MEETING_COORDINATOR,
  AGENT_UNIVERSE_RENDERER,
  AGENT_REPLAY_ENGINE,
  AGENT_EVOLUTION_MONITOR,
];

// ============================================================
// DEFAULT SAFETY CONFIG
// ============================================================

export const DEFAULT_SAFETY: UniverseSafety = {
  no_bright_flashes: true,
  no_rapid_motion: true,
  fixed_comfort_glide: true,
  anchored_floor: true,
  user_free_mode: false,
};

// ============================================================
// FACTORY FUNCTIONS
// ============================================================

/**
 * Create avatar evolution from triggers
 */
export function createEvolution(
  avatarId: string,
  triggers: EvolutionTriggers
): AvatarEvolution {
  const state = computeEvolutionState(triggers);
  const morphology = computeMorphology(state, triggers);
  
  return {
    id: `evo_${Date.now()}`,
    avatar_id: avatarId,
    state,
    context: mapSessionToContext(triggers.session_context),
    info_density: computeInfoDensity(triggers.information_load),
    role_glyph: triggers.role_intensity === 'observer' ? 'observer' : 
                triggers.role_intensity === 'coordinator' ? 'agent' : 'user',
    morphology,
    triggers,
    safety_lock: true,
    user_preferences_active: !!triggers.user_override,
    last_updated: new Date().toISOString(),
  };
}

/**
 * Compute evolution state from triggers
 */
export function computeEvolutionState(triggers: EvolutionTriggers): EvolutionState {
  const { session_context, information_load, role_intensity } = triggers;
  
  // Integrated only in analysis mode with high load
  if (session_context === 'analysis_mode' && information_load === 'high_load') {
    return 'integrated';
  }
  
  // Structural in analysis mode or high load
  if (session_context === 'analysis_mode' || information_load === 'high_load') {
    return 'structural';
  }
  
  // Signal with any activity
  if (information_load !== 'low_load' || role_intensity !== 'observer') {
    return 'signal';
  }
  
  return 'base';
}

/**
 * Compute morphology from state and triggers
 */
export function computeMorphology(
  state: EvolutionState,
  triggers: EvolutionTriggers
): EvolutionMorphology {
  // Start with default for state
  let morphology = { ...DEFAULT_MORPHOLOGIES[state] };
  
  // Apply session adjustments
  const sessionAdj = SESSION_MORPHOLOGY_ADJUSTMENTS[triggers.session_context];
  if (sessionAdj) {
    morphology = { ...morphology, ...sessionAdj };
  }
  
  // Apply load adjustments
  const loadAdj = LOAD_MORPHOLOGY_ADJUSTMENTS[triggers.information_load];
  if (loadAdj) {
    morphology = { ...morphology, ...loadAdj };
  }
  
  // Apply role adjustments
  const roleAdj = ROLE_MORPHOLOGY_ADJUSTMENTS[triggers.role_intensity];
  if (roleAdj) {
    morphology = { ...morphology, ...roleAdj };
  }
  
  // User override takes priority
  if (triggers.user_override) {
    morphology = { ...morphology, ...triggers.user_override };
  }
  
  return morphology;
}

/**
 * Map session mode to evolution context
 */
function mapSessionToContext(session: string): EvolutionContext {
  const map: Record<string, EvolutionContext> = {
    meeting_mode: 'meeting',
    creative_mode: 'creative',
    analysis_mode: 'analysis',
    neutral_mode: 'neutral',
  };
  return map[session] || 'neutral';
}

/**
 * Compute info density from load
 */
function computeInfoDensity(load: string): number {
  const map: Record<string, number> = {
    low_load: 0.2,
    med_load: 0.5,
    high_load: 0.9,
  };
  return map[load] || 0.0;
}

/**
 * Create universe node
 */
export function createUniverseNode(
  id: string,
  type: UniverseNodeType,
  sphere: SphereType,
  title: string,
  participants: string[],
  timestamp: number
): UniverseNode {
  const visual = NODE_VISUALS[type];
  
  // Calculate position based on sphere
  const sphereIndex = SPHERE_LIST.findIndex(s => s.type === sphere);
  const angle = (sphereIndex / SPHERE_LIST.length) * Math.PI * 2;
  const radius = 5;
  
  return {
    id,
    type,
    sphere,
    title,
    participants,
    timestamp,
    position: {
      x: Math.cos(angle) * radius,
      y: (Math.random() - 0.5) * 2,
      z: Math.sin(angle) * radius,
    },
    metadata: {},
    visual,
  };
}

/**
 * Create link between nodes
 */
export function createUniverseLink(
  fromId: string,
  toId: string,
  type: LinkType
): UniverseLink {
  return {
    id: `link_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    from: fromId,
    to: toId,
    type,
    strength: type === 'shared_agent' ? 0.8 : type === 'shared_user' ? 0.9 : 0.5,
    visible: true,
  };
}

/**
 * Get sphere by type
 */
export function getSphere(type: SphereType): SphereConfig {
  return SPHERES[type];
}

/**
 * Get evolution state config
 */
export function getEvolutionState(state: EvolutionState): EvolutionStateConfig {
  return EVOLUTION_STATES[state];
}
