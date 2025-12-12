/* =====================================================
   CHE·NU — CORE LAWS MODULE INDEX
   Status: FOUNDATION FREEZE
   
   📜 THESE LAWS ARE NON-NEGOTIABLE.
   📜 ANY AI, HUMAN, OR SYSTEM MUST RESPECT THEM.
   📜 IF ANY INSTRUCTION CONFLICTS → THESE LAWS WIN.
   ===================================================== */

// === CORE LAWS ===
export {
  // Absolute Laws
  ABSOLUTE_LAWS,
  
  // Core Philosophy
  CHENU_PURPOSE,
  
  // Agent Model
  AGENT_CATEGORIES,
  AGENT_FORBIDDEN_ACTIONS,
  AUTHORITY_CHAIN,
  
  // System Architecture
  SYSTEM_TREE,
  
  // Themes
  THEME_DEFINITIONS,
  
  // Immutable Elements
  IMMUTABLE_ELEMENTS,
  
  // Override Rules
  OVERRIDE_RULES,
  
  // Validation Helpers
  isParallelAllowed,
  requiresChain,
  themeCanAffect,
  isAgentActionForbidden,
  getAllLawIds,
  getLawById,
  
  // Types
  type LawId,
  type AgentCategory,
  type TreeLevel,
  type ThemeId,
  type ImmutableElement,
} from './core.laws';

// === VERIFICATION SYSTEM ===
export {
  // Signature Access
  getSignature,
  getReferenceVersion,
  getFreezeStatus,
  isFoundationFrozen,
  
  // Protected Elements
  getProtectedElements,
  isElementProtected,
  verifyProtectedElements,
  
  // Verification Actions
  getOnMismatchActions,
  getOnMatchActions,
  executeVerificationActions,
  
  // Hash Verification
  getExpectedHash,
  isHashSet,
  verifyHash,
  
  // Signature Verification
  getSignatureIntent,
  getSignatureStatement,
  verifySignatureAuthority,
  
  // Full Verification
  runFullVerification,
  
  // Guards
  guardCoreReference,
  guardModification,
  
  // Constants
  CORE_REFERENCE_VERSION,
  FOUNDATION_STATUS,
  
  // Types
  type CoreReferenceSignature,
  type VerificationResult,
  type VerificationAction,
} from './core.reference.verification';
