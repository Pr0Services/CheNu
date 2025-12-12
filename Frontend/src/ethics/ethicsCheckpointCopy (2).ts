// ============================================
// CHE·NU — ETHICS CHECKPOINTS MICRO-COPY
// ============================================
// VERSION: 1.0 (FROZEN)
//
// This micro-copy is frozen and aligned with
// Ethical Foundation v1.0.
//
// NO VARIATION AUTHORIZED.
// ============================================

/**
 * OFFICIAL ICON
 *
 * 🧭 Compass
 *
 * Meaning:
 * - Orientation without prohibition
 * - Direction without judgment
 * - Human sovereignty
 */
export const ETHICS_CHECKPOINT_ICON = "🧭";

/**
 * FROZEN MICRO-COPY
 *
 * These texts are IMMUTABLE.
 * Any change requires a new version.
 */
export const ETHICS_CHECKPOINT_COPY = {
  // Primary micro-copy (default)
  primary: {
    fr: "Responsabilité humaine active · Assistance optionnelle",
    en: "Human responsibility active · Assistance optional",
  },

  // Contextual tooltip
  tooltip: {
    fr: "Vous opérez dans un cadre que vous avez défini.\nLe système vous assiste, sans décider pour vous.",
    en: "You are operating within a frame you defined.\nThe system assists you, without deciding for you.",
  },

  // XR / Meeting context
  xr_meeting: {
    fr: "Cadre actif · Responsabilité humaine maintenue",
    en: "Active frame · Human responsibility maintained",
  },

  // Replay / Export context
  replay_export: {
    fr: "Cette action reflète un choix humain conscient\ndans un cadre explicitement défini.",
    en: "This action reflects a conscious human choice\nwithin an explicitly defined frame.",
  },
} as const;

/**
 * MICRO-COPY BY LOCATION
 *
 * Maps each authorized location to its micro-copy.
 */
export const COPY_BY_LOCATION = {
  task_init: ETHICS_CHECKPOINT_COPY.primary,
  context_change: ETHICS_CHECKPOINT_COPY.primary,
  xr_meeting: ETHICS_CHECKPOINT_COPY.xr_meeting,
  replay_export: ETHICS_CHECKPOINT_COPY.replay_export,
} as const;

/**
 * AUTHORIZED LANGUAGE
 *
 * Only these words may appear in Ethics Checkpoint UI.
 */
export const AUTHORIZED_LANGUAGE = {
  fr: [
    "responsabilité",
    "cadre",
    "clarté",
    "optionnel",
    "conscience",
    "actif",
    "humain",
    "assistance",
    "explicite",
    "défini",
  ],
  en: [
    "responsibility",
    "frame",
    "context",
    "clarity",
    "optional",
    "awareness",
    "active",
    "human",
    "assistance",
    "explicit",
    "defined",
  ],
} as const;

/**
 * FORBIDDEN LANGUAGE
 *
 * These words MUST NEVER appear in Ethics Checkpoint UI.
 */
export const FORBIDDEN_LANGUAGE = {
  fr: [
    "avertissement",
    "risque",
    "recommandation",
    "conformité",
    "moralité",
    "danger",
    "problème",
    "erreur",
    "violation",
    "alerte",
  ],
  en: [
    "warning",
    "risk",
    "recommendation",
    "compliance",
    "morality",
    "danger",
    "problem",
    "error",
    "violation",
    "alert",
  ],
} as const;

/**
 * UI VISUAL CONSTANTS
 */
export const ETHICS_CHECKPOINT_STYLE = {
  iconSize: "14px",
  textSize: "11px",
  color: "#6c757d",
  background: "#f8f9fa",
  border: "1px solid #e9ecef",
  borderRadius: "4px",
  opacity: 0.7,
  autoHideMs: 5000,
} as const;

/**
 * Get micro-copy for a specific location and language
 */
export function getMicroCopy(
  location: keyof typeof COPY_BY_LOCATION,
  lang: "fr" | "en" = "fr"
): string {
  return COPY_BY_LOCATION[location][lang];
}

/**
 * Get tooltip text for a specific language
 */
export function getTooltip(lang: "fr" | "en" = "fr"): string {
  return ETHICS_CHECKPOINT_COPY.tooltip[lang];
}

/**
 * Validate that text contains no forbidden language
 */
export function validateLanguage(text: string, lang: "fr" | "en" = "fr"): boolean {
  const forbidden = FORBIDDEN_LANGUAGE[lang];
  const lowerText = text.toLowerCase();
  
  for (const word of forbidden) {
    if (lowerText.includes(word.toLowerCase())) {
      return false;
    }
  }
  
  return true;
}
