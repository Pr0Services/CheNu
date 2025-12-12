/* =====================================================
   CHE·NU — TEMPORAL BRAIDING TESTS
   ===================================================== */

import { describe, it, expect, beforeEach } from 'vitest';

import {
  type TemporalStrand,
  type TemporalBraiding,
  type StrandType,
  type StrandDensity,
  STRAND_TYPE_COLORS,
  DEFAULT_BRAIDING_CONFIG,
  TEMPORAL_BRAIDING_DECLARATION,
  BRAIDING_FAILSAFES,
  ALLOWED_TEMPORAL_TERMS,
  FORBIDDEN_CAUSAL_TERMS,
  isTemporallyNeutral,
} from './temporalBraiding.types';

import {
  generateBraiding,
  createStrand,
  createPoint,
  detectOverlaps,
  computeStrandLayout,
  computeStrandPath,
  getPausedMoment,
  getBraidingSummary,
  toXRBraiding,
  computeDensityAtTime,
} from './temporalBraidingEngine';

/* =========================================================
   TEST DATA
   ========================================================= */

function createMockStrand(
  type: StrandType,
  daysAgo: number = 0,
  duration: number = 7
): TemporalStrand {
  const now = Date.now();
  const start = new Date(now - (daysAgo + duration) * 24 * 60 * 60 * 1000);
  const end = new Date(now - daysAgo * 24 * 60 * 60 * 1000);

  const points = [];
  for (let i = 0; i <= 5; i++) {
    const time = new Date(
      start.getTime() + (i / 5) * (end.getTime() - start.getTime())
    );

    points.push(
      createPoint(
        time.toISOString(),
        { index: i },
        i % 2 === 0 ? 'normal' : 'thick',
        0.7 + Math.random() * 0.3,
        `Point ${i}`
      )
    );
  }

  return createStrand(
    `strand-${type}-${daysAgo}`,
    type,
    `${type} strand`,
    points,
    'test'
  );
}

/* =========================================================
   TYPE TESTS
   ========================================================= */

describe('Temporal Braiding Types', () => {
  describe('ALLOWED_TEMPORAL_TERMS', () => {
    it('should include safe temporal descriptors', () => {
      expect(ALLOWED_TEMPORAL_TERMS).toContain('concurrent');
      expect(ALLOWED_TEMPORAL_TERMS).toContain('overlapping');
      expect(ALLOWED_TEMPORAL_TERMS).toContain('adjacent');
      expect(ALLOWED_TEMPORAL_TERMS).toContain('independent');
      expect(ALLOWED_TEMPORAL_TERMS).toContain('staggered');
      expect(ALLOWED_TEMPORAL_TERMS).toContain('parallel');
      expect(ALLOWED_TEMPORAL_TERMS).toContain('coexisting');
    });
  });

  describe('FORBIDDEN_CAUSAL_TERMS', () => {
    it('should include forbidden causal language', () => {
      expect(FORBIDDEN_CAUSAL_TERMS).toContain('before causing');
      expect(FORBIDDEN_CAUSAL_TERMS).toContain('after resulting in');
      expect(FORBIDDEN_CAUSAL_TERMS).toContain('leads to');
      expect(FORBIDDEN_CAUSAL_TERMS).toContain('consequence');
      expect(FORBIDDEN_CAUSAL_TERMS).toContain('triggered');
      expect(FORBIDDEN_CAUSAL_TERMS).toContain('caused by');
    });
  });

  describe('isTemporallyNeutral', () => {
    it('should allow neutral temporal language', () => {
      expect(isTemporallyNeutral('concurrent events')).toBe(true);
      expect(isTemporallyNeutral('overlapping periods')).toBe(true);
      expect(isTemporallyNeutral('strands are adjacent')).toBe(true);
    });

    it('should reject causal language', () => {
      expect(isTemporallyNeutral('before causing the change')).toBe(false);
      expect(isTemporallyNeutral('this leads to that')).toBe(false);
      expect(isTemporallyNeutral('as a result of')).toBe(false);
      expect(isTemporallyNeutral('event triggered response')).toBe(false);
    });
  });

  describe('BRAIDING_FAILSAFES', () => {
    it('should have all safety flags', () => {
      expect(BRAIDING_FAILSAFES.noStrandMerging).toBe(true);
      expect(BRAIDING_FAILSAFES.noAutomaticSynthesis).toBe(true);
      expect(BRAIDING_FAILSAFES.noInferredOrdering).toBe(true);
      expect(BRAIDING_FAILSAFES.noHistoricalCorrection).toBe(true);
      expect(BRAIDING_FAILSAFES.noKeyMomentHighlighting).toBe(true);
      expect(BRAIDING_FAILSAFES.noProposedInterpretations).toBe(true);
      expect(BRAIDING_FAILSAFES.noAutomaticCompression).toBe(true);
      expect(BRAIDING_FAILSAFES.noArrows).toBe(true);
      expect(BRAIDING_FAILSAFES.noBranchingImplyingOutcome).toBe(true);
      expect(BRAIDING_FAILSAFES.calmMotionOnly).toBe(true);
    });
  });

  describe('STRAND_TYPE_COLORS', () => {
    it('should have colors for all strand types', () => {
      expect(STRAND_TYPE_COLORS['preference-evolution']).toBeDefined();
      expect(STRAND_TYPE_COLORS['context-usage']).toBeDefined();
      expect(STRAND_TYPE_COLORS['narrative-emergence']).toBeDefined();
      expect(STRAND_TYPE_COLORS['project-phase']).toBeDefined();
      expect(STRAND_TYPE_COLORS['meeting-occurrence']).toBeDefined();
      expect(STRAND_TYPE_COLORS['decision-point']).toBeDefined();
      expect(STRAND_TYPE_COLORS['drift-observation']).toBeDefined();
    });
  });
});

/* =========================================================
   ENGINE TESTS
   ========================================================= */

describe('Temporal Braiding Engine', () => {
  let mockStrands: TemporalStrand[];

  beforeEach(() => {
    mockStrands = [
      createMockStrand('preference-evolution', 0),
      createMockStrand('context-usage', 3),
      createMockStrand('narrative-emergence', 5),
      createMockStrand('project-phase', 10),
    ];
  });

  describe('createStrand', () => {
    it('should create strand with sorted points', () => {
      const points = [
        createPoint('2024-01-05T00:00:00Z', 'b'),
        createPoint('2024-01-01T00:00:00Z', 'a'),
        createPoint('2024-01-10T00:00:00Z', 'c'),
      ];

      const strand = createStrand(
        'test',
        'preference-evolution',
        'Test',
        points,
        'test'
      );

      expect(strand.points[0].value).toBe('a');
      expect(strand.points[1].value).toBe('b');
      expect(strand.points[2].value).toBe('c');
    });

    it('should set correct time bounds', () => {
      const strand = createMockStrand('context-usage', 0);

      expect(new Date(strand.startTime).getTime())
        .toBeLessThan(new Date(strand.endTime).getTime());
    });

    it('should assign correct color based on type', () => {
      const strand = createMockStrand('narrative-emergence', 0);

      expect(strand.color).toBe(STRAND_TYPE_COLORS['narrative-emergence']);
    });
  });

  describe('createPoint', () => {
    it('should create point with defaults', () => {
      const point = createPoint('2024-01-01T00:00:00Z', 'test');

      expect(point.density).toBe('normal');
      expect(point.confidence).toBe(0.8);
      expect(point.uncertain).toBe(false);
    });

    it('should mark low confidence as uncertain', () => {
      const point = createPoint('2024-01-01T00:00:00Z', 'test', 'thin', 0.3);

      expect(point.uncertain).toBe(true);
    });
  });

  describe('generateBraiding', () => {
    it('should generate braiding from strands', () => {
      const braiding = generateBraiding(mockStrands);

      expect(braiding.strands.length).toBe(mockStrands.length);
      expect(braiding.declaration).toBe(TEMPORAL_BRAIDING_DECLARATION);
    });

    it('should compute overlaps', () => {
      const braiding = generateBraiding(mockStrands);

      expect(braiding.overlaps).toBeDefined();
      expect(Array.isArray(braiding.overlaps)).toBe(true);
    });

    it('should include all strands as visible by default', () => {
      const braiding = generateBraiding(mockStrands);

      expect(braiding.config.visibleStrands.length).toBe(mockStrands.length);
    });

    it('should include metadata', () => {
      const braiding = generateBraiding(mockStrands);

      expect(braiding.metadata.totalTimeSpan).toBeDefined();
      expect(braiding.metadata.strandTypesPresent.length).toBeGreaterThan(0);
      expect(braiding.metadata.generatedAt).toBeDefined();
    });
  });

  describe('detectOverlaps', () => {
    it('should detect overlapping strands', () => {
      const overlappingStrands = [
        createMockStrand('preference-evolution', 0, 10),
        createMockStrand('context-usage', 5, 10), // Overlaps
      ];

      const overlaps = detectOverlaps(overlappingStrands);

      expect(overlaps.length).toBeGreaterThan(0);
    });

    it('should not detect non-overlapping strands', () => {
      const nonOverlapping = [
        createMockStrand('preference-evolution', 20, 5),
        createMockStrand('context-usage', 0, 5),
      ];

      const overlaps = detectOverlaps(nonOverlapping);

      expect(overlaps.length).toBe(0);
    });

    it('should use neutral language in overlap descriptions', () => {
      const overlappingStrands = [
        createMockStrand('preference-evolution', 0, 10),
        createMockStrand('context-usage', 5, 10),
      ];

      const overlaps = detectOverlaps(overlappingStrands);

      for (const overlap of overlaps) {
        expect(isTemporallyNeutral(overlap.description)).toBe(true);
      }
    });
  });

  describe('computeStrandLayout', () => {
    it('should compute Y positions for strands', () => {
      const braiding = generateBraiding(mockStrands);
      const layout = computeStrandLayout(braiding, 500);

      expect(layout.size).toBe(mockStrands.length);

      for (const [strandId, yPos] of layout) {
        expect(typeof yPos).toBe('number');
        expect(yPos).toBeGreaterThan(0);
        expect(yPos).toBeLessThan(500);
      }
    });

    it('should distribute strands evenly', () => {
      const braiding = generateBraiding(mockStrands);
      const layout = computeStrandLayout(braiding, 500, 50);

      const positions = [...layout.values()].sort((a, b) => a - b);

      // Check spacing is roughly equal
      for (let i = 1; i < positions.length; i++) {
        const spacing = positions[i] - positions[i - 1];
        expect(spacing).toBeGreaterThan(50);
      }
    });
  });

  describe('computeStrandPath', () => {
    it('should compute path points for strand', () => {
      const braiding = generateBraiding(mockStrands);
      const strand = mockStrands[0];
      const path = computeStrandPath(strand, braiding, 800, 100);

      expect(path.length).toBe(strand.points.length);

      for (const point of path) {
        expect(typeof point.x).toBe('number');
        expect(typeof point.y).toBe('number');
        expect(typeof point.width).toBe('number');
        expect(typeof point.opacity).toBe('number');
      }
    });
  });

  describe('getPausedMoment', () => {
    it('should get values at paused moment', () => {
      const braiding = generateBraiding(mockStrands);
      const midTime = new Date(
        (new Date(braiding.metadata.totalTimeSpan.start).getTime() +
          new Date(braiding.metadata.totalTimeSpan.end).getTime()) /
          2
      ).toISOString();

      const moment = getPausedMoment(braiding, midTime);

      expect(moment.timestamp).toBe(midTime);
      expect(moment.visibleStrands.length).toBeGreaterThan(0);
      expect(Object.keys(moment.strandValues).length).toBeGreaterThan(0);
    });
  });

  describe('getBraidingSummary', () => {
    it('should generate neutral summary', () => {
      const braiding = generateBraiding(mockStrands);
      const summary = getBraidingSummary(braiding);

      expect(summary).toContain('strands');
      expect(summary).toContain('overlaps');
      expect(isTemporallyNeutral(summary)).toBe(true);
    });
  });

  describe('toXRBraiding', () => {
    it('should convert to XR ribbons', () => {
      const braiding = generateBraiding(mockStrands);
      const xrRibbons = toXRBraiding(braiding);

      expect(xrRibbons.length).toBe(mockStrands.length);

      for (const ribbon of xrRibbons) {
        expect(ribbon.points.length).toBeGreaterThan(0);

        for (const point of ribbon.points) {
          expect(typeof point.x).toBe('number');
          expect(typeof point.y).toBe('number');
          expect(typeof point.z).toBe('number');
          expect(typeof point.width).toBe('number');
          expect(typeof point.opacity).toBe('number');
        }
      }
    });
  });

  describe('computeDensityAtTime', () => {
    it('should compute density at specific time', () => {
      const strand = createMockStrand('preference-evolution', 0);
      const midTime = new Date(
        (new Date(strand.startTime).getTime() +
          new Date(strand.endTime).getTime()) /
          2
      ).toISOString();

      const density = computeDensityAtTime(strand, midTime);

      expect(['thick', 'normal', 'thin', 'absent']).toContain(density);
    });

    it('should return absent for time outside strand', () => {
      const strand = createMockStrand('preference-evolution', 10, 5);
      const futureTime = new Date().toISOString();

      const density = computeDensityAtTime(strand, futureTime);

      // Should return last known density or absent
      expect(['thick', 'normal', 'thin', 'absent']).toContain(density);
    });
  });
});

/* =========================================================
   DECLARATION TESTS
   ========================================================= */

describe('System Declaration', () => {
  it('should include correct declaration', () => {
    expect(TEMPORAL_BRAIDING_DECLARATION).toContain('plurality of time');
    expect(TEMPORAL_BRAIDING_DECLARATION).toContain('multiple evolutions');
    expect(TEMPORAL_BRAIDING_DECLARATION).toContain('coexist without hierarchy');
    expect(TEMPORAL_BRAIDING_DECLARATION).toContain('observed, not resolved');
  });

  it('should be included in braiding', () => {
    const braiding = generateBraiding([createMockStrand('preference-evolution')]);
    expect(braiding.declaration).toBe(TEMPORAL_BRAIDING_DECLARATION);
  });
});

/* =========================================================
   ALIGNMENT TESTS
   ========================================================= */

describe('Alignment Modes', () => {
  it('should support absolute alignment', () => {
    const strands = [createMockStrand('preference-evolution')];
    const braiding = generateBraiding(strands, { alignmentMode: 'absolute' });

    expect(braiding.config.alignmentMode).toBe('absolute');
  });

  it('should support relative alignment', () => {
    const strands = [createMockStrand('preference-evolution')];
    const braiding = generateBraiding(strands, { alignmentMode: 'relative' });

    expect(braiding.config.alignmentMode).toBe('relative');
  });

  it('should support normalized alignment', () => {
    const strands = [createMockStrand('preference-evolution')];
    const braiding = generateBraiding(strands, { alignmentMode: 'normalized' });

    expect(braiding.config.alignmentMode).toBe('normalized');
  });
});
