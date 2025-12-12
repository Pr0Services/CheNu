// ============================================
// CHE·NU — ETHIC POINT BADGE (UI MINIMALE)
// ============================================
// L'Ethic Point UI:
// - est discret
// - ne bloque rien
// - peut être ignoré
// - disparaît automatiquement
//
// INTERDIT ABSOLU:
// - Scores éthiques
// - Alertes rouges
// - Nudging comportemental
// - Boucles de rappel insistantes
// - Dépendance UX à l'Ethic Point
// ============================================

import { useEffect, useState } from "react";
import { useSilence } from "../../hooks/useSilence";
import { EthicPointResult, EthicPointConfig, EthicPointLocation } from "../../ethics/ethicPoint";
import {
  ETHICS_CHECKPOINT_ICON,
  ETHICS_CHECKPOINT_STYLE,
  getMicroCopy,
  getTooltip,
} from "../../ethics/ethicsCheckpointCopy";

type EthicPointBadgeProps = {
  result: EthicPointResult;
  location?: EthicPointLocation;
  config?: EthicPointConfig;
  lang?: "fr" | "en";
};

/**
 * ETHIC POINT BADGE
 *
 * Affichage MINIMAL et NON-INTRUSIF.
 *
 * Langage STRICTEMENT autorisé:
 * - "Cadre actif"
 * - "Responsabilité humaine"
 * - "Réflexion optionnelle"
 *
 * Langage STRICTEMENT interdit:
 * - avertissement
 * - recommandation
 * - jugement
 * - obligation
 */
export function EthicPointBadge({
  result,
  location,
  config = {},
  lang = "fr",
}: EthicPointBadgeProps) {
  const { silence } = useSilence();
  const [visible, setVisible] = useState(true);

  const autoHideMs = config.autoHideMs ?? ETHICS_CHECKPOINT_STYLE.autoHideMs;
  const position = config.position ?? "inline";
  const minimal = config.minimal ?? false;

  // Auto-hide après délai
  useEffect(() => {
    if (autoHideMs > 0) {
      const timer = setTimeout(() => setVisible(false), autoHideMs);
      return () => clearTimeout(timer);
    }
  }, [autoHideMs]);

  // Silence mode désactive tout
  if (silence.enabled) {
    return null;
  }

  // Pas de résultat = pas d'affichage
  if (!result || !result.visible) {
    return null;
  }

  // Déjà masqué par auto-hide
  if (!visible) {
    return null;
  }

  // Message basé sur la location (frozen micro-copy)
  const message = location
    ? getMicroCopy(location, lang)
    : getMicroCopy("task_init", lang);

  const tooltip = getTooltip(lang);

  // Version minimale: icône seule
  if (minimal) {
    return (
      <span
        title={tooltip}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "20px",
          height: "20px",
          fontSize: ETHICS_CHECKPOINT_STYLE.iconSize,
          cursor: "default",
          opacity: ETHICS_CHECKPOINT_STYLE.opacity,
        }}
      >
        {ETHICS_CHECKPOINT_ICON}
      </span>
    );
  }

  // Position styles
  const positionStyles: Record<string, React.CSSProperties> = {
    top: {
      position: "fixed",
      top: "8px",
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 1000,
    },
    bottom: {
      position: "fixed",
      bottom: "8px",
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 1000,
    },
    inline: {},
  };

  return (
    <div
      title={tooltip}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 10px",
        background: ETHICS_CHECKPOINT_STYLE.background,
        border: ETHICS_CHECKPOINT_STYLE.border,
        borderRadius: ETHICS_CHECKPOINT_STYLE.borderRadius,
        fontSize: ETHICS_CHECKPOINT_STYLE.textSize,
        color: ETHICS_CHECKPOINT_STYLE.color,
        opacity: ETHICS_CHECKPOINT_STYLE.opacity,
        ...positionStyles[position],
      }}
    >
      <span style={{ fontSize: "12px" }}>{ETHICS_CHECKPOINT_ICON}</span>
      <span>{message}</span>
    </div>
  );
}

/**
 * ETHIC POINT INDICATOR
 *
 * Version ultra-minimale: juste une icône avec tooltip.
 * Pour usage dans les barres d'outils ou headers.
 */
export function EthicPointIndicator({
  active,
  location,
  lang = "fr",
}: {
  active: boolean;
  location?: EthicPointLocation;
  lang?: "fr" | "en";
}) {
  const { silence } = useSilence();

  // Silence mode désactive tout
  if (silence.enabled) {
    return null;
  }

  if (!active) {
    return null;
  }

  const tooltip = getTooltip(lang);

  return (
    <span
      title={tooltip}
      style={{
        display: "inline-block",
        fontSize: ETHICS_CHECKPOINT_STYLE.iconSize,
        opacity: ETHICS_CHECKPOINT_STYLE.opacity - 0.2,
        cursor: "default",
      }}
    >
      {ETHICS_CHECKPOINT_ICON}
    </span>
  );
}

/**
 * ETHIC POINT INLINE
 *
 * Version inline pour intégration dans du texte.
 * Non-intrusive, peut être ignorée.
 */
export function EthicPointInline({
  show,
  text,
  lang = "fr",
}: {
  show: boolean;
  text?: string;
  lang?: "fr" | "en";
}) {
  const { silence } = useSilence();

  // Silence mode désactive tout
  if (silence.enabled || !show) {
    return null;
  }

  const displayText = text || getMicroCopy("task_init", lang);

  return (
    <span
      title={getTooltip(lang)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        padding: "2px 6px",
        background: ETHICS_CHECKPOINT_STYLE.background,
        borderRadius: "3px",
        fontSize: "10px",
        color: ETHICS_CHECKPOINT_STYLE.color,
        opacity: ETHICS_CHECKPOINT_STYLE.opacity,
      }}
    >
      {ETHICS_CHECKPOINT_ICON} {displayText}
    </span>
  );
}
