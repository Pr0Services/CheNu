/* =====================================================
   CHE·NU — Agent Node
   
   PHASE 3: AGENT RENDERER
   
   Renders an individual agent with adaptive dimensions.
   Agents inherit context from their parent sphere.
   ===================================================== */

import React, { memo } from 'react';
import { useDimension, mapDimensionToStyles, getDetailConfig } from '../adapters/react';
import { ComplexityLevel, PermissionLevel } from '../../core-reference/resolver/types';

// ─────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────

export interface AgentConfig {
  id: string;
  name: string;
  role: string;
  icon: string;
  level: 'L0' | 'L1' | 'L2' | 'L3';
  capabilities: string[];
  status: 'active' | 'idle' | 'busy' | 'offline';
}

export interface AgentNodeProps {
  agent: AgentConfig;
  
  // Context from parent sphere
  sphereId?: string;
  complexity?: ComplexityLevel;
  permission?: PermissionLevel;
  depth?: number;
  
  // Agent-specific
  pendingTasks?: number;
  lastActivity?: number; // timestamp
  
  // Events
  onClick?: (agentId: string) => void;
  onActivate?: (agentId: string) => void;
  onDeactivate?: (agentId: string) => void;
  
  // Display
  variant?: 'compact' | 'full' | 'mini';
  showStatus?: boolean;
  showCapabilities?: boolean;
}

// ─────────────────────────────────────────────────────
// LEVEL COLORS (from config would be better)
// ─────────────────────────────────────────────────────

const LEVEL_COLORS: Record<string, string> = {
  L0: '#FFD700', // Gold - Supreme
  L1: '#4CAF50', // Green - Executive
  L2: '#2196F3', // Blue - Manager
  L3: '#9E9E9E', // Gray - Specialist
};

const LEVEL_LABELS: Record<string, string> = {
  L0: 'Supreme',
  L1: 'Executive',
  L2: 'Manager',
  L3: 'Specialist',
};

// ─────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────

export const AgentNode = memo(function AgentNode(props: AgentNodeProps) {
  const {
    agent,
    sphereId,
    complexity = 'standard',
    permission = 'read',
    depth = 1,
    pendingTasks = 0,
    lastActivity,
    onClick,
    onActivate,
    onDeactivate,
    variant = 'compact',
    showStatus = true,
    showCapabilities = false,
  } = props;
  
  // Calculate activity metrics
  const lastInteractionMs = lastActivity 
    ? Date.now() - lastActivity 
    : 300000; // 5 min default
  
  // Determine triggers
  const triggers: string[] = [];
  if (agent.status === 'busy') triggers.push('pendingApproval');
  if (pendingTasks > 5) triggers.push('deadline');
  
  // Resolve dimension
  const { dimension, recordAction } = useDimension({
    sphereId,
    content: {
      items: pendingTasks,
      agents: 1,
      processes: agent.status === 'active' || agent.status === 'busy' ? 1 : 0,
      decisions: pendingTasks,
    },
    complexity,
    permission,
    depth,
    triggers,
  });
  
  if (!dimension || !dimension.visible) {
    return null;
  }
  
  const mappedStyles = mapDimensionToStyles(dimension);
  const detailConfig = getDetailConfig(dimension.density.level);
  const levelColor = LEVEL_COLORS[agent.level] || '#9E9E9E';
  
  // Variant-specific sizing
  const sizes = {
    mini: { width: 40, iconSize: 20 },
    compact: { width: 120, iconSize: 32 },
    full: { width: 200, iconSize: 48 },
  };
  const size = sizes[variant];
  
  // Agent-specific styles
  const agentStyles: React.CSSProperties = {
    ...mappedStyles.container,
    animation: mappedStyles.animation,
    transition: mappedStyles.transition,
    width: size.width * dimension.scale,
    borderRadius: variant === 'mini' ? '50%' : '12px',
    background: `linear-gradient(135deg, ${levelColor}22 0%, ${levelColor}11 100%)`,
    border: `1px solid ${levelColor}44`,
    '--agent-color': levelColor,
  } as React.CSSProperties;
  
  const handleClick = () => {
    recordAction();
    onClick?.(agent.id);
  };
  
  const handleActivate = (e: React.MouseEvent) => {
    e.stopPropagation();
    recordAction();
    onActivate?.(agent.id);
  };
  
  const handleDeactivate = (e: React.MouseEvent) => {
    e.stopPropagation();
    recordAction();
    onDeactivate?.(agent.id);
  };
  
  // Mini variant
  if (variant === 'mini') {
    return (
      <button
        className={`agent-node agent-node--mini ${mappedStyles.className}`}
        style={agentStyles}
        onClick={dimension.interactable ? handleClick : undefined}
        title={`${agent.name} (${agent.role})`}
        disabled={!dimension.interactable}
      >
        <span style={{ fontSize: size.iconSize / 1.5 }}>{agent.icon}</span>
        {showStatus && (
          <StatusDot status={agent.status} />
        )}
      </button>
    );
  }
  
  return (
    <article
      className={`agent-node agent-node--${variant} ${mappedStyles.className}`}
      style={agentStyles}
      onClick={dimension.interactable ? handleClick : undefined}
      tabIndex={dimension.interactable ? 0 : -1}
      data-agent={agent.id}
      data-level={agent.level}
      data-status={agent.status}
    >
      {/* Header */}
      <header className="agent-node__header">
        <span 
          className="agent-node__icon"
          style={{ fontSize: size.iconSize }}
        >
          {agent.icon}
        </span>
        
        {showStatus && (
          <StatusDot status={agent.status} />
        )}
        
        <span 
          className="agent-node__level"
          style={{ 
            background: levelColor,
            color: '#000',
          }}
        >
          {agent.level}
        </span>
      </header>
      
      {/* Info */}
      {detailConfig.showTitle && (
        <div className="agent-node__info">
          <h4 className="agent-node__name">{agent.name}</h4>
          {detailConfig.showDescription && (
            <p className="agent-node__role">{agent.role}</p>
          )}
        </div>
      )}
      
      {/* Capabilities */}
      {showCapabilities && detailConfig.showMetrics && (
        <div className="agent-node__capabilities">
          {agent.capabilities.slice(0, 3).map(cap => (
            <span key={cap} className="agent-node__capability">
              {cap}
            </span>
          ))}
          {agent.capabilities.length > 3 && (
            <span className="agent-node__capability-more">
              +{agent.capabilities.length - 3}
            </span>
          )}
        </div>
      )}
      
      {/* Pending Tasks */}
      {pendingTasks > 0 && detailConfig.showMetrics && (
        <div className="agent-node__pending">
          <span className="agent-node__pending-count">{pendingTasks}</span>
          <span className="agent-node__pending-label">pending</span>
        </div>
      )}
      
      {/* Actions */}
      {detailConfig.showActions && dimension.interactable && (
        <div className="agent-node__actions">
          {agent.status === 'offline' || agent.status === 'idle' ? (
            <button 
              className="agent-node__action agent-node__action--activate"
              onClick={handleActivate}
            >
              Activate
            </button>
          ) : (
            <button 
              className="agent-node__action agent-node__action--deactivate"
              onClick={handleDeactivate}
            >
              Pause
            </button>
          )}
        </div>
      )}
    </article>
  );
});

// ─────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────

interface StatusDotProps {
  status: AgentConfig['status'];
}

const StatusDot = memo(function StatusDot({ status }: StatusDotProps) {
  const colors: Record<string, string> = {
    active: '#4caf50',
    idle: '#ff9800',
    busy: '#2196f3',
    offline: '#9e9e9e',
  };
  
  return (
    <span 
      className={`agent-status-dot agent-status-dot--${status}`}
      style={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: colors[status] || colors.offline,
        boxShadow: status === 'active' || status === 'busy' 
          ? `0 0 6px ${colors[status]}` 
          : 'none',
      }}
      title={status}
    />
  );
});

// ─────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────

export const agentNodeStyles = `
  .agent-node {
    display: flex;
    flex-direction: column;
    color: #fff;
    overflow: hidden;
  }
  
  .agent-node--mini {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    cursor: pointer;
    padding: 0;
  }
  
  .agent-node--mini .agent-status-dot {
    position: absolute;
    bottom: 2px;
    right: 2px;
  }
  
  .agent-node__header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px;
  }
  
  .agent-node__icon {
    flex-shrink: 0;
  }
  
  .agent-node__level {
    margin-left: auto;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.625rem;
    font-weight: 700;
  }
  
  .agent-node__info {
    padding: 0 12px 12px;
  }
  
  .agent-node__name {
    margin: 0;
    font-size: 0.9rem;
    font-weight: 600;
  }
  
  .agent-node__role {
    margin: 4px 0 0;
    font-size: 0.75rem;
    opacity: 0.7;
  }
  
  .agent-node__capabilities {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    padding: 0 12px 12px;
  }
  
  .agent-node__capability {
    padding: 2px 8px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    font-size: 0.625rem;
    text-transform: uppercase;
  }
  
  .agent-node__pending {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 8px 12px;
    background: rgba(255, 152, 0, 0.2);
    border-top: 1px solid rgba(255, 152, 0, 0.3);
  }
  
  .agent-node__pending-count {
    font-size: 1.25rem;
    font-weight: 700;
    color: #ff9800;
  }
  
  .agent-node__pending-label {
    font-size: 0.75rem;
    opacity: 0.7;
  }
  
  .agent-node__actions {
    display: flex;
    gap: 8px;
    padding: 12px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .agent-node__action {
    flex: 1;
    padding: 8px;
    border: none;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
  }
  
  .agent-node__action--activate {
    background: #4caf50;
    color: #fff;
  }
  
  .agent-node__action--activate:hover {
    background: #66bb6a;
  }
  
  .agent-node__action--deactivate {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
  }
  
  .agent-node__action--deactivate:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  
  .agent-status-dot--active,
  .agent-status-dot--busy {
    animation: pulse-dot 2s ease-in-out infinite;
  }
  
  @keyframes pulse-dot {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default AgentNode;
