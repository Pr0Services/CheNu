# CHE·NU — KNOWLEDGE THREADS (USER-AUTHORED)
**VERSION:** FOUNDATION v1.0  
**MODE:** NON-MANIPULATIVE / TRACEABLE / BUILD-READY

---

## GLOBAL PRINCIPLE

> **Knowledge Threads connect INFORMATION,**  
> **NOT opinions, NOT conclusions.**

> **Threads = LINKS BETWEEN FACTS, never interpretations.**

---

## THREAD TYPE 1 — FACTUAL THREAD

### Purpose
Link verified facts across meetings, documents, decisions, artifacts, and time.

### Sources
- XR replays (validated), decision logs, documents, timestamps, agent actions (trace-only)

### Rules
| Rule | Status |
|------|--------|
| append-only | ✅ |
| immutable | ✅ |
| hash-verified | ✅ |
| source-required | ✅ |

### Use Cases
- audit, recall, comparison, traceability

### JSON Model

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "factual",
    "nodes": [
      { "ref": "meeting|doc|decision", "id": "uuid" }
    ],
    "created_by": "system",
    "verified": true,
    "hash": "sha256"
  }
}
```

---

## THREAD TYPE 2 — CONTEXTUAL THREAD (with relation_reason) ⚡

### Purpose
Explain WHY facts are related **without asserting meaning or outcome.**

### Sources
- shared topic, temporal proximity, shared participants, shared artifacts

### Rules
| Rule | Status |
|------|--------|
| optional | ✅ |
| non-authoritative | ✅ |
| user-visible explanation | ✅ |
| never ranked | ✅ |

### Use Cases
- navigation assistance, universe view clustering, routing explanation

### JSON Model (with relation_reason)

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "contextual",
    "nodes": [
      { "ref": "meeting|sphere|agent", "id": "uuid" }
    ],
    "relation_reason": "shared_topic|time|artifact",
    "confidence": 0.61
  }
}
```

### Relation Reasons ⚡
| Reason | Description |
|--------|-------------|
| `shared_topic` | Same topic discussed |
| `time` | Temporal proximity |
| `artifact` | Shared artifact used |

---

## THREAD TYPE 3 — USER-AUTHORED THREAD ⚡ UNIQUE

### Purpose
Allow users to **manually link information** to represent their OWN understanding.

### Rules
| Rule | Status |
|------|--------|
| clearly marked as user-authored | ✅ |
| reversible | ✅ |
| private by default | ✅ |
| **never merged into factual threads** | ✅ ⚡ |

### Use Cases
- personal reasoning
- hypothesis tracking
- learning paths

### JSON Model (with editable)

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "user_authored",
    "owner": "user_id",
    "nodes": [
      { "ref": "any", "id": "uuid" }
    ],
    "visibility": "private|shared",
    "editable": true
  }
}
```

### Unique Fields ⚡
| Field | Description |
|-------|-------------|
| `owner` | User who created thread |
| `editable` | **Can be modified** (unlike factual) |
| `visibility` | private or shared |

---

## THREAD VISUALIZATION RULES

| Thread Type | Line Style |
|-------------|------------|
| **factual** | solid lines |
| **contextual** | dotted lines |
| **user-authored** | dashed lines |

### Visual Properties
- Color-coded per type
- Toggleable per view
- **Never forced on screen**

---

## THREAD INTERACTIONS

| Interaction | Description |
|-------------|-------------|
| highlight connected nodes | Show relations |
| isolate thread | Focus view |
| compare threads | Side-by-side |
| export (PDF / graph) | Save/share |
| hide / show per session | User control |

---

## AGENT PARTICIPATION

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | Builds factual threads only, **requires verification** |
| `AGENT_CONTEXT_LINKER` | **Proposes contextual threads, confidence disclosed** ⚡ |
| `AGENT_THREAD_GUARD` | Enforces separation of types, **prevents pollution or merging** |

### AGENT_CONTEXT_LINKER ⚡ NEW
> **"Proposes contextual threads, confidence disclosed"**
- Suggests relationships
- Shows confidence score
- User must approve

---

## WHY 3 THREADS

| Thread | Shows |
|--------|-------|
| **FACTS** | what happened |
| **CONTEXT** | why they connect |
| **USER** | how I understand it |

> **No thread dominates. No narrative enforced.**

---

**END — FREEZE READY**
