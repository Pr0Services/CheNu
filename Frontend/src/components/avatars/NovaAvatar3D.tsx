/**
 * CHE·NU™ V4 - NOVA AVATAR 3D
 * A2-01: Avatar animé 3D pour Nova avec expressions contextuelles
 * 
 * Expressions:
 * - idle: État de repos, léger mouvement
 * - thinking: Réflexion, particules autour
 * - happy: Succès, glow doré
 * - speaking: En train de répondre
 * - listening: Écoute active
 * - error: Erreur, teinte rouge
 * - excited: Découverte importante
 */

import React, { useState, useEffect, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════════════════════════════════════

const T = {
  colors: {
    sacred: { gold: '#D8B26A', goldLight: '#E8C890', goldDark: '#B89040' },
    bg: { main: '#0D0D0D', temple: '#1A1A1A' },
    text: { primary: '#E8E4DC' },
    accent: { emerald: '#3F7249', blue: '#3B82F6', purple: '#8B5CF6', danger: '#EF4444' }
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

type NovaExpression = 'idle' | 'thinking' | 'happy' | 'speaking' | 'listening' | 'error' | 'excited';

interface NovaAvatarProps {
  expression?: NovaExpression;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showParticles?: boolean;
  showGlow?: boolean;
  onClick?: () => void;
  className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPRESSION CONFIGS
// ═══════════════════════════════════════════════════════════════════════════════

const EXPRESSION_CONFIG: Record<NovaExpression, {
  emoji: string;
  glowColor: string;
  pulseSpeed: number;
  particleColor: string;
  rotation: number;
}> = {
  idle: {
    emoji: '🤖',
    glowColor: T.colors.sacred.gold,
    pulseSpeed: 3,
    particleColor: T.colors.sacred.gold,
    rotation: 0
  },
  thinking: {
    emoji: '🤔',
    glowColor: T.colors.accent.purple,
    pulseSpeed: 1.5,
    particleColor: T.colors.accent.purple,
    rotation: -5
  },
  happy: {
    emoji: '😊',
    glowColor: T.colors.sacred.goldLight,
    pulseSpeed: 2,
    particleColor: T.colors.sacred.goldLight,
    rotation: 0
  },
  speaking: {
    emoji: '💬',
    glowColor: T.colors.accent.blue,
    pulseSpeed: 0.8,
    particleColor: T.colors.accent.blue,
    rotation: 0
  },
  listening: {
    emoji: '👂',
    glowColor: T.colors.accent.emerald,
    pulseSpeed: 2.5,
    particleColor: T.colors.accent.emerald,
    rotation: 5
  },
  error: {
    emoji: '😰',
    glowColor: T.colors.accent.danger,
    pulseSpeed: 0.5,
    particleColor: T.colors.accent.danger,
    rotation: -3
  },
  excited: {
    emoji: '🎉',
    glowColor: T.colors.sacred.gold,
    pulseSpeed: 0.6,
    particleColor: '#FFD700',
    rotation: 5
  }
};

const SIZE_CONFIG = {
  sm: { size: 40, fontSize: 20, particleCount: 3 },
  md: { size: 64, fontSize: 32, particleCount: 5 },
  lg: { size: 96, fontSize: 48, particleCount: 8 },
  xl: { size: 128, fontSize: 64, particleCount: 12 }
};

// ═══════════════════════════════════════════════════════════════════════════════
// PARTICLE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const Particle: React.FC<{
  color: string;
  delay: number;
  size: number;
  distance: number;
  duration: number;
}> = ({ color, delay, size, distance, duration }) => {
  const angle = Math.random() * 360;
  
  return (
    <div
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        opacity: 0,
        animation: `novaParticle ${duration}s ease-in-out ${delay}s infinite`,
        transform: `rotate(${angle}deg) translateX(${distance}px)`,
        boxShadow: `0 0 ${size * 2}px ${color}`
      }}
    />
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// NOVA FACE SVG
// ═══════════════════════════════════════════════════════════════════════════════

const NovaFace: React.FC<{
  expression: NovaExpression;
  size: number;
  glowColor: string;
}> = ({ expression, size, glowColor }) => {
  // Eye states based on expression
  const getEyeState = () => {
    switch (expression) {
      case 'happy':
      case 'excited':
        return 'arc'; // Happy curved eyes
      case 'thinking':
        return 'look-up';
      case 'listening':
        return 'wide';
      case 'error':
        return 'worried';
      case 'speaking':
        return 'normal';
      default:
        return 'normal';
    }
  };

  const getMouthState = () => {
    switch (expression) {
      case 'happy':
      case 'excited':
        return 'smile';
      case 'speaking':
        return 'open';
      case 'thinking':
        return 'hmm';
      case 'error':
        return 'frown';
      default:
        return 'neutral';
    }
  };

  const eyeState = getEyeState();
  const mouthState = getMouthState();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{
        filter: `drop-shadow(0 0 ${size / 4}px ${glowColor})`
      }}
    >
      {/* Head background */}
      <defs>
        <linearGradient id="novaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={T.colors.sacred.gold} />
          <stop offset="100%" stopColor={T.colors.sacred.goldDark} />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Face circle */}
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="url(#novaGradient)"
        filter="url(#glow)"
      />

      {/* Inner face */}
      <circle
        cx="50"
        cy="50"
        r="38"
        fill={T.colors.bg.temple}
      />

      {/* Eyes */}
      {eyeState === 'arc' ? (
        <>
          <path d="M 30 40 Q 35 35 40 40" stroke={glowColor} strokeWidth="3" fill="none" />
          <path d="M 60 40 Q 65 35 70 40" stroke={glowColor} strokeWidth="3" fill="none" />
        </>
      ) : eyeState === 'wide' ? (
        <>
          <circle cx="35" cy="40" r="8" fill={glowColor} />
          <circle cx="65" cy="40" r="8" fill={glowColor} />
          <circle cx="35" cy="40" r="4" fill={T.colors.bg.main} />
          <circle cx="65" cy="40" r="4" fill={T.colors.bg.main} />
        </>
      ) : eyeState === 'look-up' ? (
        <>
          <circle cx="35" cy="38" r="6" fill={glowColor} />
          <circle cx="65" cy="38" r="6" fill={glowColor} />
          <circle cx="35" cy="36" r="3" fill={T.colors.bg.main} />
          <circle cx="65" cy="36" r="3" fill={T.colors.bg.main} />
        </>
      ) : eyeState === 'worried' ? (
        <>
          <ellipse cx="35" cy="40" rx="6" ry="8" fill={glowColor} />
          <ellipse cx="65" cy="40" rx="6" ry="8" fill={glowColor} />
          <circle cx="35" cy="42" r="3" fill={T.colors.bg.main} />
          <circle cx="65" cy="42" r="3" fill={T.colors.bg.main} />
        </>
      ) : (
        <>
          <circle cx="35" cy="40" r="6" fill={glowColor} />
          <circle cx="65" cy="40" r="6" fill={glowColor} />
          <circle cx="35" cy="40" r="3" fill={T.colors.bg.main} />
          <circle cx="65" cy="40" r="3" fill={T.colors.bg.main} />
        </>
      )}

      {/* Mouth */}
      {mouthState === 'smile' && (
        <path d="M 35 60 Q 50 75 65 60" stroke={glowColor} strokeWidth="3" fill="none" />
      )}
      {mouthState === 'open' && (
        <ellipse cx="50" cy="65" rx="10" ry="8" fill={glowColor} opacity="0.8" />
      )}
      {mouthState === 'hmm' && (
        <line x1="40" y1="65" x2="60" y2="63" stroke={glowColor} strokeWidth="3" />
      )}
      {mouthState === 'frown' && (
        <path d="M 35 68 Q 50 58 65 68" stroke={glowColor} strokeWidth="3" fill="none" />
      )}
      {mouthState === 'neutral' && (
        <line x1="40" y1="65" x2="60" y2="65" stroke={glowColor} strokeWidth="3" />
      )}

      {/* Antenna / Crown */}
      <circle cx="50" cy="12" r="5" fill={glowColor}>
        <animate
          attributeName="opacity"
          values="1;0.5;1"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>
      <line x1="50" y1="17" x2="50" y2="8" stroke={glowColor} strokeWidth="2" />
    </svg>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN NOVA AVATAR COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function NovaAvatar3D({
  expression = 'idle',
  size = 'md',
  showParticles = true,
  showGlow = true,
  onClick,
  className
}: NovaAvatarProps) {
  const [currentExpression, setCurrentExpression] = useState(expression);
  const config = EXPRESSION_CONFIG[currentExpression];
  const sizeConfig = SIZE_CONFIG[size];

  // Sync with prop
  useEffect(() => {
    setCurrentExpression(expression);
  }, [expression]);

  // Auto-blink effect for idle
  useEffect(() => {
    if (currentExpression === 'idle') {
      const blinkInterval = setInterval(() => {
        // Could trigger blink animation here
      }, 3000 + Math.random() * 2000);
      return () => clearInterval(blinkInterval);
    }
  }, [currentExpression]);

  return (
    <div
      onClick={onClick}
      className={className}
      style={{
        position: 'relative',
        width: sizeConfig.size,
        height: sizeConfig.size,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease'
      }}
    >
      {/* Glow background */}
      {showGlow && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: sizeConfig.size * 1.5,
            height: sizeConfig.size * 1.5,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${config.glowColor}40 0%, transparent 70%)`,
            animation: `novaPulse ${config.pulseSpeed}s ease-in-out infinite`,
            pointerEvents: 'none'
          }}
        />
      )}

      {/* Particles */}
      {showParticles && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: sizeConfig.size,
            height: sizeConfig.size,
            pointerEvents: 'none'
          }}
        >
          {Array.from({ length: sizeConfig.particleCount }).map((_, i) => (
            <Particle
              key={i}
              color={config.particleColor}
              delay={i * 0.3}
              size={3 + Math.random() * 3}
              distance={sizeConfig.size / 2 + 10 + Math.random() * 20}
              duration={2 + Math.random()}
            />
          ))}
        </div>
      )}

      {/* Nova Face */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: `novaFloat 3s ease-in-out infinite`,
          transform: `rotate(${config.rotation}deg)`
        }}
      >
        <NovaFace
          expression={currentExpression}
          size={sizeConfig.size}
          glowColor={config.glowColor}
        />
      </div>

      {/* Expression indicator (for debug/demo) */}
      {process.env.NODE_ENV === 'development' && (
        <div
          style={{
            position: 'absolute',
            bottom: -20,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 10,
            color: T.colors.text.primary,
            opacity: 0.5,
            whiteSpace: 'nowrap'
          }}
        >
          {currentExpression}
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes novaPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.3; }
        }

        @keyframes novaFloat {
          0%, 100% { transform: translateY(0) rotate(${config.rotation}deg); }
          50% { transform: translateY(-5px) rotate(${config.rotation}deg); }
        }

        @keyframes novaParticle {
          0% { opacity: 0; transform: rotate(var(--angle, 0deg)) translateX(0) scale(0); }
          50% { opacity: 1; transform: rotate(var(--angle, 0deg)) translateX(var(--distance, 50px)) scale(1); }
          100% { opacity: 0; transform: rotate(var(--angle, 0deg)) translateX(calc(var(--distance, 50px) * 1.5)) scale(0); }
        }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// NOVA AVATAR SHOWCASE (Demo component)
// ═══════════════════════════════════════════════════════════════════════════════

export const NovaAvatarShowcase: React.FC = () => {
  const [selectedExpression, setSelectedExpression] = useState<NovaExpression>('idle');
  const expressions: NovaExpression[] = ['idle', 'thinking', 'happy', 'speaking', 'listening', 'error', 'excited'];

  return (
    <div style={{
      padding: 32,
      background: T.colors.bg.temple,
      borderRadius: 16,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 32
    }}>
      <h2 style={{ color: T.colors.text.primary, margin: 0 }}>🤖 Nova Avatar 3D</h2>
      
      {/* Main Avatar */}
      <NovaAvatar3D expression={selectedExpression} size="xl" />

      {/* Expression Selector */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        {expressions.map(expr => (
          <button
            key={expr}
            onClick={() => setSelectedExpression(expr)}
            style={{
              padding: '8px 16px',
              background: selectedExpression === expr ? T.colors.sacred.gold : T.colors.bg.main,
              border: `1px solid ${selectedExpression === expr ? T.colors.sacred.gold : '#333'}`,
              borderRadius: 8,
              color: selectedExpression === expr ? '#000' : T.colors.text.primary,
              cursor: 'pointer',
              fontSize: 13,
              textTransform: 'capitalize'
            }}
          >
            {EXPRESSION_CONFIG[expr].emoji} {expr}
          </button>
        ))}
      </div>

      {/* Size Comparison */}
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-end' }}>
        <NovaAvatar3D expression={selectedExpression} size="sm" />
        <NovaAvatar3D expression={selectedExpression} size="md" />
        <NovaAvatar3D expression={selectedExpression} size="lg" />
      </div>
    </div>
  );
};
