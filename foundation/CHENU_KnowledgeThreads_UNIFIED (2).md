# CHE·NU — KNOWLEDGE THREADS: UNIFIED MODEL
**VERSION:** UNIFIED.v1.0  
**COMBINES:** KTHREAD.v1.0 + CORE.v1.0

---

## UNIFIED THREAD ARCHITECTURE

### Two Orthogonal Dimensions

```
                    CONTENT TYPE (CORE.v1.0)
                    ─────────────────────────────
                    │ FACT    │ CONTEXT │ EVOLUTION │
    ────────────────┼─────────┼─────────┼───────────┤
    PERSONAL        │    ●    │    ●    │     ●     │
    (KTHREAD)       │         │         │           │
    ────────────────┼─────────┼─────────┼───────────┤
S   COLLECTIVE      │    ●    │    ●    │     ●     │
C   (KTHREAD)       │         │         │           │
O   ────────────────┼─────────┼─────────┼───────────┤
P   CROSS-SPHERE    │    ●    │    ●    │     ●     │
E   (KTHREAD)       │         │         │           │
    ────────────────┴─────────┴─────────┴───────────┘
```

### Thread = SCOPE × CONTENT

Every Knowledge Thread has:
1. **Scope** (who owns/sees): Personal | Collective | Cross-Sphere
2. **Content Type** (what it tracks): Fact | Context | Evolution

---

## UNIFIED DATA MODEL

```json
{
  "thread_id": "uuid",
  
  // SCOPE (from KTHREAD.v1.0)
  "scope": {
    "type": "personal|collective|cross_sphere",
    "owner": "user_id|null",
    "group_id": "group_id|null",
    "spheres": ["business","scholar","xr"],
    "visibility": "private|group|org|public"
  },
  
  // CONTENT (from CORE.v1.0)
  "content": {
    "type": "fact|context|evolution",
    "properties": {
      "immutable": true,
      "append_only": true,
      "reversible": false
    }
  },
  
  // NODES (unified)
  "nodes": [
    {
      "id": "uuid",
      "kind": "memory|meeting|replay|decision|artifact|agent_action|document|export",
      "sphere": "business|scholar|xr",
      "timestamp": 1712345678,
      "version": 1,
      "hash": "sha256"
    }
  ],
  
  // METADATA
  "label": "string",
  "description": "string",
  "created_at": "ISO8601",
  "updated_at": "ISO8601",
  "integrity_hash": "sha256"
}
```

---

## THREAD COMBINATIONS (9 POSSIBLE)

| Combination | Use Case |
|-------------|----------|
| Personal + Fact | User's private record of what happened |
| Personal + Context | Why user made certain decisions |
| Personal + Evolution | User's document versions |
| Collective + Fact | Team's shared timeline of events |
| Collective + Context | Team's decision rationale archive |
| Collective + Evolution | Project's document history |
| Cross-Sphere + Fact | Multi-domain event tracking |
| Cross-Sphere + Context | Cross-disciplinary knowledge flow |
| Cross-Sphere + Evolution | Idea transformation across domains |

---

## UNIFIED AGENTS

| Agent | Responsibility |
|-------|----------------|
| `AGENT_THREAD_GUIDE` | Navigate & suggest threads (non-prescriptive) |
| `AGENT_THREAD_GUARD` | Ensure thread integrity & traceability |
| `AGENT_DOCUMENT_ORGANIZER` | Suggest formats & compaction |
| `AGENT_FORMAT_CONVERTER` | Handle transformations |

---

## UNIFIED RULES

### From KTHREAD.v1.0 (Scope Rules)
- Personal: only owner expands/shares
- Collective: append-only, fork not rewrite
- Cross-Sphere: no ownership bias, show all contexts

### From CORE.v1.0 (Content Rules)
- Fact: immutable, hashed, replay-linkable
- Context: immutable after validation
- Evolution: directional, reversible, versioned

### Universal Rules
- ❌ No emotional/value labels
- ❌ No "success/failure" tags
- ❌ No engagement optimization
- ✅ Auditable (who, what, when)
- ✅ User always approves changes

---

## DOCUMENT TRANSFORMATION (from CORE.v1.0)

### Integrated with Evolution Threads

```
Raw Text → structure → Markdown → publish → PDF
    │                      │                 │
    └── Evolution Thread ──┴─────────────────┘
         (tracks all versions)
```

### Compact/Decompact + Threads

- COMPACT: replaces nodes with pointers, **preserves thread links**
- DECOMPACT: restores full tree, **thread history intact**

---

## UNIVERSE NAVIGATION (from KTHREAD.v1.0)

### Visual Thread Paths

| Thread Scope | Visual |
|--------------|--------|
| Personal | thin subtle lines |
| Collective | thicker highlighted |
| Cross-Sphere | multi-colored braids |

### Navigation respects Content Type

- Fact threads: strict chronological path
- Context threads: show surrounding constraints
- Evolution threads: version timeline with diff markers

---

## WHY UNIFIED MODEL

This combined architecture allows:
- **9 thread types** for complete knowledge coverage
- **Separation of concerns**: scope ≠ content
- **Flexible queries**: filter by scope OR content OR both
- **Clear governance**: scope defines access, content defines behavior

> **One thread can track both WHO sees it AND WHAT it contains.**

---

**END — UNIFIED KNOWLEDGE THREAD MODEL**
