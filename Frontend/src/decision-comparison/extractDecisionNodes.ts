/* =====================================================
   CHE·NU — Extract Decision Nodes
   
   Extracts decision nodes for multi-decision analysis.
   Each node represents a decision with its metadata.
   ===================================================== */

import { TimelineXREvent } from '../xr/meeting/xrReplay.types';
import {
  DecisionNode,
  DecisionType,
} from './decisionComparison.types';

// ─────────────────────────────────────────────────────
// MAIN EXTRACTION
// ─────────────────────────────────────────────────────

/**
 * Extract decision nodes from timeline events.
 * Each node contains metadata about a single decision.
 */
export function extractDecisionNodes(
  events: TimelineXREvent[],
  contextWindowMs: number = 3600000,    // 1 hour
  consequenceWindowMs: number = 3600000 // 1 hour
): DecisionNode[] {
  // Sort events by timestamp
  const sortedEvents = [...events].sort((a, b) => a.timestamp - b.timestamp);

  // Filter to decision events only
  const decisionEvents = sortedEvents.filter(e =>
    e.type === 'decision_confirm' ||
    e.type === 'decision_select' ||
    e.type === 'decision_propose'
  );

  return decisionEvents.map(decision => {
    // Count context events (within window before decision)
    const contextEvents = sortedEvents.filter(e =>
      e.timestamp < decision.timestamp &&
      e.timestamp >= decision.timestamp - contextWindowMs
    );

    // Count consequence events (within window after decision)
    const consequenceEvents = sortedEvents.filter(e =>
      e.timestamp > decision.timestamp &&
      e.timestamp <= decision.timestamp + consequenceWindowMs
    );

    // Extract unique agents involved
    const agentsInvolved = extractAgentsFromEvents([
      ...contextEvents,
      decision,
      ...consequenceEvents,
    ]);

    // Determine primary agent (most contributions)
    const primaryAgent = findPrimaryAgent(contextEvents);

    // Calculate context duration
    const contextDuration = contextEvents.length > 0
      ? decision.timestamp - contextEvents[0].timestamp
      : 0;

    // Calculate consequence duration
    const consequenceDuration = consequenceEvents.length > 0
      ? consequenceEvents[consequenceEvents.length - 1].timestamp - decision.timestamp
      : 0;

    // Classify decision
    const decisionType = classifyDecision(decision, contextEvents);
    const complexity = calculateComplexity(contextEvents, consequenceEvents, agentsInvolved);
    const impact = calculateImpact(consequenceEvents);

    return {
      decisionId: decision.id,
      timestamp: decision.timestamp,
      summary: decision.summary,
      contextSize: contextEvents.length,
      contextDuration,
      agentsInvolved,
      primaryAgent,
      consequenceCount: consequenceEvents.length,
      consequenceDuration,
      decisionType,
      complexity,
      impact,
    };
  });
}

// ─────────────────────────────────────────────────────
// AGENT EXTRACTION
// ─────────────────────────────────────────────────────

function extractAgentsFromEvents(events: TimelineXREvent[]): string[] {
  const agents = new Set<string>();

  events.forEach(e => {
    if (e.actorType === 'agent' && e.actorId) {
      agents.add(e.actorId);
    }
  });

  return Array.from(agents);
}

function findPrimaryAgent(events: TimelineXREvent[]): string | undefined {
  const agentCounts = new Map<string, number>();

  events.forEach(e => {
    if (e.actorType === 'agent' && e.actorId) {
      agentCounts.set(e.actorId, (agentCounts.get(e.actorId) || 0) + 1);
    }
  });

  if (agentCounts.size === 0) return undefined;

  let maxCount = 0;
  let primaryAgent: string | undefined;

  agentCounts.forEach((count, agentId) => {
    if (count > maxCount) {
      maxCount = count;
      primaryAgent = agentId;
    }
  });

  return primaryAgent;
}

// ─────────────────────────────────────────────────────
// CLASSIFICATION
// ─────────────────────────────────────────────────────

function classifyDecision(
  decision: TimelineXREvent,
  contextEvents: TimelineXREvent[]
): DecisionType {
  const summary = decision.summary.toLowerCase();
  const contextText = contextEvents.map(e => e.summary.toLowerCase()).join(' ');

  // Strategic keywords
  if (
    summary.includes('stratégi') ||
    summary.includes('vision') ||
    summary.includes('long terme') ||
    summary.includes('direction')
  ) {
    return 'strategic';
  }

  // Corrective keywords
  if (
    summary.includes('corrig') ||
    summary.includes('fix') ||
    summary.includes('réparer') ||
    summary.includes('erreur') ||
    contextText.includes('problème') ||
    contextText.includes('issue')
  ) {
    return 'corrective';
  }

  // Preventive keywords
  if (
    summary.includes('prévent') ||
    summary.includes('éviter') ||
    summary.includes('anticip') ||
    summary.includes('risque')
  ) {
    return 'preventive';
  }

  // Exploratory keywords
  if (
    summary.includes('explor') ||
    summary.includes('test') ||
    summary.includes('essai') ||
    summary.includes('expéri')
  ) {
    return 'exploratory';
  }

  // Confirmatory keywords
  if (
    summary.includes('confirm') ||
    summary.includes('valid') ||
    summary.includes('approuv')
  ) {
    return 'confirmatory';
  }

  // Tactical (short-term)
  if (
    summary.includes('immédiat') ||
    summary.includes('urgent') ||
    summary.includes('aujourd')
  ) {
    return 'tactical';
  }

  // Default to operational
  return 'operational';
}

function calculateComplexity(
  contextEvents: TimelineXREvent[],
  consequenceEvents: TimelineXREvent[],
  agents: string[]
): 'simple' | 'moderate' | 'complex' {
  const score = 
    (contextEvents.length * 0.3) +
    (consequenceEvents.length * 0.3) +
    (agents.length * 2);

  if (score > 10) return 'complex';
  if (score > 5) return 'moderate';
  return 'simple';
}

function calculateImpact(
  consequenceEvents: TimelineXREvent[]
): 'low' | 'medium' | 'high' {
  // High impact: many consequences or includes phase changes
  const hasPhaseChange = consequenceEvents.some(e => e.type === 'phase_change');
  
  if (hasPhaseChange || consequenceEvents.length > 5) {
    return 'high';
  }
  
  if (consequenceEvents.length > 2) {
    return 'medium';
  }
  
  return 'low';
}

// ─────────────────────────────────────────────────────
// FILTERING
// ─────────────────────────────────────────────────────

/**
 * Filter decision nodes by type.
 */
export function filterNodesByType(
  nodes: DecisionNode[],
  types: DecisionType[]
): DecisionNode[] {
  return nodes.filter(n => types.includes(n.decisionType));
}

/**
 * Filter decision nodes by complexity.
 */
export function filterNodesByComplexity(
  nodes: DecisionNode[],
  complexity: DecisionNode['complexity']
): DecisionNode[] {
  return nodes.filter(n => n.complexity === complexity);
}

/**
 * Filter decision nodes by impact.
 */
export function filterNodesByImpact(
  nodes: DecisionNode[],
  impact: DecisionNode['impact']
): DecisionNode[] {
  return nodes.filter(n => n.impact === impact);
}

/**
 * Filter decision nodes by agent involvement.
 */
export function filterNodesByAgent(
  nodes: DecisionNode[],
  agentId: string
): DecisionNode[] {
  return nodes.filter(n => n.agentsInvolved.includes(agentId));
}

/**
 * Filter decision nodes by time range.
 */
export function filterNodesByTimeRange(
  nodes: DecisionNode[],
  startTime: number,
  endTime: number
): DecisionNode[] {
  return nodes.filter(n => 
    n.timestamp >= startTime && n.timestamp <= endTime
  );
}

// ─────────────────────────────────────────────────────
// SORTING
// ─────────────────────────────────────────────────────

export type SortField = 
  | 'timestamp'
  | 'contextSize'
  | 'consequenceCount'
  | 'agentCount'
  | 'impact';

/**
 * Sort decision nodes by a field.
 */
export function sortNodes(
  nodes: DecisionNode[],
  field: SortField,
  ascending: boolean = true
): DecisionNode[] {
  const sorted = [...nodes].sort((a, b) => {
    let aVal: number;
    let bVal: number;

    switch (field) {
      case 'timestamp':
        aVal = a.timestamp;
        bVal = b.timestamp;
        break;
      case 'contextSize':
        aVal = a.contextSize;
        bVal = b.contextSize;
        break;
      case 'consequenceCount':
        aVal = a.consequenceCount;
        bVal = b.consequenceCount;
        break;
      case 'agentCount':
        aVal = a.agentsInvolved.length;
        bVal = b.agentsInvolved.length;
        break;
      case 'impact':
        const impactOrder = { low: 1, medium: 2, high: 3 };
        aVal = impactOrder[a.impact];
        bVal = impactOrder[b.impact];
        break;
      default:
        aVal = a.timestamp;
        bVal = b.timestamp;
    }

    return ascending ? aVal - bVal : bVal - aVal;
  });

  return sorted;
}

// ─────────────────────────────────────────────────────
// STATISTICS
// ─────────────────────────────────────────────────────

export interface NodeStatistics {
  total: number;
  byType: Record<DecisionType, number>;
  byComplexity: Record<DecisionNode['complexity'], number>;
  byImpact: Record<DecisionNode['impact'], number>;
  avgContextSize: number;
  avgConsequenceCount: number;
  avgAgentCount: number;
  timeSpan: number;
}

/**
 * Calculate statistics for decision nodes.
 */
export function calculateNodeStatistics(nodes: DecisionNode[]): NodeStatistics {
  if (nodes.length === 0) {
    return {
      total: 0,
      byType: {} as Record<DecisionType, number>,
      byComplexity: { simple: 0, moderate: 0, complex: 0 },
      byImpact: { low: 0, medium: 0, high: 0 },
      avgContextSize: 0,
      avgConsequenceCount: 0,
      avgAgentCount: 0,
      timeSpan: 0,
    };
  }

  const byType: Record<string, number> = {};
  const byComplexity = { simple: 0, moderate: 0, complex: 0 };
  const byImpact = { low: 0, medium: 0, high: 0 };

  let totalContextSize = 0;
  let totalConsequences = 0;
  let totalAgents = 0;

  nodes.forEach(n => {
    byType[n.decisionType] = (byType[n.decisionType] || 0) + 1;
    byComplexity[n.complexity]++;
    byImpact[n.impact]++;
    totalContextSize += n.contextSize;
    totalConsequences += n.consequenceCount;
    totalAgents += n.agentsInvolved.length;
  });

  const timestamps = nodes.map(n => n.timestamp);
  const timeSpan = Math.max(...timestamps) - Math.min(...timestamps);

  return {
    total: nodes.length,
    byType: byType as Record<DecisionType, number>,
    byComplexity,
    byImpact,
    avgContextSize: totalContextSize / nodes.length,
    avgConsequenceCount: totalConsequences / nodes.length,
    avgAgentCount: totalAgents / nodes.length,
    timeSpan,
  };
}

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default extractDecisionNodes;
