/* =====================================================
   CHE·NU — Universe Layout Computation
   
   Simplified force-directed layout for React Three Fiber.
   Designed to run in useFrame() for smooth animation.
   
   Forces:
   - 🌍 Center pull: Keeps spheres near origin
   - 🧲 Repulsion: Prevents overlap, improves readability
   - 🔗 Relations: Contextual attraction between connected spheres
   - ⚖️ Damping: Stabilizes motion over time
   ===================================================== */

import { Sphere3D, SphereRelation, Vector3 } from './universe3d.types';

// ─────────────────────────────────────────────────────
// FORCE CONSTANTS
// ─────────────────────────────────────────────────────

export interface LayoutForces {
  centerPull: number;      // Attraction to origin
  repulsion: number;       // Push between spheres
  relationForce: number;   // Pull along relations
  damping: number;         // Velocity decay
}

export const DEFAULT_FORCES: LayoutForces = {
  centerPull: 0.002,
  repulsion: 0.08,
  relationForce: 0.05,
  damping: 0.9,
};

// ─────────────────────────────────────────────────────
// MAIN COMPUTATION
// ─────────────────────────────────────────────────────

/**
 * Compute one step of force-directed layout.
 * Call this in useFrame() for continuous animation.
 * 
 * @param spheres Current sphere states
 * @param relations Connections between spheres
 * @param forces Optional force parameters
 * @returns Updated spheres with new positions/velocities
 */
export function computeUniverseLayout(
  spheres: Sphere3D[],
  relations: SphereRelation[],
  forces: LayoutForces = DEFAULT_FORCES
): Sphere3D[] {
  const { centerPull, repulsion, relationForce, damping } = forces;
  
  // Build lookup map for O(1) access
  const sphereMap = new Map(spheres.map(s => [s.id, s]));

  return spheres.map((sphere) => {
    // Skip fixed spheres
    if (sphere.fixed) return sphere;
    
    const [x, y, z] = sphere.position;
    let vx = sphere.velocity?.[0] ?? 0;
    let vy = sphere.velocity?.[1] ?? 0;
    let vz = sphere.velocity?.[2] ?? 0;

    // 🌍 Attraction douce vers le centre
    vx += -x * centerPull;
    vy += -y * centerPull;
    vz += -z * centerPull;

    // 🧲 Répulsion entre sphères (lisibilité)
    for (const other of spheres) {
      if (other.id === sphere.id) continue;

      const dx = x - other.position[0];
      const dy = y - other.position[1];
      const dz = z - other.position[2];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.01;

      const minDist = sphere.size + other.size + 0.8;
      if (dist < minDist) {
        const force = repulsion / dist;
        vx += (dx / dist) * force;
        vy += (dy / dist) * force;
        vz += (dz / dist) * force;
      }
    }

    // 🔗 Relations (attraction contextuelle)
    for (const rel of relations) {
      if (rel.from !== sphere.id && rel.to !== sphere.id) continue;

      const targetId = rel.from === sphere.id ? rel.to : rel.from;
      const target = sphereMap.get(targetId);
      if (!target) continue;

      const dx = target.position[0] - x;
      const dy = target.position[1] - y;
      const dz = target.position[2] - z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.01;

      const strength = rel.strength * relationForce;
      vx += (dx / dist) * strength;
      vy += (dy / dist) * strength;
      vz += (dz / dist) * strength;
    }

    // ⚖️ Damping (stabilisation)
    vx *= damping;
    vy *= damping;
    vz *= damping;

    // Apply velocity scaled by weight
    const weight = sphere.weight || 1;
    
    return {
      ...sphere,
      position: [
        x + vx * weight,
        y + vy * weight,
        z + vz * weight,
      ] as Vector3,
      velocity: [vx, vy, vz] as Vector3,
    };
  });
}

// ─────────────────────────────────────────────────────
// CONVERGENCE CHECK
// ─────────────────────────────────────────────────────

/**
 * Check if layout has stabilized (low total velocity).
 */
export function isLayoutStable(
  spheres: Sphere3D[],
  threshold: number = 0.001
): boolean {
  let totalVelocity = 0;
  
  for (const sphere of spheres) {
    if (!sphere.velocity) continue;
    const [vx, vy, vz] = sphere.velocity;
    totalVelocity += Math.abs(vx) + Math.abs(vy) + Math.abs(vz);
  }
  
  return totalVelocity / spheres.length < threshold;
}

/**
 * Get total kinetic energy of system.
 */
export function getSystemEnergy(spheres: Sphere3D[]): number {
  let energy = 0;
  
  for (const sphere of spheres) {
    if (!sphere.velocity) continue;
    const [vx, vy, vz] = sphere.velocity;
    const speed = Math.sqrt(vx * vx + vy * vy + vz * vz);
    const mass = sphere.weight || 1;
    energy += 0.5 * mass * speed * speed;
  }
  
  return energy;
}

// ─────────────────────────────────────────────────────
// INITIAL POSITIONING
// ─────────────────────────────────────────────────────

/**
 * Initialize spheres with positions in a sphere/ring pattern.
 */
export function initializeSpherePositions(
  spheres: Sphere3D[],
  radius: number = 5,
  pattern: 'ring' | 'sphere' | 'random' = 'ring'
): Sphere3D[] {
  return spheres.map((sphere, i) => {
    let position: Vector3;
    
    switch (pattern) {
      case 'ring': {
        const angle = (Math.PI * 2 * i) / spheres.length;
        position = [
          Math.cos(angle) * radius,
          (Math.random() - 0.5) * 2,
          Math.sin(angle) * radius,
        ];
        break;
      }
      
      case 'sphere': {
        // Fibonacci sphere distribution
        const phi = Math.acos(1 - 2 * (i + 0.5) / spheres.length);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;
        position = [
          Math.sin(phi) * Math.cos(theta) * radius,
          Math.cos(phi) * radius,
          Math.sin(phi) * Math.sin(theta) * radius,
        ];
        break;
      }
      
      case 'random':
      default: {
        position = [
          (Math.random() - 0.5) * radius * 2,
          (Math.random() - 0.5) * radius * 2,
          (Math.random() - 0.5) * radius * 2,
        ];
        break;
      }
    }
    
    return {
      ...sphere,
      position,
      velocity: [0, 0, 0] as Vector3,
    };
  });
}

// ─────────────────────────────────────────────────────
// REACT HOOK
// ─────────────────────────────────────────────────────

import { useState, useCallback, useRef } from 'react';

export interface UseUniverseLayoutOptions {
  forces?: Partial<LayoutForces>;
  autoInit?: boolean;
  initPattern?: 'ring' | 'sphere' | 'random';
  initRadius?: number;
}

/**
 * Hook for managing universe layout state.
 * Use with useFrame() for animation.
 * 
 * @example
 * const { spheres, step, isStable } = useUniverseLayoutState(
 *   initialSpheres,
 *   relations
 * );
 * 
 * useFrame(() => {
 *   if (!isStable) step();
 * });
 */
export function useUniverseLayoutState(
  initialSpheres: Sphere3D[],
  relations: SphereRelation[],
  options: UseUniverseLayoutOptions = {}
) {
  const {
    forces = {},
    autoInit = true,
    initPattern = 'ring',
    initRadius = 5,
  } = options;
  
  const mergedForces = { ...DEFAULT_FORCES, ...forces };
  
  // Initialize positions if needed
  const getInitialSpheres = () => {
    if (!autoInit) return initialSpheres;
    
    const needsInit = initialSpheres.every(
      s => s.position[0] === 0 && s.position[1] === 0 && s.position[2] === 0
    );
    
    return needsInit
      ? initializeSpherePositions(initialSpheres, initRadius, initPattern)
      : initialSpheres;
  };
  
  const [spheres, setSpheres] = useState<Sphere3D[]>(getInitialSpheres);
  const iterationRef = useRef(0);
  
  const step = useCallback(() => {
    setSpheres(prev => {
      iterationRef.current++;
      return computeUniverseLayout(prev, relations, mergedForces);
    });
  }, [relations, mergedForces]);
  
  const reset = useCallback(() => {
    iterationRef.current = 0;
    setSpheres(getInitialSpheres());
  }, [initialSpheres, initRadius, initPattern, autoInit]);
  
  const isStable = isLayoutStable(spheres);
  const energy = getSystemEnergy(spheres);
  
  return {
    spheres,
    step,
    reset,
    isStable,
    energy,
    iterations: iterationRef.current,
  };
}

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default computeUniverseLayout;
