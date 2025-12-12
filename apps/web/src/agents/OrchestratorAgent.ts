/* =====================================================
   CHE·NU — Orchestrator Agent
   
   PHASE 4: INFLUENCE & ORCHESTRATION AGENTS
   
   ROLE:
   The Orchestrator observes the global system state
   and decides which agents should be activated,
   in what order, and with what priority.
   
   HOW IT INFLUENCES (without controlling):
   ─────────────────────────────────────────
   1. Monitors system health and activity patterns
   2. Detects situations requiring agent intervention
   3. Produces RECOMMENDATIONS about which agents to run
   4. Suggests execution order and priorities
   5. Does NOT directly call or execute other agents
   
   The actual agent execution is done by the Engine,
   which may accept, modify, or reject orchestration
   recommendations.
   ===================================================== */

import { BaseAgent } from './BaseAgent';
import {
  AgentDefinition,
  AgentInput,
  AgentOutput,
  AgentId,
  ExecutionPlan,
  ExecutionStage,
  PRIORITY,
  TTL,
} from './types';

// ─────────────────────────────────────────────────────
// ORCHESTRATOR AGENT
// ─────────────────────────────────────────────────────

export class OrchestratorAgent extends BaseAgent {
  readonly definition: AgentDefinition = {
    id: 'orchestrator',
    name: 'Orchestrator',
    description: 'Coordinates agent activities and determines execution priorities',
    observes: ['system-context', 'dimensions', 'timeline', 'agent-outputs'],
    produces: ['signal', 'recommendation', 'proposal'],
    priority: 0, // Highest priority
    canOrchestrate: true,
  };
  
  /**
   * Analyze system state and produce orchestration recommendations.
   */
  protected analyze(input: AgentInput): AgentOutput[] {
    const outputs: AgentOutput[] = [];
    
    // 1. Assess overall system health
    const healthScore = this.calculateHealthScore(input);
    const healthAssessment = this.assessHealth(input, healthScore);
    if (healthAssessment) {
      outputs.push(healthAssessment);
    }
    
    // 2. Detect situations requiring specific agents
    const agentNeeds = this.detectAgentNeeds(input);
    for (const need of agentNeeds) {
      outputs.push(need);
    }
    
    // 3. Propose execution plan if agents are needed
    const plan = this.proposeExecutionPlan(input, agentNeeds);
    if (plan) {
      outputs.push(plan);
    }
    
    // 4. Check for coordination opportunities
    const coordination = this.identifyCoordination(input);
    if (coordination) {
      outputs.push(coordination);
    }
    
    return outputs;
  }
  
  /**
   * Assess system health and emit signals if concerning.
   */
  private assessHealth(
    input: AgentInput,
    healthScore: number
  ): AgentOutput | null {
    const { health, activity } = input.context;
    
    // Critical health issues
    if (healthScore < 0.3) {
      return this.createSignal(
        'risk',
        `System health critical (${Math.round(healthScore * 100)}%). ` +
        `${health.errorCount} errors, ${activity.pendingDecisions} pending decisions.`,
        { type: 'orchestration', scope: 'universe' },
        {
          confidence: 0.95,
          priority: PRIORITY.CRITICAL,
          ttl: TTL.SHORT,
          reasoning: 'Multiple health indicators below acceptable thresholds',
          data: { healthScore, errorCount: health.errorCount },
        }
      );
    }
    
    // Moderate concerns
    if (healthScore < 0.6) {
      return this.createSignal(
        'attention',
        `System health degraded (${Math.round(healthScore * 100)}%). ` +
        `Consider reviewing pending items.`,
        { type: 'orchestration', scope: 'universe' },
        {
          confidence: 0.8,
          priority: PRIORITY.ELEVATED,
          ttl: TTL.STANDARD,
          reasoning: 'Health score below optimal range',
        }
      );
    }
    
    return null;
  }
  
  /**
   * Detect which agents should be activated based on current state.
   */
  private detectAgentNeeds(input: AgentInput): AgentOutput[] {
    const needs: AgentOutput[] = [];
    const recentEvents = this.getRecentEvents(
      input.timeline,
      input.config.timelineWindowMs
    );
    const patterns = this.findPatterns(recentEvents);
    const velocity = this.detectVelocity(recentEvents);
    
    // Need methodology analysis?
    if (this.needsMethodologyAgent(input, patterns)) {
      needs.push(this.createRecommendation(
        {
          description: 'Activate Methodology Agent to analyze current approach',
          actionType: 'activate-agent',
          parameters: { agentId: 'methodology' },
          effort: 'trivial',
        },
        {
          efficiency: 0.3,
          clarity: 0.5,
          risk: 0.1,
          reversibility: 1.0,
        },
        { type: 'orchestration', scope: 'session' },
        {
          confidence: 0.75,
          priority: PRIORITY.NORMAL,
          reasoning: `Detected patterns suggesting methodology review: ${patterns.join(', ')}`,
          triggeredBy: patterns[0],
        }
      ));
    }
    
    // Need decision evaluation?
    if (this.needsDecisionAgent(input)) {
      needs.push(this.createRecommendation(
        {
          description: 'Activate Decision Evaluation Agent to assess recent choices',
          actionType: 'activate-agent',
          parameters: { agentId: 'decision-eval' },
          effort: 'trivial',
        },
        {
          efficiency: 0.4,
          clarity: 0.6,
          risk: 0.05,
          reversibility: 1.0,
        },
        { type: 'orchestration', scope: 'session' },
        {
          confidence: 0.8,
          priority: PRIORITY.ELEVATED,
          reasoning: `${input.context.activity.pendingDecisions} decisions pending, evaluation recommended`,
        }
      ));
    }
    
    // Need memory recall?
    if (this.needsMemoryAgent(input, patterns)) {
      needs.push(this.createRecommendation(
        {
          description: 'Activate Memory Recall Agent to provide historical context',
          actionType: 'activate-agent',
          parameters: { agentId: 'memory-recall' },
          effort: 'low',
        },
        {
          efficiency: 0.2,
          clarity: 0.7,
          risk: 0.0,
          reversibility: 1.0,
        },
        { type: 'orchestration', scope: 'session' },
        {
          confidence: 0.7,
          priority: PRIORITY.NORMAL,
          reasoning: 'Similar patterns detected in current activity, historical context may help',
        }
      ));
    }
    
    return needs;
  }
  
  /**
   * Check if methodology agent should be activated.
   */
  private needsMethodologyAgent(
    input: AgentInput,
    patterns: string[]
  ): boolean {
    // Frequent navigation suggests confusion about approach
    if (patterns.includes('frequent-navigation')) return true;
    
    // High activity but low completion
    const { activity } = input.context;
    if (activity.actionsPerMinute > 5 && activity.pendingDecisions > 5) {
      return true;
    }
    
    // Long time in same view without progress
    if (input.context.session.lastActivityMs > 180000) { // 3 min idle
      return true;
    }
    
    return false;
  }
  
  /**
   * Check if decision evaluation agent should be activated.
   */
  private needsDecisionAgent(input: AgentInput): boolean {
    const { activity } = input.context;
    
    // Many pending decisions
    if (activity.pendingDecisions >= 5) return true;
    
    // Recent decision activity
    const decisionEvents = input.timeline.filter(
      e => e.type === 'decision-made' || e.type === 'decision-pending'
    );
    if (decisionEvents.length >= 3) return true;
    
    return false;
  }
  
  /**
   * Check if memory recall agent should be activated.
   */
  private needsMemoryAgent(
    input: AgentInput,
    patterns: string[]
  ): boolean {
    // Multiple errors might benefit from past solutions
    if (patterns.includes('multiple-errors')) return true;
    
    // Focused activity in one area - historical context useful
    if (patterns.includes('focused-activity')) return true;
    
    // Check if any existing agent outputs mention historical context
    const historyMentioned = input.agentOutputs.some(
      o => o.payload.kind === 'enrichment' && 
           (o.payload as any).enrichmentType === 'historical-context'
    );
    
    // Only suggest if not already provided
    return !historyMentioned && patterns.length > 0;
  }
  
  /**
   * Propose an execution plan for needed agents.
   */
  private proposeExecutionPlan(
    input: AgentInput,
    needs: AgentOutput[]
  ): AgentOutput | null {
    if (needs.length === 0) return null;
    
    // Extract agent IDs from recommendations
    const agentIds = needs
      .filter(n => n.type === 'recommendation')
      .map(n => (n.payload as any).action?.parameters?.agentId)
      .filter(Boolean) as AgentId[];
    
    if (agentIds.length === 0) return null;
    
    // Build execution stages
    const stages: ExecutionStage[] = [];
    
    // Memory recall first (provides context)
    if (agentIds.includes('memory-recall')) {
      stages.push({
        stageId: 'stage-1-context',
        agents: ['memory-recall'],
        continueCondition: { type: 'all-complete' },
        timeoutMs: 5000,
      });
    }
    
    // Methodology + Decision in parallel
    const parallelAgents = agentIds.filter(
      a => a === 'methodology' || a === 'decision-eval'
    );
    if (parallelAgents.length > 0) {
      stages.push({
        stageId: 'stage-2-analysis',
        agents: parallelAgents,
        continueCondition: { type: 'all-complete' },
        timeoutMs: 10000,
      });
    }
    
    const plan: ExecutionPlan = {
      id: `plan-${Date.now()}`,
      timestamp: Date.now(),
      stages,
      reasoning: `Coordinating ${agentIds.length} agents based on detected needs`,
      estimatedDurationMs: stages.reduce((sum, s) => sum + s.timeoutMs, 0),
    };
    
    return this.createProposal(
      'methodology-switch',
      [{
        path: 'orchestration.executionPlan',
        operation: 'set',
        value: plan,
      }],
      { type: 'orchestration', scope: 'session' },
      {
        confidence: 0.85,
        priority: PRIORITY.HIGH,
        ttl: TTL.SHORT,
        reasoning: `Proposed execution plan with ${stages.length} stages`,
      }
    );
  }
  
  /**
   * Identify opportunities for agent coordination.
   */
  private identifyCoordination(input: AgentInput): AgentOutput | null {
    // Check if multiple agent outputs could be combined
    const recentOutputs = input.agentOutputs.filter(
      o => Date.now() - o.timestamp < 60000
    );
    
    if (recentOutputs.length < 2) return null;
    
    // Check for complementary outputs
    const hasMethodology = recentOutputs.some(o => o.agentId === 'methodology');
    const hasDecision = recentOutputs.some(o => o.agentId === 'decision-eval');
    const hasMemory = recentOutputs.some(o => o.agentId === 'memory-recall');
    
    if (hasMethodology && hasDecision && !hasMemory) {
      return this.createSignal(
        'opportunity',
        'Methodology and Decision outputs available. Historical context could enhance synthesis.',
        { type: 'orchestration', scope: 'session' },
        {
          confidence: 0.65,
          priority: PRIORITY.LOW,
          reasoning: 'Complementary agent outputs detected without memory context',
        }
      );
    }
    
    return null;
  }
}

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default OrchestratorAgent;
