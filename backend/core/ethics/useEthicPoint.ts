// ============================================
// CHE·NU — USE ETHIC POINT HOOK
// ============================================
// Hook pour utiliser l'Ethic Point dans les composants.
//
// RÈGLES:
// - Aucune logique de décision
// - Aucun blocage
// - Aucune persistance
// - Silence désactive tout
// ============================================

import { useState, useCallback, useMemo } from "react";
import { useSilence } from "./useSilence";
import {
  EthicPointContext,
  EthicPointResult,
  EthicPointLocation,
} from "../ethics/ethicPoint";
import {
  triggerEthicPoint,
  createEthicPointContext,
} from "../ethics/triggerEthicPoint";

type UseEthicPointOptions = {
  taskId: string;
  preApprovedContextId?: string;
  moralContextDeclared?: boolean;
  location?: EthicPointLocation;
};

/**
 * USE ETHIC POINT
 *
 * Hook pour afficher un Ethic Point.
 *
 * L'Ethic Point est:
 * - une balise de conscience
 * - un repère de souveraineté
 * - un rappel structurel
 *
 * Il ne contrôle jamais, ne bloque jamais, peut toujours être ignoré.
 */
export function useEthicPoint(options: UseEthicPointOptions) {
  const { silence } = useSilence();
  const [dismissed, setDismissed] = useState(false);

  // Créer le contexte
  const context: EthicPointContext = useMemo(
    () =>
      createEthicPointContext({
        taskId: options.taskId,
        preApprovedContextId: options.preApprovedContextId,
        moralContextDeclared: options.moralContextDeclared,
        silenceMode: silence.enabled,
      }),
    [
      options.taskId,
      options.preApprovedContextId,
      options.moralContextDeclared,
      silence.enabled,
    ]
  );

  // Trigger l'Ethic Point
  const result: EthicPointResult = useMemo(
    () => (dismissed ? null : triggerEthicPoint(context)),
    [context, dismissed]
  );

  // Fonction pour ignorer (optionnel, l'utilisateur peut toujours ignorer)
  const dismiss = useCallback(() => {
    setDismissed(true);
  }, []);

  // Reset si le contexte change
  const reset = useCallback(() => {
    setDismissed(false);
  }, []);

  return {
    result,
    context,
    location: options.location,
    dismissed,
    dismiss,
    reset,
    silenceActive: silence.enabled,
  };
}

/**
 * USE ETHIC POINT AT LOCATION
 *
 * Version simplifiée pour un emplacement spécifique.
 * Vérifie automatiquement que l'emplacement est valide.
 */
export function useEthicPointAtLocation(
  location: EthicPointLocation,
  taskId: string
) {
  return useEthicPoint({
    taskId,
    location,
  });
}
