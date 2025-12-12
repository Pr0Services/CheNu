# CHE·NU — KNOWLEDGE THREADS (A + B + C + D)
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-PERSUASIVE / IMMUTABLE LINKS

---

## A) KNOWLEDGE THREADS — BASE SYSTEM ⚡

### Purpose
> **Create neutral, traceable connections between concepts, artifacts, decisions, and events WITHOUT interpretation.**

### RULE
> **A Knowledge Thread = FACT LINKAGE. NOT inference, NOT assumption.**

### 4 Knowledge Thread Types ⚡
| Type | Description |
|------|-------------|
| `THREAD_EVENT` | links events across time ⚡ |
| `THREAD_ARTIFACT` | links documents, notes, boards ⚡ |
| `THREAD_DECISION` | links decision points across meetings ⚡ |
| `THREAD_TOPIC` | **links semantic concepts WITHOUT sentiment** ⚡ |

### Thread Structure ⚡
> **Each thread is a linear or branching link list:**
```
node → node → node → ...
```

**Nodes can be:**
- replay events
- artifacts
- decisions
- agents (context only)
- sphere contexts
- **user contributions**

### Thread JSON ⚡
```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "event|artifact|decision|topic",
    "nodes": [
      {
        "id": "uuid",
        "source_type": "replay|artifact|meeting|agent",
        "timestamp": 1712345678,
        "sphere": "business|scholar|...",
        "hash": "sha256"
      }
    ],
    "immutable": true
  }
}
```

### Thread Rules ⚡
| Rule | Status |
|------|--------|
| **append-only** | ✅ ⚡ |
| **no rewrite** | ✅ ⚡ |
| **no guessing** | ✅ ⚡ |
| **no merging without exact match** | ✅ ⚡ |
| **no semantic scoring** | ✅ ⚡ |
| **explicit user or agent creation only** | ✅ ⚡ |

---

## B) CROSS-SPHERE KNOWLEDGE THREADS ⚡

### Purpose
> **Connect information across spheres without blending them. Preserve identity and boundaries while revealing structure.**

### RULE
> **Cross-sphere link = Structural similarity. NOT conceptual interpretation.**

### Sphere Pairs Examples ⚡
| From | To | Link |
|------|----|------|
| **Business** | Scholar | research supports project ⚡ |
| **Creative** | XR | visual asset → immersive model ⚡ |
| **Institution** | Methodology | **compliance → workflow pattern** ⚡ |
| **Social & Media** | Business | **campaign metrics → sales timeline** ⚡ |

### 4 Cross-Sphere Link Types ⚡
| Type | Description |
|------|-------------|
| `LINK_SUPPORT` | one artifact supports another ⚡ |
| `LINK_DEPENDENCY` | **one event triggers another sphere** ⚡ |
| `LINK_REUSE` | same asset used in multiple contexts ⚡ |
| `LINK_EVOLUTION` | **older decision refined in another domain** ⚡ |

### Cross-Sphere JSON ⚡
```json
{
  "cross_sphere_thread": {
    "id": "uuid",
    "from_sphere": "business",
    "to_sphere": "scholar",
    "link_type": "support|dependency|reuse|evolution",
    "nodes": ["uuid", "uuid", "uuid"],
    "integrity_hash": "sha256"
  }
}
```

### Rules ⚡
| Rule | Status |
|------|--------|
| **cannot auto-create** | ✅ ⚡ |
| **must be validated by user or guard agent** | ✅ ⚡ |
| **cannot rewrite meaning of data** | ✅ ⚡ |
| **must include provenance timestamps** | ✅ ⚡ |

---

## C) PERSONAL vs COLLECTIVE KNOWLEDGE THREADS ⚡

### Purpose
> **Provide two layers of knowledge linking: Personal (private view), Collective (shared, validated).**

### RULE
> **Personal threads = perspective. Collective threads = fact aggregation.**

### Personal Threads ⚡
| Property | Description |
|----------|-------------|
| created by user | ⚡ |
| **visible only to user** | ⚡ |
| may reorder nodes | ⚡ |
| may filter content | ⚡ |
| **ephemeral unless saved** | ⚡ |

**Personal Thread JSON:**
```json
{
  "personal_thread": {
    "owner": "user_id",
    "nodes": ["..."],
    "visibility": "private",
    "expire": "session|persistent"
  }
}
```

### Collective Threads ⚡
| Property | Description |
|----------|-------------|
| created by validated replay or artifact connections | ⚡ |
| **immutable** | ⚡ |
| public to allowed spheres | ⚡ |
| **cryptographically hashed** | ⚡ |

**Collective Thread JSON:**
```json
{
  "collective_thread": {
    "id": "uuid",
    "nodes": ["..."],
    "hash": "...",
    "validated": true
  }
}
```

### DIFF LAYER (Personal ↔ Collective) ⚡ (NOUVEAU!)

> **The system overlays differences WITHOUT judgment:**

**5 DIFF Types:**
| Type | Description |
|------|-------------|
| `missing nodes` | ⚡ |
| `reordered sequence` | ⚡ |
| `collapsed structure` | ⚡ |
| `expanded links` | ⚡ |
| `personal-only annotations (non-exported)` | ⚡ |

**Diff JSON:**
```json
{
  "thread_diff": {
    "personal": "id",
    "collective": "id",
    "differences": ["..."],
    "no_interpretation": true
  }
}
```

---

## D) XR KNOWLEDGE THREAD VISUALIZATION ⚡

### Purpose
> **Display knowledge threads in XR in a calm, spatial, non-influential manner — as navigable structures.**

### RULE
> **No animations that imply correctness or priority.**

### 4 XR Visual Forms ⚡ (NOUVEAU!)
| Form | Description |
|------|-------------|
| **FORM 1 — LINEAR RIBBON** | nodes = floating discs, timeline = subtle path ⚡ |
| **FORM 2 — BRANCHED TREE** | splits at decision points, **no highlight of "best path"** ⚡ |
| **FORM 3 — SPHERE ORBIT** | events orbit a topic node, **cross-sphere links = thin bridges** ⚡ |
| **FORM 4 — THREAD WEAVE** | multiple threads braided, **visual silence mode available** ⚡ |

### XR Interaction ⚡
| Action | Description |
|--------|-------------|
| grab to zoom | ⚡ |
| **pinch to enter node** | ⚡ |
| tap to view replay snapshot | ⚡ |
| **toggle cross-sphere overlays** | ⚡ |
| enable/disable personal layer | ⚡ |

### XR Forbidden ⚡
| NO | Status |
|----|--------|
| **snap-to-focus** | ❌ ⚡ |
| **automatic enlargement** | ❌ ⚡ |
| **moving nodes closer** | ❌ ⚡ |

### XR Thread Render JSON ⚡
```json
{
  "xr_thread_render": {
    "thread_id": "uuid",
    "form": "ribbon|tree|orbit|weave",
    "display_mode": "neutral|analysis|review",
    "user_layer": "personal|collective|merged",
    "safety": { "motion": "low", "contrast": "soft" }
  }
}
```

### Universe View Integration ⚡
| Rule | Description |
|------|-------------|
| **threads appear as optional overlays** | ⚡ |
| **user decides WHAT to reveal** | ⚡ |
| **routing never relies on thread influence** | ⚡ |
| **collective memory integrates seamlessly** | ⚡ |

---

**END — FOUNDATION FREEZE**
