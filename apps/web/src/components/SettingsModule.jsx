/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — SETTINGS MODULE
 * ═══════════════════════════════════════════════════════════════════════════════
 * Module Paramètres complet avec style Techno-Mythique:
 * - Profil utilisateur
 * - Préférences générales
 * - Notifications
 * - Sécurité et authentification
 * - Intégrations
 * - Facturation
 * - API & Webhooks
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS CHE·NU™
// ─────────────────────────────────────────────────────────────────────────────

const tokens = {
  colors: {
    sacredGold: '#D8B26A',
    ancientStone: '#8D8371',
    jungleEmerald: '#3F7249',
    cenoteTurquoise: '#3EB4A2',
    shadowMoss: '#2F4C39',
    earthEmber: '#7A593A',
    darkSlate: '#1A1A1A',
    softSand: '#E9E4D6',
    success: '#3F7249',
    warning: '#D8B26A',
    error: '#C45C4A',
    info: '#3EB4A2',
    bg: {
      primary: '#0f1217',
      secondary: '#161B22',
      tertiary: '#1E242C',
      card: 'rgba(22, 27, 34, 0.95)',
    },
    text: {
      primary: '#E9E4D6',
      secondary: '#A0998A',
      muted: '#6B6560',
    },
    border: 'rgba(216, 178, 106, 0.15)',
    borderHover: 'rgba(216, 178, 106, 0.3)',
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 },
  radius: { sm: 4, md: 8, lg: 12, xl: 16, xxl: 24, full: 9999 },
  shadows: {
    sm: '0 2px 8px rgba(0, 0, 0, 0.3)',
    md: '0 4px 16px rgba(0, 0, 0, 0.4)',
    glow: '0 0 20px rgba(216, 178, 106, 0.15)',
  },
  fonts: {
    heading: "'Lora', 'Josefin Sans', serif",
    body: "'Inter', 'Nunito', sans-serif",
    mono: "'JetBrains Mono', monospace",
  },
  transitions: {
    fast: '120ms ease',
    normal: '200ms ease',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: tokens.colors.bg.primary,
    fontFamily: tokens.fonts.body,
  },
  
  // Sidebar
  sidebar: {
    width: 280,
    backgroundColor: tokens.colors.bg.secondary,
    borderRight: `1px solid ${tokens.colors.border}`,
    padding: tokens.spacing.lg,
    position: 'sticky',
    top: 0,
    height: '100vh',
    overflowY: 'auto',
  },
  sidebarHeader: {
    marginBottom: tokens.spacing.xl,
  },
  sidebarTitle: {
    fontSize: 24,
    fontWeight: 600,
    fontFamily: tokens.fonts.heading,
    color: tokens.colors.text.primary,
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacing.sm,
    marginBottom: tokens.spacing.xs,
  },
  sidebarSubtitle: {
    fontSize: 13,
    color: tokens.colors.text.muted,
  },
  
  navSection: {
    marginBottom: tokens.spacing.lg,
  },
  navSectionTitle: {
    fontSize: 11,
    fontWeight: 600,
    color: tokens.colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: tokens.spacing.sm,
    paddingLeft: tokens.spacing.sm,
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacing.md,
    padding: '12px 16px',
    borderRadius: tokens.radius.lg,
    cursor: 'pointer',
    transition: tokens.transitions.fast,
    marginBottom: tokens.spacing.xs,
    fontSize: 14,
  },
  navItemActive: {
    backgroundColor: `${tokens.colors.sacredGold}15`,
    color: tokens.colors.sacredGold,
  },
  navItemInactive: {
    color: tokens.colors.text.secondary,
    backgroundColor: 'transparent',
  },
  navIcon: {
    fontSize: 16,
    width: 20,
    textAlign: 'center',
  },
  
  // Main Content
  main: {
    flex: 1,
    padding: tokens.spacing.xl,
    maxWidth: 900,
  },
  
  // Page Header
  pageHeader: {
    marginBottom: tokens.spacing.xl,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 600,
    fontFamily: tokens.fonts.heading,
    color: tokens.colors.text.primary,
    marginBottom: tokens.spacing.xs,
  },
  pageDesc: {
    fontSize: 14,
    color: tokens.colors.text.secondary,
  },
  
  // Card
  card: {
    backgroundColor: tokens.colors.bg.card,
    borderRadius: tokens.radius.xl,
    border: `1px solid ${tokens.colors.border}`,
    marginBottom: tokens.spacing.lg,
  },
  cardHeader: {
    padding: tokens.spacing.lg,
    borderBottom: `1px solid ${tokens.colors.border}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: tokens.colors.text.primary,
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  cardBody: {
    padding: tokens.spacing.lg,
  },
  
  // Form
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: tokens.spacing.lg,
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacing.sm,
  },
  formGroupFull: {
    gridColumn: '1 / -1',
  },
  formLabel: {
    fontSize: 13,
    fontWeight: 500,
    color: tokens.colors.text.secondary,
  },
  formInput: {
    padding: '12px 16px',
    fontSize: 14,
    backgroundColor: tokens.colors.bg.tertiary,
    border: `1px solid ${tokens.colors.border}`,
    borderRadius: tokens.radius.md,
    color: tokens.colors.text.primary,
    outline: 'none',
    transition: tokens.transitions.fast,
    fontFamily: tokens.fonts.body,
  },
  formTextarea: {
    padding: '12px 16px',
    fontSize: 14,
    backgroundColor: tokens.colors.bg.tertiary,
    border: `1px solid ${tokens.colors.border}`,
    borderRadius: tokens.radius.md,
    color: tokens.colors.text.primary,
    outline: 'none',
    resize: 'vertical',
    minHeight: 100,
    fontFamily: tokens.fonts.body,
  },
  formHint: {
    fontSize: 12,
    color: tokens.colors.text.muted,
  },
  
  // Profile
  profileHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacing.lg,
    marginBottom: tokens.spacing.xl,
    padding: tokens.spacing.lg,
    backgroundColor: tokens.colors.bg.secondary,
    borderRadius: tokens.radius.xl,
    border: `1px solid ${tokens.colors.border}`,
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: tokens.radius.xl,
    backgroundColor: tokens.colors.cenoteTurquoise,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 36,
    fontWeight: 600,
    color: '#fff',
    position: 'relative',
  },
  profileAvatarEdit: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 32,
    height: 32,
    borderRadius: tokens.radius.full,
    backgroundColor: tokens.colors.sacredGold,
    border: `3px solid ${tokens.colors.bg.secondary}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: 14,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 600,
    color: tokens.colors.text.primary,
    marginBottom: tokens.spacing.xs,
  },
  profileEmail: {
    fontSize: 14,
    color: tokens.colors.text.secondary,
    marginBottom: tokens.spacing.sm,
  },
  profileBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: tokens.spacing.xs,
    padding: '4px 12px',
    borderRadius: tokens.radius.full,
    fontSize: 12,
    fontWeight: 500,
    backgroundColor: `${tokens.colors.sacredGold}20`,
    color: tokens.colors.sacredGold,
  },
  
  // Button
  button: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacing.sm,
    padding: '10px 20px',
    fontSize: 14,
    fontWeight: 500,
    borderRadius: tokens.radius.md,
    border: 'none',
    cursor: 'pointer',
    transition: tokens.transitions.fast,
    fontFamily: tokens.fonts.body,
  },
  buttonPrimary: {
    backgroundColor: tokens.colors.sacredGold,
    color: tokens.colors.darkSlate,
  },
  buttonSecondary: {
    backgroundColor: tokens.colors.bg.tertiary,
    color: tokens.colors.text.secondary,
    border: `1px solid ${tokens.colors.border}`,
  },
  buttonDanger: {
    backgroundColor: `${tokens.colors.error}20`,
    color: tokens.colors.error,
    border: `1px solid ${tokens.colors.error}30`,
  },
  
  // Toggle
  toggle: {
    width: 48,
    height: 26,
    borderRadius: tokens.radius.full,
    padding: 3,
    cursor: 'pointer',
    transition: tokens.transitions.fast,
  },
  toggleKnob: {
    width: 20,
    height: 20,
    borderRadius: tokens.radius.full,
    backgroundColor: '#fff',
    transition: tokens.transitions.fast,
  },
  
  // Setting Row
  settingRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: tokens.spacing.md,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.colors.bg.secondary,
    marginBottom: tokens.spacing.sm,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: 500,
    color: tokens.colors.text.primary,
    marginBottom: 2,
  },
  settingDesc: {
    fontSize: 12,
    color: tokens.colors.text.muted,
  },
  
  // Integration Card
  integrationCard: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacing.md,
    padding: tokens.spacing.md,
    borderRadius: tokens.radius.lg,
    backgroundColor: tokens.colors.bg.secondary,
    marginBottom: tokens.spacing.sm,
  },
  integrationIcon: {
    width: 48,
    height: 48,
    borderRadius: tokens.radius.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 24,
  },
  integrationInfo: {
    flex: 1,
  },
  integrationName: {
    fontSize: 14,
    fontWeight: 600,
    color: tokens.colors.text.primary,
    marginBottom: 2,
  },
  integrationDesc: {
    fontSize: 12,
    color: tokens.colors.text.muted,
  },
  integrationStatus: {
    padding: '4px 10px',
    borderRadius: tokens.radius.full,
    fontSize: 11,
    fontWeight: 500,
    textTransform: 'uppercase',
  },
  
  // API Key
  apiKeyContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacing.sm,
    padding: tokens.spacing.md,
    backgroundColor: tokens.colors.bg.tertiary,
    borderRadius: tokens.radius.md,
    fontFamily: tokens.fonts.mono,
    fontSize: 13,
    color: tokens.colors.text.secondary,
  },
  apiKey: {
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  copyButton: {
    padding: '6px 12px',
    borderRadius: tokens.radius.sm,
    border: 'none',
    backgroundColor: tokens.colors.bg.secondary,
    color: tokens.colors.text.secondary,
    cursor: 'pointer',
    fontSize: 12,
  },
  
  // Plan Card
  planCard: {
    padding: tokens.spacing.lg,
    borderRadius: tokens.radius.xl,
    border: `2px solid ${tokens.colors.sacredGold}`,
    backgroundColor: `${tokens.colors.sacredGold}05`,
  },
  planHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: tokens.spacing.md,
  },
  planName: {
    fontSize: 20,
    fontWeight: 600,
    color: tokens.colors.sacredGold,
  },
  planPrice: {
    fontSize: 32,
    fontWeight: 700,
    color: tokens.colors.text.primary,
  },
  planPeriod: {
    fontSize: 14,
    color: tokens.colors.text.muted,
  },
  planFeatures: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: tokens.spacing.sm,
    marginTop: tokens.spacing.md,
  },
  planFeature: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacing.sm,
    fontSize: 13,
    color: tokens.colors.text.secondary,
  },
  
  // Usage Bar
  usageBar: {
    marginBottom: tokens.spacing.md,
  },
  usageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: tokens.spacing.xs,
    fontSize: 13,
  },
  usageLabel: {
    color: tokens.colors.text.secondary,
  },
  usageValue: {
    color: tokens.colors.text.primary,
    fontWeight: 500,
  },
  usageTrack: {
    height: 8,
    backgroundColor: tokens.colors.bg.tertiary,
    borderRadius: tokens.radius.full,
    overflow: 'hidden',
  },
  usageFill: {
    height: '100%',
    borderRadius: tokens.radius.full,
    transition: tokens.transitions.slow,
  },
  
  // Security
  securityItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: tokens.spacing.md,
    backgroundColor: tokens.colors.bg.secondary,
    borderRadius: tokens.radius.lg,
    marginBottom: tokens.spacing.sm,
  },
  securityIcon: {
    width: 40,
    height: 40,
    borderRadius: tokens.radius.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    marginRight: tokens.spacing.md,
  },
  securityStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacing.xs,
    fontSize: 12,
    fontWeight: 500,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// NAVIGATION CONFIG
// ─────────────────────────────────────────────────────────────────────────────

const navSections = [
  {
    title: 'Compte',
    items: [
      { id: 'profile', label: 'Profil', icon: '👤' },
      { id: 'preferences', label: 'Préférences', icon: '⚙️' },
      { id: 'notifications', label: 'Notifications', icon: '🔔' },
    ],
  },
  {
    title: 'Sécurité',
    items: [
      { id: 'security', label: 'Sécurité', icon: '🔐' },
      { id: 'sessions', label: 'Sessions', icon: '💻' },
    ],
  },
  {
    title: 'Organisation',
    items: [
      { id: 'billing', label: 'Facturation', icon: '💳' },
      { id: 'integrations', label: 'Intégrations', icon: '🔗' },
      { id: 'api', label: 'API & Webhooks', icon: '🔧' },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────

const mockIntegrations = [
  { id: 'google', name: 'Google Drive', icon: '📁', desc: 'Synchronisez vos documents', status: 'connected', color: '#4285F4' },
  { id: 'slack', name: 'Slack', icon: '💬', desc: 'Notifications en temps réel', status: 'connected', color: '#4A154B' },
  { id: 'stripe', name: 'Stripe', icon: '💳', desc: 'Paiements et facturation', status: 'disconnected', color: '#635BFF' },
  { id: 'quickbooks', name: 'QuickBooks', icon: '📊', desc: 'Comptabilité', status: 'disconnected', color: '#2CA01C' },
  { id: 'zapier', name: 'Zapier', icon: '⚡', desc: 'Automatisations', status: 'connected', color: '#FF4A00' },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

const Toggle = ({ enabled, onChange }) => (
  <div
    style={{
      ...styles.toggle,
      backgroundColor: enabled ? tokens.colors.jungleEmerald : tokens.colors.bg.tertiary,
    }}
    onClick={() => onChange(!enabled)}
  >
    <div
      style={{
        ...styles.toggleKnob,
        transform: enabled ? 'translateX(22px)' : 'translateX(0)',
      }}
    />
  </div>
);

const ProfilePage = () => (
  <>
    <div style={styles.pageHeader}>
      <h1 style={styles.pageTitle}>Profil</h1>
      <p style={styles.pageDesc}>Gérez vos informations personnelles</p>
    </div>
    
    <div style={styles.profileHeader}>
      <div style={styles.profileAvatar}>
        JT
        <div style={styles.profileAvatarEdit}>📷</div>
      </div>
      <div style={styles.profileInfo}>
        <div style={styles.profileName}>Jean Tremblay</div>
        <div style={styles.profileEmail}>jean.tremblay@proservice.ca</div>
        <div style={styles.profileBadge}>👑 Administrateur</div>
      </div>
      <button style={{ ...styles.button, ...styles.buttonSecondary }}>
        Modifier
      </button>
    </div>
    
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <div style={styles.cardTitle}>📝 Informations personnelles</div>
      </div>
      <div style={styles.cardBody}>
        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Prénom</label>
            <input style={styles.formInput} defaultValue="Jean" />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Nom</label>
            <input style={styles.formInput} defaultValue="Tremblay" />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Email</label>
            <input style={styles.formInput} type="email" defaultValue="jean.tremblay@proservice.ca" />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Téléphone</label>
            <input style={styles.formInput} defaultValue="+1 (514) 555-0123" />
          </div>
          <div style={{ ...styles.formGroup, ...styles.formGroupFull }}>
            <label style={styles.formLabel}>Bio</label>
            <textarea style={styles.formTextarea} defaultValue="Fondateur de Pro-Service. Passionné par la construction et la technologie." />
          </div>
        </div>
        <div style={{ marginTop: tokens.spacing.lg, display: 'flex', justifyContent: 'flex-end', gap: tokens.spacing.sm }}>
          <button style={{ ...styles.button, ...styles.buttonSecondary }}>Annuler</button>
          <button style={{ ...styles.button, ...styles.buttonPrimary }}>Sauvegarder</button>
        </div>
      </div>
    </div>
  </>
);

const PreferencesPage = () => {
  const [preferences, setPreferences] = useState({
    darkMode: true,
    compactView: false,
    autoSave: true,
    sounds: false,
  });
  
  return (
    <>
      <div style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>Préférences</h1>
        <p style={styles.pageDesc}>Personnalisez votre expérience</p>
      </div>
      
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <div style={styles.cardTitle}>🎨 Apparence</div>
        </div>
        <div style={styles.cardBody}>
          <div style={styles.settingRow}>
            <div style={styles.settingInfo}>
              <div style={styles.settingTitle}>Mode sombre</div>
              <div style={styles.settingDesc}>Utiliser un thème sombre pour l'interface</div>
            </div>
            <Toggle enabled={preferences.darkMode} onChange={(v) => setPreferences({ ...preferences, darkMode: v })} />
          </div>
          <div style={styles.settingRow}>
            <div style={styles.settingInfo}>
              <div style={styles.settingTitle}>Vue compacte</div>
              <div style={styles.settingDesc}>Réduire l'espacement pour afficher plus de contenu</div>
            </div>
            <Toggle enabled={preferences.compactView} onChange={(v) => setPreferences({ ...preferences, compactView: v })} />
          </div>
        </div>
      </div>
      
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <div style={styles.cardTitle}>⚡ Comportement</div>
        </div>
        <div style={styles.cardBody}>
          <div style={styles.settingRow}>
            <div style={styles.settingInfo}>
              <div style={styles.settingTitle}>Sauvegarde automatique</div>
              <div style={styles.settingDesc}>Sauvegarder automatiquement les modifications</div>
            </div>
            <Toggle enabled={preferences.autoSave} onChange={(v) => setPreferences({ ...preferences, autoSave: v })} />
          </div>
          <div style={styles.settingRow}>
            <div style={styles.settingInfo}>
              <div style={styles.settingTitle}>Sons</div>
              <div style={styles.settingDesc}>Activer les sons pour les notifications</div>
            </div>
            <Toggle enabled={preferences.sounds} onChange={(v) => setPreferences({ ...preferences, sounds: v })} />
          </div>
        </div>
      </div>
      
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <div style={styles.cardTitle}>🌐 Langue & Région</div>
        </div>
        <div style={styles.cardBody}>
          <div style={styles.formGrid}>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Langue</label>
              <select style={styles.formInput}>
                <option>Français (Canada)</option>
                <option>English (Canada)</option>
                <option>English (US)</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Fuseau horaire</label>
              <select style={styles.formInput}>
                <option>America/Toronto (EST)</option>
                <option>America/Vancouver (PST)</option>
                <option>Europe/Paris (CET)</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Format de date</label>
              <select style={styles.formInput}>
                <option>DD/MM/YYYY</option>
                <option>MM/DD/YYYY</option>
                <option>YYYY-MM-DD</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Devise</label>
              <select style={styles.formInput}>
                <option>CAD ($)</option>
                <option>USD ($)</option>
                <option>EUR (€)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState({
    email: { projects: true, tasks: true, mentions: true, updates: false },
    push: { projects: true, tasks: false, mentions: true, updates: false },
  });
  
  const NotificationGroup = ({ title, type }) => (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <div style={styles.cardTitle}>{type === 'email' ? '📧' : '📱'} {title}</div>
      </div>
      <div style={styles.cardBody}>
        {[
          { key: 'projects', label: 'Projets', desc: 'Nouveaux projets et mises à jour' },
          { key: 'tasks', label: 'Tâches', desc: 'Assignations et échéances' },
          { key: 'mentions', label: 'Mentions', desc: 'Quand quelqu\'un vous mentionne' },
          { key: 'updates', label: 'Mises à jour', desc: 'Nouvelles fonctionnalités et annonces' },
        ].map((item) => (
          <div key={item.key} style={styles.settingRow}>
            <div style={styles.settingInfo}>
              <div style={styles.settingTitle}>{item.label}</div>
              <div style={styles.settingDesc}>{item.desc}</div>
            </div>
            <Toggle
              enabled={notifications[type][item.key]}
              onChange={(v) => setNotifications({
                ...notifications,
                [type]: { ...notifications[type], [item.key]: v },
              })}
            />
          </div>
        ))}
      </div>
    </div>
  );
  
  return (
    <>
      <div style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>Notifications</h1>
        <p style={styles.pageDesc}>Gérez comment vous recevez les notifications</p>
      </div>
      
      <NotificationGroup title="Notifications par email" type="email" />
      <NotificationGroup title="Notifications push" type="push" />
    </>
  );
};

const SecurityPage = () => (
  <>
    <div style={styles.pageHeader}>
      <h1 style={styles.pageTitle}>Sécurité</h1>
      <p style={styles.pageDesc}>Protégez votre compte</p>
    </div>
    
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <div style={styles.cardTitle}>🔐 Authentification</div>
      </div>
      <div style={styles.cardBody}>
        <div style={styles.securityItem}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ ...styles.securityIcon, backgroundColor: `${tokens.colors.jungleEmerald}20`, color: tokens.colors.jungleEmerald }}>
              🔑
            </div>
            <div style={styles.settingInfo}>
              <div style={styles.settingTitle}>Mot de passe</div>
              <div style={styles.settingDesc}>Dernière modification il y a 3 mois</div>
            </div>
          </div>
          <button style={{ ...styles.button, ...styles.buttonSecondary }}>Modifier</button>
        </div>
        
        <div style={styles.securityItem}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ ...styles.securityIcon, backgroundColor: `${tokens.colors.sacredGold}20`, color: tokens.colors.sacredGold }}>
              📱
            </div>
            <div style={styles.settingInfo}>
              <div style={styles.settingTitle}>Authentification à deux facteurs</div>
              <div style={styles.settingDesc}>Ajoutez une couche de sécurité supplémentaire</div>
            </div>
          </div>
          <div style={{ ...styles.securityStatus, color: tokens.colors.jungleEmerald }}>
            ✓ Activé
          </div>
        </div>
        
        <div style={styles.securityItem}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ ...styles.securityIcon, backgroundColor: `${tokens.colors.cenoteTurquoise}20`, color: tokens.colors.cenoteTurquoise }}>
              📧
            </div>
            <div style={styles.settingInfo}>
              <div style={styles.settingTitle}>Email de récupération</div>
              <div style={styles.settingDesc}>j***@gmail.com</div>
            </div>
          </div>
          <button style={{ ...styles.button, ...styles.buttonSecondary }}>Modifier</button>
        </div>
      </div>
    </div>
    
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <div style={styles.cardTitle}>⚠️ Zone de danger</div>
      </div>
      <div style={styles.cardBody}>
        <div style={styles.settingRow}>
          <div style={styles.settingInfo}>
            <div style={styles.settingTitle}>Supprimer le compte</div>
            <div style={styles.settingDesc}>Cette action est irréversible</div>
          </div>
          <button style={{ ...styles.button, ...styles.buttonDanger }}>Supprimer</button>
        </div>
      </div>
    </div>
  </>
);

const BillingPage = () => (
  <>
    <div style={styles.pageHeader}>
      <h1 style={styles.pageTitle}>Facturation</h1>
      <p style={styles.pageDesc}>Gérez votre abonnement et paiements</p>
    </div>
    
    <div style={styles.planCard}>
      <div style={styles.planHeader}>
        <div>
          <div style={styles.planName}>Plan Pro</div>
          <div style={{ fontSize: 13, color: tokens.colors.text.muted }}>Facturé annuellement</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={styles.planPrice}>79$</div>
          <div style={styles.planPeriod}>/mois</div>
        </div>
      </div>
      <div style={styles.planFeatures}>
        {[
          '✓ Utilisateurs illimités',
          '✓ 100 Go de stockage',
          '✓ Support prioritaire',
          '✓ Intégrations avancées',
          '✓ API access',
          '✓ Rapports personnalisés',
        ].map((feature, i) => (
          <div key={i} style={styles.planFeature}>{feature}</div>
        ))}
      </div>
      <div style={{ marginTop: tokens.spacing.lg, display: 'flex', gap: tokens.spacing.sm }}>
        <button style={{ ...styles.button, ...styles.buttonSecondary }}>Changer de plan</button>
        <button style={{ ...styles.button, ...styles.buttonSecondary }}>Annuler</button>
      </div>
    </div>
    
    <div style={{ ...styles.card, marginTop: tokens.spacing.lg }}>
      <div style={styles.cardHeader}>
        <div style={styles.cardTitle}>📊 Utilisation</div>
      </div>
      <div style={styles.cardBody}>
        {[
          { label: 'Stockage', used: 45, total: 100, unit: 'Go' },
          { label: 'Projets', used: 24, total: 50, unit: '' },
          { label: 'Appels API', used: 8500, total: 10000, unit: '' },
        ].map((item, i) => (
          <div key={i} style={styles.usageBar}>
            <div style={styles.usageHeader}>
              <span style={styles.usageLabel}>{item.label}</span>
              <span style={styles.usageValue}>{item.used.toLocaleString()} / {item.total.toLocaleString()} {item.unit}</span>
            </div>
            <div style={styles.usageTrack}>
              <div
                style={{
                  ...styles.usageFill,
                  width: `${(item.used / item.total) * 100}%`,
                  backgroundColor: item.used / item.total > 0.8 ? tokens.colors.error : tokens.colors.cenoteTurquoise,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  </>
);

const IntegrationsPage = () => (
  <>
    <div style={styles.pageHeader}>
      <h1 style={styles.pageTitle}>Intégrations</h1>
      <p style={styles.pageDesc}>Connectez vos outils préférés</p>
    </div>
    
    <div style={styles.card}>
      <div style={styles.cardBody}>
        {mockIntegrations.map((integration) => (
          <div key={integration.id} style={styles.integrationCard}>
            <div style={{ ...styles.integrationIcon, backgroundColor: `${integration.color}20` }}>
              {integration.icon}
            </div>
            <div style={styles.integrationInfo}>
              <div style={styles.integrationName}>{integration.name}</div>
              <div style={styles.integrationDesc}>{integration.desc}</div>
            </div>
            {integration.status === 'connected' ? (
              <>
                <span
                  style={{
                    ...styles.integrationStatus,
                    backgroundColor: `${tokens.colors.jungleEmerald}20`,
                    color: tokens.colors.jungleEmerald,
                  }}
                >
                  Connecté
                </span>
                <button style={{ ...styles.button, ...styles.buttonSecondary, marginLeft: tokens.spacing.sm }}>
                  Gérer
                </button>
              </>
            ) : (
              <button style={{ ...styles.button, ...styles.buttonPrimary }}>
                Connecter
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  </>
);

const APIPage = () => (
  <>
    <div style={styles.pageHeader}>
      <h1 style={styles.pageTitle}>API & Webhooks</h1>
      <p style={styles.pageDesc}>Accès programmatique à CHE·NU™</p>
    </div>
    
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <div style={styles.cardTitle}>🔑 Clés API</div>
        <button style={{ ...styles.button, ...styles.buttonPrimary }}>+ Nouvelle clé</button>
      </div>
      <div style={styles.cardBody}>
        <div style={{ marginBottom: tokens.spacing.md }}>
          <div style={{ fontSize: 13, color: tokens.colors.text.secondary, marginBottom: tokens.spacing.sm }}>
            Clé de production
          </div>
          <div style={styles.apiKeyContainer}>
            <span style={styles.apiKey}>sk_live_••••••••••••••••••••••••</span>
            <button style={styles.copyButton}>📋 Copier</button>
            <button style={styles.copyButton}>🔄</button>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 13, color: tokens.colors.text.secondary, marginBottom: tokens.spacing.sm }}>
            Clé de test
          </div>
          <div style={styles.apiKeyContainer}>
            <span style={styles.apiKey}>sk_test_••••••••••••••••••••••••</span>
            <button style={styles.copyButton}>📋 Copier</button>
            <button style={styles.copyButton}>🔄</button>
          </div>
        </div>
      </div>
    </div>
    
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <div style={styles.cardTitle}>🔗 Webhooks</div>
        <button style={{ ...styles.button, ...styles.buttonPrimary }}>+ Ajouter endpoint</button>
      </div>
      <div style={styles.cardBody}>
        <div style={styles.integrationCard}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontFamily: tokens.fonts.mono, color: tokens.colors.text.primary }}>
              https://api.example.com/webhooks/chenu
            </div>
            <div style={{ fontSize: 12, color: tokens.colors.text.muted, marginTop: 4 }}>
              project.created, task.completed, invoice.paid
            </div>
          </div>
          <span
            style={{
              ...styles.integrationStatus,
              backgroundColor: `${tokens.colors.jungleEmerald}20`,
              color: tokens.colors.jungleEmerald,
            }}
          >
            Actif
          </span>
          <button style={{ ...styles.button, ...styles.buttonSecondary, marginLeft: tokens.spacing.sm }}>
            Modifier
          </button>
        </div>
      </div>
    </div>
  </>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const SettingsModule = () => {
  const [activePage, setActivePage] = useState('profile');
  
  const renderPage = () => {
    switch (activePage) {
      case 'profile': return <ProfilePage />;
      case 'preferences': return <PreferencesPage />;
      case 'notifications': return <NotificationsPage />;
      case 'security': return <SecurityPage />;
      case 'sessions': return <SecurityPage />;
      case 'billing': return <BillingPage />;
      case 'integrations': return <IntegrationsPage />;
      case 'api': return <APIPage />;
      default: return <ProfilePage />;
    }
  };
  
  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <div style={styles.sidebarTitle}>
            ⚙️ Paramètres
          </div>
          <div style={styles.sidebarSubtitle}>
            Configurez votre espace
          </div>
        </div>
        
        {navSections.map((section) => (
          <div key={section.title} style={styles.navSection}>
            <div style={styles.navSectionTitle}>{section.title}</div>
            {section.items.map((item) => (
              <div
                key={item.id}
                style={{
                  ...styles.navItem,
                  ...(activePage === item.id ? styles.navItemActive : styles.navItemInactive),
                }}
                onClick={() => setActivePage(item.id)}
              >
                <span style={styles.navIcon}>{item.icon}</span>
                {item.label}
              </div>
            ))}
          </div>
        ))}
      </aside>
      
      {/* Main Content */}
      <main style={styles.main}>
        {renderPage()}
      </main>
    </div>
  );
};

export default SettingsModule;
