# CHE·NU — KNOWLEDGE THREADS SYSTEM (CONTRIBUTION THREAD)
**VERSION:** CORE.v1.0  
**TYPE:** FOUNDATION / CROSS-SPHERE / NON-MANIPULATIVE

---

## GLOBAL DEFINITION

> **Knowledge Thread = A FACTUAL CONNECTION LINE**  
> linking information across time, spheres, agents, and users WITHOUT interpretation or priority bias.

### RULE
> **Threads CONNECT knowledge.**  
> **They NEVER evaluate, judge, or rank it.**

---

## THREAD TYPE 1 — TEMPORAL THREAD

### Purpose
Track how a topic or artifact evolves through time.

### Connects
- meetings, replays, decisions, documents, silence intervals

### Example
```
Idea A → discussed → revised → decided → reused
```

### JSON Model

```json
{
  "thread": {
    "id": "uuid",
    "type": "temporal",
    "topic": "string",
    "nodes": ["event_id_1","event_id_2"],
    "timestamps": [1712345678, 1712349999],
    "immutable": true
  }
}
```

### Visualization
- linear timeline
- branch points for divergence
- **silence gaps displayed explicitly**
- no success/failure markers

---

## THREAD TYPE 2 — CONTEXTUAL THREAD

### Purpose
Link the SAME knowledge appearing in DIFFERENT spheres or domains.

### Connects
- Business ↔ Scholar
- XR ↔ Institution
- Creative ↔ Methodology

### Example
```
Research → meeting → policy → implementation
```

### JSON Model

```json
{
  "thread": {
    "id": "uuid",
    "type": "contextual",
    "topic": "string",
    "spheres": ["business","scholar"],
    "linked_nodes": ["artifact_id","decision_id"],
    "visibility": "shared|restricted"
  }
}
```

### Visualization
- multi-orbit links
- sphere color coding
- hover shows source only (no meaning)

---

## THREAD TYPE 3 — CONTRIBUTION THREAD ⚡ NEW

### Purpose
Show **WHO contributed WHAT and WHEN** without measuring influence or importance.

### Connects
- user actions
- agent actions
- artifacts
- annotations

### Example
```
User note → agent summary → replay reference
```

### JSON Model

```json
{
  "thread": {
    "id": "uuid",
    "type": "contribution",
    "participants": ["user_id","agent_id"],
    "actions": [
      { "actor": "id", "action": "create|reference", "timestamp": 1712345678 }
    ]
  }
}
```

### Action Types

| Action | Description |
|--------|-------------|
| `create` | Created new content |
| `reference` | Referenced existing content |
| `annotate` | Added annotation |
| `modify` | Changed content |

### Visualization
- **parallel lanes per participant**
- no ranking
- no weight
- neutral glyphs

---

## THREAD GENERATION RULES

| Rule | Status |
|------|--------|
| auto-detected by reference & reuse | ✅ |
| user can manually create or remove | ✅ |
| agent can suggest ONLY | ✅ |
| must be explainable | ✅ |
| fully auditable | ✅ |

---

## THREAD ACCESS & CONTROL

| Rule | Status |
|------|--------|
| per-user visibility | ✅ |
| per-sphere access | ✅ |
| private threads never shared | ✅ |
| shared threads require consent | ✅ |

---

## AGENTS INVOLVED

| Agent | Role |
|-------|------|
| `AGENT_THREAD_DETECTOR` | Detects factual links, **no interpretation** ⚡ |
| `AGENT_THREAD_EXPLAINER` | Explains why a link exists, human-readable |
| `AGENT_THREAD_GUARD` | Enforces ethics, prevents hidden inference |

### AGENT_THREAD_DETECTOR ⚡ NEW
> **"Detects factual links, no interpretation"**
- Passive detection
- Finds references and reuse patterns
- No semantic inference

---

## WHY ALL 3 THREADS TOGETHER

| Thread | Shows |
|--------|-------|
| **Temporal** | WHEN |
| **Contextual** | WHERE |
| **Contribution** | WHO |

### Together
- **complete understanding**
- **no narrative control**
- **no manipulation**

---

**END — KNOWLEDGE THREADS FREEZE**
