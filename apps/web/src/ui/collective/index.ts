/* =====================================================
   CHE·NU — COLLECTIVE MODULE
   Status: COLLECTIVE AWARENESS LAYER
   Authority: NONE
   Intent: OBSERVE SYSTEMIC CHANGE WITHOUT POWER
   ===================================================== */

// === COLLECTIVE DRIFT ===
export {
  // State types
  type CollectiveDriftViewState,
  type CollectiveDriftPrivacyConfig,
  type CollectiveDriftXRConfig,
  type CollectiveDriftSignal,
  type CollectiveDriftEnvelope,
  type ValidTemporalLabel,

  // Fundamental safety
  FUNDAMENTAL_SAFETY_PRINCIPLE,
  ARCHITECTURE_POSITION,

  // Input constraints
  ALLOWED_INPUTS,
  FORBIDDEN_INPUTS,

  // Privacy & blinding
  PRIVACY_BLINDING_RULES,
  DEFAULT_PRIVACY_CONFIG,

  // Display rules
  MAY_DISPLAY,
  VALID_DISPLAY_PHRASING,

  // Forbidden actions
  FORBIDDEN_ACTIONS,

  // Temporal representation
  TEMPORAL_REPRESENTATION,

  // User interaction
  USER_MAY,
  USER_MAY_NOT,

  // XR
  XR_BEHAVIOR,
  DEFAULT_XR_CONFIG,

  // Failsafes
  FAILSAFES,

  // State
  INITIAL_VIEW_STATE,

  // Ethical guarantee
  ETHICAL_GUARANTEE,
  COLLECTIVE_DRIFT_DECLARATION,

  // Helpers
  isViewActive,
  isCohortThresholdMet,
  shouldRenderSignal,
  isNeutralPhrasing,
  createCollectiveDriftSignal,
  enterView,
  exitView,
} from './collectiveDrift.types';

// Future: View components
// export { CollectiveDriftView } from './CollectiveDriftView';
// export { CollectiveDriftEnvelopeViz } from './CollectiveDriftEnvelopeViz';
// export { XRCollectiveDriftView } from './XRCollectiveDriftView';
