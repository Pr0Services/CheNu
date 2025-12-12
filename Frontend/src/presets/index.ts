/* =====================================================
   CHE·NU — Presets Module
   
   Context-aware personalization presets with auto-activation
   and unified resolution across manual, project, phase, and role.
   ===================================================== */

// ─────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────

export type {
  // Resolver types
  ResolvePresetContext,
  PresetResolution,
} from './resolvePreset';

export type {
  // Conditions
  TimeCondition,
  ActivityCondition,
  SphereCondition,
  DeviceCondition,
  DurationCondition,
  ManualCondition,
  PresetCondition,
  
  // Patches
  XRPresetPatch,
  UIPresetPatch,
  NotificationPresetPatch,
  PersonalizationPatch,
  
  // Preset
  PresetCategory,
  PresetPriority,
  CheNuPreset,
  
  // Context & suggestion
  PresetContext,
  PresetSuggestion,
  
  // History
  PresetActivation,
  
  // State
  PresetState,
  PresetEvent,
} from './preset.types';

// ─────────────────────────────────────────────────────
// DEFAULTS
// ─────────────────────────────────────────────────────

export {
  // Preset collections
  CORE_PRESETS,
  WORK_PRESETS,
  XR_PRESETS,
  DEFAULT_PRESETS,
  
  // Default state
  DEFAULT_PRESET_STATE,
  
  // Factory functions
  createPreset,
  clonePreset,
  
  // Query functions
  getPresetById,
  getPresetsByCategory,
  getSystemPresets,
  getCustomPresets,
  getAutoPresets,
} from './preset.defaults';

// ─────────────────────────────────────────────────────
// ENGINE
// ─────────────────────────────────────────────────────

export {
  // Apply
  applyPreset,
  applyPresets,
  getPersonalizationDiff,
  
  // Condition evaluation
  evaluateTimeCondition,
  evaluateActivityCondition,
  evaluateSphereCondition,
  evaluateDeviceCondition,
  evaluateDurationCondition,
  evaluateCondition,
  evaluatePresetConditions,
  
  // Suggestions
  suggestPresets,
  suggestPresetsQuick,
  
  // State reducer
  reducePresetState,
  
  // Validation
  validatePreset,
  
  // Context helpers
  createDefaultContext,
  detectXRCapability,
} from './preset.engine';

export type { PresetValidation } from './preset.engine';

// ─────────────────────────────────────────────────────
// REACT HOOKS
// ─────────────────────────────────────────────────────

export {
  // Provider
  PresetProvider,
  
  // Main hook
  usePresets,
  
  // Specialized hooks
  useActivePreset,
  usePresetSuggestions,
  useFavoritePresets,
  usePreset,
  useCreatePreset,
  usePresetActivity,
} from './usePreset';

export type { PresetContextValue } from './usePreset';

// ─────────────────────────────────────────────────────
// RESOLVER
// ─────────────────────────────────────────────────────

export {
  // Core resolver
  resolveSuggestedPreset,
  resolvePresetWithDetails,
  resolvePresetChain,
  
  // Conflict detection
  hasPresetConflict,
  getPresetConflicts,
  
  // Utilities
  buildResolveContext,
  getSourceLabel,
  getSourceIcon,
} from './resolvePreset';
