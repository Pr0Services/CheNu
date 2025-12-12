# CHE·NU — KNOWLEDGE THREAD SYSTEM (TRACKED OBJECT)
**VERSION:** CORE.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / FREEZE-READY

---

## GLOBAL PRINCIPLE

> **Knowledge Threads connect INFORMATION,**  
> **NOT people, NOT opinions, NOT intentions.**

### RULE
> **Thread = TRACEABLE CONTINUITY OF FACTS**  
> No inference. No optimization. No narrative shaping.

---

## THREAD TYPE 1 — FACTUAL THREAD

### Purpose
Link concrete facts across time, meetings, and spheres.

### Used For
- Decisions, Documents, References, Explicit statements, Verifiable outputs

### Sources
- XR replay events, Decision logs, Approved documents, Agent actions (trace only), Explicit user inputs

### Rules
| Rule | Status |
|------|--------|
| append-only | ✅ |
| source-referenced | ✅ |
| timestamped | ✅ |
| hash-validated | ✅ |
| immutable once validated | ✅ |

### NO
- interpretation
- weighting
- confidence score inflation

### JSON Model (with status)

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "factual",
    "nodes": [
      {
        "source": "meeting|document|decision",
        "source_id": "uuid",
        "timestamp": 1712345678,
        "hash": "sha256"
      }
    ],
    "visibility": "private|shared|public",
    "status": "validated"
  }
}
```

---

## THREAD TYPE 2 — CONTEXT THREAD (with context_type) ⚡

### Purpose
Preserve CONTEXT around facts **WITHOUT altering the facts themselves.**

### Used For
- Understanding circumstances
- Reviewing environment
- Reconstructing perspective
- Explaining WHY without redefining WHAT

### Sources
- Meeting metadata, Sphere context, Participants list, Artifacts present, Silence intervals, Environmental state

### Rules
| Rule | Status |
|------|--------|
| contextual, not authoritative | ✅ |
| detachable from facts | ✅ |
| optional display | ✅ |
| **never merged into factual thread** | ✅ ⚡ |

### JSON Model (with context_type) ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "context",
    "linked_factual_thread": "uuid",
    "context_nodes": [
      {
        "context_type": "sphere|meeting|environment",
        "value": "string",
        "timestamp": 1712345678
      }
    ],
    "visibility": "private|shared"
  }
}
```

### Context Types ⚡
| Type | Description |
|------|-------------|
| `sphere` | Sphere context |
| `meeting` | Meeting context |
| `environment` | Environment state |

---

## THREAD TYPE 3 — EVOLUTION THREAD (with tracked_object + version) ⚡

### Purpose
Track CHANGE OVER TIME of structures, decisions, and configurations.

### Used For
- Comparing versions
- Detecting drift
- Reviewing progression
- Learning without rewriting history

### Sources
- Decision revisions, Plan updates, Avatar evolution states, Configuration changes, Rule version changes

### Rules
| Rule | Status |
|------|--------|
| version-based | ✅ |
| reversible | ✅ |
| diff-only | ✅ |
| **never overwrites past states** | ✅ ⚡ |

### JSON Model (with tracked_object + version numbers) ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "evolution",
    "tracked_object": "decision|plan|avatar|config",
    "versions": [
      {
        "version": 1,
        "timestamp": 1712345678,
        "hash": "sha256"
      },
      {
        "version": 2,
        "timestamp": 1712350000,
        "hash": "sha256"
      }
    ]
  }
}
```

### Tracked Objects ⚡
| Type | Description |
|------|-------------|
| `decision` | Decision evolution |
| `plan` | Plan updates |
| `avatar` | Avatar state changes |
| `config` | Configuration changes |

---

## THREAD GRAPH STRUCTURE

### Nodes
| Type | Description |
|------|-------------|
| facts | Factual nodes |
| contexts | Context nodes |
| versions | Version nodes |
| artifacts | Artifact nodes |

### Edges
| Edge | Description |
|------|-------------|
| `references` | Cites another |
| `contextualizes` | Provides context |
| `evolves_from` | Evolution link |

### STRICT RULE ⚡
> **Fact nodes NEVER depend on context nodes.**

---

## UNIVERSE VIEW INTEGRATION ⚡

### Thread Rendering
| Type | Style |
|------|-------|
| **factual** | lines |
| **context** | **halos** ⚡ |
| **evolution** | **stacked layers** ⚡ |

### Features
| Feature | Value |
|---------|-------|
| Toggle | per thread type |
| Default | read-only |
| Cross-sphere | visualization allowed |

---

## AGENTS INVOLVED

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | Constructs threads, **no interpretation** |
| `AGENT_THREAD_VALIDATOR` | Integrity & source checks |
| `AGENT_THREAD_NAVIGATOR` | **Visual positioning only** ⚡ |
| `AGENT_THREAD_GUARD` | Prevents merging incompatible types, **contextual pollution of facts** |

### AGENT_THREAD_NAVIGATOR ⚡ NEW
> **"Visual positioning only"**
- Handles thread navigation
- No interpretation
- UI/visualization logic only

---

## ETHICAL GUARANTEES

| Guarantee | Status |
|-----------|--------|
| No inferred intent | ✅ |
| No hidden ranking | ✅ |
| No persuasion | ✅ |
| **One truth, many views** | ✅ ⚡ |

---

## WHY THIS MATTERS

| Thread | Provides |
|--------|----------|
| **Factual Thread** | Truth |
| **Context Thread** | Understanding |
| **Evolution Thread** | Wisdom over time |

> **WITHOUT manipulation.**

---

**END — FOUNDATION FREEZE**
