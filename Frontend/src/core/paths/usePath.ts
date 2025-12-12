/* =========================================
   CHE·NU — usePath Hook
   
   Hook React pour naviguer dans les chemins.
   
   Usage:
   const { path, intent, options, enter, execute, retreat } = usePath();
   ========================================= */

import { useState, useCallback, useMemo } from 'react';

import {
  PathType,
  PathState,
  PathStep,
  PathOption,
  ValidationResult,
  ValidationRequest,
  PATHS,
  OPTIONS,
} from './path.types';

import {
  enterPath,
  executeOption,
  validate,
  retreat as retreatFn,
  addNote,
  markIdea,
  prepareDecision,
  getCurrentState,
  getCurrentPath,
  getCurrentIntention,
  getAvailableOptions,
  hasPendingValidation,
  getPendingValidation,
} from './path.engine';

// ============================================
// HOOK INTERFACE
// ============================================

export interface UsePathResult {
  // État
  state: PathState;
  path: PathType;
  intention: string;
  options: PathOption[];
  
  // Validation
  pendingValidation: ValidationRequest | undefined;
  hasPending: boolean;
  
  // Navigation
  enter: (path: PathType, intention?: string) => void;
  execute: (option: PathOption, data?: unknown) => PathStep | null;
  confirm: () => ValidationResult;
  cancel: () => ValidationResult;
  retreat: () => void;
  
  // Exploration
  note: (text: string) => void;
  mark: (ideaId: string) => void;
  
  // Décision
  decide: (description: string) => ValidationRequest;
  
  // Helpers
  isExploring: boolean;
  isDeciding: boolean;
  canRetreat: boolean;
  pathConfig: typeof PATHS[PathType];
}

// ============================================
// HOOK IMPLEMENTATION
// ============================================

/**
 * Hook pour la navigation par chemins
 */
export function usePath(): UsePathResult {
  // État local pour forcer les re-renders
  const [, forceUpdate] = useState(0);
  const refresh = useCallback(() => forceUpdate((n) => n + 1), []);
  
  // État actuel (depuis le moteur)
  const state = getCurrentState();
  const path = getCurrentPath();
  const intention = getCurrentIntention();
  const options = getAvailableOptions();
  const hasPending = hasPendingValidation();
  const pendingValidation = getPendingValidation();
  
  // Navigation
  const enter = useCallback((targetPath: PathType, intentionPhrase?: string) => {
    enterPath(targetPath, intentionPhrase);
    refresh();
  }, [refresh]);
  
  const execute = useCallback((option: PathOption, data?: unknown) => {
    const result = executeOption(option, data);
    refresh();
    return result;
  }, [refresh]);
  
  const confirm = useCallback(() => {
    const result = validate(true);
    refresh();
    return result;
  }, [refresh]);
  
  const cancel = useCallback(() => {
    const result = validate(false);
    refresh();
    return result;
  }, [refresh]);
  
  const retreat = useCallback(() => {
    retreatFn();
    refresh();
  }, [refresh]);
  
  // Exploration
  const note = useCallback((text: string) => {
    addNote(text);
    refresh();
  }, [refresh]);
  
  const mark = useCallback((ideaId: string) => {
    markIdea(ideaId);
    refresh();
  }, [refresh]);
  
  // Décision
  const decide = useCallback((description: string) => {
    const request = prepareDecision(description);
    refresh();
    return request;
  }, [refresh]);
  
  // Helpers mémoisés
  const isExploring = path === 'exploration';
  const isDeciding = path === 'decision';
  const canRetreat = state.canRetreat;
  const pathConfig = PATHS[path];
  
  return useMemo(() => ({
    // État
    state,
    path,
    intention,
    options,
    
    // Validation
    pendingValidation,
    hasPending,
    
    // Navigation
    enter,
    execute,
    confirm,
    cancel,
    retreat,
    
    // Exploration
    note,
    mark,
    
    // Décision
    decide,
    
    // Helpers
    isExploring,
    isDeciding,
    canRetreat,
    pathConfig,
  }), [
    state,
    path,
    intention,
    options,
    pendingValidation,
    hasPending,
    enter,
    execute,
    confirm,
    cancel,
    retreat,
    note,
    mark,
    decide,
    isExploring,
    isDeciding,
    canRetreat,
    pathConfig,
  ]);
}

// ============================================
// HELPER HOOKS
// ============================================

/**
 * Hook simplifié pour les options
 */
export function usePathOptions(): {
  options: Array<{ id: PathOption; question: string; description: string }>;
  execute: (option: PathOption) => void;
} {
  const { options, execute } = usePath();
  
  const optionsList = useMemo(() => 
    options.map((opt) => ({
      id: opt,
      question: OPTIONS[opt].question,
      description: OPTIONS[opt].description,
    })),
    [options]
  );
  
  const handleExecute = useCallback((option: PathOption) => {
    execute(option);
  }, [execute]);
  
  return { options: optionsList, execute: handleExecute };
}

/**
 * Hook pour la validation
 */
export function useValidation(): {
  pending: ValidationRequest | undefined;
  confirm: () => void;
  cancel: () => void;
} {
  const { pendingValidation, confirm, cancel } = usePath();
  
  return {
    pending: pendingValidation,
    confirm,
    cancel,
  };
}

/**
 * Hook pour l'exploration
 */
export function useExploration(): {
  isActive: boolean;
  notes: string[];
  markedIdeas: string[];
  addNote: (text: string) => void;
  markIdea: (id: string) => void;
} {
  const { state, isExploring, note, mark } = usePath();
  
  return {
    isActive: isExploring,
    notes: state.scratch.notes,
    markedIdeas: state.scratch.ideasMarked,
    addNote: note,
    markIdea: mark,
  };
}

export default usePath;
