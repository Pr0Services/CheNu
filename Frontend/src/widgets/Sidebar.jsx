import React, { useState, useCallback } from 'react';
import { colors, radius, shadows, transitions, space, typography, zIndex } from '../design-system/tokens';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — SIDEBAR PROFESSIONNELLE
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Navigation principale avec:
 * - Logo CHE·NU™
 * - Groupes de navigation
 * - Favoris & Récents
 * - Tooltips en mode collapsed
 * - Mode compact responsive
 * - Badge notifications
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ─────────────────────────────────────────────────────────────────────────────
// NAVIGATION CONFIG
// ─────────────────────────────────────────────────────────────────────────────

export const defaultNavigation = {
  main: [
    { id: 'dashboard', icon: '📊', label: 'Tableau de bord', shortcut: 'G H' },
    { id: 'projects', icon: '📁', label: 'Projets', badge: 3, shortcut: 'G P' },
    { id: 'calendar', icon: '📅', label: 'Calendrier', shortcut: 'G C' },
  ],
  communication: [
    { id: 'email', icon: '✉️', label: 'Courriel', badge: 12, shortcut: 'G E' },
    { id: 'team', icon: '👥', label: 'Équipe', shortcut: 'G T' },
    { id: 'chat', icon: '💬', label: 'Messages', badge: 5 },
  ],
  management: [
    { id: 'documents', icon: '📄', label: 'Documents' },
    { id: 'finance', icon: '💰', label: 'Finance', shortcut: 'G F' },
    { id: 'suppliers', icon: '🏪', label: 'Fournisseurs' },
    { id: 'compliance', icon: '✅', label: 'Conformité' },
  ],
  intelligence: [
    { id: 'aiLab', icon: '🧠', label: 'Labo IA' },
    { id: 'analytics', icon: '📈', label: 'Analytics' },
    { id: 'automation', icon: '⚡', label: 'Automatisation' },
  ],
};

const groupLabels = {
  main: 'Principal',
  communication: 'Communication',
  management: 'Gestion',
  intelligence: 'Intelligence',
};

// ─────────────────────────────────────────────────────────────────────────────
// SIDEBAR COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function Sidebar({
  navigation = defaultNavigation,
  currentPage,
  onNavigate,
  collapsed = false,
  onToggleCollapse,
  favorites = [],
  onToggleFavorite,
  compactMode = false,
}) {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [expandedGroups, setExpandedGroups] = useState(['main', 'communication', 'management', 'intelligence']);

  const toggleGroup = useCallback((groupId) => {
    setExpandedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(g => g !== groupId)
        : [...prev, groupId]
    );
  }, []);

  const sidebarWidth = collapsed ? '64px' : compactMode ? '200px' : '260px';

  return (
    <aside
      data-tour="sidebar"
      role="navigation"
      aria-label="Navigation principale"
      style={{
        width: sidebarWidth,
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        background: colors.background.primary,
        borderRight: `1px solid ${colors.border.default}`,
        display: 'flex',
        flexDirection: 'column',
        transition: `width ${transitions.default}`,
        zIndex: zIndex.sidebar,
        overflow: 'hidden',
      }}
    >
      {/* Logo */}
      <div style={{
        padding: collapsed ? space.md : `${space.lg} ${space.md}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        borderBottom: `1px solid ${colors.border.subtle}`,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: space.sm,
        }}>
          {/* Pyramide Logo */}
          <div style={{
            width: '36px',
            height: '36px',
            background: `linear-gradient(135deg, ${colors.sacredGold} 0%, #B8924A 100%)`,
            borderRadius: radius.md,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: shadows.gold,
          }}>
            <svg width="20" height="20" viewBox="0 0 100 100">
              <path
                d="M50 15 L80 75 L20 75 Z"
                fill={colors.darkSlate}
                opacity="0.9"
              />
              <path
                d="M50 15 L80 75 L50 60 Z"
                fill={colors.darkSlate}
                opacity="0.6"
              />
            </svg>
          </div>
          
          {/* Text Logo */}
          {!collapsed && (
            <div style={{
              fontFamily: typography.fontFamily.logo,
              fontSize: '20px',
              fontWeight: typography.fontWeight.bold,
              letterSpacing: '-0.02em',
            }}>
              <span style={{ color: colors.sacredGold }}>CHE</span>
              <span style={{ 
                display: 'inline-block',
                width: '6px',
                height: '6px',
                background: colors.jungleEmerald,
                borderRadius: '50%',
                margin: '0 4px',
                verticalAlign: 'middle',
              }} />
              <span style={{ color: colors.text.primary }}>NU</span>
            </div>
          )}
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={onToggleCollapse}
        aria-label={collapsed ? 'Ouvrir le menu' : 'Réduire le menu'}
        aria-expanded={!collapsed}
        style={{
          position: 'absolute',
          right: '-12px',
          top: '60px',
          width: '24px',
          height: '24px',
          background: colors.background.secondary,
          border: `1px solid ${colors.border.default}`,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: colors.text.secondary,
          fontSize: '12px',
          zIndex: 10,
          transition: transitions.fast,
          boxShadow: shadows.sm,
        }}
      >
        {collapsed ? '→' : '←'}
      </button>

      {/* Favorites Section */}
      {favorites.length > 0 && (
        <div style={{
          padding: `${space.sm} ${collapsed ? space.xs : space.sm}`,
          borderBottom: `1px solid ${colors.border.subtle}`,
        }}>
          {!collapsed && (
            <div style={{
              padding: `${space.xs} ${space.sm}`,
              fontSize: typography.fontSize.xs,
              fontWeight: typography.fontWeight.semibold,
              color: colors.text.muted,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              display: 'flex',
              alignItems: 'center',
              gap: space.xs,
            }}>
              <span>⭐</span>
              Favoris
            </div>
          )}
          {favorites.map(fav => {
            const item = Object.values(navigation).flat().find(n => n.id === fav);
            if (!item) return null;
            return (
              <NavItem
                key={item.id}
                {...item}
                isActive={currentPage === item.id}
                collapsed={collapsed}
                onClick={() => onNavigate?.(item.id)}
                onHover={setHoveredItem}
                hoveredItem={hoveredItem}
                isFavorite
                onToggleFavorite={onToggleFavorite}
              />
            );
          })}
        </div>
      )}

      {/* Navigation Groups */}
      <nav style={{
        flex: 1,
        overflow: 'auto',
        padding: `${space.sm} 0`,
      }}>
        {Object.entries(navigation).map(([groupId, items]) => (
          <NavGroup
            key={groupId}
            groupId={groupId}
            label={groupLabels[groupId] || groupId}
            items={items}
            currentPage={currentPage}
            collapsed={collapsed}
            expanded={expandedGroups.includes(groupId)}
            onToggle={() => toggleGroup(groupId)}
            onNavigate={onNavigate}
            hoveredItem={hoveredItem}
            onHover={setHoveredItem}
            favorites={favorites}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </nav>

      {/* Bottom Section */}
      <div style={{
        padding: collapsed ? space.sm : space.md,
        borderTop: `1px solid ${colors.border.subtle}`,
      }}>
        <NavItem
          id="settings"
          icon="⚙️"
          label="Paramètres"
          isActive={currentPage === 'settings'}
          collapsed={collapsed}
          onClick={() => onNavigate?.('settings')}
          onHover={setHoveredItem}
          hoveredItem={hoveredItem}
        />
        
        {!collapsed && (
          <div style={{
            marginTop: space.md,
            padding: space.sm,
            background: colors.background.tertiary,
            borderRadius: radius.md,
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: typography.fontSize.xs,
              color: colors.text.muted,
            }}>
              CHE·NU™ v2.0
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NAV GROUP
// ─────────────────────────────────────────────────────────────────────────────

function NavGroup({
  groupId,
  label,
  items,
  currentPage,
  collapsed,
  expanded,
  onToggle,
  onNavigate,
  hoveredItem,
  onHover,
  favorites,
  onToggleFavorite,
}) {
  if (collapsed) {
    // En mode collapsed, afficher juste les icônes sans groupes
    return (
      <div style={{ padding: `${space.xs} ${space.xs}` }}>
        {items.map(item => (
          <NavItem
            key={item.id}
            {...item}
            isActive={currentPage === item.id}
            collapsed={collapsed}
            onClick={() => onNavigate?.(item.id)}
            onHover={onHover}
            hoveredItem={hoveredItem}
            isFavorite={favorites?.includes(item.id)}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    );
  }

  return (
    <div style={{ marginBottom: space.sm }}>
      {/* Group Header */}
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: `${space.xs} ${space.md}`,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: colors.text.muted,
        }}
      >
        <span style={{
          fontSize: typography.fontSize.xs,
          fontWeight: typography.fontWeight.semibold,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}>
          {label}
        </span>
        <span style={{
          fontSize: '10px',
          transition: transitions.fast,
          transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
        }}>
          ▾
        </span>
      </button>

      {/* Group Items */}
      {expanded && (
        <div style={{ padding: `0 ${space.xs}` }}>
          {items.map(item => (
            <NavItem
              key={item.id}
              {...item}
              isActive={currentPage === item.id}
              collapsed={collapsed}
              onClick={() => onNavigate?.(item.id)}
              onHover={onHover}
              hoveredItem={hoveredItem}
              isFavorite={favorites?.includes(item.id)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NAV ITEM
// ─────────────────────────────────────────────────────────────────────────────

function NavItem({
  id,
  icon,
  label,
  badge,
  shortcut,
  isActive,
  collapsed,
  onClick,
  onHover,
  hoveredItem,
  isFavorite,
  onToggleFavorite,
}) {
  const isHovered = hoveredItem === id;

  return (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={() => onHover?.(id)}
      onMouseLeave={() => onHover?.(null)}
    >
      <button
        onClick={onClick}
        aria-current={isActive ? 'page' : undefined}
        aria-label={label}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          gap: space.sm,
          padding: collapsed ? space.sm : `${space.sm} ${space.md}`,
          background: isActive 
            ? `${colors.sacredGold}15`
            : isHovered 
              ? colors.background.tertiary 
              : 'transparent',
          border: 'none',
          borderRadius: radius.md,
          borderLeft: isActive ? `3px solid ${colors.sacredGold}` : '3px solid transparent',
          cursor: 'pointer',
          color: isActive ? colors.sacredGold : colors.text.secondary,
          transition: transitions.fast,
          marginBottom: '2px',
        }}
      >
        {/* Icon */}
        <span style={{ 
          fontSize: collapsed ? '20px' : '18px',
          width: collapsed ? 'auto' : '24px',
          textAlign: 'center',
        }}>
          {icon}
        </span>
        
        {/* Label & Badge */}
        {!collapsed && (
          <>
            <span style={{
              flex: 1,
              textAlign: 'left',
              fontSize: typography.fontSize.sm,
              fontWeight: isActive ? typography.fontWeight.medium : typography.fontWeight.normal,
            }}>
              {label}
            </span>
            
            {badge && (
              <span style={{
                minWidth: '20px',
                height: '20px',
                padding: '0 6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: colors.status.error,
                color: '#FFFFFF',
                borderRadius: radius.full,
                fontSize: '11px',
                fontWeight: typography.fontWeight.semibold,
              }}>
                {badge > 99 ? '99+' : badge}
              </span>
            )}
          </>
        )}
      </button>

      {/* Tooltip en mode collapsed */}
      {collapsed && isHovered && (
        <div
          role="tooltip"
          style={{
            position: 'absolute',
            left: '100%',
            top: '50%',
            transform: 'translateY(-50%)',
            marginLeft: space.sm,
            padding: `${space.xs} ${space.sm}`,
            background: colors.background.elevated,
            border: `1px solid ${colors.border.default}`,
            borderRadius: radius.md,
            boxShadow: shadows.lg,
            whiteSpace: 'nowrap',
            zIndex: zIndex.tooltip,
            display: 'flex',
            alignItems: 'center',
            gap: space.sm,
          }}
        >
          <span style={{
            color: colors.text.primary,
            fontSize: typography.fontSize.sm,
          }}>
            {label}
          </span>
          
          {badge && (
            <span style={{
              padding: '2px 6px',
              background: colors.status.error,
              color: '#FFFFFF',
              borderRadius: radius.sm,
              fontSize: '10px',
              fontWeight: typography.fontWeight.semibold,
            }}>
              {badge}
            </span>
          )}
          
          {shortcut && (
            <kbd style={{
              padding: '2px 6px',
              background: colors.background.tertiary,
              borderRadius: radius.sm,
              fontSize: '10px',
              color: colors.text.muted,
              fontFamily: typography.fontFamily.mono,
            }}>
              {shortcut}
            </kbd>
          )}
        </div>
      )}

      {/* Favorite star (visible on hover) */}
      {!collapsed && isHovered && onToggleFavorite && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.(id);
          }}
          aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          style={{
            position: 'absolute',
            right: '8px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '12px',
            opacity: isFavorite ? 1 : 0.5,
            transition: transitions.fast,
          }}
        >
          {isFavorite ? '⭐' : '☆'}
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

export { NavItem, NavGroup, defaultNavigation, groupLabels };
