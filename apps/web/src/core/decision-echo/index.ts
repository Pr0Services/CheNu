/**
 * CHE·NU — DECISION ECHO SYSTEM
 * 
 * Status: OBSERVATIONAL DECISION MEMORY
 * Authority: NONE
 * Intent: TRANSPARENCY WITHOUT INFLUENCE
 * 
 * Decision Echo exists to reflect past decisions as they were taken,
 * without evaluation, reinforcement, or guidance.
 * 
 * It answers only: "What decision was made, and in what context?"
 * It NEVER answers: "Was it good?" "Should it be repeated?" "What comes next?"
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * SYSTEM DECLARATION
 * 
 * Decision Echo exists to preserve memory,
 * not to anchor behavior.
 * 
 * A decision remembered is not a decision repeated.
 * A record observed is not a path enforced.
 * 
 * Responsibility remains human.
 * Awareness remains optional.
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export {
  // Enums
  DecisionScope,
  DecisionReversibility,
  ConfirmationMethod,
  DecisionContextType,
  DecisionWorkingMode,
  
  // Core interfaces
  DecisionEcho,
  DecisionEchoInput,
  DecisionContextSnapshot,
  OperationalConstraintsSnapshot,
  
  // Validation
  EchoCreationConditions,
  EchoPreventionConditions,
  EchoCreationValidationResult,
  LanguageValidationResult,
  
  // Query
  DecisionEchoQuery,
  DecisionEchoQueryResult,
  
  // Display
  EchoDisplayRules,
  EchoXRMarker,
  EchoXRDisplayRules,
  
  // Failsafes
  DecisionEchoFailsafes,
  DecisionEchoSystemInfo,
  
  // Storage
  DecisionEchoStorage,
  
  // Events
  DecisionEchoEvent,
  DecisionEchoAuditRecord,
  
  // Language
  AllowedEchoTerm,
  ForbiddenEchoTerm,
  
  // Constants
  ALLOWED_ECHO_LANGUAGE,
  FORBIDDEN_ECHO_LANGUAGE,
  DECISION_ECHO_FAILSAFES,
  DEFAULT_ECHO_DISPLAY_RULES,
  DECISION_ECHO_DECLARATION
} from './decisionEcho.types';

// =============================================================================
// ENGINE EXPORTS
// =============================================================================

export {
  // Validation functions
  validateEchoLanguage,
  checkTextForForbiddenTerms,
  validateCreationConditions,
  validateEchoInput,
  
  // Echo creation
  createDecisionEcho,
  
  // Storage implementation
  InMemoryDecisionEchoStorage,
  
  // Service
  DecisionEchoService,
  createDecisionEchoService,
  
  // Helper factories
  createDefaultCreationConditions,
  createDefaultPreventionConditions
} from './decisionEchoEngine';

// =============================================================================
// VIEW EXPORTS
// =============================================================================

export {
  // Main view component
  DecisionEchoView,
  
  // Sub-components
  DecisionEchoItem,
  DecisionEchoDetail,
  EchoXRMarker as EchoXRMarkerComponent,
  
  // Props types
  type DecisionEchoViewProps,
  type DecisionEchoDetailProps,
  type DecisionEchoItemProps,
  type EchoXRMarkerProps
} from './DecisionEchoView';

// =============================================================================
// DEFAULT EXPORT
// =============================================================================

export { DecisionEchoView as default } from './DecisionEchoView';
