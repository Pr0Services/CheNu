# CHE·NU — KNOWLEDGE THREADS SYSTEM
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / BUILD-INTEGRATED

---

## 1) CORE KNOWLEDGE THREADS ⚡

### Purpose
> **Represent knowledge as CONNECTED THREADS linking:** ideas, tasks, meetings, artifacts, agents, users (optional, non-identifying) across time and across spheres.

> **A Knowledge Thread = A TRACE OF LEARNING, not an opinion, not persuasion.**

### Thread Structure JSON ⚡
```json
{
  "thread": {
    "id": "uuid",
    "title": "string",
    "origin": "meeting|task|artifact|user",
    "nodes": ["ThreadNode"],
    "links": ["ThreadLink"],
    "sphere": "business|scholar|creative|...",
    "visibility": "private|team|public",
    "integrity_hash": "sha256"
  }
}
```

### ThreadNode JSON ⚡
```json
{
  "timestamp": "...",
  "type": "idea|fact|artifact|decision|reference",
  "source": "meeting_id|artifact_id|manual",
  "content": "...",
  "metadata": {}
}
```

### ThreadLink JSON ⚡
```json
{
  "from": "node_id",
  "to": "node_id",
  "relation": "supports|contradicts|extends|references"
}
```

### Key Field: `relation` ⚡ (NOUVEAU!)
| Relation | Description |
|----------|-------------|
| `supports` | ⚡ |
| `contradicts` | ⚡ |
| `extends` | ⚡ |
| `references` | ⚡ |

### Rules ⚡
| Rule | Status |
|------|--------|
| **Append-only** | ✅ ⚡ |
| **Immutable after freeze** | ✅ ⚡ |
| **Zero emotional metadata** | ✅ ⚡ |
| **All content traceable** | ✅ ⚡ |
| **No inferred meaning** | ✅ ⚡ |
| **No influence algorithms** | ✅ ⚡ |

---

## 2) CROSS-SPHERE KNOWLEDGE THREADS ⚡

### Purpose
> **When a concept spans multiple spheres, create a unified thread that shows:** how Business links to Scholar, how Scholar feeds Creative, how Institution constraints impact XR, how Social perception influences rollout — **WITHOUT mixing control or decision power.**

### 4 Cross-Sphere Node Types ⚡
| Type | Description |
|------|-------------|
| `sphere_reference` | ⚡ |
| `context_shift` | ⚡ |
| `cross-impact note` | ⚡ |
| `dependency mapping` | ⚡ |

### Cross-Sphere Examples ⚡
| From | To | Link |
|------|----|------|
| **Business** | Scholar | "Market need" → "Learning path" ⚡ |
| **Scholar** | Creative | "Concept research" → "Visual prototype" ⚡ |
| **Institution** | Business | "Compliance requirement" → "Process change" ⚡ |

### Cross-Sphere JSON ⚡
```json
{
  "cross_thread": {
    "thread_id": "uuid",
    "sphere_chain": ["business", "scholar", "creative"],
    "interactions": [
      {
        "from_sphere": "business",
        "to_sphere": "scholar",
        "note": "skill requirement identified"
      }
    ]
  }
}
```

### RULE
> **No cross-sphere thread may override sphere autonomy.**

---

## 3) COMMUNITY & ENTERPRISE KNOWLEDGE THREADS ⚡ (NOUVEAU!)

### Purpose
> **Allow enterprises, creators, organisations to publish optional threads as:** offers, opportunities, guidance, nearby events, products, collaborations.

### BUT ⚡
| Che-Nu NEVER | Status |
|--------------|--------|
| **pushes content** | ❌ ⚡ |
| **manipulates visibility** | ❌ ⚡ |
| **performs ad-targeting** | ❌ ⚡ |

### Instead ⚡
> **Che-Nu evaluates what a user is actually TRYING TO DO, and ONLY suggests relevant threads when:**
- context matches a real need
- **user gives permission**
- value to user is demonstrable

### Enterprise Thread JSON ⚡
```json
{
  "enterprise_thread": {
    "id": "uuid",
    "type": "offer|promotion|event|knowledge",
    "content": "...",
    "location": "optional geotag",
    "tags": ["construction", "fitness", "learning", "..."],
    "value_proposition": "what user gains",
    "opt_in_required": true,
    "expires_at": "...",
    "integrity_hash": "sha256"
  }
}
```

### Key Fields ⚡ (NOUVEAU!)
| Field | Description |
|-------|-------------|
| `value_proposition` | **what user gains** ⚡ |
| `opt_in_required` | **always true** ⚡ |
| `expires_at` | time-limited ⚡ |

---

## USER-CENTRIC THREAD SURFACING ⚡ (NOUVEAU!)

### Logic ⚡
```
IF (user_context == matching_need) AND (user_opted_in == true):
    → Suggest thread with soft halo
ELSE:
    → Hide completely

NEVER AUTO-PUSH.
```

### Examples ⚡
| Enterprise | Post | Surfacing |
|------------|------|-----------|
| Small business | "We repair stone patios" | **Home Maintenance sphere** ⚡ |
| Café | "Free coffee for remote workers" | **Work Flow sphere** ⚡ |
| Creator | "Local workshop on painting" | **Creative sphere (opted-in only)** ⚡ |

---

## BENEFIT MODEL ⚡

### Enterprise Wins ⚡
| Benefit | Description |
|---------|-------------|
| **No ads needed** | ⚡ |
| **No spam** | ⚡ |
| **No manipulation** | ⚡ |
| **Reach people who WANT their value** | ⚡ |

### User Wins ⚡
| Benefit | Description |
|---------|-------------|
| **No overwhelm** | ⚡ |
| **No noise** | ⚡ |
| **No selling** | ⚡ |
| **Only real relevance** | ⚡ |

---

## KNOWLEDGE THREADS IN UNIVERSE VIEW ⚡

| Appearance | Description |
|------------|-------------|
| **soft paths between nodes** | ⚡ |
| **optional overlays** | ⚡ |
| **never brighter than meetings** | ⚡ |
| **never drawing attention forcibly** | ⚡ |

---

## ETHICAL CONSTRAINTS ⚡

| Constraint | Status |
|------------|--------|
| **No microtargeting** | ✅ ⚡ |
| **No psychological triggers** | ✅ ⚡ |
| **No engagement optimization** | ✅ ⚡ |
| **Hard transparency at every level** | ✅ ⚡ |
| **Every thread explains WHY it is surfaced** | ✅ ⚡ |

---

**END — KNOWLEDGE THREADS FREEZE**
