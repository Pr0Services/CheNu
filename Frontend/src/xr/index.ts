/* =====================================================
   CHE·NU — XR Module
   
   VR/AR support for immersive universe exploration.
   Built on @react-three/xr for WebXR integration.
   ===================================================== */

// Types
export * from './xr.types';

// Provider
export { 
  XRProvider, 
  useXRContext,
  XRButton,
} from './XRProvider';
export type { XRProviderProps, XRButtonProps } from './XRProvider';

// Interactions
export { 
  XRInteractions,
  XRHandInteractions,
  XRTeleport,
} from './XRInteractions';
export type { 
  XRInteractionsProps,
  XRHandInteractionsProps,
  XRTeleportProps,
} from './XRInteractions';

// Universe View
export { XRUniverseView } from './XRUniverseView';
export type { XRUniverseViewProps } from './XRUniverseView';

// Meeting Room
export * from './meeting';

// Voice
export * from './voice';

// Avatars
export * from './avatars';

// Gestures
export * from './gestures';

// Notifications
export * from './notifications';

// Radial Menu
export * from './radial-menu';

// Multiplayer
export * from './multiplayer';

// Mobile
export * from './mobile';

// Debug Experience
export * from './debug';

// Replay System
export * from './replay';

// Re-export defaults
export {
  DEFAULT_XR_INTERACTION,
  DEFAULT_XR_UI,
  DEFAULT_XR_UNIVERSE,
  INITIAL_XR_STATE,
} from './xr.types';
