/* =====================================================
   CHE·NU — Base Agent
   
   PHASE 4: INFLUENCE & ORCHESTRATION AGENTS
   
   Abstract base class providing common functionality
   for all CHE·NU agents.
   
   HOW AGENTS INFLUENCE THE SYSTEM:
   ─────────────────────────────────
   1. Agent receives READ-ONLY input snapshot
   2. Agent analyzes patterns, metrics, history
   3. Agent produces PROPOSALS (not commands)
   4. Orchestration engine collects proposals
   5. Higher-level validation filters proposals
   6. Human can review/approve/reject
   7. Only then do approved changes take effect
   
   This chain ensures agents INFLUENCE but never CONTROL.
   ===================================================== */

import {
  Agent,
  AgentDefinition,
  AgentInput,
  AgentOutput,
  AgentId,
  ValidationResult,
  OutputTarget,
  OutputPayload,
  SignalPayload,
  RecommendationPayload,
  ProposalPayload,
  EnrichmentPayload,
  SignalType,
  RecommendedAction,
  ImpactAssessment,
  ProposedChange,
  TimelineEvent,
  generateOutputId,
  PRIORITY,
  TTL,
} from './types';

// ─────────────────────────────────────────────────────
// BASE AGENT CLASS
// ─────────────────────────────────────────────────────

/**
 * Abstract base class for all CHE·NU agents.
 * 
 * Subclasses implement analyze() to perform their
 * specific analytical function.
 */
export abstract class BaseAgent implements Agent {
  abstract readonly definition: AgentDefinition;
  
  /**
   * Main execution entry point.
   * Validates input, runs analysis, filters outputs.
   */
  execute(input: AgentInput): AgentOutput[] {
    // Validate first
    const validation = this.canExecute(input);
    if (!validation.valid) {
      console.warn(`[${this.definition.id}] Cannot execute: ${validation.reason}`);
      return [];
    }
    
    // Run agent-specific analysis
    const outputs = this.analyze(input);
    
    // Filter by confidence threshold
    const filtered = outputs.filter(
      o => o.confidence >= input.config.confidenceThreshold
    );
    
    // Limit output count
    const limited = filtered.slice(0, input.config.maxOutputs);
    
    // Log for transparency
    console.log(
      `[${this.definition.id}] Produced ${limited.length} outputs ` +
      `(${outputs.length - limited.length} filtered)`
    );
    
    return limited;
  }
  
  /**
   * Validate that we can run with the given input.
   */
  canExecute(input: AgentInput): ValidationResult {
    const missing: string[] = [];
    
    // Check required observables
    for (const obs of this.definition.observes) {
      switch (obs) {
        case 'system-context':
          if (!input.context) missing.push('context');
          break;
        case 'dimensions':
          if (!input.dimensions || input.dimensions.size === 0) {
            missing.push('dimensions');
          }
          break;
        case 'universe-nodes':
          if (!input.universeNodes || input.universeNodes.length === 0) {
            missing.push('universeNodes');
          }
          break;
        case 'timeline':
          if (!input.timeline) missing.push('timeline');
          break;
        case 'agent-outputs':
          // Optional - don't require
          break;
      }
    }
    
    if (missing.length > 0) {
      return {
        valid: false,
        reason: `Missing required inputs: ${missing.join(', ')}`,
        missingInputs: missing,
      };
    }
    
    return { valid: true };
  }
  
  /**
   * Abstract method - implement in subclasses.
   * This is where the agent's specific logic lives.
   */
  protected abstract analyze(input: AgentInput): AgentOutput[];
  
  // ─────────────────────────────────────────────────────
  // OUTPUT BUILDERS
  // These helpers make it easy to create properly
  // structured outputs without boilerplate.
  // ─────────────────────────────────────────────────────
  
  /**
   * Create a signal output.
   * Signals notify of conditions without suggesting actions.
   */
  protected createSignal(
    signalType: SignalType,
    message: string,
    target: OutputTarget,
    options: Partial<{
      confidence: number;
      priority: number;
      ttl: number;
      data: Record<string, unknown>;
      reasoning: string;
      triggeredBy: string;
    }> = {}
  ): AgentOutput {
    const payload: SignalPayload = {
      kind: 'signal',
      signalType,
      message,
      data: options.data,
    };
    
    return this.createOutput('signal', target, payload, options);
  }
  
  /**
   * Create a recommendation output.
   * Recommendations suggest actions with impact analysis.
   */
  protected createRecommendation(
    action: RecommendedAction,
    impact: ImpactAssessment,
    target: OutputTarget,
    options: Partial<{
      confidence: number;
      priority: number;
      ttl: number;
      alternatives: RecommendedAction[];
      reasoning: string;
      triggeredBy: string;
    }> = {}
  ): AgentOutput {
    const payload: RecommendationPayload = {
      kind: 'recommendation',
      action,
      alternatives: options.alternatives,
      impact,
    };
    
    return this.createOutput('recommendation', target, payload, options);
  }
  
  /**
   * Create a proposal output.
   * Proposals are structured change requests.
   */
  protected createProposal(
    proposalType: 'dimension-adjust' | 'priority-reorder' | 'rule-modify' | 'methodology-switch',
    changes: ProposedChange[],
    target: OutputTarget,
    options: Partial<{
      confidence: number;
      priority: number;
      ttl: number;
      rollback: ProposedChange[];
      reasoning: string;
      triggeredBy: string;
    }> = {}
  ): AgentOutput {
    const payload: ProposalPayload = {
      kind: 'proposal',
      proposalType,
      changes,
      rollback: options.rollback,
    };
    
    return this.createOutput('proposal', target, payload, options);
  }
  
  /**
   * Create an enrichment output.
   * Enrichments add context without suggesting action.
   */
  protected createEnrichment(
    enrichmentType: 'historical-context' | 'pattern-recognition' | 'correlation' | 'definition',
    content: unknown,
    sources: string[],
    target: OutputTarget,
    options: Partial<{
      confidence: number;
      priority: number;
      ttl: number;
      reasoning: string;
      triggeredBy: string;
    }> = {}
  ): AgentOutput {
    const payload: EnrichmentPayload = {
      kind: 'enrichment',
      enrichmentType,
      content,
      sources,
    };
    
    return this.createOutput('enrichment', target, payload, options);
  }
  
  /**
   * Internal helper to create output with defaults.
   */
  private createOutput(
    type: 'signal' | 'recommendation' | 'proposal' | 'enrichment',
    target: OutputTarget,
    payload: OutputPayload,
    options: Partial<{
      confidence: number;
      priority: number;
      ttl: number;
      reasoning: string;
      triggeredBy: string;
    }>
  ): AgentOutput {
    return {
      id: generateOutputId(this.definition.id),
      agentId: this.definition.id,
      timestamp: Date.now(),
      type,
      target,
      payload,
      confidence: options.confidence ?? 0.7,
      reasoning: options.reasoning ?? 'Analysis based on current system state',
      priority: options.priority ?? PRIORITY.NORMAL,
      ttl: options.ttl ?? TTL.STANDARD,
      triggeredBy: options.triggeredBy,
    };
  }
  
  // ─────────────────────────────────────────────────────
  // ANALYSIS HELPERS
  // Common analysis patterns that agents can use.
  // ─────────────────────────────────────────────────────
  
  /**
   * Filter timeline events within the configured window.
   */
  protected getRecentEvents(
    timeline: TimelineEvent[],
    windowMs: number
  ): TimelineEvent[] {
    const cutoff = Date.now() - windowMs;
    return timeline.filter(e => e.timestamp >= cutoff);
  }
  
  /**
   * Count events by type.
   */
  protected countEventsByType(
    events: TimelineEvent[]
  ): Map<string, number> {
    const counts = new Map<string, number>();
    for (const event of events) {
      counts.set(event.type, (counts.get(event.type) || 0) + 1);
    }
    return counts;
  }
  
  /**
   * Detect rapid changes in a metric.
   */
  protected detectVelocity(
    events: TimelineEvent[],
    windowMs: number = 60000
  ): { eventsPerMinute: number; trend: 'increasing' | 'decreasing' | 'stable' } {
    const recent = this.getRecentEvents(events, windowMs);
    const eventsPerMinute = recent.length / (windowMs / 60000);
    
    // Compare first half to second half
    const midpoint = Date.now() - windowMs / 2;
    const firstHalf = recent.filter(e => e.timestamp < midpoint).length;
    const secondHalf = recent.filter(e => e.timestamp >= midpoint).length;
    
    let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
    if (secondHalf > firstHalf * 1.5) trend = 'increasing';
    if (secondHalf < firstHalf * 0.5) trend = 'decreasing';
    
    return { eventsPerMinute, trend };
  }
  
  /**
   * Find patterns in timeline events.
   */
  protected findPatterns(events: TimelineEvent[]): string[] {
    const patterns: string[] = [];
    
    // Pattern: Many errors
    const errorCount = events.filter(e => e.type === 'error').length;
    if (errorCount >= 3) {
      patterns.push('multiple-errors');
    }
    
    // Pattern: Rapid navigation
    const navEvents = events.filter(e => e.type === 'navigation');
    if (navEvents.length >= 5) {
      patterns.push('frequent-navigation');
    }
    
    // Pattern: Decision backlog
    const pendingDecisions = events.filter(
      e => e.type === 'decision-pending'
    ).length;
    const madeDecisions = events.filter(
      e => e.type === 'decision-made'
    ).length;
    if (pendingDecisions > madeDecisions + 3) {
      patterns.push('decision-backlog');
    }
    
    // Pattern: Concentrated activity
    const sphereActivity = new Map<string, number>();
    for (const event of events) {
      if (event.sphereId) {
        sphereActivity.set(
          event.sphereId,
          (sphereActivity.get(event.sphereId) || 0) + 1
        );
      }
    }
    const maxActivity = Math.max(...sphereActivity.values(), 0);
    if (maxActivity > events.length * 0.7) {
      patterns.push('focused-activity');
    }
    
    return patterns;
  }
  
  /**
   * Calculate a simple health score.
   */
  protected calculateHealthScore(input: AgentInput): number {
    const { health, activity } = input.context;
    
    let score = 1.0;
    
    // Deduct for errors
    score -= health.errorCount * 0.1;
    
    // Deduct for high pending decisions
    if (activity.pendingDecisions > 10) {
      score -= 0.2;
    }
    
    // Deduct for idle agents
    const idleRatio = health.agentsIdle / (health.agentsActive + health.agentsIdle || 1);
    if (idleRatio > 0.5) {
      score -= 0.1;
    }
    
    return Math.max(0, Math.min(1, score));
  }
}

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default BaseAgent;
