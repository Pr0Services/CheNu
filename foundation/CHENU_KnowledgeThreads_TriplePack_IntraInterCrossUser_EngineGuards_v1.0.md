# CHE·NU — KNOWLEDGE THREAD SYSTEM (TRIPLE PACK)
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-INTERPRETATIVE / TRACEABLE

---

## 0) PURPOSE OF KNOWLEDGE THREADS

> **Knowledge Threads = Neutral chains of linked facts**, woven from: collective memory entries, replays, artifacts, meetings, decisions, agent activity

### RULE
> **A Knowledge Thread NEVER infers meaning. It only LINKS, not INTERPRET.**

---

## 1) INTRA-SPHERE KNOWLEDGE THREAD ⚡

### Scope
Inside **ONE sphere only** (ex: Business).

### Use
Trace evolution of ideas, documents, decisions, projects **WITHOUT crossing sphere boundaries.**

### Intra Thread Node ⚡
| Field | Description |
|-------|-------------|
| `memory_entry_id` | ⚡ |
| `timestamp` | ⚡ |
| `sphere` | ⚡ |
| `type` | **event/artifact/decision/note** ⚡ |
| `origin` | **meeting_id/agent_id/user_id** ⚡ |
| `hash` | ⚡ |

### Intra Thread Link ⚡
| Field | Description |
|-------|-------------|
| `from` | node_id |
| `to` | node_id |
| `reason` | **"temporal\|referenced\|artifact\|continuity"** ⚡ |

### Intra Thread JSON ⚡

```json
{
  "intra_thread": {
    "sphere": "business",
    "nodes": [...],
    "links": [...],
    "integrity": "sha256"
  }
}
```

### Intra Rules ⚡
| Rule | Status |
|------|--------|
| **no cross-sphere info** | ✅ ⚡ |
| **no prioritization** | ✅ ⚡ |
| **chronological by default** | ✅ ⚡ |
| **neutral ordering** | ✅ ⚡ |
| **full traceability** | ✅ ⚡ |

---

## 2) INTER-SPHERE KNOWLEDGE THREAD ⚡

### Purpose
Link **FACTS between different spheres** without blending them.

### Example ⚡
> Business decision → Scholar research → Creative brainstorming  
> *(Three separate spheres, one factual chain.)*

### Inter-Sphere Node ⚡
Same as intra but includes:
| Field | Description |
|-------|-------------|
| `sphere_origin` | ⚡ |
| `sphere_target` | ⚡ |

### Inter-Sphere Link Reasons ⚡
| Reason | Description |
|--------|-------------|
| `shared_concept` | ⚡ |
| `shared_artifact` | ⚡ |
| `shared_participant` | ⚡ |
| `replay_reference` | ⚡ |
| `continuity_across_spheres` | ⚡ |

### Inter-Sphere Thread JSON ⚡

```json
{
  "inter_thread": {
    "nodes": [...],
    "links": [...],
    "spheres_involved": ["business", "scholar", "creative"],
    "hash": "sha256"
  }
}
```

### Inter Guards ⚡
| Forbidden | Status |
|-----------|--------|
| **no inference ("because", "therefore")** | ❌ ⚡ |
| **no optimization** | ❌ ⚡ |
| **no strategic recommendation** | ❌ ⚡ |
| **no sentiment shaping** | ❌ ⚡ |
| **only factual adjacency** | ✅ ⚡ |

---

## 3) CROSS-USER KNOWLEDGE THREAD (OPT-IN) ⚡

### Purpose
Let **MULTIPLE users voluntarily share** partial memory entries to create collective knowledge threads.

### RULE
> **Opt-in ONLY. No auto-sharing. No deducing identity.**

### Cross-User Node ⚡
| Field | Description |
|-------|-------------|
| `anonymized_user_id` | **(hash)** ⚡ |
| `shared_entry_id` | ⚡ |
| `sphere` | ⚡ |
| `timestamp` | ⚡ |
| `artifact_reference` | **(optional)** ⚡ |
| `replay_reference` | **(optional)** ⚡ |

### Cross-User Link Reasons ⚡
| Reason | Description |
|--------|-------------|
| `same topic` | ⚡ |
| `same artifact` | ⚡ |
| `same objective` | ⚡ |
| `same decision path` | ⚡ |

### NEVER ⚡
| Forbidden | Status |
|-----------|--------|
| **compare users** | ❌ ⚡ |
| **rank users** | ❌ ⚡ |
| **evaluate performance** | ❌ ⚡ |

### Cross-User Thread JSON ⚡

```json
{
  "cross_thread": {
    "participants": ["anon_user_A", "anon_user_B"],
    "nodes": [...],
    "links": [...],
    "visibility": "consent-only",
    "integrity_hash": "sha256"
  }
}
```

### Cross Fields ⚡
| Field | Description |
|-------|-------------|
| `participants` | **Array of anonymized IDs** ⚡ |
| `visibility` | **"consent-only"** ⚡ |

---

## 4) KNOWLEDGE THREAD ENGINE (UNIVERSAL) ⚡

### Engine Responsibilities ⚡
- build nodes from memory entries
- build links based on factual relationships
- verify hashes
- **prevent cross-sphere leakage** ⚡
- **never interpret meaning** ⚡
- **never summarize intent** ⚡
- **never compress narrative** ⚡

### Engine JSON Spec ⚡

```json
{
  "knowledge_thread_engine": {
    "build_intra": true,
    "build_inter": true,
    "build_cross_user": true,
    "guards": {
      "no_inference": true,
      "no_sentiment": true,
      "no_recommender": true,
      "audit_trail": true
    }
  }
}
```

### Engine Guards ⚡
| Guard | Value |
|-------|-------|
| `no_inference` | **true** ⚡ |
| `no_sentiment` | **true** ⚡ |
| `no_recommender` | **true** ⚡ |
| `audit_trail` | **true** ⚡ |

---

## 5) VISUALIZATION (2D / 3D / XR SAFE MODE) ⚡

### 2D ⚡
- horizontal braid
- nodes as circles
- links as straight lines

### 3D ⚡
- clusters by sphere
- **color-neutral tones** ⚡
- **no emotional color coding** ⚡

### XR ⚡
- floating memory nodes
- **thread lines with low opacity** ⚡
- **user-selectable only** ⚡
- **filter by sphere / participant / time** ⚡

---

## 6) EXPORT FORMATS ⚡

### PDF SUMMARY ⚡
| Content | Status |
|---------|--------|
| thread metadata | ✅ |
| spheres involved | ✅ |
| node timelines | ⚡ |
| **artifacts snapshots** | ⚡ |
| integrity hash | ✅ |

### JSON BUNDLE ⚡
| Content | Status |
|---------|--------|
| nodes[] | ✅ |
| links[] | ✅ |
| **audit[]** | ⚡ |
| hash | ✅ |

### XR PACK ⚡
| Content | Status |
|---------|--------|
| **neutral geometry** | ⚡ |
| **node anchors** | ⚡ |
| **timeline braids** | ⚡ |

---

## 7) ETHICAL GUARANTEES ⚡

| Guarantee | Status |
|-----------|--------|
| **No bias** | ✅ ⚡ |
| **No nudging** | ✅ ⚡ |
| **No predictive behavior** | ✅ ⚡ |
| **No interpretation of user intention** | ✅ ⚡ |
| **Facts only → Linked only → View only** | ✅ ⚡ |

---

**END — KNOWLEDGE THREAD SYSTEM (TRIPLE PACK)**
