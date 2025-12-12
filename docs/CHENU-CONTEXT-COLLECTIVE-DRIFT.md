# CHE·NU — Context Drift & Collective Drift Systems

## 📜 Overview

These observational systems exist to make CHANGE visible at the level of:
- **Context usage patterns** (individual)
- **Collective behavior tendencies** (aggregated, opt-in)

They are designed for **awareness, reflection, and understanding**.

They are **NOT** designed for:
- Correction
- Optimization
- Enforcement
- Prediction

## ⚠️ Critical Principles

```
┌─────────────────────────────────────────────────────────────┐
│  THESE ARE OBSERVATIONAL SYSTEMS                           │
│                                                             │
│  Authority: NONE                                            │
│  Execution Power: ZERO                                      │
│                                                             │
│  No data flows BACK into:                                   │
│  - Orchestrator                                             │
│  - Decision engine                                          │
│  - Execution agents                                         │
│                                                             │
│  Patterns do not imply prescriptions.                       │
│  Change does not imply correction.                          │
│  Awareness remains human.                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔍 System 1: Context Drift Detector

### Purpose

Detect shifts in **HOW contexts are being selected**, not WHAT actions are taken.

### Position in Architecture

```
Context Interpreter
        ↓
Context Usage Records
        ↓
CONTEXT DRIFT DETECTOR
        ↓
Context Drift Reports
        ↓
Human Awareness ONLY
```

### Observed Signals (ONLY)

| Signal | Description |
|--------|-------------|
| Frequency | How often a context type is used |
| Duration | Time spent in each context |
| Transitions | Movement between contexts |
| Depth | Nested context levels |

### NOT Observed

- ❌ Intent validity
- ❌ Decision quality
- ❌ User correctness

### Context Types

```typescript
type ContextType =
  | 'exploration'
  | 'decision'
  | 'documentation'
  | 'validation'
  | 'refinement'
  | 'collaboration'
  | 'review'
  | 'planning'
  | 'execution'
  | 'reflection';
```

### Data Model

```typescript
interface ContextDriftReport {
  contextType: ContextType;
  scope: 'session' | 'project' | 'sphere' | 'global';
  driftDetected: boolean;
  magnitude: 'low' | 'medium' | 'high';
  direction: string;
  confidence: 0.0 - 1.0;
  comparisonWindows: {
    historical: number;
    recent: number;
  };
  timestamp: ISODate;
  recommendation: 'inform-only';
}
```

### API Usage

```typescript
import { contextDriftDetector } from '@core/agents';

// Track context usage
contextDriftDetector.enterContext('exploration');
// ... user works ...
contextDriftDetector.exitContext();

// Analyze drift
const result = contextDriftDetector.analyze();

console.log(result.summary);
// {
//   totalContextsAnalyzed: 10,
//   driftsDetected: 2,
//   highMagnitude: 0,
//   mediumMagnitude: 1,
//   lowMagnitude: 1,
//   stable: 8
// }
```

---

## 🌐 System 2: Collective Drift Overlay

### Purpose

Reveal high-level patterns across multiple users **WITHOUT identifying individuals**.

### Participation Rules

| Rule | Description |
|------|-------------|
| **Opt-in** | Strictly opt-in only |
| **Anonymized** | User IDs hashed before any processing |
| **Aggregated** | Only aggregated data ever visible |
| **Minimum cohort** | Cells only visible if ≥5 participants |
| **No traceability** | Cannot identify individual users |
| **No inference** | No cross-user inference allowed |

### Position in Architecture

```
Context Drift Detector (individual)
        ↓
Anonymized Contributions (opt-in)
        ↓
COLLECTIVE DRIFT OVERLAY
        ↓
Aggregated Patterns
        ↓
Human Awareness ONLY
```

### Data Model

```typescript
interface CollectiveDriftCell {
  contextType: ContextType;
  sphere?: SphereID;
  timeWindow: TimeRange;
  driftDensity: 'low' | 'medium' | 'high';
  participantCount: number;
  cohortThresholdMet: boolean;
}

interface CollectiveDriftOverlay {
  cells: CollectiveDriftCell[];
  summary: {
    totalParticipants: number;
    timeRange: TimeRange;
    spheresCovered: string[];
    contextsCovered: ContextType[];
  };
  atmosphere: {
    overallDensity: DriftMagnitude;
    dominantContext: ContextType | null;
    evolutionTrend: 'increasing' | 'decreasing' | 'stable';
  };
  privacyGuarantee: string;
}
```

### API Usage

```typescript
import { collectiveDriftOverlay } from '@core/agents';

// User opts in
collectiveDriftOverlay.optIn('user-123');

// Contribute data (anonymized automatically)
collectiveDriftOverlay.contribute(
  'user-123',
  'exploration',
  0.5,  // frequency
  30000 // duration
);

// Generate overlay
const overlay = collectiveDriftOverlay.generateOverlay();

console.log(overlay.summary.totalParticipants);
console.log(overlay.atmosphere.dominantContext);
```

---

## 🎨 System 3: Drift + Context Overlay

### Purpose

Visually correlate preference evolution WITH the operational context in which those preferences were expressed.

This answers ONLY one question:
> "In which contexts did change occur?"

It **NEVER** answers:
> "What should be done?"

### Position in Architecture

```
Preference Observer
        ↓
Preference Drift Detector
        ↓
Drift Reports
        ↓
Context Interpreter
        ↓
DRIFT + CONTEXT OVERLAY
        ↓
Human Awareness ONLY
```

### Overlay Principle

Drift data and Context data remain **SEPARATE systems**.

**Overlay means:**
- Visual alignment
- Temporal correlation
- Spatial correlation

**Overlay NEVER means:**
- Causal inference
- Optimization
- Recommendation

### Representations

#### A) Timeline Overlay

```
Timeline showing drift points layered on context timeline.

Example observations:
- Drift spike during "exploration-first" contexts
- Stability during "documentation-only" contexts

RULE: Overlay reveals correlation ONLY.
```

#### B) Heatmap Overlay

```
         │ LOW DRIFT │ MEDIUM │ HIGH
─────────┼───────────┼────────┼─────
explor.  │    3      │   5    │  2
decision │    7      │   1    │  0
document │    8      │   2    │  0

RULE: Overlay shows coexistence, not causation.
```

### UI Component

```tsx
import { DriftContextOverlay } from '@ui/drift';

<DriftContextOverlay
  showTimeline={true}
  showHeatmap={true}
  sphereFilter="creative"
  timeRangeDays={30}
/>
```

---

## 🗣️ Language & Visual Safety

### Allowed Descriptors

| ✅ Allowed |
|-----------|
| "observed together" |
| "co-occurred" |
| "present during" |
| "frequent in context" |
| "observed more frequently" |
| "observed less frequently" |
| "remained stable" |

### Forbidden Descriptors

| ❌ Forbidden |
|-------------|
| "caused by" |
| "leads to" |
| "results in" |
| "should avoid" |
| "better than" |
| "recommended practice" |

### Visual Rules

- ❌ No arrows implying causality
- ❌ No warning colors
- ❌ No ranking
- ❌ No gamification
- ❌ No urgency signaling
- ✅ Slow, ambient transitions only

---

## 🥽 XR / Universe View

In XR views:
- Contexts appear as **zones or layers**
- Drift appears as **temperature or motion**
- Collective patterns appear as **shared atmospheres**

### XR Rules

| Rule | Description |
|------|-------------|
| No gamification | No points, scores, or achievements |
| No urgency | No flashing, pulsing, or alerts |
| Ambient only | Slow, calm transitions |
| Dismissible | User can hide at any time |

---

## 🛡️ Failsafes

| Failsafe | Description |
|----------|-------------|
| Read-only | Overlay cannot modify any data |
| No automation | Cannot trigger automated actions |
| Optional | User can toggle on/off |
| Dismissible | User can hide permanently |
| Neutral session | Privacy mode disables history |
| Pause on ambiguity | If unclear, show raw data only |

---

## 📋 System Declaration

```
Context Drift and Collective Drift exist to help
humans understand HOW systems evolve,
not HOW they should act.

Patterns do not imply prescriptions.
Change does not imply correction.
Awareness remains human.

Context acknowledged. Authority unchanged.
```

---

## 🔧 Complete API Reference

### Context Drift Detector

```typescript
// Import
import { 
  contextDriftDetector,
  ContextDriftDetectorAgent,
  formatContextDriftReport,
  CONTEXT_DRIFT_DETECTOR_SYSTEM_PROMPT,
  ALL_CONTEXT_TYPES,
} from '@core/agents';

// Track contexts
contextDriftDetector.enterContext('exploration', {
  scope: 'project',
  sphereId: 'creative',
});
contextDriftDetector.exitContext();

// Analyze
const result = contextDriftDetector.analyze({
  scope: 'sphere',
  sphereId: 'creative',
  contextTypes: ['exploration', 'decision'],
  historicalWindowDays: 30,
  recentWindowDays: 7,
});

// Get signals for overlay
const signals = contextDriftDetector.getContextSignals();
```

### Collective Drift Overlay

```typescript
// Import
import {
  collectiveDriftOverlay,
  CollectiveDriftOverlayGenerator,
  formatCollectiveOverlay,
  COLLECTIVE_DRIFT_OVERLAY_SYSTEM_PROMPT,
  PRIVACY_GUARANTEE,
} from '@core/agents';

// Opt in/out
collectiveDriftOverlay.optIn('user-id');
collectiveDriftOverlay.optOut('user-id');

// Contribute (only if opted in)
collectiveDriftOverlay.contribute(
  'user-id',
  'exploration',
  0.5,
  30000,
  'creative'
);

// Generate overlay
const overlay = collectiveDriftOverlay.generateOverlay();

// Filter by sphere or context
const creativeCells = collectiveDriftOverlay.getCellsBySphere('creative');
const explorationCells = collectiveDriftOverlay.getCellsByContext('exploration');
```

### UI Components

```tsx
import {
  DriftContextOverlay,
  useDriftContextOverlay,
} from '@ui/drift';

// Full overlay
<DriftContextOverlay
  showTimeline={true}
  showHeatmap={true}
  sphereFilter="creative"
  onCellClick={(ctx, mag) => console.log(ctx, mag)}
/>

// Hook for custom UI
const { overlayData, heatmapCells, contextDriftResult } = useDriftContextOverlay({
  sphereFilter: 'creative',
  timeRangeDays: 30,
});
```

---

## ✅ Summary

| System | Purpose | Authority |
|--------|---------|-----------|
| Context Drift Detector | Detect context usage shifts | NONE |
| Collective Drift Overlay | Aggregate patterns (opt-in) | NONE |
| Drift + Context Overlay | Visualize correlations | NONE |

All systems are **observational only**.

**Correlation does not imply causation.**  
**Visibility does not imply correction.**  
**Awareness does not imply obligation.**

---

**Context acknowledged. Authority unchanged.** ✅

*CHE·NU — Governed Intelligence Operating System*
