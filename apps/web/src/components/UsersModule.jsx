/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — USERS MODULE
 * ═══════════════════════════════════════════════════════════════════════════════
 * Module Utilisateurs complet avec style Techno-Mythique:
 * - Liste utilisateurs avec filtres
 * - Gestion des rôles et permissions (RBAC)
 * - Profils utilisateurs détaillés
 * - Activité et logs
 * - Invitations et onboarding
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useMemo } from 'react';

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
    lg: '0 8px 32px rgba(0, 0, 0, 0.5)',
    glow: '0 0 20px rgba(216, 178, 106, 0.15)',
  },
  fonts: {
    heading: "'Lora', 'Josefin Sans', serif",
    body: "'Inter', 'Nunito', sans-serif",
  },
  transitions: {
    fast: '120ms ease',
    normal: '200ms ease',
    slow: '350ms ease',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────

const styles = {
  container: {
    padding: tokens.spacing.lg,
    backgroundColor: tokens.colors.bg.primary,
    minHeight: '100vh',
    fontFamily: tokens.fonts.body,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: 600,
    fontFamily: tokens.fonts.heading,
    color: tokens.colors.text.primary,
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  titleIcon: {
    width: 36,
    height: 36,
    borderRadius: tokens.radius.md,
    background: `linear-gradient(135deg, ${tokens.colors.jungleEmerald} 0%, ${tokens.colors.shadowMoss} 100%)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    boxShadow: tokens.shadows.glow,
  },
  subtitle: {
    fontSize: 14,
    color: tokens.colors.text.secondary,
    marginTop: tokens.spacing.xs,
  },
  
  // Tabs
  tabs: {
    display: 'flex',
    gap: tokens.spacing.xs,
    marginBottom: tokens.spacing.lg,
    borderBottom: `1px solid ${tokens.colors.border}`,
    paddingBottom: tokens.spacing.md,
  },
  tab: {
    padding: '10px 20px',
    fontSize: 14,
    fontWeight: 500,
    borderRadius: `${tokens.radius.md}px ${tokens.radius.md}px 0 0`,
    border: 'none',
    cursor: 'pointer',
    transition: tokens.transitions.fast,
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacing.sm,
    fontFamily: tokens.fonts.body,
  },
  tabActive: {
    backgroundColor: tokens.colors.sacredGold,
    color: tokens.colors.darkSlate,
  },
  tabInactive: {
    backgroundColor: 'transparent',
    color: tokens.colors.text.secondary,
  },
  tabCount: {
    padding: '2px 8px',
    borderRadius: tokens.radius.full,
    fontSize: 11,
    fontWeight: 600,
  },
  
  // Stats Bar
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: tokens.spacing.md,
    marginBottom: tokens.spacing.lg,
  },
  statCard: {
    backgroundColor: tokens.colors.bg.card,
    borderRadius: tokens.radius.lg,
    padding: tokens.spacing.lg,
    border: `1px solid ${tokens.colors.border}`,
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacing.md,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: tokens.radius.lg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 700,
    color: tokens.colors.text.primary,
  },
  statLabel: {
    fontSize: 13,
    color: tokens.colors.text.muted,
  },
  
  // Toolbar
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.lg,
    padding: tokens.spacing.md,
    backgroundColor: tokens.colors.bg.secondary,
    borderRadius: tokens.radius.lg,
    border: `1px solid ${tokens.colors.border}`,
  },
  searchContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    color: tokens.colors.text.muted,
    fontSize: 14,
  },
  searchInput: {
    padding: '10px 16px 10px 40px',
    fontSize: 14,
    backgroundColor: tokens.colors.bg.tertiary,
    border: `1px solid ${tokens.colors.border}`,
    borderRadius: tokens.radius.md,
    color: tokens.colors.text.primary,
    outline: 'none',
    width: 300,
  },
  filterGroup: {
    display: 'flex',
    gap: tokens.spacing.sm,
  },
  filterSelect: {
    padding: '10px 16px',
    fontSize: 14,
    backgroundColor: tokens.colors.bg.tertiary,
    border: `1px solid ${tokens.colors.border}`,
    borderRadius: tokens.radius.md,
    color: tokens.colors.text.primary,
    outline: 'none',
    cursor: 'pointer',
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
  
  // Users Grid
  usersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: tokens.spacing.md,
  },
  
  // User Card
  userCard: {
    backgroundColor: tokens.colors.bg.card,
    borderRadius: tokens.radius.xl,
    padding: tokens.spacing.lg,
    border: `1px solid ${tokens.colors.border}`,
    transition: tokens.transitions.fast,
    cursor: 'pointer',
  },
  userCardHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: tokens.spacing.md,
    marginBottom: tokens.spacing.md,
  },
  userAvatar: {
    width: 56,
    height: 56,
    borderRadius: tokens.radius.lg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
    fontWeight: 600,
    color: '#fff',
    position: 'relative',
  },
  userStatus: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: tokens.radius.full,
    border: `3px solid ${tokens.colors.bg.card}`,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 600,
    color: tokens.colors.text.primary,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 13,
    color: tokens.colors.text.secondary,
  },
  userRole: {
    marginTop: tokens.spacing.sm,
    display: 'inline-flex',
    padding: '4px 10px',
    borderRadius: tokens.radius.full,
    fontSize: 11,
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  userStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: tokens.spacing.sm,
    padding: tokens.spacing.md,
    backgroundColor: tokens.colors.bg.secondary,
    borderRadius: tokens.radius.md,
    marginBottom: tokens.spacing.md,
  },
  userStat: {
    textAlign: 'center',
  },
  userStatValue: {
    fontSize: 16,
    fontWeight: 600,
    color: tokens.colors.text.primary,
  },
  userStatLabel: {
    fontSize: 10,
    color: tokens.colors.text.muted,
    textTransform: 'uppercase',
  },
  userFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: tokens.spacing.md,
    borderTop: `1px solid ${tokens.colors.border}`,
  },
  userLastActive: {
    fontSize: 12,
    color: tokens.colors.text.muted,
  },
  userActions: {
    display: 'flex',
    gap: tokens.spacing.xs,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: tokens.radius.md,
    border: 'none',
    backgroundColor: tokens.colors.bg.tertiary,
    color: tokens.colors.text.secondary,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: tokens.transitions.fast,
  },
  
  // Roles Tab
  rolesContainer: {
    display: 'grid',
    gridTemplateColumns: '300px 1fr',
    gap: tokens.spacing.lg,
  },
  rolesList: {
    backgroundColor: tokens.colors.bg.card,
    borderRadius: tokens.radius.xl,
    border: `1px solid ${tokens.colors.border}`,
    overflow: 'hidden',
  },
  rolesHeader: {
    padding: tokens.spacing.md,
    borderBottom: `1px solid ${tokens.colors.border}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rolesTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: tokens.colors.text.primary,
  },
  roleItem: {
    padding: tokens.spacing.md,
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacing.md,
    borderBottom: `1px solid ${tokens.colors.border}`,
    cursor: 'pointer',
    transition: tokens.transitions.fast,
  },
  roleIcon: {
    width: 36,
    height: 36,
    borderRadius: tokens.radius.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
  },
  roleName: {
    fontSize: 14,
    fontWeight: 500,
    color: tokens.colors.text.primary,
  },
  roleCount: {
    fontSize: 12,
    color: tokens.colors.text.muted,
  },
  
  // Permissions Panel
  permissionsPanel: {
    backgroundColor: tokens.colors.bg.card,
    borderRadius: tokens.radius.xl,
    border: `1px solid ${tokens.colors.border}`,
  },
  permissionsHeader: {
    padding: tokens.spacing.lg,
    borderBottom: `1px solid ${tokens.colors.border}`,
  },
  permissionsTitle: {
    fontSize: 18,
    fontWeight: 600,
    fontFamily: tokens.fonts.heading,
    color: tokens.colors.text.primary,
    marginBottom: tokens.spacing.xs,
  },
  permissionsDesc: {
    fontSize: 13,
    color: tokens.colors.text.secondary,
  },
  permissionsBody: {
    padding: tokens.spacing.lg,
  },
  permissionGroup: {
    marginBottom: tokens.spacing.lg,
  },
  permissionGroupTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: tokens.colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: tokens.spacing.md,
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  permissionsList: {
    display: 'grid',
    gap: tokens.spacing.sm,
  },
  permissionItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: tokens.spacing.md,
    backgroundColor: tokens.colors.bg.secondary,
    borderRadius: tokens.radius.md,
  },
  permissionLabel: {
    fontSize: 14,
    color: tokens.colors.text.primary,
  },
  permissionToggle: {
    width: 44,
    height: 24,
    borderRadius: tokens.radius.full,
    padding: 2,
    cursor: 'pointer',
    transition: tokens.transitions.fast,
  },
  permissionToggleKnob: {
    width: 20,
    height: 20,
    borderRadius: tokens.radius.full,
    backgroundColor: '#fff',
    transition: tokens.transitions.fast,
  },
  
  // Invitations Tab
  inviteForm: {
    backgroundColor: tokens.colors.bg.card,
    borderRadius: tokens.radius.xl,
    border: `1px solid ${tokens.colors.border}`,
    padding: tokens.spacing.lg,
    marginBottom: tokens.spacing.lg,
  },
  inviteGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr auto',
    gap: tokens.spacing.md,
    alignItems: 'flex-end',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacing.sm,
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
  },
  
  // Pending Invites
  invitesTable: {
    backgroundColor: tokens.colors.bg.card,
    borderRadius: tokens.radius.xl,
    border: `1px solid ${tokens.colors.border}`,
    overflow: 'hidden',
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr 120px',
    gap: tokens.spacing.md,
    padding: tokens.spacing.md,
    backgroundColor: tokens.colors.bg.secondary,
    fontSize: 12,
    fontWeight: 600,
    color: tokens.colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr 120px',
    gap: tokens.spacing.md,
    padding: tokens.spacing.md,
    borderBottom: `1px solid ${tokens.colors.border}`,
    alignItems: 'center',
  },
  inviteEmail: {
    fontSize: 14,
    color: tokens.colors.text.primary,
  },
  inviteStatus: {
    padding: '4px 10px',
    borderRadius: tokens.radius.full,
    fontSize: 11,
    fontWeight: 500,
    textTransform: 'uppercase',
  },
  
  // Modal
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: tokens.colors.bg.secondary,
    borderRadius: tokens.radius.xxl,
    width: '100%',
    maxWidth: 500,
    maxHeight: '90vh',
    overflow: 'hidden',
  },
  modalHeader: {
    padding: tokens.spacing.lg,
    borderBottom: `1px solid ${tokens.colors.border}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 600,
    fontFamily: tokens.fonts.heading,
    color: tokens.colors.text.primary,
  },
  modalClose: {
    width: 36,
    height: 36,
    borderRadius: tokens.radius.md,
    border: 'none',
    backgroundColor: tokens.colors.bg.tertiary,
    color: tokens.colors.text.secondary,
    cursor: 'pointer',
    fontSize: 18,
  },
  modalBody: {
    padding: tokens.spacing.lg,
  },
  modalFooter: {
    padding: tokens.spacing.lg,
    borderTop: `1px solid ${tokens.colors.border}`,
    display: 'flex',
    justifyContent: 'flex-end',
    gap: tokens.spacing.sm,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────

const mockUsers = [
  {
    id: 1,
    name: 'Jean Tremblay',
    email: 'jean.tremblay@proservice.ca',
    role: 'admin',
    status: 'online',
    avatar: 'JT',
    color: '#4A90D9',
    projects: 12,
    tasks: 48,
    completed: 156,
    lastActive: 'Maintenant',
    joinedAt: '2023-01-15',
  },
  {
    id: 2,
    name: 'Marie Côté',
    email: 'marie.cote@proservice.ca',
    role: 'manager',
    status: 'online',
    avatar: 'MC',
    color: '#D94A6A',
    projects: 8,
    tasks: 32,
    completed: 98,
    lastActive: 'Il y a 5 min',
    joinedAt: '2023-03-22',
  },
  {
    id: 3,
    name: 'Pierre Lavoie',
    email: 'pierre.lavoie@proservice.ca',
    role: 'member',
    status: 'busy',
    avatar: 'PL',
    color: '#6AD94A',
    projects: 5,
    tasks: 24,
    completed: 67,
    lastActive: 'Il y a 2h',
    joinedAt: '2023-06-10',
  },
  {
    id: 4,
    name: 'Anne Bouchard',
    email: 'anne.bouchard@proservice.ca',
    role: 'member',
    status: 'offline',
    avatar: 'AB',
    color: '#D9A04A',
    projects: 3,
    tasks: 18,
    completed: 45,
    lastActive: 'Hier',
    joinedAt: '2023-08-05',
  },
  {
    id: 5,
    name: 'Robert Lapointe',
    email: 'robert.lapointe@proservice.ca',
    role: 'member',
    status: 'online',
    avatar: 'RL',
    color: '#9B59B6',
    projects: 6,
    tasks: 28,
    completed: 82,
    lastActive: 'Maintenant',
    joinedAt: '2023-09-18',
  },
  {
    id: 6,
    name: 'Sophie Martin',
    email: 'sophie.martin@proservice.ca',
    role: 'viewer',
    status: 'offline',
    avatar: 'SM',
    color: '#E74C3C',
    projects: 2,
    tasks: 8,
    completed: 12,
    lastActive: 'Il y a 3 jours',
    joinedAt: '2024-01-10',
  },
];

const mockRoles = [
  { id: 'admin', name: 'Administrateur', icon: '👑', color: tokens.colors.sacredGold, count: 1 },
  { id: 'manager', name: 'Gestionnaire', icon: '⭐', color: tokens.colors.cenoteTurquoise, count: 1 },
  { id: 'member', name: 'Membre', icon: '👤', color: tokens.colors.jungleEmerald, count: 3 },
  { id: 'viewer', name: 'Observateur', icon: '👁️', color: tokens.colors.ancientStone, count: 1 },
];

const mockPermissions = {
  projects: [
    { id: 'projects.create', label: 'Créer des projets' },
    { id: 'projects.edit', label: 'Modifier des projets' },
    { id: 'projects.delete', label: 'Supprimer des projets' },
    { id: 'projects.archive', label: 'Archiver des projets' },
  ],
  users: [
    { id: 'users.invite', label: 'Inviter des utilisateurs' },
    { id: 'users.edit', label: 'Modifier les profils' },
    { id: 'users.delete', label: 'Supprimer des utilisateurs' },
    { id: 'users.roles', label: 'Gérer les rôles' },
  ],
  finance: [
    { id: 'finance.view', label: 'Voir les finances' },
    { id: 'finance.invoices', label: 'Gérer les factures' },
    { id: 'finance.reports', label: 'Exporter les rapports' },
  ],
  settings: [
    { id: 'settings.general', label: 'Paramètres généraux' },
    { id: 'settings.billing', label: 'Facturation' },
    { id: 'settings.integrations', label: 'Intégrations' },
  ],
};

const mockInvites = [
  { id: 1, email: 'nouveau@example.com', role: 'member', status: 'pending', sentAt: '2024-12-01', expiresAt: '2024-12-08' },
  { id: 2, email: 'designer@example.com', role: 'member', status: 'expired', sentAt: '2024-11-15', expiresAt: '2024-11-22' },
];

const userStats = [
  { label: 'Total', value: 6, icon: '👥', color: tokens.colors.cenoteTurquoise },
  { label: 'En ligne', value: 3, icon: '🟢', color: tokens.colors.jungleEmerald },
  { label: 'Admins', value: 1, icon: '👑', color: tokens.colors.sacredGold },
  { label: 'Invités', value: 2, icon: '✉️', color: tokens.colors.earthEmber },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

const StatCard = ({ stat }) => (
  <div style={styles.statCard}>
    <div style={{ ...styles.statIcon, backgroundColor: `${stat.color}20`, color: stat.color }}>
      {stat.icon}
    </div>
    <div>
      <div style={styles.statValue}>{stat.value}</div>
      <div style={styles.statLabel}>{stat.label}</div>
    </div>
  </div>
);

const UserCard = ({ user, onClick }) => {
  const [hovered, setHovered] = useState(false);
  
  const roleConfig = {
    admin: { label: 'Admin', bg: `${tokens.colors.sacredGold}20`, color: tokens.colors.sacredGold },
    manager: { label: 'Manager', bg: `${tokens.colors.cenoteTurquoise}20`, color: tokens.colors.cenoteTurquoise },
    member: { label: 'Membre', bg: `${tokens.colors.jungleEmerald}20`, color: tokens.colors.jungleEmerald },
    viewer: { label: 'Viewer', bg: `${tokens.colors.ancientStone}20`, color: tokens.colors.ancientStone },
  };
  
  const statusColors = {
    online: tokens.colors.jungleEmerald,
    busy: tokens.colors.sacredGold,
    offline: tokens.colors.ancientStone,
  };
  
  return (
    <div
      style={{
        ...styles.userCard,
        borderColor: hovered ? tokens.colors.borderHover : tokens.colors.border,
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hovered ? tokens.shadows.glow : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onClick(user)}
    >
      <div style={styles.userCardHeader}>
        <div style={{ ...styles.userAvatar, backgroundColor: user.color }}>
          {user.avatar}
          <div style={{ ...styles.userStatus, backgroundColor: statusColors[user.status] }} />
        </div>
        <div style={styles.userInfo}>
          <div style={styles.userName}>{user.name}</div>
          <div style={styles.userEmail}>{user.email}</div>
          <div
            style={{
              ...styles.userRole,
              backgroundColor: roleConfig[user.role].bg,
              color: roleConfig[user.role].color,
            }}
          >
            {roleConfig[user.role].label}
          </div>
        </div>
      </div>
      
      <div style={styles.userStats}>
        <div style={styles.userStat}>
          <div style={styles.userStatValue}>{user.projects}</div>
          <div style={styles.userStatLabel}>Projets</div>
        </div>
        <div style={styles.userStat}>
          <div style={styles.userStatValue}>{user.tasks}</div>
          <div style={styles.userStatLabel}>Tâches</div>
        </div>
        <div style={styles.userStat}>
          <div style={styles.userStatValue}>{user.completed}</div>
          <div style={styles.userStatLabel}>Complétées</div>
        </div>
      </div>
      
      <div style={styles.userFooter}>
        <div style={styles.userLastActive}>
          🕐 {user.lastActive}
        </div>
        <div style={styles.userActions}>
          <button style={styles.actionButton}>✏️</button>
          <button style={styles.actionButton}>⋮</button>
        </div>
      </div>
    </div>
  );
};

const Toggle = ({ enabled, onChange }) => (
  <div
    style={{
      ...styles.permissionToggle,
      backgroundColor: enabled ? tokens.colors.jungleEmerald : tokens.colors.bg.tertiary,
    }}
    onClick={() => onChange(!enabled)}
  >
    <div
      style={{
        ...styles.permissionToggleKnob,
        transform: enabled ? 'translateX(20px)' : 'translateX(0)',
      }}
    />
  </div>
);

const UsersTab = ({ users, onUserClick }) => (
  <div style={styles.usersGrid}>
    {users.map((user) => (
      <UserCard key={user.id} user={user} onClick={onUserClick} />
    ))}
  </div>
);

const RolesTab = () => {
  const [selectedRole, setSelectedRole] = useState('admin');
  const [permissions, setPermissions] = useState({
    'projects.create': true,
    'projects.edit': true,
    'projects.delete': true,
    'projects.archive': true,
    'users.invite': true,
    'users.edit': true,
    'users.delete': true,
    'users.roles': true,
    'finance.view': true,
    'finance.invoices': true,
    'finance.reports': true,
    'settings.general': true,
    'settings.billing': true,
    'settings.integrations': true,
  });
  
  const togglePermission = (permId) => {
    setPermissions(prev => ({ ...prev, [permId]: !prev[permId] }));
  };
  
  const selectedRoleData = mockRoles.find(r => r.id === selectedRole);
  
  return (
    <div style={styles.rolesContainer}>
      <div style={styles.rolesList}>
        <div style={styles.rolesHeader}>
          <span style={styles.rolesTitle}>Rôles</span>
          <button style={{ ...styles.button, ...styles.buttonSecondary, padding: '6px 12px', fontSize: 12 }}>
            + Ajouter
          </button>
        </div>
        {mockRoles.map((role) => (
          <div
            key={role.id}
            style={{
              ...styles.roleItem,
              backgroundColor: selectedRole === role.id ? tokens.colors.bg.tertiary : 'transparent',
            }}
            onClick={() => setSelectedRole(role.id)}
          >
            <div style={{ ...styles.roleIcon, backgroundColor: `${role.color}20`, color: role.color }}>
              {role.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={styles.roleName}>{role.name}</div>
              <div style={styles.roleCount}>{role.count} utilisateur{role.count > 1 ? 's' : ''}</div>
            </div>
          </div>
        ))}
      </div>
      
      <div style={styles.permissionsPanel}>
        <div style={styles.permissionsHeader}>
          <div style={styles.permissionsTitle}>
            {selectedRoleData?.icon} Permissions - {selectedRoleData?.name}
          </div>
          <div style={styles.permissionsDesc}>
            Configurez les permissions pour ce rôle
          </div>
        </div>
        <div style={styles.permissionsBody}>
          {Object.entries(mockPermissions).map(([group, perms]) => (
            <div key={group} style={styles.permissionGroup}>
              <div style={styles.permissionGroupTitle}>
                {group === 'projects' && '📁'}
                {group === 'users' && '👥'}
                {group === 'finance' && '💰'}
                {group === 'settings' && '⚙️'}
                {group.charAt(0).toUpperCase() + group.slice(1)}
              </div>
              <div style={styles.permissionsList}>
                {perms.map((perm) => (
                  <div key={perm.id} style={styles.permissionItem}>
                    <span style={styles.permissionLabel}>{perm.label}</span>
                    <Toggle
                      enabled={permissions[perm.id]}
                      onChange={() => togglePermission(perm.id)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const InvitationsTab = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');
  
  const statusConfig = {
    pending: { label: 'En attente', bg: `${tokens.colors.sacredGold}20`, color: tokens.colors.sacredGold },
    expired: { label: 'Expiré', bg: `${tokens.colors.error}20`, color: tokens.colors.error },
    accepted: { label: 'Accepté', bg: `${tokens.colors.jungleEmerald}20`, color: tokens.colors.jungleEmerald },
  };
  
  return (
    <div>
      <div style={styles.inviteForm}>
        <div style={styles.inviteGrid}>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Adresse email</label>
            <input
              style={styles.formInput}
              type="email"
              placeholder="nouveau@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Rôle</label>
            <select
              style={styles.formInput}
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="admin">Administrateur</option>
              <option value="manager">Gestionnaire</option>
              <option value="member">Membre</option>
              <option value="viewer">Observateur</option>
            </select>
          </div>
          <button style={{ ...styles.button, ...styles.buttonPrimary }}>
            ✉️ Inviter
          </button>
        </div>
      </div>
      
      <div style={styles.invitesTable}>
        <div style={styles.tableHeader}>
          <span>Email</span>
          <span>Rôle</span>
          <span>Statut</span>
          <span>Expire</span>
          <span>Actions</span>
        </div>
        {mockInvites.map((invite) => (
          <div key={invite.id} style={styles.tableRow}>
            <span style={styles.inviteEmail}>{invite.email}</span>
            <span style={{ color: tokens.colors.text.secondary, fontSize: 14 }}>
              {mockRoles.find(r => r.id === invite.role)?.name}
            </span>
            <span
              style={{
                ...styles.inviteStatus,
                backgroundColor: statusConfig[invite.status].bg,
                color: statusConfig[invite.status].color,
              }}
            >
              {statusConfig[invite.status].label}
            </span>
            <span style={{ color: tokens.colors.text.muted, fontSize: 13 }}>
              {new Date(invite.expiresAt).toLocaleDateString('fr-CA')}
            </span>
            <div style={{ display: 'flex', gap: tokens.spacing.xs }}>
              <button style={styles.actionButton}>🔄</button>
              <button style={styles.actionButton}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const UsersModule = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  
  const tabs = [
    { id: 'users', label: 'Utilisateurs', icon: '👥', count: mockUsers.length },
    { id: 'roles', label: 'Rôles & Permissions', icon: '🔐', count: mockRoles.length },
    { id: 'invitations', label: 'Invitations', icon: '✉️', count: mockInvites.length },
  ];
  
  const filteredUsers = useMemo(() => {
    return mockUsers.filter((user) => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [searchTerm, roleFilter]);
  
  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>
            <div style={styles.titleIcon}>👥</div>
            Utilisateurs
          </h1>
          <p style={styles.subtitle}>Gérez votre équipe et les permissions</p>
        </div>
        <button style={{ ...styles.button, ...styles.buttonPrimary }}>
          + Inviter un utilisateur
        </button>
      </header>
      
      {/* Stats */}
      <div style={styles.statsGrid}>
        {userStats.map((stat, i) => (
          <StatCard key={i} stat={stat} />
        ))}
      </div>
      
      {/* Tabs */}
      <div style={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            style={{
              ...styles.tab,
              ...(activeTab === tab.id ? styles.tabActive : styles.tabInactive),
            }}
            onClick={() => setActiveTab(tab.id)}
          >
            <span>{tab.icon}</span>
            {tab.label}
            <span
              style={{
                ...styles.tabCount,
                backgroundColor: activeTab === tab.id ? 'rgba(0,0,0,0.2)' : tokens.colors.bg.tertiary,
              }}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>
      
      {/* Users Tab */}
      {activeTab === 'users' && (
        <>
          <div style={styles.toolbar}>
            <div style={styles.searchContainer}>
              <span style={styles.searchIcon}>🔍</span>
              <input
                style={styles.searchInput}
                placeholder="Rechercher un utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div style={styles.filterGroup}>
              <select
                style={styles.filterSelect}
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">Tous les rôles</option>
                <option value="admin">Administrateur</option>
                <option value="manager">Gestionnaire</option>
                <option value="member">Membre</option>
                <option value="viewer">Observateur</option>
              </select>
            </div>
          </div>
          <UsersTab users={filteredUsers} onUserClick={setSelectedUser} />
        </>
      )}
      
      {/* Roles Tab */}
      {activeTab === 'roles' && <RolesTab />}
      
      {/* Invitations Tab */}
      {activeTab === 'invitations' && <InvitationsTab />}
    </div>
  );
};

export default UsersModule;
