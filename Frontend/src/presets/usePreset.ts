/* =====================================================
   CHE·NU — Preset React Hook
   
   React hook for managing presets with context-aware
   suggestions and automatic activation.
   ===================================================== */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  ReactNode,
} from 'react';

import {
  CheNuPreset,
  CheNuPersonalization,
  PresetState,
  PresetContext,
  PresetSuggestion,
  PresetEvent,
} from './preset.types';

import {
  DEFAULT_PRESET_STATE,
  createPreset,
  clonePreset,
  getPresetById,
} from './preset.defaults';

import {
  applyPreset,
  suggestPresets,
  reducePresetState,
  createDefaultContext,
  detectXRCapability,
  validatePreset,
} from './preset.engine';

// ─────────────────────────────────────────────────────
// STORAGE
// ─────────────────────────────────────────────────────

const STORAGE_KEY = 'che-nu.presets';

/**
 * Load preset state from localStorage.
 */
function loadPresetState(): PresetState {
  if (typeof localStorage === 'undefined') {
    return DEFAULT_PRESET_STATE;
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_PRESET_STATE;
    
    const parsed = JSON.parse(stored);
    
    // Merge with defaults to ensure new presets are included
    const systemPresets = DEFAULT_PRESET_STATE.presets.filter(p => p.isSystem);
    const customPresets = (parsed.presets || []).filter((p: CheNuPreset) => !p.isSystem);
    
    return {
      ...DEFAULT_PRESET_STATE,
      ...parsed,
      presets: [...systemPresets, ...customPresets],
    };
  } catch {
    return DEFAULT_PRESET_STATE;
  }
}

/**
 * Save preset state to localStorage.
 */
function savePresetState(state: PresetState): void {
  if (typeof localStorage === 'undefined') return;
  
  try {
    // Only save custom presets and user preferences
    const toSave = {
      presets: state.presets.filter(p => !p.isSystem),
      activePresetId: state.activePresetId,
      history: state.history.slice(0, 20), // Keep last 20
      autoSuggestEnabled: state.autoSuggestEnabled,
      favorites: state.favorites,
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (error) {
    console.warn('Failed to save preset state:', error);
  }
}

// ─────────────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────────────

interface PresetContextValue {
  // State
  state: PresetState;
  activePreset: CheNuPreset | null;
  suggestions: PresetSuggestion[];
  context: PresetContext;
  
  // Actions
  activatePreset: (presetId: string) => void;
  deactivatePreset: () => void;
  createCustomPreset: (preset: Partial<CheNuPreset>) => CheNuPreset | null;
  updatePreset: (preset: CheNuPreset) => void;
  deletePreset: (presetId: string) => boolean;
  duplicatePreset: (presetId: string) => CheNuPreset | null;
  toggleFavorite: (presetId: string) => void;
  toggleAutoSuggest: () => void;
  
  // Context updates
  updateContext: (updates: Partial<PresetContext>) => void;
  setActivity: (activity: PresetContext['currentActivity']) => void;
  setSphere: (sphereId: string | undefined) => void;
  
  // Utilities
  getPreset: (presetId: string) => CheNuPreset | undefined;
  isFavorite: (presetId: string) => boolean;
  refreshSuggestions: () => void;
}

const PresetReactContext = createContext<PresetContextValue | null>(null);

// ─────────────────────────────────────────────────────
// PROVIDER
// ─────────────────────────────────────────────────────

interface PresetProviderProps {
  children: ReactNode;
  personalization: CheNuPersonalization;
  onPersonalizationChange: (next: CheNuPersonalization) => void;
  /** Check interval for auto-suggestions (ms) */
  autoCheckInterval?: number;
}

export function PresetProvider({
  children,
  personalization,
  onPersonalizationChange,
  autoCheckInterval = 60000, // 1 minute default
}: PresetProviderProps) {
  // State
  const [state, setState] = useState<PresetState>(loadPresetState);
  const [context, setContext] = useState<PresetContext>(createDefaultContext);
  const [suggestions, setSuggestions] = useState<PresetSuggestion[]>([]);
  
  // Track previous personalization for revert
  const previousPersonalizationRef = useRef<CheNuPersonalization | null>(null);
  
  // ─── Dispatch ───
  const dispatch = useCallback((event: PresetEvent) => {
    setState(prev => {
      const next = reducePresetState(prev, event);
      savePresetState(next);
      return next;
    });
  }, []);
  
  // ─── Active preset ───
  const activePreset = useMemo(() => {
    if (!state.activePresetId) return null;
    return getPresetById(state.presets, state.activePresetId) || null;
  }, [state.presets, state.activePresetId]);
  
  // ─── Activate preset ───
  const activatePreset = useCallback((presetId: string) => {
    const preset = getPresetById(state.presets, presetId);
    if (!preset) {
      console.warn(`Preset not found: ${presetId}`);
      return;
    }
    
    // Save current personalization for potential revert
    previousPersonalizationRef.current = personalization;
    
    // Apply preset
    const updated = applyPreset(personalization, preset);
    onPersonalizationChange(updated);
    
    // Update state
    dispatch({ type: 'PRESET_ACTIVATED', presetId, trigger: 'manual' });
  }, [state.presets, personalization, onPersonalizationChange, dispatch]);
  
  // ─── Deactivate preset ───
  const deactivatePreset = useCallback(() => {
    // Revert to previous personalization if available
    if (previousPersonalizationRef.current) {
      onPersonalizationChange(previousPersonalizationRef.current);
      previousPersonalizationRef.current = null;
    }
    
    dispatch({ type: 'PRESET_DEACTIVATED', presetId: state.activePresetId || '' });
  }, [state.activePresetId, onPersonalizationChange, dispatch]);
  
  // ─── Create custom preset ───
  const createCustomPreset = useCallback((partial: Partial<CheNuPreset>): CheNuPreset | null => {
    // Validate
    if (!partial.id || !partial.label || !partial.personalizationPatch) {
      console.warn('Preset requires id, label, and personalizationPatch');
      return null;
    }
    
    // Check for duplicate ID
    if (getPresetById(state.presets, partial.id)) {
      console.warn(`Preset with ID "${partial.id}" already exists`);
      return null;
    }
    
    const validation = validatePreset(partial);
    if (!validation.valid) {
      console.warn('Preset validation failed:', validation.errors);
      return null;
    }
    
    const preset = createPreset(partial as any);
    dispatch({ type: 'PRESET_CREATED', preset });
    
    return preset;
  }, [state.presets, dispatch]);
  
  // ─── Update preset ───
  const updatePreset = useCallback((preset: CheNuPreset) => {
    // Cannot update system presets
    const existing = getPresetById(state.presets, preset.id);
    if (existing?.isSystem) {
      console.warn('Cannot update system presets');
      return;
    }
    
    dispatch({ 
      type: 'PRESET_UPDATED', 
      preset: { ...preset, updatedAt: Date.now() } 
    });
  }, [state.presets, dispatch]);
  
  // ─── Delete preset ───
  const deletePreset = useCallback((presetId: string): boolean => {
    const preset = getPresetById(state.presets, presetId);
    
    if (!preset) {
      console.warn(`Preset not found: ${presetId}`);
      return false;
    }
    
    if (preset.isSystem) {
      console.warn('Cannot delete system presets');
      return false;
    }
    
    dispatch({ type: 'PRESET_DELETED', presetId });
    return true;
  }, [state.presets, dispatch]);
  
  // ─── Duplicate preset ───
  const duplicatePreset = useCallback((presetId: string): CheNuPreset | null => {
    const source = getPresetById(state.presets, presetId);
    if (!source) {
      console.warn(`Preset not found: ${presetId}`);
      return null;
    }
    
    // Generate unique ID
    let newId = `${presetId}-copy`;
    let counter = 1;
    while (getPresetById(state.presets, newId)) {
      newId = `${presetId}-copy-${counter++}`;
    }
    
    const cloned = clonePreset(source, newId);
    dispatch({ type: 'PRESET_CREATED', preset: cloned });
    
    return cloned;
  }, [state.presets, dispatch]);
  
  // ─── Toggle favorite ───
  const toggleFavorite = useCallback((presetId: string) => {
    if (state.favorites.includes(presetId)) {
      dispatch({ type: 'PRESET_UNFAVORITED', presetId });
    } else {
      dispatch({ type: 'PRESET_FAVORITED', presetId });
    }
  }, [state.favorites, dispatch]);
  
  // ─── Toggle auto-suggest ───
  const toggleAutoSuggest = useCallback(() => {
    dispatch({ type: 'AUTO_SUGGEST_TOGGLED', enabled: !state.autoSuggestEnabled });
  }, [state.autoSuggestEnabled, dispatch]);
  
  // ─── Update context ───
  const updateContext = useCallback((updates: Partial<PresetContext>) => {
    setContext(prev => ({ ...prev, ...updates }));
  }, []);
  
  // ─── Set activity ───
  const setActivity = useCallback((activity: PresetContext['currentActivity']) => {
    updateContext({ currentActivity: activity });
  }, [updateContext]);
  
  // ─── Set sphere ───
  const setSphere = useCallback((sphereId: string | undefined) => {
    updateContext({ activeSphere: sphereId });
  }, [updateContext]);
  
  // ─── Get preset ───
  const getPreset = useCallback((presetId: string) => {
    return getPresetById(state.presets, presetId);
  }, [state.presets]);
  
  // ─── Is favorite ───
  const isFavorite = useCallback((presetId: string) => {
    return state.favorites.includes(presetId);
  }, [state.favorites]);
  
  // ─── Refresh suggestions ───
  const refreshSuggestions = useCallback(() => {
    if (!state.autoSuggestEnabled) {
      setSuggestions([]);
      return;
    }
    
    const newSuggestions = suggestPresets(state.presets, context, {
      maxSuggestions: 3,
      includeManual: false,
    });
    
    setSuggestions(newSuggestions);
  }, [state.presets, state.autoSuggestEnabled, context]);
  
  // ─── Auto-refresh suggestions ───
  useEffect(() => {
    refreshSuggestions();
  }, [context, refreshSuggestions]);
  
  // ─── Periodic context update ───
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setContext(prev => ({
        ...prev,
        currentTime: now,
        dayOfWeek: now.getDay(),
        sessionDurationMinutes: prev.sessionDurationMinutes + 1,
      }));
    }, autoCheckInterval);
    
    return () => clearInterval(interval);
  }, [autoCheckInterval]);
  
  // ─── Detect XR on mount ───
  useEffect(() => {
    detectXRCapability().then(hasXR => {
      setContext(prev => ({
        ...prev,
        capabilities: { ...prev.capabilities, xr: hasXR },
      }));
    });
  }, []);
  
  // ─── Auto-activate matching presets ───
  useEffect(() => {
    if (!state.autoSuggestEnabled || state.activePresetId) return;
    
    // Find auto-activatable preset with highest score
    const autoSuggestion = suggestions.find(s => 
      s.preset.autoActivate && s.score >= 75
    );
    
    if (autoSuggestion) {
      // Save current personalization
      previousPersonalizationRef.current = personalization;
      
      // Apply preset
      const updated = applyPreset(personalization, autoSuggestion.preset);
      onPersonalizationChange(updated);
      
      // Update state
      dispatch({ 
        type: 'PRESET_ACTIVATED', 
        presetId: autoSuggestion.preset.id, 
        trigger: 'auto' 
      });
    }
  }, [suggestions, state.autoSuggestEnabled, state.activePresetId, personalization, onPersonalizationChange, dispatch]);
  
  // ─── Context value ───
  const value: PresetContextValue = {
    state,
    activePreset,
    suggestions,
    context,
    activatePreset,
    deactivatePreset,
    createCustomPreset,
    updatePreset,
    deletePreset,
    duplicatePreset,
    toggleFavorite,
    toggleAutoSuggest,
    updateContext,
    setActivity,
    setSphere,
    getPreset,
    isFavorite,
    refreshSuggestions,
  };
  
  return (
    <PresetReactContext.Provider value={value}>
      {children}
    </PresetReactContext.Provider>
  );
}

// ─────────────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────────────

/**
 * Main preset hook.
 */
export function usePresets(): PresetContextValue {
  const ctx = useContext(PresetReactContext);
  if (!ctx) {
    throw new Error('usePresets must be used within PresetProvider');
  }
  return ctx;
}

/**
 * Hook for active preset only.
 */
export function useActivePreset(): {
  preset: CheNuPreset | null;
  activate: (presetId: string) => void;
  deactivate: () => void;
} {
  const { activePreset, activatePreset, deactivatePreset } = usePresets();
  return {
    preset: activePreset,
    activate: activatePreset,
    deactivate: deactivatePreset,
  };
}

/**
 * Hook for preset suggestions.
 */
export function usePresetSuggestions(): {
  suggestions: PresetSuggestion[];
  enabled: boolean;
  toggle: () => void;
  refresh: () => void;
} {
  const { suggestions, state, toggleAutoSuggest, refreshSuggestions } = usePresets();
  return {
    suggestions,
    enabled: state.autoSuggestEnabled,
    toggle: toggleAutoSuggest,
    refresh: refreshSuggestions,
  };
}

/**
 * Hook for favorite presets.
 */
export function useFavoritePresets(): {
  favorites: CheNuPreset[];
  isFavorite: (presetId: string) => boolean;
  toggle: (presetId: string) => void;
} {
  const { state, isFavorite, toggleFavorite, getPreset } = usePresets();
  
  const favorites = useMemo(() => {
    return state.favorites
      .map(id => getPreset(id))
      .filter((p): p is CheNuPreset => p !== undefined);
  }, [state.favorites, getPreset]);
  
  return {
    favorites,
    isFavorite,
    toggle: toggleFavorite,
  };
}

/**
 * Hook for preset by ID.
 */
export function usePreset(presetId: string): {
  preset: CheNuPreset | undefined;
  isActive: boolean;
  isFavorite: boolean;
  activate: () => void;
  toggleFavorite: () => void;
} {
  const { 
    getPreset, 
    activePreset, 
    isFavorite, 
    activatePreset, 
    toggleFavorite 
  } = usePresets();
  
  const preset = getPreset(presetId);
  
  return {
    preset,
    isActive: activePreset?.id === presetId,
    isFavorite: isFavorite(presetId),
    activate: () => activatePreset(presetId),
    toggleFavorite: () => toggleFavorite(presetId),
  };
}

/**
 * Hook for creating custom presets.
 */
export function useCreatePreset(): {
  create: (preset: Partial<CheNuPreset>) => CheNuPreset | null;
  duplicate: (presetId: string) => CheNuPreset | null;
} {
  const { createCustomPreset, duplicatePreset } = usePresets();
  return {
    create: createCustomPreset,
    duplicate: duplicatePreset,
  };
}

/**
 * Hook for activity tracking.
 */
export function usePresetActivity(): {
  currentActivity: PresetContext['currentActivity'];
  setActivity: (activity: PresetContext['currentActivity']) => void;
  startMeeting: () => void;
  endMeeting: () => void;
  startDeepWork: () => void;
  startBreak: () => void;
} {
  const { context, setActivity, updateContext } = usePresets();
  
  return {
    currentActivity: context.currentActivity,
    setActivity,
    startMeeting: () => {
      setActivity('meeting_start');
      updateContext({ inMeeting: true });
    },
    endMeeting: () => {
      setActivity('meeting_end');
      updateContext({ inMeeting: false });
    },
    startDeepWork: () => setActivity('deep_work'),
    startBreak: () => setActivity('break'),
  };
}

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export type { PresetContextValue };
