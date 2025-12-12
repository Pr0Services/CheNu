/**
 * CHE·NU™ V4 - DIRECTORS AVATARS
 * A2-02: 14 avatars uniques pour les Directors IA
 * 
 * Niveau L1 - Directors (14):
 * Construction, Finance, HR, Marketing, Creative,
 * Sales, Operations, Admin, Tech, Communication,
 * Legal, Support, Investment, R&D
 */

import React, { useState } from 'react';

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
      amber: '#F59E0B',
      teal: '#14B8A6',
      indigo: '#6366F1',
      rose: '#F43F5E',
      cyan: '#06B6D4',
      orange: '#F97316',
      lime: '#84CC16',
      sky: '#0EA5E9',
      violet: '#7C3AED',
      fuchsia: '#D946EF'
    },
    border: '#2A2A2A'
  },
  radius: { sm: 6, md: 12, lg: 16, xl: 24 }
};

// ═══════════════════════════════════════════════════════════════════════════════
// DIRECTORS DATA
// ═══════════════════════════════════════════════════════════════════════════════

export interface Director {
  id: string;
  name: string;
  title: string;
  domain: string;
  icon: string;
  color: string;
  gradient: string;
  description: string;
  specialistCount: number;
  status: 'active' | 'busy' | 'idle';
  personality: string;
}

export const DIRECTORS: Director[] = [
  {
    id: 'construction',
    name: 'Marcus',
    title: 'Director of Construction',
    domain: 'Construction',
    icon: '🏗️',
    color: T.colors.accent.amber,
    gradient: 'linear-gradient(135deg, #F59E0B, #D97706)',
    description: 'Gestion des chantiers, conformité CCQ/CNESST, planification',
    specialistCount: 12,
    status: 'active',
    personality: 'Pragmatique et orienté terrain'
  },
  {
    id: 'finance',
    name: 'Victoria',
    title: 'Director of Finance',
    domain: 'Finance',
    icon: '💰',
    color: T.colors.accent.emerald,
    gradient: 'linear-gradient(135deg, #3F7249, #2D5A35)',
    description: 'Comptabilité, facturation, budget, trésorerie',
    specialistCount: 8,
    status: 'active',
    personality: 'Précise et analytique'
  },
  {
    id: 'hr',
    name: 'Sophie',
    title: 'Director of Human Resources',
    domain: 'Ressources Humaines',
    icon: '👥',
    color: T.colors.accent.pink,
    gradient: 'linear-gradient(135deg, #EC4899, #DB2777)',
    description: 'Recrutement, paie, formation, bien-être employés',
    specialistCount: 6,
    status: 'active',
    personality: 'Empathique et organisée'
  },
  {
    id: 'marketing',
    name: 'Alex',
    title: 'Director of Marketing',
    domain: 'Marketing',
    icon: '📢',
    color: T.colors.accent.purple,
    gradient: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
    description: 'Campagnes, branding, réseaux sociaux, contenu',
    specialistCount: 7,
    status: 'busy',
    personality: 'Créatif et stratégique'
  },
  {
    id: 'creative',
    name: 'Luna',
    title: 'Director of Creative',
    domain: 'Creative Studio',
    icon: '🎨',
    color: T.colors.accent.fuchsia,
    gradient: 'linear-gradient(135deg, #D946EF, #C026D3)',
    description: 'Design, multimédia, avatars, production visuelle',
    specialistCount: 9,
    status: 'active',
    personality: 'Artistique et innovante'
  },
  {
    id: 'sales',
    name: 'James',
    title: 'Director of Sales',
    domain: 'Ventes',
    icon: '🤝',
    color: T.colors.accent.blue,
    gradient: 'linear-gradient(135deg, #3B82F6, #2563EB)',
    description: 'CRM, pipeline, soumissions, négociations',
    specialistCount: 5,
    status: 'active',
    personality: 'Persuasif et relationnel'
  },
  {
    id: 'operations',
    name: 'Chen',
    title: 'Director of Operations',
    domain: 'Opérations',
    icon: '⚙️',
    color: T.colors.accent.teal,
    gradient: 'linear-gradient(135deg, #14B8A6, #0D9488)',
    description: 'Logistique, processus, efficacité, qualité',
    specialistCount: 6,
    status: 'active',
    personality: 'Méthodique et efficace'
  },
  {
    id: 'admin',
    name: 'Marie',
    title: 'Director of Administration',
    domain: 'Administration',
    icon: '📋',
    color: T.colors.accent.sky,
    gradient: 'linear-gradient(135deg, #0EA5E9, #0284C7)',
    description: 'Documents, archives, correspondance, organisation',
    specialistCount: 4,
    status: 'idle',
    personality: 'Ordonnée et fiable'
  },
  {
    id: 'tech',
    name: 'Neo',
    title: 'Director of Technology',
    domain: 'Technologie',
    icon: '💻',
    color: T.colors.accent.cyan,
    gradient: 'linear-gradient(135deg, #06B6D4, #0891B2)',
    description: 'Infrastructure, développement, sécurité, IA',
    specialistCount: 8,
    status: 'active',
    personality: 'Visionnaire et technique'
  },
  {
    id: 'communication',
    name: 'Aria',
    title: 'Director of Communication',
    domain: 'Communication',
    icon: '📣',
    color: T.colors.accent.indigo,
    gradient: 'linear-gradient(135deg, #6366F1, #4F46E5)',
    description: 'Relations publiques, médias, événements',
    specialistCount: 4,
    status: 'active',
    personality: 'Éloquente et diplomatique'
  },
  {
    id: 'legal',
    name: 'Helena',
    title: 'Director of Legal',
    domain: 'Juridique',
    icon: '⚖️',
    color: T.colors.accent.rose,
    gradient: 'linear-gradient(135deg, #F43F5E, #E11D48)',
    description: 'Contrats, conformité, litiges, propriété intellectuelle',
    specialistCount: 3,
    status: 'idle',
    personality: 'Rigoureuse et prudente'
  },
  {
    id: 'support',
    name: 'Sam',
    title: 'Director of Support',
    domain: 'Support Client',
    icon: '🎧',
    color: T.colors.accent.lime,
    gradient: 'linear-gradient(135deg, #84CC16, #65A30D)',
    description: 'Service client, tickets, satisfaction, formation',
    specialistCount: 5,
    status: 'active',
    personality: 'Patient et serviable'
  },
  {
    id: 'investment',
    name: 'Richard',
    title: 'Director of Investment',
    domain: 'Investissement',
    icon: '📈',
    color: T.colors.sacred.gold,
    gradient: 'linear-gradient(135deg, #D8B26A, #B89040)',
    description: 'Portefeuille, analyse, stratégie financière',
    specialistCount: 3,
    status: 'busy',
    personality: 'Stratège et calculateur'
  },
  {
    id: 'rnd',
    name: 'Iris',
    title: 'Director of R&D Innovation',
    domain: 'R&D',
    icon: '🔬',
    color: T.colors.accent.violet,
    gradient: 'linear-gradient(135deg, #7C3AED, #6D28D9)',
    description: 'Recherche, innovation, prototypes, brevets',
    specialistCount: 6,
    status: 'active',
    personality: 'Curieuse et expérimentale'
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// DIRECTOR AVATAR COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface DirectorAvatarProps {
  director: Director;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showName?: boolean;
  showStatus?: boolean;
  onClick?: () => void;
  isSelected?: boolean;
}

export const DirectorAvatar: React.FC<DirectorAvatarProps> = ({
  director,
  size = 'md',
  showName = false,
  showStatus = true,
  onClick,
  isSelected = false
}) => {
  const sizes = {
    sm: { avatar: 40, icon: 20, status: 10, name: 11 },
    md: { avatar: 56, icon: 28, status: 14, name: 13 },
    lg: { avatar: 80, icon: 40, status: 18, name: 15 },
    xl: { avatar: 120, icon: 60, status: 24, name: 18 }
  };

  const s = sizes[size];

  const statusColors = {
    active: T.colors.accent.emerald,
    busy: T.colors.accent.amber,
    idle: T.colors.text.muted
  };

  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        cursor: onClick ? 'pointer' : 'default'
      }}
    >
      {/* Avatar */}
      <div style={{
        position: 'relative',
        width: s.avatar,
        height: s.avatar
      }}>
        {/* Glow effect */}
        <div style={{
          position: 'absolute',
          top: -4,
          left: -4,
          right: -4,
          bottom: -4,
          borderRadius: s.avatar / 3,
          background: director.gradient,
          opacity: isSelected ? 0.6 : 0.3,
          filter: `blur(${s.avatar / 6}px)`,
          transition: 'opacity 0.3s ease'
        }} />

        {/* Main avatar */}
        <div style={{
          position: 'relative',
          width: s.avatar,
          height: s.avatar,
          borderRadius: s.avatar / 3,
          background: director.gradient,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: s.icon,
          border: isSelected ? `3px solid ${T.colors.text.primary}` : `2px solid ${director.color}40`,
          boxShadow: isSelected 
            ? `0 0 20px ${director.color}60`
            : `0 4px 16px rgba(0,0,0,0.3)`,
          transition: 'all 0.3s ease'
        }}>
          {director.icon}
        </div>

        {/* Status indicator */}
        {showStatus && (
          <div style={{
            position: 'absolute',
            bottom: -2,
            right: -2,
            width: s.status,
            height: s.status,
            borderRadius: '50%',
            background: statusColors[director.status],
            border: `2px solid ${T.colors.bg.temple}`,
            boxShadow: `0 0 8px ${statusColors[director.status]}`
          }} />
        )}
      </div>

      {/* Name */}
      {showName && (
        <div style={{ textAlign: 'center' }}>
          <div style={{
            color: isSelected ? director.color : T.colors.text.primary,
            fontSize: s.name,
            fontWeight: 600
          }}>
            {director.name}
          </div>
          <div style={{
            color: T.colors.text.muted,
            fontSize: s.name - 2
          }}>
            {director.domain}
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// DIRECTOR CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface DirectorCardProps {
  director: Director;
  onClick?: () => void;
  isExpanded?: boolean;
}

export const DirectorCard: React.FC<DirectorCardProps> = ({
  director,
  onClick,
  isExpanded = false
}) => {
  const statusLabels = {
    active: '● Actif',
    busy: '● Occupé',
    idle: '● Inactif'
  };

  const statusColors = {
    active: T.colors.accent.emerald,
    busy: T.colors.accent.amber,
    idle: T.colors.text.muted
  };

  return (
    <div
      onClick={onClick}
      style={{
        background: T.colors.bg.card,
        borderRadius: T.radius.lg,
        border: `1px solid ${T.colors.border}`,
        padding: 20,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = director.color;
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = T.colors.border;
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Gradient accent */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 4,
        background: director.gradient
      }} />

      <div style={{ display: 'flex', gap: 16 }}>
        <DirectorAvatar director={director} size="lg" showStatus={true} />
        
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={{
                margin: 0,
                color: T.colors.text.primary,
                fontSize: 18,
                fontWeight: 600
              }}>
                {director.name}
              </h3>
              <p style={{
                margin: '4px 0 0',
                color: director.color,
                fontSize: 13,
                fontWeight: 500
              }}>
                {director.title}
              </p>
            </div>
            <span style={{
              fontSize: 12,
              color: statusColors[director.status]
            }}>
              {statusLabels[director.status]}
            </span>
          </div>

          <p style={{
            margin: '12px 0 0',
            color: T.colors.text.secondary,
            fontSize: 13,
            lineHeight: 1.5
          }}>
            {director.description}
          </p>

          <div style={{
            display: 'flex',
            gap: 16,
            marginTop: 16
          }}>
            <div style={{
              padding: '6px 12px',
              background: `${director.color}20`,
              borderRadius: T.radius.sm,
              fontSize: 12,
              color: director.color
            }}>
              {director.specialistCount} Specialists
            </div>
            <div style={{
              padding: '6px 12px',
              background: T.colors.bg.elevated,
              borderRadius: T.radius.sm,
              fontSize: 12,
              color: T.colors.text.muted
            }}>
              {director.personality}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// DIRECTORS GRID COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const DirectorsGrid: React.FC<{
  onSelectDirector?: (director: Director) => void;
}> = ({ onSelectDirector }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (director: Director) => {
    setSelectedId(director.id);
    onSelectDirector?.(director);
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: 20
    }}>
      {DIRECTORS.map(director => (
        <DirectorCard
          key={director.id}
          director={director}
          onClick={() => handleSelect(director)}
          isExpanded={selectedId === director.id}
        />
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// DIRECTORS AVATAR ROW (compact)
// ═══════════════════════════════════════════════════════════════════════════════

export const DirectorsAvatarRow: React.FC<{
  maxVisible?: number;
  onSelectDirector?: (director: Director) => void;
}> = ({ maxVisible = 7, onSelectDirector }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const visibleDirectors = DIRECTORS.slice(0, maxVisible);
  const remaining = DIRECTORS.length - maxVisible;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {visibleDirectors.map((director, index) => (
        <div
          key={director.id}
          style={{
            marginLeft: index > 0 ? -12 : 0,
            zIndex: visibleDirectors.length - index,
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.marginLeft = index > 0 ? '0' : '0';
            e.currentTarget.style.zIndex = '100';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.marginLeft = index > 0 ? '-12px' : '0';
            e.currentTarget.style.zIndex = String(visibleDirectors.length - index);
          }}
        >
          <DirectorAvatar
            director={director}
            size="md"
            showStatus={true}
            isSelected={selectedId === director.id}
            onClick={() => {
              setSelectedId(director.id);
              onSelectDirector?.(director);
            }}
          />
        </div>
      ))}
      
      {remaining > 0 && (
        <div style={{
          width: 56,
          height: 56,
          borderRadius: 18,
          background: T.colors.bg.elevated,
          border: `2px solid ${T.colors.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: T.colors.text.muted,
          fontSize: 14,
          fontWeight: 600,
          marginLeft: -12
        }}>
          +{remaining}
        </div>
      )}
    </div>
  );
};

export default DirectorsGrid;
