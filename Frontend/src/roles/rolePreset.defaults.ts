/* =====================================================
   CHE·NU — Role Preset Defaults
   
   Core system roles and factory functions.
   ===================================================== */

import {
  UserRole,
  RoleCategory,
  RoleState,
  AdvisorLogEntry,
} from './rolePreset.types';

// ─────────────────────────────────────────────────────
// CORE ROLES
// ─────────────────────────────────────────────────────

/**
 * Built-in system roles.
 */
export const CORE_ROLES: UserRole[] = [
  // ─── Strategist ───
  {
    id: 'strategist',
    label: 'Strategist',
    labelI18n: { 'fr-CA': 'Stratège' },
    description: 'Big picture, long-term decisions.',
    descriptionI18n: { 'fr-CA': 'Vision globale, décisions à long terme.' },
    category: 'executive',
    icon: '🎯',
    color: '#8b5cf6',
    defaultPresetId: 'exploration',
    defaultSphere: 'business',
    priorityAgents: ['decision', 'methodology', 'memory'],
    isSystem: true,
  },

  // ─── Operator ───
  {
    id: 'operator',
    label: 'Operator',
    labelI18n: { 'fr-CA': 'Opérateur' },
    description: 'Execution and efficiency.',
    descriptionI18n: { 'fr-CA': 'Exécution et efficacité.' },
    category: 'operational',
    icon: '⚡',
    color: '#f97316',
    defaultPresetId: 'focus',
    priorityAgents: ['methodology', 'nova'],
    isSystem: true,
  },

  // ─── Analyst ───
  {
    id: 'analyst',
    label: 'Analyst',
    labelI18n: { 'fr-CA': 'Analyste' },
    description: 'Review, audit and comparison.',
    descriptionI18n: { 'fr-CA': 'Révision, audit et comparaison.' },
    category: 'analytical',
    icon: '📊',
    color: '#22c55e',
    defaultPresetId: 'audit',
    defaultSphere: 'business',
    priorityAgents: ['decision', 'memory', 'methodology'],
    isSystem: true,
  },

  // ─── Creative ───
  {
    id: 'creative',
    label: 'Creative',
    labelI18n: { 'fr-CA': 'Créatif' },
    description: 'Ideation and experimentation.',
    descriptionI18n: { 'fr-CA': 'Idéation et expérimentation.' },
    category: 'creative',
    icon: '🎨',
    color: '#ec4899',
    defaultPresetId: 'exploration',
    defaultSphere: 'creative',
    priorityAgents: ['creative', 'nova'],
    isSystem: true,
  },

  // ─── Facilitator ───
  {
    id: 'facilitator',
    label: 'Facilitator',
    labelI18n: { 'fr-CA': 'Facilitateur' },
    description: 'Meetings and collaboration.',
    descriptionI18n: { 'fr-CA': 'Réunions et collaboration.' },
    category: 'operational',
    icon: '👥',
    color: '#3b82f6',
    defaultPresetId: 'meeting',
    priorityAgents: ['nova', 'methodology'],
    isSystem: true,
  },

  // ─── Technical Lead ───
  {
    id: 'tech-lead',
    label: 'Technical Lead',
    labelI18n: { 'fr-CA': 'Lead technique' },
    description: 'Technical decisions and architecture.',
    descriptionI18n: { 'fr-CA': 'Décisions techniques et architecture.' },
    category: 'technical',
    icon: '💻',
    color: '#06b6d4',
    defaultPresetId: 'focus',
    priorityAgents: ['methodology', 'decision', 'researcher'],
    isSystem: true,
  },

  // ─── Project Manager ───
  {
    id: 'project-manager',
    label: 'Project Manager',
    labelI18n: { 'fr-CA': 'Gestionnaire de projet' },
    description: 'Coordination and tracking.',
    descriptionI18n: { 'fr-CA': 'Coordination et suivi.' },
    category: 'operational',
    icon: '📋',
    color: '#eab308',
    defaultPresetId: 'audit',
    defaultSphere: 'business',
    priorityAgents: ['methodology', 'memory', 'nova'],
    isSystem: true,
  },

  // ─── Field Worker ───
  {
    id: 'field-worker',
    label: 'Field Worker',
    labelI18n: { 'fr-CA': 'Travailleur terrain' },
    description: 'On-site operations and mobile.',
    descriptionI18n: { 'fr-CA': 'Opérations sur site et mobile.' },
    category: 'field',
    icon: '🏗️',
    color: '#f59e0b',
    defaultPresetId: 'mobile',
    restrictedPresets: ['xr-immersive'], // XR may not be practical on site
    isSystem: true,
  },

  // ─── Executive ───
  {
    id: 'executive',
    label: 'Executive',
    labelI18n: { 'fr-CA': 'Exécutif' },
    description: 'High-level overview and decisions.',
    descriptionI18n: { 'fr-CA': 'Vue d\'ensemble et décisions de haut niveau.' },
    category: 'executive',
    icon: '👔',
    color: '#1e40af',
    defaultPresetId: 'presentation',
    defaultSphere: 'business',
    priorityAgents: ['decision', 'memory'],
    isSystem: true,
  },

  // ─── Researcher ───
  {
    id: 'researcher',
    label: 'Researcher',
    labelI18n: { 'fr-CA': 'Chercheur' },
    description: 'Deep analysis and investigation.',
    descriptionI18n: { 'fr-CA': 'Analyse approfondie et investigation.' },
    category: 'analytical',
    icon: '🔬',
    color: '#7c3aed',
    defaultPresetId: 'exploration',
    defaultSphere: 'scholar',
    priorityAgents: ['researcher', 'memory', 'methodology'],
    isSystem: true,
  },
];

// ─────────────────────────────────────────────────────
// CONSTRUCTION-SPECIFIC ROLES
// ─────────────────────────────────────────────────────

/**
 * Construction industry roles for Quebec market.
 */
export const CONSTRUCTION_ROLES: UserRole[] = [
  {
    id: 'superintendent',
    label: 'Superintendent',
    labelI18n: { 'fr-CA': 'Surintendant' },
    description: 'Site supervision and daily operations.',
    descriptionI18n: { 'fr-CA': 'Supervision de chantier et opérations quotidiennes.' },
    category: 'field',
    icon: '🦺',
    color: '#f97316',
    defaultPresetId: 'construction-site',
    priorityAgents: ['methodology', 'nova'],
    isSystem: false,
  },

  {
    id: 'estimator',
    label: 'Estimator',
    labelI18n: { 'fr-CA': 'Estimateur' },
    description: 'Cost estimation and bidding.',
    descriptionI18n: { 'fr-CA': 'Estimation des coûts et soumissions.' },
    category: 'analytical',
    icon: '🧮',
    color: '#22c55e',
    defaultPresetId: 'audit',
    defaultSphere: 'business',
    priorityAgents: ['decision', 'analyst'],
    isSystem: false,
  },

  {
    id: 'safety-officer',
    label: 'Safety Officer',
    labelI18n: { 'fr-CA': 'Agent de sécurité' },
    description: 'CNESST compliance and safety.',
    descriptionI18n: { 'fr-CA': 'Conformité CNESST et sécurité.' },
    category: 'operational',
    icon: '⚠️',
    color: '#ef4444',
    defaultPresetId: 'audit',
    priorityAgents: ['methodology', 'compliance'],
    isSystem: false,
  },

  {
    id: 'client-rep',
    label: 'Client Representative',
    labelI18n: { 'fr-CA': 'Représentant client' },
    description: 'Client communication and presentations.',
    descriptionI18n: { 'fr-CA': 'Communication client et présentations.' },
    category: 'executive',
    icon: '🤝',
    color: '#3b82f6',
    defaultPresetId: 'client-presentation',
    priorityAgents: ['nova', 'decision'],
    isSystem: false,
  },
];

// ─────────────────────────────────────────────────────
// ALL DEFAULT ROLES
// ─────────────────────────────────────────────────────

/**
 * All default roles combined.
 */
export const DEFAULT_ROLES: UserRole[] = [
  ...CORE_ROLES,
  ...CONSTRUCTION_ROLES,
];

// ─────────────────────────────────────────────────────
// DEFAULT STATE
// ─────────────────────────────────────────────────────

/**
 * Default role system state.
 */
export const DEFAULT_ROLE_STATE: RoleState = {
  roles: DEFAULT_ROLES,
  activeRoleId: null,
  roleHistory: [],
  advisorLog: [],
  maxLogSize: 100,
  advisorEnabled: true,
};

// ─────────────────────────────────────────────────────
// FACTORY FUNCTIONS
// ─────────────────────────────────────────────────────

/**
 * Create a new custom role.
 */
export function createRole(
  partial: Partial<UserRole> & Pick<UserRole, 'id' | 'label'>
): UserRole {
  return {
    description: '',
    category: 'custom',
    isSystem: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...partial,
  };
}

/**
 * Clone an existing role with a new ID.
 */
export function cloneRole(
  source: UserRole,
  newId: string,
  overrides?: Partial<UserRole>
): UserRole {
  return {
    ...source,
    id: newId,
    label: `${source.label} (Copy)`,
    isSystem: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...overrides,
  };
}

/**
 * Get role by ID from list.
 */
export function getRoleById(
  roles: UserRole[],
  id: string
): UserRole | undefined {
  return roles.find(r => r.id === id);
}

/**
 * Get roles by category.
 */
export function getRolesByCategory(
  roles: UserRole[],
  category: RoleCategory
): UserRole[] {
  return roles.filter(r => r.category === category);
}

/**
 * Get system roles only.
 */
export function getSystemRoles(roles: UserRole[]): UserRole[] {
  return roles.filter(r => r.isSystem);
}

/**
 * Get custom roles only.
 */
export function getCustomRoles(roles: UserRole[]): UserRole[] {
  return roles.filter(r => !r.isSystem);
}
