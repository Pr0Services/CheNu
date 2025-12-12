# CHE·NU — KNOWLEDGE THREADS (3 TYPES)
**VERSION:** CORE.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / BUILD-READY

---

## OVERVIEW ⚡

> **Knowledge Threads = STRUCTURED LINKS between:** concepts, artifacts, meetings, decisions, agents, spheres, time windows.

### RULE
> **Knowledge Threads REVEAL connections. They NEVER interpret, persuade, or prescribe.**

### All Threads Are ⚡
| Property | Status |
|----------|--------|
| **factual** | ✅ ⚡ |
| **traceable** | ✅ ⚡ |
| **explainable** | ✅ ⚡ |
| **reversible** | ✅ ⚡ |
| **user-controlled** | ✅ ⚡ |

---

## 1) INTRA-SPHERE KNOWLEDGE THREADS ⚡

### Purpose
> **Connect all related items inside the same sphere** (e.g., Business → meetings, documents, pipelines)

### Examples of Nodes ⚡
| Node | Description |
|------|-------------|
| meeting logs | ⚡ |
| decisions | ⚡ |
| documents | ⚡ |
| replays | ⚡ |
| tasks | ⚡ |
| **agents in that sphere** | ⚡ |
| **user actions** | ⚡ |

### 5 Thread Types ⚡
| Type | Description |
|------|-------------|
| `shared_topic` | ⚡ |
| `shared_artifact` | ⚡ |
| `chain_of_decisions` | ⚡ |
| `same_participants` | ⚡ |
| `repeated_patterns` | **(non-interpretative)** ⚡ |

### Intra-Thread JSON ⚡
```json
{
  "thread": {
    "id": "uuid",
    "scope": "intra",
    "sphere": "business|scholar|creative|...",
    "nodes": ["uuid1", "uuid2", "uuid3"],
    "relation": "shared_topic|artifact|sequence",
    "timestamp": 1712345678,
    "hash": "sha256"
  }
}
```

### Rendering (Universe View) ⚡
| Property | Description |
|----------|-------------|
| **subtle colored curves** | ⚡ |
| **one sphere only** | ⚡ |
| **no cross-context jumps** | ✅ ⚡ |

### Rules ⚡
| Rule | Status |
|------|--------|
| **intra-thread never crosses spheres** | ✅ ⚡ |
| **no predictive linking** | ✅ ⚡ |
| **no "importance" scoring** | ✅ ⚡ |

---

## 2) INTER-SPHERE KNOWLEDGE THREADS ⚡

### Purpose
> **Reveal structural connections between different spheres** (e.g., Scholar research influencing Business decisions, Creative assets referenced in Social posts, etc.)

### Nodes May Come From ⚡
- different databases
- different agents
- **different user contexts**

### 4 Relation Types ⚡
| Type | Description |
|------|-------------|
| `reference` | one sphere uses data from another ⚡ |
| `dependency` | one result unlocks another workflow ⚡ |
| `shared_user` | **same user acted in both contexts** ⚡ |
| `shared_agent` | **agent participated in multiple domains** ⚡ |

### Inter-Thread JSON ⚡
```json
{
  "thread": {
    "id": "uuid",
    "scope": "inter",
    "spheres": ["scholar", "business"],
    "nodes": ["uuidA", "uuidB"],
    "relation": "reference|dependency|shared_user",
    "explainable_reason": "exact phrase: 'Document X from Scholar was cited in Meeting Y in Business.'",
    "hash": "sha256"
  }
}
```

### Key Field: `explainable_reason` ⚡
> **Must always show exact reason for link**

### Rendering (Universe View) ⚡
| Property | Description |
|----------|-------------|
| **slender inter-orbit lines** | ⚡ |
| **optional labels (user must enable)** | ⚡ |
| **color-coded by sphere pair** | ⚡ |

### Rules ⚡
| Rule | Status |
|------|--------|
| **must always show reason for link** | ✅ ⚡ |
| **must not infer intentions** | ✅ ⚡ |
| **must be user-toggleable** | ✅ ⚡ |
| **inter-thread never implies hierarchy** | ✅ ⚡ |

---

## 3) TEMPORAL KNOWLEDGE THREADS (ACROSS TIME) ⚡

### Purpose
> **Link items through time to show evolution, continuity, or change, without judging or interpreting.**

### Example Links ⚡
| Link | Description |
|------|-------------|
| decisions over months | ⚡ |
| versions of a document | ⚡ |
| repeated meetings | ⚡ |
| evolving agent tasks | ⚡ |
| **user learning path (optional & user-scoped)** | ⚡ |

### 4 Thread Types ⚡
| Type | Description |
|------|-------------|
| `chronological_sequence` | ⚡ |
| `version_lineage` | ⚡ |
| `recurrence` | ⚡ |
| `echo_events` | **similar actions** ⚡ |

### Temporal Thread JSON ⚡
```json
{
  "thread": {
    "id": "uuid",
    "scope": "temporal",
    "timeline": [
      { "node": "uuid1", "t": 1712000000 },
      { "node": "uuid2", "t": 1713000000 }
    ],
    "relation": "chronological|lineage|recurrence",
    "hash": "sha256"
  }
}
```

### Rendering (Universe View) ⚡
| Property | Description |
|----------|-------------|
| **timeline bands** | ⚡ |
| **faint glows around earlier nodes** | ⚡ |
| **replay-compatible** | ⚡ |

### Rules ⚡
| Rule | Status |
|------|--------|
| **no predictions** | ✅ ⚡ |
| **no trend analysis without user request** | ✅ ⚡ |
| **no suggestion of future outcomes** | ✅ ⚡ |

---

## COMBINED THREAD ENGINE (ALL 3) ⚡

### ThreadEngine Responsibilities ⚡
| Responsibility | Status |
|----------------|--------|
| build fact-based links only | ✅ ⚡ |
| ensure explainability | ✅ ⚡ |
| validate source integrity | ✅ ⚡ |
| expose toggle controls | ✅ ⚡ |
| **output threads in hashed, immutable form** | ✅ ⚡ |

### ThreadEngine NEVER ⚡
| Forbidden | Status |
|-----------|--------|
| **determines importance** | ❌ ⚡ |
| **hides threads** | ❌ ⚡ |
| **prioritizes outcomes** | ❌ ⚡ |
| **rewrites relationships** | ❌ ⚡ |

### ThreadEngine JSON Model ⚡
```json
{
  "knowledge_threads": {
    "intra": ["..."],
    "inter": ["..."],
    "temporal": ["..."],
    "version": "1.0"
  }
}
```

---

## USER CONTROLS ⚡

| Control | Description |
|---------|-------------|
| enable/disable thread type | ⚡ |
| view thread explanation | ⚡ |
| collapse/expand context | ⚡ |
| **filter by sphere** | ⚡ |
| **filter by time range** | ⚡ |
| **export thread view** | ⚡ |

---

## WHY KNOWLEDGE THREADS MATTER ⚡

| Benefit | Status |
|---------|--------|
| **present factual structure of complexity** | ✅ ⚡ |
| **reveal relationships without bias** | ✅ ⚡ |
| **improve transparency** | ✅ ⚡ |
| **empower understanding rather than prediction** | ✅ ⚡ |

---

**END — FREEZE COMPATIBLE**
