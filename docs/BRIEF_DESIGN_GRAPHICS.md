# 🎨 CHE·NU V25 - BRIEF DESIGN & GRAPHICS

## 📋 MISE EN SITUATION

CHE·NU ("Chez Nous") est une plateforme de gestion de vie unifiée augmentée par l'IA. La structure technique (frontend React + backend FastAPI) est COMPLÈTE. Le prochain défi est de créer un **design system professionnel et cohérent**.

---

## 🎯 OBJECTIFS PRINCIPAUX

### 1. **Design System Complet**
Créer un système de design modulaire dans `/packages/ui/`

### 2. **4 Thèmes Visuels**
| Thème | Description | Ambiance |
|-------|-------------|----------|
| **Moderne** | Clean, minimaliste, tech | Défaut - professionnel |
| **Pierre** | Textures naturelles, warm | Artisanal, craft |
| **Jungle** | Verdoyant, organique | Nature, zen |
| **Médiéval** | Ornementé, royal | Gaming, fantasy |

### 3. **Couleurs par Espace**
Chaque espace a sa couleur d'accent:
- 🏠 Maison → Vert (#4ade80)
- 🏢 Entreprise → Bleu (#3b82f6)
- 📁 Projets → Violet (#8b5cf6)
- 🎨 Creative → Orange (#f59e0b)
- 🏛️ Gouvernement → Rouge (#ef4444)
- 🏘️ Immobilier → Cyan (#06b6d4)
- 🤝 Associations → Rose (#ec4899)

### 4. **Avatars - 6 Styles**
Système d'avatar builder avec morphing entre styles:
1. **Cartoon** - Friendly, accessible
2. **Réaliste** - Professional
3. **Pixel Art** - Retro gaming
4. **Anime** - Japanese style
5. **Low Poly** - Modern 3D
6. **Abstract** - Artistic

### 5. **Composants UI**
- Buttons (primary, secondary, ghost, danger)
- Cards (default, elevated, outlined)
- Inputs (text, select, checkbox, radio, toggle)
- Modals, Drawers, Tooltips
- Tables, Lists
- Navigation (tabs, breadcrumbs, pagination)
- Feedback (toast, alerts, progress)

---

## 🎨 PALETTE ACTUELLE (Dark Mode)

```css
:root {
  /* Backgrounds */
  --color-bg-main: #0a0d0b;
  --color-bg-card: #121614;
  --color-bg-hover: #1e2420;
  
  /* Borders */
  --color-border: #2a2a2a;
  
  /* Text */
  --color-text-primary: #e8e4dc;
  --color-text-secondary: #a8a29e;
  --color-text-muted: #6b6560;
  
  /* Accent */
  --color-accent: #4ade80;
}
```

### À CRÉER:
- **Light Mode** complet
- **Semantic colors** (success, warning, error, info)
- **Gradients** pour chaque thème
- **Shadows** et effets

---

## 📁 STRUCTURE À CRÉER

```
packages/ui/
├── src/
│   ├── tokens/
│   │   ├── colors.ts       ← Palettes complètes
│   │   ├── typography.ts   ← Fonts, sizes
│   │   ├── spacing.ts      ← 4px grid system
│   │   ├── shadows.ts      ← Elevations
│   │   └── animations.ts   ← Motion presets
│   │
│   ├── themes/
│   │   ├── moderne.ts
│   │   ├── pierre.ts
│   │   ├── jungle.ts
│   │   └── medieval.ts
│   │
│   ├── components/
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── Input/
│   │   ├── Modal/
│   │   ├── Avatar/
│   │   ├── Toast/
│   │   └── ...
│   │
│   └── index.ts
│
├── package.json
└── README.md
```

---

## 🖼️ ASSETS À CRÉER

### Icônes Custom
- Logo CHE·NU (variations)
- Icônes des 7 espaces
- Icône Nova AI
- Set d'icônes UI (32x32)

### Illustrations
- Empty states
- Onboarding
- Error pages (404, 500)

### Backgrounds
- Patterns pour chaque thème
- Gradients animés

---

## 📂 FICHIERS EXISTANTS

**Location:** `/home/claude/chenu-v25-final/`
**ZIP:** `/mnt/user-data/outputs/chenu-v25-final.zip`

**Avatars existants:**
- `apps/web/src/components/avatars/AvatarBuilder.tsx`
- `apps/web/src/components/avatars/AvatarGenerator.tsx`
- `apps/web/src/components/avatars/DirectorsAvatars.tsx`
- `apps/web/src/components/avatars/NovaAvatar3D.tsx`

**CSS existant:**
- `apps/web/src/styles/globals.css`

---

## ✅ LIVRABLES ATTENDUS

1. **Design Tokens** - Fichiers TypeScript avec toutes les variables
2. **4 Thèmes** - Fichiers de configuration complets
3. **Composants UI** - Au moins 10 composants de base
4. **Avatar System** - Upgrade du builder avec 6 styles
5. **Storybook** (optionnel) - Documentation visuelle
6. **Figma Export** (optionnel) - Pour designers

---

## 🚀 QUICK START

```bash
# Aller dans le projet
cd /home/claude/chenu-v25-final

# Ou dézipper
unzip /mnt/user-data/outputs/chenu-v25-final.zip

# Les fichiers UI sont dans
cd packages/ui/src/
```

---

## 💡 INSPIRATIONS

- **Vercel** - Clean, minimal
- **Linear** - Smooth animations
- **Notion** - Flexible theming
- **Discord** - Dark mode excellence
- **Figma** - Component architecture

---

*Préparé pour le prochain agent - Session Design & Graphics CHE·NU V25*
