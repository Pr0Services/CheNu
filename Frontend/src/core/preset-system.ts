/* =========================================================
   CHE·NU — PRESET SYSTEM (SINGLE SOURCE OF TRUTH)
   
   Ce fichier est LA référence unique pour le système de 
   presets. Toutes les autres implémentations (presets/,
   roles/, phases/) doivent s'aligner sur cette définition.
   ========================================================= */

// ─────────────────────────────────────────────────────────
// 1. TYPES DE BASE
// ─────────────────────────────────────────────────────────

/**
 * Niveau de densité de l'interface.
 */
export type DensityLevel = 'minimal' | 'balanced' | 'rich';

/**
 * Configuration XR de base.
 */
export interface XRPersonalization {
  /** XR activé ou non */
  enabled: boolean;
  /** Ambiance visuelle */
  ambiance: 'calm' | 'focused' | 'cosmic';
}

/**
 * Configuration de personnalisation globale.
 */
export interface CheNuPersonalization {
  /** Version du schéma */
  version: number;
  /** Thème global actif */
  themeGlobal: string;
  /** Niveau de densité */
  density: DensityLevel;
  /** Configuration XR */
  xr: XRPersonalization;
}

// ─────────────────────────────────────────────────────────
// 2. PRESET
// ─────────────────────────────────────────────────────────

/**
 * Définition d'un preset.
 * Un preset est un PATCH, jamais un overwrite complet.
 */
export interface CheNuPreset {
  /** Identifiant unique */
  id: string;
  /** Libellé d'affichage */
  label: string;
  /** Description de l'intention */
  description: string;
  /** Patch de personnalisation à appliquer */
  personalizationPatch: Partial<CheNuPersonalization>;
}

// ─────────────────────────────────────────────────────────
// 3. CORE PRESETS (INTENTIONS)
// ─────────────────────────────────────────────────────────

/**
 * Presets de base alignés sur les intentions utilisateur.
 */
export const PRESETS: CheNuPreset[] = [
  {
    id: 'focus',
    label: 'Focus',
    description: 'Minimal distractions, execution clarity.',
    personalizationPatch: {
      density: 'minimal',
      xr: { enabled: false, ambiance: 'focused' },
    },
  },
  {
    id: 'exploration',
    label: 'Exploration',
    description: 'Discover, connect, explore context.',
    personalizationPatch: {
      density: 'rich',
      xr: { enabled: true, ambiance: 'cosmic' },
    },
  },
  {
    id: 'audit',
    label: 'Audit / Review',
    description: 'Traceability, timelines, comparisons.',
    personalizationPatch: {
      density: 'balanced',
      xr: { enabled: true, ambiance: 'calm' },
    },
  },
  {
    id: 'meeting',
    label: 'Meeting',
    description: 'Structured collaboration space.',
    personalizationPatch: {
      density: 'balanced',
      xr: { enabled: true, ambiance: 'focused' },
    },
  },
  {
    id: 'minimal',
    label: 'Minimal',
    description: 'Read-only, calm, low cognitive load.',
    personalizationPatch: {
      density: 'minimal',
      xr: { enabled: false, ambiance: 'calm' },
    },
  },
];

// ─────────────────────────────────────────────────────────
// 4. ROLES
// ─────────────────────────────────────────────────────────

/**
 * Définition d'un rôle utilisateur.
 */
export interface UserRole {
  /** Identifiant unique */
  id: string;
  /** Libellé */
  label: string;
  /** Preset par défaut pour ce rôle */
  defaultPresetId: string;
}

/**
 * Rôles de base.
 */
export const ROLES: UserRole[] = [
  { id: 'strategist', label: 'Strategist', defaultPresetId: 'exploration' },
  { id: 'operator', label: 'Operator', defaultPresetId: 'focus' },
  { id: 'analyst', label: 'Analyst', defaultPresetId: 'audit' },
  { id: 'creative', label: 'Creative', defaultPresetId: 'exploration' },
  { id: 'facilitator', label: 'Facilitator', defaultPresetId: 'meeting' },
];

// ─────────────────────────────────────────────────────────
// 5. PHASES
// ─────────────────────────────────────────────────────────

/**
 * Identifiants de phases de projet.
 */
export type PhaseId =
  | 'exploration'
  | 'analysis'
  | 'decision'
  | 'execution'
  | 'review'
  | 'closure';

/**
 * Mapping phase → preset.
 */
export const PHASE_PRESETS: Record<PhaseId, string> = {
  exploration: 'exploration',
  analysis: 'audit',
  decision: 'focus',
  execution: 'focus',
  review: 'audit',
  closure: 'minimal',
};

// ─────────────────────────────────────────────────────────
// 6. PROJECT PRESETS
// ─────────────────────────────────────────────────────────

/**
 * Association projet → preset.
 */
export interface ProjectPreset {
  /** Identifiant du projet */
  projectId: string;
  /** Preset associé */
  presetId: string;
}

/**
 * Exemples de presets par projet.
 */
export const PROJECT_PRESETS: ProjectPreset[] = [
  { projectId: 'legal', presetId: 'audit' },
  { projectId: 'r_and_d', presetId: 'exploration' },
  { projectId: 'client_execution', presetId: 'focus' },
];

// ─────────────────────────────────────────────────────────
// 7. CONTEXTE DE RÉSOLUTION
// ─────────────────────────────────────────────────────────

/**
 * Contexte pour résoudre le preset suggéré.
 */
export interface PresetContext {
  /** Preset sélectionné manuellement (priorité max) */
  manualPresetId?: string;
  /** Projet actif */
  projectId?: string;
  /** Phase actuelle */
  phase?: PhaseId;
  /** Rôle de l'utilisateur */
  roleId?: string;
}

// ─────────────────────────────────────────────────────────
// 8. LOGIQUE DE RÉSOLUTION
// ─────────────────────────────────────────────────────────

/**
 * Résout le preset suggéré selon le contexte.
 * 
 * ORDRE DE PRIORITÉ:
 * 1. Manuel (choix explicite de l'utilisateur)
 * 2. Projet (si un projet est actif)
 * 3. Phase (si une phase est active)
 * 4. Rôle (preset par défaut du rôle)
 * 5. Aucun (undefined)
 * 
 * @param context - Contexte de résolution
 * @returns Le preset suggéré, ou undefined
 */
export function resolveSuggestedPreset(
  context: PresetContext
): CheNuPreset | undefined {
  const findPreset = (id?: string) => PRESETS.find((p) => p.id === id);

  // PRIORITÉ 1 — MANUEL
  if (context.manualPresetId) {
    return findPreset(context.manualPresetId);
  }

  // PRIORITÉ 2 — PROJET
  const project = PROJECT_PRESETS.find((p) => p.projectId === context.projectId);
  if (project) {
    return findPreset(project.presetId);
  }

  // PRIORITÉ 3 — PHASE
  if (context.phase) {
    return findPreset(PHASE_PRESETS[context.phase]);
  }

  // PRIORITÉ 4 — RÔLE
  const role = ROLES.find((r) => r.id === context.roleId);
  if (role) {
    return findPreset(role.defaultPresetId);
  }

  // PRIORITÉ 5 — RIEN
  return undefined;
}

// ─────────────────────────────────────────────────────────
// 9. FONCTIONS UTILITAIRES
// ─────────────────────────────────────────────────────────

/**
 * Trouve un preset par son ID.
 */
export function getPresetById(id: string): CheNuPreset | undefined {
  return PRESETS.find((p) => p.id === id);
}

/**
 * Trouve un rôle par son ID.
 */
export function getRoleById(id: string): UserRole | undefined {
  return ROLES.find((r) => r.id === id);
}

/**
 * Obtient le preset pour une phase.
 */
export function getPresetForPhase(phase: PhaseId): CheNuPreset | undefined {
  return getPresetById(PHASE_PRESETS[phase]);
}

/**
 * Obtient le preset par défaut pour un rôle.
 */
export function getPresetForRole(roleId: string): CheNuPreset | undefined {
  const role = getRoleById(roleId);
  if (!role) return undefined;
  return getPresetById(role.defaultPresetId);
}

/**
 * Applique un patch de personnalisation sur une configuration existante.
 */
export function applyPresetPatch(
  current: CheNuPersonalization,
  preset: CheNuPreset
): CheNuPersonalization {
  const patch = preset.personalizationPatch;
  
  return {
    ...current,
    ...patch,
    xr: patch.xr
      ? { ...current.xr, ...patch.xr }
      : current.xr,
  };
}

// ─────────────────────────────────────────────────────────
// 10. RÈGLES D'OR (DOCUMENTÉES)
// ─────────────────────────────────────────────────────────

/**
 * RÈGLES D'OR DU SYSTÈME DE PRESETS:
 * 
 * 1. Aucun preset ne s'applique automatiquement
 *    → L'utilisateur doit toujours valider
 * 
 * 2. Tous les presets sont des PATCHS, jamais un overwrite
 *    → On modifie partiellement, on ne remplace jamais tout
 * 
 * 3. L'humain valide toujours
 *    → Les suggestions sont des suggestions, pas des actions
 * 
 * 4. Le preset le plus spécifique gagne
 *    → Manuel > Projet > Phase > Rôle > Défaut
 * 
 * 5. Tout est explicable et traçable
 *    → On peut toujours expliquer pourquoi un preset est suggéré
 */
export const GOLDEN_RULES = [
  'Aucun preset ne s\'applique automatiquement',
  'Tous les presets sont des PATCHS, jamais un overwrite',
  'L\'humain valide toujours',
  'Le preset le plus spécifique gagne',
  'Tout est explicable et traçable',
] as const;
