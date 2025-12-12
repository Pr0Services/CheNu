/* =====================================================
   CHE·NU — XR Meeting Types
   
   Types for immersive VR/AR meeting room.
   Spatial layout: Decision core (center), Agent ring,
   Timeline wall, Human participants.
   ===================================================== */

import { AgentRole, AgentOutput } from '../../agents/types';

// ─────────────────────────────────────────────────────
// MEETING CONTEXT
// ─────────────────────────────────────────────────────

export type MeetingPhase = 
  | 'preparation'   // Setting up meeting
  | 'analysis'      // Agents analyzing
  | 'deliberation'  // Discussion phase
  | 'decision'      // Human deciding
  | 'validation'    // Confirming decision
  | 'closed';       // Meeting ended

export interface XRMeetingContext {
  meetingId: string;
  sphereId: string;
  phase: MeetingPhase;
  topic: string;
  
  // Participants
  humanId: string;
  humanName?: string;
  agentIds: string[];
  
  // Permissions
  permissions: XRMeetingPermissions;
  
  // State
  startedAt: number;
  currentSpeaker?: string;
  pendingDecision?: PendingDecision;
}

export interface XRMeetingPermissions {
  canDecide: boolean;
  canAskAgents: boolean;
  canInviteAgents: boolean;
  canDismissAgents: boolean;
  canEndMeeting: boolean;
  canRewind: boolean;
}

export const DEFAULT_PERMISSIONS: XRMeetingPermissions = {
  canDecide: true,
  canAskAgents: true,
  canInviteAgents: true,
  canDismissAgents: false,
  canEndMeeting: true,
  canRewind: true,
};

// ─────────────────────────────────────────────────────
// SPATIAL ANCHORS
// ─────────────────────────────────────────────────────

export interface XRSpatialAnchor {
  position: [number, number, number];
  rotation?: [number, number, number];  // Euler angles
  scale?: number;
}

export interface XRMeetingLayout {
  // Center decision area
  decisionCore: XRSpatialAnchor;
  decisionCoreRadius: number;
  
  // Agent ring
  agentRingRadius: number;
  agentRingHeight: number;
  agentSize: number;
  
  // Timeline wall
  timelineWall: XRSpatialAnchor;
  timelineWallSize: [number, number];
  
  // Human position
  humanPosition: XRSpatialAnchor;
  
  // Room bounds
  roomRadius: number;
  ceilingHeight: number;
  floorY: number;
}

export const DEFAULT_MEETING_LAYOUT: XRMeetingLayout = {
  decisionCore: { position: [0, 1.2, 0] },
  decisionCoreRadius: 0.6,
  
  agentRingRadius: 2.5,
  agentRingHeight: 1.4,
  agentSize: 0.25,
  
  timelineWall: { position: [0, 1.8, -4], rotation: [0, 0, 0] },
  timelineWallSize: [5, 2.5],
  
  humanPosition: { position: [0, 0, 1.5] },
  
  roomRadius: 6,
  ceilingHeight: 4,
  floorY: 0,
};

// ─────────────────────────────────────────────────────
// AGENT IN MEETING
// ─────────────────────────────────────────────────────

export interface XRMeetingAgent {
  id: string;
  name: string;
  role: AgentRole;
  
  // Visual
  color: string;
  avatarUrl?: string;
  
  // State
  isActive: boolean;
  isSpeaking: boolean;
  hasContributed: boolean;
  
  // Position in ring
  ringIndex: number;
  
  // Latest output
  lastOutput?: AgentOutput;
}

// ─────────────────────────────────────────────────────
// DECISION
// ─────────────────────────────────────────────────────

export type DecisionType = 
  | 'approve'
  | 'reject' 
  | 'defer'
  | 'modify'
  | 'escalate';

export interface PendingDecision {
  id: string;
  title: string;
  description: string;
  options: DecisionOption[];
  deadline?: number;
  requiredConfidence?: number;
}

export interface DecisionOption {
  id: string;
  label: string;
  type: DecisionType;
  agentRecommendations: {
    agentId: string;
    supports: boolean;
    confidence: number;
    reasoning: string;
  }[];
}

export interface MadeDecision {
  id: string;
  optionId: string;
  type: DecisionType;
  madeBy: string;
  madeAt: number;
  reasoning?: string;
  agentInputs: string[];
}

// ─────────────────────────────────────────────────────
// TIMELINE EVENTS (for wall)
// ─────────────────────────────────────────────────────

export type TimelineEventType =
  | 'meeting_started'
  | 'agent_joined'
  | 'agent_spoke'
  | 'human_asked'
  | 'decision_proposed'
  | 'decision_made'
  | 'phase_changed'
  | 'meeting_ended';

export interface XRTimelineEvent {
  id: string;
  type: TimelineEventType;
  timestamp: number;
  actorId: string;
  actorType: 'human' | 'agent' | 'system';
  content: string;
  metadata?: Record<string, unknown>;
}

// ─────────────────────────────────────────────────────
// INTERACTIONS
// ─────────────────────────────────────────────────────

export type XRMeetingAction =
  | { type: 'ASK_AGENT'; agentId: string; question: string }
  | { type: 'ASK_ALL_AGENTS'; question: string }
  | { type: 'MAKE_DECISION'; optionId: string; reasoning?: string }
  | { type: 'CHANGE_PHASE'; phase: MeetingPhase }
  | { type: 'INVITE_AGENT'; agentId: string }
  | { type: 'DISMISS_AGENT'; agentId: string }
  | { type: 'REWIND_TO'; eventId: string }
  | { type: 'END_MEETING' };

// ─────────────────────────────────────────────────────
// VISUALS
// ─────────────────────────────────────────────────────

export interface XRMeetingTheme {
  // Room
  floorColor: string;
  wallColor: string;
  ambientColor: string;
  
  // Decision core
  coreIdleColor: string;
  coreActiveColor: string;
  coreDecisionColor: string;
  
  // Agents
  agentDefaultColor: string;
  agentActiveColor: string;
  agentSpeakingColor: string;
  
  // Timeline
  timelineBackground: string;
  timelineEventColor: string;
  timelineHighlightColor: string;
  
  // Effects
  glowIntensity: number;
  particleCount: number;
}

export const DEFAULT_MEETING_THEME: XRMeetingTheme = {
  floorColor: '#1a1a2e',
  wallColor: '#16213e',
  ambientColor: '#0f3460',
  
  coreIdleColor: 'rgba(255,255,255,0.1)',
  coreActiveColor: 'rgba(99,102,241,0.6)',
  coreDecisionColor: 'rgba(255,215,0,0.6)',
  
  agentDefaultColor: '#6ec6ff',
  agentActiveColor: '#4fc3f7',
  agentSpeakingColor: '#00e5ff',
  
  timelineBackground: '#111827',
  timelineEventColor: '#6366f1',
  timelineHighlightColor: '#fbbf24',
  
  glowIntensity: 0.5,
  particleCount: 100,
};

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default {
  DEFAULT_PERMISSIONS,
  DEFAULT_MEETING_LAYOUT,
  DEFAULT_MEETING_THEME,
};
