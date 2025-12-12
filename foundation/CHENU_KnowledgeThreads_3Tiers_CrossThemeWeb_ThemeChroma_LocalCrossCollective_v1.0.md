# CHE·NU — KNOWLEDGE THREADS (3 TIERS) + CROSS-THEME KNOWLEDGE WEB
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / BUILD-READY

---

## PURPOSE

> **Knowledge Threads = a neutral, transparent way to link information, artifacts, decisions, and replays across spheres, themes, and timelines WITHOUT inference, bias, or narrative shaping.**

### RULE
> **Thread = TRACE OF RELATION, NOT INTERPRETATION.**

---

## TIER 1 — LOCAL KNOWLEDGE THREADS ⚡
*(Single sphere → Local context)*

### Local Thread Sources ⚡
| Source | Description |
|--------|-------------|
| meeting notes | ⚡ |
| tasks | ⚡ |
| artifacts | ⚡ |
| replay segments | ⚡ |
| **user-created bookmarks** | ⚡ |

### Local Thread Types ⚡
| Type | Description |
|------|-------------|
| `shared_artifact` | ⚡ |
| `shared_topic` | ⚡ |
| `temporal_continuity` | ⚡ |
| `agent_reference` | ⚡ |
| `task_sequence` | ⚡ |

### Local Thread Example ⚡
> Business → Sales → Pipeline Step 3 → Artifact "proposal_draft.pdf"

### Local Thread Properties ⚡
| Property | Value |
|----------|-------|
| `sphere_locked` | **true** ⚡ |
| `theme_aware` | **false** ⚡ |
| `no cross-linking` | ⚡ |
| `minimal metadata` | ⚡ |

### Local Thread JSON ⚡

```json
{
  "local_thread": {
    "id": "uuid",
    "sphere": "business",
    "links": [
      { "from": "artifact_id", "to": "task_id", "type": "shared_topic" }
    ],
    "hash": "sha256",
    "read_only": true
  }
}
```

---

## TIER 2 — CROSS-SPHERE KNOWLEDGE THREADS ⚡
*(Linking multiple spheres: Scholar ↔ Business ↔ Creative…)*

### Cross-Sphere Sources ⚡
| Source | Description |
|--------|-------------|
| **replay exports referencing different domains** | ⚡ |
| **artifacts reused across spheres** | ⚡ |
| **cross-functional meetings** | ⚡ |
| **shared goals** | ⚡ |

### Cross-Sphere Thread Types ⚡
| Type | Example |
|------|---------|
| `conceptual_bridge` | research → marketing ⚡ |
| `workflow_crosspoint` | design → development ⚡ |
| `multi-agent continuity` | ⚡ |
| `decision impact mapping` | ⚡ |

### Cross-Sphere Rules ⚡
| Rule | Status |
|------|--------|
| **user must confirm each link** | ✅ ⚡ |
| **never auto-generate irreversible bridges** | ✅ ⚡ |
| **no causal inference** | ✅ ⚡ |

### Cross-Sphere JSON ⚡

```json
{
  "cross_sphere_thread": {
    "id": "uuid",
    "spheres": ["business", "scholar"],
    "anchors": [
      { "replay": "uuid", "segment": "t=42–55" },
      { "artifact": "uuid" }
    ],
    "type": "conceptual_bridge",
    "hash": "sha256"
  }
}
```

---

## TIER 3 — COLLECTIVE KNOWLEDGE THREADS ⚡
*(Aggregate memory + multi-user validation)*

### Collective Sources ⚡
| Source | Description |
|--------|-------------|
| **validated replay memory entries** | ⚡ |
| **community references** | ⚡ |
| **inter-user shared artifacts (opt-in)** | ⚡ |

### Collective Thread Rules ⚡
| Rule | Status |
|------|--------|
| **multi-user confirmation required** | ✅ ⚡ |
| **collective audit trail** | ✅ ⚡ |
| **immutable once finalized** | ✅ ⚡ |
| **cryptographically chained** | ✅ ⚡ |

### Collective Thread Types ⚡
| Type | Description |
|------|-------------|
| `historical chain` | ⚡ |
| `multi-decision evolution` | ⚡ |
| `convergence/divergence mapping` | ⚡ |
| `sphere-wide insight weaving` | ⚡ |

### Collective Thread JSON ⚡

```json
{
  "collective_thread": {
    "id": "uuid",
    "participants": ["userA", "userB"],
    "entries": ["memory_id_1", "memory_id_2", "memory_id_3"],
    "validation": {
      "signatures": ["sigA", "sigB"],
      "timestamp": "..."
    },
    "type": "historical_chain",
    "hash": "sha256"
  }
}
```

---

## CROSS-THEME KNOWLEDGE WEB ⚡ (NOUVEAU!)
*(Themes: Classic, Cosmic, Builder, Sanctum, Jungle)*

### Purpose
Display how knowledge traverses **THEMES**, not just spheres. Theme = aesthetic lens + functional clustering.

### RULE
> **Themes affect VISUALIZATION, NOT CONTENT.**

### Theme Nodes ⚡
| Theme | Description |
|-------|-------------|
| `classic_thread` | ⚡ |
| `cosmic_thread` | ⚡ |
| `builder_thread` | ⚡ |
| `sanctum_thread` | ⚡ |
| `jungle_thread` | ⚡ |

### Theme Cross-Links ⚡
| Type | Description |
|------|-------------|
| `temporal resonance` | events repeated in diff contexts ⚡ |
| `structural similarity` | plans, workflows ⚡ |
| `parallel decisions` | same logic applied differently ⚡ |
| `cross-avatar artifacts` | blueprints, visuals ⚡ |

### THEME CHROMA RULES ⚡ (NOUVEAU!)
| Theme | Color |
|-------|-------|
| **classic** | soft gold ⚡ |
| **cosmic** | deep cyan ⚡ |
| **builder** | sandstone ⚡ |
| **sanctum** | neon white ⚡ |
| **jungle** | green amber ⚡ |

### Theme Web JSON ⚡

```json
{
  "knowledge_web": {
    "themes": {
      "classic": ["...threads..."],
      "cosmic": ["...threads..."],
      "builder": ["...threads..."]
    },
    "cross_theme_links": [
      { "from": "classic_thread_12", "to": "cosmic_thread_4", "type": "structural_similarity" }
    ]
  }
}
```

---

## VISUALIZATION: XR + 2D ⚡

### XR VIEW ⚡
| Feature | Description |
|---------|-------------|
| **threads = glowing lines** | ⚡ |
| **nodes = spheres/themes/meetings** | ⚡ |
| **user can "walk the web"** | ⚡ |
| **ghost markers show segment origins** | ⚡ |

**3 Levels Appear As:**
| Level | Display |
|-------|---------|
| **local** | thin line ⚡ |
| **cross-sphere** | braided line ⚡ |
| **collective** | **thick gold line** ⚡ |

### 2D VIEW ⚡
| Feature | Description |
|---------|-------------|
| **force-directed graph** | ⚡ |
| **filter by sphere/theme** | ⚡ |
| **toggle: density slider** | ⚡ |
| **breadcrumb preview** | ⚡ |

---

## AGENT ROLES ⚡

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | **constructs raw threads, never interprets meaning** ⚡ |
| `AGENT_THREAD_VALIDATOR` | **checks ethics, safety, redundancy** ⚡ |
| `AGENT_COLLECTIVE_ARCHIVER` | **maintains cryptographic chain** ⚡ |
| `AGENT_THEME_MAPPER` | **adapts visualization per theme, no aesthetic persuasion** ⚡ |

---

## ETHICAL LOCKS ⚡

### Knowledge Threads MUST NOT ⚡
| Forbidden | Status |
|-----------|--------|
| **suggest interpretations** | ❌ ⚡ |
| **predict outcomes** | ❌ ⚡ |
| **rank importance** | ❌ ⚡ |
| **hide alternatives** | ❌ ⚡ |
| **rebuild narratives** | ❌ ⚡ |

### They CAN ⚡
| Allowed | Status |
|---------|--------|
| **show verified links** | ✅ ⚡ |
| **display structures** | ✅ ⚡ |
| **reveal connections OVER TIME** | ✅ ⚡ |

---

## WHY THIS MATTERS ⚡

### Knowledge Threads turn Che-Nu into ⚡
- a transparent web of truth
- a multi-perspective structure
- **a non-manipulative intelligence layer** ⚡

> **You do NOT get a story. You get the structure OF stories.**

---

**END — FOUNDATION FREEZE READY**
