# CHE·NU — KNOWLEDGE THREADS
**MODE:** FOUNDATION / NON-MANIPULATIVE / TRACE-BASED

---

## KNOWLEDGE THREAD TYPE 1 — CROSS-SPHERE THREAD ⚡

### Purpose
Connect **FACTUAL elements across different spheres** to reveal structural links without interpretation.

### RULE
> **Thread = relational trace. NOT storyline. NOT evaluation.**

### Thread Sources ⚡
| Source | Description |
|--------|-------------|
| **artifacts** | documents, notes, files ⚡ |
| **replay logs (validated)** | ⚡ |
| **decisions timestamps** | ⚡ |
| **agent actions (trace-only)** | ⚡ |
| **user contributions (opt-in)** | ⚡ |
| **sphere metadata (domain labels)** | ⚡ |

### Thread Structure ⚡

**THREAD_NODE:**
| Field | Description |
|-------|-------------|
| `id` | ⚡ |
| `source_sphere` | ⚡ |
| `type` | **artifact/decision/event/context** ⚡ |
| `timestamp` | ⚡ |
| `hash` | ⚡ |

**THREAD_EDGE:**
| Field | Description |
|-------|-------------|
| `relation` | **refers_to / derived_from / similar_to / co-occurs** ⚡ |
| `confidence` | **0–1, structural only** ⚡ |

### Cross-Sphere Thread JSON ⚡

```json
{
  "knowledge_thread": {
    "type": "cross_sphere",
    "thread_id": "uuid",
    "nodes": ["..."],
    "edges": ["..."],
    "metadata": {
      "spheres_involved": ["business", "scholar", "creative", "institution"],
      "generation_mode": "trace_only",
      "read_only": true
    }
  }
}
```

### Safety Rules ⚡
| Rule | Status |
|------|--------|
| **No inference** | ✅ ⚡ |
| **No missing-data hallucination** | ✅ ⚡ |
| **No causal claims** | ✅ ⚡ |
| **No meaning fabrication** | ✅ ⚡ |
| **Only structural visibility** | ✅ ⚡ |

---

## KNOWLEDGE THREAD TYPE 2 — TEMPORAL THREAD ⚡

### Purpose
Show how knowledge **evolved OVER TIME** across sessions, meetings, and user/agent contributions.

### RULE
> **Temporal Thread = chronological FACT GRAPH. NOT progress assessment. NOT performance indicator.**

### Temporal Sources ⚡
| Source | Description |
|--------|-------------|
| **replay frames** | ⚡ |
| **versioned artifacts** | ⚡ |
| **updated decisions** | ⚡ |
| **sphere-local logs** | ⚡ |
| **branch merges** | ⚡ |
| **user edits (opt-in)** | ⚡ |

### 3 Temporal Layers ⚡ (NOUVEAU!)

| Layer | Content |
|-------|---------|
| **LAYER 1 — TIME INDEX** | timestamps, session boundaries, **gaps & silence periods** ⚡ |
| **LAYER 2 — KNOWLEDGE EVOLUTION** | artifact versions, decision iterations, **branching & merging** ⚡ |
| **LAYER 3 — PARTICIPANT INVOLVEMENT** | users, agents, **activation level (neutral scalar)** ⚡ |

### Temporal Thread JSON ⚡

```json
{
  "knowledge_thread": {
    "type": "temporal",
    "thread_id": "uuid",
    "timeline": [
      {
        "t": 1712345678,
        "events": ["..."],
        "artifacts": ["..."],
        "decisions": ["..."],
        "participants": ["..."]
      }
    ],
    "metadata": {
      "span_days": 32,
      "version_count": 18,
      "read_only": true
    }
  }
}
```

### Temporal Metadata Fields ⚡
| Field | Description |
|-------|-------------|
| `span_days` | **number of days covered** ⚡ |
| `version_count` | **total versions** ⚡ |
| `read_only` | **true** ⚡ |

### Temporal Visualization Rules ⚡
| Rule | Status |
|------|--------|
| **No "improvement" arrows** | ✅ ⚡ |
| **No "decline" labels** | ✅ ⚡ |
| **No emotional weighting** | ✅ ⚡ |
| **Only factual deltas** | ✅ ⚡ |

---

## THREAD MERGE RULES ⚡

### Thread_A Merges with Thread_B ONLY IF ⚡
| Condition | Status |
|-----------|--------|
| **≥2 shared nodes** | ✅ ⚡ |
| **identical artifact lineage** | ✅ ⚡ |
| **identical sphere metadata AND temporal adjacency** | ✅ ⚡ |

### NO Automatic Merges Based On ⚡
| Forbidden | Status |
|-----------|--------|
| **semantic similarity** | ❌ ⚡ |
| **topic inference** | ❌ ⚡ |
| **agent speculation** | ❌ ⚡ |

---

## WHY THREADS EXIST ⚡

| Thread Type | = |
|-------------|---|
| **Cross-Sphere Threads** | → breadth (**horizontal truth**) ⚡ |
| **Temporal Threads** | → depth (**historical truth**) ⚡ |

### Together ⚡
- No interpretation
- No prediction
- **Pure structural clarity** ⚡

---

**END — KNOWLEDGE THREADS (TYPES 1 + 2)**
