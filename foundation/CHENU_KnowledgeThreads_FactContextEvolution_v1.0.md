# CHE·NU — KNOWLEDGE THREAD SYSTEM (FACT/CONTEXT/EVOLUTION)
**VERSION:** FOUNDATION v1.0  
**TYPE:** INFORMATION STRUCTURE / TRACEABILITY / NON-INFERENTIAL

---

## GLOBAL DEFINITION

> A Knowledge Thread is a **CONTINUOUS, TRACEABLE LINE** of information linking events, artifacts, decisions and contexts **ACROSS time and spheres.**

### RULE
> **Knowledge Threads CONNECT facts. They DO NOT interpret meaning or intent.**

---

## THREAD TYPE 1 — FACT THREAD (OBJECTIVE)

### Purpose
Link verifiable elements that are factually connected.

### Sources
- meetings, XR replays, decisions logs, artifacts (docs, boards, files)

### Examples
- decision A → document B → meeting C
- artifact reused across spheres

### Fact Thread Rules ⚡
| Rule | Status |
|------|--------|
| append-only | ✅ |
| immutable once validated | ✅ |
| **no summarization** | ✅ ⚡ |
| no sentiment | ✅ |
| **exact source references** | ✅ ⚡ |

### Fact Thread JSON (with sphere_crossing) ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "fact",
    "nodes": [
      { "ref": "meeting_id", "timestamp": 171234 },
      { "ref": "artifact_id", "timestamp": 171300 }
    ],
    "sphere_crossing": true,
    "hash": "sha256"
  }
}
```

### Fact Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `nodes[].ref` | **meeting_id / artifact_id** ⚡ |
| `sphere_crossing` | **Boolean - cross-sphere link** ⚡ |

---

## THREAD TYPE 2 — CONTEXT THREAD (SITUATIONAL)

### Purpose
Preserve **WHY something existed at a given moment** WITHOUT explaining intention or outcome.

### Sources
- meeting context, active spheres, participating roles, system state

### Examples
- same topic discussed under different constraints
- change of environment affecting decisions

### Context Thread Rules ⚡
| Rule | Status |
|------|--------|
| descriptive only | ✅ |
| **no causal claims** | ✅ ⚡ |
| **reversible visibility** | ✅ ⚡ |
| user-controlled exposure | ✅ |

### Context Thread JSON (with system_state + linked_nodes) ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "context",
    "context": {
      "sphere": "business",
      "meeting_mode": "analysis",
      "participants": ["user","agent"],
      "system_state": "normal_load"
    },
    "linked_nodes": ["meeting_id"],
    "hash": "sha256"
  }
}
```

### Context Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `context.meeting_mode` | **"analysis"** ⚡ |
| `context.system_state` | **"normal_load"** ⚡ |
| `linked_nodes` | **Array of meeting_ids** ⚡ |

---

## THREAD TYPE 3 — EVOLUTION THREAD (TEMPORAL) ⚡

### Purpose
Show **HOW a topic, structure, or project evolved** over time — **structurally, not narratively.**

### Sources ⚡
- versioned documents, repeated meetings, successive decisions, architectural changes

### Examples ⚡
- policy evolution
- project redesign
- knowledge refinement

### Evolution Thread Rules ⚡
| Rule | Status |
|------|--------|
| **chronological only** | ✅ ⚡ |
| **no "improvement" labels** | ✅ ⚡ |
| **rollback-safe** | ✅ ⚡ |
| **diff-based visualization** | ✅ ⚡ |

### Evolution Thread JSON (with timeline + origin) ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "evolution",
    "timeline": [
      { "version": 1, "ref": "artifact_v1" },
      { "version": 2, "ref": "artifact_v2" }
    ],
    "origin": "initial_meeting_id",
    "hash": "sha256"
  }
}
```

### Evolution Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `type` | **"evolution"** ⚡ |
| `timeline` | **Array of {version, ref}** ⚡ |
| `timeline[].version` | **Integer version number** ⚡ |
| `origin` | **initial_meeting_id** ⚡ |

---

## THREAD VISUALIZATION (2D / 3D / XR)

### Visual Styles ⚡
| Thread Type | Style | Color |
|-------------|-------|-------|
| **FACT THREAD** | straight solid line | neutral color |
| **CONTEXT THREAD** | dotted line | **sphere-colored** ⚡ |
| **EVOLUTION THREAD** | **braided timeline** ⚡ | **expandable steps** ⚡ |

### Interactions ⚡
| Action | Available |
|--------|-----------|
| follow thread | ✅ |
| collapse / expand | ✅ |
| filter by thread type | ✅ |
| jump to source | ✅ |
| **compare parallel threads** | ✅ ⚡ |

### NO: ⚡
- auto conclusions
- ranking
- **"best path" indicators**

---

## AGENTS INVOLVED

| Agent | Role |
|-------|------|
| `AGENT_THREAD_INDEXER` | detects eligible links, **no creation authority** ⚡ |
| `AGENT_THREAD_VALIDATOR` | checks integrity + duplicates, **no semantic interpretation** ⚡ |
| `AGENT_THREAD_VISUALIZER` | renders threads, **no analysis** ⚡ |

---

## ETHICAL GUARANTEES

| Guarantee | Status |
|-----------|--------|
| No narrative shaping | ✅ |
| No intent inference | ✅ |
| **No psychological mapping** | ✅ ⚡ |
| Full transparency | ✅ |
| User always in control | ✅ |

---

## WHY KNOWLEDGE THREADS MATTER

They allow:
- **memory without distortion**
- **clarity without simplification**
- **learning without manipulation**

> **Shared truth. Personal understanding.**

---

**END — FOUNDATION FREEZE**
