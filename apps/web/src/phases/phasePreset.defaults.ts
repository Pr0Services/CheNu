/* =====================================================
   CHE·NU — Phase Preset Defaults
   
   Default phase definitions and preset mappings.
   ===================================================== */

import {
  PhaseDefinition,
  PhasePreset,
  PhaseState,
  AllPhaseId,
} from './phasePreset.types';

// ─────────────────────────────────────────────────────
// STANDARD PHASE DEFINITIONS
// ─────────────────────────────────────────────────────

/**
 * Standard project phases.
 */
export const STANDARD_PHASES: PhaseDefinition[] = [
  {
    id: 'exploration',
    label: 'Exploration',
    labelI18n: { 'fr-CA': 'Exploration' },
    description: 'Initial discovery, ideation and brainstorming.',
    descriptionI18n: { 'fr-CA': 'Découverte initiale, idéation et remue-méninges.' },
    icon: '🔮',
    color: '#8b5cf6',
    order: 1,
    category: 'standard',
  },
  {
    id: 'analysis',
    label: 'Analysis',
    labelI18n: { 'fr-CA': 'Analyse' },
    description: 'Deep research, data gathering and evaluation.',
    descriptionI18n: { 'fr-CA': 'Recherche approfondie, collecte de données et évaluation.' },
    icon: '📊',
    color: '#3b82f6',
    order: 2,
    category: 'standard',
  },
  {
    id: 'decision',
    label: 'Decision',
    labelI18n: { 'fr-CA': 'Décision' },
    description: 'Choice making, commitment and planning.',
    descriptionI18n: { 'fr-CA': 'Prise de décision, engagement et planification.' },
    icon: '🎯',
    color: '#f97316',
    order: 3,
    category: 'standard',
  },
  {
    id: 'execution',
    label: 'Execution',
    labelI18n: { 'fr-CA': 'Exécution' },
    description: 'Implementation, action and delivery.',
    descriptionI18n: { 'fr-CA': 'Mise en œuvre, action et livraison.' },
    icon: '⚡',
    color: '#22c55e',
    order: 4,
    category: 'standard',
  },
  {
    id: 'review',
    label: 'Review',
    labelI18n: { 'fr-CA': 'Révision' },
    description: 'Evaluation, feedback and iteration.',
    descriptionI18n: { 'fr-CA': 'Évaluation, rétroaction et itération.' },
    icon: '🔍',
    color: '#eab308',
    order: 5,
    category: 'standard',
  },
  {
    id: 'closure',
    label: 'Closure',
    labelI18n: { 'fr-CA': 'Clôture' },
    description: 'Documentation, wrap-up and archival.',
    descriptionI18n: { 'fr-CA': 'Documentation, conclusion et archivage.' },
    icon: '✅',
    color: '#6b7280',
    order: 6,
    category: 'standard',
  },
];

// ─────────────────────────────────────────────────────
// CONSTRUCTION PHASE DEFINITIONS
// ─────────────────────────────────────────────────────

/**
 * Construction-specific phases.
 */
export const CONSTRUCTION_PHASES: PhaseDefinition[] = [
  {
    id: 'pre-construction',
    label: 'Pre-Construction',
    labelI18n: { 'fr-CA': 'Pré-construction' },
    description: 'Planning, permits, RBQ compliance.',
    descriptionI18n: { 'fr-CA': 'Planification, permis, conformité RBQ.' },
    icon: '📋',
    color: '#8b5cf6',
    typicalDurationDays: 30,
    order: 1,
    category: 'construction',
  },
  {
    id: 'mobilization',
    label: 'Mobilization',
    labelI18n: { 'fr-CA': 'Mobilisation' },
    description: 'Site preparation and equipment setup.',
    descriptionI18n: { 'fr-CA': 'Préparation du site et installation des équipements.' },
    icon: '🚧',
    color: '#f59e0b',
    typicalDurationDays: 14,
    order: 2,
    category: 'construction',
  },
  {
    id: 'foundation',
    label: 'Foundation',
    labelI18n: { 'fr-CA': 'Fondation' },
    description: 'Excavation and foundation work.',
    descriptionI18n: { 'fr-CA': 'Excavation et travaux de fondation.' },
    icon: '🏗️',
    color: '#78716c',
    typicalDurationDays: 21,
    order: 3,
    category: 'construction',
  },
  {
    id: 'structure',
    label: 'Structure',
    labelI18n: { 'fr-CA': 'Structure' },
    description: 'Building frame and envelope.',
    descriptionI18n: { 'fr-CA': 'Charpente et enveloppe du bâtiment.' },
    icon: '🏠',
    color: '#3b82f6',
    typicalDurationDays: 45,
    order: 4,
    category: 'construction',
  },
  {
    id: 'mechanical',
    label: 'Mechanical/Electrical',
    labelI18n: { 'fr-CA': 'Mécanique/Électrique' },
    description: 'MEP systems installation.',
    descriptionI18n: { 'fr-CA': 'Installation des systèmes mécaniques, électriques et de plomberie.' },
    icon: '⚡',
    color: '#eab308',
    typicalDurationDays: 30,
    order: 5,
    category: 'construction',
  },
  {
    id: 'finishing',
    label: 'Finishing',
    labelI18n: { 'fr-CA': 'Finition' },
    description: 'Interior and exterior finishing.',
    descriptionI18n: { 'fr-CA': 'Finitions intérieures et extérieures.' },
    icon: '🎨',
    color: '#ec4899',
    typicalDurationDays: 30,
    order: 6,
    category: 'construction',
  },
  {
    id: 'commissioning',
    label: 'Commissioning',
    labelI18n: { 'fr-CA': 'Mise en service' },
    description: 'Testing, inspections and handover.',
    descriptionI18n: { 'fr-CA': 'Tests, inspections et remise des clés.' },
    icon: '🔑',
    color: '#22c55e',
    typicalDurationDays: 14,
    order: 7,
    category: 'construction',
  },
  {
    id: 'warranty',
    label: 'Warranty',
    labelI18n: { 'fr-CA': 'Garantie' },
    description: 'Post-completion support period.',
    descriptionI18n: { 'fr-CA': 'Période de support post-livraison.' },
    icon: '🛡️',
    color: '#6366f1',
    typicalDurationDays: 365,
    order: 8,
    category: 'construction',
  },
];

// ─────────────────────────────────────────────────────
// ALL PHASE DEFINITIONS
// ─────────────────────────────────────────────────────

/**
 * All phase definitions combined.
 */
export const ALL_PHASES: PhaseDefinition[] = [
  ...STANDARD_PHASES,
  ...CONSTRUCTION_PHASES,
];

// ─────────────────────────────────────────────────────
// CORE PHASE PRESETS
// ─────────────────────────────────────────────────────

/**
 * Core phase to preset mappings.
 */
export const CORE_PHASE_PRESETS: PhasePreset[] = [
  // Standard phases
  { phase: 'exploration', presetId: 'exploration', priority: 1 },
  { phase: 'analysis', presetId: 'audit', priority: 1 },
  { phase: 'decision', presetId: 'focus', priority: 1 },
  { phase: 'execution', presetId: 'focus', priority: 1 },
  { phase: 'review', presetId: 'audit', priority: 1 },
  { phase: 'closure', presetId: 'minimal', priority: 1 },
  
  // Construction phases
  { phase: 'pre-construction', presetId: 'audit', priority: 1 },
  { phase: 'mobilization', presetId: 'construction-site', priority: 1 },
  { phase: 'foundation', presetId: 'construction-site', priority: 1 },
  { phase: 'structure', presetId: 'construction-site', priority: 1 },
  { phase: 'mechanical', presetId: 'focus', priority: 1 },
  { phase: 'finishing', presetId: 'focus', priority: 1 },
  { phase: 'commissioning', presetId: 'audit', priority: 1 },
  { phase: 'warranty', presetId: 'audit', priority: 1 },
];

/**
 * Phase presets with role-based conditions.
 */
export const ROLE_AWARE_PHASE_PRESETS: PhasePreset[] = [
  // Analyst in exploration → audit instead
  {
    phase: 'exploration',
    presetId: 'audit',
    priority: 2,
    conditions: [{ type: 'role', value: 'analyst', required: true }],
  },
  
  // Executive in execution → presentation
  {
    phase: 'execution',
    presetId: 'presentation',
    priority: 2,
    conditions: [{ type: 'role', value: 'executive', required: true }],
  },
  
  // Field worker → always construction-site
  {
    phase: 'execution',
    presetId: 'construction-site',
    priority: 2,
    conditions: [{ type: 'role', value: 'field-worker', required: true }],
  },
  
  // Mobile device → mobile preset
  {
    phase: 'execution',
    presetId: 'mobile',
    priority: 3,
    conditions: [{ type: 'device', value: 'mobile', required: true }],
  },
];

// ─────────────────────────────────────────────────────
// DEFAULT STATE
// ─────────────────────────────────────────────────────

/**
 * Default phase system state.
 */
export const DEFAULT_PHASE_STATE: PhaseState = {
  phases: ALL_PHASES,
  phasePresets: [...CORE_PHASE_PRESETS, ...ROLE_AWARE_PHASE_PRESETS],
  activePhase: null,
  transitions: [],
  maxHistorySize: 100,
  autoSwitchEnabled: true,
};

// ─────────────────────────────────────────────────────
// QUERY FUNCTIONS
// ─────────────────────────────────────────────────────

/**
 * Get phase definition by ID.
 */
export function getPhaseById(
  phases: PhaseDefinition[],
  id: AllPhaseId
): PhaseDefinition | undefined {
  return phases.find(p => p.id === id);
}

/**
 * Get phases by category.
 */
export function getPhasesByCategory(
  phases: PhaseDefinition[],
  category: 'standard' | 'construction'
): PhaseDefinition[] {
  return phases.filter(p => p.category === category).sort((a, b) => a.order - b.order);
}

/**
 * Get preset ID for a phase.
 */
export function getPresetForPhase(
  phasePresets: PhasePreset[],
  phaseId: AllPhaseId,
  context?: { roleId?: string; device?: string }
): string | undefined {
  // Filter presets for this phase
  const matching = phasePresets.filter(pp => pp.phase === phaseId);
  
  if (matching.length === 0) return undefined;
  
  // Sort by priority (higher = more specific)
  const sorted = matching.sort((a, b) => (b.priority || 0) - (a.priority || 0));
  
  // Find first matching with conditions
  for (const preset of sorted) {
    if (!preset.conditions || preset.conditions.length === 0) {
      continue; // Skip unconditional for now
    }
    
    const allMatch = preset.conditions.every(cond => {
      if (!cond.required) return true;
      
      switch (cond.type) {
        case 'role':
          return context?.roleId === cond.value;
        case 'device':
          return context?.device === cond.value;
        default:
          return false;
      }
    });
    
    if (allMatch) {
      return preset.presetId;
    }
  }
  
  // Return first unconditional preset
  const unconditional = sorted.find(pp => !pp.conditions || pp.conditions.length === 0);
  return unconditional?.presetId;
}

/**
 * Get next phase in sequence.
 */
export function getNextPhase(
  phases: PhaseDefinition[],
  currentPhaseId: AllPhaseId
): PhaseDefinition | undefined {
  const current = getPhaseById(phases, currentPhaseId);
  if (!current) return undefined;
  
  // Get phases in same category
  const sameCategory = phases.filter(p => p.category === current.category);
  const sorted = sameCategory.sort((a, b) => a.order - b.order);
  
  const currentIndex = sorted.findIndex(p => p.id === currentPhaseId);
  if (currentIndex < 0 || currentIndex >= sorted.length - 1) return undefined;
  
  return sorted[currentIndex + 1];
}

/**
 * Get previous phase in sequence.
 */
export function getPreviousPhase(
  phases: PhaseDefinition[],
  currentPhaseId: AllPhaseId
): PhaseDefinition | undefined {
  const current = getPhaseById(phases, currentPhaseId);
  if (!current) return undefined;
  
  const sameCategory = phases.filter(p => p.category === current.category);
  const sorted = sameCategory.sort((a, b) => a.order - b.order);
  
  const currentIndex = sorted.findIndex(p => p.id === currentPhaseId);
  if (currentIndex <= 0) return undefined;
  
  return sorted[currentIndex - 1];
}
