# CHE·NU — KNOWLEDGE THREADS (3-LAYER SYSTEM)
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / FREEZE-READY

---

## PURPOSE

> **Knowledge Threads = STRUCTURED LINES OF TRUTH**

They connect: information, events, decisions, artifacts, participants, spheres

**WITHOUT interpretation. WITHOUT bias. WITHOUT inference.**

> **They reveal HOW knowledge flows, not what it means.**

---

## LAYER 1 — PERSONAL KNOWLEDGE THREADS

### Definition
Threads showing how **ONE USER'S knowledge** evolves across: spheres, tasks, meetings, artifacts, time

### RULE
> **Personal = PRIVATE by default. Never shared unless explicitly exported.**

### Personal Thread Structure ⚡

```json
{
  "PERSONAL_THREAD": {
    "id": "uuid",
    "owner": "user_id",
    "nodes": [
      { "type": "event|artifact|decision|memory",
        "timestamp": "...",
        "sphere": "...",
        "ref": "object_id"
      }
    ],
    "timeline": true,
    "visibility": "private"
  }
}
```

### Personal Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `owner` | **user_id** ⚡ |
| `timeline` | **true** ⚡ |
| `visibility` | **"private"** ⚡ |

### What They Do ⚡
| Function | Status |
|----------|--------|
| show continuity of work | ✅ |
| **highlight gaps (non-judgmental)** | ⚡ |
| connect relevant past moments | ✅ |
| **help memory recovery** | ⚡ |

### NO ⚡
| Forbidden | Status |
|-----------|--------|
| **productivity scoring** | ❌ ⚡ |
| **behavioral predictions** | ❌ ⚡ |
| **emotional classification** | ❌ ⚡ |

---

## LAYER 2 — SPHERE KNOWLEDGE THREADS

### Definition
Threads that reflect the evolution of KNOWLEDGE inside **one sphere** (ex: Business, Scholar, XR, Creative, Social, Institutional).

### RULE
> **Sphere Thread = SHARED WITHIN THE SPHERE ONLY. Not visible across spheres unless user grants permission.**

### Sphere Thread Structure ⚡

```json
{
  "SPHERE_THREAD": {
    "id": "uuid",
    "sphere": "business|scholar|...",
    "nodes": [
      { "type": "artifact|decision|meeting",
        "timestamp": "...",
        "contributors": ["user|agent"],
        "ref": "object_id"
      }
    ],
    "cross_links": [],
    "integrity_hash": "sha256"
  }
}
```

### Sphere Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `contributors` | **Array of ["user\|agent"]** ⚡ |
| `cross_links` | **Array (empty by default)** ⚡ |
| `integrity_hash` | **sha256** ⚡ |

### What They Do ⚡
| Function | Status |
|----------|--------|
| **map the evolution of knowledge inside a domain** | ⚡ |
| **show where information accumulates** | ⚡ |
| **reveal dependencies across tasks** | ⚡ |
| **support collaborative clarity** | ⚡ |

### NO ⚡
| Forbidden | Status |
|-----------|--------|
| **ranking contributors** | ❌ ⚡ |
| **judging quality** | ❌ ⚡ |
| **inferring intent** | ❌ ⚡ |

---

## LAYER 3 — COLLECTIVE KNOWLEDGE THREADS

### Definition
Global threads connecting **multi-sphere knowledge** WITHOUT merging private information. They create a **"super-structure" of truth.**

### RULE
> **Collective = OPT-IN, VERIFIED, IMMUTABLE.**

### Collective Thread Structure ⚡

```json
{
  "COLLECTIVE_THREAD": {
    "id": "uuid",
    "scope": "multi-sphere",
    "nodes": [
      { "type": "decision|event|artifact",
        "sphere": "...",
        "timestamp": "...",
        "ref": "object_id"
      }
    ],
    "links": [
      { "from": "node_id", "to": "node_id", "reason":"shared_topic|dependency" }
    ],
    "validation_log": [],
    "immutable": true
  }
}
```

### Collective Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `scope` | **"multi-sphere"** ⚡ |
| `links[].reason` | **shared_topic/dependency** ⚡ |
| `validation_log` | **Array of validation entries** ⚡ |
| `immutable` | **true** ⚡ |

### What They Do ⚡
| Function | Status |
|----------|--------|
| **structural clarity across Che-Nu** | ⚡ |
| **integrity of multi-sphere decisions** | ⚡ |
| **alignment without centralization** | ⚡ |
| **transparency without exposure** | ⚡ |

### NO ⚡
| Forbidden | Status |
|-----------|--------|
| **global analytics on users** | ❌ ⚡ |
| **behavioral conclusions** | ❌ ⚡ |
| **implicit optimization** | ❌ ⚡ |

---

## CROSS-LAYER RULES (VERY IMPORTANT) ⚡

| Transition | Rule |
|------------|------|
| **1) Personal → Sphere** | Only if user explicitly shares nodes ⚡ |
| **2) Sphere → Collective** | Only validated events/artifacts qualify ⚡ |
| **3) Collective → Everyone** | Visible but NEVER reveals private details ⚡ |

### Threads MUST remain ⚡
| Requirement | Status |
|-------------|--------|
| **neutral** | ✅ ⚡ |
| **transparent** | ✅ ⚡ |
| **navigable** | ✅ ⚡ |
| **immutable** | ✅ ⚡ |

---

## VISUALIZATION RULES (UNIVERSE VIEW) ⚡

### Thread Render ⚡
| Thread Type | Line Style |
|-------------|------------|
| **Personal** | **thin lines** ⚡ |
| **Sphere** | **medium lines** ⚡ |
| **Collective** | **braided lines** ⚡ |

### Forbidden ⚡
| Forbidden | Status |
|-----------|--------|
| **NO motion** | ❌ ⚡ |
| **NO brightness spikes** | ❌ ⚡ |
| **NO emotional design cues** | ❌ ⚡ |

---

**END — FOUNDATION FREEZE**
