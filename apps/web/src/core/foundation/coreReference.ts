/* =====================================================
   CHE·NU — CORE REFERENCE TYPES & VALIDATOR
   Version: 1.0
   Status: FOUNDATION_FREEZE
   
   📜 PURPOSE:
   CHE·NU defines immutable foundations for human + AI cognition.
   This is a cognitive operating system, NOT a product.
   
   📜 PRIORITY:
   On conflict, this document wins.
   On ambiguity, ask for clarification.
   Never assume. Never optimize silently.
   ===================================================== */

import coreReferenceJson from './chenu.core.reference.json';

/* =========================================================
   CORE REFERENCE TYPES
   ========================================================= */

/**
 * Philosophy: What CHE·NU exists to do (and NOT do).
 */
export interface CorePhilosophy {
  existsTo: readonly string[];
  doesNotExistTo: readonly string[];
  explainabilityRequired: boolean;
}

/**
 * Law capability definitions.
 */
export interface LawCapabilities {
  aiMay: readonly string[];
  aiMayNot: readonly string[];
}

/**
 * Parallel vs Chain rule definition.
 */
export interface ParallelChainLaw {
  parallelAllowedFor: readonly string[];
  chainRequiredFor: readonly string[];
  responsibilityParallelForbidden: boolean;
}

/**
 * Read-only learning rule.
 */
export interface ReadOnlyLearningLaw {
  replay: 'read_only';
  insights: 'observational';
  learningCannot: readonly string[];
}

/**
 * Themes visual-only rule.
 */
export interface ThemesVisualOnlyLaw {
  themesAffect: readonly string[];
  themesDoNotAffect: readonly string[];
}

/**
 * All absolute laws.
 */
export interface AbsoluteLaws {
  LAW_1_HUMAN_AUTHORITY: {
    description: string;
  } & LawCapabilities;
  LAW_2_PARALLEL_VS_CHAIN: ParallelChainLaw;
  LAW_3_NO_INVISIBLE_ACTION: {
    silentExecution: false;
    hiddenStateChange: false;
    automaticTimelineWrite: false;
  };
  LAW_4_READ_ONLY_LEARNING: ReadOnlyLearningLaw;
  LAW_5_THEMES_ARE_VISUAL_ONLY: ThemesVisualOnlyLaw;
}

/**
 * System architecture components.
 */
export interface SystemArchitecture {
  model: 'living_tree';
  components: {
    trunk: readonly string[];
    roots: readonly string[];
    spheres: 'domains_of_life';
    branches: readonly string[];
    leaves: readonly string[];
  };
  bypassTrunkForbidden: true;
}

/**
 * Agent model definition.
 */
export interface AgentModel {
  agentsAre: 'tools';
  agentRoles: readonly string[];
  forbiddenCapabilities: readonly string[];
  specialAgents: {
    orchestrator: 'coordination_only';
    decision_analyst: 'clarification_only';
    human: 'final_authority';
  };
}

/**
 * Replay and memory rules.
 */
export interface ReplayAndMemory {
  replay: {
    mode: 'read_only';
    noReexecution: true;
    noOutcomeMutation: true;
  };
  memory: {
    longTerm: true;
    structured: true;
    inspectable: true;
    silentRewriteForbidden: true;
  };
}

/**
 * Methodology system rules.
 */
export interface MethodologySystem {
  methodologyIs: 'optional_assistive_tool';
  agentsMay: readonly string[];
  methodologyCannot: readonly string[];
}

/**
 * UX principles.
 */
export interface UXPrinciples {
  priorities: readonly string[];
  visualMust: readonly string[];
}

/**
 * AI instruction override rules.
 */
export interface AIInstructionOverride {
  priority: 'this_document';
  onConflict: 'this_document_wins';
  onAmbiguity: readonly string[];
}

/**
 * Complete CHE·NU Core Reference.
 */
export interface CheNuCoreReference {
  CHE_NU_CORE_REFERENCE_VERSION: string;
  STATUS: 'FOUNDATION_FREEZE';
  PURPOSE: {
    description: string;
    systemNature: 'cognitive_operating_system';
    notAProduct: true;
  };
  PHILOSOPHY: CorePhilosophy;
  ABSOLUTE_LAWS: AbsoluteLaws;
  SYSTEM_ARCHITECTURE: SystemArchitecture;
  AGENT_MODEL: AgentModel;
  PARALLEL_CHAIN_RULE: {
    parallelThinking: true;
    chainedResponsibility: true;
    exceptions: 'none';
  };
  MEETINGS_AND_XR: {
    meetingsPurpose: 'structured_decision_spaces';
    xrIs: 'perceptual_extension_only';
    xrDoesNotGrant: readonly string[];
  };
  REPLAY_AND_MEMORY: ReplayAndMemory;
  METHODOLOGY_SYSTEM: MethodologySystem;
  UX_PRINCIPLES: UXPrinciples;
  THEMES: {
    available: readonly string[];
    themeRule: 'visual_only';
  };
  IMMUTABLE_ELEMENTS: readonly string[];
  AI_INSTRUCTION_OVERRIDE: AIInstructionOverride;
}

/* =========================================================
   CORE REFERENCE INSTANCE
   ========================================================= */

/**
 * The frozen core reference.
 */
export const CORE_REFERENCE: CheNuCoreReference = coreReferenceJson as CheNuCoreReference;

/* =========================================================
   LAW ACCESSORS
   ========================================================= */

/**
 * Get Law 1: Human Authority.
 */
export function getLaw1HumanAuthority() {
  return CORE_REFERENCE.ABSOLUTE_LAWS.LAW_1_HUMAN_AUTHORITY;
}

/**
 * Get Law 2: Parallel vs Chain.
 */
export function getLaw2ParallelVsChain() {
  return CORE_REFERENCE.ABSOLUTE_LAWS.LAW_2_PARALLEL_VS_CHAIN;
}

/**
 * Get Law 3: No Invisible Action.
 */
export function getLaw3NoInvisibleAction() {
  return CORE_REFERENCE.ABSOLUTE_LAWS.LAW_3_NO_INVISIBLE_ACTION;
}

/**
 * Get Law 4: Read-Only Learning.
 */
export function getLaw4ReadOnlyLearning() {
  return CORE_REFERENCE.ABSOLUTE_LAWS.LAW_4_READ_ONLY_LEARNING;
}

/**
 * Get Law 5: Themes Visual Only.
 */
export function getLaw5ThemesVisualOnly() {
  return CORE_REFERENCE.ABSOLUTE_LAWS.LAW_5_THEMES_ARE_VISUAL_ONLY;
}

/* =========================================================
   VALIDATION FUNCTIONS
   ========================================================= */

/**
 * Validate action against Law 1 (Human Authority).
 */
export function validateHumanAuthority(action: string): {
  allowed: boolean;
  reason: string;
} {
  const law = getLaw1HumanAuthority();
  
  if (law.aiMayNot.includes(action)) {
    return {
      allowed: false,
      reason: `Action "${action}" is forbidden by Law 1: Human Authority`,
    };
  }
  
  if (law.aiMay.includes(action)) {
    return {
      allowed: true,
      reason: `Action "${action}" is allowed by Law 1: Human Authority`,
    };
  }
  
  return {
    allowed: false,
    reason: `Action "${action}" not explicitly allowed — default to human authority`,
  };
}

/**
 * Validate operation mode against Law 2 (Parallel vs Chain).
 */
export function validateParallelChain(
  operation: string,
  mode: 'parallel' | 'chain'
): {
  valid: boolean;
  reason: string;
} {
  const law = getLaw2ParallelVsChain();
  
  if (law.chainRequiredFor.includes(operation) && mode === 'parallel') {
    return {
      valid: false,
      reason: `Operation "${operation}" requires CHAIN mode, not parallel`,
    };
  }
  
  if (law.parallelAllowedFor.includes(operation)) {
    return {
      valid: true,
      reason: `Operation "${operation}" allows ${mode} mode`,
    };
  }
  
  // Default to chain for safety
  if (mode === 'chain') {
    return {
      valid: true,
      reason: `Chain mode is always safe`,
    };
  }
  
  return {
    valid: false,
    reason: `Operation "${operation}" not explicitly allowed for parallel mode`,
  };
}

/**
 * Validate action visibility against Law 3.
 */
export function validateVisibility(action: {
  isSilent?: boolean;
  isHidden?: boolean;
  isAutomatic?: boolean;
}): {
  valid: boolean;
  violations: string[];
} {
  const violations: string[] = [];
  
  if (action.isSilent) {
    violations.push('Silent execution is forbidden');
  }
  if (action.isHidden) {
    violations.push('Hidden state change is forbidden');
  }
  if (action.isAutomatic) {
    violations.push('Automatic timeline write is forbidden');
  }
  
  return {
    valid: violations.length === 0,
    violations,
  };
}

/**
 * Validate replay/learning operation against Law 4.
 */
export function validateReadOnlyLearning(operation: string): {
  valid: boolean;
  reason: string;
} {
  const law = getLaw4ReadOnlyLearning();
  
  if (law.learningCannot.includes(operation)) {
    return {
      valid: false,
      reason: `Learning cannot "${operation}" — violates Law 4`,
    };
  }
  
  return {
    valid: true,
    reason: 'Operation is read-only compliant',
  };
}

/**
 * Validate theme application against Law 5.
 */
export function validateThemeScope(affectedArea: string): {
  valid: boolean;
  reason: string;
} {
  const law = getLaw5ThemesVisualOnly();
  
  if (law.themesDoNotAffect.includes(affectedArea)) {
    return {
      valid: false,
      reason: `Themes cannot affect "${affectedArea}" — violates Law 5`,
    };
  }
  
  if (law.themesAffect.includes(affectedArea)) {
    return {
      valid: true,
      reason: `Themes may affect "${affectedArea}"`,
    };
  }
  
  return {
    valid: false,
    reason: `Area "${affectedArea}" not in allowed theme scope — default deny`,
  };
}

/* =========================================================
   AGENT VALIDATION
   ========================================================= */

/**
 * Validate agent capability.
 */
export function validateAgentCapability(capability: string): {
  allowed: boolean;
  reason: string;
} {
  const model = CORE_REFERENCE.AGENT_MODEL;
  
  if (model.forbiddenCapabilities.includes(capability)) {
    return {
      allowed: false,
      reason: `Agent capability "${capability}" is forbidden`,
    };
  }
  
  return {
    allowed: true,
    reason: 'Capability not in forbidden list',
  };
}

/**
 * Get agent role type.
 */
export function getAgentRoleType(agentId: string): string {
  const model = CORE_REFERENCE.AGENT_MODEL;
  
  if (agentId === 'orchestrator') {
    return model.specialAgents.orchestrator;
  }
  if (agentId === 'decision_analyst') {
    return model.specialAgents.decision_analyst;
  }
  if (agentId === 'human') {
    return model.specialAgents.human;
  }
  
  return 'tool'; // Default: agents are tools
}

/* =========================================================
   METHODOLOGY VALIDATION
   ========================================================= */

/**
 * Validate methodology operation.
 */
export function validateMethodologyOperation(operation: string): {
  allowed: boolean;
  reason: string;
} {
  const system = CORE_REFERENCE.METHODOLOGY_SYSTEM;
  
  if (system.methodologyCannot.includes(operation)) {
    return {
      allowed: false,
      reason: `Methodology cannot "${operation}"`,
    };
  }
  
  if (system.agentsMay.includes(operation)) {
    return {
      allowed: true,
      reason: `Methodology agents may "${operation}"`,
    };
  }
  
  return {
    allowed: false,
    reason: `Operation "${operation}" not explicitly allowed`,
  };
}

/* =========================================================
   COMPREHENSIVE VALIDATION
   ========================================================= */

export interface ActionValidation {
  action: string;
  mode?: 'parallel' | 'chain';
  isSilent?: boolean;
  isHidden?: boolean;
  isAutomatic?: boolean;
  affectsTheme?: string;
  agentCapability?: string;
  methodologyOp?: string;
}

export interface ValidationResult {
  valid: boolean;
  violations: string[];
  warnings: string[];
}

/**
 * Comprehensive action validation against all laws.
 */
export function validateAction(validation: ActionValidation): ValidationResult {
  const violations: string[] = [];
  const warnings: string[] = [];
  
  // Law 1: Human Authority
  const law1 = validateHumanAuthority(validation.action);
  if (!law1.allowed) {
    violations.push(`[LAW 1] ${law1.reason}`);
  }
  
  // Law 2: Parallel vs Chain
  if (validation.mode) {
    const law2 = validateParallelChain(validation.action, validation.mode);
    if (!law2.valid) {
      violations.push(`[LAW 2] ${law2.reason}`);
    }
  }
  
  // Law 3: No Invisible Action
  const law3 = validateVisibility({
    isSilent: validation.isSilent,
    isHidden: validation.isHidden,
    isAutomatic: validation.isAutomatic,
  });
  if (!law3.valid) {
    law3.violations.forEach((v) => violations.push(`[LAW 3] ${v}`));
  }
  
  // Law 4: Read-Only Learning (if applicable)
  if (['mutate_past', 'enforce_future', 'rewrite_timeline'].includes(validation.action)) {
    const law4 = validateReadOnlyLearning(validation.action);
    if (!law4.valid) {
      violations.push(`[LAW 4] ${law4.reason}`);
    }
  }
  
  // Law 5: Themes Visual Only
  if (validation.affectsTheme) {
    const law5 = validateThemeScope(validation.affectsTheme);
    if (!law5.valid) {
      violations.push(`[LAW 5] ${law5.reason}`);
    }
  }
  
  // Agent capability check
  if (validation.agentCapability) {
    const agentCheck = validateAgentCapability(validation.agentCapability);
    if (!agentCheck.allowed) {
      violations.push(`[AGENT] ${agentCheck.reason}`);
    }
  }
  
  // Methodology check
  if (validation.methodologyOp) {
    const methodCheck = validateMethodologyOperation(validation.methodologyOp);
    if (!methodCheck.allowed) {
      violations.push(`[METHODOLOGY] ${methodCheck.reason}`);
    }
  }
  
  return {
    valid: violations.length === 0,
    violations,
    warnings,
  };
}

/* =========================================================
   CONSTANTS
   ========================================================= */

export const CORE_VERSION = CORE_REFERENCE.CHE_NU_CORE_REFERENCE_VERSION;
export const CORE_STATUS = CORE_REFERENCE.STATUS;
export const IMMUTABLE_ELEMENTS = CORE_REFERENCE.IMMUTABLE_ELEMENTS;
export const AVAILABLE_THEMES = CORE_REFERENCE.THEMES.available;
