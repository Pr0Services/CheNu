# CHE·NU — KNOWLEDGE THREADS SYSTEM (VALIDATION + RENDERER)
**VERSION:** CORE.v1.0  
**MODE:** FOUNDATION / TRACEABLE / NON-MANIPULATIVE

---

## GLOBAL DEFINITION

> **Knowledge Thread = A FACTUAL CONTINUITY LINE**  
> linking information, decisions, artifacts, and context WITHOUT interpretation or optimization.

### Rule
> **Threads SHOW connections.**  
> **They NEVER suggest conclusions.**

---

## THREAD TYPES (THE 3)

1. **PERSONAL KNOWLEDGE THREAD**
2. **COLLECTIVE KNOWLEDGE THREAD**
3. **INTER-SPHERE KNOWLEDGE THREAD**

> All share the SAME core structure. Only scope & visibility differ.

---

## 1) PERSONAL KNOWLEDGE THREAD

### Scope
Single user.

### Purpose
- Track personal understanding over time
- Preserve context between sessions
- Support reflection & recall

### Sources
- personal meetings, personal notes, private replays, user decisions, user silence periods

### Rules
| Rule | Status |
|------|--------|
| private by default | ✅ |
| user controls visibility | ✅ |
| never auto-shared | ✅ |
| deletable by user | ✅ |

### Example
> "How my understanding of X evolved across meetings"

### JSON Model

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "personal",
    "owner": "user_id",
    "entries": [
      {
        "source": "meeting|note|decision|artifact",
        "source_id": "uuid",
        "timestamp": 1712345678,
        "sphere": "business|scholar|xr"
      }
    ],
    "visibility": "private",
    "hash": "sha256"
  }
}
```

---

## 2) COLLECTIVE KNOWLEDGE THREAD

### Scope
Multiple users or agents.

### Purpose
- Preserve shared factual continuity
- Avoid memory fragmentation
- Enable collective recall

### Sources
- shared meetings, approved artifacts, validated decisions, collective replays

### Rules
| Rule | Status |
|------|--------|
| append-only | ✅ |
| immutable once validated | ✅ |
| no sentiment or judgment metadata | ✅ |
| attribution preserved | ✅ |

### Example
> "How a team reached a shared decision over time"

### JSON Model (with validation object)

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "collective",
    "participants": ["user_id","agent_id"],
    "entries": [],
    "validation": {
      "status": "verified",
      "validator": "agent_id",
      "timestamp": 1712349999
    },
    "visibility": "group-scoped",
    "hash": "sha256"
  }
}
```

### Validation Object ⚡

| Field | Description |
|-------|-------------|
| `status` | verified / pending / rejected |
| `validator` | Agent or user who validated |
| `timestamp` | When validated |

---

## 3) INTER-SPHERE KNOWLEDGE THREAD

### Scope
Across spheres (Business ↔ Scholar ↔ XR ↔ etc.)

### Purpose
- Maintain coherence across domains
- Prevent siloed understanding
- Show how facts propagate

### Sources
- threads from other spheres, cross-sphere artifacts, decisions referencing other domains

### Rules
| Rule | Status |
|------|--------|
| references only (no data duplication) | ✅ |
| sphere boundaries respected | ✅ |
| access rules enforced per sphere | ✅ |
| visual linking only | ✅ |

### Example
> "How a research insight influenced a business decision"

### JSON Model (with reference_map)

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "inter_sphere",
    "linked_threads": ["thread_id_1","thread_id_2"],
    "spheres": ["scholar","business"],
    "reference_map": [
      {
        "from_entry": "entry_id",
        "to_entry": "entry_id",
        "relation": "influenced|referenced|continued"
      }
    ],
    "visibility": "rule-governed",
    "hash": "sha256"
  }
}
```

### Reference Relations ⚡

| Relation | Description |
|----------|-------------|
| `influenced` | Affected outcome |
| `referenced` | Cited/mentioned |
| `continued` | Extended/followed |

---

## THREAD VISUALIZATION RULES

| Rule | Description |
|------|-------------|
| Shape | Appears as a **LINE**, not a graph |
| Order | Time-ordered |
| Branching | No branching unless explicitly linked |
| Silence | Silence periods visible |
| Sources | Always clickable |

---

## THREAD INTERACTIONS

### ✅ Allowed
- scroll timeline
- zoom focus
- filter source types
- open source artifact
- switch thread scope

### ❌ Forbidden
- scoring
- ranking
- emotional highlighting
- "best path" labeling

---

## AGENTS INVOLVED

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | Assembles threads from sources, **no interpretation** |
| `AGENT_THREAD_VALIDATOR` | Checks integrity & rules, **approves collective threads** |
| `AGENT_THREAD_RENDERER` | **Visualizes threads, no semantic influence** ⚡ |

### AGENT_THREAD_RENDERER ⚡ NEW
> **"Visualizes threads, no semantic influence"**
- Pure rendering
- No filtering authority
- No emphasis manipulation

---

## WHY KNOWLEDGE THREADS MATTER

They provide:
- **continuity without control**
- **memory without distortion**
- **clarity without persuasion**

> **They turn complexity into traceable truth.**

---

**END — FOUNDATION FREEZE**
