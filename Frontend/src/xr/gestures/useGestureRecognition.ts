/* =====================================================
   CHE·NU — useGestureRecognition Hook
   
   React hook for hand gesture recognition in XR.
   Combines pose detection and motion tracking.
   ===================================================== */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useXR, useController } from '@react-three/xr';

import {
  Hand,
  HandState,
  FingerState,
  FingerName,
  JointName,
  JointPosition,
  GesturePose,
  GestureMotion,
  GestureEvent,
  GestureBinding,
  GestureRecognitionConfig,
  GestureRecognitionState,
  DEFAULT_GESTURE_CONFIG,
  DEFAULT_GESTURE_STATE,
} from './gesture.types';

import { detectPose, GESTURE_POSES } from './gesturePoses';
import {
  createMotionTracker,
  addFrame,
  resetTracker,
  detectMotion,
  detectPinch,
  MotionTracker,
} from './gestureMotions';

// ─────────────────────────────────────────────────────
// HOOK OPTIONS
// ─────────────────────────────────────────────────────

export interface UseGestureRecognitionOptions {
  config?: Partial<GestureRecognitionConfig>;
  bindings?: GestureBinding[];
  onGesture?: (event: GestureEvent) => void;
  onPoseChange?: (hand: Hand, pose: GesturePose | null) => void;
  context?: string;
}

// ─────────────────────────────────────────────────────
// HOOK RETURN
// ─────────────────────────────────────────────────────

export interface UseGestureRecognitionReturn {
  state: GestureRecognitionState;
  isSupported: boolean;
  
  // Hand states
  leftHand: HandState | undefined;
  rightHand: HandState | undefined;
  
  // Current poses
  leftPose: GesturePose | null;
  rightPose: GesturePose | null;
  
  // Controls
  enable: () => void;
  disable: () => void;
  setConfig: (config: Partial<GestureRecognitionConfig>) => void;
  
  // Gesture history
  lastGesture: GestureEvent | undefined;
  gestureHistory: GestureEvent[];
  clearHistory: () => void;
}

// ─────────────────────────────────────────────────────
// MAIN HOOK
// ─────────────────────────────────────────────────────

export function useGestureRecognition(
  options: UseGestureRecognitionOptions = {}
): UseGestureRecognitionReturn {
  const {
    config: configOverride,
    bindings = [],
    onGesture,
    onPoseChange,
    context,
  } = options;

  // Merge config
  const config: GestureRecognitionConfig = {
    ...DEFAULT_GESTURE_CONFIG,
    ...configOverride,
  };

  // State
  const [state, setState] = useState<GestureRecognitionState>({
    ...DEFAULT_GESTURE_STATE,
  });

  // Refs for tracking
  const leftTrackerRef = useRef<MotionTracker>(createMotionTracker('left'));
  const rightTrackerRef = useRef<MotionTracker>(createMotionTracker('right'));
  const lastPinchDistanceRef = useRef<{ left: number; right: number }>({ left: 0, right: 0 });
  const poseHoldTimerRef = useRef<{ left: number; right: number }>({ left: 0, right: 0 });
  const lastPoseRef = useRef<{ left: GesturePose | null; right: GesturePose | null }>({ left: null, right: null });

  // XR context
  const { isPresenting } = useXR();
  const leftController = useController('left');
  const rightController = useController('right');

  // Check support
  useEffect(() => {
    const isSupported = 'xr' in navigator && isPresenting;
    setState(s => ({ ...s, isSupported }));
  }, [isPresenting]);

  // Build hand state from XR hand data
  const buildHandState = useCallback((
    hand: Hand,
    xrHand: XRHand | undefined
  ): HandState | undefined => {
    if (!xrHand) return undefined;

    const joints = new Map<JointName, any>();
    const fingers: Record<FingerName, FingerState> = {} as any;

    // Extract joint positions (simplified - real implementation would use XRFrame)
    const wrist = xrHand.get('wrist');
    if (!wrist) return undefined;

    // Build finger states
    const fingerNames: FingerName[] = ['thumb', 'index', 'middle', 'ring', 'pinky'];
    const fingerJointPrefixes = {
      thumb: 'thumb',
      index: 'index-finger',
      middle: 'middle-finger',
      ring: 'ring-finger',
      pinky: 'pinky-finger',
    };

    for (const fingerName of fingerNames) {
      const prefix = fingerJointPrefixes[fingerName];
      const tipJoint = xrHand.get(`${prefix}-tip` as XRHandJoint);
      
      // Calculate curl based on joint angles (simplified)
      const curl = 0.5; // Would calculate from actual joint data
      
      fingers[fingerName] = {
        name: fingerName,
        isExtended: curl < 0.3,
        isCurled: curl > 0.7,
        curl,
        splay: 0,
        tipPosition: tipJoint ? { x: 0, y: 0, z: 0 } : { x: 0, y: 0, z: 0 },
      };
    }

    return {
      hand,
      isTracked: true,
      joints,
      palmPosition: { x: 0, y: 0, z: 0 },
      palmNormal: { x: 0, y: 1, z: 0 },
      palmDirection: { x: 0, y: 0, z: -1 },
      fingers,
    };
  }, []);

  // Process gestures
  const processGestures = useCallback(() => {
    if (!state.isEnabled || !config.enabled) return;

    const hands: Hand[] = ['left', 'right'];

    for (const hand of hands) {
      if (!config.enabledHands.includes(hand)) continue;

      const handState = hand === 'left' ? state.leftHand : state.rightHand;
      if (!handState) continue;

      // Detect static pose
      const { pose, confidence } = detectPose(handState, config.enabledPoses);

      // Check pose hold time
      const lastPose = lastPoseRef.current[hand];
      if (pose === lastPose) {
        poseHoldTimerRef.current[hand] += 16; // Assuming 60fps
      } else {
        poseHoldTimerRef.current[hand] = 0;
        lastPoseRef.current[hand] = pose;
        onPoseChange?.(hand, pose);
      }

      // Emit pose event if held long enough
      if (
        pose &&
        poseHoldTimerRef.current[hand] >= config.poseHoldTime &&
        confidence >= 0.7
      ) {
        const event: GestureEvent = {
          id: `${hand}-${pose}-${Date.now()}`,
          type: 'pose',
          gesture: pose,
          hand,
          confidence,
          timestamp: Date.now(),
        };

        // Check bindings
        executeBinding(event, bindings, context);
        onGesture?.(event);

        // Reset timer to prevent repeated triggers
        poseHoldTimerRef.current[hand] = 0;
      }

      // Track motion
      const tracker = hand === 'left' ? leftTrackerRef.current : rightTrackerRef.current;
      const updatedTracker = addFrame(tracker, handState.palmPosition);
      
      if (hand === 'left') {
        leftTrackerRef.current = updatedTracker;
      } else {
        rightTrackerRef.current = updatedTracker;
      }

      // Detect motion gesture
      const { motion, confidence: motionConfidence } = detectMotion(
        updatedTracker,
        config.enabledMotions
      );

      if (motion && motionConfidence > 0.7) {
        const event: GestureEvent = {
          id: `${hand}-${motion}-${Date.now()}`,
          type: 'motion',
          gesture: motion,
          hand,
          confidence: motionConfidence,
          timestamp: Date.now(),
          startPosition: updatedTracker.frames[0]?.position,
          endPosition: updatedTracker.frames[updatedTracker.frames.length - 1]?.position,
        };

        executeBinding(event, bindings, context);
        onGesture?.(event);

        // Reset tracker
        if (hand === 'left') {
          leftTrackerRef.current = resetTracker(updatedTracker);
        } else {
          rightTrackerRef.current = resetTracker(updatedTracker);
        }
      }

      // Detect pinch
      const lastDist = lastPinchDistanceRef.current[hand];
      const pinch = detectPinch(handState, lastDist);
      
      if (pinch.isPinching && pinch.direction) {
        const motion: GestureMotion = pinch.direction === 'in' ? 'pinch_in' : 'pinch_out';
        
        const event: GestureEvent = {
          id: `${hand}-${motion}-${Date.now()}`,
          type: 'motion',
          gesture: motion,
          hand,
          confidence: 0.8,
          timestamp: Date.now(),
        };

        executeBinding(event, bindings, context);
        onGesture?.(event);
      }

      // Update pinch distance
      if (handState.fingers.thumb && handState.fingers.index) {
        const dist = Math.sqrt(
          (handState.fingers.thumb.tipPosition.x - handState.fingers.index.tipPosition.x) ** 2 +
          (handState.fingers.thumb.tipPosition.y - handState.fingers.index.tipPosition.y) ** 2 +
          (handState.fingers.thumb.tipPosition.z - handState.fingers.index.tipPosition.z) ** 2
        );
        lastPinchDistanceRef.current[hand] = dist;
      }
    }
  }, [state, config, bindings, context, onGesture, onPoseChange]);

  // Execute binding action
  const executeBinding = useCallback((
    event: GestureEvent,
    bindings: GestureBinding[],
    currentContext?: string
  ) => {
    for (const binding of bindings) {
      // Check gesture match
      if (binding.gesture !== event.gesture) continue;

      // Check hand match
      if (binding.hand && binding.hand !== event.hand) continue;

      // Check context
      if (binding.context && currentContext && !binding.context.includes(currentContext)) {
        continue;
      }

      // Execute action
      console.log('[Gesture] Binding matched:', binding.action);
      
      // Add to history
      setState(s => ({
        ...s,
        lastGesture: event,
        gestureHistory: [...s.gestureHistory.slice(-49), event],
      }));
    }
  }, []);

  // Controls
  const enable = useCallback(() => {
    setState(s => ({ ...s, isEnabled: true }));
  }, []);

  const disable = useCallback(() => {
    setState(s => ({ ...s, isEnabled: false }));
  }, []);

  const setConfig = useCallback((newConfig: Partial<GestureRecognitionConfig>) => {
    // Would update config
    console.log('[Gesture] Config updated:', newConfig);
  }, []);

  const clearHistory = useCallback(() => {
    setState(s => ({ ...s, gestureHistory: [], lastGesture: undefined }));
  }, []);

  // Animation frame for processing
  useEffect(() => {
    if (!state.isEnabled) return;

    let animationId: number;

    const loop = () => {
      processGestures();
      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(animationId);
  }, [state.isEnabled, processGestures]);

  return {
    state,
    isSupported: state.isSupported,
    leftHand: state.leftHand,
    rightHand: state.rightHand,
    leftPose: state.currentPoses.get('left') || null,
    rightPose: state.currentPoses.get('right') || null,
    enable,
    disable,
    setConfig,
    lastGesture: state.lastGesture,
    gestureHistory: state.gestureHistory,
    clearHistory,
  };
}

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default useGestureRecognition;
