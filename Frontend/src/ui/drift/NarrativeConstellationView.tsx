/* =====================================================
   CHE·NU — NARRATIVE CONSTELLATION VIEW
   Status: OBSERVATIONAL VISUALIZATION
   Authority: NONE
   
   📜 PURPOSE:
   Visualize how multiple drift narratives coexist,
   relate, and evolve within the CHE·NU system.
   
   📜 ANSWERS ONLY:
   "How are narratives positioned relative to each other?"
   
   📜 NEVER ANSWERS:
   "Which narrative is dominant."
   "Which direction should be followed."
   ===================================================== */

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
  type NarrativeConstellation,
  type NarrativeNode,
  type NarrativeRelationship,
  type ConstellationConfig,
  type ConstellationLayout,
  type ConstellationFilter,
  type SelectedNodeState,
  SCOPE_COLORS,
  DEFAULT_CONSTELLATION_CONFIG,
  NARRATIVE_CONSTELLATION_DECLARATION,
  CONSTELLATION_FAILSAFES,
  ALLOWED_CONSTELLATION_LABELS,
} from './narrativeConstellation.types';
import {
  generateConstellation,
  findNearbyNodes,
  getConstellationSummary,
} from './narrativeConstellationEngine';
import { type DriftNarrative } from './driftNarrative.types';
import { AGENT_CONFIRMATION } from '../../core/agents/internalAgentContext';

/* =========================================================
   PROPS
   ========================================================= */

export interface NarrativeConstellationViewProps {
  /** Input narratives to visualize */
  narratives: DriftNarrative[];

  /** Initial layout mode */
  initialLayout?: ConstellationLayout;

  /** Initial filters */
  initialFilters?: ConstellationFilter;

  /** Width of the view */
  width?: number;

  /** Height of the view */
  height?: number;

  /** On node select callback */
  onNodeSelect?: (node: NarrativeNode | null) => void;

  /** Custom class name */
  className?: string;

  /** Enable XR mode */
  xrMode?: boolean;
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

  canvas: {
    position: 'relative' as const,
    overflow: 'hidden',
    cursor: 'grab',
  },

  canvasGrabbing: {
    cursor: 'grabbing',
  },

  svg: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none' as const,
  },

  node: {
    position: 'absolute' as const,
    borderRadius: '50%',
    cursor: 'pointer',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    boxShadow: '0 0 10px rgba(255, 255, 255, 0.2)',
  },

  nodeSelected: {
    boxShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
    transform: 'scale(1.2)',
  },

  nodeLabel: {
    position: 'absolute' as const,
    fontSize: '10px',
    color: '#888',
    whiteSpace: 'nowrap' as const,
    pointerEvents: 'none' as const,
  },

  selectedPanel: {
    position: 'absolute' as const,
    top: '16px',
    right: '16px',
    width: '280px',
    backgroundColor: '#1a1a2e',
    borderRadius: '8px',
    padding: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
  },

  selectedPanelTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#fff',
    marginBottom: '12px',
  },

  selectedPanelDetail: {
    fontSize: '12px',
    color: '#888',
    marginBottom: '8px',
  },

  legend: {
    display: 'flex',
    gap: '16px',
    padding: '12px 20px',
    backgroundColor: '#0f0f1f',
    borderTop: '1px solid #1a1a2e',
    fontSize: '11px',
    color: '#666',
  },

  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },

  legendDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
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
 * Hook for constellation state management.
 */
export function useConstellation(
  narratives: DriftNarrative[],
  initialConfig: Partial<ConstellationConfig> = {}
) {
  const [config, setConfig] = useState<ConstellationConfig>({
    ...DEFAULT_CONSTELLATION_CONFIG,
    ...initialConfig,
  });

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Generate constellation
  const constellation = useMemo(
    () => generateConstellation(narratives, config),
    [narratives, config]
  );

  // Selected node data
  const selectedNode = useMemo(() => {
    if (!selectedNodeId) return null;
    return constellation.nodes.find((n) => n.narrativeId === selectedNodeId) || null;
  }, [constellation.nodes, selectedNodeId]);

  // Nearby nodes
  const nearbyNodes = useMemo(() => {
    if (!selectedNodeId) return [];
    return findNearbyNodes(constellation, selectedNodeId);
  }, [constellation, selectedNodeId]);

  // Actions
  const setLayout = useCallback((layout: ConstellationLayout) => {
    setConfig((prev) => ({ ...prev, layout }));
  }, []);

  const setFilters = useCallback((filters: ConstellationFilter) => {
    setConfig((prev) => ({ ...prev, filters }));
  }, []);

  const toggleRelationships = useCallback(() => {
    setConfig((prev) => ({ ...prev, showRelationships: !prev.showRelationships }));
  }, []);

  const toggleLabels = useCallback(() => {
    setConfig((prev) => ({ ...prev, showLabels: !prev.showLabels }));
  }, []);

  return {
    constellation,
    config,
    selectedNode,
    nearbyNodes,
    selectedNodeId,
    setSelectedNodeId,
    setLayout,
    setFilters,
    toggleRelationships,
    toggleLabels,
  };
}

/* =========================================================
   SUB-COMPONENTS
   ========================================================= */

interface ConstellationNodeProps {
  node: NarrativeNode;
  isSelected: boolean;
  showLabel: boolean;
  centerX: number;
  centerY: number;
  onClick: () => void;
}

const ConstellationNode: React.FC<ConstellationNodeProps> = ({
  node,
  isSelected,
  showLabel,
  centerX,
  centerY,
  onClick,
}) => {
  const pos = node.position || { x: 0, y: 0 };
  const visual = node.visual || { size: 15, color: '#888', opacity: 0.7 };

  const left = centerX + pos.x - visual.size / 2;
  const top = centerY + pos.y - visual.size / 2;

  return (
    <>
      <div
        style={{
          ...styles.node,
          ...(isSelected ? styles.nodeSelected : {}),
          left: `${left}px`,
          top: `${top}px`,
          width: `${visual.size}px`,
          height: `${visual.size}px`,
          backgroundColor: visual.color,
          opacity: visual.opacity,
        }}
        onClick={onClick}
        title={`${node.scope} narrative (${node.driftTypes.join(', ')})`}
      />
      {showLabel && (
        <div
          style={{
            ...styles.nodeLabel,
            left: `${left + visual.size + 5}px`,
            top: `${top + visual.size / 2 - 6}px`,
          }}
        >
          {node.scope}
        </div>
      )}
    </>
  );
};

interface RelationshipLineProps {
  relationship: NarrativeRelationship;
  sourceNode: NarrativeNode;
  targetNode: NarrativeNode;
  centerX: number;
  centerY: number;
}

const RelationshipLine: React.FC<RelationshipLineProps> = ({
  relationship,
  sourceNode,
  targetNode,
  centerX,
  centerY,
}) => {
  const sourcePos = sourceNode.position || { x: 0, y: 0 };
  const targetPos = targetNode.position || { x: 0, y: 0 };

  const x1 = centerX + sourcePos.x;
  const y1 = centerY + sourcePos.y;
  const x2 = centerX + targetPos.x;
  const y2 = centerY + targetPos.y;

  // NO ARROWS per failsafes
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke="rgba(100, 100, 150, 0.2)"
      strokeWidth={Math.max(1, relationship.strength * 2)}
      strokeDasharray={relationship.type === 'temporal-overlap' ? '4,4' : undefined}
    />
  );
};

/* =========================================================
   MAIN COMPONENT
   ========================================================= */

export const NarrativeConstellationView: React.FC<NarrativeConstellationViewProps> = ({
  narratives,
  initialLayout = 'spatial',
  initialFilters = {},
  width = 800,
  height = 600,
  onNodeSelect,
  className,
  xrMode = false,
}) => {
  const {
    constellation,
    config,
    selectedNode,
    nearbyNodes,
    selectedNodeId,
    setSelectedNodeId,
    setLayout,
    toggleRelationships,
    toggleLabels,
  } = useConstellation(narratives, {
    layout: initialLayout,
    filters: initialFilters,
  });

  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const lastPanPos = useRef({ x: 0, y: 0 });

  const centerX = width / 2 + pan.x;
  const centerY = height / 2 + pan.y;

  // Pan handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsPanning(true);
      lastPanPos.current = { x: e.clientX, y: e.clientY };
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isPanning) return;

      const dx = e.clientX - lastPanPos.current.x;
      const dy = e.clientY - lastPanPos.current.y;

      setPan((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      lastPanPos.current = { x: e.clientX, y: e.clientY };
    },
    [isPanning]
  );

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Node selection
  const handleNodeClick = useCallback(
    (nodeId: string) => {
      const newId = selectedNodeId === nodeId ? null : nodeId;
      setSelectedNodeId(newId);

      if (onNodeSelect) {
        const node = newId
          ? constellation.nodes.find((n) => n.narrativeId === newId) || null
          : null;
        onNodeSelect(node);
      }
    },
    [selectedNodeId, setSelectedNodeId, constellation.nodes, onNodeSelect]
  );

  // Layout buttons
  const layouts: { key: ConstellationLayout; label: string }[] = [
    { key: 'spatial', label: 'Free' },
    { key: 'clustered', label: 'Clustered' },
    { key: 'layered', label: 'Timeline' },
    { key: 'sphere-separated', label: 'By Sphere' },
  ];

  return (
    <div style={{ ...styles.container, width, height: 'auto' }} className={className}>
      {/* Header */}
      <div style={styles.header}>
        <h3 style={styles.title}>Narrative Constellation</h3>
        <span style={styles.badge}>OBSERVATION ONLY</span>
      </div>

      {/* Disclaimer */}
      <div style={styles.disclaimer}>
        ⚠️ This view shows narrative positions, not hierarchy or importance.
        No narrative is "central" or "dominant".
      </div>

      {/* Controls */}
      <div style={styles.controls}>
        {layouts.map(({ key, label }) => (
          <button
            key={key}
            style={{
              ...styles.controlButton,
              ...(config.layout === key ? styles.controlButtonActive : {}),
            }}
            onClick={() => setLayout(key)}
          >
            {label}
          </button>
        ))}

        <div style={{ flex: 1 }} />

        <button
          style={{
            ...styles.controlButton,
            ...(config.showRelationships ? styles.controlButtonActive : {}),
          }}
          onClick={toggleRelationships}
        >
          Links
        </button>

        <button
          style={{
            ...styles.controlButton,
            ...(config.showLabels ? styles.controlButtonActive : {}),
          }}
          onClick={toggleLabels}
        >
          Labels
        </button>
      </div>

      {/* Canvas */}
      <div
        style={{
          ...styles.canvas,
          ...(isPanning ? styles.canvasGrabbing : {}),
          width,
          height,
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Relationship lines (SVG) */}
        {config.showRelationships && (
          <svg style={styles.svg}>
            {constellation.relationships.map((rel, index) => {
              const sourceNode = constellation.nodes.find(
                (n) => n.narrativeId === rel.sourceId
              );
              const targetNode = constellation.nodes.find(
                (n) => n.narrativeId === rel.targetId
              );

              if (!sourceNode || !targetNode) return null;

              return (
                <RelationshipLine
                  key={index}
                  relationship={rel}
                  sourceNode={sourceNode}
                  targetNode={targetNode}
                  centerX={centerX}
                  centerY={centerY}
                />
              );
            })}
          </svg>
        )}

        {/* Nodes */}
        {constellation.nodes.map((node) => (
          <ConstellationNode
            key={node.narrativeId}
            node={node}
            isSelected={selectedNodeId === node.narrativeId}
            showLabel={config.showLabels}
            centerX={centerX}
            centerY={centerY}
            onClick={() => handleNodeClick(node.narrativeId)}
          />
        ))}

        {/* Selected node panel */}
        {selectedNode && (
          <div style={styles.selectedPanel}>
            <div style={styles.selectedPanelTitle}>
              Selected Narrative
            </div>

            <div style={styles.selectedPanelDetail}>
              <strong>Scope:</strong> {selectedNode.scope}
            </div>

            <div style={styles.selectedPanelDetail}>
              <strong>Drift Types:</strong> {selectedNode.driftTypes.join(', ')}
            </div>

            <div style={styles.selectedPanelDetail}>
              <strong>Confidence:</strong> {(selectedNode.confidence * 100).toFixed(0)}%
            </div>

            <div style={styles.selectedPanelDetail}>
              <strong>Timeframe:</strong>{' '}
              {selectedNode.timeframe.start.slice(0, 10)} to{' '}
              {selectedNode.timeframe.end.slice(0, 10)}
            </div>

            {nearbyNodes.length > 0 && (
              <>
                <div style={{ ...styles.selectedPanelDetail, marginTop: '12px' }}>
                  <strong>Nearby narratives:</strong>
                </div>
                {nearbyNodes.slice(0, 3).map((n) => (
                  <div key={n.nodeId} style={{ ...styles.selectedPanelDetail, paddingLeft: '8px' }}>
                    • {n.relationship}
                  </div>
                ))}
              </>
            )}

            <button
              style={{
                ...styles.controlButton,
                marginTop: '12px',
                width: '100%',
              }}
              onClick={() => setSelectedNodeId(null)}
            >
              Deselect
            </button>
          </div>
        )}
      </div>

      {/* Legend */}
      <div style={styles.legend}>
        {Object.entries(SCOPE_COLORS).map(([scope, color]) => (
          <div key={scope} style={styles.legendItem}>
            <div style={{ ...styles.legendDot, backgroundColor: color }} />
            <span>{scope}</span>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div style={{ padding: '12px 20px', fontSize: '12px', color: '#666' }}>
        {constellation.metadata.totalNarratives} narratives •{' '}
        {constellation.relationships.length} relationships observed •{' '}
        {constellation.metadata.spheresRepresented.length} spheres
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <div style={{ marginBottom: '4px' }}>
          Clarity emerges from relational visibility, not guidance.
        </div>
        {AGENT_CONFIRMATION}
      </div>
    </div>
  );
};

/* =========================================================
   COMPACT VERSION
   ========================================================= */

export interface NarrativeConstellationCompactProps {
  narratives: DriftNarrative[];
  width?: number;
  height?: number;
}

export const NarrativeConstellationCompact: React.FC<NarrativeConstellationCompactProps> = ({
  narratives,
  width = 300,
  height = 200,
}) => {
  const constellation = useMemo(
    () => generateConstellation(narratives, { showRelationships: false, showLabels: false }),
    [narratives]
  );

  const centerX = width / 2;
  const centerY = height / 2;
  const scale = 0.4; // Compact scale

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
      {constellation.nodes.map((node) => {
        const pos = node.position || { x: 0, y: 0 };
        const visual = node.visual || { size: 10, color: '#888', opacity: 0.7 };

        return (
          <div
            key={node.narrativeId}
            style={{
              position: 'absolute',
              left: centerX + pos.x * scale - visual.size * scale / 2,
              top: centerY + pos.y * scale - visual.size * scale / 2,
              width: visual.size * scale,
              height: visual.size * scale,
              borderRadius: '50%',
              backgroundColor: visual.color,
              opacity: visual.opacity,
            }}
          />
        );
      })}

      <div
        style={{
          position: 'absolute',
          bottom: '8px',
          left: '8px',
          fontSize: '10px',
          color: '#555',
        }}
      >
        {constellation.metadata.totalNarratives} narratives
      </div>
    </div>
  );
};

/* =========================================================
   EXPORTS
   ========================================================= */

export default NarrativeConstellationView;
