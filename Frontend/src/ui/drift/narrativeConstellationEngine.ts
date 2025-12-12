/* =====================================================
   CHE·NU — NARRATIVE CONSTELLATION ENGINE
   Status: OBSERVATIONAL VISUALIZATION
   Authority: NONE
   
   📜 PURPOSE:
   Compute positions and relationships for narrative
   nodes in the constellation view.
   
   📜 RULES:
   - No hierarchy computation
   - No correctness evaluation
   - No evolution direction
   - Proximity only, not causality
   ===================================================== */

import { AGENT_CONFIRMATION } from '../../core/agents/internalAgentContext';
import {
  type NarrativeNode,
  type NarrativeRelationship,
  type NarrativeConstellation,
  type ConstellationConfig,
  type ConstellationFilter,
  type ConstellationLayout,
  type RelationshipType,
  type TimeRange,
  type DriftType,
  type XRNarrativeNode,
  type XRPosition,
  SCOPE_COLORS,
  DEFAULT_CONSTELLATION_CONFIG,
  NARRATIVE_CONSTELLATION_DECLARATION,
  isAllowedLabel,
} from './narrativeConstellation.types';
import { type DriftNarrative, type NarrativeScope } from './driftNarrative.types';

/* =========================================================
   POSITION COMPUTATION
   ========================================================= */

/**
 * Compute 2D position for a node based on layout.
 */
function computeNodePosition(
  node: NarrativeNode,
  index: number,
  total: number,
  layout: ConstellationLayout,
  allNodes: NarrativeNode[]
): { x: number; y: number } {
  switch (layout) {
    case 'spatial':
      return computeSpatialPosition(node, index, total);

    case 'clustered':
      return computeClusteredPosition(node, index, allNodes);

    case 'layered':
      return computeLayeredPosition(node, index, allNodes);

    case 'sphere-separated':
      return computeSphereSeparatedPosition(node, index, allNodes);

    default:
      return computeSpatialPosition(node, index, total);
  }
}

/**
 * Spatial layout: free constellation based on time.
 */
function computeSpatialPosition(
  node: NarrativeNode,
  index: number,
  total: number
): { x: number; y: number } {
  // Distribute in a circular pattern with some randomness
  const angle = (index / total) * Math.PI * 2;
  const radius = 200 + (node.confidence * 100);

  // Add deterministic "randomness" based on node ID
  const hash = simpleHash(node.narrativeId);
  const offsetX = (hash % 50) - 25;
  const offsetY = ((hash >> 8) % 50) - 25;

  return {
    x: Math.cos(angle) * radius + offsetX,
    y: Math.sin(angle) * radius + offsetY,
  };
}

/**
 * Clustered layout: group by context/drift types.
 */
function computeClusteredPosition(
  node: NarrativeNode,
  index: number,
  allNodes: NarrativeNode[]
): { x: number; y: number } {
  // Cluster centers based on primary drift type
  const clusterCenters: Record<DriftType, { x: number; y: number }> = {
    preference: { x: -200, y: -150 },
    context: { x: 200, y: -150 },
    collective: { x: 0, y: 200 },
    behavioral: { x: -200, y: 150 },
    temporal: { x: 200, y: 150 },
  };

  const primaryDrift = node.driftTypes[0] || 'preference';
  const center = clusterCenters[primaryDrift];

  // Position within cluster
  const nodesInCluster = allNodes.filter(
    (n) => n.driftTypes[0] === primaryDrift
  );
  const indexInCluster = nodesInCluster.findIndex(
    (n) => n.narrativeId === node.narrativeId
  );
  const totalInCluster = nodesInCluster.length;

  const angle = (indexInCluster / Math.max(totalInCluster, 1)) * Math.PI * 2;
  const radius = 30 + totalInCluster * 5;

  return {
    x: center.x + Math.cos(angle) * radius,
    y: center.y + Math.sin(angle) * radius,
  };
}

/**
 * Layered layout: horizontal layers by timeframe.
 */
function computeLayeredPosition(
  node: NarrativeNode,
  index: number,
  allNodes: NarrativeNode[]
): { x: number; y: number } {
  // Find time bounds
  const allTimes = allNodes.map((n) => new Date(n.timeframe.start).getTime());
  const minTime = Math.min(...allTimes);
  const maxTime = Math.max(...allTimes);
  const timeRange = maxTime - minTime || 1;

  const nodeTime = new Date(node.timeframe.start).getTime();
  const normalizedTime = (nodeTime - minTime) / timeRange;

  // Y position based on time (top = oldest, bottom = newest)
  const y = -200 + normalizedTime * 400;

  // X position based on scope
  const scopeOffsets: Record<NarrativeScope, number> = {
    session: -150,
    project: -50,
    sphere: 50,
    global: 150,
  };

  const x = scopeOffsets[node.scope] + (simpleHash(node.narrativeId) % 40) - 20;

  return { x, y };
}

/**
 * Sphere-separated layout: separate planes per sphere.
 */
function computeSphereSeparatedPosition(
  node: NarrativeNode,
  index: number,
  allNodes: NarrativeNode[]
): { x: number; y: number } {
  // Get unique spheres
  const spheres = [...new Set(allNodes.map((n) => n.sphereId || 'global'))];
  const sphereIndex = spheres.indexOf(node.sphereId || 'global');

  // Each sphere gets a horizontal band
  const bandWidth = 400 / Math.max(spheres.length, 1);
  const bandCenterX = -200 + bandWidth * (sphereIndex + 0.5);

  // Position within band
  const nodesInSphere = allNodes.filter(
    (n) => (n.sphereId || 'global') === (node.sphereId || 'global')
  );
  const indexInSphere = nodesInSphere.findIndex(
    (n) => n.narrativeId === node.narrativeId
  );

  const y = -150 + (indexInSphere / Math.max(nodesInSphere.length, 1)) * 300;

  return {
    x: bandCenterX + (simpleHash(node.narrativeId) % 30) - 15,
    y,
  };
}

/**
 * Simple hash function for deterministic positioning.
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

/* =========================================================
   VISUAL COMPUTATION
   ========================================================= */

/**
 * Compute visual properties for a node.
 */
function computeNodeVisuals(node: NarrativeNode): NarrativeNode['visual'] {
  // Size based on duration (NOT importance)
  const start = new Date(node.timeframe.start).getTime();
  const end = new Date(node.timeframe.end).getTime();
  const durationMs = end - start;
  const durationDays = durationMs / (1000 * 60 * 60 * 24);

  // Size: 10-40px based on duration (max 30 days)
  const size = Math.min(40, Math.max(10, 10 + (durationDays / 30) * 30));

  // Color based on scope ONLY
  const color = SCOPE_COLORS[node.scope];

  // Opacity based on confidence
  const opacity = Math.max(0.3, node.confidence);

  return { size, color, opacity };
}

/* =========================================================
   RELATIONSHIP COMPUTATION
   ========================================================= */

/**
 * Compute relationships between nodes.
 * Relationships are VISUAL, not analytical.
 */
function computeRelationships(
  nodes: NarrativeNode[]
): NarrativeRelationship[] {
  const relationships: NarrativeRelationship[] = [];

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const nodeA = nodes[i];
      const nodeB = nodes[j];

      // Check temporal overlap
      const temporalOverlap = checkTemporalOverlap(
        nodeA.timeframe,
        nodeB.timeframe
      );

      if (temporalOverlap > 0) {
        relationships.push({
          sourceId: nodeA.narrativeId,
          targetId: nodeB.narrativeId,
          type: 'temporal-overlap',
          strength: temporalOverlap,
          description: describeRelationship('temporal-overlap', temporalOverlap),
        });
      }

      // Check shared drift types
      const sharedDriftTypes = nodeA.driftTypes.filter((dt) =>
        nodeB.driftTypes.includes(dt)
      );

      if (sharedDriftTypes.length > 0) {
        const strength = sharedDriftTypes.length / Math.max(
          nodeA.driftTypes.length,
          nodeB.driftTypes.length
        );

        relationships.push({
          sourceId: nodeA.narrativeId,
          targetId: nodeB.narrativeId,
          type: 'shared-drift-types',
          strength,
          description: describeRelationship('shared-drift-types', strength),
        });
      }

      // Check sphere adjacency
      if (nodeA.sphereId && nodeB.sphereId) {
        if (nodeA.sphereId === nodeB.sphereId) {
          relationships.push({
            sourceId: nodeA.narrativeId,
            targetId: nodeB.narrativeId,
            type: 'sphere-adjacent',
            strength: 1.0,
            description: describeRelationship('sphere-adjacent', 1.0),
          });
        }
      }
    }
  }

  return relationships;
}

/**
 * Check temporal overlap between two time ranges.
 * Returns overlap strength (0-1).
 */
function checkTemporalOverlap(a: TimeRange, b: TimeRange): number {
  const aStart = new Date(a.start).getTime();
  const aEnd = new Date(a.end).getTime();
  const bStart = new Date(b.start).getTime();
  const bEnd = new Date(b.end).getTime();

  const overlapStart = Math.max(aStart, bStart);
  const overlapEnd = Math.min(aEnd, bEnd);

  if (overlapEnd <= overlapStart) return 0;

  const overlapDuration = overlapEnd - overlapStart;
  const totalDuration = Math.max(aEnd - aStart, bEnd - bStart);

  return overlapDuration / totalDuration;
}

/**
 * Generate ALLOWED description for a relationship.
 */
function describeRelationship(
  type: RelationshipType,
  strength: number
): string {
  // Use ONLY allowed language
  const intensityWord = strength > 0.7 ? 'closely' : strength > 0.3 ? '' : 'distantly';

  switch (type) {
    case 'temporal-overlap':
      return `${intensityWord} concurrent in time`.trim();

    case 'shared-drift-types':
      return `${intensityWord} overlapping drift categories`.trim();

    case 'sphere-adjacent':
      return 'coexisting in same sphere';

    case 'proximity':
      return `${intensityWord} near in context`.trim();

    default:
      return 'coexisting';
  }
}

/* =========================================================
   FILTERING
   ========================================================= */

/**
 * Apply filters to nodes.
 */
function applyFilters(
  nodes: NarrativeNode[],
  filters: ConstellationFilter
): NarrativeNode[] {
  let filtered = [...nodes];

  if (filters.scopes && filters.scopes.length > 0) {
    filtered = filtered.filter((n) => filters.scopes!.includes(n.scope));
  }

  if (filters.sphereIds && filters.sphereIds.length > 0) {
    filtered = filtered.filter(
      (n) => n.sphereId && filters.sphereIds!.includes(n.sphereId)
    );
  }

  if (filters.driftTypes && filters.driftTypes.length > 0) {
    filtered = filtered.filter((n) =>
      n.driftTypes.some((dt) => filters.driftTypes!.includes(dt))
    );
  }

  if (filters.minConfidence !== undefined) {
    filtered = filtered.filter((n) => n.confidence >= filters.minConfidence!);
  }

  if (filters.visibility) {
    filtered = filtered.filter((n) => n.visibility === filters.visibility);
  }

  if (filters.timeframe) {
    const filterStart = new Date(filters.timeframe.start).getTime();
    const filterEnd = new Date(filters.timeframe.end).getTime();

    filtered = filtered.filter((n) => {
      const nodeStart = new Date(n.timeframe.start).getTime();
      const nodeEnd = new Date(n.timeframe.end).getTime();

      return nodeEnd >= filterStart && nodeStart <= filterEnd;
    });
  }

  return filtered;
}

/* =========================================================
   CONSTELLATION GENERATOR
   ========================================================= */

/**
 * Generate a complete narrative constellation.
 */
export function generateConstellation(
  narratives: DriftNarrative[],
  config: Partial<ConstellationConfig> = {}
): NarrativeConstellation {
  const fullConfig: ConstellationConfig = {
    ...DEFAULT_CONSTELLATION_CONFIG,
    ...config,
  };

  // Convert narratives to nodes
  let nodes: NarrativeNode[] = narratives.map((narrative) => ({
    narrativeId: `narrative-${simpleHash(narrative.observations.map((o) => o.observationId).join('-'))}`,
    scope: narrative.scope,
    timeframe: narrative.dateRange,
    driftTypes: extractDriftTypes(narrative),
    confidence: narrative.overallConfidence,
    visibility: 'public',
    sphereId: narrative.variations.find((v) => v.contextType === 'sphere')?.contextId,
    narrative,
  }));

  // Apply filters
  nodes = applyFilters(nodes, fullConfig.filters);

  // Compute positions
  nodes = nodes.map((node, index) => ({
    ...node,
    position: computeNodePosition(node, index, nodes.length, fullConfig.layout, nodes),
    visual: computeNodeVisuals(node),
  }));

  // Compute relationships
  const relationships = fullConfig.showRelationships
    ? computeRelationships(nodes)
    : [];

  // Compute metadata
  const allTimeRanges = nodes.map((n) => n.timeframe);
  const overallTimeRange: TimeRange = {
    start: allTimeRanges.length > 0
      ? allTimeRanges.reduce((min, t) =>
          new Date(t.start) < new Date(min.start) ? t : min
        ).start
      : new Date().toISOString(),
    end: allTimeRanges.length > 0
      ? allTimeRanges.reduce((max, t) =>
          new Date(t.end) > new Date(max.end) ? t : max
        ).end
      : new Date().toISOString(),
  };

  return {
    nodes,
    relationships,
    config: fullConfig,
    metadata: {
      totalNarratives: nodes.length,
      overallTimeRange,
      scopesRepresented: [...new Set(nodes.map((n) => n.scope))],
      spheresRepresented: [...new Set(nodes.map((n) => n.sphereId).filter(Boolean))] as string[],
      generatedAt: new Date().toISOString(),
    },
    declaration: NARRATIVE_CONSTELLATION_DECLARATION,
  };
}

/**
 * Extract drift types from a narrative.
 */
function extractDriftTypes(narrative: DriftNarrative): DriftType[] {
  const types: Set<DriftType> = new Set();

  for (const obs of narrative.observations) {
    if (obs.changeDescription.includes('preference')) types.add('preference');
    if (obs.changeDescription.includes('context')) types.add('context');
    if (obs.changeDescription.includes('collective')) types.add('collective');
    if (obs.changeDescription.includes('behavior')) types.add('behavioral');
    if (obs.changeDescription.includes('time')) types.add('temporal');
  }

  // Default if none found
  if (types.size === 0) {
    types.add('preference');
  }

  return [...types];
}

/* =========================================================
   XR CONSTELLATION
   ========================================================= */

/**
 * Convert constellation to XR format.
 */
export function toXRConstellation(
  constellation: NarrativeConstellation
): XRNarrativeNode[] {
  return constellation.nodes.map((node) => {
    const pos2D = node.position || { x: 0, y: 0 };

    // Convert 2D to 3D (add Z based on confidence)
    const position3D: XRPosition = {
      x: pos2D.x * 0.01, // Scale down for XR
      y: pos2D.y * 0.01,
      z: (node.confidence - 0.5) * 2, // Z based on confidence
    };

    return {
      ...node,
      position3D,
      brightness: node.confidence,
      pulseRate: 0.5, // Slow pulse only
    };
  });
}

/* =========================================================
   UTILITY FUNCTIONS
   ========================================================= */

/**
 * Find nodes near a given node.
 * Uses ALLOWED language only.
 */
export function findNearbyNodes(
  constellation: NarrativeConstellation,
  nodeId: string,
  maxDistance: number = 100
): { nodeId: string; distance: number; relationship: string }[] {
  const targetNode = constellation.nodes.find((n) => n.narrativeId === nodeId);
  if (!targetNode || !targetNode.position) return [];

  const nearby: { nodeId: string; distance: number; relationship: string }[] = [];

  for (const node of constellation.nodes) {
    if (node.narrativeId === nodeId) continue;
    if (!node.position) continue;

    const dx = node.position.x - targetNode.position.x;
    const dy = node.position.y - targetNode.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= maxDistance) {
      // Use ALLOWED language only
      const relationship = distance < 30 ? 'near' : distance < 60 ? 'adjacent' : 'distant';

      nearby.push({
        nodeId: node.narrativeId,
        distance,
        relationship,
      });
    }
  }

  return nearby.sort((a, b) => a.distance - b.distance);
}

/**
 * Get constellation summary using neutral language.
 */
export function getConstellationSummary(
  constellation: NarrativeConstellation
): string {
  const { nodes, relationships, metadata } = constellation;

  const scopeCounts = nodes.reduce((acc, n) => {
    acc[n.scope] = (acc[n.scope] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const lines = [
    `Constellation contains ${metadata.totalNarratives} narratives.`,
    '',
    'Scope distribution:',
    ...Object.entries(scopeCounts).map(([scope, count]) => `  ${scope}: ${count}`),
    '',
    `${relationships.length} relationships observed.`,
    '',
    `Time range: ${metadata.overallTimeRange.start.slice(0, 10)} to ${metadata.overallTimeRange.end.slice(0, 10)}`,
  ];

  return lines.join('\n');
}

/* =========================================================
   EXPORTS
   ========================================================= */

export {
  computeNodePosition,
  computeNodeVisuals,
  computeRelationships,
  applyFilters,
  checkTemporalOverlap,
  isAllowedLabel,
};
