/* =========================================================
   CHE·NU — Runtime Guards
   Parallel vs Chain Enforcement
   
   📜 These guards enforce CHE·NU core laws at RUNTIME.
   
   They prevent accidental violations by:
   - Agents
   - Orchestrator
   - UI logic
   
   MUST be called before any:
   - Decision flow
   - Timeline write
   - Agent orchestration
   ========================================================= */

/*
-------------------------------------------------
WHY THESE GUARDS EXIST
-------------------------------------------------

AI systems fail when:
- Multiple agents influence each other
- Decisions emerge implicitly
- Responsibility is blurred
- Autonomy exceeds accountability

CHE·NU prevents this by enforcing laws at runtime.

-------------------------------------------------
DESIGN INTENT
-------------------------------------------------

CHE·NU is calm by design.
CHE·NU never rushes.
CHE·NU never hides decisions.

If the system ever feels unclear or forced,
it is violating its own laws.
*/

/* -------------------------
   TYPES
------------------------- */

export type AgentType =
  | 'orchestrator'
  | 'decision_analyst'
  | 'context_analyzer'
  | 'memory_agent'
  | 'preset_advisor'
  | 'ux_observer'
  | 'sphere_agent'
  | 'methodology_agent'
  | 'temporary_agent';

export type FlowStage =
  | 'user_intention'
  | 'parallel_analysis'
  | 'orchestration'
  | 'decision_clarification'
  | 'human_validation'
  | 'timeline_write'
  | 'return_to_neutral';

export interface RuntimeContext {
  agentType: AgentType;
  currentStage: FlowStage;
  attemptingTimelineWrite?: boolean;
  attemptingDecision?: boolean;
}

/* -------------------------
   VIOLATION ERROR
------------------------- */

export class CheNuViolationError extends Error {
  public readonly code: string;
  public readonly context: RuntimeContext;
  public readonly timestamp: number;

  constructor(code: string, message: string, context: RuntimeContext) {
    super(`[CHE·NU VIOLATION] ${message}`);
    this.name = 'CheNuViolationError';
    this.code = code;
    this.context = context;
    this.timestamp = Date.now();
  }
}

/* =========================================================
   RUNTIME GUARDS
   ========================================================= */

/**
 * Guard: Prevent any agent from deciding.
 * 
 * 📜 LAW: "Agents may advise only"
 */
export function guardAgentCannotDecide(ctx: RuntimeContext): void {
  if (ctx.agentType !== 'orchestrator' && ctx.attemptingDecision) {
    throw new CheNuViolationError(
      'AGENT_DECISION_FORBIDDEN',
      `Agent '${ctx.agentType}' attempted to decide. Agents may advise only.`,
      ctx
    );
  }
}

/**
 * Guard: Prevent any agent from writing to the timeline.
 * 
 * 📜 LAW: "Only human validation allows timeline writes"
 */
export function guardAgentCannotWriteTimeline(ctx: RuntimeContext): void {
  if (ctx.agentType !== 'orchestrator' && ctx.attemptingTimelineWrite) {
    throw new CheNuViolationError(
      'AGENT_TIMELINE_WRITE_FORBIDDEN',
      `Agent '${ctx.agentType}' attempted a timeline write. Only human validation allows this.`,
      ctx
    );
  }
}

/**
 * Guard: Enforce chain-only decision flow.
 * 
 * 📜 LAW: "Decisions only in decision_clarification stage"
 */
export function guardChainFlow(ctx: RuntimeContext): void {
  if (
    ctx.attemptingDecision &&
    ctx.currentStage !== 'decision_clarification'
  ) {
    throw new CheNuViolationError(
      'CHAIN_FLOW_VIOLATION',
      `Decision attempted outside chained decision flow. Current stage: '${ctx.currentStage}'`,
      ctx
    );
  }
}

/**
 * Guard: Enforce parallel isolation.
 * 
 * 📜 LAW: "Parallel agents must remain isolated"
 */
export function guardParallelIsolation(
  agentType: AgentType,
  seesOtherAgentOutput: boolean
): void {
  if (seesOtherAgentOutput) {
    throw new CheNuViolationError(
      'PARALLEL_ISOLATION_VIOLATION',
      `Agent '${agentType}' accessed another agent's output. Parallel agents must remain isolated.`,
      { agentType, currentStage: 'parallel_analysis' }
    );
  }
}

/**
 * Guard: Enforce human-only authority.
 * 
 * 📜 LAW: "Human is final authority"
 */
export function guardHumanAuthority(
  isHumanValidated: boolean,
  ctx: RuntimeContext
): void {
  if (ctx.attemptingTimelineWrite && isHumanValidated !== true) {
    throw new CheNuViolationError(
      'HUMAN_AUTHORITY_VIOLATION',
      `Timeline write attempted without explicit human validation.`,
      ctx
    );
  }
}

/**
 * Guard: Enforce rollback rules.
 * 
 * 📜 LAW: "Rollback never erases history"
 */
export function guardRollbackRules(action: {
  deletesEvents: boolean;
  rewritesHistory: boolean;
  masksDecisions: boolean;
}): void {
  if (action.deletesEvents) {
    throw new Error(
      '[CHE·NU VIOLATION] Rollback cannot delete events. History is append-only.'
    );
  }
  if (action.rewritesHistory) {
    throw new Error(
      '[CHE·NU VIOLATION] Rollback cannot rewrite history. Only reinterpret reading point.'
    );
  }
  if (action.masksDecisions) {
    throw new Error(
      '[CHE·NU VIOLATION] Rollback cannot mask decisions. All decisions remain visible.'
    );
  }
}

/* =========================================================
   COMPOSITE GUARDS
   ========================================================= */

/**
 * Run all guards before agent execution.
 */
export function guardBeforeAgentExecution(
  ctx: RuntimeContext,
  seesOtherAgentOutput: boolean = false
): void {
  guardAgentCannotDecide(ctx);
  guardAgentCannotWriteTimeline(ctx);
  guardParallelIsolation(ctx.agentType, seesOtherAgentOutput);
}

/**
 * Run all guards before orchestration.
 */
export function guardBeforeOrchestration(ctx: RuntimeContext): void {
  if (ctx.agentType !== 'orchestrator') {
    throw new CheNuViolationError(
      'ORCHESTRATION_ONLY_ORCHESTRATOR',
      `Only orchestrator can perform orchestration. Got: '${ctx.agentType}'`,
      ctx
    );
  }
  guardChainFlow(ctx);
}

/**
 * Run all guards before timeline write.
 */
export function guardBeforeTimelineWrite(
  isHumanValidated: boolean,
  ctx: RuntimeContext
): void {
  guardHumanAuthority(isHumanValidated, ctx);
  guardChainFlow(ctx);
}

/**
 * Run all guards for a complete flow.
 */
export function guardCompleteFlow(
  ctx: RuntimeContext,
  options: {
    isHumanValidated?: boolean;
    seesOtherAgentOutput?: boolean;
  } = {}
): void {
  const { isHumanValidated = false, seesOtherAgentOutput = false } = options;

  guardAgentCannotDecide(ctx);
  guardAgentCannotWriteTimeline(ctx);
  guardChainFlow(ctx);
  guardParallelIsolation(ctx.agentType, seesOtherAgentOutput);

  if (ctx.attemptingTimelineWrite) {
    guardHumanAuthority(isHumanValidated, ctx);
  }
}

/* =========================================================
   GUARD UTILITIES
   ========================================================= */

/**
 * Check if an action is safe (without throwing).
 */
export function isActionSafe(
  ctx: RuntimeContext,
  options: {
    isHumanValidated?: boolean;
    seesOtherAgentOutput?: boolean;
  } = {}
): { safe: boolean; violations: string[] } {
  const violations: string[] = [];

  try {
    guardAgentCannotDecide(ctx);
  } catch (e) {
    violations.push('AGENT_DECISION_FORBIDDEN');
  }

  try {
    guardAgentCannotWriteTimeline(ctx);
  } catch (e) {
    violations.push('AGENT_TIMELINE_WRITE_FORBIDDEN');
  }

  try {
    guardChainFlow(ctx);
  } catch (e) {
    violations.push('CHAIN_FLOW_VIOLATION');
  }

  try {
    guardParallelIsolation(ctx.agentType, options.seesOtherAgentOutput ?? false);
  } catch (e) {
    violations.push('PARALLEL_ISOLATION_VIOLATION');
  }

  if (ctx.attemptingTimelineWrite) {
    try {
      guardHumanAuthority(options.isHumanValidated ?? false, ctx);
    } catch (e) {
      violations.push('HUMAN_AUTHORITY_VIOLATION');
    }
  }

  return {
    safe: violations.length === 0,
    violations,
  };
}

/**
 * Create a safe context for a stage.
 */
export function createSafeContext(
  agentType: AgentType,
  stage: FlowStage
): RuntimeContext {
  return {
    agentType,
    currentStage: stage,
    attemptingDecision: false,
    attemptingTimelineWrite: false,
  };
}

/* =========================================================
   EXPORTS
   ========================================================= */

export const GUARD_CODES = {
  AGENT_DECISION_FORBIDDEN: 'AGENT_DECISION_FORBIDDEN',
  AGENT_TIMELINE_WRITE_FORBIDDEN: 'AGENT_TIMELINE_WRITE_FORBIDDEN',
  CHAIN_FLOW_VIOLATION: 'CHAIN_FLOW_VIOLATION',
  PARALLEL_ISOLATION_VIOLATION: 'PARALLEL_ISOLATION_VIOLATION',
  HUMAN_AUTHORITY_VIOLATION: 'HUMAN_AUTHORITY_VIOLATION',
  ORCHESTRATION_ONLY_ORCHESTRATOR: 'ORCHESTRATION_ONLY_ORCHESTRATOR',
} as const;

export type GuardCode = typeof GUARD_CODES[keyof typeof GUARD_CODES];
