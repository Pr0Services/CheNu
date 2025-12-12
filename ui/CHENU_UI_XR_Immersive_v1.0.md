# CHE·NU — UI XR IMMERSIVE
**VERSION:** UI.v1.0  
**MODE:** SPATIAL / ACCESSIBLE / NON-MANIPULATIVE

---

## PURPOSE ⚡

> **L'interface XR permet une navigation SPATIALE des données tout en respectant l'autonomie de l'utilisateur.**

---

## MODES XR ⚡

| Mode | Description | Hardware |
|------|-------------|----------|
| **VR Full** | Environnement complet | VR Headset |
| **AR Overlay** | Superposition réalité | AR Glasses / Phone |
| **Desktop 3D** | Vue 3D sans casque | Screen + Mouse |
| **Mobile 3D** | Vue 3D tactile | Phone / Tablet |

---

## ENVIRONNEMENT XR ⚡

```
┌─────────────────────────────────────────────────────────┐
│                    XR SPACE                              │
│                                                          │
│    ┌─────┐         ┌─────┐         ┌─────┐             │
│    │ ORB │         │ ORB │         │ ORB │             │
│    │Busns│─────────│Schlr│─────────│Crtve│             │
│    └─────┘         └─────┘         └─────┘             │
│         \             │             /                   │
│          \            │            /                    │
│           ╲           │           ╱                     │
│            ╲    ┌─────┴─────┐    ╱                     │
│             ╲   │  USER     │   ╱                      │
│              ╲──│  AVATAR   │──╱                       │
│                 │    ◉      │                          │
│                 └───────────┘                          │
│                                                          │
│    ┌──────────────────────────────┐                     │
│    │       CONTROL PANEL          │                     │
│    │  [Nav] [Filter] [Tools] [Exit]│                     │
│    └──────────────────────────────┘                     │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## ÉLÉMENTS XR ⚡

### 1. SPHERE ORBS ⚡
| Propriété | Valeur |
|-----------|--------|
| **Shape** | 3D Sphere |
| **Size** | ÉGAL pour toutes |
| **Distance** | User chooses |
| **Interaction** | Point + Select |

### 2. THREAD PATHS ⚡
| Propriété | Valeur |
|-----------|--------|
| **Style** | 3D ribbon/tube |
| **Color** | By type |
| **Walkable** | User can "walk" along |
| **Nodes** | Floating markers |

### 3. USER AVATAR ⚡
| Propriété | Valeur |
|-----------|--------|
| **Position** | User controlled |
| **View** | First person or third |
| **Tools** | Held in virtual hands |

### 4. CONTROL PANEL ⚡
| Propriété | Valeur |
|-----------|--------|
| **Position** | Follows user (settable) |
| **Opacity** | Adjustable |
| **Size** | User preference |

---

## XR INTERACTIONS ⚡

### Hand/Controller Actions ⚡
| Action | Result |
|--------|--------|
| **Point at orb** | Highlight + info |
| **Trigger/Click** | Select |
| **Grab** | Move object (if allowed) |
| **Two-hand stretch** | Zoom |
| **Thumbstick** | Teleport/Move |

### Voice Commands ⚡
| Command | Action |
|---------|--------|
| "Go to [sphere]" | Navigate to sphere |
| "Show threads" | Display thread view |
| "Hide UI" | Toggle HUD |
| "Exit" | Return to 2D |
| "Help" | Show commands |

### Gaze Interactions ⚡
| Duration | Action |
|----------|--------|
| **0.5s** | Hover highlight |
| **2s** | Auto-select (accessibility) |
| **Look away** | Deselect |

---

## XR HUD (Heads-Up Display) ⚡

```
┌─────────────────────────────────────┐
│ TOP: Breadcrumb navigation          │
│      Universe > Business > Thread   │
├─────────────────────────────────────┤
│                                     │
│         (Main 3D View)              │
│                                     │
├─────────────────────────────────────┤
│ BOTTOM: Quick actions               │
│ [←Back] [Home] [Filter] [Menu]      │
└─────────────────────────────────────┘
```

### HUD Config JSON ⚡
```json
{
  "xr_hud": {
    "visible": true,
    "opacity": 0.8,
    "position": "follow|fixed",
    "size": "small|medium|large",
    "elements": {
      "breadcrumb": true,
      "quick_actions": true,
      "status": true,
      "compass": false
    }
  }
}
```

---

## COMFORT & ACCESSIBILITY ⚡

### Comfort Settings ⚡
| Setting | Options |
|---------|---------|
| **Movement** | Teleport / Smooth / Snap |
| **Rotation** | Snap 45° / Smooth |
| **Vignette** | On motion / Off |
| **Seated mode** | Adjusted height |

### Accessibility ⚡
| Feature | Description |
|---------|-------------|
| **Voice control** | Full navigation |
| **Gaze select** | No hands needed |
| **High contrast** | Optional mode |
| **Subtitles** | For audio content |
| **Magnification** | Zoom UI elements |

---

## XR CONFIG JSON ⚡

```json
{
  "xr_config": {
    "mode": "vr|ar|desktop3d|mobile3d",
    "comfort": {
      "movement": "teleport",
      "rotation": "snap",
      "vignette": true
    },
    "accessibility": {
      "voice_enabled": true,
      "gaze_select": true,
      "high_contrast": false
    },
    "hud": { "...": "..." },
    "environment": {
      "skybox": "neutral",
      "lighting": "soft",
      "grid_floor": true
    }
  }
}
```

---

## RÈGLES NON-MANIPULATIVE XR ⚡

| Règle | Status |
|-------|--------|
| **No forced gaze** | ✅ User looks where they want |
| **No jump scares** | ✅ Gentle transitions |
| **No urgency cues** | ✅ No flashing/pulsing |
| **Equal orb sizes** | ✅ No hierarchy |
| **User pace** | ✅ No auto-movement |
| **Exit always visible** | ✅ Can leave anytime |

---

**END — UI XR IMMERSIVE**
