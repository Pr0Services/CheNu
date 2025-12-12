/* =====================================================
   CHE·NU — Theme Engine
   core/theme/themeEngine.ts
   ===================================================== */

import { 
  Theme, 
  ThemeId, 
  SphereType, 
  AgentLevel 
} from './theme.types';
import { treeNatureTheme } from './themes/tree_nature';
import { sacredGoldTheme } from './themes/sacred_gold';
import { deepOceanTheme } from './themes/deep_ocean';
import { midnightTheme } from './themes/midnight';
import { highContrastTheme } from './themes/high_contrast';

// ─────────────────────────────────────────────────────
// Theme Registry
// ─────────────────────────────────────────────────────

const themes: Record<ThemeId, Theme> = {
  tree_nature: treeNatureTheme,
  sacred_gold: sacredGoldTheme,
  deep_ocean: deepOceanTheme,
  midnight: midnightTheme,
  high_contrast: highContrastTheme,
};

// ─────────────────────────────────────────────────────
// Theme State (simple global for now)
// ─────────────────────────────────────────────────────

let currentThemeId: ThemeId = 'tree_nature';

// ─────────────────────────────────────────────────────
// Core Functions
// ─────────────────────────────────────────────────────

/**
 * Get a theme by ID
 */
export function getTheme(themeId?: ThemeId): Theme {
  const id = themeId || currentThemeId;
  return themes[id] || themes.tree_nature;
}

/**
 * Set the current active theme
 */
export function setTheme(themeId: ThemeId): Theme {
  if (themes[themeId]) {
    currentThemeId = themeId;
    applyThemeToDOM(themes[themeId]);
  }
  return getTheme();
}

/**
 * Get current theme ID
 */
export function getCurrentThemeId(): ThemeId {
  return currentThemeId;
}

/**
 * Get all available themes
 */
export function getAvailableThemes(): Array<{ id: ThemeId; name: string }> {
  return Object.entries(themes).map(([id, theme]) => ({
    id: id as ThemeId,
    name: theme.name,
  }));
}

// ─────────────────────────────────────────────────────
// Utility Functions
// ─────────────────────────────────────────────────────

/**
 * Get color for a specific sphere type
 */
export function getSphereColor(sphereType: SphereType, theme?: Theme): string {
  const t = theme || getTheme();
  const colorMap: Record<SphereType, keyof typeof t.colors> = {
    personal: 'spherePersonal',
    business: 'sphereBusiness',
    creative: 'sphereCreative',
    scholar: 'sphereScholar',
    social: 'sphereSocial',
    institutions: 'sphereInstitutions',
    methodology: 'sphereMethodology',
    xr: 'sphereXR',
  };
  return t.colors[colorMap[sphereType]];
}

/**
 * Get color for a specific agent level
 */
export function getAgentLevelColor(level: AgentLevel, theme?: Theme): string {
  const t = theme || getTheme();
  const colorMap: Record<AgentLevel, keyof typeof t.colors> = {
    L0: 'agentL0',
    L1: 'agentL1',
    L2: 'agentL2',
    L3: 'agentL3',
    L4: 'agentL4',
    L5: 'agentL5',
  };
  return t.colors[colorMap[level]];
}

/**
 * Get sphere icon/emoji
 */
export function getSphereIcon(sphereType: SphereType): string {
  const icons: Record<SphereType, string> = {
    personal: '🧑',
    business: '🏢',
    creative: '🎨',
    scholar: '🎓',
    social: '📱',
    institutions: '🏛️',
    methodology: '⚙️',
    xr: '🥽',
  };
  return icons[sphereType];
}

/**
 * Get agent level label
 */
export function getAgentLevelLabel(level: AgentLevel): string {
  const labels: Record<AgentLevel, string> = {
    L0: 'NOVA AI',
    L1: 'Director',
    L2: 'Manager',
    L3: 'Analyst',
    L4: 'Executor',
    L5: 'Observer',
  };
  return labels[level];
}

// ─────────────────────────────────────────────────────
// DOM Integration
// ─────────────────────────────────────────────────────

/**
 * Apply theme to CSS custom properties
 */
export function applyThemeToDOM(theme: Theme): void {
  if (typeof document === 'undefined') return;
  
  const root = document.documentElement;
  
  // Colors
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--chenu-color-${kebabCase(key)}`, value);
  });
  
  // Typography
  root.style.setProperty('--chenu-font-family', theme.typography.fontFamily);
  root.style.setProperty('--chenu-font-mono', theme.typography.fontFamilyMono);
  
  // Spacing
  Object.entries(theme.spacing).forEach(([key, value]) => {
    root.style.setProperty(`--chenu-space-${key}`, value);
  });
  
  // Radius
  Object.entries(theme.radius).forEach(([key, value]) => {
    root.style.setProperty(`--chenu-radius-${key}`, value);
  });
  
  // Set dark/light mode
  root.setAttribute('data-theme', theme.id);
  root.setAttribute('data-theme-mode', theme.isDark ? 'dark' : 'light');
}

// ─────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────

function kebabCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

// ─────────────────────────────────────────────────────
// CSS-in-JS Helpers
// ─────────────────────────────────────────────────────

/**
 * Create inline styles from theme
 */
export function createStyles<T extends Record<string, React.CSSProperties>>(
  factory: (theme: Theme) => T
): T {
  return factory(getTheme());
}

/**
 * Merge theme-based styles with overrides
 */
export function mergeStyles(
  ...styles: (React.CSSProperties | undefined)[]
): React.CSSProperties {
  return Object.assign({}, ...styles.filter(Boolean));
}

// ─────────────────────────────────────────────────────
// Export Default Theme
// ─────────────────────────────────────────────────────

export { treeNatureTheme, sacredGoldTheme };
export default { getTheme, setTheme, getSphereColor, getAgentLevelColor };