/* =====================================================
   CHE·NU — Phase Module
   
   Decision and project lifecycle phases with
   associated preset mappings.
   ===================================================== */

// ─────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────

export type {
  PhaseId,
  ConstructionPhaseId,
  AnyPhaseId,
  PhaseDefinition,
  PhasePreset,
  PhaseTransition,
  PhaseState,
} from './phasePreset.types';

// ─────────────────────────────────────────────────────
// DEFAULTS
// ─────────────────────────────────────────────────────

export {
  // Phase definitions
  STANDARD_PHASES,
  CONSTRUCTION_PHASES,
  ALL_PHASES,
  
  // Phase → Preset mappings
  CORE_PHASE_PRESETS,
  CONSTRUCTION_PHASE_PRESETS,
  ALL_PHASE_PRESETS,
  
  // Default state
  DEFAULT_PHASE_STATE,
  
  // Query functions
  getPhaseById,
  getPresetForPhase,
  getPhasesByCategory,
  getNextPhase,
  getPreviousPhase,
  
  // Factory functions
  createPhaseTransition,
  calculatePhaseDuration,
  isPhaseOverdue,
} from './phasePreset.defaults';
