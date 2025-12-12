import {
  PreApprovedTaskContext,
  ActiveTask,
  DirectiveCheckResult,
  DirectiveCheckHistory,
} from "../types/preApprovedTask";

const PTC_KEY = "chenu_ptc_contexts";
const ACTIVE_TASK_KEY = "chenu_active_task";
const CHECK_HISTORY_KEY = "chenu_directive_checks";

// === PRE-APPROVED TASK CONTEXTS ===

export function loadAllPTCs(): PreApprovedTaskContext[] {
  const raw = localStorage.getItem(PTC_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function loadPTC(id: string): PreApprovedTaskContext | null {
  const all = loadAllPTCs();
  return all.find((ptc) => ptc.id === id) || null;
}

export function savePTC(ptc: PreApprovedTaskContext): void {
  const all = loadAllPTCs();
  const index = all.findIndex((p) => p.id === ptc.id);
  if (index >= 0) {
    all[index] = ptc;
  } else {
    all.push(ptc);
  }
  localStorage.setItem(PTC_KEY, JSON.stringify(all));
}

export function deletePTC(id: string): void {
  const all = loadAllPTCs();
  const filtered = all.filter((ptc) => ptc.id !== id);
  localStorage.setItem(PTC_KEY, JSON.stringify(filtered));
}

export function createPTC(
  partial: Omit<PreApprovedTaskContext, "id" | "createdAt" | "createdBy">
): PreApprovedTaskContext {
  const ptc: PreApprovedTaskContext = {
    id: `ptc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: Date.now(),
    createdBy: "user",
    ...partial,
  };
  savePTC(ptc);
  return ptc;
}

// === ACTIVE TASK ===

export function loadActiveTask(): ActiveTask | null {
  const raw = localStorage.getItem(ACTIVE_TASK_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function saveActiveTask(task: ActiveTask): void {
  localStorage.setItem(ACTIVE_TASK_KEY, JSON.stringify(task));
}

export function clearActiveTask(): void {
  localStorage.removeItem(ACTIVE_TASK_KEY);
}

export function createActiveTask(contextId: string, sphereId?: string): ActiveTask {
  const task: ActiveTask = {
    id: `task-${Date.now()}`,
    contextId,
    startedAt: Date.now(),
    sphereId,
  };
  saveActiveTask(task);
  return task;
}

// === DIRECTIVE CHECK HISTORY ===

export function loadCheckHistory(taskId: string): DirectiveCheckHistory {
  const raw = localStorage.getItem(`${CHECK_HISTORY_KEY}_${taskId}`);
  return raw ? JSON.parse(raw) : { taskId, checks: [] };
}

export function saveCheckResult(taskId: string, result: DirectiveCheckResult): void {
  const history = loadCheckHistory(taskId);
  history.checks.push(result);
  // Garder seulement les 20 dernières vérifications
  if (history.checks.length > 20) {
    history.checks = history.checks.slice(-20);
  }
  localStorage.setItem(`${CHECK_HISTORY_KEY}_${taskId}`, JSON.stringify(history));
}

export function getLastCheckResult(taskId: string): DirectiveCheckResult | null {
  const history = loadCheckHistory(taskId);
  return history.checks.length > 0 ? history.checks[history.checks.length - 1] : null;
}

export function clearCheckHistory(taskId: string): void {
  localStorage.removeItem(`${CHECK_HISTORY_KEY}_${taskId}`);
}
