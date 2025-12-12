/* =====================================================
   CHE·NU — Themed Universe Provider
   
   Combines universe context with theme resolution.
   Provides a single context for components to access
   both universe state and resolved theme.
   ===================================================== */

import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from 'react';
import { Theme } from './theme.types';
import {
  UniverseContext,
  UniverseType,
  resolveThemeForUniverse,
  adjustThemeForDepth,
  calculateThemeTransition,
  ThemeTransition,
} from './universeTheme';
import { injectThemeCSS } from './index';

// ─────────────────────────────────────────────────────
// CONTEXT TYPES
// ─────────────────────────────────────────────────────

export interface ThemedUniverseContextValue {
  // Universe state
  universe: UniverseContext;
  
  // Resolved theme (adjusted for depth)
  theme: Theme;
  
  // Raw theme (without depth adjustment)
  baseTheme: Theme;
  
  // Actions
  setUniverseType: (type: UniverseType) => void;
  setActiveSphere: (sphereId: string | undefined) => void;
  setDepthLevel: (depth: number) => void;
  navigateToUniverse: (universeId: string, type: UniverseType) => void;
  
  // Transition state
  isTransitioning: boolean;
  transition: ThemeTransition | null;
}

// ─────────────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────────────

const ThemedUniverseContext = createContext<ThemedUniverseContextValue | null>(null);

// ─────────────────────────────────────────────────────
// PROVIDER PROPS
// ─────────────────────────────────────────────────────

export interface ThemedUniverseProviderProps {
  children: React.ReactNode;
  
  // Initial universe configuration
  initialUniverse?: Partial<UniverseContext>;
  
  // Enable CSS variable injection
  injectCSS?: boolean;
  
  // Callbacks
  onUniverseChange?: (universe: UniverseContext) => void;
  onThemeChange?: (theme: Theme) => void;
}

// ─────────────────────────────────────────────────────
// PROVIDER COMPONENT
// ─────────────────────────────────────────────────────

export const ThemedUniverseProvider: React.FC<ThemedUniverseProviderProps> = ({
  children,
  initialUniverse,
  injectCSS = true,
  onUniverseChange,
  onThemeChange,
}) => {
  // Universe state
  const [universe, setUniverse] = useState<UniverseContext>({
    universeId: initialUniverse?.universeId || 'default',
    universeType: initialUniverse?.universeType || 'realistic',
    activeSphereId: initialUniverse?.activeSphereId,
    depthLevel: initialUniverse?.depthLevel || 0,
    userThemePreference: initialUniverse?.userThemePreference,
    sphereThemeOverride: initialUniverse?.sphereThemeOverride,
  });
  
  // Transition state
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transition, setTransition] = useState<ThemeTransition | null>(null);
  
  // Resolve themes
  const baseTheme = useMemo(
    () => resolveThemeForUniverse(universe),
    [universe]
  );
  
  const theme = useMemo(
    () => adjustThemeForDepth(baseTheme, universe.depthLevel),
    [baseTheme, universe.depthLevel]
  );
  
  // CSS injection
  useEffect(() => {
    if (injectCSS) {
      injectThemeCSS(theme);
    }
  }, [theme, injectCSS]);
  
  // Callbacks
  useEffect(() => {
    onUniverseChange?.(universe);
  }, [universe, onUniverseChange]);
  
  useEffect(() => {
    onThemeChange?.(theme);
  }, [theme, onThemeChange]);
  
  // ─────────────────────────────────────────────────────
  // ACTIONS
  // ─────────────────────────────────────────────────────
  
  const setUniverseType = useCallback((type: UniverseType) => {
    setUniverse(prev => {
      // Calculate transition
      const newUniverse = { ...prev, universeType: type };
      const trans = calculateThemeTransition(prev, newUniverse);
      
      setTransition(trans);
      setIsTransitioning(true);
      
      setTimeout(() => {
        setIsTransitioning(false);
        setTransition(null);
      }, trans.duration);
      
      return newUniverse;
    });
  }, []);
  
  const setActiveSphere = useCallback((sphereId: string | undefined) => {
    setUniverse(prev => {
      const newUniverse = { ...prev, activeSphereId: sphereId };
      const trans = calculateThemeTransition(prev, newUniverse);
      
      if (trans.from !== trans.to) {
        setTransition(trans);
        setIsTransitioning(true);
        
        setTimeout(() => {
          setIsTransitioning(false);
          setTransition(null);
        }, trans.duration);
      }
      
      return newUniverse;
    });
  }, []);
  
  const setDepthLevel = useCallback((depth: number) => {
    setUniverse(prev => ({ ...prev, depthLevel: Math.max(0, Math.min(5, depth)) }));
  }, []);
  
  const navigateToUniverse = useCallback((universeId: string, type: UniverseType) => {
    setUniverse(prev => {
      const newUniverse = {
        ...prev,
        universeId,
        universeType: type,
        activeSphereId: undefined,
        depthLevel: 0,
      };
      
      const trans = calculateThemeTransition(prev, newUniverse);
      setTransition(trans);
      setIsTransitioning(true);
      
      setTimeout(() => {
        setIsTransitioning(false);
        setTransition(null);
      }, trans.duration);
      
      return newUniverse;
    });
  }, []);
  
  // ─────────────────────────────────────────────────────
  // CONTEXT VALUE
  // ─────────────────────────────────────────────────────
  
  const value = useMemo<ThemedUniverseContextValue>(() => ({
    universe,
    theme,
    baseTheme,
    setUniverseType,
    setActiveSphere,
    setDepthLevel,
    navigateToUniverse,
    isTransitioning,
    transition,
  }), [
    universe,
    theme,
    baseTheme,
    setUniverseType,
    setActiveSphere,
    setDepthLevel,
    navigateToUniverse,
    isTransitioning,
    transition,
  ]);
  
  return (
    <ThemedUniverseContext.Provider value={value}>
      {children}
    </ThemedUniverseContext.Provider>
  );
};

// ─────────────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────────────

/**
 * Access the full themed universe context.
 */
export function useThemedUniverse(): ThemedUniverseContextValue {
  const context = useContext(ThemedUniverseContext);
  if (!context) {
    throw new Error('useThemedUniverse must be used within ThemedUniverseProvider');
  }
  return context;
}

/**
 * Access just the current theme.
 */
export function useUniverseTheme(): Theme {
  const { theme } = useThemedUniverse();
  return theme;
}

/**
 * Access universe context without theme.
 */
export function useUniverseContext(): UniverseContext {
  const { universe } = useThemedUniverse();
  return universe;
}

/**
 * Check if theme is transitioning.
 */
export function useThemeTransition(): { isTransitioning: boolean; transition: ThemeTransition | null } {
  const { isTransitioning, transition } = useThemedUniverse();
  return { isTransitioning, transition };
}

// ─────────────────────────────────────────────────────
// UTILITY COMPONENTS
// ─────────────────────────────────────────────────────

/**
 * Wrapper that applies theme transition styles.
 */
export const ThemeTransitionWrapper: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  const { theme, isTransitioning, transition } = useThemedUniverse();
  
  const style: React.CSSProperties = {
    transition: isTransitioning && transition
      ? `all ${transition.duration}ms ${transition.easing}`
      : theme.effects.transition.normal,
    background: theme.colors.background,
    color: theme.colors.textPrimary,
  };
  
  return (
    <div style={style} className={className}>
      {children}
    </div>
  );
};

/**
 * Universe type selector component.
 */
export const UniverseTypeSelector: React.FC<{
  style?: React.CSSProperties;
}> = ({ style }) => {
  const { universe, theme, setUniverseType } = useThemedUniverse();
  
  const types: { type: UniverseType; label: string; icon: string }[] = [
    { type: 'realistic', label: 'Realistic', icon: '💼' },
    { type: 'ancient', label: 'Ancient', icon: '🏛️' },
    { type: 'futurist', label: 'Futurist', icon: '🚀' },
    { type: 'cosmic', label: 'Cosmic', icon: '🌌' },
  ];
  
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
      {types.map(({ type, label, icon }) => (
        <button
          key={type}
          onClick={() => setUniverseType(type)}
          style={{
            padding: '8px 16px',
            borderRadius: theme.borders.radius.sm,
            border: universe.universeType === type
              ? `2px solid ${theme.colors.accent}`
              : '2px solid transparent',
            background: universe.universeType === type
              ? theme.colors.primary
              : 'transparent',
            color: theme.colors.textPrimary,
            fontSize: 13,
            fontWeight: universe.universeType === type ? 600 : 400,
            cursor: 'pointer',
            transition: theme.effects.transition.fast,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span>{icon}</span>
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
};

/**
 * Depth level slider component.
 */
export const DepthLevelSlider: React.FC<{
  style?: React.CSSProperties;
}> = ({ style }) => {
  const { universe, theme, setDepthLevel } = useThemedUniverse();
  
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: 8,
        background: theme.colors.surface,
        borderRadius: theme.borders.radius.md,
        ...style,
      }}
    >
      <span style={{ fontSize: 12, opacity: 0.7 }}>Depth:</span>
      <input
        type="range"
        min={0}
        max={5}
        value={universe.depthLevel}
        onChange={(e) => setDepthLevel(parseInt(e.target.value, 10))}
        style={{ flex: 1 }}
      />
      <span style={{ fontSize: 12, fontWeight: 600, minWidth: 20 }}>
        {universe.depthLevel}
      </span>
    </div>
  );
};

export default ThemedUniverseProvider;
