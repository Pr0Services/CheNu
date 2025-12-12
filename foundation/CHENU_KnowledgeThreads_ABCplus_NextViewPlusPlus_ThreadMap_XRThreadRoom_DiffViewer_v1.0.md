# CHE·NU — KNOWLEDGE THREADS x3 + NEXT VIEW++
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / BUILD-READY

---

## KNOWLEDGE THREADS — PRINCIPLE

> **A Knowledge Thread = a SAFE, TRACEABLE connection** between pieces of information across: time, spheres, agents, users, replays, artifacts WITHOUT rewriting meaning or proposing interpretations.

### RULE
> **Thread = LINK, not STORY.**

---

## THREAD TYPE A — INTER-SPHERE KNOWLEDGE FLOW ⚡

### Purpose
Show how ideas, insights, or artifacts **travel from one sphere to another.**

### Source Nodes ⚡
| Type | Description |
|------|-------------|
| meeting | ⚡ |
| replay | ⚡ |
| artifact | ⚡ |
| agent action | ⚡ |
| decision log | ⚡ |

### Destination ⚡
- related artifact
- follow-up meeting
- adjacent sphere

### Allowed Links ⚡
| Type | Description |
|------|-------------|
| `referenced_by` | ⚡ |
| `extended_in` | ⚡ |
| `reused_for` | ⚡ |
| `clarified_by` | ⚡ |

### Thread A JSON ⚡

```json
{
  "thread_A": {
    "id": "uuid",
    "origin_sphere": "business",
    "destination_sphere": "creative",
    "links": [{ "from": "uuid", "to": "uuid", "type": "referenced_by" }],
    "context": "cross-pollination",
    "immutability": true
  }
}
```

### Safety ⚡
| Rule | Status |
|------|--------|
| **no semantic guess** | ✅ ⚡ |
| **no inference of user intent** | ✅ ⚡ |
| **no "impact score"** | ✅ ⚡ |

---

## THREAD TYPE B — TEMPORAL KNOWLEDGE BRAIDS ⚡

### Purpose
Display how information **evolves over time**, WITHOUT imposing a narrative.

### Components ⚡
| Component | Description |
|-----------|-------------|
| timeline nodes (t1, t2, t3…) | ⚡ |
| XR replay snapshots | ⚡ |
| artifact versions | ⚡ |
| decision revision points | ⚡ |
| **silence intervals (non-action anchors)** | ⚡ |

### Visual Form ⚡
> **A "braid" of parallel threads converging or diverging. No peaks/valleys = no emotional implication.**

### Thread B JSON ⚡

```json
{
  "thread_B": {
    "id": "uuid",
    "timeline": [
      { "t": 0, "node": "uuid_start" },
      { "t": 12, "node": "uuid_artifact_v2" },
      { "t": 34, "node": "uuid_decision_rev1" }
    ],
    "braid_groups": [["uuid1", "uuid7"], ["uuid4"]],
    "replay_refs": ["rep_1", "rep_3"]
  }
}
```

### Key Field: `braid_groups` ⚡ (NOUVEAU!)
> **Groups of related nodes that braid together**

### Special Rule ⚡
> **Silence and action are equally represented. No weighting, no prioritization.**

---

## THREAD TYPE C — COLLECTIVE / PERSONAL KNOWLEDGE DIFF ⚡

### Purpose
Identify **gaps, overlaps, and mismatches** between collective memory graph and personal memory graph WITHOUT judgment.

### Diff Dimensions ⚡
| Dimension | Description |
|-----------|-------------|
| entries present in collective not present in personal | ⚡ |
| personal-only notes | ⚡ |
| replay fragments missing locally | ⚡ |
| cross-sphere mismatches | ⚡ |
| **forgotten / ignored artifacts** | ⚡ |

### Thread C Diff JSON ⚡

```json
{
  "thread_C_diff": {
    "user_id": "uuid",
    "collective_missing": ["event_3", "artifact_8"],
    "personal_missing": ["decision_12"],
    "overlaps": ["artifact_2", "event_5"],
    "explanation_hints": "neutral"
  }
}
```

### Visualization Colors ⚡ (NOUVEAU!)
| Color | Meaning |
|-------|---------|
| **green** | = shared ⚡ |
| **grey** | = collective-only ⚡ |
| **blue** | = personal-only ⚡ |
| **NEVER red** | → **no negativity** ⚡ |

---

## NEXT VIEW++ — ENHANCED THREADED KNOWLEDGE VIEWER ⚡ (NOUVEAU!)

### Purpose
Unified place where all threads (A/B/C) are visualized in: **2D mode, 3D orbit mode, XR immersive thread mode**

### RULE
> **VIEWER PRESENTS — USER INTERPRETS.**

### Components ⚡

| Component | Description |
|-----------|-------------|
| `THREAD_MAP` | displays nodes + thread lines, mode: flow / braid / diff ⚡ |
| `NODE_FOCUS_PANEL` | metadata, sphere, participants, artifacts ⚡ |
| `CROSS-SPHERE ORBIT` | **clusters threads by their sphere-flows** ⚡ |
| `XR THREAD ROOM` | spatial thread arcs, temporal braids as **floating ribbons**, diff zones as **layered planes** ⚡ |

### Interactions ⚡
| Function | Description |
|----------|-------------|
| `select_thread(id)` | ⚡ |
| `expand_context` | ⚡ |
| `toggle_layers (A/B/C)` | ⚡ |
| `enter_xr_view` | ⚡ |
| `export_pdf` | ⚡ |
| `compare_threads` | ⚡ |
| `link_back_to_universe_view` | ⚡ |

### Next View++ JSON Spec ⚡

```json
{
  "next_view": {
    "threads": ["thread_A", "thread_B", "thread_C"],
    "render_mode": "2d|3d|xr",
    "filters": {
      "sphere": "*",
      "time_range": "*",
      "thread_type": "*"
    },
    "user_profile": "navigation_profile_id"
  }
}
```

### Safety & Ethics ⚡
| Rule | Status |
|------|--------|
| **no ranking of threads** | ✅ ⚡ |
| **no prediction** | ✅ ⚡ |
| **no emotional inference** | ✅ ⚡ |
| **no story synthesis** | ✅ ⚡ |
| **clear labels: "This is a link, not a conclusion"** | ✅ ⚡ |
| **all rendering reversible / exportable** | ✅ ⚡ |

---

## WHY THIS PACK MATTERS ⚡

| Type | = |
|------|---|
| **Type A** | knowledge circulation ⚡ |
| **Type B** | knowledge evolution ⚡ |
| **Type C** | **knowledge discrepancy clarity** ⚡ |
| **Next View++** | **unified understanding, zero manipulation** ⚡ |

> **Together they form: THE KNOWLEDGE TREE BRANCHING SYSTEM OF CHE·NU.**

---

**END — KNOWLEDGE THREAD PACK + NEXT VIEW++**
