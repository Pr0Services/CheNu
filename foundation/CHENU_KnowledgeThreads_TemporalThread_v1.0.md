# CHE·NU — KNOWLEDGE THREAD SYSTEM (TEMPORAL THREAD)
**VERSION:** FOUNDATION  
**MODE:** NON-MANIPULATIVE / IMMUTABLE / TRACEABLE

---

## PURPOSE

> Represent connections between facts, artifacts, events, and decisions **WITHOUT inference, ranking, or persuasion.**

> **Thread = Structured relationship, NOT interpretation.**

---

## 1) INTRA-SPHERE KNOWLEDGE THREADS (4 types) ⚡

### Scope
Links between items **INSIDE the same sphere** (Business → Business, Scholar → Scholar, etc.)

### Thread Types ⚡
| Type | Description |
|------|-------------|
| `event_chain` | Chronology within sphere |
| `artifact_dependency` | File/board relationships |
| `decision_continuity` | Meeting → outcome → follow-up |
| `agent_participation_path` | Who acted when |

### Rules
- append-only, immutable snapshot, no weighting, no causal inference

### JSON Model

```json
{
  "knowledge_thread_intra": {
    "sphere": "business|scholar|creative|...",
    "nodes": ["uuid","uuid"],
    "relation": "event_chain|artifact_dependency|decision_continuity|participation",
    "timestamp": 1712345678,
    "source_replay": "uuid",
    "hash": "sha256"
  }
}
```

### Behavior
- rendered as linear or cluster graph
- never recommends interpretation
- filters by sphere context only

---

## 2) CROSS-SPHERE KNOWLEDGE THREADS (5 types) ⚡

### Scope
Connections between items from **DIFFERENT spheres** (Business ↔ Scholar, Creative ↔ XR, etc.)

### Thread Types ⚡
| Type | Description |
|------|-------------|
| `shared_concept` | Topic overlap |
| `artifact_reference` | Cross-sphere docs |
| `decision_impact` | One sphere triggers another |
| `meeting_intersection` | Participants shared |
| `learning_transfer` | Scholar → business |

### Rules
- only surface VERIFIED relationships
- no prediction, no optimization suggestions
- **user must manually enable cross-sphere view**

### JSON Model

```json
{
  "knowledge_thread_cross": {
    "from_sphere": "business",
    "to_sphere": "scholar",
    "nodes": ["uuid_from","uuid_to"],
    "relation": "shared_concept|artifact_reference|decision_impact|meeting_intersection",
    "integrity": "verified",
    "hash": "sha256"
  }
}
```

### Behavior ⚡
- appears as arcs between orbit clusters in Universe View
- visually subtle, no highlight unless requested
- **explanation bubble REQUIRED before display** ⚡

---

## 3) TEMPORAL KNOWLEDGE THREADS (5 types) ⚡ UNIQUE

### Scope
Represents the **EVOLUTION of information, decisions, artifacts, or topics over time.**

### Thread Types ⚡
| Type | Description |
|------|-------------|
| `topic_evolution` | How a concept changed |
| `decision_revision` | Updates without judgment |
| `artifact_version_chain` | Artifact versions |
| `replay_timeline_chain` | Meeting sequences |
| `collective_memory_growth` | Memory evolution |

### Rules
- **NO "improvement", NO "degradation"—ONLY change tracking**
- full version integrity
- time anchors required
- can be replayed in XR temporal view

### JSON Model (with timeline_mode) ⚡

```json
{
  "knowledge_thread_temporal": {
    "topic": "string",
    "versions": [
      { "version": 1, "ref": "uuid", "timestamp": 1712345678 },
      { "version": 2, "ref": "uuid", "timestamp": 1712345700 }
    ],
    "sphere": "any",
    "timeline_mode": "linear|braided",
    "hash": "sha256"
  }
}
```

### Timeline Mode ⚡
| Mode | Description |
|------|-------------|
| `linear` | Single timeline |
| `braided` | Parallel timelines |

### Behavior ⚡
- shown as braided timeline in Universe View
- **XR mode: ghost layers of previous states** ⚡
- never suggests which version is "best"

---

## KNOWLEDGE THREAD ENGINE — SHARED RULES

### THREAD MUST BE
| Rule | Status |
|------|--------|
| explicit | ✅ |
| user-visible | ✅ |
| immutable | ✅ |
| hash-verified | ✅ |
| source-traceable | ✅ |
| non-interpretative | ✅ |

### THREAD MUST NOT
- infer intent
- generate conclusions
- apply any scoring
- reduce ambiguity artificially
- steer decisions or emotions

---

## KNOWLEDGE THREAD META-MODEL (with Indexes) ⚡

```json
{
  "knowledge_threads": {
    "intra": [...],
    "cross": [...],
    "temporal": [...],
    "indexes": {
      "by_sphere": {},
      "by_topic": {},
      "by_time": {},
      "by_meeting": {}
    }
  }
}
```

### Index Types ⚡
| Index | Purpose |
|-------|---------|
| `by_sphere` | Filter by sphere |
| `by_topic` | Filter by topic |
| `by_time` | Filter by time |
| `by_meeting` | Filter by meeting |

---

## UNIVERSE VIEW RENDERING RULES ⚡

| Thread | Rendering |
|--------|-----------|
| **INTRA-SPHERE** | **ring-cluster paths** ⚡ |
| **CROSS-SPHERE** | **faint arcs between orbits** ⚡ |
| **TEMPORAL** | **scrollable timeline braid** ⚡ |

### Interaction ⚡
| Action | Result |
|--------|--------|
| **tap** | expand |
| **hold** | preview |
| **pinch** | compare |
| **XR ghost overlay** | temporal view |

---

## AGENTS INVOLVED

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | Creates threads from validated data only |
| `AGENT_THREAD_GUARD` | Ensures no inference or opinion enters thread |
| `AGENT_THREAD_EXPLAINER` | Provides transparent explanation ("This thread exists because X referenced Y.") |

---

**END — FOUNDATION FREEZE READY**
