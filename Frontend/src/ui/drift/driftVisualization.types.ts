/* =====================================================
   CHE·NU — DRIFT VISUALIZATION TYPES
   Status: INFORMATIONAL ONLY — NO AUTHORITY
   Version: 1.0
   
   📜 PURPOSE:
   Make preference evolution VISIBLE, NOT CORRECTED.
   
   📜 CRITICAL:
   - Surface change without judgment
   - Show direction without prediction
   - Preserve user sovereignty
   - Avoid silent adaptation
   - NEVER trigger actions
   ===================================================== */

/* =========================================================
   DRIFT TIMELINE TYPES (TEMPORAL VIEW)
   ========================================================= */

/**
 * Single point in drift timeline.
 * Represents a comparison window result, NOT an individual action.
 */
export interface DriftTimelinePoint {
  /** Unique point ID */
  id: string;

  /** Timestamp of observation */
  timestamp: string;

  /** Preference ID being tracked */
  preferenceId: string;

  /** Preference key (human-readable) */
  preferenceKey: string;

  /** Scope of the preference */
  scope: 'global' | 'sphere' | 'project' | 'session';

  /** Scope ID if applicable */
  scopeId?: string;

  /** Drift magnitude at this point */
  driftMagnitude: 'none' | 'low' | 'medium' | 'high';

  /** Direction of drift (neutral language) */
  direction: string;

  /** Confidence in the observation (0.0 - 1.0) */
  confidence: number;

  /** Historical pattern at this point */
  historicalPattern?: string;

  /** Recent pattern at this point */
  recentPattern?: string;
}

/**
 * Timeline segment (collection of points).
 */
export interface DriftTimelineSegment {
  /** Segment ID */
  id: string;

  /** Start timestamp */
  startTime: string;

  /** End timestamp */
  endTime: string;

  /** Points in this segment */
  points: DriftTimelinePoint[];

  /** Granularity of segment */
  granularity: 'hour' | 'day' | 'week' | 'month';
}

/**
 * Complete drift timeline.
 */
export interface DriftTimeline {
  /** Timeline ID */
  id: string;

  /** Scope filter */
  scope?: 'global' | 'sphere' | 'project' | 'session';

  /** Scope ID if filtered */
  scopeId?: string;

  /** Segments in chronological order */
  segments: DriftTimelineSegment[];

  /** Total points count */
  totalPoints: number;

  /** Time range */
  timeRange: {
    start: string;
    end: string;
  };

  /** Generated timestamp */
  generatedAt: string;
}

/* =========================================================
   DRIFT HEATMAP TYPES (SPATIAL VIEW)
   ========================================================= */

/**
 * Preference categories for heatmap X-axis.
 */
export type PreferenceCategory =
  | 'mode'       // Working mode preferences
  | 'depth'      // Detail/depth preferences
  | 'format'     // Output format preferences
  | 'rhythm'     // Pace/timing preferences
  | 'risk';      // Risk tolerance preferences

/**
 * Scope levels for heatmap Y-axis.
 */
export type ScopeLevel = 'global' | 'sphere' | 'project' | 'session';

/**
 * Heat intensity (NOT error severity).
 */
export type HeatIntensity = 0 | 1 | 2 | 3 | 4 | 5;

/**
 * Single cell in heatmap.
 */
export interface HeatmapCell {
  /** Category (X-axis) */
  category: PreferenceCategory;

  /** Scope (Y-axis) */
  scope: ScopeLevel;

  /** Heat intensity (0-5) */
  intensity: HeatIntensity;

  /** Underlying drift count */
  driftCount: number;

  /** Average magnitude */
  avgMagnitude: 'none' | 'low' | 'medium' | 'high';

  /** Primary direction observed */
  primaryDirection?: string;

  /** Preference IDs in this cell */
  preferenceIds: string[];
}

/**
 * Complete drift heatmap.
 */
export interface DriftHeatmap {
  /** Heatmap ID */
  id: string;

  /** All cells */
  cells: HeatmapCell[];

  /** Categories present */
  categories: PreferenceCategory[];

  /** Scopes present */
  scopes: ScopeLevel[];

  /** Time window analyzed */
  timeWindow: {
    start: string;
    end: string;
    windowDays: number;
  };

  /** Generated timestamp */
  generatedAt: string;
}

/* =========================================================
   VISUALIZATION CONFIG
   ========================================================= */

/**
 * Timeline visualization config.
 */
export interface TimelineViewConfig {
  /** Granularity */
  granularity: 'hour' | 'day' | 'week' | 'month';

  /** Scope filter */
  scopeFilter?: ScopeLevel;

  /** Show confidence? */
  showConfidence: boolean;

  /** Show direction labels? */
  showDirections: boolean;

  /** Animate transitions? */
  animate: boolean;

  /** Max points to display */
  maxPoints: number;
}

/**
 * Heatmap visualization config.
 */
export interface HeatmapViewConfig {
  /** Color scheme (all neutral) */
  colorScheme: 'neutral' | 'monochrome' | 'gradient';

  /** Show cell values? */
  showValues: boolean;

  /** Show tooltips? */
  showTooltips: boolean;

  /** Cell size */
  cellSize: 'small' | 'medium' | 'large';

  /** Animate on hover? */
  animateHover: boolean;
}

/**
 * Combined visualization config.
 */
export interface DriftVisualizationConfig {
  /** Timeline config */
  timeline: TimelineViewConfig;

  /** Heatmap config */
  heatmap: HeatmapViewConfig;

  /** Is visualization enabled? */
  enabled: boolean;

  /** Is user-dismissible? */
  dismissible: boolean;

  /** Neutral mode (hides historical bias) */
  neutralMode: boolean;
}

/* =========================================================
   INTERACTION TYPES
   ========================================================= */

/**
 * Allowed user interactions.
 */
export type UserInteraction =
  | 'zoom_in'
  | 'zoom_out'
  | 'filter_scope'
  | 'filter_time'
  | 'inspect_report'
  | 'dismiss'
  | 'disable';

/**
 * Interaction event.
 */
export interface InteractionEvent {
  /** Interaction type */
  type: UserInteraction;

  /** Target (cell ID, point ID, etc.) */
  target?: string;

  /** Additional data */
  data?: Record<string, unknown>;

  /** Timestamp */
  timestamp: string;
}

/* =========================================================
   NEUTRAL LANGUAGE
   ========================================================= */

/**
 * Allowed terms for labels (neutral).
 */
export const ALLOWED_TERMS = [
  'change',
  'divergence',
  'evolution',
  'variation',
  'shift',
  'movement',
  'pattern',
  'observation',
] as const;

/**
 * Forbidden terms (judgmental).
 */
export const FORBIDDEN_TERMS = [
  'error',
  'regression',
  'anomaly',
  'correction',
  'problem',
  'issue',
  'warning',
  'alert',
  'fix',
] as const;

export type AllowedTerm = (typeof ALLOWED_TERMS)[number];
export type ForbiddenTerm = (typeof FORBIDDEN_TERMS)[number];

/**
 * Validate label uses neutral language.
 */
export function validateNeutralLanguage(text: string): {
  valid: boolean;
  forbiddenFound: ForbiddenTerm[];
} {
  const lower = text.toLowerCase();
  const forbiddenFound: ForbiddenTerm[] = [];

  for (const term of FORBIDDEN_TERMS) {
    if (lower.includes(term)) {
      forbiddenFound.push(term);
    }
  }

  return {
    valid: forbiddenFound.length === 0,
    forbiddenFound,
  };
}

/* =========================================================
   XR / ADVANCED VIEW TYPES
   ========================================================= */

/**
 * XR timeline visualization.
 */
export interface XRTimelineView {
  /** View type */
  type: 'flowing_path';

  /** Path points in 3D space */
  pathPoints: Array<{
    position: [number, number, number];
    color: string;
    intensity: number;
    driftPoint: DriftTimelinePoint;
  }>;

  /** Animation config (NO urgency implied) */
  animation: {
    speed: 'slow' | 'medium';
    loop: boolean;
    direction: 'forward';
  };
}

/**
 * XR heatmap visualization.
 */
export interface XRHeatmapView {
  /** View type */
  type: 'density_field';

  /** Density nodes in 3D space */
  densityNodes: Array<{
    position: [number, number, number];
    radius: number;
    intensity: number;
    cell: HeatmapCell;
  }>;

  /** NO alerts allowed */
  alerts: never[];
}

/* =========================================================
   DEFAULTS
   ========================================================= */

export const DEFAULT_TIMELINE_CONFIG: TimelineViewConfig = {
  granularity: 'day',
  showConfidence: true,
  showDirections: true,
  animate: false,
  maxPoints: 100,
};

export const DEFAULT_HEATMAP_CONFIG: HeatmapViewConfig = {
  colorScheme: 'neutral',
  showValues: false,
  showTooltips: true,
  cellSize: 'medium',
  animateHover: true,
};

export const DEFAULT_VISUALIZATION_CONFIG: DriftVisualizationConfig = {
  timeline: DEFAULT_TIMELINE_CONFIG,
  heatmap: DEFAULT_HEATMAP_CONFIG,
  enabled: true,
  dismissible: true,
  neutralMode: false,
};

/* =========================================================
   CONFIRMATION
   ========================================================= */

export const DRIFT_VISUALIZATION_CONFIRMATION = `
This system exists to help the user SEE change, not to influence it.
Drift visibility does not imply action.
Human awareness remains the only authority.
`.trim();

/* =========================================================
   EXPORTS
   ========================================================= */

export default {
  ALLOWED_TERMS,
  FORBIDDEN_TERMS,
  DEFAULT_TIMELINE_CONFIG,
  DEFAULT_HEATMAP_CONFIG,
  DEFAULT_VISUALIZATION_CONFIG,
  DRIFT_VISUALIZATION_CONFIRMATION,
};
