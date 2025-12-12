# CHE·NU — KNOWLEDGE THREADS SYSTEM
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / MULTI-SPHERE / REUSABLE CONTENT GRAPH

---

## PURPOSE ⚡

> **Transform ANY piece of information (note, replay segment, question, image, task, doc, idea) into a "Knowledge Thread"** that can: persist, evolve, be multi-located, be categorized by sphere, be referenced by agents, generate documents and posts, unify knowledge across Che-Nu.

---

## KNOWLEDGE THREAD — TIERS (3 LEVELS) ⚡

### TIER 1 — ATOMIC THREAD (AT) ⚡

> **Smallest unit of knowledge.**

**Examples:**
- One question
- One insight
- One paragraph
- One replay snippet
- One image
- One micro-task
- One agent statement

**Atomic Thread MUST contain:**
| Field | Description |
|-------|-------------|
| content | text or media pointer ⚡ |
| origin | meeting, sphere, user ⚡ |
| timestamp | ⚡ |
| topic tags (1–3) | ⚡ |
| classification | **fact / opinion / instruction / artifact** ⚡ |

**Atomic Thread JSON:**
```json
{
  "atomic_thread": {
    "id": "uuid",
    "content": "string|media",
    "origin": { "sphere": "scholar", "source": "meeting", "ref": "replay_id" },
    "tags": ["topic1", "topic2"],
    "type": "fact|question|artifact|instruction",
    "timestamp": 1712345678
  }
}
```

---

### TIER 2 — STRUCTURED THREAD (ST) ⚡

> **Formed when multiple ATs converge around a theme.**

**Examples:**
- A topic summary
- A feature description
- A recurring problem
- A document draft
- A design blueprint

**Structured Thread can generate:**
| Output | Description |
|--------|-------------|
| social posts | ⚡ |
| internal docs | ⚡ |
| user content | ⚡ |
| task bundles | ⚡ |
| **AI training material (safe mode)** | ⚡ |

**Structured Thread JSON:**
```json
{
  "structured_thread": {
    "id": "uuid",
    "title": "string",
    "atoms": ["atomic_id_1", "atomic_id_2"],
    "categories": ["sphere", "topic"],
    "summary": "auto-generated",
    "media": ["urls..."],
    "links": ["st_id", "kt_id"]
  }
}
```

---

### TIER 3 — KNOWLEDGE THREAD (KT) ⚡

> **Highest-level. Multi-sphere. Evolves over time.**

**Examples:**
- "How users decide in Business sphere"
- "Creative Studio workflows"
- "XR meeting insights"
- "Team operating principles"
- **"Product roadmap knowledge"**

**Capabilities:**
| Capability | Description |
|------------|-------------|
| spanning multiple spheres | ⚡ |
| generating documents | ⚡ |
| generating posts | ⚡ |
| generating UI content | ⚡ |
| **serving as a "living manual"** | ⚡ |
| **can be referenced by agents** | ⚡ |

**Knowledge Thread JSON:**
```json
{
  "knowledge_thread": {
    "id": "uuid",
    "title": "string",
    "threads": ["structured_thread_ids"],
    "timeline": [{ "t": "time", "event": "atomic" }],
    "multi_sphere": ["business", "xr", "creative"],
    "versions": [],
    "hash": "sha256"
  }
}
```

---

## THREAD BEHAVIOR (UNIVERSAL RULES) ⚡

| Rule | Description |
|------|-------------|
| **RULE 1 — MULTI-LOCATION** | A thread may appear simultaneously in: user dashboard, sphere index, meeting replay page, personal knowledge tree, universe view thread map ⚡ |
| **RULE 2 — NON-MANIPULATIVE** | Threads can NOT: adjust emotional language, reorder content to bias, hide alternative viewpoints ⚡ |
| **RULE 3 — EVOLUTION** | Threads grow as new atomic entries appear. **Agents MAY aggregate but NEVER rewrite history.** ⚡ |
| **RULE 4 — TRACEABILITY** | Every thread item points to: original context, original timestamp, original participant ⚡ |

---

## CONTENT TYPES ALLOWED AS THREADS ⚡

| Type | Status |
|------|--------|
| questions | ✅ ⚡ |
| answers | ✅ ⚡ |
| notes | ✅ ⚡ |
| audio transcripts | ✅ ⚡ |
| images | ✅ ⚡ |
| documents | ✅ ⚡ |
| **XR frames** | ✅ ⚡ |
| decisions | ✅ ⚡ |
| tasks | ✅ ⚡ |
| **blueprint elements** | ✅ ⚡ |
| **avatar presets (metadata)** | ✅ ⚡ |
| sphere rules | ✅ ⚡ |
| **agent logs (non-sensitive only)** | ✅ ⚡ |

> **Each converts to AT → ST → KT.**

---

## MULTI-SPHERE INTEGRATION ⚡

> **Knowledge Threads replicate across spheres ONLY when relevant.**

| From | To | Example |
|------|----|---------|
| Scholar | Creative | ideas become designs ⚡ |
| Business | Institution | **compliance threads** ⚡ |
| XR | Social | extracts become posts ⚡ |
| **Methodology** | EVERY sphere | **workflows** ⚡ |

---

## POST GENERATION ⚡ (NOUVEAU!)

> **Any thread may become:**

| Output | Description |
|--------|-------------|
| a public post | ⚡ |
| a forum discussion | ⚡ |
| a media carousel | ⚡ |
| a micro-article | ⚡ |
| **a training card** | ⚡ |
| a personal note | ⚡ |

> **NO stylistic manipulation allowed.**

**Thread Post JSON:**
```json
{
  "thread_post": {
    "source": "knowledge_thread_id",
    "format": "post|doc|gallery|faq"
  }
}
```

---

## DOCUMENT GENERATION ⚡ (NOUVEAU!)

> **Knowledge Threads can produce:**

| Document Type | Description |
|---------------|-------------|
| PDFs | ⚡ |
| reports | ⚡ |
| **user manuals** | ⚡ |
| learning modules | ⚡ |
| **onboarding guides** | ⚡ |

---

## CLASSIFICATION ENGINE ⚡

### AUTOMATIC TAGGING ⚡
| Feature | Description |
|---------|-------------|
| sphere mapping | ⚡ |
| topic cluster | ⚡ |
| **sentiment-free classification** | ⚡ |
| replay reference | ⚡ |
| **visual node grouping** | ⚡ |

---

## 4 AGENTS INVOLVED ⚡

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | **aggregates AT → ST, no rewriting** ⚡ |
| `AGENT_THREAD_CURATOR` | validates categories, **prevents duplicates** ⚡ |
| `AGENT_THREAD_INTEGRATOR` | **multi-sphere routing ONLY** ⚡ |
| `AGENT_THREAD_ARCHIVIST` | **version tracking, snapshotting, hashing** ⚡ |

---

## VISUALIZATION (OPTIONAL) ⚡

| Mode | Description |
|------|-------------|
| **2D** | nodes + links, thread evolution timeline ⚡ |
| **3D** | threads as constellations, **spheres as clusters** ⚡ |
| **XR** | **thread strands, memory rooms, spatial playback** ⚡ |

---

**END — FREEZE READY**
