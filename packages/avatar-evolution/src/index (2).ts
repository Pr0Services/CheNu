/**
 * CHE·NU — AVATAR EVOLUTION SYSTEM + MULTI-MEETING UNIVERSE VIEW
 * Main Exports
 * 
 * XR.v1.2
 * Avatar evolution based ONLY on objective system states — NOT psychology.
 * Universe view for meeting coordination and navigation.
 * 
 * RULE: Evolution = INFORMATIONAL STATE, not identity shaping.
 */

// Types
export {
  // Evolution types
  type EvolutionState,
  type EvolutionStateConfig,
  type EvolutionContext,
  type SessionMode,
  type InformationLoad,
  type RoleIntensity,
  type EvolutionTriggers,
  type EvolutionMorphology,
  type AvatarEvolution,
  type EvolutionConstraint,
  EVOLUTION_NEVER_ALLOWED,
  
  // Universe types
  type UniverseNodeType,
  type UniverseNodeVisual,
  type SphereType,
  type SphereConfig,
  type UniverseNode,
  type LinkType,
  type UniverseLink,
  type UniverseMeetings,
  type SyncRule,
  type SyncRuleConfig,
  type UniverseInteraction,
  type InteractionConfig,
  type ForbiddenInteraction,
  FORBIDDEN_UNIVERSE_INTERACTIONS,
  type UniverseSafety,
  type CoordinationAgentType,
  type CoordinationAgent,
  type UniverseViewState,
  type EvolutionRuntimeState,
  type AvatarEvolutionUniverseState,
} from './types';

// Presets
export {
  // Evolution states
  EVOLUTION_BASE,
  EVOLUTION_SIGNAL,
  EVOLUTION_STRUCTURAL,
  EVOLUTION_INTEGRATED,
  EVOLUTION_STATES,
  EVOLUTION_STATE_LIST,
  DEFAULT_MORPHOLOGIES,
  
  // Morphology adjustments
  SESSION_MORPHOLOGY_ADJUSTMENTS,
  LOAD_MORPHOLOGY_ADJUSTMENTS,
  ROLE_MORPHOLOGY_ADJUSTMENTS,
  
  // Spheres
  SPHERE_BUSINESS,
  SPHERE_SCHOLAR,
  SPHERE_CREATIVE,
  SPHERE_INSTITUTION,
  SPHERE_SOCIAL,
  SPHERE_XR,
  SPHERES,
  SPHERE_LIST,
  
  // Node visuals
  NODE_VISUALS,
  
  // Interactions
  UNIVERSE_INTERACTIONS,
  
  // Sync rules
  SYNC_RULES,
  
  // Coordination agents
  AGENT_MEETING_COORDINATOR,
  AGENT_UNIVERSE_RENDERER,
  AGENT_REPLAY_ENGINE,
  AGENT_EVOLUTION_MONITOR,
  COORDINATION_AGENTS,
  
  // Safety
  DEFAULT_SAFETY,
  
  // Factory functions
  createEvolution,
  computeEvolutionState,
  computeMorphology,
  createUniverseNode,
  createUniverseLink,
  getSphere,
  getEvolutionState,
} from './presets';

// Context
export {
  AvatarEvolutionUniverseProvider,
  SystemContext,
  useAvatarEvolutionUniverse,
  type SystemState,
  type SystemContextValue,
} from './AvatarEvolutionContext';

// Components
export {
  EvolutionStateCard,
  EvolutionController,
  SphereSelector,
  NodeDisplay,
  UniverseView,
  CoordinationAgentsPanel,
  SafetyPanel,
  AvatarEvolutionUniverseDashboard,
} from './components';

// Default export
export { AvatarEvolutionUniverseProvider as default } from './AvatarEvolutionContext';
