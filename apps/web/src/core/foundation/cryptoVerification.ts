/* =====================================================
   CHE·NU — CRYPTOGRAPHIC SIGNATURE VERIFICATION
   Status: FOUNDATION FREEZE
   Version: 1.0
   
   📜 PURPOSE:
   Verify Ed25519 signatures on Core Reference documents.
   Any invalid signature MUST halt execution.
   
   📜 AUTHORITY:
   - Human authority generates private key
   - Public key distributed for verification
   - AI systems CANNOT bypass this verification
   ===================================================== */

import cryptoSignatureData from './core.crypto.signature.json';

/* =========================================================
   TYPES
   ========================================================= */

export interface CryptoSignatureConfig {
  referenceVersion: string;
  status: 'FOUNDATION_FREEZE' | 'DRAFT' | 'DEPRECATED';
  hashing: {
    algorithm: string;
    input: string;
    canonicalization: string;
  };
  signature: {
    algorithm: string;
    encoding: string;
    value: string;
    note?: string;
  };
  publicKey: {
    algorithm: string;
    encoding: string;
    value: string;
    note?: string;
  };
  signedBy: {
    role: string;
    identifier: string;
    timestamp: string | null;
  };
  validationRules: {
    requiredForExecution: boolean;
    onInvalidSignature: string[];
    onValidSignature: string[];
  };
  aiConstraints: {
    mustIncludeAsIs: boolean;
    cannotModify: boolean;
    cannotReinterpret: boolean;
    cannotOptimize: boolean;
    treatAsImmutableLaw: boolean;
    verifyWhenInstructed: boolean;
    refuseConflictingRequests: boolean;
  };
  allowedOperations: string[];
  forbiddenOperations: string[];
}

export type SignatureVerificationResult =
  | { valid: true; message: string; verifiedAt: string }
  | { valid: false; message: string; action: string[] };

export type CanonicalizeResult = {
  canonical: string;
  hash?: string;
};

/* =========================================================
   CONSTANTS
   ========================================================= */

const PENDING_VALUES = [
  'PENDING_HUMAN_SIGNATURE',
  'PENDING_PUBLIC_KEY',
  'REPLACE_WITH_ACTUAL',
];

/* =========================================================
   SIGNATURE CONFIG ACCESS
   ========================================================= */

/**
 * Get the cryptographic signature configuration.
 */
export function getCryptoSignatureConfig(): CryptoSignatureConfig {
  return cryptoSignatureData.CHE_NU_CORE_REFERENCE_CRYPTO_SIGNATURE as CryptoSignatureConfig;
}

/**
 * Check if signature has been set by human authority.
 */
export function isSignatureSet(): boolean {
  const config = getCryptoSignatureConfig();
  return !PENDING_VALUES.some(
    (v) => config.signature.value.includes(v) || config.publicKey.value.includes(v)
  );
}

/**
 * Get the public key for verification.
 */
export function getPublicKey(): string {
  return getCryptoSignatureConfig().publicKey.value;
}

/**
 * Get the stored signature.
 */
export function getStoredSignature(): string {
  return getCryptoSignatureConfig().signature.value;
}

/* =========================================================
   AI CONSTRAINTS
   ========================================================= */

/**
 * Get AI constraints from config.
 */
export function getAIConstraints(): CryptoSignatureConfig['aiConstraints'] {
  return getCryptoSignatureConfig().aiConstraints;
}

/**
 * Check if an operation is allowed.
 */
export function isOperationAllowed(operation: string): boolean {
  const config = getCryptoSignatureConfig();
  return config.allowedOperations.includes(operation);
}

/**
 * Check if an operation is forbidden.
 */
export function isOperationForbidden(operation: string): boolean {
  const config = getCryptoSignatureConfig();
  return config.forbiddenOperations.includes(operation);
}

/**
 * Validate AI operation request.
 */
export function validateAIOperation(operation: string): {
  allowed: boolean;
  reason: string;
} {
  if (isOperationForbidden(operation)) {
    return {
      allowed: false,
      reason: `Operation "${operation}" is explicitly forbidden by Core Reference authority`,
    };
  }

  if (isOperationAllowed(operation)) {
    return {
      allowed: true,
      reason: `Operation "${operation}" is permitted`,
    };
  }

  // Unknown operation - default to cautious rejection
  return {
    allowed: false,
    reason: `Operation "${operation}" is not in the allowed list - requires human review`,
  };
}

/* =========================================================
   CANONICALIZATION
   ========================================================= */

/**
 * Canonicalize a JSON object for hashing.
 * Uses sorted keys and UTF-8 encoding.
 */
export function canonicalizeJSON(obj: unknown): string {
  if (obj === null || obj === undefined) {
    return 'null';
  }

  if (typeof obj !== 'object') {
    return JSON.stringify(obj);
  }

  if (Array.isArray(obj)) {
    return '[' + obj.map(canonicalizeJSON).join(',') + ']';
  }

  const sortedKeys = Object.keys(obj as Record<string, unknown>).sort();
  const pairs = sortedKeys.map((key) => {
    const value = (obj as Record<string, unknown>)[key];
    return `"${key}":${canonicalizeJSON(value)}`;
  });

  return '{' + pairs.join(',') + '}';
}

/**
 * Create canonical JSON file content.
 */
export function createCanonicalFile(obj: unknown): CanonicalizeResult {
  const canonical = canonicalizeJSON(obj);
  return { canonical };
}

/* =========================================================
   HASH COMPUTATION (Browser/Node compatible)
   ========================================================= */

/**
 * Compute SHA-256 hash of data.
 * Works in both browser and Node.js environments.
 */
export async function computeSHA256(data: string): Promise<string> {
  // Browser environment
  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  // Node.js environment
  if (typeof require !== 'undefined') {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const crypto = require('crypto');
      return crypto.createHash('sha256').update(data, 'utf8').digest('hex');
    } catch {
      throw new Error('Crypto module not available');
    }
  }

  throw new Error('No crypto implementation available');
}

/* =========================================================
   SIGNATURE VERIFICATION
   ========================================================= */

/**
 * Verify Ed25519 signature.
 * This is a placeholder - actual implementation requires crypto library.
 * 
 * In production, use:
 * - Node.js: crypto.verify('ed25519', ...)
 * - Browser: tweetnacl or noble-ed25519
 */
export async function verifyEd25519Signature(
  message: string,
  signature: string,
  publicKey: string
): Promise<boolean> {
  // Check if signature is pending
  if (!isSignatureSet()) {
    console.warn('[CHE·NU] Signature not yet set by human authority');
    return false;
  }

  // Node.js implementation
  if (typeof require !== 'undefined') {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const crypto = require('crypto');
      
      // Decode base64 signature
      const signatureBuffer = Buffer.from(signature, 'base64');
      
      // Create public key object
      const keyObject = crypto.createPublicKey({
        key: publicKey,
        format: 'pem',
        type: 'spki',
      });
      
      // Verify
      return crypto.verify(
        null, // Ed25519 doesn't use a separate hash
        Buffer.from(message, 'utf8'),
        keyObject,
        signatureBuffer
      );
    } catch (error) {
      console.error('[CHE·NU] Signature verification failed:', error);
      return false;
    }
  }

  // Browser - would need tweetnacl or similar
  console.warn('[CHE·NU] Browser Ed25519 verification requires external library');
  return false;
}

/**
 * Full signature verification workflow.
 */
export async function verifyCoreReferenceSignature(
  coreReferenceJSON: unknown
): Promise<SignatureVerificationResult> {
  const config = getCryptoSignatureConfig();

  // Check if signature is configured
  if (!isSignatureSet()) {
    return {
      valid: false,
      message: 'Signature not yet configured by human authority',
      action: ['require_human_intervention'],
    };
  }

  try {
    // Canonicalize the input
    const canonical = canonicalizeJSON(coreReferenceJSON);

    // Compute hash
    const hash = await computeSHA256(canonical);

    // Verify signature
    const isValid = await verifyEd25519Signature(
      hash,
      config.signature.value,
      config.publicKey.value
    );

    if (isValid) {
      return {
        valid: true,
        message: 'Core Reference signature verified successfully',
        verifiedAt: new Date().toISOString(),
      };
    } else {
      return {
        valid: false,
        message: 'Signature verification failed - possible tampering detected',
        action: config.validationRules.onInvalidSignature,
      };
    }
  } catch (error) {
    return {
      valid: false,
      message: `Verification error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      action: config.validationRules.onInvalidSignature,
    };
  }
}

/* =========================================================
   GUARD FUNCTIONS
   ========================================================= */

/**
 * Guard that throws if signature verification fails.
 */
export async function guardCryptoSignature(
  coreReferenceJSON: unknown
): Promise<void> {
  const result = await verifyCoreReferenceSignature(coreReferenceJSON);

  if (!result.valid) {
    const failResult = result as { valid: false; message: string; action: string[] };
    throw new Error(
      `[CHE·NU CRYPTO VIOLATION] ${failResult.message}\n` +
        `Required actions: ${failResult.action.join(', ')}`
    );
  }
}

/**
 * Guard that checks AI operation constraints.
 */
export function guardAIOperation(operation: string): void {
  const validation = validateAIOperation(operation);

  if (!validation.allowed) {
    throw new Error(
      `[CHE·NU AI CONSTRAINT VIOLATION] ${validation.reason}`
    );
  }
}

/**
 * Guard that ensures Core Reference must be included as-is.
 */
export function guardCoreReferenceIntegrity(): void {
  const constraints = getAIConstraints();

  if (!constraints.mustIncludeAsIs) {
    throw new Error(
      '[CHE·NU INTEGRITY VIOLATION] Core Reference must be included as-is'
    );
  }

  if (!constraints.treatAsImmutableLaw) {
    throw new Error(
      '[CHE·NU INTEGRITY VIOLATION] Core Reference must be treated as immutable law'
    );
  }
}

/* =========================================================
   SIGNING UTILITIES (For Human Authority Use)
   ========================================================= */

/**
 * Generate signing instructions for human authority.
 */
export function generateSigningInstructions(coreReferenceJSON: unknown): string {
  const canonical = canonicalizeJSON(coreReferenceJSON);

  return `
# CHE·NU Core Reference Signing Instructions

## Step 1: Generate Ed25519 Key Pair (if not already done)
\`\`\`bash
openssl genpkey -algorithm ed25519 -out che_nu_core_private.key
openssl pkey -in che_nu_core_private.key -pubout -out che_nu_core_public.key
\`\`\`

## Step 2: Save Canonical JSON
Save the following to "CHE_NU_CORE_REFERENCE.canonical.json":
\`\`\`json
${canonical}
\`\`\`

## Step 3: Compute SHA-256 Hash
\`\`\`bash
sha256sum CHE_NU_CORE_REFERENCE.canonical.json
# Or: openssl dgst -sha256 CHE_NU_CORE_REFERENCE.canonical.json
\`\`\`

## Step 4: Sign the Hash
\`\`\`bash
openssl pkeyutl -sign -inkey che_nu_core_private.key \\
  -in <(sha256sum CHE_NU_CORE_REFERENCE.canonical.json | cut -d' ' -f1 | xxd -r -p) \\
  -out signature.bin

# Convert to base64
base64 signature.bin > signature.b64
\`\`\`

## Step 5: Update core.crypto.signature.json
- Copy content of signature.b64 to signature.value
- Copy content of che_nu_core_public.key to publicKey.value
- Set timestamp in signedBy.timestamp

## SECURITY NOTES
- NEVER share or commit che_nu_core_private.key
- Store private key in secure location (HSM, vault, etc.)
- Public key can be freely distributed
  `.trim();
}

/* =========================================================
   EXPORTS
   ========================================================= */

export const CRYPTO_SIGNATURE_VERSION = getCryptoSignatureConfig().referenceVersion;
export const SIGNATURE_ALGORITHM = getCryptoSignatureConfig().signature.algorithm;
export const HASH_ALGORITHM = getCryptoSignatureConfig().hashing.algorithm;
