/* =====================================================
   CHE·NU — useResponsive Hook
   
   React hook for responsive device detection.
   ===================================================== */

import { useState, useEffect, useCallback, useMemo } from 'react';

import {
  DeviceInfo,
  DeviceType,
  Orientation,
  BreakpointKey,
  Breakpoints,
  AdaptiveLayout,
  ResponsiveConfig,
  DEFAULT_BREAKPOINTS,
  DEFAULT_RESPONSIVE_CONFIG,
  MOBILE_CONFIG,
  LAYOUTS,
  detectDevice,
  getBreakpoint,
  getLayout,
} from './mobile.types';

// ─────────────────────────────────────────────────────
// HOOK OPTIONS
// ─────────────────────────────────────────────────────

export interface UseResponsiveOptions {
  breakpoints?: Partial<Breakpoints>;
  debounceDelay?: number;
}

// ─────────────────────────────────────────────────────
// HOOK RETURN
// ─────────────────────────────────────────────────────

export interface UseResponsiveReturn {
  // Device info
  device: DeviceInfo;
  deviceType: DeviceType;
  orientation: Orientation;
  
  // Breakpoint
  breakpoint: BreakpointKey;
  layout: AdaptiveLayout;
  
  // Flags
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isXR: boolean;
  isPortrait: boolean;
  isLandscape: boolean;
  
  // Dimensions
  width: number;
  height: number;
  
  // Responsive config
  config: ResponsiveConfig;
  
  // Helpers
  isUp: (breakpoint: BreakpointKey) => boolean;
  isDown: (breakpoint: BreakpointKey) => boolean;
  isBetween: (min: BreakpointKey, max: BreakpointKey) => boolean;
  responsive: <T>(values: Partial<Record<BreakpointKey, T>>) => T | undefined;
}

// ─────────────────────────────────────────────────────
// MAIN HOOK
// ─────────────────────────────────────────────────────

export function useResponsive(
  options: UseResponsiveOptions = {}
): UseResponsiveReturn {
  const {
    breakpoints: breakpointsOverride,
    debounceDelay = 100,
  } = options;

  const breakpoints: Breakpoints = {
    ...DEFAULT_BREAKPOINTS,
    ...breakpointsOverride,
  };

  // State
  const [device, setDevice] = useState<DeviceInfo>(detectDevice);
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  // Update on resize
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setDevice(detectDevice());
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }, debounceDelay);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [debounceDelay]);

  // Computed values
  const breakpoint = useMemo(
    () => getBreakpoint(dimensions.width, breakpoints),
    [dimensions.width, breakpoints]
  );

  const layout = useMemo(
    () => getLayout(breakpoint),
    [breakpoint]
  );

  // Responsive config based on device
  const config: ResponsiveConfig = useMemo(() => {
    if (device.isMobile) {
      return { ...DEFAULT_RESPONSIVE_CONFIG, ...MOBILE_CONFIG };
    }
    return DEFAULT_RESPONSIVE_CONFIG;
  }, [device.isMobile]);

  // Helpers
  const isUp = useCallback((bp: BreakpointKey): boolean => {
    const order: BreakpointKey[] = ['xs', 'sm', 'md', 'lg', 'xl'];
    return order.indexOf(breakpoint) >= order.indexOf(bp);
  }, [breakpoint]);

  const isDown = useCallback((bp: BreakpointKey): boolean => {
    const order: BreakpointKey[] = ['xs', 'sm', 'md', 'lg', 'xl'];
    return order.indexOf(breakpoint) <= order.indexOf(bp);
  }, [breakpoint]);

  const isBetween = useCallback((min: BreakpointKey, max: BreakpointKey): boolean => {
    return isUp(min) && isDown(max);
  }, [isUp, isDown]);

  const responsive = useCallback(<T,>(values: Partial<Record<BreakpointKey, T>>): T | undefined => {
    const order: BreakpointKey[] = ['xl', 'lg', 'md', 'sm', 'xs'];
    const currentIndex = order.indexOf(breakpoint);
    
    for (let i = currentIndex; i < order.length; i++) {
      const bp = order[i];
      if (values[bp] !== undefined) {
        return values[bp];
      }
    }
    
    return undefined;
  }, [breakpoint]);

  return {
    device,
    deviceType: device.type,
    orientation: device.orientation,
    breakpoint,
    layout,
    isMobile: device.isMobile,
    isTablet: device.isTablet,
    isDesktop: device.isDesktop,
    isXR: device.isXR,
    isPortrait: device.orientation === 'portrait',
    isLandscape: device.orientation === 'landscape',
    width: dimensions.width,
    height: dimensions.height,
    config,
    isUp,
    isDown,
    isBetween,
    responsive,
  };
}

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default useResponsive;
