# CHE·NU — KNOWLEDGE THREADS (3 TIERS) + INTERNAL CAMERA & MICRO
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / USER-CONTROLLED

---

## TIER 1 — LOCAL KNOWLEDGE THREADS ⚡

### Purpose
> **Track knowledge evolution INSIDE a single sphere. No cross-sphere inference. No predictive assumption.**

### 4 Thread Types ⚡
| Type | Description |
|------|-------------|
| `fact_flow` | documents, notes, artifacts ⚡ |
| `action_flow` | user actions, agent actions ⚡ |
| `context_flow` | meetings, replays, decisions ⚡ |
| `evolution_flow` | **avatar/tooling changes** ⚡ |

### Rules ⚡
| Rule | Status |
|------|--------|
| **append-only** | ✅ ⚡ |
| **neutral labeling** | ✅ ⚡ |
| **timestamps required** | ✅ ⚡ |
| **privacy lock ON by default** | ✅ ⚡ |

### Local Thread JSON ⚡
```json
{
  "local_thread": {
    "sphere": "business|scholar|creative|...",
    "events": [
      { "t": 17123, "type": "fact|action|context", "source": "user|agent", "hash": "sha256" }
    ]
  }
}
```

---

## TIER 2 — CROSS-SPHERE KNOWLEDGE THREADS ⚡

### Purpose
> **Reveal how information MOVES between spheres WITHOUT inferring intent or meaning.**

### Thread Sources ⚡
| Source | Description |
|--------|-------------|
| shared artifacts | ⚡ |
| shared agents | ⚡ |
| **shared participants** | ⚡ |
| replay references | ⚡ |
| **decision dependencies** | ⚡ |

### Visualization ⚡
| Property | Description |
|----------|-------------|
| **braided threads (soft curves)** | ⚡ |
| **sphere-to-sphere arcs** | ⚡ |
| **no thickness scaling (avoid persuasion)** | ✅ ⚡ |

### Cross-Sphere Thread JSON ⚡
```json
{
  "cross_thread": {
    "origin_sphere": "scholar",
    "destination_sphere": "creative",
    "links": [
      { "artifact_id": "uuid", "reason": "shared_reference" },
      { "meeting_id": "uuid", "reason": "participant_overlap" }
    ]
  }
}
```

### Safety ⚡
| Rule | Status |
|------|--------|
| **no semantic inference** | ✅ ⚡ |
| **no risk scoring** | ✅ ⚡ |
| **no cognitive steering** | ✅ ⚡ |

---

## TIER 3 — UNIVERSAL KNOWLEDGE THREADS ⚡

### Purpose
> **Transparent view of how ALL knowledge evolves across the entire Che-Nu tree, over time.**

### Rules ⚡
| Rule | Status |
|------|--------|
| **time-based only** | ✅ ⚡ |
| **user-controlled filters** | ✅ ⚡ |
| **always reversible** | ✅ ⚡ |
| **cannot generate insights: only structure** | ✅ ⚡ |

### Universal Thread JSON ⚡
```json
{
  "universal_threads": {
    "timeline": ["..."],
    "nodes": ["events", "artifacts", "replays"],
    "edges": ["reference", "dependency", "sequence"],
    "hash": "sha256"
  }
}
```

### Visual ⚡
| Property | Description |
|----------|-------------|
| **galaxy view** | ⚡ |
| **soft node glow** | ⚡ |
| **temporal spiral** | ⚡ |
| **thread density = constant (no bias)** | ✅ ⚡ |

---

## INTERNAL CAMERA & MICRO — CONTROLLED RECORDING ⚡ (NOUVEAU!)

### Purpose
> **Allow the user to record:** their actions, their voice, their interactions inside Che-Nu **FOR:** replay, assistance, sharing, debugging.

### RULE
> **User owns 100% of recordings. Nothing is captured without explicit action.**

---

### CAMERA FEATURES ⚡

### 4 Modes ⚡
| Mode | Description |
|------|-------------|
| `screen_capture` | UI + actions ⚡ |
| `xr_perspective` | **user viewpoint** ⚡ |
| `object_focus` | select object to track ⚡ |
| `step_recorder` | **event-by-event** ⚡ |

### Camera Safety ⚡
| Rule | Status |
|------|--------|
| **no background capture** | ✅ ⚡ |
| **no auto-start** | ✅ ⚡ |
| **no silent recording** | ✅ ⚡ |
| **blinking icon ("REC")** | ✅ ⚡ |
| **session sandboxing** | ✅ ⚡ |

### Camera JSON ⚡
```json
{
  "recording_camera": {
    "mode": "screen|xr|object|step",
    "resolution": "720p|1080p",
    "active": false,
    "start_time": null,
    "permissions": "user-only",
    "export": ["mp4", "xrpack", "pdf_summary"]
  }
}
```

---

### MICROPHONE FEATURES ⚡

### 4 Modes ⚡
| Mode | Description |
|------|-------------|
| `voice_notes` | ⚡ |
| `live_explanation` | **"explain what I'm doing"** ⚡ |
| `meeting_narration` | ⚡ |
| `help_request` | **"assist me now"** ⚡ |

### Mic Safety ⚡
| Rule | Status |
|------|--------|
| **push-to-talk only (never continuous)** | ✅ ⚡ |
| **visual + audio indicator** | ✅ ⚡ |
| **no storage unless user saves** | ✅ ⚡ |

### Mic JSON ⚡
```json
{
  "recording_micro": {
    "active": false,
    "capture_mode": "note|session|meeting",
    "start_time": null,
    "transcription_enabled": true,
    "storage_scope": "private|shared_with_agent",
    "hash": "sha256"
  }
}
```

---

### RECORDING ASSISTANT AGENT ⚡

### `AGENT_CAPTURE_ASSIST` ⚡
| Capability | Description |
|------------|-------------|
| activates only on explicit command | ⚡ |
| **annotates actions for clarity** | ⚡ |
| generates replay bundle | ⚡ |
| **NEVER interprets meaning** | ✅ ⚡ |
| **NEVER judges performance** | ✅ ⚡ |

---

### RECORDING SHARE OPTIONS ⚡
| Option | Description |
|--------|-------------|
| share to agent (with masks) | ⚡ |
| **share as replay summary** | ⚡ |
| share to team (meeting import) | ⚡ |
| **export XR reconstruction** | ⚡ |
| **export PDF annotated** | ⚡ |

---

### INTERACTION FLOWS ⚡

**START RECORDING:**
```
user → "record this"
camera.active = true  
mic.active = optional  
UI pulse appears  
```

**STOP RECORDING:**
```
user → "stop"  
bundle assembled → hashed → stored locally  
```

**ASK ASSISTANCE:**
```
user → "help me understand this"
→ passes last N seconds to agent  
→ agent replies in context window only  
```

---

## INTEGRATION WITH KNOWLEDGE THREADS ⚡

| Tier | Integration |
|------|-------------|
| **Tier 1** | recordings create events & fact nodes ⚡ |
| **Tier 2** | shared recordings become **cross-thread anchors** ⚡ |
| **Tier 3** | replays form part of **universal timeline** ⚡ |

### RULE
> **Recordings NEVER overwrite existing memory.**

---

**END — FREEZE READY**
