/* =====================================================
   CHE·NU — Cluster Decisions
   
   Groups similar decisions into clusters based on
   their characteristics (context, consequences, type).
   ===================================================== */

import {
  DecisionNode,
  DecisionCluster,
  DecisionType,
  ComparisonConfig,
  DEFAULT_COMPARISON_CONFIG,
} from './decisionComparison.types';

// ─────────────────────────────────────────────────────
// MAIN CLUSTERING
// ─────────────────────────────────────────────────────

/**
 * Cluster decisions based on similarity of characteristics.
 */
export function clusterDecisions(
  decisions: DecisionNode[],
  config: ComparisonConfig = DEFAULT_COMPARISON_CONFIG
): DecisionCluster[] {
  if (decisions.length === 0) return [];

  const clusters: DecisionCluster[] = [];
  const assigned = new Set<string>();

  // Sort by timestamp for consistent processing
  const sorted = [...decisions].sort((a, b) => a.timestamp - b.timestamp);

  sorted.forEach(decision => {
    if (assigned.has(decision.decisionId)) return;

    // Try to find matching cluster
    let matchedCluster = findMatchingCluster(decision, clusters, config);

    if (!matchedCluster) {
      // Create new cluster
      matchedCluster = createCluster(decision, clusters.length);
      clusters.push(matchedCluster);
    }

    // Add decision to cluster
    addDecisionToCluster(decision, matchedCluster);
    assigned.add(decision.decisionId);
  });

  // Filter out clusters below minimum size
  const validClusters = clusters.filter(c => 
    c.decisionIds.length >= config.minClusterSize
  );

  // Assign names to clusters
  validClusters.forEach(cluster => {
    cluster.name = generateClusterName(cluster, decisions);
  });

  // Calculate cohesion scores
  validClusters.forEach(cluster => {
    cluster.cohesionScore = calculateCohesion(cluster, decisions);
  });

  return validClusters;
}

// ─────────────────────────────────────────────────────
// CLUSTER MATCHING
// ─────────────────────────────────────────────────────

function findMatchingCluster(
  decision: DecisionNode,
  clusters: DecisionCluster[],
  config: ComparisonConfig
): DecisionCluster | null {
  for (const cluster of clusters) {
    if (isDecisionMatchingCluster(decision, cluster, config)) {
      return cluster;
    }
  }
  return null;
}

function isDecisionMatchingCluster(
  decision: DecisionNode,
  cluster: DecisionCluster,
  config: ComparisonConfig
): boolean {
  const threshold = config.clusterThreshold;

  // Check context size similarity
  const contextDiff = Math.abs(decision.contextSize - cluster.averageContextSize);
  if (contextDiff > threshold * 2) return false;

  // Check consequence count similarity
  const consequenceDiff = Math.abs(decision.consequenceCount - cluster.averageConsequences);
  if (consequenceDiff > threshold * 2) return false;

  // Check decision type compatibility
  if (cluster.dominantType && decision.decisionType !== cluster.dominantType) {
    // Allow if complexity is similar
    const complexityMatch = getComplexityScore(decision.complexity);
    const avgComplexity = cluster.averageComplexity;
    if (Math.abs(complexityMatch - avgComplexity) > 1) return false;
  }

  // Check agent overlap
  if (cluster.commonAgents.length > 0) {
    const overlap = decision.agentsInvolved.filter(a => 
      cluster.commonAgents.includes(a)
    );
    if (overlap.length === 0 && cluster.commonAgents.length > 0) {
      // No agent overlap, still allow if other criteria match closely
      if (contextDiff > threshold || consequenceDiff > threshold) {
        return false;
      }
    }
  }

  return true;
}

// ─────────────────────────────────────────────────────
// CLUSTER CREATION & UPDATE
// ─────────────────────────────────────────────────────

function createCluster(decision: DecisionNode, index: number): DecisionCluster {
  return {
    id: `cluster_${index + 1}`,
    name: '',
    decisionIds: [],
    averageContextSize: decision.contextSize,
    averageConsequences: decision.consequenceCount,
    averageComplexity: getComplexityScore(decision.complexity),
    dominantType: decision.decisionType,
    commonAgents: [...decision.agentsInvolved],
    cohesionScore: 1,
  };
}

function addDecisionToCluster(
  decision: DecisionNode,
  cluster: DecisionCluster
): void {
  const count = cluster.decisionIds.length;
  
  cluster.decisionIds.push(decision.decisionId);

  // Update running averages
  cluster.averageContextSize = 
    (cluster.averageContextSize * count + decision.contextSize) / (count + 1);
  
  cluster.averageConsequences = 
    (cluster.averageConsequences * count + decision.consequenceCount) / (count + 1);
  
  cluster.averageComplexity = 
    (cluster.averageComplexity * count + getComplexityScore(decision.complexity)) / (count + 1);

  // Update common agents (intersection)
  if (count === 0) {
    cluster.commonAgents = [...decision.agentsInvolved];
  } else {
    cluster.commonAgents = cluster.commonAgents.filter(a =>
      decision.agentsInvolved.includes(a)
    );
  }

  // Update dominant type
  cluster.dominantType = updateDominantType(cluster, decision);
}

function updateDominantType(
  cluster: DecisionCluster,
  newDecision: DecisionNode
): DecisionType {
  // Simple: keep most recent if types differ
  // In a more sophisticated version, we'd track type counts
  return newDecision.decisionType;
}

// ─────────────────────────────────────────────────────
// CLUSTER NAMING
// ─────────────────────────────────────────────────────

function generateClusterName(
  cluster: DecisionCluster,
  allDecisions: DecisionNode[]
): string {
  const decisions = allDecisions.filter(d => 
    cluster.decisionIds.includes(d.decisionId)
  );

  // Build name from characteristics
  const parts: string[] = [];

  // Type
  const typeNames: Record<DecisionType, string> = {
    strategic: 'Stratégiques',
    operational: 'Opérationnelles',
    tactical: 'Tactiques',
    corrective: 'Correctives',
    preventive: 'Préventives',
    exploratory: 'Exploratoires',
    confirmatory: 'Confirmatoires',
  };
  parts.push(`Décisions ${typeNames[cluster.dominantType] || 'Diverses'}`);

  // Complexity indicator
  if (cluster.averageComplexity > 2) {
    parts.push('complexes');
  } else if (cluster.averageComplexity < 1.5) {
    parts.push('simples');
  }

  // Impact indicator based on consequences
  if (cluster.averageConsequences > 5) {
    parts.push('(haut impact)');
  } else if (cluster.averageConsequences < 2) {
    parts.push('(impact limité)');
  }

  return parts.join(' ');
}

// ─────────────────────────────────────────────────────
// COHESION CALCULATION
// ─────────────────────────────────────────────────────

function calculateCohesion(
  cluster: DecisionCluster,
  allDecisions: DecisionNode[]
): number {
  const decisions = allDecisions.filter(d =>
    cluster.decisionIds.includes(d.decisionId)
  );

  if (decisions.length <= 1) return 1;

  // Calculate variance in key metrics
  const contextSizes = decisions.map(d => d.contextSize);
  const consequences = decisions.map(d => d.consequenceCount);
  const complexities = decisions.map(d => getComplexityScore(d.complexity));

  const contextVariance = calculateVariance(contextSizes);
  const consequenceVariance = calculateVariance(consequences);
  const complexityVariance = calculateVariance(complexities);

  // Higher variance = lower cohesion
  const avgVariance = (contextVariance + consequenceVariance + complexityVariance) / 3;
  
  // Normalize to 0-1 (assuming max variance ~10)
  const normalizedVariance = Math.min(avgVariance / 10, 1);
  
  return 1 - normalizedVariance;
}

function calculateVariance(values: number[]): number {
  if (values.length === 0) return 0;
  
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
  return squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
}

// ─────────────────────────────────────────────────────
// UTILITY
// ─────────────────────────────────────────────────────

function getComplexityScore(complexity: DecisionNode['complexity']): number {
  switch (complexity) {
    case 'simple': return 1;
    case 'moderate': return 2;
    case 'complex': return 3;
    default: return 2;
  }
}

// ─────────────────────────────────────────────────────
// ADVANCED CLUSTERING
// ─────────────────────────────────────────────────────

/**
 * Cluster decisions using k-means-like algorithm.
 */
export function clusterDecisionsKMeans(
  decisions: DecisionNode[],
  k: number = 3,
  maxIterations: number = 10
): DecisionCluster[] {
  if (decisions.length < k) {
    return clusterDecisions(decisions);
  }

  // Initialize centroids from first k decisions
  let centroids = decisions.slice(0, k).map((d, i) => ({
    contextSize: d.contextSize,
    consequences: d.consequenceCount,
    complexity: getComplexityScore(d.complexity),
  }));

  let assignments = new Array(decisions.length).fill(0);

  for (let iter = 0; iter < maxIterations; iter++) {
    // Assign each decision to nearest centroid
    const newAssignments = decisions.map(d => {
      let minDist = Infinity;
      let bestCluster = 0;

      centroids.forEach((c, i) => {
        const dist = Math.sqrt(
          Math.pow(d.contextSize - c.contextSize, 2) +
          Math.pow(d.consequenceCount - c.consequences, 2) +
          Math.pow(getComplexityScore(d.complexity) - c.complexity, 2)
        );
        if (dist < minDist) {
          minDist = dist;
          bestCluster = i;
        }
      });

      return bestCluster;
    });

    // Check convergence
    const changed = newAssignments.some((a, i) => a !== assignments[i]);
    assignments = newAssignments;

    if (!changed) break;

    // Update centroids
    centroids = centroids.map((_, i) => {
      const members = decisions.filter((_, j) => assignments[j] === i);
      if (members.length === 0) return centroids[i];

      return {
        contextSize: members.reduce((s, d) => s + d.contextSize, 0) / members.length,
        consequences: members.reduce((s, d) => s + d.consequenceCount, 0) / members.length,
        complexity: members.reduce((s, d) => s + getComplexityScore(d.complexity), 0) / members.length,
      };
    });
  }

  // Build clusters from assignments
  const clusters: DecisionCluster[] = [];

  for (let i = 0; i < k; i++) {
    const memberDecisions = decisions.filter((_, j) => assignments[j] === i);
    if (memberDecisions.length === 0) continue;

    const cluster: DecisionCluster = {
      id: `cluster_${i + 1}`,
      name: '',
      decisionIds: memberDecisions.map(d => d.decisionId),
      averageContextSize: centroids[i].contextSize,
      averageConsequences: centroids[i].consequences,
      averageComplexity: centroids[i].complexity,
      dominantType: findDominantType(memberDecisions),
      commonAgents: findCommonAgents(memberDecisions),
      cohesionScore: 0,
    };

    cluster.name = generateClusterName(cluster, decisions);
    cluster.cohesionScore = calculateCohesion(cluster, decisions);

    clusters.push(cluster);
  }

  return clusters;
}

function findDominantType(decisions: DecisionNode[]): DecisionType {
  const counts = new Map<DecisionType, number>();
  
  decisions.forEach(d => {
    counts.set(d.decisionType, (counts.get(d.decisionType) || 0) + 1);
  });

  let maxCount = 0;
  let dominant: DecisionType = 'operational';

  counts.forEach((count, type) => {
    if (count > maxCount) {
      maxCount = count;
      dominant = type;
    }
  });

  return dominant;
}

function findCommonAgents(decisions: DecisionNode[]): string[] {
  if (decisions.length === 0) return [];

  let common = new Set(decisions[0].agentsInvolved);

  for (let i = 1; i < decisions.length; i++) {
    const agents = new Set(decisions[i].agentsInvolved);
    common = new Set([...common].filter(a => agents.has(a)));
  }

  return Array.from(common);
}

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default clusterDecisions;
