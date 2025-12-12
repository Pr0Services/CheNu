# CHE·NU — Multi-Sphere & Individual vs Collective Comparative Narratives

## 📜 Overview

This system exists to describe how drift narratives **DIFFER** across:
- Multiple spheres
- Individual vs collective scales

Its sole purpose is to **expand perspective**.

## ⚠️ Critical Principles

```
┌─────────────────────────────────────────────────────────────┐
│  THIS IS AN OBSERVATIONAL COMPARISON LAYER                 │
│                                                             │
│  Authority: NONE                                            │
│  Intent: DESCRIPTIVE PERSPECTIVE ONLY                       │
│                                                             │
│  It NEVER:                                                  │
│  - Defines truth                                            │
│  - Ranks behavior                                           │
│  - Validates choices                                        │
│  - Suggests alignment                                       │
│                                                             │
│  Differences are described, not resolved.                   │
│  Similarity does not imply correctness.                     │
│  Truth is not computed — it is perceived.                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔀 Comparison Types

The system supports two comparison families:

| Family | Purpose |
|--------|---------|
| **Multi-Sphere** | Describe how drift unfolds across different spheres |
| **Individual vs Collective** | Describe how individual drift coexists with aggregated collective patterns |

These families may coexist but are **NEVER merged into a single evaluative conclusion**.

---

## 🔵 Family A: Multi-Sphere Comparative Narratives

### Purpose

Describe how drift unfolds across **DIFFERENT SPHERES** within the same timeframe or comparable phases.

### Valid Spheres

- Personal
- Creative
- Business
- Social
- Methodology
- Scholar
- Institutions
- XR / Spatial

### Structure

| Section | Description |
|---------|-------------|
| **Comparison Definition** | Spheres being compared with timeframes |
| **Shared Observations** | Patterns present across all compared spheres |
| **Divergent Observations** | Patterns unique to specific spheres |
| **Temporal Relationship** | concurrent, staggered, independent, overlapping |
| **Interpretation Boundary** | Explicit statement of non-causality |

### Example (Neutral)

```
During the same period,
exploration contexts increased in both Creative and Scholar spheres.

In the Business sphere,
context usage remained stable.

No inference is made regarding causality or intent.
```

### API Usage

```typescript
import { 
  generateMultiSphereNarrative,
  formatMultiSphereNarrative 
} from '@ui/drift';

const narrative = generateMultiSphereNarrative(
  [
    { sphere: 'creative', timeRange: { start: '2025-01-01', end: '2025-01-31' } },
    { sphere: 'business', timeRange: { start: '2025-01-01', end: '2025-01-31' } },
    { sphere: 'personal', timeRange: { start: '2025-01-01', end: '2025-01-31' } },
  ],
  'concurrent'
);

console.log(formatMultiSphereNarrative(narrative));
```

### React Component

```tsx
import { MultiComparativeNarrativeView } from '@ui/drift';

<MultiComparativeNarrativeView
  family="multi-sphere"
  spheres={['creative', 'business', 'personal']}
  showInterpretationBoundary={true}
/>
```

---

## 🔴 Family B: Individual vs Collective Comparative Narratives

### Purpose

Describe how an individual drift narrative **coexists** with an aggregated collective narrative.

### Participation Rules

| Rule | Description |
|------|-------------|
| **Opt-in** | Collective data is strictly opt-in |
| **Anonymized** | Fully anonymized |
| **Aggregated** | Aggregated only |
| **Minimum cohort** | Minimum cohort size enforced |

### Structure

| Section | Description |
|---------|-------------|
| **Individual Scope** | Timeframe, scope, observed drift patterns |
| **Collective Scope** | Timeframe, aggregation level, drift density patterns |
| **Areas of Convergence** | Where patterns appear in both |
| **Areas of Divergence** | Where patterns appear in one only |
| **Non-Conclusions** | What cannot be inferred |

### Example (Neutral)

```
During this timeframe,
the individual narrative showed increased decision-focused contexts.

In the collective aggregate,
exploratory contexts remained dominant.

These observations describe coexistence only.
No normative alignment is implied.
```

### API Usage

```typescript
import { 
  generateIndividualVsCollectiveNarrative,
  formatIndividualVsCollectiveNarrative 
} from '@ui/drift';

const narrative = generateIndividualVsCollectiveNarrative(
  { start: '2025-01-01', end: '2025-01-31' },
  'system-wide'
);

console.log(formatIndividualVsCollectiveNarrative(narrative));
```

### React Component

```tsx
import { MultiComparativeNarrativeView } from '@ui/drift';

<MultiComparativeNarrativeView
  family="individual-vs-collective"
  showNonConclusions={true}
/>
```

---

## 🗣️ Language & Semantic Safety

### ✅ Allowed Language

| Phrase |
|--------|
| "compared with" |
| "alongside" |
| "concurrently" |
| "independently" |
| "diverged in frequency" |
| "co-occurred" |
| "observed in both" |
| "unique to" |
| "present in" |
| "absent from" |

### ❌ Forbidden Language

| Phrase |
|--------|
| "above / below average" |
| "normal / abnormal" |
| "aligned / misaligned" |
| "ahead / behind" |
| "better / worse" |
| "correct / incorrect" |
| "should" |
| "optimal / suboptimal" |

---

## 🎨 Presentation Modes

Comparative narratives may be presented as:

| Mode | Description |
|------|-------------|
| **Side-by-side text** | Parallel text narratives |
| **Synchronized timelines** | Aligned timeline views |
| **Layered overlays** | Overlapped visual layers |
| **Split XR environments** | Parallel 3D spaces |
| **Static reports** | Printable comparison reports |

**All presentations must remain:**
- Optional
- Dismissible
- Non-prioritized

---

## 👤 User Interaction Rules

### User MAY:

- Select comparison pairs
- Adjust timescales
- Filter by sphere or scope
- Export narratives
- Annotate privately

### System MUST NOT:

- Suggest conclusions
- Highlight normative patterns
- Imply desirability
- Rank behaviors
- Merge into single evaluative conclusion

---

## 🥽 XR / Universe View

In XR environments:

| Element | Presentation |
|---------|-------------|
| Spheres | Appear as parallel environments |
| Individual vs Collective | Appear as layers |
| No blending | Into a single path |
| No convergence arrows | Ever |

**Spatial separation preserves interpretive freedom.**

---

## 🛡️ Failsafes

| Failsafe | Description |
|----------|-------------|
| Descriptive only | Comparisons never prescribe |
| No synthesis | Across scales |
| No automated conclusions | Summaries are neutral |
| Explicit request | Narratives cannot evolve without it |
| Non-conclusions visible | Always show what cannot be inferred |

---

## 📋 Non-Conclusions (Default)

When comparing individual vs collective, the following statements are always included:

```
✗ No normative alignment is implied.
✗ Similarity does not imply correctness.
✗ Divergence does not imply error.
✗ Patterns do not prescribe behavior.
✗ Comparison expands perspective only.

"Truth is not computed — it is perceived."
```

---

## 🔧 Complete API Reference

### Types

```typescript
// Multi-sphere types
type ComparableSphere =
  | 'personal' | 'creative' | 'business' | 'social'
  | 'methodology' | 'scholar' | 'institutions' | 'xr-spatial';

type TemporalRelationship =
  | 'concurrent' | 'staggered' | 'independent' | 'overlapping';

type AggregationLevel =
  | 'system-wide' | 'sphere-level' | 'context-level' | 'time-windowed';

interface MultiSphereScope {
  sphere: ComparableSphere;
  timeRange: { start: string; end: string };
  label?: string;
}

interface MultiSphereComparativeNarrative {
  id: string;
  family: 'multi-sphere';
  spheres: MultiSphereScope[];
  temporalRelationship: TemporalRelationship;
  sharedPatterns: MultiSpherePattern[];
  divergentPatterns: DivergentBySpere[];
  interpretationBoundary: string;
  summary: string;
}

interface IndividualVsCollectiveNarrative {
  id: string;
  family: 'individual-vs-collective';
  individual: IndividualDriftScope;
  collective: CollectiveDriftScope;
  convergence: AreasOfConvergence;
  divergence: AreasOfDivergence;
  nonConclusions: NonConclusionStatements;
  summary: string;
}
```

### Generators

```typescript
import {
  generateMultiSphereNarrative,
  generateIndividualVsCollectiveNarrative,
} from '@ui/drift';

// Multi-sphere
const multiNarrative = generateMultiSphereNarrative(
  sphereScopes,
  'concurrent'
);

// Individual vs Collective
const indVsCollNarrative = generateIndividualVsCollectiveNarrative(
  timeRange,
  'system-wide'
);
```

### Formatters

```typescript
import {
  formatMultiSphereNarrative,
  formatIndividualVsCollectiveNarrative,
} from '@ui/drift';

const multiText = formatMultiSphereNarrative(multiNarrative);
const indVsCollText = formatIndividualVsCollectiveNarrative(indVsCollNarrative);
```

### React Components

```tsx
import { MultiComparativeNarrativeView } from '@ui/drift';

// Multi-sphere
<MultiComparativeNarrativeView
  family="multi-sphere"
  spheres={['creative', 'business', 'personal']}
  presentationMode="side-by-side"
  showInterpretationBoundary={true}
/>

// Individual vs Collective
<MultiComparativeNarrativeView
  family="individual-vs-collective"
  showNonConclusions={true}
/>
```

### Hooks

```typescript
import {
  useMultiSphereNarrative,
  useIndividualVsCollectiveNarrative,
} from '@ui/drift';

// Multi-sphere
const multiNarrative = useMultiSphereNarrative(
  ['creative', 'business'],
  timeRange
);

// Individual vs Collective
const indVsCollNarrative = useIndividualVsCollectiveNarrative(timeRange);
```

---

## 📜 System Declaration

```
Comparative narratives exist to offer perspective,
not authority.

Differences are described, not resolved.
Similarity does not imply correctness.
Truth is not computed — it is perceived.

Clarity comes from visibility, not direction.

Context acknowledged. Authority unchanged.
```

---

## ✅ Summary

| System | Purpose | Authority |
|--------|---------|-----------|
| **Multi-Sphere Comparative** | Describe drift across spheres | NONE |
| **Individual vs Collective** | Describe individual/collective coexistence | NONE |

Both systems are **observational comparison layers**.

**Differences are described, not resolved.**  
**Similarity does not imply correctness.**  
**Truth is not computed — it is perceived.**

---

**Context acknowledged. Authority unchanged.** ✅

*CHE·NU — Governed Intelligence Operating System*
