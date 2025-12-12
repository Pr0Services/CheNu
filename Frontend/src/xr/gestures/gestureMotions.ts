/* =====================================================
   CHE·NU — Gesture Motion Detection
   
   Dynamic gesture recognition (swipes, rotations, etc.)
   Tracks hand movement over time.
   ===================================================== */

import {
  GestureMotion,
  GestureMotionDefinition,
  JointPosition,
  Hand,
  HandState,
} from './gesture.types';

// ─────────────────────────────────────────────────────
// MOTION DEFINITIONS
// ─────────────────────────────────────────────────────

export const GESTURE_MOTIONS: Record<GestureMotion, GestureMotionDefinition> = {
  swipe_left: {
    id: 'swipe_left',
    name: 'Swipe Left',
    nameFr: 'Balayer gauche',
    minDistance: 0.15,
    maxDuration: 500,
    direction: [-1, 0, 0],
    directionTolerance: 0.4,
    minVelocity: 0.3,
  },

  swipe_right: {
    id: 'swipe_right',
    name: 'Swipe Right',
    nameFr: 'Balayer droite',
    minDistance: 0.15,
    maxDuration: 500,
    direction: [1, 0, 0],
    directionTolerance: 0.4,
    minVelocity: 0.3,
  },

  swipe_up: {
    id: 'swipe_up',
    name: 'Swipe Up',
    nameFr: 'Balayer haut',
    minDistance: 0.15,
    maxDuration: 500,
    direction: [0, 1, 0],
    directionTolerance: 0.4,
    minVelocity: 0.3,
  },

  swipe_down: {
    id: 'swipe_down',
    name: 'Swipe Down',
    nameFr: 'Balayer bas',
    minDistance: 0.15,
    maxDuration: 500,
    direction: [0, -1, 0],
    directionTolerance: 0.4,
    minVelocity: 0.3,
  },

  push: {
    id: 'push',
    name: 'Push',
    nameFr: 'Pousser',
    startPose: 'open_hand',
    minDistance: 0.2,
    maxDuration: 600,
    direction: [0, 0, -1],
    directionTolerance: 0.3,
    minVelocity: 0.2,
  },

  pull: {
    id: 'pull',
    name: 'Pull',
    nameFr: 'Tirer',
    startPose: 'grab',
    minDistance: 0.2,
    maxDuration: 600,
    direction: [0, 0, 1],
    directionTolerance: 0.3,
    minVelocity: 0.2,
  },

  rotate_cw: {
    id: 'rotate_cw',
    name: 'Rotate Clockwise',
    nameFr: 'Rotation horaire',
    minDistance: 0.1,
    maxDuration: 1000,
    directionTolerance: 0.5,
  },

  rotate_ccw: {
    id: 'rotate_ccw',
    name: 'Rotate Counter-Clockwise',
    nameFr: 'Rotation anti-horaire',
    minDistance: 0.1,
    maxDuration: 1000,
    directionTolerance: 0.5,
  },

  wave: {
    id: 'wave',
    name: 'Wave',
    nameFr: 'Saluer',
    startPose: 'open_hand',
    minDistance: 0.1,
    maxDuration: 1500,
    directionTolerance: 0.6,
  },

  pinch_in: {
    id: 'pinch_in',
    name: 'Pinch In',
    nameFr: 'Pincer',
    startPose: 'open_hand',
    minDistance: 0.05,
    maxDuration: 500,
    directionTolerance: 0.5,
  },

  pinch_out: {
    id: 'pinch_out',
    name: 'Pinch Out',
    nameFr: 'Écarter',
    startPose: 'pinch',
    minDistance: 0.05,
    maxDuration: 500,
    directionTolerance: 0.5,
  },

  grab_pull: {
    id: 'grab_pull',
    name: 'Grab and Pull',
    nameFr: 'Saisir et tirer',
    startPose: 'open_hand',
    minDistance: 0.15,
    maxDuration: 800,
    direction: [0, 0, 1],
    directionTolerance: 0.4,
  },

  throw: {
    id: 'throw',
    name: 'Throw',
    nameFr: 'Lancer',
    startPose: 'grab',
    minDistance: 0.3,
    maxDuration: 400,
    minVelocity: 0.5,
    directionTolerance: 0.5,
  },

  tap: {
    id: 'tap',
    name: 'Tap',
    nameFr: 'Taper',
    startPose: 'point',
    minDistance: 0.03,
    maxDuration: 200,
    direction: [0, 0, -1],
    directionTolerance: 0.4,
  },

  double_tap: {
    id: 'double_tap',
    name: 'Double Tap',
    nameFr: 'Double tap',
    startPose: 'point',
    minDistance: 0.03,
    maxDuration: 500,
    direction: [0, 0, -1],
    directionTolerance: 0.4,
  },

  hold: {
    id: 'hold',
    name: 'Hold',
    nameFr: 'Maintenir',
    minDistance: 0.02,
    maxDuration: 2000,
    directionTolerance: 1.0,
  },
};

// ─────────────────────────────────────────────────────
// MOTION TRACKER
// ─────────────────────────────────────────────────────

export interface MotionFrame {
  position: JointPosition;
  timestamp: number;
}

export interface MotionTracker {
  hand: Hand;
  frames: MotionFrame[];
  startTime: number;
  isTracking: boolean;
}

export function createMotionTracker(hand: Hand): MotionTracker {
  return {
    hand,
    frames: [],
    startTime: 0,
    isTracking: false,
  };
}

export function addFrame(
  tracker: MotionTracker,
  position: JointPosition
): MotionTracker {
  const now = Date.now();
  
  if (!tracker.isTracking) {
    return {
      ...tracker,
      isTracking: true,
      startTime: now,
      frames: [{ position, timestamp: now }],
    };
  }

  // Add frame
  const frames = [...tracker.frames, { position, timestamp: now }];

  // Keep last 100 frames max
  const trimmedFrames = frames.length > 100 ? frames.slice(-100) : frames;

  return {
    ...tracker,
    frames: trimmedFrames,
  };
}

export function resetTracker(tracker: MotionTracker): MotionTracker {
  return {
    ...tracker,
    frames: [],
    startTime: 0,
    isTracking: false,
  };
}

// ─────────────────────────────────────────────────────
// MOTION ANALYSIS
// ─────────────────────────────────────────────────────

export interface MotionAnalysis {
  displacement: JointPosition;
  distance: number;
  direction: JointPosition;
  duration: number;
  velocity: number;
  isComplete: boolean;
}

export function analyzeMotion(tracker: MotionTracker): MotionAnalysis | null {
  if (tracker.frames.length < 2) return null;

  const first = tracker.frames[0];
  const last = tracker.frames[tracker.frames.length - 1];

  const displacement: JointPosition = {
    x: last.position.x - first.position.x,
    y: last.position.y - first.position.y,
    z: last.position.z - first.position.z,
  };

  const distance = Math.sqrt(
    displacement.x ** 2 + 
    displacement.y ** 2 + 
    displacement.z ** 2
  );

  const direction: JointPosition = distance > 0 ? {
    x: displacement.x / distance,
    y: displacement.y / distance,
    z: displacement.z / distance,
  } : { x: 0, y: 0, z: 0 };

  const duration = last.timestamp - first.timestamp;
  const velocity = duration > 0 ? distance / (duration / 1000) : 0;

  return {
    displacement,
    distance,
    direction,
    duration,
    velocity,
    isComplete: true,
  };
}

// ─────────────────────────────────────────────────────
// MOTION MATCHING
// ─────────────────────────────────────────────────────

export function matchMotion(
  analysis: MotionAnalysis,
  motion: GestureMotionDefinition
): number {
  // Check duration
  if (analysis.duration > motion.maxDuration) return 0;

  // Check distance
  if (analysis.distance < motion.minDistance) return 0;

  // Check velocity
  if (motion.minVelocity && analysis.velocity < motion.minVelocity) return 0;
  if (motion.maxVelocity && analysis.velocity > motion.maxVelocity) return 0;

  // Check direction
  if (motion.direction) {
    const dot = 
      analysis.direction.x * motion.direction[0] +
      analysis.direction.y * motion.direction[1] +
      analysis.direction.z * motion.direction[2];

    const directionScore = (dot + 1) / 2;
    if (directionScore < (1 - motion.directionTolerance)) return 0;

    return directionScore;
  }

  return 1;
}

/**
 * Detect the best matching motion from tracker data.
 */
export function detectMotion(
  tracker: MotionTracker,
  enabledMotions: GestureMotion[]
): { motion: GestureMotion | null; confidence: number } {
  const analysis = analyzeMotion(tracker);
  if (!analysis) return { motion: null, confidence: 0 };

  let bestMotion: GestureMotion | null = null;
  let bestConfidence = 0;

  for (const motionId of enabledMotions) {
    const definition = GESTURE_MOTIONS[motionId];
    if (!definition) continue;

    const confidence = matchMotion(analysis, definition);
    if (confidence > bestConfidence) {
      bestConfidence = confidence;
      bestMotion = motionId;
    }
  }

  return { motion: bestMotion, confidence: bestConfidence };
}

// ─────────────────────────────────────────────────────
// ROTATION DETECTION
// ─────────────────────────────────────────────────────

export function detectRotation(tracker: MotionTracker): {
  isRotating: boolean;
  direction: 'cw' | 'ccw' | null;
  angle: number;
} {
  if (tracker.frames.length < 5) {
    return { isRotating: false, direction: null, angle: 0 };
  }

  // Calculate cumulative angle change
  let totalAngle = 0;

  for (let i = 1; i < tracker.frames.length; i++) {
    const prev = tracker.frames[i - 1].position;
    const curr = tracker.frames[i].position;

    // 2D angle in XY plane
    const angle1 = Math.atan2(prev.y, prev.x);
    const angle2 = Math.atan2(curr.y, curr.x);

    let delta = angle2 - angle1;

    // Normalize to -PI to PI
    if (delta > Math.PI) delta -= 2 * Math.PI;
    if (delta < -Math.PI) delta += 2 * Math.PI;

    totalAngle += delta;
  }

  const absAngle = Math.abs(totalAngle);
  const minAngle = Math.PI / 4; // 45 degrees

  if (absAngle < minAngle) {
    return { isRotating: false, direction: null, angle: 0 };
  }

  return {
    isRotating: true,
    direction: totalAngle > 0 ? 'ccw' : 'cw',
    angle: absAngle,
  };
}

// ─────────────────────────────────────────────────────
// PINCH DETECTION
// ─────────────────────────────────────────────────────

export function detectPinch(
  handState: HandState,
  previousDistance: number
): { isPinching: boolean; direction: 'in' | 'out' | null; delta: number } {
  if (!handState.isTracked) {
    return { isPinching: false, direction: null, delta: 0 };
  }

  const thumb = handState.fingers.thumb;
  const index = handState.fingers.index;

  if (!thumb || !index) {
    return { isPinching: false, direction: null, delta: 0 };
  }

  // Distance between thumb and index tips
  const distance = Math.sqrt(
    (thumb.tipPosition.x - index.tipPosition.x) ** 2 +
    (thumb.tipPosition.y - index.tipPosition.y) ** 2 +
    (thumb.tipPosition.z - index.tipPosition.z) ** 2
  );

  const delta = distance - previousDistance;
  const threshold = 0.01;

  if (Math.abs(delta) < threshold) {
    return { isPinching: false, direction: null, delta: 0 };
  }

  return {
    isPinching: true,
    direction: delta < 0 ? 'in' : 'out',
    delta: Math.abs(delta),
  };
}

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default GESTURE_MOTIONS;
