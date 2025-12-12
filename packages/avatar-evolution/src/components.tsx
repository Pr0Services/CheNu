/**
 * CHE·NU — AVATAR EVOLUTION SYSTEM + MULTI-MEETING UNIVERSE VIEW
 * React UI Components
 */

import React, { useState, CSSProperties } from 'react';
import { useAvatarEvolutionUniverse } from './AvatarEvolutionContext';
import {
  EvolutionState,
  EvolutionTriggers,
  SphereType,
  UniverseNode,
  UniverseInteraction,
} from './types';
import {
  EVOLUTION_STATE_LIST,
  SPHERE_LIST,
  UNIVERSE_INTERACTIONS,
  COORDINATION_AGENTS,
} from './presets';

// ============================================================
// STYLES
// ============================================================

const styles: Record<string, CSSProperties> = {
  container: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    padding: 20,
    maxWidth: 1000,
    margin: '0 auto',
  },
  card: {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  title: {
    fontSize: 16,
    fontWeight: 600,
    color: '#1f2937',
    margin: '0 0 12px 0',
  },
  subtitle: {
    fontSize: 12,
    color: '#6b7280',
    margin: '4px 0 0 0',
  },
  button: {
    padding: '8px 16px',
    fontSize: 13,
    fontWeight: 500,
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  buttonPrimary: {
    background: '#A855F7',
    color: '#fff',
  },
  buttonSecondary: {
    background: '#f3f4f6',
    color: '#374151',
  },
  badge: {
    display: 'inline-block',
    padding: '3px 10px',
    fontSize: 10,
    fontWeight: 600,
    borderRadius: 20,
  },
};

// ============================================================
// EVOLUTION STATE CARD
// ============================================================

interface EvolutionStateCardProps {
  state: typeof EVOLUTION_STATE_LIST[0];
  isActive: boolean;
  onClick: () => void;
}

function EvolutionStateCard({ state, isActive, onClick }: EvolutionStateCardProps) {
  const colors: Record<EvolutionState, string> = {
    base: '#6B7280',
    signal: '#3B82F6',
    structural: '#8B5CF6',
    integrated: '#EC4899',
  };
  
  return (
    <div
      style={{
        padding: 14,
        borderRadius: 10,
        border: isActive ? `2px solid ${colors[state.state]}` : '1px solid #e5e7eb',
        background: isActive ? `${colors[state.state]}10` : '#fff',
        cursor: 'pointer',
        textAlign: 'center',
        flex: 1,
      }}
      onClick={onClick}
    >
      <div style={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        background: colors[state.state],
        margin: '0 auto 8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: '#fff',
          opacity: 0.3 + state.complexity * 0.7,
        }} />
      </div>
      <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 4 }}>{state.name}</div>
      <div style={{ fontSize: 10, color: '#6b7280' }}>{state.visual}</div>
    </div>
  );
}

// ============================================================
// EVOLUTION CONTROLLER
// ============================================================

export function EvolutionController() {
  const { state, evolveAvatar, setEvolutionState, clearEvolution } = useAvatarEvolutionUniverse();
  const [triggers, setTriggers] = useState<EvolutionTriggers>({
    session_context: 'neutral_mode',
    information_load: 'low_load',
    role_intensity: 'participant',
  });
  
  const handleEvolve = () => {
    evolveAvatar('avatar_current', triggers);
  };
  
  const currentEvolution = state.evolution.current_evolution;
  
  return (
    <div style={styles.card}>
      <h3 style={styles.title}>👤 Avatar Evolution</h3>
      <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 12 }}>
        Evolution = INFORMATIONAL STATE, not identity shaping
      </p>
      
      {/* Trigger controls */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
        <div>
          <label style={{ fontSize: 11, color: '#6b7280', display: 'block', marginBottom: 4 }}>
            Session Context
          </label>
          <select
            style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #e5e7eb', fontSize: 12 }}
            value={triggers.session_context}
            onChange={e => setTriggers(t => ({ ...t, session_context: e.target.value as any }))}
          >
            <option value="neutral_mode">Neutral</option>
            <option value="meeting_mode">Meeting</option>
            <option value="creative_mode">Creative</option>
            <option value="analysis_mode">Analysis</option>
          </select>
        </div>
        
        <div>
          <label style={{ fontSize: 11, color: '#6b7280', display: 'block', marginBottom: 4 }}>
            Information Load
          </label>
          <select
            style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #e5e7eb', fontSize: 12 }}
            value={triggers.information_load}
            onChange={e => setTriggers(t => ({ ...t, information_load: e.target.value as any }))}
          >
            <option value="low_load">Low</option>
            <option value="med_load">Medium</option>
            <option value="high_load">High</option>
          </select>
        </div>
        
        <div>
          <label style={{ fontSize: 11, color: '#6b7280', display: 'block', marginBottom: 4 }}>
            Role Intensity
          </label>
          <select
            style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #e5e7eb', fontSize: 12 }}
            value={triggers.role_intensity}
            onChange={e => setTriggers(t => ({ ...t, role_intensity: e.target.value as any }))}
          >
            <option value="observer">Observer</option>
            <option value="participant">Participant</option>
            <option value="presenter">Presenter</option>
            <option value="coordinator">Coordinator</option>
          </select>
        </div>
      </div>
      
      <button
        style={{ ...styles.button, ...styles.buttonPrimary, width: '100%', marginBottom: 16 }}
        onClick={handleEvolve}
      >
        Apply Evolution
      </button>
      
      {/* Evolution states */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, color: '#374151' }}>
          Evolution States
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {EVOLUTION_STATE_LIST.map(s => (
            <EvolutionStateCard
              key={s.state}
              state={s}
              isActive={currentEvolution?.state === s.state}
              onClick={() => setEvolutionState(s.state)}
            />
          ))}
        </div>
      </div>
      
      {/* Current state display */}
      {currentEvolution && (
        <div style={{
          padding: 12,
          background: '#F3E8FF',
          borderRadius: 8,
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#7C3AED', marginBottom: 6 }}>
            Current Evolution
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, fontSize: 10 }}>
            <div><strong>State:</strong> {currentEvolution.state}</div>
            <div><strong>Context:</strong> {currentEvolution.context}</div>
            <div><strong>Density:</strong> {(currentEvolution.info_density * 100).toFixed(0)}%</div>
            <div><strong>Silhouette:</strong> {currentEvolution.morphology.silhouette}</div>
            <div><strong>Glyphs:</strong> {currentEvolution.morphology.glyphs}</div>
            <div><strong>Aura:</strong> {currentEvolution.morphology.aura}</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// SPHERE SELECTOR
// ============================================================

interface SphereSelectorProps {
  selected: SphereType | null;
  onSelect: (sphere: SphereType | null) => void;
}

export function SphereSelector({ selected, onSelect }: SphereSelectorProps) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      <button
        style={{
          ...styles.button,
          background: selected === null ? '#A855F7' : '#f3f4f6',
          color: selected === null ? '#fff' : '#374151',
          padding: '6px 12px',
          fontSize: 11,
        }}
        onClick={() => onSelect(null)}
      >
        All
      </button>
      {SPHERE_LIST.map(sphere => (
        <button
          key={sphere.type}
          style={{
            ...styles.button,
            background: selected === sphere.type ? sphere.color : '#f3f4f6',
            color: selected === sphere.type ? '#fff' : '#374151',
            padding: '6px 12px',
            fontSize: 11,
          }}
          onClick={() => onSelect(sphere.type)}
        >
          {sphere.icon} {sphere.name}
        </button>
      ))}
    </div>
  );
}

// ============================================================
// UNIVERSE NODE DISPLAY
// ============================================================

interface NodeDisplayProps {
  node: UniverseNode;
  onClick: (node: UniverseNode) => void;
}

function NodeDisplay({ node, onClick }: NodeDisplayProps) {
  const typeColors = {
    live: '#10B981',
    scheduled: '#9CA3AF',
    replay: '#3B82F6',
    hub: '#F8FAFC',
  };
  
  return (
    <div
      style={{
        padding: 12,
        borderRadius: 10,
        border: `2px solid ${typeColors[node.type]}`,
        background: '#fff',
        cursor: 'pointer',
        position: 'relative',
      }}
      onClick={() => onClick(node)}
    >
      {/* Pulse indicator for live */}
      {node.type === 'live' && (
        <div style={{
          position: 'absolute',
          top: 8,
          right: 8,
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: '#10B981',
          animation: 'pulse 1.5s infinite',
        }} />
      )}
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <div style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: typeColors[node.type],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 14,
        }}>
          {SPHERE_LIST.find(s => s.type === node.sphere)?.icon || '📍'}
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 12 }}>{node.title}</div>
          <div style={{ fontSize: 10, color: '#6b7280' }}>
            {node.type} • {node.participants.length} participants
          </div>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: 6 }}>
        <span style={{
          ...styles.badge,
          background: `${SPHERE_LIST.find(s => s.type === node.sphere)?.color}20`,
          color: SPHERE_LIST.find(s => s.type === node.sphere)?.color,
        }}>
          {node.sphere}
        </span>
      </div>
    </div>
  );
}

// ============================================================
// UNIVERSE VIEW
// ============================================================

export function UniverseView() {
  const { state, getVisibleNodes, setSphereFilter, setInteractionMode, addNode } = useAvatarEvolutionUniverse();
  const visibleNodes = getVisibleNodes();
  
  const handleAddNode = (type: 'live' | 'scheduled') => {
    const spheres: SphereType[] = ['business', 'scholar', 'creative', 'institution', 'social', 'xr'];
    const randomSphere = spheres[Math.floor(Math.random() * spheres.length)];
    addNode(type, randomSphere, `Meeting ${Date.now() % 1000}`, ['user_1']);
  };
  
  return (
    <div style={styles.card}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 style={{ ...styles.title, margin: 0 }}>🌌 Universe View</h3>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            style={{ ...styles.button, ...styles.buttonSecondary, padding: '6px 12px', fontSize: 11 }}
            onClick={() => handleAddNode('live')}
          >
            + Live Meeting
          </button>
          <button
            style={{ ...styles.button, ...styles.buttonSecondary, padding: '6px 12px', fontSize: 11 }}
            onClick={() => handleAddNode('scheduled')}
          >
            + Scheduled
          </button>
        </div>
      </div>
      
      {/* Sphere filter */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 6 }}>Filter by Sphere</div>
        <SphereSelector
          selected={state.view.current_sphere_filter}
          onSelect={setSphereFilter}
        />
      </div>
      
      {/* Nodes grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: 12,
        marginBottom: 16,
      }}>
        {visibleNodes.length === 0 ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40, color: '#6b7280' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🌌</div>
            <div>No meetings in universe. Add one to begin.</div>
          </div>
        ) : (
          visibleNodes.map(node => (
            <NodeDisplay
              key={node.id}
              node={node}
              onClick={() => setInteractionMode('enter_meeting')}
            />
          ))
        )}
      </div>
      
      {/* Interaction modes */}
      <div>
        <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 6 }}>Interactions</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {UNIVERSE_INTERACTIONS.slice(0, 5).map(interaction => (
            <button
              key={interaction.interaction}
              style={{
                ...styles.button,
                background: state.view.interaction_mode === interaction.interaction ? '#A855F7' : '#f3f4f6',
                color: state.view.interaction_mode === interaction.interaction ? '#fff' : '#374151',
                padding: '6px 10px',
                fontSize: 10,
              }}
              onClick={() => setInteractionMode(
                state.view.interaction_mode === interaction.interaction ? null : interaction.interaction
              )}
            >
              {interaction.icon} {interaction.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// COORDINATION AGENTS PANEL
// ============================================================

export function CoordinationAgentsPanel() {
  return (
    <div style={styles.card}>
      <h3 style={{ ...styles.title, fontSize: 14 }}>🤖 Coordination Agents</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
        {COORDINATION_AGENTS.map(agent => (
          <div
            key={agent.type}
            style={{
              padding: 10,
              borderRadius: 8,
              background: '#f9fafb',
              border: '1px solid #e5e7eb',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 18 }}>{agent.icon}</span>
              <span style={{ fontWeight: 600, fontSize: 11 }}>{agent.name}</span>
            </div>
            <div style={{ fontSize: 10, color: '#6b7280', marginBottom: 4 }}>
              {agent.responsibility}
            </div>
            <div style={{ fontSize: 9, color: '#DC2626' }}>
              ⚠️ {agent.constraint}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// SAFETY PANEL
// ============================================================

export function SafetyPanel() {
  const { state, updateSafety } = useAvatarEvolutionUniverse();
  const safety = state.view.safety;
  
  const safetyItems = [
    { key: 'no_bright_flashes', label: 'No Bright Flashes', value: safety.no_bright_flashes },
    { key: 'no_rapid_motion', label: 'No Rapid Motion', value: safety.no_rapid_motion },
    { key: 'fixed_comfort_glide', label: 'Fixed Comfort Glide', value: safety.fixed_comfort_glide },
    { key: 'anchored_floor', label: 'Anchored Floor', value: safety.anchored_floor },
  ];
  
  return (
    <div style={styles.card}>
      <h3 style={{ ...styles.title, fontSize: 14 }}>🛡️ Safety Features</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {safetyItems.map(item => (
          <div
            key={item.key}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 10px',
              background: item.value ? '#D1FAE5' : '#FEE2E2',
              borderRadius: 6,
              fontSize: 12,
            }}
          >
            <span style={{ color: item.value ? '#059669' : '#DC2626' }}>
              {item.value ? '✓' : '✗'} {item.label}
            </span>
            <button
              style={{
                ...styles.button,
                padding: '4px 8px',
                fontSize: 10,
                background: item.value ? '#059669' : '#DC2626',
                color: '#fff',
              }}
              onClick={() => updateSafety({ [item.key]: !item.value } as any)}
            >
              {item.value ? 'On' : 'Off'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// FULL DASHBOARD
// ============================================================

export function AvatarEvolutionUniverseDashboard() {
  return (
    <div style={styles.container}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4, color: '#1F2937' }}>
        🌌 CHE·NU Avatar Evolution + Universe View
      </h1>
      <p style={{ color: '#6b7280', marginBottom: 20, fontSize: 13 }}>
        Evolution = Informational State • Universe = Navigation Space
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16 }}>
        <div>
          <EvolutionController />
          <UniverseView />
        </div>
        
        <div>
          <CoordinationAgentsPanel />
          <SafetyPanel />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// EXPORTS
// ============================================================

export {
  EvolutionStateCard,
  EvolutionController,
  SphereSelector,
  NodeDisplay,
  UniverseView,
  CoordinationAgentsPanel,
  SafetyPanel,
  AvatarEvolutionUniverseDashboard,
};
