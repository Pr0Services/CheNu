# CHE·NU — KNOWLEDGE THREADS (UNIFIED BUNDLE)
**VERSION:** KT.v1.0  
**MODE:** BUILD-READY / NON-MANIPULATIVE / FREEZE-COMPATIBLE

---

## OVERVIEW

> **Knowledge Threads = LIGNES DE CONNEXION FACTUELLES** entre événements, décisions, replays, artifacts, agents et sphères.

### RULE
> **They connect WHAT happened.**  
> **They NEVER tell WHY or WHAT should happen.**

### 3 Types
1. THREADS OF FACTS
2. THREADS OF CONTEXT
3. THREADS OF EVOLUTION

---

## 1) FACTUAL KNOWLEDGE THREADS

### Purpose
Link facts across meetings, replays, spheres, **WITHOUT interpretation.**

### Sources
- replay events, artifact mentions, decisions timestamps, agent action logs, sphere interactions

### Properties
| Property | Value |
|----------|-------|
| direction | optional |
| weight | **count of shared items** ⚡ |
| visibility | per-user |
| immutable | yes |
| no meaning inference | ✅ |

### JSON Model (with co-occurrence) ⚡

```json
{
  "thread_fact": {
    "id": "uuid",
    "items": [
      { "source": "replay|artifact|decision",
        "ref": "uuid",
        "timestamp": 1712345678 }
    ],
    "links": [
      { "from": "uuid", "to": "uuid", "type": "co-occurrence" }
    ],
    "hash": "sha256"
  }
}
```

### Link Type ⚡
| Type | Description |
|------|-------------|
| `co-occurrence` | Items appeared together |

### UI (XR/2D)
| Property | Value |
|----------|-------|
| Style | thin lines between nodes |
| Color | neutral |
| Arrows | **no direction arrows unless explicitly set** |
| Toggle | can be toggled ON/OFF |

### Rules
- NO highlighting
- NO interpretation
- NO emphasis of importance

---

## 2) CONTEXTUAL KNOWLEDGE THREADS (with explanation) ⚡

### Purpose
Represent relationships in CONTEXT: topics, spheres, participants, recurring motifs.

### Sources
- shared sphere category, shared topic tags, similar timeline phases, repeated participants, similar agent involvement

### Properties
| Property | Value |
|----------|-------|
| Lines | thicker |
| Color | theme-colored by sphere |
| Visibility | adjustable |
| **Explanation** | **"Connected because X"** ⚡ |

### JSON Model (with explanation)

```json
{
  "thread_context": {
    "id": "uuid",
    "context_fields": {
      "topic": "string",
      "sphere": "business|creative|scholar|...",
      "participants": ["id"],
      "tags": ["string"]
    },
    "related_nodes": ["uuid","uuid"],
    "explanation": "Shared topic: Procurement",
    "version": 1
  }
}
```

### Explanation Field ⚡
> **Human-readable explanation of why this context link exists**
> Example: "Shared topic: Procurement"

### UI (XR/Universe) ⚡
| Property | Value |
|----------|-------|
| Style | colored orbits |
| **Glow-level** | **= density of shared context (NOT importance)** ⚡ |
| Clustering | optional for readability |

### Rules
- NO prediction
- NO similarity inference beyond raw metadata
- NO sentiment analysis

---

## 3) EVOLUTION KNOWLEDGE THREADS (with delta + timeline_order) ⚡

### Purpose
Show chronological transformation of a topic, artifact, or decision across time — **WITHOUT judging outcomes.**

### Sources
- sequential replays, version history of artifacts, decision iterations, long-term sphere activity

### Properties
| Property | Value |
|----------|-------|
| Style | **timeline-like braided line** ⚡ |
| Direction | ALWAYS indicated |
| Timestamps | each node is time-stamped |

### JSON Model (with delta + timeline_order)

```json
{
  "thread_evolution": {
    "id": "uuid",
    "entity": "artifact|decision|topic",
    "versions": [
      {
        "ref": "uuid",
        "timestamp": 1712345678,
        "metadata": { "delta": "updated_section" }
      }
    ],
    "timeline_order": ["uuid1","uuid2","uuid3"],
    "hash": "sha256"
  }
}
```

### New Fields ⚡
| Field | Description |
|-------|-------------|
| `delta` | What changed in this version |
| `timeline_order` | Ordered sequence of node IDs |

### UI ⚡
| Property | Value |
|----------|-------|
| Style | **braided arc** connecting nodes ⚡ |
| Gradient | neutral |
| **Drift markers** | **optional (NOT psychological drift)** ⚡ |
| Labels | exact time labels only |

### Rules
- NO improvement scoring
- NO progress interpretation
- NO success/failure labels

---

## CROSS-THREAD RULES (GLOBAL SAFETY)

### All Threads Must Be
| Rule | Status |
|------|--------|
| transparent | ✅ |
| fully explainable | ✅ |
| user-controlled | ✅ |
| reversible | ✅ |
| **never auto-expanded** | ✅ ⚡ |

### NEVER Allow
- inference of intent
- emotional interpretation
- ranking of threads
- recommended actions

### Immutability
> **All threads reference immutable replay hashes.**

---

## THREADS JSON BUNDLE (UNIFIED MODEL) ⚡ UNIQUE

```json
{
  "knowledge_threads_bundle": {
    "facts": [...],
    "contexts": [...],
    "evolutions": [...],
    "version": "1.0",
    "hash": "sha256",
    "safety": {
      "no_interpretation": true,
      "no_sentiment": true,
      "user_visibility_control": true
    }
  }
}
```

### Safety Block ⚡
| Flag | Description |
|------|-------------|
| `no_interpretation` | No inference |
| `no_sentiment` | No emotion |
| `user_visibility_control` | User controls display |

---

## WHY KNOWLEDGE THREADS MATTER

| Thread | Shows |
|--------|-------|
| **FACT THREADS** | What is connected |
| **CONTEXT THREADS** | Why the context is shared (metadata-only) |
| **EVOLUTION THREADS** | How something changed over time |

### Together
- **clarity without manipulation**
- **coherence without interpretation**
- **structure without influence**

---

**END — FOUNDATION FREEZE READY**
