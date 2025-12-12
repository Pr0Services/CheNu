/* =====================================================
   CHE·NU — CONTEXT DRIFT DETECTOR
   Status: OBSERVATIONAL SYSTEM
   Authority: NONE
   Execution Power: ZERO
   
   📜 PURPOSE:
   Detect shifts in HOW contexts are being selected,
   not WHAT actions are taken.
   
   📜 RULES:
   - Detection is descriptive only
   - No thresholds imply danger
   - Drift ≠ regression
   - Awareness only
   ===================================================== */

import { AGENT_CONFIRMATION } from './internalAgentContext';

/* =========================================================
   TYPES
   ========================================================= */

export type ContextType =
  | 'exploration'
  | 'decision'
  | 'documentation'
  | 'validation'
  | 'refinement'
  | 'collaboration'
  | 'review'
  | 'planning'
  | 'execution'
  | 'reflection';

export type ContextDriftScope = 'session' | 'project' | 'sphere' | 'global';

export type DriftMagnitude = 'low' | 'medium' | 'high';

export interface ContextUsageRecord {
  /** Unique record ID */
  id: string;

  /** Type of context */
  contextType: ContextType;

  /** When context was entered */
  enteredAt: string;

  /** When context was exited (null if still active) */
  exitedAt: string | null;

  /** Duration in ms */
  durationMs: number;

  /** Scope of context */
  scope: ContextDriftScope;

  /** Associated sphere */
  sphereId?: string;

  /** Associated project */
  projectId?: string;

  /** Transition from previous context */
  transitionFrom?: ContextType;

  /** Context depth (nested level) */
  depth: number;
}

export interface ContextDriftReport {
  /** Context type being analyzed */
  contextType: ContextType;

  /** Scope of drift analysis */
  scope: ContextDriftScope;

  /** Was drift detected? */
  driftDetected: boolean;

  /** Magnitude of drift */
  magnitude: DriftMagnitude;

  /** Direction description (neutral language) */
  direction: string;

  /** Confidence level (0.0 - 1.0) */
  confidence: number;

  /** Comparison windows */
  comparisonWindows: {
    historical: number;
    recent: number;
  };

  /** Observed metrics (descriptive only) */
  observedMetrics: {
    /** Historical frequency */
    historicalFrequency: number;

    /** Recent frequency */
    recentFrequency: number;

    /** Historical avg duration */
    historicalAvgDuration: number;

    /** Recent avg duration */
    recentAvgDuration: number;

    /** Transition patterns */
    commonTransitions: Array<{
      from: ContextType;
      to: ContextType;
      frequency: number;
    }>;
  };

  /** Timestamp of report */
  timestamp: string;

  /** Recommendation — always inform-only */
  recommendation: 'inform-only';
}

export interface ContextDriftAnalysisInput {
  /** Scope filter */
  scope?: ContextDriftScope;

  /** Specific context types to analyze */
  contextTypes?: ContextType[];

  /** Sphere filter */
  sphereId?: string;

  /** Project filter */
  projectId?: string;

  /** Historical window in days */
  historicalWindowDays?: number;

  /** Recent window in days */
  recentWindowDays?: number;
}

export interface ContextDriftAnalysisResult {
  /** All context drift reports */
  reports: ContextDriftReport[];

  /** Summary */
  summary: {
    totalContextsAnalyzed: number;
    driftsDetected: number;
    highMagnitude: number;
    mediumMagnitude: number;
    lowMagnitude: number;
    stable: number;
  };

  /** Most active context types */
  mostActiveContexts: ContextType[];

  /** Context transition patterns */
  transitionPatterns: Array<{
    from: ContextType;
    to: ContextType;
    frequency: number;
    change: 'increased' | 'decreased' | 'stable';
  }>;

  /** Analysis timestamp */
  analyzedAt: string;

  /** Agent confirmation */
  confirmation: string;
}

/* =========================================================
   CONSTANTS
   ========================================================= */

export const ALL_CONTEXT_TYPES: ContextType[] = [
  'exploration',
  'decision',
  'documentation',
  'validation',
  'refinement',
  'collaboration',
  'review',
  'planning',
  'execution',
  'reflection',
];

export const DEFAULT_CONFIG = {
  historicalWindowDays: 30,
  recentWindowDays: 7,
  minObservations: 5,
  lowDriftThreshold: 15,
  mediumDriftThreshold: 35,
  highDriftThreshold: 60,
};

/* =========================================================
   NEUTRAL LANGUAGE HELPERS
   ========================================================= */

/**
 * Generate neutral direction description.
 * NEVER uses causal or prescriptive language.
 */
function describeDirection(
  historicalValue: number,
  recentValue: number,
  metric: string
): string {
  const diff = recentValue - historicalValue;
  const percentChange = historicalValue > 0
    ? Math.abs((diff / historicalValue) * 100)
    : 100;

  if (Math.abs(percentChange) < 5) {
    return `${metric} remained stable`;
  }

  // ALLOWED descriptors only
  if (diff > 0) {
    return `${metric} observed more frequently in recent window`;
  } else {
    return `${metric} observed less frequently in recent window`;
  }
}

/**
 * Determine drift magnitude.
 */
function calculateMagnitude(percentChange: number): DriftMagnitude {
  if (percentChange >= DEFAULT_CONFIG.highDriftThreshold) {
    return 'high';
  }
  if (percentChange >= DEFAULT_CONFIG.mediumDriftThreshold) {
    return 'medium';
  }
  return 'low';
}

/* =========================================================
   CONTEXT USAGE STORE (SIMULATED)
   ========================================================= */

class ContextUsageStore {
  private records: ContextUsageRecord[] = [];
  private currentContext: ContextUsageRecord | null = null;

  /**
   * Enter a context (start tracking).
   */
  enterContext(
    contextType: ContextType,
    options: {
      scope?: ContextDriftScope;
      sphereId?: string;
      projectId?: string;
      transitionFrom?: ContextType;
      depth?: number;
    } = {}
  ): ContextUsageRecord {
    // Exit current if exists
    if (this.currentContext) {
      this.exitContext();
    }

    const record: ContextUsageRecord = {
      id: `ctx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      contextType,
      enteredAt: new Date().toISOString(),
      exitedAt: null,
      durationMs: 0,
      scope: options.scope || 'session',
      sphereId: options.sphereId,
      projectId: options.projectId,
      transitionFrom: options.transitionFrom,
      depth: options.depth || 0,
    };

    this.currentContext = record;
    return record;
  }

  /**
   * Exit current context.
   */
  exitContext(): ContextUsageRecord | null {
    if (!this.currentContext) return null;

    const now = new Date();
    const enteredAt = new Date(this.currentContext.enteredAt);

    this.currentContext.exitedAt = now.toISOString();
    this.currentContext.durationMs = now.getTime() - enteredAt.getTime();

    this.records.push(this.currentContext);
    const exited = this.currentContext;
    this.currentContext = null;

    return exited;
  }

  /**
   * Get all records.
   */
  getRecords(): ContextUsageRecord[] {
    return [...this.records];
  }

  /**
   * Get records in time range.
   */
  getRecordsInRange(startDate: Date, endDate: Date): ContextUsageRecord[] {
    return this.records.filter((r) => {
      const entered = new Date(r.enteredAt);
      return entered >= startDate && entered <= endDate;
    });
  }

  /**
   * Get records by context type.
   */
  getRecordsByType(contextType: ContextType): ContextUsageRecord[] {
    return this.records.filter((r) => r.contextType === contextType);
  }

  /**
   * Clear all records.
   */
  clear(): void {
    this.records = [];
    this.currentContext = null;
  }

  /**
   * Add simulated historical data.
   */
  addSimulatedData(count: number, daysBack: number): void {
    const now = Date.now();

    for (let i = 0; i < count; i++) {
      const daysAgo = Math.random() * daysBack;
      const enteredAt = new Date(now - daysAgo * 24 * 60 * 60 * 1000);
      const duration = Math.random() * 60 * 60 * 1000; // Up to 1 hour

      const record: ContextUsageRecord = {
        id: `ctx-sim-${i}`,
        contextType: ALL_CONTEXT_TYPES[Math.floor(Math.random() * ALL_CONTEXT_TYPES.length)],
        enteredAt: enteredAt.toISOString(),
        exitedAt: new Date(enteredAt.getTime() + duration).toISOString(),
        durationMs: duration,
        scope: 'session',
        depth: 0,
      };

      this.records.push(record);
    }
  }
}

/* =========================================================
   CONTEXT DRIFT DETECTOR AGENT
   ========================================================= */

/**
 * Context Drift Detector
 * 
 * Detects shifts in HOW contexts are being selected,
 * not WHAT actions are taken.
 * 
 * Rules:
 * - Detection is descriptive only
 * - No thresholds imply danger
 * - Drift ≠ regression
 */
export class ContextDriftDetectorAgent {
  private store: ContextUsageStore;

  constructor() {
    this.store = new ContextUsageStore();
  }

  /**
   * Enter a context (observation only).
   */
  enterContext(
    contextType: ContextType,
    options?: {
      scope?: ContextDriftScope;
      sphereId?: string;
      projectId?: string;
    }
  ): void {
    const current = this.store.getRecords().slice(-1)[0];
    this.store.enterContext(contextType, {
      ...options,
      transitionFrom: current?.contextType,
    });
  }

  /**
   * Exit current context.
   */
  exitContext(): void {
    this.store.exitContext();
  }

  /**
   * Analyze context drift.
   */
  analyze(input: ContextDriftAnalysisInput = {}): ContextDriftAnalysisResult {
    const historicalDays = input.historicalWindowDays || DEFAULT_CONFIG.historicalWindowDays;
    const recentDays = input.recentWindowDays || DEFAULT_CONFIG.recentWindowDays;

    const now = new Date();
    const recentStart = new Date(now.getTime() - recentDays * 24 * 60 * 60 * 1000);
    const historicalStart = new Date(recentStart.getTime() - historicalDays * 24 * 60 * 60 * 1000);

    // Get records for each window
    const historicalRecords = this.store.getRecordsInRange(historicalStart, recentStart);
    const recentRecords = this.store.getRecordsInRange(recentStart, now);

    // Filter by scope/sphere/project if specified
    const filterRecords = (records: ContextUsageRecord[]): ContextUsageRecord[] => {
      let filtered = records;

      if (input.scope) {
        filtered = filtered.filter((r) => r.scope === input.scope);
      }
      if (input.sphereId) {
        filtered = filtered.filter((r) => r.sphereId === input.sphereId);
      }
      if (input.projectId) {
        filtered = filtered.filter((r) => r.projectId === input.projectId);
      }
      if (input.contextTypes && input.contextTypes.length > 0) {
        filtered = filtered.filter((r) => input.contextTypes!.includes(r.contextType));
      }

      return filtered;
    };

    const filteredHistorical = filterRecords(historicalRecords);
    const filteredRecent = filterRecords(recentRecords);

    // Analyze each context type
    const contextTypes = input.contextTypes || ALL_CONTEXT_TYPES;
    const reports: ContextDriftReport[] = [];

    for (const contextType of contextTypes) {
      const report = this.analyzeContextType(
        contextType,
        filteredHistorical,
        filteredRecent,
        input.scope || 'global'
      );

      if (report) {
        reports.push(report);
      }
    }

    // Calculate summary
    const summary = {
      totalContextsAnalyzed: reports.length,
      driftsDetected: reports.filter((r) => r.driftDetected).length,
      highMagnitude: reports.filter((r) => r.driftDetected && r.magnitude === 'high').length,
      mediumMagnitude: reports.filter((r) => r.driftDetected && r.magnitude === 'medium').length,
      lowMagnitude: reports.filter((r) => r.driftDetected && r.magnitude === 'low').length,
      stable: reports.filter((r) => !r.driftDetected).length,
    };

    // Find most active contexts
    const contextCounts = new Map<ContextType, number>();
    for (const record of filteredRecent) {
      contextCounts.set(
        record.contextType,
        (contextCounts.get(record.contextType) || 0) + 1
      );
    }

    const mostActiveContexts = [...contextCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([type]) => type);

    // Analyze transitions
    const transitionPatterns = this.analyzeTransitions(filteredHistorical, filteredRecent);

    return {
      reports,
      summary,
      mostActiveContexts,
      transitionPatterns,
      analyzedAt: new Date().toISOString(),
      confirmation: AGENT_CONFIRMATION,
    };
  }

  /**
   * Analyze a single context type.
   */
  private analyzeContextType(
    contextType: ContextType,
    historical: ContextUsageRecord[],
    recent: ContextUsageRecord[],
    scope: ContextDriftScope
  ): ContextDriftReport | null {
    const historicalOfType = historical.filter((r) => r.contextType === contextType);
    const recentOfType = recent.filter((r) => r.contextType === contextType);

    // Need minimum observations
    if (historicalOfType.length < DEFAULT_CONFIG.minObservations) {
      return null;
    }

    // Calculate frequencies (normalized)
    const historicalFreq = historical.length > 0
      ? historicalOfType.length / historical.length
      : 0;
    const recentFreq = recent.length > 0
      ? recentOfType.length / recent.length
      : 0;

    // Calculate avg durations
    const historicalAvgDuration = historicalOfType.length > 0
      ? historicalOfType.reduce((sum, r) => sum + r.durationMs, 0) / historicalOfType.length
      : 0;
    const recentAvgDuration = recentOfType.length > 0
      ? recentOfType.reduce((sum, r) => sum + r.durationMs, 0) / recentOfType.length
      : 0;

    // Calculate drift
    const freqChange = historicalFreq > 0
      ? Math.abs((recentFreq - historicalFreq) / historicalFreq) * 100
      : recentFreq > 0 ? 100 : 0;

    const driftDetected = freqChange >= DEFAULT_CONFIG.lowDriftThreshold;
    const magnitude = calculateMagnitude(freqChange);

    // Get common transitions
    const transitionCounts = new Map<string, number>();
    for (const record of recentOfType) {
      if (record.transitionFrom) {
        const key = `${record.transitionFrom}→${contextType}`;
        transitionCounts.set(key, (transitionCounts.get(key) || 0) + 1);
      }
    }

    const commonTransitions = [...transitionCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([key, freq]) => {
        const [from, to] = key.split('→') as [ContextType, ContextType];
        return { from, to, frequency: freq };
      });

    // Calculate confidence
    const confidence = Math.min(
      0.95,
      (historicalOfType.length + recentOfType.length) / (DEFAULT_CONFIG.minObservations * 4)
    );

    return {
      contextType,
      scope,
      driftDetected,
      magnitude: driftDetected ? magnitude : 'low',
      direction: describeDirection(historicalFreq * 100, recentFreq * 100, `${contextType} usage`),
      confidence: Math.round(confidence * 100) / 100,
      comparisonWindows: {
        historical: historicalOfType.length,
        recent: recentOfType.length,
      },
      observedMetrics: {
        historicalFrequency: Math.round(historicalFreq * 100) / 100,
        recentFrequency: Math.round(recentFreq * 100) / 100,
        historicalAvgDuration: Math.round(historicalAvgDuration),
        recentAvgDuration: Math.round(recentAvgDuration),
        commonTransitions,
      },
      timestamp: new Date().toISOString(),
      recommendation: 'inform-only',
    };
  }

  /**
   * Analyze transition patterns.
   */
  private analyzeTransitions(
    historical: ContextUsageRecord[],
    recent: ContextUsageRecord[]
  ): ContextDriftAnalysisResult['transitionPatterns'] {
    // Count historical transitions
    const historicalTransitions = new Map<string, number>();
    for (const record of historical) {
      if (record.transitionFrom) {
        const key = `${record.transitionFrom}→${record.contextType}`;
        historicalTransitions.set(key, (historicalTransitions.get(key) || 0) + 1);
      }
    }

    // Count recent transitions
    const recentTransitions = new Map<string, number>();
    for (const record of recent) {
      if (record.transitionFrom) {
        const key = `${record.transitionFrom}→${record.contextType}`;
        recentTransitions.set(key, (recentTransitions.get(key) || 0) + 1);
      }
    }

    // Compare
    const allKeys = new Set([...historicalTransitions.keys(), ...recentTransitions.keys()]);
    const patterns: ContextDriftAnalysisResult['transitionPatterns'] = [];

    for (const key of allKeys) {
      const [from, to] = key.split('→') as [ContextType, ContextType];
      const historicalCount = historicalTransitions.get(key) || 0;
      const recentCount = recentTransitions.get(key) || 0;

      // Normalize
      const historicalNorm = historical.length > 0 ? historicalCount / historical.length : 0;
      const recentNorm = recent.length > 0 ? recentCount / recent.length : 0;

      let change: 'increased' | 'decreased' | 'stable' = 'stable';
      if (recentNorm > historicalNorm * 1.2) {
        change = 'increased';
      } else if (recentNorm < historicalNorm * 0.8) {
        change = 'decreased';
      }

      patterns.push({
        from,
        to,
        frequency: recentCount,
        change,
      });
    }

    return patterns.sort((a, b) => b.frequency - a.frequency).slice(0, 10);
  }

  /**
   * Get context usage signals for overlay.
   */
  getContextSignals(): {
    currentContext: ContextType | null;
    recentContexts: ContextType[];
    contextDistribution: Map<ContextType, number>;
  } {
    const records = this.store.getRecords();
    const recentRecords = records.slice(-20);

    // Current context
    const lastRecord = records.slice(-1)[0];
    const currentContext = lastRecord?.exitedAt === null ? lastRecord.contextType : null;

    // Recent contexts
    const recentContexts = recentRecords.map((r) => r.contextType);

    // Distribution
    const contextDistribution = new Map<ContextType, number>();
    for (const record of recentRecords) {
      contextDistribution.set(
        record.contextType,
        (contextDistribution.get(record.contextType) || 0) + 1
      );
    }

    return { currentContext, recentContexts, contextDistribution };
  }

  /**
   * Add simulated data (for testing/demo).
   */
  addSimulatedData(count: number = 100, daysBack: number = 60): void {
    this.store.addSimulatedData(count, daysBack);
  }
}

/* =========================================================
   SYSTEM PROMPT
   ========================================================= */

export const CONTEXT_DRIFT_DETECTOR_SYSTEM_PROMPT = `
You are the CHE·NU Context Drift Detector.

Your role is to detect shifts in HOW contexts are being selected,
not WHAT actions are taken.

OBSERVED SIGNALS (ONLY):
- Frequency of context type usage
- Duration spent in contexts
- Transitions between contexts
- Context depth vs intent

NOT OBSERVED:
- Intent validity
- Decision quality
- User correctness

RULES:
- Detection is descriptive only
- No thresholds imply danger
- Drift ≠ regression
- Awareness only

ALLOWED LANGUAGE:
- "observed more frequently"
- "observed less frequently"
- "remained stable"
- "co-occurred with"

FORBIDDEN LANGUAGE:
- "caused by"
- "leads to"
- "should avoid"
- "results in"

Recommendation is ALWAYS "inform-only".
No authority. No enforcement.

Context acknowledged. Authority unchanged.
`.trim();

/* =========================================================
   FORMATTERS
   ========================================================= */

export function formatContextDriftReport(report: ContextDriftReport): string {
  const status = report.driftDetected
    ? `DRIFT OBSERVED (${report.magnitude.toUpperCase()})`
    : 'STABLE';

  return `
CONTEXT DRIFT REPORT: ${report.contextType}
${'='.repeat(50)}

Status: ${status}
Scope: ${report.scope}
Confidence: ${(report.confidence * 100).toFixed(0)}%

${report.driftDetected ? `
OBSERVATIONS (Descriptive Only)
-------------------------------
Direction: ${report.direction}

Historical Window: ${report.comparisonWindows.historical} observations
Recent Window: ${report.comparisonWindows.recent} observations

Metrics:
- Historical frequency: ${(report.observedMetrics.historicalFrequency * 100).toFixed(1)}%
- Recent frequency: ${(report.observedMetrics.recentFrequency * 100).toFixed(1)}%
- Historical avg duration: ${Math.round(report.observedMetrics.historicalAvgDuration / 1000)}s
- Recent avg duration: ${Math.round(report.observedMetrics.recentAvgDuration / 1000)}s

Common Transitions:
${report.observedMetrics.commonTransitions.map((t) => `  ${t.from} → ${t.to}: ${t.frequency}`).join('\n')}
` : `
No significant change observed.
Context usage remained stable.
`}
Recommendation: ${report.recommendation.toUpperCase()}

⚠️ This report is OBSERVATIONAL ONLY.
   No action required. No correction implied.

[Timestamp: ${report.timestamp}]
`.trim();
}

/* =========================================================
   SINGLETON INSTANCE
   ========================================================= */

export const contextDriftDetector = new ContextDriftDetectorAgent();

/* =========================================================
   EXPORTS
   ========================================================= */

export default ContextDriftDetectorAgent;
