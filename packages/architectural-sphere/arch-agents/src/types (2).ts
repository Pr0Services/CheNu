/**
 * CHE·NU — ARCHITECTURAL AGENT SYSTEM
 * Types & Interfaces
 * 
 * Foundation v1.0
 * Architectural Agents DESIGN SPACE.
 * They NEVER influence logic, decisions, behavior, or data authority.
 */

// ============================================================
// AGENT IDENTIFIERS
// ============================================================

export type ArchitecturalAgentId =
  | 'AGENT_ARCHITECT_PLANNER'
  | 'AGENT_DECOR_DESIGNER'
  | 'AGENT_AVATAR_ARCHITECT'
  | 'AGENT_NAVIGATION_DESIGNER'
  | 'AGENT_DOMAIN_ADAPTER'
  | 'AGENT_VALIDATION_GUARD'
  | 'AGENT_ORCHESTRATOR';

export type AgentState = 'off' | 'activating' | 'active' | 'processing' | 'exporting' | 'deactivating';

// ============================================================
// OUTPUT TYPES
// ============================================================

export type ArchitecturalOutputType = 'plan' | 'decor' | 'avatar' | 'navigation' | 'bundle';

export interface ArchitecturalOutput<T = unknown> {
  type: ArchitecturalOutputType;
  source_agent: ArchitecturalAgentId;
  domain: string;
  version: string;
  hash: string;
  requires_approval: boolean;
  created_at: string;
  payload: T;
  metadata?: Record<string, unknown>;
}

// ============================================================
// PLAN TYPES (from Planner Agent)
// ============================================================

export interface PlanZone {
  zone_id: string;
  name: string;
  purpose: 'conversation' | 'visual' | 'navigation' | 'work' | 'reflection';
  capacity: number;
  visibility: 'public' | 'private' | 'invite';
  bounds?: {
    x: number;
    y: number;
    z?: number;
    width: number;
    height: number;
    depth?: number;
  };
}

export interface PlanNavigation {
  mode: 'free' | 'guided' | 'contextual';
  minimap: boolean;
  waypoints?: Array<{ id: string; label: string; position: { x: number; y: number; z?: number } }>;
  entry_point?: string;
  exit_points?: string[];
}

export interface PlanOutput {
  plan_id: string;
  name: string;
  domain: string;
  layout: 'room' | 'hub' | 'radial' | 'layered';
  dimension: '2d' | '3d' | 'xr';
  zones: PlanZone[];
  navigation: PlanNavigation;
}

// ============================================================
// DECOR TYPES (from Decor Designer Agent)
// ============================================================

export interface DecorColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
}

export interface DecorLighting {
  type: 'ambient' | 'directional' | 'point' | 'mixed';
  intensity: number;
  color: string;
  shadows: boolean;
}

export interface DecorAtmosphere {
  fog: boolean;
  fog_density?: number;
  particles: boolean;
  particle_type?: string;
}

export interface DecorOutput {
  decor_id: string;
  name: string;
  theme: string;
  domain: string;
  dimension: '2d' | '3d' | 'xr';
  comfort_level: 'minimal' | 'balanced' | 'immersive';
  colors: DecorColors;
  lighting: DecorLighting;
  atmosphere?: DecorAtmosphere;
  materials?: {
    floor?: string;
    walls?: string;
    ceiling?: string;
  };
  assets_manifest?: string[];
}

// ============================================================
// AVATAR TYPES (from Avatar Architect Agent)
// ============================================================

export interface AvatarVisual {
  style: 'abstract' | 'humanoid' | 'symbolic' | 'custom';
  primary_color: string;
  accent_color: string;
  glow: boolean;
  glow_color?: string;
  animation: 'idle' | 'active' | 'thinking' | 'none';
}

export interface AvatarPresence {
  size: 'small' | 'medium' | 'large';
  opacity: number;
  aura_radius: number;
  aura_color?: string;
}

export interface AvatarOutput {
  avatar_id: string;
  name: string;
  agent_role: string;
  theme: string;
  visibility_level: 'minimal' | 'standard' | 'prominent';
  visual: AvatarVisual;
  presence: AvatarPresence;
  role_indicator?: {
    visible: boolean;
    badge?: string;
    label?: string;
  };
}

// ============================================================
// NAVIGATION TYPES (from Navigation Designer Agent)
// ============================================================

export interface NavigationWaypoint {
  id: string;
  label: string;
  position: { x: number; y: number; z?: number };
  zone_id?: string;
  icon?: string;
}

export interface NavigationPath {
  from: string;
  to: string;
  bidirectional: boolean;
  style?: 'direct' | 'curved' | 'stepped';
}

export interface NavigationOutput {
  nav_id: string;
  plan_id: string;
  user_type: 'visitor' | 'member' | 'admin';
  mode: 'free' | 'guided' | 'contextual';
  minimap: {
    enabled: boolean;
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    scale: number;
  };
  waypoints: NavigationWaypoint[];
  paths: NavigationPath[];
  entry_point: string;
  exit_points: string[];
}

// ============================================================
// BUNDLE TYPE (from Orchestrator)
// ============================================================

export interface ArchitecturalBundle {
  bundle_id: string;
  plans: ArchitecturalOutput<PlanOutput>[];
  decors: ArchitecturalOutput<DecorOutput>[];
  avatars: ArchitecturalOutput<AvatarOutput>[];
  navigation: ArchitecturalOutput<NavigationOutput>[];
  version: string;
  hash: string;
  status: 'proposal_only' | 'approved' | 'rejected' | 'deployed';
  validation: {
    passed: boolean;
    validators: string[];
    errors?: string[];
  };
  created_at: string;
  created_by: string;
}

// ============================================================
// AGENT DEFINITIONS
// ============================================================

export interface AgentDefinition {
  id: ArchitecturalAgentId;
  name: string;
  role: string;
  inputs: string[];
  outputs: string[];
  limits: string[];
  color: string;
}

export const AGENT_DEFINITIONS: Record<ArchitecturalAgentId, AgentDefinition> = {
  AGENT_ARCHITECT_PLANNER: {
    id: 'AGENT_ARCHITECT_PLANNER',
    name: 'Architect Planner',
    role: 'Create spatial plans (rooms, hubs, layouts), define zones and navigation',
    inputs: ['Domain type', 'Capacity', 'Purpose'],
    outputs: ['Plan JSON (canonical)'],
    limits: ['No workflow logic', 'No task chaining'],
    color: '#3B82F6',
  },
  AGENT_DECOR_DESIGNER: {
    id: 'AGENT_DECOR_DESIGNER',
    name: 'Decor Designer',
    role: 'Create decor themes (2D/3D/XR), visual atmosphere, materials, lighting',
    inputs: ['Theme', 'Domain', 'Comfort level'],
    outputs: ['Decor preset', 'Assets manifest'],
    limits: ['No psychological manipulation', 'No hidden cues'],
    color: '#10B981',
  },
  AGENT_AVATAR_ARCHITECT: {
    id: 'AGENT_AVATAR_ARCHITECT',
    name: 'Avatar Architect',
    role: 'Design avatar & agent visual shells, presence style, scale, aura',
    inputs: ['Agent role', 'Theme', 'Visibility level'],
    outputs: ['Avatar shell config'],
    limits: ['Avatar ≠ intelligence', 'Avatar ≠ permissions'],
    color: '#EC4899',
  },
  AGENT_NAVIGATION_DESIGNER: {
    id: 'AGENT_NAVIGATION_DESIGNER',
    name: 'Navigation Designer',
    role: 'Visual navigation, minimap & spatial orientation, entry/exit clarity',
    inputs: ['Plan structure', 'User type'],
    outputs: ['Navigation map'],
    limits: ['No funneling behavior', 'No coercive flow'],
    color: '#06B6D4',
  },
  AGENT_DOMAIN_ADAPTER: {
    id: 'AGENT_DOMAIN_ADAPTER',
    name: 'Domain Adapter',
    role: 'Adapt designs to domain constraints, ensure compatibility',
    inputs: ['Domain rules', 'Target sphere'],
    outputs: ['Adapted plan/decor variant'],
    limits: ['Cannot bypass domain laws'],
    color: '#F59E0B',
  },
  AGENT_VALIDATION_GUARD: {
    id: 'AGENT_VALIDATION_GUARD',
    name: 'Validation Guard',
    role: 'Verify architectural exports, ethics + rule compliance',
    inputs: ['Any architectural output'],
    outputs: ['Approved / Rejected'],
    limits: ['No modifications', 'Report only'],
    color: '#6B7280',
  },
  AGENT_ORCHESTRATOR: {
    id: 'AGENT_ORCHESTRATOR',
    name: 'Orchestrator',
    role: 'Coordinate all architectural agents, aggregate outputs',
    inputs: ['Design request', 'Domain', 'Constraints'],
    outputs: ['Architectural bundle'],
    limits: ['No approval authority', 'No export activation', 'No domain override'],
    color: '#8B5CF6',
  },
};

// ============================================================
// REQUEST TYPES
// ============================================================

export type RequestType = 'space' | 'visual' | 'avatar' | 'navigation' | 'domain-specific' | 'full';

export interface DesignRequest {
  request_id: string;
  type: RequestType;
  domain: string;
  purpose: string;
  constraints: {
    capacity?: number;
    dimension?: '2d' | '3d' | 'xr';
    theme?: string;
    comfort_level?: 'minimal' | 'balanced' | 'immersive';
  };
  user_preferences?: Record<string, unknown>;
  requested_by: string;
  requested_at: string;
}

// ============================================================
// ACTIVATION TRIGGERS
// ============================================================

export type ActivationTrigger = 'manual_request' | 'scheduled_review' | 'domain_activation';

export interface ActivationEvent {
  trigger: ActivationTrigger;
  target_agents: ArchitecturalAgentId[];
  request?: DesignRequest;
  timestamp: string;
}

// ============================================================
// VALIDATION
// ============================================================

export interface ValidationResult {
  valid: boolean;
  agent: ArchitecturalAgentId;
  checks: Array<{
    name: string;
    passed: boolean;
    message?: string;
  }>;
  timestamp: string;
}

// ============================================================
// ETHICAL CONSTRAINTS (enforced)
// ============================================================

export const ETHICAL_CONSTRAINTS = [
  'no_emotional_steering',
  'no_cognitive_pressure',
  'transparency_required',
  'comfort_over_spectacle',
  'clarity_over_immersion',
  'no_hidden_influence',
] as const;

export type EthicalConstraint = typeof ETHICAL_CONSTRAINTS[number];

// ============================================================
// FORBIDDEN ACTIONS (per agent)
// ============================================================

export const AGENT_FORBIDDEN_ACTIONS: Record<ArchitecturalAgentId, string[]> = {
  AGENT_ARCHITECT_PLANNER: ['workflow_logic', 'task_chaining', 'behavior_control'],
  AGENT_DECOR_DESIGNER: ['psychological_manipulation', 'hidden_cues', 'subliminal_patterns'],
  AGENT_AVATAR_ARCHITECT: ['permission_grants', 'intelligence_definition', 'capability_assignment'],
  AGENT_NAVIGATION_DESIGNER: ['funneling_behavior', 'coercive_flow', 'dark_patterns'],
  AGENT_DOMAIN_ADAPTER: ['domain_bypass', 'rule_override', 'constraint_violation'],
  AGENT_VALIDATION_GUARD: ['output_modification', 'approval_grant', 'design_changes'],
  AGENT_ORCHESTRATOR: ['approval_authority', 'export_activation', 'domain_override', 'data_access'],
};
