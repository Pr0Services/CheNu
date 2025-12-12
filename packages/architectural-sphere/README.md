# CHE·NU Architectural Sphere

> **Foundation v1.1**  
> Type: Creative / Spatial / Structural  
> Status: **CANONICAL**

Design visual space, decors, avatars, and plans **WITHOUT influencing logic, decisions, or authority**.

## Core Rule

```
ARCHITECTURAL SPHERE = SPACE ONLY
NO behavior • NO decisions • NO data authority
```

## Installation

```bash
npm install @chenu/architectural-sphere
```

## Quick Start

```tsx
import {
  ArchitecturalProvider,
  PlanEditor,
  AvatarEditor,
  useArchitectural
} from '@chenu/architectural-sphere';

function App() {
  return (
    <ArchitecturalProvider>
      <MyArchitecturalUI />
    </ArchitecturalProvider>
  );
}
```

## Capabilities

| Capability | Description | Output |
|------------|-------------|--------|
| 🎨 Decor Design | Ambient visual environments | Decor presets |
| 👤 Avatar Design | Visual shells for agents/users | Avatar presets |
| 🏛️ Spatial Plans | Rooms, hubs, navigation flows | Plan layouts |
| 🧭 Navigation | Wayfinding, minimaps | Nav configs |
| 🌍 Environments | Domain-specific spaces | Environment packages |
| 🔒 Sandbox | Safe preview visualization | Preview renders |

## Forbidden Actions

These actions are **architecturally blocked**:

- ❌ Workflow control
- ❌ Logic modification
- ❌ Persuasion design
- ❌ Silent influence
- ❌ Permission grants
- ❌ Data authority

## Domain Enablement

The Architectural Sphere can be enabled per domain:

| Domain | Use Cases | Restrictions |
|--------|-----------|--------------|
| XR / Immersive | Full spatial environments | None |
| Scholar | Study spaces, visualization | No assessment influence |
| Institutions | Formal spaces | Audit visibility required |
| Creative | Design workspaces | None |
| Business | Presentations, meetings | No strategic influence |
| Personal | Personalization | User-controlled only |

## Plan Schema

```typescript
interface Plan {
  id: string;
  name: string;
  domain: 'personal' | 'business' | 'scholar' | 'xr' | 'institution' | 'creative';
  layout: 'room' | 'hub' | 'radial' | 'layered';
  dimension: '2d' | '3d' | 'xr';
  zones: Zone[];
  navigation: NavigationConfig;
  metadata: { created_at, created_by, version };
}
```

## Avatar Rules

```
Avatar = VISUAL SHELL ONLY

✓ Defines: presence, theme, role visibility
✗ Does NOT define: intelligence, permissions, data access
```

```typescript
interface Avatar {
  id: string;
  type: 'user' | 'agent' | 'system';
  name: string;
  visual: {
    style: 'abstract' | 'humanoid' | 'symbolic' | 'custom';
    primary_color: string;
    accent_color: string;
    glow: boolean;
    animation: 'idle' | 'active' | 'thinking' | 'none';
  };
  presence: {
    size: 'small' | 'medium' | 'large';
    opacity: number;
    aura_radius: number;
  };
  role_indicator: {
    visible: boolean;
    badge?: string;
    label?: string;
  };
}
```

## Export & Activation

Assets can be exported and shared between spheres:

```typescript
const pkg = await createExportPackage('plan', planId);
const result = await requestActivation(pkg, 'target-sphere');
```

Activation requires:
1. Target sphere approval
2. Schema validation
3. User confirmation
4. Compatibility check

## API Reference

### useArchitectural()

```typescript
const {
  // State
  state,
  
  // Plans
  addPlan,
  updatePlan,
  deletePlan,
  getPlan,
  setActivePlan,
  
  // Avatars
  addAvatar,
  updateAvatar,
  deleteAvatar,
  getAvatar,
  setActiveAvatar,
  
  // Domains
  enableDomain,
  disableDomain,
  isDomainEnabled,
  
  // Sandbox
  enterSandbox,
  exitSandbox,
  
  // Export
  createExportPackage,
  requestActivation,
} = useArchitectural();
```

### Components

- `<PlanEditor />` - Create/edit spatial plans
- `<AvatarEditor />` - Create/edit avatar shells
- `<PlanList />` - Display all plans
- `<AvatarList />` - Display all avatars
- `<DomainEnablement />` - Enable/disable domains

### Validators

```typescript
import { validatePlan, validateAvatar, checkForbiddenAction } from '@chenu/architectural-sphere';

const result = validatePlan(plan);
// { valid: boolean, errors: [...] }

const check = checkForbiddenAction('workflow_control');
// { action, allowed: false, reason: '...' }
```

## Ethics

The Architectural Sphere operates under strict ethical constraints:

- **No cognitive coercion** - Visuals cannot pressure users
- **No manipulation** - No dark patterns
- **Transparency required** - All changes are logged
- **Comfort first** - Design prioritizes calm and clarity

---

> *"The Architectural Sphere shapes the space. The space does not shape the rules."*

## License

MIT — CHE·NU Universal Cognitive Operating System
