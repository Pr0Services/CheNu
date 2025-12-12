/* =====================================================
   CHE·NU — XR Avatar Types
   
   Types for human and agent avatars in VR/AR.
   Avatars visualize participants in meetings
   and throughout the universe.
   ===================================================== */

import { AgentRole } from '../../agents/types';

// ─────────────────────────────────────────────────────
// AVATAR KIND
// ─────────────────────────────────────────────────────

export type AvatarKind = 'human' | 'agent' | 'system';

export type AvatarState = 
  | 'idle'       // Default state
  | 'thinking'   // Processing/analyzing
  | 'speaking'   // Currently talking
  | 'listening'  // Actively listening
  | 'warning'    // Alert/attention needed
  | 'success'    // Positive outcome
  | 'error'      // Problem/failure
  | 'offline';   // Disconnected/unavailable

// ─────────────────────────────────────────────────────
// BASE AVATAR
// ─────────────────────────────────────────────────────

export interface BaseAvatar {
  id: string;
  kind: AvatarKind;
  displayName?: string;
  role: string;
  state?: AvatarState;
  
  // Optional visual customization
  color?: string;
  accentColor?: string;
  avatarUrl?: string;
}

// ─────────────────────────────────────────────────────
// HUMAN AVATAR
// ─────────────────────────────────────────────────────

export interface HumanAvatar extends BaseAvatar {
  kind: 'human';
  
  // User info
  userId?: string;
  email?: string;
  
  // Permissions context
  isOwner?: boolean;
  canDecide?: boolean;
  
  // Appearance
  bodyColor?: string;
  headColor?: string;
}

// ─────────────────────────────────────────────────────
// AGENT AVATAR
// ─────────────────────────────────────────────────────

export interface AgentAvatar extends BaseAvatar {
  kind: 'agent';
  
  // Agent specific
  agentRole: AgentRole;
  confidence?: number;      // 0-1, affects visual intensity
  isActive?: boolean;
  isSpeaking?: boolean;
  
  // Visual
  geometryType?: 'icosahedron' | 'octahedron' | 'dodecahedron' | 'sphere';
  glowIntensity?: number;
  ringCount?: number;
}

// ─────────────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────────────

export interface XRAvatarProps {
  avatar: BaseAvatar;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  
  // Callbacks
  onClick?: () => void;
  onHover?: (hovered: boolean) => void;
  
  // Options
  showName?: boolean;
  showRole?: boolean;
  showState?: boolean;
  animate?: boolean;
}

export interface XRHumanAvatarProps extends XRAvatarProps {
  avatar: HumanAvatar;
  
  // Human specific options
  showBody?: boolean;
  showHead?: boolean;
  isLocalPlayer?: boolean;
}

export interface XRAgentAvatarProps extends XRAvatarProps {
  avatar: AgentAvatar;
  
  // Agent specific options
  showAura?: boolean;
  showRings?: boolean;
  pulseOnThinking?: boolean;
}

// ─────────────────────────────────────────────────────
// AVATAR GROUP
// ─────────────────────────────────────────────────────

export interface AvatarGroup {
  id: string;
  name: string;
  avatars: BaseAvatar[];
  layout: 'ring' | 'arc' | 'line' | 'grid';
  center: [number, number, number];
  radius?: number;
  spacing?: number;
}

// ─────────────────────────────────────────────────────
// ANIMATION CONFIGS
// ─────────────────────────────────────────────────────

export interface AvatarAnimation {
  idle: {
    bobAmplitude: number;
    bobSpeed: number;
    rotationSpeed: number;
  };
  thinking: {
    pulseSpeed: number;
    pulseAmplitude: number;
  };
  speaking: {
    waveSpeed: number;
    waveCount: number;
  };
}

export const DEFAULT_HUMAN_ANIMATION: AvatarAnimation = {
  idle: {
    bobAmplitude: 0.02,
    bobSpeed: 1,
    rotationSpeed: 0,
  },
  thinking: {
    pulseSpeed: 2,
    pulseAmplitude: 0.05,
  },
  speaking: {
    waveSpeed: 4,
    waveCount: 3,
  },
};

export const DEFAULT_AGENT_ANIMATION: AvatarAnimation = {
  idle: {
    bobAmplitude: 0.05,
    bobSpeed: 1.5,
    rotationSpeed: 0.5,
  },
  thinking: {
    pulseSpeed: 3,
    pulseAmplitude: 0.15,
  },
  speaking: {
    waveSpeed: 6,
    waveCount: 4,
  },
};

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default {
  DEFAULT_HUMAN_ANIMATION,
  DEFAULT_AGENT_ANIMATION,
};
