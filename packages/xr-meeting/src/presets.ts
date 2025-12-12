/**
 * CHE·NU — XR MEETING ROOM + AVATAR MORPHOLOGY
 * Presets & Configurations
 * 
 * 4 Meeting Room Presets + 3 Avatar Role Presets
 */

import {
  MeetingPresetId,
  MeetingPresetConfig,
  InteractionMode,
  InteractionModeConfig,
  AvatarRole,
  AvatarRoleConfig,
  AvatarMorphology,
  Avatar,
  XRMeeting,
  MeetingParticipant,
} from './types';

// ============================================================
// MEETING PRESETS
// ============================================================

export const XR_MEETING_CLASSIC: MeetingPresetConfig = {
  id: 'xr_meeting_classic',
  name: 'Classic',
  icon: '🏛️',
  color: '#6366F1',
  description: 'General purpose meeting room with balanced acoustics and central focus.',
  
  lighting: 'neutral_soft',
  space: 'circular_room',
  focus: 'center_table',
  ui: 'floating_cards',
  voice: 'spatial_balanced',
  capacity: { min: 2, max: 12 },
};

export const XR_MEETING_ANALYSIS: MeetingPresetConfig = {
  id: 'xr_meeting_analysis',
  name: 'Analysis',
  icon: '📊',
  color: '#06B6D4',
  description: 'Data-focused room with layered panels and timeline visualization.',
  
  lighting: 'cool_diffuse',
  space: 'layered_panels',
  focus: 'data_walls',
  ui: 'timeline_charts',
  voice: 'clarity_boost',
  capacity: { min: 2, max: 8 },
};

export const XR_MEETING_DECISION: MeetingPresetConfig = {
  id: 'xr_meeting_decision',
  name: 'Decision',
  icon: '⚖️',
  color: '#F59E0B',
  description: 'Intimate space for strategic decisions with presence-focused audio.',
  
  lighting: 'warm_low',
  space: 'semi_enclosed',
  focus: 'decision_core',
  ui: 'summary_nodes',
  voice: 'presence_locked',
  capacity: { min: 2, max: 6 },
};

export const XR_MEETING_CREATIVE: MeetingPresetConfig = {
  id: 'xr_meeting_creative',
  name: 'Creative',
  icon: '🎨',
  color: '#EC4899',
  description: 'Open hub for brainstorming with shared canvas and adaptive lighting.',
  
  lighting: 'adaptive',
  space: 'open_hub',
  focus: 'shared_canvas',
  ui: 'sketch_media',
  voice: 'free_spatial',
  capacity: { min: 2, max: 10 },
};

// ============================================================
// ALL MEETING PRESETS
// ============================================================

export const MEETING_PRESETS: Record<MeetingPresetId, MeetingPresetConfig> = {
  xr_meeting_classic: XR_MEETING_CLASSIC,
  xr_meeting_analysis: XR_MEETING_ANALYSIS,
  xr_meeting_decision: XR_MEETING_DECISION,
  xr_meeting_creative: XR_MEETING_CREATIVE,
};

export const MEETING_PRESET_LIST: MeetingPresetConfig[] = [
  XR_MEETING_CLASSIC,
  XR_MEETING_ANALYSIS,
  XR_MEETING_DECISION,
  XR_MEETING_CREATIVE,
];

// ============================================================
// INTERACTION MODES
// ============================================================

export const INTERACTION_MODES: InteractionModeConfig[] = [
  {
    mode: 'speak',
    name: 'Speak',
    icon: '🎤',
    description: 'Spatialized voice with position awareness',
    enabled: true,
    constraints: ['No volume amplification', 'No voice modification'],
  },
  {
    mode: 'point',
    name: 'Point',
    icon: '👆',
    description: '3D pointer for highlighting content',
    enabled: true,
    constraints: ['No persistent trails', 'No attention-grabbing effects'],
  },
  {
    mode: 'pin',
    name: 'Pin',
    icon: '📌',
    description: 'Lock items in shared space',
    enabled: true,
    constraints: ['All participants see pins', 'No hidden pins'],
  },
  {
    mode: 'timeline_scrub',
    name: 'Timeline',
    icon: '⏱️',
    description: 'Navigate meeting timeline',
    enabled: true,
    constraints: ['Bidirectional only', 'No forced jumps'],
  },
  {
    mode: 'silent_review',
    name: 'Silent Review',
    icon: '👁️',
    description: 'Private review of content',
    enabled: true,
    constraints: ['No hidden notes to others', 'Visible indicator active'],
  },
  {
    mode: 'replay_mode',
    name: 'Replay',
    icon: '🔄',
    description: 'Read-only session replay',
    enabled: true,
    constraints: ['Exact reproduction required', 'No edits allowed'],
  },
];

// ============================================================
// AVATAR ROLE PRESETS
// ============================================================

export const AVATAR_USER: AvatarRoleConfig = {
  role: 'user',
  name: 'User Avatar',
  color: '#10B981',
  features: [
    'Clear silhouette',
    'Neutral aura',
    'Expressive hands',
  ],
  default_morphology: {
    scale: 'normal',
    material: 'organic',
    opacity: 'solid',
    motion: 'slow',
    aura: 'subtle',
    posture: 'neutral',
  },
};

export const AVATAR_AGENT: AvatarRoleConfig = {
  role: 'agent',
  name: 'Agent Avatar',
  color: '#3B82F6',
  features: [
    'Simplified form',
    'Reduced motion',
    'Role glyph visible',
  ],
  default_morphology: {
    scale: 'normal',
    material: 'light',
    opacity: 'semi',
    motion: 'static',
    aura: 'informational',
    posture: 'attentive',
  },
};

export const AVATAR_OBSERVER: AvatarRoleConfig = {
  role: 'observer',
  name: 'Observer Avatar',
  color: '#6B7280',
  features: [
    'Low opacity',
    'No aura',
    'No interaction',
  ],
  default_morphology: {
    scale: 'small',
    material: 'light',
    opacity: 'outline',
    motion: 'static',
    aura: 'none',
    posture: 'neutral',
  },
};

// ============================================================
// ALL AVATAR ROLES
// ============================================================

export const AVATAR_ROLES: Record<AvatarRole, AvatarRoleConfig> = {
  user: AVATAR_USER,
  agent: AVATAR_AGENT,
  observer: AVATAR_OBSERVER,
};

export const AVATAR_ROLE_LIST: AvatarRoleConfig[] = [
  AVATAR_USER,
  AVATAR_AGENT,
  AVATAR_OBSERVER,
];

// ============================================================
// DEFAULT MORPHOLOGY
// ============================================================

export const DEFAULT_MORPHOLOGY: AvatarMorphology = {
  scale: 'normal',
  material: 'organic',
  opacity: 'solid',
  motion: 'slow',
  aura: 'subtle',
  posture: 'neutral',
};

// ============================================================
// FACTORY FUNCTIONS
// ============================================================

/**
 * Create a new avatar with role-appropriate defaults
 */
export function createAvatar(
  id: string,
  ownerId: string,
  role: AvatarRole,
  customMorphology?: Partial<AvatarMorphology>
): Avatar {
  const roleConfig = AVATAR_ROLES[role];
  
  return {
    id,
    owner_id: ownerId,
    role,
    morphology: {
      ...DEFAULT_MORPHOLOGY,
      ...roleConfig.default_morphology,
      ...customMorphology,
    },
    constraints: {
      no_dominance: true,
      no_deceptive_scale: true,
      accessibility_mode: false,
    },
  };
}

/**
 * Create a new meeting participant
 */
export function createParticipant(
  id: string,
  name: string,
  role: 'user' | 'agent' | 'observer'
): MeetingParticipant {
  return {
    id,
    name,
    role,
    avatar_id: `avatar_${id}`,
    joined_at: new Date().toISOString(),
    is_speaking: false,
    is_muted: false,
  };
}

/**
 * Create a new meeting
 */
export function createMeeting(
  id: string,
  title: string,
  presetId: MeetingPresetId,
  creator: MeetingParticipant
): XRMeeting {
  return {
    id,
    preset: presetId,
    title,
    participants: [creator],
    artifacts: [],
    mode: 'live',
    recording: {
      enabled: true,
      start_time: new Date().toISOString(),
      events: [],
    },
    created_at: new Date().toISOString(),
    export_formats: ['pdf', 'timeline', 'xr_replay'],
    metadata: {},
  };
}

/**
 * Get meeting preset by ID
 */
export function getMeetingPreset(id: MeetingPresetId): MeetingPresetConfig {
  return MEETING_PRESETS[id];
}

/**
 * Get avatar role config by role
 */
export function getAvatarRole(role: AvatarRole): AvatarRoleConfig {
  return AVATAR_ROLES[role];
}

/**
 * Check if capacity is within preset limits
 */
export function isCapacityValid(presetId: MeetingPresetId, participantCount: number): boolean {
  const preset = MEETING_PRESETS[presetId];
  return participantCount >= preset.capacity.min && participantCount <= preset.capacity.max;
}

/**
 * Get recommended preset based on participant count
 */
export function recommendPreset(participantCount: number, purpose: 'general' | 'analysis' | 'decision' | 'creative'): MeetingPresetId {
  switch (purpose) {
    case 'analysis':
      return participantCount <= 8 ? 'xr_meeting_analysis' : 'xr_meeting_classic';
    case 'decision':
      return participantCount <= 6 ? 'xr_meeting_decision' : 'xr_meeting_classic';
    case 'creative':
      return participantCount <= 10 ? 'xr_meeting_creative' : 'xr_meeting_classic';
    default:
      return 'xr_meeting_classic';
  }
}
