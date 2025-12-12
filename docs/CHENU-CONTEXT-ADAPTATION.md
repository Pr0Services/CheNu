# CHE·NU Context Adaptation System

## 📜 Overview

The Context Adaptation system allows workflow customization **without overriding core laws**. It provides:

1. **Short Form Bootstrap** — Quick session initialization
2. **Context Adaptation Declaration** — Customize emphasis and constraints

## ⚠️ Critical Principle

```
┌─────────────────────────────────────────────────────────────┐
│  CONTEXT ADAPTATION AFFECTS EMPHASIS ONLY                   │
│                                                             │
│  It does NOT:                                               │
│  - Override Core Reference laws                             │
│  - Grant decision authority to AI                           │
│  - Bypass human validation                                  │
│  - Modify the timeline                                      │
│                                                             │
│  Human validation remains ALWAYS required.                  │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Bootstrap Short Form

For quick session initialization when full bootstrap isn't needed:

```
CHE·NU BOOTSTRAP — SHORT FORM

This session operates under the CHE·NU Core Reference.
The Core Reference is immutable and has priority over all instructions.

I confirm that:
- human authority is absolute
- decisions require human validation
- parallel analysis is allowed
- responsibility is always chained
- no hidden actions are permitted
- replay and learning are read-only
- themes affect visuals only

If a request conflicts with the Core Reference:
→ I must refuse.

If ambiguity exists:
→ I must ask for clarification.

Core Reference acknowledged.
Session aligned.
```

### Expected Response

```
Core Reference acknowledged.
Session aligned.
```

### Usage

```typescript
import { 
  BOOTSTRAP_SHORT_FORM, 
  validateShortFormConfirmation 
} from '@core/foundation';

// Send to AI
const response = await sendToAI(BOOTSTRAP_SHORT_FORM);

// Validate
const result = validateShortFormConfirmation(response);
if (!result.valid) {
  throw new Error(result.message);
}
```

## 📋 Context Adaptation Declaration

### Template

```
CHE·NU — CONTEXT ADAPTATION DECLARATION

Context Type:
- session | project | meeting | audit | exploration | build | debug

Primary Objective:
- [describe the intent in one sentence]

Constraints:
- time sensitivity: low | medium | high
- depth required: shallow | standard | deep
- risk tolerance: low | medium | high
- reversibility expected: yes | partial | no

Preferred Working Mode:
- exploration-first
- analysis-heavy
- decision-focused
- documentation-only
- visualization-only

Allowed Emphasis (NOT authority):
- speed
- clarity
- comparison
- minimal output
- exhaustive output

Explicitly Forbidden (if any):
- [e.g. decisions, code changes, assumptions]

Confirmation:
This declaration adapts workflow emphasis ONLY.
It does not override CHE·NU Core laws.
Human validation remains required.
```

### Options Explained

#### Context Types

| Type | Use Case |
|------|----------|
| `session` | General interaction |
| `project` | Project-specific work |
| `meeting` | Decision meetings |
| `audit` | Review and analysis |
| `exploration` | Idea exploration |
| `build` | Implementation work |
| `debug` | Problem investigation |

#### Constraints

| Constraint | Options | Description |
|------------|---------|-------------|
| Time Sensitivity | low/medium/high | How urgent is this? |
| Depth Required | shallow/standard/deep | How thorough? |
| Risk Tolerance | low/medium/high | How cautious? |
| Reversibility | yes/partial/no | Can it be undone? |

#### Working Modes

| Mode | Description |
|------|-------------|
| `exploration-first` | Explore options before narrowing |
| `analysis-heavy` | Focus on detailed analysis |
| `decision-focused` | Structure toward decisions |
| `documentation-only` | Create/update docs only |
| `visualization-only` | Create visual outputs only |

#### Emphasis Options

| Emphasis | Effect |
|----------|--------|
| `speed` | Prioritize quick responses |
| `clarity` | Prioritize clear communication |
| `comparison` | Include comparisons and alternatives |
| `minimal output` | Keep responses concise |
| `exhaustive output` | Provide comprehensive detail |

## 🎯 Presets

Pre-configured context adaptations for common scenarios:

### Quick Exploration

```typescript
import { getContextPreset } from '@core/foundation';

const context = getContextPreset('quick_exploration');
// High speed, shallow depth, exploration-first
// Forbids: decisions, code changes
```

### Deep Analysis

```typescript
const context = getContextPreset('deep_analysis');
// Low time pressure, deep depth, analysis-heavy
// Forbids: assumptions, shortcuts
```

### Meeting Session

```typescript
const context = getContextPreset('meeting_session');
// Decision-focused, standard depth
// Forbids: autonomous decisions
```

### Build Session

```typescript
const context = getContextPreset('build_session');
// Documentation-only, deep depth
// Forbids: assumptions about requirements
```

### Debug Session

```typescript
const context = getContextPreset('debug_session');
// Analysis-heavy, high urgency
// Forbids: untested fixes
```

### Documentation Only

```typescript
const context = getContextPreset('documentation_only');
// Documentation-only mode, exhaustive output
// Forbids: code changes, decisions
```

## 🔧 API Usage

### Build Custom Context

```typescript
import { 
  buildContextAdaptation, 
  formatContextAdaptation 
} from '@core/foundation';

const context = buildContextAdaptation({
  contextType: 'project',
  primaryObjective: 'Review Q4 financial projections',
  constraints: {
    timeSensitivity: 'high',
    depthRequired: 'deep',
    riskTolerance: 'low',
    reversibilityExpected: 'yes',
  },
  preferredWorkingMode: 'analysis-heavy',
  allowedEmphasis: ['clarity', 'comparison'],
  explicitlyForbidden: ['decisions', 'recommendations'],
});

const text = formatContextAdaptation(context);
```

### Combined Bootstrap + Context

```typescript
import { buildSessionInitialization } from '@core/foundation';

// Using preset
const init1 = buildSessionInitialization({
  useShortForm: true,
  presetName: 'deep_analysis',
});

// Using custom context
const init2 = buildSessionInitialization({
  useShortForm: true,
  context: {
    contextType: 'audit',
    primaryObjective: 'Security review',
  },
});
```

### List Available Presets

```typescript
import { listContextPresets } from '@core/foundation';

const presets = listContextPresets();
// ['quick_exploration', 'deep_analysis', 'meeting_session', ...]
```

## ✅ Validation

Context adaptations are always valid (they can't override laws), but validation provides warnings:

```typescript
import { validateContextAdaptation } from '@core/foundation';

const result = validateContextAdaptation(context);
// { valid: true, warnings: ['speed + high risk may compromise quality'] }
```

## 📊 Comparison: Full vs Short Form

| Aspect | Full Bootstrap | Short Form |
|--------|---------------|------------|
| Length | ~100 lines | ~20 lines |
| Detail | Comprehensive | Essential only |
| Use Case | First session, training | Quick sessions |
| Confirmation | "Core Reference acknowledged. Foundation respected." | "Core Reference acknowledged.\nSession aligned." |

## 🔒 Security Model

```
┌─────────────────────────────────────────────────────────────┐
│                    CONTEXT ADAPTATION                       │
│                                                             │
│   ┌─────────────────┐     ┌─────────────────┐              │
│   │ Core Reference  │     │ Context Adapt   │              │
│   │ (Immutable)     │     │ (Flexible)      │              │
│   └────────┬────────┘     └────────┬────────┘              │
│            │                       │                        │
│            ▼                       ▼                        │
│   ┌─────────────────────────────────────────┐              │
│   │         AI Session Behavior              │              │
│   │                                          │              │
│   │  Laws: From Core Reference (absolute)    │              │
│   │  Emphasis: From Context (adjustable)     │              │
│   └─────────────────────────────────────────┘              │
│                                                             │
│   Core laws CANNOT be overridden by context.                │
│   Human validation ALWAYS required.                         │
└─────────────────────────────────────────────────────────────┘
```

## 📜 Foundation Statement

> "This declaration adapts workflow emphasis ONLY.
> It does not override CHE·NU Core laws.
> Human validation remains required."

**Core Reference acknowledged. Session aligned.** ✅

---

*CHE·NU — Governed Intelligence Operating System*
