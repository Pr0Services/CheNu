/* =====================================================
   CHE·NU — JUXTAPOSITION MODULE
   Status: TRANSPARENCY & ANTI-MANIPULATION LAYER
   Authority: NONE
   Intent: MAKE CHANGE VISIBLE WITHOUT JUDGMENT
   ===================================================== */

// === NARRATIVE × DRIFT ===
export {
  // State types
  type NarrativeDriftViewState,
  type NarrativeDriftVisualConfig,
  type NarrativeDriftXRConfig,
  type DriftMarker,
  type JuxtapositionItem,
  type JuxtapositionTimeline,

  // Fundamental principles
  NARRATIVE_DRIFT_PRINCIPLE,
  ARCHITECTURE_POSITION,

  // Display rules
  OVERLAY_MAY_DISPLAY,
  EXPLICITLY_FORBIDDEN,

  // Drift representation
  DRIFT_REPRESENTATION_RULES,
  VALID_DRIFT_PHRASING,

  // Narrative protection
  NARRATIVE_PROTECTION_RULES,

  // User interaction
  USER_MAY,
  USER_MAY_NOT,

  // Visual design
  VISUAL_DESIGN_PRINCIPLES,
  DEFAULT_VISUAL_CONFIG,

  // XR
  XR_BEHAVIOR,
  DEFAULT_XR_CONFIG,

  // Failsafes
  FAILSAFES,

  // State
  INITIAL_VIEW_STATE,

  // Declaration
  NARRATIVE_DRIFT_DECLARATION,

  // Helpers
  isViewActive,
  isXRMode,
  createDriftMarker,
  isNeutralDescription,
  createJuxtapositionTimeline,
  enterView,
  exitView,
} from './narrativeDrift.types';

// Future: View components
// export { NarrativeDriftView } from './NarrativeDriftView';
// export { JuxtapositionTimeline } from './JuxtapositionTimeline';
// export { XRNarrativeDriftView } from './XRNarrativeDriftView';
