/**
 * CHE·NU — XR MEETING ROOM + AVATAR MORPHOLOGY
 * Main Exports
 * 
 * XR.v1.1
 * Shared immersive space for discussion, visualization,
 * decision review, and replay.
 * 
 * STRICT RULE: Context space, NOT persuasion.
 */

// Types
export {
  // Meeting types
  type MeetingPresetId,
  type MeetingLighting,
  type MeetingSpace,
  type MeetingFocus,
  type VoiceMode,
  type MeetingUIType,
  type MeetingCapacity,
  type MeetingPresetConfig,
  type InteractionMode,
  type InteractionModeConfig,
  type ForbiddenInteraction,
  FORBIDDEN_INTERACTIONS,
  type ParticipantRole,
  type MeetingParticipant,
  type ArtifactType,
  type MeetingArtifact,
  type MeetingMode,
  type MeetingEvent,
  type MeetingRecording,
  type ExportFormat,
  type MeetingExport,
  type XRMeeting,
  
  // Avatar types
  type AvatarScale,
  type AvatarMaterial,
  type AvatarOpacity,
  type AvatarMotion,
  type AvatarAura,
  type AvatarPosture,
  type AvatarMorphology,
  type AvatarRole,
  type AvatarRoleConfig,
  type Avatar,
  type AvatarConfig,
  
  // Ethics
  type EthicalConstraint,
  ETHICAL_CONSTRAINTS,
  
  // Runtime
  type MeetingRuntimeState,
  type AvatarRuntimeState,
} from './types';

// Presets
export {
  // Meeting presets
  XR_MEETING_CLASSIC,
  XR_MEETING_ANALYSIS,
  XR_MEETING_DECISION,
  XR_MEETING_CREATIVE,
  MEETING_PRESETS,
  MEETING_PRESET_LIST,
  
  // Interaction modes
  INTERACTION_MODES,
  
  // Avatar roles
  AVATAR_USER,
  AVATAR_AGENT,
  AVATAR_OBSERVER,
  AVATAR_ROLES,
  AVATAR_ROLE_LIST,
  DEFAULT_MORPHOLOGY,
  
  // Factory functions
  createAvatar,
  createParticipant,
  createMeeting,
  getMeetingPreset,
  getAvatarRole,
  isCapacityValid,
  recommendPreset,
} from './presets';

// Context
export {
  XRMeetingProvider,
  XRMeetingContext,
  useXRMeeting,
  type XRMeetingState,
  type XRMeetingContextValue,
} from './XRMeetingContext';

// Components
export {
  MeetingPresetCard,
  CreateMeetingForm,
  ActiveMeetingDisplay,
  ParticipantBadge,
  InteractionModesPanel,
  AvatarRoleCard,
  AvatarSelector,
  EthicalConstraintsDisplay,
  XRMeetingDashboard,
} from './components';

// Default export
export { XRMeetingProvider as default } from './XRMeetingContext';
