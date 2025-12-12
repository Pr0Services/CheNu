/* =========================================================
   CHE·NU — Guards Module Index
   
   📜 Runtime enforcement of CHE·NU core laws.
   
   These guards MUST be called before any:
   - Decision flow
   - Timeline write
   - Agent orchestration
   
   "If a guard throws, the system must stop."
   ========================================================= */

// === RUNTIME GUARDS ===
export {
  // Individual guards
  guardAgentCannotDecide,
  guardAgentCannotWriteTimeline,
  guardChainFlow,
  guardParallelIsolation,
  guardHumanAuthority,
  guardRollbackRules,
  
  // Composite guards
  guardBeforeAgentExecution,
  guardBeforeOrchestration,
  guardBeforeTimelineWrite,
  guardCompleteFlow,
  
  // Utilities
  isActionSafe,
  createSafeContext,
  
  // Types
  CheNuViolationError,
  GUARD_CODES,
  type RuntimeContext,
  type AgentType,
  type FlowStage,
  type GuardCode,
} from './runtimeGuards';

// === PROCESS ANALYSIS (Observational Only) ===
export {
  analyzeProcessFlow,
  analyzeNavigationPatterns,
  analyzeDecisionFlow,
  analyzeAgentActivity,
  generateSessionSummary,
  
  // Types
  type ProcessObservation,
  type ProcessAnalysisReport,
  type SessionAction,
} from './processAnalysis';

// === TEST RUNNER ===
export { runCheNuGuardTests } from './runtimeGuards.test';
