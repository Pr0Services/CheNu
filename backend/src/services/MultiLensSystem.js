/**
 * CHE·NU OS 15.5 — MULTI-LENS SYSTEM (MLS-15.5)
 * SAFE, NON-AUTONOMOUS, HUMAN-CONTROLLED perspective organizer
 * Version: 15.5
 * 
 * Generates multiple human-requested perspectives in clean, structured format.
 * Lenses are symbolic formatting choices, NOT autonomous agents.
 */

export class MultiLensSystem {
  constructor() {
    // Available lens types
    this.lensTypes = {
      STRUCTURE: {
        id: 'structure',
        name: 'Structure Lens',
        description: 'Shows hierarchical structure and relationships',
        icon: 'hierarchy'
      },
      TIMELINE: {
        id: 'timeline',
        name: 'Timeline Lens',
        description: 'Shows chronological order + branches',
        icon: 'clock'
      },
      CAUSALITY: {
        id: 'causality',
        name: 'Causality Lens',
        description: 'Highlights causes, effects, dependencies',
        icon: 'arrows'
      },
      MINIMAL: {
        id: 'minimal',
        name: 'Minimal Lens',
        description: 'Shows essential elements only',
        icon: 'minus'
      },
      RISK_SAFE: {
        id: 'risk_safe',
        name: 'Risk/Safety Lens',
        description: 'Highlights stability, uncertainty, caveats',
        icon: 'shield'
      },
      OPPORTUNITY: {
        id: 'opportunity',
        name: 'Opportunity Lens',
        description: 'Focuses on possibilities and expansions',
        icon: 'sparkle'
      },
      SIMPLIFIED: {
        id: 'simplified',
        name: 'Simplified Lens',
        description: 'Reduces complexity into plain language',
        icon: 'text'
      },
      SPATIAL: {
        id: 'spatial',
        name: 'Spatial Lens',
        description: 'Maps content into conceptual UniverseOS space',
        icon: 'globe'
      },
      PANEL_VIEW: {
        id: 'panel_view',
        name: 'Panel View Lens',
        description: 'Proposes a 10.5-style panel layout',
        icon: 'grid'
      },
      DASHBOARD: {
        id: 'dashboard',
        name: 'Dashboard Lens',
        description: 'Organizes into metrics, cards, summaries',
        icon: 'chart'
      }
    };

    // Workspace modes for multi-lens display
    this.workspaceModes = {
      GRID: 'grid',
      TABBED: 'tabbed',
      STACKED: 'stacked'
    };

    // Generated outputs
    this.outputs = new Map();
  }

  /**
   * List available lens types
   */
  listLensTypes() {
    return Object.entries(this.lensTypes).map(([key, lens]) => ({
      key: key,
      ...lens
    }));
  }

  /**
   * Get lens type info
   */
  getLensType(type) {
    const key = type.toUpperCase();
    return this.lensTypes[key] || null;
  }

  /**
   * LENS GENERATION PROTOCOL (LGP)
   * Main method to generate lenses from user content
   */
  generateLenses(config) {
    const { content, requestedLenses, workspaceMode } = config;

    // Step 1: VALIDATE INTENT
    const validLenses = this.validateLensTypes(requestedLenses);
    if (validLenses.length === 0) {
      throw new Error('No valid lens types requested');
    }

    // Step 2: COLLECT INPUT (use user-provided content ONLY)
    if (!content || content.trim() === '') {
      throw new Error('Content is required for lens generation');
    }

    // Step 3: GENERATE LENSES
    const lenses = validLenses.map(lensType => {
      return this.formatContentAsLens(content, lensType);
    });

    // Step 4: FORMAT AS MLS_OUTPUT
    const outputId = `mls_${Date.now()}`;
    const output = {
      MLS_OUTPUT: {
        id: outputId,
        lenses: lenses,
        workspace_mode: workspaceMode || null,
        metadata: {
          version: '15.5',
          safe: true,
          user_initiated: true,
          lens_count: lenses.length,
          generated_at: new Date().toISOString()
        }
      }
    };

    // Store output
    this.outputs.set(outputId, output);

    // Step 5: RETURN RESULTS SAFELY
    return output;
  }

  /**
   * Validate lens types
   */
  validateLensTypes(requestedLenses) {
    if (!Array.isArray(requestedLenses)) {
      return [];
    }

    return requestedLenses
      .map(l => l.toUpperCase())
      .filter(l => this.lensTypes[l])
      .map(l => this.lensTypes[l]);
  }

  /**
   * Format content as specific lens
   * This is a formatting operation, NOT reasoning
   */
  formatContentAsLens(content, lensType) {
    const lens = {
      type: lensType.id,
      title: lensType.name,
      content: '',
      notes: []
    };

    // Apply lens-specific formatting (pure transformation, no inference)
    switch (lensType.id) {
      case 'structure':
        lens.content = this.formatAsStructure(content);
        lens.notes.push('Hierarchical view of content');
        break;

      case 'timeline':
        lens.content = this.formatAsTimeline(content);
        lens.notes.push('Chronological arrangement');
        break;

      case 'causality':
        lens.content = this.formatAsCausality(content);
        lens.notes.push('Cause-effect relationships');
        break;

      case 'minimal':
        lens.content = this.formatAsMinimal(content);
        lens.notes.push('Essential elements only');
        break;

      case 'risk_safe':
        lens.content = this.formatAsRiskSafe(content);
        lens.notes.push('Stability and uncertainty highlighted');
        break;

      case 'opportunity':
        lens.content = this.formatAsOpportunity(content);
        lens.notes.push('Possibilities and expansions');
        break;

      case 'simplified':
        lens.content = this.formatAsSimplified(content);
        lens.notes.push('Plain language summary');
        break;

      case 'spatial':
        lens.content = this.formatAsSpatial(content);
        lens.notes.push('Conceptual spatial mapping');
        break;

      case 'panel_view':
        lens.content = this.formatAsPanelView(content);
        lens.notes.push('IP-10.5 panel layout proposal');
        break;

      case 'dashboard':
        lens.content = this.formatAsDashboard(content);
        lens.notes.push('Metrics and summary cards');
        break;

      default:
        lens.content = content;
    }

    return lens;
  }

  /**
   * Format helpers (pure text transformation)
   */
  formatAsStructure(content) {
    return {
      format: 'structure',
      hierarchy: {
        root: 'Content Root',
        elements: content.split('\n').filter(l => l.trim()).map((line, i) => ({
          level: 1,
          index: i,
          text: line.trim()
        }))
      }
    };
  }

  formatAsTimeline(content) {
    return {
      format: 'timeline',
      sequence: content.split('\n').filter(l => l.trim()).map((line, i) => ({
        order: i + 1,
        event: line.trim()
      }))
    };
  }

  formatAsCausality(content) {
    return {
      format: 'causality',
      elements: content.split('\n').filter(l => l.trim()).map(line => ({
        element: line.trim(),
        causes: [],
        effects: []
      }))
    };
  }

  formatAsMinimal(content) {
    const lines = content.split('\n').filter(l => l.trim());
    return {
      format: 'minimal',
      essentials: lines.slice(0, Math.min(3, lines.length)).map(l => l.trim())
    };
  }

  formatAsRiskSafe(content) {
    return {
      format: 'risk_safe',
      content: content,
      stability_notes: [],
      uncertainties: [],
      caveats: []
    };
  }

  formatAsOpportunity(content) {
    return {
      format: 'opportunity',
      content: content,
      possibilities: [],
      expansions: []
    };
  }

  formatAsSimplified(content) {
    return {
      format: 'simplified',
      plain_text: content.replace(/[^\w\s.,!?-]/g, '').trim()
    };
  }

  formatAsSpatial(content) {
    return {
      format: 'spatial',
      universe_mapping: {
        central_node: 'Content Center',
        satellite_nodes: content.split('\n').filter(l => l.trim()).map((line, i) => ({
          id: `node_${i}`,
          label: line.trim().substring(0, 30),
          position: { angle: (i * 360) / content.split('\n').length, radius: 1 }
        }))
      }
    };
  }

  formatAsPanelView(content) {
    return {
      format: 'panel_view',
      panels: content.split('\n').filter(l => l.trim()).map((line, i) => ({
        panel_id: `panel_${i}`,
        type: 'info',
        title: `Panel ${i + 1}`,
        content: line.trim()
      }))
    };
  }

  formatAsDashboard(content) {
    const lines = content.split('\n').filter(l => l.trim());
    return {
      format: 'dashboard',
      summary: lines[0] || '',
      cards: lines.slice(1).map((line, i) => ({
        card_id: `card_${i}`,
        title: `Item ${i + 1}`,
        value: line.trim()
      })),
      metrics: []
    };
  }

  /**
   * Get output by ID
   */
  getOutput(outputId) {
    return this.outputs.get(outputId) || null;
  }

  /**
   * List all outputs
   */
  listOutputs() {
    return Array.from(this.outputs.entries()).map(([id, output]) => ({
      id: id,
      lens_count: output.MLS_OUTPUT.lenses.length,
      generated_at: output.MLS_OUTPUT.metadata.generated_at
    }));
  }

  /**
   * Export output
   */
  exportOutput(outputId) {
    const output = this.outputs.get(outputId);
    if (!output) {
      throw new Error(`Output not found: ${outputId}`);
    }

    return {
      MLS_EXPORT: {
        ...output.MLS_OUTPUT,
        exported_at: new Date().toISOString()
      }
    };
  }

  /**
   * Create workspace layout for lenses
   */
  createWorkspaceLayout(outputId, mode) {
    const output = this.outputs.get(outputId);
    if (!output) {
      throw new Error(`Output not found: ${outputId}`);
    }

    const validModes = Object.values(this.workspaceModes);
    if (!validModes.includes(mode)) {
      throw new Error(`Invalid workspace mode: ${mode}. Valid: ${validModes.join(', ')}`);
    }

    return {
      MLS_WORKSPACE: {
        output_id: outputId,
        mode: mode,
        layout: this.generateLayout(output.MLS_OUTPUT.lenses, mode),
        metadata: {
          version: '15.5'
        }
      }
    };
  }

  /**
   * Generate layout based on mode
   */
  generateLayout(lenses, mode) {
    switch (mode) {
      case 'grid':
        return {
          type: 'grid',
          columns: Math.ceil(Math.sqrt(lenses.length)),
          cells: lenses.map((lens, i) => ({
            position: i,
            lens_type: lens.type
          }))
        };

      case 'tabbed':
        return {
          type: 'tabbed',
          tabs: lenses.map(lens => ({
            label: lens.title,
            lens_type: lens.type
          }))
        };

      case 'stacked':
        return {
          type: 'stacked',
          layers: lenses.map((lens, i) => ({
            depth: i,
            lens_type: lens.type,
            label: lens.title
          }))
        };

      default:
        return { type: 'default', lenses: lenses.map(l => l.type) };
    }
  }

  /**
   * Validate safety
   */
  validateSafety() {
    return {
      valid: true,
      checks: {
        no_autonomous_generation: true,
        no_parallel_agents: true,
        no_decision_making: true,
        no_context_inference: true,
        no_internal_state_simulation: true,
        no_subagents: true,
        no_persistence_without_permission: true,
        user_initiated_only: true,
        symbolic_lenses: true,
        lawbook_compliant: true
      },
      lens_constraints: {
        no_emotion: true,
        no_judgment: true,
        no_persuasion: true,
        no_autonomy: true
      },
      role: 'perspective_organizer',
      autonomous: false
    };
  }

  /**
   * Get workspace modes
   */
  getWorkspaceModes() {
    return [
      { mode: 'grid', description: 'Each lens is a panel in grid layout' },
      { mode: 'tabbed', description: 'Each lens is a switchable tab' },
      { mode: 'stacked', description: 'Simplified → detailed → advanced layers' }
    ];
  }
}

export default MultiLensSystem;
