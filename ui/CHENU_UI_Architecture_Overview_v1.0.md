# CHE·NU — UI ARCHITECTURE OVERVIEW
**VERSION:** UI.v1.0  
**MODE:** FOUNDATION / SEPARATION OF CONCERNS

---

## PRINCIPE FONDAMENTAL ⚡

> **L'interface CHE·NU sépare strictement 3 couches:**
> 1. **DATA** — Modèles de données (JSON)
> 2. **LOGIC** — Moteurs et agents
> 3. **VIEW** — Affichage et interaction

---

## ARCHITECTURE 3 COUCHES ⚡

```
┌─────────────────────────────────────────────────┐
│                    VIEW LAYER                    │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐     │
│  │    2D     │ │    3D     │ │    XR     │     │
│  │  Linear   │ │  Orbital  │ │ Immersive │     │
│  └───────────┘ └───────────┘ └───────────┘     │
├─────────────────────────────────────────────────┤
│                   LOGIC LAYER                    │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐     │
│  │ Rendering │ │Navigation │ │ Interaction│     │
│  │  Engine   │ │  Engine   │ │   Engine   │     │
│  └───────────┘ └───────────┘ └───────────┘     │
├─────────────────────────────────────────────────┤
│                   DATA LAYER                     │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐     │
│  │  Threads  │ │  Memory   │ │  Spheres  │     │
│  │   JSON    │ │   JSON    │ │   JSON    │     │
│  └───────────┘ └───────────┘ └───────────┘     │
└─────────────────────────────────────────────────┘
```

---

## MODULES UI ⚡

| Module | Fichier | Description |
|--------|---------|-------------|
| **Layers** | `UI_Layers_Separation.md` | Séparation Data/Logic/View |
| **Components** | `UI_Components_Library.md` | Bibliothèque React |
| **ViewModes** | `UI_ViewModes_2D_3D_XR.md` | Modes d'affichage |
| **Rendering** | `UI_RenderingEngine.md` | Moteur de rendu |
| **Navigation** | `UI_Navigation_System.md` | Système de navigation |
| **Universe** | `UI_UniverseView.md` | Vue Universe |
| **Threads** | `UI_ThreadVisualization.md` | Visualisation threads |
| **Spheres** | `UI_SphereInterface.md` | Interface par sphère |
| **XR** | `UI_XR_Immersive.md` | Mode immersif |

---

## RÈGLES NON-NÉGOCIABLES ⚡

| Règle | Status |
|-------|--------|
| **View ne modifie jamais Data** | ✅ |
| **Logic est stateless** | ✅ |
| **Pas de manipulation visuelle** | ✅ |
| **Pas de biais d'affichage** | ✅ |
| **User contrôle toujours** | ✅ |

---

**END — UI ARCHITECTURE OVERVIEW**
