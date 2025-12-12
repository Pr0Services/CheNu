/* =====================================================
   CHE·NU — LEGACY / INHERITANCE MODE
   Status: HUMAN CONTINUITY & RESPONSIBILITY TRANSFER
   Authority: HUMAN ONLY (ORIGINATOR)
   Intent: PRESERVE MEANING WITHOUT CONTROL
   
   📜 CORE INTENT:
   Legacy / Inheritance Mode exists to allow a human
   to consciously prepare, shape, and transmit
   parts of their CHE·NU environment to others
   without imposing authority, intent, or direction.
   
   It answers only:
   "What do I choose to pass on?"
   
   It NEVER answers:
   "How should others act?"
   "What must be continued?"
   "What outcomes should be achieved?"
   
   🌍 PHILOSOPHY:
   On s'unit pour mieux construire — le contraire de diviser pour régner!
   L'humanité mérite de vivre dans l'intégrité sociétaire!
   ===================================================== */

/* =========================================================
   FUNDAMENTAL PRINCIPLE
   ========================================================= */

/**
 * Fundamental principle of Legacy / Inheritance.
 * 
 * Inheritance is not succession.
 * Legacy is not obligation.
 * 
 * Recipients receive visibility and context,
 * not mandates.
 */
export const LEGACY_FUNDAMENTAL_PRINCIPLE = {
  /** Inheritance is not succession */
  inheritanceIsNotSuccession: true,

  /** Legacy is not obligation */
  legacyIsNotObligation: true,

  /** Recipients receive visibility and context */
  recipientsReceive: ['visibility', 'context'],

  /** Recipients do NOT receive mandates */
  recipientsDoNotReceive: ['mandates', 'authority', 'obligations'],

  /** Philosophy */
  philosophy: "On s'unit pour mieux construire — le contraire de diviser pour régner!",
} as const;

/* =========================================================
   POSITION IN ARCHITECTURE
   ========================================================= */

/**
 * Architecture position - deliberate human-controlled flow.
 * 
 * Human Declaration
 *         ↓
 * LEGACY SELECTION & FRAMING
 *         ↓
 * READ-ONLY / LIMITED-RIGHTS BUNDLE
 *         ↓
 * Recipient Interpretation
 */
export const ARCHITECTURE_POSITION = {
  /** Step 1: Human Declaration */
  step1: 'human-declaration',

  /** Step 2: Legacy Selection & Framing */
  step2: 'legacy-selection-and-framing',

  /** Step 3: Read-only / Limited-rights Bundle */
  step3: 'read-only-limited-rights-bundle',

  /** Step 4: Recipient Interpretation */
  step4: 'recipient-interpretation',

  /** No automatic activation */
  noAutomaticActivation: true,

  /** No agent transfer */
  noAgentTransfer: true,

  /** No orchestration continuity */
  noOrchestrationContinuity: true,
} as const;

/* =========================================================
   WHAT CAN BE PASSED ON
   ========================================================= */

/**
 * Items that a human MAY choose to pass on.
 */
export const CAN_BE_PASSED_ON = {
  /** Narrative Notes (selected) */
  narrativeNotes: true,

  /** Decision Echoes (selected, read-only) */
  decisionEchoes: true,

  /** Context declarations (historic) */
  contextDeclarations: true,

  /** Timelines (partial or full) */
  timelines: true,

  /** Structural maps (tree, spheres, flows) */
  structuralMaps: true,

  /** Methodological descriptions */
  methodologicalDescriptions: true,
} as const;

/**
 * Type for passable content categories.
 */
export type PassableContentType =
  | 'narrative-notes'
  | 'decision-echoes'
  | 'context-declarations'
  | 'timelines'
  | 'structural-maps'
  | 'methodological-descriptions';

/* =========================================================
   WHAT CANNOT BE PASSED ON
   ========================================================= */

/**
 * Items explicitly FORBIDDEN from inheritance.
 * 
 * Legacy never includes leverage.
 */
export const CANNOT_BE_PASSED_ON = {
  /** Preference models */
  preferenceModels: false,

  /** Drift histories */
  driftHistories: false,

  /** Agent memories */
  agentMemories: false,

  /** Behavioral profiles */
  behavioralProfiles: false,

  /** Optimization logic */
  optimizationLogic: false,

  /** Authority bindings */
  authorityBindings: false,

  /** Principle: Legacy never includes leverage */
  legacyNeverIncludesLeverage: true,
} as const;

/**
 * Forbidden content types (for validation).
 */
export const FORBIDDEN_CONTENT_TYPES = [
  'preference-models',
  'drift-histories',
  'agent-memories',
  'behavioral-profiles',
  'optimization-logic',
  'authority-bindings',
] as const;

export type ForbiddenContentType = typeof FORBIDDEN_CONTENT_TYPES[number];

/* =========================================================
   INHERITANCE MODES
   ========================================================= */

/**
 * The originator may choose one of three inheritance modes.
 * No default is assumed.
 */
export const INHERITANCE_MODES = {
  /**
   * A) Archive Inheritance
   * - Static snapshot
   * - No evolution
   */
  archive: {
    id: 'archive',
    name: 'Archive Inheritance',
    description: 'Static snapshot, no evolution',
    isStatic: true,
    hasEvolution: false,
    hasCommentary: false,
  },

  /**
   * B) Guided Legacy
   * - Includes author commentary
   * - No system guidance
   */
  guided: {
    id: 'guided',
    name: 'Guided Legacy',
    description: 'Includes author commentary, no system guidance',
    isStatic: false,
    hasEvolution: false,
    hasCommentary: true,
  },

  /**
   * C) Silent Legacy
   * - No commentary
   * - Pure record
   */
  silent: {
    id: 'silent',
    name: 'Silent Legacy',
    description: 'No commentary, pure record',
    isStatic: true,
    hasEvolution: false,
    hasCommentary: false,
  },
} as const;

export type InheritanceModeId = keyof typeof INHERITANCE_MODES;

export interface InheritanceMode {
  id: InheritanceModeId;
  name: string;
  description: string;
  isStatic: boolean;
  hasEvolution: boolean;
  hasCommentary: boolean;
}

/* =========================================================
   FRAMING & DISCLAIMERS (MANDATORY)
   ========================================================= */

/**
 * Each legacy bundle MUST include these elements.
 * Disclaimers cannot be removed.
 */
export const MANDATORY_FRAMING = {
  /** Author identity required */
  authorIdentityRequired: true,

  /** Timeframe covered required */
  timeframeCoveredRequired: true,

  /** Explicit disclaimer required */
  disclaimerRequired: true,

  /** Disclaimers cannot be removed */
  disclaimersImmutable: true,
} as const;

/**
 * Mandatory disclaimer text.
 */
export const MANDATORY_DISCLAIMER = 
  "This does not prescribe action or belief.";

/**
 * Legacy framing structure.
 */
export interface LegacyFraming {
  /** Author identity */
  authorId: string;
  authorName?: string;

  /** Timeframe covered */
  timeframe: {
    start: string;
    end: string;
  };

  /** Mandatory disclaimer (immutable) */
  disclaimer: typeof MANDATORY_DISCLAIMER;

  /** Optional author commentary (for guided mode) */
  authorCommentary?: string;

  /** Creation timestamp */
  createdAt: string;
}

/* =========================================================
   RECIPIENT EXPERIENCE
   ========================================================= */

/**
 * What recipients MAY do.
 */
export const RECIPIENT_MAY = {
  /** Read */
  read: true,

  /** Browse */
  browse: true,

  /** Export */
  export: true,

  /** Reflect */
  reflect: true,
} as const;

/**
 * What recipients may NOT do.
 * Legacy is informational, not operational.
 */
export const RECIPIENT_MAY_NOT = {
  /** Activate agents */
  activateAgents: false,

  /** Trigger workflows */
  triggerWorkflows: false,

  /** Inherit decisions */
  inheritDecisions: false,

  /** Continue timelines as authority */
  continueTimelinesAsAuthority: false,

  /** Principle: Legacy is informational, not operational */
  legacyIsInformationalNotOperational: true,
} as const;

/* =========================================================
   TEMPORAL SEPARATION RULE
   ========================================================= */

/**
 * A legacy bundle is temporally sealed.
 * Recipients cannot modify the original.
 */
export const TEMPORAL_SEPARATION_RULE = {
  /** Legacy bundle is temporally sealed */
  isTemporallySealed: true,

  /** Recipients cannot append to original timelines */
  cannotAppendToTimelines: true,

  /** Recipients cannot modify decision echoes */
  cannotModifyDecisionEchoes: true,

  /** Recipients cannot extend narratives as continuation */
  cannotExtendNarratives: true,

  /** Recipients may only create their own */
  mayOnlyCreateOwn: true,
} as const;

/* =========================================================
   XR / UNIVERSE VIEW
   ========================================================= */

/**
 * XR-specific behavior.
 * A monument, not a machine.
 */
export const XR_BEHAVIOR = {
  /** Legacy appears as a preserved structure */
  appearsAsPreservedStructure: true,

  /** No active systems */
  noActiveSystems: true,

  /** No living agents */
  noLivingAgents: true,

  /** Visualization metaphor: A monument, not a machine */
  metaphor: 'monument-not-machine',
} as const;

/**
 * XR configuration for legacy viewing.
 */
export interface LegacyXRConfig {
  /** Visual style */
  visualStyle: 'monument' | 'archive' | 'garden' | 'constellation';

  /** Ambient lighting */
  ambientLighting: 'warm' | 'neutral' | 'cool';

  /** Interactivity level */
  interactivity: 'view-only' | 'browse' | 'explore';

  /** Show author presence indicator */
  showAuthorPresence: boolean;

  /** Temporal visualization */
  temporalVisualization: 'layered' | 'linear' | 'scattered';
}

/**
 * Default XR configuration.
 */
export const DEFAULT_LEGACY_XR_CONFIG: LegacyXRConfig = {
  visualStyle: 'monument',
  ambientLighting: 'warm',
  interactivity: 'browse',
  showAuthorPresence: true,
  temporalVisualization: 'layered',
};

/* =========================================================
   FAILSAFES
   ========================================================= */

/**
 * Failsafes for Legacy / Inheritance Mode.
 * The act must be deliberate.
 */
export const FAILSAFES = {
  /** Inheritance cannot be triggered by agents */
  cannotBeTriggeredByAgents: true,

  /** Cannot be automated */
  cannotBeAutomated: true,

  /** Cannot be conditional */
  cannotBeConditional: true,

  /** Cannot be revoked retroactively */
  cannotBeRevokedRetroactively: true,

  /** The act must be deliberate */
  mustBeDeliberate: true,
} as const;

/* =========================================================
   LEGACY BUNDLE STRUCTURE
   ========================================================= */

/**
 * A complete legacy bundle.
 */
export interface LegacyBundle {
  /** Unique identifier */
  id: string;

  /** Bundle version */
  version: string;

  /** Framing (mandatory) */
  framing: LegacyFraming;

  /** Inheritance mode chosen */
  inheritanceMode: InheritanceModeId;

  /** Content items */
  content: {
    narrativeNotes?: LegacyNarrativeNote[];
    decisionEchoes?: LegacyDecisionEcho[];
    contextDeclarations?: LegacyContextDeclaration[];
    timelines?: LegacyTimeline[];
    structuralMaps?: LegacyStructuralMap[];
    methodologicalDescriptions?: LegacyMethodology[];
  };

  /** Recipients (if specified) */
  recipients?: LegacyRecipient[];

  /** Creation metadata */
  createdAt: string;
  sealedAt: string;

  /** Read-only flag (always true for sealed bundles) */
  readonly: true;
}

/**
 * Legacy content item (narrative note).
 */
export interface LegacyNarrativeNote {
  id: string;
  content: string;
  timestamp: string;
  authorCommentary?: string;
}

/**
 * Legacy content item (decision echo).
 */
export interface LegacyDecisionEcho {
  id: string;
  title: string;
  timestamp: string;
  context?: string;
  readonly: true;
}

/**
 * Legacy content item (context declaration).
 */
export interface LegacyContextDeclaration {
  id: string;
  declaration: string;
  timestamp: string;
  scope: string;
}

/**
 * Legacy content item (timeline).
 */
export interface LegacyTimeline {
  id: string;
  name: string;
  timeRange: { start: string; end: string };
  events: Array<{ timestamp: string; description: string }>;
  isPartial: boolean;
}

/**
 * Legacy content item (structural map).
 */
export interface LegacyStructuralMap {
  id: string;
  type: 'tree' | 'spheres' | 'flows';
  name: string;
  structure: Record<string, unknown>;
}

/**
 * Legacy content item (methodology).
 */
export interface LegacyMethodology {
  id: string;
  name: string;
  description: string;
  principles?: string[];
}

/**
 * Legacy recipient.
 */
export interface LegacyRecipient {
  id: string;
  name?: string;
  email?: string;
  accessLevel: 'read' | 'browse' | 'export';
  addedAt: string;
}

/* =========================================================
   ETHICAL DECLARATION
   ========================================================= */

/**
 * Ethical declaration for Legacy / Inheritance Mode.
 * 
 * Legacy / Inheritance Mode exists to ensure
 * that continuity never becomes control.
 * 
 * Wisdom may be shared.
 * Authority must not be inherited.
 * 
 * The future remains sovereign.
 */
export const ETHICAL_DECLARATION = `
Legacy / Inheritance Mode exists to ensure
that continuity never becomes control.

Wisdom may be shared.
Authority must not be inherited.

The future remains sovereign.
`.trim();

/**
 * Extended philosophy statement.
 */
export const PHILOSOPHY_STATEMENT = `
On s'unit pour mieux construire — le contraire de diviser pour régner!
L'humanité mérite de vivre dans l'intégrité sociétaire!

We unite to build better — the opposite of divide and conquer!
Humanity deserves to live in societal integrity!
`.trim();

/* =========================================================
   TYPE GUARDS & HELPERS
   ========================================================= */

/**
 * Check if content type can be passed on.
 */
export function canBePassedOn(contentType: string): boolean {
  const passable: string[] = [
    'narrative-notes',
    'decision-echoes',
    'context-declarations',
    'timelines',
    'structural-maps',
    'methodological-descriptions',
  ];
  return passable.includes(contentType);
}

/**
 * Check if content type is forbidden.
 */
export function isForbiddenContent(contentType: string): boolean {
  return (FORBIDDEN_CONTENT_TYPES as readonly string[]).includes(contentType);
}

/**
 * Validate legacy bundle structure.
 */
export function isValidLegacyBundle(bundle: unknown): bundle is LegacyBundle {
  if (!bundle || typeof bundle !== 'object') return false;
  const b = bundle as Record<string, unknown>;
  
  return (
    typeof b.id === 'string' &&
    typeof b.version === 'string' &&
    b.framing !== undefined &&
    typeof b.inheritanceMode === 'string' &&
    b.readonly === true
  );
}

/**
 * Create empty legacy bundle (for originator to fill).
 */
export function createLegacyBundle(
  authorId: string,
  inheritanceMode: InheritanceModeId,
  timeframe: { start: string; end: string }
): Omit<LegacyBundle, 'sealedAt'> {
  const now = new Date().toISOString();
  
  return {
    id: `legacy_${Date.now()}`,
    version: '1.0.0',
    framing: {
      authorId,
      timeframe,
      disclaimer: MANDATORY_DISCLAIMER,
      createdAt: now,
    },
    inheritanceMode,
    content: {},
    createdAt: now,
    readonly: true,
  };
}

/**
 * Seal a legacy bundle (makes it immutable).
 */
export function sealLegacyBundle(
  bundle: Omit<LegacyBundle, 'sealedAt'>
): LegacyBundle {
  return {
    ...bundle,
    sealedAt: new Date().toISOString(),
  };
}

/**
 * Get inheritance mode details.
 */
export function getInheritanceMode(modeId: InheritanceModeId): InheritanceMode {
  return INHERITANCE_MODES[modeId];
}

/**
 * Verify recipient permissions.
 */
export function canRecipientPerform(
  action: 'read' | 'browse' | 'export' | 'activate' | 'modify'
): boolean {
  const allowed = ['read', 'browse', 'export'];
  return allowed.includes(action);
}

/* =========================================================
   EXPORTS
   ========================================================= */

export default LegacyBundle;
