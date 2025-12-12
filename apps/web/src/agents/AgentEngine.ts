/* =====================================================
   CHE·NU — Agent Engine
   
   PHASE 4: INFLUENCE & ORCHESTRATION AGENTS
   
   PURPOSE:
   The Agent Engine is responsible for executing agents
   and collecting their outputs. It does NOT implement
   the outputs — it merely facilitates agent execution.
   
   EXECUTION MODEL:
   ────────────────
   1. Receive execution request (with context snapshot)
   2. Build input bundle for agents
   3. Execute agents according to plan
   4. Collect all outputs
   5. Return outputs for higher-level processing
   
   The engine ensures agents run in isolation and
   cannot directly affect system state. All outputs
   are collected and returned as proposals.
   
   WHAT THE ENGINE DOES NOT DO:
   ────────────────────────────
   - Modify system state
   - Execute UI changes
   - Make decisions
   - Filter outputs (beyond technical validation)
   
   These responsibilities belong to higher layers
   that consume the engine's output.
   ===================================================== */

import {
  Agent,
  AgentId,
  AgentInput,
  AgentOutput,
  AgentConfig,
  SystemContext,
  ResolvedDimensionSnapshot,
  UniverseNodeSnapshot,
  TimelineEvent,
  ExecutionPlan,
  ExecutionResult,
  ExecutionError,
  DEFAULT_AGENT_CONFIG,
} from './types';

import { OrchestratorAgent } from './OrchestratorAgent';
import { MethodologyAgent } from './MethodologyAgent';
import { DecisionEvaluationAgent } from './DecisionEvaluationAgent';
import { MemoryRecallAgent } from './MemoryRecallAgent';

// ─────────────────────────────────────────────────────
// AGENT REGISTRY
// ─────────────────────────────────────────────────────

/**
 * Registry of all available agents.
 * Agents are instantiated once and reused.
 */
const AGENT_REGISTRY: Map<AgentId, Agent> = new Map([
  ['orchestrator', new OrchestratorAgent()],
  ['methodology', new MethodologyAgent()],
  ['decision-eval', new DecisionEvaluationAgent()],
  ['memory-recall', new MemoryRecallAgent()],
]);

/**
 * Get an agent by ID.
 */
export function getAgent(id: AgentId): Agent | undefined {
  return AGENT_REGISTRY.get(id);
}

/**
 * Get all registered agent IDs.
 */
export function getAgentIds(): AgentId[] {
  return Array.from(AGENT_REGISTRY.keys());
}

/**
 * Get agent definitions.
 */
export function getAgentDefinitions() {
  return Array.from(AGENT_REGISTRY.values()).map(a => a.definition);
}

// ─────────────────────────────────────────────────────
// AGENT ENGINE
// ─────────────────────────────────────────────────────

/**
 * The Agent Engine manages agent execution.
 * 
 * It provides:
 * - Context building
 * - Sequential/parallel execution
 * - Output collection
 * - Error handling
 * 
 * It does NOT:
 * - Interpret outputs
 * - Modify state
 * - Make decisions
 */
export class AgentEngine {
  private config: AgentConfig;
  private outputHistory: AgentOutput[] = [];
  private maxOutputHistory = 100;
  
  constructor(config: Partial<AgentConfig> = {}) {
    this.config = { ...DEFAULT_AGENT_CONFIG, ...config };
  }
  
  /**
   * Execute a single agent.
   * 
   * @param agentId - Agent to execute
   * @param context - Current system context
   * @param dimensions - Resolved dimension snapshots
   * @param nodes - Universe node snapshots
   * @param timeline - Event timeline
   * @returns Agent outputs
   */
  executeAgent(
    agentId: AgentId,
    context: SystemContext,
    dimensions: Map<string, ResolvedDimensionSnapshot>,
    nodes: UniverseNodeSnapshot[],
    timeline: TimelineEvent[]
  ): AgentOutput[] {
    const agent = getAgent(agentId);
    
    if (!agent) {
      console.error(`[AgentEngine] Unknown agent: ${agentId}`);
      return [];
    }
    
    const input = this.buildInput(context, dimensions, nodes, timeline);
    
    try {
      const outputs = agent.execute(input);
      this.recordOutputs(outputs);
      return outputs;
    } catch (error) {
      console.error(`[AgentEngine] Agent ${agentId} failed:`, error);
      return [];
    }
  }
  
  /**
   * Execute multiple agents sequentially.
   */
  executeSequential(
    agentIds: AgentId[],
    context: SystemContext,
    dimensions: Map<string, ResolvedDimensionSnapshot>,
    nodes: UniverseNodeSnapshot[],
    timeline: TimelineEvent[]
  ): AgentOutput[] {
    const allOutputs: AgentOutput[] = [];
    
    for (const agentId of agentIds) {
      // Each subsequent agent sees previous outputs
      const input = this.buildInput(
        context, 
        dimensions, 
        nodes, 
        timeline,
        allOutputs
      );
      
      const agent = getAgent(agentId);
      if (!agent) continue;
      
      try {
        const outputs = agent.execute(input);
        allOutputs.push(...outputs);
      } catch (error) {
        console.error(`[AgentEngine] Agent ${agentId} failed:`, error);
      }
    }
    
    this.recordOutputs(allOutputs);
    return allOutputs;
  }
  
  /**
   * Execute multiple agents in parallel.
   * All agents see the same input (no cross-pollination).
   */
  async executeParallel(
    agentIds: AgentId[],
    context: SystemContext,
    dimensions: Map<string, ResolvedDimensionSnapshot>,
    nodes: UniverseNodeSnapshot[],
    timeline: TimelineEvent[]
  ): Promise<AgentOutput[]> {
    const input = this.buildInput(context, dimensions, nodes, timeline);
    
    const executions = agentIds.map(async (agentId) => {
      const agent = getAgent(agentId);
      if (!agent) return [];
      
      try {
        // Wrap in Promise to enable parallel execution
        return await Promise.resolve(agent.execute(input));
      } catch (error) {
        console.error(`[AgentEngine] Agent ${agentId} failed:`, error);
        return [];
      }
    });
    
    const results = await Promise.all(executions);
    const allOutputs = results.flat();
    
    this.recordOutputs(allOutputs);
    return allOutputs;
  }
  
  /**
   * Execute an execution plan.
   */
  async executePlan(
    plan: ExecutionPlan,
    context: SystemContext,
    dimensions: Map<string, ResolvedDimensionSnapshot>,
    nodes: UniverseNodeSnapshot[],
    timeline: TimelineEvent[]
  ): Promise<ExecutionResult> {
    const startedAt = Date.now();
    const allOutputs: AgentOutput[] = [];
    const errors: ExecutionError[] = [];
    let agentsExecuted = 0;
    
    for (const stage of plan.stages) {
      const stageStarted = Date.now();
      
      try {
        // Execute stage agents in parallel
        const stageOutputs = await this.executeStageWithTimeout(
          stage.agents,
          context,
          dimensions,
          nodes,
          timeline,
          allOutputs,
          stage.timeoutMs
        );
        
        allOutputs.push(...stageOutputs);
        agentsExecuted += stage.agents.length;
        
        // Check continue condition
        if (stage.continueCondition?.type === 'threshold') {
          const minOutputs = stage.continueCondition.threshold || 1;
          if (stageOutputs.length < minOutputs) {
            console.log(`[AgentEngine] Stage ${stage.stageId} did not meet threshold`);
            break;
          }
        }
      } catch (error) {
        errors.push({
          agentId: stage.agents[0],
          stageId: stage.stageId,
          error: error instanceof Error ? error.message : String(error),
          timestamp: Date.now(),
        });
      }
    }
    
    return {
      planId: plan.id,
      startedAt,
      completedAt: Date.now(),
      outputs: allOutputs,
      metrics: {
        agentsExecuted,
        outputsProduced: allOutputs.length,
        errorsEncountered: errors.length,
        totalDurationMs: Date.now() - startedAt,
      },
      errors,
    };
  }
  
  /**
   * Execute stage with timeout.
   */
  private async executeStageWithTimeout(
    agentIds: AgentId[],
    context: SystemContext,
    dimensions: Map<string, ResolvedDimensionSnapshot>,
    nodes: UniverseNodeSnapshot[],
    timeline: TimelineEvent[],
    previousOutputs: AgentOutput[],
    timeoutMs: number
  ): Promise<AgentOutput[]> {
    const input = this.buildInput(
      context, 
      dimensions, 
      nodes, 
      timeline, 
      previousOutputs
    );
    
    const executions = agentIds.map(async (agentId) => {
      const agent = getAgent(agentId);
      if (!agent) return [];
      
      return agent.execute(input);
    });
    
    // Race against timeout
    const timeoutPromise = new Promise<AgentOutput[][]>((_, reject) => {
      setTimeout(() => reject(new Error('Stage timeout')), timeoutMs);
    });
    
    try {
      const results = await Promise.race([
        Promise.all(executions),
        timeoutPromise,
      ]);
      return results.flat();
    } catch (error) {
      console.warn('[AgentEngine] Stage timed out');
      return [];
    }
  }
  
  /**
   * Run orchestrator to get recommended plan.
   */
  getRecommendedPlan(
    context: SystemContext,
    dimensions: Map<string, ResolvedDimensionSnapshot>,
    nodes: UniverseNodeSnapshot[],
    timeline: TimelineEvent[]
  ): ExecutionPlan | null {
    const orchestrator = getAgent('orchestrator');
    if (!orchestrator) return null;
    
    const input = this.buildInput(context, dimensions, nodes, timeline);
    const outputs = orchestrator.execute(input);
    
    // Find plan proposal in outputs
    const planProposal = outputs.find(
      o => o.type === 'proposal' && 
           (o.payload as any).proposalType === 'methodology-switch' &&
           (o.payload as any).changes?.[0]?.path === 'orchestration.executionPlan'
    );
    
    if (planProposal) {
      const change = (planProposal.payload as any).changes[0];
      return change.value as ExecutionPlan;
    }
    
    return null;
  }
  
  /**
   * Build input bundle for agent execution.
   */
  private buildInput(
    context: SystemContext,
    dimensions: Map<string, ResolvedDimensionSnapshot>,
    nodes: UniverseNodeSnapshot[],
    timeline: TimelineEvent[],
    agentOutputs: AgentOutput[] = []
  ): AgentInput {
    return {
      context,
      dimensions,
      universeNodes: nodes,
      timeline,
      agentOutputs: [...this.outputHistory, ...agentOutputs],
      config: this.config,
    };
  }
  
  /**
   * Record outputs to history.
   */
  private recordOutputs(outputs: AgentOutput[]): void {
    this.outputHistory.push(...outputs);
    
    // Trim history if needed
    if (this.outputHistory.length > this.maxOutputHistory) {
      this.outputHistory = this.outputHistory.slice(-this.maxOutputHistory);
    }
  }
  
  /**
   * Get output history.
   */
  getOutputHistory(): AgentOutput[] {
    return [...this.outputHistory];
  }
  
  /**
   * Clear output history.
   */
  clearHistory(): void {
    this.outputHistory = [];
  }
  
  /**
   * Update engine configuration.
   */
  updateConfig(config: Partial<AgentConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

// ─────────────────────────────────────────────────────
// CONVENIENCE FUNCTIONS
// ─────────────────────────────────────────────────────

/**
 * Create a default agent engine instance.
 */
export function createAgentEngine(
  config?: Partial<AgentConfig>
): AgentEngine {
  return new AgentEngine(config);
}

/**
 * Quick execution of all agents.
 */
export async function runAllAgents(
  engine: AgentEngine,
  context: SystemContext,
  dimensions: Map<string, ResolvedDimensionSnapshot>,
  nodes: UniverseNodeSnapshot[],
  timeline: TimelineEvent[]
): Promise<AgentOutput[]> {
  // First run orchestrator to determine plan
  const plan = engine.getRecommendedPlan(context, dimensions, nodes, timeline);
  
  if (plan) {
    const result = await engine.executePlan(
      plan, context, dimensions, nodes, timeline
    );
    return result.outputs;
  }
  
  // Fallback: run all agents sequentially
  const allAgentIds = getAgentIds();
  return engine.executeSequential(
    allAgentIds, context, dimensions, nodes, timeline
  );
}

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default AgentEngine;
