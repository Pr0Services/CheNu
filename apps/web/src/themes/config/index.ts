/* =====================================================
   CHE·NU — Theme Config Module Index
   
   📜 RULES:
   - Themes modify VISUALS only
   - Themes NEVER modify logic
   - Themes NEVER modify authority
   - Themes NEVER modify agents behavior
   - Themes NEVER modify timeline logic
   ===================================================== */

// === CONFIGURATION ===
export {
  CHE_NU_THEMES,
  CHE_NU_THEME_RULES,
  getTheme,
  getThemeIds,
  isValidThemeId,
  getDefaultTheme,
  getThemeByIntent,
  THEME_IDS,
  DEFAULT_THEME_ID,
  type ThemeID,
  type ThemeConfig,
  type UIConfig,
  type AnimationConfig,
  type AnimationSpeed,
  type AnimationStyle,
  type GridStyle,
  type AgentVisualConfig,
  type GuardVisualConfig,
  type AvatarConfig,
  type TimelineConfig,
  type XRConfig,
  type AgentDominance,
  type ThemeRules,
} from './theme.config';

// === REACT BINDING ===
export {
  ThemeProvider,
  ThemeRoot,
  ThemeSelector,
  useTheme,
  useThemeStyles,
  useThemeXR,
  useThemeAgents,
  useThemeGuards,
  useThemeAvatars,
  useThemeTimeline,
  THEME_CSS,
  type ThemeProviderProps,
  type ThemeRootProps,
  type ThemeSelectorProps,
  type ThemeContextValue,
} from './ThemeProvider';

// === XR MEETING ROOM THEME ===
export {
  XR_MEETING_OVERRIDES,
  useXRMeetingTheme,
  getXRMeetingTheme,
  useXRCamera,
  useXRPanels,
  useXRAvatars,
  applyXRMeetingTheme,
  getThreeLightingConfig,
  getThreeFogConfig,
  DEFAULT_XR_MEETING_THEME,
  type XRMeetingTheme,
  type XRGeometry,
  type XRCameraMotion,
  type XRCameraConfig,
  type XRPanelStyle,
  type XRPanelConfig,
  type XRAvatarStyle,
  type XRAvatarScale,
  type XRAvatarConfig,
  type XREngineAdapter,
} from './xrMeetingTheme';

// === JSON CONFIG ===
export { default as themeConfigJson } from './theme.config.json';
