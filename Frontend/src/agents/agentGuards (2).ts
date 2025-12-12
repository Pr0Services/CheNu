// ============================================
// CHE·NU — AGENT GUARDS
// ============================================
// Les agents ne décident jamais.
// Toute délégation est volontaire.
// Toute chaîne passe par l'utilisateur.
// Silence > Agent.
// Replay = lecture seule.
// ============================================

import { loadSilence } from "../state/silenceStore";
import { getAgentById } from "./AgentRegistry";

/**
 * ERREURS DE GARDE AGENT
 */
export class AgentBlockedError extends Error {
  constructor(reason: string) {
    super(`Agent call blocked: ${reason}`);
    this.name = "AgentBlockedError";
  }
}

/**
 * Vérifie qu'un agent peut être appelé
 * Lance une erreur si l'appel est interdit
 * 
 * RÈGLES:
 * 1. Silence > Agent (toujours bloqué)
 * 2. Replay = lecture seule autorisée
 * 3. Live = autorisé si agent le permet
 */
export function assertAgentCallable(
  agentId: string,
  context: "live" | "replay"
): void {
  // Silence > Agent — PRIORITÉ ABSOLUE
  const silence = loadSilence();
  if (silence.enabled) {
    throw new AgentBlockedError("Mode Silence actif. Aucun agent disponible.");
  }

  // Vérifier que l'agent existe
  const agent = getAgentById(agentId);
  if (!agent) {
    throw new AgentBlockedError(`Agent inconnu: ${agentId}`);
  }

  // Vérifier le contexte
  if (!agent.allowedContexts[context]) {
    throw new AgentBlockedError(
      `Agent "${agent.name}" non autorisé en mode ${context}.`
    );
  }
}

/**
 * Vérifie qu'un agent peut être appelé (version safe)
 * Retourne un objet avec le statut au lieu de lancer une erreur
 */
export function canCallAgent(
  agentId: string,
  context: "live" | "replay"
): { allowed: boolean; reason?: string } {
  const silence = loadSilence();
  
  // Silence > Agent
  if (silence.enabled) {
    return {
      allowed: false,
      reason: "Mode Silence actif. Aucun agent disponible.",
    };
  }

  const agent = getAgentById(agentId);
  if (!agent) {
    return {
      allowed: false,
      reason: `Agent inconnu: ${agentId}`,
    };
  }

  if (!agent.allowedContexts[context]) {
    return {
      allowed: false,
      reason: `Agent "${agent.name}" non autorisé en mode ${context}.`,
    };
  }

  return { allowed: true };
}

/**
 * Vérifie que l'input provient bien de l'utilisateur
 * ou d'une sortie agent précédente EXPLICITEMENT choisie
 * 
 * Cette fonction est un garde-fou conceptuel.
 * Elle ne bloque pas mais TRACE l'origine.
 */
export function validateInputSource(
  source: "user" | "agent-output",
  agentId: string
): void {
  // Les agents ne décident jamais.
  // Toute chaîne passe par l'utilisateur.
  // Cette validation est un rappel architectural.
  
  if (source === "agent-output") {
    // L'utilisateur a CHOISI d'utiliser la sortie d'un agent
    // C'est autorisé, mais doit être tracé et visible
    console.info(
      `[CHE·NU Guard] Agent ${agentId} appelé avec sortie d'agent précédente. ` +
      `Choix explicite de l'utilisateur requis.`
    );
  }
}

/**
 * Vérifie qu'aucun enchaînement automatique n'est en cours
 * 
 * FLUX AUTORISÉ:
 *   Utilisateur → Agent → Utilisateur → Agent
 * 
 * FLUX INTERDIT:
 *   Agent → Agent (automatique)
 */
export function assertNoAutoChain(calledBy: string): void {
  // Toute délégation est volontaire.
  if (calledBy !== "user") {
    throw new AgentBlockedError(
      "Enchaînement automatique interdit. Seul l'utilisateur peut appeler un agent."
    );
  }
}
