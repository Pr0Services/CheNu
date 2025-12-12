/* =====================================================
   CHE·NU — SPHERE SCHEMA TYPES
   Status: FOUNDATIONAL
   Purpose: TypeScript types for sphere definitions
   
   Every sphere in CHE·NU must conform to this schema.
   The schema enforces inheritance of global laws,
   privacy guarantees, and human sovereignty.
   
   No sphere may override foundational protections.
   
   ❤️ With love, for humanity.
   ===================================================== */

/* =========================================================
   SPHERE IDENTITY
   ========================================================= */

/**
 * Core sphere identity.
 */
export interface SphereIdentity {
  /** Human-readable name */
  name: string;
  /** Unique slug identifier */
  id: string;
  /** Visual emoji representation */
  emoji: string;
  /** Human-readable purpose description */
  description: string;
  /** Schema version */
  version: string;
}

/* =========================================================
   INHERITANCE
   ========================================================= */

/**
 * What the sphere inherits from global foundations.
 * These cannot be overridden.
 */
export interface SphereInheritance {
  /** Inherits Tree Laws, Core Constitution */
  foundation: true;
  /** Privacy guarantees apply */
  privacy: true;
  /** Global structural laws apply */
  global_structural_laws: true;
  /** All silence modes available */
  silence_modes: true;
}

/* =========================================================
   CONTEXT ISOLATION
   ========================================================= */

/**
 * Bridge types for cross-sphere communication.
 */
export type BridgeType = 'manual_reference' | 'explicit_user_action';

/**
 * Context isolation configuration.
 * Spheres are isolated by default.
 */
export interface SphereContext {
  /** Context is isolated by default */
  isolated_by_default: true;
  /** Requires explicit bridge to share */
  requires_explicit_bridge: true;
  /** Allowed bridge types */
  bridge_types: BridgeType[];
}

/* =========================================================
   TIME
   ========================================================= */

/**
 * Sphere lifecycle states.
 */
export type SphereState = 'active' | 'dormant' | 'archived';

/**
 * Time configuration for sphere.
 * Each sphere has its own timeline.
 */
export interface SphereTime {
  /** Sphere has its own local timeline */
  local_timeline: true;
  /** Available states */
  states: SphereState[];
  /** No urgency pressure from system */
  no_global_pressure: true;
}

/* =========================================================
   AGENTS
   ========================================================= */

/**
 * Forbidden agent capabilities.
 * These are NEVER allowed in any sphere.
 */
export type ForbiddenCapability =
  | 'profiling'
  | 'implicit_memory'
  | 'cross_sphere_observation';

/**
 * Agent configuration within sphere.
 */
export interface SphereAgents {
  /** Agents are allowed */
  allowed: boolean;
  /** Agents are scope-limited to sphere */
  scope_limited: true;
  /** Agents can create sub-agents */
  can_create_subagents: boolean;
  /** Capabilities that are FORBIDDEN */
  forbidden_capabilities: ForbiddenCapability[];
}

/* =========================================================
   DATA SOVEREIGNTY
   ========================================================= */

/**
 * Data ownership and sovereignty.
 * Human owns ALL data.
 */
export interface SphereData {
  /** Data ownership - always human */
  ownership: 'human';
  /** Private by default */
  private_by_default: true;
  /** Data is always exportable */
  exportable: true;
  /** Can delete without justification */
  deletable_without_justification: true;
}

/* =========================================================
   SILENCE MODES
   ========================================================= */

/**
 * Available silence modes.
 */
export type SilenceMode =
  | 'context_recovery'
  | 'visual_silence'
  | 'silent_review';

/**
 * Behavior during silence.
 */
export interface SilenceBehavior {
  /** No learning during silence */
  learning: false;
  /** No suggestions during silence */
  suggestion: false;
  /** Minimal analytics only */
  analytics: 'minimal';
}

/**
 * Silence modes configuration.
 */
export interface SphereSilenceModes {
  /** Available silence modes */
  available: SilenceMode[];
  /** Behavior during silence */
  behavior_during_silence: SilenceBehavior;
}

/* =========================================================
   UX PRINCIPLES
   ========================================================= */

/**
 * UX configuration.
 * Human-centered interface principles.
 */
export interface SphereUX {
  /** Start with minimal interface */
  default_state: 'minimal';
  /** Reveal complexity progressively */
  progressive_disclosure: true;
  /** No fake urgency patterns */
  no_urgency_patterns: true;
  /** No gamification/performance indicators */
  no_performance_indicators: true;
}

/* =========================================================
   REVERSIBILITY
   ========================================================= */

/**
 * Actions that are always reversible.
 */
export type ReversibleAction =
  | 'agent_creation'
  | 'workflow_change'
  | 'structure_edit';

/**
 * Reversibility configuration.
 * All actions can be undone.
 */
export interface SphereReversibility {
  /** Reversibility enabled */
  enabled: true;
  /** Actions that are always reversible */
  reversible_actions: ReversibleAction[];
  /** Irreversible actions require explicit consent */
  irreversible_only_with_consent: true;
}

/* =========================================================
   INTERACTIONS
   ========================================================= */

/**
 * Cross-sphere interaction configuration.
 */
export interface SphereInteractions {
  /** Interactions allowed */
  allowed: boolean;
  /** User must explicitly initiate */
  requires_explicit_user_action: true;
  /** No automatic background sync */
  no_automatic_sync: true;
}

/* =========================================================
   VALIDATION
   ========================================================= */

/**
 * Validation rules.
 * Ensures compliance with global laws.
 */
export interface SphereValidation {
  /** Must respect all global laws */
  respects_all_global_laws: true;
  /** No privacy violations allowed */
  no_privacy_violation: true;
  /** No behavioral optimization allowed */
  no_behavioral_optimization: true;
  /** Reversible by default */
  reversible_by_default: true;
  /** Must be approved by human */
  approved_by_human: true;
}

/* =========================================================
   COMPLETE SPHERE SCHEMA
   ========================================================= */

/**
 * Complete sphere definition.
 * Every sphere in CHE·NU must conform to this schema.
 */
export interface SphereSchema {
  /** Sphere identity */
  sphere: SphereIdentity;
  /** Inherited foundations (cannot be overridden) */
  inherits: SphereInheritance;
  /** Context isolation */
  context: SphereContext;
  /** Time configuration */
  time: SphereTime;
  /** Agent configuration */
  agents: SphereAgents;
  /** Data sovereignty */
  data: SphereData;
  /** Silence modes */
  silence_modes: SphereSilenceModes;
  /** UX principles */
  ux: SphereUX;
  /** Reversibility */
  reversibility: SphereReversibility;
  /** Interactions */
  interactions: SphereInteractions;
  /** Validation */
  validation: SphereValidation;
}

/* =========================================================
   DEFAULTS
   ========================================================= */

/**
 * Default sphere inheritance.
 * These values are REQUIRED and cannot be changed.
 */
export const SPHERE_INHERITANCE_DEFAULTS: SphereInheritance = {
  foundation: true,
  privacy: true,
  global_structural_laws: true,
  silence_modes: true,
};

/**
 * Default sphere context.
 */
export const SPHERE_CONTEXT_DEFAULTS: SphereContext = {
  isolated_by_default: true,
  requires_explicit_bridge: true,
  bridge_types: ['manual_reference', 'explicit_user_action'],
};

/**
 * Default sphere time configuration.
 */
export const SPHERE_TIME_DEFAULTS: SphereTime = {
  local_timeline: true,
  states: ['active', 'dormant', 'archived'],
  no_global_pressure: true,
};

/**
 * Default sphere agent configuration.
 */
export const SPHERE_AGENTS_DEFAULTS: SphereAgents = {
  allowed: true,
  scope_limited: true,
  can_create_subagents: true,
  forbidden_capabilities: ['profiling', 'implicit_memory', 'cross_sphere_observation'],
};

/**
 * Default sphere data configuration.
 */
export const SPHERE_DATA_DEFAULTS: SphereData = {
  ownership: 'human',
  private_by_default: true,
  exportable: true,
  deletable_without_justification: true,
};

/**
 * Default silence modes configuration.
 */
export const SPHERE_SILENCE_DEFAULTS: SphereSilenceModes = {
  available: ['context_recovery', 'visual_silence', 'silent_review'],
  behavior_during_silence: {
    learning: false,
    suggestion: false,
    analytics: 'minimal',
  },
};

/**
 * Default UX configuration.
 */
export const SPHERE_UX_DEFAULTS: SphereUX = {
  default_state: 'minimal',
  progressive_disclosure: true,
  no_urgency_patterns: true,
  no_performance_indicators: true,
};

/**
 * Default reversibility configuration.
 */
export const SPHERE_REVERSIBILITY_DEFAULTS: SphereReversibility = {
  enabled: true,
  reversible_actions: ['agent_creation', 'workflow_change', 'structure_edit'],
  irreversible_only_with_consent: true,
};

/**
 * Default interactions configuration.
 */
export const SPHERE_INTERACTIONS_DEFAULTS: SphereInteractions = {
  allowed: true,
  requires_explicit_user_action: true,
  no_automatic_sync: true,
};

/**
 * Default validation configuration.
 */
export const SPHERE_VALIDATION_DEFAULTS: SphereValidation = {
  respects_all_global_laws: true,
  no_privacy_violation: true,
  no_behavioral_optimization: true,
  reversible_by_default: true,
  approved_by_human: true,
};

/* =========================================================
   FACTORY
   ========================================================= */

/**
 * Create a new sphere with defaults.
 */
export function createSphere(
  identity: SphereIdentity,
  overrides?: {
    agents?: Partial<Pick<SphereAgents, 'allowed' | 'can_create_subagents'>>;
    interactions?: Partial<Pick<SphereInteractions, 'allowed'>>;
  }
): SphereSchema {
  return {
    sphere: identity,
    inherits: SPHERE_INHERITANCE_DEFAULTS,
    context: SPHERE_CONTEXT_DEFAULTS,
    time: SPHERE_TIME_DEFAULTS,
    agents: {
      ...SPHERE_AGENTS_DEFAULTS,
      ...overrides?.agents,
    },
    data: SPHERE_DATA_DEFAULTS,
    silence_modes: SPHERE_SILENCE_DEFAULTS,
    ux: SPHERE_UX_DEFAULTS,
    reversibility: SPHERE_REVERSIBILITY_DEFAULTS,
    interactions: {
      ...SPHERE_INTERACTIONS_DEFAULTS,
      ...overrides?.interactions,
    },
    validation: SPHERE_VALIDATION_DEFAULTS,
  };
}

/* =========================================================
   VALIDATOR
   ========================================================= */

/**
 * Validation error.
 */
export interface SphereValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

/**
 * Validate a sphere against the schema.
 * Returns errors if sphere violates foundational rules.
 */
export function validateSphere(sphere: SphereSchema): SphereValidationError[] {
  const errors: SphereValidationError[] = [];

  // Check inheritance - CANNOT be overridden
  if (!sphere.inherits.foundation) {
    errors.push({
      field: 'inherits.foundation',
      message: 'Foundation inheritance is REQUIRED',
      severity: 'error',
    });
  }

  if (!sphere.inherits.privacy) {
    errors.push({
      field: 'inherits.privacy',
      message: 'Privacy inheritance is REQUIRED',
      severity: 'error',
    });
  }

  // Check data ownership
  if (sphere.data.ownership !== 'human') {
    errors.push({
      field: 'data.ownership',
      message: 'Data ownership MUST be "human"',
      severity: 'error',
    });
  }

  // Check forbidden capabilities
  const requiredForbidden: ForbiddenCapability[] = [
    'profiling',
    'implicit_memory',
    'cross_sphere_observation',
  ];

  for (const capability of requiredForbidden) {
    if (!sphere.agents.forbidden_capabilities.includes(capability)) {
      errors.push({
        field: 'agents.forbidden_capabilities',
        message: `Capability "${capability}" MUST be forbidden`,
        severity: 'error',
      });
    }
  }

  // Check UX principles
  if (!sphere.ux.no_urgency_patterns) {
    errors.push({
      field: 'ux.no_urgency_patterns',
      message: 'Urgency patterns are NOT allowed',
      severity: 'error',
    });
  }

  // Check validation flags
  if (!sphere.validation.no_privacy_violation) {
    errors.push({
      field: 'validation.no_privacy_violation',
      message: 'Privacy violations are NOT allowed',
      severity: 'error',
    });
  }

  if (!sphere.validation.no_behavioral_optimization) {
    errors.push({
      field: 'validation.no_behavioral_optimization',
      message: 'Behavioral optimization is NOT allowed',
      severity: 'error',
    });
  }

  return errors;
}

/**
 * Check if sphere is valid.
 */
export function isSphereValid(sphere: SphereSchema): boolean {
  const errors = validateSphere(sphere);
  return errors.filter(e => e.severity === 'error').length === 0;
}

/* =========================================================
   EXPORTS
   ========================================================= */

export default SphereSchema;
