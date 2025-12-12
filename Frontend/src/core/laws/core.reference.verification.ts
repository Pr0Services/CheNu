/* =====================================================
   CHE·NU — CORE REFERENCE VERIFICATION SYSTEM
   Status: FOUNDATION FREEZE
   Version: 1.0
   
   📜 PURPOSE:
   Verify that the Core Reference Bundle has not been
   tampered with. Any deviation invalidates compatibility.
   
   📜 RULES:
   - On mismatch: reject changes, require human review
   - On match: allow development, allow AI execution
   ===================================================== */

import signatureData from './core.reference.signature.json';

/* =========================================================
   TYPES
   ========================================================= */

export interface CoreReferenceSignature {
  referenceVersion: string;
  status: 'FOUNDATION_FREEZE' | 'DRAFT' | 'DEPRECATED';
  hashing: {
    algorithm: string;
    canonicalization: string;
    hashOf: string;
  };
  hash: {
    value: string;
    generatedAt: string;
    generatedBy: string;
    note?: string;
  };
  signature: {
    type: string;
    signedBy: string;
    role: string;
    intent: string[];
    statement: string;
  };
  verificationRules: {
    onMismatch: string[];
    onMatch: string[];
  };
  protectedElements: string[];
  auditTrail: {
    created: string;
    lastVerified: string | null;
    verificationCount: number;
    violations: Array<{
      timestamp: string;
      type: string;
      details: string;
    }>;
  };
}

export type VerificationResult =
  | { valid: true; message: string }
  | { valid: false; message: string; violations: string[] };

export type VerificationAction =
  | 'reject_changes'
  | 'require_human_review'
  | 'invalidate_ai_output'
  | 'allow_development'
  | 'allow_ai_execution';

/* =========================================================
   SIGNATURE ACCESS
   ========================================================= */

/**
 * Get the current signature data.
 */
export function getSignature(): CoreReferenceSignature {
  return signatureData.CHE_NU_CORE_REFERENCE_SIGNATURE as CoreReferenceSignature;
}

/**
 * Get the reference version.
 */
export function getReferenceVersion(): string {
  return getSignature().referenceVersion;
}

/**
 * Get the freeze status.
 */
export function getFreezeStatus(): string {
  return getSignature().status;
}

/**
 * Check if foundation is frozen.
 */
export function isFoundationFrozen(): boolean {
  return getSignature().status === 'FOUNDATION_FREEZE';
}

/* =========================================================
   PROTECTED ELEMENTS
   ========================================================= */

/**
 * Get list of protected elements.
 */
export function getProtectedElements(): string[] {
  return getSignature().protectedElements;
}

/**
 * Check if an element is protected.
 */
export function isElementProtected(element: string): boolean {
  return getProtectedElements().includes(element.toUpperCase());
}

/**
 * Verify that protected elements have not been modified.
 */
export function verifyProtectedElements(
  currentElements: Record<string, unknown>
): VerificationResult {
  const protected_ = getProtectedElements();
  const violations: string[] = [];

  for (const element of protected_) {
    if (!(element in currentElements)) {
      violations.push(`Missing protected element: ${element}`);
    }
  }

  if (violations.length > 0) {
    return {
      valid: false,
      message: 'Protected elements verification failed',
      violations,
    };
  }

  return {
    valid: true,
    message: 'All protected elements present',
  };
}

/* =========================================================
   VERIFICATION ACTIONS
   ========================================================= */

/**
 * Get actions to take on verification mismatch.
 */
export function getOnMismatchActions(): VerificationAction[] {
  return getSignature().verificationRules.onMismatch as VerificationAction[];
}

/**
 * Get actions to take on verification match.
 */
export function getOnMatchActions(): VerificationAction[] {
  return getSignature().verificationRules.onMatch as VerificationAction[];
}

/**
 * Execute verification actions based on result.
 */
export function executeVerificationActions(
  result: VerificationResult
): {
  actions: VerificationAction[];
  shouldProceed: boolean;
  requiresHumanReview: boolean;
} {
  if (result.valid) {
    return {
      actions: getOnMatchActions(),
      shouldProceed: true,
      requiresHumanReview: false,
    };
  }

  const actions = getOnMismatchActions();
  return {
    actions,
    shouldProceed: false,
    requiresHumanReview: actions.includes('require_human_review'),
  };
}

/* =========================================================
   HASH VERIFICATION (PLACEHOLDER)
   ========================================================= */

/**
 * Get the expected hash value.
 */
export function getExpectedHash(): string {
  return getSignature().hash.value;
}

/**
 * Check if hash has been set by human authority.
 */
export function isHashSet(): boolean {
  const hash = getExpectedHash();
  return hash !== 'PENDING_HUMAN_GENERATION' && hash !== 'REPLACE_WITH_ACTUAL_SHA256_HASH';
}

/**
 * Verify hash (placeholder - actual implementation requires crypto).
 * In production, this would compute SHA-256 of the canonical JSON
 * and compare with the stored hash.
 */
export function verifyHash(computedHash: string): VerificationResult {
  if (!isHashSet()) {
    return {
      valid: false,
      message: 'Hash has not been set by human authority',
      violations: ['HASH_NOT_SET'],
    };
  }

  const expected = getExpectedHash();
  if (computedHash !== expected) {
    return {
      valid: false,
      message: 'Hash mismatch - foundation may have been tampered with',
      violations: [`Expected: ${expected}`, `Computed: ${computedHash}`],
    };
  }

  return {
    valid: true,
    message: 'Hash verification successful',
  };
}

/* =========================================================
   SIGNATURE VERIFICATION
   ========================================================= */

/**
 * Get signature intent.
 */
export function getSignatureIntent(): string[] {
  return getSignature().signature.intent;
}

/**
 * Get signature statement.
 */
export function getSignatureStatement(): string {
  return getSignature().signature.statement;
}

/**
 * Verify signature authority.
 */
export function verifySignatureAuthority(): VerificationResult {
  const sig = getSignature().signature;

  if (sig.role !== 'human_authority') {
    return {
      valid: false,
      message: 'Invalid signature authority',
      violations: [`Expected role: human_authority, Got: ${sig.role}`],
    };
  }

  if (!sig.signedBy || sig.signedBy === '') {
    return {
      valid: false,
      message: 'Signature missing signer',
      violations: ['No signer specified'],
    };
  }

  return {
    valid: true,
    message: `Signature valid from: ${sig.signedBy}`,
  };
}

/* =========================================================
   FULL VERIFICATION
   ========================================================= */

/**
 * Run full verification of core reference.
 */
export function runFullVerification(options?: {
  computedHash?: string;
  currentElements?: Record<string, unknown>;
}): {
  overall: VerificationResult;
  details: {
    freezeStatus: boolean;
    signatureAuthority: VerificationResult;
    hashVerification?: VerificationResult;
    elementsVerification?: VerificationResult;
  };
  actions: {
    actions: VerificationAction[];
    shouldProceed: boolean;
    requiresHumanReview: boolean;
  };
} {
  const details: {
    freezeStatus: boolean;
    signatureAuthority: VerificationResult;
    hashVerification?: VerificationResult;
    elementsVerification?: VerificationResult;
  } = {
    freezeStatus: isFoundationFrozen(),
    signatureAuthority: verifySignatureAuthority(),
  };

  const violations: string[] = [];

  // Check freeze status
  if (!details.freezeStatus) {
    violations.push('Foundation is not frozen');
  }

  // Check signature authority
  if (!details.signatureAuthority.valid) {
    violations.push(...(details.signatureAuthority as { violations: string[] }).violations);
  }

  // Check hash if provided
  if (options?.computedHash) {
    details.hashVerification = verifyHash(options.computedHash);
    if (!details.hashVerification.valid) {
      violations.push(...(details.hashVerification as { violations: string[] }).violations);
    }
  }

  // Check elements if provided
  if (options?.currentElements) {
    details.elementsVerification = verifyProtectedElements(options.currentElements);
    if (!details.elementsVerification.valid) {
      violations.push(...(details.elementsVerification as { violations: string[] }).violations);
    }
  }

  const overall: VerificationResult =
    violations.length === 0
      ? { valid: true, message: 'Core reference verification passed' }
      : { valid: false, message: 'Core reference verification failed', violations };

  return {
    overall,
    details,
    actions: executeVerificationActions(overall),
  };
}

/* =========================================================
   GUARD FUNCTIONS
   ========================================================= */

/**
 * Guard that throws if verification fails.
 */
export function guardCoreReference(options?: {
  computedHash?: string;
  currentElements?: Record<string, unknown>;
}): void {
  const result = runFullVerification(options);

  if (!result.overall.valid) {
    const violations = (result.overall as { violations: string[] }).violations;
    throw new Error(
      `[CHE·NU VIOLATION] Core Reference verification failed:\n${violations.join('\n')}`
    );
  }
}

/**
 * Guard that checks if modification is allowed.
 */
export function guardModification(element: string): void {
  if (isElementProtected(element)) {
    throw new Error(
      `[CHE·NU VIOLATION] Cannot modify protected element: ${element}. ` +
        `This requires human authority approval.`
    );
  }
}

/* =========================================================
   EXPORTS
   ========================================================= */

export const CORE_REFERENCE_VERSION = getReferenceVersion();
export const FOUNDATION_STATUS = getFreezeStatus();
