// ============================================
// CHE·NU — MORAL REFLECTION PROMPT (PASSIF)
// ============================================
// Le système ne juge jamais l'intention.
// Le système ne classifie jamais une action comme bonne ou mauvaise.
// Le système ne recommande jamais une correction morale.
// Toute réflexion est volontaire.
// Silence désactive toute réflexion.
// ============================================

import { useSilence } from "../../hooks/useSilence";

type MoralReflectionPromptProps = {
  visible: boolean;
  onAccept?: () => void;
  onDismiss?: () => void;
};

/**
 * MORAL REFLECTION PROMPT
 *
 * Affiche un message OPTIONNEL après certaines actions.
 *
 * RÈGLES:
 * - Aucun bouton par défaut
 * - Aucun push
 * - Aucun scoring
 * - Silence désactive tout
 *
 * Ce n'est PAS une notification.
 * Ce n'est PAS une alerte.
 * C'est une INVITATION à la réflexion, rien de plus.
 */
export function MoralReflectionPrompt({
  visible,
  onAccept,
  onDismiss,
}: MoralReflectionPromptProps) {
  const { silence } = useSilence();

  // Silence désactive toute réflexion
  if (silence.enabled) {
    return null;
  }

  if (!visible) {
    return null;
  }

  return (
    <div
      style={{
        padding: "16px",
        background: "#fafafa",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        marginTop: "16px",
      }}
    >
      {/* Question neutre — aucun jugement */}
      <p
        style={{
          margin: 0,
          fontSize: "14px",
          color: "#555",
          lineHeight: 1.5,
        }}
      >
        Souhaitez-vous examiner les conséquences potentielles
        en regard de l'intention que vous aviez déclarée ?
      </p>

      {/* Actions — toutes optionnelles */}
      <div
        style={{
          marginTop: "12px",
          display: "flex",
          gap: "8px",
        }}
      >
        {onAccept && (
          <button
            onClick={onAccept}
            style={{
              padding: "8px 16px",
              background: "#fff",
              border: "1px solid #ccc",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "13px",
              color: "#333",
            }}
          >
            Examiner
          </button>
        )}
        {onDismiss && (
          <button
            onClick={onDismiss}
            style={{
              padding: "8px 16px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "13px",
              color: "#888",
            }}
          >
            Ignorer
          </button>
        )}
      </div>

      {/* Note de clarté */}
      <p
        style={{
          marginTop: "12px",
          marginBottom: 0,
          fontSize: "11px",
          color: "#999",
          fontStyle: "italic",
        }}
      >
        Cette réflexion est volontaire. Aucune action n'est bloquée.
        Vous pouvez ignorer ce message sans conséquence.
      </p>
    </div>
  );
}

/**
 * COMPACT VERSION
 * Pour affichage inline discret
 */
export function MoralReflectionInline({
  onClick,
}: {
  onClick?: () => void;
}) {
  const { silence } = useSilence();

  // Silence désactive toute réflexion
  if (silence.enabled) {
    return null;
  }

  return (
    <button
      onClick={onClick}
      style={{
        padding: "4px 8px",
        background: "transparent",
        border: "1px dashed #ccc",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "11px",
        color: "#888",
      }}
    >
      🪞 Examiner intention/conséquences
    </button>
  );
}
