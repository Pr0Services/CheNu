/* =====================================================
   CHE·NU — DRIFT AWARENESS UI
   Status: INFORMATIONAL DISPLAY ONLY
   
   📜 PURPOSE:
   Display preference drift information to human.
   No action triggers. No behavior correction.
   Awareness only.
   ===================================================== */

import React, { useState, useEffect, useMemo } from 'react';
import {
  driftDetector,
  formatDriftAnalysisResult,
  type PreferenceDriftReport,
  type DriftAnalysisResult,
  type DriftMagnitude,
} from '../../core/agents/preferenceDriftDetector';
import { AGENT_CONFIRMATION } from '../../core/agents/internalAgentContext';

/* =========================================================
   TYPES
   ========================================================= */

export interface DriftAwarenessProps {
  /** Auto-refresh interval in ms (0 = disabled) */
  refreshInterval?: number;

  /** Show only drifts above this magnitude */
  minMagnitude?: DriftMagnitude;

  /** Scope filter */
  scope?: 'global' | 'sphere' | 'project';

  /** Compact mode */
  compact?: boolean;

  /** Custom class name */
  className?: string;

  /** On drift click callback */
  onDriftClick?: (report: PreferenceDriftReport) => void;
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
    maxWidth: '600px',
  } as React.CSSProperties,

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    borderBottom: '1px solid #333',
    paddingBottom: '12px',
  } as React.CSSProperties,

  title: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#fff',
    margin: 0,
  } as React.CSSProperties,

  badge: {
    fontSize: '12px',
    padding: '4px 8px',
    borderRadius: '12px',
    backgroundColor: '#2d2d44',
    color: '#888',
  } as React.CSSProperties,

  summary: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px',
    marginBottom: '20px',
  } as React.CSSProperties,

  summaryCard: {
    backgroundColor: '#252540',
    padding: '12px',
    borderRadius: '8px',
    textAlign: 'center' as const,
  } as React.CSSProperties,

  summaryValue: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#fff',
  } as React.CSSProperties,

  summaryLabel: {
    fontSize: '11px',
    color: '#888',
    marginTop: '4px',
  } as React.CSSProperties,

  driftList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  } as React.CSSProperties,

  driftItem: {
    backgroundColor: '#252540',
    padding: '12px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    borderLeft: '4px solid',
  } as React.CSSProperties,

  driftHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px',
  } as React.CSSProperties,

  driftKey: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#fff',
  } as React.CSSProperties,

  driftDirection: {
    fontSize: '12px',
    color: '#aaa',
  } as React.CSSProperties,

  driftMeta: {
    display: 'flex',
    gap: '12px',
    fontSize: '11px',
    color: '#666',
  } as React.CSSProperties,

  magnitudeHigh: {
    borderLeftColor: '#ff6b6b',
  } as React.CSSProperties,

  magnitudeMedium: {
    borderLeftColor: '#ffa94d',
  } as React.CSSProperties,

  magnitudeLow: {
    borderLeftColor: '#69db7c',
  } as React.CSSProperties,

  noData: {
    textAlign: 'center' as const,
    padding: '40px 20px',
    color: '#666',
  } as React.CSSProperties,

  footer: {
    marginTop: '16px',
    paddingTop: '12px',
    borderTop: '1px solid #333',
    fontSize: '11px',
    color: '#555',
    textAlign: 'center' as const,
  } as React.CSSProperties,

  disclaimer: {
    backgroundColor: '#1e1e32',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '12px',
    color: '#888',
    borderLeft: '3px solid #4a4a6a',
  } as React.CSSProperties,

  compactContainer: {
    padding: '12px',
  } as React.CSSProperties,

  compactSummary: {
    display: 'flex',
    gap: '16px',
    fontSize: '13px',
  } as React.CSSProperties,
};

/* =========================================================
   MAGNITUDE HELPERS
   ========================================================= */

const getMagnitudeStyle = (magnitude: DriftMagnitude): React.CSSProperties => {
  switch (magnitude) {
    case 'high':
      return styles.magnitudeHigh;
    case 'medium':
      return styles.magnitudeMedium;
    case 'low':
    default:
      return styles.magnitudeLow;
  }
};

const getMagnitudeEmoji = (magnitude: DriftMagnitude): string => {
  switch (magnitude) {
    case 'high':
      return '🔴';
    case 'medium':
      return '🟡';
    case 'low':
    default:
      return '🟢';
  }
};

const magnitudePriority: Record<DriftMagnitude, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

/* =========================================================
   HOOKS
   ========================================================= */

/**
 * Hook for drift analysis.
 */
export function useDriftAnalysis(
  options: {
    refreshInterval?: number;
    scope?: 'global' | 'sphere' | 'project';
    minMagnitude?: DriftMagnitude;
  } = {}
) {
  const [result, setResult] = useState<DriftAnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = () => {
    try {
      setLoading(true);
      const analysis = driftDetector.analyze({ scope: options.scope });
      setResult(analysis);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();

    if (options.refreshInterval && options.refreshInterval > 0) {
      const interval = setInterval(refresh, options.refreshInterval);
      return () => clearInterval(interval);
    }
  }, [options.scope, options.refreshInterval]);

  const filteredReports = useMemo(() => {
    if (!result) return [];

    let reports = result.reports.filter((r) => r.driftDetected);

    if (options.minMagnitude) {
      const minPriority = magnitudePriority[options.minMagnitude];
      reports = reports.filter(
        (r) => magnitudePriority[r.magnitude] >= minPriority
      );
    }

    // Sort by magnitude (high first)
    reports.sort(
      (a, b) => magnitudePriority[b.magnitude] - magnitudePriority[a.magnitude]
    );

    return reports;
  }, [result, options.minMagnitude]);

  return {
    result,
    filteredReports,
    loading,
    error,
    refresh,
  };
}

/* =========================================================
   COMPACT COMPONENT
   ========================================================= */

export const DriftAwarenessCompact: React.FC<DriftAwarenessProps> = ({
  refreshInterval = 0,
  scope,
  className,
}) => {
  const { result, filteredReports, loading } = useDriftAnalysis({
    refreshInterval,
    scope,
  });

  if (loading || !result) {
    return (
      <div style={{ ...styles.container, ...styles.compactContainer }} className={className}>
        <span style={{ color: '#666' }}>Analyzing drift...</span>
      </div>
    );
  }

  const hasHighDrift = filteredReports.some((r) => r.magnitude === 'high');
  const hasMediumDrift = filteredReports.some((r) => r.magnitude === 'medium');

  return (
    <div style={{ ...styles.container, ...styles.compactContainer }} className={className}>
      <div style={styles.compactSummary}>
        <span>
          {hasHighDrift ? '🔴' : hasMediumDrift ? '🟡' : '🟢'}
          {' '}
          <strong>{result.summary.driftsDetected}</strong> drift(s) detected
        </span>
        {hasHighDrift && (
          <span style={{ color: '#ff6b6b' }}>
            {result.summary.highMagnitudeDrifts} high
          </span>
        )}
        <span style={{ color: '#555' }}>
          {result.summary.totalPreferencesAnalyzed} analyzed
        </span>
      </div>
    </div>
  );
};

/* =========================================================
   MAIN COMPONENT
   ========================================================= */

export const DriftAwarenessPanel: React.FC<DriftAwarenessProps> = ({
  refreshInterval = 0,
  minMagnitude,
  scope,
  compact = false,
  className,
  onDriftClick,
}) => {
  const { result, filteredReports, loading, refresh } = useDriftAnalysis({
    refreshInterval,
    scope,
    minMagnitude,
  });

  if (compact) {
    return <DriftAwarenessCompact {...{ refreshInterval, scope, className }} />;
  }

  return (
    <div style={styles.container} className={className}>
      {/* Header */}
      <div style={styles.header}>
        <h3 style={styles.title}>Preference Drift Awareness</h3>
        <span style={styles.badge}>INFORMATIONAL</span>
      </div>

      {/* Disclaimer */}
      <div style={styles.disclaimer}>
        ℹ️ This display is for <strong>awareness only</strong>. No action required.
        Drift detection does not assume intent or infer reasons.
      </div>

      {loading ? (
        <div style={styles.noData}>Analyzing preferences...</div>
      ) : !result ? (
        <div style={styles.noData}>No data available</div>
      ) : (
        <>
          {/* Summary */}
          <div style={styles.summary}>
            <div style={styles.summaryCard}>
              <div style={styles.summaryValue}>{result.summary.totalPreferencesAnalyzed}</div>
              <div style={styles.summaryLabel}>ANALYZED</div>
            </div>
            <div style={styles.summaryCard}>
              <div style={{ ...styles.summaryValue, color: '#ff6b6b' }}>
                {result.summary.highMagnitudeDrifts}
              </div>
              <div style={styles.summaryLabel}>HIGH</div>
            </div>
            <div style={styles.summaryCard}>
              <div style={{ ...styles.summaryValue, color: '#ffa94d' }}>
                {result.summary.mediumMagnitudeDrifts}
              </div>
              <div style={styles.summaryLabel}>MEDIUM</div>
            </div>
            <div style={styles.summaryCard}>
              <div style={{ ...styles.summaryValue, color: '#69db7c' }}>
                {result.summary.stablePreferences}
              </div>
              <div style={styles.summaryLabel}>STABLE</div>
            </div>
          </div>

          {/* Drift List */}
          {filteredReports.length > 0 ? (
            <div style={styles.driftList}>
              {filteredReports.map((report) => (
                <div
                  key={report.preferenceId}
                  style={{ ...styles.driftItem, ...getMagnitudeStyle(report.magnitude) }}
                  onClick={() => onDriftClick?.(report)}
                  role="button"
                  tabIndex={0}
                >
                  <div style={styles.driftHeader}>
                    <span style={styles.driftKey}>
                      {getMagnitudeEmoji(report.magnitude)} {report.preferenceKey}
                    </span>
                    <span style={{ fontSize: '11px', color: '#666' }}>
                      [{report.scope}]
                    </span>
                  </div>
                  <div style={styles.driftDirection}>
                    {report.direction}
                  </div>
                  <div style={styles.driftMeta}>
                    <span>Confidence: {(report.confidence * 100).toFixed(0)}%</span>
                    <span>Expected: {report.expectedValue}</span>
                    <span>Observed: {report.observedValue}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.noData}>
              ✓ No significant drift detected<br />
              <span style={{ fontSize: '12px' }}>Preferences remain stable</span>
            </div>
          )}

          {/* Footer */}
          <div style={styles.footer}>
            {AGENT_CONFIRMATION}
            <br />
            Last analyzed: {new Date(result.analyzedAt).toLocaleTimeString()}
            {refreshInterval > 0 && (
              <span> • Auto-refresh: {refreshInterval / 1000}s</span>
            )}
          </div>
        </>
      )}
    </div>
  );
};

/* =========================================================
   DRIFT DETAIL MODAL
   ========================================================= */

export interface DriftDetailProps {
  report: PreferenceDriftReport;
  onClose: () => void;
}

export const DriftDetailModal: React.FC<DriftDetailProps> = ({
  report,
  onClose,
}) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          ...styles.container,
          maxWidth: '500px',
          maxHeight: '80vh',
          overflow: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={styles.header}>
          <h3 style={styles.title}>
            {getMagnitudeEmoji(report.magnitude)} Drift Detail
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#888',
              fontSize: '20px',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <strong style={{ color: '#fff' }}>{report.preferenceKey}</strong>
          <span style={{ color: '#666', marginLeft: '8px' }}>[{report.scope}]</span>
        </div>

        <div style={{ ...styles.disclaimer, marginBottom: '16px' }}>
          ⚠️ This is <strong>observation only</strong>. No intent assumed.
          No reasons inferred. No correction implied.
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={{ padding: '8px', color: '#888' }}>Magnitude</td>
              <td style={{ padding: '8px', color: '#fff' }}>
                {report.magnitude.toUpperCase()}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px', color: '#888' }}>Direction</td>
              <td style={{ padding: '8px', color: '#fff' }}>{report.direction}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', color: '#888' }}>Confidence</td>
              <td style={{ padding: '8px', color: '#fff' }}>
                {(report.confidence * 100).toFixed(0)}%
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px', color: '#888' }}>Historical Pattern</td>
              <td style={{ padding: '8px', color: '#fff' }}>
                {report.historicalPattern}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px', color: '#888' }}>Recent Pattern</td>
              <td style={{ padding: '8px', color: '#fff' }}>
                {report.recentPattern}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px', color: '#888' }}>Window Sizes</td>
              <td style={{ padding: '8px', color: '#fff' }}>
                Historical: {report.historicalWindowSize} |
                Recent: {report.recentWindowSize}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px', color: '#888' }}>First Observed</td>
              <td style={{ padding: '8px', color: '#fff' }}>
                {report.firstObserved ? new Date(report.firstObserved).toLocaleString() : 'N/A'}
              </td>
            </tr>
          </tbody>
        </table>

        <div style={{ ...styles.footer, marginTop: '20px' }}>
          Recommendation: <strong>{report.recommendation.toUpperCase()}</strong>
          <br />
          {AGENT_CONFIRMATION}
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   EXPORTS
   ========================================================= */

export default DriftAwarenessPanel;
