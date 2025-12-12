/* =====================================================
   CHE·NU — XR Avatars Module
   
   Visual representations of humans and agents
   in VR/AR environments.
   ===================================================== */

// Types
export * from './avatar.types';

// Themes
export * from './avatarThemes';

// Components
export { XRHumanAvatar } from './XRHumanAvatar';
export type { } from './XRHumanAvatar';

export { XRAgentAvatar } from './XRAgentAvatar';
export type { } from './XRAgentAvatar';

// Re-export defaults
export {
  DEFAULT_HUMAN_ANIMATION,
  DEFAULT_AGENT_ANIMATION,
} from './avatar.types';

export {
  DEFAULT_STATE_COLORS,
  DEFAULT_ROLE_COLORS,
  DEFAULT_AVATAR_THEME,
  AVATAR_THEMES,
} from './avatarThemes';
