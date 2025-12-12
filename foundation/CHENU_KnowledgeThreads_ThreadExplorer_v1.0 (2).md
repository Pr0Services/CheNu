# CHE·NU — KNOWLEDGE THREADS + THREAD EXPLORER
**VERSION:** FOUNDATION v1.0  
**MODE:** TRUTH-LINKING / NON-MANIPULATIVE / BUILD-READY

---

## GLOBAL DEFINITION

> **Knowledge Thread = A VERIFIABLE LINK** between facts, decisions, artifacts, contexts, and time.

### THREADS DO NOT
- infer meaning
- rank importance
- suggest conclusions

### THREADS ONLY
- connect
- expose
- clarify continuity

---

## THE 3 KNOWLEDGE THREAD TYPES

---

## THREAD TYPE 1 — FACT THREAD (with edges) ⚡

### Purpose
Link objective facts across time and contexts.

### Sources
- XR replay events, artifacts, timestamps, agent actions, **silence intervals**

### Use Cases
- Track what happened
- Track what did not happen
- Track factual continuity

### Rules
| Rule | Status |
|------|--------|
| append-only | ✅ |
| source-backed | ✅ |
| replay-verifiable | ✅ |
| no interpretation layer | ✅ |

### JSON Model (with edges) ⚡

```json
{
  "thread": {
    "id": "uuid",
    "type": "fact",
    "nodes": ["event_id","artifact_id"],
    "edges": ["followed_by","referenced_by"],
    "origin": "xr_replay_id",
    "hash": "sha256"
  }
}
```

### Edge Types (Fact) ⚡
| Edge | Description |
|------|-------------|
| `followed_by` | Sequence |
| `referenced_by` | Reference |

---

## THREAD TYPE 2 — CONTEXT THREAD (with environment) ⚡

### Purpose
Link environments, spheres, and conditions under which facts occurred.

### Sources
- sphere, meeting type, participants, mode (live/review/replay), avatar states (non-emotive)

### Use Cases
- Compare situations
- Understand constraints
- Reveal missing context

### Rules
| Rule | Status |
|------|--------|
| context-only metadata | ✅ |
| no causality claim | ✅ |
| no success metrics | ✅ |

### JSON Model (with environment) ⚡

```json
{
  "thread": {
    "id": "uuid",
    "type": "context",
    "nodes": ["meeting_id","sphere_id"],
    "edges": ["occurred_in","shared_context"],
    "environment": "xr|2d|hybrid",
    "visibility": "private|shared"
  }
}
```

### Edge Types (Context) ⚡
| Edge | Description |
|------|-------------|
| `occurred_in` | Location |
| `shared_context` | Shared |

### Environment Types ⚡
| Type | Description |
|------|-------------|
| `xr` | Extended Reality |
| `2d` | Traditional 2D |
| `hybrid` | Mixed |

---

## THREAD TYPE 3 — DECISION TRACE THREAD ⚡

### Purpose
Trace decision sequences **WITHOUT judging outcomes.**

### Sources
- declared decisions, timestamps, alternative paths (if stated), participants present

### Use Cases
- Review decision evolution
- Compare alternative paths
- **Accountability without blame**

### Rules
| Rule | Status |
|------|--------|
| decision text preserved exactly | ✅ |
| no optimization signals | ✅ |
| no recommendation logic | ✅ |

### JSON Model (with edges) ⚡

```json
{
  "thread": {
    "id": "uuid",
    "type": "decision_trace",
    "nodes": ["decision_id"],
    "edges": ["preceded_by","superseded_by"],
    "timestamp": 1712345678,
    "participants": ["user_id","agent_id"]
  }
}
```

### Edge Types (Decision) ⚡
| Edge | Description |
|------|-------------|
| `preceded_by` | Before |
| `superseded_by` | Replaced |

---

## THREAD RELATIONSHIP RULES

- Threads may intersect
- **Threads NEVER merge into conclusions**
- Intersection = observation only
- Each thread keeps its own integrity hash

---

## THREAD EXPLORER — CORE PURPOSE ⚡ UNIQUE

### Purpose
Allow users to **NAVIGATE THREADS visually** WITHOUT changing or rewriting them.

### Thread Explorer IS
| Property | Value |
|----------|-------|
| read-only by default | ✅ |
| filter-based | ✅ |
| time-aware | ✅ |
| sphere-aware | ✅ |

---

## THREAD EXPLORER FEATURES ⚡

| Feature | Description |
|---------|-------------|
| thread list view | List format |
| spatial thread graph | Graph format |
| timeline braid view | Timeline format |
| intersection highlights | Show overlaps |
| **silence gap visualization** | Show silence ⚡ |
| **replay jump (read-only)** | Jump to replay ⚡ |

---

## THREAD EXPLORER FILTERS ⚡

| Filter | Description |
|--------|-------------|
| by thread type | fact/context/decision |
| by sphere | business/scholar/etc |
| by participant | user/agent |
| by time range | t1 to t2 |
| by artifact | specific artifact |
| by meeting | specific meeting |

> **All filters are REVERSIBLE.**

---

## THREAD EXPLORER JSON STATE ⚡

```json
{
  "thread_explorer": {
    "visible_threads": ["uuid"],
    "filters": {
      "type": ["fact","context","decision_trace"],
      "sphere": ["business","scholar"],
      "time_range": [t1, t2]
    },
    "view_mode": "graph|timeline|list",
    "read_only": true
  }
}
```

### View Modes ⚡
| Mode | Description |
|------|-------------|
| `graph` | Spatial graph |
| `timeline` | Braid timeline |
| `list` | List view |

---

## SAFETY & ETHICAL CONSTRAINTS

| Constraint | Status |
|------------|--------|
| No auto-thread generation without consent | ✅ |
| No inferred intent | ✅ |
| No success/failure labels | ✅ |
| No personalization of truth | ✅ |
| Full source transparency | ✅ |

---

## WHY KNOWLEDGE THREADS MATTER

They provide:
- **continuity without narrative**
- **truth without control**
- **memory without distortion**
- **accountability without punishment**

---

**END — FOUNDATION FREEZE**
