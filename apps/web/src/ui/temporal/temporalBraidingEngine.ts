/* =====================================================
   CHE·NU — TEMPORAL BRAIDING ENGINE
   Status: OBSERVATIONAL TEMPORAL LAYER
   Authority: NONE
   
   📜 PURPOSE:
   Compute strand layouts and overlaps for temporal
   braiding visualization.
   
   📜 RULES:
   - No strand merging
   - No automatic synthesis
   - No inferred ordering
   - No historical "correction"
   ===================================================== */

import { AGENT_CONFIRMATION } from '../../core/agents/internalAgentContext';
import {
  type TemporalStrand,
  type TemporalPoint,
  type TemporalOverlap,
  type TemporalBraiding,
  type BraidingConfig,
  type AlignmentMode,
  type StrandType,
  type StrandDensity,
  type XRTemporalRibbon,
  type XRRibbonPoint,
  type PausedMoment,
  STRAND_TYPE_COLORS,
  DEFAULT_BRAIDING_CONFIG,
  TEMPORAL_BRAIDING_DECLARATION,
  ALLOWED_TEMPORAL_TERMS,
  isTemporallyNeutral,
} from './temporalBraiding.types';

/* =========================================================
   STRAND CREATION
   ========================================================= */

/**
 * Create a new temporal strand.
 */
export function createStrand(
  id: string,
  type: StrandType,
  name: string,
  points: TemporalPoint[],
  origin: string
): TemporalStrand {
  const sortedPoints = [...points].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const startTime = sortedPoints.length > 0
    ? sortedPoints[0].timestamp
    : new Date().toISOString();

  const endTime = sortedPoints.length > 0
    ? sortedPoints[sortedPoints.length - 1].timestamp
    : new Date().toISOString();

  return {
    strandId: id,
    type,
    name,
    color: STRAND_TYPE_COLORS[type],
    points: sortedPoints,
    startTime,
    endTime,
    origin,
    visible: true,
  };
}

/**
 * Create temporal point.
 */
export function createPoint(
  timestamp: string,
  value: unknown,
  density: StrandDensity = 'normal',
  confidence: number = 0.8,
  label?: string
): TemporalPoint {
  return {
    timestamp,
    value,
    density,
    confidence,
    label,
    uncertain: confidence < 0.5,
  };
}

/* =========================================================
   OVERLAP DETECTION
   ========================================================= */

/**
 * Detect overlaps between strands.
 * Overlaps indicate COEXISTENCE, NOT causation.
 */
export function detectOverlaps(strands: TemporalStrand[]): TemporalOverlap[] {
  const overlaps: TemporalOverlap[] = [];

  for (let i = 0; i < strands.length; i++) {
    for (let j = i + 1; j < strands.length; j++) {
      const strandA = strands[i];
      const strandB = strands[j];

      const overlap = computeOverlap(strandA, strandB);
      if (overlap) {
        overlaps.push(overlap);
      }
    }
  }

  return overlaps;
}

/**
 * Compute overlap between two strands.
 */
function computeOverlap(
  strandA: TemporalStrand,
  strandB: TemporalStrand
): TemporalOverlap | null {
  const aStart = new Date(strandA.startTime).getTime();
  const aEnd = new Date(strandA.endTime).getTime();
  const bStart = new Date(strandB.startTime).getTime();
  const bEnd = new Date(strandB.endTime).getTime();

  const overlapStart = Math.max(aStart, bStart);
  const overlapEnd = Math.min(aEnd, bEnd);

  if (overlapEnd <= overlapStart) {
    return null;
  }

  // Generate description using ALLOWED language only
  const description = describeOverlap(strandA, strandB, overlapEnd - overlapStart);

  return {
    strandA: strandA.strandId,
    strandB: strandB.strandId,
    overlapStart: new Date(overlapStart).toISOString(),
    overlapEnd: new Date(overlapEnd).toISOString(),
    description,
  };
}

/**
 * Describe overlap using only ALLOWED terms.
 * NO causal language.
 */
function describeOverlap(
  strandA: TemporalStrand,
  strandB: TemporalStrand,
  durationMs: number
): string {
  const durationDays = durationMs / (1000 * 60 * 60 * 24);

  // Use ALLOWED terms only
  if (durationDays < 1) {
    return `${strandA.name} and ${strandB.name} are concurrent`;
  } else if (durationDays < 7) {
    return `${strandA.name} and ${strandB.name} are overlapping`;
  } else {
    return `${strandA.name} and ${strandB.name} are coexisting`;
  }
}

/* =========================================================
   BRAIDING GENERATION
   ========================================================= */

/**
 * Generate complete temporal braiding.
 */
export function generateBraiding(
  strands: TemporalStrand[],
  config: Partial<BraidingConfig> = {}
): TemporalBraiding {
  const fullConfig: BraidingConfig = {
    ...DEFAULT_BRAIDING_CONFIG,
    ...config,
    visibleStrands: config.visibleStrands || strands.map((s) => s.strandId),
  };

  // Compute overall time span
  const allTimes = strands.flatMap((s) => [
    new Date(s.startTime).getTime(),
    new Date(s.endTime).getTime(),
  ]);

  const minTime = Math.min(...allTimes);
  const maxTime = Math.max(...allTimes);

  // Update time range if not set
  if (!config.timeRange) {
    fullConfig.timeRange = {
      start: new Date(minTime).toISOString(),
      end: new Date(maxTime).toISOString(),
      zoomLevel: 1.0,
      panOffset: 0,
    };
  }

  // Detect overlaps
  const overlaps = detectOverlaps(strands);

  // Get strand types present
  const strandTypesPresent = [...new Set(strands.map((s) => s.type))];

  return {
    strands,
    overlaps,
    config: fullConfig,
    metadata: {
      totalTimeSpan: {
        start: new Date(minTime).toISOString(),
        end: new Date(maxTime).toISOString(),
      },
      strandTypesPresent,
      generatedAt: new Date().toISOString(),
    },
    declaration: TEMPORAL_BRAIDING_DECLARATION,
  };
}

/* =========================================================
   STRAND LAYOUT COMPUTATION
   ========================================================= */

/**
 * Compute Y position for each strand in the view.
 * Strands are laid out vertically with equal spacing.
 */
export function computeStrandLayout(
  braiding: TemporalBraiding,
  viewHeight: number,
  padding: number = 40
): Map<string, number> {
  const visibleStrands = braiding.strands.filter((s) =>
    braiding.config.visibleStrands.includes(s.strandId)
  );

  const layout = new Map<string, number>();
  const usableHeight = viewHeight - padding * 2;
  const spacing = usableHeight / Math.max(visibleStrands.length, 1);

  visibleStrands.forEach((strand, index) => {
    layout.set(strand.strandId, padding + spacing * (index + 0.5));
  });

  return layout;
}

/**
 * Compute X position for a timestamp in the view.
 */
export function computeTimePosition(
  timestamp: string,
  braiding: TemporalBraiding,
  viewWidth: number,
  padding: number = 40
): number {
  const time = new Date(timestamp).getTime();
  const startTime = new Date(braiding.config.timeRange.start).getTime();
  const endTime = new Date(braiding.config.timeRange.end).getTime();
  const totalDuration = endTime - startTime || 1;

  const usableWidth = viewWidth - padding * 2;
  const normalizedTime = (time - startTime) / totalDuration;

  // Apply zoom and pan
  const zoomed = normalizedTime * braiding.config.timeRange.zoomLevel;
  const panned = zoomed + (braiding.config.timeRange.panOffset / totalDuration);

  return padding + panned * usableWidth;
}

/**
 * Compute strand path points for rendering.
 */
export function computeStrandPath(
  strand: TemporalStrand,
  braiding: TemporalBraiding,
  viewWidth: number,
  strandY: number
): { x: number; y: number; width: number; opacity: number }[] {
  const pathPoints: { x: number; y: number; width: number; opacity: number }[] = [];

  for (const point of strand.points) {
    const x = computeTimePosition(point.timestamp, braiding, viewWidth);

    // Width based on density
    const widthMap: Record<StrandDensity, number> = {
      thick: 16,
      normal: 10,
      thin: 4,
      absent: 0,
    };

    pathPoints.push({
      x,
      y: strandY,
      width: widthMap[point.density],
      opacity: point.confidence,
    });
  }

  return pathPoints;
}

/* =========================================================
   ALIGNMENT MODES
   ========================================================= */

/**
 * Apply alignment mode to points.
 */
export function applyAlignment(
  strand: TemporalStrand,
  mode: AlignmentMode,
  braiding: TemporalBraiding
): TemporalPoint[] {
  switch (mode) {
    case 'absolute':
      return strand.points;

    case 'relative':
      return applyRelativeAlignment(strand);

    case 'normalized':
      return applyNormalizedAlignment(strand);

    default:
      return strand.points;
  }
}

/**
 * Relative alignment: timestamps relative to strand start.
 */
function applyRelativeAlignment(strand: TemporalStrand): TemporalPoint[] {
  const startTime = new Date(strand.startTime).getTime();

  return strand.points.map((point) => ({
    ...point,
    timestamp: new Date(
      new Date(point.timestamp).getTime() - startTime
    ).toISOString(),
  }));
}

/**
 * Normalized alignment: 0-100% of strand duration.
 */
function applyNormalizedAlignment(strand: TemporalStrand): TemporalPoint[] {
  const startTime = new Date(strand.startTime).getTime();
  const endTime = new Date(strand.endTime).getTime();
  const duration = endTime - startTime || 1;

  return strand.points.map((point) => {
    const pointTime = new Date(point.timestamp).getTime();
    const normalized = (pointTime - startTime) / duration;

    // Use a reference date (epoch) + normalized value in ms
    const normalizedMs = normalized * 100 * 24 * 60 * 60 * 1000; // 100 days scale

    return {
      ...point,
      timestamp: new Date(normalizedMs).toISOString(),
    };
  });
}

/* =========================================================
   PAUSE / MOMENT INSPECTION
   ========================================================= */

/**
 * Get values at a paused moment.
 * Does NOT highlight as "key moment".
 */
export function getPausedMoment(
  braiding: TemporalBraiding,
  timestamp: string
): PausedMoment {
  const pauseTime = new Date(timestamp).getTime();
  const strandValues: Record<string, TemporalPoint | null> = {};

  for (const strand of braiding.strands) {
    if (!braiding.config.visibleStrands.includes(strand.strandId)) {
      continue;
    }

    // Find nearest point before or at this time
    let nearestPoint: TemporalPoint | null = null;

    for (const point of strand.points) {
      const pointTime = new Date(point.timestamp).getTime();

      if (pointTime <= pauseTime) {
        nearestPoint = point;
      } else {
        break;
      }
    }

    strandValues[strand.strandId] = nearestPoint;
  }

  return {
    timestamp,
    visibleStrands: braiding.config.visibleStrands,
    strandValues,
  };
}

/* =========================================================
   XR RIBBON GENERATION
   ========================================================= */

/**
 * Convert strand to XR ribbon.
 */
export function toXRRibbon(
  strand: TemporalStrand,
  braiding: TemporalBraiding,
  strandIndex: number,
  totalStrands: number
): XRTemporalRibbon {
  const startTime = new Date(braiding.metadata.totalTimeSpan.start).getTime();
  const endTime = new Date(braiding.metadata.totalTimeSpan.end).getTime();
  const totalDuration = endTime - startTime || 1;

  // Lateral position based on strand index
  const lateralSpacing = 2;
  const xBase = (strandIndex - totalStrands / 2) * lateralSpacing;

  const points: XRRibbonPoint[] = strand.points.map((point) => {
    const pointTime = new Date(point.timestamp).getTime();
    const normalizedTime = (pointTime - startTime) / totalDuration;

    // Z represents temporal depth
    const z = normalizedTime * 10;

    // Width based on density
    const widthMap: Record<StrandDensity, number> = {
      thick: 0.8,
      normal: 0.5,
      thin: 0.2,
      absent: 0,
    };

    return {
      x: xBase,
      y: 1.5, // Eye level
      z,
      width: widthMap[point.density],
      opacity: point.confidence,
    };
  });

  return {
    strandId: strand.strandId,
    type: strand.type,
    color: strand.color,
    points,
    visible: strand.visible,
  };
}

/**
 * Convert all strands to XR ribbons.
 */
export function toXRBraiding(braiding: TemporalBraiding): XRTemporalRibbon[] {
  const visibleStrands = braiding.strands.filter((s) =>
    braiding.config.visibleStrands.includes(s.strandId)
  );

  return visibleStrands.map((strand, index) =>
    toXRRibbon(strand, braiding, index, visibleStrands.length)
  );
}

/* =========================================================
   UTILITY FUNCTIONS
   ========================================================= */

/**
 * Get strand by ID.
 */
export function getStrand(
  braiding: TemporalBraiding,
  strandId: string
): TemporalStrand | undefined {
  return braiding.strands.find((s) => s.strandId === strandId);
}

/**
 * Get overlaps involving a strand.
 */
export function getStrandOverlaps(
  braiding: TemporalBraiding,
  strandId: string
): TemporalOverlap[] {
  return braiding.overlaps.filter(
    (o) => o.strandA === strandId || o.strandB === strandId
  );
}

/**
 * Generate braiding summary using neutral language.
 */
export function getBraidingSummary(braiding: TemporalBraiding): string {
  const visibleCount = braiding.config.visibleStrands.length;
  const totalCount = braiding.strands.length;
  const overlapCount = braiding.overlaps.length;

  const lines = [
    `Temporal braiding contains ${totalCount} strands.`,
    `${visibleCount} strands visible.`,
    '',
    `${overlapCount} temporal overlaps observed.`,
    '',
    'Strand types present:',
    ...braiding.metadata.strandTypesPresent.map((t) => `  - ${t}`),
    '',
    `Time span: ${braiding.metadata.totalTimeSpan.start.slice(0, 10)} to ${braiding.metadata.totalTimeSpan.end.slice(0, 10)}`,
  ];

  return lines.join('\n');
}

/**
 * Compute strand density at a given time.
 */
export function computeDensityAtTime(
  strand: TemporalStrand,
  timestamp: string
): StrandDensity {
  const time = new Date(timestamp).getTime();

  // Find surrounding points
  let before: TemporalPoint | null = null;
  let after: TemporalPoint | null = null;

  for (const point of strand.points) {
    const pointTime = new Date(point.timestamp).getTime();

    if (pointTime <= time) {
      before = point;
    } else if (!after) {
      after = point;
      break;
    }
  }

  // Return nearest density
  if (before && after) {
    const beforeTime = new Date(before.timestamp).getTime();
    const afterTime = new Date(after.timestamp).getTime();

    return (time - beforeTime) < (afterTime - time)
      ? before.density
      : after.density;
  }

  return before?.density || after?.density || 'absent';
}

/* =========================================================
   EXPORTS
   ========================================================= */

export {
  isTemporallyNeutral,
  ALLOWED_TEMPORAL_TERMS,
};
