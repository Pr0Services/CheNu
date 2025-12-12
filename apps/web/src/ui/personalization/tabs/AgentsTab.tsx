/* =====================================================
   CHE·NU — Agents Tab
   
   Per-agent personalization settings.
   ===================================================== */

import React, { useState, useMemo } from 'react';

import {
  CheNuPersonalization,
  AgentPersonalization,
  AgentAvatarStyle,
  DEFAULT_AGENT_PERSONALIZATION,
} from '../../../personalization/personalization.types';

import { getAgentPersonalization } from '../../../personalization/personalization.engine';

// ─────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────

export interface AgentsTabProps {
  state: CheNuPersonalization;
  onChange: (next: CheNuPersonalization) => void;
  availableAgents?: string[];
}

// ─────────────────────────────────────────────────────
// AGENT DATA
// ─────────────────────────────────────────────────────

const AGENT_INFO: Record<string, { name: string; role: string; icon: string }> = {
  nova: { name: 'Nova', role: 'Orchestrateur', icon: '🌟' },
  methodology: { name: 'Methodology', role: 'Méthodologie', icon: '📋' },
  decision: { name: 'Decision', role: 'Évaluation', icon: '⚖️' },
  memory: { name: 'Memory', role: 'Mémoire', icon: '🧠' },
  analyst: { name: 'Analyst', role: 'Analyse', icon: '📊' },
  creative: { name: 'Creative', role: 'Créativité', icon: '🎨' },
  researcher: { name: 'Researcher', role: 'Recherche', icon: '🔬' },
};

const AVATAR_STYLES: { id: AgentAvatarStyle; name: string; preview: string }[] = [
  { id: 'glyph', name: 'Glyphe', preview: '◆' },
  { id: 'abstract', name: 'Abstrait', preview: '◐' },
  { id: 'semi-human', name: 'Semi-humain', preview: '☺' },
  { id: 'minimal', name: 'Minimal', preview: '○' },
];

// ─────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────

export function AgentsTab({ 
  state, 
  onChange, 
  availableAgents = ['nova', 'methodology', 'decision', 'memory'] 
}: AgentsTabProps) {
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);

  // Get all agents with their preferences
  const agentsWithPrefs = useMemo(() => {
    return availableAgents.map(id => ({
      id,
      ...getAgentPersonalization(state, id),
      info: AGENT_INFO[id] || { name: id, role: 'Agent', icon: '🤖' },
    }));
  }, [availableAgents, state]);

  // Update an agent
  const updateAgent = (agentId: string, updates: Partial<AgentPersonalization>) => {
    const existing = state.agents.find(a => a.agentId === agentId);
    
    let agents: AgentPersonalization[];
    if (existing) {
      agents = state.agents.map(a =>
        a.agentId === agentId ? { ...a, ...updates } : a
      );
    } else {
      agents = [
        ...state.agents,
        { ...DEFAULT_AGENT_PERSONALIZATION, agentId, ...updates },
      ];
    }

    onChange({ ...state, agents, updatedAt: Date.now() });
  };

  // Get trust level color
  const getTrustColor = (level: number) => {
    if (level >= 80) return '#22c55e';
    if (level >= 50) return '#eab308';
    return '#ef4444';
  };

  return (
    <div style={styles.tab}>
      <h3 style={styles.sectionTitle}>🤖 Agents d'influence</h3>
      
      <p style={styles.description}>
        Les agents observent et recommandent. Vous décidez toujours.
      </p>

      {/* Favorites */}
      {agentsWithPrefs.some(a => a.favorite) && (
        <div style={styles.favoritesSection}>
          <h4 style={styles.subsectionTitle}>⭐ Favoris</h4>
          <div style={styles.favoritesList}>
            {agentsWithPrefs.filter(a => a.favorite).map(agent => (
              <div key={agent.id} style={styles.favoriteChip}>
                <span>{agent.info.icon}</span>
                <span>{agent.info.name}</span>
                <button
                  onClick={() => updateAgent(agent.id, { favorite: false })}
                  style={styles.removeButton}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Agent list */}
      <div style={styles.agentList}>
        {agentsWithPrefs.map(agent => (
          <div key={agent.id} style={styles.agentCard}>
            {/* Header */}
            <div 
              style={styles.agentHeader}
              onClick={() => setExpandedAgent(
                expandedAgent === agent.id ? null : agent.id
              )}
            >
              <div style={styles.agentInfo}>
                <div style={{
                  ...styles.agentAvatar,
                  background: agent.visible 
                    ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' 
                    : 'rgba(255,255,255,0.1)',
                }}>
                  {agent.info.icon}
                </div>
                <div>
                  <div style={styles.agentName}>{agent.info.name}</div>
                  <div style={styles.agentRole}>{agent.info.role}</div>
                </div>
              </div>

              <div style={styles.agentQuickActions}>
                {/* Trust indicator */}
                <div style={styles.trustIndicator}>
                  <div 
                    style={{
                      ...styles.trustBar,
                      width: `${agent.trustLevel}%`,
                      background: getTrustColor(agent.trustLevel),
                    }}
                  />
                  <span style={styles.trustLabel}>{agent.trustLevel}%</span>
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); updateAgent(agent.id, { favorite: !agent.favorite }); }}
                  style={{
                    ...styles.quickButton,
                    ...(agent.favorite ? styles.quickButtonActive : {}),
                  }}
                  title="Favori"
                >
                  {agent.favorite ? '⭐' : '☆'}
                </button>
                
                <button
                  onClick={(e) => { e.stopPropagation(); updateAgent(agent.id, { visible: !agent.visible }); }}
                  style={{
                    ...styles.quickButton,
                    ...(agent.visible ? styles.quickButtonActive : {}),
                  }}
                  title="Visible"
                >
                  {agent.visible ? '👁️' : '👁️‍🗨️'}
                </button>
                
                <span style={styles.expandIcon}>
                  {expandedAgent === agent.id ? '▼' : '▶'}
                </span>
              </div>
            </div>

            {/* Expanded content */}
            {expandedAgent === agent.id && (
              <div style={styles.agentExpanded}>
                {/* Avatar style */}
                <div style={styles.field}>
                  <label style={styles.label}>Style d'avatar</label>
                  <div style={styles.avatarStyleGrid}>
                    {AVATAR_STYLES.map(style => (
                      <button
                        key={style.id}
                        onClick={() => updateAgent(agent.id, { avatarStyle: style.id })}
                        style={{
                          ...styles.avatarStyleButton,
                          ...(agent.avatarStyle === style.id ? styles.avatarStyleActive : {}),
                        }}
                      >
                        <span style={styles.avatarStylePreview}>{style.preview}</span>
                        <span>{style.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Response style */}
                <div style={styles.field}>
                  <label style={styles.label}>Style de réponse</label>
                  <div style={styles.buttonGroup}>
                    {(['concise', 'balanced', 'detailed'] as const).map(style => (
                      <button
                        key={style}
                        onClick={() => updateAgent(agent.id, { responseStyle: style })}
                        style={{
                          ...styles.optionButton,
                          ...(agent.responseStyle === style ? styles.optionButtonActive : {}),
                        }}
                      >
                        {style === 'concise' ? 'Concis' : 
                         style === 'balanced' ? 'Équilibré' : 'Détaillé'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Voice enabled */}
                <div style={styles.field}>
                  <label style={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={agent.voiceEnabled}
                      onChange={() => updateAgent(agent.id, { voiceEnabled: !agent.voiceEnabled })}
                      style={styles.checkbox}
                    />
                    <span>Voix activée</span>
                  </label>
                </div>

                {/* Trust level slider */}
                <div style={styles.field}>
                  <label style={styles.label}>
                    Niveau de confiance: {agent.trustLevel}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={agent.trustLevel}
                    onChange={(e) => updateAgent(agent.id, { trustLevel: parseInt(e.target.value) })}
                    style={styles.slider}
                  />
                  <p style={styles.hint}>
                    Affecte le poids donné aux recommandations de cet agent
                  </p>
                </div>

                {/* Stats */}
                <div style={styles.statsBox}>
                  <div style={styles.stat}>
                    <span>Interactions</span>
                    <strong>{agent.interactionCount}</strong>
                  </div>
                  <div style={styles.stat}>
                    <span>Dernière interaction</span>
                    <strong>
                      {agent.lastInteraction 
                        ? new Date(agent.lastInteraction).toLocaleDateString('fr-CA')
                        : 'Jamais'}
                    </strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  tab: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  sectionTitle: {
    margin: 0,
    fontSize: 16,
    fontWeight: 600,
    color: '#fff',
  },
  description: {
    margin: 0,
    fontSize: 13,
    opacity: 0.6,
  },
  favoritesSection: {
    padding: 12,
    borderRadius: 10,
    background: 'rgba(234,179,8,0.1)',
    border: '1px solid rgba(234,179,8,0.3)',
  },
  subsectionTitle: {
    margin: '0 0 8px 0',
    fontSize: 13,
    fontWeight: 500,
  },
  favoritesList: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
  },
  favoriteChip: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 10px',
    borderRadius: 16,
    background: 'rgba(0,0,0,0.2)',
    fontSize: 12,
  },
  removeButton: {
    width: 16,
    height: 16,
    borderRadius: '50%',
    border: 'none',
    background: 'rgba(255,255,255,0.1)',
    color: '#fff',
    fontSize: 10,
    cursor: 'pointer',
  },
  agentList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  agentCard: {
    borderRadius: 12,
    background: 'rgba(0,0,0,0.2)',
    overflow: 'hidden',
  },
  agentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    cursor: 'pointer',
  },
  agentInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  agentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
  },
  agentName: {
    fontSize: 14,
    fontWeight: 500,
  },
  agentRole: {
    fontSize: 11,
    opacity: 0.5,
  },
  agentQuickActions: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  trustIndicator: {
    position: 'relative',
    width: 60,
    height: 20,
    borderRadius: 10,
    background: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  trustBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    borderRadius: 10,
    transition: 'width 0.3s',
  },
  trustLabel: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    fontSize: 10,
    fontWeight: 600,
  },
  quickButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    border: 'none',
    background: 'rgba(255,255,255,0.1)',
    fontSize: 14,
    cursor: 'pointer',
    opacity: 0.5,
  },
  quickButtonActive: {
    background: 'rgba(99,102,241,0.3)',
    opacity: 1,
  },
  expandIcon: {
    fontSize: 10,
    opacity: 0.5,
    marginLeft: 4,
  },
  agentExpanded: {
    padding: 16,
    borderTop: '1px solid rgba(255,255,255,0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    background: 'rgba(0,0,0,0.1)',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: 500,
    opacity: 0.8,
  },
  avatarStyleGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 8,
  },
  avatarStyleButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    padding: '10px 8px',
    borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'transparent',
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    cursor: 'pointer',
  },
  avatarStyleActive: {
    borderColor: '#6366f1',
    background: 'rgba(99,102,241,0.2)',
    color: '#fff',
  },
  avatarStylePreview: {
    fontSize: 20,
  },
  buttonGroup: {
    display: 'flex',
    gap: 8,
  },
  optionButton: {
    flex: 1,
    padding: '10px 12px',
    borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'transparent',
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    cursor: 'pointer',
  },
  optionButtonActive: {
    borderColor: '#6366f1',
    background: 'rgba(99,102,241,0.2)',
    color: '#fff',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontSize: 13,
    cursor: 'pointer',
  },
  checkbox: {
    width: 16,
    height: 16,
    accentColor: '#6366f1',
  },
  slider: {
    width: '100%',
    accentColor: '#6366f1',
  },
  hint: {
    margin: 0,
    fontSize: 11,
    opacity: 0.5,
  },
  statsBox: {
    display: 'flex',
    gap: 16,
    padding: 12,
    borderRadius: 8,
    background: 'rgba(0,0,0,0.2)',
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    fontSize: 12,
  },
};

export default AgentsTab;
