/* =====================================================
   CHE·NU — USER-AUTHORED NARRATIVE NOTES
   Status: HUMAN EXPRESSION LAYER
   Authority: HUMAN ONLY
   Intent: CAPTURE MEANING WITHOUT INFERENCE
   
   📜 CORE INTENT:
   User-Authored Narrative Notes exist to allow a human
   to write their own understanding, reflection, or meaning
   about events, without being interpreted, analyzed,
   or repurposed by the system.
   
   They answer only:
   "What do I want to express or remember?"
   
   They NEVER answer:
   "What should the system learn?"
   "What pattern does this represent?"
   ===================================================== */

/* =========================================================
   POSITION IN ARCHITECTURE
   ========================================================= */

/**
 * Architecture position of User-Authored Narrative Notes.
 * 
 * Human Expression
 *         ↓
 * USER-AUTHORED NARRATIVE NOTES
 *         ↓
 * Human Reading ONLY
 * 
 * NO connection to:
 * - Learning systems
 * - Preference models
 * - Context interpretation
 * - Orchestration
 * - Analytics
 */
export const NARRATIVE_NOTES_ARCHITECTURE = {
  /** Input: Human Expression only */
  input: 'human-expression',

  /** Output: Human Reading only */
  output: 'human-reading',

  /** NO connection to learning systems */
  connectedToLearning: false,

  /** NO connection to preference models */
  connectedToPreferences: false,

  /** NO connection to context interpretation */
  connectedToContextInterpretation: false,

  /** NO connection to orchestration */
  connectedToOrchestration: false,

  /** NO connection to analytics */
  connectedToAnalytics: false,
} as const;

/* =========================================================
   OWNERSHIP & CONTROL
   ========================================================= */

/**
 * Ownership and control rules.
 */
export const NARRATIVE_NOTES_OWNERSHIP = {
  /** Notes are authored by humans only */
  authoredByHumansOnly: true,

  /** Notes are owned by the author */
  ownedByAuthor: true,

  /** Notes are private by default */
  privateByDefault: true,

  /** Sharing is explicit and optional */
  sharingExplicitAndOptional: true,
} as const;

/**
 * What NO system component may do with notes.
 */
export const SYSTEM_MAY_NOT = {
  /** Summarize notes */
  summarizeNotes: true,

  /** Analyze sentiment */
  analyzeSentiment: true,

  /** Extract signals */
  extractSignals: true,

  /** Generate insights */
  generateInsights: true,

  /** Mine notes */
  mineNotes: true,

  /** Auto-reference notes */
  autoReferenceNotes: true,

  /** Pattern analyze */
  patternAnalyze: true,

  /** Compare historically */
  compareHistorically: true,
} as const;

/* =========================================================
   NOTE TYPES (NON-HIERARCHICAL)
   ========================================================= */

/**
 * Note label types.
 * Labels are for organization ONLY.
 * They are NON-HIERARCHICAL.
 */
export type NoteLabel =
  | 'reflection'
  | 'observation'
  | 'intention'
  | 'reminder'
  | 'question'
  | 'insight'
  | 'narrative'
  | string; // Custom labels allowed

/**
 * Note visibility options.
 */
export type NoteVisibility = 'private' | 'shared';

/* =========================================================
   DATA MODEL
   ========================================================= */

/**
 * Time range for note association.
 */
export interface TimeRange {
  /** Start of range */
  start: string;
  /** End of range */
  end: string;
}

/**
 * Associated scope for a note.
 * Attachment is SPATIAL, not LOGICAL.
 */
export interface NoteAssociatedScope {
  /** Decision ID (optional) */
  decisionId?: string;

  /** Context ID (optional) */
  contextId?: string;

  /** Narrative ID (optional) */
  narrativeId?: string;

  /** Timeline segment (optional) */
  timelineSegmentId?: string;

  /** Decision Echo (optional) */
  decisionEchoId?: string;

  /** Timeframe (optional) */
  timeframe?: TimeRange;

  /** Sphere ID (optional) */
  sphereId?: string;
}

/**
 * User-Authored Narrative Note.
 * 
 * The core data structure for human expression.
 */
export interface UserNarrativeNote {
  /** Unique note ID */
  noteId: string;

  /** Author ID (human only) */
  authorId: string;

  /** Creation timestamp */
  createdAt: string;

  /** Last modified timestamp */
  modifiedAt?: string;

  /** Associated scope (spatial attachment) */
  associatedScope?: NoteAssociatedScope;

  /** Optional label (for organization only) */
  label?: NoteLabel;

  /** Note content (plain text) */
  content: string;

  /** Visibility setting */
  visibility: NoteVisibility;

  /** Notes are NOT immutable - can be edited */
  immutable: false;

  /** Prior versions (optional, user choice) */
  priorVersions?: NoteVersion[];
}

/**
 * Note version (for optional history).
 */
export interface NoteVersion {
  /** Version timestamp */
  timestamp: string;

  /** Content at this version */
  content: string;

  /** Label at this version */
  label?: NoteLabel;
}

/* =========================================================
   EDITING RULES
   ========================================================= */

/**
 * Editing rules for narrative notes.
 * Editing is NON-ANALYTICAL.
 */
export const EDITING_RULES = {
  /** Notes may be edited by the author */
  editableByAuthor: true,

  /** Prior versions may be kept (optional) */
  priorVersionsOptional: true,

  /** No forced versioning */
  noForcedVersioning: true,

  /** No comparison prompts */
  noComparisonPrompts: true,

  /** Editing is non-analytical */
  editingNonAnalytical: true,
} as const;

/* =========================================================
   INTERACTION & PRESENTATION
   ========================================================= */

/**
 * How notes are presented.
 */
export const NOTE_PRESENTATION = {
  /** Presented as plain text */
  format: 'plain-text',

  /** No highlights */
  highlights: false,

  /** No emphasis */
  emphasis: false,

  /** No scoring */
  scoring: false,

  /** No color semantics */
  colorSemantics: false,
} as const;

/**
 * What user MAY do with notes.
 */
export const USER_NOTE_PERMISSIONS = {
  /** Write */
  write: true,

  /** Re-read */
  reread: true,

  /** Hide */
  hide: true,

  /** Export */
  export: true,

  /** Delete */
  delete: true,
} as const;

/**
 * What system must NOT do.
 */
export const SYSTEM_NOTE_RESTRICTIONS = {
  /** Suggest edits */
  suggestEdits: false,

  /** Prompt reflection */
  promptReflection: false,

  /** Recommend writing */
  recommendWriting: false,

  /** Auto-categorize */
  autoCategorize: false,

  /** Generate summaries */
  generateSummaries: false,
} as const;

/* =========================================================
   RELATION TO OTHER SYSTEMS
   ========================================================= */

/**
 * What notes may be attached to (spatial only).
 */
export const NOTES_MAY_ATTACH_TO = {
  /** Decision Echoes */
  decisionEchoes: true,

  /** Narratives */
  narratives: true,

  /** Timeline segments */
  timelineSegments: true,

  /** Contexts */
  contexts: true,

  /** Spheres */
  spheres: true,
} as const;

/**
 * What notes do NOT influence.
 */
export const NOTES_DO_NOT_INFLUENCE = {
  /** Drift detection */
  driftDetection: true,

  /** Preferences */
  preferences: true,

  /** Context selection */
  contextSelection: true,

  /** Agent behavior */
  agentBehavior: true,

  /** Orchestration */
  orchestration: true,

  /** Learning systems */
  learningSystems: true,
} as const;

/**
 * Attachment type clarification.
 * Attachment is SPATIAL, not LOGICAL.
 */
export const ATTACHMENT_PRINCIPLE = {
  /** Attachment is spatial */
  isSpatial: true,

  /** Attachment is NOT logical */
  isLogical: false,

  /** No inference from attachment */
  noInferenceFromAttachment: true,

  /** No causality implied */
  noCausalityImplied: true,
} as const;

/* =========================================================
   XR / UNIVERSE VIEW
   ========================================================= */

/**
 * XR-specific behavior for narrative notes.
 * 
 * The environment receives the note;
 * the system does not.
 */
export const NOTES_XR_BEHAVIOR = {
  /** Notes appear as personal inscriptions */
  appearAsPersonalInscriptions: true,

  /** Visible only to author unless shared */
  visibleOnlyToAuthorUnlessShared: true,

  /** No system overlays on notes */
  noSystemOverlays: true,

  /** Environment receives the note */
  environmentReceivesNote: true,

  /** System does NOT receive the note */
  systemReceivesNote: false,
} as const;

/**
 * XR note presentation configuration.
 */
export interface NoteXRConfig {
  /** Inscription style */
  inscriptionStyle: 'floating-text' | 'plaque' | 'scroll' | 'stone';

  /** Opacity when not focused */
  unfocusedOpacity: number;

  /** Scale factor */
  scale: number;

  /** Distance from attachment point */
  attachmentDistance: number;

  /** Glow effect (subtle, personal) */
  personalGlow: boolean;
}

/**
 * Default XR note configuration.
 */
export const DEFAULT_NOTE_XR_CONFIG: NoteXRConfig = {
  inscriptionStyle: 'floating-text',
  unfocusedOpacity: 0.6,
  scale: 1.0,
  attachmentDistance: 0.5,
  personalGlow: true,
};

/* =========================================================
   FAILSAFES
   ========================================================= */

/**
 * Failsafes for narrative notes.
 */
export const NARRATIVE_NOTES_FAILSAFES = {
  /** Notes are never mined */
  neverMined: true,

  /** Notes are never auto-referenced */
  neverAutoReferenced: true,

  /** Notes are never required */
  neverRequired: true,

  /** Notes generate no alerts */
  generateNoAlerts: true,

  /** If ambiguity arises, system remains silent */
  onAmbiguitySystemRemainsSilent: true,
} as const;

/* =========================================================
   SYSTEM DECLARATION
   ========================================================= */

/**
 * System declaration for User-Authored Narrative Notes.
 * 
 * User-Authored Narrative Notes preserve human meaning
 * without converting it into system logic.
 * 
 * Expression remains human.
 * Interpretation remains human.
 * Memory remains owned.
 */
export const NARRATIVE_NOTES_DECLARATION = `
User-Authored Narrative Notes preserve human meaning
without converting it into system logic.

Expression remains human.
Interpretation remains human.
Memory remains owned.
`.trim();

/* =========================================================
   FACTORY FUNCTIONS
   ========================================================= */

/**
 * Create a new narrative note.
 */
export function createNarrativeNote(
  authorId: string,
  content: string,
  options?: {
    label?: NoteLabel;
    visibility?: NoteVisibility;
    associatedScope?: NoteAssociatedScope;
  }
): UserNarrativeNote {
  return {
    noteId: `note_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    authorId,
    createdAt: new Date().toISOString(),
    content,
    visibility: options?.visibility ?? 'private',
    label: options?.label,
    associatedScope: options?.associatedScope,
    immutable: false,
  };
}

/**
 * Create an empty note state.
 */
export function createEmptyNote(authorId: string): Partial<UserNarrativeNote> {
  return {
    authorId,
    content: '',
    visibility: 'private',
    immutable: false,
  };
}

/* =========================================================
   TYPE GUARDS
   ========================================================= */

/**
 * Check if a note is private.
 */
export function isPrivateNote(note: UserNarrativeNote): boolean {
  return note.visibility === 'private';
}

/**
 * Check if a note is shared.
 */
export function isSharedNote(note: UserNarrativeNote): boolean {
  return note.visibility === 'shared';
}

/**
 * Check if a note has an associated scope.
 */
export function hasAssociatedScope(note: UserNarrativeNote): boolean {
  return note.associatedScope !== undefined;
}

/**
 * Check if a note is attached to a decision echo.
 */
export function isAttachedToDecisionEcho(note: UserNarrativeNote): boolean {
  return note.associatedScope?.decisionEchoId !== undefined;
}

/* =========================================================
   EXPORTS
   ========================================================= */

export default UserNarrativeNote;
