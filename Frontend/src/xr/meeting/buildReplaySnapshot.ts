/* =====================================================
   CHE·NU — Build Replay Snapshot
   
   Reconstructs meeting state from timeline events.
   Used for replay/rewind functionality.
   ===================================================== */

import {
  TimelineXREvent,
  XRReplaySnapshot,
  PhaseChangePayload,
  AgentSpeakPayload,
  DecisionPayload,
} from './xrReplay.types';

import {
  XRMeetingContext,
  XRMeetingAgent,
  MeetingPhase,
} from './xrMeeting.types';

// ─────────────────────────────────────────────────────
// MAIN FUNCTION
// ─────────────────────────────────────────────────────

/**
 * Builds a complete meeting context by replaying events up to index.
 * This is the core of the replay system.
 */
export function buildXRMeetingSnapshotFromEvents(
  events: TimelineXREvent[],
  index: number,
  baseContext: XRMeetingContext
): XRReplaySnapshot {
  // Clone base context
  let context: XRMeetingContext = { ...baseContext };
  
  // Track state as we replay
  const activeAgentIds = new Set<string>(baseContext.agentIds);
  let speakingAgentId: string | undefined;
  let lastDecisionId: string | undefined;
  let currentPhase: MeetingPhase = baseContext.phase;
  
  // Replay events up to index
  for (let i = 0; i <= index && i < events.length; i++) {
    const event = events[i];
    if (!event) continue;
    
    // Process event based on type
    switch (event.type) {
      case 'meeting_start':
        currentPhase = 'preparation';
        break;
        
      case 'meeting_end':
        currentPhase = 'closed';
        speakingAgentId = undefined;
        break;
        
      case 'phase_change':
        if (event.payload) {
          const payload = event.payload as PhaseChangePayload;
          currentPhase = payload.toPhase;
        } else {
          // Fallback: infer from summary
          currentPhase = inferPhaseFromSummary(event.summary);
        }
        break;
        
      case 'agent_join':
        activeAgentIds.add(event.actorId);
        break;
        
      case 'agent_leave':
        activeAgentIds.delete(event.actorId);
        if (speakingAgentId === event.actorId) {
          speakingAgentId = undefined;
        }
        break;
        
      case 'agent_speak':
        speakingAgentId = event.actorId;
        break;
        
      case 'human_speak':
      case 'human_ask':
        speakingAgentId = undefined; // Human is speaking, not agent
        break;
        
      case 'decision_propose':
        if (event.payload) {
          const payload = event.payload as DecisionPayload;
          lastDecisionId = payload.decisionId;
        }
        break;
        
      case 'decision_select':
      case 'decision_confirm':
        if (event.payload) {
          const payload = event.payload as DecisionPayload;
          lastDecisionId = payload.decisionId;
        }
        break;
        
      case 'decision_reject':
        // Decision rejected, might clear or keep reference
        break;
        
      case 'rewind_action':
        // Meta event, no state change
        break;
    }
  }
  
  // Build final context
  context = {
    ...context,
    phase: currentPhase,
    agentIds: Array.from(activeAgentIds),
    currentSpeaker: speakingAgentId,
  };
  
  // Build snapshot
  const snapshot: XRReplaySnapshot = {
    context,
    highlightedEventId: events[index]?.id,
    activeAgentIds: Array.from(activeAgentIds),
    speakingAgentId,
    lastDecisionId,
    progress: events.length > 0 ? (index + 1) / events.length : 0,
    timestamp: events[index]?.timestamp || Date.now(),
    eventsSoFar: index + 1,
    eventsTotal: events.length,
  };
  
  return snapshot;
}

// ─────────────────────────────────────────────────────
// HELPER: Infer phase from summary text
// ─────────────────────────────────────────────────────

function inferPhaseFromSummary(summary: string): MeetingPhase {
  const lower = summary.toLowerCase();
  
  if (lower.includes('préparation') || lower.includes('preparation')) {
    return 'preparation';
  }
  if (lower.includes('analyse') || lower.includes('analysis')) {
    return 'analysis';
  }
  if (lower.includes('délibération') || lower.includes('deliberation')) {
    return 'deliberation';
  }
  if (lower.includes('décision') || lower.includes('decision')) {
    return 'decision';
  }
  if (lower.includes('validation')) {
    return 'validation';
  }
  if (lower.includes('terminé') || lower.includes('closed') || lower.includes('fin')) {
    return 'closed';
  }
  
  return 'analysis'; // Default
}

// ─────────────────────────────────────────────────────
// BUILD AGENT STATES AT POINT
// ─────────────────────────────────────────────────────

/**
 * Builds the state of all agents at a given point in the timeline.
 */
export function buildAgentStatesAtIndex(
  events: TimelineXREvent[],
  index: number,
  baseAgents: XRMeetingAgent[]
): XRMeetingAgent[] {
  // Clone agents
  const agentMap = new Map<string, XRMeetingAgent>(
    baseAgents.map(a => [a.id, { ...a, isActive: false, isSpeaking: false, hasContributed: false }])
  );
  
  // Replay to build state
  for (let i = 0; i <= index && i < events.length; i++) {
    const event = events[i];
    if (!event) continue;
    
    if (event.actorType === 'agent') {
      const agent = agentMap.get(event.actorId);
      if (agent) {
        agent.isActive = true;
        
        if (event.type === 'agent_speak') {
          agent.hasContributed = true;
          agent.isSpeaking = i === index; // Only speaking if this is current event
          
          if (event.payload) {
            const payload = event.payload as AgentSpeakPayload;
            agent.lastOutput = {
              type: payload.outputType as any,
              content: payload.content,
              confidence: payload.confidence,
              priority: 'medium',
              reasoning: '',
              agentId: agent.id,
              timestamp: event.timestamp,
              ttl: 0,
            };
          }
        }
        
        if (event.type === 'agent_leave') {
          agent.isActive = false;
          agent.isSpeaking = false;
        }
      }
    }
    
    // Clear speaking for all agents when human speaks
    if (event.actorType === 'human' && (event.type === 'human_speak' || event.type === 'human_ask')) {
      agentMap.forEach(agent => {
        agent.isSpeaking = false;
      });
    }
  }
  
  return Array.from(agentMap.values());
}

// ─────────────────────────────────────────────────────
// FIND EVENT INDEX
// ─────────────────────────────────────────────────────

/**
 * Find the index of an event by ID.
 */
export function findEventIndex(events: TimelineXREvent[], eventId: string): number {
  return events.findIndex(e => e.id === eventId);
}

/**
 * Find events of a specific type.
 */
export function findEventsByType(
  events: TimelineXREvent[],
  type: TimelineXREvent['type']
): TimelineXREvent[] {
  return events.filter(e => e.type === type);
}

/**
 * Find events by actor.
 */
export function findEventsByActor(
  events: TimelineXREvent[],
  actorId: string
): TimelineXREvent[] {
  return events.filter(e => e.actorId === actorId);
}

// ─────────────────────────────────────────────────────
// CALCULATE DURATION
// ─────────────────────────────────────────────────────

/**
 * Calculate total duration of events.
 */
export function calculateEventsDuration(events: TimelineXREvent[]): number {
  if (events.length < 2) return 0;
  return events[events.length - 1].timestamp - events[0].timestamp;
}

/**
 * Calculate duration up to index.
 */
export function calculateDurationToIndex(
  events: TimelineXREvent[],
  index: number
): number {
  if (events.length === 0 || index < 0) return 0;
  const safeIndex = Math.min(index, events.length - 1);
  return events[safeIndex].timestamp - events[0].timestamp;
}

// ─────────────────────────────────────────────────────
// GENERATE MARKERS
// ─────────────────────────────────────────────────────

import { ReplayMarker } from './xrReplay.types';

/**
 * Auto-generate markers for important events.
 */
export function generateAutoMarkers(events: TimelineXREvent[]): ReplayMarker[] {
  const markers: ReplayMarker[] = [];
  
  events.forEach((event, index) => {
    let marker: ReplayMarker | null = null;
    
    switch (event.type) {
      case 'meeting_start':
        marker = {
          id: `marker-${event.id}`,
          eventIndex: index,
          label: 'Début',
          color: '#10b981',
          icon: '🚀',
        };
        break;
        
      case 'meeting_end':
        marker = {
          id: `marker-${event.id}`,
          eventIndex: index,
          label: 'Fin',
          color: '#6b7280',
          icon: '🏁',
        };
        break;
        
      case 'phase_change':
        marker = {
          id: `marker-${event.id}`,
          eventIndex: index,
          label: event.summary,
          color: '#8b5cf6',
          icon: '🔄',
        };
        break;
        
      case 'decision_confirm':
        marker = {
          id: `marker-${event.id}`,
          eventIndex: index,
          label: 'Décision',
          color: '#fbbf24',
          icon: '✅',
        };
        break;
    }
    
    if (marker) {
      markers.push(marker);
    }
  });
  
  return markers;
}

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default {
  buildXRMeetingSnapshotFromEvents,
  buildAgentStatesAtIndex,
  findEventIndex,
  findEventsByType,
  findEventsByActor,
  calculateEventsDuration,
  calculateDurationToIndex,
  generateAutoMarkers,
};
