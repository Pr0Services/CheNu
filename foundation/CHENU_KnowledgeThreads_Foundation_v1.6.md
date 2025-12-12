# CHE·NU — KNOWLEDGE THREADS SYSTEM + CONTINUITY PROMPT
**VERSION:** FOUNDATION v1.6  
**STATUS:** FREEZE-COMPATIBLE / CLAUDE-READY

---

## PART A — KNOWLEDGE THREADS (CORE CONCEPT)

### Definition
A Knowledge Thread is a **TRACEABLE LINE** of information connecting facts, meetings, agents, decisions, artifacts, across time and spheres.

### RULE
> **Threads reveal RELATIONSHIPS.**  
> **They NEVER infer intent or meaning.**

---

## THREAD TYPE 1 — FACTUAL THREAD

### Purpose
Track objective facts across space and time.

### Sources
- XR replays
- meeting artifacts
- official notes
- validated outputs
- agent actions (trace only)

### Properties
- append-only
- immutable
- time-stamped
- source-linked
- replay-verifiable

### JSON MODEL
```json
{
  "thread": {
    "id": "uuid",
    "type": "factual",
    "events": [
      {
        "source": "replay|document|agent",
        "ref_id": "uuid",
        "timestamp": 1712345678
      }
    ],
    "hash": "sha256"
  }
}
```

### Use Cases
- audit
- compliance
- replay comparison
- institutional memory

---

## THREAD TYPE 2 — DECISION THREAD

### Purpose
Track HOW decisions evolved without judging correctness.

### Sources
- decision declarations
- proposal versions
- meeting outcomes
- silence markers (non-decision)

### Rules
- shows branching, not ranking
- preserves abandoned paths
- no success/failure labels

### JSON MODEL
```json
{
  "thread": {
    "id": "uuid",
    "type": "decision",
    "branches": [
      {
        "decision_id": "uuid",
        "origin_meeting": "uuid",
        "timestamp": 1712345678
      }
    ]
  }
}
```

### Use Cases
- replay comparison
- learning reviews
- strategy retrospectives
- XR comparative analysis

---

## THREAD TYPE 3 — KNOWLEDGE CONTEXT THREAD

### Purpose
Provide CONTEXT bridges between spheres and domains without altering underlying data.

### Sources
- shared topics
- reused artifacts
- referenced decisions
- shared agents or users

### Rules
- soft links only
- removable
- visibility-based
- non-authoritative

### JSON MODEL
```json
{
  "thread": {
    "id": "uuid",
    "type": "context",
    "links": [
      {
        "from": "node_id",
        "to": "node_id",
        "reason": "shared_topic|artifact|agent"
      }
    ]
  }
}
```

### Use Cases
- discovery
- navigation
- universe view clustering
- AI routing signals (non-binding)

---

## THREAD SAFETY GUARANTEES

- ❌ No intent inference
- ❌ No emotion tagging
- ❌ No ranking
- ❌ No manipulation
- ✅ Full source transparency

---

## PART B — THREAD VISUALIZATION & XR

- Threads rendered as:
  - lines (thin = context, solid = factual)
  - branching paths for decisions
- Toggle per thread type
- XR mode: spatial braiding
- 2D mode: layered timelines
- Always read-only by default

---

## PART C — AGENTS INVOLVED

| Agent | Role |
|-------|------|
| AGENT_THREAD_BUILDER | constructs threads, append-only |
| AGENT_THREAD_VALIDATOR | verifies sources, checks hashes |
| AGENT_THREAD_RENDERER | visualizes only, never interprets |
| AGENT_THREAD_GUARD | enforces ethical constraints |

---

## PART D — PROMPT DE CONTINUITÉ POUR CLAUDE

### SYSTEM PROMPT (À DONNER TEL QUEL À CLAUDE):

```
You are continuing an existing Che-Nu system.
You MUST assume that ALL referenced documents,
modules, rules, and concepts already exist,
even if not repeated.

Rules:
- Never reintroduce construction-specific assumptions.
- Never overwrite or simplify existing systems.
- Always integrate with:
  - Architectural Sphere
  - XR Meeting Room
  - Avatar Evolution
  - Universe View
  - Replay System
  - Collective Memory
  - Knowledge Threads (factual, decision, context)
- If information seems missing, ASK before redefining.
- Preserve non-manipulative, non-decisional principles.
- Do not create alternative architectures.
- Extend only, never replace, foundation systems.

If unsure:
Pause and request clarification before coding.
```

---

## WHY THIS MATTERS

Knowledge Threads ensure:
- ✅ continuity across time
- ✅ clarity without bias
- ✅ learning without rewriting history
- ✅ shared truth with personal freedom

---

**END — FOUNDATION FREEZE READY**
