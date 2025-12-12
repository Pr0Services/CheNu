/* =========================================================
   CHE·NU — Parallel vs Chain Model
   
   Directional Work • Authority • Responsibility
   
   📜 LAW: "Complexity is processed in parallel. 
           Responsibility advances in chain."
   
   These laws override any local optimization, agent 
   preference, or domain logic.
   ========================================================= */

/* -------------------------
   BASIC ENUMS & TYPES
------------------------- */

export type AgentType =
  | 'orchestrator'
  | 'decision_analyst'
  | 'context_analyzer'
  | 'memory_agent'
  | 'preset_advisor'
  | 'ux_observer'
  | 'sphere_agent'
  | 'methodology_agent'
  | 'temporary_agent';

export type FlowStage =
  | 'user_intention'
  | 'parallel_analysis'
  | 'orchestration'
  | 'decision_clarification'
  | 'human_validation'
  | 'timeline_write'
  | 'return_to_neutral';

export type WorkMode = 'parallel' | 'chain';

export interface FlowNode {
  id: FlowStage;
  label: string;
}

/* -------------------------
   PARALLEL WORK SPEC
------------------------- */

export interface ParallelWorkSpec {
  mode: 'parallel';
  description: string;
  usedFor: string[];
  allowedAgentTypes: AgentType[];
  forbiddenBehaviors: string[];
}

/* -------------------------
   CHAINED DECISION SPEC
------------------------- */

export interface ChainDecisionSpec {
  mode: 'chain';
  description: string;
  triggers: string[];
  sequence: FlowStage[];
  immutable: true;
}

/* -------------------------
   AUTHORITY & RESPONSIBILITY
------------------------- */

export interface AuthorityRules {
  agentsDecide: false;
  agentsWriteTimeline: false;
  orchestratorDecides: false;
  humanIsFinalAuthority: true;
}

/* -------------------------
   ROLLBACK RULES
------------------------- */

export interface RollbackRules {
  strategy: 'reinterpret_state';
  writesTimeline: false;
  canDeleteEvents: false;
  canRewriteHistory: false;
  canMaskDecisions: false;
}

/* -------------------------
   VALIDITY CRITERIA
------------------------- */

export interface SystemValidityCriteria {
  complexityHandledInParallel: true;
  responsibilityAdvancesInChain: true;
  humanNeverPressured: true;
  decisionAlwaysClear: true;
  rollbackPreservesResponsibility: true;
}

/* -------------------------
   FULL MODEL SPEC
------------------------- */

export interface CheNuParallelChainModel {
  version: 'parallel-chain-1.0';
  law: string;
  parallelWork: ParallelWorkSpec;
  chainDecision: ChainDecisionSpec;
  authority: AuthorityRules;
  rollback: RollbackRules;
  validity: SystemValidityCriteria;
  flowDiagram: {
    nodes: FlowNode[];
    edges: Array<{ from: FlowStage; to: FlowStage }>;
    mermaid: string;
  };
}

/* =========================================================
   ✅ OFFICIAL INSTANCE (FROZEN)
   ========================================================= */

export const CHE_NU_PARALLEL_CHAIN_MODEL: Readonly<CheNuParallelChainModel> = Object.freeze({
  version: 'parallel-chain-1.0',

  law: 'Complexity is processed in parallel. Responsibility advances in chain.',

  parallelWork: {
    mode: 'parallel',
    description:
      'Default mode where multiple agents analyze, recall, observe, and contextualize without deciding.',
    usedFor: [
      'exploration',
      'analysis',
      'comparison',
      'contextualization',
      'memory_recall',
      'methodology',
      'ux_observation',
    ],
    allowedAgentTypes: [
      'decision_analyst',
      'context_analyzer',
      'memory_agent',
      'preset_advisor',
      'ux_observer',
      'sphere_agent',
      'methodology_agent',
      'temporary_agent',
    ],
    forbiddenBehaviors: [
      'synthesizing_other_agents_outputs',
      'prioritizing_one_agent_over_another',
      'mutual_influence_between_agents',
      'final_decision_making',
    ],
  },

  chainDecision: {
    mode: 'chain',
    description:
      'Sequential flow enforced whenever a decision or durable change is at stake.',
    triggers: [
      'decision_envisioned',
      'temporal_commitment_required',
      'durable_state_change_possible',
      'timeline_write_involved',
    ],
    immutable: true,
    sequence: [
      'user_intention',
      'parallel_analysis',
      'orchestration',
      'decision_clarification',
      'human_validation',
      'timeline_write',
    ],
  },

  authority: {
    agentsDecide: false,
    agentsWriteTimeline: false,
    orchestratorDecides: false,
    humanIsFinalAuthority: true,
  },

  rollback: {
    strategy: 'reinterpret_state',
    writesTimeline: false,
    canDeleteEvents: false,
    canRewriteHistory: false,
    canMaskDecisions: false,
  },

  validity: {
    complexityHandledInParallel: true,
    responsibilityAdvancesInChain: true,
    humanNeverPressured: true,
    decisionAlwaysClear: true,
    rollbackPreservesResponsibility: true,
  },

  flowDiagram: {
    nodes: [
      { id: 'user_intention', label: 'User Intention' },
      { id: 'parallel_analysis', label: 'Parallel Agents (No Decisions)' },
      { id: 'orchestration', label: 'Orchestrator (Neutral Collection)' },
      { id: 'decision_clarification', label: 'Decision Analyst (Clarification Only)' },
      { id: 'human_validation', label: 'Human Validation' },
      { id: 'timeline_write', label: 'Timeline Write' },
      { id: 'return_to_neutral', label: 'Return to Neutral' },
    ],
    edges: [
      { from: 'user_intention', to: 'parallel_analysis' },
      { from: 'parallel_analysis', to: 'orchestration' },
      { from: 'orchestration', to: 'decision_clarification' },
      { from: 'decision_clarification', to: 'human_validation' },
      { from: 'human_validation', to: 'timeline_write' },
      { from: 'human_validation', to: 'return_to_neutral' },
    ],
    mermaid: `flowchart TB
    A[User Intention] --> B[Parallel Agents]

    subgraph Parallel_Work["Parallel Analysis (No Decisions)"]
        B --> C1[Context Analyzer]
        B --> C2[Memory Agent]
        B --> C3[Preset Advisor]
        B --> C4[UX Observer]
        B --> C5[Sphere Agents]
        B --> C6[Methodology Agents]
    end

    C1 --> D[Orchestrator]
    C2 --> D
    C3 --> D
    C4 --> D
    C5 --> D
    C6 --> D

    D --> E[Decision Analyst<br/>(Clarification Only)]

    E --> F{Human Validation}

    F -->|Approved| G[Timeline Write]
    F -->|Rejected| H[Return to Neutral State]

    G --> I[Continue / Resume]`,
  },
});

/* =========================================================
   VALIDATION HELPERS
   ========================================================= */

/**
 * Vérifie si un agent peut travailler en parallèle
 */
export function canWorkInParallel(agentType: AgentType): boolean {
  return CHE_NU_PARALLEL_CHAIN_MODEL.parallelWork.allowedAgentTypes.includes(agentType);
}

/**
 * Vérifie si un comportement est interdit en parallèle
 */
export function isForbiddenInParallel(behavior: string): boolean {
  return CHE_NU_PARALLEL_CHAIN_MODEL.parallelWork.forbiddenBehaviors.includes(behavior);
}

/**
 * Vérifie si une action déclenche le mode chain
 */
export function triggersChainMode(action: string): boolean {
  return CHE_NU_PARALLEL_CHAIN_MODEL.chainDecision.triggers.includes(action);
}

/**
 * Obtenir la séquence de décision
 */
export function getDecisionSequence(): FlowStage[] {
  return [...CHE_NU_PARALLEL_CHAIN_MODEL.chainDecision.sequence];
}

/**
 * Vérifier les règles d'autorité
 */
export function validateAuthority(action: {
  agent?: AgentType;
  isDecision: boolean;
  writesToTimeline: boolean;
  humanValidated: boolean;
}): { valid: boolean; reason?: string } {
  const { authority } = CHE_NU_PARALLEL_CHAIN_MODEL;

  if (action.isDecision && action.agent && action.agent !== 'orchestrator') {
    return { valid: false, reason: 'Agents cannot make decisions' };
  }

  if (action.writesToTimeline && !action.humanValidated) {
    return { valid: false, reason: 'Timeline writes require human validation' };
  }

  if (action.isDecision && !action.humanValidated) {
    return { valid: false, reason: 'Human is final authority on decisions' };
  }

  return { valid: true };
}

/**
 * Vérifier les règles de rollback
 */
export function validateRollback(action: {
  writesToTimeline: boolean;
  deletesEvents: boolean;
  rewritesHistory: boolean;
  masksDecisions: boolean;
}): { valid: boolean; violations: string[] } {
  const { rollback } = CHE_NU_PARALLEL_CHAIN_MODEL;
  const violations: string[] = [];

  if (action.writesToTimeline && !rollback.writesTimeline) {
    violations.push('Rollback cannot write to timeline');
  }

  if (action.deletesEvents && !rollback.canDeleteEvents) {
    violations.push('Rollback cannot delete events');
  }

  if (action.rewritesHistory && !rollback.canRewriteHistory) {
    violations.push('Rollback cannot rewrite history');
  }

  if (action.masksDecisions && !rollback.canMaskDecisions) {
    violations.push('Rollback cannot mask decisions');
  }

  return {
    valid: violations.length === 0,
    violations,
  };
}

/* =========================================================
   FLOW EXECUTION
   ========================================================= */

/** État du flux courant */
export interface FlowState {
  currentStage: FlowStage;
  mode: WorkMode;
  parallelResults: Map<AgentType, unknown>;
  orchestratorSummary?: unknown;
  clarification?: unknown;
  humanDecision?: 'approved' | 'rejected';
  timestamp: number;
}

/**
 * Créer un état de flux initial
 */
export function createFlowState(): FlowState {
  return {
    currentStage: 'user_intention',
    mode: 'parallel',
    parallelResults: new Map(),
    timestamp: Date.now(),
  };
}

/**
 * Avancer dans le flux
 */
export function advanceFlow(
  state: FlowState,
  humanValidated: boolean
): FlowState {
  const sequence = CHE_NU_PARALLEL_CHAIN_MODEL.chainDecision.sequence;
  const currentIndex = sequence.indexOf(state.currentStage);

  if (currentIndex === -1) {
    return state;
  }

  // À l'étape de validation humaine
  if (state.currentStage === 'human_validation') {
    return {
      ...state,
      currentStage: humanValidated ? 'timeline_write' : 'return_to_neutral',
      humanDecision: humanValidated ? 'approved' : 'rejected',
      mode: 'chain',
      timestamp: Date.now(),
    };
  }

  // Avancer normalement
  const nextIndex = currentIndex + 1;
  if (nextIndex < sequence.length) {
    return {
      ...state,
      currentStage: sequence[nextIndex],
      mode: state.currentStage === 'parallel_analysis' ? 'chain' : state.mode,
      timestamp: Date.now(),
    };
  }

  return state;
}

/* =========================================================
   EXPORTS
   ========================================================= */

export {
  CHE_NU_PARALLEL_CHAIN_MODEL as PARALLEL_CHAIN_MODEL,
};
