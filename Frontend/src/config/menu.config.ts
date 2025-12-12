// =============================================================================
// CHE·NU — MENU ENGINE CONFIGURATION
// Foundation Freeze V1
// =============================================================================
// Toute la navigation est générée depuis cette configuration JSON.
// AUCUNE navigation hardcodée n'est permise.
// =============================================================================

import { MenuNode, SphereId, ViewMode } from '../types';
import { SPHERE_CONFIGS } from './spheres.config';

// -----------------------------------------------------------------------------
// TRUNK MENU NODES (Root Level)
// -----------------------------------------------------------------------------

const TRUNK_NODES: MenuNode[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    labelFr: 'Tableau de Bord',
    emoji: '🏠',
    type: 'trunk',
    priority: 100,
    dataWeight: 1,
    visibility: {
      modes: ['2d', '3d', 'xr']
    },
    path: '/',
    children: []
  },
  {
    id: 'universe-view',
    label: 'Universe View',
    labelFr: 'Vue Univers',
    emoji: '🌌',
    type: 'trunk',
    priority: 95,
    dataWeight: 1,
    visibility: {
      modes: ['2d', '3d', 'xr']
    },
    path: '/universe',
    children: []
  },
  {
    id: 'spheres-index',
    label: 'Spheres',
    labelFr: 'Sphères',
    emoji: '🔮',
    type: 'trunk',
    priority: 90,
    dataWeight: 1,
    visibility: {
      modes: ['2d', '3d', 'xr']
    },
    path: '/spheres',
    children: [
      'sphere-personal',
      'sphere-business',
      'sphere-scholar',
      'sphere-creative-studio',
      'sphere-social-media',
      'sphere-methodology',
      'sphere-ia-lab',
      'sphere-xr-immersive',
      'sphere-institutions',
      'sphere-my-team'
    ]
  },
  {
    id: 'meeting-rooms',
    label: 'Meeting Rooms',
    labelFr: 'Salles de Réunion',
    emoji: '🏢',
    type: 'trunk',
    priority: 85,
    dataWeight: 0.8,
    visibility: {
      modes: ['2d', '3d', 'xr']
    },
    path: '/meetings',
    children: []
  },
  {
    id: 'nova-chat',
    label: 'NOVA',
    labelFr: 'NOVA',
    emoji: '✨',
    type: 'trunk',
    priority: 99,
    dataWeight: 1,
    visibility: {
      modes: ['2d', '3d', 'xr']
    },
    path: '/nova',
    children: []
  },
  {
    id: 'settings',
    label: 'Settings',
    labelFr: 'Paramètres',
    emoji: '⚙️',
    type: 'trunk',
    priority: 50,
    dataWeight: 0.5,
    visibility: {
      modes: ['2d', '3d', 'xr']
    },
    path: '/settings',
    children: [
      'settings-account',
      'settings-preferences',
      'settings-privacy',
      'settings-appearance'
    ]
  }
];

// -----------------------------------------------------------------------------
// SPHERE MENU NODES (Generated from Sphere Config)
// -----------------------------------------------------------------------------

function generateSphereMenuNodes(): MenuNode[] {
  const sphereNodes: MenuNode[] = [];
  
  Object.entries(SPHERE_CONFIGS).forEach(([sphereId, config]) => {
    // Main sphere node
    const mainNode: MenuNode = {
      id: `sphere-${sphereId}`,
      label: config.label,
      labelFr: config.labelFr,
      emoji: config.emoji,
      type: 'sphere',
      parentId: 'spheres-index',
      priority: Math.round(config.importance * 100),
      dataWeight: config.importance,
      visibility: {
        modes: ['2d', '3d', 'xr']
      },
      path: `/sphere/${sphereId}`,
      children: [
        `sphere-${sphereId}-home`,
        ...config.categories.map(cat => `sphere-${sphereId}-${cat.id}`)
      ]
    };
    sphereNodes.push(mainNode);
    
    // Sphere home page
    sphereNodes.push({
      id: `sphere-${sphereId}-home`,
      label: `${config.label} Home`,
      labelFr: `Accueil ${config.labelFr}`,
      emoji: '🏠',
      type: 'page',
      parentId: `sphere-${sphereId}`,
      priority: 100,
      dataWeight: 1,
      visibility: {
        modes: ['2d', '3d', 'xr'],
        requiresSphere: sphereId as SphereId
      },
      path: `/sphere/${sphereId}`
    });
    
    // Category nodes
    config.categories.forEach((category, index) => {
      sphereNodes.push({
        id: `sphere-${sphereId}-${category.id}`,
        label: category.label,
        labelFr: category.labelFr,
        emoji: category.emoji,
        type: 'category',
        parentId: `sphere-${sphereId}`,
        priority: 90 - index * 5,
        dataWeight: 0.8,
        visibility: {
          modes: ['2d', '3d', 'xr'],
          requiresSphere: sphereId as SphereId
        },
        path: `/sphere/${sphereId}/${category.id}`
      });
    });
  });
  
  return sphereNodes;
}

// -----------------------------------------------------------------------------
// SETTINGS MENU NODES
// -----------------------------------------------------------------------------

const SETTINGS_NODES: MenuNode[] = [
  {
    id: 'settings-account',
    label: 'Account',
    labelFr: 'Compte',
    emoji: '👤',
    type: 'page',
    parentId: 'settings',
    priority: 90,
    dataWeight: 0.8,
    visibility: {
      modes: ['2d', '3d', 'xr']
    },
    path: '/settings/account'
  },
  {
    id: 'settings-preferences',
    label: 'Preferences',
    labelFr: 'Préférences',
    emoji: '🎛️',
    type: 'page',
    parentId: 'settings',
    priority: 85,
    dataWeight: 0.7,
    visibility: {
      modes: ['2d', '3d', 'xr']
    },
    path: '/settings/preferences'
  },
  {
    id: 'settings-privacy',
    label: 'Privacy',
    labelFr: 'Confidentialité',
    emoji: '🔒',
    type: 'page',
    parentId: 'settings',
    priority: 80,
    dataWeight: 0.6,
    visibility: {
      modes: ['2d', '3d', 'xr']
    },
    path: '/settings/privacy'
  },
  {
    id: 'settings-appearance',
    label: 'Appearance',
    labelFr: 'Apparence',
    emoji: '🎨',
    type: 'page',
    parentId: 'settings',
    priority: 75,
    dataWeight: 0.5,
    visibility: {
      modes: ['2d', '3d', 'xr']
    },
    path: '/settings/appearance'
  }
];

// -----------------------------------------------------------------------------
// TOOL MENU NODES (Context-sensitive actions)
// -----------------------------------------------------------------------------

const TOOL_NODES: MenuNode[] = [
  {
    id: 'tool-search',
    label: 'Search',
    labelFr: 'Rechercher',
    emoji: '🔍',
    type: 'tool',
    priority: 95,
    dataWeight: 1,
    visibility: {
      modes: ['2d', '3d', 'xr']
    },
    action: 'openSearch'
  },
  {
    id: 'tool-quick-add',
    label: 'Quick Add',
    labelFr: 'Ajout Rapide',
    emoji: '➕',
    type: 'tool',
    priority: 90,
    dataWeight: 0.9,
    visibility: {
      modes: ['2d', '3d', 'xr']
    },
    action: 'openQuickAdd'
  },
  {
    id: 'tool-notifications',
    label: 'Notifications',
    labelFr: 'Notifications',
    emoji: '🔔',
    type: 'tool',
    priority: 85,
    dataWeight: 0.8,
    visibility: {
      modes: ['2d', '3d', 'xr']
    },
    action: 'openNotifications'
  },
  {
    id: 'tool-context-bridge',
    label: 'Context Bridge',
    labelFr: 'Pont Contextuel',
    emoji: '🌉',
    type: 'tool',
    priority: 80,
    dataWeight: 0.7,
    visibility: {
      modes: ['2d', '3d', 'xr']
    },
    action: 'openContextBridge'
  },
  {
    id: 'tool-view-mode',
    label: 'View Mode',
    labelFr: 'Mode de Vue',
    emoji: '👁️',
    type: 'tool',
    priority: 75,
    dataWeight: 0.6,
    visibility: {
      modes: ['2d', '3d', 'xr']
    },
    action: 'toggleViewMode'
  }
];

// -----------------------------------------------------------------------------
// COMBINED MENU CONFIGURATION
// -----------------------------------------------------------------------------

/**
 * Configuration complète du menu
 */
export interface MenuConfig {
  nodes: MenuNode[];
  nodeMap: Record<string, MenuNode>;
  rootNodes: string[];
  trunkNodes: string[];
  sphereNodes: string[];
}

/**
 * Générer la configuration complète du menu
 */
export function generateMenuConfig(): MenuConfig {
  const sphereNodes = generateSphereMenuNodes();
  
  const allNodes: MenuNode[] = [
    ...TRUNK_NODES,
    ...sphereNodes,
    ...SETTINGS_NODES,
    ...TOOL_NODES
  ];
  
  // Build node map
  const nodeMap: Record<string, MenuNode> = {};
  allNodes.forEach(node => {
    nodeMap[node.id] = node;
  });
  
  // Identify root nodes (no parent)
  const rootNodes = allNodes
    .filter(node => !node.parentId)
    .map(node => node.id);
  
  // Identify trunk nodes
  const trunkNodes = TRUNK_NODES.map(node => node.id);
  
  // Identify sphere nodes
  const sphereNodeIds = sphereNodes
    .filter(node => node.type === 'sphere')
    .map(node => node.id);
  
  return {
    nodes: allNodes,
    nodeMap,
    rootNodes,
    trunkNodes,
    sphereNodes: sphereNodeIds
  };
}

// -----------------------------------------------------------------------------
// MENU UTILITIES
// -----------------------------------------------------------------------------

/**
 * Filtrer les nœuds par mode de vue
 */
export function filterNodesByViewMode(
  nodes: MenuNode[],
  mode: ViewMode
): MenuNode[] {
  return nodes.filter(node => node.visibility.modes.includes(mode));
}

/**
 * Filtrer les nœuds par poids de données minimum
 */
export function filterNodesByDataWeight(
  nodes: MenuNode[],
  minWeight: number
): MenuNode[] {
  return nodes.filter(node => node.dataWeight >= minWeight);
}

/**
 * Trier les nœuds par priorité
 */
export function sortNodesByPriority(nodes: MenuNode[]): MenuNode[] {
  return [...nodes].sort((a, b) => b.priority - a.priority);
}

/**
 * Obtenir les enfants d'un nœud
 */
export function getChildNodes(
  nodeId: string,
  nodeMap: Record<string, MenuNode>
): MenuNode[] {
  const node = nodeMap[nodeId];
  if (!node || !node.children) return [];
  
  return node.children
    .map(childId => nodeMap[childId])
    .filter(Boolean);
}

/**
 * Obtenir le chemin jusqu'à un nœud (breadcrumb)
 */
export function getNodePath(
  nodeId: string,
  nodeMap: Record<string, MenuNode>
): MenuNode[] {
  const path: MenuNode[] = [];
  let currentNode = nodeMap[nodeId];
  
  while (currentNode) {
    path.unshift(currentNode);
    if (currentNode.parentId) {
      currentNode = nodeMap[currentNode.parentId];
    } else {
      break;
    }
  }
  
  return path;
}

/**
 * Calculer la taille visuelle d'un nœud basée sur le poids des données
 */
export function calculateNodeVisualSize(
  node: MenuNode,
  baseSize: number = 1
): number {
  return baseSize * (0.5 + node.dataWeight * 0.5) * (node.priority / 100);
}

// -----------------------------------------------------------------------------
// DEFAULT MENU CONFIG (Singleton)
// -----------------------------------------------------------------------------

export const DEFAULT_MENU_CONFIG = generateMenuConfig();

// Export individual arrays for convenience
export const MENU_NODES = DEFAULT_MENU_CONFIG.nodes;
export const MENU_NODE_MAP = DEFAULT_MENU_CONFIG.nodeMap;
export const ROOT_NODE_IDS = DEFAULT_MENU_CONFIG.rootNodes;
export const TRUNK_NODE_IDS = DEFAULT_MENU_CONFIG.trunkNodes;
export const SPHERE_NODE_IDS = DEFAULT_MENU_CONFIG.sphereNodes;
