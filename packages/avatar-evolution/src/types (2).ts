/**
 * CHE·NU — AVATAR EVOLUTION SYSTEM + MULTI-MEETING UNIVERSE VIEW
 * Types & Interfaces
 * 
 * XR.v1.2
 * Avatar evolution based ONLY on objective system states — NOT psychology.
 * Universe view for meeting coordination and navigation.
 * 
 * RULE: Evolution = INFORMATIONAL STATE, not identity shaping.
 */

// ============================================================
// EVOLUTION STATES
// ============================================================

export type EvolutionState = 
  | 'base'
  | 'signal'
  | 'structural'
  | 'integrated';

export interface EvolutionStateConfig {
  state: EvolutionState;
  name: string;
  description: string;
  visual: string;
  context: string;
  complexity: number;  // 0.0-1.0
}

// ============================================================
// EVOLUTION CONTEXT
// ============================================================

export type EvolutionContext = 
  | 'analysis'
  | 'creative'
  | 'decision'
  | 'review'
  | 'meeting'
  | 'neutral';

// ============================================================
// EVOLUTION TRIGGERS
// ============================================================

export type SessionMode = 
  | 'meeting_mode'
  | 'creative_mode'
  | 'analysis_mode'
  | 'neutral_mode';

export type InformationLoad = 
  | 'low_load'
  | 'med_load'
  | 'high_load';

export type RoleIntensity = 
  | 'coordinator'
  | 'observer'
  | 'presenter'
  | 'participant';

export interface EvolutionTriggers {
  session_context: SessionMode;
  information_load: InformationLoad;
  role_intensity: RoleIntensity;
  user_override?: Partial<EvolutionMorphology>;
}

// ============================================================
// EVOLUTION MORPHOLOGY
// ============================================================

export interface EvolutionMorphology {
  silhouette: 'simplified' | 'normal' | 'fluid' | 'fractal';
  glyphs: 'none' | 'light' | 'multi_layer';
  aura: 'none' | 'subtle' | 'informational' | 'context_full';
  halo: 'none' | 'single_wire' | 'tri_wire';
  lines: 'none' | 'branching' | 'data_paths';
  opacity: number;  // 0.0-1.0
}

// ============================================================
// AVATAR EVOLUTION CONFIG
// ============================================================

export interface AvatarEvolution {
  id: string;
  avatar_id: string;
  
  state: EvolutionState;
  context: EvolutionContext;
  info_density: number;  // 0.0-1.0
  role_glyph: 'agent' | 'user' | 'observer';
  
  morphology: EvolutionMorphology;
  triggers: EvolutionTriggers;
  
  safety_lock: boolean;
  user_preferences_active: boolean;
  
  last_updated: string;
}

// ============================================================
// EVOLUTION CONSTRAINTS (NEVER ALLOWED)
// ============================================================

export interface EvolutionConstraint {
  id: string;
  name: string;
  description: string;
  enforced: boolean;
}

export const EVOLUTION_NEVER_ALLOWED: EvolutionConstraint[] = [
  { id: 'no_faces', name: 'No Faces', description: 'No facial features or expressions', enforced: true },
  { id: 'no_emotions', name: 'No Emotions', description: 'No mood representation', enforced: true },
  { id: 'no_identity', name: 'No Identity', description: 'No personality traits', enforced: true },
  { id: 'no_manipulation', name: 'No Dynamic Manipulation', description: 'No psychological influence', enforced: true },
];

// ============================================================
// UNIVERSE NODE TYPES
// ============================================================

export type UniverseNodeType = 
  | 'live'
  | 'scheduled'
  | 'replay'
  | 'hub';

export interface UniverseNodeVisual {
  type: UniverseNodeType;
  color: string;
  pulse?: 'none' | 'slow' | 'fast';
  aura?: string;
  halo?: string;
  glyph?: string;
  ray_lines?: boolean;
}

// ============================================================
// SPHERE TYPES
// ============================================================

export type SphereType = 
  | 'business'
  | 'scholar'
  | 'creative'
  | 'institution'
  | 'social'
  | 'xr';

export interface SphereConfig {
  type: SphereType;
  name: string;
  icon: string;
  color: string;
  description: string;
  typical_meetings: string[];
}

// ============================================================
// UNIVERSE NODE
// ============================================================

export interface UniverseNode {
  id: string;
  type: UniverseNodeType;
  sphere: SphereType;
  
  title: string;
  participants: string[];  // user_id or agent_id
  
  timestamp: number;  // Unix timestamp
  scheduled_time?: string;  // ISO for scheduled
  
  position: { x: number; y: number; z: number };
  
  metadata: {
    topic?: string;
    tags?: string[];
    duration_minutes?: number;
    recording_available?: boolean;
  };
  
  visual: UniverseNodeVisual;
}

// ============================================================
// UNIVERSE LINK TYPES
// ============================================================

export type LinkType = 
  | 'shared_topic'
  | 'shared_agent'
  | 'shared_user'
  | 'sequence'
  | 'reference';

export interface UniverseLink {
  id: string;
  from: string;  // node_id
  to: string;    // node_id
  type: LinkType;
  strength: number;  // 0.0-1.0
  visible: boolean;
}

// ============================================================
// UNIVERSE MEETINGS
// ============================================================

export interface UniverseMeetings {
  nodes: UniverseNode[];
  links: UniverseLink[];
  last_sync: string;
}

// ============================================================
// SYNCHRONIZATION RULES
// ============================================================

export type SyncRule = 
  | 'temporal'
  | 'sphere'
  | 'participants'
  | 'ethics';

export interface SyncRuleConfig {
  rule: SyncRule;
  description: string;
  implementation: string;
  enabled: boolean;
}

// ============================================================
// UNIVERSE INTERACTIONS
// ============================================================

export type UniverseInteraction = 
  | 'zoom_orbit'
  | 'enter_meeting'
  | 'open_replay'
  | 'expand_links'
  | 'filter_by_sphere'
  | 'filter_by_agent'
  | 'silent_review_mode';

export interface InteractionConfig {
  interaction: UniverseInteraction;
  name: string;
  icon: string;
  description: string;
  enabled: boolean;
}

// ============================================================
// FORBIDDEN UNIVERSE INTERACTIONS
// ============================================================

export type ForbiddenInteraction = 
  | 'persuasion'
  | 'visual_dominance'
  | 'forced_focus';

export const FORBIDDEN_UNIVERSE_INTERACTIONS: ForbiddenInteraction[] = [
  'persuasion',
  'visual_dominance',
  'forced_focus',
];

// ============================================================
// UNIVERSE SAFETY
// ============================================================

export interface UniverseSafety {
  no_bright_flashes: boolean;
  no_rapid_motion: boolean;
  fixed_comfort_glide: boolean;
  anchored_floor: boolean;
  user_free_mode: boolean;
}

// ============================================================
// COORDINATION AGENTS
// ============================================================

export type CoordinationAgentType = 
  | 'meeting_coordinator'
  | 'universe_renderer'
  | 'replay_engine'
  | 'evolution_monitor';

export interface CoordinationAgent {
  type: CoordinationAgentType;
  name: string;
  icon: string;
  responsibility: string;
  constraint: string;
  active: boolean;
}

// ============================================================
// UNIVERSE VIEW STATE
// ============================================================

export interface UniverseViewState {
  current_sphere_filter: SphereType | null;
  current_agent_filter: string | null;
  zoom_level: number;  // 0.0-1.0
  center_position: { x: number; y: number; z: number };
  visible_nodes: string[];
  expanded_links: string[];
  interaction_mode: UniverseInteraction | null;
  safety: UniverseSafety;
}

// ============================================================
// EVOLUTION RUNTIME STATE
// ============================================================

export interface EvolutionRuntimeState {
  current_evolution: AvatarEvolution | null;
  transition_in_progress: boolean;
  transition_progress: number;  // 0.0-1.0
  trigger_history: EvolutionTriggers[];
}

// ============================================================
// FULL SYSTEM STATE
// ============================================================

export interface AvatarEvolutionUniverseState {
  evolution: EvolutionRuntimeState;
  universe: UniverseMeetings;
  view: UniverseViewState;
  agents: CoordinationAgent[];
}
