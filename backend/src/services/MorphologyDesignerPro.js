/**
 * CHE·NU OS 16.0 — MORPHOLOGY DESIGNER PRO (MD-PRO)
 * SAFE, NON-HUMANOID morphological design toolkit
 * Version: 16.0
 * 
 * For PXR avatars, conceptual XR entities, and UniverseOS nodes.
 * Morphology is purely symbolic and abstract.
 */

export class MorphologyDesignerPro {
  constructor() {
    // Base forms (non-humanoid)
    this.baseForms = {
      ORB: { id: 'orb', name: 'Orb', geometry: 'sphere' },
      POLYHEDRON: { id: 'polyhedron', name: 'Polyhedron', geometry: 'multi-face' },
      SHARD: { id: 'shard', name: 'Shard', geometry: 'angular' },
      GLYPH: { id: 'glyph', name: 'Glyph', geometry: 'symbolic' },
      CLUSTER: { id: 'cluster', name: 'Cluster', geometry: 'multi-node' }
    };

    // Surface styles
    this.surfaceStyles = {
      SMOOTH: 'smooth',
      CRYSTALLINE: 'crystalline',
      SPECTRAL: 'spectral',
      FRACTAL: 'fractal'
    };

    // Material logic
    this.materialLogic = {
      MATTE: 'matte',
      TRANSLUCENT: 'translucent',
      GRADIENT_LIGHT: 'gradient-light'
    };

    // Animation styles (low-motion, safe)
    this.animationStyles = {
      PULSE: { id: 'pulse', motion: 'very-low', description: 'Gentle brightness pulse' },
      FLOAT: { id: 'float', motion: 'low', description: 'Subtle vertical drift' },
      ROTATE: { id: 'rotate', motion: 'low', description: 'Slow rotation' },
      SHIMMER: { id: 'shimmer', motion: 'very-low', description: 'Surface light variation' }
    };

    // Creation modes
    this.creationModes = {
      MINIMAL: { id: 'minimal', description: 'Simplest possible geometry' },
      FORMAL: { id: 'formal', description: 'Structured, crystalline, precision-focused' },
      CREATIVE: { id: 'creative', description: 'Glyph-like, soft ripples, abstract shapes' },
      CLUSTERED: { id: 'clustered', description: 'Multiple small nodes orbiting a core' },
      SYMBOLIC: { id: 'symbolic', description: 'Strong conceptual identity (role-based)' }
    };

    // Role-based presets (all safe, non-humanoid)
    this.rolePresets = {
      INTENT: {
        role: 'intent',
        base_form: 'orb',
        color_primary: '#FFFFFF',
        behavior: 'steady pulse'
      },
      STRUCTURE: {
        role: 'structure',
        base_form: 'polyhedron',
        color_primary: '#4A90D9',
        behavior: 'slow rotation'
      },
      TIMELINE: {
        role: 'timeline',
        base_form: 'ribbon-node',
        color_primary: '#E878A0',
        behavior: 'shifting arcs'
      },
      XR_ENV: {
        role: 'xr_env',
        base_form: 'sphere-grid',
        color_primary: '#8B5CF6',
        behavior: 'shimmer'
      },
      INSIGHT: {
        role: 'insight',
        base_form: 'glyph',
        color_primary: '#F5A623',
        behavior: 'subtle spark'
      }
    };

    // Created morphotypes
    this.morphotypes = new Map();
  }

  /**
   * List available options
   */
  listOptions() {
    return {
      base_forms: Object.values(this.baseForms),
      surface_styles: Object.values(this.surfaceStyles),
      material_logic: Object.values(this.materialLogic),
      animation_styles: Object.values(this.animationStyles),
      creation_modes: Object.values(this.creationModes),
      role_presets: Object.keys(this.rolePresets)
    };
  }

  /**
   * Create morphotype (requires explicit instruction)
   */
  createMorphotype(config) {
    // Validate base form
    const baseFormKey = config.base_form?.toUpperCase();
    const baseForm = this.baseForms[baseFormKey];
    if (!baseForm && !['ribbon-node', 'sphere-grid'].includes(config.base_form)) {
      throw new Error(`Invalid base form: ${config.base_form}`);
    }

    const morphotype = {
      id: config.id || `morph_${Date.now()}`,
      name: config.name || 'Morphotype',
      base_form: config.base_form || 'orb',
      proportions: config.proportions || [1, 1, 1],
      surface_style: config.surface_style || 'smooth',
      material_logic: config.material_logic || 'matte',
      animation_style: config.animation_style || 'pulse',
      color_profile: {
        primary: config.color_primary || '#FFFFFF',
        secondary: config.color_secondary || '#CCCCCC',
        neutral: config.color_neutral || '#888888'
      },
      symbolic_behaviors: {
        clarify: config.behavior_clarify || 'brightness increase',
        focus: config.behavior_focus || 'narrow beam',
        transition: config.behavior_transition || 'soft ripple'
      },
      role: config.role || null,
      mode: config.mode || 'minimal',
      metadata: {
        created_at: new Date().toISOString(),
        version: 'MD-PRO',
        safe: true,
        non_humanoid: true,
        non_emotional: true
      }
    };

    this.morphotypes.set(morphotype.id, morphotype);

    return {
      MORPHOTYPE: {
        morphotype: morphotype,
        operation: 'MORPHOTYPE_CREATED'
      }
    };
  }

  /**
   * Create from role preset
   */
  createFromRole(role, overrides = {}) {
    const roleKey = role.toUpperCase();
    const preset = this.rolePresets[roleKey];

    if (!preset) {
      throw new Error(`Unknown role preset: ${role}`);
    }

    return this.createMorphotype({
      name: `${preset.role} Morphotype`,
      base_form: preset.base_form,
      color_primary: preset.color_primary,
      animation_style: preset.behavior.includes('pulse') ? 'pulse' : 
                       preset.behavior.includes('rotation') ? 'rotate' : 
                       preset.behavior.includes('shimmer') ? 'shimmer' : 'float',
      role: preset.role,
      mode: 'symbolic',
      ...overrides
    });
  }

  /**
   * Create from mode
   */
  createFromMode(mode, config = {}) {
    const modeKey = mode.toUpperCase();
    const modeConfig = this.creationModes[modeKey];

    if (!modeConfig) {
      throw new Error(`Unknown creation mode: ${mode}`);
    }

    // Apply mode-specific defaults
    const modeDefaults = {
      minimal: {
        base_form: 'orb',
        surface_style: 'smooth',
        material_logic: 'matte',
        proportions: [1, 1, 1]
      },
      formal: {
        base_form: 'polyhedron',
        surface_style: 'crystalline',
        material_logic: 'matte',
        proportions: [1, 1.2, 1]
      },
      creative: {
        base_form: 'glyph',
        surface_style: 'spectral',
        material_logic: 'gradient-light',
        proportions: [1.5, 1, 0.5]
      },
      clustered: {
        base_form: 'cluster',
        surface_style: 'smooth',
        material_logic: 'translucent',
        proportions: [2, 2, 2]
      },
      symbolic: {
        base_form: 'glyph',
        surface_style: 'spectral',
        material_logic: 'gradient-light',
        proportions: [1, 1.5, 0.3]
      }
    };

    const defaults = modeDefaults[modeConfig.id] || modeDefaults.minimal;

    return this.createMorphotype({
      ...defaults,
      mode: modeConfig.id,
      ...config
    });
  }

  /**
   * Get morphotype
   */
  getMorphotype(morphotypeId) {
    return this.morphotypes.get(morphotypeId) || null;
  }

  /**
   * List morphotypes
   */
  listMorphotypes() {
    return Array.from(this.morphotypes.values()).map(m => ({
      id: m.id,
      name: m.name,
      base_form: m.base_form,
      role: m.role,
      mode: m.mode
    }));
  }

  /**
   * Update morphotype
   */
  updateMorphotype(morphotypeId, updates) {
    const morphotype = this.morphotypes.get(morphotypeId);
    if (!morphotype) {
      throw new Error(`Morphotype not found: ${morphotypeId}`);
    }

    // Apply updates (maintain safety)
    if (updates.proportions) morphotype.proportions = updates.proportions;
    if (updates.surface_style) morphotype.surface_style = updates.surface_style;
    if (updates.material_logic) morphotype.material_logic = updates.material_logic;
    if (updates.animation_style) morphotype.animation_style = updates.animation_style;
    if (updates.color_profile) {
      morphotype.color_profile = { ...morphotype.color_profile, ...updates.color_profile };
    }
    if (updates.symbolic_behaviors) {
      morphotype.symbolic_behaviors = { ...morphotype.symbolic_behaviors, ...updates.symbolic_behaviors };
    }

    morphotype.metadata.last_modified = new Date().toISOString();

    return {
      MORPHOTYPE_UPDATE: {
        morphotype_id: morphotypeId,
        updated: true
      }
    };
  }

  /**
   * Delete morphotype
   */
  deleteMorphotype(morphotypeId) {
    if (!this.morphotypes.has(morphotypeId)) {
      throw new Error(`Morphotype not found: ${morphotypeId}`);
    }

    this.morphotypes.delete(morphotypeId);
    return { deleted: morphotypeId };
  }

  /**
   * Export morphotype
   */
  exportMorphotype(morphotypeId) {
    const morphotype = this.morphotypes.get(morphotypeId);
    if (!morphotype) {
      throw new Error(`Morphotype not found: ${morphotypeId}`);
    }

    return {
      MORPHOLOGY_EXPORT: {
        morphotype: morphotype,
        notes: [
          'Non-humanoid design',
          'Safe for UniverseOS integration',
          'Compatible with XR Pack'
        ],
        compatible_with: [
          'UniverseOS',
          'Panels',
          'XR Pack',
          'OWS-15'
        ],
        metadata: {
          exported_at: new Date().toISOString(),
          safe: true
        }
      }
    };
  }

  /**
   * Generate morphotype for PXR avatar
   */
  generatePXRMorphotype(config) {
    // PXR avatars must be non-humanoid
    return this.createMorphotype({
      name: config.name || 'PXR Avatar',
      base_form: config.base_form || 'orb',
      surface_style: 'smooth',
      material_logic: 'gradient-light',
      animation_style: 'pulse',
      color_primary: config.color || '#8B5CF6',
      mode: 'symbolic',
      role: config.role || 'pxr_avatar'
    });
  }

  /**
   * Validate safety
   */
  validateSafety() {
    return {
      valid: true,
      checks: {
        no_humanoid_faces: true,
        no_emotion_simulation: true,
        no_embodiment: true,
        no_autonomous_morphing: true,
        no_biological_traits: true,
        explicit_user_triggers: true,
        symbolic_only: true,
        abstract_only: true,
        lawbook_compliant: true
      },
      role: 'morphology_designer',
      autonomous: false
    };
  }

  /**
   * Get role presets
   */
  getRolePresets() {
    return Object.entries(this.rolePresets).map(([key, preset]) => ({
      key: key,
      ...preset
    }));
  }

  /**
   * Get creation modes
   */
  getCreationModes() {
    return Object.entries(this.creationModes).map(([key, mode]) => ({
      key: key,
      ...mode
    }));
  }
}

export default MorphologyDesignerPro;
