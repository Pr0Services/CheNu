# CHE·NU — KNOWLEDGE THREAD SYSTEM (EVOLUTION THREAD)
**VERSION:** FOUNDATION v1.0  
**TYPE:** KNOWLEDGE STRUCTURE / NON-MANIPULATIVE / GLOBAL

---

## GLOBAL PRINCIPLE

> **Knowledge Threads connect INFORMATION,**  
> NOT people, NOT opinions, NOT intentions.

### Definition
> **THREADS = STRUCTURAL LINKS**  
> NOT narratives, NOT conclusions, NOT influence.

---

## THREAD TYPE 1 — FACT THREAD

### Purpose
Link verifiable facts across: meetings, documents, decisions, artifacts, replays

### Rule
> Facts only. No interpretation. No abstraction.

### Content
- timestamps
- sources
- participants (optional)
- linked artifacts
- immutable references

### JSON Model

```json
{
  "fact_thread": {
    "id": "uuid",
    "facts": [
      {
        "source_type": "meeting|replay|document",
        "source_id": "uuid",
        "timestamp": 1712345678,
        "hash": "sha256"
      }
    ],
    "scope": "sphere|intersphere",
    "visibility": "private|shared|public"
  }
}
```

### Rules
- ✅ append-only
- ✅ immutable once validated
- ✅ cryptographically linked
- ❌ cannot be renamed emotionally
- ❌ cannot be ranked

---

## THREAD TYPE 2 — CONTEXT THREAD

### Purpose
Explain WHERE and WHY facts exist, **WITHOUT drawing conclusions.**

### Rule
> Context describes CONDITIONS, NOT judgment.

### Content
- meeting purpose
- environment (XR, 2D, async)
- domain (sphere)
- constraints active at the time
- absence of action (silence)

### JSON Model

```json
{
  "context_thread": {
    "id": "uuid",
    "related_facts": ["fact_thread_id"],
    "context": {
      "sphere": "business|scholar|xr|...",
      "meeting_type": "analysis|decision|creative",
      "constraints": ["time","access","availability"]
    }
  }
}
```

### Rules
- ✅ contextual only
- ❌ no inferred motives
- ❌ no outcome tagging
- ✅ must reference fact threads

---

## THREAD TYPE 3 — EVOLUTION THREAD ⚡ NEW

### Purpose
Track how knowledge **STRUCTURE evolves** over time, not what people believe.

### Rule
> **Evolution = CHANGE IN STRUCTURE,**  
> not correctness, not success.

### Content
| Element | Description |
|---------|-------------|
| branching points | Where paths split |
| merges | Where paths combine |
| abandoned paths | Discontinued directions |
| resumed paths | Reactivated directions |
| version transitions | Structure changes |

### JSON Model

```json
{
  "evolution_thread": {
    "id": "uuid",
    "timeline": [
      {
        "event": "branch|merge|pause|resume",
        "source": "fact_thread_id",
        "timestamp": 1712345678
      }
    ]
  }
}
```

### Evolution Event Types

| Event | Description |
|-------|-------------|
| `branch` | Path splits into multiple |
| `merge` | Paths combine |
| `pause` | Path suspended |
| `resume` | Path reactivated |

### Rules
- ✅ descriptive only
- ❌ no optimization flags
- ❌ no winner/loser
- ✅ parallel paths allowed

---

## INTER-THREAD RELATIONSHIP

| Thread | Answers |
|--------|---------|
| **FACT THREAD** | WHAT happened |
| **CONTEXT THREAD** | UNDER WHAT CONDITIONS |
| **EVOLUTION THREAD** | HOW STRUCTURE changed |

> **Never reversed.**

### Relationship Diagram

```
EVOLUTION ──tracks──→ FACT ←──describes── CONTEXT
    │                   │
    └── structure ──────┴── conditions
```

---

## UNIVERSE VIEW INTEGRATION

| Property | Value |
|----------|-------|
| Rendering | translucent links |
| Toggle | per thread type |
| Colors | coded per type |
| Thickness | **NOT = importance** |
| Direction arrows | **NONE (neutrality)** |

---

## ACCESS & SAFETY

| Rule | Status |
|------|--------|
| Threads inherit sphere permissions | ✅ |
| Private threads never leak | ✅ |
| Cross-sphere threads require explicit consent | ✅ |
| Full audit trail | ✅ |

---

## WHY THIS MATTERS

This system:
- **preserves truth**
- **prevents manipulation**
- **allows clarity without ideology**
- **scales without distortion**

---

**END — KNOWLEDGE THREAD SYSTEM**
