/**
 * CHE·NU — DECISION ECHO TESTS
 * 
 * Tests verify:
 * - Language validation (forbidden terms blocked)
 * - Creation condition validation
 * - Echo immutability
 * - Failsafe enforcement
 * - Read-only operations
 */

import {
  DecisionScope,
  DecisionReversibility,
  ConfirmationMethod,
  DecisionContextType,
  DecisionWorkingMode,
  DecisionEchoInput,
  EchoCreationConditions,
  EchoPreventionConditions,
  FORBIDDEN_ECHO_LANGUAGE,
  ALLOWED_ECHO_LANGUAGE,
  DECISION_ECHO_FAILSAFES
} from './decisionEcho.types';

import {
  validateEchoLanguage,
  checkTextForForbiddenTerms,
  validateCreationConditions,
  validateEchoInput,
  createDecisionEcho,
  DecisionEchoService,
  InMemoryDecisionEchoStorage,
  createDefaultCreationConditions,
  createDefaultPreventionConditions
} from './decisionEchoEngine';

// =============================================================================
// TEST UTILITIES
// =============================================================================

/**
 * Create valid input for testing
 */
function createValidInput(): DecisionEchoInput {
  return {
    scope: DecisionScope.PROJECT,
    declaredObjective: 'Complete the foundation design',
    decisionStatement: 'Selected concrete mix type A for foundation',
    reversibility: DecisionReversibility.PARTIAL,
    confirmationMethod: ConfirmationMethod.EXPLICIT,
    decidedBy: 'user-123',
    currentContext: {
      contextType: DecisionContextType.PLANNING,
      workingMode: DecisionWorkingMode.COLLABORATIVE,
      activeSphere: 'construction',
      activeProject: 'project-456',
      sessionId: 'session-789',
      contextTags: ['foundation', 'materials']
    },
    constraints: {
      timeConstraints: ['Deadline: 2024-03-01'],
      resourceConstraints: ['Budget limit: $50,000'],
      regulatoryConstraints: ['RBQ compliance required'],
      technicalConstraints: [],
      declaredConstraints: []
    },
    domain: 'construction-materials',
    references: ['spec-001', 'quote-002'],
    creationConditions: {
      humanValidated: true,
      inDecisionContext: true,
      confirmationRecorded: true
    },
    preventionConditions: {
      isExploration: false,
      isComparison: false,
      isSuggestion: false,
      isDraft: false,
      isSimulation: false
    }
  };
}

// =============================================================================
// LANGUAGE VALIDATION TESTS
// =============================================================================

describe('Decision Echo Language Validation', () => {
  
  describe('validateEchoLanguage', () => {
    
    it('should accept text with allowed language', () => {
      const allowedTexts = [
        'Decided to use material A',
        'Confirmed the schedule',
        'Recorded at 2024-01-15',
        'Selected option B',
        'Documented the choice'
      ];
      
      for (const text of allowedTexts) {
        const result = validateEchoLanguage(text);
        expect(result.isValid).toBe(true);
        expect(result.forbiddenTermsFound).toHaveLength(0);
      }
    });
    
    it('should reject text with forbidden language', () => {
      const forbiddenTexts = [
        { text: 'This led to better results', term: 'led to' },
        { text: 'The decision caused improvements', term: 'caused' },
        { text: 'This resulted in success', term: 'resulted in' },
        { text: 'Choice influenced outcomes', term: 'influenced' },
        { text: 'This was successful', term: 'successful' },
        { text: 'Should have chosen differently', term: 'should' },
        { text: 'This was better than alternative', term: 'better' }
      ];
      
      for (const { text, term } of forbiddenTexts) {
        const result = validateEchoLanguage(text);
        expect(result.isValid).toBe(false);
        expect(result.forbiddenTermsFound).toContain(term);
      }
    });
    
    it('should detect multiple forbidden terms', () => {
      const text = 'This decision led to better results and caused improvements';
      const result = validateEchoLanguage(text);
      
      expect(result.isValid).toBe(false);
      expect(result.forbiddenTermsFound).toContain('led to');
      expect(result.forbiddenTermsFound).toContain('better');
      expect(result.forbiddenTermsFound).toContain('caused');
    });
    
    it('should be case-insensitive', () => {
      const result = validateEchoLanguage('This LED TO something');
      expect(result.isValid).toBe(false);
      expect(result.forbiddenTermsFound).toContain('led to');
    });
  });
  
  describe('checkTextForForbiddenTerms', () => {
    
    it('should provide suggestions for forbidden terms', () => {
      const result = checkTextForForbiddenTerms('This decision caused better results');
      
      expect(result.hasForbiddenTerms).toBe(true);
      expect(result.terms).toContain('caused');
      expect(result.terms).toContain('better');
      expect(result.suggestion).toContain('Please rephrase');
    });
    
    it('should pass clean text without suggestions', () => {
      const result = checkTextForForbiddenTerms('Decided to proceed with option A');
      
      expect(result.hasForbiddenTerms).toBe(false);
      expect(result.terms).toHaveLength(0);
      expect(result.suggestion).toBe('Decided to proceed with option A');
    });
  });
  
  describe('Language constants', () => {
    
    it('should have allowed language terms defined', () => {
      expect(ALLOWED_ECHO_LANGUAGE.length).toBeGreaterThan(0);
      expect(ALLOWED_ECHO_LANGUAGE).toContain('decided');
      expect(ALLOWED_ECHO_LANGUAGE).toContain('confirmed');
      expect(ALLOWED_ECHO_LANGUAGE).toContain('recorded');
    });
    
    it('should have forbidden language terms defined', () => {
      expect(FORBIDDEN_ECHO_LANGUAGE.length).toBeGreaterThan(0);
      expect(FORBIDDEN_ECHO_LANGUAGE).toContain('led to');
      expect(FORBIDDEN_ECHO_LANGUAGE).toContain('caused');
      expect(FORBIDDEN_ECHO_LANGUAGE).toContain('resulted in');
    });
  });
});

// =============================================================================
// CREATION VALIDATION TESTS
// =============================================================================

describe('Decision Echo Creation Validation', () => {
  
  describe('validateCreationConditions', () => {
    
    it('should pass when all conditions are met', () => {
      const conditions: EchoCreationConditions = {
        humanValidated: true,
        inDecisionContext: true,
        confirmationRecorded: true
      };
      const prevention: EchoPreventionConditions = {
        isExploration: false,
        isComparison: false,
        isSuggestion: false,
        isDraft: false,
        isSimulation: false
      };
      
      const result = validateCreationConditions(conditions, prevention);
      expect(result.canCreate).toBe(true);
    });
    
    it('should fail when human validation is missing', () => {
      const conditions: EchoCreationConditions = {
        humanValidated: false,
        inDecisionContext: true,
        confirmationRecorded: true
      };
      const prevention = createDefaultPreventionConditions();
      
      const result = validateCreationConditions(conditions, prevention);
      expect(result.canCreate).toBe(false);
      expect(result.failedConditions).toContain('Human validation required');
    });
    
    it('should fail when not in decision context', () => {
      const conditions: EchoCreationConditions = {
        humanValidated: true,
        inDecisionContext: false,
        confirmationRecorded: true
      };
      const prevention = createDefaultPreventionConditions();
      
      const result = validateCreationConditions(conditions, prevention);
      expect(result.canCreate).toBe(false);
      expect(result.failedConditions).toContain('Must be in decision context');
    });
    
    it('should fail when this is an exploration', () => {
      const conditions: EchoCreationConditions = {
        humanValidated: true,
        inDecisionContext: true,
        confirmationRecorded: true
      };
      const prevention: EchoPreventionConditions = {
        isExploration: true,
        isComparison: false,
        isSuggestion: false,
        isDraft: false,
        isSimulation: false
      };
      
      const result = validateCreationConditions(conditions, prevention);
      expect(result.canCreate).toBe(false);
      expect(result.failedConditions).toContain('Cannot create echo for exploration');
    });
    
    it('should fail when this is a draft', () => {
      const conditions: EchoCreationConditions = {
        humanValidated: true,
        inDecisionContext: true,
        confirmationRecorded: true
      };
      const prevention: EchoPreventionConditions = {
        isExploration: false,
        isComparison: false,
        isSuggestion: false,
        isDraft: true,
        isSimulation: false
      };
      
      const result = validateCreationConditions(conditions, prevention);
      expect(result.canCreate).toBe(false);
      expect(result.failedConditions).toContain('Cannot create echo for draft');
    });
    
    it('should fail when this is a simulation', () => {
      const conditions: EchoCreationConditions = {
        humanValidated: true,
        inDecisionContext: true,
        confirmationRecorded: true
      };
      const prevention: EchoPreventionConditions = {
        isExploration: false,
        isComparison: false,
        isSuggestion: false,
        isDraft: false,
        isSimulation: true
      };
      
      const result = validateCreationConditions(conditions, prevention);
      expect(result.canCreate).toBe(false);
      expect(result.failedConditions).toContain('Cannot create echo for simulation');
    });
    
    it('should report all failed conditions', () => {
      const conditions: EchoCreationConditions = {
        humanValidated: false,
        inDecisionContext: false,
        confirmationRecorded: false
      };
      const prevention: EchoPreventionConditions = {
        isExploration: true,
        isComparison: true,
        isSuggestion: false,
        isDraft: false,
        isSimulation: false
      };
      
      const result = validateCreationConditions(conditions, prevention);
      expect(result.canCreate).toBe(false);
      expect(result.failedConditions?.length).toBeGreaterThan(3);
    });
  });
  
  describe('validateEchoInput', () => {
    
    it('should pass valid input', () => {
      const input = createValidInput();
      const result = validateEchoInput(input);
      expect(result.canCreate).toBe(true);
    });
    
    it('should fail with forbidden language in objective', () => {
      const input = createValidInput();
      input.declaredObjective = 'This led to better outcomes';
      
      const result = validateEchoInput(input);
      expect(result.canCreate).toBe(false);
      expect(result.reason).toContain('Forbidden language');
    });
    
    it('should fail with forbidden language in statement', () => {
      const input = createValidInput();
      input.decisionStatement = 'Choice that resulted in success';
      
      const result = validateEchoInput(input);
      expect(result.canCreate).toBe(false);
      expect(result.reason).toContain('Forbidden language');
    });
    
    it('should fail with empty objective', () => {
      const input = createValidInput();
      input.declaredObjective = '   ';
      
      const result = validateEchoInput(input);
      expect(result.canCreate).toBe(false);
      expect(result.reason).toContain('declaredObjective is required');
    });
    
    it('should fail with empty statement', () => {
      const input = createValidInput();
      input.decisionStatement = '';
      
      const result = validateEchoInput(input);
      expect(result.canCreate).toBe(false);
      expect(result.reason).toContain('decisionStatement is required');
    });
    
    it('should fail with empty decidedBy', () => {
      const input = createValidInput();
      input.decidedBy = '';
      
      const result = validateEchoInput(input);
      expect(result.canCreate).toBe(false);
      expect(result.reason).toContain('decidedBy is required');
    });
  });
});

// =============================================================================
// ECHO CREATION TESTS
// =============================================================================

describe('Decision Echo Creation', () => {
  
  describe('createDecisionEcho', () => {
    
    it('should create echo with valid input', () => {
      const input = createValidInput();
      const echo = createDecisionEcho(input);
      
      expect(echo.decisionId).toBeDefined();
      expect(echo.decisionId).toMatch(/^dec_/);
      expect(echo.timestamp).toBeDefined();
      expect(echo.scope).toBe(DecisionScope.PROJECT);
      expect(echo.declaredObjective).toBe('Complete the foundation design');
      expect(echo.decisionStatement).toBe('Selected concrete mix type A for foundation');
      expect(echo.reversibility).toBe(DecisionReversibility.PARTIAL);
      expect(echo.confirmationMethod).toBe(ConfirmationMethod.EXPLICIT);
      expect(echo.decidedBy).toBe('user-123');
    });
    
    it('should create frozen (immutable) echo', () => {
      const input = createValidInput();
      const echo = createDecisionEcho(input);
      
      expect(Object.isFrozen(echo)).toBe(true);
      
      // Attempting to modify should fail silently or throw
      expect(() => {
        (echo as any).decisionStatement = 'Modified';
      }).toThrow();
    });
    
    it('should throw with invalid input', () => {
      const input = createValidInput();
      input.creationConditions.humanValidated = false;
      
      expect(() => {
        createDecisionEcho(input);
      }).toThrow('Cannot create echo');
    });
    
    it('should include context snapshot', () => {
      const input = createValidInput();
      const echo = createDecisionEcho(input);
      
      expect(echo.contextSnapshot.contextType).toBe(DecisionContextType.PLANNING);
      expect(echo.contextSnapshot.workingMode).toBe(DecisionWorkingMode.COLLABORATIVE);
      expect(echo.contextSnapshot.activeSphere).toBe('construction');
      expect(echo.contextSnapshot.activeProject).toBe('project-456');
      expect(echo.contextSnapshot.sessionId).toBe('session-789');
    });
    
    it('should include constraints', () => {
      const input = createValidInput();
      const echo = createDecisionEcho(input);
      
      expect(echo.contextSnapshot.constraints.timeConstraints).toContain('Deadline: 2024-03-01');
      expect(echo.contextSnapshot.constraints.resourceConstraints).toContain('Budget limit: $50,000');
      expect(echo.contextSnapshot.constraints.regulatoryConstraints).toContain('RBQ compliance required');
    });
  });
});

// =============================================================================
// STORAGE TESTS
// =============================================================================

describe('Decision Echo Storage', () => {
  
  let storage: InMemoryDecisionEchoStorage;
  
  beforeEach(() => {
    storage = new InMemoryDecisionEchoStorage();
  });
  
  describe('store', () => {
    
    it('should store echo', async () => {
      const echo = createDecisionEcho(createValidInput());
      await storage.store(echo);
      
      const exists = await storage.exists(echo.decisionId);
      expect(exists).toBe(true);
    });
    
    it('should reject duplicate storage (immutability)', async () => {
      const echo = createDecisionEcho(createValidInput());
      await storage.store(echo);
      
      await expect(storage.store(echo)).rejects.toThrow('already exists');
    });
  });
  
  describe('retrieve', () => {
    
    it('should retrieve stored echo', async () => {
      const echo = createDecisionEcho(createValidInput());
      await storage.store(echo);
      
      const retrieved = await storage.retrieve(echo.decisionId);
      expect(retrieved).not.toBeNull();
      expect(retrieved?.decisionId).toBe(echo.decisionId);
      expect(retrieved?.decisionStatement).toBe(echo.decisionStatement);
    });
    
    it('should return null for non-existent echo', async () => {
      const retrieved = await storage.retrieve('non-existent');
      expect(retrieved).toBeNull();
    });
  });
  
  describe('query', () => {
    
    it('should return echoes in chronological order', async () => {
      // Create and store multiple echoes
      const input1 = createValidInput();
      input1.decisionStatement = 'First decision';
      const echo1 = createDecisionEcho(input1);
      
      const input2 = createValidInput();
      input2.decisionStatement = 'Second decision';
      const echo2 = createDecisionEcho(input2);
      
      await storage.store(echo1);
      await storage.store(echo2);
      
      const result = await storage.query({});
      expect(result.echoes.length).toBe(2);
      expect(result.echoes[0].decisionId).toBe(echo1.decisionId);
      expect(result.echoes[1].decisionId).toBe(echo2.decisionId);
    });
    
    it('should filter by scope', async () => {
      const input1 = createValidInput();
      input1.scope = DecisionScope.PROJECT;
      
      const input2 = createValidInput();
      input2.scope = DecisionScope.SESSION;
      
      await storage.store(createDecisionEcho(input1));
      await storage.store(createDecisionEcho(input2));
      
      const result = await storage.query({ scope: DecisionScope.PROJECT });
      expect(result.echoes.length).toBe(1);
      expect(result.echoes[0].scope).toBe(DecisionScope.PROJECT);
    });
    
    it('should filter by decidedBy', async () => {
      const input1 = createValidInput();
      input1.decidedBy = 'user-A';
      
      const input2 = createValidInput();
      input2.decidedBy = 'user-B';
      
      await storage.store(createDecisionEcho(input1));
      await storage.store(createDecisionEcho(input2));
      
      const result = await storage.query({ decidedBy: 'user-A' });
      expect(result.echoes.length).toBe(1);
      expect(result.echoes[0].decidedBy).toBe('user-A');
    });
    
    it('should support pagination', async () => {
      // Store 5 echoes
      for (let i = 0; i < 5; i++) {
        const input = createValidInput();
        input.decisionStatement = `Decision ${i}`;
        await storage.store(createDecisionEcho(input));
      }
      
      const page1 = await storage.query({ limit: 2, offset: 0 });
      expect(page1.echoes.length).toBe(2);
      expect(page1.totalCount).toBe(5);
      expect(page1.hasMore).toBe(true);
      
      const page2 = await storage.query({ limit: 2, offset: 2 });
      expect(page2.echoes.length).toBe(2);
      expect(page2.hasMore).toBe(true);
      
      const page3 = await storage.query({ limit: 2, offset: 4 });
      expect(page3.echoes.length).toBe(1);
      expect(page3.hasMore).toBe(false);
    });
  });
  
  describe('audit log', () => {
    
    it('should record echo creation', async () => {
      const echo = createDecisionEcho(createValidInput());
      await storage.store(echo);
      
      const auditLog = storage.getAuditLog();
      expect(auditLog.length).toBeGreaterThan(0);
      expect(auditLog.some(r => r.event.type === 'ECHO_CREATED')).toBe(true);
    });
    
    it('should record echo queries', async () => {
      await storage.query({});
      
      const auditLog = storage.getAuditLog();
      expect(auditLog.some(r => r.event.type === 'ECHO_QUERIED')).toBe(true);
    });
  });
});

// =============================================================================
// SERVICE TESTS
// =============================================================================

describe('Decision Echo Service', () => {
  
  let service: DecisionEchoService;
  
  beforeEach(() => {
    service = new DecisionEchoService();
  });
  
  describe('getSystemInfo', () => {
    
    it('should return correct system info', () => {
      const info = service.getSystemInfo();
      
      expect(info.status).toBe('OBSERVATIONAL DECISION MEMORY');
      expect(info.authority).toBe('NONE');
      expect(info.intent).toBe('TRANSPARENCY WITHOUT INFLUENCE');
      expect(info.failsafes).toBeDefined();
      expect(info.displayRules).toBeDefined();
      expect(info.declaration).toBeDefined();
    });
  });
  
  describe('createEcho', () => {
    
    it('should create and store echo', async () => {
      const input = createValidInput();
      const echo = await service.createEcho(input);
      
      expect(echo.decisionId).toBeDefined();
      
      const retrieved = await service.getEcho(echo.decisionId);
      expect(retrieved).not.toBeNull();
    });
    
    it('should throw on invalid input', async () => {
      const input = createValidInput();
      input.creationConditions.humanValidated = false;
      
      await expect(service.createEcho(input)).rejects.toThrow();
    });
  });
  
  describe('query methods', () => {
    
    beforeEach(async () => {
      // Create some test echoes
      const input1 = createValidInput();
      input1.scope = DecisionScope.PROJECT;
      input1.decidedBy = 'user-A';
      
      const input2 = createValidInput();
      input2.scope = DecisionScope.SESSION;
      input2.decidedBy = 'user-B';
      
      await service.createEcho(input1);
      await service.createEcho(input2);
    });
    
    it('should get by scope', async () => {
      const echoes = await service.getByScope(DecisionScope.PROJECT);
      expect(echoes.length).toBe(1);
    });
    
    it('should get by decider', async () => {
      const echoes = await service.getByDecider('user-A');
      expect(echoes.length).toBe(1);
    });
    
    it('should count all', async () => {
      const count = await service.countAll();
      expect(count).toBe(2);
    });
  });
  
  describe('failsafe enforcement', () => {
    
    it('should block updateEcho', async () => {
      await expect(
        service.updateEcho('any-id', { decisionStatement: 'Modified' })
      ).rejects.toThrow('FAILSAFE VIOLATION');
    });
    
    it('should block deleteEcho', async () => {
      await expect(
        service.deleteEcho('any-id')
      ).rejects.toThrow('FAILSAFE VIOLATION');
    });
    
    it('should block rankEchoes', async () => {
      await expect(
        service.rankEchoes({ criteria: 'relevance' })
      ).rejects.toThrow('FAILSAFE VIOLATION');
    });
    
    it('should block summarizeEchoes', async () => {
      await expect(
        service.summarizeEchoes(['id-1', 'id-2'])
      ).rejects.toThrow('FAILSAFE VIOLATION');
    });
    
    it('should block getRecommendations', async () => {
      await expect(
        service.getRecommendations({ context: 'any' })
      ).rejects.toThrow('FAILSAFE VIOLATION');
    });
    
    it('should block triggerWorkflow', async () => {
      await expect(
        service.triggerWorkflow('echo-id', { workflow: 'any' })
      ).rejects.toThrow('FAILSAFE VIOLATION');
    });
  });
});

// =============================================================================
// FAILSAFE CONSTANT TESTS
// =============================================================================

describe('Decision Echo Failsafes', () => {
  
  it('should have all failsafes set to true', () => {
    expect(DECISION_ECHO_FAILSAFES.cannotTriggerWorkflows).toBe(true);
    expect(DECISION_ECHO_FAILSAFES.cannotBeEdited).toBe(true);
    expect(DECISION_ECHO_FAILSAFES.cannotBeRanked).toBe(true);
    expect(DECISION_ECHO_FAILSAFES.cannotBeAutoSummarized).toBe(true);
    expect(DECISION_ECHO_FAILSAFES.cannotConnectToOrchestrator).toBe(true);
    expect(DECISION_ECHO_FAILSAFES.cannotConnectToAgents).toBe(true);
    expect(DECISION_ECHO_FAILSAFES.cannotFeedPreferenceLearning).toBe(true);
    expect(DECISION_ECHO_FAILSAFES.cannotSuggestContext).toBe(true);
    expect(DECISION_ECHO_FAILSAFES.cannotTriggerExecution).toBe(true);
  });
  
  it('should be frozen (immutable)', () => {
    expect(Object.isFrozen(DECISION_ECHO_FAILSAFES)).toBe(true);
  });
});

// =============================================================================
// HELPER FUNCTION TESTS
// =============================================================================

describe('Helper Functions', () => {
  
  describe('createDefaultCreationConditions', () => {
    
    it('should return all false conditions', () => {
      const conditions = createDefaultCreationConditions();
      
      expect(conditions.humanValidated).toBe(false);
      expect(conditions.inDecisionContext).toBe(false);
      expect(conditions.confirmationRecorded).toBe(false);
    });
  });
  
  describe('createDefaultPreventionConditions', () => {
    
    it('should return all false conditions', () => {
      const conditions = createDefaultPreventionConditions();
      
      expect(conditions.isExploration).toBe(false);
      expect(conditions.isComparison).toBe(false);
      expect(conditions.isSuggestion).toBe(false);
      expect(conditions.isDraft).toBe(false);
      expect(conditions.isSimulation).toBe(false);
    });
  });
});
