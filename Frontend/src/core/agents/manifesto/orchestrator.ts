/* =========================================
   CHE·NU — L0 ORCHESTRATOR
   
   Point d'entrée unique pour toute activité agent.
   Coordonne, agrège, présente — NE DÉCIDE JAMAIS.
   
   ⚠️ RESTRICTIONS:
   - No domain knowledge
   - No data analysis
   - No direct UI manipulation
   - No writing to timeline
   ========================================= */

import {
  OrchestratorInput,
  OrchestratorOutput,
  NeutralOption,
  AgentOutput,
  ConfidenceLevel,
  FoundationalAgentType,
  FOUNDATIONAL_AGENTS,
  createFailSafeResponse,
} from './manifesto.types';
import { logger } from '../../../utils/logger';

const orchestratorLogger = logger.scope('Orchestrator');

// ============================================
// ORCHESTRATOR STATE
// ============================================

interface OrchestratorState {
  /** Est actif */
  active: boolean;
  /** Requête en cours */
  currentRequest: OrchestratorInput | null;
  /** Réponses collectées */
  collectedResponses: Map<string, AgentOutput>;
  /** Timestamp dernière activité */
  lastActivity: number;
}

const state: OrchestratorState = {
  active: false,
  currentRequest: null,
  collectedResponses: new Map(),
  lastActivity: 0,
};

// ============================================
// AGENT REGISTRY
// ============================================

type AgentHandler<I, O> = (input: I) => Promise<AgentOutput<O>>;

const agentHandlers = new Map<string, AgentHandler<unknown, unknown>>();

/**
 * Enregistrer un handler d'agent
 */
export function registerAgent<I, O>(
  agentId: string,
  handler: AgentHandler<I, O>
): void {
  if (agentHandlers.has(agentId)) {
    orchestratorLogger.warn(`Agent ${agentId} already registered, replacing`);
  }
  agentHandlers.set(agentId, handler as AgentHandler<unknown, unknown>);
  orchestratorLogger.debug(`Agent registered: ${agentId}`);
}

/**
 * Désinscrire un agent
 */
export function unregisterAgent(agentId: string): boolean {
  return agentHandlers.delete(agentId);
}

// ============================================
// CORE ORCHESTRATION
// ============================================

/**
 * Traiter une intention utilisateur
 * Point d'entrée principal de l'Orchestrator
 */
export async function processIntention(
  input: OrchestratorInput
): Promise<OrchestratorOutput> {
  orchestratorLogger.info('Processing user intention', { 
    intention: input.userIntention.slice(0, 50) 
  });
  
  // Activer l'orchestrator
  state.active = true;
  state.currentRequest = input;
  state.collectedResponses.clear();
  state.lastActivity = Date.now();
  
  try {
    // 1. Déterminer quels agents consulter
    const agentsToConsult = determineAgents(input);
    
    // 2. Consulter les agents
    const responses = await consultAgents(agentsToConsult, input);
    
    // 3. Agréger les réponses
    const synthesis = synthesizeResponses(responses);
    
    // 4. Construire les options neutres
    const options = buildNeutralOptions(responses);
    
    // 5. Construire la sortie
    const output: OrchestratorOutput = {
      synthesis,
      options,
      consultedAgents: agentsToConsult,
      requiresValidation: true, // TOUJOURS true
    };
    
    orchestratorLogger.info('Intention processed', {
      agentsConsulted: agentsToConsult.length,
      optionsGenerated: options.length,
    });
    
    return output;
    
  } finally {
    state.active = false;
    state.currentRequest = null;
  }
}

/**
 * Déterminer quels agents consulter
 */
function determineAgents(input: OrchestratorInput): string[] {
  // Si des agents sont spécifiés, les utiliser
  if (input.targetAgents && input.targetAgents.length > 0) {
    return input.targetAgents.filter((a) => agentHandlers.has(a));
  }
  
  // Sinon, consulter les agents fondamentaux par défaut
  const defaultAgents: FoundationalAgentType[] = [
    'decision_analyst',
    'context_analyzer',
  ];
  
  // Ajouter preset_advisor si contexte présent
  if (input.context) {
    defaultAgents.push('preset_advisor');
  }
  
  return defaultAgents;
}

/**
 * Consulter les agents sélectionnés
 */
async function consultAgents(
  agentIds: string[],
  input: OrchestratorInput
): Promise<AgentOutput[]> {
  const responses: AgentOutput[] = [];
  
  for (const agentId of agentIds) {
    const handler = agentHandlers.get(agentId);
    
    if (!handler) {
      orchestratorLogger.warn(`Agent not found: ${agentId}`);
      continue;
    }
    
    try {
      orchestratorLogger.debug(`Consulting agent: ${agentId}`);
      const response = await handler(input);
      
      // Valider la réponse
      if (validateAgentResponse(response)) {
        responses.push(response);
        state.collectedResponses.set(agentId, response);
      } else {
        orchestratorLogger.warn(`Invalid response from ${agentId}`);
      }
      
    } catch (error) {
      orchestratorLogger.error(`Agent ${agentId} failed`, error);
      // Continuer avec les autres agents
    }
  }
  
  return responses;
}

/**
 * Valider une réponse d'agent
 */
function validateAgentResponse(response: AgentOutput): boolean {
  // Doit avoir une explication
  if (!response.explanation || response.explanation.length === 0) {
    orchestratorLogger.warn('Agent response missing explanation');
    return false;
  }
  
  // Doit avoir un niveau de confiance
  if (!response.confidence) {
    orchestratorLogger.warn('Agent response missing confidence');
    return false;
  }
  
  return true;
}

/**
 * Synthétiser les réponses des agents
 */
function synthesizeResponses(responses: AgentOutput[]): string {
  if (responses.length === 0) {
    return 'No agent responses available. Please provide more context.';
  }
  
  // Vérifier si tous les agents sont incertains
  const allUncertain = responses.every((r) => r.confidence === 'uncertain');
  if (allUncertain) {
    return 'The agents are uncertain about this request. More information may be needed.';
  }
  
  // Combiner les explications des agents avec haute confiance
  const highConfidenceResponses = responses.filter(
    (r) => r.confidence === 'high' || r.confidence === 'medium'
  );
  
  if (highConfidenceResponses.length === 0) {
    return 'Limited confidence in analysis. Consider the options carefully.';
  }
  
  // Construire la synthèse
  const summaries = highConfidenceResponses.map(
    (r) => `[${r.agentId}]: ${r.explanation}`
  );
  
  return summaries.join('\n\n');
}

/**
 * Construire les options neutres
 */
function buildNeutralOptions(responses: AgentOutput[]): NeutralOption[] {
  const options: NeutralOption[] = [];
  let optionId = 1;
  
  for (const response of responses) {
    // Extraire les suggestions
    if (response.suggestions) {
      for (const suggestion of response.suggestions) {
        options.push({
          id: `opt-${optionId++}`,
          description: suggestion.text,
          sourceAgent: response.agentId,
          context: suggestion.context,
        });
      }
    }
  }
  
  // Si pas de suggestions, créer une option par défaut
  if (options.length === 0) {
    options.push({
      id: 'opt-default',
      description: 'Continue with current context',
      sourceAgent: 'orchestrator',
    });
  }
  
  return options;
}

// ============================================
// QUERY SPECIFIC AGENTS
// ============================================

/**
 * Consulter un agent spécifique
 */
export async function queryAgent<T>(
  agentId: string,
  input: unknown
): Promise<AgentOutput<T> | null> {
  const handler = agentHandlers.get(agentId);
  
  if (!handler) {
    orchestratorLogger.warn(`Agent not found: ${agentId}`);
    return null;
  }
  
  try {
    return await handler(input) as AgentOutput<T>;
  } catch (error) {
    orchestratorLogger.error(`Query to ${agentId} failed`, error);
    return null;
  }
}

/**
 * Consulter plusieurs agents en parallèle
 */
export async function queryAgents(
  agentIds: string[],
  input: unknown
): Promise<Map<string, AgentOutput>> {
  const results = new Map<string, AgentOutput>();
  
  await Promise.all(
    agentIds.map(async (agentId) => {
      const response = await queryAgent(agentId, input);
      if (response) {
        results.set(agentId, response);
      }
    })
  );
  
  return results;
}

// ============================================
// STATE ACCESSORS
// ============================================

/**
 * L'orchestrator est-il actif?
 */
export function isActive(): boolean {
  return state.active;
}

/**
 * Obtenir les agents enregistrés
 */
export function getRegisteredAgents(): string[] {
  return Array.from(agentHandlers.keys());
}

/**
 * Obtenir les réponses collectées
 */
export function getCollectedResponses(): Map<string, AgentOutput> {
  return new Map(state.collectedResponses);
}

// ============================================
// ORCHESTRATOR DEFINITION
// ============================================

export const ORCHESTRATOR_DEFINITION = {
  id: 'orchestrator',
  name: 'Orchestrator',
  level: 'L0' as const,
  purpose: 'Entry point for all agent activity. Routes, aggregates, presents.',
  capabilities: [],
  inputs: ['user_intention', 'context', 'target_agents'],
  outputs: ['synthesis', 'neutral_options', 'validation_request'],
  restrictions: [
    'no_domain_knowledge',
    'no_data_analysis',
    'no_ui_manipulation',
    'no_timeline_write',
  ],
};
