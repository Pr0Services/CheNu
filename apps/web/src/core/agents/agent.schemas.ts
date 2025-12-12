/* =========================================================
   CHE·NU — Agent I/O Schemas
   
   Schémas d'entrée/sortie pour tous les agents.
   Ces types sont CANONIQUES et définissent les contrats
   entre agents et le système.
   
   📜 SYSTEM GUARANTEES (ENFORCED):
   - No agent output can mutate system state
   - No agent output can write to the timeline
   - All outputs require human validation
   - Orchestrator aggregates, never alters content
   ========================================================= */

/* -------------------------
   CORE SHARED TYPES
------------------------- */

export type AgentId = string;
export type SphereId = string;
export type PresetId = string;
export type TimelinePointer = string;

export type ConfidenceLevel = 'low' | 'medium' | 'high';

export interface AgentMeta {
  agentId: AgentId;
  agentType:
    | 'orchestrator'
    | 'decision_analyst'
    | 'context_analyzer'
    | 'preset_advisor'
    | 'memory_agent'
    | 'ux_observer'
    | 'sphere_agent'
    | 'temporary_agent';
  sphere?: SphereId; // optional, only for sphere agents
  ephemeral?: boolean;
}

/* -------------------------
   GLOBAL INPUT CONTEXT
------------------------- */

export interface AgentContext {
  activeSphere: SphereId | null;
  activePreset: PresetId | null;
  timelinePointer: TimelinePointer;
  sessionDurationSeconds: number;
  recentActions: string[];
}

/* -------------------------
   AGENT INPUT BASE
------------------------- */

export interface AgentInputBase {
  meta: AgentMeta;
  userStatement: string;
  context: AgentContext;
}

/* -------------------------
   AGENT OUTPUT BASE
------------------------- */

export interface AgentOutputBase {
  agentId: AgentId;
  summary: string; // human-readable, single paragraph max
  confidence: ConfidenceLevel;
  uncertaintyNotes?: string[];
  warnings?: string[];
  requiresHumanValidation: true; // ALWAYS true - enforced by type
}

/* =========================================================
   LEVEL 0 — ORCHESTRATOR
   ========================================================= */

export interface OrchestratorInput extends AgentInputBase {
  requestedAgents: AgentId[];
}

export interface OrchestratorOutput {
  aggregatedSummaries: AgentOutputBase[];
  neutralOptions: string[];
  nextHumanAction:
    | 'validate'
    | 'clarify'
    | 'choose_path'
    | 'do_nothing';
}

/* =========================================================
   LEVEL 1 — DECISION ANALYST
   ========================================================= */

export interface DecisionAnalystInput extends AgentInputBase {
  meta: AgentMeta & { agentType: 'decision_analyst' };
}

export interface DecisionAnalystOutput extends AgentOutputBase {
  intentSummary: string;
  decisionType: 'exploratory' | 'evaluative' | 'final';
  constraints: string[];
  unknowns: string[];
}

/* =========================================================
   LEVEL 1 — CONTEXT ANALYZER
   ========================================================= */

export interface ContextAnalyzerInput extends AgentInputBase {
  meta: AgentMeta & { agentType: 'context_analyzer' };
}

export interface ContextAnalyzerOutput extends AgentOutputBase {
  contextSnapshot: {
    sphere: SphereId | null;
    preset: PresetId | null;
    timelinePointer: TimelinePointer;
  };
  inconsistencies: string[];
  readinessState: 'not_ready' | 'partially_ready' | 'ready';
}

/* =========================================================
   LEVEL 1 — PRESET ADVISOR
   ========================================================= */

export interface PresetAdvisorInput extends AgentInputBase {
  meta: AgentMeta & { agentType: 'preset_advisor' };
}

export interface PresetAdvisorOutput extends AgentOutputBase {
  suggestedPresets: {
    presetId: PresetId;
    explanation: string;
  }[];
}

/* =========================================================
   LEVEL 1 — MEMORY AGENT
   ========================================================= */

export interface MemoryItem {
  timestamp: string;
  description: string;
  validated: true; // ONLY validated memories can be recalled
}

export interface MemoryAgentInput extends AgentInputBase {
  meta: AgentMeta & { agentType: 'memory_agent' };
}

export interface MemoryAgentOutput extends AgentOutputBase {
  recalledItems: MemoryItem[];
  relevanceExplanation: string;
}

/* =========================================================
   LEVEL 1 — UX OBSERVER
   ========================================================= */

export interface UXObserverInput extends AgentInputBase {
  meta: AgentMeta & { agentType: 'ux_observer' };
  interactionPatterns: string[];
  navigationLoops: number;
}

export interface UXObserverOutput extends AgentOutputBase {
  observation: string;
  gentleSuggestion?: string;
  detectedPatterns: string[];
}

/* =========================================================
   LEVEL 2 — SPHERE AGENT
   ========================================================= */

export interface SphereAgentInput extends AgentInputBase {
  meta: AgentMeta & { agentType: 'sphere_agent'; sphere: SphereId };
  domainData: Record<string, unknown>;
}

export interface SphereAgentOutput extends AgentOutputBase {
  domainConsiderations: string[];
  domainRisks: string[];
  domainConstraints: string[];
}

/* =========================================================
   LEVEL 3 — TEMPORARY / CONTEXTUAL AGENT
   ========================================================= */

export interface TemporaryAgentInput extends AgentInputBase {
  meta: AgentMeta & { agentType: 'temporary_agent'; ephemeral: true };
  contextData: Record<string, unknown>;
}

export interface TemporaryAgentOutput extends AgentOutputBase {
  reportType: 'summary' | 'comparison' | 'review';
  structuredData?: Record<string, unknown>;
}

/* =========================================================
   OUTPUT UNION (SAFE AGGREGATION)
   ========================================================= */

export type AnyAgentOutput =
  | DecisionAnalystOutput
  | ContextAnalyzerOutput
  | PresetAdvisorOutput
  | MemoryAgentOutput
  | UXObserverOutput
  | SphereAgentOutput
  | TemporaryAgentOutput;

export type AnyAgentInput =
  | OrchestratorInput
  | DecisionAnalystInput
  | ContextAnalyzerInput
  | PresetAdvisorInput
  | MemoryAgentInput
  | UXObserverInput
  | SphereAgentInput
  | TemporaryAgentInput;

/* =========================================================
   SYSTEM GUARANTEES (ENFORCED)
   ========================================================= */

// - No agent output can mutate system state
// - No agent output can write to the timeline
// - All outputs require human validation
// - Orchestrator aggregates, never alters content

/* =========================================================
   TYPE GUARDS
   ========================================================= */

export function isDecisionAnalystOutput(
  output: AnyAgentOutput
): output is DecisionAnalystOutput {
  return 'intentSummary' in output && 'decisionType' in output;
}

export function isContextAnalyzerOutput(
  output: AnyAgentOutput
): output is ContextAnalyzerOutput {
  return 'contextSnapshot' in output && 'readinessState' in output;
}

export function isPresetAdvisorOutput(
  output: AnyAgentOutput
): output is PresetAdvisorOutput {
  return 'suggestedPresets' in output;
}

export function isMemoryAgentOutput(
  output: AnyAgentOutput
): output is MemoryAgentOutput {
  return 'recalledItems' in output;
}

export function isUXObserverOutput(
  output: AnyAgentOutput
): output is UXObserverOutput {
  return 'observation' in output && 'detectedPatterns' in output;
}

export function isSphereAgentOutput(
  output: AnyAgentOutput
): output is SphereAgentOutput {
  return 'domainConsiderations' in output;
}

export function isTemporaryAgentOutput(
  output: AnyAgentOutput
): output is TemporaryAgentOutput {
  return 'reportType' in output;
}

/* =========================================================
   VALIDATION HELPERS
   ========================================================= */

/**
 * Vérifie qu'une sortie agent respecte les garanties système
 */
export function validateAgentOutput(output: AgentOutputBase): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!output.agentId) {
    errors.push('Missing agentId');
  }

  if (!output.summary || output.summary.length === 0) {
    errors.push('Missing summary');
  }

  if (!output.confidence) {
    errors.push('Missing confidence level');
  }

  // CRITICAL: Must always require human validation
  if (output.requiresHumanValidation !== true) {
    errors.push('CRITICAL: requiresHumanValidation must be true');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Créer un contexte agent par défaut
 */
export function createDefaultContext(): AgentContext {
  return {
    activeSphere: null,
    activePreset: null,
    timelinePointer: 'HEAD',
    sessionDurationSeconds: 0,
    recentActions: [],
  };
}

/**
 * Créer les métadonnées d'un agent
 */
export function createAgentMeta(
  agentType: AgentMeta['agentType'],
  options?: { sphere?: SphereId; ephemeral?: boolean }
): AgentMeta {
  return {
    agentId: `${agentType}_${Date.now()}`,
    agentType,
    sphere: options?.sphere,
    ephemeral: options?.ephemeral,
  };
}
