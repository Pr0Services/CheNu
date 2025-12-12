/**
 * CHE·NU — CONSTITUTIONAL GOVERNANCE
 * React Components
 */

import React, { useState, CSSProperties } from 'react';
import { useGovernance } from './GovernanceContext';
import { RECORDING_STATES, CAPTURE_LAYERS, OVERRIDE_LEVELS, VIOLATION_RESPONSES, GOVERNANCE_AGENTS } from './presets';
import { TREE_LAWS, CaptureLayer, OverrideLevel, ViolationSeverity, TreeLawId } from './types';

const styles: Record<string, CSSProperties> = {
  container: { fontFamily: 'system-ui, sans-serif', padding: 20, maxWidth: 1100, margin: '0 auto' },
  card: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, marginBottom: 16 },
  title: { fontSize: 16, fontWeight: 600, color: '#1f2937', margin: '0 0 12px 0' },
  button: { padding: '8px 16px', fontSize: 13, fontWeight: 500, border: 'none', borderRadius: 8, cursor: 'pointer' },
};

// Tree Laws Display
export function TreeLawsPanel() {
  const laws = Object.values(TREE_LAWS);
  const colors = ['#10B981', '#7C3AED', '#F59E0B'];
  
  return (
    <div style={styles.card}>
      <h3 style={styles.title}>🌳 The Three Tree Laws (IMMUTABLE)</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {laws.map((law, i) => (
          <div key={law.id} style={{ padding: 16, background: colors[i], borderRadius: 10, color: '#fff' }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{law.icon}</div>
            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 4 }}>LAW {law.id}: {law.name}</div>
            <div style={{ fontSize: 10, opacity: 0.9 }}>{law.principle}</div>
            <div style={{ fontSize: 9, marginTop: 6, opacity: 0.8 }}>⚡ {law.enforcement}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Session Recording Panel
export function SessionRecordingPanel() {
  const { state, createSession, startRecording, pauseRecording, resumeRecording, finalizeSession, toggleLayer, grantParticipantConsent } = useGovernance();
  const session = state.current_session;
  
  const handleCreate = () => {
    createSession('business', ['participant_1', 'participant_2']);
  };
  
  if (!session) {
    return (
      <div style={styles.card}>
        <h3 style={styles.title}>🎬 XR Session Recording</h3>
        <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 12 }}>Recording = CAPTURE, not surveillance</p>
        <button style={{ ...styles.button, background: '#EF4444', color: '#fff', width: '100%' }} onClick={handleCreate}>
          Create New Session
        </button>
      </div>
    );
  }
  
  const stateConfig = RECORDING_STATES.find(s => s.state === session.state)!;
  const allConsent = session.participants.every(p => p.consent);
  
  return (
    <div style={styles.card}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 style={{ ...styles.title, margin: 0 }}>🎬 Session Recording</h3>
        <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: stateConfig.color, color: '#fff' }}>
          {stateConfig.icon} {stateConfig.name.toUpperCase()}
        </span>
      </div>
      
      {/* Recording Indicator */}
      {state.recording_indicator_visible && (
        <div style={{ padding: 10, background: '#FEE2E2', borderRadius: 8, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20, animation: 'pulse 1s infinite' }}>🔴</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#DC2626' }}>RECORDING IN PROGRESS</span>
        </div>
      )}
      
      {/* Participants Consent */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 6 }}>Participant Consent</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {session.participants.map(p => (
            <div key={p.id} style={{ padding: 8, background: p.consent ? '#D1FAE5' : '#FEE2E2', borderRadius: 6, flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: 10, fontWeight: 600 }}>{p.id}</div>
              {p.consent ? (
                <span style={{ fontSize: 9, color: '#059669' }}>✓ Consented</span>
              ) : (
                <button onClick={() => grantParticipantConsent(p.id)}
                  style={{ ...styles.button, fontSize: 9, padding: '2px 8px', background: '#10B981', color: '#fff', marginTop: 4 }}>
                  Grant
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Capture Layers */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 6 }}>Capture Layers</div>
        <div style={{ display: 'flex', gap: 6 }}>
          {CAPTURE_LAYERS.map(l => (
            <button key={l.layer} onClick={() => toggleLayer(l.layer)}
              style={{ ...styles.button, flex: 1, fontSize: 10, padding: '6px 4px',
                background: session.layers[l.layer] ? '#7C3AED' : '#f3f4f6',
                color: session.layers[l.layer] ? '#fff' : '#374151' }}>
              {l.icon} {l.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Controls */}
      <div style={{ display: 'flex', gap: 8 }}>
        {session.state === 'idle' && (
          <button onClick={startRecording} disabled={!allConsent}
            style={{ ...styles.button, flex: 1, background: allConsent ? '#EF4444' : '#9CA3AF', color: '#fff' }}>
            🔴 Start Recording
          </button>
        )}
        {session.state === 'recording' && (
          <button onClick={pauseRecording} style={{ ...styles.button, flex: 1, background: '#F59E0B', color: '#fff' }}>
            ⏸️ Pause
          </button>
        )}
        {session.state === 'paused' && (
          <button onClick={resumeRecording} style={{ ...styles.button, flex: 1, background: '#EF4444', color: '#fff' }}>
            🔴 Resume
          </button>
        )}
        {(session.state === 'recording' || session.state === 'paused') && (
          <button onClick={finalizeSession} style={{ ...styles.button, flex: 1, background: '#10B981', color: '#fff' }}>
            ✅ Finalize
          </button>
        )}
      </div>
      
      {state.error && (
        <div style={{ marginTop: 8, padding: 8, background: '#FEE2E2', borderRadius: 6, fontSize: 11, color: '#DC2626' }}>
          ⚠️ {state.error}
        </div>
      )}
    </div>
  );
}

// Human Override Panel
export function HumanOverridePanel() {
  const { state, triggerOverride, resolveOverride } = useGovernance();
  const [selectedLevel, setSelectedLevel] = useState<OverrideLevel>('session_pause');
  const [reason, setReason] = useState('');
  
  const handleTrigger = () => {
    if (!reason.trim()) { alert('Reason required!'); return; }
    triggerOverride(selectedLevel, reason);
    setReason('');
  };
  
  return (
    <div style={styles.card}>
      <h3 style={styles.title}>⚡ Human Override System</h3>
      <p style={{ fontSize: 10, color: '#6b7280', marginBottom: 12 }}>Humans ALWAYS have final authority</p>
      
      {state.active_override && (
        <div style={{ padding: 12, background: '#FEF3C7', borderRadius: 8, marginBottom: 12, border: '2px solid #F59E0B' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#92400E' }}>⚠️ ACTIVE OVERRIDE</div>
          <div style={{ fontSize: 11, color: '#78350F' }}>Level: {state.active_override.level.toUpperCase()}</div>
          <div style={{ fontSize: 10, color: '#92400E' }}>Reason: {state.active_override.reason}</div>
          <button onClick={() => resolveOverride(state.active_override!.id)}
            style={{ ...styles.button, marginTop: 8, background: '#10B981', color: '#fff', fontSize: 10 }}>
            ✓ Resolve Override
          </button>
        </div>
      )}
      
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 11, color: '#6b7280', display: 'block', marginBottom: 4 }}>Override Level</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
          {OVERRIDE_LEVELS.map(o => (
            <button key={o.level} onClick={() => setSelectedLevel(o.level)}
              style={{ padding: 8, borderRadius: 6, border: 'none', cursor: 'pointer', textAlign: 'center',
                background: selectedLevel === o.level ? '#7C3AED' : '#f3f4f6',
                color: selectedLevel === o.level ? '#fff' : '#374151' }}>
              <div style={{ fontSize: 10, fontWeight: 600 }}>{o.name}</div>
              <div style={{ fontSize: 8, opacity: 0.8 }}>{o.scope}</div>
            </button>
          ))}
        </div>
      </div>
      
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 11, color: '#6b7280', display: 'block', marginBottom: 4 }}>Reason (Required)</label>
        <input type="text" value={reason} onChange={e => setReason(e.target.value)} placeholder="Why are you triggering this override?"
          style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #e5e7eb' }} />
      </div>
      
      <button onClick={handleTrigger} style={{ ...styles.button, background: '#DC2626', color: '#fff', width: '100%' }}>
        ⚡ Trigger Override
      </button>
    </div>
  );
}

// Violations Panel
export function ViolationsPanel() {
  const { state, reportViolation, getPendingViolations } = useGovernance();
  const pending = getPendingViolations();
  
  const handleDemo = () => {
    reportViolation(2, 'minor', 'agent_123', 'Attempted dark pattern in suggestion display');
  };
  
  return (
    <div style={styles.card}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 style={{ ...styles.title, margin: 0 }}>🚨 Violations ({pending.length} pending)</h3>
        <button onClick={handleDemo} style={{ ...styles.button, fontSize: 10, padding: '4px 10px', background: '#EF4444', color: '#fff' }}>
          + Demo Violation
        </button>
      </div>
      
      {pending.length === 0 ? (
        <div style={{ padding: 20, textAlign: 'center', color: '#10B981', fontSize: 12 }}>✓ No pending violations</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 200, overflowY: 'auto' }}>
          {pending.map(v => (
            <div key={v.id} style={{ padding: 10, background: '#FEE2E2', borderRadius: 6, border: '1px solid #FECACA' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#DC2626' }}>LAW {v.law_violated} VIOLATION</span>
                <span style={{ fontSize: 9, padding: '2px 6px', background: '#DC2626', color: '#fff', borderRadius: 4 }}>{v.severity.toUpperCase()}</span>
              </div>
              <div style={{ fontSize: 10, color: '#7F1D1D', marginTop: 4 }}>{v.description}</div>
              <div style={{ fontSize: 9, color: '#991B1B', marginTop: 2 }}>Actor: {v.actor} | Blocked: {v.action_blocked ? '✓' : '✗'}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Audit Trail Panel
export function AuditTrailPanel() {
  const { getAuditTrail } = useGovernance();
  const entries = getAuditTrail(10);
  
  return (
    <div style={styles.card}>
      <h3 style={styles.title}>📜 Audit Trail (Last 10)</h3>
      <p style={{ fontSize: 10, color: '#6b7280', marginBottom: 12 }}>Every action logged. Nothing hidden.</p>
      
      {entries.length === 0 ? (
        <div style={{ padding: 20, textAlign: 'center', color: '#9CA3AF', fontSize: 12 }}>No audit entries yet</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 250, overflowY: 'auto' }}>
          {entries.map(e => (
            <div key={e.id} style={{ padding: 8, background: '#f9fafb', borderRadius: 4, border: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: '#374151' }}>{e.action}</span>
                <span style={{ fontSize: 8, color: '#6b7280' }}>{new Date(e.timestamp).toLocaleTimeString()}</span>
              </div>
              <div style={{ fontSize: 9, color: '#6b7280' }}>
                {e.type} | Actor: {e.actor} | Target: {e.target}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Governance Agents Panel
export function GovernanceAgentsPanel() {
  return (
    <div style={styles.card}>
      <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>⚖️ Governance Agents</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {GOVERNANCE_AGENTS.map(agent => (
          <div key={agent.type} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 8, background: '#EDE9FE', borderRadius: 6 }}>
            <span style={{ fontSize: 20 }}>{agent.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 600 }}>{agent.name}</div>
              <div style={{ fontSize: 9, color: '#6b7280' }}>{agent.role}</div>
            </div>
            <span style={{ fontSize: 8, color: '#7C3AED', fontWeight: 600 }}>⚡ {agent.power}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Full Dashboard
export function GovernanceDashboard() {
  return (
    <div style={styles.container}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>⚖️ CHE·NU Constitutional Governance</h1>
      <p style={{ color: '#6b7280', marginBottom: 20 }}>Recording = CAPTURE • Governance = PROTECTION • Tree Laws = IMMUTABLE</p>
      
      <TreeLawsPanel />
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <SessionRecordingPanel />
          <AuditTrailPanel />
        </div>
        <div>
          <HumanOverridePanel />
          <ViolationsPanel />
          <GovernanceAgentsPanel />
        </div>
      </div>
    </div>
  );
}
