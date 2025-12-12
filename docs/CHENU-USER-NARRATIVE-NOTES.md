# CHE·NU — User-Authored Narrative Notes

## 📜 Overview

**Status:** HUMAN EXPRESSION LAYER  
**Authority:** HUMAN ONLY  
**Intent:** CAPTURE MEANING WITHOUT INFERENCE

User-Authored Narrative Notes exist to allow a human to write their own understanding, reflection, or meaning about events, **without being interpreted, analyzed, or repurposed by the system**.

---

## 🎯 Core Intent

| They Answer | They NEVER Answer |
|-------------|-------------------|
| "What do I want to express or remember?" | "What should the system learn?" |
| | "What pattern does this represent?" |

---

## 🏗️ Position in Architecture

```
Human Expression
        ↓
USER-AUTHORED NARRATIVE NOTES
        ↓
Human Reading ONLY
```

### NO Connection To:

| System | Connected? |
|--------|------------|
| Learning systems | ❌ |
| Preference models | ❌ |
| Context interpretation | ❌ |
| Orchestration | ❌ |
| Analytics | ❌ |

---

## 🔐 Ownership & Control

| Rule | Enforced |
|------|----------|
| Notes authored by humans only | ✅ |
| Notes owned by the author | ✅ |
| Notes private by default | ✅ |
| Sharing explicit and optional | ✅ |

---

## 🚫 System Restrictions

**No system component may:**

| Action | Status |
|--------|--------|
| Summarize notes | ❌ Never |
| Analyze sentiment | ❌ Never |
| Extract signals | ❌ Never |
| Generate insights | ❌ Never |
| Mine notes | ❌ Never |
| Auto-reference notes | ❌ Never |
| Pattern analyze | ❌ Never |
| Compare historically | ❌ Never |

---

## 🏷️ Note Types (Non-Hierarchical)

Labels are for **organization ONLY**:

| Label | Purpose |
|-------|---------|
| `reflection` | Personal reflection |
| `observation` | Something observed |
| `intention` | Future intent |
| `reminder` | Something to remember |
| `question` | Open question |
| `insight` | Personal insight |
| `narrative` | Story/narrative form |
| `[custom]` | User-defined |

**Labels create no hierarchy. No label is "better" than another.**

---

## 📊 Data Model

```typescript
interface UserNarrativeNote {
  noteId: string;
  authorId: HumanID;
  createdAt: ISODate;
  associatedScope?: {
    decisionId?: string;
    contextId?: string;
    narrativeId?: string;
    timeframe?: TimeRange;
  };
  label?: string;
  content: string;
  visibility: "private" | "shared";
  immutable: false;
}
```

---

## ✏️ Editing Rules

| Rule | Status |
|------|--------|
| Notes may be edited by the author | ✅ |
| Prior versions may be kept (optional) | ✅ |
| No forced versioning | ✅ |
| No comparison prompts | ✅ |

**Editing is non-analytical.**

---

## 🖥️ Presentation Rules

Notes are presented as:

| Property | Value |
|----------|-------|
| Format | Plain text |
| Highlights | None |
| Emphasis | None |
| Scoring | None |
| Color semantics | None |

---

## 👤 User Permissions

### User MAY:

| Action | Allowed |
|--------|---------|
| Write | ✅ |
| Re-read | ✅ |
| Hide | ✅ |
| Export | ✅ |
| Delete | ✅ |

### System must NOT:

| Action | Forbidden |
|--------|-----------|
| Suggest edits | ❌ |
| Prompt reflection | ❌ |
| Recommend writing | ❌ |
| Auto-categorize | ❌ |
| Generate summaries | ❌ |

---

## 🔗 Relation to Other Systems

### Notes MAY be attached to (spatial only):

| Element | Attachable |
|---------|------------|
| Decision Echoes | ✅ |
| Narratives | ✅ |
| Timeline segments | ✅ |
| Contexts | ✅ |
| Spheres | ✅ |

### Notes do NOT influence:

| System | Influenced? |
|--------|-------------|
| Drift detection | ❌ |
| Preferences | ❌ |
| Context selection | ❌ |
| Agent behavior | ❌ |
| Orchestration | ❌ |
| Learning systems | ❌ |

**Attachment is SPATIAL, not LOGICAL.**

---

## 🥽 XR / Universe View

In XR:

| Behavior | Description |
|----------|-------------|
| Personal inscriptions | Notes appear as personal inscriptions |
| Visibility | Only author sees them (unless shared) |
| No system overlays | System doesn't annotate notes |

**The environment receives the note; the system does not.**

---

## 🛡️ Failsafes

| Failsafe | Enforced |
|----------|----------|
| Notes are never mined | ✅ |
| Notes are never auto-referenced | ✅ |
| Notes are never required | ✅ |
| Notes generate no alerts | ✅ |
| If ambiguity: system remains silent | ✅ |

---

## 📜 System Declaration

```
User-Authored Narrative Notes preserve human meaning
without converting it into system logic.

Expression remains human.
Interpretation remains human.
Memory remains owned.
```

---

## 📁 Implementation

```
src/ui/notes/
├── narrativeNotes.types.ts    # Types & constants
├── index.ts                   # Module exports
├── useNarrativeNotes.ts       # (Future) Hook
├── NarrativeNoteEditor.tsx    # (Future) Editor
└── NarrativeNoteView.tsx      # (Future) Display
```

---

## 💡 Usage Example

```typescript
import { createNarrativeNote } from '@chenu/ui/notes';

// Create a private reflection note
const note = createNarrativeNote(
  'user_123',
  'Today I realized the project needs more clarity before we proceed.',
  {
    label: 'reflection',
    visibility: 'private',
    associatedScope: {
      decisionId: 'decision_456',
    },
  }
);

// The system learns NOTHING from this note.
// It exists only for human reading.
```

---

**Expression remains human. Memory remains owned.** ✅

*CHE·NU — Governed Intelligence Operating System*
