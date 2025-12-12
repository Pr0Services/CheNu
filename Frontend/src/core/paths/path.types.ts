/* =========================================
   CHE·NU — SYSTÈME DE CHEMINS (PATHS)
   
   Implémentation du manifeste directionnel.
   
   📜 Un chemin est une suite d'états intentionnels validés.
   📜 Un utilisateur navigue dans des CHEMINS d'intention,
      pas dans des écrans.
   ========================================= */

// ============================================
// CHEMINS PRIMAIRES (4 maximum - par design)
// ============================================

/**
 * Les 4 chemins primaires de CHE·NU
 * LIMITATION VOLONTAIRE: Jamais plus de 4
 */
export type PathType = 
  | 'reprise'      // A - "Je reviens continuer"
  | 'objectif'     // B - "Je commence quelque chose"
  | 'exploration'  // C - "Je réfléchis / je découvre"
  | 'decision';    // D - "Je tranche"

/**
 * Configuration d'un chemin
 */
export interface PathConfig {
  /** Identifiant unique du chemin */
  id: PathType;
  /** Intention humaine associée */
  intention: string;
  /** Description courte */
  description: string;
  /** Preset par défaut pour ce chemin */
  defaultPreset: string;
  /** Options autorisées */
  allowedOptions: PathOption[];
  /** Interdictions */
  forbidden: string[];
  /** Peut écrire dans la timeline */
  canWriteTimeline: boolean;
  /** Nécessite validation explicite */
  requiresValidation: boolean;
}

/**
 * Les 4 chemins définis
 */
export const PATHS: Record<PathType, PathConfig> = {
  reprise: {
    id: 'reprise',
    intention: 'Je reviens continuer',
    description: 'Récupération du dernier contexte valide',
    defaultPreset: 'focus',
    allowedOptions: ['continuer', 'changerPreset', 'changerSphere'],
    forbidden: ['nouvelleDecision', 'suggestionIntrusive'],
    canWriteTimeline: false,
    requiresValidation: false,
  },
  objectif: {
    id: 'objectif',
    intention: 'Je commence quelque chose',
    description: 'Création d\'un nouvel objectif',
    defaultPreset: 'focus',
    allowedOptions: ['choixSphere', 'choixPreset', 'estimationDuree'],
    forbidden: ['creationImplicite', 'ecritureAutomatique'],
    canWriteTimeline: true,
    requiresValidation: true,
  },
  exploration: {
    id: 'exploration',
    intention: 'Je réfléchis / je découvre',
    description: 'Navigation libre et découverte',
    defaultPreset: 'exploration',
    allowedOptions: ['priseNotes', 'basculeFocus', 'marquageIdee'],
    forbidden: ['ecritureAutomatique'],
    canWriteTimeline: false, // Sauf éléments marqués
    requiresValidation: false,
  },
  decision: {
    id: 'decision',
    intention: 'Je tranche',
    description: 'Prise de décision explicite',
    defaultPreset: 'audit',
    allowedOptions: ['voirContexte', 'demanderAnalyse', 'comparerOptions'],
    forbidden: ['suppressionDecision'],
    canWriteTimeline: true,
    requiresValidation: true,
  },
};

// ============================================
// OPTIONS DE CHEMIN
// ============================================

/**
 * Options possibles dans un chemin
 * RÈGLE: Toute option répond à une question claire et unique
 */
export type PathOption =
  // Reprise
  | 'continuer'
  | 'changerPreset'
  | 'changerSphere'
  // Objectif
  | 'choixSphere'
  | 'choixPreset'
  | 'estimationDuree'
  // Exploration
  | 'priseNotes'
  | 'basculeFocus'
  | 'marquageIdee'
  // Décision
  | 'voirContexte'
  | 'demanderAnalyse'
  | 'comparerOptions';

/**
 * Configuration d'une option
 */
export interface OptionConfig {
  id: PathOption;
  question: string;
  description: string;
  requiresValidation: boolean;
}

/**
 * Options définies avec leurs questions
 */
export const OPTIONS: Record<PathOption, OptionConfig> = {
  continuer: {
    id: 'continuer',
    question: 'Continuer où vous étiez ?',
    description: 'Reprendre le travail en cours',
    requiresValidation: false,
  },
  changerPreset: {
    id: 'changerPreset',
    question: 'Changer de mode ?',
    description: 'Modifier le preset actif',
    requiresValidation: false,
  },
  changerSphere: {
    id: 'changerSphere',
    question: 'Changer de domaine ?',
    description: 'Basculer vers une autre sphère',
    requiresValidation: false,
  },
  choixSphere: {
    id: 'choixSphere',
    question: 'Dans quel domaine ?',
    description: 'Sélectionner la sphère concernée',
    requiresValidation: false,
  },
  choixPreset: {
    id: 'choixPreset',
    question: 'Quel mode de travail ?',
    description: 'Choisir le preset adapté',
    requiresValidation: false,
  },
  estimationDuree: {
    id: 'estimationDuree',
    question: 'Combien de temps ?',
    description: 'Estimer la durée de la tâche',
    requiresValidation: false,
  },
  priseNotes: {
    id: 'priseNotes',
    question: 'Noter cette idée ?',
    description: 'Capturer une réflexion',
    requiresValidation: false,
  },
  basculeFocus: {
    id: 'basculeFocus',
    question: 'Passer en mode focus ?',
    description: 'Concentrer l\'attention',
    requiresValidation: false,
  },
  marquageIdee: {
    id: 'marquageIdee',
    question: 'Marquer comme important ?',
    description: 'Sauvegarder dans la timeline',
    requiresValidation: true,
  },
  voirContexte: {
    id: 'voirContexte',
    question: 'Voir le contexte ?',
    description: 'Afficher les informations pertinentes',
    requiresValidation: false,
  },
  demanderAnalyse: {
    id: 'demanderAnalyse',
    question: 'Demander une analyse ?',
    description: 'Consulter les agents pour avis',
    requiresValidation: false,
  },
  comparerOptions: {
    id: 'comparerOptions',
    question: 'Comparer les options ?',
    description: 'Voir les alternatives côte à côte',
    requiresValidation: false,
  },
};

// ============================================
// ÉTAT DU CHEMIN
// ============================================

/**
 * État actuel dans un chemin
 */
export interface PathState {
  /** Chemin actif */
  current: PathType;
  /** Timestamp d'entrée dans le chemin */
  enteredAt: number;
  /** Option en cours */
  activeOption?: PathOption;
  /** Données temporaires (non sauvegardées) */
  scratch: PathScratch;
  /** Peut reculer */
  canRetreat: boolean;
  /** Historique des étapes dans ce chemin */
  steps: PathStep[];
}

/**
 * Données temporaires d'exploration
 * NON sauvegardées automatiquement
 */
export interface PathScratch {
  notes: string[];
  ideasMarked: string[];
  explorationHistory: string[];
}

/**
 * Une étape dans un chemin
 */
export interface PathStep {
  option: PathOption;
  timestamp: number;
  validated: boolean;
  data?: unknown;
}

// ============================================
// INTENTION
// ============================================

/**
 * Une intention utilisateur
 * Doit être exprimable en une phrase simple
 */
export interface UserIntention {
  /** Phrase d'intention */
  phrase: string;
  /** Chemin correspondant */
  path: PathType;
  /** Timestamp */
  timestamp: number;
  /** Contexte (sphère, preset, etc.) */
  context?: IntentionContext;
}

export interface IntentionContext {
  sphere?: string;
  preset?: string;
  objective?: string;
}

/**
 * Mapper une phrase à un chemin
 */
export function parseIntention(phrase: string): PathType {
  const lower = phrase.toLowerCase();
  
  if (lower.includes('revenir') || lower.includes('continuer') || lower.includes('reprendre')) {
    return 'reprise';
  }
  if (lower.includes('commencer') || lower.includes('nouveau') || lower.includes('créer')) {
    return 'objectif';
  }
  if (lower.includes('explorer') || lower.includes('découvrir') || lower.includes('réfléchir')) {
    return 'exploration';
  }
  if (lower.includes('décider') || lower.includes('trancher') || lower.includes('choisir')) {
    return 'decision';
  }
  
  // Par défaut: exploration (le plus sûr)
  return 'exploration';
}

// ============================================
// RECUL (ROLLBACK)
// ============================================

/**
 * Configuration du recul
 * PRINCIPE: On ne supprime jamais, on repositionne
 */
export interface RetreatConfig {
  /** Point de lecture cible */
  targetTimestamp: number;
  /** Raison du recul */
  reason?: string;
  /** Préserver les notes d'exploration */
  preserveNotes: boolean;
}

/**
 * Règles de recul par chemin
 */
export const RETREAT_RULES: Record<PathType, RetreatRule> = {
  reprise: {
    target: 'neutral', // État neutre initial
    preserveHistory: true,
    writesToTimeline: false,
  },
  objectif: {
    target: 'neutral', // Annuler avant validation
    preserveHistory: true,
    writesToTimeline: false,
  },
  exploration: {
    target: 'lastStable', // Dernier état stable
    preserveHistory: true,
    writesToTimeline: false,
  },
  decision: {
    target: 'previousContext', // Contexte précédent
    preserveHistory: true,
    writesToTimeline: false, // MAIS la décision reste inscrite
  },
};

export interface RetreatRule {
  target: 'neutral' | 'lastStable' | 'previousContext';
  preserveHistory: boolean;
  writesToTimeline: boolean;
}

// ============================================
// VALIDATION
// ============================================

/**
 * Validation humaine requise
 */
export interface ValidationRequest {
  /** Type de validation */
  type: 'decision' | 'objective' | 'mark';
  /** Description de ce qui sera validé */
  description: string;
  /** Données à valider */
  data: unknown;
  /** Chemin source */
  path: PathType;
  /** Timestamp de la demande */
  requestedAt: number;
}

/**
 * Résultat de validation
 */
export interface ValidationResult {
  /** Validé ou non */
  validated: boolean;
  /** Par l'utilisateur */
  validatedBy: 'user';
  /** Timestamp */
  timestamp: number;
  /** Peut être écrit dans timeline */
  canWriteToTimeline: boolean;
}

// ============================================
// HELPERS
// ============================================

/**
 * Vérifier si un chemin peut écrire dans la timeline
 */
export function canWriteToTimeline(path: PathType): boolean {
  return PATHS[path].canWriteTimeline;
}

/**
 * Obtenir les options autorisées pour un chemin
 */
export function getAllowedOptions(path: PathType): PathOption[] {
  return PATHS[path].allowedOptions;
}

/**
 * Vérifier si une option nécessite validation
 */
export function requiresValidation(option: PathOption): boolean {
  return OPTIONS[option].requiresValidation;
}

/**
 * Obtenir la question d'une option
 */
export function getOptionQuestion(option: PathOption): string {
  return OPTIONS[option].question;
}

// ============================================
// EXPORT DES LOIS
// ============================================

export const PATH_LAWS = [
  'Timeline = Vérité Absolue (append-only)',
  'Validation Humaine Obligatoire',
  'Recul = Repositionnement (jamais suppression)',
  '4 Chemins Maximum (ABCD)',
  'Humain > Système, Toujours',
] as const;

export type PathLaw = typeof PATH_LAWS[number];
