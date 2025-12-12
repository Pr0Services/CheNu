/* =====================================================
   CHE·NU — THEME REACT BINDING
   Scope: UI / XR / App Runtime
   
   📜 NOTES:
   - No logic is modified by theme
   - Theme only affects visuals
   - XR layer may subscribe to same context
   - Guards, agents, timelines are untouched
   ===================================================== */

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
  type CSSProperties,
} from 'react';
import {
  CHE_NU_THEMES,
  CHE_NU_THEME_RULES,
  type ThemeID,
  type ThemeConfig,
  isValidThemeId,
  DEFAULT_THEME_ID,
} from './theme.config';

/* -------------------------
   CONTEXT VALUE TYPE
------------------------- */

export interface ThemeContextValue {
  /** Current theme ID */
  themeId: ThemeID;
  /** Current theme configuration */
  theme: ThemeConfig;
  /** Set theme by ID */
  setTheme: (themeId: ThemeID) => void;
  /** Check if transitioning */
  isTransitioning: boolean;
  /** All available themes */
  availableThemes: ThemeID[];
}

/* -------------------------
   CONTEXT
------------------------- */

const ThemeContext = createContext<ThemeContextValue | null>(null);

/* -------------------------
   PROVIDER PROPS
------------------------- */

export interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: ThemeID;
  /** Callback when theme changes */
  onThemeChange?: (themeId: ThemeID) => void;
  /** Persist theme to localStorage */
  persist?: boolean;
  /** localStorage key for persistence */
  storageKey?: string;
}

/* =========================================================
   PROVIDER
   ========================================================= */

export function ThemeProvider({
  children,
  initialTheme,
  onThemeChange,
  persist = false,
  storageKey = 'chenu-theme',
}: ThemeProviderProps) {
  // Load initial theme from storage or prop
  const getInitialTheme = (): ThemeID => {
    if (persist && typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey);
      if (stored && isValidThemeId(stored)) {
        return stored;
      }
    }
    return initialTheme ?? DEFAULT_THEME_ID;
  };

  const [themeId, setThemeId] = useState<ThemeID>(getInitialTheme);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Persist theme changes
  useEffect(() => {
    if (persist && typeof window !== 'undefined') {
      localStorage.setItem(storageKey, themeId);
    }
  }, [themeId, persist, storageKey]);

  // Set theme with validation and transition
  const setTheme = useCallback(
    (nextTheme: ThemeID) => {
      // Validate theme exists
      if (!CHE_NU_THEMES[nextTheme]) {
        console.warn(`[CHE·NU Theme] Invalid theme ID: ${nextTheme}`);
        return;
      }

      // Check manual-only rule
      if (!CHE_NU_THEME_RULES.themeSwitching.manualOnly) {
        console.warn('[CHE·NU Theme] Theme switching is disabled');
        return;
      }

      // Skip if same theme
      if (nextTheme === themeId) return;

      // Handle smooth transition
      if (CHE_NU_THEME_RULES.themeSwitching.smoothTransition) {
        setIsTransitioning(true);
        setTimeout(() => {
          setThemeId(nextTheme);
          setIsTransitioning(false);
          onThemeChange?.(nextTheme);
        }, 150); // Brief transition delay
      } else {
        setThemeId(nextTheme);
        onThemeChange?.(nextTheme);
      }
    },
    [themeId, onThemeChange]
  );

  // Memoized context value
  const value = useMemo<ThemeContextValue>(
    () => ({
      themeId,
      theme: CHE_NU_THEMES[themeId],
      setTheme,
      isTransitioning,
      availableThemes: Object.keys(CHE_NU_THEMES) as ThemeID[],
    }),
    [themeId, setTheme, isTransitioning]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/* =========================================================
   HOOKS
   ========================================================= */

/**
 * Access theme context.
 * Must be used inside ThemeProvider.
 */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('[CHE·NU] useTheme must be used inside ThemeProvider');
  }
  return ctx;
}

/**
 * Get CSS variables from current theme.
 */
export function useThemeStyles(): {
  style: CSSProperties;
  theme: ThemeConfig;
  className: string;
} {
  const { theme } = useTheme();

  const style = useMemo<CSSProperties>(
    () => ({
      '--chenu-primary-bg': theme.ui.primaryColors[0],
      '--chenu-secondary-bg': theme.ui.primaryColors[1],
      '--chenu-text-color': theme.ui.primaryColors[2],
      '--chenu-accent-color': theme.ui.accentColor,
      '--chenu-animation-speed':
        theme.ui.animations.speed === 'very_slow'
          ? '1.5s'
          : theme.ui.animations.speed === 'slow'
          ? '0.8s'
          : '0.3s',
      '--chenu-grid-style': theme.ui.grid,
      '--chenu-geometry': theme.ui.geometry,
    } as CSSProperties),
    [theme]
  );

  const className = useMemo(
    () =>
      [
        'che-nu-theme',
        `che-nu-theme--${theme.id}`,
        `che-nu-geometry--${theme.ui.geometry.replace(/_/g, '-')}`,
        `che-nu-grid--${theme.ui.grid}`,
        theme.ui.animations.enabled ? 'che-nu-animated' : 'che-nu-static',
      ].join(' '),
    [theme]
  );

  return { style, theme, className };
}

/**
 * Get XR-specific theme configuration.
 */
export function useThemeXR() {
  const { theme } = useTheme();
  return theme.xr ?? null;
}

/**
 * Get agent visual configuration.
 */
export function useThemeAgents() {
  const { theme } = useTheme();
  return theme.agents ?? null;
}

/**
 * Get guard visual configuration.
 */
export function useThemeGuards() {
  const { theme } = useTheme();
  return theme.guards ?? null;
}

/**
 * Get avatar configuration.
 */
export function useThemeAvatars() {
  const { theme } = useTheme();
  return theme.avatars ?? null;
}

/**
 * Get timeline visual configuration.
 */
export function useThemeTimeline() {
  const { theme } = useTheme();
  return theme.timeline ?? null;
}

/* =========================================================
   ROOT WRAPPER COMPONENT
   ========================================================= */

export interface ThemeRootProps {
  children: ReactNode;
  className?: string;
}

/**
 * Root wrapper that applies theme CSS variables.
 */
export function ThemeRoot({ children, className = '' }: ThemeRootProps) {
  const { style, theme, className: themeClassName } = useThemeStyles();
  const { isTransitioning } = useTheme();

  return (
    <div
      data-theme-id={theme.id}
      data-theme-intent={theme.intent}
      data-transitioning={isTransitioning}
      style={style}
      className={`che-nu-theme-root ${themeClassName} ${className}`.trim()}
    >
      {children}
    </div>
  );
}

/* =========================================================
   THEME SELECTOR COMPONENT
   ========================================================= */

export interface ThemeSelectorProps {
  className?: string;
  showLabels?: boolean;
  compact?: boolean;
}

/**
 * Theme selector UI component.
 */
export function ThemeSelector({
  className = '',
  showLabels = true,
  compact = false,
}: ThemeSelectorProps) {
  const { themeId, setTheme, availableThemes, isTransitioning } = useTheme();

  return (
    <div
      className={`che-nu-theme-selector ${compact ? 'compact' : ''} ${className}`.trim()}
      role="radiogroup"
      aria-label="Select theme"
    >
      {availableThemes.map((id) => {
        const theme = CHE_NU_THEMES[id];
        const isActive = id === themeId;

        return (
          <button
            key={id}
            role="radio"
            aria-checked={isActive}
            disabled={isTransitioning}
            onClick={() => setTheme(id)}
            className={`che-nu-theme-option ${isActive ? 'active' : ''}`}
            style={{
              '--preview-bg': theme.ui.primaryColors[0],
              '--preview-accent': theme.ui.accentColor,
            } as CSSProperties}
          >
            <span
              className="che-nu-theme-preview"
              style={{
                backgroundColor: theme.ui.primaryColors[0],
                borderColor: theme.ui.accentColor,
              }}
            />
            {showLabels && (
              <span className="che-nu-theme-label">{theme.label}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* =========================================================
   CSS STYLES (can be extracted to CSS file)
   ========================================================= */

export const THEME_CSS = `
.che-nu-theme-root {
  background-color: var(--chenu-primary-bg);
  color: var(--chenu-text-color);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.che-nu-theme-root[data-transitioning="true"] {
  opacity: 0.9;
}

.che-nu-animated {
  transition-duration: var(--chenu-animation-speed);
}

.che-nu-static * {
  transition: none !important;
  animation: none !important;
}

.che-nu-theme-selector {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.che-nu-theme-selector.compact {
  gap: 0.25rem;
}

.che-nu-theme-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border: 2px solid transparent;
  border-radius: 0.5rem;
  background: transparent;
  cursor: pointer;
  transition: border-color 0.2s;
}

.che-nu-theme-option:hover {
  border-color: var(--preview-accent);
}

.che-nu-theme-option.active {
  border-color: var(--preview-accent);
}

.che-nu-theme-preview {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 0.25rem;
  border: 2px solid;
}

.che-nu-theme-label {
  font-size: 0.875rem;
}
`;

/* =========================================================
   EXPORTS
   ========================================================= */

export { CHE_NU_THEMES, CHE_NU_THEME_RULES } from './theme.config';
export type { ThemeID, ThemeConfig } from './theme.config';
