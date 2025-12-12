/**
 * CHE·NU™ 3D WORLD - TYPES
 */

export type SpaceId = 
  | 'maison' | 'entreprise' | 'projets' 
  | 'gouvernement' | 'immobilier' | 'associations' | 'creative';

export interface SpaceFeature {
  icon: string;
  text: string;
}

export interface SpaceConfig {
  id: SpaceId;
  name: string;
  icon: string;
  subtitle: string;
  color: number;
  colorHex: string;
  position: [number, number, number];
  description: string;
  features: SpaceFeature[];
  stats: Record<string, string | number>;
  route: string;
}

export type AgentType = 'nova' | 'specialist' | 'assistant';
export type AgentExpression = 'idle' | 'thinking' | 'speaking' | 'happy';

export interface AgentConfig {
  id: string;
  name: string;
  type: AgentType;
  color: string;
  position: [number, number, number];
  assignedSpace?: SpaceId;
}

export interface World3DState {
  hoveredSpace: SpaceId | null;
  selectedSpace: SpaceId | null;
  isPanelOpen: boolean;
  cameraTarget: [number, number, number];
  isAnimating: boolean;
  agents: AgentConfig[];
  showLabels: boolean;
  showAgents: boolean;
  
  setHoveredSpace: (spaceId: SpaceId | null) => void;
  selectSpace: (spaceId: SpaceId | null) => void;
  openPanel: () => void;
  closePanel: () => void;
  focusOnSpace: (spaceId: SpaceId) => void;
  resetCamera: () => void;
}

export interface CheNuWorldProps {
  onSpaceSelect?: (spaceId: SpaceId) => void;
  onSpaceEnter?: (spaceId: SpaceId) => void;
  showAgents?: boolean;
  showLabels?: boolean;
  className?: string;
}
