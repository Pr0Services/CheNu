/* =====================================================
   CHE·NU — XR Types
   
   Types for VR/AR immersive experience.
   Supports WebXR via @react-three/xr
   ===================================================== */

// ─────────────────────────────────────────────────────
// XR SESSION
// ─────────────────────────────────────────────────────

export type XRSessionMode = 'inline' | 'immersive-vr' | 'immersive-ar';

export type XRReferenceSpace = 
  | 'viewer' 
  | 'local' 
  | 'local-floor' 
  | 'bounded-floor' 
  | 'unbounded';

export interface XRSessionConfig {
  mode: XRSessionMode;
  referenceSpace: XRReferenceSpace;
  optionalFeatures?: XRFeature[];
  requiredFeatures?: XRFeature[];
}

export type XRFeature = 
  | 'hand-tracking'
  | 'hit-test'
  | 'dom-overlay'
  | 'anchors'
  | 'plane-detection'
  | 'mesh-detection'
  | 'light-estimation'
  | 'depth-sensing'
  | 'layers';

// ─────────────────────────────────────────────────────
// XR CONTROLLER
// ─────────────────────────────────────────────────────

export type XRHandedness = 'left' | 'right' | 'none';

export interface XRControllerState {
  handedness: XRHandedness;
  connected: boolean;
  position: [number, number, number];
  rotation: [number, number, number, number]; // Quaternion
  grip?: XRGripState;
  gamepad?: XRGamepadState;
}

export interface XRGripState {
  position: [number, number, number];
  rotation: [number, number, number, number];
}

export interface XRGamepadState {
  buttons: XRButtonState[];
  axes: number[];
}

export interface XRButtonState {
  pressed: boolean;
  touched: boolean;
  value: number;
}

// ─────────────────────────────────────────────────────
// HAND TRACKING
// ─────────────────────────────────────────────────────

export interface XRHandState {
  handedness: XRHandedness;
  joints: Map<XRHandJoint, XRJointState>;
  pinching: boolean;
  pinchStrength: number;
}

export type XRHandJoint =
  | 'wrist'
  | 'thumb-metacarpal' | 'thumb-phalanx-proximal' | 'thumb-phalanx-distal' | 'thumb-tip'
  | 'index-finger-metacarpal' | 'index-finger-phalanx-proximal' | 'index-finger-phalanx-intermediate' | 'index-finger-phalanx-distal' | 'index-finger-tip'
  | 'middle-finger-metacarpal' | 'middle-finger-phalanx-proximal' | 'middle-finger-phalanx-intermediate' | 'middle-finger-phalanx-distal' | 'middle-finger-tip'
  | 'ring-finger-metacarpal' | 'ring-finger-phalanx-proximal' | 'ring-finger-phalanx-intermediate' | 'ring-finger-phalanx-distal' | 'ring-finger-tip'
  | 'pinky-finger-metacarpal' | 'pinky-finger-phalanx-proximal' | 'pinky-finger-phalanx-intermediate' | 'pinky-finger-phalanx-distal' | 'pinky-finger-tip';

export interface XRJointState {
  position: [number, number, number];
  rotation: [number, number, number, number];
  radius: number;
}

// ─────────────────────────────────────────────────────
// XR EVENTS
// ─────────────────────────────────────────────────────

export type XREventType =
  | 'select'
  | 'selectstart'
  | 'selectend'
  | 'squeeze'
  | 'squeezestart'
  | 'squeezeend'
  | 'connected'
  | 'disconnected';

export interface XRInteractionEvent {
  type: XREventType;
  handedness: XRHandedness;
  targetId?: string;
  position?: [number, number, number];
  timestamp: number;
}

// ─────────────────────────────────────────────────────
// XR INTERACTION
// ─────────────────────────────────────────────────────

export type XRInteractionMode = 
  | 'ray'           // Ray casting from controller
  | 'touch'         // Direct touch
  | 'grab'          // Grab and move
  | 'pinch';        // Pinch gesture (hand tracking)

export interface XRInteractionConfig {
  mode: XRInteractionMode;
  rayLength?: number;
  hapticFeedback?: boolean;
  hapticIntensity?: number;
  hapticDuration?: number;
}

export const DEFAULT_XR_INTERACTION: XRInteractionConfig = {
  mode: 'ray',
  rayLength: 10,
  hapticFeedback: true,
  hapticIntensity: 0.5,
  hapticDuration: 50,
};

// ─────────────────────────────────────────────────────
// XR UI
// ─────────────────────────────────────────────────────

export interface XRUIConfig {
  panelDistance: number;       // Distance from user
  panelWidth: number;          // Panel width in meters
  panelHeight: number;         // Panel height in meters
  followHead: boolean;         // Follow head movement
  curvedPanel: boolean;        // Curved UI panels
  opacity: number;
}

export const DEFAULT_XR_UI: XRUIConfig = {
  panelDistance: 2,
  panelWidth: 1.5,
  panelHeight: 1,
  followHead: false,
  curvedPanel: true,
  opacity: 0.95,
};

// ─────────────────────────────────────────────────────
// XR UNIVERSE CONFIG
// ─────────────────────────────────────────────────────

export interface XRUniverseConfig {
  scale: number;               // Universe scale in XR (1 = 1:1)
  sphereMinSize: number;       // Min sphere size in meters
  sphereMaxSize: number;       // Max sphere size in meters
  playerHeight: number;        // Standing player height
  locomotion: XRLocomotionMode;
  comfort: XRComfortSettings;
}

export type XRLocomotionMode = 
  | 'teleport'      // Point and teleport
  | 'continuous'    // Smooth movement
  | 'none';         // Stationary

export interface XRComfortSettings {
  vignette: boolean;           // Reduce motion sickness
  snapTurn: boolean;           // Snap rotation vs smooth
  snapTurnAngle: number;       // Degrees per snap
  tunnelEffect: boolean;       // Tunnel vision during movement
}

export const DEFAULT_XR_UNIVERSE: XRUniverseConfig = {
  scale: 1,
  sphereMinSize: 0.3,
  sphereMaxSize: 2,
  playerHeight: 1.6,
  locomotion: 'teleport',
  comfort: {
    vignette: true,
    snapTurn: true,
    snapTurnAngle: 45,
    tunnelEffect: false,
  },
};

// ─────────────────────────────────────────────────────
// XR STATE
// ─────────────────────────────────────────────────────

export interface XRState {
  isSupported: boolean;
  isPresenting: boolean;
  sessionMode: XRSessionMode | null;
  controllers: XRControllerState[];
  hands: XRHandState[];
  referenceSpace: XRReferenceSpace | null;
}

export const INITIAL_XR_STATE: XRState = {
  isSupported: false,
  isPresenting: false,
  sessionMode: null,
  controllers: [],
  hands: [],
  referenceSpace: null,
};

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default {
  DEFAULT_XR_INTERACTION,
  DEFAULT_XR_UI,
  DEFAULT_XR_UNIVERSE,
  INITIAL_XR_STATE,
};
