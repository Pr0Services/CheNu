# CHE·NU — KNOWLEDGE THREADS (2, 3, 4)
**VERSION:** KNOW.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / CROSS-SPHERE

---

## OVERVIEW — KNOWLEDGE THREADS ⚡

> **Knowledge Threads = neutral, chain-of-fact connectors linking artifacts, meetings, spheres, agents, and decisions.**

### NEVER ⚡
| Forbidden | Status |
|-----------|--------|
| **infer motivations** | ❌ ⚡ |
| **generate narratives** | ❌ ⚡ |
| **compress meaning subjectively** | ❌ ⚡ |

### ONLY ⚡
| Allowed | Status |
|---------|--------|
| **reveal structural connections** | ✅ ⚡ |
| **show factual continuity** | ✅ ⚡ |
| **preserve temporal truth** | ✅ ⚡ |

### Covered Here ⚡
| Thread | Type |
|--------|------|
| **Thread 2** | Cross-Sphere Knowledge Threads |
| **Thread 3** | Topic Evolution Threads |
| **Thread 4** | Multi-Agent Contribution Threads |

---

## THREAD TYPE 2 — CROSS-SPHERE KNOWLEDGE THREADS ⚡

### Purpose
> **Trace a concept, artifact, or decision across multiple spheres WITHOUT interpreting or scoring influence.**

### Example
```
Scholar → Business → Creative → Institution → XR Replay
```

### Thread2 Structure ⚡
| Node | Edge |
|------|------|
| sphere | reference |
| artifact_id | reuse |
| meeting_id | continuation |
| timestamp | **validation** |
| participants | |

### Thread2 JSON ⚡
```json
{
  "knowledge_thread_2": {
    "topic": "string",
    "nodes": [
      { "id": "uuid", "sphere": "business", "artifact": "uuid", "ts": 1234 },
      { "id": "uuid", "sphere": "xr", "artifact": "uuid", "ts": 1250 }
    ],
    "edges": [
      { "from": "node1", "to": "node2", "type": "continuation" }
    ]
  }
}
```

### Universe View Rendering ⚡
| Feature | Description |
|---------|-------------|
| **subtle cross-sphere lines** | ⚡ |
| **color-coded by sphere** | ⚡ |
| **hover-to-expand** | ⚡ |
| **no automatic routing** | ✅ ⚡ |

### Rules ⚡
| Rule | Status |
|------|--------|
| **append-only** | ✅ ⚡ |
| **fully traceable** | ✅ ⚡ |
| **no prioritization** | ✅ ⚡ |
| **no interpretation of importance** | ✅ ⚡ |

---

## THREAD TYPE 3 — TOPIC EVOLUTION THREADS ⚡

### Purpose
> **Show HOW a topic evolves over time across meetings, documents, decisions, and XR replays.**

> **Thread = a pure timeline + factual changes.**

### Topic Evolution Events ⚡
| Event | Description |
|-------|-------------|
| creation of topic | ⚡ |
| **new artifact added** | ⚡ |
| **decision referencing topic** | ⚡ |
| meeting where topic is primary/secondary | ⚡ |
| **replay evidence** | ⚡ |

### Thread3 JSON ⚡
```json
{
  "knowledge_thread_3": {
    "topic": "string",
    "timeline": [
      {
        "ts": 1712345678,
        "event": "artifact_added",
        "artifact_id": "uuid",
        "source": "meeting_id"
      },
      {
        "ts": 1712348900,
        "event": "decision_made",
        "decision_id": "uuid"
      }
    ],
    "hash": "sha256"
  }
}
```

### Topic Evolution Rules ⚡
| Rule | Status |
|------|--------|
| **no summarization** | ✅ ⚡ |
| **no prediction** | ✅ ⚡ |
| **no authority** | ✅ ⚡ |
| **no compression changing meaning** | ✅ ⚡ |

### XR Integration ⚡
> **TIMELINE BRAID: Each event appears as a knot. User may expand to see replay frame.**

---

## THREAD TYPE 4 — MULTI-AGENT CONTRIBUTION THREADS ⚡

### Purpose
> **Track which agents contributed, interacted, or stayed silent regarding a topic, artifact, or meeting series.**

> **NOT for evaluation. ONLY for transparency.**

### 5 Agent Contribution Types ⚡
| Type | Description |
|------|-------------|
| `generator` | created artifact ⚡ |
| `editor` | modified artifact ⚡ |
| `observer` | **present w/out action** ⚡ |
| `context-provider` | **supplied data** ⚡ |
| `silence` | **no action logged** ⚡ |

### Thread4 JSON ⚡
```json
{
  "knowledge_thread_4": {
    "topic": "string",
    "agents": [
      {
        "agent_id": "uuid",
        "contributions": [
          { "ts": 1234, "type": "generator", "artifact": "uuid" },
          { "ts": 1240, "type": "observer" }
        ]
      }
    ],
    "hash": "sha256"
  }
}
```

### Visualization Rules ⚡
| Rule | Description |
|------|-------------|
| avatar outlines = contribution density | ⚡ |
| **no color coding implying value** | ✅ ⚡ |
| **silence displayed neutrally (grey)** | ✅ ⚡ |

### Integrity Rules ⚡
| Rule | Status |
|------|--------|
| **immutable logs** | ✅ ⚡ |
| **auditable sequences** | ✅ ⚡ |
| **no inference or weighting** | ✅ ⚡ |

---

## INTEGRATED KNOWLEDGE THREAD FABRIC ⚡ (NOUVEAU!)

### When All 3 Types Run Together ⚡
| Thread | = |
|--------|---|
| **Thread 2** | cross-sphere pathways |
| **Thread 3** | topic evolution timeline |
| **Thread 4** | **contribution transparency** |

> **Combined but NOT merged: Each thread retains its own semantics.**

### Knowledge Fabric JSON ⚡
```json
{
  "knowledge_fabric": {
    "threads_2": ["..."],
    "threads_3": ["..."],
    "threads_4": ["..."],
    "global_hash": "sha256"
  }
}
```

---

**END — FOUNDATION FREEZE**
