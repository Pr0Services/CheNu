/* =====================================================
   CHE·NU — CONTEXT RECOVERY MODE TYPES (DEEP SPEC)
   Status: STABILITY & RE-ANCHORING MECHANISM
   Authority: HUMAN ONLY
   Automation Level: ZERO
   Purpose: REGAIN CLARITY WITHOUT ERASURE
   
   📜 PHILOSOPHICAL FOUNDATION:
   Loss of clarity does not mean loss of correctness.
   Recovery exists to restore ORIENTATION,
   not to assess value, performance, or quality.
   
   The system assumes:
   - Confusion can be valid
   - Pauses are healthy
   - Change is natural
   
   📜 ANSWERS ONLY:
   "Which context do I want to return to, consciously?"
   
   📜 NEVER:
   - Resets history
   - Erases memory
   - Corrects behavior
   - Enforces alignment
   ===================================================== */

import { type ContextType, type RiskTolerance } from '../../core/foundation/contextAdaptation';

/* =========================================================
   PHILOSOPHICAL FOUNDATION
   ========================================================= */

/**
 * Core philosophical principles of Context Recovery.
 */
export const RECOVERY_PHILOSOPHY = {
  /** Loss of clarity does not mean loss of correctness */
  clarityNotCorrectness: true,

  /** Recovery restores orientation, not value assessment */
  orientationNotAssessment: true,

  /** The system assumes these are valid states */
  validStates: {
    confusionCanBeValid: true,
    pausesAreHealthy: true,
    changeIsNatural: true,
  },
} as const;

/**
 * WHY Context Recovery exists (at ROOT level).
 * 
 * Context Recovery exists because:
 * - Continuity can become pressure
 * - Momentum can turn into inertia
 * - Intelligence can overshoot clarity
 */
export const RECOVERY_ROOT_REASONS = {
  /** Continuity can become pressure */
  continuityCanBecomePressure: true,

  /** Momentum can turn into inertia */
  momentumCanTurnIntoInertia: true,

  /** Intelligence can overshoot clarity */
  intelligenceCanOvershootClarity: true,

  /** The system acknowledges */
  systemAcknowledges: {
    /** Stopping is not failure */
    stoppingIsNotFailure: true,
    /** Changing posture is not inconsistency */
    changingPostureIsNotInconsistency: true,
    /** Clarity cannot be inferred */
    clarityCannotBeInferred: true,
  },

  /** Recovery is not an exception — it is a NORMAL operation */
  recoveryIsNormalOperation: true,
} as const;

/**
 * Intent Sanctuary Principle.
 * 
 * Anything expressed by the user during Recovery:
 * - Is not stored as preference
 * - Is not reused later
 * - Is not pattern-analyzed
 * - Is not compared historically
 * 
 * Recovery speech is SACRED. It is context-private.
 */
export const INTENT_SANCTUARY_PRINCIPLE = {
  /** Not stored as preference */
  notStoredAsPreference: true,

  /** Not reused later */
  notReusedLater: true,

  /** Not pattern-analyzed */
  notPatternAnalyzed: true,

  /** Not compared historically */
  notComparedHistorically: true,

  /** Recovery speech is SACRED */
  recoverySpeechIsSacred: true,

  /** It is context-private */
  isContextPrivate: true,
} as const;

/**
 * Relationship to Truth & Clarity.
 * 
 * Context Recovery does not seek truth.
 * It creates conditions where truth MAY be seen.
 * 
 * It does not clarify meaning.
 * It removes pressure that obscures meaning.
 */
export const RECOVERY_TRUTH_RELATIONSHIP = {
  /** Does not seek truth */
  doesNotSeekTruth: true,

  /** Creates conditions where truth MAY be seen */
  createsConditionsForTruth: true,

  /** Does not clarify meaning */
  doesNotClarifyMeaning: true,

  /** Removes pressure that obscures meaning */
  removesPressureThatObscuresMeaning: true,
} as const;

/* =========================================================
   CORE TYPES
   ========================================================= */

/**
 * Triggers for context recovery (HUMAN-ONLY).
 * The system NEVER questions these triggers.
 */
export type RecoveryTrigger =
  | 'cognitive-overload'
  | 'context-stacking'
  | 'prolonged-exploration'
  | 're-entry-after-inactivity'
  | 'emotional-uncertainty'
  | 'strategic-uncertainty'
  | 'intent-posture-mismatch'
  | 'explicit-request'
  | 'other';

/**
 * Reasons why context recovery might be invoked.
 * @deprecated Use RecoveryTrigger instead
 */
export type RecoveryReason =
  | 'overlapping-contexts'
  | 'intent-evolution'
  | 'exploration-drift'
  | 'orientation-loss'
  | 'returning-after-pause'
  | 'explicit-reset'
  | 'other';

/**
 * Context depth levels.
 */
export type ContextDepth =
  | 'shallow'   // Surface-level, quick interactions
  | 'moderate'  // Standard working depth (alias: 'standard')
  | 'deep'      // Deep focus, complex work
  | 'immersive'; // Full engagement

/**
 * Pace preference for the session.
 */
export type SessionPace =
  | 'slow'     // Careful, deliberate
  | 'neutral'  // Default pace
  | 'fast';    // Quick iterations

/**
 * Preference consideration mode.
 */
export type PreferenceMode =
  | 'apply'     // Use known preferences
  | 'ignore'    // Start fresh, ignore past preferences
  | 'ask-later' // Defer decision
  | 'consider'  // Alias for 'apply'
  | 'selective'; // User chooses which to keep

/**
 * Internal recovery states.
 * Recovery unfolds in 3 internal states.
 */
export type RecoveryInternalState =
  | 'suspension'    // Pause contextual assumptions
  | 'orientation'   // Surface recent contexts (read-only)
  | 're-anchoring'; // User declares new reference context

/**
 * Recovery state phases (external view).
 */
export type RecoveryPhase =
  | 'idle'           // Not in recovery
  | 'initiated'      // Recovery requested
  | 'suspended'      // STATE 1: Contextual assumptions paused
  | 'displaying'     // STATE 2: Showing current contexts
  | 'awaiting-input' // Waiting for user declaration
  | 'confirming'     // Awaiting explicit confirmation
  | 'applying'       // STATE 3: Applying new context frame
  | 'complete';      // Recovery finished

/* =========================================================
   RECOVERY INPUTS
   ========================================================= */

/**
 * User declaration for context recovery.
 * 
 * User may declare:
 * - Intent (free text, optional)
 * - Desired context type
 * - Desired depth (shallow / standard / deep)
 * - Desired pace (slow / neutral / fast)
 * - Preference handling: apply / ignore / ask later
 * 
 * Defaults are ALWAYS neutral.
 */
export interface RecoveryDeclaration {
  /** Current objective/intent in free text (OPTIONAL) */
  objective?: string;

  /** Intent as free text (alias for objective) */
  intent?: string;

  /** Desired context type */
  contextType: ContextType;

  /** Desired depth */
  depth: ContextDepth;

  /** Desired pace */
  pace: SessionPace;

  /** Risk tolerance */
  riskTolerance: RiskTolerance;

  /** Preference handling mode */
  preferenceMode: PreferenceMode;

  /** Optional: specific preferences to keep (if selective) */
  keepPreferences?: string[];

  /** Optional: trigger that initiated recovery */
  trigger?: RecoveryTrigger;

  /** Optional: additional notes */
  notes?: string;

  /** Timestamp of declaration */
  declaredAt: string;
}

/* =========================================================
   KNOWN CONTEXT SNAPSHOT
   ========================================================= */

/**
 * A snapshot of a known context (read-only display).
 */
export interface KnownContextSnapshot {
  /** Context identifier */
  contextId: string;

  /** Context type */
  type: ContextType;

  /** Brief description */
  description: string;

  /** When this context was established */
  establishedAt: string;

  /** Last active timestamp */
  lastActiveAt: string;

  /** Associated sphere (if any) */
  sphereId?: string;

  /** Associated project (if any) */
  projectId?: string;

  /** Is this context currently active */
  isActive: boolean;

  /** Depth when last active */
  depth: ContextDepth;
}

/* =========================================================
   RECOVERY STATE
   ========================================================= */

/**
 * Current state of context recovery.
 */
export interface RecoveryState {
  /** Current phase (external view) */
  phase: RecoveryPhase;

  /** Current internal state */
  internalState?: RecoveryInternalState;

  /** Known contexts (read-only display) */
  knownContexts: KnownContextSnapshot[];

  /** User's recovery declaration (if provided) */
  declaration?: RecoveryDeclaration;

  /** Whether confirmation has been given */
  confirmed: boolean;

  /** Timestamp when recovery was initiated */
  initiatedAt?: string;

  /** Timestamp when recovery was completed */
  completedAt?: string;

  /** Any messages to display */
  messages: RecoveryMessage[];

  /** Trigger that initiated this recovery */
  trigger?: RecoveryTrigger;

  /** Is this a repeated recovery? */
  isRepeated?: boolean;

  /** Was there an active decision paused? */
  decisionPaused?: boolean;

  /** Is this after a long hiatus? */
  afterHiatus?: boolean;
}

/**
 * A message during recovery process.
 */
export interface RecoveryMessage {
  /** Message ID */
  id: string;

  /** Message type */
  type: 'info' | 'prompt' | 'confirmation' | 'success';

  /** Message content */
  content: string;

  /** Timestamp */
  timestamp: string;
}

/* =========================================================
   RECOVERY RESULT
   ========================================================= */

/**
 * Result of a completed recovery.
 */
export interface RecoveryResult {
  /** Success status */
  success: boolean;

  /** New context frame established */
  newContextFrame: {
    type: ContextType;
    depth: ContextDepth;
    pace: SessionPace;
    riskTolerance: RiskTolerance;
    objective?: string;
    intent?: string;
    preferencesActive: boolean;
  };

  /** Previous contexts (preserved, not deleted) */
  previousContextsPreserved: number;

  /** Recovery timestamp */
  recoveredAt: string;

  /** Declaration that was applied */
  appliedDeclaration: RecoveryDeclaration;

  /** Audit log entry */
  auditEntry: RecoveryAuditEntry;
}

/* =========================================================
   RECOVERY ACTIONS
   ========================================================= */

/**
 * Actions that can be taken during recovery.
 */
export type RecoveryAction =
  | { type: 'INITIATE_RECOVERY'; reason?: RecoveryReason }
  | { type: 'CANCEL_RECOVERY' }
  | { type: 'SUBMIT_DECLARATION'; declaration: RecoveryDeclaration }
  | { type: 'CONFIRM_RECOVERY' }
  | { type: 'REJECT_RECOVERY' }
  | { type: 'COMPLETE_RECOVERY'; result: RecoveryResult };

/* =========================================================
   VISUAL & UX CONFIGURATION
   ========================================================= */

/**
 * Visual configuration for recovery mode.
 * 
 * Context Recovery must feel:
 * - Calm
 * - Neutral
 * - Non-alarming
 */
export interface RecoveryVisualConfig {
  /** Theme colors (calm, neutral) */
  colors: {
    background: string;
    foreground: string;
    accent: string;
    muted: string;
  };

  /** No warnings or urgency signals */
  showWarnings: false;

  /** No performance framing */
  showPerformanceMetrics: false;

  /** Animation speed (slow, calm) */
  animationSpeed: 'slow' | 'very-slow';

  /** Transition style */
  transitionStyle: 'fade' | 'dissolve';
}

/**
 * Default visual configuration.
 */
export const DEFAULT_RECOVERY_VISUAL_CONFIG: RecoveryVisualConfig = {
  colors: {
    background: '#0f0f1a',
    foreground: '#e0e0e0',
    accent: '#6b8afd',
    muted: '#555566',
  },
  showWarnings: false,
  showPerformanceMetrics: false,
  animationSpeed: 'slow',
  transitionStyle: 'fade',
};

/* =========================================================
   XR CONFIGURATION
   ========================================================= */

/**
 * XR-specific configuration for recovery mode.
 * 
 * In XR:
 * - Recovery appears as returning to a neutral clearing
 * - Previous contexts remain visible in the distance
 * - No collapsing or disappearance of prior paths
 */
export interface RecoveryXRConfig {
  /** Enable XR recovery view */
  enabled: boolean;

  /** Environment style */
  environment: 'neutral-clearing' | 'open-space' | 'calm-void';

  /** Previous contexts visibility */
  previousContextsVisible: boolean;

  /** Distance of previous contexts */
  previousContextsDistance: number;

  /** No collapsing animations */
  noCollapsingAnimations: true;

  /** No disappearance effects */
  noDisappearanceEffects: true;
}

/**
 * Default XR configuration.
 */
export const DEFAULT_RECOVERY_XR_CONFIG: RecoveryXRConfig = {
  enabled: false,
  environment: 'neutral-clearing',
  previousContextsVisible: true,
  previousContextsDistance: 50,
  noCollapsingAnimations: true,
  noDisappearanceEffects: true,
};

/* =========================================================
   LANGUAGE TEMPLATES
   ========================================================= */

/* =========================================================
   LANGUAGE & BEHAVIOR RULES (DEEP SPEC)
   ========================================================= */

/**
 * Forbidden language during recovery.
 * These words must NEVER be used.
 */
export const FORBIDDEN_RECOVERY_LANGUAGE = [
  'reset',
  'correct',
  'optimize',
  'recover from error',
  'fix state',
  'fix',
  'realign',
  'return', // as in "return to normal"
  'restore', // implies something was broken
  'repair',
  'heal',
  'improve',
] as const;

/**
 * Allowed verbs during recovery.
 * Use ONLY these for actions.
 */
export const ALLOWED_RECOVERY_VERBS = [
  'orient',
  'choose',
  'declare',
  'continue',
  'select',
  'acknowledge',
  'proceed',
] as const;

/**
 * System behavior rules during recovery.
 */
export const RECOVERY_BEHAVIOR_RULES = {
  /** Must stop background suggestion */
  stopBackgroundSuggestion: true,

  /** Must stop drift highlighting */
  stopDriftHighlighting: true,

  /** Must stop preference prompting */
  stopPreferencePrompting: true,

  /** Avoid summaries implying direction */
  avoidDirectionalSummaries: true,

  /** Avoid language like "return", "fix", "realign" */
  avoidForbiddenLanguage: true,
} as const;

/**
 * Language must reflect:
 * - Continuity
 * - Agency
 * - Clarity
 * 
 * Required tone: calm, neutral, permissive
 * Recovery must feel like: stepping back, catching breath, choosing footing
 */
export const RECOVERY_LANGUAGE = {
  // Initiation
  initiatePrompt: 'Would you like to orient your context?',
  initiateDescription: 'This allows you to consciously choose a new reference frame while preserving all history.',

  // Declaration prompts
  intentPrompt: 'What is your current intent? (optional, free text)',
  objectivePrompt: 'What is your current objective? (optional)',
  contextTypePrompt: 'What type of context would you like?',
  depthPrompt: 'What depth of engagement?',
  pacePrompt: 'What pace do you prefer?',
  riskPrompt: 'What is your risk tolerance?',
  preferencePrompt: 'How should past preferences be handled?',

  // Confirmation
  confirmPrompt: 'Ready to proceed with this context frame?',
  confirmNote: 'Previous contexts remain accessible. Nothing is erased.',

  // Completion
  completionMessage: 'Context oriented successfully.',
  continuityNote: 'All previous contexts are preserved.',

  // Cancel
  cancelMessage: 'Recovery concluded. Current context unchanged.',

  // Orientation metaphor
  orientationMetaphor: 'You are choosing your footing.',
} as const;

/* =========================================================
   EDGE CASES & SAFETY
   ========================================================= */

/**
 * MICRO-BOUNDARIES (NON-NEGOTIABLE).
 * 
 * During Recovery, the system MUST:
 * - Avoid referencing past "unclosed loops"
 * - Avoid reminding of pending objectives
 * - Avoid implying unfinished work
 * - Avoid summarizing "where things stopped"
 * 
 * Recovery moment is NOT a checkpoint.
 * It is a fresh stance over continuous ground.
 */
export const RECOVERY_MICRO_BOUNDARIES = {
  /** Avoid referencing past "unclosed loops" */
  avoidUnclosedLoops: true,

  /** Avoid reminding of pending objectives */
  avoidPendingObjectives: true,

  /** Avoid implying unfinished work */
  avoidUnfinishedWorkImplied: true,

  /** Avoid summarizing "where things stopped" */
  avoidStopPointSummary: true,

  /** Recovery moment is NOT a checkpoint */
  isNotCheckpoint: true,

  /** It is a fresh stance over continuous ground */
  isFreshStance: true,
} as const;

/**
 * COGNITIVE LOAD REDUCTION RULES.
 * 
 * In Recovery UI / flow:
 * - Maximum 1 question per screen
 * - No multi-choice stacks
 * - No progressive disclosure of history unless requested
 * - Silence is preferable to suggestion
 * 
 * Default state = NEUTRAL PRESENCE
 */
export const COGNITIVE_LOAD_RULES = {
  /** Maximum 1 question per screen */
  maxOneQuestionPerScreen: true,

  /** No multi-choice stacks */
  noMultiChoiceStacks: true,

  /** No progressive disclosure of history unless requested */
  noHistoryDisclosureUnlessRequested: true,

  /** Silence is preferable to suggestion */
  silencePreferableToSuggestion: true,

  /** Default state */
  defaultState: 'NEUTRAL_PRESENCE',
} as const;

/**
 * TEMPORAL BUFFER.
 * 
 * Recovery introduces a BUFFER ZONE in time.
 * 
 * Inside this buffer:
 * - No new drift is detected
 * - No preference observation occurs
 * - No narrative is generated
 * - No comparative overlay is updated
 * 
 * Buffer ends ONLY after:
 * - Explicit confirmation
 * - New context declaration
 */
export const TEMPORAL_BUFFER_RULES = {
  /** Inside buffer: no new drift is detected */
  noDriftDetection: true,

  /** Inside buffer: no preference observation occurs */
  noPreferenceObservation: true,

  /** Inside buffer: no narrative is generated */
  noNarrativeGeneration: true,

  /** Inside buffer: no comparative overlay is updated */
  noComparativeOverlayUpdate: true,

  /** Buffer ends ONLY after explicit confirmation */
  endsOnExplicitConfirmation: true,

  /** Buffer ends ONLY after new context declaration */
  endsOnNewContextDeclaration: true,
} as const;

/**
 * FRACTAL CONSISTENCY.
 * 
 * Context Recovery behaves identically at all scales:
 * - Session
 * - Project
 * - Sphere
 * - System-wide
 * 
 * Same rules. Same protections. Same neutrality.
 * No "lighter" recovery at higher levels.
 * No "forced seriousness" at lower levels.
 */
export const FRACTAL_CONSISTENCY = {
  /** Scales where recovery applies identically */
  scales: ['session', 'project', 'sphere', 'system-wide'] as const,

  /** Same rules at all scales */
  sameRulesAtAllScales: true,

  /** Same protections at all scales */
  sameProtectionsAtAllScales: true,

  /** Same neutrality at all scales */
  sameNeutralityAtAllScales: true,

  /** No "lighter" recovery at higher levels */
  noLighterRecoveryAtHigherLevels: true,

  /** No "forced seriousness" at lower levels */
  noForcedSeriousnessAtLowerLevels: true,
} as const;

/**
 * ANTI-MISUSE SAFEGUARDS.
 * 
 * The system explicitly DOES NOT:
 * - Detect avoidance
 * - Detect indecision
 * - Count recoveries
 * - Suggest "commitment"
 * 
 * Frequency is irrelevant.
 * Agency is absolute.
 */
export const ANTI_MISUSE_SAFEGUARDS = {
  /** Does NOT detect avoidance */
  noAvoidanceDetection: true,

  /** Does NOT detect indecision */
  noIndecisionDetection: true,

  /** Does NOT count recoveries */
  noRecoveryCounting: true,

  /** Does NOT suggest "commitment" */
  noCommitmentSuggestion: true,

  /** Frequency is irrelevant */
  frequencyIsIrrelevant: true,

  /** Agency is absolute */
  agencyIsAbsolute: true,
} as const;

/**
 * OPTIONAL REFLECTIVE SURFACE (READ-ONLY).
 * 
 * If (and only if) the user requests reflection:
 * The system MAY display:
 * - Contexts used recently (labels only)
 * - Time spans (not durations)
 * - Neutrality statement
 * 
 * Displayed WITHOUT:
 * - Highlighting
 * - Ordering
 * - Color semantics
 */
export const REFLECTIVE_SURFACE_RULES = {
  /** Only if user requests */
  onlyIfRequested: true,

  /** May display */
  mayDisplay: {
    contextsUsedRecently: 'labels only',
    timeSpans: 'not durations',
    neutralityStatement: true,
  },

  /** Displayed WITHOUT */
  displayedWithout: {
    highlighting: true,
    ordering: true,
    colorSemantics: true,
  },
} as const;

/**
 * FAILURE STATES & SYSTEM RESPONSE.
 * 
 * If system input becomes unclear during Recovery:
 * → pause → wait → do nothing
 * 
 * If user abandons Recovery:
 * → resume last stable posture → no notification → no warning
 * 
 * Silence is a valid resolution.
 */
export const FAILURE_STATE_RULES = {
  /** If input becomes unclear */
  onUnclearInput: {
    action: 'pause',
    then: 'wait',
    finally: 'do nothing',
  },

  /** If user abandons Recovery */
  onAbandonment: {
    action: 'resume last stable posture',
    notification: false,
    warning: false,
  },

  /** Silence is a valid resolution */
  silenceIsValidResolution: true,
} as const;

/**
 * Edge case handling rules.
 */
export const RECOVERY_EDGE_CASES = {
  /**
   * A) Repeated Recovery
   * - Allowed
   * - Never flagged
   * - Never inferred as avoidance
   */
  repeatedRecovery: {
    allowed: true,
    neverFlagged: true,
    neverInferredAsAvoidance: true,
  },

  /**
   * B) Recovery During Decision Phase
   * - Decision is paused
   * - Nothing is rolled back
   * - No warning issued
   */
  recoveryDuringDecision: {
    decisionPaused: true,
    noRollback: true,
    noWarning: true,
  },

  /**
   * C) Recovery After Long Hiatus
   * - Preferences default to inactive
   * - Narratives remain readable
   * - No "catch-up" forced
   */
  recoveryAfterHiatus: {
    preferencesDefaultInactive: true,
    narrativesReadable: true,
    noCatchUpForced: true,
  },
} as const;

/* =========================================================
   RELATIONSHIP TO OTHER SYSTEMS
   ========================================================= */

/**
 * What recovery affects and doesn't affect.
 * Recovery is LOCAL in effect.
 */
export const RECOVERY_SYSTEM_RELATIONSHIPS = {
  /** DOES re-initialize Context Interpreter */
  reinitializesContextInterpreter: true,

  /** DOES NOT touch Preference Observer */
  touchesPreferenceObserver: false,

  /** DOES NOT reset Drift systems */
  resetsDriftSystems: false,

  /** DOES NOT generate narratives */
  generatesNarratives: false,

  /** DOES NOT affect Collective overlays */
  affectsCollectiveOverlays: false,

  /** Recovery is LOCAL in effect */
  isLocalInEffect: true,
} as const;

/* =========================================================
   FAILSAFES
   ========================================================= */

/**
 * Failsafes for context recovery.
 * 
 * - Recovery cannot be triggered automatically
 * - Recovery does not modify historical data
 * - Recovery cannot be scheduled
 * - Recovery requires explicit human confirmation
 */
export const RECOVERY_FAILSAFES = {
  /** Cannot be triggered automatically */
  requiresManualTrigger: true,

  /** Does not modify historical data */
  preservesHistory: true,

  /** Cannot be scheduled */
  noScheduling: true,

  /** Requires explicit human confirmation */
  requiresExplicitConfirmation: true,

  /** No auto-fill */
  noAutoFill: true,

  /** No inference */
  noInference: true,

  /** No optimization */
  noOptimization: true,

  /** Defaults are ALWAYS neutral */
  neutralDefaults: true,
} as const;

/* =========================================================
   AUDIT & TRANSPARENCY
   ========================================================= */

/**
 * Audit rules for recovery events.
 */
export const RECOVERY_AUDIT_RULES = {
  /** Recovery events are logged as markers only */
  loggedAsMarkersOnly: true,

  /** Never analyzed for performance */
  neverAnalyzedForPerformance: true,

  /** Never used as behavioral signal */
  neverUsedAsBehavioralSignal: true,

  /** Example log entry format */
  logEntryExample: 'Context recovery invoked — new posture declared.',
} as const;

/**
 * Recovery audit log entry.
 */
export interface RecoveryAuditEntry {
  /** Event type (always 'recovery') */
  type: 'recovery';

  /** Timestamp */
  timestamp: string;

  /** Marker message (no details) */
  marker: string;

  /** New posture declared (optional summary) */
  postureType?: string;
}

/* =========================================================
   SYSTEM DECLARATION
   ========================================================= */

/**
 * System declaration for context recovery.
 */
export const CONTEXT_RECOVERY_DECLARATION = `
Context Recovery Mode exists to protect
human clarity, not system efficiency.

It preserves continuity without inertia,
choice without pressure,
and memory without obligation.

Recovery is an act of agency.
Agency remains human.

Context acknowledged. Authority unchanged.
`.trim();

/**
 * FOUNDATIONAL DECLARATION (FINAL).
 * 
 * Context Recovery Mode is not a fix.
 * It is the system stepping back
 * so the human can step forward.
 * 
 * No memory is erased.
 * No path is closed.
 * No outcome is implied.
 * 
 * Clarity is allowed to emerge.
 */
export const CONTEXT_RECOVERY_FOUNDATIONAL_DECLARATION = `
Context Recovery Mode is not a fix.

It is the system stepping back
so the human can step forward.

No memory is erased.
No path is closed.
No outcome is implied.

Clarity is allowed to emerge.
`.trim();

/**
 * Recovery internal state configuration.
 * 
 * STATE 1 — SUSPENSION
 * - Pause contextual assumptions
 * - Freeze adaptive hints
 * - Stop preference influence
 * 
 * STATE 2 — ORIENTATION
 * - Surface recent contexts (read-only)
 * - Show current posture neutrally
 * - Display no recommendations
 * 
 * STATE 3 — RE-ANCHORING
 * - User declares new reference context
 * - Confirmation required
 * - New session posture applied
 */
export const RECOVERY_INTERNAL_STATES = {
  suspension: {
    name: 'SUSPENSION',
    actions: [
      'pause contextual assumptions',
      'freeze adaptive hints',
      'stop preference influence',
    ],
    noHistoryAlteration: true,
  },
  orientation: {
    name: 'ORIENTATION',
    actions: [
      'surface recent contexts (read-only)',
      'show current posture neutrally',
      'display no recommendations',
    ],
    noHistoryAlteration: true,
  },
  reAnchoring: {
    name: 'RE-ANCHORING',
    actions: [
      'user declares new reference context',
      'confirmation required',
      'new session posture applied',
    ],
    noHistoryAlteration: true,
  },
} as const;

/* =========================================================
   INITIAL STATE
   ========================================================= */

/**
 * Initial recovery state.
 */
export const INITIAL_RECOVERY_STATE: RecoveryState = {
  phase: 'idle',
  internalState: undefined,
  knownContexts: [],
  confirmed: false,
  messages: [],
  trigger: undefined,
  isRepeated: false,
  decisionPaused: false,
  afterHiatus: false,
};

/**
 * Default declaration values (ALWAYS neutral).
 */
export const DEFAULT_DECLARATION_VALUES = {
  contextType: 'exploratory' as ContextType,
  depth: 'moderate' as ContextDepth,
  pace: 'neutral' as SessionPace,
  riskTolerance: 'balanced' as RiskTolerance,
  preferenceMode: 'ask-later' as PreferenceMode,
} as const;

/* =========================================================
   TYPE GUARDS
   ========================================================= */

/**
 * Check if recovery is in progress.
 */
export function isRecoveryInProgress(state: RecoveryState): boolean {
  return state.phase !== 'idle' && state.phase !== 'complete';
}

/**
 * Check if recovery can be initiated.
 */
export function canInitiateRecovery(state: RecoveryState): boolean {
  return state.phase === 'idle' || state.phase === 'complete';
}

/**
 * Check if recovery requires confirmation.
 */
export function requiresConfirmation(state: RecoveryState): boolean {
  return state.phase === 'confirming' && !state.confirmed;
}

/* =========================================================
   EXPORTS
   ========================================================= */

export default RecoveryState;
