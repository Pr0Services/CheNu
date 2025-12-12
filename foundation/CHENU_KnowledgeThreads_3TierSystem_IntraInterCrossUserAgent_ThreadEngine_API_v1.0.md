# CHE·NU — KNOWLEDGE THREAD SYSTEM
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / BUILD-READY

---

## PURPOSE ⚡

> **Connect information across meetings, spheres, users, and agents WITHOUT altering meaning, creating narratives, or ranking importance.**

### RULE
> **Knowledge Thread = STRUCTURAL LINK ONLY. No inference. No interpretation. No persuasion.**

---

## TIER 1 — INTRA-SPHERE KNOWLEDGE THREADS ⚡

### Context
> **Within a single sphere** (Business, Scholar, Creative, etc.)

### Use Cases ⚡
| Use Case | Description |
|----------|-------------|
| Link decisions across meetings in the same domain | ⚡ |
| Connect documents, replays, and artifacts from one sphere | ⚡ |
| **Provide continuity inside a project or program** | ⚡ |

### 4 Thread Types ⚡
| Type | Description |
|------|-------------|
| `decision_chain` | ⚡ |
| `artifact_lineage` | ⚡ |
| `meeting_sequence` | ⚡ |
| `concept_chain` | ⚡ |

### Tier 1 JSON ⚡
```json
{
  "thread": {
    "tier": 1,
    "sphere": "scholar|business|creative|...",
    "nodes": ["uuid", "uuid", "uuid"],
    "type": "decision_chain|artifact_lineage|sequence|concept",
    "metadata": { "topic": "string" }
  }
}
```

### Rules ⚡
| Rule | Status |
|------|--------|
| **No cross-sphere connections** | ✅ ⚡ |
| **No topic inference** | ✅ ⚡ |
| **Only factual continuity allowed** | ✅ ⚡ |

---

## TIER 2 — INTER-SPHERE KNOWLEDGE THREADS ⚡

### Context
> **Connect knowledge ACROSS spheres.**

### Purpose
> **Reveal structural relationships WITHOUT interpretation.**

### Examples ⚡
```
Scholar research → Business application
Creative design → XR implementation
Institutional rule → Methodology guideline
```

### 5 Thread Types ⚡
| Type | Description |
|------|-------------|
| `cross_reference` | ⚡ |
| `upstream_dependency` | ⚡ |
| `downstream_dependency` | ⚡ |
| `shared_artifact` | ⚡ |
| `sphere_bridge` | ⚡ |

### Tier 2 JSON ⚡
```json
{
  "thread": {
    "tier": 2,
    "spheres": ["scholar", "business"],
    "nodes": ["uuid", "uuid"],
    "relation": "cross_reference|dependency|bridge",
    "metadata": { "justification": "explicit user link" }
  }
}
```

### Key Field: `justification` ⚡
> **Thread must have EXPLICIT justification**

### Rules ⚡
| Rule | Status |
|------|--------|
| **Thread must have EXPLICIT justification** | ✅ ⚡ |
| **No inferred relationships** | ✅ ⚡ |
| **No weighting (no "strong" or "weak")** | ✅ ⚡ |

---

## TIER 3 — CROSS-USER & CROSS-AGENT KNOWLEDGE THREADS ⚡

### Purpose
> **Provide neutral linking of similar structures between users WITHOUT identity exposure, personalization, or profiling.**

### Allowed ⚡
| Allowed | Description |
|---------|-------------|
| anonymized structural patterns | ⚡ |
| **similarity of artifacts (strict hash match)** | ⚡ |
| shared templates | ⚡ |
| **cross-user shared documents (if explicitly shared)** | ⚡ |

### Not Allowed ⚡
| Forbidden | Status |
|-----------|--------|
| **behavioral linking** | ❌ ⚡ |
| **pattern inference** | ❌ ⚡ |
| **psychological correlations** | ❌ ⚡ |
| **prediction-based suggestion** | ❌ ⚡ |

### 4 Thread Types ⚡
| Type | Description |
|------|-------------|
| `shared_template` | ⚡ |
| `shared_artifact_hash` | ⚡ |
| `anonymous_structure_match` | ⚡ |
| `multi_agent_operational_thread` | ⚡ |

### Tier 3 JSON ⚡
```json
{
  "thread": {
    "tier": 3,
    "scope": "cross_user|cross_agent",
    "nodes": ["uuid", "uuid"],
    "privacy": "anonymized",
    "relation": "shared_artifact|structure_match",
    "hash": "sha256"
  }
}
```

### Rules ⚡
| Rule | Status |
|------|--------|
| **Full anonymization required** | ✅ ⚡ |
| **User must explicitly enable cross-user mode** | ✅ ⚡ |
| **No routing enhancements based on Tier 3** | ✅ ⚡ |

---

## KNOWLEDGE THREAD ENGINE — GLOBAL RULES ⚡

### Thread Creation (STRICT) ⚡
| Rule | Status |
|------|--------|
| **always explicit (user, agent, or system event)** | ✅ ⚡ |
| **never automatic inference** | ✅ ⚡ |
| **every thread requires metadata.justification** | ✅ ⚡ |

### Thread Display ⚡
| Rule | Status |
|------|--------|
| **transparent** | ✅ ⚡ |
| **reversible** | ✅ ⚡ |
| **user-controlled visibility** | ✅ ⚡ |
| **no ranking or weighting** | ✅ ⚡ |

### Thread Persistence ⚡
| Rule | Status |
|------|--------|
| **immutable once validated** | ✅ ⚡ |
| **versioned** | ✅ ⚡ |
| **cryptographically hashed** | ✅ ⚡ |

---

## THREAD VISUALIZATION (2D / 3D / XR) ⚡

### Node Shapes ⚡
| Node | Shape |
|------|-------|
| meetings | circle ⚡ |
| documents | square ⚡ |
| replays | diamond ⚡ |
| agents | triangle ⚡ |
| spheres | **orbit rings** ⚡ |

### Edge Styles ⚡
| Tier | Style |
|------|-------|
| **Tier 1** | solid line ⚡ |
| **Tier 2** | dotted line ⚡ |
| **Tier 3** | **dashed line (anonymized)** ⚡ |

### XR Rendering ⚡
| Rule | Description |
|------|-------------|
| **fade-in on focus** | ⚡ |
| **threads appear only when requested** | ⚡ |
| **no auto-highlighting** | ✅ ⚡ |

---

## THREAD ENGINE API ⚡

| Endpoint | Description |
|----------|-------------|
| `/threads/create` | ⚡ |
| `/threads/delete` | ⚡ |
| `/threads/validate` | ⚡ |
| `/threads/list` | ⚡ |
| `/threads/view` | ⚡ |
| `/threads/export` | ⚡ |

---

## THREAD EXPORT FORMATS ⚡

| Format | Description |
|--------|-------------|
| PDF summary | ⚡ |
| JSON bundle | ⚡ |
| XR bundle | ⚡ |
| **Mermaid diagram auto-generation** | ⚡ |

---

**END — KNOWLEDGE THREAD FOUNDATION**
