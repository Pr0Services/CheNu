/* =====================================================
   CHE·NU — Content Builder
   
   PHASE 3: CONFIG → CONTENT NODE
   
   Transforms JSON configurations into ContentNode trees.
   This is the bridge between static configs and the
   dynamic page composition system.
   
   Key principle: This builder reads configs,
   it doesn't invent content.
   ===================================================== */

import { ContentNode, NodeVisual, NodeState, NodeMetrics } from './page.types';
import { SphereConfig } from '../../core-reference/resolver/types';

// ─────────────────────────────────────────────────────
// UNIVERSE BUILDER
// ─────────────────────────────────────────────────────

interface UniverseData {
  spheres: SphereConfig[];
  metrics?: {
    totalAgents: number;
    activeSpheres: number;
    pendingDecisions: number;
  };
}

/**
 * Builds the universe root node from sphere configs.
 */
export function buildUniverseContent(data: UniverseData): ContentNode {
  const children = data.spheres.map((sphere, index) => 
    buildSphereNode(sphere, index)
  );
  
  return {
    id: 'universe',
    type: 'universe',
    label: 'CHE·NU',
    icon: '🌳',
    description: 'Governed Intelligence OS',
    visual: {
      shape: 'organic',
      colorPrimary: '#4A7C4A',
      colorSecondary: '#5A8C5A',
      colorAccent: '#D8B26A',
      growthAxis: 'radial',
      glowEnabled: true,
      glowIntensity: 0.3,
    },
    children,
    childCount: children.length,
    metrics: data.metrics ? {
      itemCount: data.spheres.length,
      agentCount: data.metrics.totalAgents,
      activeCount: data.metrics.activeSpheres,
      pendingCount: data.metrics.pendingDecisions,
    } : undefined,
    state: {
      isActive: true,
      isLocked: false,
      isFocused: false,
      isExpanded: true,
      activityLevel: 'active',
    },
    priority: 0,
  };
}

// ─────────────────────────────────────────────────────
// SPHERE NODE BUILDER
// ─────────────────────────────────────────────────────

/**
 * Builds a sphere node from config.
 * Doesn't know what type of sphere — reads from config.
 */
export function buildSphereNode(config: SphereConfig, index: number): ContentNode {
  const visual = mapSphereVisual(config.visual);
  
  // Build children from config sections
  const children = config.content?.sections?.map((section, i) => ({
    id: `${config.id}-${section.id}`,
    type: 'section',
    label: section.label,
    icon: section.icon,
    visual,
    state: {
      isActive: false,
      isLocked: false,
      isFocused: false,
      isExpanded: false,
      activityLevel: 'idle' as const,
    },
    priority: section.order,
  })) || [];
  
  return {
    id: config.id,
    type: 'sphere',
    label: config.name,
    icon: config.visual.icon,
    description: `${config.agents?.roles?.length || 0} agents`,
    visual,
    children,
    childCount: children.length,
    metrics: {
      itemCount: children.length,
      agentCount: config.agents?.roles?.length || 0,
      activeCount: 0,
      pendingCount: 0,
    },
    actions: [
      { id: 'enter', label: 'Enter', icon: '→', type: 'primary' },
      { id: 'configure', label: 'Configure', icon: '⚙️', type: 'secondary', requiredPermission: 'admin' },
    ],
    state: {
      isActive: false,
      isLocked: false,
      isFocused: false,
      isExpanded: false,
      activityLevel: 'idle',
    },
    priority: index,
  };
}

/**
 * Maps sphere visual config to node visual.
 */
function mapSphereVisual(config: SphereConfig['visual']): NodeVisual {
  return {
    shape: config.baseShape,
    colorPrimary: config.color.primary,
    colorSecondary: config.color.secondary,
    colorAccent: config.color.accent,
    growthAxis: config.growthAxis,
    glowEnabled: config.glow.enabled,
    glowIntensity: config.glow.intensity,
  };
}

// ─────────────────────────────────────────────────────
// GENERIC NODE BUILDER
// ─────────────────────────────────────────────────────

interface NodeData {
  id: string;
  type: string;
  label: string;
  icon?: string;
  description?: string;
  visual?: Partial<NodeVisual>;
  children?: NodeData[];
  metrics?: Partial<NodeMetrics>;
  isLocked?: boolean;
  activityLevel?: NodeState['activityLevel'];
}

/**
 * Builds a generic content node from data.
 * Works for any node type.
 */
export function buildNode(
  data: NodeData,
  parentVisual: NodeVisual,
  priority: number = 0
): ContentNode {
  const visual: NodeVisual = {
    ...parentVisual,
    ...data.visual,
  };
  
  const children = data.children?.map((child, i) => 
    buildNode(child, visual, i)
  );
  
  return {
    id: data.id,
    type: data.type,
    label: data.label,
    icon: data.icon,
    description: data.description,
    visual,
    children,
    childCount: children?.length,
    metrics: data.metrics ? {
      itemCount: data.metrics.itemCount || 0,
      agentCount: data.metrics.agentCount || 0,
      activeCount: data.metrics.activeCount || 0,
      pendingCount: data.metrics.pendingCount || 0,
    } : undefined,
    state: {
      isActive: data.activityLevel === 'active' || data.activityLevel === 'busy',
      isLocked: data.isLocked || false,
      isFocused: false,
      isExpanded: false,
      activityLevel: data.activityLevel || 'idle',
    },
    priority,
  };
}

// ─────────────────────────────────────────────────────
// CONTENT TRANSFORMER
// ─────────────────────────────────────────────────────

/**
 * Applies a transformation to a content tree.
 * Useful for updating state, filtering, or enriching.
 */
export function transformContent(
  node: ContentNode,
  transformer: (node: ContentNode) => ContentNode
): ContentNode {
  const transformed = transformer(node);
  
  if (!transformed.children) {
    return transformed;
  }
  
  return {
    ...transformed,
    children: transformed.children.map(child => 
      transformContent(child, transformer)
    ),
  };
}

/**
 * Finds a node by ID in a content tree.
 */
export function findNode(root: ContentNode, id: string): ContentNode | null {
  if (root.id === id) return root;
  
  if (root.children) {
    for (const child of root.children) {
      const found = findNode(child, id);
      if (found) return found;
    }
  }
  
  return null;
}

/**
 * Gets a node at a specific path.
 */
export function getNodeAtPath(root: ContentNode, path: string[]): ContentNode | null {
  if (path.length === 0) return root;
  if (path[0] !== root.id) return null;
  if (path.length === 1) return root;
  
  const childId = path[1];
  const child = root.children?.find(c => c.id === childId);
  
  if (!child) return null;
  
  return getNodeAtPath(child, path.slice(1));
}

/**
 * Updates a node at a specific path.
 */
export function updateNodeAtPath(
  root: ContentNode,
  path: string[],
  updater: (node: ContentNode) => ContentNode
): ContentNode {
  if (path.length === 0 || path[0] !== root.id) return root;
  if (path.length === 1) return updater(root);
  
  const childId = path[1];
  
  return {
    ...root,
    children: root.children?.map(child => 
      child.id === childId 
        ? updateNodeAtPath(child, path.slice(1), updater)
        : child
    ),
  };
}

// ─────────────────────────────────────────────────────
// STATE UPDATERS
// ─────────────────────────────────────────────────────

/**
 * Sets focus on a node.
 */
export function setFocused(root: ContentNode, nodeId: string): ContentNode {
  return transformContent(root, node => ({
    ...node,
    state: {
      ...node.state,
      isFocused: node.id === nodeId,
    },
  }));
}

/**
 * Sets expansion on a node.
 */
export function setExpanded(root: ContentNode, nodeId: string, expanded: boolean): ContentNode {
  return updateNodeAtPath(
    root,
    [nodeId],
    node => ({
      ...node,
      state: { ...node.state, isExpanded: expanded },
    })
  );
}

/**
 * Updates activity level on a node.
 */
export function setActivityLevel(
  root: ContentNode,
  nodeId: string,
  level: NodeState['activityLevel']
): ContentNode {
  return updateNodeAtPath(
    root,
    [nodeId],
    node => ({
      ...node,
      state: {
        ...node.state,
        activityLevel: level,
        isActive: level === 'active' || level === 'busy' || level === 'critical',
      },
    })
  );
}

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default {
  buildUniverseContent,
  buildSphereNode,
  buildNode,
  transformContent,
  findNode,
  getNodeAtPath,
  updateNodeAtPath,
  setFocused,
  setExpanded,
  setActivityLevel,
};
