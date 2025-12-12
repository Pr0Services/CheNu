/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — ANALYTICS DASHBOARD COMPONENT
 * ═══════════════════════════════════════════════════════════════════════════════
 * Dashboard analytique complet avec:
 * - KPIs temps réel
 * - Graphiques interactifs
 * - Prédictions Nova IA
 * - Comparaisons périodiques
 * - Export de rapports
 * 
 * Dépendances: recharts, lucide-react
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useEffect, useMemo } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// TOKENS & STYLES
// ─────────────────────────────────────────────────────────────────────────────

const tokens = {
  colors: {
    primary: '#d4a855',
    secondary: '#5a9a6e',
    accent: '#5bb5a6',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    bg: {
      primary: '#0f1419',
      secondary: '#1a1f2e',
      tertiary: '#252b3b',
      card: 'rgba(26, 31, 46, 0.8)',
    },
    text: {
      primary: '#f5f5f5',
      secondary: '#a0a0a0',
      muted: '#6b7280',
    },
    border: 'rgba(212, 168, 85, 0.2)',
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  radius: { sm: 4, md: 8, lg: 12, xl: 16 },
};

const styles = {
  dashboard: {
    padding: tokens.spacing.lg,
    backgroundColor: tokens.colors.bg.primary,
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    color: tokens.colors.text.primary,
    margin: 0,
  },
  subtitle: {
    fontSize: 14,
    color: tokens.colors.text.secondary,
    marginTop: 4,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: tokens.spacing.md,
    marginBottom: tokens.spacing.lg,
  },
  card: {
    backgroundColor: tokens.colors.bg.card,
    borderRadius: tokens.radius.lg,
    padding: tokens.spacing.lg,
    border: `1px solid ${tokens.colors.border}`,
    backdropFilter: 'blur(10px)',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 500,
    color: tokens.colors.text.secondary,
    marginBottom: tokens.spacing.sm,
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  kpiValue: {
    fontSize: 32,
    fontWeight: 700,
    color: tokens.colors.text.primary,
    lineHeight: 1,
  },
  kpiChange: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 13,
    fontWeight: 500,
    marginTop: tokens.spacing.sm,
    padding: '4px 8px',
    borderRadius: tokens.radius.sm,
  },
  chartContainer: {
    backgroundColor: tokens.colors.bg.card,
    borderRadius: tokens.radius.lg,
    padding: tokens.spacing.lg,
    border: `1px solid ${tokens.colors.border}`,
    marginBottom: tokens.spacing.lg,
  },
  chartHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.md,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: tokens.colors.text.primary,
  },
  periodSelector: {
    display: 'flex',
    gap: tokens.spacing.xs,
  },
  periodButton: {
    padding: '6px 12px',
    fontSize: 12,
    fontWeight: 500,
    borderRadius: tokens.radius.sm,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  insightCard: {
    display: 'flex',
    gap: tokens.spacing.md,
    padding: tokens.spacing.md,
    backgroundColor: tokens.colors.bg.tertiary,
    borderRadius: tokens.radius.md,
    marginBottom: tokens.spacing.sm,
    border: `1px solid ${tokens.colors.border}`,
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: tokens.radius.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
    flexShrink: 0,
  },
  progressBar: {
    height: 8,
    backgroundColor: tokens.colors.bg.tertiary,
    borderRadius: tokens.radius.sm,
    overflow: 'hidden',
    marginTop: tokens.spacing.sm,
  },
  progressFill: {
    height: '100%',
    borderRadius: tokens.radius.sm,
    transition: 'width 0.5s ease',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '12px 16px',
    fontSize: 12,
    fontWeight: 600,
    color: tokens.colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: `1px solid ${tokens.colors.border}`,
  },
  td: {
    padding: '16px',
    fontSize: 14,
    color: tokens.colors.text.primary,
    borderBottom: `1px solid ${tokens.colors.border}`,
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 10px',
    borderRadius: tokens.radius.xl,
    fontSize: 12,
    fontWeight: 500,
  },
  button: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: tokens.spacing.sm,
    padding: '10px 20px',
    fontSize: 14,
    fontWeight: 500,
    borderRadius: tokens.radius.md,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────

const mockKPIs = [
  {
    id: 'revenue',
    label: 'Revenus',
    value: 247850,
    previousValue: 215420,
    format: 'currency',
    icon: '💰',
    color: tokens.colors.success,
  },
  {
    id: 'projects',
    label: 'Projets Actifs',
    value: 12,
    previousValue: 10,
    format: 'number',
    icon: '📋',
    color: tokens.colors.primary,
  },
  {
    id: 'tasks',
    label: 'Tâches Complétées',
    value: 89,
    previousValue: 72,
    format: 'number',
    icon: '✅',
    color: tokens.colors.accent,
  },
  {
    id: 'team',
    label: 'Heures Équipe',
    value: 1240,
    previousValue: 1180,
    format: 'hours',
    icon: '👥',
    color: tokens.colors.secondary,
  },
];

const mockRevenueData = [
  { month: 'Jan', revenue: 185000, expenses: 142000, profit: 43000 },
  { month: 'Fév', revenue: 198000, expenses: 155000, profit: 43000 },
  { month: 'Mar', revenue: 215000, expenses: 168000, profit: 47000 },
  { month: 'Avr', revenue: 232000, expenses: 175000, profit: 57000 },
  { month: 'Mai', revenue: 248000, expenses: 182000, profit: 66000 },
  { month: 'Juin', revenue: 267000, expenses: 195000, profit: 72000 },
];

const mockProjectsData = [
  { name: 'Rénovation Tremblay', progress: 72, budget: 85000, spent: 68000, status: 'on_track', dueDate: '28 Fév' },
  { name: 'Agrandissement Bergeron', progress: 45, budget: 180000, spent: 72000, status: 'ahead', dueDate: '30 Juin' },
  { name: 'Entrepôt ABC', progress: 15, budget: 2500000, spent: 187500, status: 'planning', dueDate: '31 Déc' },
  { name: 'Condo St-Denis', progress: 88, budget: 320000, spent: 298000, status: 'at_risk', dueDate: '15 Jan' },
];

const mockInsights = [
  {
    type: 'warning',
    icon: '⚠️',
    title: 'Retard potentiel détecté',
    description: 'Le projet Tremblay risque un retard de 5 jours',
    action: 'Voir détails',
    color: tokens.colors.warning,
  },
  {
    type: 'opportunity',
    icon: '💡',
    title: 'Économie identifiée',
    description: 'Regrouper les commandes pourrait économiser 4,500$',
    action: 'Analyser',
    color: tokens.colors.info,
  },
  {
    type: 'alert',
    icon: '🔔',
    title: 'Formation expirante',
    description: '2 employés SST à renouveler sous 30 jours',
    action: 'Planifier',
    color: tokens.colors.error,
  },
];

const mockCashflow = [
  { date: '04 Déc', inflow: 15000, outflow: 8000, balance: 52000 },
  { date: '05 Déc', inflow: 0, outflow: 3500, balance: 48500 },
  { date: '06 Déc', inflow: 25000, outflow: 12000, balance: 61500 },
  { date: '07 Déc', inflow: 0, outflow: 0, balance: 61500 },
  { date: '08 Déc', inflow: 8000, outflow: 15000, balance: 54500 },
  { date: '09 Déc', inflow: 0, outflow: 5000, balance: 49500 },
  { date: '10 Déc', inflow: 32000, outflow: 8500, balance: 73000 },
];

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

const formatCurrency = (value) => {
  return new Intl.NumberFormat('fr-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatNumber = (value) => {
  return new Intl.NumberFormat('fr-CA').format(value);
};

const calculateChange = (current, previous) => {
  if (!previous) return 0;
  return ((current - previous) / previous) * 100;
};

const getStatusColor = (status) => {
  switch (status) {
    case 'on_track': return tokens.colors.success;
    case 'ahead': return tokens.colors.info;
    case 'at_risk': return tokens.colors.error;
    case 'planning': return tokens.colors.secondary;
    default: return tokens.colors.text.muted;
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'on_track': return 'En bonne voie';
    case 'ahead': return 'En avance';
    case 'at_risk': return 'À risque';
    case 'planning': return 'Planification';
    default: return status;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

const KPICard = ({ kpi }) => {
  const change = calculateChange(kpi.value, kpi.previousValue);
  const isPositive = change >= 0;
  
  const formatValue = (value, format) => {
    switch (format) {
      case 'currency': return formatCurrency(value);
      case 'hours': return `${formatNumber(value)}h`;
      default: return formatNumber(value);
    }
  };
  
  return (
    <div style={styles.card}>
      <div style={styles.cardTitle}>
        <span>{kpi.icon}</span>
        {kpi.label}
      </div>
      <div style={{ ...styles.kpiValue, color: kpi.color }}>
        {formatValue(kpi.value, kpi.format)}
      </div>
      <div
        style={{
          ...styles.kpiChange,
          backgroundColor: isPositive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          color: isPositive ? tokens.colors.success : tokens.colors.error,
        }}
      >
        {isPositive ? '↑' : '↓'} {Math.abs(change).toFixed(1)}%
        <span style={{ color: tokens.colors.text.muted, marginLeft: 4 }}>vs mois dernier</span>
      </div>
    </div>
  );
};

const SimpleLineChart = ({ data, dataKey, color, height = 200 }) => {
  const maxValue = Math.max(...data.map(d => d[dataKey]));
  const minValue = Math.min(...data.map(d => d[dataKey]));
  const range = maxValue - minValue || 1;
  
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((d[dataKey] - minValue) / range) * 80;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <svg viewBox="0 0 100 100" style={{ width: '100%', height }} preserveAspectRatio="none">
      {/* Grid lines */}
      {[20, 40, 60, 80].map(y => (
        <line key={y} x1="0" y1={y} x2="100" y2={y} stroke={tokens.colors.border} strokeWidth="0.5" />
      ))}
      
      {/* Area */}
      <polygon
        points={`0,100 ${points} 100,100`}
        fill={`${color}20`}
      />
      
      {/* Line */}
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Dots */}
      {data.map((d, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - ((d[dataKey] - minValue) / range) * 80;
        return (
          <circle key={i} cx={x} cy={y} r="2" fill={color} />
        );
      })}
    </svg>
  );
};

const BarChart = ({ data, bars, height = 250 }) => {
  const maxValue = Math.max(...data.flatMap(d => bars.map(b => d[b.key])));
  const barWidth = 100 / data.length / (bars.length + 1);
  
  return (
    <div>
      <svg viewBox="0 0 100 60" style={{ width: '100%', height }} preserveAspectRatio="none">
        {data.map((d, i) => (
          <g key={i}>
            {bars.map((bar, j) => {
              const x = (i * 100 / data.length) + (j * barWidth) + barWidth / 2;
              const barHeight = (d[bar.key] / maxValue) * 50;
              return (
                <rect
                  key={bar.key}
                  x={x}
                  y={55 - barHeight}
                  width={barWidth * 0.8}
                  height={barHeight}
                  fill={bar.color}
                  rx="1"
                />
              );
            })}
            <text
              x={(i * 100 / data.length) + (100 / data.length / 2)}
              y="59"
              fontSize="3"
              fill={tokens.colors.text.secondary}
              textAnchor="middle"
            >
              {d.month}
            </text>
          </g>
        ))}
      </svg>
      <div style={{ display: 'flex', gap: tokens.spacing.md, marginTop: tokens.spacing.sm }}>
        {bars.map(bar => (
          <div key={bar.key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: 2, backgroundColor: bar.color }} />
            <span style={{ fontSize: 12, color: tokens.colors.text.secondary }}>{bar.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProgressRing = ({ progress, size = 80, strokeWidth = 6, color }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;
  
  return (
    <svg width={size} height={size}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={tokens.colors.bg.tertiary}
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
      />
      <text
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        dy="0.35em"
        fontSize={size / 4}
        fontWeight="600"
        fill={tokens.colors.text.primary}
      >
        {progress}%
      </text>
    </svg>
  );
};

const InsightCard = ({ insight }) => (
  <div style={styles.insightCard}>
    <div style={{ ...styles.insightIcon, backgroundColor: `${insight.color}20` }}>
      {insight.icon}
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontWeight: 600, color: tokens.colors.text.primary, marginBottom: 4 }}>
        {insight.title}
      </div>
      <div style={{ fontSize: 13, color: tokens.colors.text.secondary }}>
        {insight.description}
      </div>
    </div>
    <button
      style={{
        ...styles.button,
        backgroundColor: `${insight.color}20`,
        color: insight.color,
        padding: '6px 12px',
        fontSize: 12,
      }}
    >
      {insight.action}
    </button>
  </div>
);

const ProjectRow = ({ project }) => {
  const budgetPercent = (project.spent / project.budget) * 100;
  
  return (
    <tr>
      <td style={styles.td}>
        <div style={{ fontWeight: 500 }}>{project.name}</div>
        <div style={{ fontSize: 12, color: tokens.colors.text.muted }}>Échéance: {project.dueDate}</div>
      </td>
      <td style={styles.td}>
        <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.sm }}>
          <div style={{ flex: 1 }}>
            <div style={styles.progressBar}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${project.progress}%`,
                  backgroundColor: getStatusColor(project.status),
                }}
              />
            </div>
          </div>
          <span style={{ fontSize: 13, fontWeight: 500, minWidth: 40 }}>{project.progress}%</span>
        </div>
      </td>
      <td style={styles.td}>
        <div style={{ fontWeight: 500 }}>{formatCurrency(project.spent)}</div>
        <div style={{ fontSize: 12, color: tokens.colors.text.muted }}>
          / {formatCurrency(project.budget)} ({budgetPercent.toFixed(0)}%)
        </div>
      </td>
      <td style={styles.td}>
        <span
          style={{
            ...styles.badge,
            backgroundColor: `${getStatusColor(project.status)}20`,
            color: getStatusColor(project.status),
          }}
        >
          {getStatusLabel(project.status)}
        </span>
      </td>
    </tr>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const AnalyticsDashboard = () => {
  const [period, setPeriod] = useState('month');
  const [activeTab, setActiveTab] = useState('overview');
  
  const periods = [
    { id: 'week', label: '7 jours' },
    { id: 'month', label: '30 jours' },
    { id: 'quarter', label: '90 jours' },
    { id: 'year', label: '1 an' },
  ];
  
  return (
    <div style={styles.dashboard}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>📊 Tableau de Bord Analytique</h1>
          <p style={styles.subtitle}>Vue d'ensemble de votre activité • Mis à jour il y a 5 min</p>
        </div>
        <div style={{ display: 'flex', gap: tokens.spacing.sm }}>
          <button
            style={{
              ...styles.button,
              backgroundColor: tokens.colors.bg.tertiary,
              color: tokens.colors.text.primary,
            }}
          >
            📥 Exporter
          </button>
          <button
            style={{
              ...styles.button,
              backgroundColor: tokens.colors.primary,
              color: tokens.colors.bg.primary,
            }}
          >
            🤖 Rapport Nova
          </button>
        </div>
      </div>
      
      {/* KPIs */}
      <div style={styles.grid}>
        {mockKPIs.map(kpi => (
          <KPICard key={kpi.id} kpi={kpi} />
        ))}
      </div>
      
      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: tokens.spacing.lg, marginBottom: tokens.spacing.lg }}>
        {/* Revenue Chart */}
        <div style={styles.chartContainer}>
          <div style={styles.chartHeader}>
            <h3 style={styles.chartTitle}>💰 Revenus vs Dépenses</h3>
            <div style={styles.periodSelector}>
              {periods.map(p => (
                <button
                  key={p.id}
                  onClick={() => setPeriod(p.id)}
                  style={{
                    ...styles.periodButton,
                    backgroundColor: period === p.id ? tokens.colors.primary : tokens.colors.bg.tertiary,
                    color: period === p.id ? tokens.colors.bg.primary : tokens.colors.text.secondary,
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <BarChart
            data={mockRevenueData}
            bars={[
              { key: 'revenue', label: 'Revenus', color: tokens.colors.success },
              { key: 'expenses', label: 'Dépenses', color: tokens.colors.error },
            ]}
          />
        </div>
        
        {/* Nova Insights */}
        <div style={styles.chartContainer}>
          <div style={styles.chartHeader}>
            <h3 style={styles.chartTitle}>🧠 Insights Nova</h3>
            <span style={{ fontSize: 12, color: tokens.colors.text.muted }}>3 nouveaux</span>
          </div>
          {mockInsights.map((insight, i) => (
            <InsightCard key={i} insight={insight} />
          ))}
        </div>
      </div>
      
      {/* Cashflow & Projects */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: tokens.spacing.lg }}>
        {/* Cashflow */}
        <div style={styles.chartContainer}>
          <div style={styles.chartHeader}>
            <h3 style={styles.chartTitle}>📈 Prévision Trésorerie (7 jours)</h3>
            <span style={{ 
              fontSize: 14, 
              fontWeight: 600, 
              color: tokens.colors.success 
            }}>
              {formatCurrency(73000)} prévu
            </span>
          </div>
          <SimpleLineChart
            data={mockCashflow}
            dataKey="balance"
            color={tokens.colors.accent}
            height={180}
          />
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            marginTop: tokens.spacing.md,
            paddingTop: tokens.spacing.md,
            borderTop: `1px solid ${tokens.colors.border}`
          }}>
            <div>
              <div style={{ fontSize: 12, color: tokens.colors.text.muted }}>Entrées prévues</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: tokens.colors.success }}>+{formatCurrency(80000)}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: tokens.colors.text.muted }}>Sorties prévues</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: tokens.colors.error }}>-{formatCurrency(52000)}</div>
            </div>
          </div>
        </div>
        
        {/* Project Health */}
        <div style={styles.chartContainer}>
          <div style={styles.chartHeader}>
            <h3 style={styles.chartTitle}>🏗️ Santé des Projets</h3>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: tokens.spacing.lg }}>
            <div style={{ textAlign: 'center' }}>
              <ProgressRing progress={78} color={tokens.colors.success} />
              <div style={{ fontSize: 12, color: tokens.colors.text.muted, marginTop: 8 }}>Score moyen</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <ProgressRing progress={85} color={tokens.colors.info} />
              <div style={{ fontSize: 12, color: tokens.colors.text.muted, marginTop: 8 }}>Budget</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <ProgressRing progress={72} color={tokens.colors.warning} />
              <div style={{ fontSize: 12, color: tokens.colors.text.muted, marginTop: 8 }}>Planning</div>
            </div>
          </div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: tokens.spacing.sm,
            padding: tokens.spacing.md,
            backgroundColor: tokens.colors.bg.tertiary,
            borderRadius: tokens.radius.md,
          }}>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: tokens.colors.success }}>3</div>
              <div style={{ fontSize: 12, color: tokens.colors.text.muted }}>En bonne voie</div>
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: tokens.colors.error }}>1</div>
              <div style={{ fontSize: 12, color: tokens.colors.text.muted }}>À risque</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Projects Table */}
      <div style={{ ...styles.chartContainer, marginTop: tokens.spacing.lg }}>
        <div style={styles.chartHeader}>
          <h3 style={styles.chartTitle}>📋 Projets Actifs</h3>
          <button
            style={{
              ...styles.button,
              backgroundColor: tokens.colors.bg.tertiary,
              color: tokens.colors.text.secondary,
              padding: '6px 12px',
              fontSize: 12,
            }}
          >
            Voir tous →
          </button>
        </div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Projet</th>
              <th style={styles.th}>Progression</th>
              <th style={styles.th}>Budget</th>
              <th style={styles.th}>Statut</th>
            </tr>
          </thead>
          <tbody>
            {mockProjectsData.map((project, i) => (
              <ProjectRow key={i} project={project} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;

// Export sub-components for reuse
export {
  KPICard,
  SimpleLineChart,
  BarChart,
  ProgressRing,
  InsightCard,
  ProjectRow,
};
