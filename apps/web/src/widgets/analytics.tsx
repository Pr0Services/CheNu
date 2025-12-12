// ═══════════════════════════════════════════════════════════════════════════════
// ROADY V20 - Analytics Dashboard
// Business Metrics, Charts, Real-time KPIs
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useMemo } from 'react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface MetricCard {
  id: string;
  title: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon: string;
  color: string;
}

interface ChartData {
  name: string;
  [key: string]: string | number;
}

interface AnalyticsProps {
  T: any; // Theme
  dateRange: 'day' | 'week' | 'month' | 'quarter' | 'year';
}

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────

const generateRevenueData = (): ChartData[] => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map((month, i) => ({
    name: month,
    revenue: Math.floor(80000 + Math.random() * 50000 + i * 5000),
    target: 100000 + i * 8000,
    costs: Math.floor(40000 + Math.random() * 20000),
  }));
};

const generateProjectData = (): ChartData[] => [
  { name: 'Residential', value: 35, color: '#4ade80' },
  { name: 'Commercial', value: 28, color: '#22d3ee' },
  { name: 'Industrial', value: 20, color: '#f59e0b' },
  { name: 'Infrastructure', value: 17, color: '#8b5cf6' },
];

const generateTeamData = (): ChartData[] => {
  const weeks = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'];
  return weeks.map(week => ({
    name: week,
    productivity: Math.floor(70 + Math.random() * 25),
    tasks: Math.floor(40 + Math.random() * 30),
    hours: Math.floor(35 + Math.random() * 10),
  }));
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

// Metric Card Component
const MetricCardComponent: React.FC<{ metric: MetricCard; T: any }> = ({ metric, T }) => (
  <div style={{
    background: T.bg.card,
    borderRadius: 12,
    padding: 20,
    border: `1px solid ${T.border}`,
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
      <span style={{ fontSize: 28 }}>{metric.icon}</span>
      <span style={{
        padding: '4px 8px',
        borderRadius: 12,
        fontSize: 11,
        fontWeight: 600,
        background: metric.change >= 0 ? '#22c55e20' : '#ef444420',
        color: metric.change >= 0 ? '#22c55e' : '#ef4444',
      }}>
        {metric.change >= 0 ? '↑' : '↓'} {Math.abs(metric.change)}%
      </span>
    </div>
    <div style={{ fontSize: 28, fontWeight: 700, color: T.text.primary, marginBottom: 4 }}>
      {metric.value}
    </div>
    <div style={{ fontSize: 13, color: T.text.muted }}>{metric.title}</div>
    <div style={{ fontSize: 11, color: T.text.muted, marginTop: 4 }}>{metric.changeLabel}</div>
  </div>
);

// Date Range Selector
const DateRangeSelector: React.FC<{
  value: string;
  onChange: (value: string) => void;
  T: any;
}> = ({ value, onChange, T }) => (
  <div style={{ display: 'flex', gap: 8 }}>
    {['day', 'week', 'month', 'quarter', 'year'].map(range => (
      <button
        key={range}
        onClick={() => onChange(range)}
        style={{
          padding: '8px 16px',
          borderRadius: 8,
          border: 'none',
          background: value === range ? T.accent.primary : T.bg.hover,
          color: value === range ? '#000' : T.text.primary,
          cursor: 'pointer',
          fontSize: 13,
          fontWeight: value === range ? 600 : 400,
          textTransform: 'capitalize',
        }}
      >
        {range}
      </button>
    ))}
  </div>
);

// Revenue Chart
const RevenueChart: React.FC<{ data: ChartData[]; T: any }> = ({ data, T }) => (
  <div style={{ background: T.bg.card, borderRadius: 12, padding: 20, border: `1px solid ${T.border}` }}>
    <h3 style={{ fontSize: 16, fontWeight: 600, color: T.text.primary, marginBottom: 20 }}>
      📈 Revenue Overview
    </h3>
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
        <XAxis dataKey="name" stroke={T.text.muted} fontSize={12} />
        <YAxis stroke={T.text.muted} fontSize={12} tickFormatter={(v) => `$${v/1000}k`} />
        <Tooltip
          contentStyle={{ background: T.bg.card, border: `1px solid ${T.border}`, borderRadius: 8 }}
          labelStyle={{ color: T.text.primary }}
        />
        <Legend />
        <Area type="monotone" dataKey="revenue" stroke="#4ade80" fill="url(#colorRevenue)" name="Revenue" />
        <Line type="monotone" dataKey="target" stroke="#22d3ee" strokeDasharray="5 5" name="Target" />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

// Project Distribution Pie Chart
const ProjectDistribution: React.FC<{ data: ChartData[]; T: any }> = ({ data, T }) => (
  <div style={{ background: T.bg.card, borderRadius: 12, padding: 20, border: `1px solid ${T.border}` }}>
    <h3 style={{ fontSize: 16, fontWeight: 600, color: T.text.primary, marginBottom: 20 }}>
      📊 Project Distribution
    </h3>
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color as string} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ background: T.bg.card, border: `1px solid ${T.border}`, borderRadius: 8 }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

// Team Performance Bar Chart
const TeamPerformance: React.FC<{ data: ChartData[]; T: any }> = ({ data, T }) => (
  <div style={{ background: T.bg.card, borderRadius: 12, padding: 20, border: `1px solid ${T.border}` }}>
    <h3 style={{ fontSize: 16, fontWeight: 600, color: T.text.primary, marginBottom: 20 }}>
      👥 Team Performance
    </h3>
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
        <XAxis dataKey="name" stroke={T.text.muted} fontSize={12} />
        <YAxis stroke={T.text.muted} fontSize={12} />
        <Tooltip
          contentStyle={{ background: T.bg.card, border: `1px solid ${T.border}`, borderRadius: 8 }}
        />
        <Legend />
        <Bar dataKey="productivity" fill="#4ade80" name="Productivity %" radius={[4, 4, 0, 0]} />
        <Bar dataKey="tasks" fill="#22d3ee" name="Tasks Completed" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

// Real-time Activity Feed
const ActivityFeed: React.FC<{ T: any }> = ({ T }) => {
  const activities = [
    { id: 1, user: 'Marie D.', action: 'completed task', target: 'Foundation inspection', time: '2m ago', icon: '✅' },
    { id: 2, user: 'Pierre B.', action: 'uploaded', target: '15 site photos', time: '5m ago', icon: '📷' },
    { id: 3, user: 'Sophie M.', action: 'created project', target: 'Riverside Phase 2', time: '12m ago', icon: '📁' },
    { id: 4, user: 'Jean L.', action: 'submitted', target: 'Weekly report', time: '18m ago', icon: '📊' },
    { id: 5, user: 'Nova AI', action: 'generated', target: 'Cost analysis', time: '25m ago', icon: '🤖' },
  ];

  return (
    <div style={{ background: T.bg.card, borderRadius: 12, padding: 20, border: `1px solid ${T.border}` }}>
      <h3 style={{ fontSize: 16, fontWeight: 600, color: T.text.primary, marginBottom: 16 }}>
        ⚡ Real-time Activity
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {activities.map(activity => (
          <div key={activity.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 20 }}>{activity.icon}</span>
            <div style={{ flex: 1 }}>
              <span style={{ color: T.text.primary, fontWeight: 500 }}>{activity.user}</span>
              <span style={{ color: T.text.muted }}> {activity.action} </span>
              <span style={{ color: T.accent.primary }}>{activity.target}</span>
            </div>
            <span style={{ fontSize: 11, color: T.text.muted }}>{activity.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// KPI Grid
const KPIGrid: React.FC<{ T: any }> = ({ T }) => {
  const kpis = [
    { label: 'On-Time Delivery', value: 94, target: 95, unit: '%' },
    { label: 'Budget Adherence', value: 88, target: 90, unit: '%' },
    { label: 'Safety Score', value: 98, target: 100, unit: '%' },
    { label: 'Client Satisfaction', value: 4.7, target: 5, unit: '/5' },
  ];

  return (
    <div style={{ background: T.bg.card, borderRadius: 12, padding: 20, border: `1px solid ${T.border}` }}>
      <h3 style={{ fontSize: 16, fontWeight: 600, color: T.text.primary, marginBottom: 16 }}>
        🎯 Key Performance Indicators
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        {kpis.map(kpi => {
          const percentage = (kpi.value / kpi.target) * 100;
          const isGood = percentage >= 90;
          
          return (
            <div key={kpi.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: T.text.secondary }}>{kpi.label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: isGood ? '#22c55e' : '#f59e0b' }}>
                  {kpi.value}{kpi.unit}
                </span>
              </div>
              <div style={{ height: 6, background: T.bg.hover, borderRadius: 3 }}>
                <div style={{
                  height: '100%',
                  width: `${Math.min(percentage, 100)}%`,
                  background: isGood ? '#22c55e' : '#f59e0b',
                  borderRadius: 3,
                  transition: 'width 0.5s ease'
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN ANALYTICS DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────

export const AnalyticsDashboard: React.FC<AnalyticsProps> = ({ T, dateRange: initialRange }) => {
  const [dateRange, setDateRange] = useState(initialRange || 'month');
  const [loading, setLoading] = useState(true);

  // Simulated data loading
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [dateRange]);

  const metrics: MetricCard[] = useMemo(() => [
    { id: 'revenue', title: 'Total Revenue', value: '$1.24M', change: 12.5, changeLabel: 'vs last month', icon: '💰', color: '#4ade80' },
    { id: 'projects', title: 'Active Projects', value: 47, change: 8.3, changeLabel: '+3 this week', icon: '📁', color: '#22d3ee' },
    { id: 'tasks', title: 'Tasks Completed', value: 892, change: 15.2, changeLabel: 'this month', icon: '✅', color: '#f59e0b' },
    { id: 'team', title: 'Team Utilization', value: '87%', change: -2.1, changeLabel: 'vs target', icon: '👥', color: '#8b5cf6' },
  ], []);

  const revenueData = useMemo(() => generateRevenueData(), [dateRange]);
  const projectData = useMemo(() => generateProjectData(), []);
  const teamData = useMemo(() => generateTeamData(), [dateRange]);

  if (loading) {
    return (
      <div style={{ padding: 24, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 16 }}>📊</div>
          <div style={{ color: T.text.muted }}>Loading analytics...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: T.text.primary, marginBottom: 4 }}>
            📊 Analytics Dashboard
          </h1>
          <p style={{ fontSize: 14, color: T.text.muted }}>
            Real-time insights and business metrics
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <DateRangeSelector value={dateRange} onChange={setDateRange} T={T} />
          <button style={{
            padding: '10px 16px',
            background: T.bg.hover,
            border: `1px solid ${T.border}`,
            borderRadius: 8,
            color: T.text.primary,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            📥 Export
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {metrics.map(metric => (
          <MetricCardComponent key={metric.id} metric={metric} T={T} />
        ))}
      </div>

      {/* Charts Row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 16 }}>
        <RevenueChart data={revenueData} T={T} />
        <ProjectDistribution data={projectData} T={T} />
      </div>

      {/* Charts Row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        <TeamPerformance data={teamData} T={T} />
        <KPIGrid T={T} />
        <ActivityFeed T={T} />
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// GRAFANA DASHBOARD CONFIG
// ─────────────────────────────────────────────────────────────────────────────

export const grafanaDashboardConfig = {
  dashboard: {
    title: "ROADY V20 Metrics",
    tags: ["roady", "production"],
    timezone: "browser",
    panels: [
      {
        title: "API Request Rate",
        type: "graph",
        gridPos: { x: 0, y: 0, w: 12, h: 8 },
        targets: [
          { expr: 'rate(http_requests_total{app="roady"}[5m])', legendFormat: "{{method}} {{path}}" }
        ]
      },
      {
        title: "Response Time P95",
        type: "graph",
        gridPos: { x: 12, y: 0, w: 12, h: 8 },
        targets: [
          { expr: 'histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))', legendFormat: "P95 Latency" }
        ]
      },
      {
        title: "Error Rate",
        type: "stat",
        gridPos: { x: 0, y: 8, w: 6, h: 4 },
        targets: [
          { expr: 'sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) * 100' }
        ]
      },
      {
        title: "Active Users",
        type: "stat",
        gridPos: { x: 6, y: 8, w: 6, h: 4 },
        targets: [
          { expr: 'sum(roady_active_users)' }
        ]
      },
      {
        title: "Database Connections",
        type: "gauge",
        gridPos: { x: 12, y: 8, w: 6, h: 4 },
        targets: [
          { expr: 'pg_stat_activity_count{datname="roady"}' }
        ]
      },
      {
        title: "Redis Memory",
        type: "gauge",
        gridPos: { x: 18, y: 8, w: 6, h: 4 },
        targets: [
          { expr: 'redis_memory_used_bytes / redis_memory_max_bytes * 100' }
        ]
      }
    ]
  }
};

export default AnalyticsDashboard;
