/* =====================================================
   CHE·NU — AGENT SYSTEM TESTS
   ===================================================== */

import { describe, it, expect, beforeEach } from 'vitest';

import {
  // Internal Agent Context
  buildAgentContextAdaptation,
  formatAgentContext,
  validateAgentContext,
  validateAgentConfirmation,
  AGENT_FORBIDDEN_ACTIONS,
  AGENT_CONFIRMATION,
  getAgentPreset,
} from './internalAgentContext';

import {
  // Context Interpreter
  ContextInterpreterAgent,
  contextInterpreter,
  detectIntentPatterns,
  detectRisks,
  detectAmbiguities,
  detectConflicts,
  formatInterpretationResult,
} from './contextInterpreterAgent';

import {
  // Orchestrator
  AgentOrchestrator,
  getOrchestrator,
  resetOrchestrator,
  formatRoutingDecision,
  BUILT_IN_AGENTS,
} from './agentOrchestrator';

import {
  // Specialized Agents
  ObserverAgent,
  AnalystAgent,
  DocumenterAgent,
  MemoryRecallAgent,
  MethodologyAdvisorAgent,
  createSpecializedAgent,
} from './specializedAgents';

/* =========================================================
   INTERNAL AGENT CONTEXT TESTS
   ========================================================= */

describe('InternalAgentContext', () => {
  describe('buildAgentContextAdaptation', () => {
    it('should create valid context with required fields', () => {
      const context = buildAgentContextAdaptation({
        agent: {
          agentId: 'test-001',
          category: 'analyst',
        },
        context: {
          contextType: 'exploration',
        },
        primaryObjective: 'Analyze test data',
        workingMode: 'analysis-heavy',
      });

      expect(context.agent.agentId).toBe('test-001');
      expect(context.agent.authority).toBe('NONE');
      expect(context.context.contextType).toBe('exploration');
      expect(context.workingMode.primary).toBe('analysis-heavy');
    });

    it('should always set authority to NONE', () => {
      const context = buildAgentContextAdaptation({
        agent: {
          agentId: 'test-002',
          category: 'advisor',
        },
        context: {
          contextType: 'meeting',
        },
        primaryObjective: 'Advise on strategy',
        workingMode: 'comparison-focused',
      });

      expect(context.agent.authority).toBe('NONE');
    });

    it('should include all forbidden actions', () => {
      const context = buildAgentContextAdaptation({
        agent: {
          agentId: 'test-003',
          category: 'observer',
        },
        context: {
          contextType: 'session',
        },
        primaryObjective: 'Observe session',
        workingMode: 'summarization-only',
      });

      expect(context.forbiddenActions).toEqual(expect.arrayContaining(AGENT_FORBIDDEN_ACTIONS));
    });
  });

  describe('validateAgentContext', () => {
    it('should validate correct context', () => {
      const context = buildAgentContextAdaptation({
        agent: {
          agentId: 'valid-001',
          category: 'documenter',
        },
        context: {
          contextType: 'documentation',
        },
        primaryObjective: 'Document findings',
        workingMode: 'documentation-only',
      });

      const validation = validateAgentContext(context);
      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should warn on authority language in objective', () => {
      const context = buildAgentContextAdaptation({
        agent: {
          agentId: 'warning-001',
          category: 'analyst',
        },
        context: {
          contextType: 'audit',
        },
        primaryObjective: 'Decide which approach to take',
        workingMode: 'analysis-heavy',
      });

      const validation = validateAgentContext(context);
      expect(validation.warnings.length).toBeGreaterThan(0);
      expect(validation.warnings.some(w => w.includes('decide'))).toBe(true);
    });
  });

  describe('validateAgentConfirmation', () => {
    it('should validate correct confirmation', () => {
      expect(validateAgentConfirmation(AGENT_CONFIRMATION)).toBe(true);
      expect(validateAgentConfirmation('Context acknowledged. Authority unchanged.')).toBe(true);
    });

    it('should reject incorrect confirmation', () => {
      expect(validateAgentConfirmation('Ready to decide')).toBe(false);
      expect(validateAgentConfirmation('Authority granted')).toBe(false);
    });
  });

  describe('getAgentPreset', () => {
    it('should return observer preset', () => {
      const preset = getAgentPreset('observer');
      expect(preset.agent?.category).toBe('observer');
    });

    it('should return analyst preset', () => {
      const preset = getAgentPreset('analyst');
      expect(preset.agent?.category).toBe('analyst');
    });

    it('should throw for unknown preset', () => {
      expect(() => getAgentPreset('unknown' as any)).toThrow();
    });
  });
});

/* =========================================================
   CONTEXT INTERPRETER TESTS
   ========================================================= */

describe('ContextInterpreterAgent', () => {
  let interpreter: ContextInterpreterAgent;

  beforeEach(() => {
    interpreter = new ContextInterpreterAgent();
  });

  describe('detectIntentPatterns', () => {
    it('should detect exploration intent', () => {
      const result = detectIntentPatterns('Je veux explorer les options');
      expect(result.detected).toContain('exploration');
    });

    it('should detect decision intent', () => {
      const result = detectIntentPatterns('We need to decide on the approach');
      expect(result.detected).toContain('decision');
    });

    it('should detect comparison intent', () => {
      const result = detectIntentPatterns('Comparer les alternatives');
      expect(result.detected).toContain('comparison');
    });

    it('should detect documentation intent', () => {
      const result = detectIntentPatterns('Document the process');
      expect(result.detected).toContain('documentation');
    });

    it('should detect multiple intents', () => {
      const result = detectIntentPatterns('Explorer et comparer les options');
      expect(result.detected).toContain('exploration');
      expect(result.detected).toContain('comparison');
    });
  });

  describe('detectRisks', () => {
    it('should detect scope expansion risk for exploration', () => {
      const risks = detectRisks('exploration', {}, 'explore options');
      expect(risks.some(r => r.includes('scope'))).toBe(true);
    });

    it('should detect blocker risk', () => {
      const risks = detectRisks('project', { blockers: ['blocker1', 'blocker2'] }, 'work');
      expect(risks.some(r => r.includes('blocker'))).toBe(true);
    });

    it('should detect technical debt risk', () => {
      const risks = detectRisks('project', {
        technicalDebt: ['debt1', 'debt2', 'debt3', 'debt4'],
      }, 'work');
      expect(risks.some(r => r.includes('technical debt'))).toBe(true);
    });
  });

  describe('detectConflicts', () => {
    it('should detect authority-assuming language', () => {
      const conflicts = detectConflicts('décider automatiquement sans validation');
      expect(conflicts.length).toBeGreaterThan(0);
    });

    it('should not flag normal intent', () => {
      const conflicts = detectConflicts('explorer les options disponibles');
      expect(conflicts).toHaveLength(0);
    });
  });

  describe('interpret', () => {
    it('should generate 2-4 options', () => {
      const result = interpreter.interpret({
        userIntent: 'Je veux explorer les structures UX',
        sessionState: {},
      });

      expect(result.options.length).toBeGreaterThanOrEqual(2);
      expect(result.options.length).toBeLessThanOrEqual(4);
    });

    it('should require clarification for conflicts', () => {
      const result = interpreter.interpret({
        userIntent: 'Décider automatiquement sans validation humaine',
        sessionState: {},
      });

      expect(result.conflicts.length).toBeGreaterThan(0);
      expect(result.requiresClarification).toBe(true);
    });

    it('should include confidence scores', () => {
      const result = interpreter.interpret({
        userIntent: 'Analyser les données du projet',
        sessionState: {},
      });

      for (const option of result.options) {
        expect(option.confidence).toBeGreaterThan(0);
        expect(option.confidence).toBeLessThanOrEqual(1);
      }
    });
  });
});

/* =========================================================
   ORCHESTRATOR TESTS
   ========================================================= */

describe('AgentOrchestrator', () => {
  let orchestrator: AgentOrchestrator;

  beforeEach(() => {
    resetOrchestrator();
    orchestrator = new AgentOrchestrator('test-session');
  });

  describe('agent registration', () => {
    it('should have built-in agents', () => {
      const agents = orchestrator.getAgents();
      expect(agents.length).toBe(BUILT_IN_AGENTS.length);
    });

    it('should register new agent', () => {
      orchestrator.registerAgent({
        agentId: 'custom-001',
        displayName: 'Custom Agent',
        capabilities: ['analyze'],
        supportedContexts: ['project'],
        supportedModes: ['analysis-heavy'],
        priority: 100,
        active: true,
      });

      const agents = orchestrator.getAgents();
      expect(agents.find(a => a.agentId === 'custom-001')).toBeDefined();
    });

    it('should unregister agent', () => {
      const initialCount = orchestrator.getAgents().length;
      orchestrator.unregisterAgent('observer-001');
      expect(orchestrator.getAgents().length).toBe(initialCount - 1);
    });
  });

  describe('interpretation flow', () => {
    it('should interpret intent', () => {
      const result = orchestrator.interpretIntent({
        userIntent: 'Analyser les performances',
        sessionState: {},
      });

      expect(result.options.length).toBeGreaterThan(0);
      expect(orchestrator.getPendingInterpretation()).toBe(result);
    });

    it('should require interpretation before selection', () => {
      const result = orchestrator.selectOption('option_A', 'human-001');
      expect('error' in result).toBe(true);
    });

    it('should route after human selection', () => {
      orchestrator.interpretIntent({
        userIntent: 'Document the findings',
        sessionState: {},
      });

      const routing = orchestrator.selectOption('option_A', 'human-001');

      expect('error' in routing).toBe(false);
      if (!('error' in routing)) {
        expect(routing.approvedBy).toBe('human-001');
        expect(routing.assignedAgents.length).toBeGreaterThan(0);
        expect(routing.contextAdaptations.length).toBe(routing.assignedAgents.length);
      }
    });

    it('should clear pending interpretation after selection', () => {
      orchestrator.interpretIntent({
        userIntent: 'Visualize data',
        sessionState: {},
      });

      orchestrator.selectOption('option_A', 'human-001');

      expect(orchestrator.getPendingInterpretation()).toBeNull();
    });
  });

  describe('singleton', () => {
    it('should return same instance', () => {
      const inst1 = getOrchestrator();
      const inst2 = getOrchestrator();
      expect(inst1).toBe(inst2);
    });

    it('should create new instance with sessionId', () => {
      const inst1 = getOrchestrator('session-1');
      const inst2 = getOrchestrator('session-2');
      expect(inst1.getSessionId()).toBe('session-1');
      expect(inst2.getSessionId()).toBe('session-2');
    });
  });
});

/* =========================================================
   SPECIALIZED AGENTS TESTS
   ========================================================= */

describe('SpecializedAgents', () => {
  const createInitializedContext = () => buildAgentContextAdaptation({
    agent: {
      agentId: 'test-agent',
      category: 'analyst',
    },
    context: {
      contextType: 'exploration',
    },
    primaryObjective: 'Test objective',
    workingMode: 'analysis-heavy',
  });

  describe('ObserverAgent', () => {
    it('should process observation', async () => {
      const agent = new ObserverAgent();
      agent.initialize(createInitializedContext());

      const output = await agent.process({
        target: 'session',
      });

      expect(output.type).toBe('notes');
      expect(output.confirmation).toBe(AGENT_CONFIRMATION);
    });
  });

  describe('AnalystAgent', () => {
    it('should process analysis', async () => {
      const agent = new AnalystAgent();
      agent.initialize(createInitializedContext());

      const output = await agent.process({
        data: { metric1: 100, metric2: 200 },
        analysisType: 'pattern',
      });

      expect(output.type).toBe('pattern report');
      expect(output.confirmation).toBe(AGENT_CONFIRMATION);
    });
  });

  describe('DocumenterAgent', () => {
    it('should create documentation draft', async () => {
      const agent = new DocumenterAgent();
      agent.initialize(createInitializedContext());

      const output = await agent.process({
        subject: 'Test Subject',
        docType: 'decision',
      });

      expect(output.type).toBe('documentation draft');
      expect(output.content).toContain('DRAFT');
    });
  });

  describe('MemoryRecallAgent', () => {
    it('should recall memories', async () => {
      const agent = new MemoryRecallAgent();
      agent.initialize(createInitializedContext());

      const output = await agent.process({
        query: 'test query',
      });

      expect(output.type).toBe('structured summary');
      expect(output.content).toContain('MEMORY RECALL');
    });
  });

  describe('MethodologyAdvisorAgent', () => {
    it('should suggest methodologies', async () => {
      const agent = new MethodologyAdvisorAgent();
      agent.initialize(createInitializedContext());

      const output = await agent.process({
        problem: 'Need to improve process',
        domain: 'technical',
      });

      expect(output.type).toBe('methodology suggestion');
      expect(output.content).toContain('SUGGESTED APPROACHES');
      expect(output.content).toContain('does NOT recommend');
    });
  });

  describe('createSpecializedAgent', () => {
    it('should create observer', () => {
      const agent = createSpecializedAgent('observer');
      expect(agent).toBeInstanceOf(ObserverAgent);
    });

    it('should create analyst', () => {
      const agent = createSpecializedAgent('analyst');
      expect(agent).toBeInstanceOf(AnalystAgent);
    });

    it('should throw for unknown type', () => {
      expect(() => createSpecializedAgent('unknown' as any)).toThrow();
    });
  });

  describe('initialization validation', () => {
    it('should throw if not initialized', async () => {
      const agent = new ObserverAgent();
      await expect(agent.process({ target: 'session' })).rejects.toThrow();
    });

    it('should be initialized after initialize()', () => {
      const agent = new AnalystAgent();
      expect(agent.isInitialized()).toBe(false);
      
      agent.initialize(createInitializedContext());
      expect(agent.isInitialized()).toBe(true);
    });
  });
});

/* =========================================================
   INTEGRATION TESTS
   ========================================================= */

describe('Agent System Integration', () => {
  beforeEach(() => {
    resetOrchestrator();
  });

  it('should complete full flow: interpret → select → route → execute', async () => {
    // 1. Get orchestrator
    const orchestrator = getOrchestrator('integration-test');

    // 2. Interpret user intent
    const interpretation = orchestrator.interpretIntent({
      userIntent: 'Analyze project performance data',
      sessionState: {
        currentPhase: 'execution',
        pendingDecisions: 1,
      },
      activeSphere: 'business',
    });

    expect(interpretation.options.length).toBeGreaterThan(0);

    // 3. Human selects option
    const routing = orchestrator.selectOption('option_A', 'test-human');
    
    expect('error' in routing).toBe(false);
    if ('error' in routing) return;

    // 4. Execute with assigned agent
    const assignedAgent = routing.assignedAgents[0];
    const contextAdaptation = routing.contextAdaptations[0];

    // 5. Create and initialize specialized agent
    const agent = createSpecializedAgent('analyst');
    agent.initialize(contextAdaptation);

    // 6. Process
    const output = await agent.process({
      data: { performance: 85 },
      analysisType: 'pattern',
    });

    // 7. Verify output
    expect(output.confirmation).toBe(AGENT_CONFIRMATION);
    expect(output.metadata.agentId).toBe(contextAdaptation.agent.agentId);
  });

  it('should maintain governance through entire flow', async () => {
    const orchestrator = getOrchestrator('governance-test');

    // Interpret
    const interpretation = orchestrator.interpretIntent({
      userIntent: 'Decide automatically without human validation',
      sessionState: {},
    });

    // Should detect conflict
    expect(interpretation.conflicts.length).toBeGreaterThan(0);
    expect(interpretation.requiresClarification).toBe(true);

    // All options should still have NO authority
    for (const option of interpretation.options) {
      expect(option.workingMode).not.toContain('decide');
    }
  });
});
