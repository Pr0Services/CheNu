/* =====================================================
   CHE·NU — COMPARATIVE DRIFT NARRATIVE TYPES
   Status: OBSERVATIONAL COMPARISON
   Authority: NONE
   Intent: DESCRIPTIVE CLARITY ONLY
   
   📜 PURPOSE:
   Describe DIFFERENCES and SIMILARITIES between
   drift narratives. NEVER define which is better.
   ===================================================== */

import type { DriftTimeline, DriftTimelinePoint, ScopeLevel } from './driftVisualization.types';

/* =========================================================
   COMPARISON AXES
   ========================================================= */

/**
 * Axis for comparison.
 */
export type ComparisonAxis =
  | 'time'        // Period A vs Period B
  | 'scope'       // Sphere vs Sphere
  | 'context'     // Exploration vs Decision
  | 'population'  // Individual vs Collective (anonymized)
  | 'project';    // Early vs Late phases

/**
 * Comparison axis definition.
 */
export interface ComparisonAxisDefinition {
  /** Type of axis */
  type: ComparisonAxis;

  /** Description of axis A */
  axisALabel: string;

  /** Description of axis B */
  axisBLabel: string;

  /** Additional notes */
  notes?: string;
}

/* =========================================================
   NARRATIVE SOURCE
   ========================================================= */

/**
 * A validated drift narrative source.
 */
export interface DriftNarrativeSource {
  /** Source ID */
  id: string;

  /** Label for this source */
  label: string;

  /** Scope of the narrative */
  scope: ScopeLevel;

  /** Scope ID if applicable */
  scopeId?: string;

  /** Time range */
  timeRange: {
    start: string;
    end: string;
  };

  /** Underlying timeline data */
  timeline: DriftTimeline;

  /** Validation status */
  validated: boolean;

  /** Schema version for compatibility */
  schemaVersion: string;
}

/* =========================================================
   OBSERVATION TYPES
   ========================================================= */

/**
 * A shared observation (present in both narratives).
 */
export interface SharedObservation {
  /** Observation ID */
  id: string;

  /** Pattern description (neutral language) */
  pattern: string;

  /** Confidence that pattern is shared */
  confidence: number;

  /** Preference keys involved */
  preferenceKeys: string[];

  /** Notes */
  notes?: string;
}

/**
 * A divergent observation (present in one but not the other).
 */
export interface DivergentObservation {
  /** Observation ID */
  id: string;

  /** Which source this is present in */
  presentIn: 'A' | 'B';

  /** Pattern description (neutral language) */
  pattern: string;

  /** Confidence in divergence */
  confidence: number;

  /** Preference keys involved */
  preferenceKeys: string[];

  /** Notes */
  notes?: string;
}

/**
 * Temporal alignment observation.
 */
export interface TemporalAlignment {
  /** Alignment type */
  type: 'simultaneous' | 'sequential' | 'independent';

  /** Description */
  description: string;

  /** Time offset if sequential (in days) */
  offsetDays?: number;

  /** Which occurred first if sequential */
  firstOccurrence?: 'A' | 'B';
}

/* =========================================================
   INTERPRETATION BOUNDARY
   ========================================================= */

/**
 * Explicit statement of what cannot be concluded.
 */
export interface InterpretationBoundary {
  /** Boundary ID */
  id: string;

  /** What cannot be concluded */
  cannotConclude: string;

  /** Reason */
  reason: string;
}

/**
 * Default interpretation boundaries.
 */
export const DEFAULT_INTERPRETATION_BOUNDARIES: InterpretationBoundary[] = [
  {
    id: 'no-causation',
    cannotConclude: 'Causal relationships between narratives',
    reason: 'Correlation does not imply causation',
  },
  {
    id: 'no-superiority',
    cannotConclude: 'Which narrative is superior or better',
    reason: 'Comparisons describe differences, not value',
  },
  {
    id: 'no-prediction',
    cannotConclude: 'Future behavior based on past patterns',
    reason: 'Past observations do not guarantee future outcomes',
  },
  {
    id: 'no-recommendation',
    cannotConclude: 'Which approach should be followed',
    reason: 'System provides observation only, not guidance',
  },
];

/* =========================================================
   COMPARATIVE NARRATIVE
   ========================================================= */

/**
 * Complete comparative drift narrative.
 */
export interface ComparativeDriftNarrative {
  /** Narrative ID */
  id: string;

  /** Comparison definition */
  definition: {
    /** Narrative A */
    narrativeA: DriftNarrativeSource;

    /** Narrative B */
    narrativeB: DriftNarrativeSource;

    /** Comparison axis */
    axis: ComparisonAxisDefinition;
  };

  /** Shared observations */
  sharedObservations: SharedObservation[];

  /** Divergent observations */
  divergentObservations: DivergentObservation[];

  /** Temporal alignment */
  temporalAlignment: TemporalAlignment;

  /** Interpretation boundaries */
  interpretationBoundaries: InterpretationBoundary[];

  /** Generated timestamp */
  generatedAt: string;

  /** Human-readable summary (neutral) */
  narrativeSummary: string;
}

/* =========================================================
   PRESENTATION MODES
   ========================================================= */

/**
 * Presentation mode for comparative narrative.
 */
export type PresentationMode =
  | 'side_by_side'      // Side-by-side text
  | 'aligned_timeline'  // Aligned timelines
  | 'layered_overlay'   // Layered overlays
  | 'split_xr'          // Split XR environments
  | 'static_report';    // Static comparison report

/**
 * Presentation configuration.
 */
export interface PresentationConfig {
  /** Mode */
  mode: PresentationMode;

  /** Is calm? */
  calm: boolean;

  /** Is neutral? */
  neutral: boolean;

  /** Is optional? */
  optional: boolean;

  /** Show interpretation boundaries? */
  showBoundaries: boolean;

  /** Show temporal alignment? */
  showTemporalAlignment: boolean;
}

/**
 * Default presentation config.
 */
export const DEFAULT_PRESENTATION_CONFIG: PresentationConfig = {
  mode: 'side_by_side',
  calm: true,
  neutral: true,
  optional: true,
  showBoundaries: true,
  showTemporalAlignment: true,
};

/* =========================================================
   LANGUAGE RULES
   ========================================================= */

/**
 * Allowed comparative terms (neutral).
 */
export const ALLOWED_COMPARATIVE_TERMS = [
  'in contrast to',
  'similarly',
  'concurrently',
  'diverged in frequency',
  'coincided temporally',
  'both showed',
  'while',
  'however',
  'appeared earlier',
  'appeared later',
  'lasted longer',
  'shorter duration',
  'coexistence',
  'parallel',
  'different',
  'similar',
] as const;

/**
 * Forbidden comparative terms (judgmental).
 */
export const FORBIDDEN_COMPARATIVE_TERMS = [
  'led to',
  'resulted in',
  'outperformed',
  'indicates superiority',
  'reflects better judgment',
  'caused',
  'because of',
  'therefore',
  'proves',
  'demonstrates superiority',
  'winning',
  'losing',
  'better',
  'worse',
  'correct',
  'incorrect',
  'should follow',
  'recommended',
] as const;

export type AllowedComparativeTerm = (typeof ALLOWED_COMPARATIVE_TERMS)[number];
export type ForbiddenComparativeTerm = (typeof FORBIDDEN_COMPARATIVE_TERMS)[number];

/**
 * Validate comparative language.
 */
export function validateComparativeLanguage(text: string): {
  valid: boolean;
  forbiddenFound: string[];
} {
  const lower = text.toLowerCase();
  const forbiddenFound: string[] = [];

  for (const term of FORBIDDEN_COMPARATIVE_TERMS) {
    if (lower.includes(term.toLowerCase())) {
      forbiddenFound.push(term);
    }
  }

  return {
    valid: forbiddenFound.length === 0,
    forbiddenFound,
  };
}

/* =========================================================
   USER INTERACTIONS
   ========================================================= */

/**
 * Allowed user interactions.
 */
export type ComparativeUserInteraction =
  | 'choose_narratives'
  | 'adjust_time_window'
  | 'export_comparison'
  | 'annotate_privately'
  | 'change_presentation_mode'
  | 'dismiss';

/**
 * Forbidden system actions.
 */
export const FORBIDDEN_SYSTEM_ACTIONS = [
  'recommend interpretations',
  'highlight conclusions',
  'frame outcomes',
  'suggest preference',
  'rank narratives',
] as const;

/* =========================================================
   XR CONFIGURATION
   ========================================================= */

/**
 * XR view configuration for comparative narratives.
 */
export interface XRComparativeConfig {
  /** View type */
  type: 'parallel_paths';

  /** NO convergence arrows */
  convergenceArrows: false;

  /** NO color suggesting direction */
  directionalColor: false;

  /** Spatial coexistence, not competition */
  spatialMode: 'coexistence';

  /** Path A visual config */
  pathA: {
    color: string;
    opacity: number;
    position: 'left' | 'top';
  };

  /** Path B visual config */
  pathB: {
    color: string;
    opacity: number;
    position: 'right' | 'bottom';
  };
}

/**
 * Default XR config.
 */
export const DEFAULT_XR_COMPARATIVE_CONFIG: XRComparativeConfig = {
  type: 'parallel_paths',
  convergenceArrows: false,
  directionalColor: false,
  spatialMode: 'coexistence',
  pathA: {
    color: '#6a6a8a',
    opacity: 0.8,
    position: 'left',
  },
  pathB: {
    color: '#8a6a6a',
    opacity: 0.8,
    position: 'right',
  },
};

/* =========================================================
   SYSTEM DECLARATION
   ========================================================= */

export const COMPARATIVE_NARRATIVE_DECLARATION = `
Comparative Drift Narratives exist to expand perspective,
not to define truth.

They show differences without hierarchy,
variation without value,
change without judgment.

Understanding remains human.
Meaning remains human.
Truth emerges from clarity, not direction.
`.trim();

/* =========================================================
   MULTI-SPHERE COMPARISON TYPES
   ========================================================= */

/**
 * Valid spheres for multi-sphere comparison.
 */
export type ComparableSphere =
  | 'personal'
  | 'creative'
  | 'business'
  | 'social'
  | 'methodology'
  | 'scholar'
  | 'institutions'
  | 'xr-spatial';

/**
 * Temporal relationship between compared narratives.
 */
export type TemporalRelationship =
  | 'concurrent'
  | 'staggered'
  | 'independent'
  | 'overlapping';

/**
 * Aggregation level for collective comparisons.
 */
export type AggregationLevel =
  | 'system-wide'
  | 'sphere-level'
  | 'context-level'
  | 'time-windowed';

/**
 * Comparison family types.
 */
export type ComparisonFamily =
  | 'multi-sphere'
  | 'individual-vs-collective';

/**
 * Multi-sphere comparison scope.
 */
export interface MultiSphereScope {
  /** Sphere being compared */
  sphere: ComparableSphere;

  /** Time range */
  timeRange: {
    start: string;
    end: string;
  };

  /** Label */
  label?: string;
}

/**
 * Multi-sphere observed pattern.
 */
export interface MultiSpherePattern {
  /** Pattern ID */
  id: string;

  /** Description (neutral language) */
  description: string;

  /** Magnitude */
  magnitude: 'low' | 'medium' | 'high';

  /** Context types involved */
  contextTypes: string[];

  /** Spheres where present */
  presentIn: ComparableSphere[];

  /** Spheres where absent */
  absentFrom: ComparableSphere[];
}

/**
 * Multi-sphere comparative narrative.
 */
export interface MultiSphereComparativeNarrative {
  /** Narrative ID */
  id: string;

  /** Comparison family */
  family: 'multi-sphere';

  /** Spheres being compared */
  spheres: MultiSphereScope[];

  /** Temporal relationship */
  temporalRelationship: TemporalRelationship;

  /** Shared patterns (across all spheres) */
  sharedPatterns: MultiSpherePattern[];

  /** Divergent patterns (unique per sphere) */
  divergentPatterns: {
    sphere: ComparableSphere;
    patterns: MultiSpherePattern[];
    summary: string;
  }[];

  /** Interpretation boundary (non-causality statement) */
  interpretationBoundary: string;

  /** Generated timestamp */
  generatedAt: string;

  /** Summary */
  summary: string;
}

/* =========================================================
   INDIVIDUAL VS COLLECTIVE TYPES
   ========================================================= */

/**
 * Individual scope drift data.
 */
export interface IndividualDriftScope {
  /** Time range */
  timeRange: {
    start: string;
    end: string;
  };

  /** Scope description */
  scopeDescription: string;

  /** Observed patterns */
  patterns: {
    id: string;
    description: string;
    contextType: string;
    magnitude: 'low' | 'medium' | 'high';
  }[];

  /** Summary */
  summary: string;
}

/**
 * Collective scope drift data.
 */
export interface CollectiveDriftScope {
  /** Time range */
  timeRange: {
    start: string;
    end: string;
  };

  /** Aggregation level */
  aggregationLevel: AggregationLevel;

  /** Participant count (anonymous) */
  participantCount: number;

  /** Drift density patterns */
  densityPatterns: {
    contextType: string;
    density: 'low' | 'medium' | 'high';
    description: string;
  }[];

  /** Summary */
  summary: string;

  /** Privacy guarantee */
  privacyGuarantee: string;
}

/**
 * Non-conclusions for individual vs collective.
 */
export interface NonConclusionStatements {
  /** What cannot be inferred */
  statements: string[];

  /** Declaration */
  declaration: string;
}

/**
 * Default non-conclusions.
 */
export const DEFAULT_NON_CONCLUSIONS: NonConclusionStatements = {
  statements: [
    'No normative alignment is implied.',
    'Similarity does not imply correctness.',
    'Divergence does not imply error.',
    'Patterns do not prescribe behavior.',
    'Comparison expands perspective only.',
  ],
  declaration: 'Truth is not computed — it is perceived.',
};

/**
 * Individual vs Collective comparative narrative.
 */
export interface IndividualVsCollectiveNarrative {
  /** Narrative ID */
  id: string;

  /** Comparison family */
  family: 'individual-vs-collective';

  /** Individual narrative */
  individual: IndividualDriftScope;

  /** Collective narrative */
  collective: CollectiveDriftScope;

  /** Areas of convergence */
  convergence: {
    patterns: string[];
    description: string;
  };

  /** Areas of divergence */
  divergence: {
    individualOnly: string[];
    collectiveOnly: string[];
    description: string;
  };

  /** Non-conclusions */
  nonConclusions: NonConclusionStatements;

  /** Generated timestamp */
  generatedAt: string;

  /** Summary */
  summary: string;
}

/* =========================================================
   EXTENDED LANGUAGE RULES
   ========================================================= */

/**
 * Additional allowed language for multi-comparative.
 */
export const ALLOWED_MULTI_COMPARATIVE_TERMS = [
  ...ALLOWED_COMPARATIVE_TERMS,
  'compared with',
  'alongside',
  'independently',
  'observed in both',
  'unique to',
  'present in',
  'absent from',
  'during the same period',
  'in parallel',
  'separately',
  'coexisted',
] as const;

/**
 * Additional forbidden language for multi-comparative.
 */
export const FORBIDDEN_MULTI_COMPARATIVE_TERMS = [
  ...FORBIDDEN_COMPARATIVE_TERMS,
  'above average',
  'below average',
  'normal',
  'abnormal',
  'aligned',
  'misaligned',
  'ahead',
  'behind',
  'optimal',
  'suboptimal',
] as const;

/* =========================================================
   EXPORTS
   ========================================================= */

export default {
  ALLOWED_COMPARATIVE_TERMS,
  FORBIDDEN_COMPARATIVE_TERMS,
  ALLOWED_MULTI_COMPARATIVE_TERMS,
  FORBIDDEN_MULTI_COMPARATIVE_TERMS,
  DEFAULT_INTERPRETATION_BOUNDARIES,
  DEFAULT_PRESENTATION_CONFIG,
  DEFAULT_XR_COMPARATIVE_CONFIG,
  DEFAULT_NON_CONCLUSIONS,
  COMPARATIVE_NARRATIVE_DECLARATION,
};
