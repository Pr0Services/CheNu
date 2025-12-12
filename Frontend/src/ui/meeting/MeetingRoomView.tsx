/* =====================================================
   CHE·NU — Meeting Room View
   PHASE 6: UI Component for structured meetings
   
   Pure presentation component - NO business logic.
   All state mutations via callbacks.
   ===================================================== */

import React, { useMemo, useState } from 'react';
import {
  MeetingRoomState, MeetingPhase, DecisionType,
  HumanParticipant, AgentParticipant,
} from '../../meeting/types';

// ─────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────

export interface DecisionInput {
  decidedBy: string;
  decisionType: DecisionType;
  summary: string;
  linkedRecommendations?: string[];
}

export interface MeetingRoomViewProps {
  meeting: MeetingRoomState;
  
  // State mutations (connect to engine + timeline)
  onAdvancePhase: () => void;
  onRecordDecision: (input: DecisionInput) => void;
  onClose: () => void;
  
  // Agent interactions (connect to LLM backend)
  onAskAgentSummary?: (agentId: string) => void;
  onAskAgentSuggestion?: (agentId: string) => void;
}

// ─────────────────────────────────────────────────────
// HELPER COMPONENTS
// ─────────────────────────────────────────────────────

const AgentAvatar: React.FC<{ agent: AgentParticipant }> = ({ agent }) => {
  const colors: Record<string, string> = {
    orchestrator: '#9c27b0',
    analyst: '#2196f3',
    evaluator: '#ff9800',
    advisor: '#4caf50',
  };
  
  return (
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        background: colors[agent.role] || '#666',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 14,
        fontWeight: 600,
        color: '#fff',
        boxShadow: `0 0 8px ${colors[agent.role] || '#666'}40`,
      }}
    >
      {agent.name.charAt(0).toUpperCase()}
    </div>
  );
};

// ─────────────────────────────────────────────────────
// SUMMARY HELPER
// ─────────────────────────────────────────────────────

function summarizeMeeting(meeting: MeetingRoomState): string {
  const { context, decisions, agentContributions } = meeting;
  
  const decisionsSummary = decisions.length === 0
    ? 'Aucune décision enregistrée.'
    : decisions.map(d => `• [${d.decisionType.toUpperCase()}] ${d.summary}`).join('\n');
  
  return [
    `📋 ${context.objective.title}`,
    `Sphère: ${context.objective.sphereId}`,
    `Phase: ${meeting.phase}`,
    `Status: ${meeting.status}`,
    '',
    `👥 Participants: ${context.participants.humans.length} humains, ${context.participants.agents.length} agents`,
    `📊 Contributions: ${agentContributions.length} analyses/recommandations`,
    '',
    `📌 Décisions (${decisions.length}):`,
    decisionsSummary,
  ].join('\n');
}

// ─────────────────────────────────────────────────────
// PHASE INDICATOR
// ─────────────────────────────────────────────────────

const PhaseIndicator: React.FC<{ phase: MeetingPhase }> = ({ phase }) => {
  const phases: MeetingPhase[] = ['analysis', 'decision', 'validation'];
  const labels = { analysis: 'Analyse', decision: 'Décision', validation: 'Validation' };
  
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
      {phases.map((p, i) => (
        <React.Fragment key={p}>
          <div
            style={{
              padding: '4px 12px',
              borderRadius: 12,
              fontSize: 11,
              fontWeight: phase === p ? 600 : 400,
              background: phase === p ? '#ffd54f' : 'rgba(255,255,255,0.1)',
              color: phase === p ? '#000' : '#fff',
              opacity: phases.indexOf(phase) >= i ? 1 : 0.4,
            }}
          >
            {labels[p]}
          </div>
          {i < phases.length - 1 && (
            <div style={{ width: 20, height: 2, background: 'rgba(255,255,255,0.2)' }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────

export const MeetingRoomView: React.FC<MeetingRoomViewProps> = ({
  meeting,
  onAdvancePhase,
  onRecordDecision,
  onClose,
  onAskAgentSummary,
  onAskAgentSuggestion,
}) => {
  const { context, status } = meeting;
  const agents = context.participants.agents;
  const humans = context.participants.humans;
  
  // Local form state
  const [decisionType, setDecisionType] = useState<DecisionType>('approve');
  const [decisionSummary, setDecisionSummary] = useState('');
  const [selectedHuman, setSelectedHuman] = useState<string>(
    humans.find(h => h.role === 'owner')?.id || ''
  );
  
  const meetingSummaryText = useMemo(() => summarizeMeeting(meeting), [meeting]);
  
  const handleSubmitDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHuman || !decisionSummary.trim()) return;
    
    onRecordDecision({
      decidedBy: selectedHuman,
      decisionType,
      summary: decisionSummary.trim(),
      linkedRecommendations: [],
    });
    setDecisionSummary('');
  };
  
  const isActive = status === 'active';
  const canAdvance = isActive && meeting.phase !== 'validation';
  
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(10,10,14,0.96)',
        backdropFilter: 'blur(8px)',
        color: '#fff',
        fontFamily: 'system-ui, sans-serif',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ═══════════════════════════════════════════════════════
          HEADER
         ═══════════════════════════════════════════════════════ */}
      <header
        style={{
          padding: 16,
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <div>
          <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: 0.5 }}>
            {context.objective.title}
          </div>
          <div style={{ opacity: 0.7, fontSize: 13, marginTop: 4 }}>
            Sphère: {context.objective.sphereId} • 
            Criticité: <span style={{ color: getCriticalityColor(context.objective.criticality) }}>
              {context.objective.criticality.toUpperCase()}
            </span>
          </div>
        </div>
        
        <PhaseIndicator phase={meeting.phase} />
        
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            onClick={onAdvancePhase}
            disabled={!canAdvance}
            style={{
              ...buttonStyle,
              opacity: canAdvance ? 1 : 0.5,
              cursor: canAdvance ? 'pointer' : 'not-allowed',
            }}
          >
            Phase suivante →
          </button>
          <button onClick={onClose} style={{ ...buttonStyle, background: '#c62828' }}>
            Fermer
          </button>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════
          MAIN CONTENT
         ═══════════════════════════════════════════════════════ */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        
        {/* ─────────────────────────────────────────────────────
            SPATIAL ZONE (Left)
           ───────────────────────────────────────────────────── */}
        <div
          style={{
            flex: 1.2,
            position: 'relative',
            borderRight: '1px solid rgba(255,255,255,0.07)',
            overflow: 'hidden',
          }}
        >
          {/* Decision Center */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: 180,
              height: 180,
              borderRadius: '50%',
              border: `3px solid ${meeting.phase === 'decision' ? '#ffd54f' : '#444'}`,
              background: meeting.phase === 'decision'
                ? 'rgba(255,213,79,0.1)'
                : 'rgba(40,40,46,0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              textAlign: 'center',
              padding: 16,
              boxShadow: meeting.phase === 'decision'
                ? '0 0 40px rgba(255,213,79,0.4)'
                : '0 0 20px rgba(0,0,0,0.5)',
              transition: 'all 0.3s ease',
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 600 }}>
              {meeting.phase === 'analysis' && '🔍 Analyse'}
              {meeting.phase === 'decision' && '⚖️ Décision'}
              {meeting.phase === 'validation' && '✅ Validation'}
            </div>
            <div style={{ opacity: 0.7, marginTop: 8, fontSize: 11, lineHeight: 1.4 }}>
              {meeting.phase === 'analysis' && 'Collecte des analyses et recommandations'}
              {meeting.phase === 'decision' && 'L\'humain prend la décision finale'}
              {meeting.phase === 'validation' && 'Confirmation et clôture'}
            </div>
          </div>

          {/* Agents Ring */}
          {agents.map((agent, index) => {
            const angle = (Math.PI * 2 * index) / Math.max(agents.length, 1) - Math.PI / 2;
            const radius = 180;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            return (
              <div
                key={agent.id}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <AgentAvatar agent={agent} />
                <span style={{ fontSize: 10, opacity: 0.8, textAlign: 'center' }}>
                  {agent.name}
                </span>
                {agent.outputCount > 0 && (
                  <span style={{
                    fontSize: 9,
                    background: 'rgba(255,255,255,0.1)',
                    padding: '2px 6px',
                    borderRadius: 8,
                  }}>
                    {agent.outputCount} contrib.
                  </span>
                )}
              </div>
            );
          })}

          {/* Humans Ring (outer) */}
          {humans.map((human, index) => {
            const angle = (Math.PI * 2 * index) / Math.max(humans.length, 1);
            const radius = 280;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            return (
              <div
                key={human.id}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: human.role === 'owner' ? '#ffd54f' : '#555',
                    color: human.role === 'owner' ? '#000' : '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                    fontWeight: 600,
                    border: human.role === 'owner' ? '2px solid #fff' : 'none',
                  }}
                >
                  {human.displayName.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: 11, opacity: 0.9 }}>{human.displayName}</span>
                <span style={{ fontSize: 9, opacity: 0.6 }}>{human.role}</span>
              </div>
            );
          })}
        </div>

        {/* ─────────────────────────────────────────────────────
            SIDE PANEL (Right)
           ───────────────────────────────────────────────────── */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            padding: 16,
            gap: 16,
            minWidth: 0,
            overflowY: 'auto',
          }}
        >
          {/* Agents Section */}
          <section>
            <div style={sectionTitleStyle}>🤖 Agents participants</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 160, overflowY: 'auto' }}>
              {agents.map(agent => (
                <div
                  key={agent.id}
                  style={{
                    padding: 10,
                    borderRadius: 8,
                    border: '1px solid rgba(255,255,255,0.12)',
                    background: 'rgba(255,255,255,0.03)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <AgentAvatar agent={agent} />
                    <div>
                      <div style={{ fontWeight: 500, fontSize: 13 }}>{agent.name}</div>
                      <div style={{ opacity: 0.6, fontSize: 11 }}>
                        {agent.role} • {agent.outputCount} outputs
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button
                      style={smallButtonStyle}
                      onClick={() => onAskAgentSummary?.(agent.id)}
                    >
                      Résumé
                    </button>
                    <button
                      style={smallButtonStyle}
                      onClick={() => onAskAgentSuggestion?.(agent.id)}
                    >
                      Suggestion
                    </button>
                  </div>
                </div>
              ))}
              {agents.length === 0 && (
                <div style={{ opacity: 0.5, fontSize: 12, textAlign: 'center', padding: 16 }}>
                  Aucun agent activé
                </div>
              )}
            </div>
          </section>

          {/* Decision Form */}
          <section>
            <div style={sectionTitleStyle}>⚖️ Décision humaine</div>
            <form onSubmit={handleSubmitDecision} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <select
                  value={selectedHuman}
                  onChange={e => setSelectedHuman(e.target.value)}
                  style={{ ...selectStyle, flex: 1 }}
                >
                  <option value="">Sélectionner décideur...</option>
                  {humans.filter(h => h.role !== 'observer').map(h => (
                    <option key={h.id} value={h.id}>
                      {h.displayName} ({h.role})
                    </option>
                  ))}
                </select>
                
                <select
                  value={decisionType}
                  onChange={e => setDecisionType(e.target.value as DecisionType)}
                  style={selectStyle}
                >
                  <option value="approve">✅ Approuver</option>
                  <option value="reject">❌ Rejeter</option>
                  <option value="pivot">🔄 Pivoter</option>
                  <option value="defer">⏸️ Reporter</option>
                  <option value="escalate">⬆️ Escalader</option>
                </select>
              </div>
              
              <textarea
                value={decisionSummary}
                onChange={e => setDecisionSummary(e.target.value)}
                placeholder="Résumé de la décision..."
                rows={3}
                style={textareaStyle}
              />
              
              <button
                type="submit"
                disabled={!selectedHuman || !decisionSummary.trim() || !isActive}
                style={{
                  ...buttonStyle,
                  background: '#4caf50',
                  opacity: selectedHuman && decisionSummary.trim() && isActive ? 1 : 0.5,
                }}
              >
                Enregistrer la décision
              </button>
            </form>
          </section>

          {/* Meeting Summary */}
          <section style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            <div style={sectionTitleStyle}>📋 Résumé de la réunion</div>
            <pre
              style={{
                flex: 1,
                background: '#111',
                borderRadius: 8,
                padding: 12,
                fontSize: 11,
                overflow: 'auto',
                whiteSpace: 'pre-wrap',
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              {meetingSummaryText}
            </pre>
          </section>

          {/* Decisions List */}
          {meeting.decisions.length > 0 && (
            <section>
              <div style={sectionTitleStyle}>📌 Décisions prises ({meeting.decisions.length})</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {meeting.decisions.map(d => (
                  <div
                    key={d.id}
                    style={{
                      padding: 8,
                      borderRadius: 6,
                      background: getDecisionColor(d.decisionType),
                      fontSize: 12,
                    }}
                  >
                    <strong>[{d.decisionType.toUpperCase()}]</strong> {d.summary}
                    {d.rationale && (
                      <div style={{ opacity: 0.7, marginTop: 4, fontSize: 11 }}>
                        💭 {d.rationale}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────

const buttonStyle: React.CSSProperties = {
  padding: '8px 16px',
  borderRadius: 6,
  border: 'none',
  background: '#333',
  color: '#fff',
  fontSize: 12,
  fontWeight: 500,
  cursor: 'pointer',
};

const smallButtonStyle: React.CSSProperties = {
  padding: '4px 8px',
  borderRadius: 4,
  border: '1px solid rgba(255,255,255,0.2)',
  background: 'transparent',
  color: '#fff',
  fontSize: 10,
  cursor: 'pointer',
};

const selectStyle: React.CSSProperties = {
  padding: '8px 12px',
  borderRadius: 6,
  border: '1px solid rgba(255,255,255,0.2)',
  background: '#222',
  color: '#fff',
  fontSize: 12,
};

const textareaStyle: React.CSSProperties = {
  padding: 10,
  borderRadius: 6,
  border: '1px solid rgba(255,255,255,0.2)',
  background: '#222',
  color: '#fff',
  fontSize: 12,
  fontFamily: 'inherit',
  resize: 'vertical',
  minHeight: 60,
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  marginBottom: 8,
  opacity: 0.9,
};

// ─────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────

function getCriticalityColor(c: string): string {
  switch (c) {
    case 'critical': return '#f44336';
    case 'high': return '#ff9800';
    case 'medium': return '#ffd54f';
    default: return '#4caf50';
  }
}

function getDecisionColor(type: DecisionType): string {
  switch (type) {
    case 'approve': return 'rgba(76,175,80,0.2)';
    case 'reject': return 'rgba(244,67,54,0.2)';
    case 'pivot': return 'rgba(33,150,243,0.2)';
    case 'defer': return 'rgba(158,158,158,0.2)';
    case 'escalate': return 'rgba(156,39,176,0.2)';
    default: return 'rgba(255,255,255,0.1)';
  }
}

export default MeetingRoomView;
