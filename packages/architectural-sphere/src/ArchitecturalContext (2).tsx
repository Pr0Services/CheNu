/**
 * CHE·NU — ARCHITECTURAL SPHERE
 * React Context & Provider
 * 
 * Manages architectural assets: plans, avatars, decor presets.
 * SPACE ONLY — NO behavior, NO decisions, NO data authority.
 */

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  ReactNode,
} from 'react';

import {
  Plan,
  Avatar,
  DecorPreset,
  ThemeConfig,
  ExportPackage,
  ActivationRequest,
  ActivationResponse,
  ValidationResult,
  ArchDomain,
} from './types';

import {
  validatePlan,
  validateAvatar,
  validateDecorPreset,
  validateExportPackage,
  generateHash,
} from './validators';

// ============================================================
// STATE
// ============================================================

interface ArchitecturalState {
  // Assets
  plans: Map<string, Plan>;
  avatars: Map<string, Avatar>;
  decorPresets: Map<string, DecorPreset>;
  themes: Map<string, ThemeConfig>;
  
  // Active selections
  activePlan: string | null;
  activeAvatar: string | null;
  activeDecor: string | null;
  activeTheme: string | null;
  
  // Domain enablement
  enabledDomains: Set<ArchDomain>;
  
  // Sandbox
  sandboxMode: boolean;
  sandboxPreview: Plan | Avatar | DecorPreset | null;
  
  // Pending activations
  pendingActivations: ActivationRequest[];
  
  // History (for undo)
  history: Array<{ type: string; data: unknown; timestamp: number }>;
}

// ============================================================
// ACTIONS
// ============================================================

type ArchAction =
  | { type: 'ADD_PLAN'; payload: Plan }
  | { type: 'UPDATE_PLAN'; payload: { id: string; plan: Partial<Plan> } }
  | { type: 'DELETE_PLAN'; payload: string }
  | { type: 'SET_ACTIVE_PLAN'; payload: string | null }
  
  | { type: 'ADD_AVATAR'; payload: Avatar }
  | { type: 'UPDATE_AVATAR'; payload: { id: string; avatar: Partial<Avatar> } }
  | { type: 'DELETE_AVATAR'; payload: string }
  | { type: 'SET_ACTIVE_AVATAR'; payload: string | null }
  
  | { type: 'ADD_DECOR_PRESET'; payload: DecorPreset }
  | { type: 'UPDATE_DECOR_PRESET'; payload: { id: string; preset: Partial<DecorPreset> } }
  | { type: 'DELETE_DECOR_PRESET'; payload: string }
  | { type: 'SET_ACTIVE_DECOR'; payload: string | null }
  
  | { type: 'ADD_THEME'; payload: ThemeConfig }
  | { type: 'SET_ACTIVE_THEME'; payload: string | null }
  
  | { type: 'ENABLE_DOMAIN'; payload: ArchDomain }
  | { type: 'DISABLE_DOMAIN'; payload: ArchDomain }
  
  | { type: 'ENTER_SANDBOX'; payload: Plan | Avatar | DecorPreset }
  | { type: 'EXIT_SANDBOX' }
  
  | { type: 'ADD_PENDING_ACTIVATION'; payload: ActivationRequest }
  | { type: 'REMOVE_PENDING_ACTIVATION'; payload: string }
  
  | { type: 'CLEAR_HISTORY' };

// ============================================================
// INITIAL STATE
// ============================================================

const initialState: ArchitecturalState = {
  plans: new Map(),
  avatars: new Map(),
  decorPresets: new Map(),
  themes: new Map(),
  activePlan: null,
  activeAvatar: null,
  activeDecor: null,
  activeTheme: null,
  enabledDomains: new Set(['xr', 'creative']), // Default enabled
  sandboxMode: false,
  sandboxPreview: null,
  pendingActivations: [],
  history: [],
};

// ============================================================
// REDUCER
// ============================================================

function archReducer(state: ArchitecturalState, action: ArchAction): ArchitecturalState {
  const timestamp = Date.now();
  
  switch (action.type) {
    // Plans
    case 'ADD_PLAN': {
      const newPlans = new Map(state.plans);
      newPlans.set(action.payload.id, action.payload);
      return {
        ...state,
        plans: newPlans,
        history: [...state.history, { type: 'ADD_PLAN', data: action.payload, timestamp }],
      };
    }
    
    case 'UPDATE_PLAN': {
      const existing = state.plans.get(action.payload.id);
      if (!existing) return state;
      const updated = { ...existing, ...action.payload.plan };
      const newPlans = new Map(state.plans);
      newPlans.set(action.payload.id, updated);
      return {
        ...state,
        plans: newPlans,
        history: [...state.history, { type: 'UPDATE_PLAN', data: { old: existing, new: updated }, timestamp }],
      };
    }
    
    case 'DELETE_PLAN': {
      const newPlans = new Map(state.plans);
      const deleted = newPlans.get(action.payload);
      newPlans.delete(action.payload);
      return {
        ...state,
        plans: newPlans,
        activePlan: state.activePlan === action.payload ? null : state.activePlan,
        history: [...state.history, { type: 'DELETE_PLAN', data: deleted, timestamp }],
      };
    }
    
    case 'SET_ACTIVE_PLAN':
      return { ...state, activePlan: action.payload };
    
    // Avatars
    case 'ADD_AVATAR': {
      const newAvatars = new Map(state.avatars);
      newAvatars.set(action.payload.id, action.payload);
      return {
        ...state,
        avatars: newAvatars,
        history: [...state.history, { type: 'ADD_AVATAR', data: action.payload, timestamp }],
      };
    }
    
    case 'UPDATE_AVATAR': {
      const existing = state.avatars.get(action.payload.id);
      if (!existing) return state;
      const updated = { ...existing, ...action.payload.avatar };
      const newAvatars = new Map(state.avatars);
      newAvatars.set(action.payload.id, updated as Avatar);
      return {
        ...state,
        avatars: newAvatars,
        history: [...state.history, { type: 'UPDATE_AVATAR', data: { old: existing, new: updated }, timestamp }],
      };
    }
    
    case 'DELETE_AVATAR': {
      const newAvatars = new Map(state.avatars);
      newAvatars.delete(action.payload);
      return {
        ...state,
        avatars: newAvatars,
        activeAvatar: state.activeAvatar === action.payload ? null : state.activeAvatar,
      };
    }
    
    case 'SET_ACTIVE_AVATAR':
      return { ...state, activeAvatar: action.payload };
    
    // Decor Presets
    case 'ADD_DECOR_PRESET': {
      const newPresets = new Map(state.decorPresets);
      newPresets.set(action.payload.id, action.payload);
      return { ...state, decorPresets: newPresets };
    }
    
    case 'UPDATE_DECOR_PRESET': {
      const existing = state.decorPresets.get(action.payload.id);
      if (!existing) return state;
      const updated = { ...existing, ...action.payload.preset };
      const newPresets = new Map(state.decorPresets);
      newPresets.set(action.payload.id, updated as DecorPreset);
      return { ...state, decorPresets: newPresets };
    }
    
    case 'DELETE_DECOR_PRESET': {
      const newPresets = new Map(state.decorPresets);
      newPresets.delete(action.payload);
      return { ...state, decorPresets: newPresets };
    }
    
    case 'SET_ACTIVE_DECOR':
      return { ...state, activeDecor: action.payload };
    
    // Themes
    case 'ADD_THEME': {
      const newThemes = new Map(state.themes);
      newThemes.set(action.payload.id, action.payload);
      return { ...state, themes: newThemes };
    }
    
    case 'SET_ACTIVE_THEME':
      return { ...state, activeTheme: action.payload };
    
    // Domains
    case 'ENABLE_DOMAIN': {
      const newDomains = new Set(state.enabledDomains);
      newDomains.add(action.payload);
      return { ...state, enabledDomains: newDomains };
    }
    
    case 'DISABLE_DOMAIN': {
      const newDomains = new Set(state.enabledDomains);
      newDomains.delete(action.payload);
      return { ...state, enabledDomains: newDomains };
    }
    
    // Sandbox
    case 'ENTER_SANDBOX':
      return { ...state, sandboxMode: true, sandboxPreview: action.payload };
    
    case 'EXIT_SANDBOX':
      return { ...state, sandboxMode: false, sandboxPreview: null };
    
    // Pending Activations
    case 'ADD_PENDING_ACTIVATION':
      return {
        ...state,
        pendingActivations: [...state.pendingActivations, action.payload],
      };
    
    case 'REMOVE_PENDING_ACTIVATION':
      return {
        ...state,
        pendingActivations: state.pendingActivations.filter(
          a => a.package.hash_signature !== action.payload
        ),
      };
    
    // History
    case 'CLEAR_HISTORY':
      return { ...state, history: [] };
    
    default:
      return state;
  }
}

// ============================================================
// CONTEXT
// ============================================================

interface ArchitecturalContextValue {
  state: ArchitecturalState;
  
  // Plan operations
  addPlan: (plan: Plan) => ValidationResult;
  updatePlan: (id: string, plan: Partial<Plan>) => ValidationResult;
  deletePlan: (id: string) => void;
  setActivePlan: (id: string | null) => void;
  getPlan: (id: string) => Plan | undefined;
  
  // Avatar operations
  addAvatar: (avatar: Avatar) => ValidationResult;
  updateAvatar: (id: string, avatar: Partial<Avatar>) => ValidationResult;
  deleteAvatar: (id: string) => void;
  setActiveAvatar: (id: string | null) => void;
  getAvatar: (id: string) => Avatar | undefined;
  
  // Decor operations
  addDecorPreset: (preset: DecorPreset) => ValidationResult;
  updateDecorPreset: (id: string, preset: Partial<DecorPreset>) => void;
  deleteDecorPreset: (id: string) => void;
  setActiveDecor: (id: string | null) => void;
  
  // Domain operations
  enableDomain: (domain: ArchDomain) => void;
  disableDomain: (domain: ArchDomain) => void;
  isDomainEnabled: (domain: ArchDomain) => boolean;
  
  // Sandbox
  enterSandbox: (preview: Plan | Avatar | DecorPreset) => void;
  exitSandbox: () => void;
  
  // Export
  createExportPackage: (assetType: 'plan' | 'avatar' | 'decor', assetId: string) => Promise<ExportPackage | null>;
  requestActivation: (pkg: ExportPackage, targetSphere: string) => Promise<ActivationResponse>;
}

const ArchitecturalContext = createContext<ArchitecturalContextValue | null>(null);

// ============================================================
// PROVIDER
// ============================================================

interface ArchitecturalProviderProps {
  children: ReactNode;
}

export function ArchitecturalProvider({ children }: ArchitecturalProviderProps) {
  const [state, dispatch] = useReducer(archReducer, initialState);
  
  // Plan operations
  const addPlan = useCallback((plan: Plan): ValidationResult => {
    const result = validatePlan(plan);
    if (result.valid) {
      dispatch({ type: 'ADD_PLAN', payload: plan });
    }
    return result;
  }, []);
  
  const updatePlan = useCallback((id: string, plan: Partial<Plan>): ValidationResult => {
    const existing = state.plans.get(id);
    if (!existing) {
      return { valid: false, errors: [{ field: 'id', message: 'Plan not found', severity: 'error' }] };
    }
    const merged = { ...existing, ...plan };
    const result = validatePlan(merged);
    if (result.valid) {
      dispatch({ type: 'UPDATE_PLAN', payload: { id, plan } });
    }
    return result;
  }, [state.plans]);
  
  const deletePlan = useCallback((id: string) => {
    dispatch({ type: 'DELETE_PLAN', payload: id });
  }, []);
  
  const setActivePlan = useCallback((id: string | null) => {
    dispatch({ type: 'SET_ACTIVE_PLAN', payload: id });
  }, []);
  
  const getPlan = useCallback((id: string) => state.plans.get(id), [state.plans]);
  
  // Avatar operations
  const addAvatar = useCallback((avatar: Avatar): ValidationResult => {
    const result = validateAvatar(avatar);
    if (result.valid) {
      dispatch({ type: 'ADD_AVATAR', payload: avatar });
    }
    return result;
  }, []);
  
  const updateAvatar = useCallback((id: string, avatar: Partial<Avatar>): ValidationResult => {
    const existing = state.avatars.get(id);
    if (!existing) {
      return { valid: false, errors: [{ field: 'id', message: 'Avatar not found', severity: 'error' }] };
    }
    const merged = { ...existing, ...avatar } as Avatar;
    const result = validateAvatar(merged);
    if (result.valid) {
      dispatch({ type: 'UPDATE_AVATAR', payload: { id, avatar } });
    }
    return result;
  }, [state.avatars]);
  
  const deleteAvatar = useCallback((id: string) => {
    dispatch({ type: 'DELETE_AVATAR', payload: id });
  }, []);
  
  const setActiveAvatar = useCallback((id: string | null) => {
    dispatch({ type: 'SET_ACTIVE_AVATAR', payload: id });
  }, []);
  
  const getAvatar = useCallback((id: string) => state.avatars.get(id), [state.avatars]);
  
  // Decor operations
  const addDecorPreset = useCallback((preset: DecorPreset): ValidationResult => {
    const result = validateDecorPreset(preset);
    if (result.valid) {
      dispatch({ type: 'ADD_DECOR_PRESET', payload: preset });
    }
    return result;
  }, []);
  
  const updateDecorPreset = useCallback((id: string, preset: Partial<DecorPreset>) => {
    dispatch({ type: 'UPDATE_DECOR_PRESET', payload: { id, preset } });
  }, []);
  
  const deleteDecorPreset = useCallback((id: string) => {
    dispatch({ type: 'DELETE_DECOR_PRESET', payload: id });
  }, []);
  
  const setActiveDecor = useCallback((id: string | null) => {
    dispatch({ type: 'SET_ACTIVE_DECOR', payload: id });
  }, []);
  
  // Domain operations
  const enableDomain = useCallback((domain: ArchDomain) => {
    dispatch({ type: 'ENABLE_DOMAIN', payload: domain });
  }, []);
  
  const disableDomain = useCallback((domain: ArchDomain) => {
    dispatch({ type: 'DISABLE_DOMAIN', payload: domain });
  }, []);
  
  const isDomainEnabled = useCallback((domain: ArchDomain) => {
    return state.enabledDomains.has(domain);
  }, [state.enabledDomains]);
  
  // Sandbox
  const enterSandbox = useCallback((preview: Plan | Avatar | DecorPreset) => {
    dispatch({ type: 'ENTER_SANDBOX', payload: preview });
  }, []);
  
  const exitSandbox = useCallback(() => {
    dispatch({ type: 'EXIT_SANDBOX' });
  }, []);
  
  // Export
  const createExportPackage = useCallback(async (
    assetType: 'plan' | 'avatar' | 'decor',
    assetId: string
  ): Promise<ExportPackage | null> => {
    let payload: Plan | Avatar | DecorPreset | undefined;
    let compatTags: ('2d' | '3d' | 'xr')[] = ['2d'];
    
    switch (assetType) {
      case 'plan':
        payload = state.plans.get(assetId);
        if (payload) compatTags = [(payload as Plan).dimension];
        break;
      case 'avatar':
        payload = state.avatars.get(assetId);
        compatTags = ['2d', '3d', 'xr'];
        break;
      case 'decor':
        payload = state.decorPresets.get(assetId);
        if (payload) compatTags = [(payload as DecorPreset).dimension];
        break;
    }
    
    if (!payload) return null;
    
    const hash = await generateHash(payload);
    
    const pkg: ExportPackage = {
      sphere_id: 'architectural',
      asset_type: assetType,
      version: '1.0.0',
      hash_signature: hash,
      compatibility_tags: compatTags,
      created_at: new Date().toISOString(),
      payload,
    };
    
    const result = validateExportPackage(pkg);
    return result.valid ? pkg : null;
  }, [state.plans, state.avatars, state.decorPresets]);
  
  const requestActivation = useCallback(async (
    pkg: ExportPackage,
    targetSphere: string
  ): Promise<ActivationResponse> => {
    const request: ActivationRequest = {
      package: pkg,
      target_sphere: targetSphere,
      requested_by: 'current-user', // Would come from auth
      requested_at: new Date().toISOString(),
    };
    
    dispatch({ type: 'ADD_PENDING_ACTIVATION', payload: request });
    
    // In real implementation, this would call governance APIs
    // For now, simulate approval
    return {
      approved: true,
      activated_at: new Date().toISOString(),
      validators_passed: ['schema', 'rules', 'compatibility'],
    };
  }, []);
  
  const value: ArchitecturalContextValue = {
    state,
    addPlan,
    updatePlan,
    deletePlan,
    setActivePlan,
    getPlan,
    addAvatar,
    updateAvatar,
    deleteAvatar,
    setActiveAvatar,
    getAvatar,
    addDecorPreset,
    updateDecorPreset,
    deleteDecorPreset,
    setActiveDecor,
    enableDomain,
    disableDomain,
    isDomainEnabled,
    enterSandbox,
    exitSandbox,
    createExportPackage,
    requestActivation,
  };
  
  return (
    <ArchitecturalContext.Provider value={value}>
      {children}
    </ArchitecturalContext.Provider>
  );
}

// ============================================================
// HOOK
// ============================================================

export function useArchitectural(): ArchitecturalContextValue {
  const context = useContext(ArchitecturalContext);
  if (!context) {
    throw new Error('useArchitectural must be used within ArchitecturalProvider');
  }
  return context;
}

export { ArchitecturalContext };
