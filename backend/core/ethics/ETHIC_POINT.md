# CHE·NU — ETHIC POINT INTEGRATION

## 🧭 Definition

An **Ethic Point** is a **STRUCTURAL MOMENT** where the system makes explicit:

- the active frame (PTC + Moral Context)
- human responsibility
- the possibility to reflect or ignore

It does not modify any flow.
It does not add any mandatory friction.

---

## ✅ What an Ethic Point IS

- A **beacon of consciousness**
- A **sovereignty landmark**
- A **structural reminder**

It protects CHE·NU's future without ever controlling its present.

---

## 🚫 What an Ethic Point is NOT

- ❌ Non-decisional
- ❌ Non-blocking
- ❌ Non-persuasive
- ❌ Non-moralistic

It is an **ARCHITECTURAL LANDMARK**, not control logic.

---

## 📍 Authorized Locations (4 ONLY)

| Location | ID | Description |
|----------|-----|-------------|
| Task Init | `task_init` | Creation of a task |
| Context Change | `context_change` | Change of context/sphere |
| XR Meeting | `xr_meeting` | XR/Meeting usage |
| Replay/Export | `replay_export` | Replay/Export/Publication |

**NO other location is authorized.**

---

## 🔤 Authorized Language

✅ **STRICTLY authorized:**
- "Cadre actif" (Active frame)
- "Responsabilité humaine" (Human responsibility)
- "Réflexion optionnelle" (Optional reflection)

❌ **STRICTLY forbidden:**
- warning
- recommendation
- judgment
- obligation

---

## 📦 Architecture

### Types (`src/ethics/ethicPoint.ts`)

```typescript
type EthicPointContext = {
  taskId: string;
  preApprovedContextId?: string;
  moralContextDeclared: boolean;
  silenceMode: boolean;
  timestamp: number;
};

type EthicPointLocation =
  | "task_init"
  | "context_change"
  | "xr_meeting"
  | "replay_export";
```

### Trigger Function (`src/ethics/triggerEthicPoint.ts`)

```typescript
function triggerEthicPoint(ctx: EthicPointContext): EthicPointResult {
  if (ctx.silenceMode) return null;
  
  return {
    visible: true,
    message: "Responsibility remains human. Assistance is optional.",
    contextSummary: {
      task: ctx.taskId,
      frameDefined: Boolean(ctx.preApprovedContextId),
      moralContext: ctx.moralContextDeclared
    }
  };
}
```

### Hook (`src/hooks/useEthicPoint.ts`)

```typescript
const { result, dismiss, silenceActive } = useEthicPoint({
  taskId: "task-123",
  location: "task_init",
});
```

### UI Components (`src/components/ethics/EthicPointBadge.tsx`)

```tsx
// Full badge
<EthicPointBadge result={result} location="task_init" />

// Minimal indicator
<EthicPointIndicator active={true} location="task_init" />

// Inline text
<EthicPointInline show={true} text="Cadre actif" />
```

---

## 🔒 ABSOLUTE RULES

1. **The Ethic Point never decides.**
2. **The Ethic Point never blocks.**
3. **The Ethic Point can always be ignored.**
4. **Silence disables the Ethic Point.**
5. **No morality history is preserved.**

---

## 🚫 ABSOLUTE PROHIBITIONS

- Ethical scores
- Red alerts
- Behavioral nudging
- Insistent reminder loops
- UX dependency on the Ethic Point

---

## 🔗 Relationship with Directive Guard

If a Directive Guard exists:
- It **can** feed the Ethic Point
- But **does not** trigger it

The Ethic Point:
- **Never calls** the Guard
- **Never analyzes** anything
- **Never accumulates** anything

---

## 📊 UI Specifications

| Property | Value |
|----------|-------|
| Blocking | ❌ Never |
| Dismissible | ✅ Always |
| Auto-hide | ✅ Default 5s |
| Position | Inline, Top, or Bottom |
| Visual | 🧭 icon + subtle text |

---

## 🎯 Summary

The Ethic Point is:
- A **structural marker**
- An **architectural reminder**
- A **sovereignty beacon**

It **NEVER**:
- Controls
- Blocks
- Judges
- Persists

**Silence mode disables everything.**

---

*CHE·NU — Ethics by Architecture, not Policy*
