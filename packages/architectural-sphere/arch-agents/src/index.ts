/**
 * CHE·NU — ARCHITECTURAL AGENT SYSTEM
 * Main Exports
 * 
 * Foundation v1.0
 * Architectural Agents DESIGN SPACE.
 * They NEVER influence logic, decisions, behavior, or data authority.
 */

// Types
export {
  type ArchitecturalAgentId,
  type AgentState,
  type ArchitecturalOutputType,
  type ArchitecturalOutput,
  type PlanZone,
  type PlanNavigation,
  type PlanOutput,
  type DecorColors,
  type DecorLighting,
  type DecorAtmosphere,
  type DecorOutput,
  type AvatarVisual,
  type AvatarPresence,
  type AvatarOutput,
  type NavigationWaypoint,
  type NavigationPath,
  type NavigationOutput,
  type ArchitecturalBundle,
  type AgentDefinition,
  type RequestType,
  type DesignRequest,
  type ActivationTrigger,
  type ActivationEvent,
  type ValidationResult,
  type EthicalConstraint,
  AGENT_DEFINITIONS,
  ETHICAL_CONSTRAINTS,
  AGENT_FORBIDDEN_ACTIONS,
} from './types';

// Agents
export {
  ArchitecturalAgent,
  ArchitectPlannerAgent,
  DecorDesignerAgent,
  AvatarArchitectAgent,
  NavigationDesignerAgent,
  DomainAdapterAgent,
  ValidationGuardAgent,
  type PlannerInput,
  type DecorInput,
  type AvatarInput,
  type NavigationInput,
  type DomainAdapterInput,
} from './agents';

// Orchestrator
export {
  ArchitectAgentOrchestrator,
} from './orchestrator';

// Context
export {
  AgentSystemProvider,
  AgentSystemContext,
  useAgentSystem,
  type AgentSystemState,
  type AgentSystemContextValue,
} from './AgentSystemContext';

// Components
export {
  StateBadge,
  AgentCard,
  AgentGrid,
  OrchestratorStatus,
  RequestForm,
  BundleViewer,
  LogViewer,
  AgentSystemDashboard,
} from './components';

// Default export
export { AgentSystemProvider as default } from './AgentSystemContext';
