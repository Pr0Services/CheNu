/* =====================================================
   CHE·NU — FOUNDATION LOCK MODULE
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

export {
  // Types
  type FoundationLockStatus,
  type HashVerificationResult,
  type SignatureVerificationResult,
  type FoundationLockState,
  type FoundationEvolution,

  // Constants
  FOUNDATION_PATHS,
  EVOLUTION_RULES,

  // Hash functions
  computeHash,
  verifyHash,

  // Main class
  FoundationLock,

  // Guard
  createFoundationGuard,

  // Evolution tracking
  FoundationEvolutionTracker,

  // Convenience functions
  quickVerify,
  createLockedSystem,

  // Declaration
  FOUNDATION_LOCK_DECLARATION,
} from './foundationLock';

// Re-export default
export { default } from './foundationLock';
