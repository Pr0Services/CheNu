# CHE·NU — KNOWLEDGE THREADS SYSTEM (3 LAYERS)
**VERSION:** KNOW.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / EQUILIBRE COGNITIF

---

## GLOBAL PRINCIPLE — KNOWLEDGE THREAD ⚡

> **A Knowledge Thread = a verified chain of facts, contexts, artifacts, and memories across spheres, meetings, replays, and user interactions.**

> **NEVER prescriptive. NEVER persuasive. NEVER algorithmically emotional.**

### RULE
> **Thread = TRACE, not STORY.**

---

## CROSS-CUTTING SAFETY RULE — ENTERTAINMENT CONTENT ⚡ (NOUVEAU!)

> **All entertainment/media content in Knowledge Threads MUST:**

| Rule | Status |
|------|--------|
| **declare content type = "divertissement"** | ✅ ⚡ |
| **display cognitive load level** | ✅ ⚡ |
| **show "real informational value" tag (low/med/high)** | ✅ ⚡ |
| **NEVER auto-chain into a productive thread** | ✅ ⚡ |
| **suggest equilibrium paths (pause, grounding, alternate spheres)** | ✅ ⚡ |
| **NEVER optimize for retention or addiction** | ✅ ⚡ |
| **NEVER target vulnerabilities** | ✅ ⚡ |

---

## 1) INDIVIDUAL KNOWLEDGE THREAD ⚡

### Purpose
> **Show a user the FACTUAL continuity of what they've done, learned, decided, explored. No judgement.**

### 7 Node Types ⚡
| Type | Description |
|------|-------------|
| `meeting_attended` | ⚡ |
| `replay_reviewed` | ⚡ |
| `artifact_created` | ⚡ |
| `concept_visited` | ⚡ |
| `sphere_transition` | ⚡ |
| `decision_reference` | ⚡ |
| `passive_exposure` | **for media/entertainment → must include "value_tag"** ⚡ |

### Thread Shape ⚡
| Property | Description |
|----------|-------------|
| **chronological braid** | ⚡ |
| **quiet zones recorded** | ⚡ |
| **can branch, but never collapse branches** | ⚡ |

### Individual Thread JSON ⚡
```json
{
  "individual_thread": {
    "user_id": "uuid",
    "nodes": ["..."],
    "value_tags": { "cognitive_load": 0.3, "informational_value": "medium" },
    "divertissement_explicit": true
  }
}
```

### Key Field: `value_tags` ⚡ (NOUVEAU!)
| Tag | Values |
|-----|--------|
| `cognitive_load` | 0.0-1.0 ⚡ |
| `informational_value` | **low / medium / high** ⚡ |

### User Controls ⚡
| Control | Description |
|---------|-------------|
| hide entertainment nodes | ⚡ |
| **highlight learning clusters** | ⚡ |
| freeze thread for export | ⚡ |
| **delete nodes (local only)** | ⚡ |

---

## 2) INTER-SPHERE KNOWLEDGE THREAD ⚡

### Purpose
> **Show how knowledge flows between Spheres WITHOUT forcing flow.**

### Connectable Spheres ⚡
| From | To |
|------|----|
| business | ↔ scholar ⚡ |
| creative | ↔ social ⚡ |
| institution | ↔ methodology ⚡ |
| **XR** | ↔ any sphere (contextualization) ⚡ |

### RULE
> **Inter-sphere linking focuses on STRUCTURE, not meaning.**

### 6 Node Types ⚡
| Type | Description |
|------|-------------|
| `concept_link` | ⚡ |
| `artifact_link` | ⚡ |
| `role_overlap` | ⚡ |
| `methodological_transfer` | ⚡ |
| `multi-sphere agent presence` | ⚡ |
| `cross-sphere decision echoes` | ⚡ |

### DIVERTISSEMENT RULE ⚡
| Entertainment Nodes | Status |
|---------------------|--------|
| **can link only if explicitly referenced** | ✅ ⚡ |
| **cannot create or influence sphere routing** | ✅ ⚡ |
| **must remain visually distinct (soft color)** | ✅ ⚡ |

### Inter-Sphere Thread JSON ⚡
```json
{
  "intersphere_thread": {
    "origin": "sphere_id",
    "destinations": ["sphere_id"],
    "links": ["..."],
    "safety": { "distraction_guard": true }
  }
}
```

### Key Field: `distraction_guard` ⚡ (NOUVEAU!)
> **Protects against entertainment influencing navigation**

### Visual Line Types ⚡
| Line | Meaning |
|------|---------|
| **thin lines** | informational ⚡ |
| **dotted lines** | **entertainment** ⚡ |
| **thick lines** | **validated knowledge** ⚡ |

---

## 3) COLLECTIVE KNOWLEDGE THREAD ⚡

### Purpose
> **Show shared knowledge evolution across users, teams, agents.**

### STRICT RULES ⚡
| Rule | Status |
|------|--------|
| **no personal identifiers unless opted in** | ✅ ⚡ |
| **no inference of intent** | ✅ ⚡ |
| **no sentiment analysis** | ✅ ⚡ |
| **collective ≠ majority truth** | ✅ ⚡ |

### 5 Node Types ⚡
| Type | Description |
|------|-------------|
| `validated decisions` | ⚡ |
| `shared artifacts` | ⚡ |
| `recurring topics` | ⚡ |
| `consensus anchors` | ⚡ |
| `multi-user replay intersections` | ⚡ |

### ENTERTAINMENT RULE ⚡
| Rule | Status |
|------|--------|
| **entertainment cannot define collective threads** | ✅ ⚡ |
| **only "referenced entertainment" nodes appear** | ✅ ⚡ |
| **value tag required** | ✅ ⚡ |

### Collective Thread JSON ⚡
```json
{
  "collective_thread": {
    "nodes": ["..."],
    "sources": ["meeting_id", "artifact_id"],
    "trust": "distributed",
    "integrity_hash": "sha256",
    "entertainment_allowed": false
  }
}
```

### Key Field: `entertainment_allowed` ⚡ (NOUVEAU!)
> **Default: false — entertainment cannot define collective threads**

---

## THREAD SAFETY ENGINE (ALL THREE) ⚡

### 6 Guards ⚡
| # | Guard |
|---|-------|
| 1 | **No persuasion** ⚡ |
| 2 | **No ranking of value/life success** ⚡ |
| 3 | **No emotional content shaping** ⚡ |
| 4 | **Transparency in node origins** ⚡ |
| 5 | **Ability to mute entire branches** ⚡ |
| 6 | **Entertainment cannot route or prioritize** ⚡ |

---

## THREAD VISUALIZATION RULESET ⚡

| Node Type | Color |
|-----------|-------|
| **informational nodes** | neutral color ⚡ |
| **entertainment nodes** | **soft amber** ⚡ |
| **collective nodes** | pale blue ⚡ |
| **decision nodes** | grey/gold ⚡ |
| **silent zones** | hollow nodes ⚡ |

| Rule | Status |
|------|--------|
| **links never animate aggressively** | ✅ ⚡ |
| **no dopamine cues** | ✅ ⚡ |
| **no retention techniques** | ✅ ⚡ |

---

## EXPORT / REPLAY INTEGRATION ⚡

### Export Formats ⚡
| Format | Description |
|--------|-------------|
| PDF thread | ⚡ |
| JSON thread | ⚡ |
| **XR walk-through thread** | ⚡ |
| **Universe View overlay** | ⚡ |

### XR Mode ⚡
| Feature | Description |
|---------|-------------|
| user walks along thread in 3D | ⚡ |
| **nodes float as neutral glyphs** | ⚡ |
| **entertainment nodes clearly flagged** | ✅ ⚡ |

---

**END — THREAD SYSTEM FREEZE**
