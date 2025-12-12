/* =====================================================
   CHE·NU — Universe 3D Layout Hook
   PHASE 8: Calculate 3D positions for spheres
   
   Supports multiple layout algorithms:
   - Orbital: Classic around center
   - Clustered: Grouped by type
   - Hierarchical: Tree structure
   - Force-directed: Physics simulation
   ===================================================== */

import { useMemo, useCallback } from 'react';
import {
  Sphere3D, Vector3, LayoutConfig, LayoutResult, LayoutType,
  DEFAULT_LAYOUT,
} from './universe3d.types';

// ─────────────────────────────────────────────────────
// MAIN HOOK
// ─────────────────────────────────────────────────────

export function useUniverseLayout(
  spheres: Sphere3D[],
  config: LayoutConfig = DEFAULT_LAYOUT
): LayoutResult {
  return useMemo(() => {
    switch (config.type) {
      case 'orbital':
        return calculateOrbitalLayout(spheres, config);
      case 'clustered':
        return calculateClusteredLayout(spheres, config);
      case 'hierarchical':
        return calculateHierarchicalLayout(spheres, config);
      case 'force':
        return calculateForceLayout(spheres, config);
      case 'grid':
        return calculateGridLayout(spheres, config);
      default:
        return calculateOrbitalLayout(spheres, config);
    }
  }, [spheres, config]);
}

// ─────────────────────────────────────────────────────
// ORBITAL LAYOUT
// ─────────────────────────────────────────────────────

function calculateOrbitalLayout(
  spheres: Sphere3D[],
  config: LayoutConfig
): LayoutResult {
  const positions = new Map<string, Vector3>();
  const { minRadius = 5, maxRadius = 12, layerGap = 3 } = config;
  
  // Group by type for layering
  const byType = groupByType(spheres);
  const types = Object.keys(byType);
  
  let bounds = {
    min: [Infinity, Infinity, Infinity] as Vector3,
    max: [-Infinity, -Infinity, -Infinity] as Vector3,
    center: [0, 0, 0] as Vector3,
  };
  
  types.forEach((type, layerIndex) => {
    const typeSpheres = byType[type];
    const radius = minRadius + layerIndex * layerGap;
    const angleStep = (Math.PI * 2) / typeSpheres.length;
    
    // Add slight Y offset per layer
    const yOffset = (layerIndex - types.length / 2) * 0.5;
    
    typeSpheres.forEach((sphere, i) => {
      const angle = angleStep * i - Math.PI / 2;
      
      // Add some randomness for organic feel
      const jitter = sphere.activityLevel * 0.3;
      const r = radius + (Math.random() - 0.5) * jitter;
      
      const x = Math.cos(angle) * r;
      const y = yOffset + (Math.random() - 0.5) * 0.5;
      const z = Math.sin(angle) * r;
      
      const pos: Vector3 = [x, y, z];
      positions.set(sphere.id, pos);
      
      // Update bounds
      bounds.min = [
        Math.min(bounds.min[0], x),
        Math.min(bounds.min[1], y),
        Math.min(bounds.min[2], z),
      ];
      bounds.max = [
        Math.max(bounds.max[0], x),
        Math.max(bounds.max[1], y),
        Math.max(bounds.max[2], z),
      ];
    });
  });
  
  return { positions, bounds };
}

// ─────────────────────────────────────────────────────
// CLUSTERED LAYOUT
// ─────────────────────────────────────────────────────

function calculateClusteredLayout(
  spheres: Sphere3D[],
  config: LayoutConfig
): LayoutResult {
  const positions = new Map<string, Vector3>();
  const { clusterSpacing = 8 } = config;
  
  const byType = groupByType(spheres);
  const types = Object.keys(byType);
  
  // Position clusters in a square arrangement
  const clusterPositions: Record<string, Vector3> = {
    business: [-clusterSpacing, 0, -clusterSpacing],
    creative: [clusterSpacing, 0, -clusterSpacing],
    personal: [-clusterSpacing, 0, clusterSpacing],
    scholar: [clusterSpacing, 0, clusterSpacing],
  };
  
  let bounds = {
    min: [Infinity, Infinity, Infinity] as Vector3,
    max: [-Infinity, -Infinity, -Infinity] as Vector3,
    center: [0, 0, 0] as Vector3,
  };
  
  types.forEach(type => {
    const typeSpheres = byType[type];
    const clusterCenter = clusterPositions[type] || [0, 0, 0];
    const clusterRadius = 3;
    
    typeSpheres.forEach((sphere, i) => {
      const angle = (Math.PI * 2 * i) / typeSpheres.length;
      const r = clusterRadius * (0.5 + Math.random() * 0.5);
      
      const x = clusterCenter[0] + Math.cos(angle) * r;
      const y = clusterCenter[1] + (Math.random() - 0.5) * 2;
      const z = clusterCenter[2] + Math.sin(angle) * r;
      
      const pos: Vector3 = [x, y, z];
      positions.set(sphere.id, pos);
      
      bounds.min = [Math.min(bounds.min[0], x), Math.min(bounds.min[1], y), Math.min(bounds.min[2], z)];
      bounds.max = [Math.max(bounds.max[0], x), Math.max(bounds.max[1], y), Math.max(bounds.max[2], z)];
    });
  });
  
  return { positions, bounds };
}

// ─────────────────────────────────────────────────────
// HIERARCHICAL LAYOUT
// ─────────────────────────────────────────────────────

function calculateHierarchicalLayout(
  spheres: Sphere3D[],
  config: LayoutConfig
): LayoutResult {
  const positions = new Map<string, Vector3>();
  const { layerGap = 4 } = config;
  
  // Sort by node count (more nodes = higher in hierarchy)
  const sorted = [...spheres].sort((a, b) => b.nodeCount - a.nodeCount);
  
  let bounds = {
    min: [Infinity, Infinity, Infinity] as Vector3,
    max: [-Infinity, -Infinity, -Infinity] as Vector3,
    center: [0, 0, 0] as Vector3,
  };
  
  sorted.forEach((sphere, i) => {
    const layer = Math.floor(i / 4);
    const indexInLayer = i % 4;
    const layerCount = Math.min(4, sorted.length - layer * 4);
    
    const angle = (Math.PI * 2 * indexInLayer) / layerCount;
    const radius = 4 + layer * 2;
    const y = -layer * layerGap;
    
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    
    const pos: Vector3 = [x, y, z];
    positions.set(sphere.id, pos);
    
    bounds.min = [Math.min(bounds.min[0], x), Math.min(bounds.min[1], y), Math.min(bounds.min[2], z)];
    bounds.max = [Math.max(bounds.max[0], x), Math.max(bounds.max[1], y), Math.max(bounds.max[2], z)];
  });
  
  return { positions, bounds };
}

// ─────────────────────────────────────────────────────
// FORCE-DIRECTED LAYOUT
// ─────────────────────────────────────────────────────

function calculateForceLayout(
  spheres: Sphere3D[],
  config: LayoutConfig
): LayoutResult {
  const positions = new Map<string, Vector3>();
  
  // Use new force config if available
  const forceConfig = config.force || {};
  const {
    centerStrength = 0.05,
    chargeStrength = 300,
    linkStrength = 0.3,
    linkDistance = 5,
    alpha = 1,
    alphaDecay = 0.02,
    velocityDecay = 0.4,
  } = forceConfig;
  
  // Initialize positions and velocities
  const nodePositions: Vector3[] = spheres.map((s) => 
    s.position[0] !== 0 || s.position[1] !== 0 || s.position[2] !== 0
      ? [...s.position] as Vector3
      : [
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 20,
        ]
  );
  
  const velocities: Vector3[] = spheres.map((s) =>
    s.velocity ? [...s.velocity] as Vector3 : [0, 0, 0]
  );
  
  // Run simulation
  const maxIterations = 100;
  let currentAlpha = alpha;
  
  for (let iter = 0; iter < maxIterations && currentAlpha > 0.001; iter++) {
    const forces: Vector3[] = nodePositions.map(() => [0, 0, 0]);
    
    // Center gravity
    for (let i = 0; i < spheres.length; i++) {
      if (spheres[i].fixed) continue;
      forces[i][0] -= nodePositions[i][0] * centerStrength;
      forces[i][1] -= nodePositions[i][1] * centerStrength;
      forces[i][2] -= nodePositions[i][2] * centerStrength;
    }
    
    // Repulsion between all nodes (charge)
    for (let i = 0; i < spheres.length; i++) {
      for (let j = i + 1; j < spheres.length; j++) {
        const dx = nodePositions[i][0] - nodePositions[j][0];
        const dy = nodePositions[i][1] - nodePositions[j][1];
        const dz = nodePositions[i][2] - nodePositions[j][2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.1;
        
        // Inverse square with weights
        const massI = spheres[i].weight || 1;
        const massJ = spheres[j].weight || 1;
        const force = chargeStrength * massI * massJ / (dist * dist);
        
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        const fz = (dz / dist) * force;
        
        if (!spheres[i].fixed) {
          forces[i][0] += fx / massI;
          forces[i][1] += fy / massI;
          forces[i][2] += fz / massI;
        }
        if (!spheres[j].fixed) {
          forces[j][0] -= fx / massJ;
          forces[j][1] -= fy / massJ;
          forces[j][2] -= fz / massJ;
        }
      }
    }
    
    // Apply forces to velocities, then to positions
    const damping = 1 - velocityDecay;
    for (let i = 0; i < spheres.length; i++) {
      if (spheres[i].fixed) continue;
      
      // Update velocity with damping
      velocities[i][0] = velocities[i][0] * damping + forces[i][0] * currentAlpha;
      velocities[i][1] = velocities[i][1] * damping + forces[i][1] * currentAlpha;
      velocities[i][2] = velocities[i][2] * damping + forces[i][2] * currentAlpha;
      
      // Clamp velocity
      const speed = Math.sqrt(
        velocities[i][0] ** 2 + velocities[i][1] ** 2 + velocities[i][2] ** 2
      );
      const maxSpeed = 2;
      if (speed > maxSpeed) {
        const scale = maxSpeed / speed;
        velocities[i][0] *= scale;
        velocities[i][1] *= scale;
        velocities[i][2] *= scale;
      }
      
      // Update position
      nodePositions[i][0] += velocities[i][0];
      nodePositions[i][1] += velocities[i][1];
      nodePositions[i][2] += velocities[i][2];
    }
    
    // Cool down
    currentAlpha *= (1 - alphaDecay);
  }
  
  let bounds = {
    min: [Infinity, Infinity, Infinity] as Vector3,
    max: [-Infinity, -Infinity, -Infinity] as Vector3,
    center: [0, 0, 0] as Vector3,
  };
  
  spheres.forEach((sphere, i) => {
    const pos = nodePositions[i];
    positions.set(sphere.id, pos);
    
    bounds.min = [Math.min(bounds.min[0], pos[0]), Math.min(bounds.min[1], pos[1]), Math.min(bounds.min[2], pos[2])];
    bounds.max = [Math.max(bounds.max[0], pos[0]), Math.max(bounds.max[1], pos[1]), Math.max(bounds.max[2], pos[2])];
  });
  
  // Calculate center
  bounds.center = [
    (bounds.min[0] + bounds.max[0]) / 2,
    (bounds.min[1] + bounds.max[1]) / 2,
    (bounds.min[2] + bounds.max[2]) / 2,
  ];
  
  return { positions, bounds };
}

// ─────────────────────────────────────────────────────
// GRID LAYOUT
// ─────────────────────────────────────────────────────

function calculateGridLayout(
  spheres: Sphere3D[],
  config: LayoutConfig
): LayoutResult {
  const positions = new Map<string, Vector3>();
  
  const gridSize = Math.ceil(Math.cbrt(spheres.length));
  const spacing = 4;
  const offset = ((gridSize - 1) * spacing) / 2;
  
  let bounds = {
    min: [Infinity, Infinity, Infinity] as Vector3,
    max: [-Infinity, -Infinity, -Infinity] as Vector3,
    center: [0, 0, 0] as Vector3,
  };
  
  spheres.forEach((sphere, i) => {
    const x = (i % gridSize) * spacing - offset;
    const y = (Math.floor(i / gridSize) % gridSize) * spacing - offset;
    const z = Math.floor(i / (gridSize * gridSize)) * spacing - offset;
    
    const pos: Vector3 = [x, y, z];
    positions.set(sphere.id, pos);
    
    bounds.min = [Math.min(bounds.min[0], x), Math.min(bounds.min[1], y), Math.min(bounds.min[2], z)];
    bounds.max = [Math.max(bounds.max[0], x), Math.max(bounds.max[1], y), Math.max(bounds.max[2], z)];
  });
  
  return { positions, bounds };
}

// ─────────────────────────────────────────────────────
// UTILITIES
// ─────────────────────────────────────────────────────

function groupByType(spheres: Sphere3D[]): Record<string, Sphere3D[]> {
  return spheres.reduce((acc, sphere) => {
    const type = sphere.type;
    if (!acc[type]) acc[type] = [];
    acc[type].push(sphere);
    return acc;
  }, {} as Record<string, Sphere3D[]>);
}

// ─────────────────────────────────────────────────────
// ANIMATION HELPERS
// ─────────────────────────────────────────────────────

export function interpolatePosition(
  from: Vector3,
  to: Vector3,
  t: number
): Vector3 {
  return [
    from[0] + (to[0] - from[0]) * t,
    from[1] + (to[1] - from[1]) * t,
    from[2] + (to[2] - from[2]) * t,
  ];
}

export function easeInOutCubic(t: number): number {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function distance(a: Vector3, b: Vector3): number {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  const dz = a[2] - b[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

// ─────────────────────────────────────────────────────
// LAYOUT PRESETS
// ─────────────────────────────────────────────────────

export const LAYOUT_PRESETS: Record<string, LayoutConfig> = {
  default: DEFAULT_LAYOUT,
  
  compact: {
    type: 'orbital',
    minRadius: 4,
    maxRadius: 8,
    layerGap: 2,
    transitionDuration: 600,
  },
  
  expanded: {
    type: 'orbital',
    minRadius: 8,
    maxRadius: 20,
    layerGap: 5,
    transitionDuration: 1000,
  },
  
  clustered: {
    type: 'clustered',
    clusterSpacing: 10,
    transitionDuration: 800,
  },
  
  tree: {
    type: 'hierarchical',
    layerGap: 5,
    transitionDuration: 800,
  },
  
  organic: {
    type: 'force',
    repulsion: 80,
    attraction: 0.05,
    transitionDuration: 1200,
  },
};
