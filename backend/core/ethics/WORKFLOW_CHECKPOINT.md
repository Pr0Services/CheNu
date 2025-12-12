# CHE·NU — WORKFLOW CHECKPOINT

## 🧭 Principe fondamental

Un Ethics Checkpoint n'est déclenché **QUE lorsque la responsabilité change d'échelle**.

Les workflows légers ne déclenchent **RIEN**.

---

## 📊 Définition d'une tâche lourde

```typescript
type WorkflowLoadLevel = "light" | "heavy";

type WorkflowContext = {
  workflowId: string;
  loadLevel: WorkflowLoadLevel;
  agentCount: number;
  crossesSpheres: boolean;
  producesPersistentOutput: boolean;
  xrInvolved: boolean;
};
```

**RÈGLE:**
- Si `loadLevel === "heavy"` → éligible au checkpoint
- Sinon → aucun checkpoint

Aucune inférence implicite autorisée.

---

## ✅ Conditions d'activation

Le checkpoint peut être déclenché **UNIQUEMENT SI:**

```
loadLevel === "heavy"
ET
(
  agentCount > 1
  OU crossesSpheres === true
  OU producesPersistentOutput === true
  OU xrInvolved === true
)
```

Si aucune condition n'est remplie → **SILENCE TOTAL**.

---

## ⏱️ Moment d'apparition

Le checkpoint apparaît:
- ✅ Au **MOMENT** de l'exécution du workflow
- ✅ **UNE SEULE FOIS** par workflow
- ❌ **Jamais** par agent individuel

Pas de répétition. Pas d'empilement.

---

## 📝 Contenu du checkpoint

### Contenu STRICTEMENT autorisé:

| Élément | Valeur |
|---------|--------|
| **ICON** | 🧭 |
| **MESSAGE** | "Workflow multi-agents actif · Responsabilité humaine maintenue" |
| **SOUS-TEXTE** (optionnel) | "Plusieurs agents coopèrent dans un cadre défini par vous." |

**AUCUNE autre information.**

---

## 🔀 Flux de décision

```
┌─────────────────────────────┐
│   User initiates task       │
└──────────────┬──────────────┘
               │
               ▼
       ┌───────────────┐
       │ Workflow      │
       │ declared?     │
       └───────┬───────┘
               │
       ┌───────┴───────┐
       │               │
       ▼               ▼
┌──────────────┐ ┌──────────────┐
│ Light task   │ │ Heavy task   │
└──────┬───────┘ └──────┬───────┘
       │                │
       ▼                ▼
┌──────────────┐ ┌──────────────┐
│ Execute      │ │ Multi-Agent  │
│ silently     │ │ Workflow     │
└──────────────┘ └──────┬───────┘
                        │
                        ▼
                 ┌──────────────┐
                 │ Ethics       │
                 │ Checkpoint 🧭│
                 └──────┬───────┘
                        │
                        ▼
                 ┌──────────────┐
                 │ Workflow     │
                 │ Execution    │
                 └──────┬───────┘
                        │
                        ▼
                 ┌──────────────┐
                 │ Result /     │
                 │ Output       │
                 └──────────────┘
```

---

## 📦 Architecture

### Types (`src/types/workflow.ts`)

```typescript
type WorkflowLoadLevel = "light" | "heavy";

type WorkflowContext = {
  workflowId: string;
  loadLevel: WorkflowLoadLevel;
  agentCount: number;
  crossesSpheres: boolean;
  producesPersistentOutput: boolean;
  xrInvolved: boolean;
};
```

### Trigger Function (`src/ethics/workflowCheckpoint.ts`)

```typescript
function triggerWorkflowCheckpoint(
  ctx: WorkflowContext,
  silenceMode: boolean
): WorkflowCheckpointResult {
  if (!shouldShowWorkflowCheckpoint(ctx, silenceMode)) {
    return null;
  }
  return {
    show: true,
    message: "Workflow multi-agents actif · Responsabilité humaine maintenue",
    subtext: "Plusieurs agents coopèrent dans un cadre défini par vous.",
  };
}
```

### Hook (`src/hooks/useWorkflowCheckpoint.ts`)

```typescript
const { result, shouldShow, isHeavyWorkflow } = useWorkflowCheckpoint({
  workflowId: "wf-123",
  loadLevel: "heavy",
  agentCount: 3,
  crossesSpheres: true,
});
```

### UI Component (`src/components/ethics/WorkflowCheckpointBanner.tsx`)

```tsx
<WorkflowCheckpointBanner result={result} showSubtext={true} />
```

---

## 🔒 RÈGLES STRICTES

1. Les workflows légers **ne déclenchent jamais** de checkpoint.
2. **Aucun calcul de complexité caché.**
3. **Aucun message d'avertissement.**
4. **Aucun jugement** sur le choix du workflow.
5. **Silence mode désactive tout** checkpoint.

---

## 🚫 INTERDIT ABSOLU

- ❌ Checkpoint sur chaque agent
- ❌ Message anxiogène
- ❌ Langage normatif
- ❌ Scoring de complexité
- ❌ Historique comportemental

---

## 🎯 Résumé

Les Ethics Checkpoints liés aux workflows multi-agents sont:

| Propriété | Valeur |
|-----------|--------|
| Fréquence | **Rares** |
| Signification | **Significatifs** |
| Intrusion | **Non intrusifs** |
| Alignement | **Souveraineté utilisateur** |

---

*CHE·NU — Ethics by Architecture, not Policy*
