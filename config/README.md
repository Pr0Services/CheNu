# CHE·NU Configuration Pack — Index
> Version: 1.0-canonical  
> All design system files for building CHE·NU interfaces

---

## 📁 Files in this Directory

| File | Purpose | Format |
|------|---------|--------|
| `CHENU_VISUAL_STYLE_PACK_v1.0.yaml` | Colors, typography, gradients, shadows, materials | YAML |
| `CHENU_XR_PACK_v1.0.yaml` | XR avatars, rooms, replay system, presence | YAML |
| `CHENU_INTERACTION_PACK_v1.0.md` | Gestures, shortcuts, navigation patterns | Markdown |
| `CHENU_UI_KIT_v1.0.yaml` | Figma components, layouts, prototypes | YAML |

---

## 🔗 How Files Connect

```
VISUAL_STYLE_PACK (foundation)
       │
       ├──► UI_KIT (uses colors, typography)
       │
       ├──► XR_PACK (uses materials, colors)
       │
       └──► INTERACTION_PACK (references UI components)
```

---

## 🎨 Quick Reference: Sphere Colors

| Sphere | Color | Hex |
|--------|-------|-----|
| Personal | 🟢 Teal | `#76E6C7` |
| Business | 🔵 Blue | `#5BA9FF` |
| Scholar | 🟡 Gold | `#E0C46B` |
| Creative | 🩷 Pink | `#FF8BAA` |
| Social | 🟢 Green | `#66D06F` |
| Institutions | 🟣 Purple | `#D08FFF` |
| Methodology | 🩵 Cyan | `#59D0C6` |
| XR | 💠 Light Blue | `#8EC8FF` |
| Entertainment | 🟠 Orange | `#FFB04D` |
| AI Lab | 🩷 Magenta | `#FF5FFF` |
| My Team | 🔵 Sky | `#5ED8FF` |

---

## 🖥️ Base Colors

```yaml
background: "#0A0B0D"  # Main dark background
surface: "#1A1C20"     # Cards, panels
elevated: "#22252B"    # Floating elements
stroke: "#2C2F33"      # Borders
```

---

## ⌨️ Essential Shortcuts

| Action | Shortcut |
|--------|----------|
| Command Palette | `Ctrl/⌘ + K` |
| Summon Nova | `Space` |
| New Item | `N` |
| Search | `Ctrl/⌘ + F` |
| Home | `H` |

---

## 📐 Grid System

| Platform | Columns | Margin | Gutter | Max Width |
|----------|---------|--------|--------|-----------|
| Desktop | 12 | 24px | 16px | 1440px |
| Tablet | 8 | 20px | 14px | - |
| Mobile | 4 | 16px | 12px | 480px |

---

## 🔧 Usage in Code

### React/TypeScript
```typescript
import { SPHERE_COLORS, TYPOGRAPHY } from '@chenu/config';

// Access sphere color
const businessColor = SPHERE_COLORS.business; // "#5BA9FF"
```

### CSS Variables
```css
:root {
  --chenu-bg: #0A0B0D;
  --chenu-surface: #1A1C20;
  --chenu-primary: #5BA9FF;
  --chenu-sphere-personal: #76E6C7;
}
```

### Figma
Import the UI Kit and use auto-layout components with proper naming:
- `C/Button/Primary`
- `C/Card/.sphere=business`
- `S/Sphere/Personal`

---

## 📋 Checklist for Designers

- [ ] Use only canonical sphere colors
- [ ] Apply consistent elevation shadows
- [ ] Follow spacing scale (4, 8, 12, 16, 24, 32, 48, 64)
- [ ] Use Inter font family
- [ ] Maintain corner radius consistency (6, 10, 16)
- [ ] Reference INTERACTION_PACK for gestures

---

## 📋 Checklist for Developers

- [ ] Import design tokens from config
- [ ] Use CSS variables for theming
- [ ] Implement sphere color switching
- [ ] Follow component naming conventions
- [ ] Support both 2D and XR interactions
- [ ] Respect accessibility guidelines

---

## 🔄 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2024-12 | Initial canonical release |

---

> **Note**: These files are the single source of truth for CHE·NU design.
> Always reference these configs before creating new UI elements.
