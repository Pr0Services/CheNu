/* =====================================================
   CHE·NU — Agent Panel Component
   ui/agents/AgentPanel.tsx
   ===================================================== */

import React, { useState } from 'react';
import { Agent, AgentContext, AgentStatus } from '@/core/agents/agent.types';
import { AgentAvatar } from './AgentAvatar';
import { getTheme, getAgentLevelColor, getAgentLevelLabel } from '@/core/theme/themeEngine';

// ─────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────

interface AgentPanelProps {
  agent: Agent;
  context: AgentContext;
  isExpanded?: boolean;
  onAskForSummary?: (agentId: string) => void;
  onAskForSuggestion?: (agentId: string) => void;
  onToggleExpand?: (agentId: string) => void;
}

// ─────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────

export const AgentPanel: React.FC<AgentPanelProps> = ({
  agent,
  context,
  isExpanded = false,
  onAskForSummary,
  onAskForSuggestion,
  onToggleExpand,
}) => {
  const [localExpanded, setLocalExpanded] = useState(isExpanded);
  const theme = getTheme();
  const levelColor = getAgentLevelColor(agent.level);
  const expanded = isExpanded || localExpanded;
  
  const toggleExpand = () => {
    setLocalExpanded(!localExpanded);
    onToggleExpand?.(agent.id);
  };
  
  // ─────────────────────────────────────────────────
  // Styles
  // ─────────────────────────────────────────────────
  
  const containerStyle: React.CSSProperties = {
    background: theme.colors.surface,
    borderRadius: theme.radius.lg,
    border: `1px solid ${theme.colors.border}`,
    marginBottom: theme.spacing.sm,
    overflow: 'hidden',
    transition: `all ${theme.animation.durationNormal} ${theme.animation.easingDefault}`,
  };
  
  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    cursor: 'pointer',
    borderLeft: `3px solid ${levelColor}`,
    transition: `background ${theme.animation.durationFast}`,
  };
  
  const headerHoverStyle: React.CSSProperties = {
    background: theme.colors.surfaceHover,
  };
  
  const infoStyle: React.CSSProperties = {
    flex: 1,
    minWidth: 0,
  };
  
  const nameStyle: React.CSSProperties = {
    fontWeight: theme.typography.fontWeightBold,
    color: theme.colors.text,
    margin: 0,
    fontSize: theme.typography.fontSizeSm,
  };
  
  const roleStyle: React.CSSProperties = {
    fontSize: theme.typography.fontSizeXs,
    color: theme.colors.textMuted,
    margin: 0,
  };
  
  const statusBadgeStyle: React.CSSProperties = {
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.radius.full,
    fontSize: theme.typography.fontSizeXs,
    fontWeight: theme.typography.fontWeightMedium,
    background: getStatusColor(agent.status, theme),
    color: theme.colors.text,
    textTransform: 'capitalize',
  };
  
  const expandIconStyle: React.CSSProperties = {
    transition: `transform ${theme.animation.durationFast}`,
    transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
    color: theme.colors.textMuted,
  };
  
  const contentStyle: React.CSSProperties = {
    maxHeight: expanded ? '500px' : '0',
    overflow: 'hidden',
    transition: `max-height ${theme.animation.durationNormal} ${theme.animation.easingDefault}`,
  };
  
  const contentInnerStyle: React.CSSProperties = {
    padding: theme.spacing.md,
    paddingTop: 0,
    borderTop: expanded ? `1px solid ${theme.colors.border}` : 'none',
  };
  
  const sectionStyle: React.CSSProperties = {
    marginBottom: theme.spacing.md,
  };
  
  const sectionTitleStyle: React.CSSProperties = {
    fontSize: theme.typography.fontSizeXs,
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: theme.spacing.xs,
  };
  
  const capabilityStyle: React.CSSProperties = {
    display: 'inline-block',
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    margin: `0 ${theme.spacing.xs} ${theme.spacing.xs} 0`,
    borderRadius: theme.radius.sm,
    fontSize: theme.typography.fontSizeXs,
    background: `${levelColor}20`,
    color: levelColor,
    border: `1px solid ${levelColor}40`,
  };
  
  const actionButtonStyle: React.CSSProperties = {
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    borderRadius: theme.radius.md,
    border: `1px solid ${theme.colors.border}`,
    background: theme.colors.surface,
    color: theme.colors.text,
    fontSize: theme.typography.fontSizeSm,
    cursor: 'pointer',
    transition: `all ${theme.animation.durationFast}`,
    marginRight: theme.spacing.sm,
  };
  
  const [hovered, setHovered] = useState(false);
  
  return (
    <div style={containerStyle}>
      {/* Header */}
      <div 
        style={{ ...headerStyle, ...(hovered ? headerHoverStyle : {}) }}
        onClick={toggleExpand}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <AgentAvatar agent={agent} size="sm" showStatus showLevel={false} interactive={false} />
        
        <div style={infoStyle}>
          <p style={nameStyle}>{agent.displayName}</p>
          <p style={roleStyle}>{getAgentLevelLabel(agent.level)} • {formatRole(agent.role)}</p>
        </div>
        
        <div style={statusBadgeStyle}>{agent.status.replace('_', ' ')}</div>
        
        <span style={expandIconStyle}>▼</span>
      </div>
      
      {/* Expandable Content */}
      <div style={contentStyle}>
        <div style={contentInnerStyle}>
          {/* Description */}
          <div style={sectionStyle}>
            <p style={{ ...roleStyle, marginTop: theme.spacing.sm }}>
              {agent.description}
            </p>
          </div>
          
          {/* Capabilities */}
          <div style={sectionStyle}>
            <div style={sectionTitleStyle}>Capabilities</div>
            <div>
              {agent.capabilities.slice(0, 5).map(cap => (
                <span key={cap.id} style={capabilityStyle}>
                  {cap.name}
                </span>
              ))}
              {agent.capabilities.length > 5 && (
                <span style={{ ...capabilityStyle, background: 'transparent', border: 'none' }}>
                  +{agent.capabilities.length - 5} more
                </span>
              )}
            </div>
          </div>
          
          {/* Limitations */}
          {agent.limitations.length > 0 && (
            <div style={sectionStyle}>
              <div style={sectionTitleStyle}>Limitations</div>
              <ul style={{ margin: 0, paddingLeft: theme.spacing.lg, color: theme.colors.textSecondary, fontSize: theme.typography.fontSizeXs }}>
                {agent.limitations.slice(0, 3).map((lim, i) => (
                  <li key={i}>{lim}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Actions */}
          <div style={{ marginTop: theme.spacing.md }}>
            <button 
              style={actionButtonStyle}
              onClick={(e) => { e.stopPropagation(); onAskForSummary?.(agent.id); }}
            >
              📝 Ask Summary
            </button>
            <button 
              style={actionButtonStyle}
              onClick={(e) => { e.stopPropagation(); onAskForSuggestion?.(agent.id); }}
            >
              💡 Get Suggestion
            </button>
          </div>
          
          {/* Governance Info */}
          <div style={{ 
            marginTop: theme.spacing.md, 
            padding: theme.spacing.sm, 
            background: `${theme.colors.warning}10`,
            borderRadius: theme.radius.sm,
            fontSize: theme.typography.fontSizeXs,
            color: theme.colors.textMuted,
          }}>
            {agent.requiresHumanApproval 
              ? '⚠️ Requires human approval for actions'
              : '✓ Can execute within defined scope'}
            {' • '}
            Audit level: {agent.auditLevel}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────

function getStatusColor(status: AgentStatus, theme: ReturnType<typeof getTheme>): string {
  const colors: Record<AgentStatus, string> = {
    idle: theme.colors.border,
    thinking: `${theme.colors.warning}30`,
    working: `${theme.colors.success}30`,
    waiting_approval: `${theme.colors.info}30`,
    paused: theme.colors.border,
    error: `${theme.colors.error}30`,
    offline: theme.colors.border,
  };
  return colors[status];
}

function formatRole(role: string): string {
  return role
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default AgentPanel;