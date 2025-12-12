/* =====================================================
   CHE·NU — Phase Preset Types
   
   Type definitions for decision/project phases and their
   associated presets. Phases represent the lifecycle
   stages of a decision or project.
   ===================================================== */

// ─────────────────────────────────────────────────────
// PHASE IDENTIFIERS
// ─────────────────────────────────────────────────────

/**
 * Standard decision/project lifecycle phases.
 */
export type PhaseId =
  | 'exploration'   // Initial research and discovery
  | 'analysis'      // Deep analysis and data review
  | 'decision'      // Making the actual decision
  | 'execution'     // Implementing the decision
  | 'review'        // Post-implementation review
  | 'closure';      // Final wrap-up and archiving

/**
 * Extended phases for construction projects.
 */
export type ConstructionPhaseId =
  | 'feasibility'     // Étude de faisabilité
  | 'design'          // Conception
  | 'permits'         // Permis et approbations
  | 'procurement'     // Approvisionnement
  | 'construction'    // Construction
  | 'commissioning'   // Mise en service
  | 'handover';       // Livraison

/**
 * All available phase types.
 */
export type AnyPhaseId = PhaseId | ConstructionPhaseId;

// ─────────────────────────────────────────────────────
// PHASE DEFINITION
// ─────────────────────────────────────────────────────

/**
 * Phase metadata.
 */
export interface PhaseDefinition {
  /** Phase identifier */
  id: AnyPhaseId;
  
  /** Display label */
  label: string;
  
  /** Localized labels */
  labelI18n?: Record<string, string>;
  
  /** Short description */
  description: string;
  
  /** Localized descriptions */
  descriptionI18n?: Record<string, string>;
  
  /** Icon emoji */
  icon: string;
  
  /** Primary color */
  color: string;
  
  /** Typical duration range (days) */
  typicalDuration?: {
    min: number;
    max: number;
  };
  
  /** Order in lifecycle */
  order: number;
  
  /** Category: standard or construction */
  category: 'standard' | 'construction';
}

// ─────────────────────────────────────────────────────
// PHASE PRESET MAPPING
// ─────────────────────────────────────────────────────

/**
 * Association between a phase and its recommended preset.
 */
export interface PhasePreset {
  /** Phase identifier */
  phase: AnyPhaseId;
  
  /** Recommended preset ID */
  presetId: string;
  
  /** Priority (higher = more important) */
  priority?: number;
  
  /** Reason for this mapping */
  reason?: string;
  
  /** Localized reason */
  reasonI18n?: Record<string, string>;
}

// ─────────────────────────────────────────────────────
// PHASE TRANSITION
// ─────────────────────────────────────────────────────

/**
 * Phase transition event.
 */
export interface PhaseTransition {
  /** Previous phase */
  from: AnyPhaseId | null;
  
  /** New phase */
  to: AnyPhaseId;
  
  /** Timestamp */
  timestamp: number;
  
  /** Who triggered the transition */
  triggeredBy?: string;
  
  /** Optional notes */
  notes?: string;
}

// ─────────────────────────────────────────────────────
// PHASE STATE
// ─────────────────────────────────────────────────────

/**
 * Phase tracking state for a decision/project.
 */
export interface PhaseState {
  /** Current phase */
  currentPhase: AnyPhaseId;
  
  /** Phase started at */
  phaseStartedAt: number;
  
  /** Transition history */
  transitions: PhaseTransition[];
  
  /** Phase completion percentages */
  progress: Partial<Record<AnyPhaseId, number>>;
}
