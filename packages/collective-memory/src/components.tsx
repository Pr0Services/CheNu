/**
 * CHE·NU — COLLECTIVE MEMORY + NAVIGATION
 * React Components
 */

import React, { useState, CSSProperties } from 'react';
import { useCollectiveMemoryNavigation } from './CollectiveMemoryContext';
import { NAVIGATION_MODES, MEMORY_RULES, MEMORY_NEVER_ALLOWED } from './presets';
import { NavigationMode, MemoryEntryType } from './types';

const styles: Record<string, CSSProperties> = {
  container: { fontFamily: 'system-ui, sans-serif', padding: 20, maxWidth: 1000, margin: '0 auto' },
  card: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, marginBottom: 16 },
  title: { fontSize: 16, fontWeight: 600, color: '#1f2937', margin: '0 0 12px 0' },
  button: { padding: '8px 16px', fontSize: 13, fontWeight: 500, border: 'none', borderRadius: 8, cursor: 'pointer' },
};

export function NavigationModeSelector() {
  const { state, initProfile, setMode } = useCollectiveMemoryNavigation();
  
  if (!state.current_profile) {
    return (
      <div style={styles.card}>
        <h3 style={styles.title}>🧭 Personal Navigation</h3>
        <button style={{ ...styles.button, background: '#10B981', color: '#fff', width: '100%' }} onClick={() => initProfile('user_1')}>
          Initialize Profile
        </button>
      </div>
    );
  }
  
  return (
    <div style={styles.card}>
      <h3 style={styles.title}>🧭 Navigation Mode</h3>
      <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 12 }}>Visualization only — never changes data</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {NAVIGATION_MODES.map(mode => (
          <button
            key={mode.mode}
            onClick={() => setMode(mode.mode)}
            style={{
              padding: 12, borderRadius: 8, border: 'none', cursor: 'pointer', textAlign: 'center',
              background: state.current_profile?.mode === mode.mode ? mode.color : '#f3f4f6',
              color: state.current_profile?.mode === mode.mode ? '#fff' : '#374151',
            }}
          >
            <div style={{ fontSize: 24 }}>{mode.icon}</div>
            <div style={{ fontSize: 11, fontWeight: 600 }}>{mode.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

export function PreferencesPanel() {
  const { state, updatePreferences, resetToNeutral } = useCollectiveMemoryNavigation();
  if (!state.current_profile) return null;
  
  return (
    <div style={styles.card}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h4 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>Preferences</h4>
        <button style={{ ...styles.button, fontSize: 10, padding: '4px 10px', background: '#EF4444', color: '#fff' }} onClick={resetToNeutral}>
          Reset to Neutral
        </button>
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 11, color: '#6b7280' }}>Density: {(state.current_profile.preferences.density * 100).toFixed(0)}%</label>
        <input type="range" min="0" max="100" value={state.current_profile.preferences.density * 100}
          onChange={e => updatePreferences({ density: Number(e.target.value) / 100 })} style={{ width: '100%' }} />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 11, color: '#6b7280' }}>Routing Threshold: {(state.current_profile.preferences.routing_threshold * 100).toFixed(0)}%</label>
        <input type="range" min="0" max="100" value={state.current_profile.preferences.routing_threshold * 100}
          onChange={e => updatePreferences({ routing_threshold: Number(e.target.value) / 100 })} style={{ width: '100%' }} />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        {(['2d', '3d'] as const).map(vm => (
          <button key={vm} onClick={() => updatePreferences({ visual_mode: vm })}
            style={{ ...styles.button, flex: 1, background: state.current_profile?.preferences.visual_mode === vm ? '#8B5CF6' : '#f3f4f6',
              color: state.current_profile?.preferences.visual_mode === vm ? '#fff' : '#374151' }}>
            {vm.toUpperCase()}
          </button>
        ))}
      </div>
      {state.safety.filtered_view_indicator && state.sphere_filter && (
        <div style={{ marginTop: 12, padding: 8, background: '#FEF3C7', borderRadius: 6, fontSize: 11, color: '#92400E' }}>
          ⚠️ Filtered View Active: {state.sphere_filter}
        </div>
      )}
    </div>
  );
}

export function MemoryEntriesPanel() {
  const { state, addMemoryEntry, validateEntry, getFilteredEntries, setSphereFilter } = useCollectiveMemoryNavigation();
  const entries = getFilteredEntries();
  
  const handleAddDemo = () => {
    addMemoryEntry('event', 'replay_123', 'business', ['user_1'], { type: 'event', who: ['user_1'], when: new Date().toISOString(), where: 'meeting_room', action: 'Discussed Q4 goals', is_non_action: false });
    addMemoryEntry('decision', 'replay_123', 'business', ['user_1', 'user_2'], { type: 'decision', outcome: 'Approved budget increase', declared_at: new Date().toISOString(), declared_by: 'user_1' });
  };
  
  return (
    <div style={styles.card}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 style={{ ...styles.title, margin: 0 }}>📚 Collective Memory</h3>
        <button style={{ ...styles.button, fontSize: 10, padding: '4px 10px', background: '#8B5CF6', color: '#fff' }} onClick={handleAddDemo}>+ Demo Entries</button>
      </div>
      <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 12 }}>Aggregated FACTS only — append-only, immutable, hashed</p>
      
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 11, color: '#6b7280', display: 'block', marginBottom: 4 }}>Filter by Sphere</label>
        <select style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #e5e7eb' }}
          value={state.sphere_filter || ''} onChange={e => setSphereFilter(e.target.value || null)}>
          <option value="">All Spheres</option>
          <option value="business">Business</option>
          <option value="scholar">Scholar</option>
          <option value="creative">Creative</option>
        </select>
      </div>
      
      <div style={{ fontSize: 12, marginBottom: 8 }}>
        <strong>Total:</strong> {state.memory.total_entries} | <strong>Filtered:</strong> {entries.length} | <strong>Integrity:</strong> <span style={{ color: '#10B981' }}>✓ {state.memory.integrity}</span>
      </div>
      
      {entries.length === 0 ? (
        <div style={{ padding: 20, textAlign: 'center', color: '#9CA3AF' }}>No memory entries</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 200, overflowY: 'auto' }}>
          {entries.slice(-5).map(entry => (
            <div key={entry.id} style={{ padding: 10, background: '#f9fafb', borderRadius: 6, border: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 600 }}>{entry.type.toUpperCase()}</span>
                <span style={{ fontSize: 9, color: entry.validated ? '#10B981' : '#F59E0B' }}>{entry.validated ? '✓ Validated' : '⏳ Pending'}</span>
              </div>
              <div style={{ fontSize: 10, color: '#6b7280' }}>Sphere: {entry.sphere} | Hash: {entry.hash.slice(0, 20)}...</div>
              {!entry.validated && (
                <button style={{ ...styles.button, fontSize: 9, padding: '2px 6px', marginTop: 4, background: '#10B981', color: '#fff' }} onClick={() => validateEntry(entry.id)}>
                  Validate
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function MemoryRulesPanel() {
  return (
    <div style={styles.card}>
      <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>🛡️ Memory Rules</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
        {MEMORY_RULES.map(rule => (
          <div key={rule.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 6, background: '#D1FAE5', borderRadius: 4 }}>
            <span style={{ color: '#059669' }}>✓</span>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 11, fontWeight: 600 }}>{rule.name}</span>
              <span style={{ fontSize: 9, color: '#6b7280', marginLeft: 6 }}>{rule.enforcement}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 6, color: '#DC2626' }}>❌ NEVER Allowed:</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {MEMORY_NEVER_ALLOWED.map(item => (
          <span key={item} style={{ padding: '2px 8px', background: '#FEE2E2', color: '#991B1B', borderRadius: 4, fontSize: 9 }}>{item}</span>
        ))}
      </div>
    </div>
  );
}

export function CollectiveMemoryNavigationDashboard() {
  return (
    <div style={styles.container}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>📚 CHE·NU Collective Memory + Navigation</h1>
      <p style={{ color: '#6b7280', marginBottom: 20 }}>One reality • Many perspectives • Zero manipulation</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
        <div>
          <NavigationModeSelector />
          <MemoryEntriesPanel />
        </div>
        <div>
          <PreferencesPanel />
          <MemoryRulesPanel />
        </div>
      </div>
    </div>
  );
}
