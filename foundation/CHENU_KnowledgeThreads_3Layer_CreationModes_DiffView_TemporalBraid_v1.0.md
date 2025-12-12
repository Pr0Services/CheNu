# CHE·NU — KNOWLEDGE THREADS (3-LAYER SYSTEM)
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / INTERSPHERE / NON-MANIPULATIVE

---

## 1) INTER-SPHERE KNOWLEDGE THREADS

### Purpose
Link related information across spheres **WITHOUT merging them.** Thread = pointer, not container.

### RULES ⚡
- neutral
- non-suggestive
- **user-controlled** ⚡
- **reversible** ⚡

### Thread Structure JSON ⚡

```json
{
  "THREAD": {
    "id": "uuid",
    "origin_sphere": "business|scholar|creative|social|institution|methodology|xr|...",
    "target_sphere": "any",
    "topic": "string",
    "anchors": [
      { "entity": "meeting|artifact|decision|note|replay", "id": "uuid" }
    ],
    "links": [
      { "type": "reference|context|artifact|concept", "to": "uuid" }
    ],
    "confidence": "0.0–1.0 (non-influential, descriptive only)",
    "visibility": "private|team|public",
    "hash": "sha256",
    "created_at": "...",
    "updated_at": "..."
  }
}
```

### Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `anchors[].entity` | **meeting/artifact/decision/note/replay** ⚡ |
| `links[].type` | **reference/context/artifact/concept** ⚡ |
| `confidence` | **0.0-1.0 (non-influential, descriptive only)** ⚡ |
| `visibility` | **private/team/public** ⚡ |

### Creation Modes ⚡ (NOUVEAU!)

| Mode | Description |
|------|-------------|
| **MANUAL (preferred)** | User selects: anchor A → anchor B → creates thread ⚡ |
| **SEMI-AUTOMATIC** | System may propose: "Shared topic detected." **User must EXPLICITLY confirm** ⚡ |
| **AGENT-ASSISTED** | Agent provides explanation of WHY two nodes might relate. **Agent NEVER auto-links** ⚡ |

### Display (2D / XR) ⚡
- faint line between spheres
- **color-coded by topic** ⚡
- no layout dominance
- threads collapsible
- **XR mode: floating arc with minimal opacity** ⚡

---

## 2) PERSONAL vs COLLECTIVE KNOWLEDGE THREADS ⚡

### Purpose
Separate **personal insights** from **collective verified links.**

### RULE
> **Personal ≠ Collective. Collective = verified facts only.**

### Personal Thread ⚡
| Property | Value |
|----------|-------|
| **private to user** | ✅ ⚡ |
| **not validated** | ✅ |
| **supports learning style** | ⚡ |
| **editable at any time** | ✅ ⚡ |
| **can be "promoted" to collective only after verification** | ⚡ |

### Personal Thread JSON ⚡

```json
{
  "personal_thread": {
    "user_id": "uuid",
    "notes": "string",
    "anchors": [...],
    "visibility": "private"
  }
}
```

### Collective Thread ⚡
| Property | Value |
|----------|-------|
| **verified** | ✅ ⚡ |
| **immutable except versioning** | ✅ ⚡ |
| **anchored only on validated artifacts** | ✅ ⚡ |
| **cryptographically hashed** | ✅ ⚡ |

### Collective Thread JSON ⚡

```json
{
  "collective_thread": {
    "verified": true,
    "anchors": [...],
    "evidence_refs": [...],
    "integrity_hash": "sha256"
  }
}
```

### DIFF VIEW: PERSONAL ↔ COLLECTIVE ⚡ (NOUVEAU!)

**Displays:**
| Element | Status |
|---------|--------|
| **overlaps** | ⚡ |
| **disagreements** | ⚡ |
| **missing anchors** | ⚡ |
| **drift (non-emotional)** | ⚡ |
| **shared context** | ⚡ |

> **No scoring, no judgement.**

---

## 3) TEMPORAL KNOWLEDGE THREADS ⚡

### Purpose
Represent the **EVOLUTION OF KNOWLEDGE** across time, without rewriting history.

### RULE
> **Timeline = fixed truth. Thread = evolution trace. No retroactive alteration allowed.**

### Temporal Thread JSON ⚡

```json
{
  "temporal_thread": {
    "id": "uuid",
    "topic": "string",
    "versions": [
      {
        "timestamp": 1712345678,
        "anchors": [...],
        "changes": ["added_anchor", "removed_anchor"],
        "editor": "user|agent",
        "hash": "sha256_version"
      }
    ],
    "current_state": "{ ... last version ... }"
  }
}
```

### Temporal Fields ⚡
| Field | Description |
|-------|-------------|
| `versions[].changes` | **["added_anchor", "removed_anchor"]** ⚡ |
| `versions[].editor` | **user/agent** ⚡ |
| `current_state` | **last version snapshot** ⚡ |

### Temporal Anchors ⚡
| Anchor | Description |
|--------|-------------|
| **timestamped artifacts** | ⚡ |
| **replay segments** | ⚡ |
| **decision logs** | ⚡ |
| **state transitions** | ⚡ |
| **sphere evolution (new categories, new nodes)** | ⚡ |

### Replay-Linked Temporal Nodes ⚡ (NOUVEAU!)

Each replay frame can appear as:
| Node Type | Description |
|-----------|-------------|
| `event_reference` | ⚡ |
| `branching_point` | ⚡ |
| `divergence_indicator` | ⚡ |
| `convergence_indicator` | ⚡ |

> **This creates a "braided temporal map" of knowledge.**

### Visualization (XR + 2D) ⚡

**2D:**
- branching tree with version nodes
- **clickable diffs** ⚡

**XR:**
- **floating chronological rail** ⚡
- **nodes as light spheres** ⚡
- **thread lines "braid" together across time** ⚡

### Safety & Ethics ⚡
| Rule | Status |
|------|--------|
| **No predictive claims** | ✅ ⚡ |
| **No ranking of versions** | ✅ ⚡ |
| **No "best truth" scoring** | ✅ ⚡ |
| **Only showing: "Version A changed to B; here's how."** | ✅ ⚡ |

---

## WHY THE 3 THREAD SYSTEM MATTERS ⚡

| Thread | Purpose |
|--------|---------|
| **INTER-SPHERE** | → shows how knowledge travels ⚡ |
| **PERSONAL vs COLLECTIVE** | → separates perspective from truth ⚡ |
| **TEMPORAL** | → prevents rewriting history ⚡ |

### Together ⚡
- clarity
- accountability
- **cognitive safety** ⚡
- transparency

---

**END — THREAD SYSTEM FREEZE**
