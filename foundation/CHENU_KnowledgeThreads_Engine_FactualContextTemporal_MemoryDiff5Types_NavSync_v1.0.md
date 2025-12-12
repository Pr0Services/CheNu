# CHE·NU — KNOWLEDGE THREAD ENGINE
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / FREEZE-READY

---

## PURPOSE

> **Reveal *connections* between facts, meetings, spheres, and artifacts WITHOUT interpretation, ranking, or outcome steering.**

### RULE
> **Threads = STRUCTURAL LINKS. NOT recommendations. NOT narratives.**

---

## THREAD TYPE A — FACTUAL THREADS ⚡

### Definition
Links created **automatically** when two memory entries share a verifiable anchor.

### Factual Anchors ⚡
| Anchor | Description |
|--------|-------------|
| same document | ⚡ |
| same timestamp window | ⚡ |
| same participant | ⚡ |
| same sphere topic | ⚡ |
| **same artifact lineage (versioning)** | ⚡ |
| **repeated event patterns (non-interpreted)** | ⚡ |

### Factual Thread JSON ⚡

```json
{
  "type": "factual",
  "anchors": ["artifact_id", "meeting_id", "timestamp"],
  "nodes": ["memory_entry_id", "..."],
  "confidence": 1.0,
  "hash": "sha256"
}
```

### Key Field: `confidence` ⚡ (NOUVEAU!)
> **1.0 = pure structural certainty (always 100%)**

### Rules ⚡
| Rule | Status |
|------|--------|
| **zero interpretation** | ✅ ⚡ |
| **zero predictive weight** | ✅ ⚡ |
| **no "importance score"** | ✅ ⚡ |
| **user can hide/show freely** | ✅ ⚡ |

---

## THREAD TYPE B — CONTEXT THREADS ⚡

### Purpose
Show how events across spheres relate by **shared context.**

### Context Sources ⚡
| Source | Description |
|--------|-------------|
| shared tags | ⚡ |
| shared sphere links | ⚡ |
| topics touched by multiple groups | ⚡ |
| **procedural sequences (research → proposal → meeting)** | ⚡ |

### Context Thread JSON ⚡

```json
{
  "type": "context",
  "dimension": "topic|sphere|process",
  "nodes": ["..."],
  "links": [{ "from": "id", "to": "id", "why": "shared_tag" }],
  "strength": "0.0-0.8"
}
```

### Key Field: `strength` ⚡ (NOUVEAU!)
> **0.0-0.8 — soft structural proximity (never 1.0)**

### Rules ⚡
| Rule | Status |
|------|--------|
| **no emotional metadata** | ✅ ⚡ |
| **no storytelling** | ✅ ⚡ |
| **user can follow or ignore** | ✅ ⚡ |
| **always reversible (no lock-in)** | ✅ ⚡ |

---

## THREAD TYPE C — TEMPORAL THREADS ⚡

### Purpose
Reveal **timelines and chains of action** without interpretation.

### Temporal Rules ⚡
| Rule | Status |
|------|--------|
| **sorted by timestamp only** | ✅ ⚡ |
| **never imply causality** | ✅ ⚡ |
| **highlight gaps and silence periods** | ✅ ⚡ |
| **optional alignment across spheres** | ✅ ⚡ |

### Temporal Thread JSON ⚡

```json
{
  "type": "temporal",
  "sorted_nodes": ["..."],
  "markers": {
    "silence": ["..."],
    "burst_periods": ["..."],
    "cross_sphere_jumps": ["..."]
  }
}
```

### Key Field: `markers` ⚡ (NOUVEAU!)
| Marker | Description |
|--------|-------------|
| `silence` | **gaps in activity** ⚡ |
| `burst_periods` | **high activity periods** ⚡ |
| `cross_sphere_jumps` | **transitions between spheres** ⚡ |

### Rules ⚡
| Rule | Status |
|------|--------|
| **no cause/effect inference** | ✅ ⚡ |
| **no sentiment** | ✅ ⚡ |
| **pure chronological display** | ✅ ⚡ |

---

## KNOWLEDGE THREAD EXPORT ⚡

```json
{
  "knowledge_thread_bundle": {
    "version": "1.0",
    "threads": ["..."],
    "integrity_hash": "sha256"
  }
}
```

---

## MEMORY DIFF — CROSS-SPHERE (C + D FUSION) ⚡ (NOUVEAU!)

### Purpose
Show differences between: personal vs collective memory, sphere vs sphere memory, team vs user perspective **without interpreting the difference.**

### 5 DIFF TYPES ⚡
| # | Type | Description |
|---|------|-------------|
| **1** | `STRUCTURAL DIFF` | **missing events, extra artifacts** ⚡ |
| **2** | `TEMPORAL DIFF` | **timeline gaps** ⚡ |
| **3** | `PARTICIPANT DIFF` | **who was present in each record** ⚡ |
| **4** | `ARTIFACT DIFF` | **version mismatch** ⚡ |
| **5** | `CONTEXT DIFF` | **different sphere classification** ⚡ |

### Memory Diff JSON ⚡

```json
{
  "memory_diff": {
    "scope": "personal|collective|cross_sphere",
    "left_set": ["..."],
    "right_set": ["..."],
    "differences": [
      { "type": "missing_entry", "entry_id": "..." },
      { "type": "timestamp_delta", "delta": "..." },
      { "type": "artifact_mismatch", "left": "...", "right": "..." }
    ],
    "verified": true
  }
}
```

### Diff Rules ⚡
| Rule | Status |
|------|--------|
| **NEVER says "why"** | ✅ ⚡ |
| **NEVER says which is better** | ✅ ⚡ |
| **ALWAYS reversible** | ✅ ⚡ |
| **ALWAYS hash-verifiable** | ✅ ⚡ |

---

## PERSONAL NAVIGATION SYNC WITH THREADS ⚡ (NOUVEAU!)

> **A user's navigation profile affects ONLY visual filtering:**

| Mode | Shows |
|------|-------|
| `explorer` | **all threads faintly** ⚡ |
| `focus` | **only factual & temporal threads** ⚡ |
| `review` | **context + temporal threads aligned with replay** ⚡ |

### Rules ⚡
| Rule | Status |
|------|--------|
| **NO modification of underlying memory** | ✅ ⚡ |
| **NO suggestion of meaning** | ✅ ⚡ |

---

## AGENT ROLES ⚡

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | **builds factual/context/temporal links, no interpretation** ⚡ |
| `AGENT_THREAD_EXPLAINER` | **explains link origins in simple text, cannot infer causes** ⚡ |
| `AGENT_DIFF_ENGINE` | **performs structural memory comparisons, immutable and verifiable** ⚡ |
| `AGENT_NAV_FILTER` | **applies user visual filtering rules, never hides data by itself** ⚡ |

---

## WHY IT MATTERS ⚡

| Component | = |
|-----------|---|
| **Knowledge Threads** | connected but **non-biased** representation of reality ⚡ |
| **Memory Diff** | transparent and **non-interpretative** contrast ⚡ |

### Together ⚡
- clarity
- traceability
- structural understanding
- **without influence or narrative steering** ⚡

---

**END — FOUNDATION FROZEN**
