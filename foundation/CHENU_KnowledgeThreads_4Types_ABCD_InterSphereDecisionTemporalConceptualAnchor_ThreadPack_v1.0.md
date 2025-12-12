# CHE·NU — KNOWLEDGE THREAD PACK (4 THREAD TYPES)
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / TRACEABLE

---

## OVERVIEW

> **Knowledge Threads = FILS DE CONNEXION entre:** sphères, mémoires, décisions, artefacts, timelines, concepts

### BUT ⚡
| Rule | Status |
|------|--------|
| **NEVER interpret** | ✅ ⚡ |
| **NEVER infer intent** | ✅ ⚡ |
| **NEVER generate conclusions** | ✅ ⚡ |
| **ONLY link facts with factual adjacency** | ✅ ⚡ |

### 4 Thread Types ⚡
| Type | Name |
|------|------|
| **A** | Inter-Sphere Knowledge Threads ⚡ |
| **B** | Decision Threads (Multi-Path) ⚡ |
| **C** | Temporal Continuity Threads ⚡ |
| **D** | **Conceptual Anchor Threads** ⚡ |

---

## THREAD_TYPE_A — INTER-SPHERE KNOWLEDGE THREADS ⚡

### Purpose
Link information across spheres **without merging identity.**

### RULE
> **No cross-sphere rewriting, only cross-sphere pointing.**

### Mechanisms ⚡
| Mechanism | Description |
|-----------|-------------|
| `artifact_reference` | ⚡ |
| `event_reference` | ⚡ |
| `replay_reference` | ⚡ |
| `topic_similarity` | **(non-ML; keyword-based only)** ⚡ |
| `shared_participants (optional)` | ⚡ |

### Inter-Sphere JSON ⚡

```json
{
  "thread_inter_sphere": {
    "id": "uuid",
    "from": { "sphere": "scholar", "entity_id": "uuid" },
    "to": { "sphere": "business", "entity_id": "uuid" },
    "relation": "referenced_by|uses|contextual_to",
    "hash": "sha256",
    "verified": true
  }
}
```

### UI ⚡
- dotted line across orbits in Universe View
- **transparency: user sees EXACT source + destination**

### Safety ⚡
- **no automatic linking (manual or explicit trigger)**
- user can disable cross-sphere threads

---

## THREAD_TYPE_B — DECISION THREADS (MULTI-PATH) ⚡

### Purpose
Represent **branching decision paths** WITHOUT ranking, bias, or narratives.

### Allows ⚡
| What | Description |
|------|-------------|
| What was decided? | ⚡ |
| **What could have been decided?** | ⚡ |
| What sequence was followed? | ⚡ |
| **What sequence exists in other replays?** | ⚡ |

### Data Does NOT Include ⚡
| Forbidden | Status |
|-----------|--------|
| success/failure | ❌ ⚡ |
| satisfaction scoring | ❌ ⚡ |
| **persuasion metadata** | ❌ ⚡ |

### Decision Thread JSON ⚡

```json
{
  "decision_thread": {
    "thread_id": "uuid",
    "nodes": [
      { "decision_id": "uuid", "timestamp": "...", "replay_id": "uuid" }
    ],
    "branches": [
      {
        "branch_id": "uuid",
        "path": ["decision_id", "decision_id", "..."]
      }
    ]
  }
}
```

### Key Field: `branches` ⚡ (NOUVEAU!)
> **Array of alternative decision paths**

### UI ⚡
- braided timeline
- **never highlights "optimal" paths**

---

## THREAD_TYPE_C — TEMPORAL CONTINUITY THREADS ⚡

### Purpose
Link events, meetings, artifacts and replays over time, **WITHOUT interpretation of "evolution" or "progress".**

### RULE
> **Time = chronology, nothing else.**

### Use Cases ⚡
| Use Case | Description |
|----------|-------------|
| follow the same topic over weeks | ⚡ |
| follow team sessions chronologically | ⚡ |
| compare sequences of meetings | ⚡ |
| **show silent gaps (periods of no events)** | ⚡ |

### Temporal Thread JSON ⚡

```json
{
  "temporal_thread": {
    "topic": "string",
    "events": [
      { "timestamp": 1712345678, "entity_id": "uuid", "sphere": "..." }
    ],
    "gaps": [
      { "from": "...", "to": "..." }
    ]
  }
}
```

### Key Field: `gaps` ⚡ (NOUVEAU!)
> **Array of silent periods with no events**

### UI ⚡
- time rail connecting meetings
- optional XR continuity lines

### Safety ⚡
| Forbidden | Status |
|-----------|--------|
| **no "progress bars"** | ✅ ⚡ |
| **no judgment of speed or productivity** | ✅ ⚡ |

---

## THREAD_TYPE_D — CONCEPTUAL ANCHOR THREADS ⚡ (NOUVEAU!)

### Purpose
Anchor recurring ideas, concepts, or categories, **WITHOUT sentiment, weighting, or semantic interpretation.**

> **Anchor = simple tag + trace.**

### Examples of Anchors ⚡
| Anchor | Description |
|--------|-------------|
| "onboarding" | ⚡ |
| "budget" | ⚡ |
| "research note" | ⚡ |
| "design idea" | ⚡ |
| "data source" | ⚡ |

### NOT ALLOWED ⚡
| Forbidden | Status |
|-----------|--------|
| **sentiment analysis** | ❌ ⚡ |
| **topic modeling** | ❌ ⚡ |
| **clustering by inference** | ❌ ⚡ |

### Conceptual Anchor JSON ⚡

```json
{
  "concept_anchor_thread": {
    "anchor": "string",
    "linked_entities": [
      { "entity": "note", "id": "uuid" },
      { "entity": "replay", "id": "uuid" },
      { "entity": "artifact", "id": "uuid" }
    ],
    "hash": "sha256"
  }
}
```

### UI ⚡
- concept tabs
- optional anchor color coding
- **3D XR anchor stones / plaques (non-verbal decor)** ⚡

---

## THREAD GOVERNANCE (APPLIES TO ALL 4) ⚡

| Rule | Status |
|------|--------|
| **append-only** | ✅ ⚡ |
| **all threads are reversible (soft delete)** | ✅ ⚡ |
| **must display source + destination** | ✅ ⚡ |
| **must support per-user visibility** | ✅ ⚡ |
| **exportable as zipped .threadpack** | ✅ ⚡ |
| **hash validation (sha256)** | ✅ ⚡ |
| **replay traceability mandatory** | ✅ ⚡ |

---

## AGENTS INVOLVED ⚡

| Agent | Role |
|-------|------|
| `AGENT_THREAD_LINKER` | creates links on explicit request, **no autonomous linking** ⚡ |
| `AGENT_THREAD_GUARD` | ensures no narrative shaping, **checks for prohibited patterns**, maintains audit log ⚡ |
| `AGENT_THREAD_EXPLAINER` | displays purpose & trace to user, **pure explanation, no recommendations** ⚡ |

---

## THREADPACK EXPORT ⚡

```json
{
  "threadpack": {
    "version": "kt1.0",
    "threads": ["..."],
    "hash": "sha256",
    "export_date": "..."
  }
}
```

---

**END — CHE·NU KNOWLEDGE THREADS v1.0**
