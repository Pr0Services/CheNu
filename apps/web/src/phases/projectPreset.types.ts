/* =====================================================
   CHE·NU — Project Preset Types
   
   Type definitions for project-level preset
   configurations and overrides.
   ===================================================== */

import { CheNuPreset } from '../presets/preset.types';
import { AllPhaseId } from '../phases/phasePreset.types';

// ─────────────────────────────────────────────────────
// PROJECT PRESET MAPPING
// ─────────────────────────────────────────────────────

/**
 * Project to preset mapping.
 */
export interface ProjectPreset {
  /** Project identifier */
  projectId: string;
  
  /** Default preset ID for this project */
  presetId: string;
  
  /** Priority (for conflict resolution) */
  priority?: number;
}

/**
 * Project with phase-specific presets.
 */
export interface ProjectPhasePreset {
  /** Project identifier */
  projectId: string;
  
  /** Phase identifier */
  phaseId: AllPhaseId;
  
  /** Preset ID for this project+phase combo */
  presetId: string;
}

// ─────────────────────────────────────────────────────
// PROJECT DEFINITION
// ─────────────────────────────────────────────────────

/**
 * Project type for preset configuration.
 */
export type ProjectType =
  | 'residential'      // Residential construction
  | 'commercial'       // Commercial construction
  | 'industrial'       // Industrial projects
  | 'infrastructure'   // Roads, bridges, etc.
  | 'renovation'       // Renovation projects
  | 'software'         // Software development
  | 'consulting'       // Consulting engagement
  | 'custom';          // Custom project type

/**
 * Project status.
 */
export type ProjectStatus =
  | 'planning'
  | 'active'
  | 'on-hold'
  | 'completed'
  | 'archived';

/**
 * Project definition.
 */
export interface Project {
  /** Unique project identifier */
  id: string;
  
  /** Project name */
  name: string;
  
  /** Project type */
  type: ProjectType;
  
  /** Current status */
  status: ProjectStatus;
  
  /** Current phase */
  currentPhase?: AllPhaseId;
  
  /** Default preset for this project */
  defaultPresetId?: string;
  
  /** Phase-specific preset overrides */
  phasePresets?: ProjectPhasePreset[];
  
  /** Associated sphere ID */
  sphereId?: string;
  
  /** Creation timestamp */
  createdAt: number;
  
  /** Last updated timestamp */
  updatedAt: number;
  
  /** Metadata */
  metadata?: Record<string, any>;
}

// ─────────────────────────────────────────────────────
// PROJECT PRESET RESOLUTION
// ─────────────────────────────────────────────────────

/**
 * Context for resolving project preset.
 */
export interface ProjectPresetContext {
  /** Active project */
  project?: Project;
  
  /** Current phase */
  currentPhase?: AllPhaseId;
  
  /** User's role */
  roleId?: string;
  
  /** Device type */
  device?: 'desktop' | 'mobile' | 'xr';
}

/**
 * Resolved preset with source information.
 */
export interface ResolvedPreset {
  /** Preset ID */
  presetId: string;
  
  /** Source of resolution */
  source: 'project' | 'project-phase' | 'phase' | 'role' | 'default';
  
  /** Project ID if from project */
  projectId?: string;
  
  /** Phase ID if from phase */
  phaseId?: AllPhaseId;
}

// ─────────────────────────────────────────────────────
// PROJECT STATE
// ─────────────────────────────────────────────────────

/**
 * Project preset system state.
 */
export interface ProjectPresetState {
  /** All projects */
  projects: Project[];
  
  /** Global project presets */
  projectPresets: ProjectPreset[];
  
  /** Currently active project ID */
  activeProjectId: string | null;
  
  /** Recently accessed project IDs */
  recentProjects: string[];
  
  /** Maximum recent entries */
  maxRecentSize: number;
}

// ─────────────────────────────────────────────────────
// PROJECT EVENTS
// ─────────────────────────────────────────────────────

/**
 * Project preset system events.
 */
export type ProjectPresetEvent =
  | { type: 'PROJECT_CREATED'; project: Project }
  | { type: 'PROJECT_UPDATED'; project: Project }
  | { type: 'PROJECT_DELETED'; projectId: string }
  | { type: 'PROJECT_ACTIVATED'; projectId: string }
  | { type: 'PROJECT_DEACTIVATED' }
  | { type: 'PROJECT_PRESET_SET'; projectId: string; presetId: string }
  | { type: 'PROJECT_PHASE_PRESET_SET'; projectId: string; phaseId: AllPhaseId; presetId: string };

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export type { CheNuPreset, AllPhaseId };
