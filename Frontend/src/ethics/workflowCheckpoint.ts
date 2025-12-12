// ============================================
// CHE·NU — WORKFLOW CHECKPOINT
// ============================================
// L'Ethics Checkpoint lors d'un workflow multi-agents
// peut être déclenché UNIQUEMENT SI:
//
// - loadLevel === "heavy"
// ET
// - agentCount > 1
// OU
// - crossesSpheres === true
// OU
// - producesPersistentOutput === true
// OU
// - xrInvolved === true
//
// Si aucune condition n'est remplie → SILENCE TOTAL.
// ============================================

import { WorkflowContext } from "../types/workflow";

/**
 * WORKFLOW CHECKPOINT RESULT
 *
 * Résultat du trigger de checkpoint.
 * Peut être null si pas de checkpoint requis.
 */
export type WorkflowCheckpointResult = {
  show: true;
  message: string;
  subtext: string;
} | null;

/**
 * WORKFLOW CHECKPOINT MESSAGES
 *
 * Contenu STRICTEMENT autorisé.
 * Aucune autre information.
 */
const CHECKPOINT_MESSAGE = "Workflow multi-agents actif · Responsabilité humaine maintenue";
const CHECKPOINT_SUBTEXT = "Plusieurs agents coopèrent dans un cadre défini par vous.";

/**
 * SHOULD SHOW WORKFLOW CHECKPOINT
 *
 * Détermine si un checkpoint doit être affiché.
 *
 * CONDITIONS:
 * - loadLevel === "heavy"
 * ET AU MOINS UNE DE:
 * - agentCount > 1
 * - crossesSpheres === true
 * - producesPersistentOutput === true
 * - xrInvolved === true
 *
 * Aucune inférence implicite.
 * Aucun calcul de complexité caché.
 */
export function shouldShowWorkflowCheckpoint(
  ctx: WorkflowContext,
  silenceMode: boolean
): boolean {
  // Silence mode désactive tout
  if (silenceMode) {
    return false;
  }

  // Workflows légers ne déclenchent JAMAIS de checkpoint
  if (ctx.loadLevel === "light") {
    return false;
  }

  // loadLevel === "heavy" requis, puis au moins une condition
  const hasMultipleAgents = ctx.agentCount > 1;
  const hasCrossSpheres = ctx.crossesSpheres;
  const hasPersistentOutput = ctx.producesPersistentOutput;
  const hasXR = ctx.xrInvolved;

  return hasMultipleAgents || hasCrossSpheres || hasPersistentOutput || hasXR;
}

/**
 * TRIGGER WORKFLOW CHECKPOINT
 *
 * Déclenche un checkpoint si les conditions sont remplies.
 *
 * Le checkpoint apparaît:
 * - au MOMENT de l'exécution du workflow
 * - UNE SEULE FOIS par workflow
 * - jamais par agent individuel
 *
 * Pas de répétition. Pas d'empilement.
 */
export function triggerWorkflowCheckpoint(
  ctx: WorkflowContext,
  silenceMode: boolean
): WorkflowCheckpointResult {
  if (!shouldShowWorkflowCheckpoint(ctx, silenceMode)) {
    return null;
  }

  return {
    show: true,
    message: CHECKPOINT_MESSAGE,
    subtext: CHECKPOINT_SUBTEXT,
  };
}

/**
 * GET CHECKPOINT REASON (DEBUG ONLY)
 *
 * Retourne la raison du checkpoint pour debug.
 * N'est JAMAIS affiché à l'utilisateur.
 */
export function getCheckpointReason(ctx: WorkflowContext): string[] {
  const reasons: string[] = [];

  if (ctx.agentCount > 1) {
    reasons.push(`multi-agent (${ctx.agentCount})`);
  }
  if (ctx.crossesSpheres) {
    reasons.push("cross-spheres");
  }
  if (ctx.producesPersistentOutput) {
    reasons.push("persistent-output");
  }
  if (ctx.xrInvolved) {
    reasons.push("xr-involved");
  }

  return reasons;
}
