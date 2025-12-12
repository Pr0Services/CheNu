/* =====================================================
   CHE·NU — Personalization Panel
   
   Main settings panel for user customization.
   ===================================================== */

import React, { useState, useCallback } from 'react';

import {
  CheNuPersonalization,
  DensityLevel,
  DENSITY_DESCRIPTIONS,
} from '../../personalization/personalization.types';

import {
  PRESETS,
  applyPreset,
} from '../../personalization/personalization.defaults';

import {
  downloadPersonalization,
  importPersonalization,
  resetPersonalization,
  createBackup,
} from '../../personalization/personalization.store';

import { LayoutTab } from './tabs/LayoutTab';
import { AppearanceTab } from './tabs/AppearanceTab';
import { SpheresTab } from './tabs/SpheresTab';
import { AgentsTab } from './tabs/AgentsTab';
import { XRTab } from './tabs/XRTab';
import { NotificationsTab } from './tabs/NotificationsTab';
import { ShortcutsTab } from './tabs/ShortcutsTab';

// ─────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────

export type TabKey = 
  | 'layout' 
  | 'appearance' 
  | 'spheres' 
  | 'agents' 
  | 'xr'
  | 'notifications'
  | 'shortcuts';

export interface PersonalizationPanelProps {
  state: CheNuPersonalization;
  onChange: (next: CheNuPersonalization) => void;
  onClose?: () => void;
  availableSpheres?: string[];
  availableAgents?: string[];
  className?: string;
}

// ─────────────────────────────────────────────────────
// TAB CONFIG
// ─────────────────────────────────────────────────────

const TABS: { key: TabKey; label: string; labelFr: string; icon: string }[] = [
  { key: 'layout', label: 'Layout', labelFr: 'Disposition', icon: '📐' },
  { key: 'appearance', label: 'Appearance', labelFr: 'Apparence', icon: '🎨' },
  { key: 'spheres', label: 'Spheres', labelFr: 'Sphères', icon: '🔮' },
  { key: 'agents', label: 'Agents', labelFr: 'Agents', icon: '🤖' },
  { key: 'xr', label: 'XR', labelFr: 'XR', icon: '🥽' },
  { key: 'notifications', label: 'Notifications', labelFr: 'Notifications', icon: '🔔' },
  { key: 'shortcuts', label: 'Shortcuts', labelFr: 'Raccourcis', icon: '⌨️' },
];

// ─────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────

export function PersonalizationPanel({
  state,
  onChange,
  onClose,
  availableSpheres = [],
  availableAgents = [],
  className = '',
}: PersonalizationPanelProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('layout');
  const [showPresets, setShowPresets] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Handle preset selection
  const handlePreset = useCallback((presetId: string) => {
    const updated = applyPreset(state, presetId);
    onChange(updated);
    setShowPresets(false);
  }, [state, onChange]);

  // Handle export
  const handleExport = useCallback(() => {
    downloadPersonalization();
  }, []);

  // Handle import
  const handleImport = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const text = await file.text();
      const imported = importPersonalization(text);
      if (imported) {
        onChange(imported);
      } else {
        alert('Fichier invalide');
      }
    };
    input.click();
  }, [onChange]);

  // Handle reset
  const handleReset = useCallback(() => {
    createBackup();
    const fresh = resetPersonalization(['language']);
    onChange(fresh);
    setShowResetConfirm(false);
  }, [onChange]);

  // Render tab content
  const renderTabContent = () => {
    const commonProps = { state, onChange };

    switch (activeTab) {
      case 'layout':
        return <LayoutTab {...commonProps} />;
      case 'appearance':
        return <AppearanceTab {...commonProps} />;
      case 'spheres':
        return <SpheresTab {...commonProps} availableSpheres={availableSpheres} />;
      case 'agents':
        return <AgentsTab {...commonProps} availableAgents={availableAgents} />;
      case 'xr':
        return <XRTab {...commonProps} />;
      case 'notifications':
        return <NotificationsTab {...commonProps} />;
      case 'shortcuts':
        return <ShortcutsTab {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <div className={`che-nu-panel ${className}`} style={styles.panel}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <h2 style={styles.title}>
            <span style={styles.titleIcon}>⚙️</span>
            Votre CHE·NU
          </h2>
          <span style={styles.subtitle}>Environnement personnel</span>
        </div>

        <div style={styles.headerRight}>
          {/* Preset selector */}
          <div style={styles.presetWrapper}>
            <button
              onClick={() => setShowPresets(!showPresets)}
              style={styles.presetButton}
            >
              ✨ Presets
            </button>

            {showPresets && (
              <div style={styles.presetDropdown}>
                {PRESETS.map(preset => (
                  <button
                    key={preset.id}
                    onClick={() => handlePreset(preset.id)}
                    style={styles.presetItem}
                  >
                    <strong>{preset.name}</strong>
                    <span style={styles.presetDesc}>{preset.description}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {onClose && (
            <button onClick={onClose} style={styles.closeButton}>
              ✕
            </button>
          )}
        </div>
      </header>

      {/* Tab Navigation */}
      <nav style={styles.tabNav}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              ...styles.tab,
              ...(activeTab === tab.key ? styles.tabActive : {}),
            }}
          >
            <span style={styles.tabIcon}>{tab.icon}</span>
            <span style={styles.tabLabel}>{tab.labelFr}</span>
          </button>
        ))}
      </nav>

      {/* Tab Content */}
      <section style={styles.content}>
        {renderTabContent()}
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerLeft}>
          <button onClick={handleExport} style={styles.footerButton}>
            📥 Exporter
          </button>
          <button onClick={handleImport} style={styles.footerButton}>
            📤 Importer
          </button>
        </div>

        <div style={styles.footerRight}>
          {showResetConfirm ? (
            <div style={styles.confirmBox}>
              <span>Réinitialiser tout?</span>
              <button 
                onClick={handleReset} 
                style={styles.confirmYes}
              >
                Oui
              </button>
              <button 
                onClick={() => setShowResetConfirm(false)} 
                style={styles.confirmNo}
              >
                Non
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setShowResetConfirm(true)} 
              style={styles.resetButton}
            >
              🔄 Réinitialiser
            </button>
          )}
        </div>
      </footer>

      {/* Version info */}
      <div style={styles.version}>
        v{state.version} • Mis à jour {new Date(state.updatedAt).toLocaleString('fr-CA')}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  panel: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: 600,
    maxHeight: '90vh',
    background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)',
    borderRadius: 16,
    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
    color: '#fff',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(0,0,0,0.2)',
  },
  headerLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    margin: 0,
    fontSize: 20,
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  titleIcon: {
    fontSize: 24,
  },
  subtitle: {
    fontSize: 12,
    opacity: 0.6,
  },
  presetWrapper: {
    position: 'relative',
  },
  presetButton: {
    padding: '8px 16px',
    borderRadius: 20,
    border: '1px solid rgba(139,92,246,0.5)',
    background: 'rgba(139,92,246,0.2)',
    color: '#a78bfa',
    fontSize: 13,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  presetDropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: 8,
    width: 250,
    background: '#1e1e3f',
    borderRadius: 12,
    boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
    zIndex: 100,
    overflow: 'hidden',
  },
  presetItem: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    padding: '12px 16px',
    border: 'none',
    background: 'transparent',
    color: '#fff',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  presetDesc: {
    fontSize: 11,
    opacity: 0.6,
    marginTop: 2,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    border: 'none',
    background: 'rgba(255,255,255,0.1)',
    color: '#fff',
    fontSize: 16,
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  tabNav: {
    display: 'flex',
    gap: 4,
    padding: '12px 16px',
    overflowX: 'auto',
    background: 'rgba(0,0,0,0.1)',
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '10px 16px',
    borderRadius: 10,
    border: 'none',
    background: 'transparent',
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    cursor: 'pointer',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
  },
  tabActive: {
    background: 'rgba(99,102,241,0.3)',
    color: '#fff',
  },
  tabIcon: {
    fontSize: 16,
  },
  tabLabel: {
    fontWeight: 500,
  },
  content: {
    flex: 1,
    padding: 24,
    overflowY: 'auto',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(0,0,0,0.2)',
  },
  footerLeft: {
    display: 'flex',
    gap: 8,
  },
  footerRight: {
    display: 'flex',
    gap: 8,
  },
  footerButton: {
    padding: '8px 16px',
    borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'transparent',
    color: '#fff',
    fontSize: 13,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  resetButton: {
    padding: '8px 16px',
    borderRadius: 8,
    border: '1px solid rgba(239,68,68,0.5)',
    background: 'rgba(239,68,68,0.1)',
    color: '#fca5a5',
    fontSize: 13,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  confirmBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 13,
  },
  confirmYes: {
    padding: '6px 12px',
    borderRadius: 6,
    border: 'none',
    background: '#ef4444',
    color: '#fff',
    fontSize: 12,
    cursor: 'pointer',
  },
  confirmNo: {
    padding: '6px 12px',
    borderRadius: 6,
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'transparent',
    color: '#fff',
    fontSize: 12,
    cursor: 'pointer',
  },
  version: {
    textAlign: 'center',
    padding: '8px',
    fontSize: 10,
    opacity: 0.4,
  },
};

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default PersonalizationPanel;
