# CHE·NU — Sphere Schema & Generator

## 📋 Overview

**Status:** FOUNDATIONAL  
**Purpose:** Structural template and factory for sphere definitions

Every sphere in CHE·NU must conform to this schema. The generator enforces inheritance of global laws, privacy guarantees, and human sovereignty.

**No sphere may override foundational protections.**

---

## 🏭 Sphere Generator

The preferred way to create spheres is through `generateSphere()`:

```typescript
import { generateSphere } from '@chenu/core/sphere';

const mySphere = generateSphere({
  name: "Personal",
  id: "personal",
  emoji: "👤",
  description: "Espace privé de l'individu",
  scope: {
    included: ["notes", "reflection", "private goals"],
    excluded: ["performance scoring", "external metrics"],
  },
  agents: { enabled: true },
  inter_sphere_interaction: false,
});
```

The generator automatically enforces:
- Foundation inheritance ✅
- Privacy inheritance ✅
- Human data ownership ✅
- Forbidden capabilities ✅
- Reversibility ✅

---

## 📁 File Structure

Each sphere generates these files:

```
/spheres/<sphere_id>/
 ├─ sphere.yaml           # Complete definition
 ├─ sphere.manifest.md    # Human-readable manifest
 ├─ sphere.validation.json # Validation results
 └─ README.md             # Documentation
```

Generate files with:

```typescript
import { generateSphereFiles } from '@chenu/core/sphere';

const files = generateSphereFiles(mySphere);
// files.yaml, files.manifest, files.validation, files.readme
```

---

## 💎 Core Principle

```yaml
inherits:
  foundation: true          # CANNOT be overridden
  privacy: true             # CANNOT be overridden
  global_structural_laws: true
  silence_modes: true
```

Spheres **inherit** from the global foundation. They cannot opt out of:
- Tree Laws
- Privacy guarantees
- Human data sovereignty
- Silence modes

---

## 🌐 Schema Structure

### 1. Identity

```yaml
sphere:
  name: "Personal"
  id: "personal"
  emoji: "🏠"
  description: "Your private space"
  version: "1.0.0"
```

### 2. Context Isolation

```yaml
context:
  isolated_by_default: true
  requires_explicit_bridge: true
  bridge_types:
    - "manual_reference"
    - "explicit_user_action"
```

Spheres are **isolated by default**. Cross-sphere communication requires explicit user action.

### 3. Time

```yaml
time:
  local_timeline: true
  states:
    - active
    - dormant
    - archived
  no_global_pressure: true
```

Each sphere has its own timeline. **No urgency** from the system.

### 4. Agents

```yaml
agents:
  allowed: true
  scope_limited: true
  can_create_subagents: true
  forbidden_capabilities:
    - profiling              # NEVER allowed
    - implicit_memory        # NEVER allowed
    - cross_sphere_observation  # NEVER allowed
```

### 5. Data Sovereignty

```yaml
data:
  ownership: "human"         # ALWAYS human
  private_by_default: true
  exportable: true           # ALWAYS exportable
  deletable_without_justification: true
```

### 6. Silence Modes

```yaml
silence_modes:
  available:
    - context_recovery
    - visual_silence
    - silent_review
  behavior_during_silence:
    learning: false
    suggestion: false
    analytics: "minimal"
```

### 7. UX Principles

```yaml
ux:
  default_state: "minimal"
  progressive_disclosure: true
  no_urgency_patterns: true     # No dark patterns
  no_performance_indicators: true  # No gamification
```

### 8. Reversibility

```yaml
reversibility:
  enabled: true
  reversible_actions:
    - agent_creation
    - workflow_change
    - structure_edit
  irreversible_only_with_consent: true
```

### 9. Interactions

```yaml
interactions:
  allowed: true
  requires_explicit_user_action: true
  no_automatic_sync: true
```

### 10. Validation

```yaml
validation:
  respects_all_global_laws: true
  no_privacy_violation: true
  no_behavioral_optimization: true
  reversible_by_default: true
  approved_by_human: true
```

---

## ⚡ Quick Start

```typescript
import { createSphere, validateSphere } from '@chenu/core/sphere';

// Create a new sphere
const mySphere = createSphere({
  name: 'My Project',
  id: 'my-project',
  emoji: '🚀',
  description: 'A space for my special project',
  version: '1.0.0',
});

// Validate the sphere
const errors = validateSphere(mySphere);
if (errors.length === 0) {
  console.log('✅ Sphere is valid');
}
```

---

## 🛡️ Forbidden Capabilities

These capabilities are **NEVER** allowed in any sphere:

| Capability | Reason |
|------------|--------|
| `profiling` | No user profiling allowed |
| `implicit_memory` | No hidden learning |
| `cross_sphere_observation` | No spying across spheres |

---

## 📦 Default Spheres

| Sphere | ID | Emoji | Purpose |
|--------|-----|-------|---------|
| Personal | `personal` | 🏠 | Private space |
| Business | `business` | 💼 | Professional work |
| Creative | `creative` | 🎨 | Artistic expression |
| Scholar | `scholar` | 📚 | Learning & research |
| Wellness | `wellness` | 🌿 | Health & wellbeing |
| Construction | `construction` | 🏗️ | Quebec construction |
| Family | `family` | 👨‍👩‍👧‍👦 | Family coordination |
| Finance | `finance` | 💰 | Financial management |
| Sandbox | `sandbox` | 🧪 | Experimentation |
| Archive | `archive` | 📦 | Long-term storage |

---

## ✅ Validation Rules

A sphere is **invalid** if:

- `inherits.foundation` is `false`
- `inherits.privacy` is `false`
- `data.ownership` is not `"human"`
- Any forbidden capability is allowed
- `no_urgency_patterns` is `false`
- `no_privacy_violation` is `false`
- `no_behavioral_optimization` is `false`

```typescript
import { isSphereValid } from '@chenu/core/sphere';

if (!isSphereValid(mySphere)) {
  throw new Error('Sphere violates foundational rules');
}
```

---

## 📁 Files

```
core/
└── sphere.schema.yaml       # YAML template

src/core/sphere/
├── sphereSchema.types.ts    # TypeScript types
├── sphereDefinitions.ts     # Default spheres
└── index.ts                 # Module exports
```

---

## 🔗 Related

- [Foundation Lock](./CHENU-FOUNDATION-LOCK.md) — Cryptographic verification
- [Privacy Guarantees](./CHENU-PRIVACY-GUARANTEES.md) — Privacy framework
- [Tree Laws](./CHENU-MANIFESTE.md) — Core constitution

---

**Every sphere inherits. Every sphere respects. Every sphere protects.** 🌐

*CHE·NU — Governed Intelligence Operating System*

❤️ With love, for humanity.
