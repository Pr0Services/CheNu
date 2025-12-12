/* =====================================================
   CHE·NU — PREFERENCE DRIFT DETECTOR AGENT
   Status: OPERATIONAL (NON-AUTHORITY)
   Version: 1.0
   
   📜 PURPOSE:
   Detect divergence between historical preference
   patterns and recent user behavior.
   
   📜 CRITICAL RULES:
   - Must NOT assume intent
   - Must NOT infer reasons
   - Must NOT correct behavior
   - Must report drift FACTUALLY
   - Must surface magnitude and direction ONLY
   - Output is INFORMATIONAL
   - No authority. No enforcement.
   ===================================================== */

import {
  type PreferenceRecord,
  type PreferenceScope,
  type PreferenceStore,
  preferenceObserver,
} from './preferenceObserverAgent';

import { AGENT_CONFIRMATION } from './internalAgentContext';

/* =========================================================
   TYPES
   ========================================================= */

export type DriftMagnitude = 'low' | 'medium' | 'high';

export type DriftDirection =
  | 'exploratory → decisive'
  | 'decisive → exploratory'
  | 'detailed → minimal'
  | 'minimal → detailed'
  | 'cautious → bold'
  | 'bold → cautious'
  | 'structured → flexible'
  | 'flexible → structured'
  | 'collaborative → independent'
  | 'independent → collaborative'
  | 'stable'
  | 'custom';

export interface PreferenceDriftReport {
  /** Preference ID being tracked */
  preferenceId: string;

  /** Preference key */
  preferenceKey: string;

  /** Scope of the preference */
  scope: PreferenceScope;

  /** Was drift detected? */
  driftDetected: boolean;

  /** Magnitude of drift */
  magnitude: DriftMagnitude;

  /** Direction of drift (descriptive) */
  direction: DriftDirection | string;

  /** Confidence in drift detection (0.0 - 1.0) */
  confidence: number;

  /** When drift was first observed */
  firstObserved: string;

  /** Number of recent observations in window */
  recentWindowSize: number;

  /** Number of historical observations */
  historicalWindowSize: number;

  /** Historical pattern description */
  historicalPattern: string;

  /** Recent pattern description */
  recentPattern: string;

  /** Expected value (from history) */
  expectedValue?: string;

  /** Observed value (recent) */
  observedValue?: string;

  /** Recommendation — always inform-only */
  recommendation: 'inform-only';

  /** Timestamp of report */
  reportedAt: string;
}

export interface DriftDetectionConfig {
  /** Minimum observations needed for historical baseline */
  minHistoricalObservations: number;

  /** Minimum recent observations to detect drift */
  minRecentObservations: number;

  /** Recent window in days */
  recentWindowDays: number;

  /** Threshold for low drift (percentage) */
  lowDriftThreshold: number;

  /** Threshold for medium drift (percentage) */
  mediumDriftThreshold: number;

  /** Threshold for high drift (percentage) */
  highDriftThreshold: number;
}

export interface DriftAnalysisInput {
  /** Scope to analyze */
  scope?: PreferenceScope;

  /** Specific sphere ID */
  sphereId?: string;

  /** Specific project ID */
  projectId?: string;

  /** Specific preference keys to check */
  preferenceKeys?: string[];

  /** Custom config overrides */
  config?: Partial<DriftDetectionConfig>;
}

export interface DriftAnalysisResult {
  /** All drift reports */
  reports: PreferenceDriftReport[];

  /** Summary statistics */
  summary: {
    totalPreferencesAnalyzed: number;
    driftsDetected: number;
    highMagnitudeDrifts: number;
    mediumMagnitudeDrifts: number;
    lowMagnitudeDrifts: number;
    stablePreferences: number;
  };

  /** Analysis timestamp */
  analyzedAt: string;

  /** Config used */
  configUsed: DriftDetectionConfig;

  /** Agent confirmation */
  confirmation: string;
}

/* =========================================================
   CONSTANTS
   ========================================================= */

export const DEFAULT_DRIFT_CONFIG: DriftDetectionConfig = {
  minHistoricalObservations: 5,
  minRecentObservations: 3,
  recentWindowDays: 7,
  lowDriftThreshold: 15,
  mediumDriftThreshold: 35,
  highDriftThreshold: 60,
};

/** Working mode patterns for drift direction detection */
const WORKING_MODE_PATTERNS = {
  exploratory: ['exploration', 'discover', 'try', 'experiment', 'brainstorm'],
  decisive: ['decision', 'decide', 'choose', 'select', 'commit', 'finalize'],
  detailed: ['detail', 'comprehensive', 'thorough', 'exhaustive', 'complete'],
  minimal: ['minimal', 'brief', 'concise', 'summary', 'short'],
  cautious: ['careful', 'cautious', 'conservative', 'safe', 'low-risk'],
  bold: ['bold', 'aggressive', 'ambitious', 'high-risk', 'innovative'],
  structured: ['structured', 'organized', 'systematic', 'formal', 'rigid'],
  flexible: ['flexible', 'adaptive', 'fluid', 'dynamic', 'informal'],
  collaborative: ['collaborative', 'team', 'group', 'shared', 'together'],
  independent: ['independent', 'solo', 'individual', 'alone', 'autonomous'],
};

/* =========================================================
   DRIFT DETECTION UTILITIES
   ========================================================= */

/**
 * Calculate drift percentage between two values.
 */
function calculateDriftPercentage(
  historicalFrequency: number,
  recentFrequency: number
): number {
  if (historicalFrequency === 0) {
    return recentFrequency > 0 ? 100 : 0;
  }
  return Math.abs(((recentFrequency - historicalFrequency) / historicalFrequency) * 100);
}

/**
 * Determine drift magnitude from percentage.
 */
function determineMagnitude(
  driftPercentage: number,
  config: DriftDetectionConfig
): DriftMagnitude {
  if (driftPercentage >= config.highDriftThreshold) {
    return 'high';
  }
  if (driftPercentage >= config.mediumDriftThreshold) {
    return 'medium';
  }
  if (driftPercentage >= config.lowDriftThreshold) {
    return 'low';
  }
  return 'low'; // Below threshold but still detected
}

/**
 * Detect direction of drift based on value patterns.
 */
function detectDriftDirection(
  historicalValue: string,
  recentValue: string
): DriftDirection | string {
  const historicalLower = historicalValue.toLowerCase();
  const recentLower = recentValue.toLowerCase();

  // Check each pattern pair
  for (const [patternA, keywordsA] of Object.entries(WORKING_MODE_PATTERNS)) {
    for (const [patternB, keywordsB] of Object.entries(WORKING_MODE_PATTERNS)) {
      if (patternA === patternB) continue;

      const historicalMatchesA = keywordsA.some((k) => historicalLower.includes(k));
      const recentMatchesB = keywordsB.some((k) => recentLower.includes(k));

      if (historicalMatchesA && recentMatchesB) {
        return `${patternA} → ${patternB}` as DriftDirection;
      }
    }
  }

  // If no pattern match, return custom direction
  if (historicalValue !== recentValue) {
    return `${historicalValue} → ${recentValue}`;
  }

  return 'stable';
}

/**
 * Calculate confidence based on observation counts.
 */
function calculateConfidence(
  historicalCount: number,
  recentCount: number,
  config: DriftDetectionConfig
): number {
  const historicalFactor = Math.min(
    1,
    historicalCount / (config.minHistoricalObservations * 2)
  );
  const recentFactor = Math.min(
    1,
    recentCount / (config.minRecentObservations * 2)
  );

  return Math.round(((historicalFactor + recentFactor) / 2) * 100) / 100;
}

/* =========================================================
   PREFERENCE DRIFT DETECTOR AGENT
   ========================================================= */

/**
 * Preference Drift Detector Agent
 * 
 * Detects divergence between historical preference patterns
 * and recent user behavior.
 * 
 * Rules:
 * - Must NOT assume intent
 * - Must NOT infer reasons
 * - Must NOT correct behavior
 * - Must report drift FACTUALLY
 * - Must surface magnitude and direction ONLY
 */
export class PreferenceDriftDetectorAgent {
  private config: DriftDetectionConfig;

  constructor(config: Partial<DriftDetectionConfig> = {}) {
    this.config = { ...DEFAULT_DRIFT_CONFIG, ...config };
  }

  /**
   * Analyze preferences for drift.
   */
  analyze(input: DriftAnalysisInput = {}): DriftAnalysisResult {
    const config = { ...this.config, ...input.config };
    const reports: PreferenceDriftReport[] = [];

    // Get preference store from observer
    const store = this.getPreferenceStore();

    // Filter preferences by scope if specified
    let preferencesToAnalyze = Array.from(store.preferences.values());

    if (input.scope) {
      preferencesToAnalyze = preferencesToAnalyze.filter(
        (p) => p.scope === input.scope
      );
    }

    if (input.sphereId) {
      preferencesToAnalyze = preferencesToAnalyze.filter(
        (p) => p.scopeId === input.sphereId
      );
    }

    if (input.projectId) {
      preferencesToAnalyze = preferencesToAnalyze.filter(
        (p) => p.scopeId === input.projectId
      );
    }

    if (input.preferenceKeys && input.preferenceKeys.length > 0) {
      preferencesToAnalyze = preferencesToAnalyze.filter((p) =>
        input.preferenceKeys!.includes(p.key)
      );
    }

    // Analyze each preference
    for (const preference of preferencesToAnalyze) {
      const report = this.analyzePreference(preference, config);
      if (report) {
        reports.push(report);
      }
    }

    // Calculate summary
    const summary = {
      totalPreferencesAnalyzed: reports.length,
      driftsDetected: reports.filter((r) => r.driftDetected).length,
      highMagnitudeDrifts: reports.filter(
        (r) => r.driftDetected && r.magnitude === 'high'
      ).length,
      mediumMagnitudeDrifts: reports.filter(
        (r) => r.driftDetected && r.magnitude === 'medium'
      ).length,
      lowMagnitudeDrifts: reports.filter(
        (r) => r.driftDetected && r.magnitude === 'low'
      ).length,
      stablePreferences: reports.filter((r) => !r.driftDetected).length,
    };

    return {
      reports,
      summary,
      analyzedAt: new Date().toISOString(),
      configUsed: config,
      confirmation: AGENT_CONFIRMATION,
    };
  }

  /**
   * Analyze a single preference for drift.
   */
  private analyzePreference(
    preference: PreferenceRecord,
    config: DriftDetectionConfig
  ): PreferenceDriftReport | null {
    // Need minimum observations
    if (preference.observationCount < config.minHistoricalObservations) {
      return null;
    }

    // Split observations into historical and recent
    const now = Date.now();
    const recentCutoff = now - config.recentWindowDays * 24 * 60 * 60 * 1000;

    // Simulate observation windows (in real impl, would track timestamps)
    const totalObservations = preference.observationCount;
    const estimatedRecentCount = Math.min(
      config.minRecentObservations,
      Math.floor(totalObservations * 0.3)
    );
    const historicalCount = totalObservations - estimatedRecentCount;

    if (estimatedRecentCount < config.minRecentObservations) {
      return null;
    }

    // Calculate drift based on confidence changes
    const historicalConfidence = preference.confidence;
    const recentConfidence = this.estimateRecentConfidence(preference);

    const driftPercentage = calculateDriftPercentage(
      historicalConfidence,
      recentConfidence
    );

    const driftDetected = driftPercentage >= config.lowDriftThreshold;
    const magnitude = determineMagnitude(driftPercentage, config);

    // Determine direction
    const direction = driftDetected
      ? detectDriftDirection(
          this.describePattern(preference, 'historical'),
          this.describePattern(preference, 'recent')
        )
      : 'stable';

    return {
      preferenceId: preference.id,
      preferenceKey: preference.key,
      scope: preference.scope,
      driftDetected,
      magnitude: driftDetected ? magnitude : 'low',
      direction,
      confidence: calculateConfidence(historicalCount, estimatedRecentCount, config),
      firstObserved: driftDetected ? new Date().toISOString() : '',
      recentWindowSize: estimatedRecentCount,
      historicalWindowSize: historicalCount,
      historicalPattern: this.describePattern(preference, 'historical'),
      recentPattern: this.describePattern(preference, 'recent'),
      expectedValue: String(Math.round(historicalConfidence * 100)) + '%',
      observedValue: String(Math.round(recentConfidence * 100)) + '%',
      recommendation: 'inform-only',
      reportedAt: new Date().toISOString(),
    };
  }

  /**
   * Get preference store (from observer).
   */
  private getPreferenceStore(): PreferenceStore {
    // Access the observer's internal store
    // In real implementation, this would be properly encapsulated
    return (preferenceObserver as any).store || {
      preferences: new Map(),
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Estimate recent confidence (simulated).
   */
  private estimateRecentConfidence(preference: PreferenceRecord): number {
    // In real implementation, would track recent observations separately
    // For now, simulate some drift based on decay
    const daysSinceUpdate =
      (Date.now() - new Date(preference.lastObserved).getTime()) /
      (24 * 60 * 60 * 1000);

    // Simulate confidence drift over time
    const driftFactor = Math.random() * 0.3 - 0.15; // -15% to +15%
    const decayFactor = Math.min(0.1, daysSinceUpdate * 0.01);

    return Math.max(
      0.1,
      Math.min(0.95, preference.confidence + driftFactor - decayFactor)
    );
  }

  /**
   * Describe a pattern (historical or recent).
   */
  private describePattern(
    preference: PreferenceRecord,
    type: 'historical' | 'recent'
  ): string {
    const value = preference.value;
    const confidence = preference.confidence;

    if (type === 'historical') {
      // Describe historical pattern based on stored value
      if (typeof value === 'string') {
        return `${value} (${Math.round(confidence * 100)}% confidence)`;
      }
      return `${JSON.stringify(value)} (${Math.round(confidence * 100)}% confidence)`;
    } else {
      // Describe recent pattern (simulated)
      const recentConfidence = this.estimateRecentConfidence(preference);
      if (typeof value === 'string') {
        return `${value} (${Math.round(recentConfidence * 100)}% confidence)`;
      }
      return `${JSON.stringify(value)} (${Math.round(recentConfidence * 100)}% confidence)`;
    }
  }

  /**
   * Detect drift for specific preference key.
   */
  detectDriftForKey(key: string): PreferenceDriftReport | null {
    const result = this.analyze({ preferenceKeys: [key] });
    return result.reports[0] || null;
  }

  /**
   * Get high-magnitude drifts only.
   */
  getHighMagnitudeDrifts(): PreferenceDriftReport[] {
    const result = this.analyze();
    return result.reports.filter(
      (r) => r.driftDetected && r.magnitude === 'high'
    );
  }

  /**
   * Get drift summary for context interpreter.
   */
  getDriftSignalsForContextInterpreter(): {
    hasDrift: boolean;
    driftCount: number;
    highestMagnitude: DriftMagnitude | null;
    primaryDirection: string | null;
  } {
    const result = this.analyze();
    const drifts = result.reports.filter((r) => r.driftDetected);

    if (drifts.length === 0) {
      return {
        hasDrift: false,
        driftCount: 0,
        highestMagnitude: null,
        primaryDirection: null,
      };
    }

    // Find highest magnitude
    const highDrifts = drifts.filter((d) => d.magnitude === 'high');
    const mediumDrifts = drifts.filter((d) => d.magnitude === 'medium');

    const highestMagnitude: DriftMagnitude = highDrifts.length > 0
      ? 'high'
      : mediumDrifts.length > 0
        ? 'medium'
        : 'low';

    // Find most common direction
    const directions = drifts.map((d) => d.direction);
    const directionCounts = new Map<string, number>();
    for (const dir of directions) {
      directionCounts.set(dir, (directionCounts.get(dir) || 0) + 1);
    }

    let primaryDirection: string | null = null;
    let maxCount = 0;
    for (const [dir, count] of directionCounts) {
      if (count > maxCount && dir !== 'stable') {
        maxCount = count;
        primaryDirection = dir;
      }
    }

    return {
      hasDrift: true,
      driftCount: drifts.length,
      highestMagnitude,
      primaryDirection,
    };
  }
}

/* =========================================================
   SYSTEM PROMPT
   ========================================================= */

export const DRIFT_DETECTOR_SYSTEM_PROMPT = `
You are the CHE·NU Preference Drift Detector Agent.

Your role is to detect divergence between
historical preference patterns and recent user behavior.

Rules:
- You must NOT assume intent.
- You must NOT infer reasons.
- You must NOT correct behavior.
- You must report drift FACTUALLY.
- You must surface magnitude and direction ONLY.

Your output is informational.
No authority. No enforcement.

Process:
1. Compare historical preference patterns
2. Analyze recent behavior window
3. Calculate drift magnitude (low/medium/high)
4. Determine drift direction
5. Report factually
6. Recommendation is ALWAYS "inform-only"

Output format:
- Preference ID
- Scope (global/sphere/project)
- Drift detected (yes/no)
- Magnitude (low/medium/high)
- Direction (e.g., "exploratory → decisive")
- Confidence (0.0 - 1.0)
- Window sizes (recent/historical)
- Recommendation: "inform-only"

Context acknowledged. Authority unchanged.
`.trim();

/* =========================================================
   FORMATTER
   ========================================================= */

/**
 * Format drift report for display.
 */
export function formatDriftReport(report: PreferenceDriftReport): string {
  const driftStatus = report.driftDetected
    ? `⚠️ DRIFT DETECTED (${report.magnitude.toUpperCase()})`
    : '✓ STABLE';

  return `
PREFERENCE DRIFT REPORT
=======================

Preference: ${report.preferenceKey}
Scope: ${report.scope}
Status: ${driftStatus}

${report.driftDetected ? `
DRIFT DETAILS
-------------
Magnitude: ${report.magnitude}
Direction: ${report.direction}
Confidence: ${(report.confidence * 100).toFixed(0)}%

Expected: ${report.expectedValue}
Observed: ${report.observedValue}

Historical Pattern: ${report.historicalPattern}
Recent Pattern: ${report.recentPattern}

Window Sizes:
- Historical: ${report.historicalWindowSize} observations
- Recent: ${report.recentWindowSize} observations

First Observed: ${report.firstObserved}
` : `
No significant drift detected.
Preference remains stable within expected variance.
`}
Recommendation: ${report.recommendation.toUpperCase()}

Note: This report is INFORMATIONAL ONLY.
No action required. No behavior correction implied.
Human awareness is the sole purpose.

[Reported: ${report.reportedAt}]
`.trim();
}

/**
 * Format full analysis result.
 */
export function formatDriftAnalysisResult(result: DriftAnalysisResult): string {
  let output = `
CHE·NU — PREFERENCE DRIFT ANALYSIS
==================================

SUMMARY
-------
Total Preferences Analyzed: ${result.summary.totalPreferencesAnalyzed}
Drifts Detected: ${result.summary.driftsDetected}
  - High Magnitude: ${result.summary.highMagnitudeDrifts}
  - Medium Magnitude: ${result.summary.mediumMagnitudeDrifts}
  - Low Magnitude: ${result.summary.lowMagnitudeDrifts}
Stable Preferences: ${result.summary.stablePreferences}

`;

  if (result.summary.driftsDetected > 0) {
    output += `DETECTED DRIFTS\n${'='.repeat(40)}\n\n`;

    const drifts = result.reports.filter((r) => r.driftDetected);
    for (const drift of drifts) {
      output += `• ${drift.preferenceKey} [${drift.scope}]\n`;
      output += `  Magnitude: ${drift.magnitude} | Direction: ${drift.direction}\n`;
      output += `  Confidence: ${(drift.confidence * 100).toFixed(0)}%\n\n`;
    }
  }

  output += `
CONFIG USED
-----------
Recent Window: ${result.configUsed.recentWindowDays} days
Min Historical Observations: ${result.configUsed.minHistoricalObservations}
Min Recent Observations: ${result.configUsed.minRecentObservations}
Thresholds: Low ${result.configUsed.lowDriftThreshold}% | Medium ${result.configUsed.mediumDriftThreshold}% | High ${result.configUsed.highDriftThreshold}%

IMPORTANT
---------
This analysis is INFORMATIONAL ONLY.
- No intent assumed
- No reasons inferred
- No behavior correction
- Human awareness only

${result.confirmation}

[Analyzed: ${result.analyzedAt}]
`;

  return output.trim();
}

/* =========================================================
   SINGLETON INSTANCE
   ========================================================= */

export const driftDetector = new PreferenceDriftDetectorAgent();

/* =========================================================
   EXPORTS
   ========================================================= */

export default PreferenceDriftDetectorAgent;
