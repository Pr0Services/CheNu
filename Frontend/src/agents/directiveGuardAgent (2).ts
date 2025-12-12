/**
 * DIRECTIVE GUARD AGENT
 *
 * Rôle: Observer et vérifier la conformité au PTC
 *
 * RÈGLES ABSOLUES:
 * - IL NE BLOQUE RIEN
 * - IL N'AUTORISE RIEN
 * - IL OBSERVE SEULEMENT
 * - IL RAPPORTE CE QU'IL VOIT
 *
 * Appelé APRÈS les actions, jamais avant.
 * Jamais préventivement.
 */

import {
  PreApprovedTaskContext,
  DirectiveCheckResult,
  AgentRole,
  ForbiddenCapability,
} from "../types/preApprovedTask";

type ActionContext = {
  type: "agent_call" | "xr_action" | "data_access";
  agentRole?: AgentRole;
  capability?: ForbiddenCapability;
  xrMode?: "live" | "replay" | "comparison" | "narrative";
  dataType?: "personal" | "cross-sphere" | "standard";
  sphereId?: string;
  targetSphereId?: string;
};

/**
 * Vérifie la conformité d'une action par rapport au PTC
 * Appelé APRÈS l'action, pas avant
 */
export function checkDirectiveCompliance(
  ptc: PreApprovedTaskContext,
  action: ActionContext
): DirectiveCheckResult {
  const warnings: string[] = [];
  const violatedRules: string[] = [];

  // Vérification des rôles d'agent
  if (action.type === "agent_call" && action.agentRole) {
    if (!ptc.allowedAgentRoles.includes(action.agentRole)) {
      violatedRules.push(`Rôle d'agent "${action.agentRole}" non autorisé dans ce contexte`);
    }
  }

  // Vérification des capacités interdites
  if (action.capability && ptc.forbiddenCapabilities.includes(action.capability)) {
    violatedRules.push(`Capacité "${action.capability}" explicitement interdite`);
  }

  // Vérification des contraintes XR
  if (action.type === "xr_action") {
    if (!ptc.xrConstraints.allowed) {
      violatedRules.push("Accès XR non autorisé dans ce contexte");
    } else if (ptc.xrConstraints.mode === "disabled") {
      violatedRules.push("XR désactivé dans ce contexte");
    } else if (ptc.xrConstraints.mode === "read-only") {
      // En mode read-only, on accepte replay, comparison, narrative
      // mais on avertit pour live
      if (action.xrMode === "live") {
        warnings.push("Mode XR live - le contexte suggère lecture seule");
      }
    }
  }

  // Vérification des contraintes de données
  if (action.type === "data_access") {
    if (action.dataType === "personal" && !ptc.dataConstraints.personalDataAllowed) {
      violatedRules.push("Accès aux données personnelles non autorisé");
    }
    if (action.dataType === "cross-sphere" && !ptc.dataConstraints.crossSphereAccessAllowed) {
      violatedRules.push("Accès inter-sphères non autorisé");
    }
    // Vérification de l'accès cross-sphere implicite
    if (
      action.sphereId &&
      action.targetSphereId &&
      action.sphereId !== action.targetSphereId &&
      !ptc.dataConstraints.crossSphereAccessAllowed
    ) {
      violatedRules.push(
        `Accès de la sphère "${action.sphereId}" vers "${action.targetSphereId}" non autorisé`
      );
    }
  }

  // Avertissements généraux (non bloquants)
  if (ptc.notes && ptc.notes.length > 0) {
    // Rappeler les notes du contexte si pertinent
    if (violatedRules.length > 0) {
      warnings.push(`Note du contexte: "${ptc.notes}"`);
    }
  }

  return {
    compliant: violatedRules.length === 0,
    warnings,
    violatedRules,
    checkedAt: Date.now(),
  };
}

/**
 * Vérifie si une intention d'agent correspond au contexte
 * Information seulement - ne bloque pas
 */
export function checkAgentIntentAlignment(
  ptc: PreApprovedTaskContext,
  agentRole: AgentRole,
  intendedCapabilities: ForbiddenCapability[]
): DirectiveCheckResult {
  const warnings: string[] = [];
  const violatedRules: string[] = [];

  // Vérifier le rôle
  if (!ptc.allowedAgentRoles.includes(agentRole)) {
    violatedRules.push(`Ce contexte n'autorise pas le rôle "${agentRole}"`);
  }

  // Vérifier les capacités
  for (const cap of intendedCapabilities) {
    if (ptc.forbiddenCapabilities.includes(cap)) {
      violatedRules.push(`La capacité "${cap}" est interdite dans ce contexte`);
    }
  }

  // Vérifier l'alignement avec l'intention
  const intentKeywords: Record<string, AgentRole[]> = {
    analyse: ["analysis"],
    exploration: ["analysis", "comparison"],
    documentation: ["presentation"],
    méthodologie: ["methodology"],
  };

  const matchingRoles = intentKeywords[ptc.intent.toLowerCase()] || [];
  if (matchingRoles.length > 0 && !matchingRoles.includes(agentRole)) {
    warnings.push(
      `L'intention "${ptc.intent}" suggère plutôt les rôles: ${matchingRoles.join(", ")}`
    );
  }

  return {
    compliant: violatedRules.length === 0,
    warnings,
    violatedRules,
    checkedAt: Date.now(),
  };
}

/**
 * Génère un résumé lisible du PTC pour l'UI
 */
export function summarizePTC(ptc: PreApprovedTaskContext): string {
  const parts: string[] = [];

  parts.push(`Intention: ${ptc.intent}`);
  parts.push(`Rôles autorisés: ${ptc.allowedAgentRoles.join(", ") || "aucun"}`);

  if (ptc.forbiddenCapabilities.length > 0) {
    parts.push(`Interdit: ${ptc.forbiddenCapabilities.join(", ")}`);
  }

  if (ptc.xrConstraints.allowed) {
    parts.push(`XR: ${ptc.xrConstraints.mode}`);
  } else {
    parts.push("XR: désactivé");
  }

  if (ptc.dataConstraints.personalDataAllowed) {
    parts.push("Données perso: autorisées");
  }
  if (ptc.dataConstraints.crossSphereAccessAllowed) {
    parts.push("Inter-sphères: autorisé");
  }

  return parts.join(" | ");
}

/**
 * Formate un résultat de vérification pour affichage
 */
export function formatCheckResult(result: DirectiveCheckResult): {
  status: "ok" | "warning" | "violation";
  message: string;
} {
  if (result.compliant && result.warnings.length === 0) {
    return { status: "ok", message: "Conforme au contexte défini" };
  }

  if (result.compliant && result.warnings.length > 0) {
    return {
      status: "warning",
      message: result.warnings.join(". "),
    };
  }

  return {
    status: "violation",
    message: result.violatedRules.join(". "),
  };
}
