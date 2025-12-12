# CHE·NU — KNOWLEDGE THREADS (1–2–3)
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / BUILD-READY

---

## 1) INTRA-SPHERE KNOWLEDGE THREADS ⚡

### Purpose
> **Maintain coherent, structured knowledge inside ONE sphere (Business, Scholar, Creative, etc.) without cross-contamination.**

### RULE
> **Intra-sphere threads = LOCAL continuity only.**

### 3 Thread Types ⚡
| Type | Description |
|------|-------------|
| `TASK_THREAD` | follows task/project evolution, captures decisions, artifacts, timelines ⚡ |
| `TOPIC_THREAD` | aggregates info about specific subject, **ensures no duplications, no contradictions** ⚡ |
| `AGENT_THREAD` | logs agent participation, outputs, validations, **clarifies reasoning chains** ⚡ |

### Intra-Thread JSON ⚡
```json
{
  "intra_thread": {
    "id": "uuid",
    "sphere": "business|scholar|creative|...",
    "type": "task|topic|agent",
    "nodes": [
      { "id": "uuid", "type": "note|artifact|decision", "timestamp": 123, "data": {} }
    ],
    "links": [
      { "from": "uuid", "to": "uuid", "reason": "follow|reference|update" }
    ],
    "integrity": "sha256"
  }
}
```

### Properties ⚡
| Property | Status |
|----------|--------|
| **local to sphere** | ✅ ⚡ |
| **chronological ordering** | ✅ ⚡ |
| **zero interpretation** | ✅ ⚡ |
| **conflict detection inside sphere** | ✅ ⚡ |

---

## 2) INTER-SPHERE KNOWLEDGE THREADS ⚡

### Purpose
> **Connect information that spans MULTIPLE spheres while preserving domain boundaries.**

### RULE
> **Inter-sphere threads = RELATIONAL MAP. NOT narrative, NOT synthesis.**

### 3 Thread Categories ⚡
| Category | Description |
|----------|-------------|
| `DEPENDENCY_THREAD` | Scholar → Business, Creative → Social, XR → Methodology. **Shows which sphere depends on which info** ⚡ |
| `TRANSLATION_THREAD` | transforms concepts from one sphere to another. Ex: "XR replay data → Business audit format" ⚡ |
| `IMPACT_THREAD` | **shows consequences of updates** in one sphere on others (never evaluative; only structural) ⚡ |

### Inter-Thread JSON ⚡
```json
{
  "inter_thread": {
    "id": "uuid",
    "spheres": ["business", "scholar", "xr"],
    "nodes": [
      { "id": "n1", "sphere": "scholar", "data": {} },
      { "id": "n2", "sphere": "business", "data": {} }
    ],
    "edges": [
      { "from": "n1", "to": "n2", "type": "dependency|translation|impact" }
    ]
  }
}
```

### Rules ⚡
| Rule | Status |
|------|--------|
| **must show all spheres involved** | ✅ ⚡ |
| **each link annotated with reason** | ✅ ⚡ |
| **no merging of meaning** | ✅ ⚡ |
| **no authority across spheres** | ✅ ⚡ |

---

## 3) CROSS-USER / COLLECTIVE KNOWLEDGE THREADS ⚡

### Purpose
> **Represent shared understanding across users WITHOUT deciding what is "true", "better" or "correct".**

### RULE
> **Collective Threads = OVERLAP MAP. NOT consensus engine.**

### 3 Thread Types ⚡ (NOUVEAU!)
| Type | Description |
|------|-------------|
| `OVERLAP_THREAD` | **shows content multiple users referenced independently** ⚡ |
| `DIVERGENCE_THREAD` | **maps where users differ** — only structural differences visualized ⚡ |
| `CONVERGENCE_THREAD` | shows alignment in actions or artifacts — **NOT emotional or ideological** ⚡ |

### Collective Thread JSON ⚡
```json
{
  "collective_thread": {
    "id": "uuid",
    "users": ["u1", "u2", "u3"],
    "nodes": [
      { "id": "a", "source": "u1", "data": {} },
      { "id": "b", "source": "u2", "data": {} }
    ],
    "relationships": [
      { "from": "a", "to": "b", "type": "overlap|divergence|convergence" }
    ]
  }
}
```

---

## AGENT SAFEGUARDS ⚡

### `AGENT_THREAD_BUILDER` ⚡
| Capability | Description |
|------------|-------------|
| constructs threads automatically | ⚡ |
| **no interpretation, no ranking** | ✅ ⚡ |

### `AGENT_THREAD_GUARD` ⚡ (NOUVEAU!)
| Prevents | Status |
|----------|--------|
| **emotional weighting** | ✅ ⚡ |
| **ideological clustering** | ✅ ⚡ |
| **hidden aggregation** | ✅ ⚡ |
| **user profiling** | ✅ ⚡ |

---

## VISUALIZATION ⚡

| Thread Level | Visual |
|--------------|--------|
| **INTRA** | linear chains inside a sphere ⚡ |
| **INTER** | **orbital crossing lines between spheres** ⚡ |
| **COLLECTIVE** | **Venn-like spatial clouds with no center** ⚡ |

---

## EXPORT ⚡

| Format | Status |
|--------|--------|
| PDF thread summary | ✅ ⚡ |
| **thread.json canonical format** | ✅ ⚡ |
| **XR map overlay** | ✅ ⚡ |
| 2D fallback diagram | ✅ ⚡ |

---

**END — KNOWLEDGE THREADS 1/2/3**
