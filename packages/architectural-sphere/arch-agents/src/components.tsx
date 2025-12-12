/**
 * CHE·NU — ARCHITECTURAL AGENT SYSTEM
 * React UI Components
 */

import React, { useState, CSSProperties } from 'react';
import { useAgentSystem } from './AgentSystemContext';
import {
  ArchitecturalAgentId,
  AgentState,
  RequestType,
  AGENT_DEFINITIONS,
} from './types';

// ============================================================
// STYLES
// ============================================================

const styles: Record<string, CSSProperties> = {
  container: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    padding: 20,
    maxWidth: 900,
  },
  card: {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 600,
    color: '#1f2937',
    margin: 0,
  },
  button: {
    padding: '8px 16px',
    fontSize: 13,
    fontWeight: 500,
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  buttonPrimary: {
    background: '#8B5CF6',
    color: '#fff',
  },
  buttonSecondary: {
    background: '#e5e7eb',
    color: '#374151',
  },
  buttonDanger: {
    background: '#EF4444',
    color: '#fff',
  },
  badge: {
    display: 'inline-block',
    padding: '2px 8px',
    fontSize: 11,
    fontWeight: 500,
    borderRadius: 12,
    marginRight: 6,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 12,
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    fontSize: 14,
    border: '1px solid #d1d5db',
    borderRadius: 6,
    outline: 'none',
    boxSizing: 'border-box' as const,
  },
  select: {
    width: '100%',
    padding: '8px 12px',
    fontSize: 14,
    border: '1px solid #d1d5db',
    borderRadius: 6,
    background: '#fff',
  },
  label: {
    display: 'block',
    fontSize: 12,
    fontWeight: 500,
    color: '#374151',
    marginBottom: 4,
  },
  formGroup: {
    marginBottom: 12,
  },
};

// ============================================================
// STATE BADGE
// ============================================================

function StateBadge({ state }: { state: AgentState }) {
  const colors: Record<AgentState, { bg: string; text: string }> = {
    off: { bg: '#F3F4F6', text: '#6B7280' },
    activating: { bg: '#FEF3C7', text: '#D97706' },
    active: { bg: '#D1FAE5', text: '#059669' },
    processing: { bg: '#DBEAFE', text: '#2563EB' },
    exporting: { bg: '#E9D5FF', text: '#7C3AED' },
    deactivating: { bg: '#FEE2E2', text: '#DC2626' },
  };
  
  const { bg, text } = colors[state] || colors.off;
  
  return (
    <span style={{ ...styles.badge, background: bg, color: text }}>
      {state.toUpperCase()}
    </span>
  );
}

// ============================================================
// AGENT CARD
// ============================================================

interface AgentCardProps {
  id: ArchitecturalAgentId;
  state: AgentState;
  compact?: boolean;
}

export function AgentCard({ id, state, compact = false }: AgentCardProps) {
  const def = AGENT_DEFINITIONS[id];
  
  if (compact) {
    return (
      <div style={{
        background: '#fff',
        border: `2px solid ${state === 'off' ? '#e5e7eb' : def.color}`,
        borderRadius: 8,
        padding: 12,
        textAlign: 'center',
      }}>
        <div style={{
          width: 36,
          height: 36,
          margin: '0 auto 8px',
          borderRadius: '50%',
          background: def.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: 14,
          opacity: state === 'off' ? 0.5 : 1,
        }}>
          {def.name.charAt(0)}
        </div>
        <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4 }}>{def.name}</div>
        <StateBadge state={state} />
      </div>
    );
  }
  
  return (
    <div style={{
      ...styles.card,
      borderLeft: `4px solid ${def.color}`,
      opacity: state === 'off' ? 0.7 : 1,
    }}>
      <div style={styles.header}>
        <div>
          <h3 style={{ ...styles.title, color: def.color }}>{def.name}</h3>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: '#6B7280' }}>{def.role}</p>
        </div>
        <StateBadge state={state} />
      </div>
      
      <div style={{ display: 'flex', gap: 16, fontSize: 11 }}>
        <div>
          <strong>Inputs:</strong> {def.inputs.join(', ')}
        </div>
        <div>
          <strong>Outputs:</strong> {def.outputs.join(', ')}
        </div>
      </div>
      
      <div style={{
        marginTop: 8,
        padding: 8,
        background: '#FEF2F2',
        borderRadius: 4,
        fontSize: 10,
        color: '#991B1B',
      }}>
        <strong>⛔ Limits:</strong> {def.limits.join(' • ')}
      </div>
    </div>
  );
}

// ============================================================
// AGENT GRID
// ============================================================

export function AgentGrid() {
  const { state } = useAgentSystem();
  
  const agents: ArchitecturalAgentId[] = [
    'AGENT_ARCHITECT_PLANNER',
    'AGENT_DECOR_DESIGNER',
    'AGENT_AVATAR_ARCHITECT',
    'AGENT_NAVIGATION_DESIGNER',
    'AGENT_DOMAIN_ADAPTER',
    'AGENT_VALIDATION_GUARD',
  ];
  
  return (
    <div style={styles.card}>
      <h3 style={{ ...styles.title, marginBottom: 12 }}>Architectural Agents</h3>
      <div style={styles.grid}>
        {agents.map(id => (
          <AgentCard key={id} id={id} state={state.agentStates[id]} compact />
        ))}
      </div>
    </div>
  );
}

// ============================================================
// ORCHESTRATOR STATUS
// ============================================================

export function OrchestratorStatus() {
  const { state, deactivate } = useAgentSystem();
  
  return (
    <div style={{
      ...styles.card,
      background: state.orchestratorState === 'off' ? '#F9FAFB' : '#F5F3FF',
      borderColor: state.orchestratorState === 'off' ? '#e5e7eb' : '#8B5CF6',
    }}>
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: '#8B5CF6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 'bold',
            opacity: state.orchestratorState === 'off' ? 0.5 : 1,
          }}>
            ORCH
          </div>
          <div>
            <h3 style={styles.title}>Orchestrator</h3>
            <p style={{ margin: '2px 0 0', fontSize: 12, color: '#6B7280' }}>
              Coordinates all architectural agents
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <StateBadge state={state.orchestratorState} />
          {state.orchestratorState !== 'off' && (
            <button
              style={{ ...styles.button, ...styles.buttonDanger }}
              onClick={deactivate}
            >
              Deactivate
            </button>
          )}
        </div>
      </div>
      
      {state.isProcessing && (
        <div style={{
          background: '#DBEAFE',
          borderRadius: 4,
          padding: 8,
          fontSize: 12,
          color: '#1E40AF',
        }}>
          ⏳ Processing request...
        </div>
      )}
      
      {state.error && (
        <div style={{
          background: '#FEE2E2',
          borderRadius: 4,
          padding: 8,
          fontSize: 12,
          color: '#991B1B',
          marginTop: 8,
        }}>
          ❌ {state.error}
        </div>
      )}
    </div>
  );
}

// ============================================================
// REQUEST FORM
// ============================================================

export function RequestForm() {
  const { process, createRequest, state } = useAgentSystem();
  
  const [type, setType] = useState<RequestType>('full');
  const [domain, setDomain] = useState('xr');
  const [purpose, setPurpose] = useState('Meeting Room');
  const [capacity, setCapacity] = useState(10);
  const [theme, setTheme] = useState('neutral');
  const [dimension, setDimension] = useState<'2d' | '3d' | 'xr'>('3d');
  
  const handleSubmit = async () => {
    const request = createRequest(type, domain, purpose, {
      capacity,
      theme,
      dimension,
    });
    
    try {
      await process(request);
    } catch (e) {
      // Error handled by context
    }
  };
  
  return (
    <div style={styles.card}>
      <h3 style={{ ...styles.title, marginBottom: 16 }}>Design Request</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Request Type</label>
          <select
            style={styles.select}
            value={type}
            onChange={e => setType(e.target.value as RequestType)}
          >
            <option value="full">Full Design</option>
            <option value="space">Space Only</option>
            <option value="visual">Visual Only</option>
            <option value="avatar">Avatar Only</option>
            <option value="navigation">Navigation Only</option>
          </select>
        </div>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>Domain</label>
          <select
            style={styles.select}
            value={domain}
            onChange={e => setDomain(e.target.value)}
          >
            <option value="xr">XR / Immersive</option>
            <option value="business">Business</option>
            <option value="scholar">Scholar</option>
            <option value="creative">Creative</option>
            <option value="personal">Personal</option>
          </select>
        </div>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>Purpose</label>
          <input
            style={styles.input}
            value={purpose}
            onChange={e => setPurpose(e.target.value)}
            placeholder="Meeting Room"
          />
        </div>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>Capacity</label>
          <input
            style={styles.input}
            type="number"
            value={capacity}
            onChange={e => setCapacity(parseInt(e.target.value) || 10)}
          />
        </div>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>Theme</label>
          <select
            style={styles.select}
            value={theme}
            onChange={e => setTheme(e.target.value)}
          >
            <option value="neutral">Neutral</option>
            <option value="organic">Organic</option>
            <option value="cosmic">Cosmic</option>
            <option value="focus">Focus</option>
            <option value="warm">Warm</option>
          </select>
        </div>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>Dimension</label>
          <select
            style={styles.select}
            value={dimension}
            onChange={e => setDimension(e.target.value as any)}
          >
            <option value="2d">2D</option>
            <option value="3d">3D</option>
            <option value="xr">XR</option>
          </select>
        </div>
      </div>
      
      <button
        style={{
          ...styles.button,
          ...styles.buttonPrimary,
          width: '100%',
          marginTop: 8,
          opacity: state.isProcessing ? 0.7 : 1,
        }}
        onClick={handleSubmit}
        disabled={state.isProcessing}
      >
        {state.isProcessing ? '⏳ Processing...' : '🚀 Generate Design'}
      </button>
    </div>
  );
}

// ============================================================
// BUNDLE VIEWER
// ============================================================

export function BundleViewer() {
  const { state } = useAgentSystem();
  const bundle = state.currentBundle;
  
  if (!bundle) {
    return (
      <div style={{ ...styles.card, textAlign: 'center', color: '#6B7280' }}>
        No bundle generated yet. Submit a design request to create one.
      </div>
    );
  }
  
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h3 style={styles.title}>Generated Bundle</h3>
        <span style={{
          ...styles.badge,
          background: bundle.validation.passed ? '#D1FAE5' : '#FEE2E2',
          color: bundle.validation.passed ? '#059669' : '#DC2626',
        }}>
          {bundle.validation.passed ? '✓ VALID' : '✗ INVALID'}
        </span>
      </div>
      
      <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 12 }}>
        <strong>ID:</strong> {bundle.bundle_id} | 
        <strong> Status:</strong> {bundle.status} |
        <strong> Created:</strong> {new Date(bundle.created_at).toLocaleString()}
      </div>
      
      <div style={styles.grid}>
        <div style={{ background: '#F3F4F6', borderRadius: 6, padding: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#6B7280' }}>Plans</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#3B82F6' }}>
            {bundle.plans.length}
          </div>
        </div>
        <div style={{ background: '#F3F4F6', borderRadius: 6, padding: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#6B7280' }}>Decors</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#10B981' }}>
            {bundle.decors.length}
          </div>
        </div>
        <div style={{ background: '#F3F4F6', borderRadius: 6, padding: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#6B7280' }}>Avatars</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#EC4899' }}>
            {bundle.avatars.length}
          </div>
        </div>
        <div style={{ background: '#F3F4F6', borderRadius: 6, padding: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#6B7280' }}>Navigation</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#06B6D4' }}>
            {bundle.navigation.length}
          </div>
        </div>
      </div>
      
      {bundle.validation.errors && bundle.validation.errors.length > 0 && (
        <div style={{
          marginTop: 12,
          padding: 8,
          background: '#FEE2E2',
          borderRadius: 4,
          fontSize: 11,
          color: '#991B1B',
        }}>
          <strong>Errors:</strong> {bundle.validation.errors.join(', ')}
        </div>
      )}
      
      <details style={{ marginTop: 12 }}>
        <summary style={{ cursor: 'pointer', fontSize: 12, color: '#6B7280' }}>
          View Raw Bundle
        </summary>
        <pre style={{
          background: '#F9FAFB',
          padding: 12,
          borderRadius: 4,
          fontSize: 10,
          overflow: 'auto',
          maxHeight: 300,
        }}>
          {JSON.stringify(bundle, null, 2)}
        </pre>
      </details>
    </div>
  );
}

// ============================================================
// LOG VIEWER
// ============================================================

export function LogViewer() {
  const { state, clearLogs } = useAgentSystem();
  
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h3 style={styles.title}>Activity Log</h3>
        <button
          style={{ ...styles.button, ...styles.buttonSecondary, padding: '4px 12px', fontSize: 11 }}
          onClick={clearLogs}
        >
          Clear
        </button>
      </div>
      
      <div style={{
        background: '#1F2937',
        borderRadius: 6,
        padding: 12,
        maxHeight: 200,
        overflow: 'auto',
        fontFamily: 'monospace',
        fontSize: 11,
        color: '#D1D5DB',
      }}>
        {state.logs.length === 0 ? (
          <span style={{ color: '#6B7280' }}>No activity yet...</span>
        ) : (
          state.logs.map((log, i) => (
            <div key={i} style={{ marginBottom: 4 }}>{log}</div>
          ))
        )}
      </div>
    </div>
  );
}

// ============================================================
// FULL DASHBOARD
// ============================================================

export function AgentSystemDashboard() {
  return (
    <div style={styles.container}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4, color: '#1F2937' }}>
        🏛️ Architectural Agent System
      </h1>
      <p style={{ color: '#6B7280', marginBottom: 20 }}>
        Design space, decor, avatars, and navigation — without influencing logic or decisions.
      </p>
      
      <OrchestratorStatus />
      <AgentGrid />
      <RequestForm />
      <BundleViewer />
      <LogViewer />
    </div>
  );
}

// ============================================================
// EXPORTS
// ============================================================

export {
  StateBadge,
  AgentCard,
  AgentGrid,
  OrchestratorStatus,
  RequestForm,
  BundleViewer,
  LogViewer,
  AgentSystemDashboard,
};
