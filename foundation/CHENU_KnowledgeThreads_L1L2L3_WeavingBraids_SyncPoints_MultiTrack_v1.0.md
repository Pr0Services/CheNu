# CHE·NU — KNOWLEDGE THREADS (L1–L3)
**VERSION:** CORE-KNOWLEDGE.v1.0  
**MODE:** FACT-WEAVING / NON-PERSUASIVE / FREEZE-READY

---

## L1 — KNOWLEDGE THREADS (BASE LAYER) ⚡

### Purpose
Link **FACTS** across meetings, artifacts, spheres, and timelines **WITHOUT interpretation, weighting, or prioritization.**

### RULE
> **Knowledge Thread = FACT LINKS ONLY. NO inference. NO suggestion. NO narrative building.**

### Thread Unit ⚡

**THREAD_NODE:**
| Field | Description |
|-------|-------------|
| `fact_id` | ⚡ |
| `source_replay` | ⚡ |
| `timestamp` | ⚡ |
| `sphere` | ⚡ |
| `artifact_ref?` | optional ⚡ |

**THREAD_EDGE:**
| Field | Description |
|-------|-------------|
| `relation_type` | **same_topic/same_artifact/same_actor/same_decision_ref** ⚡ |
| **no ranking** | ⚡ |
| **no causality** | ⚡ |

### L1 Data Model ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "nodes": ["fact_uuid_1", "fact_uuid_2"],
    "relation": "shared_artifact|shared_topic|shared_timestamp",
    "immutable": true
  }
}
```

### L1 Visualization ⚡
| Feature | Description |
|---------|-------------|
| **thin line between facts** | ⚡ |
| **color-coded by sphere** | ⚡ |
| **no thickness changes** | ⚡ |
| **no directional arrows** | ⚡ |

---

## L2 — CROSS-SPHERE KNOWLEDGE WEAVING ⚡

### Purpose
Show how knowledge moves **ACROSS spheres** without merging intentions or generating meaning.

### RULE
> **Weaving = CLUSTERING ONLY. NEVER transforms or interprets data.**

### Sphere Weave Node ⚡
| Field | Description |
|-------|-------------|
| `fact_reference` | ⚡ |
| `sphere_origin` | ⚡ |
| `sphere_destination` | if referenced in another context ⚡ |

### 3 Weave Types ⚡ (NOUVEAU!)

| Type | Description |
|------|-------------|
| **WEAVE 1 — SAME FACT, MULTIPLE SPHERES** | ex: document referenced in Business + Scholar ⚡ |
| **WEAVE 2 — SEQUENTIAL SPHERES** | event in A → event in B **(ordered by time, NOT causal)** ⚡ |
| **WEAVE 3 — PARALLEL SPHERE ACTIVITY** | **two spheres address same topic at same time** ⚡ |

### L2 Data Model ⚡

```json
{
  "knowledge_weave": {
    "id": "uuid",
    "threads": ["thread_id_1", "thread_id_2"],
    "sphere_map": {
      "business": ["fact1", "fact2"],
      "scholar": ["fact3"],
      "creative": []
    },
    "temporal_alignment": "neutral"
  }
}
```

### L2 Visualization ⚡
| Feature | Description |
|---------|-------------|
| **threads grouped in "weave clusters"** | ⚡ |
| **cluster labelled by shared topic** | ⚡ |
| **cross-sphere bars (no arrows)** | ⚡ |
| **zero narrative annotation** | ⚡ |

---

## L3 — TEMPORAL KNOWLEDGE BRAIDS ⚡

### Purpose
Align knowledge threads along **TIME** to reveal structural patterns (NOT meaning).

### RULE
> **Braid = TIME-ALIGNED FACTS. NEVER: predict, infer, advise, optimize.**

### 4 Braid Layers ⚡ (NOUVEAU!)

| Layer | Content |
|-------|---------|
| **BRAID_LAYER_FACTS** | pure chronological sequence ⚡ |
| **BRAID_LAYER_SPATIAL** | where (meeting rooms, spheres) ⚡ |
| **BRAID_LAYER_ACTORS** | users, agents **(role only)** ⚡ |
| **BRAID_LAYER_ARTIFACTS** | documents, boards, replays ⚡ |

### 3 Braid Types ⚡ (NOUVEAU!)

| Type | Description |
|------|-------------|
| **BRAID 1 — LINEAR** | single timeline with inter-sphere markers ⚡ |
| **BRAID 2 — MULTI-TRACK** | **tracks per sphere (parallel timelines)** ⚡ |
| **BRAID 3 — SYNCPOINT BRAID** | **alignment on shared events or artifacts** ⚡ |

### L3 Data Model ⚡

```json
{
  "knowledge_braid": {
    "id": "uuid",
    "tracks": [
      {
        "sphere": "business",
        "events": [
          { "fact_id": "f1", "t": 1712345678 }
        ]
      },
      {
        "sphere": "scholar",
        "events": [
          { "fact_id": "f9", "t": 1712345682 }
        ]
      }
    ],
    "syncpoints": ["f1", "f9"],
    "integrity": "verified"
  }
}
```

### Syncpoints ⚡ (NOUVEAU!)
> **Syncpoints = shared events or artifacts that appear on all tracks simultaneously**

### L3 Visualization ⚡
| Feature | Description |
|---------|-------------|
| **multiple colored rails (per sphere)** | ⚡ |
| **syncpoints = circles on all rails** | ⚡ |
| **no vertical arrows or dependence lines** | ⚡ |
| **no emphasis beyond clarity** | ⚡ |

---

## INTEGRATION RULES ACROSS L1–L3 ⚡

| Rule | Description |
|------|-------------|
| **1. Threads → Weaves** | A weave may group multiple threads if they share cross-sphere relevance ⚡ |
| **2. Weaves → Braids** | A braid aligns weave content temporally ⚡ |
| **3. NO inference** | ⚡ |
| **4. NO learning over user psychology** | ⚡ |
| **5. NO predictive logic** | ⚡ |
| **6. Human verification always possible** | ⚡ |
| **7. Cryptographic immutability of threads** | ⚡ |

---

## AGENTS INVOLVED ⚡

| Agent | Role |
|-------|------|
| `AGENT_THREAD_COLLECTOR` | **extracts facts from replays, no interpretation** ⚡ |
| `AGENT_WEAVE_BUILDER` | **forms sphere clusters, no suggestions** ⚡ |
| `AGENT_BRAID_ALIGNER` | **aligns timelines, no pattern detection** ⚡ |
| `AGENT_MEMORY_GUARD` | **ensures compliance with immutability rules** ⚡ |

---

## WHY THIS MATTERS ⚡

| Component | = |
|-----------|---|
| **Knowledge Threads** | Truth without interpretation ⚡ |
| **Weaves** | **Connections without merging** ⚡ |
| **Braids** | **Chronology without meaning shaping** ⚡ |

### This Preserves ⚡
- Neutrality
- Context clarity
- Multi-perspective coherence
- **Zero manipulation** ⚡

---

**END — KNOWLEDGE THREADS L1–L3**
