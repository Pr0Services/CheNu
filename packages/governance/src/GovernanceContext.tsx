/**
 * CHE·NU — CONSTITUTIONAL GOVERNANCE
 * React Context & Provider
 */

import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import {
  GovernanceState, XRSession, HumanOverride, Consent, AuditEntry, Violation,
  RecordingState, CaptureLayer, OverrideLevel, ConsentType, AuditEntryType, ViolationSeverity, TreeLawId,
  SessionParticipant,
} from './types';
import {
  GOVERNANCE_AGENTS, createSession, createOverride, createAuditEntry, createViolation, createConsent,
} from './presets';

type Action =
  // Session
  | { type: 'CREATE_SESSION'; payload: { createdBy: string; sphere: string; participants: string[] } }
  | { type: 'START_RECORDING' }
  | { type: 'PAUSE_RECORDING' }
  | { type: 'RESUME_RECORDING' }
  | { type: 'FINALIZE_SESSION' }
  | { type: 'TOGGLE_LAYER'; payload: CaptureLayer }
  | { type: 'GRANT_PARTICIPANT_CONSENT'; payload: string }
  
  // Override
  | { type: 'TRIGGER_OVERRIDE'; payload: HumanOverride }
  | { type: 'RESOLVE_OVERRIDE'; payload: { overrideId: string; resolvedBy: string } }
  
  // Consent
  | { type: 'ADD_CONSENT'; payload: Consent }
  | { type: 'GRANT_CONSENT'; payload: string }
  | { type: 'REVOKE_CONSENT'; payload: string }
  
  // Audit
  | { type: 'ADD_AUDIT_ENTRY'; payload: AuditEntry }
  
  // Violation
  | { type: 'REPORT_VIOLATION'; payload: Violation }
  | { type: 'RESOLVE_VIOLATION'; payload: { violationId: string; resolution: 'resolved' | 'dismissed' } }
  
  // UI
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET' };

const initialState: GovernanceState = {
  current_session: null,
  sessions_history: [],
  overrides: [],
  active_override: null,
  consents: [],
  audit_log: [],
  violations: [],
  governance_agents: GOVERNANCE_AGENTS,
  is_recording: false,
  recording_indicator_visible: false,
  is_loading: false,
  error: null,
};

function reducer(state: GovernanceState, action: Action): GovernanceState {
  switch (action.type) {
    // Session actions
    case 'CREATE_SESSION': {
      const session = createSession(action.payload.createdBy, action.payload.sphere, action.payload.participants);
      return { ...state, current_session: session };
    }
    
    case 'START_RECORDING':
      if (!state.current_session) return state;
      // Check all participants have consent
      const allConsent = state.current_session.participants.every(p => p.consent);
      if (!allConsent) return { ...state, error: 'All participants must consent before recording' };
      return {
        ...state,
        current_session: { ...state.current_session, state: 'recording', started_at: new Date().toISOString() },
        is_recording: true,
        recording_indicator_visible: true,
      };
    
    case 'PAUSE_RECORDING':
      if (!state.current_session || state.current_session.state !== 'recording') return state;
      return {
        ...state,
        current_session: {
          ...state.current_session,
          state: 'paused',
          paused_intervals: [...state.current_session.paused_intervals, { start: new Date().toISOString(), end: '' }],
        },
        is_recording: false,
      };
    
    case 'RESUME_RECORDING':
      if (!state.current_session || state.current_session.state !== 'paused') return state;
      const intervals = [...state.current_session.paused_intervals];
      if (intervals.length > 0) intervals[intervals.length - 1].end = new Date().toISOString();
      return {
        ...state,
        current_session: { ...state.current_session, state: 'recording', paused_intervals: intervals },
        is_recording: true,
      };
    
    case 'FINALIZE_SESSION':
      if (!state.current_session) return state;
      const finalized: XRSession = {
        ...state.current_session,
        state: 'finalized',
        ended_at: new Date().toISOString(),
        hash: `sha256_${Date.now()}`,
        integrity: 'verified',
      };
      return {
        ...state,
        current_session: null,
        sessions_history: [...state.sessions_history, finalized],
        is_recording: false,
        recording_indicator_visible: false,
      };
    
    case 'TOGGLE_LAYER':
      if (!state.current_session || state.current_session.state === 'finalized') return state;
      return {
        ...state,
        current_session: {
          ...state.current_session,
          layers: { ...state.current_session.layers, [action.payload]: !state.current_session.layers[action.payload] },
        },
      };
    
    case 'GRANT_PARTICIPANT_CONSENT':
      if (!state.current_session) return state;
      return {
        ...state,
        current_session: {
          ...state.current_session,
          participants: state.current_session.participants.map(p =>
            p.id === action.payload ? { ...p, consent: true, consent_at: new Date().toISOString() } : p
          ),
        },
      };
    
    // Override actions
    case 'TRIGGER_OVERRIDE':
      return {
        ...state,
        overrides: [...state.overrides, action.payload],
        active_override: action.payload,
        is_recording: false,
      };
    
    case 'RESOLVE_OVERRIDE': {
      const updated = state.overrides.map(o =>
        o.id === action.payload.overrideId
          ? { ...o, resolved: true, resolved_at: new Date().toISOString(), resolved_by: action.payload.resolvedBy }
          : o
      );
      return {
        ...state,
        overrides: updated,
        active_override: state.active_override?.id === action.payload.overrideId ? null : state.active_override,
      };
    }
    
    // Consent actions
    case 'ADD_CONSENT':
      return { ...state, consents: [...state.consents, action.payload] };
    
    case 'GRANT_CONSENT':
      return {
        ...state,
        consents: state.consents.map(c =>
          c.id === action.payload ? { ...c, granted: true, granted_at: new Date().toISOString() } : c
        ),
      };
    
    case 'REVOKE_CONSENT':
      return {
        ...state,
        consents: state.consents.map(c =>
          c.id === action.payload ? { ...c, granted: false, revoked_at: new Date().toISOString() } : c
        ),
      };
    
    // Audit
    case 'ADD_AUDIT_ENTRY':
      return { ...state, audit_log: [...state.audit_log, action.payload] };
    
    // Violation
    case 'REPORT_VIOLATION':
      return { ...state, violations: [...state.violations, action.payload] };
    
    case 'RESOLVE_VIOLATION':
      return {
        ...state,
        violations: state.violations.map(v =>
          v.id === action.payload.violationId
            ? { ...v, resolution: action.payload.resolution, resolved_at: new Date().toISOString() }
            : v
        ),
      };
    
    // UI
    case 'SET_LOADING':
      return { ...state, is_loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'RESET':
      return initialState;
    
    default:
      return state;
  }
}

interface ContextValue {
  state: GovernanceState;
  
  // Session
  createSession: (sphere: string, participants: string[]) => void;
  startRecording: () => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  finalizeSession: () => void;
  toggleLayer: (layer: CaptureLayer) => void;
  grantParticipantConsent: (participantId: string) => void;
  
  // Override
  triggerOverride: (level: OverrideLevel, reason: string, scope?: HumanOverride['scope']) => void;
  resolveOverride: (overrideId: string) => void;
  
  // Violation
  reportViolation: (law: TreeLawId, severity: ViolationSeverity, actor: string, description: string) => void;
  
  // Audit
  logAction: (type: AuditEntryType, action: string, target: string, context?: Record<string, any>) => void;
  
  // Query
  getPendingViolations: () => Violation[];
  getAuditTrail: (limit?: number) => AuditEntry[];
  
  reset: () => void;
}

const Context = createContext<ContextValue | null>(null);

export function GovernanceProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  const createSessionFn = useCallback((sphere: string, participants: string[]) => {
    dispatch({ type: 'CREATE_SESSION', payload: { createdBy: 'current_user', sphere, participants } });
  }, []);
  
  const startRecordingFn = useCallback(() => {
    dispatch({ type: 'START_RECORDING' });
    dispatch({ type: 'ADD_AUDIT_ENTRY', payload: createAuditEntry('system_event', 'system', 'recording_started', 'session') });
  }, []);
  
  const pauseRecordingFn = useCallback(() => {
    dispatch({ type: 'PAUSE_RECORDING' });
    dispatch({ type: 'ADD_AUDIT_ENTRY', payload: createAuditEntry('system_event', 'system', 'recording_paused', 'session') });
  }, []);
  
  const resumeRecordingFn = useCallback(() => {
    dispatch({ type: 'RESUME_RECORDING' });
    dispatch({ type: 'ADD_AUDIT_ENTRY', payload: createAuditEntry('system_event', 'system', 'recording_resumed', 'session') });
  }, []);
  
  const finalizeSessionFn = useCallback(() => {
    dispatch({ type: 'FINALIZE_SESSION' });
    dispatch({ type: 'ADD_AUDIT_ENTRY', payload: createAuditEntry('system_event', 'system', 'session_finalized', 'session') });
  }, []);
  
  const toggleLayerFn = useCallback((layer: CaptureLayer) => {
    dispatch({ type: 'TOGGLE_LAYER', payload: layer });
  }, []);
  
  const grantParticipantConsentFn = useCallback((participantId: string) => {
    dispatch({ type: 'GRANT_PARTICIPANT_CONSENT', payload: participantId });
    dispatch({ type: 'ADD_AUDIT_ENTRY', payload: createAuditEntry('consent_change', participantId, 'consent_granted', 'session') });
  }, []);
  
  const triggerOverrideFn = useCallback((level: OverrideLevel, reason: string, scope: HumanOverride['scope'] = {}) => {
    const override = createOverride(level, 'current_user', reason, scope);
    dispatch({ type: 'TRIGGER_OVERRIDE', payload: override });
    dispatch({ type: 'ADD_AUDIT_ENTRY', payload: createAuditEntry('override_event', 'current_user', `override_${level}`, 'system', { reason }) });
  }, []);
  
  const resolveOverrideFn = useCallback((overrideId: string) => {
    dispatch({ type: 'RESOLVE_OVERRIDE', payload: { overrideId, resolvedBy: 'current_user' } });
  }, []);
  
  const reportViolationFn = useCallback((law: TreeLawId, severity: ViolationSeverity, actor: string, description: string) => {
    const violation = createViolation(law, severity, 'constitutional_guardian', actor, description);
    dispatch({ type: 'REPORT_VIOLATION', payload: violation });
    dispatch({ type: 'ADD_AUDIT_ENTRY', payload: createAuditEntry('system_event', 'constitutional_guardian', `violation_law_${law}`, actor, { severity, description }) });
  }, []);
  
  const logActionFn = useCallback((type: AuditEntryType, action: string, target: string, context: Record<string, any> = {}) => {
    dispatch({ type: 'ADD_AUDIT_ENTRY', payload: createAuditEntry(type, 'current_user', action, target, context) });
  }, []);
  
  const getPendingViolationsFn = useCallback(() => {
    return state.violations.filter(v => v.resolution === 'pending');
  }, [state.violations]);
  
  const getAuditTrailFn = useCallback((limit?: number) => {
    const sorted = [...state.audit_log].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return limit ? sorted.slice(0, limit) : sorted;
  }, [state.audit_log]);
  
  const resetFn = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);
  
  return (
    <Context.Provider value={{
      state,
      createSession: createSessionFn,
      startRecording: startRecordingFn,
      pauseRecording: pauseRecordingFn,
      resumeRecording: resumeRecordingFn,
      finalizeSession: finalizeSessionFn,
      toggleLayer: toggleLayerFn,
      grantParticipantConsent: grantParticipantConsentFn,
      triggerOverride: triggerOverrideFn,
      resolveOverride: resolveOverrideFn,
      reportViolation: reportViolationFn,
      logAction: logActionFn,
      getPendingViolations: getPendingViolationsFn,
      getAuditTrail: getAuditTrailFn,
      reset: resetFn,
    }}>
      {children}
    </Context.Provider>
  );
}

export function useGovernance() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error('useGovernance must be used within GovernanceProvider');
  return ctx;
}

export { Context as GovernanceContext };
