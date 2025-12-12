# CHE·NU Avatar Evolution + Multi-Meeting Universe View

> **XR.v1.2**  
> Type: Immersive Coordination / Non-Manipulative  
> Status: **CANONICAL**

Avatar evolution based ONLY on objective system states — NOT psychology.
Universe view for meeting coordination and navigation.

## ⚠️ CORE RULE

```
Evolution = INFORMATIONAL STATE, not identity shaping.

No traits → only morphology changes:
• clarity
• data richness
• activity level
• role density
```

## Installation

```bash
npm install @chenu/avatar-evolution-universe
```

## Quick Start

```tsx
import {
  AvatarEvolutionUniverseProvider,
  AvatarEvolutionUniverseDashboard,
  useAvatarEvolutionUniverse,
} from '@chenu/avatar-evolution-universe';

function App() {
  return (
    <AvatarEvolutionUniverseProvider>
      <AvatarEvolutionUniverseDashboard />
    </AvatarEvolutionUniverseProvider>
  );
}
```

## Evolution States

| State | Visual | Context | Complexity |
|-------|--------|---------|------------|
| **BASE** | Neutral morphology, stable outline | Default | 0% |
| **SIGNAL** | Light glyphs, no expressivity | Active session | 33% |
| **STRUCTURAL** | Branching lines = data paths | Analysis mode | 66% |
| **INTEGRATED** | Full context aura + structural | XR analysis | 100% |

### What NEVER Evolves

```typescript
// NEVER allowed:
❌ Faces - No facial features or expressions
❌ Emotions - No mood representation
❌ Identity - No personality traits
❌ Dynamic manipulation - No psychological influence
```

## Evolution Triggers

### 1. Session Context

| Mode | Morphology Effect |
|------|-------------------|
| meeting_mode | → simplified silhouette |
| creative_mode | → fluid forms unlock |
| analysis_mode | → fractal node aura |
| neutral_mode | → base morphology |

### 2. Information Load

| Load | Effect |
|------|--------|
| low_load | → stable form |
| med_load | → light glyphs appear |
| high_load | → multi-layer outline |

### 3. Role Intensity

| Role | Effect |
|------|--------|
| coordinator | → tri-wire halo |
| observer | → dimmest silhouette |
| presenter | → front glyph only |

### 4. User Preferences

**Overwrites EVERYTHING.**
User decides final morphology level.

## Evolution JSON Spec

```typescript
{
  "avatar_evolution": {
    "state": "base|signal|structural|integrated",
    "context": "analysis|creative|decision|review",
    "info_density": 0.0-1.0,
    "role_glyph": "agent|user|observer",
    "safety_lock": true
  }
}
```

## Multi-Meeting Universe View

Universe View displays all meetings as spatial nodes:

- Active meetings
- Planned meetings
- Archived replays
- Agent presence nodes
- Inter-sphere links

### Node Types

| Type | Color | Visual |
|------|-------|--------|
| LIVE | accent | pulse: slow, aura: participant count |
| SCHEDULED | soft grey | halo: calendar ring |
| REPLAY | blue | inner glyph: timeline icon |
| AGENT_HUB | white | ray-lines: active tasks |

### Sphere Alignment

Meetings cluster around domain orbits:

| Sphere | Icon | Domain |
|--------|------|--------|
| Business | 🏢 | Commerce, operations |
| Scholar | 📚 | Research, learning |
| Creative | 🎨 | Design, art |
| Institution | 🏛️ | Governance, policy |
| Social | 👥 | Community, personal |
| XR | 🥽 | Immersive spaces |

## Synchronization Rules

| Rule | Description |
|------|-------------|
| TEMPORAL | Sort by start_time ASC |
| SPHERE | Cluster around domain orbits |
| PARTICIPANTS | Links between shared users/agents/topics |
| ETHICS | Never reveal private content, emotions, metadata |

## Universe Interactions

| Interaction | Description |
|-------------|-------------|
| zoom_orbit | Zoom into sphere clusters |
| enter_meeting | Teleport to meeting room |
| open_replay | Access timeline for replay |
| expand_links | Show connections between nodes |
| filter_by_sphere | Show only specific domain |
| filter_by_agent | Show agent-related meetings |
| silent_review_mode | Non-intrusive observation |

### Disabled (Forbidden)

```typescript
// NEVER allowed:
❌ persuasion - No visual nudging
❌ visual_dominance - No oversized nodes
❌ forced_focus - No mandatory attention
```

## Coordination Agents

| Agent | Responsibility | Constraint |
|-------|----------------|------------|
| 🗓️ MEETING_COORDINATOR | Scheduling + metadata | No authority on decisions |
| 🌌 UNIVERSE_RENDERER | Graph generation | Never interprets meaning |
| 🔄 REPLAY_ENGINE | Export + integrity hash | Exact reproduction only |
| 👤 EVOLUTION_MONITOR | Avatar state updates | Never influences users |

## Safety Features

- ✓ No bright flashes
- ✓ No rapid motion
- ✓ Fixed comfort glide
- ✓ Anchored floor (unless user chooses free mode)

## API Reference

### useAvatarEvolutionUniverse()

```typescript
const {
  state,
  
  // Evolution
  evolveAvatar,
  setEvolutionState,
  applyUserOverride,
  clearEvolution,
  
  // Universe
  addNode,
  removeNode,
  addLink,
  removeLink,
  
  // View
  setSphereFilter,
  setAgentFilter,
  setZoomLevel,
  setInteractionMode,
  updateSafety,
  
  // Queries
  getVisibleNodes,
  getVisibleLinks,
  getNodesBySphere,
} = useAvatarEvolutionUniverse();
```

### Evolve Avatar

```typescript
evolveAvatar('avatar_001', {
  session_context: 'analysis_mode',
  information_load: 'high_load',
  role_intensity: 'coordinator',
});
```

### Add Meeting Node

```typescript
const nodeId = addNode('live', 'business', 'Q4 Planning', ['user_1', 'agent_arch']);
```

## Components

| Component | Description |
|-----------|-------------|
| `AvatarEvolutionUniverseDashboard` | Full dashboard |
| `EvolutionController` | Evolution trigger controls |
| `UniverseView` | Meeting universe visualization |
| `SphereSelector` | Sphere filter buttons |
| `CoordinationAgentsPanel` | Agent status display |
| `SafetyPanel` | Safety feature toggles |

---

> *"Evolution = Informational State, Not Identity.*  
> *Universe = Navigation Space, Not Persuasion."*

## License

MIT — CHE·NU Universal Cognitive Operating System
