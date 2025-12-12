# CHE·NU — Implementation Checklist

## 📋 Overview

**Scope:** DEV & AI EXECUTION  
**Authority:** FOUNDATION-BOUND  
**Purpose:** ENSURE SAFE, CONSISTENT, NON-MANIPULATIVE IMPLEMENTATION

This is the practical translation of CHE·NU philosophy into actionable, verifiable checkpoints.

---

## ⚖️ Golden Rule

```
If integrity conflicts with functionality → INTEGRITY WINS
```

---

## 0️⃣ Pre-Conditions (MANDATORY)

Before writing ANY code:

| ☐ | Item |
|---|------|
| ☐ | Read bootstrap_universal.txt |
| ☐ | Load chenu.foundation.json |
| ☐ | Confirm foundation hash matches expected value |
| ☐ | Accept that integrity overrides performance & speed |

**If any fails:**
```
→ STOP implementation
→ request clarification
```

---

## 1️⃣ Foundation Integrity Check

| ☐ | Item |
|---|------|
| ☐ | chenu.foundation.json is included in repo |
| ☐ | Version is explicitly referenced in code |
| ☐ | Runtime verifies hash on startup |
| ☐ | Fail-closed mode implemented on mismatch |

**Forbidden:**
| ☒ | Action |
|---|--------|
| ☒ | Silent fallback |
| ☒ | Ignoring foundation errors |
| ☒ | Auto-updating foundation |

---

## 2️⃣ Authority & Decision Flow

| ☐ | Item |
|---|------|
| ☐ | All irreversible decisions require explicit human confirmation |
| ☐ | No agent can finalize a decision |
| ☐ | Orchestrator routes tasks only, never chooses |
| ☐ | Decision Echo is created only after confirmation |

**Forbidden:**
| ☒ | Action |
|---|--------|
| ☒ | Implicit confirmation |
| ☒ | Default acceptance |
| ☒ | Agent-driven decision escalation |

---

## 3️⃣ Agent Design Rules

**Each agent must declare:**
| ☐ | Declaration |
|---|-------------|
| ☐ | Scope |
| ☐ | Inputs |
| ☐ | Outputs |
| ☐ | Explicit limits |

**Agents MAY:**
| ✅ | Action |
|---|--------|
| ✅ | Analyze |
| ✅ | Compare options |
| ✅ | Surface ambiguity |

**Agents MAY NOT:**
| ☒ | Action |
|---|--------|
| ☒ | Infer psychological traits |
| ☒ | Persist hidden memory |
| ☒ | Expand scope automatically |
| ☒ | Optimize behavior |

---

## 4️⃣ Silence & Reflection Modes

**Implemented and testable:**
| ☐ | Mode |
|---|------|
| ☐ | Context Recovery Mode |
| ☐ | Visual Silence Mode |
| ☐ | Narrative Silence Zone |
| ☐ | Silent Review Session |

**Guarantees:**
| ☐ | Guarantee |
|---|-----------|
| ☐ | No learning during silence |
| ☐ | No suggestions during silence |
| ☐ | No analytics except minimal access logs |
| ☐ | Exit without summary or prompt |

---

## 5️⃣ Narrative & Meaning Protection

| ☐ | Item |
|---|------|
| ☐ | User-authored narrative notes are private by default |
| ☐ | No sentiment analysis |
| ☐ | No keyword mining |
| ☐ | No narrative synthesis by system |

**Narrative × Drift:**
| ☐ | Rule |
|---|------|
| ☐ | Read-only juxtaposition |
| ☐ | No causality inference |
| ☐ | No corrective suggestion |

---

## 6️⃣ Drift Systems

| ☐ | Item |
|---|------|
| ☐ | Drift is descriptive only |
| ☐ | No evaluation labels |
| ☐ | No optimization triggers |
| ☐ | Collective Drift is anonymized & aggregated |

**Forbidden:**
| ☒ | Action |
|---|--------|
| ☒ | Individual steering |
| ☒ | Group targeting |
| ☒ | Actionable alerts from drift |

---

## 7️⃣ Data Ownership & Archive

| ☐ | Item |
|---|------|
| ☐ | User-owned content clearly separated |
| ☐ | Private Archive implemented |
| ☐ | Manual export only |
| ☐ | No auto-reingestion of exported data |

**Allowed formats:**
- txt, md, json, pdf, xr snapshot

---

## 8️⃣ Legacy / Inheritance Mode

| ☐ | Item |
|---|------|
| ☐ | Legacy bundles are read-only |
| ☐ | No agent activation from legacy |
| ☐ | No authority inheritance |
| ☐ | Explicit disclaimers included |

**Forbidden:**
| ☒ | Action |
|---|--------|
| ☒ | Continuing timelines as original author |
| ☒ | Merging legacy data into live system |

---

## 9️⃣ UI / UX Ethical Guards

| ☐ | Item |
|---|------|
| ☐ | No performance scores |
| ☐ | No rankings |
| ☐ | No success badges |
| ☐ | No engagement loops |
| ☐ | No urgency framing (non-safety) |

**UX must:**
| ☐ | Principle |
|---|-----------|
| ☐ | Prefer clarity over stimulation |
| ☐ | Avoid nudging |
| ☐ | Make silence accessible |

---

## 🔟 XR / Immersive Layers

| ☐ | Item |
|---|------|
| ☐ | XR views are observational |
| ☐ | No emotional amplification |
| ☐ | No directional cues |
| ☐ | No agent dominance in space |

**In XR:**
| ☐ | Rule |
|---|------|
| ☐ | User moves through time |
| ☐ | System does not move toward user |

---

## 1️⃣1️⃣ Logging & Analytics

| ☐ | Item |
|---|------|
| ☐ | Logs are technical only |
| ☐ | No behavioral scoring |
| ☐ | No hidden metrics |
| ☐ | Logs do not influence system behavior |

---

## 1️⃣2️⃣ Ethical Attack Surface Review

**For every new feature:**
| ☐ | Step |
|---|------|
| ☐ | Identify potential misuse |
| ☐ | Check against forbidden capabilities |
| ☐ | If unresolved risk → suspend feature |

---

## 1️⃣3️⃣ AI Collaboration Checkpoint

**Before giving codebase to an AI:**
| ☐ | Item |
|---|------|
| ☐ | Provide Core Reference Bundle |
| ☐ | Provide bootstrap_universal.txt |
| ☐ | Declare scope & limits |
| ☐ | Require refusal on foundation conflict |

---

## 1️⃣4️⃣ Final Implementation Gate

**Before release:**
| ☐ | Item |
|---|------|
| ☐ | All foundation constraints respected |
| ☐ | No hidden leverage paths |
| ☐ | No coercive defaults |
| ☐ | Human authority remains explicit |

**If uncertain at any step:**
```
→ pause
→ ask
→ or remain silent
```

---

## 📁 Implementation

```
src/core/checklist/
├── implementationChecklist.types.ts   # Types, sections, validation
└── index.ts                           # Module exports
```

---

## 💡 Usage Example

```typescript
import {
  IMPLEMENTATION_CHECKLIST,
  validateChecklist,
  updateItemStatus,
  canImplementationProceed,
  generateChecklistText,
} from '@chenu/core/checklist';

// Check if we can proceed
const { canProceed, reason } = canImplementationProceed(IMPLEMENTATION_CHECKLIST);
if (!canProceed) {
  console.error('Cannot proceed:', reason);
}

// Update an item status
const updated = updateItemStatus(
  IMPLEMENTATION_CHECKLIST,
  'S0-001',
  'passed',
  'developer@example.com'
);

// Validate entire checklist
const result = validateChecklist(updated);
console.log(`Passed: ${result.passedItems}/${result.totalItems}`);

// Generate text for documentation
const text = generateChecklistText();
```

---

## 🎯 Summary

| Section | Focus |
|---------|-------|
| 0 | Pre-conditions |
| 1 | Foundation integrity |
| 2 | Authority & decisions |
| 3 | Agent design |
| 4 | Silence modes |
| 5 | Narrative protection |
| 6 | Drift systems |
| 7 | Data ownership |
| 8 | Legacy mode |
| 9 | UI/UX ethics |
| 10 | XR layers |
| 11 | Logging |
| 12 | Attack surface |
| 13 | AI collaboration |
| 14 | Final gate |

---

## ⚠️ Remember

```
If integrity conflicts with functionality → INTEGRITY WINS

If uncertain at any step:
→ pause
→ ask
→ or remain silent
```

---

**CHE·NU values integrity over capability.** 💎

*CHE·NU — Governed Intelligence Operating System*

❤️ With love, for humanity.
