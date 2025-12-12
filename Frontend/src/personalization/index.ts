/* =====================================================
   CHE·NU — Personalization Module
   
   User preferences and customization settings.
   ===================================================== */

// Types
export * from './personalization.types';

// Defaults & Presets
export {
  DEFAULT_PERSONALIZATION,
  PRESETS,
  DENSITY_CONFIGS,
  createPersonalization,
  applyPreset,
} from './personalization.defaults';

// Engine (pure functions)
export {
  // Global
  setGlobalTheme,
  setDensity,
  setLanguage,
  
  // Spheres
  getSpherePersonalization,
  updateSphere,
  toggleSphereVisibility,
  toggleSpherePinned,
  pinSphere,
  unpinSphere,
  setSphereTheme,
  recordSphereVisit,
  reorderSpheres,
  getVisibleSpheres,
  
  // Agents
  getAgentPersonalization,
  updateAgent,
  toggleAgentVisibility,
  toggleAgentFavorite,
  setAgentAvatarStyle,
  recordAgentInteraction,
  adjustAgentTrust,
  getFavoriteAgents,
  getVisibleAgents,
  
  // XR
  updateXRSettings,
  toggleXREnabled,
  setXRAmbiance,
  setXRQuality,
  
  // UI
  updateUISettings,
  toggleSidebar,
  setSidebarPosition,
  setFontSize,
  toggleReducedMotion,
  toggleHighContrast,
  
  // Notifications
  updateNotificationSettings,
  toggleNotifications,
  setQuietHours,
  
  // Shortcuts
  updateShortcut,
  toggleShortcut,
  resetShortcuts,
  
  // Reducer
  reducePersonalization,
} from './personalization.engine';

// Store (persistence)
export {
  loadPersonalization,
  loadOrCreatePersonalization,
  savePersonalization,
  savePersonalizationDebounced,
  createBackup,
  restoreFromBackup,
  clearPersonalization,
  resetPersonalization,
  exportPersonalization,
  downloadPersonalization,
  importPersonalization,
  getSyncStatus,
  updateSyncStatus,
  onPersonalizationChange,
} from './personalization.store';

// Migrations
export {
  CURRENT_VERSION,
  migratePersonalization,
  validatePersonalization,
  cleanupPersonalization,
  getMigrationInfo,
} from './personalization.migrations';

// React hooks
export {
  PersonalizationProvider,
  usePersonalization,
  useSpherePersonalization,
  useAgentPersonalization,
  useThemePersonalization,
  useDensityPersonalization,
  useXRPersonalization,
  useUIPersonalization,
  useVisibleSpheres,
  useVisibleAgents,
  useFavoriteAgents,
} from './usePersonalization';
export type { PersonalizationProviderProps } from './usePersonalization';

// Re-export main default
export { DEFAULT_PERSONALIZATION as default } from './personalization.defaults';
