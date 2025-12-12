# CHE·NU — KNOWLEDGE THREADS SYSTEM (SYNC MODES)
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / FREEZE-READY

---

## 1) KNOWLEDGE THREADS — CORE SYSTEM

### Purpose
Bind meetings, artifacts, decisions, events, and spheres into a **NEUTRAL, TRANSPARENT informational thread.**

### RULE
> **A Knowledge Thread = FACT PATHWAY**  
> NOT interpretation, NOT prioritization, NOT emotional relevance.

---

### THREAD ELEMENT TYPES ⚡
| Type | Description |
|------|-------------|
| `THREAD_EVENT` | Atomic fact extracted from replay |
| `THREAD_DECISION` | Validated decision log |
| `THREAD_ARTIFACT` | Document / board / visual |
| `THREAD_CONTEXT` | Sphere, mode, participants |
| `THREAD_LINK` | Reference between two elements |

---

### THREAD STRUCTURE

> **THREAD = ordered list of THREAD_ELEMENTS + metadata + cryptographic hash**

### Ordering Basis
| Basis | Description |
|-------|-------------|
| chronological | By time |
| causal | **If explicitly declared in meeting** |
| reference-based | By references |

> **NO inferred causality.**

---

### THREAD JSON MODEL

```json
{
  "thread": {
    "id": "uuid",
    "title": "string",
    "elements": [
      {
        "type": "event|decision|artifact|context",
        "source": "replay_id",
        "timestamp": 1712345678,
        "data": {...},
        "hash": "sha256"
      }
    ],
    "links": [
      { "from": "uuid", "to": "uuid", "type": "reference" }
    ],
    "integrity": "verified"
  }
}
```

### Thread Safety
| Rule | Status |
|------|--------|
| immutable after freeze | ✅ |
| no auto-merging | ✅ |
| no auto-interpretation | ✅ |
| no prioritization bias | ✅ |
| all thread transitions visible | ✅ |

---

## 2) INTER-SPHERE KNOWLEDGE THREADS

### Purpose
Allow threads to traverse multiple spheres **WITHOUT collapsing them, WITHOUT creating hierarchy, WITHOUT generating meaning.**

### Thread Travels If
- artifact shared
- meeting touches multiple spheres
- context links exist
- cross-sphere decision recorded

---

### INTER-SPHERE CROSSING RULES ⚡

| Rule | Description |
|------|-------------|
| **CROSS-SHARE** | Element in sphere A references artifact in sphere B → Thread forks into B while keeping A as origin |
| **CROSS-REF** | Past decision from sphere C cited in sphere D → Thread links but does NOT migrate |
| **CROSS-CLUSTER** | Multiple spheres participate in same meeting → Thread receives multi-sphere label |

### NEVER
- Auto-classify
- Suggest relationships
- Ladderize spheres

---

### INTER-SPHERE THREAD JSON

```json
{
  "inter_sphere": {
    "thread_id": "uuid",
    "spheres": ["business","scholar","creative"],
    "crossings": [
      { "from": "business", "to": "creative", "reason": "shared_artifact" }
    ],
    "origin_sphere": "business"
  }
}
```

### Crossings Field ⚡
| Field | Description |
|-------|-------------|
| `from` | Source sphere |
| `to` | Target sphere |
| `reason` | Reason for crossing |

---

### VISUALIZATION ⚡

| Property | Value |
|----------|-------|
| Color | per sphere |
| Style | branching lines |
| **Crossing nodes** | **neutral glyph** ⚡ |
| Arrows | **no directional arrows** ⚡ |

---

## 3) PERSONAL vs COLLECTIVE KNOWLEDGE THREAD SYNC ⚡ UNIQUE

### Purpose
Allow a user to maintain **PERSONAL knowledge threads** while benefiting from **COLLECTIVE truth**, without privacy loss or social pressure.

### RULE
> **Personal Threads = Private perspective**  
> **Collective Threads = Immutable shared record**

---

### PERSONAL THREAD BEHAVIOR
| Rule | Status |
|------|--------|
| user may annotate thread elements | ✅ |
| user may add personal bookmarks | ✅ |
| **personal elements NEVER modify collective thread** | ✅ ⚡ |
| **personal elements encrypted locally** | ✅ ⚡ |

---

### COLLECTIVE THREAD BEHAVIOR
| Property | Status |
|----------|--------|
| validated | ✅ |
| time-stamped | ✅ |
| hash-locked | ✅ |
| auditable | ✅ |

---

### SYNC MODES (3) ⚡

| Mode | Description |
|------|-------------|
| `SYNC_MODE: MIRROR` | Collective data copied into user's personal thread. User can layer notes on top. |
| `SYNC_MODE: SHADOW` | User sees only structure + allowed metadata, NOT full artifacts. |
| `SYNC_MODE: MERGE VIEW` | Shows personal + collective elements overlapped. **READ-ONLY, Never writes back.** |

---

### SYNC JSON MODEL ⚡

```json
{
  "knowledge_thread_sync": {
    "user_id": "uuid",
    "thread_id": "uuid",
    "mode": "mirror|shadow|merge",
    "personal_layer": [...],
    "collective_layer": [...],
    "privacy": "local_encrypted"
  }
}
```

### Sync Fields ⚡
| Field | Description |
|-------|-------------|
| `mode` | mirror / shadow / merge |
| `personal_layer` | User's private annotations |
| `collective_layer` | Shared immutable data |
| `privacy` | **local_encrypted** |

---

### ETHICAL LOCKS
| Lock | Status |
|------|--------|
| no social comparison | ✅ |
| no performance ranking | ✅ |
| no implicit bias injection | ✅ |
| user decides sync mode | ✅ |
| user controls personal layer visibility | ✅ |

---

## WHY 1 + 2 + 3 TOGETHER

| Component | Provides |
|-----------|----------|
| **Knowledge Threads** | PURE informational pathways |
| **Inter-Sphere Connections** | Prevent siloing while avoiding forced unity |
| **Personal vs Collective Sync** | Each person sees truth and still has their own perspective |

### Che·Nu Guarantees
- **clarity without coercion**
- **shared truth without collapse**
- **personal agency without isolation**

---

**END — FREEZE READY**
