/* =====================================================
   CHE·NU — XR Meeting Module
   
   Immersive VR/AR meeting room for decision-making
   with AI agents in spatial environment.
   ===================================================== */

// Types
export * from './xrMeeting.types';
export * from './xrReplay.types';

// Main Room
export { XRMeetingRoom } from './XRMeetingRoom';
export type { XRMeetingRoomProps } from './XRMeetingRoom';

// Components
export { XRDecisionCore } from './XRDecisionCore';
export type { XRDecisionCoreProps } from './XRDecisionCore';

export { XRAgentRing } from './XRAgentRing';
export type { XRAgentRingProps } from './XRAgentRing';

export { XRTimelineWall } from './XRTimelineWall';
export type { XRTimelineWallProps } from './XRTimelineWall';

export { XRParticipant } from './XRParticipant';
export type { XRParticipantProps } from './XRParticipant';

// Replay System
export { XRMeetingReplay } from './XRMeetingReplay';
export type { XRMeetingReplayProps } from './XRMeetingReplay';

export {
  buildXRMeetingSnapshotFromEvents,
  buildAgentStatesAtIndex,
  findEventIndex,
  findEventsByType,
  findEventsByActor,
  calculateEventsDuration,
  calculateDurationToIndex,
  generateAutoMarkers,
} from './buildReplaySnapshot';

// Re-export defaults
export {
  DEFAULT_PERMISSIONS,
  DEFAULT_MEETING_LAYOUT,
  DEFAULT_MEETING_THEME,
} from './xrMeeting.types';

export {
  DEFAULT_REPLAY_STATE,
} from './xrReplay.types';
