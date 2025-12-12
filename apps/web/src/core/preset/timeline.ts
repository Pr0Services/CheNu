/* =========================================
   CHE·NU — PRESET TIMELINE (Canonical Implementation)
   
   Source unique de vérité pour les changements de preset.
   
   📜 Les 5 Lois:
   1. Timeline = vérité absolue
   2. XR = visualisation, jamais décision
   3. Metrics = observation, jamais jugement
   4. Aucun preset automatique
   5. Humain > système, toujours
   ========================================= */

import {
  PresetChange,
  PresetSource,
  PresetContext,
  PresetAuraConfig,
  PresetMetric,
  PresetTransition,
  DEFAULT_PRESETS,
  PRESET_LAWS,
} from './types';

// ============================================
// SECTION 1: TIMELINE (Source de Vérité)
// ============================================

/** Timeline globale - JAMAIS modifier directement */
export const PresetTimeline: PresetChange[] = [];

/** Ajouter un changement à la timeline */
export const addPresetChange = (change: PresetChange): void => {
  PresetTimeline.push(change);
};

/** Enregistrer un nouveau preset (helper) */
export const recordPreset = (
  presetId: string,
  source: PresetSource,
  ctx?: PresetContext
): PresetChange => {
  const change: PresetChange = {
    t: Date.now(),
    p: presetId,
    s: source,
    ctx,
  };
  addPresetChange(change);
  return change;
};

/** Obtenir le preset actuel */
export const currentPreset = (): string | undefined => {
  const last = PresetTimeline[PresetTimeline.length - 1];
  return last?.p;
};

/** Vider la timeline (tests uniquement) */
export const clearTimeline = (): void => {
  PresetTimeline.length = 0;
};

/** Obtenir la taille de la timeline */
export const getTimelineSize = (): number => PresetTimeline.length;

// ============================================
// SECTION 2: XR AURAS (Visualisation)
// ============================================

/** Configuration des auras par preset */
export const PresetAura: Record<string, PresetAuraConfig> = {
  focus: {
    color: '#4A90E2',
    radius: 1.2,
    animation: 'static',
    intensity: 0.8,
    particles: false,
  },
  exploration: {
    color: '#8E44AD',
    radius: 1.8,
    animation: 'pulse',
    intensity: 0.9,
    particles: true,
    speed: 1.0,
  },
  audit: {
    color: '#27AE60',
    radius: 1.5,
    animation: 'wave',
    intensity: 0.7,
    particles: false,
  },
  meeting: {
    color: '#F39C12',
    radius: 2.2,
    animation: 'breathe',
    intensity: 1.0,
    particles: true,
    speed: 0.5,
  },
  minimal: {
    color: '#7F8C8D',
    radius: 0.8,
    animation: 'static',
    intensity: 0.4,
    particles: false,
  },
};

/** Obtenir la config aura d'un preset */
export const getPresetAura = (presetId: string): PresetAuraConfig | undefined => {
  return PresetAura[presetId];
};

/** Définir une nouvelle config aura */
export const setPresetAura = (presetId: string, config: PresetAuraConfig): void => {
  PresetAura[presetId] = config;
};

/** Obtenir l'aura du preset actuel */
export const currentAura = (): PresetAuraConfig | undefined => {
  const current = currentPreset();
  return current ? getPresetAura(current) : undefined;
};

// ============================================
// SECTION 3: REPLAY (Navigation Temporelle)
// ============================================

/** Trouver le preset actif à un moment donné */
export const presetAt = (time: number): PresetChange | undefined => {
  // Parcourir en ordre inverse pour trouver le dernier avant `time`
  for (let i = PresetTimeline.length - 1; i >= 0; i--) {
    if (PresetTimeline[i].t <= time) {
      return PresetTimeline[i];
    }
  }
  return undefined;
};

/** Obtenir toutes les transitions */
export const transitions = (): PresetTransition[] => {
  if (PresetTimeline.length < 2) return [];
  
  return PresetTimeline.slice(1).map((change, i) => ({
    from: PresetTimeline[i].p,
    to: change.p,
    at: change.t,
    source: change.s,
  }));
};

/** Trouver la transition à un moment donné */
export const transitionAt = (time: number): PresetTransition | undefined => {
  const allTransitions = transitions();
  
  for (let i = allTransitions.length - 1; i >= 0; i--) {
    if (allTransitions[i].at <= time) {
      return allTransitions[i];
    }
  }
  return undefined;
};

/** Obtenir la timeline dans une plage de temps */
export const timelineRange = (
  start: number,
  end: number
): PresetChange[] => {
  return PresetTimeline.filter((c) => c.t >= start && c.t <= end);
};

// ============================================
// SECTION 4: METRICS (Observation)
// ============================================

/** Calculer les métriques par preset */
export const presetMetrics = (): Record<string, PresetMetric> => {
  const metrics: Record<string, PresetMetric> = {};
  
  PresetTimeline.forEach((change, i) => {
    const id = change.p;
    
    if (!metrics[id]) {
      metrics[id] = {
        presetId: id,
        count: 0,
        durationMs: 0,
        lastUsedAt: 0,
      };
    }
    
    metrics[id].count++;
    metrics[id].lastUsedAt = Math.max(metrics[id].lastUsedAt!, change.t);
    
    // Calculer la durée jusqu'au prochain changement
    const next = PresetTimeline[i + 1];
    if (next) {
      metrics[id].durationMs += next.t - change.t;
    }
  });
  
  // Calculer les moyennes
  Object.values(metrics).forEach((m) => {
    if (m.count > 0) {
      m.avgDurationMs = Math.round(m.durationMs / m.count);
    }
  });
  
  return metrics;
};

/** Obtenir les presets les plus utilisés */
export const topPresets = (limit: number = 5): string[] => {
  const metrics = presetMetrics();
  
  return Object.entries(metrics)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, limit)
    .map(([id]) => id);
};

/** Compter les changements par source */
export const sourceCount = (): Record<PresetSource, number> => {
  const counts: Record<PresetSource, number> = {
    manual: 0,
    role: 0,
    phase: 0,
    project: 0,
    sphere: 0,
    agent: 0,
  };
  
  PresetTimeline.forEach((change) => {
    counts[change.s]++;
  });
  
  return counts;
};

/** Calculer le ratio manuel vs automatique */
export const manualVsAuto = (): { manual: number; auto: number; ratio: number } => {
  const counts = sourceCount();
  const manual = counts.manual;
  const auto = counts.role + counts.phase + counts.project + counts.sphere + counts.agent;
  const total = manual + auto;
  
  return {
    manual,
    auto,
    ratio: total > 0 ? manual / total : 1,
  };
};

// ============================================
// SECTION 5: EXPLAIN (Transparence)
// ============================================

/** Expliquer un changement de preset */
export const explainPreset = (change: PresetChange): string => {
  const preset = DEFAULT_PRESETS[change.p];
  const label = preset?.label ?? change.p;
  const time = new Date(change.t).toLocaleTimeString('fr-CA');
  
  const sourceLabels: Record<PresetSource, string> = {
    manual: 'choix utilisateur',
    role: `rôle ${change.ctx?.role ?? 'changé'}`,
    phase: `phase ${change.ctx?.phase ?? 'changée'}`,
    project: `projet ${change.ctx?.project ?? 'changé'}`,
    sphere: `sphère ${change.ctx?.sphere ?? 'changée'}`,
    agent: `suggestion agent ${change.ctx?.agentId ?? ''}`,
  };
  
  return `${time}: "${label}" via ${sourceLabels[change.s]}`;
};

/** Expliquer le preset actuel */
export const explainCurrent = (): string => {
  const last = PresetTimeline[PresetTimeline.length - 1];
  if (!last) return 'Aucun preset actif';
  return explainPreset(last);
};

/** Résumé de la session */
export const sessionSummary = (): string => {
  const size = PresetTimeline.length;
  if (size === 0) return 'Session vide';
  
  const first = PresetTimeline[0];
  const last = PresetTimeline[size - 1];
  const duration = last.t - first.t;
  const durationMin = Math.round(duration / 60000);
  
  const top = topPresets(3);
  const counts = sourceCount();
  const manualPct = Math.round((counts.manual / size) * 100);
  
  return [
    `📊 Résumé de session CHE·NU`,
    `├─ Durée: ${durationMin} minutes`,
    `├─ Changements: ${size}`,
    `├─ Top presets: ${top.join(', ')}`,
    `├─ Contrôle manuel: ${manualPct}%`,
    `└─ ${PRESET_LAWS[4]}`, // "Humain > système, toujours"
  ].join('\n');
};

// ============================================
// SECTION 6: EXPORT TIMELINE
// ============================================

/** Exporter la timeline en JSON */
export const exportTimeline = (): string => {
  return JSON.stringify({
    version: '1.0',
    exportedAt: Date.now(),
    changes: PresetTimeline,
    metrics: presetMetrics(),
    summary: {
      total: PresetTimeline.length,
      sources: sourceCount(),
      topPresets: topPresets(5),
    },
  }, null, 2);
};

/** Importer une timeline (merge) */
export const importTimeline = (json: string): number => {
  try {
    const data = JSON.parse(json);
    const changes = data.changes as PresetChange[];
    
    let imported = 0;
    changes.forEach((change) => {
      // Éviter les doublons par timestamp
      if (!PresetTimeline.some((c) => c.t === change.t)) {
        addPresetChange(change);
        imported++;
      }
    });
    
    // Trier par timestamp
    PresetTimeline.sort((a, b) => a.t - b.t);
    
    return imported;
  } catch {
    return 0;
  }
};
