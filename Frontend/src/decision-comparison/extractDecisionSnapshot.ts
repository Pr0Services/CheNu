/* =====================================================
   CHE·NU — Extract Decision Snapshot
   
   Extracts a complete snapshot of a decision including
   context events before and consequences after.
   ===================================================== */

import { TimelineXREvent } from '../xr/meeting/xrReplay.types';
import {
  DecisionSnapshot,
  DecisionMetrics,
  DEFAULT_COMPARISON_CONFIG,
} from './decisionComparison.types';

// ─────────────────────────────────────────────────────
// MAIN EXTRACTION
// ─────────────────────────────────────────────────────

/**
 * Extract a complete decision snapshot from timeline events.
 * 
 * @param events - All timeline events
 * @param decisionEventId - ID of the decision event to analyze
 * @param contextWindow - Number of events before decision to include
 * @param consequenceWindow - Number of events after decision to include
 */
export function extractDecisionSnapshot(
  events: TimelineXREvent[],
  decisionEventId: string,
  contextWindow: number = DEFAULT_COMPARISON_CONFIG.defaultContextWindow,
  consequenceWindow: number = DEFAULT_COMPARISON_CONFIG.defaultConsequenceWindow
): DecisionSnapshot {
  // Sort events by timestamp
  const sortedEvents = [...events].sort((a, b) => a.timestamp - b.timestamp);
  
  // Find the decision event
  const index = sortedEvents.findIndex(e => e.id === decisionEventId);
  if (index === -1) {
    throw new Error(`Decision event not found: ${decisionEventId}`);
  }

  const decisionEvent = sortedEvents[index];
  
  // Extract context events (before the decision)
  const contextStart = Math.max(0, index - contextWindow);
  const contextEvents = sortedEvents.slice(contextStart, index);
  
  // Extract consequence events (after the decision)
  const consequenceEnd = Math.min(sortedEvents.length, index + 1 + consequenceWindow);
  const consequenceEvents = sortedEvents.slice(index + 1, consequenceEnd);
  
  // Calculate metrics
  const metrics = calculateDecisionMetrics(
    decisionEvent,
    contextEvents,
    consequenceEvents
  );

  return {
    decisionEvent,
    contextEvents,
    consequenceEvents,
    contextWindow,
    consequenceWindow,
    extractedAt: Date.now(),
    metrics,
  };
}

// ─────────────────────────────────────────────────────
// METRICS CALCULATION
// ─────────────────────────────────────────────────────

/**
 * Calculate comprehensive metrics for a decision snapshot.
 */
function calculateDecisionMetrics(
  decision: TimelineXREvent,
  context: TimelineXREvent[],
  consequences: TimelineXREvent[]
): DecisionMetrics {
  // Context duration
  const contextDuration = context.length > 0
    ? decision.timestamp - context[0].timestamp
    : 0;

  // Consequence duration
  const consequenceDuration = consequences.length > 0
    ? consequences[consequences.length - 1].timestamp - decision.timestamp
    : 0;

  // Count unique agents in context and consequences
  const allEvents = [...context, decision, ...consequences];
  const agentIds = new Set<string>();
  allEvents.forEach(e => {
    if (e.actorType === 'agent' && e.actorId) {
      agentIds.add(e.actorId);
    }
  });
  const agentContributions = agentIds.size;

  // Count human interactions
  const humanInteractions = allEvents.filter(
    e => e.actorType === 'human' || 
         e.type === 'human_speak' || 
         e.type === 'human_ask'
  ).length;

  // Count phase changes
  const phaseChanges = allEvents.filter(
    e => e.type === 'phase_change'
  ).length;

  // Calculate average confidence from agent events
  const agentEvents = allEvents.filter(
    e => e.actorType === 'agent' && e.payload?.confidence
  );
  const confidenceAverage = agentEvents.length > 0
    ? agentEvents.reduce((sum, e) => sum + (e.payload?.confidence || 0), 0) / agentEvents.length
    : 0;

  return {
    contextDuration,
    consequenceDuration,
    agentContributions,
    humanInteractions,
    phaseChanges,
    confidenceAverage,
  };
}

// ─────────────────────────────────────────────────────
// BATCH EXTRACTION
// ─────────────────────────────────────────────────────

/**
 * Extract multiple decision snapshots at once.
 */
export function extractMultipleSnapshots(
  events: TimelineXREvent[],
  decisionEventIds: string[],
  contextWindow?: number,
  consequenceWindow?: number
): DecisionSnapshot[] {
  return decisionEventIds.map(id => 
    extractDecisionSnapshot(events, id, contextWindow, consequenceWindow)
  );
}

/**
 * Extract all decision snapshots from a timeline.
 */
export function extractAllDecisionSnapshots(
  events: TimelineXREvent[],
  contextWindow?: number,
  consequenceWindow?: number
): DecisionSnapshot[] {
  // Find all decision events
  const decisionEvents = events.filter(e => 
    e.type === 'decision_confirm' ||
    e.type === 'decision_select' ||
    e.type === 'human_decision'
  );

  return decisionEvents.map(e =>
    extractDecisionSnapshot(events, e.id, contextWindow, consequenceWindow)
  );
}

// ─────────────────────────────────────────────────────
// TIME-BASED EXTRACTION
// ─────────────────────────────────────────────────────

/**
 * Extract snapshot with time-based windows instead of event count.
 */
export function extractDecisionSnapshotByTime(
  events: TimelineXREvent[],
  decisionEventId: string,
  contextDurationMs: number = 60000,     // 1 minute before
  consequenceDurationMs: number = 60000  // 1 minute after
): DecisionSnapshot {
  const sortedEvents = [...events].sort((a, b) => a.timestamp - b.timestamp);
  
  const decisionEvent = sortedEvents.find(e => e.id === decisionEventId);
  if (!decisionEvent) {
    throw new Error(`Decision event not found: ${decisionEventId}`);
  }

  // Context: events within time window before decision
  const contextEvents = sortedEvents.filter(e =>
    e.timestamp < decisionEvent.timestamp &&
    e.timestamp >= decisionEvent.timestamp - contextDurationMs
  );

  // Consequences: events within time window after decision
  const consequenceEvents = sortedEvents.filter(e =>
    e.timestamp > decisionEvent.timestamp &&
    e.timestamp <= decisionEvent.timestamp + consequenceDurationMs
  );

  const metrics = calculateDecisionMetrics(
    decisionEvent,
    contextEvents,
    consequenceEvents
  );

  return {
    decisionEvent,
    contextEvents,
    consequenceEvents,
    contextWindow: contextEvents.length,
    consequenceWindow: consequenceEvents.length,
    extractedAt: Date.now(),
    metrics,
  };
}

// ─────────────────────────────────────────────────────
// FILTERING HELPERS
// ─────────────────────────────────────────────────────

/**
 * Find decision events in a timeline.
 */
export function findDecisionEvents(
  events: TimelineXREvent[]
): TimelineXREvent[] {
  return events.filter(e =>
    e.type === 'decision_confirm' ||
    e.type === 'decision_select' ||
    e.type === 'decision_propose'
  );
}

/**
 * Get context summary for a snapshot.
 */
export function getContextSummary(snapshot: DecisionSnapshot): string {
  const { contextEvents, metrics } = snapshot;
  
  if (contextEvents.length === 0) {
    return 'Aucun contexte disponible.';
  }

  const parts: string[] = [];
  
  parts.push(`${contextEvents.length} événements de contexte`);
  
  if (metrics.agentContributions > 0) {
    parts.push(`${metrics.agentContributions} agents impliqués`);
  }
  
  if (metrics.humanInteractions > 0) {
    parts.push(`${metrics.humanInteractions} interactions humaines`);
  }
  
  if (metrics.contextDuration > 0) {
    const seconds = Math.round(metrics.contextDuration / 1000);
    parts.push(`durée: ${seconds}s`);
  }

  return parts.join(', ');
}

/**
 * Get consequences summary for a snapshot.
 */
export function getConsequencesSummary(snapshot: DecisionSnapshot): string {
  const { consequenceEvents, metrics } = snapshot;
  
  if (consequenceEvents.length === 0) {
    return 'Aucune conséquence enregistrée.';
  }

  const parts: string[] = [];
  
  parts.push(`${consequenceEvents.length} événements résultants`);
  
  if (metrics.consequenceDuration > 0) {
    const seconds = Math.round(metrics.consequenceDuration / 1000);
    parts.push(`sur ${seconds}s`);
  }

  return parts.join(', ');
}

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default extractDecisionSnapshot;
