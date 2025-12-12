/* =========================================================
   CHE·NU — PRESET FUSION ENGINE + UI
   
   Moteur de fusion des presets avec résolution contextuelle
   et composant UI de suggestion.
   ========================================================= */

import React from 'react';

// ─────────────────────────────────────────────────────────
// 1. TYPES DE BASE
// ─────────────────────────────────────────────────────────

/**
 * Niveau de densité de l'interface.
 */
export type DensityLevel = 'minimal' | 'balanced' | 'rich';

/**
 * Identifiants des sphères.
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

/**
 * Identifiants des phases.
 */
export type PhaseId =
  | 'exploration'
  | 'analysis'
  | 'decision'
  | 'execution'
  | 'review'
  | 'closure';

/**
 * Configuration XR.
 */
export interface XRPersonalization {
  enabled: boolean;
  ambiance: 'calm' | 'focused' | 'cosmic';
}

/**
 * Configuration de personnalisation globale.
 */
export interface CheNuPersonalization {
  version: number;
  themeGlobal: string;
  density: DensityLevel;
  xr: XRPersonalization;
}

// ─────────────────────────────────────────────────────────
// 2. PRESETS
// ─────────────────────────────────────────────────────────

/**
 * Définition d'un preset.
 */
export interface CheNuPreset {
  id: string;
  label: string;
  description: string;
  personalizationPatch: Partial<CheNuPersonalization>;
}

/**
 * Rôle utilisateur avec preset par défaut.
 */
export interface UserRole {
  id: string;
  defaultPresetId: string;
}

/**
 * Association sphère → preset.
 */
export interface SpherePreset {
  sphere: SphereId;
  presetId: string;
}

/**
 * Association projet → preset.
 */
export interface ProjectPreset {
  projectId: string;
  presetId: string;
}

// ─────────────────────────────────────────────────────────
// 3. CONTEXTE DE RÉSOLUTION
// ─────────────────────────────────────────────────────────

/**
 * Contexte complet pour résoudre un preset.
 */
export interface PresetContext {
  /** Preset sélectionné manuellement (priorité max) */
  manualPresetId?: string;
  /** Rôle actif */
  roleId?: string;
  /** Phase actuelle */
  phase?: PhaseId;
  /** Projet actif */
  projectId?: string;
  /** Sphère active */
  activeSphere?: SphereId;
}

// ─────────────────────────────────────────────────────────
// 4. FUSION ENGINE
// ─────────────────────────────────────────────────────────

/**
 * Résultat de la résolution avec traçabilité.
 */
export interface PresetResolution {
  /** Preset résolu */
  preset: CheNuPreset;
  /** Raisons de la sélection (traçabilité) */
  reasons: string[];
  /** Source de la résolution */
  source: 'manual' | 'project' | 'sphere' | 'phase' | 'role';
  /** Timestamp de résolution */
  timestamp: number;
}

/**
 * Résout le preset à suggérer selon le contexte.
 * 
 * ORDRE DE PRIORITÉ:
 * 1. Manuel (choix explicite)
 * 2. Projet (si actif)
 * 3. Sphère (si active)
 * 4. Phase (si active)
 * 5. Rôle (preset par défaut)
 * 
 * @param context - Contexte de résolution
 * @param presets - Liste des presets disponibles
 * @param roles - Liste des rôles
 * @param phasePresets - Mapping phase → preset
 * @param projectPresets - Mapping projet → preset
 * @param spherePresets - Mapping sphère → preset
 * @returns Résolution avec traçabilité, ou undefined
 */
export function resolvePresetFusion(
  context: PresetContext,
  presets: CheNuPreset[],
  roles: UserRole[],
  phasePresets: Record<PhaseId, string>,
  projectPresets: ProjectPreset[],
  spherePresets: SpherePreset[]
): PresetResolution | undefined {
  const reasons: string[] = [];
  const find = (id?: string) => presets.find((p) => p.id === id);
  const timestamp = Date.now();

  // PRIORITÉ 1 — MANUEL
  if (context.manualPresetId) {
    const preset = find(context.manualPresetId);
    if (preset) {
      reasons.push('Selected manually by user');
      return { preset, reasons, source: 'manual', timestamp };
    }
  }

  // PRIORITÉ 2 — PROJET
  const project = projectPresets.find((p) => p.projectId === context.projectId);
  if (project) {
    const preset = find(project.presetId);
    if (preset) {
      reasons.push(`Project preset (${project.projectId})`);
      return { preset, reasons, source: 'project', timestamp };
    }
  }

  // PRIORITÉ 3 — SPHÈRE ACTIVE
  const sphere = spherePresets.find((s) => s.sphere === context.activeSphere);
  if (sphere) {
    const preset = find(sphere.presetId);
    if (preset) {
      reasons.push(`Active sphere (${sphere.sphere})`);
      return { preset, reasons, source: 'sphere', timestamp };
    }
  }

  // PRIORITÉ 4 — PHASE
  if (context.phase) {
    const preset = find(phasePresets[context.phase]);
    if (preset) {
      reasons.push(`Current phase (${context.phase})`);
      return { preset, reasons, source: 'phase', timestamp };
    }
  }

  // PRIORITÉ 5 — RÔLE
  const role = roles.find((r) => r.id === context.roleId);
  if (role) {
    const preset = find(role.defaultPresetId);
    if (preset) {
      reasons.push(`Active role (${role.id})`);
      return { preset, reasons, source: 'role', timestamp };
    }
  }

  return undefined;
}

/**
 * Applique un patch de preset sur une configuration existante.
 */
export function applyPresetPatch(
  current: CheNuPersonalization,
  preset: CheNuPreset
): CheNuPersonalization {
  const patch = preset.personalizationPatch;

  return {
    ...current,
    ...patch,
    xr: patch.xr ? { ...current.xr, ...patch.xr } : current.xr,
  };
}

// ─────────────────────────────────────────────────────────
// 5. UI — PRESET SUGGESTION PANEL
// ─────────────────────────────────────────────────────────

/**
 * Props du panneau de suggestion.
 */
export interface PresetSuggestionPanelProps {
  /** Résolution actuelle */
  resolution?: PresetResolution;
  /** Callback pour appliquer le preset */
  onApply: (presetId: string) => void;
  /** Callback pour ignorer la suggestion */
  onIgnore: () => void;
  /** Position du panneau */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  /** Thème du panneau */
  theme?: 'dark' | 'light';
}

/**
 * Styles de position du panneau.
 */
const positionStyles: Record<string, React.CSSProperties> = {
  'bottom-right': { bottom: 20, right: 20 },
  'bottom-left': { bottom: 20, left: 20 },
  'top-right': { top: 20, right: 20 },
  'top-left': { top: 20, left: 20 },
};

/**
 * Icônes par source de résolution.
 */
const sourceIcons: Record<PresetResolution['source'], string> = {
  manual: '✋',
  project: '📁',
  sphere: '🔮',
  phase: '📍',
  role: '👤',
};

/**
 * Panneau de suggestion de preset.
 * Affiche le preset suggéré avec les raisons et permet d'appliquer ou ignorer.
 */
export function PresetSuggestionPanel({
  resolution,
  onApply,
  onIgnore,
  position = 'bottom-right',
  theme = 'dark',
}: PresetSuggestionPanelProps) {
  if (!resolution) return null;

  const isDark = theme === 'dark';
  const icon = sourceIcons[resolution.source];

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    ...positionStyles[position],
    background: isDark ? '#1a1a2e' : '#ffffff',
    color: isDark ? '#ffffff' : '#1a1a2e',
    padding: 16,
    borderRadius: 12,
    width: 320,
    boxShadow: isDark
      ? '0 4px 24px rgba(0, 0, 0, 0.5)'
      : '0 4px 24px rgba(0, 0, 0, 0.15)',
    border: isDark ? '1px solid #333' : '1px solid #e0e0e0',
    zIndex: 9999,
  };

  const buttonBaseStyle: React.CSSProperties = {
    padding: '8px 16px',
    borderRadius: 6,
    border: 'none',
    cursor: 'pointer',
    fontWeight: 500,
    fontSize: 14,
    transition: 'all 0.2s ease',
  };

  const applyButtonStyle: React.CSSProperties = {
    ...buttonBaseStyle,
    background: '#4a90e2',
    color: '#fff',
  };

  const ignoreButtonStyle: React.CSSProperties = {
    ...buttonBaseStyle,
    background: isDark ? '#333' : '#e0e0e0',
    color: isDark ? '#fff' : '#333',
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
          💡 Suggested Preset
        </h3>
      </div>

      {/* Preset Info */}
      <div style={{ marginBottom: 12 }}>
        <strong style={{ fontSize: 18 }}>{resolution.preset.label}</strong>
        <p style={{ fontSize: 13, opacity: 0.75, margin: '4px 0 0 0' }}>
          {resolution.preset.description}
        </p>
      </div>

      {/* Reasons */}
      <div
        style={{
          background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
          borderRadius: 8,
          padding: 10,
          marginBottom: 12,
        }}
      >
        <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 4 }}>WHY?</div>
        <ul style={{ fontSize: 12, margin: 0, paddingLeft: 16 }}>
          {resolution.reasons.map((reason, i) => (
            <li key={i} style={{ marginBottom: 2 }}>
              {reason}
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          style={applyButtonStyle}
          onClick={() => onApply(resolution.preset.id)}
          onMouseOver={(e) => (e.currentTarget.style.background = '#3a7bc8')}
          onMouseOut={(e) => (e.currentTarget.style.background = '#4a90e2')}
        >
          ✓ Apply
        </button>
        <button
          style={ignoreButtonStyle}
          onClick={onIgnore}
        >
          ✕ Ignore
        </button>
      </div>

      {/* Timestamp */}
      <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8, textAlign: 'right' }}>
        {new Date(resolution.timestamp).toLocaleTimeString()}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// 6. HOOK — USE PRESET FUSION
// ─────────────────────────────────────────────────────────

import { useState, useCallback, useMemo } from 'react';

/**
 * Hook pour gérer la fusion de presets.
 */
export function usePresetFusion(
  presets: CheNuPreset[],
  roles: UserRole[],
  phasePresets: Record<PhaseId, string>,
  projectPresets: ProjectPreset[],
  spherePresets: SpherePreset[]
) {
  const [context, setContext] = useState<PresetContext>({});
  const [dismissed, setDismissed] = useState(false);

  const resolution = useMemo(() => {
    if (dismissed) return undefined;
    return resolvePresetFusion(
      context,
      presets,
      roles,
      phasePresets,
      projectPresets,
      spherePresets
    );
  }, [context, presets, roles, phasePresets, projectPresets, spherePresets, dismissed]);

  const updateContext = useCallback((updates: Partial<PresetContext>) => {
    setContext((prev) => ({ ...prev, ...updates }));
    setDismissed(false); // Re-enable suggestions on context change
  }, []);

  const setManualPreset = useCallback((presetId: string) => {
    setContext((prev) => ({ ...prev, manualPresetId: presetId }));
  }, []);

  const clearManualPreset = useCallback(() => {
    setContext((prev) => {
      const { manualPresetId, ...rest } = prev;
      return rest;
    });
  }, []);

  const dismiss = useCallback(() => {
    setDismissed(true);
  }, []);

  const reset = useCallback(() => {
    setContext({});
    setDismissed(false);
  }, []);

  return {
    context,
    resolution,
    updateContext,
    setManualPreset,
    clearManualPreset,
    dismiss,
    reset,
    isDismissed: dismissed,
  };
}

// ─────────────────────────────────────────────────────────
// 7. RÈGLES D'OR DOCUMENTÉES
// ─────────────────────────────────────────────────────────

/**
 * RÈGLES D'OR DU SYSTÈME DE FUSION:
 * 
 * 1. Tous les presets sont suggestionnels
 *    → Jamais d'application automatique
 * 
 * 2. Le preset le plus spécifique gagne
 *    → Manuel > Projet > Sphère > Phase > Rôle
 * 
 * 3. Toujours expliquer le "pourquoi"
 *    → Traçabilité complète via reasons[]
 * 
 * 4. Jamais d'activation automatique
 *    → L'humain valide toujours
 * 
 * 5. Entièrement compatible 2D / XR
 *    → Même logique, affichage adapté
 */
export const FUSION_GOLDEN_RULES = [
  'Tous les presets sont suggestionnels',
  'Le preset le plus spécifique gagne',
  'Toujours expliquer le "pourquoi"',
  'Jamais d\'activation automatique',
  'Entièrement compatible 2D / XR',
] as const;
