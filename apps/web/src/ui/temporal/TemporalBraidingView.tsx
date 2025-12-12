/* =====================================================
   CHE·NU — TEMPORAL BRAIDING VIEW
   Status: OBSERVATIONAL TEMPORAL LAYER
   Authority: NONE
   
   📜 PURPOSE:
   Visualize how multiple timelines coexist without
   being merged into a single authoritative sequence.
   
   📜 USER MAY:
   - Enable/disable strands
   - Align strands by timeframe
   - Zoom in/out
   - Pause at any moment
   
   📜 SYSTEM MUST NOT:
   - Highlight "key moments"
   - Propose interpretations
   - Compress timelines automatically
   ===================================================== */

import React, { useState, useMemo, useCallback, useRef } from 'react';
import {
  type TemporalBraiding,
  type TemporalStrand,
  type BraidingConfig,
  type AlignmentMode,
  type StrandType,
  type PausedMoment,
  STRAND_TYPE_COLORS,
  DEFAULT_BRAIDING_CONFIG,
  TEMPORAL_BRAIDING_DECLARATION,
  BRAIDING_FAILSAFES,
  ALLOWED_TEMPORAL_TERMS,
} from './temporalBraiding.types';
import {
  generateBraiding,
  computeStrandLayout,
  computeStrandPath,
  getPausedMoment,
  getBraidingSummary,
  getStrand,
  getStrandOverlaps,
  createStrand,
  createPoint,
} from './temporalBraidingEngine';
import { AGENT_CONFIRMATION } from '../../core/agents/internalAgentContext';

/* =========================================================
   PROPS
   ========================================================= */

export interface TemporalBraidingViewProps {
  /** Input strands to visualize */
  strands: TemporalStrand[];

  /** Initial configuration */
  initialConfig?: Partial<BraidingConfig>;

  /** Width of the view */
  width?: number;

  /** Height of the view */
  height?: number;

  /** On strand toggle callback */
  onStrandToggle?: (strandId: string, visible: boolean) => void;

  /** On pause callback */
  onPause?: (moment: PausedMoment) => void;

  /** Custom class name */
  className?: string;
}

/* =========================================================
   STYLES
   ========================================================= */

const styles = {
  container: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    backgroundColor: '#0a0a1a',
    borderRadius: '12px',
    overflow: 'hidden',
    position: 'relative' as const,
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: '1px solid #1a1a2e',
    backgroundColor: '#0f0f1f',
  },

  title: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#fff',
    margin: 0,
  },

  badge: {
    fontSize: '10px',
    padding: '4px 8px',
    borderRadius: '12px',
    backgroundColor: '#1a1a2e',
    color: '#666',
  },

  disclaimer: {
    padding: '12px 20px',
    backgroundColor: '#0d0d1a',
    fontSize: '11px',
    color: '#555',
    borderBottom: '1px solid #1a1a2e',
  },

  controls: {
    display: 'flex',
    gap: '8px',
    padding: '12px 20px',
    backgroundColor: '#0f0f1f',
    borderBottom: '1px solid #1a1a2e',
    flexWrap: 'wrap' as const,
    alignItems: 'center',
  },

  controlButton: {
    padding: '6px 12px',
    fontSize: '12px',
    backgroundColor: '#1a1a2e',
    color: '#aaa',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },

  controlButtonActive: {
    backgroundColor: '#2a2a4e',
    color: '#fff',
  },

  strandToggle: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    fontSize: '11px',
    backgroundColor: '#1a1a2e',
    color: '#888',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },

  strandToggleActive: {
    backgroundColor: '#2a2a4e',
    color: '#fff',
  },

  strandDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },

  canvas: {
    position: 'relative' as const,
    backgroundColor: '#050510',
    overflow: 'hidden',
  },

  svg: {
    width: '100%',
    height: '100%',
  },

  strandLabel: {
    fontSize: '10px',
    fill: '#666',
  },

  timeAxis: {
    stroke: '#1a1a2e',
    strokeWidth: 1,
  },

  timeLabel: {
    fontSize: '9px',
    fill: '#444',
  },

  pauseLine: {
    stroke: '#ff6b6b',
    strokeWidth: 1,
    strokeDasharray: '4,4',
  },

  pausedPanel: {
    position: 'absolute' as const,
    top: '16px',
    right: '16px',
    width: '240px',
    backgroundColor: '#1a1a2e',
    borderRadius: '8px',
    padding: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
  },

  pausedPanelTitle: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#fff',
    marginBottom: '12px',
  },

  pausedPanelItem: {
    fontSize: '11px',
    color: '#888',
    marginBottom: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  overlapIndicator: {
    fill: 'rgba(255, 255, 255, 0.05)',
    stroke: 'none',
  },

  footer: {
    padding: '12px 20px',
    borderTop: '1px solid #1a1a2e',
    fontSize: '10px',
    color: '#444',
    textAlign: 'center' as const,
    backgroundColor: '#0a0a14',
  },
};

/* =========================================================
   HOOKS
   ========================================================= */

/**
 * Hook for temporal braiding state management.
 */
export function useTemporalBraiding(
  strands: TemporalStrand[],
  initialConfig: Partial<BraidingConfig> = {}
) {
  const [config, setConfig] = useState<BraidingConfig>({
    ...DEFAULT_BRAIDING_CONFIG,
    ...initialConfig,
    visibleStrands: initialConfig.visibleStrands || strands.map((s) => s.strandId),
  });

  const [pausedAt, setPausedAt] = useState<string | null>(null);

  // Generate braiding
  const braiding = useMemo(
    () => generateBraiding(strands, config),
    [strands, config]
  );

  // Paused moment data
  const pausedMoment = useMemo(() => {
    if (!pausedAt) return null;
    return getPausedMoment(braiding, pausedAt);
  }, [braiding, pausedAt]);

  // Actions
  const toggleStrand = useCallback((strandId: string) => {
    setConfig((prev) => {
      const isVisible = prev.visibleStrands.includes(strandId);
      return {
        ...prev,
        visibleStrands: isVisible
          ? prev.visibleStrands.filter((id) => id !== strandId)
          : [...prev.visibleStrands, strandId],
      };
    });
  }, []);

  const setAlignmentMode = useCallback((mode: AlignmentMode) => {
    setConfig((prev) => ({ ...prev, alignmentMode: mode }));
  }, []);

  const zoomIn = useCallback(() => {
    setConfig((prev) => ({
      ...prev,
      timeRange: {
        ...prev.timeRange,
        zoomLevel: Math.min(prev.timeRange.zoomLevel * 1.5, 10),
      },
    }));
  }, []);

  const zoomOut = useCallback(() => {
    setConfig((prev) => ({
      ...prev,
      timeRange: {
        ...prev.timeRange,
        zoomLevel: Math.max(prev.timeRange.zoomLevel / 1.5, 0.1),
      },
    }));
  }, []);

  const pause = useCallback((timestamp: string) => {
    setPausedAt(timestamp);
    setConfig((prev) => ({ ...prev, paused: true }));
  }, []);

  const resume = useCallback(() => {
    setPausedAt(null);
    setConfig((prev) => ({ ...prev, paused: false }));
  }, []);

  const resetView = useCallback(() => {
    setConfig((prev) => ({
      ...prev,
      timeRange: {
        ...prev.timeRange,
        zoomLevel: 1.0,
        panOffset: 0,
      },
    }));
    setPausedAt(null);
  }, []);

  return {
    braiding,
    config,
    pausedAt,
    pausedMoment,
    toggleStrand,
    setAlignmentMode,
    zoomIn,
    zoomOut,
    pause,
    resume,
    resetView,
  };
}

/* =========================================================
   SUB-COMPONENTS
   ========================================================= */

interface StrandRibbonProps {
  strand: TemporalStrand;
  braiding: TemporalBraiding;
  yPosition: number;
  viewWidth: number;
}

const StrandRibbon: React.FC<StrandRibbonProps> = ({
  strand,
  braiding,
  yPosition,
  viewWidth,
}) => {
  const pathPoints = computeStrandPath(strand, braiding, viewWidth, yPosition);

  if (pathPoints.length < 2) return null;

  // Generate smooth ribbon path
  const topPath = pathPoints.map((p, i) => {
    const cmd = i === 0 ? 'M' : 'L';
    return `${cmd} ${p.x} ${p.y - p.width / 2}`;
  }).join(' ');

  const bottomPath = [...pathPoints].reverse().map((p, i) => {
    const cmd = i === 0 ? 'L' : 'L';
    return `${cmd} ${p.x} ${p.y + p.width / 2}`;
  }).join(' ');

  const fullPath = `${topPath} ${bottomPath} Z`;

  // Average opacity
  const avgOpacity = pathPoints.reduce((sum, p) => sum + p.opacity, 0) / pathPoints.length;

  return (
    <g>
      {/* Ribbon fill */}
      <path
        d={fullPath}
        fill={strand.color}
        fillOpacity={avgOpacity * 0.6}
        stroke="none"
      />

      {/* Ribbon outline */}
      <path
        d={topPath}
        fill="none"
        stroke={strand.color}
        strokeWidth={1.5}
        strokeOpacity={avgOpacity * 0.8}
      />
      <path
        d={pathPoints.map((p, i) => {
          const cmd = i === 0 ? 'M' : 'L';
          return `${cmd} ${p.x} ${p.y + p.width / 2}`;
        }).join(' ')}
        fill="none"
        stroke={strand.color}
        strokeWidth={1.5}
        strokeOpacity={avgOpacity * 0.8}
      />

      {/* Strand label */}
      <text
        x={20}
        y={yPosition + 4}
        style={styles.strandLabel}
      >
        {strand.name}
      </text>
    </g>
  );
};

interface TimeAxisProps {
  braiding: TemporalBraiding;
  viewWidth: number;
  viewHeight: number;
}

const TimeAxis: React.FC<TimeAxisProps> = ({ braiding, viewWidth, viewHeight }) => {
  const startTime = new Date(braiding.config.timeRange.start).getTime();
  const endTime = new Date(braiding.config.timeRange.end).getTime();
  const duration = endTime - startTime;

  // Generate time markers
  const markerCount = 5;
  const markers = [];

  for (let i = 0; i <= markerCount; i++) {
    const ratio = i / markerCount;
    const time = new Date(startTime + duration * ratio);
    const x = 40 + ratio * (viewWidth - 80);

    markers.push({
      x,
      label: time.toLocaleDateString('fr-CA', { month: 'short', day: 'numeric' }),
    });
  }

  return (
    <g>
      {/* Axis line */}
      <line
        x1={40}
        y1={viewHeight - 30}
        x2={viewWidth - 40}
        y2={viewHeight - 30}
        style={styles.timeAxis}
      />

      {/* Markers */}
      {markers.map((marker, i) => (
        <g key={i}>
          <line
            x1={marker.x}
            y1={viewHeight - 34}
            x2={marker.x}
            y2={viewHeight - 26}
            style={styles.timeAxis}
          />
          <text
            x={marker.x}
            y={viewHeight - 14}
            textAnchor="middle"
            style={styles.timeLabel}
          >
            {marker.label}
          </text>
        </g>
      ))}
    </g>
  );
};

/* =========================================================
   MAIN COMPONENT
   ========================================================= */

export const TemporalBraidingView: React.FC<TemporalBraidingViewProps> = ({
  strands,
  initialConfig,
  width = 800,
  height = 500,
  onStrandToggle,
  onPause,
  className,
}) => {
  const {
    braiding,
    config,
    pausedAt,
    pausedMoment,
    toggleStrand,
    setAlignmentMode,
    zoomIn,
    zoomOut,
    pause,
    resume,
    resetView,
  } = useTemporalBraiding(strands, initialConfig);

  const canvasRef = useRef<SVGSVGElement>(null);

  // Compute strand layouts
  const strandLayout = useMemo(
    () => computeStrandLayout(braiding, height - 60, 60),
    [braiding, height]
  );

  // Handle canvas click for pause
  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;

      // Convert X to timestamp
      const padding = 40;
      const usableWidth = width - padding * 2;
      const ratio = (x - padding) / usableWidth;

      if (ratio < 0 || ratio > 1) return;

      const startTime = new Date(braiding.config.timeRange.start).getTime();
      const endTime = new Date(braiding.config.timeRange.end).getTime();
      const timestamp = new Date(startTime + (endTime - startTime) * ratio).toISOString();

      pause(timestamp);

      if (onPause) {
        onPause(getPausedMoment(braiding, timestamp));
      }
    },
    [braiding, width, pause, onPause]
  );

  // Alignment modes
  const alignmentModes: { key: AlignmentMode; label: string }[] = [
    { key: 'absolute', label: 'Absolute' },
    { key: 'relative', label: 'Relative' },
    { key: 'normalized', label: 'Normalized' },
  ];

  return (
    <div style={{ ...styles.container, width }} className={className}>
      {/* Header */}
      <div style={styles.header}>
        <h3 style={styles.title}>Temporal Braiding</h3>
        <span style={styles.badge}>OBSERVATION ONLY</span>
      </div>

      {/* Disclaimer */}
      <div style={styles.disclaimer}>
        ⚠️ Strands flow independently. Overlaps indicate coexistence, NOT causation.
        No strand has priority.
      </div>

      {/* Strand toggles */}
      <div style={styles.controls}>
        <span style={{ fontSize: '11px', color: '#666', marginRight: '8px' }}>
          Strands:
        </span>
        {braiding.strands.map((strand) => {
          const isVisible = config.visibleStrands.includes(strand.strandId);
          return (
            <button
              key={strand.strandId}
              style={{
                ...styles.strandToggle,
                ...(isVisible ? styles.strandToggleActive : {}),
              }}
              onClick={() => {
                toggleStrand(strand.strandId);
                if (onStrandToggle) {
                  onStrandToggle(strand.strandId, !isVisible);
                }
              }}
            >
              <div
                style={{
                  ...styles.strandDot,
                  backgroundColor: strand.color,
                  opacity: isVisible ? 1 : 0.3,
                }}
              />
              {strand.name}
            </button>
          );
        })}
      </div>

      {/* Controls */}
      <div style={styles.controls}>
        <span style={{ fontSize: '11px', color: '#666', marginRight: '8px' }}>
          Alignment:
        </span>
        {alignmentModes.map(({ key, label }) => (
          <button
            key={key}
            style={{
              ...styles.controlButton,
              ...(config.alignmentMode === key ? styles.controlButtonActive : {}),
            }}
            onClick={() => setAlignmentMode(key)}
          >
            {label}
          </button>
        ))}

        <div style={{ flex: 1 }} />

        <button style={styles.controlButton} onClick={zoomIn}>
          Zoom +
        </button>
        <button style={styles.controlButton} onClick={zoomOut}>
          Zoom -
        </button>

        {config.paused ? (
          <button
            style={{ ...styles.controlButton, ...styles.controlButtonActive }}
            onClick={resume}
          >
            Resume
          </button>
        ) : null}

        <button style={styles.controlButton} onClick={resetView}>
          Reset
        </button>
      </div>

      {/* Canvas */}
      <div style={{ ...styles.canvas, width, height: height - 60 }}>
        <svg
          ref={canvasRef}
          style={styles.svg}
          viewBox={`0 0 ${width} ${height - 60}`}
          onClick={handleCanvasClick}
        >
          {/* Background grid */}
          <defs>
            <pattern
              id="grid"
              width="50"
              height="50"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 50 0 L 0 0 0 50"
                fill="none"
                stroke="#0f0f1f"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Overlap indicators (background) */}
          {config.showOverlaps &&
            braiding.overlaps.map((overlap, i) => {
              const strandAY = strandLayout.get(overlap.strandA);
              const strandBY = strandLayout.get(overlap.strandB);

              if (!strandAY || !strandBY) return null;

              const startX = 40 + ((new Date(overlap.overlapStart).getTime() -
                new Date(braiding.config.timeRange.start).getTime()) /
                (new Date(braiding.config.timeRange.end).getTime() -
                  new Date(braiding.config.timeRange.start).getTime())) * (width - 80);

              const endX = 40 + ((new Date(overlap.overlapEnd).getTime() -
                new Date(braiding.config.timeRange.start).getTime()) /
                (new Date(braiding.config.timeRange.end).getTime() -
                  new Date(braiding.config.timeRange.start).getTime())) * (width - 80);

              return (
                <rect
                  key={i}
                  x={startX}
                  y={Math.min(strandAY, strandBY) - 10}
                  width={endX - startX}
                  height={Math.abs(strandAY - strandBY) + 20}
                  style={styles.overlapIndicator}
                />
              );
            })}

          {/* Strand ribbons */}
          {braiding.strands
            .filter((s) => config.visibleStrands.includes(s.strandId))
            .map((strand) => {
              const yPos = strandLayout.get(strand.strandId);
              if (yPos === undefined) return null;

              return (
                <StrandRibbon
                  key={strand.strandId}
                  strand={strand}
                  braiding={braiding}
                  yPosition={yPos}
                  viewWidth={width}
                />
              );
            })}

          {/* Time axis */}
          <TimeAxis
            braiding={braiding}
            viewWidth={width}
            viewHeight={height - 60}
          />

          {/* Pause line */}
          {pausedAt && (
            <line
              x1={40 + ((new Date(pausedAt).getTime() -
                new Date(braiding.config.timeRange.start).getTime()) /
                (new Date(braiding.config.timeRange.end).getTime() -
                  new Date(braiding.config.timeRange.start).getTime())) * (width - 80)}
              y1={40}
              x2={40 + ((new Date(pausedAt).getTime() -
                new Date(braiding.config.timeRange.start).getTime()) /
                (new Date(braiding.config.timeRange.end).getTime() -
                  new Date(braiding.config.timeRange.start).getTime())) * (width - 80)}
              y2={height - 90}
              style={styles.pauseLine}
            />
          )}
        </svg>

        {/* Paused moment panel */}
        {pausedMoment && (
          <div style={styles.pausedPanel}>
            <div style={styles.pausedPanelTitle}>
              Paused Moment
            </div>

            <div style={styles.pausedPanelItem}>
              <strong>Time:</strong> {new Date(pausedMoment.timestamp).toLocaleString('fr-CA')}
            </div>

            <div style={{ marginTop: '12px', fontSize: '10px', color: '#666' }}>
              Strand values at this moment:
            </div>

            {Object.entries(pausedMoment.strandValues).map(([strandId, point]) => {
              const strand = getStrand(braiding, strandId);
              if (!strand) return null;

              return (
                <div key={strandId} style={styles.pausedPanelItem}>
                  <div
                    style={{
                      ...styles.strandDot,
                      backgroundColor: strand.color,
                    }}
                  />
                  <span>{strand.name}:</span>
                  <span style={{ color: '#aaa' }}>
                    {point ? point.label || point.density : 'absent'}
                  </span>
                </div>
              );
            })}

            <button
              style={{ ...styles.controlButton, marginTop: '12px', width: '100%' }}
              onClick={resume}
            >
              Resume
            </button>
          </div>
        )}
      </div>

      {/* Summary */}
      <div style={{ padding: '12px 20px', fontSize: '11px', color: '#666' }}>
        {braiding.strands.length} strands •{' '}
        {config.visibleStrands.length} visible •{' '}
        {braiding.overlaps.length} overlaps observed
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <div style={{ marginBottom: '4px' }}>
          Time is observed, not resolved. Multiple evolutions coexist without hierarchy.
        </div>
        {AGENT_CONFIRMATION}
      </div>
    </div>
  );
};

/* =========================================================
   COMPACT VERSION
   ========================================================= */

export interface TemporalBraidingCompactProps {
  strands: TemporalStrand[];
  width?: number;
  height?: number;
}

export const TemporalBraidingCompact: React.FC<TemporalBraidingCompactProps> = ({
  strands,
  width = 300,
  height = 150,
}) => {
  const braiding = useMemo(
    () => generateBraiding(strands),
    [strands]
  );

  const strandLayout = computeStrandLayout(braiding, height, 20);

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: '#0a0a1a',
        borderRadius: '8px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <svg
        style={{ width: '100%', height: '100%' }}
        viewBox={`0 0 ${width} ${height}`}
      >
        {braiding.strands.map((strand) => {
          const yPos = strandLayout.get(strand.strandId);
          if (yPos === undefined) return null;

          const pathPoints = computeStrandPath(strand, braiding, width, yPos);

          if (pathPoints.length < 2) return null;

          const pathD = pathPoints
            .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
            .join(' ');

          return (
            <path
              key={strand.strandId}
              d={pathD}
              fill="none"
              stroke={strand.color}
              strokeWidth={3}
              strokeOpacity={0.6}
              strokeLinecap="round"
            />
          );
        })}
      </svg>

      <div
        style={{
          position: 'absolute',
          bottom: '8px',
          left: '8px',
          fontSize: '10px',
          color: '#555',
        }}
      >
        {braiding.strands.length} strands
      </div>
    </div>
  );
};

/* =========================================================
   EXPORTS
   ========================================================= */

export { createStrand, createPoint };

export default TemporalBraidingView;
