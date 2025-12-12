# CHE·NU — KNOWLEDGE THREADS SYSTEM (with SILENCE THREAD)
**VERSION:** FOUNDATION v1.6  
**TYPE:** INFORMATION LINKING / NON-MANIPULATIVE / CROSS-SPHERE

---

## CORE DEFINITION

> **Knowledge Thread = A TRACEABLE, TIME-ORDERED CONNECTION**  
> between information units across spheres, meetings, agents, and memory layers.

### RULE
> **Thread connects FACTS, not opinions.**  
> **Thread reveals RELATIONS, not conclusions.**

---

## THE 3 KNOWLEDGE THREADS

### THREAD TYPE 1 — FACT THREAD

| Property | Value |
|----------|-------|
| Purpose | Link concrete elements that are objectively related |
| Connects | documents, decisions, meetings, artifacts, timestamps |
| Properties | immutable, append-only, verifiable, hash-linked |
| Use cases | decision traceability, audit trails, institutional memory |

#### JSON Model

```json
{
  "thread": {
    "id": "uuid",
    "type": "fact",
    "nodes": ["artifact_id","meeting_id","decision_id"],
    "created_at": 1712345678,
    "hash_chain": ["sha256","sha256"]
  }
}
```

---

### THREAD TYPE 2 — CONTEXT THREAD

| Property | Value |
|----------|-------|
| Purpose | Show how context EVOLVES over time without interpreting meaning |
| Connects | meetings across time, topic shifts, scope changes, constraint changes |
| Properties | time-indexed, multi-branch, non-evaluative |
| Use cases | project evolution, research trajectories, methodology tracking |

#### JSON Model

```json
{
  "thread": {
    "id": "uuid",
    "type": "context",
    "timeline": [
      { "t": 1, "context": "initial_scope" },
      { "t": 2, "context": "expanded_scope" }
    ],
    "sphere": "business|scholar|xr"
  }
}
```

---

### THREAD TYPE 3 — SILENCE THREAD ⚡ NEW

| Property | Value |
|----------|-------|
| Purpose | Represent **absence of action or discussion** as an explicit, visible element |
| Connects | gaps, pauses, skipped decisions, unresolved items |
| Properties | generated automatically, non-judgmental, visible only on demand |
| Use cases | risk awareness, missed reviews, deferred decisions |

#### JSON Model

```json
{
  "thread": {
    "id": "uuid",
    "type": "silence",
    "start": 1712300000,
    "end": 1712340000,
    "linked_to": "decision_id",
    "visibility": "opt-in"
  }
}
```

#### Key Insight
> **Silence is data, not absence of data.**

---

## THREAD RULES (ALL TYPES)

| Rule | Status |
|------|--------|
| threads never recommend | ✅ |
| threads never rank | ✅ |
| threads never summarize intent | ✅ |
| threads never hide alternatives | ✅ |
| every thread is inspectable | ✅ |

---

## THREAD VISUALIZATION STYLES

### STYLE 1 — LINEAR (2D)

| Property | Value |
|----------|-------|
| Layout | horizontal timeline |
| Elements | clean connectors, minimal glyphs |
| Use | documents, audits, PDF exports |

### STYLE 2 — GRAPH (2.5D / UNIVERSE VIEW)

| Property | Value |
|----------|-------|
| Layout | nodes + edges |
| Elements | sphere-colored clusters, expandable branches |
| Use | universe view, navigation, analysis |

### STYLE 3 — SPATIAL (XR)

| Property | Value |
|----------|-------|
| Layout | floating strands |
| Depth | = time |
| Thickness | = density |
| Color | = thread type |
| Use | XR meetings, replay comparison, collective memory |

---

## XR THREAD SAFETY

| Rule | Status |
|------|--------|
| No flashing | ✅ |
| No motion forcing | ✅ |
| User-controlled reveal | ✅ |
| Zoom-only interaction | ✅ |
| Instant hide option | ✅ |

---

## THREAD INTERACTION MODES

| Mode | Description |
|------|-------------|
| `inspect node` | View node details |
| `follow thread` | Navigate along thread |
| `fork view` | Read-only branch |
| `overlay with replay` | Combine with replay |
| `export` | PDF / image / data |

---

## WHY KNOWLEDGE THREADS MATTER

They create:
- **Continuity without narrative**
- **Memory without distortion**
- **Insight without pressure**

---

**END — FOUNDATION FREEZE**
