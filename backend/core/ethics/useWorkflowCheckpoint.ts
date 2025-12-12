// ============================================
// CHE·NU — USE WORKFLOW CHECKPOINT HOOK
// ============================================
// Hook pour gérer les checkpoints de workflow.
//
// RÈGLES STRICTES:
// 1. Les workflows légers ne déclenchent jamais de checkpoint.
// 2. Aucun calcul de complexité caché.
// 3. Aucun message d'avertissement.
// 4. Aucun jugement sur le choix du workflow.
// 5. Silence mode désactive tout checkpoint.
// ============================================

import { useState, useCallback, useMemo, useRef } from "react";
import { useSilence } from "./useSilence";
import {
  WorkflowContext,
  WorkflowExecution,
  createWorkflowContext,
  WorkflowLoadLevel,
} from "../types/workflow";
import {
  WorkflowCheckpointResult,
  triggerWorkflowCheckpoint,
  shouldShowWorkflowCheckpoint,
} from "../ethics/workflowCheckpoint";

type UseWorkflowCheckpointOptions = {
  workflowId: string;
  loadLevel: WorkflowLoadLevel;
  agentCount: number;
  crossesSpheres?: boolean;
  producesPersistentOutput?: boolean;
  xrInvolved?: boolean;
};

/**
 * USE WORKFLOW CHECKPOINT
 *
 * Hook pour gérer le checkpoint d'un workflow.
 *
 * Le checkpoint apparaît:
 * - au MOMENT de l'exécution du workflow
 * - UNE SEULE FOIS par workflow
 * - jamais par agent individuel
 */
export function useWorkflowCheckpoint(options: UseWorkflowCheckpointOptions) {
  const { silence } = useSilence();
  const [checkpointShown, setCheckpointShown] = useState(false);
  const executionRef = useRef<WorkflowExecution | null>(null);

  // Créer le contexte
  const context: WorkflowContext = useMemo(
    () =>
      createWorkflowContext({
        workflowId: options.workflowId,
        loadLevel: options.loadLevel,
        agentCount: options.agentCount,
        crossesSpheres: options.crossesSpheres,
        producesPersistentOutput: options.producesPersistentOutput,
        xrInvolved: options.xrInvolved,
      }),
    [
      options.workflowId,
      options.loadLevel,
      options.agentCount,
      options.crossesSpheres,
      options.producesPersistentOutput,
      options.xrInvolved,
    ]
  );

  // Déterminer si le checkpoint doit être affiché
  const shouldShow = useMemo(
    () => shouldShowWorkflowCheckpoint(context, silence.enabled),
    [context, silence.enabled]
  );

  // Résultat du checkpoint (null si déjà affiché ou pas requis)
  const result: WorkflowCheckpointResult = useMemo(() => {
    if (checkpointShown) {
      return null; // UNE SEULE FOIS par workflow
    }
    return triggerWorkflowCheckpoint(context, silence.enabled);
  }, [context, silence.enabled, checkpointShown]);

  // Marquer le checkpoint comme affiché
  const markCheckpointShown = useCallback(() => {
    setCheckpointShown(true);
  }, []);

  // Démarrer l'exécution du workflow
  const startExecution = useCallback(() => {
    const execution: WorkflowExecution = {
      executionId: `exec-${Date.now()}`,
      workflowId: options.workflowId,
      context,
      status: "running",
      startedAt: Date.now(),
      checkpointShown: false,
    };
    executionRef.current = execution;

    // Marquer le checkpoint comme affiché si applicable
    if (shouldShow && !checkpointShown) {
      setCheckpointShown(true);
      execution.checkpointShown = true;
    }

    return execution;
  }, [options.workflowId, context, shouldShow, checkpointShown]);

  // Reset pour un nouveau workflow
  const reset = useCallback(() => {
    setCheckpointShown(false);
    executionRef.current = null;
  }, []);

  return {
    context,
    result,
    shouldShow,
    checkpointShown,
    markCheckpointShown,
    startExecution,
    reset,
    silenceActive: silence.enabled,
    isHeavyWorkflow: context.loadLevel === "heavy",
  };
}

/**
 * USE WORKFLOW CHECKPOINT ONCE
 *
 * Version simplifiée qui déclenche automatiquement le checkpoint
 * UNE SEULE FOIS au montage du composant.
 */
export function useWorkflowCheckpointOnce(
  options: UseWorkflowCheckpointOptions
) {
  const checkpoint = useWorkflowCheckpoint(options);

  // Le résultat est automatiquement null après le premier affichage
  return {
    result: checkpoint.result,
    isHeavyWorkflow: checkpoint.isHeavyWorkflow,
    silenceActive: checkpoint.silenceActive,
  };
}
