# CHE·NU Core Reference — Cryptographic Signing Guide

## 📜 Overview

This document describes the cryptographic signing process that protects the CHE·NU Core Reference from unauthorized modifications. The system uses **Ed25519** signatures over **SHA-256** hashes.

## 🔐 Authority Model

```
┌─────────────────────────────────────────────────────────────┐
│                    HUMAN AUTHORITY                          │
│                   (CHE-NU_FOUNDER)                          │
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────┐ │
│  │ Private Key │───>│   Signing   │───>│ Signed Document │ │
│  │ (SECRET)    │    │   Process   │    │ (Public)        │ │
│  └─────────────┘    └─────────────┘    └─────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    AI SYSTEMS                               │
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────┐ │
│  │ Public Key  │───>│ Verification│───>│ Allow/Reject    │ │
│  │ (Shared)    │    │   Process   │    │ Operations      │ │
│  └─────────────┘    └─────────────┘    └─────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 🛠️ Signing Process

### Prerequisites

- OpenSSL 1.1.1+ with Ed25519 support
- Access to the Core Reference JSON file
- Secure environment for key storage

### Step 1: Generate Key Pair

```bash
# Generate Ed25519 private key
openssl genpkey -algorithm ed25519 -out che_nu_core_private.key

# Extract public key
openssl pkey -in che_nu_core_private.key -pubout -out che_nu_core_public.key
```

**⚠️ SECURITY WARNING:**
- `che_nu_core_private.key` is SECRET - never share or commit
- Store in secure vault, HSM, or encrypted storage
- Only human authority should access

### Step 2: Canonicalize the JSON

The Core Reference must be canonicalized before hashing:

```bash
# Using the provided script
node scripts/sign-core-reference.js
```

Or manually:

```javascript
const fs = require('fs');

function canonicalizeJSON(obj) {
  if (obj === null || obj === undefined) return 'null';
  if (typeof obj !== 'object') return JSON.stringify(obj);
  if (Array.isArray(obj)) {
    return '[' + obj.map(canonicalizeJSON).join(',') + ']';
  }
  const sortedKeys = Object.keys(obj).sort();
  const pairs = sortedKeys.map(key => `"${key}":${canonicalizeJSON(obj[key])}`);
  return '{' + pairs.join(',') + '}';
}

const coreRef = JSON.parse(fs.readFileSync('chenu.core.reference.json'));
const canonical = canonicalizeJSON(coreRef);
fs.writeFileSync('CHE_NU_CORE_REFERENCE.canonical.json', canonical);
```

### Step 3: Compute SHA-256 Hash

```bash
# Compute hash
HASH=$(sha256sum CHE_NU_CORE_REFERENCE.canonical.json | cut -d' ' -f1)
echo "SHA-256: $HASH"
```

### Step 4: Sign the Hash

```bash
# Convert hash to binary
echo -n "$HASH" | xxd -r -p > hash.bin

# Sign with Ed25519
openssl pkeyutl -sign \
  -inkey che_nu_core_private.key \
  -rawin \
  -in hash.bin \
  -out signature.bin

# Convert to base64
SIGNATURE=$(base64 -w 0 signature.bin)
echo "Signature: $SIGNATURE"
```

### Step 5: Update Configuration

Edit `src/core/foundation/core.crypto.signature.json`:

```json
{
  "CHE_NU_CORE_REFERENCE_CRYPTO_SIGNATURE": {
    "signature": {
      "value": "<paste SIGNATURE here>"
    },
    "publicKey": {
      "value": "<paste content of che_nu_core_public.key>"
    },
    "signedBy": {
      "timestamp": "<current ISO timestamp>"
    }
  }
}
```

## ✅ Verification Process

### Automatic Verification

```typescript
import { verifyCoreReferenceSignature } from '@core/foundation';

const result = await verifyCoreReferenceSignature(coreReferenceJSON);

if (result.valid) {
  console.log('✅ Signature verified:', result.verifiedAt);
} else {
  console.error('❌ Verification failed:', result.message);
  console.error('Required actions:', result.action);
}
```

### Guard Usage

```typescript
import { guardCryptoSignature } from '@core/foundation';

// Throws if verification fails
await guardCryptoSignature(coreReferenceJSON);
```

### Manual Verification

```bash
# Extract signature
SIGNATURE=$(jq -r '.CHE_NU_CORE_REFERENCE_CRYPTO_SIGNATURE.signature.value' core.crypto.signature.json)
echo "$SIGNATURE" | base64 -d > signature.bin

# Compute hash of canonical JSON
HASH=$(sha256sum CHE_NU_CORE_REFERENCE.canonical.json | cut -d' ' -f1)
echo -n "$HASH" | xxd -r -p > hash.bin

# Verify
openssl pkeyutl -verify \
  -pubin -inkey che_nu_core_public.key \
  -rawin \
  -in hash.bin \
  -sigfile signature.bin

# Output: "Signature Verified Successfully" or error
```

## 🚫 AI Constraints

When signature is valid, AI systems:

| Operation | Allowed |
|-----------|---------|
| Reference Core Reference | ✅ |
| Build compatible modules | ✅ |
| Ask for clarification | ✅ |
| **Modify Core Reference** | ❌ |
| **Bypass human validation** | ❌ |
| **Change decision chains** | ❌ |
| **Alter authority rules** | ❌ |

When signature is invalid or missing:

```
⛔ ALL AI OPERATIONS HALTED
⛔ OUTPUT INVALIDATED
⛔ HUMAN INTERVENTION REQUIRED
```

## 📋 Validation Rules

```json
{
  "onInvalidSignature": [
    "reject_changes",
    "invalidate_ai_output", 
    "require_human_intervention"
  ],
  "onValidSignature": [
    "allow_development",
    "allow_ai_execution",
    "permit_compatible_modules"
  ]
}
```

## 🔄 Re-Signing Process

If the Core Reference needs to be updated:

1. **Human authority** makes changes to Core Reference JSON
2. Re-run canonicalization and hashing
3. Generate new signature with private key
4. Update `core.crypto.signature.json`
5. Commit changes

**Important:** Only human authority can perform re-signing.

## 🗂️ File Structure

```
src/core/foundation/
├── chenu.core.reference.json      # Core Reference (protected)
├── core.crypto.signature.json     # Signature config (public key + sig)
├── coreReference.ts               # Core Reference accessor
├── cryptoVerification.ts          # Verification system
└── index.ts                       # Module exports

scripts/
└── sign-core-reference.js         # Signing workflow helper

# Generated during signing (DO NOT COMMIT):
che_nu_core_private.key            # SECRET - Human authority only
che_nu_core_public.key             # Safe to distribute
CHE_NU_CORE_REFERENCE.canonical.json
hash.bin
signature.bin
```

## 📜 Foundation Statement

> "This hash represents the immutable foundation of CHE·NU. 
> Any deviation invalidates compatibility."
>
> — CHE-NU_FOUNDER, Human Authority

---

**Core Reference acknowledged. Foundation respected.** ✅
