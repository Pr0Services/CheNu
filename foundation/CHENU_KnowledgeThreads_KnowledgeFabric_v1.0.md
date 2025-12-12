# CHE·NU — KNOWLEDGE THREADS SYSTEM (KNOWLEDGE FABRIC)
**VERSION:** FOUNDATION v1.0  
**TYPE:** CROSS-SPHERE KNOWLEDGE STRUCTURE  
**MODE:** NON-MANIPULATIVE / TRACEABLE / IMMUTABLE

---

## GLOBAL PURPOSE

> Allow knowledge to exist as **CONTINUOUS THREADS** across time, meetings, spheres, users and agents, **WITHOUT collapsing complexity or enforcing conclusions.**

### RULE
> **A Knowledge Thread LINKS facts. It NEVER interprets them.**

---

## THE 3 KNOWLEDGE THREAD TYPES

| # | Type | Purpose |
|---|------|---------|
| 1 | FACT THREAD | Track objective information |
| 2 | DECISION THREAD | Trace how decisions emerged |
| 3 | CONTEXT THREAD | Preserve why something mattered |

> **These three together form a COMPLETE KNOWLEDGE FABRIC.**

---

## 1) FACT THREAD

### Purpose
Track objective information across the system.

### FACT Definition ⚡
> **FACT = something that was: stated, shown, recorded, referenced**

### Examples
- a document, a statement, a metric, a visual artifact, a timestamped event

### Fact Thread Rules
| Rule | Status |
|------|--------|
| append-only | ✅ |
| source-bound (always linked) | ✅ |
| no sentiment | ✅ |
| no validation ranking | ✅ |
| **no "truth score"** | ✅ ⚡ |

### Fact Thread JSON (with elements + reference) ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "fact",
    "elements": [
      {
        "source_type": "meeting|replay|document|agent",
        "source_id": "uuid",
        "timestamp": 1712345678,
        "reference": "string",
        "hash": "sha256"
      }
    ]
  }
}
```

### Elements Fields ⚡
| Field | Description |
|-------|-------------|
| `source_type` | meeting / replay / document / **agent** ⚡ |
| `source_id` | UUID |
| `reference` | **String reference** ⚡ |
| `hash` | Per-element hash |

---

## 2) DECISION THREAD

### Purpose
Trace **HOW and WHEN decisions emerged**, without judging if they were right or wrong.

### DECISION Definition ⚡
> **DECISION = a declared outcome or commitment.**

### Decision Thread Rules
| Rule | Status |
|------|--------|
| linked to fact threads | ✅ |
| linked to meetings | ✅ |
| linked to participants | ✅ |
| chronological only | ✅ |
| **no effectiveness metrics** | ✅ ⚡ |
| no recommendation flag | ✅ |

### Decision Thread JSON (with based_on_facts + context) ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "decision",
    "decisions": [
      {
        "decision_id": "uuid",
        "based_on_facts": ["fact_thread_id"],
        "declared_at": 1712345678,
        "participants": ["user_id","agent_id"],
        "context": "short_description"
      }
    ]
  }
}
```

### Decisions Fields ⚡
| Field | Description |
|-------|-------------|
| `based_on_facts` | **Array of fact_thread_id** ⚡ |
| `declared_at` | Timestamp |
| `participants` | Array user/agent |
| `context` | **Short description string** ⚡ |

---

## 3) CONTEXT THREAD

### Purpose
Preserve **WHY something mattered at the time** WITHOUT rewriting it later.

### CONTEXT Definition ⚡
> **CONTEXT = circumstances, constraints, environment.**

### Context Thread Rules
| Rule | Status |
|------|--------|
| contextual snapshot only | ✅ |
| **non-retroactive** | ✅ ⚡ |
| no reinterpretation | ✅ |
| linked to decisions & facts | ✅ |
| **immutable once closed** | ✅ ⚡ |

### Context Thread JSON (with snapshots + constraints + participants_state) ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "context",
    "snapshots": [
      {
        "timeframe": "start|end",
        "sphere": "business|scholar|xr|...",
        "constraints": ["time","budget","access"],
        "participants_state": "summary_only",
        "environment": "string"
      }
    ]
  }
}
```

### Snapshots Fields ⚡
| Field | Description |
|-------|-------------|
| `timeframe` | **"start\|end"** ⚡ |
| `constraints` | **["time","budget","access"]** ⚡ |
| `participants_state` | **"summary_only"** ⚡ |
| `environment` | String |

---

## THREAD INTERCONNECTION RULES

| Rule | Description |
|------|-------------|
| Fact Threads feed Decision Threads | ✅ |
| Decision Threads reference Context Threads | ✅ |
| **Context Threads never modify facts or decisions** | ✅ ⚡ |
| Threads can cross spheres | ✅ |
| Threads are viewable but filterable | ✅ |

---

## THREAD VISUALIZATION (UNIVERSE VIEW) ⚡

### Visual Styles
| Thread Type | Style |
|-------------|-------|
| **Fact Thread** | linear chain |
| **Decision Thread** | **branching nodes** ⚡ |
| **Context Thread** | **layered background field** ⚡ |

### Toggleable Features ⚡
| Feature | Description |
|---------|-------------|
| show/hide per thread type | ✅ |
| isolate thread | ✅ |
| **replay source events** | ✅ ⚡ |

---

## AGENTS INVOLVED (PASSIVE) ⚡

| Agent | Role |
|-------|------|
| `AGENT_THREAD_INDEXER` | indexes references, **no interpretation** ⚡ |
| `AGENT_THREAD_LINKER` | detects possible connections, **suggestion-only** ⚡ |
| `AGENT_THREAD_GUARD` | enforces immutability, **flags violations** ⚡ |

---

## SAFETY & ETHICS

| Guarantee | Status |
|-----------|--------|
| No narrative rewriting | ✅ |
| No persuasion vectors | ✅ |
| No "best interpretation" | ✅ |
| **User always sees SOURCE** | ✅ ⚡ |

---

## WHY KNOWLEDGE THREADS MATTER

They provide:
- **memory without bias**
- **clarity without authority**
- **continuity without control**
- **truth without ideology**

---

**END — FOUNDATION FREEZE**
