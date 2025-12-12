/* =====================================================
   CHE·NU — Phase Preset Defaults
   
   Default phase definitions and preset mappings for
   standard decision phases and construction phases.
   ===================================================== */

import {
  PhaseId,
  ConstructionPhaseId,
  AnyPhaseId,
  PhaseDefinition,
  PhasePreset,
  PhaseState,
  PhaseTransition,
} from './phasePreset.types';

// ─────────────────────────────────────────────────────
// STANDARD PHASE DEFINITIONS
// ─────────────────────────────────────────────────────

/**
 * Standard decision lifecycle phases.
 */
export const STANDARD_PHASES: PhaseDefinition[] = [
  {
    id: 'exploration',
    label: 'Exploration',
    labelI18n: { 'fr-CA': 'Exploration' },
    description: 'Initial research and discovery',
    descriptionI18n: { 'fr-CA': 'Recherche initiale et découverte' },
    icon: '🔮',
    color: '#8b5cf6',
    typicalDuration: { min: 1, max: 14 },
    order: 1,
    category: 'standard',
  },
  {
    id: 'analysis',
    label: 'Analysis',
    labelI18n: { 'fr-CA': 'Analyse' },
    description: 'Deep analysis and data review',
    descriptionI18n: { 'fr-CA': 'Analyse approfondie et revue des données' },
    icon: '📊',
    color: '#22c55e',
    typicalDuration: { min: 2, max: 21 },
    order: 2,
    category: 'standard',
  },
  {
    id: 'decision',
    label: 'Decision',
    labelI18n: { 'fr-CA': 'Décision' },
    description: 'Making the actual decision',
    descriptionI18n: { 'fr-CA': 'Prise de décision effective' },
    icon: '⚖️',
    color: '#f97316',
    typicalDuration: { min: 1, max: 7 },
    order: 3,
    category: 'standard',
  },
  {
    id: 'execution',
    label: 'Execution',
    labelI18n: { 'fr-CA': 'Exécution' },
    description: 'Implementing the decision',
    descriptionI18n: { 'fr-CA': 'Mise en œuvre de la décision' },
    icon: '⚡',
    color: '#3b82f6',
    typicalDuration: { min: 7, max: 90 },
    order: 4,
    category: 'standard',
  },
  {
    id: 'review',
    label: 'Review',
    labelI18n: { 'fr-CA': 'Revue' },
    description: 'Post-implementation review',
    descriptionI18n: { 'fr-CA': 'Revue post-implémentation' },
    icon: '🔍',
    color: '#eab308',
    typicalDuration: { min: 1, max: 14 },
    order: 5,
    category: 'standard',
  },
  {
    id: 'closure',
    label: 'Closure',
    labelI18n: { 'fr-CA': 'Clôture' },
    description: 'Final wrap-up and archiving',
    descriptionI18n: { 'fr-CA': 'Finalisation et archivage' },
    icon: '📦',
    color: '#6b7280',
    typicalDuration: { min: 1, max: 3 },
    order: 6,
    category: 'standard',
  },
];

// ─────────────────────────────────────────────────────
// CONSTRUCTION PHASE DEFINITIONS
// ─────────────────────────────────────────────────────

/**
 * Construction project phases (Quebec market).
 */
export const CONSTRUCTION_PHASES: PhaseDefinition[] = [
  {
    id: 'feasibility',
    label: 'Feasibility',
    labelI18n: { 'fr-CA': 'Faisabilité' },
    description: 'Feasibility study and initial assessment',
    descriptionI18n: { 'fr-CA': 'Étude de faisabilité et évaluation initiale' },
    icon: '🔬',
    color: '#8b5cf6',
    typicalDuration: { min: 14, max: 60 },
    order: 1,
    category: 'construction',
  },
  {
    id: 'design',
    label: 'Design',
    labelI18n: { 'fr-CA': 'Conception' },
    description: 'Architectural and engineering design',
    descriptionI18n: { 'fr-CA': 'Conception architecturale et ingénierie' },
    icon: '📐',
    color: '#ec4899',
    typicalDuration: { min: 30, max: 180 },
    order: 2,
    category: 'construction',
  },
  {
    id: 'permits',
    label: 'Permits',
    labelI18n: { 'fr-CA': 'Permis' },
    description: 'Permits and regulatory approvals',
    descriptionI18n: { 'fr-CA': 'Permis et approbations réglementaires (RBQ, CCQ)' },
    icon: '📋',
    color: '#f97316',
    typicalDuration: { min: 30, max: 120 },
    order: 3,
    category: 'construction',
  },
  {
    id: 'procurement',
    label: 'Procurement',
    labelI18n: { 'fr-CA': 'Approvisionnement' },
    description: 'Materials and contractor procurement',
    descriptionI18n: { 'fr-CA': 'Approvisionnement matériaux et sous-traitants' },
    icon: '🛒',
    color: '#22c55e',
    typicalDuration: { min: 14, max: 60 },
    order: 4,
    category: 'construction',
  },
  {
    id: 'construction',
    label: 'Construction',
    labelI18n: { 'fr-CA': 'Construction' },
    description: 'Active construction phase',
    descriptionI18n: { 'fr-CA': 'Phase de construction active' },
    icon: '🏗️',
    color: '#f59e0b',
    typicalDuration: { min: 90, max: 730 },
    order: 5,
    category: 'construction',
  },
  {
    id: 'commissioning',
    label: 'Commissioning',
    labelI18n: { 'fr-CA': 'Mise en service' },
    description: 'System testing and commissioning',
    descriptionI18n: { 'fr-CA': 'Tests des systèmes et mise en service' },
    icon: '🔧',
    color: '#3b82f6',
    typicalDuration: { min: 7, max: 30 },
    order: 6,
    category: 'construction',
  },
  {
    id: 'handover',
    label: 'Handover',
    labelI18n: { 'fr-CA': 'Livraison' },
    description: 'Project handover and documentation',
    descriptionI18n: { 'fr-CA': 'Livraison du projet et documentation' },
    icon: '🔑',
    color: '#10b981',
    typicalDuration: { min: 7, max: 30 },
    order: 7,
    category: 'construction',
  },
];

/**
 * All phase definitions.
 */
export const ALL_PHASES: PhaseDefinition[] = [
  ...STANDARD_PHASES,
  ...CONSTRUCTION_PHASES,
];

// ─────────────────────────────────────────────────────
// CORE PHASE → PRESET MAPPINGS
// ─────────────────────────────────────────────────────

/**
 * Standard phase to preset mappings.
 */
export const CORE_PHASE_PRESETS: PhasePreset[] = [
  {
    phase: 'exploration',
    presetId: 'exploration',
    priority: 50,
    reason: 'Rich interface for discovery and research',
    reasonI18n: { 'fr-CA': 'Interface riche pour découverte et recherche' },
  },
  {
    phase: 'analysis',
    presetId: 'audit',
    priority: 50,
    reason: 'Audit mode for data review and comparison',
    reasonI18n: { 'fr-CA': 'Mode audit pour revue et comparaison des données' },
  },
  {
    phase: 'decision',
    presetId: 'focus',
    priority: 60,
    reason: 'Focused interface for critical decisions',
    reasonI18n: { 'fr-CA': 'Interface focalisée pour décisions critiques' },
  },
  {
    phase: 'execution',
    presetId: 'focus',
    priority: 50,
    reason: 'Minimal distractions during execution',
    reasonI18n: { 'fr-CA': 'Distractions minimales pendant l\'exécution' },
  },
  {
    phase: 'review',
    presetId: 'audit',
    priority: 50,
    reason: 'Audit mode for post-implementation review',
    reasonI18n: { 'fr-CA': 'Mode audit pour revue post-implémentation' },
  },
  {
    phase: 'closure',
    presetId: 'minimal',
    priority: 40,
    reason: 'Minimal interface for archiving tasks',
    reasonI18n: { 'fr-CA': 'Interface minimale pour tâches d\'archivage' },
  },
];

/**
 * Construction phase to preset mappings.
 */
export const CONSTRUCTION_PHASE_PRESETS: PhasePreset[] = [
  {
    phase: 'feasibility',
    presetId: 'exploration',
    priority: 50,
    reason: 'Research and discovery for feasibility study',
    reasonI18n: { 'fr-CA': 'Recherche et découverte pour étude de faisabilité' },
  },
  {
    phase: 'design',
    presetId: 'exploration',
    priority: 50,
    reason: 'Creative exploration for design phase',
    reasonI18n: { 'fr-CA': 'Exploration créative pour phase de conception' },
  },
  {
    phase: 'permits',
    presetId: 'audit',
    priority: 60,
    reason: 'Compliance review for permits (RBQ, CCQ)',
    reasonI18n: { 'fr-CA': 'Revue conformité pour permis (RBQ, CCQ)' },
  },
  {
    phase: 'procurement',
    presetId: 'audit',
    priority: 50,
    reason: 'Comparison and analysis for procurement',
    reasonI18n: { 'fr-CA': 'Comparaison et analyse pour approvisionnement' },
  },
  {
    phase: 'construction',
    presetId: 'construction-site',
    priority: 70,
    reason: 'Mobile-optimized for on-site work',
    reasonI18n: { 'fr-CA': 'Optimisé mobile pour travail sur chantier' },
  },
  {
    phase: 'commissioning',
    presetId: 'audit',
    priority: 50,
    reason: 'Checklist and verification mode',
    reasonI18n: { 'fr-CA': 'Mode liste de contrôle et vérification' },
  },
  {
    phase: 'handover',
    presetId: 'client-presentation',
    priority: 60,
    reason: 'Professional presentation for handover',
    reasonI18n: { 'fr-CA': 'Présentation professionnelle pour livraison' },
  },
];

/**
 * All phase to preset mappings.
 */
export const ALL_PHASE_PRESETS: PhasePreset[] = [
  ...CORE_PHASE_PRESETS,
  ...CONSTRUCTION_PHASE_PRESETS,
];

// ─────────────────────────────────────────────────────
// DEFAULT STATE
// ─────────────────────────────────────────────────────

/**
 * Default phase state.
 */
export const DEFAULT_PHASE_STATE: PhaseState = {
  currentPhase: 'exploration',
  phaseStartedAt: Date.now(),
  transitions: [],
  progress: {},
};

// ─────────────────────────────────────────────────────
// FACTORY FUNCTIONS
// ─────────────────────────────────────────────────────

/**
 * Get phase definition by ID.
 */
export function getPhaseById(phaseId: AnyPhaseId): PhaseDefinition | undefined {
  return ALL_PHASES.find(p => p.id === phaseId);
}

/**
 * Get preset mapping for a phase.
 */
export function getPresetForPhase(
  phaseId: AnyPhaseId,
  phasePresets: PhasePreset[] = ALL_PHASE_PRESETS
): PhasePreset | undefined {
  return phasePresets.find(p => p.phase === phaseId);
}

/**
 * Get phases by category.
 */
export function getPhasesByCategory(
  category: 'standard' | 'construction'
): PhaseDefinition[] {
  return ALL_PHASES.filter(p => p.category === category);
}

/**
 * Get next phase in lifecycle.
 */
export function getNextPhase(
  currentPhaseId: AnyPhaseId,
  category: 'standard' | 'construction' = 'standard'
): PhaseDefinition | undefined {
  const phases = getPhasesByCategory(category);
  const currentPhase = phases.find(p => p.id === currentPhaseId);
  if (!currentPhase) return undefined;
  
  return phases.find(p => p.order === currentPhase.order + 1);
}

/**
 * Get previous phase in lifecycle.
 */
export function getPreviousPhase(
  currentPhaseId: AnyPhaseId,
  category: 'standard' | 'construction' = 'standard'
): PhaseDefinition | undefined {
  const phases = getPhasesByCategory(category);
  const currentPhase = phases.find(p => p.id === currentPhaseId);
  if (!currentPhase) return undefined;
  
  return phases.find(p => p.order === currentPhase.order - 1);
}

/**
 * Create a phase transition.
 */
export function createPhaseTransition(
  from: AnyPhaseId | null,
  to: AnyPhaseId,
  triggeredBy?: string,
  notes?: string
): PhaseTransition {
  return {
    from,
    to,
    timestamp: Date.now(),
    triggeredBy,
    notes,
  };
}

/**
 * Calculate phase duration from state.
 */
export function calculatePhaseDuration(state: PhaseState): number {
  return Date.now() - state.phaseStartedAt;
}

/**
 * Check if phase is overdue based on typical duration.
 */
export function isPhaseOverdue(
  state: PhaseState,
  phaseId?: AnyPhaseId
): boolean {
  const targetPhase = phaseId || state.currentPhase;
  const definition = getPhaseById(targetPhase);
  
  if (!definition?.typicalDuration) return false;
  
  const durationDays = calculatePhaseDuration(state) / (1000 * 60 * 60 * 24);
  return durationDays > definition.typicalDuration.max;
}
