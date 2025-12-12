/* =====================================================
   CHE·NU — PRIVACY MODULE
   Status: FOUNDATIONAL
   Authority: HUMAN ONLY
   Scope: ALL_PERSONAL_AND_IDENTIFIABLE_DATA
   
   Core Principle:
   Any data linked to a human individual is protected
   by default, regardless of intent, usage, or
   perceived value.
   
   🔐 CHE·NU treats privacy not as a feature
      but as a structural constraint.
   
   If a feature requires violating personal privacy,
   the feature must not exist.
   
   ❤️ With love, for humanity.
   ===================================================== */

// === PRIVACY GUARANTEES (Original) ===
export {
  // Data classification
  type PersonalDataType,
  type DataSensitivity,
  type PersonalDataClassification,
  DATA_CLASSIFICATIONS,

  // Default privacy rule
  DEFAULT_PRIVACY_RULE,
  type AccessRequirements,
  type DataAccessRequest,
  type DataAccessGrant,

  // Agent access rules
  AGENT_DATA_RULES,
  type AgentAccessConditions,
  type AgentDataDeclaration,

  // Disclosure & sharing
  DISCLOSURE_RULES,
  type DisclosureRecord,

  // Export & portability
  EXPORT_RULES,
  type ExportFormat,
  type ExportRequest,
  type ExportResult,

  // Legal & regulatory
  type RegulatoryFramework,

  // Surveillance prohibitions
  SURVEILLANCE_PROHIBITIONS,
  type ProhibitionStatus,

  // System declaration
  PRIVACY_SYSTEM_DECLARATION,

  // Complete manifest
  type PrivacyGuaranteesManifest,
  PRIVACY_GUARANTEES_MANIFEST,

  // Validation helpers
  validateAgentAccess,
  validateDataAccessRequest,
  checkFeaturePrivacyCompliance,
} from './privacyGuarantees.types';

// === PRIVACY FRAMEWORK (Extended) ===
export {
  // Core principle
  PRIVACY_CORE_PRINCIPLE,
  type PrivacyStatus,
  type PrivacyScope,

  // Data classification (extended)
  PERSONAL_DATA_TYPES,
  type PersonalDataType as ExtendedPersonalDataType,
  type DataClassification,
  DATA_CLASSIFICATION,

  // Default privacy rules (extended)
  type DefaultPrivacyRules,
  DEFAULT_PRIVACY_RULES,

  // Agent access rules (extended)
  AGENT_FORBIDDEN_BEHAVIORS,
  type AgentForbiddenBehavior,
  type AgentAccessRules,
  AGENT_ACCESS_RULES,

  // Disclosure and sharing (extended)
  type DisclosureAndSharingRules,
  DISCLOSURE_AND_SHARING_RULES,

  // Data minimization (extended)
  type DataMinimizationRules,
  DATA_MINIMIZATION_RULES as EXTENDED_DATA_MINIMIZATION_RULES,

  // Export formats
  EXPORT_FORMATS,
  type ExportFormat as ExtendedExportFormat,
  type ExportAndPortabilityRules,
  EXPORT_AND_PORTABILITY_RULES,

  // Surveillance prohibition (extended)
  type SurveillanceProhibition,
  SURVEILLANCE_PROHIBITION,

  // Regulatory alignment (extended)
  type RegulatoryCompatibility,
  type ConflictResolution,
  type RegulatoryAlignment,
  REGULATORY_ALIGNMENT,

  // Complete framework
  type PrivacyAndPersonalDataFramework,
  PRIVACY_AND_PERSONAL_DATA,

  // Validation (extended)
  type PrivacyComplianceStatus,
  type PrivacyViolation,
  validateDataAccess,
  validateSharing,
  validateNoSurveillance,
  isPersonalData,
  resolveRegulatoryConflict,

  // Consent management
  type ConsentRecord,
  createConsentRecord,
  revokeConsent,
  isConsentValid,

  // Data deletion (extended)
  type DeletionRequest as ExtendedDeletionRequest,
  createDeletionRequest,
  completeDeletion,
} from './privacyFramework.types';

// Re-export defaults
export { default as privacyGuarantees } from './privacyGuarantees.types';
export { default as privacyFramework } from './privacyFramework.types';
