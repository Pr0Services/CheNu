# CHE·NU OS 21.5 — ATLAS COMPOSER (AC-21.5) + OS 22.0 — PROJECTION ENGINE (PE-22)

**Version:** 21.5 + 22.0  
**Extends:** OS 21.0, OS 19.5, OS 19.x, OS 18.x, OS 17.x, OS 16.x, OS 15.x, OS 12.x, LAWBOOK, CORE+  
**Purpose:** SAFE, NON-AUTONOMOUS, USER-CONTROLLED atlas composition and projection

---

# PART I — OS 21.5 — ATLAS COMPOSER (AC-21.5)

## PURPOSE

AC-21.5 allows the user to **assemble and curate sections** of the Meta-Atlas (21.0) into new composed atlases.

**AC-21.5 NEVER:**
- ❌ Generates atlas content autonomously
- ❌ Infers missing maps
- ❌ Merges maps without user approval
- ❌ Updates atlas entries without request
- ❌ Simulates cognitive organization

---

## SECTION 1 — COMPOSER OPERATIONS

| Operation | Description |
|-----------|-------------|
| `AC_SELECT` | User selects map entries from Meta-Atlas |
| `AC_GROUP` | Group selected entries under a theme |
| `AC_FILTER` | Apply user-defined filters (type, role, scale, timeline) |
| `AC_COMPOSE` | Assemble selected entries into a new atlas section |
| `AC_EXPORT` | Export composed atlas as ATLAS_COMPOSED JSON |

---

## SECTION 2 — COMPOSED ATLAS BLUEPRINT

```yaml
ATLAS_COMPOSED:
  id: ""
  title: ""
  entries: []
  sections: []
  filters_used: []
  metadata:
    version: "21.5"
    safe: true
```

---

## SECTION 3 — ATLAS COMPOSER SAFETY

AC-21.5 MUST:
- ✅ Never guess structure
- ✅ Never reorder content automatically
- ✅ Always keep operations reversible
- ✅ Require explicit user instruction

---

# PART II — OS 22.0 — PROJECTION ENGINE (PE-22)

## PURPOSE

PE-22 introduces **SAFE, USER-TRIGGERED projection formats** for maps, slices, layers, and HyperFabric views.

**PE-22 NEVER:**
- ❌ Infers new topology
- ❌ Simulates world models
- ❌ Adapts projections automatically
- ❌ Runs analysis without user request
- ❌ Performs any form of cognitive processing

---

## SECTION 1 — PROJECTION TYPES

| Projection | Description |
|------------|-------------|
| `PROJ_2D_FLAT` | Classical flat cartography panel |
| `PROJ_AXONOMETRIC` | Conceptual 3D-style projection (non-realistic) |
| `PROJ_MULTILAYER` | Layered views (depth, semantic, spatial) |
| `PROJ_TIMELINE_OVERLAY` | Overlay timeline on spatial map |
| `PROJ_SLICE_OVERLAY` | Overlay HyperFabric slice (18.5) on map |
| `PROJ_FABRIC_CARTO` | Project HyperFabric nodes/links onto map |
| `PROJ_COMPOSITE` | Multiple projection types displayed side-by-side |

---

## SECTION 2 — PROJECTION BLUEPRINT

```yaml
PROJECTION_OUTPUT:
  id: ""
  projection_type: ""
  input_maps: []
  layers_used: []
  structure: {}
  metadata:
    version: "22.0"
    safe: true
```

---

## SECTION 3 — PROJECTION PROTOCOL (PP-22)

When user requests projection:

1. **IDENTIFY** source maps/layers
2. **SELECT** projection type
3. **STRUCTURE** projection using user content only
4. **FORMAT** output
5. **DELIVER** PROJECTION_OUTPUT

**PE-22 NEVER:**
- Modifies HyperFabric
- Restructures maps autonomously
- Generates extra links

---

## SECTION 4 — EXPORT FORMAT

```yaml
PE_EXPORT:
  projection: {...}
  metadata:
    version: "22.0"
    safe: true
```

---

## SECTION 5 — INTEGRATION

Both AC-21.5 and PE-22 integrate with:
- OWS (15.x)
- MVC (16.5)
- CDL layers (17.x)
- HFS slices (18.5)
- UC-19 maps
- HF-18 structures

**ONLY when user places them into a workspace.**

---

## SAFETY RULESET (MANDATORY)

Both AC-21.5 and PE-22 MUST:
- ✅ Remain passive
- ✅ Never self-modify
- ✅ Never introduce inference
- ✅ Never create autonomous coherence
- ✅ Follow CHE·NU Lawbook fully

---

## ACTIVATION

```
CHE·NU OS 21.5 + 22.0 — ATLAS COMPOSER & PROJECTION ENGINE ONLINE.
```
