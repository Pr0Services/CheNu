/* =====================================================
   CHE·NU — Sphere System Types
   ui/spheres/sphereCard.types.ts
   ===================================================== */

import { SphereType } from '@/core/theme/theme.types';
import { Agent } from '@/core/agents/agent.types';

// ─────────────────────────────────────────────────────
// Core Sphere Data
// ─────────────────────────────────────────────────────

export interface SphereData {
  id: string;
  name: string;
  type: SphereType;
  description: string;
  
  // Visual classification
  dimensionClass: DimensionClass;
  normalizedDimension: number;  // 0-1, for visual scaling
  
  // State
  isActive: boolean;
  isLocked: boolean;
  
  // Content
  indicators?: SphereIndicator[];
  agents: Agent[];
  subSpheres?: SphereData[];
  
  // Metadata
  color: string;
  icon: string;
  order: number;
}

// ─────────────────────────────────────────────────────
// Dimension Classification
// ─────────────────────────────────────────────────────

export type DimensionClass = 'XS' | 'S' | 'M' | 'L' | 'XL';

export interface DimensionConfig {
  minSize: number;
  maxSize: number;
  showIndicators: boolean;
  showAgents: boolean;
  cardPadding: number;
}

export const DIMENSION_CONFIGS: Record<DimensionClass, DimensionConfig> = {
  XS: { minSize: 60, maxSize: 80, showIndicators: false, showAgents: false, cardPadding: 8 },
  S: { minSize: 80, maxSize: 120, showIndicators: false, showAgents: false, cardPadding: 12 },
  M: { minSize: 120, maxSize: 180, showIndicators: true, showAgents: false, cardPadding: 16 },
  L: { minSize: 180, maxSize: 240, showIndicators: true, showAgents: true, cardPadding: 20 },
  XL: { minSize: 240, maxSize: 320, showIndicators: true, showAgents: true, cardPadding: 24 },
};

// ─────────────────────────────────────────────────────
// Sphere Indicators
// ─────────────────────────────────────────────────────

export interface SphereIndicator {
  id: string;
  label: string;
  value: string | number;
  type: IndicatorType;
  trend?: 'up' | 'down' | 'stable';
  color?: string;
}

export type IndicatorType = 
  | 'count'
  | 'percentage'
  | 'currency'
  | 'status'
  | 'progress'
  | 'text';

// ─────────────────────────────────────────────────────
// Sphere Card Props
// ─────────────────────────────────────────────────────

export interface SphereCardProps {
  sphere: SphereData;
  isFocused?: boolean;
  isMinimized?: boolean;
  onFocus?: (id: string) => void;
  onEnter?: (id: string) => void;
  onAction?: (action: SphereAction) => void;
}

export interface SphereAction {
  type: 'focus' | 'enter' | 'minimize' | 'expand' | 'menu';
  sphereId: string;
  payload?: unknown;
}

// ─────────────────────────────────────────────────────
// Sphere Cluster Props
// ─────────────────────────────────────────────────────

export interface SphereClusterProps {
  spheres: SphereData[];
  focusedSphereId?: string;
  layout?: ClusterLayout;
  onFocus?: (id: string) => void;
  onEnter?: (id: string) => void;
}

export type ClusterLayout = 
  | 'radial'      // Spheres around center
  | 'orbital'     // Spheres in orbit paths
  | 'grid'        // Regular grid
  | 'tree'        // Hierarchical tree
  | 'freeform';   // User-positioned

// ─────────────────────────────────────────────────────
// Sphere Focus View Props
// ─────────────────────────────────────────────────────

export interface SphereFocusViewProps {
  sphere: SphereData;
  onExit: () => void;
  onNavigate?: (subSphereId: string) => void;
}

// ─────────────────────────────────────────────────────
// Sphere Position (for layout)
// ─────────────────────────────────────────────────────

export interface SpherePosition {
  x: number;
  y: number;
  z?: number;     // For 3D layouts
  scale?: number;
  rotation?: number;
}

// ─────────────────────────────────────────────────────
// Sphere Menu
// ─────────────────────────────────────────────────────

export interface SphereMenuItem {
  id: string;
  label: string;
  icon: string;
  shortcut?: string;
  action: () => void;
  disabled?: boolean;
  children?: SphereMenuItem[];
}

export interface SphereMenuConfig {
  items: SphereMenuItem[];
  position: 'top' | 'bottom' | 'left' | 'right' | 'context';
}

// ─────────────────────────────────────────────────────
// Sphere Connection (for tree view)
// ─────────────────────────────────────────────────────

export interface SphereConnection {
  from: string;      // Sphere ID
  to: string;        // Sphere ID
  type: ConnectionType;
  strength?: number; // 0-1
  label?: string;
}

export type ConnectionType = 
  | 'parent-child'
  | 'peer'
  | 'dependency'
  | 'reference';