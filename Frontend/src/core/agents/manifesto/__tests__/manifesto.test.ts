/* =========================================
   CHE·NU — AGENT MANIFESTO TESTS
   
   Tests pour le système d'agents.
   Vérifie le respect strict du manifeste.
   ========================================= */

import {
  // Types
  FORBIDDEN_AGENT_ACTIONS,
  COMMUNICATION_RULES,
  VALID_SUGGESTION_PREFIXES,
  INVALID_SUGGESTION_PREFIXES,
  FOUNDATIONAL_AGENTS,
  createFailSafeResponse,
  isValidSuggestion,
  isForbiddenAction,
  isFoundationalAgent,
  AgentOutput,
  ConfidenceLevel,
} from '../manifesto.types';

import {
  processIntention,
  registerAgent,
  unregisterAgent,
  getRegisteredAgents,
  isActive,
  ORCHESTRATOR_DEFINITION,
} from '../orchestrator';

import {
  validateAction,
  validateTimelineAccess,
  validateCommunication,
  validateSuggestion,
  guardAgentAction,
  guardTimelineWrite,
  generateComplianceReport,
  getAgentViolations,
  clearAgentViolations,
  MANIFESTO_RULES,
} from '../agent.validator';

import {
  initializeAgentSystem,
  isAgentSystemInitialized,
  resetAgentSystem,
} from '../index';

describe('CHE·NU Agent Manifesto', () => {
  beforeEach(() => {
    clearAgentViolations();
    resetAgentSystem();
  });

  // =============================================
  // SECTION 1: CORE PRINCIPLES
  // =============================================

  describe('Core Principles', () => {
    it('should define 3 core rules', () => {
      expect(MANIFESTO_RULES.core).toHaveLength(3);
      expect(MANIFESTO_RULES.core).toContain('Agents advise, NEVER act');
      expect(MANIFESTO_RULES.core).toContain('Orchestration over autonomy');
      expect(MANIFESTO_RULES.core).toContain('Contextual and explainable');
    });

    it('should list 6 forbidden actions', () => {
      expect(MANIFESTO_RULES.forbidden).toHaveLength(6);
    });

    it('should define all forbidden agent actions', () => {
      expect(FORBIDDEN_AGENT_ACTIONS).toContain('write_timeline');
      expect(FORBIDDEN_AGENT_ACTIONS).toContain('finalize_decision');
      expect(FORBIDDEN_AGENT_ACTIONS).toContain('trigger_irreversible');
      expect(FORBIDDEN_AGENT_ACTIONS).toContain('communicate_agent');
      expect(FORBIDDEN_AGENT_ACTIONS).toContain('access_ui');
      expect(FORBIDDEN_AGENT_ACTIONS).toContain('autonomous_action');
    });
  });

  // =============================================
  // SECTION 2: COMMUNICATION RULES
  // =============================================

  describe('Communication Rules', () => {
    it('should allow orchestrator to agent communication', () => {
      expect(COMMUNICATION_RULES.allowed).toContain('orchestrator_to_agent');
    });

    it('should allow agent to orchestrator communication', () => {
      expect(COMMUNICATION_RULES.allowed).toContain('agent_to_orchestrator');
    });

    it('should allow orchestrator to human communication', () => {
      expect(COMMUNICATION_RULES.allowed).toContain('orchestrator_to_human');
    });

    it('should forbid agent to agent communication', () => {
      expect(COMMUNICATION_RULES.forbidden).toContain('agent_to_agent');
    });

    it('should forbid agent to UI communication', () => {
      expect(COMMUNICATION_RULES.forbidden).toContain('agent_to_ui');
    });

    it('should forbid agent to timeline communication', () => {
      expect(COMMUNICATION_RULES.forbidden).toContain('agent_to_timeline');
    });

    it('should validate communication - allow orchestrator', () => {
      const violation = validateCommunication('orchestrator', 'decision_analyst', true);
      expect(violation).toBeNull();
    });

    it('should validate communication - block agent-to-agent', () => {
      const violation = validateCommunication('decision_analyst', 'memory_agent', false);
      expect(violation).not.toBeNull();
      expect(violation?.type).toBe('AGENT_TO_AGENT');
    });
  });

  // =============================================
  // SECTION 3: SUGGESTION RULES
  // =============================================

  describe('Suggestion Rules', () => {
    it('should define valid suggestion prefixes', () => {
      expect(VALID_SUGGESTION_PREFIXES).toContain('You may want to consider');
      expect(VALID_SUGGESTION_PREFIXES).toContain('An alternative could be');
      expect(VALID_SUGGESTION_PREFIXES).toContain('Historically, you decided');
    });

    it('should define invalid suggestion prefixes', () => {
      expect(INVALID_SUGGESTION_PREFIXES).toContain('You should');
      expect(INVALID_SUGGESTION_PREFIXES).toContain('You must');
      expect(INVALID_SUGGESTION_PREFIXES).toContain('The best option is');
      expect(INVALID_SUGGESTION_PREFIXES).toContain('I recommend');
    });

    it('should validate valid suggestions', () => {
      expect(isValidSuggestion('You may want to consider taking a break')).toBe(true);
      expect(isValidSuggestion('An alternative could be waiting')).toBe(true);
      expect(isValidSuggestion('Historically, you decided to proceed')).toBe(true);
    });

    it('should reject invalid suggestions', () => {
      expect(isValidSuggestion('You should do this')).toBe(false);
      expect(isValidSuggestion('You must act now')).toBe(false);
      expect(isValidSuggestion('The best option is X')).toBe(false);
      expect(isValidSuggestion('I recommend doing Y')).toBe(false);
    });

    it('should reject imperative language', () => {
      const violation = validateSuggestion('test_agent', {
        id: 'sug-1',
        text: 'You should definitely do this',
        type: 'consideration',
      });
      expect(violation).not.toBeNull();
      expect(violation?.type).toBe('IMPERATIVE_LANGUAGE');
    });
  });

  // =============================================
  // SECTION 4: ACTION VALIDATION
  // =============================================

  describe('Action Validation', () => {
    it('should detect forbidden actions', () => {
      expect(isForbiddenAction('write_timeline')).toBe(true);
      expect(isForbiddenAction('finalize_decision')).toBe(true);
      expect(isForbiddenAction('analyze')).toBe(false);
      expect(isForbiddenAction('suggest')).toBe(false);
    });

    it('should block timeline write attempts', () => {
      const violation = validateTimelineAccess('test_agent', 'write');
      expect(violation).not.toBeNull();
      expect(violation?.type).toBe('TIMELINE_WRITE_ATTEMPT');
      expect(violation?.severity).toBe('critical');
    });

    it('should allow timeline read', () => {
      const violation = validateTimelineAccess('test_agent', 'read');
      expect(violation).toBeNull();
    });

    it('should block forbidden actions via guard', () => {
      const result = guardAgentAction('test_agent', 'write_timeline', () => 'success');
      expect(result).toBeNull();
    });

    it('should allow permitted actions via guard', () => {
      const result = guardAgentAction('test_agent', 'analyze', () => 'success');
      expect(result).toBe('success');
    });

    it('should block timeline write via guard', () => {
      const result = guardTimelineWrite('test_agent', () => 'success');
      expect(result).toBeNull();
    });
  });

  // =============================================
  // SECTION 5: FOUNDATIONAL AGENTS (L1)
  // =============================================

  describe('Foundational Agents (L1)', () => {
    it('should define 5 foundational agents', () => {
      expect(Object.keys(FOUNDATIONAL_AGENTS)).toHaveLength(5);
    });

    it('should have decision_analyst', () => {
      expect(FOUNDATIONAL_AGENTS.decision_analyst).toBeDefined();
      expect(FOUNDATIONAL_AGENTS.decision_analyst.level).toBe('L1');
    });

    it('should have context_analyzer', () => {
      expect(FOUNDATIONAL_AGENTS.context_analyzer).toBeDefined();
      expect(FOUNDATIONAL_AGENTS.context_analyzer.capabilities).toContain('analyze');
    });

    it('should have preset_advisor', () => {
      expect(FOUNDATIONAL_AGENTS.preset_advisor).toBeDefined();
      expect(FOUNDATIONAL_AGENTS.preset_advisor.restrictions).toContain('never_activates');
    });

    it('should have memory_agent', () => {
      expect(FOUNDATIONAL_AGENTS.memory_agent).toBeDefined();
      expect(FOUNDATIONAL_AGENTS.memory_agent.capabilities).toContain('recall');
    });

    it('should have ux_observer', () => {
      expect(FOUNDATIONAL_AGENTS.ux_observer).toBeDefined();
      expect(FOUNDATIONAL_AGENTS.ux_observer.restrictions).toContain('no_behavioral_scoring');
    });

    it('should identify foundational agent types', () => {
      expect(isFoundationalAgent('decision_analyst')).toBe(true);
      expect(isFoundationalAgent('context_analyzer')).toBe(true);
      expect(isFoundationalAgent('unknown_agent')).toBe(false);
    });
  });

  // =============================================
  // SECTION 6: ORCHESTRATOR (L0)
  // =============================================

  describe('Orchestrator (L0)', () => {
    it('should define orchestrator restrictions', () => {
      expect(ORCHESTRATOR_DEFINITION.restrictions).toContain('no_domain_knowledge');
      expect(ORCHESTRATOR_DEFINITION.restrictions).toContain('no_data_analysis');
      expect(ORCHESTRATOR_DEFINITION.restrictions).toContain('no_ui_manipulation');
      expect(ORCHESTRATOR_DEFINITION.restrictions).toContain('no_timeline_write');
    });

    it('should have no capabilities (coordination only)', () => {
      expect(ORCHESTRATOR_DEFINITION.capabilities).toHaveLength(0);
    });

    it('should register and unregister agents', () => {
      const mockHandler = async () => ({
        agentId: 'test',
        timestamp: Date.now(),
        confidence: 'high' as ConfidenceLevel,
        data: {},
        explanation: 'Test',
      });

      registerAgent('test_agent', mockHandler);
      expect(getRegisteredAgents()).toContain('test_agent');

      unregisterAgent('test_agent');
      expect(getRegisteredAgents()).not.toContain('test_agent');
    });
  });

  // =============================================
  // SECTION 7: FAIL-SAFE
  // =============================================

  describe('Fail-Safe', () => {
    it('should create fail-safe response', () => {
      const response = createFailSafeResponse('Context unclear');

      expect(response.isUncertain).toBe(true);
      expect(response.defersToHuman).toBe(true);
      expect(response.noRecommendation).toBe(true);
      expect(response.reason).toBe('Context unclear');
    });
  });

  // =============================================
  // SECTION 8: COMPLIANCE REPORT
  // =============================================

  describe('Compliance Report', () => {
    it('should report compliant when no violations', () => {
      const report = generateComplianceReport();

      expect(report.compliant).toBe(true);
      expect(report.totalViolations).toBe(0);
      expect(report.criticalViolations).toBe(0);
    });

    it('should report non-compliant after critical violation', () => {
      // Create a critical violation
      validateTimelineAccess('test_agent', 'write');

      const report = generateComplianceReport();

      expect(report.compliant).toBe(false);
      expect(report.criticalViolations).toBe(1);
    });

    it('should track violations by agent', () => {
      validateAction('agent_a', 'write_timeline');
      validateAction('agent_b', 'autonomous_action');
      validateAction('agent_a', 'finalize_decision');

      const report = generateComplianceReport();

      expect(report.violationsByAgent['agent_a']).toBe(2);
      expect(report.violationsByAgent['agent_b']).toBe(1);
    });
  });

  // =============================================
  // SECTION 9: INITIALIZATION
  // =============================================

  describe('Initialization', () => {
    it('should initialize agent system', () => {
      expect(isAgentSystemInitialized()).toBe(false);

      initializeAgentSystem();

      expect(isAgentSystemInitialized()).toBe(true);
    });

    it('should register foundational agents on init', () => {
      initializeAgentSystem();

      const agents = getRegisteredAgents();

      expect(agents).toContain('decision_analyst');
      expect(agents).toContain('context_analyzer');
      expect(agents).toContain('preset_advisor');
      expect(agents).toContain('memory_agent');
      expect(agents).toContain('ux_observer');
    });

    it('should not double-initialize', () => {
      initializeAgentSystem();
      const count1 = getRegisteredAgents().length;

      initializeAgentSystem(); // Should warn and skip
      const count2 = getRegisteredAgents().length;

      expect(count1).toBe(count2);
    });
  });

  // =============================================
  // SECTION 10: OUTPUT REQUIREMENTS
  // =============================================

  describe('Output Requirements', () => {
    it('should always require human validation', async () => {
      initializeAgentSystem();

      const response = await processIntention({
        userIntention: 'Test intention',
      });

      expect(response.requiresValidation).toBe(true);
    });

    it('should provide neutral options', async () => {
      initializeAgentSystem();

      const response = await processIntention({
        userIntention: 'I need to focus on my project',
      });

      expect(Array.isArray(response.options)).toBe(true);
      expect(response.options.length).toBeGreaterThan(0);
    });

    it('should list consulted agents', async () => {
      initializeAgentSystem();

      const response = await processIntention({
        userIntention: 'Test',
      });

      expect(Array.isArray(response.consultedAgents)).toBe(true);
    });
  });
});
