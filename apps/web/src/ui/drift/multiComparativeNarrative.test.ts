/* =====================================================
   CHE·NU — MULTI-COMPARATIVE NARRATIVE TESTS
   ===================================================== */

import { describe, it, expect, beforeEach } from 'vitest';

import {
  generateMultiSphereNarrative,
  generateIndividualVsCollectiveNarrative,
  formatMultiSphereNarrative,
  formatIndividualVsCollectiveNarrative,
} from './comparativeNarrativeEngine';

import {
  validateComparativeLanguage,
  ALLOWED_COMPARATIVE_TERMS,
  FORBIDDEN_COMPARATIVE_TERMS,
  FORBIDDEN_MULTI_COMPARATIVE_TERMS,
  DEFAULT_NON_CONCLUSIONS,
  COMPARATIVE_NARRATIVE_DECLARATION,
  type ComparableSphere,
  type MultiSphereScope,
} from './comparativeNarrative.types';

/* =========================================================
   MULTI-SPHERE NARRATIVE TESTS
   ========================================================= */

describe('Multi-Sphere Comparative Narrative', () => {
  const testSpheres: MultiSphereScope[] = [
    {
      sphere: 'creative',
      timeRange: {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        end: new Date().toISOString(),
      },
    },
    {
      sphere: 'business',
      timeRange: {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        end: new Date().toISOString(),
      },
    },
    {
      sphere: 'personal',
      timeRange: {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        end: new Date().toISOString(),
      },
    },
  ];

  describe('generateMultiSphereNarrative', () => {
    it('should generate narrative for multiple spheres', () => {
      const narrative = generateMultiSphereNarrative(testSpheres, 'concurrent');

      expect(narrative).toBeDefined();
      expect(narrative.family).toBe('multi-sphere');
      expect(narrative.spheres.length).toBe(3);
    });

    it('should include temporal relationship', () => {
      const narrative = generateMultiSphereNarrative(testSpheres, 'staggered');

      expect(narrative.temporalRelationship).toBe('staggered');
    });

    it('should have shared and divergent patterns', () => {
      const narrative = generateMultiSphereNarrative(testSpheres, 'concurrent');

      expect(narrative.sharedPatterns).toBeDefined();
      expect(Array.isArray(narrative.sharedPatterns)).toBe(true);

      expect(narrative.divergentPatterns).toBeDefined();
      expect(Array.isArray(narrative.divergentPatterns)).toBe(true);
    });

    it('should include interpretation boundary', () => {
      const narrative = generateMultiSphereNarrative(testSpheres, 'concurrent');

      expect(narrative.interpretationBoundary).toBeDefined();
      expect(narrative.interpretationBoundary).toContain('causality');
      expect(narrative.interpretationBoundary).toContain('intent');
    });

    it('should include summary', () => {
      const narrative = generateMultiSphereNarrative(testSpheres, 'concurrent');

      expect(narrative.summary).toBeDefined();
      expect(narrative.summary.length).toBeGreaterThan(0);
    });

    it('should use neutral language in summary', () => {
      const narrative = generateMultiSphereNarrative(testSpheres, 'concurrent');

      const validation = validateComparativeLanguage(narrative.summary);

      // Summary should not contain forbidden terms
      expect(validation.forbiddenFound.length).toBe(0);
    });
  });

  describe('formatMultiSphereNarrative', () => {
    it('should format narrative for display', () => {
      const narrative = generateMultiSphereNarrative(testSpheres, 'concurrent');
      const formatted = formatMultiSphereNarrative(narrative);

      expect(formatted).toContain('MULTI-SPHERE');
      expect(formatted).toContain('OBSERVATIONAL');
      expect(formatted).toContain('Authority: NONE');
      expect(formatted).toContain('COMPARED SPHERES');
      expect(formatted).toContain('SHARED OBSERVATIONS');
      expect(formatted).toContain('DIVERGENT OBSERVATIONS');
      expect(formatted).toContain('INTERPRETATION BOUNDARY');
    });
  });
});

/* =========================================================
   INDIVIDUAL VS COLLECTIVE NARRATIVE TESTS
   ========================================================= */

describe('Individual vs Collective Comparative Narrative', () => {
  const testTimeRange = {
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    end: new Date().toISOString(),
  };

  describe('generateIndividualVsCollectiveNarrative', () => {
    it('should generate narrative', () => {
      const narrative = generateIndividualVsCollectiveNarrative(testTimeRange);

      expect(narrative).toBeDefined();
      expect(narrative.family).toBe('individual-vs-collective');
    });

    it('should include individual scope', () => {
      const narrative = generateIndividualVsCollectiveNarrative(testTimeRange);

      expect(narrative.individual).toBeDefined();
      expect(narrative.individual.timeRange).toBeDefined();
      expect(narrative.individual.patterns).toBeDefined();
      expect(narrative.individual.summary).toBeDefined();
    });

    it('should include collective scope', () => {
      const narrative = generateIndividualVsCollectiveNarrative(testTimeRange);

      expect(narrative.collective).toBeDefined();
      expect(narrative.collective.aggregationLevel).toBeDefined();
      expect(narrative.collective.participantCount).toBeGreaterThanOrEqual(0);
      expect(narrative.collective.densityPatterns).toBeDefined();
      expect(narrative.collective.privacyGuarantee).toBeDefined();
    });

    it('should include convergence areas', () => {
      const narrative = generateIndividualVsCollectiveNarrative(testTimeRange);

      expect(narrative.convergence).toBeDefined();
      expect(narrative.convergence.patterns).toBeDefined();
      expect(narrative.convergence.description).toBeDefined();
    });

    it('should include divergence areas', () => {
      const narrative = generateIndividualVsCollectiveNarrative(testTimeRange);

      expect(narrative.divergence).toBeDefined();
      expect(narrative.divergence.individualOnly).toBeDefined();
      expect(narrative.divergence.collectiveOnly).toBeDefined();
      expect(narrative.divergence.description).toBeDefined();
    });

    it('should include non-conclusions', () => {
      const narrative = generateIndividualVsCollectiveNarrative(testTimeRange);

      expect(narrative.nonConclusions).toBeDefined();
      expect(narrative.nonConclusions.statements.length).toBeGreaterThan(0);
      expect(narrative.nonConclusions.declaration).toBeDefined();
    });

    it('should use neutral language', () => {
      const narrative = generateIndividualVsCollectiveNarrative(testTimeRange);

      const validation = validateComparativeLanguage(narrative.summary);
      expect(validation.forbiddenFound.length).toBe(0);
    });
  });

  describe('formatIndividualVsCollectiveNarrative', () => {
    it('should format narrative for display', () => {
      const narrative = generateIndividualVsCollectiveNarrative(testTimeRange);
      const formatted = formatIndividualVsCollectiveNarrative(narrative);

      expect(formatted).toContain('INDIVIDUAL VS COLLECTIVE');
      expect(formatted).toContain('OBSERVATIONAL');
      expect(formatted).toContain('INDIVIDUAL SCOPE');
      expect(formatted).toContain('COLLECTIVE SCOPE');
      expect(formatted).toContain('AREAS OF CONVERGENCE');
      expect(formatted).toContain('AREAS OF DIVERGENCE');
      expect(formatted).toContain('NON-CONCLUSIONS');
    });
  });
});

/* =========================================================
   LANGUAGE VALIDATION TESTS
   ========================================================= */

describe('Comparative Language Validation', () => {
  it('should validate allowed terms', () => {
    const text = 'Patterns co-occurred alongside each other concurrently';
    const result = validateComparativeLanguage(text);

    expect(result.valid).toBe(true);
    expect(result.forbiddenFound.length).toBe(0);
  });

  it('should detect forbidden terms', () => {
    const text = 'Pattern A is better than Pattern B';
    const result = validateComparativeLanguage(text);

    expect(result.valid).toBe(false);
    expect(result.forbiddenFound).toContain('better');
  });

  it('should detect multiple forbidden terms', () => {
    const text = 'This is above average and normal, therefore correct';
    const result = validateComparativeLanguage(text);

    expect(result.valid).toBe(false);
    expect(result.forbiddenFound.length).toBeGreaterThan(1);
  });

  it('should allow neutral comparative language', () => {
    const neutralText = `
      During the same period, exploration contexts diverged in frequency.
      Patterns were observed in both spheres independently.
      These observations describe coexistence only.
    `;

    const result = validateComparativeLanguage(neutralText);
    expect(result.valid).toBe(true);
  });
});

/* =========================================================
   NON-CONCLUSIONS TESTS
   ========================================================= */

describe('Non-Conclusions', () => {
  it('should have default non-conclusions', () => {
    expect(DEFAULT_NON_CONCLUSIONS).toBeDefined();
    expect(DEFAULT_NON_CONCLUSIONS.statements.length).toBeGreaterThan(0);
    expect(DEFAULT_NON_CONCLUSIONS.declaration).toBeDefined();
  });

  it('should include key statements', () => {
    const statements = DEFAULT_NON_CONCLUSIONS.statements.join(' ');

    expect(statements).toContain('normative');
    expect(statements).toContain('correctness');
    expect(statements).toContain('error');
    expect(statements).toContain('prescribe');
    expect(statements).toContain('perspective');
  });

  it('should have philosophical declaration', () => {
    expect(DEFAULT_NON_CONCLUSIONS.declaration).toContain('perceived');
  });
});

/* =========================================================
   DECLARATION TESTS
   ========================================================= */

describe('System Declaration', () => {
  it('should have comparative narrative declaration', () => {
    expect(COMPARATIVE_NARRATIVE_DECLARATION).toBeDefined();
    expect(COMPARATIVE_NARRATIVE_DECLARATION).toContain('perspective');
    expect(COMPARATIVE_NARRATIVE_DECLARATION).toContain('authority');
    expect(COMPARATIVE_NARRATIVE_DECLARATION).toContain('correctness');
    expect(COMPARATIVE_NARRATIVE_DECLARATION).toContain('perceived');
  });
});

/* =========================================================
   CONSTANTS TESTS
   ========================================================= */

describe('Language Constants', () => {
  it('should have allowed terms', () => {
    expect(ALLOWED_COMPARATIVE_TERMS.length).toBeGreaterThan(0);
    expect(ALLOWED_COMPARATIVE_TERMS).toContain('similarly');
    expect(ALLOWED_COMPARATIVE_TERMS).toContain('concurrently');
  });

  it('should have forbidden terms', () => {
    expect(FORBIDDEN_COMPARATIVE_TERMS.length).toBeGreaterThan(0);
    expect(FORBIDDEN_COMPARATIVE_TERMS).toContain('better');
    expect(FORBIDDEN_COMPARATIVE_TERMS).toContain('worse');
    expect(FORBIDDEN_COMPARATIVE_TERMS).toContain('correct');
  });

  it('should have extended forbidden terms', () => {
    expect(FORBIDDEN_MULTI_COMPARATIVE_TERMS.length).toBeGreaterThan(
      FORBIDDEN_COMPARATIVE_TERMS.length
    );
    expect(FORBIDDEN_MULTI_COMPARATIVE_TERMS).toContain('above average');
    expect(FORBIDDEN_MULTI_COMPARATIVE_TERMS).toContain('normal');
    expect(FORBIDDEN_MULTI_COMPARATIVE_TERMS).toContain('optimal');
  });
});
