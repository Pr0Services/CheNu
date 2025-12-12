/* =====================================================
   CHE·NU — XR Tab
   
   VR/AR personalization settings.
   ===================================================== */

import React from 'react';

import {
  CheNuPersonalization,
  XRPersonalization,
  XRAmbiance,
} from '../../../personalization/personalization.types';

// ─────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────

export interface XRTabProps {
  state: CheNuPersonalization;
  onChange: (next: CheNuPersonalization) => void;
}

// ─────────────────────────────────────────────────────
// XR DATA
// ─────────────────────────────────────────────────────

const AMBIANCES: { id: XRAmbiance; name: string; icon: string; color: string }[] = [
  { id: 'calm', name: 'Calme', icon: '🌊', color: '#3b82f6' },
  { id: 'focused', name: 'Focus', icon: '🎯', color: '#f97316' },
  { id: 'cosmic', name: 'Cosmique', icon: '🌌', color: '#8b5cf6' },
  { id: 'nature', name: 'Nature', icon: '🌿', color: '#22c55e' },
  { id: 'minimal', name: 'Minimal', icon: '◯', color: '#6b7280' },
];

const QUALITY_LEVELS = [
  { id: 'low', name: 'Basse', desc: 'Performance max' },
  { id: 'medium', name: 'Moyenne', desc: 'Équilibré' },
  { id: 'high', name: 'Haute', desc: 'Visuels nets' },
  { id: 'ultra', name: 'Ultra', desc: 'Maximum' },
];

// ─────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────

export function XRTab({ state, onChange }: XRTabProps) {
  const updateXR = (updates: Partial<XRPersonalization>) => {
    onChange({
      ...state,
      xr: { ...state.xr, ...updates },
      updatedAt: Date.now(),
    });
  };

  return (
    <div style={styles.tab}>
      {/* Main toggle */}
      <div style={{
        ...styles.mainToggle,
        background: state.xr.enabled 
          ? 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(99,102,241,0.3))'
          : 'rgba(0,0,0,0.2)',
        borderColor: state.xr.enabled ? '#8b5cf6' : 'transparent',
      }}>
        <div style={styles.toggleInfo}>
          <span style={styles.toggleIcon}>🥽</span>
          <div>
            <div style={styles.toggleTitle}>Mode XR</div>
            <div style={styles.toggleDesc}>
              Expérience immersive VR/AR
            </div>
          </div>
        </div>
        <button
          onClick={() => updateXR({ enabled: !state.xr.enabled })}
          style={{
            ...styles.toggleButton,
            background: state.xr.enabled ? '#8b5cf6' : 'rgba(255,255,255,0.2)',
          }}
        >
          {state.xr.enabled ? 'ON' : 'OFF'}
        </button>
      </div>

      {!state.xr.enabled && (
        <p style={styles.disabledHint}>
          Activez le mode XR pour accéder aux paramètres
        </p>
      )}

      <div style={{ opacity: state.xr.enabled ? 1 : 0.4, pointerEvents: state.xr.enabled ? 'auto' : 'none' }}>
        {/* Ambiance */}
        <h3 style={styles.sectionTitle}>✨ Ambiance</h3>
        <div style={styles.ambianceGrid}>
          {AMBIANCES.map(amb => (
            <button
              key={amb.id}
              onClick={() => updateXR({ ambiance: amb.id })}
              style={{
                ...styles.ambianceCard,
                borderColor: state.xr.ambiance === amb.id ? amb.color : 'transparent',
                ...(state.xr.ambiance === amb.id ? { boxShadow: `0 0 20px ${amb.color}40` } : {}),
              }}
            >
              <span style={styles.ambianceIcon}>{amb.icon}</span>
              <span style={styles.ambianceName}>{amb.name}</span>
            </button>
          ))}
        </div>

        <hr style={styles.divider} />

        {/* Quality */}
        <h3 style={styles.sectionTitle}>⚡ Qualité</h3>
        <div style={styles.qualityGrid}>
          {QUALITY_LEVELS.map(q => (
            <button
              key={q.id}
              onClick={() => updateXR({ qualityLevel: q.id as any })}
              style={{
                ...styles.qualityButton,
                ...(state.xr.qualityLevel === q.id ? styles.qualityButtonActive : {}),
              }}
            >
              <strong>{q.name}</strong>
              <span style={styles.qualityDesc}>{q.desc}</span>
            </button>
          ))}
        </div>

        <hr style={styles.divider} />

        {/* Visual options */}
        <h3 style={styles.sectionTitle}>👁️ Visuels</h3>
        
        <div style={styles.optionsGrid}>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={state.xr.showHands}
              onChange={() => updateXR({ showHands: !state.xr.showHands })}
              style={styles.checkbox}
            />
            <span>Afficher les mains</span>
          </label>

          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={state.xr.showAvatars}
              onChange={() => updateXR({ showAvatars: !state.xr.showAvatars })}
              style={styles.checkbox}
            />
            <span>Afficher les avatars</span>
          </label>

          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={state.xr.particleEffects}
              onChange={() => updateXR({ particleEffects: !state.xr.particleEffects })}
              style={styles.checkbox}
            />
            <span>Effets de particules</span>
          </label>

          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={state.xr.bloomEffect}
              onChange={() => updateXR({ bloomEffect: !state.xr.bloomEffect })}
              style={styles.checkbox}
            />
            <span>Effet bloom</span>
          </label>
        </div>

        <hr style={styles.divider} />

        {/* Interaction options */}
        <h3 style={styles.sectionTitle}>🎮 Interactions</h3>
        
        <div style={styles.optionsGrid}>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={state.xr.gesturesEnabled}
              onChange={() => updateXR({ gesturesEnabled: !state.xr.gesturesEnabled })}
              style={styles.checkbox}
            />
            <span>Gestes activés</span>
          </label>

          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={state.xr.voiceEnabled}
              onChange={() => updateXR({ voiceEnabled: !state.xr.voiceEnabled })}
              style={styles.checkbox}
            />
            <span>Commandes vocales</span>
          </label>

          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={state.xr.hapticFeedback}
              onChange={() => updateXR({ hapticFeedback: !state.xr.hapticFeedback })}
              style={styles.checkbox}
            />
            <span>Retour haptique</span>
          </label>
        </div>

        <hr style={styles.divider} />

        {/* Comfort options */}
        <h3 style={styles.sectionTitle}>🛋️ Confort</h3>
        
        <div style={styles.optionsGrid}>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={state.xr.teleportOnly}
              onChange={() => updateXR({ teleportOnly: !state.xr.teleportOnly })}
              style={styles.checkbox}
            />
            <span>Téléportation uniquement</span>
          </label>

          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={state.xr.snapTurning}
              onChange={() => updateXR({ snapTurning: !state.xr.snapTurning })}
              style={styles.checkbox}
            />
            <span>Rotation par paliers</span>
          </label>

          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={state.xr.vignetteOnMove}
              onChange={() => updateXR({ vignetteOnMove: !state.xr.vignetteOnMove })}
              style={styles.checkbox}
            />
            <span>Vignette en mouvement</span>
          </label>
        </div>

        {/* Sit scale */}
        <div style={styles.field}>
          <label style={styles.label}>
            Échelle assis/debout: {state.xr.sitScale.toFixed(2)}
          </label>
          <input
            type="range"
            min="0.5"
            max="1.5"
            step="0.05"
            value={state.xr.sitScale}
            onChange={(e) => updateXR({ sitScale: parseFloat(e.target.value) })}
            style={styles.slider}
          />
          <div style={styles.sliderLabels}>
            <span>Assis (0.5)</span>
            <span>Normal (1.0)</span>
            <span>Debout (1.5)</span>
          </div>
        </div>

        {/* Info box */}
        <div style={styles.infoBox}>
          <span style={styles.infoIcon}>💡</span>
          <p style={styles.infoText}>
            Les options de confort aident à réduire le mal des transports en VR.
            Activez-les si vous ressentez une gêne.
          </p>
        </div>
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
    gap: 20,
  },
  mainToggle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    border: '2px solid',
    transition: 'all 0.3s',
  },
  toggleInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  toggleIcon: {
    fontSize: 32,
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: 600,
  },
  toggleDesc: {
    fontSize: 12,
    opacity: 0.6,
  },
  toggleButton: {
    padding: '10px 24px',
    borderRadius: 20,
    border: 'none',
    color: '#fff',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  disabledHint: {
    margin: 0,
    fontSize: 13,
    opacity: 0.5,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  sectionTitle: {
    margin: 0,
    fontSize: 14,
    fontWeight: 600,
    color: '#fff',
  },
  ambianceGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: 8,
  },
  ambianceCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    padding: 12,
    borderRadius: 10,
    border: '2px solid transparent',
    background: 'rgba(0,0,0,0.2)',
    color: '#fff',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  ambianceIcon: {
    fontSize: 24,
  },
  ambianceName: {
    fontSize: 11,
    fontWeight: 500,
  },
  divider: {
    border: 'none',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    margin: '4px 0',
  },
  qualityGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 8,
  },
  qualityButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
    padding: '12px 8px',
    borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'transparent',
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  qualityButtonActive: {
    borderColor: '#6366f1',
    background: 'rgba(99,102,241,0.2)',
    color: '#fff',
  },
  qualityDesc: {
    fontSize: 9,
    opacity: 0.6,
  },
  optionsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
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
    accentColor: '#8b5cf6',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    marginTop: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: 500,
  },
  slider: {
    width: '100%',
    accentColor: '#8b5cf6',
  },
  sliderLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 10,
    opacity: 0.5,
  },
  infoBox: {
    display: 'flex',
    gap: 12,
    padding: 12,
    borderRadius: 10,
    background: 'rgba(59,130,246,0.1)',
    border: '1px solid rgba(59,130,246,0.3)',
  },
  infoIcon: {
    fontSize: 20,
  },
  infoText: {
    margin: 0,
    fontSize: 12,
    lineHeight: 1.5,
    opacity: 0.8,
  },
};

export default XRTab;
