/* =====================================================
   CHE·NU — Role Preset React Hook
   
   React hook for managing roles and preset advisor.
   ===================================================== */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';

import {
  UserRole,
  RoleState,
  RoleEvent,
  PresetAdvisorContext,
  PresetRecommendation,
  AdvisorLogEntry,
} from './rolePreset.types';

import {
  DEFAULT_ROLE_STATE,
  getRoleById,
  createRole,
  cloneRole,
} from './rolePreset.defaults';

import {
  getSuggestedPresetForRole,
  getAllowedPresetsForRole,
  isPresetAllowedForRole,
  recommendPresets,
  createAdvisorLogEntry,
  acceptAdvisorSuggestion,
  calculateAcceptanceRate,
  getMostAcceptedPresets,
  reduceRoleState,
  createDefaultAdvisorContext,
  getTimeOfDay,
} from './rolePreset.engine';

import { CheNuPreset } from '../presets/preset.types';

// ─────────────────────────────────────────────────────
// STORAGE
// ─────────────────────────────────────────────────────

const STORAGE_KEY = 'che-nu.roles';

/**
 * Load role state from localStorage.
 */
function loadRoleState(): RoleState {
  if (typeof localStorage === 'undefined') {
    return DEFAULT_ROLE_STATE;
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_ROLE_STATE;
    
    const parsed = JSON.parse(stored);
    
    // Merge with defaults to ensure new roles are included
    const systemRoles = DEFAULT_ROLE_STATE.roles.filter(r => r.isSystem);
    const customRoles = (parsed.roles || []).filter((r: UserRole) => !r.isSystem);
    
    return {
      ...DEFAULT_ROLE_STATE,
      ...parsed,
      roles: [...systemRoles, ...customRoles],
    };
  } catch {
    return DEFAULT_ROLE_STATE;
  }
}

/**
 * Save role state to localStorage.
 */
function saveRoleState(state: RoleState): void {
  if (typeof localStorage === 'undefined') return;
  
  try {
    const toSave = {
      roles: state.roles.filter(r => !r.isSystem),
      activeRoleId: state.activeRoleId,
      roleHistory: state.roleHistory.slice(0, 20),
      advisorLog: state.advisorLog.slice(0, 50),
      advisorEnabled: state.advisorEnabled,
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (error) {
    console.warn('Failed to save role state:', error);
  }
}

// ─────────────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────────────

interface RoleContextValue {
  // State
  state: RoleState;
  activeRole: UserRole | null;
  recommendations: PresetRecommendation[];
  advisorContext: PresetAdvisorContext;
  
  // Role actions
  selectRole: (roleId: string) => void;
  clearRole: () => void;
  createCustomRole: (role: Partial<UserRole>) => UserRole | null;
  updateRole: (role: UserRole) => void;
  deleteRole: (roleId: string) => boolean;
  duplicateRole: (roleId: string) => UserRole | null;
  
  // Preset integration
  getSuggestedPreset: (presets: CheNuPreset[]) => CheNuPreset | undefined;
  getAllowedPresets: (presets: CheNuPreset[]) => CheNuPreset[];
  isPresetAllowed: (presetId: string) => boolean;
  
  // Advisor
  updateAdvisorContext: (updates: Partial<PresetAdvisorContext>) => void;
  acceptRecommendation: (presetId: string) => void;
  dismissRecommendation: () => void;
  toggleAdvisor: () => void;
  getAcceptanceRate: () => number;
  
  // Utilities
  getRole: (roleId: string) => UserRole | undefined;
  refreshRecommendations: () => void;
}

const RoleReactContext = createContext<RoleContextValue | null>(null);

// ─────────────────────────────────────────────────────
// PROVIDER
// ─────────────────────────────────────────────────────

interface RoleProviderProps {
  children: ReactNode;
  allPresets: CheNuPreset[];
  onPresetSelected?: (presetId: string) => void;
}

export function RoleProvider({
  children,
  allPresets,
  onPresetSelected,
}: RoleProviderProps) {
  // State
  const [state, setState] = useState<RoleState>(loadRoleState);
  const [advisorContext, setAdvisorContext] = useState<PresetAdvisorContext>(
    createDefaultAdvisorContext
  );
  const [recommendations, setRecommendations] = useState<PresetRecommendation[]>([]);
  const [pendingLogEntry, setPendingLogEntry] = useState<AdvisorLogEntry | null>(null);
  
  // ─── Dispatch ───
  const dispatch = useCallback((event: RoleEvent) => {
    setState(prev => {
      const next = reduceRoleState(prev, event);
      saveRoleState(next);
      return next;
    });
  }, []);
  
  // ─── Active role ───
  const activeRole = useMemo(() => {
    if (!state.activeRoleId) return null;
    return getRoleById(state.roles, state.activeRoleId) || null;
  }, [state.roles, state.activeRoleId]);
  
  // ─── Select role ───
  const selectRole = useCallback((roleId: string) => {
    const role = getRoleById(state.roles, roleId);
    if (!role) {
      console.warn(`Role not found: ${roleId}`);
      return;
    }
    
    dispatch({ type: 'ROLE_SELECTED', roleId });
    
    // Auto-select default preset if available
    if (role.defaultPresetId && onPresetSelected) {
      onPresetSelected(role.defaultPresetId);
    }
  }, [state.roles, dispatch, onPresetSelected]);
  
  // ─── Clear role ───
  const clearRole = useCallback(() => {
    dispatch({ type: 'ROLE_CLEARED' });
  }, [dispatch]);
  
  // ─── Create custom role ───
  const createCustomRole = useCallback((partial: Partial<UserRole>): UserRole | null => {
    if (!partial.id || !partial.label) {
      console.warn('Role requires id and label');
      return null;
    }
    
    if (getRoleById(state.roles, partial.id)) {
      console.warn(`Role with ID "${partial.id}" already exists`);
      return null;
    }
    
    const role = createRole(partial as any);
    dispatch({ type: 'ROLE_CREATED', role });
    
    return role;
  }, [state.roles, dispatch]);
  
  // ─── Update role ───
  const updateRole = useCallback((role: UserRole) => {
    const existing = getRoleById(state.roles, role.id);
    if (existing?.isSystem) {
      console.warn('Cannot update system roles');
      return;
    }
    
    dispatch({ 
      type: 'ROLE_UPDATED', 
      role: { ...role, updatedAt: Date.now() } 
    });
  }, [state.roles, dispatch]);
  
  // ─── Delete role ───
  const deleteRole = useCallback((roleId: string): boolean => {
    const role = getRoleById(state.roles, roleId);
    
    if (!role) {
      console.warn(`Role not found: ${roleId}`);
      return false;
    }
    
    if (role.isSystem) {
      console.warn('Cannot delete system roles');
      return false;
    }
    
    dispatch({ type: 'ROLE_DELETED', roleId });
    return true;
  }, [state.roles, dispatch]);
  
  // ─── Duplicate role ───
  const duplicateRole = useCallback((roleId: string): UserRole | null => {
    const source = getRoleById(state.roles, roleId);
    if (!source) {
      console.warn(`Role not found: ${roleId}`);
      return null;
    }
    
    let newId = `${roleId}-copy`;
    let counter = 1;
    while (getRoleById(state.roles, newId)) {
      newId = `${roleId}-copy-${counter++}`;
    }
    
    const cloned = cloneRole(source, newId);
    dispatch({ type: 'ROLE_CREATED', role: cloned });
    
    return cloned;
  }, [state.roles, dispatch]);
  
  // ─── Get suggested preset ───
  const getSuggestedPreset = useCallback((presets: CheNuPreset[]) => {
    if (!activeRole) return undefined;
    return getSuggestedPresetForRole(activeRole, presets);
  }, [activeRole]);
  
  // ─── Get allowed presets ───
  const getAllowedPresets = useCallback((presets: CheNuPreset[]) => {
    if (!activeRole) return presets;
    return getAllowedPresetsForRole(activeRole, presets);
  }, [activeRole]);
  
  // ─── Is preset allowed ───
  const isPresetAllowed = useCallback((presetId: string) => {
    if (!activeRole) return true;
    return isPresetAllowedForRole(activeRole, presetId);
  }, [activeRole]);
  
  // ─── Update advisor context ───
  const updateAdvisorContext = useCallback((updates: Partial<PresetAdvisorContext>) => {
    setAdvisorContext(prev => ({ ...prev, ...updates }));
  }, []);
  
  // ─── Refresh recommendations ───
  const refreshRecommendations = useCallback(() => {
    if (!state.advisorEnabled) {
      setRecommendations([]);
      return;
    }
    
    const contextWithRole = {
      ...advisorContext,
      activeRole: state.activeRoleId || undefined,
    };
    
    const recs = recommendPresets(contextWithRole);
    setRecommendations(recs);
    
    // Create log entry for this recommendation
    if (recs.length > 0) {
      const entry = createAdvisorLogEntry(
        recs.map(r => r.presetId),
        contextWithRole
      );
      setPendingLogEntry(entry);
    }
  }, [state.advisorEnabled, state.activeRoleId, advisorContext]);
  
  // ─── Accept recommendation ───
  const acceptRecommendation = useCallback((presetId: string) => {
    if (pendingLogEntry) {
      const accepted = acceptAdvisorSuggestion(pendingLogEntry, presetId);
      dispatch({ type: 'ADVISOR_SUGGESTION', entry: accepted });
      setPendingLogEntry(null);
    }
    
    if (onPresetSelected) {
      onPresetSelected(presetId);
    }
  }, [pendingLogEntry, dispatch, onPresetSelected]);
  
  // ─── Dismiss recommendation ───
  const dismissRecommendation = useCallback(() => {
    if (pendingLogEntry) {
      dispatch({ type: 'ADVISOR_SUGGESTION', entry: pendingLogEntry });
      setPendingLogEntry(null);
    }
    setRecommendations([]);
  }, [pendingLogEntry, dispatch]);
  
  // ─── Toggle advisor ───
  const toggleAdvisor = useCallback(() => {
    dispatch({ type: 'ADVISOR_TOGGLED', enabled: !state.advisorEnabled });
  }, [state.advisorEnabled, dispatch]);
  
  // ─── Get acceptance rate ───
  const getAcceptanceRate = useCallback(() => {
    return calculateAcceptanceRate(state.advisorLog);
  }, [state.advisorLog]);
  
  // ─── Get role ───
  const getRole = useCallback((roleId: string) => {
    return getRoleById(state.roles, roleId);
  }, [state.roles]);
  
  // ─── Auto-refresh recommendations ───
  useEffect(() => {
    refreshRecommendations();
  }, [advisorContext, state.activeRoleId, refreshRecommendations]);
  
  // ─── Update context time periodically ───
  useEffect(() => {
    const interval = setInterval(() => {
      const hour = new Date().getHours();
      setAdvisorContext(prev => ({
        ...prev,
        timeOfDay: getTimeOfDay(hour),
        sessionDurationMin: prev.sessionDurationMin + 1,
      }));
    }, 60000); // Every minute
    
    return () => clearInterval(interval);
  }, []);
  
  // ─── Context value ───
  const value: RoleContextValue = {
    state,
    activeRole,
    recommendations,
    advisorContext,
    selectRole,
    clearRole,
    createCustomRole,
    updateRole,
    deleteRole,
    duplicateRole,
    getSuggestedPreset,
    getAllowedPresets,
    isPresetAllowed,
    updateAdvisorContext,
    acceptRecommendation,
    dismissRecommendation,
    toggleAdvisor,
    getAcceptanceRate,
    getRole,
    refreshRecommendations,
  };
  
  return (
    <RoleReactContext.Provider value={value}>
      {children}
    </RoleReactContext.Provider>
  );
}

// ─────────────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────────────

/**
 * Main role hook.
 */
export function useRoles(): RoleContextValue {
  const ctx = useContext(RoleReactContext);
  if (!ctx) {
    throw new Error('useRoles must be used within RoleProvider');
  }
  return ctx;
}

/**
 * Hook for active role only.
 */
export function useActiveRole(): {
  role: UserRole | null;
  select: (roleId: string) => void;
  clear: () => void;
} {
  const { activeRole, selectRole, clearRole } = useRoles();
  return {
    role: activeRole,
    select: selectRole,
    clear: clearRole,
  };
}

/**
 * Hook for preset recommendations.
 */
export function usePresetAdvisor(): {
  recommendations: PresetRecommendation[];
  enabled: boolean;
  toggle: () => void;
  accept: (presetId: string) => void;
  dismiss: () => void;
  acceptanceRate: number;
} {
  const { 
    recommendations, 
    state, 
    toggleAdvisor, 
    acceptRecommendation, 
    dismissRecommendation,
    getAcceptanceRate,
  } = useRoles();
  
  return {
    recommendations,
    enabled: state.advisorEnabled,
    toggle: toggleAdvisor,
    accept: acceptRecommendation,
    dismiss: dismissRecommendation,
    acceptanceRate: getAcceptanceRate(),
  };
}

/**
 * Hook for role by ID.
 */
export function useRole(roleId: string): {
  role: UserRole | undefined;
  isActive: boolean;
  select: () => void;
} {
  const { getRole, activeRole, selectRole } = useRoles();
  
  const role = getRole(roleId);
  
  return {
    role,
    isActive: activeRole?.id === roleId,
    select: () => selectRole(roleId),
  };
}

/**
 * Hook for role-based preset filtering.
 */
export function useRolePresets(allPresets: CheNuPreset[]): {
  allowedPresets: CheNuPreset[];
  suggestedPreset: CheNuPreset | undefined;
  isAllowed: (presetId: string) => boolean;
} {
  const { getAllowedPresets, getSuggestedPreset, isPresetAllowed } = useRoles();
  
  const allowedPresets = useMemo(() => 
    getAllowedPresets(allPresets), 
    [getAllowedPresets, allPresets]
  );
  
  const suggestedPreset = useMemo(() => 
    getSuggestedPreset(allPresets), 
    [getSuggestedPreset, allPresets]
  );
  
  return {
    allowedPresets,
    suggestedPreset,
    isAllowed: isPresetAllowed,
  };
}

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export type { RoleContextValue };
