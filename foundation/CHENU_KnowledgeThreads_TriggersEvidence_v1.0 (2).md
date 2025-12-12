# CHE·NU — KNOWLEDGE THREADS (TRIGGERS + EVIDENCE)
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / BUILD-READY

---

## PURPOSE

> Create structured, factual "threads" linking related information across spheres, users, agents, meetings, and artifacts — **WITHOUT inference, bias, ranking, or narrative shaping.**

> **Threads = order + structure, NOT interpretation.**

---

## 1) INTER-SPHERE KNOWLEDGE THREADS

### Scope
Connect related knowledge across Che·Nu's spheres (Business, Scholar, Creative, Social, Institution, XR, etc.) based **ONLY on structural relationships.**

### RULE
> **NEVER infer meaning.**  
> **NEVER merge information across spheres without explicit link.**

### Thread Triggers ⚡

| Trigger | Description |
|---------|-------------|
| Shared topic tags | Same tags across spheres |
| Shared artifacts | Same artifact referenced |
| Shared decision points | Same decision involved |
| Shared agents | Same agent participated |
| Adjacent sphere categories | Related domains |

### Thread Structure

```
THREAD_INTERSPHERE
- thread_id
- spheres_involved: ["business", "scholar", ...]
- anchors: meeting_ids / replay_ids / documents
- links: { source → target }
- timeline: ordered timestamps
- hash: integrity verification
```

### JSON Model

```json
{
  "knowledge_thread_intersphere": {
    "id": "uuid",
    "spheres": ["business","scholar"],
    "anchors": ["meeting_01","doc_77"],
    "links": [
      { "from": "meeting_01", "to": "doc_77", "reason": "shared_topic" }
    ],
    "timeline": [],
    "hash": "sha256"
  }
}
```

### Visualization (Universe View)
- thin connecting lines between nodes
- color-coded per sphere
- no prioritization
- **user-activated only**

---

## 2) PERSONAL KNOWLEDGE THREADS

### Purpose
Help users remember their OWN cross-context reasoning, **without suggesting improvements or interpretations.**

### RULE
> **Personal ≠ Private Memory**  
> **Personal = user-curated knowledge structure.**

### Personal Thread Content
- user-selected anchors
- personal notes
- meeting references
- artifacts bookmarked
- replay segments

### JSON Model (with notes + hash) ⚡

```json
{
  "knowledge_thread_personal": {
    "id": "uuid",
    "user_id": "uuid",
    "anchors": ["meeting_09","my_note_22"],
    "notes": [
      { "t": 1712345678, "text": "my summary", "hash": "sha256..." }
    ],
    "links": [
      { "from": "doc_a", "to": "replay_b", "reason": "user_defined" }
    ]
  }
}
```

### Personal Notes Fields ⚡
| Field | Description |
|-------|-------------|
| `t` | Timestamp |
| `text` | User's note content |
| `hash` | Integrity verification |

### Link Reasons ⚡
| Reason | Description |
|--------|-------------|
| `user_defined` | User manually created link |

### Safety
| Rule | Status |
|------|--------|
| user controls visibility | ✅ |
| no AI rewriting | ✅ |
| no emotional metadata | ✅ |
| exportable for backup | ✅ |

---

## 3) COLLECTIVE KNOWLEDGE THREADS

### Purpose
Combine verified Collective Memory and XR replays into factual, multi-source, cross-team knowledge structures.

### RULE
> **Collective Knowledge Thread = Verified connections only.**

### Collective Thread Sources
- Collective Memory entries
- XR Replay validated frames
- Decision logs
- Sphere-wide events

### Thread Types (4) ⚡

| Type | Name | Description |
|------|------|-------------|
| **TYPE_A** | Decision Evolution Thread | How decisions evolved |
| **TYPE_B** | Multi-team Alignment Thread | Cross-team coordination |
| **TYPE_C** | Artifact Lineage Thread | Artifact history |
| **TYPE_D** | Sphere Topic Thread | Topic across sphere |

### JSON Model (with evidence) ⚡

```json
{
  "knowledge_thread_collective": {
    "id": "uuid",
    "sources": ["collective_memory_id", "replay_id"],
    "anchors": ["decision_08","artifact_44"],
    "verified_links": [
      { "from": "artifact_44", "to": "decision_08", "evidence": "timestamp_match" }
    ],
    "timeline": [],
    "hash": "sha256"
  }
}
```

### Evidence Types ⚡
| Evidence | Description |
|----------|-------------|
| `timestamp_match` | Same time |
| `reference_explicit` | Direct citation |
| `participant_overlap` | Same people involved |
| `artifact_shared` | Same artifact used |

### Thread Integrity Guarantees
| Guarantee | Status |
|-----------|--------|
| all links require evidence | ✅ |
| all nodes traceable to origin | ✅ |
| no interpretation allowed | ✅ |
| cryptographic signatures enforced | ✅ |

---

## AGENTS INVOLVED (ALL THREAD TYPES)

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | Constructs thread structure, **no summarization, no inference** |
| `AGENT_THREAD_VALIDATOR` | Checks evidence for each link, **rejects ambiguous links** |
| `AGENT_THREAD_RENDERER` | Visualizes in Universe View, 2D + XR line mapping |
| `AGENT_THREAD_GUARD` | Ensures threads remain **factual only** |

---

## WHY KNOWLEDGE THREADS MATTER

They create:
- **structure without bias**
- **continuity without interpretation**
- **clarity without persuasion**
- **shared truth without shared opinion**

---

**END — FOUNDATION FREEZE READY**
