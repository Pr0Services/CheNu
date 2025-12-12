/* =====================================================
   CHE·NU — PERSONAL DATA & PRIVACY GUARANTEES
   Status: FOUNDATIONAL EXTENSION
   Authority: HUMAN ONLY
   Scope: ALL PERSONAL, SENSITIVE, AND IDENTIFIABLE DATA
   
   📜 CORE PRINCIPLE:
   Any data that can identify, describe, or be
   linked to a human individual is considered
   PERSONAL DATA and is protected by default.
   
   Protection applies regardless of:
   - intent
   - feature
   - optimization value
   - business interest
   
   🔐 CHE·NU treats privacy not as a feature
      but as a structural constraint.
   
   ❤️ With love, for humanity.
   ===================================================== */

/* =========================================================
   DATA CLASSIFICATION
   ========================================================= */

/**
 * Types of personal data.
 * Personal data includes (non-exhaustive):
 */
export type PersonalDataType =
  | 'identity'              // Name, ID, contact info
  | 'profile'               // Personal profiles
  | 'preferences'           // User preferences
  | 'notes'                 // Personal notes
  | 'behavioral'            // Behavioral traces
  | 'messages'              // Private messages
  | 'project-content'       // Project content tied to a person
  | 'biometric'             // Biometric data
  | 'xr-signals'            // XR-related signals
  | 'inferred-context'      // Inferred context tied to an individual
  | 'location'              // Location data
  | 'health'                // Health-related data
  | 'financial'             // Financial data
  | 'relationships';        // Relationship data

/**
 * Data sensitivity levels.
 */
export type DataSensitivity =
  | 'standard'              // Normal personal data
  | 'sensitive'             // Sensitive data (health, biometric, etc.)
  | 'maximum';              // Maximum protection required

/**
 * Personal data classification.
 */
export interface PersonalDataClassification {
  type: PersonalDataType;
  sensitivity: DataSensitivity;
  description: string;
  protectionLevel: 'default' | 'enhanced' | 'maximum';
}

/**
 * Default classification for all personal data types.
 */
export const DATA_CLASSIFICATIONS: Record<PersonalDataType, PersonalDataClassification> = {
  identity: {
    type: 'identity',
    sensitivity: 'sensitive',
    description: 'Name, ID, contact information',
    protectionLevel: 'enhanced',
  },
  profile: {
    type: 'profile',
    sensitivity: 'standard',
    description: 'Personal profiles',
    protectionLevel: 'default',
  },
  preferences: {
    type: 'preferences',
    sensitivity: 'standard',
    description: 'User preferences',
    protectionLevel: 'default',
  },
  notes: {
    type: 'notes',
    sensitivity: 'standard',
    description: 'Personal notes',
    protectionLevel: 'default',
  },
  behavioral: {
    type: 'behavioral',
    sensitivity: 'sensitive',
    description: 'Behavioral traces',
    protectionLevel: 'enhanced',
  },
  messages: {
    type: 'messages',
    sensitivity: 'sensitive',
    description: 'Private messages',
    protectionLevel: 'enhanced',
  },
  'project-content': {
    type: 'project-content',
    sensitivity: 'standard',
    description: 'Project content tied to a person',
    protectionLevel: 'default',
  },
  biometric: {
    type: 'biometric',
    sensitivity: 'maximum',
    description: 'Biometric data',
    protectionLevel: 'maximum',
  },
  'xr-signals': {
    type: 'xr-signals',
    sensitivity: 'sensitive',
    description: 'XR-related signals',
    protectionLevel: 'enhanced',
  },
  'inferred-context': {
    type: 'inferred-context',
    sensitivity: 'sensitive',
    description: 'Inferred context tied to an individual',
    protectionLevel: 'enhanced',
  },
  location: {
    type: 'location',
    sensitivity: 'sensitive',
    description: 'Location data',
    protectionLevel: 'enhanced',
  },
  health: {
    type: 'health',
    sensitivity: 'maximum',
    description: 'Health-related data',
    protectionLevel: 'maximum',
  },
  financial: {
    type: 'financial',
    sensitivity: 'maximum',
    description: 'Financial data',
    protectionLevel: 'maximum',
  },
  relationships: {
    type: 'relationships',
    sensitivity: 'sensitive',
    description: 'Relationship data',
    protectionLevel: 'enhanced',
  },
};

/* =========================================================
   DEFAULT PRIVACY RULE
   ========================================================= */

/**
 * Default privacy state for all personal data.
 * 
 * All personal data is:
 * - private by default
 * - inaccessible to other users
 * - inaccessible to other agents
 * - inaccessible to operators
 */
export const DEFAULT_PRIVACY_RULE = {
  /** Private by default */
  privateByDefault: true,

  /** Inaccessible to other users */
  inaccessibleToOtherUsers: true,

  /** Inaccessible to other agents */
  inaccessibleToOtherAgents: true,

  /** Inaccessible to operators */
  inaccessibleToOperators: true,
} as const;

/**
 * Access requirements for personal data.
 * 
 * Access requires:
 * - explicit human action
 * - explicit scope
 * - explicit duration
 */
export interface AccessRequirements {
  /** Explicit human action required */
  explicitHumanAction: true;

  /** Explicit scope required */
  explicitScope: true;

  /** Explicit duration required */
  explicitDuration: true;
}

/**
 * A personal data access request.
 */
export interface DataAccessRequest {
  /** Who is requesting */
  requesterId: string;

  /** Type of requester */
  requesterType: 'user' | 'agent' | 'operator' | 'system';

  /** What data is requested */
  dataTypes: PersonalDataType[];

  /** Purpose of access */
  purpose: string;

  /** Scope of access */
  scope: string;

  /** Duration of access */
  duration: {
    type: 'single-task' | 'time-limited' | 'until-revoked';
    expiresAt?: string; // ISO timestamp for time-limited
  };

  /** Timestamp of request */
  requestedAt: string;
}

/**
 * A personal data access grant.
 */
export interface DataAccessGrant {
  /** The original request */
  request: DataAccessRequest;

  /** Was access granted */
  granted: boolean;

  /** Human who granted/denied */
  decidedBy: string;

  /** Timestamp of decision */
  decidedAt: string;

  /** Reason (optional) */
  reason?: string;

  /** Revocation info (if revoked) */
  revocation?: {
    revokedAt: string;
    revokedBy: string;
  };
}

/* =========================================================
   AGENT ACCESS RULES
   ========================================================= */

/**
 * Agent access rules for personal data.
 * 
 * Agents:
 * - NEVER access personal data implicitly
 * - NEVER aggregate personal data silently
 * - NEVER infer meaning beyond declared scope
 * - MUST declare every personal-data touch
 */
export const AGENT_DATA_RULES = {
  /** NEVER access personal data implicitly */
  neverImplicitAccess: true,

  /** NEVER aggregate personal data silently */
  neverSilentAggregation: true,

  /** NEVER infer meaning beyond declared scope */
  neverInferBeyondScope: true,

  /** MUST declare every personal-data touch */
  mustDeclareEveryTouch: true,
} as const;

/**
 * Conditions for agent access to personal data.
 * 
 * Agents may access personal data ONLY IF:
 * - explicitly requested by the human
 * - limited to a single task
 * - non-persistent
 */
export interface AgentAccessConditions {
  /** Explicitly requested by the human */
  explicitlyRequested: boolean;

  /** Limited to a single task */
  limitedToSingleTask: boolean;

  /** Non-persistent (no storage after task) */
  nonPersistent: boolean;
}

/**
 * An agent's data access declaration.
 */
export interface AgentDataDeclaration {
  /** Agent ID */
  agentId: string;

  /** Task ID this access is for */
  taskId: string;

  /** Data types being accessed */
  dataTypes: PersonalDataType[];

  /** Purpose */
  purpose: string;

  /** Timestamp of access */
  accessedAt: string;

  /** Will data be persisted? */
  willPersist: false; // Always false per rules

  /** Human who authorized */
  authorizedBy: string;
}

/* =========================================================
   DISCLOSURE & SHARING
   ========================================================= */

/**
 * Disclosure rules.
 * 
 * Disclosure of personal data:
 * - is always explicit
 * - is always reversible
 * - never implied by usage
 * 
 * No "opt-out by default".
 * No dark patterns.
 */
export const DISCLOSURE_RULES = {
  /** Always explicit */
  alwaysExplicit: true,

  /** Always reversible */
  alwaysReversible: true,

  /** Never implied by usage */
  neverImpliedByUsage: true,

  /** No opt-out by default */
  noOptOutByDefault: true,

  /** No dark patterns */
  noDarkPatterns: true,
} as const;

/**
 * A disclosure record.
 */
export interface DisclosureRecord {
  /** Unique ID */
  id: string;

  /** What was disclosed */
  dataTypes: PersonalDataType[];

  /** To whom */
  disclosedTo: string;

  /** Purpose */
  purpose: string;

  /** When */
  disclosedAt: string;

  /** Explicit consent reference */
  consentId: string;

  /** Is it still active */
  active: boolean;

  /** Revocation info (if revoked) */
  revocation?: {
    revokedAt: string;
    reason?: string;
  };
}

/* =========================================================
   DATA MINIMIZATION
   ========================================================= */

/**
 * Data minimization rules.
 * 
 * The system must:
 * - collect the minimum data required
 * - avoid redundancy
 * - allow users to delete without justification
 * 
 * Deletion is:
 * - immediate
 * - irreversible
 * - non-penalizing
 */
export const DATA_MINIMIZATION_RULES = {
  /** Collect minimum data required */
  collectMinimum: true,

  /** Avoid redundancy */
  avoidRedundancy: true,

  /** Allow deletion without justification */
  deletionWithoutJustification: true,

  /** Deletion is immediate */
  deletionImmediate: true,

  /** Deletion is irreversible */
  deletionIrreversible: true,

  /** Deletion is non-penalizing */
  deletionNonPenalizing: true,
} as const;

/**
 * A deletion request.
 */
export interface DeletionRequest {
  /** User requesting deletion */
  userId: string;

  /** Data types to delete */
  dataTypes: PersonalDataType[] | 'all';

  /** Timestamp of request */
  requestedAt: string;

  /** No justification required */
  justification: 'not-required';
}

/**
 * A deletion confirmation.
 */
export interface DeletionConfirmation {
  /** The original request */
  request: DeletionRequest;

  /** Was deletion completed */
  completed: boolean;

  /** Timestamp of deletion */
  deletedAt: string;

  /** What was deleted */
  deletedDataTypes: PersonalDataType[];

  /** Irreversible confirmation */
  irreversible: true;

  /** No penalty applied */
  penaltyApplied: false;
}

/* =========================================================
   EXPORT & PORTABILITY
   ========================================================= */

/**
 * Export and portability rules.
 * 
 * Users may:
 * - export all personal data
 * - inspect it in human-readable formats
 * - take it outside the system freely
 * 
 * Exported data:
 * - loses all system authority
 * - cannot be reused without new consent
 */
export const EXPORT_RULES = {
  /** Can export all personal data */
  canExportAll: true,

  /** Human-readable formats */
  humanReadableFormats: true,

  /** Free to take outside */
  freeToTakeOutside: true,

  /** Exported data loses system authority */
  losesSystemAuthority: true,

  /** Requires new consent to reuse */
  requiresNewConsentToReuse: true,
} as const;

/**
 * Supported export formats.
 */
export type ExportFormat = 
  | 'json'
  | 'csv'
  | 'xml'
  | 'pdf'
  | 'html';

/**
 * An export request.
 */
export interface ExportRequest {
  /** User requesting export */
  userId: string;

  /** Data types to export */
  dataTypes: PersonalDataType[] | 'all';

  /** Desired format */
  format: ExportFormat;

  /** Timestamp of request */
  requestedAt: string;
}

/**
 * An export result.
 */
export interface ExportResult {
  /** The original request */
  request: ExportRequest;

  /** Was export completed */
  completed: boolean;

  /** Timestamp of export */
  exportedAt: string;

  /** Format of export */
  format: ExportFormat;

  /** Size in bytes */
  sizeBytes: number;

  /** Download URL (temporary) */
  downloadUrl?: string;

  /** Expiration of download URL */
  downloadExpiresAt?: string;

  /** System authority status */
  systemAuthority: 'none';

  /** Consent status for reuse */
  reuseConsent: 'required';
}

/* =========================================================
   LEGAL & REGULATORY ALIGNMENT
   ========================================================= */

/**
 * Regulatory frameworks CHE·NU aligns with.
 */
export type RegulatoryFramework =
  | 'GDPR'      // EU General Data Protection Regulation
  | 'CCPA'      // California Consumer Privacy Act
  | 'CPRA'      // California Privacy Rights Act
  | 'PIPEDA'    // Canada Personal Information Protection
  | 'LGPD'      // Brazil Lei Geral de Proteção de Dados
  | 'POPIA';    // South Africa Protection of Personal Information Act

/**
 * Regulatory alignment declaration.
 */
export const REGULATORY_ALIGNMENT = {
  /** Designed to be compatible with */
  compatibleWith: ['GDPR', 'CCPA', 'CPRA', 'PIPEDA'] as RegulatoryFramework[],

  /** Conflict resolution rule */
  conflictResolution: 'When law conflicts with foundation, higher protection applies.',
} as const;

/* =========================================================
   SURVEILLANCE & MONITORING PROHIBITIONS
   ========================================================= */

/**
 * Surveillance and monitoring prohibitions.
 * 
 * CHE·NU forbids:
 * - continuous surveillance
 * - emotional monitoring
 * - productivity tracking without consent
 * - hidden analytics on individuals
 */
export const SURVEILLANCE_PROHIBITIONS = {
  /** Continuous surveillance */
  continuousSurveillance: 'FORBIDDEN',

  /** Emotional monitoring */
  emotionalMonitoring: 'FORBIDDEN',

  /** Productivity tracking without consent */
  productivityTrackingWithoutConsent: 'FORBIDDEN',

  /** Hidden analytics on individuals */
  hiddenIndividualAnalytics: 'FORBIDDEN',
} as const;

/**
 * Type for prohibition status.
 */
export type ProhibitionStatus = 'FORBIDDEN' | 'ALLOWED_WITH_CONSENT';

/* =========================================================
   SYSTEM DECLARATION
   ========================================================= */

/**
 * System declaration on privacy.
 * 
 * CHE·NU treats privacy not as a feature
 * but as a structural constraint.
 * 
 * If a feature requires violating personal privacy,
 * the feature must not exist.
 */
export const PRIVACY_SYSTEM_DECLARATION = `
CHE·NU treats privacy not as a feature
but as a structural constraint.

If a feature requires violating personal privacy,
the feature must not exist.
`.trim();

/* =========================================================
   PRIVACY GUARANTEES MANIFEST
   ========================================================= */

/**
 * Complete privacy guarantees manifest.
 */
export interface PrivacyGuaranteesManifest {
  /** Manifest metadata */
  metadata: {
    name: 'CHE·NU Privacy Guarantees';
    status: 'FOUNDATIONAL EXTENSION';
    authority: 'HUMAN ONLY';
    version: string;
  };

  /** Core principle */
  corePrinciple: string;

  /** Data classifications */
  dataClassifications: Record<PersonalDataType, PersonalDataClassification>;

  /** Default privacy rule */
  defaultPrivacyRule: typeof DEFAULT_PRIVACY_RULE;

  /** Agent data rules */
  agentDataRules: typeof AGENT_DATA_RULES;

  /** Disclosure rules */
  disclosureRules: typeof DISCLOSURE_RULES;

  /** Data minimization rules */
  dataMinimizationRules: typeof DATA_MINIMIZATION_RULES;

  /** Export rules */
  exportRules: typeof EXPORT_RULES;

  /** Regulatory alignment */
  regulatoryAlignment: typeof REGULATORY_ALIGNMENT;

  /** Surveillance prohibitions */
  surveillanceProhibitions: typeof SURVEILLANCE_PROHIBITIONS;

  /** System declaration */
  systemDeclaration: string;
}

/**
 * The canonical privacy guarantees manifest.
 */
export const PRIVACY_GUARANTEES_MANIFEST: PrivacyGuaranteesManifest = {
  metadata: {
    name: 'CHE·NU Privacy Guarantees',
    status: 'FOUNDATIONAL EXTENSION',
    authority: 'HUMAN ONLY',
    version: '1.0.0',
  },

  corePrinciple: `Any data that can identify, describe, or be
linked to a human individual is considered
PERSONAL DATA and is protected by default.

Protection applies regardless of:
- intent
- feature
- optimization value
- business interest`,

  dataClassifications: DATA_CLASSIFICATIONS,
  defaultPrivacyRule: DEFAULT_PRIVACY_RULE,
  agentDataRules: AGENT_DATA_RULES,
  disclosureRules: DISCLOSURE_RULES,
  dataMinimizationRules: DATA_MINIMIZATION_RULES,
  exportRules: EXPORT_RULES,
  regulatoryAlignment: REGULATORY_ALIGNMENT,
  surveillanceProhibitions: SURVEILLANCE_PROHIBITIONS,
  systemDeclaration: PRIVACY_SYSTEM_DECLARATION,
};

/* =========================================================
   VALIDATION HELPERS
   ========================================================= */

/**
 * Check if agent access conditions are met.
 */
export function validateAgentAccess(conditions: AgentAccessConditions): boolean {
  return (
    conditions.explicitlyRequested === true &&
    conditions.limitedToSingleTask === true &&
    conditions.nonPersistent === true
  );
}

/**
 * Check if a data access request is valid.
 */
export function validateDataAccessRequest(request: DataAccessRequest): {
  valid: boolean;
  reason?: string;
} {
  // Operators cannot access personal data
  if (request.requesterType === 'operator') {
    return { valid: false, reason: 'Operators cannot access personal data' };
  }

  // System cannot access personal data
  if (request.requesterType === 'system') {
    return { valid: false, reason: 'System cannot access personal data without human authorization' };
  }

  // Must have explicit scope
  if (!request.scope || request.scope.trim() === '') {
    return { valid: false, reason: 'Explicit scope required' };
  }

  // Must have explicit purpose
  if (!request.purpose || request.purpose.trim() === '') {
    return { valid: false, reason: 'Explicit purpose required' };
  }

  // Duration must be specified
  if (!request.duration || !request.duration.type) {
    return { valid: false, reason: 'Explicit duration required' };
  }

  return { valid: true };
}

/**
 * Check if a feature violates privacy constraints.
 */
export function checkFeaturePrivacyCompliance(feature: {
  requiresContinuousSurveillance?: boolean;
  requiresEmotionalMonitoring?: boolean;
  requiresProductivityTracking?: boolean;
  requiresHiddenAnalytics?: boolean;
  requiresImplicitDataAccess?: boolean;
}): {
  compliant: boolean;
  violations: string[];
} {
  const violations: string[] = [];

  if (feature.requiresContinuousSurveillance) {
    violations.push('Continuous surveillance is FORBIDDEN');
  }
  if (feature.requiresEmotionalMonitoring) {
    violations.push('Emotional monitoring is FORBIDDEN');
  }
  if (feature.requiresProductivityTracking) {
    violations.push('Productivity tracking without consent is FORBIDDEN');
  }
  if (feature.requiresHiddenAnalytics) {
    violations.push('Hidden analytics on individuals is FORBIDDEN');
  }
  if (feature.requiresImplicitDataAccess) {
    violations.push('Implicit data access is FORBIDDEN');
  }

  return {
    compliant: violations.length === 0,
    violations,
  };
}

/* =========================================================
   EXPORTS
   ========================================================= */

export default PRIVACY_GUARANTEES_MANIFEST;
