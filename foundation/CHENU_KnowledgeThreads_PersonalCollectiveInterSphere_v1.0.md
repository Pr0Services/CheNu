# CHE·NU — KNOWLEDGE THREADS SYSTEM (PERSONAL/COLLECTIVE/INTER-SPHERE)
**VERSION:** FOUNDATION v1.0  
**MODE:** CORE / NON-MANIPULATIVE / FREEZE-READY

---

## GLOBAL DEFINITION

> A Knowledge Thread is a **TRACEABLE LINE OF CONTINUITY** linking information, actions, decisions, and artifacts across time, meetings, agents, users, and spheres.

### RULE
> **Threads CONNECT facts. They DO NOT interpret them.**

---

## THE 3 KNOWLEDGE THREAD TYPES

| # | Type | Scope |
|---|------|-------|
| 1 | PERSONAL KNOWLEDGE THREAD | Single user |
| 2 | COLLECTIVE KNOWLEDGE THREAD | Team/org |
| 3 | INTER-SPHERE KNOWLEDGE THREAD | Cross-sphere |

> **All three share the same core structure but differ in: scope, visibility, authority, propagation rules.**

---

## 1) PERSONAL KNOWLEDGE THREAD

### Purpose
Allow a user to track their **OWN reasoning, learning, decisions, and references** over time.

### Scope ⚡
- Single user
- Optional agent assistance
- **Private by default**

### Sources ⚡
- personal meetings, private notes, selected replays, **bookmarked artifacts** ⚡, **user-authored annotations** ⚡

### Rules ⚡
| Rule | Status |
|------|--------|
| **User owns the thread** | ✅ ⚡ |
| **Can fork, merge, archive freely** | ✅ ⚡ |
| **NEVER auto-shared** | ✅ ⚡ |
| **NEVER auto-inferred** | ✅ ⚡ |

### Personal Thread JSON (with annotation + versioned) ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "personal",
    "owner": "user_id",
    "nodes": [
      {
        "node_id": "uuid",
        "source": "meeting|note|artifact|replay",
        "timestamp": 1712345678,
        "reference_id": "uuid",
        "annotation": "optional"
      }
    ],
    "visibility": "private",
    "versioned": true
  }
}
```

### Personal Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `owner` | **user_id** ⚡ |
| `nodes[].source` | **meeting/note/artifact/replay** ⚡ |
| `nodes[].reference_id` | **UUID reference** ⚡ |
| `nodes[].annotation` | **Optional string** ⚡ |
| `versioned` | **true** ⚡ |

---

## 2) COLLECTIVE KNOWLEDGE THREAD

### Purpose
Document a **SHARED evolution of understanding**, WITHOUT rewriting history or imposing consensus.

### Scope ⚡
- Multiple users
- Multiple agents
- One group / team / organization

### Sources ⚡
- validated XR replays, decisions logs, shared artifacts, **explicit user contributions** ⚡

### Rules ⚡
| Rule | Status |
|------|--------|
| Append-only | ✅ |
| **Consensus via inclusion, not exclusion** | ✅ ⚡ |
| **No "final truth" marker** | ✅ ⚡ |
| **All divergence preserved** | ✅ ⚡ |

### Collective Thread JSON (with scope + contributors + immutability) ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "collective",
    "scope": "team|org|project",
    "nodes": [
      {
        "node_id": "uuid",
        "source": "meeting|decision|artifact",
        "contributors": ["user_id","agent_id"],
        "timestamp": 1712345678
      }
    ],
    "visibility": "shared",
    "immutability": "post-validation"
  }
}
```

### Collective Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `scope` | **team/org/project** ⚡ |
| `nodes[].contributors` | **Array of user_id/agent_id** ⚡ |
| `immutability` | **"post-validation"** ⚡ |

---

## 3) INTER-SPHERE KNOWLEDGE THREAD

### Purpose
Link related knowledge **ACROSS SPHERES** without collapsing domain boundaries.

### Examples ⚡
- Decision in Business → Methodology reference
- Scholar research → Institution policy
- XR meeting → Creative artifact

### Rules ⚡
| Rule | Status |
|------|--------|
| **Spheres remain autonomous** | ✅ ⚡ |
| **Thread is a LINK, not a merge** | ✅ ⚡ |
| **Each sphere controls its own exposure** | ✅ ⚡ |

### Inter-Sphere Thread JSON (with from/to objects + relation) ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "inter-sphere",
    "spheres": ["business","scholar","xr"],
    "links": [
      {
        "from": { "sphere":"business", "node":"uuid" },
        "to": { "sphere":"scholar", "node":"uuid" },
        "relation": "reference|followup|informed_by"
      }
    ],
    "visibility": "conditional"
  }
}
```

### Inter-Sphere Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `type` | **"inter-sphere"** ⚡ |
| `spheres` | **Array of spheres** |
| `links[].from` | **{sphere, node} object** ⚡ |
| `links[].to` | **{sphere, node} object** ⚡ |
| `links[].relation` | **reference/followup/informed_by** ⚡ |
| `visibility` | **"conditional"** ⚡ |

---

## THREAD OPERATIONS (ALL TYPES)

### Allowed ⚡
| Operation | Status |
|-----------|--------|
| create | ✅ |
| append | ✅ |
| **fork** | ✅ ⚡ |
| **merge (explicit)** | ✅ ⚡ |
| archive | ✅ |
| **export (PDF / graph / XR view)** | ✅ ⚡ |

### Forbidden ⚡
| Operation | Status |
|-----------|--------|
| **silent modification** | ❌ |
| **auto-inference** | ❌ |
| **priority scoring** | ❌ |
| **sentiment labeling** | ❌ |

---

## THREAD VISUALIZATION

### 2D ⚡
| Feature | Description |
|---------|-------------|
| timeline | with branching paths |
| node type icons | ✅ |
| **diff highlights** | ⚡ |

### 3D / XR ⚡
| Feature | Description |
|---------|-------------|
| **braided strands** | ⚡ |
| **divergence knots** | ⚡ |
| **convergence anchors** | ⚡ |
| **sphere-colored segments** | ⚡ |

---

## AGENTS INVOLVED (SUPPORT ONLY)

| Agent | Role |
|-------|------|
| `AGENT_THREAD_TRACKER` | indexes references, **no interpretation** |
| `AGENT_THREAD_EXPLAINER` | describes connections in plain language |
| `AGENT_THREAD_GUARD` | ensures rules, privacy, immutability |

---

## WHY KNOWLEDGE THREADS EXIST

They ensure:
- **continuity without coercion**
- **memory without rewriting**
- **intelligence without authority**
- **shared truth without consensus pressure**

---

**END — KNOWLEDGE THREADS FREEZE**
