/* =====================================================
   CHE·NU — Agent Types
   
   PHASE 4: INFLUENCE & ORCHESTRATION AGENTS
   
   CORE PRINCIPLE:
   Agents OBSERVE and RECOMMEND — they never CONTROL.
   All influence is expressed as signals/proposals that
   a higher-level engine interprets and validates.
   
   This ensures:
   - Explainability (every decision is traceable)
   - Human oversight (proposals can be rejected)
   - Safety (no direct mutations)
   - Testability (pure functions)
   ===================================================== */

// ─────────────────────────────────────────────────────
// AGENT IDENTITY
// ─────────────────────────────────────────────────────

/**
 * Unique agent identifiers.
 * Each agent has a specific analytical role.
 */
export type AgentId = 
  | 'orchestrator'      // Coordinates other agents
  | 'methodology'       // Recommends approaches
  | 'decision-eval'     // Evaluates choices
  | 'memory-recall';    // Provides historical context

/**
 * Agent metadata and configuration.
 */
export interface AgentDefinition {
  id: AgentId;
  name: string;
  description: string;
  
  // What this agent observes
  observes: ObservationType[];
  
  // What this agent can produce
  produces: OutputType[];
  
  // Priority in orchestration (lower = higher priority)
  priority: number;
  
  // Can this agent trigger other agents?
  canOrchestrate: boolean;
}

export type ObservationType = 
  | 'system-context'
  | 'dimensions'
  | 'universe-nodes'
  | 'timeline'
  | 'agent-outputs';

export type OutputType = 
  | 'signal'
  | 'recommendation'
  | 'proposal'
  | 'context-enrichment';

// ─────────────────────────────────────────────────────
// AGENT INPUTS
// ─────────────────────────────────────────────────────

/**
 * System-wide context that agents can observe.
 * Agents receive a SNAPSHOT, never live references.
 */
export interface SystemContext {
  // Current timestamp
  timestamp: number;
  
  // Active user session info (anonymized)
  session: {
    id: string;
    startedAt: number;
    interactionCount: number;
    lastActivityMs: number;
  };
  
  // Current focus area
  focus: {
    sphereId: string | null;
    depth: number;
    viewMode: 'universe' | 'sphere' | 'detail';
  };
  
  // Global activity metrics
  activity: {
    totalActions: number;
    actionsPerMinute: number;
    pendingDecisions: number;
    activeProcesses: number;
  };
  
  // System health indicators
  health: {
    agentsActive: number;
    agentsIdle: number;
    errorCount: number;
    lastErrorAt: number | null;
  };
}

/**
 * Timeline event for historical analysis.
 */
export interface TimelineEvent {
  id: string;
  timestamp: number;
  type: EventType;
  source: EventSource;
  payload: Record<string, unknown>;
  
  // Optional metadata
  sphereId?: string;
  agentId?: AgentId;
  userId?: string;
}

export type EventType = 
  | 'navigation'
  | 'interaction'
  | 'decision-made'
  | 'decision-pending'
  | 'agent-recommendation'
  | 'rule-triggered'
  | 'error'
  | 'milestone';

export type EventSource = 
  | 'user'
  | 'agent'
  | 'system'
  | 'external';

/**
 * Complete input bundle for agent execution.
 * All data is READ-ONLY snapshots.
 */
export interface AgentInput {
  // Current system state
  context: SystemContext;
  
  // Resolved dimensions for all visible nodes
  dimensions: Map<string, ResolvedDimensionSnapshot>;
  
  // Universe topology snapshot
  universeNodes: UniverseNodeSnapshot[];
  
  // Recent timeline (configurable window)
  timeline: TimelineEvent[];
  
  // Outputs from other agents (for orchestration)
  agentOutputs: AgentOutput[];
  
  // Agent-specific configuration
  config: AgentConfig;
}

/**
 * Snapshot of a resolved dimension (immutable).
 */
export interface ResolvedDimensionSnapshot {
  nodeId: string;
  sphereId: string | null;
  scale: number;
  visibility: number;
  activityState: string;
  contentLevel: string;
  density: string;
  motion: string;
  interactable: boolean;
  depth: number;
  capturedAt: number;
}

/**
 * Snapshot of a universe node (immutable).
 */
export interface UniverseNodeSnapshot {
  id: string;
  type: 'trunk' | 'sphere' | 'branch' | 'leaf';
  sphereId: string | null;
  parentId: string | null;
  position: { layer: string; angle?: number };
  metrics: {
    items: number;
    agents: number;
    activeProcesses: number;
    pendingDecisions: number;
  };
  capturedAt: number;
}

/**
 * Agent-specific configuration.
 */
export interface AgentConfig {
  // How far back to analyze
  timelineWindowMs: number;
  
  // Minimum confidence to emit output
  confidenceThreshold: number;
  
  // Maximum outputs per execution
  maxOutputs: number;
  
  // Agent-specific parameters
  parameters: Record<string, unknown>;
}

// ─────────────────────────────────────────────────────
// AGENT OUTPUTS
// ─────────────────────────────────────────────────────

/**
 * Base output structure for all agent emissions.
 * 
 * KEY PRINCIPLE:
 * Outputs are PROPOSALS, not COMMANDS.
 * They express what the agent believes should happen,
 * but the final decision is made by the orchestration
 * engine and ultimately the human user.
 */
export interface AgentOutput {
  // Unique output identifier
  id: string;
  
  // Which agent produced this
  agentId: AgentId;
  
  // When this was produced
  timestamp: number;
  
  // Output classification
  type: AgentOutputType;
  
  // What this output targets
  target: OutputTarget;
  
  // The actual content
  payload: OutputPayload;
  
  // How confident the agent is (0-1)
  confidence: number;
  
  // Why the agent produced this (explainability)
  reasoning: string;
  
  // How urgent this is (1-5, 5 = critical)
  priority: number;
  
  // Time-to-live in ms (after which output expires)
  ttl: number;
  
  // Optional: what triggered this output
  triggeredBy?: string;
}

export type AgentOutputType = 
  | 'signal'           // Simple notification
  | 'recommendation'   // Suggested action
  | 'proposal'         // Structured change request
  | 'enrichment';      // Additional context

/**
 * What the output is trying to influence.
 * 
 * NOTE: Agents target ABSTRACT concepts,
 * never UI components or DOM elements.
 */
export interface OutputTarget {
  type: TargetType;
  id?: string;          // Specific target ID
  scope?: TargetScope;  // Breadth of impact
}

export type TargetType = 
  | 'dimension'         // Scale, visibility, motion
  | 'priority'          // Task/decision ordering
  | 'rule'              // Engine rule adjustment
  | 'methodology'       // Approach to a task
  | 'context'           // Enriching understanding
  | 'orchestration';    // Agent coordination

export type TargetScope = 
  | 'node'              // Single node
  | 'sphere'            // Entire sphere
  | 'universe'          // Global
  | 'session';          // Current session only

// ─────────────────────────────────────────────────────
// OUTPUT PAYLOADS
// ─────────────────────────────────────────────────────

/**
 * Union type for all possible payload structures.
 */
export type OutputPayload = 
  | SignalPayload
  | RecommendationPayload
  | ProposalPayload
  | EnrichmentPayload;

/**
 * Simple signal - notifies of a condition.
 */
export interface SignalPayload {
  kind: 'signal';
  signalType: SignalType;
  message: string;
  data?: Record<string, unknown>;
}

export type SignalType = 
  | 'opportunity'       // Something good could happen
  | 'risk'              // Something bad might happen
  | 'anomaly'           // Unexpected pattern detected
  | 'milestone'         // Achievement or checkpoint
  | 'attention';        // Needs human attention

/**
 * Recommendation - suggests an action.
 */
export interface RecommendationPayload {
  kind: 'recommendation';
  action: RecommendedAction;
  alternatives?: RecommendedAction[];
  impact: ImpactAssessment;
}

export interface RecommendedAction {
  description: string;
  actionType: string;
  parameters: Record<string, unknown>;
  effort: 'trivial' | 'low' | 'medium' | 'high';
}

export interface ImpactAssessment {
  efficiency: number;    // -1 to 1
  clarity: number;       // -1 to 1
  risk: number;          // 0 to 1
  reversibility: number; // 0 to 1
}

/**
 * Proposal - structured change request.
 */
export interface ProposalPayload {
  kind: 'proposal';
  proposalType: ProposalType;
  changes: ProposedChange[];
  rollback?: ProposedChange[];
}

export type ProposalType = 
  | 'dimension-adjust'
  | 'priority-reorder'
  | 'rule-modify'
  | 'methodology-switch';

export interface ProposedChange {
  path: string;          // JSON path to target
  operation: 'set' | 'adjust' | 'merge' | 'remove';
  value: unknown;
  previousValue?: unknown;
}

/**
 * Enrichment - adds context without suggesting action.
 */
export interface EnrichmentPayload {
  kind: 'enrichment';
  enrichmentType: EnrichmentType;
  content: unknown;
  sources: string[];
}

export type EnrichmentType = 
  | 'historical-context'
  | 'pattern-recognition'
  | 'correlation'
  | 'definition';

// ─────────────────────────────────────────────────────
// AGENT INTERFACE
// ─────────────────────────────────────────────────────

/**
 * The core agent interface.
 * 
 * All agents implement this interface.
 * The execute() method is PURE - same input always
 * produces same output, with no side effects.
 */
export interface Agent {
  // Agent identity
  readonly definition: AgentDefinition;
  
  /**
   * Execute the agent's analysis.
   * 
   * PURE FUNCTION:
   * - No side effects
   * - No external calls
   * - No mutations
   * - Deterministic output
   * 
   * @param input - Read-only input bundle
   * @returns Array of outputs (proposals/signals/etc)
   */
  execute(input: AgentInput): AgentOutput[];
  
  /**
   * Validate that the agent can run with given input.
   * 
   * @param input - Input to validate
   * @returns Validation result
   */
  canExecute(input: AgentInput): ValidationResult;
}

export interface ValidationResult {
  valid: boolean;
  reason?: string;
  missingInputs?: string[];
}

// ─────────────────────────────────────────────────────
// ORCHESTRATION TYPES
// ─────────────────────────────────────────────────────

/**
 * Execution plan produced by the orchestrator.
 */
export interface ExecutionPlan {
  id: string;
  timestamp: number;
  
  // Agents to execute and in what order
  stages: ExecutionStage[];
  
  // Why this plan was chosen
  reasoning: string;
  
  // Estimated total execution time
  estimatedDurationMs: number;
}

export interface ExecutionStage {
  stageId: string;
  
  // Agents to run (parallel within stage)
  agents: AgentId[];
  
  // Condition to proceed to next stage
  continueCondition?: ContinueCondition;
  
  // Maximum time for this stage
  timeoutMs: number;
}

export interface ContinueCondition {
  type: 'all-complete' | 'any-complete' | 'threshold';
  threshold?: number;
}

/**
 * Result of executing an agent plan.
 */
export interface ExecutionResult {
  planId: string;
  startedAt: number;
  completedAt: number;
  
  // All outputs collected
  outputs: AgentOutput[];
  
  // Execution metrics
  metrics: {
    agentsExecuted: number;
    outputsProduced: number;
    errorsEncountered: number;
    totalDurationMs: number;
  };
  
  // Any errors that occurred
  errors: ExecutionError[];
}

export interface ExecutionError {
  agentId: AgentId;
  stageId: string;
  error: string;
  timestamp: number;
}

// ─────────────────────────────────────────────────────
// UTILITY TYPES
// ─────────────────────────────────────────────────────

/**
 * Helper to create unique IDs.
 */
export function generateOutputId(agentId: AgentId): string {
  return `${agentId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Default agent configuration.
 */
export const DEFAULT_AGENT_CONFIG: AgentConfig = {
  timelineWindowMs: 300000,  // 5 minutes
  confidenceThreshold: 0.6,
  maxOutputs: 10,
  parameters: {},
};

/**
 * Output priority levels.
 */
export const PRIORITY = {
  LOW: 1,
  NORMAL: 2,
  ELEVATED: 3,
  HIGH: 4,
  CRITICAL: 5,
} as const;

/**
 * Default TTL values.
 */
export const TTL = {
  EPHEMERAL: 5000,      // 5 seconds
  SHORT: 30000,         // 30 seconds
  STANDARD: 300000,     // 5 minutes
  LONG: 1800000,        // 30 minutes
  PERSISTENT: 86400000, // 24 hours
} as const;
