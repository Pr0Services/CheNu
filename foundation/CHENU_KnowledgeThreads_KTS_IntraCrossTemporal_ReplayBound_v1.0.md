# CHE·NU — KNOWLEDGE THREAD SYSTEM (KTS)
**VERSION:** KTS.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / BUILD-READY

---

## OVERVIEW

> **Knowledge Threads (KT) = neutral, factual, trace-linked connections** between pieces of information, meetings, decisions, artifacts, and sphere content.

### RULE
> **Threads do NOT infer, judge, predict, or conclude. They ONLY reveal factual relationships.**

### Three Types ⚡
| # | Type |
|---|------|
| 1 | Intra-Sphere Threads |
| 2 | Cross-Sphere Threads |
| 3 | Temporal Replay Threads |

---

## 1) INTRA-SPHERE KNOWLEDGE THREADS

### Purpose
Connect knowledge **inside a single sphere** (business, scholar, creative, etc.) to show continuity, dependencies, and shared artifacts.

### Thread Sources ⚡
- meetings inside the sphere
- documents, notes, visuals
- decisions & tasks
- **agent actions** ⚡

### Thread Types ⚡
| Type | Description |
|------|-------------|
| `reference_thread` | **A references B** ⚡ |
| `dependency_thread` | **A requires B** ⚡ |
| `update_thread` | **A overwrites or extends B** ⚡ |
| `sibling_thread` | **A & B share topic/goal** ⚡ |

### Thread Rules ⚡
| Rule | Status |
|------|--------|
| **NEVER reorder meaning** | ✅ ⚡ |
| **NEVER summarize content automatically** | ✅ ⚡ |
| **only surface relationships that EXIST in data** | ✅ ⚡ |

### Intra-Sphere Model JSON ⚡

```json
{
  "intra_threads": [
    {
      "from": "artifact_id",
      "to": "artifact_id",
      "type": "reference|dependency|update|sibling",
      "sphere": "business|scholar|...",
      "timestamp": 1712345678
    }
  ]
}
```

### Result ⚡
> **User gains clarity of structure WITHOUT influence or narrative shaping.**

---

## 2) CROSS-SPHERE KNOWLEDGE THREADS

### Purpose
Reveal factual bridges between spheres **WITHOUT merging them or influencing workflows.**

### Allowed Connections ⚡
| Connection | Description |
|------------|-------------|
| **same topic identified across spheres** | ⚡ |
| **shared artifacts** | (e.g., a study in Scholar used in Business) ⚡ |
| **meetings with overlapping participants** | ⚡ |
| **agents operating in dual spheres** | ⚡ |

### NOT Allowed ⚡
| Forbidden | Status |
|-----------|--------|
| **inferring meaning from similarity** | ❌ ⚡ |
| **implying causality** | ❌ ⚡ |
| **cross-sphere prioritization** | ❌ ⚡ |

### Thread Types ⚡
| Type | Description |
|------|-------------|
| `topic_bridge` | ⚡ |
| `artifact_bridge` | ⚡ |
| `participant_bridge` | ⚡ |
| `agent_bridge` | ⚡ |

### Cross-Sphere Model JSON ⚡

```json
{
  "cross_threads": [
    {
      "from_sphere": "scholar",
      "to_sphere": "business",
      "reason": "artifact_bridge",
      "object_id": "artifact_id",
      "hash": "sha256"
    }
  ]
}
```

### Cross-Sphere Fields ⚡
| Field | Description |
|-------|-------------|
| `reason` | **topic_bridge/artifact_bridge/participant_bridge/agent_bridge** ⚡ |
| `object_id` | **artifact_id** ⚡ |

### Result ⚡
> **A "web of reality" emerges, but each sphere keeps its identity and boundaries.**

---

## 3) TEMPORAL KNOWLEDGE THREADS (REPLAY-BOUND) ⚡

### Purpose
Connect events, decisions, and artifacts **across TIME.**

### This Forms ⚡
- **timelines of knowledge creation** ⚡
- **chain-of-custody of ideas** ⚡
- **evolution of decisions** ⚡

### Temporal Thread Types ⚡
| Type | Description |
|------|-------------|
| `predecessor_thread` | ⚡ |
| `successor_thread` | ⚡ |
| `replay_link` | ⚡ |
| `silence_interval_link` | ⚡ |
| `decision_evolution_link` | ⚡ |

### Temporal Model JSON (with time_delta) ⚡

```json
{
  "temporal_threads": [
    {
      "event_a": "uuid",
      "event_b": "uuid",
      "relation": "predecessor|successor|evolution|silence",
      "source_replay": "uuid",
      "time_delta": 42.6
    }
  ]
}
```

### Temporal Fields ⚡
| Field | Description |
|-------|-------------|
| `relation` | **predecessor/successor/evolution/silence** ⚡ |
| `source_replay` | **UUID of replay** ⚡ |
| `time_delta` | **Float seconds** ⚡ |

### Rules ⚡
| Rule | Status |
|------|--------|
| **Replay defines the truth** | ✅ ⚡ |
| **Threads follow chronological order** | ✅ ⚡ |
| **No prediction, no extrapolation** | ✅ ⚡ |

### Result ⚡
> **Users can trace how knowledge evolved with absolute neutrality.**

---

## KNOWLEDGE THREAD ENGINE — SAFETY ⚡

| Guarantee | Status |
|-----------|--------|
| **All threads are EXPLICIT links, not inferred meaning** | ✅ ⚡ |
| **All edges must be backed by a data source** | ✅ ⚡ |
| **No "equal", "better", "more relevant"** | ✅ ⚡ |
| **Only FACTUAL adjacency** | ✅ ⚡ |

---

**END — KNOWLEDGE THREAD SYSTEM**
