# CHE·NU Architectural Agent System

> **Foundation v1.0**  
> Type: Design / Spatial / Visual (NON-DECISIONAL)  
> Status: **CANONICAL**

Architectural Agents **DESIGN SPACE**. They NEVER influence logic, decisions, behavior, or data authority.

## Global Principle

```
Architectural Agents:
• Observe → Propose → Export
• Nothing activates without approval
```

## Installation

```bash
npm install @chenu/architectural-agents
```

## Quick Start

```tsx
import {
  AgentSystemProvider,
  AgentSystemDashboard,
  useAgentSystem,
} from '@chenu/architectural-agents';

function App() {
  return (
    <AgentSystemProvider>
      <AgentSystemDashboard />
    </AgentSystemProvider>
  );
}
```

## Agent Set

| Agent | Role | Key Limits |
|-------|------|-----------|
| **Planner** | Spatial plans, zones, layouts | No workflow logic |
| **Decor Designer** | Themes, atmosphere, lighting | No psychological manipulation |
| **Avatar Architect** | Visual shells, presence | Avatar ≠ permissions |
| **Navigation Designer** | Maps, orientation, flows | No coercive flow |
| **Domain Adapter** | Domain compatibility | Cannot bypass domain laws |
| **Validation Guard** | Ethics & rule compliance | Report only |
| **Orchestrator** | Coordinate all agents | No approval authority |

## Using the Orchestrator

```typescript
import { ArchitectAgentOrchestrator } from '@chenu/architectural-agents';

// Create orchestrator
const orchestrator = new ArchitectAgentOrchestrator();

// Activate
orchestrator.activate('manual_request');

// Create and process request
const request = ArchitectAgentOrchestrator.createRequest(
  'full',      // type
  'xr',        // domain
  'Meeting',   // purpose
  { capacity: 20, theme: 'neutral', dimension: '3d' }
);

const bundle = await orchestrator.process(request);
// Orchestrator auto-deactivates after export
```

## Using Individual Agents

```typescript
import {
  ArchitectPlannerAgent,
  DecorDesignerAgent,
  AvatarArchitectAgent,
} from '@chenu/architectural-agents';

// Create agent
const planner = new ArchitectPlannerAgent();

// Activate
planner.activate();

// Process
const output = await planner.process({
  domain: 'xr',
  capacity: 10,
  purpose: 'Collaboration Hub',
});

// Deactivate
planner.deactivate();
```

## Using React Context

```tsx
import { useAgentSystem } from '@chenu/architectural-agents';

function MyComponent() {
  const {
    state,
    activate,
    deactivate,
    process,
    createRequest,
    isAgentActive,
  } = useAgentSystem();

  const handleGenerate = async () => {
    const request = createRequest('full', 'xr', 'Meeting Room');
    const bundle = await process(request);
    console.log(bundle);
  };

  return (
    <div>
      <p>Orchestrator: {state.orchestratorState}</p>
      <button onClick={handleGenerate}>Generate</button>
    </div>
  );
}
```

## Activation Lifecycle

```
OFF → Request → Active → Processing → Export → OFF
          ↑                              |
          └──────── Auto-deactivate ─────┘
```

Agents are:
- **OFF by default**
- Activated only by: manual request, scheduled review, domain activation
- **Auto-deactivate** after export

## Output Format

```typescript
interface ArchitecturalOutput<T> {
  type: 'plan' | 'decor' | 'avatar' | 'navigation';
  source_agent: ArchitecturalAgentId;
  domain: string;
  version: string;
  hash: string;
  requires_approval: true; // Always true
  created_at: string;
  payload: T;
}
```

## Bundle Format

```typescript
interface ArchitecturalBundle {
  bundle_id: string;
  plans: ArchitecturalOutput<PlanOutput>[];
  decors: ArchitecturalOutput<DecorOutput>[];
  avatars: ArchitecturalOutput<AvatarOutput>[];
  navigation: ArchitecturalOutput<NavigationOutput>[];
  version: string;
  hash: string;
  status: 'proposal_only'; // Always proposal only
  validation: {
    passed: boolean;
    validators: string[];
    errors?: string[];
  };
}
```

## Ethical Constraints

All agents operate under strict ethical constraints:

| Constraint | Implementation |
|------------|----------------|
| No emotional steering | Designs cannot manipulate mood |
| No cognitive pressure | No urgency cues, no FOMO |
| Transparency required | All decisions logged |
| Comfort > Spectacle | Wellbeing over impressiveness |
| Clarity > Immersion | Understanding over immersion |
| No hidden influence | No subliminal patterns |

## Forbidden Actions

Each agent has specific forbidden actions that will throw errors:

```typescript
// Planner
checkForbidden('workflow');     // ❌ Throws
checkForbidden('task_chain');   // ❌ Throws

// Avatar Architect  
checkForbidden('permission');   // ❌ Throws
checkForbidden('intelligence'); // ❌ Throws

// Orchestrator
checkForbidden('approval');     // ❌ Throws
checkForbidden('activate');     // ❌ Throws
```

## Components

- `<AgentSystemDashboard />` - Full dashboard UI
- `<OrchestratorStatus />` - Orchestrator state
- `<AgentGrid />` - All agents status
- `<RequestForm />` - Design request form
- `<BundleViewer />` - View generated bundles
- `<LogViewer />` - Activity log
- `<AgentCard />` - Individual agent display

---

> *"These agents give CHE·NU a body while preserving its conscience."*

## License

MIT — CHE·NU Universal Cognitive Operating System
