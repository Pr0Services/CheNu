/**
 * CHE·NU™ V4 - AVATAR IA GÉNÉRATIF
 * A1-02: Génération d'avatars avec styles artistiques IA
 * 
 * Simule un générateur d'avatars IA avec:
 * - 8 styles artistiques (Anime, Pixel, Watercolor, etc.)
 * - Prompts personnalisés
 * - Variations aléatoires
 * - Preview en temps réel
 * - Export haute résolution
 */

import React, { useState, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════════════════════════════════════

const T = {
  colors: {
    sacred: { gold: '#D8B26A', goldLight: '#E8C890', goldDark: '#B89040' },
    bg: { main: '#0D0D0D', temple: '#1A1A1A', card: '#1E1E1E', elevated: '#242424' },
    text: { primary: '#E8E4DC', secondary: '#A09080', muted: '#6B6560' },
    accent: { 
      emerald: '#3F7249', 
      blue: '#3B82F6', 
      purple: '#8B5CF6', 
      pink: '#EC4899',
      cyan: '#06B6D4',
      amber: '#F59E0B',
      rose: '#F43F5E',
      indigo: '#6366F1'
    },
    border: '#2A2A2A'
  },
  radius: { sm: 6, md: 12, lg: 16, xl: 24 }
};

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════════

export interface AIStyle {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  gradient: string;
  baseColors: string[];
  patterns: string[];
}

export interface GeneratedAvatar {
  id: string;
  style: AIStyle;
  prompt: string;
  seed: number;
  colors: string[];
  pattern: string;
  timestamp: Date;
}

// ═══════════════════════════════════════════════════════════════════════════════
// AI STYLES DATA
// ═══════════════════════════════════════════════════════════════════════════════

const AI_STYLES: AIStyle[] = [
  {
    id: 'anime',
    name: 'Anime',
    icon: '🎌',
    description: 'Style manga japonais avec grands yeux expressifs',
    color: T.colors.accent.pink,
    gradient: 'linear-gradient(135deg, #EC4899, #F472B6)',
    baseColors: ['#FFB6C1', '#FF69B4', '#FF1493', '#DB7093'],
    patterns: ['sparkle', 'soft', 'vibrant']
  },
  {
    id: 'pixel',
    name: 'Pixel Art',
    icon: '👾',
    description: 'Rétro 8-bit avec pixels apparents',
    color: T.colors.accent.emerald,
    gradient: 'linear-gradient(135deg, #3F7249, #22C55E)',
    baseColors: ['#22C55E', '#4ADE80', '#86EFAC', '#166534'],
    patterns: ['grid', 'dither', 'blocky']
  },
  {
    id: 'watercolor',
    name: 'Aquarelle',
    icon: '🎨',
    description: 'Effet peinture avec dégradés doux',
    color: T.colors.accent.cyan,
    gradient: 'linear-gradient(135deg, #06B6D4, #67E8F9)',
    baseColors: ['#67E8F9', '#22D3EE', '#06B6D4', '#0891B2'],
    patterns: ['wash', 'bleed', 'splatter']
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    icon: '🌆',
    description: 'Néon futuriste avec glitch effects',
    color: T.colors.accent.purple,
    gradient: 'linear-gradient(135deg, #8B5CF6, #A855F7)',
    baseColors: ['#A855F7', '#C084FC', '#E879F9', '#7C3AED'],
    patterns: ['neon', 'glitch', 'scanline']
  },
  {
    id: 'minimalist',
    name: 'Minimaliste',
    icon: '⚪',
    description: 'Formes géométriques épurées',
    color: T.colors.text.secondary,
    gradient: 'linear-gradient(135deg, #6B7280, #9CA3AF)',
    baseColors: ['#E5E7EB', '#D1D5DB', '#9CA3AF', '#6B7280'],
    patterns: ['circle', 'square', 'line']
  },
  {
    id: 'fantasy',
    name: 'Fantasy',
    icon: '🧙',
    description: 'Médiéval fantastique avec magie',
    color: T.colors.sacred.gold,
    gradient: `linear-gradient(135deg, ${T.colors.sacred.gold}, ${T.colors.sacred.goldLight})`,
    baseColors: ['#D8B26A', '#E8C890', '#B89040', '#8B7355'],
    patterns: ['magic', 'ancient', 'mystical']
  },
  {
    id: 'comic',
    name: 'Comic Book',
    icon: '💥',
    description: 'Style BD américaine avec contours forts',
    color: T.colors.accent.amber,
    gradient: 'linear-gradient(135deg, #F59E0B, #FBBF24)',
    baseColors: ['#FBBF24', '#F59E0B', '#D97706', '#B45309'],
    patterns: ['halftone', 'bold', 'action']
  },
  {
    id: 'abstract',
    name: 'Abstrait',
    icon: '🔮',
    description: 'Formes fluides et couleurs vibrantes',
    color: T.colors.accent.indigo,
    gradient: 'linear-gradient(135deg, #6366F1, #818CF8)',
    baseColors: ['#818CF8', '#6366F1', '#4F46E5', '#4338CA'],
    patterns: ['flow', 'morph', 'wave']
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// AVATAR PREVIEW COMPONENT (Simulated AI Generation)
// ═══════════════════════════════════════════════════════════════════════════════

interface AvatarPreviewProps {
  style: AIStyle;
  seed: number;
  size?: number;
  isGenerating?: boolean;
}

const AvatarPreview: React.FC<AvatarPreviewProps> = ({ 
  style, 
  seed, 
  size = 200,
  isGenerating = false 
}) => {
  // Déterministe basé sur le seed
  const getSeededValue = (index: number) => {
    const x = Math.sin(seed + index) * 10000;
    return x - Math.floor(x);
  };

  const colorIndex = Math.floor(getSeededValue(1) * style.baseColors.length);
  const patternIndex = Math.floor(getSeededValue(2) * style.patterns.length);
  const rotation = getSeededValue(3) * 360;
  const scale = 0.8 + getSeededValue(4) * 0.4;

  const primaryColor = style.baseColors[colorIndex];
  const secondaryColor = style.baseColors[(colorIndex + 1) % style.baseColors.length];
  const pattern = style.patterns[patternIndex];

  // Générer le SVG basé sur le style
  const renderStyleContent = () => {
    switch (style.id) {
      case 'anime':
        return (
          <g transform={`rotate(${rotation * 0.1}, 100, 100)`}>
            {/* Face */}
            <ellipse cx="100" cy="105" rx="60" ry="70" fill={primaryColor} />
            {/* Cheveux */}
            <path d="M40 80 Q100 20 160 80 L160 50 Q100 -10 40 50 Z" fill={secondaryColor} />
            {/* Yeux anime */}
            <ellipse cx="75" cy="100" rx="15" ry="20" fill="white" />
            <ellipse cx="125" cy="100" rx="15" ry="20" fill="white" />
            <circle cx="78" cy="102" r="10" fill="#333" />
            <circle cx="128" cy="102" r="10" fill="#333" />
            <circle cx="82" cy="98" r="4" fill="white" />
            <circle cx="132" cy="98" r="4" fill="white" />
            {/* Bouche */}
            <path d="M90 130 Q100 140 110 130" stroke="#333" strokeWidth="2" fill="none" />
          </g>
        );

      case 'pixel':
        const pixelSize = 12;
        const pixels = [];
        for (let y = 0; y < 16; y++) {
          for (let x = 0; x < 16; x++) {
            const isActive = getSeededValue(x * 16 + y + 100) > 0.4;
            const isFace = Math.sqrt((x - 8) ** 2 + (y - 8) ** 2) < 6;
            if (isActive || isFace) {
              pixels.push(
                <rect
                  key={`${x}-${y}`}
                  x={x * pixelSize + 4}
                  y={y * pixelSize + 4}
                  width={pixelSize - 1}
                  height={pixelSize - 1}
                  fill={isFace ? primaryColor : secondaryColor}
                />
              );
            }
          }
        }
        return <g>{pixels}</g>;

      case 'watercolor':
        return (
          <g>
            <defs>
              <filter id={`watercolor-${seed}`}>
                <feTurbulence baseFrequency="0.02" numOctaves="3" seed={seed} />
                <feDisplacementMap in="SourceGraphic" scale="20" />
              </filter>
            </defs>
            <circle cx="100" cy="100" r="70" fill={primaryColor} opacity="0.6" filter={`url(#watercolor-${seed})`} />
            <circle cx="90" cy="90" r="50" fill={secondaryColor} opacity="0.5" filter={`url(#watercolor-${seed})`} />
            <circle cx="110" cy="110" r="40" fill={style.baseColors[2]} opacity="0.4" />
          </g>
        );

      case 'cyberpunk':
        return (
          <g>
            <defs>
              <linearGradient id={`cyber-${seed}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={primaryColor} />
                <stop offset="50%" stopColor={secondaryColor} />
                <stop offset="100%" stopColor={style.baseColors[2]} />
              </linearGradient>
            </defs>
            {/* Tête géométrique */}
            <polygon points="100,20 170,70 150,170 50,170 30,70" fill={`url(#cyber-${seed})`} />
            {/* Yeux néon */}
            <line x1="60" y1="90" x2="90" y2="90" stroke="#0FF" strokeWidth="4" />
            <line x1="110" y1="90" x2="140" y2="90" stroke="#F0F" strokeWidth="4" />
            {/* Circuit lines */}
            <path d="M50 130 L80 130 L80 150" stroke="#0FF" strokeWidth="2" fill="none" opacity="0.7" />
            <path d="M150 130 L120 130 L120 150" stroke="#F0F" strokeWidth="2" fill="none" opacity="0.7" />
            {/* Glitch effect */}
            <rect x="40" y={100 + getSeededValue(5) * 20} width="120" height="3" fill="#F0F" opacity="0.5" />
          </g>
        );

      case 'minimalist':
        return (
          <g transform={`scale(${scale}) translate(${(1-scale)*100}, ${(1-scale)*100})`}>
            <circle cx="100" cy="100" r="60" fill="none" stroke={primaryColor} strokeWidth="3" />
            <circle cx="80" cy="90" r="8" fill={secondaryColor} />
            <circle cx="120" cy="90" r="8" fill={secondaryColor} />
            <line x1="80" y1="120" x2="120" y2="120" stroke={primaryColor} strokeWidth="3" strokeLinecap="round" />
          </g>
        );

      case 'fantasy':
        return (
          <g>
            <defs>
              <radialGradient id={`magic-${seed}`}>
                <stop offset="0%" stopColor={primaryColor} />
                <stop offset="100%" stopColor={secondaryColor} />
              </radialGradient>
            </defs>
            {/* Aura magique */}
            <circle cx="100" cy="100" r="80" fill={`url(#magic-${seed})`} opacity="0.3" />
            {/* Capuche */}
            <path d="M40 150 Q100 40 160 150 L140 150 Q100 70 60 150 Z" fill={secondaryColor} />
            {/* Visage */}
            <ellipse cx="100" cy="120" rx="35" ry="30" fill={primaryColor} />
            {/* Yeux lumineux */}
            <circle cx="85" cy="115" r="5" fill={T.colors.sacred.gold}>
              <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="115" cy="115" r="5" fill={T.colors.sacred.gold}>
              <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
            </circle>
            {/* Étoiles */}
            {[...Array(5)].map((_, i) => (
              <text
                key={i}
                x={30 + getSeededValue(i + 10) * 140}
                y={30 + getSeededValue(i + 20) * 60}
                fontSize="12"
                fill={T.colors.sacred.gold}
                opacity={0.5 + getSeededValue(i + 30) * 0.5}
              >
                ✦
              </text>
            ))}
          </g>
        );

      case 'comic':
        return (
          <g>
            {/* Fond halftone */}
            <defs>
              <pattern id={`halftone-${seed}`} width="8" height="8" patternUnits="userSpaceOnUse">
                <circle cx="4" cy="4" r="2" fill={secondaryColor} opacity="0.3" />
              </pattern>
            </defs>
            <rect x="20" y="20" width="160" height="160" fill={`url(#halftone-${seed})`} />
            {/* Visage avec contour épais */}
            <ellipse cx="100" cy="100" rx="55" ry="65" fill={primaryColor} stroke="#000" strokeWidth="4" />
            {/* Yeux */}
            <ellipse cx="75" cy="90" rx="12" ry="15" fill="white" stroke="#000" strokeWidth="2" />
            <ellipse cx="125" cy="90" rx="12" ry="15" fill="white" stroke="#000" strokeWidth="2" />
            <circle cx="78" cy="92" r="6" fill="#000" />
            <circle cx="128" cy="92" r="6" fill="#000" />
            {/* Sourire */}
            <path d="M70 120 Q100 145 130 120" stroke="#000" strokeWidth="4" fill="none" />
            {/* Action lines */}
            <line x1="10" y1="30" x2="30" y2="40" stroke={secondaryColor} strokeWidth="3" />
            <line x1="170" y1="40" x2="190" y2="30" stroke={secondaryColor} strokeWidth="3" />
          </g>
        );

      case 'abstract':
      default:
        return (
          <g transform={`rotate(${rotation}, 100, 100)`}>
            <defs>
              <linearGradient id={`abstract-${seed}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={primaryColor} />
                <stop offset="100%" stopColor={secondaryColor} />
              </linearGradient>
            </defs>
            {/* Formes fluides */}
            <ellipse cx="100" cy="80" rx={40 + getSeededValue(6) * 30} ry={30 + getSeededValue(7) * 20} 
              fill={`url(#abstract-${seed})`} opacity="0.8" />
            <ellipse cx="80" cy="120" rx={30 + getSeededValue(8) * 20} ry={40 + getSeededValue(9) * 20} 
              fill={style.baseColors[2]} opacity="0.6" />
            <ellipse cx="120" cy="100" rx={25 + getSeededValue(10) * 15} ry={35 + getSeededValue(11) * 15} 
              fill={style.baseColors[3]} opacity="0.7" />
            {/* Points décoratifs */}
            {[...Array(8)].map((_, i) => (
              <circle
                key={i}
                cx={50 + getSeededValue(i + 50) * 100}
                cy={50 + getSeededValue(i + 60) * 100}
                r={3 + getSeededValue(i + 70) * 5}
                fill={style.baseColors[i % 4]}
                opacity={0.4 + getSeededValue(i + 80) * 0.4}
              />
            ))}
          </g>
        );
    }
  };

  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: T.radius.xl,
      overflow: 'hidden',
      background: T.colors.bg.elevated,
      border: `2px solid ${style.color}40`,
      position: 'relative'
    }}>
      {isGenerating ? (
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 12
        }}>
          <div style={{
            width: 40,
            height: 40,
            border: `3px solid ${T.colors.bg.card}`,
            borderTopColor: style.color,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <span style={{ color: T.colors.text.muted, fontSize: 12 }}>Génération IA...</span>
        </div>
      ) : (
        <svg viewBox="0 0 200 200" width={size} height={size}>
          {/* Background */}
          <rect width="200" height="200" fill={T.colors.bg.card} />
          {renderStyleContent()}
        </svg>
      )}
      
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// STYLE SELECTOR COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface StyleSelectorProps {
  styles: AIStyle[];
  selectedId: string;
  onSelect: (style: AIStyle) => void;
}

const StyleSelector: React.FC<StyleSelectorProps> = ({ styles, selectedId, onSelect }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 12
    }}>
      {styles.map(style => (
        <button
          key={style.id}
          onClick={() => onSelect(style)}
          style={{
            padding: 16,
            background: selectedId === style.id ? style.gradient : T.colors.bg.card,
            border: `2px solid ${selectedId === style.id ? style.color : T.colors.border}`,
            borderRadius: T.radius.md,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8
          }}
        >
          <span style={{ fontSize: 28 }}>{style.icon}</span>
          <span style={{
            color: selectedId === style.id ? '#fff' : T.colors.text.primary,
            fontSize: 12,
            fontWeight: 600
          }}>
            {style.name}
          </span>
        </button>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN AVATAR GENERATOR COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const AvatarGenerator: React.FC<{
  onGenerate?: (avatar: GeneratedAvatar) => void;
}> = ({ onGenerate }) => {
  const [selectedStyle, setSelectedStyle] = useState<AIStyle>(AI_STYLES[0]);
  const [prompt, setPrompt] = useState('');
  const [seed, setSeed] = useState(Math.floor(Math.random() * 10000));
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<GeneratedAvatar[]>([]);

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    
    // Simuler le temps de génération IA
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newSeed = Math.floor(Math.random() * 10000);
    setSeed(newSeed);
    
    const newAvatar: GeneratedAvatar = {
      id: `avatar-${Date.now()}`,
      style: selectedStyle,
      prompt,
      seed: newSeed,
      colors: selectedStyle.baseColors,
      pattern: selectedStyle.patterns[0],
      timestamp: new Date()
    };
    
    setHistory(prev => [newAvatar, ...prev].slice(0, 8));
    onGenerate?.(newAvatar);
    setIsGenerating(false);
  }, [selectedStyle, prompt, onGenerate]);

  const handleVariation = () => {
    setSeed(Math.floor(Math.random() * 10000));
  };

  return (
    <div style={{
      background: T.colors.bg.temple,
      borderRadius: T.radius.xl,
      padding: 24,
      maxWidth: 800
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: 24
      }}>
        <span style={{ fontSize: 32 }}>🎨</span>
        <div>
          <h2 style={{ margin: 0, color: T.colors.text.primary, fontSize: 20 }}>
            Générateur d'Avatar IA
          </h2>
          <p style={{ margin: '4px 0 0', color: T.colors.text.muted, fontSize: 13 }}>
            Créez des avatars uniques avec l'intelligence artificielle
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 24 }}>
        {/* Preview Section */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <AvatarPreview 
            style={selectedStyle} 
            seed={seed} 
            size={220}
            isGenerating={isGenerating}
          />
          
          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              style={{
                padding: '12px 24px',
                background: selectedStyle.gradient,
                border: 'none',
                borderRadius: T.radius.md,
                color: '#fff',
                fontWeight: 600,
                cursor: isGenerating ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                opacity: isGenerating ? 0.7 : 1
              }}
            >
              {isGenerating ? '⏳' : '✨'} Générer
            </button>
            <button
              onClick={handleVariation}
              disabled={isGenerating}
              style={{
                padding: '12px 16px',
                background: T.colors.bg.elevated,
                border: `1px solid ${T.colors.border}`,
                borderRadius: T.radius.md,
                color: T.colors.text.primary,
                cursor: 'pointer'
              }}
            >
              🎲 Variation
            </button>
          </div>
        </div>

        {/* Controls Section */}
        <div style={{ flex: 1 }}>
          {/* Style Selection */}
          <div style={{ marginBottom: 20 }}>
            <label style={{
              display: 'block',
              marginBottom: 8,
              color: T.colors.text.secondary,
              fontSize: 13,
              fontWeight: 500
            }}>
              Style artistique
            </label>
            <StyleSelector
              styles={AI_STYLES}
              selectedId={selectedStyle.id}
              onSelect={setSelectedStyle}
            />
          </div>

          {/* Style Description */}
          <div style={{
            padding: 12,
            background: `${selectedStyle.color}15`,
            borderRadius: T.radius.md,
            marginBottom: 16
          }}>
            <p style={{
              margin: 0,
              color: selectedStyle.color,
              fontSize: 13
            }}>
              {selectedStyle.icon} {selectedStyle.description}
            </p>
          </div>

          {/* Prompt Input */}
          <div style={{ marginBottom: 16 }}>
            <label style={{
              display: 'block',
              marginBottom: 8,
              color: T.colors.text.secondary,
              fontSize: 13,
              fontWeight: 500
            }}>
              Description (optionnel)
            </label>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Décrivez votre avatar idéal..."
              style={{
                width: '100%',
                padding: 12,
                background: T.colors.bg.card,
                border: `1px solid ${T.colors.border}`,
                borderRadius: T.radius.md,
                color: T.colors.text.primary,
                fontSize: 14,
                resize: 'none',
                height: 80,
                outline: 'none'
              }}
            />
          </div>

          {/* Seed Display */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            color: T.colors.text.muted,
            fontSize: 12
          }}>
            <span>🌱 Seed:</span>
            <code style={{
              padding: '2px 8px',
              background: T.colors.bg.card,
              borderRadius: T.radius.sm
            }}>
              {seed}
            </code>
          </div>
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h4 style={{
            margin: '0 0 12px',
            color: T.colors.text.secondary,
            fontSize: 13,
            fontWeight: 500
          }}>
            Historique récent
          </h4>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
            {history.map(avatar => (
              <div
                key={avatar.id}
                onClick={() => {
                  setSelectedStyle(avatar.style);
                  setSeed(avatar.seed);
                }}
                style={{
                  flexShrink: 0,
                  cursor: 'pointer',
                  borderRadius: T.radius.md,
                  overflow: 'hidden',
                  border: `2px solid transparent`,
                  transition: 'border-color 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = avatar.style.color}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
              >
                <AvatarPreview style={avatar.style} seed={avatar.seed} size={60} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarGenerator;
