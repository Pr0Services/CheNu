/**
 * CHE·NU — XR REPLAY COMPARISON + AI ROUTING
 * React Components
 */

import React, { useState, CSSProperties } from 'react';
import { useXRComparisonRouting } from './XRComparisonContext';
import { COMPARISON_MODES, COMPARISON_CONTROLS, ROUTING_OUTPUT_MODES, ROUTING_AGENTS, COMPARISON_ETHICAL_LOCKS } from './presets';
import { ComparisonMode, ComparisonLayers, RoutingOutputMode } from './types';

const styles: Record<string, CSSProperties> = {
  container: { fontFamily: 'system-ui, sans-serif', padding: 20, maxWidth: 1000, margin: '0 auto' },
  card: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, marginBottom: 16 },
  title: { fontSize: 16, fontWeight: 600, color: '#1f2937', margin: '0 0 12px 0' },
  button: { padding: '8px 16px', fontSize: 13, fontWeight: 500, border: 'none', borderRadius: 8, cursor: 'pointer' },
  buttonPrimary: { background: '#F59E0B', color: '#fff' },
  buttonSecondary: { background: '#f3f4f6', color: '#374151' },
};

// Comparison Mode Selector
export function ComparisonModeSelector() {
  const { state, createComparison, closeComparison } = useXRComparisonRouting();
  const [selectedMode, setSelectedMode] = useState<ComparisonMode>('replay_vs_replay');
  
  const handleCreate = () => {
    const source1 = { id: 's1', replay_id: 'r1', title: 'Meeting A', timestamp: Date.now(), duration_ms: 3600000, participants: ['user1'], sphere: 'business' };
    const source2 = { id: 's2', replay_id: 'r2', title: 'Meeting B', timestamp: Date.now(), duration_ms: 3600000, participants: ['user1'], sphere: 'business' };
    createComparison(selectedMode, source1, source2);
  };
  
  return (
    <div style={styles.card}>
      <h3 style={styles.title}>🔄 XR Replay Comparison</h3>
      <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 12 }}>Comparison = OBSERVATION ONLY • No recommendation • No ranking</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16 }}>
        {(Object.entries(COMPARISON_MODES) as [ComparisonMode, typeof COMPARISON_MODES[ComparisonMode]][]).map(([mode, config]) => (
          <div
            key={mode}
            onClick={() => setSelectedMode(mode)}
            style={{
              padding: 12, borderRadius: 8, cursor: 'pointer', textAlign: 'center',
              border: selectedMode === mode ? '2px solid #F59E0B' : '1px solid #e5e7eb',
              background: selectedMode === mode ? '#FEF3C7' : '#fff',
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 6 }}>{config.icon}</div>
            <div style={{ fontSize: 11, fontWeight: 600 }}>{config.name}</div>
            <div style={{ fontSize: 9, color: '#6b7280' }}>{config.description}</div>
          </div>
        ))}
      </div>
      
      {state.active_comparison ? (
        <button style={{ ...styles.button, background: '#EF4444', color: '#fff', width: '100%' }} onClick={closeComparison}>
          Close Comparison
        </button>
      ) : (
        <button style={{ ...styles.button, ...styles.buttonPrimary, width: '100%' }} onClick={handleCreate}>
          Start Comparison
        </button>
      )}
    </div>
  );
}

// Comparison Layers Panel
export function ComparisonLayersPanel() {
  const { state, toggleLayer } = useXRComparisonRouting();
  if (!state.active_comparison) return null;
  
  const layers: { key: keyof ComparisonLayers; name: string; icon: string; color: string }[] = [
    { key: 'spatial', name: 'Spatial', icon: '👻', color: '#F59E0B' },
    { key: 'timeline', name: 'Timeline', icon: '⏱️', color: '#06B6D4' },
    { key: 'events', name: 'Events', icon: '📍', color: '#8B5CF6' },
    { key: 'artifacts', name: 'Artifacts', icon: '📄', color: '#EC4899' },
  ];
  
  return (
    <div style={styles.card}>
      <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Comparison Layers</h4>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {layers.map(layer => (
          <button
            key={layer.key}
            onClick={() => toggleLayer(layer.key)}
            style={{
              padding: 10, borderRadius: 8, border: 'none', cursor: 'pointer',
              background: state.active_comparison?.layers[layer.key] ? layer.color : '#f3f4f6',
              color: state.active_comparison?.layers[layer.key] ? '#fff' : '#374151',
            }}
          >
            <div style={{ fontSize: 20 }}>{layer.icon}</div>
            <div style={{ fontSize: 10, fontWeight: 600 }}>{layer.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Comparison Controls
export function ComparisonControlsPanel() {
  const { state, setControl, setPlaybackPosition } = useXRComparisonRouting();
  if (!state.active_comparison) return null;
  
  return (
    <div style={styles.card}>
      <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Controls</h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
        {COMPARISON_CONTROLS.slice(0, 5).map(ctrl => (
          <button key={ctrl.id} style={{ ...styles.button, ...styles.buttonSecondary, fontSize: 10, padding: '6px 10px' }} title={ctrl.description}>
            {ctrl.icon} {ctrl.name}
          </button>
        ))}
      </div>
      <div>
        <label style={{ fontSize: 11, color: '#6b7280' }}>Playback Position</label>
        <input
          type="range" min="0" max="100" value={state.control_state.playback_position * 100}
          onChange={e => setPlaybackPosition(Number(e.target.value) / 100)}
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
}

// Routing Panel
export function RoutingPanel() {
  const { state, toggleRouting, setOutputMode, setConfidenceThreshold, addSuggestion, clearSuggestions, getFilteredSuggestions } = useXRComparisonRouting();
  const suggestions = getFilteredSuggestions();
  
  const handleAddDemo = () => {
    addSuggestion('node_123', 'Related Meeting', 'meeting', 'shared_topic', 0.75);
    addSuggestion('node_456', 'Previous Decision', 'replay', 'temporal_proximity', 0.62);
  };
  
  return (
    <div style={styles.card}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 style={{ ...styles.title, margin: 0 }}>🧭 AI Routing</h3>
        <button
          style={{ ...styles.button, padding: '6px 12px', fontSize: 11, background: state.routing.enabled ? '#10B981' : '#EF4444', color: '#fff' }}
          onClick={() => toggleRouting(!state.routing.enabled)}
        >
          {state.routing.enabled ? 'ON' : 'OFF'}
        </button>
      </div>
      <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 12 }}>WHERE to look, never WHAT to think</p>
      
      {/* Output Modes */}
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 11, color: '#6b7280', display: 'block', marginBottom: 6 }}>Output Mode</label>
        <div style={{ display: 'flex', gap: 6 }}>
          {ROUTING_OUTPUT_MODES.map(mode => (
            <button
              key={mode.mode}
              onClick={() => setOutputMode(mode.mode)}
              style={{
                ...styles.button, flex: 1, fontSize: 10, padding: '8px 6px',
                background: state.routing.output_mode === mode.mode ? '#06B6D4' : '#f3f4f6',
                color: state.routing.output_mode === mode.mode ? '#fff' : '#374151',
              }}
            >
              {mode.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Confidence Threshold */}
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 11, color: '#6b7280' }}>
          Confidence Threshold: {(state.user_controls.confidence_threshold * 100).toFixed(0)}%
        </label>
        <input
          type="range" min="0" max="100" value={state.user_controls.confidence_threshold * 100}
          onChange={e => setConfidenceThreshold(Number(e.target.value) / 100)}
          style={{ width: '100%' }}
        />
      </div>
      
      {/* Suggestions */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 600 }}>Suggestions ({suggestions.length})</span>
          <div style={{ display: 'flex', gap: 4 }}>
            <button style={{ ...styles.button, fontSize: 9, padding: '4px 8px', background: '#06B6D4', color: '#fff' }} onClick={handleAddDemo}>+ Demo</button>
            <button style={{ ...styles.button, fontSize: 9, padding: '4px 8px' }} onClick={clearSuggestions}>Clear</button>
          </div>
        </div>
        {suggestions.length === 0 ? (
          <div style={{ padding: 20, textAlign: 'center', color: '#9CA3AF', fontSize: 12 }}>No suggestions</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {suggestions.map(s => (
              <div key={s.id} style={{ padding: 10, background: '#f9fafb', borderRadius: 6, border: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{s.target_title}</span>
                  <span style={{ fontSize: 10, color: '#06B6D4' }}>{(s.confidence * 100).toFixed(0)}%</span>
                </div>
                <div style={{ fontSize: 10, color: '#6b7280' }}>{s.reason_explanation}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Routing Agents
export function RoutingAgentsPanel() {
  return (
    <div style={styles.card}>
      <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>🤖 Routing Agents</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {ROUTING_AGENTS.map(agent => (
          <div key={agent.type} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 8, background: '#f9fafb', borderRadius: 6 }}>
            <span style={{ fontSize: 20 }}>{agent.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 600 }}>{agent.name}</div>
              <div style={{ fontSize: 9, color: '#6b7280' }}>{agent.responsibility}</div>
            </div>
            <span style={{ fontSize: 8, color: '#DC2626' }}>⚠️ {agent.constraint}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Ethical Locks Display
export function EthicalLocksPanel() {
  return (
    <div style={styles.card}>
      <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>🛡️ Ethical Locks</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {COMPARISON_ETHICAL_LOCKS.map(lock => (
          <div key={lock.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8, background: '#FEE2E2', borderRadius: 6 }}>
            <span style={{ color: '#DC2626' }}>❌</span>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#991B1B' }}>{lock.name}</div>
              <div style={{ fontSize: 9, color: '#B91C1C' }}>{lock.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Full Dashboard
export function XRComparisonRoutingDashboard() {
  return (
    <div style={styles.container}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>🔄 CHE·NU XR Comparison + Routing</h1>
      <p style={{ color: '#6b7280', marginBottom: 20 }}>Observation Only • WHERE to look, never WHAT to think</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
        <div>
          <ComparisonModeSelector />
          <ComparisonLayersPanel />
          <ComparisonControlsPanel />
        </div>
        <div>
          <RoutingPanel />
          <RoutingAgentsPanel />
          <EthicalLocksPanel />
        </div>
      </div>
    </div>
  );
}
