/* =====================================================
   CHE·NU — Meeting Page
   PHASE 6: Container component with state management
   
   Connects MeetingRoomView to:
   - MeetingRoom engine
   - Timeline system
   - Agent backend (placeholder)
   ===================================================== */

import React, { useState, useCallback, useMemo } from 'react';
import { MeetingRoomView, DecisionInput } from './MeetingRoomView';
import { MeetingRoom } from '../../meeting/MeetingRoom';
import {
  MeetingRoomState, MeetingObjective, ParticipantRegistry,
  HumanParticipant, AgentParticipant,
} from '../../meeting/types';
import { MeetingTimelineAdapter } from '../../meeting/MeetingTimelineAdapter';

// ─────────────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────────────

export interface MeetingPageProps {
  // Initial configuration
  meetingId: string;
  objective: MeetingObjective;
  participants: ParticipantRegistry;
  
  // Optional timeline recorder
  timelineRecorder?: any;
  
  // Callbacks
  onMeetingClosed?: (summary: any) => void;
  onAgentQuery?: (agentId: string, queryType: 'summary' | 'suggestion') => Promise<string>;
}

// ─────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────

export const MeetingPage: React.FC<MeetingPageProps> = ({
  meetingId,
  objective,
  participants,
  timelineRecorder,
  onMeetingClosed,
  onAgentQuery,
}) => {
  // Initialize meeting room
  const [meetingRoom] = useState(() => {
    const room = new MeetingRoom(meetingId, objective, participants);
    room.start(); // Auto-start
    return room;
  });
  
  // Track state for re-renders
  const [meetingState, setMeetingState] = useState<MeetingRoomState>(
    meetingRoom.getState() as MeetingRoomState
  );
  
  // Timeline adapter
  const [timelineAdapter] = useState(() => {
    if (timelineRecorder) {
      return new MeetingTimelineAdapter(meetingRoom, timelineRecorder);
    }
    return null;
  });
  
  // Connect timeline on mount
  React.useEffect(() => {
    timelineAdapter?.connect();
    return () => timelineAdapter?.disconnect();
  }, [timelineAdapter]);
  
  // Sync state on events
  React.useEffect(() => {
    const unsubscribe = meetingRoom.subscribe(() => {
      setMeetingState({ ...meetingRoom.getState() } as MeetingRoomState);
    });
    return unsubscribe;
  }, [meetingRoom]);
  
  // ─────────────────────────────────────────────────────
  // HANDLERS
  // ─────────────────────────────────────────────────────
  
  const handleAdvancePhase = useCallback(() => {
    try {
      meetingRoom.advancePhase();
      setMeetingState({ ...meetingRoom.getState() } as MeetingRoomState);
    } catch (e) {
      console.warn('Cannot advance phase:', e);
      // Could show toast/notification
    }
  }, [meetingRoom]);
  
  const handleRecordDecision = useCallback((input: DecisionInput) => {
    try {
      meetingRoom.recordDecision({
        decidedBy: input.decidedBy,
        decisionType: input.decisionType,
        summary: input.summary,
        linkedContributions: input.linkedRecommendations || [],
      });
      setMeetingState({ ...meetingRoom.getState() } as MeetingRoomState);
    } catch (e) {
      console.warn('Cannot record decision:', e);
    }
  }, [meetingRoom]);
  
  const handleClose = useCallback(() => {
    meetingRoom.close();
    setMeetingState({ ...meetingRoom.getState() } as MeetingRoomState);
    
    const summary = meetingRoom.generateSummary();
    onMeetingClosed?.(summary);
  }, [meetingRoom, onMeetingClosed]);
  
  const handleAskAgentSummary = useCallback(async (agentId: string) => {
    if (onAgentQuery) {
      const response = await onAgentQuery(agentId, 'summary');
      console.log(`Agent ${agentId} summary:`, response);
      // Could display in modal/toast
    } else {
      console.log(`[Mock] Requesting summary from agent ${agentId}`);
    }
  }, [onAgentQuery]);
  
  const handleAskAgentSuggestion = useCallback(async (agentId: string) => {
    if (onAgentQuery) {
      const response = await onAgentQuery(agentId, 'suggestion');
      console.log(`Agent ${agentId} suggestion:`, response);
      // Could add as contribution
    } else {
      console.log(`[Mock] Requesting suggestion from agent ${agentId}`);
    }
  }, [onAgentQuery]);
  
  // ─────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────
  
  return (
    <MeetingRoomView
      meeting={meetingState}
      onAdvancePhase={handleAdvancePhase}
      onRecordDecision={handleRecordDecision}
      onClose={handleClose}
      onAskAgentSummary={handleAskAgentSummary}
      onAskAgentSuggestion={handleAskAgentSuggestion}
    />
  );
};

// ─────────────────────────────────────────────────────
// DEMO / STANDALONE
// ─────────────────────────────────────────────────────

export const MeetingPageDemo: React.FC = () => {
  const objective: MeetingObjective = {
    title: 'Revue Budget Q4',
    description: 'Validation des allocations budgétaires pour le quatrième trimestre',
    sphereId: 'business',
    criticality: 'high',
  };
  
  const participants: ParticipantRegistry = {
    humans: [
      { id: 'jo', displayName: 'Jo', role: 'owner' },
      { id: 'alex', displayName: 'Alex', role: 'collaborator' },
      { id: 'sam', displayName: 'Sam', role: 'observer' },
    ],
    agents: [
      { id: 'analyst-1', name: 'Analyst', role: 'analyst', capabilities: ['analysis'], outputCount: 3 },
      { id: 'advisor-1', name: 'Advisor', role: 'advisor', capabilities: ['recommendations'], outputCount: 2 },
    ],
  };
  
  return (
    <MeetingPage
      meetingId="demo-meeting-001"
      objective={objective}
      participants={participants}
      onMeetingClosed={(summary) => {
        console.log('Meeting closed:', summary);
        alert(`Meeting terminé! Outcome: ${summary.outcome}`);
      }}
    />
  );
};

export default MeetingPage;
