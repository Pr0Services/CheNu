/* =====================================================
   CHE·NU — NARRATIVE SILENCE ZONE
   (User-Authored Narrative Notes × Visual Silence Mode)
   Status: HUMAN REFLECTION SPACE
   Authority: HUMAN ONLY
   Intent: ENABLE MEANING WITHOUT RESPONSE
   
   📜 CORE INTENT:
   Narrative Silence Zone exists to provide a protected space
   where human-written meaning can coexist with minimal visuals,
   without triggering interpretation, feedback, or influence.
   
   It answers only:
   "What do I want to express, quietly?"
   
   It NEVER answers:
   "What does this imply?"
   "What should happen next?"
   "What should be learned?"
   ===================================================== */

import { type VisualSilenceState } from './visualSilence.types';
import { type UserNarrativeNote, type NoteAssociatedScope } from '../notes/narrativeNotes.types';

/* =========================================================
   ACTIVATION RULES
   ========================================================= */

/**
 * Activation conditions for Narrative Silence Zone.
 * 
 * The zone is entered when:
 * - Visual Silence Mode is active
 * - The user opens or creates a Narrative Note
 */
export const ZONE_ACTIVATION_CONDITIONS = {
  /** Visual Silence Mode must be active */
  requiresVisualSilence: true,

  /** User must open or create a Narrative Note */
  requiresNoteInteraction: true,

  /** Activation is intentional */
  activationIsIntentional: true,

  /** Activation is reversible */
  activationIsReversible: true,
} as const;

/**
 * What the system DOES NOT do regarding activation.
 */
export const ZONE_ACTIVATION_RESTRICTIONS = {
  /** Does NOT suggest entering this mode */
  suggestsEntering: false,

  /** Does NOT auto-open notes */
  autoOpensNotes: false,

  /** Does NOT prompt reflection */
  promptsReflection: false,

  /** Does NOT recommend writing */
  recommendsWriting: false,

  /** Does NOT analyze entry frequency */
  analyzesFrequency: false,
} as const;

/* =========================================================
   VISUAL RULES (STRICT)
   ========================================================= */

/**
 * Visual rules when Narrative Silence Zone is active.
 * 
 * Silence is visual AND semantic.
 */
export const ZONE_VISUAL_RULES = {
  /** UI reduced to text + spacing */
  uiReduction: 'text-and-spacing',

  /** No icons except navigation */
  iconsAllowed: 'navigation-only',

  /** No highlights */
  highlights: false,

  /** No animations */
  animations: false,

  /** No contextual cues */
  contextualCues: false,

  /** Background elements dimmed, not removed */
  backgroundTreatment: 'dimmed',

  /** Silence is visual AND semantic */
  silenceScope: 'visual-and-semantic',
} as const;

/**
 * Typography rules in Narrative Silence Zone.
 */
export const ZONE_TYPOGRAPHY = {
  /** Font weight - light, not bold */
  fontWeight: 'light',

  /** Line height - generous */
  lineHeight: 1.8,

  /** Letter spacing - slightly increased */
  letterSpacing: '0.02em',

  /** Color - muted, not stark */
  textColor: 'muted',

  /** No emphasis markers */
  emphasisMarkers: false,
} as const;

/* =========================================================
   NOTE INTERACTION RULES
   ========================================================= */

/**
 * What user MAY do inside the zone.
 */
export const ZONE_USER_PERMISSIONS = {
  /** Write freely */
  writeFree: true,

  /** Edit past notes */
  editPastNotes: true,

  /** Read without timestamps emphasized */
  readWithoutTimestampEmphasis: true,

  /** Attach note to time span or decision (optional) */
  attachToTimeSpan: true,

  /** Attach note to decision echo (optional) */
  attachToDecision: true,

  /** Delete own notes */
  deleteOwnNotes: true,

  /** Export notes */
  exportNotes: true,
} as const;

/**
 * What system DOES NOT do inside the zone.
 */
export const ZONE_SYSTEM_RESTRICTIONS = {
  /** Does NOT offer edits */
  offersEdits: false,

  /** Does NOT show related content */
  showsRelatedContent: false,

  /** Does NOT highlight keywords */
  highlightsKeywords: false,

  /** Does NOT track writing speed */
  tracksWritingSpeed: false,

  /** Does NOT measure engagement */
  measuresEngagement: false,

  /** Does NOT generate summaries */
  generatesSummaries: false,

  /** Does NOT suggest tags */
  suggestsTags: false,
} as const;

/* =========================================================
   ATTACHMENT RULES
   ========================================================= */

/**
 * Rules for attaching notes within the zone.
 * 
 * Attachment is:
 * - always optional
 * - spatially meaningful
 * - never analyzed
 */
export const ZONE_ATTACHMENT_RULES = {
  /** Attachment is always optional */
  alwaysOptional: true,

  /** Attachment is spatially meaningful */
  spatiallyMeaningful: true,

  /** Attachment is never analyzed */
  neverAnalyzed: true,

  /** Attachment does not affect note content */
  doesNotAffectContent: true,

  /** Attachment can be removed without consequence */
  removableWithoutConsequence: true,
} as const;

/**
 * What notes can be attached to in the zone.
 */
export const ZONE_ATTACHMENT_TARGETS = {
  /** Time spans */
  timeSpans: true,

  /** Decision echoes */
  decisionEchoes: true,

  /** Context declarations */
  contextDeclarations: true,

  /** Timeline markers */
  timelineMarkers: true,

  /** Spheres */
  spheres: true,

  /** Other notes (linking) */
  otherNotes: false, // No linking to preserve isolation
} as const;

/* =========================================================
   EXIT RULES
   ========================================================= */

/**
 * Rules for exiting the Narrative Silence Zone.
 */
export const ZONE_EXIT_RULES = {
  /** Exit is always available */
  exitAlwaysAvailable: true,

  /** No confirmation required */
  noConfirmationRequired: true,

  /** No summary on exit */
  noSummaryOnExit: true,

  /** No "are you sure" prompts */
  noAreYouSurePrompts: true,

  /** Notes auto-save silently */
  autoSaveSilently: true,

  /** Exit does not trigger analytics */
  noAnalyticsOnExit: true,
} as const;

/* =========================================================
   XR / UNIVERSE VIEW
   ========================================================= */

/**
 * XR-specific behavior for Narrative Silence Zone.
 */
export const ZONE_XR_BEHAVIOR = {
  /** Appears as a private alcove */
  environmentStyle: 'private-alcove',

  /** Minimal ambient sound */
  ambientSound: 'minimal',

  /** Soft, diffuse lighting */
  lighting: 'soft-diffuse',

  /** No other entities visible */
  otherEntitiesVisible: false,

  /** Notes appear as personal inscriptions */
  noteAppearance: 'personal-inscriptions',

  /** Writing surface is neutral */
  writingSurface: 'neutral',

  /** Time indicators are subtle */
  timeIndicators: 'subtle',
} as const;

/**
 * XR configuration for the zone.
 */
export interface ZoneXRConfig {
  /** Environment opacity (0-1) */
  environmentOpacity: number;

  /** Ambient light level (0-1) */
  ambientLight: number;

  /** Sound reduction level (0-1) */
  soundReduction: number;

  /** Writing surface style */
  surfaceStyle: 'floating' | 'desk' | 'wall' | 'void';

  /** Personal space radius */
  personalSpaceRadius: number;
}

/**
 * Default XR configuration for the zone.
 */
export const DEFAULT_ZONE_XR_CONFIG: ZoneXRConfig = {
  environmentOpacity: 0.2,
  ambientLight: 0.4,
  soundReduction: 0.8,
  surfaceStyle: 'floating',
  personalSpaceRadius: 3.0,
};

/* =========================================================
   STATE
   ========================================================= */

/**
 * Narrative Silence Zone state.
 */
export interface NarrativeSilenceZoneState {
  /** Whether the zone is active */
  active: boolean;

  /** When the zone was entered */
  enteredAt?: string;

  /** Current note being edited (if any) */
  activeNoteId?: string;

  /** Visual silence state reference */
  visualSilenceActive: boolean;

  /** Current attachment target (if any) */
  attachmentTarget?: NoteAssociatedScope;

  /** Zone depth (nested silence levels) */
  depth: number;
}

/**
 * Initial zone state.
 */
export const INITIAL_ZONE_STATE: NarrativeSilenceZoneState = {
  active: false,
  visualSilenceActive: false,
  depth: 0,
};

/* =========================================================
   FAILSAFES
   ========================================================= */

/**
 * Failsafes for Narrative Silence Zone.
 */
export const ZONE_FAILSAFES = {
  /** Zone content is never analyzed */
  neverAnalyzed: true,

  /** Zone sessions are not logged for learning */
  notLoggedForLearning: true,

  /** Zone time is not tracked for metrics */
  notTrackedForMetrics: true,

  /** Zone writing is not pattern-matched */
  notPatternMatched: true,

  /** Zone can always be exited */
  alwaysExitable: true,

  /** Zone state is not used for recommendations */
  notUsedForRecommendations: true,
} as const;

/* =========================================================
   SYSTEM DECLARATION
   ========================================================= */

/**
 * System declaration for Narrative Silence Zone.
 * 
 * Narrative Silence Zone exists to protect
 * the space where meaning is born,
 * before it becomes data.
 * 
 * Expression is private.
 * Reflection is undisturbed.
 * The system witnesses nothing.
 */
export const NARRATIVE_SILENCE_ZONE_DECLARATION = `
Narrative Silence Zone exists to protect
the space where meaning is born,
before it becomes data.

Expression is private.
Reflection is undisturbed.
The system witnesses nothing.
`.trim();

/* =========================================================
   TYPE GUARDS
   ========================================================= */

/**
 * Check if Narrative Silence Zone is active.
 */
export function isZoneActive(state: NarrativeSilenceZoneState): boolean {
  return state.active && state.visualSilenceActive;
}

/**
 * Check if zone can be entered.
 */
export function canEnterZone(
  visualSilenceActive: boolean,
  hasNoteInteraction: boolean
): boolean {
  return visualSilenceActive && hasNoteInteraction;
}

/**
 * Check if currently editing a note in the zone.
 */
export function isEditingInZone(state: NarrativeSilenceZoneState): boolean {
  return state.active && state.activeNoteId !== undefined;
}

/* =========================================================
   EXPORTS
   ========================================================= */

export default NarrativeSilenceZoneState;
