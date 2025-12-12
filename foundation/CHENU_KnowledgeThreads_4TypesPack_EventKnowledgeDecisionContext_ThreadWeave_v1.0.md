# CHE·NU — KNOWLEDGE THREADS PACK (A+B+C+D)
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / TRACE-ONLY / NON-MANIPULATIVE

---

## PURPOSE OF KNOWLEDGE THREADS ⚡

> **Provide STRUCTURED, FACTUAL connections between data, events, meetings, spheres, replays, and artifacts.**

### RULE
> **Threads = relational fabric of truth. No prediction. No inference. No persuasion.**

---

## A) EVENT THREADS (WHAT HAPPENED) ⚡

### Description
> **Threads linking factual events across:** meetings, replays, artifacts, decisions, users/agents (role-only).

> **Each event = immutable, timestamped, hashed.**

### Event Thread JSON ⚡
```json
{
  "event_thread": {
    "events": ["event_id_1", "event_id_2"],
    "relation": "temporal",
    "metadata": { "topic": "...", "sphere": "..." }
  }
}
```

### Use Cases ⚡
| Use Case | Description |
|----------|-------------|
| audit sequences | ⚡ |
| **multi-sphere timelines** | ⚡ |
| **track the evolution of an idea factually** | ⚡ |

### ETHICAL LOCK ⚡
> **No causal inference, only temporal adjacency.**

---

## B) KNOWLEDGE THREADS (CONTENT LINKS) ⚡

### Purpose
> **Reveal where knowledge is STORED, not what it means.**

### Nodes ⚡
| Node | Description |
|------|-------------|
| artifacts | ⚡ |
| extracted content blocks | ⚡ |
| tags | ⚡ |
| **summaries (neutral)** | ⚡ |
| **replay excerpts** | ⚡ |

### Edges ⚡
| Edge | Description |
|------|-------------|
| references | ⚡ |
| shared topic | ⚡ |
| **cross-document match** | ⚡ |
| **multi-sphere relevance** | ⚡ |

### Knowledge Thread JSON ⚡
```json
{
  "knowledge_thread": {
    "artifacts": ["..."],
    "topics": ["..."],
    "links": [{ "from": "id", "to": "id", "type": "shared_topic" }]
  }
}
```

### ETHICAL LOCK ⚡
> **No weighting of "importance." Thread simply shows connections.**

---

## C) DECISION THREADS (WHY & WHEN, WITHOUT JUDGEMENT) ⚡

### Description
> **Decision Threads track:** decision points, alternative branches, revisited decisions, replay-based justification snapshots.

### Nodes ⚡
| Node | Description |
|------|-------------|
| decision logs | ⚡ |
| timestamped summaries | ⚡ |
| **involved spheres** | ⚡ |
| **linked artifacts** | ⚡ |

### Edges ⚡
| Edge | Description |
|------|-------------|
| `preceded_by` | ⚡ |
| `alternative_to` | ⚡ |
| `clarified_by` | ⚡ |

### Decision Thread JSON ⚡
```json
{
  "decision_thread": {
    "decisions": ["..."],
    "alternatives": ["..."],
    "sequence": ["..."],
    "links": ["..."]
  }
}
```

### ETHICAL LOCK ⚡
> **No ranking of choices. No recommending "better" decisions.**

---

## D) CONTEXT THREADS (WHERE IT BELONGS) ⚡

### Description
> **Context = sphere alignment, domain relevance, meeting environment, role visibility.**

### Purpose
> **Show how a topic spans the ecosystem.**

### Nodes ⚡
| Node | Description |
|------|-------------|
| spheres | ⚡ |
| domains | ⚡ |
| agents (roles only) | ⚡ |
| **active contexts (XR presets, rooms)** | ⚡ |
| **user navigation profiles** | ⚡ |

### Edges ⚡
| Edge | Description |
|------|-------------|
| `belongs_to` | ⚡ |
| `related_to` | ⚡ |
| `viewed_in` | ⚡ |
| `recorded_in` | ⚡ |

### Context Thread JSON ⚡
```json
{
  "context_thread": {
    "context_nodes": ["..."],
    "relationships": ["..."],
    "scope": "personal|collective",
    "hash": "sha256"
  }
}
```

### ETHICAL LOCK ⚡
> **Avoids psychological categorization. Only structural classification.**

---

## HOW THE FOUR THREAD TYPES INTERLOCK ⚡

| Thread Type | = |
|-------------|---|
| **EVENT THREADS** | factual timeline |
| **KNOWLEDGE THREADS** | content linkage |
| **DECISION THREADS** | neutral branching history |
| **CONTEXT THREADS** | structural placement in spheres |

### THREAD_WEAVE ⚡ (NOUVEAU!)
```json
{
  "THREAD_WEAVE": {
    "event": "EventThread",
    "knowledge": "KnowledgeThread",
    "decision": "DecisionThread",
    "context": "ContextThread"
  }
}
```

### ETHICAL RULE ⚡
> **WEAVE = truth fabric. NOT interpretation.**

---

## 7 THREAD ENGINE RULES ⚡

| Rule | Description |
|------|-------------|
| **RULE 1** | append-only ⚡ |
| **RULE 2** | cryptographically hashed ⚡ |
| **RULE 3** | user-controlled visibility ⚡ |
| **RULE 4** | cross-sphere neutralization ⚡ |
| **RULE 5** | no emotional model ⚡ |
| **RULE 6** | no hidden weighting ⚡ |
| **RULE 7** | **XR + 2D identical semantics** ⚡ |

---

## RENDERING THREADS IN UNIVERSE VIEW ⚡

### 2D VIEW ⚡
| Feature | Description |
|---------|-------------|
| nodes as glyphs | ⚡ |
| edges as straight lines | ⚡ |
| **color-coded by thread type** | ⚡ |

### 3D / XR VIEW ⚡
| Feature | Description |
|---------|-------------|
| **threads as floating ribbons** | ⚡ |
| **opacity based on density** | ⚡ |
| **pinch-to-expand clusters** | ⚡ |
| **timeline hovering mode** | ⚡ |

### 4 View Modes ⚡
| Mode | Description |
|------|-------------|
| isolate thread | ⚡ |
| merge threads | ⚡ |
| **highlight cross-sphere link** | ⚡ |
| **compare two threads in XR** | ⚡ |

---

## THREAD EXPORT ⚡

### 3 Export Options ⚡
| Format | Description |
|--------|-------------|
| `.json` | raw ⚡ |
| `.pdf` | visual summary ⚡ |
| `.xrpack` | **XR replay with thread overlay** ⚡ |

### Export JSON ⚡
```json
{
  "thread_export": {
    "type": "event|knowledge|decision|context|weave",
    "hash": "...",
    "timestamp": "...",
    "render_styles": {}
  }
}
```

---

## WHY THREADS MATTER IN CHE·NU ⚡

### Because threads ⚡
| Property | Result |
|----------|--------|
| unify knowledge | without imposing meaning |
| reveal structure | without altering content |
| **empower truth** | **without controlling interpretation** |

> **Four threads = four angles of clarity.**

---

**END — KNOWLEDGE THREAD PACK**
