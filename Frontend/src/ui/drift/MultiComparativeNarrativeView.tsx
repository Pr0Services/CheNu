/* =====================================================
   CHE·NU — MULTI-COMPARATIVE NARRATIVE VIEW
   Status: OBSERVATIONAL COMPARISON LAYER
   Authority: NONE
   Intent: DESCRIPTIVE PERSPECTIVE ONLY
   
   📜 PURPOSE:
   Display comparative narratives across spheres
   or between individual and collective.
   
   📜 RULES:
   - Expand perspective only
   - NEVER define truth
   - NEVER rank behavior
   - NEVER suggest alignment
   ===================================================== */

import React, { useState, useMemo } from 'react';
import {
  type MultiSphereComparativeNarrative,
  type IndividualVsCollectiveNarrative,
  type ComparableSphere,
  type ComparisonFamily,
  COMPARATIVE_NARRATIVE_DECLARATION,
  DEFAULT_NON_CONCLUSIONS,
} from './comparativeNarrative.types';
import {
  generateMultiSphereNarrative,
  generateIndividualVsCollectiveNarrative,
} from './comparativeNarrativeEngine';
import { AGENT_CONFIRMATION } from '../../core/agents/internalAgentContext';

/* =========================================================
   TYPES
   ========================================================= */

export interface MultiComparativeNarrativeViewProps {
  /** Comparison family */
  family: ComparisonFamily;

  /** For multi-sphere: spheres to compare */
  spheres?: ComparableSphere[];

  /** Time range */
  timeRange?: {
    start: string;
    end: string;
  };

  /** Presentation mode */
  presentationMode?: 'side-by-side' | 'stacked' | 'tabs';

  /** Show interpretation boundary */
  showInterpretationBoundary?: boolean;

  /** Show non-conclusions */
  showNonConclusions?: boolean;

  /** Compact mode */
  compact?: boolean;

  /** Custom class */
  className?: string;
}

/* =========================================================
   STYLES
   ========================================================= */

const styles = {
  container: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    backgroundColor: '#1a1a2e',
    color: '#e0e0e0',
    borderRadius: '12px',
    padding: '20px',
    maxWidth: '900px',
  } as React.CSSProperties,

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: '1px solid #333',
  } as React.CSSProperties,

  title: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#fff',
    margin: 0,
  } as React.CSSProperties,

  badge: {
    fontSize: '11px',
    padding: '4px 8px',
    borderRadius: '12px',
    backgroundColor: '#2d2d44',
    color: '#888',
  } as React.CSSProperties,

  disclaimer: {
    backgroundColor: '#1e1e32',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '12px',
    color: '#888',
    borderLeft: '3px solid #6a6a8a',
  } as React.CSSProperties,

  section: {
    backgroundColor: '#252540',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px',
  } as React.CSSProperties,

  sectionTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#aaa',
    marginBottom: '12px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  } as React.CSSProperties,

  sphereGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px',
  } as React.CSSProperties,

  sphereCard: {
    backgroundColor: '#2d2d44',
    borderRadius: '8px',
    padding: '12px',
  } as React.CSSProperties,

  sphereName: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#ccc',
    marginBottom: '8px',
  } as React.CSSProperties,

  patternList: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    fontSize: '12px',
    color: '#999',
  } as React.CSSProperties,

  patternItem: {
    padding: '4px 0',
    borderBottom: '1px solid #333',
  } as React.CSSProperties,

  comparisonContainer: {
    display: 'flex',
    gap: '16px',
    marginBottom: '16px',
  } as React.CSSProperties,

  comparisonPane: {
    flex: 1,
    backgroundColor: '#252540',
    borderRadius: '8px',
    padding: '16px',
  } as React.CSSProperties,

  paneTitle: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#aaa',
    marginBottom: '12px',
    paddingBottom: '8px',
    borderBottom: '1px solid #333',
  } as React.CSSProperties,

  convergenceSection: {
    backgroundColor: '#2a3a2a',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '12px',
  } as React.CSSProperties,

  divergenceSection: {
    backgroundColor: '#3a2a2a',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '12px',
  } as React.CSSProperties,

  boundarySection: {
    backgroundColor: '#1e1e32',
    borderRadius: '8px',
    padding: '12px',
    marginTop: '16px',
    borderLeft: '3px solid #8a6a2a',
  } as React.CSSProperties,

  nonConclusionItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    padding: '6px 0',
    fontSize: '12px',
    color: '#888',
  } as React.CSSProperties,

  xMark: {
    color: '#aa6666',
    fontWeight: 'bold',
  } as React.CSSProperties,

  summary: {
    backgroundColor: '#252540',
    borderRadius: '8px',
    padding: '16px',
    fontSize: '13px',
    lineHeight: '1.6',
    color: '#ccc',
    whiteSpace: 'pre-line' as const,
  } as React.CSSProperties,

  footer: {
    marginTop: '16px',
    paddingTop: '12px',
    borderTop: '1px solid #333',
    fontSize: '11px',
    color: '#555',
    textAlign: 'center' as const,
  } as React.CSSProperties,
};

/* =========================================================
   MULTI-SPHERE VIEW
   ========================================================= */

interface MultiSphereViewProps {
  narrative: MultiSphereComparativeNarrative;
  showBoundary: boolean;
}

const MultiSphereView: React.FC<MultiSphereViewProps> = ({
  narrative,
  showBoundary,
}) => {
  return (
    <>
      {/* Compared Spheres */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Compared Spheres</div>
        <div style={styles.sphereGrid}>
          {narrative.spheres.map((scope) => (
            <div key={scope.sphere} style={styles.sphereCard}>
              <div style={styles.sphereName}>{scope.sphere}</div>
              <div style={{ fontSize: '11px', color: '#666' }}>
                {new Date(scope.timeRange.start).toLocaleDateString()} -{' '}
                {new Date(scope.timeRange.end).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '12px', fontSize: '12px', color: '#888' }}>
          Temporal Relationship: {narrative.temporalRelationship}
        </div>
      </div>

      {/* Shared Observations */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>
          Shared Observations (Present in All)
        </div>
        {narrative.sharedPatterns.length === 0 ? (
          <div style={{ color: '#666', fontSize: '13px' }}>
            No patterns appeared in all spheres.
          </div>
        ) : (
          <ul style={styles.patternList}>
            {narrative.sharedPatterns.map((p) => (
              <li key={p.id} style={styles.patternItem}>
                {p.description}{' '}
                <span style={{ color: '#666' }}>({p.magnitude})</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Divergent Observations */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>
          Divergent Observations (Unique to Sphere)
        </div>
        <div style={styles.sphereGrid}>
          {narrative.divergentPatterns.map((d) => (
            <div key={d.sphere} style={styles.sphereCard}>
              <div style={styles.sphereName}>{d.sphere}</div>
              {d.patterns.length === 0 ? (
                <div style={{ color: '#666', fontSize: '12px' }}>
                  No unique patterns.
                </div>
              ) : (
                <ul style={styles.patternList}>
                  {d.patterns.map((p) => (
                    <li key={p.id} style={{ padding: '4px 0' }}>
                      {p.description}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Interpretation Boundary */}
      {showBoundary && (
        <div style={styles.boundarySection}>
          <div style={styles.sectionTitle}>Interpretation Boundary</div>
          <div style={{ fontSize: '12px', color: '#999', whiteSpace: 'pre-line' }}>
            {narrative.interpretationBoundary}
          </div>
        </div>
      )}

      {/* Summary */}
      <div style={styles.summary}>{narrative.summary}</div>
    </>
  );
};

/* =========================================================
   INDIVIDUAL VS COLLECTIVE VIEW
   ========================================================= */

interface IndVsCollViewProps {
  narrative: IndividualVsCollectiveNarrative;
  showBoundary: boolean;
  showNonConclusions: boolean;
}

const IndividualVsCollectiveView: React.FC<IndVsCollViewProps> = ({
  narrative,
  showBoundary,
  showNonConclusions,
}) => {
  return (
    <>
      {/* Side-by-side comparison */}
      <div style={styles.comparisonContainer}>
        {/* Individual */}
        <div style={styles.comparisonPane}>
          <div style={styles.paneTitle}>Individual Scope</div>
          <div style={{ fontSize: '11px', color: '#666', marginBottom: '12px' }}>
            {new Date(narrative.individual.timeRange.start).toLocaleDateString()}{' '}
            - {new Date(narrative.individual.timeRange.end).toLocaleDateString()}
          </div>
          <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>
            {narrative.individual.scopeDescription}
          </div>
          <div style={{ marginTop: '12px' }}>
            <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '6px' }}>
              Patterns ({narrative.individual.patterns.length})
            </div>
            {narrative.individual.patterns.length === 0 ? (
              <div style={{ color: '#666', fontSize: '12px' }}>
                No patterns detected.
              </div>
            ) : (
              <ul style={styles.patternList}>
                {narrative.individual.patterns.slice(0, 5).map((p) => (
                  <li key={p.id} style={styles.patternItem}>
                    {p.description}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Collective */}
        <div style={styles.comparisonPane}>
          <div style={styles.paneTitle}>Collective Scope</div>
          <div style={{ fontSize: '11px', color: '#666', marginBottom: '12px' }}>
            {narrative.collective.aggregationLevel} |{' '}
            {narrative.collective.participantCount} participants (anonymized)
          </div>
          <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>
            {narrative.collective.summary}
          </div>
          <div style={{ marginTop: '12px' }}>
            <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '6px' }}>
              Density Patterns ({narrative.collective.densityPatterns.length})
            </div>
            <ul style={styles.patternList}>
              {narrative.collective.densityPatterns.slice(0, 5).map((p, i) => (
                <li key={i} style={styles.patternItem}>
                  {p.contextType}: {p.density} density
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Convergence */}
      <div style={styles.convergenceSection}>
        <div style={styles.sectionTitle}>Areas of Convergence</div>
        <div style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>
          {narrative.convergence.description}
        </div>
        {narrative.convergence.patterns.length > 0 && (
          <ul style={styles.patternList}>
            {narrative.convergence.patterns.map((p, i) => (
              <li key={i} style={styles.patternItem}>
                {p}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Divergence */}
      <div style={styles.divergenceSection}>
        <div style={styles.sectionTitle}>Areas of Divergence</div>
        <div style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>
          {narrative.divergence.description}
        </div>
        {narrative.divergence.individualOnly.length > 0 && (
          <div style={{ marginBottom: '8px' }}>
            <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>
              Individual Only:
            </div>
            <ul style={styles.patternList}>
              {narrative.divergence.individualOnly.map((p, i) => (
                <li key={i} style={styles.patternItem}>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        )}
        {narrative.divergence.collectiveOnly.length > 0 && (
          <div>
            <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>
              Collective Only:
            </div>
            <ul style={styles.patternList}>
              {narrative.divergence.collectiveOnly.map((p, i) => (
                <li key={i} style={styles.patternItem}>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Non-Conclusions */}
      {showNonConclusions && (
        <div style={styles.boundarySection}>
          <div style={styles.sectionTitle}>Non-Conclusions</div>
          {narrative.nonConclusions.statements.map((stmt, i) => (
            <div key={i} style={styles.nonConclusionItem}>
              <span style={styles.xMark}>✗</span>
              <span>{stmt}</span>
            </div>
          ))}
          <div
            style={{
              marginTop: '12px',
              paddingTop: '8px',
              borderTop: '1px solid #333',
              fontSize: '12px',
              fontStyle: 'italic',
              color: '#888',
            }}
          >
            {narrative.nonConclusions.declaration}
          </div>
        </div>
      )}

      {/* Summary */}
      <div style={styles.summary}>{narrative.summary}</div>
    </>
  );
};

/* =========================================================
   MAIN COMPONENT
   ========================================================= */

export const MultiComparativeNarrativeView: React.FC<
  MultiComparativeNarrativeViewProps
> = ({
  family,
  spheres = ['personal', 'creative', 'business'],
  timeRange,
  presentationMode = 'side-by-side',
  showInterpretationBoundary = true,
  showNonConclusions = true,
  compact = false,
  className,
}) => {
  const now = new Date();
  const defaultTimeRange = {
    start: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    end: now.toISOString(),
  };

  const effectiveTimeRange = timeRange || defaultTimeRange;

  // Generate narrative based on family
  const narrative = useMemo(() => {
    if (family === 'multi-sphere') {
      const scopes = spheres.map((s) => ({
        sphere: s,
        timeRange: effectiveTimeRange,
      }));
      return generateMultiSphereNarrative(scopes, 'concurrent');
    } else {
      return generateIndividualVsCollectiveNarrative(effectiveTimeRange);
    }
  }, [family, spheres, effectiveTimeRange]);

  const isMultiSphere = family === 'multi-sphere';

  return (
    <div style={styles.container} className={className}>
      {/* Header */}
      <div style={styles.header}>
        <h3 style={styles.title}>
          {isMultiSphere
            ? 'Multi-Sphere Comparative Narrative'
            : 'Individual vs Collective Narrative'}
        </h3>
        <span style={styles.badge}>PERSPECTIVE ONLY</span>
      </div>

      {/* Critical Disclaimer */}
      <div style={styles.disclaimer}>
        <strong>⚠️ IMPORTANT:</strong> This narrative exists to expand
        perspective, not authority.
        <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
          <li>Differences are described, not resolved</li>
          <li>Similarity does not imply correctness</li>
          <li>Truth is not computed — it is perceived</li>
        </ul>
      </div>

      {/* Content */}
      {isMultiSphere ? (
        <MultiSphereView
          narrative={narrative as MultiSphereComparativeNarrative}
          showBoundary={showInterpretationBoundary}
        />
      ) : (
        <IndividualVsCollectiveView
          narrative={narrative as IndividualVsCollectiveNarrative}
          showBoundary={showInterpretationBoundary}
          showNonConclusions={showNonConclusions}
        />
      )}

      {/* Footer */}
      <div style={styles.footer}>
        <div style={{ marginBottom: '8px' }}>
          Comparative narratives are optional, dismissible, and non-prioritized.
        </div>
        <div>{AGENT_CONFIRMATION}</div>
      </div>
    </div>
  );
};

/* =========================================================
   HOOKS
   ========================================================= */

/**
 * Hook for multi-sphere comparative narrative.
 */
export function useMultiSphereNarrative(
  spheres: ComparableSphere[],
  timeRange?: { start: string; end: string }
) {
  const now = new Date();
  const effectiveTimeRange = timeRange || {
    start: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    end: now.toISOString(),
  };

  const narrative = useMemo(() => {
    const scopes = spheres.map((s) => ({
      sphere: s,
      timeRange: effectiveTimeRange,
    }));
    return generateMultiSphereNarrative(scopes, 'concurrent');
  }, [spheres, effectiveTimeRange]);

  return narrative;
}

/**
 * Hook for individual vs collective narrative.
 */
export function useIndividualVsCollectiveNarrative(
  timeRange?: { start: string; end: string }
) {
  const now = new Date();
  const effectiveTimeRange = timeRange || {
    start: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    end: now.toISOString(),
  };

  const narrative = useMemo(() => {
    return generateIndividualVsCollectiveNarrative(effectiveTimeRange);
  }, [effectiveTimeRange]);

  return narrative;
}

/* =========================================================
   EXPORTS
   ========================================================= */

export default MultiComparativeNarrativeView;
