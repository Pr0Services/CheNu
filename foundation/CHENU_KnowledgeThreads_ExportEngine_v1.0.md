# CHE·NU — KNOWLEDGE THREAD SYSTEM + EXPORT ENGINE
**VERSION:** FOUNDATION v1.0  
**MODE:** STRUCTURAL / NON-MANIPULATIVE / BUILD-READY

---

## GLOBAL DEFINITION

> **Knowledge Thread = A structured, traceable line of knowledge**  
> that connects facts, actions, decisions, artifacts, and time  
> ACROSS spheres, meetings, users, and agents.

### RULE
> **Threads link WHAT happened.**  
> **They DO NOT conclude WHY it happened.**

---

## THE 3 KNOWLEDGE THREAD TYPES

### THREAD TYPE 1 — DECISION THREAD

#### Purpose
Track how a decision emerged over time.

#### Connects
- meetings
- proposals
- arguments
- silent intervals
- final decision
- consequences (logged later)

#### Never Includes
- ❌ intent assumptions
- ❌ emotional labels
- ❌ success metrics

#### JSON

```json
{
  "decision_thread": {
    "id": "uuid",
    "topic": "string",
    "sphere": "business|scholar|xr|...",
    "nodes": [
      {
        "type": "meeting|artifact|decision|silence",
        "ref_id": "uuid",
        "timestamp": 1712345678
      }
    ],
    "status": "open|paused|closed",
    "hash": "sha256"
  }
}
```

---

### THREAD TYPE 2 — KNOWLEDGE BUILD THREAD

#### Purpose
Track the evolution of understanding on a subject.

#### Connects
- research
- learning sessions
- documents
- agent contributions
- revisions

#### Never Includes
- ❌ authority ranking
- ❌ persuasion strength
- ❌ truth scoring

#### JSON

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "subject": "string",
    "sphere": "scholar|creative|institution",
    "nodes": [
      {
        "type": "document|session|agent_input|revision",
        "ref_id": "uuid",
        "timestamp": 1712345678
      }
    ],
    "versioning": true,
    "hash": "sha256"
  }
}
```

---

### THREAD TYPE 3 — CONTEXT THREAD

#### Purpose
Preserve context continuity across time and spheres.

#### Connects
- background facts
- assumptions explicitly stated
- environmental constraints
- domain rules active at the time

#### Never Includes
- ❌ inferred motives
- ❌ psychological profiles

#### JSON

```json
{
  "context_thread": {
    "id": "uuid",
    "scope": "meeting|project|sphere|global",
    "context_elements": [
      {
        "type": "rule|fact|constraint|environment",
        "ref_id": "uuid",
        "timestamp": 1712345678
      }
    ],
    "active": true,
    "hash": "sha256"
  }
}
```

---

## THREAD LINKING RULES

| Rule | Description |
|------|-------------|
| Multi-membership | A node may belong to multiple threads |
| Immutability | Threads are immutable after closure |
| References | Threads reference sources, not copies |
| Time-order | All links are time-ordered |
| Transparency | No hidden cross-linking |

---

## THREAD VISUALIZATION (UNIVERSE VIEW)

| Element | Behavior |
|---------|----------|
| Threads | Rendered as soft lines |
| Colors | Coded by type |
| Thickness | = number of confirmed nodes |
| Click action | Reveals source only |
| Scaling | ❌ NO "importance" scaling |

---

## THREAD EXPORT ENGINE

### Purpose
Allow safe sharing of knowledge **WITHOUT leaking control.**

### Export Formats

| Format | Type |
|--------|------|
| `PDF` | human-readable |
| `JSON` | machine-readable |
| `XR Thread Replay` | spatial |

---

### EXPORT RULES

1. **User selects:**
   - thread(s)
   - visibility scope
   - anonymization level

2. **Export properties:**
   - read-only
   - includes integrity hash
   - never includes private metadata unless approved

---

### EXPORT JSON MODEL

```json
{
  "thread_export": {
    "threads": ["thread_id_1","thread_id_2"],
    "format": "pdf|json|xr",
    "anonymized": true,
    "scope": "personal|team|public",
    "generated_at": 1712345678,
    "hash": "sha256"
  }
}
```

---

## AGENTS INVOLVED

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | Assembles thread structure, no interpretation |
| `AGENT_THREAD_VALIDATOR` | Verifies integrity & links |
| `AGENT_THREAD_EXPORTER` | Generates export bundles |

---

## ETHICAL GUARANTEES

| Guarantee | Status |
|-----------|--------|
| No narrative shaping | ✅ |
| No persuasion vectors | ✅ |
| No ranking of truth | ✅ |
| Full traceability | ✅ |
| Silence preserved as data | ✅ |

---

## WHY THIS MATTERS

Knowledge Threads ensure:
- **Memory without distortion**
- **Continuity without control**
- **Sharing without manipulation**
- **Truth without authority**

---

**END — THREAD SYSTEM FREEZE**
