/**
 * CHE·NU — KNOWLEDGE THREADS SYSTEM (MEGA-ULTIMATE)
 * KT.MEGA.v1.0 — 7 Thread Types + Triple-Layer + TQL + Safe Learning + 5 Agents
 * 
 * Threads CONNECT facts. They DO NOT interpret, rank, or conclude.
 * Memory without manipulation • Truth without authority • Evolution without erasure
 */

// ============================================================
// THE 4 STRUCTURAL THREAD TYPES
// ============================================================

// 1. TEMPORAL THREAD
export interface TemporalThread {
  id: string;
  anchor_time: number;
  nodes: string[]; // event_id, decision_id
  edges: { from: string; to: string; relation: 'after' | 'before' | 'during' }[];
}

// 2. CONCEPTUAL THREAD
export type ConceptualScope = 'personal' | 'team' | 'sphere' | 'global';

export interface ConceptualThread {
  id: string;
  concept: string;
  linked_items: { type: 'meeting' | 'artifact' | 'decision'; id: string }[];
  scope: ConceptualScope;
}

// 3. DECISION THREAD
export interface DecisionBranch {
  decision_id: string;
  parent: string;
  timestamp: number;
}

export interface DecisionThread {
  id: string;
  root_decision: string;
  branches: DecisionBranch[];
}

// 4. COLLECTIVE KNOWLEDGE THREAD
export interface CollectiveKnowledgeThread {
  id: string;
  contributors: string[]; // user | agent
  source_threads: string[]; // temporal_id, conceptual_id
  visibility: 'public' | 'restricted';
  verification: { hash: string; validated: boolean };
}

// ============================================================
// THE 3 KNOWLEDGE THREAD TYPES
// ============================================================

export type KnowledgeThreadType = 'fact' | 'context' | 'evolution';
export type VisibilityType = 'private' | 'shared' | 'sphere';

// 1. FACT THREAD
export interface FactThreadNode {
  type: 'artifact' | 'decision' | 'meeting' | 'replay';
  id: string;
  timestamp: number;
}

export interface FactThread {
  id: string;
  type: 'fact';
  nodes: FactThreadNode[];
  hash: string;
  visibility: VisibilityType;
}

// 2. CONTEXT THREAD
export interface ContextThread {
  id: string;
  type: 'context';
  context: {
    sphere: string;
    participants: string[];
    constraints: string[];
    meeting_type?: string;
  };
  linked_to: string[]; // fact_thread_id
}

// 3. EVOLUTION THREAD
export interface EvolutionStep {
  ref: string;
  version: number;
}

export interface EvolutionThread {
  id: string;
  type: 'evolution';
  steps: EvolutionStep[];
  status: 'active' | 'branched' | 'paused';
}

// ============================================================
// TRIPLE-LAYER SYSTEM
// ============================================================

export type ThreadLayer = 'inter_sphere' | 'personal' | 'collective';
export type SphereType = 'business' | 'scholar' | 'creative' | 'xr' | 'social' | 'institutions';
export type InterSphereBasis = 'artifact' | 'decision' | 'event' | 'temporal' | 'agent';
export type ParticipationLevel = 'active' | 'passive' | 'observing';
export type PersonalActivity = 'read' | 'created' | 'modified' | 'presented';
export type CollectiveType = 'decision_chain' | 'artifact_chain' | 'topic_cluster' | 'event_sync';

// Inter-Sphere Layer
export interface InterSphereThread {
  id: string;
  layer: 'inter_sphere';
  spheres: [SphereType, SphereType];
  basis: InterSphereBasis;
  strength: number;
  nodes: string[];
  hash: string;
  read_only: true;
}

// Personal Layer (5 Dimensions)
export interface PersonalSegment {
  source: 'meeting' | 'artifact' | 'replay';
  sphere: SphereType;
  timestamp: number;
  activity: PersonalActivity;
  participation: ParticipationLevel;
  meta?: { tags: string[] };
}

export interface PersonalThread {
  id: string;
  layer: 'personal';
  user_id: string;
  segments: PersonalSegment[];
  continuity_score: number;
  visibility: 'private_only';
}

// Collective Layer
export interface CollectiveThread {
  id: string;
  layer: 'collective';
  type: CollectiveType;
  topic: string;
  members: string[];
  entries: string[];
  cluster_hash: string;
  visibility: 'team_only';
}

// ============================================================
// TQL (THREAD QUERY LANGUAGE)
// ============================================================

export type TQLOperator = '==' | '!=' | 'in' | 'between' | 'exists' | 'contains';

export interface TQLCondition {
  field: string;
  operator: TQLOperator;
  value: any;
}

export interface TQLQuery {
  conditions: TQLCondition[];
  order_by?: string;
  group_by?: string;
  show: string[];
  compare?: boolean;
}

export interface TQLResult {
  threads: any[];
  nodes_count: number;
  execution_time_ms: number;
  safe: boolean;
}

export const TQL_SAFETY_RULES = [
  'no_hidden_joins',
  'no_inferred_intent',
  'no_ranking',
  'no_sentiment_analysis',
  'explicit_scope_required',
] as const;

// ============================================================
// SAFE LEARNING
// ============================================================

export interface LearningSignals {
  thread_length: number;
  time_between_nodes: number[];
  branching_depth: number;
  cross_sphere_reuse: number;
  resolution_timestamps: number[];
}

export interface LearningOutput {
  structural_insights: string[];
  navigation_suggestions: string[];
  organization_proposals: string[];
  // NO behavioral_feedback - FORBIDDEN
}

export const ALLOWED_LEARNING = ['recurrence_frequency', 'branching_complexity', 'resolution_patterns', 'abandonment_patterns'] as const;
export const FORBIDDEN_LEARNING = ['opinions', 'values', 'emotional_weight', 'success_judgments'] as const;

// ============================================================
// 5 THREAD AGENTS
// ============================================================

export type ThreadAgentType = 'builder' | 'validator' | 'explainer' | 'guard' | 'query_executor';

export interface ThreadAgent {
  type: ThreadAgentType;
  name: string;
  role: string;
  constraint: string;
  active: boolean;
}

// ============================================================
// UNIVERSAL THREAD RULES
// ============================================================

export const THREAD_RULES = {
  NO_MERGE: 'Threads never merge automatically',
  NO_CORRECTNESS: 'Threads never imply correctness',
  NO_SCORING: 'Threads never score information',
  NO_NARRATIVE: 'No narrative forcing',
  NO_RANKING: 'No ranking of threads',
  NO_BEST_LABEL: 'No "best knowledge" label',
  USER_SEES_RAW: 'User always sees raw sources',
  REVERSIBLE: 'All bridges are reversible',
} as const;

// ============================================================
// UNIVERSE VIEW
// ============================================================

export interface UniverseViewConfig {
  render_mode: '2d_lines' | '3d_filaments';
  thread_toggles: Record<string, boolean>;
  density_profile: 'minimal' | 'standard' | 'dense';
  motion_enabled: boolean; // default: false (comfort first)
}

// ============================================================
// UNIFIED STATE
// ============================================================

export interface KnowledgeThreadsState {
  // 4 Structural Threads
  temporal_threads: TemporalThread[];
  conceptual_threads: ConceptualThread[];
  decision_threads: DecisionThread[];
  collective_knowledge_threads: CollectiveKnowledgeThread[];
  
  // 3 Knowledge Threads
  fact_threads: FactThread[];
  context_threads: ContextThread[];
  evolution_threads: EvolutionThread[];
  
  // Triple-Layer
  inter_sphere_threads: InterSphereThread[];
  personal_threads: PersonalThread[];
  collective_threads: CollectiveThread[];
  
  // Agents
  agents: ThreadAgent[];
  
  // TQL
  current_query: TQLQuery | null;
  query_results: TQLResult | null;
  
  // Learning
  learning_signals: LearningSignals | null;
  learning_output: LearningOutput | null;
  
  // Universe View
  universe_config: UniverseViewConfig;
  
  // UI
  is_loading: boolean;
  error: string | null;
}

// ============================================================
// WHY THE 7 THREADS MATTER
// ============================================================

export const THREAD_PURPOSES = {
  temporal: 'What happened (when)?',
  conceptual: 'What was it about?',
  decision: 'What was chosen?',
  collective: 'What do we share?',
  fact: 'What is true?',
  context: 'Why did it exist?',
  evolution: 'How did it change?',
} as const;

export const THREAD_PRINCIPLES = {
  MEMORY_WITHOUT_MANIPULATION: 'Memory without manipulation',
  TRUTH_WITHOUT_AUTHORITY: 'Truth without authority',
  EVOLUTION_WITHOUT_ERASURE: 'Evolution without erasure',
  SPINE: 'Knowledge Threads are the SPINE of CHE·NU',
} as const;
