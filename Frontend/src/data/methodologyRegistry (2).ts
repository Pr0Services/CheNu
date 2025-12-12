import { Methodology } from "../types/methodology";

export const METHODOLOGY_REGISTRY: Methodology[] = [
  {
    id: "lean-construction",
    name: "Lean Construction",
    description:
      "Approche d'optimisation des flux de travail inspirée du Lean Manufacturing. Focus sur la réduction des gaspillages et l'amélioration continue.",
    suitedFor: {
      complexity: "medium",
      volume: "large",
      domains: ["construction", "rénovation", "infrastructure"],
    },
    steps: [
      "Identifier la valeur du point de vue client",
      "Cartographier le flux de valeur",
      "Créer un flux continu",
      "Établir un système pull",
      "Viser la perfection (amélioration continue)",
    ],
  },
  {
    id: "agile-chantier",
    name: "Agile Chantier",
    description:
      "Adaptation des principes Agile au contexte de la construction. Sprints courts, rétrospectives régulières, adaptation rapide aux changements.",
    suitedFor: {
      complexity: "high",
      volume: "medium",
      domains: ["construction", "rénovation", "projets complexes"],
    },
    steps: [
      "Définir le backlog de tâches",
      "Planifier le sprint (1-2 semaines)",
      "Exécution avec stand-ups quotidiens",
      "Revue de sprint avec le client",
      "Rétrospective et ajustement",
    ],
  },
  {
    id: "traditionnel-sequentiel",
    name: "Séquentiel Traditionnel",
    description:
      "Méthode classique en phases distinctes. Convient aux projets prévisibles avec des exigences stables.",
    suitedFor: {
      complexity: "low",
      volume: "small",
      domains: ["construction résidentielle", "réparations", "entretien"],
    },
    steps: [
      "Analyse des besoins",
      "Conception et planification",
      "Obtention des permis",
      "Exécution des travaux",
      "Inspection et livraison",
    ],
  },
];

export function getMethodologyById(id: string): Methodology | undefined {
  return METHODOLOGY_REGISTRY.find((m) => m.id === id);
}

export function getMethodologiesForDomain(domain: string): Methodology[] {
  return METHODOLOGY_REGISTRY.filter((m) =>
    m.suitedFor.domains.some((d) => d.toLowerCase().includes(domain.toLowerCase()))
  );
}

export function getMethodologiesForComplexity(
  complexity: "low" | "medium" | "high"
): Methodology[] {
  return METHODOLOGY_REGISTRY.filter((m) => m.suitedFor.complexity === complexity);
}
