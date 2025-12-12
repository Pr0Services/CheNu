# CHE·NU — KNOWLEDGE THREADS (3-LAYER SYSTEM)
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / BUILD-READY

---

## KNOWLEDGE THREADS — PURPOSE

Allow users and agents to navigate information across spheres, meetings, replays, documents, decisions, and collective memories **WITHOUT:** inference, persuasion, emotional shaping, narrative construction.

> **Knowledge Threads reveal CONNECTIONS, not conclusions.**

---

## 1) INTER-SPHERE KNOWLEDGE THREADS

### Purpose
Show how concepts, documents, decisions, or events connect **ACROSS different spheres** (Business ↔ Scholar ↔ Creative ↔ XR…) without interpreting or evaluating.

### Thread Object JSON ⚡

```json
{
  "thread_id": "uuid",
  "origin": "memory|meeting|replay|artifact",
  "anchors": [
    { "sphere": "business", "id": "..." },
    { "sphere": "scholar", "id": "..." },
    { "sphere": "creative", "id": "..." }
  ],
  "links": [
    { "from": "id", "to": "id", "type": "shared_topic" },
    { "from": "id", "to": "id", "type": "shared_agent" },
    { "from": "id", "to": "id", "type": "temporal_proximity" }
  ],
  "visibility": "per-user",
  "confidence": "0.0–1.0"
}
```

### Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `origin` | **memory/meeting/replay/artifact** ⚡ |
| `links[].type` | **shared_topic/shared_agent/temporal_proximity** ⚡ |
| `visibility` | **"per-user"** ⚡ |
| `confidence` | **0.0-1.0 float** ⚡ |

### Inter-Sphere Thread Rules ⚡
| Rule | Status |
|------|--------|
| **read-only** | ✅ ⚡ |
| **no weighting of importance** | ✅ ⚡ |
| **no predictive hints** | ✅ ⚡ |
| **no prioritization** | ✅ ⚡ |

### Allowed Visual Cues ⚡
| Cue | Meaning |
|-----|---------|
| **line color** | = sphere ⚡ |
| **line thickness** | = connection count ⚡ |
| **soft glow** | = active session relevance ⚡ |

---

## 2) PERSONAL INSIGHT WEAVING THREADS ⚡

### Purpose
Help users see how **their own** meetings, documents, tasks, interests, and artifacts interconnect over time.

> **This is NOT introspection, NOT psychological representation, NOT behavioral inference. It is structural mapping only.**

### Thread Model JSON ⚡

```json
{
  "personal_thread": {
    "user_id": "uuid",
    "nodes": [
      { "type": "meeting", "id": "..." },
      { "type": "artifact", "id": "..." },
      { "type": "decision", "id": "..." }
    ],
    "connections": [
      { "from": "id", "to": "id", "reason": "reference" }
    ],
    "timeline_alignment": true,
    "exportable": true
  }
}
```

### Personal Fields ⚡
| Field | Description |
|-------|-------------|
| `nodes[].type` | **meeting/artifact/decision** ⚡ |
| `connections[].reason` | **"reference"** ⚡ |
| `timeline_alignment` | **boolean** ⚡ |
| `exportable` | **boolean** ⚡ |

### Personal Insight Rules ⚡
| Rule | Status |
|------|--------|
| **user controls all visibility** | ✅ ⚡ |
| **all threads anonymizable** | ✅ ⚡ |
| **no prediction** | ✅ ⚡ |
| **no summarization of behavior** | ✅ ⚡ |
| **no "insight generation"** | ✅ ⚡ |

### Permitted ⚡
| Feature | Status |
|---------|--------|
| **timeline braiding** | ✅ ⚡ |
| **neutral grouping** | ✅ ⚡ |
| **topic frequency heatmap** | ✅ ⚡ |

---

## 3) COLLECTIVE KNOWLEDGE BRAIDS ⚡

### Purpose
Enable collaborative navigation of shared facts **WITHOUT collapsing them into a unified story.**

> **Collective = multi-user, multi-agent verified data.**

### Braid Structure JSON ⚡

```json
{
  "knowledge_braid": {
    "braid_id": "uuid",
    "threads": ["thread_id_1", "thread_id_2", "..."],
    "alignment": "temporal|topic|sphere",
    "hash": "sha256",
    "integrity": "verified"
  }
}
```

### Braid Fields ⚡
| Field | Description |
|-------|-------------|
| `alignment` | **temporal/topic/sphere** ⚡ |
| `integrity` | **"verified"** ⚡ |

### Braiding Rules ⚡
| Rule | Status |
|------|--------|
| **uses only validated memory entries** | ✅ ⚡ |
| **no inferred relations** | ✅ ⚡ |
| **braids can be forked (user creates alternative grouping)** | ✅ ⚡ |
| **braids do NOT merge personal and collective memory** | ✅ ⚡ |
| **braids are exportable** | ✅ ⚡ |

### Visualization (2D/3D/XR) ⚡
| Feature | Status |
|---------|--------|
| **multiple threads curve toward each other** | ⚡ |
| **intersections = shared artifacts or decisions** | ⚡ |
| **no dominant path** | ✅ |
| **no "spine narrative"** | ✅ ⚡ |
| **silent inspection mode available** | ⚡ |

---

## AGENT ROLES (STRICT-SEPARATION) ⚡

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | **constructs links, never interprets** ⚡ |
| `AGENT_THREAD_GUARD` | **validates neutrality, prevents narrative shaping** ⚡ |
| `AGENT_THREAD_EXPLAINER` | **translates connection reasons: "A links to B because they share X"** ⚡ |
| `AGENT_COLLECTIVE_BRAIDER` | **assembles braids from validated threads** ⚡ |

### None Can ⚡
- assign importance
- rank threads
- **recommend pathways** ⚡

---

## ETHICAL SAFETY & ACCESSIBILITY ⚡

| Feature | Status |
|---------|--------|
| **colorblind-safe palettes** | ✅ ⚡ |
| **readable labels** | ✅ |
| **no movement unless user-initiated** | ✅ ⚡ |
| **no bias reinforcement** | ✅ ⚡ |
| **reversible layouts** | ✅ ⚡ |
| **export to PDF, JSON, XR-bundle** | ✅ ⚡ |

---

**END — KNOWLEDGE THREADS SYSTEM FREEZE**
