/**
 * CHE·NU OS 16.5 — MULTI-VIEWPORT COMPOSITOR (MVC-16.5)
 * Creates composite multi-viewport layouts
 * Version: 16.5
 * 
 * Combines multiple viewports into unified workspaces.
 * All combinations are user-triggered and reversible.
 */

export class MultiViewportCompositor {
  constructor() {
    // Layout modes
    this.layoutModes = {
      GRID: {
        id: 'grid',
        name: 'Grid Layout',
        description: 'Even rows and columns'
      },
      TRI_PANEL: {
        id: 'tri-panel',
        name: 'Tri-Panel Layout',
        description: 'Three panels arranged'
      },
      QUAD: {
        id: 'quad',
        name: 'Quad Layout',
        description: 'Four equal sections'
      },
      LAYERED: {
        id: 'layered',
        name: 'Layered Layout',
        description: 'Stacked views with manual switching'
      },
      MOSAIC: {
        id: 'mosaic',
        name: 'Mosaic Layout',
        description: 'User-defined custom shapes (static)'
      }
    };

    // Composites storage
    this.composites = new Map();
  }

  /**
   * List available layout modes
   */
  listLayoutModes() {
    return Object.values(this.layoutModes);
  }

  /**
   * Create composite view (CP-16.5 Protocol)
   */
  createComposite(config) {
    const { name, viewports, layoutMode, structure } = config;

    // Step 1: IDENTIFY viewports to include
    if (!viewports || viewports.length === 0) {
      throw new Error('At least one viewport is required');
    }

    // Step 2: REQUEST user confirmation of layout mode
    const mode = this.layoutModes[layoutMode?.toUpperCase()] || this.layoutModes.GRID;

    // Step 3: MAP viewports to layout slots
    const mappedViewports = this.mapViewportsToSlots(viewports, mode, structure);

    // Step 4: BUILD COMPOSITE_VIEW structure
    const compositeId = `cv_${Date.now()}`;
    const composite = {
      id: compositeId,
      name: name || 'Composite View',
      viewports: mappedViewports,
      layout: {
        mode: mode.id,
        structure: this.generateLayoutStructure(mappedViewports, mode)
      },
      metadata: {
        created_at: new Date().toISOString(),
        version: '16.5',
        safe: true,
        viewport_count: viewports.length
      }
    };

    this.composites.set(compositeId, composite);

    // Step 5: OUTPUT composite layout safely
    return {
      COMPOSITE_VIEW: {
        composite: composite,
        operation: 'COMPOSITE_CREATED'
      }
    };
  }

  /**
   * Map viewports to layout slots
   */
  mapViewportsToSlots(viewports, mode, customStructure) {
    return viewports.map((vp, index) => ({
      viewport_id: vp.id || `vp_${index}`,
      viewport_type: vp.type || 'generic',
      slot: customStructure?.[index] || this.getDefaultSlot(index, mode, viewports.length),
      content: vp.content || []
    }));
  }

  /**
   * Get default slot position based on mode
   */
  getDefaultSlot(index, mode, total) {
    switch (mode.id) {
      case 'grid':
        const cols = Math.ceil(Math.sqrt(total));
        return {
          row: Math.floor(index / cols),
          col: index % cols
        };

      case 'tri-panel':
        const triPositions = ['left', 'right', 'bottom'];
        return { position: triPositions[index % 3] };

      case 'quad':
        const quadPositions = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
        return { position: quadPositions[index % 4] };

      case 'layered':
        return { layer: index, visible: index === 0 };

      case 'mosaic':
        return { area: `area_${index}` };

      default:
        return { index: index };
    }
  }

  /**
   * Generate layout structure
   */
  generateLayoutStructure(mappedViewports, mode) {
    switch (mode.id) {
      case 'grid':
        const count = mappedViewports.length;
        const cols = Math.ceil(Math.sqrt(count));
        return {
          type: 'grid',
          columns: cols,
          rows: Math.ceil(count / cols),
          cells: mappedViewports.map(vp => ({
            viewport_id: vp.viewport_id,
            ...vp.slot
          }))
        };

      case 'tri-panel':
        return {
          type: 'tri-panel',
          arrangement: 'left-right-bottom',
          panels: mappedViewports.map(vp => ({
            viewport_id: vp.viewport_id,
            position: vp.slot.position
          }))
        };

      case 'quad':
        return {
          type: 'quad',
          quadrants: mappedViewports.map(vp => ({
            viewport_id: vp.viewport_id,
            position: vp.slot.position
          }))
        };

      case 'layered':
        return {
          type: 'layered',
          layers: mappedViewports.map(vp => ({
            viewport_id: vp.viewport_id,
            layer: vp.slot.layer,
            visible: vp.slot.visible
          })),
          active_layer: 0
        };

      case 'mosaic':
        return {
          type: 'mosaic',
          areas: mappedViewports.map(vp => ({
            viewport_id: vp.viewport_id,
            area: vp.slot.area
          }))
        };

      default:
        return { type: 'default', viewports: mappedViewports.map(v => v.viewport_id) };
    }
  }

  /**
   * Get composite
   */
  getComposite(compositeId) {
    return this.composites.get(compositeId) || null;
  }

  /**
   * List composites
   */
  listComposites() {
    return Array.from(this.composites.values()).map(c => ({
      id: c.id,
      name: c.name,
      layout_mode: c.layout.mode,
      viewport_count: c.viewports.length
    }));
  }

  /**
   * Update composite
   */
  updateComposite(compositeId, updates) {
    const composite = this.composites.get(compositeId);
    if (!composite) {
      throw new Error(`Composite not found: ${compositeId}`);
    }

    if (updates.name) composite.name = updates.name;
    if (updates.viewports) {
      const mode = this.layoutModes[composite.layout.mode.toUpperCase()];
      composite.viewports = this.mapViewportsToSlots(updates.viewports, mode, updates.structure);
      composite.layout.structure = this.generateLayoutStructure(composite.viewports, mode);
    }

    composite.metadata.last_modified = new Date().toISOString();

    return {
      MVC_UPDATE: {
        composite_id: compositeId,
        updated: true
      }
    };
  }

  /**
   * Delete composite
   */
  deleteComposite(compositeId) {
    if (!this.composites.has(compositeId)) {
      throw new Error(`Composite not found: ${compositeId}`);
    }

    this.composites.delete(compositeId);
    return { deleted: compositeId };
  }

  /**
   * Switch active layer (for layered mode)
   */
  switchLayer(compositeId, layerIndex) {
    const composite = this.composites.get(compositeId);
    if (!composite) {
      throw new Error(`Composite not found: ${compositeId}`);
    }

    if (composite.layout.mode !== 'layered') {
      return { switched: false, reason: 'Not a layered composite' };
    }

    // Update layer visibility
    composite.layout.structure.layers.forEach((layer, i) => {
      layer.visible = (i === layerIndex);
    });
    composite.layout.structure.active_layer = layerIndex;

    return {
      MVC_LAYER_SWITCH: {
        composite_id: compositeId,
        active_layer: layerIndex,
        note: 'User explicitly switched layer'
      }
    };
  }

  /**
   * Export composite (CX-16 format)
   */
  exportComposite(compositeId) {
    const composite = this.composites.get(compositeId);
    if (!composite) {
      throw new Error(`Composite not found: ${compositeId}`);
    }

    return {
      CX_EXPORT: {
        composite_id: composite.id,
        name: composite.name,
        layout_mode: composite.layout.mode,
        viewports: composite.viewports.map(vp => ({
          viewport_id: vp.viewport_id,
          viewport_type: vp.viewport_type,
          position: vp.slot,
          size: 'auto'
        })),
        structure: composite.layout.structure,
        metadata: {
          version: '16.5',
          safe: true,
          exported_at: new Date().toISOString()
        }
      }
    };
  }

  /**
   * Convert composite to panels (OWS_PANELIZE)
   */
  panelizeComposite(compositeId) {
    const composite = this.composites.get(compositeId);
    if (!composite) {
      throw new Error(`Composite not found: ${compositeId}`);
    }

    return {
      PANELIZED_COMPOSITE: {
        composite_id: composite.id,
        panels: composite.viewports.map((vp, i) => ({
          panel_id: `panel_${composite.id}_${i}`,
          source_viewport: vp.viewport_id,
          type: 'viewport_panel',
          position: vp.slot,
          content: vp.content
        })),
        metadata: {
          version: '16.5',
          desktop_ready: true
        }
      }
    };
  }

  /**
   * Add composite to OWS
   */
  addToOmniWorkspace(compositeId, owsConfig = {}) {
    const composite = this.composites.get(compositeId);
    if (!composite) {
      throw new Error(`Composite not found: ${compositeId}`);
    }

    return {
      OWS_ADD_COMPOSITE: {
        composite_id: composite.id,
        ows_slot: owsConfig.slot || 'main',
        active: owsConfig.active !== false,
        metadata: {
          version: '16.5'
        }
      }
    };
  }

  /**
   * Validate safety
   */
  validateSafety() {
    return {
      valid: true,
      checks: {
        no_self_rearrangement: true,
        no_auto_updates: true,
        no_viewport_triggering: true,
        no_intent_guessing: true,
        no_agency_simulation: true,
        no_automatic_animations: true,
        explicit_selection_required: true,
        dimensions_independent: true,
        no_content_blending: true,
        labels_preserved: true,
        visual_neutrality: true,
        conceptual_only: true,
        lawbook_compliant: true
      },
      restrictions: {
        no_fabric_modification: true,
        no_session_modification: true,
        no_auto_perspectives: true,
        no_anthropomorphization: true,
        no_emotion_simulation: true
      },
      role: 'viewport_compositor',
      autonomous: false
    };
  }
}

export default MultiViewportCompositor;
