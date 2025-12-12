# CHE·NU — KNOWLEDGE THREADS (3-LAYER SYSTEM)
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-INTERPRETATIVE / BUILD-READY

---

## PURPOSE

> Connect information across meetings, spheres, agents and users **WITHOUT inferring meaning, emotion, or intent.**

### RULE
> **Knowledge Thread = NEUTRAL LINKAGE. NOT a suggestion. NOT a recommendation. NOT a narrative.**

---

## LAYER 1 — INTRA-SPHERE KNOWLEDGE THREADS

### Scope
**One sphere only** (Business, Scholar, Creative, etc.)

### Thread Connects ⚡
- meetings within same sphere
- documents/artifacts within sphere
- decisions within same domain
- **XR replays linked to same objective** ⚡

### Rules ⚡
| Rule | Status |
|------|--------|
| **sphere-local only** | ✅ ⚡ |
| chronological order respected | ✅ |
| no interpretation of importance | ✅ |

### Layer 1 JSON (with visibility) ⚡

```json
{
  "knowledge_thread_intrasphere": {
    "sphere": "business|scholar|creative|...",
    "nodes": ["meeting_id","artifact_id","decision_id"],
    "links": [
      { "from":"id", "to":"id", "reason":"shared_topic" }
    ],
    "visibility": "local",
    "hash": "sha256"
  }
}
```

### Layer 1 Fields ⚡
| Field | Description |
|-------|-------------|
| `visibility` | **"local"** ⚡ |

### Use Cases ⚡
- see evolution of a project
- understand sequence of internal work
- browse chronological knowledge

### Disabled ⚡
- auto-jumping between threads
- prioritization or guidance

---

## LAYER 2 — INTER-SPHERE KNOWLEDGE THREADS

### Scope
Connect information across spheres **WITHOUT bias.**

### Thread Connects ⚡
- Business ↔ Scholar
- Creative ↔ Social
- **XR ↔ any sphere** ⚡
- **Institutions ↔ Methodology** ⚡

### Rules ⚡
| Rule | Status |
|------|--------|
| **cross-sphere connections ONLY when explicit shared artifact/topic/participant** | ✅ ⚡ |
| **no extrapolated links** | ✅ ⚡ |
| no semantic analysis | ✅ |
| no "importance" weighting | ✅ |

### Layer 2 JSON (with cluster) ⚡

```json
{
  "knowledge_thread_intersphere": {
    "spheres": ["business","scholar"],
    "nodes": ["meeting_id","replay_id","artifact_id"],
    "links": [
      { "from":"id1", "to":"id2", "reason":"shared_artifact" }
    ],
    "cluster": "auto",
    "hash": "sha256"
  }
}
```

### Layer 2 Fields ⚡
| Field | Description |
|-------|-------------|
| `cluster` | **"auto"** ⚡ |

### Visualization (Universe View) ⚡
| Property | Value |
|----------|-------|
| **soft colored threads** | ⚡ |
| clickable | ✅ |
| **optional fade-in** | ⚡ |

### Safeguards ⚡
| Safeguard | Status |
|-----------|--------|
| **never merges spheres** | ✅ ⚡ |
| **never hides isolated data** | ✅ ⚡ |
| **requires explicit user activation** | ✅ ⚡ |

---

## LAYER 3 — CROSS-USER / COLLECTIVE KNOWLEDGE THREADS

### Purpose
Enable *shared knowledge* **without exposing privacy or identity.**

### Thread Composition ⚡
| Element | Description |
|---------|-------------|
| **anonymized nodes** | ⚡ |
| **universal artifacts** | ⚡ |
| **cross-team decisions** | ⚡ |
| **timeline braids** | (meeting → outcome) ⚡ |
| **collective memory anchors** | ⚡ |

### Rules ⚡
| Rule | Status |
|------|--------|
| **full anonymization** | ✅ ⚡ |
| **no user comparison** | ✅ ⚡ |
| **no identity clustering** | ✅ ⚡ |
| **user consent required** | ✅ ⚡ |

### Layer 3 JSON (with anonymity + exportable) ⚡

```json
{
  "knowledge_thread_collective": {
    "scope": "multi-user",
    "anonymity": true,
    "nodes": ["artifact_id","decision_summary","timeline_anchor"],
    "links": [
      { "from":"idA", "to":"idB", "reason":"shared_outcome_type" }
    ],
    "exportable": true,
    "hash": "sha256"
  }
}
```

### Layer 3 Fields ⚡
| Field | Description |
|-------|-------------|
| `scope` | **"multi-user"** ⚡ |
| `anonymity` | **true** ⚡ |
| `nodes[].decision_summary` | **Summary reference** ⚡ |
| `nodes[].timeline_anchor` | **Temporal anchor** ⚡ |
| `exportable` | **true** ⚡ |

### Use Cases ⚡
- cross-team learning
- **recurring patterns detection (non-AI, non-interpretive)** ⚡
- thematic indexes
- **sphere-agnostic archives** ⚡

### Disabled ⚡
- no scoring
- no ranking
- no trend interpretation
- **no behavior analysis**

---

## THREAD INTERACTION MODES ⚡

| Mode | Description |
|------|-------------|
| **MODE 1 — FOLLOW THREAD** | Focus view on one thread only ⚡ |
| **MODE 2 — THREAD EXPANSION** | Reveal next-level linked nodes ⚡ |
| **MODE 3 — THREAD FREEZE** | Snapshot thread state for export (PDF / XR bundle) ⚡ |
| **MODE 4 — THREAD OVERLAY** | Overlay thread on XR meeting or Universe View ⚡ |

---

## THREAD EXPORT ⚡

### Export Types ⚡
| Type | Description |
|------|-------------|
| `json` | raw |
| `pdf` | visual map |
| `xr_bundle` | 3D thread overlay |
| `memory_anchor` | **hash-locked** ⚡ |

### Export JSON ⚡

```json
{
  "thread_export": {
    "format": "pdf|json|xr_bundle",
    "thread_id": "uuid",
    "hash": "sha256",
    "timestamp": "...",
    "read_only": true
  }
}
```

### Export Fields ⚡
| Field | Description |
|-------|-------------|
| `format` | **pdf/json/xr_bundle** ⚡ |
| `read_only` | **true** ⚡ |

---

## AGENTS INVOLVED

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | creates thread structures, **append-only** ⚡ |
| `AGENT_THREAD_GUARD` | ensures no bias, no inference |
| `AGENT_THREAD_RENDERER` | draws visual threads in **2D/3D/XR** ⚡ |

### NONE OF THEM: ⚡
- interpret meaning
- suggest decisions
- rewrite history

---

## WHY ALL 3 LAYERS MATTER

| Layer | Provides |
|-------|----------|
| **Layer 1** | local clarity |
| **Layer 2** | cross-domain understanding |
| **Layer 3** | **shared learning without exposure** ⚡ |

### Together: ⚡
- **structure, truth, transparency, no manipulation**

---

**END — KNOWLEDGE THREADS FOUNDATION**
