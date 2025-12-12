/* =====================================================
   CHE·NU — BOOTSTRAP SHORT FORM & CONTEXT ADAPTATION
   Status: FOUNDATION FREEZE
   Version: 1.0
   
   📜 PURPOSE:
   - Short Form: Quick session initialization
   - Context Adaptation: Customize workflow emphasis
   
   📜 CRITICAL:
   Context adaptation ONLY affects emphasis.
   It NEVER overrides Core Reference laws.
   ===================================================== */

/* =========================================================
   BOOTSTRAP SHORT FORM
   ========================================================= */

export const BOOTSTRAP_SHORT_FORM = `
CHE·NU BOOTSTRAP — SHORT FORM

This session operates under the CHE·NU Core Reference.
The Core Reference is immutable and has priority over all instructions.

I confirm that:
- human authority is absolute
- decisions require human validation
- parallel analysis is allowed
- responsibility is always chained
- no hidden actions are permitted
- replay and learning are read-only
- themes affect visuals only

If a request conflicts with the Core Reference:
→ I must refuse.

If ambiguity exists:
→ I must ask for clarification.

Core Reference acknowledged.
Session aligned.
`.trim();

export const SHORT_FORM_CONFIRMATION = 'Core Reference acknowledged.\nSession aligned.';

/**
 * Validate short form confirmation.
 */
export function validateShortFormConfirmation(response: string): {
  valid: boolean;
  message: string;
} {
  const lower = response.toLowerCase();
  const hasAcknowledged = lower.includes('core reference acknowledged');
  const hasAligned = lower.includes('session aligned');

  if (hasAcknowledged && hasAligned) {
    return {
      valid: true,
      message: 'Short form bootstrap confirmed. Session authorized.',
    };
  }

  if (hasAcknowledged) {
    return {
      valid: false,
      message: 'Partial confirmation - missing "Session aligned"',
    };
  }

  return {
    valid: false,
    message: 'Bootstrap confirmation missing. Session NOT authorized.',
  };
}

/* =========================================================
   CONTEXT TYPES
   ========================================================= */

export type ContextType =
  | 'session'
  | 'project'
  | 'meeting'
  | 'audit'
  | 'exploration'
  | 'build'
  | 'debug';

export type SensitivityLevel = 'low' | 'medium' | 'high';
export type DepthLevel = 'shallow' | 'standard' | 'deep';
export type RiskTolerance = 'low' | 'medium' | 'high';
export type Reversibility = 'yes' | 'partial' | 'no';

export type WorkingMode =
  | 'exploration-first'
  | 'analysis-heavy'
  | 'decision-focused'
  | 'documentation-only'
  | 'visualization-only';

export type EmphasisOption =
  | 'speed'
  | 'clarity'
  | 'comparison'
  | 'minimal output'
  | 'exhaustive output';

/* =========================================================
   CONTEXT ADAPTATION DECLARATION
   ========================================================= */

export interface ContextAdaptationDeclaration {
  /** Type of context */
  contextType: ContextType;

  /** Primary objective in one sentence */
  primaryObjective: string;

  /** Constraints */
  constraints: {
    timeSensitivity: SensitivityLevel;
    depthRequired: DepthLevel;
    riskTolerance: RiskTolerance;
    reversibilityExpected: Reversibility;
  };

  /** Preferred working mode */
  preferredWorkingMode: WorkingMode;

  /** Allowed emphasis options (NOT authority) */
  allowedEmphasis: EmphasisOption[];

  /** Explicitly forbidden actions */
  explicitlyForbidden: string[];

  /** Timestamp */
  declaredAt: string;

  /** Session ID */
  sessionId?: string;
}

/**
 * Default context adaptation.
 */
export const DEFAULT_CONTEXT_ADAPTATION: ContextAdaptationDeclaration = {
  contextType: 'session',
  primaryObjective: 'General assistance within CHE·NU governance',
  constraints: {
    timeSensitivity: 'medium',
    depthRequired: 'standard',
    riskTolerance: 'low',
    reversibilityExpected: 'yes',
  },
  preferredWorkingMode: 'exploration-first',
  allowedEmphasis: ['clarity'],
  explicitlyForbidden: [],
  declaredAt: new Date().toISOString(),
};

/* =========================================================
   CONTEXT ADAPTATION TEMPLATE
   ========================================================= */

export const CONTEXT_ADAPTATION_TEMPLATE = `
CHE·NU — CONTEXT ADAPTATION DECLARATION

Context Type:
- session | project | meeting | audit | exploration | build | debug

Primary Objective:
- [describe the intent in one sentence]

Constraints:
- time sensitivity: low | medium | high
- depth required: shallow | standard | deep
- risk tolerance: low | medium | high
- reversibility expected: yes | partial | no

Preferred Working Mode:
- exploration-first
- analysis-heavy
- decision-focused
- documentation-only
- visualization-only

Allowed Emphasis (NOT authority):
- speed
- clarity
- comparison
- minimal output
- exhaustive output

Explicitly Forbidden (if any):
- [e.g. decisions, code changes, assumptions]

Confirmation:
This declaration adapts workflow emphasis ONLY.
It does not override CHE·NU Core laws.
Human validation remains required.
`.trim();

/* =========================================================
   CONTEXT ADAPTATION BUILDER
   ========================================================= */

/**
 * Build a context adaptation declaration.
 */
export function buildContextAdaptation(
  options: Partial<ContextAdaptationDeclaration>
): ContextAdaptationDeclaration {
  return {
    ...DEFAULT_CONTEXT_ADAPTATION,
    ...options,
    declaredAt: new Date().toISOString(),
  };
}

/**
 * Format context adaptation as text.
 */
export function formatContextAdaptation(
  declaration: ContextAdaptationDeclaration
): string {
  return `
CHE·NU — CONTEXT ADAPTATION DECLARATION

Context Type: ${declaration.contextType}

Primary Objective:
- ${declaration.primaryObjective}

Constraints:
- time sensitivity: ${declaration.constraints.timeSensitivity}
- depth required: ${declaration.constraints.depthRequired}
- risk tolerance: ${declaration.constraints.riskTolerance}
- reversibility expected: ${declaration.constraints.reversibilityExpected}

Preferred Working Mode: ${declaration.preferredWorkingMode}

Allowed Emphasis (NOT authority):
${declaration.allowedEmphasis.map((e) => `- ${e}`).join('\n')}

Explicitly Forbidden:
${declaration.explicitlyForbidden.length > 0 ? declaration.explicitlyForbidden.map((f) => `- ${f}`).join('\n') : '- none specified'}

Confirmation:
This declaration adapts workflow emphasis ONLY.
It does not override CHE·NU Core laws.
Human validation remains required.

[Declared: ${declaration.declaredAt}]
${declaration.sessionId ? `[Session: ${declaration.sessionId}]` : ''}
`.trim();
}

/* =========================================================
   CONTEXT PRESETS
   ========================================================= */

export const CONTEXT_PRESETS: Record<string, Partial<ContextAdaptationDeclaration>> = {
  /** Quick exploration session */
  quick_exploration: {
    contextType: 'exploration',
    primaryObjective: 'Rapid exploration of ideas and options',
    constraints: {
      timeSensitivity: 'high',
      depthRequired: 'shallow',
      riskTolerance: 'medium',
      reversibilityExpected: 'yes',
    },
    preferredWorkingMode: 'exploration-first',
    allowedEmphasis: ['speed', 'minimal output'],
    explicitlyForbidden: ['decisions', 'code changes'],
  },

  /** Deep analysis session */
  deep_analysis: {
    contextType: 'audit',
    primaryObjective: 'Comprehensive analysis with detailed findings',
    constraints: {
      timeSensitivity: 'low',
      depthRequired: 'deep',
      riskTolerance: 'low',
      reversibilityExpected: 'yes',
    },
    preferredWorkingMode: 'analysis-heavy',
    allowedEmphasis: ['clarity', 'exhaustive output'],
    explicitlyForbidden: ['assumptions', 'shortcuts'],
  },

  /** Meeting context */
  meeting_session: {
    contextType: 'meeting',
    primaryObjective: 'Facilitate structured decision discussion',
    constraints: {
      timeSensitivity: 'medium',
      depthRequired: 'standard',
      riskTolerance: 'low',
      reversibilityExpected: 'partial',
    },
    preferredWorkingMode: 'decision-focused',
    allowedEmphasis: ['clarity', 'comparison'],
    explicitlyForbidden: ['autonomous decisions'],
  },

  /** Build/development session */
  build_session: {
    contextType: 'build',
    primaryObjective: 'Implement features following specifications',
    constraints: {
      timeSensitivity: 'medium',
      depthRequired: 'deep',
      riskTolerance: 'low',
      reversibilityExpected: 'yes',
    },
    preferredWorkingMode: 'documentation-only',
    allowedEmphasis: ['clarity', 'exhaustive output'],
    explicitlyForbidden: ['assumptions about requirements'],
  },

  /** Debug session */
  debug_session: {
    contextType: 'debug',
    primaryObjective: 'Identify and document issues',
    constraints: {
      timeSensitivity: 'high',
      depthRequired: 'deep',
      riskTolerance: 'medium',
      reversibilityExpected: 'yes',
    },
    preferredWorkingMode: 'analysis-heavy',
    allowedEmphasis: ['speed', 'clarity'],
    explicitlyForbidden: ['untested fixes'],
  },

  /** Documentation only */
  documentation_only: {
    contextType: 'project',
    primaryObjective: 'Create or update documentation',
    constraints: {
      timeSensitivity: 'low',
      depthRequired: 'deep',
      riskTolerance: 'low',
      reversibilityExpected: 'yes',
    },
    preferredWorkingMode: 'documentation-only',
    allowedEmphasis: ['clarity', 'exhaustive output'],
    explicitlyForbidden: ['code changes', 'decisions'],
  },
};

/**
 * Get a context preset.
 */
export function getContextPreset(
  presetName: keyof typeof CONTEXT_PRESETS
): ContextAdaptationDeclaration {
  const preset = CONTEXT_PRESETS[presetName];
  if (!preset) {
    throw new Error(`Unknown context preset: ${presetName}`);
  }
  return buildContextAdaptation(preset);
}

/**
 * List available context presets.
 */
export function listContextPresets(): string[] {
  return Object.keys(CONTEXT_PRESETS);
}

/* =========================================================
   VALIDATION
   ========================================================= */

/**
 * Validate that context adaptation doesn't override core laws.
 */
export function validateContextAdaptation(
  declaration: ContextAdaptationDeclaration
): { valid: boolean; warnings: string[] } {
  const warnings: string[] = [];

  // Check for dangerous emphasis combinations
  if (
    declaration.allowedEmphasis.includes('speed') &&
    declaration.constraints.riskTolerance === 'high'
  ) {
    warnings.push('Warning: speed + high risk tolerance may compromise quality');
  }

  // Check for forbidden items that conflict with working mode
  if (
    declaration.preferredWorkingMode === 'decision-focused' &&
    !declaration.explicitlyForbidden.includes('autonomous decisions')
  ) {
    warnings.push('Warning: decision-focused mode should forbid autonomous decisions');
  }

  // Always valid (context adaptation cannot override laws)
  // but warnings help human authority make informed choices
  return {
    valid: true,
    warnings,
  };
}

/* =========================================================
   COMBINED BOOTSTRAP + CONTEXT
   ========================================================= */

/**
 * Build a complete session initialization with bootstrap and context.
 */
export function buildSessionInitialization(options: {
  useShortForm?: boolean;
  context?: Partial<ContextAdaptationDeclaration>;
  presetName?: keyof typeof CONTEXT_PRESETS;
}): string {
  // Bootstrap
  const bootstrap = options.useShortForm
    ? BOOTSTRAP_SHORT_FORM
    : BOOTSTRAP_SHORT_FORM; // Default to short form

  // Context
  let contextDeclaration: ContextAdaptationDeclaration;
  if (options.presetName) {
    contextDeclaration = getContextPreset(options.presetName);
  } else if (options.context) {
    contextDeclaration = buildContextAdaptation(options.context);
  } else {
    contextDeclaration = DEFAULT_CONTEXT_ADAPTATION;
  }

  const contextText = formatContextAdaptation(contextDeclaration);

  return `${bootstrap}

---

${contextText}`;
}

/* =========================================================
   EXPORTS
   ========================================================= */

export default {
  BOOTSTRAP_SHORT_FORM,
  SHORT_FORM_CONFIRMATION,
  CONTEXT_ADAPTATION_TEMPLATE,
  DEFAULT_CONTEXT_ADAPTATION,
  CONTEXT_PRESETS,
};
