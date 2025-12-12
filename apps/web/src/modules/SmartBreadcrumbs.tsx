/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                              ║
 * ║                   CHE·NU V25 - SMART BREADCRUMBS                             ║
 * ║                                                                              ║
 * ║  Context-aware navigation showing:                                          ║
 * ║  • Current space (1 of 7)                                                    ║
 * ║  • Full path hierarchy                                                       ║
 * ║  • Quick navigation to any level                                             ║
 * ║  • Collapsible for long paths                                                ║
 * ║  • Mobile responsive                                                         ║
 * ║                                                                              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useMemo } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════════════════════════════════════

const tokens = {
  colors: {
    gold: '#D8B26A',
    goldDark: '#B8924A',
    emerald: '#3F7249',
    turquoise: '#3EB4A2',
    
    bg: {
      primary: '#0f1217',
      secondary: '#161B22',
      tertiary: '#1E242C',
      hover: '#2D3640',
    },
    
    text: {
      primary: '#F4F0EB',
      secondary: '#B8B0A8',
      muted: '#6B6560',
    },
    
    border: {
      default: 'rgba(216, 178, 106, 0.15)',
      hover: 'rgba(216, 178, 106, 0.3)',
    },
    
    // Space colors
    spaces: {
      maison: '#4ade80',
      entreprise: '#3b82f6',
      projets: '#8b5cf6',
      creative: '#f59e0b',
      gouvernement: '#06b6d4',
      immobilier: '#ec4899',
      associations: '#14b8a6',
    } as Record<string, string>,
  },
  
  spacing: { xs: 4, sm: 8, md: 16, lg: 24 },
  radius: { sm: 6, md: 10, lg: 16 },
};

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface BreadcrumbItem {
  id: string;
  label: string;
  icon?: string;
  path: string;
  isSpace?: boolean;
  spaceId?: string;
}

interface SmartBreadcrumbsProps {
  items: BreadcrumbItem[];
  currentSpace?: string;
  onNavigate?: (path: string) => void;
  maxVisible?: number;
  showHome?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SPACE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════════

const SPACES: Record<string, { icon: string; label: string; color: string }> = {
  maison: { icon: '🏠', label: 'Maison', color: tokens.colors.spaces.maison },
  entreprise: { icon: '🏢', label: 'Entreprise', color: tokens.colors.spaces.entreprise },
  projets: { icon: '📁', label: 'Projets', color: tokens.colors.spaces.projets },
  creative: { icon: '🎨', label: 'Creative', color: tokens.colors.spaces.creative },
  gouvernement: { icon: '🏛️', label: 'Gouv.', color: tokens.colors.spaces.gouvernement },
  immobilier: { icon: '🏘️', label: 'Immo.', color: tokens.colors.spaces.immobilier },
  associations: { icon: '🤝', label: 'Assoc.', color: tokens.colors.spaces.associations },
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const SmartBreadcrumbs: React.FC<SmartBreadcrumbsProps> = ({
  items,
  currentSpace = 'entreprise',
  onNavigate,
  maxVisible = 4,
  showHome = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Get space info
  const space = SPACES[currentSpace] || SPACES.entreprise;

  // Prepare items with home
  const allItems = useMemo(() => {
    const result: BreadcrumbItem[] = [];
    
    if (showHome) {
      result.push({
        id: 'home',
        label: 'Dashboard',
        icon: '📊',
        path: '/dashboard',
      });
    }
    
    // Add space as first item if not already there
    if (items.length === 0 || items[0]?.spaceId !== currentSpace) {
      result.push({
        id: `space-${currentSpace}`,
        label: space.label,
        icon: space.icon,
        path: `/${currentSpace}`,
        isSpace: true,
        spaceId: currentSpace,
      });
    }
    
    return [...result, ...items];
  }, [items, currentSpace, space, showHome]);

  // Determine which items to show
  const visibleItems = useMemo(() => {
    if (isExpanded || allItems.length <= maxVisible) {
      return allItems;
    }
    
    // Show first, ellipsis, and last (maxVisible - 1) items
    const first = allItems[0];
    const lastItems = allItems.slice(-(maxVisible - 1));
    
    return [first, { id: 'ellipsis', label: '...', path: '', icon: '' }, ...lastItems];
  }, [allItems, isExpanded, maxVisible]);

  const handleClick = (item: BreadcrumbItem) => {
    if (item.id === 'ellipsis') {
      setIsExpanded(true);
      return;
    }
    onNavigate?.(item.path);
  };

  return (
    <nav style={styles.container}>
      {/* Space Indicator */}
      <div 
        style={{
          ...styles.spaceIndicator,
          backgroundColor: `${space.color}20`,
          borderColor: space.color,
        }}
        title={`Espace: ${space.label}`}
      >
        <span style={styles.spaceIcon}>{space.icon}</span>
      </div>

      {/* Separator */}
      <div style={styles.separator}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M6 4L10 8L6 12" stroke={tokens.colors.text.muted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* Breadcrumb Items */}
      <div style={styles.items}>
        {visibleItems.map((item, index) => {
          const isLast = index === visibleItems.length - 1;
          const isHovered = hoveredIndex === index;
          const isEllipsis = item.id === 'ellipsis';
          
          return (
            <React.Fragment key={item.id}>
              <button
                onClick={() => handleClick(item)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  ...styles.item,
                  ...(isLast ? styles.itemLast : {}),
                  ...(isHovered && !isLast ? styles.itemHover : {}),
                  ...(isEllipsis ? styles.itemEllipsis : {}),
                }}
                disabled={isLast}
              >
                {item.icon && !isEllipsis && (
                  <span style={styles.itemIcon}>{item.icon}</span>
                )}
                <span style={{
                  ...styles.itemLabel,
                  ...(isLast ? styles.itemLabelLast : {}),
                }}>
                  {item.label}
                </span>
              </button>
              
              {!isLast && (
                <div style={styles.chevron}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M5 3L9 7L5 11" stroke={tokens.colors.text.muted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Collapse button if expanded */}
      {isExpanded && allItems.length > maxVisible && (
        <button
          onClick={() => setIsExpanded(false)}
          style={styles.collapseBtn}
          title="Réduire"
        >
          ←
        </button>
      )}
    </nav>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacing.sm,
    padding: `${tokens.spacing.sm}px ${tokens.spacing.md}px`,
    backgroundColor: tokens.colors.bg.secondary,
    borderRadius: tokens.radius.lg,
    border: `1px solid ${tokens.colors.border.default}`,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  
  spaceIndicator: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    borderRadius: tokens.radius.md,
    border: '2px solid',
    flexShrink: 0,
  },
  
  spaceIcon: {
    fontSize: 16,
  },
  
  separator: {
    display: 'flex',
    alignItems: 'center',
    opacity: 0.5,
  },
  
  items: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacing.xs,
    flex: 1,
    overflow: 'hidden',
  },
  
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacing.xs,
    padding: `${tokens.spacing.xs}px ${tokens.spacing.sm}px`,
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: tokens.radius.sm,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    whiteSpace: 'nowrap',
  },
  
  itemHover: {
    backgroundColor: tokens.colors.bg.hover,
  },
  
  itemLast: {
    cursor: 'default',
    backgroundColor: `${tokens.colors.gold}15`,
  },
  
  itemEllipsis: {
    padding: `${tokens.spacing.xs}px ${tokens.spacing.sm}px`,
    color: tokens.colors.text.muted,
    fontSize: 14,
    letterSpacing: 2,
  },
  
  itemIcon: {
    fontSize: 14,
  },
  
  itemLabel: {
    fontSize: 13,
    color: tokens.colors.text.secondary,
  },
  
  itemLabelLast: {
    color: tokens.colors.gold,
    fontWeight: 500,
  },
  
  chevron: {
    display: 'flex',
    alignItems: 'center',
    opacity: 0.4,
  },
  
  collapseBtn: {
    width: 24,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.colors.bg.tertiary,
    border: `1px solid ${tokens.colors.border.default}`,
    borderRadius: tokens.radius.sm,
    color: tokens.colors.text.muted,
    cursor: 'pointer',
    fontSize: 12,
    marginLeft: tokens.spacing.sm,
    flexShrink: 0,
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// DEMO WRAPPER
// ═══════════════════════════════════════════════════════════════════════════════

const SmartBreadcrumbsDemo: React.FC = () => {
  const [currentPath, setCurrentPath] = useState('/projets/construction-abc/taches/T-2024-089');
  const [currentSpace, setCurrentSpace] = useState('projets');

  // Demo breadcrumb paths
  const demoPaths: Record<string, { space: string; items: BreadcrumbItem[] }> = {
    '/projets/construction-abc/taches/T-2024-089': {
      space: 'projets',
      items: [
        { id: 'proj', label: 'Construction ABC', icon: '🏗️', path: '/projets/construction-abc' },
        { id: 'tasks', label: 'Tâches', icon: '✅', path: '/projets/construction-abc/taches' },
        { id: 'task', label: 'T-2024-089', icon: '📋', path: '/projets/construction-abc/taches/T-2024-089' },
      ],
    },
    '/entreprise/finance/factures/2024-089': {
      space: 'entreprise',
      items: [
        { id: 'fin', label: 'Finance', icon: '💰', path: '/entreprise/finance' },
        { id: 'inv', label: 'Factures', icon: '🧾', path: '/entreprise/finance/factures' },
        { id: 'doc', label: '#2024-089', icon: '📄', path: '/entreprise/finance/factures/2024-089' },
      ],
    },
    '/creative/media/photos/campagne-ete': {
      space: 'creative',
      items: [
        { id: 'media', label: 'Médias', icon: '🖼️', path: '/creative/media' },
        { id: 'photos', label: 'Photos', icon: '📸', path: '/creative/media/photos' },
        { id: 'camp', label: 'Campagne Été', icon: '☀️', path: '/creative/media/photos/campagne-ete' },
      ],
    },
    '/maison/famille/calendrier': {
      space: 'maison',
      items: [
        { id: 'fam', label: 'Famille', icon: '👨‍👩‍👧‍👦', path: '/maison/famille' },
        { id: 'cal', label: 'Calendrier', icon: '📅', path: '/maison/famille/calendrier' },
      ],
    },
    '/gouvernement/permis/construction/demande-2024-456': {
      space: 'gouvernement',
      items: [
        { id: 'perm', label: 'Permis', icon: '📜', path: '/gouvernement/permis' },
        { id: 'const', label: 'Construction', icon: '🏗️', path: '/gouvernement/permis/construction' },
        { id: 'dem', label: 'Demande #2024-456', icon: '📝', path: '/gouvernement/permis/construction/demande-2024-456' },
      ],
    },
    '/immobilier/properties/123-rue-principale/contrats/bail-2024': {
      space: 'immobilier',
      items: [
        { id: 'prop', label: 'Propriétés', icon: '🏘️', path: '/immobilier/properties' },
        { id: 'addr', label: '123 Rue Principale', icon: '🏠', path: '/immobilier/properties/123-rue-principale' },
        { id: 'cont', label: 'Contrats', icon: '📁', path: '/immobilier/properties/123-rue-principale/contrats' },
        { id: 'bail', label: 'Bail 2024', icon: '📄', path: '/immobilier/properties/123-rue-principale/contrats/bail-2024' },
      ],
    },
  };

  const current = demoPaths[currentPath] || demoPaths['/projets/construction-abc/taches/T-2024-089'];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a0d0b',
      padding: tokens.spacing.lg,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h1 style={{ 
          color: tokens.colors.text.primary,
          fontSize: 28,
          marginBottom: 8,
          background: `linear-gradient(135deg, ${tokens.colors.gold}, ${tokens.colors.turquoise})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          🧭 Smart Breadcrumbs
        </h1>
        <p style={{ color: tokens.colors.text.secondary }}>
          Context-aware navigation for CHE·NU V25
        </p>
      </div>

      {/* Demo Breadcrumbs */}
      <div style={{ maxWidth: 800, margin: '0 auto', marginBottom: 40 }}>
        <SmartBreadcrumbs
          items={current.items}
          currentSpace={current.space}
          onNavigate={(path) => {
            console.log('Navigate to:', path);
            // In real app, would use router
          }}
        />
      </div>

      {/* Path Selector */}
      <div style={{
        maxWidth: 600,
        margin: '0 auto',
        backgroundColor: tokens.colors.bg.secondary,
        borderRadius: tokens.radius.lg,
        padding: tokens.spacing.lg,
        border: `1px solid ${tokens.colors.border.default}`,
      }}>
        <div style={{ 
          color: tokens.colors.text.muted, 
          fontSize: 11, 
          fontWeight: 600,
          textTransform: 'uppercase',
          marginBottom: tokens.spacing.md,
        }}>
          Exemples de chemins
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.sm }}>
          {Object.entries(demoPaths).map(([path, data]) => (
            <button
              key={path}
              onClick={() => {
                setCurrentPath(path);
                setCurrentSpace(data.space);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: tokens.spacing.md,
                padding: tokens.spacing.md,
                backgroundColor: currentPath === path ? `${tokens.colors.gold}20` : tokens.colors.bg.tertiary,
                border: currentPath === path ? `1px solid ${tokens.colors.gold}` : '1px solid transparent',
                borderRadius: tokens.radius.md,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s',
              }}
            >
              <span style={{ 
                fontSize: 20,
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: `${tokens.colors.spaces[data.space]}20`,
                borderRadius: tokens.radius.sm,
              }}>
                {SPACES[data.space].icon}
              </span>
              <div>
                <div style={{ 
                  color: tokens.colors.text.primary,
                  fontSize: 13,
                  marginBottom: 2,
                }}>
                  {data.items[data.items.length - 1].label}
                </div>
                <div style={{ 
                  color: tokens.colors.text.muted,
                  fontSize: 11,
                }}>
                  {path}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{
        maxWidth: 800,
        margin: '40px auto 0',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: tokens.spacing.md,
      }}>
        {[
          { icon: '🌐', title: 'Space Indicator', desc: 'Affiche l\'espace actuel (1 de 7)' },
          { icon: '📍', title: 'Path Hierarchy', desc: 'Chemin complet avec icônes' },
          { icon: '👆', title: 'Click Navigation', desc: 'Retour à n\'importe quel niveau' },
          { icon: '📱', title: 'Responsive', desc: 'S\'adapte aux petits écrans' },
        ].map((feature, idx) => (
          <div key={idx} style={{
            padding: tokens.spacing.md,
            backgroundColor: tokens.colors.bg.secondary,
            borderRadius: tokens.radius.md,
            border: `1px solid ${tokens.colors.border.default}`,
            textAlign: 'center',
          }}>
            <span style={{ fontSize: 24, display: 'block', marginBottom: 8 }}>{feature.icon}</span>
            <div style={{ color: tokens.colors.text.primary, fontSize: 13, fontWeight: 500 }}>{feature.title}</div>
            <div style={{ color: tokens.colors.text.muted, fontSize: 11 }}>{feature.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SmartBreadcrumbsDemo;
export { SmartBreadcrumbs };
export type { BreadcrumbItem, SmartBreadcrumbsProps };
