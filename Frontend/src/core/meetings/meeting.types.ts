/* =====================================================
   CHE·NU — Meeting System Types
   core/meetings/meeting.types.ts
   ===================================================== */

import { Agent } from '../agents/agent.types';

// ─────────────────────────────────────────────────────
// Meeting Core Types
// ─────────────────────────────────────────────────────

export interface Meeting {
  id: string;
  title: string;
  objective: string;
  description?: string;
  
  // Participants
  agents: MeetingAgent[];
  humanParticipants: string[];
  
  // State
  phase: MeetingPhase;
  status: MeetingStatus;
  
  // Timeline
  scheduledAt?: Date;
  startedAt?: Date;
  endedAt?: Date;
  
  // Content
  agenda: AgendaItem[];
  decisions: Decision[];
  actionItems: ActionItem[];
  
  // Audit
  eventLog: MeetingEvent[];
  
  // Configuration
  config: MeetingConfig;
}

export interface MeetingAgent extends Agent {
  role: MeetingRole;
  influenceLevel: number;  // 0-1, affects positioning and weight
  canVote: boolean;
  isRequired: boolean;
}

// ─────────────────────────────────────────────────────
// Meeting Phases
// ─────────────────────────────────────────────────────

export type MeetingPhase = 
  | 'setup'
  | 'opening'
  | 'discussion'
  | 'analysis'
  | 'proposal'
  | 'voting'
  | 'decision'
  | 'action_planning'
  | 'closing'
  | 'completed';

export type MeetingStatus = 
  | 'draft'
  | 'scheduled'
  | 'in_progress'
  | 'paused'
  | 'completed'
  | 'cancelled';

export type MeetingRole = 
  | 'facilitator'
  | 'presenter'
  | 'advisor'
  | 'analyst'
  | 'recorder'
  | 'observer';

// ─────────────────────────────────────────────────────
// Agenda & Decisions
// ─────────────────────────────────────────────────────

export interface AgendaItem {
  id: string;
  title: string;
  description?: string;
  duration: number;  // minutes
  presenter?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  notes?: string;
}

export interface Decision {
  id: string;
  title: string;
  description: string;
  options: DecisionOption[];
  selectedOption?: string;
  decidedBy: string;  // 'human' or agent ID
  decidedAt?: Date;
  rationale?: string;
  confidence: number;  // 0-1
}

export interface DecisionOption {
  id: string;
  label: string;
  description?: string;
  pros: string[];
  cons: string[];
  supportingAgents: string[];
}

export interface ActionItem {
  id: string;
  title: string;
  description?: string;
  assignee: string;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  createdFrom?: string;  // Decision ID
}

// ─────────────────────────────────────────────────────
// Meeting Events (Audit Trail)
// ─────────────────────────────────────────────────────

export interface MeetingEvent {
  id: string;
  timestamp: Date;
  type: MeetingEventType;
  actorId: string;  // 'human' or agent ID
  phase: MeetingPhase;
  payload?: Record<string, unknown>;
}

export type MeetingEventType = 
  | 'meeting_started'
  | 'meeting_ended'
  | 'phase_changed'
  | 'agent_joined'
  | 'agent_left'
  | 'human_joined'
  | 'human_left'
  | 'agenda_item_started'
  | 'agenda_item_completed'
  | 'agent_suggestion'
  | 'agent_analysis'
  | 'decision_proposed'
  | 'decision_made'
  | 'action_item_created'
  | 'vote_cast'
  | 'note_added';

// ─────────────────────────────────────────────────────
// Meeting Configuration
// ─────────────────────────────────────────────────────

export interface MeetingConfig {
  requireHumanDecision: boolean;
  allowAgentVoting: boolean;
  autoAdvancePhases: boolean;
  recordTranscript: boolean;
  maxDuration: number;  // minutes
  decisionThreshold: number;  // 0-1, minimum confidence for auto-decisions
}

// ─────────────────────────────────────────────────────
// Meeting Context (for UI)
// ─────────────────────────────────────────────────────

export interface MeetingContext {
  phase: MeetingPhase;
  hasHumanDecisionMaker: boolean;
  isCriticalDecision: boolean;
  currentAgendaItem?: AgendaItem;
  pendingDecisions: Decision[];
}

// ─────────────────────────────────────────────────────
// Meeting Room Props
// ─────────────────────────────────────────────────────

export interface MeetingRoomProps {
  meeting: Meeting;
  onUpdateMeeting: (meeting: Meeting) => void;
  onClose: () => void;
}
