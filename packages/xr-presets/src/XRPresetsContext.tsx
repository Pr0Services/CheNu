/**
 * CHE·NU — XR PRESETS PACK
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
  XRPreset,
  XRPresetId,
  UniversalXRRules,
  XRRuntimeState,
  PresetSelectionCriteria,
  NavigationMode,
} from './types';

import {
  ALL_PRESETS,
  PRESET_LIST,
  UNIVERSAL_XR_RULES,
  createPresetBundle,
} from './presets';

// ============================================================
// STATE
// ============================================================

interface XRPresetsState {
  // Current preset
  currentPreset: XRPresetId | null;
  presetData: XRPreset | null;
  
  // Runtime
  runtime: XRRuntimeState;
  
  // Settings
  navigationMode: NavigationMode;
  safetyEnabled: boolean;
  
  // History
  presetHistory: XRPresetId[];
  
  // Loading
  isLoading: boolean;
  loadProgress: number;
  
  // Error
  error: string | null;
}

// ============================================================
// ACTIONS
// ============================================================

type XRPresetsAction =
  | { type: 'SET_PRESET'; payload: XRPresetId }
  | { type: 'CLEAR_PRESET' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_LOAD_PROGRESS'; payload: number }
  | { type: 'SET_TRANSITIONING'; payload: boolean }
  | { type: 'SET_TRANSITION_PROGRESS'; payload: number }
  | { type: 'SET_NAVIGATION_MODE'; payload: NavigationMode }
  | { type: 'TOGGLE_SAFETY'; payload: boolean }
  | { type: 'UPDATE_USER_POSITION'; payload: { x: number; y: number; z: number } }
  | { type: 'ADD_LOADED_ASSET'; payload: string }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET' };

// ============================================================
// INITIAL STATE
// ============================================================

const initialRuntime: XRRuntimeState = {
  current_preset: null,
  transitioning: false,
  transition_progress: 0,
  loaded_assets: [],
  active_sounds: [],
  user_position: { x: 0, y: 0, z: 0 },
  user_rotation: { x: 0, y: 0, z: 0 },
};

const initialState: XRPresetsState = {
  currentPreset: null,
  presetData: null,
  runtime: initialRuntime,
  navigationMode: 'teleport_step',
  safetyEnabled: true,
  presetHistory: [],
  isLoading: false,
  loadProgress: 0,
  error: null,
};

// ============================================================
// REDUCER
// ============================================================

function xrPresetsReducer(
  state: XRPresetsState,
  action: XRPresetsAction
): XRPresetsState {
  switch (action.type) {
    case 'SET_PRESET':
      return {
        ...state,
        currentPreset: action.payload,
        presetData: ALL_PRESETS[action.payload],
        runtime: {
          ...state.runtime,
          current_preset: action.payload,
        },
        presetHistory: [action.payload, ...state.presetHistory.slice(0, 9)],
        error: null,
      };
    
    case 'CLEAR_PRESET':
      return {
        ...state,
        currentPreset: null,
        presetData: null,
        runtime: {
          ...initialRuntime,
        },
      };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_LOAD_PROGRESS':
      return { ...state, loadProgress: action.payload };
    
    case 'SET_TRANSITIONING':
      return {
        ...state,
        runtime: {
          ...state.runtime,
          transitioning: action.payload,
        },
      };
    
    case 'SET_TRANSITION_PROGRESS':
      return {
        ...state,
        runtime: {
          ...state.runtime,
          transition_progress: action.payload,
        },
      };
    
    case 'SET_NAVIGATION_MODE':
      return { ...state, navigationMode: action.payload };
    
    case 'TOGGLE_SAFETY':
      return { ...state, safetyEnabled: action.payload };
    
    case 'UPDATE_USER_POSITION':
      return {
        ...state,
        runtime: {
          ...state.runtime,
          user_position: action.payload,
        },
      };
    
    case 'ADD_LOADED_ASSET':
      return {
        ...state,
        runtime: {
          ...state.runtime,
          loaded_assets: [...state.runtime.loaded_assets, action.payload],
        },
      };
    
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

interface XRPresetsContextValue {
  state: XRPresetsState;
  
  // Preset operations
  loadPreset: (id: XRPresetId) => Promise<void>;
  unloadPreset: () => void;
  transitionTo: (id: XRPresetId) => Promise<void>;
  
  // Navigation
  setNavigationMode: (mode: NavigationMode) => void;
  toggleSafety: (enabled: boolean) => void;
  
  // Queries
  getPreset: (id: XRPresetId) => XRPreset;
  getAllPresets: () => XRPreset[];
  getUniversalRules: () => UniversalXRRules;
  
  // Selection helpers
  recommendPreset: (criteria: PresetSelectionCriteria) => XRPresetId;
  
  // Export
  exportBundle: () => string;
  
  // Reset
  reset: () => void;
}

const XRPresetsContext = createContext<XRPresetsContextValue | null>(null);

// ============================================================
// PROVIDER
// ============================================================

interface XRPresetsProviderProps {
  children: ReactNode;
}

export function XRPresetsProvider({ children }: XRPresetsProviderProps) {
  const [state, dispatch] = useReducer(xrPresetsReducer, initialState);
  
  // Load preset with simulated asset loading
  const loadPreset = useCallback(async (id: XRPresetId) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_LOAD_PROGRESS', payload: 0 });
    
    try {
      const preset = ALL_PRESETS[id];
      if (!preset) {
        throw new Error(`Preset ${id} not found`);
      }
      
      // Simulate asset loading
      const totalAssets = preset.decor.length + 3; // decor + lighting + sky + floor
      let loaded = 0;
      
      for (const decor of preset.decor) {
        await new Promise(resolve => setTimeout(resolve, 100));
        loaded++;
        dispatch({ type: 'SET_LOAD_PROGRESS', payload: (loaded / totalAssets) * 100 });
        dispatch({ type: 'ADD_LOADED_ASSET', payload: decor.id });
      }
      
      // Load core assets
      for (const asset of ['lighting', 'sky', 'floor']) {
        await new Promise(resolve => setTimeout(resolve, 50));
        loaded++;
        dispatch({ type: 'SET_LOAD_PROGRESS', payload: (loaded / totalAssets) * 100 });
        dispatch({ type: 'ADD_LOADED_ASSET', payload: asset });
      }
      
      dispatch({ type: 'SET_PRESET', payload: id });
      dispatch({ type: 'SET_LOAD_PROGRESS', payload: 100 });
      
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: String(error) });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);
  
  // Unload preset
  const unloadPreset = useCallback(() => {
    dispatch({ type: 'CLEAR_PRESET' });
  }, []);
  
  // Transition to preset with animation
  const transitionTo = useCallback(async (id: XRPresetId) => {
    const rules = UNIVERSAL_XR_RULES;
    
    dispatch({ type: 'SET_TRANSITIONING', payload: true });
    dispatch({ type: 'SET_TRANSITION_PROGRESS', payload: 0 });
    
    // Simulate transition animation
    const duration = rules.transition.duration_ms;
    const steps = 20;
    const stepDuration = duration / steps;
    
    for (let i = 0; i <= steps; i++) {
      await new Promise(resolve => setTimeout(resolve, stepDuration));
      dispatch({ type: 'SET_TRANSITION_PROGRESS', payload: (i / steps) * 100 });
    }
    
    dispatch({ type: 'SET_TRANSITIONING', payload: false });
    dispatch({ type: 'SET_TRANSITION_PROGRESS', payload: 0 });
    
    await loadPreset(id);
  }, [loadPreset]);
  
  // Navigation mode
  const setNavigationMode = useCallback((mode: NavigationMode) => {
    dispatch({ type: 'SET_NAVIGATION_MODE', payload: mode });
  }, []);
  
  // Safety toggle
  const toggleSafety = useCallback((enabled: boolean) => {
    dispatch({ type: 'TOGGLE_SAFETY', payload: enabled });
  }, []);
  
  // Get preset
  const getPreset = useCallback((id: XRPresetId) => {
    return ALL_PRESETS[id];
  }, []);
  
  // Get all presets
  const getAllPresets = useCallback(() => {
    return PRESET_LIST;
  }, []);
  
  // Get universal rules
  const getUniversalRules = useCallback(() => {
    return UNIVERSAL_XR_RULES;
  }, []);
  
  // Recommend preset based on criteria
  const recommendPreset = useCallback((criteria: PresetSelectionCriteria): XRPresetId => {
    const { mood, task, duration, accessibility_priority } = criteria;
    
    // Simple recommendation logic
    if (accessibility_priority) {
      return 'xr_classic'; // Most accessible
    }
    
    if (task === 'construction') {
      return 'xr_builder';
    }
    
    if (task === 'analysis') {
      return 'xr_sanctum';
    }
    
    if (task === 'meditation' || mood === 'calm') {
      return 'xr_classic';
    }
    
    if (mood === 'expansive' || task === 'collaboration') {
      return 'xr_cosmic';
    }
    
    if (mood === 'creative') {
      return 'xr_jungle';
    }
    
    if (mood === 'analytical' || mood === 'focused') {
      return 'xr_sanctum';
    }
    
    // Default
    return 'xr_classic';
  }, []);
  
  // Export bundle
  const exportBundle = useCallback(() => {
    const bundle = createPresetBundle();
    return JSON.stringify(bundle, null, 2);
  }, []);
  
  // Reset
  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);
  
  const value: XRPresetsContextValue = {
    state,
    loadPreset,
    unloadPreset,
    transitionTo,
    setNavigationMode,
    toggleSafety,
    getPreset,
    getAllPresets,
    getUniversalRules,
    recommendPreset,
    exportBundle,
    reset,
  };
  
  return (
    <XRPresetsContext.Provider value={value}>
      {children}
    </XRPresetsContext.Provider>
  );
}

// ============================================================
// HOOK
// ============================================================

export function useXRPresets(): XRPresetsContextValue {
  const context = useContext(XRPresetsContext);
  if (!context) {
    throw new Error('useXRPresets must be used within XRPresetsProvider');
  }
  return context;
}

// ============================================================
// EXPORTS
// ============================================================

export { XRPresetsContext };
export type { XRPresetsState, XRPresetsContextValue };
