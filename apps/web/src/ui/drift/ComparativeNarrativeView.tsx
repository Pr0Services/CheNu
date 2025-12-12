/* =====================================================
   CHE·NU — COMPARATIVE NARRATIVE VIEW
   Status: OBSERVATIONAL COMPARISON
   Authority: NONE
   Intent: DESCRIPTIVE CLARITY ONLY
   
   📜 PURPOSE:
   Display comparative drift narratives.
   Side-by-side, aligned timeline, or layered view.
   ===================================================== */

import React, { useState, useMemo, useCallback } from 'react';
import {
  type ComparativeDriftNarrative,
  type DriftNarrativeSource,
  type PresentationMode,
  type PresentationConfig,
  type ComparisonAxis,
  DEFAULT_PRESENTATION_CONFIG,
  COMPARATIVE_NARRATIVE_DECLARATION,
} from './comparativeNarrative.types';
import {
  generateComparativeNarrative,
  createNarrativeSourceFromDetector,
  formatComparativeNarrative,
} from './comparativeNarrativeEngine';
import type { ScopeLevel } from './driftVisualization.types';

/* =========================================================
   STYLES
   ========================================================= */

const styles = {
  container: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    backgroundColor: '#12121e',
    color: '#e0e0e0',
    borderRadius: '16px',
    padding: '24px',
    maxWidth: '1000px',
  } as React.CSSProperties,

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: '1px solid #2a2a3a',
  } as React.CSSProperties,

  title: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#fff',
    margin: 0,
    marginBottom: '4px',
  } as React.CSSProperties,

  subtitle: {
    fontSize: '12px',
    color: '#666',
    margin: 0,
  } as React.CSSProperties,

  badge: {
    fontSize: '10px',
    padding: '4px 8px',
    borderRadius: '4px',
    backgroundColor: '#2d2d44',
    color: '#888',
  } as React.CSSProperties,

  disclaimer: {
    backgroundColor: '#1a1a2e',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    borderLeft: '4px solid #6a6a8a',
    fontSize: '12px',
    color: '#888',
  } as React.CSSProperties,

  controls: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
    flexWrap: 'wrap' as const,
  } as React.CSSProperties,

  select: {
    backgroundColor: '#252540',
    color: '#e0e0e0',
    border: '1px solid #333',
    borderRadius: '6px',
    padding: '8px 12px',
    fontSize: '12px',
    cursor: 'pointer',
  } as React.CSSProperties,

  button: {
    backgroundColor: '#252540',
    color: '#e0e0e0',
    border: '1px solid #333',
    borderRadius: '6px',
    padding: '8px 16px',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  } as React.CSSProperties,

  splitView: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  } as React.CSSProperties,

  narrativePanel: {
    backgroundColor: '#1a1a2e',
    borderRadius: '12px',
    padding: '16px',
    minHeight: '300px',
  } as React.CSSProperties,

  panelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
    paddingBottom: '8px',
    borderBottom: '1px solid #2a2a3a',
  } as React.CSSProperties,

  panelTitle: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#fff',
  } as React.CSSProperties,

  panelBadge: {
    fontSize: '10px',
    padding: '2px 6px',
    borderRadius: '4px',
  } as React.CSSProperties,

  section: {
    marginBottom: '16px',
  } as React.CSSProperties,

  sectionTitle: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#aaa',
    marginBottom: '8px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  } as React.CSSProperties,

  observation: {
    backgroundColor: '#252540',
    padding: '10px 12px',
    borderRadius: '6px',
    marginBottom: '8px',
    fontSize: '12px',
  } as React.CSSProperties,

  observationText: {
    color: '#e0e0e0',
    marginBottom: '4px',
  } as React.CSSProperties,

  observationMeta: {
    fontSize: '10px',
    color: '#666',
  } as React.CSSProperties,

  temporalBox: {
    backgroundColor: '#252540',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '16px',
  } as React.CSSProperties,

  temporalType: {
    fontSize: '11px',
    fontWeight: 600,
    color: '#888',
    marginBottom: '4px',
    textTransform: 'uppercase' as const,
  } as React.CSSProperties,

  temporalDesc: {
    fontSize: '12px',
    color: '#e0e0e0',
  } as React.CSSProperties,

  boundaryBox: {
    backgroundColor: '#1e1e32',
    padding: '12px',
    borderRadius: '8px',
    border: '1px dashed #3a3a4a',
    marginTop: '16px',
  } as React.CSSProperties,

  boundaryTitle: {
    fontSize: '11px',
    fontWeight: 600,
    color: '#888',
    marginBottom: '8px',
  } as React.CSSProperties,

  boundaryItem: {
    fontSize: '11px',
    color: '#666',
    marginBottom: '4px',
  } as React.CSSProperties,

  summaryBox: {
    backgroundColor: '#1a1a2e',
    padding: '16px',
    borderRadius: '12px',
    marginTop: '20px',
    border: '1px solid #2a2a3a',
  } as React.CSSProperties,

  summaryText: {
    fontSize: '13px',
    color: '#ccc',
    lineHeight: 1.6,
    fontStyle: 'italic',
  } as React.CSSProperties,

  footer: {
    marginTop: '20px',
    paddingTop: '16px',
    borderTop: '1px solid #2a2a3a',
    textAlign: 'center' as const,
  } as React.CSSProperties,

  footerText: {
    fontSize: '11px',
    color: '#444',
    whiteSpace: 'pre-line' as const,
  } as React.CSSProperties,

  emptyState: {
    textAlign: 'center' as const,
    padding: '60px 20px',
    color: '#666',
  } as React.CSSProperties,
};

/* =========================================================
   PROPS
   ========================================================= */

export interface ComparativeNarrativeViewProps {
  /** Pre-generated narrative (optional) */
  narrative?: ComparativeDriftNarrative;

  /** Initial presentation mode */
  initialMode?: PresentationMode;

  /** Config overrides */
  config?: Partial<PresentationConfig>;

  /** On export callback */
  onExport?: (narrative: ComparativeDriftNarrative) => void;

  /** Custom class name */
  className?: string;
}

/* =========================================================
   COMPONENT
   ========================================================= */

export const ComparativeNarrativeView: React.FC<ComparativeNarrativeViewProps> = ({
  narrative: providedNarrative,
  initialMode = 'side_by_side',
  config: configOverrides,
  onExport,
  className,
}) => {
  // State
  const [narrative, setNarrative] = useState<ComparativeDriftNarrative | null>(
    providedNarrative || null
  );
  const [mode, setMode] = useState<PresentationMode>(initialMode);
  const [scopeA, setScopeA] = useState<ScopeLevel>('global');
  const [scopeB, setScopeB] = useState<ScopeLevel>('sphere');
  const [loading, setLoading] = useState(false);

  const config: PresentationConfig = useMemo(() => ({
    ...DEFAULT_PRESENTATION_CONFIG,
    mode,
    ...configOverrides,
  }), [mode, configOverrides]);

  // Generate comparison
  const handleGenerate = useCallback(() => {
    setLoading(true);
    try {
      const sourceA = createNarrativeSourceFromDetector(`${scopeA} scope`, scopeA);
      const sourceB = createNarrativeSourceFromDetector(`${scopeB} scope`, scopeB);

      const newNarrative = generateComparativeNarrative(sourceA, sourceB, {
        type: 'scope',
        axisALabel: `${scopeA} scope`,
        axisBLabel: `${scopeB} scope`,
      });

      setNarrative(newNarrative);
    } catch (error) {
      console.error('Failed to generate comparison:', error);
    } finally {
      setLoading(false);
    }
  }, [scopeA, scopeB]);

  // Export handler
  const handleExport = useCallback(() => {
    if (narrative) {
      onExport?.(narrative);

      // Also copy to clipboard
      const formatted = formatComparativeNarrative(narrative);
      navigator.clipboard?.writeText(formatted);
    }
  }, [narrative, onExport]);

  // Color for scope badges
  const colorA = '#6a6a8a';
  const colorB = '#8a6a6a';

  return (
    <div style={styles.container} className={className}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>⚖️ Comparative Drift Narrative</h2>
          <p style={styles.subtitle}>
            Observational comparison • No authority • No recommendations
          </p>
        </div>
        <span style={styles.badge}>DESCRIPTIVE ONLY</span>
      </div>

      {/* Disclaimer */}
      <div style={styles.disclaimer}>
        <strong>ℹ️ About This Comparison</strong>
        <br />
        This comparison describes <strong>differences and similarities</strong> between narratives.
        It does NOT indicate which is better, correct, or should be followed.
        Understanding remains yours alone.
      </div>

      {/* Controls */}
      <div style={styles.controls}>
        <select
          style={styles.select}
          value={scopeA}
          onChange={(e) => setScopeA(e.target.value as ScopeLevel)}
        >
          <option value="global">Global Scope (A)</option>
          <option value="sphere">Sphere Scope (A)</option>
          <option value="project">Project Scope (A)</option>
          <option value="session">Session Scope (A)</option>
        </select>

        <span style={{ color: '#666', alignSelf: 'center' }}>vs</span>

        <select
          style={styles.select}
          value={scopeB}
          onChange={(e) => setScopeB(e.target.value as ScopeLevel)}
        >
          <option value="global">Global Scope (B)</option>
          <option value="sphere">Sphere Scope (B)</option>
          <option value="project">Project Scope (B)</option>
          <option value="session">Session Scope (B)</option>
        </select>

        <button
          style={styles.button}
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Comparison'}
        </button>

        <select
          style={styles.select}
          value={mode}
          onChange={(e) => setMode(e.target.value as PresentationMode)}
        >
          <option value="side_by_side">Side-by-Side</option>
          <option value="aligned_timeline">Aligned Timeline</option>
          <option value="static_report">Report View</option>
        </select>

        {narrative && (
          <button style={styles.button} onClick={handleExport}>
            Export
          </button>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div style={styles.emptyState}>Generating comparison...</div>
      ) : !narrative ? (
        <div style={styles.emptyState}>
          <p>Select two scopes and click "Generate Comparison"</p>
          <p style={{ fontSize: '12px', marginTop: '8px' }}>
            The comparison will show patterns present in both,
            patterns unique to each, and temporal alignment.
          </p>
        </div>
      ) : (
        <>
          {/* Side-by-Side View */}
          {mode === 'side_by_side' && (
            <div style={styles.splitView}>
              {/* Narrative A */}
              <div style={styles.narrativePanel}>
                <div style={styles.panelHeader}>
                  <span style={styles.panelTitle}>
                    {narrative.definition.narrativeA.label}
                  </span>
                  <span style={{
                    ...styles.panelBadge,
                    backgroundColor: colorA + '30',
                    color: colorA,
                  }}>
                    A
                  </span>
                </div>

                <div style={{ fontSize: '11px', color: '#666', marginBottom: '12px' }}>
                  {new Date(narrative.definition.narrativeA.timeRange.start).toLocaleDateString()} —
                  {new Date(narrative.definition.narrativeA.timeRange.end).toLocaleDateString()}
                </div>

                <div style={styles.section}>
                  <div style={styles.sectionTitle}>Unique Patterns</div>
                  {narrative.divergentObservations
                    .filter(d => d.presentIn === 'A')
                    .map(obs => (
                      <div key={obs.id} style={styles.observation}>
                        <div style={styles.observationText}>{obs.pattern}</div>
                        <div style={styles.observationMeta}>
                          Confidence: {(obs.confidence * 100).toFixed(0)}%
                        </div>
                      </div>
                    ))}
                  {narrative.divergentObservations.filter(d => d.presentIn === 'A').length === 0 && (
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      No unique patterns identified
                    </div>
                  )}
                </div>
              </div>

              {/* Narrative B */}
              <div style={styles.narrativePanel}>
                <div style={styles.panelHeader}>
                  <span style={styles.panelTitle}>
                    {narrative.definition.narrativeB.label}
                  </span>
                  <span style={{
                    ...styles.panelBadge,
                    backgroundColor: colorB + '30',
                    color: colorB,
                  }}>
                    B
                  </span>
                </div>

                <div style={{ fontSize: '11px', color: '#666', marginBottom: '12px' }}>
                  {new Date(narrative.definition.narrativeB.timeRange.start).toLocaleDateString()} —
                  {new Date(narrative.definition.narrativeB.timeRange.end).toLocaleDateString()}
                </div>

                <div style={styles.section}>
                  <div style={styles.sectionTitle}>Unique Patterns</div>
                  {narrative.divergentObservations
                    .filter(d => d.presentIn === 'B')
                    .map(obs => (
                      <div key={obs.id} style={styles.observation}>
                        <div style={styles.observationText}>{obs.pattern}</div>
                        <div style={styles.observationMeta}>
                          Confidence: {(obs.confidence * 100).toFixed(0)}%
                        </div>
                      </div>
                    ))}
                  {narrative.divergentObservations.filter(d => d.presentIn === 'B').length === 0 && (
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      No unique patterns identified
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Shared Observations */}
          <div style={{ ...styles.narrativePanel, marginTop: '20px' }}>
            <div style={styles.sectionTitle}>Shared Observations</div>
            {narrative.sharedObservations.length === 0 ? (
              <div style={{ fontSize: '12px', color: '#666' }}>
                No shared patterns identified between the two narratives.
              </div>
            ) : (
              narrative.sharedObservations.map(obs => (
                <div key={obs.id} style={styles.observation}>
                  <div style={styles.observationText}>{obs.pattern}</div>
                  <div style={styles.observationMeta}>
                    Confidence: {(obs.confidence * 100).toFixed(0)}%
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Temporal Alignment */}
          {config.showTemporalAlignment && (
            <div style={styles.temporalBox}>
              <div style={styles.temporalType}>
                Temporal Alignment: {narrative.temporalAlignment.type}
              </div>
              <div style={styles.temporalDesc}>
                {narrative.temporalAlignment.description}
              </div>
            </div>
          )}

          {/* Narrative Summary */}
          <div style={styles.summaryBox}>
            <div style={styles.sectionTitle}>Narrative Summary</div>
            <div style={styles.summaryText}>
              {narrative.narrativeSummary}
            </div>
          </div>

          {/* Interpretation Boundaries */}
          {config.showBoundaries && (
            <div style={styles.boundaryBox}>
              <div style={styles.boundaryTitle}>⚠️ Interpretation Boundaries</div>
              {narrative.interpretationBoundaries.map(boundary => (
                <div key={boundary.id} style={styles.boundaryItem}>
                  <strong>✗</strong> Cannot conclude: {boundary.cannotConclude}
                  <br />
                  <span style={{ marginLeft: '16px', color: '#555' }}>
                    Reason: {boundary.reason}
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Footer */}
      <div style={styles.footer}>
        <div style={styles.footerText}>
          {COMPARATIVE_NARRATIVE_DECLARATION}
        </div>
        {narrative && (
          <div style={{ marginTop: '8px', fontSize: '10px', color: '#333' }}>
            Generated: {new Date(narrative.generatedAt).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
};

/* =========================================================
   COMPACT VIEW
   ========================================================= */

export interface ComparativeNarrativeCompactProps {
  narrative: ComparativeDriftNarrative;
  className?: string;
}

export const ComparativeNarrativeCompact: React.FC<ComparativeNarrativeCompactProps> = ({
  narrative,
  className,
}) => {
  const sharedCount = narrative.sharedObservations.length;
  const divergentCount = narrative.divergentObservations.length;
  const aOnly = narrative.divergentObservations.filter(d => d.presentIn === 'A').length;
  const bOnly = narrative.divergentObservations.filter(d => d.presentIn === 'B').length;

  return (
    <div style={{
      ...styles.container,
      padding: '16px',
      maxWidth: '400px',
    }} className={className}>
      <div style={{ fontSize: '14px', fontWeight: 500, color: '#fff', marginBottom: '8px' }}>
        ⚖️ {narrative.definition.narrativeA.label} vs {narrative.definition.narrativeB.label}
      </div>

      <div style={{ fontSize: '12px', color: '#888', marginBottom: '12px' }}>
        Axis: {narrative.definition.axis.type} |
        Temporal: {narrative.temporalAlignment.type}
      </div>

      <div style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
        <div>
          <span style={{ color: '#6a8a6a' }}>{sharedCount}</span> shared
        </div>
        <div>
          <span style={{ color: '#6a6a8a' }}>{aOnly}</span> unique to A
        </div>
        <div>
          <span style={{ color: '#8a6a6a' }}>{bOnly}</span> unique to B
        </div>
      </div>

      <div style={{ marginTop: '8px', fontSize: '10px', color: '#555' }}>
        Observational only • No recommendations
      </div>
    </div>
  );
};

/* =========================================================
   EXPORTS
   ========================================================= */

export default ComparativeNarrativeView;
