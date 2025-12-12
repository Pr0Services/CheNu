// =============================================================================
// CHE·NU — UniverseView Component
// Foundation Freeze V1
// =============================================================================
// Vue Univers - COUCHE DE NAVIGATION PRINCIPALE
// Règles:
// - Mêmes données en 2D / 3D / XR
// - Seule la représentation change
// - Sphères = clusters
// - Catégories = sous-nodes
// - Agents = particules orbitantes
// - Densité des données = taille + gravité
// - Activité = mouvement
// =============================================================================

import React, { useMemo, useCallback, useState, useRef, useEffect } from 'react';
import { 
  ViewMode, 
  SphereId, 
  SphereVisualData, 
  AgentVisualData,
  MinimapNode 
} from '../../types';
import { 
  UNIVERSE_DIMENSIONS, 
  ORBIT_LEVELS, 
  UNIVERSE_COLORS,
  CORE_CONFIG 
} from '../../config';
import { Core } from '../core/Core';
import { Sphere } from '../spheres/Sphere';
import { AgentOrbit } from '../agents/AgentOrbit';

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

export interface UniverseViewProps {
  /** Mode de vue */
  mode: ViewMode;
  /** Données visuelles des sphères */
  spheres: SphereVisualData[];
  /** Données visuelles des agents */
  agents: AgentVisualData[];
  /** ID de la sphère focalisée */
  focusedSphereId: SphereId | null;
  /** ID de la sphère survolée */
  hoveredSphereId: SphereId | null;
  /** Handlers */
  onSphereClick?: (sphereId: SphereId) => void;
  onSphereHover?: (sphereId: SphereId | null) => void;
  onAgentClick?: (agentId: string) => void;
  onCoreClick?: () => void;
  /** Dimensions */
  width?: number;
  height?: number;
  /** Afficher les agents */
  showAgents?: boolean;
  /** Afficher les labels */
  showLabels?: boolean;
  /** Afficher les connexions */
  showConnections?: boolean;
  /** Classes CSS additionnelles */
  className?: string;
}

// -----------------------------------------------------------------------------
// STYLES
// -----------------------------------------------------------------------------

const universeStyles = {
  container: {
    position: 'relative' as const,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    backgroundColor: UNIVERSE_COLORS.background.dark,
  },
  canvas: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  starfield: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0.3,
    pointerEvents: 'none' as const,
  },
  gridOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none' as const,
  },
  modeIndicator: {
    position: 'absolute' as const,
    top: 16,
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '6px 16px',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 600,
    color: UNIVERSE_COLORS.text.primary,
    letterSpacing: '1px',
    textTransform: 'uppercase' as const,
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  focusInfo: {
    position: 'absolute' as const,
    bottom: 16,
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '8px 20px',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: '12px',
    fontSize: '14px',
    color: UNIVERSE_COLORS.text.primary,
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  }
};

// -----------------------------------------------------------------------------
// HELPER FUNCTIONS
// -----------------------------------------------------------------------------

function calculateSpherePosition(
  sphere: SphereVisualData,
  centerX: number,
  centerY: number,
  index: number,
  total: number
): { x: number; y: number } {
  const orbitRadius = ORBIT_LEVELS[sphere.sphere.orbitLevel as keyof typeof ORBIT_LEVELS]?.radius || 200;
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  
  return {
    x: centerX + Math.cos(angle) * orbitRadius,
    y: centerY + Math.sin(angle) * orbitRadius,
  };
}

// -----------------------------------------------------------------------------
// SUB-COMPONENTS
// -----------------------------------------------------------------------------

interface OrbitRingProps {
  level: number;
  centerX: number;
  centerY: number;
  radius: number;
}

const OrbitRing: React.FC<OrbitRingProps> = ({ level, centerX, centerY, radius }) => (
  <circle
    cx={centerX}
    cy={centerY}
    r={radius}
    fill="none"
    stroke={UNIVERSE_COLORS.grid.dark}
    strokeWidth={1}
    strokeDasharray="4,8"
    opacity={0.3 + (5 - level) * 0.1}
  />
);

interface ConnectionLineProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  isActive: boolean;
}

const ConnectionLine: React.FC<ConnectionLineProps> = ({ x1, y1, x2, y2, color, isActive }) => (
  <line
    x1={x1}
    y1={y1}
    x2={x2}
    y2={y2}
    stroke={color}
    strokeWidth={isActive ? 2 : 1}
    strokeDasharray={isActive ? 'none' : '4,4'}
    opacity={isActive ? 0.6 : 0.2}
  />
);

// -----------------------------------------------------------------------------
// MAIN COMPONENT
// -----------------------------------------------------------------------------

export const UniverseView: React.FC<UniverseViewProps> = ({
  mode,
  spheres,
  agents,
  focusedSphereId,
  hoveredSphereId,
  onSphereClick,
  onSphereHover,
  onAgentClick,
  onCoreClick,
  width: propWidth,
  height: propHeight,
  showAgents = true,
  showLabels = true,
  showConnections = true,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({
    width: propWidth || UNIVERSE_DIMENSIONS.width,
    height: propHeight || UNIVERSE_DIMENSIONS.height,
  });

  // Update dimensions on resize
  useEffect(() => {
    if (!containerRef.current) return;
    
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: propWidth || containerRef.current.clientWidth,
          height: propHeight || containerRef.current.clientHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [propWidth, propHeight]);

  const centerX = dimensions.width / 2;
  const centerY = dimensions.height / 2;

  // Calculate sphere positions
  const spherePositions = useMemo(() => {
    return spheres.map((sphere, index) => ({
      ...sphere,
      position: calculateSpherePosition(sphere, centerX, centerY, index, spheres.length),
    }));
  }, [spheres, centerX, centerY]);

  // Filter agents for visible spheres
  const visibleAgents = useMemo(() => {
    if (!showAgents) return [];
    
    return agents.filter(agent => {
      // Show all agents if no sphere is focused
      if (!focusedSphereId) return true;
      // Show agents for focused sphere
      return agent.parentSphere?.id === focusedSphereId;
    });
  }, [agents, showAgents, focusedSphereId]);

  // Focused sphere data
  const focusedSphere = useMemo(() => {
    if (!focusedSphereId) return null;
    return spherePositions.find(s => s.sphere.id === focusedSphereId);
  }, [spherePositions, focusedSphereId]);

  // Handlers
  const handleSphereClick = useCallback((sphereId: string) => {
    onSphereClick?.(sphereId as SphereId);
  }, [onSphereClick]);

  const handleSphereHover = useCallback((sphereId: string | null) => {
    onSphereHover?.(sphereId as SphereId | null);
  }, [onSphereHover]);

  const handleAgentClick = useCallback((agentId: string) => {
    onAgentClick?.(agentId);
  }, [onAgentClick]);

  return (
    <div
      ref={containerRef}
      className={`chenu-universe-view chenu-universe-${mode} ${className}`}
      style={universeStyles.container}
    >
      {/* SVG Layer for connections and orbit rings */}
      <svg
        style={universeStyles.canvas}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
      >
        {/* Orbit rings */}
        {Object.entries(ORBIT_LEVELS).map(([level, config]) => (
          <OrbitRing
            key={`orbit-${level}`}
            level={parseInt(level)}
            centerX={centerX}
            centerY={centerY}
            radius={config.radius}
          />
        ))}

        {/* Connection lines */}
        {showConnections && spherePositions.map(sphere => (
          <ConnectionLine
            key={`conn-${sphere.sphere.id}`}
            x1={centerX}
            y1={centerY}
            x2={sphere.position.x}
            y2={sphere.position.y}
            color={sphere.sphere.color}
            isActive={sphere.isFocused || sphere.isHighlighted}
          />
        ))}
      </svg>

      {/* Core */}
      <div
        style={{
          position: 'absolute',
          left: centerX,
          top: centerY,
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
        }}
      >
        <Core
          size={80}
          glowIntensity={0.6}
          isActive={true}
          isFocused={!focusedSphereId}
          onClick={onCoreClick}
          mode={mode}
        />
      </div>

      {/* Spheres */}
      {spherePositions.map(sphereData => (
        <Sphere
          key={sphereData.sphere.id}
          visualData={sphereData}
          baseSize={60}
          x={sphereData.position.x}
          y={sphereData.position.y}
          onClick={handleSphereClick}
          onHover={handleSphereHover}
          showLabel={showLabels}
          showAgents={showAgents}
          mode={mode}
        />
      ))}

      {/* Agents */}
      {visibleAgents.map(agentData => {
        const parentSpherePos = spherePositions.find(
          s => s.sphere.id === agentData.parentSphere?.id
        );
        
        if (!parentSpherePos) return null;

        return (
          <AgentOrbit
            key={agentData.agent.id}
            visualData={agentData}
            centerX={parentSpherePos.position.x}
            centerY={parentSpherePos.position.y}
            orbitRadius={50}
            animated={true}
            onClick={handleAgentClick}
            mode={mode}
          />
        );
      })}

      {/* Mode indicator */}
      <div style={universeStyles.modeIndicator}>
        {mode === '2d' ? '2D View' : mode === '3d' ? '3D View' : 'XR Immersive'}
      </div>

      {/* Focus info */}
      {focusedSphere && (
        <div style={universeStyles.focusInfo}>
          <span style={{ fontSize: '20px' }}>{focusedSphere.sphere.emoji}</span>
          <span>{focusedSphere.sphere.label}</span>
          <span style={{ 
            fontSize: '11px', 
            opacity: 0.7,
            marginLeft: '8px' 
          }}>
            {visibleAgents.length} agents • {focusedSphere.sphere.categories.length} categories
          </span>
        </div>
      )}

      {/* Background stars effect */}
      <div style={universeStyles.starfield}>
        <svg width="100%" height="100%">
          <defs>
            <radialGradient id="starGlow">
              <stop offset="0%" stopColor="white" stopOpacity="1" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
          </defs>
          {Array.from({ length: 50 }).map((_, i) => (
            <circle
              key={`star-${i}`}
              cx={`${Math.random() * 100}%`}
              cy={`${Math.random() * 100}%`}
              r={Math.random() * 1.5 + 0.5}
              fill="white"
              opacity={Math.random() * 0.5 + 0.2}
            />
          ))}
        </svg>
      </div>

      {/* Styles */}
      <style>{`
        .chenu-universe-view {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .chenu-universe-3d {
          perspective: 1000px;
        }
        .chenu-universe-xr {
          perspective: 2000px;
        }
      `}</style>
    </div>
  );
};

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

export default UniverseView;
