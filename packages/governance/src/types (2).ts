/**
 * CHE·NU — XR SESSION RECORDING + CONSTITUTIONAL GOVERNANCE
 * Types & Interfaces - XR.v1.6 + GOV.v1.0
 * 
 * Recording = CAPTURE, not surveillance
 * Governance = PROTECTION, not control
 * THE THREE TREE LAWS ARE IMMUTABLE
 */

// ============================================================
// THE THREE TREE LAWS (IMMUTABLE)
// ============================================================

export const TREE_LAWS = {
  LAW_1: {
    id: 1,
    name: 'Human Agency',
    icon: '🌳',
    principle: 'Human agency ALWAYS preserved',
    enforcement: 'Veto rights, override controls',
    immutable: true,
  },
  LAW_2: {
    id: 2,
    name: 'No Manipulation',
    icon: '🛡️',
    principle: 'NO dark patterns, NO manipulation',
    enforcement: 'Pattern detection, blocking',
    immutable: true,
  },
  LAW_3: {
    id: 3,
    name: 'Full Transparency',
    icon: '👁️',
    principle: 'Full transparency, audit trails',
    enforcement: 'Complete logging, access',
    immutable: true,
  },
} as const;

export type TreeLawId = 1 | 2 | 3;

// ============================================================
// SESSION RECORDING
// ============================================================

export type RecordingState = 'idle' | 'recording' | 'paused' | 'finalized';

export type CaptureLayer = 'spatial' | 'audio' | 'artifacts' | 'events' | 'agent_trace';

export interface SessionParticipant {
  id: string;
  name: string;
  consent: boolean;
  consent_at?: string;
  role: 'host' | 'participant' | 'observer';
}

export interface XRSession {
  id: string;
  state: RecordingState;
  started_at: string;
  ended_at?: string;
  paused_intervals: { start: string; end: string }[];
  participants: SessionParticipant[];
  layers: Record<CaptureLayer, boolean>;
  sphere: string;
  hash?: string;  // Set on finalization
  integrity: 'pending' | 'verified' | 'failed';
  created_by: string;
}

// ============================================================
// HUMAN OVERRIDE
// ============================================================

export type OverrideLevel = 'session_pause' | 'agent_halt' | 'system_stop' | 'full_reset';

export interface HumanOverride {
  id: string;
  level: OverrideLevel;
  triggered_by: string;
  reason: string;
  timestamp: string;
  scope: {
    agent_ids?: string[];
    session_id?: string;
    global?: boolean;
  };
  reversible: boolean;
  resolved: boolean;
  resolved_at?: string;
  resolved_by?: string;
}

// ============================================================
// CONSENT
// ============================================================

export type ConsentType = 'session' | 'feature' | 'data' | 'recording' | 'sharing';

export interface Consent {
  id: string;
  type: ConsentType;
  user_id: string;
  scope: string;
  granted: boolean;
  granted_at?: string;
  revoked_at?: string;
  expires_at?: string;
  explanation_shown: boolean;
}

// ============================================================
// AUDIT TRAIL
// ============================================================

export type AuditEntryType = 'user_action' | 'agent_action' | 'system_event' | 'consent_change' | 'override_event';

export interface AuditEntry {
  id: string;
  type: AuditEntryType;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  context: Record<string, any>;
  hash: string;
  immutable: true;
}

// ============================================================
// VIOLATION
// ============================================================

export type ViolationSeverity = 'warning' | 'minor' | 'major' | 'critical';

export interface Violation {
  id: string;
  law_violated: TreeLawId;
  severity: ViolationSeverity;
  detected_by: string;
  actor: string;
  description: string;
  action_blocked: boolean;
  escalated_to?: string;
  resolution: 'pending' | 'resolved' | 'dismissed';
  resolved_at?: string;
  timestamp: string;
}

// ============================================================
// GOVERNANCE AGENTS
// ============================================================

export type GovernanceAgentType = 'constitutional_guardian' | 'audit_keeper' | 'consent_validator' | 'transparency_enforcer';

export interface GovernanceAgent {
  type: GovernanceAgentType;
  name: string;
  icon: string;
  role: string;
  power: string;
  active: boolean;
}

// ============================================================
// COMBINED STATE
// ============================================================

export interface GovernanceState {
  // Recording
  current_session: XRSession | null;
  sessions_history: XRSession[];
  
  // Governance
  overrides: HumanOverride[];
  active_override: HumanOverride | null;
  consents: Consent[];
  audit_log: AuditEntry[];
  violations: Violation[];
  
  // Agents
  governance_agents: GovernanceAgent[];
  
  // UI
  is_recording: boolean;
  recording_indicator_visible: boolean;
  is_loading: boolean;
  error: string | null;
}
