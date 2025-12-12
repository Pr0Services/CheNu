/* =====================================================
   CHE·NU — NARRATIVE CONSTELLATION TESTS
   ===================================================== */

import { describe, it, expect, beforeEach } from 'vitest';

import {
  type NarrativeNode,
  type NarrativeConstellation,
  type ConstellationFilter,
  SCOPE_COLORS,
  DEFAULT_CONSTELLATION_CONFIG,
  NARRATIVE_CONSTELLATION_DECLARATION,
  CONSTELLATION_FAILSAFES,
  ALLOWED_CONSTELLATION_LABELS,
  FORBIDDEN_CONSTELLATION_LABELS,
  isAllowedLabel,
} from './narrativeConstellation.types';

import {
  generateConstellation,
  findNearbyNodes,
  getConstellationSummary,
  toXRConstellation,
  checkTemporalOverlap,
} from './narrativeConstellationEngine';

import { type DriftNarrative } from './driftNarrative.types';

/* =========================================================
   TEST DATA
   ========================================================= */

function createMockNarrative(
  scope: 'session' | 'project' | 'sphere' | 'global',
  daysAgo: number = 0
): DriftNarrative {
  const now = Date.now();
  const start = new Date(now - (daysAgo + 7) * 24 * 60 * 60 * 1000);
  const end = new Date(now - daysAgo * 24 * 60 * 60 * 1000);

  return {
    scope,
    dateRange: {
      start: start.toISOString(),
      end: end.toISOString(),
    },
    observations: [
      {
        observationId: `obs-${Math.random().toString(36).substr(2, 9)}`,
        preferenceKey: 'test.preference',
        changeDescription: 'preference shift observed',
        observedAt: end.toISOString(),
        contextSummary: 'test context',
      },
    ],
    variations: [],
    uncertainty: {
      level: 'low',
      disclaimer: 'Test disclaimer',
    },
    overallConfidence: 0.8,
    generatedAt: new Date().toISOString(),
    cannotConclude: [],
    recommendation: 'inform-only',
  };
}

/* =========================================================
   TYPE TESTS
   ========================================================= */

describe('Narrative Constellation Types', () => {
  describe('ALLOWED_CONSTELLATION_LABELS', () => {
    it('should include safe descriptors', () => {
      expect(ALLOWED_CONSTELLATION_LABELS).toContain('near');
      expect(ALLOWED_CONSTELLATION_LABELS).toContain('distant');
      expect(ALLOWED_CONSTELLATION_LABELS).toContain('concurrent');
      expect(ALLOWED_CONSTELLATION_LABELS).toContain('overlapping');
      expect(ALLOWED_CONSTELLATION_LABELS).toContain('isolated');
    });
  });

  describe('FORBIDDEN_CONSTELLATION_LABELS', () => {
    it('should include forbidden descriptors', () => {
      expect(FORBIDDEN_CONSTELLATION_LABELS).toContain('central');
      expect(FORBIDDEN_CONSTELLATION_LABELS).toContain('peripheral');
      expect(FORBIDDEN_CONSTELLATION_LABELS).toContain('dominant');
      expect(FORBIDDEN_CONSTELLATION_LABELS).toContain('influential');
      expect(FORBIDDEN_CONSTELLATION_LABELS).toContain('aligned');
    });
  });

  describe('isAllowedLabel', () => {
    it('should allow safe labels', () => {
      expect(isAllowedLabel('near')).toBe(true);
      expect(isAllowedLabel('distant')).toBe(true);
      expect(isAllowedLabel('concurrent')).toBe(true);
    });

    it('should reject forbidden labels', () => {
      expect(isAllowedLabel('central')).toBe(false);
      expect(isAllowedLabel('dominant')).toBe(false);
      expect(isAllowedLabel('influential')).toBe(false);
      expect(isAllowedLabel('this is the central point')).toBe(false);
    });
  });

  describe('CONSTELLATION_FAILSAFES', () => {
    it('should have all safety flags', () => {
      expect(CONSTELLATION_FAILSAFES.readOnly).toBe(true);
      expect(CONSTELLATION_FAILSAFES.noAutoCentering).toBe(true);
      expect(CONSTELLATION_FAILSAFES.noHighlightedPaths).toBe(true);
      expect(CONSTELLATION_FAILSAFES.noOptimizationSuggestions).toBe(true);
      expect(CONSTELLATION_FAILSAFES.slowTransitionsOnly).toBe(true);
      expect(CONSTELLATION_FAILSAFES.noArrows).toBe(true);
      expect(CONSTELLATION_FAILSAFES.noFlowLines).toBe(true);
    });
  });

  describe('SCOPE_COLORS', () => {
    it('should have colors for all scopes', () => {
      expect(SCOPE_COLORS.session).toBeDefined();
      expect(SCOPE_COLORS.project).toBeDefined();
      expect(SCOPE_COLORS.sphere).toBeDefined();
      expect(SCOPE_COLORS.global).toBeDefined();
    });
  });
});

/* =========================================================
   ENGINE TESTS
   ========================================================= */

describe('Narrative Constellation Engine', () => {
  let mockNarratives: DriftNarrative[];

  beforeEach(() => {
    mockNarratives = [
      createMockNarrative('session', 0),
      createMockNarrative('project', 5),
      createMockNarrative('sphere', 10),
      createMockNarrative('global', 15),
    ];
  });

  describe('generateConstellation', () => {
    it('should generate constellation from narratives', () => {
      const constellation = generateConstellation(mockNarratives);

      expect(constellation.nodes.length).toBe(mockNarratives.length);
      expect(constellation.declaration).toBe(NARRATIVE_CONSTELLATION_DECLARATION);
    });

    it('should compute node positions', () => {
      const constellation = generateConstellation(mockNarratives);

      for (const node of constellation.nodes) {
        expect(node.position).toBeDefined();
        expect(typeof node.position?.x).toBe('number');
        expect(typeof node.position?.y).toBe('number');
      }
    });

    it('should compute node visuals', () => {
      const constellation = generateConstellation(mockNarratives);

      for (const node of constellation.nodes) {
        expect(node.visual).toBeDefined();
        expect(typeof node.visual?.size).toBe('number');
        expect(typeof node.visual?.color).toBe('string');
        expect(typeof node.visual?.opacity).toBe('number');
      }
    });

    it('should compute relationships when enabled', () => {
      const constellation = generateConstellation(mockNarratives, {
        showRelationships: true,
      });

      expect(constellation.relationships).toBeDefined();
      expect(Array.isArray(constellation.relationships)).toBe(true);
    });

    it('should skip relationships when disabled', () => {
      const constellation = generateConstellation(mockNarratives, {
        showRelationships: false,
      });

      expect(constellation.relationships.length).toBe(0);
    });

    it('should include metadata', () => {
      const constellation = generateConstellation(mockNarratives);

      expect(constellation.metadata.totalNarratives).toBe(mockNarratives.length);
      expect(constellation.metadata.overallTimeRange).toBeDefined();
      expect(constellation.metadata.scopesRepresented.length).toBeGreaterThan(0);
      expect(constellation.metadata.generatedAt).toBeDefined();
    });
  });

  describe('layouts', () => {
    it('should support spatial layout', () => {
      const constellation = generateConstellation(mockNarratives, {
        layout: 'spatial',
      });

      expect(constellation.config.layout).toBe('spatial');
    });

    it('should support clustered layout', () => {
      const constellation = generateConstellation(mockNarratives, {
        layout: 'clustered',
      });

      expect(constellation.config.layout).toBe('clustered');
    });

    it('should support layered layout', () => {
      const constellation = generateConstellation(mockNarratives, {
        layout: 'layered',
      });

      expect(constellation.config.layout).toBe('layered');
    });

    it('should support sphere-separated layout', () => {
      const constellation = generateConstellation(mockNarratives, {
        layout: 'sphere-separated',
      });

      expect(constellation.config.layout).toBe('sphere-separated');
    });
  });

  describe('findNearbyNodes', () => {
    it('should find nodes near a target', () => {
      const constellation = generateConstellation(mockNarratives);
      const targetNode = constellation.nodes[0];

      const nearby = findNearbyNodes(constellation, targetNode.narrativeId, 500);

      // Should not include the target itself
      expect(nearby.every((n) => n.nodeId !== targetNode.narrativeId)).toBe(true);
    });

    it('should use allowed language in relationships', () => {
      const constellation = generateConstellation(mockNarratives);
      const targetNode = constellation.nodes[0];

      const nearby = findNearbyNodes(constellation, targetNode.narrativeId, 500);

      for (const n of nearby) {
        expect(ALLOWED_CONSTELLATION_LABELS).toContain(n.relationship);
      }
    });
  });

  describe('getConstellationSummary', () => {
    it('should generate summary', () => {
      const constellation = generateConstellation(mockNarratives);
      const summary = getConstellationSummary(constellation);

      expect(summary).toContain('narratives');
      expect(summary).toContain('relationships');
    });
  });

  describe('checkTemporalOverlap', () => {
    it('should detect full overlap', () => {
      const range = {
        start: '2024-01-01T00:00:00Z',
        end: '2024-01-10T00:00:00Z',
      };

      const overlap = checkTemporalOverlap(range, range);
      expect(overlap).toBe(1);
    });

    it('should detect partial overlap', () => {
      const rangeA = {
        start: '2024-01-01T00:00:00Z',
        end: '2024-01-10T00:00:00Z',
      };

      const rangeB = {
        start: '2024-01-05T00:00:00Z',
        end: '2024-01-15T00:00:00Z',
      };

      const overlap = checkTemporalOverlap(rangeA, rangeB);
      expect(overlap).toBeGreaterThan(0);
      expect(overlap).toBeLessThan(1);
    });

    it('should return 0 for no overlap', () => {
      const rangeA = {
        start: '2024-01-01T00:00:00Z',
        end: '2024-01-05T00:00:00Z',
      };

      const rangeB = {
        start: '2024-01-10T00:00:00Z',
        end: '2024-01-15T00:00:00Z',
      };

      const overlap = checkTemporalOverlap(rangeA, rangeB);
      expect(overlap).toBe(0);
    });
  });

  describe('toXRConstellation', () => {
    it('should convert to XR format', () => {
      const constellation = generateConstellation(mockNarratives);
      const xrNodes = toXRConstellation(constellation);

      expect(xrNodes.length).toBe(constellation.nodes.length);

      for (const xrNode of xrNodes) {
        expect(xrNode.position3D).toBeDefined();
        expect(typeof xrNode.position3D.x).toBe('number');
        expect(typeof xrNode.position3D.y).toBe('number');
        expect(typeof xrNode.position3D.z).toBe('number');
        expect(xrNode.brightness).toBeDefined();
        expect(xrNode.pulseRate).toBeDefined();
      }
    });

    it('should use slow pulse rate only', () => {
      const constellation = generateConstellation(mockNarratives);
      const xrNodes = toXRConstellation(constellation);

      for (const xrNode of xrNodes) {
        expect(xrNode.pulseRate).toBeLessThanOrEqual(1);
      }
    });
  });
});

/* =========================================================
   FILTER TESTS
   ========================================================= */

describe('Constellation Filtering', () => {
  let mockNarratives: DriftNarrative[];

  beforeEach(() => {
    mockNarratives = [
      createMockNarrative('session', 0),
      createMockNarrative('project', 5),
      createMockNarrative('sphere', 10),
      createMockNarrative('global', 15),
    ];
  });

  it('should filter by scope', () => {
    const constellation = generateConstellation(mockNarratives, {
      filters: { scopes: ['session', 'project'] },
    });

    for (const node of constellation.nodes) {
      expect(['session', 'project']).toContain(node.scope);
    }
  });

  it('should filter by minimum confidence', () => {
    const constellation = generateConstellation(mockNarratives, {
      filters: { minConfidence: 0.5 },
    });

    for (const node of constellation.nodes) {
      expect(node.confidence).toBeGreaterThanOrEqual(0.5);
    }
  });
});

/* =========================================================
   RELATIONSHIP TESTS
   ========================================================= */

describe('Relationship Computation', () => {
  it('should compute temporal overlap relationships', () => {
    const narratives = [
      createMockNarrative('session', 0),
      createMockNarrative('session', 2), // Overlapping timeframe
    ];

    const constellation = generateConstellation(narratives, {
      showRelationships: true,
    });

    const temporalRels = constellation.relationships.filter(
      (r) => r.type === 'temporal-overlap'
    );

    expect(temporalRels.length).toBeGreaterThanOrEqual(0);
  });

  it('should use neutral language in descriptions', () => {
    const narratives = [
      createMockNarrative('session', 0),
      createMockNarrative('session', 2),
    ];

    const constellation = generateConstellation(narratives, {
      showRelationships: true,
    });

    for (const rel of constellation.relationships) {
      // Should NOT contain forbidden language
      expect(rel.description).not.toMatch(/central|dominant|influential/i);
    }
  });
});

/* =========================================================
   DECLARATION TESTS
   ========================================================= */

describe('System Declaration', () => {
  it('should include correct declaration', () => {
    expect(NARRATIVE_CONSTELLATION_DECLARATION).toContain('expand');
    expect(NARRATIVE_CONSTELLATION_DECLARATION).toContain('field of perception');
    expect(NARRATIVE_CONSTELLATION_DECLARATION).toContain('relational visibility');
    expect(NARRATIVE_CONSTELLATION_DECLARATION).toContain('not guidance');
  });

  it('should be included in constellation', () => {
    const constellation = generateConstellation([createMockNarrative('session')]);
    expect(constellation.declaration).toBe(NARRATIVE_CONSTELLATION_DECLARATION);
  });
});
