/* =====================================================
   CHE·NU — Gesture Pose Definitions
   
   Definitions for static hand poses recognition.
   Each pose specifies finger requirements.
   ===================================================== */

import {
  GesturePose,
  GesturePoseDefinition,
  FingerPoseRequirement,
  FingerName,
} from './gesture.types';

// ─────────────────────────────────────────────────────
// HELPER: Create finger requirements
// ─────────────────────────────────────────────────────

const extended = (): FingerPoseRequirement => ({ extended: true, curlRange: [0, 0.3] });
const curled = (): FingerPoseRequirement => ({ curled: true, curlRange: [0.7, 1.0] });
const any = (): FingerPoseRequirement => ({});
const halfCurled = (): FingerPoseRequirement => ({ curlRange: [0.3, 0.7] });

// ─────────────────────────────────────────────────────
// POSE DEFINITIONS
// ─────────────────────────────────────────────────────

export const GESTURE_POSES: Record<GesturePose, GesturePoseDefinition> = {
  // Main ouverte - tous les doigts étendus
  open_hand: {
    id: 'open_hand',
    name: 'Open Hand',
    nameFr: 'Main ouverte',
    fingers: {
      thumb: extended(),
      index: extended(),
      middle: extended(),
      ring: extended(),
      pinky: extended(),
    },
    palmDirection: 'any',
    tolerance: 0.25,
  },

  // Poing fermé - tous les doigts repliés
  fist: {
    id: 'fist',
    name: 'Fist',
    nameFr: 'Poing',
    fingers: {
      thumb: curled(),
      index: curled(),
      middle: curled(),
      ring: curled(),
      pinky: curled(),
    },
    palmDirection: 'any',
    tolerance: 0.2,
  },

  // Pointer - index étendu
  point: {
    id: 'point',
    name: 'Point',
    nameFr: 'Pointer',
    fingers: {
      thumb: any(),
      index: extended(),
      middle: curled(),
      ring: curled(),
      pinky: curled(),
    },
    palmDirection: 'any',
    tolerance: 0.2,
  },

  // Pouce en l'air
  thumbs_up: {
    id: 'thumbs_up',
    name: 'Thumbs Up',
    nameFr: 'Pouce levé',
    fingers: {
      thumb: extended(),
      index: curled(),
      middle: curled(),
      ring: curled(),
      pinky: curled(),
    },
    palmDirection: 'any',
    tolerance: 0.2,
  },

  // Pouce en bas
  thumbs_down: {
    id: 'thumbs_down',
    name: 'Thumbs Down',
    nameFr: 'Pouce baissé',
    fingers: {
      thumb: extended(),
      index: curled(),
      middle: curled(),
      ring: curled(),
      pinky: curled(),
    },
    palmDirection: 'down',
    tolerance: 0.2,
  },

  // V de victoire / Peace
  peace: {
    id: 'peace',
    name: 'Peace',
    nameFr: 'Victoire',
    fingers: {
      thumb: curled(),
      index: extended(),
      middle: extended(),
      ring: curled(),
      pinky: curled(),
    },
    palmDirection: 'any',
    tolerance: 0.2,
  },

  // OK (cercle pouce + index)
  ok: {
    id: 'ok',
    name: 'OK',
    nameFr: 'OK',
    fingers: {
      thumb: halfCurled(),
      index: halfCurled(),
      middle: extended(),
      ring: extended(),
      pinky: extended(),
    },
    palmDirection: 'any',
    tolerance: 0.25,
  },

  // Pince (pouce + index proches)
  pinch: {
    id: 'pinch',
    name: 'Pinch',
    nameFr: 'Pince',
    fingers: {
      thumb: halfCurled(),
      index: halfCurled(),
      middle: any(),
      ring: any(),
      pinky: any(),
    },
    palmDirection: 'any',
    tolerance: 0.3,
  },

  // Saisie (doigts semi-repliés)
  grab: {
    id: 'grab',
    name: 'Grab',
    nameFr: 'Saisir',
    fingers: {
      thumb: halfCurled(),
      index: halfCurled(),
      middle: halfCurled(),
      ring: halfCurled(),
      pinky: halfCurled(),
    },
    palmDirection: 'any',
    tolerance: 0.3,
  },

  // Téléphone (pouce + auriculaire)
  phone: {
    id: 'phone',
    name: 'Phone',
    nameFr: 'Téléphone',
    fingers: {
      thumb: extended(),
      index: curled(),
      middle: curled(),
      ring: curled(),
      pinky: extended(),
    },
    palmDirection: 'any',
    tolerance: 0.2,
  },

  // Rock (index + auriculaire)
  rock: {
    id: 'rock',
    name: 'Rock',
    nameFr: 'Rock',
    fingers: {
      thumb: any(),
      index: extended(),
      middle: curled(),
      ring: curled(),
      pinky: extended(),
    },
    palmDirection: 'any',
    tolerance: 0.2,
  },

  // Pistolet
  gun: {
    id: 'gun',
    name: 'Gun',
    nameFr: 'Pistolet',
    fingers: {
      thumb: extended(),
      index: extended(),
      middle: curled(),
      ring: curled(),
      pinky: curled(),
    },
    palmDirection: 'any',
    tolerance: 0.2,
  },

  // Forme en L
  l_shape: {
    id: 'l_shape',
    name: 'L Shape',
    nameFr: 'Forme L',
    fingers: {
      thumb: extended(),
      index: extended(),
      middle: curled(),
      ring: curled(),
      pinky: curled(),
    },
    palmDirection: 'left',
    tolerance: 0.25,
  },

  // Paume vers le haut
  palm_up: {
    id: 'palm_up',
    name: 'Palm Up',
    nameFr: 'Paume vers le haut',
    fingers: {
      thumb: extended(),
      index: extended(),
      middle: extended(),
      ring: extended(),
      pinky: extended(),
    },
    palmDirection: 'up',
    tolerance: 0.2,
  },

  // Paume vers le bas
  palm_down: {
    id: 'palm_down',
    name: 'Palm Down',
    nameFr: 'Paume vers le bas',
    fingers: {
      thumb: extended(),
      index: extended(),
      middle: extended(),
      ring: extended(),
      pinky: extended(),
    },
    palmDirection: 'down',
    tolerance: 0.2,
  },

  // Stop (main ouverte face)
  stop: {
    id: 'stop',
    name: 'Stop',
    nameFr: 'Stop',
    fingers: {
      thumb: extended(),
      index: extended(),
      middle: extended(),
      ring: extended(),
      pinky: extended(),
    },
    palmDirection: 'forward',
    tolerance: 0.2,
  },

  // Salut
  wave: {
    id: 'wave',
    name: 'Wave',
    nameFr: 'Salut',
    fingers: {
      thumb: extended(),
      index: extended(),
      middle: extended(),
      ring: extended(),
      pinky: extended(),
    },
    palmDirection: 'forward',
    tolerance: 0.25,
  },
};

// ─────────────────────────────────────────────────────
// POSE MATCHING
// ─────────────────────────────────────────────────────

import { FingerState, HandState, JointPosition } from './gesture.types';

/**
 * Match a hand state against a pose definition.
 * Returns confidence score 0-1.
 */
export function matchPose(
  handState: HandState,
  pose: GesturePoseDefinition
): number {
  if (!handState.isTracked) return 0;

  let totalScore = 0;
  let fingerCount = 0;

  // Check each finger
  const fingerNames: FingerName[] = ['thumb', 'index', 'middle', 'ring', 'pinky'];
  
  for (const fingerName of fingerNames) {
    const requirement = pose.fingers[fingerName];
    const fingerState = handState.fingers[fingerName];
    
    if (!fingerState) continue;
    
    const score = matchFingerRequirement(fingerState, requirement);
    totalScore += score;
    fingerCount++;
  }

  // Check palm direction if specified
  if (pose.palmDirection && pose.palmDirection !== 'any') {
    const directionScore = matchPalmDirection(handState.palmNormal, pose.palmDirection);
    totalScore += directionScore;
    fingerCount++;
  }

  const confidence = fingerCount > 0 ? totalScore / fingerCount : 0;
  
  // Apply tolerance
  return confidence >= (1 - pose.tolerance) ? confidence : 0;
}

function matchFingerRequirement(
  finger: FingerState,
  requirement: FingerPoseRequirement
): number {
  // If no requirements, always match
  if (!requirement.extended && !requirement.curled && !requirement.curlRange) {
    return 1;
  }

  // Check extended/curled
  if (requirement.extended !== undefined) {
    if (requirement.extended !== finger.isExtended) return 0;
  }
  if (requirement.curled !== undefined) {
    if (requirement.curled !== finger.isCurled) return 0;
  }

  // Check curl range
  if (requirement.curlRange) {
    const [min, max] = requirement.curlRange;
    if (finger.curl < min || finger.curl > max) {
      // Calculate partial score based on how close
      const distance = finger.curl < min 
        ? min - finger.curl 
        : finger.curl - max;
      return Math.max(0, 1 - distance * 2);
    }
  }

  return 1;
}

function matchPalmDirection(
  palmNormal: JointPosition,
  direction: 'up' | 'down' | 'forward' | 'back' | 'left' | 'right'
): number {
  const expected: JointPosition = {
    up: { x: 0, y: 1, z: 0 },
    down: { x: 0, y: -1, z: 0 },
    forward: { x: 0, y: 0, z: -1 },
    back: { x: 0, y: 0, z: 1 },
    left: { x: -1, y: 0, z: 0 },
    right: { x: 1, y: 0, z: 0 },
  }[direction];

  // Dot product
  const dot = 
    palmNormal.x * expected.x + 
    palmNormal.y * expected.y + 
    palmNormal.z * expected.z;

  // Convert to 0-1 score (dot product is -1 to 1)
  return Math.max(0, (dot + 1) / 2);
}

/**
 * Find the best matching pose for a hand state.
 */
export function detectPose(
  handState: HandState,
  enabledPoses: GesturePose[]
): { pose: GesturePose | null; confidence: number } {
  let bestPose: GesturePose | null = null;
  let bestConfidence = 0;

  for (const poseId of enabledPoses) {
    const definition = GESTURE_POSES[poseId];
    if (!definition) continue;

    const confidence = matchPose(handState, definition);
    if (confidence > bestConfidence) {
      bestConfidence = confidence;
      bestPose = poseId;
    }
  }

  return { pose: bestPose, confidence: bestConfidence };
}

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default GESTURE_POSES;
