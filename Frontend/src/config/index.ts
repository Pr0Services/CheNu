// =============================================================================
// CHE·NU — CONFIGURATION INDEX
// Foundation Freeze V1
// =============================================================================
// Point d'entrée unique pour toutes les configurations
// =============================================================================

// Types
export * from '../types';

// Sphere Configuration
export {
  SPHERE_PERSONAL,
  SPHERE_BUSINESS,
  SPHERE_SCHOLAR,
  SPHERE_CREATIVE_STUDIO,
  SPHERE_SOCIAL_MEDIA,
  SPHERE_METHODOLOGY,
  SPHERE_IA_LAB,
  SPHERE_XR_IMMERSIVE,
  SPHERE_INSTITUTIONS,
  SPHERE_MY_TEAM,
  SPHERE_CONFIGS,
  ALL_SPHERES,
  getSphereConfig,
  getSphereCategories
} from './spheres.config';

// Agent Configuration
export {
  AGENT_NOVA,
  L1_DIRECTORS,
  L2_MANAGERS,
  L3_SPECIALISTS,
  ALL_AGENTS,
  AGENT_CONFIGS,
  getAgentsByLevel,
  getAgentsBySphere,
  getAgentConfig
} from './agents.config';

// Menu Configuration
export {
  generateMenuConfig,
  filterNodesByViewMode,
  filterNodesByDataWeight,
  sortNodesByPriority,
  getChildNodes,
  getNodePath,
  calculateNodeVisualSize,
  DEFAULT_MENU_CONFIG,
  MENU_NODES,
  MENU_NODE_MAP,
  ROOT_NODE_IDS,
  TRUNK_NODE_IDS,
  SPHERE_NODE_IDS
} from './menu.config';

// Universe Configuration
export {
  CORE_CONFIG,
  VISUAL_RULES,
  SPHERE_STATE_VISUALS,
  VIEW_MODE_CONFIG,
  TRANSITION_RULES,
  ORBIT_LEVELS,
  UNIVERSE_DIMENSIONS,
  ERROR_VISUALS,
  DATA_TO_GRAPHICS_MAPPING,
  DEFAULT_UNIVERSE_CONFIG,
  ANIMATION_TIMING,
  UNIVERSE_COLORS
} from './universe.config';

// -----------------------------------------------------------------------------
// MINIMAP CONFIGURATION
// -----------------------------------------------------------------------------

import { MinimapConfig } from '../types';

/**
 * Configuration par défaut de la minimap
 */
export const DEFAULT_MINIMAP_CONFIG: MinimapConfig = {
  mode: 'full',
  position: 'bottom-right',
  size: 'medium',
  opacity: 0.9,
  autoHide: false,
  autoHideDelay: 3000
};

/**
 * Configuration minimap pour mobile
 */
export const MOBILE_MINIMAP_CONFIG: MinimapConfig = {
  mode: 'ring',
  position: 'bottom-right',
  size: 'small',
  opacity: 0.8,
  autoHide: true,
  autoHideDelay: 2000
};

/**
 * Configuration minimap pour XR
 */
export const XR_MINIMAP_CONFIG: MinimapConfig = {
  mode: 'compact',
  position: 'bottom-left',  // Wrist-mounted feel
  size: 'small',
  opacity: 0.7,
  autoHide: true,
  autoHideDelay: 5000
};

// -----------------------------------------------------------------------------
// USER PREFERENCES DEFAULTS
// -----------------------------------------------------------------------------

import { UserPreferences } from '../types';

/**
 * Préférences utilisateur par défaut
 */
export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  preferredViewMode: '3d',
  minimap: DEFAULT_MINIMAP_CONFIG,
  informationDensity: 'standard',
  reduceMotion: false,
  animationSpeed: 'normal',
  language: 'fr',
  notificationLevel: 'important',
  theme: 'dark',
  highContrast: false,
  largeText: false
};

// -----------------------------------------------------------------------------
// RUNTIME STATE DEFAULTS
// -----------------------------------------------------------------------------

import { SphereRuntimeState, AgentRuntimeState, SphereId } from '../types';

/**
 * Générer un état runtime par défaut pour une sphère
 */
export function createDefaultSphereRuntimeState(sphereId: SphereId): SphereRuntimeState {
  return {
    sphereId,
    activity: 0,
    contentVolume: 0,
    hasNotifications: false,
    notificationCount: 0,
    lastAccessedAt: new Date().toISOString(),
    visualState: 'idle'
  };
}

/**
 * Générer un état runtime par défaut pour un agent
 */
export function createDefaultAgentRuntimeState(agentId: string): AgentRuntimeState {
  return {
    agentId,
    state: 'idle',
    confidence: 1,
    urgency: 0,
    lastActiveAt: new Date().toISOString()
  };
}

/**
 * Générer les états runtime par défaut pour toutes les sphères
 */
export function createDefaultSphereStates(): Record<SphereId, SphereRuntimeState> {
  const states: Record<string, SphereRuntimeState> = {};
  
  const sphereIds: SphereId[] = [
    'personal', 'business', 'scholar', 'creative-studio', 'social-media',
    'methodology', 'ia-lab', 'xr-immersive', 'institutions', 'my-team'
  ];
  
  sphereIds.forEach(id => {
    states[id] = createDefaultSphereRuntimeState(id);
  });
  
  return states as Record<SphereId, SphereRuntimeState>;
}

// -----------------------------------------------------------------------------
// VALIDATION HELPERS
// -----------------------------------------------------------------------------

/**
 * Valider qu'un ID de sphère est valide
 */
export function isValidSphereId(id: string): id is SphereId {
  const validIds: string[] = [
    'personal', 'business', 'scholar', 'creative-studio', 'social-media',
    'methodology', 'ia-lab', 'xr-immersive', 'institutions', 'my-team'
  ];
  return validIds.includes(id);
}

/**
 * Valider un mode de vue
 */
export function isValidViewMode(mode: string): mode is 'ViewMode' {
  return ['2d', '3d', 'xr'].includes(mode);
}
