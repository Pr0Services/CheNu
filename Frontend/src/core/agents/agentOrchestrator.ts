/* =====================================================
   CHE·NU — AGENT ORCHESTRATOR
   Status: OPERATIONAL (NON-AUTHORITY)
   Version: 1.0
   
   📜 PURPOSE:
   Route requests to specialized agents based on
   Context Interpreter output.
   
   📜 CRITICAL:
   - Human selects context option
   - Orchestrator routes accordingly
   - No autonomous decision-making
   ===================================================== */

import {
  type InternalAgentContextAdaptation,
  type AgentContextType,
  type AgentWorkingMode,
  buildAgentContextAdaptation,
  formatAgentContext,
  validateAgentContext,
  AGENT_CONFIRMATION,
} from './internalAgentContext';

import {
  type ContextOption,
  type InterpretationResult,
  contextInterpreter,
} from './contextInterpreterAgent';

/* =========================================================
   TYPES
   ========================================================= */

export type AgentCapability =
  | 'observe'
  | 'analyze'
  | 'document'
  | 'visualize'
  | 'recall'
  | 'suggest-methodology'
  | 'compare'
  | 'summarize';

export interface RegisteredAgent {
  /** Agent ID */
  agentId: string;

  /** Display name */
  displayName: string;

  /** Capabilities */
  capabilities: AgentCapability[];

  /** Supported context types */
  supportedContexts: AgentContextType[];

  /** Supported working modes */
  supportedModes: AgentWorkingMode[];

  /** Priority (higher = preferred) */
  priority: number;

  /** Is active? */
  active: boolean;
}

export interface RoutingDecision {
  /** Selected context option */
  selectedOption: ContextOption;

  /** Assigned agents */
  assignedAgents: RegisteredAgent[];

  /** Generated context adaptations */
  contextAdaptations: InternalAgentContextAdaptation[];

  /** Routing rationale */
  rationale: string;

  /** Timestamp */
  routedAt: string;

  /** Human who approved */
  approvedBy: string;
}

export interface OrchestratorState {
  /** Registered agents */
  agents: Map<string, RegisteredAgent>;

  /** Current routing */
  currentRouting: RoutingDecision | null;

  /** Pending interpretation */
  pendingInterpretation: InterpretationResult | null;

  /** Session ID */
  sessionId: string;
}

/* =========================================================
   BUILT-IN AGENT REGISTRY
   ========================================================= */

export const BUILT_IN_AGENTS: RegisteredAgent[] = [
  {
    agentId: 'observer-001',
    displayName: 'Observer',
    capabilities: ['observe', 'summarize'],
    supportedContexts: ['session', 'project', 'meeting', 'replay'],
    supportedModes: ['summarization-only'],
    priority: 50,
    active: true,
  },
  {
    agentId: 'analyst-001',
    displayName: 'Analyst',
    capabilities: ['analyze', 'compare'],
    supportedContexts: ['audit', 'exploration', 'project'],
    supportedModes: ['analysis-heavy', 'comparison-focused'],
    priority: 70,
    active: true,
  },
  {
    agentId: 'documenter-001',
    displayName: 'Documenter',
    capabilities: ['document', 'summarize'],
    supportedContexts: ['documentation', 'project', 'meeting'],
    supportedModes: ['documentation-only', 'summarization-only'],
    priority: 60,
    active: true,
  },
  {
    agentId: 'visualizer-001',
    displayName: 'Visualizer',
    capabilities: ['visualize'],
    supportedContexts: ['visualization', 'project', 'exploration'],
    supportedModes: ['visualization-only'],
    priority: 55,
    active: true,
  },
  {
    agentId: 'memory-001',
    displayName: 'Memory Recall',
    capabilities: ['recall', 'summarize'],
    supportedContexts: ['replay', 'session', 'meeting'],
    supportedModes: ['summarization-only'],
    priority: 65,
    active: true,
  },
  {
    agentId: 'methodology-001',
    displayName: 'Methodology Advisor',
    capabilities: ['suggest-methodology', 'analyze'],
    supportedContexts: ['exploration', 'project', 'audit'],
    supportedModes: ['exploration-first', 'analysis-heavy'],
    priority: 45,
    active: true,
  },
];

/* =========================================================
   AGENT ORCHESTRATOR
   ========================================================= */

/**
 * Agent Orchestrator
 * 
 * Routes requests to specialized agents based on human-selected
 * context options.
 * 
 * Rules:
 * - Does NOT auto-select context
 * - Requires human approval for routing
 * - Generates context adaptations for assigned agents
 */
export class AgentOrchestrator {
  private state: OrchestratorState;

  constructor(sessionId: string = crypto.randomUUID()) {
    this.state = {
      agents: new Map(),
      currentRouting: null,
      pendingInterpretation: null,
      sessionId,
    };

    // Register built-in agents
    for (const agent of BUILT_IN_AGENTS) {
      this.registerAgent(agent);
    }
  }

  /* ----- Agent Registration ----- */

  /**
   * Register an agent.
   */
  registerAgent(agent: RegisteredAgent): void {
    this.state.agents.set(agent.agentId, agent);
  }

  /**
   * Unregister an agent.
   */
  unregisterAgent(agentId: string): boolean {
    return this.state.agents.delete(agentId);
  }

  /**
   * Get all registered agents.
   */
  getAgents(): RegisteredAgent[] {
    return Array.from(this.state.agents.values());
  }

  /**
   * Get active agents.
   */
  getActiveAgents(): RegisteredAgent[] {
    return this.getAgents().filter((a) => a.active);
  }

  /* ----- Interpretation Flow ----- */

  /**
   * Step 1: Interpret user intent.
   * Returns options for human selection.
   */
  interpretIntent(input: Parameters<typeof contextInterpreter.interpret>[0]): InterpretationResult {
    const result = contextInterpreter.interpret(input);
    this.state.pendingInterpretation = result;
    return result;
  }

  /**
   * Step 2: Human selects an option.
   * This triggers routing.
   */
  selectOption(
    optionId: string,
    approvedBy: string
  ): RoutingDecision | { error: string } {
    if (!this.state.pendingInterpretation) {
      return { error: 'No pending interpretation. Call interpretIntent() first.' };
    }

    const selectedOption = this.state.pendingInterpretation.options.find(
      (o) => o.optionId === optionId
    );

    if (!selectedOption) {
      return { error: `Option "${optionId}" not found in pending interpretation.` };
    }

    // Find matching agents
    const assignedAgents = this.findMatchingAgents(
      selectedOption.contextType,
      selectedOption.workingMode
    );

    if (assignedAgents.length === 0) {
      return { error: `No agents available for context "${selectedOption.contextType}".` };
    }

    // Generate context adaptations
    const contextAdaptations = this.generateAdaptations(
      selectedOption,
      assignedAgents,
      this.state.pendingInterpretation.input.userIntent
    );

    // Create routing decision
    const routing: RoutingDecision = {
      selectedOption,
      assignedAgents,
      contextAdaptations,
      rationale: `Human selected "${optionId}". Assigned ${assignedAgents.length} agent(s).`,
      routedAt: new Date().toISOString(),
      approvedBy,
    };

    this.state.currentRouting = routing;
    this.state.pendingInterpretation = null;

    return routing;
  }

  /**
   * Cancel pending interpretation.
   */
  cancelInterpretation(): void {
    this.state.pendingInterpretation = null;
  }

  /* ----- Agent Matching ----- */

  /**
   * Find agents matching context and mode.
   */
  private findMatchingAgents(
    contextType: AgentContextType,
    workingMode: AgentWorkingMode
  ): RegisteredAgent[] {
    const activeAgents = this.getActiveAgents();

    // Filter by context support
    let matching = activeAgents.filter((a) =>
      a.supportedContexts.includes(contextType)
    );

    // Prefer agents that support the working mode
    const modeMatching = matching.filter((a) =>
      a.supportedModes.includes(workingMode)
    );

    if (modeMatching.length > 0) {
      matching = modeMatching;
    }

    // Sort by priority
    matching.sort((a, b) => b.priority - a.priority);

    // Return top 3
    return matching.slice(0, 3);
  }

  /* ----- Context Adaptation Generation ----- */

  /**
   * Generate context adaptations for assigned agents.
   */
  private generateAdaptations(
    option: ContextOption,
    agents: RegisteredAgent[],
    userIntent: string
  ): InternalAgentContextAdaptation[] {
    return agents.map((agent) => {
      const adaptation = buildAgentContextAdaptation({
        agent: {
          agentId: agent.agentId,
          category: this.mapCapabilityToCategory(agent.capabilities[0]),
          displayName: agent.displayName,
        },
        context: {
          contextType: option.contextType,
        },
        primaryObjective: `${option.objective} [via: ${userIntent.slice(0, 50)}...]`,
        constraints: option.constraints,
        workingMode: option.workingMode,
        allowedEmphasis: ['clarity', 'completeness'],
        sessionId: this.state.sessionId,
      });

      // Validate
      const validation = validateAgentContext(adaptation);
      if (!validation.valid) {
        console.warn(`Agent ${agent.agentId} context validation warnings:`, validation.warnings);
      }

      return adaptation;
    });
  }

  /**
   * Map capability to agent category.
   */
  private mapCapabilityToCategory(
    capability: AgentCapability
  ): 'observer' | 'analyst' | 'advisor' | 'documenter' | 'methodology' | 'memory' | 'visualization' {
    const mapping: Record<AgentCapability, ReturnType<typeof this.mapCapabilityToCategory>> = {
      observe: 'observer',
      analyze: 'analyst',
      document: 'documenter',
      visualize: 'visualization',
      recall: 'memory',
      'suggest-methodology': 'methodology',
      compare: 'analyst',
      summarize: 'observer',
    };
    return mapping[capability];
  }

  /* ----- State Access ----- */

  /**
   * Get current routing.
   */
  getCurrentRouting(): RoutingDecision | null {
    return this.state.currentRouting;
  }

  /**
   * Get pending interpretation.
   */
  getPendingInterpretation(): InterpretationResult | null {
    return this.state.pendingInterpretation;
  }

  /**
   * Get session ID.
   */
  getSessionId(): string {
    return this.state.sessionId;
  }

  /**
   * Clear current routing.
   */
  clearRouting(): void {
    this.state.currentRouting = null;
  }
}

/* =========================================================
   FORMATTING
   ========================================================= */

/**
 * Format routing decision for display.
 */
export function formatRoutingDecision(decision: RoutingDecision): string {
  let output = `
CHE·NU — ROUTING DECISION
=========================

Selected Option: ${decision.selectedOption.optionId}
Context Type: ${decision.selectedOption.contextType}
Working Mode: ${decision.selectedOption.workingMode}
Confidence: ${(decision.selectedOption.confidence * 100).toFixed(0)}%

Approved By: ${decision.approvedBy}
Routed At: ${decision.routedAt}

ASSIGNED AGENTS (${decision.assignedAgents.length})
${'='.repeat(40)}
`;

  for (const agent of decision.assignedAgents) {
    output += `
• ${agent.displayName} (${agent.agentId})
  Capabilities: ${agent.capabilities.join(', ')}
  Priority: ${agent.priority}
`;
  }

  output += `
RATIONALE
${'='.repeat(40)}
${decision.rationale}

${AGENT_CONFIRMATION}
`;

  return output.trim();
}

/* =========================================================
   SINGLETON & FACTORY
   ========================================================= */

let _orchestratorInstance: AgentOrchestrator | null = null;

/**
 * Get or create orchestrator instance.
 */
export function getOrchestrator(sessionId?: string): AgentOrchestrator {
  if (!_orchestratorInstance || sessionId) {
    _orchestratorInstance = new AgentOrchestrator(sessionId);
  }
  return _orchestratorInstance;
}

/**
 * Reset orchestrator (for testing).
 */
export function resetOrchestrator(): void {
  _orchestratorInstance = null;
}

/* =========================================================
   EXPORTS
   ========================================================= */

export default AgentOrchestrator;
