/* =====================================================
   CHE·NU — Theme System
   PHASE 7: Complete theme module exports
   
   Provides theme registry, context provider, and
   utilities for theme management.
   
   📜 RULES:
   - Themes modify VISUALS only
   - Themes NEVER modify logic
   - Themes NEVER modify authority
   - Themes NEVER modify agents behavior
   - Themes NEVER modify timeline logic
   ===================================================== */

import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';

// Types
export * from './theme.types';
export type { Theme, ThemeId, PartialTheme, ThemeContextValue } from './theme.types';

// Base theme and utilities
export { baseTheme, createTheme, withAlpha, themeToCSS } from './baseTheme';

// Individual themes
export { ancientTheme } from './ancient.theme';
export { futuristTheme } from './futurist.theme';
export { cosmicTheme } from './cosmic.theme';
export { realisticTheme } from './realistic.theme';

// ─────────────────────────────────────────────────────
// CHE·NU THEME CONFIGURATION (Canonical)
// ─────────────────────────────────────────────────────

export {
  // Configuration
  CHE_NU_THEMES,
  CHE_NU_THEME_RULES,
  getTheme as getCheNuTheme,
  getThemeIds as getCheNuThemeIds,
  isValidThemeId,
  getDefaultTheme,
  getThemeByIntent,
  THEME_IDS,
  DEFAULT_THEME_ID,
  
  // React Binding
  ThemeProvider as CheNuThemeProvider,
  ThemeRoot,
  ThemeSelector,
  useTheme as useCheNuTheme,
  useThemeStyles as useCheNuThemeStyles,
  useThemeXR,
  useThemeAgents,
  useThemeGuards,
  useThemeAvatars,
  useThemeTimeline,
  THEME_CSS,
  
  // Types
  type ThemeID as CheNuThemeID,
  type ThemeConfig as CheNuThemeConfig,
  type UIConfig,
  type AnimationConfig,
  type AnimationSpeed,
  type AnimationStyle,
  type GridStyle,
  type AgentVisualConfig as CheNuAgentVisualConfig,
  type GuardVisualConfig as CheNuGuardVisualConfig,
  type AvatarConfig,
  type TimelineConfig,
  type XRConfig,
  type ThemeProviderProps,
  type ThemeRootProps,
  type ThemeSelectorProps,
  type ThemeContextValue as CheNuThemeContextValue,
} from './config';

// ─────────────────────────────────────────────────────
// THEME REGISTRY
// ─────────────────────────────────────────────────────

import { Theme, ThemeId } from './theme.types';
import { baseTheme } from './baseTheme';
import { ancientTheme } from './ancient.theme';
import { futuristTheme } from './futurist.theme';
import { cosmicTheme } from './cosmic.theme';
import { realisticTheme } from './realistic.theme';
import { resolveThemeForUniverse } from './universeTheme';

/**
 * Registry of all available themes.
 */
export const themeRegistry: Record<ThemeId, Theme> = {
  base: baseTheme,
  ancient: ancientTheme,
  futurist: futuristTheme,
  cosmic: cosmicTheme,
  realistic: realisticTheme,
};

/**
 * Get theme by ID.
 */
export function getTheme(id: ThemeId): Theme {
  return themeRegistry[id] || baseTheme;
}

/**
 * Get all available theme IDs.
 */
export function getAvailableThemes(): ThemeId[] {
  return Object.keys(themeRegistry) as ThemeId[];
}

/**
 * Get theme metadata for display.
 */
export function getThemeList(): Array<{ id: ThemeId; name: string; description: string }> {
  return Object.entries(themeRegistry).map(([id, theme]) => ({
    id: id as ThemeId,
    name: theme.metadata.name,
    description: theme.metadata.description,
  }));
}

// ─────────────────────────────────────────────────────
// THEME CONTEXT
// ─────────────────────────────────────────────────────

interface ThemeContextType {
  theme: Theme;
  themeId: ThemeId;
  setTheme: (id: ThemeId) => void;
  availableThemes: ThemeId[];
}

const ThemeContext = createContext<ThemeContextType | null>(null);

/**
 * Theme provider component.
 */
export const ThemeProvider: React.FC<{
  children: React.ReactNode;
  defaultTheme?: ThemeId;
}> = ({ children, defaultTheme = 'base' }) => {
  const [themeId, setThemeId] = useState<ThemeId>(defaultTheme);
  
  const theme = useMemo(() => getTheme(themeId), [themeId]);
  const availableThemes = useMemo(() => getAvailableThemes(), []);
  
  const setTheme = useCallback((id: ThemeId) => {
    if (themeRegistry[id]) {
      setThemeId(id);
    }
  }, []);
  
  const value = useMemo(() => ({
    theme,
    themeId,
    setTheme,
    availableThemes,
  }), [theme, themeId, setTheme, availableThemes]);
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook to access theme context.
 */
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

/**
 * Hook to get just the current theme.
 */
export function useCurrentTheme(): Theme {
  const { theme } = useTheme();
  return theme;
}

// ─────────────────────────────────────────────────────
// STYLE HELPERS
// ─────────────────────────────────────────────────────

/**
 * Create inline styles from theme tokens.
 */
export function useThemeStyles<T extends Record<string, React.CSSProperties>>(
  styleFactory: (theme: Theme) => T
): T {
  const theme = useCurrentTheme();
  return useMemo(() => styleFactory(theme), [theme, styleFactory]);
}

/**
 * Get a color from theme with optional alpha.
 */
export function useThemeColor(
  colorPath: string,
  alpha?: number
): string {
  const theme = useCurrentTheme();
  
  const getNestedValue = (obj: any, path: string): string => {
    return path.split('.').reduce((acc, part) => acc?.[part], obj) || '#000';
  };
  
  const color = getNestedValue(theme.colors, colorPath);
  
  if (alpha !== undefined) {
    return withAlpha(color, alpha);
  }
  
  return color;
}

// ─────────────────────────────────────────────────────
// CSS INJECTION
// ─────────────────────────────────────────────────────

/**
 * Inject theme CSS variables into document.
 */
export function injectThemeCSS(theme: Theme): void {
  const styleId = 'chenu-theme-vars';
  let styleEl = document.getElementById(styleId);
  
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = styleId;
    document.head.appendChild(styleEl);
  }
  
  const css = themeToCSS(theme);
  styleEl.textContent = css;
}

/**
 * Component to inject theme CSS.
 */
export const ThemeInjector: React.FC = () => {
  const theme = useCurrentTheme();
  
  React.useEffect(() => {
    injectThemeCSS(theme);
  }, [theme]);
  
  return null;
};

// ─────────────────────────────────────────────────────
// THEME SWITCHER COMPONENT
// ─────────────────────────────────────────────────────

export interface ThemeSwitcherProps {
  style?: React.CSSProperties;
  showLabels?: boolean;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  style,
  showLabels = true,
}) => {
  const { themeId, setTheme, availableThemes, theme } = useTheme();
  
  return (
    <div
      style={{
        display: 'flex',
        gap: 8,
        padding: 8,
        background: theme.colors.surface,
        borderRadius: theme.borders.radius.md,
        ...style,
      }}
    >
      {availableThemes.map((id) => {
        const t = getTheme(id);
        const isActive = id === themeId;
        
        return (
          <button
            key={id}
            onClick={() => setTheme(id)}
            title={t.metadata.description}
            style={{
              padding: showLabels ? '6px 12px' : '6px',
              borderRadius: theme.borders.radius.sm,
              border: isActive
                ? `2px solid ${theme.colors.accent}`
                : '2px solid transparent',
              background: isActive ? theme.colors.primary : 'transparent',
              color: theme.colors.textPrimary,
              fontSize: 12,
              fontWeight: isActive ? 600 : 400,
              cursor: 'pointer',
              transition: theme.effects.transition.fast,
            }}
          >
            {showLabels ? t.metadata.name : t.metadata.id.charAt(0).toUpperCase()}
          </button>
        );
      })}
    </div>
  );
};

// ─────────────────────────────────────────────────────
// UNIVERSE THEME INTEGRATION
// ─────────────────────────────────────────────────────

export {
  UniverseContext,
  UniverseType,
  resolveThemeForUniverse,
  resolveTheme,
  adjustThemeForDepth,
  getSphereColor,
  getSphereColorWithAlpha,
  calculateThemeTransition,
  ThemeTransition,
  universeThemes,
} from './universeTheme';

export {
  ThemedUniverseProvider,
  ThemedUniverseProviderProps,
  ThemedUniverseContextValue,
  useThemedUniverse,
  useUniverseTheme,
  useUniverseContext,
  useThemeTransition,
  ThemeTransitionWrapper,
  UniverseTypeSelector,
  DepthLevelSlider,
} from './ThemedUniverseProvider';

export {
  ThemedUniverseView,
  ThemedUniverseViewProps,
  SphereData,
  universeKeyframes,
} from './ThemedUniverseView';

// ─────────────────────────────────────────────────────
// VISUAL THEMES (BLOCK 1)
// ─────────────────────────────────────────────────────

export {
  // Themes
  REALISTIC_THEME,
  AVATAR_THEME,
  ANCIENT_THEME,
  VISUAL_THEMES,
  DEFAULT_THEME,
  
  // Utilities
  getVisualTheme,
  getThemesByCategory,
  getThemesForUseCase,
  generateCSSVariables,
  applyThemeToDocument,
  validateThemeConstraints,
  getFlowIndicators,
  formatFlowStage,
  
  // Types
  type VisualTheme,
  type VisualThemeId,
  type ThemeCategory,
  type ColorPalette,
  type AgentVisualConfig,
  type GuardVisualConfig,
  type XREnvironmentConfig,
  
  // Constraints
  THEME_CONSTRAINTS,
} from './visual-themes-block1';

export {
  useVisualTheme,
  VisualThemeProvider,
  useVisualThemeContext,
  ThemeSwitcher as VisualThemeSwitcher,
  type UseVisualThemeReturn,
  type UseVisualThemeOptions,
} from './useVisualTheme';

// ─────────────────────────────────────────────────────
// VISUAL THEMES (BLOCK 2) — Extended
// ─────────────────────────────────────────────────────

// Extended types
export * from './theme.extended.types';

// Cosmic Theme (Theme 4)
export { COSMIC_THEME, default as CosmicTheme } from './cosmic.theme.v2';

// Futurist Theme (Theme 5)
export { FUTURIST_THEME, default as FuturistTheme } from './futurist.theme.v2';

// ─────────────────────────────────────────────────────
// CONVENIENCE EXPORTS
// ─────────────────────────────────────────────────────

export default {
  // Registry
  registry: themeRegistry,
  get: getTheme,
  list: getThemeList,
  available: getAvailableThemes,
  
  // Themes
  base: baseTheme,
  ancient: ancientTheme,
  futurist: futuristTheme,
  cosmic: cosmicTheme,
  realistic: realisticTheme,
  
  // Utilities
  createTheme,
  withAlpha,
  themeToCSS,
  
  // Universe integration
  resolveForUniverse: resolveThemeForUniverse,
};
