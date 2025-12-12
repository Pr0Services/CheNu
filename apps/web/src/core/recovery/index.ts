/* =====================================================
   CHE·NU — CONTEXT RECOVERY MODULE (FOUNDATIONAL)
   Status: CORE STABILITY MECHANISM
   Authority: HUMAN ONLY
   Automation: ZERO
   Scope: COGNITIVE SAFETY + SYSTEM CONTINUITY
   ===================================================== */

// === PHILOSOPHICAL FOUNDATION ===
export {
  RECOVERY_PHILOSOPHY,
  RECOVERY_ROOT_REASONS,
  INTENT_SANCTUARY_PRINCIPLE,
  RECOVERY_TRUTH_RELATIONSHIP,
} from './contextRecovery.types';

// === TYPES ===
export {
  // Trigger types
  type RecoveryTrigger,
  type RecoveryReason, // deprecated

  // Core types
  type ContextDepth,
  type SessionPace,
  type PreferenceMode,
  type RecoveryInternalState,
  type RecoveryPhase,

  // Input types
  type RecoveryDeclaration,

  // State types
  type KnownContextSnapshot,
  type RecoveryState,
  type RecoveryMessage,
  type RecoveryResult,
  type RecoveryAction,
  type RecoveryAuditEntry,

  // Config types
  type RecoveryVisualConfig,
  type RecoveryXRConfig,

  // Constants - Core
  DEFAULT_RECOVERY_VISUAL_CONFIG,
  DEFAULT_RECOVERY_XR_CONFIG,
  INITIAL_RECOVERY_STATE,
  DEFAULT_DECLARATION_VALUES,

  // Constants - Language & Behavior
  RECOVERY_LANGUAGE,
  FORBIDDEN_RECOVERY_LANGUAGE,
  ALLOWED_RECOVERY_VERBS,
  RECOVERY_BEHAVIOR_RULES,

  // Constants - Micro-boundaries & Cognitive Load
  RECOVERY_MICRO_BOUNDARIES,
  COGNITIVE_LOAD_RULES,
  TEMPORAL_BUFFER_RULES,
  FRACTAL_CONSISTENCY,
  ANTI_MISUSE_SAFEGUARDS,
  REFLECTIVE_SURFACE_RULES,
  FAILURE_STATE_RULES,

  // Constants - Edge Cases & Relationships
  RECOVERY_EDGE_CASES,
  RECOVERY_SYSTEM_RELATIONSHIPS,

  // Constants - Failsafes & Audit
  RECOVERY_FAILSAFES,
  RECOVERY_AUDIT_RULES,

  // Constants - Internal States & Declarations
  RECOVERY_INTERNAL_STATES,
  CONTEXT_RECOVERY_DECLARATION,
  CONTEXT_RECOVERY_FOUNDATIONAL_DECLARATION,

  // Type guards
  isRecoveryInProgress,
  canInitiateRecovery,
  requiresConfirmation,
} from './contextRecovery.types';

// === ENGINE ===
export {
  // Reducer
  recoveryReducer,

  // Helpers
  gatherKnownContexts,
  createDeclaration,
  processRecovery,
  validateDeclaration,
  validateFailsafes,
  formatContextForDisplay,
  formatContextsSummary,

  // Flow class
  ContextRecoveryFlow,
  createRecoveryFlow,
} from './contextRecoveryEngine';

// === UI COMPONENTS ===
export {
  // Main view
  ContextRecoveryView,
  type ContextRecoveryViewProps,

  // Trigger button
  ContextRecoveryTrigger,
  type ContextRecoveryTriggerProps,

  // Hook
  useContextRecovery,
} from './ContextRecoveryView';
