/* =====================================================
   CHE·NU — Meeting Room Module
   PHASE 6: MEETING ROOM ENGINE
   
   Structured collaboration between humans and agents:
   - Phase-based workflow (analysis → decision → validation)
   - Human decision authority
   - Agent contributions and recommendations
   - Full timeline integration
   ===================================================== */

// Types
export type {
  MeetingPhase, MeetingStatus, ParticipantRole, DecisionType, AgentRole,
  HumanParticipant, AgentParticipant, ParticipantRegistry,
  MeetingObjective, MeetingContext,
  AgentContribution, HumanContribution,
  DecisionRecord, DecisionImpact,
  MeetingRoomState, MeetingSummary,
  PhaseRequirements, MeetingEventType, MeetingEventPayload,
} from './types';

export { DEFAULT_PHASE_REQUIREMENTS } from './types';

// Core
export { MeetingRoom, MeetingListener, MeetingOptions } from './MeetingRoom';

// Timeline Integration
export { MeetingTimelineAdapter, connectMeetingToTimeline } from './MeetingTimelineAdapter';

// Orchestration
export { MeetingOrchestrator, OrchestratorConfig, RecommendationsSummary } from './MeetingOrchestrator';

// Convenience
import { MeetingRoom } from './MeetingRoom';
import { MeetingObjective, ParticipantRegistry, HumanParticipant } from './types';

/**
 * Quick start: Create and start a meeting.
 */
export function createMeeting(
  id: string,
  title: string,
  sphereId: string,
  owner: { id: string; name: string },
  options: { criticality?: 'low' | 'medium' | 'high' | 'critical'; tags?: string[] } = {}
): MeetingRoom {
  const objective: MeetingObjective = {
    title,
    sphereId,
    criticality: options.criticality || 'medium',
  };
  
  const participants: ParticipantRegistry = {
    humans: [{ id: owner.id, displayName: owner.name, role: 'owner' }],
    agents: [],
  };
  
  return new MeetingRoom(id, objective, participants, { tags: options.tags });
}

/**
 * Add a collaborator to a meeting.
 */
export function addCollaborator(room: MeetingRoom, id: string, name: string): void {
  room.addHumanParticipant({ id, displayName: name, role: 'collaborator' });
}

/**
 * Add an observer to a meeting.
 */
export function addObserver(room: MeetingRoom, id: string, name: string): void {
  room.addHumanParticipant({ id, displayName: name, role: 'observer' });
}
