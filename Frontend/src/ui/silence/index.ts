/* =====================================================
   CHE·NU — VISUAL SILENCE MODULE
   Status: OBSERVATIONAL CLARITY LAYER
   Authority: NONE
   Intent: PRESERVE MEANING BY REDUCING NOISE
   ===================================================== */

// === VISUAL SILENCE MODE ===
export {
  // State types
  type VisualSilenceState,
  type VisualSilenceConfig,
  type VSMXRConfig,

  // Decision Echo types
  type DecisionEcho,

  // Constants - VSM Behavior
  VSM_ACTIVATED_BEHAVIOR,
  VSM_VISIBLE_ELEMENTS,
  VSM_FORBIDDEN,

  // Constants - Decision Echo
  DECISION_ECHO_OVERLAY_PRINCIPLE,
  DECISION_ECHO_SHOWS,
  DECISION_ECHO_NEVER_SHOWS,

  // Constants - Temporal Braiding
  TEMPORAL_BRAIDING_RULES,

  // Constants - User Permissions
  USER_MAY,
  USER_MAY_NOT,

  // Constants - XR
  VSM_XR_BEHAVIOR,

  // Constants - Failsafes
  VSM_FAILSAFES,

  // Constants - Configs
  DEFAULT_VSM_CONFIG,
  DEFAULT_VSM_XR_CONFIG,

  // Constants - State
  INITIAL_VSM_STATE,

  // Constants - Declaration
  VISUAL_SILENCE_DECLARATION,

  // Type guards
  isVisualSilenceActive,
  isElementVisible,
  isElementHidden,
} from './visualSilence.types';

// === NARRATIVE SILENCE ZONE ===
export {
  // State types
  type NarrativeSilenceZoneState,
  type ZoneXRConfig,

  // Activation rules
  ZONE_ACTIVATION_CONDITIONS,
  ZONE_ACTIVATION_RESTRICTIONS,

  // Visual rules
  ZONE_VISUAL_RULES,
  ZONE_TYPOGRAPHY,

  // Interaction rules
  ZONE_USER_PERMISSIONS,
  ZONE_SYSTEM_RESTRICTIONS,

  // Attachment rules
  ZONE_ATTACHMENT_RULES,
  ZONE_ATTACHMENT_TARGETS,

  // Exit rules
  ZONE_EXIT_RULES,

  // XR
  ZONE_XR_BEHAVIOR,
  DEFAULT_ZONE_XR_CONFIG,

  // Failsafes
  ZONE_FAILSAFES,

  // State
  INITIAL_ZONE_STATE,

  // Declaration
  NARRATIVE_SILENCE_ZONE_DECLARATION,

  // Type guards
  isZoneActive,
  canEnterZone,
  isEditingInZone,
} from './narrativeSilenceZone.types';

// Future: Engine and UI components
// export { VisualSilenceEngine } from './visualSilenceEngine';
// export { VisualSilenceView } from './VisualSilenceView';
// export { DecisionEchoOverlay } from './DecisionEchoOverlay';
// export { NarrativeSilenceZoneView } from './NarrativeSilenceZoneView';
