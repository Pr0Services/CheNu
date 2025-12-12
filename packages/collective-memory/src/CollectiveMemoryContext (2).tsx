/**
 * CHE·NU — COLLECTIVE MEMORY + NAVIGATION
 * React Context
 */

import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import {
  CollectiveMemory, CollectiveMemoryEntry, MemoryGraph, MemoryGraphNode, MemoryGraphEdge,
  NavigationProfile, NavigationMode, NavigationPreferences, MemoryAccessControl, NavigationSafety,
  CollectiveMemoryNavigationState, MemoryEntryType,
} from './types';
import { DEFAULT_ACCESS_CONTROL, DEFAULT_SAFETY, NAVIGATION_MODES, createProfile, createMemoryEntry } from './presets';

type Action =
  | { type: 'ADD_MEMORY_ENTRY'; payload: CollectiveMemoryEntry }
  | { type: 'VALIDATE_ENTRY'; payload: string }
  | { type: 'ADD_GRAPH_NODE'; payload: MemoryGraphNode }
  | { type: 'ADD_GRAPH_EDGE'; payload: MemoryGraphEdge }
  | { type: 'SET_PROFILE'; payload: NavigationProfile }
  | { type: 'SET_MODE'; payload: NavigationMode }
  | { type: 'UPDATE_PREFERENCES'; payload: Partial<NavigationPreferences> }
  | { type: 'SET_SPHERE_FILTER'; payload: string | null }
  | { type: 'SET_TIME_FILTER'; payload: { start?: number; end?: number } | null }
  | { type: 'RESET_TO_NEUTRAL' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET' };

const initialState: CollectiveMemoryNavigationState = {
  memory: { entries: [], integrity: 'verified', last_validated: new Date().toISOString(), total_entries: 0 },
  graph: { nodes: [], edges: [] },
  access_control: DEFAULT_ACCESS_CONTROL,
  current_profile: null,
  available_modes: NAVIGATION_MODES,
  safety: DEFAULT_SAFETY,
  sphere_filter: null,
  time_filter: null,
  participant_filter: null,
  is_loading: false,
  error: null,
};

function reducer(state: CollectiveMemoryNavigationState, action: Action): CollectiveMemoryNavigationState {
  switch (action.type) {
    case 'ADD_MEMORY_ENTRY':
      return {
        ...state,
        memory: {
          ...state.memory,
          entries: [...state.memory.entries, action.payload],
          total_entries: state.memory.entries.length + 1,
        },
      };
    case 'VALIDATE_ENTRY':
      return {
        ...state,
        memory: {
          ...state.memory,
          entries: state.memory.entries.map(e => e.id === action.payload ? { ...e, validated: true } : e),
          last_validated: new Date().toISOString(),
        },
      };
    case 'ADD_GRAPH_NODE':
      return { ...state, graph: { ...state.graph, nodes: [...state.graph.nodes, action.payload] } };
    case 'ADD_GRAPH_EDGE':
      return { ...state, graph: { ...state.graph, edges: [...state.graph.edges, action.payload] } };
    case 'SET_PROFILE':
      return { ...state, current_profile: action.payload };
    case 'SET_MODE':
      if (!state.current_profile) return state;
      return { ...state, current_profile: { ...state.current_profile, mode: action.payload, updated_at: new Date().toISOString() } };
    case 'UPDATE_PREFERENCES':
      if (!state.current_profile) return state;
      return {
        ...state,
        current_profile: {
          ...state.current_profile,
          preferences: { ...state.current_profile.preferences, ...action.payload },
          updated_at: new Date().toISOString(),
        },
      };
    case 'SET_SPHERE_FILTER':
      return { ...state, sphere_filter: action.payload };
    case 'SET_TIME_FILTER':
      return { ...state, time_filter: action.payload };
    case 'RESET_TO_NEUTRAL':
      if (!state.current_profile) return state;
      return {
        ...state,
        current_profile: { ...state.current_profile, mode: 'explorer', preferences: { ...state.current_profile.preferences, density: 0.5 } },
        sphere_filter: null,
        time_filter: null,
      };
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

interface ContextValue {
  state: CollectiveMemoryNavigationState;
  addMemoryEntry: (type: MemoryEntryType, sourceReplay: string, sphere: string, participants: string[], content: any) => void;
  validateEntry: (entryId: string) => void;
  initProfile: (userId: string, mode?: NavigationMode) => void;
  setMode: (mode: NavigationMode) => void;
  updatePreferences: (prefs: Partial<NavigationPreferences>) => void;
  setSphereFilter: (sphere: string | null) => void;
  resetToNeutral: () => void;
  getFilteredEntries: () => CollectiveMemoryEntry[];
  reset: () => void;
}

const Context = createContext<ContextValue | null>(null);

export function CollectiveMemoryNavigationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const addMemoryEntry = useCallback((type: MemoryEntryType, sourceReplay: string, sphere: string, participants: string[], content: any) => {
    const entry = createMemoryEntry(type, sourceReplay, sphere, participants, content);
    dispatch({ type: 'ADD_MEMORY_ENTRY', payload: entry });
  }, []);

  const validateEntry = useCallback((entryId: string) => {
    dispatch({ type: 'VALIDATE_ENTRY', payload: entryId });
  }, []);

  const initProfile = useCallback((userId: string, mode: NavigationMode = 'explorer') => {
    const profile = createProfile(userId, mode);
    dispatch({ type: 'SET_PROFILE', payload: profile });
  }, []);

  const setMode = useCallback((mode: NavigationMode) => {
    dispatch({ type: 'SET_MODE', payload: mode });
  }, []);

  const updatePreferences = useCallback((prefs: Partial<NavigationPreferences>) => {
    dispatch({ type: 'UPDATE_PREFERENCES', payload: prefs });
  }, []);

  const setSphereFilter = useCallback((sphere: string | null) => {
    dispatch({ type: 'SET_SPHERE_FILTER', payload: sphere });
  }, []);

  const resetToNeutral = useCallback(() => {
    dispatch({ type: 'RESET_TO_NEUTRAL' });
  }, []);

  const getFilteredEntries = useCallback(() => {
    let entries = state.memory.entries;
    if (state.sphere_filter) entries = entries.filter(e => e.sphere === state.sphere_filter);
    if (state.time_filter?.start) entries = entries.filter(e => e.timestamp >= state.time_filter!.start!);
    if (state.time_filter?.end) entries = entries.filter(e => e.timestamp <= state.time_filter!.end!);
    return entries;
  }, [state.memory.entries, state.sphere_filter, state.time_filter]);

  const reset = useCallback(() => { dispatch({ type: 'RESET' }); }, []);

  return (
    <Context.Provider value={{ state, addMemoryEntry, validateEntry, initProfile, setMode, updatePreferences, setSphereFilter, resetToNeutral, getFilteredEntries, reset }}>
      {children}
    </Context.Provider>
  );
}

export function useCollectiveMemoryNavigation() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error('useCollectiveMemoryNavigation must be used within provider');
  return ctx;
}

export { Context as CollectiveMemoryNavigationContext };
