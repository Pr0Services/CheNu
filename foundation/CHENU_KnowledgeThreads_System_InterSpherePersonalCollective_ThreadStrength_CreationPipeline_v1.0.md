# CHE·NU — KNOWLEDGE THREAD SYSTEM
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / TRACEABLE

---

## OVERVIEW ⚡

> **Knowledge Threads = VERIFIABLE LINKS between:** concepts, meetings, artifacts, spheres, agents, users (optional, permission), decisions.

| Rule | Status |
|------|--------|
| **They DO NOT infer meaning** | ✅ ⚡ |
| **They DO NOT generate narratives** | ✅ ⚡ |
| **They ONLY map RELATIONSHIPS** | ✅ ⚡ |

### 3 Types ⚡
| Type | Scope |
|------|-------|
| **Inter-Sphere** | cross-sphere links |
| **Personal** | user-private |
| **Collective** | **globally recognized** |

---

## 1) INTER-SPHERE KNOWLEDGE THREADS ⚡

### Purpose
> **Connect information that spans multiple spheres WITHOUT merging or overriding sphere boundaries.**

### Example
> A Business decision referencing Scholar research, or a Social conversation linking to Creative assets.

### Thread Rules ⚡
| Rule | Status |
|------|--------|
| **Cross-sphere, cross-context** | ✅ ⚡ |
| **Always requires a SOURCE + TARGET** | ✅ ⚡ |
| **No auto-creation from sentiment or intent** | ✅ ⚡ |
| **Triggered by: replay, artifact metadata, user linking** | ✅ ⚡ |

### Inter-Sphere Thread JSON ⚡
```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "intersphere",
    "source": { "sphere": "business", "ref_id": "uuid" },
    "target": { "sphere": "scholar", "ref_id": "uuid" },
    "relationship": "reference|dependency|impact|context",
    "created_by": "user|agent",
    "timestamp": 1712345678,
    "hash": "sha256"
  }
}
```

### Validation Rules ⚡
| Rule | Status |
|------|--------|
| **hash must match original artifacts** | ✅ ⚡ |
| **both nodes must be public or authorized** | ✅ ⚡ |
| **always reversible (thread can be removed)** | ✅ ⚡ |

### Universe View
> **Rendered as soft inter-sphere beams.**

---

## 2) PERSONAL KNOWLEDGE THREADS ⚡

### Purpose
> **Allow a user to build their OWN conceptual map:** bookmarks, private mental linking, personal workflows, custom project threads.

### RULE
> **Personal threads NEVER affect collective view. They are user-private unless explicitly shared.**

### Personal Thread JSON ⚡
```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "personal",
    "owner_user_id": "uuid",
    "nodes": [
      { "ref_id": "uuid", "context": "meeting|note|artifact" },
      { "ref_id": "uuid", "context": "task|idea|goal" }
    ],
    "notes": "optional annotation",
    "visibility": "private|shared_specific",
    "timestamp": 1712345678
  }
}
```

### Allowed vs Not Allowed ⚡
| Allowed | Not Allowed |
|---------|-------------|
| add nodes | **influence routing of other users** |
| chain nodes | **modify shared memory** |
| collapse threads | **override replay interpretation** |
| annotate | |

### UI Representation
> **Small glowing filament only visible to user.**

---

## 3) COLLECTIVE KNOWLEDGE THREADS ⚡

### Purpose
> **Represent GLOBALLY RECOGNIZED relationships, validated by multiple users OR by structural data.**

### Unlike Inter-Sphere Threads ⚡
| Collective Threads Represent |
|------------------------------|
| shared workflows |
| repeated context links |
| **confirmed dependencies** |

### RULE
> **Collective Threads = FACT-BASED RECURRENCE. NOT opinion. NOT consensus. NOT prediction.**

### Creation Rules ⚡
| Condition | Threshold |
|-----------|-----------|
| distinct replays reference same link | **≥ 2** |
| users create identical personal links | **≥ 3** |
| structural artifact links both nodes | **≥ 1** |

### Collective Thread JSON ⚡
```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "collective",
    "validated_sources": ["replay_id_1", "replay_id_2"],
    "nodes": [
      { "ref_id": "uuid_source" },
      { "ref_id": "uuid_target" }
    ],
    "relationship": "verified_link",
    "strength": 0.0-1.0,
    "hash": "sha256"
  }
}
```

### Thread Strength ⚡ (NOUVEAU!)
| Strength | Meaning |
|----------|---------|
| **0.2** | weak recurrence |
| **0.5** | moderate recurring evidence |
| **0.8+** | **strong evidence across contexts** |

### Forbidden ⚡
| NO | Status |
|----|--------|
| **emotional weight** | ❌ ⚡ |
| **predictive ranking** | ❌ ⚡ |
| **"importance" scoring** | ❌ ⚡ |

### Universe View Integration
> **Displayed as: stable lines, low-opacity, never animated aggressively.**

---

## KNOWLEDGE THREAD ENGINE ⚡

### Thread Creation Pipeline ⚡
| Step | Action |
|------|--------|
| **1** | detect candidate link (factual only) |
| **2** | verify node validity |
| **3** | classify type (personal/intersphere/collective) |
| **4** | hash + sign |
| **5** | add to memory graph |
| **6** | render in Universe View |

### Thread Safety Limits ⚡
| Limit | Status |
|-------|--------|
| **no auto-link from sentiment or phrasing** | ✅ ⚡ |
| **no inferred causes** | ✅ ⚡ |
| **no hidden relationships** | ✅ ⚡ |
| **user approval required** | ✅ ⚡ |

---

## RENDERING RULES (XR + 2D) ⚡

| Thread Type | Visual |
|-------------|--------|
| **PERSONAL** | faint, colorized by user theme ⚡ |
| **INTER-SPHERE** | **gradient between spheres** ⚡ |
| **COLLECTIVE** | solid, minimal brightness ⚡ |

### Hover Actions ⚡
| Action | Description |
|--------|-------------|
| view sources | ⚡ |
| **open related replay** | ⚡ |
| **jump to artifact** | ⚡ |

---

## KNOWLEDGE THREAD JSON EXPORT ⚡

```json
{
  "threads_bundle": {
    "version": "1.0",
    "threads": ["..."],
    "hash": "sha256",
    "integrity": "verified"
  }
}
```

---

**END — KNOWLEDGE THREAD SYSTEM**
