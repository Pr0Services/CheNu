// =============================================================================
// CHE·NU — AgentOrbit Component
// Foundation Freeze V1
// =============================================================================
// Agents en orbite autour des sphères
// Règles:
// - Visibles mais non-intrusifs
// - Couleur/pulse indique l'état
// - Hover/focus révèle les détails
// - Ne bloque jamais le contenu
// =============================================================================

import React, { useMemo, useState, useEffect } from 'react';
import { AgentVisualData, AgentState } from '../../types';
import { AGENT_STATE_COLORS, AGENT_LEVEL_COLORS } from '../../types';

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

export interface AgentOrbitProps {
  /** Données visuelles de l'agent */
  visualData: AgentVisualData;
  /** Position X du centre (sphère parente) */
  centerX?: number;
  /** Position Y du centre (sphère parente) */
  centerY?: number;
  /** Rayon de l'orbite de base */
  orbitRadius?: number;
  /** Angle initial */
  initialAngle?: number;
  /** Taille de l'agent */
  size?: number;
  /** Animation activée */
  animated?: boolean;
  /** Handler de clic */
  onClick?: (agentId: string) => void;
  /** Handler de hover */
  onHover?: (agentId: string | null) => void;
  /** Mode de vue */
  mode?: '2d' | '3d' | 'xr';
  /** Classes CSS additionnelles */
  className?: string;
}

// -----------------------------------------------------------------------------
// STYLES
// -----------------------------------------------------------------------------

const agentStyles = {
  container: {
    position: 'absolute' as const,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'transform 0.2s ease-out',
    zIndex: 5,
  },
  agent: {
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative' as const,
    transition: 'all 0.2s ease-out',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
  },
  emoji: {
    fontSize: '12px',
    userSelect: 'none' as const,
  },
  tooltip: {
    position: 'absolute' as const,
    bottom: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '4px 8px',
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderRadius: '4px',
    fontSize: '11px',
    color: 'white',
    whiteSpace: 'nowrap' as const,
    marginBottom: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    pointerEvents: 'none' as const,
    opacity: 0,
    transition: 'opacity 0.2s ease-out',
  },
  stateRing: {
    position: 'absolute' as const,
    top: '-2px',
    left: '-2px',
    right: '-2px',
    bottom: '-2px',
    borderRadius: '50%',
    border: '2px solid',
    pointerEvents: 'none' as const,
  },
  levelBadge: {
    position: 'absolute' as const,
    top: '-4px',
    right: '-4px',
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '8px',
    fontWeight: 700,
    color: 'white',
    boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
  },
  orbitPath: {
    position: 'absolute' as const,
    borderRadius: '50%',
    border: '1px dashed',
    opacity: 0.2,
    pointerEvents: 'none' as const,
  }
};

// -----------------------------------------------------------------------------
// HELPER FUNCTIONS
// -----------------------------------------------------------------------------

function getAgentBackground(state: AgentState, color: string): string {
  const stateColor = AGENT_STATE_COLORS[state];
  return `linear-gradient(135deg, ${color}, ${stateColor})`;
}

function getPulseAnimation(state: AgentState): string {
  switch (state) {
    case 'active':
      return 'agentPulseActive 2s ease-in-out infinite';
    case 'analyzing':
      return 'agentPulseAnalyzing 1.5s ease-in-out infinite';
    case 'warning':
      return 'agentPulseWarning 0.8s ease-in-out infinite';
    default:
      return 'none';
  }
}

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------

export const AgentOrbit: React.FC<AgentOrbitProps> = ({
  visualData,
  centerX = 0,
  centerY = 0,
  orbitRadius = 50,
  initialAngle = 0,
  size = 24,
  animated = true,
  onClick,
  onHover,
  mode = '3d',
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentAngle, setCurrentAngle] = useState(initialAngle);
  
  const { agent, runtime, computedOrbitSpeed, computedOrbitRadius, stateColor, isFocused } = visualData;

  // Orbit animation
  useEffect(() => {
    if (!animated || runtime.state === 'idle' || runtime.state === 'suspended') {
      return;
    }

    const speed = computedOrbitSpeed * 0.02; // radians per frame
    let animationFrame: number;

    const animate = () => {
      setCurrentAngle(prev => prev + speed);
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [animated, runtime.state, computedOrbitSpeed]);

  // Calculate position on orbit
  const position = useMemo(() => {
    const radius = orbitRadius * computedOrbitRadius;
    const x = centerX + Math.cos(currentAngle) * radius;
    const y = centerY + Math.sin(currentAngle) * radius;
    return { x, y };
  }, [centerX, centerY, currentAngle, orbitRadius, computedOrbitRadius]);

  // Visual properties
  const visualProps = useMemo(() => {
    const scale = isHovered ? 1.2 : isFocused ? 1.1 : 1;
    const levelColor = AGENT_LEVEL_COLORS[agent.level];
    const pulseAnimation = getPulseAnimation(runtime.state);
    
    return {
      scale,
      levelColor,
      pulseAnimation,
      background: getAgentBackground(runtime.state, agent.color),
    };
  }, [isHovered, isFocused, agent.level, agent.color, runtime.state]);

  // Handlers
  const handleClick = () => {
    onClick?.(agent.id);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHover?.(agent.id);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onHover?.(null);
  };

  return (
    <>
      {/* Orbit path (optional, for visualization) */}
      {isFocused && (
        <div
          style={{
            ...agentStyles.orbitPath,
            left: centerX - orbitRadius * computedOrbitRadius,
            top: centerY - orbitRadius * computedOrbitRadius,
            width: orbitRadius * computedOrbitRadius * 2,
            height: orbitRadius * computedOrbitRadius * 2,
            borderColor: agent.color,
          }}
        />
      )}
      
      {/* Agent */}
      <div
        className={`chenu-agent chenu-agent-${agent.id} ${className}`}
        style={{
          ...agentStyles.container,
          left: position.x,
          top: position.y,
          transform: `translate(-50%, -50%) scale(${visualProps.scale})`,
        }}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="button"
        tabIndex={0}
        aria-label={`${agent.label} - ${runtime.state}`}
        data-agent-id={agent.id}
        data-state={runtime.state}
        data-level={agent.level}
      >
        {/* Agent body */}
        <div
          style={{
            ...agentStyles.agent,
            width: size,
            height: size,
            background: visualProps.background,
            animation: visualProps.pulseAnimation,
          }}
        >
          {/* State ring */}
          <div
            style={{
              ...agentStyles.stateRing,
              borderColor: stateColor,
              opacity: runtime.state !== 'idle' ? 1 : 0.3,
            }}
          />
          
          {/* Emoji */}
          <span style={agentStyles.emoji}>{agent.emoji}</span>
          
          {/* Level badge */}
          <div
            style={{
              ...agentStyles.levelBadge,
              backgroundColor: visualProps.levelColor,
            }}
          >
            {agent.level.replace('L', '')}
          </div>
        </div>
        
        {/* Tooltip */}
        <div
          style={{
            ...agentStyles.tooltip,
            opacity: isHovered ? 1 : 0,
          }}
        >
          <strong>{agent.label}</strong>
          <br />
          <span style={{ color: stateColor }}>{runtime.state}</span>
          {runtime.currentTask && (
            <>
              <br />
              <span style={{ fontSize: '10px', opacity: 0.8 }}>{runtime.currentTask}</span>
            </>
          )}
        </div>
      </div>
      
      {/* Animation keyframes */}
      <style>{`
        @keyframes agentPulseActive {
          0%, 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
          50% { box-shadow: 0 0 0 6px rgba(34, 197, 94, 0); }
        }
        @keyframes agentPulseAnalyzing {
          0%, 100% { box-shadow: 0 0 0 0 rgba(234, 179, 8, 0.4); }
          50% { box-shadow: 0 0 0 6px rgba(234, 179, 8, 0); }
        }
        @keyframes agentPulseWarning {
          0%, 100% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.6); }
          50% { box-shadow: 0 0 0 8px rgba(249, 115, 22, 0); }
        }
      `}</style>
    </>
  );
};

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

export default AgentOrbit;
