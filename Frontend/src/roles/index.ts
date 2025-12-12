/* =====================================================
   CHE·NU — Roles Module
   
   User roles and preset advisor system.
   ===================================================== */

// ─────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────

export type {
  // Role types
  RoleCategory,
  UserRole,
  
  // Advisor types
  PresetAdvisorContext,
  PresetRecommendation,
  AdvisorLogEntry,
  
  // State types
  RoleState,
  RoleSwitchEntry,
  RoleEvent,
} from './rolePreset.types';

// ─────────────────────────────────────────────────────
// DEFAULTS
// ─────────────────────────────────────────────────────

export {
  // Role collections
  CORE_ROLES,
  CONSTRUCTION_ROLES,
  DEFAULT_ROLES,
  
  // Default state
  DEFAULT_ROLE_STATE,
  
  // Factory functions
  createRole,
  cloneRole,
  
  // Query functions
  getRoleById,
  getRolesByCategory,
  getSystemRoles,
  getCustomRoles,
} from './rolePreset.defaults';

// ─────────────────────────────────────────────────────
// ENGINE
// ─────────────────────────────────────────────────────

export {
  // Role → Preset mapping
  getSuggestedPresetForRole,
  getAllowedPresetsForRole,
  isPresetAllowedForRole,
  
  // Preset advisor
  getTimeOfDay,
  recommendPresets,
  recommendPresetsQuick,
  
  // Advisor log
  createAdvisorLogEntry,
  acceptAdvisorSuggestion,
  addFeedbackToEntry,
  calculateAcceptanceRate,
  getMostAcceptedPresets,
  
  // State reducer
  reduceRoleState,
  
  // Analytics
  getRoleUsageStats,
  getMostUsedRole,
  getAverageRoleDuration,
  
  // Context
  createDefaultAdvisorContext,
} from './rolePreset.engine';

// ─────────────────────────────────────────────────────
// REACT HOOKS
// ─────────────────────────────────────────────────────

export {
  // Provider
  RoleProvider,
  
  // Main hook
  useRoles,
  
  // Specialized hooks
  useActiveRole,
  usePresetAdvisor,
  useRole,
  useRolePresets,
} from './useRole';

export type { RoleContextValue } from './useRole';
