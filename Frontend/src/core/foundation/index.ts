/* =====================================================
   CHE·NU — FOUNDATION MODULE INDEX
   Version: 1.0
   Status: FOUNDATION_FREEZE
   
   📜 This module contains the immutable foundations
   of CHE·NU — the absolute laws and core reference
   that cannot be bypassed or modified.
   ===================================================== */

// Core Reference JSON (frozen)
export { default as coreReferenceJson } from './chenu.core.reference.json';

// Core Reference Types and Validators
export {
  // Types
  type CorePhilosophy,
  type LawCapabilities,
  type ParallelChainLaw,
  type ReadOnlyLearningLaw,
  type ThemesVisualOnlyLaw,
  type AbsoluteLaws,
  type SystemArchitecture,
  type AgentModel,
  type ReplayAndMemory,
  type MethodologySystem,
  type UXPrinciples,
  type AIInstructionOverride,
  type CheNuCoreReference,
  type ActionValidation,
  type ValidationResult,
  
  // Core Reference Instance
  CORE_REFERENCE,
  
  // Law Accessors
  getLaw1HumanAuthority,
  getLaw2ParallelVsChain,
  getLaw3NoInvisibleAction,
  getLaw4ReadOnlyLearning,
  getLaw5ThemesVisualOnly,
  
  // Validators
  validateHumanAuthority,
  validateParallelChain,
  validateVisibility,
  validateReadOnlyLearning,
  validateThemeScope,
  validateAgentCapability,
  validateMethodologyOperation,
  validateAction,
  
  // Utilities
  getAgentRoleType,
  
  // Constants
  CORE_VERSION,
  CORE_STATUS,
  IMMUTABLE_ELEMENTS,
  AVAILABLE_THEMES,
} from './coreReference';

// === CRYPTOGRAPHIC VERIFICATION ===
export {
  // Config Access
  getCryptoSignatureConfig,
  isSignatureSet,
  getPublicKey,
  getStoredSignature,
  
  // AI Constraints
  getAIConstraints,
  isOperationAllowed,
  isOperationForbidden,
  validateAIOperation,
  
  // Canonicalization
  canonicalizeJSON,
  createCanonicalFile,
  
  // Hash & Signature
  computeSHA256,
  verifyEd25519Signature,
  verifyCoreReferenceSignature,
  
  // Guards
  guardCryptoSignature,
  guardAIOperation,
  guardCoreReferenceIntegrity,
  
  // Utilities
  generateSigningInstructions,
  
  // Constants
  CRYPTO_SIGNATURE_VERSION,
  SIGNATURE_ALGORITHM,
  HASH_ALGORITHM,
  
  // Types
  type CryptoSignatureConfig,
  type SignatureVerificationResult,
  type CanonicalizeResult,
} from './cryptoVerification';

// === BOOTSTRAP PROMPT ===
export {
  // Bootstrap Prompt
  BOOTSTRAP_PROMPT,
  EXPECTED_CONFIRMATION,
  
  // Validation
  validateBootstrapConfirmation,
  detectConflictRefusal,
  
  // Sections
  BOOTSTRAP_SECTIONS,
  
  // Builder
  buildBootstrapPrompt,
  
  // Session
  initializeSession,
  
  // Types
  type BootstrapResult,
} from './bootstrap';

// === CONTEXT ADAPTATION ===
export {
  // Short Form Bootstrap
  BOOTSTRAP_SHORT_FORM,
  SHORT_FORM_CONFIRMATION,
  validateShortFormConfirmation,
  
  // Context Adaptation
  CONTEXT_ADAPTATION_TEMPLATE,
  DEFAULT_CONTEXT_ADAPTATION,
  CONTEXT_PRESETS,
  
  // Builders
  buildContextAdaptation,
  formatContextAdaptation,
  getContextPreset,
  listContextPresets,
  buildSessionInitialization,
  
  // Validation
  validateContextAdaptation,
  
  // Types
  type ContextType,
  type SensitivityLevel,
  type DepthLevel,
  type RiskTolerance,
  type Reversibility,
  type WorkingMode,
  type EmphasisOption,
  type ContextAdaptationDeclaration,
} from './contextAdaptation';
