/* =====================================================
   CHE·NU — Decision Comparison Types
   
   Types for comparing decisions across timeline events.
   Supports single, pairwise, and multi-decision analysis.
   ===================================================== */

import { TimelineXREvent } from '../xr/meeting/xrReplay.types';

// ─────────────────────────────────────────────────────
// DECISION SNAPSHOT
// ─────────────────────────────────────────────────────

export interface DecisionSnapshot {
  decisionEvent: TimelineXREvent;
  contextEvents: TimelineXREvent[];      // événements AVANT
  consequenceEvents: TimelineXREvent[];  // événements APRÈS
  
  // Metadata
  contextWindow: number;
  consequenceWindow: number;
  extractedAt: number;
  
  // Computed metrics
  metrics: DecisionMetrics;
}

export interface DecisionMetrics {
  contextDuration: number;          // ms entre premier et dernier context event
  consequenceDuration: number;      // ms entre decision et dernier consequence
  agentContributions: number;       // nombre d'agents ayant contribué
  humanInteractions: number;        // nombre d'interactions humaines
  phaseChanges: number;             // nombre de changements de phase
  confidenceAverage: number;        // moyenne des confidences agents
}

// ─────────────────────────────────────────────────────
// PAIRWISE COMPARISON
// ─────────────────────────────────────────────────────

export interface DecisionComparisonResult {
  left: DecisionSnapshot;
  right: DecisionSnapshot;
  
  divergences: DecisionDivergences;
  similarities: DecisionSimilarities;
  
  similarityScore: number;          // 0 → 1
  
  // Detailed scores
  scores: {
    contextSimilarity: number;
    decisionSimilarity: number;
    outcomeSimilarity: number;
    agentOverlap: number;
    timingAlignment: number;
  };
  
  // Analysis
  analysis: ComparisonAnalysis;
}

export interface DecisionDivergences {
  context: DivergenceItem[];
  decision: DivergenceItem[];
  outcomes: DivergenceItem[];
}

export interface DivergenceItem {
  category: 'context' | 'decision' | 'outcome';
  severity: 'low' | 'medium' | 'high';
  description: string;
  leftValue?: string | number;
  rightValue?: string | number;
}

export interface DecisionSimilarities {
  sharedAgents: string[];
  sharedEventTypes: string[];
  commonPatterns: string[];
}

export interface ComparisonAnalysis {
  summary: string;
  keyDifferences: string[];
  recommendations: string[];
  confidence: number;
}

// ─────────────────────────────────────────────────────
// MULTI-DECISION COMPARISON
// ─────────────────────────────────────────────────────

export interface DecisionNode {
  decisionId: string;
  timestamp: number;
  summary: string;
  
  // Context
  contextSize: number;
  contextDuration: number;
  
  // Agents
  agentsInvolved: string[];
  primaryAgent?: string;
  
  // Consequences
  consequenceCount: number;
  consequenceDuration: number;
  
  // Classification
  decisionType: DecisionType;
  complexity: 'simple' | 'moderate' | 'complex';
  impact: 'low' | 'medium' | 'high';
}

export type DecisionType =
  | 'strategic'       // Long-term direction
  | 'operational'     // Day-to-day operations
  | 'tactical'        // Short-term actions
  | 'corrective'      // Fix a problem
  | 'preventive'      // Prevent a problem
  | 'exploratory'     // Try something new
  | 'confirmatory';   // Validate existing approach

export interface DecisionCluster {
  id: string;
  name: string;
  decisionIds: string[];
  
  // Cluster metrics
  averageContextSize: number;
  averageConsequences: number;
  averageComplexity: number;
  
  // Pattern
  dominantType: DecisionType;
  commonAgents: string[];
  
  // Cohesion
  cohesionScore: number;           // How similar are decisions in cluster
}

export interface MultiDecisionComparisonResult {
  nodes: DecisionNode[];
  clusters: DecisionCluster[];
  insights: DecisionInsight[];
  
  // Global metrics
  globalMetrics: {
    totalDecisions: number;
    avgContextSize: number;
    avgConsequences: number;
    mostActiveAgent: string;
    dominantDecisionType: DecisionType;
    timeSpan: number;
  };
  
  // Patterns
  patterns: DecisionPattern[];
  
  // Timeline
  timeline: DecisionTimelinePoint[];
}

export interface DecisionInsight {
  id: string;
  type: 'observation' | 'warning' | 'recommendation' | 'pattern';
  severity: 'info' | 'low' | 'medium' | 'high';
  title: string;
  description: string;
  relatedDecisions: string[];
  actionable: boolean;
  suggestedAction?: string;
}

export interface DecisionPattern {
  id: string;
  name: string;
  description: string;
  frequency: number;
  decisionIds: string[];
  confidence: number;
}

export interface DecisionTimelinePoint {
  timestamp: number;
  decisionId: string;
  clusterId?: string;
  impact: number;
  cumulativeImpact: number;
}

// ─────────────────────────────────────────────────────
// REPLAY MODE
// ─────────────────────────────────────────────────────

export type ReplayMode = 'single' | 'comparison' | 'multi';

export interface ComparisonReplayState {
  mode: ReplayMode;
  
  // Single mode
  activeSnapshot?: DecisionSnapshot;
  
  // Comparison mode
  leftSnapshot?: DecisionSnapshot;
  rightSnapshot?: DecisionSnapshot;
  comparisonResult?: DecisionComparisonResult;
  
  // Multi mode
  multiResult?: MultiDecisionComparisonResult;
  selectedNodes: string[];
  
  // Playback
  isPlaying: boolean;
  currentIndex: number;
  speed: number;
  
  // UI
  showDivergences: boolean;
  showMetrics: boolean;
  highlightDifferences: boolean;
}

export const DEFAULT_COMPARISON_STATE: ComparisonReplayState = {
  mode: 'single',
  selectedNodes: [],
  isPlaying: false,
  currentIndex: 0,
  speed: 1,
  showDivergences: true,
  showMetrics: true,
  highlightDifferences: true,
};

// ─────────────────────────────────────────────────────
// CONFIGURATION
// ─────────────────────────────────────────────────────

export interface ComparisonConfig {
  // Windows
  defaultContextWindow: number;
  defaultConsequenceWindow: number;
  
  // Clustering
  clusterThreshold: number;
  minClusterSize: number;
  
  // Similarity weights
  weights: {
    context: number;
    decision: number;
    outcome: number;
    agents: number;
    timing: number;
  };
  
  // Analysis
  minConfidenceForInsight: number;
  maxInsights: number;
}

export const DEFAULT_COMPARISON_CONFIG: ComparisonConfig = {
  defaultContextWindow: 5,
  defaultConsequenceWindow: 5,
  clusterThreshold: 2,
  minClusterSize: 2,
  weights: {
    context: 0.2,
    decision: 0.3,
    outcome: 0.25,
    agents: 0.15,
    timing: 0.1,
  },
  minConfidenceForInsight: 0.6,
  maxInsights: 10,
};

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default {
  DEFAULT_COMPARISON_STATE,
  DEFAULT_COMPARISON_CONFIG,
};
