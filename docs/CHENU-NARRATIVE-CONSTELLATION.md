# CHE·NU — Narrative Constellation View

## 📜 Overview

The Narrative Constellation View exists to visualize how multiple drift narratives **coexist, relate, and evolve** within the CHE·NU system.

It answers **ONLY**:
> "How are narratives positioned relative to each other?"

It **NEVER** answers:
> "Which narrative is dominant."
> "Which direction should be followed."

## ⚠️ Core Principles

```
┌─────────────────────────────────────────────────────────────┐
│  NARRATIVE CONSTELLATION VIEW                               │
│                                                             │
│  Status: OBSERVATIONAL VISUALIZATION                        │
│  Authority: NONE                                            │
│  Intent: STRUCTURED PERCEPTION ONLY                         │
│                                                             │
│  No connection to:                                          │
│  - Learning systems                                         │
│  - Orchestration                                            │
│  - Decision-making                                          │
│  - Execution agents                                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 🌌 Constellation Principle

Each narrative is represented as a **NODE** in a space.

Relationships are represented as **PROXIMITIES or LINKS**, not as causality.

### Constellation EXPRESSES:

| ✅ Allowed |
|-----------|
| Coexistence |
| Alignment or distance |
| Temporal adjacency |

### Constellation does NOT EXPRESS:

| ❌ Forbidden |
|-------------|
| Hierarchy |
| Correctness |
| Evolution direction |
| Importance |

---

## 🔵 Node Definition

```typescript
interface NarrativeNode {
  narrativeId: string;
  scope: "individual" | "collective" | "sphere";
  timeframe: TimeRange;
  driftTypes: DriftType[];
  confidence: 0.0 - 1.0;
  visibility: "public" | "private";
}
```

### Node Visual Rules

| Property | Meaning |
|----------|---------|
| **Size** | Reflects narrative duration (NOT importance) |
| **Color** | Reflects scope ONLY |
| **Opacity** | Reflects confidence level |
| | **NO ranking indicators** |

---

## 🔗 Relationship Model

Relationships are **VISUAL**, not analytical.

### Allowed Relationship Types

| Type | Meaning |
|------|---------|
| `proximity` | Shared context or timeframe |
| `temporal-overlap` | Overlapping time periods |
| `shared-drift-types` | Same drift categories |
| `sphere-adjacent` | Same or related spheres |

### Explicitly NOT Represented

| ❌ Never Show |
|--------------|
| Dependency |
| Influence |
| Causation |
| Progression |

---

## 🎮 User Interaction Rules

### User MAY:

- Pan and zoom
- Filter by scope, timeframe, sphere
- Select nodes to read narratives
- Toggle comparative overlays

### User MUST:

- Actively select interpretation
- **Never receive conclusions**

---

## 📐 Layout Modes

Layouts are **VIEW OPTIONS**, not interpretations.

| Layout | Description |
|--------|-------------|
| `spatial` | Free constellation |
| `clustered` | Grouped by context |
| `layered` | Layered by timeframe |
| `sphere-separated` | Separate planes per sphere |

---

## 🗣️ Language & Semantic Safety

### Allowed Labels

| ✅ Use These |
|-------------|
| near |
| distant |
| concurrent |
| overlapping |
| isolated |
| adjacent |
| separate |
| coexisting |

### Forbidden Labels

| ❌ NEVER Use |
|-------------|
| central |
| peripheral |
| dominant |
| influential |
| aligned |
| leading |
| following |
| important |
| primary |
| secondary |

```typescript
// Validation function
function isAllowedLabel(label: string): boolean {
  const forbidden = ['central', 'peripheral', 'dominant', 'influential', 'aligned'];
  return !forbidden.some(f => label.toLowerCase().includes(f));
}
```

---

## 🥽 XR / Universe View

In XR mode:
- Narratives appear as **floating points or stars**
- Proximity is **spatial, not directional**
- Slow transitions only
- **No arrows, no flow lines**
- User may walk THROUGH the constellation

### XR Configuration

```typescript
interface XRConstellationConfig {
  enabled: boolean;
  starStyle: 'point' | 'sphere' | 'glow';
  scale: number;
  ambientLight: number;
  walkthroughEnabled: boolean;
  transitionSpeed: 'slow' | 'very-slow';
}
```

---

## 🛡️ Failsafes

| Failsafe | Enforced |
|----------|----------|
| View is read-only | ✅ |
| No auto-centering on any narrative | ✅ |
| No highlighted "paths" | ✅ |
| No optimization suggestions | ✅ |
| Slow transitions only | ✅ |
| No arrows | ✅ |
| No flow lines | ✅ |

---

## 💻 API Usage

### Generate Constellation

```typescript
import {
  generateConstellation,
  type DriftNarrative,
} from '@ui/drift';

const narratives: DriftNarrative[] = [...];

const constellation = generateConstellation(narratives, {
  layout: 'spatial',
  showRelationships: true,
  showLabels: true,
});

console.log(constellation.nodes.length);
console.log(constellation.relationships.length);
```

### Find Nearby Nodes

```typescript
import { findNearbyNodes } from '@ui/drift';

const nearby = findNearbyNodes(constellation, nodeId, maxDistance);

// Uses ALLOWED language only
for (const n of nearby) {
  console.log(n.relationship); // 'near', 'adjacent', 'distant'
}
```

### XR Conversion

```typescript
import { toXRConstellation } from '@ui/drift';

const xrNodes = toXRConstellation(constellation);

for (const node of xrNodes) {
  console.log(node.position3D); // { x, y, z }
  console.log(node.brightness);
  console.log(node.pulseRate); // Always slow
}
```

---

## 🎨 React Components

### Full View

```tsx
import { NarrativeConstellationView } from '@ui/drift';

<NarrativeConstellationView
  narratives={narratives}
  initialLayout="spatial"
  width={800}
  height={600}
  onNodeSelect={(node) => console.log('Selected:', node)}
/>
```

### Compact View

```tsx
import { NarrativeConstellationCompact } from '@ui/drift';

<NarrativeConstellationCompact
  narratives={narratives}
  width={300}
  height={200}
/>
```

### Using the Hook

```tsx
import { useConstellation } from '@ui/drift';

const {
  constellation,
  config,
  selectedNode,
  nearbyNodes,
  setLayout,
  toggleRelationships,
} = useConstellation(narratives);
```

---

## 📐 Scope Colors

| Scope | Color |
|-------|-------|
| session | 🟢 `#69db7c` |
| project | 🔵 `#4dabf7` |
| sphere | 🟣 `#da77f2` |
| global | 🟡 `#ffd43b` |

---

## 📋 System Declaration

```
The Narrative Constellation View exists to expand
the field of perception.

It maps narratives as they are,
not as they should be.

Clarity emerges from relational visibility,
not guidance.

Context acknowledged. Authority unchanged.
```

---

## 🔧 Complete Type Reference

```typescript
// Node
interface NarrativeNode {
  narrativeId: string;
  scope: NarrativeScope;
  timeframe: TimeRange;
  driftTypes: DriftType[];
  confidence: number;
  visibility: NarrativeVisibility;
  sphereId?: string;
  narrative?: DriftNarrative;
  position?: { x: number; y: number; z?: number };
  visual?: { size: number; color: string; opacity: number };
}

// Relationship
interface NarrativeRelationship {
  sourceId: string;
  targetId: string;
  type: RelationshipType;
  strength: number;
  description: string;
}

// Constellation
interface NarrativeConstellation {
  nodes: NarrativeNode[];
  relationships: NarrativeRelationship[];
  config: ConstellationConfig;
  metadata: {
    totalNarratives: number;
    overallTimeRange: TimeRange;
    scopesRepresented: NarrativeScope[];
    spheresRepresented: string[];
    generatedAt: string;
  };
  declaration: string;
}
```

---

## ✅ Summary

| Aspect | Status |
|--------|--------|
| Authority | NONE |
| Execution | ZERO |
| Purpose | Perception expansion |
| Causality | NEVER implied |
| Hierarchy | NEVER shown |
| User control | Full |

**Clarity emerges from relational visibility, not guidance.**

---

**Context acknowledged. Authority unchanged.** ✅

*CHE·NU — Governed Intelligence Operating System*
