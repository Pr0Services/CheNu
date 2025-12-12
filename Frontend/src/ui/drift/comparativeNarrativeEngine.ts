/* =====================================================
   CHE·NU — COMPARATIVE DRIFT NARRATIVE ENGINE
   Status: OBSERVATIONAL COMPARISON
   Authority: NONE
   Intent: DESCRIPTIVE CLARITY ONLY
   
   📜 PURPOSE:
   Generate comparative narratives between drift sources.
   
   📜 RULES:
   - Compare ONLY from validated narratives
   - Identical data schemas required
   - Comparable time windows required
   - No normalization to hide differences
   - No scoring
   - No ranking
   ===================================================== */

import {
  type ComparativeDriftNarrative,
  type DriftNarrativeSource,
  type ComparisonAxisDefinition,
  type SharedObservation,
  type DivergentObservation,
  type TemporalAlignment,
  type InterpretationBoundary,
  DEFAULT_INTERPRETATION_BOUNDARIES,
  validateComparativeLanguage,
  COMPARATIVE_NARRATIVE_DECLARATION,
} from './comparativeNarrative.types';
import type { DriftTimeline, DriftTimelinePoint, ScopeLevel } from './driftVisualization.types';
import { driftDetector } from '../../core/agents/preferenceDriftDetector';

/* =========================================================
   VALIDATION
   ========================================================= */

/**
 * Validate that two sources are comparable.
 */
export function validateSourcesComparable(
  sourceA: DriftNarrativeSource,
  sourceB: DriftNarrativeSource
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check validation status
  if (!sourceA.validated) {
    errors.push('Source A is not validated');
  }
  if (!sourceB.validated) {
    errors.push('Source B is not validated');
  }

  // Check schema version
  if (sourceA.schemaVersion !== sourceB.schemaVersion) {
    errors.push(`Schema version mismatch: ${sourceA.schemaVersion} vs ${sourceB.schemaVersion}`);
  }

  // Check time window overlap or comparability
  const aStart = new Date(sourceA.timeRange.start).getTime();
  const aEnd = new Date(sourceA.timeRange.end).getTime();
  const bStart = new Date(sourceB.timeRange.start).getTime();
  const bEnd = new Date(sourceB.timeRange.end).getTime();

  const aDuration = aEnd - aStart;
  const bDuration = bEnd - bStart;

  // Allow up to 50% duration difference
  const durationRatio = Math.min(aDuration, bDuration) / Math.max(aDuration, bDuration);
  if (durationRatio < 0.5) {
    errors.push('Time windows are not comparable (duration difference > 50%)');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/* =========================================================
   PATTERN EXTRACTION
   ========================================================= */

/**
 * Extract patterns from a timeline.
 */
function extractPatterns(timeline: DriftTimeline): Map<string, {
  key: string;
  directions: string[];
  magnitudes: string[];
  count: number;
  avgConfidence: number;
}> {
  const patterns = new Map<string, {
    key: string;
    directions: string[];
    magnitudes: string[];
    count: number;
    avgConfidence: number;
  }>();

  for (const segment of timeline.segments) {
    for (const point of segment.points) {
      const existing = patterns.get(point.preferenceKey);
      if (existing) {
        existing.directions.push(point.direction);
        existing.magnitudes.push(point.driftMagnitude);
        existing.count++;
        existing.avgConfidence = (existing.avgConfidence * (existing.count - 1) + point.confidence) / existing.count;
      } else {
        patterns.set(point.preferenceKey, {
          key: point.preferenceKey,
          directions: [point.direction],
          magnitudes: [point.driftMagnitude],
          count: 1,
          avgConfidence: point.confidence,
        });
      }
    }
  }

  return patterns;
}

/**
 * Generate neutral pattern description.
 */
function describePattern(pattern: {
  key: string;
  directions: string[];
  magnitudes: string[];
  count: number;
}): string {
  const primaryDirection = pattern.directions[0] || 'stable';
  const primaryMagnitude = pattern.magnitudes[0] || 'low';

  return `${pattern.key}: ${primaryDirection} (${primaryMagnitude} magnitude, ${pattern.count} observation${pattern.count > 1 ? 's' : ''})`;
}

/* =========================================================
   OBSERVATION DETECTION
   ========================================================= */

/**
 * Find shared observations between two pattern sets.
 */
function findSharedObservations(
  patternsA: Map<string, any>,
  patternsB: Map<string, any>
): SharedObservation[] {
  const shared: SharedObservation[] = [];
  let id = 0;

  for (const [key, patternA] of patternsA) {
    const patternB = patternsB.get(key);
    if (!patternB) continue;

    // Check for similar directions
    const sharedDirections = patternA.directions.filter(
      (d: string) => patternB.directions.includes(d)
    );

    if (sharedDirections.length > 0) {
      shared.push({
        id: `shared-${id++}`,
        pattern: `Both narratives showed ${sharedDirections[0]} in ${key}`,
        confidence: (patternA.avgConfidence + patternB.avgConfidence) / 2,
        preferenceKeys: [key],
      });
    }
  }

  return shared;
}

/**
 * Find divergent observations between two pattern sets.
 */
function findDivergentObservations(
  patternsA: Map<string, any>,
  patternsB: Map<string, any>
): DivergentObservation[] {
  const divergent: DivergentObservation[] = [];
  let id = 0;

  // Patterns only in A
  for (const [key, patternA] of patternsA) {
    if (!patternsB.has(key)) {
      divergent.push({
        id: `div-${id++}`,
        presentIn: 'A',
        pattern: `${key} showed ${patternA.directions[0] || 'variation'}`,
        confidence: patternA.avgConfidence,
        preferenceKeys: [key],
      });
    }
  }

  // Patterns only in B
  for (const [key, patternB] of patternsB) {
    if (!patternsA.has(key)) {
      divergent.push({
        id: `div-${id++}`,
        presentIn: 'B',
        pattern: `${key} showed ${patternB.directions[0] || 'variation'}`,
        confidence: patternB.avgConfidence,
        preferenceKeys: [key],
      });
    }
  }

  // Different directions in same key
  for (const [key, patternA] of patternsA) {
    const patternB = patternsB.get(key);
    if (!patternB) continue;

    const aDirection = patternA.directions[0];
    const bDirection = patternB.directions[0];

    if (aDirection && bDirection && aDirection !== bDirection) {
      divergent.push({
        id: `div-${id++}`,
        presentIn: 'A',
        pattern: `${key} showed ${aDirection} in A, while ${bDirection} in B`,
        confidence: Math.min(patternA.avgConfidence, patternB.avgConfidence),
        preferenceKeys: [key],
        notes: 'Direction divergence',
      });
    }
  }

  return divergent;
}

/**
 * Analyze temporal alignment.
 */
function analyzeTemporalAlignment(
  sourceA: DriftNarrativeSource,
  sourceB: DriftNarrativeSource
): TemporalAlignment {
  const aStart = new Date(sourceA.timeRange.start).getTime();
  const aEnd = new Date(sourceA.timeRange.end).getTime();
  const bStart = new Date(sourceB.timeRange.start).getTime();
  const bEnd = new Date(sourceB.timeRange.end).getTime();

  // Check if windows overlap significantly
  const overlapStart = Math.max(aStart, bStart);
  const overlapEnd = Math.min(aEnd, bEnd);
  const overlap = overlapEnd - overlapStart;

  const aDuration = aEnd - aStart;
  const bDuration = bEnd - bStart;
  const overlapRatio = overlap / Math.min(aDuration, bDuration);

  if (overlapRatio > 0.8) {
    return {
      type: 'simultaneous',
      description: 'Both narratives cover substantially the same time period',
    };
  } else if (overlapRatio > 0.2) {
    const firstOccurrence = aStart < bStart ? 'A' : 'B';
    const offsetDays = Math.abs(aStart - bStart) / (24 * 60 * 60 * 1000);

    return {
      type: 'sequential',
      description: `Narrative ${firstOccurrence} began earlier with ${Math.round(offsetDays)} days offset`,
      offsetDays: Math.round(offsetDays),
      firstOccurrence,
    };
  } else {
    return {
      type: 'independent',
      description: 'Narratives cover largely independent time periods',
    };
  }
}

/**
 * Generate narrative summary (neutral language).
 */
function generateNarrativeSummary(
  sourceA: DriftNarrativeSource,
  sourceB: DriftNarrativeSource,
  shared: SharedObservation[],
  divergent: DivergentObservation[],
  temporal: TemporalAlignment
): string {
  const parts: string[] = [];

  // Temporal context
  if (temporal.type === 'simultaneous') {
    parts.push('During the same period,');
  } else if (temporal.type === 'sequential') {
    parts.push(`With ${temporal.firstOccurrence === 'A' ? sourceA.label : sourceB.label} beginning earlier,`);
  } else {
    parts.push('Across different time periods,');
  }

  // Shared observations
  if (shared.length > 0) {
    const sharedPatterns = shared.slice(0, 2).map(s => s.pattern.toLowerCase()).join(' and ');
    parts.push(`both contexts showed similar patterns: ${sharedPatterns}.`);
  } else {
    parts.push('the two contexts showed distinct patterns with limited overlap.');
  }

  // Divergent observations
  if (divergent.length > 0) {
    const aOnly = divergent.filter(d => d.presentIn === 'A');
    const bOnly = divergent.filter(d => d.presentIn === 'B');

    if (aOnly.length > 0 && bOnly.length > 0) {
      parts.push(`However, ${sourceA.label} showed unique variation in ${aOnly.length} area${aOnly.length > 1 ? 's' : ''}, while ${sourceB.label} showed unique variation in ${bOnly.length} area${bOnly.length > 1 ? 's' : ''}.`);
    } else if (aOnly.length > 0) {
      parts.push(`${sourceA.label} showed additional variation not observed in ${sourceB.label}.`);
    } else if (bOnly.length > 0) {
      parts.push(`${sourceB.label} showed additional variation not observed in ${sourceA.label}.`);
    }
  }

  // Boundary statement
  parts.push('\n\nNo causal relationship can be inferred. These observations describe coexistence only.');

  return parts.join(' ');
}

/* =========================================================
   COMPARATIVE NARRATIVE ENGINE
   ========================================================= */

/**
 * Generate a comparative drift narrative.
 */
export function generateComparativeNarrative(
  sourceA: DriftNarrativeSource,
  sourceB: DriftNarrativeSource,
  axis: ComparisonAxisDefinition
): ComparativeDriftNarrative {
  // Validate sources
  const validation = validateSourcesComparable(sourceA, sourceB);
  if (!validation.valid) {
    throw new Error(`Sources not comparable: ${validation.errors.join(', ')}`);
  }

  // Extract patterns
  const patternsA = extractPatterns(sourceA.timeline);
  const patternsB = extractPatterns(sourceB.timeline);

  // Find observations
  const sharedObservations = findSharedObservations(patternsA, patternsB);
  const divergentObservations = findDivergentObservations(patternsA, patternsB);

  // Analyze temporal alignment
  const temporalAlignment = analyzeTemporalAlignment(sourceA, sourceB);

  // Generate summary
  const narrativeSummary = generateNarrativeSummary(
    sourceA,
    sourceB,
    sharedObservations,
    divergentObservations,
    temporalAlignment
  );

  // Validate language
  const languageValidation = validateComparativeLanguage(narrativeSummary);
  if (!languageValidation.valid) {
    console.warn('Narrative contains forbidden terms:', languageValidation.forbiddenFound);
  }

  return {
    id: `comparative-${Date.now()}`,
    definition: {
      narrativeA: sourceA,
      narrativeB: sourceB,
      axis,
    },
    sharedObservations,
    divergentObservations,
    temporalAlignment,
    interpretationBoundaries: [...DEFAULT_INTERPRETATION_BOUNDARIES],
    generatedAt: new Date().toISOString(),
    narrativeSummary,
  };
}

/* =========================================================
   CONVENIENCE FUNCTIONS
   ========================================================= */

/**
 * Create a narrative source from drift detector.
 */
export function createNarrativeSourceFromDetector(
  label: string,
  scope?: ScopeLevel,
  scopeId?: string,
  days: number = 30
): DriftNarrativeSource {
  const result = driftDetector.analyze({ scope });

  const now = new Date();
  const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  // Build timeline from reports
  const points: DriftTimelinePoint[] = result.reports
    .filter(r => r.driftDetected)
    .map((report, index) => ({
      id: `point-${index}`,
      timestamp: report.reportedAt,
      preferenceId: report.preferenceId,
      preferenceKey: report.preferenceKey,
      scope: report.scope as ScopeLevel,
      driftMagnitude: report.magnitude === 'high' ? 'high' :
        report.magnitude === 'medium' ? 'medium' :
        report.magnitude === 'low' ? 'low' : 'none',
      direction: report.direction,
      confidence: report.confidence,
      historicalPattern: report.historicalPattern,
      recentPattern: report.recentPattern,
    }));

  const timeline: DriftTimeline = {
    id: `timeline-${Date.now()}`,
    scope,
    scopeId,
    segments: [{
      id: 'segment-main',
      startTime: startDate.toISOString(),
      endTime: now.toISOString(),
      points,
      granularity: 'day',
    }],
    totalPoints: points.length,
    timeRange: {
      start: startDate.toISOString(),
      end: now.toISOString(),
    },
    generatedAt: now.toISOString(),
  };

  return {
    id: `source-${Date.now()}`,
    label,
    scope: scope || 'global',
    scopeId,
    timeRange: {
      start: startDate.toISOString(),
      end: now.toISOString(),
    },
    timeline,
    validated: true,
    schemaVersion: '1.0.0',
  };
}

/**
 * Compare two scopes.
 */
export function compareScopeDrift(
  scopeALabel: string,
  scopeA: ScopeLevel,
  scopeBLabel: string,
  scopeB: ScopeLevel,
  days: number = 30
): ComparativeDriftNarrative {
  const sourceA = createNarrativeSourceFromDetector(scopeALabel, scopeA, undefined, days);
  const sourceB = createNarrativeSourceFromDetector(scopeBLabel, scopeB, undefined, days);

  return generateComparativeNarrative(sourceA, sourceB, {
    type: 'scope',
    axisALabel: scopeALabel,
    axisBLabel: scopeBLabel,
  });
}

/**
 * Compare two time periods.
 */
export function compareTimePeriodDrift(
  label: string,
  periodADaysAgo: number,
  periodADays: number,
  periodBDaysAgo: number,
  periodBDays: number,
  scope?: ScopeLevel
): ComparativeDriftNarrative {
  // This would need historical data access
  // For now, create sources with simulated historical data
  const now = new Date();

  const sourceA = createNarrativeSourceFromDetector(
    `${label} (${periodADaysAgo}-${periodADaysAgo - periodADays} days ago)`,
    scope,
    undefined,
    periodADays
  );

  const sourceB = createNarrativeSourceFromDetector(
    `${label} (${periodBDaysAgo}-${periodBDaysAgo - periodBDays} days ago)`,
    scope,
    undefined,
    periodBDays
  );

  return generateComparativeNarrative(sourceA, sourceB, {
    type: 'time',
    axisALabel: `Period A (${periodADays} days)`,
    axisBLabel: `Period B (${periodBDays} days)`,
  });
}

/* =========================================================
   FORMATTER
   ========================================================= */

/**
 * Format comparative narrative for display.
 */
export function formatComparativeNarrative(narrative: ComparativeDriftNarrative): string {
  const lines: string[] = [];

  lines.push('═'.repeat(60));
  lines.push('COMPARATIVE DRIFT NARRATIVE');
  lines.push('Status: OBSERVATIONAL COMPARISON | Authority: NONE');
  lines.push('═'.repeat(60));
  lines.push('');

  // Definition
  lines.push('COMPARISON DEFINITION');
  lines.push('-'.repeat(40));
  lines.push(`Narrative A: ${narrative.definition.narrativeA.label}`);
  lines.push(`  Scope: ${narrative.definition.narrativeA.scope}`);
  lines.push(`  Period: ${new Date(narrative.definition.narrativeA.timeRange.start).toLocaleDateString()} - ${new Date(narrative.definition.narrativeA.timeRange.end).toLocaleDateString()}`);
  lines.push('');
  lines.push(`Narrative B: ${narrative.definition.narrativeB.label}`);
  lines.push(`  Scope: ${narrative.definition.narrativeB.scope}`);
  lines.push(`  Period: ${new Date(narrative.definition.narrativeB.timeRange.start).toLocaleDateString()} - ${new Date(narrative.definition.narrativeB.timeRange.end).toLocaleDateString()}`);
  lines.push('');
  lines.push(`Comparison Axis: ${narrative.definition.axis.type}`);
  lines.push('');

  // Shared Observations
  lines.push('SHARED OBSERVATIONS');
  lines.push('-'.repeat(40));
  if (narrative.sharedObservations.length === 0) {
    lines.push('No shared patterns identified.');
  } else {
    for (const obs of narrative.sharedObservations) {
      lines.push(`• ${obs.pattern}`);
      lines.push(`  Confidence: ${(obs.confidence * 100).toFixed(0)}%`);
    }
  }
  lines.push('');

  // Divergent Observations
  lines.push('DIVERGENT OBSERVATIONS');
  lines.push('-'.repeat(40));
  if (narrative.divergentObservations.length === 0) {
    lines.push('No divergent patterns identified.');
  } else {
    for (const obs of narrative.divergentObservations) {
      lines.push(`• [${obs.presentIn}] ${obs.pattern}`);
      lines.push(`  Confidence: ${(obs.confidence * 100).toFixed(0)}%`);
    }
  }
  lines.push('');

  // Temporal Alignment
  lines.push('TEMPORAL ALIGNMENT');
  lines.push('-'.repeat(40));
  lines.push(`Type: ${narrative.temporalAlignment.type}`);
  lines.push(`${narrative.temporalAlignment.description}`);
  lines.push('');

  // Narrative Summary
  lines.push('NARRATIVE SUMMARY');
  lines.push('-'.repeat(40));
  lines.push(narrative.narrativeSummary);
  lines.push('');

  // Interpretation Boundaries
  lines.push('INTERPRETATION BOUNDARIES');
  lines.push('-'.repeat(40));
  for (const boundary of narrative.interpretationBoundaries) {
    lines.push(`✗ Cannot conclude: ${boundary.cannotConclude}`);
    lines.push(`  Reason: ${boundary.reason}`);
  }
  lines.push('');

  // Footer
  lines.push('═'.repeat(60));
  lines.push(COMPARATIVE_NARRATIVE_DECLARATION);
  lines.push('═'.repeat(60));
  lines.push(`Generated: ${new Date(narrative.generatedAt).toLocaleString()}`);

  return lines.join('\n');
}

/* =========================================================
   EXPORTS
   ========================================================= */

export default {
  generateComparativeNarrative,
  createNarrativeSourceFromDetector,
  compareScopeDrift,
  compareTimePeriodDrift,
  formatComparativeNarrative,
  validateSourcesComparable,
  generateMultiSphereNarrative,
  generateIndividualVsCollectiveNarrative,
  formatMultiSphereNarrative,
  formatIndividualVsCollectiveNarrative,
};

/* =========================================================
   MULTI-SPHERE COMPARATIVE NARRATIVE
   ========================================================= */

import {
  type MultiSphereComparativeNarrative,
  type MultiSphereScope,
  type MultiSpherePattern,
  type TemporalRelationship,
  type ComparableSphere,
  type IndividualVsCollectiveNarrative,
  type IndividualDriftScope,
  type CollectiveDriftScope,
  type AggregationLevel,
  DEFAULT_NON_CONCLUSIONS,
} from './comparativeNarrative.types';
import { collectiveDriftOverlay } from '../../core/agents/collectiveDriftOverlay';
import { contextDriftDetector } from '../../core/agents/contextDriftDetector';

/**
 * Generate multi-sphere comparative narrative.
 */
export function generateMultiSphereNarrative(
  spheres: MultiSphereScope[],
  temporalRelationship: TemporalRelationship = 'concurrent'
): MultiSphereComparativeNarrative {
  // Extract patterns per sphere (simulated)
  const spherePatterns = new Map<ComparableSphere, MultiSpherePattern[]>();
  
  for (const scope of spheres) {
    const patterns: MultiSpherePattern[] = [];
    
    // Get context drift for this sphere
    contextDriftDetector.addSimulatedData(50, 30);
    const driftResult = contextDriftDetector.analyze({
      sphereId: scope.sphere,
    });
    
    for (const report of driftResult.reports) {
      if (report.driftDetected) {
        patterns.push({
          id: `pattern-${scope.sphere}-${report.contextType}`,
          description: `${report.contextType} context usage ${report.direction}`,
          magnitude: report.magnitude,
          contextTypes: [report.contextType],
          presentIn: [scope.sphere],
          absentFrom: [],
        });
      }
    }
    
    spherePatterns.set(scope.sphere, patterns);
  }
  
  // Find shared patterns (present in all spheres)
  const allSphereNames = spheres.map(s => s.sphere);
  const sharedPatterns: MultiSpherePattern[] = [];
  const divergentBySpere: { sphere: ComparableSphere; patterns: MultiSpherePattern[]; summary: string }[] = [];
  
  // Context types seen across all spheres
  const contextTypeCounts = new Map<string, Set<ComparableSphere>>();
  
  for (const [sphere, patterns] of spherePatterns) {
    for (const pattern of patterns) {
      for (const ctx of pattern.contextTypes) {
        if (!contextTypeCounts.has(ctx)) {
          contextTypeCounts.set(ctx, new Set());
        }
        contextTypeCounts.get(ctx)!.add(sphere);
      }
    }
  }
  
  // Shared = present in ALL spheres
  for (const [ctx, sphereSet] of contextTypeCounts) {
    if (sphereSet.size === spheres.length) {
      sharedPatterns.push({
        id: `shared-${ctx}`,
        description: `${ctx} context variation observed across all compared spheres`,
        magnitude: 'medium',
        contextTypes: [ctx],
        presentIn: allSphereNames,
        absentFrom: [],
      });
    }
  }
  
  // Divergent = unique to specific spheres
  for (const scope of spheres) {
    const uniquePatterns: MultiSpherePattern[] = [];
    const patterns = spherePatterns.get(scope.sphere) || [];
    
    for (const pattern of patterns) {
      for (const ctx of pattern.contextTypes) {
        const sphereSet = contextTypeCounts.get(ctx);
        if (sphereSet && sphereSet.size === 1 && sphereSet.has(scope.sphere)) {
          uniquePatterns.push({
            ...pattern,
            description: `${ctx} context variation unique to ${scope.sphere}`,
            presentIn: [scope.sphere],
            absentFrom: allSphereNames.filter(s => s !== scope.sphere),
          });
        }
      }
    }
    
    divergentBySpere.push({
      sphere: scope.sphere,
      patterns: uniquePatterns,
      summary: uniquePatterns.length > 0
        ? `${scope.sphere} showed ${uniquePatterns.length} unique pattern(s)`
        : `No unique patterns observed in ${scope.sphere}`,
    });
  }
  
  // Generate interpretation boundary
  const interpretationBoundary = `
No inference is made regarding causality or intent.
These observations describe coexistence across ${spheres.length} spheres only.
Sphere comparison does not imply superiority or correctness.
`.trim();
  
  // Generate summary
  const summary = generateMultiSphereSummary(spheres, sharedPatterns, divergentBySpere);
  
  return {
    id: `multi-sphere-${Date.now()}`,
    family: 'multi-sphere',
    spheres,
    temporalRelationship,
    sharedPatterns,
    divergentPatterns: divergentBySpere,
    interpretationBoundary,
    generatedAt: new Date().toISOString(),
    summary,
  };
}

/**
 * Generate multi-sphere summary (neutral language).
 */
function generateMultiSphereSummary(
  spheres: MultiSphereScope[],
  shared: MultiSpherePattern[],
  divergent: { sphere: ComparableSphere; patterns: MultiSpherePattern[] }[]
): string {
  const lines: string[] = [];
  
  lines.push(`During the compared period across ${spheres.map(s => s.sphere).join(', ')} spheres:`);
  lines.push('');
  
  if (shared.length > 0) {
    lines.push(`Shared observations: ${shared.length} pattern(s) appeared in all spheres.`);
    for (const p of shared.slice(0, 3)) {
      lines.push(`  • ${p.description}`);
    }
  } else {
    lines.push('No patterns appeared consistently across all spheres.');
  }
  
  lines.push('');
  
  const spheresWithUnique = divergent.filter(d => d.patterns.length > 0);
  if (spheresWithUnique.length > 0) {
    lines.push(`Divergent observations: ${spheresWithUnique.length} sphere(s) showed unique patterns.`);
    for (const d of spheresWithUnique) {
      lines.push(`  • ${d.sphere}: ${d.patterns.length} unique pattern(s)`);
    }
  } else {
    lines.push('No sphere showed uniquely divergent patterns.');
  }
  
  lines.push('');
  lines.push('No inference is made regarding causality or intent.');
  
  return lines.join('\n');
}

/**
 * Format multi-sphere narrative for display.
 */
export function formatMultiSphereNarrative(narrative: MultiSphereComparativeNarrative): string {
  const lines: string[] = [];
  
  lines.push('═'.repeat(60));
  lines.push('MULTI-SPHERE COMPARATIVE NARRATIVE');
  lines.push('Status: OBSERVATIONAL | Authority: NONE');
  lines.push('═'.repeat(60));
  lines.push('');
  
  // Spheres
  lines.push('COMPARED SPHERES');
  lines.push('-'.repeat(40));
  for (const scope of narrative.spheres) {
    lines.push(`• ${scope.sphere}`);
    lines.push(`  Period: ${new Date(scope.timeRange.start).toLocaleDateString()} - ${new Date(scope.timeRange.end).toLocaleDateString()}`);
  }
  lines.push('');
  lines.push(`Temporal Relationship: ${narrative.temporalRelationship}`);
  lines.push('');
  
  // Shared
  lines.push('SHARED OBSERVATIONS (Present in All)');
  lines.push('-'.repeat(40));
  if (narrative.sharedPatterns.length === 0) {
    lines.push('No patterns appeared in all spheres.');
  } else {
    for (const p of narrative.sharedPatterns) {
      lines.push(`• ${p.description} (${p.magnitude})`);
    }
  }
  lines.push('');
  
  // Divergent
  lines.push('DIVERGENT OBSERVATIONS (Unique to Sphere)');
  lines.push('-'.repeat(40));
  for (const d of narrative.divergentPatterns) {
    lines.push(`[${d.sphere.toUpperCase()}]`);
    if (d.patterns.length === 0) {
      lines.push('  No unique patterns.');
    } else {
      for (const p of d.patterns) {
        lines.push(`  • ${p.description}`);
      }
    }
  }
  lines.push('');
  
  // Summary
  lines.push('SUMMARY');
  lines.push('-'.repeat(40));
  lines.push(narrative.summary);
  lines.push('');
  
  // Interpretation Boundary
  lines.push('INTERPRETATION BOUNDARY');
  lines.push('-'.repeat(40));
  lines.push(narrative.interpretationBoundary);
  lines.push('');
  
  // Footer
  lines.push('═'.repeat(60));
  lines.push(COMPARATIVE_NARRATIVE_DECLARATION);
  lines.push('═'.repeat(60));
  
  return lines.join('\n');
}

/* =========================================================
   INDIVIDUAL VS COLLECTIVE NARRATIVE
   ========================================================= */

/**
 * Generate individual vs collective comparative narrative.
 */
export function generateIndividualVsCollectiveNarrative(
  individualTimeRange: { start: string; end: string },
  aggregationLevel: AggregationLevel = 'system-wide'
): IndividualVsCollectiveNarrative {
  // Get individual drift data
  contextDriftDetector.addSimulatedData(50, 30);
  const individualResult = contextDriftDetector.analyze();
  
  // Get collective drift data
  collectiveDriftOverlay.addSimulatedData(50);
  const collectiveOverlay = collectiveDriftOverlay.generateOverlay();
  
  // Build individual scope
  const individualPatterns = individualResult.reports
    .filter(r => r.driftDetected)
    .map((r, i) => ({
      id: `ind-${i}`,
      description: `${r.contextType} context ${r.direction}`,
      contextType: r.contextType,
      magnitude: r.magnitude,
    }));
  
  const individual: IndividualDriftScope = {
    timeRange: individualTimeRange,
    scopeDescription: 'Individual drift patterns observed during the period',
    patterns: individualPatterns,
    summary: `Individual showed ${individualPatterns.length} drift pattern(s) during the period.`,
  };
  
  // Build collective scope
  const collective: CollectiveDriftScope = {
    timeRange: {
      start: collectiveOverlay.summary.timeRange.start,
      end: collectiveOverlay.summary.timeRange.end,
    },
    aggregationLevel,
    participantCount: collectiveOverlay.summary.totalParticipants,
    densityPatterns: collectiveOverlay.cells.map(c => ({
      contextType: c.contextType,
      density: c.driftDensity,
      description: `${c.contextType}: ${c.driftDensity} density (${c.participantCount} participants)`,
    })),
    summary: `Collective (${collectiveOverlay.summary.totalParticipants} participants) showed varied density patterns.`,
    privacyGuarantee: collectiveOverlay.privacyGuarantee,
  };
  
  // Find convergence
  const individualContexts = new Set(individualPatterns.map(p => p.contextType));
  const collectiveHighDensity = new Set(
    collectiveOverlay.cells
      .filter(c => c.driftDensity === 'high' || c.driftDensity === 'medium')
      .map(c => c.contextType)
  );
  
  const convergencePatterns: string[] = [];
  for (const ctx of individualContexts) {
    if (collectiveHighDensity.has(ctx)) {
      convergencePatterns.push(`${ctx} context variation present in both individual and collective`);
    }
  }
  
  const convergence = {
    patterns: convergencePatterns,
    description: convergencePatterns.length > 0
      ? `${convergencePatterns.length} pattern(s) observed in both individual and collective.`
      : 'No significant overlap between individual and collective patterns.',
  };
  
  // Find divergence
  const individualOnly: string[] = [];
  const collectiveOnly: string[] = [];
  
  for (const ctx of individualContexts) {
    if (!collectiveHighDensity.has(ctx)) {
      individualOnly.push(`${ctx} variation appeared in individual only`);
    }
  }
  
  for (const ctx of collectiveHighDensity) {
    if (!individualContexts.has(ctx)) {
      collectiveOnly.push(`${ctx} density appeared in collective only`);
    }
  }
  
  const divergence = {
    individualOnly,
    collectiveOnly,
    description: `Individual showed ${individualOnly.length} unique pattern(s). Collective showed ${collectiveOnly.length} unique pattern(s).`,
  };
  
  // Summary
  const summary = `
During this timeframe, the individual narrative showed ${individualPatterns.length} drift pattern(s).
In the collective aggregate (${collective.participantCount} participants), ${collective.densityPatterns.length} density pattern(s) were observed.

${convergence.description}
${divergence.description}

These observations describe coexistence only.
No normative alignment is implied.
`.trim();
  
  return {
    id: `ind-vs-coll-${Date.now()}`,
    family: 'individual-vs-collective',
    individual,
    collective,
    convergence,
    divergence,
    nonConclusions: DEFAULT_NON_CONCLUSIONS,
    generatedAt: new Date().toISOString(),
    summary,
  };
}

/**
 * Format individual vs collective narrative for display.
 */
export function formatIndividualVsCollectiveNarrative(
  narrative: IndividualVsCollectiveNarrative
): string {
  const lines: string[] = [];
  
  lines.push('═'.repeat(60));
  lines.push('INDIVIDUAL VS COLLECTIVE COMPARATIVE NARRATIVE');
  lines.push('Status: OBSERVATIONAL | Authority: NONE');
  lines.push('═'.repeat(60));
  lines.push('');
  
  // Individual
  lines.push('INDIVIDUAL SCOPE');
  lines.push('-'.repeat(40));
  lines.push(`Period: ${new Date(narrative.individual.timeRange.start).toLocaleDateString()} - ${new Date(narrative.individual.timeRange.end).toLocaleDateString()}`);
  lines.push(narrative.individual.scopeDescription);
  lines.push('');
  lines.push('Observed Patterns:');
  if (narrative.individual.patterns.length === 0) {
    lines.push('  No patterns detected.');
  } else {
    for (const p of narrative.individual.patterns) {
      lines.push(`  • ${p.description} (${p.magnitude})`);
    }
  }
  lines.push('');
  lines.push(`Summary: ${narrative.individual.summary}`);
  lines.push('');
  
  // Collective
  lines.push('COLLECTIVE SCOPE');
  lines.push('-'.repeat(40));
  lines.push(`Aggregation: ${narrative.collective.aggregationLevel}`);
  lines.push(`Participants: ${narrative.collective.participantCount} (anonymized)`);
  lines.push(`Period: ${new Date(narrative.collective.timeRange.start).toLocaleDateString()} - ${new Date(narrative.collective.timeRange.end).toLocaleDateString()}`);
  lines.push('');
  lines.push('Density Patterns:');
  for (const p of narrative.collective.densityPatterns.slice(0, 5)) {
    lines.push(`  • ${p.description}`);
  }
  lines.push('');
  lines.push(`Summary: ${narrative.collective.summary}`);
  lines.push('');
  lines.push(`Privacy: ${narrative.collective.privacyGuarantee.split('\n')[0]}`);
  lines.push('');
  
  // Convergence
  lines.push('AREAS OF CONVERGENCE');
  lines.push('-'.repeat(40));
  lines.push(narrative.convergence.description);
  for (const p of narrative.convergence.patterns) {
    lines.push(`  • ${p}`);
  }
  lines.push('');
  
  // Divergence
  lines.push('AREAS OF DIVERGENCE');
  lines.push('-'.repeat(40));
  lines.push(narrative.divergence.description);
  if (narrative.divergence.individualOnly.length > 0) {
    lines.push('  Individual Only:');
    for (const p of narrative.divergence.individualOnly) {
      lines.push(`    • ${p}`);
    }
  }
  if (narrative.divergence.collectiveOnly.length > 0) {
    lines.push('  Collective Only:');
    for (const p of narrative.divergence.collectiveOnly) {
      lines.push(`    • ${p}`);
    }
  }
  lines.push('');
  
  // Non-conclusions
  lines.push('NON-CONCLUSIONS');
  lines.push('-'.repeat(40));
  for (const stmt of narrative.nonConclusions.statements) {
    lines.push(`✗ ${stmt}`);
  }
  lines.push('');
  lines.push(narrative.nonConclusions.declaration);
  lines.push('');
  
  // Summary
  lines.push('NARRATIVE SUMMARY');
  lines.push('-'.repeat(40));
  lines.push(narrative.summary);
  lines.push('');
  
  // Footer
  lines.push('═'.repeat(60));
  lines.push(COMPARATIVE_NARRATIVE_DECLARATION);
  lines.push('═'.repeat(60));
  
  return lines.join('\n');
}
