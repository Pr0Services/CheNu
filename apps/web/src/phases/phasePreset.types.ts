/* =====================================================
   CHE·NU — Phase Preset Types
   
   Type definitions for project phases and their
   associated preset configurations.
   ===================================================== */

import { CheNuPreset } from '../presets/preset.types';

// ─────────────────────────────────────────────────────
// PHASE IDENTIFIERS
// ─────────────────────────────────────────────────────

/**
 * Standard project phase identifiers.
 */
export type PhaseId =
  | 'exploration'   // Initial discovery and ideation
  | 'analysis'      // Deep dive and research
  | 'decision'      // Choice and commitment
  | 'execution'     // Implementation and action
  | 'review'        // Evaluation and feedback
  | 'closure';      // Wrap-up and documentation

/**
 * Extended phase identifiers for construction projects.
 */
export type ConstructionPhaseId =
  | 'pre-construction'  // Planning and permits
  | 'mobilization'      // Site preparation
  | 'foundation'        // Groundwork
  | 'structure'         // Building frame
  | 'mechanical'        // MEP systems
  | 'finishing'         // Interior/exterior finish
  | 'commissioning'     // Testing and handover
  | 'warranty';         // Post-completion support

/**
 * All phase identifiers.
 */
export type AllPhaseId = PhaseId | ConstructionPhaseId;

// ─────────────────────────────────────────────────────
// PHASE DEFINITION
// ─────────────────────────────────────────────────────

/**
 * Phase metadata.
 */
export interface PhaseDefinition {
  /** Phase identifier */
  id: AllPhaseId;
  
  /** Display label */
  label: string;
  
  /** Localized labels */
  labelI18n?: Record<string, string>;
  
  /** Description */
  description: string;
  
  /** Localized descriptions */
  descriptionI18n?: Record<string, string>;
  
  /** Icon emoji */
  icon: string;
  
  /** Color for UI */
  color: string;
  
  /** Typical duration in days (estimate) */
  typicalDurationDays?: number;
  
  /** Order in sequence */
  order: number;
  
  /** Category */
  category: 'standard' | 'construction';
}

// ─────────────────────────────────────────────────────
// PHASE PRESET MAPPING
// ─────────────────────────────────────────────────────

/**
 * Mapping from phase to preset.
 */
export interface PhasePreset {
  /** Phase identifier */
  phase: AllPhaseId;
  
  /** Associated preset ID */
  presetId: string;
  
  /** Priority (for multiple mappings) */
  priority?: number;
  
  /** Conditions for this mapping */
  conditions?: PhasePresetCondition[];
}

/**
 * Conditions for phase preset mapping.
 */
export interface PhasePresetCondition {
  /** Condition type */
  type: 'role' | 'device' | 'time' | 'custom';
  
  /** Condition value */
  value: string;
  
  /** Whether condition must match */
  required: boolean;
}

// ─────────────────────────────────────────────────────
// PHASE TRANSITION
// ─────────────────────────────────────────────────────

/**
 * Phase transition event.
 */
export interface PhaseTransition {
  /** Previous phase */
  fromPhase: AllPhaseId | null;
  
  /** New phase */
  toPhase: AllPhaseId;
  
  /** Timestamp */
  timestamp: number;
  
  /** Who initiated the transition */
  initiatedBy: 'user' | 'system' | 'agent';
  
  /** Reason for transition */
  reason?: string;
  
  /** Associated project ID */
  projectId?: string;
}

// ─────────────────────────────────────────────────────
// PHASE STATE
// ─────────────────────────────────────────────────────

/**
 * Phase system state.
 */
export interface PhaseState {
  /** All phase definitions */
  phases: PhaseDefinition[];
  
  /** Phase to preset mappings */
  phasePresets: PhasePreset[];
  
  /** Current active phase */
  activePhase: AllPhaseId | null;
  
  /** Phase transition history */
  transitions: PhaseTransition[];
  
  /** Maximum history entries */
  maxHistorySize: number;
  
  /** Whether auto-preset switching is enabled */
  autoSwitchEnabled: boolean;
}

// ─────────────────────────────────────────────────────
// PHASE EVENTS
// ─────────────────────────────────────────────────────

/**
 * Phase system events.
 */
export type PhaseEvent =
  | { type: 'PHASE_ENTERED'; phase: AllPhaseId; initiatedBy: 'user' | 'system' | 'agent' }
  | { type: 'PHASE_EXITED'; phase: AllPhaseId }
  | { type: 'PHASE_PRESET_UPDATED'; mapping: PhasePreset }
  | { type: 'AUTO_SWITCH_TOGGLED'; enabled: boolean };

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export type { CheNuPreset };
