/* =====================================================
   CHE·NU — Layout Hooks
   core/layout/useLayout.ts
   ===================================================== */

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ComputedLayoutState,
  ElementLayoutProps,
  ComputedElementStyle,
  ContentVolumeLevel,
  ActivityLevel,
  ComplexityLevel,
} from './layout.types';
import {
  initLayoutListener,
  getLayoutState,
  computeElementStyle,
  getTransition,
  getAnimationCSS,
  isAnimationsEnabled,
} from './layoutEngine';

// ─────────────────────────────────────────────────────
// useLayoutState - Global layout state
// ─────────────────────────────────────────────────────

export function useLayoutState(): ComputedLayoutState {
  const [state, setState] = useState<ComputedLayoutState>(getLayoutState);
  
  useEffect(() => {
    const cleanup = initLayoutListener((newState) => {
      setState(newState);
    });
    return cleanup;
  }, []);
  
  return state;
}

// ─────────────────────────────────────────────────────
// useElementLayout - Per-element adaptive styling
// ─────────────────────────────────────────────────────

interface UseElementLayoutOptions {
  contentVolume?: ContentVolumeLevel;
  activity?: ActivityLevel;
  complexity?: ComplexityLevel;
  depth?: number;
  isVisible?: boolean;
  isFocused?: boolean;
}

interface UseElementLayoutResult {
  style: ComputedElementStyle;
  cssStyle: React.CSSProperties;
  animationCSS: string;
  isAnimated: boolean;
}

export function useElementLayout(options: UseElementLayoutOptions = {}): UseElementLayoutResult {
  const layoutState = useLayoutState();
  
  const props: ElementLayoutProps = useMemo(() => ({
    contentVolume: options.contentVolume ?? 'medium',
    activity: options.activity ?? 'idle',
    complexity: options.complexity ?? 'simple',
    depth: options.depth ?? 0,
    isVisible: options.isVisible ?? true,
    isFocused: options.isFocused ?? false,
  }), [
    options.contentVolume,
    options.activity,
    options.complexity,
    options.depth,
    options.isVisible,
    options.isFocused,
  ]);
  
  const style = useMemo(() => computeElementStyle(props), [props]);
  
  const cssStyle: React.CSSProperties = useMemo(() => ({
    transform: `scale(${style.scale})`,
    opacity: style.opacity,
    zIndex: style.zIndex,
    transition: style.transition,
    animation: isAnimationsEnabled() ? getAnimationCSS(style.animation) : 'none',
  }), [style]);
  
  const animationCSS = useMemo(() => getAnimationCSS(style.animation), [style.animation]);
  
  const isAnimated = isAnimationsEnabled() && style.animation !== 'none';
  
  return {
    style,
    cssStyle,
    animationCSS,
    isAnimated,
  };
}

// ─────────────────────────────────────────────────────
// useBreakpoint - Current breakpoint info
// ─────────────────────────────────────────────────────

export function useBreakpoint() {
  const state = useLayoutState();
  
  return useMemo(() => ({
    current: state.currentBreakpoint,
    isMobile: state.currentBreakpoint === 'mobile',
    isTablet: state.currentBreakpoint === 'tablet',
    isDesktop: state.currentBreakpoint === 'desktop',
    isWide: state.currentBreakpoint === 'wide',
    columns: state.columns,
    sphereScale: state.sphereScale,
  }), [state]);
}

// ─────────────────────────────────────────────────────
// useResponsiveValue - Value based on breakpoint
// ─────────────────────────────────────────────────────

interface ResponsiveValues<T> {
  mobile?: T;
  tablet?: T;
  desktop?: T;
  wide?: T;
  default: T;
}

export function useResponsiveValue<T>(values: ResponsiveValues<T>): T {
  const { current } = useBreakpoint();
  
  return useMemo(() => {
    const value = values[current];
    return value !== undefined ? value : values.default;
  }, [current, values]);
}

// ─────────────────────────────────────────────────────
// useTransition - Transition helpers
// ─────────────────────────────────────────────────────

type TransitionType = 'default' | 'slow' | 'bounce';

export function useTransition(type: TransitionType = 'default'): string {
  return useMemo(() => getTransition(type), [type]);
}

// ─────────────────────────────────────────────────────
// useActivityState - Track activity level
// ─────────────────────────────────────────────────────

interface UseActivityStateOptions {
  idleDelay?: number;  // ms before going idle
  intenseThreshold?: number;  // actions/second to be "intense"
}

export function useActivityState(options: UseActivityStateOptions = {}) {
  const { idleDelay = 3000, intenseThreshold = 5 } = options;
  
  const [activity, setActivity] = useState<ActivityLevel>('idle');
  const [actionCount, setActionCount] = useState(0);
  
  // Track actions in last second
  useEffect(() => {
    const interval = setInterval(() => {
      if (actionCount >= intenseThreshold) {
        setActivity('intense');
      } else if (actionCount > 0) {
        setActivity('active');
      }
      setActionCount(0);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [actionCount, intenseThreshold]);
  
  // Idle timeout
  useEffect(() => {
    if (activity === 'idle') return;
    
    const timeout = setTimeout(() => {
      setActivity('idle');
    }, idleDelay);
    
    return () => clearTimeout(timeout);
  }, [activity, actionCount, idleDelay]);
  
  const recordAction = useCallback(() => {
    setActionCount(c => c + 1);
    if (activity === 'idle') {
      setActivity('active');
    }
  }, [activity]);
  
  return { activity, recordAction };
}

// ─────────────────────────────────────────────────────
// useContentVolume - Compute content volume level
// ─────────────────────────────────────────────────────

interface ContentMetrics {
  itemCount?: number;
  textLength?: number;
  hasMedia?: boolean;
}

export function useContentVolume(metrics: ContentMetrics): ContentVolumeLevel {
  return useMemo(() => {
    const { itemCount = 0, textLength = 0, hasMedia = false } = metrics;
    
    // Simple heuristic
    const score = 
      (itemCount > 10 ? 2 : itemCount > 3 ? 1 : 0) +
      (textLength > 500 ? 2 : textLength > 100 ? 1 : 0) +
      (hasMedia ? 1 : 0);
    
    if (score >= 4) return 'high';
    if (score >= 2) return 'medium';
    return 'low';
  }, [metrics.itemCount, metrics.textLength, metrics.hasMedia]);
}

// ─────────────────────────────────────────────────────
// Export All
// ─────────────────────────────────────────────────────

export default {
  useLayoutState,
  useElementLayout,
  useBreakpoint,
  useResponsiveValue,
  useTransition,
  useActivityState,
  useContentVolume,
};
