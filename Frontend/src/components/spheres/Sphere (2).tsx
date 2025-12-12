// =============================================================================
// CHE·NU — Sphere Component
// Foundation Freeze V1
// =============================================================================
// Représentation visuelle d'une sphère
// Règles:
// - Taille = importance + densité
// - Mouvement = activité
// - Couleur canonique par sphère
// - États visuels distinguables SANS texte
// =============================================================================

import React, { useMemo, useState } from 'react';
import { SphereVisualData, SphereConfig, SphereVisualState as SphereState } from '../../types';
import { SPHERE_STATE_VISUALS, UNIVERSE_COLORS } from '../../config';

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

export interface SphereProps {
  /** Données visuelles de la sphère */
  visualData: SphereVisualData;
  /** Taille de base en pixels */
  baseSize?: number;
  /** Position X */
  x?: number;
  /** Position Y */
  y?: number;
  /** Handler de clic */
  onClick?: (sphereId: string) => void;
  /** Handler de hover */
  onHover?: (sphereId: string | null) => void;
  /** Afficher le label */
  showLabel?: boolean;
  /** Afficher les agents */
  showAgents?: boolean;
  /** Mode de vue */
  mode?: '2d' | '3d' | 'xr';
  /** Classes CSS additionnelles */
  className?: string;
}

// -----------------------------------------------------------------------------
// STYLES
// -----------------------------------------------------------------------------

const sphereStyles = {
  container: {
    position: 'absolute' as const,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease-out',
    transformOrigin: 'center center',
  },
  sphere: {
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative' as const,
    transition: 'all 0.3s ease-out',
  },
  emoji: {
    userSelect: 'none' as const,
    transition: 'font-size 0.3s ease-out',
  },
  label: {
    position: 'absolute' as const,
    bottom: '-20px',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: '11px',
    fontWeight: 500,
    color: UNIVERSE_COLORS.text.primary,
    textShadow: '0 1px 2px rgba(0,0,0,0.5)',
    whiteSpace: 'nowrap' as const,
    opacity: 0.9,
  },
  glow: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '50%',
    pointerEvents: 'none' as const,
  },
  focusRing: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '50%',
    border: '2px solid white',
    pointerEvents: 'none' as const,
    opacity: 0,
    transition: 'opacity 0.2s ease-out',
  },
  notification: {
    position: 'absolute' as const,
    top: '-5px',
    right: '-5px',
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    background: '#EF4444',
    color: 'white',
    fontSize: '10px',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
  },
  stateIndicator: {
    position: 'absolute' as const,
    bottom: '0',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    boxShadow: '0 0 4px currentColor',
  }
};

// -----------------------------------------------------------------------------
// HELPER FUNCTIONS
// -----------------------------------------------------------------------------

function getStateColor(state: SphereState): string {
  switch (state) {
    case 'idle': return '#6B7280';
    case 'active': return '#22C55E';
    case 'saturated': return '#EAB308';
    case 'attention-needed': return '#EF4444';
    default: return '#6B7280';
  }
}

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------

export const Sphere: React.FC<SphereProps> = ({
  visualData,
  baseSize = 60,
  x = 0,
  y = 0,
  onClick,
  onHover,
  showLabel = true,
  showAgents = false,
  mode = '3d',
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const { sphere, runtime, computedSize, computedGlow, isFocused, isHighlighted, isHovered: dataHovered } = visualData;
  
  // Calculate visual properties
  const visualProps = useMemo(() => {
    const size = baseSize * computedSize;
    const stateVisuals = SPHERE_STATE_VISUALS[runtime.visualState];
    const glowSize = computedGlow * 25;
    
    // Scale adjustments
    let scale = 1;
    if (isFocused) scale = 1.15;
    else if (isHighlighted || isHovered || dataHovered) scale = 1.08;
    
    // Emoji size
    const emojiSize = Math.max(16, size * 0.4);
    
    return {
      size,
      glowSize,
      scale,
      emojiSize,
      pulseSpeed: stateVisuals.pulseSpeed,
      saturation: stateVisuals.saturation,
      opacity: stateVisuals.opacity,
    };
  }, [baseSize, computedSize, computedGlow, runtime.visualState, isFocused, isHighlighted, isHovered, dataHovered]);

  // Background gradient
  const background = useMemo(() => {
    const lightColor = sphere.colorSecondary || sphere.color;
    return `radial-gradient(circle at 30% 30%, ${lightColor}, ${sphere.color})`;
  }, [sphere.color, sphere.colorSecondary]);

  // Glow style
  const glowStyle = useMemo(() => ({
    ...sphereStyles.glow,
    width: visualProps.size + visualProps.glowSize * 2,
    height: visualProps.size + visualProps.glowSize * 2,
    background: `radial-gradient(circle, ${sphere.color}50 0%, transparent 70%)`,
    animation: visualProps.pulseSpeed > 0 
      ? `spherePulse ${3 / visualProps.pulseSpeed}s ease-in-out infinite`
      : 'none',
  }), [visualProps.size, visualProps.glowSize, sphere.color, visualProps.pulseSpeed]);

  // Focus ring style
  const focusRingStyle = useMemo(() => ({
    ...sphereStyles.focusRing,
    width: visualProps.size + 10,
    height: visualProps.size + 10,
    borderColor: sphere.color,
    opacity: isFocused ? 0.8 : 0,
  }), [visualProps.size, sphere.color, isFocused]);

  // State indicator color
  const stateColor = getStateColor(runtime.visualState);

  // Handlers
  const handleClick = () => {
    onClick?.(sphere.id);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHover?.(sphere.id);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onHover?.(null);
  };

  return (
    <div
      className={`chenu-sphere chenu-sphere-${sphere.id} ${className}`}
      style={{
        ...sphereStyles.container,
        left: x,
        top: y,
        width: visualProps.size + visualProps.glowSize * 2,
        height: visualProps.size + visualProps.glowSize * 2,
        transform: `translate(-50%, -50%) scale(${visualProps.scale})`,
        zIndex: isFocused ? 10 : 1,
      }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="button"
      tabIndex={0}
      aria-label={`${sphere.label} sphere`}
      data-sphere-id={sphere.id}
      data-state={runtime.visualState}
    >
      {/* Glow layer */}
      <div style={glowStyle} />
      
      {/* Focus ring */}
      <div style={focusRingStyle} />
      
      {/* Sphere body */}
      <div
        style={{
          ...sphereStyles.sphere,
          width: visualProps.size,
          height: visualProps.size,
          background,
          opacity: visualProps.opacity,
          filter: `saturate(${visualProps.saturation})`,
          boxShadow: `
            0 0 ${visualProps.glowSize}px ${sphere.color}80,
            inset 0 -5px 15px rgba(0,0,0,0.3),
            inset 0 5px 15px rgba(255,255,255,0.15)
          `,
        }}
      >
        <span 
          style={{
            ...sphereStyles.emoji,
            fontSize: `${visualProps.emojiSize}px`,
          }}
        >
          {sphere.emoji}
        </span>
        
        {/* State indicator */}
        <div 
          style={{
            ...sphereStyles.stateIndicator,
            backgroundColor: stateColor,
            color: stateColor,
          }} 
        />
      </div>
      
      {/* Notification badge */}
      {runtime.hasNotifications && runtime.notificationCount > 0 && (
        <div style={sphereStyles.notification}>
          {runtime.notificationCount > 9 ? '9+' : runtime.notificationCount}
        </div>
      )}
      
      {/* Label */}
      {showLabel && (
        <span style={sphereStyles.label}>
          {sphere.label}
        </span>
      )}
      
      {/* Animation keyframes */}
      <style>{`
        @keyframes spherePulse {
          0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.9; transform: translate(-50%, -50%) scale(1.1); }
        }
      `}</style>
    </div>
  );
};

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

export default Sphere;
