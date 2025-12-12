/* =====================================================
   CHE·NU — XR Replay Types
   
   Types for meeting replay/rewind functionality.
   Allows reviewing past meetings step by step.
   ===================================================== */

import { XRMeetingContext, MeetingPhase } from './xrMeeting.types';

// ─────────────────────────────────────────────────────
// TIMELINE EVENT (for replay)
// ─────────────────────────────────────────────────────

export type TimelineXREventType =
  | 'meeting_start'
  | 'meeting_end'
  | 'phase_change'
  | 'agent_join'
  | 'agent_leave'
  | 'agent_speak'
  | 'human_speak'
  | 'human_ask'
  | 'decision_propose'
  | 'decision_select'
  | 'decision_confirm'
  | 'decision_reject'
  | 'rewind_action';

export interface TimelineXREvent {
  id: string;
  type: TimelineXREventType;
  timestamp: number;
  
  // Actor
  actorId: string;
  actorType: 'human' | 'agent' | 'system';
  actorName?: string;
  
  // Content
  summary: string;
  details?: string;
  
  // Payload (type-specific data)
  payload?: TimelineEventPayload;
  
  // Metadata
  sphereId?: string;
  meetingId: string;
  duration?: number;  // ms, for speech events
}

export type TimelineEventPayload =
  | PhaseChangePayload
  | AgentSpeakPayload
  | DecisionPayload
  | QuestionPayload;

export interface PhaseChangePayload {
  fromPhase: MeetingPhase;
  toPhase: MeetingPhase;
}

export interface AgentSpeakPayload {
  agentId: string;
  outputType: 'signal' | 'recommendation' | 'proposal' | 'enrichment';
  confidence: number;
  content: string;
}

export interface DecisionPayload {
  decisionId: string;
  optionId?: string;
  optionLabel?: string;
  reasoning?: string;
}

export interface QuestionPayload {
  targetAgentId?: string;
  question: string;
}

// ─────────────────────────────────────────────────────
// REPLAY STATE
// ─────────────────────────────────────────────────────

export interface XRReplayState {
  isPlaying: boolean;
  currentIndex: number;
  speed: ReplaySpeed;
  mode: ReplayMode;
  
  // Bounds
  startIndex: number;
  endIndex: number;
  
  // Loop
  loop: boolean;
}

export type ReplaySpeed = 0.25 | 0.5 | 1 | 2 | 4 | 8;
export type ReplayMode = 'continuous' | 'step' | 'auto-pause';

export const DEFAULT_REPLAY_STATE: XRReplayState = {
  isPlaying: false,
  currentIndex: 0,
  speed: 1,
  mode: 'continuous',
  startIndex: 0,
  endIndex: -1,  // -1 = end of events
  loop: false,
};

// ─────────────────────────────────────────────────────
// REPLAY SNAPSHOT
// ─────────────────────────────────────────────────────

export interface XRReplaySnapshot {
  context: XRMeetingContext;
  highlightedEventId?: string;
  
  // Visual state at this point
  activeAgentIds: string[];
  speakingAgentId?: string;
  lastDecisionId?: string;
  
  // Progress
  progress: number;  // 0-1
  timestamp: number;
  eventsSoFar: number;
  eventsTotal: number;
}

// ─────────────────────────────────────────────────────
// REPLAY CONTROLS
// ─────────────────────────────────────────────────────

export type ReplayAction =
  | { type: 'PLAY' }
  | { type: 'PAUSE' }
  | { type: 'TOGGLE_PLAY' }
  | { type: 'STEP_FORWARD' }
  | { type: 'STEP_BACK' }
  | { type: 'JUMP_TO'; index: number }
  | { type: 'JUMP_TO_EVENT'; eventId: string }
  | { type: 'SET_SPEED'; speed: ReplaySpeed }
  | { type: 'SET_MODE'; mode: ReplayMode }
  | { type: 'SET_LOOP'; loop: boolean }
  | { type: 'SET_BOUNDS'; start: number; end: number }
  | { type: 'RESET' };

// ─────────────────────────────────────────────────────
// REPLAY MARKERS
// ─────────────────────────────────────────────────────

export interface ReplayMarker {
  id: string;
  eventIndex: number;
  label: string;
  color?: string;
  icon?: string;
}

export interface ReplayBookmark {
  id: string;
  eventIndex: number;
  name: string;
  description?: string;
  createdAt: number;
}

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default {
  DEFAULT_REPLAY_STATE,
};
