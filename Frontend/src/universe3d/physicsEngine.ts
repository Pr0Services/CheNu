/* =====================================================
   CHE·NU — Universe 3D Physics Engine
   
   Force-directed graph simulation for organic sphere
   positioning. Implements:
   - Center gravity
   - Node repulsion (charge)
   - Spring forces (links)
   - Collision detection
   - Velocity damping
   ===================================================== */

import {
  Vector3,
  Sphere3D,
  SphereRelation,
  PhysicsConfig,
  PhysicsState,
  PhysicsSphere,
  DEFAULT_PHYSICS,
} from './universe3d.types';

// ─────────────────────────────────────────────────────
// VECTOR MATH HELPERS
// ─────────────────────────────────────────────────────

function vec3Add(a: Vector3, b: Vector3): Vector3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function vec3Sub(a: Vector3, b: Vector3): Vector3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function vec3Scale(v: Vector3, s: number): Vector3 {
  return [v[0] * s, v[1] * s, v[2] * s];
}

function vec3Length(v: Vector3): number {
  return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
}

function vec3Normalize(v: Vector3): Vector3 {
  const len = vec3Length(v);
  if (len === 0) return [0, 0, 0];
  return [v[0] / len, v[1] / len, v[2] / len];
}

function vec3Distance(a: Vector3, b: Vector3): number {
  return vec3Length(vec3Sub(a, b));
}

function vec3Clamp(v: Vector3, maxLength: number): Vector3 {
  const len = vec3Length(v);
  if (len <= maxLength) return v;
  return vec3Scale(vec3Normalize(v), maxLength);
}

// ─────────────────────────────────────────────────────
// PHYSICS ENGINE CLASS
// ─────────────────────────────────────────────────────

export class PhysicsEngine {
  private config: PhysicsConfig;
  private state: PhysicsState;
  private nodes: Map<string, PhysicsSphere>;
  private relations: SphereRelation[];
  
  constructor(config: Partial<PhysicsConfig> = {}) {
    this.config = { ...DEFAULT_PHYSICS, ...config };
    this.state = {
      alpha: 1,
      isRunning: false,
      iterations: 0,
      lastUpdate: Date.now(),
    };
    this.nodes = new Map();
    this.relations = [];
  }
  
  // ─────────────────────────────────────────────────────
  // INITIALIZATION
  // ─────────────────────────────────────────────────────
  
  /**
   * Initialize nodes from spheres.
   */
  initialize(spheres: Sphere3D[], relations: SphereRelation[]): void {
    this.nodes.clear();
    
    for (const sphere of spheres) {
      this.nodes.set(sphere.id, {
        id: sphere.id,
        position: [...sphere.position] as Vector3,
        velocity: sphere.velocity ? [...sphere.velocity] as Vector3 : [0, 0, 0],
        mass: sphere.weight || 1,
        radius: sphere.size,
        fixed: sphere.fixed || false,
      });
    }
    
    this.relations = relations;
    this.state.alpha = 1;
    this.state.iterations = 0;
  }
  
  /**
   * Add or update a single node.
   */
  setNode(sphere: Sphere3D): void {
    this.nodes.set(sphere.id, {
      id: sphere.id,
      position: [...sphere.position] as Vector3,
      velocity: sphere.velocity ? [...sphere.velocity] as Vector3 : [0, 0, 0],
      mass: sphere.weight || 1,
      radius: sphere.size,
      fixed: sphere.fixed || false,
    });
  }
  
  /**
   * Update relations.
   */
  setRelations(relations: SphereRelation[]): void {
    this.relations = relations;
  }
  
  // ─────────────────────────────────────────────────────
  // SIMULATION STEP
  // ─────────────────────────────────────────────────────
  
  /**
   * Run one simulation step.
   * Returns true if simulation is still active.
   */
  step(): boolean {
    if (this.state.alpha < this.config.alphaMin) {
      this.state.isRunning = false;
      return false;
    }
    
    this.state.isRunning = true;
    this.state.iterations++;
    
    // Reset accelerations
    const accelerations = new Map<string, Vector3>();
    this.nodes.forEach((node, id) => {
      accelerations.set(id, [0, 0, 0]);
    });
    
    // Apply forces
    this.applyCenterGravity(accelerations);
    this.applyRepulsion(accelerations);
    this.applySpringForces(accelerations);
    this.applyCollisions(accelerations);
    
    // Update velocities and positions
    this.nodes.forEach((node, id) => {
      if (node.fixed) return;
      
      const acc = accelerations.get(id) || [0, 0, 0];
      
      // Update velocity
      node.velocity = vec3Add(
        vec3Scale(node.velocity, this.config.damping),
        vec3Scale(acc, this.state.alpha)
      );
      
      // Clamp velocity
      node.velocity = vec3Clamp(node.velocity, this.config.maxVelocity);
      
      // Update position
      node.position = vec3Add(node.position, node.velocity);
    });
    
    // Cool down
    this.state.alpha *= (1 - this.config.alphaDecay);
    this.state.lastUpdate = Date.now();
    
    return this.state.alpha >= this.config.alphaMin;
  }
  
  // ─────────────────────────────────────────────────────
  // FORCE CALCULATIONS
  // ─────────────────────────────────────────────────────
  
  /**
   * Pull all nodes towards center.
   */
  private applyCenterGravity(accelerations: Map<string, Vector3>): void {
    const strength = this.config.centerGravity;
    
    this.nodes.forEach((node, id) => {
      if (node.fixed) return;
      
      const toCenter = vec3Scale(node.position, -strength);
      const current = accelerations.get(id) || [0, 0, 0];
      accelerations.set(id, vec3Add(current, toCenter));
    });
  }
  
  /**
   * Repel nodes from each other (charge force).
   */
  private applyRepulsion(accelerations: Map<string, Vector3>): void {
    const strength = this.config.repulsion;
    const nodes = Array.from(this.nodes.values());
    
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        
        const delta = vec3Sub(a.position, b.position);
        let distance = vec3Length(delta);
        
        // Avoid division by zero
        if (distance < 0.1) distance = 0.1;
        
        // Inverse square law
        const force = strength / (distance * distance);
        const direction = vec3Normalize(delta);
        
        // Apply to both nodes (opposite directions)
        if (!a.fixed) {
          const accA = accelerations.get(a.id) || [0, 0, 0];
          accelerations.set(a.id, vec3Add(accA, vec3Scale(direction, force / a.mass)));
        }
        
        if (!b.fixed) {
          const accB = accelerations.get(b.id) || [0, 0, 0];
          accelerations.set(b.id, vec3Add(accB, vec3Scale(direction, -force / b.mass)));
        }
      }
    }
  }
  
  /**
   * Apply spring forces along relations.
   */
  private applySpringForces(accelerations: Map<string, Vector3>): void {
    const strength = this.config.springStrength;
    const idealLength = this.config.springLength;
    
    for (const relation of this.relations) {
      const a = this.nodes.get(relation.from);
      const b = this.nodes.get(relation.to);
      
      if (!a || !b) continue;
      
      const delta = vec3Sub(b.position, a.position);
      const distance = vec3Length(delta);
      const targetDistance = relation.distance || idealLength;
      
      // Spring force proportional to displacement
      const displacement = distance - targetDistance;
      const force = displacement * strength * relation.strength;
      const direction = vec3Normalize(delta);
      
      if (!a.fixed) {
        const accA = accelerations.get(a.id) || [0, 0, 0];
        accelerations.set(a.id, vec3Add(accA, vec3Scale(direction, force / a.mass)));
      }
      
      if (!b.fixed) {
        const accB = accelerations.get(b.id) || [0, 0, 0];
        accelerations.set(b.id, vec3Add(accB, vec3Scale(direction, -force / b.mass)));
      }
    }
  }
  
  /**
   * Prevent node overlap.
   */
  private applyCollisions(accelerations: Map<string, Vector3>): void {
    const minDist = this.config.minDistance;
    const nodes = Array.from(this.nodes.values());
    
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        
        const delta = vec3Sub(a.position, b.position);
        const distance = vec3Length(delta);
        const minDistance = a.radius + b.radius + minDist;
        
        if (distance < minDistance && distance > 0) {
          // Push apart
          const overlap = minDistance - distance;
          const direction = vec3Normalize(delta);
          const push = vec3Scale(direction, overlap * 0.5);
          
          if (!a.fixed) {
            a.position = vec3Add(a.position, push);
          }
          if (!b.fixed) {
            b.position = vec3Sub(b.position, push);
          }
        }
      }
    }
  }
  
  // ─────────────────────────────────────────────────────
  // STATE ACCESS
  // ─────────────────────────────────────────────────────
  
  /**
   * Get current positions.
   */
  getPositions(): Map<string, Vector3> {
    const positions = new Map<string, Vector3>();
    this.nodes.forEach((node, id) => {
      positions.set(id, [...node.position] as Vector3);
    });
    return positions;
  }
  
  /**
   * Get current velocities.
   */
  getVelocities(): Map<string, Vector3> {
    const velocities = new Map<string, Vector3>();
    this.nodes.forEach((node, id) => {
      velocities.set(id, [...node.velocity] as Vector3);
    });
    return velocities;
  }
  
  /**
   * Get simulation state.
   */
  getState(): PhysicsState {
    return { ...this.state };
  }
  
  /**
   * Check if simulation has converged.
   */
  isConverged(): boolean {
    return this.state.alpha < this.config.alphaMin;
  }
  
  /**
   * Reheat simulation (restart with current positions).
   */
  reheat(alpha: number = 0.5): void {
    this.state.alpha = alpha;
    this.state.isRunning = false;
  }
  
  /**
   * Fix a node in place.
   */
  fixNode(id: string, position?: Vector3): void {
    const node = this.nodes.get(id);
    if (node) {
      node.fixed = true;
      if (position) {
        node.position = [...position] as Vector3;
      }
      node.velocity = [0, 0, 0];
    }
  }
  
  /**
   * Release a fixed node.
   */
  releaseNode(id: string): void {
    const node = this.nodes.get(id);
    if (node) {
      node.fixed = false;
    }
  }
  
  /**
   * Update config.
   */
  setConfig(config: Partial<PhysicsConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

// ─────────────────────────────────────────────────────
// HOOK FOR REACT
// ─────────────────────────────────────────────────────

import { useRef, useCallback, useEffect, useState } from 'react';

export interface UsePhysicsOptions {
  config?: Partial<PhysicsConfig>;
  autoStart?: boolean;
  fps?: number;
}

export function usePhysics(
  spheres: Sphere3D[],
  relations: SphereRelation[],
  options: UsePhysicsOptions = {}
) {
  const { config, autoStart = true, fps = 60 } = options;
  
  const engineRef = useRef<PhysicsEngine | null>(null);
  const frameRef = useRef<number | null>(null);
  const [positions, setPositions] = useState<Map<string, Vector3>>(new Map());
  const [isRunning, setIsRunning] = useState(false);
  const [alpha, setAlpha] = useState(1);
  
  // Initialize engine
  useEffect(() => {
    engineRef.current = new PhysicsEngine(config);
    engineRef.current.initialize(spheres, relations);
    setPositions(engineRef.current.getPositions());
    
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);
  
  // Update when spheres/relations change
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.initialize(spheres, relations);
      setPositions(engineRef.current.getPositions());
      if (autoStart) {
        start();
      }
    }
  }, [spheres, relations]);
  
  // Animation loop
  const animate = useCallback(() => {
    if (!engineRef.current) return;
    
    const running = engineRef.current.step();
    setPositions(engineRef.current.getPositions());
    setAlpha(engineRef.current.getState().alpha);
    
    if (running) {
      frameRef.current = requestAnimationFrame(animate);
    } else {
      setIsRunning(false);
    }
  }, []);
  
  const start = useCallback(() => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }
    setIsRunning(true);
    frameRef.current = requestAnimationFrame(animate);
  }, [animate]);
  
  const stop = useCallback(() => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    setIsRunning(false);
  }, []);
  
  const reheat = useCallback((alpha: number = 0.5) => {
    if (engineRef.current) {
      engineRef.current.reheat(alpha);
      start();
    }
  }, [start]);
  
  const fixNode = useCallback((id: string, position?: Vector3) => {
    engineRef.current?.fixNode(id, position);
  }, []);
  
  const releaseNode = useCallback((id: string) => {
    engineRef.current?.releaseNode(id);
  }, []);
  
  return {
    positions,
    isRunning,
    alpha,
    start,
    stop,
    reheat,
    fixNode,
    releaseNode,
    engine: engineRef.current,
  };
}

export default PhysicsEngine;
