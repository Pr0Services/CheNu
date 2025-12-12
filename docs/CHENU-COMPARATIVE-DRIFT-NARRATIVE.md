# CHE·NU — Comparative Drift Narrative System

## 📜 Core Intent

The Comparative Drift Narrative exists to describe **DIFFERENCES and SIMILARITIES** between two or more drift narratives over a defined scope or timeframe.

It answers only:
> "What changed here compared to there?"

**It NEVER answers:**
- ❌ "Which is better."
- ❌ "Which is correct."
- ❌ "What should be followed."

## ⚠️ Critical Principle

```
┌─────────────────────────────────────────────────────────────┐
│  COMPARATIVE DRIFT NARRATIVES                              │
│                                                             │
│  Status: OBSERVATIONAL COMPARISON                          │
│  Authority: NONE                                           │
│  Intent: DESCRIPTIVE CLARITY ONLY                          │
│                                                             │
│  Shows differences without hierarchy.                      │
│  Variation without value.                                  │
│  Change without judgment.                                  │
│                                                             │
│  Understanding remains human.                              │
│  Meaning remains human.                                    │
│  Truth emerges from clarity, not direction.                │
└─────────────────────────────────────────────────────────────┘
```

## 🏗️ Position in Architecture

```
Drift Narrative (Individual / Context / Collective)
        │
        ▼
┌───────────────────────────────┐
│ COMPARATIVE DRIFT NARRATIVE   │
│                               │
│ - Compare validated sources   │
│ - Find shared patterns        │
│ - Find divergent patterns     │
│ - Analyze temporal alignment  │
│ - State boundaries explicitly │
└───────────────────────────────┘
        │
        ▼
Human Reading ONLY

NO FEEDBACK LOOP INTO:
- learning systems
- preference models
- orchestration
- agents
```

## 📊 Comparison Axes

| Axis | Description | Example |
|------|-------------|---------|
| `time` | Period A vs Period B | Last week vs this week |
| `scope` | Sphere vs Sphere | Global vs Project |
| `context` | Exploration vs Decision | Different working modes |
| `population` | Individual vs Collective | Your patterns vs anonymized aggregate |
| `project` | Early vs Late phases | Project kickoff vs completion |

**Each axis must be declared explicitly.**

## 📋 Source Requirements

Comparisons may be created ONLY from:
- ✅ Validated drift narratives
- ✅ Identical data schemas
- ✅ Comparable time windows

**Prohibited:**
- ❌ No normalization to hide differences
- ❌ No scoring
- ❌ No ranking

## 🔧 Structure of a Comparative Narrative

```typescript
interface ComparativeDriftNarrative {
  // A) Comparison Definition
  definition: {
    narrativeA: DriftNarrativeSource;
    narrativeB: DriftNarrativeSource;
    axis: ComparisonAxisDefinition;
  };

  // B) Shared Observations
  sharedObservations: SharedObservation[];

  // C) Divergent Observations
  divergentObservations: DivergentObservation[];

  // D) Temporal Alignment
  temporalAlignment: TemporalAlignment;

  // E) Interpretation Boundaries
  interpretationBoundaries: InterpretationBoundary[];

  // Summary
  narrativeSummary: string;
}
```

### Example Output (Neutral)

```
"During the same period,
both contexts showed increased use of exploratory modes.

However, in Sphere A,
this increase appeared earlier and lasted longer,
while Sphere B returned to documentation-focused contexts
after a shorter duration.

No causal relationship can be inferred.
These observations describe coexistence only."
```

## 📝 Language Rules

### Allowed Terms

| Term | Usage |
|------|-------|
| `in contrast to` | Comparing differences |
| `similarly` | Noting similarities |
| `concurrently` | Same time |
| `diverged in frequency` | Different rates |
| `coincided temporally` | Time overlap |
| `both showed` | Shared pattern |
| `while` | Contrasting |
| `however` | Introducing difference |
| `appeared earlier/later` | Temporal sequence |
| `lasted longer/shorter` | Duration |
| `coexistence` | Co-occurrence |

### Forbidden Terms

| Term | Why Forbidden |
|------|---------------|
| `led to` | Implies causation |
| `resulted in` | Implies causation |
| `outperformed` | Implies ranking |
| `indicates superiority` | Implies value judgment |
| `reflects better judgment` | Implies evaluation |
| `caused` | Implies causation |
| `because of` | Implies causation |
| `therefore` | Implies logical conclusion |
| `proves` | Implies certainty |
| `should follow` | Implies recommendation |

### Validation

```typescript
import { validateComparativeLanguage } from '@ui/drift';

const result = validateComparativeLanguage(
  'Sphere A outperformed Sphere B'
);
// { valid: false, forbiddenFound: ['outperformed'] }

const result2 = validateComparativeLanguage(
  'Sphere A showed variation concurrently with Sphere B'
);
// { valid: true, forbiddenFound: [] }
```

## 🎨 Presentation Modes

| Mode | Description |
|------|-------------|
| `side_by_side` | Side-by-side text panels |
| `aligned_timeline` | Aligned timelines |
| `layered_overlay` | Layered overlays |
| `split_xr` | Split XR environments |
| `static_report` | Static PDF/text report |

**Presentation must remain:**
- ✅ Calm
- ✅ Neutral
- ✅ Optional (dismissible)

## 🎮 User Interaction Rules

### User MAY

- ✅ Choose narratives to compare
- ✅ Adjust time windows
- ✅ Export comparison
- ✅ Annotate privately
- ✅ Change presentation mode
- ✅ Dismiss

### System MUST NOT

- ❌ Recommend interpretations
- ❌ Highlight conclusions
- ❌ Frame outcomes
- ❌ Suggest preferences
- ❌ Rank narratives

## 🥽 XR / Universe View

In XR:
- Narratives appear as **parallel paths**
- **NO convergence arrows**
- **NO color suggesting direction**

```typescript
const xrConfig: XRComparativeConfig = {
  type: 'parallel_paths',
  convergenceArrows: false,  // NEVER
  directionalColor: false,   // NEVER
  spatialMode: 'coexistence', // NOT competition
};
```

**Comparison is spatial coexistence, not competition.**

## 🛡️ Failsafes

| Failsafe | Description |
|----------|-------------|
| **Read-only** | Comparisons cannot modify data |
| **Intact sources** | All narratives remain unaltered |
| **No scoring** | No composite scoring |
| **No synthesis** | No synthesis into recommendation |

## 🔌 API Usage

### Generate Comparison

```typescript
import {
  generateComparativeNarrative,
  createNarrativeSourceFromDetector,
} from '@ui/drift';

// Create sources
const sourceA = createNarrativeSourceFromDetector('Global scope', 'global');
const sourceB = createNarrativeSourceFromDetector('Project scope', 'project');

// Generate comparison
const narrative = generateComparativeNarrative(sourceA, sourceB, {
  type: 'scope',
  axisALabel: 'Global',
  axisBLabel: 'Project',
});

console.log(narrative.narrativeSummary);
```

### Quick Scope Comparison

```typescript
import { compareScopeDrift } from '@ui/drift';

const narrative = compareScopeDrift(
  'Global',
  'global',
  'Sphere',
  'sphere',
  30  // days
);
```

### Format for Export

```typescript
import { formatComparativeNarrative } from '@ui/drift';

const formatted = formatComparativeNarrative(narrative);
console.log(formatted);
```

## 🎨 UI Components

### Full View

```tsx
import { ComparativeNarrativeView } from '@ui/drift';

<ComparativeNarrativeView
  initialMode="side_by_side"
  config={{
    showBoundaries: true,
    showTemporalAlignment: true,
  }}
  onExport={(narrative) => {
    console.log('Exported:', narrative);
  }}
/>
```

### Compact View

```tsx
import { ComparativeNarrativeCompact } from '@ui/drift';

<ComparativeNarrativeCompact narrative={narrative} />
```

## 📋 Interpretation Boundaries

Every comparative narrative includes explicit statements of what **cannot be concluded**:

```typescript
const DEFAULT_INTERPRETATION_BOUNDARIES = [
  {
    id: 'no-causation',
    cannotConclude: 'Causal relationships between narratives',
    reason: 'Correlation does not imply causation',
  },
  {
    id: 'no-superiority',
    cannotConclude: 'Which narrative is superior or better',
    reason: 'Comparisons describe differences, not value',
  },
  {
    id: 'no-prediction',
    cannotConclude: 'Future behavior based on past patterns',
    reason: 'Past observations do not guarantee future outcomes',
  },
  {
    id: 'no-recommendation',
    cannotConclude: 'Which approach should be followed',
    reason: 'System provides observation only, not guidance',
  },
];
```

## 📁 Files

```
src/ui/drift/
├── comparativeNarrative.types.ts    # Types and constants
├── comparativeNarrativeEngine.ts    # Generation engine
├── ComparativeNarrativeView.tsx     # UI components
└── index.ts                         # Exports
```

## 📜 System Declaration

```
Comparative Drift Narratives exist to expand perspective,
not to define truth.

They show differences without hierarchy,
variation without value,
change without judgment.

Understanding remains human.
Meaning remains human.
Truth emerges from clarity, not direction.
```

---

**Context acknowledged. Authority unchanged.** ✅

*CHE·NU — Governed Intelligence Operating System*
