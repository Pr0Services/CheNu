/* =========================================
   CHE·NU — CONSTITUTION VALIDATOR
   
   Validateur runtime de la constitution.
   Intercepte et bloque toute action qui violerait
   les principes fondamentaux.
   
   ⚖️ "Guardian of the Laws"
   ========================================= */

import {
  CheNuConstitution,
  ConstitutionViolation,
  ViolationType,
  FORBIDDEN_ACTIONS,
  CONSTITUTION_LAWS,
  isForbiddenAction,
} from './constitution.types';
import foundationConfig from './foundation.json';
import { logger } from '../../utils/logger';

const constitutionLogger = logger.scope('Constitution');

// ============================================
// CONSTITUTION INSTANCE
// ============================================

/** Constitution chargée (immuable) */
export const CONSTITUTION: Readonly<CheNuConstitution> = Object.freeze(
  foundationConfig as CheNuConstitution
);

// ============================================
// VIOLATION TRACKING
// ============================================

/** Historique des violations (pour audit) */
const violationLog: ConstitutionViolation[] = [];

/** Créer une violation */
function createViolation(
  type: ViolationType,
  message: string,
  severity: 'critical' | 'high' | 'medium' = 'high',
  context?: Record<string, unknown>
): ConstitutionViolation {
  const violation: ConstitutionViolation = {
    type,
    message,
    severity,
    timestamp: Date.now(),
    context,
  };
  
  violationLog.push(violation);
  
  // Log la violation
  if (severity === 'critical') {
    constitutionLogger.error(`🚨 VIOLATION CRITIQUE: ${message}`, violation);
  } else {
    constitutionLogger.warn(`⚠️ Violation: ${message}`, violation);
  }
  
  return violation;
}

/** Obtenir l'historique des violations */
export function getViolationLog(): readonly ConstitutionViolation[] {
  return [...violationLog];
}

/** Effacer le log (tests uniquement) */
export function clearViolationLog(): void {
  violationLog.length = 0;
}

// ============================================
// VALIDATION FUNCTIONS
// ============================================

/**
 * Valide qu'une action n'est pas interdite
 */
export function validateAction(action: string): ConstitutionViolation | null {
  if (isForbiddenAction(action)) {
    return createViolation(
      'SILENT_AUTOMATION',
      `Action interdite: "${action}"`,
      'critical',
      { action }
    );
  }
  return null;
}

/**
 * Valide qu'une écriture timeline est autorisée
 */
export function validateTimelineWrite(
  hasHumanValidation: boolean,
  source: string
): ConstitutionViolation | null {
  if (!CONSTITUTION.principles.humanInTheLoop) {
    return createViolation(
      'AUTO_DECISION',
      'Principes non chargés correctement',
      'critical'
    );
  }
  
  if (!hasHumanValidation) {
    return createViolation(
      'AUTO_DECISION',
      `Écriture timeline sans validation humaine (source: ${source})`,
      'critical',
      { source }
    );
  }
  
  return null;
}

/**
 * Valide qu'une décision agent n'est pas auto-appliquée
 */
export function validateAgentAction(
  agentId: string,
  actionType: 'suggest' | 'decide' | 'apply'
): ConstitutionViolation | null {
  if (actionType === 'decide' || actionType === 'apply') {
    return createViolation(
      'AGENT_DECISION',
      `Agent "${agentId}" a tenté de ${actionType} - interdit`,
      'critical',
      { agentId, actionType }
    );
  }
  return null;
}

/**
 * Valide qu'un rollback ne modifie pas la timeline
 */
export function validateRollback(
  modifiesTimeline: boolean,
  deletesEvents: boolean
): ConstitutionViolation | null {
  if (modifiesTimeline) {
    return createViolation(
      'TIMELINE_MODIFICATION',
      'Rollback a tenté de modifier la timeline',
      'critical',
      { modifiesTimeline }
    );
  }
  
  if (deletesEvents) {
    return createViolation(
      'TIMELINE_DELETE',
      'Rollback a tenté de supprimer des événements',
      'critical',
      { deletesEvents }
    );
  }
  
  return null;
}

/**
 * Valide qu'un seul preset est actif
 */
export function validatePresetCount(activePresets: number): ConstitutionViolation | null {
  if (activePresets > CONSTITUTION.limitations.maxSimultaneousPresets) {
    return createViolation(
      'MULTI_PRESET',
      `${activePresets} presets actifs - maximum ${CONSTITUTION.limitations.maxSimultaneousPresets}`,
      'medium',
      { activePresets, max: CONSTITUTION.limitations.maxSimultaneousPresets }
    );
  }
  return null;
}

/**
 * Valide qu'aucun prompt intrusif n'est affiché
 */
export function validatePrompt(isIntrusive: boolean): ConstitutionViolation | null {
  if (isIntrusive && CONSTITUTION.limitations.maxIntrusivePrompts === 0) {
    return createViolation(
      'INTRUSIVE_PROMPT',
      'Prompt intrusif détecté - interdit',
      'high'
    );
  }
  return null;
}

// ============================================
// GUARDS (Runtime Protection)
// ============================================

/**
 * Guard pour les écritures timeline
 * Bloque si non validé par l'humain
 */
export function guardTimelineWrite<T>(
  fn: () => T,
  humanValidated: boolean,
  source: string
): T | null {
  const violation = validateTimelineWrite(humanValidated, source);
  if (violation) {
    constitutionLogger.error('🛑 Écriture timeline bloquée', violation);
    return null;
  }
  return fn();
}

/**
 * Guard pour les actions agent
 * Bloque les décisions/applications automatiques
 */
export function guardAgentAction<T>(
  fn: () => T,
  agentId: string,
  actionType: 'suggest' | 'decide' | 'apply'
): T | null {
  const violation = validateAgentAction(agentId, actionType);
  if (violation) {
    constitutionLogger.error('🛑 Action agent bloquée', violation);
    return null;
  }
  return fn();
}

/**
 * Guard pour les rollbacks
 * Bloque les modifications de timeline
 */
export function guardRollback<T>(
  fn: () => T,
  modifiesTimeline: boolean,
  deletesEvents: boolean
): T | null {
  const violation = validateRollback(modifiesTimeline, deletesEvents);
  if (violation) {
    constitutionLogger.error('🛑 Rollback bloqué', violation);
    return null;
  }
  return fn();
}

// ============================================
// ASSERTIONS (Development)
// ============================================

/**
 * Assert que la constitution est respectée
 * Lance une erreur en dev, log en prod
 */
export function assertConstitution(
  condition: boolean,
  violationType: ViolationType,
  message: string
): void {
  if (!condition) {
    const violation = createViolation(violationType, message, 'critical');
    
    if (process.env.NODE_ENV === 'development') {
      throw new Error(`Constitution Violation: ${message}`);
    } else {
      constitutionLogger.error('Constitution assertion failed', violation);
    }
  }
}

/**
 * Assert humain dans la boucle
 */
export function assertHumanInLoop(hasHuman: boolean, context: string): void {
  assertConstitution(
    hasHuman,
    'AUTO_DECISION',
    `Humain requis pour: ${context}`
  );
}

/**
 * Assert timeline non modifiée
 */
export function assertTimelineImmutable(isModification: boolean, context: string): void {
  assertConstitution(
    !isModification,
    'TIMELINE_MODIFICATION',
    `Modification timeline interdite: ${context}`
  );
}

// ============================================
// AUDIT & REPORTING
// ============================================

/**
 * Générer un rapport de conformité
 */
export function generateComplianceReport(): {
  compliant: boolean;
  violations: ConstitutionViolation[];
  criticalCount: number;
  summary: string;
} {
  const violations = getViolationLog();
  const criticalCount = violations.filter((v) => v.severity === 'critical').length;
  
  return {
    compliant: criticalCount === 0,
    violations,
    criticalCount,
    summary: criticalCount === 0
      ? '✅ Système conforme à la constitution'
      : `🚨 ${criticalCount} violation(s) critique(s) détectée(s)`,
  };
}

/**
 * Afficher les lois de la constitution
 */
export function displayLaws(): void {
  constitutionLogger.info('📜 Les 5 Lois de CHE·NU:');
  CONSTITUTION_LAWS.forEach((law, i) => {
    constitutionLogger.info(`  ${i + 1}. ${law}`);
  });
}

// ============================================
// PATH VALIDATION
// ============================================

/** Types de chemins valides */
export type PathType = keyof typeof CONSTITUTION.paths;

/**
 * Valide qu'un chemin existe et retourne sa config
 */
export function getPath(pathType: PathType) {
  return CONSTITUTION.paths[pathType];
}

/**
 * Vérifie si une option est autorisée pour un chemin
 */
export function isOptionAllowed(pathType: PathType, option: string): boolean {
  const path = CONSTITUTION.paths[pathType];
  return path.options.includes(option);
}

/**
 * Vérifie si une action est restreinte pour un chemin
 */
export function isRestricted(pathType: PathType, action: string): boolean {
  const path = CONSTITUTION.paths[pathType];
  return path.restrictions.includes(action);
}

// ============================================
// EXPORTS
// ============================================

export {
  CONSTITUTION_LAWS,
  FORBIDDEN_ACTIONS,
};
