/* =====================================================
   CHE·NU — Layout Tab
   
   Density and layout settings.
   ===================================================== */

import React from 'react';

import {
  CheNuPersonalization,
  DensityLevel,
  DENSITY_DESCRIPTIONS,
} from '../../../personalization/personalization.types';

import { DENSITY_CONFIGS } from '../../../personalization/personalization.defaults';

// ─────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────

export interface LayoutTabProps {
  state: CheNuPersonalization;
  onChange: (next: CheNuPersonalization) => void;
}

// ─────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────

export function LayoutTab({ state, onChange }: LayoutTabProps) {
  const setDensity = (density: DensityLevel) => {
    onChange({ ...state, density, updatedAt: Date.now() });
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
      <h3 style={styles.sectionTitle}>📐 Densité d'information</h3>
      
      <div style={styles.densityGrid}>
        {(['minimal', 'balanced', 'rich'] as DensityLevel[]).map(density => (
          <button
            key={density}
            onClick={() => setDensity(density)}
            style={{
              ...styles.densityCard,
              ...(state.density === density ? styles.densityCardSelected : {}),
            }}
          >
            <div style={styles.densityIcon}>
              {density === 'minimal' ? '◯' : density === 'balanced' ? '◐' : '●'}
            </div>
            <div style={styles.densityName}>
              {density === 'minimal' ? 'Minimal' : 
               density === 'balanced' ? 'Équilibré' : 'Riche'}
            </div>
            <div style={styles.densityDesc}>
              {DENSITY_DESCRIPTIONS[density]}
            </div>
          </button>
        ))}
      </div>

      <div style={styles.preview}>
        <h4 style={styles.previewTitle}>Aperçu des paramètres</h4>
        <div style={styles.previewGrid}>
          <div style={styles.previewItem}>
            <span>Avatars agents</span>
            <span>{DENSITY_CONFIGS[state.density].showAgentAvatars ? '✓' : '✗'}</span>
          </div>
          <div style={styles.previewItem}>
            <span>Descriptions</span>
            <span>{DENSITY_CONFIGS[state.density].showSphereDescriptions ? '✓' : '✗'}</span>
          </div>
          <div style={styles.previewItem}>
            <span>Horodatages</span>
            <span>{DENSITY_CONFIGS[state.density].showTimestamps ? '✓' : '✗'}</span>
          </div>
          <div style={styles.previewItem}>
            <span>Agents max visibles</span>
            <span>{DENSITY_CONFIGS[state.density].maxVisibleAgents}</span>
          </div>
        </div>
      </div>

      <hr style={styles.divider} />

      <h3 style={styles.sectionTitle}>📱 Interface</h3>

      {/* Sidebar position */}
      <div style={styles.field}>
        <label style={styles.label}>Position de la barre latérale</label>
        <div style={styles.buttonGroup}>
          {(['left', 'right', 'hidden'] as const).map(pos => (
            <button
              key={pos}
              onClick={() => updateUI({ sidebarPosition: pos })}
              style={{
                ...styles.optionButton,
                ...(state.ui.sidebarPosition === pos ? styles.optionButtonActive : {}),
              }}
            >
              {pos === 'left' ? '◀ Gauche' : pos === 'right' ? 'Droite ▶' : '✗ Caché'}
            </button>
          ))}
        </div>
      </div>

      {/* Compact mode */}
      <div style={styles.field}>
        <label style={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={state.ui.compactMode}
            onChange={() => updateUI({ compactMode: !state.ui.compactMode })}
            style={styles.checkbox}
          />
          <span>Mode compact</span>
        </label>
        <p style={styles.hint}>Réduit les marges et espacements</p>
      </div>

      {/* Show breadcrumbs */}
      <div style={styles.field}>
        <label style={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={state.ui.showBreadcrumbs}
            onChange={() => updateUI({ showBreadcrumbs: !state.ui.showBreadcrumbs })}
            style={styles.checkbox}
          />
          <span>Afficher le fil d'Ariane</span>
        </label>
      </div>

      {/* Show minimap */}
      <div style={styles.field}>
        <label style={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={state.ui.showMinimap}
            onChange={() => updateUI({ showMinimap: !state.ui.showMinimap })}
            style={styles.checkbox}
          />
          <span>Afficher la mini-carte</span>
        </label>
      </div>

      {/* Remember last location */}
      <div style={styles.field}>
        <label style={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={state.ui.rememberLastLocation}
            onChange={() => updateUI({ rememberLastLocation: !state.ui.rememberLastLocation })}
            style={styles.checkbox}
          />
          <span>Mémoriser la dernière position</span>
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
  densityGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 12,
  },
  densityCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    border: '2px solid rgba(255,255,255,0.1)',
    background: 'rgba(0,0,0,0.2)',
    color: '#fff',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  densityCardSelected: {
    borderColor: '#6366f1',
    background: 'rgba(99,102,241,0.2)',
  },
  densityIcon: {
    fontSize: 32,
    opacity: 0.8,
  },
  densityName: {
    fontSize: 14,
    fontWeight: 600,
  },
  densityDesc: {
    fontSize: 11,
    opacity: 0.6,
    textAlign: 'center',
  },
  preview: {
    padding: 16,
    borderRadius: 12,
    background: 'rgba(0,0,0,0.2)',
  },
  previewTitle: {
    margin: '0 0 12px 0',
    fontSize: 13,
    fontWeight: 500,
    opacity: 0.7,
  },
  previewGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 8,
  },
  previewItem: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 12,
    opacity: 0.8,
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

export default LayoutTab;
