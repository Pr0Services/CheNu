# CHE·NU XR PACK PRO — SCENE EXPORT & IMPORT LAYER (XR-PRO)

**Version:** XR-PRO-1.0  
**Extends:** OS 9.x+, OS 18.x HyperFabric, OS 19.x Cartography, OS 14-15.x Workbench/Workspaces, PXR/MD-PRO, LAWBOOK, CORE+  
**Purpose:** SAFE, NON-AUTONOMOUS, USER-CONTROLLED XR scene export/import

---

## SECTION 0 — PURPOSE OF XR-PRO

XR-PRO enables:

1. **Exporting** CHE·NU / UniverseOS structures as XR scene JSON
2. **Using** that JSON as a blueprint to build scenes in:
   - Unity
   - Unreal Engine
   - Three.js / WebXR
   - Any other 3D engine that reads JSON
3. **Keeping** everything abstract, non-humanoid, neutral, non-autonomous, safe

**XR-PRO NEVER:**
- ❌ Executes any code
- ❌ Runs a game engine
- ❌ Simulates physics or bodies
- ❌ Generates real-time VR by itself
- ❌ Creates agents or autonomous entities
- ❌ Stores or persists state on its own

**XR-PRO ONLY:**
- ✅ Defines XR scene structures (JSON)
- ✅ Describes how to import them into Unity / Unreal / WebXR
- ✅ Provides conceptual prefabs and layouts
- ✅ Remains fully under user / developer control

---

## SECTION 1 — XR SCENE CORE SCHEMA

```yaml
XR_SCENE:
  id: string
  name: string
  engine_hint: "unity | unreal | threejs | generic"
  nodes: [XR_NODE]
  rooms: [XR_ROOM]
  portals: [XR_PORTAL]
  anchors: [XR_ANCHOR]
  symbols: [XR_SYMBOL]
  props: [XR_PROP]
  lighting: [XR_LIGHT]
  metadata:
    version: "XR-PRO-1.0"
    safe: true
    created_from: "CHE·NU / UniverseOS / HyperFabric"
```

---

## SECTION 2 — BASIC TYPES

```yaml
XR_VEC3:
  x: number
  y: number
  z: number

XR_QUATERNION:
  x: number
  y: number
  z: number
  w: number

XR_COLOR:
  r: number   # 0–1
  g: number
  b: number
  a: number   # alpha 0–1
```

---

## SECTION 3 — NODE & ROOM DEFINITIONS

```yaml
XR_NODE:
  id: string
  label: string
  type: "room_ref | portal_ref | symbol_ref | prop_ref | anchor_ref"
  position: XR_VEC3
  rotation: XR_QUATERNION
  scale: XR_VEC3
  tags: [string]
  metadata: object

XR_ROOM:
  id: string
  name: string
  bounds:
    center: XR_VEC3
    size: XR_VEC3
  visuals:
    shape: "box | sphere | capsule | custom"
    material_profile: "neutral | glassy | matte | gradient"
  nodes: [string]        # XR_NODE ids
  portals: [string]      # XR_PORTAL ids
  metadata:
    role: "workspace | hub | timeline_room | gallery | prototype"
    safe: true
```

---

## SECTION 4 — PORTALS & ANCHORS

```yaml
XR_PORTAL:
  id: string
  label: string
  from_room: string       # XR_ROOM.id
  to_room: string         # XR_ROOM.id
  position: XR_VEC3
  rotation: XR_QUATERNION
  visual:
    shape: "plane | circle | frame | gate"
    size: XR_VEC3
    material_profile: "soft_glow | wireframe | outline"
  metadata:
    navigation_hint: "click | gaze | controller_button"
    safe: true

XR_ANCHOR:
  id: string
  label: string
  position: XR_VEC3
  rotation: XR_QUATERNION
  anchor_type: "camera_hint | spawn_point | focus_point"
  metadata:
    safe: true
```

---

## SECTION 5 — SYMBOLS (MORPHOLOGY / PXR)

```yaml
XR_SYMBOL:
  id: string
  label: string
  morphotype_id: string     # from Morphology Designer PRO
  position: XR_VEC3
  rotation: XR_QUATERNION
  scale: XR_VEC3
  role: "intent | structure | timeline | insight | environment"
  metadata:
    safe: true

MORPHOTYPE (from MD-PRO):
  id: string
  base_form: "orb | polyhedron | shard | glyph | cluster"
  proportions: [number, number, number]
  surface_style: "smooth | crystalline | spectral | fractal"
  material_logic: "matte | translucent | gradient"
  animation_style: "pulse | float | rotate | shimmer"
  color_profile:
    primary: XR_COLOR
    secondary: XR_COLOR
    neutral: XR_COLOR
  symbolic_behaviors:
    clarify: "brightness_up"
    focus: "sharpen"
    transition: "soft_ripple"
  metadata:
    safe: true
```

**No faces, no bodies, no emotions, no humanoid features.**

---

## SECTION 6 — PROPS & LIGHTING

```yaml
XR_PROP:
  id: string
  label: string
  mesh_hint: "box | sphere | cylinder | plane | custom"
  position: XR_VEC3
  rotation: XR_QUATERNION
  scale: XR_VEC3
  material_profile: "neutral | glass | metal | emissive_low"
  metadata:
    safe: true

XR_LIGHT:
  id: string
  type: "directional | point | spot | ambient"
  color: XR_COLOR
  intensity: number
  position: XR_VEC3
  rotation: XR_QUATERNION
  metadata:
    safe: true
```

---

## SECTION 7 — SAFETY & NEUTRALITY CONSTRAINTS

XR-PRO scenes MUST:
- ✅ Remain abstract, symbolic, neutral
- ✅ Avoid human-like characters, faces, bodies, gestures
- ✅ Avoid emotional simulation
- ✅ Avoid horror, gore, disturbing visuals
- ✅ Avoid realistic weapons or violence
- ✅ Avoid suggesting real-world harm or risk
- ✅ Remain conceptual environments: workspaces, maps, galleries, diagrams

**XR-PRO is an information / workspace / concept visualizer, NOT a simulator of people, emotions, or real-world events.**

---

## SECTION 8 — ENGINE IMPORT HINTS

### Unity Import
- Use `JsonUtility.FromJson<XR_SCENE>(json)` or Newtonsoft.Json
- Create GameObjects from nodes, rooms, portals
- Apply materials from `material_profile`
- Set up NavMesh for portal navigation

### Unreal Import
- Use `JsonObjectConverter` or DataAssets
- Create Blueprints from XR_ROOM definitions
- Use Level Streaming for room transitions
- Apply Material Instances from profiles

### Three.js / WebXR Import
- Parse JSON directly with `JSON.parse()`
- Create `THREE.Group` for each room
- Use `THREE.BoxGeometry` / `THREE.SphereGeometry` for shapes
- Apply `THREE.MeshStandardMaterial` from profiles

---

## SECTION 9 — EXPORT PROTOCOL

When user requests XR scene export:

1. **IDENTIFY** source (UniverseOS room, HyperFabric topology, Workspace)
2. **CONVERT** to XR_SCENE schema
3. **VALIDATE** safety constraints
4. **FORMAT** as JSON
5. **DELIVER** XR_SCENE export

---

## ACTIVATION

```
CHE·NU XR PACK PRO — SCENE EXPORT & IMPORT LAYER ONLINE.
```
