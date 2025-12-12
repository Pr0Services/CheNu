/* =====================================================
   CHE·NU — Role Preset Types
   
   Type definitions for user roles and their relationship
   to presets. Roles define default configurations and
   allowed presets for different user archetypes.
   ===================================================== */

import { CheNuPreset } from '../presets/preset.types';

// ─────────────────────────────────────────────────────
// USER ROLE
// ─────────────────────────────────────────────────────

/**
 * User role category.
 */
export type RoleCategory = 
  | 'executive'    // C-level, directors
  | 'operational'  // Day-to-day operations
  | 'analytical'   // Data and review focused
  | 'creative'     // Design and ideation
  | 'technical'    // Engineering and IT
  | 'field'        // On-site workers
  | 'custom';      // User-defined

/**
 * User role definition.
 */
export interface UserRole {
  /** Unique role identifier */
  id: string;
  
  /** Display label */
  label: string;
  
  /** Localized labels */
  labelI18n?: Record<string, string>;
  
  /** Short description */
  description: string;
  
  /** Localized descriptions */
  descriptionI18n?: Record<string, string>;
  
  /** Role category */
  category?: RoleCategory;
  
  /** Icon emoji */
  icon?: string;
  
  /** Primary color */
  color?: string;
  
  /** Default preset to apply when role is selected */
  defaultPresetId?: string;
  
  /** List of allowed preset IDs (empty = all allowed) */
  allowedPresets?: string[];
  
  /** List of restricted preset IDs */
  restrictedPresets?: string[];
  
  /** Default sphere to navigate to */
  defaultSphere?: string;
  
  /** Priority agents for this role */
  priorityAgents?: string[];
  
  /** Whether this is a system role */
  isSystem?: boolean;
  
  /** Creation timestamp */
  createdAt?: number;
  
  /** Last modified timestamp */
  updatedAt?: number;
}

// ─────────────────────────────────────────────────────
// PRESET ADVISOR
// ─────────────────────────────────────────────────────

/**
 * Context for preset recommendation.
 */
export interface PresetAdvisorContext {
  /** Current active role ID */
  activeRole?: string;
  
  /** Active sphere ID */
  activeSphere?: string;
  
  /** Session duration in minutes */
  sessionDurationMin: number;
  
  /** Is XR available */
  xrAvailable: boolean;
  
  /** Number of active decisions */
  activeDecisions?: number;
  
  /** Number of pending meetings */
  pendingMeetings?: number;
  
  /** Current time of day */
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  
  /** Is user on mobile */
  isMobile?: boolean;
  
  /** Cognitive load indicator (0-100) */
  cognitiveLoad?: number;
}

/**
 * Preset recommendation result.
 */
export interface PresetRecommendation {
  /** Recommended preset ID */
  presetId: string;
  
  /** Recommendation score (0-100) */
  score: number;
  
  /** Reason for recommendation */
  reason: string;
  
  /** Localized reason */
  reasonI18n?: Record<string, string>;
  
  /** Source of recommendation */
  source: 'role' | 'context' | 'history' | 'advisor';
}

// ─────────────────────────────────────────────────────
// ADVISOR LOG
// ─────────────────────────────────────────────────────

/**
 * Log entry for preset advisor suggestions.
 */
export interface AdvisorLogEntry {
  /** Timestamp */
  timestamp: number;
  
  /** Agent that made the suggestion */
  agent: string;
  
  /** Suggested preset IDs */
  suggested: string[];
  
  /** Whether suggestion was accepted */
  accepted: boolean;
  
  /** Which preset was actually selected */
  selectedPresetId?: string;
  
  /** Context at time of suggestion */
  context?: Partial<PresetAdvisorContext>;
  
  /** User feedback */
  feedback?: 'helpful' | 'not_helpful' | 'ignored';
}

// ─────────────────────────────────────────────────────
// ROLE STATE
// ─────────────────────────────────────────────────────

/**
 * Role system state.
 */
export interface RoleState {
  /** All available roles */
  roles: UserRole[];
  
  /** Currently active role ID */
  activeRoleId: string | null;
  
  /** Recent role switches */
  roleHistory: RoleSwitchEntry[];
  
  /** Advisor log */
  advisorLog: AdvisorLogEntry[];
  
  /** Maximum log entries */
  maxLogSize: number;
  
  /** Whether advisor is enabled */
  advisorEnabled: boolean;
}

/**
 * Role switch history entry.
 */
export interface RoleSwitchEntry {
  /** Role ID switched to */
  roleId: string;
  
  /** Timestamp */
  timestamp: number;
  
  /** Duration in previous role (ms) */
  previousDurationMs?: number;
}

// ─────────────────────────────────────────────────────
// ROLE EVENTS
// ─────────────────────────────────────────────────────

/**
 * Role system events.
 */
export type RoleEvent =
  | { type: 'ROLE_SELECTED'; roleId: string }
  | { type: 'ROLE_CLEARED' }
  | { type: 'ROLE_CREATED'; role: UserRole }
  | { type: 'ROLE_UPDATED'; role: UserRole }
  | { type: 'ROLE_DELETED'; roleId: string }
  | { type: 'ADVISOR_SUGGESTION'; entry: AdvisorLogEntry }
  | { type: 'ADVISOR_TOGGLED'; enabled: boolean };

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export type { CheNuPreset };
