/* =====================================================
   CHE·NU — CONTEXT RECOVERY VIEW
   Status: RECOVERY / REALIGNMENT MODE
   Authority: HUMAN ONLY
   
   📜 PURPOSE:
   UI for conscious context re-anchoring.
   
   📜 VISUAL RULES:
   - Calm
   - Neutral
   - Non-alarming
   - No warnings
   - No urgency signals
   - No performance framing
   ===================================================== */

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  type RecoveryState,
  type RecoveryDeclaration,
  type RecoveryResult,
  type RecoveryReason,
  type ContextDepth,
  type PreferenceMode,
  type KnownContextSnapshot,
  DEFAULT_RECOVERY_VISUAL_CONFIG,
  RECOVERY_LANGUAGE,
  CONTEXT_RECOVERY_DECLARATION,
  RECOVERY_FAILSAFES,
} from './contextRecovery.types';
import {
  type ContextType,
  type RiskTolerance,
} from '../foundation/contextAdaptation';
import {
  ContextRecoveryFlow,
  createRecoveryFlow,
  createDeclaration,
  validateDeclaration,
} from './contextRecoveryEngine';
import { AGENT_CONFIRMATION } from '../agents/internalAgentContext';

/* =========================================================
   PROPS
   ========================================================= */

export interface ContextRecoveryViewProps {
  /** Known contexts to display */
  knownContexts?: KnownContextSnapshot[];

  /** Callback when recovery completes */
  onRecoveryComplete?: (result: RecoveryResult) => void;

  /** Callback when recovery is cancelled */
  onCancel?: () => void;

  /** Custom class name */
  className?: string;

  /** Width */
  width?: number | string;
}

/* =========================================================
   STYLES
   ========================================================= */

const colors = DEFAULT_RECOVERY_VISUAL_CONFIG.colors;

const styles = {
  container: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    backgroundColor: colors.background,
    borderRadius: '16px',
    overflow: 'hidden',
    color: colors.foreground,
  },

  header: {
    padding: '24px 28px',
    borderBottom: `1px solid ${colors.muted}33`,
  },

  title: {
    fontSize: '20px',
    fontWeight: 500,
    color: colors.foreground,
    margin: 0,
    marginBottom: '8px',
  },

  subtitle: {
    fontSize: '14px',
    color: colors.muted,
    margin: 0,
  },

  badge: {
    display: 'inline-block',
    fontSize: '10px',
    padding: '4px 10px',
    borderRadius: '12px',
    backgroundColor: `${colors.accent}22`,
    color: colors.accent,
    marginTop: '12px',
  },

  body: {
    padding: '24px 28px',
  },

  section: {
    marginBottom: '24px',
  },

  sectionTitle: {
    fontSize: '12px',
    fontWeight: 600,
    color: colors.muted,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    marginBottom: '12px',
  },

  contextCard: {
    backgroundColor: `${colors.muted}15`,
    borderRadius: '8px',
    padding: '12px 16px',
    marginBottom: '8px',
  },

  contextType: {
    fontSize: '14px',
    fontWeight: 500,
    color: colors.foreground,
  },

  contextDetail: {
    fontSize: '12px',
    color: colors.muted,
    marginTop: '4px',
  },

  formGroup: {
    marginBottom: '20px',
  },

  label: {
    display: 'block',
    fontSize: '13px',
    color: colors.foreground,
    marginBottom: '8px',
  },

  input: {
    width: '100%',
    padding: '12px 14px',
    fontSize: '14px',
    backgroundColor: `${colors.muted}15`,
    border: `1px solid ${colors.muted}33`,
    borderRadius: '8px',
    color: colors.foreground,
    outline: 'none',
    transition: 'border-color 0.2s',
  },

  select: {
    width: '100%',
    padding: '12px 14px',
    fontSize: '14px',
    backgroundColor: `${colors.muted}15`,
    border: `1px solid ${colors.muted}33`,
    borderRadius: '8px',
    color: colors.foreground,
    outline: 'none',
    cursor: 'pointer',
  },

  textarea: {
    width: '100%',
    padding: '12px 14px',
    fontSize: '14px',
    backgroundColor: `${colors.muted}15`,
    border: `1px solid ${colors.muted}33`,
    borderRadius: '8px',
    color: colors.foreground,
    outline: 'none',
    resize: 'vertical' as const,
    minHeight: '80px',
  },

  buttonRow: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '24px',
  },

  button: {
    padding: '10px 20px',
    fontSize: '14px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },

  primaryButton: {
    backgroundColor: colors.accent,
    color: '#fff',
  },

  secondaryButton: {
    backgroundColor: `${colors.muted}33`,
    color: colors.foreground,
  },

  message: {
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '12px',
    fontSize: '14px',
  },

  messageInfo: {
    backgroundColor: `${colors.muted}15`,
    color: colors.foreground,
  },

  messageSuccess: {
    backgroundColor: `${colors.accent}22`,
    color: colors.accent,
  },

  declaration: {
    padding: '16px',
    backgroundColor: `${colors.muted}10`,
    borderRadius: '8px',
    fontSize: '13px',
    color: colors.muted,
    lineHeight: 1.6,
    whiteSpace: 'pre-line' as const,
    textAlign: 'center' as const,
    marginTop: '24px',
  },

  footer: {
    padding: '16px 28px',
    borderTop: `1px solid ${colors.muted}22`,
    fontSize: '11px',
    color: colors.muted,
    textAlign: 'center' as const,
  },

  preservedNote: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    backgroundColor: `${colors.accent}11`,
    borderRadius: '8px',
    fontSize: '13px',
    color: colors.muted,
    marginTop: '16px',
  },
};

/* =========================================================
   HOOK: useContextRecovery
   ========================================================= */

export function useContextRecovery(
  initialContexts: KnownContextSnapshot[] = []
) {
  const [flow] = useState(() => createRecoveryFlow(initialContexts));
  const [state, setState] = useState<RecoveryState>(flow.getState());

  useEffect(() => {
    const unsubscribe = flow.subscribe(setState);
    return unsubscribe;
  }, [flow]);

  const initiateRecovery = useCallback(
    (reason?: RecoveryReason) => {
      flow.initiateRecovery(reason);
    },
    [flow]
  );

  const submitDeclaration = useCallback(
    (declaration: RecoveryDeclaration) => {
      flow.submitDeclaration(declaration);
    },
    [flow]
  );

  const confirmRecovery = useCallback(() => {
    return flow.confirmRecovery();
  }, [flow]);

  const cancelRecovery = useCallback(() => {
    flow.cancelRecovery();
  }, [flow]);

  const rejectRecovery = useCallback(() => {
    flow.rejectRecovery();
  }, [flow]);

  const reset = useCallback(() => {
    flow.reset();
  }, [flow]);

  return {
    state,
    initiateRecovery,
    submitDeclaration,
    confirmRecovery,
    cancelRecovery,
    rejectRecovery,
    reset,
  };
}

/* =========================================================
   SUB-COMPONENTS
   ========================================================= */

interface KnownContextsDisplayProps {
  contexts: KnownContextSnapshot[];
}

const KnownContextsDisplay: React.FC<KnownContextsDisplayProps> = ({
  contexts,
}) => {
  if (contexts.length === 0) {
    return (
      <div style={styles.contextCard}>
        <div style={styles.contextDetail}>No active contexts found.</div>
      </div>
    );
  }

  return (
    <>
      {contexts.map((ctx) => (
        <div key={ctx.contextId} style={styles.contextCard}>
          <div style={styles.contextType}>
            {ctx.type} ({ctx.depth})
          </div>
          <div style={styles.contextDetail}>{ctx.description}</div>
          {ctx.sphereId && (
            <div style={styles.contextDetail}>Sphere: {ctx.sphereId}</div>
          )}
        </div>
      ))}
      <div style={styles.preservedNote}>
        <span>✓</span>
        <span>These contexts will be preserved. Nothing is erased.</span>
      </div>
    </>
  );
};

interface DeclarationFormProps {
  onSubmit: (declaration: RecoveryDeclaration) => void;
  onCancel: () => void;
}

const DeclarationForm: React.FC<DeclarationFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [objective, setObjective] = useState('');
  const [contextType, setContextType] = useState<ContextType>('exploratory');
  const [depth, setDepth] = useState<ContextDepth>('moderate');
  const [riskTolerance, setRiskTolerance] = useState<RiskTolerance>('balanced');
  const [preferenceMode, setPreferenceMode] = useState<PreferenceMode>('consider');
  const [notes, setNotes] = useState('');

  const handleSubmit = useCallback(() => {
    const declaration = createDeclaration({
      objective,
      contextType,
      depth,
      riskTolerance,
      preferenceMode,
      notes: notes || undefined,
    });

    onSubmit(declaration);
  }, [objective, contextType, depth, riskTolerance, preferenceMode, notes, onSubmit]);

  const isValid = objective.trim().length > 0;

  return (
    <div>
      {/* Objective */}
      <div style={styles.formGroup}>
        <label style={styles.label}>{RECOVERY_LANGUAGE.objectivePrompt}</label>
        <input
          type="text"
          style={styles.input}
          value={objective}
          onChange={(e) => setObjective(e.target.value)}
          placeholder="e.g., Return to exploration mode"
        />
      </div>

      {/* Context Type */}
      <div style={styles.formGroup}>
        <label style={styles.label}>{RECOVERY_LANGUAGE.contextTypePrompt}</label>
        <select
          style={styles.select}
          value={contextType}
          onChange={(e) => setContextType(e.target.value as ContextType)}
        >
          <option value="exploratory">Exploratory</option>
          <option value="decision">Decision-making</option>
          <option value="informational">Informational</option>
          <option value="task-oriented">Task-oriented</option>
          <option value="creative">Creative</option>
          <option value="analytical">Analytical</option>
        </select>
      </div>

      {/* Depth */}
      <div style={styles.formGroup}>
        <label style={styles.label}>{RECOVERY_LANGUAGE.depthPrompt}</label>
        <select
          style={styles.select}
          value={depth}
          onChange={(e) => setDepth(e.target.value as ContextDepth)}
        >
          <option value="shallow">Shallow - Quick interactions</option>
          <option value="moderate">Moderate - Standard working depth</option>
          <option value="deep">Deep - Complex work, full focus</option>
          <option value="immersive">Immersive - Full engagement</option>
        </select>
      </div>

      {/* Risk Tolerance */}
      <div style={styles.formGroup}>
        <label style={styles.label}>{RECOVERY_LANGUAGE.riskPrompt}</label>
        <select
          style={styles.select}
          value={riskTolerance}
          onChange={(e) => setRiskTolerance(e.target.value as RiskTolerance)}
        >
          <option value="low">Low - Conservative, safe choices</option>
          <option value="balanced">Balanced - Moderate risk</option>
          <option value="high">High - Open to experimentation</option>
        </select>
      </div>

      {/* Preference Mode */}
      <div style={styles.formGroup}>
        <label style={styles.label}>{RECOVERY_LANGUAGE.preferencePrompt}</label>
        <select
          style={styles.select}
          value={preferenceMode}
          onChange={(e) => setPreferenceMode(e.target.value as PreferenceMode)}
        >
          <option value="consider">Consider - Use known preferences</option>
          <option value="ignore">Ignore - Start fresh</option>
          <option value="selective">Selective - Choose which to keep</option>
        </select>
      </div>

      {/* Notes (optional) */}
      <div style={styles.formGroup}>
        <label style={styles.label}>Additional notes (optional)</label>
        <textarea
          style={styles.textarea}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any additional context..."
        />
      </div>

      {/* Buttons */}
      <div style={styles.buttonRow}>
        <button
          style={{ ...styles.button, ...styles.secondaryButton }}
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          style={{
            ...styles.button,
            ...styles.primaryButton,
            opacity: isValid ? 1 : 0.5,
            cursor: isValid ? 'pointer' : 'not-allowed',
          }}
          onClick={handleSubmit}
          disabled={!isValid}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

interface ConfirmationViewProps {
  declaration: RecoveryDeclaration;
  onConfirm: () => void;
  onReject: () => void;
}

const ConfirmationView: React.FC<ConfirmationViewProps> = ({
  declaration,
  onConfirm,
  onReject,
}) => {
  return (
    <div>
      <div style={{ ...styles.message, ...styles.messageInfo }}>
        {RECOVERY_LANGUAGE.confirmPrompt}
      </div>

      <div style={styles.section}>
        <div style={styles.sectionTitle}>New Context Frame</div>
        <div style={styles.contextCard}>
          <div style={styles.contextType}>{declaration.contextType}</div>
          <div style={styles.contextDetail}>
            Objective: {declaration.objective}
          </div>
          <div style={styles.contextDetail}>Depth: {declaration.depth}</div>
          <div style={styles.contextDetail}>
            Risk: {declaration.riskTolerance}
          </div>
          <div style={styles.contextDetail}>
            Preferences: {declaration.preferenceMode}
          </div>
        </div>
      </div>

      <div style={styles.preservedNote}>
        <span>✓</span>
        <span>{RECOVERY_LANGUAGE.confirmNote}</span>
      </div>

      <div style={styles.buttonRow}>
        <button
          style={{ ...styles.button, ...styles.secondaryButton }}
          onClick={onReject}
        >
          Go Back
        </button>
        <button
          style={{ ...styles.button, ...styles.primaryButton }}
          onClick={onConfirm}
        >
          Confirm Re-anchor
        </button>
      </div>
    </div>
  );
};

interface CompletionViewProps {
  result: RecoveryResult;
  onDone: () => void;
}

const CompletionView: React.FC<CompletionViewProps> = ({ result, onDone }) => {
  return (
    <div>
      <div style={{ ...styles.message, ...styles.messageSuccess }}>
        ✓ {RECOVERY_LANGUAGE.completionMessage}
      </div>

      <div style={styles.section}>
        <div style={styles.sectionTitle}>Active Context Frame</div>
        <div style={styles.contextCard}>
          <div style={styles.contextType}>{result.newContextFrame.type}</div>
          <div style={styles.contextDetail}>
            {result.newContextFrame.objective}
          </div>
          <div style={styles.contextDetail}>
            Depth: {result.newContextFrame.depth}
          </div>
        </div>
      </div>

      <div style={styles.preservedNote}>
        <span>✓</span>
        <span>
          {result.previousContextsPreserved} previous context(s) preserved.
        </span>
      </div>

      <div style={styles.buttonRow}>
        <button
          style={{ ...styles.button, ...styles.primaryButton }}
          onClick={onDone}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

/* =========================================================
   MAIN COMPONENT
   ========================================================= */

export const ContextRecoveryView: React.FC<ContextRecoveryViewProps> = ({
  knownContexts = [],
  onRecoveryComplete,
  onCancel,
  className,
  width = 480,
}) => {
  const {
    state,
    initiateRecovery,
    submitDeclaration,
    confirmRecovery,
    cancelRecovery,
    rejectRecovery,
    reset,
  } = useContextRecovery(knownContexts);

  const [result, setResult] = useState<RecoveryResult | null>(null);

  // Auto-initiate if idle
  useEffect(() => {
    if (state.phase === 'idle') {
      initiateRecovery();
    }
  }, [state.phase, initiateRecovery]);

  const handleConfirm = useCallback(() => {
    const recoveryResult = confirmRecovery();
    if (recoveryResult) {
      setResult(recoveryResult);
      onRecoveryComplete?.(recoveryResult);
    }
  }, [confirmRecovery, onRecoveryComplete]);

  const handleCancel = useCallback(() => {
    cancelRecovery();
    onCancel?.();
  }, [cancelRecovery, onCancel]);

  const handleDone = useCallback(() => {
    reset();
    setResult(null);
  }, [reset]);

  return (
    <div style={{ ...styles.container, width }} className={className}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>Context Recovery</h2>
        <p style={styles.subtitle}>
          Consciously re-anchor your context
        </p>
        <span style={styles.badge}>HUMAN AUTHORITY</span>
      </div>

      {/* Body */}
      <div style={styles.body}>
        {/* Phase: Displaying known contexts */}
        {(state.phase === 'initiated' || state.phase === 'displaying') && (
          <>
            <div style={styles.section}>
              <div style={styles.sectionTitle}>Known Contexts</div>
              <KnownContextsDisplay contexts={state.knownContexts} />
            </div>

            <div style={styles.section}>
              <div style={styles.sectionTitle}>Declare New Context</div>
              <DeclarationForm
                onSubmit={submitDeclaration}
                onCancel={handleCancel}
              />
            </div>
          </>
        )}

        {/* Phase: Awaiting input */}
        {state.phase === 'awaiting-input' && (
          <DeclarationForm
            onSubmit={submitDeclaration}
            onCancel={handleCancel}
          />
        )}

        {/* Phase: Confirming */}
        {state.phase === 'confirming' && state.declaration && (
          <ConfirmationView
            declaration={state.declaration}
            onConfirm={handleConfirm}
            onReject={rejectRecovery}
          />
        )}

        {/* Phase: Complete */}
        {state.phase === 'complete' && result && (
          <CompletionView result={result} onDone={handleDone} />
        )}

        {/* Declaration */}
        <div style={styles.declaration}>{CONTEXT_RECOVERY_DECLARATION}</div>
      </div>

      {/* Footer */}
      <div style={styles.footer}>{AGENT_CONFIRMATION}</div>
    </div>
  );
};

/* =========================================================
   TRIGGER BUTTON (For embedding)
   ========================================================= */

export interface ContextRecoveryTriggerProps {
  onClick: () => void;
  label?: string;
}

export const ContextRecoveryTrigger: React.FC<ContextRecoveryTriggerProps> = ({
  onClick,
  label = 'Re-anchor Context',
}) => {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 16px',
        fontSize: '13px',
        backgroundColor: `${colors.muted}22`,
        color: colors.foreground,
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
      }}
    >
      {label}
    </button>
  );
};

/* =========================================================
   EXPORTS
   ========================================================= */

export default ContextRecoveryView;
