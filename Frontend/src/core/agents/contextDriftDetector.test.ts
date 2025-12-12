/* =====================================================
   CHE·NU — CONTEXT DRIFT DETECTOR TESTS
   ===================================================== */

import { describe, it, expect, beforeEach } from 'vitest';

import {
  ContextDriftDetectorAgent,
  contextDriftDetector,
  formatContextDriftReport,
  CONTEXT_DRIFT_DETECTOR_SYSTEM_PROMPT,
  ALL_CONTEXT_TYPES,
  type ContextType,
  type ContextDriftReport,
} from './contextDriftDetector';

import { AGENT_CONFIRMATION } from './internalAgentContext';

/* =========================================================
   UNIT TESTS
   ========================================================= */

describe('ContextDriftDetectorAgent', () => {
  let detector: ContextDriftDetectorAgent;

  beforeEach(() => {
    detector = new ContextDriftDetectorAgent();
    detector.addSimulatedData(100, 60); // Add test data
  });

  describe('initialization', () => {
    it('should initialize successfully', () => {
      expect(detector).toBeDefined();
    });
  });

  describe('context tracking', () => {
    it('should enter and exit contexts', () => {
      const freshDetector = new ContextDriftDetectorAgent();

      freshDetector.enterContext('exploration');
      const signals = freshDetector.getContextSignals();

      expect(signals.currentContext).toBe('exploration');
    });

    it('should track transitions', () => {
      const freshDetector = new ContextDriftDetectorAgent();

      freshDetector.enterContext('exploration');
      freshDetector.exitContext();
      freshDetector.enterContext('decision');

      const signals = freshDetector.getContextSignals();
      expect(signals.currentContext).toBe('decision');
    });
  });

  describe('analyze', () => {
    it('should return analysis result with confirmation', () => {
      const result = detector.analyze();

      expect(result.confirmation).toBe(AGENT_CONFIRMATION);
      expect(result.analyzedAt).toBeDefined();
    });

    it('should include summary', () => {
      const result = detector.analyze();

      expect(result.summary).toHaveProperty('totalContextsAnalyzed');
      expect(result.summary).toHaveProperty('driftsDetected');
      expect(result.summary).toHaveProperty('highMagnitude');
      expect(result.summary).toHaveProperty('mediumMagnitude');
      expect(result.summary).toHaveProperty('lowMagnitude');
      expect(result.summary).toHaveProperty('stable');
    });

    it('should identify most active contexts', () => {
      const result = detector.analyze();

      expect(result.mostActiveContexts).toBeDefined();
      expect(Array.isArray(result.mostActiveContexts)).toBe(true);
    });

    it('should analyze transition patterns', () => {
      const result = detector.analyze();

      expect(result.transitionPatterns).toBeDefined();
      expect(Array.isArray(result.transitionPatterns)).toBe(true);
    });
  });

  describe('context drift reports', () => {
    it('should have correct report structure', () => {
      const result = detector.analyze();

      for (const report of result.reports) {
        expect(report).toHaveProperty('contextType');
        expect(report).toHaveProperty('scope');
        expect(report).toHaveProperty('driftDetected');
        expect(report).toHaveProperty('magnitude');
        expect(report).toHaveProperty('direction');
        expect(report).toHaveProperty('confidence');
        expect(report).toHaveProperty('recommendation');
        expect(report.recommendation).toBe('inform-only');
      }
    });

    it('should have valid context types', () => {
      const result = detector.analyze();

      for (const report of result.reports) {
        expect(ALL_CONTEXT_TYPES).toContain(report.contextType);
      }
    });

    it('should always recommend inform-only', () => {
      const result = detector.analyze();

      for (const report of result.reports) {
        expect(report.recommendation).toBe('inform-only');
      }
    });

    it('should include observed metrics', () => {
      const result = detector.analyze();

      for (const report of result.reports) {
        expect(report.observedMetrics).toBeDefined();
        expect(report.observedMetrics).toHaveProperty('historicalFrequency');
        expect(report.observedMetrics).toHaveProperty('recentFrequency');
        expect(report.observedMetrics).toHaveProperty('historicalAvgDuration');
        expect(report.observedMetrics).toHaveProperty('recentAvgDuration');
        expect(report.observedMetrics).toHaveProperty('commonTransitions');
      }
    });
  });

  describe('filtered analysis', () => {
    it('should filter by scope', () => {
      const result = detector.analyze({ scope: 'session' });
      expect(result).toBeDefined();
    });

    it('should filter by context types', () => {
      const result = detector.analyze({
        contextTypes: ['exploration', 'decision'],
      });

      for (const report of result.reports) {
        expect(['exploration', 'decision']).toContain(report.contextType);
      }
    });
  });

  describe('context signals', () => {
    it('should return context signals', () => {
      const signals = detector.getContextSignals();

      expect(signals).toHaveProperty('currentContext');
      expect(signals).toHaveProperty('recentContexts');
      expect(signals).toHaveProperty('contextDistribution');
    });
  });
});

/* =========================================================
   FORMATTER TESTS
   ========================================================= */

describe('formatContextDriftReport', () => {
  it('should format drift detected report', () => {
    const report: ContextDriftReport = {
      contextType: 'exploration',
      scope: 'global',
      driftDetected: true,
      magnitude: 'high',
      direction: 'exploration usage observed more frequently in recent window',
      confidence: 0.85,
      comparisonWindows: {
        historical: 50,
        recent: 15,
      },
      observedMetrics: {
        historicalFrequency: 0.25,
        recentFrequency: 0.45,
        historicalAvgDuration: 120000,
        recentAvgDuration: 180000,
        commonTransitions: [
          { from: 'planning', to: 'exploration', frequency: 8 },
        ],
      },
      timestamp: new Date().toISOString(),
      recommendation: 'inform-only',
    };

    const formatted = formatContextDriftReport(report);

    expect(formatted).toContain('exploration');
    expect(formatted).toContain('DRIFT OBSERVED');
    expect(formatted).toContain('HIGH');
    expect(formatted).toContain('inform-only');
    expect(formatted).toContain('OBSERVATIONAL ONLY');
  });

  it('should format stable report', () => {
    const report: ContextDriftReport = {
      contextType: 'documentation',
      scope: 'project',
      driftDetected: false,
      magnitude: 'low',
      direction: 'documentation usage remained stable',
      confidence: 0.7,
      comparisonWindows: {
        historical: 30,
        recent: 10,
      },
      observedMetrics: {
        historicalFrequency: 0.2,
        recentFrequency: 0.22,
        historicalAvgDuration: 60000,
        recentAvgDuration: 65000,
        commonTransitions: [],
      },
      timestamp: new Date().toISOString(),
      recommendation: 'inform-only',
    };

    const formatted = formatContextDriftReport(report);

    expect(formatted).toContain('STABLE');
    expect(formatted).toContain('No significant change');
  });
});

/* =========================================================
   SYSTEM PROMPT TESTS
   ========================================================= */

describe('Context Drift Detector System Prompt', () => {
  it('should include observational rules', () => {
    expect(CONTEXT_DRIFT_DETECTOR_SYSTEM_PROMPT).toContain('descriptive only');
    expect(CONTEXT_DRIFT_DETECTOR_SYSTEM_PROMPT).toContain('Awareness only');
  });

  it('should list observed signals', () => {
    expect(CONTEXT_DRIFT_DETECTOR_SYSTEM_PROMPT).toContain('Frequency of context type usage');
    expect(CONTEXT_DRIFT_DETECTOR_SYSTEM_PROMPT).toContain('Duration spent in contexts');
    expect(CONTEXT_DRIFT_DETECTOR_SYSTEM_PROMPT).toContain('Transitions between contexts');
  });

  it('should list NOT observed items', () => {
    expect(CONTEXT_DRIFT_DETECTOR_SYSTEM_PROMPT).toContain('Intent validity');
    expect(CONTEXT_DRIFT_DETECTOR_SYSTEM_PROMPT).toContain('Decision quality');
    expect(CONTEXT_DRIFT_DETECTOR_SYSTEM_PROMPT).toContain('User correctness');
  });

  it('should include language rules', () => {
    expect(CONTEXT_DRIFT_DETECTOR_SYSTEM_PROMPT).toContain('ALLOWED LANGUAGE');
    expect(CONTEXT_DRIFT_DETECTOR_SYSTEM_PROMPT).toContain('FORBIDDEN LANGUAGE');
    expect(CONTEXT_DRIFT_DETECTOR_SYSTEM_PROMPT).toContain('caused by');
    expect(CONTEXT_DRIFT_DETECTOR_SYSTEM_PROMPT).toContain('should avoid');
  });

  it('should state no authority', () => {
    expect(CONTEXT_DRIFT_DETECTOR_SYSTEM_PROMPT).toContain('No authority');
    expect(CONTEXT_DRIFT_DETECTOR_SYSTEM_PROMPT).toContain('No enforcement');
    expect(CONTEXT_DRIFT_DETECTOR_SYSTEM_PROMPT).toContain('Context acknowledged');
  });
});

/* =========================================================
   SINGLETON TESTS
   ========================================================= */

describe('contextDriftDetector singleton', () => {
  it('should be an instance of ContextDriftDetectorAgent', () => {
    expect(contextDriftDetector).toBeInstanceOf(ContextDriftDetectorAgent);
  });

  it('should be usable directly', () => {
    contextDriftDetector.addSimulatedData(50, 30);
    const result = contextDriftDetector.analyze();
    expect(result.confirmation).toBe(AGENT_CONFIRMATION);
  });
});

/* =========================================================
   NEUTRAL LANGUAGE TESTS
   ========================================================= */

describe('Neutral Language Compliance', () => {
  let detector: ContextDriftDetectorAgent;

  beforeEach(() => {
    detector = new ContextDriftDetectorAgent();
    detector.addSimulatedData(100, 60);
  });

  it('should use neutral direction descriptions', () => {
    const result = detector.analyze();

    for (const report of result.reports) {
      // Should NOT contain forbidden phrases
      expect(report.direction).not.toContain('caused by');
      expect(report.direction).not.toContain('leads to');
      expect(report.direction).not.toContain('results in');
      expect(report.direction).not.toContain('should avoid');

      // Should contain allowed phrases
      const hasAllowedPhrase =
        report.direction.includes('observed') ||
        report.direction.includes('stable') ||
        report.direction.includes('remained');

      expect(hasAllowedPhrase).toBe(true);
    }
  });
});

/* =========================================================
   TRANSITION PATTERN TESTS
   ========================================================= */

describe('Transition Pattern Analysis', () => {
  let detector: ContextDriftDetectorAgent;

  beforeEach(() => {
    detector = new ContextDriftDetectorAgent();
    detector.addSimulatedData(100, 60);
  });

  it('should track transition changes', () => {
    const result = detector.analyze();

    for (const pattern of result.transitionPatterns) {
      expect(pattern).toHaveProperty('from');
      expect(pattern).toHaveProperty('to');
      expect(pattern).toHaveProperty('frequency');
      expect(pattern).toHaveProperty('change');

      expect(['increased', 'decreased', 'stable']).toContain(pattern.change);
    }
  });

  it('should limit transition patterns', () => {
    const result = detector.analyze();
    expect(result.transitionPatterns.length).toBeLessThanOrEqual(10);
  });
});
