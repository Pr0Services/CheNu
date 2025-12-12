/* =====================================================
   CHE·NU — NARRATIVE × DRIFT (READ-ONLY JUXTAPOSITION)
   Status: TRANSPARENCY & ANTI-MANIPULATION LAYER
   Authority: NONE
   Intent: MAKE CHANGE VISIBLE WITHOUT JUDGMENT
   
   📜 CORE INTENT:
   Narrative × Drift exists to allow a human to observe
   how their own expressed meaning
   and their detected behavioral drift
   evolve over time — without linking them causally.
   
   It answers only:
   "What changed, and when?"
   
   It NEVER answers:
   "Why did this change?"
   "Was this good or bad?"
   "What should be corrected?"
   ===================================================== */

import { type UserNarrativeNote } from '../notes/narrativeNotes.types';
import { type DriftSignal, type DriftEvent } from '../drift/driftVisualization.types';

/* =========================================================
   FUNDAMENTAL PRINCIPLE
   ========================================================= */

/**
 * Fundamental principle of Narrative × Drift.
 * 
 * Narratives are human expression.
 * Drift is system observation.
 * 
 * They coexist.
 * They never explain each other.
 * 
 * Any attempt to infer causality is forbidden.
 */
export const NARRATIVE_DRIFT_PRINCIPLE = {
  /** Narratives are human expression */
  narrativesAre: 'human-expression',

  /** Drift is system observation */
  driftIs: 'system-observation',

  /** They coexist */
  relationship: 'coexistence',

  /** They never explain each other */
  neverExplainEachOther: true,

  /** Any attempt to infer causality is forbidden */
  causalityInferenceForbidden: true,
} as const;

/* =========================================================
   POSITION IN ARCHITECTURE
   ========================================================= */

/**
 * Architecture position - no output flows to other systems.
 * 
 * User Narrative Notes      Drift Signals
 *         ↓                      ↓
 *         └─── READ-ONLY JUXTAPOSITION ───┐
 *                                        ↓
 *                                  Human Interpretation ONLY
 */
export const ARCHITECTURE_POSITION = {
  /** Input: User Narrative Notes */
  inputNarratives: 'user-narrative-notes',

  /** Input: Drift Signals */
  inputDrift: 'drift-signals',

  /** Output: Human Interpretation ONLY */
  output: 'human-interpretation-only',

  /** No output flows to learning */
  flowsToLearning: false,

  /** No output flows to orchestration */
  flowsToOrchestration: false,

  /** No output flows to preference systems */
  flowsToPreferenceSystems: false,

  /** No output flows to agents */
  flowsToAgents: false,
} as const;

/* =========================================================
   WHAT IS SHOWN
   ========================================================= */

/**
 * What the overlay MAY display.
 * 
 * They are visually adjacent, never connected.
 */
export const OVERLAY_MAY_DISPLAY = {
  /** Narrative notes (as written) */
  narrativeNotes: true,

  /** Drift markers (neutral indicators) */
  driftMarkers: true,

  /** Timestamps */
  timestamps: true,

  /** Context labels (text-only) */
  contextLabels: true,

  /** Visual adjacency (not connection) */
  visualRelationship: 'adjacent-never-connected',
} as const;

/* =========================================================
   EXPLICITLY FORBIDDEN
   ========================================================= */

/**
 * What the system must NOT do.
 * 
 * No arrows.
 * No color semantics.
 * No warnings.
 */
export const EXPLICITLY_FORBIDDEN = {
  /** Correlate narrative content with drift */
  correlateNarrativeWithDrift: false,

  /** Label drift as improvement or decay */
  labelDriftAsImprovement: false,
  labelDriftAsDecay: false,

  /** Highlight "alignment" or "misalignment" */
  highlightAlignment: false,
  highlightMisalignment: false,

  /** Suggest behavioral changes */
  suggestBehavioralChanges: false,

  /** Generate summaries */
  generateSummaries: false,

  /** Visual elements forbidden */
  arrows: false,
  colorSemantics: false,
  warnings: false,

  /** Causal inference */
  causalInference: false,
  correlationAnalysis: false,
  patternMatching: false,
} as const;

/* =========================================================
   DRIFT REPRESENTATION RULES
   ========================================================= */

/**
 * Drift indicators must be neutral.
 * 
 * Example:
 * "Preference usage changed in this interval."
 * NOT:
 * "You shifted priorities."
 */
export const DRIFT_REPRESENTATION_RULES = {
  /** Non-directional */
  nonDirectional: true,

  /** Non-evaluative */
  nonEvaluative: true,

  /** Context-scoped */
  contextScoped: true,

  /** Time-anchored */
  timeAnchored: true,
} as const;

/**
 * Valid drift indicator phrasing.
 */
export const VALID_DRIFT_PHRASING = {
  /** Acceptable phrasing patterns */
  acceptable: [
    'Preference usage changed in this interval.',
    'Activity pattern shifted during this period.',
    'Configuration was modified.',
    'Interaction frequency varied.',
    'Context scope changed.',
  ],

  /** Forbidden phrasing patterns */
  forbidden: [
    'You shifted priorities.',
    'Your behavior improved.',
    'Alignment decreased.',
    'Progress was made.',
    'Regression detected.',
    'You should consider...',
  ],
} as const;

/**
 * Drift marker for display.
 */
export interface DriftMarker {
  /** Unique identifier */
  id: string;

  /** Timestamp of drift */
  timestamp: string;

  /** Neutral description (no judgment) */
  description: string;

  /** Context scope */
  contextScope: string;

  /** Magnitude (0-1, no direction) */
  magnitude: number;
}

/* =========================================================
   NARRATIVE PROTECTION RULES
   ========================================================= */

/**
 * Narrative Notes protection in this view.
 * 
 * Narrative meaning remains sovereign.
 */
export const NARRATIVE_PROTECTION_RULES = {
  /** Never analyzed */
  neverAnalyzed: true,

  /** Never keyword-extracted */
  neverKeywordExtracted: true,

  /** Never ranked */
  neverRanked: true,

  /** Remain editable only outside the view */
  editableOnlyOutsideView: true,

  /** Meaning remains sovereign */
  meaningSovereign: true,
} as const;

/* =========================================================
   USER INTERACTION RULES
   ========================================================= */

/**
 * What user MAY do.
 */
export const USER_MAY = {
  /** Toggle Narrative × Drift view */
  toggleView: true,

  /** Scroll through time */
  scrollThroughTime: true,

  /** Inspect items individually */
  inspectIndividually: true,

  /** Exit without consequence */
  exitWithoutConsequence: true,
} as const;

/**
 * What user may NOT do.
 */
export const USER_MAY_NOT = {
  /** Annotate drift */
  annotateDrift: false,

  /** Confirm interpretations */
  confirmInterpretations: false,

  /** Feed conclusions back to the system */
  feedConclusionsToSystem: false,

  /** Create causal links */
  createCausalLinks: false,

  /** Label or tag correlations */
  labelCorrelations: false,
} as const;

/* =========================================================
   VISUAL DESIGN PRINCIPLES
   ========================================================= */

/**
 * Visual design principles.
 * 
 * The UI should feel observational, not diagnostic.
 */
export const VISUAL_DESIGN_PRINCIPLES = {
  /** Neutral palette */
  neutralPalette: true,

  /** Equal visual weight */
  equalVisualWeight: true,

  /** No emphasis hierarchy */
  noEmphasisHierarchy: true,

  /** Minimal labels */
  minimalLabels: true,

  /** Generous spacing */
  generousSpacing: true,

  /** Feel: observational, not diagnostic */
  feel: 'observational',
} as const;

/**
 * Visual configuration for the view.
 */
export interface NarrativeDriftVisualConfig {
  /** Color palette (neutral) */
  palette: {
    narrativeColor: string;
    driftColor: string;
    backgroundColor: string;
    textColor: string;
  };

  /** Typography */
  typography: {
    narrativeFont: string;
    driftFont: string;
    fontSize: number;
  };

  /** Spacing */
  spacing: {
    itemGap: number;
    columnGap: number;
    padding: number;
  };

  /** No emphasis allowed */
  emphasis: {
    bold: false;
    highlights: false;
    borders: false;
  };
}

/**
 * Default visual configuration.
 */
export const DEFAULT_VISUAL_CONFIG: NarrativeDriftVisualConfig = {
  palette: {
    narrativeColor: '#a0a0a0',
    driftColor: '#808080',
    backgroundColor: '#0c0c14',
    textColor: '#b0b0b0',
  },
  typography: {
    narrativeFont: 'serif',
    driftFont: 'sans-serif',
    fontSize: 14,
  },
  spacing: {
    itemGap: 24,
    columnGap: 48,
    padding: 32,
  },
  emphasis: {
    bold: false,
    highlights: false,
    borders: false,
  },
};

/* =========================================================
   XR / UNIVERSE VIEW
   ========================================================= */

/**
 * XR-specific behavior.
 * 
 * User moves between, the system does not comment.
 */
export const XR_BEHAVIOR = {
  /** Narratives appear as inscriptions */
  narrativesAppearAs: 'inscriptions',

  /** Drift appears as temporal ripples */
  driftAppearsAs: 'temporal-ripples',

  /** No physical connection between them */
  noPhysicalConnection: true,

  /** System does not comment */
  systemComments: false,

  /** User moves freely */
  userMovesFreely: true,
} as const;

/**
 * XR configuration for narrative × drift.
 */
export interface NarrativeDriftXRConfig {
  /** Narrative visualization */
  narrativeStyle: 'inscription' | 'floating-text' | 'tablet';

  /** Drift visualization */
  driftStyle: 'ripple' | 'shimmer' | 'pulse';

  /** Spatial arrangement */
  arrangement: 'parallel-streams' | 'side-by-side' | 'layered';

  /** Separation distance */
  separationDistance: number;

  /** Ambient sound */
  ambientSound: 'none' | 'subtle';
}

/**
 * Default XR configuration.
 */
export const DEFAULT_XR_CONFIG: NarrativeDriftXRConfig = {
  narrativeStyle: 'inscription',
  driftStyle: 'ripple',
  arrangement: 'parallel-streams',
  separationDistance: 50,
  ambientSound: 'none',
};

/* =========================================================
   FAILSAFES
   ========================================================= */

/**
 * Failsafes for Narrative × Drift.
 */
export const FAILSAFES = {
  /** This view never triggers learning */
  neverTriggersLearning: true,

  /** This view never generates metrics */
  neverGeneratesMetrics: true,

  /** This view cannot be exported with interpretation */
  cannotExportWithInterpretation: true,

  /** This view cannot be shared as authority */
  cannotShareAsAuthority: true,

  /** No data leaves this view */
  noDataLeaves: true,

  /** No conclusions are persisted */
  noConclusionsPersisted: true,
} as const;

/* =========================================================
   VIEW STATE
   ========================================================= */

/**
 * Narrative × Drift view state.
 */
export interface NarrativeDriftViewState {
  /** Whether the view is active */
  active: boolean;

  /** Current time position */
  timePosition?: string;

  /** Time range being viewed */
  timeRange?: {
    start: string;
    end: string;
  };

  /** Selected narrative note (for inspection) */
  selectedNarrativeId?: string;

  /** Selected drift marker (for inspection) */
  selectedDriftId?: string;

  /** XR mode active */
  xrMode: boolean;

  /** Visual configuration */
  visualConfig: NarrativeDriftVisualConfig;
}

/**
 * Initial view state.
 */
export const INITIAL_VIEW_STATE: NarrativeDriftViewState = {
  active: false,
  xrMode: false,
  visualConfig: DEFAULT_VISUAL_CONFIG,
};

/**
 * Juxtaposition item (either narrative or drift).
 */
export type JuxtapositionItem =
  | { type: 'narrative'; id: string; timestamp: string; content: string; }
  | { type: 'drift'; id: string; timestamp: string; description: string; magnitude: number; };

/**
 * Juxtaposition timeline (read-only).
 */
export interface JuxtapositionTimeline {
  /** Items in chronological order */
  items: JuxtapositionItem[];

  /** Time range */
  timeRange: {
    start: string;
    end: string;
  };

  /** Read-only flag */
  readonly: true;
}

/* =========================================================
   SYSTEM DECLARATION
   ========================================================= */

/**
 * System declaration for Narrative × Drift.
 * 
 * Narrative × Drift exists to prevent manipulation
 * by making change visible without explanation.
 * 
 * Truth is not imposed.
 * Meaning is not extracted.
 * Responsibility remains human.
 * 
 * Only those seeking clarity will use it.
 * Those seeking control will find nothing to exploit.
 */
export const NARRATIVE_DRIFT_DECLARATION = `
Narrative × Drift exists to prevent manipulation
by making change visible without explanation.

Truth is not imposed.
Meaning is not extracted.
Responsibility remains human.

Only those seeking clarity will use it.
Those seeking control will find nothing to exploit.
`.trim();

/* =========================================================
   TYPE GUARDS & HELPERS
   ========================================================= */

/**
 * Check if view is active.
 */
export function isViewActive(state: NarrativeDriftViewState): boolean {
  return state.active === true;
}

/**
 * Check if in XR mode.
 */
export function isXRMode(state: NarrativeDriftViewState): boolean {
  return state.active && state.xrMode;
}

/**
 * Create a valid drift marker (ensures neutral phrasing).
 */
export function createDriftMarker(
  id: string,
  timestamp: string,
  contextScope: string,
  magnitude: number
): DriftMarker {
  // Generate neutral description
  const description = `Activity in ${contextScope} changed during this interval.`;

  return {
    id,
    timestamp,
    description,
    contextScope,
    magnitude: Math.max(0, Math.min(1, magnitude)), // Clamp 0-1
  };
}

/**
 * Validate that a description is neutral (no judgment).
 */
export function isNeutralDescription(description: string): boolean {
  const forbiddenPatterns = [
    /improved/i,
    /declined/i,
    /better/i,
    /worse/i,
    /progress/i,
    /regression/i,
    /should/i,
    /you\s+(shifted|changed|moved)/i,
    /alignment/i,
    /misalignment/i,
  ];

  return !forbiddenPatterns.some(pattern => pattern.test(description));
}

/**
 * Create juxtaposition timeline from narratives and drift markers.
 * Does NOT correlate them - just chronological ordering.
 */
export function createJuxtapositionTimeline(
  narratives: Array<{ id: string; timestamp: string; content: string }>,
  driftMarkers: DriftMarker[]
): JuxtapositionTimeline {
  const items: JuxtapositionItem[] = [
    ...narratives.map(n => ({
      type: 'narrative' as const,
      id: n.id,
      timestamp: n.timestamp,
      content: n.content,
    })),
    ...driftMarkers.map(d => ({
      type: 'drift' as const,
      id: d.id,
      timestamp: d.timestamp,
      description: d.description,
      magnitude: d.magnitude,
    })),
  ];

  // Sort chronologically (NO correlation, just time order)
  items.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const timestamps = items.map(i => new Date(i.timestamp).getTime());
  const start = new Date(Math.min(...timestamps)).toISOString();
  const end = new Date(Math.max(...timestamps)).toISOString();

  return {
    items,
    timeRange: { start, end },
    readonly: true,
  };
}

/**
 * Enter the view.
 */
export function enterView(
  timeRange?: { start: string; end: string },
  xrMode: boolean = false
): NarrativeDriftViewState {
  return {
    active: true,
    timeRange,
    xrMode,
    visualConfig: DEFAULT_VISUAL_CONFIG,
  };
}

/**
 * Exit the view (no consequences, no data persisted).
 */
export function exitView(): NarrativeDriftViewState {
  return INITIAL_VIEW_STATE;
}

/* =========================================================
   EXPORTS
   ========================================================= */

export default NarrativeDriftViewState;
