# CHE·NU — Decision Echo System

## Status: OBSERVATIONAL DECISION MEMORY
## Authority: NONE
## Intent: TRANSPARENCY WITHOUT INFLUENCE

---

## Overview

Decision Echo exists to reflect past decisions as they were taken, without evaluation, reinforcement, or guidance.

**It answers only:**
- "What decision was made?"
- "In what context was it made?"

**It NEVER answers:**
- "Was it good?"
- "Should it be repeated?"
- "What comes next?"

---

## Core Philosophy

### What Decision Echo IS

A Decision Echo is:
- A **factual mirror** of a past decision
- **Temporally anchored** to when it occurred
- **Context-bound** to the situation at decision time

### What Decision Echo IS NOT

A Decision Echo is NOT:
- A recommendation engine
- A pattern recognition system
- A success/failure tracker
- A behavioral nudge system
- A workflow trigger

---

## Position in Architecture

```
Human Decision (validated)
        ↓
   Decision Record
        ↓
   DECISION ECHO
        ↓
   Human Reading ONLY
```

**Completely Isolated From:**
- Orchestrator
- Agents (L0-L3)
- Preference learning
- Context suggestion
- Execution systems

---

## Data Model

### DecisionEcho Interface

```typescript
interface DecisionEcho {
  decisionId: string;           // Unique identifier
  timestamp: ISODate;           // When decision was confirmed
  scope: "session" | "project" | "sphere" | "system";
  declaredObjective: string;    // Human's stated goal
  contextSnapshot: {
    contextType: ContextType;
    workingMode: WorkingMode;
    constraints: OperationalConstraints;
    activeSphere?: string;
    activeProject?: string;
    sessionId: string;
  };
  decisionStatement: string;    // What was decided
  reversibility: "yes" | "partial" | "no";
  confirmationMethod: "explicit" | "procedural";
  decidedBy: string;            // Human identifier
}
```

### What IS Preserved

- The declared intent at decision time
- The active context frame
- Known operational constraints
- Who made the decision
- When it was made

### What IS NOT Preserved

- Reasoning chains
- Emotional states
- Inferred motivations
- Outcome assessments
- Causal relationships

---

## Creation Rules

### Echo Creation REQUIRES

1. **Human explicitly validated** the decision
2. **System was in decision context** (not exploration)
3. **Confirmation was recorded**

### Echo Creation BLOCKED When

- Activity is **exploration**
- Activity is **comparison**
- Activity is **suggestion**
- Activity is **draft**
- Activity is **simulation**

### Code Example

```typescript
import { 
  createDecisionEchoService,
  DecisionScope,
  DecisionReversibility,
  ConfirmationMethod,
  DecisionContextType,
  DecisionWorkingMode
} from './decision-echo';

const service = createDecisionEchoService();

// Create echo (only when conditions are met)
const echo = await service.createEcho({
  scope: DecisionScope.PROJECT,
  declaredObjective: 'Select foundation material',
  decisionStatement: 'Selected concrete mix type A',
  reversibility: DecisionReversibility.PARTIAL,
  confirmationMethod: ConfirmationMethod.EXPLICIT,
  decidedBy: 'user-123',
  currentContext: {
    contextType: DecisionContextType.PLANNING,
    workingMode: DecisionWorkingMode.COLLABORATIVE,
    sessionId: 'session-abc'
  },
  creationConditions: {
    humanValidated: true,
    inDecisionContext: true,
    confirmationRecorded: true
  },
  preventionConditions: {
    isExploration: false,
    isComparison: false,
    isSuggestion: false,
    isDraft: false,
    isSimulation: false
  }
});
```

---

## Language Safety

### Allowed Language

These terms are factual and non-causal:

| Term | Usage |
|------|-------|
| decided | "Decided to proceed" |
| confirmed | "Confirmed the selection" |
| recorded | "Recorded at timestamp" |
| occurred at | "Occurred at 14:30" |
| selected | "Selected option A" |
| chosen | "Chosen by team lead" |
| documented | "Documented in record" |

### Forbidden Language

These terms imply causality, influence, or judgment:

| ❌ Term | Why Forbidden |
|---------|---------------|
| led to | Implies causation |
| caused | Implies causation |
| resulted in | Implies causation |
| influenced | Implies effect |
| successful | Implies judgment |
| failed | Implies judgment |
| better | Implies comparison |
| worse | Implies comparison |
| should | Implies recommendation |
| recommended | Implies guidance |

### Validation Example

```typescript
import { validateEchoLanguage } from './decision-echo';

// Valid - factual language
const good = validateEchoLanguage('Decided to use material A');
// { isValid: true, forbiddenTermsFound: [] }

// Invalid - causal language
const bad = validateEchoLanguage('This led to better results');
// { isValid: false, forbiddenTermsFound: ['led to', 'better'] }
```

---

## Display Rules

Decision Echoes MUST be displayed as:

| Rule | Requirement |
|------|-------------|
| Format | Static entries |
| Order | Chronological only |
| Highlighting | NONE |
| Emphasis | NONE |
| Urgency indicators | NONE |
| Call-to-action | NONE |

### React Component

```tsx
import { DecisionEchoView } from './decision-echo';

function MyComponent() {
  const [echoes, setEchoes] = useState([]);
  
  return (
    <DecisionEchoView 
      echoes={echoes}
      showFilters={true}
      showContextDetails={false}
    />
  );
}
```

---

## XR Visualization

In XR/Universe View:

| Property | Value |
|----------|-------|
| Appearance | Fixed markers |
| Arrows | NONE (no direction) |
| Glow | NONE |
| Reward signals | NONE |
| Interaction | View only |

**Markers are landmarks, not milestones.**

They mark where decisions occurred in the project timeline, but do not indicate path, progress, or success.

---

## Failsafes

These are **architectural constraints**, not configurable options:

| Failsafe | Status |
|----------|--------|
| Cannot trigger workflows | ✅ ENFORCED |
| Cannot be edited | ✅ ENFORCED |
| Cannot be ranked | ✅ ENFORCED |
| Cannot be auto-summarized | ✅ ENFORCED |
| Cannot connect to orchestrator | ✅ ENFORCED |
| Cannot connect to agents | ✅ ENFORCED |
| Cannot feed preference learning | ✅ ENFORCED |
| Cannot suggest context | ✅ ENFORCED |
| Cannot trigger execution | ✅ ENFORCED |

### Failsafe Code Enforcement

```typescript
const service = createDecisionEchoService();

// These will all THROW errors:
await service.updateEcho('id', {});     // FAILSAFE VIOLATION
await service.deleteEcho('id');          // FAILSAFE VIOLATION
await service.rankEchoes({});            // FAILSAFE VIOLATION
await service.summarizeEchoes([]);       // FAILSAFE VIOLATION
await service.getRecommendations({});    // FAILSAFE VIOLATION
await service.triggerWorkflow('id', {}); // FAILSAFE VIOLATION
```

---

## Relationship to Context Recovery

| Aspect | Decision Echo | Context Recovery |
|--------|---------------|------------------|
| Purpose | Record decisions | Reorient context |
| Timing | At decision time | Any time |
| Mutability | Immutable | Creates new frame |
| Effect on Echo | N/A | None - echo remains |

**Key Principle:** Context Recovery may occur AFTER a decision, but it:
- Does NOT invalidate the echo
- Does NOT evaluate the echo
- Does NOT modify the echo

The echo remains as a permanent record of what was decided, regardless of subsequent context changes.

---

## API Reference

### Service Methods

```typescript
// Create service
const service = createDecisionEchoService();

// Get system info
service.getSystemInfo();

// Validate before creation
service.validateInput(input);

// Check language
service.checkLanguage(text);

// Create echo (validates automatically)
await service.createEcho(input);

// Query echoes (read-only, chronological)
await service.queryEchoes({ scope: DecisionScope.PROJECT });

// Get specific echo
await service.getEcho(decisionId);

// Get by scope
await service.getByScope(DecisionScope.PROJECT);

// Get by date range
await service.getByDateRange(fromDate, toDate);

// Get by person
await service.getByDecider('user-id');

// Get for session
await service.getForSession('session-id');

// Count
await service.countAll();
```

---

## File Structure

```
src/core/decision-echo/
├── decisionEcho.types.ts      # Complete type definitions
├── decisionEchoEngine.ts      # Validation, creation, storage
├── DecisionEchoView.tsx       # React display components
├── decisionEcho.test.ts       # Comprehensive tests
├── index.ts                   # Public exports
```

---

## System Declaration

```
Decision Echo exists to preserve memory,
not to anchor behavior.

A decision remembered is not a decision repeated.
A record observed is not a path enforced.

Responsibility remains human.
Awareness remains optional.
```

---

## Integration Notes

### With Context Recovery

```typescript
// After context recovery, echoes remain unchanged
const contextBefore = await contextService.getActiveContext();
await contextRecoveryService.triggerRecovery(newContext);
const contextAfter = await contextService.getActiveContext();

// Echoes from contextBefore still exist, unchanged
const echoes = await decisionEchoService.queryEchoes({
  sessionId: contextBefore.sessionId
});
// All echoes preserved
```

### With Constitutional AI

Decision Echo respects Constitutional governance by:
- Never overriding human judgment
- Never suggesting future actions
- Never learning preferences
- Only reflecting what humans decided

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024 | Initial implementation |

---

**END OF DOCUMENTATION**
