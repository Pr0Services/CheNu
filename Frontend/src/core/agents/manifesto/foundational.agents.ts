/* =========================================
   CHE·NU — L1 FOUNDATIONAL AGENTS
   
   Les 5 agents fondamentaux qui forment
   le "cognitive backbone" de CHE·NU.
   
   ⚠️ RÈGLE: Agents advise, NEVER act
   ========================================= */

import {
  AgentOutput,
  AgentSuggestion,
  ConfidenceLevel,
  DecisionAnalystOutput,
  ContextAnalyzerOutput,
  PresetAdvisorOutput,
  MemoryAgentOutput,
  UXObserverOutput,
  SystemContext,
  RiskFlag,
  ContextConflict,
  PresetSuggestion,
  PastDecision,
  UXSignal,
  OrchestratorInput,
  FOUNDATIONAL_AGENTS,
  createFailSafeResponse,
  VALID_SUGGESTION_PREFIXES,
} from './manifesto.types';
import { registerAgent } from './orchestrator';
import { logger } from '../../../utils/logger';

const agentLogger = logger.scope('Agents:L1');

// ============================================
// HELPER FUNCTIONS
// ============================================

function createSuggestion(
  text: string,
  type: AgentSuggestion['type'],
  context?: string
): AgentSuggestion {
  // Assurer que le texte commence par une phrase valide
  const prefix = VALID_SUGGESTION_PREFIXES[0]; // "You may want to consider"
  const formattedText = text.startsWith('You') || text.startsWith('Consider')
    ? text
    : `${prefix} ${text.toLowerCase()}`;
  
  return {
    id: `sug-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    text: formattedText,
    type,
    context,
  };
}

function assessConfidence(factors: {
  dataQuality: number;
  contextClarity: number;
  signalStrength: number;
}): ConfidenceLevel {
  const avg = (factors.dataQuality + factors.contextClarity + factors.signalStrength) / 3;
  
  if (avg >= 0.8) return 'high';
  if (avg >= 0.5) return 'medium';
  if (avg >= 0.3) return 'low';
  return 'uncertain';
}

// ============================================
// 1. DECISION ANALYST
// ============================================

async function handleDecisionAnalyst(
  input: OrchestratorInput
): Promise<AgentOutput<DecisionAnalystOutput>> {
  agentLogger.debug('Decision Analyst processing', { 
    intention: input.userIntention.slice(0, 30) 
  });
  
  const intention = input.userIntention.toLowerCase();
  
  // Analyser l'intention
  const intentSummary = extractIntentSummary(intention);
  const decisionScope = assessDecisionScope(intention);
  const riskFlags = identifyRiskFlags(intention);
  const constraints = extractConstraints(intention);
  
  // Évaluer la confiance
  const confidence = assessConfidence({
    dataQuality: intention.length > 10 ? 0.8 : 0.4,
    contextClarity: input.context ? 0.9 : 0.5,
    signalStrength: 0.7,
  });
  
  // Si confiance trop basse, fail-safe
  if (confidence === 'uncertain') {
    const failSafe = createFailSafeResponse(
      'Unable to clearly extract intention from input'
    );
    return {
      agentId: 'decision_analyst',
      timestamp: Date.now(),
      confidence: 'uncertain',
      data: {
        intentSummary: 'Unclear - needs clarification',
        decisionScope: 'trivial',
        riskFlags: [],
        constraints: [],
      },
      explanation: failSafe.reason,
      warnings: ['Context unclear, deferring to human'],
    };
  }
  
  const suggestions: AgentSuggestion[] = [];
  
  if (decisionScope === 'major' || decisionScope === 'critical') {
    suggestions.push(
      createSuggestion(
        'taking time to review this decision given its scope',
        'consideration'
      )
    );
  }
  
  if (riskFlags.length > 0) {
    suggestions.push(
      createSuggestion(
        `the identified risk factors: ${riskFlags.map(r => r.type).join(', ')}`,
        'consideration'
      )
    );
  }
  
  return {
    agentId: 'decision_analyst',
    timestamp: Date.now(),
    confidence,
    data: {
      intentSummary,
      decisionScope,
      riskFlags,
      constraints,
    },
    explanation: `Analyzed intention: "${intentSummary}". Decision scope: ${decisionScope}. ${riskFlags.length} risk flags identified.`,
    suggestions,
  };
}

function extractIntentSummary(intention: string): string {
  // Simplifier l'intention
  const words = intention.split(' ').slice(0, 10);
  return words.join(' ') + (words.length === 10 ? '...' : '');
}

function assessDecisionScope(
  intention: string
): DecisionAnalystOutput['decisionScope'] {
  const criticalWords = ['urgent', 'critical', 'immediate', 'emergency'];
  const majorWords = ['important', 'significant', 'major', 'contract', 'hire'];
  const minorWords = ['small', 'quick', 'minor', 'simple'];
  
  if (criticalWords.some((w) => intention.includes(w))) return 'critical';
  if (majorWords.some((w) => intention.includes(w))) return 'major';
  if (minorWords.some((w) => intention.includes(w))) return 'minor';
  
  return 'significant';
}

function identifyRiskFlags(intention: string): RiskFlag[] {
  const flags: RiskFlag[] = [];
  
  if (intention.includes('deadline') || intention.includes('urgent')) {
    flags.push({
      type: 'time_pressure',
      description: 'Time constraint detected',
      severity: 'warning',
    });
  }
  
  if (intention.includes('budget') || intention.includes('cost')) {
    flags.push({
      type: 'financial',
      description: 'Financial considerations involved',
      severity: 'info',
    });
  }
  
  if (intention.includes('team') || intention.includes('people')) {
    flags.push({
      type: 'stakeholders',
      description: 'Multiple stakeholders involved',
      severity: 'info',
    });
  }
  
  return flags;
}

function extractConstraints(intention: string): string[] {
  const constraints: string[] = [];
  
  if (intention.includes('must') || intention.includes('required')) {
    constraints.push('Hard requirements identified');
  }
  
  if (intention.includes('before') || intention.includes('by')) {
    constraints.push('Time constraint');
  }
  
  if (intention.includes('budget') || intention.includes('limit')) {
    constraints.push('Resource constraint');
  }
  
  return constraints;
}

// ============================================
// 2. CONTEXT ANALYZER
// ============================================

async function handleContextAnalyzer(
  input: OrchestratorInput
): Promise<AgentOutput<ContextAnalyzerOutput>> {
  agentLogger.debug('Context Analyzer processing');
  
  // Construire le snapshot
  const snapshot: SystemContext = input.context || {
    activeSphere: null,
    activePreset: null,
    sessionDuration: 0,
    timelinePointer: 0,
    recentActions: [],
  };
  
  // Détecter les conflits
  const conflicts = detectConflicts(snapshot, input.userIntention);
  
  // Évaluer la préparation
  const { readiness, readinessReason } = assessReadiness(snapshot, conflicts);
  
  const confidence = assessConfidence({
    dataQuality: input.context ? 0.9 : 0.3,
    contextClarity: conflicts.length === 0 ? 0.9 : 0.6,
    signalStrength: 0.8,
  });
  
  const suggestions: AgentSuggestion[] = [];
  
  if (readiness === 'needs_clarification') {
    suggestions.push(
      createSuggestion(
        'clarifying the context before proceeding',
        'clarification',
        readinessReason
      )
    );
  }
  
  if (conflicts.length > 0) {
    suggestions.push(
      createSuggestion(
        'resolving the detected conflicts first',
        'consideration'
      )
    );
  }
  
  return {
    agentId: 'context_analyzer',
    timestamp: Date.now(),
    confidence,
    data: {
      snapshot,
      conflicts,
      readiness,
      readinessReason,
    },
    explanation: `Context: Sphere=${snapshot.activeSphere || 'none'}, Preset=${snapshot.activePreset || 'none'}. Readiness: ${readiness}. ${conflicts.length} conflict(s) detected.`,
    suggestions,
  };
}

function detectConflicts(
  context: SystemContext,
  intention: string
): ContextConflict[] {
  const conflicts: ContextConflict[] = [];
  
  // Pas de sphère active mais intention nécessite un domaine
  if (!context.activeSphere && intention.includes('project')) {
    conflicts.push({
      type: 'missing_sphere',
      description: 'No active sphere but intention suggests domain context',
      suggestion: 'Consider selecting a sphere first',
    });
  }
  
  // Session très longue
  if (context.sessionDuration > 7200000) { // 2 hours
    conflicts.push({
      type: 'long_session',
      description: 'Session duration exceeds 2 hours',
      suggestion: 'Consider taking a break',
    });
  }
  
  return conflicts;
}

function assessReadiness(
  context: SystemContext,
  conflicts: ContextConflict[]
): { readiness: ContextAnalyzerOutput['readiness']; readinessReason?: string } {
  if (conflicts.some((c) => c.type === 'blocking')) {
    return {
      readiness: 'blocked',
      readinessReason: 'Blocking conflict detected',
    };
  }
  
  if (conflicts.length > 0 || !context.activeSphere) {
    return {
      readiness: 'needs_clarification',
      readinessReason: 'Some context elements need clarification',
    };
  }
  
  return { readiness: 'ready' };
}

// ============================================
// 3. PRESET ADVISOR
// ============================================

async function handlePresetAdvisor(
  input: OrchestratorInput
): Promise<AgentOutput<PresetAdvisorOutput>> {
  agentLogger.debug('Preset Advisor processing');
  
  const intention = input.userIntention.toLowerCase();
  const context = input.context;
  
  // Suggérer des presets basés sur l'intention
  const suggestedPresets = suggestPresets(intention, context);
  const reasoning = generatePresetReasoning(suggestedPresets, intention);
  
  const confidence = assessConfidence({
    dataQuality: 0.7,
    contextClarity: context ? 0.8 : 0.5,
    signalStrength: suggestedPresets.length > 0 ? 0.8 : 0.4,
  });
  
  const suggestions: AgentSuggestion[] = suggestedPresets.map((p) =>
    createSuggestion(
      `switching to "${p.presetId}" preset because ${p.reason}`,
      'alternative'
    )
  );
  
  return {
    agentId: 'preset_advisor',
    timestamp: Date.now(),
    confidence,
    data: {
      suggestedPresets,
      reasoning,
    },
    explanation: reasoning,
    suggestions,
    warnings: ['Preset Advisor never activates presets - human validation required'],
  };
}

function suggestPresets(
  intention: string,
  context?: SystemContext
): PresetSuggestion[] {
  const suggestions: PresetSuggestion[] = [];
  
  // Focus pour concentration
  if (intention.includes('focus') || intention.includes('concentrate')) {
    suggestions.push({
      presetId: 'focus',
      reason: 'intention indicates need for concentration',
      confidence: 'high',
    });
  }
  
  // Exploration pour recherche
  if (intention.includes('explore') || intention.includes('research')) {
    suggestions.push({
      presetId: 'exploration',
      reason: 'intention suggests exploration or research',
      confidence: 'medium',
    });
  }
  
  // Meeting pour collaboration
  if (intention.includes('meeting') || intention.includes('collaborate')) {
    suggestions.push({
      presetId: 'meeting',
      reason: 'collaborative context detected',
      confidence: 'high',
    });
  }
  
  // Audit pour vérification
  if (intention.includes('review') || intention.includes('audit')) {
    suggestions.push({
      presetId: 'audit',
      reason: 'review or verification context',
      confidence: 'medium',
    });
  }
  
  // Default si aucune correspondance
  if (suggestions.length === 0) {
    suggestions.push({
      presetId: context?.activePreset || 'focus',
      reason: 'no clear preference detected, suggesting default',
      confidence: 'low',
    });
  }
  
  return suggestions;
}

function generatePresetReasoning(
  presets: PresetSuggestion[],
  intention: string
): string {
  if (presets.length === 0) {
    return 'Unable to determine appropriate preset. Current preset may be suitable.';
  }
  
  const primary = presets[0];
  return `Based on the intention "${intention.slice(0, 30)}...", the "${primary.presetId}" preset might be suitable because ${primary.reason}. This is a suggestion only - preset activation requires your validation.`;
}

// ============================================
// 4. MEMORY AGENT
// ============================================

// Simulated memory store (in real implementation, would be persistent)
const memoryStore: PastDecision[] = [];

async function handleMemoryAgent(
  input: OrchestratorInput
): Promise<AgentOutput<MemoryAgentOutput>> {
  agentLogger.debug('Memory Agent processing');
  
  const intention = input.userIntention.toLowerCase();
  
  // Rechercher des décisions pertinentes
  const relevantDecisions = findRelevantDecisions(intention);
  const patterns = detectPatterns(relevantDecisions);
  
  const confidence = assessConfidence({
    dataQuality: relevantDecisions.length > 0 ? 0.8 : 0.3,
    contextClarity: 0.7,
    signalStrength: relevantDecisions.length > 0 ? 0.7 : 0.2,
  });
  
  const suggestions: AgentSuggestion[] = [];
  
  if (relevantDecisions.length > 0) {
    const topDecision = relevantDecisions[0];
    suggestions.push(
      createSuggestion(
        `Historically, you decided "${topDecision.summary}" in a similar context`,
        'historical',
        `Relevance: ${Math.round(topDecision.relevanceScore * 100)}%`
      )
    );
  }
  
  if (patterns && patterns.length > 0) {
    suggestions.push(
      createSuggestion(
        `a pattern has been observed: ${patterns[0]}`,
        'historical'
      )
    );
  }
  
  return {
    agentId: 'memory_agent',
    timestamp: Date.now(),
    confidence,
    data: {
      relevantDecisions,
      patterns,
      noMemory: relevantDecisions.length === 0,
    },
    explanation: relevantDecisions.length > 0
      ? `Found ${relevantDecisions.length} relevant past decision(s).`
      : 'No relevant past decisions found in memory.',
    suggestions,
    warnings: relevantDecisions.length === 0
      ? ['No memory available for this context']
      : undefined,
  };
}

function findRelevantDecisions(intention: string): PastDecision[] {
  // Simple keyword matching (in real implementation, would use embeddings)
  const keywords = intention.split(' ').filter((w) => w.length > 3);
  
  return memoryStore
    .map((decision) => ({
      ...decision,
      relevanceScore: calculateRelevance(decision.summary, keywords),
    }))
    .filter((d) => d.relevanceScore > 0.3)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 5);
}

function calculateRelevance(summary: string, keywords: string[]): number {
  const summaryLower = summary.toLowerCase();
  const matches = keywords.filter((k) => summaryLower.includes(k.toLowerCase()));
  return matches.length / Math.max(keywords.length, 1);
}

function detectPatterns(decisions: PastDecision[]): string[] | undefined {
  if (decisions.length < 2) return undefined;
  
  // Simple pattern detection
  const patterns: string[] = [];
  
  // Check for similar outcomes
  const outcomes = decisions
    .filter((d) => d.outcome)
    .map((d) => d.outcome!);
  
  if (outcomes.length >= 2) {
    patterns.push('Similar decisions have been made before');
  }
  
  return patterns.length > 0 ? patterns : undefined;
}

/**
 * Ajouter une décision en mémoire (validée par l'humain)
 */
export function addToMemory(decision: Omit<PastDecision, 'relevanceScore'>): void {
  memoryStore.push({
    ...decision,
    relevanceScore: 1.0,
  });
  agentLogger.debug('Decision added to memory', { id: decision.id });
}

// ============================================
// 5. UX OBSERVER
// ============================================

// Session tracking
interface SessionMetrics {
  startTime: number;
  interactions: number;
  navigationChanges: number;
  lastInteractionTime: number;
  presetChanges: number;
}

const sessionMetrics: SessionMetrics = {
  startTime: Date.now(),
  interactions: 0,
  navigationChanges: 0,
  lastInteractionTime: Date.now(),
  presetChanges: 0,
};

async function handleUXObserver(
  input: OrchestratorInput
): Promise<AgentOutput<UXObserverOutput>> {
  agentLogger.debug('UX Observer processing');
  
  // Mettre à jour les métriques
  sessionMetrics.interactions++;
  sessionMetrics.lastInteractionTime = Date.now();
  
  // Détecter les signaux
  const signals = detectUXSignals(sessionMetrics, input.context);
  
  // Évaluer l'état cognitif
  const cognitiveState = assessCognitiveState(signals, sessionMetrics);
  
  // Générer une suggestion douce si nécessaire
  const gentleSuggestion = generateGentleSuggestion(cognitiveState, signals);
  
  const confidence = assessConfidence({
    dataQuality: 0.7,
    contextClarity: 0.6,
    signalStrength: signals.length > 0 ? 0.8 : 0.5,
  });
  
  const suggestions: AgentSuggestion[] = [];
  
  if (gentleSuggestion) {
    suggestions.push(
      createSuggestion(gentleSuggestion, 'consideration')
    );
  }
  
  return {
    agentId: 'ux_observer',
    timestamp: Date.now(),
    confidence,
    data: {
      cognitiveState,
      signals,
      gentleSuggestion,
    },
    explanation: `Cognitive state: ${cognitiveState}. ${signals.length} signal(s) detected.`,
    suggestions,
    warnings: cognitiveState === 'overloaded' || cognitiveState === 'confused'
      ? ['Elevated cognitive load detected']
      : undefined,
  };
}

function detectUXSignals(
  metrics: SessionMetrics,
  context?: SystemContext
): UXSignal[] {
  const signals: UXSignal[] = [];
  const sessionDuration = Date.now() - metrics.startTime;
  
  // Long session
  if (sessionDuration > 3600000) { // 1 hour
    signals.push({
      type: 'long_session',
      intensity: sessionDuration > 7200000 ? 'high' : 'medium',
    });
  }
  
  // Rapid switching (more than 10 preset changes)
  if (metrics.presetChanges > 10) {
    signals.push({
      type: 'rapid_switching',
      intensity: metrics.presetChanges > 20 ? 'high' : 'medium',
    });
  }
  
  // Navigation loops
  if (metrics.navigationChanges > 15) {
    signals.push({
      type: 'navigation_loop',
      intensity: 'medium',
    });
  }
  
  return signals;
}

function assessCognitiveState(
  signals: UXSignal[],
  metrics: SessionMetrics
): UXObserverOutput['cognitiveState'] {
  const highIntensityCount = signals.filter((s) => s.intensity === 'high').length;
  const mediumIntensityCount = signals.filter((s) => s.intensity === 'medium').length;
  
  if (highIntensityCount >= 2) return 'overloaded';
  if (highIntensityCount === 1 || mediumIntensityCount >= 2) return 'busy';
  if (signals.some((s) => s.type === 'navigation_loop')) return 'confused';
  if (signals.length > 0) return 'engaged';
  
  return 'clear';
}

function generateGentleSuggestion(
  state: UXObserverOutput['cognitiveState'],
  signals: UXSignal[]
): string | undefined {
  if (state === 'overloaded') {
    return 'taking a short break - the session has been quite active';
  }
  
  if (signals.some((s) => s.type === 'long_session' && s.intensity === 'high')) {
    return 'a brief pause - the session has been running for a while';
  }
  
  if (signals.some((s) => s.type === 'navigation_loop')) {
    return 'refining your current objective - there seems to be some navigation back and forth';
  }
  
  return undefined;
}

/**
 * Tracker un changement de preset
 */
export function trackPresetChange(): void {
  sessionMetrics.presetChanges++;
}

/**
 * Tracker un changement de navigation
 */
export function trackNavigationChange(): void {
  sessionMetrics.navigationChanges++;
}

/**
 * Reset les métriques de session
 */
export function resetSessionMetrics(): void {
  sessionMetrics.startTime = Date.now();
  sessionMetrics.interactions = 0;
  sessionMetrics.navigationChanges = 0;
  sessionMetrics.lastInteractionTime = Date.now();
  sessionMetrics.presetChanges = 0;
}

// ============================================
// REGISTER ALL L1 AGENTS
// ============================================

export function registerFoundationalAgents(): void {
  registerAgent('decision_analyst', handleDecisionAnalyst);
  registerAgent('context_analyzer', handleContextAnalyzer);
  registerAgent('preset_advisor', handlePresetAdvisor);
  registerAgent('memory_agent', handleMemoryAgent);
  registerAgent('ux_observer', handleUXObserver);
  
  agentLogger.info('All L1 foundational agents registered');
}
