# CHE·NU — KNOWLEDGE THREADS (PART A)
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / INTER-SPHERE LINKING

---

## PURPOSE

> **Knowledge Threads create STRUCTURED, TRACEABLE connections** between information objects across spheres without creating: narratives, interpretations, recommendations, meaning construction

> **Knowledge Threads = RELATIONSHIPS, not OPINIONS.**

They allow the system to stitch together: data, decisions, artifacts, replays, concepts, tasks across Business, Scholar, Creative, XR, Institutions, Methodology, etc.

---

## CORE PRINCIPLES ⚡

| # | Principle | Description |
|---|-----------|-------------|
| 1 | **NON-DIRECTIONAL** | Threads NEVER imply: "this leads to that", or "should do this". Only: **"this REFERENCES / RELATES TO that"** ⚡ |
| 2 | **IMMUTABLE TRACING** | All threads must point to source objects (memory entries, meeting IDs, file IDs, agent logs) ⚡ |
| 3 | **USER SOVEREIGNTY** | **Users choose to reveal, hide, merge, or delete their threads** ⚡ |
| 4 | **SPHERE NEUTRALITY** | A thread cannot assume a domain meaning. **Only structural linking** ⚡ |
| 5 | **THREADS DO NOT INFER** | **No assumptions, no summarizing intention, no synthesis** ⚡ |

---

## THREAD TYPES ⚡

| Type | Description |
|------|-------------|
| `THREAD_REFERENCE` | A references B (artifact, replay, decision). **Simplest form. One-directional or bi-directional** ⚡ |
| `THREAD_SEQUENCE` | Object A occurred before B. **Pure chronology. Never implies causality** ⚡ |
| `THREAD_SIMILARITY` | A and B share overlapping metadata (Topic, tags, sphere, participants). **Score must not be interpretive → purely structural** ⚡ |
| `THREAD_DEPENDENCY` | A depends on the existence of B. Example: replay B is built from meeting A. **NEVER implies "dependency of meaning"** ⚡ |
| `THREAD_CONTEXT` | They share the same sphere, context, cluster. **No semantic interpretation** ⚡ |

---

## KNOWLEDGE THREAD MODEL ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "reference|sequence|similarity|dependency|context",
    "source": "object_id",
    "target": "object_id",
    "metadata": {
      "created_at": "...",
      "sphere": "business|scholar|creative|...",
      "strength": "0.0-1.0",
      "user_created": "true|false"
    },
    "hash": "sha256"
  }
}
```

### Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `type` | **reference/sequence/similarity/dependency/context** ⚡ |
| `metadata.strength` | **0.0-1.0 (purely structural strength)** ⚡ |
| `metadata.user_created` | **boolean** ⚡ |

---

## THREAD CREATION LOGIC ⚡

| Type | Logic |
|------|-------|
| `THREAD_REFERENCE` | IF A references B → create thread_reference(A,B) ⚡ |
| `THREAD_SEQUENCE` | IF A.timestamp < B.timestamp AND same_thread_group → create thread_sequence(A,B) ⚡ |
| `THREAD_SIMILARITY` | IF shared tags > threshold → create thread_similarity(A,B) ⚡ |
| `THREAD_DEPENDENCY` | IF A derived from B (artifact from replay, replay from meeting) → create thread_dependency(A,B) ⚡ |
| `THREAD_CONTEXT` | IF A and B belong to same sphere or meeting cluster → create thread_context(A,B) ⚡ |

---

## NEVER AUTOCREATE WITHOUT EXPLANATION ⚡

Each auto-created thread must carry:
- **explicit creation rule** ⚡
- **reason in plain text** ⚡
- **no interpretation** ⚡

### Example ⚡
```
"Thread created because objects share 3 identical metadata tags.
No semantic meaning assigned."
```

---

## THREAD VISUALIZATION MODES ⚡

| Mode | Description |
|------|-------------|
| `MODE_MINIMAL` | dotted lines, faded clusters, **sphere-colored halos** ⚡ |
| `MODE_STRUCTURAL` | **show types explicitly, display timestamps, group sequences** ⚡ |
| `MODE_DENSE` | **complete graph view, clusters by sphere, filterable by metadata** ⚡ |
| `MODE_XR` | rendered as spatial filaments, color-coded, **no motion** ⚡ |

---

## USER CONTROLS ⚡

| Control | Description |
|---------|-------------|
| toggle thread layer | ✅ |
| filter by type | ✅ |
| **hide auto threads** | ⚡ |
| **show only user-created threads** | ⚡ |
| **show thread creation reason** | ⚡ |
| **export thread map (.json or .pdf)** | ⚡ |

---

## AGENTS INVOLVED ⚡

| Agent | Role |
|-------|------|
| `AGENT_THREAD_MONITOR` | **validates integrity, checks for conflicts, ensures no semantic inference, controls freeze** ⚡ |
| `AGENT_THREAD_RENDERER` | **supplies visualization data, never interprets meaning** ⚡ |
| `AGENT_THREAD_EXPLAINER` | **explains in neutral language why the thread exists, no suggestions** ⚡ |

---

## ETHICAL LOCKS ⚡

| Lock | Status |
|------|--------|
| **no nudging based on connections** | ✅ ⚡ |
| **no ranking based on thread count** | ✅ ⚡ |
| **no interpretation of meaning** | ✅ ⚡ |
| **no suppression of alternative nodes** | ✅ ⚡ |
| **full transparency in creation rules** | ✅ ⚡ |

---

## REASON THIS SYSTEM IS CRUCIAL ⚡

### It allows Che·Nu to become ⚡
- searchable
- navigable
- **structurally intelligent** ⚡

### WITHOUT becoming ⚡
- suggestive
- manipulative
- **narrative-driven** ⚡

> **Knowledge Threads = the "neural pathways" of the ecosystem but bound by ethics, transparency, and structural neutrality.**

---

**END — KNOWLEDGE THREADS (A)**
