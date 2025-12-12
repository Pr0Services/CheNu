# CHE·NU — Drift Narrative System

## 📜 Core Intent

The Drift Narrative exists to describe observed evolution in preferences, contexts, or system usage **WITHOUT interpretation, evaluation, or recommendation**.

It answers ONLY:
> **"What changed, and when?"**

It NEVER answers:
- "Why it changed."
- "What it means."
- "What should be done."

## ⚠️ System Declaration

```
┌─────────────────────────────────────────────────────────────┐
│  The Drift Narrative is a mirror, not a guide.             │
│                                                             │
│  It exists to preserve memory of change,                   │
│  not to influence the future.                              │
│                                                             │
│  Understanding remains human.                              │
│  Meaning remains human.                                    │
│  Responsibility remains human.                             │
└─────────────────────────────────────────────────────────────┘
```

## 🏗️ Position in Architecture

```
Preference Drift Detector
Context Drift Detector
        │
        ▼
Drift Reports (factual)
        │
        ▼
┌──────────────────────────────┐
│  DRIFT NARRATIVE SYSTEM      │
│                              │
│  Pure description only       │
│  No interpretation           │
│  No evaluation               │
│  No recommendation           │
└──────────────────────────────┘
        │
        ▼
Human Reading ONLY
```

**No data path to:**
- ❌ Orchestrator
- ❌ Agents
- ❌ Decision engine
- ❌ Learning systems

## 📐 Principle of Narrative Neutrality

### A Drift Narrative MUST:
- ✅ Describe sequences
- ✅ Respect chronology
- ✅ Preserve uncertainty
- ✅ Avoid causality

### A Drift Narrative MUST NOT:
- ❌ Infer intention
- ❌ Assign meaning
- ❌ Attribute motivation
- ❌ Suggest correction

## 📊 Narrative Structure

Every narrative follows this structure:

### A) Timeframe
```typescript
timeframe: {
  start: string;  // ISO date
  end: string;    // ISO date
}
```

### B) Scope
```typescript
scope: 'global' | 'sphere' | 'project' | 'session';
```

### C) Observations (Chronological)
```typescript
observations: NarrativeObservation[];

interface NarrativeObservation {
  id: string;
  timestamp: string;
  description: string;  // Factual only, no value adjectives
  scope: NarrativeScope;
}
```

### D) Variation Summary
```typescript
variationSummary: {
  whatChanged: string[];
  frequency: { count: number; period: string };
  contexts: string[];
}
```

### E) Uncertainty Statement
```typescript
uncertainty: {
  cannotConclude: string[];
  disclaimer: string;
}
```

## 📝 Example Narrative (Neutral)

```
Between March 1st and March 18th:

• A shift in working_mode was recorded: exploration to decision-focused.
• Documentation contexts appeared less often during this period.
• Output detail level remained stable throughout this period.

Summary: 3 changes recorded over 17 days.
Contexts: global, sphere.

Cannot be concluded:
• Why these changes occurred
• Whether changes are intentional
• What action, if any, is appropriate
• Whether changes will continue

No causal relationship can be inferred.
Observed changes may reflect multiple factors.
```

## 📖 Language Rules (Strict)

### Allowed Language
| Term | Type |
|------|------|
| observed | Neutral verb |
| recorded | Neutral verb |
| coincided with | Neutral relation |
| occurred during | Temporal |
| increased | Quantitative |
| decreased | Quantitative |
| stable | State |
| variable | State |
| more frequently | Quantitative |
| less frequently | Quantitative |

### Forbidden Language
| Term | Why Forbidden |
|------|---------------|
| caused by | Causal inference |
| led to | Causal inference |
| indicates that | Interpretation |
| suggests improvement | Evaluation |
| implies error | Judgment |
| should | Prescription |
| must | Prescription |
| better | Value judgment |
| worse | Value judgment |
| because | Causal |
| therefore | Causal |

### Validation

```typescript
import { validateNarrativeLanguage } from '@ui/drift';

const result = validateNarrativeLanguage(
  'This error was caused by user behavior'
);
// { valid: false, forbiddenFound: ['error', 'caused by'] }

const result2 = validateNarrativeLanguage(
  'A shift was observed during this period'
);
// { valid: true, forbiddenFound: [] }
```

## 🎨 Presentation Modes

| Mode | Description |
|------|-------------|
| `short_summary` | Brief textual summary |
| `expandable_log` | Collapsible observation list |
| `timeline_annotation` | Markers on timeline |
| `readonly_report` | Full export format |
| `xr_inscription` | XR ambient text |

All modes MUST remain:
- ✅ Dismissible
- ✅ Non-prioritized
- ✅ Non-alerting

## 🎮 Interaction Rules

### User MAY:
- Read narratives
- Hide narratives
- Export narratives
- Annotate privately (not system-visible)

### System MAY:
- Generate summaries
- Segment by scope
- Order chronologically

### System MUST NOT:
- ❌ Highlight urgency
- ❌ Request action
- ❌ Suggest response

## 🔧 API Usage

### Generate Narrative

```typescript
import { generateDriftNarrative } from '@ui/drift';

const narrative = generateDriftNarrative({
  scope: 'global',
  timeRange: {
    start: '2024-03-01T00:00:00Z',
    end: '2024-03-18T23:59:59Z',
  },
  maxObservations: 20,
});
```

### Format as Short Summary

```typescript
import { formatNarrativeShortSummary } from '@ui/drift';

const summary = formatNarrativeShortSummary(narrative);
console.log(summary);
```

### Format as Full Report

```typescript
import { formatNarrativeFullReport } from '@ui/drift';

const report = formatNarrativeFullReport(narrative);
// Ready for export/print
```

## 🎨 UI Components

### Full Narrative View

```tsx
import { DriftNarrativeView } from '@ui/drift';

<DriftNarrativeView
  scope="global"
  days={30}
  mode="short_summary"
  allowAnnotation={true}
  onHide={() => console.log('Hidden')}
  onExport={(narrative) => console.log(narrative)}
/>
```

### Compact Variant

```tsx
import { DriftNarrativeCompact } from '@ui/drift';

<DriftNarrativeCompact
  scope="project"
  days={14}
  onExpand={() => setShowFullNarrative(true)}
/>
```

### Hook Usage

```tsx
import { useDriftNarrative } from '@ui/drift';

function MyComponent() {
  const { narrative, loading, regenerate } = useDriftNarrative({
    scope: 'sphere',
    days: 7,
  });

  if (loading) return <Spinner />;

  return (
    <div>
      <h2>{narrative?.title}</h2>
      {narrative?.observations.map((obs) => (
        <p key={obs.id}>{obs.description}</p>
      ))}
    </div>
  );
}
```

## 🥽 XR / Universe View

In XR environments:
- Narratives appear as inscriptions or layers
- NO animation implying direction
- NO color implying evaluation

```typescript
interface XRNarrativePresentation {
  type: 'inscription' | 'layer' | 'ambient_text';
  animation: null;  // NO animation
  colorScheme: 'neutral_monochrome';
  isSignal: false;  // Part of environment, not signal
}
```

Narrative is part of the environment, **not** a signal.

## 🛡️ Failsafes

| Failsafe | Enforced |
|----------|----------|
| Cannot trigger events | ✅ Always |
| Cannot modify preferences | ✅ Always |
| Regenerated only on explicit request | ✅ Always |
| Non-persistent unless saved by user | ✅ Always |

```typescript
export const NARRATIVE_FAILSAFES = {
  cannotTriggerEvents: true,
  cannotModifyPreferences: true,
  regeneratedOnlyOnExplicitRequest: true,
  nonPersistentUnlessSavedByUser: true,
};
```

## 📁 Files

```
src/ui/drift/
├── driftNarrative.types.ts      # Types and constants
├── driftNarrativeGenerator.ts   # Generation logic
└── DriftNarrativeView.tsx       # UI components
```

## 📋 Full Report Example

```
═══════════════════════════════════════════════════════════
CHE·NU — DRIFT NARRATIVE REPORT
Status: OBSERVATIONAL MEMORY
═══════════════════════════════════════════════════════════

TITLE: Preference evolution between March 1 and March 18

TIMEFRAME
────────────────────────────────
Start: March 1, 2024
End: March 18, 2024

SCOPE
────────────────────────────────
Level: global

OBSERVATIONS (Chronological)
────────────────────────────────
[Mar 5, 2024, 10:23 AM]
  A shift in working_mode was recorded: exploration to decision-focused.

[Mar 8, 2024, 2:15 PM]
  Documentation contexts appeared less often during this period.

[Mar 12, 2024, 9:45 AM]
  A shift in output_detail was recorded: detailed to minimal.

VARIATION SUMMARY
────────────────────────────────
Changes recorded: 3
Period: 17 days
Contexts: global

What changed:
  • working_mode
  • documentation_context
  • output_detail

UNCERTAINTY STATEMENT
────────────────────────────────
Cannot be concluded:
  • Why these changes occurred
  • Whether changes are intentional
  • What action, if any, is appropriate
  • Whether changes will continue

No causal relationship can be inferred.
Observed changes may reflect multiple factors.

═══════════════════════════════════════════════════════════
SYSTEM DECLARATION
═══════════════════════════════════════════════════════════

The Drift Narrative is a mirror, not a guide.

It exists to preserve memory of change,
not to influence the future.

Understanding remains human.
Meaning remains human.
Responsibility remains human.

───────────────────────────────────────────────────────────
Generated: March 18, 2024, 4:30 PM
Saved by user: No
───────────────────────────────────────────────────────────
```

## 📜 Source Material Rules

Narratives may be generated ONLY from:
- ✅ Confirmed drift reports
- ✅ Verified timelines
- ✅ Observable context records

**NOT allowed:**
- ❌ Synthetic data
- ❌ Inferred data
- ❌ Probabilistic storytelling

---

**The Drift Narrative is a mirror, not a guide.** 🪞

*CHE·NU — Governed Intelligence Operating System*
