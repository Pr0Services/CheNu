/* =====================================================
   CHE·NU — DRIFT VISUALIZATION DASHBOARD
   Status: INFORMATIONAL ONLY — NO AUTHORITY
   
   📜 PURPOSE:
   Combined view of drift timeline and heatmap.
   Makes preference evolution VISIBLE, NOT CORRECTED.
   
   📜 RULES:
   - Visualization cannot modify data
   - Visualization is user-dismissible
   - Visualization can be disabled per session
   - Neutral mode hides historical bias
   ===================================================== */

import React, { useState, useCallback } from 'react';
import { DriftTimelineView } from './DriftTimeline';
import { DriftHeatmapView } from './DriftHeatmap';
import {
  type DriftTimelinePoint,
  type HeatmapCell,
  type DriftVisualizationConfig,
  type ScopeLevel,
  DEFAULT_VISUALIZATION_CONFIG,
  DRIFT_VISUALIZATION_CONFIRMATION,
} from './driftVisualization.types';

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
    maxWidth: '1200px',
  } as React.CSSProperties,

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: '1px solid #2a2a3a',
  } as React.CSSProperties,

  titleSection: {
    flex: 1,
  } as React.CSSProperties,

  title: {
    fontSize: '20px',
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

  controls: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  } as React.CSSProperties,

  toggle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    color: '#888',
  } as React.CSSProperties,

  toggleSwitch: {
    width: '36px',
    height: '20px',
    backgroundColor: '#2d2d44',
    borderRadius: '10px',
    cursor: 'pointer',
    position: 'relative' as const,
    transition: 'background-color 0.2s',
  } as React.CSSProperties,

  toggleKnob: {
    width: '16px',
    height: '16px',
    backgroundColor: '#fff',
    borderRadius: '50%',
    position: 'absolute' as const,
    top: '2px',
    transition: 'left 0.2s',
  } as React.CSSProperties,

  dismissButton: {
    backgroundColor: 'transparent',
    border: '1px solid #444',
    color: '#888',
    borderRadius: '6px',
    padding: '6px 12px',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  } as React.CSSProperties,

  disclaimer: {
    backgroundColor: '#1a1a2e',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    borderLeft: '4px solid #4a4a6a',
  } as React.CSSProperties,

  disclaimerTitle: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#aaa',
    marginBottom: '4px',
  } as React.CSSProperties,

  disclaimerText: {
    fontSize: '11px',
    color: '#666',
    lineHeight: 1.5,
  } as React.CSSProperties,

  tabs: {
    display: 'flex',
    gap: '4px',
    marginBottom: '20px',
    backgroundColor: '#1a1a2e',
    padding: '4px',
    borderRadius: '8px',
  } as React.CSSProperties,

  tab: {
    flex: 1,
    padding: '10px 16px',
    fontSize: '13px',
    fontWeight: 500,
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  } as React.CSSProperties,

  tabActive: {
    backgroundColor: '#252540',
    color: '#fff',
  } as React.CSSProperties,

  tabInactive: {
    backgroundColor: 'transparent',
    color: '#888',
  } as React.CSSProperties,

  viewContainer: {
    minHeight: '400px',
  } as React.CSSProperties,

  splitView: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
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
    fontStyle: 'italic',
  } as React.CSSProperties,

  detailPanel: {
    backgroundColor: '#1a1a2e',
    borderRadius: '12px',
    padding: '16px',
    marginTop: '16px',
  } as React.CSSProperties,

  detailTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#fff',
    marginBottom: '12px',
  } as React.CSSProperties,

  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid #252540',
    fontSize: '12px',
  } as React.CSSProperties,

  detailLabel: {
    color: '#888',
  } as React.CSSProperties,

  detailValue: {
    color: '#fff',
  } as React.CSSProperties,

  dismissedState: {
    textAlign: 'center' as const,
    padding: '60px 20px',
    color: '#666',
  } as React.CSSProperties,
};

/* =========================================================
   TYPES
   ========================================================= */

type ViewMode = 'timeline' | 'heatmap' | 'split';

export interface DriftVisualizationDashboardProps {
  /** Initial view mode */
  initialView?: ViewMode;

  /** Config overrides */
  config?: Partial<DriftVisualizationConfig>;

  /** Days to analyze */
  days?: number;

  /** On dismiss callback */
  onDismiss?: () => void;

  /** On disable callback */
  onDisable?: () => void;

  /** Custom class name */
  className?: string;
}

/* =========================================================
   COMPONENT
   ========================================================= */

export const DriftVisualizationDashboard: React.FC<DriftVisualizationDashboardProps> = ({
  initialView = 'split',
  config: configOverrides,
  days = 30,
  onDismiss,
  onDisable,
  className,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>(initialView);
  const [neutralMode, setNeutralMode] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<DriftTimelinePoint | null>(null);
  const [selectedCell, setSelectedCell] = useState<HeatmapCell | null>(null);

  const config: DriftVisualizationConfig = {
    ...DEFAULT_VISUALIZATION_CONFIG,
    ...configOverrides,
    neutralMode,
  };

  const handleDismiss = useCallback(() => {
    setIsDismissed(true);
    onDismiss?.();
  }, [onDismiss]);

  const handleRestore = useCallback(() => {
    setIsDismissed(false);
  }, []);

  const handlePointClick = useCallback((point: DriftTimelinePoint) => {
    setSelectedPoint(point);
    setSelectedCell(null);
  }, []);

  const handleCellClick = useCallback((cell: HeatmapCell) => {
    setSelectedCell(cell);
    setSelectedPoint(null);
  }, []);

  // Dismissed state
  if (isDismissed) {
    return (
      <div style={{ ...styles.container, ...styles.dismissedState }} className={className}>
        <p>Drift visualization dismissed for this session.</p>
        <button
          onClick={handleRestore}
          style={{
            ...styles.dismissButton,
            marginTop: '12px',
            borderColor: '#666',
            color: '#aaa',
          }}
        >
          Restore Visualization
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container} className={className}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.titleSection}>
          <h2 style={styles.title}>👁️ Preference Evolution Viewer</h2>
          <p style={styles.subtitle}>
            Observe how your preferences have changed over time
          </p>
        </div>

        <div style={styles.controls}>
          {/* Neutral Mode Toggle */}
          <div style={styles.toggle}>
            <span>Neutral Mode</span>
            <div
              style={{
                ...styles.toggleSwitch,
                backgroundColor: neutralMode ? '#4a6a4a' : '#2d2d44',
              }}
              onClick={() => setNeutralMode(!neutralMode)}
              role="switch"
              aria-checked={neutralMode}
            >
              <div
                style={{
                  ...styles.toggleKnob,
                  left: neutralMode ? '18px' : '2px',
                }}
              />
            </div>
          </div>

          {/* Dismiss Button */}
          {config.dismissible && (
            <button
              style={styles.dismissButton}
              onClick={handleDismiss}
            >
              Dismiss
            </button>
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <div style={styles.disclaimer}>
        <div style={styles.disclaimerTitle}>ℹ️ About This Visualization</div>
        <div style={styles.disclaimerText}>
          This system shows preference <strong>evolution</strong> over time. It does not judge,
          correct, or recommend changes. You are observing natural variation in your working
          patterns. <strong>No action is required or implied.</strong>
        </div>
      </div>

      {/* View Tabs */}
      <div style={styles.tabs}>
        <button
          style={{
            ...styles.tab,
            ...(viewMode === 'timeline' ? styles.tabActive : styles.tabInactive),
          }}
          onClick={() => setViewMode('timeline')}
        >
          📊 Timeline
        </button>
        <button
          style={{
            ...styles.tab,
            ...(viewMode === 'heatmap' ? styles.tabActive : styles.tabInactive),
          }}
          onClick={() => setViewMode('heatmap')}
        >
          🗺️ Heatmap
        </button>
        <button
          style={{
            ...styles.tab,
            ...(viewMode === 'split' ? styles.tabActive : styles.tabInactive),
          }}
          onClick={() => setViewMode('split')}
        >
          ⊞ Both
        </button>
      </div>

      {/* View Container */}
      <div style={styles.viewContainer}>
        {viewMode === 'timeline' && (
          <DriftTimelineView
            days={days}
            config={config.timeline}
            maxHeight="500px"
            onPointClick={handlePointClick}
          />
        )}

        {viewMode === 'heatmap' && (
          <DriftHeatmapView
            days={days}
            config={config.heatmap}
            onCellClick={handleCellClick}
          />
        )}

        {viewMode === 'split' && (
          <div style={styles.splitView}>
            <DriftTimelineView
              days={days}
              config={config.timeline}
              maxHeight="350px"
              onPointClick={handlePointClick}
            />
            <DriftHeatmapView
              days={days}
              config={config.heatmap}
              onCellClick={handleCellClick}
            />
          </div>
        )}
      </div>

      {/* Detail Panel */}
      {(selectedPoint || selectedCell) && (
        <div style={styles.detailPanel}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={styles.detailTitle}>
              {selectedPoint ? '📍 Point Details' : '🔍 Cell Details'}
            </div>
            <button
              onClick={() => {
                setSelectedPoint(null);
                setSelectedCell(null);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#666',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              ✕
            </button>
          </div>

          {selectedPoint && (
            <>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Preference</span>
                <span style={styles.detailValue}>{selectedPoint.preferenceKey}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Direction</span>
                <span style={styles.detailValue}>{selectedPoint.direction}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Magnitude</span>
                <span style={styles.detailValue}>{selectedPoint.driftMagnitude}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Confidence</span>
                <span style={styles.detailValue}>{(selectedPoint.confidence * 100).toFixed(0)}%</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Historical Pattern</span>
                <span style={styles.detailValue}>{selectedPoint.historicalPattern || 'N/A'}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Recent Pattern</span>
                <span style={styles.detailValue}>{selectedPoint.recentPattern || 'N/A'}</span>
              </div>
            </>
          )}

          {selectedCell && (
            <>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Category</span>
                <span style={styles.detailValue}>{selectedCell.category}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Scope</span>
                <span style={styles.detailValue}>{selectedCell.scope}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Variations Observed</span>
                <span style={styles.detailValue}>{selectedCell.driftCount}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Average Magnitude</span>
                <span style={styles.detailValue}>{selectedCell.avgMagnitude}</span>
              </div>
              {selectedCell.primaryDirection && (
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Primary Direction</span>
                  <span style={styles.detailValue}>{selectedCell.primaryDirection}</span>
                </div>
              )}
            </>
          )}

          <div style={{ marginTop: '12px', fontSize: '11px', color: '#555' }}>
            This is observational data only. No action implied.
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={styles.footer}>
        <p style={styles.footerText}>
          {DRIFT_VISUALIZATION_CONFIRMATION}
        </p>
      </div>
    </div>
  );
};

/* =========================================================
   EXPORTS
   ========================================================= */

export default DriftVisualizationDashboard;
