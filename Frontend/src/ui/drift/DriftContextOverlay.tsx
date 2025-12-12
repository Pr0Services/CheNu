/* =====================================================
   CHE·NU — DRIFT + CONTEXT OVERLAY UI
   Status: OBSERVATIONAL LAYER
   Authority: NONE
   
   📜 PURPOSE:
   Visually correlate preference evolution WITH
   the operational context in which those preferences
   were expressed.
   
   📜 RULES:
   - Overlay reveals CORRELATION only
   - NEVER implies causation
   - NEVER suggests behavior changes
   - Human awareness only
   ===================================================== */

import React, { useState, useMemo, useCallback } from 'react';
import {
  contextDriftDetector,
  type ContextType,
  type ContextDriftReport,
  type ContextDriftAnalysisResult,
} from '../../core/agents/contextDriftDetector';
import {
  driftDetector,
  type PreferenceDriftReport,
  type DriftMagnitude,
} from '../../core/agents/preferenceDriftDetector';
import { AGENT_CONFIRMATION } from '../../core/agents/internalAgentContext';

/* =========================================================
   TYPES
   ========================================================= */

export interface DriftContextOverlayProps {
  /** Show timeline overlay */
  showTimeline?: boolean;

  /** Show heatmap overlay */
  showHeatmap?: boolean;

  /** Enable sphere filter */
  sphereFilter?: string;

  /** Time range in days */
  timeRangeDays?: number;

  /** Compact mode */
  compact?: boolean;

  /** On cell click */
  onCellClick?: (contextType: ContextType, magnitude: DriftMagnitude) => void;

  /** Custom class name */
  className?: string;
}

export interface OverlayDataPoint {
  /** Context type */
  contextType: ContextType;

  /** Associated preference drifts */
  preferenceDrifts: PreferenceDriftReport[];

  /** Context drift info */
  contextDrift: ContextDriftReport | null;

  /** Co-occurrence score */
  coOccurrenceScore: number;

  /** Timestamp */
  timestamp: string;
}

export interface OverlayHeatmapCell {
  /** Context type (row) */
  contextType: ContextType;

  /** Drift magnitude (column) */
  driftMagnitude: DriftMagnitude;

  /** Density (0-1) */
  density: number;

  /** Count of observations */
  count: number;
}

/* =========================================================
   NEUTRAL LANGUAGE
   ========================================================= */

const ALLOWED_DESCRIPTIONS = [
  'observed together',
  'co-occurred',
  'present during',
  'frequent in context',
];

const FORBIDDEN_DESCRIPTIONS = [
  'caused by',
  'leads to',
  'results in',
  'should avoid',
];

/**
 * Generate neutral overlay description.
 */
function neutralDescription(
  contextType: ContextType,
  driftMagnitude: DriftMagnitude,
  count: number
): string {
  if (count === 0) return `No ${contextType} observations`;

  const intensity = count > 10 ? 'frequently' : count > 3 ? 'occasionally' : 'rarely';

  // Use ALLOWED language only
  return `${driftMagnitude} drift ${intensity} observed during ${contextType} contexts`;
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
    maxWidth: '800px',
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
    borderLeft: '3px solid #4a4a6a',
  } as React.CSSProperties,

  controls: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
    flexWrap: 'wrap' as const,
  } as React.CSSProperties,

  toggle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    backgroundColor: '#252540',
    borderRadius: '6px',
    cursor: 'pointer',
    border: '1px solid transparent',
    transition: 'border-color 0.2s',
  } as React.CSSProperties,

  toggleActive: {
    borderColor: '#4a4a8a',
  } as React.CSSProperties,

  heatmapContainer: {
    overflowX: 'auto' as const,
    marginBottom: '20px',
  } as React.CSSProperties,

  heatmapTable: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    fontSize: '13px',
  } as React.CSSProperties,

  heatmapHeader: {
    padding: '10px',
    textAlign: 'center' as const,
    backgroundColor: '#252540',
    color: '#aaa',
    fontWeight: 500,
  } as React.CSSProperties,

  heatmapRowHeader: {
    padding: '10px',
    textAlign: 'left' as const,
    backgroundColor: '#252540',
    color: '#ccc',
    fontWeight: 500,
  } as React.CSSProperties,

  heatmapCell: {
    padding: '12px',
    textAlign: 'center' as const,
    cursor: 'pointer',
    transition: 'transform 0.1s',
  } as React.CSSProperties,

  timelineContainer: {
    position: 'relative' as const,
    height: '200px',
    backgroundColor: '#252540',
    borderRadius: '8px',
    padding: '16px',
    overflow: 'hidden' as const,
  } as React.CSSProperties,

  timelineAxis: {
    position: 'absolute' as const,
    bottom: '30px',
    left: '16px',
    right: '16px',
    height: '2px',
    backgroundColor: '#444',
  } as React.CSSProperties,

  timelinePoint: {
    position: 'absolute' as const,
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  } as React.CSSProperties,

  legend: {
    display: 'flex',
    gap: '16px',
    marginTop: '16px',
    fontSize: '12px',
    color: '#888',
  } as React.CSSProperties,

  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  } as React.CSSProperties,

  legendDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
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
   COLOR UTILITIES
   ========================================================= */

const DENSITY_COLORS = {
  none: '#2a2a40',
  low: '#3a5a3a',
  medium: '#8a6a2a',
  high: '#8a3a3a',
};

function getDensityColor(density: number): string {
  if (density === 0) return DENSITY_COLORS.none;
  if (density < 0.3) return DENSITY_COLORS.low;
  if (density < 0.6) return DENSITY_COLORS.medium;
  return DENSITY_COLORS.high;
}

function getMagnitudeColor(magnitude: DriftMagnitude): string {
  switch (magnitude) {
    case 'high': return '#ff6b6b';
    case 'medium': return '#ffa94d';
    case 'low': return '#69db7c';
  }
}

/* =========================================================
   HOOKS
   ========================================================= */

/**
 * Hook for drift + context overlay data.
 */
export function useDriftContextOverlay(
  options: {
    sphereFilter?: string;
    timeRangeDays?: number;
  } = {}
) {
  // Get preference drifts
  const prefDriftResult = useMemo(() => {
    return driftDetector.analyze({
      scope: options.sphereFilter ? 'sphere' : 'global',
    });
  }, [options.sphereFilter]);

  // Get context drifts
  const contextDriftResult = useMemo(() => {
    // Add simulated data for demo
    contextDriftDetector.addSimulatedData(100, options.timeRangeDays || 30);
    return contextDriftDetector.analyze({
      scope: options.sphereFilter ? 'sphere' : 'global',
      sphereId: options.sphereFilter,
    });
  }, [options.sphereFilter, options.timeRangeDays]);

  // Build overlay data points
  const overlayData = useMemo(() => {
    const points: OverlayDataPoint[] = [];

    for (const contextReport of contextDriftResult.reports) {
      // Find co-occurring preference drifts
      const coOccurring = prefDriftResult.reports.filter((p) => p.driftDetected);

      points.push({
        contextType: contextReport.contextType,
        preferenceDrifts: coOccurring,
        contextDrift: contextReport,
        coOccurrenceScore: coOccurring.length > 0 ? coOccurring.length / prefDriftResult.reports.length : 0,
        timestamp: contextReport.timestamp,
      });
    }

    return points;
  }, [prefDriftResult, contextDriftResult]);

  // Build heatmap cells
  const heatmapCells = useMemo(() => {
    const cells: OverlayHeatmapCell[] = [];
    const magnitudes: DriftMagnitude[] = ['low', 'medium', 'high'];

    for (const contextReport of contextDriftResult.reports) {
      for (const magnitude of magnitudes) {
        const matchingPrefDrifts = prefDriftResult.reports.filter(
          (p) => p.driftDetected && p.magnitude === magnitude
        );

        const count = contextReport.driftDetected && contextReport.magnitude === magnitude
          ? matchingPrefDrifts.length + 1
          : matchingPrefDrifts.length;

        cells.push({
          contextType: contextReport.contextType,
          driftMagnitude: magnitude,
          density: Math.min(1, count / 5),
          count,
        });
      }
    }

    return cells;
  }, [prefDriftResult, contextDriftResult]);

  return {
    overlayData,
    heatmapCells,
    prefDriftResult,
    contextDriftResult,
  };
}

/* =========================================================
   HEATMAP COMPONENT
   ========================================================= */

interface HeatmapProps {
  cells: OverlayHeatmapCell[];
  onCellClick?: (contextType: ContextType, magnitude: DriftMagnitude) => void;
}

const OverlayHeatmap: React.FC<HeatmapProps> = ({ cells, onCellClick }) => {
  const contextTypes = [...new Set(cells.map((c) => c.contextType))];
  const magnitudes: DriftMagnitude[] = ['low', 'medium', 'high'];

  const getCellData = (ctx: ContextType, mag: DriftMagnitude) => {
    return cells.find((c) => c.contextType === ctx && c.driftMagnitude === mag);
  };

  return (
    <div style={styles.heatmapContainer}>
      <table style={styles.heatmapTable}>
        <thead>
          <tr>
            <th style={styles.heatmapHeader}>Context ↓ / Drift →</th>
            {magnitudes.map((mag) => (
              <th key={mag} style={styles.heatmapHeader}>
                {mag.toUpperCase()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {contextTypes.map((ctx) => (
            <tr key={ctx}>
              <td style={styles.heatmapRowHeader}>{ctx}</td>
              {magnitudes.map((mag) => {
                const cell = getCellData(ctx, mag);
                const density = cell?.density || 0;
                const count = cell?.count || 0;

                return (
                  <td
                    key={mag}
                    style={{
                      ...styles.heatmapCell,
                      backgroundColor: getDensityColor(density),
                    }}
                    onClick={() => onCellClick?.(ctx, mag)}
                    title={neutralDescription(ctx, mag, count)}
                  >
                    {count > 0 ? count : '–'}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <div style={styles.legend}>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendDot, backgroundColor: DENSITY_COLORS.none }} />
          <span>None</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendDot, backgroundColor: DENSITY_COLORS.low }} />
          <span>Low co-occurrence</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendDot, backgroundColor: DENSITY_COLORS.medium }} />
          <span>Medium co-occurrence</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendDot, backgroundColor: DENSITY_COLORS.high }} />
          <span>High co-occurrence</span>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   TIMELINE COMPONENT
   ========================================================= */

interface TimelineProps {
  data: OverlayDataPoint[];
}

const OverlayTimeline: React.FC<TimelineProps> = ({ data }) => {
  const [hoveredPoint, setHoveredPoint] = useState<OverlayDataPoint | null>(null);

  // Sort by timestamp
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) =>
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }, [data]);

  // Calculate positions
  const timeRange = useMemo(() => {
    if (sortedData.length === 0) return { min: 0, max: 0 };
    const times = sortedData.map((d) => new Date(d.timestamp).getTime());
    return {
      min: Math.min(...times),
      max: Math.max(...times),
    };
  }, [sortedData]);

  const getXPosition = (timestamp: string): number => {
    const time = new Date(timestamp).getTime();
    const range = timeRange.max - timeRange.min;
    if (range === 0) return 50;
    return ((time - timeRange.min) / range) * 100;
  };

  const getYPosition = (coOccurrence: number): number => {
    // Higher co-occurrence = higher on chart
    return 80 - coOccurrence * 60;
  };

  return (
    <div style={styles.timelineContainer}>
      <div style={{ color: '#666', fontSize: '11px', marginBottom: '8px' }}>
        Context + Drift Co-occurrence Timeline
      </div>

      {/* Axis */}
      <div style={styles.timelineAxis} />

      {/* Points */}
      {sortedData.map((point, index) => {
        const x = getXPosition(point.timestamp);
        const y = getYPosition(point.coOccurrenceScore);
        const magnitude = point.contextDrift?.magnitude || 'low';

        return (
          <div
            key={index}
            style={{
              ...styles.timelinePoint,
              left: `${x}%`,
              top: `${y}%`,
              backgroundColor: getMagnitudeColor(magnitude),
              transform: hoveredPoint === point
                ? 'translate(-50%, -50%) scale(1.5)'
                : 'translate(-50%, -50%)',
            }}
            onMouseEnter={() => setHoveredPoint(point)}
            onMouseLeave={() => setHoveredPoint(null)}
            title={`${point.contextType}: ${point.preferenceDrifts.length} preference drifts co-occurred`}
          />
        );
      })}

      {/* Hover tooltip */}
      {hoveredPoint && (
        <div
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: '#333',
            padding: '10px',
            borderRadius: '6px',
            fontSize: '12px',
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: '4px' }}>
            {hoveredPoint.contextType}
          </div>
          <div style={{ color: '#888' }}>
            {hoveredPoint.preferenceDrifts.length} preference drift(s) present during this context
          </div>
        </div>
      )}

      {/* Time labels */}
      <div
        style={{
          position: 'absolute',
          bottom: '8px',
          left: '16px',
          fontSize: '10px',
          color: '#666',
        }}
      >
        {new Date(timeRange.min).toLocaleDateString()}
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: '8px',
          right: '16px',
          fontSize: '10px',
          color: '#666',
        }}
      >
        {new Date(timeRange.max).toLocaleDateString()}
      </div>
    </div>
  );
};

/* =========================================================
   MAIN COMPONENT
   ========================================================= */

export const DriftContextOverlay: React.FC<DriftContextOverlayProps> = ({
  showTimeline = true,
  showHeatmap = true,
  sphereFilter,
  timeRangeDays = 30,
  compact = false,
  onCellClick,
  className,
}) => {
  const [timelineEnabled, setTimelineEnabled] = useState(showTimeline);
  const [heatmapEnabled, setHeatmapEnabled] = useState(showHeatmap);

  const { overlayData, heatmapCells, contextDriftResult } = useDriftContextOverlay({
    sphereFilter,
    timeRangeDays,
  });

  return (
    <div style={styles.container} className={className}>
      {/* Header */}
      <div style={styles.header}>
        <h3 style={styles.title}>Drift + Context Overlay</h3>
        <span style={styles.badge}>CORRELATION ONLY</span>
      </div>

      {/* Critical Disclaimer */}
      <div style={styles.disclaimer}>
        <strong>⚠️ IMPORTANT:</strong> This overlay shows CORRELATION only.
        <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
          <li>Correlation does NOT imply causation</li>
          <li>Visibility does NOT imply correction</li>
          <li>Awareness does NOT imply obligation</li>
        </ul>
      </div>

      {/* Controls */}
      {!compact && (
        <div style={styles.controls}>
          <div
            style={{
              ...styles.toggle,
              ...(timelineEnabled ? styles.toggleActive : {}),
            }}
            onClick={() => setTimelineEnabled(!timelineEnabled)}
          >
            <input
              type="checkbox"
              checked={timelineEnabled}
              onChange={() => {}}
              style={{ margin: 0 }}
            />
            <span>Timeline</span>
          </div>

          <div
            style={{
              ...styles.toggle,
              ...(heatmapEnabled ? styles.toggleActive : {}),
            }}
            onClick={() => setHeatmapEnabled(!heatmapEnabled)}
          >
            <input
              type="checkbox"
              checked={heatmapEnabled}
              onChange={() => {}}
              style={{ margin: 0 }}
            />
            <span>Heatmap</span>
          </div>
        </div>
      )}

      {/* Timeline Overlay */}
      {timelineEnabled && overlayData.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <OverlayTimeline data={overlayData} />
        </div>
      )}

      {/* Heatmap Overlay */}
      {heatmapEnabled && heatmapCells.length > 0 && (
        <OverlayHeatmap cells={heatmapCells} onCellClick={onCellClick} />
      )}

      {/* Summary */}
      <div
        style={{
          backgroundColor: '#252540',
          padding: '12px',
          borderRadius: '8px',
          fontSize: '13px',
          marginTop: '16px',
        }}
      >
        <div style={{ marginBottom: '8px', color: '#aaa' }}>
          Contexts Analyzed: {contextDriftResult.summary.totalContextsAnalyzed}
        </div>
        <div style={{ color: '#888', fontSize: '12px' }}>
          Most Active: {contextDriftResult.mostActiveContexts.slice(0, 3).join(', ')}
        </div>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <div style={{ marginBottom: '4px' }}>
          Overlay is strictly READ-ONLY. No automation. Optional and dismissible.
        </div>
        {AGENT_CONFIRMATION}
      </div>
    </div>
  );
};

/* =========================================================
   EXPORTS
   ========================================================= */

export default DriftContextOverlay;
