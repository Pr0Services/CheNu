// ============================================
// CHE·NU — AGENT CALL TRACE STORE
// ============================================
// Les agents ne décident jamais.
// Toute délégation est volontaire.
// Toute chaîne passe par l'utilisateur.
// Silence > Agent.
// Replay = lecture seule.
// ============================================

import { AgentCallTrace, AgentInputSource } from "../types/agent";

const KEY = "chenu_agent_traces";
const MAX_TRACES = 50; // Limite pour ne pas surcharger localStorage

/**
 * Charge les traces d'appels agents
 * Stockage LOCAL uniquement — aucune transmission serveur
 */
export function loadAgentTraces(): AgentCallTrace[] {
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

/**
 * Sauvegarde les traces d'appels agents
 */
function saveAgentTraces(traces: AgentCallTrace[]): void {
  // Garder seulement les dernières traces
  const limited = traces.slice(-MAX_TRACES);
  localStorage.setItem(KEY, JSON.stringify(limited));
}

/**
 * Enregistre un appel agent
 * 
 * TOUJOURS appelé par l'utilisateur (calledBy: "user")
 * Jamais d'appel automatique entre agents
 */
export function traceAgentCall(params: {
  agentId: string;
  context: "live" | "replay";
  inputSource: AgentInputSource;
  inputPreview: string;
}): AgentCallTrace {
  const trace: AgentCallTrace = {
    timestamp: Date.now(),
    calledBy: "user", // TOUJOURS "user" — règle CHE·NU
    agentId: params.agentId,
    context: params.context,
    inputSource: params.inputSource,
    inputPreview: params.inputPreview.slice(0, 200), // Max 200 chars
  };

  const traces = loadAgentTraces();
  traces.push(trace);
  saveAgentTraces(traces);

  return trace;
}

/**
 * Récupère les derniers appels pour un agent donné
 */
export function getTracesForAgent(agentId: string, limit = 10): AgentCallTrace[] {
  const traces = loadAgentTraces();
  return traces
    .filter((t) => t.agentId === agentId)
    .slice(-limit);
}

/**
 * Récupère les derniers appels (tous agents)
 */
export function getRecentTraces(limit = 10): AgentCallTrace[] {
  const traces = loadAgentTraces();
  return traces.slice(-limit);
}

/**
 * Efface toutes les traces
 * Action volontaire de l'utilisateur uniquement
 */
export function clearAgentTraces(): void {
  localStorage.removeItem(KEY);
}

/**
 * Formate une trace pour affichage
 */
export function formatTraceForDisplay(trace: AgentCallTrace): string {
  const date = new Date(trace.timestamp);
  const timeStr = date.toLocaleTimeString("fr-CA", {
    hour: "2-digit",
    minute: "2-digit",
  });
  
  const sourceLabel = trace.inputSource === "user" 
    ? "Fourni par l'utilisateur"
    : "Issu de la sortie d'un autre agent";

  return `[${timeStr}] ${trace.agentId} (${trace.context}) — ${sourceLabel}`;
}
