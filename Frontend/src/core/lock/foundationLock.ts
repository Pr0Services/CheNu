/* =====================================================
   CHE·NU — FOUNDATION LOCK
   Status: FOUNDATIONAL
   Purpose: Cryptographic verification of foundation integrity
   
   This foundation defines the immutable laws of CHE·NU.
   
   It may evolve only through:
   - explicit versioning
   - human consent
   - cryptographic verification
   
   No agent, system, or optimization may override it.
   
   Signed consciously,
   for integrity over power.
   
   ❤️ With love, for humanity.
   ===================================================== */

/* =========================================================
   TYPES
   ========================================================= */

/**
 * Foundation lock status.
 */
export type FoundationLockStatus = 
  | 'LOCKED'           // Foundation verified and locked
  | 'UNLOCKED'         // Foundation not yet verified
  | 'TAMPERED'         // Hash mismatch detected
  | 'MISSING'          // Foundation file not found
  | 'SIGNATURE_INVALID'; // GPG signature invalid

/**
 * Hash verification result.
 */
export interface HashVerificationResult {
  valid: boolean;
  expectedHash: string;
  actualHash: string;
  file: string;
  verifiedAt: string;
}

/**
 * Signature verification result.
 */
export interface SignatureVerificationResult {
  valid: boolean;
  signer?: string;
  signedAt?: string;
  file: string;
  verifiedAt: string;
}

/**
 * Complete foundation lock state.
 */
export interface FoundationLockState {
  status: FoundationLockStatus;
  hashVerification?: HashVerificationResult;
  signatureVerification?: SignatureVerificationResult;
  version: string;
  lockedAt?: string;
  lockedBy?: string;
}

/**
 * Foundation evolution record.
 */
export interface FoundationEvolution {
  fromVersion: string;
  toVersion: string;
  reason: string;
  approvedBy: string;
  approvedAt: string;
  previousHash: string;
  newHash: string;
  changelog: string[];
}

/* =========================================================
   CONSTANTS
   ========================================================= */

/**
 * Foundation file paths.
 */
export const FOUNDATION_PATHS = {
  foundation: 'chenu.foundation.json',
  hash: 'chenu.foundation.hash',
  signature: 'chenu.foundation.json.asc',
  evolution: 'chenu.foundation.evolution.json',
} as const;

/**
 * Evolution rules - how the foundation may change.
 */
export const EVOLUTION_RULES = {
  requiresExplicitVersioning: true,
  requiresHumanConsent: true,
  requiresCryptographicVerification: true,
  forbidsAgentOverride: true,
  forbidsSystemOverride: true,
  forbidsOptimizationOverride: true,
} as const;

/* =========================================================
   HASH FUNCTIONS
   ========================================================= */

/**
 * Compute SHA-256 hash of content.
 * Works in browser and Node.js environments.
 */
export async function computeHash(content: string): Promise<string> {
  // Browser environment
  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Node.js environment
  if (typeof require !== 'undefined') {
    try {
      // Dynamic import for Node.js
      const crypto = require('crypto');
      return crypto.createHash('sha256').update(content).digest('hex');
    } catch {
      throw new Error('Crypto module not available');
    }
  }

  throw new Error('No crypto implementation available');
}

/**
 * Verify hash matches expected value.
 */
export async function verifyHash(
  content: string,
  expectedHash: string,
  file: string = 'unknown'
): Promise<HashVerificationResult> {
  const actualHash = await computeHash(content);
  const valid = actualHash.toLowerCase() === expectedHash.toLowerCase();

  return {
    valid,
    expectedHash,
    actualHash,
    file,
    verifiedAt: new Date().toISOString(),
  };
}

/* =========================================================
   FOUNDATION LOCK LOGIC
   ========================================================= */

/**
 * The Foundation Lock class.
 * Manages cryptographic verification of the foundation.
 */
export class FoundationLock {
  private state: FoundationLockState;
  private expectedHash: string;
  private foundationContent: string | null = null;

  constructor(expectedHash: string, version: string) {
    this.expectedHash = expectedHash;
    this.state = {
      status: 'UNLOCKED',
      version,
    };
  }

  /**
   * Get current lock state.
   */
  getState(): FoundationLockState {
    return { ...this.state };
  }

  /**
   * Check if foundation is locked and verified.
   */
  isLocked(): boolean {
    return this.state.status === 'LOCKED';
  }

  /**
   * Check if foundation is tampered.
   */
  isTampered(): boolean {
    return this.state.status === 'TAMPERED';
  }

  /**
   * Verify and lock the foundation.
   */
  async verifyAndLock(foundationContent: string): Promise<FoundationLockState> {
    this.foundationContent = foundationContent;

    // Verify hash
    const hashResult = await verifyHash(
      foundationContent,
      this.expectedHash,
      FOUNDATION_PATHS.foundation
    );

    this.state.hashVerification = hashResult;

    if (hashResult.valid) {
      this.state.status = 'LOCKED';
      this.state.lockedAt = new Date().toISOString();
    } else {
      this.state.status = 'TAMPERED';
    }

    return this.getState();
  }

  /**
   * Runtime verification - call this periodically or before critical operations.
   */
  async verify(): Promise<boolean> {
    if (!this.foundationContent) {
      this.state.status = 'MISSING';
      return false;
    }

    const hashResult = await verifyHash(
      this.foundationContent,
      this.expectedHash,
      FOUNDATION_PATHS.foundation
    );

    this.state.hashVerification = hashResult;

    if (!hashResult.valid) {
      this.state.status = 'TAMPERED';
      return false;
    }

    return true;
  }

  /**
   * Halt system on integrity failure.
   */
  halt(reason: string): never {
    console.error('╔═══════════════════════════════════════════════════════╗');
    console.error('║         ⛔ FOUNDATION INTEGRITY FAILURE               ║');
    console.error('╠═══════════════════════════════════════════════════════╣');
    console.error(`║  Reason: ${reason.padEnd(45)}║`);
    console.error('║                                                       ║');
    console.error('║  The system cannot proceed without a valid foundation.║');
    console.error('║  No agent, system, or optimization may override this. ║');
    console.error('║                                                       ║');
    console.error('╚═══════════════════════════════════════════════════════╝');

    throw new Error(`FOUNDATION INTEGRITY FAILURE: ${reason}`);
  }

  /**
   * Conditional start - only if foundation is valid.
   */
  async startSystem(
    foundationContent: string,
    onSuccess: () => void
  ): Promise<void> {
    const state = await this.verifyAndLock(foundationContent);

    if (state.status === 'LOCKED') {
      console.log('✅ Foundation verified. System starting...');
      onSuccess();
    } else {
      this.halt(state.status);
    }
  }
}

/* =========================================================
   RUNTIME VERIFICATION GUARD
   ========================================================= */

/**
 * Runtime guard that checks foundation before critical operations.
 */
export function createFoundationGuard(lock: FoundationLock) {
  return async function guard<T>(
    operation: () => T | Promise<T>,
    operationName: string = 'unknown'
  ): Promise<T> {
    // Verify before operation
    const valid = await lock.verify();

    if (!valid) {
      lock.halt(`Foundation tampered before operation: ${operationName}`);
    }

    // Execute operation
    const result = await operation();

    // Verify after operation (optional paranoia mode)
    const stillValid = await lock.verify();

    if (!stillValid) {
      lock.halt(`Foundation tampered during operation: ${operationName}`);
    }

    return result;
  };
}

/* =========================================================
   EVOLUTION TRACKING
   ========================================================= */

/**
 * Track foundation evolution.
 */
export class FoundationEvolutionTracker {
  private evolutions: FoundationEvolution[] = [];

  /**
   * Record a foundation evolution.
   */
  recordEvolution(evolution: FoundationEvolution): void {
    // Validate evolution follows rules
    if (!evolution.approvedBy) {
      throw new Error('Evolution requires human approval');
    }

    if (!evolution.newHash) {
      throw new Error('Evolution requires cryptographic verification');
    }

    if (evolution.fromVersion === evolution.toVersion) {
      throw new Error('Evolution requires explicit versioning');
    }

    this.evolutions.push(evolution);
  }

  /**
   * Get evolution history.
   */
  getHistory(): FoundationEvolution[] {
    return [...this.evolutions];
  }

  /**
   * Verify evolution chain integrity.
   */
  verifyChain(): boolean {
    for (let i = 1; i < this.evolutions.length; i++) {
      const prev = this.evolutions[i - 1];
      const curr = this.evolutions[i];

      // Verify chain continuity
      if (curr.previousHash !== prev.newHash) {
        return false;
      }

      if (curr.fromVersion !== prev.toVersion) {
        return false;
      }
    }

    return true;
  }
}

/* =========================================================
   CONVENIENCE FUNCTIONS
   ========================================================= */

/**
 * Quick verification function.
 */
export async function quickVerify(
  foundationContent: string,
  expectedHash: string
): Promise<boolean> {
  const result = await verifyHash(foundationContent, expectedHash);
  return result.valid;
}

/**
 * Create a locked system starter.
 */
export function createLockedSystem(
  expectedHash: string,
  version: string
): {
  lock: FoundationLock;
  guard: ReturnType<typeof createFoundationGuard>;
  start: (content: string, onSuccess: () => void) => Promise<void>;
} {
  const lock = new FoundationLock(expectedHash, version);
  const guard = createFoundationGuard(lock);

  return {
    lock,
    guard,
    start: (content: string, onSuccess: () => void) =>
      lock.startSystem(content, onSuccess),
  };
}

/* =========================================================
   FOUNDATION LOCK CEREMONY TEXT
   ========================================================= */

/**
 * The Foundation Lock declaration.
 */
export const FOUNDATION_LOCK_DECLARATION = `
# CHE·NU — Foundation Lock

This foundation defines the immutable laws of CHE·NU.

It may evolve only through:
- explicit versioning
- human consent
- cryptographic verification

No agent, system, or optimization may override it.

Signed consciously,
for integrity over power.

---

verifyHash("chenu.foundation.json", expectedHash)
  ? startSystem()
  : halt("FOUNDATION INTEGRITY FAILURE")

---

❤️ CHE·NU — Governed Intelligence Operating System
`;

/* =========================================================
   EXPORTS
   ========================================================= */

export default FoundationLock;
