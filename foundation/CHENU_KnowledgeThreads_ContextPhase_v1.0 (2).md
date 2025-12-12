# CHE·NU — KNOWLEDGE THREADS SYSTEM (CONTEXT PHASE)
**VERSION:** FOUNDATION v1.0  
**MODE:** CORE KNOWLEDGE / NON-MANIPULATIVE / FREEZE-READY

---

## GLOBAL PRINCIPLE

> A Knowledge Thread is a **TRACE OF INFORMATION.** It links facts across time, spheres, agents, and users **WITHOUT interpretation, ranking, or narrative shaping.**

> **THREADS OBSERVE.**  
> **THEY DO NOT CONCLUDE.**

---

## THREAD TYPE 1 — FACT THREAD

### Purpose
Track objective facts, artifacts, and events exactly as they occurred.

### Sources
- XR replays, meeting artifacts, documents, notes, timelines, agent actions (trace only)

### Characteristics
| Property | Value |
|----------|-------|
| append-only | ✅ |
| immutable | ✅ |
| timestamped | ✅ |
| source-linked | ✅ |
| hash-verified | ✅ |

### JSON Model

```json
{
  "fact_thread": {
    "id": "uuid",
    "topic": "string",
    "entries": [
      {
        "type": "event|artifact|decision",
        "source": "replay|meeting|document",
        "timestamp": 1712345678,
        "sphere": "business|scholar|xr|...",
        "hash": "sha256"
      }
    ],
    "visibility": "private|shared|public"
  }
}
```

### Prohibitions
- no sentiment
- no success/failure
- no priority score

---

## THREAD TYPE 2 — CONTEXT THREAD (with phase + tools) ⚡

### Purpose
Track WHY information appeared, in what environment, under which conditions.

### Sources
- meeting type, sphere context, participant set, tools used, decision state (pre/during/post)

### Characteristics
| Property | Value |
|----------|-------|
| descriptive only | ✅ |
| no judgment | ✅ |
| no inference of intent | ✅ |
| parallel to Fact Threads | ✅ |

### JSON Model (with phase + tools + participants_count) ⚡

```json
{
  "context_thread": {
    "id": "uuid",
    "linked_fact_thread": "uuid",
    "context": {
      "sphere": "string",
      "meeting_type": "analysis|creative|decision",
      "participants_count": 5,
      "tools": ["board","timeline"],
      "phase": "exploration|review|closure"
    }
  }
}
```

### New Context Fields ⚡
| Field | Description |
|-------|-------------|
| `participants_count` | Number of participants |
| `tools` | Array of tools used |
| `phase` | exploration / review / closure |

### Phase Types ⚡
| Phase | Description |
|-------|-------------|
| `exploration` | Initial discovery |
| `review` | Examining existing |
| `closure` | Finalizing |

### Prohibitions
- no causal claims
- no "reason why people decided"
- no behavioral modeling

---

## THREAD TYPE 3 — EVOLUTION THREAD (with change_type + from/to) ⚡

### Purpose
Track HOW knowledge changed over time, **without defining if it improved or worsened.**

### Sources
- changes in artifacts, revisions, branching decisions, abandoned paths, resurfaced ideas

### Characteristics
| Property | Value |
|----------|-------|
| temporal deltas only | ✅ |
| no quality metrics | ✅ |
| no optimization labels | ✅ |

### JSON Model (with change_type + from/to)

```json
{
  "evolution_thread": {
    "id": "uuid",
    "linked_fact_thread": "uuid",
    "changes": [
      {
        "from": "version_id",
        "to": "version_id",
        "timestamp": 1712345678,
        "change_type": "added|removed|revised|paused"
      }
    ]
  }
}
```

### Change Types ⚡
| Type | Description |
|------|-------------|
| `added` | New content added |
| `removed` | Content removed |
| `revised` | Content modified |
| `paused` | Work paused |

---

## THREAD RELATIONSHIP GRAPH

| Thread | Shows |
|--------|-------|
| **Fact Thread** | WHAT |
| **Context Thread** | WHERE & WHEN |
| **Evolution Thread** | HOW IT CHANGED |

### Rules
- They **MUST remain separate**
- They **MAY be displayed together**
- They **MUST NOT merge semantics**

---

## ACCESS & SAFETY

| Feature | Status |
|---------|--------|
| User-level visibility | ✅ |
| Sphere-level visibility | ✅ |
| Explicit sharing only | ✅ |
| Full provenance visible | ✅ |
| **One-click source inspection** | ✅ ⚡ |

### One-Click Source Inspection ⚡
> **Immediately jump to the original source from any thread node**

---

## VISUALIZATION RULES ⚡

| Rule | Status |
|------|--------|
| Threads shown as lines or strands | ✅ |
| No arrows implying directionality | ✅ |
| **No thickness implying importance** | ✅ ⚡ |
| Color = type only | ✅ |

---

## WHY THIS MATTERS

### Knowledge Threads Allow
- **memory without rewriting**
- **comparison without bias**
- **learning without manipulation**

### They Protect
- **truth**
- **autonomy**
- **plurality of interpretation**

---

**END — FOUNDATION FREEZE**
