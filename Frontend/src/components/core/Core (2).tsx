// =============================================================================
// CHE·NU — Core Component
// Foundation Freeze V1
// =============================================================================
// Le Core (Trunk) est le centre de l'univers
// Règles:
// - Toujours centré
// - Glow stable
// - Pas de rotation (représente l'invariance)
// - Ancre visuelle
// =============================================================================

import React, { useMemo } from 'react';
import { CORE_CONFIG, UNIVERSE_COLORS } from '../../config';

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

export interface CoreProps {
  /** Taille du core */
  size?: number;
  /** Intensité du glow (0-1) */
  glowIntensity?: number;
  /** Core actif ou non */
  isActive?: boolean;
  /** Core est le focus actuel */
  isFocused?: boolean;
  /** Handler de clic */
  onClick?: () => void;
  /** Handler de hover */
  onHover?: (isHovered: boolean) => void;
  /** Mode de vue */
  mode?: '2d' | '3d' | 'xr';
  /** Classes CSS additionnelles */
  className?: string;
}

// -----------------------------------------------------------------------------
// STYLES
// -----------------------------------------------------------------------------

const coreStyles = {
  container: {
    position: 'relative' as const,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease-out',
  },
  core: {
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative' as const,
    transition: 'all 0.3s ease-out',
  },
  emoji: {
    fontSize: '2rem',
    userSelect: 'none' as const,
    filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.5))',
  },
  label: {
    position: 'absolute' as const,
    bottom: '-24px',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: '12px',
    fontWeight: 600,
    color: UNIVERSE_COLORS.text.primary,
    textShadow: '0 1px 2px rgba(0,0,0,0.5)',
    whiteSpace: 'nowrap' as const,
  },
  glow: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '50%',
    pointerEvents: 'none' as const,
  },
  ring: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '50%',
    border: '2px solid',
    pointerEvents: 'none' as const,
    opacity: 0.5,
  }
};

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------

export const Core: React.FC<CoreProps> = ({
  size = 80,
  glowIntensity = 0.5,
  isActive = true,
  isFocused = false,
  onClick,
  onHover,
  mode = '3d',
  className = ''
}) => {
  // Calculate visual properties
  const visualProps = useMemo(() => {
    const baseGlow = glowIntensity * 30;
    const focusedGlow = isFocused ? baseGlow * 1.5 : baseGlow;
    const activeScale = isActive ? 1 : 0.9;
    const focusedScale = isFocused ? 1.1 : 1;
    
    return {
      glowSize: focusedGlow,
      scale: activeScale * focusedScale,
      opacity: isActive ? 1 : 0.7,
    };
  }, [glowIntensity, isActive, isFocused]);

  // Core background gradient
  const coreBackground = useMemo(() => {
    return `radial-gradient(circle at 30% 30%, ${CORE_CONFIG.glowColor}, ${CORE_CONFIG.color})`;
  }, []);

  // Glow effect
  const glowStyle = useMemo(() => ({
    ...coreStyles.glow,
    width: size + visualProps.glowSize * 2,
    height: size + visualProps.glowSize * 2,
    background: `radial-gradient(circle, ${CORE_CONFIG.glowColor}40 0%, transparent 70%)`,
    animation: isActive ? 'corePulse 3s ease-in-out infinite' : 'none',
  }), [size, visualProps.glowSize, isActive]);

  // Ring effect (for focused state)
  const ringStyle = useMemo(() => ({
    ...coreStyles.ring,
    width: size + 20,
    height: size + 20,
    borderColor: CORE_CONFIG.glowColor,
    opacity: isFocused ? 0.8 : 0,
    transition: 'opacity 0.3s ease-out',
  }), [size, isFocused]);

  return (
    <div
      className={`chenu-core ${className}`}
      style={{
        ...coreStyles.container,
        width: size + visualProps.glowSize * 2,
        height: size + visualProps.glowSize * 2,
      }}
      onClick={onClick}
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
      role="button"
      tabIndex={0}
      aria-label="Core - Return to trunk"
    >
      {/* Glow layer */}
      <div style={glowStyle} />
      
      {/* Ring layer (focused) */}
      <div style={ringStyle} />
      
      {/* Core body */}
      <div
        style={{
          ...coreStyles.core,
          width: size,
          height: size,
          background: coreBackground,
          transform: `scale(${visualProps.scale})`,
          opacity: visualProps.opacity,
          boxShadow: `
            0 0 ${visualProps.glowSize}px ${CORE_CONFIG.glowColor},
            inset 0 -5px 20px rgba(0,0,0,0.3),
            inset 0 5px 20px rgba(255,255,255,0.2)
          `,
        }}
      >
        <span style={coreStyles.emoji}>{CORE_CONFIG.emoji}</span>
      </div>
      
      {/* Label */}
      <span style={coreStyles.label}>{CORE_CONFIG.label}</span>
      
      {/* Keyframes for animation (inline for simplicity) */}
      <style>{`
        @keyframes corePulse {
          0%, 100% { opacity: 0.8; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.05); }
        }
      `}</style>
    </div>
  );
};

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

export default Core;
