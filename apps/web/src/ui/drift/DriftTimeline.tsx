/* =====================================================
   CHE·NU — DRIFT TIMELINE COMPONENT
   Status: INFORMATIONAL ONLY — NO AUTHORITY
   
   📜 PURPOSE:
   Show WHEN and HOW preferences change over time.
   
   📜 RULES:
   - Chronological
   - Immutable
   - Read-only
   - No smoothing or correction
   ===================================================== */

import React, { useState, useMemo, useCallback } from 'react';
import {
  type DriftTimeline,
  type DriftTimelinePoint,
  type TimelineViewConfig,
  type ScopeLevel,
  DEFAULT_TIMELINE_CONFIG,
  DRIFT_VISUALIZATION_CONFIRMATION,
  validateNeutralLanguage,
} from './driftVisualization.types';
import { driftDetector } from '../../core/agents/preferenceDriftDetector';

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
    overflow: 'hidden',
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
    fontSize: '16px',
    fontWeight: 600,
    color: '#fff',
    margin: 0,
  } as React.CSSProperties,

  controls: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  } as React.CSSProperties,

  select: {
    backgroundColor: '#252540',
    color: '#e0e0e0',
    border: '1px solid #333',
    borderRadius: '6px',
    padding: '6px 10px',
    fontSize: '12px',
    cursor: 'pointer',
  } as React.CSSProperties,

  timeline: {
    position: 'relative' as const,
    minHeight: '200px',
    marginTop: '16px',
  } as React.CSSProperties,

  timelineLine: {
    position: 'absolute' as const,
    left: '20px',
    top: '0',
    bottom: '0',
    width: '2px',
    backgroundColor: '#333',
  } as React.CSSProperties,

  pointsList: {
    paddingLeft: '50px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  } as React.CSSProperties,

  point: {
    position: 'relative' as const,
    backgroundColor: '#252540',
    padding: '12px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  } as React.CSSProperties,

  pointDot: {
    position: 'absolute' as const,
    left: '-38px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    border: '2px solid #1a1a2e',
  } as React.CSSProperties,

  pointHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px',
  } as React.CSSProperties,

  pointKey: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#fff',
  } as React.CSSProperties,

  pointTime: {
    fontSize: '11px',
    color: '#666',
  } as React.CSSProperties,

  pointDirection: {
    fontSize: '13px',
    color: '#aaa',
  } as React.CSSProperties,

  pointMeta: {
    display: 'flex',
    gap: '12px',
    marginTop: '8px',
    fontSize: '11px',
    color: '#666',
  } as React.CSSProperties,

  badge: {
    fontSize: '10px',
    padding: '2px 6px',
    borderRadius: '4px',
    backgroundColor: '#2d2d44',
    color: '#888',
  } as React.CSSProperties,

  emptyState: {
    textAlign: 'center' as const,
    padding: '40px 20px',
    color: '#666',
  } as React.CSSProperties,

  footer: {
    marginTop: '16px',
    paddingTop: '12px',
    borderTop: '1px solid #333',
    fontSize: '10px',
    color: '#444',
    textAlign: 'center' as const,
  } as React.CSSProperties,

  disclaimer: {
    backgroundColor: '#1e1e32',
    padding: '10px 12px',
    borderRadius: '6px',
    fontSize: '11px',
    color: '#666',
    marginBottom: '12px',
    borderLeft: '3px solid #4a4a6a',
  } as React.CSSProperties,
};

/* =========================================================
   MAGNITUDE COLORS (Neutral palette)
   ========================================================= */

const magnitudeColors: Record<string, string> = {
  none: '#4a4a6a',
  low: '#5a7a5a',
  medium: '#7a7a5a',
  high: '#7a5a5a',
};

/* =========================================================
   HOOK: Generate Timeline Data
   ========================================================= */

export function useDriftTimeline(options: {
  scope?: ScopeLevel;
  scopeId?: string;
  days?: number;
}): {
  timeline: DriftTimeline | null;
  loading: boolean;
  refresh: () => void;
} {
  const [timeline, setTimeline] = useState<DriftTimeline | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setLoading(true);

    try {
      const result = driftDetector.analyze({
        scope: options.scope,
      });

      // Convert drift reports to timeline points
      const points: DriftTimelinePoint[] = result.reports
        .filter((r) => r.driftDetected)
        .map((report, index) => ({
          id: `point-${index}`,
          timestamp: report.reportedAt,
          preferenceId: report.preferenceId,
          preferenceKey: report.preferenceKey,
          scope: report.scope as ScopeLevel,
          driftMagnitude: report.magnitude === 'low' ? 'low' :
            report.magnitude === 'medium' ? 'medium' :
            report.magnitude === 'high' ? 'high' : 'none',
          direction: report.direction,
          confidence: report.confidence,
          historicalPattern: report.historicalPattern,
          recentPattern: report.recentPattern,
        }));

      // Sort chronologically
      points.sort((a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

      const now = new Date();
      const daysAgo = new Date(now.getTime() - (options.days || 30) * 24 * 60 * 60 * 1000);

      setTimeline({
        id: `timeline-${Date.now()}`,
        scope: options.scope,
        scopeId: options.scopeId,
        segments: [{
          id: 'segment-main',
          startTime: daysAgo.toISOString(),
          endTime: now.toISOString(),
          points,
          granularity: 'day',
        }],
        totalPoints: points.length,
        timeRange: {
          start: daysAgo.toISOString(),
          end: now.toISOString(),
        },
        generatedAt: now.toISOString(),
      });
    } catch (error) {
      console.error('Failed to generate timeline:', error);
    } finally {
      setLoading(false);
    }
  }, [options.scope, options.scopeId, options.days]);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  return { timeline, loading, refresh };
}

/* =========================================================
   PROPS
   ========================================================= */

export interface DriftTimelineProps {
  /** Initial scope filter */
  initialScope?: ScopeLevel;

  /** Initial scope ID */
  scopeId?: string;

  /** Days to show */
  days?: number;

  /** Config overrides */
  config?: Partial<TimelineViewConfig>;

  /** Max height */
  maxHeight?: string;

  /** On point click */
  onPointClick?: (point: DriftTimelinePoint) => void;

  /** Custom class name */
  className?: string;
}

/* =========================================================
   COMPONENT
   ========================================================= */

export const DriftTimelineView: React.FC<DriftTimelineProps> = ({
  initialScope,
  scopeId,
  days = 30,
  config: configOverrides,
  maxHeight = '400px',
  onPointClick,
  className,
}) => {
  const [scope, setScope] = useState<ScopeLevel | undefined>(initialScope);
  const [expandedPoint, setExpandedPoint] = useState<string | null>(null);

  const config = useMemo(() => ({
    ...DEFAULT_TIMELINE_CONFIG,
    ...configOverrides,
  }), [configOverrides]);

  const { timeline, loading, refresh } = useDriftTimeline({
    scope,
    scopeId,
    days,
  });

  const handlePointClick = useCallback((point: DriftTimelinePoint) => {
    setExpandedPoint(expandedPoint === point.id ? null : point.id);
    onPointClick?.(point);
  }, [expandedPoint, onPointClick]);

  const allPoints = useMemo(() => {
    if (!timeline) return [];
    return timeline.segments.flatMap((s) => s.points).slice(0, config.maxPoints);
  }, [timeline, config.maxPoints]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div style={styles.container} className={className}>
      {/* Header */}
      <div style={styles.header}>
        <h3 style={styles.title}>📊 Preference Evolution Timeline</h3>
        <div style={styles.controls}>
          <select
            style={styles.select}
            value={scope || 'all'}
            onChange={(e) => setScope(e.target.value === 'all' ? undefined : e.target.value as ScopeLevel)}
          >
            <option value="all">All Scopes</option>
            <option value="global">Global</option>
            <option value="sphere">Sphere</option>
            <option value="project">Project</option>
            <option value="session">Session</option>
          </select>
          <button
            onClick={refresh}
            style={{
              ...styles.select,
              cursor: 'pointer',
            }}
          >
            ↻
          </button>
        </div>
      </div>

      {/* Disclaimer */}
      <div style={styles.disclaimer}>
        ℹ️ This timeline shows preference <strong>evolution</strong> over time.
        No action implied. Observation only.
      </div>

      {/* Timeline */}
      {loading ? (
        <div style={styles.emptyState}>Loading timeline...</div>
      ) : allPoints.length === 0 ? (
        <div style={styles.emptyState}>
          No preference changes observed<br />
          <span style={{ fontSize: '12px' }}>Preferences remain stable</span>
        </div>
      ) : (
        <div style={{ ...styles.timeline, maxHeight, overflowY: 'auto' }}>
          <div style={styles.timelineLine} />
          <div style={styles.pointsList}>
            {allPoints.map((point) => (
              <div
                key={point.id}
                style={styles.point}
                onClick={() => handlePointClick(point)}
                role="button"
                tabIndex={0}
              >
                {/* Dot */}
                <div
                  style={{
                    ...styles.pointDot,
                    backgroundColor: magnitudeColors[point.driftMagnitude],
                  }}
                />

                {/* Content */}
                <div style={styles.pointHeader}>
                  <span style={styles.pointKey}>{point.preferenceKey}</span>
                  <span style={styles.pointTime}>{formatTime(point.timestamp)}</span>
                </div>

                <div style={styles.pointDirection}>
                  {point.direction}
                </div>

                <div style={styles.pointMeta}>
                  <span style={{
                    ...styles.badge,
                    backgroundColor: magnitudeColors[point.driftMagnitude] + '40',
                  }}>
                    {point.driftMagnitude}
                  </span>
                  <span>[{point.scope}]</span>
                  {config.showConfidence && (
                    <span>Confidence: {(point.confidence * 100).toFixed(0)}%</span>
                  )}
                </div>

                {/* Expanded details */}
                {expandedPoint === point.id && (
                  <div style={{
                    marginTop: '12px',
                    paddingTop: '12px',
                    borderTop: '1px solid #333',
                    fontSize: '12px',
                    color: '#888',
                  }}>
                    <div>Historical: {point.historicalPattern}</div>
                    <div>Recent: {point.recentPattern}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={styles.footer}>
        {timeline && (
          <>
            {allPoints.length} change{allPoints.length !== 1 ? 's' : ''} observed
            {' • '}
            Last {days} days
          </>
        )}
        <br />
        <span style={{ fontSize: '9px', color: '#333' }}>
          Human awareness remains the only authority
        </span>
      </div>
    </div>
  );
};

/* =========================================================
   EXPORTS
   ========================================================= */

export default DriftTimelineView;
