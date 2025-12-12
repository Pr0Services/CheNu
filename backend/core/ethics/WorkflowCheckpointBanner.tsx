// ============================================
// CHE·NU — WORKFLOW CHECKPOINT BANNER
// ============================================
// Le checkpoint apparaît:
// - au MOMENT de l'exécution du workflow
// - UNE SEULE FOIS par workflow
// - jamais par agent individuel
//
// INTERDIT ABSOLU:
// - Checkpoint sur chaque agent
// - Message anxiogène
// - Langage normatif
// - Scoring de complexité
// - Historique comportemental
// ============================================

import { useEffect, useState } from "react";
import { useSilence } from "../../hooks/useSilence";
import { WorkflowCheckpointResult } from "../../ethics/workflowCheckpoint";

type WorkflowCheckpointBannerProps = {
  result: WorkflowCheckpointResult;
  autoHideMs?: number;
  showSubtext?: boolean;
};

/**
 * WORKFLOW CHECKPOINT BANNER
 *
 * Affichage NON-INTRUSIF du checkpoint workflow.
 *
 * Contenu STRICTEMENT autorisé:
 * - ICON: 🧭
 * - MESSAGE: "Workflow multi-agents actif · Responsabilité humaine maintenue"
 * - SOUS-TEXTE (optionnel): "Plusieurs agents coopèrent dans un cadre défini par vous."
 *
 * AUCUNE autre information.
 */
export function WorkflowCheckpointBanner({
  result,
  autoHideMs = 6000,
  showSubtext = true,
}: WorkflowCheckpointBannerProps) {
  const { silence } = useSilence();
  const [visible, setVisible] = useState(true);

  // Auto-hide après délai
  useEffect(() => {
    if (autoHideMs > 0 && result?.show) {
      const timer = setTimeout(() => setVisible(false), autoHideMs);
      return () => clearTimeout(timer);
    }
  }, [autoHideMs, result]);

  // Silence mode désactive tout
  if (silence.enabled) {
    return null;
  }

  // Pas de résultat = pas d'affichage
  if (!result || !result.show) {
    return null;
  }

  // Déjà masqué par auto-hide
  if (!visible) {
    return null;
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "10px 16px",
        background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
        border: "1px solid #dee2e6",
        borderRadius: "6px",
        fontSize: "13px",
        color: "#495057",
        marginBottom: "12px",
      }}
    >
      {/* Icon */}
      <span style={{ fontSize: "18px" }}>🧭</span>

      {/* Content */}
      <div style={{ flex: 1 }}>
        {/* Main message */}
        <div style={{ fontWeight: 500 }}>{result.message}</div>

        {/* Subtext (optional) */}
        {showSubtext && result.subtext && (
          <div
            style={{
              fontSize: "11px",
              color: "#6c757d",
              marginTop: "2px",
            }}
          >
            {result.subtext}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * WORKFLOW CHECKPOINT INLINE
 *
 * Version compacte pour intégration inline.
 * Message principal uniquement.
 */
export function WorkflowCheckpointInline({
  result,
}: {
  result: WorkflowCheckpointResult;
}) {
  const { silence } = useSilence();

  // Silence mode désactive tout
  if (silence.enabled) {
    return null;
  }

  // Pas de résultat = pas d'affichage
  if (!result || !result.show) {
    return null;
  }

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 10px",
        background: "#f8f9fa",
        border: "1px solid #e9ecef",
        borderRadius: "4px",
        fontSize: "11px",
        color: "#6c757d",
      }}
    >
      <span style={{ fontSize: "12px" }}>🧭</span>
      <span>{result.message}</span>
    </span>
  );
}

/**
 * WORKFLOW CHECKPOINT INDICATOR
 *
 * Version minimale: icône seule avec tooltip.
 * Pour les barres d'outils ou headers.
 */
export function WorkflowCheckpointIndicator({
  active,
}: {
  active: boolean;
}) {
  const { silence } = useSilence();

  // Silence mode désactive tout
  if (silence.enabled || !active) {
    return null;
  }

  return (
    <span
      title="Workflow multi-agents actif · Responsabilité humaine maintenue"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "24px",
        height: "24px",
        fontSize: "14px",
        background: "#f8f9fa",
        borderRadius: "4px",
        cursor: "default",
      }}
    >
      🧭
    </span>
  );
}
