/* =====================================================
   CHE·NU — CONTEXT RECOVERY TESTS
   ===================================================== */

import { describe, it, expect, beforeEach } from 'vitest';

import {
  type RecoveryState,
  type RecoveryDeclaration,
  type KnownContextSnapshot,
  type RecoveryReason,
  INITIAL_RECOVERY_STATE,
  RECOVERY_FAILSAFES,
  RECOVERY_LANGUAGE,
  CONTEXT_RECOVERY_DECLARATION,
  isRecoveryInProgress,
  canInitiateRecovery,
  requiresConfirmation,
} from './contextRecovery.types';

import {
  recoveryReducer,
  createDeclaration,
  validateDeclaration,
  validateFailsafes,
  processRecovery,
  gatherKnownContexts,
  formatContextForDisplay,
  formatContextsSummary,
  ContextRecoveryFlow,
  createRecoveryFlow,
} from './contextRecoveryEngine';

/* =========================================================
   TEST DATA
   ========================================================= */

function createMockContext(
  type: string = 'exploratory',
  depth: string = 'moderate'
): KnownContextSnapshot {
  return {
    contextId: `ctx-${Math.random().toString(36).substr(2, 9)}`,
    type: type as any,
    description: 'Test context',
    establishedAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
    isActive: true,
    depth: depth as any,
  };
}

function createMockDeclaration(): RecoveryDeclaration {
  return {
    objective: 'Return to exploration mode',
    contextType: 'exploratory',
    depth: 'moderate',
    riskTolerance: 'balanced',
    preferenceMode: 'consider',
    declaredAt: new Date().toISOString(),
  };
}

/* =========================================================
   FAILSAFE TESTS
   ========================================================= */

describe('Context Recovery Failsafes', () => {
  describe('RECOVERY_FAILSAFES', () => {
    it('should require manual trigger', () => {
      expect(RECOVERY_FAILSAFES.requiresManualTrigger).toBe(true);
    });

    it('should preserve history', () => {
      expect(RECOVERY_FAILSAFES.preservesHistory).toBe(true);
    });

    it('should not allow scheduling', () => {
      expect(RECOVERY_FAILSAFES.noScheduling).toBe(true);
    });

    it('should require explicit confirmation', () => {
      expect(RECOVERY_FAILSAFES.requiresExplicitConfirmation).toBe(true);
    });

    it('should not auto-fill', () => {
      expect(RECOVERY_FAILSAFES.noAutoFill).toBe(true);
    });

    it('should not infer', () => {
      expect(RECOVERY_FAILSAFES.noInference).toBe(true);
    });

    it('should not optimize', () => {
      expect(RECOVERY_FAILSAFES.noOptimization).toBe(true);
    });
  });

  describe('validateFailsafes', () => {
    it('should return true when all failsafes are intact', () => {
      expect(validateFailsafes()).toBe(true);
    });
  });
});

/* =========================================================
   TYPE GUARD TESTS
   ========================================================= */

describe('Recovery Type Guards', () => {
  describe('isRecoveryInProgress', () => {
    it('should return false for idle state', () => {
      expect(isRecoveryInProgress(INITIAL_RECOVERY_STATE)).toBe(false);
    });

    it('should return true for initiated state', () => {
      const state: RecoveryState = {
        ...INITIAL_RECOVERY_STATE,
        phase: 'initiated',
      };
      expect(isRecoveryInProgress(state)).toBe(true);
    });

    it('should return true for confirming state', () => {
      const state: RecoveryState = {
        ...INITIAL_RECOVERY_STATE,
        phase: 'confirming',
      };
      expect(isRecoveryInProgress(state)).toBe(true);
    });

    it('should return false for complete state', () => {
      const state: RecoveryState = {
        ...INITIAL_RECOVERY_STATE,
        phase: 'complete',
      };
      expect(isRecoveryInProgress(state)).toBe(false);
    });
  });

  describe('canInitiateRecovery', () => {
    it('should return true for idle state', () => {
      expect(canInitiateRecovery(INITIAL_RECOVERY_STATE)).toBe(true);
    });

    it('should return true for complete state', () => {
      const state: RecoveryState = {
        ...INITIAL_RECOVERY_STATE,
        phase: 'complete',
      };
      expect(canInitiateRecovery(state)).toBe(true);
    });

    it('should return false for in-progress state', () => {
      const state: RecoveryState = {
        ...INITIAL_RECOVERY_STATE,
        phase: 'confirming',
      };
      expect(canInitiateRecovery(state)).toBe(false);
    });
  });

  describe('requiresConfirmation', () => {
    it('should return true when in confirming phase and not confirmed', () => {
      const state: RecoveryState = {
        ...INITIAL_RECOVERY_STATE,
        phase: 'confirming',
        confirmed: false,
      };
      expect(requiresConfirmation(state)).toBe(true);
    });

    it('should return false when already confirmed', () => {
      const state: RecoveryState = {
        ...INITIAL_RECOVERY_STATE,
        phase: 'confirming',
        confirmed: true,
      };
      expect(requiresConfirmation(state)).toBe(false);
    });
  });
});

/* =========================================================
   REDUCER TESTS
   ========================================================= */

describe('Recovery Reducer', () => {
  describe('INITIATE_RECOVERY', () => {
    it('should transition from idle to initiated', () => {
      const state = recoveryReducer(INITIAL_RECOVERY_STATE, {
        type: 'INITIATE_RECOVERY',
      });

      expect(state.phase).toBe('initiated');
      expect(state.initiatedAt).toBeDefined();
      expect(state.confirmed).toBe(false);
    });

    it('should not reinitiate if already in progress', () => {
      const inProgressState: RecoveryState = {
        ...INITIAL_RECOVERY_STATE,
        phase: 'confirming',
      };

      const state = recoveryReducer(inProgressState, {
        type: 'INITIATE_RECOVERY',
      });

      expect(state.phase).toBe('confirming');
    });
  });

  describe('CANCEL_RECOVERY', () => {
    it('should reset to idle', () => {
      const inProgressState: RecoveryState = {
        ...INITIAL_RECOVERY_STATE,
        phase: 'confirming',
      };

      const state = recoveryReducer(inProgressState, {
        type: 'CANCEL_RECOVERY',
      });

      expect(state.phase).toBe('idle');
    });

    it('should preserve known contexts', () => {
      const contexts = [createMockContext()];
      const inProgressState: RecoveryState = {
        ...INITIAL_RECOVERY_STATE,
        phase: 'confirming',
        knownContexts: contexts,
      };

      const state = recoveryReducer(inProgressState, {
        type: 'CANCEL_RECOVERY',
      });

      expect(state.knownContexts).toEqual(contexts);
    });
  });

  describe('SUBMIT_DECLARATION', () => {
    it('should transition to confirming', () => {
      const initiatedState: RecoveryState = {
        ...INITIAL_RECOVERY_STATE,
        phase: 'initiated',
      };

      const declaration = createMockDeclaration();
      const state = recoveryReducer(initiatedState, {
        type: 'SUBMIT_DECLARATION',
        declaration,
      });

      expect(state.phase).toBe('confirming');
      expect(state.declaration).toEqual(declaration);
    });
  });

  describe('CONFIRM_RECOVERY', () => {
    it('should set confirmed to true', () => {
      const confirmingState: RecoveryState = {
        ...INITIAL_RECOVERY_STATE,
        phase: 'confirming',
        declaration: createMockDeclaration(),
      };

      const state = recoveryReducer(confirmingState, {
        type: 'CONFIRM_RECOVERY',
      });

      expect(state.confirmed).toBe(true);
      expect(state.phase).toBe('applying');
    });

    it('should not confirm without declaration', () => {
      const confirmingState: RecoveryState = {
        ...INITIAL_RECOVERY_STATE,
        phase: 'confirming',
        declaration: undefined,
      };

      const state = recoveryReducer(confirmingState, {
        type: 'CONFIRM_RECOVERY',
      });

      expect(state.confirmed).toBe(false);
    });
  });

  describe('COMPLETE_RECOVERY', () => {
    it('should transition to complete', () => {
      const applyingState: RecoveryState = {
        ...INITIAL_RECOVERY_STATE,
        phase: 'applying',
      };

      const result = {
        success: true,
        newContextFrame: {
          type: 'exploratory' as any,
          depth: 'moderate' as any,
          riskTolerance: 'balanced' as any,
          objective: 'Test',
          preferencesActive: true,
        },
        previousContextsPreserved: 1,
        recoveredAt: new Date().toISOString(),
        appliedDeclaration: createMockDeclaration(),
      };

      const state = recoveryReducer(applyingState, {
        type: 'COMPLETE_RECOVERY',
        result,
      });

      expect(state.phase).toBe('complete');
      expect(state.completedAt).toBeDefined();
    });
  });
});

/* =========================================================
   DECLARATION TESTS
   ========================================================= */

describe('Declaration Creation', () => {
  describe('createDeclaration', () => {
    it('should create valid declaration', () => {
      const declaration = createDeclaration({
        objective: 'Test objective',
        contextType: 'exploratory',
        depth: 'moderate',
        riskTolerance: 'balanced',
        preferenceMode: 'consider',
      });

      expect(declaration.objective).toBe('Test objective');
      expect(declaration.contextType).toBe('exploratory');
      expect(declaration.declaredAt).toBeDefined();
    });

    it('should throw if objective is empty', () => {
      expect(() =>
        createDeclaration({
          objective: '',
          contextType: 'exploratory',
          depth: 'moderate',
          riskTolerance: 'balanced',
          preferenceMode: 'consider',
        })
      ).toThrow('Objective is required');
    });

    it('should trim objective whitespace', () => {
      const declaration = createDeclaration({
        objective: '  Test objective  ',
        contextType: 'exploratory',
        depth: 'moderate',
        riskTolerance: 'balanced',
        preferenceMode: 'consider',
      });

      expect(declaration.objective).toBe('Test objective');
    });
  });

  describe('validateDeclaration', () => {
    it('should validate complete declaration', () => {
      const declaration = createMockDeclaration();
      const result = validateDeclaration(declaration);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should catch missing objective', () => {
      const result = validateDeclaration({
        contextType: 'exploratory',
        depth: 'moderate',
        riskTolerance: 'balanced',
        preferenceMode: 'consider',
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Objective is required.');
    });

    it('should catch multiple missing fields', () => {
      const result = validateDeclaration({});

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });
});

/* =========================================================
   RECOVERY PROCESSING TESTS
   ========================================================= */

describe('Recovery Processing', () => {
  describe('processRecovery', () => {
    it('should return successful result', () => {
      const declaration = createMockDeclaration();
      const contexts = [createMockContext()];

      const result = processRecovery(declaration, contexts);

      expect(result.success).toBe(true);
      expect(result.previousContextsPreserved).toBe(1);
    });

    it('should create correct context frame', () => {
      const declaration = createMockDeclaration();
      const result = processRecovery(declaration, []);

      expect(result.newContextFrame.type).toBe(declaration.contextType);
      expect(result.newContextFrame.depth).toBe(declaration.depth);
      expect(result.newContextFrame.riskTolerance).toBe(declaration.riskTolerance);
      expect(result.newContextFrame.objective).toBe(declaration.objective);
    });

    it('should set preferencesActive based on preferenceMode', () => {
      const declarationConsider = { ...createMockDeclaration(), preferenceMode: 'consider' as const };
      const declarationIgnore = { ...createMockDeclaration(), preferenceMode: 'ignore' as const };

      const resultConsider = processRecovery(declarationConsider, []);
      const resultIgnore = processRecovery(declarationIgnore, []);

      expect(resultConsider.newContextFrame.preferencesActive).toBe(true);
      expect(resultIgnore.newContextFrame.preferencesActive).toBe(false);
    });

    it('should preserve all previous contexts', () => {
      const declaration = createMockDeclaration();
      const contexts = [
        createMockContext(),
        createMockContext(),
        createMockContext(),
      ];

      const result = processRecovery(declaration, contexts);

      expect(result.previousContextsPreserved).toBe(3);
    });
  });
});

/* =========================================================
   FLOW TESTS
   ========================================================= */

describe('ContextRecoveryFlow', () => {
  let flow: ContextRecoveryFlow;

  beforeEach(() => {
    flow = createRecoveryFlow([createMockContext()]);
  });

  it('should start in idle state', () => {
    const state = flow.getState();
    expect(state.phase).toBe('idle');
  });

  it('should initiate recovery manually', () => {
    flow.initiateRecovery();
    const state = flow.getState();

    expect(state.phase).toBe('displaying');
  });

  it('should handle full recovery flow', () => {
    // Initiate
    flow.initiateRecovery();

    // Submit declaration
    const declaration = createMockDeclaration();
    flow.submitDeclaration(declaration);

    expect(flow.getState().phase).toBe('confirming');

    // Confirm
    const result = flow.confirmRecovery();

    expect(result).not.toBeNull();
    expect(result?.success).toBe(true);
    expect(flow.getState().phase).toBe('complete');
  });

  it('should allow cancellation', () => {
    flow.initiateRecovery();
    flow.cancelRecovery();

    expect(flow.getState().phase).toBe('idle');
  });

  it('should support subscription', () => {
    let updates = 0;
    flow.subscribe(() => {
      updates++;
    });

    flow.initiateRecovery();

    expect(updates).toBeGreaterThan(0);
  });

  it('should return system declaration', () => {
    const declaration = flow.getDeclaration();
    expect(declaration).toBe(CONTEXT_RECOVERY_DECLARATION);
  });
});

/* =========================================================
   HELPER FUNCTION TESTS
   ========================================================= */

describe('Helper Functions', () => {
  describe('gatherKnownContexts', () => {
    it('should convert active contexts to snapshots', () => {
      const activeContexts = [
        {
          id: 'ctx-1',
          type: 'exploratory' as const,
          description: 'Test',
        },
      ];

      const snapshots = gatherKnownContexts(activeContexts);

      expect(snapshots).toHaveLength(1);
      expect(snapshots[0].contextId).toBe('ctx-1');
      expect(snapshots[0].isActive).toBe(true);
    });
  });

  describe('formatContextForDisplay', () => {
    it('should format context as string', () => {
      const context = createMockContext();
      const formatted = formatContextForDisplay(context);

      expect(formatted).toContain('Type:');
      expect(formatted).toContain('Depth:');
    });
  });

  describe('formatContextsSummary', () => {
    it('should summarize multiple contexts', () => {
      const contexts = [createMockContext(), createMockContext()];
      const summary = formatContextsSummary(contexts);

      expect(summary).toContain('2 known context(s)');
      expect(summary).toContain('preserved');
    });

    it('should handle empty contexts', () => {
      const summary = formatContextsSummary([]);
      expect(summary).toContain('No active contexts');
    });
  });
});

/* =========================================================
   LANGUAGE & DECLARATION TESTS
   ========================================================= */

describe('Language and Declarations', () => {
  describe('RECOVERY_LANGUAGE', () => {
    it('should have all required prompts', () => {
      expect(RECOVERY_LANGUAGE.initiatePrompt).toBeDefined();
      expect(RECOVERY_LANGUAGE.objectivePrompt).toBeDefined();
      expect(RECOVERY_LANGUAGE.confirmPrompt).toBeDefined();
      expect(RECOVERY_LANGUAGE.completionMessage).toBeDefined();
    });

    it('should reflect continuity, agency, and clarity', () => {
      expect(RECOVERY_LANGUAGE.confirmNote).toContain('preserved');
      expect(RECOVERY_LANGUAGE.continuityNote).toContain('preserved');
    });
  });

  describe('CONTEXT_RECOVERY_DECLARATION', () => {
    it('should contain key principles', () => {
      expect(CONTEXT_RECOVERY_DECLARATION).toContain('continuity without obligation');
      expect(CONTEXT_RECOVERY_DECLARATION).toContain('reorientation without erasure');
      expect(CONTEXT_RECOVERY_DECLARATION).toContain('Human intent remains sovereign');
    });
  });
});
