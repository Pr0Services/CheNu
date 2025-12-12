/* =====================================================
   CHE·NU — Phases Module
   
   Project phases and preset management.
   ===================================================== */

// ─────────────────────────────────────────────────────
// PHASE TYPES
// ─────────────────────────────────────────────────────

export type {
  PhaseId,
  ConstructionPhaseId,
  AllPhaseId,
  PhaseDefinition,
  PhasePreset,
  PhasePresetCondition,
  PhaseTransition,
  PhaseState,
  PhaseEvent,
} from './phasePreset.types';

// ─────────────────────────────────────────────────────
// PROJECT TYPES
// ─────────────────────────────────────────────────────

export type {
  ProjectPreset,
  ProjectPhasePreset,
  ProjectType,
  ProjectStatus,
  Project,
  ProjectPresetContext,
  ResolvedPreset,
  ProjectPresetState,
  ProjectPresetEvent,
} from './projectPreset.types';

// ─────────────────────────────────────────────────────
// PHASE DEFAULTS
// ─────────────────────────────────────────────────────

export {
  // Phase definitions
  STANDARD_PHASES,
  CONSTRUCTION_PHASES,
  ALL_PHASES,
  
  // Phase presets
  CORE_PHASE_PRESETS,
  ROLE_AWARE_PHASE_PRESETS,
  
  // Default state
  DEFAULT_PHASE_STATE,
  
  // Query functions
  getPhaseById,
  getPhasesByCategory,
  getPresetForPhase,
  getNextPhase,
  getPreviousPhase,
} from './phasePreset.defaults';

// ─────────────────────────────────────────────────────
// PHASE ENGINE
// ─────────────────────────────────────────────────────

export {
  // State reducer
  reducePhaseState,
  
  // Navigation
  enterPhase,
  exitPhase,
  advancePhase,
  regressPhase,
  
  // Preset resolution
  getCurrentPhasePreset,
  updatePhasePreset,
  
  // Analytics
  getPhaseTimeStats,
  getTransitionFrequency,
  getCurrentPhaseDuration,
  getPhaseProgress,
  
  // Validation
  isValidTransition,
  getValidNextPhases,
} from './phasePreset.engine';

// ─────────────────────────────────────────────────────
// PROJECT DEFAULTS & ENGINE
// ─────────────────────────────────────────────────────

export {
  // Defaults
  PROJECT_TYPE_PRESETS,
  DEFAULT_PROJECT_PRESET_STATE,
  
  // State reducer
  reduceProjectPresetState,
  
  // Query functions
  getProjectById,
  getActiveProject,
  getProjectPreset,
  getProjectPhasePreset,
  
  // Preset resolution
  resolvePreset,
  
  // Factory functions
  createProject,
  cloneProject,
  
  // Analytics
  getProjectsByType,
  getProjectsByStatus,
  getRecentProjects,
  getPresetUsageByProject,
} from './projectPreset.engine';

// ─────────────────────────────────────────────────────
// REACT HOOKS
// ─────────────────────────────────────────────────────

export {
  // Provider
  PhaseProjectProvider,
  
  // Main hook
  usePhaseProject,
  
  // Specialized hooks
  usePhase,
  useProject,
  useResolvedPreset,
} from './usePhaseProject';

export type { PhaseProjectContextValue } from './usePhaseProject';
