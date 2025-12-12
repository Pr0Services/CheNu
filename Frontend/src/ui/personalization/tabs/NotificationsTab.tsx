/* =====================================================
   CHE·NU — Notifications Tab
   
   Notification preferences and quiet hours.
   ===================================================== */

import React from 'react';

import {
  CheNuPersonalization,
  NotificationPersonalization,
} from '../../../personalization/personalization.types';

// ─────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────

export interface NotificationsTabProps {
  state: CheNuPersonalization;
  onChange: (next: CheNuPersonalization) => void;
}

// ─────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────

export function NotificationsTab({ state, onChange }: NotificationsTabProps) {
  const updateNotifications = (updates: Partial<NotificationPersonalization>) => {
    onChange({
      ...state,
      notifications: { ...state.notifications, ...updates },
      updatedAt: Date.now(),
    });
  };

  return (
    <div style={styles.tab}>
      {/* Main toggle */}
      <div style={{
        ...styles.mainToggle,
        background: state.notifications.enabled 
          ? 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(22,163,74,0.2))'
          : 'rgba(0,0,0,0.2)',
        borderColor: state.notifications.enabled ? '#22c55e' : 'transparent',
      }}>
        <div style={styles.toggleInfo}>
          <span style={styles.toggleIcon}>🔔</span>
          <div>
            <div style={styles.toggleTitle}>Notifications</div>
            <div style={styles.toggleDesc}>
              Alertes et rappels
            </div>
          </div>
        </div>
        <button
          onClick={() => updateNotifications({ enabled: !state.notifications.enabled })}
          style={{
            ...styles.toggleButton,
            background: state.notifications.enabled ? '#22c55e' : 'rgba(255,255,255,0.2)',
          }}
        >
          {state.notifications.enabled ? 'ON' : 'OFF'}
        </button>
      </div>

      <div style={{ opacity: state.notifications.enabled ? 1 : 0.4, pointerEvents: state.notifications.enabled ? 'auto' : 'none' }}>
        {/* Notification methods */}
        <h3 style={styles.sectionTitle}>📢 Méthodes</h3>
        
        <div style={styles.optionsGrid}>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={state.notifications.sound}
              onChange={() => updateNotifications({ sound: !state.notifications.sound })}
              style={styles.checkbox}
            />
            <span>🔊 Son</span>
          </label>

          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={state.notifications.vibration}
              onChange={() => updateNotifications({ vibration: !state.notifications.vibration })}
              style={styles.checkbox}
            />
            <span>📳 Vibration</span>
          </label>
        </div>

        <hr style={styles.divider} />

        {/* Notification types */}
        <h3 style={styles.sectionTitle}>📋 Types de notifications</h3>
        
        <div style={styles.typesList}>
          <label style={styles.typeRow}>
            <div style={styles.typeInfo}>
              <span style={styles.typeIcon}>💡</span>
              <div>
                <div style={styles.typeName}>Recommandations agents</div>
                <div style={styles.typeDesc}>Suggestions et conseils des agents</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={state.notifications.agentRecommendations}
              onChange={() => updateNotifications({ 
                agentRecommendations: !state.notifications.agentRecommendations 
              })}
              style={styles.checkbox}
            />
          </label>

          <label style={styles.typeRow}>
            <div style={styles.typeInfo}>
              <span style={styles.typeIcon}>📅</span>
              <div>
                <div style={styles.typeName}>Rappels de réunion</div>
                <div style={styles.typeDesc}>Avant le début des réunions</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={state.notifications.meetingReminders}
              onChange={() => updateNotifications({ 
                meetingReminders: !state.notifications.meetingReminders 
              })}
              style={styles.checkbox}
            />
          </label>

          <label style={styles.typeRow}>
            <div style={styles.typeInfo}>
              <span style={styles.typeIcon}>⏰</span>
              <div>
                <div style={styles.typeName}>Échéances de décision</div>
                <div style={styles.typeDesc}>Décisions approchant leur date limite</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={state.notifications.decisionDeadlines}
              onChange={() => updateNotifications({ 
                decisionDeadlines: !state.notifications.decisionDeadlines 
              })}
              style={styles.checkbox}
            />
          </label>

          <label style={styles.typeRow}>
            <div style={styles.typeInfo}>
              <span style={styles.typeIcon}>⚙️</span>
              <div>
                <div style={styles.typeName}>Mises à jour système</div>
                <div style={styles.typeDesc}>Nouvelles fonctionnalités et correctifs</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={state.notifications.systemUpdates}
              onChange={() => updateNotifications({ 
                systemUpdates: !state.notifications.systemUpdates 
              })}
              style={styles.checkbox}
            />
          </label>
        </div>

        <hr style={styles.divider} />

        {/* Urgent only */}
        <div style={styles.urgentBox}>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={state.notifications.urgentOnly}
              onChange={() => updateNotifications({ urgentOnly: !state.notifications.urgentOnly })}
              style={styles.checkbox}
            />
            <span>🚨 Urgentes uniquement</span>
          </label>
          <p style={styles.urgentHint}>
            Ne recevoir que les notifications marquées comme urgentes
          </p>
        </div>

        <hr style={styles.divider} />

        {/* Quiet hours */}
        <h3 style={styles.sectionTitle}>🌙 Heures calmes</h3>
        
        <div style={styles.quietHoursToggle}>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={state.notifications.quietHoursEnabled}
              onChange={() => updateNotifications({ 
                quietHoursEnabled: !state.notifications.quietHoursEnabled 
              })}
              style={styles.checkbox}
            />
            <span>Activer les heures calmes</span>
          </label>
        </div>

        {state.notifications.quietHoursEnabled && (
          <div style={styles.quietHoursConfig}>
            <div style={styles.timeField}>
              <label style={styles.label}>Début</label>
              <input
                type="time"
                value={state.notifications.quietHoursStart}
                onChange={(e) => updateNotifications({ quietHoursStart: e.target.value })}
                style={styles.timeInput}
              />
            </div>
            
            <span style={styles.timeSeparator}>→</span>
            
            <div style={styles.timeField}>
              <label style={styles.label}>Fin</label>
              <input
                type="time"
                value={state.notifications.quietHoursEnd}
                onChange={(e) => updateNotifications({ quietHoursEnd: e.target.value })}
                style={styles.timeInput}
              />
            </div>
          </div>
        )}

        {state.notifications.quietHoursEnabled && (
          <div style={styles.infoBox}>
            <span style={styles.infoIcon}>🌙</span>
            <p style={styles.infoText}>
              De {state.notifications.quietHoursStart} à {state.notifications.quietHoursEnd}, 
              seules les notifications urgentes seront affichées.
            </p>
          </div>
        )}
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
  sectionTitle: {
    margin: 0,
    fontSize: 14,
    fontWeight: 600,
    color: '#fff',
  },
  optionsGrid: {
    display: 'flex',
    gap: 24,
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
    accentColor: '#22c55e',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    margin: '4px 0',
  },
  typesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  typeRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    borderRadius: 10,
    background: 'rgba(0,0,0,0.2)',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  typeInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  typeIcon: {
    fontSize: 20,
  },
  typeName: {
    fontSize: 14,
    fontWeight: 500,
  },
  typeDesc: {
    fontSize: 11,
    opacity: 0.5,
  },
  urgentBox: {
    padding: 16,
    borderRadius: 10,
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.3)',
  },
  urgentHint: {
    margin: '8px 0 0 28px',
    fontSize: 12,
    opacity: 0.6,
  },
  quietHoursToggle: {
    marginBottom: 12,
  },
  quietHoursConfig: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: 16,
    padding: 16,
    borderRadius: 10,
    background: 'rgba(0,0,0,0.2)',
  },
  timeField: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: 500,
    opacity: 0.8,
  },
  timeInput: {
    padding: '10px 12px',
    borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'rgba(0,0,0,0.2)',
    color: '#fff',
    fontSize: 16,
  },
  timeSeparator: {
    fontSize: 20,
    opacity: 0.5,
    paddingBottom: 8,
  },
  infoBox: {
    display: 'flex',
    gap: 12,
    padding: 12,
    borderRadius: 10,
    background: 'rgba(139,92,246,0.1)',
    border: '1px solid rgba(139,92,246,0.3)',
    marginTop: 8,
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

export default NotificationsTab;
