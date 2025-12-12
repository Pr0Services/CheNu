/**
 * CHE·NU — XR MEETING ROOM + AVATAR MORPHOLOGY
 * Types & Interfaces
 * 
 * XR.v1.1
 * Shared immersive space for discussion, visualization,
 * decision review, and replay.
 * 
 * STRICT RULE: Context space, NOT persuasion.
 */

// ============================================================
// MEETING PRESET IDENTIFIERS
// ============================================================

export type MeetingPresetId = 
  | 'xr_meeting_classic'
  | 'xr_meeting_analysis'
  | 'xr_meeting_decision'
  | 'xr_meeting_creative';

// ============================================================
// MEETING ROOM CONFIGURATION
// ============================================================

export type MeetingLighting = 
  | 'neutral_soft'
  | 'cool_diffuse'
  | 'warm_low'
  | 'adaptive';

export type MeetingSpace = 
  | 'circular_room'
  | 'layered_panels'
  | 'semi_enclosed'
  | 'open_hub';

export type MeetingFocus = 
  | 'center_table'
  | 'data_walls'
  | 'decision_core'
  | 'shared_canvas';

export type VoiceMode = 
  | 'spatial_balanced'
  | 'clarity_boost'
  | 'presence_locked'
  | 'free_spatial';

export type MeetingUIType = 
  | 'floating_cards'
  | 'timeline_charts'
  | 'summary_nodes'
  | 'sketch_media';

export interface MeetingCapacity {
  min: number;
  max: number;
}

export interface MeetingPresetConfig {
  id: MeetingPresetId;
  name: string;
  icon: string;
  color: string;
  description: string;
  
  lighting: MeetingLighting;
  space: MeetingSpace;
  focus: MeetingFocus;
  ui: MeetingUIType;
  voice: VoiceMode;
  capacity: MeetingCapacity;
}

// ============================================================
// INTERACTION MODES
// ============================================================

export type InteractionMode = 
  | 'speak'
  | 'point'
  | 'pin'
  | 'timeline_scrub'
  | 'silent_review'
  | 'replay_mode';

export interface InteractionModeConfig {
  mode: InteractionMode;
  name: string;
  icon: string;
  description: string;
  enabled: boolean;
  constraints: string[];
}

// ============================================================
// FORBIDDEN INTERACTIONS (ETHICAL)
// ============================================================

export interface ForbiddenInteraction {
  id: string;
  name: string;
  reason: string;
}

export const FORBIDDEN_INTERACTIONS: ForbiddenInteraction[] = [
  { id: 'emotional_amplification', name: 'Emotional Amplification', reason: 'No mood-altering visuals or sounds' },
  { id: 'hidden_nudging', name: 'Hidden Nudging', reason: 'No subliminal directional cues' },
  { id: 'forced_flow', name: 'Forced Flow', reason: 'No mandatory sequences or timeouts' },
  { id: 'asymmetric_view', name: 'Asymmetric View', reason: 'All participants must see identical space' },
];

// ============================================================
// MEETING PARTICIPANT
// ============================================================

export type ParticipantRole = 'user' | 'agent' | 'observer';

export interface MeetingParticipant {
  id: string;
  name: string;
  role: ParticipantRole;
  avatar_id: string;
  joined_at: string;
  position?: { x: number; y: number; z: number };
  is_speaking?: boolean;
  is_muted?: boolean;
}

// ============================================================
// MEETING ARTIFACTS
// ============================================================

export type ArtifactType = 
  | 'notes'
  | 'chart'
  | 'image'
  | 'document'
  | 'pinned_item'
  | 'replay_marker';

export interface MeetingArtifact {
  id: string;
  type: ArtifactType;
  title: string;
  content: unknown;
  created_by: string;
  created_at: string;
  position?: { x: number; y: number; z: number };
  pinned: boolean;
}

// ============================================================
// MEETING MODE
// ============================================================

export type MeetingMode = 'live' | 'review' | 'replay';

// ============================================================
// MEETING RECORDING
// ============================================================

export interface MeetingEvent {
  id: string;
  timestamp: string;
  type: 'join' | 'leave' | 'speak' | 'pin' | 'artifact' | 'decision';
  participant_id: string;
  data?: unknown;
}

export interface MeetingRecording {
  enabled: boolean;
  start_time: string;
  end_time?: string;
  events: MeetingEvent[];
  integrity_hash?: string;
}

// ============================================================
// MEETING EXPORT
// ============================================================

export type ExportFormat = 'pdf' | 'timeline' | 'xr_replay';

export interface MeetingExport {
  format: ExportFormat;
  generated_at: string;
  content_hash: string;
  download_url?: string;
}

// ============================================================
// FULL MEETING
// ============================================================

export interface XRMeeting {
  id: string;
  preset: MeetingPresetId;
  title: string;
  description?: string;
  
  participants: MeetingParticipant[];
  artifacts: MeetingArtifact[];
  
  mode: MeetingMode;
  recording: MeetingRecording;
  
  created_at: string;
  started_at?: string;
  ended_at?: string;
  
  export_formats: ExportFormat[];
  
  metadata: {
    topic?: string;
    tags?: string[];
    sphere?: string;
  };
}

// ============================================================
// AVATAR MORPHOLOGY — DIMENSIONS
// ============================================================

export type AvatarScale = 'small' | 'normal' | 'large';
export type AvatarMaterial = 'organic' | 'stone' | 'light' | 'synthetic';
export type AvatarOpacity = 'solid' | 'semi' | 'outline';
export type AvatarMotion = 'static' | 'slow' | 'floating';
export type AvatarAura = 'none' | 'subtle' | 'informational';
export type AvatarPosture = 'neutral' | 'attentive' | 'reflective';

export interface AvatarMorphology {
  scale: AvatarScale;
  material: AvatarMaterial;
  opacity: AvatarOpacity | number;  // 0.0-1.0 for numeric
  motion: AvatarMotion;
  aura: AvatarAura;
  posture: AvatarPosture;
}

// ============================================================
// AVATAR ROLE PRESETS
// ============================================================

export type AvatarRole = 'user' | 'agent' | 'observer';

export interface AvatarRoleConfig {
  role: AvatarRole;
  name: string;
  color: string;
  features: string[];
  default_morphology: Partial<AvatarMorphology>;
}

// ============================================================
// FULL AVATAR
// ============================================================

export interface Avatar {
  id: string;
  owner_id: string;
  role: AvatarRole;
  
  morphology: AvatarMorphology;
  
  theme_affinity?: MeetingPresetId;
  
  constraints: {
    no_dominance: boolean;
    no_deceptive_scale: boolean;
    accessibility_mode: boolean;
  };
}

// ============================================================
// AVATAR CONFIGURATION (JSON SPEC)
// ============================================================

export interface AvatarConfig {
  avatar: {
    role: AvatarRole;
    morphology: AvatarMorphology;
    theme_affinity?: string;
  };
}

// ============================================================
// ETHICAL CONSTRAINTS
// ============================================================

export interface EthicalConstraint {
  id: string;
  category: 'meeting' | 'avatar';
  name: string;
  description: string;
  implementation: string;
}

export const ETHICAL_CONSTRAINTS: EthicalConstraint[] = [
  // Meeting constraints
  { id: 'no_emotional_steering', category: 'meeting', name: 'No Emotional Steering', description: 'Neutral color palettes, no mood music', implementation: 'color_palette_neutral + audio_disabled' },
  { id: 'no_forced_sequences', category: 'meeting', name: 'No Forced Sequences', description: 'All navigation is voluntary', implementation: 'navigation_voluntary' },
  { id: 'symmetric_visibility', category: 'meeting', name: 'Symmetric Visibility', description: 'All participants see identical space', implementation: 'view_sync_enforced' },
  { id: 'exact_replay', category: 'meeting', name: 'Exact Replay', description: 'Recordings must be bit-perfect', implementation: 'recording_hash_verified' },
  { id: 'recording_indicator', category: 'meeting', name: 'Clear Recording Indicator', description: 'Visible when session is recorded', implementation: 'recording_indicator_always_visible' },
  
  // Avatar constraints
  { id: 'no_dominance_visuals', category: 'avatar', name: 'No Dominance Visuals', description: 'No oversized avatars, no power poses', implementation: 'scale_capped + pose_neutral' },
  { id: 'no_deceptive_scale', category: 'avatar', name: 'No Deceptive Scale', description: 'Avatars cannot appear larger to intimidate', implementation: 'scale_uniform_per_role' },
  { id: 'no_authority_signaling', category: 'avatar', name: 'No Authority Signaling', description: 'Role indicators are informational only', implementation: 'role_glyph_informational' },
  { id: 'accessibility_first', category: 'avatar', name: 'Accessibility First', description: 'High contrast options, motion reduction', implementation: 'a11y_mode_available' },
  { id: 'consistent_appearance', category: 'avatar', name: 'Consistent Appearance', description: 'Avatars look same to all participants', implementation: 'appearance_sync_enforced' },
];

// ============================================================
// RUNTIME STATE
// ============================================================

export interface MeetingRuntimeState {
  current_meeting: XRMeeting | null;
  current_mode: InteractionMode;
  is_recording: boolean;
  is_replay: boolean;
  replay_position?: number;  // 0.0-1.0
  connected_participants: string[];
  active_speaker?: string;
  pinned_artifacts: string[];
}

export interface AvatarRuntimeState {
  current_avatar: Avatar | null;
  is_visible: boolean;
  is_speaking: boolean;
  current_position: { x: number; y: number; z: number };
  current_rotation: { x: number; y: number; z: number };
}
