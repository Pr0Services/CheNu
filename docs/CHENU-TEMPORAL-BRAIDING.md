# CHE·NU — Temporal Braiding System

## 📜 Overview

The Temporal Braiding System exists to visualize how **multiple timelines coexist** without being merged into a single authoritative sequence.

It answers **ONLY**:
> "How did these timelines unfold side by side?"

It **NEVER** answers:
> "What led to what."
> "What should have happened."

## ⚠️ Core Principles

```
┌─────────────────────────────────────────────────────────────┐
│  TEMPORAL BRAIDING SYSTEM                                   │
│                                                             │
│  Status: OBSERVATIONAL TEMPORAL LAYER                       │
│  Authority: NONE                                            │
│  Intent: MULTI-PERSPECTIVE TIME READING                     │
│                                                             │
│  No merge into:                                             │
│  - Decision logic                                           │
│  - Learning systems                                         │
│  - Orchestration                                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 🌊 Braiding Principle

Time is represented as **PARALLEL STRANDS**.

Each strand retains:
- Its own **origin**
- Its own **pace**
- Its own **uncertainty**

Strands are:
- **Visually adjacent**
- **Temporally aligned** when possible
- **Never collapsed into one**

---

## 🧵 Strand Types

| Type | Description |
|------|-------------|
| `preference-evolution` | How preferences changed over time |
| `context-usage` | Context patterns across time |
| `narrative-emergence` | When narratives appeared |
| `project-phase` | Project phase markers |
| `meeting-occurrence` | Meeting events |
| `decision-point` | Decision moments (read-only) |
| `drift-observation` | Drift observations |

**NO strand has priority.**

---

## 🎨 Visual Model

Each strand:
- Flows **independently**
- May **thicken** (activity density)
- May **thin** (stability or absence)

Overlaps indicate **coexistence**, NOT causation.

### Visual Rules

| Element | Rule |
|---------|------|
| **No arrows** | Never imply direction |
| **No branching** | Never imply outcome |
| **Thickness** | Density only, not importance |
| **Color** | Type only |

---

## 🎮 User Interaction Rules

### User MAY:

| Action | Effect |
|--------|--------|
| Enable/disable strands | Show/hide individual timelines |
| Align strands by timeframe | Compare periods |
| Zoom in/out | Focus on detail or overview |
| Pause at any moment | Inspect values |

### System MUST NOT:

| Forbidden | Reason |
|-----------|--------|
| Highlight "key moments" | No moment is more important |
| Propose interpretations | User interprets |
| Compress timelines automatically | Preserve all detail |

---

## 📐 Alignment Modes

| Mode | Description |
|------|-------------|
| `absolute` | Real timestamps |
| `relative` | Relative to each strand's start |
| `normalized` | 0-100% of each strand's duration |

---

## 🗣️ Language & Semantic Safety

### ✅ Allowed Terms

| Use These |
|-----------|
| concurrent |
| overlapping |
| adjacent |
| independent |
| staggered |
| simultaneous |
| parallel |
| coexisting |

### ❌ Forbidden Terms

| NEVER Use |
|-----------|
| before causing |
| after resulting in |
| leads to |
| consequence |
| because |
| therefore |
| triggered |
| caused by |

```typescript
// Validation function
function isTemporallyNeutral(text: string): boolean {
  const forbidden = ['leads to', 'caused by', 'triggered', 'consequence'];
  return !forbidden.some(f => text.toLowerCase().includes(f));
}
```

---

## 🥽 XR / Universe View

In XR mode:
- Strands appear as **flowing ribbons**
- User may **move between them**
- Depth represents **temporal distance**
- **Calm motion only**

### XR Configuration

```typescript
interface XRBraidingConfig {
  enabled: boolean;
  ribbonWidth: number;
  ribbonOpacity: number;
  depthScale: number;
  motionSpeed: 'calm' | 'very-calm';
  walkthroughEnabled: boolean;
  glowIntensity: number;
}
```

---

## 🛡️ Failsafes

| Failsafe | Enforced |
|----------|----------|
| No strand merging | ✅ |
| No automatic synthesis | ✅ |
| No inferred ordering | ✅ |
| No historical "correction" | ✅ |
| No key moment highlighting | ✅ |
| No proposed interpretations | ✅ |
| No automatic compression | ✅ |
| No arrows | ✅ |
| No branching implying outcome | ✅ |
| Calm motion only | ✅ |

---

## 💻 API Usage

### Create Strands

```typescript
import {
  createStrand,
  createPoint,
} from '@ui/temporal';

const strand = createStrand(
  'pref-strand',
  'preference-evolution',
  'Preferences',
  [
    createPoint('2024-01-01T00:00:00Z', { value: 'A' }, 'normal', 0.9),
    createPoint('2024-01-05T00:00:00Z', { value: 'B' }, 'thick', 0.85),
    createPoint('2024-01-10T00:00:00Z', { value: 'C' }, 'thin', 0.7),
  ],
  'preference-system'
);
```

### Generate Braiding

```typescript
import { generateBraiding } from '@ui/temporal';

const braiding = generateBraiding(strands, {
  alignmentMode: 'absolute',
  showOverlaps: true,
});

console.log(braiding.strands.length);
console.log(braiding.overlaps.length);
```

### Detect Overlaps

```typescript
import { detectOverlaps } from '@ui/temporal';

const overlaps = detectOverlaps(strands);

// All descriptions use NEUTRAL language
for (const overlap of overlaps) {
  console.log(overlap.description); // "concurrent", "overlapping", etc.
}
```

### Pause at Moment

```typescript
import { getPausedMoment } from '@ui/temporal';

const moment = getPausedMoment(braiding, '2024-01-05T12:00:00Z');

// Get values for each strand at this moment
for (const [strandId, point] of Object.entries(moment.strandValues)) {
  console.log(strandId, point?.label);
}
```

---

## 🎨 React Components

### Full View

```tsx
import { TemporalBraidingView } from '@ui/temporal';

<TemporalBraidingView
  strands={strands}
  width={800}
  height={500}
  onStrandToggle={(id, visible) => console.log(id, visible)}
  onPause={(moment) => console.log('Paused at:', moment.timestamp)}
/>
```

### Compact View

```tsx
import { TemporalBraidingCompact } from '@ui/temporal';

<TemporalBraidingCompact
  strands={strands}
  width={300}
  height={150}
/>
```

### Using the Hook

```tsx
import { useTemporalBraiding } from '@ui/temporal';

const {
  braiding,
  config,
  pausedMoment,
  toggleStrand,
  setAlignmentMode,
  zoomIn,
  zoomOut,
  pause,
  resume,
} = useTemporalBraiding(strands);
```

---

## 📐 Strand Type Colors

| Type | Color |
|------|-------|
| preference-evolution | 🟢 `#69db7c` |
| context-usage | 🔵 `#4dabf7` |
| narrative-emergence | 🟣 `#da77f2` |
| project-phase | 🟡 `#ffd43b` |
| meeting-occurrence | 🔴 `#ff6b6b` |
| decision-point | 🟢 `#20c997` |
| drift-observation | 🟠 `#fab005` |

---

## 📋 System Declaration

```
Temporal Braiding preserves plurality of time.

It shows that multiple evolutions
can coexist without hierarchy.

Time is observed, not resolved.

Context acknowledged. Authority unchanged.
```

---

## 🔧 Complete Type Reference

```typescript
// Strand
interface TemporalStrand {
  strandId: string;
  type: StrandType;
  name: string;
  color: string;
  points: TemporalPoint[];
  startTime: string;
  endTime: string;
  origin: string;
  visible: boolean;
  metadata?: Record<string, unknown>;
}

// Point
interface TemporalPoint {
  timestamp: string;
  value: unknown;
  density: StrandDensity;
  confidence: number;
  label?: string;
  uncertain?: boolean;
}

// Overlap
interface TemporalOverlap {
  strandA: string;
  strandB: string;
  overlapStart: string;
  overlapEnd: string;
  description: string; // NEUTRAL language only
}

// Braiding
interface TemporalBraiding {
  strands: TemporalStrand[];
  overlaps: TemporalOverlap[];
  config: BraidingConfig;
  metadata: {...};
  declaration: string;
}
```

---

## ✅ Summary

| Aspect | Status |
|--------|--------|
| Authority | NONE |
| Strand Merging | NEVER |
| Causation | NEVER implied |
| Hierarchy | NEVER |
| Key Moments | NEVER highlighted |
| User control | Full |

**Time is observed, not resolved.**

---

**Context acknowledged. Authority unchanged.** ✅

*CHE·NU — Governed Intelligence Operating System*
