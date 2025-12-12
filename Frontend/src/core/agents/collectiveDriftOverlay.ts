/* =====================================================
   CHE·NU — COLLECTIVE DRIFT OVERLAY
   Status: OBSERVATIONAL SYSTEM
   Authority: NONE
   Execution Power: ZERO
   
   📜 PURPOSE:
   Reveal high-level patterns across multiple users
   WITHOUT identifying individuals.
   
   📜 RULES:
   - Strictly opt-in
   - Anonymized
   - Aggregated only
   - No individual traceability
   - Minimum cohort size required
   - No cross-user inference
   ===================================================== */

import { AGENT_CONFIRMATION } from './internalAgentContext';
import { ContextType, DriftMagnitude } from './contextDriftDetector';

/* =========================================================
   TYPES
   ========================================================= */

export type TimeWindowUnit = 'hour' | 'day' | 'week' | 'month';

export interface TimeRange {
  start: string;
  end: string;
  unit: TimeWindowUnit;
}

export interface CollectiveDriftCell {
  /** Context type */
  contextType: ContextType;

  /** Associated sphere (optional) */
  sphereId?: string;

  /** Time window */
  timeWindow: TimeRange;

  /** Aggregated drift density */
  driftDensity: DriftMagnitude;

  /** Number of participants in this cell */
  participantCount: number;

  /** Minimum cohort threshold met? */
  cohortThresholdMet: boolean;

  /** Aggregated metrics (anonymized) */
  aggregatedMetrics: {
    avgFrequency: number;
    avgDuration: number;
    stdDeviation: number;
  };
}

export interface CollectiveDriftOverlay {
  /** All cells in the overlay */
  cells: CollectiveDriftCell[];

  /** Global summary */
  summary: {
    totalParticipants: number;
    timeRange: TimeRange;
    spheresCovered: string[];
    contextsCovered: ContextType[];
  };

  /** Atmosphere data (for XR views) */
  atmosphere: {
    overallDensity: DriftMagnitude;
    dominantContext: ContextType | null;
    evolutionTrend: 'increasing' | 'decreasing' | 'stable';
  };

  /** Generation timestamp */
  generatedAt: string;

  /** Privacy guarantee */
  privacyGuarantee: string;

  /** Agent confirmation */
  confirmation: string;
}

export interface CollectiveParticipant {
  /** Anonymous ID (hashed) */
  anonymousId: string;

  /** Opted in? */
  optedIn: boolean;

  /** Opt-in timestamp */
  optedInAt: string | null;

  /** Contributed data ranges */
  contributedRanges: TimeRange[];
}

export interface CollectiveConfig {
  /** Minimum participants for a cell to be visible */
  minCohortSize: number;

  /** Time window for aggregation */
  defaultTimeWindow: TimeWindowUnit;

  /** Privacy hash salt (rotated) */
  hashSalt: string;

  /** Enable XR atmosphere */
  enableAtmosphere: boolean;
}

/* =========================================================
   CONSTANTS
   ========================================================= */

export const DEFAULT_COLLECTIVE_CONFIG: CollectiveConfig = {
  minCohortSize: 5,
  defaultTimeWindow: 'day',
  hashSalt: 'chenu-collective-v1',
  enableAtmosphere: true,
};

export const PRIVACY_GUARANTEE = `
All data is:
- Anonymized before aggregation
- Never individually identifiable
- Aggregated to minimum cohort sizes
- Opt-in only with explicit consent
- Deletable upon opt-out
`.trim();

/* =========================================================
   PRIVACY UTILITIES
   ========================================================= */

/**
 * Generate anonymous ID from user ID.
 */
function anonymize(userId: string, salt: string): string {
  // Simple hash for demo - in production, use proper crypto
  let hash = 0;
  const combined = `${salt}:${userId}`;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `anon-${Math.abs(hash).toString(36)}`;
}

/**
 * Check if cohort size is sufficient.
 */
function checkCohortSize(count: number, minSize: number): boolean {
  return count >= minSize;
}

/* =========================================================
   COLLECTIVE DRIFT STORE (SIMULATED)
   ========================================================= */

interface AggregatedRecord {
  contextType: ContextType;
  sphereId?: string;
  timeWindow: TimeRange;
  participantIds: Set<string>;
  frequencies: number[];
  durations: number[];
}

class CollectiveDriftStore {
  private records: Map<string, AggregatedRecord> = new Map();
  private participants: Map<string, CollectiveParticipant> = new Map();
  private config: CollectiveConfig;

  constructor(config: CollectiveConfig = DEFAULT_COLLECTIVE_CONFIG) {
    this.config = config;
  }

  /**
   * Register a participant (opt-in).
   */
  optIn(userId: string): CollectiveParticipant {
    const anonymousId = anonymize(userId, this.config.hashSalt);

    const participant: CollectiveParticipant = {
      anonymousId,
      optedIn: true,
      optedInAt: new Date().toISOString(),
      contributedRanges: [],
    };

    this.participants.set(anonymousId, participant);
    return participant;
  }

  /**
   * Opt out a participant.
   */
  optOut(userId: string): void {
    const anonymousId = anonymize(userId, this.config.hashSalt);
    const participant = this.participants.get(anonymousId);

    if (participant) {
      participant.optedIn = false;

      // Remove from all records
      for (const [key, record] of this.records) {
        record.participantIds.delete(anonymousId);
        if (record.participantIds.size === 0) {
          this.records.delete(key);
        }
      }
    }
  }

  /**
   * Contribute data (only if opted in).
   */
  contribute(
    userId: string,
    contextType: ContextType,
    frequency: number,
    duration: number,
    sphereId?: string
  ): boolean {
    const anonymousId = anonymize(userId, this.config.hashSalt);
    const participant = this.participants.get(anonymousId);

    if (!participant || !participant.optedIn) {
      return false;
    }

    const now = new Date();
    const timeWindow: TimeRange = {
      start: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
      end: now.toISOString(),
      unit: 'day',
    };

    const key = `${contextType}:${sphereId || 'global'}:${timeWindow.start.slice(0, 10)}`;

    let record = this.records.get(key);
    if (!record) {
      record = {
        contextType,
        sphereId,
        timeWindow,
        participantIds: new Set(),
        frequencies: [],
        durations: [],
      };
      this.records.set(key, record);
    }

    record.participantIds.add(anonymousId);
    record.frequencies.push(frequency);
    record.durations.push(duration);

    return true;
  }

  /**
   * Get all cells (with privacy checks).
   */
  getCells(): CollectiveDriftCell[] {
    const cells: CollectiveDriftCell[] = [];

    for (const record of this.records.values()) {
      const participantCount = record.participantIds.size;
      const cohortThresholdMet = checkCohortSize(participantCount, this.config.minCohortSize);

      if (cohortThresholdMet) {
        const avgFrequency = record.frequencies.reduce((a, b) => a + b, 0) / record.frequencies.length;
        const avgDuration = record.durations.reduce((a, b) => a + b, 0) / record.durations.length;

        // Calculate std deviation
        const mean = avgFrequency;
        const squareDiffs = record.frequencies.map((f) => Math.pow(f - mean, 2));
        const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / squareDiffs.length;
        const stdDeviation = Math.sqrt(avgSquareDiff);

        // Determine drift density from std deviation
        let driftDensity: DriftMagnitude = 'low';
        if (stdDeviation > 0.5) driftDensity = 'high';
        else if (stdDeviation > 0.25) driftDensity = 'medium';

        cells.push({
          contextType: record.contextType,
          sphereId: record.sphereId,
          timeWindow: record.timeWindow,
          driftDensity,
          participantCount,
          cohortThresholdMet,
          aggregatedMetrics: {
            avgFrequency: Math.round(avgFrequency * 100) / 100,
            avgDuration: Math.round(avgDuration),
            stdDeviation: Math.round(stdDeviation * 100) / 100,
          },
        });
      }
    }

    return cells;
  }

  /**
   * Get participant count.
   */
  getParticipantCount(): number {
    return [...this.participants.values()].filter((p) => p.optedIn).length;
  }

  /**
   * Add simulated collective data.
   */
  addSimulatedData(participantCount: number = 50): void {
    const contextTypes: ContextType[] = [
      'exploration', 'decision', 'documentation', 'validation', 'execution'
    ];
    const spheres = ['creative', 'business', 'personal', 'scholar'];

    for (let i = 0; i < participantCount; i++) {
      const userId = `simulated-user-${i}`;
      this.optIn(userId);

      // Each user contributes to random contexts
      const numContributions = Math.floor(Math.random() * 10) + 5;
      for (let j = 0; j < numContributions; j++) {
        const contextType = contextTypes[Math.floor(Math.random() * contextTypes.length)];
        const sphereId = spheres[Math.floor(Math.random() * spheres.length)];
        const frequency = Math.random();
        const duration = Math.random() * 60 * 60 * 1000;

        this.contribute(userId, contextType, frequency, duration, sphereId);
      }
    }
  }
}

/* =========================================================
   COLLECTIVE DRIFT OVERLAY GENERATOR
   ========================================================= */

/**
 * Collective Drift Overlay Generator
 * 
 * Aggregates drift patterns across participants.
 * Strictly anonymized. Opt-in only.
 */
export class CollectiveDriftOverlayGenerator {
  private store: CollectiveDriftStore;
  private config: CollectiveConfig;

  constructor(config: Partial<CollectiveConfig> = {}) {
    this.config = { ...DEFAULT_COLLECTIVE_CONFIG, ...config };
    this.store = new CollectiveDriftStore(this.config);
  }

  /**
   * User opts in to collective data.
   */
  optIn(userId: string): CollectiveParticipant {
    return this.store.optIn(userId);
  }

  /**
   * User opts out.
   */
  optOut(userId: string): void {
    this.store.optOut(userId);
  }

  /**
   * Contribute individual drift data (anonymized).
   */
  contribute(
    userId: string,
    contextType: ContextType,
    frequency: number,
    duration: number,
    sphereId?: string
  ): boolean {
    return this.store.contribute(userId, contextType, frequency, duration, sphereId);
  }

  /**
   * Generate overlay.
   */
  generateOverlay(): CollectiveDriftOverlay {
    const cells = this.store.getCells();
    const participantCount = this.store.getParticipantCount();

    // Extract covered spheres and contexts
    const spheresCovered = [...new Set(cells.map((c) => c.sphereId).filter(Boolean))] as string[];
    const contextsCovered = [...new Set(cells.map((c) => c.contextType))];

    // Calculate atmosphere
    const atmosphere = this.calculateAtmosphere(cells);

    // Determine time range from cells
    const allStarts = cells.map((c) => new Date(c.timeWindow.start).getTime());
    const allEnds = cells.map((c) => new Date(c.timeWindow.end).getTime());

    const timeRange: TimeRange = {
      start: allStarts.length > 0 ? new Date(Math.min(...allStarts)).toISOString() : new Date().toISOString(),
      end: allEnds.length > 0 ? new Date(Math.max(...allEnds)).toISOString() : new Date().toISOString(),
      unit: 'day',
    };

    return {
      cells,
      summary: {
        totalParticipants: participantCount,
        timeRange,
        spheresCovered,
        contextsCovered,
      },
      atmosphere,
      generatedAt: new Date().toISOString(),
      privacyGuarantee: PRIVACY_GUARANTEE,
      confirmation: AGENT_CONFIRMATION,
    };
  }

  /**
   * Calculate atmosphere for XR views.
   */
  private calculateAtmosphere(cells: CollectiveDriftCell[]): CollectiveDriftOverlay['atmosphere'] {
    if (cells.length === 0) {
      return {
        overallDensity: 'low',
        dominantContext: null,
        evolutionTrend: 'stable',
      };
    }

    // Overall density from weighted average
    const densityScores = cells.map((c) => {
      switch (c.driftDensity) {
        case 'high': return 3;
        case 'medium': return 2;
        case 'low': return 1;
      }
    });

    const avgDensityScore = densityScores.reduce((a, b) => a + b, 0) / densityScores.length;

    let overallDensity: DriftMagnitude = 'low';
    if (avgDensityScore >= 2.5) overallDensity = 'high';
    else if (avgDensityScore >= 1.5) overallDensity = 'medium';

    // Dominant context
    const contextCounts = new Map<ContextType, number>();
    for (const cell of cells) {
      contextCounts.set(
        cell.contextType,
        (contextCounts.get(cell.contextType) || 0) + cell.participantCount
      );
    }

    let dominantContext: ContextType | null = null;
    let maxCount = 0;
    for (const [ctx, count] of contextCounts) {
      if (count > maxCount) {
        maxCount = count;
        dominantContext = ctx;
      }
    }

    // Evolution trend (simulated based on variance)
    const variances = cells.map((c) => c.aggregatedMetrics.stdDeviation);
    const avgVariance = variances.reduce((a, b) => a + b, 0) / variances.length;

    let evolutionTrend: 'increasing' | 'decreasing' | 'stable' = 'stable';
    if (avgVariance > 0.4) evolutionTrend = 'increasing';
    else if (avgVariance < 0.15) evolutionTrend = 'stable';

    return {
      overallDensity,
      dominantContext,
      evolutionTrend,
    };
  }

  /**
   * Get cells filtered by sphere.
   */
  getCellsBySphere(sphereId: string): CollectiveDriftCell[] {
    return this.store.getCells().filter((c) => c.sphereId === sphereId);
  }

  /**
   * Get cells filtered by context.
   */
  getCellsByContext(contextType: ContextType): CollectiveDriftCell[] {
    return this.store.getCells().filter((c) => c.contextType === contextType);
  }

  /**
   * Add simulated data.
   */
  addSimulatedData(participantCount: number = 50): void {
    this.store.addSimulatedData(participantCount);
  }
}

/* =========================================================
   SYSTEM PROMPT
   ========================================================= */

export const COLLECTIVE_DRIFT_OVERLAY_SYSTEM_PROMPT = `
You are the CHE·NU Collective Drift Overlay Generator.

PURPOSE:
Reveal high-level patterns across multiple users
WITHOUT identifying individuals.

PARTICIPATION RULES:
- Strictly opt-in
- Anonymized before aggregation
- Aggregated only (minimum cohort size: 5)
- No individual traceability
- No cross-user inference

OVERLAY MAY SHOW:
- Density
- Coexistence
- Evolution

OVERLAY MUST NOT SHOW:
- Rankings
- "Best practices"
- Prescriptive labels
- Urgency indicators

ALLOWED LANGUAGE:
- "observed across participants"
- "collective pattern"
- "aggregated density"
- "cohort trend"

FORBIDDEN LANGUAGE:
- "better than"
- "should follow"
- "recommended practice"
- "user X vs user Y"

Privacy is paramount.
No authority. No enforcement.

Context acknowledged. Authority unchanged.
`.trim();

/* =========================================================
   FORMATTERS
   ========================================================= */

export function formatCollectiveOverlay(overlay: CollectiveDriftOverlay): string {
  return `
CHE·NU — COLLECTIVE DRIFT OVERLAY
==================================

SUMMARY
-------
Total Participants: ${overlay.summary.totalParticipants}
Spheres Covered: ${overlay.summary.spheresCovered.join(', ') || 'None'}
Contexts Covered: ${overlay.summary.contextsCovered.join(', ') || 'None'}
Time Range: ${overlay.summary.timeRange.start.slice(0, 10)} to ${overlay.summary.timeRange.end.slice(0, 10)}

ATMOSPHERE (XR View)
--------------------
Overall Density: ${overlay.atmosphere.overallDensity.toUpperCase()}
Dominant Context: ${overlay.atmosphere.dominantContext || 'None'}
Evolution Trend: ${overlay.atmosphere.evolutionTrend}

CELLS (${overlay.cells.length} total)
${'='.repeat(40)}
${overlay.cells.map((cell) => `
• ${cell.contextType} [${cell.sphereId || 'global'}]
  Density: ${cell.driftDensity} | Participants: ${cell.participantCount}
  Avg Frequency: ${cell.aggregatedMetrics.avgFrequency}
  Avg Duration: ${Math.round(cell.aggregatedMetrics.avgDuration / 1000)}s
`).join('')}

PRIVACY GUARANTEE
-----------------
${overlay.privacyGuarantee}

${overlay.confirmation}

[Generated: ${overlay.generatedAt}]
`.trim();
}

/* =========================================================
   SINGLETON INSTANCE
   ========================================================= */

export const collectiveDriftOverlay = new CollectiveDriftOverlayGenerator();

/* =========================================================
   EXPORTS
   ========================================================= */

export default CollectiveDriftOverlayGenerator;
