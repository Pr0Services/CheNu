/* =====================================================
   CHE·NU — NARRATIVE CONSTELLATION TYPES
   Status: OBSERVATIONAL VISUALIZATION
   Authority: NONE
   Intent: STRUCTURED PERCEPTION ONLY
   
   📜 PURPOSE:
   Visualize how multiple drift narratives coexist,
   relate, and evolve within the CHE·NU system.
   
   📜 ANSWERS ONLY:
   "How are narratives positioned relative to each other?"
   
   📜 NEVER ANSWERS:
   "Which narrative is dominant."
   "Which direction should be followed."
   ===================================================== */

import { type DriftNarrative, type NarrativeScope } from './driftNarrative.types';

/* =========================================================
   CORE TYPES
   ========================================================= */

/**
 * Drift types that can appear in narratives.
 */
export type DriftType =
  | 'preference'
  | 'context'
  | 'collective'
  | 'behavioral'
  | 'temporal';

/**
 * Time range for narratives.
 */
export interface TimeRange {
  start: string;
  end: string;
}

/**
 * Visibility level of a narrative.
 */
export type NarrativeVisibility = 'public' | 'private';

/**
 * Constellation layout modes.
 * Layouts are VIEW OPTIONS, not interpretations.
 */
export type ConstellationLayout =
  | 'spatial'        // Free constellation
  | 'clustered'      // Clustered by context
  | 'layered'        // Layered by timeframe
  | 'sphere-separated'; // Sphere-separated planes

/* =========================================================
   NARRATIVE NODE
   ========================================================= */

/**
 * A single narrative represented as a node in the constellation.
 * 
 * RULES:
 * - Size reflects narrative duration (NOT importance)
 * - Color reflects scope only
 * - Opacity reflects confidence level
 * - No ranking indicators
 */
export interface NarrativeNode {
  /** Unique narrative identifier */
  narrativeId: string;

  /** Scope of the narrative */
  scope: NarrativeScope;

  /** Time range covered by this narrative */
  timeframe: TimeRange;

  /** Types of drift included in this narrative */
  driftTypes: DriftType[];

  /** Confidence level (0.0 - 1.0) */
  confidence: number;

  /** Visibility level */
  visibility: NarrativeVisibility;

  /** Associated sphere (optional) */
  sphereId?: string;

  /** The actual narrative content */
  narrative?: DriftNarrative;

  /** Visual position (computed) */
  position?: {
    x: number;
    y: number;
    z?: number; // For 3D/XR views
  };

  /** Visual properties (computed) */
  visual?: {
    /** Size based on duration */
    size: number;

    /** Color based on scope */
    color: string;

    /** Opacity based on confidence */
    opacity: number;
  };
}

/* =========================================================
   RELATIONSHIP MODEL
   ========================================================= */

/**
 * Relationship types between narratives.
 * These are VISUAL, not analytical.
 * 
 * EXPLICITLY NOT REPRESENTED:
 * - Dependency
 * - Influence
 * - Causation
 * - Progression
 */
export type RelationshipType =
  | 'proximity'          // Shared context or timeframe
  | 'temporal-overlap'   // Overlapping time periods
  | 'shared-drift-types' // Same drift categories
  | 'sphere-adjacent';   // Same or related spheres

/**
 * A relationship link between two narrative nodes.
 */
export interface NarrativeRelationship {
  /** Source narrative ID */
  sourceId: string;

  /** Target narrative ID */
  targetId: string;

  /** Type of relationship */
  type: RelationshipType;

  /** Strength of relationship (0.0 - 1.0) */
  strength: number;

  /** Description (using ALLOWED language only) */
  description: string;
}

/* =========================================================
   CONSTELLATION STRUCTURE
   ========================================================= */

/**
 * Filter options for the constellation view.
 */
export interface ConstellationFilter {
  /** Filter by scope */
  scopes?: NarrativeScope[];

  /** Filter by timeframe */
  timeframe?: TimeRange;

  /** Filter by sphere */
  sphereIds?: string[];

  /** Filter by drift types */
  driftTypes?: DriftType[];

  /** Filter by minimum confidence */
  minConfidence?: number;

  /** Filter by visibility */
  visibility?: NarrativeVisibility;
}

/**
 * Configuration for constellation view.
 */
export interface ConstellationConfig {
  /** Current layout mode */
  layout: ConstellationLayout;

  /** Active filters */
  filters: ConstellationFilter;

  /** Show relationships */
  showRelationships: boolean;

  /** Show labels */
  showLabels: boolean;

  /** Enable comparative overlay */
  comparativeOverlay: boolean;

  /** XR mode enabled */
  xrMode: boolean;

  /** Animation speed (slow only) */
  animationSpeed: 'slow' | 'very-slow';
}

/**
 * The complete narrative constellation.
 */
export interface NarrativeConstellation {
  /** All narrative nodes */
  nodes: NarrativeNode[];

  /** Relationships between nodes */
  relationships: NarrativeRelationship[];

  /** Current configuration */
  config: ConstellationConfig;

  /** Metadata */
  metadata: {
    /** Total narratives */
    totalNarratives: number;

    /** Time range covered */
    overallTimeRange: TimeRange;

    /** Scopes represented */
    scopesRepresented: NarrativeScope[];

    /** Spheres represented */
    spheresRepresented: string[];

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
 * User interaction types with the constellation.
 * 
 * USER MAY:
 * - Pan and zoom
 * - Filter by scope, timeframe, sphere
 * - Select nodes to read narratives
 * - Toggle comparative overlays
 * 
 * USER MUST:
 * - Actively select interpretation
 * - Never receive conclusions
 */
export type ConstellationInteraction =
  | 'pan'
  | 'zoom'
  | 'select-node'
  | 'filter'
  | 'change-layout'
  | 'toggle-relationships'
  | 'toggle-overlay'
  | 'reset-view';

/**
 * Interaction event for the constellation.
 */
export interface ConstellationInteractionEvent {
  /** Type of interaction */
  type: ConstellationInteraction;

  /** Target node (if applicable) */
  targetNodeId?: string;

  /** New filter (if applicable) */
  filter?: Partial<ConstellationFilter>;

  /** New layout (if applicable) */
  layout?: ConstellationLayout;

  /** Timestamp */
  timestamp: string;
}

/**
 * Selected node state.
 */
export interface SelectedNodeState {
  /** Selected node ID */
  nodeId: string;

  /** The narrative content */
  narrative: DriftNarrative;

  /** Related nodes (by proximity) */
  relatedNodes: string[];

  /** Selection timestamp */
  selectedAt: string;
}

/* =========================================================
   XR / UNIVERSE VIEW
   ========================================================= */

/**
 * XR-specific constellation configuration.
 * 
 * RULES:
 * - Narratives appear as floating points or stars
 * - Proximity is spatial, not directional
 * - Slow transitions only
 * - No arrows, no flow lines
 * - User may walk THROUGH the constellation
 */
export interface XRConstellationConfig {
  /** Enable XR mode */
  enabled: boolean;

  /** Star appearance style */
  starStyle: 'point' | 'sphere' | 'glow';

  /** Scale of the constellation */
  scale: number;

  /** Ambient lighting */
  ambientLight: number;

  /** Enable walkthrough */
  walkthroughEnabled: boolean;

  /** Transition speed */
  transitionSpeed: 'slow' | 'very-slow';
}

/**
 * XR position in 3D space.
 */
export interface XRPosition {
  x: number;
  y: number;
  z: number;
}

/**
 * XR narrative node (extended for 3D).
 */
export interface XRNarrativeNode extends NarrativeNode {
  /** 3D position */
  position3D: XRPosition;

  /** Star brightness */
  brightness: number;

  /** Pulse animation (slow only) */
  pulseRate: number;
}

/* =========================================================
   LANGUAGE SAFETY
   ========================================================= */

/**
 * Allowed labels for constellation.
 */
export type AllowedConstellationLabel =
  | 'near'
  | 'distant'
  | 'concurrent'
  | 'overlapping'
  | 'isolated'
  | 'adjacent'
  | 'separate'
  | 'coexisting';

/**
 * Forbidden labels (NEVER USE).
 */
export type ForbiddenConstellationLabel =
  | 'central'
  | 'peripheral'
  | 'dominant'
  | 'influential'
  | 'aligned'
  | 'leading'
  | 'following'
  | 'important'
  | 'primary'
  | 'secondary';

/**
 * Allowed constellation labels as array.
 */
export const ALLOWED_CONSTELLATION_LABELS: AllowedConstellationLabel[] = [
  'near',
  'distant',
  'concurrent',
  'overlapping',
  'isolated',
  'adjacent',
  'separate',
  'coexisting',
];

/**
 * Forbidden constellation labels as array.
 */
export const FORBIDDEN_CONSTELLATION_LABELS: ForbiddenConstellationLabel[] = [
  'central',
  'peripheral',
  'dominant',
  'influential',
  'aligned',
  'leading',
  'following',
  'important',
  'primary',
  'secondary',
];

/**
 * Validate that a label is allowed.
 */
export function isAllowedLabel(label: string): boolean {
  const lowerLabel = label.toLowerCase();

  // Check against forbidden
  for (const forbidden of FORBIDDEN_CONSTELLATION_LABELS) {
    if (lowerLabel.includes(forbidden)) {
      return false;
    }
  }

  return true;
}

/* =========================================================
   CONSTANTS
   ========================================================= */

/**
 * Default constellation configuration.
 */
export const DEFAULT_CONSTELLATION_CONFIG: ConstellationConfig = {
  layout: 'spatial',
  filters: {},
  showRelationships: true,
  showLabels: true,
  comparativeOverlay: false,
  xrMode: false,
  animationSpeed: 'slow',
};

/**
 * Default XR configuration.
 */
export const DEFAULT_XR_CONSTELLATION_CONFIG: XRConstellationConfig = {
  enabled: false,
  starStyle: 'glow',
  scale: 1.0,
  ambientLight: 0.3,
  walkthroughEnabled: true,
  transitionSpeed: 'slow',
};

/**
 * Scope colors for visual representation.
 */
export const SCOPE_COLORS: Record<NarrativeScope, string> = {
  session: '#69db7c',
  project: '#4dabf7',
  sphere: '#da77f2',
  global: '#ffd43b',
};

/**
 * System declaration for the constellation view.
 */
export const NARRATIVE_CONSTELLATION_DECLARATION = `
The Narrative Constellation View exists to expand
the field of perception.

It maps narratives as they are,
not as they should be.

Clarity emerges from relational visibility,
not guidance.

Context acknowledged. Authority unchanged.
`.trim();

/**
 * Failsafes for the constellation view.
 */
export const CONSTELLATION_FAILSAFES = {
  readOnly: true,
  noAutoCentering: true,
  noHighlightedPaths: true,
  noOptimizationSuggestions: true,
  slowTransitionsOnly: true,
  noArrows: true,
  noFlowLines: true,
};

/* =========================================================
   EXPORTS
   ========================================================= */

export default NarrativeConstellation;
