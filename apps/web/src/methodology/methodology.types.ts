/* =====================================================
   CHE·NU — METHODOLOGY AGENT TYPES & SCHEMAS
   Version: 1.0
   Scope: Methodology / Observation / Advisory
   
   📜 CORE PRINCIPLE:
   The Methodology Agent NEVER optimizes humans.
   It ONLY observes flows, compares them to existing methodologies,
   and suggests structured adjustments that a human may adopt or ignore.
   
   📜 MUST RESPECT:
   - All CHE·NU laws (parallel vs chain, human authority, no timeline writes)
   - Treat methodology as a TOOL, not as a NORM
   - Be explicit about uncertainty and tradeoffs
   
   📜 FORBIDDEN ACTIONS:
   - Change code
   - Change runtime config
   - Write to timeline
   - Enforce a methodology
   ===================================================== */

/* =========================================================
   ROLES
   ========================================================= */

/**
 * The "Methodology Agent" is a logical family with 3 sub-roles.
 */
export type MethodologyAgentRole =
  | 'observer'   // Reads replays, flows, guard triggers, and outcomes
  | 'advisor'    // Maps patterns to possible methodologies
  | 'documenter'; // Turns validated choices into reusable snippets

/**
 * Role descriptions for documentation and UI.
 */
export const METHODOLOGY_ROLES: Record<MethodologyAgentRole, {
  name: string;
  description: string;
  canDo: string[];
  cannotDo: string[];
}> = {
  observer: {
    name: 'Methodology Observer',
    description: 'Reads replays, flows, guard triggers, and outcomes. Never judges the user. Only describes patterns and friction points.',
    canDo: [
      'Read replay data',
      'Identify patterns',
      'Describe friction points',
      'Generate insights',
    ],
    cannotDo: [
      'Change code',
      'Change runtime config',
      'Write to timeline',
      'Enforce methodology',
      'Judge the user',
    ],
  },
  advisor: {
    name: 'Methodology Advisor',
    description: 'Maps patterns to possible methodologies. Suggests structured flows or presets. Explains tradeoffs.',
    canDo: [
      'Map patterns to methodologies',
      'Suggest structured flows',
      'Explain tradeoffs',
      'Compare approaches',
    ],
    cannotDo: [
      'Change code',
      'Change runtime config',
      'Write to timeline',
      'Enforce methodology',
      'Auto-apply suggestions',
    ],
  },
  documenter: {
    name: 'Methodology Documenter',
    description: 'Turns validated choices into clear, reusable methodology snippets. Writes human-readable documentation.',
    canDo: [
      'Create documentation',
      'Generate snippets',
      'Suggest updates to existing docs',
      'Write human-readable explanations',
    ],
    cannotDo: [
      'Change code',
      'Change runtime config',
      'Write to timeline',
      'Enforce methodology',
      'Auto-apply to system config',
    ],
  },
};

/* =========================================================
   CONTEXT TYPES
   ========================================================= */

/**
 * Context for methodology agent operations.
 */
export interface MethodologyContext {
  /** Current session ID */
  sessionId: string;
  /** Sphere being analyzed */
  sphereId: string;
  /** Optional project context */
  projectId?: string;
  /** Optional meeting context */
  meetingId?: string;
  /** Current preset in use */
  currentPresetId?: string;
  /** User ID for attribution */
  userId?: string;
  /** Timestamp of analysis */
  timestamp?: number;
}

/**
 * Summary of replay data for methodology analysis.
 */
export interface MethodologyReplaySummary {
  /** Total number of events */
  eventsCount: number;
  /** Number of guard triggers */
  guardTriggerCount: number;
  /** Number of decisions made */
  decisionsCount: number;
  /** Average decision delay in milliseconds */
  averageDecisionDelayMs?: number;
  /** Number of rollbacks */
  rollbackCount?: number;
  /** Number of unique agents involved */
  uniqueAgentsCount?: number;
  /** Duration of session in milliseconds */
  sessionDurationMs?: number;
  /** Number of human inputs */
  humanInputCount?: number;
}

/* =========================================================
   INSIGHT TYPES
   ========================================================= */

/**
 * Types of methodology insights.
 */
export type MethodologyInsightType =
  | 'high_guard_density'
  | 'frequent_rollback'
  | 'long_decision_delay'
  | 'unused_agents'
  | 'overloaded_agents'
  | 'looping_navigation'
  | 'rapid_decisions'
  | 'low_human_engagement'
  | 'high_human_engagement'
  | 'agent_imbalance'
  | 'other';

/**
 * Severity levels for insights.
 */
export type InsightSeverity = 'low' | 'medium' | 'high';

/**
 * A methodology insight from observation.
 */
export interface MethodologyInsight {
  /** Unique ID */
  id?: string;
  /** Type of insight */
  type: MethodologyInsightType;
  /** Human-readable description */
  description: string;
  /** Severity level */
  severity: InsightSeverity;
  /** Evidence supporting this insight */
  evidence?: string[];
  /** Timestamp when detected */
  timestamp?: number;
  /** Related event IDs */
  relatedEventIds?: string[];
}

/**
 * Insight type descriptions for UI.
 */
export const INSIGHT_TYPE_LABELS: Record<MethodologyInsightType, string> = {
  high_guard_density: 'High Guard Density',
  frequent_rollback: 'Frequent Rollbacks',
  long_decision_delay: 'Long Decision Delays',
  unused_agents: 'Unused Agents',
  overloaded_agents: 'Overloaded Agents',
  looping_navigation: 'Looping Navigation',
  rapid_decisions: 'Rapid Decisions',
  low_human_engagement: 'Low Human Engagement',
  high_human_engagement: 'High Human Engagement',
  agent_imbalance: 'Agent Participation Imbalance',
  other: 'Other',
};

/* =========================================================
   PATTERN TYPES
   ========================================================= */

/**
 * A methodology pattern identified from observations.
 */
export interface MethodologyPattern {
  /** Pattern name */
  name: string;
  /** Human-readable description */
  description: string;
  /** Evidence supporting this pattern */
  evidence: string[];
  /** Frequency of occurrence */
  frequency?: 'rare' | 'occasional' | 'frequent' | 'constant';
  /** Confidence level */
  confidence?: 'low' | 'medium' | 'high';
  /** Related insight types */
  relatedInsights?: MethodologyInsightType[];
}

/* =========================================================
   PROPOSAL TYPES
   ========================================================= */

/**
 * Tradeoff levels for methodology proposals.
 */
export type TradeoffLevel = 'lower' | 'higher' | 'unknown' | 'same';

/**
 * Tradeoffs for a methodology proposal.
 */
export interface MethodologyTradeoffs {
  /** Token usage impact */
  tokens: TradeoffLevel;
  /** Time impact */
  time: TradeoffLevel;
  /** Cognitive load impact */
  cognitiveLoad: TradeoffLevel;
  /** Complexity impact */
  complexity?: TradeoffLevel;
  /** Flexibility impact */
  flexibility?: TradeoffLevel;
}

/**
 * A methodology proposal from the advisor.
 */
export interface MethodologyProposal {
  /** Unique ID */
  id: string;
  /** Short label */
  label: string;
  /** Full description */
  description: string;
  /** Steps to implement */
  steps: string[];
  /** Best use cases */
  bestFor: string[];
  /** Tradeoffs */
  tradeoffs: MethodologyTradeoffs;
  /** Always requires human validation */
  requiresHumanValidation: true;
  /** Related patterns */
  relatedPatterns?: string[];
  /** Alternative proposals */
  alternatives?: string[];
  /** Confidence level */
  confidence?: 'low' | 'medium' | 'high';
}

/* =========================================================
   SNIPPET TYPES
   ========================================================= */

/**
 * A reusable methodology snippet.
 */
export interface MethodologySnippet {
  /** Unique ID */
  id: string;
  /** Title */
  title: string;
  /** Human-readable narrative explanation */
  narrative: string;
  /** When to use this methodology */
  whenToUse: string[];
  /** How to apply (steps the human follows) */
  howToApply: string[];
  /** Known limitations */
  limitations: string[];
  /** Version */
  version?: string;
  /** Last updated timestamp */
  updatedAt?: number;
  /** Author (human who validated) */
  authorId?: string;
  /** Tags for search */
  tags?: string[];
}

/**
 * Suggested update to an existing snippet.
 */
export interface SnippetUpdateSuggestion {
  /** Snippet ID to update */
  snippetId: string;
  /** Reason for update */
  reason: string;
  /** Suggested change */
  suggestedChange: string;
  /** Section to update */
  section?: 'narrative' | 'whenToUse' | 'howToApply' | 'limitations' | 'title';
}

/* =========================================================
   INPUT / OUTPUT TYPES
   ========================================================= */

/**
 * Input for methodology agent operations.
 */
export interface MethodologyAgentInput {
  /** Which role to execute */
  role: MethodologyAgentRole;
  /** Context for the operation */
  context: MethodologyContext;
  /** Replay summary (for observer) */
  replaySummary?: MethodologyReplaySummary;
  /** Existing insights (for advisor) */
  insights?: MethodologyInsight[];
  /** Existing patterns (for advisor) */
  existingPatterns?: MethodologyPattern[];
  /** Existing snippets (for documenter) */
  existingSnippets?: MethodologySnippet[];
  /** Additional options */
  options?: {
    maxInsights?: number;
    maxProposals?: number;
    maxSnippets?: number;
    includeEvidence?: boolean;
  };
}

/**
 * Base output for all methodology agent roles.
 */
export interface MethodologyAgentOutputBase {
  /** Role that produced this output */
  role: MethodologyAgentRole;
  /** Summary of the operation */
  summary: string;
  /** Notes about uncertainty */
  uncertaintyNotes: string[];
  /** Always requires human validation */
  requiresHumanValidation: true;
  /** Timestamp of generation */
  timestamp: number;
  /** Processing time in ms */
  processingTimeMs?: number;
}

/**
 * Output from the Observer role.
 */
export interface MethodologyObserverOutput extends MethodologyAgentOutputBase {
  role: 'observer';
  /** Observations made */
  observations: MethodologyInsight[];
  /** Patterns suggested */
  suggestedPatterns: MethodologyPattern[];
}

/**
 * Output from the Advisor role.
 */
export interface MethodologyAdvisorOutput extends MethodologyAgentOutputBase {
  role: 'advisor';
  /** Proposed methodologies */
  proposedMethodologies: MethodologyProposal[];
  /** Comparison notes */
  comparisonNotes: string[];
}

/**
 * Output from the Documenter role.
 */
export interface MethodologyDocumenterOutput extends MethodologyAgentOutputBase {
  role: 'documenter';
  /** New snippets generated */
  newSnippets: MethodologySnippet[];
  /** Suggested updates to existing snippets */
  updateSuggestions: SnippetUpdateSuggestion[];
}

/**
 * Union type for any methodology agent output.
 */
export type AnyMethodologyAgentOutput =
  | MethodologyObserverOutput
  | MethodologyAdvisorOutput
  | MethodologyDocumenterOutput;

/* =========================================================
   TYPE GUARDS
   ========================================================= */

/**
 * Check if output is from Observer.
 */
export function isObserverOutput(
  output: AnyMethodologyAgentOutput
): output is MethodologyObserverOutput {
  return output.role === 'observer';
}

/**
 * Check if output is from Advisor.
 */
export function isAdvisorOutput(
  output: AnyMethodologyAgentOutput
): output is MethodologyAdvisorOutput {
  return output.role === 'advisor';
}

/**
 * Check if output is from Documenter.
 */
export function isDocumenterOutput(
  output: AnyMethodologyAgentOutput
): output is MethodologyDocumenterOutput {
  return output.role === 'documenter';
}

/* =========================================================
   CONSTANTS
   ========================================================= */

/**
 * Default thresholds for insight detection.
 */
export const INSIGHT_THRESHOLDS = {
  /** Guard triggers per 10 events */
  highGuardDensity: 3,
  /** Rollbacks per session */
  frequentRollback: 5,
  /** Decision delay in ms */
  longDecisionDelay: 30000,
  /** Agent participation ratio */
  agentImbalanceRatio: 3,
  /** Gap between events in ms */
  longGap: 60000,
  /** Rapid decisions threshold in ms */
  rapidDecisions: 5000,
} as const;

/**
 * Methodology agent version.
 */
export const METHODOLOGY_AGENT_VERSION = '1.0';
