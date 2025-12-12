/* =====================================================
   CHE·NU — Preset Resolver
   
   Unified preset resolution with priority chain:
   1. Manual preset (user explicitly selected)
   2. Project preset (project-specific assignment)
   3. Phase preset (lifecycle phase default)
   4. Role preset (user role default)
   5. System default
   
   This ensures the most specific context always wins.
   ===================================================== */

import { CheNuPreset } from '../presets/preset.types';
import { PhasePreset, AnyPhaseId } from '../phase/phasePreset.types';
import { ProjectPreset } from '../project/projectPreset.types';

// ─────────────────────────────────────────────────────
// RESOLVE CONTEXT
// ─────────────────────────────────────────────────────

/**
 * Context for preset resolution.
 */
export interface ResolvePresetContext {
  /** Manually selected preset (highest priority) */
  manualPresetId?: string;
  
  /** Active project ID */
  projectId?: string;
  
  /** Current phase */
  phase?: AnyPhaseId;
  
  /** Role-based preset suggestion */
  rolePresetId?: string;
  
  /** System default preset (lowest priority) */
  systemDefaultPresetId?: string;
}

/**
 * Resolution result with source tracking.
 */
export interface PresetResolution {
  /** Resolved preset (if found) */
  preset: CheNuPreset | undefined;
  
  /** Source of the resolution */
  source: 'manual' | 'project' | 'phase' | 'role' | 'system' | 'none';
  
  /** Priority that was applied */
  priority: number;
  
  /** Reason for this resolution */
  reason?: string;
}

// ─────────────────────────────────────────────────────
// CORE RESOLVER
// ─────────────────────────────────────────────────────

/**
 * Resolve the suggested preset based on context.
 * 
 * Priority order:
 * 1. Manual preset (100)
 * 2. Project preset (80)
 * 3. Phase preset (60)
 * 4. Role preset (40)
 * 5. System default (20)
 */
export function resolveSuggestedPreset(
  context: ResolvePresetContext,
  presets: CheNuPreset[],
  phasePresets: PhasePreset[],
  projectPresets: ProjectPreset[]
): CheNuPreset | undefined {
  const resolution = resolvePresetWithDetails(
    context,
    presets,
    phasePresets,
    projectPresets
  );
  
  return resolution.preset;
}

/**
 * Resolve preset with full details about the resolution.
 */
export function resolvePresetWithDetails(
  context: ResolvePresetContext,
  presets: CheNuPreset[],
  phasePresets: PhasePreset[],
  projectPresets: ProjectPreset[]
): PresetResolution {
  const getPreset = (id?: string) =>
    id ? presets.find(p => p.id === id) : undefined;

  // ─── 1. Manual preset (highest priority) ───
  if (context.manualPresetId) {
    const preset = getPreset(context.manualPresetId);
    if (preset) {
      return {
        preset,
        source: 'manual',
        priority: 100,
        reason: 'User manually selected this preset',
      };
    }
  }

  // ─── 2. Project preset ───
  if (context.projectId) {
    const projectPreset = projectPresets.find(
      p => p.projectId === context.projectId
    );
    if (projectPreset) {
      const preset = getPreset(projectPreset.presetId);
      if (preset) {
        return {
          preset,
          source: 'project',
          priority: projectPreset.priority ?? 80,
          reason: projectPreset.reason || `Assigned to project ${context.projectId}`,
        };
      }
    }
  }

  // ─── 3. Phase preset ───
  if (context.phase) {
    const phasePreset = phasePresets.find(
      p => p.phase === context.phase
    );
    if (phasePreset) {
      const preset = getPreset(phasePreset.presetId);
      if (preset) {
        return {
          preset,
          source: 'phase',
          priority: phasePreset.priority ?? 60,
          reason: phasePreset.reason || `Default for ${context.phase} phase`,
        };
      }
    }
  }

  // ─── 4. Role preset ───
  if (context.rolePresetId) {
    const preset = getPreset(context.rolePresetId);
    if (preset) {
      return {
        preset,
        source: 'role',
        priority: 40,
        reason: 'Default for user role',
      };
    }
  }

  // ─── 5. System default ───
  if (context.systemDefaultPresetId) {
    const preset = getPreset(context.systemDefaultPresetId);
    if (preset) {
      return {
        preset,
        source: 'system',
        priority: 20,
        reason: 'System default preset',
      };
    }
  }

  // ─── No resolution ───
  return {
    preset: undefined,
    source: 'none',
    priority: 0,
    reason: 'No preset could be resolved from context',
  };
}

// ─────────────────────────────────────────────────────
// CHAIN RESOLVER
// ─────────────────────────────────────────────────────

/**
 * Get all applicable presets in priority order.
 * Useful for showing alternatives or fallbacks.
 */
export function resolvePresetChain(
  context: ResolvePresetContext,
  presets: CheNuPreset[],
  phasePresets: PhasePreset[],
  projectPresets: ProjectPreset[]
): PresetResolution[] {
  const chain: PresetResolution[] = [];
  const getPreset = (id?: string) =>
    id ? presets.find(p => p.id === id) : undefined;

  // Manual
  if (context.manualPresetId) {
    const preset = getPreset(context.manualPresetId);
    if (preset) {
      chain.push({
        preset,
        source: 'manual',
        priority: 100,
        reason: 'User selection',
      });
    }
  }

  // Project
  if (context.projectId) {
    const projectPreset = projectPresets.find(
      p => p.projectId === context.projectId
    );
    if (projectPreset) {
      const preset = getPreset(projectPreset.presetId);
      if (preset) {
        chain.push({
          preset,
          source: 'project',
          priority: projectPreset.priority ?? 80,
          reason: projectPreset.reason || `Project: ${context.projectId}`,
        });
      }
    }
  }

  // Phase
  if (context.phase) {
    const phasePreset = phasePresets.find(
      p => p.phase === context.phase
    );
    if (phasePreset) {
      const preset = getPreset(phasePreset.presetId);
      if (preset) {
        chain.push({
          preset,
          source: 'phase',
          priority: phasePreset.priority ?? 60,
          reason: phasePreset.reason || `Phase: ${context.phase}`,
        });
      }
    }
  }

  // Role
  if (context.rolePresetId) {
    const preset = getPreset(context.rolePresetId);
    if (preset) {
      chain.push({
        preset,
        source: 'role',
        priority: 40,
        reason: 'Role default',
      });
    }
  }

  // System default
  if (context.systemDefaultPresetId) {
    const preset = getPreset(context.systemDefaultPresetId);
    if (preset) {
      chain.push({
        preset,
        source: 'system',
        priority: 20,
        reason: 'System default',
      });
    }
  }

  // Sort by priority descending
  return chain.sort((a, b) => b.priority - a.priority);
}

// ─────────────────────────────────────────────────────
// CONFLICT DETECTION
// ─────────────────────────────────────────────────────

/**
 * Check if there are conflicting preset suggestions.
 */
export function hasPresetConflict(
  context: ResolvePresetContext,
  presets: CheNuPreset[],
  phasePresets: PhasePreset[],
  projectPresets: ProjectPreset[]
): boolean {
  const chain = resolvePresetChain(context, presets, phasePresets, projectPresets);
  
  if (chain.length < 2) return false;
  
  // Check if different presets are suggested
  const uniquePresets = new Set(chain.map(r => r.preset?.id));
  return uniquePresets.size > 1;
}

/**
 * Get conflicting preset resolutions.
 */
export function getPresetConflicts(
  context: ResolvePresetContext,
  presets: CheNuPreset[],
  phasePresets: PhasePreset[],
  projectPresets: ProjectPreset[]
): PresetResolution[] {
  const chain = resolvePresetChain(context, presets, phasePresets, projectPresets);
  
  if (chain.length < 2) return [];
  
  // Return all resolutions that differ from the winner
  const winner = chain[0];
  return chain.filter(r => r.preset?.id !== winner.preset?.id);
}

// ─────────────────────────────────────────────────────
// UTILITY FUNCTIONS
// ─────────────────────────────────────────────────────

/**
 * Build context from available sources.
 */
export function buildResolveContext(options: {
  manualPresetId?: string;
  projectId?: string;
  phase?: AnyPhaseId;
  rolePresetId?: string;
  systemDefaultPresetId?: string;
}): ResolvePresetContext {
  return {
    manualPresetId: options.manualPresetId,
    projectId: options.projectId,
    phase: options.phase,
    rolePresetId: options.rolePresetId,
    systemDefaultPresetId: options.systemDefaultPresetId ?? 'focus',
  };
}

/**
 * Get priority label for display.
 */
export function getSourceLabel(
  source: PresetResolution['source'],
  locale: string = 'en'
): string {
  const labels: Record<string, Record<PresetResolution['source'], string>> = {
    en: {
      manual: 'Manual Selection',
      project: 'Project Default',
      phase: 'Phase Default',
      role: 'Role Default',
      system: 'System Default',
      none: 'No Preset',
    },
    'fr-CA': {
      manual: 'Sélection manuelle',
      project: 'Défaut du projet',
      phase: 'Défaut de la phase',
      role: 'Défaut du rôle',
      system: 'Défaut système',
      none: 'Aucun preset',
    },
  };
  
  return labels[locale]?.[source] || labels.en[source];
}

/**
 * Get source icon.
 */
export function getSourceIcon(source: PresetResolution['source']): string {
  const icons: Record<PresetResolution['source'], string> = {
    manual: '👆',
    project: '📁',
    phase: '⏱️',
    role: '👤',
    system: '⚙️',
    none: '❌',
  };
  
  return icons[source];
}
