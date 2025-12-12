# CHE·NU — UI COMPONENTS LIBRARY
**VERSION:** UI.v1.0  
**MODE:** REACT / TYPESCRIPT

---

## CATÉGORIES COMPOSANTS ⚡

### 1. CORE COMPONENTS ⚡
| Component | Props |
|-----------|-------|
| `<ThreadNode />` | `node, onClick, selected` |
| `<ThreadEdge />` | `from, to, type, strength` |
| `<SphereOrb />` | `sphere, size, active` |
| `<TimeMarker />` | `timestamp, label` |

### 2. LAYOUT COMPONENTS ⚡
| Component | Props |
|-----------|-------|
| `<UniverseCanvas />` | `children, zoom, pan` |
| `<SphereContainer />` | `sphere, children` |
| `<NavigationBar />` | `mode, onModeChange` |
| `<FilterSidebar />` | `filters, onChange` |

### 3. VISUALIZATION COMPONENTS ⚡
| Component | Props |
|-----------|-------|
| `<LinearView />` | `threads[], timeRange` |
| `<GraphView />` | `nodes[], edges[]` |
| `<OrbitalView />` | `spheres[], center` |
| `<ConstellationView />` | `clusters[]` |

### 4. XR COMPONENTS ⚡
| Component | Props |
|-----------|-------|
| `<XRCanvas />` | `scene, controllers` |
| `<XRNode />` | `position, scale` |
| `<XRHUD />` | `info, controls` |

---

## STRUCTURE FICHIERS ⚡

```
src/components/
├── core/
│   ├── ThreadNode.tsx
│   └── SphereOrb.tsx
├── layout/
│   ├── UniverseCanvas.tsx
│   └── NavigationBar.tsx
├── visualization/
│   ├── LinearView.tsx
│   └── GraphView.tsx
└── xr/
    └── XRCanvas.tsx
```

---

## RÈGLES COMPOSANTS ⚡

| Règle | Status |
|-------|--------|
| **Props typées** | ✅ |
| **Stateless preferred** | ✅ |
| **Accessible (ARIA)** | ✅ |

---

**END — UI COMPONENTS LIBRARY**
