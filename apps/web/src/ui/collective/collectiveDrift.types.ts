/* =====================================================
   CHE·NU — COLLECTIVE DRIFT
   (Non-Attributive, Non-Directive)
   Status: COLLECTIVE AWARENESS LAYER
   Authority: NONE
   Intent: OBSERVE SYSTEMIC CHANGE WITHOUT POWER
   
   📜 CORE INTENT:
   Collective Drift exists to make large-scale
   behavioral and contextual shifts visible
   without identifying, targeting, or influencing individuals.
   
   It answers only:
   "What patterns emerged at scale over time?"
   
   It NEVER answers:
   "Who caused this?"
   "How should this be corrected?"
   "How can this be leveraged?"
   ===================================================== */

/* =========================================================
   FUNDAMENTAL SAFETY PRINCIPLE
   ========================================================= */

/**
 * Fundamental safety principle.
 * 
 * No individual can be inferred, reconstructed,
 * or acted upon through Collective Drift.
 * 
 * If individual inference becomes possible,
 * the view must collapse to silence.
 */
export const FUNDAMENTAL_SAFETY_PRINCIPLE = {
  /** No individual can be inferred */
  noIndividualInference: true,

  /** No individual can be reconstructed */
  noIndividualReconstruction: true,

  /** No individual can be acted upon */
  noIndividualAction: true,

  /** If inference becomes possible, collapse to silence */
  collapseToSilenceOnViolation: true,
} as const;

/* =========================================================
   POSITION IN ARCHITECTURE
   ========================================================= */

/**
 * Architecture position.
 * 
 * Anonymized Drift Signals (many)
 *         ↓
 * AGGREGATION & BLINDING
 *         ↓
 * COLLECTIVE DRIFT VIEW (READ-ONLY)
 *         ↓
 * Human Interpretation ONLY
 */
export const ARCHITECTURE_POSITION = {
  /** Input: Anonymized Drift Signals (many) */
  input: 'anonymized-drift-signals',

  /** Processing: Aggregation & Blinding */
  processing: 'aggregation-and-blinding',

  /** Output: Human Interpretation ONLY */
  output: 'human-interpretation-only',

  /** No output flows to orchestration */
  flowsToOrchestration: false,

  /** No output flows to agents */
  flowsToAgents: false,

  /** No output flows to learning */
  flowsToLearning: false,

  /** No output flows to policy enforcement */
  flowsToPolicyEnforcement: false,

  /** No output flows to optimization systems */
  flowsToOptimizationSystems: false,
} as const;

/* =========================================================
   INPUT CONSTRAINTS (STRICT)
   ========================================================= */

/**
 * Allowed inputs (aggregated signals only).
 */
export const ALLOWED_INPUTS = {
  /** Frequency deltas */
  frequencyDeltas: true,

  /** Distribution shifts */
  distributionShifts: true,

  /** Volatility envelopes */
  volatilityEnvelopes: true,

  /** Temporal clustering */
  temporalClustering: true,
} as const;

/**
 * Forbidden inputs.
 */
export const FORBIDDEN_INPUTS = {
  /** Content */
  content: false,

  /** Decisions */
  decisions: false,

  /** Narratives */
  narratives: false,

  /** Identities */
  identities: false,

  /** Groups smaller than threshold N */
  smallGroups: false,

  /** Individual signals */
  individualSignals: false,

  /** Attributable data */
  attributableData: false,
} as const;

/* =========================================================
   PRIVACY & BLINDING RULES
   ========================================================= */

/**
 * Privacy and blinding rules.
 * 
 * If a slice violates safety → it is not rendered.
 */
export const PRIVACY_BLINDING_RULES = {
  /** Minimum cohort size enforced (N-threshold) */
  minimumCohortSizeEnforced: true,

  /** Temporal smoothing applied */
  temporalSmoothingApplied: true,

  /** Noise injection where required */
  noiseInjectionWhereRequired: true,

  /** No cross-slice reconstruction possible */
  noCrossSliceReconstruction: true,

  /** Violation handling: not rendered */
  violationHandling: 'not-rendered',
} as const;

/**
 * Privacy configuration.
 */
export interface CollectiveDriftPrivacyConfig {
  /** Minimum cohort size (N-threshold) */
  minimumCohortSize: number;

  /** Temporal smoothing window (hours) */
  temporalSmoothingWindow: number;

  /** Noise injection level (0-1) */
  noiseInjectionLevel: number;

  /** Maximum slice granularity */
  maxSliceGranularity: 'day' | 'week' | 'month' | 'quarter';
}

/**
 * Default privacy configuration.
 */
export const DEFAULT_PRIVACY_CONFIG: CollectiveDriftPrivacyConfig = {
  minimumCohortSize: 100,
  temporalSmoothingWindow: 168, // 1 week in hours
  noiseInjectionLevel: 0.15,
  maxSliceGranularity: 'week',
};

/* =========================================================
   WHAT IS SHOWN
   ========================================================= */

/**
 * What the Collective Drift view MAY display.
 */
export const MAY_DISPLAY = {
  /** Trend envelopes (not lines) */
  trendEnvelopes: true,
  trendLines: false,

  /** Time windows (not dates) */
  timeWindows: true,
  specificDates: false,

  /** Magnitude bands (not values) */
  magnitudeBands: true,
  specificValues: false,

  /** Context labels (generic) */
  genericContextLabels: true,
  specificContextLabels: false,
} as const;

/**
 * Valid display phrasing.
 */
export const VALID_DISPLAY_PHRASING = {
  /** Acceptable phrasing patterns */
  acceptable: [
    'Context preference variance increased in this period.',
    'Activity distribution shifted during this window.',
    'Temporal clustering emerged in this phase.',
    'Volatility envelope expanded across contexts.',
    'Frequency patterns changed systemically.',
  ],

  /** Forbidden phrasing patterns */
  forbidden: [
    'Users shifted priorities.',
    'The team changed behavior.',
    'Individuals moved toward...',
    'People are now...',
    'You should consider...',
    'This indicates...',
  ],
} as const;

/* =========================================================
   WHAT IS FORBIDDEN
   ========================================================= */

/**
 * What the system must NOT do.
 * 
 * No alerts. No calls to action.
 */
export const FORBIDDEN_ACTIONS = {
  /** Name domains with moral loading */
  nameMorallyLoadedDomains: false,

  /** Suggest causes */
  suggestCauses: false,

  /** Predict trajectories */
  predictTrajectories: false,

  /** Highlight risk or opportunity */
  highlightRiskOrOpportunity: false,

  /** Compare groups competitively */
  compareGroupsCompetitively: false,

  /** Generate alerts */
  alerts: false,

  /** Calls to action */
  callsToAction: false,

  /** Recommendations */
  recommendations: false,

  /** Predictions */
  predictions: false,
} as const;

/* =========================================================
   TEMPORAL REPRESENTATION
   ========================================================= */

/**
 * Time representation rules.
 */
export const TEMPORAL_REPRESENTATION = {
  /** Time shown as ranges */
  showAsRanges: true,

  /** Time shown as phases */
  showAsPhases: true,

  /** Time shown as seasons */
  showAsSeasons: true,

  /** Never show as deadlines */
  showAsDeadlines: false,

  /** Never show as countdowns */
  showAsCountdowns: false,

  /** Never show as acceleration curves */
  showAsAccelerationCurves: false,
} as const;

/**
 * Valid temporal labels.
 */
export type ValidTemporalLabel =
  | 'early-period'
  | 'mid-period'
  | 'late-period'
  | 'transition-window'
  | 'stability-phase'
  | 'emergence-phase'
  | 'seasonal-shift';

/* =========================================================
   USER INTERACTION RULES
   ========================================================= */

/**
 * What user MAY do.
 */
export const USER_MAY = {
  /** Pan across time */
  panAcrossTime: true,

  /** Switch abstraction level */
  switchAbstractionLevel: true,

  /** Enable Visual Silence Mode */
  enableVisualSilenceMode: true,

  /** Exit freely */
  exitFreely: true,
} as const;

/**
 * What user may NOT do.
 */
export const USER_MAY_NOT = {
  /** Drill down to individuals */
  drillDownToIndividuals: false,

  /** Segment by identity */
  segmentByIdentity: false,

  /** Export raw signals */
  exportRawSignals: false,

  /** Annotate with conclusions */
  annotateWithConclusions: false,

  /** Create attribution */
  createAttribution: false,

  /** Enable tracking */
  enableTracking: false,
} as const;

/* =========================================================
   XR / UNIVERSE VIEW
   ========================================================= */

/**
 * XR-specific behavior.
 * 
 * The user is inside the pattern, not above it.
 */
export const XR_BEHAVIOR = {
  /** Appears as atmospheric movement */
  appearsAsAtmosphericMovement: true,

  /** No fixed objects */
  noFixedObjects: true,

  /** No focal targets */
  noFocalTargets: true,

  /** User is inside the pattern */
  userInsidePattern: true,

  /** User is NOT above it */
  userAbovePattern: false,
} as const;

/**
 * XR configuration for collective drift.
 */
export interface CollectiveDriftXRConfig {
  /** Visualization style */
  visualizationStyle: 'atmospheric' | 'nebular' | 'oceanic' | 'auroral';

  /** Density representation */
  densityRepresentation: 'opacity' | 'particle-count' | 'wave-amplitude';

  /** Movement speed (slow, deliberate) */
  movementSpeed: number;

  /** User position */
  userPosition: 'immersed' | 'floating';

  /** Ambient sound */
  ambientSound: 'none' | 'subtle-wind' | 'deep-hum';
}

/**
 * Default XR configuration.
 */
export const DEFAULT_XR_CONFIG: CollectiveDriftXRConfig = {
  visualizationStyle: 'atmospheric',
  densityRepresentation: 'opacity',
  movementSpeed: 0.1,
  userPosition: 'immersed',
  ambientSound: 'subtle-wind',
};

/* =========================================================
   FAILSAFES
   ========================================================= */

/**
 * Failsafes for Collective Drift.
 * 
 * Visibility requires intent.
 */
export const FAILSAFES = {
  /** Never enables action */
  neverEnablesAction: true,

  /** Never feeds decisions */
  neverFeedsDecisions: true,

  /** Never influences agents */
  neverInfluencesAgents: true,

  /** Never shown by default */
  neverShownByDefault: true,

  /** Visibility requires intent */
  visibilityRequiresIntent: true,

  /** Cannot be automated */
  cannotBeAutomated: true,

  /** Cannot be scheduled */
  cannotBeScheduled: true,
} as const;

/* =========================================================
   VIEW STATE
   ========================================================= */

/**
 * Collective Drift view state.
 */
export interface CollectiveDriftViewState {
  /** Whether the view is active */
  active: boolean;

  /** Current time window */
  timeWindow?: {
    start: ValidTemporalLabel;
    end: ValidTemporalLabel;
  };

  /** Abstraction level */
  abstractionLevel: 'high' | 'medium' | 'low';

  /** Visual Silence Mode enabled */
  visualSilenceEnabled: boolean;

  /** XR mode active */
  xrMode: boolean;

  /** Privacy config */
  privacyConfig: CollectiveDriftPrivacyConfig;
}

/**
 * Initial view state.
 */
export const INITIAL_VIEW_STATE: CollectiveDriftViewState = {
  active: false,
  abstractionLevel: 'high',
  visualSilenceEnabled: false,
  xrMode: false,
  privacyConfig: DEFAULT_PRIVACY_CONFIG,
};

/* =========================================================
   COLLECTIVE DRIFT SIGNAL
   ========================================================= */

/**
 * A collective drift signal (already aggregated and blinded).
 */
export interface CollectiveDriftSignal {
  /** Signal ID */
  id: string;

  /** Time window (not specific date) */
  timeWindow: ValidTemporalLabel;

  /** Context scope (generic) */
  contextScope: string;

  /** Magnitude band (not specific value) */
  magnitudeBand: 'minimal' | 'low' | 'moderate' | 'elevated' | 'high';

  /** Direction (none - non-directional) */
  direction: 'none';

  /** Cohort size met threshold */
  cohortThresholdMet: boolean;

  /** Noise injected */
  noiseInjected: boolean;
}

/**
 * Collective drift envelope (trend visualization).
 */
export interface CollectiveDriftEnvelope {
  /** Envelope ID */
  id: string;

  /** Time windows covered */
  timeWindows: ValidTemporalLabel[];

  /** Context scope */
  contextScope: string;

  /** Upper band */
  upperBand: number[];

  /** Lower band */
  lowerBand: number[];

  /** Privacy validated */
  privacyValidated: boolean;
}

/* =========================================================
   ETHICAL GUARANTEE
   ========================================================= */

/**
 * Ethical guarantee for Collective Drift.
 * 
 * Collective Drift exists to prevent
 * the weaponization of awareness.
 * 
 * It gives vision without leverage,
 * knowledge without control,
 * and understanding without authority.
 */
export const ETHICAL_GUARANTEE = {
  /** Prevents weaponization of awareness */
  preventsWeaponization: true,

  /** Gives vision without leverage */
  visionWithoutLeverage: true,

  /** Gives knowledge without control */
  knowledgeWithoutControl: true,

  /** Gives understanding without authority */
  understandingWithoutAuthority: true,
} as const;

/**
 * System declaration for Collective Drift.
 */
export const COLLECTIVE_DRIFT_DECLARATION = `
Collective Drift exists to prevent
the weaponization of awareness.

It gives vision without leverage,
knowledge without control,
and understanding without authority.
`.trim();

/* =========================================================
   TYPE GUARDS & HELPERS
   ========================================================= */

/**
 * Check if view is active.
 */
export function isViewActive(state: CollectiveDriftViewState): boolean {
  return state.active === true;
}

/**
 * Check if cohort threshold is met.
 */
export function isCohortThresholdMet(
  cohortSize: number,
  config: CollectiveDriftPrivacyConfig
): boolean {
  return cohortSize >= config.minimumCohortSize;
}

/**
 * Check if signal should be rendered (privacy safe).
 */
export function shouldRenderSignal(signal: CollectiveDriftSignal): boolean {
  return signal.cohortThresholdMet && signal.noiseInjected;
}

/**
 * Validate that phrasing is neutral (no attribution).
 */
export function isNeutralPhrasing(text: string): boolean {
  const forbiddenPatterns = [
    /users?\s+(shifted|changed|moved)/i,
    /team\s+(shifted|changed|moved)/i,
    /individuals?\s+(shifted|changed|moved)/i,
    /people\s+(are|were|have)/i,
    /you\s+should/i,
    /this\s+indicates/i,
    /this\s+suggests/i,
    /caused\s+by/i,
    /due\s+to/i,
  ];

  return !forbiddenPatterns.some(pattern => pattern.test(text));
}

/**
 * Create a privacy-safe collective drift signal.
 */
export function createCollectiveDriftSignal(
  id: string,
  timeWindow: ValidTemporalLabel,
  contextScope: string,
  magnitudeBand: CollectiveDriftSignal['magnitudeBand'],
  cohortSize: number,
  config: CollectiveDriftPrivacyConfig
): CollectiveDriftSignal | null {
  // Check cohort threshold
  if (cohortSize < config.minimumCohortSize) {
    // Collapse to silence - do not render
    return null;
  }

  return {
    id,
    timeWindow,
    contextScope,
    magnitudeBand,
    direction: 'none', // Always non-directional
    cohortThresholdMet: true,
    noiseInjected: true,
  };
}

/**
 * Enter the collective drift view (requires intent).
 */
export function enterView(
  abstractionLevel: CollectiveDriftViewState['abstractionLevel'] = 'high',
  xrMode: boolean = false
): CollectiveDriftViewState {
  return {
    active: true,
    abstractionLevel,
    visualSilenceEnabled: false,
    xrMode,
    privacyConfig: DEFAULT_PRIVACY_CONFIG,
  };
}

/**
 * Exit the view.
 */
export function exitView(): CollectiveDriftViewState {
  return INITIAL_VIEW_STATE;
}

/* =========================================================
   EXPORTS
   ========================================================= */

export default CollectiveDriftViewState;
