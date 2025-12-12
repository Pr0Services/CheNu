/* =====================================================
   CHE·NU — Mobile Responsive Module
   
   Mobile and tablet adaptation for XR features.
   ===================================================== */

// Types
export * from './mobile.types';

// Hooks
export { useResponsive } from './useResponsive';
export type { UseResponsiveOptions, UseResponsiveReturn } from './useResponsive';

export { useTouchGestures } from './useTouchGestures';
export type { UseTouchGesturesOptions, UseTouchGesturesReturn } from './useTouchGestures';

// Components
export { MobileUniverseView } from './MobileUniverseView';
export type { MobileUniverseViewProps } from './MobileUniverseView';

// Re-export defaults
export {
  DEFAULT_BREAKPOINTS,
  DEFAULT_RESPONSIVE_CONFIG,
  DEFAULT_TOUCH_CONFIG,
  DEFAULT_MOBILE_UI_CONFIG,
  MOBILE_CONFIG,
  LAYOUTS,
  detectDevice,
  getBreakpoint,
  getLayout,
} from './mobile.types';
