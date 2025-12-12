/* =====================================================
   CHE·NU — TEMPORAL BRAIDING SYSTEM
   Status: OBSERVATIONAL TEMPORAL LAYER
   Authority: NONE
   Intent: MULTI-PERSPECTIVE TIME READING
   
   📜 PURPOSE:
   Visualize how multiple timelines coexist without
   being merged into a single authoritative sequence.
   
   📜 ANSWERS ONLY:
   "How did these timelines unfold side by side?"
   
   📜 NEVER ANSWERS:
   "What led to what."
   "What should have happened."
   ===================================================== */

/* =========================================================
   CORE TYPES
   ========================================================= */

/**
 * Types of temporal strands supported.
 * NO strand has priority.
 */
export type StrandType =
  | 'preference-evolution'
  | 'context-usage'
  | 'narrative-emergence'
  | 'project-phase'
  | 'meeting-occurrence'
  | 'decision-point'
  | 'drift-observation';

/**
 * Visual state of a strand at a given moment.
 */
export type StrandDensity =
  | 'thick'     // High activity density
  | 'normal'    // Regular activity
  | 'thin'      // Stability or low activity
  | 'absent';   // No data for this period

/**
 * Time point in a strand.
 */
export interface TemporalPoint {
  /** ISO timestamp */
  timestamp: string;

  /** Value or state at this point */
  value: unknown;

  /** Density/thickness at this point */
  density: StrandDensity;

  /** Confidence level (0-1) */
  confidence: number;

  /** Optional label */
  label?: string;

  /** Uncertainty indicator */
  uncertain?: boolean;
}

/**
 * A single temporal strand.
 * Each strand retains its own origin, pace, and uncertainty.
 */
export interface TemporalStrand {
  /** Unique strand identifier */
  strandId: string;

  /** Type of strand */
  type: StrandType;

  /** Display name */
  name: string;

  /** Color for visualization */
  color: string;

  /** Time points in this strand */
  points: TemporalPoint[];

  /** Start of strand */
  startTime: string;

  /** End of strand */
  endTime: string;

  /** Origin source of this strand */
  origin: string;

  /** Is strand visible? */
  visible: boolean;

  /** Strand-specific metadata */
  metadata?: Record<string, unknown>;
}

/* =========================================================
   BRAIDING STRUCTURE
   ========================================================= */

/**
 * Overlap indicator between strands.
 * Overlaps indicate COEXISTENCE, NOT causation.
 */
export interface TemporalOverlap {
  /** First strand ID */
  strandA: string;

  /** Second strand ID */
  strandB: string;

  /** Overlap start time */
  overlapStart: string;

  /** Overlap end time */
  overlapEnd: string;

  /** Overlap description (uses ALLOWED language only) */
  description: string;
}

/**
 * Alignment mode for viewing strands.
 */
export type AlignmentMode =
  | 'absolute'      // Real timestamps
  | 'relative'      // Relative to each strand's start
  | 'normalized';   // 0-100% of each strand's duration

/**
 * Time range for the braiding view.
 */
export interface BraidingTimeRange {
  /** Start of visible range */
  start: string;

  /** End of visible range */
  end: string;

  /** Zoom level (1.0 = default) */
  zoomLevel: number;

  /** Pan offset in milliseconds */
  panOffset: number;
}

/**
 * Configuration for temporal braiding view.
 */
export interface BraidingConfig {
  /** Visible strands (by ID) */
  visibleStrands: string[];

  /** Alignment mode */
  alignmentMode: AlignmentMode;

  /** Time range */
  timeRange: BraidingTimeRange;

  /** Show overlaps */
  showOverlaps: boolean;

  /** Animation paused */
  paused: boolean;

  /** XR mode */
  xrMode: boolean;

  /** Ribbon style (for XR) */
  ribbonStyle: 'flat' | 'flowing' | 'wave';
}

/**
 * Complete temporal braiding data structure.
 */
export interface TemporalBraiding {
  /** All strands */
  strands: TemporalStrand[];

  /** Detected overlaps */
  overlaps: TemporalOverlap[];

  /** Current configuration */
  config: BraidingConfig;

  /** Metadata */
  metadata: {
    /** Total time span */
    totalTimeSpan: {
      start: string;
      end: string;
    };

    /** Strand types present */
    strandTypesPresent: StrandType[];

    /** Generation timestamp */
    generatedAt: string;
  };

  /** System declaration */
  declaration: string;
}

/* =========================================================
   USER INTERACTION
   ========================================================= */

/**
 * User interactions with braiding view.
 * 
 * User MAY:
 * - Enable/disable strands
 * - Align strands by timeframe
 * - Zoom in/out
 * - Pause at any moment
 * 
 * System MUST NOT:
 * - Highlight "key moments"
 * - Propose interpretations
 * - Compress timelines automatically
 */
export type BraidingInteraction =
  | 'toggle-strand'
  | 'set-alignment'
  | 'zoom-in'
  | 'zoom-out'
  | 'pan'
  | 'pause'
  | 'resume'
  | 'reset-view';

/**
 * Interaction event for braiding.
 */
export interface BraidingInteractionEvent {
  /** Type of interaction */
  type: BraidingInteraction;

  /** Target strand (if applicable) */
  strandId?: string;

  /** New alignment mode (if applicable) */
  alignmentMode?: AlignmentMode;

  /** Zoom delta (if applicable) */
  zoomDelta?: number;

  /** Pan delta in ms (if applicable) */
  panDelta?: number;

  /** Timestamp */
  timestamp: string;
}

/**
 * Moment pause state.
 */
export interface PausedMoment {
  /** Paused timestamp */
  timestamp: string;

  /** Strands visible at this moment */
  visibleStrands: string[];

  /** Values at this moment per strand */
  strandValues: Record<string, TemporalPoint | null>;
}

/* =========================================================
   XR / UNIVERSE VIEW
   ========================================================= */

/**
 * XR-specific braiding configuration.
 * 
 * In XR:
 * - Strands appear as flowing ribbons
 * - User may move between them
 * - Depth represents temporal distance
 * - Calm motion only
 */
export interface XRBraidingConfig {
  /** Enable XR mode */
  enabled: boolean;

  /** Ribbon width */
  ribbonWidth: number;

  /** Ribbon opacity */
  ribbonOpacity: number;

  /** Depth scale (temporal distance) */
  depthScale: number;

  /** Motion speed */
  motionSpeed: 'calm' | 'very-calm';

  /** Enable walkthrough */
  walkthroughEnabled: boolean;

  /** Ribbon glow intensity */
  glowIntensity: number;
}

/**
 * 3D position for XR ribbon points.
 */
export interface XRRibbonPoint {
  /** X position (lateral) */
  x: number;

  /** Y position (vertical) */
  y: number;

  /** Z position (temporal depth) */
  z: number;

  /** Width at this point (density) */
  width: number;

  /** Opacity at this point (confidence) */
  opacity: number;
}

/**
 * XR ribbon representing a strand.
 */
export interface XRTemporalRibbon {
  /** Strand ID */
  strandId: string;

  /** Strand type */
  type: StrandType;

  /** Ribbon color */
  color: string;

  /** Ribbon points in 3D space */
  points: XRRibbonPoint[];

  /** Is ribbon visible */
  visible: boolean;
}

/* =========================================================
   LANGUAGE SAFETY
   ========================================================= */

/**
 * Allowed temporal terms.
 */
export type AllowedTemporalTerm =
  | 'concurrent'
  | 'overlapping'
  | 'adjacent'
  | 'independent'
  | 'staggered'
  | 'simultaneous'
  | 'parallel'
  | 'coexisting';

/**
 * Forbidden causal terms.
 */
export type ForbiddenCausalTerm =
  | 'before causing'
  | 'after resulting in'
  | 'leads to'
  | 'consequence'
  | 'because'
  | 'therefore'
  | 'resulted in'
  | 'caused by'
  | 'triggered'
  | 'led to';

/**
 * Allowed temporal terms array.
 */
export const ALLOWED_TEMPORAL_TERMS: AllowedTemporalTerm[] = [
  'concurrent',
  'overlapping',
  'adjacent',
  'independent',
  'staggered',
  'simultaneous',
  'parallel',
  'coexisting',
];

/**
 * Forbidden causal terms array.
 */
export const FORBIDDEN_CAUSAL_TERMS: string[] = [
  'before causing',
  'after resulting in',
  'leads to',
  'consequence',
  'because',
  'therefore',
  'resulted in',
  'caused by',
  'triggered',
  'led to',
  'as a result',
  'hence',
  'thus',
];

/**
 * Validate that text doesn't contain causal language.
 */
export function isTemporallyNeutral(text: string): boolean {
  const lowerText = text.toLowerCase();

  for (const forbidden of FORBIDDEN_CAUSAL_TERMS) {
    if (lowerText.includes(forbidden.toLowerCase())) {
      return false;
    }
  }

  return true;
}

/* =========================================================
   CONSTANTS
   ========================================================= */

/**
 * Default braiding configuration.
 */
export const DEFAULT_BRAIDING_CONFIG: BraidingConfig = {
  visibleStrands: [],
  alignmentMode: 'absolute',
  timeRange: {
    start: new Date().toISOString(),
    end: new Date().toISOString(),
    zoomLevel: 1.0,
    panOffset: 0,
  },
  showOverlaps: true,
  paused: false,
  xrMode: false,
  ribbonStyle: 'flowing',
};

/**
 * Default XR braiding configuration.
 */
export const DEFAULT_XR_BRAIDING_CONFIG: XRBraidingConfig = {
  enabled: false,
  ribbonWidth: 0.5,
  ribbonOpacity: 0.8,
  depthScale: 1.0,
  motionSpeed: 'calm',
  walkthroughEnabled: true,
  glowIntensity: 0.3,
};

/**
 * Strand type colors.
 */
export const STRAND_TYPE_COLORS: Record<StrandType, string> = {
  'preference-evolution': '#69db7c',
  'context-usage': '#4dabf7',
  'narrative-emergence': '#da77f2',
  'project-phase': '#ffd43b',
  'meeting-occurrence': '#ff6b6b',
  'decision-point': '#20c997',
  'drift-observation': '#fab005',
};

/**
 * System declaration for temporal braiding.
 */
export const TEMPORAL_BRAIDING_DECLARATION = `
Temporal Braiding preserves plurality of time.

It shows that multiple evolutions
can coexist without hierarchy.

Time is observed, not resolved.

Context acknowledged. Authority unchanged.
`.trim();

/**
 * Failsafes for temporal braiding.
 */
export const BRAIDING_FAILSAFES = {
  noStrandMerging: true,
  noAutomaticSynthesis: true,
  noInferredOrdering: true,
  noHistoricalCorrection: true,
  noKeyMomentHighlighting: true,
  noProposedInterpretations: true,
  noAutomaticCompression: true,
  noArrows: true,
  noBranchingImplyingOutcome: true,
  calmMotionOnly: true,
};

/* =========================================================
   EXPORTS
   ========================================================= */

export default TemporalBraiding;
