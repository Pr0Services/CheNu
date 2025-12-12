# CHE·NU — Drift Visualization System

## 📜 Purpose

The Drift Visualization System exists to make preference evolution **VISIBLE, NOT CORRECTED**.

It is designed to:
- Surface change without judgment
- Show direction without prediction
- Preserve user sovereignty
- Avoid silent adaptation

**This system NEVER triggers actions.**

## ⚠️ Critical Principle

```
┌─────────────────────────────────────────────────────────────┐
│  DRIFT VISUALIZATION IS INFORMATIONAL ONLY                 │
│                                                             │
│  This system exists to help the user SEE change,           │
│  not to influence it.                                       │
│                                                             │
│  Drift visibility does not imply action.                   │
│  Human awareness remains the only authority.               │
└─────────────────────────────────────────────────────────────┘
```

## 🏗️ Position in Architecture

```
Preference Records
      │
      ▼
Preference Observer
      │
      ▼
Preference Drift Detector
      │
      ▼
┌──────────────────────────────┐
│ DRIFT VISUALIZATION SYSTEM   │
│                              │
│ ┌──────────┐ ┌──────────┐   │
│ │ Timeline │ │ Heatmap  │   │
│ │(Temporal)│ │(Spatial) │   │
│ └──────────┘ └──────────┘   │
└──────────────────────────────┘
      │
      ▼
Human Awareness ONLY
```

**No link to:**
- Orchestrator
- Execution
- Decision pipeline

## 📊 Drift Timeline (Temporal View)

### Purpose
Show **WHEN** and **HOW** preferences change over time.

### Data Model

```typescript
interface DriftTimelinePoint {
  timestamp: ISODate;
  preferenceId: string;
  scope: 'global' | 'sphere' | 'project' | 'session';
  driftMagnitude: 'none' | 'low' | 'medium' | 'high';
  direction: string;
  confidence: number; // 0.0 - 1.0
}
```

### Rules
- ✅ Chronological
- ✅ Immutable
- ✅ Read-only
- ❌ No smoothing or correction

### Usage

```tsx
import { DriftTimelineView, useDriftTimeline } from '@ui/drift';

// Component usage
<DriftTimelineView
  days={30}
  maxHeight="400px"
  onPointClick={(point) => console.log(point)}
/>

// Hook usage
const { timeline, loading, refresh } = useDriftTimeline({
  scope: 'global',
  days: 30,
});
```

## 🗺️ Drift Heatmap (Spatial View)

### Purpose
Show **WHERE** drift is concentrated across the system.

### Axes
- **X-axis**: Preference categories (mode, depth, format, rhythm, risk)
- **Y-axis**: Scopes (global, sphere, project, session)

### Heat Intensity Represents
- Drift magnitude
- Frequency of divergence
- **NOT** error severity

### Rules
- ✅ Color intensity only (no scores)
- ✅ No "good/bad" labeling
- ✅ Comparative only
- ❌ No alerts

### Usage

```tsx
import { DriftHeatmapView, useDriftHeatmap } from '@ui/drift';

// Component usage
<DriftHeatmapView
  days={30}
  config={{
    colorScheme: 'neutral',
    showTooltips: true,
  }}
  onCellClick={(cell) => console.log(cell)}
/>

// Hook usage
const { heatmap, loading, refresh } = useDriftHeatmap({
  days: 30,
});
```

## 🎛️ Combined Dashboard

```tsx
import { DriftVisualizationDashboard } from '@ui/drift';

<DriftVisualizationDashboard
  initialView="split"  // 'timeline' | 'heatmap' | 'split'
  days={30}
  onDismiss={() => console.log('Dismissed')}
/>
```

## 🎮 Interaction Rules

### User MAY
- Zoom in/out
- Filter by scope
- Filter by time window
- Inspect raw drift reports
- Dismiss visualization
- Enable neutral mode

### System MAY
- Highlight emerging drift zones
- Suggest review (optional)

### System MUST NOT
- ❌ Recommend behavior change
- ❌ Auto-reset preferences
- ❌ Highlight as problem
- ❌ Trigger alerts
- ❌ Imply urgency

## 📝 Neutral Language

### Allowed Terms
- change
- divergence
- evolution
- variation
- shift
- movement
- pattern
- observation

### Forbidden Terms
- ❌ error
- ❌ regression
- ❌ anomaly
- ❌ correction
- ❌ problem
- ❌ issue
- ❌ warning
- ❌ alert
- ❌ fix

### Validation

```typescript
import { validateNeutralLanguage } from '@ui/drift';

const result = validateNeutralLanguage('User shows anomaly in behavior');
// { valid: false, forbiddenFound: ['anomaly'] }

const result2 = validateNeutralLanguage('User shows variation in behavior');
// { valid: true, forbiddenFound: [] }
```

## 🎨 Color Palettes

All palettes are neutral — no alarm colors.

### Available Schemes

| Scheme | Description |
|--------|-------------|
| `neutral` | Default blue-purple gradient |
| `monochrome` | Grayscale |
| `gradient` | Blue-gray tones |

```typescript
config={{
  heatmap: {
    colorScheme: 'neutral',  // 'neutral' | 'monochrome' | 'gradient'
  }
}}
```

## 🥽 XR / Advanced View

In XR or Universe View:
- Timeline appears as a flowing path
- Heatmap appears as density fields
- Color encodes magnitude only

### XR Rules
- ✅ Purely observational
- ❌ No animation implying urgency
- ❌ No alerts

### Types

```typescript
interface XRTimelineView {
  type: 'flowing_path';
  pathPoints: Array<{
    position: [number, number, number];
    color: string;
    intensity: number;
    driftPoint: DriftTimelinePoint;
  }>;
  animation: {
    speed: 'slow' | 'medium';
    loop: boolean;
    direction: 'forward';
  };
}

interface XRHeatmapView {
  type: 'density_field';
  densityNodes: Array<{
    position: [number, number, number];
    radius: number;
    intensity: number;
    cell: HeatmapCell;
  }>;
  alerts: never[];  // NO alerts allowed
}
```

## 🛡️ Failsafes

| Failsafe | Description |
|----------|-------------|
| **Read-only** | Visualization cannot modify data |
| **Dismissible** | User can dismiss for session |
| **Disableable** | Can be disabled per session |
| **Neutral mode** | Hides historical bias |

## ⚙️ Configuration

```typescript
interface DriftVisualizationConfig {
  timeline: {
    granularity: 'hour' | 'day' | 'week' | 'month';
    showConfidence: boolean;
    showDirections: boolean;
    animate: boolean;
    maxPoints: number;
  };
  
  heatmap: {
    colorScheme: 'neutral' | 'monochrome' | 'gradient';
    showValues: boolean;
    showTooltips: boolean;
    cellSize: 'small' | 'medium' | 'large';
    animateHover: boolean;
  };
  
  enabled: boolean;
  dismissible: boolean;
  neutralMode: boolean;
}
```

### Defaults

```typescript
const DEFAULT_VISUALIZATION_CONFIG = {
  timeline: {
    granularity: 'day',
    showConfidence: true,
    showDirections: true,
    animate: false,
    maxPoints: 100,
  },
  heatmap: {
    colorScheme: 'neutral',
    showValues: false,
    showTooltips: true,
    cellSize: 'medium',
    animateHover: true,
  },
  enabled: true,
  dismissible: true,
  neutralMode: false,
};
```

## 📁 Files

```
src/ui/drift/
├── index.ts                        # Module exports
├── driftVisualization.types.ts     # All types
├── DriftAwarenessPanel.tsx         # Basic awareness panel
├── DriftTimeline.tsx               # Timeline component
├── DriftHeatmap.tsx                # Heatmap component
└── DriftVisualizationDashboard.tsx # Combined dashboard
```

## 📋 Full Example

```tsx
import React from 'react';
import {
  DriftVisualizationDashboard,
  DriftTimelineView,
  DriftHeatmapView,
  useDriftTimeline,
  useDriftHeatmap,
  validateNeutralLanguage,
} from '@ui/drift';

function DriftPage() {
  const { timeline } = useDriftTimeline({ days: 30 });
  const { heatmap } = useDriftHeatmap({ days: 30 });

  return (
    <div>
      {/* Full Dashboard */}
      <DriftVisualizationDashboard
        initialView="split"
        days={30}
        config={{
          timeline: { showConfidence: true },
          heatmap: { colorScheme: 'neutral' },
          dismissible: true,
          neutralMode: false,
        }}
      />

      {/* Or individual components */}
      <DriftTimelineView
        days={14}
        initialScope="project"
        onPointClick={(point) => {
          console.log('Evolution point:', point.direction);
        }}
      />

      <DriftHeatmapView
        days={14}
        config={{ showValues: true }}
        onCellClick={(cell) => {
          console.log('Category:', cell.category);
        }}
      />
    </div>
  );
}
```

## 📜 Confirmation Statement

```
This system exists to help the user SEE change,
not to influence it.

Drift visibility does not imply action.
Human awareness remains the only authority.
```

---

**Context acknowledged. Authority unchanged.** ✅

*CHE·NU — Governed Intelligence Operating System*
