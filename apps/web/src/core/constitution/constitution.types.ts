/* =========================================
   CHE·NU — CONSTITUTION TYPES
   
   Types TypeScript pour la constitution fondamentale.
   Ces types sont IMMUABLES et définissent les règles
   que le système DOIT respecter.
   
   ⚖️ "L'humain décide, le système trace"
   ========================================= */

// ============================================
// PRINCIPES FONDAMENTAUX
// ============================================

/** Les 5 principes inviolables de CHE·NU */
export interface ConstitutionPrinciples {
  /** L'humain est toujours dans la boucle de décision */
  humanInTheLoop: true;
  /** La timeline est la seule source de vérité */
  timelineIsTruth: true;
  /** Aucune décision automatique */
  noAutoDecision: true;
  /** Les agents conseillent uniquement, ne décident jamais */
  agentsAdviseOnly: true;
  /** Le rollback est une réinterprétation, pas une réécriture */
  rollbackIsInterpretation: true;
}

// ============================================
// TIMELINE
// ============================================

/** Configuration de la timeline */
export interface TimelineConfig {
  /** Mode d'écriture - append-only uniquement */
  mode: 'append-only';
  /** La timeline ne peut jamais être modifiée */
  modifiable: false;
  /** Source unique de vérité */
  sourceOfTruth: true;
  /** Condition d'écriture */
  writeCondition: 'explicit_human_validation';
}

// ============================================
// PATHS (Chemins de Navigation)
// ============================================

/** Mode de sauvegarde */
export type SaveMode = 'automatic' | 'explicit' | 'selective' | 'mandatory';

/** Configuration de sauvegarde */
export interface SaveConfig {
  mode: SaveMode;
  conditions: string[];
}

/** Définition d'un chemin */
export interface PathDefinition {
  /** Intention du chemin */
  intent: string;
  /** Point d'entrée */
  entry: string;
  /** Options disponibles */
  options: string[];
  /** Stratégie de rollback */
  rollback: string;
  /** Configuration de sauvegarde */
  save: SaveConfig;
  /** Restrictions */
  restrictions: string[];
}

/** Les 4 chemins primaires */
export interface ConstitutionPaths {
  /** Reprendre le contexte précédent */
  resume: PathDefinition;
  /** Démarrer un nouvel objectif */
  newObjective: PathDefinition;
  /** Explorer sans engagement */
  exploration: PathDefinition;
  /** Prendre une décision explicite */
  decision: PathDefinition;
}

// ============================================
// RÈGLES D'OPTIONS
// ============================================

/** Règles des options */
export interface OptionsRules {
  /** Actions autorisées */
  allowed: readonly [
    'change_preset',
    'save_idea',
    'continue_or_return'
  ];
  /** Actions strictement interdites */
  forbidden: readonly [
    'silent_automation',
    'implicit_decision',
    'unexplained_optimization'
  ];
}

// ============================================
// ROLLBACK
// ============================================

/** Configuration du rollback */
export interface RollbackConfig {
  /** Stratégie: réinterpréter, jamais réécrire */
  strategy: 'reinterpret_state';
  /** Le rollback n'écrit JAMAIS dans la timeline */
  writesTimeline: false;
  /** Actions autorisées */
  allowedActions: readonly [
    'change_active_pointer',
    'reopen_previous_context'
  ];
  /** Actions strictement interdites */
  forbiddenActions: readonly [
    'delete_event',
    'rewrite_timeline',
    'mask_history'
  ];
}

// ============================================
// PERSISTENCE DE SESSION
// ============================================

/** Configuration de persistence */
export interface SessionPersistence {
  /** Moments de sauvegarde */
  saveOn: readonly ['explicit_validation', 'session_end'];
  /** Données à persister */
  store: readonly [
    'active_preset',
    'active_sphere',
    'last_valid_objective',
    'timeline_pointer'
  ];
  /** Données à ignorer */
  ignore: readonly [
    'visual_state',
    'unvalidated_hesitation',
    'temporary_exploration'
  ];
}

// ============================================
// LIMITATIONS
// ============================================

/** Limitations système */
export interface ConstitutionLimitations {
  /** Maximum 4 chemins primaires */
  maxPrimaryPaths: 4;
  /** Aucune suppression destructive autorisée */
  allowUndoDestructive: false;
  /** Les agents ne peuvent JAMAIS décider */
  allowAgentDecision: false;
  /** Un seul preset actif à la fois */
  maxSimultaneousPresets: 1;
  /** Zéro prompt intrusif */
  maxIntrusivePrompts: 0;
}

// ============================================
// CRITÈRES DE SUCCÈS
// ============================================

/** Critères de succès UX */
export interface SuccessCriteria {
  /** L'utilisateur comprend toujours sa position */
  userUnderstandsPosition: true;
  /** L'exploration est sans risque */
  safeExploration: true;
  /** Quitter l'app est sans stress */
  stressFreeExit: true;
  /** Reprendre est facile */
  easyResumption: true;
}

// ============================================
// CONSTITUTION COMPLÈTE
// ============================================

/** La Constitution CHE·NU v1.0 */
export interface CheNuConstitution {
  cheNuVersion: 'foundation-1.0';
  principles: ConstitutionPrinciples;
  timeline: TimelineConfig;
  paths: ConstitutionPaths;
  optionsRules: OptionsRules;
  rollback: RollbackConfig;
  sessionPersistence: SessionPersistence;
  limitations: ConstitutionLimitations;
  successCriteria: SuccessCriteria;
}

// ============================================
// VIOLATIONS
// ============================================

/** Types de violation de la constitution */
export type ViolationType =
  | 'TIMELINE_MODIFICATION'
  | 'AUTO_DECISION'
  | 'AGENT_DECISION'
  | 'SILENT_AUTOMATION'
  | 'IMPLICIT_DECISION'
  | 'TIMELINE_DELETE'
  | 'HISTORY_MASK'
  | 'INTRUSIVE_PROMPT'
  | 'MULTI_PRESET'
  | 'DESTRUCTIVE_UNDO';

/** Une violation détectée */
export interface ConstitutionViolation {
  type: ViolationType;
  message: string;
  severity: 'critical' | 'high' | 'medium';
  timestamp: number;
  context?: Record<string, unknown>;
}

// ============================================
// CONSTANTES IMMUABLES
// ============================================

/** Les principes sous forme de lois */
export const CONSTITUTION_LAWS = [
  'L\'humain est toujours dans la boucle',
  'La timeline est immuable et append-only',
  'Aucune décision automatique',
  'Les agents conseillent, ne décident jamais',
  'Le rollback réinterprète, ne réécrit jamais',
] as const;

/** Actions interdites - JAMAIS autorisées */
export const FORBIDDEN_ACTIONS = [
  'silent_automation',
  'implicit_decision',
  'unexplained_optimization',
  'delete_event',
  'rewrite_timeline',
  'mask_history',
] as const;

/** Vérifier si une action est interdite */
export function isForbiddenAction(action: string): boolean {
  return (FORBIDDEN_ACTIONS as readonly string[]).includes(action);
}

// ============================================
// TYPE GUARDS
// ============================================

/** Vérifie si un objet est une violation */
export function isViolation(obj: unknown): obj is ConstitutionViolation {
  if (!obj || typeof obj !== 'object') return false;
  const v = obj as Record<string, unknown>;
  return (
    typeof v.type === 'string' &&
    typeof v.message === 'string' &&
    typeof v.severity === 'string' &&
    typeof v.timestamp === 'number'
  );
}

/** Vérifie si les principes sont respectés */
export function validatePrinciples(principles: unknown): principles is ConstitutionPrinciples {
  if (!principles || typeof principles !== 'object') return false;
  const p = principles as Record<string, unknown>;
  return (
    p.humanInTheLoop === true &&
    p.timelineIsTruth === true &&
    p.noAutoDecision === true &&
    p.agentsAdviseOnly === true &&
    p.rollbackIsInterpretation === true
  );
}
