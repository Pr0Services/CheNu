/* =====================================================
   CHE·NU — Spheres Tab
   
   Per-sphere personalization settings.
   ===================================================== */

import React, { useState, useMemo } from 'react';

import {
  CheNuPersonalization,
  SpherePersonalization,
  DEFAULT_SPHERE_PERSONALIZATION,
} from '../../../personalization/personalization.types';

import { getSpherePersonalization } from '../../../personalization/personalization.engine';

// ─────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────

export interface SpheresTabProps {
  state: CheNuPersonalization;
  onChange: (next: CheNuPersonalization) => void;
  availableSpheres?: string[];
}

// ─────────────────────────────────────────────────────
// SPHERE ICONS
// ─────────────────────────────────────────────────────

const SPHERE_ICONS: Record<string, string> = {
  personal: '👤',
  business: '💼',
  creative: '🎨',
  scholar: '📚',
  health: '❤️',
  finance: '💰',
  tech: '💻',
  default: '🔮',
};

const SPHERE_NAMES: Record<string, string> = {
  personal: 'Personnel',
  business: 'Affaires',
  creative: 'Créatif',
  scholar: 'Académique',
  health: 'Santé',
  finance: 'Finance',
  tech: 'Technologie',
};

// ─────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────

export function SpheresTab({ 
  state, 
  onChange, 
  availableSpheres = ['personal', 'business', 'creative', 'scholar'] 
}: SpheresTabProps) {
  const [expandedSphere, setExpandedSphere] = useState<string | null>(null);

  // Get all spheres with their preferences
  const spheresWithPrefs = useMemo(() => {
    return availableSpheres.map(id => ({
      id,
      ...getSpherePersonalization(state, id),
    }));
  }, [availableSpheres, state]);

  // Update a sphere
  const updateSphere = (sphereId: string, updates: Partial<SpherePersonalization>) => {
    const existing = state.spheres.find(s => s.sphereId === sphereId);
    
    let spheres: SpherePersonalization[];
    if (existing) {
      spheres = state.spheres.map(s =>
        s.sphereId === sphereId ? { ...s, ...updates } : s
      );
    } else {
      spheres = [
        ...state.spheres,
        { ...DEFAULT_SPHERE_PERSONALIZATION, sphereId, ...updates },
      ];
    }

    onChange({ ...state, spheres, updatedAt: Date.now() });
  };

  // Toggle all visible
  const toggleAllVisible = (visible: boolean) => {
    const spheres = availableSpheres.map(id => {
      const existing = state.spheres.find(s => s.sphereId === id);
      return existing 
        ? { ...existing, visible }
        : { ...DEFAULT_SPHERE_PERSONALIZATION, sphereId: id, visible };
    });
    onChange({ ...state, spheres, updatedAt: Date.now() });
  };

  return (
    <div style={styles.tab}>
      <div style={styles.header}>
        <h3 style={styles.sectionTitle}>🔮 Sphères</h3>
        <div style={styles.bulkActions}>
          <button
            onClick={() => toggleAllVisible(true)}
            style={styles.bulkButton}
          >
            Tout afficher
          </button>
          <button
            onClick={() => toggleAllVisible(false)}
            style={styles.bulkButton}
          >
            Tout masquer
          </button>
        </div>
      </div>

      <p style={styles.description}>
        Personnalisez l'affichage et le comportement de chaque sphère.
      </p>

      <div style={styles.sphereList}>
        {spheresWithPrefs.map(sphere => (
          <div key={sphere.id} style={styles.sphereCard}>
            {/* Header */}
            <div 
              style={styles.sphereHeader}
              onClick={() => setExpandedSphere(
                expandedSphere === sphere.id ? null : sphere.id
              )}
            >
              <div style={styles.sphereInfo}>
                <span style={styles.sphereIcon}>
                  {sphere.customIcon || SPHERE_ICONS[sphere.id] || SPHERE_ICONS.default}
                </span>
                <div>
                  <div style={styles.sphereName}>
                    {sphere.customName || SPHERE_NAMES[sphere.id] || sphere.id}
                  </div>
                  <div style={styles.sphereStats}>
                    {sphere.visitCount} visites • 
                    {sphere.lastVisited 
                      ? ` Dernière: ${new Date(sphere.lastVisited).toLocaleDateString('fr-CA')}`
                      : ' Jamais visité'}
                  </div>
                </div>
              </div>

              <div style={styles.sphereQuickActions}>
                <button
                  onClick={(e) => { e.stopPropagation(); updateSphere(sphere.id, { pinned: !sphere.pinned }); }}
                  style={{
                    ...styles.quickButton,
                    ...(sphere.pinned ? styles.quickButtonActive : {}),
                  }}
                  title="Épingler"
                >
                  📌
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); updateSphere(sphere.id, { visible: !sphere.visible }); }}
                  style={{
                    ...styles.quickButton,
                    ...(sphere.visible ? styles.quickButtonActive : {}),
                  }}
                  title="Visible"
                >
                  {sphere.visible ? '👁️' : '👁️‍🗨️'}
                </button>
                <span style={styles.expandIcon}>
                  {expandedSphere === sphere.id ? '▼' : '▶'}
                </span>
              </div>
            </div>

            {/* Expanded content */}
            {expandedSphere === sphere.id && (
              <div style={styles.sphereExpanded}>
                {/* Custom name */}
                <div style={styles.field}>
                  <label style={styles.label}>Nom personnalisé</label>
                  <input
                    type="text"
                    value={sphere.customName || ''}
                    placeholder={SPHERE_NAMES[sphere.id] || sphere.id}
                    onChange={(e) => updateSphere(sphere.id, { customName: e.target.value || undefined })}
                    style={styles.input}
                  />
                </div>

                {/* Theme override */}
                <div style={styles.field}>
                  <label style={styles.label}>Thème spécifique</label>
                  <select
                    value={sphere.themeOverride || ''}
                    onChange={(e) => updateSphere(sphere.id, { themeOverride: e.target.value || undefined })}
                    style={styles.select}
                  >
                    <option value="">Thème global ({state.themeGlobal})</option>
                    <option value="realistic">Réaliste</option>
                    <option value="ancient">Ancien</option>
                    <option value="cosmic">Cosmique</option>
                    <option value="futurist">Futuriste</option>
                  </select>
                </div>

                {/* Notifications */}
                <div style={styles.field}>
                  <label style={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={sphere.notificationsEnabled}
                      onChange={() => updateSphere(sphere.id, { 
                        notificationsEnabled: !sphere.notificationsEnabled 
                      })}
                      style={styles.checkbox}
                    />
                    <span>Notifications activées</span>
                  </label>
                </div>

                {/* Collapsed by default */}
                <div style={styles.field}>
                  <label style={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={sphere.collapsed}
                      onChange={() => updateSphere(sphere.id, { collapsed: !sphere.collapsed })}
                      style={styles.checkbox}
                    />
                    <span>Replié par défaut</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pinned spheres order */}
      {spheresWithPrefs.some(s => s.pinned) && (
        <div style={styles.pinnedSection}>
          <h4 style={styles.subsectionTitle}>📌 Ordre des sphères épinglées</h4>
          <p style={styles.hint}>
            Faites glisser pour réorganiser (bientôt disponible)
          </p>
          <div style={styles.pinnedList}>
            {spheresWithPrefs
              .filter(s => s.pinned)
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map(sphere => (
                <div key={sphere.id} style={styles.pinnedItem}>
                  <span>{SPHERE_ICONS[sphere.id] || '🔮'}</span>
                  <span>{sphere.customName || SPHERE_NAMES[sphere.id] || sphere.id}</span>
                </div>
              ))}
          </div>
        </div>
      )}
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    margin: 0,
    fontSize: 16,
    fontWeight: 600,
    color: '#fff',
  },
  bulkActions: {
    display: 'flex',
    gap: 8,
  },
  bulkButton: {
    padding: '6px 12px',
    borderRadius: 6,
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'transparent',
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    cursor: 'pointer',
  },
  description: {
    margin: 0,
    fontSize: 13,
    opacity: 0.6,
  },
  sphereList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  sphereCard: {
    borderRadius: 12,
    background: 'rgba(0,0,0,0.2)',
    overflow: 'hidden',
    transition: 'all 0.2s',
  },
  sphereHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  sphereInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  sphereIcon: {
    fontSize: 24,
  },
  sphereName: {
    fontSize: 14,
    fontWeight: 500,
  },
  sphereStats: {
    fontSize: 11,
    opacity: 0.5,
  },
  sphereQuickActions: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  quickButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    border: 'none',
    background: 'rgba(255,255,255,0.1)',
    fontSize: 14,
    cursor: 'pointer',
    transition: 'all 0.2s',
    opacity: 0.5,
  },
  quickButtonActive: {
    background: 'rgba(99,102,241,0.3)',
    opacity: 1,
  },
  expandIcon: {
    fontSize: 10,
    opacity: 0.5,
    marginLeft: 8,
  },
  sphereExpanded: {
    padding: '16px',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    background: 'rgba(0,0,0,0.1)',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: 500,
    opacity: 0.8,
  },
  input: {
    padding: '10px 12px',
    borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'rgba(0,0,0,0.2)',
    color: '#fff',
    fontSize: 14,
  },
  select: {
    padding: '10px 12px',
    borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'rgba(0,0,0,0.2)',
    color: '#fff',
    fontSize: 14,
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
  pinnedSection: {
    marginTop: 8,
    padding: 16,
    borderRadius: 12,
    background: 'rgba(99,102,241,0.1)',
    border: '1px solid rgba(99,102,241,0.3)',
  },
  subsectionTitle: {
    margin: '0 0 8px 0',
    fontSize: 14,
    fontWeight: 500,
  },
  hint: {
    margin: '0 0 12px 0',
    fontSize: 11,
    opacity: 0.5,
  },
  pinnedList: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
  },
  pinnedItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 12px',
    borderRadius: 8,
    background: 'rgba(0,0,0,0.2)',
    fontSize: 13,
  },
};

export default SpheresTab;
