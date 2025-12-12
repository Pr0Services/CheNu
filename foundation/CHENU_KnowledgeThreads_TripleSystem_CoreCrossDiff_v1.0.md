# CHE·NU — KNOWLEDGE THREADS ENGINE (TRIPLE SYSTEM)
**MODE:** FOUNDATION / CROSS-SPHERE / MEMORY-ALIGNED

---

## I) KNOWLEDGE THREADS — CORE ENGINE

### Purpose
Represent connections between concepts, notes, meetings, artifacts, and decisions, **WITHOUT interpretation or persuasion.**

### RULE
> **Thread = CONNECTION, not meaning.**

### Thread Node Types ⚡
| Type | Description |
|------|-------------|
| concept | ✅ |
| artifact | ✅ |
| replay | ✅ |
| meeting | ✅ |
| **agent output** | ⚡ |
| **sphere topic** | ⚡ |
| **user note** | ⚡ |

### Thread Edge Types ⚡
| Type | Description |
|------|-------------|
| `references` | Reference link |
| `cites` | **Citation** ⚡ |
| `continues` | **Continuation** ⚡ |
| `precedes` | Temporal order |
| `contrasts` | **Contrast link** ⚡ |
| `derived_from` | Derivation |
| `linked_by_agent` | **Agent-created link** ⚡ |

### Edges NEVER Include ⚡
- emotional tone
- value judgments
- persuasion metadata

### Core Thread JSON ⚡

```json
{
  "thread": {
    "id": "uuid",
    "nodes": ["node_id"],
    "edges": [
      { "from": "node_id", "to": "node_id", "type": "ref" }
    ],
    "context": "sphere|meeting|user",
    "hash": "sha256"
  }
}
```

### Thread Evolution Rules ⚡
| Rule | Status |
|------|--------|
| append-only | ✅ |
| immutable past versions | ✅ |
| **new edge = new version** | ✅ ⚡ |
| **no hidden merges** | ✅ ⚡ |
| **no summarization unless explicitly requested** | ✅ ⚡ |

---

## II) CROSS-SPHERE KNOWLEDGE THREADS

### Purpose
Reveals how ideas travel **BETWEEN spheres**, without distorting or predicting meaning.

### Spheres Supported ⚡
business, scholar, creative, institutions, social, methodology, XR, personal, **IA laboratory** ⚡, **my team** ⚡

### Cross-Sphere Logic ⚡
**A thread becomes cross-sphere when:**
- same concept appears in multiple spheres
- same artifact influences 2+ domains
- replay/meeting references cross-sphere documents
- user explicitly links notes between spheres

> **NO AUTOMATIC SEMANTIC GUESSING.**

### Cross-Sphere JSON (with bridges + reason) ⚡

```json
{
  "cross_thread": {
    "id": "uuid",
    "spheres": ["business","creative","xr"],
    "shared_nodes": ["node_id"],
    "bridges": [
      {
        "from_sphere": "business",
        "to_sphere": "creative",
        "reason": "shared_artifact"
      }
    ]
  }
}
```

### Cross-Sphere Fields ⚡
| Field | Description |
|-------|-------------|
| `shared_nodes` | **Array of shared node_ids** ⚡ |
| `bridges` | **Array of {from_sphere, to_sphere, reason}** ⚡ |

### Visualization (Universe View) ⚡
| Property | Value |
|----------|-------|
| **sphere orbits pulse faintly when connected** | ⚡ |
| **thread arcs drawn as subtle ribbons** | ⚡ |
| **NO movement unless user interacts** | ⚡ |
| **user clicks node → expands thread bundle** | ⚡ |

---

## III) PERSONAL vs COLLECTIVE KNOWLEDGE THREAD DIFF ⚡

### Purpose
Show the **DIFFERENCE** between personal knowledge mapping and collective (team or organization) mapping, **WITHOUT value judgment or ranking.**

### RULE
> **Diff highlights differences, NEVER preferences.**

### Diff Types ⚡
| Type | Description |
|------|-------------|
| `DIFF_NODE_MISSING` | **appears in collective, not in personal** ⚡ |
| `DIFF_EDGE_EXCLUSIVE` | **personal-only connection** ⚡ |
| `DIFF_CONTEXT_SHIFT` | **same node, different sphere anchoring** ⚡ |
| `DIFF_TIMELINE_SHIFT` | **referenced earlier or later across profiles** ⚡ |

### Diff JSON ⚡

```json
{
  "thread_diff": {
    "user_id": "uuid",
    "collective_id": "uuid",
    "diffs": [
      { "type": "node_missing", "node": "x" },
      { "type": "edge_exclusive", "edge": "y" }
    ],
    "timestamp": "...",
    "hash": "sha256"
  }
}
```

### Presentation Rules ⚡
| Rule | Status |
|------|--------|
| **color coding only (no labels like "important")** | ✅ ⚡ |
| **diff listed factually (no suggestion)** | ✅ ⚡ |
| **must indicate "this is not an evaluation"** | ✅ ⚡ |

---

## INTERACTION RULESET

### Allowed ⚡
- view, filter, export json/pdf, trace lineage of threads

### Not Allowed ⚡
| Action | Status |
|--------|--------|
| **reordering threads to imply hierarchy** | ❌ |
| **predictive completion** | ❌ |
| **meaning inference** | ❌ |
| **relevance scoring** | ❌ |

---

## AGENT ROLES

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | creates threads from **explicit signals only** ⚡ |
| `AGENT_THREAD_GUARD` | prevents cross-sphere inference, **enforces append-only** ⚡ |
| `AGENT_THREAD_VIEWER` | renders visually, **no modification authority** ⚡ |
| `AGENT_CONTEXT_EXPLAINER` | explains WHY linked, **never explains meaning** ⚡ |

---

## UNIVERSE VIEW BINDING ⚡

| Feature | Description |
|---------|-------------|
| **threads anchored to sphere clusters** | ⚡ |
| **threads glow slightly when selected** | ⚡ |
| **replay nodes show small thread badges** | ⚡ |
| **zoom-in reveals microthreads** | ⚡ |
| **zoom-out reveals macrothreads** | ⚡ |

---

## SAFETY & ETHICS

| Guarantee | Status |
|-----------|--------|
| no psychological modeling | ✅ |
| no behavior inference | ✅ |
| no intent inference | ✅ |
| **no suggestion of "missing knowledge"** | ✅ ⚡ |
| **private threads remain private unless explicitly shared** | ✅ ⚡ |

---

**END — KNOWLEDGE THREADS TRIPLE SYSTEM**
