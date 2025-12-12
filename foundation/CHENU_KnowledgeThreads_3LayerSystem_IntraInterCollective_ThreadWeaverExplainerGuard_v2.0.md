# CHE·NU — KNOWLEDGE THREADS (3-LAYER SYSTEM)
**VERSION:** MEMORY.v2.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / FREEZE-READY

---

## KNOWLEDGE THREADS — CORE PRINCIPLES ⚡

> **Knowledge Threads = neutral informational links connecting CONTENT across:**

| Layer | Scope |
|-------|-------|
| **1** | one sphere |
| **2** | multiple spheres |
| **3** | **multiple users (collective layer)** |

### RULES ⚡
| Rule | Status |
|------|--------|
| **No hierarchical importance** | ✅ ⚡ |
| **No prioritization bias** | ✅ ⚡ |
| **No emotional tone** | ✅ ⚡ |
| **No persuasion** | ✅ ⚡ |
| **Only FACT → FACT linking** | ✅ ⚡ |

---

## 1) INTRA-SPHERE KNOWLEDGE THREADS ⚡

### Purpose
> **Connect related knowledge inside a single sphere** (Business, Scholar, Creative, Institutions, etc.)

### Examples ⚡
| Chain | Description |
|-------|-------------|
| Task → Document → Decision → Replay | Business ⚡ |
| Concept → Lesson → Resource → Test Results | Scholar ⚡ |
| Creative Asset → Workflow → Output Preview | Creative ⚡ |

### Thread Features ⚡
- highlight relationships
- navigate history
- **explore dependencies**

### Intra-Sphere Thread JSON ⚡
```json
{
  "intra_sphere_thread": {
    "sphere": "business|scholar|creative|...",
    "nodes": [
      { "id": "uuid", "type": "task|doc|replay|note", "timestamp": 17123 }
    ],
    "edges": [
      { "from": "uuid", "to": "uuid", "relation": "depends_on|references|derived_from" }
    ],
    "hash": "sha256_integrity"
  }
}
```

### Thread Rules ⚡
| Rule | Status |
|------|--------|
| **no scoring** | ✅ ⚡ |
| **no recommendation** | ✅ ⚡ |
| **no inference** | ✅ ⚡ |

---

## 2) INTER-SPHERE KNOWLEDGE BRIDGES ⚡

### Purpose
> **Link knowledge between TWO OR MORE spheres without merging them.**

### Examples ⚡
| From | To | Link |
|------|----|------|
| Scholar lesson | Business training material | ⚡ |
| Creative Studio asset | Social Media campaign | ⚡ |
| Institutional policy | **Methodology guideline** | ⚡ |

### Bridge Features ⚡
| Feature | Description |
|---------|-------------|
| user-initiated linking | ⚡ |
| **agent-assisted discovery (explain-only)** | ⚡ |
| **instant toggling ON/OFF in Universe View** | ⚡ |

### Knowledge Bridge JSON ⚡
```json
{
  "knowledge_bridge": {
    "source_sphere": "scholar",
    "target_sphere": "business",
    "link_type": "concept_transfer|resource_share|policy_reference",
    "items": [
      { "source_id": "uuid", "target_id": "uuid" }
    ],
    "created_by": "user|agent",
    "audit": { "timestamp": "...", "explanation": "string" }
  }
}
```

### Rules ⚡
| Rule | Status |
|------|--------|
| **bridges NEVER auto-create cross-sphere tasks** | ✅ ⚡ |
| **bridges NEVER reinterpret content** | ✅ ⚡ |
| **sphere autonomy preserved** | ✅ ⚡ |

---

## 3) CROSS-USER / COLLECTIVE KNOWLEDGE THREADS ⚡

### Purpose
> **Provide a SHARED knowledge map across multiple users / teams / agents WITHOUT merging personal spaces.**

### Use Cases ⚡
| Use Case | Description |
|----------|-------------|
| multiple people referencing the same replay | ⚡ |
| shared project with decision chains | ⚡ |
| collective research inside Scholar | ⚡ |
| **distributed creative process** | ⚡ |

### Thread Features ⚡
| Feature | Description |
|---------|-------------|
| **anonymization possible** | ⚡ |
| **shared but non-intrusive** | ⚡ |
| **replayable truth anchors** | ⚡ |

### Collective Thread JSON ⚡
```json
{
  "collective_thread": {
    "thread_id": "uuid",
    "contributors": ["userA", "userB", "agentX"],
    "nodes": [
      { "id": "uuid", "origin_user": "anon_42", "type": "event|doc|replay" }
    ],
    "edges": [
      { "from": "uuid", "to": "uuid", "relation": "supports|contrasts|follows" }
    ],
    "visibility": "team|project|public",
    "hash": "sha256"
  }
}
```

### Key Field: `origin_user: "anon_42"` ⚡
> **Anonymization built-in**

### Rules ⚡
| Rule | Status |
|------|--------|
| **no interpretation** | ✅ ⚡ |
| **no suggesting dominant narrative** | ✅ ⚡ |
| **no authority weighting** | ✅ ⚡ |
| **contributors equal weight** | ✅ ⚡ |

---

## UNIVERSE VIEW INTEGRATION ⚡

### Thread Visualization ⚡
| Thread Type | Visual |
|-------------|--------|
| **inter-sphere** | outer orbit arcs ⚡ |
| **cross-user** | **braided multicolor threads** ⚡ |
| **intra-sphere** | internal radial links ⚡ |

### User Controls ⚡
| Control | Description |
|---------|-------------|
| show/hide per thread type | ⚡ |
| expand / collapse thread groups | ⚡ |
| **isolate thread for deep reading** | ⚡ |
| **export thread summary (PDF)** | ⚡ |

---

## 3 AGENT ROLES ⚡

| Agent | Role |
|-------|------|
| `AGENT_THREAD_WEAVER` | detects factual relationships, proposes links with explanation, **never auto-link without consent** ⚡ |
| `AGENT_THREAD_EXPLAINER` | explains why nodes are related, **no suggestions, no prioritization** ⚡ |
| `AGENT_THREAD_GUARD` | **prevents biased relationships**, ensures compliance with memory rules ⚡ |

---

## SECURITY / ETHICAL GUARANTEES ⚡

| Guarantee | Status |
|-----------|--------|
| **all threads immutable after approval** | ✅ ⚡ |
| **cryptographic hashing on creation** | ✅ ⚡ |
| **transparent linking reasons** | ✅ ⚡ |
| **no "strong" or emotional connections** | ✅ ⚡ |
| **pure informational scaffolding** | ✅ ⚡ |

---

## WHY THIS MATTERS ⚡

> **Knowledge Threads = the nervous system of Che-Nu.**

### They allow ⚡
- clarity
- discoverability
- multi-sphere synthesis
- **historical truth**

> **WITHOUT manipulation, bias or narrative influence.**

---

**END — KNOWLEDGE THREAD SYSTEM v2.0**
