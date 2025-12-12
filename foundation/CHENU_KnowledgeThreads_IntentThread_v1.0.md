# CHE·NU — KNOWLEDGE THREADS SYSTEM (INTENT THREAD)
**VERSION:** CORE.v1.0  
**MODE:** FOUNDATION / CROSS-SPHERE / NON-MANIPULATIVE

---

## GLOBAL DEFINITION

> A Knowledge Thread is a **CONTINUOUS, TRACEABLE line of knowledge** that connects facts, decisions, artifacts, discussions, and time **WITHOUT transforming them into narrative or opinion.**

### RULE
> **Threads CONNECT.**  
> **They do NOT interpret, optimize, or conclude.**

---

## THE 3 KNOWLEDGE THREADS

---

## THREAD TYPE 1 — FACT THREAD

### Purpose
Link objective information across time and spheres.

### Sources
- documents, data artifacts, logs, decisions records, validated XR replays

### Characteristics
| Property | Value |
|----------|-------|
| immutable | ✅ |
| append-only | ✅ |
| timestamped | ✅ |
| source-verifiable | ✅ |

### FACT THREAD NEVER CONTAINS
- intent, judgment, sentiment, success/failure labels

### Answers
> **"What exists or happened?"**

### JSON Model (with hash_chain)

```json
{
  "fact_thread": {
    "id": "uuid",
    "origin": "artifact|decision|event",
    "sphere": "business|scholar|xr|...",
    "linked_items": ["uuid"],
    "timeline": ["timestamp"],
    "hash_chain": ["sha256_1", "sha256_2"],
    "visibility": "private|shared|public"
  }
}
```

### Hash Chain ⚡
> Array of SHA256 hashes for cryptographic chain verification

---

## THREAD TYPE 2 — CONTEXT THREAD (with environment)

### Purpose
Preserve surrounding conditions **WITHOUT rewriting facts.**

### Sources
- meeting metadata, participants, sphere state, temporal environment, XR spatial configuration

### Characteristics
| Property | Value |
|----------|-------|
| descriptive only | ✅ |
| parallel to fact threads | ✅ |
| optional visibility | ✅ |

### Answers
> **"Under which conditions did this occur?"**

### JSON Model (with environment) ⚡

```json
{
  "context_thread": {
    "id": "uuid",
    "related_fact_thread": "uuid",
    "meeting_id": "uuid",
    "participants": ["user","agent"],
    "environment": {
      "sphere": "string",
      "xr_preset": "string",
      "mode": "live|review|replay"
    },
    "time_window": ["start","end"]
  }
}
```

### Environment Fields ⚡
| Field | Description |
|-------|-------------|
| `sphere` | Active sphere |
| `xr_preset` | XR configuration used |
| `mode` | live / review / replay |

---

## THREAD TYPE 3 — INTENT THREAD ⚡ UNIQUE

### Purpose
Record **EXPLICITLY DECLARED intentions only.**

### Sources
- user-declared goals
- stated objectives
- written statements

### STRICT RULE ⚡
> **NO inferred intent.**  
> **NO agent-generated intent.**  
> **ONLY declared intent.**

### Answers
> **"What was explicitly said as an objective?"**

### JSON Model

```json
{
  "intent_thread": {
    "id": "uuid",
    "declared_by": "user_id",
    "linked_fact_thread": "uuid",
    "statement": "string",
    "timestamp": "iso",
    "scope": "personal|team|project"
  }
}
```

### Intent Scope ⚡
| Scope | Description |
|-------|-------------|
| `personal` | Individual intent |
| `team` | Team-level intent |
| `project` | Project-wide intent |

---

## THREAD LINKING RULES

| Rule | Status |
|------|--------|
| Fact Thread is PRIMARY | ✅ |
| Context Thread attaches to Fact Thread | ✅ |
| Intent Thread may attach to Fact Thread | ✅ |
| Threads NEVER overwrite each other | ✅ |

### Visualization Line Styles ⚡

| Thread | Style |
|--------|-------|
| **FACT** | solid line |
| **CONTEXT** | dashed line |
| **INTENT** | dotted line ⚡ |

---

## THREAD VISUALIZATION (UNIVERSE VIEW)

| Feature | Description |
|---------|-------------|
| Threads visible as paths | Between nodes |
| Toggle per thread type | Show/hide |
| Hover = metadata only | No content reveal |
| No ranking or color bias | Neutral |
| Timeline scrub enabled | Navigate time |

---

## AGENT ROLES (THREAD SAFE)

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | Creates links only, **no interpretation** |
| `AGENT_THREAD_VALIDATOR` | Checks rule compliance, **blocks inferred data** |
| `AGENT_THREAD_RENDERER` | Visualization only |

---

## SECURITY & ETHICS

| Rule | Status |
|------|--------|
| threads are source-bound | ✅ |
| integrity hash per link | ✅ |
| no hidden aggregation | ✅ |
| full audit trail visible | ✅ |
| user can detach personal intent threads | ✅ |

---

## WHY 3 THREADS

| Thread | Purpose |
|--------|---------|
| **FACT** | ensures truth |
| **CONTEXT** | ensures understanding |
| **INTENT** | ensures responsibility ⚡ |

### Together
- **clarity without narrative**
- **knowledge without manipulation**
- **memory without rewriting**

---

**END — KNOWLEDGE THREADS FREEZE**
