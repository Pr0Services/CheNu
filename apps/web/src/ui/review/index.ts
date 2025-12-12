/* =====================================================
   CHE·NU — SILENT REVIEW MODULE
   Status: HUMAN REFLECTION MODE
   Authority: HUMAN ONLY
   Intent: OBSERVE WITHOUT ACTING
   ===================================================== */

// === TYPES ===
export {
  // State types
  type SilentReviewSessionState,
  type SilentReviewVisualConfig,
  type SilentReviewXRConfig,
  type ReviewableElement,

  // Architecture
  SILENT_REVIEW_ARCHITECTURE,

  // Reviewable elements
  REVIEWABLE_ELEMENTS,

  // Disabled behaviors
  DISABLED_BEHAVIORS,

  // Entry rules
  SESSION_ENTRY_RULES,

  // Visual & UX
  VISUAL_UX_RULES,
  DEFAULT_VISUAL_CONFIG,

  // Interaction limits
  USER_MAY,
  USER_MAY_NOT,

  // Temporal & cognitive
  TEMPORAL_COGNITIVE_EFFECTS,

  // XR
  XR_BEHAVIOR,
  DEFAULT_XR_CONFIG,

  // Exit rules
  EXIT_RULES,
  EXIT_LOGGING,

  // Failsafes
  FAILSAFES,

  // State
  INITIAL_SESSION_STATE,

  // Declaration
  SILENT_REVIEW_DECLARATION,

  // Helper functions
  enterSilentReview,
  exitSilentReview,
  isSessionActive,
  isReviewableElement,
  navigateToElement,
} from './silentReview.types';

// Future: UI components
// export { SilentReviewSession } from './SilentReviewSession';
// export { SilentReviewNavigator } from './SilentReviewNavigator';
// export { useSilentReview } from './useSilentReview';
