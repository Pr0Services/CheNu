import {
  GovernanceAgent, XRSession, HumanOverride, Consent, AuditEntry, Violation,
  RecordingState, CaptureLayer, OverrideLevel, ConsentType, AuditEntryType, ViolationSeverity, TreeLawId,
} from './types';

export const GOVERNANCE_AGENTS: GovernanceAgent[] = [
  { type: 'constitutional_guardian', name: 'Constitutional Guardian', icon: '⚖️', role: 'Enforces Tree Laws', power: 'Veto any action', active: true },
  { type: 'audit_keeper', name: 'Audit Keeper', icon: '📜', role: 'Maintains audit trails', power: 'Full access logging', active: true },
  { type: 'consent_validator', name: 'Consent Validator', icon: '✅', role: 'Verifies permissions', power: 'Block unauthorized', active: true },
  { type: 'transparency_enforcer', name: 'Transparency Enforcer', icon: '👁️', role: 'Ensures visibility', power: 'Surface hidden actions', active: true },
];

export const RECORDING_STATES: { state: RecordingState; icon: string; name: string; color: string }[] = [
  { state: 'idle', icon: '⏹️', name: 'Idle', color: '#6B7280' },
  { state: 'recording', icon: '🔴', name: 'Recording', color: '#EF4444' },
  { state: 'paused', icon: '⏸️', name: 'Paused', color: '#F59E0B' },
  { state: 'finalized', icon: '✅', name: 'Finalized', color: '#10B981' },
];

export const CAPTURE_LAYERS: { layer: CaptureLayer; name: string; icon: string }[] = [
  { layer: 'spatial', name: 'Spatial', icon: '📍' },
  { layer: 'audio', name: 'Audio', icon: '🎤' },
  { layer: 'artifacts', name: 'Artifacts', icon: '📄' },
  { layer: 'events', name: 'Events', icon: '📊' },
  { layer: 'agent_trace', name: 'Agent Trace', icon: '🤖' },
];

export const OVERRIDE_LEVELS: { level: OverrideLevel; name: string; scope: string; severity: string }[] = [
  { level: 'session_pause', name: 'Session Pause', scope: 'Current session', severity: 'low' },
  { level: 'agent_halt', name: 'Agent Halt', scope: 'Specific agent', severity: 'medium' },
  { level: 'system_stop', name: 'System Stop', scope: 'All AI activity', severity: 'high' },
  { level: 'full_reset', name: 'Full Reset', scope: 'Return to neutral', severity: 'critical' },
];

export const VIOLATION_RESPONSES: { severity: ViolationSeverity; response: string; escalation: string }[] = [
  { severity: 'warning', response: 'Log + notify user', escalation: 'None' },
  { severity: 'minor', response: 'Block action + log', escalation: 'Review queue' },
  { severity: 'major', response: 'Halt agent + alert', escalation: 'Human review' },
  { severity: 'critical', response: 'System stop + lock', escalation: 'Immediate admin' },
];

// Factory functions
export function createSession(createdBy: string, sphere: string, participants: string[]): XRSession {
  return {
    id: `session_${Date.now()}`,
    state: 'idle',
    started_at: new Date().toISOString(),
    paused_intervals: [],
    participants: participants.map(p => ({ id: p, name: p, consent: false, role: 'participant' })),
    layers: { spatial: true, audio: false, artifacts: true, events: true, agent_trace: true },
    sphere,
    integrity: 'pending',
    created_by: createdBy,
  };
}

export function createOverride(level: OverrideLevel, triggeredBy: string, reason: string, scope: HumanOverride['scope']): HumanOverride {
  return {
    id: `override_${Date.now()}`,
    level,
    triggered_by: triggeredBy,
    reason,
    timestamp: new Date().toISOString(),
    scope,
    reversible: level !== 'full_reset',
    resolved: false,
  };
}

export function createAuditEntry(type: AuditEntryType, actor: string, action: string, target: string, context: Record<string, any> = {}): AuditEntry {
  const timestamp = Date.now();
  return {
    id: `audit_${timestamp}`,
    type,
    timestamp: new Date().toISOString(),
    actor,
    action,
    target,
    context,
    hash: `sha256_${timestamp}_${Math.random().toString(36).slice(2)}`,
    immutable: true,
  };
}

export function createViolation(lawViolated: TreeLawId, severity: ViolationSeverity, detectedBy: string, actor: string, description: string): Violation {
  return {
    id: `violation_${Date.now()}`,
    law_violated: lawViolated,
    severity,
    detected_by: detectedBy,
    actor,
    description,
    action_blocked: severity !== 'warning',
    resolution: 'pending',
    timestamp: new Date().toISOString(),
  };
}

export function createConsent(type: ConsentType, userId: string, scope: string): Consent {
  return {
    id: `consent_${Date.now()}`,
    type,
    user_id: userId,
    scope,
    granted: false,
    explanation_shown: false,
  };
}
