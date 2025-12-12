// ============================================
// CHE·NU — ETHIC POINT TRIGGER
// ============================================
// RÈGLES ABSOLUES:
// 1. L'Ethic Point ne décide jamais.
// 2. L'Ethic Point ne bloque jamais.
// 3. L'Ethic Point peut toujours être ignoré.
// 4. Silence désactive l'Ethic Point.
// 5. Aucun historique de moralité n'est conservé.
// ============================================

import { EthicPointContext, EthicPointResult, EthicPointLocation } from "./ethicPoint";

/**
 * TRIGGER ETHIC POINT
 *
 * Fonction PURE qui retourne un Ethic Point si applicable.
 *
 * - Aucune logique supplémentaire
 * - Aucune analyse
 * - Aucun effet secondaire
 * - Aucune persistance
 *
 * Retourne null si:
 * - silenceMode est actif
 */
export function triggerEthicPoint(ctx: EthicPointContext): EthicPointResult {
  // Silence désactive tout
  if (ctx.silenceMode) {
    return null;
  }

  return {
    visible: true,
    message: "Responsibility remains human. Assistance is optional.",
    contextSummary: {
      task: ctx.taskId,
      frameDefined: Boolean(ctx.preApprovedContextId),
      moralContext: ctx.moralContextDeclared,
    },
  };
}

/**
 * CREATE ETHIC POINT CONTEXT
 *
 * Helper pour créer un contexte d'Ethic Point.
 * Simplifie la création sans ajouter de logique.
 */
export function createEthicPointContext(params: {
  taskId: string;
  preApprovedContextId?: string;
  moralContextDeclared?: boolean;
  silenceMode?: boolean;
}): EthicPointContext {
  return {
    taskId: params.taskId,
    preApprovedContextId: params.preApprovedContextId,
    moralContextDeclared: params.moralContextDeclared ?? false,
    silenceMode: params.silenceMode ?? false,
    timestamp: Date.now(),
  };
}

/**
 * ETHIC POINT MESSAGES
 *
 * Messages STRICTEMENT autorisés.
 * Langage descriptif, factuel, non-prescriptif.
 */
export const ETHIC_POINT_MESSAGES: Record<EthicPointLocation, string> = {
  task_init: "Cadre actif. Responsabilité humaine.",
  context_change: "Changement de contexte. Réflexion optionnelle.",
  xr_meeting: "Session XR. Cadre actif.",
  replay_export: "Export/Publication. Responsabilité humaine.",
};

/**
 * GET ETHIC POINT MESSAGE
 *
 * Retourne le message approprié pour un emplacement donné.
 */
export function getEthicPointMessage(location: EthicPointLocation): string {
  return ETHIC_POINT_MESSAGES[location];
}

/**
 * IS VALID ETHIC POINT LOCATION
 *
 * Vérifie qu'un emplacement est autorisé.
 * SEULS 4 emplacements sont valides.
 */
export function isValidEthicPointLocation(location: string): location is EthicPointLocation {
  return ["task_init", "context_change", "xr_meeting", "replay_export"].includes(location);
}
