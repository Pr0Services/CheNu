/* =====================================================
   CHE·NU — Project Preset Types
   
   Type definitions for project-specific preset
   configurations. Projects can have custom preset
   assignments that override phase and role defaults.
   ===================================================== */

// ─────────────────────────────────────────────────────
// PROJECT PRESET MAPPING
// ─────────────────────────────────────────────────────

/**
 * Association between a project and its preset.
 */
export interface ProjectPreset {
  /** Project identifier */
  projectId: string;
  
  /** Assigned preset ID */
  presetId: string;
  
  /** Priority (higher overrides lower) */
  priority?: number;
  
  /** Reason for this assignment */
  reason?: string;
  
  /** Who assigned this preset */
  assignedBy?: string;
  
  /** Assignment timestamp */
  assignedAt?: number;
}

// ─────────────────────────────────────────────────────
// PROJECT TYPES
// ─────────────────────────────────────────────────────

/**
 * Project category for construction.
 */
export type ProjectCategory =
  | 'residential'      // Résidentiel
  | 'commercial'       // Commercial
  | 'industrial'       // Industriel
  | 'institutional'    // Institutionnel
  | 'infrastructure'   // Infrastructure
  | 'renovation'       // Rénovation
  | 'other';           // Autre

/**
 * Project status.
 */
export type ProjectStatus =
  | 'draft'
  | 'active'
  | 'on_hold'
  | 'completed'
  | 'cancelled';

/**
 * Basic project metadata.
 */
export interface ProjectInfo {
  /** Project identifier */
  id: string;
  
  /** Project name */
  name: string;
  
  /** Description */
  description?: string;
  
  /** Category */
  category?: ProjectCategory;
  
  /** Status */
  status: ProjectStatus;
  
  /** Client name */
  clientName?: string;
  
  /** Location */
  location?: string;
  
  /** Start date */
  startDate?: number;
  
  /** Target end date */
  targetEndDate?: number;
  
  /** Custom tags */
  tags?: string[];
}

// ─────────────────────────────────────────────────────
// PROJECT PRESET STATE
// ─────────────────────────────────────────────────────

/**
 * Project preset management state.
 */
export interface ProjectPresetState {
  /** Project preset mappings */
  projectPresets: ProjectPreset[];
  
  /** Currently active project ID */
  activeProjectId: string | null;
  
  /** Project info cache */
  projects: ProjectInfo[];
}

// ─────────────────────────────────────────────────────
// PROJECT PRESET EVENTS
// ─────────────────────────────────────────────────────

/**
 * Project preset events.
 */
export type ProjectPresetEvent =
  | { type: 'PROJECT_PRESET_SET'; projectId: string; presetId: string; reason?: string }
  | { type: 'PROJECT_PRESET_CLEARED'; projectId: string }
  | { type: 'ACTIVE_PROJECT_SET'; projectId: string }
  | { type: 'ACTIVE_PROJECT_CLEARED' }
  | { type: 'PROJECT_ADDED'; project: ProjectInfo }
  | { type: 'PROJECT_UPDATED'; project: ProjectInfo }
  | { type: 'PROJECT_REMOVED'; projectId: string };
