/**
 * CHE·NU — XR REPLAY COMPARISON + AI ROUTING
 * React Context & Provider
 */

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  ReactNode,
} from 'react';

import {
  XRComparison,
  ComparisonMode,
  ComparisonSource,
  ComparisonControlState,
  ComparisonLayers,
  ComparisonEvent,
  ArtifactDiff,
  UniverseRouting,
  RoutingUserControls,
  RoutingSuggestion,
  RoutingOutputMode,
  RoutingSignal,
  RoutingContext,
  RoutingAgent,
  XRComparisonRoutingState,
} from './types';

import {
  DEFAULT_CONTROL_STATE,
  DEFAULT_LAYERS,
  DEFAULT_ROUTING,
  DEFAULT_USER_CONTROLS,
  ROUTING_AGENTS,
  createComparison,
  createComparisonSource,
  createRoutingSuggestion,
  filterSuggestionsByConfidence,
} from './presets';

// ============================================================
// ACTIONS
// ============================================================

type Action =
  // Comparison actions
  | { type: 'CREATE_COMPARISON'; payload: { mode: ComparisonMode; source1: ComparisonSource; source2: ComparisonSource; createdBy: string } }
  | { type: 'CLOSE_COMPARISON' }
  | { type: 'SET_SYNC_ANCHOR'; payload: XRComparison['sync_anchor'] }
  | { type: 'TOGGLE_LAYER'; payload: keyof ComparisonLayers }
  | { type: 'SET_CONTROL'; payload: Partial<ComparisonControlState> }
  | { type: 'ADD_COMPARISON_EVENT'; payload: ComparisonEvent }
  | { type: 'ADD_ARTIFACT_DIFF'; payload: ArtifactDiff }
  | { type: 'SET_PLAYBACK_POSITION'; payload: number }
  
  // Routing actions
  | { type: 'TOGGLE_ROUTING'; payload: boolean }
  | { type: 'SET_ROUTING_CONTEXT'; payload: RoutingContext }
  | { type: 'SET_ROUTING_SIGNALS'; payload: RoutingSignal[] }
  | { type: 'ADD_SUGGESTION'; payload: RoutingSuggestion }
  | { type: 'CLEAR_SUGGESTIONS' }
  | { type: 'SET_OUTPUT_MODE'; payload: RoutingOutputMode }
  | { type: 'SET_CONFIDENCE_THRESHOLD'; payload: number }
  | { type: 'MUTE_ROUTING_SESSION'; payload: boolean }
  | { type: 'TOGGLE_AUDIT_TRAIL'; payload: boolean }
  | { type: 'TOGGLE_EXPLANATIONS'; payload: boolean }
  
  // UI actions
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET' };

// ============================================================
// INITIAL STATE
// ============================================================

const initialState: XRComparisonRoutingState = {
  active_comparison: null,
  control_state: DEFAULT_CONTROL_STATE,
  routing: DEFAULT_ROUTING,
  user_controls: DEFAULT_USER_CONTROLS,
  routing_agents: ROUTING_AGENTS,
  is_loading: false,
  error: null,
};

// ============================================================
// REDUCER
// ============================================================

function reducer(state: XRComparisonRoutingState, action: Action): XRComparisonRoutingState {
  switch (action.type) {
    // Comparison actions
    case 'CREATE_COMPARISON': {
      const { mode, source1, source2, createdBy } = action.payload;
      const comparison = createComparison(mode, source1, source2, createdBy);
      return {
        ...state,
        active_comparison: comparison,
        control_state: DEFAULT_CONTROL_STATE,
      };
    }
    
    case 'CLOSE_COMPARISON':
      return {
        ...state,
        active_comparison: null,
        control_state: DEFAULT_CONTROL_STATE,
      };
    
    case 'SET_SYNC_ANCHOR':
      if (!state.active_comparison) return state;
      return {
        ...state,
        active_comparison: {
          ...state.active_comparison,
          sync_anchor: action.payload,
        },
      };
    
    case 'TOGGLE_LAYER':
      if (!state.active_comparison) return state;
      return {
        ...state,
        active_comparison: {
          ...state.active_comparison,
          layers: {
            ...state.active_comparison.layers,
            [action.payload]: !state.active_comparison.layers[action.payload],
          },
        },
      };
    
    case 'SET_CONTROL':
      return {
        ...state,
        control_state: {
          ...state.control_state,
          ...action.payload,
        },
      };
    
    case 'ADD_COMPARISON_EVENT':
      if (!state.active_comparison) return state;
      return {
        ...state,
        active_comparison: {
          ...state.active_comparison,
          events: [...state.active_comparison.events, action.payload],
        },
      };
    
    case 'ADD_ARTIFACT_DIFF':
      if (!state.active_comparison) return state;
      return {
        ...state,
        active_comparison: {
          ...state.active_comparison,
          artifact_diffs: [...state.active_comparison.artifact_diffs, action.payload],
        },
      };
    
    case 'SET_PLAYBACK_POSITION':
      return {
        ...state,
        control_state: {
          ...state.control_state,
          playback_position: Math.max(0, Math.min(1, action.payload)),
        },
      };
    
    // Routing actions
    case 'TOGGLE_ROUTING':
      return {
        ...state,
        routing: { ...state.routing, enabled: action.payload },
        user_controls: { ...state.user_controls, routing_enabled: action.payload },
      };
    
    case 'SET_ROUTING_CONTEXT':
      return {
        ...state,
        routing: { ...state.routing, context: action.payload },
      };
    
    case 'SET_ROUTING_SIGNALS':
      return {
        ...state,
        routing: { ...state.routing, signals: action.payload },
      };
    
    case 'ADD_SUGGESTION':
      return {
        ...state,
        routing: {
          ...state.routing,
          suggestions: [...state.routing.suggestions, action.payload],
        },
      };
    
    case 'CLEAR_SUGGESTIONS':
      return {
        ...state,
        routing: { ...state.routing, suggestions: [] },
      };
    
    case 'SET_OUTPUT_MODE':
      return {
        ...state,
        routing: { ...state.routing, output_mode: action.payload },
      };
    
    case 'SET_CONFIDENCE_THRESHOLD':
      return {
        ...state,
        routing: { ...state.routing, confidence_threshold: action.payload },
        user_controls: { ...state.user_controls, confidence_threshold: action.payload },
      };
    
    case 'MUTE_ROUTING_SESSION':
      return {
        ...state,
        user_controls: { ...state.user_controls, muted_this_session: action.payload },
      };
    
    case 'TOGGLE_AUDIT_TRAIL':
      return {
        ...state,
        user_controls: { ...state.user_controls, audit_trail_visible: action.payload },
      };
    
    case 'TOGGLE_EXPLANATIONS':
      return {
        ...state,
        user_controls: { ...state.user_controls, explanations_visible: action.payload },
      };
    
    // UI actions
    case 'SET_LOADING':
      return { ...state, is_loading: action.payload };
    
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

interface ContextValue {
  state: XRComparisonRoutingState;
  
  // Comparison
  createComparison: (mode: ComparisonMode, source1: ComparisonSource, source2: ComparisonSource) => void;
  closeComparison: () => void;
  setSyncAnchor: (anchor: XRComparison['sync_anchor']) => void;
  toggleLayer: (layer: keyof ComparisonLayers) => void;
  setControl: (control: Partial<ComparisonControlState>) => void;
  setPlaybackPosition: (position: number) => void;
  
  // Routing
  toggleRouting: (enabled: boolean) => void;
  setRoutingContext: (context: RoutingContext) => void;
  addSuggestion: (target: string, title: string, type: RoutingSuggestion['target_type'], reason: RoutingSuggestion['reason'], confidence: number) => void;
  clearSuggestions: () => void;
  setOutputMode: (mode: RoutingOutputMode) => void;
  setConfidenceThreshold: (threshold: number) => void;
  muteRoutingSession: (muted: boolean) => void;
  
  // Queries
  getFilteredSuggestions: () => RoutingSuggestion[];
  
  // Reset
  reset: () => void;
}

const Context = createContext<ContextValue | null>(null);

// ============================================================
// PROVIDER
// ============================================================

export function XRComparisonRoutingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  const createComparisonFn = useCallback((mode: ComparisonMode, source1: ComparisonSource, source2: ComparisonSource) => {
    dispatch({ type: 'CREATE_COMPARISON', payload: { mode, source1, source2, createdBy: 'current_user' } });
  }, []);
  
  const closeComparisonFn = useCallback(() => {
    dispatch({ type: 'CLOSE_COMPARISON' });
  }, []);
  
  const setSyncAnchorFn = useCallback((anchor: XRComparison['sync_anchor']) => {
    dispatch({ type: 'SET_SYNC_ANCHOR', payload: anchor });
  }, []);
  
  const toggleLayerFn = useCallback((layer: keyof ComparisonLayers) => {
    dispatch({ type: 'TOGGLE_LAYER', payload: layer });
  }, []);
  
  const setControlFn = useCallback((control: Partial<ComparisonControlState>) => {
    dispatch({ type: 'SET_CONTROL', payload: control });
  }, []);
  
  const setPlaybackPositionFn = useCallback((position: number) => {
    dispatch({ type: 'SET_PLAYBACK_POSITION', payload: position });
  }, []);
  
  const toggleRoutingFn = useCallback((enabled: boolean) => {
    dispatch({ type: 'TOGGLE_ROUTING', payload: enabled });
  }, []);
  
  const setRoutingContextFn = useCallback((context: RoutingContext) => {
    dispatch({ type: 'SET_ROUTING_CONTEXT', payload: context });
  }, []);
  
  const addSuggestionFn = useCallback((
    target: string,
    title: string,
    type: RoutingSuggestion['target_type'],
    reason: RoutingSuggestion['reason'],
    confidence: number
  ) => {
    const suggestion = createRoutingSuggestion(target, title, type, reason, confidence, state.routing.signals);
    dispatch({ type: 'ADD_SUGGESTION', payload: suggestion });
  }, [state.routing.signals]);
  
  const clearSuggestionsFn = useCallback(() => {
    dispatch({ type: 'CLEAR_SUGGESTIONS' });
  }, []);
  
  const setOutputModeFn = useCallback((mode: RoutingOutputMode) => {
    dispatch({ type: 'SET_OUTPUT_MODE', payload: mode });
  }, []);
  
  const setConfidenceThresholdFn = useCallback((threshold: number) => {
    dispatch({ type: 'SET_CONFIDENCE_THRESHOLD', payload: threshold });
  }, []);
  
  const muteRoutingSessionFn = useCallback((muted: boolean) => {
    dispatch({ type: 'MUTE_ROUTING_SESSION', payload: muted });
  }, []);
  
  const getFilteredSuggestionsFn = useCallback(() => {
    if (state.user_controls.muted_this_session) return [];
    return filterSuggestionsByConfidence(state.routing.suggestions, state.user_controls.confidence_threshold);
  }, [state.routing.suggestions, state.user_controls]);
  
  const resetFn = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);
  
  const value: ContextValue = {
    state,
    createComparison: createComparisonFn,
    closeComparison: closeComparisonFn,
    setSyncAnchor: setSyncAnchorFn,
    toggleLayer: toggleLayerFn,
    setControl: setControlFn,
    setPlaybackPosition: setPlaybackPositionFn,
    toggleRouting: toggleRoutingFn,
    setRoutingContext: setRoutingContextFn,
    addSuggestion: addSuggestionFn,
    clearSuggestions: clearSuggestionsFn,
    setOutputMode: setOutputModeFn,
    setConfidenceThreshold: setConfidenceThresholdFn,
    muteRoutingSession: muteRoutingSessionFn,
    getFilteredSuggestions: getFilteredSuggestionsFn,
    reset: resetFn,
  };
  
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useXRComparisonRouting(): ContextValue {
  const context = useContext(Context);
  if (!context) {
    throw new Error('useXRComparisonRouting must be used within XRComparisonRoutingProvider');
  }
  return context;
}

export { Context as XRComparisonRoutingContext };
