/* =====================================================
   CHE·NU — USER-AUTHORED NARRATIVE NOTES MODULE
   Status: HUMAN EXPRESSION LAYER
   Authority: HUMAN ONLY
   Intent: CAPTURE MEANING WITHOUT INFERENCE
   ===================================================== */

// === TYPES ===
export {
  // Core types
  type NoteLabel,
  type NoteVisibility,
  type TimeRange,
  type NoteAssociatedScope,
  type UserNarrativeNote,
  type NoteVersion,
  type NoteXRConfig,

  // Architecture & Ownership
  NARRATIVE_NOTES_ARCHITECTURE,
  NARRATIVE_NOTES_OWNERSHIP,

  // System Restrictions
  SYSTEM_MAY_NOT,

  // Editing Rules
  EDITING_RULES,

  // Presentation
  NOTE_PRESENTATION,
  USER_NOTE_PERMISSIONS,
  SYSTEM_NOTE_RESTRICTIONS,

  // Relations
  NOTES_MAY_ATTACH_TO,
  NOTES_DO_NOT_INFLUENCE,
  ATTACHMENT_PRINCIPLE,

  // XR
  NOTES_XR_BEHAVIOR,
  DEFAULT_NOTE_XR_CONFIG,

  // Failsafes
  NARRATIVE_NOTES_FAILSAFES,

  // Declaration
  NARRATIVE_NOTES_DECLARATION,

  // Factory functions
  createNarrativeNote,
  createEmptyNote,

  // Type guards
  isPrivateNote,
  isSharedNote,
  hasAssociatedScope,
  isAttachedToDecisionEcho,
} from './narrativeNotes.types';

// Future: Store and UI components
// export { useNarrativeNotes } from './useNarrativeNotes';
// export { NarrativeNoteEditor } from './NarrativeNoteEditor';
// export { NarrativeNoteView } from './NarrativeNoteView';
