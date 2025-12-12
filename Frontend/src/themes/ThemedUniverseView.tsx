/* =====================================================
   CHE·NU — Themed Universe View
   
   Main view component that integrates:
   - Universe context
   - Theme resolution
   - Canvas/spatial rendering
   - HUD elements
   
   Usage:
   <ThemedUniverseProvider>
     <ThemedUniverseView spheres={spheres} />
   </ThemedUniverseProvider>
   ===================================================== */

import React, { useMemo, useCallback } from 'react';
import { useThemedUniverse, useUniverseTheme } from './ThemedUniverseProvider';
import { getSphereColor, getSphereColorWithAlpha } from './universeTheme';
import { Theme } from './theme.types';

// ─────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────

export interface SphereData {
  id: string;
  name: string;
  type: 'business' | 'creative' | 'personal' | 'scholar';
  nodeCount?: number;
  activity?: number;  // 0-1
}

export interface ThemedUniverseViewProps {
  spheres: SphereData[];
  centerNode?: {
    id: string;
    name: string;
  };
  onSphereClick?: (sphereId: string) => void;
  onCenterClick?: () => void;
  showHUD?: boolean;
  showControls?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

// ─────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────

export const ThemedUniverseView: React.FC<ThemedUniverseViewProps> = ({
  spheres,
  centerNode = { id: 'nova', name: 'NOVA' },
  onSphereClick,
  onCenterClick,
  showHUD = true,
  showControls = true,
  className,
  style,
}) => {
  const { universe, theme, setActiveSphere, isTransitioning } = useThemedUniverse();
  
  const handleSphereClick = useCallback((sphereId: string) => {
    setActiveSphere(sphereId);
    onSphereClick?.(sphereId);
  }, [setActiveSphere, onSphereClick]);
  
  const handleCenterClick = useCallback(() => {
    setActiveSphere(undefined);
    onCenterClick?.();
  }, [setActiveSphere, onCenterClick]);
  
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: 500,
        background: theme.colors.background,
        overflow: 'hidden',
        transition: isTransitioning ? `background ${theme.effects.transition.slow}` : undefined,
        ...style,
      }}
    >
      {/* Background Effects */}
      <UniverseBackground theme={theme} universeType={universe.universeType} />
      
      {/* Main Canvas */}
      <UniverseCanvas
        theme={theme}
        spheres={spheres}
        centerNode={centerNode}
        activeSphereId={universe.activeSphereId}
        depthLevel={universe.depthLevel}
        onSphereClick={handleSphereClick}
        onCenterClick={handleCenterClick}
      />
      
      {/* HUD Overlay */}
      {showHUD && (
        <UniverseHUD
          theme={theme}
          universe={universe}
          activeSphere={spheres.find(s => s.id === universe.activeSphereId)}
        />
      )}
      
      {/* Controls */}
      {showControls && (
        <UniverseControls theme={theme} />
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────
// BACKGROUND EFFECTS
// ─────────────────────────────────────────────────────

const UniverseBackground: React.FC<{
  theme: Theme;
  universeType: string;
}> = ({ theme, universeType }) => {
  const custom = theme.custom as any;
  
  // Stars for cosmic theme
  const stars = useMemo(() => {
    if (universeType !== 'cosmic' || !custom?.stars?.enabled) return null;
    
    const count = custom?.stars?.density || 100;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.8 + 0.2,
      twinkle: custom?.stars?.twinkle && Math.random() > 0.7,
    }));
  }, [universeType, custom]);
  
  // Grid for futurist theme
  const showGrid = universeType === 'futurist' && custom?.grid?.enabled;
  
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
      }}
    >
      {/* Gradient overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at center, transparent 0%, ${theme.colors.background} 70%)`,
        }}
      />
      
      {/* Stars */}
      {stars && (
        <svg
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          xmlns="http://www.w3.org/2000/svg"
        >
          {stars.map(star => (
            <circle
              key={star.id}
              cx={`${star.x}%`}
              cy={`${star.y}%`}
              r={star.size}
              fill={theme.colors.textPrimary}
              opacity={star.opacity}
              style={star.twinkle ? {
                animation: `twinkle ${2 + Math.random() * 2}s ease-in-out infinite`,
              } : undefined}
            />
          ))}
        </svg>
      )}
      
      {/* Grid */}
      {showGrid && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(${custom.grid.color} 1px, transparent 1px),
              linear-gradient(90deg, ${custom.grid.color} 1px, transparent 1px)
            `,
            backgroundSize: `${custom.grid.size}px ${custom.grid.size}px`,
          }}
        />
      )}
      
      {/* Scanlines for futurist */}
      {universeType === 'futurist' && custom?.scanlines && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, transparent 1px, transparent 2px)',
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────
// CANVAS
// ─────────────────────────────────────────────────────

const UniverseCanvas: React.FC<{
  theme: Theme;
  spheres: SphereData[];
  centerNode: { id: string; name: string };
  activeSphereId?: string;
  depthLevel: number;
  onSphereClick: (id: string) => void;
  onCenterClick: () => void;
}> = ({
  theme,
  spheres,
  centerNode,
  activeSphereId,
  depthLevel,
  onSphereClick,
  onCenterClick,
}) => {
  const { orbit, nodeSize } = theme.spatial;
  
  // Calculate positions
  const spherePositions = useMemo(() => {
    return spheres.map((sphere, index) => {
      const angle = (Math.PI * 2 * index) / spheres.length - Math.PI / 2;
      const radius = orbit.minRadius + (orbit.maxRadius - orbit.minRadius) * 0.5;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      return { ...sphere, x, y, angle };
    });
  }, [spheres, orbit]);
  
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Connection lines */}
      <svg
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        {spherePositions.map(sphere => (
          <line
            key={`line-${sphere.id}`}
            x1="50%"
            y1="50%"
            x2={`calc(50% + ${sphere.x}px)`}
            y2={`calc(50% + ${sphere.y}px)`}
            stroke={getSphereColorWithAlpha(theme, sphere.type, 0.2)}
            strokeWidth={sphere.id === activeSphereId ? 2 : 1}
            strokeDasharray={sphere.id === activeSphereId ? undefined : '4 4'}
          />
        ))}
      </svg>
      
      {/* Center node (NOVA) */}
      <div
        onClick={onCenterClick}
        style={{
          position: 'absolute',
          width: nodeSize.trunk,
          height: nodeSize.trunk,
          borderRadius: theme.borders.radius.full,
          background: `radial-gradient(circle, ${theme.colors.accent} 0%, ${theme.colors.primary} 100%)`,
          border: `3px solid ${theme.colors.accent}`,
          boxShadow: theme.effects.shadow.glow,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: theme.effects.transition.spring,
          transform: !activeSphereId ? `scale(${theme.spatial.animation.activeScale})` : 'scale(1)',
          zIndex: 10,
        }}
      >
        <span
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: theme.colors.textInverse,
            letterSpacing: theme.typography.letterSpacing.wider,
            fontFamily: theme.typography.fontFamily.display,
          }}
        >
          {centerNode.name}
        </span>
      </div>
      
      {/* Sphere nodes */}
      {spherePositions.map(sphere => (
        <SphereNode
          key={sphere.id}
          sphere={sphere}
          theme={theme}
          isActive={sphere.id === activeSphereId}
          x={sphere.x}
          y={sphere.y}
          onClick={() => onSphereClick(sphere.id)}
        />
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────
// SPHERE NODE
// ─────────────────────────────────────────────────────

const SphereNode: React.FC<{
  sphere: SphereData;
  theme: Theme;
  isActive: boolean;
  x: number;
  y: number;
  onClick: () => void;
}> = ({ sphere, theme, isActive, x, y, onClick }) => {
  const color = getSphereColor(theme, sphere.type);
  const size = isActive ? theme.spatial.nodeSize.large : theme.spatial.nodeSize.medium;
  
  return (
    <div
      onClick={onClick}
      style={{
        position: 'absolute',
        left: `calc(50% + ${x}px)`,
        top: `calc(50% + ${y}px)`,
        transform: `translate(-50%, -50%) scale(${isActive ? theme.spatial.animation.activeScale : 1})`,
        width: size,
        height: size,
        borderRadius: theme.borders.radius.full,
        background: isActive
          ? `radial-gradient(circle, ${color} 0%, ${getSphereColorWithAlpha(theme, sphere.type, 0.5)} 100%)`
          : theme.colors.surface,
        border: `2px solid ${color}`,
        boxShadow: isActive ? `0 0 30px ${getSphereColorWithAlpha(theme, sphere.type, 0.5)}` : theme.effects.shadow.sm,
        cursor: 'pointer',
        transition: theme.effects.transition.spring,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        zIndex: isActive ? 5 : 1,
      }}
    >
      <span
        style={{
          fontSize: isActive ? 12 : 10,
          fontWeight: 600,
          color: isActive ? theme.colors.textInverse : theme.colors.textPrimary,
          textAlign: 'center',
          fontFamily: theme.typography.fontFamily.heading,
        }}
      >
        {sphere.name}
      </span>
      {sphere.nodeCount && (
        <span
          style={{
            fontSize: 9,
            opacity: 0.7,
            color: isActive ? theme.colors.textInverse : theme.colors.textMuted,
          }}
        >
          {sphere.nodeCount} nodes
        </span>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────
// HUD
// ─────────────────────────────────────────────────────

const UniverseHUD: React.FC<{
  theme: Theme;
  universe: any;
  activeSphere?: SphereData;
}> = ({ theme, universe, activeSphere }) => {
  return (
    <>
      {/* Top left: Universe info */}
      <div
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          padding: 12,
          background: theme.colors.surface,
          borderRadius: theme.borders.radius.md,
          border: theme.borders.style.subtle,
          fontSize: 12,
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: 4, fontFamily: theme.typography.fontFamily.heading }}>
          {universe.universeType.toUpperCase()} UNIVERSE
        </div>
        <div style={{ opacity: 0.7 }}>
          Depth: {universe.depthLevel} / 5
        </div>
      </div>
      
      {/* Top right: Active sphere */}
      {activeSphere && (
        <div
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            padding: 12,
            background: theme.colors.surface,
            borderRadius: theme.borders.radius.md,
            border: `2px solid ${getSphereColor(theme, activeSphere.type)}`,
            fontSize: 12,
            minWidth: 150,
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 4 }}>
            {activeSphere.name}
          </div>
          <div style={{ opacity: 0.7 }}>
            Type: {activeSphere.type}
          </div>
          {activeSphere.nodeCount && (
            <div style={{ opacity: 0.7 }}>
              Nodes: {activeSphere.nodeCount}
            </div>
          )}
        </div>
      )}
      
      {/* Bottom center: Instructions */}
      <div
        style={{
          position: 'absolute',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '8px 16px',
          background: theme.colors.surface,
          borderRadius: theme.borders.radius.md,
          fontSize: 11,
          opacity: 0.7,
        }}
      >
        Click a sphere to focus • Click center to reset
      </div>
    </>
  );
};

// ─────────────────────────────────────────────────────
// CONTROLS
// ─────────────────────────────────────────────────────

const UniverseControls: React.FC<{
  theme: Theme;
}> = ({ theme }) => {
  // Import from provider would cause circular dependency
  // So we just render a placeholder that the parent can fill
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 16,
        right: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      {/* Controls are rendered by parent using UniverseTypeSelector and DepthLevelSlider */}
    </div>
  );
};

// ─────────────────────────────────────────────────────
// CSS KEYFRAMES (would need to be added to stylesheet)
// ─────────────────────────────────────────────────────

export const universeKeyframes = `
@keyframes twinkle {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

@keyframes orbit {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
}
`;

export default ThemedUniverseView;
