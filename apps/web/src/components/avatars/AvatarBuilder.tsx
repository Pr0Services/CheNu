/**
 * CHE·NU™ V4 - AVATAR BUILDER
 * A1-01: Éditeur d'avatars avec styles multiples
 * 
 * Styles disponibles:
 * - Humain réaliste
 * - Cartoon/Anime
 * - Animal
 * - Mythique/Fantasy
 * - 3D Abstrait
 * - Emoji/Minimal
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
    accent: { emerald: '#3F7249', blue: '#3B82F6', purple: '#8B5CF6', pink: '#EC4899', amber: '#F59E0B' },
    border: '#2A2A2A'
  },
  radius: { sm: 6, md: 12, lg: 16, xl: 24 }
};

// ═══════════════════════════════════════════════════════════════════════════════
// AVATAR CONFIGURATION DATA
// ═══════════════════════════════════════════════════════════════════════════════

const AVATAR_STYLES = [
  { id: 'human', name: 'Humain', icon: '👤', description: 'Style réaliste professionnel' },
  { id: 'cartoon', name: 'Cartoon', icon: '🎨', description: 'Style animé coloré' },
  { id: 'animal', name: 'Animal', icon: '🐾', description: 'Personnages animaliers' },
  { id: 'mythic', name: 'Mythique', icon: '🐉', description: 'Créatures fantastiques' },
  { id: 'abstract', name: 'Abstrait', icon: '🔮', description: 'Formes géométriques 3D' },
  { id: 'emoji', name: 'Emoji', icon: '😊', description: 'Style minimaliste emoji' }
];

const SKIN_COLORS = [
  { id: 'light', color: '#FFDBB4', name: 'Claire' },
  { id: 'medium-light', color: '#E5B887', name: 'Moyenne claire' },
  { id: 'medium', color: '#C68642', name: 'Moyenne' },
  { id: 'medium-dark', color: '#8D5524', name: 'Moyenne foncée' },
  { id: 'dark', color: '#5C3317', name: 'Foncée' }
];

const HAIR_STYLES = [
  { id: 'short', name: 'Court', icon: '💇' },
  { id: 'medium', name: 'Mi-long', icon: '💇‍♀️' },
  { id: 'long', name: 'Long', icon: '👩‍🦰' },
  { id: 'curly', name: 'Bouclé', icon: '👨‍🦱' },
  { id: 'bald', name: 'Chauve', icon: '👨‍🦲' },
  { id: 'mohawk', name: 'Mohawk', icon: '🧑‍🎤' }
];

const HAIR_COLORS = [
  { id: 'black', color: '#1A1A1A', name: 'Noir' },
  { id: 'brown', color: '#4A3728', name: 'Brun' },
  { id: 'blonde', color: '#D4A574', name: 'Blond' },
  { id: 'red', color: '#A52A2A', name: 'Roux' },
  { id: 'gray', color: '#808080', name: 'Gris' },
  { id: 'blue', color: '#3B82F6', name: 'Bleu' },
  { id: 'pink', color: '#EC4899', name: 'Rose' },
  { id: 'purple', color: '#8B5CF6', name: 'Violet' }
];

const ACCESSORIES = [
  { id: 'none', name: 'Aucun', icon: '❌' },
  { id: 'glasses', name: 'Lunettes', icon: '👓' },
  { id: 'sunglasses', name: 'Solaires', icon: '🕶️' },
  { id: 'hat', name: 'Chapeau', icon: '🎩' },
  { id: 'cap', name: 'Casquette', icon: '🧢' },
  { id: 'headphones', name: 'Casque', icon: '🎧' },
  { id: 'hardhat', name: 'Casque chantier', icon: '⛑️' }
];

const EXPRESSIONS = [
  { id: 'neutral', name: 'Neutre', icon: '😐' },
  { id: 'happy', name: 'Joyeux', icon: '😊' },
  { id: 'confident', name: 'Confiant', icon: '😎' },
  { id: 'serious', name: 'Sérieux', icon: '😤' },
  { id: 'friendly', name: 'Amical', icon: '🤗' },
  { id: 'thinking', name: 'Pensif', icon: '🤔' }
];

const BACKGROUNDS = [
  { id: 'none', color: 'transparent', name: 'Transparent' },
  { id: 'gold', color: '#D8B26A', name: 'Sacred Gold' },
  { id: 'blue', color: '#3B82F6', name: 'Bleu' },
  { id: 'purple', color: '#8B5CF6', name: 'Violet' },
  { id: 'emerald', color: '#3F7249', name: 'Émeraude' },
  { id: 'gradient', color: 'linear-gradient(135deg, #D8B26A, #B89040)', name: 'Dégradé Gold' }
];

const ANIMAL_TYPES = [
  { id: 'cat', emoji: '🐱', name: 'Chat' },
  { id: 'dog', emoji: '🐕', name: 'Chien' },
  { id: 'wolf', emoji: '🐺', name: 'Loup' },
  { id: 'fox', emoji: '🦊', name: 'Renard' },
  { id: 'bear', emoji: '🐻', name: 'Ours' },
  { id: 'lion', emoji: '🦁', name: 'Lion' },
  { id: 'owl', emoji: '🦉', name: 'Hibou' },
  { id: 'eagle', emoji: '🦅', name: 'Aigle' }
];

const MYTHIC_TYPES = [
  { id: 'dragon', emoji: '🐉', name: 'Dragon' },
  { id: 'phoenix', emoji: '🔥', name: 'Phénix' },
  { id: 'unicorn', emoji: '🦄', name: 'Licorne' },
  { id: 'wizard', emoji: '🧙', name: 'Mage' },
  { id: 'fairy', emoji: '🧚', name: 'Fée' },
  { id: 'robot', emoji: '🤖', name: 'Robot' }
];

// ═══════════════════════════════════════════════════════════════════════════════
// AVATAR PREVIEW COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface AvatarConfig {
  style: string;
  skinColor: string;
  hairStyle: string;
  hairColor: string;
  accessory: string;
  expression: string;
  background: string;
  animalType?: string;
  mythicType?: string;
}

const AvatarPreview: React.FC<{ config: AvatarConfig }> = ({ config }) => {
  const getBgStyle = () => {
    const bg = BACKGROUNDS.find(b => b.id === config.background);
    if (!bg) return {};
    if (config.background === 'gradient') {
      return { background: bg.color };
    }
    return { backgroundColor: bg.color };
  };

  const getAvatarDisplay = () => {
    switch (config.style) {
      case 'animal':
        const animal = ANIMAL_TYPES.find(a => a.id === config.animalType);
        return animal?.emoji || '🐾';
      case 'mythic':
        const mythic = MYTHIC_TYPES.find(m => m.id === config.mythicType);
        return mythic?.emoji || '🐉';
      case 'emoji':
        const expr = EXPRESSIONS.find(e => e.id === config.expression);
        return expr?.icon || '😊';
      case 'abstract':
        return '🔮';
      default:
        // Human/Cartoon - composite emoji representation
        const accessory = ACCESSORIES.find(a => a.id === config.accessory);
        if (accessory && accessory.id !== 'none') {
          return accessory.icon;
        }
        const expression = EXPRESSIONS.find(e => e.id === config.expression);
        return expression?.icon || '👤';
    }
  };

  return (
    <div style={{
      width: 200,
      height: 200,
      borderRadius: T.radius.xl,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 100,
      border: `3px solid ${T.colors.sacred.gold}`,
      boxShadow: `0 0 40px rgba(216, 178, 106, 0.3)`,
      position: 'relative',
      overflow: 'hidden',
      ...getBgStyle()
    }}>
      {/* Base layer for human/cartoon */}
      {(config.style === 'human' || config.style === 'cartoon') && (
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: `radial-gradient(circle at 50% 40%, ${config.skinColor} 30%, ${config.skinColor}88 60%, transparent 70%)`
        }} />
      )}
      
      {/* Avatar emoji/icon */}
      <span style={{ 
        position: 'relative', 
        zIndex: 1,
        filter: config.style === 'abstract' ? 'hue-rotate(45deg)' : 'none'
      }}>
        {getAvatarDisplay()}
      </span>

      {/* Accessory overlay */}
      {config.accessory !== 'none' && config.style !== 'emoji' && (
        <span style={{
          position: 'absolute',
          top: 10,
          right: 10,
          fontSize: 32,
          opacity: 0.9
        }}>
          {ACCESSORIES.find(a => a.id === config.accessory)?.icon}
        </span>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// OPTION SELECTOR COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface OptionSelectorProps {
  title: string;
  options: { id: string; name?: string; icon?: string; emoji?: string; color?: string }[];
  selected: string;
  onSelect: (id: string) => void;
  type?: 'icon' | 'color' | 'card';
}

const OptionSelector: React.FC<OptionSelectorProps> = ({ 
  title, options, selected, onSelect, type = 'icon' 
}) => {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{
        display: 'block',
        fontSize: 12,
        fontWeight: 600,
        color: T.colors.text.muted,
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        {title}
      </label>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8
      }}>
        {options.map(option => (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            style={{
              padding: type === 'card' ? '10px 16px' : type === 'color' ? 0 : '8px 12px',
              width: type === 'color' ? 32 : 'auto',
              height: type === 'color' ? 32 : 'auto',
              background: type === 'color' 
                ? (option.color || T.colors.bg.elevated)
                : (selected === option.id ? `${T.colors.sacred.gold}20` : T.colors.bg.elevated),
              border: `2px solid ${selected === option.id ? T.colors.sacred.gold : T.colors.border}`,
              borderRadius: type === 'color' ? '50%' : T.radius.md,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.2s ease'
            }}
            title={option.name}
          >
            {type !== 'color' && (
              <>
                <span style={{ fontSize: 18 }}>{option.icon || option.emoji}</span>
                {type === 'card' && (
                  <span style={{ 
                    color: selected === option.id ? T.colors.sacred.gold : T.colors.text.primary,
                    fontSize: 13 
                  }}>
                    {option.name}
                  </span>
                )}
              </>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN AVATAR BUILDER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function AvatarBuilder() {
  const [config, setConfig] = useState<AvatarConfig>({
    style: 'human',
    skinColor: SKIN_COLORS[1].color,
    hairStyle: 'short',
    hairColor: HAIR_COLORS[1].color,
    accessory: 'none',
    expression: 'neutral',
    background: 'gold',
    animalType: 'fox',
    mythicType: 'dragon'
  });

  const [activeTab, setActiveTab] = useState<'style' | 'appearance' | 'extras'>('style');

  const updateConfig = useCallback((key: keyof AvatarConfig, value: string) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleSave = () => {
    // TODO: Save avatar to user profile
    console.log('Saving avatar config:', config);
    alert('Avatar sauvegardé! 🎉');
  };

  const handleRandomize = () => {
    const randomFrom = <T extends { id: string }>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)].id;
    const randomColor = <T extends { color: string }>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)].color;
    
    setConfig({
      style: randomFrom(AVATAR_STYLES),
      skinColor: randomColor(SKIN_COLORS),
      hairStyle: randomFrom(HAIR_STYLES),
      hairColor: randomColor(HAIR_COLORS),
      accessory: randomFrom(ACCESSORIES),
      expression: randomFrom(EXPRESSIONS),
      background: randomFrom(BACKGROUNDS),
      animalType: randomFrom(ANIMAL_TYPES),
      mythicType: randomFrom(MYTHIC_TYPES)
    });
  };

  return (
    <div style={{
      display: 'flex',
      gap: 32,
      padding: 24,
      background: T.colors.bg.temple,
      borderRadius: T.radius.xl,
      border: `1px solid ${T.colors.border}`
    }}>
      {/* Preview Section */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20
      }}>
        <h2 style={{
          color: T.colors.text.primary,
          fontSize: 18,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          <span>🎨</span> Avatar Builder
        </h2>
        
        <AvatarPreview config={config} />
        
        <div style={{ display: 'flex', gap: 12 }}>
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
            onClick={handleSave}
            style={{
              padding: '10px 24px',
              background: `linear-gradient(135deg, ${T.colors.sacred.gold}, ${T.colors.sacred.goldDark})`,
              border: 'none',
              borderRadius: T.radius.md,
              color: '#000',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 14
            }}
          >
            💾 Sauvegarder
          </button>
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
          {[
            { id: 'style', label: '🎭 Style', },
            { id: 'appearance', label: '👤 Apparence' },
            { id: 'extras', label: '✨ Extras' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                flex: 1,
                padding: '10px 16px',
                background: activeTab === tab.id ? T.colors.sacred.gold : 'transparent',
                border: 'none',
                borderRadius: T.radius.sm,
                color: activeTab === tab.id ? '#000' : T.colors.text.secondary,
                fontWeight: activeTab === tab.id ? 600 : 400,
                cursor: 'pointer',
                fontSize: 14,
                transition: 'all 0.2s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ maxHeight: 400, overflowY: 'auto', paddingRight: 8 }}>
          {activeTab === 'style' && (
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
                  selected={config.animalType || 'fox'}
                  onSelect={(id) => updateConfig('animalType', id)}
                  type="card"
                />
              )}
              
              {config.style === 'mythic' && (
                <OptionSelector
                  title="Créature"
                  options={MYTHIC_TYPES}
                  selected={config.mythicType || 'dragon'}
                  onSelect={(id) => updateConfig('mythicType', id)}
                  type="card"
                />
              )}
            </>
          )}

          {activeTab === 'appearance' && (
            <>
              {(config.style === 'human' || config.style === 'cartoon') && (
                <>
                  <OptionSelector
                    title="Couleur de peau"
                    options={SKIN_COLORS}
                    selected={SKIN_COLORS.find(s => s.color === config.skinColor)?.id || 'light'}
                    onSelect={(id) => {
                      const skin = SKIN_COLORS.find(s => s.id === id);
                      if (skin) updateConfig('skinColor', skin.color);
                    }}
                    type="color"
                  />
                  
                  <OptionSelector
                    title="Style de cheveux"
                    options={HAIR_STYLES}
                    selected={config.hairStyle}
                    onSelect={(id) => updateConfig('hairStyle', id)}
                  />
                  
                  <OptionSelector
                    title="Couleur de cheveux"
                    options={HAIR_COLORS}
                    selected={HAIR_COLORS.find(h => h.color === config.hairColor)?.id || 'brown'}
                    onSelect={(id) => {
                      const hair = HAIR_COLORS.find(h => h.id === id);
                      if (hair) updateConfig('hairColor', hair.color);
                    }}
                    type="color"
                  />
                </>
              )}
              
              <OptionSelector
                title="Expression"
                options={EXPRESSIONS}
                selected={config.expression}
                onSelect={(id) => updateConfig('expression', id)}
              />
            </>
          )}

          {activeTab === 'extras' && (
            <>
              <OptionSelector
                title="Accessoire"
                options={ACCESSORIES}
                selected={config.accessory}
                onSelect={(id) => updateConfig('accessory', id)}
              />
              
              <OptionSelector
                title="Arrière-plan"
                options={BACKGROUNDS}
                selected={config.background}
                onSelect={(id) => updateConfig('background', id)}
                type="color"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT MINI AVATAR COMPONENT (pour utilisation ailleurs)
// ═══════════════════════════════════════════════════════════════════════════════

export const MiniAvatar: React.FC<{ 
  config?: Partial<AvatarConfig>; 
  size?: number;
  onClick?: () => void;
}> = ({ config, size = 40, onClick }) => {
  const defaultConfig: AvatarConfig = {
    style: 'emoji',
    skinColor: SKIN_COLORS[1].color,
    hairStyle: 'short',
    hairColor: HAIR_COLORS[1].color,
    accessory: 'none',
    expression: 'happy',
    background: 'gold',
    ...config
  };

  const getEmoji = () => {
    if (defaultConfig.style === 'animal') {
      return ANIMAL_TYPES.find(a => a.id === defaultConfig.animalType)?.emoji || '🐾';
    }
    if (defaultConfig.style === 'mythic') {
      return MYTHIC_TYPES.find(m => m.id === defaultConfig.mythicType)?.emoji || '🐉';
    }
    return EXPRESSIONS.find(e => e.id === defaultConfig.expression)?.icon || '😊';
  };

  const bg = BACKGROUNDS.find(b => b.id === defaultConfig.background);

  return (
    <div
      onClick={onClick}
      style={{
        width: size,
        height: size,
        borderRadius: size / 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.5,
        background: bg?.color || T.colors.sacred.gold,
        border: `2px solid ${T.colors.sacred.gold}`,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease'
      }}
    >
      {getEmoji()}
    </div>
  );
};
