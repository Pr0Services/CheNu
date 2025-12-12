/* =====================================================
   CHE·NU — COLLECTIVE DRIFT OVERLAY TESTS
   ===================================================== */

import { describe, it, expect, beforeEach } from 'vitest';

import {
  CollectiveDriftOverlayGenerator,
  collectiveDriftOverlay,
  formatCollectiveOverlay,
  COLLECTIVE_DRIFT_OVERLAY_SYSTEM_PROMPT,
  PRIVACY_GUARANTEE,
  DEFAULT_COLLECTIVE_CONFIG,
  type CollectiveDriftCell,
  type CollectiveParticipant,
} from './collectiveDriftOverlay';

import { AGENT_CONFIRMATION } from './internalAgentContext';

/* =========================================================
   UNIT TESTS
   ========================================================= */

describe('CollectiveDriftOverlayGenerator', () => {
  let generator: CollectiveDriftOverlayGenerator;

  beforeEach(() => {
    generator = new CollectiveDriftOverlayGenerator();
  });

  describe('initialization', () => {
    it('should initialize with default config', () => {
      expect(generator).toBeDefined();
    });

    it('should accept custom config', () => {
      const custom = new CollectiveDriftOverlayGenerator({
        minCohortSize: 10,
      });
      expect(custom).toBeDefined();
    });
  });

  describe('opt-in / opt-out', () => {
    it('should allow users to opt in', () => {
      const participant = generator.optIn('user-123');

      expect(participant.optedIn).toBe(true);
      expect(participant.anonymousId).toBeDefined();
      expect(participant.anonymousId).not.toBe('user-123');
    });

    it('should anonymize user IDs', () => {
      const participant = generator.optIn('user-123');

      expect(participant.anonymousId).toContain('anon-');
      expect(participant.anonymousId).not.toContain('user-123');
    });

    it('should allow users to opt out', () => {
      generator.optIn('user-456');
      generator.contribute('user-456', 'exploration', 0.5, 30000);

      generator.optOut('user-456');

      // After opt-out, user data should not be included
      const overlay = generator.generateOverlay();
      expect(overlay.summary.totalParticipants).toBe(0);
    });
  });

  describe('contribute', () => {
    it('should accept contributions from opted-in users', () => {
      generator.optIn('user-789');

      const result = generator.contribute('user-789', 'exploration', 0.5, 30000);

      expect(result).toBe(true);
    });

    it('should reject contributions from non-opted-in users', () => {
      const result = generator.contribute('user-unknown', 'exploration', 0.5, 30000);

      expect(result).toBe(false);
    });
  });

  describe('generateOverlay', () => {
    beforeEach(() => {
      generator.addSimulatedData(50);
    });

    it('should return overlay with confirmation', () => {
      const overlay = generator.generateOverlay();

      expect(overlay.confirmation).toBe(AGENT_CONFIRMATION);
      expect(overlay.generatedAt).toBeDefined();
    });

    it('should include privacy guarantee', () => {
      const overlay = generator.generateOverlay();

      expect(overlay.privacyGuarantee).toBe(PRIVACY_GUARANTEE);
    });

    it('should include summary', () => {
      const overlay = generator.generateOverlay();

      expect(overlay.summary).toHaveProperty('totalParticipants');
      expect(overlay.summary).toHaveProperty('timeRange');
      expect(overlay.summary).toHaveProperty('spheresCovered');
      expect(overlay.summary).toHaveProperty('contextsCovered');
    });

    it('should include atmosphere for XR views', () => {
      const overlay = generator.generateOverlay();

      expect(overlay.atmosphere).toHaveProperty('overallDensity');
      expect(overlay.atmosphere).toHaveProperty('dominantContext');
      expect(overlay.atmosphere).toHaveProperty('evolutionTrend');
    });

    it('should include cells with minimum cohort size', () => {
      const overlay = generator.generateOverlay();

      for (const cell of overlay.cells) {
        expect(cell.cohortThresholdMet).toBe(true);
        expect(cell.participantCount).toBeGreaterThanOrEqual(DEFAULT_COLLECTIVE_CONFIG.minCohortSize);
      }
    });
  });

  describe('cell structure', () => {
    beforeEach(() => {
      generator.addSimulatedData(50);
    });

    it('should have correct cell structure', () => {
      const overlay = generator.generateOverlay();

      for (const cell of overlay.cells) {
        expect(cell).toHaveProperty('contextType');
        expect(cell).toHaveProperty('timeWindow');
        expect(cell).toHaveProperty('driftDensity');
        expect(cell).toHaveProperty('participantCount');
        expect(cell).toHaveProperty('cohortThresholdMet');
        expect(cell).toHaveProperty('aggregatedMetrics');
      }
    });

    it('should have valid density values', () => {
      const overlay = generator.generateOverlay();

      for (const cell of overlay.cells) {
        expect(['low', 'medium', 'high']).toContain(cell.driftDensity);
      }
    });

    it('should include aggregated metrics', () => {
      const overlay = generator.generateOverlay();

      for (const cell of overlay.cells) {
        expect(cell.aggregatedMetrics).toHaveProperty('avgFrequency');
        expect(cell.aggregatedMetrics).toHaveProperty('avgDuration');
        expect(cell.aggregatedMetrics).toHaveProperty('stdDeviation');
      }
    });
  });

  describe('filtered access', () => {
    beforeEach(() => {
      generator.addSimulatedData(50);
    });

    it('should filter cells by sphere', () => {
      const cells = generator.getCellsBySphere('creative');

      for (const cell of cells) {
        expect(cell.sphereId).toBe('creative');
      }
    });

    it('should filter cells by context', () => {
      const cells = generator.getCellsByContext('exploration');

      for (const cell of cells) {
        expect(cell.contextType).toBe('exploration');
      }
    });
  });
});

/* =========================================================
   PRIVACY TESTS
   ========================================================= */

describe('Privacy Compliance', () => {
  let generator: CollectiveDriftOverlayGenerator;

  beforeEach(() => {
    generator = new CollectiveDriftOverlayGenerator();
    generator.addSimulatedData(50);
  });

  it('should never expose original user IDs', () => {
    const overlay = generator.generateOverlay();
    const overlayStr = JSON.stringify(overlay);

    // Should not contain "user-" pattern from simulation
    expect(overlayStr).not.toMatch(/simulated-user-\d+/);
  });

  it('should enforce minimum cohort size', () => {
    const smallGenerator = new CollectiveDriftOverlayGenerator({
      minCohortSize: 10,
    });

    // Add only 3 users
    for (let i = 0; i < 3; i++) {
      smallGenerator.optIn(`small-user-${i}`);
      smallGenerator.contribute(`small-user-${i}`, 'exploration', 0.5, 30000);
    }

    const overlay = smallGenerator.generateOverlay();

    // All cells should have cohortThresholdMet = false or be excluded
    expect(overlay.cells.length).toBe(0);
  });

  it('should include privacy guarantee in every overlay', () => {
    const overlay = generator.generateOverlay();

    expect(overlay.privacyGuarantee).toContain('Anonymized');
    expect(overlay.privacyGuarantee).toContain('opt-in');
    expect(overlay.privacyGuarantee).toContain('minimum cohort');
  });
});

/* =========================================================
   FORMATTER TESTS
   ========================================================= */

describe('formatCollectiveOverlay', () => {
  it('should format overlay correctly', () => {
    const generator = new CollectiveDriftOverlayGenerator();
    generator.addSimulatedData(50);

    const overlay = generator.generateOverlay();
    const formatted = formatCollectiveOverlay(overlay);

    expect(formatted).toContain('COLLECTIVE DRIFT OVERLAY');
    expect(formatted).toContain('SUMMARY');
    expect(formatted).toContain('Total Participants');
    expect(formatted).toContain('ATMOSPHERE');
    expect(formatted).toContain('PRIVACY GUARANTEE');
    expect(formatted).toContain(AGENT_CONFIRMATION);
  });
});

/* =========================================================
   SYSTEM PROMPT TESTS
   ========================================================= */

describe('Collective Drift Overlay System Prompt', () => {
  it('should include participation rules', () => {
    expect(COLLECTIVE_DRIFT_OVERLAY_SYSTEM_PROMPT).toContain('Strictly opt-in');
    expect(COLLECTIVE_DRIFT_OVERLAY_SYSTEM_PROMPT).toContain('Anonymized');
    expect(COLLECTIVE_DRIFT_OVERLAY_SYSTEM_PROMPT).toContain('minimum cohort size');
  });

  it('should include allowed overlays', () => {
    expect(COLLECTIVE_DRIFT_OVERLAY_SYSTEM_PROMPT).toContain('Density');
    expect(COLLECTIVE_DRIFT_OVERLAY_SYSTEM_PROMPT).toContain('Coexistence');
    expect(COLLECTIVE_DRIFT_OVERLAY_SYSTEM_PROMPT).toContain('Evolution');
  });

  it('should include forbidden overlays', () => {
    expect(COLLECTIVE_DRIFT_OVERLAY_SYSTEM_PROMPT).toContain('Rankings');
    expect(COLLECTIVE_DRIFT_OVERLAY_SYSTEM_PROMPT).toContain('Best practices');
    expect(COLLECTIVE_DRIFT_OVERLAY_SYSTEM_PROMPT).toContain('Prescriptive labels');
  });

  it('should state no authority', () => {
    expect(COLLECTIVE_DRIFT_OVERLAY_SYSTEM_PROMPT).toContain('No authority');
    expect(COLLECTIVE_DRIFT_OVERLAY_SYSTEM_PROMPT).toContain('No enforcement');
  });
});

/* =========================================================
   SINGLETON TESTS
   ========================================================= */

describe('collectiveDriftOverlay singleton', () => {
  it('should be an instance of CollectiveDriftOverlayGenerator', () => {
    expect(collectiveDriftOverlay).toBeInstanceOf(CollectiveDriftOverlayGenerator);
  });

  it('should be usable directly', () => {
    collectiveDriftOverlay.addSimulatedData(20);
    const overlay = collectiveDriftOverlay.generateOverlay();
    expect(overlay.confirmation).toBe(AGENT_CONFIRMATION);
  });
});

/* =========================================================
   ATMOSPHERE TESTS
   ========================================================= */

describe('Atmosphere Calculation', () => {
  let generator: CollectiveDriftOverlayGenerator;

  beforeEach(() => {
    generator = new CollectiveDriftOverlayGenerator();
    generator.addSimulatedData(50);
  });

  it('should calculate overall density', () => {
    const overlay = generator.generateOverlay();

    expect(['low', 'medium', 'high']).toContain(overlay.atmosphere.overallDensity);
  });

  it('should identify dominant context', () => {
    const overlay = generator.generateOverlay();

    if (overlay.atmosphere.dominantContext !== null) {
      expect(typeof overlay.atmosphere.dominantContext).toBe('string');
    }
  });

  it('should track evolution trend', () => {
    const overlay = generator.generateOverlay();

    expect(['increasing', 'decreasing', 'stable']).toContain(overlay.atmosphere.evolutionTrend);
  });
});

/* =========================================================
   DEFAULT CONFIG TESTS
   ========================================================= */

describe('DEFAULT_COLLECTIVE_CONFIG', () => {
  it('should have required fields', () => {
    expect(DEFAULT_COLLECTIVE_CONFIG).toHaveProperty('minCohortSize');
    expect(DEFAULT_COLLECTIVE_CONFIG).toHaveProperty('defaultTimeWindow');
    expect(DEFAULT_COLLECTIVE_CONFIG).toHaveProperty('hashSalt');
    expect(DEFAULT_COLLECTIVE_CONFIG).toHaveProperty('enableAtmosphere');
  });

  it('should have reasonable minimum cohort size', () => {
    expect(DEFAULT_COLLECTIVE_CONFIG.minCohortSize).toBeGreaterThanOrEqual(3);
  });
});
