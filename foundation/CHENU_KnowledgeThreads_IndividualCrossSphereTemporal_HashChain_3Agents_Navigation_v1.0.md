# CHE·NU — KNOWLEDGE THREADS SYSTEM
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / TRACEABLE

---

## PURPOSE ⚡

> **Create factual, structured pathways across memories, artifacts, decisions, and meetings WITHOUT interpretation or persuasion.**

> **Knowledge Threads = connective tissue of Che-Nu.**

### RULES ⚡
| Rule | Status |
|------|--------|
| **Threads DO NOT create meaning** | ✅ ⚡ |
| **Threads DO NOT infer causality** | ✅ ⚡ |
| **Threads ONLY link verifiable elements** | ✅ ⚡ |

---

## 1) INDIVIDUAL KNOWLEDGE THREADS ⚡

### Purpose
> **Help an individual user visualize how their OWN ideas, documents, tasks, and decisions evolved over time.**

### Sources ⚡
| Source | Description |
|--------|-------------|
| personal notes | ⚡ |
| personal tasks | ⚡ |
| personal meetings | ⚡ |
| **XR replays (private)** | ⚡ |
| artifacts created by user | ⚡ |

### Thread Structure ⚡
```
[Note] → [Task] → [Meeting Excerpt] → [Decision] → [Outcome]
```

### Properties ⚡
| Property | Status |
|----------|--------|
| **private by default** | ✅ ⚡ |
| **user-owned** | ✅ ⚡ |
| **non-synchronizable unless shared** | ✅ ⚡ |
| **immutable once validated** | ✅ ⚡ |

### Individual Thread JSON ⚡
```json
{
  "individual_thread": {
    "id": "uuid",
    "owner": "user_id",
    "nodes": [
      { "type": "note|task|replay|decision", "ref": "item_id" }
    ],
    "timestamp": "ISO",
    "visibility": "private|shared"
  }
}
```

### Interactions ⚡
| Action | Description |
|--------|-------------|
| expand | ⚡ |
| fold | ⚡ |
| **jump_to_source** | ⚡ |
| **export_pdf** | ⚡ |
| **integrate_into_personal_memory** | ⚡ |

### Ethics ⚡
> **No evaluation. No suggestion. Pure factual stitching.**

---

## 2) CROSS-SPHERE KNOWLEDGE THREADS ⚡

### Purpose
> **Link items across SPHERES** (Business ↔ Scholar ↔ XR ↔ Institution)

### Example ⚡
```
Business Template → Scholar Research → Creative Mockup → XR Meeting → Institution Compliance
```

### Thread Creation Rules ⚡
| Rule | Status |
|------|--------|
| **only via explicit user action OR agent classifier** | ✅ ⚡ |
| **never auto-created from inference** | ✅ ⚡ |
| **must include source metadata per node** | ✅ ⚡ |

### Cross-Sphere Thread JSON ⚡
```json
{
  "cross_sphere_thread": {
    "id": "uuid",
    "spheres": ["business", "scholar", "creative"],
    "nodes": [
      { "sphere": "business", "type": "artifact", "ref": "uuid" },
      { "sphere": "scholar", "type": "research", "ref": "uuid" }
    ],
    "validated": true
  }
}
```

### Visual Rendering ⚡
| Property | Description |
|----------|-------------|
| **multi-color chain** | ⚡ |
| **labels by sphere** | ⚡ |
| **branching allowed but no loops** | ✅ ⚡ |

### Uses ⚡
- explainable context
- traceability
- **accountability**

### Prohibited ⚡
| Forbidden | Status |
|-----------|--------|
| **behavioural inference** | ❌ ⚡ |
| **persuasion mapping** | ❌ ⚡ |
| **hidden prioritization** | ❌ ⚡ |

---

## 3) TEMPORAL KNOWLEDGE THREADS ⚡

### Purpose
> **Show chronological evolution of a concept, project, or problem across time.**

### Uses ⚡
- historical audit
- **replay evolution**
- track changes in knowledge base

### Time Units ⚡
| Unit | Description |
|------|-------------|
| meetings | ⚡ |
| replays | ⚡ |
| **versions of artifacts** | ⚡ |
| decisions | ⚡ |
| task updates | ⚡ |

### Thread Structure ⚡
```
[Version 1] → [Version 2] → [Meeting] → [Decision] → [Version 3]
```

### Temporal Thread JSON ⚡
```json
{
  "temporal_thread": {
    "id": "uuid",
    "topic": "string",
    "timeline": [
      { "t": 1700000000, "ref": "artifact_v1" },
      { "t": 1700005000, "ref": "meeting_3" },
      { "t": 1700010000, "ref": "decision_x" }
    ],
    "hash_chain": ["sha256_v1", "sha256_v2", "sha256_v3"]
  }
}
```

### Key Field: `hash_chain` ⚡ (NOUVEAU!)
> **Temporal threads must form a hash chain → ensures factual continuity.**

### XR Mode ⚡
> **Allows stepping through each state in immersive replay.**

---

## KNOWLEDGE THREAD NAVIGATION ⚡

### 5 View Modes ⚡
| Mode | Description |
|------|-------------|
| `chain_view` | ⚡ |
| `timeline_view` | ⚡ |
| `lattice_view` | ⚡ |
| `sphere_rainbow_view` | ⚡ |
| `XR anchor view` | ⚡ |

### Search ⚡
| Filter | Description |
|--------|-------------|
| by tag | ⚡ |
| by sphere | ⚡ |
| **by participant** | ⚡ |
| by date range | ⚡ |
| by artifact type | ⚡ |

### Actions ⚡
| Action | Description |
|--------|-------------|
| open node | ⚡ |
| **jump to replay** | ⚡ |
| **trace origin** | ⚡ |
| **export thread bundle** | ⚡ |

---

## SAFETY RULES ⚡

| Rule | Status |
|------|--------|
| **No sentiment** | ✅ ⚡ |
| **No inferred missing links** | ✅ ⚡ |
| **No relevance scoring** | ✅ ⚡ |
| **No auto-prioritization** | ✅ ⚡ |
| **User must confirm creation of cross-sphere threads** | ✅ ⚡ |

---

## 3 AGENT ROLES ⚡

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | stitches factual nodes, **ensures metadata completeness** ⚡ |
| `AGENT_THREAD_GUARD` | ensures no inference, **checks ethics constraints** ⚡ |
| `AGENT_THREAD_EXPLAINER` | displays plain-language rationale, **no interpretation** ⚡ |

---

## UNIVERSE VIEW INTEGRATION ⚡

### Thread Display ⚡
| Type | Visual |
|------|--------|
| individual | **thin lines** ⚡ |
| cross-sphere | **multi-color braids** ⚡ |
| temporal | **temporal arcs** ⚡ |

### Toggles ⚡
| Toggle | Description |
|--------|-------------|
| `show threads` | ⚡ |
| `highlight this thread` | ⚡ |
| `XR-follow thread` | ⚡ |

---

**END — FOUNDATION FREEZE READY**
