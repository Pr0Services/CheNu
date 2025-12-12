/* =========================================================
   CHE·NU — Runtime Guards TESTS
   ========================================================= */

import {
  guardAgentCannotDecide,
  guardAgentCannotWriteTimeline,
  guardChainFlow,
  guardParallelIsolation,
  guardHumanAuthority,
  guardRollbackRules,
  guardBeforeAgentExecution,
  guardBeforeTimelineWrite,
  guardCompleteFlow,
  isActionSafe,
  createSafeContext,
  CheNuViolationError,
  type RuntimeContext,
  type AgentType,
  type FlowStage,
} from './runtimeGuards';

/* -------------------------
   TEST UTILITIES
------------------------- */

const expectThrow = (fn: () => void, expectedCode?: string): void => {
  let threw = false;
  let error: Error | null = null;
  try {
    fn();
  } catch (e) {
    threw = true;
    error = e as Error;
  }
  if (!threw) {
    throw new Error('Expected function to throw, but it did not.');
  }
  if (expectedCode && error instanceof CheNuViolationError) {
    if (error.code !== expectedCode) {
      throw new Error(`Expected code '${expectedCode}', got '${error.code}'`);
    }
  }
};

const expectNoThrow = (fn: () => void): void => {
  try {
    fn();
  } catch (e) {
    throw new Error(`Expected function NOT to throw, but it did: ${e}`);
  }
};

/* -------------------------
   TEST CONTEXTS
------------------------- */

const baseContext: RuntimeContext = {
  agentType: 'decision_analyst',
  currentStage: 'parallel_analysis',
};

const orchestratorContext: RuntimeContext = {
  agentType: 'orchestrator',
  currentStage: 'orchestration',
};

/* =========================================================
   TESTS
   ========================================================= */

export function runCheNuGuardTests(): string {
  const results: string[] = [];

  /* -------------------------
     AGENT DECISION TESTS
  ------------------------- */

  // Agent decision forbidden
  expectThrow(
    () =>
      guardAgentCannotDecide({
        ...baseContext,
        attemptingDecision: true,
      }),
    'AGENT_DECISION_FORBIDDEN'
  );
  results.push('✓ Agent decision forbidden');

  // Orchestrator allowed to coordinate but not decide
  expectNoThrow(() =>
    guardAgentCannotDecide({
      agentType: 'orchestrator',
      currentStage: 'orchestration',
      attemptingDecision: false,
    })
  );
  results.push('✓ Orchestrator coordination allowed');

  // Agent without decision attempt is OK
  expectNoThrow(() =>
    guardAgentCannotDecide({
      ...baseContext,
      attemptingDecision: false,
    })
  );
  results.push('✓ Agent without decision attempt OK');

  /* -------------------------
     TIMELINE WRITE TESTS
  ------------------------- */

  // Timeline write forbidden without human validation
  expectThrow(
    () =>
      guardHumanAuthority(false, {
        agentType: 'orchestrator',
        currentStage: 'timeline_write',
        attemptingTimelineWrite: true,
      }),
    'HUMAN_AUTHORITY_VIOLATION'
  );
  results.push('✓ Timeline write without validation forbidden');

  // Timeline write allowed after validation
  expectNoThrow(() =>
    guardHumanAuthority(true, {
      agentType: 'orchestrator',
      currentStage: 'timeline_write',
      attemptingTimelineWrite: true,
    })
  );
  results.push('✓ Timeline write with validation allowed');

  // Agent cannot write timeline
  expectThrow(
    () =>
      guardAgentCannotWriteTimeline({
        agentType: 'memory_agent',
        currentStage: 'parallel_analysis',
        attemptingTimelineWrite: true,
      }),
    'AGENT_TIMELINE_WRITE_FORBIDDEN'
  );
  results.push('✓ Agent timeline write forbidden');

  /* -------------------------
     CHAIN FLOW TESTS
  ------------------------- */

  // Decision outside chain forbidden
  expectThrow(
    () =>
      guardChainFlow({
        agentType: 'decision_analyst',
        currentStage: 'parallel_analysis',
        attemptingDecision: true,
      }),
    'CHAIN_FLOW_VIOLATION'
  );
  results.push('✓ Decision outside chain forbidden');

  // Decision in correct stage allowed
  expectNoThrow(() =>
    guardChainFlow({
      agentType: 'decision_analyst',
      currentStage: 'decision_clarification',
      attemptingDecision: true,
    })
  );
  results.push('✓ Decision in correct stage allowed');

  /* -------------------------
     PARALLEL ISOLATION TESTS
  ------------------------- */

  // Agent seeing other output forbidden
  expectThrow(
    () => guardParallelIsolation('memory_agent', true),
    'PARALLEL_ISOLATION_VIOLATION'
  );
  results.push('✓ Parallel isolation violation detected');

  // Agent isolated is OK
  expectNoThrow(() => guardParallelIsolation('memory_agent', false));
  results.push('✓ Isolated agent OK');

  /* -------------------------
     ROLLBACK RULES TESTS
  ------------------------- */

  // Cannot delete events
  expectThrow(() =>
    guardRollbackRules({
      deletesEvents: true,
      rewritesHistory: false,
      masksDecisions: false,
    })
  );
  results.push('✓ Rollback delete events forbidden');

  // Cannot rewrite history
  expectThrow(() =>
    guardRollbackRules({
      deletesEvents: false,
      rewritesHistory: true,
      masksDecisions: false,
    })
  );
  results.push('✓ Rollback rewrite history forbidden');

  // Cannot mask decisions
  expectThrow(() =>
    guardRollbackRules({
      deletesEvents: false,
      rewritesHistory: false,
      masksDecisions: true,
    })
  );
  results.push('✓ Rollback mask decisions forbidden');

  // Valid rollback OK
  expectNoThrow(() =>
    guardRollbackRules({
      deletesEvents: false,
      rewritesHistory: false,
      masksDecisions: false,
    })
  );
  results.push('✓ Valid rollback allowed');

  /* -------------------------
     COMPOSITE GUARD TESTS
  ------------------------- */

  // Before agent execution
  expectNoThrow(() =>
    guardBeforeAgentExecution(
      {
        agentType: 'context_analyzer',
        currentStage: 'parallel_analysis',
        attemptingDecision: false,
        attemptingTimelineWrite: false,
      },
      false
    )
  );
  results.push('✓ Guard before agent execution OK');

  // Before timeline write with validation
  expectNoThrow(() =>
    guardBeforeTimelineWrite(true, {
      agentType: 'orchestrator',
      currentStage: 'decision_clarification',
      attemptingDecision: true,
      attemptingTimelineWrite: true,
    })
  );
  results.push('✓ Guard before timeline write with validation OK');

  /* -------------------------
     UTILITY TESTS
  ------------------------- */

  // isActionSafe returns violations
  const safeResult = isActionSafe({
    agentType: 'memory_agent',
    currentStage: 'parallel_analysis',
    attemptingDecision: true,
  });
  if (safeResult.safe) {
    throw new Error('Expected unsafe action');
  }
  if (!safeResult.violations.includes('AGENT_DECISION_FORBIDDEN')) {
    throw new Error('Expected AGENT_DECISION_FORBIDDEN violation');
  }
  results.push('✓ isActionSafe detects violations');

  // isActionSafe returns safe for valid action
  const validResult = isActionSafe(
    createSafeContext('context_analyzer', 'parallel_analysis')
  );
  if (!validResult.safe) {
    throw new Error('Expected safe action');
  }
  results.push('✓ isActionSafe returns safe for valid action');

  // createSafeContext creates valid context
  const safeCtx = createSafeContext('preset_advisor', 'parallel_analysis');
  if (safeCtx.attemptingDecision !== false) {
    throw new Error('Expected attemptingDecision to be false');
  }
  results.push('✓ createSafeContext creates valid context');

  /* -------------------------
     ALL AGENT TYPES TEST
  ------------------------- */

  const agentTypes: AgentType[] = [
    'decision_analyst',
    'context_analyzer',
    'memory_agent',
    'preset_advisor',
    'ux_observer',
    'sphere_agent',
    'methodology_agent',
    'temporary_agent',
  ];

  for (const agentType of agentTypes) {
    expectThrow(() =>
      guardAgentCannotDecide({
        agentType,
        currentStage: 'parallel_analysis',
        attemptingDecision: true,
      })
    );
  }
  results.push('✓ All non-orchestrator agents cannot decide');

  /* -------------------------
     SUMMARY
  ------------------------- */

  console.log('\n=== CHE·NU Runtime Guard Tests ===');
  results.forEach((r) => console.log(r));
  console.log(`\nTotal: ${results.length} tests passed`);

  return `✅ CHE·NU Runtime Guard Tests Passed (${results.length} tests)`;
}

/* =========================================================
   RUN TESTS IF MAIN
   ========================================================= */

// For Jest/Vitest
describe('CHE·NU Runtime Guards', () => {
  it('passes all guard tests', () => {
    const result = runCheNuGuardTests();
    expect(result).toContain('✅');
  });
});

export default runCheNuGuardTests;
