/**
 * CHE·NU — DECISION ECHO ENGINE
 * 
 * Status: OBSERVATIONAL DECISION MEMORY
 * Authority: NONE
 * Intent: TRANSPARENCY WITHOUT INFLUENCE
 * 
 * This engine provides:
 * - Validation of echo creation conditions
 * - Language safety checking
 * - Append-only storage
 * - Read-only retrieval
 * 
 * It does NOT provide:
 * - Editing capabilities
 * - Ranking or scoring
 * - Recommendations based on past decisions
 * - Any connection to orchestrator or agents
 */

import {
  DecisionEcho,
  DecisionEchoInput,
  DecisionEchoQuery,
  DecisionEchoQueryResult,
  DecisionScope,
  DecisionReversibility,
  ConfirmationMethod,
  DecisionContextType,
  DecisionWorkingMode,
  EchoCreationConditions,
  EchoPreventionConditions,
  EchoCreationValidationResult,
  LanguageValidationResult,
  DecisionEchoStorage,
  DecisionEchoEvent,
  DecisionEchoAuditRecord,
  DecisionContextSnapshot,
  OperationalConstraintsSnapshot,
  ALLOWED_ECHO_LANGUAGE,
  FORBIDDEN_ECHO_LANGUAGE,
  DECISION_ECHO_FAILSAFES,
  DEFAULT_ECHO_DISPLAY_RULES,
  DECISION_ECHO_DECLARATION
} from './decisionEcho.types';

// =============================================================================
// LANGUAGE VALIDATION
// =============================================================================

/**
 * Validates text against forbidden language rules
 * Ensures semantic safety of echo descriptions
 */
export function validateEchoLanguage(text: string): LanguageValidationResult {
  const lowerText = text.toLowerCase();
  const forbiddenTermsFound: string[] = [];
  
  for (const forbidden of FORBIDDEN_ECHO_LANGUAGE) {
    if (lowerText.includes(forbidden.toLowerCase())) {
      forbiddenTermsFound.push(forbidden);
    }
  }
  
  return {
    isValid: forbiddenTermsFound.length === 0,
    forbiddenTermsFound,
    text
  };
}

/**
 * Sanitizes text by flagging forbidden terms
 * Does NOT auto-replace - returns validation result for human review
 */
export function checkTextForForbiddenTerms(text: string): {
  hasForbiddenTerms: boolean;
  terms: string[];
  suggestion: string;
} {
  const validation = validateEchoLanguage(text);
  
  if (validation.isValid) {
    return {
      hasForbiddenTerms: false,
      terms: [],
      suggestion: text
    };
  }
  
  return {
    hasForbiddenTerms: true,
    terms: [...validation.forbiddenTermsFound],
    suggestion: 'Please rephrase using factual, non-causal language. ' +
      `Forbidden terms found: ${validation.forbiddenTermsFound.join(', ')}. ` +
      `Suggested alternatives: ${ALLOWED_ECHO_LANGUAGE.slice(0, 5).join(', ')}, etc.`
  };
}

// =============================================================================
// CREATION VALIDATION
// =============================================================================

/**
 * Validates conditions for echo creation
 * Returns detailed validation result
 */
export function validateCreationConditions(
  conditions: EchoCreationConditions,
  preventionConditions: EchoPreventionConditions
): EchoCreationValidationResult {
  const failedConditions: string[] = [];
  
  // Check required conditions
  if (!conditions.humanValidated) {
    failedConditions.push('Human validation required');
  }
  if (!conditions.inDecisionContext) {
    failedConditions.push('Must be in decision context');
  }
  if (!conditions.confirmationRecorded) {
    failedConditions.push('Confirmation must be recorded');
  }
  
  // Check prevention conditions
  if (preventionConditions.isExploration) {
    failedConditions.push('Cannot create echo for exploration');
  }
  if (preventionConditions.isComparison) {
    failedConditions.push('Cannot create echo for comparison');
  }
  if (preventionConditions.isSuggestion) {
    failedConditions.push('Cannot create echo for suggestion');
  }
  if (preventionConditions.isDraft) {
    failedConditions.push('Cannot create echo for draft');
  }
  if (preventionConditions.isSimulation) {
    failedConditions.push('Cannot create echo for simulation');
  }
  
  if (failedConditions.length > 0) {
    return {
      canCreate: false,
      reason: failedConditions.join('; '),
      failedConditions
    };
  }
  
  return { canCreate: true };
}

/**
 * Validates complete echo input
 */
export function validateEchoInput(input: DecisionEchoInput): EchoCreationValidationResult {
  // Validate creation conditions
  const conditionResult = validateCreationConditions(
    input.creationConditions,
    input.preventionConditions
  );
  
  if (!conditionResult.canCreate) {
    return conditionResult;
  }
  
  // Validate language in text fields
  const objectiveValidation = validateEchoLanguage(input.declaredObjective);
  if (!objectiveValidation.isValid) {
    return {
      canCreate: false,
      reason: `Forbidden language in declaredObjective: ${objectiveValidation.forbiddenTermsFound.join(', ')}`,
      failedConditions: ['Language validation failed for declaredObjective']
    };
  }
  
  const statementValidation = validateEchoLanguage(input.decisionStatement);
  if (!statementValidation.isValid) {
    return {
      canCreate: false,
      reason: `Forbidden language in decisionStatement: ${statementValidation.forbiddenTermsFound.join(', ')}`,
      failedConditions: ['Language validation failed for decisionStatement']
    };
  }
  
  // Validate required fields
  if (!input.declaredObjective.trim()) {
    return {
      canCreate: false,
      reason: 'declaredObjective is required',
      failedConditions: ['Missing declaredObjective']
    };
  }
  
  if (!input.decisionStatement.trim()) {
    return {
      canCreate: false,
      reason: 'decisionStatement is required',
      failedConditions: ['Missing decisionStatement']
    };
  }
  
  if (!input.decidedBy.trim()) {
    return {
      canCreate: false,
      reason: 'decidedBy is required',
      failedConditions: ['Missing decidedBy']
    };
  }
  
  return { canCreate: true };
}

// =============================================================================
// ECHO CREATION
// =============================================================================

/**
 * Generates a unique decision ID
 */
function generateDecisionId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 10);
  return `dec_${timestamp}_${random}`;
}

/**
 * Creates a context snapshot from input
 */
function createContextSnapshot(input: DecisionEchoInput): DecisionContextSnapshot {
  const constraints: OperationalConstraintsSnapshot = {
    timeConstraints: input.constraints?.timeConstraints 
      ? [...input.constraints.timeConstraints] 
      : [],
    resourceConstraints: input.constraints?.resourceConstraints 
      ? [...input.constraints.resourceConstraints] 
      : [],
    regulatoryConstraints: input.constraints?.regulatoryConstraints 
      ? [...input.constraints.regulatoryConstraints] 
      : [],
    technicalConstraints: input.constraints?.technicalConstraints 
      ? [...input.constraints.technicalConstraints] 
      : [],
    declaredConstraints: input.constraints?.declaredConstraints 
      ? [...input.constraints.declaredConstraints] 
      : []
  };
  
  return {
    contextType: input.currentContext.contextType,
    workingMode: input.currentContext.workingMode,
    constraints,
    activeSphere: input.currentContext.activeSphere,
    activeProject: input.currentContext.activeProject,
    sessionId: input.currentContext.sessionId,
    contextTags: input.currentContext.contextTags 
      ? [...input.currentContext.contextTags] 
      : []
  };
}

/**
 * Creates a Decision Echo from validated input
 * Only call after validation passes
 */
export function createDecisionEcho(input: DecisionEchoInput): DecisionEcho {
  const validation = validateEchoInput(input);
  if (!validation.canCreate) {
    throw new Error(`Cannot create echo: ${validation.reason}`);
  }
  
  const echo: DecisionEcho = {
    decisionId: generateDecisionId(),
    timestamp: new Date().toISOString(),
    scope: input.scope,
    declaredObjective: input.declaredObjective.trim(),
    contextSnapshot: createContextSnapshot(input),
    decisionStatement: input.decisionStatement.trim(),
    reversibility: input.reversibility,
    confirmationMethod: input.confirmationMethod,
    decidedBy: input.decidedBy.trim(),
    domain: input.domain?.trim(),
    references: input.references ? [...input.references] : undefined
  };
  
  // Freeze the echo to ensure immutability
  return Object.freeze(echo);
}

// =============================================================================
// IN-MEMORY STORAGE (Reference Implementation)
// =============================================================================

/**
 * In-memory storage implementation
 * Append-only, no updates, no deletes
 */
export class InMemoryDecisionEchoStorage implements DecisionEchoStorage {
  private readonly echoes: Map<string, DecisionEcho> = new Map();
  private readonly chronologicalOrder: string[] = [];
  private readonly auditLog: DecisionEchoAuditRecord[] = [];
  
  /**
   * Store a new echo (append-only)
   * Once stored, cannot be modified or deleted
   */
  async store(echo: DecisionEcho): Promise<void> {
    if (this.echoes.has(echo.decisionId)) {
      throw new Error(`Echo ${echo.decisionId} already exists - echoes are immutable`);
    }
    
    // Store frozen copy
    const frozenEcho = Object.freeze({ ...echo });
    this.echoes.set(echo.decisionId, frozenEcho);
    this.chronologicalOrder.push(echo.decisionId);
    
    // Audit log
    this.auditLog.push({
      event: {
        type: 'ECHO_CREATED',
        echo: frozenEcho,
        timestamp: new Date().toISOString()
      },
      recordedAt: new Date().toISOString(),
      source: 'decision-echo-system'
    });
  }
  
  /**
   * Retrieve an echo by ID (read-only)
   */
  async retrieve(decisionId: string): Promise<DecisionEcho | null> {
    const echo = this.echoes.get(decisionId);
    if (!echo) return null;
    
    // Audit log
    this.auditLog.push({
      event: {
        type: 'ECHO_VIEWED',
        echoId: decisionId,
        viewedBy: 'system',
        timestamp: new Date().toISOString()
      },
      recordedAt: new Date().toISOString(),
      source: 'decision-echo-system'
    });
    
    return echo;
  }
  
  /**
   * Query echoes (read-only, chronologically ordered)
   */
  async query(query: DecisionEchoQuery): Promise<DecisionEchoQueryResult> {
    // Get all echoes in chronological order
    let results: DecisionEcho[] = this.chronologicalOrder
      .map(id => this.echoes.get(id)!)
      .filter(Boolean);
    
    // Apply filters
    if (query.scope) {
      results = results.filter(e => e.scope === query.scope);
    }
    
    if (query.fromTimestamp) {
      const fromDate = new Date(query.fromTimestamp);
      results = results.filter(e => new Date(e.timestamp) >= fromDate);
    }
    
    if (query.toTimestamp) {
      const toDate = new Date(query.toTimestamp);
      results = results.filter(e => new Date(e.timestamp) <= toDate);
    }
    
    if (query.decidedBy) {
      results = results.filter(e => e.decidedBy === query.decidedBy);
    }
    
    if (query.domain) {
      results = results.filter(e => e.domain === query.domain);
    }
    
    if (query.sphere) {
      results = results.filter(e => e.contextSnapshot.activeSphere === query.sphere);
    }
    
    if (query.project) {
      results = results.filter(e => e.contextSnapshot.activeProject === query.project);
    }
    
    if (query.sessionId) {
      results = results.filter(e => e.contextSnapshot.sessionId === query.sessionId);
    }
    
    const totalCount = results.length;
    
    // Apply pagination
    const offset = query.offset || 0;
    const limit = query.limit || 50;
    const paginatedResults = results.slice(offset, offset + limit);
    
    // Audit log
    this.auditLog.push({
      event: {
        type: 'ECHO_QUERIED',
        query,
        resultCount: paginatedResults.length,
        timestamp: new Date().toISOString()
      },
      recordedAt: new Date().toISOString(),
      source: 'decision-echo-system'
    });
    
    return {
      echoes: paginatedResults,
      totalCount,
      hasMore: offset + limit < totalCount,
      query,
      queriedAt: new Date().toISOString()
    };
  }
  
  /**
   * Count echoes matching criteria
   */
  async count(query: Omit<DecisionEchoQuery, 'limit' | 'offset'>): Promise<number> {
    const result = await this.query({ ...query, limit: Number.MAX_SAFE_INTEGER });
    return result.totalCount;
  }
  
  /**
   * Check if echo exists
   */
  async exists(decisionId: string): Promise<boolean> {
    return this.echoes.has(decisionId);
  }
  
  /**
   * Get audit log (read-only)
   */
  getAuditLog(): ReadonlyArray<DecisionEchoAuditRecord> {
    return [...this.auditLog];
  }
}

// =============================================================================
// DECISION ECHO SERVICE
// =============================================================================

/**
 * Decision Echo Service
 * Main interface for the Decision Echo system
 * 
 * Provides:
 * - Echo creation (with validation)
 * - Echo retrieval (read-only)
 * - Query interface (chronological only)
 * 
 * Does NOT provide:
 * - Editing
 * - Deletion
 * - Ranking
 * - Recommendations
 */
export class DecisionEchoService {
  private readonly storage: DecisionEchoStorage;
  
  constructor(storage?: DecisionEchoStorage) {
    this.storage = storage || new InMemoryDecisionEchoStorage();
  }
  
  /**
   * Get system info
   */
  getSystemInfo() {
    return {
      status: 'OBSERVATIONAL DECISION MEMORY' as const,
      authority: 'NONE' as const,
      intent: 'TRANSPARENCY WITHOUT INFLUENCE' as const,
      version: '1.0.0',
      failsafes: DECISION_ECHO_FAILSAFES,
      displayRules: DEFAULT_ECHO_DISPLAY_RULES,
      declaration: DECISION_ECHO_DECLARATION
    };
  }
  
  /**
   * Validate input before creation
   */
  validateInput(input: DecisionEchoInput): EchoCreationValidationResult {
    return validateEchoInput(input);
  }
  
  /**
   * Check language safety
   */
  checkLanguage(text: string): LanguageValidationResult {
    return validateEchoLanguage(text);
  }
  
  /**
   * Create and store a decision echo
   * Validates input, creates frozen echo, stores immutably
   */
  async createEcho(input: DecisionEchoInput): Promise<DecisionEcho> {
    const validation = this.validateInput(input);
    if (!validation.canCreate) {
      throw new Error(`Echo creation failed: ${validation.reason}`);
    }
    
    const echo = createDecisionEcho(input);
    await this.storage.store(echo);
    return echo;
  }
  
  /**
   * Retrieve a single echo by ID
   */
  async getEcho(decisionId: string): Promise<DecisionEcho | null> {
    return this.storage.retrieve(decisionId);
  }
  
  /**
   * Query echoes (always chronological, never ranked)
   */
  async queryEchoes(query: DecisionEchoQuery): Promise<DecisionEchoQueryResult> {
    return this.storage.query(query);
  }
  
  /**
   * Get echoes by scope
   */
  async getByScope(scope: DecisionScope): Promise<ReadonlyArray<DecisionEcho>> {
    const result = await this.storage.query({ scope });
    return result.echoes;
  }
  
  /**
   * Get echoes in date range
   */
  async getByDateRange(
    from: string | Date, 
    to: string | Date
  ): Promise<ReadonlyArray<DecisionEcho>> {
    const result = await this.storage.query({
      fromTimestamp: from instanceof Date ? from.toISOString() : from,
      toTimestamp: to instanceof Date ? to.toISOString() : to
    });
    return result.echoes;
  }
  
  /**
   * Get echoes by person
   */
  async getByDecider(decidedBy: string): Promise<ReadonlyArray<DecisionEcho>> {
    const result = await this.storage.query({ decidedBy });
    return result.echoes;
  }
  
  /**
   * Get echoes for current session
   */
  async getForSession(sessionId: string): Promise<ReadonlyArray<DecisionEcho>> {
    const result = await this.storage.query({ sessionId });
    return result.echoes;
  }
  
  /**
   * Count total echoes
   */
  async countAll(): Promise<number> {
    return this.storage.count({});
  }
  
  /**
   * Check if echo exists
   */
  async echoExists(decisionId: string): Promise<boolean> {
    return this.storage.exists(decisionId);
  }
  
  // =========================================================================
  // FAILSAFE ENFORCEMENT - These methods intentionally throw
  // =========================================================================
  
  /**
   * BLOCKED: Echoes cannot be edited
   */
  async updateEcho(_decisionId: string, _updates: unknown): Promise<never> {
    throw new Error(
      'FAILSAFE VIOLATION: Decision Echoes cannot be edited. ' +
      'Echoes are immutable records of past decisions.'
    );
  }
  
  /**
   * BLOCKED: Echoes cannot be deleted
   */
  async deleteEcho(_decisionId: string): Promise<never> {
    throw new Error(
      'FAILSAFE VIOLATION: Decision Echoes cannot be deleted. ' +
      'Echoes are permanent records.'
    );
  }
  
  /**
   * BLOCKED: Echoes cannot be ranked
   */
  async rankEchoes(_criteria: unknown): Promise<never> {
    throw new Error(
      'FAILSAFE VIOLATION: Decision Echoes cannot be ranked. ' +
      'Echoes are displayed chronologically only.'
    );
  }
  
  /**
   * BLOCKED: Echoes cannot be auto-summarized
   */
  async summarizeEchoes(_echoIds: string[]): Promise<never> {
    throw new Error(
      'FAILSAFE VIOLATION: Decision Echoes cannot be automatically summarized. ' +
      'Each echo must be viewed individually.'
    );
  }
  
  /**
   * BLOCKED: Echoes cannot recommend
   */
  async getRecommendations(_context: unknown): Promise<never> {
    throw new Error(
      'FAILSAFE VIOLATION: Decision Echo system cannot provide recommendations. ' +
      'It answers only: "What decision was made, and in what context?"'
    );
  }
  
  /**
   * BLOCKED: Echoes cannot trigger workflows
   */
  async triggerWorkflow(_echoId: string, _workflow: unknown): Promise<never> {
    throw new Error(
      'FAILSAFE VIOLATION: Decision Echoes cannot trigger workflows. ' +
      'Echoes are observational only.'
    );
  }
}

// =============================================================================
// FACTORY
// =============================================================================

/**
 * Create a new Decision Echo Service
 */
export function createDecisionEchoService(
  storage?: DecisionEchoStorage
): DecisionEchoService {
  return new DecisionEchoService(storage);
}

/**
 * Create default creation conditions (all false - must be explicitly set)
 */
export function createDefaultCreationConditions(): EchoCreationConditions {
  return {
    humanValidated: false,
    inDecisionContext: false,
    confirmationRecorded: false
  };
}

/**
 * Create default prevention conditions (all false - must be explicitly set)
 */
export function createDefaultPreventionConditions(): EchoPreventionConditions {
  return {
    isExploration: false,
    isComparison: false,
    isSuggestion: false,
    isDraft: false,
    isSimulation: false
  };
}

// =============================================================================
// EXPORTS
// =============================================================================

export {
  ALLOWED_ECHO_LANGUAGE,
  FORBIDDEN_ECHO_LANGUAGE,
  DECISION_ECHO_FAILSAFES,
  DEFAULT_ECHO_DISPLAY_RULES,
  DECISION_ECHO_DECLARATION
};
