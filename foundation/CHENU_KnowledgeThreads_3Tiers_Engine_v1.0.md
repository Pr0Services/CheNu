# CHE·NU — KNOWLEDGE THREADS (3 TIERS) + THREAD ENGINE + KNOWLEDGE DENSITY ENGINE
**VERSION:** CORE.KNOWLEDGE.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / BUILD-READY

---

## 1) KNOWLEDGE THREADS — PURPOSE

> **Thread = a neutral chain of FACTS, EVENTS, ARTIFACTS, and LINKS**  
> connecting content across spheres, meetings, replays, and memory.

### RULE
> **Threads REVEAL structure**  
> **NEVER impose interpretation.**

---

## TIER 1 — FACT THREADS

### Definition
Linear chain of raw factual items.

| Property | Value |
|----------|-------|
| Sources | Collective Memory entries, XR replay frames, Artifacts |
| Characteristics | timestamped, event-only, no reasoning |
| Content | no "why", only "what happened" |

### JSON

```json
{
  "fact_thread": {
    "id": "uuid",
    "events": [
      { "id": "event_id", "timestamp": "...", "source": "replay_id" }
    ]
  }
}
```

---

## TIER 2 — CONTEXT THREADS

### Definition
Group facts by topic, sphere, participants, or artifact lineage.

### Adds
- sphere tag
- topic tag
- adjacency

### Constraint
❌ NO conclusions.

### JSON

```json
{
  "context_thread": {
    "id": "uuid",
    "links": [
      { "from": "fact_id_1", "to": "fact_id_2", "reason": "shared_topic" }
    ],
    "sphere": "business|scholar|..."
  }
}
```

---

## TIER 3 — KNOWLEDGE THREADS

### Definition
Weave multi-sphere Context Threads into a coherent map.

### Properties
- cross-sphere
- multi-meeting
- multi-replay
- multi-agent trace

### ABSOLUTE LIMIT
> ❌ No synthesis, no interpretation, no advice.

### JSON

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "nodes": ["context_thread_id"],
    "edges": [
      { "from": "ct1", "to": "ct2", "reason": "temporal|artifact|participant" }
    ],
    "density": 0.0
  }
}
```

---

## TIER HIERARCHY

```
┌─────────────────────────────────────────────────────────────┐
│                    TIER 3: KNOWLEDGE THREAD                  │
│              (cross-sphere, multi-meeting map)               │
│                       density: 0.0-1.0                       │
├─────────────────────────────────────────────────────────────┤
│     TIER 2: CONTEXT THREAD    │    TIER 2: CONTEXT THREAD   │
│     (topic/sphere grouping)   │    (topic/sphere grouping)  │
├───────────────┬───────────────┼───────────────┬─────────────┤
│ TIER 1: FACT  │ TIER 1: FACT  │ TIER 1: FACT  │ TIER 1: FACT│
│ (raw events)  │ (raw events)  │ (raw events)  │ (raw events)│
└───────────────┴───────────────┴───────────────┴─────────────┘
```

---

## 2) KNOWLEDGE THREAD ENGINE

### Purpose
Automatically generate Fact → Context → Knowledge Threads **WITHOUT summarizing or interpreting.**

### RULE
> **Engine creates STRUCTURE,**  
> **User creates MEANING.**

---

### ENGINE STEPS

| Step | Action |
|------|--------|
| **1. INDEX FACTS** | Scan collective_memory, index by timestamp, sphere, participants |
| **2. GENERATE FACT THREADS** | Group sequential events in same meeting or replay |
| **3. BUILD CONTEXT THREADS** | Detect shared: topic, artifact, sphere, participants → create links |
| **4. BUILD KNOWLEDGE THREAD** | Multi-sphere stitching, temporal pathfinding, artifact inheritance |
| **5. COMPUTE DENSITY** | Delegated to Density Engine |

---

### ENGINE PIPELINE

```
collective_memory
       │
       ▼
┌──────────────────┐
│  STEP 1: INDEX   │
│  (timestamp,     │
│   sphere, users) │
└────────┬─────────┘
         ▼
┌──────────────────┐
│  STEP 2: FACTS   │
│  (sequential     │
│   grouping)      │
└────────┬─────────┘
         ▼
┌──────────────────┐
│  STEP 3: CONTEXT │
│  (topic/artifact │
│   linking)       │
└────────┬─────────┘
         ▼
┌──────────────────┐
│  STEP 4: KNOWLEDGE│
│  (cross-sphere   │
│   stitching)     │
└────────┬─────────┘
         ▼
┌──────────────────┐
│  STEP 5: DENSITY │
│  (compute score) │
└──────────────────┘
```

---

### ENGINE CONFIG JSON

```json
{
  "thread_engine": {
    "auto_generate": true,
    "min_context_links": 2,
    "max_cross_sphere": 6,
    "density_engine": "enabled"
  }
}
```

---

### SAFETY GUARANTEES

| Guarantee | Status |
|-----------|--------|
| No synthesis | ✅ |
| No summarization | ✅ |
| No hidden clustering | ✅ |
| Deterministic links | ✅ |
| Transparent criteria per link | ✅ |

---

## 3) KNOWLEDGE DENSITY ENGINE

### Purpose
Measure how **RICH** a Knowledge Thread is **WITHOUT judging correctness, usefulness, value, or meaning.**

> **Density = quantity & connectivity of factual material.**

---

### DENSITY INPUTS

| Input | Measured |
|-------|----------|
| `number_of_facts` | ✅ |
| `number_of_context_links` | ✅ |
| `number_of_spheres` | ✅ |
| `temporal_span` | ✅ |
| `artifact_count` | ✅ |
| `participant_diversity` | ✅ |

### NOT Measured
- ❌ importance
- ❌ emotional valence
- ❌ impact scoring

---

### DENSITY COMPUTATION

```
density = normalize(
    facts_weight * fact_count +
    ctx_weight * context_links +
    sphere_weight * distinct_spheres +
    time_weight * temporal_length +
    artifact_weight * artifact_count
)
```

**Weights are CONSTANT, published, visible.**

---

### DENSITY JSON OUTPUT

```json
{
  "density_result": {
    "thread_id": "uuid",
    "density": 0.72,
    "components": {
      "facts": 0.85,
      "context": 0.68,
      "spheres": 0.50,
      "temporal": 0.90,
      "artifacts": 0.67
    }
  }
}
```

---

### DENSITY VISUALIZATION

| Visual Element | Meaning |
|----------------|---------|
| Thicker thread | Higher density |
| More nodes | Higher density |
| Calmer color | Lower density |
| Saturated color | Higher density |

**❌ No emotional cues.**

---

## 4) THREAD ACCESS & UI RULES

### User SEES
- ✅ thread structure
- ✅ factual nodes
- ✅ sphere lineage
- ✅ replay anchors

### User NEVER SEES
- ❌ evaluations
- ❌ recommendations
- ❌ optimizations
- ❌ judgments

### UI Interactions
- expand/collapse thread
- show only facts
- show context groups
- show cross-sphere map
- enter XR thread view
- export PDF thread map

---

## 5) AGENT ROLES

| Agent | Role |
|-------|------|
| `AGENT_THREAD_INDEXER` | Builds fact & context threads, deterministic only |
| `AGENT_THREAD_VIEWER` | Renders thread UI, no interpretation |
| `AGENT_DENSITY_ENGINE` | Computes density, no meaning assignment |
| `AGENT_THREAD_GUARD` | Prevents: synthesis, advice, interpretation, emotional shaping |

---

**END — FOUNDATION FREEZE**
