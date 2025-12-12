/* =====================================================
   CHE·NU — Project Module
   
   Project-specific preset configurations and management.
   ===================================================== */

// ─────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────

export type {
  ProjectPreset,
  ProjectCategory,
  ProjectStatus,
  ProjectInfo,
  ProjectPresetState,
  ProjectPresetEvent,
} from './projectPreset.types';

// ─────────────────────────────────────────────────────
// DEFAULTS & SAMPLES
// ─────────────────────────────────────────────────────

export {
  // Samples
  SAMPLE_PROJECT_PRESETS,
  SAMPLE_PROJECTS,
  
  // Default state
  DEFAULT_PROJECT_PRESET_STATE,
  
  // Category suggestions
  CATEGORY_PRESET_SUGGESTIONS,
  
  // Factory functions
  createProjectPreset,
  createProject,
  
  // Query functions
  getProjectPreset,
  getProject,
  getProjectsByCategory,
  getProjectsByStatus,
  getSuggestedPresetsForCategory,
  
  // State reducer
  reduceProjectPresetState,
} from './projectPreset.defaults';
