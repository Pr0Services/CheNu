/* =====================================================
   CHE·NU — PRIVACY & PERSONAL DATA PROTECTION
   Status: FOUNDATIONAL
   Scope: ALL_PERSONAL_AND_IDENTIFIABLE_DATA
   
   Core Principle:
   Any data linked to a human individual is protected
   by default, regardless of intent, usage, or
   perceived value.
   
   ❤️ With love, for humanity.
   ===================================================== */

/* =========================================================
   CORE PRINCIPLE
   ========================================================= */

/**
 * The foundational privacy principle.
 */
export const PRIVACY_CORE_PRINCIPLE = `Any data linked to a human individual is protected by default, regardless of intent, usage, or perceived value.`;

/**
 * Privacy status - FOUNDATIONAL means it cannot be weakened.
 */
export type PrivacyStatus = 'FOUNDATIONAL';

/**
 * Privacy scope.
 */
export type PrivacyScope = 'ALL_PERSONAL_AND_IDENTIFIABLE_DATA';

/* =========================================================
   DATA CLASSIFICATION
   ========================================================= */

/**
 * Types of personal data that are protected.
 */
export const PERSONAL_DATA_TYPES = [
  'identity_data',
  'profiles',
  'preferences',
  'personal_notes',
  'private_messages',
  'behavioral_traces',
  'project_data_tied_to_a_person',
  'xr_and_biometric_signals',
  'contextual_inferences_about_individuals',
] as const;

export type PersonalDataType = typeof PERSONAL_DATA_TYPES[number];

/**
 * Data classification structure.
 */
export interface DataClassification {
  /** Types of personal data */
  personalDataIncludes: PersonalDataType[];

  /** Sensitive data receives maximum protection */
  sensitiveData: 'receives_maximum_protection';
}

/**
 * Default data classification.
 */
export const DATA_CLASSIFICATION: DataClassification = {
  personalDataIncludes: [...PERSONAL_DATA_TYPES],
  sensitiveData: 'receives_maximum_protection',
};

/* =========================================================
   DEFAULT PRIVACY RULES
   ========================================================= */

/**
 * Default privacy rules - all true by design.
 */
export interface DefaultPrivacyRules {
  /** Data is private by default - no opt-in required */
  privateByDefault: true;

  /** No implicit sharing - must be explicit */
  noImplicitSharing: true;

  /** No opt-out tricks - no dark patterns */
  noOptOutTricks: true;

  /** No access without explicit human action */
  noAccessWithoutExplicitHumanAction: true;
}

/**
 * The default privacy rules.
 */
export const DEFAULT_PRIVACY_RULES: DefaultPrivacyRules = {
  privateByDefault: true,
  noImplicitSharing: true,
  noOptOutTricks: true,
  noAccessWithoutExplicitHumanAction: true,
};

/* =========================================================
   AGENT ACCESS RULES
   ========================================================= */

/**
 * Forbidden agent behaviors regarding data.
 */
export const AGENT_FORBIDDEN_BEHAVIORS = [
  'implicit_data_access',
  'silent_aggregation',
  'cross_context_inference',
  'profiling',
] as const;

export type AgentForbiddenBehavior = typeof AGENT_FORBIDDEN_BEHAVIORS[number];

/**
 * Rules for agent access to personal data.
 */
export interface AgentAccessRules {
  /** Agent must explicitly request access */
  explicitRequestRequired: true;

  /** Access is scoped to a single task */
  singleTaskScope: true;

  /** Access does not persist after task */
  nonPersistentAccess: true;

  /** Agent must declare what data it accesses */
  mandatoryAccessDeclaration: true;

  /** Forbidden behaviors */
  forbidden: AgentForbiddenBehavior[];
}

/**
 * Default agent access rules.
 */
export const AGENT_ACCESS_RULES: AgentAccessRules = {
  explicitRequestRequired: true,
  singleTaskScope: true,
  nonPersistentAccess: true,
  mandatoryAccessDeclaration: true,
  forbidden: [...AGENT_FORBIDDEN_BEHAVIORS],
};

/* =========================================================
   DISCLOSURE AND SHARING
   ========================================================= */

/**
 * Rules for data disclosure and sharing.
 */
export interface DisclosureAndSharingRules {
  /** Sharing must be explicit */
  explicit: true;

  /** Sharing can be revoked */
  reversible: true;

  /** Sharing has a time limit */
  timeBound: true;

  /** Usage does not imply consent to share */
  neverImpliedByUsage: true;
}

/**
 * Default disclosure rules.
 */
export const DISCLOSURE_AND_SHARING_RULES: DisclosureAndSharingRules = {
  explicit: true,
  reversible: true,
  timeBound: true,
  neverImpliedByUsage: true,
};

/* =========================================================
   DATA MINIMIZATION
   ========================================================= */

/**
 * Data minimization rules.
 */
export interface DataMinimizationRules {
  /** Only collect what's necessary */
  collectMinimumNecessary: true;

  /** Avoid storing redundant data */
  avoidRedundancy: true;

  /** Human can delete without justification */
  humanDeletionWithoutJustification: true;

  /** Deletion is immediate and irreversible */
  deletionIsImmediateAndIrreversible: true;
}

/**
 * Default data minimization rules.
 */
export const DATA_MINIMIZATION_RULES: DataMinimizationRules = {
  collectMinimumNecessary: true,
  avoidRedundancy: true,
  humanDeletionWithoutJustification: true,
  deletionIsImmediateAndIrreversible: true,
};

/* =========================================================
   EXPORT AND PORTABILITY
   ========================================================= */

/**
 * Human-readable export formats.
 */
export const EXPORT_FORMATS = ['txt', 'md', 'json', 'pdf'] as const;

export type ExportFormat = typeof EXPORT_FORMATS[number];

/**
 * Export and portability rules.
 */
export interface ExportAndPortabilityRules {
  /** Human has full right to export */
  fullExportRight: true;

  /** Export formats must be human-readable */
  humanReadableFormats: ExportFormat[];

  /** Exported data loses system authority */
  exportedDataLosesSystemAuthority: true;

  /** Re-importing requires new consent */
  noReingestionWithoutNewConsent: true;
}

/**
 * Default export rules.
 */
export const EXPORT_AND_PORTABILITY_RULES: ExportAndPortabilityRules = {
  fullExportRight: true,
  humanReadableFormats: [...EXPORT_FORMATS],
  exportedDataLosesSystemAuthority: true,
  noReingestionWithoutNewConsent: true,
};

/* =========================================================
   SURVEILLANCE PROHIBITION
   ========================================================= */

/**
 * Surveillance prohibition rules.
 */
export interface SurveillanceProhibition {
  /** No continuous monitoring */
  noContinuousMonitoring: true;

  /** No emotional tracking */
  noEmotionalTracking: true;

  /** No productivity scoring */
  noProductivityScoring: true;

  /** No hidden individual analytics */
  noHiddenIndividualAnalytics: true;
}

/**
 * Default surveillance prohibition.
 */
export const SURVEILLANCE_PROHIBITION: SurveillanceProhibition = {
  noContinuousMonitoring: true,
  noEmotionalTracking: true,
  noProductivityScoring: true,
  noHiddenIndividualAnalytics: true,
};

/* =========================================================
   REGULATORY ALIGNMENT
   ========================================================= */

/**
 * Regulatory compatibility status.
 */
export type RegulatoryCompatibility = 'compatible';

/**
 * Conflict resolution approach.
 */
export type ConflictResolution = 'highest_protection_applies';

/**
 * Regulatory alignment.
 */
export interface RegulatoryAlignment {
  /** GDPR (EU) compatibility */
  gdpr: RegulatoryCompatibility;

  /** CCPA/CPRA (California) compatibility */
  ccpaCpra: RegulatoryCompatibility;

  /** PIPEDA (Canada) compatibility */
  pipeda: RegulatoryCompatibility;

  /** When regulations conflict, highest protection wins */
  conflictResolution: ConflictResolution;
}

/**
 * Default regulatory alignment.
 */
export const REGULATORY_ALIGNMENT: RegulatoryAlignment = {
  gdpr: 'compatible',
  ccpaCpra: 'compatible',
  pipeda: 'compatible',
  conflictResolution: 'highest_protection_applies',
};

/* =========================================================
   COMPLETE PRIVACY FRAMEWORK
   ========================================================= */

/**
 * Complete privacy and personal data protection framework.
 */
export interface PrivacyAndPersonalDataFramework {
  /** Status - FOUNDATIONAL */
  status: PrivacyStatus;

  /** Scope - all personal data */
  scope: PrivacyScope;

  /** Core principle */
  corePrinciple: string;

  /** Data classification */
  dataClassification: DataClassification;

  /** Default privacy rules */
  defaultPrivacyRules: DefaultPrivacyRules;

  /** Agent access rules */
  agentAccessRules: AgentAccessRules;

  /** Disclosure and sharing rules */
  disclosureAndSharing: DisclosureAndSharingRules;

  /** Data minimization rules */
  dataMinimization: DataMinimizationRules;

  /** Export and portability rules */
  exportAndPortability: ExportAndPortabilityRules;

  /** Surveillance prohibition */
  surveillanceProhibition: SurveillanceProhibition;

  /** Regulatory alignment */
  regulatoryAlignment: RegulatoryAlignment;
}

/**
 * The complete CHE·NU privacy framework.
 */
export const PRIVACY_AND_PERSONAL_DATA: PrivacyAndPersonalDataFramework = {
  status: 'FOUNDATIONAL',
  scope: 'ALL_PERSONAL_AND_IDENTIFIABLE_DATA',
  corePrinciple: PRIVACY_CORE_PRINCIPLE,
  dataClassification: DATA_CLASSIFICATION,
  defaultPrivacyRules: DEFAULT_PRIVACY_RULES,
  agentAccessRules: AGENT_ACCESS_RULES,
  disclosureAndSharing: DISCLOSURE_AND_SHARING_RULES,
  dataMinimization: DATA_MINIMIZATION_RULES,
  exportAndPortability: EXPORT_AND_PORTABILITY_RULES,
  surveillanceProhibition: SURVEILLANCE_PROHIBITION,
  regulatoryAlignment: REGULATORY_ALIGNMENT,
};

/* =========================================================
   VALIDATION FUNCTIONS
   ========================================================= */

/**
 * Privacy compliance status.
 */
export interface PrivacyComplianceStatus {
  compliant: boolean;
  violations: PrivacyViolation[];
  checkedAt: string;
}

/**
 * A privacy violation.
 */
export interface PrivacyViolation {
  rule: string;
  description: string;
  severity: 'warning' | 'error' | 'critical';
  dataType?: PersonalDataType;
}

/**
 * Check if a data access request is compliant.
 */
export function validateDataAccess(
  dataType: PersonalDataType,
  accessRequest: {
    explicitRequest: boolean;
    taskScope: string;
    declaration: string;
    persistent: boolean;
  }
): PrivacyComplianceStatus {
  const violations: PrivacyViolation[] = [];

  // Check explicit request
  if (!accessRequest.explicitRequest) {
    violations.push({
      rule: 'explicitRequestRequired',
      description: 'Agent must explicitly request access to personal data',
      severity: 'critical',
      dataType,
    });
  }

  // Check task scope
  if (!accessRequest.taskScope) {
    violations.push({
      rule: 'singleTaskScope',
      description: 'Access must be scoped to a single task',
      severity: 'error',
      dataType,
    });
  }

  // Check declaration
  if (!accessRequest.declaration) {
    violations.push({
      rule: 'mandatoryAccessDeclaration',
      description: 'Agent must declare what data it accesses',
      severity: 'error',
      dataType,
    });
  }

  // Check persistence
  if (accessRequest.persistent) {
    violations.push({
      rule: 'nonPersistentAccess',
      description: 'Access must not persist after task completion',
      severity: 'critical',
      dataType,
    });
  }

  return {
    compliant: violations.length === 0,
    violations,
    checkedAt: new Date().toISOString(),
  };
}

/**
 * Check if a sharing action is compliant.
 */
export function validateSharing(
  sharing: {
    explicit: boolean;
    reversible: boolean;
    hasTimeLimit: boolean;
    impliedByUsage: boolean;
  }
): PrivacyComplianceStatus {
  const violations: PrivacyViolation[] = [];

  if (!sharing.explicit) {
    violations.push({
      rule: 'explicit',
      description: 'Sharing must be explicit, not assumed',
      severity: 'critical',
    });
  }

  if (!sharing.reversible) {
    violations.push({
      rule: 'reversible',
      description: 'Sharing must be revocable',
      severity: 'error',
    });
  }

  if (!sharing.hasTimeLimit) {
    violations.push({
      rule: 'timeBound',
      description: 'Sharing should have a time limit',
      severity: 'warning',
    });
  }

  if (sharing.impliedByUsage) {
    violations.push({
      rule: 'neverImpliedByUsage',
      description: 'Consent to share cannot be implied by usage',
      severity: 'critical',
    });
  }

  return {
    compliant: violations.length === 0,
    violations,
    checkedAt: new Date().toISOString(),
  };
}

/**
 * Check if surveillance prohibition is respected.
 */
export function validateNoSurveillance(
  activity: {
    continuousMonitoring: boolean;
    emotionalTracking: boolean;
    productivityScoring: boolean;
    hiddenAnalytics: boolean;
  }
): PrivacyComplianceStatus {
  const violations: PrivacyViolation[] = [];

  if (activity.continuousMonitoring) {
    violations.push({
      rule: 'noContinuousMonitoring',
      description: 'Continuous monitoring is prohibited',
      severity: 'critical',
    });
  }

  if (activity.emotionalTracking) {
    violations.push({
      rule: 'noEmotionalTracking',
      description: 'Emotional tracking is prohibited',
      severity: 'critical',
    });
  }

  if (activity.productivityScoring) {
    violations.push({
      rule: 'noProductivityScoring',
      description: 'Productivity scoring is prohibited',
      severity: 'critical',
    });
  }

  if (activity.hiddenAnalytics) {
    violations.push({
      rule: 'noHiddenIndividualAnalytics',
      description: 'Hidden individual analytics are prohibited',
      severity: 'critical',
    });
  }

  return {
    compliant: violations.length === 0,
    violations,
    checkedAt: new Date().toISOString(),
  };
}

/**
 * Check if a data type is considered personal data.
 */
export function isPersonalData(dataType: string): boolean {
  return PERSONAL_DATA_TYPES.includes(dataType as PersonalDataType);
}

/**
 * Get the highest protection level for conflicting regulations.
 */
export function resolveRegulatoryConflict(): string {
  return 'Apply highest protection level from all applicable regulations';
}

/* =========================================================
   CONSENT MANAGEMENT
   ========================================================= */

/**
 * Consent record.
 */
export interface ConsentRecord {
  id: string;
  userId: string;
  dataType: PersonalDataType;
  purpose: string;
  grantedAt: string;
  expiresAt?: string;
  revocable: true;
  revokedAt?: string;
}

/**
 * Create a consent record.
 */
export function createConsentRecord(
  userId: string,
  dataType: PersonalDataType,
  purpose: string,
  expiresInDays?: number
): ConsentRecord {
  const grantedAt = new Date();
  const expiresAt = expiresInDays
    ? new Date(grantedAt.getTime() + expiresInDays * 24 * 60 * 60 * 1000)
    : undefined;

  return {
    id: `consent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    dataType,
    purpose,
    grantedAt: grantedAt.toISOString(),
    expiresAt: expiresAt?.toISOString(),
    revocable: true,
  };
}

/**
 * Revoke a consent.
 */
export function revokeConsent(consent: ConsentRecord): ConsentRecord {
  return {
    ...consent,
    revokedAt: new Date().toISOString(),
  };
}

/**
 * Check if consent is still valid.
 */
export function isConsentValid(consent: ConsentRecord): boolean {
  // Revoked
  if (consent.revokedAt) return false;

  // Expired
  if (consent.expiresAt && new Date(consent.expiresAt) < new Date()) {
    return false;
  }

  return true;
}

/* =========================================================
   DATA DELETION
   ========================================================= */

/**
 * Deletion request.
 */
export interface DeletionRequest {
  id: string;
  userId: string;
  dataTypes: PersonalDataType[];
  requestedAt: string;
  reason?: string; // Optional - not required
  status: 'pending' | 'completed' | 'failed';
  completedAt?: string;
}

/**
 * Create a deletion request.
 * Note: No justification required as per data minimization rules.
 */
export function createDeletionRequest(
  userId: string,
  dataTypes: PersonalDataType[],
  reason?: string
): DeletionRequest {
  return {
    id: `deletion_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    dataTypes,
    requestedAt: new Date().toISOString(),
    reason, // Optional, user doesn't need to justify
    status: 'pending',
  };
}

/**
 * Complete a deletion request.
 * Deletion is immediate and irreversible.
 */
export function completeDeletion(request: DeletionRequest): DeletionRequest {
  return {
    ...request,
    status: 'completed',
    completedAt: new Date().toISOString(),
  };
}

/* =========================================================
   EXPORTS
   ========================================================= */

export default PRIVACY_AND_PERSONAL_DATA;
