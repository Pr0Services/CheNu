# CHE·NU — KNOWLEDGE THREAD SYSTEM
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / TRACEABLE

---

## OVERVIEW

> **Knowledge Threads = verifiable chains of linked facts/artifacts** derived from Collective Memory, Spheres, Replays, and Universe View.

### RULE
> **Thread = EXPLANATION STRUCTURE. NEVER inference. NEVER interpretation. NEVER persuasion.**

### 3 Types ⚡
| Type | Name |
|------|------|
| **1** | LINEAR THREAD (LKT) ⚡ |
| **2** | BRANCHED THREAD (BKT) ⚡ |
| **3** | CONTEXTUAL THREAD (CKT) ⚡ |

---

## 1) LINEAR KNOWLEDGE THREAD (LKT) ⚡

### Purpose
Simple **chronological chain** of facts/events.

### Structure ⚡
```
event_1 → event_2 → event_3 → artifact → decision
```

### Features ⚡
| Feature | Description |
|---------|-------------|
| **unbroken timeline** | ⚡ |
| **high clarity** | ⚡ |
| **ideal for audits, replays, and progress tracking** | ⚡ |

### Linear Thread JSON ⚡

```json
{
  "linear_thread": {
    "id": "uuid",
    "sequence": [
      { "ref": "memory_id", "timestamp": "...", "sphere": "..." }
    ],
    "integrity_hash": "sha256"
  }
}
```

### Visualization ⚡
| Mode | Display |
|------|---------|
| **2D** | `[●]—[●]—[●]—[◆]` ⚡ |
| **XR** | **floating nodes in straight path, user teleports along timeline** ⚡ |

---

## 2) BRANCHED KNOWLEDGE THREAD (BKT) ⚡

### Purpose
Show **divergence points, alternatives, and optional paths**, WITHOUT evaluating which is "better".

### Structure ⚡
```
root_event  
 ├─ branch_A  
 │    ├─ step  
 │    └─ step  
 └─ branch_B  
      ├─ step  
      └─ step
```

### RULE
> **Branches represent CHOICES, not judgments.**

### Branched Thread JSON ⚡

```json
{
  "branched_thread": {
    "id": "uuid",
    "root": "memory_id",
    "branches": [
      {
        "label": "path_A",
        "steps": ["memory_id", "memory_id", "..."]
      }
    ],
    "integrity_hash": "sha256"
  }
}
```

### Visualization ⚡
| Mode | Display |
|------|---------|
| **2D (Mermaid)** | `root → A1 → A2` and `↘ B1 → B2` ⚡ |
| **XR** | **3D branching pathways, user picks which branch to inspect** ⚡ |

---

## 3) CONTEXTUAL KNOWLEDGE THREAD (CKT) ⚡

### Purpose
Link facts **across SPHERES**, showing cross-domain influence WITHOUT suggesting causality.

### Structure ⚡
```
artifact_in_business  
  ↔ related_scholar_research  
  ↔ related_social_feedback  
  ↔ related_xr_replay_segment
```

### Contextual Thread JSON ⚡

```json
{
  "contextual_thread": {
    "id": "uuid",
    "nodes": [
      { "memory": "id", "sphere": "business" },
      { "memory": "id", "sphere": "scholar" }
    ],
    "links": [
      { "from": "id", "to": "id", "reason": "shared_topic" }
    ]
  }
}
```

### Visualization ⚡
| Mode | Display |
|------|---------|
| **2D** | Cluster graph with labeled edges ⚡ |
| **XR** | **Orbital nodes around user, each sphere a different orbit ring** ⚡ |

---

## THREAD BUILDER — CORE SYSTEM ⚡

### Purpose
Allow users, agents, or workflows to **CONSTRUCT threads** safely, transparently, without modifying the underlying memory.

### RULE
> **Builder = ASSEMBLER. Memory = SOURCE OF TRUTH. No modification to memory allowed.**

### Builder Inputs ⚡
| Input | Description |
|-------|-------------|
| `memory_ids[]` | ⚡ |
| `replay_segments[]` | ⚡ |
| `sphere filters` | ⚡ |
| `time ranges` | ⚡ |
| `artifact references` | ⚡ |
| `user notes (optional)` | ⚡ |

### Builder Output ⚡

```json
{
  "thread": "LKT|BKT|CKT",
  "metadata": {
    "created_by": "user|agent_id",
    "timestamp": "...",
    "description": "...",
    "visibility": "private|shared"
  }
}
```

### Builder Actions ⚡
| Action | Description |
|--------|-------------|
| `add_node(memory_id)` | ⚡ |
| `link_nodes(A,B,reason)` | ⚡ |
| `create_branch(label)` | ⚡ |
| `attach_artifact(id)` | ⚡ |
| `embed_replay_segment(id)` | ⚡ |
| `export_to_pdf` | ⚡ |
| `export_to_xr_bundle` | ⚡ |
| `publish_to_universe_view (optional)` | ⚡ |

### Thread Safety Rules ⚡
| Rule | Status |
|------|--------|
| **No inferred causality** | ✅ ⚡ |
| **No emotional metadata** | ✅ ⚡ |
| **No ranking or judgment** | ✅ ⚡ |
| **Mandatory source visibility** | ✅ ⚡ |
| **Hash verification required** | ✅ ⚡ |

---

## THREAD VISUALIZATION ENGINE ⚡

### 2D Render Modes ⚡
| Mode | Description |
|------|-------------|
| linear timeline | ⚡ |
| branched tree | ⚡ |
| multi-sphere cluster graph | ⚡ |
| **layered comparison view (for replay integration)** | ⚡ |

### XR Render Modes ⚡
| Mode | Description |
|------|-------------|
| floating timeline corridor | ⚡ |
| branching spatial paths | ⚡ |
| multi-orbit contextual rings | ⚡ |
| **replay inline windows** | ⚡ |

---

## AGENTS INVOLVED ⚡

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | **constructs thread from user selection, ensures rule compliance** ⚡ |
| `AGENT_THREAD_VALIDATOR` | **checks integrity, hashes, timeline consistency** ⚡ |
| `AGENT_THREAD_RENDERER` | **handles 2D + XR visualization (non-interpretive)** ⚡ |
| `AGENT_THREAD_ARCHIVER` | **stores versioned, immutable thread bundles** ⚡ |

---

## THREAD BUNDLE EXPORT ⚡

### `thread_bundle.xrpack` Contents ⚡
| Content | Description |
|---------|-------------|
| thread JSON | ⚡ |
| visualization hints | ⚡ |
| replay segments (optional) | ⚡ |
| integrity hash | ⚡ |
| **origin logs** | ⚡ |

---

**END — FOUNDATION FREEZE**
