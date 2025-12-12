# CHE·NU — KNOWLEDGE THREAD PACK (3-LAYER SYSTEM)
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / FREEZE-READY

---

## 1) INTER-SPHERE KNOWLEDGE THREADS (ISKT) ⚡

### Purpose
> **Create neutral, factual links between concepts, documents, meetings and replays ACROSS SPHERES without interpretation or bias.**

### RULE
> **Thread = FACTUAL CONNECTION, not a conclusion.**

### 4 Thread Types ⚡
| Type | Description |
|------|-------------|
| `CONTEXT_THREAD` | connects similar topics across spheres (ex: "budget" ↔ business) ⚡ |
| `ARTIFACT_THREAD` | links documents, notes, visual boards ⚡ |
| `TIMELINE_THREAD` | links events chronologically across domains ⚡ |
| `AGENT_ACTION_THREAD` | **connects agent tasks contributing to shared objectives** ⚡ |

### Inter-Sphere Thread JSON ⚡
```json
{
  "inter_sphere_thread": {
    "id": "uuid",
    "from": { "sphere": "...", "entity_id": "..." },
    "to": { "sphere": "...", "entity_id": "..." },
    "type": "context|artifact|timeline|agent",
    "strength": 0.0-1.0,
    "hash": "sha256"
  }
}
```

### Key Field: `strength` ⚡
> **Purely structural, NOT emotional**

### Behavioral Rules ⚡
| Rule | Status |
|------|--------|
| **threads can be followed, expanded or muted** | ✅ ⚡ |
| **never re-rank** | ✅ ⚡ |
| **never infer importance** | ✅ ⚡ |
| **never recommend decisions** | ✅ ⚡ |
| **always transparent ("WHY this thread exists")** | ✅ ⚡ |

---

## 2) PERSONAL KNOWLEDGE THREADS (PKT) ⚡

### Purpose
> **Allow each user to build their OWN network of meaning without altering global data or influencing others.**

### RULE
> **Personal Threads = PERSONAL MAP, NOT a universal truth.**

### 4 Personal Thread Types ⚡
| Type | Description |
|------|-------------|
| `BOOKMARK_THREAD` | items the user wants quick access to ⚡ |
| `LEARNING_THREAD` | **user-marked progression paths** ⚡ |
| `MEMORY_THREAD` | connections between past meetings or replays ⚡ |
| `FUTURE_THREAD` | **user-defined reminders or planned topics** ⚡ |

### Personal Thread JSON ⚡
```json
{
  "personal_thread": {
    "id": "uuid",
    "user_id": "uuid",
    "nodes": ["entity_id_1", "entity_id_2"],
    "label": "string",
    "color": "hex",
    "visibility": "private",
    "created_at": "...",
    "updated_at": "..."
  }
}
```

### Personal Safety Rules ⚡
| Rule | Status |
|------|--------|
| **never exposed to other users** | ✅ ⚡ |
| **cannot override global structure** | ✅ ⚡ |
| **cannot bias AI routing** | ✅ ⚡ |
| **full user control (edit / detach / delete)** | ✅ ⚡ |

---

## 3) COLLECTIVE KNOWLEDGE THREAD NETWORK (CKTN) ⚡

### Purpose
> **Represent the objective, shared structure of all validated knowledge WITHOUT any prioritization.**

### RULE
> **Collective Thread = only when two or more validated entities are objectively connected through:** replay evidence, artifact reference, decision logs, context metadata.

### 5 Network Layers ⚡ (NOUVEAU!)
| Layer | Description |
|-------|-------------|
| **LAYER A** | EVENT-BASED THREADS ⚡ |
| **LAYER B** | ARTIFACT THREADS ⚡ |
| **LAYER C** | DECISION THREADS ⚡ |
| **LAYER D** | CONTEXT THREADS ⚡ |
| **LAYER E** | **CROSS-SPHERE CONSENSUS MAP (auto-generated)** ⚡ |

### Collective Thread JSON ⚡
```json
{
  "collective_thread": {
    "id": "uuid",
    "sources": ["replay_id", "document_id", "artifact_id"],
    "nodes": [
      { "entity_id": "...", "type": "meeting|decision|artifact|concept" }
    ],
    "validated": true,
    "cryptographic_proof": "sha256",
    "version": 3
  }
}
```

### Network Properties ⚡
| Property | Status |
|----------|--------|
| **append-only** | ✅ ⚡ |
| **versioned** | ✅ ⚡ |
| **immutable after freeze** | ✅ ⚡ |
| **always hash-signed** | ✅ ⚡ |
| **cannot be filtered to mislead the user** | ✅ ⚡ |
| **always shows when a thread is user-made vs system-made** | ✅ ⚡ |

---

## GLOBAL RENDERING (2D + 3D + XR) ⚡

### Visual Cues ⚡
| Type | Visual |
|------|--------|
| inter-sphere | **thin white/blue lines** ⚡ |
| personal | **colored user-selected lines** ⚡ |
| collective | **thicker neutral structural lines** ⚡ |

### XR ⚡
| Rule | Status |
|------|--------|
| threads appear as **soft, non-moving beams** | ⚡ |
| **no pulling / nudging / focus forcing** | ✅ ⚡ |
| **user must manually expand threads** | ✅ ⚡ |

### 2D ⚡
- graph overlay
- **expandable node clusters**

---

## SAFETY & ETHICS GUARANTEES ⚡

| NO | YES |
|----|-----|
| emotional ranking | **transparency** |
| persuasion | **explainability** |
| attention steering | **reversible personal changes** |
| cognitive shaping | **verifiable collective history** |
| importance scoring | |

---

## WHY THIS MATTERS ⚡

| Thread Type | Connects |
|-------------|----------|
| **Inter-Sphere** | domains |
| **Personal** | your journey |
| **Collective** | **reality** |

### Together ⚡
> **Knowledge without distortion. Navigation without influence. Truth without hierarchy.**

---

**END — KNOWLEDGE THREAD PACK (3-LAYER SYSTEM)**
