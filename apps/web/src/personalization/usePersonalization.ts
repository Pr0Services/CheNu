/* =====================================================
   CHE·NU — usePersonalization Hook
   
   React hook for managing personalization state.
   ===================================================== */

import { useState, useEffect, useCallback, useMemo, useContext, createContext } from 'react';
import React from 'react';

import {
  CheNuPersonalization,
  SpherePersonalization,
  AgentPersonalization,
  DensityLevel,
  XRAmbiance,
  PersonalizationEvent,
} from './personalization.types';

import {
  loadOrCreatePersonalization,
  savePersonalizationDebounced,
  onPersonalizationChange,
} from './personalization.store';

import {
  reducePersonalization,
  getSpherePersonalization,
  getAgentPersonalization,
  getVisibleSpheres,
  getVisibleAgents,
  getFavoriteAgents,
} from './personalization.engine';

import { DENSITY_CONFIGS } from './personalization.defaults';

// ─────────────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────────────

interface PersonalizationContextValue {
  state: CheNuPersonalization;
  dispatch: (event: PersonalizationEvent) => void;
  
  // Helpers
  getTheme: (sphereId?: string) => string;
  getDensityConfig: () => typeof DENSITY_CONFIGS.balanced;
  isXREnabled: () => boolean;
}

const PersonalizationContext = createContext<PersonalizationContextValue | null>(null);

// ─────────────────────────────────────────────────────
// PROVIDER
// ─────────────────────────────────────────────────────

export interface PersonalizationProviderProps {
  children: React.ReactNode;
}

export function PersonalizationProvider({ children }: PersonalizationProviderProps) {
  const [state, setState] = useState<CheNuPersonalization>(() => 
    loadOrCreatePersonalization()
  );

  // Listen for changes from other tabs
  useEffect(() => {
    return onPersonalizationChange((newState) => {
      setState(newState);
    });
  }, []);

  // Dispatch with auto-save
  const dispatch = useCallback((event: PersonalizationEvent) => {
    setState(current => {
      const next = reducePersonalization(current, event);
      savePersonalizationDebounced(next);
      return next;
    });
  }, []);

  // Get effective theme
  const getTheme = useCallback((sphereId?: string): string => {
    if (sphereId) {
      const spherePref = getSpherePersonalization(state, sphereId);
      if (spherePref.themeOverride) {
        return spherePref.themeOverride;
      }
    }
    return state.themeGlobal;
  }, [state]);

  // Get density config
  const getDensityConfig = useCallback(() => {
    return DENSITY_CONFIGS[state.density];
  }, [state.density]);

  // Check XR enabled
  const isXREnabled = useCallback(() => {
    return state.xr.enabled;
  }, [state.xr.enabled]);

  const value: PersonalizationContextValue = {
    state,
    dispatch,
    getTheme,
    getDensityConfig,
    isXREnabled,
  };

  return (
    <PersonalizationContext.Provider value={value}>
      {children}
    </PersonalizationContext.Provider>
  );
}

// ─────────────────────────────────────────────────────
// MAIN HOOK
// ─────────────────────────────────────────────────────

export function usePersonalization() {
  const context = useContext(PersonalizationContext);
  
  if (!context) {
    throw new Error('usePersonalization must be used within PersonalizationProvider');
  }

  return context;
}

// ─────────────────────────────────────────────────────
// SPHERE HOOK
// ─────────────────────────────────────────────────────

export function useSpherePersonalization(sphereId: string) {
  const { state, dispatch } = usePersonalization();
  
  const pref = useMemo(
    () => getSpherePersonalization(state, sphereId),
    [state, sphereId]
  );

  const update = useCallback((updates: Partial<SpherePersonalization>) => {
    dispatch({ type: 'SPHERE_UPDATE', sphereId, updates });
  }, [dispatch, sphereId]);

  const toggleVisible = useCallback(() => {
    update({ visible: !pref.visible });
  }, [update, pref.visible]);

  const togglePinned = useCallback(() => {
    update({ pinned: !pref.pinned });
  }, [update, pref.pinned]);

  const setTheme = useCallback((themeId?: string) => {
    update({ themeOverride: themeId });
  }, [update]);

  return {
    ...pref,
    update,
    toggleVisible,
    togglePinned,
    setTheme,
  };
}

// ─────────────────────────────────────────────────────
// AGENT HOOK
// ─────────────────────────────────────────────────────

export function useAgentPersonalization(agentId: string) {
  const { state, dispatch } = usePersonalization();
  
  const pref = useMemo(
    () => getAgentPersonalization(state, agentId),
    [state, agentId]
  );

  const update = useCallback((updates: Partial<AgentPersonalization>) => {
    dispatch({ type: 'AGENT_UPDATE', agentId, updates });
  }, [dispatch, agentId]);

  const toggleVisible = useCallback(() => {
    update({ visible: !pref.visible });
  }, [update, pref.visible]);

  const toggleFavorite = useCallback(() => {
    update({ favorite: !pref.favorite });
  }, [update, pref.favorite]);

  return {
    ...pref,
    update,
    toggleVisible,
    toggleFavorite,
  };
}

// ─────────────────────────────────────────────────────
// THEME HOOK
// ─────────────────────────────────────────────────────

export function useThemePersonalization() {
  const { state, dispatch, getTheme } = usePersonalization();

  const setGlobalTheme = useCallback((themeId: string) => {
    dispatch({ type: 'THEME_CHANGE', themeId });
  }, [dispatch]);

  return {
    globalTheme: state.themeGlobal,
    getTheme,
    setGlobalTheme,
  };
}

// ─────────────────────────────────────────────────────
// DENSITY HOOK
// ─────────────────────────────────────────────────────

export function useDensityPersonalization() {
  const { state, dispatch, getDensityConfig } = usePersonalization();

  const setDensity = useCallback((density: DensityLevel) => {
    dispatch({ type: 'DENSITY_CHANGE', density });
  }, [dispatch]);

  return {
    density: state.density,
    config: getDensityConfig(),
    setDensity,
  };
}

// ─────────────────────────────────────────────────────
// XR HOOK
// ─────────────────────────────────────────────────────

export function useXRPersonalization() {
  const { state, dispatch } = usePersonalization();

  const update = useCallback((updates: Partial<typeof state.xr>) => {
    dispatch({ type: 'XR_UPDATE', updates });
  }, [dispatch]);

  const toggle = useCallback(() => {
    update({ enabled: !state.xr.enabled });
  }, [update, state.xr.enabled]);

  const setAmbiance = useCallback((ambiance: XRAmbiance) => {
    update({ ambiance });
  }, [update]);

  return {
    ...state.xr,
    update,
    toggle,
    setAmbiance,
  };
}

// ─────────────────────────────────────────────────────
// UI HOOK
// ─────────────────────────────────────────────────────

export function useUIPersonalization() {
  const { state, dispatch } = usePersonalization();

  const update = useCallback((updates: Partial<typeof state.ui>) => {
    dispatch({ type: 'UI_UPDATE', updates });
  }, [dispatch]);

  const toggleSidebar = useCallback(() => {
    update({ sidebarCollapsed: !state.ui.sidebarCollapsed });
  }, [update, state.ui.sidebarCollapsed]);

  return {
    ...state.ui,
    update,
    toggleSidebar,
  };
}

// ─────────────────────────────────────────────────────
// VISIBILITY HOOKS
// ─────────────────────────────────────────────────────

export function useVisibleSpheres(allSphereIds: string[]) {
  const { state } = usePersonalization();
  
  return useMemo(
    () => getVisibleSpheres(state, allSphereIds),
    [state, allSphereIds]
  );
}

export function useVisibleAgents(allAgentIds: string[]) {
  const { state } = usePersonalization();
  
  return useMemo(
    () => getVisibleAgents(state, allAgentIds),
    [state, allAgentIds]
  );
}

export function useFavoriteAgents() {
  const { state } = usePersonalization();
  
  return useMemo(
    () => getFavoriteAgents(state),
    [state]
  );
}

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default usePersonalization;
