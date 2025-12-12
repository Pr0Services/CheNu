/**
 * CHE·NU — KNOWLEDGE THREADS SYSTEM (MEGA-ULTIMATE)
 * Presets & Factory Functions
 */

import {
  ThreadAgent, TemporalThread, ConceptualThread, DecisionThread,
  CollectiveKnowledgeThread, FactThread, ContextThread, EvolutionThread,
  InterSphereThread, PersonalThread, CollectiveThread, UniverseViewConfig,
  SphereType, InterSphereBasis, CollectiveType, VisibilityType,
  LearningSignals, LearningOutput,
} from './types';

// ============================================================
// 5 THREAD AGENTS
// ============================================================

export const THREAD_AGENTS: ThreadAgent[] = [
  { type: 'builder', name: 'THREAD_BUILDER', role: 'Proposes links (suggestion only)', constraint: 'No auto-merge', active: true },
  { type: 'validator', name: 'THREAD_VALIDATOR', role: 'Verifies source integrity', constraint: 'Hash verification', active: true },
  { type: 'explainer', name: 'THREAD_EXPLAINER', role: 'Explains WHY items are linked', constraint: 'Facts only', active: true },
  { type: 'guard', name: 'THREAD_GUARD', role: 'Blocks inferred intent, emotional labeling, hidden semantics', constraint: 'Zero manipulation', active: true },
  { type: 'query_executor', name: 'THREAD_QUERY_EXECUTOR', role: 'Executes TQL safely', constraint: 'Safety rules enforced', active: true },
];

// ============================================================
// THREAD TYPE CONFIGS
// ============================================================

export const STRUCTURAL_THREAD_TYPES = [
  { type: 'temporal', icon: '⏱️', color: '#10B981', question: 'What happened (when)?' },
  { type: 'conceptual', icon: '💡', color: '#06B6D4', question: 'What was it about?' },
  { type: 'decision', icon: '⚖️', color: '#F59E0B', question: 'What was chosen?' },
  { type: 'collective', icon: '👥', color: '#8B5CF6', question: 'What do we share?' },
];

export const KNOWLEDGE_THREAD_TYPES = [
  { type: 'fact', icon: '📌', color: '#3B82F6', question: 'What is true?' },
  { type: 'context', icon: '🔍', color: '#EC4899', question: 'Why did it exist?' },
  { type: 'evolution', icon: '🔄', color: '#14B8A6', question: 'How did it change?' },
];

export const LAYER_CONFIGS = [
  { layer: 'inter_sphere', name: 'Inter-Sphere', icon: '🌐', color: '#F59E0B' },
  { layer: 'personal', name: 'Personal', icon: '👤', color: '#8B5CF6' },
  { layer: 'collective', name: 'Collective', icon: '👥', color: '#10B981' },
];

// ============================================================
// FACTORY: TEMPORAL THREAD
// ============================================================

export function createTemporalThread(anchorTime: number = Date.now()): TemporalThread {
  return {
    id: `temporal_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    anchor_time: anchorTime,
    nodes: [],
    edges: [],
  };
}

// ============================================================
// FACTORY: CONCEPTUAL THREAD
// ============================================================

export function createConceptualThread(concept: string, scope: 'personal' | 'team' | 'sphere' | 'global' = 'personal'): ConceptualThread {
  return {
    id: `conceptual_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    concept,
    linked_items: [],
    scope,
  };
}

// ============================================================
// FACTORY: DECISION THREAD
// ============================================================

export function createDecisionThread(rootDecisionId: string): DecisionThread {
  return {
    id: `decision_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    root_decision: rootDecisionId,
    branches: [],
  };
}

// ============================================================
// FACTORY: COLLECTIVE KNOWLEDGE THREAD
// ============================================================

export function createCollectiveKnowledgeThread(contributors: string[]): CollectiveKnowledgeThread {
  return {
    id: `collective_knowledge_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    contributors,
    source_threads: [],
    visibility: 'restricted',
    verification: { hash: `sha256_${Date.now()}`, validated: false },
  };
}

// ============================================================
// FACTORY: FACT THREAD
// ============================================================

export function createFactThread(visibility: VisibilityType = 'private'): FactThread {
  return {
    id: `fact_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    type: 'fact',
    nodes: [],
    hash: `sha256_${Date.now()}`,
    visibility,
  };
}

// ============================================================
// FACTORY: CONTEXT THREAD
// ============================================================

export function createContextThread(sphere: string, participants: string[], constraints: string[]): ContextThread {
  return {
    id: `context_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    type: 'context',
    context: { sphere, participants, constraints },
    linked_to: [],
  };
}

// ============================================================
// FACTORY: EVOLUTION THREAD
// ============================================================

export function createEvolutionThread(): EvolutionThread {
  return {
    id: `evolution_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    type: 'evolution',
    steps: [],
    status: 'active',
  };
}

// ============================================================
// FACTORY: INTER-SPHERE THREAD
// ============================================================

export function createInterSphereThread(spheres: [SphereType, SphereType], basis: InterSphereBasis): InterSphereThread {
  return {
    id: `inter_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    layer: 'inter_sphere',
    spheres,
    basis,
    strength: 0.5,
    nodes: [],
    hash: `sha256_${Date.now()}`,
    read_only: true,
  };
}

// ============================================================
// FACTORY: PERSONAL THREAD
// ============================================================

export function createPersonalThread(userId: string): PersonalThread {
  return {
    id: `personal_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    layer: 'personal',
    user_id: userId,
    segments: [],
    continuity_score: 0,
    visibility: 'private_only',
  };
}

// ============================================================
// FACTORY: COLLECTIVE THREAD
// ============================================================

export function createCollectiveThread(type: CollectiveType, topic: string, members: string[]): CollectiveThread {
  return {
    id: `collective_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    layer: 'collective',
    type,
    topic,
    members,
    entries: [],
    cluster_hash: `sha256_${Date.now()}`,
    visibility: 'team_only',
  };
}

// ============================================================
// DEFAULT UNIVERSE VIEW CONFIG
// ============================================================

export const DEFAULT_UNIVERSE_CONFIG: UniverseViewConfig = {
  render_mode: '2d_lines',
  thread_toggles: {
    temporal: true,
    conceptual: true,
    decision: true,
    collective: true,
    fact: true,
    context: false,
    evolution: false,
  },
  density_profile: 'standard',
  motion_enabled: false, // comfort first
};

// ============================================================
// LEARNING
// ============================================================

export function computeLearningSignals(nodes: { timestamp: number }[]): LearningSignals {
  const timestamps = nodes.map(n => n.timestamp).sort();
  const timeBetween = timestamps.slice(1).map((t, i) => t - timestamps[i]);
  
  return {
    thread_length: nodes.length,
    time_between_nodes: timeBetween,
    branching_depth: 0,
    cross_sphere_reuse: 0,
    resolution_timestamps: [],
  };
}

export function generateLearningOutput(signals: LearningSignals): LearningOutput {
  const insights: string[] = [];
  const suggestions: string[] = [];
  
  if (signals.thread_length > 10) insights.push('Thread has significant depth');
  if (signals.cross_sphere_reuse > 2) {
    insights.push('Thread spans multiple spheres');
    suggestions.push('Consider cross-sphere navigation');
  }
  
  return { structural_insights: insights, navigation_suggestions: suggestions, organization_proposals: [] };
}
