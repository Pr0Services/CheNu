/* =====================================================
   CHE·NU — useTouchGestures Hook
   
   React hook for touch gesture recognition.
   ===================================================== */

import { useState, useEffect, useCallback, useRef } from 'react';

import {
  TouchGesture,
  TouchEvent as TouchGestureEvent,
  TouchGestureConfig,
  DEFAULT_TOUCH_CONFIG,
} from './mobile.types';

// ─────────────────────────────────────────────────────
// HOOK OPTIONS
// ─────────────────────────────────────────────────────

export interface UseTouchGesturesOptions {
  config?: Partial<TouchGestureConfig>;
  onGesture?: (event: TouchGestureEvent) => void;
  elementRef?: React.RefObject<HTMLElement>;
}

// ─────────────────────────────────────────────────────
// HOOK RETURN
// ─────────────────────────────────────────────────────

export interface UseTouchGesturesReturn {
  // Current state
  isTouching: boolean;
  touchCount: number;
  lastGesture: TouchGestureEvent | null;
  
  // Position
  position: { x: number; y: number } | null;
  delta: { x: number; y: number };
  
  // Pinch/rotate
  scale: number;
  rotation: number;
  
  // Handlers (for manual binding)
  handlers: {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: (e: React.TouchEvent) => void;
  };
  
  // Config
  setConfig: (config: Partial<TouchGestureConfig>) => void;
}

// ─────────────────────────────────────────────────────
// INTERNAL STATE
// ─────────────────────────────────────────────────────

interface TouchState {
  startTime: number;
  startPosition: { x: number; y: number };
  startPositions: { x: number; y: number }[];
  currentPosition: { x: number; y: number };
  initialDistance: number;
  initialAngle: number;
}

// ─────────────────────────────────────────────────────
// MAIN HOOK
// ─────────────────────────────────────────────────────

export function useTouchGestures(
  options: UseTouchGesturesOptions = {}
): UseTouchGesturesReturn {
  const {
    config: configOverride,
    onGesture,
    elementRef,
  } = options;

  // Config
  const [config, setConfigState] = useState<TouchGestureConfig>({
    ...DEFAULT_TOUCH_CONFIG,
    ...configOverride,
  });

  // State
  const [isTouching, setIsTouching] = useState(false);
  const [touchCount, setTouchCount] = useState(0);
  const [lastGesture, setLastGesture] = useState<TouchGestureEvent | null>(null);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [delta, setDelta] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  // Refs
  const touchStateRef = useRef<TouchState | null>(null);
  const lastTapTimeRef = useRef(0);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Emit gesture
  const emitGesture = useCallback((
    gesture: TouchGesture,
    extra: Partial<TouchGestureEvent> = {}
  ) => {
    if (!config.gestures.includes(gesture)) return;

    const event: TouchGestureEvent = {
      gesture,
      position: position || { x: 0, y: 0 },
      delta,
      scale,
      rotation,
      fingers: touchCount,
      timestamp: Date.now(),
      ...extra,
    };

    setLastGesture(event);
    onGesture?.(event);
  }, [config.gestures, position, delta, scale, rotation, touchCount, onGesture]);

  // Touch start
  const handleTouchStart = useCallback((e: React.TouchEvent | TouchEvent) => {
    if (!config.enabled) return;

    const touches = e.touches;
    const count = touches.length;

    setIsTouching(true);
    setTouchCount(count);

    const pos = {
      x: touches[0].clientX,
      y: touches[0].clientY,
    };
    setPosition(pos);
    setDelta({ x: 0, y: 0 });

    // Store all touch positions
    const positions: { x: number; y: number }[] = [];
    for (let i = 0; i < count; i++) {
      positions.push({
        x: touches[i].clientX,
        y: touches[i].clientY,
      });
    }

    // Calculate initial distance and angle for pinch/rotate
    let initialDistance = 0;
    let initialAngle = 0;
    if (count >= 2) {
      const dx = touches[1].clientX - touches[0].clientX;
      const dy = touches[1].clientY - touches[0].clientY;
      initialDistance = Math.sqrt(dx * dx + dy * dy);
      initialAngle = Math.atan2(dy, dx) * (180 / Math.PI);
    }

    touchStateRef.current = {
      startTime: Date.now(),
      startPosition: pos,
      startPositions: positions,
      currentPosition: pos,
      initialDistance,
      initialAngle,
    };

    // Start long press timer
    if (count === 1) {
      longPressTimerRef.current = setTimeout(() => {
        emitGesture('long_press');
      }, config.longPressMinDuration);
    }
  }, [config.enabled, config.longPressMinDuration, emitGesture]);

  // Touch move
  const handleTouchMove = useCallback((e: React.TouchEvent | TouchEvent) => {
    if (!config.enabled || !touchStateRef.current) return;

    const touches = e.touches;
    const count = touches.length;

    // Cancel long press
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    const pos = {
      x: touches[0].clientX,
      y: touches[0].clientY,
    };
    setPosition(pos);

    const dx = pos.x - touchStateRef.current.startPosition.x;
    const dy = pos.y - touchStateRef.current.startPosition.y;
    setDelta({ x: dx, y: dy });

    touchStateRef.current.currentPosition = pos;

    // Handle pinch/rotate
    if (count >= 2) {
      const touchDx = touches[1].clientX - touches[0].clientX;
      const touchDy = touches[1].clientY - touches[0].clientY;
      const currentDistance = Math.sqrt(touchDx * touchDx + touchDy * touchDy);
      const currentAngle = Math.atan2(touchDy, touchDx) * (180 / Math.PI);

      // Scale
      if (touchStateRef.current.initialDistance > 0) {
        const newScale = currentDistance / touchStateRef.current.initialDistance;
        setScale(newScale);

        if (Math.abs(newScale - 1) > config.pinchMinScale) {
          emitGesture(newScale < 1 ? 'pinch_in' : 'pinch_out', { scale: newScale });
        }
      }

      // Rotation
      const angleDiff = currentAngle - touchStateRef.current.initialAngle;
      setRotation(angleDiff);

      if (Math.abs(angleDiff) > config.rotateMinAngle) {
        emitGesture('rotate', { rotation: angleDiff });
      }
    }

    // Pan gesture
    if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
      emitGesture('pan', { delta: { x: dx, y: dy } });
    }
  }, [config.enabled, config.pinchMinScale, config.rotateMinAngle, emitGesture]);

  // Touch end
  const handleTouchEnd = useCallback((e: React.TouchEvent | TouchEvent) => {
    if (!config.enabled || !touchStateRef.current) return;

    // Cancel long press
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    const state = touchStateRef.current;
    const duration = Date.now() - state.startTime;
    const dx = state.currentPosition.x - state.startPosition.x;
    const dy = state.currentPosition.y - state.startPosition.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const velocity = distance / duration;

    // Detect gesture
    if (duration < config.tapMaxDuration && distance < 10) {
      // Tap
      const now = Date.now();
      if (now - lastTapTimeRef.current < config.doubleTapDelay) {
        emitGesture('double_tap');
        lastTapTimeRef.current = 0;
      } else {
        // Delay tap to wait for potential double tap
        setTimeout(() => {
          if (lastTapTimeRef.current > 0) {
            emitGesture(touchCount >= 2 ? 'two_finger_tap' : 'tap');
          }
        }, config.doubleTapDelay);
        lastTapTimeRef.current = now;
      }
    } else if (distance >= config.swipeMinDistance && duration <= config.swipeMaxDuration) {
      // Swipe
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);

      if (absX > absY) {
        emitGesture(dx > 0 ? 'swipe_right' : 'swipe_left', { velocity });
      } else {
        emitGesture(dy > 0 ? 'swipe_down' : 'swipe_up', { velocity });
      }
    }

    // Reset
    if (e.touches.length === 0) {
      setIsTouching(false);
      setTouchCount(0);
      setPosition(null);
      setDelta({ x: 0, y: 0 });
      setScale(1);
      setRotation(0);
      touchStateRef.current = null;
    }
  }, [config, touchCount, emitGesture]);

  // Bind to element if provided
  useEffect(() => {
    const element = elementRef?.current;
    if (!element) return;

    element.addEventListener('touchstart', handleTouchStart as any);
    element.addEventListener('touchmove', handleTouchMove as any);
    element.addEventListener('touchend', handleTouchEnd as any);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart as any);
      element.removeEventListener('touchmove', handleTouchMove as any);
      element.removeEventListener('touchend', handleTouchEnd as any);
    };
  }, [elementRef, handleTouchStart, handleTouchMove, handleTouchEnd]);

  // Set config
  const setConfig = useCallback((newConfig: Partial<TouchGestureConfig>) => {
    setConfigState(prev => ({ ...prev, ...newConfig }));
  }, []);

  return {
    isTouching,
    touchCount,
    lastGesture,
    position,
    delta,
    scale,
    rotation,
    handlers: {
      onTouchStart: handleTouchStart as any,
      onTouchMove: handleTouchMove as any,
      onTouchEnd: handleTouchEnd as any,
    },
    setConfig,
  };
}

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default useTouchGestures;
