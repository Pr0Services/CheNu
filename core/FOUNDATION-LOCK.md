# CHE·NU — Foundation Lock

This foundation defines the immutable laws of CHE·NU.

It may evolve only through:
- explicit versioning
- human consent
- cryptographic verification

No agent, system, or optimization may override it.

---

## Verification Protocol

```bash
# Generate hash
sha256sum chenu.foundation.json > chenu.foundation.hash

# Sign with GPG
gpg --sign --detach-sign --armor chenu.foundation.json
```

## Runtime Check

```typescript
verifyHash("chenu.foundation.json", expectedHash)
  ? startSystem()
  : halt("FOUNDATION INTEGRITY FAILURE")
```

---

## Evolution Rules

The foundation may evolve only through:

| Rule | Requirement |
|------|-------------|
| Versioning | ✅ Explicit version change required |
| Consent | ✅ Human approval required |
| Verification | ✅ New cryptographic signature required |

## Override Prohibitions

| Actor | Override Allowed |
|-------|-----------------|
| Agent | ❌ FORBIDDEN |
| System | ❌ FORBIDDEN |
| Optimization | ❌ FORBIDDEN |
| Human (with proper process) | ✅ ALLOWED |

---

## Integrity Failure Response

If hash verification fails:

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

System halts. No bypass. No override.

---

## Files

```
core/
├── chenu.foundation.json      # The foundation
├── chenu.foundation.hash      # SHA-256 hash
└── chenu.foundation.json.asc  # GPG signature

scripts/
└── foundation-lock.sh         # Locking ceremony

src/core/lock/
├── foundationLock.ts          # Runtime verification
└── index.ts                   # Module exports
```

---

## Usage

```typescript
import { createLockedSystem } from '@chenu/core/lock';

const EXPECTED_HASH = 'abc123...'; // From chenu.foundation.hash
const VERSION = '1.0.0';

const { lock, guard, start } = createLockedSystem(EXPECTED_HASH, VERSION);

// Start system with verification
await start(foundationContent, () => {
  console.log('CHE·NU is running with verified foundation');
});

// Guard critical operations
const result = await guard(async () => {
  return criticalOperation();
}, 'critical-operation');
```

---

Signed consciously,
for integrity over power.

---

**CHE·NU values integrity over capability.** 💎

*CHE·NU — Governed Intelligence Operating System*

❤️ With love, for humanity.
