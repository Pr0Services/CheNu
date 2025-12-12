# CHE·NU — Internal Agent Context & Context Interpreter

## 📜 Overview

This document describes the agent context adaptation system and the Context Interpreter Agent (CIA) — the key components that enable intelligent workflow adaptation while maintaining strict governance.

## ⚠️ Critical Principle

```
┌─────────────────────────────────────────────────────────────┐
│  AGENTS HAVE NO DECISION AUTHORITY                         │
│                                                             │
│  Context adaptation frames behavior ONLY.                   │
│  It does NOT:                                               │
│  - Grant decision power                                     │
│  - Override Core Reference laws                             │
│  - Bypass human validation                                  │
│  - Modify the timeline                                      │
│                                                             │
│  Confirmation: "Context acknowledged. Authority unchanged." │
└─────────────────────────────────────────────────────────────┘
```

## 🏗️ Architecture

```
Human Intent
    │
    ▼
┌──────────────────────────────┐
│ Context Interpreter Agent    │
│ (CIA)                        │
│                              │
│ - Detects intent patterns    │
│ - Identifies risks           │
│ - Surfaces ambiguities       │
│ - Generates 2-4 options      │
└──────────────────────────────┘
    │
    ▼
Context Declaration (standardized)
    │
    ▼
┌──────────────────────────────┐
│ Orchestrator                 │
│                              │
│ - Routes to specialized      │
│   agents                     │
│ - Maintains governance       │
└──────────────────────────────┘
    │
    ▼
Specialized Agents (constrained)
```

## 📋 Internal Agent Context Template

### 1. Agent Identification

```typescript
interface AgentIdentification {
  agentId: string;           // Unique identifier
  category: AgentCategory;   // observer, analyst, advisor, etc.
  authority: 'NONE';         // Always NONE
  displayName: string;
  version: string;
}
```

**Categories:**
- `observer` — Watches and reports
- `analyst` — Analyzes patterns
- `advisor` — Suggests (never decides)
- `documenter` — Creates documentation
- `methodology` — Suggests approaches
- `memory` — Recalls context
- `orchestration-support` — Coordinates flow
- `visualization` — Creates visuals
- `context-interpreter` — Interprets intent

### 2. Context Declaration

```typescript
interface ContextDeclaration {
  contextType: AgentContextType;
  associatedSphere?: string;
  associatedEntity?: {
    type: 'project_id' | 'meeting_id' | 'decision_id' | 'timeline_segment';
    value: string;
  };
}
```

**Context Types:**
| Type | Description |
|------|-------------|
| `session` | General interaction |
| `project` | Project-specific work |
| `meeting` | Decision meeting |
| `replay` | Historical review |
| `audit` | Quality/compliance check |
| `exploration` | Idea exploration |
| `documentation` | Doc creation |
| `visualization` | Visual output |

### 3. Operational Constraints

```typescript
interface OperationalConstraints {
  timeSensitivity: 'low' | 'medium' | 'high';
  depthRequired: 'shallow' | 'standard' | 'deep';
  riskTolerance: 'low' | 'medium' | 'high';
  reversibilityExpected: 'yes' | 'partial' | 'no';
}
```

### 4. Working Modes

| Mode | Purpose |
|------|---------|
| `exploration-first` | Discover before narrowing |
| `analysis-heavy` | Deep analysis focus |
| `comparison-focused` | Compare alternatives |
| `summarization-only` | Condense information |
| `documentation-only` | Create docs |
| `visualization-only` | Create visuals |

### 5. Forbidden Actions

Every agent MUST NOT:
- Propose or validate decisions
- Trigger timeline writes
- Modify memory
- Bypass guards
- Assume intent
- Infer authority
- Optimize user behavior

### 6. Output Expectations

```typescript
interface OutputExpectations {
  outputType: OutputType;
  tone: 'neutral' | 'conditional' | 'non-directive';
  uncertaintyHandling: {
    mustBeExplicit: boolean;
    assumptionsMustBeStated: boolean;
    gapsMustBeAcknowledged: boolean;
  };
}
```

## 🔍 Context Interpreter Agent (CIA)

### Purpose

The CIA translates raw user intent into structured context options. It:
- Detects intent patterns
- Identifies risks
- Surfaces ambiguities
- Generates 2-4 viable options
- **Never selects** — human must choose

### Process

```
1. Read raw intent
2. Detect verbs (explore, decide, compare, freeze)
3. Read system state (phase, blockers, debt)
4. Identify potential conflicts
5. Generate 2-4 context frames
6. Explain impacts & risks
7. WAIT for human validation
```

### Input

```typescript
interface ContextInterpreterInput {
  userIntent: string;
  sessionState: SessionSummary;
  activeSphere?: string;
  timeConstraints?: TimeConstraint;
  riskSensitivity?: RiskLevel;
  historyHints?: ContextHistory[];
}
```

### Output

```typescript
interface InterpretationResult {
  input: ContextInterpreterInput;
  options: ContextOption[];        // 2-4 options
  ambiguities: string[];
  conflicts: string[];
  requiresClarification: boolean;
  clarificationQuestions?: string[];
  interpretedAt: string;
}
```

### Example Output

```
CHE·NU — CONTEXT INTERPRETATION RESULT
======================================

Input Intent: "Je veux explorer les structures UX"
Interpreted: 2024-01-15T10:30:00Z

OPTIONS (3)
========================================

OPTION_A:
  Context Type: exploration
  Objective: Explore options and possibilities related to UX structures
  Working Mode: exploration-first
  Confidence: 72%
  Risks: Potential scope expansion without boundaries
  Recommended: When you want to discover possibilities without commitment
  Rationale: Detected intent signals: "explorer"

OPTION_B:
  Context Type: documentation
  Objective: Formalize and document existing decisions or knowledge
  Working Mode: documentation-only
  Confidence: 64%
  Risks: May block creativity
  Recommended: When knowledge needs to be captured and formalized
  Rationale: Inferred from context and session state

OPTION_C:
  Context Type: audit
  Objective: Analyze and compare alternatives systematically
  Working Mode: analysis-heavy
  Confidence: 55%
  Risks: none identified
  Recommended: When multiple alternatives need systematic evaluation
  Rationale: Conservative option for systematic approach

AMBIGUITIES
========================================
- No time constraints specified — defaulting to standard

[Awaiting human selection]
```

## 🔧 API Usage

### Build Agent Context

```typescript
import { buildAgentContextAdaptation, formatAgentContext } from '@core/agents';

const agentContext = buildAgentContextAdaptation({
  agent: {
    agentId: 'analyst-001',
    category: 'analyst',
    displayName: 'Financial Analyst',
  },
  context: {
    contextType: 'audit',
    associatedSphere: 'business',
  },
  primaryObjective: 'Analyze Q4 financial patterns',
  workingMode: 'analysis-heavy',
  allowedEmphasis: ['completeness', 'pattern detection'],
});

console.log(formatAgentContext(agentContext));
```

### Use Context Interpreter

```typescript
import { contextInterpreter, formatInterpretationResult } from '@core/agents';

const result = contextInterpreter.interpret({
  userIntent: 'Je veux comparer les options de déploiement',
  sessionState: {
    currentPhase: 'development',
    blockers: [],
    pendingDecisions: 2,
  },
  activeSphere: 'technical',
  timeConstraints: {
    urgent: false,
    preferredDuration: 'standard',
  },
  riskSensitivity: 'low',
});

console.log(formatInterpretationResult(result));

// Human selects option
// Then orchestrator routes accordingly
```

### Agent Presets

```typescript
import { getAgentPreset, AGENT_PRESETS } from '@core/agents';

// Available presets
const presets = Object.keys(AGENT_PRESETS);
// ['observer', 'analyst', 'documenter', 'context_interpreter']

// Get specific preset
const analyistPreset = getAgentPreset('analyst');
```

## 🛡️ Validation

### Validate Agent Context

```typescript
import { validateAgentContext } from '@core/agents';

const validation = validateAgentContext(agentContext);

if (!validation.valid) {
  console.error('Errors:', validation.errors);
}

if (validation.warnings.length > 0) {
  console.warn('Warnings:', validation.warnings);
}
```

### Validate Confirmation

```typescript
import { validateAgentConfirmation, AGENT_CONFIRMATION } from '@core/agents';

const agentResponse = 'Context acknowledged. Authority unchanged.';
const isValid = validateAgentConfirmation(agentResponse);
```

## 📊 Intent Detection

The CIA detects intent patterns using verb analysis:

| Intent | Verbs (FR/EN) |
|--------|---------------|
| `exploration` | explorer, explore, découvrir, discover, essayer, try |
| `decision` | décider, decide, choisir, choose, valider, validate |
| `comparison` | comparer, compare, analyser, analyze, évaluer, evaluate |
| `documentation` | documenter, document, figer, freeze, formaliser, formalize |
| `visualization` | visualiser, visualize, afficher, display, montrer, show |
| `audit` | auditer, audit, vérifier, verify, contrôler, check |
| `meeting` | réunion, meeting, discussion, discuss, session |
| `replay` | rejouer, replay, revoir, review, historique, history |

## ⚠️ Risk Detection

The CIA automatically detects risks:

- **Scope expansion** — Exploration without boundaries
- **Blocker impact** — Active blockers may affect progress
- **Technical debt** — High debt complicates new work
- **Decision backlog** — Pending decisions need attention
- **Mode tension** — Documentation vs creativity conflict

## 🚫 Conflict Detection

The CIA flags authority-assuming language:
- "automatiquement" / "automatically"
- "sans validation" / "without validation"
- "décider seul" / "decide alone"
- "bypass" / "contourner"
- "ignorer" / "ignore"
- "forcer" / "force"

When detected: **STOP and escalate to human authority.**

## 📜 System Prompt

```
You are the CHE·NU Context Interpreter Agent.

Your role is to translate user intent and system state into
explicit operational context options.

Rules:
- You have NO decision authority.
- You must NEVER select a context.
- You must ALWAYS present multiple viable context options.
- You must surface risks, ambiguity, and trade-offs.
- You must not optimize silently.
- You must not infer intent beyond provided signals.

If ambiguity exists:
- ask clarification.

If conflict with Core Reference exists:
- stop and escalate.

Your output must be:
- structured
- neutral
- explicit
- reversible
```

## 📜 Confirmation Protocol

**Agent must confirm:**
```
Context acknowledged. Authority unchanged.
```

**This confirms:**
- Context adaptation received
- No authority claimed
- CHE·NU laws respected

---

**Context acknowledged. Authority unchanged.** ✅

*CHE·NU — Governed Intelligence Operating System*
