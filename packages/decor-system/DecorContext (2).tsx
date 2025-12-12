/**
 * CHE·NU — AMBIENT DECOR SYSTEM
 * ==============================
 * React Context Provider
 * 
 * Manages decor state with strict behavior rules enforcement.
 * Decor is a PASSIVE AMBIENT LAYER - never blocks interaction.
 */

import React, { 
  createContext, 
  useContext, 
  useReducer, 
  useCallback, 
  useEffect,
  ReactNode 
} from 'react';

import {
  DecorType,
  DecorConfig,
  DecorState,
  DecorActions,
  DecorContextType,
  SphereType,
  PerformanceLevel,
  DEFAULT_DECOR_CONFIG,
  DECOR_METADATA,
  DECOR_BEHAVIOR_RULES,
} from './types';

// ============================================================
// REDUCER
// ============================================================

type DecorAction =
  | { type: 'SET_DECOR_TYPE'; payload: DecorType }
  | { type: 'SET_ENABLED'; payload: boolean }
  | { type: 'SET_PERFORMANCE'; payload: PerformanceLevel }
  | { type: 'SET_SPHERE_PREFERENCE'; payload: { sphere: SphereType; decor: DecorType } }
  | { type: 'RESET_TO_DEFAULTS' }
  | { type: 'SPHERE_CHANGE'; payload: SphereType }
  | { type: 'INPUT_START' }
  | { type: 'INPUT_END' }
  | { type: 'TRANSITION_START' }
  | { type: 'TRANSITION_END' }
  | { type: 'THEME_CONFLICT'; payload: boolean };

const initialState: DecorState = {
  config: DEFAULT_DECOR_CONFIG,
  currentSphere: null,
  isTransitioning: false,
  isInputActive: false,
  themeConflict: false,
};

function decorReducer(state: DecorState, action: DecorAction): DecorState {
  switch (action.type) {
    case 'SET_DECOR_TYPE':
      // Rule: Decor NEVER changes during active input
      if (state.isInputActive && DECOR_BEHAVIOR_RULES.changeDuringInput === false) {
        console.warn('[Decor] Change blocked: input is active');
        return state;
      }
      return {
        ...state,
        config: { ...state.config, type: action.payload },
      };

    case 'SET_ENABLED':
      return {
        ...state,
        config: { ...state.config, enabled: action.payload },
      };

    case 'SET_PERFORMANCE':
      return {
        ...state,
        config: { ...state.config, performance: action.payload },
      };

    case 'SET_SPHERE_PREFERENCE':
      return {
        ...state,
        config: {
          ...state.config,
          spherePreferences: {
            ...state.config.spherePreferences,
            [action.payload.sphere]: action.payload.decor,
          },
        },
      };

    case 'RESET_TO_DEFAULTS':
      return {
        ...state,
        config: DEFAULT_DECOR_CONFIG,
        themeConflict: false,
      };

    case 'SPHERE_CHANGE':
      // Rule: Decor NEVER changes during active input
      if (state.isInputActive) {
        return { ...state, currentSphere: action.payload };
      }
      
      // Determine decor type for sphere
      const spherePreference = state.config.spherePreferences[action.payload];
      const defaultDecor = getDefaultDecorForSphere(action.payload);
      const newDecor = spherePreference || defaultDecor;
      
      return {
        ...state,
        currentSphere: action.payload,
        config: { ...state.config, type: newDecor },
        isTransitioning: true,
      };

    case 'INPUT_START':
      return { ...state, isInputActive: true };

    case 'INPUT_END':
      return { ...state, isInputActive: false };

    case 'TRANSITION_START':
      return { ...state, isTransitioning: true };

    case 'TRANSITION_END':
      return { ...state, isTransitioning: false };

    case 'THEME_CONFLICT':
      return { 
        ...state, 
        themeConflict: action.payload,
        // Fallback to neutral on conflict
        config: action.payload 
          ? { ...state.config, type: 'neutral' }
          : state.config,
      };

    default:
      return state;
  }
}

// ============================================================
// HELPERS
// ============================================================

function getDefaultDecorForSphere(sphere: SphereType): DecorType {
  for (const [decorType, metadata] of Object.entries(DECOR_METADATA)) {
    if (metadata.defaultSpheres.includes(sphere)) {
      return decorType as DecorType;
    }
  }
  return 'neutral'; // Default fallback
}

// ============================================================
// CONTEXT
// ============================================================

const DecorContext = createContext<DecorContextType | null>(null);

interface DecorProviderProps {
  children: ReactNode;
  initialConfig?: Partial<DecorConfig>;
}

export function DecorProvider({ children, initialConfig }: DecorProviderProps) {
  const [state, dispatch] = useReducer(decorReducer, {
    ...initialState,
    config: { ...DEFAULT_DECOR_CONFIG, ...initialConfig },
  });

  // ============================================================
  // ACTIONS
  // ============================================================

  const setDecorType = useCallback((type: DecorType) => {
    dispatch({ type: 'SET_DECOR_TYPE', payload: type });
  }, []);

  const setEnabled = useCallback((enabled: boolean) => {
    dispatch({ type: 'SET_ENABLED', payload: enabled });
  }, []);

  const setPerformance = useCallback((level: PerformanceLevel) => {
    dispatch({ type: 'SET_PERFORMANCE', payload: level });
  }, []);

  const setSpherePreference = useCallback((sphere: SphereType, decor: DecorType) => {
    dispatch({ type: 'SET_SPHERE_PREFERENCE', payload: { sphere, decor } });
  }, []);

  const resetToDefaults = useCallback(() => {
    dispatch({ type: 'RESET_TO_DEFAULTS' });
  }, []);

  const notifySphereChange = useCallback((sphere: SphereType) => {
    dispatch({ type: 'SPHERE_CHANGE', payload: sphere });
  }, []);

  const notifyInputStart = useCallback(() => {
    dispatch({ type: 'INPUT_START' });
  }, []);

  const notifyInputEnd = useCallback(() => {
    dispatch({ type: 'INPUT_END' });
  }, []);

  // ============================================================
  // TRANSITION HANDLING
  // ============================================================

  useEffect(() => {
    if (state.isTransitioning) {
      const timer = setTimeout(() => {
        dispatch({ type: 'TRANSITION_END' });
      }, state.config.transitionDuration);
      
      return () => clearTimeout(timer);
    }
  }, [state.isTransitioning, state.config.transitionDuration]);

  // ============================================================
  // PERFORMANCE DETECTION
  // ============================================================

  useEffect(() => {
    // Auto-detect performance level
    const detectPerformance = (): PerformanceLevel => {
      // Check for reduced motion preference
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return 'minimal';
      }
      
      // Check device memory (if available)
      const nav = navigator as Navigator & { deviceMemory?: number };
      if (nav.deviceMemory && nav.deviceMemory < 4) {
        return 'low';
      }
      
      // Check for mobile
      if (window.matchMedia('(max-width: 768px)').matches) {
        return 'medium';
      }
      
      return 'high';
    };

    const detectedLevel = detectPerformance();
    if (detectedLevel !== state.config.performance) {
      dispatch({ type: 'SET_PERFORMANCE', payload: detectedLevel });
    }
  }, []);

  // ============================================================
  // CONTEXT VALUE
  // ============================================================

  const contextValue: DecorContextType = {
    ...state,
    setDecorType,
    setEnabled,
    setPerformance,
    setSpherePreference,
    resetToDefaults,
    notifySphereChange,
    notifyInputStart,
    notifyInputEnd,
  };

  return (
    <DecorContext.Provider value={contextValue}>
      {children}
    </DecorContext.Provider>
  );
}

// ============================================================
// HOOK
// ============================================================

export function useDecor(): DecorContextType {
  const context = useContext(DecorContext);
  if (!context) {
    throw new Error('useDecor must be used within a DecorProvider');
  }
  return context;
}

// ============================================================
// UTILITY HOOKS
// ============================================================

/**
 * Hook to get current decor metadata
 */
export function useDecorMetadata() {
  const { config } = useDecor();
  return DECOR_METADATA[config.type];
}

/**
 * Hook to check if decor change is allowed
 */
export function useCanChangeDecor(): boolean {
  const { isInputActive, isTransitioning } = useDecor();
  return !isInputActive && !isTransitioning;
}

/**
 * Hook to get performance-aware features
 */
export function useDecorFeatures() {
  const { config } = useDecor();
  
  const features = {
    high: { animations: true, gradients: true, blur: true, geometry3d: true },
    medium: { animations: true, gradients: true, blur: false, geometry3d: false },
    low: { animations: false, gradients: true, blur: false, geometry3d: false },
    minimal: { animations: false, gradients: false, blur: false, geometry3d: false },
  };
  
  return features[config.performance];
}
