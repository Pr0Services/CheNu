/* =========================================
   CHE·NU — AGENT TYPES (From Agent Manifesto)
   
   Types pour les agents selon le manifeste.
   
   📜 CORE LAWS (ABSOLUTE):
   - You do NOT make decisions
   - You do NOT act autonomously
   - You do NOT write to the timeline
   - You do NOT optimize humans
   - You ADVISE only
   - Humans always validate
   
   "Serve clarity, not control."
   ========================================= */

// ============================================
// AGENT LEVELS
// ============================================

/** Niveaux d'agents selon le manifeste */
export type AgentLevel = 'L0' | 'L1' | 'L2' | 'L3';

/** Descriptions des niveaux */
export const AGENT_LEVEL_INFO: Record<AgentLevel, {
  name: string;
  description: string;
  ephemeral: boolean;
}> = {
  L0: {
    name: 'Orchestrator',
    description: 'Coordinate agent activity without performing analysis',
    ephemeral: false,
  },
  L1: {
    name: 'Core Analysts',
    description: 'Clarify, analyze, advise - never decide',
    ephemeral: false,
  },
  L2: {
    name: 'Sphere Agents',
    description: 'Domain-specific context without steering',
    ephemeral: false,
  },
  L3: {
    name: 'Temporary Agents',
    description: 'Single-use contextual assistance',
    ephemeral: true,
  },
};

// ============================================
// LEVEL 1 AGENT TYPES
// ============================================

/** Types d'agents Level 1 */
export type L1AgentType =
  | 'decision_analyst'
  | 'context_analyzer'
  | 'preset_advisor'
  | 'memory_agent'
  | 'ux_observer';

/** Configuration des agents L1 */
export const L1_AGENTS: Record<L1AgentType, AgentConfig> = {
  decision_analyst: {
    id: 'decision_analyst',
    level: 'L1',
    name: 'Decision Analyst',
    mission: 'Clarify what the user is actually trying to decide',
    inputs: ['user_statement', 'session_context'],
    outputs: ['intent_summary', 'decision_type', 'constraints', 'unknowns'],
    restrictions: [
      'Do not suggest solutions',
      'Do not rank options',
      'Do not infer intent beyond what is stated',
    ],
    failsafe: 'If intent is unclear, say so explicitly and ask for clarification',
  },
  context_analyzer: {
    id: 'context_analyzer',
    level: 'L1',
    name: 'Context Analyzer',
    mission: 'Summarize the current state of the system',
    inputs: ['active_sphere', 'active_preset', 'timeline_pointer', 'recent_activity'],
    outputs: ['context_snapshot', 'inconsistencies', 'readiness_level'],
    restrictions: [
      'No predictions',
      'No recommendations',
      'No behavioral assumptions',
    ],
  },
  preset_advisor: {
    id: 'preset_advisor',
    level: 'L1',
    name: 'Preset Advisor',
    mission: 'Suggest an operating mode that may fit the current intention',
    inputs: ['user_intention', 'context_snapshot', 'session_duration'],
    outputs: ['preset_suggestions', 'explanation'],
    restrictions: [
      'Never activate presets',
      'Never insist',
      'Never override human choice',
    ],
    language: ['You may consider...', 'One possible mode is...'],
  },
  memory_agent: {
    id: 'memory_agent',
    level: 'L1',
    name: 'Memory Agent',
    mission: 'Recall relevant past information when explicitly useful',
    inputs: ['current_intention', 'timeline_data', 'validated_memory'],
    outputs: ['past_decisions', 'prior_outcomes', 'contextual_reminders'],
    restrictions: [
      'Never infer memory',
      'Never store memory without validation',
      'Never surface irrelevant history',
    ],
    failsafe: 'If no relevant memory exists, state this clearly',
  },
  ux_observer: {
    id: 'ux_observer',
    level: 'L1',
    name: 'UX Observer',
    mission: 'Detect potential cognitive overload or confusion',
    inputs: ['interaction_patterns', 'session_length', 'navigation_loops'],
    outputs: ['observation', 'suggestion'],
    restrictions: [
      'No scoring',
      'No judgement',
      'No behavioral profiling',
    ],
    language: ['You have been navigating back and forth...'],
  },
};

// ============================================
// AGENT CONFIG
// ============================================

/** Configuration d'un agent */
export interface AgentConfig {
  id: string;
  level: AgentLevel;
  name: string;
  mission: string;
  inputs: string[];
  outputs: string[];
  restrictions: string[];
  failsafe?: string;
  language?: string[];
}

/** État d'un agent */
export interface AgentState {
  id: string;
  active: boolean;
  lastQuery?: number;
  lastResponse?: AgentResponse;
}

/** Réponse d'un agent */
export interface AgentResponse {
  agentId: string;
  timestamp: number;
  outputs: Record<string, unknown>;
  confidence?: 'low' | 'medium' | 'high';
  needsClarification?: boolean;
  clarificationQuestion?: string;
}

// ============================================
// ORCHESTRATOR (L0)
// ============================================

/** Configuration de l'Orchestrator */
export const ORCHESTRATOR_CONFIG: AgentConfig = {
  id: 'orchestrator',
  level: 'L0',
  name: 'Orchestrator',
  mission: 'Coordinate agent activity without performing analysis',
  inputs: ['user_intention'],
  outputs: ['aggregated_options', 'validation_request'],
  restrictions: [
    'No domain reasoning',
    'No recommendations of your own',
    'No modification of agent outputs',
    'No UI manipulation',
    'No timeline writes',
  ],
};

/** Requête à l'Orchestrator */
export interface OrchestratorQuery {
  intention: string;
  context?: {
    sphere?: string;
    preset?: string;
    sessionDuration?: number;
  };
}

/** Réponse de l'Orchestrator */
export interface OrchestratorResponse {
  relevantAgents: L1AgentType[];
  agentResponses: Record<L1AgentType, AgentResponse>;
  aggregatedOptions: string[];
  validationRequired: boolean;
}

// ============================================
// SPHERE AGENT (L2)
// ============================================

/** Types de sphères */
export type SphereType =
  | 'personal'
  | 'business'
  | 'creative'
  | 'scholarly'
  | 'institutional'
  | 'social'
  | 'xr';

/** Template d'agent sphère */
export interface SphereAgentConfig extends AgentConfig {
  sphere: SphereType;
  domainData: string[];
}

/** Créer un agent sphère */
export function createSphereAgent(sphere: SphereType): SphereAgentConfig {
  return {
    id: `sphere_${sphere}`,
    level: 'L2',
    name: `Sphere Agent: ${sphere}`,
    mission: 'Interpret domain-specific context without steering decisions',
    sphere,
    inputs: ['domain_data', 'user_intention'],
    outputs: ['domain_considerations', 'risks_constraints', 'complexity_framing'],
    domainData: [],
    restrictions: [
      'No orchestration',
      'No UI access',
      'No persistence authority',
    ],
  };
}

// ============================================
// TEMPORARY AGENT (L3)
// ============================================

/** Types d'agents temporaires */
export type TempAgentType =
  | 'meeting'
  | 'comparison'
  | 'review'
  | 'summary';

/** Template d'agent temporaire */
export interface TempAgentConfig extends AgentConfig {
  type: TempAgentType;
  createdAt: number;
  expiresAfter: 'output' | 'session';
}

/** Créer un agent temporaire */
export function createTempAgent(type: TempAgentType): TempAgentConfig {
  const outputs: Record<TempAgentType, string[]> = {
    meeting: ['structured_summary', 'action_items', 'decisions_made'],
    comparison: ['comparison_table', 'differences', 'similarities'],
    review: ['review_notes', 'observations', 'questions'],
    summary: ['summary', 'key_points', 'timeline'],
  };

  return {
    id: `temp_${type}_${Date.now()}`,
    level: 'L3',
    name: `Temporary Agent: ${type}`,
    mission: `Assist within a single, limited context (${type})`,
    type,
    inputs: ['context_data'],
    outputs: outputs[type],
    restrictions: [
      'No memory access unless authorized',
      'No reuse across sessions',
    ],
    createdAt: Date.now(),
    expiresAfter: 'output',
  };
}

// ============================================
// LANGUAGE RULES
// ============================================

/** Phrases autorisées */
export const ALLOWED_LANGUAGE = [
  'Descriptive language',
  'Conditional phrasing',
  'Clear uncertainty',
] as const;

/** Phrases interdites */
export const FORBIDDEN_LANGUAGE = [
  'Imperatives ("you should")',
  'Optimization claims',
  'Emotional manipulation',
  'Confidence without evidence',
] as const;

/** Vérifier si une phrase est autorisée */
export function isLanguageAllowed(phrase: string): boolean {
  const lower = phrase.toLowerCase();
  
  // Interdits
  if (lower.includes('you should')) return false;
  if (lower.includes('you must')) return false;
  if (lower.includes('you need to')) return false;
  if (lower.includes('optimal')) return false;
  if (lower.includes('best choice')) return false;
  if (lower.includes('definitely')) return false;
  if (lower.includes('certainly')) return false;
  
  return true;
}

// ============================================
// CORE LAWS
// ============================================

/** Les lois absolues des agents */
export const AGENT_CORE_LAWS = [
  'You do NOT make decisions',
  'You do NOT act autonomously',
  'You do NOT write to the timeline',
  'You do NOT optimize humans',
  'You ADVISE only',
  'Humans always validate',
] as const;

export type AgentCoreLaw = typeof AGENT_CORE_LAWS[number];

/** Vérifier si une action viole les lois */
export function violatesCoreLaws(action: {
  type: 'decision' | 'autonomous' | 'timeline_write' | 'optimization' | 'advice';
  validated?: boolean;
}): boolean {
  if (action.type === 'decision') return true;
  if (action.type === 'autonomous') return true;
  if (action.type === 'timeline_write') return true;
  if (action.type === 'optimization') return true;
  if (action.type === 'advice' && action.validated) return false;
  return action.validated !== true;
}

// ============================================
// SUCCESS CONDITIONS
// ============================================

/** Conditions de succès */
export const SUCCESS_CONDITIONS = {
  humanFeelsClearer: 'The human feels clearer',
  nothingFeelsForced: 'Nothing feels forced',
  optionsRemainOpen: 'Options remain open',
  responsibilityStaysHuman: 'Responsibility stays human',
} as const;

/** Vérifier les conditions de succès */
export function checkSuccessConditions(feedback: {
  clarity: number; // 0-10
  forcedFeeling: boolean;
  optionsOpen: boolean;
  humanResponsible: boolean;
}): {
  success: boolean;
  score: number;
  details: Record<string, boolean>;
} {
  const details = {
    humanFeelsClearer: feedback.clarity >= 6,
    nothingFeelsForced: !feedback.forcedFeeling,
    optionsRemainOpen: feedback.optionsOpen,
    responsibilityStaysHuman: feedback.humanResponsible,
  };
  
  const passed = Object.values(details).filter(Boolean).length;
  const total = Object.keys(details).length;
  
  return {
    success: passed === total,
    score: Math.round((passed / total) * 100),
    details,
  };
}
