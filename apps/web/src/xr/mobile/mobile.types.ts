/* =====================================================
   CHE·NU — Mobile Responsive Types
   
   Mobile and tablet adaptation for XR features.
   ===================================================== */

// ─────────────────────────────────────────────────────
// DEVICE DETECTION
// ─────────────────────────────────────────────────────

export type DeviceType = 
  | 'mobile'
  | 'tablet'
  | 'desktop'
  | 'vr'
  | 'ar';

export type Orientation = 'portrait' | 'landscape';

export interface DeviceCapabilities {
  hasTouch: boolean;
  hasGyroscope: boolean;
  hasAccelerometer: boolean;
  hasVibration: boolean;
  hasCamera: boolean;
  hasWebXR: boolean;
  hasWebGL: boolean;
  maxTextureSize: number;
  devicePixelRatio: number;
}

export interface DeviceInfo {
  type: DeviceType;
  orientation: Orientation;
  screenWidth: number;
  screenHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  capabilities: DeviceCapabilities;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isXR: boolean;
}

// ─────────────────────────────────────────────────────
// BREAKPOINTS
// ─────────────────────────────────────────────────────

export interface Breakpoints {
  xs: number;   // 0-479
  sm: number;   // 480-767
  md: number;   // 768-1023
  lg: number;   // 1024-1279
  xl: number;   // 1280+
}

export const DEFAULT_BREAKPOINTS: Breakpoints = {
  xs: 0,
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
};

export type BreakpointKey = keyof Breakpoints;

// ─────────────────────────────────────────────────────
// RESPONSIVE CONFIG
// ─────────────────────────────────────────────────────

export interface ResponsiveConfig {
  breakpoints: Breakpoints;
  
  // Mobile optimizations
  reducedMotion: boolean;
  reducedParticles: boolean;
  simplifiedGeometry: boolean;
  
  // Touch
  touchTargetSize: number;
  swipeThreshold: number;
  doubleTapDelay: number;
  
  // Performance
  maxFPS: number;
  shadowQuality: 'none' | 'low' | 'medium' | 'high';
  antialiasing: boolean;
  
  // UI scaling
  baseFontSize: number;
  scaleFactor: number;
}

export const DEFAULT_RESPONSIVE_CONFIG: ResponsiveConfig = {
  breakpoints: DEFAULT_BREAKPOINTS,
  reducedMotion: false,
  reducedParticles: false,
  simplifiedGeometry: false,
  touchTargetSize: 44,
  swipeThreshold: 50,
  doubleTapDelay: 300,
  maxFPS: 60,
  shadowQuality: 'medium',
  antialiasing: true,
  baseFontSize: 16,
  scaleFactor: 1,
};

// Mobile optimizations preset
export const MOBILE_CONFIG: Partial<ResponsiveConfig> = {
  reducedMotion: true,
  reducedParticles: true,
  simplifiedGeometry: true,
  maxFPS: 30,
  shadowQuality: 'low',
  antialiasing: false,
  touchTargetSize: 48,
};

// ─────────────────────────────────────────────────────
// TOUCH GESTURES
// ─────────────────────────────────────────────────────

export type TouchGesture =
  | 'tap'
  | 'double_tap'
  | 'long_press'
  | 'swipe_left'
  | 'swipe_right'
  | 'swipe_up'
  | 'swipe_down'
  | 'pinch_in'
  | 'pinch_out'
  | 'rotate'
  | 'two_finger_tap'
  | 'pan';

export interface TouchEvent {
  gesture: TouchGesture;
  position: { x: number; y: number };
  delta?: { x: number; y: number };
  scale?: number;
  rotation?: number;
  velocity?: number;
  fingers: number;
  timestamp: number;
}

export interface TouchGestureConfig {
  enabled: boolean;
  gestures: TouchGesture[];
  
  // Thresholds
  tapMaxDuration: number;
  longPressMinDuration: number;
  swipeMinDistance: number;
  swipeMaxDuration: number;
  pinchMinScale: number;
  rotateMinAngle: number;
}

export const DEFAULT_TOUCH_CONFIG: TouchGestureConfig = {
  enabled: true,
  gestures: ['tap', 'double_tap', 'long_press', 'swipe_left', 'swipe_right', 'swipe_up', 'swipe_down', 'pinch_in', 'pinch_out', 'pan'],
  tapMaxDuration: 200,
  longPressMinDuration: 500,
  swipeMinDistance: 50,
  swipeMaxDuration: 300,
  pinchMinScale: 0.1,
  rotateMinAngle: 15,
};

// ─────────────────────────────────────────────────────
// MOBILE UI
// ─────────────────────────────────────────────────────

export interface MobileUIConfig {
  // Bottom sheet
  bottomSheetEnabled: boolean;
  bottomSheetSnapPoints: number[];
  
  // Navigation
  tabBarPosition: 'bottom' | 'top';
  tabBarHeight: number;
  
  // Safe areas
  safeAreaInsets: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  
  // Header
  headerHeight: number;
  headerCollapsible: boolean;
  
  // Pull to refresh
  pullToRefresh: boolean;
}

export const DEFAULT_MOBILE_UI_CONFIG: MobileUIConfig = {
  bottomSheetEnabled: true,
  bottomSheetSnapPoints: [0.25, 0.5, 0.9],
  tabBarPosition: 'bottom',
  tabBarHeight: 56,
  safeAreaInsets: { top: 0, bottom: 0, left: 0, right: 0 },
  headerHeight: 56,
  headerCollapsible: true,
  pullToRefresh: true,
};

// ─────────────────────────────────────────────────────
// ADAPTIVE LAYOUT
// ─────────────────────────────────────────────────────

export interface AdaptiveLayout {
  columns: number;
  gutter: number;
  margin: number;
  maxWidth?: number;
}

export const LAYOUTS: Record<BreakpointKey, AdaptiveLayout> = {
  xs: { columns: 1, gutter: 8, margin: 16 },
  sm: { columns: 2, gutter: 12, margin: 16 },
  md: { columns: 3, gutter: 16, margin: 24 },
  lg: { columns: 4, gutter: 20, margin: 32 },
  xl: { columns: 4, gutter: 24, margin: 40, maxWidth: 1440 },
};

// ─────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────

export function detectDevice(): DeviceInfo {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const width = typeof window !== 'undefined' ? window.innerWidth : 1024;
  const height = typeof window !== 'undefined' ? window.innerHeight : 768;
  
  const isMobile = /iPhone|iPad|iPod|Android/i.test(ua) && width < 768;
  const isTablet = /iPad|Android/i.test(ua) && width >= 768 && width < 1024;
  const isDesktop = !isMobile && !isTablet;
  
  const hasWebXR = typeof navigator !== 'undefined' && 'xr' in navigator;
  
  return {
    type: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop',
    orientation: width > height ? 'landscape' : 'portrait',
    screenWidth: typeof screen !== 'undefined' ? screen.width : width,
    screenHeight: typeof screen !== 'undefined' ? screen.height : height,
    viewportWidth: width,
    viewportHeight: height,
    capabilities: {
      hasTouch: typeof window !== 'undefined' && 'ontouchstart' in window,
      hasGyroscope: typeof DeviceOrientationEvent !== 'undefined',
      hasAccelerometer: typeof DeviceMotionEvent !== 'undefined',
      hasVibration: typeof navigator !== 'undefined' && 'vibrate' in navigator,
      hasCamera: typeof navigator !== 'undefined' && 'mediaDevices' in navigator,
      hasWebXR,
      hasWebGL: detectWebGL(),
      maxTextureSize: 4096,
      devicePixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 1,
    },
    isMobile,
    isTablet,
    isDesktop,
    isXR: hasWebXR,
  };
}

function detectWebGL(): boolean {
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
  } catch {
    return false;
  }
}

export function getBreakpoint(width: number, breakpoints: Breakpoints = DEFAULT_BREAKPOINTS): BreakpointKey {
  if (width >= breakpoints.xl) return 'xl';
  if (width >= breakpoints.lg) return 'lg';
  if (width >= breakpoints.md) return 'md';
  if (width >= breakpoints.sm) return 'sm';
  return 'xs';
}

export function getLayout(breakpoint: BreakpointKey): AdaptiveLayout {
  return LAYOUTS[breakpoint];
}
