# CHE·NU — KNOWLEDGE THREADS SYSTEM (FACT/CONTEXT/NAVIGATION)
**VERSION:** CORE.v1.0  
**STATUS:** FOUNDATION / NON-MANIPULATIVE / FREEZE-READY

---

## GLOBAL DEFINITION

> Knowledge Threads are **TRACEABLE INFORMATION LINES** that connect data, actions, decisions, and context **ACROSS time, spheres, users, agents, and meetings.**

### RULE
> **Threads REPRESENT reality. They NEVER infer intent or meaning.**

---

## THREAD TYPE 1 — FACT THREADS

### Purpose
Connect verifiable facts across the system.

### Sources
- XR replays, decisions logs, artifacts (documents, boards, files), timestamps, agent actions (trace only)

### Properties ⚡
| Property | Status |
|----------|--------|
| objective | ✅ |
| immutable after validation | ✅ |
| **cryptographically linked** | ✅ ⚡ |

### FACT_NODE Types ⚡
| Type | Description |
|------|-------------|
| `event` | Event node |
| `artifact` | Artifact node |
| `decision` | Decision node |
| `reference` | Reference node |

### FACT_EDGE Types ⚡
| Type | Description |
|------|-------------|
| `precedes` | Temporal order ⚡ |
| `references` | Reference link |
| `produces` | Production link ⚡ |
| `depends_on` | Dependency link ⚡ |

### Fact Thread JSON (with nodes + edges) ⚡

```json
{
  "fact_thread": {
    "id": "uuid",
    "nodes": [
      { "type": "event", "source": "replay_id" },
      { "type": "decision", "source": "meeting_id" }
    ],
    "edges": [
      { "from": "event", "to": "decision", "type": "produces" }
    ],
    "hash": "sha256",
    "verified": true
  }
}
```

### Fact Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `nodes[].source` | **replay_id / meeting_id** ⚡ |
| `edges` | **Array of edges** ⚡ |
| `edges[].type` | **precedes/references/produces/depends_on** ⚡ |
| `verified` | **Boolean** ⚡ |

### Fact Thread Rules ⚡
| Rule | Status |
|------|--------|
| append-only | ✅ |
| no deletion | ✅ |
| **no reordering** | ✅ ⚡ |
| **replay-backed only** | ✅ ⚡ |
| **globally referencable (with permissions)** | ✅ ⚡ |

---

## THREAD TYPE 2 — CONTEXT THREADS

### Purpose
Preserve **WHY and WHERE** things happened WITHOUT interpreting intent.

### Sources
- meeting metadata, sphere context, time window, participant set, environmental mode (XR, 2D)

### Context Thread Content ⚡
| Content | Description |
|---------|-------------|
| sphere | ✅ |
| meeting type | ✅ |
| active topics | ⚡ |
| **tools used** | ⚡ |
| participants present | ✅ |
| **user-defined notes (explicit)** | ⚡ |

### Context Thread JSON (with anchors + linked_fact_threads) ⚡

```json
{
  "context_thread": {
    "id": "uuid",
    "anchors": {
      "sphere": "business|scholar|xr|...",
      "meeting_type": "analysis|creative|decision",
      "time_range": [start, end]
    },
    "linked_fact_threads": ["uuid"],
    "visibility": "private|shared|public"
  }
}
```

### Context Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `anchors` | **Object with sphere/meeting_type/time_range** ⚡ |
| `anchors.time_range` | **[start, end] array** ⚡ |
| `linked_fact_threads` | **Array of UUIDs** ⚡ |

### Context Thread Rules ⚡
| Rule | Status |
|------|--------|
| contextual only | ✅ |
| no conclusions | ✅ |
| **user annotations allowed (clearly marked)** | ✅ ⚡ |
| **removable annotations (not facts)** | ✅ ⚡ |

---

## THREAD TYPE 3 — NAVIGATION THREADS ⚡

### Purpose
Help users **RETRACE information paths** WITHOUT influencing conclusions.

### Sources ⚡
- user navigation, opened meetings, viewed replays, inspected threads, manual bookmarks

### Navigation Thread Data ⚡
| Data | Description |
|------|-------------|
| sequence of visited nodes | ✅ |
| **dwell time per node** | ⚡ |
| **user pauses** | ⚡ |
| **path loops** | ⚡ |

### Navigation Thread JSON (with path + session_scoped) ⚡

```json
{
  "navigation_thread": {
    "id": "uuid",
    "owner": "user_id",
    "path": [
      { "node_id": "uuid", "timestamp": 171234 },
      { "node_id": "uuid", "timestamp": 171260 }
    ],
    "session_scoped": true
  }
}
```

### Navigation Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `owner` | **user_id** ⚡ |
| `path` | **Array of {node_id, timestamp}** ⚡ |
| `session_scoped` | **Boolean - true** ⚡ |

### Navigation Thread Rules ⚡
| Rule | Status |
|------|--------|
| **private by default** | ✅ ⚡ |
| **never shared automatically** | ✅ ⚡ |
| **editable by user** | ✅ ⚡ |
| **deletable anytime** | ✅ ⚡ |
| **NEVER used for profiling** | ✅ ⚡ |

---

## THREAD LINKING & INTERACTION

### Allowed References ⚡
| From | To | Status |
|------|-----|--------|
| navigation_thread | → fact_thread | ✅ |
| context_thread | → fact_thread | ✅ |
| fact_thread | ↔ fact_thread (cross-sphere) | ✅ |

### BUT: ⚡
- **fact threads never altered**
- **context threads never infer intent**
- **navigation threads never influence routing automatically**

---

## VISUALIZATION (UNIVERSE VIEW)

### Visual Styles ⚡
| Thread Type | Style | Color |
|-------------|-------|-------|
| **FACT THREAD** | solid line | neutral color |
| **CONTEXT THREAD** | **dotted halo** ⚡ | **sphere-tinted** ⚡ |
| **NAVIGATION THREAD** | **thin personal glow** ⚡ | **visible to owner only** ⚡ |

---

## AGENTS INTERACTION

| Agent | Role |
|-------|------|
| `AGENT_THREAD_INDEXER` | indexes threads, **no reasoning** ⚡ |
| `AGENT_THREAD_EXPLAINER` | human-readable, **source-only** ⚡ |
| `AGENT_THREAD_GUARD` | ensures purity, **blocks inference** ⚡ |

---

## WHY KNOWLEDGE THREADS MATTER

- **Truth without narrative**
- **Memory without distortion**
- **Navigation without manipulation**
- **Scale without chaos**

---

**END — KNOWLEDGE THREADS FREEZE**
