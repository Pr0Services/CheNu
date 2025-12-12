# CHE·NU — KNOWLEDGE THREAD SYSTEM (3 THREADS TRUTH-STRUCTURE)
**VERSION:** FOUNDATION v1.0  
**MODE:** TRUTH-STRUCTURE / NON-MANIPULATIVE / FREEZE-READY

---

## GLOBAL PRINCIPLE

> A Knowledge Thread is a **TRACEABLE CONTINUITY of information** across time, spheres, meetings, agents, and artifacts.

### RULE
> **Threads CONNECT facts. They do NOT interpret, rank, or conclude.**

---

## THREAD TYPE 1 — FACT THREAD

### Purpose
Track objective information as it appears, moves, and evolves.

### Sources
- documents, data points, visual artifacts, declared decisions, validated replays

### Characteristics
| Characteristic | Status |
|----------------|--------|
| append-only | ✅ |
| immutable once validated | ✅ |
| **source-linked** | ✅ ⚡ |

### Use Cases ⚡
| Use Case | Description |
|----------|-------------|
| **understanding how a fact emerged** | ⚡ |
| **verifying provenance** | ⚡ |
| **auditing decisions** | ⚡ |

### Fact Thread JSON (with title + status) ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "fact",
    "title": "string",
    "entries": [
      {
        "source_type": "meeting|document|replay",
        "source_id": "uuid",
        "timestamp": 1712345678,
        "sphere": "business|scholar|xr|...",
        "hash": "sha256"
      }
    ],
    "status": "active|archived"
  }
}
```

### Fact Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `title` | **String title** ⚡ |
| `entries[].source_type` | **meeting/document/replay** ⚡ |
| `status` | **active/archived** ⚡ |

---

## THREAD TYPE 2 — DECISION THREAD

### Purpose
Track **HOW decisions were formed over time**, without judging quality or outcome.

### Sources ⚡
- meetings, decision logs, **alternatives discussed** ⚡, **silence intervals** ⚡

### Characteristics ⚡
| Characteristic | Status |
|----------------|--------|
| **sequential** | ✅ ⚡ |
| **time-aligned** | ✅ ⚡ |
| **replay-linked** | ✅ ⚡ |

### Use Cases ⚡
| Use Case | Description |
|----------|-------------|
| **review decision paths** | ⚡ |
| **compare alternatives** | ⚡ |
| **understand context evolution** | ⚡ |

### Decision Thread JSON (with question + steps + final_state) ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "decision",
    "question": "string",
    "steps": [
      {
        "timestamp": 1712345678,
        "event": "proposal|discussion|pause|decision",
        "meeting_id": "uuid",
        "participants": ["user","agent"],
        "linked_facts": ["thread_id"]
      }
    ],
    "final_state": "declared|revised|open"
  }
}
```

### Decision Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `question` | **String - the question being decided** ⚡ |
| `steps` | **Array of steps** |
| `steps[].event` | **proposal/discussion/pause/decision** ⚡ |
| `steps[].linked_facts` | **Array of thread_ids** ⚡ |
| `final_state` | **declared/revised/open** ⚡ |

---

## THREAD TYPE 3 — CONTEXT THREAD

### Purpose
Track **ENVIRONMENTAL & CONTEXTUAL continuity** without creating narratives or intent assumptions.

### Sources ⚡
| Source | Description |
|--------|-------------|
| sphere context | ✅ |
| participant sets | ✅ |
| **tools used** | ⚡ |
| **meeting modes** | ⚡ |
| **architectural presets** | ⚡ |

### Characteristics ⚡
| Characteristic | Status |
|----------------|--------|
| descriptive only | ✅ |
| **non-causal** | ✅ ⚡ |
| **non-evaluative** | ✅ ⚡ |

### Use Cases ⚡
| Use Case | Description |
|----------|-------------|
| **understand environment shifts** | ⚡ |
| **explain why paths differ** | ⚡ |
| **align parallel histories** | ⚡ |

### Context Thread JSON (with tools + preset) ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "context",
    "entries": [
      {
        "timestamp": 1712345678,
        "sphere": "string",
        "meeting_mode": "analysis|creative|decision|review",
        "participants": ["ids"],
        "tools": ["tool_ids"],
        "preset": "xr_preset_id"
      }
    ]
  }
}
```

### Context Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `entries[].meeting_mode` | **analysis/creative/decision/review** ⚡ |
| `entries[].tools` | **Array of tool_ids** ⚡ |
| `entries[].preset` | **xr_preset_id** ⚡ |

---

## THREAD INTERACTION RULES

| Rule | Status |
|------|--------|
| Threads may LINK to each other | ✅ |
| **Threads NEVER merge automatically** | ⚡ |
| **Cross-thread views are READ-ONLY** | ⚡ |
| User must explicitly create links | ✅ |

---

## VISUALIZATION (XR / 2D)

### Visual Styles ⚡
| Thread Type | Style |
|-------------|-------|
| **FACT THREAD** | linear chain |
| **DECISION THREAD** | **braided timeline** ⚡ |
| **CONTEXT THREAD** | **layered bands** ⚡ |

### Thread Overlays ⚡
| Feature | Description |
|---------|-------------|
| toggle on/off | ✅ |
| **fade comparison** | ⚡ |
| **highlight divergence points** | ⚡ |

---

## AGENTS INVOLVED

| Agent | Role |
|-------|------|
| `AGENT_THREAD_EXTRACTOR` | detects candidate thread entries |
| `AGENT_THREAD_LINKER` | **suggests links (never applies)** ⚡ |
| `AGENT_THREAD_GUARD` | enforces: immutability, provenance, **neutrality** ⚡ |

---

## ETHICAL GUARANTEES

| Guarantee | Status |
|-----------|--------|
| No narrative framing | ✅ |
| No persuasion | ✅ |
| **No hidden hierarchy** | ✅ ⚡ |
| Full traceability | ✅ |

---

## WHY THIS MATTERS

> **Facts stay facts.**  
> **Decisions stay observable.**  
> **Context stays explainable.**

- **No rewriting.**
- **No mythology.**
- **No manipulation.**

---

**END — FOUNDATION FREEZE**
