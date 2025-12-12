# CHE·NU — KNOWLEDGE THREADS (FULL SYSTEM)
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / FREEZE-READY

---

## 1) KNOWLEDGE THREAD — CORE DEFINITION ⚡

### Purpose
Represent a chain of **verifiable knowledge steps** across meetings, documents, decisions, artifacts, spheres, and agents.

### RULE
> **A Knowledge Thread is NOT interpretation. It is NOT narrative.**

It is the pure sequence of: facts, context, references, transformations.

### NEVER ⚡
| Forbidden | Status |
|-----------|--------|
| **infer intent** | ❌ ⚡ |
| **infer causality** | ❌ ⚡ |
| **rank importance** | ❌ ⚡ |
| **summarize with bias** | ❌ ⚡ |

### Thread Structure ⚡

```
THREAD_ROOT
 ↓
EVENT_NODE(s)
 ↓
ARTIFACT_NODE(s)
 ↓
DECISION_NODE(s)
 ↓
CONTEXT_NODE(s)
 ↓
REPLAY_REFERENCE(optional)
 ↓
THREAD_CLOSE
```

> **Every node = immutable, hashed, append-only.**

### Thread JSON (Full Model) ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "title": "string",
    "nodes": [
      {
        "id": "uuid",
        "type": "event|artifact|decision|context",
        "timestamp": 1712345678,
        "sphere": "business|scholar|creative|...",
        "source": "replay_id|meeting_id",
        "payload": {},
        "hash": "sha256"
      }
    ],
    "created_by": "user|agent",
    "visibility": "private|team|public",
    "integrity_hash": "sha256_chain"
  }
}
```

---

## 2) CROSS-SPHERE KNOWLEDGE THREADS ⚡

### Purpose
Connect knowledge steps **ACROSS different spheres** WITHOUT blending meaning or causing cross-sphere influence.

### RULE
> **Cross-sphere = CROSS-REFERENCE ONLY. NEVER changes content of original sphere.**

### Cross-Sphere Link Types ⚡
| Type | Description |
|------|-------------|
| `shared_topic` | ⚡ |
| `shared_artifact` | ⚡ |
| `dependency` | ⚡ |
| `chronological_relation` | ⚡ |
| `agent_participation` | ⚡ |
| `conceptual_similarity` | **strict lexical match** ⚡ |

> **NO semantic inference allowed.**

### Cross-Sphere Node JSON ⚡

```json
{
  "type": "cross_sphere_link",
  "from_sphere": "business",
  "to_sphere": "creative",
  "reason": "shared_artifact:doc_42"
}
```

---

## 3) TEMPORAL KNOWLEDGE THREADS ⚡

### Purpose
Trace how a piece of knowledge **evolves THROUGH TIME** without rewriting history.

### RULE
> **Time thread = sequence of snapshots. NEVER retroactively edits nodes.**

### Temporal Node Types ⚡
| Type | Description |
|------|-------------|
| `T0` | **origin** ⚡ |
| `T1` | modification ⚡ |
| `T2` | referenced ⚡ |
| `T3` | used in meeting ⚡ |
| `T4` | **archived** ⚡ |

### Temporal Thread JSON ⚡

```json
{
  "temporal_thread": {
    "origin": "node_id",
    "evolution": [
      { "t": "timestamp", "ref": "node_id", "action": "used|modified|viewed" }
    ]
  }
}
```

---

## 4) COLLECTIVE vs PERSONAL KNOWLEDGE THREADS ⚡

### Purpose
Separate **collective truth** from **personal perspective** WITHOUT mixing or bias.

### Personal Thread ⚡
| Content | Description |
|---------|-------------|
| local tags | ⚡ |
| personal bookmarks | ⚡ |
| private references | ⚡ |
| **optional interpretations (not exported)** | ⚡ |

### Collective Thread ⚡
| Content | Description |
|---------|-------------|
| **fact-only nodes** | ⚡ |
| must reference verifiable sources | ⚡ |
| must pass integrity hashing | ⚡ |
| **cannot contain private content** | ⚡ |

### Thread Visibility Modes ⚡
| Mode | Description |
|------|-------------|
| `collective_only` | ⚡ |
| `personal_only` | ⚡ |
| `merged_view` | **with strict isolation of personal nodes** ⚡ |

---

## 5) XR THREAD VISUALIZATION ⚡

### Purpose
Show threads spatially **inside XR environments.**

### RULE
> **Visualization = STRUCTURAL, not emotional.**

### XR Representation ⚡
| Element | Description |
|---------|-------------|
| **nodes** | floating glyphs ⚡ |
| **edges** | thin beams of light ⚡ |
| **cross-sphere nodes** | color-coded rings ⚡ |
| **temporal progression** | orbit lines ⚡ |
| **replay anchor** | **portal glyph** ⚡ |

### XR Interactions ⚡
| Function | Description |
|----------|-------------|
| `select_node()` | ⚡ |
| `expand_neighbors()` | ⚡ |
| `timeline_scrub()` | ⚡ |
| `open_replay()` | ⚡ |
| `project_to_wall()` | ⚡ |
| `export_pdf_thread()` | ⚡ |

---

## 6) THREAD INTEGRITY & CRYPTOGRAPHIC CHAIN ⚡ (NOUVEAU!)

### Purpose
**Prevent manipulation, guarantee verifiability.**

### Hash Chain Logic ⚡

```
node_hash = sha256(payload + metadata)
chain_hash = sha256(node_hash + prev_chain_hash)
```

### Integrity Record JSON ⚡

```json
{
  "thread_integrity": {
    "root_hash": "sha256",
    "latest_hash": "sha256",
    "verified_at": "...",
    "status": "valid"
  }
}
```

---

## 7) KNOWLEDGE THREAD RETRIEVAL ENGINE ⚡ (NOUVEAU!)

### Purpose
Find relevant threads **without guessing or inferring intent.**

### RULE
> **Retrieval = MATCHING, not interpreting.**

### Query Types ⚡
| Type | Description |
|------|-------------|
| `by_timestamp` | ⚡ |
| `by_sphere` | ⚡ |
| `by_artifact` | ⚡ |
| `by_agent` | ⚡ |
| `by_topic` | **exact lexical match** ⚡ |
| `by_replay_reference` | ⚡ |
| `by_temporal_range` | ⚡ |

### Retrieval Response JSON ⚡

```json
{
  "threads": [
    {
      "id": "uuid",
      "title": "string",
      "match_reason": "shared_artifact|timestamp|topic",
      "nodes_count": 42
    }
  ]
}
```

---

**END — KNOWLEDGE THREADS SYSTEM (FULL FREEZE)**
