/* =========================================
   CHE·NU — PATH ENGINE
   
   Moteur de navigation par chemins.
   Implémente le manifeste directionnel.
   
   📜 Le système guide sans jamais contraindre.
   ========================================= */

import {
  PathType,
  PathState,
  PathStep,
  PathOption,
  PathScratch,
  UserIntention,
  ValidationRequest,
  ValidationResult,
  RetreatConfig,
  PATHS,
  OPTIONS,
  RETREAT_RULES,
  parseIntention,
  canWriteToTimeline,
  getAllowedOptions,
  PATH_LAWS,
} from './path.types';

import { logger } from '../../utils/logger';

const pathLogger = logger.scope('Path');

// ============================================
// ÉTAT GLOBAL
// ============================================

/** État initial vide */
const createInitialScratch = (): PathScratch => ({
  notes: [],
  ideasMarked: [],
  explorationHistory: [],
});

/** État initial */
const createInitialState = (): PathState => ({
  current: 'reprise', // Par défaut: reprise
  enteredAt: Date.now(),
  activeOption: undefined,
  scratch: createInitialScratch(),
  canRetreat: true,
  steps: [],
});

/** État courant */
let currentState: PathState = createInitialState();

/** Historique des intentions */
const intentionHistory: UserIntention[] = [];

/** File de validations en attente */
const pendingValidations: ValidationRequest[] = [];

// ============================================
// NAVIGATION
// ============================================

/**
 * Entrer dans un chemin
 * @param path - Le chemin cible
 * @param intention - L'intention utilisateur (optionnelle)
 */
export function enterPath(path: PathType, intention?: string): PathState {
  const config = PATHS[path];
  
  pathLogger.info(`Entering path: ${path}`, { intention });
  
  // Enregistrer l'intention
  if (intention) {
    intentionHistory.push({
      phrase: intention,
      path,
      timestamp: Date.now(),
    });
  }
  
  // Créer le nouvel état
  currentState = {
    current: path,
    enteredAt: Date.now(),
    activeOption: undefined,
    scratch: createInitialScratch(),
    canRetreat: true,
    steps: [],
  };
  
  pathLogger.debug(`Path entered: ${config.intention}`);
  
  return currentState;
}

/**
 * Exécuter une option dans le chemin actuel
 * @param option - L'option à exécuter
 * @param data - Données associées (optionnelles)
 */
export function executeOption(option: PathOption, data?: unknown): PathStep | null {
  const allowed = getAllowedOptions(currentState.current);
  
  // Vérifier si l'option est autorisée
  if (!allowed.includes(option)) {
    pathLogger.warn(`Option not allowed in path ${currentState.current}: ${option}`);
    return null;
  }
  
  const optionConfig = OPTIONS[option];
  
  pathLogger.info(`Executing option: ${option}`, { question: optionConfig.question });
  
  // Créer l'étape
  const step: PathStep = {
    option,
    timestamp: Date.now(),
    validated: !optionConfig.requiresValidation,
    data,
  };
  
  // Si validation requise, créer une demande
  if (optionConfig.requiresValidation) {
    const validation: ValidationRequest = {
      type: option === 'marquageIdee' ? 'mark' : 'decision',
      description: optionConfig.description,
      data,
      path: currentState.current,
      requestedAt: Date.now(),
    };
    pendingValidations.push(validation);
    
    pathLogger.debug('Validation required', { option });
  }
  
  // Ajouter l'étape
  currentState.steps.push(step);
  currentState.activeOption = option;
  
  return step;
}

/**
 * Valider une action en attente
 * @param confirm - True pour valider, false pour annuler
 */
export function validate(confirm: boolean): ValidationResult {
  const pending = pendingValidations.pop();
  
  if (!pending) {
    pathLogger.warn('No pending validation');
    return {
      validated: false,
      validatedBy: 'user',
      timestamp: Date.now(),
      canWriteToTimeline: false,
    };
  }
  
  const result: ValidationResult = {
    validated: confirm,
    validatedBy: 'user',
    timestamp: Date.now(),
    canWriteToTimeline: confirm && canWriteToTimeline(pending.path),
  };
  
  // Marquer l'étape comme validée
  if (confirm && currentState.steps.length > 0) {
    currentState.steps[currentState.steps.length - 1].validated = true;
  }
  
  pathLogger.info(`Validation: ${confirm ? 'confirmed' : 'cancelled'}`, {
    type: pending.type,
    canWriteToTimeline: result.canWriteToTimeline,
  });
  
  return result;
}

// ============================================
// RECUL (ROLLBACK)
// ============================================

/**
 * Reculer dans le chemin actuel
 * PRINCIPE: On ne supprime jamais, on repositionne
 */
export function retreat(config?: Partial<RetreatConfig>): PathState {
  const rule = RETREAT_RULES[currentState.current];
  
  pathLogger.info(`Retreat in path: ${currentState.current}`, { rule: rule.target });
  
  // IMPORTANT: Ne jamais écrire dans la timeline lors du recul
  if (rule.writesToTimeline) {
    pathLogger.error('VIOLATION: Retreat cannot write to timeline');
    throw new Error('Retreat cannot write to timeline - LAW 3');
  }
  
  // Préserver les notes si configuré
  const preservedNotes = config?.preserveNotes !== false ? currentState.scratch.notes : [];
  
  // Selon la cible
  switch (rule.target) {
    case 'neutral':
      currentState = createInitialState();
      break;
      
    case 'lastStable':
      // Garder le chemin mais réinitialiser les étapes non validées
      currentState.steps = currentState.steps.filter((s) => s.validated);
      currentState.activeOption = undefined;
      break;
      
    case 'previousContext':
      // Revenir au contexte précédent (mais la décision reste)
      currentState.activeOption = undefined;
      break;
  }
  
  // Restaurer les notes préservées
  currentState.scratch.notes = preservedNotes;
  
  pathLogger.debug('Retreat completed', { target: rule.target });
  
  return currentState;
}

// ============================================
// EXPLORATION (Chemin C)
// ============================================

/**
 * Ajouter une note d'exploration
 * NON sauvegardée automatiquement
 */
export function addNote(note: string): void {
  if (currentState.current !== 'exploration') {
    pathLogger.warn('Notes only in exploration path');
    return;
  }
  
  currentState.scratch.notes.push(note);
  currentState.scratch.explorationHistory.push(`note:${Date.now()}`);
  
  pathLogger.debug('Note added (not saved)', { noteLength: note.length });
}

/**
 * Marquer une idée comme importante
 * NÉCESSITE validation pour écriture timeline
 */
export function markIdea(ideaId: string): ValidationRequest | null {
  if (currentState.current !== 'exploration') {
    pathLogger.warn('Marking only in exploration path');
    return null;
  }
  
  // Utiliser l'option qui nécessite validation
  executeOption('marquageIdee', { ideaId });
  
  currentState.scratch.ideasMarked.push(ideaId);
  
  return pendingValidations[pendingValidations.length - 1] ?? null;
}

// ============================================
// DÉCISION (Chemin D)
// ============================================

/**
 * Préparer une décision
 * @param description - Description de la décision
 */
export function prepareDecision(description: string): ValidationRequest {
  if (currentState.current !== 'decision') {
    // Basculer automatiquement vers le chemin décision
    enterPath('decision', `Je dois décider: ${description}`);
  }
  
  const validation: ValidationRequest = {
    type: 'decision',
    description,
    data: { description, preparedAt: Date.now() },
    path: 'decision',
    requestedAt: Date.now(),
  };
  
  pendingValidations.push(validation);
  
  pathLogger.info('Decision prepared, awaiting validation', { description });
  
  return validation;
}

// ============================================
// SESSION
// ============================================

/**
 * Éléments de session à sauvegarder
 */
export interface SessionData {
  preset: string;
  sphere: string;
  objective?: string;
  timelinePointer: number;
  lastPath: PathType;
}

/**
 * Obtenir les données de session à sauvegarder
 */
export function getSessionData(
  preset: string,
  sphere: string,
  timelinePointer: number,
  objective?: string
): SessionData {
  return {
    preset,
    sphere,
    objective,
    timelinePointer,
    lastPath: currentState.current,
  };
}

/**
 * Restaurer une session (Chemin A - Reprise)
 */
export function restoreSession(session: SessionData): PathState {
  pathLogger.info('Restoring session', { lastPath: session.lastPath });
  
  // Entrer dans le chemin reprise
  enterPath('reprise', 'Je reviens continuer');
  
  return currentState;
}

// ============================================
// GETTERS
// ============================================

/** Obtenir l'état actuel */
export function getCurrentState(): Readonly<PathState> {
  return { ...currentState };
}

/** Obtenir le chemin actuel */
export function getCurrentPath(): PathType {
  return currentState.current;
}

/** Obtenir l'intention du chemin actuel */
export function getCurrentIntention(): string {
  return PATHS[currentState.current].intention;
}

/** Obtenir les options disponibles */
export function getAvailableOptions(): PathOption[] {
  return getAllowedOptions(currentState.current);
}

/** Vérifier s'il y a des validations en attente */
export function hasPendingValidation(): boolean {
  return pendingValidations.length > 0;
}

/** Obtenir la prochaine validation en attente */
export function getPendingValidation(): ValidationRequest | undefined {
  return pendingValidations[pendingValidations.length - 1];
}

/** Obtenir l'historique des intentions */
export function getIntentionHistory(): readonly UserIntention[] {
  return [...intentionHistory];
}

// ============================================
// RESET (pour tests)
// ============================================

export function resetPathEngine(): void {
  currentState = createInitialState();
  intentionHistory.length = 0;
  pendingValidations.length = 0;
  pathLogger.debug('Path engine reset');
}

// ============================================
// EXPORTS
// ============================================

export { PATHS, OPTIONS, RETREAT_RULES, PATH_LAWS, parseIntention };
