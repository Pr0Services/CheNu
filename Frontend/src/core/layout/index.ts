/* =====================================================
   CHE·NU — Layout Module Index
   core/layout/index.ts
   ===================================================== */

// Types
export * from './layout.types';

// Engine
export {
  getLayoutState,
  updateLayoutState,
  detectBreakpoint,
  getBreakpointSettings,
  computeElementStyle,
  computeElementScale,
  computeVisibility,
  computeUIMode,
  computeZIndex,
  getContentVolumeScale,
  getActivityAnimation,
  getAnimationCSS,
  getComplexityUIMode,
  getTransition,
  getTransitionSettings,
  getZIndex,
  initLayoutListener,
  injectAnimationKeyframes,
  getLayoutConfig,
  isAnimationsEnabled,
  getMaxDepth,
} from './layoutEngine';

// React Hooks
export {
  useLayoutState,
  useElementLayout,
  useBreakpoint,
  useResponsiveValue,
  useTransition,
  useActivityState,
  useContentVolume,
} from './useLayout';
