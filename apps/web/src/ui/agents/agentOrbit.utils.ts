/* =====================================================
   CHE·NU — Agent Orbit Utilities
   ui/agents/agentOrbit.utils.ts
   ===================================================== */

import { Agent, AgentLevel, AgentStatus } from '@/core/agents/agent.types';

// ─────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────

export interface AgentPosition {
  x: number;
  y: number;
  z?: number;
  scale?: number;
  orbitRadius?: number;
  angle?: number;
}

interface OrbitConfig {
  baseRadius: number;
  radiusStep: number;
  centerOffset: { x: number; y: number };
}

// ─────────────────────────────────────────────────────
// Default Configuration
// ─────────────────────────────────────────────────────

const DEFAULT_ORBIT_CONFIG: OrbitConfig = {
  baseRadius: 120,
  radiusStep: 60,
  centerOffset: { x: 0, y: 0 },
};

// ─────────────────────────────────────────────────────
// Level-based Orbit Radii
// ─────────────────────────────────────────────────────

const LEVEL_RADII: Record<AgentLevel, number> = {
  L0: 0,    // Center (NOVA)
  L1: 80,   // Directors - close orbit
  L2: 140,  // Managers
  L3: 200,  // Analysts
  L4: 260,  // Executors
  L5: 320,  // Observers - outer orbit
};

// ─────────────────────────────────────────────────────
// Compute Single Agent Position
// ─────────────────────────────────────────────────────

export function computeAgentPosition(
  agent: Agent,
  index: number,
  totalAgents: number,
  config: OrbitConfig = DEFAULT_ORBIT_CONFIG
): AgentPosition {
  // Special case for L0 (NOVA) - always center
  if (agent.level === 'L0') {
    return {
      x: config.centerOffset.x,
      y: config.centerOffset.y,
      z: 50,
      scale: 1.2,
      orbitRadius: 0,
      angle: 0,
    };
  }
  
  // Get agents at same level for proper distribution
  const radius = LEVEL_RADII[agent.level];
  
  // Distribute agents evenly around their orbit
  // Add offset based on agent's influence level for variation
  const baseAngle = (Math.PI * 2 * index) / totalAgents;
  const influenceOffset = (agent.influenceLevel - 0.5) * 0.3;
  const angle = baseAngle + influenceOffset;
  
  // Add some radius variation based on status
  const statusRadiusModifier = getStatusRadiusModifier(agent.status);
  const finalRadius = radius * statusRadiusModifier;
  
  return {
    x: Math.cos(angle) * finalRadius + config.centerOffset.x,
    y: Math.sin(angle) * finalRadius + config.centerOffset.y,
    z: getLevelZIndex(agent.level),
    scale: getLevelScale(agent.level),
    orbitRadius: radius,
    angle: angle * (180 / Math.PI), // Convert to degrees
  };
}

// ─────────────────────────────────────────────────────
// Compute All Agent Positions (Grouped by Level)
// ─────────────────────────────────────────────────────

export function computeAgentPositionsGrouped(
  agents: Agent[],
  config: OrbitConfig = DEFAULT_ORBIT_CONFIG
): Map<string, AgentPosition> {
  const positions = new Map<string, AgentPosition>();
  
  // Group agents by level
  const byLevel = groupAgentsByLevel(agents);
  
  // Position each group
  byLevel.forEach((levelAgents, level) => {
    levelAgents.forEach((agent, index) => {
      const radius = LEVEL_RADII[level];
      const angle = (Math.PI * 2 * index) / levelAgents.length - Math.PI / 2; // Start from top
      
      positions.set(agent.id, {
        x: Math.cos(angle) * radius + config.centerOffset.x,
        y: Math.sin(angle) * radius + config.centerOffset.y,
        z: getLevelZIndex(level),
        scale: getLevelScale(level),
        orbitRadius: radius,
        angle: angle * (180 / Math.PI),
      });
    });
  });
  
  return positions;
}

// ─────────────────────────────────────────────────────
// Grouping Utilities
// ─────────────────────────────────────────────────────

export function groupAgentsByLevel(agents: Agent[]): Map<AgentLevel, Agent[]> {
  const grouped = new Map<AgentLevel, Agent[]>();
  
  agents.forEach(agent => {
    const level = agent.level;
    if (!grouped.has(level)) {
      grouped.set(level, []);
    }
    grouped.get(level)!.push(agent);
  });
  
  return grouped;
}

export function groupAgentsBySphere(agents: Agent[]): Map<string, Agent[]> {
  const grouped = new Map<string, Agent[]>();
  
  agents.forEach(agent => {
    const sphere = agent.sphere;
    if (!grouped.has(sphere)) {
      grouped.set(sphere, []);
    }
    grouped.get(sphere)!.push(agent);
  });
  
  return grouped;
}

// ─────────────────────────────────────────────────────
// Level-based Properties
// ─────────────────────────────────────────────────────

function getLevelZIndex(level: AgentLevel): number {
  const zIndices: Record<AgentLevel, number> = {
    L0: 100,
    L1: 80,
    L2: 60,
    L3: 40,
    L4: 20,
    L5: 10,
  };
  return zIndices[level];
}

function getLevelScale(level: AgentLevel): number {
  const scales: Record<AgentLevel, number> = {
    L0: 1.3,
    L1: 1.1,
    L2: 1.0,
    L3: 0.9,
    L4: 0.85,
    L5: 0.8,
  };
  return scales[level];
}

function getStatusRadiusModifier(status: AgentStatus): number {
  // Active agents slightly closer to center
  const modifiers: Record<AgentStatus, number> = {
    idle: 1.0,
    thinking: 0.95,
    working: 0.9,
    waiting_approval: 0.95,
    paused: 1.05,
    error: 1.1,
    offline: 1.15,
  };
  return modifiers[status];
}

// ─────────────────────────────────────────────────────
// Animation Helpers
// ─────────────────────────────────────────────────────

export function getOrbitAnimationStyle(
  position: AgentPosition,
  isActive: boolean = false
): React.CSSProperties {
  return {
    position: 'absolute' as const,
    transform: `translate(${position.x}px, ${position.y}px) scale(${position.scale || 1})`,
    zIndex: position.z || 0,
    transition: isActive 
      ? 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      : 'transform 0.5s ease-out',
  };
}

export function getOrbitPathStyle(radius: number, color: string): React.CSSProperties {
  return {
    position: 'absolute' as const,
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: radius * 2,
    height: radius * 2,
    borderRadius: '50%',
    border: `1px dashed ${color}20`,
    pointerEvents: 'none' as const,
  };
}

// ─────────────────────────────────────────────────────
// Collision Detection (Simple)
// ─────────────────────────────────────────────────────

export function detectCollisions(
  positions: Map<string, AgentPosition>,
  minDistance: number = 40
): Array<[string, string]> {
  const collisions: Array<[string, string]> = [];
  const entries = Array.from(positions.entries());
  
  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      const [id1, pos1] = entries[i];
      const [id2, pos2] = entries[j];
      
      const distance = Math.sqrt(
        Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2)
      );
      
      if (distance < minDistance) {
        collisions.push([id1, id2]);
      }
    }
  }
  
  return collisions;
}

// ─────────────────────────────────────────────────────
// Filter Utilities
// ─────────────────────────────────────────────────────

export function filterActiveAgents(agents: Agent[]): Agent[] {
  return agents.filter(a => a.status !== 'offline');
}

export function filterByInfluence(agents: Agent[], minInfluence: number): Agent[] {
  return agents.filter(a => a.influenceLevel >= minInfluence);
}

export function sortByInfluence(agents: Agent[], descending: boolean = true): Agent[] {
  return [...agents].sort((a, b) => 
    descending 
      ? b.influenceLevel - a.influenceLevel 
      : a.influenceLevel - b.influenceLevel
  );
}