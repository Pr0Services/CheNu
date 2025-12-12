# CHE·NU — KNOWLEDGE THREADS (3-LAYER SYSTEM)
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-PERSUASIVE / BUILD-READY

---

## 1) KNOWLEDGE THREADS — BASE SYSTEM ⚡

### Purpose
Create structured, traceable "threads" that connect information across meetings, decisions, artifacts, and spheres.

### RULE
> **Threads CONNECT facts. They NEVER interpret, compress meaning, or judge.**

### Thread Types ⚡
| Type | Description |
|------|-------------|
| `THREAD_EVENT` | **links events across time** ⚡ |
| `THREAD_ARTIFACT` | **links documents, visuals, notes** ⚡ |
| `THREAD_DECISION` | **links decisions across cycles** ⚡ |
| `THREAD_AGENT` | **links agent contributions** ⚡ |
| `THREAD_CONTEXT` | **links by sphere, topic, or metadata** ⚡ |

### Thread Properties ⚡
| Property | Status |
|----------|--------|
| **immutable** | ✅ ⚡ |
| **append-only** | ✅ ⚡ |
| **cryptographically hashed** | ✅ ⚡ |
| **reversible at any point** | ✅ ⚡ |
| **always sourced from verified replay or artifact** | ✅ ⚡ |

### Data Model ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "root_entry": "memory_id",
    "entries": [
      { "id": "memory_id", "timestamp": "...", "type": "event|artifact|decision" }
    ],
    "sphere": "business|scholar|creative|...",
    "topic_tags": ["innovation", "budget", "design"],
    "hash": "sha256",
    "visibility": "private|shared"
  }
}
```

### Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `root_entry` | **memory_id (starting point)** ⚡ |
| `entries[].type` | **event/artifact/decision** ⚡ |
| `topic_tags` | **Array of topic strings** ⚡ |
| `visibility` | **private/shared** ⚡ |

### Thread Operations ⚡ (NOUVEAU!)
| Operation | Description |
|-----------|-------------|
| `extend(entry)` | **add entry to thread** ⚡ |
| `split(new_thread)` | **create branch** ⚡ |
| `merge(thread_a, thread_b)` | **→ with user approval** ⚡ |
| `visualize (2D, 3D, XR)` | ⚡ |
| `export (pdf, json bundle)` | ⚡ |

---

## 2) CROSS-SPHERE KNOWLEDGE THREADS ⚡

### Purpose
Reveal **structural relationships** across spheres **WITHOUT merging them or inferring meaning.**

### RULE
> **Cross-links = connections, not conclusions.**

### What May Be Linked? ⚡
| Source | Description |
|--------|-------------|
| **same artifact used in two spheres** | ⚡ |
| **same decision pattern reappearing elsewhere** | ⚡ |
| **same agent participating across contexts** | ⚡ |
| **shared replay topics** | ⚡ |
| **related timelines** | ⚡ |
| **simultaneous silence intervals** | ⚡ |

### Cross-Sphere Link Types ⚡
| Type | Description |
|------|-------------|
| `LINK_TOPIC` | **identical or overlapping topics** ⚡ |
| `LINK_METHOD` | **methodologies used in different spheres** ⚡ |
| `LINK_TIMING` | **parallel events across domains** ⚡ |
| `LINK_PARTICIPANT` | **same user or agent active in multiple spheres** ⚡ |
| `LINK_ARTIFACT` | **reused document or reference** ⚡ |

### Cross-Sphere Model ⚡

```json
{
  "cross_threads": [
    {
      "thread_id": "uuid",
      "connected_spheres": ["scholar", "business"],
      "link_type": "topic|timing|artifact",
      "strength": "0.0-1.0",
      "explanation": "shared_artifact:blueprint_47"
    }
  ]
}
```

### Cross-Sphere Fields ⚡ (NOUVEAU!)
| Field | Description |
|-------|-------------|
| `connected_spheres` | **Array of sphere names** ⚡ |
| `link_type` | **topic/timing/artifact** ⚡ |
| `strength` | **0.0-1.0 float (structural only)** ⚡ |
| `explanation` | **human-readable reference** ⚡ |

### UI / XR Behavior ⚡

**2D:**
| Feature | Description |
|---------|-------------|
| **dotted lines across spheres** | ⚡ |
| **hover for explanation** | ⚡ |

**3D / XR:**
| Feature | Description |
|---------|-------------|
| **thin light-beams between sphere-orbits** | ⚡ |
| **node labels visible only on request** | ⚡ |
| **NO animation that pulls attention** | ⚡ |

---

## 3) PERSONAL vs COLLECTIVE KNOWLEDGE THREADS ⚡

### Purpose
Allow each user to maintain **private understanding**, while preserving **collective truth.**

### RULES
> **Personal thread ≠ rewrite of collective memory.**  
> **Personal thread = private grouping of the same facts.**

### Personal Thread Properties ⚡
| Property | Status |
|----------|--------|
| **user-private** | ✅ ⚡ |
| **customizable** | ✅ ⚡ |
| **reorderable** | ✅ ⚡ |
| **taggable** | ✅ ⚡ |
| **deletable** | ✅ ⚡ |

### Personal Thread NEVER ⚡
| Forbidden | Status |
|-----------|--------|
| **modifies collective records** | ❌ ⚡ |
| **hides collective facts** | ❌ ⚡ |
| **influences other users** | ❌ ⚡ |

### Personal Thread Model ⚡

```json
{
  "personal_thread": {
    "user_id": "uuid",
    "base_thread": "thread_id",
    "custom_order": ["entry_1", "entry_2", "entry_3"],
    "notes": [
      { "t": "timestamp", "text": "user annotation" }
    ],
    "tags": ["my_tag_1", "my_tag_2"],
    "private": true
  }
}
```

### Personal vs Collective ⚡
| Aspect | Personal | Collective |
|--------|----------|------------|
| **Ownership** | user-private ⚡ | global ⚡ |
| **Modifiable** | yes (order, tags) ⚡ | **no (append-only)** ⚡ |
| **Visible to others** | never (unless shared) ⚡ | always ⚡ |
| **Can delete** | yes ⚡ | **never** ⚡ |
| **Affects truth** | **no** ⚡ | defines truth ⚡ |

---

**END — 3-LAYER SYSTEM (FREEZE READY)**
