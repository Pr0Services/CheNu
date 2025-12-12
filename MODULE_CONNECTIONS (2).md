# CHE·NU — MODULE CONNECTIONS MAP

## 📊 Vue d'ensemble

```
                    ┌─────────────────────┐
                    │    UNIVERSE VIEW    │
                    │   (Point d'entrée)  │
                    └──────────┬──────────┘
                               │
         ┌─────────────────────┼─────────────────────┐
         │                     │                     │
         ▼                     ▼                     ▼
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│  ARCHITECTURAL  │   │   XR SYSTEMS    │   │   KNOWLEDGE     │
│    SPHERE       │   │                 │   │   THREADS       │
└────────┬────────┘   └────────┬────────┘   └────────┬────────┘
         │                     │                     │
         │            ┌────────┴────────┐            │
         │            │                 │            │
         ▼            ▼                 ▼            ▼
┌─────────────┐  ┌─────────┐     ┌─────────┐  ┌─────────────┐
│   AVATAR    │  │   XR    │     │   XR    │  │ COLLECTIVE  │
│  EVOLUTION  │  │ MEETING │     │ REPLAY  │  │   MEMORY    │
└─────────────┘  └─────────┘     └─────────┘  └─────────────┘
```

## 🔗 Connexions Détaillées

### Universe View
- **Importe**: Spheres, Agents, Menu, Navigation
- **Exporté par**: `frontend/src/views/UniverseView.tsx`
- **Dépendances**: 
  - `state/sphereStore`
  - `components/universe/UniverseView`
  - `hooks/useNavigation`

### Architectural Sphere
- **Importe**: Avatar, Decor, Plans
- **Exporté par**: `packages/architectural-sphere`
- **Dépendances**:
  - `avatar-evolution`
  - `decor-system`
  - `governance` (pour les règles)

### XR Systems
- **XR Presets** → utilisé par XR Meeting, XR Replay
- **XR Meeting** → utilise Avatar, Decor, Recording
- **XR Replay** → utilise Knowledge Threads, Comparison
- **XR Comparison** → utilise 2x Replay instances

### Knowledge Threads
- **Types**: Factual, Decision, Context, Temporal, Conceptual, Collective, Evolution
- **Utilisé par**: Replay, Universe View, Collective Memory
- **Garanties**: blindspot-audit.ts
- **Continuité**: continuity-prompt.ts

### Collective Memory
- **Importe**: Knowledge Threads, Personal Navigation
- **Exporté par**: `packages/collective-memory`
- **Règles**: Append-only, Hash verified

### Governance
- **Contient**: Core Laws, Law Engine, Ethics
- **Utilisé par**: TOUS les modules
- **Règle absolue**: Non-manipulation

### Multi-Agents
- **Types**: Methodology, Routing, Architectural, Thread
- **Orchestration**: Suggestion-only, jamais décisionnel
- **Guards**: Validation pre/post

### Avatar Evolution
- **États**: Base → Structural → Contextual → Mastery
- **Utilisé par**: XR Meeting, Architectural Sphere
- **Règle**: Informatif seulement, pas de scoring

### Decor System
- **Presets**: Neutral, Organic, Cosmic, Focus, XR
- **Appliqué à**: Spheres, Meeting Rooms
- **Règle**: Ambiance, pas influence

### Menu Engine
- **Navigation**: Contextual, adaptative
- **Source**: User preferences, NOT AI suggestions
- **Override**: Toujours disponible

## 🛡️ Garanties Système

| Module | Garantie |
|--------|----------|
| Knowledge Threads | No inference, no ranking |
| Collective Memory | Immutable, append-only |
| Avatar | Informational evolution only |
| Routing | Suggestion-only |
| Governance | Non-manipulation enforced |
| XR | Comfort locks enabled |

## 📁 Structure des Imports

```typescript
// Depuis packages
import { ThreadType } from '@chenu/knowledge-threads';
import { AvatarState } from '@chenu/avatar-evolution';
import { MeetingMode } from '@chenu/xr-meeting';

// Depuis frontend/src
import { useSphereStore } from '@/state';
import { UniverseView } from '@/views';
import { MenuEngine } from '@/components';
```

---

**Mis à jour**: 2024-12-10
**Version**: Integration v1.0
