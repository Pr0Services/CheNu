# CHE·NU — KNOWLEDGE THREADS (PERSONAL / COLLECTIVE / INTER-SPHERE)
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / BUILD-READY / NON-MANIPULATIVE

---

## OVERVIEW — WHAT IS A KNOWLEDGE THREAD? ⚡

> **A Knowledge Thread is a *neutral chain of linked facts, actions, artifacts, replays, and decisions*, forming a navigable path across time, meetings, spheres, and agents.**

### RULE
> **THREAD = STORY OF FACTS. NOT interpretation. NOT recommendation. NOT emotional narrative.**

---

## 1) PERSONAL KNOWLEDGE THREADS ⚡

### Purpose
Help a user navigate their **OWN history** of actions, meetings, artifacts, and progression.

### RULE
> **Personal = visible ONLY to the user, unless explicitly shared.**

### Thread Content ⚡

**Includes:**
| Content | Description |
|---------|-------------|
| user-created notes | ⚡ |
| user's meeting participation | ⚡ |
| artifacts they touched or created | ⚡ |
| decisions they contributed to | ⚡ |
| timeline of actions (with timestamps) | ⚡ |
| **silent intervals (context space)** | ⚡ |

**Excludes:**
| Forbidden | Status |
|-----------|--------|
| others' private content | ❌ ⚡ |
| **inferred intentions** | ❌ ⚡ |
| **psychological predictions** | ❌ ⚡ |

### Personal Thread JSON ⚡

```json
{
  "personal_thread": {
    "user_id": "uuid",
    "nodes": [
      {
        "id": "uuid",
        "type": "meeting|artifact|replay|decision|note",
        "timestamp": 1712345678,
        "metadata": { "sphere": "business", "tags": ["topicA"] }
      }
    ],
    "links": [
      { "from": "nodeA", "to": "nodeB", "reason": "time|topic|artifact-use" }
    ]
  }
}
```

### UI / XR Behavior ⚡

**2D:**
| Feature | Description |
|---------|-------------|
| vertical timeline | ⚡ |
| expandable nodes | ⚡ |
| **highlight continuity** | ⚡ |

**XR:**
| Feature | Description |
|---------|-------------|
| **floating bead-chain** | ⚡ |
| **follow mode (on rails)** | ⚡ |
| **rewind/fast-forward neutral markers** | ⚡ |

### Safety ⚡
| Rule | Status |
|------|--------|
| **no emotional scoring** | ✅ ⚡ |
| **no productivity metrics** | ✅ ⚡ |
| **no psychological analysis** | ✅ ⚡ |

---

## 2) COLLECTIVE KNOWLEDGE THREADS ⚡

### Purpose
Allow teams to follow the evolution of shared work **WITHOUT hierarchy, persuasion, or prioritization.**

### RULE
> **Collective = MULTI-USER TRUTH PATH. No implied authority.**

### Thread Content ⚡

**Includes:**
| Content | Description |
|---------|-------------|
| all validated artifacts of group work | ⚡ |
| shared decisions | ⚡ |
| replay segments | ⚡ |
| tasks and outcomes | ⚡ |
| **sphere transitions** | ⚡ |

**Excludes:**
| Forbidden | Status |
|-----------|--------|
| user-specific private material | ❌ ⚡ |
| sensitive metadata | ❌ ⚡ |
| **sentiment analysis** | ❌ ⚡ |

### Collective Thread JSON ⚡

```json
{
  "collective_thread": {
    "team_id": "uuid",
    "nodes": [
      { "id": "uuid", "type": "artifact|meeting|decision", "timestamp": "..." }
    ],
    "links": [
      { "from": "node1", "to": "node2", "reason": "group-flow" }
    ],
    "integrity": "sha256-hash"
  }
}
```

### Visualization ⚡

**2D:**
| Feature | Description |
|---------|-------------|
| braided timeline | ⚡ |
| **per-agent color strip** | ⚡ |
| decision markers | ⚡ |

**XR:**
| Feature | Description |
|---------|-------------|
| **multi-path walkway** | ⚡ |
| **ghost replays at branch points** | ⚡ |
| neutral ambient cues | ⚡ |

### Safety ⚡
| Rule | Status |
|------|--------|
| **NO best-path indicators** | ✅ ⚡ |
| **NO rankings** | ✅ ⚡ |
| **NO predictive nudging** | ✅ ⚡ |

---

## 3) INTER-SPHERE KNOWLEDGE THREADS ⚡

### Purpose
Connect domains (Business ↔ Scholar ↔ Creative ↔ XR ↔ Social) using **only FACTUAL relationships.**

### RULE
> **Inter-Sphere = INFRASTRUCTURE OF TRUTH. NOT cross-domain influence.**

### 5 TRIGGER CONDITIONS ⚡ (NOUVEAU!)

> **A thread is created ONLY when:**

| Condition | Description |
|-----------|-------------|
| **an artifact moves across spheres** | ⚡ |
| **a meeting touches multiple domains** | ⚡ |
| **a replay includes cross-sphere participants** | ⚡ |
| **a decision requires multi-domain context** | ⚡ |
| **a task migrates between departments** | ⚡ |

### Inter-Sphere Thread JSON ⚡

```json
{
  "intersphere_thread": {
    "origin_sphere": "business",
    "linked_spheres": ["scholar", "creative"],
    "nodes": [
      { "id": "uuid", "sphere": "business", "type": "artifact", "timestamp": "..." },
      { "id": "uuid", "sphere": "scholar", "type": "meeting", "timestamp": "..." }
    ],
    "links": [
      { "from": "nodeA", "to": "nodeB", "reason": "cross-domain-artifact" }
    ]
  }
}
```

### Visualization ⚡

**Universe View:**
| Feature | Description |
|---------|-------------|
| spheres as orbital regions | ⚡ |
| **thread drawn as smooth arcs** | ⚡ |
| **intensity proportional to thread length NOT importance** | ⚡ |

**XR:**
| Feature | Description |
|---------|-------------|
| **corridor of floating nodes connecting spheres** | ⚡ |
| **ambient shift at each sphere boundary** | ⚡ |
| **expand-on-gaze interaction** | ⚡ |

### Safety ⚡
| Rule | Status |
|------|--------|
| **cross-sphere clarity only** | ✅ ⚡ |
| **no prioritization algorithms** | ✅ ⚡ |
| **no interpretation of "relevance"** | ✅ ⚡ |

---

## WHY THESE 3 THREAD TYPES MATTER ⚡

| Type | = |
|------|---|
| **PERSONAL** | Your path ⚡ |
| **COLLECTIVE** | Our shared path ⚡ |
| **INTER-SPHERE** | **How knowledge connects across domains** ⚡ |

### Together ⚡
- full traceability
- **zero manipulation**
- structural intelligence
- clarity across levels

---

**END — CHE·NU KNOWLEDGE THREADS**
