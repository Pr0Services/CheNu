// ============================================
// CHE·NU — ETHICS MODULE
// ============================================
// Le système ne juge jamais l'intention.
// Le système ne classifie jamais une action comme bonne ou mauvaise.
// Le système ne recommande jamais une correction morale.
// Toute réflexion est volontaire.
// Silence désactive toute réflexion.
// ============================================

/**
 * MODULE ÉTHIQUE CHE·NU
 *
 * Ce module formalise la CO-RESPONSABILITÉ dans CHE·NU.
 * Il introduit un cadre moral explicite:
 * - Sans jugement
 * - Sans autorité
 * - Sans décision automatisée
 *
 * PRINCIPE FONDAMENTAL:
 * CHE·NU ne gouverne pas la moralité.
 * CHE·NU éclaire la relation entre:
 * - intention
 * - action
 * - conséquence
 *
 * La responsabilité reste toujours humaine.
 * Le système est co-responsable de la CLARTÉ, jamais du CHOIX.
 *
 * INTERDICTIONS STRICTES:
 * - Score moral
 * - Profilage éthique
 * - Historique moral utilisateur
 * - Apprentissage de valeurs utilisateur
 * - Inférence d'intention cachée
 *
 * ETHIC POINT:
 * L'Ethic Point est un MOMENT STRUCTUREL où le système rend explicite:
 * - le cadre actif (PTC + Moral Context)
 * - la responsabilité humaine
 * - la possibilité de réfléchir ou d'ignorer
 *
 * Il ne modifie aucun flux. Il n'ajoute aucune friction obligatoire.
 *
 * EMPLACEMENTS AUTORISÉS (4 uniquement):
 * 1. Création d'une tâche (task_init)
 * 2. Changement de contexte / sphère (context_change)
 * 3. Utilisation XR / Meeting (xr_meeting)
 * 4. Replay / Export / Publication (replay_export)
 */

// Consequence Observer
export * from "./consequenceObserver";

// Ethic Point
export * from "./ethicPoint";
export * from "./triggerEthicPoint";

// Workflow Checkpoint
export * from "./workflowCheckpoint";

// Ethics Checkpoints (Frozen Micro-Copy)
export * from "./ethicsCheckpointCopy";
