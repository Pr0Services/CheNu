# CHE·NU — KNOWLEDGE THREAD SYSTEM (COLOR CODING)
**VERSION:** CORE.v1.0  
**TYPE:** FOUNDATION / CROSS-SPHERE / NON-MANIPULATIVE

---

## GLOBAL PRINCIPLE — KNOWLEDGE THREAD

> **A Knowledge Thread is a TRACEABLE LINE OF KNOWLEDGE**  
> connecting facts, decisions, artifacts, meetings, agents, and users **ACROSS TIME & SPHERES.**

### RULE
> **Threads LINK information.**  
> **They DO NOT interpret, judge, or optimize.**

---

## THREAD TYPE 1 — FACTUAL THREAD

### Purpose
Track objective information flow.

### Sources
- documents, notes, datasets, references, meeting artifacts

### Characteristics
- time-ordered
- immutable after validation
- factual only

### Never Includes
- ❌ opinions
- ❌ interpretations
- ❌ inferred intent

### JSON Model (with sphere_scope)

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "factual",
    "entries": [
      {
        "source": "artifact|meeting|note",
        "ref_id": "uuid",
        "timestamp": 1712345678
      }
    ],
    "sphere_scope": ["business","scholar"],
    "hash": "sha256"
  }
}
```

---

## THREAD TYPE 2 — DECISION THREAD

### Purpose
Trace how a decision emerged over time.

### Sources
- meetings, decision logs, XR replays, agent actions, silence intervals

### Characteristics
- chronological
- replay-linked
- context-aware

### Does NOT
- ❌ rank decisions
- ❌ label outcomes as good/bad
- ❌ suggest alternatives

### JSON Model (with action states)

```json
{
  "decision_thread": {
    "id": "uuid",
    "type": "decision",
    "goal": "string",
    "steps": [
      {
        "meeting_id": "uuid",
        "action": "proposed|reviewed|declared",
        "timestamp": 1712345678
      }
    ],
    "linked_replays": ["uuid"],
    "hash": "sha256"
  }
}
```

### Decision Action States

| Action | Description |
|--------|-------------|
| `proposed` | Initial proposal |
| `reviewed` | Under review |
| `declared` | Final declaration |

---

## THREAD TYPE 3 — CONTEXT THREAD

### Purpose
Preserve WHY something existed or mattered, **without asserting meaning.**

### Sources
- meeting metadata
- user annotations (explicit)
- domain context
- sphere state

### Characteristics
- optional
- user-authored or system-logged
- clearly marked as contextual

### Must Be
- ✅ labeled as context
- ✅ separable from facts

### JSON Model

```json
{
  "context_thread": {
    "id": "uuid",
    "type": "context",
    "description": "user-authored",
    "related_entities": ["meeting","decision","artifact"],
    "visibility": "private|shared",
    "hash": "sha256"
  }
}
```

---

## THREAD VISUALIZATION — COLOR CODING

### Official Color Scheme

| Thread Type | Color | Style |
|-------------|-------|-------|
| **Factual** | neutral white | solid |
| **Decision** | blue | solid |
| **Context** | grey | dotted |

### Interaction
| Element | Behavior |
|---------|----------|
| Hover | reveals source |
| Click | opens thread timeline |

### Forbidden Visual Effects
- ❌ emphasis effects
- ❌ directional arrows
- ❌ implied causality

---

## THREAD INTERACTIONS

### ✅ Allowed

| Action | Description |
|--------|-------------|
| `follow thread` | Navigate along thread |
| `filter by type` | Show/hide by type |
| `open source node` | Access original |
| `export thread summary` | Export data |

### ❌ Not Allowed

| Action | Status |
|--------|--------|
| auto-merge | ❌ |
| auto-prioritize | ❌ |
| scoring | ❌ |

---

## THREAD ACCESS & SAFETY

| Rule | Status |
|------|--------|
| explicit permission per thread | ✅ |
| private threads remain invisible | ✅ |
| shared threads logged | ✅ |
| **thread deletion = tombstone marker only** | ✅ |

### Tombstone Deletion ⚡
> Threads are never truly deleted - only marked with tombstone.
```json
{
  "deleted": true,
  "tombstone": "2024-04-06T12:00:00Z",
  "reason": "user_request"
}
```

---

## THREAD AGENTS

| Agent | Role |
|-------|------|
| `AGENT_THREAD_INDEXER` | Links new entities to threads, **no interpretation** |
| `AGENT_THREAD_GUARD` | Ensures thread separation, **prevents cross-type contamination** |
| `AGENT_THREAD_VISUALIZER` | Prepares render data, **no semantic analysis** |

---

## WHY 3 THREADS

| Thread | Answers |
|--------|---------|
| **Factual** | What exists |
| **Decision** | What was chosen |
| **Context** | Why it existed |

### Together
> **Traceability, clarity, accountability WITHOUT narrative control**

---

**END — FOUNDATION COMPLETE**
