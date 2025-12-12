/**
 * CHE·NU — DECISION ECHO SYSTEM
 * 
 * Status: OBSERVATIONAL DECISION MEMORY
 * Authority: NONE
 * Intent: TRANSPARENCY WITHOUT INFLUENCE
 * 
 * Decision Echo exists to reflect past decisions as they were taken,
 * without evaluation, reinforcement, or guidance.
 * 
 * It answers only: "What decision was made, and in what context?"
 * It NEVER answers: "Was it good?" "Should it be repeated?" "What comes next?"
 */

// =============================================================================
// CORE ENUMS
// =============================================================================

/**
 * Scope of the decision
 * Defines the boundary within which the decision applies
 */
export enum DecisionScope {
  SESSION = 'session',
  PROJECT = 'project',
  SPHERE = 'sphere',
  SYSTEM = 'system'
}

/**
 * Reversibility classification
 * Factual statement about whether the decision can be undone
 */
export enum DecisionReversibility {
  YES = 'yes',
  PARTIAL = 'partial',
  NO = 'no'
}

/**
 * Method by which the decision was confirmed
 */
export enum ConfirmationMethod {
  EXPLICIT = 'explicit',      // Direct human confirmation
  PROCEDURAL = 'procedural'   // Through defined procedure
}

/**
 * Context types at decision time
 */
export enum DecisionContextType {
  PLANNING = 'planning',
  EXECUTION = 'execution',
  REVIEW = 'review',
  EMERGENCY = 'emergency',
  STANDARD = 'standard'
}

/**
 * Working modes at decision time
 */
export enum DecisionWorkingMode {
  SOLO = 'solo',
  COLLABORATIVE = 'collaborative',
  SUPERVISED = 'supervised',
  AUTONOMOUS_LIMITED = 'autonomous_limited'
}

// =============================================================================
// ALLOWED LANGUAGE - Semantic Safety
// =============================================================================

/**
 * Language allowed in Decision Echo descriptions
 * These terms are factual and non-causal
 */
export const ALLOWED_ECHO_LANGUAGE = [
  'decided',
  'confirmed',
  'recorded',
  'occurred at',
  'selected',
  'chosen',
  'established',
  'declared',
  'specified',
  'noted',
  'documented',
  'registered',
  'marked',
  'timestamped'
] as const;

export type AllowedEchoTerm = typeof ALLOWED_ECHO_LANGUAGE[number];

/**
 * Language FORBIDDEN in Decision Echo descriptions
 * These terms imply causality, influence, or judgment
 */
export const FORBIDDEN_ECHO_LANGUAGE = [
  'led to',
  'caused',
  'resulted in',
  'influenced',
  'improved',
  'worsened',
  'successful',
  'failed',
  'optimal',
  'recommended',
  'suggested',
  'should',
  'better',
  'worse',
  'effective',
  'ineffective',
  'because of',
  'due to',
  'therefore',
  'consequently'
] as const;

export type ForbiddenEchoTerm = typeof FORBIDDEN_ECHO_LANGUAGE[number];

// =============================================================================
// CONTEXT SNAPSHOT
// =============================================================================

/**
 * Operational constraints active at decision time
 * Factual record, not evaluation
 */
export interface OperationalConstraintsSnapshot {
  /** Time constraints that were active */
  readonly timeConstraints: ReadonlyArray<string>;
  
  /** Resource constraints that were active */
  readonly resourceConstraints: ReadonlyArray<string>;
  
  /** Regulatory constraints that were active */
  readonly regulatoryConstraints: ReadonlyArray<string>;
  
  /** Technical constraints that were active */
  readonly technicalConstraints: ReadonlyArray<string>;
  
  /** Human-declared constraints */
  readonly declaredConstraints: ReadonlyArray<string>;
}

/**
 * Complete context snapshot at decision time
 * Immutable record of the decision environment
 */
export interface DecisionContextSnapshot {
  /** Type of context when decision occurred */
  readonly contextType: DecisionContextType;
  
  /** Working mode when decision occurred */
  readonly workingMode: DecisionWorkingMode;
  
  /** Active constraints at decision time */
  readonly constraints: OperationalConstraintsSnapshot;
  
  /** Active sphere/domain identifier */
  readonly activeSphere?: string;
  
  /** Active project identifier */
  readonly activeProject?: string;
  
  /** Session identifier */
  readonly sessionId: string;
  
  /** Any context tags that were active */
  readonly contextTags: ReadonlyArray<string>;
}

// =============================================================================
// DECISION ECHO - Core Data Model
// =============================================================================

/**
 * Decision Echo
 * 
 * A factual mirror of a past decision, temporally anchored and context-bound.
 * 
 * Preserves:
 * - the declared intent at decision time
 * - the active context frame
 * - known constraints
 * 
 * Does NOT preserve:
 * - reasoning chains
 * - emotional states
 * - inferred motivations
 */
export interface DecisionEcho {
  /** Unique identifier for this decision echo */
  readonly decisionId: string;
  
  /** Exact timestamp when decision was confirmed */
  readonly timestamp: string; // ISO 8601
  
  /** Scope of the decision */
  readonly scope: DecisionScope;
  
  /** The objective as declared by the human at decision time */
  readonly declaredObjective: string;
  
  /** Complete context snapshot at decision time */
  readonly contextSnapshot: DecisionContextSnapshot;
  
  /** The decision statement itself - what was decided */
  readonly decisionStatement: string;
  
  /** Factual reversibility classification */
  readonly reversibility: DecisionReversibility;
  
  /** How the decision was confirmed */
  readonly confirmationMethod: ConfirmationMethod;
  
  /** Human identifier who made the decision */
  readonly decidedBy: string;
  
  /** Optional domain/category tag */
  readonly domain?: string;
  
  /** Optional reference identifiers (e.g., related documents) */
  readonly references?: ReadonlyArray<string>;
}

// =============================================================================
// CREATION VALIDATION
// =============================================================================

/**
 * Conditions that MUST be met for echo creation
 */
export interface EchoCreationConditions {
  /** Human explicitly validated the decision */
  readonly humanValidated: boolean;
  
  /** System was in decision context (not exploration/draft) */
  readonly inDecisionContext: boolean;
  
  /** Confirmation was properly recorded */
  readonly confirmationRecorded: boolean;
}

/**
 * Conditions that PREVENT echo creation
 * If any of these are true, no echo should be created
 */
export interface EchoPreventionConditions {
  /** Was this an exploration? */
  readonly isExploration: boolean;
  
  /** Was this a comparison? */
  readonly isComparison: boolean;
  
  /** Was this a suggestion? */
  readonly isSuggestion: boolean;
  
  /** Was this a draft? */
  readonly isDraft: boolean;
  
  /** Was this a simulation? */
  readonly isSimulation: boolean;
}

/**
 * Input for creating a new Decision Echo
 * Validated before echo creation
 */
export interface DecisionEchoInput {
  /** Scope of the decision */
  scope: DecisionScope;
  
  /** Declared objective */
  declaredObjective: string;
  
  /** Decision statement */
  decisionStatement: string;
  
  /** Reversibility */
  reversibility: DecisionReversibility;
  
  /** Confirmation method */
  confirmationMethod: ConfirmationMethod;
  
  /** Who made the decision */
  decidedBy: string;
  
  /** Current context for snapshot */
  currentContext: {
    contextType: DecisionContextType;
    workingMode: DecisionWorkingMode;
    activeSphere?: string;
    activeProject?: string;
    sessionId: string;
    contextTags?: string[];
  };
  
  /** Active constraints */
  constraints?: Partial<OperationalConstraintsSnapshot>;
  
  /** Optional domain */
  domain?: string;
  
  /** Optional references */
  references?: string[];
  
  /** Creation conditions - must all be true */
  creationConditions: EchoCreationConditions;
  
  /** Prevention conditions - must all be false */
  preventionConditions: EchoPreventionConditions;
}

// =============================================================================
// QUERY INTERFACE (READ-ONLY)
// =============================================================================

/**
 * Query parameters for retrieving Decision Echoes
 * No ranking, no sorting by relevance - only chronological
 */
export interface DecisionEchoQuery {
  /** Filter by scope */
  scope?: DecisionScope;
  
  /** Filter by date range - start */
  fromTimestamp?: string;
  
  /** Filter by date range - end */
  toTimestamp?: string;
  
  /** Filter by decidedBy */
  decidedBy?: string;
  
  /** Filter by domain */
  domain?: string;
  
  /** Filter by sphere */
  sphere?: string;
  
  /** Filter by project */
  project?: string;
  
  /** Filter by session */
  sessionId?: string;
  
  /** Maximum results (for pagination) */
  limit?: number;
  
  /** Offset for pagination */
  offset?: number;
}

/**
 * Result of a Decision Echo query
 * Always chronologically ordered, no ranking
 */
export interface DecisionEchoQueryResult {
  /** The echoes, in chronological order */
  readonly echoes: ReadonlyArray<DecisionEcho>;
  
  /** Total count matching query */
  readonly totalCount: number;
  
  /** Whether more results exist */
  readonly hasMore: boolean;
  
  /** Query that produced these results */
  readonly query: DecisionEchoQuery;
  
  /** Timestamp of query execution */
  readonly queriedAt: string;
}

// =============================================================================
// DISPLAY CONFIGURATION
// =============================================================================

/**
 * Display rules for Decision Echoes
 * Enforces presentation requirements
 */
export interface EchoDisplayRules {
  /** Echoes displayed as static entries */
  readonly displayAsStatic: true;
  
  /** Always chronologically ordered */
  readonly orderChronologically: true;
  
  /** No highlighting allowed */
  readonly noHighlighting: true;
  
  /** No emphasis allowed */
  readonly noEmphasis: true;
  
  /** No urgency indicators */
  readonly noUrgency: true;
  
  /** No call-to-action */
  readonly noCallToAction: true;
}

/**
 * Default display rules - immutable
 */
export const DEFAULT_ECHO_DISPLAY_RULES: EchoDisplayRules = Object.freeze({
  displayAsStatic: true,
  orderChronologically: true,
  noHighlighting: true,
  noEmphasis: true,
  noUrgency: true,
  noCallToAction: true
});

// =============================================================================
// XR VISUALIZATION (OPTIONAL)
// =============================================================================

/**
 * XR marker configuration for Decision Echoes
 * Markers are landmarks, not milestones
 */
export interface EchoXRMarker {
  /** Position in 3D space */
  readonly position: {
    readonly x: number;
    readonly y: number;
    readonly z: number;
  };
  
  /** Fixed marker - no animation */
  readonly isFixed: true;
  
  /** No directional arrows */
  readonly hasDirectionalArrows: false;
  
  /** No glow effect */
  readonly hasGlow: false;
  
  /** No reward signal */
  readonly hasRewardSignal: false;
  
  /** Base appearance - neutral */
  readonly appearance: 'neutral';
  
  /** The echo this marker represents */
  readonly echoId: string;
}

/**
 * XR display rules for Decision Echoes
 */
export interface EchoXRDisplayRules {
  /** Appear as fixed markers */
  readonly asFixedMarkers: true;
  
  /** No directional arrows ever */
  readonly noDirectionalArrows: true;
  
  /** No glow or reward signals */
  readonly noGlowOrReward: true;
  
  /** Markers are landmarks */
  readonly markersAreLandmarks: true;
  
  /** Markers are NOT milestones */
  readonly markersAreNotMilestones: true;
}

// =============================================================================
// FAILSAFES
// =============================================================================

/**
 * Failsafe declarations for Decision Echo system
 * These are architectural constraints, not configurable options
 */
export interface DecisionEchoFailsafes {
  /** Echoes cannot trigger workflows */
  readonly cannotTriggerWorkflows: true;
  
  /** Echoes cannot be edited */
  readonly cannotBeEdited: true;
  
  /** Echoes cannot be ranked */
  readonly cannotBeRanked: true;
  
  /** Echoes cannot be summarized automatically */
  readonly cannotBeAutoSummarized: true;
  
  /** Echoes cannot connect to orchestrator */
  readonly cannotConnectToOrchestrator: true;
  
  /** Echoes cannot connect to agents */
  readonly cannotConnectToAgents: true;
  
  /** Echoes cannot feed preference learning */
  readonly cannotFeedPreferenceLearning: true;
  
  /** Echoes cannot suggest context */
  readonly cannotSuggestContext: true;
  
  /** Echoes cannot trigger execution */
  readonly cannotTriggerExecution: true;
}

/**
 * Immutable failsafe configuration
 */
export const DECISION_ECHO_FAILSAFES: DecisionEchoFailsafes = Object.freeze({
  cannotTriggerWorkflows: true,
  cannotBeEdited: true,
  cannotBeRanked: true,
  cannotBeAutoSummarized: true,
  cannotConnectToOrchestrator: true,
  cannotConnectToAgents: true,
  cannotFeedPreferenceLearning: true,
  cannotSuggestContext: true,
  cannotTriggerExecution: true
});

// =============================================================================
// SYSTEM METADATA
// =============================================================================

/**
 * Decision Echo System metadata
 */
export interface DecisionEchoSystemInfo {
  /** System status */
  readonly status: 'OBSERVATIONAL DECISION MEMORY';
  
  /** Authority level */
  readonly authority: 'NONE';
  
  /** System intent */
  readonly intent: 'TRANSPARENCY WITHOUT INFLUENCE';
  
  /** Version */
  readonly version: string;
  
  /** Failsafes */
  readonly failsafes: DecisionEchoFailsafes;
  
  /** Display rules */
  readonly displayRules: EchoDisplayRules;
}

/**
 * System declaration
 */
export const DECISION_ECHO_DECLARATION = `
Decision Echo exists to preserve memory,
not to anchor behavior.

A decision remembered is not a decision repeated.
A record observed is not a path enforced.

Responsibility remains human.
Awareness remains optional.
`.trim();

// =============================================================================
// VALIDATION TYPES
// =============================================================================

/**
 * Result of language validation
 */
export interface LanguageValidationResult {
  /** Whether the text passes validation */
  readonly isValid: boolean;
  
  /** Any forbidden terms found */
  readonly forbiddenTermsFound: ReadonlyArray<string>;
  
  /** The validated text */
  readonly text: string;
}

/**
 * Result of echo creation validation
 */
export interface EchoCreationValidationResult {
  /** Whether echo can be created */
  readonly canCreate: boolean;
  
  /** Reason if cannot create */
  readonly reason?: string;
  
  /** Failed conditions */
  readonly failedConditions?: ReadonlyArray<string>;
}

// =============================================================================
// STORAGE INTERFACE
// =============================================================================

/**
 * Storage interface for Decision Echoes
 * Append-only, no update, no delete
 */
export interface DecisionEchoStorage {
  /** Store a new echo (append-only) */
  store(echo: DecisionEcho): Promise<void>;
  
  /** Retrieve an echo by ID */
  retrieve(decisionId: string): Promise<DecisionEcho | null>;
  
  /** Query echoes (read-only) */
  query(query: DecisionEchoQuery): Promise<DecisionEchoQueryResult>;
  
  /** Count echoes matching criteria */
  count(query: Omit<DecisionEchoQuery, 'limit' | 'offset'>): Promise<number>;
  
  /** Check if echo exists */
  exists(decisionId: string): Promise<boolean>;
}

// =============================================================================
// EVENT TYPES (For audit trail only)
// =============================================================================

/**
 * Events emitted by Decision Echo system
 * For audit purposes only, not for triggering actions
 */
export type DecisionEchoEvent =
  | { type: 'ECHO_CREATED'; echo: DecisionEcho; timestamp: string }
  | { type: 'ECHO_QUERIED'; query: DecisionEchoQuery; resultCount: number; timestamp: string }
  | { type: 'ECHO_VIEWED'; echoId: string; viewedBy: string; timestamp: string };

/**
 * Audit record for Decision Echo events
 */
export interface DecisionEchoAuditRecord {
  readonly event: DecisionEchoEvent;
  readonly recordedAt: string;
  readonly source: 'decision-echo-system';
}
