/* =====================================================
   CHE·NU — Sphere Cluster Utilities
   ui/spheres/sphereCluster.utils.ts
   ===================================================== */

import { 
  SphereData, 
  SpherePosition, 
  DimensionClass,
  DIMENSION_CONFIGS 
} from './sphereCard.types';
import { SphereType } from '@/core/theme/theme.types';
import { getSphereColor, getSphereIcon } from '@/core/theme/themeEngine';

// ─────────────────────────────────────────────────────
// Config Types
// ─────────────────────────────────────────────────────

interface SphereConfig {
  id: string;
  name: string;
  type: SphereType;
  icon: string;
  description: string;
  color: string;
  order: number;
  isActive: boolean;
  defaultDimension: DimensionClass;
  agents: string[];
  tools: string[];
}

interface ChenuConfig {
  spheres: SphereConfig[];
  [key: string]: unknown;
}

// ─────────────────────────────────────────────────────
// Build Root Spheres from Config
// ─────────────────────────────────────────────────────

export function buildRootSpheres(config: ChenuConfig): SphereData[] {
  return config.spheres
    .filter(s => s.isActive)
    .sort((a, b) => a.order - b.order)
    .map(sphereConfig => configToSphereData(sphereConfig));
}

function configToSphereData(config: SphereConfig): SphereData {
  const dimensionClass = config.defaultDimension || 'M';
  
  return {
    id: config.id,
    name: config.name,
    type: config.type,
    description: config.description,
    dimensionClass,
    normalizedDimension: dimensionToNormalized(dimensionClass),
    isActive: config.isActive,
    isLocked: false,
    color: config.color || getSphereColor(config.type),
    icon: config.icon || getSphereIcon(config.type),
    order: config.order,
    agents: [],  // Will be populated from agent registry
    indicators: generateDefaultIndicators(config),
  };
}

// ─────────────────────────────────────────────────────
// Dimension Utilities
// ─────────────────────────────────────────────────────

function dimensionToNormalized(dim: DimensionClass): number {
  const map: Record<DimensionClass, number> = {
    XS: 0.2,
    S: 0.4,
    M: 0.6,
    L: 0.8,
    XL: 1.0,
  };
  return map[dim];
}

export function normalizedToDimension(normalized: number): DimensionClass {
  if (normalized <= 0.25) return 'XS';
  if (normalized <= 0.45) return 'S';
  if (normalized <= 0.65) return 'M';
  if (normalized <= 0.85) return 'L';
  return 'XL';
}

export function getDimensionConfig(dim: DimensionClass) {
  return DIMENSION_CONFIGS[dim];
}

// ─────────────────────────────────────────────────────
// Position Computation
// ─────────────────────────────────────────────────────

export function computePositions(count: number, layout: 'radial' | 'grid' = 'radial'): SpherePosition[] {
  if (layout === 'grid') {
    return computeGridPositions(count);
  }
  return computeRadialPositions(count);
}

function computeRadialPositions(count: number): SpherePosition[] {
  const positions: SpherePosition[] = [];
  const baseRadius = 180;
  const radiusVariation = 40;
  
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count - Math.PI / 2; // Start from top
    const radiusOffset = (i % 2) * radiusVariation; // Alternate distance
    const radius = baseRadius + radiusOffset;
    
    positions.push({
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      z: 0,
      scale: 1,
      rotation: 0,
    });
  }
  
  return positions;
}

function computeGridPositions(count: number): SpherePosition[] {
  const positions: SpherePosition[] = [];
  const cols = Math.ceil(Math.sqrt(count));
  const spacing = 150;
  const startX = -((cols - 1) * spacing) / 2;
  const startY = -((Math.ceil(count / cols) - 1) * spacing) / 2;
  
  for (let i = 0; i < count; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    
    positions.push({
      x: startX + col * spacing,
      y: startY + row * spacing,
      z: 0,
      scale: 1,
      rotation: 0,
    });
  }
  
  return positions;
}

// ─────────────────────────────────────────────────────
// Sphere Limiting (for performance)
// ─────────────────────────────────────────────────────

const MAX_VISIBLE_SPHERES = 12;

export function limitSpheres(spheres: SphereData[]): SphereData[] {
  if (spheres.length <= MAX_VISIBLE_SPHERES) {
    return spheres;
  }
  
  // Prioritize active and larger spheres
  return spheres
    .sort((a, b) => {
      if (a.isActive !== b.isActive) return a.isActive ? -1 : 1;
      return b.normalizedDimension - a.normalizedDimension;
    })
    .slice(0, MAX_VISIBLE_SPHERES);
}

// ─────────────────────────────────────────────────────
// Default Indicators
// ─────────────────────────────────────────────────────

function generateDefaultIndicators(config: SphereConfig) {
  return [
    {
      id: 'agents',
      label: 'Agents',
      value: config.agents.length,
      type: 'count' as const,
    },
    {
      id: 'tools',
      label: 'Tools',
      value: config.tools.length,
      type: 'count' as const,
    },
  ];
}

// ─────────────────────────────────────────────────────
// Animation Helpers
// ─────────────────────────────────────────────────────

export function getTransitionStyle(isFocused: boolean, position: SpherePosition) {
  return {
    transform: `
      translate(-50%, -50%)
      translate(${position.x}px, ${position.y}px)
      translateZ(${position.z || 0}px)
      scale(${isFocused ? 1.12 : (position.scale || 1)})
      rotate(${position.rotation || 0}deg)
    `,
    transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease',
  };
}

// ─────────────────────────────────────────────────────
// Sphere Filtering
// ─────────────────────────────────────────────────────

export function filterSpheresByType(spheres: SphereData[], types: SphereType[]): SphereData[] {
  return spheres.filter(s => types.includes(s.type));
}

export function findSphereById(spheres: SphereData[], id: string): SphereData | undefined {
  return spheres.find(s => s.id === id);
}

export function getActiveSpheres(spheres: SphereData[]): SphereData[] {
  return spheres.filter(s => s.isActive && !s.isLocked);
}