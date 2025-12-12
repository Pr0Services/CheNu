// ============================================
// CHE·NU — WORKFLOW TYPES
// ============================================
// Un Ethics Checkpoint n'est déclenché
// QUE lorsque la responsabilité change d'échelle.
//
// Les workflows légers ne déclenchent RIEN.
// ============================================

/**
 * WORKFLOW LOAD LEVEL
 *
 * Déclaratif uniquement. Pas d'inférence implicite.
 *
 * - light: Exécution silencieuse, pas de checkpoint
 * - heavy: Éligible au checkpoint éthique
 */
export type WorkflowLoadLevel = "light" | "heavy";

/**
 * WORKFLOW CONTEXT
 *
 * Contexte déclaratif d'un workflow.
 * Aucune inférence implicite autorisée.
 */
export type WorkflowContext = {
  workflowId: string;
  loadLevel: WorkflowLoadLevel;
  agentCount: number;
  crossesSpheres: boolean;
  producesPersistentOutput: boolean;
  xrInvolved: boolean;
};

/**
 * WORKFLOW STATUS
 *
 * État d'exécution d'un workflow.
 */
export type WorkflowStatus =
  | "pending"
  | "running"
  | "completed"
  | "cancelled";

/**
 * WORKFLOW DEFINITION
 *
 * Définition complète d'un workflow avec ses agents.
 */
export type WorkflowDefinition = {
  id: string;
  name: string;
  description?: string;
  agents: string[]; // Agent IDs
  loadLevel: WorkflowLoadLevel;
  crossesSpheres: boolean;
  producesPersistentOutput: boolean;
  xrInvolved: boolean;
};

/**
 * WORKFLOW EXECUTION
 *
 * Instance d'exécution d'un workflow.
 */
export type WorkflowExecution = {
  executionId: string;
  workflowId: string;
  context: WorkflowContext;
  status: WorkflowStatus;
  startedAt: number;
  completedAt?: number;
  checkpointShown: boolean; // Une seule fois par workflow
};

/**
 * CREATE WORKFLOW CONTEXT
 *
 * Helper pour créer un contexte de workflow.
 * Le loadLevel DOIT être déclaré explicitement.
 */
export function createWorkflowContext(params: {
  workflowId: string;
  loadLevel: WorkflowLoadLevel;
  agentCount: number;
  crossesSpheres?: boolean;
  producesPersistentOutput?: boolean;
  xrInvolved?: boolean;
}): WorkflowContext {
  return {
    workflowId: params.workflowId,
    loadLevel: params.loadLevel,
    agentCount: params.agentCount,
    crossesSpheres: params.crossesSpheres ?? false,
    producesPersistentOutput: params.producesPersistentOutput ?? false,
    xrInvolved: params.xrInvolved ?? false,
  };
}
