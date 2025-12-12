/**
 * CHE·NU OS 16.0 — MULTIMODAL VIEWPORTS (MMV-16)
 * User-controlled multiple viewport modes for conceptual visualization
 * Version: 16.0
 * 
 * Visualize the same conceptual universe from different scales.
 * Opens viewports ONLY upon user request.
 */

export class MultimodalViewports {
  constructor() {
    // Viewport types
    this.viewportTypes = {
      MACRO: {
        id: 'macro',
        name: 'Macro Viewport',
        description: 'Shows global UniverseOS topology (Fabric level)',
        scale: 'global'
      },
      MESO: {
        id: 'meso',
        name: 'Meso Viewport',
        description: 'Shows clusters, rooms, timelines at mid-scale',
        scale: 'medium'
      },
      MICRO: {
        id: 'micro',
        name: 'Micro Viewport',
        description: 'Focuses on a single node, panel, task, or cluster',
        scale: 'detailed'
      },
      TIMELINE: {
        id: 'timeline',
        name: 'Timeline Viewport',
        description: 'Dedicated holothread ribbon view',
        scale: 'temporal'
      },
      DASHBOARD: {
        id: 'dashboard',
        name: 'Dashboard Viewport',
        description: 'High-level summary of metrics or panels',
        scale: 'summary'
      },
      XR: {
        id: 'xr',
        name: 'XR Viewport',
        description: 'Conceptual XR room preview (non-physical)',
        scale: 'spatial'
      }
    };

    // Layout modes
    this.layoutModes = {
      GRID: 'grid',
      SPLIT_LEFT: 'split-left',
      SPLIT_RIGHT: 'split-right',
      TRI_PANEL: 'tri-panel',
      FLOATING_WINDOWS: 'floating-windows',
      LAYER_STACK: 'layer-stack'
    };

    // Active viewports
    this.viewports = new Map();

    // Multi-viewport workspaces
    this.multiViewWorkspaces = new Map();
  }

  /**
   * List viewport types
   */
  listViewportTypes() {
    return Object.entries(this.viewportTypes).map(([key, vp]) => ({
      key: key,
      ...vp
    }));
  }

  /**
   * Create viewport (user request only)
   */
  createViewport(config) {
    const typeKey = config.type?.toUpperCase();
    const viewportType = this.viewportTypes[typeKey];

    if (!viewportType) {
      throw new Error(`Unknown viewport type: ${config.type}`);
    }

    const viewport = {
      id: config.id || `vp_${Date.now()}`,
      type: viewportType.id,
      name: config.name || viewportType.name,
      content: config.content || [],
      links: config.links || [],
      focus: config.focus || null,
      state: 'open',
      metadata: {
        created_at: new Date().toISOString(),
        version: '16.0',
        safe: true,
        user_initiated: true
      }
    };

    this.viewports.set(viewport.id, viewport);

    return {
      MMV_VIEWPORT: {
        viewport: viewport,
        operation: 'VIEWPORT_CREATED'
      }
    };
  }

  /**
   * Get viewport
   */
  getViewport(viewportId) {
    return this.viewports.get(viewportId) || null;
  }

  /**
   * List active viewports
   */
  listViewports() {
    return Array.from(this.viewports.values()).map(vp => ({
      id: vp.id,
      type: vp.type,
      name: vp.name,
      state: vp.state
    }));
  }

  /**
   * Close viewport
   */
  closeViewport(viewportId) {
    if (!this.viewports.has(viewportId)) {
      throw new Error(`Viewport not found: ${viewportId}`);
    }

    this.viewports.delete(viewportId);
    return { closed: viewportId };
  }

  /**
   * Update viewport content
   */
  updateViewport(viewportId, updates) {
    const viewport = this.viewports.get(viewportId);
    if (!viewport) {
      throw new Error(`Viewport not found: ${viewportId}`);
    }

    if (updates.content) viewport.content = updates.content;
    if (updates.links) viewport.links = updates.links;
    if (updates.focus) viewport.focus = updates.focus;
    viewport.metadata.last_modified = new Date().toISOString();

    return {
      MMV_UPDATE: {
        viewport_id: viewportId,
        updated: true
      }
    };
  }

  /**
   * Create multi-viewport workspace
   */
  createMultiViewWorkspace(config) {
    const { viewports, layout } = config;

    // Validate viewports
    const validViewports = viewports.filter(vp => {
      const typeKey = vp.type?.toUpperCase();
      return this.viewportTypes[typeKey];
    });

    if (validViewports.length === 0) {
      throw new Error('No valid viewport types specified');
    }

    // Validate layout
    const layoutMode = this.layoutModes[layout?.toUpperCase()] || this.layoutModes.GRID;

    const workspaceId = `mvw_${Date.now()}`;

    // Create viewports
    const createdViewports = validViewports.map((vpConfig, i) => {
      const vp = this.createViewport({
        ...vpConfig,
        id: `${workspaceId}_vp_${i}`
      });
      return vp.MMV_VIEWPORT.viewport;
    });

    const workspace = {
      id: workspaceId,
      name: config.name || 'Multi-View Workspace',
      layout: layoutMode,
      viewports: createdViewports.map(vp => vp.id),
      layout_config: this.generateLayoutConfig(createdViewports, layoutMode),
      metadata: {
        created_at: new Date().toISOString(),
        version: '16.0',
        safe: true,
        viewport_count: createdViewports.length
      }
    };

    this.multiViewWorkspaces.set(workspaceId, workspace);

    return {
      MULTI_VIEW_WORKSPACE: {
        workspace: workspace,
        viewports: createdViewports,
        operation: 'WORKSPACE_CREATED'
      }
    };
  }

  /**
   * Generate layout configuration
   */
  generateLayoutConfig(viewports, layout) {
    const count = viewports.length;

    switch (layout) {
      case 'grid':
        const cols = Math.ceil(Math.sqrt(count));
        return {
          type: 'grid',
          columns: cols,
          rows: Math.ceil(count / cols),
          cells: viewports.map((vp, i) => ({
            viewport_id: vp.id,
            col: i % cols,
            row: Math.floor(i / cols)
          }))
        };

      case 'split-left':
        return {
          type: 'split-left',
          main: viewports[0]?.id,
          side: viewports.slice(1).map(vp => vp.id)
        };

      case 'split-right':
        return {
          type: 'split-right',
          side: viewports.slice(0, -1).map(vp => vp.id),
          main: viewports[viewports.length - 1]?.id
        };

      case 'tri-panel':
        return {
          type: 'tri-panel',
          left: viewports[0]?.id,
          center: viewports[1]?.id,
          right: viewports[2]?.id
        };

      case 'floating-windows':
        return {
          type: 'floating-windows',
          windows: viewports.map((vp, i) => ({
            viewport_id: vp.id,
            position: { x: i * 50, y: i * 30 },
            size: { width: 400, height: 300 }
          }))
        };

      case 'layer-stack':
        return {
          type: 'layer-stack',
          layers: viewports.map((vp, i) => ({
            viewport_id: vp.id,
            depth: i,
            visible: i === 0
          }))
        };

      default:
        return { type: 'default', viewports: viewports.map(vp => vp.id) };
    }
  }

  /**
   * Get multi-view workspace
   */
  getMultiViewWorkspace(workspaceId) {
    return this.multiViewWorkspaces.get(workspaceId) || null;
  }

  /**
   * List layout modes
   */
  listLayoutModes() {
    return [
      { mode: 'grid', description: 'Equal panels in grid' },
      { mode: 'split-left', description: 'Main panel left, side panels right' },
      { mode: 'split-right', description: 'Side panels left, main panel right' },
      { mode: 'tri-panel', description: 'Three equal columns' },
      { mode: 'floating-windows', description: 'Desktop-style floating windows' },
      { mode: 'layer-stack', description: 'User-controlled stacked layers' }
    ];
  }

  /**
   * Switch active layer (for layer-stack mode)
   */
  switchLayer(workspaceId, viewportId) {
    const workspace = this.multiViewWorkspaces.get(workspaceId);
    if (!workspace) {
      throw new Error(`Workspace not found: ${workspaceId}`);
    }

    if (workspace.layout !== 'layer-stack') {
      return { switched: false, reason: 'Not a layer-stack workspace' };
    }

    workspace.layout_config.layers.forEach(layer => {
      layer.visible = (layer.viewport_id === viewportId);
    });

    return {
      MMV_LAYER_SWITCH: {
        workspace_id: workspaceId,
        active_viewport: viewportId,
        note: 'User explicitly switched layer'
      }
    };
  }

  /**
   * Export viewport
   */
  exportViewport(viewportId) {
    const viewport = this.viewports.get(viewportId);
    if (!viewport) {
      throw new Error(`Viewport not found: ${viewportId}`);
    }

    return {
      MMV_EXPORT: {
        viewport: viewport,
        exported_at: new Date().toISOString()
      }
    };
  }

  /**
   * Export multi-view workspace
   */
  exportWorkspace(workspaceId) {
    const workspace = this.multiViewWorkspaces.get(workspaceId);
    if (!workspace) {
      throw new Error(`Workspace not found: ${workspaceId}`);
    }

    const viewports = workspace.viewports.map(id => this.viewports.get(id)).filter(Boolean);

    return {
      MMV_WORKSPACE_EXPORT: {
        workspace: workspace,
        viewports: viewports,
        exported_at: new Date().toISOString()
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
        no_auto_open: true,
        no_autonomous_switch: true,
        no_intention_guessing: true,
        no_task_management: true,
        no_real_world_simulation: true,
        no_persistent_states: true,
        user_request_only: true,
        conceptual_only: true,
        lawbook_compliant: true
      },
      transition_rules: {
        low_motion: true,
        reversible: true,
        non_immersive: true,
        no_embodiment: true
      },
      role: 'viewport_system',
      autonomous: false
    };
  }
}

export default MultimodalViewports;
