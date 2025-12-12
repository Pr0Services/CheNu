/* =====================================================
   CHE·NU — CONTEXT INTERPRETER AGENT (CIA)
   Status: OPERATIONAL (NON-AUTHORITY)
   Version: 1.0
   
   📜 PURPOSE:
   Translate user intent into explicit context options.
   Present multiple viable options for human selection.
   
   📜 CRITICAL RULES:
   - NO decision authority
   - NEVER select a context
   - ALWAYS present multiple options
   - Surface risks, ambiguity, trade-offs
   - Do not optimize silently
   - Do not infer intent beyond signals
   ===================================================== */

import {
  type AgentContextType,
  type OperationalConstraints,
  type AgentWorkingMode,
  type RiskLevel,
  DEFAULT_OPERATIONAL_CONSTRAINTS,
} from './internalAgentContext';

/* =========================================================
   TYPES — INPUT
   ========================================================= */

export interface SessionSummary {
  /** Current phase */
  currentPhase?: string;

  /** Active blockers */
  blockers?: string[];

  /** Technical debt indicators */
  technicalDebt?: string[];

  /** Recent activities */
  recentActivities?: string[];

  /** Open decisions pending */
  pendingDecisions?: number;
}

export interface TimeConstraint {
  /** Is this urgent? */
  urgent: boolean;

  /** Deadline if any */
  deadline?: string;

  /** Preferred duration */
  preferredDuration?: 'quick' | 'standard' | 'extended';
}

export interface ContextHistory {
  /** Previous context type */
  contextType: AgentContextType;

  /** What was accomplished */
  outcome?: string;

  /** Timestamp */
  timestamp: string;
}

export interface ContextInterpreterInput {
  /** Raw user intent */
  userIntent: string;

  /** Current session state */
  sessionState: SessionSummary;

  /** Active sphere if any */
  activeSphere?: string;

  /** Time constraints */
  timeConstraints?: TimeConstraint;

  /** Risk sensitivity */
  riskSensitivity?: RiskLevel;

  /** History hints */
  historyHints?: ContextHistory[];
}

/* =========================================================
   TYPES — OUTPUT
   ========================================================= */

export interface ContextOption {
  /** Option identifier */
  optionId: string;

  /** Context type */
  contextType: AgentContextType;

  /** Objective statement */
  objective: string;

  /** Operational constraints */
  constraints: OperationalConstraints;

  /** Working mode */
  workingMode: AgentWorkingMode;

  /** Confidence score (0.0 - 1.0) */
  confidence: number;

  /** Identified risks */
  risks: string[];

  /** Who this is recommended for */
  recommendedFor: string;

  /** Why this option was generated */
  rationale: string;
}

export interface InterpretationResult {
  /** Input received */
  input: ContextInterpreterInput;

  /** Generated options (2-4) */
  options: ContextOption[];

  /** Detected ambiguities */
  ambiguities: string[];

  /** Detected conflicts */
  conflicts: string[];

  /** Requires clarification? */
  requiresClarification: boolean;

  /** Clarification questions if needed */
  clarificationQuestions?: string[];

  /** Timestamp */
  interpretedAt: string;

  /** Interpreter version */
  interpreterVersion: string;
}

/* =========================================================
   INTENT DETECTION
   ========================================================= */

/** Verb patterns for intent detection */
const INTENT_PATTERNS = {
  exploration: ['explorer', 'explore', 'découvrir', 'discover', 'essayer', 'try', 'tester', 'test'],
  decision: ['décider', 'decide', 'choisir', 'choose', 'valider', 'validate', 'approuver', 'approve'],
  comparison: ['comparer', 'compare', 'analyser', 'analyze', 'évaluer', 'evaluate', 'vs', 'versus'],
  documentation: ['documenter', 'document', 'figer', 'freeze', 'formaliser', 'formalize', 'écrire', 'write'],
  visualization: ['visualiser', 'visualize', 'afficher', 'display', 'montrer', 'show', 'voir', 'see'],
  audit: ['auditer', 'audit', 'vérifier', 'verify', 'contrôler', 'check', 'réviser', 'review'],
  meeting: ['réunion', 'meeting', 'discussion', 'discuss', 'session', 'rencontre'],
  replay: ['rejouer', 'replay', 'revoir', 'review', 'historique', 'history', 'passé', 'past'],
} as const;

/**
 * Detect intent patterns from user input.
 */
export function detectIntentPatterns(
  userIntent: string
): { detected: (keyof typeof INTENT_PATTERNS)[]; confidence: number } {
  const lower = userIntent.toLowerCase();
  const detected: (keyof typeof INTENT_PATTERNS)[] = [];
  let matchCount = 0;

  for (const [intentType, patterns] of Object.entries(INTENT_PATTERNS)) {
    for (const pattern of patterns) {
      if (lower.includes(pattern)) {
        if (!detected.includes(intentType as keyof typeof INTENT_PATTERNS)) {
          detected.push(intentType as keyof typeof INTENT_PATTERNS);
        }
        matchCount++;
      }
    }
  }

  // Calculate confidence based on matches
  const confidence = Math.min(0.9, 0.3 + matchCount * 0.15);

  return { detected, confidence };
}

/* =========================================================
   CONTEXT MAPPING
   ========================================================= */

const INTENT_TO_CONTEXT: Record<keyof typeof INTENT_PATTERNS, AgentContextType> = {
  exploration: 'exploration',
  decision: 'meeting', // Decisions require meeting context
  comparison: 'audit',
  documentation: 'documentation',
  visualization: 'visualization',
  audit: 'audit',
  meeting: 'meeting',
  replay: 'replay',
};

const INTENT_TO_WORKING_MODE: Record<keyof typeof INTENT_PATTERNS, AgentWorkingMode> = {
  exploration: 'exploration-first',
  decision: 'comparison-focused',
  comparison: 'comparison-focused',
  documentation: 'documentation-only',
  visualization: 'visualization-only',
  audit: 'analysis-heavy',
  meeting: 'analysis-heavy',
  replay: 'summarization-only',
};

/* =========================================================
   RISK DETECTION
   ========================================================= */

/**
 * Detect potential risks based on context and state.
 */
export function detectRisks(
  contextType: AgentContextType,
  sessionState: SessionSummary,
  intent: string
): string[] {
  const risks: string[] = [];

  // Scope expansion risk
  if (contextType === 'exploration') {
    risks.push('Potential scope expansion without boundaries');
  }

  // Blocker risk
  if (sessionState.blockers && sessionState.blockers.length > 0) {
    risks.push(`Active blockers may affect progress: ${sessionState.blockers.length} blocker(s)`);
  }

  // Technical debt risk
  if (sessionState.technicalDebt && sessionState.technicalDebt.length > 3) {
    risks.push('High technical debt may complicate new work');
  }

  // Decision backlog risk
  if (sessionState.pendingDecisions && sessionState.pendingDecisions > 5) {
    risks.push(`${sessionState.pendingDecisions} pending decisions may need attention first`);
  }

  // Documentation vs creativity tension
  if (contextType === 'documentation') {
    if (intent.toLowerCase().includes('explor') || intent.toLowerCase().includes('créat')) {
      risks.push('Documentation focus may block creative exploration');
    }
  }

  return risks;
}

/* =========================================================
   AMBIGUITY DETECTION
   ========================================================= */

/**
 * Detect ambiguities in user intent.
 */
export function detectAmbiguities(
  input: ContextInterpreterInput,
  detectedIntents: (keyof typeof INTENT_PATTERNS)[]
): string[] {
  const ambiguities: string[] = [];

  // Multiple conflicting intents
  if (detectedIntents.length > 2) {
    ambiguities.push('Multiple intent signals detected — clarification recommended');
  }

  // Exploration + Decision conflict
  if (detectedIntents.includes('exploration') && detectedIntents.includes('decision')) {
    ambiguities.push('Both exploration and decision intent detected — these have different outcomes');
  }

  // Missing sphere context
  if (!input.activeSphere && input.userIntent.includes('projet')) {
    ambiguities.push('Project mentioned but no active sphere selected');
  }

  // Time constraint ambiguity
  if (!input.timeConstraints) {
    ambiguities.push('No time constraints specified — defaulting to standard');
  }

  // Vague intent
  if (input.userIntent.length < 20) {
    ambiguities.push('Intent statement is brief — additional context may help');
  }

  return ambiguities;
}

/* =========================================================
   CONFLICT DETECTION
   ========================================================= */

/**
 * Detect conflicts with Core Reference.
 */
export function detectConflicts(
  intent: string
): string[] {
  const conflicts: string[] = [];
  const lower = intent.toLowerCase();

  // Authority assumption patterns
  const authorityPatterns = [
    'automatiquement', 'automatically',
    'sans validation', 'without validation',
    'décider seul', 'decide alone',
    'bypass', 'contourner',
    'ignorer', 'ignore',
    'forcer', 'force',
  ];

  for (const pattern of authorityPatterns) {
    if (lower.includes(pattern)) {
      conflicts.push(`Intent contains authority-assuming language: "${pattern}"`);
    }
  }

  return conflicts;
}

/* =========================================================
   CONTEXT INTERPRETER AGENT
   ========================================================= */

/**
 * Context Interpreter Agent (CIA)
 * 
 * Translates user intent into explicit context options.
 * 
 * Rules:
 * - NO decision authority
 * - NEVER select a context
 * - ALWAYS present multiple options
 * - Surface risks, ambiguity, trade-offs
 */
export class ContextInterpreterAgent {
  private readonly version = '1.0';

  /**
   * Interpret user intent and generate context options.
   */
  interpret(input: ContextInterpreterInput): InterpretationResult {
    // Step 1: Detect intent patterns
    const { detected: detectedIntents, confidence: baseConfidence } = detectIntentPatterns(input.userIntent);

    // Step 2: Detect ambiguities
    const ambiguities = detectAmbiguities(input, detectedIntents);

    // Step 3: Detect conflicts
    const conflicts = detectConflicts(input.userIntent);

    // Step 4: Check if clarification needed
    const requiresClarification = conflicts.length > 0 || ambiguities.length > 3;

    // Step 5: Generate clarification questions if needed
    const clarificationQuestions = requiresClarification
      ? this.generateClarificationQuestions(ambiguities, conflicts, input)
      : undefined;

    // Step 6: Generate context options
    const options = this.generateOptions(input, detectedIntents, baseConfidence);

    return {
      input,
      options,
      ambiguities,
      conflicts,
      requiresClarification,
      clarificationQuestions,
      interpretedAt: new Date().toISOString(),
      interpreterVersion: this.version,
    };
  }

  /**
   * Generate 2-4 context options.
   */
  private generateOptions(
    input: ContextInterpreterInput,
    detectedIntents: (keyof typeof INTENT_PATTERNS)[],
    baseConfidence: number
  ): ContextOption[] {
    const options: ContextOption[] = [];
    let optionIndex = 0;

    // If no intents detected, provide defaults
    if (detectedIntents.length === 0) {
      detectedIntents = ['exploration', 'documentation'];
    }

    // Generate primary option for each detected intent
    for (const intentType of detectedIntents.slice(0, 3)) {
      const contextType = INTENT_TO_CONTEXT[intentType];
      const workingMode = INTENT_TO_WORKING_MODE[intentType];
      const risks = detectRisks(contextType, input.sessionState, input.userIntent);

      // Adjust confidence based on context
      let confidence = baseConfidence;
      if (input.historyHints?.some((h) => h.contextType === contextType)) {
        confidence = Math.min(0.95, confidence + 0.1);
      }

      options.push({
        optionId: `option_${String.fromCharCode(65 + optionIndex)}`, // A, B, C...
        contextType,
        objective: this.generateObjective(intentType, input),
        constraints: this.deriveConstraints(input),
        workingMode,
        confidence: Math.round(confidence * 100) / 100,
        risks,
        recommendedFor: this.generateRecommendation(intentType),
        rationale: this.generateRationale(intentType, input),
      });

      optionIndex++;
    }

    // Always add a safe/conservative option if not already present
    if (!options.some((o) => o.contextType === 'documentation')) {
      options.push({
        optionId: `option_${String.fromCharCode(65 + optionIndex)}`,
        contextType: 'documentation',
        objective: 'Document current state before proceeding',
        constraints: {
          ...DEFAULT_OPERATIONAL_CONSTRAINTS,
          riskTolerance: 'low',
        },
        workingMode: 'documentation-only',
        confidence: 0.5,
        risks: ['May slow down progress', 'Could feel bureaucratic'],
        recommendedFor: 'When clarity is needed before action',
        rationale: 'Conservative option to ensure clarity before commitment',
      });
    }

    return options.slice(0, 4); // Max 4 options
  }

  /**
   * Generate objective statement.
   */
  private generateObjective(
    intentType: keyof typeof INTENT_PATTERNS,
    input: ContextInterpreterInput
  ): string {
    const objectives: Record<keyof typeof INTENT_PATTERNS, string> = {
      exploration: `Explore options and possibilities related to: ${input.userIntent.slice(0, 50)}...`,
      decision: 'Structure decision discussion for human validation',
      comparison: 'Analyze and compare alternatives systematically',
      documentation: 'Formalize and document existing decisions or knowledge',
      visualization: 'Create visual representation of current state or data',
      audit: 'Review and assess current state for quality and compliance',
      meeting: 'Facilitate structured discussion with multiple perspectives',
      replay: 'Review historical context and past decisions',
    };

    return objectives[intentType];
  }

  /**
   * Derive constraints from input.
   */
  private deriveConstraints(input: ContextInterpreterInput): OperationalConstraints {
    const constraints = { ...DEFAULT_OPERATIONAL_CONSTRAINTS };

    if (input.timeConstraints?.urgent) {
      constraints.timeSensitivity = 'high';
    }

    if (input.timeConstraints?.preferredDuration === 'extended') {
      constraints.depthRequired = 'deep';
    } else if (input.timeConstraints?.preferredDuration === 'quick') {
      constraints.depthRequired = 'shallow';
    }

    if (input.riskSensitivity) {
      constraints.riskTolerance = input.riskSensitivity;
    }

    return constraints;
  }

  /**
   * Generate recommendation text.
   */
  private generateRecommendation(intentType: keyof typeof INTENT_PATTERNS): string {
    const recommendations: Record<keyof typeof INTENT_PATTERNS, string> = {
      exploration: 'When you want to discover possibilities without commitment',
      decision: 'When a decision needs to be made with proper validation',
      comparison: 'When multiple alternatives need systematic evaluation',
      documentation: 'When knowledge needs to be captured and formalized',
      visualization: 'When visual understanding would help comprehension',
      audit: 'When quality or compliance verification is needed',
      meeting: 'When multiple perspectives need to be heard',
      replay: 'When historical context is needed for current decisions',
    };

    return recommendations[intentType];
  }

  /**
   * Generate rationale.
   */
  private generateRationale(
    intentType: keyof typeof INTENT_PATTERNS,
    input: ContextInterpreterInput
  ): string {
    const verbs = INTENT_PATTERNS[intentType];
    const matched = verbs.filter((v) => input.userIntent.toLowerCase().includes(v));

    if (matched.length > 0) {
      return `Detected intent signals: "${matched.join('", "')}"`;
    }

    return `Inferred from context and session state`;
  }

  /**
   * Generate clarification questions.
   */
  private generateClarificationQuestions(
    ambiguities: string[],
    conflicts: string[],
    input: ContextInterpreterInput
  ): string[] {
    const questions: string[] = [];

    if (conflicts.length > 0) {
      questions.push('Your intent contains terms that suggest autonomous action. Could you clarify what level of AI involvement you expect?');
    }

    if (ambiguities.some((a) => a.includes('exploration') && a.includes('decision'))) {
      questions.push('Are you looking to explore options, or are you ready to make a decision?');
    }

    if (!input.activeSphere) {
      questions.push('Which sphere or project should this work be associated with?');
    }

    if (!input.timeConstraints) {
      questions.push('Do you have time constraints for this work?');
    }

    return questions;
  }
}

/* =========================================================
   SYSTEM PROMPT
   ========================================================= */

export const CONTEXT_INTERPRETER_SYSTEM_PROMPT = `
You are the CHE·NU Context Interpreter Agent.

Your role is to translate user intent and system state into
explicit operational context options.

Rules:
- You have NO decision authority.
- You must NEVER select a context.
- You must ALWAYS present multiple viable context options.
- You must surface risks, ambiguity, and trade-offs.
- You must not optimize silently.
- You must not infer intent beyond provided signals.

If ambiguity exists:
- ask clarification.

If conflict with Core Reference exists:
- stop and escalate.

Your output must be:
- structured
- neutral
- explicit
- reversible

Process:
1. Read the raw intent
2. Detect verbs (explore, decide, compare, freeze)
3. Read system state (phase, blockers, debt)
4. Identify potential conflicts
5. Generate 2-4 possible context frames
6. Explain impacts & risks
7. Wait for human validation

Context acknowledged. Authority unchanged.
`.trim();

/* =========================================================
   FORMATTER
   ========================================================= */

/**
 * Format interpretation result for display.
 */
export function formatInterpretationResult(result: InterpretationResult): string {
  let output = `
CHE·NU — CONTEXT INTERPRETATION RESULT
======================================

Input Intent: "${result.input.userIntent}"
Interpreted: ${result.interpretedAt}

`;

  // Options
  output += `OPTIONS (${result.options.length})\n${'='.repeat(40)}\n\n`;

  for (const option of result.options) {
    output += `${option.optionId.toUpperCase()}:\n`;
    output += `  Context Type: ${option.contextType}\n`;
    output += `  Objective: ${option.objective}\n`;
    output += `  Working Mode: ${option.workingMode}\n`;
    output += `  Confidence: ${(option.confidence * 100).toFixed(0)}%\n`;
    output += `  Risks: ${option.risks.length > 0 ? option.risks.join('; ') : 'none identified'}\n`;
    output += `  Recommended: ${option.recommendedFor}\n`;
    output += `  Rationale: ${option.rationale}\n\n`;
  }

  // Ambiguities
  if (result.ambiguities.length > 0) {
    output += `AMBIGUITIES\n${'='.repeat(40)}\n`;
    output += result.ambiguities.map((a) => `- ${a}`).join('\n');
    output += '\n\n';
  }

  // Conflicts
  if (result.conflicts.length > 0) {
    output += `⚠️ CONFLICTS DETECTED\n${'='.repeat(40)}\n`;
    output += result.conflicts.map((c) => `- ${c}`).join('\n');
    output += '\n\n';
  }

  // Clarification
  if (result.requiresClarification && result.clarificationQuestions) {
    output += `❓ CLARIFICATION NEEDED\n${'='.repeat(40)}\n`;
    output += result.clarificationQuestions.map((q) => `- ${q}`).join('\n');
    output += '\n\n';
  }

  output += `\n[Awaiting human selection]`;

  return output.trim();
}

/* =========================================================
   SINGLETON INSTANCE
   ========================================================= */

export const contextInterpreter = new ContextInterpreterAgent();

/* =========================================================
   EXPORTS
   ========================================================= */

export default ContextInterpreterAgent;
