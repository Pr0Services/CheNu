/* =====================================================
   CHE·NU — XR Gestures Types
   
   Hand gesture recognition for VR/AR interactions.
   Supports static poses and dynamic gestures.
   ===================================================== */

// ─────────────────────────────────────────────────────
// HAND TRACKING
// ─────────────────────────────────────────────────────

export type Hand = 'left' | 'right';

export type FingerName = 
  | 'thumb'
  | 'index'
  | 'middle'
  | 'ring'
  | 'pinky';

export type JointName =
  | 'wrist'
  | 'thumb-metacarpal'
  | 'thumb-phalanx-proximal'
  | 'thumb-phalanx-distal'
  | 'thumb-tip'
  | 'index-finger-metacarpal'
  | 'index-finger-phalanx-proximal'
  | 'index-finger-phalanx-intermediate'
  | 'index-finger-phalanx-distal'
  | 'index-finger-tip'
  | 'middle-finger-metacarpal'
  | 'middle-finger-phalanx-proximal'
  | 'middle-finger-phalanx-intermediate'
  | 'middle-finger-phalanx-distal'
  | 'middle-finger-tip'
  | 'ring-finger-metacarpal'
  | 'ring-finger-phalanx-proximal'
  | 'ring-finger-phalanx-intermediate'
  | 'ring-finger-phalanx-distal'
  | 'ring-finger-tip'
  | 'pinky-finger-metacarpal'
  | 'pinky-finger-phalanx-proximal'
  | 'pinky-finger-phalanx-intermediate'
  | 'pinky-finger-phalanx-distal'
  | 'pinky-finger-tip';

export interface JointPosition {
  x: number;
  y: number;
  z: number;
}

export interface JointRotation {
  x: number;
  y: number;
  z: number;
  w: number;
}

export interface HandJoint {
  name: JointName;
  position: JointPosition;
  rotation: JointRotation;
  radius: number;
}

export interface HandState {
  hand: Hand;
  isTracked: boolean;
  joints: Map<JointName, HandJoint>;
  
  // Derived data
  palmPosition: JointPosition;
  palmNormal: JointPosition;
  palmDirection: JointPosition;
  
  // Finger states
  fingers: Record<FingerName, FingerState>;
}

export interface FingerState {
  name: FingerName;
  isExtended: boolean;
  isCurled: boolean;
  curl: number;        // 0 = extended, 1 = fully curled
  splay: number;       // -1 to 1, spread from center
  tipPosition: JointPosition;
}

// ─────────────────────────────────────────────────────
// STATIC GESTURES (POSES)
// ─────────────────────────────────────────────────────

export type GesturePose =
  | 'open_hand'        // Main ouverte
  | 'fist'             // Poing fermé
  | 'point'            // Index pointé
  | 'thumbs_up'        // Pouce en l'air
  | 'thumbs_down'      // Pouce en bas
  | 'peace'            // V de victoire
  | 'ok'               // OK (pouce + index cercle)
  | 'pinch'            // Pince (pouce + index)
  | 'grab'             // Saisie
  | 'phone'            // Téléphone (pouce + auriculaire)
  | 'rock'             // Rock (index + auriculaire)
  | 'gun'              // Pistolet (pouce + index)
  | 'l_shape'          // L (pouce + index perpendiculaires)
  | 'palm_up'          // Paume vers le haut
  | 'palm_down'        // Paume vers le bas
  | 'stop'             // Stop (main ouverte face)
  | 'wave';            // Position de salut

export interface GesturePoseDefinition {
  id: GesturePose;
  name: string;
  nameFr: string;
  fingers: Record<FingerName, FingerPoseRequirement>;
  palmDirection?: 'up' | 'down' | 'forward' | 'back' | 'left' | 'right' | 'any';
  tolerance: number;
}

export interface FingerPoseRequirement {
  extended?: boolean;
  curled?: boolean;
  curlRange?: [number, number];
}

// ─────────────────────────────────────────────────────
// DYNAMIC GESTURES
// ─────────────────────────────────────────────────────

export type GestureMotion =
  | 'swipe_left'
  | 'swipe_right'
  | 'swipe_up'
  | 'swipe_down'
  | 'push'
  | 'pull'
  | 'rotate_cw'
  | 'rotate_ccw'
  | 'wave'
  | 'pinch_in'
  | 'pinch_out'
  | 'grab_pull'
  | 'throw'
  | 'tap'
  | 'double_tap'
  | 'hold';

export interface GestureMotionDefinition {
  id: GestureMotion;
  name: string;
  nameFr: string;
  
  // Start pose
  startPose?: GesturePose;
  
  // Motion parameters
  minDistance: number;
  maxDuration: number;
  direction?: [number, number, number];
  directionTolerance: number;
  
  // Velocity
  minVelocity?: number;
  maxVelocity?: number;
}

// ─────────────────────────────────────────────────────
// GESTURE RECOGNITION
// ─────────────────────────────────────────────────────

export interface GestureRecognitionConfig {
  enabled: boolean;
  
  // Sensitivity
  poseTolerance: number;
  motionSensitivity: number;
  
  // Timing
  poseHoldTime: number;      // ms to confirm static pose
  motionTimeout: number;     // ms max for motion gesture
  
  // Filtering
  smoothingFactor: number;   // 0-1, higher = more smoothing
  noiseThreshold: number;
  
  // Hands
  enabledHands: Hand[];
  
  // Gestures to recognize
  enabledPoses: GesturePose[];
  enabledMotions: GestureMotion[];
}

export const DEFAULT_GESTURE_CONFIG: GestureRecognitionConfig = {
  enabled: true,
  poseTolerance: 0.2,
  motionSensitivity: 0.5,
  poseHoldTime: 300,
  motionTimeout: 1000,
  smoothingFactor: 0.3,
  noiseThreshold: 0.05,
  enabledHands: ['left', 'right'],
  enabledPoses: ['point', 'thumbs_up', 'ok', 'pinch', 'grab', 'open_hand', 'fist'],
  enabledMotions: ['swipe_left', 'swipe_right', 'swipe_up', 'swipe_down', 'pinch_in', 'pinch_out'],
};

// ─────────────────────────────────────────────────────
// GESTURE EVENTS
// ─────────────────────────────────────────────────────

export interface GestureEvent {
  id: string;
  type: 'pose' | 'motion';
  gesture: GesturePose | GestureMotion;
  hand: Hand;
  confidence: number;
  timestamp: number;
  duration?: number;
  
  // Position data
  startPosition?: JointPosition;
  endPosition?: JointPosition;
  velocity?: number;
  
  // Metadata
  cancelled?: boolean;
}

export type GestureEventHandler = (event: GestureEvent) => void;

// ─────────────────────────────────────────────────────
// GESTURE BINDINGS
// ─────────────────────────────────────────────────────

export interface GestureBinding {
  id: string;
  gesture: GesturePose | GestureMotion;
  hand?: Hand;
  action: GestureAction;
  context?: string[];
  cooldown: number;
}

export type GestureAction =
  | { type: 'SELECT' }
  | { type: 'CONFIRM' }
  | { type: 'CANCEL' }
  | { type: 'BACK' }
  | { type: 'SCROLL'; direction: 'up' | 'down' | 'left' | 'right' }
  | { type: 'ZOOM'; direction: 'in' | 'out' }
  | { type: 'ROTATE'; direction: 'cw' | 'ccw' }
  | { type: 'GRAB' }
  | { type: 'RELEASE' }
  | { type: 'MENU_TOGGLE' }
  | { type: 'MUTE_TOGGLE' }
  | { type: 'NAVIGATE'; target: string }
  | { type: 'CUSTOM'; payload: unknown };

// ─────────────────────────────────────────────────────
// GESTURE STATE
// ─────────────────────────────────────────────────────

export interface GestureRecognitionState {
  isSupported: boolean;
  isEnabled: boolean;
  
  // Hand states
  leftHand?: HandState;
  rightHand?: HandState;
  
  // Current gestures
  currentPoses: Map<Hand, GesturePose | null>;
  activeMotion?: {
    hand: Hand;
    motion: GestureMotion;
    progress: number;
  };
  
  // History
  lastGesture?: GestureEvent;
  gestureHistory: GestureEvent[];
}

export const DEFAULT_GESTURE_STATE: GestureRecognitionState = {
  isSupported: false,
  isEnabled: false,
  currentPoses: new Map([['left', null], ['right', null]]),
  gestureHistory: [],
};

// ─────────────────────────────────────────────────────
// VISUAL FEEDBACK
// ─────────────────────────────────────────────────────

export interface GestureFeedbackConfig {
  showHands: boolean;
  handColor: string;
  handOpacity: number;
  
  showGestureIndicator: boolean;
  indicatorPosition: 'wrist' | 'palm' | 'floating';
  indicatorColor: string;
  
  showTrail: boolean;
  trailColor: string;
  trailLength: number;
  
  hapticFeedback: boolean;
  hapticIntensity: number;
}

export const DEFAULT_FEEDBACK_CONFIG: GestureFeedbackConfig = {
  showHands: true,
  handColor: '#ffffff',
  handOpacity: 0.8,
  showGestureIndicator: true,
  indicatorPosition: 'wrist',
  indicatorColor: '#6366f1',
  showTrail: true,
  trailColor: '#8b5cf6',
  trailLength: 20,
  hapticFeedback: true,
  hapticIntensity: 0.5,
};
