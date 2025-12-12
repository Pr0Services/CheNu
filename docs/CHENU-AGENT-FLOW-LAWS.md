# CHE·NU — AGENT FLOW LAWS

> *"Complexity is processed in parallel. Responsibility advances in chain."*

---

## OVERVIEW

CHE·NU is a directional operating system for human intention, decision, and continuity.

This document defines the **immutable laws** governing:

- ⚡ **Parallel agent work** — Multiple agents analyze simultaneously
- 🔗 **Sequential decision flow** — Responsibility advances step by step
- 👤 **Authority and responsibility** — Human is final authority

**These laws override any local optimization, agent preference, or domain logic.**

---

## FLOW DIAGRAM

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           USER INTENTION                                    │
│                                 │                                           │
│                                 ▼                                           │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │              PARALLEL ANALYSIS (No Decisions)                        │  │
│  │                                                                      │  │
│  │   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │  │
│  │   │  Context    │  │   Memory    │  │   Preset    │                 │  │
│  │   │  Analyzer   │  │   Agent     │  │   Advisor   │                 │  │
│  │   └──────┬──────┘  └──────┬──────┘  └──────┬──────┘                 │  │
│  │          │                │                │                         │  │
│  │   ┌──────┴──────┐  ┌──────┴──────┐  ┌──────┴──────┐                 │  │
│  │   │    UX       │  │   Sphere    │  │ Methodology │                 │  │
│  │   │  Observer   │  │   Agents    │  │   Agents    │                 │  │
│  │   └──────┬──────┘  └──────┬──────┘  └──────┬──────┘                 │  │
│  │          │                │                │                         │  │
│  └──────────┼────────────────┼────────────────┼─────────────────────────┘  │
│             │                │                │                            │
│             └────────────────┼────────────────┘                            │
│                              │                                             │
│                              ▼                                             │
│                    ┌─────────────────┐                                     │
│                    │  ORCHESTRATOR   │                                     │
│                    │  (Aggregate,    │                                     │
│                    │   Never Alter)  │                                     │
│                    └────────┬────────┘                                     │
│                             │                                              │
│                             ▼                                              │
│                    ┌─────────────────┐                                     │
│                    │ DECISION ANALYST│                                     │
│                    │ (Clarification  │                                     │
│                    │      Only)      │                                     │
│                    └────────┬────────┘                                     │
│                             │                                              │
│                             ▼                                              │
│              ┌──────────────────────────────┐                              │
│              │      HUMAN VALIDATION        │                              │
│              └──────────────┬───────────────┘                              │
│                    ┌────────┴────────┐                                     │
│                    │                 │                                     │
│                    ▼                 ▼                                     │
│             ┌──────────┐      ┌──────────┐                                 │
│             │ APPROVED │      │ REJECTED │                                 │
│             └────┬─────┘      └────┬─────┘                                 │
│                  │                 │                                       │
│                  ▼                 ▼                                       │
│          ┌─────────────┐   ┌─────────────┐                                 │
│          │  TIMELINE   │   │  RETURN TO  │                                 │
│          │   WRITE     │   │   NEUTRAL   │                                 │
│          └──────┬──────┘   └─────────────┘                                 │
│                 │                                                          │
│                 ▼                                                          │
│          ┌─────────────┐                                                   │
│          │  CONTINUE / │                                                   │
│          │   RESUME    │                                                   │
│          └─────────────┘                                                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## PHASE 1: PARALLEL ANALYSIS

### Mode
**PARALLEL** — Multiple agents work simultaneously, independently.

### Agents Involved

| Agent | Role |
|-------|------|
| Context Analyzer | Summarize current state |
| Memory Agent | Recall relevant past |
| Preset Advisor | Suggest modes |
| UX Observer | Detect cognitive load |
| Sphere Agents | Domain context |
| Methodology Agents | Process guidance |

### Used For

- Exploration
- Analysis
- Comparison
- Contextualization
- Memory recall
- Methodology
- UX observation

### ❌ FORBIDDEN BEHAVIORS

| Forbidden | Reason |
|-----------|--------|
| Synthesizing other agents' outputs | Prevents bias |
| Prioritizing one agent over another | Preserves neutrality |
| Mutual influence between agents | Maintains independence |
| Final decision making | Human authority only |

---

## PHASE 2: ORCHESTRATION

### Role
The **Orchestrator** collects all parallel outputs without alteration.

### Rules

| Rule | Description |
|------|-------------|
| Aggregate only | No synthesis, no prioritization |
| Neutral presentation | Options, not recommendations |
| No modification | Agent outputs remain untouched |
| No UI manipulation | Display only |

---

## PHASE 3: DECISION CLARIFICATION

### Role
The **Decision Analyst** clarifies what the user is deciding.

### Outputs

- Intent summary (one sentence)
- Decision type (exploratory / evaluative / final)
- Known constraints
- Explicit unknowns

### ❌ RESTRICTIONS

- Do NOT suggest solutions
- Do NOT rank options
- Do NOT infer beyond stated

---

## PHASE 4: HUMAN VALIDATION

### The Fork

```
           HUMAN VALIDATION
                 │
        ┌───────┴───────┐
        │               │
    APPROVED        REJECTED
        │               │
        ▼               ▼
  TIMELINE WRITE   RETURN TO NEUTRAL
```

### Authority Rules

| Rule | Value |
|------|-------|
| Agents decide | ❌ **NEVER** |
| Agents write timeline | ❌ **NEVER** |
| Orchestrator decides | ❌ **NEVER** |
| Human is final authority | ✅ **ALWAYS** |

---

## PHASE 5: TIMELINE WRITE or RETURN

### If Approved
- Write to timeline (append-only)
- Continue / Resume flow

### If Rejected
- Return to neutral state
- No timeline write
- Responsibility preserved

---

## CHAIN DECISION TRIGGERS

The system switches from **parallel** to **chain** mode when:

| Trigger | Description |
|---------|-------------|
| `decision_envisioned` | A decision is being considered |
| `temporal_commitment_required` | Time-bound action |
| `durable_state_change_possible` | Persistent change |
| `timeline_write_involved` | Will write to timeline |

---

## IMMUTABLE SEQUENCE

When chain mode is triggered:

```
1. user_intention
2. parallel_analysis
3. orchestration
4. decision_clarification
5. human_validation
6. timeline_write (if approved)
```

**This sequence cannot be bypassed or reordered.**

---

## ROLLBACK RULES

| Rule | Value |
|------|-------|
| Strategy | Reinterpret state |
| Writes timeline | ❌ **NEVER** |
| Can delete events | ❌ **NEVER** |
| Can rewrite history | ❌ **NEVER** |
| Can mask decisions | ❌ **NEVER** |

---

## VALIDITY CRITERIA

A valid CHE·NU flow must satisfy:

| Criterion | Required |
|-----------|----------|
| Complexity handled in parallel | ✅ |
| Responsibility advances in chain | ✅ |
| Human never pressured | ✅ |
| Decision always clear | ✅ |
| Rollback preserves responsibility | ✅ |

---

## MERMAID DIAGRAM

```mermaid
flowchart TB
    A[User Intention] --> B[Parallel Agents]

    subgraph Parallel_Work["Parallel Analysis (No Decisions)"]
        B --> C1[Context Analyzer]
        B --> C2[Memory Agent]
        B --> C3[Preset Advisor]
        B --> C4[UX Observer]
        B --> C5[Sphere Agents]
        B --> C6[Methodology Agents]
    end

    C1 --> D[Orchestrator]
    C2 --> D
    C3 --> D
    C4 --> D
    C5 --> D
    C6 --> D

    D --> E[Decision Analyst<br/>(Clarification Only)]

    E --> F{Human Validation}

    F -->|Approved| G[Timeline Write]
    F -->|Rejected| H[Return to Neutral State]

    G --> I[Continue / Resume]
```

---

## SUMMARY

```
📜 LAW 1: Parallel agents NEVER decide
📜 LAW 2: Orchestrator NEVER alters
📜 LAW 3: Chain sequence is IMMUTABLE
📜 LAW 4: Human is FINAL authority
📜 LAW 5: Timeline is APPEND-ONLY
📜 LAW 6: Rollback NEVER erases
```

---

**Version:** parallel-chain-1.0
**Status:** CANONICAL — DO NOT MODIFY WITHOUT CONSTITUTIONAL REVIEW
