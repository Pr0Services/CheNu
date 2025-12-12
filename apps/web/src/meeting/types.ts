/* =====================================================
   CHE·NU — Meeting Room Types
   PHASE 6: MEETING ROOM ENGINE
   
   KEY PRINCIPLES:
   1. Humans DECIDE, agents RECOMMEND
   2. Phases enforce structure
   3. All activity is traceable
   4. Decisions require accountability
   ===================================================== */

// ─────────────────────────────────────────────────────
// PHASES & STATUS
// ─────────────────────────────────────────────────────

/**
 * Meeting phases:
 * - analysis: Agents analyze and produce recommendations
 * - decision: Humans review and make decisions
 * - validation: Confirm decisions and close
 */
export type MeetingPhase = 'analysis' | 'decision' | 'validation';

/**
 * Meeting lifecycle status.
 */
export type MeetingStatus = 
  | 'scheduled'   // Created but not started
  | 'active'      // In progress
  | 'paused'      // Temporarily stopped
  | 'completed'   // Successfully closed
  | 'cancelled';  // Terminated without completion

// ─────────────────────────────────────────────────────
// PARTICIPANTS
// ─────────────────────────────────────────────────────

/**
 * Human participant roles:
 * - owner: Can make decisions, advance phases
 * - collaborator: Can contribute, make decisions
 * - observer: Read-only access
 */
export type ParticipantRole = 'owner' | 'collaborator' | 'observer';

/**
 * Decision types available to humans.
 */
export type DecisionType = 
  | 'approve'    // Accept recommendation
  | 'reject'     // Decline recommendation
  | 'pivot'      // Change direction
  | 'defer'      // Postpone decision
  | 'escalate';  // Escalate to higher authority

/**
 * Agent roles in meetings.
 */
export type AgentRole = 
  | 'orchestrator'  // Coordinates workflow
  | 'analyst'       // Provides analysis
  | 'evaluator'     // Evaluates options
  | 'advisor';      // Gives recommendations

/**
 * Human participant in a meeting.
 */
export interface HumanParticipant {
  id: string;
  displayName: string;
  role: ParticipantRole;
  joinedAt?: number;
  leftAt?: number;
}

/**
 * Agent participant in a meeting.
 */
export interface AgentParticipant {
  id: string;
  name: string;
  role: AgentRole;
  capabilities: string[];
  activatedAt?: number;
  outputCount: number;
}

/**
 * Registry of all meeting participants.
 */
export interface ParticipantRegistry {
  humans: HumanParticipant[];
  agents: AgentParticipant[];
}

// ─────────────────────────────────────────────────────
// OBJECTIVE & CONTEXT
// ─────────────────────────────────────────────────────

/**
 * Meeting objective - what the meeting aims to achieve.
 */
export interface MeetingObjective {
  title: string;
  description?: string;
  sphereId: string;
  criticality: 'low' | 'medium' | 'high' | 'critical';
  expectedOutcome?: string;
  deadline?: number;
}

/**
 * Snapshot of meeting context at a point in time.
 */
export interface MeetingContext {
  phase: MeetingPhase;
  objective: MeetingObjective;
  participants: ParticipantRegistry;
  hasDecisionMaker: boolean;
  agentRecommendationsCount: number;
  pendingDecisionsCount: number;
}

// ─────────────────────────────────────────────────────
// CONTRIBUTIONS
// ─────────────────────────────────────────────────────

/**
 * Agent contribution types.
 */
export type AgentContributionType = 
  | 'analysis'        // Analytical insights
  | 'recommendation'  // Suggested actions
  | 'signal'          // Alerts/warnings
  | 'enrichment';     // Additional context

/**
 * Contribution from an agent.
 */
export interface AgentContribution {
  id: string;
  agentId: string;
  timestamp: number;
  type: AgentContributionType;
  content: string;
  confidence: number;      // 0-1 confidence score
  reasoning?: string;      // Why this contribution
  references?: string[];   // Source references
}

/**
 * Human contribution types.
 */
export type HumanContributionType = 
  | 'comment'       // General comment
  | 'question'      // Question for clarification
  | 'clarification' // Answer to question
  | 'objection';    // Disagreement

/**
 * Contribution from a human.
 */
export interface HumanContribution {
  id: string;
  participantId: string;
  timestamp: number;
  type: HumanContributionType;
  content: string;
  replyTo?: string;  // If replying to another contribution
}

// ─────────────────────────────────────────────────────
// DECISIONS
// ─────────────────────────────────────────────────────

/**
 * Impact assessment of a decision.
 */
export interface DecisionImpact {
  affectedSpheres: string[];
  estimatedEffort: 'low' | 'medium' | 'high';
  reversibility: 'easy' | 'moderate' | 'difficult';
  urgency: 'immediate' | 'short-term' | 'long-term';
}

/**
 * Record of a human decision.
 */
export interface DecisionRecord {
  id: string;
  timestamp: number;
  decidedBy: string;           // Human participant ID
  decisionType: DecisionType;
  summary: string;
  rationale?: string;          // Why this decision
  linkedContributions: string[]; // Related agent contributions
  impact?: DecisionImpact;
}

// ─────────────────────────────────────────────────────
// MEETING STATE
// ─────────────────────────────────────────────────────

/**
 * Complete state of a meeting room.
 */
export interface MeetingRoomState {
  id: string;
  status: MeetingStatus;
  phase: MeetingPhase;
  context: MeetingContext;
  
  // Timestamps
  createdAt: number;
  startedAt?: number;
  pausedAt?: number;
  closedAt?: number;
  
  // Content
  agentContributions: AgentContribution[];
  humanContributions: HumanContribution[];
  decisions: DecisionRecord[];
  
  // Metadata
  tags: string[];
  parentMeetingId?: string;  // For sub-meetings
}

// ─────────────────────────────────────────────────────
// SUMMARY
// ─────────────────────────────────────────────────────

/**
 * Outcome classification for completed meetings.
 */
export type MeetingOutcome = 
  | 'successful'    // All decisions approved
  | 'partial'       // Some decisions made
  | 'inconclusive'  // No clear decisions
  | 'cancelled';    // Meeting was cancelled

/**
 * Summary of a completed meeting.
 */
export interface MeetingSummary {
  meetingId: string;
  objective: string;
  sphereId: string;
  duration: number;
  
  participantCounts: {
    humans: number;
    agents: number;
  };
  
  contributionCounts: {
    agentAnalyses: number;
    agentRecommendations: number;
    humanComments: number;
  };
  
  decisionsSummary: {
    total: number;
    approved: number;
    rejected: number;
    deferred: number;
    pivoted: number;
  };
  
  keyDecisions: string[];
  outcome: MeetingOutcome;
}

// ─────────────────────────────────────────────────────
// PHASE REQUIREMENTS
// ─────────────────────────────────────────────────────

/**
 * Requirements to advance between phases.
 */
export interface PhaseRequirements {
  analysis: {
    minAgentContributions: number;
    requiredAgentRoles: AgentRole[];
  };
  decision: {
    requiresOwner: boolean;
    minRecommendationsReviewed: number;
  };
  validation: {
    requiresDecision: boolean;
    minConfirmations: number;
  };
}

/**
 * Default phase requirements.
 */
export const DEFAULT_PHASE_REQUIREMENTS: PhaseRequirements = {
  analysis: {
    minAgentContributions: 1,
    requiredAgentRoles: ['analyst'],
  },
  decision: {
    requiresOwner: true,
    minRecommendationsReviewed: 0,
  },
  validation: {
    requiresDecision: true,
    minConfirmations: 1,
  },
};

// ─────────────────────────────────────────────────────
// EVENTS
// ─────────────────────────────────────────────────────

/**
 * Meeting event types for timeline integration.
 */
export type MeetingEventType =
  // Lifecycle
  | 'meeting:created'
  | 'meeting:started'
  | 'meeting:paused'
  | 'meeting:resumed'
  | 'meeting:phase-changed'
  | 'meeting:closed'
  | 'meeting:cancelled'
  // Participants
  | 'participant:joined'
  | 'participant:left'
  // Contributions
  | 'agent:contributed'
  | 'human:contributed'
  // Decisions
  | 'decision:recorded'
  | 'decision:amended';

/**
 * Event payload for timeline integration.
 */
export interface MeetingEventPayload {
  kind: 'meeting-event';
  eventType: MeetingEventType;
  meetingId: string;
  data: Record<string, unknown>;
}
