// =============================================================================
// CHE·NU — Breadcrumbs Component
// Foundation Freeze V1
// =============================================================================
// Fil d'Ariane - Navigation contextuelle
// Règle UX critique: Retour au Trunk TOUJOURS disponible en 1 clic
// =============================================================================

import React, { useMemo } from 'react';
import { BreadcrumbItem } from '../../types';
import { UNIVERSE_COLORS, SPHERE_CONFIGS } from '../../config';

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

export interface BreadcrumbsProps {
  /** Items du breadcrumb */
  items: BreadcrumbItem[];
  /** Handler de navigation */
  onNavigate?: (path: string) => void;
  /** Handler retour au trunk */
  onReturnToTrunk?: () => void;
  /** Compact mode */
  compact?: boolean;
  /** Classes CSS additionnelles */
  className?: string;
}

// -----------------------------------------------------------------------------
// STYLES
// -----------------------------------------------------------------------------

const breadcrumbStyles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '8px 16px',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    backdropFilter: 'blur(10px)',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  homeButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
    border: '1px solid rgba(168, 85, 247, 0.3)',
    cursor: 'pointer',
    transition: 'all 0.15s ease-out',
    fontSize: '16px',
  },
  separator: {
    color: UNIVERSE_COLORS.text.muted,
    fontSize: '12px',
    margin: '0 4px',
    userSelect: 'none' as const,
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 10px',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.15s ease-out',
    backgroundColor: 'transparent',
    border: 'none',
  },
  itemActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    cursor: 'default',
  },
  itemEmoji: {
    fontSize: '14px',
  },
  itemLabel: {
    fontSize: '13px',
    fontWeight: 500,
    color: UNIVERSE_COLORS.text.primary,
  },
  itemLabelActive: {
    fontWeight: 600,
  },
  compactContainer: {
    gap: '2px',
    padding: '4px 8px',
  }
};

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  onNavigate,
  onReturnToTrunk,
  compact = false,
  className = ''
}) => {
  // Get sphere color for styling
  const getSphereColor = (item: BreadcrumbItem): string | null => {
    if (item.type === 'sphere') {
      const sphereId = item.id.replace('sphere-', '');
      return SPHERE_CONFIGS[sphereId as keyof typeof SPHERE_CONFIGS]?.color || null;
    }
    return null;
  };

  const handleItemClick = (item: BreadcrumbItem, index: number) => {
    // Don't navigate if it's the current (last) item
    if (index === items.length - 1) return;
    
    if (item.path === '/' && onReturnToTrunk) {
      onReturnToTrunk();
    } else if (onNavigate) {
      onNavigate(item.path);
    }
  };

  const handleHomeClick = () => {
    if (onReturnToTrunk) {
      onReturnToTrunk();
    } else if (onNavigate) {
      onNavigate('/');
    }
  };

  return (
    <nav
      className={`chenu-breadcrumbs ${className}`}
      style={{
        ...breadcrumbStyles.container,
        ...(compact ? breadcrumbStyles.compactContainer : {}),
      }}
      aria-label="Breadcrumb navigation"
    >
      {/* Home/Trunk button - ALWAYS visible */}
      <button
        style={breadcrumbStyles.homeButton}
        onClick={handleHomeClick}
        aria-label="Return to trunk"
        title="Return to trunk (1-click)"
      >
        🌳
      </button>
      
      {/* Breadcrumb items */}
      {items.length > 1 && items.slice(1).map((item, index) => {
        const isLast = index === items.length - 2;
        const sphereColor = getSphereColor(item);
        
        return (
          <React.Fragment key={item.id}>
            {/* Separator */}
            <span style={breadcrumbStyles.separator}>›</span>
            
            {/* Item */}
            <button
              style={{
                ...breadcrumbStyles.item,
                ...(isLast ? breadcrumbStyles.itemActive : {}),
                ...(sphereColor && !isLast ? {
                  backgroundColor: `${sphereColor}20`,
                  border: `1px solid ${sphereColor}30`,
                } : {}),
              }}
              onClick={() => handleItemClick(item, index + 1)}
              aria-current={isLast ? 'page' : undefined}
              disabled={isLast}
            >
              <span 
                style={{
                  ...breadcrumbStyles.itemEmoji,
                  filter: sphereColor ? `drop-shadow(0 0 3px ${sphereColor})` : 'none',
                }}
              >
                {item.emoji}
              </span>
              {!compact && (
                <span 
                  style={{
                    ...breadcrumbStyles.itemLabel,
                    ...(isLast ? breadcrumbStyles.itemLabelActive : {}),
                  }}
                >
                  {item.label}
                </span>
              )}
            </button>
          </React.Fragment>
        );
      })}
      
      {/* Styles for hover effects */}
      <style>{`
        .chenu-breadcrumbs button:hover:not(:disabled) {
          background-color: rgba(255, 255, 255, 0.1) !important;
        }
        .chenu-breadcrumbs button:focus {
          outline: 2px solid rgba(168, 85, 247, 0.5);
          outline-offset: 2px;
        }
      `}</style>
    </nav>
  );
};

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

export default Breadcrumbs;
