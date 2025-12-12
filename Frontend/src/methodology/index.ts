/* =====================================================
   CHE·NU — METHODOLOGY AGENT MODULE INDEX
   Version: 1.0
   
   📜 CORE PRINCIPLE:
   The Methodology Agent NEVER optimizes humans.
   It ONLY observes flows, compares them to existing methodologies,
   and suggests structured adjustments that a human may adopt or ignore.
   
   📜 THREE ROLES:
   1) Observer — Reads replays, describes patterns
   2) Advisor — Maps patterns to methodologies, explains tradeoffs
   3) Documenter — Creates reusable snippets
   
   📜 FORBIDDEN ACTIONS:
   - Change code
   - Change runtime config
   - Write to timeline
   - Enforce a methodology
   ===================================================== */

// === TYPES & SCHEMAS ===
export {
  // Roles
  type MethodologyAgentRole,
  METHODOLOGY_ROLES,
  
  // Context
  type MethodologyContext,
  type MethodologyReplaySummary,
  
  // Insights
  type MethodologyInsightType,
  type InsightSeverity,
  type MethodologyInsight,
  INSIGHT_TYPE_LABELS,
  
  // Patterns
  type MethodologyPattern,
  
  // Proposals
  type TradeoffLevel,
  type MethodologyTradeoffs,
  type MethodologyProposal,
  
  // Snippets
  type MethodologySnippet,
  type SnippetUpdateSuggestion,
  
  // I/O Types
  type MethodologyAgentInput,
  type MethodologyAgentOutputBase,
  type MethodologyObserverOutput,
  type MethodologyAdvisorOutput,
  type MethodologyDocumenterOutput,
  type AnyMethodologyAgentOutput,
  
  // Type Guards
  isObserverOutput,
  isAdvisorOutput,
  isDocumenterOutput,
  
  // Constants
  INSIGHT_THRESHOLDS,
  METHODOLOGY_AGENT_VERSION,
} from './methodology.types';

// === ENGINE ===
export {
  MethodologyAgentEngine,
  getMethodologyAgent,
  runMethodologyObserver,
  runMethodologyAdvisor,
  runMethodologyDocumenter,
  runFullMethodologyPipeline,
} from './methodology.engine';

// === REACT HOOKS ===
export {
  // Main hook
  useMethodologyAgent,
  type UseMethodologyAgentReturn,
  
  // Specialized hooks
  useMethodologyInsights,
  type UseMethodologyInsightsReturn,
  
  useMethodologyProposals,
  type UseMethodologyProposalsReturn,
  
  useMethodologySnippets,
  type UseMethodologySnippetsReturn,
  
  // Utility hooks
  useMethodologyRoleInfo,
  useMethodologyContext,
} from './useMethodology';
