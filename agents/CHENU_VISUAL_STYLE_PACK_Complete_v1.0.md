# CHE·NU — VISUAL STYLE PACK COMPLETE
**VERSION:** VISUAL.v1.0-canonical  
**MODE:** FOUNDATION / DESIGN SYSTEM / UNIVERSAL

---

## 1) CORE AESTHETIC PRINCIPLES ⚡

### 1.1 Design Philosophy

```
┌─────────────────────────────────────────────────────────────────┐
│                  CHE·NU VISUAL PHILOSOPHY                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              CLARITY OVER DECORATION                     │    │
│  │    Minimalism with depth • Soft edges everywhere        │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐       │
│  │  LUMINOSITY   │  │   SPHERES     │  │   GRADIENTS   │       │
│  │  = state      │  │  = identity   │  │  = transition │       │
│  └───────────────┘  └───────────────┘  └───────────────┘       │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  BLACK NEUTRAL SPACE • FUNCTIONAL GLOW (not gaming)     │    │
│  │  PHYSICS-AWARE UI in XR • UI = calm, XR = presence      │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Principles List

| # | Principle | Description |
|---|-----------|-------------|
| 1 | **Clarity Over Decoration** | Function drives form |
| 2 | **Luminosity as State** | Light indicates status |
| 3 | **Spheres as Color-Identity** | Each sphere has signature color |
| 4 | **Gradients for Transition** | Smooth, not flashy |
| 5 | **Minimalism with Depth** | Simple surface, rich layers |
| 6 | **Black Neutral Space** | Dark environment base |
| 7 | **Soft Edges Everywhere** | No harsh corners |
| 8 | **Functional Glow** | Purpose-driven, not decorative |
| 9 | **Physics-Aware UI** | XR respects occlusion/parallax |
| 10 | **Calm UI, Present XR** | Never overwhelming |

---

## 2) COLOR PALETTE (CANONICAL) ⚡

### 2.1 Base Colors

```css
/* BASE PALETTE */
:root {
  /* Neutrals */
  --chenu-black: #0A0B0D;
  --chenu-dark-gray: #1A1C20;
  --chenu-medium-gray: #2C2F33;
  --chenu-light-gray: #C8C8C8;
  --chenu-white: #FFFFFF;
  
  /* Semantic */
  --chenu-info: #5BA9FF;
  --chenu-success: #6FE8A3;
  --chenu-warning: #FFBE55;
  --chenu-error: #FF5A5A;
}
```

### 2.2 Sphere Colors (Official)

```css
/* SPHERE PALETTE - CANONICAL */
:root {
  --sphere-personal: #76E6C7;      /* Turquoise */
  --sphere-business: #5BA9FF;      /* Blue */
  --sphere-scholar: #E0C46B;       /* Gold */
  --sphere-creative: #FF8BAA;      /* Pink */
  --sphere-social: #66D06F;        /* Green */
  --sphere-institutions: #D08FFF;  /* Purple */
  --sphere-methodology: #59D0C6;   /* Teal */
  --sphere-xr: #8EC8FF;            /* Light Blue */
  --sphere-entertainment: #FFB04D; /* Orange */
  --sphere-ai-lab: #FF5FFF;        /* Magenta */
  --sphere-my-team: #5ED8FF;       /* Cyan */
}
```

### 2.3 Visual Reference

```
┌─────────────────────────────────────────────────────────────────┐
│                    SPHERE COLOR WHEEL                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│                        ⬤ SCHOLAR                                │
│                       #E0C46B                                    │
│                                                                  │
│      ⬤ CREATIVE                     ⬤ BUSINESS                  │
│      #FF8BAA                        #5BA9FF                      │
│                                                                  │
│  ⬤ ENTERTAINMENT      ●         ⬤ METHODOLOGY                   │
│  #FFB04D              CORE         #59D0C6                       │
│                                                                  │
│      ⬤ AI_LAB                       ⬤ PERSONAL                  │
│      #FF5FFF                        #76E6C7                      │
│                                                                  │
│                        ⬤ XR                                     │
│                       #8EC8FF                                    │
│                                                                  │
│   ⬤ INSTITUTIONS      ⬤ SOCIAL       ⬤ MY_TEAM                  │
│   #D08FFF             #66D06F        #5ED8FF                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3) GRADIENTS (CANONICAL) ⚡

### 3.1 Gradient Definitions

```css
/* SPHERE BASE GRADIENT */
.gradient-sphere-base {
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.04) 0%,
    rgba(255, 255, 255, 0.00) 100%
  );
}

/* WHITE AURA (LUMINOUS) */
.gradient-white-aura {
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.3) 0%,
    rgba(255, 255, 255, 0.0) 100%
  );
}

/* TRUST HIGH */
.gradient-trust-high {
  background: radial-gradient(
    circle,
    rgba(120, 255, 180, 0.4) 0%,
    rgba(120, 255, 180, 0.0) 100%
  );
}

/* TRUST LOW */
.gradient-trust-low {
  background: radial-gradient(
    circle,
    rgba(255, 150, 50, 0.35) 0%,
    rgba(255, 150, 50, 0.0) 100%
  );
}

/* SPHERE ZOOM TRANSITION */
.gradient-sphere-zoom {
  background: radial-gradient(
    circle at 50% 50%,
    rgba(255, 255, 255, 0.10) 0%,
    rgba(0, 0, 0, 0.75) 100%
  );
}
```

### 3.2 TypeScript Gradient Config

```typescript
// gradients.config.ts
export const GRADIENTS = {
  sphereBase: {
    type: 'linear',
    angle: 180,
    stops: [
      { offset: 0, color: 'rgba(255,255,255,0.04)' },
      { offset: 100, color: 'rgba(255,255,255,0.00)' }
    ]
  },
  
  luminous: {
    whiteAura: {
      type: 'radial',
      stops: [
        { offset: 0, color: 'rgba(255,255,255,0.3)' },
        { offset: 100, color: 'rgba(255,255,255,0.0)' }
      ]
    },
    trustHigh: {
      type: 'radial',
      stops: [
        { offset: 0, color: 'rgba(120,255,180,0.4)' },
        { offset: 100, color: 'rgba(120,255,180,0.0)' }
      ]
    },
    trustLow: {
      type: 'radial',
      stops: [
        { offset: 0, color: 'rgba(255,150,50,0.35)' },
        { offset: 100, color: 'rgba(255,150,50,0.0)' }
      ]
    }
  },
  
  sphereZoom: {
    type: 'radial',
    center: '50% 50%',
    stops: [
      { offset: 0, color: 'rgba(255,255,255,0.10)' },
      { offset: 100, color: 'rgba(0,0,0,0.75)' }
    ]
  }
} as const;
```

---

## 4) TEXTURES (CANONICAL) ⚡

### 4.1 Surface Textures

| Texture | Description | Usage |
|---------|-------------|-------|
| **Micrograin Dark** | Subtle noise at 3% opacity, neutral dark gray | Background surfaces |
| **Holographic Panel** | Light scanlines + 2% blur | XR panels |
| **Card Satin** | Soft specular reflection at 10° angle | Cards, modals |

### 4.2 XR Textures

| Texture | Description | Usage |
|---------|-------------|-------|
| **Volumetric Glow** | Low-density particle haze | Ambient atmosphere |
| **Aurora Streams** | Dynamic gradient ribbons | Knowledge threads |
| **Grid Floor** | 10% opacity white lines, 1m spacing | XR ground plane |

### 4.3 CSS Implementation

```css
/* MICROGRAIN DARK */
.texture-micrograin {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  opacity: 0.03;
}

/* SCANLINES */
.texture-scanlines {
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(255, 255, 255, 0.02) 2px,
    rgba(255, 255, 255, 0.02) 4px
  );
}

/* XR GRID FLOOR */
.texture-grid-floor {
  background-image: 
    linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px);
  background-size: 100px 100px; /* 1m spacing at scale */
}
```

---

## 5) SHADOWS & DEPTH (CANONICAL) ⚡

### 5.1 Shadow Definitions

```css
/* SHADOW TOKENS */
:root {
  --shadow-panel: 0px 8px 22px rgba(0, 0, 0, 0.45);
  --shadow-card: 0px 4px 12px rgba(0, 0, 0, 0.30);
  --shadow-button: 0px 10px 24px rgba(0, 0, 0, 0.6);
  --shadow-hologram: 0 0 25px rgba(120, 200, 255, 0.6);
}
```

### 5.2 Depth Layers (Z-Index System)

```typescript
// depth.config.ts
export const DEPTH_LAYERS = {
  BACKGROUND: 0,      // Background elements
  NAVIGATION: 100,    // Nav bars, sidebars
  CONTENT: 200,       // Content cards
  PANELS: 300,        // Side panels
  MODALS: 400,        // Modal dialogs
  OVERLAYS: 500,      // Overlays, auras
  XR_PORTAL: 600      // XR portal entry
} as const;

export type DepthLayer = keyof typeof DEPTH_LAYERS;
```

### 5.3 Visual Depth Stack

```
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 6: XR PORTAL ENTRY (z: 600)                              │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  LAYER 5: OVERLAYS / AURAS (z: 500)                     │    │
│  │  ┌─────────────────────────────────────────────────┐    │    │
│  │  │  LAYER 4: MODALS (z: 400)                       │    │    │
│  │  │  ┌─────────────────────────────────────────┐    │    │    │
│  │  │  │  LAYER 3: PANELS (z: 300)               │    │    │    │
│  │  │  │  ┌─────────────────────────────────┐    │    │    │    │
│  │  │  │  │  LAYER 2: CONTENT CARDS (z: 200)│    │    │    │    │
│  │  │  │  │  ┌─────────────────────────┐    │    │    │    │    │
│  │  │  │  │  │ LAYER 1: NAV (z: 100)   │    │    │    │    │    │
│  │  │  │  │  │ ┌───────────────────┐   │    │    │    │    │    │
│  │  │  │  │  │ │ L0: BACKGROUND    │   │    │    │    │    │    │
│  │  │  │  │  │ └───────────────────┘   │    │    │    │    │    │
└──┴──┴──┴──┴──┴─────────────────────────┴────┴────┴────┴────┴────┘
```

---

## 6) ICONOGRAPHY (CANONICAL) ⚡

### 6.1 Icon Style Guidelines

| Property | Value |
|----------|-------|
| **Style** | Thin-line + microglow |
| **Line Width** | 1.75px |
| **Corner Radius** | 4px |
| **Glow** | rgba(255,255,255,0.12) |
| **Fill** | None (outline only) |

### 6.2 Icon Categories

```typescript
// icons.config.ts
export const ICONS = {
  system: [
    'home', 'search', 'settings', 'notifications', 'help'
  ],
  
  content: [
    'document', 'note', 'task', 'calendar', 'bookmark'
  ],
  
  spheres: {
    personal: 'heart',
    business: 'briefcase',
    scholar: 'book',
    creative: 'palette',
    social: 'network',
    institutions: 'gavel',
    methodology: 'gear',
    xr: 'cubes',
    entertainment: 'star',
    ai_lab: 'chip',
    my_team: 'group'
  },
  
  agents: {
    nova: 'orb',
    architect: 'sigma',
    thread_weaver: 'weaver',
    drift_detector: 'detector',
    memory_manager: 'memory',
    ethics_guard: 'shield'
  },
  
  interaction: [
    'gesture_hand', 'portal', 'timeline', 'branch'
  ]
} as const;
```

### 6.3 Icon Rules (CSS)

```css
/* BASE ICON STYLE */
.icon {
  stroke: var(--chenu-white);
  stroke-width: 1.75px;
  fill: none;
  filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.12));
}

/* SPHERE ICON (colored) */
.icon-sphere {
  stroke: var(--sphere-color);
  filter: drop-shadow(0 0 4px color-mix(in srgb, var(--sphere-color) 25%, transparent));
}

/* AGENT ICON */
.icon-agent {
  stroke: var(--agent-color);
  filter: drop-shadow(0 0 6px color-mix(in srgb, var(--agent-color) 40%, transparent));
}
```

---

## 7) SPHERE THEMES (UI) ⚡

### 7.1 Theme Application Rules

```typescript
// theme.rules.ts
export const SPHERE_THEME_RULES = {
  primary_color: 'sphere_color',
  soft_glow_on_headers: true,
  gradient_background: 'sphere_base_gradient',
  card_accent_border: 'sphere_color at 10% opacity'
} as const;
```

### 7.2 Theme Definitions

```typescript
// themes.config.ts
export const SPHERE_THEMES = {
  personal: {
    primary: '#76E6C7',
    accent: '#9FF2DC',
    backgroundOverlay: 'rgba(118, 230, 199, 0.05)',
    glowColor: 'rgba(118, 230, 199, 0.3)'
  },
  
  business: {
    primary: '#5BA9FF',
    accent: '#82C2FF',
    backgroundOverlay: 'rgba(91, 169, 255, 0.05)',
    glowColor: 'rgba(91, 169, 255, 0.3)'
  },
  
  scholar: {
    primary: '#E0C46B',
    accent: '#F0D98D',
    backgroundOverlay: 'rgba(224, 196, 107, 0.05)',
    glowColor: 'rgba(224, 196, 107, 0.3)'
  },
  
  creative: {
    primary: '#FF8BAA',
    accent: '#FFB0C5',
    backgroundOverlay: 'rgba(255, 139, 170, 0.05)',
    glowColor: 'rgba(255, 139, 170, 0.3)'
  },
  
  social: {
    primary: '#66D06F',
    accent: '#8EE094',
    backgroundOverlay: 'rgba(102, 208, 111, 0.05)',
    glowColor: 'rgba(102, 208, 111, 0.3)'
  },
  
  institutions: {
    primary: '#D08FFF',
    accent: '#E0B3FF',
    backgroundOverlay: 'rgba(208, 143, 255, 0.05)',
    glowColor: 'rgba(208, 143, 255, 0.3)'
  },
  
  methodology: {
    primary: '#59D0C6',
    accent: '#7EDDD5',
    backgroundOverlay: 'rgba(89, 208, 198, 0.05)',
    glowColor: 'rgba(89, 208, 198, 0.3)'
  },
  
  xr: {
    primary: '#8EC8FF',
    accent: '#BDE0FF',
    backgroundOverlay: 'rgba(142, 200, 255, 0.05)',
    glowColor: 'rgba(180, 220, 255, 0.3)',
    hologramGlow: 'rgba(180, 220, 255, 0.3)'
  },
  
  entertainment: {
    primary: '#FFB04D',
    accent: '#FFC980',
    backgroundOverlay: 'rgba(255, 176, 77, 0.05)',
    glowColor: 'rgba(255, 176, 77, 0.3)'
  },
  
  ai_lab: {
    primary: '#FF5FFF',
    accent: '#FF8FFF',
    backgroundOverlay: 'rgba(255, 95, 255, 0.05)',
    glowColor: 'rgba(255, 95, 255, 0.3)'
  },
  
  my_team: {
    primary: '#5ED8FF',
    accent: '#8AE5FF',
    backgroundOverlay: 'rgba(94, 216, 255, 0.05)',
    glowColor: 'rgba(94, 216, 255, 0.3)'
  }
} as const;
```

---

## 8) XR VISUAL COMPONENTS ⚡

### 8.1 Ambient Colors

```typescript
// xr-ambient.config.ts
export const XR_AMBIENT = {
  dim: '#0A0B0D',
  neutral: '#111317',
  bright: '#1C1F24'
} as const;
```

### 8.2 Holograms

```typescript
// xr-holograms.config.ts
export const XR_HOLOGRAMS = {
  color: '#8EC8FF',
  opacity: 0.75,
  scanlineIntensity: 0.1
} as const;
```

### 8.3 Portals

```typescript
// xr-portals.config.ts
export const XR_PORTALS = {
  entry: {
    shape: 'circular',
    ringColor: '#8EC8FF',
    innerGlow: 'rgba(140, 200, 255, 0.35)'
  },
  replay: {
    shape: 'elliptical',
    color: '#FF5FFF',
    distortion: 'subtle refractive warp'
  }
} as const;
```

### 8.4 Threads & Agent Auras

```typescript
// xr-threads.config.ts
export const XR_THREADS = {
  defaultColor: '#FF5FFF',
  pulseSpeed: 'medium',
  thickness: 'adaptive'
} as const;

// xr-agent-auras.config.ts
export const XR_AGENT_AURAS = {
  nova: {
    color: '#FFFFFF',
    levelGlow: [0.3, 0.5, 0.8]
  },
  architect_sigma: {
    color: '#5BA9FF',
    pattern: 'grid_lines'
  },
  thread_weaver: {
    color: '#FF5FFF',
    pattern: 'flowing_ribbons'
  }
} as const;
```

---

## 9) BUTTONS & COMPONENTS ⚡

### 9.1 Button Variants

```css
/* PRIMARY BUTTON */
.btn-primary {
  background: var(--chenu-info);
  color: var(--chenu-white);
  border-radius: 10px;
  box-shadow: 0px 4px 12px rgba(91, 169, 255, 0.45);
  transition: all 0.2s ease-out;
}

.btn-primary:hover {
  box-shadow: 0 0 12px rgba(91, 169, 255, 0.5);
}

/* GHOST BUTTON */
.btn-ghost {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: var(--chenu-white);
  border-radius: 10px;
}

.btn-ghost:hover {
  background: rgba(255, 255, 255, 0.04);
}

/* CAUTION BUTTON */
.btn-caution {
  background: var(--chenu-error);
  color: var(--chenu-white);
  border-radius: 10px;
}

.btn-caution:hover {
  background: #FF7373;
}
```

### 9.2 Card Component

```css
/* BASE CARD */
.card {
  background: var(--chenu-dark-gray);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 16px;
  box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.35);
}
```

---

## 10) MOTION & ANIMATION ⚡

### 10.1 Easing Functions

```css
:root {
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 10.2 Duration Tokens

```css
:root {
  --duration-fast: 120ms;
  --duration-medium: 240ms;
  --duration-slow: 450ms;
}
```

### 10.3 Animation Presets

```typescript
// motion.config.ts
export const MOTION = {
  easing: {
    easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
  },
  
  durations: {
    fast: 120,
    medium: 240,
    slow: 450
  },
  
  effects: {
    zoomInSphere: {
      from: { scale: 0.92 },
      to: { scale: 1.0 }
    },
    panelSlideUp: {
      from: { translateY: 20 },
      to: { translateY: 0 }
    },
    auraPulse: {
      type: 'opacity',
      speed: 'slow',
      min: 0.3,
      max: 0.8
    }
  }
} as const;
```

---

## 11) TYPOGRAPHY ⚡

### 11.1 Font Stack

```css
:root {
  --font-primary: 'Inter', 'SF Pro', 'Roboto', sans-serif;
}
```

### 11.2 Size Scale

```css
:root {
  --text-h1: 32px;
  --text-h2: 24px;
  --text-h3: 18px;
  --text-body: 15px;
  --text-small: 13px;
}
```

### 11.3 Weight Scale

```css
:root {
  --font-light: 300;
  --font-regular: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}
```

### 11.4 TypeScript Config

```typescript
// typography.config.ts
export const TYPOGRAPHY = {
  fonts: {
    primary: 'Inter',
    fallback: ['SF Pro', 'Roboto', 'sans-serif']
  },
  
  sizes: {
    h1: 32,
    h2: 24,
    h3: 18,
    body: 15,
    small: 13
  },
  
  weights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  },
  
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75
  }
} as const;
```

---

## 12) 3D / XR MATERIALS ⚡

### 12.1 Material Definitions

```typescript
// xr-materials.config.ts
export const XR_MATERIALS = {
  hologram: {
    baseColor: '#8EC8FF',
    transmission: 0.75,
    thickness: 0.05,
    scatter: 0.1,
    fresnel: 0.4
  },
  
  avatar: {
    baseColor: 'sphere_color', // Dynamic
    emissionIntensity: 1.2,
    smoothness: 0.85
  },
  
  portal: {
    color: '#8EC8FF',
    emission: 1.4,
    distortion: 0.15
  }
} as const;
```

### 12.2 Three.js Material Implementation

```typescript
// materials/hologram.material.ts
import * as THREE from 'three';

export function createHologramMaterial() {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#8EC8FF'),
    transmission: 0.75,
    thickness: 0.05,
    roughness: 0.1,
    metalness: 0,
    clearcoat: 0.4,
    clearcoatRoughness: 0.1,
    transparent: true,
    opacity: 0.75
  });
}

// materials/avatar.material.ts
export function createAvatarMaterial(sphereColor: string) {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(sphereColor),
    emissive: new THREE.Color(sphereColor),
    emissiveIntensity: 1.2,
    roughness: 0.15,
    metalness: 0.1
  });
}

// materials/portal.material.ts
export function createPortalMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      color: { value: new THREE.Color('#8EC8FF') },
      emission: { value: 1.4 },
      distortion: { value: 0.15 }
    },
    vertexShader: `/* portal vertex shader */`,
    fragmentShader: `/* portal fragment shader */`,
    transparent: true
  });
}
```

---

## 13) COMPLETE CSS VARIABLES ⚡

```css
/* CHE·NU DESIGN TOKENS - COMPLETE */
:root {
  /* === BASE COLORS === */
  --chenu-black: #0A0B0D;
  --chenu-dark-gray: #1A1C20;
  --chenu-medium-gray: #2C2F33;
  --chenu-light-gray: #C8C8C8;
  --chenu-white: #FFFFFF;
  
  /* === SEMANTIC === */
  --chenu-info: #5BA9FF;
  --chenu-success: #6FE8A3;
  --chenu-warning: #FFBE55;
  --chenu-error: #FF5A5A;
  
  /* === SPHERES === */
  --sphere-personal: #76E6C7;
  --sphere-business: #5BA9FF;
  --sphere-scholar: #E0C46B;
  --sphere-creative: #FF8BAA;
  --sphere-social: #66D06F;
  --sphere-institutions: #D08FFF;
  --sphere-methodology: #59D0C6;
  --sphere-xr: #8EC8FF;
  --sphere-entertainment: #FFB04D;
  --sphere-ai-lab: #FF5FFF;
  --sphere-my-team: #5ED8FF;
  
  /* === SHADOWS === */
  --shadow-panel: 0px 8px 22px rgba(0, 0, 0, 0.45);
  --shadow-card: 0px 4px 12px rgba(0, 0, 0, 0.30);
  --shadow-button: 0px 10px 24px rgba(0, 0, 0, 0.6);
  --shadow-hologram: 0 0 25px rgba(120, 200, 255, 0.6);
  
  /* === TYPOGRAPHY === */
  --font-primary: 'Inter', 'SF Pro', 'Roboto', sans-serif;
  --text-h1: 32px;
  --text-h2: 24px;
  --text-h3: 18px;
  --text-body: 15px;
  --text-small: 13px;
  
  /* === MOTION === */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --duration-fast: 120ms;
  --duration-medium: 240ms;
  --duration-slow: 450ms;
  
  /* === SPACING === */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  
  /* === RADIUS === */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-full: 9999px;
}
```

---

## 14) TAILWIND CONFIG ⚡

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        chenu: {
          black: '#0A0B0D',
          'dark-gray': '#1A1C20',
          'medium-gray': '#2C2F33',
          'light-gray': '#C8C8C8',
          white: '#FFFFFF',
          info: '#5BA9FF',
          success: '#6FE8A3',
          warning: '#FFBE55',
          error: '#FF5A5A'
        },
        sphere: {
          personal: '#76E6C7',
          business: '#5BA9FF',
          scholar: '#E0C46B',
          creative: '#FF8BAA',
          social: '#66D06F',
          institutions: '#D08FFF',
          methodology: '#59D0C6',
          xr: '#8EC8FF',
          entertainment: '#FFB04D',
          'ai-lab': '#FF5FFF',
          'my-team': '#5ED8FF'
        }
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro', 'Roboto', 'sans-serif']
      },
      fontSize: {
        h1: '32px',
        h2: '24px',
        h3: '18px',
        body: '15px',
        small: '13px'
      },
      boxShadow: {
        panel: '0px 8px 22px rgba(0, 0, 0, 0.45)',
        card: '0px 4px 12px rgba(0, 0, 0, 0.30)',
        button: '0px 10px 24px rgba(0, 0, 0, 0.6)',
        hologram: '0 0 25px rgba(120, 200, 255, 0.6)'
      },
      transitionTimingFunction: {
        'chenu-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'chenu-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)'
      },
      transitionDuration: {
        fast: '120ms',
        medium: '240ms',
        slow: '450ms'
      }
    }
  }
};
```

---

**FIN DU DOCUMENT** — CHE·NU Visual Style Pack Complete v1.0
