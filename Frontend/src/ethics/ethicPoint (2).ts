// ============================================
// CHE·NU — ETHIC POINT STATE
// ============================================
// L'Ethic Point est:
// - non décisionnel
// - non bloquant
// - non persuasif
// - non moraliste
//
// Il est un REPÈRE ARCHITECTURAL, pas une logique de contrôle.
// ============================================

/**
 * ETHIC POINT CONTEXT
 *
 * Structure minimale décrivant le contexte
 * au moment où un Ethic Point est rencontré.
 *
 * Aucune analyse.
 * Aucun historique.
 * Aucun scoring.
 */
export type EthicPointContext = {
  taskId: string;
  preApprovedContextId?: string;
  moralContextDeclared: boolean;
  silenceMode: boolean;
  timestamp: number;
};

/**
 * ETHIC POINT LOCATION
 *
 * Les 4 SEULS emplacements autorisés pour un Ethic Point:
 * 1. Création d'une tâche (Task Init)
 * 2. Changement de contexte / sphère
 * 3. Utilisation XR / Meeting
 * 4. Replay / Export / Publication
 *
 * AUCUN autre point n'est autorisé.
 */
export type EthicPointLocation =
  | "task_init"
  | "context_change"
  | "xr_meeting"
  | "replay_export";

/**
 * ETHIC POINT RESULT
 *
 * Résultat d'un trigger d'Ethic Point.
 * Peut être null si silence mode est actif.
 */
export type EthicPointResult = {
  visible: true;
  message: string;
  contextSummary: {
    task: string;
    frameDefined: boolean;
    moralContext: boolean;
  };
} | null;

/**
 * ETHIC POINT CONFIG
 *
 * Configuration pour l'affichage de l'Ethic Point.
 * Tout est optionnel et non-bloquant.
 */
export type EthicPointConfig = {
  autoHideMs?: number;      // Disparition automatique (défaut: 5000ms)
  position?: "top" | "bottom" | "inline";
  minimal?: boolean;        // Icône seule sans texte
};
