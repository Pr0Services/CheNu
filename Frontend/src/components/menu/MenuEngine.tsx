// =============================================================================
// CHE·NU — MenuEngine Component
// Foundation Freeze V1
// =============================================================================
// Menu Engine - navigation générée depuis JSON
// Règles:
// - AUCUNE navigation hardcodée
// - Priorité affecte la taille, pas l'existence
// - Nodes inactifs se réduisent gracieusement
// - Agents actifs influencent la visibilité du menu
// =============================================================================

import React, { useMemo, useCallback, useState } from 'react';
import { MenuNode, ViewMode, SphereId } from '../../types';
import { MENU_NODE_MAP, getChildNodes, sortNodesByPriority } from '../../config';
import { UNIVERSE_COLORS, SPHERE_CONFIGS } from '../../config';

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

export interface MenuEngineProps {
  /** Nodes visibles */
  nodes: MenuNode[];
  /** IDs des nodes étendus */
  expandedIds: Set<string>;
  /** ID du node sélectionné */
  selectedId: string | null;
  /** Mode de vue actuel */
  viewMode: ViewMode;
  /** Handlers */
  onNodeClick?: (node: MenuNode) => void;
  onNodeExpand?: (nodeId: string) => void;
  onNodeCollapse?: (nodeId: string) => void;
  /** Position du menu */
  position?: 'left' | 'right';
  /** Menu réduit */
  collapsed?: boolean;
  /** Classes CSS additionnelles */
  className?: string;
}

// -----------------------------------------------------------------------------
// STYLES
// -----------------------------------------------------------------------------

const menuStyles = {
  container: {
    position: 'fixed' as const,
    top: 0,
    height: '100vh',
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
    transition: 'all 0.3s ease-out',
    overflowY: 'auto' as const,
    overflowX: 'hidden' as const,
    zIndex: 100,
  },
  header: {
    padding: '16px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logo: {
    fontSize: '24px',
  },
  title: {
    fontSize: '18px',
    fontWeight: 700,
    color: UNIVERSE_COLORS.text.primary,
    letterSpacing: '-0.5px',
  },
  section: {
    padding: '8px 0',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  },
  sectionTitle: {
    padding: '8px 16px',
    fontSize: '10px',
    fontWeight: 600,
    color: UNIVERSE_COLORS.text.muted,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  nodeList: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  node: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 16px',
    cursor: 'pointer',
    transition: 'all 0.15s ease-out',
    borderLeft: '3px solid transparent',
  },
  nodeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderLeftColor: '#A855F7',
  },
  nodeHover: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  nodeEmoji: {
    fontSize: '18px',
    marginRight: '12px',
    width: '24px',
    textAlign: 'center' as const,
  },
  nodeLabel: {
    fontSize: '14px',
    fontWeight: 500,
    color: UNIVERSE_COLORS.text.primary,
    flex: 1,
  },
  nodeChevron: {
    fontSize: '12px',
    color: UNIVERSE_COLORS.text.muted,
    transition: 'transform 0.2s ease-out',
  },
  childList: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    paddingLeft: '16px',
    overflow: 'hidden',
    transition: 'all 0.2s ease-out',
  },
  childNode: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 16px',
    cursor: 'pointer',
    transition: 'all 0.15s ease-out',
    borderRadius: '6px',
    margin: '2px 8px',
  },
  badge: {
    padding: '2px 6px',
    borderRadius: '10px',
    fontSize: '10px',
    fontWeight: 600,
    marginLeft: 'auto',
  },
  footer: {
    padding: '16px',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    marginTop: 'auto',
  },
  viewModeToggle: {
    display: 'flex',
    gap: '4px',
    padding: '4px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
  },
  viewModeButton: {
    flex: 1,
    padding: '6px 12px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.15s ease-out',
  }
};

// -----------------------------------------------------------------------------
// SUB-COMPONENTS
// -----------------------------------------------------------------------------

interface MenuNodeItemProps {
  node: MenuNode;
  isExpanded: boolean;
  isSelected: boolean;
  depth: number;
  onNodeClick: (node: MenuNode) => void;
  onNodeExpand: (nodeId: string) => void;
  onNodeCollapse: (nodeId: string) => void;
  expandedIds: Set<string>;
  selectedId: string | null;
}

const MenuNodeItem: React.FC<MenuNodeItemProps> = ({
  node,
  isExpanded,
  isSelected,
  depth,
  onNodeClick,
  onNodeExpand,
  onNodeCollapse,
  expandedIds,
  selectedId
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const hasChildren = node.children && node.children.length > 0;
  const children = hasChildren ? getChildNodes(node.id, MENU_NODE_MAP) : [];
  
  // Get sphere color if this is a sphere node
  const sphereColor = useMemo(() => {
    if (node.type === 'sphere') {
      const sphereId = node.id.replace('sphere-', '') as SphereId;
      return SPHERE_CONFIGS[sphereId]?.color;
    }
    return null;
  }, [node.id, node.type]);

  const handleClick = () => {
    onNodeClick(node);
    if (hasChildren) {
      if (isExpanded) {
        onNodeCollapse(node.id);
      } else {
        onNodeExpand(node.id);
      }
    }
  };

  const nodeStyle: React.CSSProperties = {
    ...menuStyles.node,
    ...(isSelected ? menuStyles.nodeActive : {}),
    ...(isHovered && !isSelected ? menuStyles.nodeHover : {}),
    paddingLeft: `${16 + depth * 16}px`,
    borderLeftColor: isSelected && sphereColor ? sphereColor : isSelected ? '#A855F7' : 'transparent',
  };

  return (
    <li>
      <div
        style={nodeStyle}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role="button"
        tabIndex={0}
        aria-expanded={hasChildren ? isExpanded : undefined}
      >
        <span 
          style={{
            ...menuStyles.nodeEmoji,
            filter: sphereColor ? `drop-shadow(0 0 4px ${sphereColor})` : 'none',
          }}
        >
          {node.emoji}
        </span>
        <span style={menuStyles.nodeLabel}>{node.label}</span>
        {hasChildren && (
          <span 
            style={{
              ...menuStyles.nodeChevron,
              transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
            }}
          >
            ▶
          </span>
        )}
      </div>
      
      {/* Children */}
      {hasChildren && (
        <ul
          style={{
            ...menuStyles.childList,
            maxHeight: isExpanded ? `${children.length * 50}px` : '0',
            opacity: isExpanded ? 1 : 0,
          }}
        >
          {sortNodesByPriority(children).map(child => (
            <MenuNodeItem
              key={child.id}
              node={child}
              isExpanded={expandedIds.has(child.id)}
              isSelected={selectedId === child.id}
              depth={depth + 1}
              onNodeClick={onNodeClick}
              onNodeExpand={onNodeExpand}
              onNodeCollapse={onNodeCollapse}
              expandedIds={expandedIds}
              selectedId={selectedId}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

// -----------------------------------------------------------------------------
// MAIN COMPONENT
// -----------------------------------------------------------------------------

export const MenuEngine: React.FC<MenuEngineProps> = ({
  nodes,
  expandedIds,
  selectedId,
  viewMode,
  onNodeClick,
  onNodeExpand,
  onNodeCollapse,
  position = 'left',
  collapsed = false,
  className = ''
}) => {
  // Group nodes by type
  const groupedNodes = useMemo(() => {
    const trunk = nodes.filter(n => n.type === 'trunk' && !n.parentId);
    const spheres = nodes.filter(n => n.type === 'sphere');
    const tools = nodes.filter(n => n.type === 'tool');
    
    return { trunk, spheres, tools };
  }, [nodes]);

  const handleNodeClick = useCallback((node: MenuNode) => {
    onNodeClick?.(node);
  }, [onNodeClick]);

  const handleNodeExpand = useCallback((nodeId: string) => {
    onNodeExpand?.(nodeId);
  }, [onNodeExpand]);

  const handleNodeCollapse = useCallback((nodeId: string) => {
    onNodeCollapse?.(nodeId);
  }, [onNodeCollapse]);

  return (
    <nav
      className={`chenu-menu-engine ${className}`}
      style={{
        ...menuStyles.container,
        [position]: 0,
        width: collapsed ? '60px' : '260px',
      }}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Header */}
      <div style={menuStyles.header}>
        <span style={menuStyles.logo}>🌳</span>
        {!collapsed && <span style={menuStyles.title}>CHE·NU</span>}
      </div>
      
      {/* Trunk navigation */}
      <div style={menuStyles.section}>
        {!collapsed && <div style={menuStyles.sectionTitle}>Navigation</div>}
        <ul style={menuStyles.nodeList}>
          {sortNodesByPriority(groupedNodes.trunk).map(node => (
            <MenuNodeItem
              key={node.id}
              node={node}
              isExpanded={expandedIds.has(node.id)}
              isSelected={selectedId === node.id}
              depth={0}
              onNodeClick={handleNodeClick}
              onNodeExpand={handleNodeExpand}
              onNodeCollapse={handleNodeCollapse}
              expandedIds={expandedIds}
              selectedId={selectedId}
            />
          ))}
        </ul>
      </div>
      
      {/* Spheres */}
      <div style={menuStyles.section}>
        {!collapsed && <div style={menuStyles.sectionTitle}>Spheres</div>}
        <ul style={menuStyles.nodeList}>
          {sortNodesByPriority(groupedNodes.spheres).map(node => (
            <MenuNodeItem
              key={node.id}
              node={node}
              isExpanded={expandedIds.has(node.id)}
              isSelected={selectedId === node.id}
              depth={0}
              onNodeClick={handleNodeClick}
              onNodeExpand={handleNodeExpand}
              onNodeCollapse={handleNodeCollapse}
              expandedIds={expandedIds}
              selectedId={selectedId}
            />
          ))}
        </ul>
      </div>
      
      {/* Tools */}
      {!collapsed && groupedNodes.tools.length > 0 && (
        <div style={menuStyles.section}>
          <div style={menuStyles.sectionTitle}>Tools</div>
          <ul style={menuStyles.nodeList}>
            {groupedNodes.tools.map(node => (
              <MenuNodeItem
                key={node.id}
                node={node}
                isExpanded={false}
                isSelected={selectedId === node.id}
                depth={0}
                onNodeClick={handleNodeClick}
                onNodeExpand={handleNodeExpand}
                onNodeCollapse={handleNodeCollapse}
                expandedIds={expandedIds}
                selectedId={selectedId}
              />
            ))}
          </ul>
        </div>
      )}
      
      {/* Footer with view mode toggle */}
      {!collapsed && (
        <div style={menuStyles.footer}>
          <div style={menuStyles.viewModeToggle}>
            {(['2d', '3d', 'xr'] as ViewMode[]).map(mode => (
              <button
                key={mode}
                style={{
                  ...menuStyles.viewModeButton,
                  backgroundColor: viewMode === mode ? '#A855F7' : 'transparent',
                  color: viewMode === mode ? 'white' : UNIVERSE_COLORS.text.muted,
                }}
              >
                {mode.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

export default MenuEngine;
