/* =========================================
   CHE·NU — CONSTITUTION TESTS
   
   Tests pour le système de constitution.
   Vérifie que les violations sont détectées.
   ========================================= */

import {
  CONSTITUTION,
  validateAction,
  validateTimelineWrite,
  validateAgentAction,
  validateRollback,
  validatePresetCount,
  validatePrompt,
  guardTimelineWrite,
  guardAgentAction,
  guardRollback,
  assertHumanInLoop,
  assertTimelineImmutable,
  generateComplianceReport,
  getViolationLog,
  clearViolationLog,
  getPath,
  isOptionAllowed,
  isRestricted,
  CONSTITUTION_LAWS,
  FORBIDDEN_ACTIONS,
} from '../constitution.validator';

import {
  isForbiddenAction,
  validatePrinciples,
} from '../constitution.types';

describe('CHE·NU Constitution', () => {
  // Reset violation log before each test
  beforeEach(() => {
    clearViolationLog();
  });

  // =============================================
  // SECTION 1: CONSTITUTION STRUCTURE
  // =============================================
  
  describe('Constitution Structure', () => {
    it('should have version foundation-1.0', () => {
      expect(CONSTITUTION.cheNuVersion).toBe('foundation-1.0');
    });

    it('should have all 5 principles defined', () => {
      expect(CONSTITUTION.principles.humanInTheLoop).toBe(true);
      expect(CONSTITUTION.principles.timelineIsTruth).toBe(true);
      expect(CONSTITUTION.principles.noAutoDecision).toBe(true);
      expect(CONSTITUTION.principles.agentsAdviseOnly).toBe(true);
      expect(CONSTITUTION.principles.rollbackIsInterpretation).toBe(true);
    });

    it('should have timeline as append-only', () => {
      expect(CONSTITUTION.timeline.mode).toBe('append-only');
      expect(CONSTITUTION.timeline.modifiable).toBe(false);
      expect(CONSTITUTION.timeline.sourceOfTruth).toBe(true);
    });

    it('should have 4 primary paths', () => {
      expect(Object.keys(CONSTITUTION.paths)).toHaveLength(4);
      expect(CONSTITUTION.paths.resume).toBeDefined();
      expect(CONSTITUTION.paths.newObjective).toBeDefined();
      expect(CONSTITUTION.paths.exploration).toBeDefined();
      expect(CONSTITUTION.paths.decision).toBeDefined();
    });

    it('should have limitations defined', () => {
      expect(CONSTITUTION.limitations.maxPrimaryPaths).toBe(4);
      expect(CONSTITUTION.limitations.allowUndoDestructive).toBe(false);
      expect(CONSTITUTION.limitations.allowAgentDecision).toBe(false);
      expect(CONSTITUTION.limitations.maxSimultaneousPresets).toBe(1);
      expect(CONSTITUTION.limitations.maxIntrusivePrompts).toBe(0);
    });

    it('should be frozen (immutable)', () => {
      expect(Object.isFrozen(CONSTITUTION)).toBe(true);
    });
  });

  // =============================================
  // SECTION 2: ACTION VALIDATION
  // =============================================
  
  describe('Action Validation', () => {
    it('should allow valid actions', () => {
      expect(validateAction('change_preset')).toBeNull();
      expect(validateAction('save_idea')).toBeNull();
      expect(validateAction('continue_or_return')).toBeNull();
    });

    it('should reject forbidden actions', () => {
      const violation = validateAction('silent_automation');
      expect(violation).not.toBeNull();
      expect(violation?.type).toBe('SILENT_AUTOMATION');
    });

    it('should detect all forbidden actions', () => {
      FORBIDDEN_ACTIONS.forEach((action) => {
        const violation = validateAction(action);
        expect(violation).not.toBeNull();
      });
    });
  });

  // =============================================
  // SECTION 3: TIMELINE VALIDATION
  // =============================================
  
  describe('Timeline Validation', () => {
    it('should allow writes with human validation', () => {
      const violation = validateTimelineWrite(true, 'user_click');
      expect(violation).toBeNull();
    });

    it('should reject writes without human validation', () => {
      const violation = validateTimelineWrite(false, 'auto_system');
      expect(violation).not.toBeNull();
      expect(violation?.type).toBe('AUTO_DECISION');
      expect(violation?.severity).toBe('critical');
    });

    it('should include source in violation context', () => {
      const violation = validateTimelineWrite(false, 'background_job');
      expect(violation?.context?.source).toBe('background_job');
    });
  });

  // =============================================
  // SECTION 4: AGENT VALIDATION
  // =============================================
  
  describe('Agent Validation', () => {
    it('should allow agent suggestions', () => {
      const violation = validateAgentAction('agent-001', 'suggest');
      expect(violation).toBeNull();
    });

    it('should reject agent decisions', () => {
      const violation = validateAgentAction('agent-001', 'decide');
      expect(violation).not.toBeNull();
      expect(violation?.type).toBe('AGENT_DECISION');
    });

    it('should reject agent auto-apply', () => {
      const violation = validateAgentAction('agent-001', 'apply');
      expect(violation).not.toBeNull();
      expect(violation?.type).toBe('AGENT_DECISION');
    });
  });

  // =============================================
  // SECTION 5: ROLLBACK VALIDATION
  // =============================================
  
  describe('Rollback Validation', () => {
    it('should allow clean rollback', () => {
      const violation = validateRollback(false, false);
      expect(violation).toBeNull();
    });

    it('should reject timeline modification', () => {
      const violation = validateRollback(true, false);
      expect(violation).not.toBeNull();
      expect(violation?.type).toBe('TIMELINE_MODIFICATION');
    });

    it('should reject event deletion', () => {
      const violation = validateRollback(false, true);
      expect(violation).not.toBeNull();
      expect(violation?.type).toBe('TIMELINE_DELETE');
    });
  });

  // =============================================
  // SECTION 6: PRESET VALIDATION
  // =============================================
  
  describe('Preset Validation', () => {
    it('should allow single preset', () => {
      const violation = validatePresetCount(1);
      expect(violation).toBeNull();
    });

    it('should reject multiple presets', () => {
      const violation = validatePresetCount(2);
      expect(violation).not.toBeNull();
      expect(violation?.type).toBe('MULTI_PRESET');
    });

    it('should reject zero presets as valid', () => {
      const violation = validatePresetCount(0);
      expect(violation).toBeNull();
    });
  });

  // =============================================
  // SECTION 7: PROMPT VALIDATION
  // =============================================
  
  describe('Prompt Validation', () => {
    it('should allow non-intrusive prompts', () => {
      const violation = validatePrompt(false);
      expect(violation).toBeNull();
    });

    it('should reject intrusive prompts', () => {
      const violation = validatePrompt(true);
      expect(violation).not.toBeNull();
      expect(violation?.type).toBe('INTRUSIVE_PROMPT');
    });
  });

  // =============================================
  // SECTION 8: GUARDS
  // =============================================
  
  describe('Guards', () => {
    it('should execute function when validated', () => {
      const result = guardTimelineWrite(
        () => 'success',
        true,
        'user'
      );
      expect(result).toBe('success');
    });

    it('should block function when not validated', () => {
      const result = guardTimelineWrite(
        () => 'should not run',
        false,
        'auto'
      );
      expect(result).toBeNull();
    });

    it('should allow agent suggestions', () => {
      const result = guardAgentAction(
        () => 'suggestion',
        'agent-001',
        'suggest'
      );
      expect(result).toBe('suggestion');
    });

    it('should block agent decisions', () => {
      const result = guardAgentAction(
        () => 'decision',
        'agent-001',
        'decide'
      );
      expect(result).toBeNull();
    });

    it('should allow clean rollback', () => {
      const result = guardRollback(
        () => 'rollback done',
        false,
        false
      );
      expect(result).toBe('rollback done');
    });

    it('should block destructive rollback', () => {
      const result = guardRollback(
        () => 'should not run',
        true,
        false
      );
      expect(result).toBeNull();
    });
  });

  // =============================================
  // SECTION 9: PATH CONFIGURATION
  // =============================================
  
  describe('Path Configuration', () => {
    it('should return resume path config', () => {
      const path = getPath('resume');
      expect(path.intent).toBe('resume_previous_context');
      expect(path.entry).toBe('app_open');
    });

    it('should return newObjective path config', () => {
      const path = getPath('newObjective');
      expect(path.intent).toBe('start_new_objective');
      expect(path.save.mode).toBe('explicit');
    });

    it('should check allowed options', () => {
      expect(isOptionAllowed('resume', 'continue_as_is')).toBe(true);
      expect(isOptionAllowed('resume', 'invalid_option')).toBe(false);
    });

    it('should check restrictions', () => {
      expect(isRestricted('resume', 'no_new_decision_written')).toBe(true);
      expect(isRestricted('resume', 'allowed_action')).toBe(false);
    });
  });

  // =============================================
  // SECTION 10: COMPLIANCE REPORT
  // =============================================
  
  describe('Compliance Report', () => {
    it('should report compliant when no violations', () => {
      const report = generateComplianceReport();
      expect(report.compliant).toBe(true);
      expect(report.criticalCount).toBe(0);
    });

    it('should report non-compliant after violation', () => {
      // Create a violation
      validateTimelineWrite(false, 'test');
      
      const report = generateComplianceReport();
      expect(report.compliant).toBe(false);
      expect(report.criticalCount).toBe(1);
    });

    it('should track violation history', () => {
      validateTimelineWrite(false, 'test1');
      validateAgentAction('agent', 'decide');
      
      const log = getViolationLog();
      expect(log).toHaveLength(2);
    });

    it('should clear violation log', () => {
      validateTimelineWrite(false, 'test');
      clearViolationLog();
      
      expect(getViolationLog()).toHaveLength(0);
    });
  });

  // =============================================
  // SECTION 11: TYPE GUARDS
  // =============================================
  
  describe('Type Guards', () => {
    it('should detect forbidden actions', () => {
      expect(isForbiddenAction('silent_automation')).toBe(true);
      expect(isForbiddenAction('implicit_decision')).toBe(true);
      expect(isForbiddenAction('valid_action')).toBe(false);
    });

    it('should validate principles', () => {
      expect(validatePrinciples(CONSTITUTION.principles)).toBe(true);
      expect(validatePrinciples({ humanInTheLoop: false })).toBe(false);
      expect(validatePrinciples(null)).toBe(false);
    });
  });

  // =============================================
  // SECTION 12: LAWS
  // =============================================
  
  describe('Constitution Laws', () => {
    it('should have 5 laws', () => {
      expect(CONSTITUTION_LAWS).toHaveLength(5);
    });

    it('should be frozen', () => {
      expect(Object.isFrozen(CONSTITUTION_LAWS)).toBe(true);
    });

    it('should contain human priority', () => {
      expect(CONSTITUTION_LAWS).toContain(
        'L\'humain est toujours dans la boucle'
      );
    });
  });
});
