/* =====================================================
   CHE·NU — Layout Engine
   core/layout/layoutEngine.ts
   ===================================================== */

import {
  LayoutConfig,
  BreakpointName,
  ComputedLayoutState,
  ElementLayoutProps,
  ComputedElementStyle,
  ContentVolumeLevel,
  ActivityLevel,
  ComplexityLevel,
  AnimationType,
  TransitionType,
  ZIndexLayer,
} from './layout.types';
import layoutConfig from '../config/layout.config.json';

// ─────────────────────────────────────────────────────
// Configuration
// ─────────────────────────────────────────────────────

const config = layoutConfig as LayoutConfig;

// ─────────────────────────────────────────────────────
// State Management
// ─────────────────────────────────────────────────────

let currentState: ComputedLayoutState = {
  currentBreakpoint: 'desktop',
  viewportWidth: typeof window !== 'undefined' ? window.innerWidth : 1280,
  viewportHeight: typeof window !== 'undefined' ? window.innerHeight : 800,
  columns: 3,
  sphereScale: 1.0,
  animationsEnabled: config.global.animations,
};

// ─────────────────────────────────────────────────────
// Breakpoint Detection
// ─────────────────────────────────────────────────────

export function detectBreakpoint(width: number): BreakpointName {
  if (width <= config.breakpoints.mobile.maxWidth) return 'mobile';
  if (width <= config.breakpoints.tablet.maxWidth) return 'tablet';
  if (width <= config.breakpoints.desktop.maxWidth) return 'desktop';
  return 'wide';
}

export function getBreakpointSettings(breakpoint: BreakpointName) {
  return config.breakpoints[breakpoint];
}

export function updateLayoutState(viewportWidth: number, viewportHeight: number): ComputedLayoutState {
  const breakpoint = detectBreakpoint(viewportWidth);
  const settings = getBreakpointSettings(breakpoint);
  
  currentState = {
    currentBreakpoint: breakpoint,
    viewportWidth,
    viewportHeight,
    columns: settings.columns,
    sphereScale: settings.sphereScale,
    animationsEnabled: config.global.animations,
  };
  
  return currentState;
}

export function getLayoutState(): ComputedLayoutState {
  return { ...currentState };
}

// ─────────────────────────────────────────────────────
// Scale Computation
// ─────────────────────────────────────────────────────

export function getContentVolumeScale(volume: ContentVolumeLevel): number {
  return config.dimensions.contentVolume[volume].scale;
}

export function computeElementScale(props: Pick<ElementLayoutProps, 'contentVolume' | 'isFocused'>): number {
  if (!config.rules.sizeByContent) return 1.0;
  
  const baseScale = getContentVolumeScale(props.contentVolume);
  const breakpointScale = currentState.sphereScale;
  const focusBonus = props.isFocused ? 1.15 : 1.0;
  
  return baseScale * breakpointScale * focusBonus;
}

// ─────────────────────────────────────────────────────
// Animation Computation
// ─────────────────────────────────────────────────────

export function getActivityAnimation(activity: ActivityLevel): AnimationType {
  if (!config.rules.motionByActivity || !currentState.animationsEnabled) {
    return 'none';
  }
  return config.dimensions.activity[activity].animation;
}

export function getAnimationCSS(animation: AnimationType): string {
  const animations: Record<AnimationType, string> = {
    none: 'none',
    pulse: 'chenu-pulse 2s infinite',
    orbit: 'chenu-orbit 8s linear infinite',
    glow: 'chenu-glow 3s ease-in-out infinite',
    breathe: 'chenu-breathe 4s ease-in-out infinite',
    spin: 'chenu-spin 10s linear infinite',
  };
  return animations[animation];
}

// ─────────────────────────────────────────────────────
// UI Mode Computation
// ─────────────────────────────────────────────────────

export function getComplexityUIMode(complexity: ComplexityLevel): string {
  return config.dimensions.complexity[complexity].ui;
}

export function computeUIMode(props: Pick<ElementLayoutProps, 'complexity' | 'depth'>): string {
  if (!config.rules.progressiveDisclosure) {
    return 'standard';
  }
  
  const baseMode = getComplexityUIMode(props.complexity);
  
  // Reduce complexity at deeper levels
  if (props.depth > 2 && baseMode === 'expanded') {
    return 'standard';
  }
  if (props.depth > 3) {
    return 'minimal';
  }
  
  return baseMode;
}

// ─────────────────────────────────────────────────────
// Visibility Computation
// ─────────────────────────────────────────────────────

export function computeVisibility(props: Pick<ElementLayoutProps, 'isVisible' | 'depth'>): number {
  if (!props.isVisible) return 0;
  
  // Progressive fade at deeper levels
  const depthFade = Math.max(0, 1 - (props.depth * 0.15));
  return Math.min(1, depthFade);
}

// ─────────────────────────────────────────────────────
// Z-Index
// ─────────────────────────────────────────────────────

export function getZIndex(layer: ZIndexLayer): number {
  return config.zIndex[layer];
}

export function computeZIndex(props: Pick<ElementLayoutProps, 'depth' | 'isFocused'>): number {
  const base = props.isFocused ? config.zIndex.focusedSphere : config.zIndex.spheres;
  const depthOffset = (config.global.depthMax - props.depth) * 2;
  return base + depthOffset;
}

// ─────────────────────────────────────────────────────
// Transitions
// ─────────────────────────────────────────────────────

export function getTransition(type: TransitionType = 'default'): string {
  const t = config.transitions[type];
  return `all ${t.duration}ms ${t.easing}`;
}

export function getTransitionSettings(type: TransitionType = 'default') {
  return config.transitions[type];
}

// ─────────────────────────────────────────────────────
// Full Element Style Computation
// ─────────────────────────────────────────────────────

export function computeElementStyle(props: ElementLayoutProps): ComputedElementStyle {
  return {
    scale: computeElementScale(props),
    animation: getActivityAnimation(props.activity),
    uiMode: computeUIMode(props) as ComputedElementStyle['uiMode'],
    opacity: computeVisibility(props),
    zIndex: computeZIndex(props),
    transition: getTransition('default'),
  };
}

// ─────────────────────────────────────────────────────
// CSS Keyframes (inject once)
// ─────────────────────────────────────────────────────

export function injectAnimationKeyframes(): void {
  if (typeof document === 'undefined') return;
  
  const existingStyle = document.getElementById('chenu-animations');
  if (existingStyle) return;
  
  const style = document.createElement('style');
  style.id = 'chenu-animations';
  style.textContent = `
    @keyframes chenu-pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.05); opacity: 0.9; }
    }
    
    @keyframes chenu-orbit {
      0% { transform: rotate(0deg) translateX(10px) rotate(0deg); }
      100% { transform: rotate(360deg) translateX(10px) rotate(-360deg); }
    }
    
    @keyframes chenu-glow {
      0%, 100% { box-shadow: 0 0 10px currentColor; }
      50% { box-shadow: 0 0 25px currentColor, 0 0 40px currentColor; }
    }
    
    @keyframes chenu-breathe {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.03); }
    }
    
    @keyframes chenu-spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}

// ─────────────────────────────────────────────────────
// Responsive Listener
// ─────────────────────────────────────────────────────

let resizeListener: (() => void) | null = null;

export function initLayoutListener(callback?: (state: ComputedLayoutState) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  
  // Clean up existing listener
  if (resizeListener) {
    window.removeEventListener('resize', resizeListener);
  }
  
  resizeListener = () => {
    const newState = updateLayoutState(window.innerWidth, window.innerHeight);
    callback?.(newState);
  };
  
  window.addEventListener('resize', resizeListener);
  
  // Initial call
  resizeListener();
  
  // Inject animations
  injectAnimationKeyframes();
  
  // Return cleanup function
  return () => {
    if (resizeListener) {
      window.removeEventListener('resize', resizeListener);
      resizeListener = null;
    }
  };
}

// ─────────────────────────────────────────────────────
// Configuration Access
// ─────────────────────────────────────────────────────

export function getLayoutConfig(): LayoutConfig {
  return config;
}

export function isAnimationsEnabled(): boolean {
  return config.global.animations && currentState.animationsEnabled;
}

export function getMaxDepth(): number {
  return config.global.depthMax;
}

// ─────────────────────────────────────────────────────
// Export Default
// ─────────────────────────────────────────────────────

export default {
  getLayoutState,
  updateLayoutState,
  computeElementStyle,
  getTransition,
  getZIndex,
  initLayoutListener,
  isAnimationsEnabled,
};
