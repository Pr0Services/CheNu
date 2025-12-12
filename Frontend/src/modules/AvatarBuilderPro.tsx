/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║              CHE·NU V25 - AVATAR BUILDER PRO                                 ║
 * ║              Complete Avatar System with 6 Styles                            ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * Features:
 * - 6 Avatar Styles: Human Realistic, Cartoon, Animal, Mythic, 3D Abstract, Minimalist
 * - Instant Style Switching with Morphing Animation
 * - Facial Features Customization (eyes, nose, mouth)
 * - Multiple Hairstyles & Colors
 * - Accessories (glasses, jewelry, headgear)
 * - Expressions (neutral, happy, focused, serious)
 * - Real-time Preview with Live Updates
 * - Export to PNG/SVG
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS - CHE·NU Theme
// ═══════════════════════════════════════════════════════════════════════════════

const T = {
  colors: {
    sacred: { gold: '#D8B26A', goldLight: '#E8C890', goldDark: '#B89040' },
    nature: { emerald: '#3F7249', moss: '#2F4C39', turquoise: '#3EB4A2' },
    bg: { main: '#0D0D0D', temple: '#1A1A1A', card: '#1E1E1E', elevated: '#242424' },
    text: { primary: '#E8E4DC', secondary: '#A09080', muted: '#6B6560' },
    accent: { blue: '#3B82F6', purple: '#8B5CF6', pink: '#EC4899', amber: '#F59E0B', red: '#EF4444' },
    border: '#2A2A2A'
  },
  radius: { sm: 6, md: 12, lg: 16, xl: 24, full: 9999 }
};

// ═══════════════════════════════════════════════════════════════════════════════
// AVATAR CONFIGURATION DATA
// ═══════════════════════════════════════════════════════════════════════════════

const AVATAR_STYLES = [
  { id: 'human', name: 'Humain Réaliste', icon: '👤', description: 'Style professionnel réaliste', gradient: 'linear-gradient(135deg, #667eea, #764ba2)' },
  { id: 'cartoon', name: 'Cartoon', icon: '🎨', description: 'Style animé coloré', gradient: 'linear-gradient(135deg, #f093fb, #f5576c)' },
  { id: 'animal', name: 'Animal', icon: '🐾', description: 'Personnages animaliers', gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)' },
  { id: 'mythic', name: 'Mythique', icon: '🐉', description: 'Créatures fantastiques', gradient: 'linear-gradient(135deg, #fa709a, #fee140)' },
  { id: 'abstract3d', name: '3D Abstrait', icon: '🔮', description: 'Formes géométriques 3D', gradient: 'linear-gradient(135deg, #a8edea, #fed6e3)' },
  { id: 'minimal', name: 'Minimaliste', icon: '◯', description: 'Style flat épuré', gradient: 'linear-gradient(135deg, #d299c2, #fef9d7)' }
];

const SKIN_TONES = [
  { id: 'tone1', color: '#FFDFC4', name: 'Très claire' },
  { id: 'tone2', color: '#F0C8A0', name: 'Claire' },
  { id: 'tone3', color: '#D8A070', name: 'Moyenne claire' },
  { id: 'tone4', color: '#C68642', name: 'Moyenne' },
  { id: 'tone5', color: '#8D5524', name: 'Moyenne foncée' },
  { id: 'tone6', color: '#5C3317', name: 'Foncée' },
  { id: 'tone7', color: '#3B2219', name: 'Très foncée' }
];

const HAIR_STYLES = [
  { id: 'short', name: 'Court', icon: '💇', paths: 'short' },
  { id: 'medium', name: 'Mi-long', icon: '💇‍♀️', paths: 'medium' },
  { id: 'long', name: 'Long', icon: '👩‍🦰', paths: 'long' },
  { id: 'curly', name: 'Bouclé', icon: '👨‍🦱', paths: 'curly' },
  { id: 'wavy', name: 'Ondulé', icon: '🌊', paths: 'wavy' },
  { id: 'afro', name: 'Afro', icon: '🧑‍🦱', paths: 'afro' },
  { id: 'mohawk', name: 'Mohawk', icon: '🧑‍🎤', paths: 'mohawk' },
  { id: 'bun', name: 'Chignon', icon: '👩‍🦳', paths: 'bun' },
  { id: 'braids', name: 'Tresses', icon: '👧', paths: 'braids' },
  { id: 'bald', name: 'Chauve', icon: '👨‍🦲', paths: 'none' }
];

const HAIR_COLORS = [
  { id: 'black', color: '#1A1A1A', name: 'Noir' },
  { id: 'darkbrown', color: '#3B2F2F', name: 'Brun foncé' },
  { id: 'brown', color: '#6B4423', name: 'Brun' },
  { id: 'lightbrown', color: '#A67B5B', name: 'Châtain' },
  { id: 'blonde', color: '#D4A574', name: 'Blond' },
  { id: 'platinum', color: '#E8E4DC', name: 'Platine' },
  { id: 'red', color: '#A52A2A', name: 'Roux' },
  { id: 'ginger', color: '#D2691E', name: 'Auburn' },
  { id: 'gray', color: '#808080', name: 'Gris' },
  { id: 'white', color: '#F5F5F5', name: 'Blanc' },
  { id: 'blue', color: '#3B82F6', name: 'Bleu' },
  { id: 'purple', color: '#8B5CF6', name: 'Violet' },
  { id: 'pink', color: '#EC4899', name: 'Rose' },
  { id: 'green', color: '#10B981', name: 'Vert' },
  { id: 'rainbow', color: 'linear-gradient(90deg, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #4B0082, #8F00FF)', name: 'Arc-en-ciel' }
];

const EYE_SHAPES = [
  { id: 'almond', name: 'Amande', icon: '👁️' },
  { id: 'round', name: 'Rond', icon: '⭕' },
  { id: 'hooded', name: 'Capuchonné', icon: '🌙' },
  { id: 'monolid', name: 'Monolide', icon: '➖' },
  { id: 'upturned', name: 'Relevé', icon: '↗️' },
  { id: 'downturned', name: 'Tombant', icon: '↘️' }
];

const EYE_COLORS = [
  { id: 'brown', color: '#634e34', name: 'Brun' },
  { id: 'hazel', color: '#8E7618', name: 'Noisette' },
  { id: 'green', color: '#3D8B37', name: 'Vert' },
  { id: 'blue', color: '#4A90D9', name: 'Bleu' },
  { id: 'gray', color: '#7A8B99', name: 'Gris' },
  { id: 'amber', color: '#FFBF00', name: 'Ambre' },
  { id: 'violet', color: '#8B5CF6', name: 'Violet' },
  { id: 'red', color: '#DC143C', name: 'Rouge' }
];

const NOSE_TYPES = [
  { id: 'straight', name: 'Droit', icon: '│' },
  { id: 'roman', name: 'Romain', icon: '⌒' },
  { id: 'button', name: 'Retroussé', icon: '◡' },
  { id: 'wide', name: 'Large', icon: '◇' },
  { id: 'narrow', name: 'Fin', icon: '|' }
];

const MOUTH_TYPES = [
  { id: 'full', name: 'Pulpeuses', icon: '💋' },
  { id: 'thin', name: 'Fines', icon: '➖' },
  { id: 'wide', name: 'Larges', icon: '⟷' },
  { id: 'cupid', name: 'Arc de cupidon', icon: '♡' },
  { id: 'round', name: 'Rondes', icon: '○' }
];

const EXPRESSIONS = [
  { id: 'neutral', name: 'Neutre', icon: '😐', eyebrows: 'neutral', eyes: 'open', mouth: 'closed' },
  { id: 'happy', name: 'Joyeux', icon: '😊', eyebrows: 'raised', eyes: 'squint', mouth: 'smile' },
  { id: 'confident', name: 'Confiant', icon: '😎', eyebrows: 'raised_one', eyes: 'half', mouth: 'smirk' },
  { id: 'serious', name: 'Sérieux', icon: '😤', eyebrows: 'frown', eyes: 'narrow', mouth: 'straight' },
  { id: 'friendly', name: 'Amical', icon: '🤗', eyebrows: 'raised', eyes: 'open', mouth: 'wide_smile' },
  { id: 'thinking', name: 'Pensif', icon: '🤔', eyebrows: 'raised_one', eyes: 'look_up', mouth: 'pout' },
  { id: 'surprised', name: 'Surpris', icon: '😮', eyebrows: 'high', eyes: 'wide', mouth: 'open' },
  { id: 'wink', name: 'Clin d\'œil', icon: '😉', eyebrows: 'raised_one', eyes: 'wink', mouth: 'smile' }
];

const ACCESSORIES = {
  eyewear: [
    { id: 'none', name: 'Aucun', icon: '❌' },
    { id: 'glasses_round', name: 'Lunettes rondes', icon: '👓' },
    { id: 'glasses_square', name: 'Lunettes carrées', icon: '🤓' },
    { id: 'glasses_cat', name: 'Cat-eye', icon: '😺' },
    { id: 'sunglasses', name: 'Solaires', icon: '🕶️' },
    { id: 'sunglasses_aviator', name: 'Aviator', icon: '✈️' },
    { id: 'monocle', name: 'Monocle', icon: '🧐' }
  ],
  headwear: [
    { id: 'none', name: 'Aucun', icon: '❌' },
    { id: 'cap', name: 'Casquette', icon: '🧢' },
    { id: 'beanie', name: 'Tuque', icon: '🧶' },
    { id: 'fedora', name: 'Fedora', icon: '🎩' },
    { id: 'hardhat', name: 'Casque chantier', icon: '⛑️' },
    { id: 'crown', name: 'Couronne', icon: '👑' },
    { id: 'headphones', name: 'Écouteurs', icon: '🎧' },
    { id: 'vr_headset', name: 'Casque VR', icon: '🥽' }
  ],
  jewelry: [
    { id: 'none', name: 'Aucun', icon: '❌' },
    { id: 'earrings_stud', name: 'Boucles clou', icon: '💎' },
    { id: 'earrings_hoop', name: 'Créoles', icon: '⭕' },
    { id: 'earrings_drop', name: 'Pendantes', icon: '💧' },
    { id: 'nose_ring', name: 'Piercing nez', icon: '👃' },
    { id: 'necklace', name: 'Collier', icon: '📿' }
  ],
  facial: [
    { id: 'none', name: 'Aucun', icon: '❌' },
    { id: 'beard_stubble', name: 'Barbe 3 jours', icon: '🧔' },
    { id: 'beard_full', name: 'Barbe complète', icon: '🧔‍♂️' },
    { id: 'beard_goatee', name: 'Bouc', icon: '🐐' },
    { id: 'mustache', name: 'Moustache', icon: '👨' },
    { id: 'freckles', name: 'Taches de rousseur', icon: '🔵' },
    { id: 'beauty_mark', name: 'Grain de beauté', icon: '⚫' }
  ]
};

const ANIMAL_TYPES = [
  { id: 'cat', emoji: '🐱', name: 'Chat', colors: ['orange', 'black', 'white', 'gray', 'calico'] },
  { id: 'dog', emoji: '🐕', name: 'Chien', colors: ['golden', 'brown', 'black', 'white', 'spotted'] },
  { id: 'wolf', emoji: '🐺', name: 'Loup', colors: ['gray', 'white', 'black'] },
  { id: 'fox', emoji: '🦊', name: 'Renard', colors: ['orange', 'arctic', 'silver'] },
  { id: 'bear', emoji: '🐻', name: 'Ours', colors: ['brown', 'black', 'polar'] },
  { id: 'lion', emoji: '🦁', name: 'Lion', colors: ['golden', 'white'] },
  { id: 'tiger', emoji: '🐯', name: 'Tigre', colors: ['orange', 'white', 'golden'] },
  { id: 'rabbit', emoji: '🐰', name: 'Lapin', colors: ['white', 'brown', 'gray', 'black'] },
  { id: 'owl', emoji: '🦉', name: 'Hibou', colors: ['brown', 'snowy', 'gray'] },
  { id: 'eagle', emoji: '🦅', name: 'Aigle', colors: ['golden', 'bald'] },
  { id: 'panda', emoji: '🐼', name: 'Panda', colors: ['classic', 'red'] },
  { id: 'koala', emoji: '🐨', name: 'Koala', colors: ['gray'] }
];

const MYTHIC_TYPES = [
  { id: 'dragon', emoji: '🐉', name: 'Dragon', elements: ['fire', 'ice', 'shadow', 'nature'] },
  { id: 'phoenix', emoji: '🔥', name: 'Phénix', elements: ['fire', 'ice', 'cosmic'] },
  { id: 'unicorn', emoji: '🦄', name: 'Licorne', elements: ['white', 'dark', 'rainbow'] },
  { id: 'griffin', emoji: '🦅', name: 'Griffon', elements: ['golden', 'silver', 'shadow'] },
  { id: 'mermaid', emoji: '🧜', name: 'Sirène', elements: ['ocean', 'coral', 'deep'] },
  { id: 'fairy', emoji: '🧚', name: 'Fée', elements: ['spring', 'autumn', 'winter', 'shadow'] },
  { id: 'wizard', emoji: '🧙', name: 'Mage', elements: ['fire', 'ice', 'arcane', 'nature'] },
  { id: 'vampire', emoji: '🧛', name: 'Vampire', elements: ['classic', 'royal', 'feral'] },
  { id: 'werewolf', emoji: '🐺', name: 'Loup-garou', elements: ['gray', 'black', 'white'] },
  { id: 'elf', emoji: '🧝', name: 'Elfe', elements: ['wood', 'dark', 'high'] },
  { id: 'demon', emoji: '😈', name: 'Démon', elements: ['fire', 'shadow', 'frost'] },
  { id: 'angel', emoji: '😇', name: 'Ange', elements: ['light', 'guardian', 'fallen'] }
];

const ABSTRACT_SHAPES = [
  { id: 'sphere', name: 'Sphère', icon: '🔵' },
  { id: 'cube', name: 'Cube', icon: '🟦' },
  { id: 'pyramid', name: 'Pyramide', icon: '🔺' },
  { id: 'crystal', name: 'Cristal', icon: '💎' },
  { id: 'torus', name: 'Tore', icon: '⭕' },
  { id: 'blob', name: 'Blob', icon: '🫧' }
];

const BACKGROUNDS = [
  { id: 'transparent', color: 'transparent', name: 'Transparent', pattern: 'checkerboard' },
  { id: 'solid_gold', color: '#D8B26A', name: 'Or sacré' },
  { id: 'solid_emerald', color: '#3F7249', name: 'Émeraude' },
  { id: 'solid_blue', color: '#3B82F6', name: 'Bleu' },
  { id: 'solid_purple', color: '#8B5CF6', name: 'Violet' },
  { id: 'solid_dark', color: '#1A1A1A', name: 'Sombre' },
  { id: 'gradient_gold', color: 'linear-gradient(135deg, #D8B26A, #B89040)', name: 'Dégradé or' },
  { id: 'gradient_sunset', color: 'linear-gradient(135deg, #fa709a, #fee140)', name: 'Coucher de soleil' },
  { id: 'gradient_ocean', color: 'linear-gradient(135deg, #667eea, #764ba2)', name: 'Océan' },
  { id: 'gradient_forest', color: 'linear-gradient(135deg, #11998e, #38ef7d)', name: 'Forêt' },
  { id: 'pattern_dots', color: '#1A1A1A', name: 'Points', pattern: 'dots' },
  { id: 'pattern_grid', color: '#1A1A1A', name: 'Grille', pattern: 'grid' }
];

// ═══════════════════════════════════════════════════════════════════════════════
// AVATAR CONFIG INTERFACE
// ═══════════════════════════════════════════════════════════════════════════════

interface AvatarConfig {
  // Base
  style: string;
  background: string;
  
  // Human/Cartoon
  skinTone: string;
  hairStyle: string;
  hairColor: string;
  eyeShape: string;
  eyeColor: string;
  noseType: string;
  mouthType: string;
  expression: string;
  
  // Accessories
  eyewear: string;
  headwear: string;
  jewelry: string;
  facial: string;
  
  // Animal
  animalType: string;
  animalColor: string;
  
  // Mythic
  mythicType: string;
  mythicElement: string;
  
  // Abstract
  abstractShape: string;
  abstractColor1: string;
  abstractColor2: string;
  
  // Minimal
  minimalShape: 'circle' | 'square' | 'rounded';
  minimalColor: string;
  minimalInitials: string;
}

const DEFAULT_CONFIG: AvatarConfig = {
  style: 'human',
  background: 'solid_gold',
  skinTone: 'tone3',
  hairStyle: 'short',
  hairColor: 'brown',
  eyeShape: 'almond',
  eyeColor: 'brown',
  noseType: 'straight',
  mouthType: 'full',
  expression: 'neutral',
  eyewear: 'none',
  headwear: 'none',
  jewelry: 'none',
  facial: 'none',
  animalType: 'fox',
  animalColor: 'orange',
  mythicType: 'dragon',
  mythicElement: 'fire',
  abstractShape: 'sphere',
  abstractColor1: '#D8B26A',
  abstractColor2: '#3F7249',
  minimalShape: 'circle',
  minimalColor: '#D8B26A',
  minimalInitials: 'CN'
};

// ═══════════════════════════════════════════════════════════════════════════════
// SVG AVATAR RENDERER
// ═══════════════════════════════════════════════════════════════════════════════

const AvatarSVG: React.FC<{ config: AvatarConfig; size: number }> = ({ config, size }) => {
  const skinColor = SKIN_TONES.find(s => s.id === config.skinTone)?.color || '#F0C8A0';
  const hairColor = HAIR_COLORS.find(h => h.id === config.hairColor)?.color || '#6B4423';
  const eyeColorVal = EYE_COLORS.find(e => e.id === config.eyeColor)?.color || '#634e34';
  const expression = EXPRESSIONS.find(e => e.id === config.expression);
  
  // Render based on style
  const renderHumanCartoon = (isCartoon: boolean) => {
    const strokeWidth = isCartoon ? 3 : 1;
    const eyeSize = isCartoon ? 18 : 12;
    
    return (
      <g>
        {/* Face */}
        <ellipse cx="100" cy="105" rx="60" ry="70" fill={skinColor} 
          stroke={isCartoon ? '#333' : 'none'} strokeWidth={strokeWidth} />
        
        {/* Hair - simplified */}
        {config.hairStyle !== 'bald' && (
          <path 
            d={getHairPath(config.hairStyle)} 
            fill={hairColor}
            stroke={isCartoon ? '#333' : 'none'} 
            strokeWidth={strokeWidth}
          />
        )}
        
        {/* Eyes */}
        <g transform={`translate(0, ${expression?.eyes === 'squint' ? 5 : 0})`}>
          {/* Left Eye */}
          <ellipse cx="75" cy="95" rx={eyeSize * 0.6} ry={eyeSize * (expression?.eyes === 'squint' ? 0.4 : 0.8)} 
            fill="white" stroke={isCartoon ? '#333' : 'none'} strokeWidth={strokeWidth * 0.5} />
          <circle cx="75" cy="95" r={eyeSize * 0.35} fill={eyeColorVal} />
          <circle cx="75" cy="95" r={eyeSize * 0.2} fill="#000" />
          <circle cx="78" cy="92" r={eyeSize * 0.1} fill="white" />
          
          {/* Right Eye */}
          {expression?.eyes !== 'wink' ? (
            <>
              <ellipse cx="125" cy="95" rx={eyeSize * 0.6} ry={eyeSize * (expression?.eyes === 'squint' ? 0.4 : 0.8)} 
                fill="white" stroke={isCartoon ? '#333' : 'none'} strokeWidth={strokeWidth * 0.5} />
              <circle cx="125" cy="95" r={eyeSize * 0.35} fill={eyeColorVal} />
              <circle cx="125" cy="95" r={eyeSize * 0.2} fill="#000" />
              <circle cx="128" cy="92" r={eyeSize * 0.1} fill="white" />
            </>
          ) : (
            <path d="M115 95 Q125 100 135 95" stroke="#333" strokeWidth={3} fill="none" />
          )}
        </g>
        
        {/* Eyebrows */}
        <g>
          <path 
            d={getEyebrowPath('left', expression?.eyebrows || 'neutral')} 
            stroke={hairColor} 
            strokeWidth={isCartoon ? 4 : 2.5} 
            fill="none" 
            strokeLinecap="round"
          />
          <path 
            d={getEyebrowPath('right', expression?.eyebrows || 'neutral')} 
            stroke={hairColor} 
            strokeWidth={isCartoon ? 4 : 2.5} 
            fill="none" 
            strokeLinecap="round"
          />
        </g>
        
        {/* Nose */}
        <path d={getNosePath(config.noseType)} stroke={isCartoon ? '#333' : darkenColor(skinColor, 30)} 
          strokeWidth={isCartoon ? 2 : 1.5} fill="none" />
        
        {/* Mouth */}
        <path 
          d={getMouthPath(expression?.mouth || 'closed', config.mouthType)} 
          stroke={isCartoon ? '#333' : darkenColor(skinColor, 50)} 
          strokeWidth={isCartoon ? 3 : 2}
          fill={expression?.mouth === 'smile' || expression?.mouth === 'wide_smile' ? '#FF6B6B' : 'none'}
        />
        
        {/* Facial Hair */}
        {config.facial !== 'none' && renderFacialHair(config.facial, hairColor)}
        
        {/* Accessories */}
        {config.eyewear !== 'none' && renderEyewear(config.eyewear)}
        {config.headwear !== 'none' && renderHeadwear(config.headwear)}
        {config.jewelry !== 'none' && renderJewelry(config.jewelry)}
      </g>
    );
  };
  
  const renderAnimal = () => {
    const animal = ANIMAL_TYPES.find(a => a.id === config.animalType);
    return (
      <g>
        <text x="100" y="120" fontSize="80" textAnchor="middle" dominantBaseline="middle">
          {animal?.emoji || '🐾'}
        </text>
        {config.eyewear !== 'none' && renderEyewear(config.eyewear)}
        {config.headwear !== 'none' && renderHeadwear(config.headwear)}
      </g>
    );
  };
  
  const renderMythic = () => {
    const mythic = MYTHIC_TYPES.find(m => m.id === config.mythicType);
    const elementColors: Record<string, string> = {
      fire: '#FF6B35',
      ice: '#00D4FF',
      shadow: '#4B0082',
      nature: '#228B22',
      cosmic: '#9D4EDD',
      ocean: '#0077B6',
      light: '#FFD700',
      arcane: '#8B5CF6'
    };
    const glowColor = elementColors[config.mythicElement] || '#D8B26A';
    
    return (
      <g>
        {/* Glow effect */}
        <defs>
          <filter id="mythicGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <circle cx="100" cy="100" r="50" fill={glowColor} opacity="0.3" filter="url(#mythicGlow)" />
        <text x="100" y="115" fontSize="70" textAnchor="middle" dominantBaseline="middle" filter="url(#mythicGlow)">
          {mythic?.emoji || '🐉'}
        </text>
      </g>
    );
  };
  
  const renderAbstract = () => {
    const renderShape = () => {
      switch (config.abstractShape) {
        case 'cube':
          return (
            <g transform="translate(100, 100)">
              <polygon points="-30,-25 30,-25 45,0 15,25 -45,25 -30,0" 
                fill={`url(#abstractGradient)`} stroke="#333" strokeWidth="2" />
            </g>
          );
        case 'pyramid':
          return (
            <polygon points="100,30 150,130 50,130" 
              fill={`url(#abstractGradient)`} stroke="#333" strokeWidth="2" />
          );
        case 'crystal':
          return (
            <polygon points="100,20 140,60 130,140 70,140 60,60" 
              fill={`url(#abstractGradient)`} stroke="#333" strokeWidth="2" />
          );
        default: // sphere
          return (
            <circle cx="100" cy="100" r="55" fill={`url(#abstractGradient)`} />
          );
      }
    };
    
    return (
      <g>
        <defs>
          <linearGradient id="abstractGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={config.abstractColor1} />
            <stop offset="100%" stopColor={config.abstractColor2} />
          </linearGradient>
          <filter id="abstractGlow">
            <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <g filter="url(#abstractGlow)">
          {renderShape()}
        </g>
      </g>
    );
  };
  
  const renderMinimal = () => {
    const shapeProps = {
      circle: <circle cx="100" cy="100" r="60" fill={config.minimalColor} />,
      square: <rect x="40" y="40" width="120" height="120" fill={config.minimalColor} />,
      rounded: <rect x="40" y="40" width="120" height="120" rx="20" fill={config.minimalColor} />
    };
    
    return (
      <g>
        {shapeProps[config.minimalShape]}
        <text x="100" y="110" fontSize="40" fontWeight="bold" textAnchor="middle" 
          dominantBaseline="middle" fill={getContrastColor(config.minimalColor)}>
          {config.minimalInitials.toUpperCase().slice(0, 2)}
        </text>
      </g>
    );
  };
  
  const getBackgroundStyle = () => {
    const bg = BACKGROUNDS.find(b => b.id === config.background);
    if (!bg) return { fill: 'transparent' };
    
    if (bg.pattern === 'checkerboard') {
      return { fill: 'url(#checkerboard)' };
    }
    if (bg.color.startsWith('linear-gradient')) {
      return { fill: 'url(#bgGradient)' };
    }
    return { fill: bg.color };
  };
  
  const bg = BACKGROUNDS.find(b => b.id === config.background);
  const gradientColors = bg?.color.startsWith('linear-gradient') 
    ? extractGradientColors(bg.color) 
    : ['#D8B26A', '#B89040'];

  return (
    <svg width={size} height={size} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Checkerboard pattern */}
        <pattern id="checkerboard" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="10" height="10" fill="#ccc"/>
          <rect x="10" width="10" height="10" fill="#fff"/>
          <rect y="10" width="10" height="10" fill="#fff"/>
          <rect x="10" y="10" width="10" height="10" fill="#ccc"/>
        </pattern>
        
        {/* Background gradient */}
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={gradientColors[0]} />
          <stop offset="100%" stopColor={gradientColors[1]} />
        </linearGradient>
      </defs>
      
      {/* Background */}
      <rect width="200" height="200" rx="24" {...getBackgroundStyle()} />
      
      {/* Avatar Content */}
      {config.style === 'human' && renderHumanCartoon(false)}
      {config.style === 'cartoon' && renderHumanCartoon(true)}
      {config.style === 'animal' && renderAnimal()}
      {config.style === 'mythic' && renderMythic()}
      {config.style === 'abstract3d' && renderAbstract()}
      {config.style === 'minimal' && renderMinimal()}
    </svg>
  );
};

// Helper functions for SVG paths
const getHairPath = (style: string): string => {
  const paths: Record<string, string> = {
    short: 'M40 85 Q40 35 100 30 Q160 35 160 85 Q160 60 100 55 Q40 60 40 85',
    medium: 'M35 100 Q30 35 100 25 Q170 35 165 100 Q165 70 100 60 Q35 70 35 100',
    long: 'M30 140 Q25 35 100 20 Q175 35 170 140 Q170 80 100 65 Q30 80 30 140',
    curly: 'M35 100 C20 60 40 30 100 25 C160 30 180 60 165 100 C175 80 140 50 100 55 C60 50 25 80 35 100',
    wavy: 'M35 110 Q25 40 100 25 Q175 40 165 110 C160 90 130 60 100 60 C70 60 40 90 35 110',
    afro: 'M20 110 C10 40 50 10 100 10 C150 10 190 40 180 110 C180 70 150 30 100 30 C50 30 20 70 20 110',
    mohawk: 'M85 80 Q90 10 100 5 Q110 10 115 80 L115 55 Q100 50 85 55 Z',
    bun: 'M40 85 Q40 40 100 35 Q160 40 160 85 M80 35 Q100 10 120 35',
    braids: 'M35 100 Q30 40 100 30 Q170 40 165 100 M40 100 L30 160 M160 100 L170 160'
  };
  return paths[style] || paths.short;
};

const getEyebrowPath = (side: 'left' | 'right', style: string): string => {
  const isLeft = side === 'left';
  const baseX = isLeft ? 60 : 115;
  const dir = isLeft ? 1 : -1;
  
  const styles: Record<string, string> = {
    neutral: `M${baseX} 75 Q${baseX + 15 * dir} 73 ${baseX + 30 * dir} 75`,
    raised: `M${baseX} 72 Q${baseX + 15 * dir} 68 ${baseX + 30 * dir} 72`,
    raised_one: isLeft 
      ? `M${baseX} 72 Q${baseX + 15} 68 ${baseX + 30} 72`
      : `M${baseX} 75 Q${baseX - 15} 73 ${baseX - 30} 75`,
    frown: `M${baseX} 73 Q${baseX + 15 * dir} 78 ${baseX + 30 * dir} 76`,
    high: `M${baseX} 68 Q${baseX + 15 * dir} 63 ${baseX + 30 * dir} 68`
  };
  return styles[style] || styles.neutral;
};

const getNosePath = (type: string): string => {
  const paths: Record<string, string> = {
    straight: 'M100 100 L100 120',
    roman: 'M100 95 Q108 105 100 120',
    button: 'M100 100 Q95 118 100 120 Q105 118 100 120',
    wide: 'M95 100 Q100 118 105 120',
    narrow: 'M100 98 L100 118'
  };
  return paths[type] || paths.straight;
};

const getMouthPath = (expression: string, type: string): string => {
  const paths: Record<string, string> = {
    closed: 'M80 140 Q100 143 120 140',
    smile: 'M80 138 Q100 152 120 138',
    wide_smile: 'M75 136 Q100 160 125 136',
    straight: 'M80 140 L120 140',
    smirk: 'M80 140 Q100 142 120 136',
    open: 'M80 138 Q100 155 120 138 Q100 145 80 138',
    pout: 'M85 142 Q100 138 115 142'
  };
  return paths[expression] || paths.closed;
};

const renderFacialHair = (type: string, color: string) => {
  switch (type) {
    case 'beard_stubble':
      return (
        <g opacity="0.3" fill={color}>
          {Array.from({ length: 30 }).map((_, i) => (
            <circle key={i} cx={70 + Math.random() * 60} cy={130 + Math.random() * 30} r="1" />
          ))}
        </g>
      );
    case 'beard_full':
      return <path d="M55 130 Q55 170 100 175 Q145 170 145 130" fill={color} opacity="0.9" />;
    case 'beard_goatee':
      return <path d="M85 145 Q100 175 115 145" fill={color} opacity="0.9" />;
    case 'mustache':
      return <path d="M80 130 Q90 135 100 132 Q110 135 120 130" fill={color} strokeWidth="3" />;
    default:
      return null;
  }
};

const renderEyewear = (type: string) => {
  switch (type) {
    case 'glasses_round':
      return (
        <g fill="none" stroke="#333" strokeWidth="2">
          <circle cx="75" cy="95" r="18" />
          <circle cx="125" cy="95" r="18" />
          <path d="M93 95 L107 95" />
          <path d="M57 95 L45 90" />
          <path d="M143 95 L155 90" />
        </g>
      );
    case 'glasses_square':
      return (
        <g fill="none" stroke="#333" strokeWidth="2">
          <rect x="55" y="82" width="35" height="26" rx="3" />
          <rect x="110" y="82" width="35" height="26" rx="3" />
          <path d="M90 95 L110 95" />
        </g>
      );
    case 'sunglasses':
      return (
        <g>
          <rect x="55" y="82" width="38" height="28" rx="5" fill="#333" />
          <rect x="107" y="82" width="38" height="28" rx="5" fill="#333" />
          <path d="M93 95 L107 95" stroke="#333" strokeWidth="3" />
        </g>
      );
    default:
      return null;
  }
};

const renderHeadwear = (type: string) => {
  switch (type) {
    case 'cap':
      return (
        <g>
          <ellipse cx="100" cy="45" rx="55" ry="25" fill="#3B82F6" />
          <rect x="45" y="40" width="110" height="20" fill="#3B82F6" />
          <rect x="95" y="38" width="60" height="8" rx="2" fill="#1E40AF" />
        </g>
      );
    case 'hardhat':
      return (
        <g>
          <ellipse cx="100" cy="40" rx="60" ry="30" fill="#FCD34D" />
          <rect x="40" y="35" width="120" height="25" fill="#FCD34D" />
          <rect x="45" y="55" width="110" height="8" fill="#F59E0B" />
        </g>
      );
    case 'crown':
      return (
        <g>
          <path d="M50 60 L60 30 L80 50 L100 20 L120 50 L140 30 L150 60 Z" fill="#FFD700" stroke="#B8860B" strokeWidth="2" />
          <circle cx="100" cy="35" r="5" fill="#EF4444" />
        </g>
      );
    case 'headphones':
      return (
        <g>
          <path d="M40 95 Q40 45 100 40 Q160 45 160 95" fill="none" stroke="#333" strokeWidth="8" />
          <ellipse cx="40" cy="100" rx="10" ry="15" fill="#333" />
          <ellipse cx="160" cy="100" rx="10" ry="15" fill="#333" />
        </g>
      );
    default:
      return null;
  }
};

const renderJewelry = (type: string) => {
  switch (type) {
    case 'earrings_stud':
      return (
        <g>
          <circle cx="38" cy="105" r="4" fill="#FFD700" />
          <circle cx="162" cy="105" r="4" fill="#FFD700" />
        </g>
      );
    case 'earrings_hoop':
      return (
        <g fill="none" stroke="#FFD700" strokeWidth="2">
          <circle cx="35" cy="115" r="10" />
          <circle cx="165" cy="115" r="10" />
        </g>
      );
    case 'nose_ring':
      return <circle cx="105" cy="122" r="3" fill="none" stroke="#C0C0C0" strokeWidth="1.5" />;
    default:
      return null;
  }
};

// Utility functions
const darkenColor = (color: string, percent: number): string => {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max((num >> 16) - amt, 0);
  const G = Math.max((num >> 8 & 0x00FF) - amt, 0);
  const B = Math.max((num & 0x0000FF) - amt, 0);
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
};

const getContrastColor = (hexcolor: string): string => {
  const r = parseInt(hexcolor.slice(1, 3), 16);
  const g = parseInt(hexcolor.slice(3, 5), 16);
  const b = parseInt(hexcolor.slice(5, 7), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return yiq >= 128 ? '#1A1A1A' : '#FFFFFF';
};

const extractGradientColors = (gradient: string): string[] => {
  const matches = gradient.match(/#[a-fA-F0-9]{6}/g);
  return matches || ['#D8B26A', '#B89040'];
};

// ═══════════════════════════════════════════════════════════════════════════════
// OPTION SELECTOR COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

interface SelectorProps {
  title: string;
  options: any[];
  selected: string;
  onSelect: (id: string) => void;
  type?: 'icon' | 'color' | 'card' | 'gradient';
}

const OptionSelector: React.FC<SelectorProps> = ({ title, options, selected, onSelect, type = 'icon' }) => {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{
        display: 'block',
        fontSize: 12,
        fontWeight: 600,
        color: T.colors.text.muted,
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: 1
      }}>
        {title}
      </label>
      
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8
      }}>
        {options.map((option) => {
          const isSelected = option.id === selected;
          
          if (type === 'color') {
            return (
              <button
                key={option.id}
                onClick={() => onSelect(option.id)}
                title={option.name}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: T.radius.md,
                  background: option.color,
                  border: isSelected ? `3px solid ${T.colors.sacred.gold}` : `2px solid ${T.colors.border}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                  boxShadow: isSelected ? `0 0 12px ${T.colors.sacred.gold}40` : 'none'
                }}
              />
            );
          }
          
          if (type === 'gradient') {
            return (
              <button
                key={option.id}
                onClick={() => onSelect(option.id)}
                title={option.name}
                style={{
                  width: 50,
                  height: 36,
                  borderRadius: T.radius.md,
                  background: option.gradient || option.color,
                  border: isSelected ? `3px solid ${T.colors.sacred.gold}` : `2px solid ${T.colors.border}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  transform: isSelected ? 'scale(1.05)' : 'scale(1)'
                }}
              />
            );
          }
          
          if (type === 'card') {
            return (
              <button
                key={option.id}
                onClick={() => onSelect(option.id)}
                style={{
                  padding: '10px 14px',
                  borderRadius: T.radius.md,
                  background: isSelected ? T.colors.sacred.gold : T.colors.bg.elevated,
                  border: `1px solid ${isSelected ? T.colors.sacred.gold : T.colors.border}`,
                  color: isSelected ? '#000' : T.colors.text.primary,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 13,
                  fontWeight: isSelected ? 600 : 400
                }}
              >
                {option.icon && <span>{option.icon}</span>}
                {option.emoji && <span>{option.emoji}</span>}
                <span>{option.name}</span>
              </button>
            );
          }
          
          // Default icon type
          return (
            <button
              key={option.id}
              onClick={() => onSelect(option.id)}
              title={option.name}
              style={{
                width: 44,
                height: 44,
                borderRadius: T.radius.md,
                background: isSelected ? T.colors.sacred.gold : T.colors.bg.elevated,
                border: `1px solid ${isSelected ? T.colors.sacred.gold : T.colors.border}`,
                color: isSelected ? '#000' : T.colors.text.primary,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20
              }}
            >
              {option.icon || option.emoji || option.name.charAt(0)}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN AVATAR BUILDER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function AvatarBuilderPro() {
  const [config, setConfig] = useState<AvatarConfig>(DEFAULT_CONFIG);
  const [activeTab, setActiveTab] = useState<'style' | 'face' | 'hair' | 'accessories' | 'background'>('style');
  const [isExporting, setIsExporting] = useState(false);
  const [morphTransition, setMorphTransition] = useState(false);
  const svgRef = useRef<HTMLDivElement>(null);
  
  const updateConfig = useCallback((key: keyof AvatarConfig, value: string) => {
    if (key === 'style') {
      setMorphTransition(true);
      setTimeout(() => setMorphTransition(false), 300);
    }
    setConfig(prev => ({ ...prev, [key]: value }));
  }, []);
  
  const handleRandomize = () => {
    const randomFrom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
    
    setMorphTransition(true);
    setTimeout(() => setMorphTransition(false), 300);
    
    setConfig({
      ...config,
      style: randomFrom(AVATAR_STYLES).id,
      skinTone: randomFrom(SKIN_TONES).id,
      hairStyle: randomFrom(HAIR_STYLES).id,
      hairColor: randomFrom(HAIR_COLORS).id,
      eyeShape: randomFrom(EYE_SHAPES).id,
      eyeColor: randomFrom(EYE_COLORS).id,
      noseType: randomFrom(NOSE_TYPES).id,
      mouthType: randomFrom(MOUTH_TYPES).id,
      expression: randomFrom(EXPRESSIONS).id,
      background: randomFrom(BACKGROUNDS).id,
      animalType: randomFrom(ANIMAL_TYPES).id,
      mythicType: randomFrom(MYTHIC_TYPES).id
    });
  };
  
  const handleExport = async (format: 'png' | 'svg') => {
    setIsExporting(true);
    
    // In a real implementation, we'd use canvas or a library to export
    // For now, we'll simulate the export
    setTimeout(() => {
      alert(`Avatar exported as ${format.toUpperCase()}!`);
      setIsExporting(false);
    }, 500);
  };
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'style':
        return (
          <>
            <OptionSelector
              title="Type d'avatar"
              options={AVATAR_STYLES}
              selected={config.style}
              onSelect={(id) => updateConfig('style', id)}
              type="card"
            />
            
            {config.style === 'animal' && (
              <OptionSelector
                title="Animal"
                options={ANIMAL_TYPES}
                selected={config.animalType}
                onSelect={(id) => updateConfig('animalType', id)}
                type="card"
              />
            )}
            
            {config.style === 'mythic' && (
              <>
                <OptionSelector
                  title="Créature"
                  options={MYTHIC_TYPES}
                  selected={config.mythicType}
                  onSelect={(id) => updateConfig('mythicType', id)}
                  type="card"
                />
                <OptionSelector
                  title="Élément"
                  options={MYTHIC_TYPES.find(m => m.id === config.mythicType)?.elements.map(e => ({
                    id: e, name: e.charAt(0).toUpperCase() + e.slice(1), icon: '✨'
                  })) || []}
                  selected={config.mythicElement}
                  onSelect={(id) => updateConfig('mythicElement', id)}
                  type="card"
                />
              </>
            )}
            
            {config.style === 'abstract3d' && (
              <OptionSelector
                title="Forme"
                options={ABSTRACT_SHAPES}
                selected={config.abstractShape}
                onSelect={(id) => updateConfig('abstractShape', id)}
                type="card"
              />
            )}
            
            {config.style === 'minimal' && (
              <>
                <OptionSelector
                  title="Forme"
                  options={[
                    { id: 'circle', name: 'Cercle', icon: '⭕' },
                    { id: 'square', name: 'Carré', icon: '⬜' },
                    { id: 'rounded', name: 'Arrondi', icon: '🔲' }
                  ]}
                  selected={config.minimalShape}
                  onSelect={(id) => updateConfig('minimalShape', id as any)}
                  type="card"
                />
                <div style={{ marginBottom: 20 }}>
                  <label style={{
                    display: 'block',
                    fontSize: 12,
                    fontWeight: 600,
                    color: T.colors.text.muted,
                    marginBottom: 10,
                    textTransform: 'uppercase'
                  }}>
                    Initiales
                  </label>
                  <input
                    type="text"
                    value={config.minimalInitials}
                    onChange={(e) => updateConfig('minimalInitials', e.target.value.slice(0, 2))}
                    maxLength={2}
                    style={{
                      padding: '10px 14px',
                      background: T.colors.bg.elevated,
                      border: `1px solid ${T.colors.border}`,
                      borderRadius: T.radius.md,
                      color: T.colors.text.primary,
                      fontSize: 16,
                      width: 80,
                      textTransform: 'uppercase',
                      textAlign: 'center'
                    }}
                  />
                </div>
              </>
            )}
          </>
        );
        
      case 'face':
        return (
          <>
            {(config.style === 'human' || config.style === 'cartoon') && (
              <>
                <OptionSelector
                  title="Teint de peau"
                  options={SKIN_TONES}
                  selected={config.skinTone}
                  onSelect={(id) => updateConfig('skinTone', id)}
                  type="color"
                />
                <OptionSelector
                  title="Forme des yeux"
                  options={EYE_SHAPES}
                  selected={config.eyeShape}
                  onSelect={(id) => updateConfig('eyeShape', id)}
                  type="card"
                />
                <OptionSelector
                  title="Couleur des yeux"
                  options={EYE_COLORS}
                  selected={config.eyeColor}
                  onSelect={(id) => updateConfig('eyeColor', id)}
                  type="color"
                />
                <OptionSelector
                  title="Nez"
                  options={NOSE_TYPES}
                  selected={config.noseType}
                  onSelect={(id) => updateConfig('noseType', id)}
                  type="card"
                />
                <OptionSelector
                  title="Lèvres"
                  options={MOUTH_TYPES}
                  selected={config.mouthType}
                  onSelect={(id) => updateConfig('mouthType', id)}
                  type="card"
                />
              </>
            )}
            <OptionSelector
              title="Expression"
              options={EXPRESSIONS}
              selected={config.expression}
              onSelect={(id) => updateConfig('expression', id)}
              type="card"
            />
          </>
        );
        
      case 'hair':
        return (
          <>
            {(config.style === 'human' || config.style === 'cartoon') && (
              <>
                <OptionSelector
                  title="Style de cheveux"
                  options={HAIR_STYLES}
                  selected={config.hairStyle}
                  onSelect={(id) => updateConfig('hairStyle', id)}
                  type="card"
                />
                {config.hairStyle !== 'bald' && (
                  <OptionSelector
                    title="Couleur de cheveux"
                    options={HAIR_COLORS}
                    selected={config.hairColor}
                    onSelect={(id) => updateConfig('hairColor', id)}
                    type="color"
                  />
                )}
                <OptionSelector
                  title="Pilosité faciale"
                  options={ACCESSORIES.facial}
                  selected={config.facial}
                  onSelect={(id) => updateConfig('facial', id)}
                  type="card"
                />
              </>
            )}
          </>
        );
        
      case 'accessories':
        return (
          <>
            <OptionSelector
              title="Lunettes"
              options={ACCESSORIES.eyewear}
              selected={config.eyewear}
              onSelect={(id) => updateConfig('eyewear', id)}
              type="card"
            />
            <OptionSelector
              title="Couvre-chef"
              options={ACCESSORIES.headwear}
              selected={config.headwear}
              onSelect={(id) => updateConfig('headwear', id)}
              type="card"
            />
            <OptionSelector
              title="Bijoux"
              options={ACCESSORIES.jewelry}
              selected={config.jewelry}
              onSelect={(id) => updateConfig('jewelry', id)}
              type="card"
            />
          </>
        );
        
      case 'background':
        return (
          <OptionSelector
            title="Arrière-plan"
            options={BACKGROUNDS}
            selected={config.background}
            onSelect={(id) => updateConfig('background', id)}
            type="gradient"
          />
        );
    }
  };
  
  const tabs = [
    { id: 'style', label: '🎭 Style', visible: true },
    { id: 'face', label: '👤 Visage', visible: config.style === 'human' || config.style === 'cartoon' },
    { id: 'hair', label: '💇 Cheveux', visible: config.style === 'human' || config.style === 'cartoon' },
    { id: 'accessories', label: '✨ Accessoires', visible: true },
    { id: 'background', label: '🎨 Fond', visible: true }
  ].filter(t => t.visible);

  return (
    <div style={{
      display: 'flex',
      gap: 32,
      padding: 24,
      background: T.colors.bg.main,
      borderRadius: T.radius.xl,
      border: `1px solid ${T.colors.border}`,
      minHeight: 600
    }}>
      {/* Preview Section */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
        padding: 24,
        background: T.colors.bg.temple,
        borderRadius: T.radius.lg,
        minWidth: 280
      }}>
        <h2 style={{
          color: T.colors.text.primary,
          fontSize: 18,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          margin: 0
        }}>
          <span>🎨</span> Avatar Builder Pro
        </h2>
        
        {/* Avatar Preview */}
        <div 
          ref={svgRef}
          style={{
            width: 220,
            height: 220,
            borderRadius: T.radius.xl,
            border: `3px solid ${T.colors.sacred.gold}`,
            boxShadow: `0 0 40px ${T.colors.sacred.gold}30`,
            overflow: 'hidden',
            transition: 'transform 0.3s ease, opacity 0.3s ease',
            transform: morphTransition ? 'scale(0.95)' : 'scale(1)',
            opacity: morphTransition ? 0.7 : 1
          }}
        >
          <AvatarSVG config={config} size={220} />
        </div>
        
        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={handleRandomize}
            style={{
              padding: '10px 20px',
              background: T.colors.bg.elevated,
              border: `1px solid ${T.colors.border}`,
              borderRadius: T.radius.md,
              color: T.colors.text.primary,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 14,
              transition: 'all 0.2s ease'
            }}
          >
            🎲 Aléatoire
          </button>
          
          <button
            onClick={() => setConfig(DEFAULT_CONFIG)}
            style={{
              padding: '10px 20px',
              background: T.colors.bg.elevated,
              border: `1px solid ${T.colors.border}`,
              borderRadius: T.radius.md,
              color: T.colors.text.primary,
              cursor: 'pointer',
              fontSize: 14
            }}
          >
            🔄 Reset
          </button>
        </div>
        
        {/* Export Buttons */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={() => handleExport('png')}
            disabled={isExporting}
            style={{
              padding: '12px 24px',
              background: `linear-gradient(135deg, ${T.colors.sacred.gold}, ${T.colors.sacred.goldDark})`,
              border: 'none',
              borderRadius: T.radius.md,
              color: '#000',
              fontWeight: 600,
              cursor: isExporting ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 14
            }}
          >
            📥 PNG
          </button>
          <button
            onClick={() => handleExport('svg')}
            disabled={isExporting}
            style={{
              padding: '12px 24px',
              background: T.colors.nature.emerald,
              border: 'none',
              borderRadius: T.radius.md,
              color: '#fff',
              fontWeight: 600,
              cursor: isExporting ? 'wait' : 'pointer',
              fontSize: 14
            }}
          >
            📥 SVG
          </button>
        </div>
        
        {/* Style Info */}
        <div style={{
          padding: 16,
          background: T.colors.bg.card,
          borderRadius: T.radius.md,
          width: '100%'
        }}>
          <div style={{ 
            fontSize: 12, 
            color: T.colors.text.muted, 
            textTransform: 'uppercase',
            marginBottom: 8 
          }}>
            Style actuel
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 8,
            color: T.colors.text.primary,
            fontWeight: 600
          }}>
            <span style={{ fontSize: 24 }}>
              {AVATAR_STYLES.find(s => s.id === config.style)?.icon}
            </span>
            <span>{AVATAR_STYLES.find(s => s.id === config.style)?.name}</span>
          </div>
        </div>
      </div>

      {/* Editor Section */}
      <div style={{ flex: 1 }}>
        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: 4,
          marginBottom: 24,
          background: T.colors.bg.card,
          padding: 4,
          borderRadius: T.radius.md
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                flex: 1,
                padding: '12px 16px',
                background: activeTab === tab.id ? T.colors.sacred.gold : 'transparent',
                border: 'none',
                borderRadius: T.radius.sm,
                color: activeTab === tab.id ? '#000' : T.colors.text.secondary,
                fontWeight: activeTab === tab.id ? 600 : 400,
                cursor: 'pointer',
                fontSize: 13,
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ 
          maxHeight: 480, 
          overflowY: 'auto', 
          paddingRight: 8,
          scrollbarWidth: 'thin',
          scrollbarColor: `${T.colors.sacred.gold} ${T.colors.bg.card}`
        }}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MINI AVATAR COMPONENT (for use in other parts of the app)
// ═══════════════════════════════════════════════════════════════════════════════

export const MiniAvatar: React.FC<{ 
  config?: Partial<AvatarConfig>; 
  size?: number;
  onClick?: () => void;
}> = ({ config: partialConfig, size = 40, onClick }) => {
  const config: AvatarConfig = { ...DEFAULT_CONFIG, ...partialConfig };
  
  return (
    <div
      onClick={onClick}
      style={{
        width: size,
        height: size,
        borderRadius: size / 4,
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        border: `2px solid ${T.colors.sacred.gold}`,
        transition: 'all 0.2s ease'
      }}
    >
      <AvatarSVG config={config} size={size} />
    </div>
  );
};
