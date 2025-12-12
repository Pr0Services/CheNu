/* =====================================================
   CHE·NU — Universe View
   
   PHASE 3: COMPLETE UNIVERSE RENDERER
   
   Renders the entire CHE·NU universe:
   - Central trunk (NOVA)
   - All spheres in orbital layout
   - Connections between elements
   
   Layout is driven by universe.map.json
   ===================================================== */

import React, { memo, useState, useEffect, useMemo, useCallback } from 'react';
import { loadRegistry, preloadSpheres, useEngine } from '../adapters/react';
import { SphereCard } from './SphereCard';
import { TrunkNode } from './TrunkNode';
import { ComplexityLevel, PermissionLevel } from '../../core-reference/resolver/types';

// ─────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────

export interface UniverseConfig {
  topology: {
    type: string;
    center: string;
    layers: string[];
  };
  trunk: {
    id: string;
    type: string;
    position: { layer: string; index: number };
  };
  spheres: {
    order: string[];
    placement: Record<string, { layer: string; angle: number }>;
  };
  layers: Record<string, { radius: number; scale: number }>;
}

export interface SphereData {
  id: string;
  items: unknown[];
  agents: { id: string; name?: string; icon?: string }[];
  processes: { status?: string }[];
  decisions: { resolved?: boolean }[];
}

export interface UniverseViewProps {
  // Universe configuration (from universe.map.json)
  config: UniverseConfig;
  
  // Sphere data
  sphereData: Record<string, SphereData>;
  
  // User context
  complexity?: ComplexityLevel;
  permission?: PermissionLevel;
  
  // Events
  onSphereClick?: (sphereId: string) => void;
  onSphereEnter?: (sphereId: string) => void;
  onTrunkClick?: () => void;
  onAgentClick?: (sphereId: string, agentId: string) => void;
  
  // Layout
  width?: number;
  height?: number;
  
  // Options
  showConnections?: boolean;
  animateLayout?: boolean;
}

// ─────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────

export const UniverseView = memo(function UniverseView(props: UniverseViewProps) {
  const {
    config,
    sphereData,
    complexity = 'standard',
    permission = 'read',
    onSphereClick,
    onSphereEnter,
    onTrunkClick,
    onAgentClick,
    width = 800,
    height = 800,
    showConnections = true,
    animateLayout = true,
  } = props;
  
  const { isLoading: engineLoading } = useEngine();
  const [isPreloaded, setIsPreloaded] = useState(false);
  const [focusedSphere, setFocusedSphere] = useState<string | null>(null);
  
  // Preload all sphere configs
  useEffect(() => {
    preloadSpheres(config.spheres.order)
      .then(() => setIsPreloaded(true))
      .catch(console.error);
  }, [config.spheres.order]);
  
  // Calculate sphere positions
  const spherePositions = useMemo(() => {
    const centerX = width / 2;
    const centerY = height / 2;
    
    return config.spheres.order.map(sphereId => {
      const placement = config.spheres.placement[sphereId];
      if (!placement) return null;
      
      const layerConfig = config.layers[placement.layer];
      if (!layerConfig) return null;
      
      const angleRad = (placement.angle * Math.PI) / 180;
      const radius = layerConfig.radius;
      
      return {
        id: sphereId,
        x: centerX + Math.cos(angleRad) * radius,
        y: centerY + Math.sin(angleRad) * radius,
        scale: layerConfig.scale,
        layer: placement.layer,
        angle: placement.angle,
      };
    }).filter(Boolean) as {
      id: string;
      x: number;
      y: number;
      scale: number;
      layer: string;
      angle: number;
    }[];
  }, [config, width, height]);
  
  // Compute trunk's connected spheres
  const connectedSpheres = useMemo(() => {
    return config.spheres.order.map(sphereId => {
      const data = sphereData[sphereId];
      const hasActivity = data && (
        data.processes.some(p => p.status === 'active') ||
        data.decisions.some(d => !d.resolved)
      );
      
      return {
        id: sphereId,
        status: !data ? 'dormant' as const :
                hasActivity ? 'active' as const :
                'idle' as const,
        pendingTasks: data?.decisions.filter(d => !d.resolved).length || 0,
      };
    });
  }, [config.spheres.order, sphereData]);
  
  // Event handlers
  const handleSphereClick = useCallback((sphereId: string) => {
    setFocusedSphere(sphereId);
    onSphereClick?.(sphereId);
  }, [onSphereClick]);
  
  const handleSphereEnter = useCallback((sphereId: string) => {
    onSphereEnter?.(sphereId);
  }, [onSphereEnter]);
  
  const handleAgentClick = useCallback((sphereId: string) => (agentId: string) => {
    onAgentClick?.(sphereId, agentId);
  }, [onAgentClick]);
  
  // Loading state
  if (engineLoading || !isPreloaded) {
    return (
      <div 
        className="universe-view universe-view--loading"
        style={{ width, height }}
      >
        <div className="universe-view__loader">
          <span>🌌</span>
          <p>Loading universe...</p>
        </div>
      </div>
    );
  }
  
  const centerX = width / 2;
  const centerY = height / 2;
  
  return (
    <div 
      className="universe-view"
      style={{ 
        width, 
        height, 
        position: 'relative',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at center, #0a0e0a 0%, #000 100%)',
      }}
    >
      {/* Background stars */}
      <div className="universe-view__stars" />
      
      {/* Connection lines */}
      {showConnections && (
        <svg 
          className="universe-view__connections"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
        >
          {/* Trunk to sphere connections */}
          {spherePositions.map(sphere => (
            <line
              key={`trunk-${sphere.id}`}
              x1={centerX}
              y1={centerY}
              x2={sphere.x}
              y2={sphere.y}
              stroke={
                focusedSphere === sphere.id 
                  ? 'rgba(74, 124, 74, 0.6)'
                  : 'rgba(74, 124, 74, 0.15)'
              }
              strokeWidth={focusedSphere === sphere.id ? 2 : 1}
              strokeDasharray={sphere.layer === 'peripheral' ? '5,5' : 'none'}
              className={animateLayout ? 'universe-view__connection-line' : ''}
            />
          ))}
          
          {/* Layer rings */}
          {Object.entries(config.layers).map(([layer, layerConfig]) => (
            <circle
              key={layer}
              cx={centerX}
              cy={centerY}
              r={layerConfig.radius}
              fill="none"
              stroke="rgba(74, 124, 74, 0.1)"
              strokeWidth={1}
              strokeDasharray="10,10"
            />
          ))}
        </svg>
      )}
      
      {/* Central Trunk */}
      <div
        style={{
          position: 'absolute',
          top: centerY,
          left: centerX,
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
        }}
      >
        <TrunkNode
          config={config.trunk}
          connectedSpheres={connectedSpheres}
          complexity={complexity}
          permission={permission}
          onClick={onTrunkClick}
          onSphereSelect={handleSphereClick}
          size={80}
        />
      </div>
      
      {/* Spheres */}
      {spherePositions.map(sphere => {
        const data = sphereData[sphere.id] || {
          items: [],
          agents: [],
          processes: [],
          decisions: [],
        };
        
        const isFocused = focusedSphere === sphere.id;
        const sphereWidth = 200 * sphere.scale * (isFocused ? 1.2 : 1);
        
        return (
          <div
            key={sphere.id}
            className={`universe-view__sphere ${isFocused ? 'universe-view__sphere--focused' : ''}`}
            style={{
              position: 'absolute',
              top: sphere.y,
              left: sphere.x,
              transform: `translate(-50%, -50%) scale(${sphere.scale})`,
              width: sphereWidth,
              zIndex: isFocused ? 20 : 5,
              transition: animateLayout ? 'all 0.3s ease' : 'none',
            }}
          >
            <SphereCard
              sphereId={sphere.id}
              items={data.items}
              agents={data.agents}
              processes={data.processes}
              decisions={data.decisions}
              complexity={complexity}
              permission={permission}
              depth={0}
              onClick={handleSphereClick}
              onEnter={handleSphereEnter}
              onAgentClick={handleAgentClick(sphere.id)}
            />
          </div>
        );
      })}
      
      {/* Focus overlay */}
      {focusedSphere && (
        <button
          className="universe-view__overlay"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.5)',
            border: 'none',
            cursor: 'pointer',
            zIndex: 15,
          }}
          onClick={() => setFocusedSphere(null)}
          aria-label="Close focus"
        />
      )}
    </div>
  );
});

// ─────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────

export const universeViewStyles = `
  .universe-view {
    border-radius: 16px;
    border: 1px solid rgba(74, 124, 74, 0.2);
  }
  
  .universe-view--loading {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .universe-view__loader {
    text-align: center;
    color: rgba(255, 255, 255, 0.6);
  }
  
  .universe-view__loader span {
    font-size: 3rem;
    display: block;
    animation: float 2s ease-in-out infinite;
  }
  
  .universe-view__stars {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      radial-gradient(2px 2px at 20px 30px, rgba(255,255,255,0.3), transparent),
      radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.2), transparent),
      radial-gradient(1px 1px at 90px 40px, rgba(255,255,255,0.4), transparent),
      radial-gradient(2px 2px at 160px 120px, rgba(255,255,255,0.2), transparent),
      radial-gradient(1px 1px at 230px 80px, rgba(255,255,255,0.3), transparent);
    background-size: 250px 250px;
    animation: twinkle 4s ease-in-out infinite;
    pointer-events: none;
  }
  
  .universe-view__connection-line {
    animation: pulse-line 3s ease-in-out infinite;
  }
  
  .universe-view__sphere {
    transition: transform 0.3s ease, z-index 0.3s ease;
  }
  
  .universe-view__sphere:hover {
    z-index: 25 !important;
  }
  
  .universe-view__sphere--focused {
    z-index: 30 !important;
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes twinkle {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
  
  @keyframes pulse-line {
    0%, 100% { stroke-opacity: 0.15; }
    50% { stroke-opacity: 0.3; }
  }
`;

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default UniverseView;
