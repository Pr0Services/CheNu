# CHE·NU — KNOWLEDGE THREADS SYSTEM (FACTUAL/CONTEXTUAL/PERSONAL NAVIGATION)
**VERSION:** FOUNDATION v1.0  
**MODE:** TRUTH-PRESERVING / NON-MANIPULATIVE

---

## GLOBAL DEFINITION

> **Knowledge Thread = a TRACEABLE CHAIN of information** linking events, decisions, artifacts, meetings, and agents **ACROSS time, spheres, and users.**

### RULE
> **Threads CONNECT facts. They DO NOT interpret, judge, or optimize.**

---

## THREAD TYPE 1 — FACTUAL THREAD

### Purpose
Maintain objective continuity of **WHAT happened.**

### Sources
- XR replays, meeting logs, artifacts, decisions (declared only), timestamps

### Nodes ⚡
| Node Type | Description |
|-----------|-------------|
| event | Event node |
| artifact | Artifact node |
| decision | Decision node |
| replay | Replay node |
| meeting | Meeting node |

### Edges ⚡
| Edge Type | Description |
|-----------|-------------|
| `happened_before` | Temporal order ⚡ |
| `referenced_by` | Reference link ⚡ |
| `produced` | Production link ⚡ |
| `followed_by` | Sequence link ⚡ |

### Properties ⚡
| Property | Status |
|----------|--------|
| append-only | ✅ |
| immutable after validation | ✅ |
| cryptographically hashed | ✅ |
| **replay-verifiable** | ✅ ⚡ |

### Factual Thread JSON (with origin + integrity) ⚡

```json
{
  "factual_thread": {
    "id": "uuid",
    "nodes": [...],
    "edges": [...],
    "origin": "replay_id",
    "integrity": "verified"
  }
}
```

### Factual Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `nodes` | **Array of nodes** |
| `edges` | **Array of edges** |
| `origin` | **replay_id - source** ⚡ |
| `integrity` | **"verified"** ⚡ |

---

## THREAD TYPE 2 — CONTEXTUAL THREAD

### Purpose
Preserve **WHY a factual sequence existed** WITHOUT inferring intent.

### Sources ⚡
- meeting context metadata, sphere type, participant list, **agenda objects** ⚡, **silence intervals** ⚡

### Adds ⚡
| Addition | Description |
|----------|-------------|
| **environmental context** | ⚡ |
| **scope boundaries** | ⚡ |
| **domain relevance** | ⚡ |

### Rules ⚡
| Rule | Status |
|------|--------|
| **cannot contradict factual thread** | ✅ ⚡ |
| **detachable from factual thread** | ✅ ⚡ |
| **can be hidden or revealed** | ✅ ⚡ |

### Contextual Thread JSON (with linked_factual_thread + scope) ⚡

```json
{
  "contextual_thread": {
    "id": "uuid",
    "linked_factual_thread": "uuid",
    "context": {
      "sphere": "business|scholar|xr|...",
      "meeting_type": "review|decision|creative",
      "participants": ["ids"],
      "scope": "string"
    }
  }
}
```

### Contextual Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `linked_factual_thread` | **UUID reference** ⚡ |
| `context.meeting_type` | **review/decision/creative** ⚡ |
| `context.scope` | **String scope** ⚡ |

---

## THREAD TYPE 3 — PERSONAL NAVIGATION THREAD ⚡

### Purpose
Allow each user to **FOLLOW a path through knowledge** WITHOUT changing the underlying truth.

### Sources ⚡
- factual threads, contextual threads, **user bookmarks** ⚡, **navigation history** ⚡

### Rules ⚡
| Rule | Status |
|------|--------|
| **purely personal** | ✅ ⚡ |
| **reversible** | ✅ ⚡ |
| **invisible to others unless shared** | ✅ ⚡ |
| **does not alter any other thread** | ✅ ⚡ |

### Personal Navigation Thread JSON (with entry_points + focus_nodes + hidden_nodes) ⚡

```json
{
  "personal_thread": {
    "user_id": "uuid",
    "entry_points": ["node_id"],
    "focus_nodes": ["node_id"],
    "hidden_nodes": ["node_id"],
    "created_at": "timestamp"
  }
}
```

### Personal Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `user_id` | **UUID owner** ⚡ |
| `entry_points` | **Array of node_ids - starting points** ⚡ |
| `focus_nodes` | **Array of node_ids - focus** ⚡ |
| `hidden_nodes` | **Array of node_ids - hidden** ⚡ |

---

## THREAD INTERACTION RULES ⚡

| Rule | Description |
|------|-------------|
| **Factual threads are canonical** | ⚡ |
| **Contextual threads enrich, never override** | ⚡ |
| **Personal threads filter, never edit** | ⚡ |
| **Threads can be merged visually, never logically** | ⚡ |

---

## VISUAL REPRESENTATION

### Visual Styles ⚡
| Thread Type | Style |
|-------------|-------|
| **FACTUAL THREAD** | solid line, neutral color |
| **CONTEXTUAL THREAD** | **dashed line, soft color overlay** ⚡ |
| **PERSONAL THREAD** | **highlight glow, user-specific tint** ⚡ |

---

## AGENTS INVOLVED

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | constructs factual threads from sources |
| `AGENT_CONTEXT_BINDER` | **attaches contextual metadata** ⚡ |
| `AGENT_NAVIGATION_THREADER` | **manages personal thread views** ⚡ |
| `AGENT_THREAD_GUARD` | ensures no mutation, **checks consistency across threads** ⚡ |

---

## ETHICAL SAFEGUARDS

| Guarantee | Status |
|-----------|--------|
| No narrative rewriting | ✅ |
| **No hidden prioritization** | ✅ ⚡ |
| **No "correct path"** | ✅ ⚡ |
| Full traceability | ✅ |
| Transparency first | ✅ |

---

## WHY THIS MATTERS

Knowledge Threads allow Che-Nu to:
- **Remember without bias**
- **Explain without persuasion**
- **Scale truth across time**
- **Respect individual perspective**

---

**END — KNOWLEDGE THREADS**
