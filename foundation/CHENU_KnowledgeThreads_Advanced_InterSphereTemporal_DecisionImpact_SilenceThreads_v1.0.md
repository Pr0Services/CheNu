# CHE·NU — ADVANCED KNOWLEDGE THREADS SYSTEM
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / TRACEABLE / FREEZE-READY

---

## PURPOSE OF KNOWLEDGE THREADS

> **Knowledge Threads connect:** information, decisions, artifacts, meetings, spheres, agents.

### They DO NOT ⚡
| Forbidden | Status |
|-----------|--------|
| **infer meaning** | ❌ ⚡ |

### They ONLY ⚡
| Allowed | Status |
|---------|--------|
| **reveal structural relationships** | ✅ ⚡ |

> **Thread = LINKAGE, not narrative.**

---

## 1) INTER-SPHERE KNOWLEDGE THREADS ⚡

### Purpose
Connect information **across different spheres** (Business → Scholar → Creative → Social → XR → Institutions)

### RULE
> **Only objective overlaps create threads. No prediction, no interpretation.**

### 4 Thread Types ⚡
| Type | Description |
|------|-------------|
| `SHARED_ARTIFACT_THREAD` | **same doc/data used in multiple spheres** ⚡ |
| `SHARED_TOPIC_THREAD` | overlapping topics using keyword equivalence ⚡ |
| `SHARED_AGENT_THREAD` | same agent contributes in different spheres ⚡ |
| `SHARED_DECISION_THREAD` | **decision in Sphere A triggers action in Sphere B** ⚡ |

### Inter-Sphere Thread JSON ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "shared_artifact|shared_topic|shared_agent|shared_decision",
    "spheres": ["business", "scholar"],
    "nodes": ["artifact_id", "meeting_id"],
    "source_of_truth": "collective_memory_id",
    "hash": "sha256"
  }
}
```

### Visualization Rules ⚡
| Feature | Description |
|---------|-------------|
| **color** | = sphere families ⚡ |
| **thickness** | = number of elements linked **(never "importance")** ⚡ |
| **opacity** | = freshness ⚡ |
| **no directional arrows** | **(prevents bias)** ⚡ |

---

## 2) TEMPORAL KNOWLEDGE THREADS ⚡

### Purpose
Show how knowledge **evolves through TIME** WITHOUT suggesting improvement or decline.

### RULE
> **Time = sequence only, not progress.**

### 4 Temporal Thread Types ⚡ (NOUVEAU!)
| Type | Description |
|------|-------------|
| `EVOLUTION_THREAD` | same topic appears at different timestamps ⚡ |
| `REVISION_THREAD` | artifact updated multiple times, **100% traceable diffs** ⚡ |
| `REFLECTION_THREAD` | notes referencing previous meetings ⚡ |
| `SILENCE_THREAD` | **long gaps between topics (non-action visualized)** ⚡ |

### Temporal Thread JSON ⚡

```json
{
  "temporal_thread": {
    "topic": "string",
    "timeline": [
      { "t": 17123456, "ref": "artifact_or_meeting_id" },
      { "t": 17123777, "ref": "artifact_or_meeting_id" }
    ],
    "silence_intervals": [3000, 12000]
  }
}
```

### Key Field: `silence_intervals` ⚡ (NOUVEAU!)
> **Array of gap durations representing periods of non-action**

### Temporal Visualization ⚡
| Feature | Description |
|---------|-------------|
| **line** | = time ⚡ |
| **nodes** | = events ⚡ |
| **dashed regions** | = **silence** ⚡ |
| **highlight** | = update events ⚡ |

### NO ⚡
| Forbidden | Status |
|-----------|--------|
| **growth curves** | ❌ ⚡ |
| **performance curves** | ❌ ⚡ |
| **predictive arrows** | ❌ ⚡ |

---

## 3) DECISION-IMPACT KNOWLEDGE THREADS ⚡

### Purpose
Track the **structural consequences of decisions** WITHOUT judging quality.

### RULE
> **Impact = structural ripple.**

### 4 Impact Thread Types ⚡ (NOUVEAU!)
| Type | Description |
|------|-------------|
| `STRUCTURAL_IMPACT` | **decision changes data structures or workflows** ⚡ |
| `TIMELINE_IMPACT` | creates new meetings, replays, or sequences ⚡ |
| `SPHERE_IMPACT` | decision in Sphere A requires action in Sphere B ⚡ |
| `AGENT_IMPACT` | **agent gets activated due to a decision** ⚡ |

### Decision-Impact Thread JSON ⚡

```json
{
  "decision_impact_thread": {
    "decision_id": "uuid",
    "effects": [
      {
        "type": "structural|timeline|sphere|agent",
        "target": "node_id",
        "timestamp": 17123456
      }
    ],
    "validation": "hash_of_replay_segment"
  }
}
```

### Impact Thread Visualization ⚡
| Feature | Description |
|---------|-------------|
| **center node** | = decision ⚡ |
| **radiating nodes** | = effects ⚡ |
| **no "bigger = better"** | ⚡ |
| **no "closer = more important"** | ⚡ |

---

## UNIVERSAL THREAD ETHICS ⚡

| Rule | Status |
|------|--------|
| **No inference** | ✅ ⚡ |
| **No sentiment analysis** | ✅ ⚡ |
| **No persuasion gradients** | ✅ ⚡ |
| **No priority ranking** | ✅ ⚡ |
| **All threads must be explainable with raw data** | ✅ ⚡ |

---

## THREADS + UNIVERSE VIEW (INTEGRATION RULES) ⚡

| Thread Type | Appears As |
|-------------|------------|
| **Inter-sphere threads** | soft cross-orbit connectors ⚡ |
| **Temporal threads** | **braided lines when filtering timeline** ⚡ |
| **Impact threads** | ONLY inside replay mode or decision review mode ⚡ |

### User Toggles ⚡
| Toggle | Description |
|--------|-------------|
| show structural only | ⚡ |
| show temporal only | ⚡ |
| show impact only | ⚡ |

---

## REDUNDANCY + SAFETY ⚡

| Feature | Description |
|---------|-------------|
| **Full hash verification** | for each thread ⚡ |
| **Append-only change log** | ⚡ |
| **Opt-out at user level** | ⚡ |
| **"Thread Transparency Panel"** | **shows origin of every link** ⚡ |

---

**END — KNOWLEDGE THREADS PACK FREEZE**
