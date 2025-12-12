/* =====================================================
   CHE·NU — DRIFT HEATMAP COMPONENT
   Status: INFORMATIONAL ONLY — NO AUTHORITY
   
   📜 PURPOSE:
   Show WHERE drift is concentrated across the system.
   
   📜 RULES:
   - Color intensity only (no scores)
   - No "good/bad" labeling
   - Comparative only
   - NO alerts
   ===================================================== */

import React, { useState, useMemo, useCallback } from 'react';
import {
  type DriftHeatmap,
  type HeatmapCell,
  type HeatmapViewConfig,
  type PreferenceCategory,
  type ScopeLevel,
  type HeatIntensity,
  DEFAULT_HEATMAP_CONFIG,
  DRIFT_VISUALIZATION_CONFIRMATION,
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

  disclaimer: {
    backgroundColor: '#1e1e32',
    padding: '10px 12px',
    borderRadius: '6px',
    fontSize: '11px',
    color: '#666',
    marginBottom: '16px',
    borderLeft: '3px solid #4a4a6a',
  } as React.CSSProperties,

  heatmapContainer: {
    display: 'flex',
    gap: '4px',
  } as React.CSSProperties,

  yAxisLabels: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
    paddingTop: '28px',
  } as React.CSSProperties,

  yLabel: {
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: '8px',
    fontSize: '11px',
    color: '#888',
    textTransform: 'capitalize' as const,
  } as React.CSSProperties,

  gridContainer: {
    flex: 1,
  } as React.CSSProperties,

  xAxisLabels: {
    display: 'flex',
    gap: '4px',
    marginBottom: '4px',
  } as React.CSSProperties,

  xLabel: {
    flex: 1,
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    color: '#888',
    textTransform: 'capitalize' as const,
  } as React.CSSProperties,

  grid: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  } as React.CSSProperties,

  row: {
    display: 'flex',
    gap: '4px',
  } as React.CSSProperties,

  cell: {
    flex: 1,
    height: '48px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    position: 'relative' as const,
  } as React.CSSProperties,

  cellValue: {
    fontSize: '12px',
    fontWeight: 500,
    color: 'rgba(255,255,255,0.7)',
  } as React.CSSProperties,

  tooltip: {
    position: 'absolute' as const,
    bottom: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#1a1a2e',
    border: '1px solid #444',
    borderRadius: '6px',
    padding: '8px 12px',
    fontSize: '11px',
    whiteSpace: 'nowrap' as const,
    zIndex: 100,
    marginBottom: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  } as React.CSSProperties,

  legend: {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    marginTop: '16px',
    paddingTop: '12px',
    borderTop: '1px solid #333',
  } as React.CSSProperties,

  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '11px',
    color: '#888',
  } as React.CSSProperties,

  legendColor: {
    width: '16px',
    height: '16px',
    borderRadius: '4px',
  } as React.CSSProperties,

  footer: {
    marginTop: '12px',
    fontSize: '10px',
    color: '#444',
    textAlign: 'center' as const,
  } as React.CSSProperties,

  emptyState: {
    textAlign: 'center' as const,
    padding: '40px 20px',
    color: '#666',
  } as React.CSSProperties,
};

/* =========================================================
   COLOR PALETTES (All neutral — no alarm colors)
   ========================================================= */

const colorPalettes: Record<string, string[]> = {
  neutral: [
    '#2d2d44', // 0 - no drift
    '#3a3a5a', // 1 - minimal
    '#4a4a6a', // 2 - low
    '#5a5a7a', // 3 - moderate
    '#6a6a8a', // 4 - notable
    '#7a7a9a', // 5 - significant
  ],
  monochrome: [
    '#252530',
    '#353545',
    '#454555',
    '#555565',
    '#656575',
    '#757585',
  ],
  gradient: [
    '#1a2a3a',
    '#2a3a4a',
    '#3a4a5a',
    '#4a5a6a',
    '#5a6a7a',
    '#6a7a8a',
  ],
};

/* =========================================================
   CATEGORY LABELS (Neutral language)
   ========================================================= */

const categoryLabels: Record<PreferenceCategory, string> = {
  mode: 'Working Mode',
  depth: 'Detail Level',
  format: 'Output Format',
  rhythm: 'Pace',
  risk: 'Risk Tolerance',
};

const scopeLabels: Record<ScopeLevel, string> = {
  global: 'Global',
  sphere: 'Sphere',
  project: 'Project',
  session: 'Session',
};

/* =========================================================
   HOOK: Generate Heatmap Data
   ========================================================= */

export function useDriftHeatmap(options: {
  days?: number;
}): {
  heatmap: DriftHeatmap | null;
  loading: boolean;
  refresh: () => void;
} {
  const [heatmap, setHeatmap] = useState<DriftHeatmap | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setLoading(true);

    try {
      const result = driftDetector.analyze();
      const categories: PreferenceCategory[] = ['mode', 'depth', 'format', 'rhythm', 'risk'];
      const scopes: ScopeLevel[] = ['global', 'sphere', 'project', 'session'];

      // Build cells
      const cells: HeatmapCell[] = [];

      for (const scope of scopes) {
        for (const category of categories) {
          // Find matching reports
          const matching = result.reports.filter((r) => {
            const scopeMatch = r.scope === scope;
            const categoryMatch = r.preferenceKey.toLowerCase().includes(category) ||
              (category === 'mode' && r.preferenceKey.includes('working')) ||
              (category === 'depth' && r.preferenceKey.includes('detail')) ||
              (category === 'format' && r.preferenceKey.includes('output')) ||
              (category === 'rhythm' && r.preferenceKey.includes('pace')) ||
              (category === 'risk' && r.preferenceKey.includes('risk'));
            return scopeMatch && (categoryMatch || Math.random() > 0.7); // Simulated
          });

          const driftingReports = matching.filter((r) => r.driftDetected);
          const driftCount = driftingReports.length;

          // Calculate intensity (0-5)
          let intensity: HeatIntensity = 0;
          if (driftCount > 0) {
            const hasHigh = driftingReports.some((r) => r.magnitude === 'high');
            const hasMedium = driftingReports.some((r) => r.magnitude === 'medium');

            if (hasHigh) intensity = driftCount >= 3 ? 5 : 4;
            else if (hasMedium) intensity = driftCount >= 2 ? 3 : 2;
            else intensity = 1;
          }

          // Average magnitude
          const avgMagnitude = driftCount === 0 ? 'none' :
            driftingReports.some((r) => r.magnitude === 'high') ? 'high' :
            driftingReports.some((r) => r.magnitude === 'medium') ? 'medium' : 'low';

          cells.push({
            category,
            scope,
            intensity,
            driftCount,
            avgMagnitude,
            primaryDirection: driftingReports[0]?.direction,
            preferenceIds: driftingReports.map((r) => r.preferenceId),
          });
        }
      }

      const now = new Date();
      const daysAgo = new Date(now.getTime() - (options.days || 30) * 24 * 60 * 60 * 1000);

      setHeatmap({
        id: `heatmap-${Date.now()}`,
        cells,
        categories,
        scopes,
        timeWindow: {
          start: daysAgo.toISOString(),
          end: now.toISOString(),
          windowDays: options.days || 30,
        },
        generatedAt: now.toISOString(),
      });
    } catch (error) {
      console.error('Failed to generate heatmap:', error);
    } finally {
      setLoading(false);
    }
  }, [options.days]);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  return { heatmap, loading, refresh };
}

/* =========================================================
   PROPS
   ========================================================= */

export interface DriftHeatmapProps {
  /** Days to analyze */
  days?: number;

  /** Config overrides */
  config?: Partial<HeatmapViewConfig>;

  /** On cell click */
  onCellClick?: (cell: HeatmapCell) => void;

  /** Custom class name */
  className?: string;
}

/* =========================================================
   COMPONENT
   ========================================================= */

export const DriftHeatmapView: React.FC<DriftHeatmapProps> = ({
  days = 30,
  config: configOverrides,
  onCellClick,
  className,
}) => {
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  const config = useMemo(() => ({
    ...DEFAULT_HEATMAP_CONFIG,
    ...configOverrides,
  }), [configOverrides]);

  const { heatmap, loading, refresh } = useDriftHeatmap({ days });

  const colors = colorPalettes[config.colorScheme];

  const getCellKey = (category: PreferenceCategory, scope: ScopeLevel) =>
    `${category}-${scope}`;

  const getCell = (category: PreferenceCategory, scope: ScopeLevel): HeatmapCell | undefined => {
    return heatmap?.cells.find(
      (c) => c.category === category && c.scope === scope
    );
  };

  const getCellColor = (intensity: HeatIntensity): string => {
    return colors[intensity] || colors[0];
  };

  const cellSizes: Record<string, string> = {
    small: '36px',
    medium: '48px',
    large: '64px',
  };

  return (
    <div style={styles.container} className={className}>
      {/* Header */}
      <div style={styles.header}>
        <h3 style={styles.title}>🗺️ Preference Drift Distribution</h3>
        <button
          onClick={refresh}
          style={{
            backgroundColor: '#252540',
            color: '#e0e0e0',
            border: '1px solid #333',
            borderRadius: '6px',
            padding: '6px 12px',
            fontSize: '12px',
            cursor: 'pointer',
          }}
        >
          ↻ Refresh
        </button>
      </div>

      {/* Disclaimer */}
      <div style={styles.disclaimer}>
        ℹ️ This heatmap shows drift <strong>concentration</strong>, not severity.
        Darker cells indicate more observed <strong>variation</strong>.
      </div>

      {loading ? (
        <div style={styles.emptyState}>Loading heatmap...</div>
      ) : !heatmap ? (
        <div style={styles.emptyState}>No data available</div>
      ) : (
        <>
          {/* Heatmap Grid */}
          <div style={styles.heatmapContainer}>
            {/* Y-axis labels */}
            <div style={styles.yAxisLabels}>
              {heatmap.scopes.map((scope) => (
                <div
                  key={scope}
                  style={{
                    ...styles.yLabel,
                    height: cellSizes[config.cellSize],
                  }}
                >
                  {scopeLabels[scope]}
                </div>
              ))}
            </div>

            {/* Grid */}
            <div style={styles.gridContainer}>
              {/* X-axis labels */}
              <div style={styles.xAxisLabels}>
                {heatmap.categories.map((category) => (
                  <div key={category} style={styles.xLabel}>
                    {categoryLabels[category]}
                  </div>
                ))}
              </div>

              {/* Cells */}
              <div style={styles.grid}>
                {heatmap.scopes.map((scope) => (
                  <div key={scope} style={styles.row}>
                    {heatmap.categories.map((category) => {
                      const cell = getCell(category, scope);
                      const cellKey = getCellKey(category, scope);
                      const isHovered = hoveredCell === cellKey;

                      return (
                        <div
                          key={cellKey}
                          style={{
                            ...styles.cell,
                            height: cellSizes[config.cellSize],
                            backgroundColor: getCellColor(cell?.intensity || 0),
                            transform: isHovered && config.animateHover
                              ? 'scale(1.05)'
                              : 'scale(1)',
                            boxShadow: isHovered
                              ? '0 4px 12px rgba(0,0,0,0.3)'
                              : 'none',
                          }}
                          onMouseEnter={() => setHoveredCell(cellKey)}
                          onMouseLeave={() => setHoveredCell(null)}
                          onClick={() => cell && onCellClick?.(cell)}
                          role="button"
                          tabIndex={0}
                        >
                          {/* Value */}
                          {config.showValues && cell && cell.driftCount > 0 && (
                            <span style={styles.cellValue}>
                              {cell.driftCount}
                            </span>
                          )}

                          {/* Tooltip */}
                          {config.showTooltips && isHovered && cell && (
                            <div style={styles.tooltip}>
                              <div style={{ fontWeight: 500, marginBottom: '4px' }}>
                                {categoryLabels[category]} • {scopeLabels[scope]}
                              </div>
                              <div>Variations: {cell.driftCount}</div>
                              {cell.primaryDirection && (
                                <div>Direction: {cell.primaryDirection}</div>
                              )}
                              <div style={{ marginTop: '4px', color: '#555' }}>
                                Click to inspect
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div style={styles.legend}>
            <div style={styles.legendItem}>
              <div style={{ ...styles.legendColor, backgroundColor: colors[0] }} />
              <span>No change</span>
            </div>
            <div style={styles.legendItem}>
              <div style={{ ...styles.legendColor, backgroundColor: colors[2] }} />
              <span>Some variation</span>
            </div>
            <div style={styles.legendItem}>
              <div style={{ ...styles.legendColor, backgroundColor: colors[5] }} />
              <span>Notable variation</span>
            </div>
          </div>

          {/* Footer */}
          <div style={styles.footer}>
            Analyzed: Last {heatmap.timeWindow.windowDays} days
            <br />
            <span style={{ fontSize: '9px', color: '#333' }}>
              {DRIFT_VISUALIZATION_CONFIRMATION.split('\n')[0]}
            </span>
          </div>
        </>
      )}
    </div>
  );
};

/* =========================================================
   EXPORTS
   ========================================================= */

export default DriftHeatmapView;
