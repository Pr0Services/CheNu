// =============================================================================
// CHE·NU — SpherePageTemplate Component
// Foundation Freeze V1
// =============================================================================
// Template pour les pages de sphère
// Chaque sphère DOIT respecter cette structure interne:
// - Sphere Home
// - Categories
// - Data Views
// - Tools
// - History / Memory
// - Agents Activity
// =============================================================================

import React, { useMemo, useState } from 'react';
import { SphereConfig, SphereRuntimeState, AgentVisualData, SphereId } from '../../types';
import { UNIVERSE_COLORS, getAgentsBySphere } from '../../config';

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

export interface SpherePageTemplateProps {
  /** Configuration de la sphère */
  config: SphereConfig;
  /** État runtime de la sphère */
  runtime: SphereRuntimeState;
  /** Agents de cette sphère */
  agents: AgentVisualData[];
  /** Onglet actif */
  activeTab?: SphereTab;
  /** Handler de changement d'onglet */
  onTabChange?: (tab: SphereTab) => void;
  /** Handler de navigation vers catégorie */
  onCategoryClick?: (categoryId: string) => void;
  /** Handler de clic sur agent */
  onAgentClick?: (agentId: string) => void;
  /** Contenu personnalisé */
  children?: React.ReactNode;
  /** Classes CSS additionnelles */
  className?: string;
}

export type SphereTab = 'home' | 'categories' | 'data' | 'tools' | 'history' | 'agents';

// -----------------------------------------------------------------------------
// STYLES
// -----------------------------------------------------------------------------

const templateStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    minHeight: '100%',
    backgroundColor: UNIVERSE_COLORS.background.dark,
  },
  header: {
    padding: '24px 32px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.8) 0%, transparent 100%)',
  },
  headerTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  sphereIcon: {
    width: '56px',
    height: '56px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
  },
  titleText: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 700,
    color: UNIVERSE_COLORS.text.primary,
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: '14px',
    color: UNIVERSE_COLORS.text.secondary,
  },
  stats: {
    display: 'flex',
    gap: '24px',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    padding: '8px 16px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
  },
  statValue: {
    fontSize: '20px',
    fontWeight: 700,
    color: UNIVERSE_COLORS.text.primary,
  },
  statLabel: {
    fontSize: '11px',
    color: UNIVERSE_COLORS.text.muted,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  tabs: {
    display: 'flex',
    gap: '4px',
    padding: '0 32px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  tab: {
    padding: '12px 20px',
    fontSize: '14px',
    fontWeight: 500,
    color: UNIVERSE_COLORS.text.secondary,
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '2px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.15s ease-out',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  tabActive: {
    color: UNIVERSE_COLORS.text.primary,
    borderBottomColor: '#A855F7',
  },
  content: {
    flex: 1,
    padding: '24px 32px',
    overflowY: 'auto' as const,
  },
  categoryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px',
  },
  categoryCard: {
    padding: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    cursor: 'pointer',
    transition: 'all 0.2s ease-out',
  },
  agentList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  agentCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    cursor: 'pointer',
    transition: 'all 0.2s ease-out',
  },
  agentIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
  },
  agentInfo: {
    flex: 1,
  },
  agentName: {
    fontSize: '14px',
    fontWeight: 600,
    color: UNIVERSE_COLORS.text.primary,
  },
  agentRole: {
    fontSize: '12px',
    color: UNIVERSE_COLORS.text.secondary,
  },
  agentStatus: {
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
  }
};

// -----------------------------------------------------------------------------
// TAB CONFIGURATION
// -----------------------------------------------------------------------------

const TABS: { id: SphereTab; label: string; emoji: string }[] = [
  { id: 'home', label: 'Home', emoji: '🏠' },
  { id: 'categories', label: 'Categories', emoji: '📂' },
  { id: 'data', label: 'Data', emoji: '📊' },
  { id: 'tools', label: 'Tools', emoji: '🛠️' },
  { id: 'history', label: 'History', emoji: '📜' },
  { id: 'agents', label: 'Agents', emoji: '🤖' },
];

// -----------------------------------------------------------------------------
// SUB-COMPONENTS
// -----------------------------------------------------------------------------

interface CategoryCardProps {
  category: SphereConfig['categories'][0];
  color: string;
  onClick: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, color, onClick }) => (
  <div
    style={{
      ...templateStyles.categoryCard,
      borderColor: `${color}30`,
    }}
    onClick={onClick}
    role="button"
    tabIndex={0}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
      <span style={{ fontSize: '24px', filter: `drop-shadow(0 0 4px ${color})` }}>
        {category.emoji}
      </span>
      <span style={{ fontSize: '16px', fontWeight: 600, color: UNIVERSE_COLORS.text.primary }}>
        {category.label}
      </span>
    </div>
    {category.description && (
      <p style={{ fontSize: '13px', color: UNIVERSE_COLORS.text.secondary, marginBottom: '12px' }}>
        {category.description}
      </p>
    )}
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
      {category.dataTypes.slice(0, 4).map(type => (
        <span
          key={type}
          style={{
            padding: '2px 8px',
            fontSize: '11px',
            backgroundColor: `${color}20`,
            borderRadius: '4px',
            color: color,
          }}
        >
          {type}
        </span>
      ))}
    </div>
  </div>
);

interface AgentCardProps {
  agent: AgentVisualData;
  onClick: () => void;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent, onClick }) => {
  const statusColors: Record<string, { bg: string; text: string }> = {
    idle: { bg: 'rgba(107, 114, 128, 0.2)', text: '#6B7280' },
    active: { bg: 'rgba(34, 197, 94, 0.2)', text: '#22C55E' },
    analyzing: { bg: 'rgba(234, 179, 8, 0.2)', text: '#EAB308' },
    warning: { bg: 'rgba(249, 115, 22, 0.2)', text: '#F97316' },
  };
  
  const status = statusColors[agent.runtime.state] || statusColors.idle;

  return (
    <div
      style={templateStyles.agentCard}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <div
        style={{
          ...templateStyles.agentIcon,
          backgroundColor: `${agent.agent.color}20`,
          border: `1px solid ${agent.agent.color}40`,
        }}
      >
        {agent.agent.emoji}
      </div>
      <div style={templateStyles.agentInfo}>
        <div style={templateStyles.agentName}>{agent.agent.label}</div>
        <div style={templateStyles.agentRole}>{agent.agent.role}</div>
      </div>
      <span
        style={{
          ...templateStyles.agentStatus,
          backgroundColor: status.bg,
          color: status.text,
        }}
      >
        {agent.runtime.state}
      </span>
    </div>
  );
};

// -----------------------------------------------------------------------------
// MAIN COMPONENT
// -----------------------------------------------------------------------------

export const SpherePageTemplate: React.FC<SpherePageTemplateProps> = ({
  config,
  runtime,
  agents,
  activeTab = 'home',
  onTabChange,
  onCategoryClick,
  onAgentClick,
  children,
  className = ''
}) => {
  const [currentTab, setCurrentTab] = useState<SphereTab>(activeTab);

  const handleTabChange = (tab: SphereTab) => {
    setCurrentTab(tab);
    onTabChange?.(tab);
  };

  // Stats for header
  const stats = useMemo(() => ({
    categories: config.categories.length,
    agents: agents.length,
    activeAgents: agents.filter(a => a.runtime.state === 'active').length,
    activity: Math.round(runtime.activity * 100),
  }), [config, agents, runtime]);

  // Render tab content
  const renderContent = () => {
    switch (currentTab) {
      case 'home':
        return children || (
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>
              Welcome to {config.label}
            </h2>
            <p style={{ color: UNIVERSE_COLORS.text.secondary, marginBottom: '24px' }}>
              {config.description}
            </p>
            {/* Quick access to categories */}
            <div style={templateStyles.categoryGrid}>
              {config.categories.slice(0, 4).map(cat => (
                <CategoryCard
                  key={cat.id}
                  category={cat}
                  color={config.color}
                  onClick={() => onCategoryClick?.(cat.id)}
                />
              ))}
            </div>
          </div>
        );

      case 'categories':
        return (
          <div style={templateStyles.categoryGrid}>
            {config.categories.map(cat => (
              <CategoryCard
                key={cat.id}
                category={cat}
                color={config.color}
                onClick={() => onCategoryClick?.(cat.id)}
              />
            ))}
          </div>
        );

      case 'agents':
        return (
          <div style={templateStyles.agentList}>
            {agents.map(agent => (
              <AgentCard
                key={agent.agent.id}
                agent={agent}
                onClick={() => onAgentClick?.(agent.agent.id)}
              />
            ))}
          </div>
        );

      default:
        return (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: UNIVERSE_COLORS.text.muted }}>
            <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>🚧</span>
            <p>This section is under construction</p>
          </div>
        );
    }
  };

  return (
    <div className={`chenu-sphere-template ${className}`} style={templateStyles.container}>
      {/* Header */}
      <header style={templateStyles.header}>
        <div style={templateStyles.headerTop}>
          <div style={templateStyles.headerTitle}>
            <div
              style={{
                ...templateStyles.sphereIcon,
                background: `linear-gradient(135deg, ${config.colorSecondary}, ${config.color})`,
                boxShadow: `0 4px 20px ${config.color}40`,
              }}
            >
              {config.emoji}
            </div>
            <div style={templateStyles.titleText}>
              <h1 style={templateStyles.title}>{config.label}</h1>
              <span style={templateStyles.subtitle}>{config.labelFr}</span>
            </div>
          </div>
          
          <div style={templateStyles.stats}>
            <div style={templateStyles.statItem}>
              <span style={templateStyles.statValue}>{stats.categories}</span>
              <span style={templateStyles.statLabel}>Categories</span>
            </div>
            <div style={templateStyles.statItem}>
              <span style={templateStyles.statValue}>{stats.activeAgents}/{stats.agents}</span>
              <span style={templateStyles.statLabel}>Active Agents</span>
            </div>
            <div style={templateStyles.statItem}>
              <span style={{ ...templateStyles.statValue, color: config.color }}>{stats.activity}%</span>
              <span style={templateStyles.statLabel}>Activity</span>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <nav style={templateStyles.tabs}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            style={{
              ...templateStyles.tab,
              ...(currentTab === tab.id ? {
                ...templateStyles.tabActive,
                borderBottomColor: config.color,
              } : {}),
            }}
            onClick={() => handleTabChange(tab.id)}
          >
            <span>{tab.emoji}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Content */}
      <div style={templateStyles.content}>
        {renderContent()}
      </div>

      {/* Hover styles */}
      <style>{`
        .chenu-sphere-template button:hover {
          color: ${UNIVERSE_COLORS.text.primary} !important;
          background-color: rgba(255, 255, 255, 0.05);
        }
        .chenu-sphere-template [role="button"]:hover {
          background-color: rgba(255, 255, 255, 0.08) !important;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
};

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

export default SpherePageTemplate;
