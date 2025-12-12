/**
 * CHE·NU — XR PRESETS PACK
 * React UI Components
 */

import React, { useState, CSSProperties } from 'react';
import { useXRPresets } from './XRPresetsContext';
import { XRPreset, XRPresetId, NavigationMode } from './types';

// ============================================================
// STYLES
// ============================================================

const styles: Record<string, CSSProperties> = {
  container: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    padding: 20,
    maxWidth: 900,
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 600,
    color: '#1f2937',
    margin: 0,
  },
  subtitle: {
    fontSize: 13,
    color: '#6b7280',
    margin: '4px 0 0 0',
  },
  button: {
    padding: '10px 20px',
    fontSize: 14,
    fontWeight: 500,
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  buttonPrimary: {
    background: '#06B6D4',
    color: '#fff',
  },
  buttonSecondary: {
    background: '#f3f4f6',
    color: '#374151',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 16,
  },
  badge: {
    display: 'inline-block',
    padding: '3px 10px',
    fontSize: 11,
    fontWeight: 600,
    borderRadius: 20,
  },
  progressBar: {
    width: '100%',
    height: 6,
    background: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: '#06B6D4',
    borderRadius: 3,
    transition: 'width 0.3s ease',
  },
};

// ============================================================
// PRESET CARD
// ============================================================

interface PresetCardProps {
  preset: XRPreset;
  isActive?: boolean;
  onSelect: (id: XRPresetId) => void;
}

export function PresetCard({ preset, isActive, onSelect }: PresetCardProps) {
  return (
    <div
      style={{
        ...styles.card,
        border: isActive ? `2px solid ${preset.color}` : '1px solid #e5e7eb',
        background: isActive ? `${preset.color}08` : '#fff',
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
      onClick={() => onSelect(preset.id)}
    >
      {/* Header with color bar */}
      <div style={{
        height: 8,
        background: preset.color,
        borderRadius: '8px 8px 0 0',
        margin: '-16px -16px 16px -16px',
      }} />
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: preset.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 24,
        }}>
          {preset.icon}
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>{preset.name}</h3>
          <span style={{ ...styles.badge, background: `${preset.color}20`, color: preset.color }}>
            {preset.id}
          </span>
        </div>
      </div>
      
      <p style={{ margin: '0 0 12px', fontSize: 13, color: '#6b7280', lineHeight: 1.5 }}>
        {preset.description}
      </p>
      
      {/* Properties */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, fontSize: 12 }}>
        <div style={{ color: '#6b7280' }}>
          💡 <strong>Lighting:</strong> {preset.lighting.type}
        </div>
        <div style={{ color: '#6b7280' }}>
          🌌 <strong>Sky:</strong> {preset.sky.type}
        </div>
        <div style={{ color: '#6b7280' }}>
          📏 <strong>Radius:</strong> {preset.interaction_radius}m
        </div>
        <div style={{ color: '#6b7280' }}>
          🎨 <strong>Decor:</strong> {preset.decor.length} items
        </div>
      </div>
      
      {/* Special features */}
      {preset.special && preset.special.length > 0 && (
        <div style={{
          marginTop: 12,
          padding: 8,
          background: `${preset.color}10`,
          borderRadius: 6,
          fontSize: 11,
        }}>
          <strong style={{ color: preset.color }}>⭐ Special:</strong>{' '}
          <span style={{ color: '#374151' }}>{preset.special[0].name}</span>
        </div>
      )}
      
      {/* Active indicator */}
      {isActive && (
        <div style={{
          marginTop: 12,
          padding: 8,
          background: '#D1FAE5',
          borderRadius: 6,
          fontSize: 12,
          color: '#059669',
          textAlign: 'center',
          fontWeight: 600,
        }}>
          ✓ Currently Active
        </div>
      )}
    </div>
  );
}

// ============================================================
// PRESET SELECTOR
// ============================================================

export function PresetSelector() {
  const { state, getAllPresets, loadPreset, transitionTo } = useXRPresets();
  const presets = getAllPresets();
  
  const handleSelect = async (id: XRPresetId) => {
    if (state.currentPreset) {
      await transitionTo(id);
    } else {
      await loadPreset(id);
    }
  };
  
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>🥽 XR Presets</h2>
          <p style={styles.subtitle}>Select an immersive environment</p>
        </div>
      </div>
      
      <div style={styles.grid}>
        {presets.map(preset => (
          <PresetCard
            key={preset.id}
            preset={preset}
            isActive={state.currentPreset === preset.id}
            onSelect={handleSelect}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================================
// CURRENT PRESET DISPLAY
// ============================================================

export function CurrentPresetDisplay() {
  const { state, unloadPreset } = useXRPresets();
  
  if (!state.presetData) {
    return (
      <div style={{ ...styles.card, textAlign: 'center', color: '#6b7280', padding: 40 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🥽</div>
        <p>No preset loaded. Select one to begin.</p>
      </div>
    );
  }
  
  const preset = state.presetData;
  
  return (
    <div style={{ ...styles.card, border: `2px solid ${preset.color}` }}>
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: preset.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32,
          }}>
            {preset.icon}
          </div>
          <div>
            <h2 style={styles.title}>{preset.name}</h2>
            <p style={styles.subtitle}>{preset.description}</p>
          </div>
        </div>
        <button
          style={{ ...styles.button, ...styles.buttonSecondary }}
          onClick={unloadPreset}
        >
          Unload
        </button>
      </div>
      
      {/* Preview area */}
      <div style={{
        height: 200,
        borderRadius: 12,
        background: `linear-gradient(135deg, ${preset.sky.primary_color}, ${preset.sky.secondary_color})`,
        marginBottom: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Floor simulation */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 60,
          background: preset.floor.color,
          opacity: 0.8,
        }} />
        
        {/* Center icon */}
        <div style={{
          fontSize: 64,
          filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))',
          zIndex: 1,
        }}>
          {preset.icon}
        </div>
        
        {/* Lighting indicator */}
        <div style={{
          position: 'absolute',
          top: 12,
          left: 12,
          padding: '4px 12px',
          background: 'rgba(0,0,0,0.5)',
          borderRadius: 20,
          color: '#fff',
          fontSize: 11,
        }}>
          💡 {preset.lighting.type} ({Math.round(preset.lighting.intensity * 100)}%)
        </div>
      </div>
      
      {/* Properties grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
        {[
          { icon: '🎵', label: 'Ambience', value: preset.ambience.sounds.length + ' sounds' },
          { icon: '📏', label: 'Radius', value: preset.interaction_radius + 'm' },
          { icon: '🖼️', label: 'UI', value: preset.ui_layer.type.replace(/_/g, ' ') },
          { icon: '👤', label: 'Avatar', value: preset.avatar_style.type },
        ].map((prop, i) => (
          <div key={i} style={{
            background: '#f9fafb',
            borderRadius: 8,
            padding: 12,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>{prop.icon}</div>
            <div style={{ fontSize: 10, color: '#6b7280', marginBottom: 2 }}>{prop.label}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{prop.value}</div>
          </div>
        ))}
      </div>
      
      {/* Decor list */}
      <div style={{ marginBottom: 16 }}>
        <h4 style={{ margin: '0 0 8px', fontSize: 13, color: '#374151' }}>🎨 Decor Elements</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {preset.decor.map(item => (
            <span key={item.id} style={{
              ...styles.badge,
              background: item.interactive ? '#D1FAE5' : '#f3f4f6',
              color: item.interactive ? '#059669' : '#6b7280',
            }}>
              {item.interactive ? '✋ ' : ''}{item.name}
            </span>
          ))}
        </div>
      </div>
      
      {/* Constraints */}
      <div style={{
        padding: 12,
        background: '#FEF3C7',
        borderRadius: 8,
        fontSize: 12,
      }}>
        <strong style={{ color: '#92400E' }}>⚠️ Accessibility:</strong>{' '}
        <span style={{ color: '#78350F' }}>
          {preset.constraints.accessibility_safe ? '✓ Safe' : '⚡ Contains motion'}
          {preset.constraints.reduced_parallax && ' • Reduced parallax'}
          {preset.constraints.capped_brightness && ' • Capped brightness'}
        </span>
      </div>
    </div>
  );
}

// ============================================================
// LOADING OVERLAY
// ============================================================

export function LoadingOverlay() {
  const { state } = useXRPresets();
  
  if (!state.isLoading && !state.runtime.transitioning) {
    return null;
  }
  
  const progress = state.isLoading ? state.loadProgress : state.runtime.transition_progress;
  const message = state.isLoading ? 'Loading preset...' : 'Transitioning...';
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 15, 26, 0.9)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: '#1F2937',
        borderRadius: 16,
        padding: 32,
        width: 320,
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🥽</div>
        <div style={{ color: '#F9FAFB', fontSize: 16, marginBottom: 16 }}>{message}</div>
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${progress}%` }} />
        </div>
        <div style={{ color: '#9CA3AF', fontSize: 12, marginTop: 8 }}>
          {Math.round(progress)}%
        </div>
      </div>
    </div>
  );
}

// ============================================================
// NAVIGATION CONTROLS
// ============================================================

export function NavigationControls() {
  const { state, setNavigationMode, toggleSafety, getUniversalRules } = useXRPresets();
  const rules = getUniversalRules();
  
  const modes: { mode: NavigationMode; label: string; icon: string }[] = [
    { mode: 'teleport_step', label: 'Teleport', icon: '⚡' },
    { mode: 'slow-glide', label: 'Slow Glide', icon: '🌊' },
    { mode: 'fixed-node', label: 'Fixed Node', icon: '📍' },
  ];
  
  return (
    <div style={styles.card}>
      <h3 style={{ ...styles.title, fontSize: 14, marginBottom: 12 }}>🧭 Navigation</h3>
      
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {modes.map(({ mode, label, icon }) => (
          <button
            key={mode}
            style={{
              ...styles.button,
              flex: 1,
              background: state.navigationMode === mode ? '#06B6D4' : '#f3f4f6',
              color: state.navigationMode === mode ? '#fff' : '#374151',
            }}
            onClick={() => setNavigationMode(mode)}
          >
            {icon} {label}
          </button>
        ))}
      </div>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        background: state.safetyEnabled ? '#D1FAE5' : '#FEE2E2',
        borderRadius: 8,
      }}>
        <span style={{ fontSize: 13, color: state.safetyEnabled ? '#059669' : '#DC2626' }}>
          🛡️ Safety Features
        </span>
        <button
          style={{
            ...styles.button,
            padding: '6px 12px',
            background: state.safetyEnabled ? '#059669' : '#DC2626',
            color: '#fff',
          }}
          onClick={() => toggleSafety(!state.safetyEnabled)}
        >
          {state.safetyEnabled ? 'Enabled' : 'Disabled'}
        </button>
      </div>
      
      {state.safetyEnabled && (
        <div style={{ marginTop: 12, fontSize: 11, color: '#6b7280' }}>
          <div>• Boundary mesh: {rules.safety.boundary_mesh ? 'Active' : 'Off'}</div>
          <div>• Auto recenter: {rules.safety.auto_recenter ? 'Active' : 'Off'}</div>
          <div>• Collision: {rules.safety.collision_soft ? 'Soft' : 'Hard'}</div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// PRESET RECOMMENDER
// ============================================================

export function PresetRecommender() {
  const { recommendPreset, loadPreset } = useXRPresets();
  const [criteria, setCriteria] = useState<{
    mood?: string;
    task?: string;
  }>({});
  
  const handleRecommend = async () => {
    const id = recommendPreset(criteria as any);
    await loadPreset(id);
  };
  
  return (
    <div style={styles.card}>
      <h3 style={{ ...styles.title, fontSize: 14, marginBottom: 12 }}>✨ Find Your Environment</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: '#6b7280', marginBottom: 4 }}>
            Current Mood
          </label>
          <select
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: 8,
              border: '1px solid #e5e7eb',
              fontSize: 14,
            }}
            value={criteria.mood || ''}
            onChange={e => setCriteria(p => ({ ...p, mood: e.target.value || undefined }))}
          >
            <option value="">Any</option>
            <option value="calm">Calm</option>
            <option value="expansive">Expansive</option>
            <option value="focused">Focused</option>
            <option value="analytical">Analytical</option>
            <option value="creative">Creative</option>
          </select>
        </div>
        
        <div>
          <label style={{ display: 'block', fontSize: 12, color: '#6b7280', marginBottom: 4 }}>
            Task Type
          </label>
          <select
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: 8,
              border: '1px solid #e5e7eb',
              fontSize: 14,
            }}
            value={criteria.task || ''}
            onChange={e => setCriteria(p => ({ ...p, task: e.target.value || undefined }))}
          >
            <option value="">Any</option>
            <option value="general">General</option>
            <option value="construction">Construction</option>
            <option value="analysis">Analysis</option>
            <option value="meditation">Meditation</option>
            <option value="collaboration">Collaboration</option>
          </select>
        </div>
      </div>
      
      <button
        style={{ ...styles.button, ...styles.buttonPrimary, width: '100%' }}
        onClick={handleRecommend}
      >
        🎯 Recommend Environment
      </button>
    </div>
  );
}

// ============================================================
// FULL DASHBOARD
// ============================================================

export function XRPresetsDashboard() {
  return (
    <div style={styles.container}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4, color: '#1F2937' }}>
        🥽 CHE·NU XR Presets
      </h1>
      <p style={{ color: '#6b7280', marginBottom: 24 }}>
        5 curated immersive environments for spatial experiences
      </p>
      
      <LoadingOverlay />
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
        <div>
          <CurrentPresetDisplay />
          <PresetSelector />
        </div>
        
        <div>
          <PresetRecommender />
          <NavigationControls />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// EXPORTS
// ============================================================

export {
  PresetCard,
  PresetSelector,
  CurrentPresetDisplay,
  LoadingOverlay,
  NavigationControls,
  PresetRecommender,
  XRPresetsDashboard,
};
