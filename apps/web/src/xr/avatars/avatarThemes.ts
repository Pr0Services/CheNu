/* =====================================================
   CHE·NU — Avatar Themes
   
   Visual styling for avatars based on:
   - Avatar kind (human/agent)
   - Avatar state (idle/thinking/speaking/etc)
   - Agent role
   - Custom themes
   ===================================================== */

import { AvatarState, AvatarKind } from './avatar.types';
import { AgentRole } from '../../agents/types';

// ─────────────────────────────────────────────────────
// STATE COLORS
// ─────────────────────────────────────────────────────

export interface StateColors {
  idle: string;
  thinking: string;
  speaking: string;
  listening: string;
  warning: string;
  success: string;
  error: string;
  offline: string;
}

export const DEFAULT_STATE_COLORS: StateColors = {
  idle: '#6ec6ff',
  thinking: '#ffd54f',
  speaking: '#81c784',
  listening: '#4fc3f7',
  warning: '#ef5350',
  success: '#66bb6a',
  error: '#f44336',
  offline: '#9e9e9e',
};

export function getStateColor(state: AvatarState): string {
  return DEFAULT_STATE_COLORS[state] || DEFAULT_STATE_COLORS.idle;
}

// ─────────────────────────────────────────────────────
// ROLE COLORS
// ─────────────────────────────────────────────────────

export interface RoleColors {
  orchestrator: string;
  analyzer: string;
  evaluator: string;
  memory: string;
  methodology: string;
  specialist: string;
  advisor: string;
}

export const DEFAULT_ROLE_COLORS: RoleColors = {
  orchestrator: '#8b5cf6',  // Purple
  analyzer: '#3b82f6',      // Blue
  evaluator: '#10b981',     // Green
  memory: '#f59e0b',        // Amber
  methodology: '#ec4899',   // Pink
  specialist: '#06b6d4',    // Cyan
  advisor: '#84cc16',       // Lime
};

export function getRoleColor(role: AgentRole): string {
  return DEFAULT_ROLE_COLORS[role as keyof RoleColors] || '#6366f1';
}

// ─────────────────────────────────────────────────────
// AVATAR THEME
// ─────────────────────────────────────────────────────

export interface AvatarTheme {
  id: string;
  name: string;
  
  // Human avatar
  human: {
    bodyColor: string;
    headColor: string;
    nameTagBg: string;
    nameTagText: string;
    accentColor: string;
  };
  
  // Agent avatar
  agent: {
    coreColor: string;
    auraColor: string;
    ringColor: string;
    glowIntensity: number;
    emissiveIntensity: number;
  };
  
  // State overrides
  stateColors: StateColors;
}

// ─────────────────────────────────────────────────────
// DEFAULT THEME
// ─────────────────────────────────────────────────────

export const DEFAULT_AVATAR_THEME: AvatarTheme = {
  id: 'default',
  name: 'Default',
  
  human: {
    bodyColor: '#dddddd',
    headColor: '#f5f5f5',
    nameTagBg: '#111111',
    nameTagText: '#ffffff',
    accentColor: '#6366f1',
  },
  
  agent: {
    coreColor: '#6ec6ff',
    auraColor: '#6ec6ff',
    ringColor: '#6ec6ff',
    glowIntensity: 0.4,
    emissiveIntensity: 0.4,
  },
  
  stateColors: DEFAULT_STATE_COLORS,
};

// ─────────────────────────────────────────────────────
// COSMIC THEME
// ─────────────────────────────────────────────────────

export const COSMIC_AVATAR_THEME: AvatarTheme = {
  id: 'cosmic',
  name: 'Cosmic',
  
  human: {
    bodyColor: '#2d3748',
    headColor: '#4a5568',
    nameTagBg: '#1a1a2e',
    nameTagText: '#e2e8f0',
    accentColor: '#9f7aea',
  },
  
  agent: {
    coreColor: '#805ad5',
    auraColor: '#9f7aea',
    ringColor: '#b794f4',
    glowIntensity: 0.6,
    emissiveIntensity: 0.5,
  },
  
  stateColors: {
    idle: '#805ad5',
    thinking: '#d69e2e',
    speaking: '#38a169',
    listening: '#3182ce',
    warning: '#e53e3e',
    success: '#48bb78',
    error: '#fc8181',
    offline: '#718096',
  },
};

// ─────────────────────────────────────────────────────
// NATURE THEME
// ─────────────────────────────────────────────────────

export const NATURE_AVATAR_THEME: AvatarTheme = {
  id: 'nature',
  name: 'Nature',
  
  human: {
    bodyColor: '#5d4037',
    headColor: '#8d6e63',
    nameTagBg: '#2e3b2e',
    nameTagText: '#c8e6c9',
    accentColor: '#81c784',
  },
  
  agent: {
    coreColor: '#4caf50',
    auraColor: '#81c784',
    ringColor: '#a5d6a7',
    glowIntensity: 0.35,
    emissiveIntensity: 0.35,
  },
  
  stateColors: {
    idle: '#66bb6a',
    thinking: '#ffc107',
    speaking: '#8bc34a',
    listening: '#26a69a',
    warning: '#ff7043',
    success: '#43a047',
    error: '#e57373',
    offline: '#a1887f',
  },
};

// ─────────────────────────────────────────────────────
// FUTURIST THEME
// ─────────────────────────────────────────────────────

export const FUTURIST_AVATAR_THEME: AvatarTheme = {
  id: 'futurist',
  name: 'Futurist',
  
  human: {
    bodyColor: '#1a1a2e',
    headColor: '#16213e',
    nameTagBg: '#0f0f23',
    nameTagText: '#00fff0',
    accentColor: '#00bcd4',
  },
  
  agent: {
    coreColor: '#00bcd4',
    auraColor: '#00fff0',
    ringColor: '#4dd0e1',
    glowIntensity: 0.7,
    emissiveIntensity: 0.6,
  },
  
  stateColors: {
    idle: '#00bcd4',
    thinking: '#ffeb3b',
    speaking: '#00e676',
    listening: '#40c4ff',
    warning: '#ff5252',
    success: '#69f0ae',
    error: '#ff1744',
    offline: '#546e7a',
  },
};

// ─────────────────────────────────────────────────────
// THEME REGISTRY
// ─────────────────────────────────────────────────────

export const AVATAR_THEMES: Record<string, AvatarTheme> = {
  default: DEFAULT_AVATAR_THEME,
  cosmic: COSMIC_AVATAR_THEME,
  nature: NATURE_AVATAR_THEME,
  futurist: FUTURIST_AVATAR_THEME,
};

export function getAvatarTheme(themeId: string): AvatarTheme {
  return AVATAR_THEMES[themeId] || DEFAULT_AVATAR_THEME;
}

// ─────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────

/**
 * Get color for avatar based on kind, state, and role
 */
export function getAvatarColor(
  kind: AvatarKind,
  state: AvatarState = 'idle',
  role?: AgentRole,
  theme: AvatarTheme = DEFAULT_AVATAR_THEME
): string {
  // State takes priority for agents
  if (kind === 'agent') {
    if (state !== 'idle') {
      return theme.stateColors[state];
    }
    // Use role color if available
    if (role) {
      return getRoleColor(role);
    }
    return theme.agent.coreColor;
  }
  
  // Human avatars
  return theme.human.accentColor;
}

/**
 * Get glow intensity based on state
 */
export function getGlowIntensity(
  state: AvatarState,
  baseIntensity: number = 0.4
): number {
  switch (state) {
    case 'speaking':
      return baseIntensity * 1.5;
    case 'thinking':
      return baseIntensity * 1.2;
    case 'warning':
    case 'error':
      return baseIntensity * 1.8;
    case 'success':
      return baseIntensity * 1.3;
    case 'offline':
      return baseIntensity * 0.3;
    default:
      return baseIntensity;
  }
}

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default {
  DEFAULT_STATE_COLORS,
  DEFAULT_ROLE_COLORS,
  DEFAULT_AVATAR_THEME,
  AVATAR_THEMES,
  getStateColor,
  getRoleColor,
  getAvatarColor,
  getGlowIntensity,
};
