# CHE·NU — Runtime Guards

> *"If a guard throws, the system must stop."*

---

## PURPOSE

These guards enforce CHE·NU core laws at **runtime**.

They prevent accidental violations by:
- 🤖 Agents
- 🎯 Orchestrator
- 🖥️ UI logic

---

## WHY THESE GUARDS EXIST

AI systems fail when:

| Failure Mode | Consequence |
|--------------|-------------|
| Multiple agents influence each other | Bias amplification |
| Decisions emerge implicitly | Unclear responsibility |
| Responsibility is blurred | No accountability |
| Autonomy exceeds accountability | Loss of control |

**CHE·NU prevents this by enforcing laws at runtime.**

---

## GUARDS OVERVIEW

### `guardAgentCannotDecide`

```typescript
guardAgentCannotDecide(ctx: RuntimeContext): void
```

📜 **LAW:** *"Agents may advise only"*

Throws if any agent (except orchestrator) attempts to decide.

---

### `guardAgentCannotWriteTimeline`

```typescript
guardAgentCannotWriteTimeline(ctx: RuntimeContext): void
```

📜 **LAW:** *"Only human validation allows timeline writes"*

Throws if any agent attempts to write to the timeline.

---

### `guardChainFlow`

```typescript
guardChainFlow(ctx: RuntimeContext): void
```

📜 **LAW:** *"Decisions only in decision_clarification stage"*

Throws if a decision is attempted outside the chained decision flow.

---

### `guardParallelIsolation`

```typescript
guardParallelIsolation(agentType: AgentType, seesOtherAgentOutput: boolean): void
```

📜 **LAW:** *"Parallel agents must remain isolated"*

Throws if an agent accesses another agent's output.

---

### `guardHumanAuthority`

```typescript
guardHumanAuthority(isHumanValidated: boolean, ctx: RuntimeContext): void
```

📜 **LAW:** *"Human is final authority"*

Throws if a timeline write is attempted without explicit human validation.

---

### `guardRollbackRules`

```typescript
guardRollbackRules(action: { deletesEvents, rewritesHistory, masksDecisions }): void
```

📜 **LAW:** *"Rollback never erases history"*

Throws if rollback attempts to:
- Delete events
- Rewrite history
- Mask decisions

---

## COMPOSITE GUARDS

### Before Agent Execution

```typescript
guardBeforeAgentExecution(ctx, seesOtherAgentOutput?)
```

Runs:
- `guardAgentCannotDecide`
- `guardAgentCannotWriteTimeline`
- `guardParallelIsolation`

---

### Before Orchestration

```typescript
guardBeforeOrchestration(ctx)
```

Ensures only orchestrator can perform orchestration.

---

### Before Timeline Write

```typescript
guardBeforeTimelineWrite(isHumanValidated, ctx)
```

Runs:
- `guardHumanAuthority`
- `guardChainFlow`

---

### Complete Flow

```typescript
guardCompleteFlow(ctx, { isHumanValidated?, seesOtherAgentOutput? })
```

Runs all applicable guards.

---

## SAFE CHECK (Non-Throwing)

```typescript
const result = isActionSafe(ctx, options);
// { safe: boolean, violations: string[] }
```

Returns violations without throwing.

---

## VIOLATION ERROR

```typescript
class CheNuViolationError extends Error {
  code: string;
  context: RuntimeContext;
  timestamp: number;
}
```

### Error Codes

| Code | Description |
|------|-------------|
| `AGENT_DECISION_FORBIDDEN` | Agent attempted to decide |
| `AGENT_TIMELINE_WRITE_FORBIDDEN` | Agent attempted timeline write |
| `CHAIN_FLOW_VIOLATION` | Decision outside chain |
| `PARALLEL_ISOLATION_VIOLATION` | Agent accessed other agent output |
| `HUMAN_AUTHORITY_VIOLATION` | Timeline write without validation |
| `ORCHESTRATION_ONLY_ORCHESTRATOR` | Non-orchestrator attempted orchestration |

---

## USAGE EXAMPLE

```typescript
import {
  guardBeforeAgentExecution,
  guardBeforeTimelineWrite,
  createSafeContext,
  CheNuViolationError,
} from '@chenu/core/guards';

// Before agent execution
try {
  guardBeforeAgentExecution(
    createSafeContext('context_analyzer', 'parallel_analysis'),
    false // not seeing other agent output
  );
  // Proceed with agent work
} catch (e) {
  if (e instanceof CheNuViolationError) {
    console.error(`Guard violation: ${e.code}`);
    // System must stop
  }
}

// Before timeline write
try {
  guardBeforeTimelineWrite(true, {
    agentType: 'orchestrator',
    currentStage: 'human_validation',
    attemptingTimelineWrite: true,
  });
  // Proceed with timeline write
} catch (e) {
  // Block write
}
```

---

## PROCESS ANALYSIS

The `processAnalysis` module observes patterns **without deciding**.

```typescript
import { analyzeProcessFlow, generateSessionSummary } from '@chenu/core/guards';

const report = analyzeProcessFlow(sessionActions);
// { summary, observations, uncertainty, suggestions?, requiresHumanValidation: true }

const summary = generateSessionSummary(sessionActions);
// { report, navigation, decisions, agents, requiresHumanValidation: true }
```

### ⚠️ Important

The analysis layer **NEVER**:
- Makes decisions
- Applies changes automatically
- Optimizes humans
- Writes to the timeline

It only **OBSERVES** and **REPORTS**.

---

## DESIGN INTENT

```
CHE·NU is calm by design.
CHE·NU never rushes.
CHE·NU never hides decisions.

If the system ever feels unclear or forced,
it is violating its own laws.
```

---

## STATUS

| Status | Value |
|--------|-------|
| Official | ✅ |
| Freeze-ready | ✅ |
| Domain-agnostic | ✅ |
| Scales safely | ✅ |
| Defensible by design | ✅ |

---

**Version:** guards-1.0
**Status:** CANONICAL — DO NOT MODIFY WITHOUT CONSTITUTIONAL REVIEW
