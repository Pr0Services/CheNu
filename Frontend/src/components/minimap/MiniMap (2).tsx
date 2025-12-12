// =============================================================================
// CHE·NU — MiniMap Component
// Foundation Freeze V1
// =============================================================================
// MiniMap - COMPOSANT OBLIGATOIRE
// Règles:
// - TOUJOURS visible
// - TOUJOURS lisible
// - Ne submerge JAMAIS
// - Orientation globale
// - Navigation rapide
// =============================================================================

import React, { useMemo, useCallback } from 'react';
import { MinimapNode, MinimapConfig, MinimapMode } from '../../types';
import { UNIVERSE_COLORS, CORE_CONFIG } from '../../config';

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

export interface MiniMapProps {
  /** Nodes à afficher */
  nodes: MinimapNode[];
  /** Configuration de la minimap */
  config: MinimapConfig;
  /** ID du node actuel */
  currentNodeId?: string | null;
  /** ID du node survolé */
  hoveredNodeId?: string | null;
  /** Dimensions */
  width?: number;
  height?: number;
  /** Handlers */
  onNodeClick?: (nodeId: string) => void;
  onNodeHover?: (nodeId: string | null) => void;
  /** Visible */
  isVisible?: boolean;
  /** Expanded */
  isExpanded?: boolean;
  /** Classes CSS additionnelles */
  className?: string;
}

// -----------------------------------------------------------------------------
// STYLES
// -----------------------------------------------------------------------------

const minimapStyles = {
  container: {
    position: 'fixed' as const,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderRadius: '12px',
    padding: '8px',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    transition: 'all 0.3s ease-out',
    overflow: 'hidden',
    zIndex: 1000,
  },
  canvas: {
    display: 'block',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '6px',
    paddingBottom: '6px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: '10px',
    fontWeight: 600,
    color: UNIVERSE_COLORS.text.secondary,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  tooltip: {
    position: 'absolute' as const,
    padding: '4px 8px',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderRadius: '4px',
    fontSize: '11px',
    color: 'white',
    whiteSpace: 'nowrap' as const,
    pointerEvents: 'none' as const,
    zIndex: 1001,
  }
};

// -----------------------------------------------------------------------------
// POSITION MAPPING
// -----------------------------------------------------------------------------

const POSITION_STYLES: Record<MinimapConfig['position'], React.CSSProperties> = {
  'top-left': { top: 16, left: 16 },
  'top-right': { top: 16, right: 16 },
  'bottom-left': { bottom: 16, left: 16 },
  'bottom-right': { bottom: 16, right: 16 },
};

const SIZE_DIMENSIONS: Record<MinimapConfig['size'], { width: number; height: number }> = {
  small: { width: 120, height: 120 },
  medium: { width: 160, height: 160 },
  large: { width: 220, height: 220 },
};

// -----------------------------------------------------------------------------
// HELPER FUNCTIONS
// -----------------------------------------------------------------------------

function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleRadians: number
): { x: number; y: number } {
  return {
    x: centerX + radius * Math.cos(angleRadians),
    y: centerY + radius * Math.sin(angleRadians),
  };
}

function getNodeColor(node: MinimapNode): string {
  if (node.type === 'core') return CORE_CONFIG.color;
  if (node.type === 'agent') return '#6B7280';
  // Sphere colors - would come from config in real impl
  return '#3B82F6';
}

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------

export const MiniMap: React.FC<MiniMapProps> = ({
  nodes,
  config,
  currentNodeId = null,
  hoveredNodeId = null,
  width: propWidth,
  height: propHeight,
  onNodeClick,
  onNodeHover,
  isVisible = true,
  isExpanded = false,
  className = ''
}) => {
  // Dimensions
  const dimensions = useMemo(() => {
    const sizeConfig = SIZE_DIMENSIONS[config.size];
    return {
      width: propWidth || sizeConfig.width,
      height: propHeight || sizeConfig.height,
    };
  }, [config.size, propWidth, propHeight]);

  const centerX = dimensions.width / 2;
  const centerY = dimensions.height / 2;
  const maxRadius = Math.min(centerX, centerY) - 10;

  // Filter nodes based on mode
  const visibleNodes = useMemo(() => {
    if (config.mode === 'ring') {
      return nodes.filter(n => n.type === 'core' || n.type === 'sphere');
    }
    if (config.mode === 'compact') {
      return nodes.filter(n => 
        n.type === 'core' || 
        n.type === 'sphere' || 
        (n.type === 'agent' && n.activity > 0.5)
      );
    }
    return nodes;
  }, [nodes, config.mode]);

  // Calculate node positions
  const nodePositions = useMemo(() => {
    return visibleNodes.map(node => {
      const { x, y } = polarToCartesian(
        centerX,
        centerY,
        node.radius * maxRadius,
        node.angle - Math.PI / 2 // Adjust to start from top
      );
      
      const size = node.type === 'core' 
        ? 12 
        : node.type === 'sphere' 
          ? 8 + node.size * 6 
          : 4;

      return {
        ...node,
        x,
        y,
        displaySize: size,
      };
    });
  }, [visibleNodes, centerX, centerY, maxRadius]);

  // Render node
  const renderNode = useCallback((node: typeof nodePositions[0]) => {
    const isCurrent = node.id === currentNodeId;
    const isHovered = node.id === hoveredNodeId;
    const color = getNodeColor(node);
    
    // Size adjustments
    let size = node.displaySize;
    if (isCurrent) size *= 1.3;
    if (isHovered) size *= 1.2;

    return (
      <g
        key={node.id}
        transform={`translate(${node.x}, ${node.y})`}
        style={{ cursor: 'pointer' }}
        onClick={() => onNodeClick?.(node.id)}
        onMouseEnter={() => onNodeHover?.(node.id)}
        onMouseLeave={() => onNodeHover?.(null)}
      >
        {/* Glow for current/hovered */}
        {(isCurrent || isHovered) && (
          <circle
            r={size + 4}
            fill="none"
            stroke={color}
            strokeWidth={2}
            opacity={0.5}
          />
        )}
        
        {/* Pulse for notifications */}
        {node.isPulsing && (
          <circle
            r={size + 2}
            fill="none"
            stroke="#EF4444"
            strokeWidth={2}
            opacity={0.8}
          >
            <animate
              attributeName="r"
              from={size}
              to={size + 8}
              dur="1s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              from="0.8"
              to="0"
              dur="1s"
              repeatCount="indefinite"
            />
          </circle>
        )}
        
        {/* Main circle */}
        <circle
          r={size}
          fill={color}
          opacity={node.activity * 0.5 + 0.5}
          stroke={isCurrent ? 'white' : 'none'}
          strokeWidth={isCurrent ? 2 : 0}
        />
        
        {/* Emoji for core and spheres */}
        {node.type !== 'agent' && (
          <text
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={size * 0.8}
            style={{ pointerEvents: 'none' }}
          >
            {node.emoji}
          </text>
        )}
      </g>
    );
  }, [currentNodeId, hoveredNodeId, onNodeClick, onNodeHover]);

  // Connection lines (core to spheres)
  const renderConnections = useMemo(() => {
    const coreNode = nodePositions.find(n => n.type === 'core');
    if (!coreNode) return null;

    return nodePositions
      .filter(n => n.type === 'sphere')
      .map(sphere => (
        <line
          key={`conn-${sphere.id}`}
          x1={coreNode.x}
          y1={coreNode.y}
          x2={sphere.x}
          y2={sphere.y}
          stroke={UNIVERSE_COLORS.grid.dark}
          strokeWidth={1}
          strokeDasharray="2,2"
        />
      ));
  }, [nodePositions]);

  // Don't render if hidden
  if (!isVisible && config.mode === 'hidden') {
    return null;
  }

  return (
    <div
      className={`chenu-minimap ${className}`}
      style={{
        ...minimapStyles.container,
        ...POSITION_STYLES[config.position],
        width: dimensions.width + 16,
        height: dimensions.height + 36,
        opacity: isVisible ? config.opacity : 0,
        transform: isVisible ? 'scale(1)' : 'scale(0.9)',
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
    >
      {/* Header */}
      <div style={minimapStyles.header}>
        <span style={minimapStyles.title}>Universe</span>
        <span style={{ ...minimapStyles.title, opacity: 0.6 }}>
          {visibleNodes.length} nodes
        </span>
      </div>
      
      {/* Canvas */}
      <svg
        width={dimensions.width}
        height={dimensions.height}
        style={minimapStyles.canvas}
      >
        {/* Background */}
        <rect
          width={dimensions.width}
          height={dimensions.height}
          fill="transparent"
        />
        
        {/* Orbit guides */}
        {[0.3, 0.5, 0.7, 0.9].map(radius => (
          <circle
            key={`orbit-${radius}`}
            cx={centerX}
            cy={centerY}
            r={radius * maxRadius}
            fill="none"
            stroke={UNIVERSE_COLORS.grid.dark}
            strokeWidth={1}
            strokeDasharray="2,4"
          />
        ))}
        
        {/* Connections */}
        {renderConnections}
        
        {/* Nodes */}
        {nodePositions.map(renderNode)}
      </svg>
      
      {/* Tooltip for hovered node */}
      {hoveredNodeId && (
        <div
          style={{
            ...minimapStyles.tooltip,
            bottom: 4,
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          {nodes.find(n => n.id === hoveredNodeId)?.label}
        </div>
      )}
    </div>
  );
};

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

export default MiniMap;
