/* =====================================================
   CHE·NU — Appearance Tab
   
   Theme and visual settings.
   ===================================================== */

import React from 'react';

import { CheNuPersonalization } from '../../../personalization/personalization.types';

// ─────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────

export interface AppearanceTabProps {
  state: CheNuPersonalization;
  onChange: (next: CheNuPersonalization) => void;
}

// ─────────────────────────────────────────────────────
// THEME DATA
// ─────────────────────────────────────────────────────

const THEMES = [
  { 
    id: 'realistic', 
    name: 'Réaliste', 
    icon: '🌿',
    color: '#22c55e',
    description: 'Tons naturels et apaisants',
  },
  { 
    id: 'ancient', 
    name: 'Ancien', 
    icon: '📜',
    color: '#d4a574',
    description: 'Sagesse et tradition',
  },
  { 
    id: 'cosmic', 
    name: 'Cosmique', 
    icon: '🌌',
    color: '#8b5cf6',
    description: 'Profondeur et mystère',
  },
  { 
    id: 'futurist', 
    name: 'Futuriste', 
    icon: '⚡',
    color: '#06b6d4',
    description: 'Innovation et technologie',
  },
];

const FONT_SIZES = [
  { id: 'small', label: 'Petit', size: '14px' },
  { id: 'medium', label: 'Moyen', size: '16px' },
  { id: 'large', label: 'Grand', size: '18px' },
];

const TRANSITION_SPEEDS = [
  { id: 'slow', label: 'Lent' },
  { id: 'normal', label: 'Normal' },
  { id: 'fast', label: 'Rapide' },
  { id: 'instant', label: 'Instant' },
];

// ─────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────

export function AppearanceTab({ state, onChange }: AppearanceTabProps) {
  const setTheme = (themeId: string) => {
    onChange({ ...state, themeGlobal: themeId, updatedAt: Date.now() });
  };

  const updateUI = (updates: Partial<typeof state.ui>) => {
    onChange({
      ...state,
      ui: { ...state.ui, ...updates },
      updatedAt: Date.now(),
    });
  };

  return (
    <div style={styles.tab}>
      <h3 style={styles.sectionTitle}>🎨 Thème global</h3>
      
      <div style={styles.themeGrid}>
        {THEMES.map(theme => (
          <button
            key={theme.id}
            onClick={() => setTheme(theme.id)}
            style={{
              ...styles.themeCard,
              borderColor: state.themeGlobal === theme.id ? theme.color : 'transparent',
              ...(state.themeGlobal === theme.id ? { boxShadow: `0 0 20px ${theme.color}40` } : {}),
            }}
          >
            <div 
              style={{
                ...styles.themePreview,
                background: `linear-gradient(135deg, ${theme.color}40, ${theme.color}20)`,
              }}
            >
              <span style={styles.themeIcon}>{theme.icon}</span>
            </div>
            <div style={styles.themeName}>{theme.name}</div>
            <div style={styles.themeDesc}>{theme.description}</div>
            {state.themeGlobal === theme.id && (
              <div style={{ ...styles.selectedBadge, background: theme.color }}>
                ✓
              </div>
            )}
          </button>
        ))}
      </div>

      <hr style={styles.divider} />

      <h3 style={styles.sectionTitle}>🔤 Typographie</h3>

      {/* Font size */}
      <div style={styles.field}>
        <label style={styles.label}>Taille de police</label>
        <div style={styles.buttonGroup}>
          {FONT_SIZES.map(size => (
            <button
              key={size.id}
              onClick={() => updateUI({ fontSize: size.id as any })}
              style={{
                ...styles.sizeButton,
                ...(state.ui.fontSize === size.id ? styles.sizeButtonActive : {}),
              }}
            >
              <span style={{ fontSize: size.size }}>Aa</span>
              <span style={styles.sizeLabel}>{size.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Font family */}
      <div style={styles.field}>
        <label style={styles.label}>Police</label>
        <select
          value={state.ui.fontFamily}
          onChange={(e) => updateUI({ fontFamily: e.target.value as any })}
          style={styles.select}
        >
          <option value="system">Système</option>
          <option value="inter">Inter</option>
          <option value="roboto">Roboto</option>
          <option value="mono">Monospace</option>
        </select>
      </div>

      <hr style={styles.divider} />

      <h3 style={styles.sectionTitle}>✨ Animations</h3>

      {/* Transition speed */}
      <div style={styles.field}>
        <label style={styles.label}>Vitesse des transitions</label>
        <div style={styles.buttonGroup}>
          {TRANSITION_SPEEDS.map(speed => (
            <button
              key={speed.id}
              onClick={() => updateUI({ transitionSpeed: speed.id as any })}
              style={{
                ...styles.optionButton,
                ...(state.ui.transitionSpeed === speed.id ? styles.optionButtonActive : {}),
              }}
            >
              {speed.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reduced motion */}
      <div style={styles.field}>
        <label style={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={state.ui.reducedMotion}
            onChange={() => updateUI({ reducedMotion: !state.ui.reducedMotion })}
            style={styles.checkbox}
          />
          <span>Réduire les animations</span>
        </label>
        <p style={styles.hint}>Recommandé pour les personnes sensibles au mouvement</p>
      </div>

      <hr style={styles.divider} />

      <h3 style={styles.sectionTitle}>♿ Accessibilité</h3>

      {/* High contrast */}
      <div style={styles.field}>
        <label style={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={state.ui.highContrast}
            onChange={() => updateUI({ highContrast: !state.ui.highContrast })}
            style={styles.checkbox}
          />
          <span>Mode contraste élevé</span>
        </label>
      </div>

      {/* Screen reader */}
      <div style={styles.field}>
        <label style={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={state.ui.screenReaderOptimized}
            onChange={() => updateUI({ screenReaderOptimized: !state.ui.screenReaderOptimized })}
            style={styles.checkbox}
          />
          <span>Optimisé pour lecteur d'écran</span>
        </label>
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
  sectionTitle: {
    margin: 0,
    fontSize: 16,
    fontWeight: 600,
    color: '#fff',
  },
  themeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 12,
  },
  themeCard: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    border: '2px solid transparent',
    background: 'rgba(0,0,0,0.3)',
    color: '#fff',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  themePreview: {
    width: 60,
    height: 60,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeIcon: {
    fontSize: 28,
  },
  themeName: {
    fontSize: 14,
    fontWeight: 600,
  },
  themeDesc: {
    fontSize: 11,
    opacity: 0.6,
    textAlign: 'center',
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    color: '#fff',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    margin: '8px 0',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: 500,
  },
  buttonGroup: {
    display: 'flex',
    gap: 8,
  },
  sizeButton: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    padding: '12px 8px',
    borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'transparent',
    color: 'rgba(255,255,255,0.7)',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  sizeButtonActive: {
    borderColor: '#6366f1',
    background: 'rgba(99,102,241,0.2)',
    color: '#fff',
  },
  sizeLabel: {
    fontSize: 10,
    opacity: 0.6,
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
    transition: 'all 0.2s',
  },
  optionButtonActive: {
    borderColor: '#6366f1',
    background: 'rgba(99,102,241,0.2)',
    color: '#fff',
  },
  select: {
    padding: '10px 12px',
    borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'rgba(0,0,0,0.3)',
    color: '#fff',
    fontSize: 14,
    cursor: 'pointer',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontSize: 14,
    cursor: 'pointer',
  },
  checkbox: {
    width: 18,
    height: 18,
    accentColor: '#6366f1',
  },
  hint: {
    margin: 0,
    fontSize: 11,
    opacity: 0.5,
    marginLeft: 28,
  },
};

export default AppearanceTab;
