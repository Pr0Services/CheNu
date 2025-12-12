/* =========================================================
   CHE·NU — Debug Dashboard
   
   Observability panel for development and debugging.
   Shows real-time flow state, agent status, guard events,
   and process observations.
   
   📜 "Serve clarity, not control."
   ========================================================= */

import React, { useState, useMemo } from 'react';

/* -------------------------
   TYPES
------------------------- */

export type FlowStage =
  | 'user_intention'
  | 'parallel_analysis'
  | 'orchestration'
  | 'decision_clarification'
  | 'human_validation'
  | 'timeline_write'
  | 'return_to_neutral';

export type ConfidenceLevel = 'low' | 'medium' | 'high';

export interface AgentStatus {
  id: string;
  name: string;
  type: 'L0' | 'L1' | 'L2' | 'L3';
  confidence: ConfidenceLevel;
  summary: string;
  lastUpdate: number;
  active: boolean;
}

export interface GuardEvent {
  id: string;
  timestamp: number;
  rule: string;
  reason: string;
  severity: 'warning' | 'violation' | 'blocked';
}

export interface ProcessObservation {
  id: string;
  timestamp: number;
  note: string;
  source: string;
}

export interface DebugDashboardProps {
  currentStage: FlowStage;
  agents: AgentStatus[];
  guardEvents: GuardEvent[];
  observations: ProcessObservation[];
  sessionStart?: number;
  onClearEvents?: () => void;
  onRefresh?: () => void;
  collapsed?: boolean;
}

/* -------------------------
   CONSTANTS
------------------------- */

const STAGE_LABELS: Record<FlowStage, string> = {
  user_intention: 'User Intention',
  parallel_analysis: 'Parallel Analysis',
  orchestration: 'Orchestration',
  decision_clarification: 'Decision Clarification',
  human_validation: 'Human Validation',
  timeline_write: 'Timeline Write',
  return_to_neutral: 'Return to Neutral',
};

const STAGE_ORDER: FlowStage[] = [
  'user_intention',
  'parallel_analysis',
  'orchestration',
  'decision_clarification',
  'human_validation',
  'timeline_write',
];

const CONFIDENCE_COLORS: Record<ConfidenceLevel, string> = {
  low: '#ef4444',
  medium: '#f59e0b',
  high: '#10b981',
};

const SEVERITY_ICONS: Record<GuardEvent['severity'], string> = {
  warning: '⚠️',
  violation: '⛔',
  blocked: '🚫',
};

/* -------------------------
   STYLES
------------------------- */

const styles: Record<string, React.CSSProperties> = {
  dashboard: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    backgroundColor: '#0f172a',
    color: '#e2e8f0',
    borderRadius: '12px',
    padding: '16px',
    fontSize: '14px',
    maxWidth: '400px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    borderBottom: '1px solid #334155',
    paddingBottom: '12px',
  },
  title: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 600,
    color: '#38bdf8',
  },
  section: {
    marginBottom: '16px',
  },
  sectionTitle: {
    fontSize: '12px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    color: '#94a3b8',
    marginBottom: '8px',
    fontWeight: 600,
  },
  flowStages: {
    display: 'flex',
    gap: '4px',
    flexWrap: 'wrap' as const,
  },
  stageChip: {
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    backgroundColor: '#1e293b',
    color: '#64748b',
  },
  stageChipActive: {
    backgroundColor: '#0ea5e9',
    color: '#ffffff',
    fontWeight: 600,
  },
  stageChipCompleted: {
    backgroundColor: '#065f46',
    color: '#34d399',
  },
  agentCard: {
    backgroundColor: '#1e293b',
    borderRadius: '8px',
    padding: '10px',
    marginBottom: '8px',
  },
  agentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px',
  },
  agentName: {
    fontWeight: 600,
    color: '#f1f5f9',
  },
  agentLevel: {
    fontSize: '10px',
    backgroundColor: '#334155',
    padding: '2px 6px',
    borderRadius: '4px',
    color: '#94a3b8',
  },
  confidenceBadge: {
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: 500,
  },
  agentSummary: {
    fontSize: '12px',
    color: '#94a3b8',
    marginTop: '4px',
    lineHeight: 1.4,
  },
  guardEvent: {
    backgroundColor: '#1e293b',
    borderRadius: '6px',
    padding: '8px',
    marginBottom: '6px',
    borderLeft: '3px solid #ef4444',
  },
  guardWarning: {
    borderLeftColor: '#f59e0b',
  },
  guardBlocked: {
    borderLeftColor: '#dc2626',
  },
  observation: {
    fontSize: '12px',
    color: '#cbd5e1',
    padding: '4px 0',
    borderBottom: '1px solid #1e293b',
  },
  noData: {
    color: '#475569',
    fontStyle: 'italic',
    fontSize: '12px',
  },
  button: {
    backgroundColor: '#334155',
    color: '#e2e8f0',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    cursor: 'pointer',
  },
  timestamp: {
    fontSize: '10px',
    color: '#64748b',
  },
  sessionInfo: {
    fontSize: '11px',
    color: '#64748b',
    marginTop: '12px',
    borderTop: '1px solid #334155',
    paddingTop: '8px',
  },
};

/* -------------------------
   HELPER FUNCTIONS
------------------------- */

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('fr-CA', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
}

/* -------------------------
   SUB-COMPONENTS
------------------------- */

const FlowProgress: React.FC<{ currentStage: FlowStage }> = ({ currentStage }) => {
  const currentIndex = STAGE_ORDER.indexOf(currentStage);

  return (
    <div style={styles.flowStages}>
      {STAGE_ORDER.map((stage, index) => {
        const isActive = stage === currentStage;
        const isCompleted = index < currentIndex;

        const chipStyle = {
          ...styles.stageChip,
          ...(isActive ? styles.stageChipActive : {}),
          ...(isCompleted ? styles.stageChipCompleted : {}),
        };

        return (
          <span key={stage} style={chipStyle}>
            {isCompleted ? '✓' : ''} {STAGE_LABELS[stage]}
          </span>
        );
      })}
    </div>
  );
};

const AgentCard: React.FC<{ agent: AgentStatus }> = ({ agent }) => {
  const confidenceStyle = {
    ...styles.confidenceBadge,
    backgroundColor: `${CONFIDENCE_COLORS[agent.confidence]}20`,
    color: CONFIDENCE_COLORS[agent.confidence],
  };

  return (
    <div style={{
      ...styles.agentCard,
      opacity: agent.active ? 1 : 0.5,
    }}>
      <div style={styles.agentHeader}>
        <span style={styles.agentName}>
          {agent.active ? '🟢' : '⚪'} {agent.name}
        </span>
        <span style={styles.agentLevel}>{agent.type}</span>
      </div>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <span style={confidenceStyle}>{agent.confidence}</span>
        <span style={styles.timestamp}>{formatTime(agent.lastUpdate)}</span>
      </div>
      <p style={styles.agentSummary}>{agent.summary}</p>
    </div>
  );
};

const GuardEventCard: React.FC<{ event: GuardEvent }> = ({ event }) => {
  const eventStyle = {
    ...styles.guardEvent,
    ...(event.severity === 'warning' ? styles.guardWarning : {}),
    ...(event.severity === 'blocked' ? styles.guardBlocked : {}),
  };

  return (
    <div style={eventStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <strong>
          {SEVERITY_ICONS[event.severity]} {event.rule}
        </strong>
        <span style={styles.timestamp}>{formatTime(event.timestamp)}</span>
      </div>
      <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>
        {event.reason}
      </p>
    </div>
  );
};

/* -------------------------
   MAIN COMPONENT
------------------------- */

export const CheNuDebugDashboard: React.FC<DebugDashboardProps> = ({
  currentStage,
  agents,
  guardEvents,
  observations,
  sessionStart = Date.now(),
  onClearEvents,
  onRefresh,
  collapsed: initialCollapsed = false,
}) => {
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  const [activeTab, setActiveTab] = useState<'agents' | 'guards' | 'observations'>('agents');

  const sessionDuration = useMemo(() => {
    return formatDuration(Date.now() - sessionStart);
  }, [sessionStart]);

  const activeAgents = useMemo(() => {
    return agents.filter(a => a.active);
  }, [agents]);

  if (collapsed) {
    return (
      <div
        style={{
          ...styles.dashboard,
          padding: '8px 16px',
          cursor: 'pointer',
        }}
        onClick={() => setCollapsed(false)}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={styles.title}>🔧 CHE·NU Debug</span>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            {STAGE_LABELS[currentStage]} • {activeAgents.length} agents • {guardEvents.length} events
          </span>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.dashboard} className="chenu-debug-dashboard">
      {/* HEADER */}
      <div style={styles.header}>
        <h2 style={styles.title}>🔧 CHE·NU Debug Dashboard</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          {onRefresh && (
            <button style={styles.button} onClick={onRefresh}>
              🔄
            </button>
          )}
          <button style={styles.button} onClick={() => setCollapsed(true)}>
            ▼
          </button>
        </div>
      </div>

      {/* PANEL 1 — FLOW PROGRESS */}
      <section style={styles.section}>
        <h3 style={styles.sectionTitle}>Session Flow</h3>
        <FlowProgress currentStage={currentStage} />
      </section>

      {/* TAB NAVIGATION */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
        {(['agents', 'guards', 'observations'] as const).map(tab => (
          <button
            key={tab}
            style={{
              ...styles.button,
              backgroundColor: activeTab === tab ? '#0ea5e9' : '#334155',
              flex: 1,
            }}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'agents' && `Agents (${activeAgents.length})`}
            {tab === 'guards' && `Guards (${guardEvents.length})`}
            {tab === 'observations' && `Obs (${observations.length})`}
          </button>
        ))}
      </div>

      {/* PANEL 2 — AGENTS */}
      {activeTab === 'agents' && (
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>Agents (Parallel Work)</h3>
          {agents.length === 0 ? (
            <p style={styles.noData}>No agents active</p>
          ) : (
            agents.map(agent => <AgentCard key={agent.id} agent={agent} />)
          )}
        </section>
      )}

      {/* PANEL 3 — GUARDS */}
      {activeTab === 'guards' && (
        <section style={styles.section}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={styles.sectionTitle}>Guard Events</h3>
            {onClearEvents && guardEvents.length > 0 && (
              <button
                style={{ ...styles.button, fontSize: '10px', padding: '4px 8px' }}
                onClick={onClearEvents}
              >
                Clear
              </button>
            )}
          </div>
          {guardEvents.length === 0 ? (
            <p style={styles.noData}>✓ No violations detected</p>
          ) : (
            guardEvents.map(event => <GuardEventCard key={event.id} event={event} />)
          )}
        </section>
      )}

      {/* PANEL 4 — OBSERVATIONS */}
      {activeTab === 'observations' && (
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>Process Observations</h3>
          {observations.length === 0 ? (
            <p style={styles.noData}>No observations yet</p>
          ) : (
            observations.map(obs => (
              <div key={obs.id} style={styles.observation}>
                <span style={styles.timestamp}>[{formatTime(obs.timestamp)}]</span>{' '}
                <strong>{obs.source}:</strong> {obs.note}
              </div>
            ))
          )}
        </section>
      )}

      {/* SESSION INFO */}
      <div style={styles.sessionInfo}>
        <span>Session: {sessionDuration}</span>
        {' • '}
        <span>{agents.length} agents</span>
        {' • '}
        <span>{guardEvents.filter(e => e.severity === 'violation').length} violations</span>
      </div>
    </div>
  );
};

/* -------------------------
   EXPORTS
------------------------- */

export default CheNuDebugDashboard;
