/* =====================================================
   CHE·NU — Memory Recall Agent
   
   PHASE 4: INFLUENCE & ORCHESTRATION AGENTS
   
   ROLE:
   Extracts relevant past experiences and provides
   historical context to enrich current understanding.
   
   HOW IT INFLUENCES (without controlling):
   ─────────────────────────────────────────
   1. Searches through historical timeline data
   2. Identifies similar patterns from the past
   3. Retrieves relevant context and outcomes
   4. Provides enrichment data (not commands)
   5. Does NOT modify history or force recall
   
   This agent acts like a "memory assistant" that
   surfaces relevant past experiences without
   dictating how they should be used.
   ===================================================== */

import { BaseAgent } from './BaseAgent';
import {
  AgentDefinition,
  AgentInput,
  AgentOutput,
  TimelineEvent,
  PRIORITY,
  TTL,
} from './types';

// ─────────────────────────────────────────────────────
// MEMORY TYPES
// ─────────────────────────────────────────────────────

interface MemoryPattern {
  id: string;
  type: 'success' | 'failure' | 'neutral';
  description: string;
  events: TimelineEvent[];
  context: {
    sphereId?: string;
    activityLevel: string;
    outcome?: string;
  };
  relevanceScore: number;
  timestamp: number;
}

interface HistoricalCorrelation {
  currentPattern: string;
  historicalMatches: {
    patternId: string;
    similarity: number;
    outcome: string;
    timeAgo: number;
  }[];
}

// ─────────────────────────────────────────────────────
// MEMORY RECALL AGENT
// ─────────────────────────────────────────────────────

export class MemoryRecallAgent extends BaseAgent {
  readonly definition: AgentDefinition = {
    id: 'memory-recall',
    name: 'Memory Recall',
    description: 'Provides historical context and past experience insights',
    observes: ['system-context', 'timeline', 'agent-outputs'],
    produces: ['enrichment', 'signal'],
    priority: 1, // Run early to provide context
    canOrchestrate: false,
  };
  
  /**
   * Analyze current state and recall relevant history.
   */
  protected analyze(input: AgentInput): AgentOutput[] {
    const outputs: AgentOutput[] = [];
    
    // 1. Identify current patterns
    const currentPatterns = this.identifyCurrentPatterns(input);
    
    // 2. Search for similar historical patterns
    const historicalMatches = this.findHistoricalMatches(input, currentPatterns);
    if (historicalMatches.length > 0) {
      outputs.push(this.createHistoricalContext(historicalMatches));
    }
    
    // 3. Find relevant past successes
    const successPatterns = this.findSuccessPatterns(input);
    if (successPatterns) {
      outputs.push(successPatterns);
    }
    
    // 4. Identify recurring issues
    const recurringIssues = this.identifyRecurringIssues(input);
    if (recurringIssues) {
      outputs.push(recurringIssues);
    }
    
    // 5. Provide session continuity
    const sessionContext = this.provideSessionContinuity(input);
    if (sessionContext) {
      outputs.push(sessionContext);
    }
    
    // 6. Surface forgotten items
    const forgotten = this.surfaceForgottenItems(input);
    if (forgotten) {
      outputs.push(forgotten);
    }
    
    return outputs;
  }
  
  /**
   * Identify patterns in current activity.
   */
  private identifyCurrentPatterns(input: AgentInput): string[] {
    const patterns: string[] = [];
    const recentEvents = this.getRecentEvents(input.timeline, 60000); // Last minute
    
    // Activity patterns
    const velocity = this.detectVelocity(recentEvents, 60000);
    if (velocity.trend === 'increasing') patterns.push('activity-increasing');
    if (velocity.trend === 'decreasing') patterns.push('activity-decreasing');
    
    // Sphere focus patterns
    const spheres = new Set(recentEvents.map(e => e.sphereId).filter(Boolean));
    if (spheres.size === 1) patterns.push('single-sphere-focus');
    if (spheres.size >= 3) patterns.push('multi-sphere-activity');
    
    // Event type patterns
    const eventCounts = this.countEventsByType(recentEvents);
    if ((eventCounts.get('error') || 0) >= 2) patterns.push('error-occurrence');
    if ((eventCounts.get('decision-pending') || 0) >= 3) patterns.push('decision-backlog');
    if ((eventCounts.get('navigation') || 0) >= 5) patterns.push('exploration-mode');
    
    // Context patterns from system state
    const { activity, health } = input.context;
    if (activity.actionsPerMinute > 8) patterns.push('high-activity');
    if (activity.actionsPerMinute < 1 && activity.pendingDecisions > 0) {
      patterns.push('stalled-with-pending');
    }
    if (health.errorCount > 0) patterns.push('has-errors');
    
    return patterns;
  }
  
  /**
   * Find historical patterns that match current state.
   */
  private findHistoricalMatches(
    input: AgentInput,
    currentPatterns: string[]
  ): HistoricalCorrelation[] {
    if (currentPatterns.length === 0) return [];
    
    const correlations: HistoricalCorrelation[] = [];
    
    // Get longer-term history (beyond the recent window)
    const historicalWindow = input.config.timelineWindowMs * 10; // 10x window
    const allEvents = input.timeline;
    const recentCutoff = Date.now() - input.config.timelineWindowMs;
    
    const historicalEvents = allEvents.filter(e => e.timestamp < recentCutoff);
    
    if (historicalEvents.length < 5) return []; // Not enough history
    
    // Group historical events into time windows
    const windows = this.groupIntoWindows(historicalEvents, 300000); // 5 min windows
    
    for (const pattern of currentPatterns) {
      const matches: HistoricalCorrelation['historicalMatches'] = [];
      
      for (const window of windows) {
        const windowPatterns = this.extractWindowPatterns(window);
        
        // Check if this window had similar patterns
        if (windowPatterns.includes(pattern)) {
          const outcome = this.determineWindowOutcome(window);
          const similarity = this.calculateSimilarity(currentPatterns, windowPatterns);
          
          if (similarity > 0.5) {
            matches.push({
              patternId: `window-${window.startTime}`,
              similarity,
              outcome,
              timeAgo: Date.now() - window.startTime,
            });
          }
        }
      }
      
      if (matches.length > 0) {
        correlations.push({
          currentPattern: pattern,
          historicalMatches: matches.slice(0, 3), // Top 3
        });
      }
    }
    
    return correlations;
  }
  
  /**
   * Group events into time windows.
   */
  private groupIntoWindows(
    events: TimelineEvent[],
    windowSize: number
  ): { startTime: number; events: TimelineEvent[] }[] {
    if (events.length === 0) return [];
    
    const windows: { startTime: number; events: TimelineEvent[] }[] = [];
    let currentWindow: TimelineEvent[] = [];
    let windowStart = events[0].timestamp;
    
    for (const event of events) {
      if (event.timestamp - windowStart > windowSize) {
        if (currentWindow.length > 0) {
          windows.push({ startTime: windowStart, events: currentWindow });
        }
        currentWindow = [event];
        windowStart = event.timestamp;
      } else {
        currentWindow.push(event);
      }
    }
    
    if (currentWindow.length > 0) {
      windows.push({ startTime: windowStart, events: currentWindow });
    }
    
    return windows;
  }
  
  /**
   * Extract patterns from a historical window.
   */
  private extractWindowPatterns(
    window: { events: TimelineEvent[] }
  ): string[] {
    const patterns: string[] = [];
    const events = window.events;
    
    const eventCounts = this.countEventsByType(events);
    
    if ((eventCounts.get('error') || 0) >= 2) patterns.push('error-occurrence');
    if ((eventCounts.get('decision-pending') || 0) >= 3) patterns.push('decision-backlog');
    if ((eventCounts.get('navigation') || 0) >= 5) patterns.push('exploration-mode');
    if ((eventCounts.get('decision-made') || 0) >= 3) patterns.push('high-decisions');
    
    const spheres = new Set(events.map(e => e.sphereId).filter(Boolean));
    if (spheres.size === 1) patterns.push('single-sphere-focus');
    if (spheres.size >= 3) patterns.push('multi-sphere-activity');
    
    if (events.length > 20) patterns.push('high-activity');
    if (events.length < 5) patterns.push('low-activity');
    
    return patterns;
  }
  
  /**
   * Determine the outcome of a historical window.
   */
  private determineWindowOutcome(
    window: { events: TimelineEvent[] }
  ): string {
    const events = window.events;
    const decisions = events.filter(e => e.type === 'decision-made').length;
    const errors = events.filter(e => e.type === 'error').length;
    const milestones = events.filter(e => e.type === 'milestone').length;
    
    if (milestones > 0) return 'achieved-milestone';
    if (decisions >= 3 && errors === 0) return 'productive-completion';
    if (errors >= 2) return 'encountered-issues';
    if (decisions > 0) return 'some-progress';
    return 'neutral';
  }
  
  /**
   * Calculate similarity between pattern sets.
   */
  private calculateSimilarity(patterns1: string[], patterns2: string[]): number {
    if (patterns1.length === 0 || patterns2.length === 0) return 0;
    
    const set1 = new Set(patterns1);
    const set2 = new Set(patterns2);
    
    let intersection = 0;
    for (const p of set1) {
      if (set2.has(p)) intersection++;
    }
    
    const union = new Set([...patterns1, ...patterns2]).size;
    
    return intersection / union;
  }
  
  /**
   * Create historical context enrichment.
   */
  private createHistoricalContext(
    correlations: HistoricalCorrelation[]
  ): AgentOutput {
    // Summarize insights
    const insights: string[] = [];
    const outcomeStats: Record<string, number> = {};
    
    for (const corr of correlations) {
      for (const match of corr.historicalMatches) {
        outcomeStats[match.outcome] = (outcomeStats[match.outcome] || 0) + 1;
        
        const timeAgoMin = Math.round(match.timeAgo / 60000);
        if (timeAgoMin < 60) {
          insights.push(
            `Pattern "${corr.currentPattern}" seen ${timeAgoMin}m ago → ${match.outcome}`
          );
        }
      }
    }
    
    // Determine dominant historical outcome
    let dominantOutcome = 'neutral';
    let maxCount = 0;
    for (const [outcome, count] of Object.entries(outcomeStats)) {
      if (count > maxCount) {
        dominantOutcome = outcome;
        maxCount = count;
      }
    }
    
    return this.createEnrichment(
      'historical-context',
      {
        type: 'pattern-correlation',
        correlations: correlations.map(c => ({
          pattern: c.currentPattern,
          matchCount: c.historicalMatches.length,
          topOutcome: c.historicalMatches[0]?.outcome,
        })),
        insights: insights.slice(0, 5),
        dominantHistoricalOutcome: dominantOutcome,
        suggestion: this.getOutcomeSuggestion(dominantOutcome),
      },
      ['timeline-analysis', 'pattern-matching'],
      { type: 'context', scope: 'session' },
      {
        confidence: 0.7,
        priority: PRIORITY.NORMAL,
        ttl: TTL.STANDARD,
        reasoning: `Found ${correlations.length} pattern correlations with historical data`,
      }
    );
  }
  
  /**
   * Get suggestion based on historical outcome.
   */
  private getOutcomeSuggestion(outcome: string): string {
    switch (outcome) {
      case 'achieved-milestone':
        return 'Similar patterns historically led to milestones. Continue current approach.';
      case 'productive-completion':
        return 'Pattern suggests productive outcome ahead. Maintain focus.';
      case 'encountered-issues':
        return 'Similar situations had issues. Consider reviewing approach proactively.';
      case 'some-progress':
        return 'Moderate progress expected. May benefit from additional focus.';
      default:
        return 'Historical data suggests neutral outcome. Proceed as planned.';
    }
  }
  
  /**
   * Find past success patterns relevant to current context.
   */
  private findSuccessPatterns(input: AgentInput): AgentOutput | null {
    // Look for milestones in history
    const milestones = input.timeline.filter(e => e.type === 'milestone');
    
    if (milestones.length === 0) return null;
    
    // Find patterns that preceded milestones
    const successPrecursors: string[] = [];
    
    for (const milestone of milestones.slice(-5)) { // Last 5 milestones
      // Find events in the hour before milestone
      const precedingEvents = input.timeline.filter(
        e => e.timestamp >= milestone.timestamp - 3600000 &&
             e.timestamp < milestone.timestamp
      );
      
      if (precedingEvents.length > 0) {
        const patterns = this.findPatterns(precedingEvents);
        successPrecursors.push(...patterns);
      }
    }
    
    if (successPrecursors.length === 0) return null;
    
    // Count pattern frequencies
    const patternCounts = new Map<string, number>();
    for (const pattern of successPrecursors) {
      patternCounts.set(pattern, (patternCounts.get(pattern) || 0) + 1);
    }
    
    // Find most common success patterns
    const topPatterns = Array.from(patternCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([pattern, count]) => ({ pattern, frequency: count }));
    
    return this.createEnrichment(
      'pattern-recognition',
      {
        type: 'success-patterns',
        patterns: topPatterns,
        insight: `Historically, ${topPatterns[0]?.pattern || 'focused work'} often preceded achievements.`,
      },
      ['milestone-analysis'],
      { type: 'context', scope: 'session' },
      {
        confidence: 0.65,
        priority: PRIORITY.LOW,
        reasoning: `Analyzed ${milestones.length} past milestones for success patterns`,
      }
    );
  }
  
  /**
   * Identify recurring issues from history.
   */
  private identifyRecurringIssues(input: AgentInput): AgentOutput | null {
    // Look for repeated errors
    const errorEvents = input.timeline.filter(e => e.type === 'error');
    
    if (errorEvents.length < 2) return null;
    
    // Group errors by similarity (simplified - by sphere)
    const errorsBySphere = new Map<string, number>();
    for (const error of errorEvents) {
      const sphere = error.sphereId || 'unknown';
      errorsBySphere.set(sphere, (errorsBySphere.get(sphere) || 0) + 1);
    }
    
    // Find spheres with recurring errors
    const recurringErrors: { sphere: string; count: number }[] = [];
    for (const [sphere, count] of errorsBySphere) {
      if (count >= 2) {
        recurringErrors.push({ sphere, count });
      }
    }
    
    if (recurringErrors.length === 0) return null;
    
    return this.createSignal(
      'risk',
      `Recurring issues detected in ${recurringErrors.map(e => e.sphere).join(', ')}.`,
      { type: 'context', scope: 'universe' },
      {
        confidence: 0.75,
        priority: PRIORITY.ELEVATED,
        reasoning: `${recurringErrors.length} areas have repeated errors`,
        data: { recurringErrors },
      }
    );
  }
  
  /**
   * Provide continuity from earlier in the session.
   */
  private provideSessionContinuity(input: AgentInput): AgentOutput | null {
    const { session } = input.context;
    
    // Only useful for longer sessions
    if (session.interactionCount < 10) return null;
    
    // Find what user was focused on at session start
    const sessionStart = session.startedAt;
    const earlyEvents = input.timeline.filter(
      e => e.timestamp >= sessionStart && 
           e.timestamp < sessionStart + 300000 // First 5 min
    );
    
    if (earlyEvents.length === 0) return null;
    
    // Identify early session sphere
    const earlySphreres = earlyEvents
      .map(e => e.sphereId)
      .filter(Boolean);
    
    const earlySphereCount = new Map<string, number>();
    for (const sphere of earlySphreres) {
      earlySphereCount.set(sphere!, (earlySphereCount.get(sphere!) || 0) + 1);
    }
    
    let dominantEarlySphere = '';
    let maxCount = 0;
    for (const [sphere, count] of earlySphereCount) {
      if (count > maxCount) {
        dominantEarlySphere = sphere;
        maxCount = count;
      }
    }
    
    // Check if user is now in a different sphere
    const currentSphere = input.context.focus.sphereId;
    
    if (dominantEarlySphere && 
        currentSphere && 
        dominantEarlySphere !== currentSphere) {
      return this.createEnrichment(
        'historical-context',
        {
          type: 'session-continuity',
          sessionStartFocus: dominantEarlySphere,
          currentFocus: currentSphere,
          reminder: `Session started with focus on "${dominantEarlySphere}". ` +
                   `Now in "${currentSphere}". Original tasks may still be pending.`,
        },
        ['session-analysis'],
        { type: 'context', scope: 'session' },
        {
          confidence: 0.8,
          priority: PRIORITY.LOW,
          reasoning: 'Detected sphere change from session start',
        }
      );
    }
    
    return null;
  }
  
  /**
   * Surface items that may have been forgotten.
   */
  private surfaceForgottenItems(input: AgentInput): AgentOutput | null {
    // Find old pending decisions that haven't been interacted with recently
    const now = Date.now();
    const recentWindow = 300000; // 5 minutes
    
    const pendingDecisions = input.timeline.filter(
      e => e.type === 'decision-pending'
    );
    
    const recentInteractions = new Set(
      input.timeline
        .filter(e => now - e.timestamp < recentWindow)
        .map(e => e.payload.decisionId || e.id)
    );
    
    // Find pending decisions not recently touched
    const forgotten = pendingDecisions.filter(
      d => !recentInteractions.has(d.id) &&
           now - d.timestamp > recentWindow * 2
    );
    
    if (forgotten.length === 0) return null;
    
    // Group by sphere
    const forgottenBySphere = new Map<string, number>();
    for (const d of forgotten) {
      const sphere = d.sphereId || 'unknown';
      forgottenBySphere.set(sphere, (forgottenBySphere.get(sphere) || 0) + 1);
    }
    
    const sphereSummary = Array.from(forgottenBySphere.entries())
      .map(([sphere, count]) => `${sphere}: ${count}`)
      .join(', ');
    
    return this.createSignal(
      'attention',
      `${forgotten.length} item(s) may need attention: ${sphereSummary}`,
      { type: 'priority', scope: 'universe' },
      {
        confidence: 0.6,
        priority: PRIORITY.NORMAL,
        reasoning: 'Items pending without recent interaction',
        data: { 
          forgottenCount: forgotten.length,
          distribution: Object.fromEntries(forgottenBySphere),
        },
      }
    );
  }
}

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default MemoryRecallAgent;
