/* =====================================================
   CHE·NU — Compare Decision Snapshots
   
   Compares two decision snapshots to find divergences,
   similarities, and calculate similarity scores.
   ===================================================== */

import { TimelineXREvent } from '../xr/meeting/xrReplay.types';
import {
  DecisionSnapshot,
  DecisionComparisonResult,
  DecisionDivergences,
  DecisionSimilarities,
  DivergenceItem,
  ComparisonAnalysis,
  ComparisonConfig,
  DEFAULT_COMPARISON_CONFIG,
} from './decisionComparison.types';

// ─────────────────────────────────────────────────────
// MAIN COMPARISON
// ─────────────────────────────────────────────────────

/**
 * Compare two decision snapshots and analyze their differences.
 */
export function compareDecisionSnapshots(
  left: DecisionSnapshot,
  right: DecisionSnapshot,
  config: ComparisonConfig = DEFAULT_COMPARISON_CONFIG
): DecisionComparisonResult {
  // Calculate divergences
  const divergences = calculateDivergences(left, right);
  
  // Find similarities
  const similarities = findSimilarities(left, right);
  
  // Calculate detailed scores
  const scores = calculateDetailedScores(left, right, similarities);
  
  // Calculate weighted similarity score
  const similarityScore = calculateWeightedScore(scores, config.weights);
  
  // Generate analysis
  const analysis = generateAnalysis(left, right, divergences, similarities, scores);

  return {
    left,
    right,
    divergences,
    similarities,
    similarityScore,
    scores,
    analysis,
  };
}

// ─────────────────────────────────────────────────────
// DIVERGENCES
// ─────────────────────────────────────────────────────

function calculateDivergences(
  left: DecisionSnapshot,
  right: DecisionSnapshot
): DecisionDivergences {
  const context: DivergenceItem[] = [];
  const decision: DivergenceItem[] = [];
  const outcomes: DivergenceItem[] = [];

  // === CONTEXT DIVERGENCES ===
  
  // Context size difference
  const contextSizeDiff = Math.abs(left.contextEvents.length - right.contextEvents.length);
  if (contextSizeDiff > 0) {
    context.push({
      category: 'context',
      severity: contextSizeDiff > 3 ? 'high' : contextSizeDiff > 1 ? 'medium' : 'low',
      description: 'Nombre d\'événements contextuels différent',
      leftValue: left.contextEvents.length,
      rightValue: right.contextEvents.length,
    });
  }

  // Context duration difference
  const durationDiff = Math.abs(left.metrics.contextDuration - right.metrics.contextDuration);
  if (durationDiff > 10000) { // More than 10 seconds
    context.push({
      category: 'context',
      severity: durationDiff > 60000 ? 'high' : 'medium',
      description: 'Durée de contexte significativement différente',
      leftValue: Math.round(left.metrics.contextDuration / 1000) + 's',
      rightValue: Math.round(right.metrics.contextDuration / 1000) + 's',
    });
  }

  // Agent involvement difference
  const agentDiff = Math.abs(left.metrics.agentContributions - right.metrics.agentContributions);
  if (agentDiff > 0) {
    context.push({
      category: 'context',
      severity: agentDiff > 2 ? 'high' : 'medium',
      description: 'Nombre d\'agents impliqués différent',
      leftValue: left.metrics.agentContributions,
      rightValue: right.metrics.agentContributions,
    });
  }

  // === DECISION DIVERGENCES ===

  // Summary difference
  if (left.decisionEvent.summary !== right.decisionEvent.summary) {
    const similarity = stringSimilarity(
      left.decisionEvent.summary,
      right.decisionEvent.summary
    );
    decision.push({
      category: 'decision',
      severity: similarity < 0.3 ? 'high' : similarity < 0.6 ? 'medium' : 'low',
      description: 'Résumé de décision différent',
      leftValue: left.decisionEvent.summary,
      rightValue: right.decisionEvent.summary,
    });
  }

  // Decision type difference
  if (left.decisionEvent.type !== right.decisionEvent.type) {
    decision.push({
      category: 'decision',
      severity: 'high',
      description: 'Type de décision différent',
      leftValue: left.decisionEvent.type,
      rightValue: right.decisionEvent.type,
    });
  }

  // Actor difference
  if (left.decisionEvent.actorId !== right.decisionEvent.actorId) {
    decision.push({
      category: 'decision',
      severity: 'medium',
      description: 'Décideur différent',
      leftValue: left.decisionEvent.actorName || left.decisionEvent.actorId,
      rightValue: right.decisionEvent.actorName || right.decisionEvent.actorId,
    });
  }

  // === OUTCOME DIVERGENCES ===

  // Consequence count difference
  const consequenceDiff = Math.abs(
    left.consequenceEvents.length - right.consequenceEvents.length
  );
  if (consequenceDiff > 0) {
    outcomes.push({
      category: 'outcome',
      severity: consequenceDiff > 3 ? 'high' : consequenceDiff > 1 ? 'medium' : 'low',
      description: 'Nombre de conséquences différent',
      leftValue: left.consequenceEvents.length,
      rightValue: right.consequenceEvents.length,
    });
  }

  // Consequence duration difference
  const conseqDurationDiff = Math.abs(
    left.metrics.consequenceDuration - right.metrics.consequenceDuration
  );
  if (conseqDurationDiff > 10000) {
    outcomes.push({
      category: 'outcome',
      severity: conseqDurationDiff > 60000 ? 'high' : 'medium',
      description: 'Durée des conséquences différente',
      leftValue: Math.round(left.metrics.consequenceDuration / 1000) + 's',
      rightValue: Math.round(right.metrics.consequenceDuration / 1000) + 's',
    });
  }

  // Consequence types difference
  const leftTypes = new Set(left.consequenceEvents.map(e => e.type));
  const rightTypes = new Set(right.consequenceEvents.map(e => e.type));
  const typeDiff = symmetricDifference(leftTypes, rightTypes);
  if (typeDiff.size > 0) {
    outcomes.push({
      category: 'outcome',
      severity: typeDiff.size > 2 ? 'high' : 'medium',
      description: 'Types de conséquences différents',
      leftValue: Array.from(leftTypes).join(', '),
      rightValue: Array.from(rightTypes).join(', '),
    });
  }

  return { context, decision, outcomes };
}

// ─────────────────────────────────────────────────────
// SIMILARITIES
// ─────────────────────────────────────────────────────

function findSimilarities(
  left: DecisionSnapshot,
  right: DecisionSnapshot
): DecisionSimilarities {
  // Find shared agents
  const leftAgents = extractAgentIds(left);
  const rightAgents = extractAgentIds(right);
  const sharedAgents = intersection(leftAgents, rightAgents);

  // Find shared event types
  const leftTypes = new Set([
    ...left.contextEvents.map(e => e.type),
    ...left.consequenceEvents.map(e => e.type),
  ]);
  const rightTypes = new Set([
    ...right.contextEvents.map(e => e.type),
    ...right.consequenceEvents.map(e => e.type),
  ]);
  const sharedEventTypes = intersection(leftTypes, rightTypes);

  // Identify common patterns
  const commonPatterns: string[] = [];

  // Same decision type
  if (left.decisionEvent.type === right.decisionEvent.type) {
    commonPatterns.push(`Même type de décision: ${left.decisionEvent.type}`);
  }

  // Similar context size
  if (Math.abs(left.contextEvents.length - right.contextEvents.length) <= 1) {
    commonPatterns.push('Contexte de taille similaire');
  }

  // Similar outcome count
  if (Math.abs(left.consequenceEvents.length - right.consequenceEvents.length) <= 1) {
    commonPatterns.push('Nombre de conséquences similaire');
  }

  // Same sphere
  if (left.decisionEvent.sphereId === right.decisionEvent.sphereId) {
    commonPatterns.push(`Même sphère: ${left.decisionEvent.sphereId}`);
  }

  // Similar agent involvement
  if (sharedAgents.length > 0) {
    commonPatterns.push(`${sharedAgents.length} agent(s) en commun`);
  }

  return {
    sharedAgents: Array.from(sharedAgents),
    sharedEventTypes: Array.from(sharedEventTypes),
    commonPatterns,
  };
}

// ─────────────────────────────────────────────────────
// DETAILED SCORES
// ─────────────────────────────────────────────────────

function calculateDetailedScores(
  left: DecisionSnapshot,
  right: DecisionSnapshot,
  similarities: DecisionSimilarities
): DecisionComparisonResult['scores'] {
  // Context similarity (based on event count and types)
  const contextSimilarity = calculateContextSimilarity(left, right);

  // Decision similarity (based on type, summary, actor)
  const decisionSimilarity = calculateDecisionSimilarity(left, right);

  // Outcome similarity (based on consequence events)
  const outcomeSimilarity = calculateOutcomeSimilarity(left, right);

  // Agent overlap
  const leftAgents = extractAgentIds(left);
  const rightAgents = extractAgentIds(right);
  const agentOverlap = leftAgents.size > 0 || rightAgents.size > 0
    ? intersection(leftAgents, rightAgents).length / 
      union(leftAgents, rightAgents).size
    : 1;

  // Timing alignment (relative timing of events)
  const timingAlignment = calculateTimingAlignment(left, right);

  return {
    contextSimilarity,
    decisionSimilarity,
    outcomeSimilarity,
    agentOverlap,
    timingAlignment,
  };
}

function calculateContextSimilarity(
  left: DecisionSnapshot,
  right: DecisionSnapshot
): number {
  if (left.contextEvents.length === 0 && right.contextEvents.length === 0) {
    return 1;
  }

  const maxCount = Math.max(left.contextEvents.length, right.contextEvents.length);
  const countSimilarity = 1 - Math.abs(
    left.contextEvents.length - right.contextEvents.length
  ) / maxCount;

  // Type overlap
  const leftTypes = new Set(left.contextEvents.map(e => e.type));
  const rightTypes = new Set(right.contextEvents.map(e => e.type));
  const typeOverlap = leftTypes.size > 0 || rightTypes.size > 0
    ? intersection(leftTypes, rightTypes).length / union(leftTypes, rightTypes).size
    : 1;

  return (countSimilarity + typeOverlap) / 2;
}

function calculateDecisionSimilarity(
  left: DecisionSnapshot,
  right: DecisionSnapshot
): number {
  let score = 0;
  let factors = 0;

  // Type match (40%)
  if (left.decisionEvent.type === right.decisionEvent.type) {
    score += 0.4;
  }
  factors += 0.4;

  // Summary similarity (40%)
  const summarySim = stringSimilarity(
    left.decisionEvent.summary,
    right.decisionEvent.summary
  );
  score += summarySim * 0.4;
  factors += 0.4;

  // Actor match (20%)
  if (left.decisionEvent.actorId === right.decisionEvent.actorId) {
    score += 0.2;
  }
  factors += 0.2;

  return score / factors;
}

function calculateOutcomeSimilarity(
  left: DecisionSnapshot,
  right: DecisionSnapshot
): number {
  if (left.consequenceEvents.length === 0 && right.consequenceEvents.length === 0) {
    return 1;
  }

  const maxCount = Math.max(
    left.consequenceEvents.length,
    right.consequenceEvents.length
  );
  if (maxCount === 0) return 1;

  const countSimilarity = 1 - Math.abs(
    left.consequenceEvents.length - right.consequenceEvents.length
  ) / maxCount;

  // Type overlap
  const leftTypes = new Set(left.consequenceEvents.map(e => e.type));
  const rightTypes = new Set(right.consequenceEvents.map(e => e.type));
  const typeOverlap = leftTypes.size > 0 || rightTypes.size > 0
    ? intersection(leftTypes, rightTypes).length / union(leftTypes, rightTypes).size
    : 1;

  return (countSimilarity + typeOverlap) / 2;
}

function calculateTimingAlignment(
  left: DecisionSnapshot,
  right: DecisionSnapshot
): number {
  // Normalize event positions to 0-1 range and compare distribution
  const leftPositions = normalizeEventPositions(left);
  const rightPositions = normalizeEventPositions(right);

  if (leftPositions.length === 0 || rightPositions.length === 0) {
    return leftPositions.length === rightPositions.length ? 1 : 0;
  }

  // Compare distributions using simple difference
  const minLen = Math.min(leftPositions.length, rightPositions.length);
  let totalDiff = 0;

  for (let i = 0; i < minLen; i++) {
    totalDiff += Math.abs(leftPositions[i] - rightPositions[i]);
  }

  // Penalize length difference
  const lengthPenalty = Math.abs(leftPositions.length - rightPositions.length) * 0.1;

  return Math.max(0, 1 - (totalDiff / minLen) - lengthPenalty);
}

function normalizeEventPositions(snapshot: DecisionSnapshot): number[] {
  const allEvents = [
    ...snapshot.contextEvents,
    snapshot.decisionEvent,
    ...snapshot.consequenceEvents,
  ];

  if (allEvents.length <= 1) return [];

  const timestamps = allEvents.map(e => e.timestamp);
  const min = Math.min(...timestamps);
  const max = Math.max(...timestamps);
  const range = max - min;

  if (range === 0) return timestamps.map(() => 0.5);

  return timestamps.map(t => (t - min) / range);
}

// ─────────────────────────────────────────────────────
// WEIGHTED SCORE
// ─────────────────────────────────────────────────────

function calculateWeightedScore(
  scores: DecisionComparisonResult['scores'],
  weights: ComparisonConfig['weights']
): number {
  return (
    scores.contextSimilarity * weights.context +
    scores.decisionSimilarity * weights.decision +
    scores.outcomeSimilarity * weights.outcome +
    scores.agentOverlap * weights.agents +
    scores.timingAlignment * weights.timing
  );
}

// ─────────────────────────────────────────────────────
// ANALYSIS
// ─────────────────────────────────────────────────────

function generateAnalysis(
  left: DecisionSnapshot,
  right: DecisionSnapshot,
  divergences: DecisionDivergences,
  similarities: DecisionSimilarities,
  scores: DecisionComparisonResult['scores']
): ComparisonAnalysis {
  const keyDifferences: string[] = [];
  const recommendations: string[] = [];

  // Identify key differences
  const highSeverity = [
    ...divergences.context,
    ...divergences.decision,
    ...divergences.outcomes,
  ].filter(d => d.severity === 'high');

  highSeverity.forEach(d => {
    keyDifferences.push(d.description);
  });

  // Generate recommendations
  if (scores.contextSimilarity < 0.5) {
    recommendations.push(
      'Les contextes sont très différents - examiner les conditions préalables'
    );
  }

  if (scores.decisionSimilarity < 0.5) {
    recommendations.push(
      'Les décisions sont fondamentalement différentes - comparer les objectifs'
    );
  }

  if (scores.outcomeSimilarity < 0.5) {
    recommendations.push(
      'Les résultats divergent significativement - analyser les facteurs d\'impact'
    );
  }

  if (scores.agentOverlap < 0.3) {
    recommendations.push(
      'Peu d\'agents en commun - considérer l\'harmonisation des équipes'
    );
  }

  // Generate summary
  const overallScore = (
    scores.contextSimilarity +
    scores.decisionSimilarity +
    scores.outcomeSimilarity
  ) / 3;

  let summary: string;
  if (overallScore > 0.8) {
    summary = 'Les deux décisions sont très similaires dans leur contexte, nature et résultats.';
  } else if (overallScore > 0.6) {
    summary = 'Les décisions présentent des similitudes modérées avec quelques divergences notables.';
  } else if (overallScore > 0.4) {
    summary = 'Les décisions diffèrent significativement sur plusieurs aspects importants.';
  } else {
    summary = 'Les décisions sont fondamentalement différentes dans leur approche et leurs résultats.';
  }

  // Calculate confidence
  const confidence = similarities.commonPatterns.length > 0 ? 0.8 : 0.6;

  return {
    summary,
    keyDifferences,
    recommendations,
    confidence,
  };
}

// ─────────────────────────────────────────────────────
// UTILITY FUNCTIONS
// ─────────────────────────────────────────────────────

function extractAgentIds(snapshot: DecisionSnapshot): Set<string> {
  const agents = new Set<string>();
  const allEvents = [
    ...snapshot.contextEvents,
    snapshot.decisionEvent,
    ...snapshot.consequenceEvents,
  ];

  allEvents.forEach(e => {
    if (e.actorType === 'agent' && e.actorId) {
      agents.add(e.actorId);
    }
  });

  return agents;
}

function intersection<T>(a: Set<T>, b: Set<T>): T[] {
  return Array.from(a).filter(x => b.has(x));
}

function union<T>(a: Set<T>, b: Set<T>): Set<T> {
  return new Set([...a, ...b]);
}

function symmetricDifference<T>(a: Set<T>, b: Set<T>): Set<T> {
  const diff = new Set<T>();
  a.forEach(x => { if (!b.has(x)) diff.add(x); });
  b.forEach(x => { if (!a.has(x)) diff.add(x); });
  return diff;
}

function stringSimilarity(a: string, b: string): number {
  if (a === b) return 1;
  if (!a || !b) return 0;

  const aLower = a.toLowerCase();
  const bLower = b.toLowerCase();

  // Simple word overlap
  const aWords = new Set(aLower.split(/\s+/));
  const bWords = new Set(bLower.split(/\s+/));
  
  const common = intersection(aWords, bWords).length;
  const total = union(aWords, bWords).size;

  return total > 0 ? common / total : 0;
}

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default compareDecisionSnapshots;
