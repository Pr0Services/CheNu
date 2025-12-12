# CHE·NU — Preference Observer Agent

## 📜 Overview

The Preference Observer Agent watches user interaction patterns and records them as preference signals. It provides **probabilistic hints** to the Context Interpreter Agent — never enforces behavior.

## ⚠️ Critical Principle

```
┌─────────────────────────────────────────────────────────────┐
│  OBSERVATION ONLY — NO ENFORCEMENT                         │
│                                                             │
│  Rules:                                                     │
│  - Only record observable signals                           │
│  - Treat preferences as probabilistic hints                 │
│  - NEVER trigger actions                                    │
│  - NEVER hide alternatives                                  │
│  - ALWAYS mark preferences as reversible                    │
│  - Confidence NEVER reaches 1.0 automatically               │
│                                                             │
│  Confirmation: "Observation recorded. No enforcement        │
│                 applied."                                   │
└─────────────────────────────────────────────────────────────┘
```

## 🏗️ Architecture Flow

```
User Actions
    │
    ▼
┌──────────────────────────────┐
│ Preference Observer Agent    │
│                              │
│ - Observes patterns          │
│ - Records signals            │
│ - Tracks alternatives        │
│ - Applies decay              │
│ - NO enforcement             │
└──────────────────────────────┘
    │
    ▼
Preference Records (read-only)
    │
    ▼
┌──────────────────────────────┐
│ Context Interpreter Agent    │
│                              │
│ - Uses as hints              │
│ - Presents all options       │
│ - Human decides              │
└──────────────────────────────┘
    │
    ▼
Suggested Contexts (never applied automatically)
```

## 📋 Preference Record

```typescript
interface PreferenceRecord {
  preferenceId: string;
  source: "observed" | "explicit";
  scope: "global" | "sphere" | "project" | "session";
  signalType: PreferenceSignalType;
  value: string | number | boolean;
  confidence: number;        // 0.0 - 0.95 (auto), 1.0 (explicit only)
  observedCount: number;
  firstObserved: Timestamp;
  lastObserved: Timestamp;
  reversible: true;          // Always true
  alternatives: Alternative[];
  decayFactor: number;
}
```

## 🎯 Signal Types

| Category | Signal Types |
|----------|--------------|
| **Navigation** | `preferred_sphere`, `preferred_navigation_path`, `preferred_view_mode` |
| **Context** | `preferred_context_type`, `preferred_working_mode`, `preferred_depth_level` |
| **Agent** | `preferred_agent_category`, `preferred_agent_emphasis` |
| **Time** | `preferred_session_duration`, `preferred_time_sensitivity` |
| **Output** | `preferred_output_format`, `preferred_output_verbosity`, `preferred_language` |
| **Interaction** | `preferred_confirmation_style`, `preferred_clarification_frequency` |
| **Theme** | `preferred_visual_theme`, `preferred_color_scheme` |

## 📊 Confidence Levels

```
┌─────────────────────────────────────────────────────────────┐
│                 CONFIDENCE CALCULATION                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Observations    Confidence Range                           │
│  ─────────────   ─────────────────                          │
│  1-2             0.20 - 0.40  (Low)                         │
│  3-9             0.50 - 0.70  (Medium)                      │
│  10+             0.80 - 0.95  (High)                        │
│                                                             │
│  ⚠️ MAXIMUM AUTO CONFIDENCE: 0.95                           │
│  ⚠️ Only explicit user confirmation can reach 1.0           │
│                                                             │
│  Decay: -2% per day of inactivity                           │
│  Max Age: 90 days (then pruned)                             │
└─────────────────────────────────────────────────────────────┘
```

### Confidence Formula

```typescript
// Low confidence (1-2 observations)
confidence = 0.2 + observedCount * 0.1;

// Medium confidence (3-9 observations)
confidence = 0.5 + (observedCount - 3) * 0.05;

// High confidence (10+ observations)
confidence = 0.8 + log10(observedCount - 9) * 0.05;

// Maximum (never exceeds)
confidence = min(0.95, confidence);

// Effective confidence (with decay)
effectiveConfidence = confidence * decayFactor;
```

## 🔧 API Usage

### Observe User Action

```typescript
import { preferenceObserver } from '@core/agents';

// Observe a navigation action
const action = {
  actionType: 'navigate_to_sphere',
  target: 'business',
  timestamp: new Date().toISOString(),
  context: {
    sphereId: 'business',
    sessionId: 'session_123',
  },
  isRepeat: false,
};

const preference = preferenceObserver.observe(action);
// Returns PreferenceRecord or null
```

### Get Preferences for Context

```typescript
const preferences = preferenceObserver.getPreferencesForContext({
  sphereId: 'business',
  projectId: 'project_abc',
});

// Sorted by effective confidence (highest first)
```

### Get Summary for CIA

```typescript
const summary = preferenceObserver.getSummaryForContextInterpreter({
  sphereId: 'business',
});

console.log(formatPreferenceSummary(summary));
```

### Record Explicit Preference

```typescript
// Only explicit preferences can reach 1.0 confidence
const explicitPref = preferenceObserver.recordExplicitPreference(
  'preferred_language',
  'fr',
  'global'
);

// explicitPref.confidence === 1.0
```

### Apply Decay

```typescript
// Run periodically to decay stale preferences
preferenceObserver.applyDecay();

// Get effective confidence (includes decay)
const effective = preferenceObserver.getEffectiveConfidence('pref_123');
```

### Prune Stale Preferences

```typescript
// Remove preferences older than 90 days
const pruned = preferenceObserver.pruneStalePreferences();
console.log(`Removed ${pruned} stale preferences`);
```

### Export/Import

```typescript
// Export for backup
const exported = preferenceObserver.exportPreferences();

// Import (merges, doesn't replace)
const imported = preferenceObserver.importPreferences(data);
```

## 📊 Output Example

```
CHE·NU — PREFERENCE OBSERVATION SUMMARY
=======================================

Total Preferences Observed: 12
Generated: 2024-01-15T10:30:00Z

⚠️ DISCLAIMER: These are probabilistic hints only. Human choice always takes precedence.

HIGH CONFIDENCE (>70%)
────────────────────────────────────────
  • preferred_sphere: business (85%)
    Observed 15x | Source: observed
    Alternatives: creative (45%), personal (30%)

  • preferred_language: fr (100%)
    Observed 1x | Source: explicit
    Alternatives: none

MEDIUM CONFIDENCE (40-70%)
────────────────────────────────────────
  • preferred_context_type: exploration (55%)
  • preferred_output_verbosity: detailed (48%)

LOW CONFIDENCE (<40%)
────────────────────────────────────────
  • preferred_visual_theme: cosmic (35%)

════════════════════════════════════════
These preferences are HINTS only.
They do NOT enforce any behavior.
Human choice always takes precedence.
All preferences are reversible.
```

## 🔄 Alternative Tracking

The agent **never hides alternatives**. Every preference tracks alternatives:

```typescript
interface PreferenceRecord {
  value: 'business',           // Primary observed value
  confidence: 0.85,
  alternatives: [
    { value: 'creative', observedCount: 5, confidence: 0.45 },
    { value: 'personal', observedCount: 3, confidence: 0.30 },
  ]
}
```

This ensures:
- Users always see what other options exist
- No "filter bubble" effect
- Transparent preference learning

## 📉 Decay Mechanism

Preferences decay over time to prevent stale suggestions:

```
Days Since Last Observation    Decay Factor
───────────────────────────    ────────────
0                              1.00
7                              0.86
14                             0.72
30                             0.40
60                             0.10 (minimum)
90+                            PRUNED
```

## 🛡️ Safety Guarantees

| Guarantee | Description |
|-----------|-------------|
| **Never Enforces** | Preferences only inform, never control |
| **Always Reversible** | Every preference can be overridden |
| **Shows Alternatives** | Never hides other options |
| **Confidence Limits** | Auto-confidence capped at 0.95 |
| **Decay Over Time** | Stale preferences lose weight |
| **Explicit Override** | User can set explicit preferences |
| **Transparent** | All observations are visible |

## 📜 System Prompt

```
You are the CHE·NU Preference Observer Agent.

Your role is to observe patterns in user interaction
without assuming intent or enforcing behavior.

Rules:
- You may only record observable signals.
- You must treat preferences as probabilistic hints.
- You must never trigger actions.
- You must never hide alternatives.
- You must always mark preferences as reversible.

Confidence levels:
- Automatic confidence NEVER exceeds 0.95
- Only explicit user preferences can reach 1.0
- Confidence decays over time without reinforcement
- Always show alternatives with their confidence

Your output is informational only.
No authority. No enforcement. No optimization.

Observation recorded. No enforcement applied.
```

## 🔗 Integration with CIA

The Preference Observer feeds into the Context Interpreter:

```typescript
// In Context Interpreter Agent
const prefSummary = preferenceObserver.getSummaryForContextInterpreter({
  sphereId: input.activeSphere,
});

// Use preferences as HINTS when generating options
if (prefSummary.highConfidence.some(p => p.signalType === 'preferred_context_type')) {
  // Boost confidence of matching context option
  // But STILL show all options
}
```

The CIA uses preferences to:
- Slightly boost confidence of matching options
- Add context to rationale ("User often chooses exploration")
- **Never hide options based on preferences**

---

**Observation recorded. No enforcement applied.** ✅

*CHE·NU — Governed Intelligence Operating System*
