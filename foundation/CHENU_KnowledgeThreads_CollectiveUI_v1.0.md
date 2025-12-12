# CHE·NU — KNOWLEDGE THREADS SYSTEM + INTERFACE
**VERSION:** CORE.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE

---

## KNOWLEDGE THREADS — CORE DEFINITION

> **Knowledge Thread = A VERIFIABLE chain** of related information connecting events, artifacts, decisions, agents, and spheres — WITHOUT interpretation.

### RULE
> **Threads = STRUCTURE ONLY**  
> No conclusions. No persuasion. No narrative shaping.

---

## THREAD TYPE 1 — INTER-SPHERE THREADS

### Purpose
Connect information across spheres while preserving boundaries and domain integrity.

### Examples
- Business decision ↔ Scholar research
- Creative asset ↔ Social post
- XR replay ↔ Institutional log

### Properties
| Property | Value |
|----------|-------|
| cross-sphere edges | ✅ |
| domain color coding | ✅ |
| timestamp ordering | ✅ |
| read-only structure | ✅ |

### JSON Model

```json
{
  "inter_sphere_thread": {
    "id": "uuid",
    "nodes": ["artifact","event","decision"],
    "spheres": ["business","scholar","creative"],
    "origin": "source_id",
    "hash": "sha256"
  }
}
```

### Safety
- ❌ no sphere influences another
- ❌ no priority weighting
- ❌ no cross-domain authority

---

## THREAD TYPE 2 — PERSONAL MEMORY THREADS

### Purpose
Allow users to trace THEIR OWN past actions, meetings, notes, decisions and ideas visually.

### RULE
> **Personal = Private. Never exposed globally without explicit consent.**

### Properties
| Property | Value |
|----------|-------|
| user-only visibility | ✅ |
| chain of events & notes | ✅ |
| replay links preserved | ✅ |
| timeline-anchored | ✅ |

### JSON Model

```json
{
  "personal_thread": {
    "user_id": "uuid",
    "entries": [
      { "type": "note", "t": 171233, "ref": "id" },
      { "type": "meeting", "ref": "id" },
      { "type": "artifact", "ref": "id" }
    ]
  }
}
```

### Safety
- ✅ redaction mode
- ✅ encryption at rest
- ✅ delete-only rights (no rewrite)

---

## THREAD TYPE 3 — COLLECTIVE INTELLIGENCE THREADS ⚡ NEW

### Purpose
Map how the collective (team/org/community) approaches problems over time — **WITHOUT influence.**

### RULE
> **Collective = Emergent from events, NOT curated, NOT optimized.**

### Properties
| Property | Value |
|----------|-------|
| aggregated event flows | ✅ |
| anonymous unless user opts-in | ✅ |
| sphere-level patterns | ✅ |
| decision evolution maps | ✅ |

### JSON Model

```json
{
  "collective_thread": {
    "cluster_id": "uuid",
    "events": [],
    "patterns": [],
    "visibility": "team|org|public"
  }
}
```

### Unique Fields ⚡
| Field | Description |
|-------|-------------|
| `cluster_id` | Group identifier |
| `patterns` | Emergent patterns detected |
| `visibility` | team / org / public |

### Safety
- ❌ no ratings
- ❌ no performance scoring
- ❌ no competitive comparison
- ✅ only structure, never judgment

---

## THREAD INTERFACE (UI/UX)

### Purpose
Visualize threads as calm, navigable flows, 2D ↔ 3D ↔ XR compatible.

### UI LAYERS (5) ⚡

| Layer | Description |
|-------|-------------|
| 1. TIMELINE STRIP | Horizontal time axis |
| 2. NODE MAP | Graph visualization |
| 3. EVENT DETAILS PANEL | Expanded info |
| 4. SPHERE COLOR BANDS | Domain identification |
| 5. PRIVACY BADGES | Access indicators |

---

## THREAD VIEW MODES (4) ⚡

| Mode | Description |
|------|-------------|
| **MODE A — FLOW VIEW** | Horizontal timeline, nodes = events, lines = relations |
| **MODE B — ORBIT VIEW** | Sphere clusters around center, thread arcs connecting |
| **MODE C — THREAD STACK VIEW** | Compact vertical list, replay buttons, artifact previews |
| **MODE D — XR THREAD PATH** | Floating nodes, follow-the-line navigation, teleport to replay |

---

## INTERACTIONS

### ✅ Allowed
| Interaction | Description |
|-------------|-------------|
| `click_node` | Open details |
| `expand_thread` | Reveal hidden nodes |
| `isolate_sphere` | Focus domain |
| `show_replays` | Jump to XR |
| `annotate_personal` | Add private tags |
| `export_pdf_thread` | Export to PDF |

### ❌ Forbidden
| Interaction | Reason |
|-------------|--------|
| collapse user data into predictions | Manipulation |
| reorder events by "importance" | Bias |
| highlight "best path" | Influence |
| interpret user intention | Privacy |

---

## THREAD PANEL STRUCTURE (React) ⚡

```tsx
<ThreadViewer
   type="inter|personal|collective"
   threadId="uuid"
   mode="flow|orbit|stack|xr"
   onNodeSelect={() => {}}
   onOpenReplay={() => {}}
   onExportPDF={() => {}}
/>
```

### Props
| Prop | Type | Description |
|------|------|-------------|
| `type` | string | Thread type |
| `threadId` | uuid | Unique identifier |
| `mode` | string | View mode |
| `onNodeSelect` | callback | Node click handler |
| `onOpenReplay` | callback | Replay jump handler |
| `onExportPDF` | callback | Export handler |

---

## THREAD COLOR/VISUAL RULES ⚡

### Sphere Colors
| Sphere | Color |
|--------|-------|
| business | blue |
| scholar | gold |
| creative | magenta |
| social/media | teal |
| institutions | grey |
| methodology | green |
| xr/immersive | purple |

### Visual Properties ⚡
| Property | Meaning |
|----------|---------|
| **Opacity** | = confidence |
| **Thickness** | = event density |
| **Glow** | = XR replay available |

---

## THREAD SAFETY LOCKS ⚡

| Lock | Description |
|------|-------------|
| "Filtered View" indicator | Shows when filters active |
| Private nodes as ★ | Content hidden, exists indicator |
| No auto-expansion | User must explicitly expand |
| Explicit follow required | User controls navigation |
| Permanent audit trail | Thread creation logged |

---

## WHY KNOWLEDGE THREADS MATTER

They create:
- **clarity without manipulation**
- **structure without judgment**
- **memory without distortion**
- **navigation without influence**

---

**END — FOUNDATION FREEZE**
