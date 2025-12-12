/* =========================================
   CHE·NU — AGENT MANIFESTO MODULE EXPORTS
   
   Système d'agents basé sur le Agent Mission Manifesto.
   
   ⚠️ "Agents exist to serve clarity, not outcomes."
   ========================================= */

// === TYPES ===
export * from './manifesto.types';

// === ORCHESTRATOR (L0) ===
export {
  processIntention,
  queryAgent,
  queryAgents,
  registerAgent,
  unregisterAgent,
  isActive,
  getRegisteredAgents,
  getCollectedResponses,
  ORCHESTRATOR_DEFINITION,
} from './orchestrator';

// === FOUNDATIONAL AGENTS (L1) ===
export {
  registerFoundationalAgents,
  addToMemory,
  trackPresetChange,
  trackNavigationChange,
  resetSessionMetrics,
} from './foundational.agents';

// === VALIDATOR ===
export {
  validateAction,
  validateTimelineAccess,
  validateCommunication,
  validateAgentOutput,
  validateSuggestion,
  guardAgentAction,
  guardTimelineWrite,
  guardCommunication,
  guardAgentOutput,
  createSafeAgent,
  generateComplianceReport,
  getAgentViolations,
  clearAgentViolations,
  MANIFESTO_RULES,
  type AgentViolationType,
  type AgentViolation,
  type AgentComplianceReport,
} from './agent.validator';

// === REACT HOOK ===
export {
  useAgents,
  AgentsProvider,
  useAgentsContext,
} from './useAgents';

// ============================================
// INITIALIZATION
// ============================================

import { registerFoundationalAgents } from './foundational.agents';
import { logger } from '../../../utils/logger';

const manifestoLogger = logger.scope('Manifesto');

let initialized = false;

/**
 * Initialiser le système d'agents Manifesto
 */
export function initializeAgentSystem(): void {
  if (initialized) {
    manifestoLogger.warn('Agent system already initialized');
    return;
  }

  // Enregistrer les agents L1
  registerFoundationalAgents();

  initialized = true;
  manifestoLogger.info('✅ Agent Manifesto system initialized');
  manifestoLogger.info('📜 Core Rules:');
  manifestoLogger.info('   1. Agents advise, NEVER act');
  manifestoLogger.info('   2. Orchestration over autonomy');
  manifestoLogger.info('   3. Contextual and explainable');
}

/**
 * Vérifier si le système est initialisé
 */
export function isAgentSystemInitialized(): boolean {
  return initialized;
}

/**
 * Reset le système (tests uniquement)
 */
export function resetAgentSystem(): void {
  initialized = false;
  manifestoLogger.debug('Agent system reset');
}
