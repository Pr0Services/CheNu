/* =========================================================
   CHE·NU — XR Debug Module Index
   
   Immersive debugging interface for CHE·NU runtime.
   ========================================================= */

// === MAIN EXPERIENCE ===
export {
  CheNuXRDebugExperience,
  default as XRDebugExperience,
  type FlowStage,
  type Confidence,
  type AgentStatus,
  type GuardEvent,
  type ProcessObservation,
  type XRDebugProps,
} from './CheNuXRDebugExperience';

// === HOOK ===
export {
  useXRDebug,
  createGuardEventHandler,
  getActiveAgentsForStage,
  useAutoAgentActivation,
  DEFAULT_AGENTS,
  DEFAULT_STATE,
  type XRDebugState,
  type XRDebugActions,
  type UseXRDebugReturn,
} from './useXRDebug';
