# CHE·NU — KNOWLEDGE THREAD SYSTEM (PERSONAL THREAD)
**VERSION:** CORE.v1.0  
**TYPE:** FOUNDATION / CROSS-SPHERE / NON-MANIPULATIVE

---

## GLOBAL DEFINITION

> A Knowledge Thread is a **CONTINUOUS TRACE** of information across time, spheres, meetings, decisions, and artifacts.

### RULE
> **Thread = TRACE**  
> **NOT story, NOT opinion, NOT interpretation.**

---

## THREAD TYPE 1 — FACTUAL THREAD

### Purpose
Track objective information, artifacts, and decisions as they actually occurred.

### Sources
- meeting replays, documents & files, decision records, timestamps, agent actions (logged only)

### Characteristics
| Property | Value |
|----------|-------|
| immutable | ✅ |
| append-only | ✅ |
| time-ordered | ✅ |
| cryptographically verifiable | ✅ |
| sphere-aware | ✅ |

### Examples
- evolution of a project decision
- version history of a document
- compliance timeline
- research progression

### JSON Model

```json
{
  "thread": {
    "id": "uuid",
    "type": "factual",
    "entries": [
      {
        "source": "meeting|doc|decision",
        "ref_id": "uuid",
        "timestamp": 1712345678,
        "sphere": "business|scholar|xr",
        "hash": "sha256"
      }
    ],
    "immutable": true
  }
}
```

---

## THREAD TYPE 2 — CONTEXT THREAD (with meeting_mode + xr_preset) ⚡

### Purpose
Capture surrounding CONTEXT without judgment: why something happened in that moment.

### Sources
- meeting metadata, participant list, agenda, scope, environmental state (XR preset, mode)

### Characteristics
| Property | Value |
|----------|-------|
| descriptive only | ✅ |
| no success/failure | ✅ |
| no intent inference | ✅ |
| parallel to factual threads | ✅ |

### Examples
- same decision made under different constraints
- environmental differences between meetings
- domain-specific framing

### JSON Model (with meeting_mode + xr_preset) ⚡

```json
{
  "thread": {
    "id": "uuid",
    "type": "context",
    "entries": [
      {
        "linked_factual_thread": "uuid",
        "meeting_mode": "analysis|creative|decision",
        "participants": 5,
        "sphere": "business",
        "xr_preset": "xr_classic",
        "timestamp": 1712345678
      }
    ]
  }
}
```

### New Fields ⚡
| Field | Description |
|-------|-------------|
| `meeting_mode` | analysis / creative / decision |
| `xr_preset` | XR environment preset used |
| `linked_factual_thread` | Reference to fact thread |

---

## THREAD TYPE 3 — PERSONAL THREAD ⚡ UNIQUE

### Purpose
Allow each user to maintain a **PERSONAL VIEW** of how information connects for them.

### Sources
- user bookmarks, private notes, highlights, navigation paths

### Characteristics
| Property | Value |
|----------|-------|
| **private by default** | ✅ ⚡ |
| editable | ✅ |
| optional sharing | ✅ |
| **NEVER alters factual or context threads** | ✅ ⚡ |

### Examples
- personal understanding of a project
- learning path
- strategic reasoning
- long-term reflection

### JSON Model (with owner + note + ref_thread) ⚡

```json
{
  "thread": {
    "id": "uuid",
    "type": "personal",
    "owner": "user_id",
    "entries": [
      {
        "ref_thread": "factual|context",
        "ref_id": "uuid",
        "note": "string",
        "timestamp": 1712345678
      }
    ],
    "visibility": "private|shared"
  }
}
```

### Personal Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `owner` | User who owns this thread |
| `ref_thread` | Type of thread referenced (factual/context) |
| `note` | User's personal note |

---

## THREAD INTERACTION RULES

| Rule | Status |
|------|--------|
| Factual threads are PRIMARY | ✅ |
| Context threads attach to factual threads | ✅ |
| **Personal threads attach to BOTH** | ✅ ⚡ |
| No thread can rewrite another | ✅ |
| **Deleting personal threads never affects others** | ✅ ⚡ |

---

## VISUALIZATION RULES

### Universe View
| Type | Style |
|------|-------|
| factual | solid line |
| context | dotted line |
| **personal** | **user-color accent** ⚡ |

### XR View
- threads appear as light paths
- selectable
- filterable by type

---

## AGENTS INVOLVED

| Agent | Role |
|-------|------|
| `AGENT_THREAD_EXTRACTOR` | Identifies factual thread candidates, **no interpretation** |
| `AGENT_THREAD_LINKER` | Links context safely |
| `AGENT_PERSONAL_THREAD_ASSISTANT` | **Suggests personal links (opt-in only)** ⚡ |
| `AGENT_THREAD_GUARD` | Enforces immutability & ethics |

### AGENT_PERSONAL_THREAD_ASSISTANT ⚡ NEW
> **"Suggests personal links (opt-in only)"**
- Only assists if user requests
- Suggestions only
- Never auto-creates

---

## WHY THE 3 THREADS

| Thread | Purpose |
|--------|---------|
| **Factual** | shared truth |
| **Context** | understanding without bias |
| **Personal** | freedom of thought |

### Together
- **no manipulation**
- **no loss of nuance**
- **no collapse into narrative**

---

**END — KNOWLEDGE THREAD FOUNDATION**
