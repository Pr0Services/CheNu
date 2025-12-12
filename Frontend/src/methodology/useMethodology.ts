/* =====================================================
   CHE·NU — METHODOLOGY AGENT REACT HOOKS
   Version: 1.0
   Scope: Methodology / UI Integration
   
   📜 CORE PRINCIPLE:
   The Methodology Agent NEVER optimizes humans.
   All outputs require human validation.
   ===================================================== */

import { useState, useCallback, useMemo } from 'react';
import {
  type MethodologyAgentRole,
  type MethodologyContext,
  type MethodologyReplaySummary,
  type MethodologyInsight,
  type MethodologyPattern,
  type MethodologyProposal,
  type MethodologySnippet,
  type AnyMethodologyAgentOutput,
  type MethodologyObserverOutput,
  type MethodologyAdvisorOutput,
  type MethodologyDocumenterOutput,
  isObserverOutput,
  isAdvisorOutput,
  isDocumenterOutput,
  METHODOLOGY_ROLES,
} from './methodology.types';
import {
  getMethodologyAgent,
  runMethodologyObserver,
  runMethodologyAdvisor,
  runMethodologyDocumenter,
  runFullMethodologyPipeline,
} from './methodology.engine';

/* =========================================================
   HOOK RETURN TYPES
   ========================================================= */

export interface UseMethodologyAgentReturn {
  /** Execute specific role */
  executeRole: (
    role: MethodologyAgentRole,
    data: {
      replaySummary?: MethodologyReplaySummary;
      insights?: MethodologyInsight[];
      patterns?: MethodologyPattern[];
      existingSnippets?: MethodologySnippet[];
    }
  ) => Promise<void>;
  /** Run full pipeline */
  runPipeline: (
    replaySummary: MethodologyReplaySummary,
    existingSnippets?: MethodologySnippet[]
  ) => Promise<void>;
  /** Current output */
  output: AnyMethodologyAgentOutput | null;
  /** Pipeline outputs */
  pipelineOutputs: {
    observer: MethodologyObserverOutput | null;
    advisor: MethodologyAdvisorOutput | null;
    documenter: MethodologyDocumenterOutput | null;
  };
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: Error | null;
  /** Clear outputs */
  clear: () => void;
  /** Last role executed */
  lastRole: MethodologyAgentRole | null;
}

export interface UseMethodologyInsightsReturn {
  /** Current insights */
  insights: MethodologyInsight[];
  /** Current patterns */
  patterns: MethodologyPattern[];
  /** Observe replay */
  observe: (replaySummary: MethodologyReplaySummary) => Promise<void>;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: Error | null;
  /** Clear insights */
  clear: () => void;
}

export interface UseMethodologyProposalsReturn {
  /** Current proposals */
  proposals: MethodologyProposal[];
  /** Comparison notes */
  comparisonNotes: string[];
  /** Get proposals from insights/patterns */
  advise: (
    insights: MethodologyInsight[],
    patterns: MethodologyPattern[]
  ) => Promise<void>;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: Error | null;
  /** Clear proposals */
  clear: () => void;
}

export interface UseMethodologySnippetsReturn {
  /** New snippets */
  newSnippets: MethodologySnippet[];
  /** Update suggestions */
  updateSuggestions: Array<{
    snippetId: string;
    reason: string;
    suggestedChange: string;
  }>;
  /** Document patterns */
  document: (
    patterns: MethodologyPattern[],
    existingSnippets?: MethodologySnippet[]
  ) => Promise<void>;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: Error | null;
  /** Clear snippets */
  clear: () => void;
}

/* =========================================================
   MAIN HOOK
   ========================================================= */

/**
 * Main hook for methodology agent operations.
 */
export function useMethodologyAgent(
  context: MethodologyContext
): UseMethodologyAgentReturn {
  const [output, setOutput] = useState<AnyMethodologyAgentOutput | null>(null);
  const [pipelineOutputs, setPipelineOutputs] = useState<{
    observer: MethodologyObserverOutput | null;
    advisor: MethodologyAdvisorOutput | null;
    documenter: MethodologyDocumenterOutput | null;
  }>({
    observer: null,
    advisor: null,
    documenter: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastRole, setLastRole] = useState<MethodologyAgentRole | null>(null);

  const agent = useMemo(() => getMethodologyAgent(), []);

  const executeRole = useCallback(
    async (
      role: MethodologyAgentRole,
      data: {
        replaySummary?: MethodologyReplaySummary;
        insights?: MethodologyInsight[];
        patterns?: MethodologyPattern[];
        existingSnippets?: MethodologySnippet[];
      }
    ) => {
      setIsLoading(true);
      setError(null);
      setLastRole(role);

      try {
        const result = await agent.execute({
          role,
          context,
          replaySummary: data.replaySummary,
          insights: data.insights,
          existingPatterns: data.patterns,
          existingSnippets: data.existingSnippets,
        });

        setOutput(result);

        // Also update pipeline outputs
        if (isObserverOutput(result)) {
          setPipelineOutputs((prev) => ({ ...prev, observer: result }));
        } else if (isAdvisorOutput(result)) {
          setPipelineOutputs((prev) => ({ ...prev, advisor: result }));
        } else if (isDocumenterOutput(result)) {
          setPipelineOutputs((prev) => ({ ...prev, documenter: result }));
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    },
    [agent, context]
  );

  const runPipeline = useCallback(
    async (
      replaySummary: MethodologyReplaySummary,
      existingSnippets?: MethodologySnippet[]
    ) => {
      setIsLoading(true);
      setError(null);
      setLastRole(null);

      try {
        const results = await runFullMethodologyPipeline(
          context,
          replaySummary,
          existingSnippets
        );

        setPipelineOutputs(results);
        setOutput(results.documenter); // Set last output to documenter
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    },
    [context]
  );

  const clear = useCallback(() => {
    setOutput(null);
    setPipelineOutputs({
      observer: null,
      advisor: null,
      documenter: null,
    });
    setError(null);
    setLastRole(null);
  }, []);

  return {
    executeRole,
    runPipeline,
    output,
    pipelineOutputs,
    isLoading,
    error,
    clear,
    lastRole,
  };
}

/* =========================================================
   SPECIALIZED HOOKS
   ========================================================= */

/**
 * Hook for observer role only.
 */
export function useMethodologyInsights(
  context: MethodologyContext
): UseMethodologyInsightsReturn {
  const [insights, setInsights] = useState<MethodologyInsight[]>([]);
  const [patterns, setPatterns] = useState<MethodologyPattern[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const observe = useCallback(
    async (replaySummary: MethodologyReplaySummary) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await runMethodologyObserver(context, replaySummary);
        setInsights(result.observations);
        setPatterns(result.suggestedPatterns);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    },
    [context]
  );

  const clear = useCallback(() => {
    setInsights([]);
    setPatterns([]);
    setError(null);
  }, []);

  return {
    insights,
    patterns,
    observe,
    isLoading,
    error,
    clear,
  };
}

/**
 * Hook for advisor role only.
 */
export function useMethodologyProposals(
  context: MethodologyContext
): UseMethodologyProposalsReturn {
  const [proposals, setProposals] = useState<MethodologyProposal[]>([]);
  const [comparisonNotes, setComparisonNotes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const advise = useCallback(
    async (insights: MethodologyInsight[], patterns: MethodologyPattern[]) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await runMethodologyAdvisor(context, insights, patterns);
        setProposals(result.proposedMethodologies);
        setComparisonNotes(result.comparisonNotes);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    },
    [context]
  );

  const clear = useCallback(() => {
    setProposals([]);
    setComparisonNotes([]);
    setError(null);
  }, []);

  return {
    proposals,
    comparisonNotes,
    advise,
    isLoading,
    error,
    clear,
  };
}

/**
 * Hook for documenter role only.
 */
export function useMethodologySnippets(
  context: MethodologyContext
): UseMethodologySnippetsReturn {
  const [newSnippets, setNewSnippets] = useState<MethodologySnippet[]>([]);
  const [updateSuggestions, setUpdateSuggestions] = useState<
    Array<{
      snippetId: string;
      reason: string;
      suggestedChange: string;
    }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const document = useCallback(
    async (
      patterns: MethodologyPattern[],
      existingSnippets: MethodologySnippet[] = []
    ) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await runMethodologyDocumenter(
          context,
          patterns,
          existingSnippets
        );
        setNewSnippets(result.newSnippets);
        setUpdateSuggestions(result.updateSuggestions);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    },
    [context]
  );

  const clear = useCallback(() => {
    setNewSnippets([]);
    setUpdateSuggestions([]);
    setError(null);
  }, []);

  return {
    newSnippets,
    updateSuggestions,
    document,
    isLoading,
    error,
    clear,
  };
}

/* =========================================================
   UTILITY HOOKS
   ========================================================= */

/**
 * Get methodology role info.
 */
export function useMethodologyRoleInfo(role: MethodologyAgentRole) {
  return useMemo(() => METHODOLOGY_ROLES[role], [role]);
}

/**
 * Create methodology context with defaults.
 */
export function useMethodologyContext(
  sessionId: string,
  sphereId: string,
  options?: Partial<MethodologyContext>
): MethodologyContext {
  return useMemo(
    () => ({
      sessionId,
      sphereId,
      timestamp: Date.now(),
      ...options,
    }),
    [sessionId, sphereId, options]
  );
}
