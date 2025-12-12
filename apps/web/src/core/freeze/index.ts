/* =====================================================
   CHE·NU — FOUNDATION FREEZE MODULE
   Status: FOUNDATIONAL LOCK
   Authority: HUMAN ORIGINATORS
   Intent: PRESERVE CORE LAWS & ETHICAL BOUNDARIES FOREVER
   
   🌳 Branches may grow. The trunk does not mutate.
   ===================================================== */

export {
  // Definition
  FOUNDATION_FREEZE_DEFINITION,

  // Scope
  FROZEN_SCOPE,
  NOT_FROZEN_SCOPE,
  type FrozenElement,
  type EvolvableElement,

  // Manifest types
  type FoundationManifest,
  type ImmutablePrinciple,
  type HardConstraint,
  type SystemProhibition,
  type DeclarationClause,

  // Cryptographic seal
  type CryptographicSeal,
  type OriginatorSignature,

  // Multi-signature
  type MultiSignatureRequirement,
  DEFAULT_MULTISIG_CONFIG,

  // Verification
  VERIFICATION_MAY,
  VERIFICATION_MAY_NOT,
  type VerificationResult,

  // Failure mode
  FAILURE_MODE,
  type SafeModeState,

  // Public anchor
  type PublicAnchor,

  // Declarations
  LEGAL_ETHICAL_STATEMENT,
  SYSTEM_DECLARATION,

  // Default manifest
  CHENU_FOUNDATION_MANIFEST,

  // Helpers
  isFrozen,
  canEvolve,
  computeManifestHash,
  verifySealIntegrity,
  enterSafeMode,
  sealFoundation,
} from './foundationFreeze.types';

// The actual frozen manifest
export { default as foundationManifestJson } from './chenu.foundation.json';

// Future components
// export { FoundationVerifier } from './FoundationVerifier';
// export { SafeModeController } from './SafeModeController';
// export { SealGenerator } from './SealGenerator';
