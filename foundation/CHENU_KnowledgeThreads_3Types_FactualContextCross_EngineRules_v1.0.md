# CHE·NU — KNOWLEDGE THREAD SYSTEM (3 TYPES + ENGINE RULES)
**VERSION:** CORE.KT.v1.0  
**MODE:** FOUNDATION / TRACE-ONLY / NON-MANIPULATIVE

---

## PURPOSE

> Connect information, meetings, decisions, artifacts, and spheres **WITHOUT interpretation or persuasion.**

### RULE
> **Knowledge Threads == PURE CONNECTIONS. Not conclusions, not advice, not ranking.**

---

## 3 TYPES OF KNOWLEDGE THREADS

| # | Type | Description |
|---|------|-------------|
| 1 | FACTUAL THREAD | Connects facts to facts |
| 2 | CONTEXT THREAD | Connects within same sphere |
| 3 | CROSS-SPHERE THREAD | Connects across spheres |

> **All three use the same structural rules, JSON format, and safety limits.**

---

## 1) FACTUAL KNOWLEDGE THREAD

### Purpose
Connects **facts to facts** across meetings, documents, or replays.

### Examples ⚡
- A definition repeated across sessions
- A decision referencing an earlier artifact
- **A repeated numeric or structural pattern** ⚡

### Rules ⚡
- No inference
- No hypothesis
- No suggestion

### Factual Thread JSON (with relationship types) ⚡

```json
{
  "kt_fact": {
    "id": "uuid",
    "nodes": ["fact_id_1","fact_id_2"],
    "source_replays": ["uuid","uuid"],
    "relationship": "identical|reference|repeat",
    "hash": "sha256"
  }
}
```

### Factual Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `source_replays` | **Array of replay UUIDs** ⚡ |
| `relationship` | **identical/reference/repeat** ⚡ |

### Visualization ⚡
| Property | Value |
|----------|-------|
| Lines | **thin straight lines** |
| Color | **neutral color** |
| Animation | **no animations** ⚡ |

---

## 2) CONTEXT KNOWLEDGE THREAD

### Purpose
Connects elements **within the same sphere** to provide structural clarity.

### Examples ⚡
- Tasks linked inside Business
- Research notes linked inside Scholar
- **Creative assets linked inside Studio** ⚡

### Rules ⚡
| Rule | Status |
|------|--------|
| **Must stay in the SAME sphere** | ✅ ⚡ |
| Must be context-neutral | ✅ |
| **Must never imply priority** | ✅ ⚡ |

### Context Thread JSON (with type + metadata) ⚡

```json
{
  "kt_context": {
    "id": "uuid",
    "sphere": "business|scholar|creative|...",
    "nodes": ["item_a","item_b","item_c"],
    "type": "sequence|dependency|cluster",
    "metadata": { "user_defined": true }
  }
}
```

### Context Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `type` | **sequence/dependency/cluster** ⚡ |
| `metadata.user_defined` | **true** ⚡ |

### Visualization ⚡
| Property | Value |
|----------|-------|
| Lines | **soft curved lines** ⚡ |
| Color | **sphere theme** |
| Grouping | **clustering allowed but no forced grouping** ⚡ |

---

## 3) CROSS-SPHERE KNOWLEDGE THREAD

### Purpose
Connects **related information across spheres** without imposing hierarchy.

### Examples ⚡
- Scholar research used in Business plan
- **Creative asset used in XR meeting** ⚡
- **Methodology rule referenced in Institution sphere** ⚡

### Rules ⚡
| Rule | Status |
|------|--------|
| **Never imply authority from one sphere to another** | ✅ ⚡ |
| Must remain descriptive | ✅ |
| **Must expose the origin of each node** | ✅ ⚡ |

### Cross-Sphere Thread JSON (with direction: none) ⚡

```json
{
  "kt_cross": {
    "id": "uuid",
    "nodes": [
      { "item": "uuid", "sphere": "scholar" },
      { "item": "uuid", "sphere": "business" }
    ],
    "relationship": "reference|reuse|parallel",
    "direction": "none"
  }
}
```

### Cross-Sphere Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `nodes[].sphere` | **Per-node sphere** ⚡ |
| `relationship` | **reference/reuse/parallel** ⚡ |
| `direction` | **"none" — NO directional influence** ⚡ |

### Visualization ⚡
| Property | Value |
|----------|-------|
| Lines | **dotted lines between spheres** ⚡ |
| Color | **color shift gradient** ⚡ |
| Animation | **no pulsing or attention cues** ⚡ |

---

## KNOWLEDGE THREAD ENGINE — CORE RULES ⚡

| Rule | Description |
|------|-------------|
| **RULE 1 — APPEND ONLY** | Threads can be added, never retro-modified ⚡ |
| **RULE 2 — TRACE ORIGIN** | Every thread must point to source artifacts or replays ⚡ |
| **RULE 3 — ZERO SEMANTIC INTERPRETATION** | Engine cannot guess meaning or relevance ⚡ |
| **RULE 4 — USER OVERRIDE** | Users may hide, mute, or delete their personal KT views ⚡ |
| **RULE 5 — MULTI-VIEW COHERENCE** | Never rearranges data content ⚡ |

### Rule 5 Details ⚡
Universe View displays threads:
- in 2D minimal mode
- in 3D orbit mode
- in XR immersive layers
- **but NEVER rearranges data content**

---

## KNOWLEDGE THREAD RENDERING (2D / 3D / XR) ⚡

### 2D ⚡
| Property | Value |
|----------|-------|
| Format | **simple SVG lines** ⚡ |
| Interaction | **hover to show nodes** ⚡ |

### 3D ORBIT ⚡
| Property | Value |
|----------|-------|
| Style | **radial threads** ⚡ |
| Visibility | **based on density preference** ⚡ |

### XR ⚡
| Property | Value |
|----------|-------|
| Style | **floating thread ribbons** ⚡ |
| Anchoring | **anchored to context nodes** ⚡ |
| Motion | **zero motion unless user pulls a thread open** ⚡ |

---

## KNOWLEDGE THREAD STORAGE ⚡

```json
{
  "knowledge_threads": {
    "fact": [...],
    "context": [...],
    "cross": [...],
    "version": 1,
    "integrity_hash": "sha256"
  }
}
```

---

## AGENTS INVOLVED

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | **builds threads automatically** ⚡ |
| `AGENT_THREAD_GUARD` | blocks invalid or unsafe connections |
| `AGENT_THREAD_EXPLAINER` | describes in plain text, **pure explanation, no suggestion** ⚡ |

---

## COMBINED SAFETY LIMITS ⚡

| Limit | Status |
|-------|--------|
| NO causality | ✅ |
| NO implication | ✅ |
| NO advice | ✅ |
| NO persuasion | ✅ |
| **NO emotional cues** | ✅ ⚡ |
| **Pure relational scaffolding** | ✅ ⚡ |

---

**END — FREEZE READY**
