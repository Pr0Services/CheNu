# CHE·NU — KNOWLEDGE THREAD SYSTEM (A + B + C)
**VERSION:** Cognition.v1.0  
**MODE:** FOUNDATION / NON-PERSUASIVE / TRACEABLE

---

## A) INTRA-SPHERE KNOWLEDGE THREADS

### Purpose
Reveal how concepts, meetings, artifacts, and decisions connect **INSIDE a single sphere** (Business, Scholar, XR…).

### RULE
> **Threads = STRUCTURAL RELATIONSHIPS. NEVER interpret or classify content emotionally.**

### Thread Types (Intra) ⚡
| Type | Description |
|------|-------------|
| `THREAD_EVENT_CHAIN` | **shows linked events across time** ⚡ |
| `THREAD_ARTIFACT_LINE` | **documents → notes → decisions** ⚡ |
| `THREAD_AGENT_FLOW` | **which agent contributed where** ⚡ |
| `THREAD_DECISION_PATH` | **how a decision evolved** ⚡ |

### Intra Model JSON (with edge types) ⚡

```json
{
  "intra_thread": {
    "sphere": "business|scholar|..",
    "nodes": ["event","artifact","decision","agent_action"],
    "edges": [
      { "from":"id", "to":"id", "type":"sequence|reference|produced_by" }
    ],
    "hash": "sha256"
  }
}
```

### Intra Fields ⚡
| Field | Description |
|-------|-------------|
| `nodes` | **["event","artifact","decision","agent_action"]** ⚡ |
| `edges[].type` | **sequence/reference/produced_by** ⚡ |

### Visualization ⚡
| Mode | Description |
|------|-------------|
| **lane view** | timeline lanes ⚡ |
| **radial view** | central topic → connected items ⚡ |
| **focus mode** | isolate 1 path ⚡ |

### NO: ⚡
- "importance" ranking
- "priority" suggestions

---

## B) CROSS-SPHERE KNOWLEDGE THREADS

### Purpose
Reveal how topics & artifacts cross boundaries between spheres **WITHOUT blending roles or meaning.**

### RULE
> **Cross-sphere links = FACTUAL CONNECTIONS. NOT synthesis.**

### Thread Types (Cross) ⚡
| Type | Description |
|------|-------------|
| `THREAD_TOPIC_SPAN` | **same topic in multiple spheres** ⚡ |
| `THREAD_ARTIFACT_MIGRATION` | **document created in one sphere used in another** ⚡ |
| `THREAD_CONTEXT_BRIDGE` | **XR meeting references Scholar concept** ⚡ |
| `THREAD_AGENT_MULTIROLE` | **agent action relevant to >1 sphere** ⚡ |

### Cross Model JSON (with anchors + reason) ⚡

```json
{
  "cross_thread": {
    "spheres": ["scholar","creative","business"],
    "anchors": [
      { "id":"uuid", "sphere":"scholar", "type":"artifact" },
      { "id":"uuid", "sphere":"creative", "type":"event" }
    ],
    "links": [
      { "from":"id", "to":"id", "reason":"shared_topic|artifact_reuse" }
    ],
    "hash": "sha256"
  }
}
```

### Cross Fields ⚡
| Field | Description |
|-------|-------------|
| `anchors` | **Array of {id, sphere, type}** ⚡ |
| `links[].reason` | **shared_topic/artifact_reuse** ⚡ |

### Visualization ⚡
| Mode | Description |
|------|-------------|
| **Orbit Bridges** | spheres as planets, threads as arcs ⚡ |
| **Category Strands** | colored strands by topic ⚡ |
| **Thread Heatmap** | **density without interpretation** ⚡ |

---

## C) MULTI-USER KNOWLEDGE THREADS (COLLECTIVE)

### Purpose
Display how **multiple users** contribute to the growth of shared knowledge **WITHOUT evaluating correctness.**

### RULE
> **Collective threads = GROUP STRUCTURE. NOT group psychology.**

### Thread Types (Collective) ⚡
| Type | Description |
|------|-------------|
| `THREAD_COLLAB_CHAIN` | **contributions from several users to same artifact** ⚡ |
| `THREAD_PERSPECTIVE_OVERLAY` | **multiple interpretations shown SIDE-BY-SIDE** ⚡ |
| `THREAD_SILENCE_MAP` | **which participants remained silent at each stage** ⚡ |
| `THREAD_EVOLUTION` | **how knowledge shifted over time across the collective** ⚡ |

### Collective Model JSON (with perspective_views) ⚡

```json
{
  "collective_thread": {
    "participants": ["userA","userB","agentX"],
    "nodes": [
      { "id":"uuid", "type":"artifact|event|decision", "author":"userA" }
    ],
    "edges": [
      { "from":"id", "to":"id", "type":"reply|update|reference" }
    ],
    "perspective_views": [
      { "user":"userA", "path":["id1","id3"] },
      { "user":"userB", "path":["id2","id4"] }
    ],
    "hash": "sha256"
  }
}
```

### Collective Fields ⚡
| Field | Description |
|-------|-------------|
| `nodes[].author` | **User attribution** ⚡ |
| `edges[].type` | **reply/update/reference** ⚡ |
| `perspective_views` | **Array of {user, path}** ⚡ |

### Visualization ⚡
| Mode | Description |
|------|-------------|
| **PARALLEL VIEW** | each user's thread in parallel lanes ⚡ |
| **THREAD MERGE** | only factual intersections appear ⚡ |
| **CONTRIBUTION MAP** | **nodes sized by count (NOT importance)** ⚡ |

---

## SHARED ETHICAL RULESET (A + B + C) ⚡

| Rule | Status |
|------|--------|
| No inference of intent | ✅ |
| No importance ranking | ✅ |
| No persuasion | ✅ |
| **No "suggested next step"** | ✅ ⚡ |
| Only structural clarity | ✅ |
| **All relationships must be traceable to stored data** | ✅ ⚡ |
| **Full transparency: "why this link exists" shown on hover** | ✅ ⚡ |
| **Cryptographic integrity (sha256) for immutability** | ✅ ⚡ |

---

## UNIVERSAL KNOWLEDGE THREAD JSON EXPORT ⚡

```json
{
  "knowledge_threads": {
    "intra": [...],
    "cross": [...],
    "collective": [...],
    "version": "1.0",
    "hash": "sha256",
    "timestamp": 1712345678
  }
}
```

---

## WHY THIS MATTERS

| Thread | Provides |
|--------|----------|
| **Intra-thread** | clarity INSIDE a domain |
| **Cross-thread** | clarity BETWEEN domains |
| **Collective-thread** | clarity AMONG people |

> **Truth = multi-structure. Not single interpretation.**

---

**END — KNOWLEDGE THREAD SYSTEM**
