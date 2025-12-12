# CHE·NU — KNOWLEDGE THREADS + KNOWLEDGE SEARCH ENGINE
**VERSION:** CORE.KNOW.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / MULTI-SPHERE

---

## 0) CORE PRINCIPLES ⚡

> **Knowledge = neutral factual connections. Threads = navigable networks. Search Engine = retrieval, NOT inference.**

### NO ⚡
| Forbidden | Status |
|-----------|--------|
| emotional inference | ❌ ⚡ |
| narrative shaping | ❌ ⚡ |
| persuasion | ❌ ⚡ |
| **hidden prioritization** | ❌ ⚡ |

### YES ⚡
| Allowed | Status |
|---------|--------|
| transparency | ✅ ⚡ |
| verifiable links | ✅ ⚡ |
| sphere alignment | ✅ ⚡ |
| **multi-agent compatibility** | ✅ ⚡ |

---

## 1) KNOWLEDGE THREAD: INDIVIDUAL THREAD ⚡

### Purpose
Organize all factual knowledge relevant to **ONE USER** across all spheres (Personnel → XR).

### Thread Anchors ⚡
| Anchor | Description |
|--------|-------------|
| user projects | ⚡ |
| goals | ⚡ |
| meetings | ⚡ |
| artifacts | ⚡ |
| decisions | ⚡ |
| **memories** | ⚡ |

### Thread Edges ⚡
| Edge | Description |
|------|-------------|
| `depends_on` | ⚡ |
| `references` | ⚡ |
| `derived_from` | ⚡ |
| `continued_by` | ⚡ |

### Individual Thread JSON ⚡
```json
{
  "individual_thread": {
    "user": "uuid",
    "nodes": ["..."],
    "edges": ["..."],
    "version": "1.0"
  }
}
```

### Rules ⚡
| Rule | Status |
|------|--------|
| **private by default** | ✅ ⚡ |
| **never influences suggestions** | ✅ ⚡ |
| **searchable via neutral filters only** | ✅ ⚡ |
| **full export available** | ✅ ⚡ |

---

## 2) KNOWLEDGE THREAD: TEAM / COLLECTIVE THREAD ⚡

### Purpose
Organize shared team knowledge **WITHOUT revealing private memories or non-shared data.**

### Sources ⚡
| Source | Description |
|--------|-------------|
| shared projects | ⚡ |
| shared meetings | ⚡ |
| public artifacts | ⚡ |
| collective decisions | ⚡ |
| **XR replay summaries (public only)** | ⚡ |

### Thread Layers ⚡
| Layer | Description |
|-------|-------------|
| factual events | ⚡ |
| decisions | ⚡ |
| referenced documents | ⚡ |
| **cross-sphere impact** | ⚡ |

### Access ⚡
| Rule | Status |
|------|--------|
| **per-role permissions** | ✅ ⚡ |
| **no privileged inference** | ✅ ⚡ |
| **all links explainable** | ✅ ⚡ |

### Collective Thread JSON ⚡
```json
{
  "collective_thread": {
    "team": "team_id",
    "nodes": ["..."],
    "edges": ["..."],
    "visibility": "role_based"
  }
}
```

---

## 3) KNOWLEDGE THREAD: UNIVERSAL THREAD ⚡

### Purpose
Map all **non-private, non-identifiable, cross-sphere knowledge** in one global navigable graph.

### Nodes ⚡
| Node | Description |
|------|-------------|
| spheres | ⚡ |
| categories | ⚡ |
| topics | ⚡ |
| public tools | ⚡ |
| **definitions** | ⚡ |

### Edges ⚡
| Edge | Description |
|------|-------------|
| `conceptual_link` | ⚡ |
| `sphere_dependency` | ⚡ |
| `historical_relation` | ⚡ |
| `method_relation` | ⚡ |

### Constraints ⚡
| Rule | Status |
|------|--------|
| **no user data** | ✅ ⚡ |
| **no team data** | ✅ ⚡ |
| **no replay data** | ✅ ⚡ |
| **no weighting or ranking** | ✅ ⚡ |

### Universal Thread JSON ⚡
```json
{
  "universal_thread": {
    "global_nodes": ["..."],
    "global_edges": ["..."],
    "integrity_hash": "sha256"
  }
}
```

---

## 4) KNOWLEDGE SEARCH ENGINE ⚡ (NOUVEAU!)

### Purpose
Provide multi-sphere, factual search across ALL thread types, with **full transparency.**

### NO ⚡
| Forbidden | Status |
|-----------|--------|
| **synthesis bias** | ❌ ⚡ |
| **pseudo-authority answers** | ❌ ⚡ |
| **filling missing logic** | ❌ ⚡ |
| **hallucination** | ❌ ⚡ |

### YES ⚡
| Allowed | Status |
|---------|--------|
| retrieval | ✅ ⚡ |
| citations | ✅ ⚡ |
| **neutral scoring (no persuasion)** | ✅ ⚡ |
| **cross-thread merging** | ✅ ⚡ |

### 4-STEP SEARCH PIPELINE ⚡ (NOUVEAU!)

| Step | Description |
|------|-------------|
| **STEP 1 — Query Classification** | identify sphere(s), detect intent: factual / artifact / replay / thread ⚡ |
| **STEP 2 — Safe Retrieval** | Individual Thread (if allowed), Collective Thread (shared only), Universal Thread (public only) ⚡ |
| **STEP 3 — Thread Merge** | combined factual JSON with source, timestamp, link type, **confidence = retrieval match score (NOT correctness)** ⚡ |
| **STEP 4 — Neutral Presentation** | bulleted facts, source IDs, **no conclusions** ⚡ |

### Search Query JSON ⚡
```json
{
  "query": "string",
  "scope": "individual|collective|universal|auto",
  "filters": ["sphere", "topic", "date"],
  "include_replays": false
}
```

### Search Result JSON ⚡
```json
{
  "results": [
    {
      "node": "id",
      "thread_type": "individual|collective|universal",
      "snippet": "...",
      "sources": ["id1", "id2"],
      "confidence": "0.0-1.0"
    }
  ],
  "explanation": "retrieval-only"
}
```

### Key Field: `confidence` ⚡ (NOUVEAU!)
> **0.0-1.0 — retrieval match score (NOT correctness)**

---

## 4 SEARCH AGENTS ⚡ (NOUVEAU!)

| Agent | Role |
|-------|------|
| `AGENT_KNOWLEDGE_RETRIEVER` | **performs safe retrieval only, no rewriting** ⚡ |
| `AGENT_THREAD_MERGER` | merges nodes from different threads, **ensures no mixing of private/public data** ⚡ |
| `AGENT_SEARCH_EXPLAINER` | **explains why these results appear, mandatory transparency** ⚡ |
| `AGENT_PRIVACY_GUARD` | **removes private nodes, blocks forbidden cross-thread joins, enforces full traceability** ⚡ |

---

## 5) INTER-SPHERE THREAD LINKING RULES ⚡

### Allowed Thread Links ⚡
| Link | Status |
|------|--------|
| factual dependencies | ✅ ⚡ |
| document references | ✅ ⚡ |
| process relationships | ✅ ⚡ |
| **chronological sequences** | ✅ ⚡ |

### Forbidden Links ⚡
| Link | Status |
|------|--------|
| **emotional state** | ❌ ⚡ |
| **intent deduction** | ❌ ⚡ |
| **psychological inference** | ❌ ⚡ |
| **user profiling** | ❌ ⚡ |
| **ranking or persuasion** | ❌ ⚡ |

---

## 6) VISUALIZATION MODES ⚡

| Mode | Description |
|------|-------------|
| **THREAD VIEW (2D)** | node graph, color per sphere, **line thickness = frequency** ⚡ |
| **XR THREAD VIEW (3D)** | threads float, orbit by relevance, selectable nodes → facts panel, **no motion effects** ⚡ |
| **TEXT MODE** | linearized thread, **citation-only** ⚡ |

---

## 7) WHY THREADS + SEARCH ENGINE ⚡

| Component | Gives |
|-----------|-------|
| **Threads** | structure, neutrality, traceability ⚡ |
| **Search Engine** | access, transparency, safety ⚡ |

### Together ⚡
- **Knowledge without bias**
- **Navigation without influence**
- **Truth without interpretation**

---

**END — FREEZE READY**
