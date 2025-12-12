/* =====================================================
   CHE·NU — Agent Avatar Component
   ui/agents/AgentAvatar.tsx
   ===================================================== */

import React, { useState } from 'react';
import { Agent, AgentStatus } from '@/core/agents/agent.types';
import { getTheme, getAgentLevelColor } from '@/core/theme/themeEngine';

// ─────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────

interface AgentAvatarProps {
  agent: Agent;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showStatus?: boolean;
  showLevel?: boolean;
  onClick?: (agent: Agent) => void;
  interactive?: boolean;
}

// ─────────────────────────────────────────────────────
// Size Configuration
// ─────────────────────────────────────────────────────

const SIZES = {
  sm: { container: 32, icon: 16, badge: 12, fontSize: 14 },
  md: { container: 48, icon: 24, badge: 16, fontSize: 20 },
  lg: { container: 64, icon: 32, badge: 20, fontSize: 28 },
  xl: { container: 96, icon: 48, badge: 28, fontSize: 40 },
};

// ─────────────────────────────────────────────────────
// Status Colors
// ─────────────────────────────────────────────────────

const STATUS_COLORS: Record<AgentStatus, string> = {
  idle: '#6B7280',
  thinking: '#F59E0B',
  working: '#10B981',
  waiting_approval: '#8B5CF6',
  paused: '#6B7280',
  error: '#EF4444',
  offline: '#374151',
};

// ─────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────

export const AgentAvatar: React.FC<AgentAvatarProps> = ({
  agent,
  size = 'md',
  showStatus = true,
  showLevel = false,
  onClick,
  interactive = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const theme = getTheme();
  const sizeConfig = SIZES[size];
  const levelColor = getAgentLevelColor(agent.level);
  
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: sizeConfig.container,
    height: sizeConfig.container,
    cursor: interactive && onClick ? 'pointer' : 'default',
    transition: `transform ${theme.animation.durationFast} ${theme.animation.easingDefault}`,
    transform: isHovered && interactive ? 'scale(1.1)' : 'scale(1)',
  };
  
  const avatarStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: sizeConfig.fontSize,
    background: `linear-gradient(135deg, ${agent.avatar.color} 0%, ${adjustBrightness(agent.avatar.color, -20)} 100%)`,
    border: `2px solid ${isHovered ? levelColor : 'transparent'}`,
    boxShadow: isHovered 
      ? `0 0 20px ${agent.avatar.color}60`
      : `0 2px 8px ${theme.colors.shadow}`,
    transition: `all ${theme.animation.durationFast} ${theme.animation.easingDefault}`,
    position: 'relative',
    overflow: 'hidden',
  };
  
  const pulseStyle: React.CSSProperties = agent.status === 'thinking' || agent.status === 'working'
    ? {
        position: 'absolute',
        inset: -4,
        borderRadius: '50%',
        border: `2px solid ${STATUS_COLORS[agent.status]}`,
        animation: 'pulse 2s infinite',
      }
    : {};
  
  const statusDotStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: sizeConfig.badge,
    height: sizeConfig.badge,
    borderRadius: '50%',
    background: STATUS_COLORS[agent.status],
    border: `2px solid ${theme.colors.surface}`,
    boxShadow: agent.status === 'working' 
      ? `0 0 8px ${STATUS_COLORS[agent.status]}`
      : 'none',
  };
  
  const levelBadgeStyle: React.CSSProperties = {
    position: 'absolute',
    top: -4,
    right: -4,
    padding: '2px 6px',
    borderRadius: theme.radius.sm,
    background: levelColor,
    color: theme.colors.text,
    fontSize: sizeConfig.badge * 0.75,
    fontWeight: theme.typography.fontWeightBold,
    fontFamily: theme.typography.fontFamilyMono,
  };
  
  // Render avatar content based on type
  const renderAvatarContent = () => {
    switch (agent.avatar.type) {
      case 'icon':
        return <span>{agent.avatar.icon || getDefaultIcon(agent.level)}</span>;
      
      case 'image':
        return (
          <img 
            src={agent.avatar.imageUrl} 
            alt={agent.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
          />
        );
      
      case 'generated':
        return <GeneratedAvatar name={agent.name} color={agent.avatar.color} />;
      
      default:
        return <span>{getDefaultIcon(agent.level)}</span>;
    }
  };
  
  return (
    <div
      style={containerStyle}
      onClick={() => onClick?.(agent)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={`${agent.displayName} (${agent.level})`}
    >
      {/* Pulse animation for active states */}
      {(agent.status === 'thinking' || agent.status === 'working') && (
        <div style={pulseStyle} />
      )}
      
      {/* Main avatar */}
      <div style={avatarStyle}>
        {renderAvatarContent()}
      </div>
      
      {/* Status indicator */}
      {showStatus && (
        <div style={statusDotStyle} title={agent.status} />
      )}
      
      {/* Level badge */}
      {showLevel && (
        <div style={levelBadgeStyle}>{agent.level}</div>
      )}
      
      {/* CSS Keyframes */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
};

// ─────────────────────────────────────────────────────
// Generated Avatar (initials-based)
// ─────────────────────────────────────────────────────

const GeneratedAvatar: React.FC<{ name: string; color: string }> = ({ name, color }) => {
  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  
  return (
    <span style={{ 
      color: getContrastColor(color),
      fontWeight: 600,
      letterSpacing: '-0.02em',
    }}>
      {initials}
    </span>
  );
};

// ─────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────

function getDefaultIcon(level: string): string {
  const icons: Record<string, string> = {
    L0: '✨',
    L1: '👔',
    L2: '📋',
    L3: '🔍',
    L4: '⚡',
    L5: '👁️',
  };
  return icons[level] || '🤖';
}

function adjustBrightness(color: string, percent: number): string {
  if (!color.startsWith('#')) return color;
  const num = parseInt(color.slice(1), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, Math.min(255, (num >> 16) + amt));
  const G = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amt));
  const B = Math.max(0, Math.min(255, (num & 0x0000FF) + amt));
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
}

function getContrastColor(hexColor: string): string {
  if (!hexColor.startsWith('#')) return '#FFFFFF';
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#1A1A1A' : '#FFFFFF';
}

export default AgentAvatar;