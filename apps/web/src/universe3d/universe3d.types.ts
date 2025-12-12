/* =====================================================
   CHE·NU — Universe 3D Types
   PHASE 8: 3D Universe Visualization
   
   Types for Three.js/React Three Fiber integration.
   ===================================================== */

import { ThemeId } from '../themes/theme.types';

// ─────────────────────────────────────────────────────
// CORE 3D TYPES
// ─────────────────────────────────────────────────────

export type Vector3 = [number, number, number];
export type Color = string | number;

// ─────────────────────────────────────────────────────
// PHYSICS TYPES
// ─────────────────────────────────────────────────────

/**
 * Physical properties for force-directed simulation.
 */
export interface PhysicsBody {
  mass: number;           // Affects gravitational pull
  velocity: Vector3;      // Current movement
  acceleration: Vector3;  // Forces applied
  damping: number;        // Velocity decay (0-1)
  fixed: boolean;         // If true, doesn't move
}

/**
 * Relation between spheres with strength for physics.
 */
export interface SphereRelation {
  from: string;           // Source sphere ID
  to: string;             // Target sphere ID
  strength: number;       // Connection strength (0.1 → 1)
  type?: RelationType;    // Optional relation type
  distance?: number;      // Preferred distance (for spring)
}

/**
 * Force applied in simulation.
 */
export interface Force {
  type: 'gravity' | 'repulsion' | 'spring' | 'center' | 'boundary';
  strength: number;
  target?: string;        // For directed forces
  position?: Vector3;     // For positional forces
}

// ─────────────────────────────────────────────────────
// SPHERE
// ─────────────────────────────────────────────────────

export interface Sphere3D {
  id: string;
  label: string;
  type: 'business' | 'creative' | 'personal' | 'scholar';
  
  // Spatial
  position: Vector3;
  size: number;           // Radius based on content
  
  // Physics (for force-directed layout)
  weight: number;         // Logical mass (affects attraction/repulsion)
  velocity?: Vector3;     // Current movement vector
  acceleration?: Vector3; // Applied forces
  fixed?: boolean;        // If true, position is locked
  
  // Visual
  themeId: ThemeId;
  color?: Color;
  emissive?: Color;
  opacity?: number;
  
  // State
  activityLevel: number;  // 0-1, affects glow/animation
  nodeCount: number;      // Content count
  isActive: boolean;
  isFocused: boolean;
  
  // Metadata
  description?: string;
  children?: string[];    // Child sphere IDs
}

/**
 * Simplified sphere for physics simulation.
 */
export interface PhysicsSphere {
  id: string;
  position: Vector3;
  velocity: Vector3;
  mass: number;
  radius: number;
  fixed: boolean;
}

// ─────────────────────────────────────────────────────
// CLUSTERING
// ─────────────────────────────────────────────────────

/**
 * A cluster groups multiple nearby spheres into one visual node.
 * Can be expanded to show individual spheres.
 */
export interface SphereCluster {
  id: string;
  sphereIds: string[];         // IDs of contained spheres
  position: Vector3;           // Center of cluster
  size: number;                // Visual radius
  activityLevel: number;       // Aggregated activity
  themeId: string;             // Dominant theme
  expanded: boolean;           // Show individual spheres?
  
  // Optional metadata
  label?: string;
  nodeCount?: number;
}

/**
 * Union type for nodes in the universe.
 * Can be individual sphere or cluster.
 */
export type UniverseNode = Sphere3D | SphereCluster;

/**
 * Type guard to check if node is a cluster.
 */
export function isCluster(node: UniverseNode): node is SphereCluster {
  return 'sphereIds' in node && Array.isArray((node as SphereCluster).sphereIds);
}

/**
 * Type guard to check if node is a sphere.
 */
export function isSphere(node: UniverseNode): node is Sphere3D {
  return 'type' in node && !('sphereIds' in node);
}

// ─────────────────────────────────────────────────────
// RELATION / LINK
// ─────────────────────────────────────────────────────

export type RelationType = 
  | 'parent-child'    // Hierarchical
  | 'sibling'         // Same level
  | 'reference'       // Cross-reference
  | 'dependency'      // One depends on other
  | 'flow';           // Data/process flow

export interface Relation3D {
  id: string;
  sourceId: string;
  targetId: string;
  type: RelationType;
  
  // Visual
  color?: Color;
  width?: number;
  opacity?: number;
  animated?: boolean;
  dashPattern?: [number, number];
  
  // Metadata
  label?: string;
  strength?: number;    // 0-1, affects visual weight
}

// ─────────────────────────────────────────────────────
// CENTER NODE (NOVA)
// ─────────────────────────────────────────────────────

export interface CenterNode3D {
  id: string;
  label: string;
  position: Vector3;
  size: number;
  color: Color;
  glowColor: Color;
  glowIntensity: number;
  rotationSpeed: number;
}

// ─────────────────────────────────────────────────────
// UNIVERSE STATE
// ─────────────────────────────────────────────────────

export interface Universe3DState {
  id: string;
  name: string;
  
  // Nodes
  center: CenterNode3D;
  spheres: Sphere3D[];
  relations: Relation3D[];
  
  // Physics relations (simplified for simulation)
  sphereRelations?: SphereRelation[];
  
  // Focus
  focusedSphereId?: string;
  selectedSphereIds: string[];
  
  // Camera
  cameraTarget: Vector3;
  cameraPosition: Vector3;
  cameraZoom: number;
  
  // Animation
  isAnimating: boolean;
  animationSpeed: number;
  
  // Physics simulation
  physicsEnabled?: boolean;
  physicsConfig?: PhysicsConfig;
}

// ─────────────────────────────────────────────────────
// PHYSICS SIMULATION
// ─────────────────────────────────────────────────────

export interface PhysicsConfig {
  enabled: boolean;
  
  // Forces
  centerGravity: number;      // Pull towards center (0-1)
  repulsion: number;          // Push between spheres (0-1000)
  springStrength: number;     // Connection spring force (0-1)
  springLength: number;       // Ideal spring length
  
  // Simulation
  damping: number;            // Velocity decay (0.9-0.99)
  maxVelocity: number;        // Cap on speed
  minDistance: number;        // Minimum sphere distance
  
  // Convergence
  alphaDecay: number;         // Cooling rate
  alphaMin: number;           // Stop when alpha below this
  velocityDecay: number;      // Additional velocity damping
}

export interface PhysicsState {
  alpha: number;              // Current "heat" of simulation
  isRunning: boolean;
  iterations: number;
  lastUpdate: number;
}

export const DEFAULT_PHYSICS: PhysicsConfig = {
  enabled: true,
  centerGravity: 0.05,
  repulsion: 300,
  springStrength: 0.3,
  springLength: 5,
  damping: 0.95,
  maxVelocity: 2,
  minDistance: 2,
  alphaDecay: 0.02,
  alphaMin: 0.001,
  velocityDecay: 0.4,
};

// ─────────────────────────────────────────────────────
// LAYOUT
// ─────────────────────────────────────────────────────

export type LayoutType = 
  | 'orbital'       // Spheres orbit center
  | 'clustered'     // Grouped by type
  | 'hierarchical'  // Tree structure
  | 'force'         // Force-directed
  | 'grid';         // 3D grid

export interface LayoutConfig {
  type: LayoutType;
  
  // Orbital
  minRadius?: number;
  maxRadius?: number;
  layerGap?: number;
  
  // Clustered
  clusterSpacing?: number;
  
  // Force-directed (physics-based)
  force?: {
    centerStrength?: number;   // Pull to center
    chargeStrength?: number;   // Repulsion between nodes
    linkStrength?: number;     // Spring strength
    linkDistance?: number;     // Ideal link distance
    collisionRadius?: number;  // Collision detection radius
    alpha?: number;            // Initial simulation heat
    alphaDecay?: number;       // Cooling rate
    velocityDecay?: number;    // Friction
  };
  
  // Animation
  transitionDuration?: number;
  easing?: string;
}

/**
 * Result of force simulation step.
 */
export interface ForceSimulationResult {
  positions: Map<string, Vector3>;
  velocities: Map<string, Vector3>;
  alpha: number;
  converged: boolean;
}

export interface LayoutResult {
  positions: Map<string, Vector3>;
  bounds: {
    min: Vector3;
    max: Vector3;
    center: Vector3;
  };
}

// ─────────────────────────────────────────────────────
// CAMERA
// ─────────────────────────────────────────────────────

export interface CameraState {
  position: Vector3;
  target: Vector3;
  fov: number;
  near: number;
  far: number;
  zoom: number;
}

export interface CameraTransition {
  from: CameraState;
  to: CameraState;
  duration: number;
  easing: string;
}

// ─────────────────────────────────────────────────────
// INTERACTIONS
// ─────────────────────────────────────────────────────

export interface InteractionState {
  hoveredSphereId?: string;
  isDragging: boolean;
  dragStartPosition?: Vector3;
  isOrbiting: boolean;
  isPanning: boolean;
  isZooming: boolean;
}

export type InteractionMode = 
  | 'navigate'    // Default: orbit, pan, zoom
  | 'select'      // Click to select
  | 'connect'     // Create relations
  | 'edit';       // Move nodes

// ─────────────────────────────────────────────────────
// EFFECTS
// ─────────────────────────────────────────────────────

export interface UniverseEffects {
  // Background
  stars: {
    enabled: boolean;
    count: number;
    radius: number;
    depth: number;
    fade: boolean;
  };
  
  // Nebula
  nebula: {
    enabled: boolean;
    color: Color;
    opacity: number;
  };
  
  // Glow
  bloom: {
    enabled: boolean;
    intensity: number;
    threshold: number;
    radius: number;
  };
  
  // Ambient
  fog: {
    enabled: boolean;
    color: Color;
    near: number;
    far: number;
  };
  
  // Particles
  particles: {
    enabled: boolean;
    count: number;
    size: number;
    speed: number;
  };
}

// ─────────────────────────────────────────────────────
// EVENTS
// ─────────────────────────────────────────────────────

export type Universe3DEventType =
  | 'sphere:click'
  | 'sphere:hover'
  | 'sphere:leave'
  | 'sphere:focus'
  | 'sphere:blur'
  | 'relation:click'
  | 'center:click'
  | 'camera:move'
  | 'camera:zoom'
  | 'layout:change';

export interface Universe3DEvent {
  type: Universe3DEventType;
  target?: string;
  data?: Record<string, unknown>;
  timestamp: number;
}

// ─────────────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────────────

export interface Universe3DViewProps {
  universe: Universe3DState;
  layout?: LayoutConfig;
  effects?: Partial<UniverseEffects>;
  interactionMode?: InteractionMode;
  
  // Callbacks
  onSphereClick?: (sphereId: string) => void;
  onSphereHover?: (sphereId: string | null) => void;
  onSphereFocus?: (sphereId: string) => void;
  onCenterClick?: () => void;
  onRelationClick?: (relationId: string) => void;
  onCameraChange?: (camera: CameraState) => void;
  
  // Style
  className?: string;
  style?: React.CSSProperties;
}

// ─────────────────────────────────────────────────────
// DEFAULTS
// ─────────────────────────────────────────────────────

export const DEFAULT_LAYOUT: LayoutConfig = {
  type: 'orbital',
  minRadius: 5,
  maxRadius: 12,
  layerGap: 3,
  transitionDuration: 800,
  easing: 'easeInOutCubic',
};

export const DEFAULT_EFFECTS: UniverseEffects = {
  stars: {
    enabled: true,
    count: 4000,
    radius: 100,
    depth: 50,
    fade: true,
  },
  nebula: {
    enabled: false,
    color: '#6366f1',
    opacity: 0.1,
  },
  bloom: {
    enabled: true,
    intensity: 0.5,
    threshold: 0.8,
    radius: 0.4,
  },
  fog: {
    enabled: false,
    color: '#000000',
    near: 50,
    far: 100,
  },
  particles: {
    enabled: false,
    count: 100,
    size: 0.1,
    speed: 0.5,
  },
};

export const DEFAULT_CENTER: CenterNode3D = {
  id: 'nova',
  label: 'NOVA',
  position: [0, 0, 0],
  size: 1.5,
  color: '#ffd54f',
  glowColor: '#ffd54f',
  glowIntensity: 0.8,
  rotationSpeed: 0.005,
};
