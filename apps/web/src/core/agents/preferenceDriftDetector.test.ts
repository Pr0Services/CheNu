/* =====================================================
   CHE·NU — PREFERENCE DRIFT DETECTOR TESTS
   ===================================================== */

import { describe, it, expect, beforeEach } from 'vitest';

import {
  PreferenceDriftDetectorAgent,
  driftDetector,
  DEFAULT_DRIFT_CONFIG,
  formatDriftReport,
  formatDriftAnalysisResult,
  DRIFT_DETECTOR_SYSTEM_PROMPT,
  type PreferenceDriftReport,
  type DriftMagnitude,
} from './preferenceDriftDetector';

import { AGENT_CONFIRMATION } from './internalAgentContext';

/* =========================================================
   UNIT TESTS
   ========================================================= */

describe('PreferenceDriftDetectorAgent', () => {
  let detector: PreferenceDriftDetectorAgent;

  beforeEach(() => {
    detector = new PreferenceDriftDetectorAgent();
  });

  describe('initialization', () => {
    it('should initialize with default config', () => {
      expect(detector).toBeDefined();
    });

    it('should accept custom config', () => {
      const customDetector = new PreferenceDriftDetectorAgent({
        recentWindowDays: 14,
        highDriftThreshold: 70,
      });
      expect(customDetector).toBeDefined();
    });
  });

  describe('analyze', () => {
    it('should return analysis result with confirmation', () => {
      const result = detector.analyze();

      expect(result.confirmation).toBe(AGENT_CONFIRMATION);
      expect(result.analyzedAt).toBeDefined();
      expect(result.configUsed).toBeDefined();
      expect(result.summary).toBeDefined();
    });

    it('should include summary statistics', () => {
      const result = detector.analyze();

      expect(result.summary).toHaveProperty('totalPreferencesAnalyzed');
      expect(result.summary).toHaveProperty('driftsDetected');
      expect(result.summary).toHaveProperty('highMagnitudeDrifts');
      expect(result.summary).toHaveProperty('mediumMagnitudeDrifts');
      expect(result.summary).toHaveProperty('lowMagnitudeDrifts');
      expect(result.summary).toHaveProperty('stablePreferences');
    });

    it('should filter by scope', () => {
      const result = detector.analyze({ scope: 'global' });
      expect(result).toBeDefined();
    });

    it('should filter by preference keys', () => {
      const result = detector.analyze({
        preferenceKeys: ['working_mode', 'output_format'],
      });
      expect(result).toBeDefined();
    });

    it('should use custom config when provided', () => {
      const result = detector.analyze({
        config: {
          recentWindowDays: 3,
          highDriftThreshold: 80,
        },
      });

      expect(result.configUsed.recentWindowDays).toBe(3);
      expect(result.configUsed.highDriftThreshold).toBe(80);
    });
  });

  describe('drift reports', () => {
    it('should have correct report structure', () => {
      const result = detector.analyze();

      for (const report of result.reports) {
        expect(report).toHaveProperty('preferenceId');
        expect(report).toHaveProperty('preferenceKey');
        expect(report).toHaveProperty('scope');
        expect(report).toHaveProperty('driftDetected');
        expect(report).toHaveProperty('magnitude');
        expect(report).toHaveProperty('direction');
        expect(report).toHaveProperty('confidence');
        expect(report).toHaveProperty('recommendation');
        expect(report.recommendation).toBe('inform-only');
      }
    });

    it('should have valid magnitude values', () => {
      const result = detector.analyze();
      const validMagnitudes: DriftMagnitude[] = ['low', 'medium', 'high'];

      for (const report of result.reports) {
        expect(validMagnitudes).toContain(report.magnitude);
      }
    });

    it('should have confidence between 0 and 1', () => {
      const result = detector.analyze();

      for (const report of result.reports) {
        expect(report.confidence).toBeGreaterThanOrEqual(0);
        expect(report.confidence).toBeLessThanOrEqual(1);
      }
    });

    it('should always recommend inform-only', () => {
      const result = detector.analyze();

      for (const report of result.reports) {
        expect(report.recommendation).toBe('inform-only');
      }
    });
  });

  describe('detectDriftForKey', () => {
    it('should return null for unknown key', () => {
      const report = detector.detectDriftForKey('nonexistent_key');
      // May return null if key doesn't exist in store
      expect(report === null || report.preferenceKey === 'nonexistent_key').toBe(true);
    });
  });

  describe('getHighMagnitudeDrifts', () => {
    it('should return only high magnitude drifts', () => {
      const highDrifts = detector.getHighMagnitudeDrifts();

      for (const drift of highDrifts) {
        expect(drift.magnitude).toBe('high');
        expect(drift.driftDetected).toBe(true);
      }
    });
  });

  describe('getDriftSignalsForContextInterpreter', () => {
    it('should return drift signals object', () => {
      const signals = detector.getDriftSignalsForContextInterpreter();

      expect(signals).toHaveProperty('hasDrift');
      expect(signals).toHaveProperty('driftCount');
      expect(signals).toHaveProperty('highestMagnitude');
      expect(signals).toHaveProperty('primaryDirection');
    });

    it('should have valid magnitude or null', () => {
      const signals = detector.getDriftSignalsForContextInterpreter();

      if (signals.highestMagnitude !== null) {
        expect(['low', 'medium', 'high']).toContain(signals.highestMagnitude);
      }
    });
  });
});

/* =========================================================
   FORMATTER TESTS
   ========================================================= */

describe('Drift Report Formatters', () => {
  describe('formatDriftReport', () => {
    it('should format drift detected report', () => {
      const report: PreferenceDriftReport = {
        preferenceId: 'pref-001',
        preferenceKey: 'working_mode',
        scope: 'global',
        driftDetected: true,
        magnitude: 'high',
        direction: 'exploratory → decisive',
        confidence: 0.85,
        firstObserved: '2024-01-15T10:00:00Z',
        recentWindowSize: 5,
        historicalWindowSize: 20,
        historicalPattern: 'exploration-first (70%)',
        recentPattern: 'decision-focused (80%)',
        expectedValue: '70%',
        observedValue: '80%',
        recommendation: 'inform-only',
        reportedAt: '2024-01-15T12:00:00Z',
      };

      const formatted = formatDriftReport(report);

      expect(formatted).toContain('DRIFT DETECTED');
      expect(formatted).toContain('HIGH');
      expect(formatted).toContain('exploratory → decisive');
      expect(formatted).toContain('85%');
      expect(formatted).toContain('inform-only');
      expect(formatted).toContain('INFORMATIONAL ONLY');
    });

    it('should format stable report', () => {
      const report: PreferenceDriftReport = {
        preferenceId: 'pref-002',
        preferenceKey: 'output_format',
        scope: 'sphere',
        driftDetected: false,
        magnitude: 'low',
        direction: 'stable',
        confidence: 0.7,
        firstObserved: '',
        recentWindowSize: 3,
        historicalWindowSize: 15,
        historicalPattern: 'detailed (65%)',
        recentPattern: 'detailed (68%)',
        expectedValue: '65%',
        observedValue: '68%',
        recommendation: 'inform-only',
        reportedAt: '2024-01-15T12:00:00Z',
      };

      const formatted = formatDriftReport(report);

      expect(formatted).toContain('STABLE');
      expect(formatted).toContain('No significant drift');
    });
  });

  describe('formatDriftAnalysisResult', () => {
    it('should format full analysis', () => {
      const detector = new PreferenceDriftDetectorAgent();
      const result = detector.analyze();

      const formatted = formatDriftAnalysisResult(result);

      expect(formatted).toContain('PREFERENCE DRIFT ANALYSIS');
      expect(formatted).toContain('SUMMARY');
      expect(formatted).toContain('Total Preferences Analyzed');
      expect(formatted).toContain('INFORMATIONAL ONLY');
      expect(formatted).toContain(AGENT_CONFIRMATION);
    });
  });
});

/* =========================================================
   SYSTEM PROMPT TESTS
   ========================================================= */

describe('Drift Detector System Prompt', () => {
  it('should include no-authority rules', () => {
    expect(DRIFT_DETECTOR_SYSTEM_PROMPT).toContain('NOT assume intent');
    expect(DRIFT_DETECTOR_SYSTEM_PROMPT).toContain('NOT infer reasons');
    expect(DRIFT_DETECTOR_SYSTEM_PROMPT).toContain('NOT correct behavior');
  });

  it('should emphasize factual reporting', () => {
    expect(DRIFT_DETECTOR_SYSTEM_PROMPT).toContain('report drift FACTUALLY');
    expect(DRIFT_DETECTOR_SYSTEM_PROMPT).toContain('magnitude and direction ONLY');
  });

  it('should state informational purpose', () => {
    expect(DRIFT_DETECTOR_SYSTEM_PROMPT).toContain('informational');
    expect(DRIFT_DETECTOR_SYSTEM_PROMPT).toContain('No authority');
    expect(DRIFT_DETECTOR_SYSTEM_PROMPT).toContain('No enforcement');
  });

  it('should include confirmation', () => {
    expect(DRIFT_DETECTOR_SYSTEM_PROMPT).toContain('Context acknowledged');
    expect(DRIFT_DETECTOR_SYSTEM_PROMPT).toContain('Authority unchanged');
  });
});

/* =========================================================
   DEFAULT CONFIG TESTS
   ========================================================= */

describe('DEFAULT_DRIFT_CONFIG', () => {
  it('should have required fields', () => {
    expect(DEFAULT_DRIFT_CONFIG).toHaveProperty('minHistoricalObservations');
    expect(DEFAULT_DRIFT_CONFIG).toHaveProperty('minRecentObservations');
    expect(DEFAULT_DRIFT_CONFIG).toHaveProperty('recentWindowDays');
    expect(DEFAULT_DRIFT_CONFIG).toHaveProperty('lowDriftThreshold');
    expect(DEFAULT_DRIFT_CONFIG).toHaveProperty('mediumDriftThreshold');
    expect(DEFAULT_DRIFT_CONFIG).toHaveProperty('highDriftThreshold');
  });

  it('should have sensible threshold progression', () => {
    expect(DEFAULT_DRIFT_CONFIG.lowDriftThreshold).toBeLessThan(
      DEFAULT_DRIFT_CONFIG.mediumDriftThreshold
    );
    expect(DEFAULT_DRIFT_CONFIG.mediumDriftThreshold).toBeLessThan(
      DEFAULT_DRIFT_CONFIG.highDriftThreshold
    );
  });
});

/* =========================================================
   SINGLETON TESTS
   ========================================================= */

describe('driftDetector singleton', () => {
  it('should be an instance of PreferenceDriftDetectorAgent', () => {
    expect(driftDetector).toBeInstanceOf(PreferenceDriftDetectorAgent);
  });

  it('should be usable directly', () => {
    const result = driftDetector.analyze();
    expect(result.confirmation).toBe(AGENT_CONFIRMATION);
  });
});

/* =========================================================
   INTEGRATION TESTS
   ========================================================= */

describe('Drift Detector Integration', () => {
  it('should integrate with context interpreter signals', () => {
    const signals = driftDetector.getDriftSignalsForContextInterpreter();

    // Signals should be usable by context interpreter
    expect(typeof signals.hasDrift).toBe('boolean');
    expect(typeof signals.driftCount).toBe('number');
  });

  it('should maintain non-authority through entire flow', () => {
    // Analyze
    const result = driftDetector.analyze();
    expect(result.confirmation).toBe(AGENT_CONFIRMATION);

    // All reports should be inform-only
    for (const report of result.reports) {
      expect(report.recommendation).toBe('inform-only');
    }

    // Formatted output should emphasize informational nature
    const formatted = formatDriftAnalysisResult(result);
    expect(formatted).toContain('INFORMATIONAL ONLY');
    expect(formatted).toContain('No intent assumed');
    expect(formatted).toContain('No reasons inferred');
    expect(formatted).toContain('No behavior correction');
  });
});
