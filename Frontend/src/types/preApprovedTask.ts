// ============================================
// CHE·NU — PRE-APPROVED TASK CONTEXT (PTC)
// ============================================
// Le système ne juge jamais l'intention.
// Le système ne classifie jamais une action comme bonne ou mauvaise.
// Le système ne recommande jamais une correction morale.
// Toute réflexion est volontaire.
// Silence désactive toute réflexion.
// ============================================

// Cadre explicite défini par l'utilisateur AVANT toute action

export type AgentRole = "analysis" | "methodology" | "comparison" | "presentation";

export type ForbiddenCapability = "decision" | "recommendation" | "evaluation" | "auto-action";

// Domaines potentiellement impactés par une action
export type ImpactDomain =
  | "personal"
  | "collective"
  | "institutional"
  | "public"
  | "unknown";

// Contexte moral OPTIONNEL — jamais imposé
export type MoralContext = {
  declaredIntent: string;
  acknowledgedRisks?: string[];
  impactedDomains?: ImpactDomain[];
  valueStatements?: string[]; // ex: "non-manipulation", "transparence"
};

export type PreApprovedTaskContext = {
  id: string;
  createdAt: number;
  createdBy: "user"; // Toujours l'utilisateur

  intent: string; // ex: "analyse", "exploration", "documentation"

  allowedAgentRoles: AgentRole[];

  forbiddenCapabilities: ForbiddenCapability[];

  dataConstraints: {
    personalDataAllowed: boolean;
    crossSphereAccessAllowed: boolean;
  };

  xrConstraints: {
    allowed: boolean;
    mode: "read-only" | "disabled";
  };

  // Contexte moral OPTIONNEL
  // L'absence de MoralContext est valide
  // Aucune moralité n'est imposée par défaut
  moralContext?: MoralContext;

  notes?: string;
};

// Tâche active - référence TOUJOURS un PTC
export type ActiveTask = {
  id: string;
  contextId: string; // Référence vers PTC - obligatoire
  startedAt: number;
  sphereId?: string;
};

// Résultat de vérification du Directive Guard
// IL N'EMPÊCHE RIEN - il observe seulement
export type DirectiveCheckResult = {
  compliant: boolean;
  warnings: string[];
  violatedRules: string[];
  checkedAt: number;
};

// Historique des vérifications pour transparence
export type DirectiveCheckHistory = {
  taskId: string;
  checks: DirectiveCheckResult[];
};

// ============================================
// CO-RESPONSABILITÉ — TYPES D'OBSERVATION
// ============================================

// Types de conséquences OBSERVABLES (factuelles, non évaluatives)
export type ObservableConsequenceType =
  | "scope_expansion"        // élargissement de portée
  | "scope_reduction"        // réduction de portée
  | "visibility_increase"    // exposition publique accrue
  | "visibility_decrease"    // réduction de visibilité
  | "dependency_increase"    // augmentation de dépendance outil
  | "dependency_decrease"    // réduction de dépendance
  | "sphere_crossing"        // franchissement de sphère
  | "data_persistence"       // persistance de données
  | "data_deletion"          // suppression de données
  | "access_granted"         // accès accordé
  | "access_revoked";        // accès révoqué

// Observation de conséquence — JAMAIS de jugement
export type ConsequenceObservation = {
  id: string;
  timestamp: number;
  type: ObservableConsequenceType;
  description: string;        // Description FACTUELLE uniquement
  affectedDomains: ImpactDomain[];
  measurable?: {
    before: string;
    after: string;
  };
};

// Vue comparative Intention vs Conséquence
export type IntentConsequenceComparison = {
  taskId: string;
  declaredIntent: string;
  observedConsequences: ConsequenceObservation[];
  // Aucune conclusion automatique
  // Aucun score
  // Aucune évaluation
};
