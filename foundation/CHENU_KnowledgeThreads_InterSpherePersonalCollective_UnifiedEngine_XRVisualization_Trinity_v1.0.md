# CHE·NU — KNOWLEDGE THREADS (INTER-SPHERE + PERSONAL + COLLECTIVE)
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / BUILD-READY

---

## OVERVIEW ⚡

> **Knowledge Threads = structures NEUTRES reliant:** faits, artefacts, événements, décisions, sphères, replays. **Sans interprétation, sans inférence, sans persuasion.**

> **Thread = UN LIEN FACTUEL, jamais une conclusion.**

### 3 Types ⚡
| # | Type |
|---|------|
| 1 | **Inter-Sphere Knowledge Threads** |
| 2 | **Personal Knowledge Threads** |
| 3 | **Collective Knowledge Threads** |

---

## 1) INTER-SPHERE KNOWLEDGE THREADS ⚡

### Purpose
> **Relier objectivement des informations issues de sphères différentes sans fusionner les contextes ni influencer l'utilisateur.**

### Examples ⚡
| From | To | Link |
|------|----|------|
| Scholar document | Business | ⚡ |
| XR replay | Creative Studio artifact | ⚡ |
| Institution decision | Social reference | ⚡ |

### RULE
> **Inter-Sphere Thread = fact-only.**

### Inter-Sphere Thread JSON ⚡
```json
{
  "thread_id": "uuid",
  "type": "inter_sphere",
  "origin": { "sphere": "scholar", "source_id": "uuid" },
  "target": { "sphere": "business", "source_id": "uuid" },
  "relation": "referenced|shared_artifact|timeline_link",
  "timestamp": 1712345678,
  "hash": "sha256"
}
```

### Visualization ⚡
| Property | Description |
|----------|-------------|
| **straight neutral lines** | ⚡ |
| **no direction bias** | ⚡ |
| **no weight/importance indicator** | ✅ ⚡ |
| **appear only when user requests context expansion** | ✅ ⚡ |

### Agent Roles ⚡
| Agent | Role |
|-------|------|
| `AGENT_THREAD_MAPPER` | identifies factual links, **never suggests meaning** ⚡ |
| `AGENT_THREAD_EXPLAINER` | **describes relation literally (no interpretation)** ⚡ |

---

## 2) PERSONAL KNOWLEDGE THREADS ⚡

### Purpose
> **Allow a user to create his/her OWN threads between items:** bookmarks of understanding, private categorization paths, memory anchors.

### RULE
> **Personal Thread = USER CREATED ONLY. Never auto-generated.**

### Personal Thread Uses ⚡
| Use | Description |
|-----|-------------|
| "connect this replay to this document" | ⚡ |
| "mark this meeting as related to this project" | ⚡ |
| **"anchor this concept to my avatar preset"** | ⚡ |

### Personal Thread JSON ⚡
```json
{
  "thread_id": "uuid",
  "type": "personal",
  "owner": "user_id",
  "nodes": [
    { "id": "uuid", "kind": "meeting" },
    { "id": "uuid", "kind": "artifact" }
  ],
  "label": "optional_text",
  "private": true,
  "version": 3
}
```

### Privacy Rules ⚡
| Rule | Status |
|------|--------|
| **never visible to others unless explicitly shared** | ✅ ⚡ |
| **no inference on user preferences** | ✅ ⚡ |
| **no psychological shaping** | ✅ ⚡ |

---

## 3) COLLECTIVE KNOWLEDGE THREADS ⚡

### Purpose
> **Build NON-INTERPRETED links inside the Collective Memory graph so teams can see how information flows historically.**

> **These threads emerge from validated facts ONLY.**

### RULE
> **Collective Thread = FACT-BASED. NEVER interpretation. NEVER performance judgement. NEVER ranking.**

### Collective Thread Triggers ⚡
| Trigger | Description |
|---------|-------------|
| two meetings share the same artifact | ⚡ |
| same decision referenced multiple times | ⚡ |
| **timelines overlap within a sphere** | ⚡ |
| **same agent acted in both contexts** | ⚡ |

### Collective Thread JSON ⚡
```json
{
  "thread_id": "uuid",
  "type": "collective",
  "source_replays": ["uuid", "uuid"],
  "evidence": ["artifact_id", "decision_id"],
  "hash": "sha256",
  "verified": true
}
```

### Display Rules ⚡
| Rule | Description |
|------|-------------|
| **appear only in Collective Memory mode** | ⚡ |
| rendered as **silver threads** | ⚡ |
| **linked nodes glow faintly** | ⚡ |
| **no animation / no salience ranking** | ✅ ⚡ |

---

## UNIFIED KNOWLEDGE THREAD ENGINE ⚡

### Engine Responsibilities ⚡
| Responsibility | Description |
|----------------|-------------|
| store threads | ⚡ |
| **verify integrity (hash)** | ⚡ |
| check for conflicting links | ⚡ |
| **expose only allowed threads based on permissions** | ⚡ |
| maintain versioning | ⚡ |

### Thread Engine JSON API ⚡
```json
{
  "create_thread": { "..." },
  "delete_thread": { "thread_id": "uuid" },
  "list_threads": { "filters": {} },
  "visualize": { "mode": "2d|3d|xr" }
}
```

---

## XR VISUALIZATION RULES ⚡

### Visual Properties ⚡
| Property | Description |
|----------|-------------|
| **neutral white/grey lines** | ⚡ |
| **width uniform** | ⚡ |
| **no pulsing or attraction** | ✅ ⚡ |
| **user must manually activate thread visibility** | ✅ ⚡ |

### Thread Color Coding ⚡ (NOUVEAU!)
| Thread Type | Color |
|-------------|-------|
| **Personal** | 🔵 blue |
| **Inter-Sphere** | 🟡 yellow |
| **Collective** | ⚪ silver |

---

## ETHICAL SAFEGUARDS ⚡

### PROHIBITED ⚡
| Forbidden | Status |
|-----------|--------|
| extrapolation | ❌ ⚡ |
| prediction | ❌ ⚡ |
| **suggesting meaning** | ❌ ⚡ |
| **suggesting priority threads** | ❌ ⚡ |
| **sentiment or psychological tagging** | ❌ ⚡ |

### ALLOWED ⚡
> **literal connections between validated items**

---

## TRINITY RESULT ⚡ (NOUVEAU!)

| Thread Type | Purpose |
|-------------|---------|
| **Inter-Sphere** | connect knowledge across domains |
| **Personal** | connect meaning for oneself |
| **Collective** | **connect the factual history of a group** |

### TRINITY OUTCOME ⚡
> **• clarity without control**
> **• mapping without persuasion**
> **• navigation without distortion**

---

**END — FREEZE READY**
