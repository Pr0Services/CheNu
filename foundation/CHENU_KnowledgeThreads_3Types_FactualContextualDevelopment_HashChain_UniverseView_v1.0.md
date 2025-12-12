# CHE·NU — KNOWLEDGE THREAD SYSTEM (3 TYPES)
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / CROSS-SPHERE

---

## OVERVIEW — PURPOSE

> **Knowledge Threads = secure, traceable pathways** connecting pieces of verified information across spheres, meetings, documents, agents, and replays.

### They DO NOT ⚡
| Forbidden | Status |
|-----------|--------|
| **infer missing meaning** | ❌ ⚡ |
| **rewrite history** | ❌ ⚡ |
| **create narratives** | ❌ ⚡ |
| **steer decisions** | ❌ ⚡ |

### They ONLY ⚡
| Allowed | Status |
|---------|--------|
| **reveal connections** | ✅ ⚡ |
| **organize reality** | ✅ ⚡ |
| **help navigate complexity** | ✅ ⚡ |

> **Che-Nu uses THREE Knowledge Thread types.**

---

## TYPE 1 — FACTUAL THREADS ⚡

### Purpose
Link **FACTS** to their sources, across memory, documents, meetings, and spheres.

### Examples ⚡
| Example | Description |
|---------|-------------|
| A decision in Business references a document in Scholar | ⚡ |
| An artifact in Creative links to earlier meeting notes | ⚡ |
| A XR replay shows an event confirmed in another replay | ⚡ |

### RULE
> **Factual Thread = VERIFIED FACT ONLY.**

### Factual Thread JSON ⚡

```json
{
  "knowledge_thread_factual": {
    "id": "uuid",
    "fact": "string",
    "sources": ["replay_id", "doc_id", "meeting_id"],
    "timestamp": 1712345678,
    "sphere": "business|scholar|creative|...",
    "hash": "sha256",
    "immutability": true
  }
}
```

### Visualization ⚡
| Feature | Description |
|---------|-------------|
| **thin blue line** | ⚡ |
| **straight connections** | ⚡ |
| **always reversible** | ⚡ |
| **no opacity changes based on interpretation** | ⚡ |

### Ethical Locks ⚡
| Lock | Status |
|------|--------|
| **no implied causality** | ✅ ⚡ |
| **no prediction** | ✅ ⚡ |
| **no relevance-ranking** | ✅ ⚡ |
| **no sentiment metadata** | ✅ ⚡ |

---

## TYPE 2 — CONTEXTUAL THREADS ⚡

### Purpose
Connect items that **appear together in a context** WITHOUT asserting meaning or importance.

### Examples ⚡
| Example | Description |
|---------|-------------|
| Topics co-mentioned in meetings | ⚡ |
| Artifacts appearing in same timeline | ⚡ |
| Users touching related spheres | ⚡ |

### RULE
> **Context ≠ justification. Context ≠ meaning.**

### Contextual Thread JSON ⚡

```json
{
  "knowledge_thread_contextual": {
    "id": "uuid",
    "items": ["uuid", "uuid"],
    "context_id": "meeting|replay|sphere_event",
    "co_occurrence_score": "0.0-1.0",
    "trace": true,
    "explainable": "Items were discussed together in Meeting X."
  }
}
```

### Key Fields ⚡
| Field | Description |
|-------|-------------|
| `co_occurrence_score` | **0.0-1.0** ⚡ |
| `explainable` | **human-readable explanation** ⚡ |

### Visualization ⚡
| Feature | Description |
|---------|-------------|
| **dotted line** | ⚡ |
| **fades unless hovered** | ⚡ |
| **no strength bias except co_occurrence score** | ⚡ |

### Ethical Locks ⚡
| Lock | Status |
|------|--------|
| **no context-based recommendation** | ✅ ⚡ |
| **no "importance" scoring** | ✅ ⚡ |
| **must always show explanation text** | ✅ ⚡ |

---

## TYPE 3 — DEVELOPMENT THREADS ⚡

### Purpose
Track the **EVOLUTION of ideas, tasks, features, projects, or knowledge** across time and spheres.

### Examples ⚡
| Example | Description |
|---------|-------------|
| A design evolves through Creative → Business → XR | ⚡ |
| A decision evolves into a method | ⚡ |
| A task evolves into a replayed process | ⚡ |

### RULE
> **Development Thread = timeline of change, NOT evaluation of improvement.**

### Development Thread JSON ⚡

```json
{
  "knowledge_thread_development": {
    "id": "uuid",
    "stages": [
      {
        "timestamp": 1712345678,
        "source": "meeting|document|agent_action",
        "change": "string",
        "sphere": "business|creative|..."
      }
    ],
    "continuity": "guaranteed",
    "hash_chain": ["sha256", "sha256", "..."]
  }
}
```

### Key Fields ⚡ (NOUVEAU!)
| Field | Description |
|-------|-------------|
| `stages[].change` | **description of change** ⚡ |
| `continuity` | **"guaranteed"** ⚡ |
| `hash_chain` | **Array of sha256 hashes** ⚡ |

### Visualization ⚡
| Feature | Description |
|---------|-------------|
| **thick line with nodes** | ⚡ |
| **gradient based on time only** | ⚡ |
| **no "growth" colors or positive/negative cues** | ⚡ |

### Ethical Locks ⚡
| Lock | Status |
|------|--------|
| **no improvement/success labels** | ✅ ⚡ |
| **no performance inference** | ✅ ⚡ |
| **no suggested next step** | ✅ ⚡ |

---

## INTEGRATION WITH COLLECTIVE MEMORY ⚡

| Thread Type | Attaches To |
|-------------|-------------|
| **FACTUAL** | event/decision/artifact entries ⚡ |
| **CONTEXTUAL** | meeting and sphere context blocks ⚡ |
| **DEVELOPMENT** | **versioned change logs** ⚡ |

> **All threads produce immutable hashes and remain auditable.**

---

## INTEGRATION WITH UNIVERSE VIEW ⚡

### Thread Display ⚡
| Type | Visual |
|------|--------|
| **FACTUAL** | blue solid links ⚡ |
| **CONTEXTUAL** | dotted grey links ⚡ |
| **DEVELOPMENT** | **thick time-gradient links** ⚡ |

### User Can ⚡
| Action | Status |
|--------|--------|
| **toggle thread layers** | ✅ ⚡ |
| **isolate threads** | ✅ ⚡ |
| **trace back to origin** | ✅ ⚡ |
| **export threads as JSON or PDF** | ✅ ⚡ |

---

## AGENT ROLES (3-AGENT MODEL) ⚡

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | **extracts links, never infers meaning** ⚡ |
| `AGENT_THREAD_VALIDATOR` | **checks hashes, timestamps, consistency; ensures no circular inference** ⚡ |
| `AGENT_THREAD_EXPLAINER` | **generates human-readable "why this link exists"** ⚡ |

---

## SECURITY & ETHICS SUMMARY ⚡

| Rule | Status |
|------|--------|
| **No narratives** | ✅ ⚡ |
| **No suggestions** | ✅ ⚡ |
| **No psychological shaping** | ✅ ⚡ |
| **No emotional color coding** | ✅ ⚡ |
| **User fully controls visibility** | ✅ ⚡ |
| **All threads are explainable** | ✅ ⚡ |

---

**END — READY FOR BUILD**
