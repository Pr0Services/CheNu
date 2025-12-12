# CHE·NU — Preference Drift Detector

## 📜 Overview

The Preference Drift Detector detects divergence between historical preference patterns and recent user behavior. It provides **awareness only** — no corrections, no assumptions, no enforcement.

## ⚠️ Critical Principle

```
┌─────────────────────────────────────────────────────────────┐
│  DRIFT DETECTION IS INFORMATIONAL ONLY                     │
│                                                             │
│  The detector:                                              │
│  - Must NOT assume intent                                   │
│  - Must NOT infer reasons                                   │
│  - Must NOT correct behavior                                │
│  - Must report drift FACTUALLY                              │
│  - Must surface magnitude and direction ONLY                │
│                                                             │
│  No authority. No enforcement.                              │
│  Recommendation is ALWAYS "inform-only"                     │
└─────────────────────────────────────────────────────────────┘
```

## 🏗️ Architecture

```
Preference Records
    │
    ▼
┌──────────────────────────────┐
│ Preference Drift Detector    │
│                              │
│ - Compare historical vs      │
│   recent patterns            │
│ - Calculate magnitude        │
│ - Determine direction        │
│ - Report factually           │
└──────────────────────────────┘
    │
    ▼
Drift Reports (read-only)
    │
    ▼
Context Interpreter (optional signal)
    │
    ▼
Human Awareness
```

## 📊 Drift Report Structure

```typescript
interface PreferenceDriftReport {
  preferenceId: string;
  preferenceKey: string;
  scope: 'global' | 'sphere' | 'project';
  
  driftDetected: boolean;
  magnitude: 'low' | 'medium' | 'high';
  direction: string;  // e.g., "exploratory → decisive"
  confidence: number; // 0.0 - 1.0
  
  firstObserved: string;
  recentWindowSize: number;
  historicalWindowSize: number;
  
  historicalPattern: string;
  recentPattern: string;
  expectedValue?: string;
  observedValue?: string;
  
  recommendation: 'inform-only';  // ALWAYS inform-only
  reportedAt: string;
}
```

## 🎯 Drift Directions

| Direction | Description |
|-----------|-------------|
| `exploratory → decisive` | User shifting from exploring to deciding |
| `decisive → exploratory` | User shifting from deciding to exploring |
| `detailed → minimal` | User preferring less detail |
| `minimal → detailed` | User preferring more detail |
| `cautious → bold` | User becoming more risk-tolerant |
| `bold → cautious` | User becoming more risk-averse |
| `structured → flexible` | User preferring less structure |
| `flexible → structured` | User preferring more structure |
| `collaborative → independent` | User working more solo |
| `independent → collaborative` | User working more with others |
| `stable` | No significant drift |

## 📈 Magnitude Thresholds

| Magnitude | Threshold | Meaning |
|-----------|-----------|---------|
| Low | ≥15% | Minor deviation |
| Medium | ≥35% | Notable deviation |
| High | ≥60% | Significant deviation |

## ⚙️ Configuration

```typescript
interface DriftDetectionConfig {
  minHistoricalObservations: number;  // Default: 5
  minRecentObservations: number;      // Default: 3
  recentWindowDays: number;           // Default: 7
  lowDriftThreshold: number;          // Default: 15
  mediumDriftThreshold: number;       // Default: 35
  highDriftThreshold: number;         // Default: 60
}
```

## 🔧 API Usage

### Basic Analysis

```typescript
import { driftDetector } from '@core/agents';

// Analyze all preferences
const result = driftDetector.analyze();

console.log(result.summary);
// {
//   totalPreferencesAnalyzed: 12,
//   driftsDetected: 3,
//   highMagnitudeDrifts: 1,
//   mediumMagnitudeDrifts: 1,
//   lowMagnitudeDrifts: 1,
//   stablePreferences: 9
// }
```

### Filtered Analysis

```typescript
// By scope
const globalDrifts = driftDetector.analyze({ scope: 'global' });

// By specific keys
const workingModeDrift = driftDetector.analyze({
  preferenceKeys: ['working_mode', 'output_format']
});

// With custom config
const strictAnalysis = driftDetector.analyze({
  config: {
    highDriftThreshold: 50,
    recentWindowDays: 3,
  }
});
```

### Get High-Magnitude Only

```typescript
const highDrifts = driftDetector.getHighMagnitudeDrifts();

for (const drift of highDrifts) {
  console.log(`${drift.preferenceKey}: ${drift.direction}`);
}
```

### Signals for Context Interpreter

```typescript
const signals = driftDetector.getDriftSignalsForContextInterpreter();

// {
//   hasDrift: true,
//   driftCount: 3,
//   highestMagnitude: 'high',
//   primaryDirection: 'exploratory → decisive'
// }
```

## 🎨 UI Components

### DriftAwarenessPanel

Full drift awareness display:

```tsx
import { DriftAwarenessPanel } from '@ui/drift';

<DriftAwarenessPanel
  refreshInterval={30000}  // Auto-refresh every 30s
  minMagnitude="medium"    // Only show medium+ drifts
  scope="global"
  onDriftClick={(report) => console.log(report)}
/>
```

### Compact Mode

```tsx
<DriftAwarenessPanel compact />
```

### Hook Usage

```tsx
import { useDriftAnalysis } from '@ui/drift';

function MyComponent() {
  const { result, filteredReports, loading, refresh } = useDriftAnalysis({
    refreshInterval: 60000,
    scope: 'project',
    minMagnitude: 'low',
  });

  if (loading) return <Spinner />;

  return (
    <div>
      <p>{result.summary.driftsDetected} drifts detected</p>
      {filteredReports.map(r => (
        <div key={r.preferenceId}>{r.direction}</div>
      ))}
    </div>
  );
}
```

## 📋 Example Output

```
CHE·NU — PREFERENCE DRIFT ANALYSIS
==================================

SUMMARY
-------
Total Preferences Analyzed: 12
Drifts Detected: 2
  - High Magnitude: 1
  - Medium Magnitude: 1
  - Low Magnitude: 0
Stable Preferences: 10

DETECTED DRIFTS
========================================

• working_mode [global]
  Magnitude: high | Direction: exploratory → decisive
  Confidence: 85%

• output_detail [sphere]
  Magnitude: medium | Direction: detailed → minimal
  Confidence: 72%

IMPORTANT
---------
This analysis is INFORMATIONAL ONLY.
- No intent assumed
- No reasons inferred
- No behavior correction
- Human awareness only

Context acknowledged. Authority unchanged.
```

## 🔌 Integration with Context Interpreter

The Drift Detector can optionally feed signals to the Context Interpreter:

```typescript
import { contextInterpreter } from '@core/agents';
import { driftDetector } from '@core/agents';

// Get drift signals
const driftSignals = driftDetector.getDriftSignalsForContextInterpreter();

// Pass to interpreter (as optional context)
const result = contextInterpreter.interpret({
  userIntent: 'Je veux continuer le projet',
  sessionState: {
    currentPhase: 'execution',
    // Include drift awareness
    driftAwareness: driftSignals,
  },
});

// Interpreter may surface drift in ambiguities
// But will NOT auto-correct or assume
```

## 🚫 What Drift Detection Does NOT Do

- ❌ Assume why behavior changed
- ❌ Infer user intent
- ❌ Correct or adjust preferences
- ❌ Block or warn users
- ❌ Trigger automated actions
- ❌ Make recommendations beyond "inform-only"
- ❌ Judge user decisions

## ✅ What Drift Detection DOES Do

- ✓ Detect statistical divergence
- ✓ Report magnitude (low/medium/high)
- ✓ Report direction (pattern A → pattern B)
- ✓ Provide confidence scores
- ✓ Surface information for human awareness
- ✓ Feed optional signals to Context Interpreter

## 📜 System Prompt

```
You are the CHE·NU Preference Drift Detector Agent.

Your role is to detect divergence between
historical preference patterns and recent user behavior.

Rules:
- You must NOT assume intent.
- You must NOT infer reasons.
- You must NOT correct behavior.
- You must report drift FACTUALLY.
- You must surface magnitude and direction ONLY.

Your output is informational.
No authority. No enforcement.
```

## 🛡️ Governance

The Drift Detector operates under CHE·NU governance:

- **Authority**: NONE
- **Recommendation**: Always "inform-only"
- **Confirmation**: "Context acknowledged. Authority unchanged."
- **Human oversight**: Always required for any action

---

**Context acknowledged. Authority unchanged.** ✅

*CHE·NU — Governed Intelligence Operating System*
