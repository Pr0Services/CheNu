/**
 * CHE·NU — AVATAR EVOLUTION SYSTEM + MULTI-MEETING UNIVERSE VIEW
 * React Context & Provider
 * 
 * State management for avatar evolution and universe navigation
 */

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  ReactNode,
} from 'react';

import {
  EvolutionState,
  EvolutionTriggers,
  AvatarEvolution,
  UniverseNode,
  UniverseLink,
  UniverseMeetings,
  UniverseViewState,
  UniverseInteraction,
  SphereType,
  UniverseSafety,
  CoordinationAgent,
  EvolutionRuntimeState,
  AvatarEvolutionUniverseState,
  UniverseNodeType,
  LinkType,
} from './types';

import {
  createEvolution,
  createUniverseNode,
  createUniverseLink,
  COORDINATION_AGENTS,
  DEFAULT_SAFETY,
  SPHERE_LIST,
} from './presets';

// ============================================================
// STATE
// ============================================================

interface SystemState {
  // Evolution
  evolution: EvolutionRuntimeState;
  
  // Universe
  universe: UniverseMeetings;
  view: UniverseViewState;
  
  // Agents
  agents: CoordinationAgent[];
  
  // UI
  isLoading: boolean;
  error: string | null;
}

// ============================================================
// ACTIONS
// ============================================================

type SystemAction =
  // Evolution actions
  | { type: 'EVOLVE_AVATAR'; payload: { avatarId: string; triggers: EvolutionTriggers } }
  | { type: 'SET_EVOLUTION_STATE'; payload: EvolutionState }
  | { type: 'APPLY_USER_OVERRIDE'; payload: Partial<AvatarEvolution['morphology']> }
  | { type: 'CLEAR_EVOLUTION' }
  
  // Universe actions
  | { type: 'ADD_NODE'; payload: Omit<UniverseNode, 'id' | 'position' | 'visual'> }
  | { type: 'REMOVE_NODE'; payload: string }
  | { type: 'ADD_LINK'; payload: { from: string; to: string; type: LinkType } }
  | { type: 'REMOVE_LINK'; payload: string }
  | { type: 'UPDATE_NODE_POSITION'; payload: { nodeId: string; position: { x: number; y: number; z: number } } }
  
  // View actions
  | { type: 'SET_SPHERE_FILTER'; payload: SphereType | null }
  | { type: 'SET_AGENT_FILTER'; payload: string | null }
  | { type: 'SET_ZOOM_LEVEL'; payload: number }
  | { type: 'SET_CENTER_POSITION'; payload: { x: number; y: number; z: number } }
  | { type: 'SET_INTERACTION_MODE'; payload: UniverseInteraction | null }
  | { type: 'TOGGLE_LINK_EXPANSION'; payload: string }
  | { type: 'UPDATE_SAFETY'; payload: Partial<UniverseSafety> }
  
  // UI actions
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET' };

// ============================================================
// INITIAL STATE
// ============================================================

const initialEvolutionRuntime: EvolutionRuntimeState = {
  current_evolution: null,
  transition_in_progress: false,
  transition_progress: 0,
  trigger_history: [],
};

const initialUniverseMeetings: UniverseMeetings = {
  nodes: [],
  links: [],
  last_sync: new Date().toISOString(),
};

const initialViewState: UniverseViewState = {
  current_sphere_filter: null,
  current_agent_filter: null,
  zoom_level: 1.0,
  center_position: { x: 0, y: 0, z: 0 },
  visible_nodes: [],
  expanded_links: [],
  interaction_mode: null,
  safety: DEFAULT_SAFETY,
};

const initialState: SystemState = {
  evolution: initialEvolutionRuntime,
  universe: initialUniverseMeetings,
  view: initialViewState,
  agents: COORDINATION_AGENTS,
  isLoading: false,
  error: null,
};

// ============================================================
// REDUCER
// ============================================================

function systemReducer(state: SystemState, action: SystemAction): SystemState {
  switch (action.type) {
    // Evolution actions
    case 'EVOLVE_AVATAR': {
      const { avatarId, triggers } = action.payload;
      const evolution = createEvolution(avatarId, triggers);
      return {
        ...state,
        evolution: {
          ...state.evolution,
          current_evolution: evolution,
          trigger_history: [triggers, ...state.evolution.trigger_history.slice(0, 9)],
        },
      };
    }
    
    case 'SET_EVOLUTION_STATE': {
      if (!state.evolution.current_evolution) return state;
      return {
        ...state,
        evolution: {
          ...state.evolution,
          current_evolution: {
            ...state.evolution.current_evolution,
            state: action.payload,
            last_updated: new Date().toISOString(),
          },
        },
      };
    }
    
    case 'APPLY_USER_OVERRIDE': {
      if (!state.evolution.current_evolution) return state;
      return {
        ...state,
        evolution: {
          ...state.evolution,
          current_evolution: {
            ...state.evolution.current_evolution,
            morphology: {
              ...state.evolution.current_evolution.morphology,
              ...action.payload,
            },
            user_preferences_active: true,
            last_updated: new Date().toISOString(),
          },
        },
      };
    }
    
    case 'CLEAR_EVOLUTION':
      return {
        ...state,
        evolution: initialEvolutionRuntime,
      };
    
    // Universe actions
    case 'ADD_NODE': {
      const { type, sphere, title, participants, timestamp, metadata } = action.payload;
      const node = createUniverseNode(
        `node_${Date.now()}`,
        type,
        sphere,
        title,
        participants,
        timestamp
      );
      node.metadata = metadata || {};
      
      return {
        ...state,
        universe: {
          ...state.universe,
          nodes: [...state.universe.nodes, node],
          last_sync: new Date().toISOString(),
        },
        view: {
          ...state.view,
          visible_nodes: [...state.view.visible_nodes, node.id],
        },
      };
    }
    
    case 'REMOVE_NODE':
      return {
        ...state,
        universe: {
          ...state.universe,
          nodes: state.universe.nodes.filter(n => n.id !== action.payload),
          links: state.universe.links.filter(
            l => l.from !== action.payload && l.to !== action.payload
          ),
        },
        view: {
          ...state.view,
          visible_nodes: state.view.visible_nodes.filter(id => id !== action.payload),
        },
      };
    
    case 'ADD_LINK': {
      const { from, to, type } = action.payload;
      const link = createUniverseLink(from, to, type);
      return {
        ...state,
        universe: {
          ...state.universe,
          links: [...state.universe.links, link],
        },
      };
    }
    
    case 'REMOVE_LINK':
      return {
        ...state,
        universe: {
          ...state.universe,
          links: state.universe.links.filter(l => l.id !== action.payload),
        },
      };
    
    case 'UPDATE_NODE_POSITION':
      return {
        ...state,
        universe: {
          ...state.universe,
          nodes: state.universe.nodes.map(n =>
            n.id === action.payload.nodeId
              ? { ...n, position: action.payload.position }
              : n
          ),
        },
      };
    
    // View actions
    case 'SET_SPHERE_FILTER': {
      const sphereFilter = action.payload;
      const visibleNodes = sphereFilter
        ? state.universe.nodes.filter(n => n.sphere === sphereFilter).map(n => n.id)
        : state.universe.nodes.map(n => n.id);
      
      return {
        ...state,
        view: {
          ...state.view,
          current_sphere_filter: sphereFilter,
          visible_nodes: visibleNodes,
        },
      };
    }
    
    case 'SET_AGENT_FILTER': {
      const agentFilter = action.payload;
      const visibleNodes = agentFilter
        ? state.universe.nodes.filter(n => n.participants.includes(agentFilter)).map(n => n.id)
        : state.universe.nodes.map(n => n.id);
      
      return {
        ...state,
        view: {
          ...state.view,
          current_agent_filter: agentFilter,
          visible_nodes: visibleNodes,
        },
      };
    }
    
    case 'SET_ZOOM_LEVEL':
      return {
        ...state,
        view: { ...state.view, zoom_level: Math.max(0.1, Math.min(2.0, action.payload)) },
      };
    
    case 'SET_CENTER_POSITION':
      return {
        ...state,
        view: { ...state.view, center_position: action.payload },
      };
    
    case 'SET_INTERACTION_MODE':
      return {
        ...state,
        view: { ...state.view, interaction_mode: action.payload },
      };
    
    case 'TOGGLE_LINK_EXPANSION': {
      const linkId = action.payload;
      const expanded = state.view.expanded_links.includes(linkId)
        ? state.view.expanded_links.filter(id => id !== linkId)
        : [...state.view.expanded_links, linkId];
      
      return {
        ...state,
        view: { ...state.view, expanded_links: expanded },
      };
    }
    
    case 'UPDATE_SAFETY':
      return {
        ...state,
        view: {
          ...state.view,
          safety: { ...state.view.safety, ...action.payload },
        },
      };
    
    // UI actions
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'RESET':
      return initialState;
    
    default:
      return state;
  }
}

// ============================================================
// CONTEXT
// ============================================================

interface SystemContextValue {
  state: SystemState;
  
  // Evolution operations
  evolveAvatar: (avatarId: string, triggers: EvolutionTriggers) => void;
  setEvolutionState: (state: EvolutionState) => void;
  applyUserOverride: (morphology: Partial<AvatarEvolution['morphology']>) => void;
  clearEvolution: () => void;
  
  // Universe operations
  addNode: (type: UniverseNodeType, sphere: SphereType, title: string, participants: string[]) => string;
  removeNode: (nodeId: string) => void;
  addLink: (from: string, to: string, type: LinkType) => void;
  removeLink: (linkId: string) => void;
  
  // View operations
  setSphereFilter: (sphere: SphereType | null) => void;
  setAgentFilter: (agentId: string | null) => void;
  setZoomLevel: (level: number) => void;
  setCenterPosition: (pos: { x: number; y: number; z: number }) => void;
  setInteractionMode: (mode: UniverseInteraction | null) => void;
  toggleLinkExpansion: (linkId: string) => void;
  updateSafety: (safety: Partial<UniverseSafety>) => void;
  
  // Queries
  getVisibleNodes: () => UniverseNode[];
  getVisibleLinks: () => UniverseLink[];
  getNodesBySphere: (sphere: SphereType) => UniverseNode[];
  
  // Reset
  reset: () => void;
}

const SystemContext = createContext<SystemContextValue | null>(null);

// ============================================================
// PROVIDER
// ============================================================

interface SystemProviderProps {
  children: ReactNode;
}

export function AvatarEvolutionUniverseProvider({ children }: SystemProviderProps) {
  const [state, dispatch] = useReducer(systemReducer, initialState);
  
  // Evolution operations
  const evolveAvatar = useCallback((avatarId: string, triggers: EvolutionTriggers) => {
    dispatch({ type: 'EVOLVE_AVATAR', payload: { avatarId, triggers } });
  }, []);
  
  const setEvolutionState = useCallback((evolutionState: EvolutionState) => {
    dispatch({ type: 'SET_EVOLUTION_STATE', payload: evolutionState });
  }, []);
  
  const applyUserOverride = useCallback((morphology: Partial<AvatarEvolution['morphology']>) => {
    dispatch({ type: 'APPLY_USER_OVERRIDE', payload: morphology });
  }, []);
  
  const clearEvolution = useCallback(() => {
    dispatch({ type: 'CLEAR_EVOLUTION' });
  }, []);
  
  // Universe operations
  const addNode = useCallback((
    type: UniverseNodeType,
    sphere: SphereType,
    title: string,
    participants: string[]
  ): string => {
    const nodeId = `node_${Date.now()}`;
    dispatch({
      type: 'ADD_NODE',
      payload: {
        type,
        sphere,
        title,
        participants,
        timestamp: Date.now(),
        metadata: {},
      },
    });
    return nodeId;
  }, []);
  
  const removeNode = useCallback((nodeId: string) => {
    dispatch({ type: 'REMOVE_NODE', payload: nodeId });
  }, []);
  
  const addLink = useCallback((from: string, to: string, type: LinkType) => {
    dispatch({ type: 'ADD_LINK', payload: { from, to, type } });
  }, []);
  
  const removeLink = useCallback((linkId: string) => {
    dispatch({ type: 'REMOVE_LINK', payload: linkId });
  }, []);
  
  // View operations
  const setSphereFilter = useCallback((sphere: SphereType | null) => {
    dispatch({ type: 'SET_SPHERE_FILTER', payload: sphere });
  }, []);
  
  const setAgentFilter = useCallback((agentId: string | null) => {
    dispatch({ type: 'SET_AGENT_FILTER', payload: agentId });
  }, []);
  
  const setZoomLevel = useCallback((level: number) => {
    dispatch({ type: 'SET_ZOOM_LEVEL', payload: level });
  }, []);
  
  const setCenterPosition = useCallback((pos: { x: number; y: number; z: number }) => {
    dispatch({ type: 'SET_CENTER_POSITION', payload: pos });
  }, []);
  
  const setInteractionMode = useCallback((mode: UniverseInteraction | null) => {
    dispatch({ type: 'SET_INTERACTION_MODE', payload: mode });
  }, []);
  
  const toggleLinkExpansion = useCallback((linkId: string) => {
    dispatch({ type: 'TOGGLE_LINK_EXPANSION', payload: linkId });
  }, []);
  
  const updateSafety = useCallback((safety: Partial<UniverseSafety>) => {
    dispatch({ type: 'UPDATE_SAFETY', payload: safety });
  }, []);
  
  // Queries
  const getVisibleNodes = useCallback(() => {
    return state.universe.nodes.filter(n => state.view.visible_nodes.includes(n.id));
  }, [state.universe.nodes, state.view.visible_nodes]);
  
  const getVisibleLinks = useCallback(() => {
    const visibleNodeIds = new Set(state.view.visible_nodes);
    return state.universe.links.filter(
      l => visibleNodeIds.has(l.from) && visibleNodeIds.has(l.to)
    );
  }, [state.universe.links, state.view.visible_nodes]);
  
  const getNodesBySphere = useCallback((sphere: SphereType) => {
    return state.universe.nodes.filter(n => n.sphere === sphere);
  }, [state.universe.nodes]);
  
  // Reset
  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);
  
  const value: SystemContextValue = {
    state,
    evolveAvatar,
    setEvolutionState,
    applyUserOverride,
    clearEvolution,
    addNode,
    removeNode,
    addLink,
    removeLink,
    setSphereFilter,
    setAgentFilter,
    setZoomLevel,
    setCenterPosition,
    setInteractionMode,
    toggleLinkExpansion,
    updateSafety,
    getVisibleNodes,
    getVisibleLinks,
    getNodesBySphere,
    reset,
  };
  
  return (
    <SystemContext.Provider value={value}>
      {children}
    </SystemContext.Provider>
  );
}

// ============================================================
// HOOK
// ============================================================

export function useAvatarEvolutionUniverse(): SystemContextValue {
  const context = useContext(SystemContext);
  if (!context) {
    throw new Error('useAvatarEvolutionUniverse must be used within AvatarEvolutionUniverseProvider');
  }
  return context;
}

// ============================================================
// EXPORTS
// ============================================================

export { SystemContext };
export type { SystemState, SystemContextValue };
