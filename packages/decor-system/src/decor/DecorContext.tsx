/**
 * CHE·NU — AMBIENT DECOR SYSTEM
 * DecorContext - React Context Provider
 * 
 * Manages global decor state with user control and safety guarantees.
 */

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';

import {
  DecorType,
  DecorState,
  DecorConfig,
  DeviceCapability,
  DECOR_DEFINITIONS,
  SPHERE_DECOR_MAP,
  DECOR_RULES,
  detectDeviceCapability,
  scaleConfigForDevice,
  resolveThemeConflict,
} from './types';

// ============================================================
// STATE INTERFACE
// ============================================================

interface DecorContextState {
  // Current state
  currentDecor: DecorType;
  currentConfig: DecorConfig;
  state: DecorState;
  
  // Device
  deviceCapability: DeviceCapability;
  
  // User preferences
  enabled: boolean;
  lockedToDefault: boolean;
  spherePreferences: Record<string, DecorType>;
  
  // Transitions
  isTransitioning: boolean;
  previousDecor: DecorType | null;
  transitionProgress: number; // 0-1
  
  // Performance
  currentFps: number;
  performanceMode: 'full' | 'reduced' | 'minimal';
  
  // Conflict
  hasThemeConflict: boolean;
  conflictResolutionApplied: boolean;
}

// ============================================================
// ACTIONS
// ============================================================

type DecorAction =
  | { type: 'SET_DECOR'; payload: DecorType }
  | { type: 'SET_SPHERE'; payload: string }
  | { type: 'ENABLE' }
  | { type: 'DISABLE' }
  | { type: 'LOCK_DEFAULT' }
  | { type: 'UNLOCK' }
  | { type: 'SET_SPHERE_PREFERENCE'; payload: { sphere: string; decor: DecorType } }
  | { type: 'RESET_PREFERENCES' }
  | { type: 'START_TRANSITION'; payload: DecorType }
  | { type: 'UPDATE_TRANSITION'; payload: number }
  | { type: 'END_TRANSITION' }
  | { type: 'UPDATE_FPS'; payload: number }
  | { type: 'SET_THEME_CONFLICT'; payload: boolean }
  | { type: 'SET_DEVICE_CAPABILITY'; payload: DeviceCapability };

// ============================================================
// INITIAL STATE
// ============================================================

const initialState: DecorContextState = {
  currentDecor: 'neutral',
  currentConfig: DECOR_DEFINITIONS.neutral.defaultConfig,
  state: 'active',
  deviceCapability: 'standard',
  enabled: true,
  lockedToDefault: false,
  spherePreferences: {},
  isTransitioning: false,
  previousDecor: null,
  transitionProgress: 0,
  currentFps: 60,
  performanceMode: 'full',
  hasThemeConflict: false,
  conflictResolutionApplied: false,
};

// ============================================================
// REDUCER
// ============================================================

function decorReducer(
  state: DecorContextState,
  action: DecorAction
): DecorContextState {
  switch (action.type) {
    case 'SET_DECOR': {
      if (state.lockedToDefault) {
        return state; // Ignore if locked
      }
      const newDecor = action.payload;
      const baseConfig = DECOR_DEFINITIONS[newDecor].defaultConfig;
      const scaledConfig = scaleConfigForDevice(baseConfig, state.deviceCapability);
      
      return {
        ...state,
        currentDecor: newDecor,
        currentConfig: state.hasThemeConflict
          ? resolveThemeConflict(scaledConfig, 0.8)
          : scaledConfig,
      };
    }
    
    case 'SET_SPHERE': {
      if (state.lockedToDefault || !state.enabled) {
        return state;
      }
      
      const sphere = action.payload;
      // Check user preference first
      const preferredDecor = state.spherePreferences[sphere];
      // Fall back to mapping
      const mappedDecor = SPHERE_DECOR_MAP[sphere] || SPHERE_DECOR_MAP.default;
      const newDecor = preferredDecor || mappedDecor;
      
      if (newDecor === state.currentDecor) {
        return state; // No change needed
      }
      
      const baseConfig = DECOR_DEFINITIONS[newDecor].defaultConfig;
      const scaledConfig = scaleConfigForDevice(baseConfig, state.deviceCapability);
      
      return {
        ...state,
        currentDecor: newDecor,
        currentConfig: state.hasThemeConflict
          ? resolveThemeConflict(scaledConfig, 0.8)
          : scaledConfig,
      };
    }
    
    case 'ENABLE':
      return {
        ...state,
        enabled: true,
        state: 'active',
      };
    
    case 'DISABLE':
      return {
        ...state,
        enabled: false,
        state: 'disabled',
      };
    
    case 'LOCK_DEFAULT':
      return {
        ...state,
        lockedToDefault: true,
        currentDecor: 'neutral',
        currentConfig: scaleConfigForDevice(
          DECOR_DEFINITIONS.neutral.defaultConfig,
          state.deviceCapability
        ),
      };
    
    case 'UNLOCK':
      return {
        ...state,
        lockedToDefault: false,
      };
    
    case 'SET_SPHERE_PREFERENCE':
      return {
        ...state,
        spherePreferences: {
          ...state.spherePreferences,
          [action.payload.sphere]: action.payload.decor,
        },
      };
    
    case 'RESET_PREFERENCES':
      return {
        ...state,
        spherePreferences: {},
        lockedToDefault: false,
        currentDecor: 'neutral',
        currentConfig: scaleConfigForDevice(
          DECOR_DEFINITIONS.neutral.defaultConfig,
          state.deviceCapability
        ),
      };
    
    case 'START_TRANSITION':
      return {
        ...state,
        isTransitioning: true,
        previousDecor: state.currentDecor,
        transitionProgress: 0,
        state: 'transitioning',
      };
    
    case 'UPDATE_TRANSITION':
      return {
        ...state,
        transitionProgress: Math.min(1, action.payload),
      };
    
    case 'END_TRANSITION':
      return {
        ...state,
        isTransitioning: false,
        previousDecor: null,
        transitionProgress: 0,
        state: state.enabled ? 'active' : 'disabled',
      };
    
    case 'UPDATE_FPS': {
      const fps = action.payload;
      let performanceMode: 'full' | 'reduced' | 'minimal' = 'full';
      let newConfig = state.currentConfig;
      
      if (fps < DECOR_RULES.FPS_THRESHOLD_DISABLE) {
        performanceMode = 'minimal';
        newConfig = {
          ...newConfig,
          animation: { enabled: false, speed: 'ultra-slow', type: 'none' },
        };
      } else if (fps < DECOR_RULES.FPS_THRESHOLD_REDUCE) {
        performanceMode = 'reduced';
        newConfig = {
          ...newConfig,
          animation: { ...newConfig.animation, speed: 'slow' },
        };
      }
      
      return {
        ...state,
        currentFps: fps,
        performanceMode,
        currentConfig: newConfig,
      };
    }
    
    case 'SET_THEME_CONFLICT': {
      const hasConflict = action.payload;
      if (hasConflict === state.hasThemeConflict) {
        return state;
      }
      
      return {
        ...state,
        hasThemeConflict: hasConflict,
        conflictResolutionApplied: hasConflict,
        currentConfig: hasConflict
          ? resolveThemeConflict(state.currentConfig, 0.8)
          : scaleConfigForDevice(
              DECOR_DEFINITIONS[state.currentDecor].defaultConfig,
              state.deviceCapability
            ),
      };
    }
    
    case 'SET_DEVICE_CAPABILITY':
      return {
        ...state,
        deviceCapability: action.payload,
        currentConfig: scaleConfigForDevice(
          DECOR_DEFINITIONS[state.currentDecor].defaultConfig,
          action.payload
        ),
      };
    
    default:
      return state;
  }
}

// ============================================================
// CONTEXT
// ============================================================

interface DecorContextValue {
  state: DecorContextState;
  
  // Actions
  setDecor: (decor: DecorType) => void;
  setSphere: (sphere: string) => void;
  enable: () => void;
  disable: () => void;
  lockToDefault: () => void;
  unlock: () => void;
  setSpherePreference: (sphere: string, decor: DecorType) => void;
  resetPreferences: () => void;
  
  // Getters
  getDecorForSphere: (sphere: string) => DecorType;
  getConfig: () => DecorConfig;
  isEnabled: () => boolean;
}

const DecorContext = createContext<DecorContextValue | null>(null);

// ============================================================
// PROVIDER
// ============================================================

interface DecorProviderProps {
  children: ReactNode;
  initialDecor?: DecorType;
  defaultEnabled?: boolean;
}

export function DecorProvider({
  children,
  initialDecor = 'neutral',
  defaultEnabled = true,
}: DecorProviderProps) {
  const [state, dispatch] = useReducer(decorReducer, {
    ...initialState,
    currentDecor: initialDecor,
    currentConfig: DECOR_DEFINITIONS[initialDecor].defaultConfig,
    enabled: defaultEnabled,
  });
  
  // Detect device capability on mount
  useEffect(() => {
    const capability = detectDeviceCapability();
    dispatch({ type: 'SET_DEVICE_CAPABILITY', payload: capability });
  }, []);
  
  // Load saved preferences from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('chenu-decor-preferences');
      if (saved) {
        const prefs = JSON.parse(saved);
        if (prefs.spherePreferences) {
          Object.entries(prefs.spherePreferences).forEach(([sphere, decor]) => {
            dispatch({
              type: 'SET_SPHERE_PREFERENCE',
              payload: { sphere, decor: decor as DecorType },
            });
          });
        }
        if (prefs.enabled === false) {
          dispatch({ type: 'DISABLE' });
        }
        if (prefs.lockedToDefault) {
          dispatch({ type: 'LOCK_DEFAULT' });
        }
      }
    } catch (e) {
      // Ignore localStorage errors
    }
  }, []);
  
  // Save preferences to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('chenu-decor-preferences', JSON.stringify({
        spherePreferences: state.spherePreferences,
        enabled: state.enabled,
        lockedToDefault: state.lockedToDefault,
      }));
    } catch (e) {
      // Ignore localStorage errors
    }
  }, [state.spherePreferences, state.enabled, state.lockedToDefault]);
  
  // Actions
  const setDecor = useCallback((decor: DecorType) => {
    dispatch({ type: 'SET_DECOR', payload: decor });
  }, []);
  
  const setSphere = useCallback((sphere: string) => {
    dispatch({ type: 'SET_SPHERE', payload: sphere });
  }, []);
  
  const enable = useCallback(() => {
    dispatch({ type: 'ENABLE' });
  }, []);
  
  const disable = useCallback(() => {
    dispatch({ type: 'DISABLE' });
  }, []);
  
  const lockToDefault = useCallback(() => {
    dispatch({ type: 'LOCK_DEFAULT' });
  }, []);
  
  const unlock = useCallback(() => {
    dispatch({ type: 'UNLOCK' });
  }, []);
  
  const setSpherePreference = useCallback((sphere: string, decor: DecorType) => {
    dispatch({ type: 'SET_SPHERE_PREFERENCE', payload: { sphere, decor } });
  }, []);
  
  const resetPreferences = useCallback(() => {
    dispatch({ type: 'RESET_PREFERENCES' });
  }, []);
  
  // Getters
  const getDecorForSphere = useCallback((sphere: string): DecorType => {
    if (state.lockedToDefault) return 'neutral';
    return state.spherePreferences[sphere] 
      || SPHERE_DECOR_MAP[sphere] 
      || 'neutral';
  }, [state.lockedToDefault, state.spherePreferences]);
  
  const getConfig = useCallback((): DecorConfig => {
    return state.currentConfig;
  }, [state.currentConfig]);
  
  const isEnabled = useCallback((): boolean => {
    return state.enabled;
  }, [state.enabled]);
  
  const value: DecorContextValue = {
    state,
    setDecor,
    setSphere,
    enable,
    disable,
    lockToDefault,
    unlock,
    setSpherePreference,
    resetPreferences,
    getDecorForSphere,
    getConfig,
    isEnabled,
  };
  
  return (
    <DecorContext.Provider value={value}>
      {children}
    </DecorContext.Provider>
  );
}

// ============================================================
// HOOK
// ============================================================

export function useDecor(): DecorContextValue {
  const context = useContext(DecorContext);
  if (!context) {
    throw new Error('useDecor must be used within a DecorProvider');
  }
  return context;
}

// ============================================================
// EXPORTS
// ============================================================

export { DecorContext };
export type { DecorContextState, DecorContextValue };
