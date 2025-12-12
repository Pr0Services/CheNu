/* =========================================================
   CHE·NU — Process Analysis (Adaptation Layer)
   
   📜 IMPORTANT:
   This analysis layer NEVER:
   - Makes decisions
   - Applies changes automatically
   - Optimizes humans
   - Writes to the timeline
   
   It only OBSERVES patterns and REPORTS them to the human.
   ========================================================= */

import type { FlowStage, AgentType } from './runtimeGuards';

/* -------------------------
   TYPES
------------------------- */

export interface ProcessObservation {
  timestamp: string;
  stage: FlowStage | string;
  note: string;
  severity?: 'info' | 'warning' | 'concern';
}

export interface ProcessAnalysisReport {
  summary: string;
  observations: ProcessObservation[];
  uncertainty: string[];
  suggestions?: string[]; // Always optional - human decides
  requiresHumanValidation: true; // ALWAYS true
}

export interface SessionAction {
  type: string;
  timestamp: number;
  agentType?: AgentType;
  stage?: FlowStage;
  metadata?: Record<string, unknown>;
}

/* -------------------------
   PATTERN DETECTORS
------------------------- */

interface PatternDetector {
  name: string;
  detect: (actions: SessionAction[]) => ProcessObservation | null;
}

const PATTERN_DETECTORS: PatternDetector[] = [
  {
    name: 'multiple_rollbacks',
    detect: (actions) => {
      const rollbacks = actions.filter((a) => a.type === 'rollback');
      if (rollbacks.length > 3) {
        return {
          timestamp: new Date().toISOString(),
          stage: 'navigation',
          note: `Multiple rollbacks detected (${rollbacks.length}) — user may be exploring or uncertain.`,
          severity: 'info',
        };
      }
      return null;
    },
  },
  {
    name: 'decision_attempt_blocked',
    detect: (actions) => {
      if (actions.some((a) => a.type === 'decision_attempt_failed')) {
        return {
          timestamp: new Date().toISOString(),
          stage: 'decision_clarification',
          note: 'A decision was attempted but blocked by chain rules.',
          severity: 'warning',
        };
      }
      return null;
    },
  },
  {
    name: 'rapid_sphere_switching',
    detect: (actions) => {
      const sphereSwitches = actions.filter((a) => a.type === 'sphere_switch');
      const recent = sphereSwitches.filter(
        (a) => Date.now() - a.timestamp < 60000 // Last minute
      );
      if (recent.length > 5) {
        return {
          timestamp: new Date().toISOString(),
          stage: 'navigation',
          note: 'Rapid sphere switching detected — user may be searching for something.',
          severity: 'info',
        };
      }
      return null;
    },
  },
  {
    name: 'long_session_no_decisions',
    detect: (actions) => {
      const sessionDuration = actions.length > 0
        ? Date.now() - actions[0].timestamp
        : 0;
      const hasDecisions = actions.some((a) => a.type === 'decision_validated');
      
      if (sessionDuration > 30 * 60 * 1000 && !hasDecisions) { // 30 minutes
        return {
          timestamp: new Date().toISOString(),
          stage: 'parallel_analysis',
          note: 'Long session without decisions — user may be in exploration mode.',
          severity: 'info',
        };
      }
      return null;
    },
  },
  {
    name: 'navigation_loops',
    detect: (actions) => {
      const navActions = actions.filter((a) => a.type === 'navigate');
      const pathHistory: string[] = [];
      let loops = 0;

      for (const action of navActions) {
        const path = action.metadata?.path as string;
        if (path && pathHistory.includes(path)) {
          loops++;
        }
        if (path) pathHistory.push(path);
      }

      if (loops > 3) {
        return {
          timestamp: new Date().toISOString(),
          stage: 'navigation',
          note: `Navigation loops detected (${loops}) — user may benefit from clarity.`,
          severity: 'concern',
        };
      }
      return null;
    },
  },
  {
    name: 'agent_isolation_breach_attempt',
    detect: (actions) => {
      if (actions.some((a) => a.type === 'isolation_breach_blocked')) {
        return {
          timestamp: new Date().toISOString(),
          stage: 'parallel_analysis',
          note: 'Agent attempted to access another agent output — blocked by guards.',
          severity: 'warning',
        };
      }
      return null;
    },
  },
];

/* -------------------------
   MAIN ANALYSIS FUNCTION
------------------------- */

/**
 * Analyze process flow and return observations.
 * 
 * ⚠️ This function NEVER:
 * - Makes decisions
 * - Applies changes
 * - Optimizes humans
 * - Writes to timeline
 * 
 * It only OBSERVES and REPORTS.
 */
export function analyzeProcessFlow(
  sessionActions: SessionAction[] | string[]
): ProcessAnalysisReport {
  // Normalize input
  const normalizedActions: SessionAction[] = sessionActions.map((a) =>
    typeof a === 'string'
      ? { type: a, timestamp: Date.now() }
      : a
  );

  // Run all pattern detectors
  const observations: ProcessObservation[] = [];

  for (const detector of PATTERN_DETECTORS) {
    const observation = detector.detect(normalizedActions);
    if (observation) {
      observations.push(observation);
    }
  }

  // Build report
  return {
    summary:
      'Process analysis completed. No conclusions drawn, only observations.',
    observations,
    uncertainty: [
      'User intent clarity cannot be inferred automatically.',
      'Patterns may reflect exploration, not confusion.',
      'Only the human can interpret these observations correctly.',
    ],
    suggestions:
      observations.length > 0
        ? [
            'Consider offering clarification if the user seems uncertain.',
            'Switching to exploration preset may help if the user is searching.',
          ]
        : undefined,
    requiresHumanValidation: true,
  };
}

/* -------------------------
   SPECIFIC ANALYZERS
------------------------- */

/**
 * Analyze navigation patterns only.
 */
export function analyzeNavigationPatterns(
  actions: SessionAction[]
): {
  loops: number;
  uniquePaths: number;
  mostVisited: string | null;
  suggestion?: string;
} {
  const navActions = actions.filter((a) => a.type === 'navigate');
  const pathCounts = new Map<string, number>();

  for (const action of navActions) {
    const path = action.metadata?.path as string;
    if (path) {
      pathCounts.set(path, (pathCounts.get(path) || 0) + 1);
    }
  }

  const loops = Array.from(pathCounts.values()).filter((c) => c > 1).length;
  const uniquePaths = pathCounts.size;
  const mostVisited = pathCounts.size > 0
    ? Array.from(pathCounts.entries()).sort((a, b) => b[1] - a[1])[0][0]
    : null;

  return {
    loops,
    uniquePaths,
    mostVisited,
    suggestion:
      loops > 3
        ? 'User may be searching — consider offering navigation assistance.'
        : undefined,
  };
}

/**
 * Analyze decision flow patterns.
 */
export function analyzeDecisionFlow(
  actions: SessionAction[]
): {
  decisionsAttempted: number;
  decisionsValidated: number;
  decisionsRejected: number;
  blockedByGuards: number;
  flowHealth: 'healthy' | 'blocked' | 'uncertain';
} {
  const decisionsAttempted = actions.filter((a) =>
    a.type.includes('decision_attempt')
  ).length;
  const decisionsValidated = actions.filter(
    (a) => a.type === 'decision_validated'
  ).length;
  const decisionsRejected = actions.filter(
    (a) => a.type === 'decision_rejected'
  ).length;
  const blockedByGuards = actions.filter(
    (a) => a.type === 'decision_attempt_failed'
  ).length;

  let flowHealth: 'healthy' | 'blocked' | 'uncertain' = 'healthy';

  if (blockedByGuards > 0) {
    flowHealth = 'blocked';
  } else if (decisionsAttempted > 0 && decisionsValidated === 0) {
    flowHealth = 'uncertain';
  }

  return {
    decisionsAttempted,
    decisionsValidated,
    decisionsRejected,
    blockedByGuards,
    flowHealth,
  };
}

/**
 * Analyze agent activity.
 */
export function analyzeAgentActivity(
  actions: SessionAction[]
): {
  agentInvocations: Map<AgentType, number>;
  mostActiveAgent: AgentType | null;
  isolationBreaches: number;
  parallelWorkHealthy: boolean;
} {
  const agentInvocations = new Map<AgentType, number>();
  let isolationBreaches = 0;

  for (const action of actions) {
    if (action.agentType) {
      agentInvocations.set(
        action.agentType,
        (agentInvocations.get(action.agentType) || 0) + 1
      );
    }
    if (action.type === 'isolation_breach_blocked') {
      isolationBreaches++;
    }
  }

  const mostActiveAgent =
    agentInvocations.size > 0
      ? Array.from(agentInvocations.entries()).sort((a, b) => b[1] - a[1])[0][0]
      : null;

  return {
    agentInvocations,
    mostActiveAgent,
    isolationBreaches,
    parallelWorkHealthy: isolationBreaches === 0,
  };
}

/* -------------------------
   SESSION SUMMARY
------------------------- */

/**
 * Generate a complete session summary.
 * 
 * ⚠️ This is OBSERVATIONAL only — no decisions or optimizations.
 */
export function generateSessionSummary(
  actions: SessionAction[]
): {
  report: ProcessAnalysisReport;
  navigation: ReturnType<typeof analyzeNavigationPatterns>;
  decisions: ReturnType<typeof analyzeDecisionFlow>;
  agents: ReturnType<typeof analyzeAgentActivity>;
  requiresHumanValidation: true;
} {
  return {
    report: analyzeProcessFlow(actions),
    navigation: analyzeNavigationPatterns(actions),
    decisions: analyzeDecisionFlow(actions),
    agents: analyzeAgentActivity(actions),
    requiresHumanValidation: true,
  };
}

/* =========================================================
   EXPORTS
   ========================================================= */

export { PATTERN_DETECTORS };
