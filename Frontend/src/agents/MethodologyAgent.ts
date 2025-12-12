/* =====================================================
   CHE·NU — Methodology Analyst Agent
   
   PHASE 4: INFLUENCE & ORCHESTRATION AGENTS
   
   ROLE:
   Analyzes current tasks, objectives, and complexity
   to recommend the most effective methodology.
   
   HOW IT INFLUENCES (without controlling):
   ─────────────────────────────────────────
   1. Observes task patterns and workflow state
   2. Assesses complexity and dependencies
   3. Recommends methodologies (sequential, parallel, etc.)
   4. Suggests approach adjustments
   5. Does NOT change any task structure directly
   
   Recommendations are suggestions for the user/system
   to consider, not automatic changes.
   ===================================================== */

import { BaseAgent } from './BaseAgent';
import {
  AgentDefinition,
  AgentInput,
  AgentOutput,
  ResolvedDimensionSnapshot,
  UniverseNodeSnapshot,
  TimelineEvent,
  PRIORITY,
  TTL,
} from './types';

// ─────────────────────────────────────────────────────
// METHODOLOGY TYPES
// ─────────────────────────────────────────────────────

/**
 * Available methodology approaches.
 */
type MethodologyType = 
  | 'sequential'      // One task at a time, in order
  | 'parallel'        // Multiple tasks simultaneously
  | 'exploratory'     // Open-ended investigation
  | 'iterative'       // Repeated refinement cycles
  | 'focused'         // Deep dive on single area
  | 'distributed';    // Spread across spheres

/**
 * Methodology recommendation with rationale.
 */
interface MethodologyRecommendation {
  type: MethodologyType;
  confidence: number;
  rationale: string;
  suggestedDuration: number; // minutes
  prerequisites: string[];
}

// ─────────────────────────────────────────────────────
// METHODOLOGY AGENT
// ─────────────────────────────────────────────────────

export class MethodologyAgent extends BaseAgent {
  readonly definition: AgentDefinition = {
    id: 'methodology',
    name: 'Methodology Analyst',
    description: 'Analyzes tasks and recommends optimal approaches',
    observes: ['system-context', 'dimensions', 'universe-nodes', 'timeline'],
    produces: ['recommendation', 'signal', 'enrichment'],
    priority: 2,
    canOrchestrate: false,
  };
  
  /**
   * Analyze workflow patterns and recommend methodologies.
   */
  protected analyze(input: AgentInput): AgentOutput[] {
    const outputs: AgentOutput[] = [];
    
    // 1. Assess current workflow state
    const workflowAssessment = this.assessWorkflow(input);
    
    // 2. Analyze complexity distribution
    const complexityAnalysis = this.analyzeComplexity(input);
    if (complexityAnalysis) {
      outputs.push(complexityAnalysis);
    }
    
    // 3. Recommend methodology based on assessment
    const recommendation = this.recommendMethodology(input, workflowAssessment);
    if (recommendation) {
      outputs.push(recommendation);
    }
    
    // 4. Detect methodology anti-patterns
    const antiPatterns = this.detectAntiPatterns(input);
    for (const antiPattern of antiPatterns) {
      outputs.push(antiPattern);
    }
    
    // 5. Provide context enrichment
    const enrichment = this.provideMethodologyContext(workflowAssessment);
    if (enrichment) {
      outputs.push(enrichment);
    }
    
    return outputs;
  }
  
  /**
   * Assess current workflow characteristics.
   */
  private assessWorkflow(input: AgentInput): WorkflowAssessment {
    const { context, dimensions, universeNodes, timeline } = input;
    const recentEvents = this.getRecentEvents(timeline, input.config.timelineWindowMs);
    
    // Calculate metrics
    const activeSpheres = this.countActiveSpheres(dimensions);
    const taskDensity = this.calculateTaskDensity(universeNodes);
    const switchingFrequency = this.calculateSwitchingFrequency(recentEvents);
    const completionRate = this.calculateCompletionRate(recentEvents);
    const focusScore = this.calculateFocusScore(context, recentEvents);
    
    // Determine dominant pattern
    const pattern = this.identifyDominantPattern(
      activeSpheres,
      taskDensity,
      switchingFrequency,
      focusScore
    );
    
    return {
      activeSpheres,
      taskDensity,
      switchingFrequency,
      completionRate,
      focusScore,
      dominantPattern: pattern,
      timestamp: Date.now(),
    };
  }
  
  /**
   * Count spheres with active work.
   */
  private countActiveSpheres(
    dimensions: Map<string, ResolvedDimensionSnapshot>
  ): number {
    let count = 0;
    for (const [_, dim] of dimensions) {
      if (dim.activityState === 'active' || dim.activityState === 'busy') {
        count++;
      }
    }
    return count;
  }
  
  /**
   * Calculate overall task density.
   */
  private calculateTaskDensity(nodes: UniverseNodeSnapshot[]): number {
    if (nodes.length === 0) return 0;
    
    const totalTasks = nodes.reduce((sum, node) => {
      return sum + node.metrics.items + node.metrics.pendingDecisions;
    }, 0);
    
    return totalTasks / nodes.length;
  }
  
  /**
   * Calculate how often user switches between spheres.
   */
  private calculateSwitchingFrequency(events: TimelineEvent[]): number {
    const navEvents = events.filter(e => e.type === 'navigation');
    if (navEvents.length < 2) return 0;
    
    const windowMs = events.length > 0 
      ? events[events.length - 1].timestamp - events[0].timestamp
      : 60000;
    
    return (navEvents.length / (windowMs / 60000)); // switches per minute
  }
  
  /**
   * Calculate task completion rate.
   */
  private calculateCompletionRate(events: TimelineEvent[]): number {
    const completed = events.filter(e => e.type === 'decision-made').length;
    const pending = events.filter(e => e.type === 'decision-pending').length;
    
    const total = completed + pending;
    if (total === 0) return 1;
    
    return completed / total;
  }
  
  /**
   * Calculate focus score (0-1, higher = more focused).
   */
  private calculateFocusScore(
    context: AgentInput['context'],
    events: TimelineEvent[]
  ): number {
    let score = 0.5;
    
    // Bonus for staying in same sphere
    const spheres = new Set(events.map(e => e.sphereId).filter(Boolean));
    if (spheres.size <= 1) score += 0.3;
    else if (spheres.size <= 2) score += 0.1;
    else score -= 0.2;
    
    // Penalty for high pending decisions
    if (context.activity.pendingDecisions > 10) score -= 0.2;
    
    // Bonus for consistent activity
    if (context.activity.actionsPerMinute > 1 && context.activity.actionsPerMinute < 10) {
      score += 0.2;
    }
    
    return Math.max(0, Math.min(1, score));
  }
  
  /**
   * Identify the dominant workflow pattern.
   */
  private identifyDominantPattern(
    activeSpheres: number,
    taskDensity: number,
    switchingFrequency: number,
    focusScore: number
  ): string {
    if (focusScore > 0.7 && activeSpheres <= 1) {
      return 'deep-focus';
    }
    if (switchingFrequency > 2) {
      return 'context-switching';
    }
    if (taskDensity > 10 && activeSpheres > 2) {
      return 'scattered';
    }
    if (activeSpheres >= 3 && switchingFrequency < 1) {
      return 'parallel-progress';
    }
    return 'standard';
  }
  
  /**
   * Analyze complexity across the system.
   */
  private analyzeComplexity(input: AgentInput): AgentOutput | null {
    const { dimensions, universeNodes } = input;
    
    // Calculate complexity distribution
    const complexityBySphrere = new Map<string, number>();
    
    for (const node of universeNodes) {
      if (!node.sphereId) continue;
      
      const dim = dimensions.get(node.id);
      if (!dim) continue;
      
      // Simple complexity score based on metrics
      const complexity = 
        node.metrics.items * 0.1 +
        node.metrics.pendingDecisions * 0.3 +
        node.metrics.activeProcesses * 0.2 +
        (dim.density === 'full' ? 0.4 : dim.density === 'expanded' ? 0.2 : 0);
      
      complexityBySphrere.set(
        node.sphereId,
        (complexityBySphrere.get(node.sphereId) || 0) + complexity
      );
    }
    
    // Find complexity hotspots
    const hotspots: string[] = [];
    for (const [sphereId, complexity] of complexityBySphrere) {
      if (complexity > 5) hotspots.push(sphereId);
    }
    
    if (hotspots.length > 0) {
      return this.createEnrichment(
        'pattern-recognition',
        {
          type: 'complexity-distribution',
          hotspots,
          distribution: Object.fromEntries(complexityBySphrere),
        },
        ['dimension-analysis', 'node-metrics'],
        { type: 'context', scope: 'universe' },
        {
          confidence: 0.8,
          priority: PRIORITY.NORMAL,
          reasoning: `Identified ${hotspots.length} complexity hotspots`,
        }
      );
    }
    
    return null;
  }
  
  /**
   * Recommend a methodology based on workflow assessment.
   */
  private recommendMethodology(
    input: AgentInput,
    assessment: WorkflowAssessment
  ): AgentOutput | null {
    const recommendation = this.selectMethodology(assessment);
    
    if (!recommendation || recommendation.confidence < 0.5) {
      return null;
    }
    
    return this.createRecommendation(
      {
        description: `Consider switching to ${recommendation.type} methodology`,
        actionType: 'methodology-switch',
        parameters: {
          methodology: recommendation.type,
          suggestedDuration: recommendation.suggestedDuration,
          prerequisites: recommendation.prerequisites,
        },
        effort: 'low',
      },
      {
        efficiency: this.estimateEfficiencyGain(recommendation.type, assessment),
        clarity: 0.4,
        risk: 0.1,
        reversibility: 1.0,
      },
      { type: 'methodology', scope: 'session' },
      {
        confidence: recommendation.confidence,
        priority: PRIORITY.NORMAL,
        ttl: TTL.STANDARD,
        reasoning: recommendation.rationale,
      }
    );
  }
  
  /**
   * Select the best methodology for current state.
   */
  private selectMethodology(
    assessment: WorkflowAssessment
  ): MethodologyRecommendation | null {
    const { dominantPattern, focusScore, taskDensity, completionRate } = assessment;
    
    // Deep focus pattern → maintain or enhance
    if (dominantPattern === 'deep-focus') {
      return {
        type: 'focused',
        confidence: 0.85,
        rationale: 'Current deep focus is effective. Recommend maintaining concentrated approach.',
        suggestedDuration: 45,
        prerequisites: [],
      };
    }
    
    // Context switching → recommend sequential
    if (dominantPattern === 'context-switching') {
      return {
        type: 'sequential',
        confidence: 0.8,
        rationale: 'High context switching detected. Sequential approach may reduce cognitive load.',
        suggestedDuration: 30,
        prerequisites: ['Prioritize current tasks', 'Clear pending decisions in one sphere'],
      };
    }
    
    // Scattered work → recommend focused or parallel
    if (dominantPattern === 'scattered') {
      if (taskDensity > 15) {
        return {
          type: 'iterative',
          confidence: 0.75,
          rationale: 'High task density with scattered focus. Iterative cycles can bring clarity.',
          suggestedDuration: 25,
          prerequisites: ['Group related tasks', 'Define clear iteration goals'],
        };
      }
      return {
        type: 'focused',
        confidence: 0.7,
        rationale: 'Scattered attention may be reducing effectiveness. Consider focusing on one area.',
        suggestedDuration: 30,
        prerequisites: ['Select priority sphere', 'Defer non-critical items'],
      };
    }
    
    // Good parallel progress → maintain
    if (dominantPattern === 'parallel-progress') {
      return {
        type: 'parallel',
        confidence: 0.8,
        rationale: 'Parallel work across spheres is progressing well. Maintain current approach.',
        suggestedDuration: 60,
        prerequisites: [],
      };
    }
    
    // Low completion rate → recommend sequential
    if (completionRate < 0.3) {
      return {
        type: 'sequential',
        confidence: 0.7,
        rationale: 'Low completion rate suggests parallel work may be overwhelming. Try sequential focus.',
        suggestedDuration: 20,
        prerequisites: ['Complete at least one pending decision'],
      };
    }
    
    // Default: exploratory if nothing specific
    if (focusScore > 0.5) {
      return null; // No change needed
    }
    
    return {
      type: 'exploratory',
      confidence: 0.5,
      rationale: 'Current state is unclear. Exploratory approach may help identify priorities.',
      suggestedDuration: 15,
      prerequisites: ['Review each sphere briefly'],
    };
  }
  
  /**
   * Estimate efficiency gain from methodology switch.
   */
  private estimateEfficiencyGain(
    methodology: MethodologyType,
    assessment: WorkflowAssessment
  ): number {
    const { dominantPattern, focusScore } = assessment;
    
    // Already optimal
    if (dominantPattern === 'deep-focus' && methodology === 'focused') return 0.1;
    if (dominantPattern === 'parallel-progress' && methodology === 'parallel') return 0.1;
    
    // Clear improvements
    if (dominantPattern === 'context-switching' && methodology === 'sequential') return 0.5;
    if (dominantPattern === 'scattered' && methodology === 'focused') return 0.4;
    
    // Moderate improvements
    if (focusScore < 0.3 && methodology === 'focused') return 0.3;
    
    return 0.2;
  }
  
  /**
   * Detect methodology anti-patterns.
   */
  private detectAntiPatterns(input: AgentInput): AgentOutput[] {
    const antiPatterns: AgentOutput[] = [];
    const recentEvents = this.getRecentEvents(input.timeline, input.config.timelineWindowMs);
    
    // Anti-pattern: Thrashing (rapid back-and-forth)
    const navEvents = recentEvents.filter(e => e.type === 'navigation');
    if (navEvents.length >= 6) {
      const sphereVisits = navEvents.map(e => e.sphereId);
      const uniqueSpheres = new Set(sphereVisits);
      
      if (uniqueSpheres.size <= 2 && navEvents.length >= 6) {
        antiPatterns.push(this.createSignal(
          'risk',
          'Thrashing detected: Rapid switching between same spheres without progress.',
          { type: 'methodology', scope: 'session' },
          {
            confidence: 0.8,
            priority: PRIORITY.ELEVATED,
            reasoning: `${navEvents.length} navigation events between ${uniqueSpheres.size} spheres`,
            data: { spheres: Array.from(uniqueSpheres) },
          }
        ));
      }
    }
    
    // Anti-pattern: Decision paralysis
    const pendingEvents = recentEvents.filter(e => e.type === 'decision-pending');
    const madeEvents = recentEvents.filter(e => e.type === 'decision-made');
    
    if (pendingEvents.length >= 5 && madeEvents.length === 0) {
      antiPatterns.push(this.createSignal(
        'attention',
        'Decision paralysis possible: Multiple decisions opened but none completed.',
        { type: 'methodology', scope: 'session' },
        {
          confidence: 0.75,
          priority: PRIORITY.NORMAL,
          reasoning: `${pendingEvents.length} decisions pending with no completions`,
        }
      ));
    }
    
    // Anti-pattern: Activity without progress
    if (input.context.activity.actionsPerMinute > 10 && 
        input.context.activity.pendingDecisions > input.context.activity.activeProcesses * 2) {
      antiPatterns.push(this.createSignal(
        'anomaly',
        'High activity without proportional progress. Consider slowing down.',
        { type: 'methodology', scope: 'session' },
        {
          confidence: 0.65,
          priority: PRIORITY.NORMAL,
          reasoning: 'Actions per minute high but pending decisions growing',
        }
      ));
    }
    
    return antiPatterns;
  }
  
  /**
   * Provide contextual information about methodologies.
   */
  private provideMethodologyContext(
    assessment: WorkflowAssessment
  ): AgentOutput | null {
    return this.createEnrichment(
      'definition',
      {
        currentPattern: assessment.dominantPattern,
        methodologyGuide: {
          sequential: 'Complete one task fully before starting another. Best for complex or dependent tasks.',
          parallel: 'Work on multiple tasks simultaneously. Best when tasks are independent.',
          focused: 'Deep concentration on single area. Best for complex problem-solving.',
          exploratory: 'Open investigation without fixed path. Best for discovery phases.',
          iterative: 'Repeated refinement cycles. Best for creative or uncertain work.',
          distributed: 'Spread work across spheres. Best for maintenance or monitoring.',
        },
        metrics: {
          focusScore: assessment.focusScore,
          taskDensity: assessment.taskDensity,
          completionRate: assessment.completionRate,
        },
      },
      ['workflow-analysis'],
      { type: 'context', scope: 'session' },
      {
        confidence: 1.0,
        priority: PRIORITY.LOW,
        reasoning: 'Providing methodology context for user reference',
      }
    );
  }
}

// ─────────────────────────────────────────────────────
// INTERNAL TYPES
// ─────────────────────────────────────────────────────

interface WorkflowAssessment {
  activeSpheres: number;
  taskDensity: number;
  switchingFrequency: number;
  completionRate: number;
  focusScore: number;
  dominantPattern: string;
  timestamp: number;
}

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default MethodologyAgent;
