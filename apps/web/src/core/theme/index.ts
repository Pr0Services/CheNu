/* =====================================================
   CHE·NU — Theme Module Index
   core/theme/index.ts
   ===================================================== */

// Types
export * from './theme.types';

// Engine
export {
  getTheme,
  setTheme,
  getCurrentThemeId,
  getAvailableThemes,
  getSphereColor,
  getAgentLevelColor,
  getSphereIcon,
  getAgentLevelLabel,
  applyThemeToDOM,
  createStyles,
  mergeStyles,
} from './themeEngine';

// Themes
export { treeNatureTheme } from './themes/tree_nature';
export { sacredGoldTheme } from './themes/sacred_gold';
