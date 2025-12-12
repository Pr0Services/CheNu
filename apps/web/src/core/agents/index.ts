/* =====================================================
   CHE·NU — Agents Module Index
   
   📜 "Serve clarity, not control."
   ===================================================== */

// === AGENT TYPES (base types) ===
export * from './agent.types';

// === AGENT MANIFESTO (roles, laws, levels) ===
export * from './agent.manifesto';

// === AGENT I/O SCHEMAS (canonical contracts) ===
export * from './agent.schemas';

// === PARALLEL vs CHAIN MODEL (flow laws) ===
export * from './parallel-chain.model';

// === MANIFESTO SYSTEM (Full Implementation) ===
export * from './manifesto';

// === INTERNAL AGENT CONTEXT ADAPTATION ===
export {
  // Types
  type AgentCategory,
  type AgentAuthority,
  type AgentIdentification,
  type AgentContextType,
  type ContextDeclaration,
  type OperationalConstraints,
  type AgentWorkingMode,
  type EmphasisOption,
  type OutputType,
  type OutputTone,
  type OutputExpectations,
  type ForbiddenAction,
  type InternalAgentContextAdaptation,
  
  // Constants
  AGENT_FORBIDDEN_ACTIONS,
  AGENT_CONFIRMATION,
  AGENT_PRESETS,
  DEFAULT_OPERATIONAL_CONSTRAINTS,
  DEFAULT_OUTPUT_EXPECTATIONS,
  
  // Functions
  buildAgentContextAdaptation,
  formatAgentContext,
  validateAgentContext,
  getAgentPreset,
  validateAgentConfirmation,
} from './internalAgentContext';

// === CONTEXT INTERPRETER AGENT ===
export {
  // Types
  type SessionSummary,
  type TimeConstraint,
  type ContextHistory,
  type ContextInterpreterInput,
  type ContextOption,
  type InterpretationResult,
  
  // Functions
  detectIntentPatterns,
  detectRisks,
  detectAmbiguities,
  detectConflicts,
  formatInterpretationResult,
  
  // Agent
  ContextInterpreterAgent,
  contextInterpreter,
  
  // System Prompt
  CONTEXT_INTERPRETER_SYSTEM_PROMPT,
} from './contextInterpreterAgent';

// === PREFERENCE OBSERVER AGENT ===
export {
  // Types
  type PreferenceSignalType,
  type PreferenceSource,
  type PreferenceScope,
  type PreferenceRecord,
  type ObservableAction,
  type PreferenceStore,
  type PreferenceSummary,
  type PreferenceStoreStats,
  
  // Constants
  MAX_AUTO_CONFIDENCE,
  MIN_OBSERVATIONS_FOR_MEDIUM_CONFIDENCE,
  MIN_OBSERVATIONS_FOR_HIGH_CONFIDENCE,
  CONFIDENCE_DECAY_RATE,
  MAX_PREFERENCE_AGE_DAYS,
  
  // Agent
  PreferenceObserverAgent,
  preferenceObserver,
  
  // System Prompt
  PREFERENCE_OBSERVER_SYSTEM_PROMPT,
  
  // Formatter
  formatPreferenceSummary,
} from './preferenceObserverAgent';

// === AGENT ORCHESTRATOR ===
export {
  // Types
  type AgentCapability,
  type RegisteredAgent,
  type RoutingDecision,
  type OrchestratorState,
  
  // Constants
  BUILT_IN_AGENTS,
  
  // Class
  AgentOrchestrator,
  
  // Functions
  getOrchestrator,
  resetOrchestrator,
  formatRoutingDecision,
} from './agentOrchestrator';

// === SPECIALIZED AGENTS ===
export {
  // Types
  type AgentOutput,
  type ObservationInput,
  type AnalysisInput,
  type DocumentationInput,
  type RecallInput,
  type MethodologyInput,
  type SpecializedAgentType,
  
  // Base Class
  BaseSpecializedAgent,
  
  // Agent Classes
  ObserverAgent,
  AnalystAgent,
  DocumenterAgent,
  MemoryRecallAgent,
  MethodologyAdvisorAgent,
  
  // Factory
  createSpecializedAgent,
} from './specializedAgents';

// === PREFERENCE DRIFT DETECTOR ===
export {
  // Types
  type DriftMagnitude,
  type DriftDirection,
  type PreferenceDriftReport,
  type DriftDetectionConfig,
  type DriftAnalysisInput,
  type DriftAnalysisResult,
  
  // Constants
  DEFAULT_DRIFT_CONFIG,
  
  // Agent
  PreferenceDriftDetectorAgent,
  driftDetector,
  
  // System Prompt
  DRIFT_DETECTOR_SYSTEM_PROMPT,
  
  // Formatters
  formatDriftReport,
  formatDriftAnalysisResult,
} from './preferenceDriftDetector';

// === CONTEXT DRIFT DETECTOR ===
export {
  // Types
  type ContextType,
  type ContextDriftScope,
  type ContextUsageRecord,
  type ContextDriftReport,
  type ContextDriftAnalysisInput,
  type ContextDriftAnalysisResult,
  
  // Constants
  ALL_CONTEXT_TYPES,
  DEFAULT_CONFIG as CONTEXT_DRIFT_DEFAULT_CONFIG,
  
  // Agent
  ContextDriftDetectorAgent,
  contextDriftDetector,
  
  // System Prompt
  CONTEXT_DRIFT_DETECTOR_SYSTEM_PROMPT,
  
  // Formatter
  formatContextDriftReport,
} from './contextDriftDetector';

// === COLLECTIVE DRIFT OVERLAY ===
export {
  // Types
  type TimeWindowUnit,
  type TimeRange,
  type CollectiveDriftCell,
  type CollectiveDriftOverlay,
  type CollectiveParticipant,
  type CollectiveConfig,
  
  // Constants
  DEFAULT_COLLECTIVE_CONFIG,
  PRIVACY_GUARANTEE,
  
  // Generator
  CollectiveDriftOverlayGenerator,
  collectiveDriftOverlay,
  
  // System Prompt
  COLLECTIVE_DRIFT_OVERLAY_SYSTEM_PROMPT,
  
  // Formatter
  formatCollectiveOverlay,
} from './collectiveDriftOverlay';
