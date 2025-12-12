/* =====================================================
   CHE·NU — Trunk Node (NOVA)
   
   PHASE 3: CENTRAL ORCHESTRATOR RENDERER
   
   The trunk is the central hub connecting all spheres.
   Renders based on universe.map.json configuration.
   ===================================================== */

import React, { memo, useMemo } from 'react';
import { useDimension, mapDimensionToStyles } from '../adapters/react';
import { ComplexityLevel, PermissionLevel } from '../../core-reference/resolver/types';

// ─────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────

export interface TrunkNodeProps {
  // Trunk config (from universe.map.json)
  config: {
    id: string;
    type: string;
    position: { layer: string; index: number };
  };
  
  // Connected spheres status
  connectedSpheres: {
    id: string;
    status: 'active' | 'idle' | 'dormant' | 'error';
    pendingTasks?: number;
  }[];
  
  // Context
  complexity?: ComplexityLevel;
  permission?: PermissionLevel;
  
  // Events
  onClick?: () => void;
  onSphereSelect?: (sphereId: string) => void;
  
  // Size
  size?: number;
}

// ─────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────

export const TrunkNode = memo(function TrunkNode(props: TrunkNodeProps) {
  const {
    config,
    connectedSpheres,
    complexity = 'standard',
    permission = 'read',
    onClick,
    onSphereSelect,
    size = 120,
  } = props;
  
  // Compute trunk metrics
  const metrics = useMemo(() => {
    const active = connectedSpheres.filter(s => s.status === 'active').length;
    const total = connectedSpheres.length;
    const pending = connectedSpheres.reduce((sum, s) => sum + (s.pendingTasks || 0), 0);
    const hasError = connectedSpheres.some(s => s.status === 'error');
    
    return { active, total, pending, hasError };
  }, [connectedSpheres]);
  
  // Determine triggers
  const triggers = useMemo(() => {
    const t: string[] = [];
    if (metrics.hasError) t.push('error');
    if (metrics.pending > 10) t.push('pendingApproval');
    return t;
  }, [metrics]);
  
  // Resolve dimension
  const { dimension, recordAction } = useDimension({
    content: {
      items: metrics.total,
      agents: metrics.active,
      processes: metrics.active,
      decisions: metrics.pending,
    },
    complexity,
    permission,
    triggers,
    depth: 0,
  });
  
  if (!dimension || !dimension.visible) {
    return null;
  }
  
  const mappedStyles = mapDimensionToStyles(dimension);
  
  // Trunk-specific styles
  const trunkStyles: React.CSSProperties = {
    ...mappedStyles.container,
    width: size * dimension.scale,
    height: size * dimension.scale,
    borderRadius: '50%',
    background: `radial-gradient(circle at 30% 30%, 
      ${metrics.hasError ? '#ff5252' : '#4a7c4a'} 0%, 
      ${metrics.hasError ? '#b71c1c' : '#1a3a1a'} 100%)`,
    boxShadow: `
      0 0 ${30 * dimension.scale}px ${metrics.hasError ? 'rgba(255,82,82,0.4)' : 'rgba(74,124,74,0.4)'},
      inset 0 0 ${20 * dimension.scale}px rgba(255,255,255,0.1)
    `,
    animation: mappedStyles.animation,
    transition: mappedStyles.transition,
    cursor: dimension.interactable ? 'pointer' : 'default',
  };
  
  const handleClick = () => {
    recordAction();
    onClick?.();
  };
  
  // Calculate connection points for spheres
  const connectionPoints = useMemo(() => {
    return connectedSpheres.map((sphere, index) => {
      const angle = (index / connectedSpheres.length) * Math.PI * 2 - Math.PI / 2;
      const radius = (size * dimension.scale) / 2 + 10;
      return {
        ...sphere,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        angle: angle * (180 / Math.PI),
      };
    });
  }, [connectedSpheres, size, dimension.scale]);
  
  return (
    <div 
      className={`trunk-node ${mappedStyles.className}`}
      style={{ position: 'relative', width: size * 2, height: size * 2 }}
    >
      {/* Connection lines */}
      <svg 
        className="trunk-node__connections"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        {connectionPoints.map((point) => (
          <line
            key={point.id}
            x1="50%"
            y1="50%"
            x2={`${50 + (point.x / (size * 2)) * 100}%`}
            y2={`${50 + (point.y / (size * 2)) * 100}%`}
            stroke={
              point.status === 'error' ? '#ff5252' :
              point.status === 'active' ? '#4caf50' :
              'rgba(255,255,255,0.2)'
            }
            strokeWidth={point.status === 'active' ? 2 : 1}
            strokeDasharray={point.status === 'dormant' ? '4,4' : 'none'}
          />
        ))}
      </svg>
      
      {/* Trunk core */}
      <button
        className="trunk-node__core"
        style={{
          ...trunkStyles,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) scale(${dimension.scale})`,
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
        }}
        onClick={dimension.interactable ? handleClick : undefined}
        aria-label={`NOVA trunk - ${metrics.active}/${metrics.total} spheres active`}
      >
        <span className="trunk-node__icon">🌳</span>
        <span className="trunk-node__label">{config.id.toUpperCase()}</span>
        <span className="trunk-node__status">
          {metrics.active}/{metrics.total}
        </span>
      </button>
      
      {/* Sphere connection points */}
      {connectionPoints.map((point) => (
        <button
          key={point.id}
          className={`trunk-node__connection trunk-node__connection--${point.status}`}
          style={{
            position: 'absolute',
            top: `calc(50% + ${point.y}px)`,
            left: `calc(50% + ${point.x}px)`,
            transform: 'translate(-50%, -50%)',
            width: 12,
            height: 12,
            borderRadius: '50%',
            border: '2px solid',
            borderColor: point.status === 'error' ? '#ff5252' :
                         point.status === 'active' ? '#4caf50' :
                         'rgba(255,255,255,0.3)',
            background: point.status === 'active' ? '#4caf50' : 'transparent',
            cursor: 'pointer',
            padding: 0,
          }}
          onClick={(e) => {
            e.stopPropagation();
            recordAction();
            onSphereSelect?.(point.id);
          }}
          title={`${point.id} - ${point.status}${point.pendingTasks ? ` (${point.pendingTasks} pending)` : ''}`}
        />
      ))}
      
      {/* Pending indicator */}
      {metrics.pending > 0 && (
        <div 
          className="trunk-node__pending"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `translate(${size * 0.3}px, ${-size * 0.3}px)`,
            background: '#ff9800',
            color: '#000',
            borderRadius: '10px',
            padding: '2px 8px',
            fontSize: '0.75rem',
            fontWeight: 'bold',
          }}
        >
          {metrics.pending}
        </div>
      )}
    </div>
  );
});

// ─────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────

export const trunkNodeStyles = `
  .trunk-node {
    position: relative;
  }
  
  .trunk-node__core {
    font-family: inherit;
  }
  
  .trunk-node__icon {
    font-size: 2rem;
    margin-bottom: 4px;
  }
  
  .trunk-node__label {
    font-size: 0.875rem;
    font-weight: 700;
    letter-spacing: 0.1em;
  }
  
  .trunk-node__status {
    font-size: 0.75rem;
    opacity: 0.8;
  }
  
  .trunk-node__connection {
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .trunk-node__connection:hover {
    transform: translate(-50%, -50%) scale(1.5);
    box-shadow: 0 0 10px currentColor;
  }
  
  .trunk-node__connection--active {
    animation: pulse-connection 2s ease-in-out infinite;
  }
  
  .trunk-node__connection--error {
    animation: pulse-error 0.5s ease-in-out infinite;
  }
  
  @keyframes pulse-connection {
    0%, 100% { box-shadow: 0 0 5px rgba(76, 175, 80, 0.5); }
    50% { box-shadow: 0 0 15px rgba(76, 175, 80, 0.8); }
  }
  
  @keyframes pulse-error {
    0%, 100% { box-shadow: 0 0 5px rgba(255, 82, 82, 0.5); }
    50% { box-shadow: 0 0 15px rgba(255, 82, 82, 1); }
  }
`;

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default TrunkNode;
