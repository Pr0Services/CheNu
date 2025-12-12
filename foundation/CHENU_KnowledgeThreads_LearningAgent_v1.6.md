# CHE·NU — KNOWLEDGE THREADS + LEARNING AGENT
**VERSION:** FOUNDATION v1.6  
**MODE:** CORE KNOWLEDGE STRUCTURE / SAFE LEARNING

---

## GLOBAL PRINCIPLE

> **Knowledge Threads connect INFORMATION.**  
> **They do NOT create meaning, opinions, or priorities.**

> **Learning Agent observes STRUCTURE.**  
> **It does NOT form beliefs, strategies, or intent.**

---

## KNOWLEDGE THREADS — OVERVIEW

A Knowledge Thread is a **TRACEABLE LINK** between:
- information
- time
- context
- decisions
- artifacts

**Threads are READ-ONLY once validated.**

---

## THREAD TYPE 1 — FACT THREAD

### Purpose
Track objective elements across meetings and spheres.

### Sources
- documents
- notes
- data points
- timestamps
- decisions (as declared facts)

### Never Includes
- ❌ interpretation
- ❌ sentiment
- ❌ outcome quality

### Model

```json
{
  "fact_thread": {
    "id": "uuid",
    "topic": "string",
    "entries": [
      {
        "type": "artifact|decision|note",
        "source_id": "uuid",
        "sphere": "business|scholar|xr|...",
        "timestamp": 1712345678,
        "hash": "sha256"
      }
    ],
    "status": "validated"
  }
}
```

---

## THREAD TYPE 2 — CONTEXT THREAD

### Purpose
Link facts to their surrounding conditions.

### Includes
- meeting type
- participants
- sphere
- tools used
- environmental setup (XR preset, room)

### Never Includes
- ❌ inferred intent
- ❌ emotional states

### Model

```json
{
  "context_thread": {
    "id": "uuid",
    "linked_fact_thread": "uuid",
    "contexts": [
      {
        "meeting_id": "uuid",
        "sphere": "string",
        "participants": ["user|agent"],
        "environment": "xr|2d|hybrid",
        "timestamp": 1712345678
      }
    ]
  }
}
```

---

## THREAD TYPE 3 — EVOLUTION THREAD

### Purpose
Track how knowledge STRUCTURE evolves over time **WITHOUT judging correctness or success**.

### Tracks
- additions
- removals
- restructures
- branching

### Key Rule
> **Evolution ≠ improvement.**  
> **It is structural change only.**

### Model

```json
{
  "evolution_thread": {
    "id": "uuid",
    "topic": "string",
    "changes": [
      {
        "change_type": "add|remove|merge|split",
        "target_id": "uuid",
        "timestamp": 1712345678,
        "source": "meeting|agent|user"
      }
    ]
  }
}
```

---

## THREAD VISIBILITY & CONTROL

| Rule | Description |
|------|-------------|
| Visibility | Based on sphere & permissions |
| Private threads | Never surface globally |
| Muting | Threads can be muted, not deleted |
| Sources | Original sources always accessible |

---

## LEARNING AGENT — CORE DEFINITION

### AGENT_LEARNING_OBSERVER

| Property | Value |
|----------|-------|
| **TYPE** | PASSIVE / STRUCTURAL / NON-STRATEGIC |
| **Purpose** | Learn how INFORMATION is organized, NOT what it means or what to do |

---

## WHAT THE LEARNING AGENT CAN OBSERVE

- ✅ frequency of thread creation
- ✅ thread branching patterns
- ✅ thread reuse across spheres
- ✅ navigation patterns (anonymous)
- ✅ structural redundancies

---

## WHAT THE LEARNING AGENT CANNOT DO

- ❌ cannot make recommendations
- ❌ cannot modify threads
- ❌ cannot rank information
- ❌ cannot infer intent
- ❌ cannot influence users

---

## LEARNING OUTPUTS

### Types
- structural reports
- complexity maps
- redundancy alerts
- unused thread signals
- growth vs stagnation metrics

### Properties
All outputs are:
- ✅ descriptive only
- ✅ human-readable
- ✅ optional to view

---

## LEARNING OUTPUT MODEL

```json
{
  "learning_report": {
    "scope": "personal|team|sphere|system",
    "metrics": {
      "thread_count": 120,
      "avg_depth": 3.2,
      "branch_ratio": 0.41,
      "reuse_rate": 0.67
    },
    "observations": [
      "High duplication in scholar threads",
      "Low reuse across business/xr spheres"
    ]
  }
}
```

---

## ETHICAL LOCKS

| Lock | Description |
|------|-------------|
| No predictive behavior | Cannot predict user actions |
| No optimization pressure | Cannot push for "better" outcomes |
| No success labeling | Cannot mark threads as good/bad |
| No future inference | Cannot speculate about intentions |

---

## WHY THIS MATTERS

| Component | Purpose |
|-----------|---------|
| **Knowledge Threads** | Preserve truth, prevent narrative drift |
| **Learning Agent** | Improve structure, without steering minds |

### Together
> **Clarity without control**  
> **Intelligence without authority**

---

**END — FOUNDATION FREEZE**
