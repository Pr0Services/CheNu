# CHE·NU XR Presets Pack

> **XR.v1.0**  
> Type: Foundation / Presets / Immersive-Layers  
> Status: **CANONICAL**

5 curated immersive environments for CHE·NU spatial experiences.

## Installation

```bash
npm install @chenu/xr-presets
```

## Quick Start

```tsx
import {
  XRPresetsProvider,
  XRPresetsDashboard,
  useXRPresets,
} from '@chenu/xr-presets';

function App() {
  return (
    <XRPresetsProvider>
      <XRPresetsDashboard />
    </XRPresetsProvider>
  );
}
```

## Presets Overview

| Preset | Theme | Interaction Radius | Best For |
|--------|-------|-------------------|----------|
| 🏛️ **Classic** | Warm, grounded | 2.5m | Daily use, meditation |
| 🌌 **Cosmic** | Expansive, awe | 4.0m | Memory review, planning |
| 🔨 **Builder** | Ancient, focused | 2.0m | Construction work |
| 💠 **Sanctum** | Futuristic, clean | 3.0m | Data analysis, AI work |
| 🌿 **Jungle** | Natural, alive | 2.0m | Creative thinking |

## Preset Details

### 🏛️ XR Classic

The essence of CHE·NU. Warm stone circle with soft lanterns.

```typescript
{
  id: 'xr_classic',
  lighting: 'warm_low',
  sky: 'soft_gradient',
  floor: 'stone_circle',
  ambience: ['low_wind', 'subtle_chimes'],
  special: 'Interactive tree-of-links',
}
```

### 🌌 XR Cosmic

Expansive starfield with orbiting memory shards.

```typescript
{
  id: 'xr_cosmic',
  lighting: 'deep_starfield',
  sky: 'nebula_dynamic',
  floor: 'translucent_orbit_ring',
  ambience: ['ambient_cosmic_hum'],
  special: 'Agent orbit paths',
}
```

### 🔨 XR Builder

Mystical workshop with blueprint projections.

```typescript
{
  id: 'xr_builder',
  lighting: 'torch_soft',
  sky: 'cavern_skybox',
  floor: 'engraved_stone',
  ambience: ['deep_echo', 'earth_resonance'],
  special: 'Blueprint projection field',
}
```

### 💠 XR Sanctum

High-tech environment with holographic data streams.

```typescript
{
  id: 'xr_sanctum',
  lighting: 'neon_low',
  sky: 'holo_grid',
  floor: 'reflective_white',
  ambience: ['smooth_aether'],
  special: 'Real-time data feeds',
}
```

### 🌿 XR Jungle

Lush rainforest with organic navigation.

```typescript
{
  id: 'xr_jungle',
  lighting: 'filtered_sun',
  sky: 'tropical_fog',
  floor: 'moss_platform',
  ambience: ['rainforest_soft'],
  special: 'Wildlife ambience randomizer',
}
```

## Universal XR Rules

All presets share universal rules for consistent UX:

### Transitions
```typescript
{
  type: 'fade_portal',
  duration_ms: 800,
  audio: 'soft_whoosh',
}
```

### Navigation Modes
- **teleport_step** - Instant position change
- **slow-glide** - Comfort-locked smooth movement
- **fixed-node** - Predefined waypoint travel

### Safety Features
- **boundary_mesh** - Visual guardian boundary
- **auto_recenter** - Automatic view reset
- **collision_soft** - Gentle collision feedback

## API Reference

### useXRPresets()

```typescript
const {
  state,
  loadPreset,
  unloadPreset,
  transitionTo,
  setNavigationMode,
  toggleSafety,
  getPreset,
  getAllPresets,
  recommendPreset,
  exportBundle,
} = useXRPresets();
```

### loadPreset(id)

Load a preset with asset loading simulation.

```typescript
await loadPreset('xr_cosmic');
```

### transitionTo(id)

Transition from current preset to new one with animation.

```typescript
await transitionTo('xr_builder');
```

### recommendPreset(criteria)

Get AI-recommended preset based on criteria.

```typescript
const id = recommendPreset({
  mood: 'creative',
  task: 'collaboration',
});
```

## Components

| Component | Description |
|-----------|-------------|
| `XRPresetsDashboard` | Full dashboard UI |
| `PresetSelector` | Grid of all presets |
| `PresetCard` | Individual preset card |
| `CurrentPresetDisplay` | Active preset details |
| `NavigationControls` | Navigation mode picker |
| `PresetRecommender` | AI recommendation form |
| `LoadingOverlay` | Loading/transition overlay |

## Accessibility

All presets are designed accessibility-first:

- ✓ No high motion effects
- ✓ Reduced parallax options
- ✓ Capped brightness where needed
- ✓ Motion blur disabled
- ✓ Clear navigation cues
- ✓ Comfort-locked glide mode

## Export Bundle

Export all presets as a portable bundle:

```typescript
const bundle = exportBundle();
// Returns JSON string with all presets + rules
```

Bundle format:
```typescript
{
  version: "1.0",
  hash: "sha256-...",
  presets: [...],
  universal_rules: {...},
}
```

---

> *"Immersive environments that respect the human. Beauty that serves, never manipulates."*

## License

MIT — CHE·NU Universal Cognitive Operating System
