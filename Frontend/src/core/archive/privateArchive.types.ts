/* =====================================================
   CHE·NU — PRIVATE ARCHIVE & EXPORT
   Status: HUMAN-OWNED MEMORY VAULT
   Authority: HUMAN ONLY
   Intent: PRESERVE AND RELEASE MEANING WITHOUT SYSTEM CLAIM
   
   📜 CORE INTENT:
   Private Archive & Export exists to allow humans
   to preserve, retain, and release their data
   without transforming it into system intelligence.
   
   It answers only:
   "What do I want to keep or take with me?"
   
   It NEVER answers:
   "What should be reused?"
   "What value can be extracted?"
   ===================================================== */

/* =========================================================
   OWNERSHIP & RIGHTS
   ========================================================= */

/**
 * Ownership and rights principles.
 * 
 * All archived content is:
 * - Owned by the human author
 * - Private by default
 * - Portable by design
 * 
 * The system holds NO derivative rights.
 */
export const ARCHIVE_OWNERSHIP_RIGHTS = {
  /** Owned by the human author */
  ownedByHumanAuthor: true,

  /** Private by default */
  privateByDefault: true,

  /** Portable by design */
  portableByDesign: true,

  /** System holds NO derivative rights */
  systemDerivativeRights: false,

  /** No intellectual property claims */
  noIPClaims: true,

  /** No usage restrictions post-export */
  noUsageRestrictions: true,
} as const;

/* =========================================================
   ARCHIVABLE CONTENT
   ========================================================= */

/**
 * Content types that MAY be archived.
 * Only human-visible data is allowed.
 */
export const ARCHIVABLE_CONTENT = {
  /** User-Authored Narrative Notes */
  narrativeNotes: true,

  /** Decision Echoes (read-only copies) */
  decisionEchoes: true,

  /** Context Declarations */
  contextDeclarations: true,

  /** Timeline Markers */
  timelineMarkers: true,

  /** Visual Silence Sessions (logs only) */
  visualSilenceSessions: true,

  /** Manual tags or labels added by user */
  manualTagsAndLabels: true,

  /** Personal inscriptions */
  personalInscriptions: true,

  /** Session summaries (user-authored only) */
  userAuthoredSummaries: true,
} as const;

/**
 * Content types that may NOT be archived.
 */
export const NON_ARCHIVABLE_CONTENT = {
  /** Preference models */
  preferenceModels: true,

  /** Drift analytics */
  driftAnalytics: true,

  /** Agent reasoning traces */
  agentReasoningTraces: true,

  /** Optimization metadata */
  optimizationMetadata: true,

  /** System-inferred narratives */
  systemInferredNarratives: true,

  /** Learning data */
  learningData: true,

  /** Behavioral patterns */
  behavioralPatterns: true,

  /** Recommendation models */
  recommendationModels: true,
} as const;

/* =========================================================
   ARCHIVE STRUCTURE
   ========================================================= */

/**
 * Archive structure principles.
 * Archives are human-defined. No enforced hierarchy.
 */
export const ARCHIVE_STRUCTURE_PRINCIPLES = {
  /** Archives are human-defined */
  humanDefined: true,

  /** No enforced hierarchy */
  noEnforcedHierarchy: true,

  /** Flat structure allowed */
  flatStructureAllowed: true,

  /** Nested structure allowed */
  nestedStructureAllowed: true,

  /** Custom naming */
  customNaming: true,

  /** No auto-organization */
  noAutoOrganization: true,
} as const;

/**
 * Example archive structure (for documentation).
 */
export const EXAMPLE_ARCHIVE_STRUCTURE = {
  root: '/',
  directories: [
    'narratives/',
    'decisions/',
    'timelines/',
    'sessions/',
  ],
  files: [
    'tags.json',
    'index.md',
  ],
} as const;

/**
 * Archive directory definition.
 */
export interface ArchiveDirectory {
  /** Directory name */
  name: string;

  /** Parent directory (null for root) */
  parent: string | null;

  /** Creation timestamp */
  createdAt: string;

  /** Human-defined description (optional) */
  description?: string;

  /** Items in directory */
  itemCount: number;
}

/**
 * Archive item definition.
 */
export interface ArchiveItem {
  /** Unique item ID */
  itemId: string;

  /** Item type */
  type: 'note' | 'decision-echo' | 'context' | 'timeline-marker' | 'session-log' | 'tag-file';

  /** Original creation timestamp (preserved) */
  originalTimestamp: string;

  /** Archive timestamp */
  archivedAt: string;

  /** Directory path */
  directoryPath: string;

  /** Item name */
  name: string;

  /** Content reference */
  contentRef: string;

  /** Human-added tags */
  tags?: string[];
}

/* =========================================================
   EXPORT FORMATS
   ========================================================= */

/**
 * Allowed export format type.
 */
export type ExportFormat = 
  | 'txt'      // Plain text
  | 'md'       // Markdown
  | 'json'     // JSON (human-readable)
  | 'pdf'      // PDF (print-safe)
  | 'xr-snapshot'; // XR snapshot (visual only)

/**
 * Allowed export formats.
 * No proprietary formats.
 */
export const ALLOWED_EXPORT_FORMATS: Record<ExportFormat, {
  extension: string;
  mimeType: string;
  description: string;
  humanReadable: boolean;
}> = {
  'txt': {
    extension: '.txt',
    mimeType: 'text/plain',
    description: 'Plain text',
    humanReadable: true,
  },
  'md': {
    extension: '.md',
    mimeType: 'text/markdown',
    description: 'Markdown',
    humanReadable: true,
  },
  'json': {
    extension: '.json',
    mimeType: 'application/json',
    description: 'JSON (human-readable)',
    humanReadable: true,
  },
  'pdf': {
    extension: '.pdf',
    mimeType: 'application/pdf',
    description: 'PDF (print-safe)',
    humanReadable: true,
  },
  'xr-snapshot': {
    extension: '.xrs',
    mimeType: 'application/x-xr-snapshot',
    description: 'XR snapshot (visual only)',
    humanReadable: false,
  },
} as const;

/**
 * Export format restrictions.
 */
export const EXPORT_FORMAT_RESTRICTIONS = {
  /** No proprietary formats */
  noProprietaryFormats: true,

  /** No encrypted formats (unless user chooses) */
  noForcedEncryption: true,

  /** No lossy compression of text */
  noLossyTextCompression: true,

  /** No embedded tracking */
  noEmbeddedTracking: true,
} as const;

/* =========================================================
   EXPORT RULES
   ========================================================= */

/**
 * Export behavior rules.
 * Export is a release, not a sync.
 */
export const EXPORT_RULES = {
  /** Export is manual only */
  manualOnly: true,

  /** No scheduled export */
  noScheduledExport: true,

  /** No automatic backups without consent */
  noAutoBackupsWithoutConsent: true,

  /** Export does not trigger learning */
  noLearningOnExport: true,

  /** Export is a release, not a sync */
  isReleaseNotSync: true,

  /** No re-import suggestions */
  noReImportSuggestions: true,

  /** No export analytics */
  noExportAnalytics: true,
} as const;

/**
 * Export request definition.
 */
export interface ExportRequest {
  /** Unique request ID */
  requestId: string;

  /** Items to export */
  itemIds: string[];

  /** Export format */
  format: ExportFormat;

  /** Include metadata (timestamps, etc.) */
  includeMetadata: boolean;

  /** Requested by */
  requestedBy: string;

  /** Requested at */
  requestedAt: string;
}

/**
 * Export result definition.
 */
export interface ExportResult {
  /** Request ID */
  requestId: string;

  /** Success status */
  success: boolean;

  /** Output file name */
  fileName?: string;

  /** Output size in bytes */
  sizeBytes?: number;

  /** Items exported count */
  itemsExported: number;

  /** Completed at */
  completedAt: string;

  /** Error message (if failed) */
  error?: string;
}

/* =========================================================
   VERSIONING & IMMUTABILITY
   ========================================================= */

/**
 * Versioning and immutability rules.
 * The system does not "clean" meaning.
 */
export const VERSIONING_RULES = {
  /** Original timestamps preserved */
  originalTimestampsPreserved: true,

  /** No auto-merging */
  noAutoMerging: true,

  /** No normalization */
  noNormalization: true,

  /** No conflict resolution imposed */
  noConflictResolutionImposed: true,

  /** System does not "clean" meaning */
  noMeaningCleaning: true,

  /** No format conversion without consent */
  noFormatConversionWithoutConsent: true,
} as const;

/* =========================================================
   VISUAL & UX RULES
   ========================================================= */

/**
 * Visual and UX rules for archive access.
 */
export const ARCHIVE_UX_RULES = {
  /** Must feel calm */
  feelsCalm: true,

  /** Avoid dashboards */
  avoidDashboards: true,

  /** Avoid stats or counts */
  avoidStatsOrCounts: true,

  /** Avoid performance framing */
  avoidPerformanceFraming: true,

  /** Export actions are quiet */
  exportActionsQuiet: true,

  /** Export actions are explicit */
  exportActionsExplicit: true,

  /** No gamification */
  noGamification: true,

  /** No progress indicators for archive size */
  noArchiveSizeProgress: true,
} as const;

/**
 * Archive UI configuration.
 */
export interface ArchiveUIConfig {
  /** Color scheme */
  colorScheme: 'muted' | 'neutral' | 'warm';

  /** Animation level */
  animationLevel: 'none' | 'minimal';

  /** Typography style */
  typographyStyle: 'calm' | 'neutral';

  /** Icon density */
  iconDensity: 'minimal' | 'sparse';

  /** Show timestamps */
  showTimestamps: boolean;

  /** Show item counts */
  showItemCounts: boolean;
}

/**
 * Default archive UI configuration.
 */
export const DEFAULT_ARCHIVE_UI_CONFIG: ArchiveUIConfig = {
  colorScheme: 'muted',
  animationLevel: 'none',
  typographyStyle: 'calm',
  iconDensity: 'minimal',
  showTimestamps: true,
  showItemCounts: false,
};

/* =========================================================
   XR / UNIVERSE VIEW
   ========================================================= */

/**
 * XR-specific behavior for archive.
 * 
 * Export is represented as opening a passage,
 * not copying data.
 */
export const ARCHIVE_XR_BEHAVIOR = {
  /** Archive appears as a stable repository space */
  appearsAs: 'stable-repository-space',

  /** Items are static */
  itemsAreStatic: true,

  /** No agents present */
  noAgentsPresent: true,

  /** Export represented as opening a passage */
  exportMetaphor: 'opening-passage',

  /** Not represented as copying data */
  notCopyingData: true,

  /** Environment is peaceful */
  environmentPeaceful: true,

  /** Time flows slowly */
  timeFlowsSlow: true,
} as const;

/**
 * XR archive configuration.
 */
export interface ArchiveXRConfig {
  /** Space style */
  spaceStyle: 'library' | 'vault' | 'garden' | 'void';

  /** Ambient lighting */
  ambientLighting: number;

  /** Item presentation */
  itemPresentation: 'floating' | 'shelved' | 'scattered';

  /** Interaction style */
  interactionStyle: 'touch' | 'gaze' | 'voice';
}

/**
 * Default XR archive configuration.
 */
export const DEFAULT_ARCHIVE_XR_CONFIG: ArchiveXRConfig = {
  spaceStyle: 'library',
  ambientLighting: 0.5,
  itemPresentation: 'shelved',
  interactionStyle: 'touch',
};

/* =========================================================
   FAILSAFES
   ========================================================= */

/**
 * Failsafes for Private Archive & Export.
 */
export const ARCHIVE_FAILSAFES = {
  /** Archived items are excluded from learning */
  excludedFromLearning: true,

  /** Exported data is never re-ingested automatically */
  neverAutoReingested: true,

  /** Deletion is irreversible */
  deletionIrreversible: true,

  /** Deletion is silent */
  deletionSilent: true,

  /** Archive access leaves minimal logs */
  minimalAccessLogs: true,

  /** No archive usage analytics */
  noUsageAnalytics: true,

  /** No export destination tracking */
  noExportDestinationTracking: true,
} as const;

/* =========================================================
   SYSTEM DECLARATION
   ========================================================= */

/**
 * System declaration for Private Archive & Export.
 * 
 * Private Archive & Export exists to ensure
 * that memory belongs to its author,
 * not to the system that hosted it.
 * 
 * Retention is human.
 * Release is human.
 * Meaning remains sovereign.
 */
export const PRIVATE_ARCHIVE_DECLARATION = `
Private Archive & Export exists to ensure
that memory belongs to its author,
not to the system that hosted it.

Retention is human.
Release is human.
Meaning remains sovereign.
`.trim();

/* =========================================================
   ARCHIVE STATE
   ========================================================= */

/**
 * Archive state.
 */
export interface ArchiveState {
  /** Root directories */
  directories: ArchiveDirectory[];

  /** Archived items */
  items: ArchiveItem[];

  /** Pending exports */
  pendingExports: ExportRequest[];

  /** Last accessed (optional, minimal logging) */
  lastAccessed?: string;
}

/**
 * Initial archive state.
 */
export const INITIAL_ARCHIVE_STATE: ArchiveState = {
  directories: [],
  items: [],
  pendingExports: [],
};

/* =========================================================
   FACTORY FUNCTIONS
   ========================================================= */

/**
 * Create an archive directory.
 */
export function createArchiveDirectory(
  name: string,
  parent: string | null = null,
  description?: string
): ArchiveDirectory {
  return {
    name,
    parent,
    createdAt: new Date().toISOString(),
    description,
    itemCount: 0,
  };
}

/**
 * Create an archive item.
 */
export function createArchiveItem(
  type: ArchiveItem['type'],
  name: string,
  contentRef: string,
  originalTimestamp: string,
  directoryPath: string = '/'
): ArchiveItem {
  return {
    itemId: `archive_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    type,
    name,
    contentRef,
    originalTimestamp,
    archivedAt: new Date().toISOString(),
    directoryPath,
  };
}

/**
 * Create an export request.
 */
export function createExportRequest(
  itemIds: string[],
  format: ExportFormat,
  requestedBy: string,
  includeMetadata: boolean = true
): ExportRequest {
  return {
    requestId: `export_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    itemIds,
    format,
    includeMetadata,
    requestedBy,
    requestedAt: new Date().toISOString(),
  };
}

/* =========================================================
   TYPE GUARDS
   ========================================================= */

/**
 * Check if content type is archivable.
 */
export function isArchivable(contentType: string): boolean {
  return contentType in ARCHIVABLE_CONTENT;
}

/**
 * Check if format is allowed for export.
 */
export function isExportFormatAllowed(format: string): format is ExportFormat {
  return format in ALLOWED_EXPORT_FORMATS;
}

/* =========================================================
   EXPORTS
   ========================================================= */

export default ArchiveState;
