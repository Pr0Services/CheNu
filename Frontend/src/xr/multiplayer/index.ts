/* =====================================================
   CHE·NU — XR Multiplayer Module
   
   Real-time multi-user synchronization for VR/AR.
   ===================================================== */

// Types
export * from './multiplayer.types';

// Hook
export { useMultiplayer } from './useMultiplayer';
export type { UseMultiplayerOptions, UseMultiplayerReturn } from './useMultiplayer';

// Components
export { XRRemoteUser, XRUserListPanel } from './XRRemoteUser';
export type { XRRemoteUserProps, XRUserListPanelProps } from './XRRemoteUser';

// Re-export defaults
export {
  DEFAULT_ROOM_SETTINGS,
  DEFAULT_CONNECTION_STATE,
  DEFAULT_MULTIPLAYER_CONFIG,
  USER_COLORS,
  getUserColor,
  generateRoomCode,
  createDefaultUser,
} from './multiplayer.types';
