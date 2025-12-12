/* =====================================================
   CHE·NU — Project Preset Defaults & Engine
   
   Default project configurations and resolution logic.
   ===================================================== */

import {
  Project,
  ProjectPreset,
  ProjectPhasePreset,
  ProjectPresetState,
  ProjectPresetEvent,
  ProjectPresetContext,
  ResolvedPreset,
  ProjectType,
} from './projectPreset.types';

import { AllPhaseId } from './phasePreset.types';
import { getPresetForPhase, CORE_PHASE_PRESETS } from './phasePreset.defaults';

// ─────────────────────────────────────────────────────
// DEFAULT PROJECT TYPE PRESETS
// ─────────────────────────────────────────────────────

/**
 * Default presets by project type.
 */
export const PROJECT_TYPE_PRESETS: Record<ProjectType, string> = {
  residential: 'construction-site',
  commercial: 'audit',
  industrial: 'focus',
  infrastructure: 'construction-site',
  renovation: 'construction-site',
  software: 'focus',
  consulting: 'meeting',
  custom: 'balanced',
};

// ─────────────────────────────────────────────────────
// DEFAULT STATE
// ─────────────────────────────────────────────────────

/**
 * Default project preset state.
 */
export const DEFAULT_PROJECT_PRESET_STATE: ProjectPresetState = {
  projects: [],
  projectPresets: [],
  activeProjectId: null,
  recentProjects: [],
  maxRecentSize: 10,
};

// ─────────────────────────────────────────────────────
// STATE REDUCER
// ─────────────────────────────────────────────────────

/**
 * Reduce project preset state.
 */
export function reduceProjectPresetState(
  state: ProjectPresetState,
  event: ProjectPresetEvent
): ProjectPresetState {
  switch (event.type) {
    case 'PROJECT_CREATED':
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
    
    case 'PROJECT_DELETED':
      return {
        ...state,
        projects: state.projects.filter(p => p.id !== event.projectId),
        projectPresets: state.projectPresets.filter(pp => pp.projectId !== event.projectId),
        activeProjectId: state.activeProjectId === event.projectId ? null : state.activeProjectId,
        recentProjects: state.recentProjects.filter(id => id !== event.projectId),
      };
    
    case 'PROJECT_ACTIVATED': {
      const recentProjects = [
        event.projectId,
        ...state.recentProjects.filter(id => id !== event.projectId),
      ].slice(0, state.maxRecentSize);
      
      return {
        ...state,
        activeProjectId: event.projectId,
        recentProjects,
      };
    }
    
    case 'PROJECT_DEACTIVATED':
      return {
        ...state,
        activeProjectId: null,
      };
    
    case 'PROJECT_PRESET_SET': {
      const existing = state.projectPresets.findIndex(pp => pp.projectId === event.projectId);
      
      if (existing >= 0) {
        const updated = [...state.projectPresets];
        updated[existing] = { projectId: event.projectId, presetId: event.presetId };
        return { ...state, projectPresets: updated };
      }
      
      return {
        ...state,
        projectPresets: [
          ...state.projectPresets,
          { projectId: event.projectId, presetId: event.presetId },
        ],
      };
    }
    
    case 'PROJECT_PHASE_PRESET_SET': {
      const project = state.projects.find(p => p.id === event.projectId);
      if (!project) return state;
      
      const phasePresets = project.phasePresets || [];
      const existing = phasePresets.findIndex(
        pp => pp.phaseId === event.phaseId
      );
      
      const newPhasePreset: ProjectPhasePreset = {
        projectId: event.projectId,
        phaseId: event.phaseId,
        presetId: event.presetId,
      };
      
      const updatedPhasePresets = existing >= 0
        ? phasePresets.map((pp, i) => i === existing ? newPhasePreset : pp)
        : [...phasePresets, newPhasePreset];
      
      return {
        ...state,
        projects: state.projects.map(p =>
          p.id === event.projectId
            ? { ...p, phasePresets: updatedPhasePresets, updatedAt: Date.now() }
            : p
        ),
      };
    }
    
    default:
      return state;
  }
}

// ─────────────────────────────────────────────────────
// QUERY FUNCTIONS
// ─────────────────────────────────────────────────────

/**
 * Get project by ID.
 */
export function getProjectById(
  state: ProjectPresetState,
  projectId: string
): Project | undefined {
  return state.projects.find(p => p.id === projectId);
}

/**
 * Get active project.
 */
export function getActiveProject(
  state: ProjectPresetState
): Project | undefined {
  if (!state.activeProjectId) return undefined;
  return getProjectById(state, state.activeProjectId);
}

/**
 * Get project preset.
 */
export function getProjectPreset(
  state: ProjectPresetState,
  projectId: string
): string | undefined {
  const mapping = state.projectPresets.find(pp => pp.projectId === projectId);
  if (mapping) return mapping.presetId;
  
  const project = getProjectById(state, projectId);
  if (project?.defaultPresetId) return project.defaultPresetId;
  
  if (project?.type) return PROJECT_TYPE_PRESETS[project.type];
  
  return undefined;
}

/**
 * Get project phase preset.
 */
export function getProjectPhasePreset(
  state: ProjectPresetState,
  projectId: string,
  phaseId: AllPhaseId
): string | undefined {
  const project = getProjectById(state, projectId);
  if (!project) return undefined;
  
  const phasePreset = project.phasePresets?.find(pp => pp.phaseId === phaseId);
  return phasePreset?.presetId;
}

// ─────────────────────────────────────────────────────
// PRESET RESOLUTION
// ─────────────────────────────────────────────────────

/**
 * Resolve preset for given context.
 * Priority: project-phase > project > phase > role > default
 */
export function resolvePreset(
  state: ProjectPresetState,
  context: ProjectPresetContext
): ResolvedPreset {
  // 1. Project + Phase specific
  if (context.project && context.currentPhase) {
    const projectPhasePreset = getProjectPhasePreset(
      state,
      context.project.id,
      context.currentPhase
    );
    
    if (projectPhasePreset) {
      return {
        presetId: projectPhasePreset,
        source: 'project-phase',
        projectId: context.project.id,
        phaseId: context.currentPhase,
      };
    }
  }
  
  // 2. Project default
  if (context.project) {
    const projectPreset = getProjectPreset(state, context.project.id);
    
    if (projectPreset) {
      return {
        presetId: projectPreset,
        source: 'project',
        projectId: context.project.id,
      };
    }
  }
  
  // 3. Phase default (with role context)
  if (context.currentPhase) {
    const phasePreset = getPresetForPhase(
      CORE_PHASE_PRESETS,
      context.currentPhase,
      { roleId: context.roleId, device: context.device }
    );
    
    if (phasePreset) {
      return {
        presetId: phasePreset,
        source: 'phase',
        phaseId: context.currentPhase,
      };
    }
  }
  
  // 4. Default fallback
  return {
    presetId: 'balanced',
    source: 'default',
  };
}

// ─────────────────────────────────────────────────────
// FACTORY FUNCTIONS
// ─────────────────────────────────────────────────────

/**
 * Create a new project.
 */
export function createProject(
  partial: Partial<Project> & Pick<Project, 'id' | 'name' | 'type'>
): Project {
  return {
    status: 'planning',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...partial,
  };
}

/**
 * Clone a project.
 */
export function cloneProject(
  source: Project,
  newId: string,
  overrides?: Partial<Project>
): Project {
  return {
    ...source,
    id: newId,
    name: `${source.name} (Copy)`,
    status: 'planning',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...overrides,
  };
}

// ─────────────────────────────────────────────────────
// ANALYTICS
// ─────────────────────────────────────────────────────

/**
 * Get projects by type.
 */
export function getProjectsByType(
  state: ProjectPresetState,
  type: ProjectType
): Project[] {
  return state.projects.filter(p => p.type === type);
}

/**
 * Get projects by status.
 */
export function getProjectsByStatus(
  state: ProjectPresetState,
  status: Project['status']
): Project[] {
  return state.projects.filter(p => p.status === status);
}

/**
 * Get recent projects.
 */
export function getRecentProjects(
  state: ProjectPresetState,
  limit: number = 5
): Project[] {
  return state.recentProjects
    .slice(0, limit)
    .map(id => getProjectById(state, id))
    .filter((p): p is Project => p !== undefined);
}

/**
 * Get project preset statistics.
 */
export function getPresetUsageByProject(
  state: ProjectPresetState
): Map<string, { projectCount: number; projectNames: string[] }> {
  const usage = new Map<string, { projectCount: number; projectNames: string[] }>();
  
  for (const project of state.projects) {
    const presetId = getProjectPreset(state, project.id) || 'default';
    const existing = usage.get(presetId) || { projectCount: 0, projectNames: [] };
    
    usage.set(presetId, {
      projectCount: existing.projectCount + 1,
      projectNames: [...existing.projectNames, project.name],
    });
  }
  
  return usage;
}
