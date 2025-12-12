/* =====================================================
   CHE·NU — Decision Evaluation Agent
   
   PHASE 4: INFLUENCE & ORCHESTRATION AGENTS
   
   ROLE:
   Analyzes decisions that have been made and evaluates
   their impact, effectiveness, and implications.
   
   HOW IT INFLUENCES (without controlling):
   ─────────────────────────────────────────
   1. Observes decision events in the timeline
   2. Measures decision outcomes and patterns
   3. Provides impact assessments
   4. Suggests priority adjustments
   5. Does NOT make or alter decisions
   
   This agent helps users understand the quality and
   consequences of their choices, enabling better
   future decisions.
   ===================================================== */

import { BaseAgent } from './BaseAgent';
import {
  AgentDefinition,
  AgentInput,
  AgentOutput,
  TimelineEvent,
  ImpactAssessment,
  PRIORITY,
  TTL,
} from './types';

// ─────────────────────────────────────────────────────
// DECISION TYPES
// ─────────────────────────────────────────────────────

interface DecisionRecord {
  id: string;
  timestamp: number;
  sphereId?: string;
  type: 'made' | 'pending' | 'deferred' | 'cancelled';
  payload: Record<string, unknown>;
  // Derived metrics
  timeToDecision?: number;
  impact?: DecisionImpact;
}

interface DecisionImpact {
  efficiency: number;   // Did it help move things forward?
  cost: number;         // What resources were consumed?
  clarity: number;      // Did it reduce ambiguity?
  cascadeCount: number; // How many follow-on effects?
}

interface DecisionPattern {
  type: string;
  count: number;
  avgTimeToDecision: number;
  sphereConcentration: Map<string, number>;
}

// ─────────────────────────────────────────────────────
// DECISION EVALUATION AGENT
// ─────────────────────────────────────────────────────

export class DecisionEvaluationAgent extends BaseAgent {
  readonly definition: AgentDefinition = {
    id: 'decision-eval',
    name: 'Decision Evaluation',
    description: 'Analyzes decisions and measures their effectiveness',
    observes: ['system-context', 'timeline', 'dimensions'],
    produces: ['signal', 'recommendation', 'enrichment'],
    priority: 3,
    canOrchestrate: false,
  };
  
  /**
   * Analyze recent decisions and their impacts.
   */
  protected analyze(input: AgentInput): AgentOutput[] {
    const outputs: AgentOutput[] = [];
    
    // 1. Extract and categorize decisions from timeline
    const decisions = this.extractDecisions(input.timeline, input.config.timelineWindowMs);
    
    // 2. Analyze decision patterns
    const patterns = this.analyzePatterns(decisions);
    if (patterns) {
      outputs.push(patterns);
    }
    
    // 3. Evaluate pending decisions
    const pendingEval = this.evaluatePendingDecisions(decisions, input);
    for (const eval_ of pendingEval) {
      outputs.push(eval_);
    }
    
    // 4. Assess decision quality
    const qualityAssessment = this.assessDecisionQuality(decisions);
    if (qualityAssessment) {
      outputs.push(qualityAssessment);
    }
    
    // 5. Recommend priority adjustments
    const priorityRec = this.recommendPriorityChanges(decisions, input);
    if (priorityRec) {
      outputs.push(priorityRec);
    }
    
    // 6. Detect decision debt
    const debtSignal = this.detectDecisionDebt(decisions, input);
    if (debtSignal) {
      outputs.push(debtSignal);
    }
    
    return outputs;
  }
  
  /**
   * Extract decisions from timeline events.
   */
  private extractDecisions(
    timeline: TimelineEvent[],
    windowMs: number
  ): DecisionRecord[] {
    const recent = this.getRecentEvents(timeline, windowMs);
    const decisions: DecisionRecord[] = [];
    
    // Track pending decisions to calculate time-to-decision
    const pendingMap = new Map<string, TimelineEvent>();
    
    for (const event of recent) {
      if (event.type === 'decision-pending') {
        pendingMap.set(event.id, event);
        decisions.push({
          id: event.id,
          timestamp: event.timestamp,
          sphereId: event.sphereId,
          type: 'pending',
          payload: event.payload,
        });
      } else if (event.type === 'decision-made') {
        const decisionId = event.payload.decisionId as string || event.id;
        const pendingEvent = pendingMap.get(decisionId);
        
        decisions.push({
          id: decisionId,
          timestamp: event.timestamp,
          sphereId: event.sphereId,
          type: 'made',
          payload: event.payload,
          timeToDecision: pendingEvent 
            ? event.timestamp - pendingEvent.timestamp 
            : undefined,
        });
        
        pendingMap.delete(decisionId);
      }
    }
    
    return decisions;
  }
  
  /**
   * Analyze patterns in decision-making.
   */
  private analyzePatterns(decisions: DecisionRecord[]): AgentOutput | null {
    if (decisions.length < 3) return null;
    
    const madeDecisions = decisions.filter(d => d.type === 'made');
    const pendingDecisions = decisions.filter(d => d.type === 'pending');
    
    // Calculate average time to decision
    const timesToDecision = madeDecisions
      .filter(d => d.timeToDecision !== undefined)
      .map(d => d.timeToDecision!);
    
    const avgTimeToDecision = timesToDecision.length > 0
      ? timesToDecision.reduce((a, b) => a + b, 0) / timesToDecision.length
      : 0;
    
    // Sphere concentration
    const sphereConcentration = new Map<string, number>();
    for (const decision of decisions) {
      if (decision.sphereId) {
        sphereConcentration.set(
          decision.sphereId,
          (sphereConcentration.get(decision.sphereId) || 0) + 1
        );
      }
    }
    
    // Decision velocity
    const decisionVelocity = madeDecisions.length / (decisions.length || 1);
    
    return this.createEnrichment(
      'pattern-recognition',
      {
        type: 'decision-patterns',
        metrics: {
          totalDecisions: decisions.length,
          madeCount: madeDecisions.length,
          pendingCount: pendingDecisions.length,
          avgTimeToDecisionMs: avgTimeToDecision,
          decisionVelocity: decisionVelocity,
        },
        sphereDistribution: Object.fromEntries(sphereConcentration),
        insights: this.generatePatternInsights(
          avgTimeToDecision,
          decisionVelocity,
          sphereConcentration
        ),
      },
      ['timeline-analysis'],
      { type: 'context', scope: 'session' },
      {
        confidence: 0.85,
        priority: PRIORITY.NORMAL,
        reasoning: `Analyzed ${decisions.length} decisions across ${sphereConcentration.size} spheres`,
      }
    );
  }
  
  /**
   * Generate insights from patterns.
   */
  private generatePatternInsights(
    avgTimeMs: number,
    velocity: number,
    concentration: Map<string, number>
  ): string[] {
    const insights: string[] = [];
    
    // Time insights
    if (avgTimeMs < 10000) {
      insights.push('Quick decision-making (under 10s average). Consider if adequate deliberation is occurring.');
    } else if (avgTimeMs > 300000) {
      insights.push('Decisions taking significant time (over 5 min average). May benefit from clearer criteria.');
    }
    
    // Velocity insights
    if (velocity > 0.8) {
      insights.push('High completion rate. Decision process is effective.');
    } else if (velocity < 0.3) {
      insights.push('Low completion rate. Many decisions remaining open.');
    }
    
    // Concentration insights
    if (concentration.size === 1) {
      insights.push('All decisions concentrated in one sphere. Consider if other areas need attention.');
    } else if (concentration.size >= 4) {
      insights.push('Decisions spread across many spheres. May benefit from focused sessions.');
    }
    
    return insights;
  }
  
  /**
   * Evaluate pending decisions.
   */
  private evaluatePendingDecisions(
    decisions: DecisionRecord[],
    input: AgentInput
  ): AgentOutput[] {
    const outputs: AgentOutput[] = [];
    const pending = decisions.filter(d => d.type === 'pending');
    
    // Sort by age (oldest first)
    pending.sort((a, b) => a.timestamp - b.timestamp);
    
    // Flag stale decisions
    const now = Date.now();
    const staleThreshold = 600000; // 10 minutes
    
    const staleDecisions = pending.filter(d => now - d.timestamp > staleThreshold);
    
    if (staleDecisions.length > 0) {
      outputs.push(this.createSignal(
        'attention',
        `${staleDecisions.length} decision(s) pending for over 10 minutes.`,
        { type: 'priority', scope: 'session' },
        {
          confidence: 0.9,
          priority: staleDecisions.length >= 3 ? PRIORITY.HIGH : PRIORITY.ELEVATED,
          reasoning: 'Long-pending decisions may be blocking progress',
          data: { 
            staleCount: staleDecisions.length,
            oldestAgeMs: now - staleDecisions[0].timestamp,
          },
        }
      ));
    }
    
    // Evaluate individual high-priority pending decisions
    for (const decision of pending.slice(0, 3)) { // Top 3 oldest
      const ageMs = now - decision.timestamp;
      
      if (ageMs > staleThreshold) {
        outputs.push(this.createRecommendation(
          {
            description: `Review pending decision in ${decision.sphereId || 'unknown'} sphere`,
            actionType: 'decision-review',
            parameters: {
              decisionId: decision.id,
              ageMs,
              sphereId: decision.sphereId,
            },
            effort: 'low',
          },
          {
            efficiency: 0.3,
            clarity: 0.5,
            risk: 0.2,
            reversibility: 0.8,
          },
          { type: 'priority', id: decision.id, scope: 'node' },
          {
            confidence: 0.7,
            priority: PRIORITY.NORMAL,
            reasoning: `Decision pending for ${Math.round(ageMs / 60000)} minutes`,
          }
        ));
      }
    }
    
    return outputs;
  }
  
  /**
   * Assess overall decision quality.
   */
  private assessDecisionQuality(decisions: DecisionRecord[]): AgentOutput | null {
    const madeDecisions = decisions.filter(d => d.type === 'made');
    
    if (madeDecisions.length < 2) return null;
    
    // Calculate quality metrics
    const qualityScore = this.calculateQualityScore(madeDecisions);
    const consistencyScore = this.calculateConsistencyScore(madeDecisions);
    
    const overallScore = (qualityScore + consistencyScore) / 2;
    
    // Only signal if there's something notable
    if (overallScore >= 0.7) {
      return this.createSignal(
        'milestone',
        `Decision quality is strong (${Math.round(overallScore * 100)}%). Effective decision patterns observed.`,
        { type: 'context', scope: 'session' },
        {
          confidence: 0.75,
          priority: PRIORITY.LOW,
          reasoning: 'Quality assessment based on timing and distribution patterns',
          data: { qualityScore, consistencyScore },
        }
      );
    } else if (overallScore < 0.4) {
      return this.createSignal(
        'risk',
        `Decision quality may need attention (${Math.round(overallScore * 100)}%). Consider reviewing approach.`,
        { type: 'context', scope: 'session' },
        {
          confidence: 0.7,
          priority: PRIORITY.ELEVATED,
          reasoning: 'Multiple quality indicators below threshold',
          data: { qualityScore, consistencyScore },
        }
      );
    }
    
    return null;
  }
  
  /**
   * Calculate quality score based on decision characteristics.
   */
  private calculateQualityScore(decisions: DecisionRecord[]): number {
    if (decisions.length === 0) return 0.5;
    
    let score = 0.5;
    
    // Reasonable time to decision (not too fast, not too slow)
    const avgTime = decisions
      .filter(d => d.timeToDecision)
      .reduce((sum, d) => sum + d.timeToDecision!, 0) / 
      (decisions.filter(d => d.timeToDecision).length || 1);
    
    if (avgTime >= 10000 && avgTime <= 300000) {
      score += 0.3; // Good deliberation time
    } else if (avgTime < 5000) {
      score -= 0.1; // Possibly hasty
    }
    
    // Consistent sphere focus
    const spheres = new Set(decisions.map(d => d.sphereId).filter(Boolean));
    if (spheres.size <= 2) {
      score += 0.2; // Focused
    }
    
    return Math.max(0, Math.min(1, score));
  }
  
  /**
   * Calculate consistency in decision-making patterns.
   */
  private calculateConsistencyScore(decisions: DecisionRecord[]): number {
    if (decisions.length < 2) return 0.5;
    
    let score = 0.5;
    
    // Calculate variance in time-to-decision
    const times = decisions
      .filter(d => d.timeToDecision)
      .map(d => d.timeToDecision!);
    
    if (times.length >= 2) {
      const avg = times.reduce((a, b) => a + b, 0) / times.length;
      const variance = times.reduce((sum, t) => sum + Math.pow(t - avg, 2), 0) / times.length;
      const stdDev = Math.sqrt(variance);
      const cv = stdDev / (avg || 1); // Coefficient of variation
      
      if (cv < 0.5) {
        score += 0.3; // Consistent timing
      } else if (cv > 1.5) {
        score -= 0.2; // Highly variable
      }
    }
    
    // Regular intervals
    const intervals: number[] = [];
    for (let i = 1; i < decisions.length; i++) {
      intervals.push(decisions[i].timestamp - decisions[i - 1].timestamp);
    }
    
    if (intervals.length > 0) {
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const intervalVariance = intervals.reduce(
        (sum, i) => sum + Math.pow(i - avgInterval, 2), 0
      ) / intervals.length;
      
      if (intervalVariance < avgInterval * avgInterval) {
        score += 0.2; // Regular rhythm
      }
    }
    
    return Math.max(0, Math.min(1, score));
  }
  
  /**
   * Recommend priority changes based on decision analysis.
   */
  private recommendPriorityChanges(
    decisions: DecisionRecord[],
    input: AgentInput
  ): AgentOutput | null {
    const pending = decisions.filter(d => d.type === 'pending');
    
    if (pending.length < 2) return null;
    
    // Find sphere with most pending decisions
    const spherePending = new Map<string, number>();
    for (const d of pending) {
      if (d.sphereId) {
        spherePending.set(d.sphereId, (spherePending.get(d.sphereId) || 0) + 1);
      }
    }
    
    let maxSphere = '';
    let maxCount = 0;
    for (const [sphere, count] of spherePending) {
      if (count > maxCount) {
        maxSphere = sphere;
        maxCount = count;
      }
    }
    
    if (maxCount >= 3 && maxSphere) {
      return this.createProposal(
        'priority-reorder',
        [{
          path: `spheres.${maxSphere}.priority`,
          operation: 'adjust',
          value: +1,
          previousValue: 0,
        }],
        { type: 'priority', id: maxSphere, scope: 'sphere' },
        {
          confidence: 0.7,
          priority: PRIORITY.NORMAL,
          reasoning: `${maxSphere} sphere has ${maxCount} pending decisions, suggesting increased priority`,
          rollback: [{
            path: `spheres.${maxSphere}.priority`,
            operation: 'adjust',
            value: -1,
          }],
        }
      );
    }
    
    return null;
  }
  
  /**
   * Detect decision debt (accumulated unresolved decisions).
   */
  private detectDecisionDebt(
    decisions: DecisionRecord[],
    input: AgentInput
  ): AgentOutput | null {
    const pending = decisions.filter(d => d.type === 'pending');
    const made = decisions.filter(d => d.type === 'made');
    
    // Calculate debt ratio
    const debtRatio = pending.length / (made.length + pending.length || 1);
    
    if (debtRatio > 0.6 && pending.length >= 5) {
      return this.createSignal(
        'risk',
        `Decision debt accumulating: ${pending.length} pending vs ${made.length} completed (${Math.round(debtRatio * 100)}% pending).`,
        { type: 'priority', scope: 'universe' },
        {
          confidence: 0.85,
          priority: PRIORITY.HIGH,
          ttl: TTL.SHORT,
          reasoning: 'High ratio of pending to completed decisions indicates potential bottleneck',
          data: {
            pending: pending.length,
            made: made.length,
            debtRatio,
          },
        }
      );
    }
    
    return null;
  }
}

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default DecisionEvaluationAgent;
