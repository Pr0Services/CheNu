/* =====================================================
   CHE·NU — VISUAL SILENCE MODE
   + DECISION ECHO × TEMPORAL BRAIDING OVERLAY
   Status: OBSERVATIONAL CLARITY LAYER
   Authority: NONE
   Intent: PRESERVE MEANING BY REDUCING NOISE
   
   📜 CORE INTENT:
   This combined system exists to allow moments where
   the system deliberately steps back,
   showing LESS in order to reveal MORE.
   
   It supports:
   - Reflection
   - Memory reading
   - Orientation in time
   
   It NEVER supports:
   - Acceleration
   - Optimization
   - Guidance
   - Pressure to act
   ===================================================== */

/* =========================================================
   VISUAL SILENCE MODE (VSM)
   ========================================================= */

/**
 * Visual Silence Mode purpose:
 * Reduce visual, semantic, and cognitive load
 * when interpretation or reflection is needed.
 * 
 * Visual Silence Mode answers only:
 * "What remains when noise is removed?"
 */

/**
 * What Visual Silence Mode does when activated.
 */
export const VSM_ACTIVATED_BEHAVIOR = {
  /** Hides suggestions */
  hidesSuggestions: true,

  /** Hides highlights */
  hidesHighlights: true,

  /** Hides preference cues */
  hidesPreferenceCues: true,

  /** Hides comparative emphasis */
  hidesComparativeEmphasis: true,

  /** Hides urgency indicators */
  hidesUrgencyIndicators: true,

  /** Only core factual structures remain visible */
  onlyFactualStructures: true,
} as const;

/**
 * What remains visible in Visual Silence Mode.
 */
export const VSM_VISIBLE_ELEMENTS = {
  /** Timelines (neutral presentation) */
  timelines: 'neutral',

  /** Narrative markers */
  narrativeMarkers: true,

  /** Decision echoes (static, no animation) */
  decisionEchoes: 'static',

  /** Context labels (text-only) */
  contextLabels: 'text-only',

  /** Navigation affordances (minimal) */
  navigationAffordances: 'minimal',
} as const;

/**
 * What is FORBIDDEN in Visual Silence Mode.
 * 
 * Silence is not emptiness.
 * It is intentional restraint.
 */
export const VSM_FORBIDDEN = {
  /** Animations implying direction */
  animationsImplyingDirection: true,

  /** Glow effects */
  glow: true,

  /** Color emphasis */
  colorEmphasis: true,

  /** Pulse animations */
  pulse: true,

  /** Call-to-action language */
  callToActionLanguage: true,

  /** Ranking or ordering cues */
  rankingOrOrderingCues: true,
} as const;

/**
 * Visual Silence Mode state.
 */
export interface VisualSilenceState {
  /** Whether silence mode is active */
  active: boolean;

  /** When silence was activated */
  activatedAt?: string;

  /** User who activated (human only) */
  activatedBy?: string;

  /** Scope of silence (session, sphere, system) */
  scope: 'session' | 'sphere' | 'system';

  /** Elements currently hidden */
  hiddenElements: string[];

  /** Elements remaining visible */
  visibleElements: string[];
}

/**
 * Visual Silence Mode configuration.
 */
export interface VisualSilenceConfig {
  /** Default state */
  defaultActive: false;

  /** Allowed scopes */
  allowedScopes: ('session' | 'sphere' | 'system')[];

  /** Transition duration (ms) - slow, calm */
  transitionDuration: number;

  /** Transition style */
  transitionStyle: 'fade' | 'dim' | 'dissolve';

  /** XR-specific settings */
  xr: {
    /** Dim environment lighting */
    dimEnvironment: boolean;
    /** Slow or still strands */
    slowStrands: boolean;
    /** Decision echoes as fixed landmarks */
    echoesAsLandmarks: boolean;
  };
}

/**
 * Default Visual Silence configuration.
 */
export const DEFAULT_VSM_CONFIG: VisualSilenceConfig = {
  defaultActive: false,
  allowedScopes: ['session', 'sphere', 'system'],
  transitionDuration: 800,
  transitionStyle: 'fade',
  xr: {
    dimEnvironment: true,
    slowStrands: true,
    echoesAsLandmarks: true,
  },
};

/* =========================================================
   DECISION ECHO × TEMPORAL BRAIDING
   ========================================================= */

/**
 * Decision Echo × Temporal Braiding purpose:
 * Allow decisions to be read in temporal context
 * without implying causality or correctness.
 */

/**
 * Decision Echo overlay principle.
 * 
 * Decision Echoes are placed ON braided timelines
 * as immutable markers.
 * 
 * They do not connect strands.
 * They do not redirect flow.
 */
export const DECISION_ECHO_OVERLAY_PRINCIPLE = {
  /** Placed on braided timelines */
  placedOnBraidedTimelines: true,

  /** As immutable markers */
  asImmutableMarkers: true,

  /** Does NOT connect strands */
  connectsStrands: false,

  /** Does NOT redirect flow */
  redirectsFlow: false,
} as const;

/**
 * What the Decision Echo overlay shows.
 */
export const DECISION_ECHO_SHOWS = {
  /** Which decision occurred */
  whichDecision: true,

  /** When it occurred */
  whenItOccurred: true,

  /** In which context strand */
  inWhichContextStrand: true,

  /** Alongside which other strands */
  alongsideOtherStrands: true,

  /** NO arrows */
  arrows: false,

  /** NO "before / after" emphasis */
  beforeAfterEmphasis: false,

  /** NO narrative synthesis */
  narrativeSynthesis: false,
} as const;

/**
 * What the Decision Echo overlay NEVER shows.
 */
export const DECISION_ECHO_NEVER_SHOWS = {
  /** Outcomes */
  outcomes: true,

  /** Consequences */
  consequences: true,

  /** Success or failure */
  successOrFailure: true,

  /** Inferred impact */
  inferredImpact: true,
} as const;

/**
 * Decision Echo data structure.
 */
export interface DecisionEcho {
  /** Unique echo ID */
  echoId: string;

  /** Decision ID it represents */
  decisionId: string;

  /** When the decision occurred */
  occurredAt: string;

  /** Context strand it belongs to */
  contextStrandId: string;

  /** Label (text only) */
  label: string;

  /** Position in braided timeline */
  braidPosition: {
    strandIndex: number;
    temporalPosition: number;
  };

  /** Adjacent strands (for spatial awareness) */
  adjacentStrands: string[];

  /** Is this echo currently visible? */
  visible: boolean;

  /** Static presentation (no animation) */
  presentation: 'static';
}

/**
 * Temporal Braiding rules (reinforced).
 */
export const TEMPORAL_BRAIDING_RULES = {
  /** Each strand retains autonomy */
  strandAutonomy: true,

  /** Decision echoes do not dominate visual space */
  echoesDoNotDominate: true,

  /** Overlapping is allowed without merge */
  overlappingAllowedWithoutMerge: true,

  /** Silence mode prevents automatic alignment */
  silencePreventsAutoAlignment: true,

  /** Time remains plural */
  timeRemainsPlural: true,
} as const;

/* =========================================================
   USER INTERACTION RULES
   ========================================================= */

/**
 * What user MAY do in Visual Silence + Decision Echo view.
 */
export const USER_MAY = {
  /** Toggle Visual Silence Mode at any time */
  toggleSilenceMode: true,

  /** Enter silence without exiting session */
  enterSilenceWithoutExiting: true,

  /** Inspect individual echoes */
  inspectIndividualEchoes: true,

  /** Pan across braided timelines */
  panAcrossBraidedTimelines: true,
} as const;

/**
 * What user may NOT do in Visual Silence + Decision Echo view.
 */
export const USER_MAY_NOT = {
  /** Annotate echoes publicly */
  annotateEchoesPublicly: true,

  /** Modify markers */
  modifyMarkers: true,

  /** Trigger actions from this view */
  triggerActionsFromView: true,
} as const;

/* =========================================================
   XR / UNIVERSE VIEW
   ========================================================= */

/**
 * XR-specific behavior for Visual Silence Mode.
 * 
 * User moves through time,
 * time does not move toward the user.
 */
export const VSM_XR_BEHAVIOR = {
  /** Visual Silence dims the environment */
  dimsEnvironment: true,

  /** Strands slow or still */
  strandsSlowOrStill: true,

  /** Decision echoes appear as fixed landmarks */
  echoesAsFixedLandmarks: true,

  /** User moves through time */
  userMovesThoughTime: true,

  /** Time does NOT move toward user */
  timeMovesTowardUser: false,
} as const;

/**
 * XR Visual Silence configuration.
 */
export interface VSMXRConfig {
  /** Environment lighting multiplier (0-1, lower = dimmer) */
  environmentLightMultiplier: number;

  /** Strand animation speed (0 = still, 1 = normal) */
  strandAnimationSpeed: number;

  /** Echo landmark size */
  echoLandmarkSize: number;

  /** Echo landmark style */
  echoLandmarkStyle: 'monolith' | 'pillar' | 'marker' | 'stone';

  /** Ambient sound reduction */
  ambientSoundReduction: number;
}

/**
 * Default XR configuration for Visual Silence.
 */
export const DEFAULT_VSM_XR_CONFIG: VSMXRConfig = {
  environmentLightMultiplier: 0.3,
  strandAnimationSpeed: 0,
  echoLandmarkSize: 1.5,
  echoLandmarkStyle: 'monolith',
  ambientSoundReduction: 0.7,
};

/* =========================================================
   FAILSAFES
   ========================================================= */

/**
 * Visual Silence Mode failsafes.
 */
export const VSM_FAILSAFES = {
  /** Silence mode never times out automatically */
  neverTimesOut: true,

  /** Silence mode disables background learning */
  disablesBackgroundLearning: true,

  /** Silence mode disables narrative generation */
  disablesNarrativeGeneration: true,

  /** Silence mode is never suggested proactively */
  neverSuggestedProactively: true,
} as const;

/* =========================================================
   SYSTEM DECLARATION
   ========================================================= */

/**
 * System declaration for Visual Silence Mode.
 * 
 * Visual Silence exists to protect meaning.
 * 
 * Decision Echo within braided time exists
 * to preserve memory without creating destiny.
 * 
 * Nothing here tells the user what to do.
 * Nothing here implies what should have been done.
 * 
 * Clarity is allowed to emerge.
 * Responsibility remains human.
 */
export const VISUAL_SILENCE_DECLARATION = `
Visual Silence exists to protect meaning.

Decision Echo within braided time exists
to preserve memory without creating destiny.

Nothing here tells the user what to do.
Nothing here implies what should have been done.

Clarity is allowed to emerge.
Responsibility remains human.
`.trim();

/* =========================================================
   INITIAL STATE
   ========================================================= */

/**
 * Initial Visual Silence state.
 */
export const INITIAL_VSM_STATE: VisualSilenceState = {
  active: false,
  scope: 'session',
  hiddenElements: [],
  visibleElements: [
    'timelines',
    'narrativeMarkers',
    'decisionEchoes',
    'contextLabels',
    'navigationAffordances',
  ],
};

/* =========================================================
   TYPE GUARDS
   ========================================================= */

/**
 * Check if Visual Silence Mode is active.
 */
export function isVisualSilenceActive(state: VisualSilenceState): boolean {
  return state.active === true;
}

/**
 * Check if an element is visible in current state.
 */
export function isElementVisible(
  state: VisualSilenceState,
  element: string
): boolean {
  return state.visibleElements.includes(element);
}

/**
 * Check if an element is hidden in current state.
 */
export function isElementHidden(
  state: VisualSilenceState,
  element: string
): boolean {
  return state.hiddenElements.includes(element);
}

/* =========================================================
   EXPORTS
   ========================================================= */

export default VisualSilenceState;
