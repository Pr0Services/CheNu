/* =========================================
   CHE·NU — AGENT MANIFESTO TYPES
   
   Types pour le système d'agents.
   Basé sur le Agent Mission Manifesto.
   
   ⚠️ RÈGLE FONDAMENTALE:
   "Agents exist to serve clarity, not outcomes."
   ========================================= */

// ============================================
// AGENT LEVELS
// ============================================

/** Les 4 niveaux d'agents */
export type ManifestoAgentLevel = 'L0' | 'L1' | 'L2' | 'L3';

/** Description des niveaux */
export const AGENT_LEVEL_INFO: Record<ManifestoAgentLevel, {
  name: string;
  description: string;
  persistent: boolean;
}> = {
  L0: {
    name: 'Orchestrator',
    description: 'Single instance, coordinates all agent activity',
    persistent: true,
  },
  L1: {
    name: 'Foundational',
    description: 'Cognitive backbone, always available',
    persistent: true,
  },
  L2: {
    name: 'Sphere',
    description: 'Domain-aware, one per sphere',
    persistent: true,
  },
  L3: {
    name: 'Contextual',
    description: 'Temporary, single context only',
    persistent: false,
  },
};

// ============================================
// AGENT CAPABILITIES
// ============================================

/** Ce qu'un agent PEUT faire */
export type AgentCapability =
  | 'analyze'
  | 'summarize'
  | 'suggest'
  | 'explain'
  | 'compare'
  | 'recall'
  | 'contextualize'
  | 'clarify';

/** Toutes les capacités autorisées */
export const ALLOWED_CAPABILITIES: readonly AgentCapability[] = [
  'analyze',
  'summarize',
  'suggest',
  'explain',
  'compare',
  'recall',
  'contextualize',
  'clarify',
] as const;

/** Ce qu'un agent NE PEUT PAS faire (JAMAIS) */
export type ForbiddenAction =
  | 'write_timeline'
  | 'finalize_decision'
  | 'trigger_irreversible'
  | 'communicate_agent'
  | 'access_ui'
  | 'autonomous_action'
  | 'activate_preset'
  | 'force_transition';

/** Actions interdites - constante immuable */
export const FORBIDDEN_AGENT_ACTIONS: readonly ForbiddenAction[] = [
  'write_timeline',
  'finalize_decision',
  'trigger_irreversible',
  'communicate_agent',
  'access_ui',
  'autonomous_action',
  'activate_preset',
  'force_transition',
] as const;

// ============================================
// AGENT OUTPUT
// ============================================

/** Confiance de l'agent */
export type ConfidenceLevel = 'high' | 'medium' | 'low' | 'uncertain';

/** Structure de sortie d'un agent */
export interface AgentOutput<T = unknown> {
  /** ID de l'agent source */
  agentId: string;
  /** Timestamp de la réponse */
  timestamp: number;
  /** Niveau de confiance */
  confidence: ConfidenceLevel;
  /** Données de sortie */
  data: T;
  /** Explication en langage naturel (OBLIGATOIRE) */
  explanation: string;
  /** Suggestions optionnelles */
  suggestions?: AgentSuggestion[];
  /** Avertissements */
  warnings?: string[];
}

/** Une suggestion d'agent */
export interface AgentSuggestion {
  /** ID unique */
  id: string;
  /** Texte de la suggestion */
  text: string;
  /** Type de suggestion */
  type: 'consideration' | 'alternative' | 'historical' | 'clarification';
  /** Contexte */
  context?: string;
}

/** Phrases valides pour les suggestions */
export const VALID_SUGGESTION_PREFIXES = [
  'You may want to consider',
  'An alternative could be',
  'Historically, you decided',
  'One option might be',
  'You might find it helpful to',
  'Consider whether',
  'It could be worth noting',
  'Vous pourriez considérer',
  'Une alternative serait',
  'Historiquement, vous avez décidé',
] as const;

/** Phrases INTERDITES */
export const INVALID_SUGGESTION_PREFIXES = [
  'You should',
  'You must',
  'The best option is',
  'This will optimize',
  'You need to',
  'The correct choice is',
  'I recommend',
  'Do this',
  'Vous devez',
  'La meilleure option est',
  'Je recommande',
] as const;

// ============================================
// AGENT DEFINITION
// ============================================

/** Définition de base d'un agent */
export interface AgentDefinition {
  /** ID unique */
  id: string;
  /** Nom affichable */
  name: string;
  /** Niveau */
  level: ManifestoAgentLevel;
  /** Description du rôle */
  purpose: string;
  /** Capacités */
  capabilities: AgentCapability[];
  /** Inputs attendus */
  inputs: string[];
  /** Outputs produits */
  outputs: string[];
  /** Restrictions spécifiques */
  restrictions: string[];
}

// ============================================
// L0 — ORCHESTRATOR
// ============================================

/** Input vers l'Orchestrator */
export interface OrchestratorInput {
  /** Intention utilisateur */
  userIntention: string;
  /** Contexte actuel */
  context?: SystemContext;
  /** Agents à consulter (optionnel) */
  targetAgents?: string[];
}

/** Output de l'Orchestrator */
export interface OrchestratorOutput {
  /** Résumé synthétisé */
  synthesis: string;
  /** Options neutres pour l'humain */
  options: NeutralOption[];
  /** Agents consultés */
  consultedAgents: string[];
  /** Validation humaine requise */
  requiresValidation: true; // TOUJOURS true
}

/** Option neutre présentée à l'humain */
export interface NeutralOption {
  /** ID */
  id: string;
  /** Description */
  description: string;
  /** Source agent */
  sourceAgent: string;
  /** Contexte */
  context?: string;
}

// ============================================
// L1 — FOUNDATIONAL AGENTS
// ============================================

/** Types des agents L1 */
export type FoundationalAgentType =
  | 'decision_analyst'
  | 'context_analyzer'
  | 'preset_advisor'
  | 'memory_agent'
  | 'ux_observer';

/** Définitions des agents L1 */
export const FOUNDATIONAL_AGENTS: Record<FoundationalAgentType, AgentDefinition> = {
  decision_analyst: {
    id: 'decision_analyst',
    name: 'Decision Analyst',
    level: 'L1',
    purpose: 'Extract core intention, identify constraints and decision type',
    capabilities: ['analyze', 'clarify', 'summarize'],
    inputs: ['user_input', 'context'],
    outputs: ['intent_summary', 'decision_scope', 'risk_flags'],
    restrictions: ['no_recommendations', 'descriptive_only'],
  },
  context_analyzer: {
    id: 'context_analyzer',
    name: 'Context Analyzer',
    level: 'L1',
    purpose: 'Read current system state',
    capabilities: ['analyze', 'contextualize'],
    inputs: ['active_sphere', 'active_preset', 'session_history', 'timeline_pointer'],
    outputs: ['context_snapshot', 'conflicts', 'readiness_assessment'],
    restrictions: ['read_only'],
  },
  preset_advisor: {
    id: 'preset_advisor',
    name: 'Preset Advisor',
    level: 'L1',
    purpose: 'Suggest operating mode (preset)',
    capabilities: ['suggest', 'explain'],
    inputs: ['context', 'user_intention'],
    outputs: ['suggested_presets', 'reasoning'],
    restrictions: ['never_activates', 'never_forces'],
  },
  memory_agent: {
    id: 'memory_agent',
    name: 'Memory Agent',
    level: 'L1',
    purpose: 'Manage long-term recall and relevance',
    capabilities: ['recall', 'contextualize'],
    inputs: ['query', 'context'],
    outputs: ['relevant_decisions', 'patterns'],
    restrictions: ['no_inference_without_confirmation', 'explicit_validation_only'],
  },
  ux_observer: {
    id: 'ux_observer',
    name: 'UX Observer',
    level: 'L1',
    purpose: 'Detect cognitive overload or confusion',
    capabilities: ['analyze', 'suggest'],
    inputs: ['interaction_patterns', 'session_duration', 'navigation_loops'],
    outputs: ['cognitive_state', 'gentle_suggestions'],
    restrictions: ['no_behavioral_scoring', 'suggestions_only'],
  },
};

/** Output du Decision Analyst */
export interface DecisionAnalystOutput {
  /** Résumé de l'intention */
  intentSummary: string;
  /** Portée de la décision */
  decisionScope: 'trivial' | 'minor' | 'significant' | 'major' | 'critical';
  /** Drapeaux de risque (descriptifs) */
  riskFlags: RiskFlag[];
  /** Contraintes identifiées */
  constraints: string[];
}

export interface RiskFlag {
  type: string;
  description: string;
  severity: 'info' | 'warning' | 'caution';
}

/** Output du Context Analyzer */
export interface ContextAnalyzerOutput {
  /** Snapshot du contexte */
  snapshot: SystemContext;
  /** Conflits détectés */
  conflicts: ContextConflict[];
  /** Évaluation de préparation */
  readiness: 'ready' | 'needs_clarification' | 'blocked';
  /** Raison si pas prêt */
  readinessReason?: string;
}

export interface SystemContext {
  activeSphere: string | null;
  activePreset: string | null;
  sessionDuration: number;
  timelinePointer: number;
  recentActions: string[];
}

export interface ContextConflict {
  type: string;
  description: string;
  suggestion?: string;
}

/** Output du Preset Advisor */
export interface PresetAdvisorOutput {
  /** Presets suggérés */
  suggestedPresets: PresetSuggestion[];
  /** Explication */
  reasoning: string;
}

export interface PresetSuggestion {
  presetId: string;
  reason: string;
  confidence: ConfidenceLevel;
}

/** Output du Memory Agent */
export interface MemoryAgentOutput {
  /** Décisions passées pertinentes */
  relevantDecisions: PastDecision[];
  /** Patterns observés */
  patterns?: string[];
  /** Aucune mémoire trouvée */
  noMemory?: boolean;
}

export interface PastDecision {
  id: string;
  summary: string;
  timestamp: number;
  outcome?: string;
  relevanceScore: number;
}

/** Output du UX Observer */
export interface UXObserverOutput {
  /** État cognitif estimé */
  cognitiveState: 'clear' | 'engaged' | 'busy' | 'overloaded' | 'confused';
  /** Signaux détectés */
  signals: UXSignal[];
  /** Suggestion douce */
  gentleSuggestion?: string;
}

export interface UXSignal {
  type: 'navigation_loop' | 'long_session' | 'rapid_switching' | 'hesitation';
  intensity: 'low' | 'medium' | 'high';
}

// ============================================
// L2 — SPHERE AGENTS
// ============================================

/** Types de sphères supportées */
export type SphereType =
  | 'personal'
  | 'business'
  | 'creative'
  | 'scholar'
  | 'social'
  | 'institutions'
  | 'methodology'
  | 'xr';

/** Configuration d'un Sphere Agent */
export interface SphereAgentConfig {
  /** Sphère associée */
  sphere: SphereType;
  /** Vocabulaire de domaine */
  domainVocabulary: string[];
  /** Considérations spécifiques */
  domainConsiderations: string[];
}

/** Output d'un Sphere Agent */
export interface SphereAgentOutput {
  /** Sphère */
  sphere: SphereType;
  /** Interprétation de domaine */
  domainInterpretation: string;
  /** Considérations pertinentes */
  considerations: string[];
  /** Options traduites en neutre */
  neutralOptions: NeutralOption[];
}

// ============================================
// L3 — CONTEXTUAL AGENTS
// ============================================

/** Types d'agents contextuels */
export type ContextualAgentType =
  | 'meeting'
  | 'comparison'
  | 'replay'
  | 'methodology';

/** Cycle de vie d'un agent L3 */
export interface ContextualAgentLifecycle {
  /** ID de l'instance */
  instanceId: string;
  /** Type d'agent */
  type: ContextualAgentType;
  /** Contexte pour lequel créé */
  contextId: string;
  /** Timestamp de création */
  createdAt: number;
  /** Timestamp de destruction */
  destroyedAt?: number;
  /** État */
  state: 'active' | 'completed' | 'destroyed';
}

/** Output d'un Meeting Agent */
export interface MeetingAgentOutput {
  /** Résumé de la réunion */
  summary: string;
  /** Points clés */
  keyPoints: string[];
  /** Décisions prises (si validées) */
  decisions: string[];
  /** Actions identifiées */
  actionItems: string[];
}

/** Output d'un Comparison Agent */
export interface ComparisonAgentOutput {
  /** Items comparés */
  items: string[];
  /** Critères de comparaison */
  criteria: string[];
  /** Matrice de comparaison */
  comparison: ComparisonMatrix;
  /** Observations (pas de recommandation) */
  observations: string[];
}

export interface ComparisonMatrix {
  headers: string[];
  rows: ComparisonRow[];
}

export interface ComparisonRow {
  item: string;
  values: Record<string, string | number>;
}

// ============================================
// COMMUNICATION RULES
// ============================================

/** Direction de communication autorisée */
export type AllowedCommunication =
  | 'orchestrator_to_agent'
  | 'agent_to_orchestrator'
  | 'orchestrator_to_human';

/** Communication interdite */
export type ForbiddenCommunication =
  | 'agent_to_agent'
  | 'agent_to_ui'
  | 'agent_to_timeline'
  | 'agent_to_action';

/** Règles de communication */
export const COMMUNICATION_RULES = {
  allowed: [
    'orchestrator_to_agent',
    'agent_to_orchestrator',
    'orchestrator_to_human',
  ] as const,
  forbidden: [
    'agent_to_agent',
    'agent_to_ui',
    'agent_to_timeline',
    'agent_to_action',
  ] as const,
} as const;

// ============================================
// FAIL-SAFE
// ============================================

/** Conditions de fail-safe */
export interface FailSafeCondition {
  /** Contexte pas clair */
  contextUnclear: boolean;
  /** Signaux contradictoires */
  contradictorySignals: boolean;
  /** Confiance basse */
  lowConfidence: boolean;
}

/** Réponse fail-safe */
export interface FailSafeResponse {
  /** Agent est incertain */
  isUncertain: true;
  /** Raison */
  reason: string;
  /** Défère à l'humain */
  defersToHuman: true;
  /** Pas de recommandation */
  noRecommendation: true;
}

/** Créer une réponse fail-safe */
export function createFailSafeResponse(reason: string): FailSafeResponse {
  return {
    isUncertain: true,
    reason,
    defersToHuman: true,
    noRecommendation: true,
  };
}

// ============================================
// TYPE GUARDS
// ============================================

export function isAgentOutput(obj: unknown): obj is AgentOutput {
  if (!obj || typeof obj !== 'object') return false;
  const o = obj as Record<string, unknown>;
  return (
    typeof o.agentId === 'string' &&
    typeof o.timestamp === 'number' &&
    typeof o.explanation === 'string' &&
    o.data !== undefined
  );
}

export function isValidSuggestion(text: string): boolean {
  const lowerText = text.toLowerCase();
  const hasValidPrefix = VALID_SUGGESTION_PREFIXES.some((p) =>
    lowerText.startsWith(p.toLowerCase())
  );
  const hasInvalidPrefix = INVALID_SUGGESTION_PREFIXES.some((p) =>
    lowerText.startsWith(p.toLowerCase())
  );
  return hasValidPrefix && !hasInvalidPrefix;
}

export function isFoundationalAgent(type: string): type is FoundationalAgentType {
  return [
    'decision_analyst',
    'context_analyzer',
    'preset_advisor',
    'memory_agent',
    'ux_observer',
  ].includes(type);
}

export function isForbiddenAction(action: string): action is ForbiddenAction {
  return (FORBIDDEN_AGENT_ACTIONS as readonly string[]).includes(action);
}
