# CHE·NU — Foundation Lock

## 📋 Overview

**Status:** FOUNDATIONAL  
**Purpose:** Cryptographic verification of foundation integrity

---

## 💎 Core Declaration

```
This foundation defines the immutable laws of CHE·NU.

It may evolve only through:
- explicit versioning
- human consent
- cryptographic verification

No agent, system, or optimization may override it.

Signed consciously,
for integrity over power.
```

---

## 🔐 Verification Protocol

### Step 1: Generate Hash

```bash
sha256sum chenu.foundation.json > chenu.foundation.hash
```

Output:
```
<hash>  chenu.foundation.json
```

### Step 2: Sign with GPG

```bash
gpg --sign --detach-sign --armor chenu.foundation.json
```

Creates: `chenu.foundation.json.asc`

### Step 3: Runtime Verification

```typescript
verifyHash("chenu.foundation.json", expectedHash)
  ? startSystem()
  : halt("FOUNDATION INTEGRITY FAILURE")
```

---

## ⚡ Quick Start

```typescript
import { createLockedSystem } from '@chenu/core/lock';

// Your expected hash (from chenu.foundation.hash)
const EXPECTED_HASH = 'a1b2c3d4e5f6...';
const VERSION = '1.0.0';

// Create locked system
const { lock, guard, start } = createLockedSystem(EXPECTED_HASH, VERSION);

// Start with verification
await start(foundationContent, () => {
  console.log('✅ CHE·NU running with verified foundation');
  initializeApplication();
});
```

---

## 🛡️ Guard Critical Operations

```typescript
// Wrap critical operations with foundation guard
const result = await guard(async () => {
  // This only runs if foundation is valid
  return performCriticalDecision();
}, 'critical-decision');
```

---

## 📊 Lock Status

| Status | Meaning |
|--------|---------|
| `LOCKED` | Foundation verified and locked ✅ |
| `UNLOCKED` | Not yet verified |
| `TAMPERED` | Hash mismatch detected ⛔ |
| `MISSING` | Foundation file not found |
| `SIGNATURE_INVALID` | GPG signature invalid |

---

## 🔄 Evolution Rules

The foundation may evolve **ONLY** through:

| Requirement | Status |
|-------------|--------|
| Explicit versioning | ✅ Required |
| Human consent | ✅ Required |
| Cryptographic verification | ✅ Required |

### Override Prohibitions:

| Actor | Can Override? |
|-------|--------------|
| Agent | ❌ FORBIDDEN |
| System | ❌ FORBIDDEN |
| Optimization | ❌ FORBIDDEN |
| Human (with process) | ✅ Allowed |

---

## ⛔ Integrity Failure Response

If verification fails:

```
╔═══════════════════════════════════════════════════════╗
║         ⛔ FOUNDATION INTEGRITY FAILURE               ║
╠═══════════════════════════════════════════════════════╣
║                                                       ║
║  The system cannot proceed without a valid foundation.║
║  No agent, system, or optimization may override this. ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
```

**Result:** System HALTS. No bypass. No override.

---

## 📁 Files

```
core/
├── chenu.foundation.json       # The immutable foundation
├── chenu.foundation.hash       # SHA-256 hash
├── chenu.foundation.json.asc   # GPG signature
└── FOUNDATION-LOCK.md          # Declaration

scripts/
└── foundation-lock.sh          # Locking ceremony script

src/core/lock/
├── foundationLock.ts           # Runtime verification
└── index.ts                    # Module exports
```

---

## 💡 API Reference

### computeHash(content)

Compute SHA-256 hash of content.

```typescript
const hash = await computeHash(foundationJson);
```

### verifyHash(content, expectedHash, file?)

Verify hash matches expected value.

```typescript
const result = await verifyHash(content, expectedHash);
// { valid: true, expectedHash: '...', actualHash: '...', ... }
```

### FoundationLock

Main class for foundation management.

```typescript
const lock = new FoundationLock(expectedHash, version);
await lock.verifyAndLock(content);

if (lock.isLocked()) {
  // Proceed safely
}

if (lock.isTampered()) {
  lock.halt('Tampered foundation detected');
}
```

### createFoundationGuard(lock)

Create a guard function for critical operations.

```typescript
const guard = createFoundationGuard(lock);
const result = await guard(() => criticalOp(), 'op-name');
```

### FoundationEvolutionTracker

Track foundation evolution history.

```typescript
const tracker = new FoundationEvolutionTracker();
tracker.recordEvolution({
  fromVersion: '1.0.0',
  toVersion: '1.1.0',
  reason: 'Added new protection',
  approvedBy: 'human@example.com',
  approvedAt: new Date().toISOString(),
  previousHash: 'abc...',
  newHash: 'def...',
  changelog: ['Added privacy rule'],
});

// Verify chain integrity
const valid = tracker.verifyChain();
```

---

## 🎯 Integration Example

```typescript
// main.ts
import { createLockedSystem, FOUNDATION_LOCK_DECLARATION } from '@chenu/core/lock';
import foundationJson from '../core/chenu.foundation.json';

const EXPECTED_HASH = process.env.FOUNDATION_HASH!;
const VERSION = '1.0.0';

async function main() {
  const { start } = createLockedSystem(EXPECTED_HASH, VERSION);

  await start(JSON.stringify(foundationJson), () => {
    // Foundation verified - safe to proceed
    console.log(FOUNDATION_LOCK_DECLARATION);
    initializeChenu();
  });
}

main().catch(console.error);
```

---

## ⚠️ Remember

```
verifyHash("chenu.foundation.json", expectedHash)
  ? startSystem()
  : halt("FOUNDATION INTEGRITY FAILURE")
```

**No agent, system, or optimization may override this.**

---

Signed consciously,
for integrity over power.

---

**CHE·NU values integrity over capability.** 💎

*CHE·NU — Governed Intelligence Operating System*

❤️ With love, for humanity.
