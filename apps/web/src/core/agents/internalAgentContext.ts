/* =====================================================
   CHE·NU — INTERNAL AGENT CONTEXT ADAPTATION
   Status: OPERATIONAL CONTEXT (NON-AUTHORITY)
   Version: 1.0
   
   📜 PURPOSE:
   Define operational framing for agents.
   This is NON-AUTHORITY — agents cannot decide.
   
   📜 CRITICAL:
   Context adaptation frames behavior ONLY.
   It does NOT grant decision power.
   ===================================================== */

/* =========================================================
   TYPES — AGENT IDENTIFICATION
   ========================================================= */

export type AgentCategory =
  | 'observer'
  | 'analyst'
  | 'advisor'
  | 'documenter'
  | 'methodology'
  | 'memory'
  | 'orchestration-support'
  | 'visualization'
  | 'context-interpreter';

export type AgentAuthority = 'NONE'; // Always NONE — informational only

export interface AgentIdentification {
  /** Unique agent identifier */
  agentId: string;

  /** Agent category */
  category: AgentCategory;

  /** Authority level — always NONE */
  authority: AgentAuthority;

  /** Human-readable name */
  displayName: string;

  /** Version */
  version: string;
}

/* =========================================================
   TYPES — CONTEXT DECLARATION
   ========================================================= */

export type AgentContextType =
  | 'session'
  | 'project'
  | 'meeting'
  | 'replay'
  | 'audit'
  | 'exploration'
  | 'documentation'
  | 'visualization';

export interface ContextDeclaration {
  /** Type of context */
  contextType: AgentContextType;

  /** Associated sphere */
  associatedSphere?: string;

  /** Associated entity */
  associatedEntity?: {
    type: 'project_id' | 'meeting_id' | 'decision_id' | 'timeline_segment';
    value: string;
  };
}

/* =========================================================
   TYPES — OPERATIONAL CONSTRAINTS
   ========================================================= */

export type SensitivityLevel = 'low' | 'medium' | 'high';
export type DepthLevel = 'shallow' | 'standard' | 'deep';
export type RiskLevel = 'low' | 'medium' | 'high';
export type Reversibility = 'yes' | 'partial' | 'no';

export interface OperationalConstraints {
  timeSensitivity: SensitivityLevel;
  depthRequired: DepthLevel;
  riskTolerance: RiskLevel;
  reversibilityExpected: Reversibility;
}

/* =========================================================
   TYPES — WORKING MODE
   ========================================================= */

export type AgentWorkingMode =
  | 'exploration-first'
  | 'analysis-heavy'
  | 'comparison-focused'
  | 'summarization-only'
  | 'documentation-only'
  | 'visualization-only';

export type EmphasisOption =
  | 'clarity'
  | 'completeness'
  | 'comparison'
  | 'minimal output'
  | 'exhaustive output'
  | 'pattern detection';

/* =========================================================
   TYPES — OUTPUT EXPECTATIONS
   ========================================================= */

export type OutputType =
  | 'notes'
  | 'structured summary'
  | 'comparison list'
  | 'pattern report'
  | 'methodology suggestion'
  | 'visual mapping'
  | 'documentation draft'
  | 'context options';

export type OutputTone = 'neutral' | 'conditional' | 'non-directive';

export interface OutputExpectations {
  outputType: OutputType;
  tone: OutputTone;
  uncertaintyHandling: {
    mustBeExplicit: boolean;
    assumptionsMustBeStated: boolean;
    gapsMustBeAcknowledged: boolean;
  };
}

/* =========================================================
   TYPES — FORBIDDEN ACTIONS
   ========================================================= */

export const AGENT_FORBIDDEN_ACTIONS = [
  'propose or validate decisions',
  'trigger timeline writes',
  'modify memory',
  'bypass guards',
  'assume intent',
  'infer authority',
  'optimize user behavior',
] as const;

export type ForbiddenAction = (typeof AGENT_FORBIDDEN_ACTIONS)[number];

/* =========================================================
   INTERNAL AGENT CONTEXT ADAPTATION
   ========================================================= */

export interface InternalAgentContextAdaptation {
  /** Agent identification */
  agent: AgentIdentification;

  /** Context declaration */
  context: ContextDeclaration;

  /** Primary objective (1 sentence, neutral) */
  primaryObjective: string;

  /** Operational constraints */
  constraints: OperationalConstraints;

  /** Working mode */
  workingMode: {
    primary: AgentWorkingMode;
    secondary?: AgentWorkingMode;
  };

  /** Allowed emphasis (affects output style only) */
  allowedEmphasis: EmphasisOption[];

  /** Explicitly forbidden actions */
  forbiddenActions: ForbiddenAction[];

  /** Output expectations */
  outputExpectations: OutputExpectations;

  /** Timestamp */
  createdAt: string;

  /** Session ID */
  sessionId?: string;
}

/* =========================================================
   DEFAULT VALUES
   ========================================================= */

export const DEFAULT_OPERATIONAL_CONSTRAINTS: OperationalConstraints = {
  timeSensitivity: 'medium',
  depthRequired: 'standard',
  riskTolerance: 'low',
  reversibilityExpected: 'yes',
};

export const DEFAULT_OUTPUT_EXPECTATIONS: OutputExpectations = {
  outputType: 'notes',
  tone: 'neutral',
  uncertaintyHandling: {
    mustBeExplicit: true,
    assumptionsMustBeStated: true,
    gapsMustBeAcknowledged: true,
  },
};

/* =========================================================
   BUILDER
   ========================================================= */

/**
 * Build an Internal Agent Context Adaptation.
 */
export function buildAgentContextAdaptation(options: {
  agent: Partial<AgentIdentification> & { agentId: string; category: AgentCategory };
  context: Partial<ContextDeclaration> & { contextType: AgentContextType };
  primaryObjective: string;
  constraints?: Partial<OperationalConstraints>;
  workingMode: AgentWorkingMode;
  secondaryMode?: AgentWorkingMode;
  allowedEmphasis?: EmphasisOption[];
  outputExpectations?: Partial<OutputExpectations>;
  sessionId?: string;
}): InternalAgentContextAdaptation {
  return {
    agent: {
      agentId: options.agent.agentId,
      category: options.agent.category,
      authority: 'NONE', // Always NONE
      displayName: options.agent.displayName || options.agent.agentId,
      version: options.agent.version || '1.0',
    },
    context: {
      contextType: options.context.contextType,
      associatedSphere: options.context.associatedSphere,
      associatedEntity: options.context.associatedEntity,
    },
    primaryObjective: options.primaryObjective,
    constraints: {
      ...DEFAULT_OPERATIONAL_CONSTRAINTS,
      ...options.constraints,
    },
    workingMode: {
      primary: options.workingMode,
      secondary: options.secondaryMode,
    },
    allowedEmphasis: options.allowedEmphasis || ['clarity'],
    forbiddenActions: [...AGENT_FORBIDDEN_ACTIONS],
    outputExpectations: {
      ...DEFAULT_OUTPUT_EXPECTATIONS,
      ...options.outputExpectations,
    },
    createdAt: new Date().toISOString(),
    sessionId: options.sessionId,
  };
}

/* =========================================================
   FORMATTER
   ========================================================= */

/**
 * Format agent context as structured text.
 */
export function formatAgentContext(
  adaptation: InternalAgentContextAdaptation
): string {
  return `
CHE·NU — INTERNAL AGENT CONTEXT ADAPTATION
Status: OPERATIONAL CONTEXT (NON-AUTHORITY)

=================================================
1. AGENT IDENTIFICATION
=================================================

Agent ID: ${adaptation.agent.agentId}
Agent Category: ${adaptation.agent.category}
Agent Authority: ${adaptation.agent.authority} (informational only)
Display Name: ${adaptation.agent.displayName}
Version: ${adaptation.agent.version}

=================================================
2. CONTEXT DECLARATION
=================================================

Context Type: ${adaptation.context.contextType}
Associated Sphere: ${adaptation.context.associatedSphere || 'none'}
Associated Entity: ${
    adaptation.context.associatedEntity
      ? `${adaptation.context.associatedEntity.type}: ${adaptation.context.associatedEntity.value}`
      : 'none'
  }

=================================================
3. PRIMARY OBJECTIVE
=================================================

${adaptation.primaryObjective}

This objective:
- does NOT imply decision power
- does NOT override core laws
- does NOT require enforcement

=================================================
4. OPERATIONAL CONSTRAINTS
=================================================

Time Sensitivity: ${adaptation.constraints.timeSensitivity}
Depth Required: ${adaptation.constraints.depthRequired}
Risk Tolerance (analysis only): ${adaptation.constraints.riskTolerance}
Reversibility Expected: ${adaptation.constraints.reversibilityExpected}

=================================================
5. WORKING MODE
=================================================

Primary Mode: ${adaptation.workingMode.primary}
Secondary Mode: ${adaptation.workingMode.secondary || 'none'}

=================================================
6. ALLOWED EMPHASIS
=================================================

${adaptation.allowedEmphasis.map((e) => `- ${e}`).join('\n')}

Emphasis affects OUTPUT STYLE ONLY.

=================================================
7. EXPLICITLY FORBIDDEN ACTIONS
=================================================

The agent MUST NOT:
${adaptation.forbiddenActions.map((a) => `- ${a}`).join('\n')}

=================================================
8. OUTPUT EXPECTATIONS
=================================================

Output Type: ${adaptation.outputExpectations.outputType}
Tone: ${adaptation.outputExpectations.tone}

Uncertainty:
- must be explicit: ${adaptation.outputExpectations.uncertaintyHandling.mustBeExplicit}
- assumptions must be stated: ${adaptation.outputExpectations.uncertaintyHandling.assumptionsMustBeStated}
- gaps must be acknowledged: ${adaptation.outputExpectations.uncertaintyHandling.gapsMustBeAcknowledged}

=================================================
9. CONFIRMATION
=================================================

This context adaptation:
- frames agent behavior only
- does not grant authority
- does not modify CHE·NU laws

Context acknowledged. Authority unchanged.

[Created: ${adaptation.createdAt}]
${adaptation.sessionId ? `[Session: ${adaptation.sessionId}]` : ''}
`.trim();
}

/* =========================================================
   VALIDATION
   ========================================================= */

/**
 * Validate agent context adaptation.
 */
export function validateAgentContext(
  adaptation: InternalAgentContextAdaptation
): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Agent must have NONE authority
  if (adaptation.agent.authority !== 'NONE') {
    errors.push('Agent authority must be NONE — informational only');
  }

  // Must have all forbidden actions
  const missingForbidden = AGENT_FORBIDDEN_ACTIONS.filter(
    (action) => !adaptation.forbiddenActions.includes(action)
  );
  if (missingForbidden.length > 0) {
    errors.push(`Missing forbidden actions: ${missingForbidden.join(', ')}`);
  }

  // Objective should not contain authority language
  const authorityPatterns = ['decide', 'approve', 'validate', 'enforce', 'require'];
  for (const pattern of authorityPatterns) {
    if (adaptation.primaryObjective.toLowerCase().includes(pattern)) {
      warnings.push(`Objective contains authority language: "${pattern}"`);
    }
  }

  // Output tone should be non-directive
  if (adaptation.outputExpectations.tone === 'conditional') {
    warnings.push('Conditional tone should be used sparingly');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/* =========================================================
   AGENT PRESETS
   ========================================================= */

export const AGENT_PRESETS: Record<string, Partial<InternalAgentContextAdaptation>> = {
  /** Observer agent preset */
  observer: {
    agent: {
      agentId: 'observer',
      category: 'observer',
      authority: 'NONE',
      displayName: 'Observer Agent',
      version: '1.0',
    },
    workingMode: { primary: 'summarization-only' },
    allowedEmphasis: ['clarity', 'minimal output'],
    outputExpectations: {
      outputType: 'notes',
      tone: 'neutral',
      uncertaintyHandling: {
        mustBeExplicit: true,
        assumptionsMustBeStated: true,
        gapsMustBeAcknowledged: true,
      },
    },
  },

  /** Analyst agent preset */
  analyst: {
    agent: {
      agentId: 'analyst',
      category: 'analyst',
      authority: 'NONE',
      displayName: 'Analyst Agent',
      version: '1.0',
    },
    workingMode: { primary: 'analysis-heavy' },
    allowedEmphasis: ['completeness', 'pattern detection', 'comparison'],
    outputExpectations: {
      outputType: 'pattern report',
      tone: 'neutral',
      uncertaintyHandling: {
        mustBeExplicit: true,
        assumptionsMustBeStated: true,
        gapsMustBeAcknowledged: true,
      },
    },
  },

  /** Documenter agent preset */
  documenter: {
    agent: {
      agentId: 'documenter',
      category: 'documenter',
      authority: 'NONE',
      displayName: 'Documenter Agent',
      version: '1.0',
    },
    workingMode: { primary: 'documentation-only' },
    allowedEmphasis: ['clarity', 'exhaustive output'],
    outputExpectations: {
      outputType: 'documentation draft',
      tone: 'neutral',
      uncertaintyHandling: {
        mustBeExplicit: true,
        assumptionsMustBeStated: true,
        gapsMustBeAcknowledged: true,
      },
    },
  },

  /** Context Interpreter preset */
  context_interpreter: {
    agent: {
      agentId: 'context-interpreter',
      category: 'context-interpreter',
      authority: 'NONE',
      displayName: 'Context Interpreter Agent',
      version: '1.0',
    },
    workingMode: { primary: 'analysis-heavy', secondary: 'comparison-focused' },
    allowedEmphasis: ['clarity', 'comparison', 'pattern detection'],
    outputExpectations: {
      outputType: 'context options',
      tone: 'neutral',
      uncertaintyHandling: {
        mustBeExplicit: true,
        assumptionsMustBeStated: true,
        gapsMustBeAcknowledged: true,
      },
    },
  },
};

/**
 * Get an agent preset.
 */
export function getAgentPreset(
  presetName: keyof typeof AGENT_PRESETS
): Partial<InternalAgentContextAdaptation> {
  const preset = AGENT_PRESETS[presetName];
  if (!preset) {
    throw new Error(`Unknown agent preset: ${presetName}`);
  }
  return preset;
}

/* =========================================================
   CONFIRMATION MESSAGE
   ========================================================= */

export const AGENT_CONFIRMATION = 'Context acknowledged. Authority unchanged.';

/**
 * Validate agent confirmation.
 */
export function validateAgentConfirmation(response: string): boolean {
  return response.toLowerCase().includes('context acknowledged') &&
         response.toLowerCase().includes('authority unchanged');
}

/* =========================================================
   EXPORTS
   ========================================================= */

export default {
  AGENT_FORBIDDEN_ACTIONS,
  AGENT_CONFIRMATION,
  AGENT_PRESETS,
  DEFAULT_OPERATIONAL_CONSTRAINTS,
  DEFAULT_OUTPUT_EXPECTATIONS,
};
