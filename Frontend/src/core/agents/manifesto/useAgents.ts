/* =========================================
   CHE·NU — useAgents Hook
   
   Hook React pour interagir avec le système d'agents.
   
   Usage:
   const { askAgents, isProcessing, lastResponse } = useAgents();
   
   const response = await askAgents('I need to focus on my project');
   ========================================= */

import { useState, useCallback, useMemo } from 'react';
import {
  processIntention,
  queryAgent,
  getRegisteredAgents,
  isActive,
} from './orchestrator';
import {
  OrchestratorInput,
  OrchestratorOutput,
  AgentOutput,
  NeutralOption,
  SystemContext,
} from './manifesto.types';
import { generateComplianceReport, AgentComplianceReport } from './agent.validator';

// ============================================
// HOOK STATE
// ============================================

interface AgentsState {
  isProcessing: boolean;
  lastResponse: OrchestratorOutput | null;
  error: Error | null;
  selectedOption: NeutralOption | null;
}

// ============================================
// HOOK
// ============================================

export function useAgents() {
  const [state, setState] = useState<AgentsState>({
    isProcessing: false,
    lastResponse: null,
    error: null,
    selectedOption: null,
  });

  /**
   * Demander aux agents d'analyser une intention
   */
  const askAgents = useCallback(async (
    intention: string,
    context?: SystemContext,
    targetAgents?: string[]
  ): Promise<OrchestratorOutput | null> => {
    setState((s) => ({ ...s, isProcessing: true, error: null }));

    try {
      const input: OrchestratorInput = {
        userIntention: intention,
        context,
        targetAgents,
      };

      const response = await processIntention(input);

      setState((s) => ({
        ...s,
        isProcessing: false,
        lastResponse: response,
      }));

      return response;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      setState((s) => ({
        ...s,
        isProcessing: false,
        error: err,
      }));
      return null;
    }
  }, []);

  /**
   * Consulter un agent spécifique
   */
  const askAgent = useCallback(async <T>(
    agentId: string,
    input: unknown
  ): Promise<AgentOutput<T> | null> => {
    return queryAgent<T>(agentId, input);
  }, []);

  /**
   * Sélectionner une option
   */
  const selectOption = useCallback((option: NeutralOption) => {
    setState((s) => ({ ...s, selectedOption: option }));
  }, []);

  /**
   * Effacer la sélection
   */
  const clearSelection = useCallback(() => {
    setState((s) => ({ ...s, selectedOption: null }));
  }, []);

  /**
   * Effacer la dernière réponse
   */
  const clearResponse = useCallback(() => {
    setState((s) => ({
      ...s,
      lastResponse: null,
      selectedOption: null,
      error: null,
    }));
  }, []);

  /**
   * Obtenir les agents disponibles
   */
  const availableAgents = useMemo(() => {
    return getRegisteredAgents();
  }, []);

  /**
   * Vérifier si l'orchestrator est actif
   */
  const orchestratorActive = useMemo(() => {
    return isActive();
  }, [state.isProcessing]);

  /**
   * Obtenir le rapport de conformité
   */
  const getCompliance = useCallback((): AgentComplianceReport => {
    return generateComplianceReport();
  }, []);

  return {
    // State
    isProcessing: state.isProcessing,
    lastResponse: state.lastResponse,
    error: state.error,
    selectedOption: state.selectedOption,

    // Actions
    askAgents,
    askAgent,
    selectOption,
    clearSelection,
    clearResponse,

    // Info
    availableAgents,
    orchestratorActive,
    getCompliance,

    // Helpers
    options: state.lastResponse?.options ?? [],
    synthesis: state.lastResponse?.synthesis ?? '',
    hasResponse: state.lastResponse !== null,
    hasError: state.error !== null,
  };
}

// ============================================
// CONTEXT (For deep nesting)
// ============================================

import { createContext, useContext, ReactNode } from 'react';

const AgentsContext = createContext<ReturnType<typeof useAgents> | null>(null);

export function AgentsProvider({ children }: { children: ReactNode }) {
  const agents = useAgents();

  return (
    <AgentsContext.Provider value={agents}>
      {children}
    </AgentsContext.Provider>
  );
}

export function useAgentsContext() {
  const context = useContext(AgentsContext);
  if (!context) {
    throw new Error('useAgentsContext must be used within AgentsProvider');
  }
  return context;
}
