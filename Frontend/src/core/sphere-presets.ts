/* =========================================================
   CHE·NU — SPHERE PRESET SYSTEM
   
   Presets spécifiques aux sphères de l'univers CHE·NU.
   Chaque sphère peut avoir plusieurs presets adaptés
   à différents modes de travail.
   ========================================================= */

// ─────────────────────────────────────────────────────────
// 1. SPHÈRES
// ─────────────────────────────────────────────────────────

/**
 * Identifiants des sphères de l'univers CHE·NU.
 */
export type SphereId =
  | 'personal'
  | 'business'
  | 'creative'
  | 'social'
  | 'scholar'
  | 'methodology'
  | 'institutions'
  | 'xr'
  | 'governance';

// ─────────────────────────────────────────────────────────
// 2. SPHERE PRESET
// ─────────────────────────────────────────────────────────

/**
 * Preset spécifique à une sphère.
 */
export interface SpherePreset {
  /** Sphère associée */
  sphere: SphereId;
  /** Identifiant unique du preset */
  presetId: string;
  /** Libellé d'affichage */
  label: string;
  /** Intention / cas d'usage */
  intent: string;
}

// ─────────────────────────────────────────────────────────
// 3. PRESETS PAR SPHÈRE
// ─────────────────────────────────────────────────────────

/**
 * Tous les presets de sphère.
 */
export const SPHERE_PRESETS: SpherePreset[] = [
  /* =========================================================
     👤 PERSONAL SPHERE
  ========================================================= */

  {
    sphere: 'personal',
    presetId: 'personal_focus',
    label: 'Personal Focus',
    intent: 'Daily clarity, tasks, and self-organization.',
  },
  {
    sphere: 'personal',
    presetId: 'personal_reflection',
    label: 'Reflection',
    intent: 'Review actions, habits, and timelines calmly.',
  },
  {
    sphere: 'personal',
    presetId: 'personal_minimal',
    label: 'Minimal Life View',
    intent: 'Low cognitive load, essential info only.',
  },

  /* =========================================================
     🏢 BUSINESS SPHERE
  ========================================================= */

  {
    sphere: 'business',
    presetId: 'business_execution',
    label: 'Execution Mode',
    intent: 'KPIs, pipeline, tasks, revenue focus.',
  },
  {
    sphere: 'business',
    presetId: 'business_strategy',
    label: 'Strategic Planning',
    intent: 'Long-term vision, dependencies, what-if views.',
  },
  {
    sphere: 'business',
    presetId: 'business_audit',
    label: 'Business Audit',
    intent: 'Decisions, timelines, accountability.',
  },
  {
    sphere: 'business',
    presetId: 'business_crisis',
    label: 'Crisis Management',
    intent: 'Rapid prioritization, signal-only information.',
  },

  /* =========================================================
     🎨 CREATIVE SPHERE
  ========================================================= */

  {
    sphere: 'creative',
    presetId: 'creative_ideation',
    label: 'Ideation',
    intent: 'Free exploration, references, cross-links.',
  },
  {
    sphere: 'creative',
    presetId: 'creative_production',
    label: 'Production',
    intent: 'Deliverables, assets, timelines.',
  },
  {
    sphere: 'creative',
    presetId: 'creative_review',
    label: 'Creative Review',
    intent: 'Compare versions, feedback loops.',
  },
  {
    sphere: 'creative',
    presetId: 'creative_playground',
    label: 'Playground',
    intent: 'Non-linear exploration, inspiration-only.',
  },

  /* =========================================================
     🎉 SOCIAL & MEDIA SPHERE
  ========================================================= */

  {
    sphere: 'social',
    presetId: 'social_engagement',
    label: 'Engagement',
    intent: 'Posts, reactions, growth signals.',
  },
  {
    sphere: 'social',
    presetId: 'social_content',
    label: 'Content Publishing',
    intent: 'Creation-to-publication pipeline.',
  },
  {
    sphere: 'social',
    presetId: 'social_analytics',
    label: 'Social Analytics',
    intent: 'Performance, reach, trends.',
  },
  {
    sphere: 'social',
    presetId: 'social_minimal',
    label: 'Silent Mode',
    intent: 'Read-only, no notifications.',
  },

  /* =========================================================
     🎓 SCHOLAR SPHERE
  ========================================================= */

  {
    sphere: 'scholar',
    presetId: 'scholar_learning',
    label: 'Learning',
    intent: 'Courses, notes, progressive understanding.',
  },
  {
    sphere: 'scholar',
    presetId: 'scholar_research',
    label: 'Research',
    intent: 'Sources, hypotheses, comparison.',
  },
  {
    sphere: 'scholar',
    presetId: 'scholar_synthesis',
    label: 'Synthesis',
    intent: 'Concept maps, summaries.',
  },
  {
    sphere: 'scholar',
    presetId: 'scholar_exams',
    label: 'Exam Mode',
    intent: 'Recall, review, minimal distractions.',
  },

  /* =========================================================
     🧠 METHODOLOGY SPHERE
  ========================================================= */

  {
    sphere: 'methodology',
    presetId: 'methodology_analysis',
    label: 'Method Analysis',
    intent: 'Compare methodologies and their efficiency.',
  },
  {
    sphere: 'methodology',
    presetId: 'methodology_design',
    label: 'Method Design',
    intent: 'Create or adapt workflows.',
  },
  {
    sphere: 'methodology',
    presetId: 'methodology_experiment',
    label: 'Experimentation',
    intent: 'Test methods, observe results.',
  },
  {
    sphere: 'methodology',
    presetId: 'methodology_optimization',
    label: 'Optimization',
    intent: 'Reduce waste, improve signal.',
  },

  /* =========================================================
     🏛️ INSTITUTIONS / GOVERNANCE
  ========================================================= */

  {
    sphere: 'institutions',
    presetId: 'institution_compliance',
    label: 'Compliance',
    intent: 'Regulations, audits, traceability.',
  },
  {
    sphere: 'institutions',
    presetId: 'institution_policy',
    label: 'Policy Design',
    intent: 'Rules, frameworks, laws.',
  },
  {
    sphere: 'institutions',
    presetId: 'institution_transparency',
    label: 'Transparency',
    intent: 'Open reporting, public accountability.',
  },

  /* =========================================================
     🕶️ XR / IMMERSIVE
  ========================================================= */

  {
    sphere: 'xr',
    presetId: 'xr_exploration',
    label: 'XR Exploration',
    intent: 'Universe navigation, spatial discovery.',
  },
  {
    sphere: 'xr',
    presetId: 'xr_meeting',
    label: 'XR Meeting',
    intent: 'Collaborative spatial meetings.',
  },
  {
    sphere: 'xr',
    presetId: 'xr_replay',
    label: 'XR Replay',
    intent: 'Timeline and meeting replay.',
  },

  /* =========================================================
     ⚖️ GOVERNANCE (META-SPHERE)
  ========================================================= */

  {
    sphere: 'governance',
    presetId: 'governance_audit',
    label: 'Governance Audit',
    intent: 'Oversight of all decisions.',
  },
  {
    sphere: 'governance',
    presetId: 'governance_review',
    label: 'Cross-Sphere Review',
    intent: 'Inter-sphere consistency and impact.',
  },
];

// ─────────────────────────────────────────────────────────
// 4. FONCTIONS UTILITAIRES
// ─────────────────────────────────────────────────────────

/**
 * Obtient tous les presets d'une sphère.
 */
export function getPresetsForSphere(sphereId: SphereId): SpherePreset[] {
  return SPHERE_PRESETS.filter((p) => p.sphere === sphereId);
}

/**
 * Trouve un preset de sphère par son ID.
 */
export function getSpherePresetById(presetId: string): SpherePreset | undefined {
  return SPHERE_PRESETS.find((p) => p.presetId === presetId);
}

/**
 * Obtient toutes les sphères uniques.
 */
export function getAllSpheres(): SphereId[] {
  return [...new Set(SPHERE_PRESETS.map((p) => p.sphere))];
}

/**
 * Compte les presets par sphère.
 */
export function countPresetsPerSphere(): Map<SphereId, number> {
  const counts = new Map<SphereId, number>();
  
  for (const preset of SPHERE_PRESETS) {
    counts.set(preset.sphere, (counts.get(preset.sphere) || 0) + 1);
  }
  
  return counts;
}

/**
 * Recherche des presets par mot-clé dans l'intent.
 */
export function searchSpherePresets(keyword: string): SpherePreset[] {
  const lowerKeyword = keyword.toLowerCase();
  return SPHERE_PRESETS.filter(
    (p) =>
      p.label.toLowerCase().includes(lowerKeyword) ||
      p.intent.toLowerCase().includes(lowerKeyword)
  );
}

// ─────────────────────────────────────────────────────────
// 5. MÉTADONNÉES DES SPHÈRES
// ─────────────────────────────────────────────────────────

/**
 * Métadonnées visuelles des sphères.
 */
export interface SphereMeta {
  id: SphereId;
  label: string;
  icon: string;
  color: string;
  description: string;
}

/**
 * Métadonnées de toutes les sphères.
 */
export const SPHERE_META: SphereMeta[] = [
  {
    id: 'personal',
    label: 'Personal',
    icon: '👤',
    color: '#3b82f6',
    description: 'Vie personnelle, tâches, habitudes.',
  },
  {
    id: 'business',
    label: 'Business',
    icon: '🏢',
    color: '#22c55e',
    description: 'Affaires, stratégie, exécution.',
  },
  {
    id: 'creative',
    label: 'Creative',
    icon: '🎨',
    color: '#ec4899',
    description: 'Création, idéation, production.',
  },
  {
    id: 'social',
    label: 'Social',
    icon: '🎉',
    color: '#f97316',
    description: 'Réseaux sociaux, engagement, contenu.',
  },
  {
    id: 'scholar',
    label: 'Scholar',
    icon: '🎓',
    color: '#8b5cf6',
    description: 'Apprentissage, recherche, synthèse.',
  },
  {
    id: 'methodology',
    label: 'Methodology',
    icon: '🧠',
    color: '#06b6d4',
    description: 'Méthodes, workflows, optimisation.',
  },
  {
    id: 'institutions',
    label: 'Institutions',
    icon: '🏛️',
    color: '#78716c',
    description: 'Conformité, politiques, transparence.',
  },
  {
    id: 'xr',
    label: 'XR',
    icon: '🕶️',
    color: '#6366f1',
    description: 'Immersion, navigation spatiale, replay.',
  },
  {
    id: 'governance',
    label: 'Governance',
    icon: '⚖️',
    color: '#eab308',
    description: 'Méta-sphère, supervision, cohérence.',
  },
];

/**
 * Obtient les métadonnées d'une sphère.
 */
export function getSphereMeta(sphereId: SphereId): SphereMeta | undefined {
  return SPHERE_META.find((s) => s.id === sphereId);
}

// ─────────────────────────────────────────────────────────
// 6. RÈGLES
// ─────────────────────────────────────────────────────────

/**
 * RÈGLES DES PRESETS DE SPHÈRE:
 * 
 * 1. Un preset de sphère est toujours suggestionnel
 *    → Jamais appliqué automatiquement
 * 
 * 2. Peut se combiner avec phase / projet / rôle
 *    → Les contextes s'additionnent, pas de conflit
 * 
 * 3. Ne modifie jamais les lois
 *    → Les Three Laws sont inviolables
 * 
 * 4. Sert uniquement à adapter lecture, affichage et outils
 *    → Personnalisation UX, pas de changement fonctionnel
 */
export const SPHERE_RULES = [
  'Un preset de sphère est toujours suggestionnel',
  'Peut se combiner avec phase / projet / rôle',
  'Ne modifie jamais les lois',
  'Sert uniquement à adapter lecture, affichage et outils',
] as const;
