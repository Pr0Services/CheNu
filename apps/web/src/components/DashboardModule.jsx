/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — DASHBOARD MODULE
 * ═══════════════════════════════════════════════════════════════════════════════
 * Module Dashboard complet avec style Techno-Mythique:
 * - KPIs temps réel avec animations
 * - Graphiques interactifs (revenus, projets, activité)
 * - Timeline d'activité
 * - Widgets configurables
 * - Notifications intelligentes
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useMemo, useEffect } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS CHE·NU™
// ─────────────────────────────────────────────────────────────────────────────

const tokens = {
  colors: {
    // Palette Officielle CHE·NU™
    sacredGold: '#D8B26A',
    ancientStone: '#8D8371',
    jungleEmerald: '#3F7249',
    cenoteTurquoise: '#3EB4A2',
    shadowMoss: '#2F4C39',
    earthEmber: '#7A593A',
    // UI Colors
    darkSlate: '#1A1A1A',
    softSand: '#E9E4D6',
    // Semantic
    success: '#3F7249',
    warning: '#D8B26A',
    error: '#C45C4A',
    info: '#3EB4A2',
    // Backgrounds
    bg: {
      primary: '#0f1217',
      secondary: '#161B22',
      tertiary: '#1E242C',
      card: 'rgba(22, 27, 34, 0.95)',
      glow: 'rgba(216, 178, 106, 0.05)',
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
    glowStrong: '0 0 40px rgba(216, 178, 106, 0.25)',
  },
  fonts: {
    heading: "'Lora', 'Josefin Sans', serif",
    body: "'Inter', 'Nunito', sans-serif",
    mono: "'JetBrains Mono', monospace",
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
  
  // Header
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: tokens.spacing.xl,
    paddingBottom: tokens.spacing.lg,
    borderBottom: `1px solid ${tokens.colors.border}`,
  },
  headerLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacing.xs,
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
    background: `linear-gradient(135deg, ${tokens.colors.sacredGold} 0%, ${tokens.colors.earthEmber} 100%)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    boxShadow: tokens.shadows.glow,
  },
  subtitle: {
    fontSize: 14,
    color: tokens.colors.text.secondary,
    margin: 0,
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacing.md,
  },
  
  // Date Picker
  datePicker: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacing.sm,
    padding: '10px 16px',
    backgroundColor: tokens.colors.bg.tertiary,
    border: `1px solid ${tokens.colors.border}`,
    borderRadius: tokens.radius.lg,
    color: tokens.colors.text.primary,
    fontSize: 13,
    cursor: 'pointer',
    transition: tokens.transitions.fast,
  },
  
  // Quick Actions
  quickAction: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    backgroundColor: tokens.colors.bg.tertiary,
    border: `1px solid ${tokens.colors.border}`,
    borderRadius: tokens.radius.md,
    color: tokens.colors.text.secondary,
    fontSize: 16,
    cursor: 'pointer',
    transition: tokens.transitions.fast,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    backgroundColor: tokens.colors.error,
    borderRadius: tokens.radius.full,
    fontSize: 10,
    fontWeight: 600,
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // KPI Grid
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: tokens.spacing.md,
    marginBottom: tokens.spacing.xl,
  },
  kpiCard: {
    backgroundColor: tokens.colors.bg.card,
    borderRadius: tokens.radius.xl,
    padding: tokens.spacing.lg,
    border: `1px solid ${tokens.colors.border}`,
    position: 'relative',
    overflow: 'hidden',
    transition: tokens.transitions.normal,
    cursor: 'pointer',
  },
  kpiCardHover: {
    borderColor: tokens.colors.borderHover,
    boxShadow: tokens.shadows.glow,
  },
  kpiGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    borderRadius: `${tokens.radius.xl}px ${tokens.radius.xl}px 0 0`,
  },
  kpiHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: tokens.spacing.md,
  },
  kpiIcon: {
    width: 44,
    height: 44,
    borderRadius: tokens.radius.lg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
  },
  kpiTrend: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 12,
    fontWeight: 500,
    padding: '4px 10px',
    borderRadius: tokens.radius.full,
  },
  kpiLabel: {
    fontSize: 13,
    color: tokens.colors.text.secondary,
    marginBottom: tokens.spacing.xs,
  },
  kpiValue: {
    fontSize: 32,
    fontWeight: 700,
    fontFamily: tokens.fonts.heading,
    color: tokens.colors.text.primary,
    marginBottom: tokens.spacing.xs,
  },
  kpiSubtext: {
    fontSize: 12,
    color: tokens.colors.text.muted,
  },
  
  // Main Grid
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: tokens.spacing.lg,
    marginBottom: tokens.spacing.lg,
  },
  
  // Cards
  card: {
    backgroundColor: tokens.colors.bg.card,
    borderRadius: tokens.radius.xl,
    border: `1px solid ${tokens.colors.border}`,
    overflow: 'hidden',
  },
  cardHeader: {
    padding: `${tokens.spacing.lg}px ${tokens.spacing.lg}px ${tokens.spacing.md}px`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 600,
    fontFamily: tokens.fonts.heading,
    color: tokens.colors.text.primary,
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  cardBody: {
    padding: `0 ${tokens.spacing.lg}px ${tokens.spacing.lg}px`,
  },
  
  // Chart
  chartContainer: {
    height: 280,
    position: 'relative',
  },
  chartBar: {
    position: 'absolute',
    bottom: 40,
    borderRadius: `${tokens.radius.sm}px ${tokens.radius.sm}px 0 0`,
    transition: tokens.transitions.slow,
    cursor: 'pointer',
  },
  chartLabel: {
    position: 'absolute',
    bottom: 12,
    fontSize: 11,
    color: tokens.colors.text.muted,
    textAlign: 'center',
    width: 50,
    marginLeft: -10,
  },
  chartTooltip: {
    position: 'absolute',
    backgroundColor: tokens.colors.bg.tertiary,
    border: `1px solid ${tokens.colors.border}`,
    borderRadius: tokens.radius.md,
    padding: '8px 12px',
    fontSize: 12,
    color: tokens.colors.text.primary,
    boxShadow: tokens.shadows.md,
    zIndex: 10,
    pointerEvents: 'none',
  },
  chartGrid: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderTop: `1px dashed ${tokens.colors.border}`,
  },
  chartGridLabel: {
    position: 'absolute',
    left: -35,
    fontSize: 10,
    color: tokens.colors.text.muted,
    transform: 'translateY(-50%)',
  },
  
  // Activity Timeline
  timeline: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacing.sm,
    maxHeight: 340,
    overflowY: 'auto',
    paddingRight: tokens.spacing.sm,
  },
  timelineItem: {
    display: 'flex',
    gap: tokens.spacing.md,
    padding: tokens.spacing.md,
    borderRadius: tokens.radius.lg,
    backgroundColor: tokens.colors.bg.secondary,
    transition: tokens.transitions.fast,
    cursor: 'pointer',
  },
  timelineIcon: {
    width: 36,
    height: 36,
    borderRadius: tokens.radius.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    flexShrink: 0,
  },
  timelineContent: {
    flex: 1,
    minWidth: 0,
  },
  timelineTitle: {
    fontSize: 13,
    fontWeight: 500,
    color: tokens.colors.text.primary,
    marginBottom: 2,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  timelineDesc: {
    fontSize: 12,
    color: tokens.colors.text.secondary,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  timelineTime: {
    fontSize: 11,
    color: tokens.colors.text.muted,
    flexShrink: 0,
  },
  
  // Projects List
  projectsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: tokens.spacing.md,
  },
  projectCard: {
    backgroundColor: tokens.colors.bg.secondary,
    borderRadius: tokens.radius.lg,
    padding: tokens.spacing.lg,
    border: `1px solid ${tokens.colors.border}`,
    transition: tokens.transitions.fast,
    cursor: 'pointer',
  },
  projectHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: tokens.spacing.md,
  },
  projectIcon: {
    width: 40,
    height: 40,
    borderRadius: tokens.radius.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
  },
  projectStatus: {
    fontSize: 11,
    fontWeight: 500,
    padding: '4px 10px',
    borderRadius: tokens.radius.full,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  projectName: {
    fontSize: 15,
    fontWeight: 600,
    color: tokens.colors.text.primary,
    marginBottom: tokens.spacing.xs,
  },
  projectClient: {
    fontSize: 12,
    color: tokens.colors.text.secondary,
    marginBottom: tokens.spacing.md,
  },
  projectProgress: {
    marginBottom: tokens.spacing.sm,
  },
  progressBar: {
    height: 6,
    backgroundColor: tokens.colors.bg.tertiary,
    borderRadius: tokens.radius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: tokens.radius.full,
    transition: tokens.transitions.slow,
  },
  progressLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 11,
    color: tokens.colors.text.muted,
    marginTop: tokens.spacing.xs,
  },
  projectFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: tokens.spacing.md,
    borderTop: `1px solid ${tokens.colors.border}`,
  },
  projectMembers: {
    display: 'flex',
  },
  memberAvatar: {
    width: 28,
    height: 28,
    borderRadius: tokens.radius.full,
    border: `2px solid ${tokens.colors.bg.secondary}`,
    marginLeft: -8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 11,
    fontWeight: 600,
    color: '#fff',
  },
  projectDeadline: {
    fontSize: 11,
    color: tokens.colors.text.muted,
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  
  // Widgets Row
  widgetsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: tokens.spacing.lg,
  },
  
  // Tasks Widget
  taskItem: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacing.md,
    padding: tokens.spacing.md,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.colors.bg.secondary,
    marginBottom: tokens.spacing.sm,
    transition: tokens.transitions.fast,
    cursor: 'pointer',
  },
  taskCheckbox: {
    width: 20,
    height: 20,
    borderRadius: tokens.radius.sm,
    border: `2px solid ${tokens.colors.border}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: tokens.transitions.fast,
    flexShrink: 0,
  },
  taskContent: {
    flex: 1,
    minWidth: 0,
  },
  taskTitle: {
    fontSize: 13,
    color: tokens.colors.text.primary,
    marginBottom: 2,
  },
  taskMeta: {
    fontSize: 11,
    color: tokens.colors.text.muted,
  },
  taskPriority: {
    width: 8,
    height: 8,
    borderRadius: tokens.radius.full,
    flexShrink: 0,
  },
  
  // Team Widget
  teamMember: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacing.md,
    padding: tokens.spacing.md,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.colors.bg.secondary,
    marginBottom: tokens.spacing.sm,
  },
  teamAvatar: {
    width: 40,
    height: 40,
    borderRadius: tokens.radius.full,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    fontWeight: 600,
    color: '#fff',
    position: 'relative',
  },
  teamStatus: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: tokens.radius.full,
    border: `2px solid ${tokens.colors.bg.secondary}`,
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    fontSize: 13,
    fontWeight: 500,
    color: tokens.colors.text.primary,
  },
  teamRole: {
    fontSize: 11,
    color: tokens.colors.text.muted,
  },
  
  // Button
  button: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacing.sm,
    padding: '8px 16px',
    fontSize: 13,
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
  
  // Empty State
  emptyState: {
    padding: tokens.spacing.xxl,
    textAlign: 'center',
    color: tokens.colors.text.muted,
  },
  
  // Scrollbar custom
  scrollbar: {
    scrollbarWidth: 'thin',
    scrollbarColor: `${tokens.colors.border} transparent`,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────

const mockKPIs = [
  {
    id: 'revenue',
    label: 'Revenus du mois',
    value: 127850,
    format: 'currency',
    trend: 12.5,
    icon: '💰',
    color: tokens.colors.sacredGold,
    subtext: 'vs 113,650 $ le mois dernier',
  },
  {
    id: 'projects',
    label: 'Projets actifs',
    value: 24,
    format: 'number',
    trend: 8.3,
    icon: '📁',
    color: tokens.colors.cenoteTurquoise,
    subtext: '6 complétés ce mois',
  },
  {
    id: 'tasks',
    label: 'Tâches terminées',
    value: 156,
    format: 'number',
    trend: -2.1,
    icon: '✅',
    color: tokens.colors.jungleEmerald,
    subtext: '23 en cours, 12 en retard',
  },
  {
    id: 'team',
    label: 'Productivité équipe',
    value: 94.2,
    format: 'percent',
    trend: 5.7,
    icon: '👥',
    color: tokens.colors.earthEmber,
    subtext: '18 membres actifs',
  },
];

const mockChartData = [
  { month: 'Juil', revenue: 85000, expenses: 62000 },
  { month: 'Août', revenue: 92000, expenses: 58000 },
  { month: 'Sept', revenue: 78000, expenses: 65000 },
  { month: 'Oct', revenue: 105000, expenses: 71000 },
  { month: 'Nov', revenue: 118000, expenses: 68000 },
  { month: 'Déc', revenue: 128000, expenses: 75000 },
];

const mockActivities = [
  { id: 1, type: 'project', title: 'Nouveau projet créé', desc: 'Rénovation Cuisine - Dupont', time: 'Il y a 5 min', icon: '📁', color: tokens.colors.cenoteTurquoise },
  { id: 2, type: 'payment', title: 'Paiement reçu', desc: '15,750 $ - Facture #2024-089', time: 'Il y a 23 min', icon: '💵', color: tokens.colors.jungleEmerald },
  { id: 3, type: 'task', title: 'Tâche complétée', desc: 'Inspection finale - Projet Martin', time: 'Il y a 1h', icon: '✅', color: tokens.colors.jungleEmerald },
  { id: 4, type: 'comment', title: 'Nouveau commentaire', desc: 'Marie sur "Plans électriques"', time: 'Il y a 2h', icon: '💬', color: tokens.colors.sacredGold },
  { id: 5, type: 'alert', title: 'Rappel échéance', desc: 'Permis de construction expire dans 3 jours', time: 'Il y a 3h', icon: '⚠️', color: tokens.colors.warning },
  { id: 6, type: 'document', title: 'Document ajouté', desc: 'Devis_Toiture_v2.pdf', time: 'Il y a 4h', icon: '📄', color: tokens.colors.ancientStone },
];

const mockProjects = [
  { id: 1, name: 'Rénovation Complète', client: 'Famille Tremblay', progress: 75, status: 'active', deadline: '15 Jan', members: ['JT', 'MC', 'PL'], color: tokens.colors.cenoteTurquoise },
  { id: 2, name: 'Extension Garage', client: 'M. Bergeron', progress: 45, status: 'active', deadline: '28 Jan', members: ['AB', 'RL'], color: tokens.colors.jungleEmerald },
  { id: 3, name: 'Cuisine Moderne', client: 'Mme Gagnon', progress: 92, status: 'review', deadline: '8 Jan', members: ['JT', 'MC', 'AB', 'RL'], color: tokens.colors.sacredGold },
];

const mockTasks = [
  { id: 1, title: 'Finaliser devis toiture', priority: 'high', project: 'Tremblay', due: 'Aujourd\'hui' },
  { id: 2, title: 'Commander matériaux électriques', priority: 'medium', project: 'Bergeron', due: 'Demain' },
  { id: 3, title: 'Appeler inspecteur RBQ', priority: 'high', project: 'Gagnon', due: 'Aujourd\'hui' },
  { id: 4, title: 'Réviser plans architecte', priority: 'low', project: 'Tremblay', due: 'Ven' },
];

const mockTeam = [
  { id: 1, name: 'Jean Tremblay', role: 'Chef de projet', status: 'online', avatar: 'JT', color: '#4A90D9' },
  { id: 2, name: 'Marie Côté', role: 'Architecte', status: 'online', avatar: 'MC', color: '#D94A6A' },
  { id: 3, name: 'Pierre Lavoie', role: 'Électricien', status: 'busy', avatar: 'PL', color: '#6AD94A' },
  { id: 4, name: 'Anne Bouchard', role: 'Comptable', status: 'offline', avatar: 'AB', color: '#D9A04A' },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

const KPICard = ({ kpi }) => {
  const [hovered, setHovered] = useState(false);
  
  const formatValue = (value, format) => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(value);
      case 'percent':
        return `${value}%`;
      default:
        return value.toLocaleString('fr-CA');
    }
  };
  
  return (
    <div
      style={{
        ...styles.kpiCard,
        ...(hovered ? styles.kpiCardHover : {}),
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ ...styles.kpiGlow, background: `linear-gradient(90deg, ${kpi.color}, transparent)` }} />
      <div style={styles.kpiHeader}>
        <div style={{ ...styles.kpiIcon, backgroundColor: `${kpi.color}20`, color: kpi.color }}>
          {kpi.icon}
        </div>
        <div
          style={{
            ...styles.kpiTrend,
            backgroundColor: kpi.trend >= 0 ? `${tokens.colors.jungleEmerald}20` : `${tokens.colors.error}20`,
            color: kpi.trend >= 0 ? tokens.colors.jungleEmerald : tokens.colors.error,
          }}
        >
          {kpi.trend >= 0 ? '↑' : '↓'} {Math.abs(kpi.trend)}%
        </div>
      </div>
      <div style={styles.kpiLabel}>{kpi.label}</div>
      <div style={styles.kpiValue}>{formatValue(kpi.value, kpi.format)}</div>
      <div style={styles.kpiSubtext}>{kpi.subtext}</div>
    </div>
  );
};

const RevenueChart = ({ data }) => {
  const [hoveredBar, setHoveredBar] = useState(null);
  const maxValue = Math.max(...data.map(d => Math.max(d.revenue, d.expenses)));
  const barWidth = 30;
  const gap = 60;
  
  return (
    <div style={styles.chartContainer}>
      {/* Grid lines */}
      {[0, 25, 50, 75, 100].map((percent) => (
        <div key={percent} style={{ ...styles.chartGrid, bottom: 40 + (percent * 2) }}>
          <span style={styles.chartGridLabel}>
            {Math.round((maxValue * percent) / 100 / 1000)}k
          </span>
        </div>
      ))}
      
      {/* Bars */}
      {data.map((item, index) => {
        const revenueHeight = (item.revenue / maxValue) * 200;
        const expenseHeight = (item.expenses / maxValue) * 200;
        const x = 50 + index * gap;
        
        return (
          <React.Fragment key={item.month}>
            {/* Revenue bar */}
            <div
              style={{
                ...styles.chartBar,
                left: x,
                width: barWidth,
                height: revenueHeight,
                background: `linear-gradient(180deg, ${tokens.colors.sacredGold} 0%, ${tokens.colors.earthEmber} 100%)`,
                opacity: hoveredBar === `${index}-rev` ? 1 : 0.85,
                transform: hoveredBar === `${index}-rev` ? 'scaleY(1.02)' : 'scaleY(1)',
                transformOrigin: 'bottom',
              }}
              onMouseEnter={() => setHoveredBar(`${index}-rev`)}
              onMouseLeave={() => setHoveredBar(null)}
            />
            
            {/* Expense bar */}
            <div
              style={{
                ...styles.chartBar,
                left: x + barWidth + 4,
                width: barWidth,
                height: expenseHeight,
                background: `linear-gradient(180deg, ${tokens.colors.cenoteTurquoise} 0%, ${tokens.colors.shadowMoss} 100%)`,
                opacity: hoveredBar === `${index}-exp` ? 1 : 0.7,
                transform: hoveredBar === `${index}-exp` ? 'scaleY(1.02)' : 'scaleY(1)',
                transformOrigin: 'bottom',
              }}
              onMouseEnter={() => setHoveredBar(`${index}-exp`)}
              onMouseLeave={() => setHoveredBar(null)}
            />
            
            {/* Label */}
            <div style={{ ...styles.chartLabel, left: x + barWidth }}>
              {item.month}
            </div>
            
            {/* Tooltip */}
            {hoveredBar === `${index}-rev` && (
              <div style={{ ...styles.chartTooltip, left: x - 20, bottom: revenueHeight + 50 }}>
                <div style={{ fontWeight: 600, color: tokens.colors.sacredGold }}>Revenus</div>
                <div>{new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(item.revenue)}</div>
              </div>
            )}
            {hoveredBar === `${index}-exp` && (
              <div style={{ ...styles.chartTooltip, left: x + 20, bottom: expenseHeight + 50 }}>
                <div style={{ fontWeight: 600, color: tokens.colors.cenoteTurquoise }}>Dépenses</div>
                <div>{new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(item.expenses)}</div>
              </div>
            )}
          </React.Fragment>
        );
      })}
      
      {/* Legend */}
      <div style={{ position: 'absolute', top: 0, right: 0, display: 'flex', gap: 16, fontSize: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: 3, background: tokens.colors.sacredGold }} />
          <span style={{ color: tokens.colors.text.secondary }}>Revenus</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: 3, background: tokens.colors.cenoteTurquoise }} />
          <span style={{ color: tokens.colors.text.secondary }}>Dépenses</span>
        </div>
      </div>
    </div>
  );
};

const ActivityTimeline = ({ activities }) => (
  <div style={{ ...styles.timeline, ...styles.scrollbar }}>
    {activities.map((activity) => (
      <div
        key={activity.id}
        style={styles.timelineItem}
      >
        <div style={{ ...styles.timelineIcon, backgroundColor: `${activity.color}20`, color: activity.color }}>
          {activity.icon}
        </div>
        <div style={styles.timelineContent}>
          <div style={styles.timelineTitle}>{activity.title}</div>
          <div style={styles.timelineDesc}>{activity.desc}</div>
        </div>
        <div style={styles.timelineTime}>{activity.time}</div>
      </div>
    ))}
  </div>
);

const ProjectCard = ({ project }) => {
  const [hovered, setHovered] = useState(false);
  
  const statusColors = {
    active: { bg: `${tokens.colors.jungleEmerald}20`, text: tokens.colors.jungleEmerald },
    review: { bg: `${tokens.colors.sacredGold}20`, text: tokens.colors.sacredGold },
    paused: { bg: `${tokens.colors.ancientStone}20`, text: tokens.colors.ancientStone },
  };
  
  const memberColors = ['#4A90D9', '#D94A6A', '#6AD94A', '#D9A04A', '#9B59B6'];
  
  return (
    <div
      style={{
        ...styles.projectCard,
        borderColor: hovered ? tokens.colors.borderHover : tokens.colors.border,
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={styles.projectHeader}>
        <div style={{ ...styles.projectIcon, backgroundColor: `${project.color}20`, color: project.color }}>
          📁
        </div>
        <div
          style={{
            ...styles.projectStatus,
            backgroundColor: statusColors[project.status].bg,
            color: statusColors[project.status].text,
          }}
        >
          {project.status === 'active' ? 'Actif' : project.status === 'review' ? 'Révision' : 'En pause'}
        </div>
      </div>
      <div style={styles.projectName}>{project.name}</div>
      <div style={styles.projectClient}>{project.client}</div>
      <div style={styles.projectProgress}>
        <div style={styles.progressBar}>
          <div
            style={{
              ...styles.progressFill,
              width: `${project.progress}%`,
              background: `linear-gradient(90deg, ${project.color}, ${project.color}80)`,
            }}
          />
        </div>
        <div style={styles.progressLabel}>
          <span>Progression</span>
          <span style={{ color: project.color, fontWeight: 600 }}>{project.progress}%</span>
        </div>
      </div>
      <div style={styles.projectFooter}>
        <div style={styles.projectMembers}>
          {project.members.slice(0, 4).map((member, i) => (
            <div
              key={member}
              style={{
                ...styles.memberAvatar,
                backgroundColor: memberColors[i % memberColors.length],
                zIndex: project.members.length - i,
              }}
            >
              {member}
            </div>
          ))}
          {project.members.length > 4 && (
            <div
              style={{
                ...styles.memberAvatar,
                backgroundColor: tokens.colors.ancientStone,
              }}
            >
              +{project.members.length - 4}
            </div>
          )}
        </div>
        <div style={styles.projectDeadline}>
          📅 {project.deadline}
        </div>
      </div>
    </div>
  );
};

const TasksWidget = ({ tasks }) => {
  const [completedTasks, setCompletedTasks] = useState([]);
  
  const priorityColors = {
    high: tokens.colors.error,
    medium: tokens.colors.sacredGold,
    low: tokens.colors.jungleEmerald,
  };
  
  const toggleTask = (taskId) => {
    setCompletedTasks(prev =>
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };
  
  return (
    <div>
      {tasks.map((task) => {
        const isCompleted = completedTasks.includes(task.id);
        return (
          <div
            key={task.id}
            style={{
              ...styles.taskItem,
              opacity: isCompleted ? 0.5 : 1,
            }}
          >
            <div
              style={{
                ...styles.taskCheckbox,
                backgroundColor: isCompleted ? tokens.colors.jungleEmerald : 'transparent',
                borderColor: isCompleted ? tokens.colors.jungleEmerald : tokens.colors.border,
              }}
              onClick={() => toggleTask(task.id)}
            >
              {isCompleted && <span style={{ color: '#fff', fontSize: 12 }}>✓</span>}
            </div>
            <div style={styles.taskContent}>
              <div
                style={{
                  ...styles.taskTitle,
                  textDecoration: isCompleted ? 'line-through' : 'none',
                }}
              >
                {task.title}
              </div>
              <div style={styles.taskMeta}>
                {task.project} • {task.due}
              </div>
            </div>
            <div
              style={{
                ...styles.taskPriority,
                backgroundColor: priorityColors[task.priority],
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

const TeamWidget = ({ team }) => {
  const statusColors = {
    online: tokens.colors.jungleEmerald,
    busy: tokens.colors.sacredGold,
    offline: tokens.colors.ancientStone,
  };
  
  return (
    <div>
      {team.map((member) => (
        <div key={member.id} style={styles.teamMember}>
          <div style={{ ...styles.teamAvatar, backgroundColor: member.color }}>
            {member.avatar}
            <div
              style={{
                ...styles.teamStatus,
                backgroundColor: statusColors[member.status],
              }}
            />
          </div>
          <div style={styles.teamInfo}>
            <div style={styles.teamName}>{member.name}</div>
            <div style={styles.teamRole}>{member.role}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const DashboardModule = () => {
  const [currentDate] = useState(new Date());
  const [notifications] = useState(5);
  
  const formattedDate = currentDate.toLocaleDateString('fr-CA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 style={styles.title}>
            <div style={styles.titleIcon}>🏛️</div>
            Tableau de bord
          </h1>
          <p style={styles.subtitle}>Bienvenue ! Voici votre vue d'ensemble pour {formattedDate}</p>
        </div>
        <div style={styles.headerRight}>
          <div style={styles.datePicker}>
            📅 <span>30 derniers jours</span> <span style={{ opacity: 0.5 }}>▼</span>
          </div>
          <button style={styles.quickAction}>
            🔔
            {notifications > 0 && (
              <span style={styles.notificationBadge}>{notifications}</span>
            )}
          </button>
          <button style={styles.quickAction}>⚙️</button>
        </div>
      </header>
      
      {/* KPIs */}
      <div style={styles.kpiGrid}>
        {mockKPIs.map((kpi) => (
          <KPICard key={kpi.id} kpi={kpi} />
        ))}
      </div>
      
      {/* Main Content */}
      <div style={styles.mainGrid}>
        {/* Revenue Chart */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.cardTitle}>
              📈 Revenus vs Dépenses
            </div>
            <button style={{ ...styles.button, ...styles.buttonSecondary }}>
              Voir détails
            </button>
          </div>
          <div style={styles.cardBody}>
            <RevenueChart data={mockChartData} />
          </div>
        </div>
        
        {/* Activity Timeline */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.cardTitle}>
              🕐 Activité récente
            </div>
            <button style={{ ...styles.button, ...styles.buttonSecondary }}>
              Tout voir
            </button>
          </div>
          <div style={styles.cardBody}>
            <ActivityTimeline activities={mockActivities} />
          </div>
        </div>
      </div>
      
      {/* Projects */}
      <div style={{ ...styles.card, marginBottom: tokens.spacing.lg }}>
        <div style={styles.cardHeader}>
          <div style={styles.cardTitle}>
            📁 Projets en cours
          </div>
          <button style={{ ...styles.button, ...styles.buttonPrimary }}>
            + Nouveau projet
          </button>
        </div>
        <div style={{ ...styles.cardBody }}>
          <div style={styles.projectsGrid}>
            {mockProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </div>
      
      {/* Bottom Widgets */}
      <div style={styles.widgetsRow}>
        {/* Tasks */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.cardTitle}>✅ Tâches prioritaires</div>
          </div>
          <div style={styles.cardBody}>
            <TasksWidget tasks={mockTasks} />
          </div>
        </div>
        
        {/* Team */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.cardTitle}>👥 Équipe</div>
          </div>
          <div style={styles.cardBody}>
            <TeamWidget team={mockTeam} />
          </div>
        </div>
        
        {/* Quick Stats */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.cardTitle}>⚡ Actions rapides</div>
          </div>
          <div style={{ ...styles.cardBody, display: 'grid', gap: tokens.spacing.sm }}>
            <button style={{ ...styles.button, ...styles.buttonPrimary, width: '100%', justifyContent: 'flex-start' }}>
              📝 Créer une facture
            </button>
            <button style={{ ...styles.button, ...styles.buttonSecondary, width: '100%', justifyContent: 'flex-start' }}>
              📁 Nouveau projet
            </button>
            <button style={{ ...styles.button, ...styles.buttonSecondary, width: '100%', justifyContent: 'flex-start' }}>
              👤 Ajouter un client
            </button>
            <button style={{ ...styles.button, ...styles.buttonSecondary, width: '100%', justifyContent: 'flex-start' }}>
              📊 Générer rapport
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardModule;
