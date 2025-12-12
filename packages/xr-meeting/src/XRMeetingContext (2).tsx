/**
 * CHE·NU — XR MEETING ROOM + AVATAR MORPHOLOGY
 * React Context & Provider
 * 
 * State management for meetings and avatars
 */

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  ReactNode,
} from 'react';

import {
  XRMeeting,
  MeetingPresetId,
  MeetingParticipant,
  MeetingArtifact,
  MeetingMode,
  InteractionMode,
  MeetingEvent,
  ExportFormat,
  Avatar,
  AvatarRole,
  AvatarMorphology,
  MeetingRuntimeState,
  AvatarRuntimeState,
} from './types';

import {
  MEETING_PRESETS,
  MEETING_PRESET_LIST,
  AVATAR_ROLES,
  createMeeting,
  createParticipant,
  createAvatar,
} from './presets';

// ============================================================
// STATE
// ============================================================

interface XRMeetingState {
  // Meetings
  meetings: XRMeeting[];
  currentMeeting: XRMeeting | null;
  
  // Runtime
  meetingRuntime: MeetingRuntimeState;
  
  // Avatars
  avatars: Avatar[];
  currentAvatar: Avatar | null;
  avatarRuntime: AvatarRuntimeState;
  
  // UI
  selectedPreset: MeetingPresetId | null;
  interactionMode: InteractionMode;
  
  // Loading
  isLoading: boolean;
  error: string | null;
}

// ============================================================
// ACTIONS
// ============================================================

type XRMeetingAction =
  // Meeting actions
  | { type: 'CREATE_MEETING'; payload: { id: string; title: string; preset: MeetingPresetId; creator: MeetingParticipant } }
  | { type: 'JOIN_MEETING'; payload: { meetingId: string; participant: MeetingParticipant } }
  | { type: 'LEAVE_MEETING'; payload: { participantId: string } }
  | { type: 'END_MEETING' }
  | { type: 'SET_MEETING_MODE'; payload: MeetingMode }
  | { type: 'SET_INTERACTION_MODE'; payload: InteractionMode }
  | { type: 'ADD_ARTIFACT'; payload: MeetingArtifact }
  | { type: 'PIN_ARTIFACT'; payload: string }
  | { type: 'UNPIN_ARTIFACT'; payload: string }
  | { type: 'ADD_EVENT'; payload: MeetingEvent }
  | { type: 'SET_ACTIVE_SPEAKER'; payload: string | null }
  
  // Avatar actions
  | { type: 'CREATE_AVATAR'; payload: { id: string; ownerId: string; role: AvatarRole } }
  | { type: 'UPDATE_AVATAR_MORPHOLOGY'; payload: { avatarId: string; morphology: Partial<AvatarMorphology> } }
  | { type: 'SET_CURRENT_AVATAR'; payload: string }
  | { type: 'SET_AVATAR_SPEAKING'; payload: boolean }
  | { type: 'UPDATE_AVATAR_POSITION'; payload: { x: number; y: number; z: number } }
  
  // Preset actions
  | { type: 'SELECT_PRESET'; payload: MeetingPresetId }
  
  // UI actions
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET' };

// ============================================================
// INITIAL STATE
// ============================================================

const initialMeetingRuntime: MeetingRuntimeState = {
  current_meeting: null,
  current_mode: 'speak',
  is_recording: false,
  is_replay: false,
  connected_participants: [],
  pinned_artifacts: [],
};

const initialAvatarRuntime: AvatarRuntimeState = {
  current_avatar: null,
  is_visible: true,
  is_speaking: false,
  current_position: { x: 0, y: 0, z: 0 },
  current_rotation: { x: 0, y: 0, z: 0 },
};

const initialState: XRMeetingState = {
  meetings: [],
  currentMeeting: null,
  meetingRuntime: initialMeetingRuntime,
  avatars: [],
  currentAvatar: null,
  avatarRuntime: initialAvatarRuntime,
  selectedPreset: null,
  interactionMode: 'speak',
  isLoading: false,
  error: null,
};

// ============================================================
// REDUCER
// ============================================================

function xrMeetingReducer(
  state: XRMeetingState,
  action: XRMeetingAction
): XRMeetingState {
  switch (action.type) {
    // Meeting actions
    case 'CREATE_MEETING': {
      const { id, title, preset, creator } = action.payload;
      const meeting = createMeeting(id, title, preset, creator);
      return {
        ...state,
        meetings: [...state.meetings, meeting],
        currentMeeting: meeting,
        meetingRuntime: {
          ...state.meetingRuntime,
          current_meeting: meeting,
          is_recording: true,
          connected_participants: [creator.id],
        },
      };
    }
    
    case 'JOIN_MEETING': {
      if (!state.currentMeeting) return state;
      const updatedMeeting = {
        ...state.currentMeeting,
        participants: [...state.currentMeeting.participants, action.payload.participant],
      };
      return {
        ...state,
        currentMeeting: updatedMeeting,
        meetingRuntime: {
          ...state.meetingRuntime,
          connected_participants: [
            ...state.meetingRuntime.connected_participants,
            action.payload.participant.id,
          ],
        },
      };
    }
    
    case 'LEAVE_MEETING': {
      if (!state.currentMeeting) return state;
      return {
        ...state,
        currentMeeting: {
          ...state.currentMeeting,
          participants: state.currentMeeting.participants.filter(
            p => p.id !== action.payload.participantId
          ),
        },
        meetingRuntime: {
          ...state.meetingRuntime,
          connected_participants: state.meetingRuntime.connected_participants.filter(
            id => id !== action.payload.participantId
          ),
        },
      };
    }
    
    case 'END_MEETING': {
      if (!state.currentMeeting) return state;
      const endedMeeting = {
        ...state.currentMeeting,
        ended_at: new Date().toISOString(),
        mode: 'review' as MeetingMode,
        recording: {
          ...state.currentMeeting.recording,
          end_time: new Date().toISOString(),
        },
      };
      return {
        ...state,
        meetings: state.meetings.map(m => 
          m.id === endedMeeting.id ? endedMeeting : m
        ),
        currentMeeting: endedMeeting,
        meetingRuntime: {
          ...state.meetingRuntime,
          is_recording: false,
        },
      };
    }
    
    case 'SET_MEETING_MODE':
      if (!state.currentMeeting) return state;
      return {
        ...state,
        currentMeeting: {
          ...state.currentMeeting,
          mode: action.payload,
        },
        meetingRuntime: {
          ...state.meetingRuntime,
          is_replay: action.payload === 'replay',
        },
      };
    
    case 'SET_INTERACTION_MODE':
      return {
        ...state,
        interactionMode: action.payload,
        meetingRuntime: {
          ...state.meetingRuntime,
          current_mode: action.payload,
        },
      };
    
    case 'ADD_ARTIFACT':
      if (!state.currentMeeting) return state;
      return {
        ...state,
        currentMeeting: {
          ...state.currentMeeting,
          artifacts: [...state.currentMeeting.artifacts, action.payload],
        },
      };
    
    case 'PIN_ARTIFACT':
      return {
        ...state,
        meetingRuntime: {
          ...state.meetingRuntime,
          pinned_artifacts: [...state.meetingRuntime.pinned_artifacts, action.payload],
        },
      };
    
    case 'UNPIN_ARTIFACT':
      return {
        ...state,
        meetingRuntime: {
          ...state.meetingRuntime,
          pinned_artifacts: state.meetingRuntime.pinned_artifacts.filter(
            id => id !== action.payload
          ),
        },
      };
    
    case 'ADD_EVENT':
      if (!state.currentMeeting) return state;
      return {
        ...state,
        currentMeeting: {
          ...state.currentMeeting,
          recording: {
            ...state.currentMeeting.recording,
            events: [...state.currentMeeting.recording.events, action.payload],
          },
        },
      };
    
    case 'SET_ACTIVE_SPEAKER':
      return {
        ...state,
        meetingRuntime: {
          ...state.meetingRuntime,
          active_speaker: action.payload ?? undefined,
        },
      };
    
    // Avatar actions
    case 'CREATE_AVATAR': {
      const { id, ownerId, role } = action.payload;
      const avatar = createAvatar(id, ownerId, role);
      return {
        ...state,
        avatars: [...state.avatars, avatar],
      };
    }
    
    case 'UPDATE_AVATAR_MORPHOLOGY': {
      const { avatarId, morphology } = action.payload;
      return {
        ...state,
        avatars: state.avatars.map(a =>
          a.id === avatarId
            ? { ...a, morphology: { ...a.morphology, ...morphology } }
            : a
        ),
        currentAvatar: state.currentAvatar?.id === avatarId
          ? { ...state.currentAvatar, morphology: { ...state.currentAvatar.morphology, ...morphology } }
          : state.currentAvatar,
      };
    }
    
    case 'SET_CURRENT_AVATAR': {
      const avatar = state.avatars.find(a => a.id === action.payload);
      return {
        ...state,
        currentAvatar: avatar ?? null,
        avatarRuntime: {
          ...state.avatarRuntime,
          current_avatar: avatar ?? null,
        },
      };
    }
    
    case 'SET_AVATAR_SPEAKING':
      return {
        ...state,
        avatarRuntime: {
          ...state.avatarRuntime,
          is_speaking: action.payload,
        },
      };
    
    case 'UPDATE_AVATAR_POSITION':
      return {
        ...state,
        avatarRuntime: {
          ...state.avatarRuntime,
          current_position: action.payload,
        },
      };
    
    // Preset actions
    case 'SELECT_PRESET':
      return { ...state, selectedPreset: action.payload };
    
    // UI actions
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'RESET':
      return initialState;
    
    default:
      return state;
  }
}

// ============================================================
// CONTEXT
// ============================================================

interface XRMeetingContextValue {
  state: XRMeetingState;
  
  // Meeting operations
  createMeeting: (title: string, preset: MeetingPresetId, creatorName: string) => string;
  joinMeeting: (meetingId: string, name: string, role: 'user' | 'agent' | 'observer') => void;
  leaveMeeting: (participantId: string) => void;
  endMeeting: () => void;
  
  // Mode operations
  setMeetingMode: (mode: MeetingMode) => void;
  setInteractionMode: (mode: InteractionMode) => void;
  
  // Artifact operations
  addArtifact: (artifact: Omit<MeetingArtifact, 'id' | 'created_at'>) => void;
  pinArtifact: (id: string) => void;
  unpinArtifact: (id: string) => void;
  
  // Recording operations
  addEvent: (type: MeetingEvent['type'], participantId: string, data?: unknown) => void;
  setActiveSpeaker: (participantId: string | null) => void;
  
  // Avatar operations
  createAvatar: (ownerId: string, role: AvatarRole) => string;
  updateAvatarMorphology: (avatarId: string, morphology: Partial<AvatarMorphology>) => void;
  setCurrentAvatar: (avatarId: string) => void;
  setAvatarSpeaking: (speaking: boolean) => void;
  
  // Preset operations
  selectPreset: (preset: MeetingPresetId) => void;
  getPresets: () => typeof MEETING_PRESET_LIST;
  getAvatarRoles: () => typeof AVATAR_ROLES;
  
  // Export
  exportMeeting: (format: ExportFormat) => Promise<string>;
  
  // Reset
  reset: () => void;
}

const XRMeetingContext = createContext<XRMeetingContextValue | null>(null);

// ============================================================
// PROVIDER
// ============================================================

interface XRMeetingProviderProps {
  children: ReactNode;
}

export function XRMeetingProvider({ children }: XRMeetingProviderProps) {
  const [state, dispatch] = useReducer(xrMeetingReducer, initialState);
  
  // Meeting operations
  const createMeetingFn = useCallback((
    title: string,
    preset: MeetingPresetId,
    creatorName: string
  ): string => {
    const id = `meeting_${Date.now()}`;
    const creator = createParticipant(`user_${Date.now()}`, creatorName, 'user');
    dispatch({ type: 'CREATE_MEETING', payload: { id, title, preset, creator } });
    return id;
  }, []);
  
  const joinMeetingFn = useCallback((
    meetingId: string,
    name: string,
    role: 'user' | 'agent' | 'observer'
  ) => {
    const participant = createParticipant(`${role}_${Date.now()}`, name, role);
    dispatch({ type: 'JOIN_MEETING', payload: { meetingId, participant } });
  }, []);
  
  const leaveMeetingFn = useCallback((participantId: string) => {
    dispatch({ type: 'LEAVE_MEETING', payload: { participantId } });
  }, []);
  
  const endMeetingFn = useCallback(() => {
    dispatch({ type: 'END_MEETING' });
  }, []);
  
  // Mode operations
  const setMeetingModeFn = useCallback((mode: MeetingMode) => {
    dispatch({ type: 'SET_MEETING_MODE', payload: mode });
  }, []);
  
  const setInteractionModeFn = useCallback((mode: InteractionMode) => {
    dispatch({ type: 'SET_INTERACTION_MODE', payload: mode });
  }, []);
  
  // Artifact operations
  const addArtifactFn = useCallback((artifact: Omit<MeetingArtifact, 'id' | 'created_at'>) => {
    const fullArtifact: MeetingArtifact = {
      ...artifact,
      id: `artifact_${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_ARTIFACT', payload: fullArtifact });
  }, []);
  
  const pinArtifactFn = useCallback((id: string) => {
    dispatch({ type: 'PIN_ARTIFACT', payload: id });
  }, []);
  
  const unpinArtifactFn = useCallback((id: string) => {
    dispatch({ type: 'UNPIN_ARTIFACT', payload: id });
  }, []);
  
  // Recording operations
  const addEventFn = useCallback((
    type: MeetingEvent['type'],
    participantId: string,
    data?: unknown
  ) => {
    const event: MeetingEvent = {
      id: `event_${Date.now()}`,
      timestamp: new Date().toISOString(),
      type,
      participant_id: participantId,
      data,
    };
    dispatch({ type: 'ADD_EVENT', payload: event });
  }, []);
  
  const setActiveSpeakerFn = useCallback((participantId: string | null) => {
    dispatch({ type: 'SET_ACTIVE_SPEAKER', payload: participantId });
  }, []);
  
  // Avatar operations
  const createAvatarFn = useCallback((ownerId: string, role: AvatarRole): string => {
    const id = `avatar_${Date.now()}`;
    dispatch({ type: 'CREATE_AVATAR', payload: { id, ownerId, role } });
    return id;
  }, []);
  
  const updateAvatarMorphologyFn = useCallback((
    avatarId: string,
    morphology: Partial<AvatarMorphology>
  ) => {
    dispatch({ type: 'UPDATE_AVATAR_MORPHOLOGY', payload: { avatarId, morphology } });
  }, []);
  
  const setCurrentAvatarFn = useCallback((avatarId: string) => {
    dispatch({ type: 'SET_CURRENT_AVATAR', payload: avatarId });
  }, []);
  
  const setAvatarSpeakingFn = useCallback((speaking: boolean) => {
    dispatch({ type: 'SET_AVATAR_SPEAKING', payload: speaking });
  }, []);
  
  // Preset operations
  const selectPresetFn = useCallback((preset: MeetingPresetId) => {
    dispatch({ type: 'SELECT_PRESET', payload: preset });
  }, []);
  
  const getPresetsFn = useCallback(() => MEETING_PRESET_LIST, []);
  
  const getAvatarRolesFn = useCallback(() => AVATAR_ROLES, []);
  
  // Export
  const exportMeetingFn = useCallback(async (format: ExportFormat): Promise<string> => {
    if (!state.currentMeeting) {
      throw new Error('No meeting to export');
    }
    
    // Simulate export
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const exportData = {
      format,
      meeting: state.currentMeeting,
      exported_at: new Date().toISOString(),
    };
    
    return JSON.stringify(exportData, null, 2);
  }, [state.currentMeeting]);
  
  // Reset
  const resetFn = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);
  
  const value: XRMeetingContextValue = {
    state,
    createMeeting: createMeetingFn,
    joinMeeting: joinMeetingFn,
    leaveMeeting: leaveMeetingFn,
    endMeeting: endMeetingFn,
    setMeetingMode: setMeetingModeFn,
    setInteractionMode: setInteractionModeFn,
    addArtifact: addArtifactFn,
    pinArtifact: pinArtifactFn,
    unpinArtifact: unpinArtifactFn,
    addEvent: addEventFn,
    setActiveSpeaker: setActiveSpeakerFn,
    createAvatar: createAvatarFn,
    updateAvatarMorphology: updateAvatarMorphologyFn,
    setCurrentAvatar: setCurrentAvatarFn,
    setAvatarSpeaking: setAvatarSpeakingFn,
    selectPreset: selectPresetFn,
    getPresets: getPresetsFn,
    getAvatarRoles: getAvatarRolesFn,
    exportMeeting: exportMeetingFn,
    reset: resetFn,
  };
  
  return (
    <XRMeetingContext.Provider value={value}>
      {children}
    </XRMeetingContext.Provider>
  );
}

// ============================================================
// HOOK
// ============================================================

export function useXRMeeting(): XRMeetingContextValue {
  const context = useContext(XRMeetingContext);
  if (!context) {
    throw new Error('useXRMeeting must be used within XRMeetingProvider');
  }
  return context;
}

// ============================================================
// EXPORTS
// ============================================================

export { XRMeetingContext };
export type { XRMeetingState, XRMeetingContextValue };
