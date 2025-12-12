# CHE·NU — UI SPHERE INTERFACE
**VERSION:** UI.v1.0  
**MODE:** DOMAIN-SPECIFIC / CONSISTENT

---

## STRUCTURE COMMUNE ⚡

```
┌─────────────────────────────────────────┐
│ SPHERE: [Name]              [Exit] [○○○]│
├───────────┬─────────────────────────────┤
│  SIDEBAR  │       MAIN CONTENT          │
│  - Nodes  │   ┌─────────────────────┐   │
│  - Threads│   │    CONTENT AREA     │   │
│  - Filters│   │  (threads, docs)    │   │
│  - Agents │   └─────────────────────┘   │
├───────────┴─────────────────────────────┤
│ STATUS: [Update] [Users] [Sync]         │
└─────────────────────────────────────────┘
```

---

## VARIATIONS PAR SPHERE ⚡

| Sphere | Color | Default View |
|--------|-------|--------------|
| **Business** | `#2E5BBA` | Decisions |
| **Scholar** | `#6B4C9A` | Knowledge graph |
| **Creative** | `#E67E22` | Gallery |
| **XR** | `#1ABC9C` | 3D environment |

---

## SPHERE CONFIG ⚡

```json
{
  "sphere_interface": {
    "id": "business",
    "color_primary": "#2E5BBA",
    "layout": {
      "sidebar_width": 280,
      "header_height": 60
    },
    "default_view": "thread"
  }
}
```

---

## RÈGLES CONSISTENCY ⚡

| Règle | Status |
|-------|--------|
| **Same layout structure** | ✅ |
| **Same interactions** | ✅ |
| **Only colors differ** | ✅ |
| **No sphere superiority** | ✅ |

---

**END — UI SPHERE INTERFACE**
