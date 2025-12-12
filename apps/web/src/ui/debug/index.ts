/* =========================================================
   CHE·NU — Debug Module Index
   
   Observability tools for development and debugging.
   ========================================================= */

// Components
export { CheNuDebugDashboard, default } from './CheNuDebugDashboard';
export { DebugDashboardDemo } from './DebugDashboardDemo';

// Hooks
export { useDebugDashboard } from './useDebugDashboard';

// Mock data generators
export {
  createMockAgents,
  createMockGuardEvents,
  createMockObservations,
} from './useDebugDashboard';

// Types
export type {
  FlowStage,
  ConfidenceLevel,
  AgentStatus,
  GuardEvent,
  ProcessObservation,
  DebugDashboardProps,
} from './CheNuDebugDashboard';

export type {
  DebugState,
  DebugActions,
} from './useDebugDashboard';
