# CHE·NU — KNOWLEDGE THREADS (3-TIER SYSTEM)
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / FREEZE-READY

---

## OVERVIEW

> **Knowledge Threads = connections between pieces of information,** across spheres, meetings, replays, agents, and timelines.

### RULE
> **Threads REVEAL relationships.**  
> **They NEVER interpret, predict, persuade, or rank.**

### Threads DO
- show linkage
- reveal structure
- expose dependencies
- provide navigation

### Threads DO NOT
- infer meaning
- rewrite memory
- suggest conclusions
- create narratives

---

## 1) INTER-SPHERE KNOWLEDGE THREADS

### Purpose
Link concepts, decisions, artifacts, and events **ACROSS different spheres** (Business ↔ Scholar ↔ Creative ↔ Social ↔ Institution ↔ Methodology ↔ XR)

### Thread Types (6) ⚡
| Type | Description |
|------|-------------|
| `shared_artifact` | Same artifact across spheres |
| `shared_topic` | Same topic discussed |
| `decision_dependency` | Decision depends on another |
| `timeline_overlap` | Same time period |
| `agent_involvement` | Same agent participated |
| `cross-sphere reference` | Direct reference |

### Thread Properties
| Property | Value |
|----------|-------|
| non-directional | ✅ |
| non-prioritized | ✅ |
| reversible | ✅ |
| **visible on demand only** | ✅ ⚡ |

### JSON Model

```json
{
  "inter_sphere_thread": {
    "id": "uuid",
    "nodes": ["object_id_A", "object_id_B"],
    "spheres": ["business","scholar"],
    "reason": "shared_artifact|timeline_overlap|agent",
    "created_at": "...",
    "hash": "sha256"
  }
}
```

### Use Cases
- Show how a research note (Scholar) influenced a project doc (Business)
- Link an XR replay to a Social/Media decision
- Connect Creative prototype to Institution compliance requirements

### Safety
- cannot expose hidden data
- no emotional metadata
- no predictive leaps

---

## 2) PERSONAL KNOWLEDGE THREADS

### Purpose
A personal "web of understanding," reflecting how a single user connects concepts, files, decisions, meetings, across all spheres.

### NOTES
- belongs to the user only
- private by default
- **not visible to agents unless explicitly shared**

### Thread Types (4) ⚡
| Type | Description |
|------|-------------|
| `bookmark thread` | Saved items |
| `personal reference thread` | User references |
| `user-defined tag thread` | Custom tags |
| `memory linkage thread` | Memory connections |

### Thread Rules
| Rule | Status |
|------|--------|
| fully user-created or user-approved | ✅ |
| no suggestion from AI unless explicitly requested | ✅ |
| **never influences global structure** | ✅ ⚡ |

### JSON Model (with context_note) ⚡

```json
{
  "personal_thread": {
    "user_id": "uuid",
    "items": ["id1","id2","id3"],
    "context_note": "optional",
    "visibility": "private|shared_specific",
    "version": 1
  }
}
```

### Use Cases
- user collects all docs relevant to a goal
- user creates timeline thread for long-term project
- user maps meetings + decisions to understand their path

### Safety
- cannot be used for profiling
- cannot affect system routing
- **user can erase at any time**

---

## 3) COLLECTIVE KNOWLEDGE THREADS

### Purpose
A global map of how the system's validated memories connect, **WITHOUT tying anything to individuals unless anonymized.**

### Thread Types (4) ⚡
| Type | Description |
|------|-------------|
| `collective_decision_flow` | How decisions evolved |
| `artifact lineage` | Artifact history |
| `replay reference chain` | Replay connections |
| `sphere-to-sphere dependency` | Cross-sphere deps |

### Collective Thread Rules
| Rule | Status |
|------|--------|
| derived ONLY from validated collective memory | ✅ |
| immutable after creation | ✅ |
| cryptographically signed | ✅ |
| never predictive or interpretative | ✅ |
| **must not include private data** | ✅ ⚡ |

### JSON Model (with sphere_spanning) ⚡

```json
{
  "collective_thread": {
    "id": "uuid",
    "origin": "collective_memory_entry_id",
    "links": [
      { "from": "idA", "to": "idB", "type": "decision_dependency" }
    ],
    "sphere_spanning": ["business","institution","xr"],
    "integrity": "verified"
  }
}
```

### Use Cases
- global understanding of how a decision evolved
- reveal dependencies across spheres (institution ↔ business)
- display lineage of documents in a non-biased way
- XR replay network visualization

---

## THREAD VISUALIZATION (UNIVERSAL) ⚡

### For All 3 Thread Types
| Property | Value |
|----------|-------|
| Line style | **neutral lines (no arrows)** ⚡ |
| Color | per sphere |
| Thickness | **= type importance (not value)** ⚡ |
| Direction cues | **none** |
| Emotional signals | **none** |

### Thread Interaction
| Action | Description |
|--------|-------------|
| expand/collapse | Show/hide detail |
| isolate thread | Focus view |
| see source replay | Jump to XR |
| see linked artifacts | Browse items |
| export PDF or JSON | Save formats |

---

## THREAD SAFETY GUARANTEES

| Guarantee | Status |
|-----------|--------|
| no influence weight | ✅ |
| no path suggestion | ✅ |
| no psychological inferences | ✅ |
| no ranking of choices | ✅ |
| no narrative construction | ✅ |
| **all threads reversible, transparent, and auditable** | ✅ |

---

## AGENTS INVOLVED

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | Constructs threads, **no interpretation** |
| `AGENT_THREAD_EXPLAINER` | Describes linkage reasons, **does not suggest meaning** |
| `AGENT_THREAD_GUARD` | Ensures privacy, enforces ethical limits, **checks for manipulation patterns** |

---

**END — THREADS FREEZE READY**
