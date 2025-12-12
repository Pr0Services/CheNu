# CHE·NU — UI LAYERS SEPARATION
**VERSION:** UI.v1.0  
**MODE:** STRICT SEPARATION OF CONCERNS

---

## 3 COUCHES STRICTES ⚡

| Layer | Responsabilité | Accès |
|-------|---------------|-------|
| **DATA** | Stockage JSON, validation, hash | Read-only depuis Logic |
| **LOGIC** | Transformation, filtrage, routing | Stateless |
| **VIEW** | Rendering, interaction, animation | Read-only depuis Logic |

---

## LAYER 1 — DATA LAYER ⚡

### Sources de Données ⚡
| Source | Format |
|--------|--------|
| `knowledge_threads.json` | Thread nodes + edges |
| `collective_memory.json` | Memory entries |
| `personal_navigation.json` | User preferences |
| `sphere_states.json` | Sphere configs |

### Règles Data ⚡
| Règle | Status |
|-------|--------|
| **Immutable** | ✅ |
| **Hash-verified** | ✅ |
| **No UI logic** | ✅ |

---

## LAYER 2 — LOGIC LAYER ⚡

### Engines ⚡
| Engine | Role |
|--------|------|
| `RENDERING_ENGINE` | Data → Visual |
| `NAVIGATION_ENGINE` | User movement |
| `FILTER_ENGINE` | Apply filters |
| `SYNC_ENGINE` | Real-time |

### View State JSON ⚡
```json
{
  "view_state": {
    "mode": "2d|3d|xr",
    "filters": { "spheres": [], "types": [] },
    "density": "minimal|normal|dense",
    "focus_node": "uuid|null"
  }
}
```

---

## LAYER 3 — VIEW LAYER ⚡

### Components ⚡
| Component | Role |
|-----------|------|
| `ThreadRenderer` | Render threads |
| `SphereRenderer` | Render spheres |
| `NavigationControls` | User controls |

### Règles View ⚡
| Règle | Status |
|-------|--------|
| **Read-only** | ✅ |
| **No data mutation** | ✅ |
| **Pure presentation** | ✅ |

---

## FLUX DE DONNÉES ⚡

```
USER → VIEW → LOGIC → DATA → LOGIC → VIEW → USER
```

---

**END — UI LAYERS SEPARATION**
