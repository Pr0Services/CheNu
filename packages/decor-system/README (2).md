# CHE·NU Ambient Decor System

> **Foundation Extension — Non-Functional Layer**  
> Visual Comfort / Cognitive Safety  
> Status: **CANONICAL**

The CHE·NU Ambient Decor System provides a passive visual comfort layer that creates a sense of calm, identity, and emotional safety — without ever influencing decisions or conveying information.

## Core Principle

```
Decor exists ONLY to provide:
✓ Comfort
✓ Calm
✓ Identity
✓ Emotional Safety

Decor must NEVER:
✗ Convey information
✗ Carry logic
✗ Influence decisions
✗ Attract attention aggressively
```

## Installation

```bash
npm install @chenu/ambient-decor
```

## Quick Start

```tsx
import { DecorProvider, DecorLayer, DecorControls } from '@chenu/ambient-decor';

function App() {
  return (
    <DecorProvider>
      <div style={{ position: 'relative', minHeight: '100vh' }}>
        {/* Decor renders behind all content */}
        <DecorLayer />
        
        {/* Your app content */}
        <main style={{ position: 'relative', zIndex: 1 }}>
          <h1>My CHE·NU App</h1>
          <DecorControls />
        </main>
      </div>
    </DecorProvider>
  );
}
```

## Canonical Decor Types

| Type | Name | Intent | Usage |
|------|------|--------|-------|
| `neutral` | Neutral Sanctuary | "Safe place to think" | Dashboard, Overview, Idle |
| `organic` | Living Structure | "Growth without chaos" | Personal, Learning, Growth |
| `cosmic` | Cognitive Universe | "Perspective, not spectacle" | Navigation, Strategy |
| `focus` | Silent Room | "Nothing distracts you now" | Focus tasks, Decisions |
| `xr` | Spatial Sanctuary | "Respectful conversation space" | XR Meetings |

## Sphere-Aware Decor

Decor automatically adapts based on the current sphere:

```tsx
<DecorLayer sphere="personal" />  // Uses organic decor
<DecorLayer sphere="universe" />  // Uses cosmic decor
<DecorLayer sphere="ethics-review" />  // Uses focus decor
```

## User Control

Users always have complete control:

```tsx
import { useDecor } from '@chenu/ambient-decor';

function MyComponent() {
  const { enable, disable, lockToDefault, resetPreferences } = useDecor();
  
  return (
    <div>
      <button onClick={disable}>Disable Decor</button>
      <button onClick={lockToDefault}>Lock to Neutral</button>
      <button onClick={resetPreferences}>Reset All</button>
    </div>
  );
}
```

## Per-Sphere Preferences

Allow users to customize decor for specific spheres:

```tsx
import { SphereDecorSelector } from '@chenu/ambient-decor';

<SphereDecorSelector sphere="personal" />
<SphereDecorSelector sphere="business" />
```

## Agent Auras

Display subtle agent presence (max 5% tint):

```tsx
<DecorLayer
  agentAuras={[
    { agentId: 'nova', color: '#5DA9FF', isActive: true },
    { agentId: 'organizer', color: '#4CAF88', isActive: false },
  ]}
/>
```

## Behavior Rules

The decor system follows strict rules:

### Decor NEVER:
- Reacts to notifications
- Flashes or blinks
- Animates faster than cognitive comfort thresholds
- Changes during active input

### Decor Changes ONLY:
- On explicit user action
- On sphere transition (smooth fade)
- On mode change (2D → 3D → XR)

## Performance

The system automatically scales based on device capability:

| Device | Behavior |
|--------|----------|
| High-end | Full effects |
| Standard | Reduced animation |
| Low-end | Static image |
| Mobile | Simplified background |
| XR | Reduced geometry |

## Accessibility

- `aria-hidden="true"` on all decor elements
- Never blocks pointer events
- Respects theme contrast requirements
- Instant disable available

## API Reference

### `<DecorProvider>`

Wraps your app to provide decor context.

```tsx
<DecorProvider
  initialDecor="neutral"  // Starting decor type
  defaultEnabled={true}   // Enable by default
>
  {children}
</DecorProvider>
```

### `<DecorLayer>`

The main ambient layer component.

```tsx
<DecorLayer
  sphere="personal"           // Optional: current sphere
  disableFpsMonitor={false}   // Optional: disable FPS monitoring
  agentAuras={[]}             // Optional: agent presence indicators
  zIndex={0}                  // Optional: layer z-index
  className=""                // Optional: additional CSS class
/>
```

### `useDecor()`

Hook for programmatic control.

```tsx
const {
  state,              // Current decor state
  setDecor,           // Set decor type directly
  setSphere,          // Set current sphere
  enable,             // Enable decor
  disable,            // Disable decor (instant)
  lockToDefault,      // Lock to neutral sanctuary
  unlock,             // Unlock from default
  setSpherePreference,// Set user preference per sphere
  resetPreferences,   // Reset all user preferences
  getDecorForSphere,  // Get decor type for a sphere
  getConfig,          // Get current config
  isEnabled,          // Check if enabled
} = useDecor();
```

## Theme Coexistence

Decor inherits color hints from theme but never overrides accessibility:

```tsx
// If theme conflict detected:
// 1. Reduce decor saturation to 50%
// 2. If still conflicting, reduce to 25%
// 3. Fallback to Neutral Sanctuary
```

## Ethical Constraints

The decor system is designed with strict ethical boundaries:

```
✗ No emotion manipulation
✗ No dependence induction
✗ No reward loops
✗ No persuasion mechanisms
✗ No addiction patterns
✗ No psychology exploitation

✓ Support clarity
✓ Provide comfort
✓ Reduce cognitive load
✓ Create safe space
✓ Enable focus
✓ Respect attention
```

## Directory Structure

```
/decor
  /types.ts          — Type definitions & constants
  /DecorContext.tsx  — React context & provider
  /DecorRenderers.tsx— Visual components
  /DecorLayer.tsx    — Main component
  /index.ts          — Exports
```

## License

MIT — CHE·NU Universal Cognitive Operating System

---

> *"Decor is the space between function and feeling. It exists so that thinking has a home."*
