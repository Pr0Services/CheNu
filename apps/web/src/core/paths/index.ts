/* =========================================
   CHE·NU — PATHS MODULE EXPORTS
   
   Système de navigation par chemins.
   
   📜 Un utilisateur navigue dans des CHEMINS d'intention,
      pas dans des écrans.
   ========================================= */

// === TYPES ===
export * from './path.types';

// === ENGINE ===
export {
  // Navigation
  enterPath,
  executeOption,
  validate,
  retreat,
  
  // Exploration
  addNote,
  markIdea,
  
  // Décision
  prepareDecision,
  
  // Session
  getSessionData,
  restoreSession,
  
  // Getters
  getCurrentState,
  getCurrentPath,
  getCurrentIntention,
  getAvailableOptions,
  hasPendingValidation,
  getPendingValidation,
  getIntentionHistory,
  
  // Reset
  resetPathEngine,
  
  // Re-exports
  PATHS,
  OPTIONS,
  RETREAT_RULES,
  PATH_LAWS,
  parseIntention,
} from './path.engine';

// === HOOK ===
export {
  usePath,
  usePathOptions,
  useValidation,
  useExploration,
} from './usePath';

export type { UsePathResult } from './usePath';
