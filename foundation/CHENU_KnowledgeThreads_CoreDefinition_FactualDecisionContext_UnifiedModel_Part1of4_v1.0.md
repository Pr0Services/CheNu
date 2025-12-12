# CHE·NU — KNOWLEDGE THREADS — CORE DEFINITION (Part 1/4)
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / BUILD-READY

---

## KNOWLEDGE THREADS — CORE DEFINITION ⚡

> **A Knowledge Thread is: A continuous line of factual information, artifacts, decisions, and context stretching across time, spheres, agents, and meetings.**

### RULE
> **A Knowledge Thread REVEALS underlying structure. It NEVER interprets, predicts, or persuades.**

### Purpose ⚡
| Purpose | Description |
|---------|-------------|
| connect dispersed information | ⚡ |
| show continuity over time | ⚡ |
| **align replay, memory, and universe view** | ⚡ |
| **support multi-sphere clarity** | ⚡ |

---

## 3 TYPES OF KNOWLEDGE THREADS ⚡

| Type | Description |
|------|-------------|
| **1 — FACTUAL THREADS** | objectively verifiable info |
| **2 — DECISION THREADS** | chronological decisions |
| **3 — CONTEXT THREADS** | topic/goal evolution |

---

## 1) FACTUAL THREADS ⚡

### Definition
> **A chain of objectively verifiable information.**

### Examples ⚡
- research notes, uploaded files, measurements
- logs, timestamps, workflow outputs
- **agent-generated structural data**

### Rules ⚡
| Rule | Status |
|------|--------|
| **no inference** | ✅ ⚡ |
| **no emotional sentiment** | ✅ ⚡ |
| **no exaggeration or compression** | ✅ ⚡ |
| **always traceable to source** | ✅ ⚡ |

### THREAD_FACT Structure ⚡
```
THREAD_FACT:
  id: uuid
  anchors: [artifact_id, replay_event_id, memory_entry_id]
  timeline: [t0, t1, t2, ...]
  content_type: text|file|visual|data
  hash_chain: sha256[]
  sphere: any
```

### Rendering ⚡
> **Thin neutral line. Connects only factual nodes. Available in 2D & 3D view.**

---

## 2) DECISION THREADS ⚡

### Definition
> **A chronological line of decisions, actions, and commitments.**

### Examples ⚡
- project approvals, meeting outcomes
- task resolutions, signed-off changes
- **pivot points**

### Rules ⚡
| Rule | Status |
|------|--------|
| **must be time-stamped** | ✅ ⚡ |
| **must identify participants** | ✅ ⚡ |
| **must include decision text verbatim** | ✅ ⚡ |
| **cannot contain rationale (no subjective insertion)** | ✅ ⚡ |

### THREAD_DECISION Structure ⚡
```
THREAD_DECISION:
  id: uuid
  decisions: [{
    timestamp, text, participants,
    source_replay, artifacts
  }]
  dependencies: [other decision ids]
  integrity: hash
```

### Rendering ⚡
> **Slightly thicker line. Nodes appear at each decision point. Optional overlay of replay snapshot.**

---

## 3) CONTEXT THREADS ⚡

### Definition
> **A chain showing how topics, goals, or environments evolve.**

### Examples ⚡
- evolution of a research topic
- recurring issues across spheres
- long-term procedural context
- **evolution of regulatory constraints**

### Rules ⚡
| Rule | Status |
|------|--------|
| **cannot infer emotional intentions** | ✅ ⚡ |
| **cannot predict outcomes** | ✅ ⚡ |
| **cannot fill blanks with assumptions** | ✅ ⚡ |
| **context must be factual-only** | ✅ ⚡ |

### THREAD_CONTEXT Structure ⚡
```
THREAD_CONTEXT:
  id: uuid
  context_nodes: [
    { sphere, timestamp, reference, metadata }
  ]
  drift_markers: [optional non-evaluative indicators]
  versioning: incrementing
```

### Rendering ⚡
> **Wide soft line. Fades in/out based on time window. Clusters around sphere groups.**

---

## UNIFIED THREAD MODEL (CANONICAL) ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "fact|decision|context",
    "anchors": [],
    "nodes": [],
    "hash_chain": [],
    "timeline_start": "ts",
    "timeline_end": "ts"
  }
}
```

---

## THREAD CREATION RULES ⚡

### Thread CAN START FROM ⚡
| Source | Status |
|--------|--------|
| replay event | ✅ ⚡ |
| artifact upload | ✅ ⚡ |
| meeting summary | ✅ ⚡ |
| **manual user selection** | ✅ ⚡ |

### Thread CAN EXTEND WHEN ⚡
| Condition | Status |
|-----------|--------|
| new data matches anchor-type | ✅ ⚡ |
| user explicitly attaches entry | ✅ ⚡ |
| **system detects factual continuity** | ✅ ⚡ |

### Thread CANNOT EXTEND WHEN ⚡
| Forbidden | Status |
|-----------|--------|
| **continuity is interpretative** | ❌ ⚡ |
| **motivation or emotion is required** | ❌ ⚡ |
| **results would imply "meaning"** | ❌ ⚡ |

---

## THREAD VISIBILITY ⚡

| Scope | Content |
|-------|---------|
| **PUBLIC** | factual continuity, decision chains relevant to teams |
| **PRIVATE** | personal notes, archived personal memories, content marked "internal" |

### USER OVERRIDE ⚡
| Action | Status |
|--------|--------|
| can break (hide) personal branches | ✅ ⚡ |
| can merge threads (requires confirmation) | ✅ ⚡ |
| **can export thread → pdf \| json \| xr-timeline** | ✅ ⚡ |

---

## THREADS IN UNIVERSE VIEW ⚡

| Thread Type | Visual |
|-------------|--------|
| **FACTUAL** | thin lines |
| **DECISIONS** | anchored nodes |
| **CONTEXT** | soft braided lines |

### Interactions ⚡
| Action | Description |
|--------|-------------|
| `highlight_on_hover` | ⚡ |
| `expand_thread` | ⚡ |
| `collapse_thread` | ⚡ |
| **`replay_from_thread`** | ⚡ |
| **`export_thread_bundle`** | ⚡ |

---

## THREADS IN XR ⚡

| Type | XR Visual |
|------|-----------|
| **FACTUAL** | floating neutral wires, **non-intrusive** |
| **DECISION** | **pillars marking decision points**, selectable snapshots |
| **CONTEXT** | environmental soft ribbons, **show history without dominating scene** |

---

## INTEGRITY & SECURITY ⚡

| Rule | Status |
|------|--------|
| **cryptographic hash per node** | ✅ ⚡ |
| **immutable chain** | ✅ ⚡ |
| **version logs** | ✅ ⚡ |
| **2D & 3D consistent views** | ✅ ⚡ |
| **no hidden bias** | ✅ ⚡ |
| **no ranking** | ✅ ⚡ |
| **no advice or influence** | ✅ ⚡ |

---

**END — KNOWLEDGE THREADS (1/4)**
