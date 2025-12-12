/* =====================================================
   CHE·NU — Compare Multiple Decisions
   
   Main entry point for multi-decision analysis.
   Combines extraction, clustering, and insight generation.
   ===================================================== */

import { TimelineXREvent } from '../xr/meeting/xrReplay.types';
import {
  MultiDecisionComparisonResult,
  DecisionNode,
  DecisionCluster,
  DecisionInsight,
  DecisionPattern,
  DecisionTimelinePoint,
  DecisionType,
  ComparisonConfig,
  DEFAULT_COMPARISON_CONFIG,
} from './decisionComparison.types';

import { extractDecisionNodes } from './extractDecisionNodes';
import { clusterDecisions, clusterDecisionsKMeans } from './clusterDecisions';
import { generateDecisionInsights, detectDecisionPatterns } from './generateDecisionInsights';

// ─────────────────────────────────────────────────────
// MAIN COMPARISON FUNCTION
// ─────────────────────────────────────────────────────

/**
 * Perform comprehensive multi-decision comparison and analysis.
 */
export function compareMultipleDecisions(
  events: TimelineXREvent[],
  config: ComparisonConfig = DEFAULT_COMPARISON_CONFIG
): MultiDecisionComparisonResult {
  // Step 1: Extract decision nodes
  const nodes = extractDecisionNodes(events);

  if (nodes.length === 0) {
    return createEmptyResult();
  }

  // Step 2: Cluster decisions
  const clusters = clusterDecisions(nodes, config);

  // Step 3: Generate insights
  const insights = generateDecisionInsights(nodes, clusters, config);

  // Step 4: Detect patterns
  const patterns = detectDecisionPatterns(nodes);

  // Step 5: Calculate global metrics
  const globalMetrics = calculateGlobalMetrics(nodes);

  // Step 6: Build timeline
  const timeline = buildDecisionTimeline(nodes, clusters);

  return {
    nodes,
    clusters,
    insights,
    globalMetrics,
    patterns,
    timeline,
  };
}

// ─────────────────────────────────────────────────────
// EMPTY RESULT
// ─────────────────────────────────────────────────────

function createEmptyResult(): MultiDecisionComparisonResult {
  return {
    nodes: [],
    clusters: [],
    insights: [{
      id: 'insight_0',
      type: 'observation',
      severity: 'info',
      title: 'Aucune décision trouvée',
      description: 'Aucune décision n\'a été identifiée dans les événements fournis.',
      relatedDecisions: [],
      actionable: false,
    }],
    globalMetrics: {
      totalDecisions: 0,
      avgContextSize: 0,
      avgConsequences: 0,
      mostActiveAgent: '',
      dominantDecisionType: 'operational',
      timeSpan: 0,
    },
    patterns: [],
    timeline: [],
  };
}

// ─────────────────────────────────────────────────────
// GLOBAL METRICS
// ─────────────────────────────────────────────────────

function calculateGlobalMetrics(nodes: DecisionNode[]): MultiDecisionComparisonResult['globalMetrics'] {
  if (nodes.length === 0) {
    return {
      totalDecisions: 0,
      avgContextSize: 0,
      avgConsequences: 0,
      mostActiveAgent: '',
      dominantDecisionType: 'operational',
      timeSpan: 0,
    };
  }

  // Average context size
  const avgContextSize = nodes.reduce((sum, n) => sum + n.contextSize, 0) / nodes.length;

  // Average consequences
  const avgConsequences = nodes.reduce((sum, n) => sum + n.consequenceCount, 0) / nodes.length;

  // Most active agent
  const agentCounts = new Map<string, number>();
  nodes.forEach(n => {
    n.agentsInvolved.forEach(a => {
      agentCounts.set(a, (agentCounts.get(a) || 0) + 1);
    });
  });

  let mostActiveAgent = '';
  let maxCount = 0;
  agentCounts.forEach((count, agent) => {
    if (count > maxCount) {
      maxCount = count;
      mostActiveAgent = agent;
    }
  });

  // Dominant decision type
  const typeCounts = new Map<DecisionType, number>();
  nodes.forEach(n => {
    typeCounts.set(n.decisionType, (typeCounts.get(n.decisionType) || 0) + 1);
  });

  let dominantDecisionType: DecisionType = 'operational';
  let maxTypeCount = 0;
  typeCounts.forEach((count, type) => {
    if (count > maxTypeCount) {
      maxTypeCount = count;
      dominantDecisionType = type;
    }
  });

  // Time span
  const timestamps = nodes.map(n => n.timestamp);
  const timeSpan = Math.max(...timestamps) - Math.min(...timestamps);

  return {
    totalDecisions: nodes.length,
    avgContextSize: Math.round(avgContextSize * 10) / 10,
    avgConsequences: Math.round(avgConsequences * 10) / 10,
    mostActiveAgent,
    dominantDecisionType,
    timeSpan,
  };
}

// ─────────────────────────────────────────────────────
// TIMELINE BUILDING
// ─────────────────────────────────────────────────────

function buildDecisionTimeline(
  nodes: DecisionNode[],
  clusters: DecisionCluster[]
): DecisionTimelinePoint[] {
  // Map decision ID to cluster ID
  const decisionToCluster = new Map<string, string>();
  clusters.forEach(c => {
    c.decisionIds.forEach(d => {
      decisionToCluster.set(d, c.id);
    });
  });

  // Sort nodes by timestamp
  const sorted = [...nodes].sort((a, b) => a.timestamp - b.timestamp);

  // Build timeline with cumulative impact
  let cumulativeImpact = 0;
  
  return sorted.map(node => {
    const impact = calculateImpactScore(node);
    cumulativeImpact += impact;

    return {
      timestamp: node.timestamp,
      decisionId: node.decisionId,
      clusterId: decisionToCluster.get(node.decisionId),
      impact,
      cumulativeImpact,
    };
  });
}

function calculateImpactScore(node: DecisionNode): number {
  let score = 0;

  // Base score from consequences
  score += node.consequenceCount * 2;

  // Complexity bonus
  if (node.complexity === 'complex') score += 3;
  else if (node.complexity === 'moderate') score += 1;

  // Impact level
  if (node.impact === 'high') score += 5;
  else if (node.impact === 'medium') score += 2;

  // Agent involvement
  score += node.agentsInvolved.length;

  return score;
}

// ─────────────────────────────────────────────────────
// ADVANCED ANALYSIS FUNCTIONS
// ─────────────────────────────────────────────────────

/**
 * Compare decisions using k-means clustering.
 */
export function compareMultipleDecisionsKMeans(
  events: TimelineXREvent[],
  k: number = 3,
  config: ComparisonConfig = DEFAULT_COMPARISON_CONFIG
): MultiDecisionComparisonResult {
  const nodes = extractDecisionNodes(events);

  if (nodes.length === 0) {
    return createEmptyResult();
  }

  const clusters = clusterDecisionsKMeans(nodes, k);
  const insights = generateDecisionInsights(nodes, clusters, config);
  const patterns = detectDecisionPatterns(nodes);
  const globalMetrics = calculateGlobalMetrics(nodes);
  const timeline = buildDecisionTimeline(nodes, clusters);

  return {
    nodes,
    clusters,
    insights,
    globalMetrics,
    patterns,
    timeline,
  };
}

/**
 * Filter and compare decisions by type.
 */
export function compareDecisionsByType(
  events: TimelineXREvent[],
  types: DecisionType[],
  config: ComparisonConfig = DEFAULT_COMPARISON_CONFIG
): MultiDecisionComparisonResult {
  const allNodes = extractDecisionNodes(events);
  const nodes = allNodes.filter(n => types.includes(n.decisionType));

  if (nodes.length === 0) {
    return createEmptyResult();
  }

  const clusters = clusterDecisions(nodes, config);
  const insights = generateDecisionInsights(nodes, clusters, config);
  const patterns = detectDecisionPatterns(nodes);
  const globalMetrics = calculateGlobalMetrics(nodes);
  const timeline = buildDecisionTimeline(nodes, clusters);

  return {
    nodes,
    clusters,
    insights,
    globalMetrics,
    patterns,
    timeline,
  };
}

/**
 * Compare decisions within a time range.
 */
export function compareDecisionsInRange(
  events: TimelineXREvent[],
  startTime: number,
  endTime: number,
  config: ComparisonConfig = DEFAULT_COMPARISON_CONFIG
): MultiDecisionComparisonResult {
  const allNodes = extractDecisionNodes(events);
  const nodes = allNodes.filter(n => 
    n.timestamp >= startTime && n.timestamp <= endTime
  );

  if (nodes.length === 0) {
    return createEmptyResult();
  }

  const clusters = clusterDecisions(nodes, config);
  const insights = generateDecisionInsights(nodes, clusters, config);
  const patterns = detectDecisionPatterns(nodes);
  const globalMetrics = calculateGlobalMetrics(nodes);
  const timeline = buildDecisionTimeline(nodes, clusters);

  return {
    nodes,
    clusters,
    insights,
    globalMetrics,
    patterns,
    timeline,
  };
}

/**
 * Compare decisions involving specific agents.
 */
export function compareDecisionsByAgents(
  events: TimelineXREvent[],
  agentIds: string[],
  config: ComparisonConfig = DEFAULT_COMPARISON_CONFIG
): MultiDecisionComparisonResult {
  const allNodes = extractDecisionNodes(events);
  const nodes = allNodes.filter(n =>
    n.agentsInvolved.some(a => agentIds.includes(a))
  );

  if (nodes.length === 0) {
    return createEmptyResult();
  }

  const clusters = clusterDecisions(nodes, config);
  const insights = generateDecisionInsights(nodes, clusters, config);
  const patterns = detectDecisionPatterns(nodes);
  const globalMetrics = calculateGlobalMetrics(nodes);
  const timeline = buildDecisionTimeline(nodes, clusters);

  return {
    nodes,
    clusters,
    insights,
    globalMetrics,
    patterns,
    timeline,
  };
}

// ─────────────────────────────────────────────────────
// SUMMARY FUNCTIONS
// ─────────────────────────────────────────────────────

/**
 * Generate a text summary of the comparison result.
 */
export function generateComparisonSummary(
  result: MultiDecisionComparisonResult
): string {
  const { nodes, clusters, insights, globalMetrics, patterns } = result;

  const lines: string[] = [];

  // Header
  lines.push(`# Analyse de ${globalMetrics.totalDecisions} décisions`);
  lines.push('');

  // Global metrics
  lines.push('## Métriques globales');
  lines.push(`- Contexte moyen: ${globalMetrics.avgContextSize} événements`);
  lines.push(`- Conséquences moyennes: ${globalMetrics.avgConsequences} événements`);
  lines.push(`- Agent le plus actif: ${globalMetrics.mostActiveAgent || 'N/A'}`);
  lines.push(`- Type dominant: ${globalMetrics.dominantDecisionType}`);
  lines.push(`- Durée: ${Math.round(globalMetrics.timeSpan / 60000)} minutes`);
  lines.push('');

  // Clusters
  if (clusters.length > 0) {
    lines.push('## Groupes de décisions');
    clusters.forEach(c => {
      lines.push(`- **${c.name}**: ${c.decisionIds.length} décisions (cohésion: ${Math.round(c.cohesionScore * 100)}%)`);
    });
    lines.push('');
  }

  // Key insights
  const keyInsights = insights.filter(i => i.severity !== 'info').slice(0, 5);
  if (keyInsights.length > 0) {
    lines.push('## Insights clés');
    keyInsights.forEach(i => {
      const icon = i.severity === 'high' ? '🔴' : i.severity === 'medium' ? '🟡' : 'ℹ️';
      lines.push(`- ${icon} **${i.title}**: ${i.description}`);
    });
    lines.push('');
  }

  // Patterns
  if (patterns.length > 0) {
    lines.push('## Patterns détectés');
    patterns.slice(0, 3).forEach(p => {
      lines.push(`- **${p.name}**: ${p.description} (confiance: ${Math.round(p.confidence * 100)}%)`);
    });
  }

  return lines.join('\n');
}

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default compareMultipleDecisions;
