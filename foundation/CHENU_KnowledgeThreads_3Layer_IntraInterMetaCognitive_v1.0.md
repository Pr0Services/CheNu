# CHE·NU — KNOWLEDGE THREADS (3-LAYER SYSTEM)
**VERSION:** KNT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / BUILD-READY

---

## WHAT IS A KNOWLEDGE THREAD?

> A Knowledge Thread is a **verified, immutable chain** of related information across memories, meetings, spheres, and replays.

### RULE
> **Threads CONNECT — they NEVER conclude or interpret.**

---

## 1) INTRA-SPHERE KNOWLEDGE THREADS

### Purpose
Link related information **INSIDE the same sphere** (Scholar, Business, Creative, XR, etc.) without silo-breaking.

### Thread Examples ⚡
- series of meetings on the same topic
- decisions evolving over time
- repeated artifacts or documents
- **role-based contributions inside the sphere** ⚡

### Intra Thread JSON (with visibility + memory_event) ⚡

```json
{
  "intra_thread": {
    "sphere": "business|scholar|creative|...",
    "topic": "string",
    "nodes": [
      { "id":"uuid", "type":"meeting|artifact|decision", "ts":17123 },
      { "id":"uuid", "type":"memory_event", "ts":17124 }
    ],
    "integrity": "sha256",
    "visibility": "sphere-only"
  }
}
```

### Intra Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `topic` | **String topic name** ⚡ |
| `nodes[].type` | **meeting/artifact/decision/memory_event** ⚡ |
| `visibility` | **"sphere-only"** ⚡ |

### Rules (Intra) ⚡
| Rule | Status |
|------|--------|
| append-only | ✅ |
| **sphere-local** | ✅ ⚡ |
| **no cross-domain inference** | ✅ ⚡ |
| **user can follow or unfollow threads** | ✅ ⚡ |
| **accessible via Universe View orbit cluster** | ✅ ⚡ |

---

## 2) INTER-SPHERE KNOWLEDGE THREADS

### Purpose
Connect information **ACROSS spheres** without merging or confusing domains.

### Examples ⚡
- Scholar research → Creative Studio prototype → Business deployment
- Institution regulation → Business compliance → Social communication
- **XR meeting → Methodology improvements → IA Lab auto-evolution** ⚡

### Inter Thread JSON (with link_reason + user_override) ⚡

```json
{
  "inter_thread": {
    "spheres": ["scholar","creative","business"],
    "link_reason": "artifact_reuse|topic_alignment|sequential_dependency",
    "nodes": [
      { "sphere":"scholar", "ref":"uuid", "ts":... },
      { "sphere":"creative","ref":"uuid", "ts":... }
    ],
    "traceability": true,
    "user_override": true
  }
}
```

### Inter Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `link_reason` | **artifact_reuse/topic_alignment/sequential_dependency** ⚡ |
| `traceability` | **true** ⚡ |
| `user_override` | **true** ⚡ |

### Rules (Inter) ⚡
| Rule | Status |
|------|--------|
| **NO semantic merging** | ✅ ⚡ |
| ONLY factual links | ✅ |
| **visually displayed as threaded orbit bridges** | ✅ ⚡ |
| **requires explicit user consent to activate** | ✅ ⚡ |
| **no auto-expansion beyond 2 steps** | ✅ ⚡ |

---

## 3) META-COGNITIVE KNOWLEDGE THREADS ⚡

### Purpose
Show the **EVOLUTION of understanding, context, and patterns** WITHOUT imposing meaning or preference.

> **This is the "Thinking Thread" of Che-Nu.** ⚡

### Examples ⚡
- How a topic evolved across months
- When decisions converged or diverged
- **Repeated silence zones** ⚡
- **Temporal rhythm of collaboration** ⚡

### Meta Thread JSON (with pattern types + ethics) ⚡

```json
{
  "meta_thread": {
    "pattern": "temporal|structural|participation",
    "inputs": ["collective_memory","replays","decisions"],
    "outputs": {
      "visual_skeleton": "<lightweight_pattern>",
      "timeline_map": [],
      "context_shifts": []
    },
    "ethics": {
      "no_prediction": true,
      "no_emotion": true,
      "no_recommendation": true
    }
  }
}
```

### Meta Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `pattern` | **temporal/structural/participation** ⚡ |
| `inputs` | **["collective_memory","replays","decisions"]** ⚡ |
| `outputs.visual_skeleton` | **Lightweight pattern** ⚡ |
| `outputs.context_shifts` | **Array of shifts** ⚡ |
| `ethics` | **Object with safety flags** ⚡ |

### Meta Thread Visual Tools ⚡
| Tool | Description |
|------|-------------|
| **context delta lines** | thin, color-neutral ⚡ |
| **thread weight** | **frequency, not importance** ⚡ |
| **braid points** | **when multiple threads meet** ⚡ |
| **silence anchors** | **periods with no activity** ⚡ |
| **replay nodes** | **frozen historical markers** ⚡ |

---

## UNIFIED THREAD RULES

### Thread Engine Principles ⚡
| # | Principle |
|---|-----------|
| 1 | **Immutable core** ⚡ |
| 2 | **User-controlled visibility** ⚡ |
| 3 | No interpretation / no ranking |
| 4 | **Ethically constrained linking** ⚡ |
| 5 | **Explainability required** ⚡ |
| 6 | **Cryptographic integrity** ⚡ |

---

## THREAD AGENTS

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | constructs from memory, **never infers meaning** ⚡ |
| `AGENT_THREAD_EXPLAINER` | translates to **neutral summaries** ⚡ |
| `AGENT_THREAD_VISUALIZER` | draws orbits, **XR-friendly layering** ⚡ |
| `AGENT_THREAD_GUARD` | prevents semantic leaps, **enforces no-persuasion** ⚡ |

---

## THREADS IN UNIVERSE VIEW ⚡

### Render Rules ⚡
| Thread Type | Render |
|-------------|--------|
| **Intra-thread** | **inner orbit ring** ⚡ |
| **Inter-thread** | **sphere-bridge strand** ⚡ |
| **Meta-thread** | **outer translucent braid** ⚡ |

### Interaction ⚡
| Action | Available |
|--------|-----------|
| click-to-expand | ✅ |
| isolate thread | ✅ |
| **export thread graph** | ⚡ |
| **replay-aligned synchronization** | ⚡ |

---

## THREAD EXPORT FORMATS ⚡

| Format | Description |
|--------|-------------|
| `.thread.json` | canonical |
| `.thread.pdf` | visual summary |
| `.xrthread` | **XR overlay replay** ⚡ |

---

**END — THREAD SYSTEM READY**
