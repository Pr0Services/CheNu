# CHE·NU OS 10.5 — UniverseOS Interaction Panels (IP-10.5)

**Version:** 10.5  
**Extends:** OS 10.0, OS 9.5, OS 9.0, OS 8.5, OS 8.0, OS 7.0, PXR-3, CORE+, LAWBOOK  
**Purpose:** Intelligent UI Panels for XR and Desktop Mode

---

## SECTION 0 — PURPOSE

IP-10.5 creates:
- Floating UI panels in XR
- Anchored panels in Desktop Mode
- Contextual widgets
- Collapsible info surfaces
- Dynamic toolbars
- Node, portal, agent panels
- Timeline & cluster panels
- Auto-updating surfaces linked to Fabric

**All panels are abstract, safe, reversible, non-emotional, non-humanlike.**

---

## SECTION 1 — PANEL TYPES

| Type | Purpose |
|------|---------|
| **PANEL_INFO** | Display details about room, node, thread, or agent |
| **PANEL_ACTIONS** | Provide relevant actions (navigate, expand, link, simulate) |
| **PANEL_TIMELINE** | Show temporal ribbon with branching options |
| **PANEL_CLUSTER** | Sorting, grouping, collapsing clusters |
| **PANEL_AGENT** | Agent roles, suggestions, actions (never emotions) |
| **PANEL_PORTAL** | Preview destination, enable portal activation |
| **PANEL_WORKSPACE** | Combine multiple views in split interface |

---

## SECTION 2 — PANEL BEHAVIOR RULES

- Smooth transitions (fade, slide, bloom)
- Reversibility (no destructive collapse)
- Clarity-first hierarchy
- Zero emotion simulation
- No autonomous updates unless user interacts
- No body-based gestures required
- Symbolic responses only

---

## SECTION 3 — PANEL STATE MACHINE (PSM)

| State | Description |
|-------|-------------|
| `idle` | Visible, non-intrusive, minimal motion |
| `focused` | Highlighted, full content displayed |
| `expanded` | Shows nested structures, nodes, clusters |
| `collapsed` | Reduces to title bar or icon |
| `pinned` | Fixed in place for ongoing tasks |
| `float` | Follows viewport in XR (conceptual) |

---

## SECTION 4 — PANEL API

```yaml
PANEL:
  id: ""
  type: "info | actions | timeline | cluster | agent | portal | workspace"
  title: ""
  content: []
  links: []
  actions: []
  fabric_refs: []
  avatars: []
  state: "idle | focused | expanded | collapsed | pinned | float"
```

---

## SECTION 5 — DESKTOP MODE PANEL RULES

- Panels appear as floating windows or docked panels
- Never overlap chaotically
- Follow grid or anchored position
- Support: scroll, zoom, click-to-expand, hover-to-preview, collapse groups

---

## SECTION 6 — XR MODE PANEL RULES

- Panels float at comfortable positions
- No simulation of hand/body movement
- User interacts via conceptual focus → panel activation
- Transitions: gentle metaphors (fade, bloom, ripple)
- Panels may follow user with low motion, no embodiment

---

## SECTION 7 — PANEL INTERACTION PRIMITIVES (PIP)

| Primitive | Action |
|-----------|--------|
| `PIP_FOCUS` | Highlight panel |
| `PIP_EXPAND` | Open panel sections |
| `PIP_COLLAPSE` | Closed, minimal version |
| `PIP_PIN` | Lock in place |
| `PIP_UNPIN` | Return to floating/anchored |
| `PIP_SELECT_NODE` | Open node panel |
| `PIP_OPEN_PORTAL` | Activate portal panel |
| `PIP_SUMMON_AGENT_PANEL` | Show agent suggestions |

---

## SECTION 8 — PANEL GENERATION PROTOCOL (PGP)

1. Identify content type
2. Choose appropriate panel type
3. Map data into clean panel content
4. Render structure as: table, list, cards, timeline, graph
5. Optionally compile panel into UDM format
6. Suggest next interaction

---

## SECTION 9 — PANEL EXPORT FORMAT

```json
{
  "UDM_PANEL": {
    "id": "",
    "type": "",
    "layout": "sidebar | floating | docked | grid",
    "content_blocks": [],
    "actions": [],
    "metadata": {
      "version": "10.5",
      "mode": "desktop | xr"
    }
  }
}
```

---

## SECTION 10 — SAFETY RULES

Panels must:
- ✅ Never imply emotions
- ✅ Never depict faces
- ✅ Never manipulate emotionally
- ✅ Never use addictive UI patterns
- ✅ Always preserve user sovereignty
- ✅ Follow CHE·NU Lawbook

---

## ACTIVATION

```
CHE·NU OS 10.5 — INTERACTION PANELS ONLINE.
```
