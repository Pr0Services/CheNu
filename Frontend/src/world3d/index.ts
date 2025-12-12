/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ 3D WORLD - EXPORTS
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// Components
export { CheNuWorld } from './components/CheNuWorld';
export { SpacePanel } from './components/SpacePanel';
export { ImmobilierViewer } from './components/ImmobilierViewer';

// Store
export { 
  useWorld3DStore, 
  useSelectedSpaceConfig, 
  useHoveredSpaceConfig,
  useSpaceAgents 
} from './stores/world3DStore';

// Config
export { 
  SPACES_CONFIG, 
  CAMERA_CONFIG, 
  CONTROLS_CONFIG,
  getAllSpaces,
  getSpaceById,
  getSpaceColor 
} from './config/spacesConfig';

// Types
export type {
  SpaceId,
  SpaceConfig,
  SpaceFeature,
  SpaceStats,
  CameraConfig,
  ControlsConfig,
  AgentConfig,
  AgentType,
  AgentExpression,
  World3DState,
  CheNuWorldProps,
  SpaceModelProps,
  AgentBubbleProps,
} from './types/world3D.types';
