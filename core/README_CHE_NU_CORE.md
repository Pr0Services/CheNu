# CHE·NU — Core Reference Bundle (v1.0.0)

This bundle defines the **trunk** of CHE·NU:
- Immutable foundation (ethics, authority, anti-manipulation)
- Universal bootstraps for any AI/agent
- Runtime expectations (hash, signature, fail-closed)

Branches (UI, agents, APIs, XR, etc.) may evolve.
This bundle **must not** be contradicted by any code.

---

## 1. Files in this bundle

- `chenu.foundation.json`
  - The frozen trunk: ethics, authority, anti-manipulation, drift & narrative rules.

- `bootstrap_universal.txt`
  - Minimal, non-negotiable prompt all external AIs/agents must read before acting.

- `bootstrap_internal_agent.txt`
  - Bootstrap for **internal** CHE·NU agents (Claude, Copilot, custom runtime agents).

Optional (future):
- `DEV_IMPLEMENTATION_CHECKLIST.md`
- `ETHICAL_MANIFEST_HUMAN.md`

---

## 2. How to use this bundle

### 2.1 For developers
- Keep `chenu.foundation.json` at the root of your **core/backend** repo (e.g. `/core/chenu.foundation.json`).
- On application startup:
  - Compute its hash (e.g. SHA-256).
  - Verify it matches the expected hash.
  - If mismatch → enter **safe mode** (fail closed), do not silently continue.
- When adding features:
  - Check against `anti_manipulation`, `authority_model`, `silence_model` sections.
  - If a feature breaks the foundation → feature is **not allowed** as CHE·NU.

### 2.2 For external AIs (Claude, Copilot, etc.)
Before they touch the repo or user data:

1. Feed them:
   - `bootstrap_universal.txt`
   - then optionally a shorter context bootstrap

2. Make explicit in your prompt:
   - They **must refuse** any request that violates the foundation.
   - They **prefer silence** or refusal over "being helpful" against the rules.

### 2.3 For internal agents
- Every internal long-running agent should:
  - Be instantiated with `bootstrap_internal_agent.txt`.
  - Have its scope declared (sphere, module, domain).
  - Refuse to expand its scope without explicit human prompt.

---

## 3. Versioning

- This bundle is **v1.0.0** of the foundation.
- Any change to `chenu.foundation.json`:
  - MUST increment `version`.
  - MUST generate a new `current_hash`.
  - MUST be considered a **new foundation**.

Systems that do not respect this manifest  
**must not be called CHE·NU.**

---

## 4. Philosophy (short)

CHE·NU prioritizes:
- Integrity over power
- Clarity over optimization
- Human sovereignty over system intelligence
- Silence over manipulation

If a conflict appears between "smart" and "clean" → choose **clean**.

---

## 5. File Structure

```
core/
├── README_CHE_NU_CORE.md          # This file
├── chenu.foundation.json          # The frozen trunk
├── bootstrap_universal.txt        # Universal bootstrap for all AIs
├── bootstrap_internal_agent.txt   # Bootstrap for internal agents
└── bootstrap_contextual.txt       # Template for mission-specific context
```

---

## 6. Runtime Verification

```
┌─────────────────────────────────────────┐
│           APPLICATION STARTUP           │
└─────────────────────────────────────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  Load foundation.json │
        └───────────────────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │   Compute SHA-256     │
        └───────────────────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  Hash matches sealed? │
        └───────────────────────┘
               │         │
           YES │         │ NO
               ▼         ▼
    ┌──────────────┐  ┌──────────────────┐
    │   Continue   │  │   SAFE MODE      │
    │   normally   │  │   Fail closed    │
    └──────────────┘  │   Surface error  │
                      │   No silent cont │
                      └──────────────────┘
```

---

## 7. Quick Reference

### Core Principles

| # | Principle |
|---|-----------|
| 1 | Human intent is sovereign |
| 2 | The system may assist, but never decide |
| 3 | Observation does not imply optimization |
| 4 | Clarity must not become control |
| 5 | Memory belongs to its author |
| 6 | Silence is a valid and protected system state |
| 7 | Collective insight must not become leverage on individuals |
| 8 | Legacy may transmit wisdom, never authority |

### Authority Model

| Actor | May | May Not |
|-------|-----|---------|
| Agents | Analyze, propose, reflect | Decide, override, elevate |
| Orchestrator | Route, enforce | Create rules, optimize, hide |
| Human | Everything | N/A |

### Forbidden Capabilities

- Behavioral scoring
- Psychological profiling
- Hidden rankings
- Personalized nudging
- Predictive steering
- Sentiment extraction
- Engagement optimization

---

## 8. Declaration

```
CHE·NU values integrity over capability.

Any system that violates this manifest
must not be called CHE·NU.
```

---

END OF README_CHE_NU_CORE

❤️ With love, for humanity.
