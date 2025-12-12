# CHE·NU — KNOWLEDGE THREADS SYSTEM (FACT/CONTEXT/USER NARRATIVE)
**VERSION:** FOUNDATION v1.0  
**MODE:** TRUTH-LINKING / NON-NARRATIVE / FREEZE-READY

---

## CORE DEFINITION

> A Knowledge Thread is a **CONTINUOUS TRACE** of related information across time, spheres, meetings, and agents.

### RULE
> **Thread = CONNECTION**  
> **NOT explanation, NOT conclusion, NOT opinion**

---

## THREAD TYPE 1 — FACT THREAD

### Purpose
Link verifiable facts, events, and artifacts **exactly as they occurred.**

### Sources
- XR replay events, Decisions logs, Documents & artifacts, Agent actions (trace only)

### Properties ⚡
| Property | Status |
|----------|--------|
| immutable | ✅ |
| append-only | ✅ |
| time-stamped | ✅ |
| cryptographically linked | ✅ |
| **replay-referenced** | ✅ ⚡ |

### Fact Thread JSON (with visibility + verified) ⚡

```json
{
  "fact_thread": {
    "id": "uuid",
    "entries": [
      {
        "type": "event|artifact|decision",
        "source": "replay_id",
        "timestamp": 1712345678,
        "sphere": "business|scholar|xr|...",
        "hash": "sha256"
      }
    ],
    "visibility": "private|shared|sphere",
    "verified": true
  }
}
```

### Fact Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `entries[].type` | **event/artifact/decision** ⚡ |
| `visibility` | **private/shared/sphere** ⚡ |
| `verified` | **Boolean - true** ⚡ |

### Restrictions ⚡
| Restriction | Status |
|-------------|--------|
| no interpretation | ✅ |
| **no tagging beyond type** | ✅ ⚡ |
| no sentiment | ✅ |
| no priority ranking | ✅ |

---

## THREAD TYPE 2 — CONTEXT THREAD

### Purpose
Preserve **WHY a fact appeared connected at a time**, WITHOUT rewriting meaning.

### Sources ⚡
- meeting metadata, participants list, active spheres, **temporal proximity** ⚡, **explicit user annotations** ⚡

### Properties ⚡
| Property | Status |
|----------|--------|
| optional | ✅ |
| **versioned** | ✅ ⚡ |
| **detachable from fact thread** | ✅ ⚡ |
| user-visible | ✅ |

### Context Thread JSON (with context_blocks + time_window) ⚡

```json
{
  "context_thread": {
    "id": "uuid",
    "linked_fact_thread": "uuid",
    "context_blocks": [
      {
        "time_window": "start-end",
        "participants": ["user_id","agent_id"],
        "sphere": "scholar",
        "note": "user-authored only"
      }
    ]
  }
}
```

### Context Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `linked_fact_thread` | **UUID reference** ⚡ |
| `context_blocks` | **Array of blocks** ⚡ |
| `context_blocks[].time_window` | **"start-end" string** ⚡ |
| `context_blocks[].note` | **user-authored only** ⚡ |

### Restrictions ⚡
| Restriction | Status |
|-------------|--------|
| **no auto-generated meaning** | ✅ ⚡ |
| **no AI inference** | ✅ ⚡ |
| **context != truth** | ✅ ⚡ |
| **always labeled as context** | ✅ ⚡ |

---

## THREAD TYPE 3 — USER NARRATIVE THREAD ⚡

### Purpose
Allow **USERS (only)** to articulate their OWN narrative, **WITHOUT affecting facts or others.**

### Sources ⚡
| Source | Description |
|--------|-------------|
| **personal notes** | ⚡ |
| **reflections** | ⚡ |
| **hypotheses** | ⚡ |
| **future intentions** | ⚡ |

### Properties ⚡
| Property | Status |
|----------|--------|
| **private by default** | ✅ ⚡ |
| **non-shareable unless explicit** | ✅ ⚡ |
| **never influences agents** | ✅ ⚡ |
| **never feeds routing intelligence** | ✅ ⚡ |

### Narrative Thread JSON (with owner + sealed) ⚡

```json
{
  "narrative_thread": {
    "id": "uuid",
    "owner": "user_id",
    "linked_fact_thread": "uuid",
    "entries": [
      {
        "text": "string",
        "timestamp": 1712345678
      }
    ],
    "visibility": "private",
    "sealed": false
  }
}
```

### Narrative Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `owner` | **user_id - owner only** ⚡ |
| `linked_fact_thread` | **UUID reference** ⚡ |
| `entries[].text` | **String - user text** ⚡ |
| `visibility` | **"private"** ⚡ |
| `sealed` | **Boolean - can be sealed** ⚡ |

### Restrictions CRITIQUES ⚡
| Restriction | Status |
|-------------|--------|
| **narrative has NO SYSTEM AUTHORITY** | ✅ ⚡ |
| **not visible in collective memory** | ✅ ⚡ |
| **cannot modify other threads** | ✅ ⚡ |

---

## THREAD INTERACTIONS RULES ⚡

### Hierarchy ⚡
| Thread | Status |
|--------|--------|
| **Fact thread is PRIMARY** | ⚡ |
| Context thread references fact thread | ✅ |
| Narrative thread references fact thread | ✅ |
| **NEVER the reverse** | ⚡ |

### No Thread Can: ⚡
- **alter another**
- **override timestamps**
- **hide entries**

---

## THREAD VISUALIZATION (UNIVERSE VIEW)

### Visual Styles ⚡
| Thread Type | Style |
|-------------|-------|
| **Fact thread** | solid line |
| **Context thread** | dashed line |
| **Narrative thread** | **dotted private line** ⚡ |

### Color Rules ⚡
| Thread | Color |
|--------|-------|
| facts | neutral |
| context | muted |
| **narrative** | **personal theme** ⚡ |

---

## AGENTS INVOLVED

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | assembles fact threads, no interpretation |
| `AGENT_CONTEXT_LINKER` | attaches metadata context, **no inference** ⚡ |
| `AGENT_THREAD_GUARD` | validates boundaries, enforces immutability |

---

## WHY THIS MATTERS

- **Facts remain facts**
- **Context remains visible**
- **Narratives stay personal**
- **Truth stays stable**
- **Insight stays human**

---

**END — KNOWLEDGE THREADS FREEZE**
