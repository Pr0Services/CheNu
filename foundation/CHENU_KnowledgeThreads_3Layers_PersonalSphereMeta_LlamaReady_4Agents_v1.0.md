# CHE·NU — KNOWLEDGE THREADS SYSTEM
**VERSION:** KTH.v1.0  
**MODE:** FOUNDATION / MODEL-AGNOSTIC / LLAMA-READY

---

## 0) CORE IDEA ⚡

> **Knowledge Thread = a STRUCTURED PATH through:** memories, meetings, artifacts, decisions, spheres.

### It is NOT ⚡
| NOT | Status |
|-----|--------|
| the model itself | ❌ |
| a new kind of AI | ❌ |
| a narrative | ❌ |

### It IS ⚡
| IS | Description |
|----|-------------|
| **curated context** | ⚡ |
| **explicit links** | ⚡ |
| **replayable reasoning surface** | that any base model (Llama, etc.) can use to become far more relevant, precise, and grounded ⚡ |

---

## THREE LAYERS OF KNOWLEDGE THREADS ⚡

| Layer | Code |
|-------|------|
| **1 — PERSONAL THREADS** | `KTH_PERSONAL` |
| **2 — SPHERE THREADS** | `KTH_SPHERE` |
| **3 — CROSS-SPHERE / META THREADS** | `KTH_META` |

> **They all share the same backbone, but differ by SCOPE and VISIBILITY.**

---

## 1) PERSONAL KNOWLEDGE THREADS (KTH_PERSONAL) ⚡

### Scope
> **One user. Across time. Across tools and meetings.**

### Purpose ⚡
| Purpose | Description |
|---------|-------------|
| Help user remember why/when/how | ⚡ |
| Build a stable personal context | ⚡ |
| **Give the model curated history instead of raw logs** | ⚡ |

### Sources ⚡
- user notes, personal meetings, tasks
- private replays, tagged artifacts

### Model Perspective ⚡
> **Instead of dumping all history into Llama, Che-Nu sends a FEW HIGH-VALUE THREAD SEGMENTS:** nodes + links + summaries, clear time stamps, explicit decisions.

### KTH_PERSONAL JSON ⚡
```json
{
  "kth_personal": {
    "id": "uuid",
    "owner": "user_id",
    "title": "string",
    "nodes": [
      {
        "ref_type": "note|meeting|replay|artifact|decision",
        "ref_id": "uuid",
        "timestamp": 1712345678,
        "summary": "short context"
      }
    ],
    "links": [
      { "from": 0, "to": 1, "relation": "followed_by" }
    ]
  }
}
```

### Rules ⚡
| Rule | Status |
|------|--------|
| **private by default** | ✅ ⚡ |
| **editable by owner** | ✅ ⚡ |
| **model only sees what is explicitly included** | ✅ ⚡ |
| **no hidden inference** | ✅ ⚡ |

---

## 2) SPHERE KNOWLEDGE THREADS (KTH_SPHERE) ⚡

### Scope
> **One sphere (Business, Scholar, Creative, etc.). Multi-user. Multi-agent.**

### Purpose ⚡
| Purpose | Description |
|---------|-------------|
| Represent the evolving KNOWLEDGE of a sphere | ⚡ |
| Organize key concepts, decisions, best practices | ⚡ |
| **Provide domain context to the model** | ⚡ |

### Sources ⚡
- sphere-wide replays, shared docs
- accepted decisions, collective memory entries

### Examples ⚡
| Sphere | Example Thread |
|--------|----------------|
| Business | "Sales Strategy 2025" |
| Scholar | "Core AI Ethics Concepts" |
| Creative | **"Brand Visual Language"** |

### KTH_SPHERE JSON ⚡
```json
{
  "kth_sphere": {
    "id": "uuid",
    "sphere": "business|scholar|creative|...",
    "topic": "string",
    "nodes": [
      {
        "ref_type": "collective_memory|doc|replay|meeting",
        "ref_id": "uuid",
        "importance": 0.0-1.0,
        "summary": "short domain-level context"
      }
    ],
    "links": [
      { "from": 0, "to": 2, "relation": "supports" },
      { "from": 1, "to": 2, "relation": "contradicts" }
    ]
  }
}
```

### Key Field: `importance: 0.0-1.0` ⚡
> **Domain-level relevance score**

### Rules ⚡
| Rule | Status |
|------|--------|
| **curated by authorized users/agents** | ✅ ⚡ |
| **visible to sphere members** | ✅ ⚡ |
| **models use them as "domain packs" of context** | ✅ ⚡ |
| **no personal data unless explicitly tagged** | ✅ ⚡ |

---

## 3) CROSS-SPHERE / META KNOWLEDGE THREADS (KTH_META) ⚡

### Scope
> **Multiple spheres. Multiple domains. System-level patterns.**

### Purpose ⚡
| Purpose | Description |
|---------|-------------|
| Capture CROSS-DOMAIN insights | ⚡ |
| Connect: Business ↔ Scholar ↔ XR ↔ Institutions… | ⚡ |
| **Support "che-nu level" reasoning: structure, ethics, methodology** | ⚡ |

### Examples ⚡
| Example |
|---------|
| "How methodology improves decision quality across all spheres" |
| "Ethical patterns recurring in Business and Institutions" |
| **"XR replay usage across Scholar + Creative"** |

### KTH_META JSON ⚡
```json
{
  "kth_meta": {
    "id": "uuid",
    "title": "string",
    "scope": ["business", "scholar", "xr", "institution"],
    "nodes": [
      {
        "sphere": "business",
        "ref_type": "kth_sphere|collective_memory",
        "ref_id": "uuid",
        "summary": "cross-domain relevant point"
      }
    ],
    "links": [
      { "from": 0, "to": 1, "relation": "analogous" },
      { "from": 1, "to": 2, "relation": "generalizes_to" }
    ]
  }
}
```

### Key Relations ⚡
| Relation | Description |
|----------|-------------|
| `analogous` | similar patterns |
| `generalizes_to` | **meta-level abstraction** |

### Rules ⚡
| Rule | Status |
|------|--------|
| **built by meta-level agents + humans** | ✅ ⚡ |
| **used mainly for: system design, ethics, methodology refinement** | ✅ ⚡ |
| **never used to override local contexts** | ✅ ⚡ |

---

## HOW THIS BOOSTS BASE MODELS (LLAMA, ETC.) ⚡

### Naive Usage ⚡
> **Dump full history into Llama → model struggles: noise, repetition, irrelevant context**

### With Knowledge Threads ⚡
| Step | Benefit |
|------|---------|
| Che-Nu selects relevant THREAD(S) | ⚡ |
| each thread = compressed, structured, time-stamped context | ⚡ |
| model receives: WHAT matters, HOW it connects, WHERE it comes from | ⚡ |

### Huge Gain In ⚡
| Gain | Status |
|------|--------|
| **precision** | ✅ ⚡ |
| **consistency** | ✅ ⚡ |
| **explainability** | ✅ ⚡ |

### KEY RULE ⚡
> **Llama (or any model) stays a generic model. Che-Nu turns the CONTEXT into a structured, navigable, selective feed.**

---

## 4 AGENTS AROUND KNOWLEDGE THREADS ⚡

| Agent | Role |
|-------|------|
| `AGENT_KT_BUILDER` | builds threads from existing memory, **no hallucination, uses verified sources** ⚡ |
| `AGENT_KT_EDITOR` | lets user merge, split, clean threads ⚡ |
| `AGENT_KT_ROUTER` | **selects which threads to send to the model based on current task + sphere** ⚡ |
| `AGENT_KT_GUARD` | enforces: no hidden bias labels, no emotional framing, **no rewriting of past** ⚡ |

---

## ETHICAL & SAFETY LIMITS ⚡

| Rule | Status |
|------|--------|
| **NO rewriting history** | ✅ ⚡ |
| **NO hidden ranking of people** | ✅ ⚡ |
| **NO sentiment labels in core threads** | ✅ ⚡ |
| **Threads must be explorable and auditable by the user** | ✅ ⚡ |

---

**END — KNOWLEDGE THREADS FOUNDATION**
