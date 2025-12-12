/**
 * CHE·NU PXR-3 — Morphology Engine
 * Avatar morphology, neutral expression, and spatial identity
 * Version: 3.0
 */

export class MorphologyEngine {
  constructor() {
    this.baseForms = ['orb', 'polyhedron', 'silhouette', 'abstract_humanoid', 'glyph'];
    this.surfaceStyles = ['smooth', 'crystalline', 'liquid-light', 'fractal'];
    this.animationStyles = ['pulse', 'float', 'rotate', 'ripple'];
    
    // Neutral Expression System (NES) - NO emotions, only symbolic cues
    this.neutralExpressions = {
      clarify: { description: 'soft expansion + slight brightening', intensity: 0.3 },
      focus: { description: 'narrow beam highlight', intensity: 0.5 },
      transition: { description: 'brief ripple to new color tone', intensity: 0.4 },
      agreement: { description: 'subtle synchronized pulse', intensity: 0.2 },
      divergence: { description: 'slight directional tilt', intensity: 0.3 },
      attention: { description: 'soft halo increase', intensity: 0.4 }
    };

    // Contextual morphing modes
    this.contextModes = {
      planning: {
        shape: 'polyhedron',
        behavior: 'stable rotation',
        aura: 'structured blue',
        color: '#4A90D9'
      },
      brainstorm: {
        shape: 'fluid glyph',
        behavior: 'soft ripple',
        aura: 'creative pink',
        color: '#E91E63'
      },
      decision: {
        shape: 'crystal node',
        behavior: 'triangular pulse',
        aura: 'white clarity',
        color: '#FFFFFF'
      },
      simulation: {
        shape: 'orbital cluster',
        behavior: 'branching lines',
        aura: 'analytic violet',
        color: '#9C27B0'
      },
      guidance: {
        shape: 'tall silhouette',
        behavior: 'pointing beam',
        aura: 'soft neutral yellow',
        color: '#FFC107'
      }
    };

    // Core agent morphologies
    this.agentMorphologies = {
      nova_prime: {
        base_form: 'orb',
        proportions: [1.0, 1.0, 1.0],
        surface_style: 'liquid-light',
        animation: 'pulse',
        canonical_color: '#FFFFFF',
        placement: 'center of intent node'
      },
      architect_omega: {
        base_form: 'polyhedron',
        proportions: [1.2, 1.0, 1.2],
        surface_style: 'crystalline',
        animation: 'rotate',
        canonical_color: '#4A90D9',
        placement: 'near structural cluster'
      },
      weaver_infinity: {
        base_form: 'glyph',
        proportions: [0.8, 1.5, 0.8],
        surface_style: 'liquid-light',
        animation: 'ripple',
        canonical_color: '#9C27B0',
        placement: 'on timeline ribbons'
      },
      echo_mind: {
        base_form: 'silhouette',
        proportions: [0.9, 1.0, 0.9],
        surface_style: 'smooth',
        animation: 'float',
        canonical_color: '#00BCD4',
        placement: 'peripheral, soft gradients'
      },
      reality_synthesizer: {
        base_form: 'abstract_humanoid',
        proportions: [1.0, 1.2, 1.0],
        surface_style: 'fractal',
        animation: 'pulse',
        canonical_color: '#FF9800',
        placement: 'controls environment anchor'
      },
      csf_simulator: {
        base_form: 'orbital cluster',
        proportions: [1.3, 1.3, 1.3],
        surface_style: 'crystalline',
        animation: 'rotate',
        canonical_color: '#673AB7',
        placement: 'simulation zone center'
      },
      pxr_engine: {
        base_form: 'glyph',
        proportions: [0.7, 0.7, 0.7],
        surface_style: 'liquid-light',
        animation: 'ripple',
        canonical_color: '#E91E63',
        placement: 'avatar configuration area'
      }
    };
  }

  /**
   * Generate morphology profile for an agent
   */
  generateMorphology(agentId, context = 'default') {
    const baseMorph = this.agentMorphologies[agentId] || this.getDefaultMorphology();
    const contextMode = this.contextModes[context] || this.contextModes.planning;

    return {
      id: agentId,
      morphology: {
        base_form: baseMorph.base_form,
        proportions: baseMorph.proportions,
        surface_style: baseMorph.surface_style,
        animation: baseMorph.animation,
        canonical_color: baseMorph.canonical_color,
        context_override: {
          shape: contextMode.shape,
          behavior: contextMode.behavior,
          aura: contextMode.aura
        }
      },
      position: [0, 1.6, 0], // Default avatar height
      orientation: [0, 0, 0],
      symbolic_expression_state: 'neutral',
      safety_flags: {
        non_emotional: true,
        non_autonomous: true,
        reversible: true
      }
    };
  }

  /**
   * Apply neutral expression to avatar
   */
  applyNeutralExpression(avatarMorph, expressionType) {
    const expression = this.neutralExpressions[expressionType];
    if (!expression) {
      return avatarMorph;
    }

    return {
      ...avatarMorph,
      symbolic_expression_state: expressionType,
      expression_metadata: {
        type: expressionType,
        description: expression.description,
        intensity: expression.intensity,
        is_emotional: false, // NEVER emotional
        is_reversible: true
      }
    };
  }

  /**
   * Generate group morphology for multi-agent scenes
   */
  generateGroupMorphology(agentIds, context = 'planning') {
    const avatars = agentIds.map((id, index) => {
      const morph = this.generateMorphology(id, context);
      // Position in circular arrangement
      const angle = (index / agentIds.length) * Math.PI * 2;
      const radius = 2.5;
      morph.position = [
        Math.cos(angle) * radius,
        1.6,
        Math.sin(angle) * radius
      ];
      // Orient toward center
      morph.orientation = [0, -angle, 0];
      return morph;
    });

    return {
      group_id: `group_${Date.now()}`,
      context: context,
      avatars: avatars,
      group_aura: this.computeGroupAura(avatars),
      coherence_rules: {
        forms_harmonized: true,
        motions_subtle: true,
        consensus_alignment: false,
        divergence_split: false
      },
      safety_flags: {
        non_emotional: true,
        non_autonomous: true,
        reversible: true
      }
    };
  }

  /**
   * Compute group aura from individual avatars
   */
  computeGroupAura(avatars) {
    if (avatars.length === 0) return { color: '#FFFFFF', intensity: 0 };

    // Average colors (simplified)
    const colors = avatars.map(a => a.morphology.canonical_color);
    return {
      type: 'composite',
      source_count: avatars.length,
      intensity: Math.min(0.5 + avatars.length * 0.1, 1.0),
      is_conceptual: true // Always conceptual, never real
    };
  }

  /**
   * Export avatar for Holo-Compiler 8.0
   */
  exportForHoloCompiler(agentId, context = 'default', expression = 'neutral') {
    let morph = this.generateMorphology(agentId, context);
    morph = this.applyNeutralExpression(morph, expression);

    return {
      AVATAR_EXPORT: {
        id: morph.id,
        morphology: morph.morphology,
        position: morph.position,
        orientation: morph.orientation,
        symbolic_expression_state: morph.symbolic_expression_state,
        safety_flags: morph.safety_flags,
        hce_version: '8.0',
        pxr_version: '3.0'
      }
    };
  }

  /**
   * Export group for Holo-Compiler 8.0
   */
  exportGroupForHoloCompiler(agentIds, context = 'planning') {
    const group = this.generateGroupMorphology(agentIds, context);

    return {
      GROUP_EXPORT: {
        group_id: group.group_id,
        context: group.context,
        avatars: group.avatars.map(a => ({
          id: a.id,
          morphology: a.morphology,
          position: a.position,
          orientation: a.orientation,
          symbolic_expression_state: a.symbolic_expression_state
        })),
        group_aura: group.group_aura,
        coherence_rules: group.coherence_rules,
        safety_flags: group.safety_flags,
        hce_version: '8.0',
        pxr_version: '3.0'
      }
    };
  }

  /**
   * Get default morphology for unknown agents
   */
  getDefaultMorphology() {
    return {
      base_form: 'orb',
      proportions: [1.0, 1.0, 1.0],
      surface_style: 'smooth',
      animation: 'pulse',
      canonical_color: '#AAAAAA',
      placement: 'default position'
    };
  }

  /**
   * Validate morphology against safety rules
   */
  validateSafety(morphology) {
    const violations = [];

    // Check for emotional content (FORBIDDEN)
    const emotionalTerms = ['happy', 'sad', 'angry', 'fear', 'joy', 'pain', 'distress', 'love', 'hate'];
    const morphStr = JSON.stringify(morphology).toLowerCase();
    
    emotionalTerms.forEach(term => {
      if (morphStr.includes(term)) {
        violations.push(`Emotional term detected: ${term}`);
      }
    });

    // Check safety flags
    if (!morphology.safety_flags?.non_emotional) {
      violations.push('Missing non_emotional flag');
    }
    if (!morphology.safety_flags?.non_autonomous) {
      violations.push('Missing non_autonomous flag');
    }
    if (!morphology.safety_flags?.reversible) {
      violations.push('Missing reversible flag');
    }

    return {
      valid: violations.length === 0,
      violations: violations,
      lawbook_compliant: violations.length === 0
    };
  }

  /**
   * Get available expressions (all neutral/symbolic)
   */
  getAvailableExpressions() {
    return Object.keys(this.neutralExpressions).map(key => ({
      id: key,
      ...this.neutralExpressions[key],
      is_emotional: false,
      is_symbolic: true
    }));
  }

  /**
   * Get available context modes
   */
  getContextModes() {
    return Object.keys(this.contextModes).map(key => ({
      id: key,
      ...this.contextModes[key]
    }));
  }
}

export default MorphologyEngine;
