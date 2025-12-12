/* =====================================================
   CHE·NU — LEGACY / INHERITANCE MODULE
   Status: HUMAN CONTINUITY & RESPONSIBILITY TRANSFER
   Authority: HUMAN ONLY (ORIGINATOR)
   Intent: PRESERVE MEANING WITHOUT CONTROL
   
   🌍 On s'unit pour mieux construire!
   ===================================================== */

export {
  // Fundamental principles
  LEGACY_FUNDAMENTAL_PRINCIPLE,
  ARCHITECTURE_POSITION,

  // What can/cannot be passed on
  CAN_BE_PASSED_ON,
  CANNOT_BE_PASSED_ON,
  FORBIDDEN_CONTENT_TYPES,
  type PassableContentType,
  type ForbiddenContentType,

  // Inheritance modes
  INHERITANCE_MODES,
  type InheritanceModeId,
  type InheritanceMode,

  // Framing & disclaimers
  MANDATORY_FRAMING,
  MANDATORY_DISCLAIMER,
  type LegacyFraming,

  // Recipient rules
  RECIPIENT_MAY,
  RECIPIENT_MAY_NOT,

  // Temporal separation
  TEMPORAL_SEPARATION_RULE,

  // XR
  XR_BEHAVIOR,
  DEFAULT_LEGACY_XR_CONFIG,
  type LegacyXRConfig,

  // Failsafes
  FAILSAFES,

  // Bundle types
  type LegacyBundle,
  type LegacyNarrativeNote,
  type LegacyDecisionEcho,
  type LegacyContextDeclaration,
  type LegacyTimeline,
  type LegacyStructuralMap,
  type LegacyMethodology,
  type LegacyRecipient,

  // Declarations
  ETHICAL_DECLARATION,
  PHILOSOPHY_STATEMENT,

  // Helpers
  canBePassedOn,
  isForbiddenContent,
  isValidLegacyBundle,
  createLegacyBundle,
  sealLegacyBundle,
  getInheritanceMode,
  canRecipientPerform,
} from './legacy.types';

// Future components
// export { LegacyCreator } from './LegacyCreator';
// export { LegacyViewer } from './LegacyViewer';
// export { LegacyBrowser } from './LegacyBrowser';
// export { XRLegacyMonument } from './XRLegacyMonument';
