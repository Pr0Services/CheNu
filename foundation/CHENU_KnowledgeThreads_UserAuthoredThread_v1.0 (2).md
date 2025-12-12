# CHE·NU — KNOWLEDGE THREADS SYSTEM (USER-AUTHORED THREAD)
**VERSION:** FOUNDATION v1.0  
**MODE:** NON-MANIPULATIVE / TRACEABLE / FREEZE-READY

---

## GLOBAL DEFINITION

> A Knowledge Thread is a **STRUCTURAL LINK** between facts, events, decisions, artifacts, and time.

### RULE
> **Threads CONNECT information.**  
> **They NEVER interpret, conclude, or rank.**

---

## THREAD TYPE 1 — FACTUAL THREAD (with relation types) ⚡

### Purpose
Link objective elements that are factually connected across meetings, spheres, and time.

### Sources
- meeting replays, documents, decisions logs, agent actions, timestamps

### What It Connects
- event → event
- decision → artifact
- artifact → meeting
- meeting → meeting

### Rules
| Rule | Status |
|------|--------|
| auto-generated | ✅ |
| immutable once validated | ✅ |
| append-only | ✅ |
| hash-linked | ✅ |

### JSON Model (with relation types) ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "factual",
    "nodes": ["node_id_1","node_id_2"],
    "relation": "occurred_after|references|depends_on",
    "created_by": "system",
    "confidence": 1.0
  }
}
```

### Relation Types (Factual) ⚡
| Relation | Description |
|----------|-------------|
| `occurred_after` | Temporal sequence |
| `references` | References another |
| `depends_on` | Dependency |

---

## THREAD TYPE 2 — CONTEXTUAL THREAD (with routing_ai) ⚡

### Purpose
Expose **RELATIONSHIPS OF CONTEXT** without asserting causality or meaning.

### Sources
- shared participants, same sphere, similar topics, temporal proximity, shared agents

### What It Connects
- meetings in same domain
- recurring themes
- parallel discussions
- unresolved topics

### Rules
| Rule | Status |
|------|--------|
| **suggested, not enforced** | ✅ ⚡ |
| user-visible reasoning | ✅ |
| reversible / hideable | ✅ |
| confidence-scored | ✅ |

### JSON Model (with routing_ai) ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "contextual",
    "nodes": ["node_id_1","node_id_2"],
    "relation": "related_context",
    "created_by": "routing_ai",
    "confidence": 0.75
  }
}
```

### Created By Options ⚡
| Creator | Description |
|---------|-------------|
| `system` | Auto-generated factual |
| `routing_ai` | AI-suggested contextual |
| `user_id` | User-authored |

---

## THREAD TYPE 3 — USER-AUTHORED THREAD ⚡ UNIQUE

### Purpose
Allow humans to **declare intentional links** WITHOUT modifying factual records.

### Sources
- user annotation
- manual linking
- narrative notes
- **hypothesis tracking** ⚡

### What It Connects
- any two visible nodes
- **supports multi-node chains** ⚡

### Rules
| Rule | Status |
|------|--------|
| **explicitly marked as user-authored** | ✅ ⚡ |
| **never promoted as fact** | ✅ ⚡ |
| private by default | ✅ |
| exportable separately | ✅ |

### JSON Model (with note + user visibility) ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "user_authored",
    "nodes": ["node_id_1","node_id_2"],
    "note": "user explanation",
    "visibility": "private|shared",
    "created_by": "user_id"
  }
}
```

### User-Authored Fields ⚡
| Field | Description |
|-------|-------------|
| `note` | User's explanation |
| `visibility` | private / shared |
| `created_by` | User ID |

---

## THREAD VISUALIZATION RULES ⚡

| Thread | Line | Color |
|--------|------|-------|
| **Factual** | solid | neutral |
| **Contextual** | dotted, **opacity = confidence** | soft |
| **User-authored** | dashed | **user-selected color** ⚡ |

---

## IN UNIVERSE VIEW / XR ⚡

| Feature | Value |
|---------|-------|
| Toggle | threads toggleable |
| Filter | by type |
| Hover | inspect details |
| **Replay** | **enter replay directly from thread** ⚡ |
| Navigation | **no auto-navigation** |

### Enter Replay Directly ⚡
> **Click on any thread node to enter the source replay directly**

---

## SAFETY & ETHICS

| Rule | Status |
|------|--------|
| no narrative merging | ✅ |
| no "storytelling" mode | ✅ |
| no automatic conclusions | ✅ |
| all thread types clearly labeled | ✅ |

---

## WHY THREE THREADS

| Thread | Purpose |
|--------|---------|
| **Factual** | preserves truth |
| **Contextual** | reveals structure |
| **User-authored** | preserves human intent |

### Together
> **Knowledge WITHOUT manipulation.**

---

**END — KNOWLEDGE THREADS**
