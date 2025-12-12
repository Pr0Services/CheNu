/* =====================================================
   CHE·NU — DEFAULT SPHERES
   Status: FOUNDATIONAL
   Purpose: Pre-built sphere instances using generator
   
   All spheres are created using generateSphere() to
   ensure foundational compliance.
   
   ❤️ With love, for humanity.
   ===================================================== */

import { generateSphere, GeneratedSphere, SphereInput } from './sphereGenerator';

/* =========================================================
   SPHERE DEFINITIONS
   ========================================================= */

/**
 * Personal sphere definition.
 */
const personalInput: SphereInput = {
  name: 'Personal',
  id: 'personal',
  emoji: '👤',
  description: 'Espace privé de l\'individu',
  scope: {
    included: ['notes', 'reflection', 'private goals', 'journal', 'personal thoughts'],
    excluded: ['performance scoring', 'external metrics', 'social comparison'],
  },
  agents: { enabled: true, notes: 'Personal assistant agents' },
  inter_sphere_interaction: false,
};

/**
 * Business sphere definition.
 */
const businessInput: SphereInput = {
  name: 'Business',
  id: 'business',
  emoji: '💼',
  description: 'Espace professionnel pour projets et clients',
  scope: {
    included: ['projects', 'clients', 'tasks', 'documents', 'meetings', 'invoices'],
    excluded: ['personal data', 'health information', 'private communications'],
  },
  agents: { enabled: true, notes: 'Professional workflow agents' },
  inter_sphere_interaction: true, // May need to interact with finance
};

/**
 * Creative sphere definition.
 */
const creativeInput: SphereInput = {
  name: 'Creative',
  id: 'creative',
  emoji: '🎨',
  description: 'Espace d\'expression artistique et créative',
  scope: {
    included: ['art', 'music', 'writing', 'design', 'ideas', 'inspiration'],
    excluded: ['commercial metrics', 'audience analytics', 'engagement scores'],
  },
  agents: { enabled: true, notes: 'Creative assistance without judgment' },
  inter_sphere_interaction: false,
};

/**
 * Scholar sphere definition.
 */
const scholarInput: SphereInput = {
  name: 'Scholar',
  id: 'scholar',
  emoji: '📚',
  description: 'Espace d\'apprentissage et de recherche',
  scope: {
    included: ['research', 'learning', 'courses', 'notes', 'bibliography', 'knowledge'],
    excluded: ['grades', 'competition', 'rankings', 'performance anxiety'],
  },
  agents: { enabled: true, notes: 'Research and learning assistants' },
  inter_sphere_interaction: false,
};

/**
 * Construction sphere definition (Quebec-specific).
 */
const constructionInput: SphereInput = {
  name: 'Construction',
  id: 'construction',
  emoji: '🏗️',
  description: 'Gestion de construction avec conformité Québec (RBQ, CCQ, CNESST)',
  scope: {
    included: [
      'projects', 'permits', 'inspections', 'safety',
      'materials', 'subcontractors', 'estimates', 'schedules',
      'RBQ compliance', 'CCQ compliance', 'CNESST compliance',
    ],
    excluded: ['personal worker data', 'health records', 'private communications'],
  },
  agents: { enabled: true, notes: 'Construction management agents with Quebec regulatory knowledge' },
  inter_sphere_interaction: true, // May interact with finance for invoicing
};

/**
 * Finance sphere definition.
 */
const financeInput: SphereInput = {
  name: 'Finance',
  id: 'finance',
  emoji: '💰',
  description: 'Gestion financière personnelle et professionnelle',
  scope: {
    included: ['budgets', 'transactions', 'invoices', 'reports', 'taxes', 'investments'],
    excluded: ['spending judgment', 'lifestyle analysis', 'behavioral patterns'],
  },
  agents: { enabled: true, notes: 'Financial tracking only, no advice' },
  inter_sphere_interaction: true, // Interacts with business
};

/**
 * Wellness sphere definition.
 */
const wellnessInput: SphereInput = {
  name: 'Wellness',
  id: 'wellness',
  emoji: '🌿',
  description: 'Espace pour la santé et le bien-être',
  scope: {
    included: ['health tracking', 'meditation', 'exercise', 'sleep', 'nutrition'],
    excluded: ['body judgment', 'comparison', 'performance pressure', 'medical diagnosis'],
  },
  agents: { enabled: true, notes: 'Supportive wellness tracking, never diagnostic' },
  inter_sphere_interaction: false, // Highly private
};

/**
 * Family sphere definition.
 */
const familyInput: SphereInput = {
  name: 'Family',
  id: 'family',
  emoji: '👨‍👩‍👧‍👦',
  description: 'Coordination familiale et activités partagées',
  scope: {
    included: ['calendar', 'tasks', 'shopping', 'activities', 'memories', 'communication'],
    excluded: ['individual monitoring', 'behavior tracking', 'parenting judgment'],
  },
  agents: { enabled: true, notes: 'Family coordination assistance' },
  inter_sphere_interaction: false,
};

/**
 * Sandbox sphere definition.
 */
const sandboxInput: SphereInput = {
  name: 'Sandbox',
  id: 'sandbox',
  emoji: '🧪',
  description: 'Espace d\'expérimentation sécuritaire',
  scope: {
    included: ['experiments', 'tests', 'prototypes', 'ideas', 'learning'],
    excluded: ['production data', 'real transactions', 'actual consequences'],
  },
  agents: { enabled: true, notes: 'Full experimentation freedom' },
  inter_sphere_interaction: false,
};

/**
 * Archive sphere definition.
 */
const archiveInput: SphereInput = {
  name: 'Archive',
  id: 'archive',
  emoji: '📦',
  description: 'Stockage long terme pour projets complétés',
  scope: {
    included: ['completed projects', 'historical data', 'references', 'memories'],
    excluded: ['active processing', 'ongoing analysis', 'real-time updates'],
  },
  agents: { enabled: false, notes: 'No active agents in archive' },
  inter_sphere_interaction: false,
};

/* =========================================================
   GENERATED SPHERES
   ========================================================= */

/**
 * Generate all default spheres.
 * Each sphere is created through the generator to ensure compliance.
 */
export const personalSphere = generateSphere(personalInput);
export const businessSphere = generateSphere(businessInput);
export const creativeSphere = generateSphere(creativeInput);
export const scholarSphere = generateSphere(scholarInput);
export const constructionSphere = generateSphere(constructionInput);
export const financeSphere = generateSphere(financeInput);
export const wellnessSphere = generateSphere(wellnessInput);
export const familySphere = generateSphere(familyInput);
export const sandboxSphere = generateSphere(sandboxInput);
export const archiveSphere = generateSphere(archiveInput);

/**
 * All default spheres.
 */
export const defaultSpheres: GeneratedSphere[] = [
  personalSphere,
  businessSphere,
  creativeSphere,
  scholarSphere,
  constructionSphere,
  financeSphere,
  wellnessSphere,
  familySphere,
  sandboxSphere,
  archiveSphere,
];

/**
 * Sphere inputs for reference.
 */
export const sphereInputs: SphereInput[] = [
  personalInput,
  businessInput,
  creativeInput,
  scholarInput,
  constructionInput,
  financeInput,
  wellnessInput,
  familyInput,
  sandboxInput,
  archiveInput,
];

/* =========================================================
   UTILITIES
   ========================================================= */

/**
 * Get sphere by ID.
 */
export function getSphereById(id: string): GeneratedSphere | undefined {
  return defaultSpheres.find(s => s.sphere.id === id);
}

/**
 * Get all sphere IDs.
 */
export function getAllSphereIds(): string[] {
  return defaultSpheres.map(s => s.sphere.id);
}

/**
 * Get spheres with agents enabled.
 */
export function getActiveAgentSpheres(): GeneratedSphere[] {
  return defaultSpheres.filter(s => s.agents.allowed);
}

/**
 * Get spheres that allow inter-sphere interaction.
 */
export function getInteractableSpheres(): GeneratedSphere[] {
  return defaultSpheres.filter(s => s.interactions.allowed);
}

/**
 * Get sphere summary.
 */
export function getSphereSummary(): Array<{
  id: string;
  name: string;
  emoji: string;
  agents: boolean;
  interactions: boolean;
}> {
  return defaultSpheres.map(s => ({
    id: s.sphere.id,
    name: s.sphere.name,
    emoji: s.sphere.emoji,
    agents: s.agents.allowed,
    interactions: s.interactions.allowed,
  }));
}

/* =========================================================
   EXPORTS
   ========================================================= */

export default defaultSpheres;
