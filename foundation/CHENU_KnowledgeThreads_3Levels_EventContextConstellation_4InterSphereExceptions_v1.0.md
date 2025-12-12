# CHE·NU — KNOWLEDGE THREADS (3 NIVEAUX) + EXCEPTIONS INTER-SPHÈRES
**VERSION:** CORE.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / BUILD-READY

---

## PART I — KNOWLEDGE THREADS (K-THREADS) ⚡

### Purpose
> **Provide a *non-manipulative*, *non-interprétative* way of linking information, actions, artifacts, meetings, and decisions across spheres.**

### RULE
> **K-Threads = STRUCTURED CONNECTIONS. NOT inference. NOT optimization. NOT narrative shaping.**

---

## LEVEL 1 — EVENT THREADS (Micro) ⚡

### Scope
Small, factual chain linking: actions, artifacts, decisions, events.

### Characteristics ⚡
| Property | Status |
|----------|--------|
| **immutable** | ✅ ⚡ |
| **time-ordered** | ✅ ⚡ |
| **single-source** | ✅ ⚡ |
| **no interpretation** | ✅ ⚡ |

### Event Thread JSON ⚡
```json
{
  "event_thread": {
    "id": "uuid",
    "events": [
      { "id": "...", "timestamp": "...", "type": "artifact|decision|note", "sphere": "..." }
    ]
  }
}
```

### Use Cases ⚡
- replay anchoring
- decision audit
- artifact history

---

## LEVEL 2 — CONTEXT THREADS (Meso) ⚡

### Scope
Connect multiple Event Threads around: a topic, a goal, a project, a recurring question.

### Characteristics ⚡
| Property | Status |
|----------|--------|
| **cross-sphere** | ✅ ⚡ |
| **user/agent shareable** | ✅ ⚡ |
| **non-interpretative clustering** | ✅ ⚡ |

### Context Thread JSON ⚡
```json
{
  "context_thread": {
    "id": "uuid",
    "topic": "string",
    "sources": ["event_thread_id"],
    "spheres": ["business", "scholar", "creative", "..."],
    "links": [{ "from": "event_thread_id", "to": "event_thread_id" }]
  }
}
```

### Use Cases ⚡
- research synthesis
- project overview
- **multi-meeting clustering**

---

## LEVEL 3 — KNOWLEDGE CONSTELLATIONS (Macro) ⚡

### Scope
A CONSTELLATION unifies multiple Context Threads around a long-term theme, **without inference**.

### Characteristics ⚡
| Property | Status |
|----------|--------|
| **high-level map** | ✅ ⚡ |
| **no ranking** | ✅ ⚡ |
| **no interpretation** | ✅ ⚡ |
| **transparency-first** | ✅ ⚡ |

### Knowledge Constellation JSON ⚡
```json
{
  "knowledge_constellation": {
    "id": "uuid",
    "theme": "string",
    "threads": ["context_thread_id"],
    "visual_nodes": ["..."],
    "hash": "sha256"
  }
}
```

### Use Cases ⚡
- universe-level understanding
- **deep project archives**
- **collaborative knowledge map**

---

## PART II — EXCEPTIONS INTER-SPHÈRES ⚡ (NOUVEAU!)

### Purpose
> **Define *formal exceptions* allowing certain spheres to interact across boundaries safely.**

### RULE
> **Exceptions must be explicit, documented, non-emotional, et contrôlées par les guards de sécurité.**

---

## EXCEPTION TYPE 1 — CREATIVE STUDIO (Global Access) ⚡

### Reason
Needed for visual creation, documentation, avatars, XR assets.

### Allowed to Access ⚡
| Sphere | Status |
|--------|--------|
| Business data (branding, assets) | ✅ ⚡ |
| Scholar data (diagrams, educational) | ✅ ⚡ |
| Social & Media (export/publishing) | ✅ ⚡ |
| **Personal sphere (only with user opt-in)** | ✅ ⚡ |

### Restrictions ⚡
| Restriction | Status |
|-------------|--------|
| **no editing external data** | ✅ ⚡ |
| **only reads + produces assets** | ✅ ⚡ |
| **no emotional style suggestions** | ✅ ⚡ |

### Exception JSON ⚡
```json
{
  "exception_creative_studio": {
    "access": ["business", "scholar", "social", "personal_optin"],
    "capabilities": ["asset_generation", "diagram", "avatar_render"],
    "limits": ["read_only_external"]
  }
}
```

---

## EXCEPTION TYPE 2 — IA LABS (Cross-Sphere Analysis) ⚡

### Reason
Needed for testing methodologies, agents, workflows, and analyzing system-wide patterns WITHOUT overriding spheres.

### Allowed to Access ⚡
| Access | Condition |
|--------|-----------|
| any sphere | **via sanitized extracts only** ⚡ |
| private user data | **only with opt-in** ⚡ |
| write operations | **IA Lab domain only** ⚡ |

### Use Cases ⚡
- training agents on structure, not identity
- testing workflows
- **debugging interactions**

### Exception JSON ⚡
```json
{
  "exception_ai_lab": {
    "input": "sanitized_data_only",
    "access": ["all_spheres"],
    "write_permissions": ["ia_lab_space_only"],
    "limits": ["no_user_identity", "no_private_content"]
  }
}
```

---

## EXCEPTION TYPE 3 — PERSONNEL (Project-Based Bridging) ⚡

### Reason
User's Personal Sphere must be able to interact with project-related spheres.

### Allowed Interactions (project-bound only) ⚡
| Bridge | Status |
|--------|--------|
| Personal ↔ Business | ✅ ⚡ |
| Personal ↔ Scholar | ✅ ⚡ |
| Personal ↔ Creative | ✅ ⚡ |
| Personal ↔ Institution | ✅ ⚡ |

### Rules ⚡
| Rule | Status |
|------|--------|
| **MUST be project-scoped** | ✅ ⚡ |
| **no global bridging** | ✅ ⚡ |
| **no agent auto-access** | ✅ ⚡ |

### Exception JSON ⚡
```json
{
  "exception_personal_project_bridge": {
    "allowed": ["business", "scholar", "creative", "institution"],
    "scope": "project_only",
    "limits": ["no_unscoped_access", "user_control_required"]
  }
}
```

---

## EXCEPTION TYPE 4 — FUTURE EXTENSIBLE EXCEPTIONS ⚡

### Purpose
System must allow adding new exceptions in freeze-safe manner.

### Exception Template JSON ⚡
```json
{
  "exception_template": {
    "name": "string",
    "justification": "string",
    "allowed_spheres": ["..."],
    "scope": "string",
    "limits": ["..."],
    "audit_required": true
  }
}
```

---

## PART III — INTERACTION BETWEEN K-THREADS & EXCEPTIONS ⚡

### RULE
> **Exceptions DO NOT create new K-threads. They only allow additional READ access for stitching.**

| Thread Level | Cross-Sphere Rule |
|--------------|-------------------|
| **Event Threads** | NEVER mix spheres automatically ⚡ |
| **Context Threads** | may include cross-sphere events IF exception permits ⚡ |
| **Constellations** | represent themes, not hierarchy ⚡ |

---

## PART IV — ETHICAL GUARANTEES ⚡

| Guarantee | Status |
|-----------|--------|
| **No inference from threads** | ✅ ⚡ |
| **No suggestions based on private data** | ✅ ⚡ |
| **No favoritism across spheres** | ✅ ⚡ |
| **No sphere dominating another** | ✅ ⚡ |
| **All exceptions visible + auditable** | ✅ ⚡ |
| **User opt-in required for Personal sphere** | ✅ ⚡ |
| **Creative Studio cannot influence decisions** | ✅ ⚡ |
| **AI Lab cannot override boundaries** | ✅ ⚡ |

---

**END — FOUNDATION FREEZE**
