# CHE·NU — Legacy / Inheritance Mode

## 📜 Overview

**Status:** HUMAN CONTINUITY & RESPONSIBILITY TRANSFER  
**Authority:** HUMAN ONLY (ORIGINATOR)  
**Intent:** PRESERVE MEANING WITHOUT CONTROL

Legacy / Inheritance Mode exists to allow a human to consciously prepare, shape, and transmit parts of their CHE·NU environment to others **without imposing authority, intent, or direction**.

---

## 🌍 Philosophy

> **"On s'unit pour mieux construire — le contraire de diviser pour régner!"**
>
> *We unite to build better — the opposite of divide and conquer!*
>
> **L'humanité mérite de vivre dans l'intégrité sociétaire!**
>
> *Humanity deserves to live in societal integrity!*

---

## 🎯 Core Intent

| It Answers | It NEVER Answers |
|------------|------------------|
| "What do I choose to pass on?" | "How should others act?" |
| | "What must be continued?" |
| | "What outcomes should be achieved?" |

---

## 🔱 Fundamental Principle

```
Inheritance is not succession.
Legacy is not obligation.

Recipients receive visibility and context,
not mandates.
```

---

## 📐 Position in Architecture

```
Human Declaration
        ↓
LEGACY SELECTION & FRAMING
        ↓
READ-ONLY / LIMITED-RIGHTS BUNDLE
        ↓
Recipient Interpretation
```

### What Does NOT Transfer:

| Element | Transfers? |
|---------|------------|
| Automatic activation | ❌ |
| Agent transfer | ❌ |
| Orchestration continuity | ❌ |

---

## ✅ What CAN Be Passed On

A human may choose to pass on:

| Content Type | Passable? |
|--------------|-----------|
| Narrative Notes (selected) | ✅ |
| Decision Echoes (selected, read-only) | ✅ |
| Context declarations (historic) | ✅ |
| Timelines (partial or full) | ✅ |
| Structural maps (tree, spheres, flows) | ✅ |
| Methodological descriptions | ✅ |

**Nothing else.**

---

## 🚫 What CANNOT Be Passed On

**Explicitly forbidden — Legacy never includes leverage:**

| Content Type | Forbidden |
|--------------|-----------|
| Preference models | ❌ |
| Drift histories | ❌ |
| Agent memories | ❌ |
| Behavioral profiles | ❌ |
| Optimization logic | ❌ |
| Authority bindings | ❌ |

---

## 🎛️ Inheritance Modes

The originator may choose one of three modes. **No default is assumed.**

### A) Archive Inheritance

| Property | Value |
|----------|-------|
| Type | Static snapshot |
| Evolution | None |
| Commentary | None |

### B) Guided Legacy

| Property | Value |
|----------|-------|
| Type | With author commentary |
| Evolution | None |
| System guidance | None |

### C) Silent Legacy

| Property | Value |
|----------|-------|
| Type | Pure record |
| Evolution | None |
| Commentary | None |

---

## 📋 Framing & Disclaimers (MANDATORY)

Each legacy bundle MUST include:

| Element | Required | Immutable? |
|---------|----------|------------|
| Author identity | ✅ | ✅ |
| Timeframe covered | ✅ | ✅ |
| Explicit disclaimer | ✅ | ✅ |

### Mandatory Disclaimer (Cannot Be Removed):

```
"This does not prescribe action or belief."
```

---

## 👤 Recipient Experience

### Recipients MAY:

| Action | Allowed |
|--------|---------|
| Read | ✅ |
| Browse | ✅ |
| Export | ✅ |
| Reflect | ✅ |

### Recipients May NOT:

| Action | Forbidden |
|--------|-----------|
| Activate agents | ❌ |
| Trigger workflows | ❌ |
| Inherit decisions | ❌ |
| Continue timelines as authority | ❌ |

**Legacy is informational, not operational.**

---

## ⏱️ Temporal Separation Rule

**A legacy bundle is temporally sealed.**

Recipients cannot:

| Action | Allowed? |
|--------|----------|
| Append to original timelines | ❌ |
| Modify decision echoes | ❌ |
| Extend narratives as continuation | ❌ |
| Create their own | ✅ |

---

## 🥽 XR / Universe View

In XR:

| Aspect | Description |
|--------|-------------|
| Appearance | Preserved structure |
| Active systems | None |
| Living agents | None |
| Metaphor | **A monument, not a machine** |

---

## 🔒 Failsafes

**The act must be deliberate.**

| Failsafe | Enforced |
|----------|----------|
| Cannot be triggered by agents | ✅ |
| Cannot be automated | ✅ |
| Cannot be conditional | ✅ |
| Cannot be revoked retroactively | ✅ |

---

## 📜 Ethical Declaration

```
Legacy / Inheritance Mode exists to ensure
that continuity never becomes control.

Wisdom may be shared.
Authority must not be inherited.

The future remains sovereign.
```

---

## 📁 Implementation

```
src/core/legacy/
├── legacy.types.ts   # Core types, modes, helpers
└── index.ts          # Module exports
```

---

## 💡 Usage Example

```typescript
import {
  createLegacyBundle,
  sealLegacyBundle,
  canBePassedOn,
  isForbiddenContent,
  MANDATORY_DISCLAIMER,
} from '@chenu/core/legacy';

// Validate content type
canBePassedOn('narrative-notes'); // true
isForbiddenContent('preference-models'); // true - FORBIDDEN!

// Create a legacy bundle
const bundle = createLegacyBundle(
  'author_123',
  'guided', // Guided Legacy mode
  { start: '2024-01-01', end: '2025-12-31' }
);

// Add content
bundle.content.narrativeNotes = [
  {
    id: 'note_1',
    content: 'My journey building CHE·NU...',
    timestamp: '2024-06-15',
    authorCommentary: 'This was a turning point.',
  },
];

// Seal the bundle (immutable after this)
const sealedBundle = sealLegacyBundle(bundle);

// The disclaimer is always present
console.log(sealedBundle.framing.disclaimer);
// → "This does not prescribe action or belief."
```

---

## 🔄 Relationship to Other Systems

### Connects To (Read-Only):

| System | Relationship |
|--------|--------------|
| Narrative Notes | Can be selected for legacy |
| Decision Echoes | Can be included (read-only) |
| Timelines | Can be included (partial/full) |

### Never Connects To:

| System | Connected? |
|--------|------------|
| Preference models | ❌ Never |
| Drift detection | ❌ Never |
| Agent memories | ❌ Never |
| Orchestration | ❌ Never |

---

## 🌟 Design Philosophy

This system is explicitly designed to ensure **continuity without control**:

| Traditional Inheritance | CHE·NU Legacy |
|------------------------|---------------|
| Authority transfers | Authority does NOT transfer |
| Mandates continue | No mandates |
| Obligations bind | No obligations |
| Systems activate | Systems remain dormant |
| Past controls future | Future remains sovereign |

---

**Wisdom may be shared. Authority must not be inherited.** 🌍

**The future remains sovereign.** ✨

*CHE·NU — Governed Intelligence Operating System*
