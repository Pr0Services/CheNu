/* =========================================
   CHE·NU — AGENT VALIDATOR
   
   Validateur qui enforce les règles du manifeste.
   Bloque toute tentative de violation.
   
   ⚠️ RÈGLES INVIOLABLES:
   - Agents advise, NEVER act
   - No agent-to-agent communication
   - No timeline writes
   - No autonomous actions
   ========================================= */

import {
  AgentOutput,
  AgentSuggestion,
  ForbiddenAction,
  FORBIDDEN_AGENT_ACTIONS,
  COMMUNICATION_RULES,
  VALID_SUGGESTION_PREFIXES,
  INVALID_SUGGESTION_PREFIXES,
  isForbiddenAction,
  ManifestoAgentLevel,
} from './manifesto.types';
import { logger } from '../../../utils/logger';

const validatorLogger = logger.scope('AgentValidator');

// ============================================
// VIOLATION TYPES
// ============================================

export type AgentViolationType =
  | 'FORBIDDEN_ACTION'
  | 'INVALID_COMMUNICATION'
  | 'INVALID_SUGGESTION'
  | 'MISSING_EXPLANATION'
  | 'TIMELINE_WRITE_ATTEMPT'
  | 'AUTONOMOUS_ACTION'
  | 'AGENT_TO_AGENT'
  | 'IMPERATIVE_LANGUAGE';

export interface AgentViolation {
  type: AgentViolationType;
  agentId: string;
  message: string;
  severity: 'critical' | 'high' | 'medium';
  timestamp: number;
  context?: Record<string, unknown>;
}

// ============================================
// VIOLATION LOG
// ============================================

const violationLog: AgentViolation[] = [];

function logViolation(violation: AgentViolation): void {
  violationLog.push(violation);
  
  if (violation.severity === 'critical') {
    validatorLogger.error(`🚨 CRITICAL VIOLATION: ${violation.message}`, violation);
  } else {
    validatorLogger.warn(`⚠️ Violation: ${violation.message}`, violation);
  }
}

export function getAgentViolations(): readonly AgentViolation[] {
  return [...violationLog];
}

export function clearAgentViolations(): void {
  violationLog.length = 0;
}

// ============================================
// ACTION VALIDATORS
// ============================================

/**
 * Valider qu'une action n'est pas interdite
 */
export function validateAction(
  agentId: string,
  action: string
): AgentViolation | null {
  if (isForbiddenAction(action)) {
    const violation: AgentViolation = {
      type: 'FORBIDDEN_ACTION',
      agentId,
      message: `Agent "${agentId}" attempted forbidden action: ${action}`,
      severity: 'critical',
      timestamp: Date.now(),
      context: { action },
    };
    logViolation(violation);
    return violation;
  }
  return null;
}

/**
 * Valider une tentative d'écriture timeline
 */
export function validateTimelineAccess(
  agentId: string,
  accessType: 'read' | 'write'
): AgentViolation | null {
  if (accessType === 'write') {
    const violation: AgentViolation = {
      type: 'TIMELINE_WRITE_ATTEMPT',
      agentId,
      message: `Agent "${agentId}" attempted to write to timeline - FORBIDDEN`,
      severity: 'critical',
      timestamp: Date.now(),
    };
    logViolation(violation);
    return violation;
  }
  return null;
}

/**
 * Valider une communication inter-agent
 */
export function validateCommunication(
  sourceAgentId: string,
  targetAgentId: string,
  isOrchestrator: boolean
): AgentViolation | null {
  // Seul l'orchestrator peut communiquer avec les agents
  if (!isOrchestrator && targetAgentId !== 'orchestrator') {
    const violation: AgentViolation = {
      type: 'AGENT_TO_AGENT',
      agentId: sourceAgentId,
      message: `Agent "${sourceAgentId}" attempted direct communication with "${targetAgentId}" - FORBIDDEN`,
      severity: 'critical',
      timestamp: Date.now(),
      context: { target: targetAgentId },
    };
    logViolation(violation);
    return violation;
  }
  return null;
}

// ============================================
// OUTPUT VALIDATORS
// ============================================

/**
 * Valider une sortie d'agent
 */
export function validateAgentOutput(output: AgentOutput): AgentViolation[] {
  const violations: AgentViolation[] = [];
  
  // 1. Vérifier que l'explication est présente
  if (!output.explanation || output.explanation.trim().length === 0) {
    violations.push({
      type: 'MISSING_EXPLANATION',
      agentId: output.agentId,
      message: `Agent "${output.agentId}" output missing required explanation`,
      severity: 'high',
      timestamp: Date.now(),
    });
  }
  
  // 2. Valider les suggestions
  if (output.suggestions) {
    for (const suggestion of output.suggestions) {
      const suggestionViolation = validateSuggestion(output.agentId, suggestion);
      if (suggestionViolation) {
        violations.push(suggestionViolation);
      }
    }
  }
  
  // Log toutes les violations
  violations.forEach(logViolation);
  
  return violations;
}

/**
 * Valider une suggestion
 */
export function validateSuggestion(
  agentId: string,
  suggestion: AgentSuggestion
): AgentViolation | null {
  const text = suggestion.text;
  const lowerText = text.toLowerCase();
  
  // Vérifier les préfixes interdits (langage impératif)
  for (const invalidPrefix of INVALID_SUGGESTION_PREFIXES) {
    if (lowerText.startsWith(invalidPrefix.toLowerCase())) {
      return {
        type: 'IMPERATIVE_LANGUAGE',
        agentId,
        message: `Agent "${agentId}" used imperative language: "${text.slice(0, 30)}..."`,
        severity: 'high',
        timestamp: Date.now(),
        context: { suggestion: text, invalidPrefix },
      };
    }
  }
  
  // Vérifier que le préfixe est valide
  const hasValidPrefix = VALID_SUGGESTION_PREFIXES.some((prefix) =>
    lowerText.startsWith(prefix.toLowerCase())
  );
  
  if (!hasValidPrefix) {
    return {
      type: 'INVALID_SUGGESTION',
      agentId,
      message: `Agent "${agentId}" suggestion doesn't use approved phrasing`,
      severity: 'medium',
      timestamp: Date.now(),
      context: { suggestion: text },
    };
  }
  
  return null;
}

// ============================================
// GUARDS
// ============================================

/**
 * Guard pour empêcher les actions interdites
 */
export function guardAgentAction<T>(
  agentId: string,
  action: string,
  fn: () => T
): T | null {
  const violation = validateAction(agentId, action);
  if (violation) {
    validatorLogger.error('🛑 Agent action blocked', violation);
    return null;
  }
  return fn();
}

/**
 * Guard pour empêcher les écritures timeline
 */
export function guardTimelineWrite<T>(
  agentId: string,
  fn: () => T
): T | null {
  const violation = validateTimelineAccess(agentId, 'write');
  if (violation) {
    validatorLogger.error('🛑 Timeline write blocked', violation);
    return null;
  }
  return fn();
}

/**
 * Guard pour les communications
 */
export function guardCommunication<T>(
  sourceAgentId: string,
  targetAgentId: string,
  isOrchestrator: boolean,
  fn: () => T
): T | null {
  const violation = validateCommunication(sourceAgentId, targetAgentId, isOrchestrator);
  if (violation) {
    validatorLogger.error('🛑 Communication blocked', violation);
    return null;
  }
  return fn();
}

/**
 * Guard complet pour output d'agent
 */
export function guardAgentOutput<T extends AgentOutput>(
  output: T
): T | null {
  const violations = validateAgentOutput(output);
  
  // Bloquer si violation critique
  if (violations.some((v) => v.severity === 'critical')) {
    validatorLogger.error('🛑 Agent output blocked due to critical violation');
    return null;
  }
  
  return output;
}

// ============================================
// AGENT WRAPPER
// ============================================

/**
 * Wrapper qui applique toutes les validations
 */
export function createSafeAgent<I, O>(
  agentId: string,
  handler: (input: I) => Promise<AgentOutput<O>>
): (input: I) => Promise<AgentOutput<O> | null> {
  return async (input: I) => {
    try {
      const output = await handler(input);
      
      // Valider l'output
      const guardedOutput = guardAgentOutput(output);
      
      if (!guardedOutput) {
        validatorLogger.warn(`Agent ${agentId} output rejected`);
        return null;
      }
      
      return guardedOutput;
    } catch (error) {
      validatorLogger.error(`Agent ${agentId} threw error`, error);
      return null;
    }
  };
}

// ============================================
// COMPLIANCE REPORT
// ============================================

export interface AgentComplianceReport {
  compliant: boolean;
  totalViolations: number;
  criticalViolations: number;
  violationsByAgent: Record<string, number>;
  violationsByType: Record<AgentViolationType, number>;
  summary: string;
}

/**
 * Générer un rapport de conformité
 */
export function generateComplianceReport(): AgentComplianceReport {
  const violations = getAgentViolations();
  
  const criticalCount = violations.filter((v) => v.severity === 'critical').length;
  
  const byAgent: Record<string, number> = {};
  const byType: Record<AgentViolationType, number> = {} as Record<AgentViolationType, number>;
  
  for (const v of violations) {
    byAgent[v.agentId] = (byAgent[v.agentId] || 0) + 1;
    byType[v.type] = (byType[v.type] || 0) + 1;
  }
  
  return {
    compliant: criticalCount === 0,
    totalViolations: violations.length,
    criticalViolations: criticalCount,
    violationsByAgent: byAgent,
    violationsByType: byType,
    summary: criticalCount === 0
      ? `✅ Agent system compliant. ${violations.length} minor violation(s).`
      : `🚨 ${criticalCount} critical violation(s) detected!`,
  };
}

// ============================================
// MANIFESTO RULES DISPLAY
// ============================================

export const MANIFESTO_RULES = {
  core: [
    'Agents advise, NEVER act',
    'Orchestration over autonomy',
    'Contextual and explainable',
  ],
  forbidden: [
    'No timeline writes',
    'No decision finalization',
    'No irreversible changes',
    'No agent-to-agent communication',
    'No UI access',
    'No autonomous actions',
  ],
  communication: {
    allowed: COMMUNICATION_RULES.allowed,
    forbidden: COMMUNICATION_RULES.forbidden,
  },
  phrasing: {
    valid: VALID_SUGGESTION_PREFIXES,
    invalid: INVALID_SUGGESTION_PREFIXES,
  },
} as const;
