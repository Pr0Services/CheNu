/* =====================================================
   CHE·NU — CONTEXT RECOVERY ENGINE (DEEP SPEC)
   Status: STABILITY & RE-ANCHORING MECHANISM
   Authority: HUMAN ONLY
   Automation Level: ZERO
   
   📜 PURPOSE:
   Process context recovery requests while maintaining
   all failsafes and human sovereignty.
   
   📜 RULES:
   - No auto-fill
   - No inference
   - No optimization
   - Requires explicit confirmation
   - Defaults are ALWAYS neutral
   ===================================================== */

import { AGENT_CONFIRMATION } from '../agents/internalAgentContext';
import {
  type RecoveryState,
  type RecoveryPhase,
  type RecoveryInternalState,
  type RecoveryDeclaration,
  type RecoveryResult,
  type RecoveryAction,
  type RecoveryMessage,
  type RecoveryTrigger,
  type KnownContextSnapshot,
  type ContextDepth,
  type SessionPace,
  type PreferenceMode,
  type RecoveryAuditEntry,
  INITIAL_RECOVERY_STATE,
  DEFAULT_DECLARATION_VALUES,
  RECOVERY_FAILSAFES,
  RECOVERY_LANGUAGE,
  RECOVERY_INTERNAL_STATES,
  RECOVERY_EDGE_CASES,
  RECOVERY_SYSTEM_RELATIONSHIPS,
  RECOVERY_AUDIT_RULES,
  CONTEXT_RECOVERY_DECLARATION,
  isRecoveryInProgress,
  canInitiateRecovery,
} from './contextRecovery.types';
import { type ContextType, type RiskTolerance } from '../foundation/contextAdaptation';

/* =========================================================
   MESSAGE HELPERS
   ========================================================= */

/**
 * Create a recovery message.
 */
function createMessage(
  type: RecoveryMessage['type'],
  content: string
): RecoveryMessage {
  return {
    id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    content,
    timestamp: new Date().toISOString(),
  };
}

/* =========================================================
   STATE REDUCER
   ========================================================= */

/**
 * Reducer for recovery state.
 * Processes recovery actions while maintaining failsafes.
 * 
 * INTERNAL STATES:
 * STATE 1 — SUSPENSION: pause contextual assumptions
 * STATE 2 — ORIENTATION: surface recent contexts (read-only)
 * STATE 3 — RE-ANCHORING: user declares new reference context
 */
export function recoveryReducer(
  state: RecoveryState,
  action: RecoveryAction
): RecoveryState {
  switch (action.type) {
    case 'INITIATE_RECOVERY': {
      // Failsafe: Check if recovery can be initiated
      if (!canInitiateRecovery(state)) {
        // Per RECOVERY_EDGE_CASES: repeated recovery is allowed, never flagged
        if (RECOVERY_EDGE_CASES.repeatedRecovery.allowed) {
          // Allow it, mark as repeated
          return {
            ...state,
            isRepeated: true,
            messages: [
              ...state.messages,
              createMessage('info', RECOVERY_LANGUAGE.initiatePrompt),
            ],
          };
        }
        return {
          ...state,
          messages: [
            ...state.messages,
            createMessage('info', 'Recovery already in progress.'),
          ],
        };
      }

      // STATE 1: SUSPENSION
      return {
        ...state,
        phase: 'initiated',
        internalState: 'suspension',
        initiatedAt: new Date().toISOString(),
        confirmed: false,
        declaration: undefined,
        completedAt: undefined,
        trigger: action.trigger,
        isRepeated: false,
        messages: [
          createMessage('info', RECOVERY_LANGUAGE.initiatePrompt),
          createMessage('info', RECOVERY_LANGUAGE.initiateDescription),
        ],
      };
    }

    case 'CANCEL_RECOVERY': {
      return {
        ...INITIAL_RECOVERY_STATE,
        knownContexts: state.knownContexts,
        messages: [
          createMessage('info', RECOVERY_LANGUAGE.cancelMessage),
        ],
      };
    }

    case 'SUBMIT_DECLARATION': {
      // Failsafe: Only accept declaration in appropriate phase
      if (state.phase !== 'initiated' && state.phase !== 'suspended' && 
          state.phase !== 'displaying' && state.phase !== 'awaiting-input') {
        return state;
      }

      // STATE 3: RE-ANCHORING (awaiting confirmation)
      return {
        ...state,
        phase: 'confirming',
        internalState: 're-anchoring',
        declaration: action.declaration,
        messages: [
          ...state.messages,
          createMessage('prompt', RECOVERY_LANGUAGE.confirmPrompt),
          createMessage('info', RECOVERY_LANGUAGE.confirmNote),
        ],
      };
    }

    case 'CONFIRM_RECOVERY': {
      // Failsafe: Require explicit confirmation
      if (state.phase !== 'confirming' || !state.declaration) {
        return state;
      }

      return {
        ...state,
        phase: 'applying',
        confirmed: true,
        messages: [
          ...state.messages,
          createMessage('info', 'Applying new context frame...'),
        ],
      };
    }

    case 'REJECT_RECOVERY': {
      return {
        ...INITIAL_RECOVERY_STATE,
        knownContexts: state.knownContexts,
        messages: [
          createMessage('info', 'Recovery concluded. Context unchanged.'),
        ],
      };
    }

    case 'COMPLETE_RECOVERY': {
      return {
        ...state,
        phase: 'complete',
        internalState: undefined,
        completedAt: new Date().toISOString(),
        messages: [
          ...state.messages,
          createMessage('success', RECOVERY_LANGUAGE.completionMessage),
          createMessage('info', RECOVERY_LANGUAGE.continuityNote),
        ],
      };
    }

    default:
      return state;
  }
}

/* =========================================================
   CONTEXT SNAPSHOT HELPERS
   ========================================================= */

/**
 * Gather known contexts for display (read-only).
 * This does NOT modify any data.
 */
export function gatherKnownContexts(
  activeContexts: Array<{
    id: string;
    type: ContextType;
    description?: string;
    establishedAt?: string;
    lastActiveAt?: string;
    sphereId?: string;
    projectId?: string;
    depth?: ContextDepth;
  }>
): KnownContextSnapshot[] {
  return activeContexts.map((ctx) => ({
    contextId: ctx.id,
    type: ctx.type,
    description: ctx.description || 'No description',
    establishedAt: ctx.establishedAt || new Date().toISOString(),
    lastActiveAt: ctx.lastActiveAt || new Date().toISOString(),
    sphereId: ctx.sphereId,
    projectId: ctx.projectId,
    isActive: true,
    depth: ctx.depth || 'moderate',
  }));
}

/* =========================================================
   DECLARATION BUILDER
   ========================================================= */

/**
 * Create a recovery declaration from user inputs.
 * 
 * NOTE: This is a helper only. The actual values
 * MUST come from explicit user input.
 * No auto-fill, no inference, no optimization.
 */
export function createDeclaration(params: {
  objective: string;
  contextType: ContextType;
  depth: ContextDepth;
  riskTolerance: RiskTolerance;
  preferenceMode: PreferenceMode;
  keepPreferences?: string[];
  reason?: RecoveryReason;
  notes?: string;
}): RecoveryDeclaration {
  // Failsafe: Require objective
  if (!params.objective || params.objective.trim().length === 0) {
    throw new Error('Objective is required for recovery declaration.');
  }

  return {
    objective: params.objective.trim(),
    contextType: params.contextType,
    depth: params.depth,
    riskTolerance: params.riskTolerance,
    preferenceMode: params.preferenceMode,
    keepPreferences: params.keepPreferences,
    reason: params.reason,
    notes: params.notes,
    declaredAt: new Date().toISOString(),
  };
}

/* =========================================================
   RECOVERY PROCESSOR
   ========================================================= */

/**
 * Process a confirmed recovery declaration.
 * 
 * This function:
 * 1. Pauses all active contextual assumptions
 * 2. Re-initializes Context Interpreter using ONLY declared inputs
 * 3. Returns the result
 * 
 * It does NOT:
 * - Touch drift records
 * - Touch preference memory
 * - Touch narratives
 * - Touch timelines
 */
export function processRecovery(
  declaration: RecoveryDeclaration,
  knownContexts: KnownContextSnapshot[]
): RecoveryResult {
  // Validate failsafes
  if (!RECOVERY_FAILSAFES.requiresManualTrigger) {
    throw new Error('Failsafe violation: Recovery requires manual trigger.');
  }

  if (!RECOVERY_FAILSAFES.preservesHistory) {
    throw new Error('Failsafe violation: History must be preserved.');
  }

  // Create new context frame from declaration ONLY
  const newContextFrame = {
    type: declaration.contextType,
    depth: declaration.depth,
    riskTolerance: declaration.riskTolerance,
    objective: declaration.objective,
    preferencesActive: declaration.preferenceMode !== 'ignore',
  };

  // Count preserved contexts (they are NOT deleted)
  const previousContextsPreserved = knownContexts.length;

  return {
    success: true,
    newContextFrame,
    previousContextsPreserved,
    recoveredAt: new Date().toISOString(),
    appliedDeclaration: declaration,
  };
}

/* =========================================================
   VALIDATION FUNCTIONS
   ========================================================= */

/**
 * Validate a recovery declaration.
 */
export function validateDeclaration(
  declaration: Partial<RecoveryDeclaration>
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!declaration.objective || declaration.objective.trim().length === 0) {
    errors.push('Objective is required.');
  }

  if (!declaration.contextType) {
    errors.push('Context type is required.');
  }

  if (!declaration.depth) {
    errors.push('Depth is required.');
  }

  if (!declaration.riskTolerance) {
    errors.push('Risk tolerance is required.');
  }

  if (!declaration.preferenceMode) {
    errors.push('Preference mode is required.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Check if all failsafes are intact.
 */
export function validateFailsafes(): boolean {
  return (
    RECOVERY_FAILSAFES.requiresManualTrigger &&
    RECOVERY_FAILSAFES.preservesHistory &&
    RECOVERY_FAILSAFES.noScheduling &&
    RECOVERY_FAILSAFES.requiresExplicitConfirmation &&
    RECOVERY_FAILSAFES.noAutoFill &&
    RECOVERY_FAILSAFES.noInference &&
    RECOVERY_FAILSAFES.noOptimization
  );
}

/* =========================================================
   DISPLAY HELPERS
   ========================================================= */

/**
 * Format a context snapshot for display.
 */
export function formatContextForDisplay(
  context: KnownContextSnapshot
): string {
  const lines = [
    `Type: ${context.type}`,
    `Depth: ${context.depth}`,
    `Description: ${context.description}`,
  ];

  if (context.sphereId) {
    lines.push(`Sphere: ${context.sphereId}`);
  }

  if (context.projectId) {
    lines.push(`Project: ${context.projectId}`);
  }

  return lines.join('\n');
}

/**
 * Format known contexts as a summary.
 */
export function formatContextsSummary(
  contexts: KnownContextSnapshot[]
): string {
  if (contexts.length === 0) {
    return 'No active contexts found.';
  }

  const lines = [
    `${contexts.length} known context(s):`,
    '',
  ];

  for (const ctx of contexts) {
    lines.push(`• ${ctx.type} (${ctx.depth}): ${ctx.description}`);
  }

  lines.push('');
  lines.push('These contexts will be preserved.');

  return lines.join('\n');
}

/* =========================================================
   RECOVERY FLOW ORCHESTRATOR
   ========================================================= */

/**
 * Context Recovery Flow.
 * 
 * This class orchestrates the recovery flow while
 * maintaining all failsafes.
 */
export class ContextRecoveryFlow {
  private state: RecoveryState;
  private listeners: Array<(state: RecoveryState) => void> = [];

  constructor(initialContexts: KnownContextSnapshot[] = []) {
    this.state = {
      ...INITIAL_RECOVERY_STATE,
      knownContexts: initialContexts,
    };
  }

  /**
   * Get current state.
   */
  getState(): RecoveryState {
    return { ...this.state };
  }

  /**
   * Subscribe to state changes.
   */
  subscribe(listener: (state: RecoveryState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  /**
   * Dispatch an action.
   */
  private dispatch(action: RecoveryAction): void {
    this.state = recoveryReducer(this.state, action);
    this.listeners.forEach((l) => l(this.state));
  }

  /**
   * Initiate recovery (MANUAL ONLY).
   */
  initiateRecovery(reason?: RecoveryReason): void {
    // Failsafe: This method must be called explicitly by user action
    this.dispatch({ type: 'INITIATE_RECOVERY', reason });

    // Transition to displaying known contexts
    this.state = {
      ...this.state,
      phase: 'displaying',
      messages: [
        ...this.state.messages,
        createMessage('info', formatContextsSummary(this.state.knownContexts)),
      ],
    };
    this.listeners.forEach((l) => l(this.state));
  }

  /**
   * Submit declaration (from explicit user input).
   */
  submitDeclaration(declaration: RecoveryDeclaration): void {
    const validation = validateDeclaration(declaration);

    if (!validation.valid) {
      this.state = {
        ...this.state,
        messages: [
          ...this.state.messages,
          createMessage('info', `Please complete: ${validation.errors.join(', ')}`),
        ],
      };
      this.listeners.forEach((l) => l(this.state));
      return;
    }

    this.dispatch({ type: 'SUBMIT_DECLARATION', declaration });
  }

  /**
   * Confirm recovery (EXPLICIT CONFIRMATION REQUIRED).
   */
  confirmRecovery(): RecoveryResult | null {
    if (!this.state.declaration) {
      return null;
    }

    // First confirm
    this.dispatch({ type: 'CONFIRM_RECOVERY' });

    // Then process
    const result = processRecovery(
      this.state.declaration,
      this.state.knownContexts
    );

    // Complete
    this.dispatch({ type: 'COMPLETE_RECOVERY', result });

    return result;
  }

  /**
   * Cancel recovery.
   */
  cancelRecovery(): void {
    this.dispatch({ type: 'CANCEL_RECOVERY' });
  }

  /**
   * Reject recovery at confirmation.
   */
  rejectRecovery(): void {
    this.dispatch({ type: 'REJECT_RECOVERY' });
  }

  /**
   * Update known contexts (for display only).
   */
  updateKnownContexts(contexts: KnownContextSnapshot[]): void {
    this.state = {
      ...this.state,
      knownContexts: contexts,
    };
    this.listeners.forEach((l) => l(this.state));
  }

  /**
   * Reset to idle state.
   */
  reset(): void {
    this.state = {
      ...INITIAL_RECOVERY_STATE,
      knownContexts: this.state.knownContexts,
    };
    this.listeners.forEach((l) => l(this.state));
  }

  /**
   * Get system declaration.
   */
  getDeclaration(): string {
    return CONTEXT_RECOVERY_DECLARATION;
  }
}

/* =========================================================
   FACTORY FUNCTION
   ========================================================= */

/**
 * Create a new context recovery flow.
 */
export function createRecoveryFlow(
  initialContexts: KnownContextSnapshot[] = []
): ContextRecoveryFlow {
  return new ContextRecoveryFlow(initialContexts);
}

/* =========================================================
   EXPORTS
   ========================================================= */

export {
  isRecoveryInProgress,
  canInitiateRecovery,
  CONTEXT_RECOVERY_DECLARATION,
  RECOVERY_FAILSAFES,
  RECOVERY_LANGUAGE,
};
