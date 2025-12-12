/* =====================================================
   CHE·NU — Sphere Card
   
   PHASE 3: PURE RENDERER
   
   Renders a sphere based on resolved dimensions.
   NO LOGIC — only rendering what the resolver computed.
   ===================================================== */

import React, { memo, ReactNode } from 'react';
import { useSphere, getDetailConfig, mapDimensionToStyles } from '../adapters/react';
import { SphereConfig, ComplexityLevel, PermissionLevel } from '../../core-reference/resolver/types';

// ─────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────

export interface SphereCardProps {
  sphereId: string;
  
  // Data
  items?: unknown[];
  agents?: unknown[];
  processes?: { status?: string }[];
  decisions?: { resolved?: boolean }[];
  
  // Context
  complexity?: ComplexityLevel;
  permission?: PermissionLevel;
  depth?: number;
  triggers?: string[];
  
  // Events
  onClick?: (sphereId: string) => void;
  onEnter?: (sphereId: string) => void;
  onAgentClick?: (agentId: string) => void;
  
  // Slots
  header?: ReactNode;
  footer?: ReactNode;
  
  // Style overrides (use sparingly!)
  className?: string;
  style?: React.CSSProperties;
}

// ─────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────

export const SphereCard = memo(function SphereCard(props: SphereCardProps) {
  const {
    sphereId,
    items = [],
    agents = [],
    processes = [],
    decisions = [],
    complexity,
    permission,
    depth = 0,
    triggers = [],
    onClick,
    onEnter,
    onAgentClick,
    header,
    footer,
    className = '',
    style = {},
  } = props;
  
  // Resolve dimension via hook
  const { dimension, isLoading, sphereConfig, recordAction } = useSphere({
    sphereId,
    items,
    agents,
    processes,
    decisions,
    complexity,
    permission,
    depth,
    triggers,
  });
  
  // Loading state
  if (isLoading || !dimension || !sphereConfig) {
    return (
      <div className={`sphere-card sphere-card--loading ${className}`} style={style}>
        <div className="sphere-card__skeleton" />
      </div>
    );
  }
  
  // Not visible
  if (!dimension.visible) {
    return null;
  }
  
  // Get styles from mapper
  const mappedStyles = mapDimensionToStyles(dimension);
  const detailConfig = getDetailConfig(dimension.density.level);
  
  // Extract visual config from sphere
  const { visual } = sphereConfig;
  
  // Build sphere-specific styles
  const sphereStyles: React.CSSProperties = {
    ...mappedStyles.container,
    animation: mappedStyles.animation,
    transition: mappedStyles.transition,
    
    // Sphere-specific colors
    '--sphere-primary': visual.color.primary,
    '--sphere-secondary': visual.color.secondary,
    '--sphere-accent': visual.color.accent,
    '--sphere-gradient': `linear-gradient(135deg, ${visual.color.gradient.join(', ')})`,
    
    // Glow if enabled
    ...(visual.glow.enabled && {
      boxShadow: `0 0 ${20 * visual.glow.intensity}px ${visual.glow.color}`,
    }),
    
    ...style,
  } as React.CSSProperties;
  
  // Handlers
  const handleClick = () => {
    recordAction();
    onClick?.(sphereId);
  };
  
  const handleDoubleClick = () => {
    recordAction();
    onEnter?.(sphereId);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleClick();
    }
  };
  
  return (
    <article
      className={`sphere-card sphere-card--${sphereId} ${mappedStyles.className} ${className}`}
      style={sphereStyles}
      onClick={dimension.interactable ? handleClick : undefined}
      onDoubleClick={dimension.interactable ? handleDoubleClick : undefined}
      onKeyDown={dimension.interactable ? handleKeyDown : undefined}
      tabIndex={dimension.interactable ? 0 : -1}
      role="button"
      aria-label={`${sphereConfig.name} sphere`}
      data-sphere={sphereId}
      data-activity={dimension.activityState}
      data-content={dimension.contentLevel}
    >
      {/* Header */}
      {header || (
        <header className="sphere-card__header">
          {detailConfig.showIcon && (
            <span className="sphere-card__icon">{visual.icon}</span>
          )}
          {detailConfig.showTitle && (
            <h3 className="sphere-card__title">{sphereConfig.name}</h3>
          )}
        </header>
      )}
      
      {/* Metrics */}
      {detailConfig.showMetrics && (
        <div className="sphere-card__metrics">
          <SphereMetric label="Items" value={items.length} />
          <SphereMetric label="Agents" value={agents.length} />
          {processes.length > 0 && (
            <SphereMetric 
              label="Active" 
              value={processes.filter(p => p.status === 'active').length} 
            />
          )}
          {decisions.length > 0 && (
            <SphereMetric 
              label="Pending" 
              value={decisions.filter(d => !d.resolved).length}
              highlight
            />
          )}
        </div>
      )}
      
      {/* Agents Preview */}
      {detailConfig.showAgents && agents.length > 0 && (
        <div className="sphere-card__agents">
          {(agents as { id: string; name?: string; icon?: string }[])
            .slice(0, 5)
            .map((agent) => (
              <AgentChip
                key={agent.id}
                agent={agent}
                onClick={() => onAgentClick?.(agent.id)}
              />
            ))}
          {agents.length > 5 && (
            <span className="sphere-card__agents-more">
              +{agents.length - 5}
            </span>
          )}
        </div>
      )}
      
      {/* Activity Indicator */}
      <ActivityIndicator state={dimension.activityState} />
      
      {/* Footer */}
      {footer}
    </article>
  );
});

// ─────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────

interface SphereMetricProps {
  label: string;
  value: number;
  highlight?: boolean;
}

const SphereMetric = memo(function SphereMetric({ label, value, highlight }: SphereMetricProps) {
  return (
    <div className={`sphere-metric ${highlight ? 'sphere-metric--highlight' : ''}`}>
      <span className="sphere-metric__value">{value}</span>
      <span className="sphere-metric__label">{label}</span>
    </div>
  );
});

interface AgentChipProps {
  agent: { id: string; name?: string; icon?: string };
  onClick?: () => void;
}

const AgentChip = memo(function AgentChip({ agent, onClick }: AgentChipProps) {
  return (
    <button
      className="agent-chip"
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      title={agent.name || agent.id}
    >
      {agent.icon || '🤖'}
    </button>
  );
});

interface ActivityIndicatorProps {
  state: string;
}

const ActivityIndicator = memo(function ActivityIndicator({ state }: ActivityIndicatorProps) {
  if (state === 'dormant' || state === 'idle') {
    return null;
  }
  
  return (
    <div className={`activity-indicator activity-indicator--${state}`}>
      <span className="activity-indicator__dot" />
    </div>
  );
});

// ─────────────────────────────────────────────────────
// STYLES (CSS-in-JS for portability)
// ─────────────────────────────────────────────────────

export const sphereCardStyles = `
  .sphere-card {
    position: relative;
    display: flex;
    flex-direction: column;
    border-radius: 12px;
    background: var(--sphere-gradient, linear-gradient(135deg, #1a1a2e, #16213e));
    border: 1px solid rgba(255, 255, 255, 0.1);
    overflow: hidden;
    transform-origin: center center;
  }
  
  .sphere-card--loading {
    opacity: 0.5;
  }
  
  .sphere-card__skeleton {
    height: 200px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
    animation: shimmer 1.5s infinite;
  }
  
  .sphere-card__header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
  
  .sphere-card__icon {
    font-size: 1.5em;
  }
  
  .sphere-card__title {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--sphere-primary, #fff);
  }
  
  .sphere-card__metrics {
    display: flex;
    gap: 16px;
    padding: 12px 16px;
  }
  
  .sphere-metric {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .sphere-metric__value {
    font-size: 1.25rem;
    font-weight: 700;
    color: #fff;
  }
  
  .sphere-metric__label {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.6);
    text-transform: uppercase;
  }
  
  .sphere-metric--highlight .sphere-metric__value {
    color: var(--sphere-accent, #ffa726);
  }
  
  .sphere-card__agents {
    display: flex;
    gap: 4px;
    padding: 8px 16px;
    flex-wrap: wrap;
  }
  
  .agent-chip {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: none;
    background: rgba(255, 255, 255, 0.1);
    cursor: pointer;
    font-size: 1rem;
    transition: transform 0.2s, background 0.2s;
  }
  
  .agent-chip:hover {
    transform: scale(1.1);
    background: rgba(255, 255, 255, 0.2);
  }
  
  .sphere-card__agents-more {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.6);
  }
  
  .activity-indicator {
    position: absolute;
    top: 12px;
    right: 12px;
  }
  
  .activity-indicator__dot {
    display: block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: currentColor;
  }
  
  .activity-indicator--active {
    color: #4caf50;
  }
  
  .activity-indicator--active .activity-indicator__dot {
    animation: pulse 2s ease-in-out infinite;
  }
  
  .activity-indicator--busy {
    color: #ff9800;
  }
  
  .activity-indicator--busy .activity-indicator__dot {
    animation: pulse 1s ease-in-out infinite;
  }
  
  .activity-indicator--critical {
    color: #f44336;
  }
  
  .activity-indicator--critical .activity-indicator__dot {
    animation: pulse 0.5s ease-in-out infinite;
  }
  
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.6; transform: scale(1.2); }
  }
`;

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default SphereCard;
