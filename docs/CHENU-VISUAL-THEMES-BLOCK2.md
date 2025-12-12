# CHE·NU — Visual Themes (Block 2)

> *"Themes modify perception only. No logic, authority, agents, or rules may be altered."*

---

## OVERVIEW

These themes extend the CHE·NU visual system with two additional perceptual styles:

| Theme | Category | Intent |
|-------|----------|--------|
| **Cosmic** | Abstract | Calm exploration without disorientation |
| **Futurist** | Systemic | Precision and system awareness without intimidation |

---

## GLOBAL CONSTRAINTS

**All themes MUST respect these constraints:**

| Constraint | Description |
|------------|-------------|
| ❌ No gamification | No scores, points, achievements |
| ❌ No urgency | No timers, countdowns, pressure |
| ❌ No forced focus | User controls their attention |
| ❌ No emotional manipulation | No guilt, fear, or excitement exploitation |
| ❌ No decision suggestions | Theme never implies what to choose |
| ❌ No agent ranking | All agents visually equal |
| ❌ No optimization pressure | No "improve," "maximize" cues |
| ❌ No decision chain alteration | Flow remains immutable |

---

## THEME 4 — COSMIC / ABSTRACT

### Intent
Provide perspective, distance, and calm exploration without disorientation.
This theme is about seeing complexity without pressure.

### Goal Feeling
> *"I can explore without getting lost."*

### Use Cases

- 🔭 Exploration
- 📚 Research
- 🎯 Vision work
- 🌌 Universe view
- 🔗 Multi-sphere navigation

### Visual Rules

| Rule | Value |
|------|-------|
| Background | Dark or deep gradient |
| Accents | Soft luminous (glow) |
| Geometry | Abstract (spheres, arcs, orbits) |
| Contrast | Low |
| Motion | Slow only |

### Colors

```
Background:  #0a0a1a (deep space)
Text:        #e0e6ff (soft white-blue)
Accent:      #60a0ff (soft blue)
             #a080ff (soft purple)
             #40e0d0 (soft cyan)
```

**Restrictions:**
- ❌ No saturated reds
- ❌ No aggressive tones
- Max saturation: 60%

### Space

- Open environments
- No hard walls
- Depth and distance visible
- Star particles in background

### Timeline

- Represented as **arcs, paths, or constellations**
- Events appear as **light points**
- **No linear pressure**

### Agents

- Represented as **orbiting nodes or lights**
- Size reflects **activity, not importance**
- **No faces, no bodies**

### XR

| Feature | Value |
|---------|-------|
| Gravity | Zero (floating) |
| Camera | Slow drift |
| Orientation | Not forced |
| Reference | Stable center ring |

### Interaction

- Point, hover, observe
- **No snap actions**
- **No urgency cues**

---

## THEME 5 — FUTURIST / SYSTEMIC

### Intent
Precision, orchestration, and system awareness without intimidation.
This theme shows structure, not dominance.

### Goal Feeling
> *"The system is complex, but fully understandable."*

### Use Cases

- 🎛️ Orchestration
- 🐛 Debug
- 👨‍💻 Advanced users
- 🚀 XR control room
- 📊 System-level oversight

### Visual Rules

| Rule | Value |
|------|-------|
| Layout | Grid-based |
| Geometry | Clean modular |
| Lines | Thin, sharp but soft-edged |
| Layering | Clear separation |
| Contrast | Medium |

### Colors

```
Background:  #0c0c14 (near black)
Text:        #e8ecf4 (bright white-blue)
Accent:      #00d4ff (cyan)
             #8080ff (violet)
             #00c8a0 (teal)
```

### Information Display

| Rule | Value |
|------|-------|
| Separation | By layers |
| Overlap | Never |
| Max visible items | 8 |
| Readability | At a glance |

### Agents

- Represented as **functional nodes**
- **Clear labels** (below, technical style)
- Activity: **subtle pulses**
- **Never animated aggressively**
- **Static positioning** (no orbit)

### Guards

- Visualized as **shields, frames, or boundaries**
- **Pulse softly** when activated
- **Always with textual explanation**

### XR

| Feature | Value |
|---------|-------|
| Environment | Control room |
| Panels | Axis-aligned, floating |
| Motion | None excessive |
| Horizon | Stable, locked |
| Floor | Grid visible |

### Interaction

| Feature | Value |
|---------|-------|
| Selection | Direct |
| Responses | Predictable |
| Feedback | Immediate |
| Hidden state | Never |

---

## THEME SWITCHING

```typescript
// Theme switching is:
// - Manual only (never automatic)
// - Smooth transition (500ms ease-in-out)
// - Context preserved
// - Session preserved
```

---

## USAGE

### TypeScript

```typescript
import { COSMIC_THEME, FUTURIST_THEME } from '@chenu/themes';

// Access theme values
const bgColor = COSMIC_THEME.colors.background.primary;
const agentColor = FUTURIST_THEME.colors.agents.active;

// Check constraints
if (COSMIC_THEME.constraints.noUrgency) {
  // All themes enforce this
}

// Access rules
const orbitSpeed = COSMIC_THEME.animation.xr.orbitSpeed; // 0.05 (slow)
const staticAgents = FUTURIST_THEME.rules.agents?.orbit?.static; // true
```

### Use Case Selection

```typescript
// Get theme for use case
function getThemeForUseCase(useCase: string): CheNuTheme {
  if (COSMIC_THEME.useCases.includes(useCase)) {
    return COSMIC_THEME;
  }
  if (FUTURIST_THEME.useCases.includes(useCase)) {
    return FUTURIST_THEME;
  }
  return DEFAULT_THEME;
}

// Examples
getThemeForUseCase('exploration');  // → COSMIC
getThemeForUseCase('debug');        // → FUTURIST
```

---

## COMPARISON

| Feature | Cosmic | Futurist |
|---------|--------|----------|
| Background | Deep gradient | Solid dark |
| Motion | Slow drift | Static |
| Agents | Orbiting lights | Fixed nodes |
| Layout | Open/floating | Grid-based |
| Geometry | Abstract | Modular |
| Timeline | Constellation | System |
| Interaction | Observe | Direct select |
| XR | Zero gravity | Control room |

---

## VALIDATION

```typescript
// Validate theme constraints
function validateTheme(theme: CheNuTheme): boolean {
  return (
    theme.constraints.noGamification &&
    theme.constraints.noUrgency &&
    theme.constraints.noForcedFocus &&
    theme.constraints.noEmotionalManipulation &&
    theme.constraints.noDecisionSuggestions &&
    theme.constraints.noAgentRanking &&
    theme.constraints.noOptimizationPressure &&
    theme.constraints.noDecisionChainAlteration
  );
}

// Both themes pass
validateTheme(COSMIC_THEME);   // true
validateTheme(FUTURIST_THEME); // true
```

---

## FILE STRUCTURE

```
src/themes/
├── theme.extended.types.ts    # Extended type definitions
├── cosmic.theme.v2.ts         # Theme 4: Cosmic/Abstract
├── futurist.theme.v2.ts       # Theme 5: Futurist/Systemic
└── index.ts                   # Updated exports
```

---

**Version:** themes-block2-1.0
**Status:** CANONICAL — DO NOT MODIFY WITHOUT CONSTITUTIONAL REVIEW
