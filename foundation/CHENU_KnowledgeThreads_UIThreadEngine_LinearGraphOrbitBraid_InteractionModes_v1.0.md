# CHE·NU — KNOWLEDGE THREADS + UI THREAD ENGINE + CROSS-SPHERE THREADS
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / FREEZE-READY

---

## 1) KNOWLEDGE THREADS — CORE SYSTEM ⚡

### Purpose
Represent flows of information, insights, decisions, artifacts, and references as **NEUTRAL, TRACEABLE, NON-INTERPRETATIVE threads.**

### RULE
> **Thread = factual chain of references. NOT a story. NOT a conclusion. NOT a suggestion.**

### Thread Types ⚡
| Type | Description |
|------|-------------|
| `THREAD_EVENT` | **key moments across meetings or actions** ⚡ |
| `THREAD_ARTIFACT` | documents, notes, diagrams linked across contexts ⚡ |
| `THREAD_DECISION` | sequences of decisions, with timestamps & actors ⚡ |
| `THREAD_CONCEPT` | recurring topic across spheres ⚡ |
| `THREAD_PROCESS` | **steps of workflows observed over time** ⚡ |

### Thread Properties ⚡
| Property | Status |
|----------|--------|
| **immutable** | ✅ ⚡ |
| **append-only** | ✅ ⚡ |
| **versioned** | ✅ ⚡ |
| **hashed** | ✅ ⚡ |
| **multi-source (meetings, replays, artifacts)** | ✅ ⚡ |
| **cross-sphere compatible** | ✅ ⚡ |

### Thread Node JSON ⚡

```json
{
  "thread_node": {
    "id": "uuid",
    "type": "event|artifact|decision|concept|process",
    "source": "replay|meeting|file|agent_log",
    "timestamp": 1712345678,
    "sphere": "business|scholar|creative|institution|social|xr|methodology|...",
    "metadata": {
      "title": "string",
      "summary": "string",
      "tags": ["string"]
    },
    "hash": "sha256"
  }
}
```

### Thread Node Fields ⚡
| Field | Description |
|-------|-------------|
| `source` | **replay/meeting/file/agent_log** ⚡ |
| `metadata.summary` | **brief description** ⚡ |
| `metadata.tags` | **Array of tag strings** ⚡ |

### Knowledge Thread JSON ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "nodes": ["thread_node_id", "..."],
    "links": [
      { "from": "id", "to": "id", "type": "sequence|reference|similarity" }
    ],
    "origin": "meeting|concept|user",
    "visibility": "private|team|global",
    "integrity": "verified"
  }
}
```

### Link Types ⚡
| Type | Description |
|------|-------------|
| `sequence` | temporal ordering ⚡ |
| `reference` | citation/reference ⚡ |
| `similarity` | structural similarity ⚡ |

### Thread Rules ⚡
| Rule | Status |
|------|--------|
| **No inference** | ✅ ⚡ |
| **No prediction** | ✅ ⚡ |
| **No emotional interpretation** | ✅ ⚡ |
| **No "best path" logic** | ✅ ⚡ |
| **User-controlled visibility** | ✅ ⚡ |

---

## 2) UI THREAD ENGINE — VISUALIZATION LAYER ⚡

### Purpose
Render Knowledge Threads in a **calm, structured, non-persuasion interface.**

### RULE
> **UI shows STRUCTURE, not meaning.**

### UI Modes ⚡ (NOUVEAU!)
| Mode | Description |
|------|-------------|
| `LINEAR VIEW` | vertical timeline, **event sequencing** ⚡ |
| `GRAPH VIEW` | nodes + edges, **cluster by sphere or topic** ⚡ |
| `ORBIT VIEW (3D)` | thread placed on sphere orbit rings, **spacing for clarity** ⚡ |
| `THREAD BRAID` | multiple threads side-by-side, **alignment by timestamp or topic** ⚡ |

### User Interactions ⚡
| Function | Description |
|----------|-------------|
| `expand_node` | ⚡ |
| `collapse_node` | ⚡ |
| `highlight_related` | ⚡ |
| `filter_by_sphere` | ⚡ |
| `filter_by_agent` | ⚡ |
| `filter_by_time` | ⚡ |
| `isolate_subthread` | ⚡ |
| `export_pdf` | ⚡ |
| `export_thread_bundle` | ⚡ |

### NO ⚡
| Forbidden | Status |
|-----------|--------|
| **auto-highlight "important" nodes** | ❌ ⚡ |
| **animation suggesting priority** | ❌ ⚡ |
| **ranking or scoring display** | ❌ ⚡ |
| **attention-grabbing effects** | ❌ ⚡ |
| **persuasive color coding** | ❌ ⚡ |

---

## 3) CROSS-SPHERE THREADS ⚡

### Purpose
Connect knowledge elements **across different spheres** while maintaining neutrality.

### Cross-Sphere Link Types ⚡
| Type | Description |
|------|-------------|
| `shared_artifact` | same document in multiple spheres ⚡ |
| `shared_decision` | decision affecting multiple spheres ⚡ |
| `shared_topic` | recurring concept across spheres ⚡ |
| `agent_bridge` | **agent participating in multiple spheres** ⚡ |
| `temporal_parallel` | events at same time in different spheres ⚡ |

### Cross-Sphere Rules ⚡
| Rule | Status |
|------|--------|
| **sphere autonomy preserved** | ✅ ⚡ |
| **no cross-sphere dominance** | ✅ ⚡ |
| **no automatic merging** | ✅ ⚡ |
| **user confirms all bridges** | ✅ ⚡ |

### Cross-Sphere Visualization ⚡
| Feature | Description |
|---------|-------------|
| **thin connecting lines** | ⚡ |
| **color-coded by sphere pair** | ⚡ |
| **hover reveals connection reason** | ⚡ |
| **no thickness-based importance** | ⚡ |

---

## AGENT ROLES ⚡

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | **constructs threads from facts only** ⚡ |
| `AGENT_THREAD_VALIDATOR` | **verifies integrity, hashes, timestamps** ⚡ |
| `AGENT_THREAD_EXPLAINER` | **generates human-readable explanations** ⚡ |
| `AGENT_UI_RENDERER` | **renders visualization, no persuasion** ⚡ |

---

## SECURITY & ETHICS SUMMARY ⚡

| Rule | Status |
|------|--------|
| **No narratives** | ✅ ⚡ |
| **No suggestions** | ✅ ⚡ |
| **No psychological shaping** | ✅ ⚡ |
| **No emotional color coding** | ✅ ⚡ |
| **User fully controls visibility** | ✅ ⚡ |
| **All threads are explainable** | ✅ ⚡ |
| **Immutable audit trail** | ✅ ⚡ |

---

**END — FREEZE READY**
