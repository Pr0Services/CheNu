/* =====================================================
   CHE·NU — Agent Orbit Component
   ui/agents/AgentOrbit.tsx
   ===================================================== */

import React from 'react';
import { Agent } from '@/core/agents/agent.types';
import { AgentAvatar } from './AgentAvatar';
import { computeAgentPosition, getOrbitPathStyle } from './agentOrbit.utils';
import { getTheme, getAgentLevelColor } from '@/core/theme/themeEngine';

interface AgentOrbitProps {
  agents: Agent[];
  onAgentClick?: (agent: Agent) => void;
  showOrbits?: boolean;
}

export const AgentOrbit: React.FC<AgentOrbitProps> = ({ 
  agents, 
  onAgentClick,
  showOrbits = true,
}) => {
  const theme = getTheme();
  
  // Orbit radii for visual guides
  const orbitRadii = [80, 140, 200, 260, 320];

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: 0,
        height: 0,
        transformStyle: 'preserve-3d',
        perspective: '1200px',
      }}
    >
      {/* Orbit Paths */}
      {showOrbits && orbitRadii.map((radius) => (
        <div
          key={radius}
          style={getOrbitPathStyle(radius, theme.colors.border)}
        />
      ))}

      {/* Agents */}
      {agents.map((agent, index) => {
        const pos = computeAgentPosition(agent, index, agents.length);
        
        return (
          <div
            key={agent.id}
            style={{
              position: 'absolute',
              transform: `translate(${pos.x}px, ${pos.y}px) scale(${pos.scale || 1})`,
              zIndex: pos.z || 0,
              transition: `transform 0.3s ${theme.animation.easingDefault}`,
            }}
          >
            <AgentAvatar 
              agent={agent} 
              size={agent.level === 'L0' ? 'lg' : agent.level === 'L1' ? 'md' : 'sm'}
              showStatus
              showLevel={agent.level === 'L0' || agent.level === 'L1'}
              onClick={onAgentClick}
            />
          </div>
        );
      })}

      {/* Center Glow for NOVA */}
      <div
        style={{
          position: 'absolute',
          transform: 'translate(-50%, -50%)',
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${theme.colors.secondary}30 0%, transparent 70%)`,
          pointerEvents: 'none',
          animation: 'pulse 3s infinite',
        }}
      />

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.1); }
        }
      `}</style>
    </div>
  );
};

export default AgentOrbit;
