/* =====================================================
   CHE·NU — TEMPORAL MODULE INDEX
   Status: OBSERVATIONAL TEMPORAL LAYER
   Authority: NONE
   ===================================================== */

// === TEMPORAL BRAIDING SYSTEM ===
export {
  // Types
  type StrandType,
  type StrandDensity,
  type TemporalPoint,
  type TemporalStrand,
  type TemporalOverlap,
  type AlignmentMode,
  type BraidingTimeRange,
  type BraidingConfig,
  type TemporalBraiding,
  type BraidingInteraction,
  type BraidingInteractionEvent,
  type PausedMoment,
  type XRBraidingConfig,
  type XRRibbonPoint,
  type XRTemporalRibbon,
  type AllowedTemporalTerm,
  type ForbiddenCausalTerm,
  
  // Constants
  ALLOWED_TEMPORAL_TERMS,
  FORBIDDEN_CAUSAL_TERMS,
  DEFAULT_BRAIDING_CONFIG,
  DEFAULT_XR_BRAIDING_CONFIG,
  STRAND_TYPE_COLORS,
  TEMPORAL_BRAIDING_DECLARATION,
  BRAIDING_FAILSAFES,
  
  // Functions
  isTemporallyNeutral,
} from './temporalBraiding.types';

export {
  // Engine functions
  generateBraiding,
  createStrand,
  createPoint,
  detectOverlaps,
  computeStrandLayout,
  computeStrandPath,
  getPausedMoment,
  getBraidingSummary,
  toXRBraiding,
  toXRRibbon,
  computeDensityAtTime,
  getStrand,
  getStrandOverlaps,
  applyAlignment,
  computeTimePosition,
} from './temporalBraidingEngine';

export {
  // Components
  TemporalBraidingView,
  TemporalBraidingCompact,
  
  // Hook
  useTemporalBraiding,
  
  // Types
  type TemporalBraidingViewProps,
  type TemporalBraidingCompactProps,
} from './TemporalBraidingView';
