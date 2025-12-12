# CHE·NU — KNOWLEDGE THREADS (MICRO/MESO/MACRO) + ANCHOR+++
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / FREEZE-READY

---

## KNOWLEDGE THREADS — OVERVIEW

### Purpose
Connect knowledge across spheres, meetings, replays, artifacts, decisions, and collective memory **WITHOUT interpretation.**

### RULE
> **Threads = Connections, NOT conclusions.**

### Thread Types ⚡
| Type | Scope |
|------|-------|
| **1) Micro Threads** | Fine-grain link between ideas ⚡ |
| **2) Meso Threads** | Cross-sphere conceptual bridges ⚡ |
| **3) Macro Threads** | **System-wide knowledge constellations** ⚡ |

> **Anchors+++ bind threads to fixed points in memory, XR space, and timelines.**

---

## 1) MICRO KNOWLEDGE THREADS ⚡

### Definition
**Smallest unit** of related knowledge linking: a note, an artifact, a replay segment, a statement, an event, an idea.

### Properties ⚡
| Property | Description |
|----------|-------------|
| **minimal context** | ⚡ |
| **immutable once validated** | ⚡ |
| **cryptographically hashed** | ⚡ |

### Micro Thread JSON ⚡

```json
{
  "micro_thread": {
    "id": "uuid",
    "source": "artifact|note|replay|decision",
    "target": "artifact|note|replay|decision",
    "context": "local",
    "strength": "0.1-0.5",
    "hash": "sha256"
  }
}
```

### Strength Range ⚡
> **0.1-0.5** — minimal to moderate connection strength

### Usage ⚡
- highlight connections inside one sphere
- power semantic, non-interpretative linking
- **2D/3D XR quick-jump navigation** ⚡

---

## 2) MESO KNOWLEDGE THREADS ⚡

### Definition
**Cross-sphere conceptual bridges** connecting: Business ↔ Scholar, Creative ↔ XR, Institutions ↔ Methodology, IA Lab ↔ any sphere.

> **NO meaning added. Only "this relates to that".**

### Properties ⚡
| Property | Description |
|----------|-------------|
| **spans spheres** | ⚡ |
| **includes topic tags** | ⚡ |
| **requires validation by user or agent_guard** | ⚡ |

### Meso Thread JSON ⚡

```json
{
  "meso_thread": {
    "id": "uuid",
    "spheres": ["business", "scholar"],
    "tags": ["learning_process", "workflow"],
    "linked_nodes": ["node_id_1", "node_id_2"],
    "strength": "0.5-0.8"
  }
}
```

### Strength Range ⚡
> **0.5-0.8** — moderate to strong connection strength

### Usage ⚡
- Universe View clustering
- XR conceptual mapping
- **cross-domain understanding WITHOUT interpretation** ⚡

---

## 3) MACRO KNOWLEDGE THREADS ⚡

### Definition
**Large-scale constellations** representing: system-wide themes, recurring structures, cross-time dynamics, collective memory patterns.

### Properties ⚡
| Property | Description |
|----------|-------------|
| **never auto-generated** | ⚡ |
| **must be user-confirmed** | ⚡ |
| **represent "stable knowledge"** | ⚡ |

### Macro Thread JSON ⚡

```json
{
  "macro_thread": {
    "id": "uuid",
    "pattern": "emergent_structure",
    "nodes": ["thread_id", "thread_id", "thread_id"],
    "coherence": "0.8-1.0",
    "created_by": "user",
    "verified": true
  }
}
```

### Key Fields ⚡ (NOUVEAU!)
| Field | Description |
|-------|-------------|
| `pattern` | **"emergent_structure"** ⚡ |
| `coherence` | **0.8-1.0 — high coherence required** ⚡ |

### Usage ⚡
- **XR constellation view** ⚡
- extended navigation
- historical context
- learning from past structures

---

## ANCHOR+++ SYSTEM — CORE ⚡ (NOUVEAU!)

### Purpose
Fix knowledge into **precise, stable coordinates**: in memory, in XR, in timeline, in sphere hierarchy, in collective memory.

> **ANCHORS = "Where a thread attaches."**
> 
> **ANCHOR+++ = Anchors with spatial + temporal + contextual consistency.**

### 5 Anchor Types ⚡
| Type | Attaches To |
|------|-------------|
| `ANCHOR_TIME` | timestamp in replay or decision log ⚡ |
| `ANCHOR_SPACE` | **XR coordinate or 2D UI node** ⚡ |
| `ANCHOR_CONTEXT` | sphere, topic, agent role ⚡ |
| `ANCHOR_MEMORY` | **collective memory hash** ⚡ |
| `ANCHOR_THREAD` | directly to a micro/meso/macro thread ⚡ |

### Anchor+++ JSON ⚡

```json
{
  "anchor_plus": {
    "id": "uuid",
    "type": "time|space|context|memory|thread",
    "reference": "...",
    "thread": "thread_id",
    "stability": "0.0-1.0",
    "verified": true,
    "hash": "sha256"
  }
}
```

### Key Field: `stability` ⚡ (NOUVEAU!)
> **0.0-1.0 — how stable/fixed the anchor point is**

### Anchor+++ Rules ⚡
| Rule | Status |
|------|--------|
| **Anchors never move unless user-authorized** | ✅ ⚡ |
| **No automatic re-binding** | ✅ ⚡ |
| **No semantic inference** | ✅ ⚡ |
| **Anchors only create POSITION, not meaning** | ✅ ⚡ |
| **Anchors must be visible and inspectable** | ✅ ⚡ |

### Anchor+++ in XR ⚡

**Visual Forms:**
| Form | Description |
|------|-------------|
| **floating node (small glow)** | ⚡ |
| **anchored glyph on floor/wall/object** | ⚡ |
| **beam-lines connecting related anchors** | ⚡ |
| **constellation mode (macro threads)** | ⚡ |

**Interactions:**
| Function | Description |
|----------|-------------|
| `point_to_anchor` | ⚡ |
| `expand_thread` | ⚡ |
| `open_related_artifacts` | ⚡ |
| `timeline_jump` | ⚡ |
| `silent_review` | ⚡ |

### Anchor+++ in Universe View ⚡
| Feature | Description |
|---------|-------------|
| anchors render as **"fix-points"** | ⚡ |
| threads draw map-like lines | ⚡ |
| meso links produce **arcs between spheres** | ⚡ |
| **macro threads produce constellations** | ⚡ |

### Anchor+++ Safety & Ethics ⚡
| Rule | Status |
|------|--------|
| **no predictive anchor creation** | ✅ ⚡ |
| **no emotional signals** | ✅ ⚡ |
| **no framing or persuasion** | ✅ ⚡ |
| **user always sees WHY an anchor exists** | ✅ ⚡ |
| **all anchors are auditable** | ✅ ⚡ |

---

## THREAD + ANCHOR INTEGRATION ⚡

| Direction | = |
|-----------|---|
| **Thread → Anchor** | knowledge → location ⚡ |
| **Anchor → Thread** | **location → meaning-free navigation** ⚡ |

### Graph Behavior ⚡
| Thread Type | Behavior |
|-------------|----------|
| micro threads | cluster within spheres ⚡ |
| meso threads | cluster across spheres ⚡ |
| **macro threads** | **define universal overlays** ⚡ |

---

## EXPORT FORMAT ⚡

### Bundle: `knowledge_threads_bundle.ktb` ⚡
| Content | Description |
|---------|-------------|
| micro threads | ⚡ |
| meso threads | ⚡ |
| macro threads | ⚡ |
| **anchors+++** | ⚡ |
| metadata + hashes | ⚡ |

---

**END — FREEZE READY**
