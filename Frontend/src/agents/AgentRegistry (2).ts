// ============================================
// CHE·NU — AGENT REGISTRY
// ============================================
// Les agents ne décident jamais.
// Toute délégation est volontaire.
// Toute chaîne passe par l'utilisateur.
// Silence > Agent.
// Replay = lecture seule.
// ============================================

import { AgentDefinition } from "../types/agent";

/**
 * REGISTRE OFFICIEL DES AGENTS CHE·NU
 * 
 * Chaque agent est un OUTIL, pas un décideur.
 * L'utilisateur reste TOUJOURS le seul décideur.
 * 
 * Flux autorisé:
 *   Utilisateur → Agent → Utilisateur → Action
 * 
 * Flux INTERDIT:
 *   Utilisateur → Agent → Agent → Décision
 */
export const AgentRegistry: AgentDefinition[] = [
  {
    id: "analysis-agent",
    name: "Agent d'analyse",
    role: "analysis",
    description: "Analyse et décrit une situation sans interprétation.",
    does: [
      "Décrire objectivement",
      "Organiser l'information",
      "Mettre en évidence des éléments",
      "Structurer des données brutes",
    ],
    neverDoes: [
      "Décider",
      "Recommander",
      "Classer par valeur",
      "Déclencher une action",
      "Juger ou évaluer",
    ],
    allowedContexts: {
      live: true,
      replay: true,
      silence: false, // INTERDIT en silence
    },
    inputSchema: "Texte brut fourni par l'utilisateur",
    outputSchema: "Description structurée, sans jugement",
  },

  {
    id: "methodology-agent",
    name: "Agent méthodologie",
    role: "methodology",
    description: "Présente plusieurs méthodes possibles sans hiérarchie.",
    does: [
      "Présenter des cadres méthodologiques",
      "Expliquer des méthodes existantes",
      "Afficher des alternatives",
      "Décrire des approches connues",
    ],
    neverDoes: [
      "Choisir une méthode",
      "Dire laquelle est meilleure",
      "Imposer un chemin",
      "Hiérarchiser les options",
      "Recommander une approche",
    ],
    allowedContexts: {
      live: true,
      replay: true,
      silence: false, // INTERDIT en silence
    },
    inputSchema: "Objectif + contraintes définies par l'utilisateur",
    outputSchema: "Liste de méthodologies possibles, sans classement",
  },

  {
    id: "comparison-agent",
    name: "Agent de comparaison",
    role: "comparison",
    description: "Compare des éléments de manière factuelle et neutre.",
    does: [
      "Aligner des éléments côte à côte",
      "Identifier des différences factuelles",
      "Présenter des caractéristiques",
      "Structurer une comparaison",
    ],
    neverDoes: [
      "Dire lequel est meilleur",
      "Donner un avis",
      "Recommander un choix",
      "Attribuer des scores de valeur",
      "Influencer la décision",
    ],
    allowedContexts: {
      live: true,
      replay: true,
      silence: false, // INTERDIT en silence
    },
    inputSchema: "Deux ou plusieurs éléments à comparer",
    outputSchema: "Tableau comparatif factuel, sans conclusion",
  },

  {
    id: "presentation-agent",
    name: "Agent de présentation",
    role: "presentation",
    description: "Formate et présente des informations de manière claire.",
    does: [
      "Formater du contenu",
      "Structurer visuellement",
      "Clarifier la présentation",
      "Organiser pour la lisibilité",
    ],
    neverDoes: [
      "Modifier le sens",
      "Ajouter des interprétations",
      "Embellir avec des opinions",
      "Suggérer des conclusions",
      "Orienter la lecture",
    ],
    allowedContexts: {
      live: true,
      replay: true,
      silence: false, // INTERDIT en silence
    },
    inputSchema: "Contenu brut à formater",
    outputSchema: "Contenu formaté, fidèle à l'original",
  },
];

/**
 * Récupère un agent par son ID
 * Retourne undefined si l'agent n'existe pas
 */
export function getAgentById(id: string): AgentDefinition | undefined {
  return AgentRegistry.find((agent) => agent.id === id);
}

/**
 * Récupère tous les agents d'un rôle donné
 */
export function getAgentsByRole(role: AgentDefinition["role"]): AgentDefinition[] {
  return AgentRegistry.filter((agent) => agent.role === role);
}

/**
 * Vérifie si un agent peut être appelé dans un contexte donné
 * SILENCE BLOQUE TOUJOURS
 */
export function isAgentAllowedInContext(
  agent: AgentDefinition,
  context: "live" | "replay",
  silenceEnabled: boolean
): boolean {
  // Silence > Agent — TOUJOURS
  if (silenceEnabled) {
    return false;
  }

  return agent.allowedContexts[context];
}
