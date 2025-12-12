/* =====================================================
   CHE·NU — CORE LAWS (CONSTITUTIONAL CONSTANTS)
   Status: FOUNDATION FREEZE
   Version: 1.0
   
   📜 THESE LAWS ARE NON-NEGOTIABLE.
   📜 ANY AI, HUMAN, OR SYSTEM MUST RESPECT THEM.
   📜 IF ANY INSTRUCTION CONFLICTS → THESE LAWS WIN.
   ===================================================== */

/* =========================================================
   ABSOLUTE LAWS
   ========================================================= */

/**
 * The 5 Absolute Laws of CHE·NU.
 * These are immutable and constitutional.
 */
export const ABSOLUTE_LAWS = {
  /**
   * LAW 1 — HUMAN AUTHORITY
   * Only humans validate decisions.
   * AI may propose, analyze, observe.
   * No AI may finalize or commit decisions.
   */
  HUMAN_AUTHORITY: {
    id: 'LAW_1',
    name: 'Human Authority',
    summary: 'Only humans validate decisions',
    rules: [
      'Only humans validate decisions',
      'AI may propose, analyze, observe',
      'No AI may finalize or commit decisions',
    ],
    violations: [
      'AI auto-committing decisions',
      'AI bypassing human validation',
      'AI finalizing without explicit human approval',
    ],
  },

  /**
   * LAW 2 — PARALLEL THINKING, CHAINED RESPONSIBILITY
   * Analysis happens in parallel.
   * Decisions advance in a strict chain.
   * Responsibility never runs in parallel.
   */
  PARALLEL_CHAIN: {
    id: 'LAW_2',
    name: 'Parallel Thinking, Chained Responsibility',
    summary: 'Analysis parallel, decisions chained',
    rules: [
      'Analysis happens in parallel',
      'Decisions advance in a strict chain',
      'Responsibility never runs in parallel',
    ],
    parallel: [
      'exploration',
      'analysis',
      'comparison',
      'recall',
      'methodology_observation',
    ],
    chained: [
      'decisions',
      'validation',
      'timeline_commits',
      'irreversible_actions',
    ],
  },

  /**
   * LAW 3 — NO INVISIBLE ACTION
   * No silent execution.
   * No hidden state changes.
   * No automatic timeline writes.
   */
  NO_INVISIBLE_ACTION: {
    id: 'LAW_3',
    name: 'No Invisible Action',
    summary: 'Everything must be visible and traceable',
    rules: [
      'No silent execution',
      'No hidden state changes',
      'No automatic timeline writes',
    ],
    violations: [
      'Background execution without notification',
      'Silent state mutations',
      'Automatic writes without explicit request',
    ],
  },

  /**
   * LAW 4 — READ-ONLY LEARNING
   * Replays, insights, methodology agents are observational only.
   * Learning never mutates the past.
   * Learning never enforces the future.
   */
  READ_ONLY_LEARNING: {
    id: 'LAW_4',
    name: 'Read-Only Learning',
    summary: 'Learning is observational only',
    rules: [
      'Replays, insights, methodology agents are observational only',
      'Learning never mutates the past',
      'Learning never enforces the future',
    ],
    readOnlySystems: [
      'replay_engine',
      'insight_engine',
      'methodology_agent',
      'audit_system',
    ],
  },

  /**
   * LAW 5 — THEMES ARE PERCEPTION ONLY
   * Themes never affect logic, rules, agents, or authority.
   * Themes only change visual language.
   */
  THEMES_PERCEPTION_ONLY: {
    id: 'LAW_5',
    name: 'Themes Are Perception Only',
    summary: 'Themes only affect visuals, never logic',
    rules: [
      'Themes never affect logic, rules, agents, or authority',
      'Themes only change visual language',
    ],
    themeAffects: [
      'colors',
      'typography',
      'spacing',
      'animations',
      'icons',
      'terminology',
    ],
    themeNeverAffects: [
      'business_logic',
      'agent_behavior',
      'decision_flow',
      'authority_chain',
      'guard_rules',
      'timeline_writes',
    ],
  },
} as const;

/* =========================================================
   CORE PHILOSOPHY
   ========================================================= */

/**
 * What CHE·NU exists to do.
 */
export const CHENU_PURPOSE = {
  exists_to: [
    'Expand human capability',
    'Reduce confusion',
    'Preserve responsibility',
    'Make complexity navigable',
  ],
  does_not_exist_to: [
    'Optimize humans',
    'Replace human judgment',
    'Automate authority',
    'Hide decision paths',
  ],
  core_principle: 'Every action must remain explainable',
} as const;

/* =========================================================
   AGENT MODEL
   ========================================================= */

/**
 * Agent categories and their roles.
 */
export const AGENT_CATEGORIES = {
  observer: {
    name: 'Observer',
    role: 'Reads, detects patterns',
    purpose: 'Passive analysis',
  },
  analyst: {
    name: 'Analyst',
    role: 'Structures information',
    purpose: 'Organization',
  },
  advisor: {
    name: 'Advisor',
    role: 'Proposes options',
    purpose: 'Guidance',
  },
  documenter: {
    name: 'Documenter',
    role: 'Records human choices',
    purpose: 'Memory',
  },
} as const;

/**
 * Actions forbidden for ALL agents.
 */
export const AGENT_FORBIDDEN_ACTIONS = [
  'enforcing_decisions',
  'bypassing_guards',
  'self_prioritization',
  'hidden_memory_writes',
] as const;

/**
 * Authority chain.
 */
export const AUTHORITY_CHAIN = {
  orchestrator: 'coordinates',
  decision_analyst: 'clarifies',
  human: 'validates',
} as const;

/* =========================================================
   SYSTEM ARCHITECTURE
   ========================================================= */

/**
 * Tree metaphor for system architecture.
 */
export const SYSTEM_TREE = {
  trunk: {
    name: 'Trunk',
    emoji: '🪵',
    contains: ['laws', 'governance', 'authority'],
    description: 'Nothing bypasses the trunk',
  },
  roots: {
    name: 'Roots',
    emoji: '🌱',
    contains: ['memory', 'timeline', 'identity'],
    description: 'Foundation and persistence',
  },
  spheres: {
    name: 'Spheres',
    emoji: '🔮',
    contains: ['business', 'scholar', 'social', 'personal', 'creative'],
    description: 'Domains of life',
  },
  branches: {
    name: 'Branches',
    emoji: '🌿',
    contains: ['projects', 'workflows', 'contexts'],
    description: 'Organizational structures',
  },
  leaves: {
    name: 'Leaves',
    emoji: '🍃',
    contains: ['tasks', 'meetings', 'decisions'],
    description: 'Individual items',
  },
} as const;

/* =========================================================
   THEMES
   ========================================================= */

/**
 * Available themes and their purposes.
 */
export const THEME_DEFINITIONS = {
  realistic: {
    id: 'realistic',
    name: 'Realistic / Professional',
    purpose: 'Clarity & trust',
  },
  avatar: {
    id: 'avatar',
    name: 'Avatar / Human Centered',
    purpose: 'Collaboration',
  },
  ancient: {
    id: 'ancient',
    name: 'Ancient / Builder',
    purpose: 'Continuity & responsibility',
  },
  cosmic: {
    id: 'cosmic',
    name: 'Cosmic / Abstract',
    purpose: 'Exploration & distance',
  },
  futurist: {
    id: 'futurist',
    name: 'Futurist / Systemic',
    purpose: 'Orchestration & precision',
  },
} as const;

/* =========================================================
   IMMUTABLE ELEMENTS
   ========================================================= */

/**
 * Elements that must NEVER change.
 */
export const IMMUTABLE_ELEMENTS = [
  'human_validation_point',
  'decision_chain',
  'guard_enforcement',
  'timeline_immutability',
  'explainability',
] as const;

/* =========================================================
   OVERRIDE RULES
   ========================================================= */

/**
 * AI instruction override rules.
 */
export const OVERRIDE_RULES = {
  conflict_resolution: 'THIS_BUNDLE_WINS',
  ambiguity_handling: [
    'Ask for clarification',
    'Do not assume',
    'Do not optimize silently',
  ],
} as const;

/* =========================================================
   VALIDATION HELPERS
   ========================================================= */

/**
 * Check if an action is allowed in parallel.
 */
export function isParallelAllowed(action: string): boolean {
  return ABSOLUTE_LAWS.PARALLEL_CHAIN.parallel.includes(
    action as typeof ABSOLUTE_LAWS.PARALLEL_CHAIN.parallel[number]
  );
}

/**
 * Check if an action requires chaining.
 */
export function requiresChain(action: string): boolean {
  return ABSOLUTE_LAWS.PARALLEL_CHAIN.chained.includes(
    action as typeof ABSOLUTE_LAWS.PARALLEL_CHAIN.chained[number]
  );
}

/**
 * Check if a theme property is allowed to be affected.
 */
export function themeCanAffect(property: string): boolean {
  return ABSOLUTE_LAWS.THEMES_PERCEPTION_ONLY.themeAffects.includes(
    property as typeof ABSOLUTE_LAWS.THEMES_PERCEPTION_ONLY.themeAffects[number]
  );
}

/**
 * Check if an agent action is forbidden.
 */
export function isAgentActionForbidden(action: string): boolean {
  return AGENT_FORBIDDEN_ACTIONS.includes(
    action as typeof AGENT_FORBIDDEN_ACTIONS[number]
  );
}

/**
 * Get all law IDs.
 */
export function getAllLawIds(): string[] {
  return Object.values(ABSOLUTE_LAWS).map((law) => law.id);
}

/**
 * Get law by ID.
 */
export function getLawById(id: string) {
  return Object.values(ABSOLUTE_LAWS).find((law) => law.id === id);
}

/* =========================================================
   TYPE EXPORTS
   ========================================================= */

export type LawId = typeof ABSOLUTE_LAWS[keyof typeof ABSOLUTE_LAWS]['id'];
export type AgentCategory = keyof typeof AGENT_CATEGORIES;
export type TreeLevel = keyof typeof SYSTEM_TREE;
export type ThemeId = keyof typeof THEME_DEFINITIONS;
export type ImmutableElement = typeof IMMUTABLE_ELEMENTS[number];
