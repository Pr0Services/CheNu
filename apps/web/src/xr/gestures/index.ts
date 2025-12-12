/* =====================================================
   CHE·NU — XR Gestures Module
   
   Hand gesture recognition for VR/AR interactions.
   ===================================================== */

// Types
export * from './gesture.types';

// Definitions
export { GESTURE_POSES, matchPose, detectPose } from './gesturePoses';
export {
  GESTURE_MOTIONS,
  createMotionTracker,
  addFrame,
  resetTracker,
  analyzeMotion,
  matchMotion,
  detectMotion,
  detectRotation,
  detectPinch,
} from './gestureMotions';

// Hook
export { useGestureRecognition } from './useGestureRecognition';
export type { UseGestureRecognitionOptions, UseGestureRecognitionReturn } from './useGestureRecognition';

// Components
export { XRGestureIndicator, XRGestureTrail, XRHandSkeleton, XRGestureHint } from './XRGestureIndicator';
export type { XRGestureIndicatorProps, XRGestureTrailProps, XRHandSkeletonProps, XRGestureHintProps } from './XRGestureIndicator';

// Re-export defaults
export {
  DEFAULT_GESTURE_CONFIG,
  DEFAULT_GESTURE_STATE,
  DEFAULT_FEEDBACK_CONFIG,
} from './gesture.types';
