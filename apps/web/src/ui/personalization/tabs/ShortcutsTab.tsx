/* =====================================================
   CHE·NU — Shortcuts Tab
   
   Keyboard shortcuts customization.
   ===================================================== */

import React, { useState } from 'react';

import {
  CheNuPersonalization,
  KeyboardShortcut,
} from '../../../personalization/personalization.types';

import { DEFAULT_SHORTCUTS } from '../../../personalization/personalization.defaults';

// ─────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────

export interface ShortcutsTabProps {
  state: CheNuPersonalization;
  onChange: (next: CheNuPersonalization) => void;
}

// ─────────────────────────────────────────────────────
// SHORTCUT LABELS
// ─────────────────────────────────────────────────────

const SHORTCUT_LABELS: Record<string, { label: string; icon: string }> = {
  search: { label: 'Recherche', icon: '🔍' },
  home: { label: 'Accueil', icon: '🏠' },
  back: { label: 'Retour', icon: '◀' },
  forward: { label: 'Avancer', icon: '▶' },
  meeting: { label: 'Nouvelle réunion', icon: '👥' },
  agents: { label: 'Liste des agents', icon: '🤖' },
  settings: { label: 'Paramètres', icon: '⚙️' },
  fullscreen: { label: 'Plein écran', icon: '⛶' },
  xr_toggle: { label: 'Basculer XR', icon: '🥽' },
};

// ─────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────

export function ShortcutsTab({ state, onChange }: ShortcutsTabProps) {
  const [editingAction, setEditingAction] = useState<string | null>(null);
  const [recordedKeys, setRecordedKeys] = useState<string>('');

  // Update a shortcut
  const updateShortcut = (action: string, updates: Partial<KeyboardShortcut>) => {
    const shortcuts = state.shortcuts.map(s =>
      s.action === action ? { ...s, ...updates } : s
    );
    onChange({ ...state, shortcuts, updatedAt: Date.now() });
  };

  // Reset all shortcuts
  const resetAllShortcuts = () => {
    onChange({ ...state, shortcuts: [...DEFAULT_SHORTCUTS], updatedAt: Date.now() });
  };

  // Start recording a shortcut
  const startRecording = (action: string) => {
    setEditingAction(action);
    setRecordedKeys('');
  };

  // Handle key recording
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!editingAction) return;
    
    e.preventDefault();
    e.stopPropagation();

    const parts: string[] = [];
    if (e.ctrlKey || e.metaKey) parts.push('ctrl');
    if (e.altKey) parts.push('alt');
    if (e.shiftKey) parts.push('shift');
    
    const key = e.key.toLowerCase();
    if (!['control', 'alt', 'shift', 'meta'].includes(key)) {
      parts.push(key);
    }

    const combo = parts.join('+');
    setRecordedKeys(combo);
  };

  // Save recorded shortcut
  const saveRecordedShortcut = () => {
    if (editingAction && recordedKeys) {
      updateShortcut(editingAction, { keys: recordedKeys });
    }
    setEditingAction(null);
    setRecordedKeys('');
  };

  // Cancel recording
  const cancelRecording = () => {
    setEditingAction(null);
    setRecordedKeys('');
  };

  // Format key display
  const formatKeys = (keys: string) => {
    return keys
      .split('+')
      .map(k => {
        if (k === 'ctrl') return '⌘/Ctrl';
        if (k === 'alt') return 'Alt';
        if (k === 'shift') return '⇧';
        if (k === 'left') return '←';
        if (k === 'right') return '→';
        if (k === 'up') return '↑';
        if (k === 'down') return '↓';
        if (k === 'f11') return 'F11';
        return k.toUpperCase();
      })
      .join(' + ');
  };

  return (
    <div style={styles.tab}>
      <div style={styles.header}>
        <h3 style={styles.sectionTitle}>⌨️ Raccourcis clavier</h3>
        <button onClick={resetAllShortcuts} style={styles.resetButton}>
          Réinitialiser tout
        </button>
      </div>

      <p style={styles.description}>
        Personnalisez les raccourcis clavier pour naviguer rapidement.
      </p>

      {/* Recording modal */}
      {editingAction && (
        <div style={styles.recordingOverlay} onClick={cancelRecording}>
          <div 
            style={styles.recordingModal} 
            onClick={e => e.stopPropagation()}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            autoFocus
          >
            <h4 style={styles.recordingTitle}>
              Enregistrer un raccourci pour:{' '}
              {SHORTCUT_LABELS[editingAction]?.label || editingAction}
            </h4>
            
            <div style={styles.recordingDisplay}>
              {recordedKeys ? formatKeys(recordedKeys) : 'Appuyez sur les touches...'}
            </div>

            <div style={styles.recordingActions}>
              <button onClick={cancelRecording} style={styles.cancelButton}>
                Annuler
              </button>
              <button 
                onClick={saveRecordedShortcut} 
                style={styles.saveButton}
                disabled={!recordedKeys}
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shortcuts list */}
      <div style={styles.shortcutsList}>
        {state.shortcuts.map(shortcut => {
          const info = SHORTCUT_LABELS[shortcut.action] || { 
            label: shortcut.action, 
            icon: '🔹' 
          };
          
          return (
            <div 
              key={shortcut.action} 
              style={{
                ...styles.shortcutRow,
                opacity: shortcut.enabled ? 1 : 0.5,
              }}
            >
              <div style={styles.shortcutInfo}>
                <span style={styles.shortcutIcon}>{info.icon}</span>
                <span style={styles.shortcutLabel}>{info.label}</span>
              </div>

              <div style={styles.shortcutActions}>
                <button
                  onClick={() => startRecording(shortcut.action)}
                  style={styles.keysButton}
                >
                  {formatKeys(shortcut.keys)}
                </button>

                <button
                  onClick={() => updateShortcut(shortcut.action, { enabled: !shortcut.enabled })}
                  style={{
                    ...styles.toggleShortcut,
                    background: shortcut.enabled 
                      ? 'rgba(34,197,94,0.2)' 
                      : 'rgba(255,255,255,0.1)',
                    borderColor: shortcut.enabled 
                      ? 'rgba(34,197,94,0.5)' 
                      : 'transparent',
                  }}
                >
                  {shortcut.enabled ? '✓' : '✗'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info */}
      <div style={styles.infoBox}>
        <span style={styles.infoIcon}>💡</span>
        <div style={styles.infoContent}>
          <p style={styles.infoText}>
            Cliquez sur un raccourci pour le modifier.
          </p>
          <p style={styles.infoText}>
            Les raccourcis désactivés n'auront aucun effet.
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
  resetButton: {
    padding: '6px 12px',
    borderRadius: 6,
    border: '1px solid rgba(239,68,68,0.5)',
    background: 'rgba(239,68,68,0.1)',
    color: '#fca5a5',
    fontSize: 12,
    cursor: 'pointer',
  },
  description: {
    margin: 0,
    fontSize: 13,
    opacity: 0.6,
  },
  shortcutsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  shortcutRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    borderRadius: 10,
    background: 'rgba(0,0,0,0.2)',
    transition: 'opacity 0.2s',
  },
  shortcutInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  shortcutIcon: {
    fontSize: 18,
  },
  shortcutLabel: {
    fontSize: 14,
    fontWeight: 500,
  },
  shortcutActions: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  keysButton: {
    padding: '8px 12px',
    borderRadius: 6,
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'rgba(0,0,0,0.3)',
    color: '#fff',
    fontSize: 12,
    fontFamily: 'monospace',
    cursor: 'pointer',
    minWidth: 100,
    textAlign: 'center',
    transition: 'all 0.2s',
  },
  toggleShortcut: {
    width: 32,
    height: 32,
    borderRadius: 6,
    border: '1px solid',
    fontSize: 14,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  recordingOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  recordingModal: {
    width: 400,
    padding: 24,
    borderRadius: 16,
    background: '#1a1a2e',
    border: '1px solid rgba(255,255,255,0.1)',
    textAlign: 'center',
  },
  recordingTitle: {
    margin: '0 0 20px 0',
    fontSize: 16,
    fontWeight: 500,
  },
  recordingDisplay: {
    padding: '24px 16px',
    borderRadius: 12,
    background: 'rgba(99,102,241,0.2)',
    border: '2px dashed rgba(99,102,241,0.5)',
    fontSize: 20,
    fontFamily: 'monospace',
    color: '#a5b4fc',
    marginBottom: 20,
  },
  recordingActions: {
    display: 'flex',
    gap: 12,
    justifyContent: 'center',
  },
  cancelButton: {
    padding: '10px 24px',
    borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'transparent',
    color: '#fff',
    fontSize: 14,
    cursor: 'pointer',
  },
  saveButton: {
    padding: '10px 24px',
    borderRadius: 8,
    border: 'none',
    background: '#6366f1',
    color: '#fff',
    fontSize: 14,
    cursor: 'pointer',
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
  infoContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  infoText: {
    margin: 0,
    fontSize: 12,
    opacity: 0.8,
  },
};

export default ShortcutsTab;
