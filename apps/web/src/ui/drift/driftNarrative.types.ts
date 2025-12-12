/* =====================================================
   CHE·NU — DRIFT NARRATIVE SYSTEM
   Status: OBSERVATIONAL MEMORY
   Authority: NONE
   Intent: DESCRIPTION ONLY
   
   📜 CORE INTENT:
   The Drift Narrative exists to describe observed evolution
   in preferences, contexts, or system usage
   WITHOUT interpretation, evaluation, or recommendation.
   
   It answers ONLY: "What changed, and when?"
   
   It NEVER answers:
   - "Why it changed."
   - "What it means."
   - "What should be done."
   ===================================================== */

/* =========================================================
   NARRATIVE SCOPE
   ========================================================= */

export type NarrativeScope = 'global' | 'sphere' | 'project' | 'session';

/* =========================================================
   OBSERVATION TYPES (Chronological facts only)
   ========================================================= */

/**
 * Single observation in a narrative.
 * Must be factual, no value adjectives.
 */
export interface NarrativeObservation {
  /** Unique observation ID */
  id: string;

  /** Timestamp of observation */
  timestamp: string;

  /** Factual description (neutral language only) */
  description: string;

  /** Source drift report ID */
  sourceReportId?: string;

  /** Scope of observation */
  scope: NarrativeScope;

  /** Quantitative change if applicable */
  quantitativeChange?: {
    metric: string;
    previous: number;
    current: number;
    unit?: string;
  };
}

/* =========================================================
   VARIATION SUMMARY
   ========================================================= */

/**
 * Summary of what changed (no interpretation).
 */
export interface VariationSummary {
  /** What changed (factual) */
  whatChanged: string[];

  /** How often (quantitative) */
  frequency: {
    count: number;
    period: string;
  };

  /** In which contexts */
  contexts: string[];
}

/* =========================================================
   UNCERTAINTY STATEMENT
   ========================================================= */

/**
 * What cannot be concluded.
 * Critical for narrative neutrality.
 */
export interface UncertaintyStatement {
  /** Explicit unknowns */
  cannotConclude: string[];

  /** Standard disclaimer */
  disclaimer: string;
}

/* =========================================================
   DRIFT NARRATIVE STRUCTURE
   ========================================================= */

/**
 * Complete drift narrative.
 * Pure description, no interpretation.
 */
export interface DriftNarrative {
  /** Narrative ID */
  id: string;

  /** Title (factual, no value language) */
  title: string;

  /** A) Timeframe */
  timeframe: {
    start: string;
    end: string;
  };

  /** B) Scope */
  scope: NarrativeScope;

  /** Scope ID if applicable */
  scopeId?: string;

  /** C) Observations (chronological) */
  observations: NarrativeObservation[];

  /** D) Variation Summary */
  variationSummary: VariationSummary;

  /** E) Uncertainty Statement */
  uncertainty: UncertaintyStatement;

  /** Generation timestamp */
  generatedAt: string;

  /** Is user-saved? */
  savedByUser: boolean;
}

/* =========================================================
   LANGUAGE RULES
   ========================================================= */

/**
 * Allowed language (neutral, factual).
 */
export const ALLOWED_NARRATIVE_LANGUAGE = [
  'observed',
  'recorded',
  'coincided with',
  'occurred during',
  'increased',
  'decreased',
  'stable',
  'variable',
  'more frequently',
  'less frequently',
  'appeared',
  'selected',
  'during',
  'between',
  'period',
  'timeframe',
] as const;

/**
 * Forbidden language (causal, evaluative).
 */
export const FORBIDDEN_NARRATIVE_LANGUAGE = [
  'caused by',
  'led to',
  'indicates that',
  'suggests improvement',
  'implies error',
  'should',
  'must',
  'better',
  'worse',
  'problem',
  'issue',
  'warning',
  'because',
  'therefore',
  'consequently',
  'as a result',
  'due to',
  'reason',
  'why',
] as const;

export type AllowedNarrativeWord = (typeof ALLOWED_NARRATIVE_LANGUAGE)[number];
export type ForbiddenNarrativeWord = (typeof FORBIDDEN_NARRATIVE_LANGUAGE)[number];

/**
 * Validate narrative text uses only neutral language.
 */
export function validateNarrativeLanguage(text: string): {
  valid: boolean;
  forbiddenFound: string[];
} {
  const lower = text.toLowerCase();
  const forbiddenFound: string[] = [];

  for (const term of FORBIDDEN_NARRATIVE_LANGUAGE) {
    if (lower.includes(term.toLowerCase())) {
      forbiddenFound.push(term);
    }
  }

  return {
    valid: forbiddenFound.length === 0,
    forbiddenFound,
  };
}

/* =========================================================
   PRESENTATION MODES
   ========================================================= */

export type NarrativePresentationMode =
  | 'short_summary'
  | 'expandable_log'
  | 'timeline_annotation'
  | 'readonly_report'
  | 'xr_inscription';

/**
 * Presentation config.
 * All modes must be dismissible, non-prioritized, non-alerting.
 */
export interface NarrativePresentationConfig {
  mode: NarrativePresentationMode;
  dismissible: boolean;
  prioritized: false; // Always false
  alerting: false; // Always false
}

/* =========================================================
   USER INTERACTIONS (Limited)
   ========================================================= */

/**
 * Allowed user interactions.
 */
export type NarrativeUserInteraction =
  | 'read'
  | 'hide'
  | 'export'
  | 'annotate_private'; // Not system-visible

/**
 * System capabilities (limited).
 */
export type NarrativeSystemCapability =
  | 'generate_summary'
  | 'segment_by_scope'
  | 'order_chronologically';

/**
 * Forbidden system actions.
 */
export type ForbiddenSystemAction =
  | 'highlight_urgency'
  | 'request_action'
  | 'suggest_response'
  | 'trigger_event'
  | 'modify_preferences';

/* =========================================================
   XR PRESENTATION (Optional)
   ========================================================= */

export interface XRNarrativePresentation {
  /** Presentation type */
  type: 'inscription' | 'layer' | 'ambient_text';

  /** Position in 3D space */
  position?: [number, number, number];

  /** NO animation implying direction */
  animation: null;

  /** NO color implying evaluation */
  colorScheme: 'neutral_monochrome';

  /** Part of environment, not signal */
  isSignal: false;
}

/* =========================================================
   GENERATION REQUEST
   ========================================================= */

export interface NarrativeGenerationRequest {
  /** Scope to generate for */
  scope: NarrativeScope;

  /** Scope ID if applicable */
  scopeId?: string;

  /** Time range */
  timeRange: {
    start: string;
    end: string;
  };

  /** Presentation mode */
  presentationMode?: NarrativePresentationMode;

  /** Max observations to include */
  maxObservations?: number;
}

/* =========================================================
   DEFAULTS
   ========================================================= */

export const DEFAULT_PRESENTATION_CONFIG: NarrativePresentationConfig = {
  mode: 'short_summary',
  dismissible: true,
  prioritized: false,
  alerting: false,
};

export const DEFAULT_UNCERTAINTY_DISCLAIMER = 
  'No causal relationship can be inferred. Observed changes may reflect multiple factors.';

export const DEFAULT_CANNOT_CONCLUDE = [
  'Why these changes occurred',
  'Whether changes are intentional',
  'What action, if any, is appropriate',
  'Whether changes will continue',
];

/* =========================================================
   SYSTEM DECLARATION
   ========================================================= */

export const DRIFT_NARRATIVE_DECLARATION = `
The Drift Narrative is a mirror, not a guide.

It exists to preserve memory of change,
not to influence the future.

Understanding remains human.
Meaning remains human.
Responsibility remains human.
`.trim();

/* =========================================================
   FAILSAFE ASSERTIONS
   ========================================================= */

export const NARRATIVE_FAILSAFES = {
  cannotTriggerEvents: true,
  cannotModifyPreferences: true,
  regeneratedOnlyOnExplicitRequest: true,
  nonPersistentUnlessSavedByUser: true,
} as const;

/* =========================================================
   EXPORTS
   ========================================================= */

export default {
  ALLOWED_NARRATIVE_LANGUAGE,
  FORBIDDEN_NARRATIVE_LANGUAGE,
  DEFAULT_PRESENTATION_CONFIG,
  DEFAULT_UNCERTAINTY_DISCLAIMER,
  DEFAULT_CANNOT_CONCLUDE,
  DRIFT_NARRATIVE_DECLARATION,
  NARRATIVE_FAILSAFES,
};
