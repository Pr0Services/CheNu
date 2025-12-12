/* =========================================================
   CHE·NU — useVisualTheme Hook
   
   Hook for managing visual themes in React components.
   
   📜 Remember: Themes are purely perceptual.
   They NEVER modify logic, authority, or rules.
   ========================================================= */

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  VisualTheme,
  VisualThemeId,
  DEFAULT_THEME,
  getVisualTheme,
  generateCSSVariables,
  applyThemeToDocument,
  THEME_CONSTRAINTS,
  VISUAL_THEMES,
} from './visual-themes-block1';

/* -------------------------
   TYPES
------------------------- */

export interface UseVisualThemeReturn {
  // Current theme
  theme: VisualTheme;
  themeId: VisualThemeId;
  
  // Actions
  setTheme: (id: VisualThemeId) => void;
  
  // Theme info
  availableThemes: VisualTheme[];
  
  // CSS utilities
  cssVariables: Record<string, string>;
  
  // Transition state
  isTransitioning: boolean;
}

export interface UseVisualThemeOptions {
  initialTheme?: VisualThemeId;
  persistToStorage?: boolean;
  storageKey?: string;
  applyToDocument?: boolean;
}

/* -------------------------
   STORAGE
------------------------- */

const STORAGE_KEY = 'chenu-visual-theme';

function loadThemeFromStorage(key: string): VisualThemeId | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(key);
    if (stored && stored in VISUAL_THEMES) {
      return stored as VisualThemeId;
    }
  } catch {
    // Storage not available
  }
  
  return null;
}

function saveThemeToStorage(key: string, themeId: VisualThemeId): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(key, themeId);
  } catch {
    // Storage not available
  }
}

/* =========================================================
   HOOK
   ========================================================= */

export function useVisualTheme(
  options: UseVisualThemeOptions = {}
): UseVisualThemeReturn {
  const {
    initialTheme = DEFAULT_THEME,
    persistToStorage = true,
    storageKey = STORAGE_KEY,
    applyToDocument = true,
  } = options;

  // Initialize from storage or default
  const [themeId, setThemeId] = useState<VisualThemeId>(() => {
    if (persistToStorage) {
      const stored = loadThemeFromStorage(storageKey);
      if (stored) return stored;
    }
    return initialTheme;
  });

  const [isTransitioning, setIsTransitioning] = useState(false);

  // Get current theme
  const theme = useMemo(() => getVisualTheme(themeId), [themeId]);

  // Generate CSS variables
  const cssVariables = useMemo(
    () => generateCSSVariables(theme),
    [theme]
  );

  // Available themes
  const availableThemes = useMemo(
    () => Object.values(VISUAL_THEMES),
    []
  );

  // Set theme with smooth transition
  const setTheme = useCallback((id: VisualThemeId) => {
    if (id === themeId) return;
    if (!(id in VISUAL_THEMES)) return;

    // Start transition
    setIsTransitioning(true);

    // Apply after short delay for smooth transition
    setTimeout(() => {
      setThemeId(id);

      // Persist
      if (persistToStorage) {
        saveThemeToStorage(storageKey, id);
      }

      // End transition
      setTimeout(() => {
        setIsTransitioning(false);
      }, THEME_CONSTRAINTS.switching.transitionDuration);
    }, 50);
  }, [themeId, persistToStorage, storageKey]);

  // Apply to document
  useEffect(() => {
    if (applyToDocument) {
      applyThemeToDocument(theme);
    }
  }, [theme, applyToDocument]);

  return {
    theme,
    themeId,
    setTheme,
    availableThemes,
    cssVariables,
    isTransitioning,
  };
}

/* =========================================================
   CONTEXT (Optional)
   ========================================================= */

import React, { createContext, useContext, type ReactNode } from 'react';

const VisualThemeContext = createContext<UseVisualThemeReturn | null>(null);

export interface VisualThemeProviderProps {
  children: ReactNode;
  initialTheme?: VisualThemeId;
  persistToStorage?: boolean;
}

export function VisualThemeProvider({
  children,
  initialTheme,
  persistToStorage = true,
}: VisualThemeProviderProps): JSX.Element {
  const themeState = useVisualTheme({
    initialTheme,
    persistToStorage,
    applyToDocument: true,
  });

  return (
    <VisualThemeContext.Provider value={themeState}>
      {children}
    </VisualThemeContext.Provider>
  );
}

export function useVisualThemeContext(): UseVisualThemeReturn {
  const context = useContext(VisualThemeContext);
  
  if (!context) {
    throw new Error(
      'useVisualThemeContext must be used within a VisualThemeProvider'
    );
  }
  
  return context;
}

/* =========================================================
   THEME SWITCHER COMPONENT
   ========================================================= */

export interface ThemeSwitcherProps {
  className?: string;
  showLabels?: boolean;
}

export function ThemeSwitcher({
  className = '',
  showLabels = true,
}: ThemeSwitcherProps): JSX.Element {
  const { themeId, setTheme, availableThemes, isTransitioning } =
    useVisualThemeContext();

  return (
    <div
      className={`chenu-theme-switcher ${className}`}
      style={{
        display: 'flex',
        gap: '8px',
        opacity: isTransitioning ? 0.7 : 1,
        transition: 'opacity 200ms',
      }}
    >
      {availableThemes.map((theme) => (
        <button
          key={theme.id}
          onClick={() => setTheme(theme.id)}
          disabled={isTransitioning}
          style={{
            padding: '8px 16px',
            border: theme.id === themeId ? '2px solid' : '1px solid',
            borderColor: theme.colors.accent,
            backgroundColor:
              theme.id === themeId ? theme.colors.accent : 'transparent',
            color:
              theme.id === themeId ? '#ffffff' : theme.colors.text,
            borderRadius: theme.geometry.borderRadius,
            cursor: isTransitioning ? 'wait' : 'pointer',
            fontFamily: theme.typography.fontFamily,
            fontSize: theme.typography.fontSizeSmall,
          }}
        >
          {showLabels ? theme.name : theme.id}
        </button>
      ))}
    </div>
  );
}

/* =========================================================
   EXPORTS
   ========================================================= */

export {
  VisualThemeContext,
};
