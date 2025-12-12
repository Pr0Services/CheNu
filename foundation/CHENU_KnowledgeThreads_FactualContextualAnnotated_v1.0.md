# CHE·NU — KNOWLEDGE THREADS SYSTEM (FACTUAL/CONTEXTUAL/ANNOTATED)
**VERSION:** CORE.v1.0  
**TYPE:** KNOWLEDGE STRUCTURE / NON-MANIPULATIVE / FOUNDATION

---

## GLOBAL PRINCIPLE

> Knowledge Threads connect **INFORMATION**, not opinions, not conclusions.

### They DO NOT:
- decide, recommend, rank truth, guide beliefs

### They ONLY:
- **link, trace, contextualize**

---

## THREAD TYPE 1 — FACTUAL THREADS

### Purpose
Connect objective information across time, meetings, spheres, and documents.

### Examples
- same concept discussed in different meetings
- same artifact reused in multiple contexts
- same decision referenced later

### Factual Thread Sources ⚡
- XR replay events, meeting artifacts, documents, data objects, declared decisions

### Factual Thread Rules ⚡
| Rule | Status |
|------|--------|
| append-only | ✅ |
| versioned | ✅ |
| source-backed | ✅ |
| no interpretation layer | ✅ |
| **verifiable via replay hashes** | ✅ ⚡ |

### Factual Thread JSON (with created_by + visibility) ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "factual",
    "nodes": [
      { "ref": "artifact|event|decision_id", "timestamp": 171234 }
    ],
    "created_by": "system",
    "visibility": "private|shared|public"
  }
}
```

### Factual Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `nodes[].ref` | **artifact/event/decision_id** ⚡ |
| `created_by` | **"system"** ⚡ |
| `visibility` | **private/shared/public** |

---

## THREAD TYPE 2 — CONTEXTUAL THREADS

### Purpose
Show how **CONTEXT evolved around facts** without inferring meaning.

### Tracks ⚡
- when, where, sphere, participants, environmental state

### Contextual Thread Sources ⚡
| Source | Description |
|--------|-------------|
| meeting metadata | ✅ |
| sphere context | ✅ |
| **avatar state** | ⚡ |
| **meeting mode** | analysis / review / creative ⚡ |
| time proximity | ✅ |

### Contextual Thread Rules ⚡
| Rule | Status |
|------|--------|
| descriptive only | ✅ |
| no sentiment | ✅ |
| no outcome inference | ✅ |
| **reversible view** | ✅ ⚡ |
| **optional display** | ✅ ⚡ |

### Contextual Thread JSON (with mode field) ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "contextual",
    "context_nodes": [
      {
        "meeting_id": "uuid",
        "sphere": "business|scholar|xr|...",
        "mode": "analysis|creative|review",
        "timestamp": 171234
      }
    ]
  }
}
```

### Contextual Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `context_nodes` | **Array** ⚡ |
| `context_nodes[].mode` | **analysis/creative/review** ⚡ |

---

## THREAD TYPE 3 — USER-ANNOTATED THREADS ⚡

### Purpose
Allow **USERS to create PERSONAL connections** between information — without affecting shared truth.

### Annotated Thread Features ⚡
| Feature | Description |
|---------|-------------|
| **personal notes** | ⚡ |
| **labels** | ⚡ |
| **highlights** | ⚡ |
| **private hypotheses** | ⚡ |
| **bookmarks** | ⚡ |

### Annotated Thread Rules ⚡
| Rule | Status |
|------|--------|
| **private by default** | ✅ ⚡ |
| **explicitly shareable** | ✅ ⚡ |
| **never merged with factual threads** | ✅ ⚡ |
| **visually distinct** | ✅ ⚡ |
| **user-removable** | ✅ ⚡ |

### Annotated Thread JSON ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "annotated",
    "owner": "user_id",
    "annotations": [
      {
        "ref": "node_id",
        "note": "user text",
        "created_at": 171234
      }
    ]
  }
}
```

### Annotated Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `type` | **"annotated"** ⚡ |
| `owner` | **user_id** ⚡ |
| `annotations` | **Array of {ref, note, created_at}** ⚡ |

---

## THREAD VISUALIZATION (UNIVERSE VIEW)

### Visual Styles ⚡
| Thread Type | Style |
|-------------|-------|
| factual threads | solid lines |
| contextual threads | dashed lines |
| **annotated threads** | **dotted personal lines** ⚡ |

### Toggle ⚡
> **Toggle per type. No forced visibility.**

---

## THREAD NAVIGATION BEHAVIOR ⚡

| Behavior | Description |
|----------|-------------|
| clicking thread | **highlights all related nodes** ⚡ |
| hover | **shows summary (non-interpretive)** ⚡ |
| filter | by sphere / time / owner |

---

## AGENTS (NON-AUTHORITATIVE)

| Agent | Role |
|-------|------|
| `AGENT_THREAD_INDEXER` | builds factual threads, **no visibility control** ⚡ |
| `AGENT_CONTEXT_MAPPER` | maps contextual threads, **descriptive only** ⚡ |
| `AGENT_ANNOTATION_ASSIST` | assists user note-taking, **never auto-creates notes** ⚡ |

---

## ETHICAL & SAFETY LOCKS

| Lock | Status |
|------|--------|
| no narrative synthesis | ✅ |
| no opinion layering | ✅ |
| **no dominance ranking** | ✅ ⚡ |
| **user retains authorship** | ✅ ⚡ |
| **system retains neutrality** | ✅ ⚡ |

---

## WHY KNOWLEDGE THREADS MATTER

They allow:
- **memory without rewriting**
- **clarity without control**
- **insight without manipulation**

> **One reality. Many views. Zero coercion.**

---

**END — KNOWLEDGE THREADS FOUNDATION**
