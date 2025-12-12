/* =====================================================
   CHE·NU — PRIVATE ARCHIVE & EXPORT MODULE
   Status: HUMAN-OWNED MEMORY VAULT
   Authority: HUMAN ONLY
   Intent: PRESERVE AND RELEASE MEANING WITHOUT SYSTEM CLAIM
   ===================================================== */

// === TYPES ===
export {
  // Content rules
  ARCHIVE_OWNERSHIP_RIGHTS,
  ARCHIVABLE_CONTENT,
  NON_ARCHIVABLE_CONTENT,

  // Structure
  ARCHIVE_STRUCTURE_PRINCIPLES,
  EXAMPLE_ARCHIVE_STRUCTURE,
  type ArchiveDirectory,
  type ArchiveItem,

  // Export
  type ExportFormat,
  ALLOWED_EXPORT_FORMATS,
  EXPORT_FORMAT_RESTRICTIONS,
  EXPORT_RULES,
  type ExportRequest,
  type ExportResult,

  // Versioning
  VERSIONING_RULES,

  // UX
  ARCHIVE_UX_RULES,
  type ArchiveUIConfig,
  DEFAULT_ARCHIVE_UI_CONFIG,

  // XR
  ARCHIVE_XR_BEHAVIOR,
  type ArchiveXRConfig,
  DEFAULT_ARCHIVE_XR_CONFIG,

  // Failsafes
  ARCHIVE_FAILSAFES,

  // Declaration
  PRIVATE_ARCHIVE_DECLARATION,

  // State
  type ArchiveState,
  INITIAL_ARCHIVE_STATE,

  // Factory functions
  createArchiveDirectory,
  createArchiveItem,
  createExportRequest,

  // Type guards
  isArchivable,
  isExportFormatAllowed,
} from './privateArchive.types';

// Future: Engine and UI components
// export { ArchiveEngine } from './archiveEngine';
// export { ArchiveView } from './ArchiveView';
// export { ExportDialog } from './ExportDialog';
