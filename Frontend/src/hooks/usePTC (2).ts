import { useState, useCallback, useEffect } from "react";
import {
  PreApprovedTaskContext,
  ActiveTask,
  DirectiveCheckResult,
  AgentRole,
  ForbiddenCapability,
} from "../types/preApprovedTask";
import {
  loadAllPTCs,
  loadPTC,
  createPTC,
  deletePTC,
  loadActiveTask,
  createActiveTask,
  clearActiveTask,
  saveCheckResult,
  getLastCheckResult,
} from "../state/ptcStore";
import {
  checkDirectiveCompliance,
  checkAgentIntentAlignment,
  summarizePTC,
  formatCheckResult,
} from "../agents/directiveGuardAgent";

export function usePTC() {
  const [contexts, setContexts] = useState<PreApprovedTaskContext[]>([]);
  const [activeTask, setActiveTask] = useState<ActiveTask | null>(null);
  const [activePTC, setActivePTC] = useState<PreApprovedTaskContext | null>(null);
  const [lastCheck, setLastCheck] = useState<DirectiveCheckResult | null>(null);

  // Charger les données initiales
  const refresh = useCallback(() => {
    setContexts(loadAllPTCs());
    const task = loadActiveTask();
    setActiveTask(task);
    if (task) {
      setActivePTC(loadPTC(task.contextId));
      setLastCheck(getLastCheckResult(task.id));
    } else {
      setActivePTC(null);
      setLastCheck(null);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Créer un nouveau PTC
  const create = useCallback(
    (partial: Omit<PreApprovedTaskContext, "id" | "createdAt" | "createdBy">) => {
      const ptc = createPTC(partial);
      refresh();
      return ptc;
    },
    [refresh]
  );

  // Supprimer un PTC
  const remove = useCallback(
    (id: string) => {
      deletePTC(id);
      refresh();
    },
    [refresh]
  );

  // Démarrer une tâche avec un PTC
  const startTask = useCallback(
    (contextId: string, sphereId?: string) => {
      const task = createActiveTask(contextId, sphereId);
      refresh();
      return task;
    },
    [refresh]
  );

  // Terminer la tâche active
  const endTask = useCallback(() => {
    clearActiveTask();
    refresh();
  }, [refresh]);

  // Vérifier une action (appelé APRÈS l'action)
  const checkAction = useCallback(
    (action: {
      type: "agent_call" | "xr_action" | "data_access";
      agentRole?: AgentRole;
      capability?: ForbiddenCapability;
      xrMode?: "live" | "replay" | "comparison" | "narrative";
      dataType?: "personal" | "cross-sphere" | "standard";
      sphereId?: string;
      targetSphereId?: string;
    }): DirectiveCheckResult | null => {
      if (!activePTC || !activeTask) {
        return null;
      }

      const result = checkDirectiveCompliance(activePTC, action);
      saveCheckResult(activeTask.id, result);
      setLastCheck(result);
      return result;
    },
    [activePTC, activeTask]
  );

  // Vérifier l'alignement d'un agent (informatif)
  const checkAgentAlignment = useCallback(
    (agentRole: AgentRole, capabilities: ForbiddenCapability[]): DirectiveCheckResult | null => {
      if (!activePTC) {
        return null;
      }
      return checkAgentIntentAlignment(activePTC, agentRole, capabilities);
    },
    [activePTC]
  );

  // Obtenir le résumé du PTC actif
  const getActiveSummary = useCallback((): string | null => {
    if (!activePTC) return null;
    return summarizePTC(activePTC);
  }, [activePTC]);

  // Obtenir le statut formaté du dernier check
  const getCheckStatus = useCallback(() => {
    if (!lastCheck) return null;
    return formatCheckResult(lastCheck);
  }, [lastCheck]);

  // Vérifier si une tâche est active
  const hasActiveTask = activeTask !== null;

  // Vérifier si le contexte autorise XR
  const isXRAllowed = activePTC?.xrConstraints.allowed ?? true;
  const xrMode = activePTC?.xrConstraints.mode ?? "read-only";

  return {
    // Données
    contexts,
    activeTask,
    activePTC,
    lastCheck,

    // États dérivés
    hasActiveTask,
    isXRAllowed,
    xrMode,

    // Actions
    create,
    remove,
    startTask,
    endTask,
    checkAction,
    checkAgentAlignment,
    refresh,

    // Helpers
    getActiveSummary,
    getCheckStatus,
  };
}
