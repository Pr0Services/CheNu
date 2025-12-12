/* =====================================================
   CHE·NU — Project Preset Defaults & Samples
   
   Sample project preset configurations and factory
   functions for managing project-specific presets.
   ===================================================== */

import {
  ProjectPreset,
  ProjectInfo,
  ProjectPresetState,
  ProjectPresetEvent,
  ProjectCategory,
} from './projectPreset.types';

// ─────────────────────────────────────────────────────
// SAMPLE PROJECT PRESETS
// ─────────────────────────────────────────────────────

/**
 * Sample project preset mappings.
 */
export const SAMPLE_PROJECT_PRESETS: ProjectPreset[] = [
  {
    projectId: 'legal_case_01',
    presetId: 'audit',
    priority: 80,
    reason: 'Legal cases require audit mode for compliance review',
    assignedAt: Date.now(),
  },
  {
    projectId: 'creative_campaign_x',
    presetId: 'exploration',
    priority: 70,
    reason: 'Creative projects benefit from exploration mode',
    assignedAt: Date.now(),
  },
  {
    projectId: 'construction_residential_001',
    presetId: 'construction-site',
    priority: 75,
    reason: 'Residential construction - mobile optimized',
    assignedAt: Date.now(),
  },
  {
    projectId: 'client_presentation_q4',
    presetId: 'client-presentation',
    priority: 90,
    reason: 'High-stakes client presentation',
    assignedAt: Date.now(),
  },
];

// ─────────────────────────────────────────────────────
// SAMPLE PROJECTS
// ─────────────────────────────────────────────────────

/**
 * Sample project info entries.
 */
export const SAMPLE_PROJECTS: ProjectInfo[] = [
  {
    id: 'legal_case_01',
    name: 'Contract Dispute - ABC Corp',
    description: 'Legal case for contract dispute analysis',
    category: 'other',
    status: 'active',
    clientName: 'ABC Corporation',
    tags: ['legal', 'contract', 'dispute'],
  },
  {
    id: 'creative_campaign_x',
    name: 'Marketing Campaign X',
    description: 'Creative marketing campaign for product launch',
    category: 'other',
    status: 'active',
    clientName: 'Internal',
    tags: ['marketing', 'creative', 'campaign'],
  },
  {
    id: 'construction_residential_001',
    name: 'Maison Duplex Laval',
    description: 'Construction duplex résidentiel à Laval',
    category: 'residential',
    status: 'active',
    clientName: 'Famille Tremblay',
    location: 'Laval, QC',
    tags: ['residential', 'duplex', 'laval'],
  },
  {
    id: 'client_presentation_q4',
    name: 'Q4 Executive Presentation',
    description: 'Quarterly presentation for executive team',
    category: 'other',
    status: 'active',
    clientName: 'Board of Directors',
    tags: ['presentation', 'executive', 'q4'],
  },
];

// ─────────────────────────────────────────────────────
// DEFAULT STATE
// ─────────────────────────────────────────────────────

/**
 * Default project preset state.
 */
export const DEFAULT_PROJECT_PRESET_STATE: ProjectPresetState = {
  projectPresets: [],
  activeProjectId: null,
  projects: [],
};

// ─────────────────────────────────────────────────────
// CATEGORY → PRESET SUGGESTIONS
// ─────────────────────────────────────────────────────

/**
 * Suggested presets by project category.
 */
export const CATEGORY_PRESET_SUGGESTIONS: Record<ProjectCategory, string[]> = {
  residential: ['construction-site', 'mobile', 'focus'],
  commercial: ['construction-site', 'audit', 'client-presentation'],
  industrial: ['construction-site', 'audit', 'focus'],
  institutional: ['audit', 'client-presentation', 'exploration'],
  infrastructure: ['construction-site', 'audit', 'focus'],
  renovation: ['construction-site', 'mobile', 'exploration'],
  other: ['exploration', 'focus', 'audit'],
};

// ─────────────────────────────────────────────────────
// FACTORY FUNCTIONS
// ─────────────────────────────────────────────────────

/**
 * Create a project preset mapping.
 */
export function createProjectPreset(
  projectId: string,
  presetId: string,
  options?: {
    priority?: number;
    reason?: string;
    assignedBy?: string;
  }
): ProjectPreset {
  return {
    projectId,
    presetId,
    priority: options?.priority ?? 50,
    reason: options?.reason,
    assignedBy: options?.assignedBy,
    assignedAt: Date.now(),
  };
}

/**
 * Create a project info entry.
 */
export function createProject(
  id: string,
  name: string,
  options?: Partial<Omit<ProjectInfo, 'id' | 'name'>>
): ProjectInfo {
  return {
    id,
    name,
    status: 'draft',
    ...options,
  };
}

/**
 * Get project preset by project ID.
 */
export function getProjectPreset(
  projectPresets: ProjectPreset[],
  projectId: string
): ProjectPreset | undefined {
  return projectPresets.find(p => p.projectId === projectId);
}

/**
 * Get project by ID.
 */
export function getProject(
  projects: ProjectInfo[],
  projectId: string
): ProjectInfo | undefined {
  return projects.find(p => p.id === projectId);
}

/**
 * Get projects by category.
 */
export function getProjectsByCategory(
  projects: ProjectInfo[],
  category: ProjectCategory
): ProjectInfo[] {
  return projects.filter(p => p.category === category);
}

/**
 * Get projects by status.
 */
export function getProjectsByStatus(
  projects: ProjectInfo[],
  status: ProjectInfo['status']
): ProjectInfo[] {
  return projects.filter(p => p.status === status);
}

/**
 * Get suggested presets for a project category.
 */
export function getSuggestedPresetsForCategory(
  category: ProjectCategory
): string[] {
  return CATEGORY_PRESET_SUGGESTIONS[category] || CATEGORY_PRESET_SUGGESTIONS.other;
}

// ─────────────────────────────────────────────────────
// STATE REDUCER
// ─────────────────────────────────────────────────────

/**
 * Reduce project preset state based on events.
 */
export function reduceProjectPresetState(
  state: ProjectPresetState,
  event: ProjectPresetEvent
): ProjectPresetState {
  switch (event.type) {
    case 'PROJECT_PRESET_SET': {
      const existing = state.projectPresets.findIndex(
        p => p.projectId === event.projectId
      );
      
      const newPreset = createProjectPreset(
        event.projectId,
        event.presetId,
        { reason: event.reason }
      );
      
      if (existing >= 0) {
        const updated = [...state.projectPresets];
        updated[existing] = newPreset;
        return { ...state, projectPresets: updated };
      }
      
      return {
        ...state,
        projectPresets: [...state.projectPresets, newPreset],
      };
    }
    
    case 'PROJECT_PRESET_CLEARED':
      return {
        ...state,
        projectPresets: state.projectPresets.filter(
          p => p.projectId !== event.projectId
        ),
      };
    
    case 'ACTIVE_PROJECT_SET':
      return {
        ...state,
        activeProjectId: event.projectId,
      };
    
    case 'ACTIVE_PROJECT_CLEARED':
      return {
        ...state,
        activeProjectId: null,
      };
    
    case 'PROJECT_ADDED':
      return {
        ...state,
        projects: [...state.projects, event.project],
      };
    
    case 'PROJECT_UPDATED':
      return {
        ...state,
        projects: state.projects.map(p =>
          p.id === event.project.id ? event.project : p
        ),
      };
    
    case 'PROJECT_REMOVED':
      return {
        ...state,
        projects: state.projects.filter(p => p.id !== event.projectId),
        projectPresets: state.projectPresets.filter(
          p => p.projectId !== event.projectId
        ),
        activeProjectId: state.activeProjectId === event.projectId
          ? null
          : state.activeProjectId,
      };
    
    default:
      return state;
  }
}
