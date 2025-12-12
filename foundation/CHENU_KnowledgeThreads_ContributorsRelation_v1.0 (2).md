# CHE·NU — KNOWLEDGE THREADS SYSTEM (CONTRIBUTORS + RELATION)
**VERSION:** CORE.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / TRACEABLE

---

## GLOBAL PRINCIPLE

> A Knowledge Thread is a **TRACEABLE CONTINUITY** across time, meetings, spheres, and decisions.

### RULE
> **Thread = CONNECTION OF FACTS**  
> NOT interpretation, NOT opinion, NOT recommendation

---

## THREAD TYPE 1 — PERSONAL KNOWLEDGE THREAD (with owner)

### Purpose
Allow a user to follow **THEIR OWN path** of learning, decisions, meetings, and artifacts over time.

### Scope
- user meetings, user-created artifacts, user decisions, user replays, private notes

### Rules
| Rule | Status |
|------|--------|
| private by default | ✅ |
| user-controlled visibility | ✅ |
| no inference added | ✅ |
| chronological backbone | ✅ |

### JSON Model

```json
{
  "knowledge_thread_personal": {
    "thread_id": "uuid",
    "owner": "user_id",
    "entries": [
      {
        "type": "meeting|artifact|decision|note",
        "ref_id": "uuid",
        "timestamp": 1712345678,
        "sphere": "business|scholar|..."
      }
    ],
    "visibility": "private|shared",
    "hash": "sha256"
  }
}
```

---

## THREAD TYPE 2 — COLLECTIVE KNOWLEDGE THREAD (with contributors + verification_state) ⚡

### Purpose
Track **shared factual continuity** across teams, agents, and organizations.

### Scope
- shared meetings, shared decisions, shared artifacts, validated XR replays

### Rules
| Rule | Status |
|------|--------|
| append-only | ✅ |
| **consensus-validated** | ✅ ⚡ |
| immutable once published | ✅ |
| anonymization supported | ✅ |

### JSON Model (with contributors + verification_state) ⚡

```json
{
  "knowledge_thread_collective": {
    "thread_id": "uuid",
    "contributors": ["user_id","agent_id"],
    "entries": [
      {
        "type": "meeting|decision|artifact",
        "ref_id": "uuid",
        "timestamp": 1712345678,
        "sphere": "institution|business|..."
      }
    ],
    "verification_state": "validated",
    "hash": "sha256"
  }
}
```

### Collective Fields ⚡
| Field | Description |
|-------|-------------|
| `contributors` | Array of user/agent IDs |
| `verification_state` | validated / pending / rejected |

---

## THREAD TYPE 3 — INTER-SPHERE KNOWLEDGE THREAD (with relation types) ⚡

### Purpose
Reveal connections **BETWEEN spheres** without blending or collapsing them.

### Scope
- cross-sphere meetings, decisions affecting multiple domains, artifacts reused across spheres

### Rules
| Rule | Status |
|------|--------|
| **no sphere overrides another** | ✅ ⚡ |
| purely relational | ✅ |
| read-only overlay | ✅ |

### JSON Model (with relation types) ⚡

```json
{
  "knowledge_thread_intersphere": {
    "thread_id": "uuid",
    "linked_spheres": ["business","scholar","xr"],
    "links": [
      {
        "from": { "sphere": "business", "id": "uuid" },
        "to": { "sphere": "scholar", "id": "uuid" },
        "relation": "references|follows|influences"
      }
    ],
    "hash": "sha256"
  }
}
```

### Relation Types ⚡
| Relation | Description |
|----------|-------------|
| `references` | References another sphere |
| `follows` | Follows from another sphere |
| `influences` | Influences another sphere |

---

## THREAD VISUALIZATION (UNIVERSE VIEW) ⚡

| Thread | Style |
|--------|-------|
| **PERSONAL** | single-color line, chronological flow |
| **COLLECTIVE** | **braided strands**, **thicker weight = more participants** ⚡ |
| **INTER-SPHERE** | **dotted arcs**, color per sphere, hover reveals linkage |

### Collective Visual ⚡
> **Braided strands where thickness = number of participants**

---

## THREAD INTERACTIONS ⚡

| Action | Description |
|--------|-------------|
| `expand / collapse` | Show/hide details |
| `isolate thread` | Focus on one thread |
| `compare threads` | Side-by-side comparison |
| `open replay at point` | Jump to specific moment |
| `export thread summary` | PDF export |

---

## SAFETY & ETHICS

| Rule | Status |
|------|--------|
| no scoring | ✅ |
| no narrative bias | ✅ |
| no emotional framing | ✅ |
| always reversible | ✅ |
| source always visible | ✅ |

---

## WHY KNOWLEDGE THREADS MATTER

They allow:
- **continuity without control**
- **memory without distortion**
- **learning without pressure**
- **truth without dominance**

---

**END — FOUNDATION FREEZE**
