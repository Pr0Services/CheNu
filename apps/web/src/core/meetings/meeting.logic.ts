/* =====================================================
   CHE·NU — Meeting System Logic
   core/meetings/meeting.logic.ts
   ===================================================== */

import { 
  Meeting, 
  MeetingPhase, 
  MeetingEvent, 
  MeetingEventType,
  Decision,
  ActionItem,
  AgendaItem,
} from './meeting.types';

// ─────────────────────────────────────────────────────
// Phase Management
// ─────────────────────────────────────────────────────

const PHASE_ORDER: MeetingPhase[] = [
  'setup',
  'opening',
  'discussion',
  'analysis',
  'proposal',
  'voting',
  'decision',
  'action_planning',
  'closing',
  'completed',
];

export function advanceMeetingPhase(meeting: Meeting): Meeting {
  const currentIndex = PHASE_ORDER.indexOf(meeting.phase);
  
  if (currentIndex < PHASE_ORDER.length - 1) {
    const nextPhase = PHASE_ORDER[currentIndex + 1];
    
    return logMeetingEvent(
      { ...meeting, phase: nextPhase },
      {
        type: 'phase_changed',
        actorId: 'system',
        payload: { from: meeting.phase, to: nextPhase },
        phase: nextPhase,
      }
    );
  }
  
  return meeting;
}

export function goToPhase(meeting: Meeting, targetPhase: MeetingPhase): Meeting {
  return logMeetingEvent(
    { ...meeting, phase: targetPhase },
    {
      type: 'phase_changed',
      actorId: 'system',
      payload: { from: meeting.phase, to: targetPhase },
      phase: targetPhase,
    }
  );
}

export function getNextPhase(currentPhase: MeetingPhase): MeetingPhase | null {
  const currentIndex = PHASE_ORDER.indexOf(currentPhase);
  return currentIndex < PHASE_ORDER.length - 1 
    ? PHASE_ORDER[currentIndex + 1] 
    : null;
}

export function getPreviousPhase(currentPhase: MeetingPhase): MeetingPhase | null {
  const currentIndex = PHASE_ORDER.indexOf(currentPhase);
  return currentIndex > 0 
    ? PHASE_ORDER[currentIndex - 1] 
    : null;
}

// ─────────────────────────────────────────────────────
// Event Logging
// ─────────────────────────────────────────────────────

export function logMeetingEvent(
  meeting: Meeting, 
  event: Omit<MeetingEvent, 'id' | 'timestamp'>
): Meeting {
  const newEvent: MeetingEvent = {
    id: generateId(),
    timestamp: new Date(),
    ...event,
  };
  
  return {
    ...meeting,
    eventLog: [...meeting.eventLog, newEvent],
  };
}

export function getEventsOfType(
  meeting: Meeting, 
  type: MeetingEventType
): MeetingEvent[] {
  return meeting.eventLog.filter(e => e.type === type);
}

export function getEventsByPhase(
  meeting: Meeting, 
  phase: MeetingPhase
): MeetingEvent[] {
  return meeting.eventLog.filter(e => e.phase === phase);
}

// ─────────────────────────────────────────────────────
// Decision Management
// ─────────────────────────────────────────────────────

export function proposeDecision(
  meeting: Meeting, 
  decision: Omit<Decision, 'id'>
): Meeting {
  const newDecision: Decision = {
    id: generateId(),
    ...decision,
  };
  
  return logMeetingEvent(
    { ...meeting, decisions: [...meeting.decisions, newDecision] },
    {
      type: 'decision_proposed',
      actorId: 'system',
      payload: { decisionId: newDecision.id, title: newDecision.title },
      phase: meeting.phase,
    }
  );
}

export function makeDecision(
  meeting: Meeting,
  decisionId: string,
  selectedOptionId: string,
  decidedBy: string,
  rationale?: string
): Meeting {
  const updatedDecisions = meeting.decisions.map(d => {
    if (d.id === decisionId) {
      return {
        ...d,
        selectedOption: selectedOptionId,
        decidedBy,
        decidedAt: new Date(),
        rationale,
      };
    }
    return d;
  });
  
  return logMeetingEvent(
    { ...meeting, decisions: updatedDecisions },
    {
      type: 'decision_made',
      actorId: decidedBy,
      payload: { decisionId, selectedOptionId, rationale },
      phase: meeting.phase,
    }
  );
}

// ─────────────────────────────────────────────────────
// Action Items
// ─────────────────────────────────────────────────────

export function createActionItem(
  meeting: Meeting,
  actionItem: Omit<ActionItem, 'id' | 'status'>
): Meeting {
  const newItem: ActionItem = {
    id: generateId(),
    status: 'pending',
    ...actionItem,
  };
  
  return logMeetingEvent(
    { ...meeting, actionItems: [...meeting.actionItems, newItem] },
    {
      type: 'action_item_created',
      actorId: 'system',
      payload: { actionItemId: newItem.id, title: newItem.title, assignee: newItem.assignee },
      phase: meeting.phase,
    }
  );
}

export function updateActionItemStatus(
  meeting: Meeting,
  actionItemId: string,
  status: ActionItem['status']
): Meeting {
  const updatedItems = meeting.actionItems.map(item => {
    if (item.id === actionItemId) {
      return { ...item, status };
    }
    return item;
  });
  
  return { ...meeting, actionItems: updatedItems };
}

// ─────────────────────────────────────────────────────
// Agenda Management
// ─────────────────────────────────────────────────────

export function startAgendaItem(
  meeting: Meeting,
  itemId: string
): Meeting {
  const updatedAgenda = meeting.agenda.map(item => ({
    ...item,
    status: item.id === itemId ? 'in_progress' as const : item.status,
  }));
  
  return logMeetingEvent(
    { ...meeting, agenda: updatedAgenda },
    {
      type: 'agenda_item_started',
      actorId: 'system',
      payload: { itemId },
      phase: meeting.phase,
    }
  );
}

export function completeAgendaItem(
  meeting: Meeting,
  itemId: string,
  notes?: string
): Meeting {
  const updatedAgenda = meeting.agenda.map(item => {
    if (item.id === itemId) {
      return { ...item, status: 'completed' as const, notes };
    }
    return item;
  });
  
  return logMeetingEvent(
    { ...meeting, agenda: updatedAgenda },
    {
      type: 'agenda_item_completed',
      actorId: 'system',
      payload: { itemId, notes },
      phase: meeting.phase,
    }
  );
}

// ─────────────────────────────────────────────────────
// Meeting Summary
// ─────────────────────────────────────────────────────

export function buildMeetingSummary(meeting: Meeting): string {
  const lines: string[] = [];
  
  lines.push(`# Meeting Summary: ${meeting.title}`);
  lines.push(`Objective: ${meeting.objective}`);
  lines.push(`Status: ${meeting.status} | Phase: ${meeting.phase}`);
  lines.push('');
  
  // Decisions
  const decisions = meeting.decisions.filter(d => d.selectedOption);
  if (decisions.length > 0) {
    lines.push('## Decisions Made');
    decisions.forEach(d => {
      const option = d.options.find(o => o.id === d.selectedOption);
      lines.push(`- ${d.title}: ${option?.label || 'Unknown'}`);
      if (d.rationale) {
        lines.push(`  Rationale: ${d.rationale}`);
      }
    });
    lines.push('');
  }
  
  // Action Items
  const actionItems = meeting.actionItems.filter(a => a.status !== 'cancelled');
  if (actionItems.length > 0) {
    lines.push('## Action Items');
    actionItems.forEach(a => {
      lines.push(`- [${a.status}] ${a.title} (${a.assignee})`);
    });
    lines.push('');
  }
  
  // Stats
  lines.push('## Statistics');
  lines.push(`- Total events: ${meeting.eventLog.length}`);
  lines.push(`- Agenda items completed: ${meeting.agenda.filter(a => a.status === 'completed').length}/${meeting.agenda.length}`);
  lines.push(`- Agents involved: ${meeting.agents.length}`);
  
  return lines.join('\n');
}

// ─────────────────────────────────────────────────────
// Meeting Creation
// ─────────────────────────────────────────────────────

export function createMeeting(
  title: string,
  objective: string,
  config?: Partial<Meeting['config']>
): Meeting {
  return {
    id: generateId(),
    title,
    objective,
    agents: [],
    humanParticipants: [],
    phase: 'setup',
    status: 'draft',
    agenda: [],
    decisions: [],
    actionItems: [],
    eventLog: [],
    config: {
      requireHumanDecision: true,
      allowAgentVoting: false,
      autoAdvancePhases: false,
      recordTranscript: true,
      maxDuration: 60,
      decisionThreshold: 0.8,
      ...config,
    },
  };
}

// ─────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
