// ============================================
// CHE·NU — CONSEQUENCE OBSERVER
// ============================================
// Le système ne juge jamais l'intention.
// Le système ne classifie jamais une action comme bonne ou mauvaise.
// Le système ne recommande jamais une correction morale.
// Toute réflexion est volontaire.
// Silence désactive toute réflexion.
// ============================================

/**
 * CONSEQUENCE OBSERVER
 *
 * Rôle:
 * - Observer les effets STRUCTURELS d'une action
 * - Sans analyser les opinions
 * - Sans classifier le bien ou le mal
 *
 * Exemples d'observations VALIDES:
 * - élargissement de portée
 * - exposition publique accrue
 * - augmentation de dépendance outil
 * - franchissement de sphère
 *
 * Exemples INTERDITS:
 * - "action irresponsable"
 * - "comportement immoral"
 * - "mauvaise intention"
 */

import {
  ConsequenceObservation,
  ObservableConsequenceType,
  ImpactDomain,
  IntentConsequenceComparison,
} from "../types/preApprovedTask";

// Génère un ID unique simple
function generateId(): string {
  return `obs_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Crée une observation de conséquence
 *
 * RÈGLES:
 * - Description FACTUELLE uniquement
 * - Aucun jugement de valeur
 * - Aucune qualification morale
 */
export function createObservation(params: {
  type: ObservableConsequenceType;
  description: string;
  affectedDomains: ImpactDomain[];
  measurable?: { before: string; after: string };
}): ConsequenceObservation {
  // Validation: pas de langage normatif
  validateDescription(params.description);

  return {
    id: generateId(),
    timestamp: Date.now(),
    type: params.type,
    description: params.description,
    affectedDomains: params.affectedDomains,
    measurable: params.measurable,
  };
}

/**
 * Vérifie que la description est factuelle
 * Lance une erreur si elle contient du langage interdit
 */
function validateDescription(description: string): void {
  // Mots et expressions INTERDITS (normatifs, prescriptifs, culpabilisants)
  const forbiddenPatterns = [
    /irresponsable/i,
    /immoral/i,
    /mauvais/i,
    /problématique/i,
    /dangereux/i,
    /inapproprié/i,
    /devrait/i,
    /ne devrait pas/i,
    /il faut/i,
    /il ne faut pas/i,
    /erreur/i,
    /faute/i,
    /coupable/i,
    /inacceptable/i,
    /condamnable/i,
  ];

  for (const pattern of forbiddenPatterns) {
    if (pattern.test(description)) {
      throw new Error(
        `Description contient du langage interdit: "${description}". ` +
          `Le Consequence Observer utilise uniquement un langage factuel et descriptif.`
      );
    }
  }
}

/**
 * Descriptions factuelles standards pour chaque type de conséquence
 */
export const CONSEQUENCE_DESCRIPTIONS: Record<ObservableConsequenceType, string> = {
  scope_expansion: "La portée de l'action s'est élargie.",
  scope_reduction: "La portée de l'action s'est réduite.",
  visibility_increase: "La visibilité a augmenté vers un groupe plus large.",
  visibility_decrease: "La visibilité a diminué.",
  dependency_increase: "Une dépendance supplémentaire a été créée.",
  dependency_decrease: "Une dépendance a été réduite ou supprimée.",
  sphere_crossing: "L'action a franchi une limite entre sphères.",
  data_persistence: "Des données ont été conservées.",
  data_deletion: "Des données ont été supprimées.",
  access_granted: "Un accès a été accordé.",
  access_revoked: "Un accès a été révoqué.",
};

/**
 * Observe les conséquences d'une action de manière passive
 *
 * Retourne une liste d'observations FACTUELLES
 * AUCUNE évaluation, AUCUN jugement
 */
export function observeActionConsequences(params: {
  actionType: string;
  fromSphere?: string;
  toSphere?: string;
  visibilityChange?: "increase" | "decrease" | "none";
  dataChange?: "persisted" | "deleted" | "none";
}): ConsequenceObservation[] {
  const observations: ConsequenceObservation[] = [];

  // Franchissement de sphère
  if (params.fromSphere && params.toSphere && params.fromSphere !== params.toSphere) {
    observations.push(
      createObservation({
        type: "sphere_crossing",
        description: `Passage de la sphère "${params.fromSphere}" vers "${params.toSphere}".`,
        affectedDomains: ["personal"],
        measurable: {
          before: params.fromSphere,
          after: params.toSphere,
        },
      })
    );
  }

  // Changement de visibilité
  if (params.visibilityChange === "increase") {
    observations.push(
      createObservation({
        type: "visibility_increase",
        description: CONSEQUENCE_DESCRIPTIONS.visibility_increase,
        affectedDomains: ["collective"],
      })
    );
  } else if (params.visibilityChange === "decrease") {
    observations.push(
      createObservation({
        type: "visibility_decrease",
        description: CONSEQUENCE_DESCRIPTIONS.visibility_decrease,
        affectedDomains: ["personal"],
      })
    );
  }

  // Changement de données
  if (params.dataChange === "persisted") {
    observations.push(
      createObservation({
        type: "data_persistence",
        description: CONSEQUENCE_DESCRIPTIONS.data_persistence,
        affectedDomains: ["personal"],
      })
    );
  } else if (params.dataChange === "deleted") {
    observations.push(
      createObservation({
        type: "data_deletion",
        description: CONSEQUENCE_DESCRIPTIONS.data_deletion,
        affectedDomains: ["personal"],
      })
    );
  }

  return observations;
}

/**
 * Crée une comparaison Intention vs Conséquence
 *
 * AFFICHE CÔTE À CÔTE:
 * - Ce que l'utilisateur a déclaré vouloir faire
 * - Ce qui a factuellement changé
 *
 * AUCUNE CONCLUSION AUTOMATIQUE
 */
export function createIntentConsequenceComparison(params: {
  taskId: string;
  declaredIntent: string;
  observations: ConsequenceObservation[];
}): IntentConsequenceComparison {
  return {
    taskId: params.taskId,
    declaredIntent: params.declaredIntent,
    observedConsequences: params.observations,
    // Aucune conclusion
    // Aucun score
    // Aucune évaluation
  };
}

/**
 * Formate une observation pour affichage
 * Langage strictement FACTUEL
 */
export function formatObservation(obs: ConsequenceObservation): string {
  let result = obs.description;

  if (obs.measurable) {
    result += ` (avant: ${obs.measurable.before}, après: ${obs.measurable.after})`;
  }

  if (obs.affectedDomains.length > 0) {
    result += ` — Domaines: ${obs.affectedDomains.join(", ")}.`;
  }

  return result;
}
