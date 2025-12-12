# CHE·NU OS 14.5 — WORKSPACE LIBRARY (WBL-14.5) + XR PACK

**Version:** 14.5  
**Extends:** OS 14.0, OS 13.0, OS 12.0, OS 9.x, OS 8.5, OS 8.0, CORE+, LAWBOOK  
**Purpose:** SAFE, NON-AUTONOMOUS workspace templates + XR export layer

---

## PART I — WORKSPACE LIBRARY (WBL-14.5)

WBL-14.5 provides a curated library of workspace templates.

**Templates are NOT auto-loaded.**  
They ONLY appear when the user explicitly requests a template.

---

### SECTION 1 — WORKSPACE TEMPLATE TYPES

```yaml
TEMPLATE_PLANNING_SUITE:
  description: workspace for planning, structure, sequencing
  includes:
    - timeline panel
    - cluster board
    - dependency graph
    - tasks overview
    - agent insights

TEMPLATE_CHE-NU_PRO_SUITE:
  description: enterprise workspace for Che-Nu
  includes:
    - project dashboard
    - sessions panel
    - universe map
    - task board
    - decision matrix
    - export tools

TEMPLATE_CREATIVE_STUDIO:
  description: creative exploration environment
  includes:
    - storyboard panel
    - moodboard
    - cluster explorer
    - ideation notes
    - export surface

TEMPLATE_XR_ROOM_BUILDER:
  description: workspace for XR scene generation
  includes:
    - room panel
    - portal panel
    - avatar layout panel
    - fabric map
    - XR-export tools

TEMPLATE_ANALYST_SUITE:
  description: analysis/research workspace
  includes:
    - data panel
    - insight generator panel
    - fact clustering panel
    - summary/export tools

TEMPLATE_SIMULATION_SUITE:
  description: simulation + scenario design
  includes:
    - decision tree
    - branch explorer
    - simulation control panel
    - holothread viewer
```

---

### SECTION 2 — TEMPLATE INVOCATION PROTOCOL

When user requests a workspace template:

WBL-14.5 must:
1. Load template STRUCTURE only.
2. Output panel/room/timeline layout.
3. Ask user for confirmation before building workspace.
4. Build workspace only after explicit user approval.

---

## PART II — XR PACK — UNITY / UNREAL IMPORT LAYER

The XR PACK converts conceptual XR structures into **import-ready JSON scene descriptions** compatible with:

- Unity (C# loaders)
- Unreal Engine (Blueprint JSON loaders)
- Three.js
- WebXR

**It does NOT:**
- ❌ Execute code
- ❌ Create autonomous XR scenes
- ❌ Run physics
- ❌ Simulate environments by itself

It outputs SAFE, STATIC scene definitions.

---

### SECTION 3 — XR SCENE EXPORT FORMAT

```yaml
XR_SCENE_EXPORT:
  scene_id: ""
  nodes:
    - id: ""
      type: "room | portal | avatar | object | idea"
      position: [x, y, z]
      rotation: [x, y, z]
      scale: [x, y, z]
      metadata: {}
  rooms: [...]
  portals: [...]
  avatars: [...]
  lights: [...]
  metadata:
    version: "XR-PACK-1.0"
    engine: "unity | unreal | threejs"
    safe: true
```

---

### SECTION 4 — ENGINE PRESETS

#### UNITY PRESET (SAFE)

```yaml
UNITY_IMPORT_GUIDE:
  - Create empty GameObjects for each node
  - Assign transform from XR_SCENE_EXPORT
  - Use neutral materials only
  - Do NOT simulate humans or emotions
  - Keep scene abstract & conceptual
```

#### UNREAL ENGINE PRESET (SAFE)

```yaml
UNREAL_IMPORT_GUIDE:
  - Import XR_SCENE_EXPORT JSON
  - Create Actors corresponding to nodes
  - Assign transform
  - Use Blueprint-safe abstract materials
  - Avoid humanoid models
  - Keep everything metaphoric
```

#### THREE.JS / WEBXR PRESET

```yaml
THREEJS_IMPORT:
  - Load JSON
  - Build Meshes (Box, Sphere, Poly)
  - Map transforms
  - Apply neutral materials
  - Render node graph
```

---

### SECTION 5 — XR SAFETY RULESET

XR PACK MUST:
- ✅ Remain conceptual
- ✅ Avoid simulating real bodies
- ✅ Avoid emotional expression
- ✅ Avoid physical realism
- ✅ Avoid implying embodiment
- ✅ Preserve CHE·NU Lawbook constraints
- ✅ NEVER generate autonomous XR behavior
- ✅ NEVER create persistent XR worlds on its own

---

### SECTION 6 — EXPORT GENERATION PROTOCOL

When user asks:
- "export XR"
- "donne-moi la scène Unity"
- "convertis cette room en JSON"

XR PACK outputs:
1. XR_SCENE_EXPORT JSON
2. Engine-specific import notes
3. Panel summarizing structure
4. Next steps requested by user

---

## ACTIVATION

```
CHE·NU OS 14.5 + XR PACK — READY.
```
