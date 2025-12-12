# CHE·NU — KNOWLEDGE THREADS (3 TYPES) + SEARCH HUB
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / FREEZE-READY

---

## I) KNOWLEDGE THREADS — CORE ⚡

### Purpose
> **Trace, assemble, and reveal connections between meetings, spheres, data, artifacts, agents, and decisions WITHOUT forming conclusions or narratives.**

### RULE
> **Thread = PATH, not STORY.**

---

### 3 THREAD TYPES ⚡

| Type | Code | Description |
|------|------|-------------|
| **Personal Knowledge Thread** | `PKT` | Built from user's meetings, notes, artifacts. **Private by default.** Shows user's trace of focus over time. |
| **Collective Knowledge Thread** | `CKT` | Aggregates validated collective memory entries. Shows cross-user convergence. **No personal attribution unless explicitly shared.** |
| **Inter-Sphere Knowledge Thread** | `ISKT` | Connects ideas/data across spheres. Displays long-distance conceptual links. **Helps navigation through complexity.** |

---

### 7 Thread Node Types ⚡

| Node | Description |
|------|-------------|
| `meeting_node` | ⚡ |
| `replay_node` | ⚡ |
| `artifact_node` | ⚡ |
| `decision_node` | ⚡ |
| `sphere_node` | ⚡ |
| `concept_node` | derived from tags ⚡ |
| `agent_node` | **role-only** ⚡ |

### Forbidden Node Properties ⚡
| NO | Status |
|----|--------|
| **sentiment** | ❌ |
| **priority ranking** | ❌ |
| **value judgment** | ❌ |

---

### 6 Thread Edge Types ⚡

| CONNECTED_BY | Description |
|--------------|-------------|
| topic similarity | ⚡ |
| shared participants | ⚡ |
| shared artifacts | ⚡ |
| temporal proximity | ⚡ |
| conceptual taxonomy | ⚡ |
| replay reference | ⚡ |

### Edge CANNOT Imply ⚡
| Forbidden | Status |
|-----------|--------|
| **causality** | ❌ |
| **correctness** | ❌ |
| **superiority** | ❌ |

---

## II) THREAD ENGINE (KT ENGINE) ⚡

### Purpose
> **Generate threads and allow user exploration.**

### KT Engine Input JSON ⚡
```json
{
  "query": "string",
  "filters": ["sphere", "time", "topic"],
  "thread_type": "personal|collective|intersphere"
}
```

### KT Engine Output JSON ⚡
```json
{
  "thread": {
    "nodes": ["..."],
    "edges": ["..."],
    "origin": "personal|collective|intersphere",
    "confidence_map": [0.0-1.0]
  }
}
```

### Key Field: `confidence_map` ⚡
> **Informational only — NOT for ranking or prioritization**

### KT Engine Safety ⚡
| Rule | Status |
|------|--------|
| **cannot infer meaning** | ✅ |
| **cannot rewrite memory** | ✅ |
| **cannot synthesize opinions** | ✅ |
| **cannot generate narratives** | ✅ |
| **always exposes data lineage** | ✅ |
| **includes "visibility notice" when filtered** | ✅ |

---

## III) THREAD VISUALIZATION (XR + 2D) ⚡

### 4 Visualization Modes ⚡
| Mode | Description |
|------|-------------|
| `ribbon mode` | linear display ⚡ |
| `constellation mode` | multi-branch ⚡ |
| `timeline braid mode` | temporal weaving ⚡ |
| `sphere-orbit overlay` | **spheres orbiting** ⚡ |

### User Interactions ⚡
| Action | Description |
|--------|-------------|
| expand node | ⚡ |
| collapse cluster | ⚡ |
| pivot to replay | ⚡ |
| pivot to meeting room | ⚡ |
| **convert thread → PDF summary (read-only)** | ⚡ |

---

## IV) SEARCH HUB — NON-FINANCED INTELLIGENT SEARCH ⚡

### Purpose
> **Give user a Google-like experience WITHOUT commercial influence, WITHOUT user profiling, leveraging Knowledge Threads for deeper navigation.**

---

### 4 Search Hub Components ⚡

### 1) INTERNAL SEARCH ⚡
| Feature | Description |
|---------|-------------|
| searches Che-Nu memory | personal + collective |
| produces Knowledge Threads | ⚡ |
| **offers "thread browsing mode"** | ⚡ |

### 2) EXTERNAL NEUTRAL SEARCH SELECTOR ⚡
| Engine | Type |
|--------|------|
| DuckDuckGo | Privacy-focused |
| Brave | Privacy-focused |
| Kagi | Premium neutral |
| Google | Optional |
| Wikipedia | Knowledge base |
| **OpenAlex** | **Science/academic** |

> **User chooses manually OR lets system multi-query**

### 3) MULTI-SOURCE FUSION (SAFE) ⚡
| Property | Description |
|----------|-------------|
| retrieves top results from chosen engines | ⚡ |
| **no ranking manipulation** | ⚡ |
| merges only neutral metadata: title, snippet, URL | ⚡ |
| provides "source transparency" | ⚡ |

### 4) THREAD-TO-WEB CONNECTOR ⚡
| If User Opts In | Result |
|-----------------|--------|
| builds inter-sphere knowledge thread | ⚡ |
| extends it with external sources | ⚡ |
| **displays everything in constellation mode** | ⚡ |

---

### Search Hub JSON ⚡
```json
{
  "search_hub": {
    "query": "string",
    "internal_results": "thread",
    "external_sources": ["kagi", "ddg", "wiki"],
    "external_results": [],
    "fusion_mode": "union|intersection",
    "safety": {
      "tracking": false,
      "ads": false,
      "profiling": false
    }
  }
}
```

### Key Field: `safety` ⚡
```json
{
  "safety": {
    "tracking": false,
    "ads": false,
    "profiling": false
  }
}
```

---

### 3 Search Modes ⚡

| Mode | Description |
|------|-------------|
| **MODE 1 — INTERNAL ONLY** | Shows Knowledge Threads exclusively |
| **MODE 2 — EXTERNAL ONLY** | Meta-search, multi-engine fusion |
| **MODE 3 — COMBINED (default)** | Internal thread = backbone, external = peripheral nodes |

### Combined Mode Diagram ⚡
```
┌─────────────────────────────────────────────────────┐
│              COMBINED SEARCH MODE                    │
│                                                      │
│    ┌─────────────────────────────────────┐          │
│    │    INTERNAL THREAD (backbone)       │          │
│    │    ════════════════════════════     │          │
│    │         │         │         │       │          │
│    │         ▼         ▼         ▼       │          │
│    │    ┌─────┐   ┌─────┐   ┌─────┐     │          │
│    │    │ DDG │   │ Wiki│   │Kagi │     │          │
│    │    └─────┘   └─────┘   └─────┘     │          │
│    │    (peripheral external nodes)      │          │
│    └─────────────────────────────────────┘          │
└─────────────────────────────────────────────────────┘
```

---

### UX Rules ⚡
| Rule | Status |
|------|--------|
| **user always chooses engines** | ✅ |
| **no sponsored content** | ✅ |
| **no commercial influence** | ✅ |
| **explicit notice of external data** | ✅ |
| **external data NEVER enters Che-Nu memory unless user saves it** | ✅ |

---

## V) SAFETY OVERVIEW ⚡

### THIS SYSTEM CANNOT ⚡
| Forbidden | Status |
|-----------|--------|
| **shape beliefs** | ❌ |
| **derive intentions** | ❌ |
| **rank worldviews** | ❌ |
| **promote external sources** | ❌ |
| **suppress results** | ❌ |

### IT CAN ⚡
| Allowed | Status |
|---------|--------|
| **reveal structural connections** | ✅ |
| **unify personal + collective knowledge** | ✅ |
| **offer neutral pathways through complexity** | ✅ |

---

## VI) SEARCH HUB API ⚡

### Endpoints ⚡
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/search/internal` | Search internal threads |
| POST | `/search/external` | Multi-engine search |
| POST | `/search/combined` | Combined mode |
| GET | `/search/engines` | List available engines |
| POST | `/search/save-external` | **Save external to memory (opt-in)** |

---

**END — BOOKMARK: "KT + SEARCH FREEZE"**
