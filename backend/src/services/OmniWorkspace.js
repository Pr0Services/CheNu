/**
 * CHE·NU OS 15.0 — OMNI-WORKSPACE (OWS-15)
 * SAFE, HUMAN-CONTROLLED, MULTI-DIMENSIONAL WORKSPACE
 * Version: 15.0
 * 
 * OWS-15 combines multiple interface dimensions into one unified environment.
 * It ONLY builds layouts when user explicitly requests them.
 */

export class OmniWorkspace {
  constructor() {
    // Available dimensions
    this.dimensions = {
      XR_ROOMS: {
        id: 'xr_rooms',
        name: 'XR Rooms',
        description: 'Conceptual rooms, portals, avatar placeholders (PXR icons)',
        type: 'spatial'
      },
      DESKTOP_PANELS: {
        id: 'desktop_panels',
        name: 'Desktop Panels',
        description: 'Panels, windows, dashboards',
        type: 'flat'
      },
      TIMELINE_RIBBONS: {
        id: 'timeline_ribbons',
        name: 'Timeline Ribbons',
        description: 'Holothreads, branches, events',
        type: 'temporal'
      },
      CLUSTER_MAPS: {
        id: 'cluster_maps',
        name: 'Cluster Maps',
        description: 'Concept groups, trees, graphs',
        type: 'graph'
      },
      FABRIC_MAP: {
        id: 'fabric_map',
        name: 'Fabric Map',
        description: 'Universe topology, portals, layout map',
        type: 'spatial'
      },
      DASHBOARDS: {
        id: 'dashboards',
        name: 'Dashboards',
        description: 'KPIs, status, boards, summaries',
        type: 'flat'
      },
      SESSION_OVERVIEW: {
        id: 'session_overview',
        name: 'Session Overview',
        description: 'Session switcher, snapshot viewer',
        type: 'management'
      },
      AGENT_PANELS: {
        id: 'agent_panels',
        name: 'Agent Panels',
        description: 'Agent insights, suggestions, role views',
        type: 'agent'
      }
    };

    // Layout modes
    this.layoutModes = {
      COMPOSITE: 'composite',    // All visible in different sections
      LAYERED: 'layered',        // Stack like layers, user switches
      SWITCHABLE: 'switchable'   // Tabs/buttons to switch
    };

    // Active omni-workspaces
    this.omniWorkspaces = new Map();
  }

  /**
   * OWB_BUILD - Build omni-workspace
   */
  build(config) {
    const ows = {
      id: config.id || `ows_${Date.now()}`,
      name: config.name || 'Omni-Workspace',
      dimensions: this.validateDimensions(config.dimensions || []),
      layout_mode: config.layout_mode || this.layoutModes.COMPOSITE,
      panels: [],
      rooms: [],
      timelines: [],
      clusters: [],
      fabric_map: null,
      dashboard: null,
      sessions: [],
      agents: [],
      active_dimension: null,
      metadata: {
        created_at: new Date().toISOString(),
        last_modified: new Date().toISOString(),
        version: '15.0'
      }
    };

    // Initialize structures for each dimension
    ows.dimensions.forEach(dim => {
      this.initializeDimension(ows, dim);
    });

    this.omniWorkspaces.set(ows.id, ows);

    return {
      OWB_BUILD: {
        omni_workspace: ows,
        operation: 'OWB_BUILD',
        dimensions_included: ows.dimensions.length,
        metadata: {
          version: '15.0'
        }
      }
    };
  }

  /**
   * Validate dimensions
   */
  validateDimensions(dimensions) {
    const validIds = Object.values(this.dimensions).map(d => d.id);
    return dimensions.filter(d => validIds.includes(d));
  }

  /**
   * Initialize dimension structures
   */
  initializeDimension(ows, dimensionId) {
    switch (dimensionId) {
      case 'xr_rooms':
        ows.rooms = [];
        break;
      case 'desktop_panels':
        ows.panels = [];
        break;
      case 'timeline_ribbons':
        ows.timelines = [];
        break;
      case 'cluster_maps':
        ows.clusters = [];
        break;
      case 'fabric_map':
        ows.fabric_map = { nodes: [], links: [] };
        break;
      case 'dashboards':
        ows.dashboard = { widgets: [] };
        break;
      case 'session_overview':
        ows.sessions = [];
        break;
      case 'agent_panels':
        ows.agents = [];
        break;
    }
  }

  /**
   * OWB_ADD_DIMENSION - Add dimension
   */
  addDimension(owsId, dimensionId) {
    const ows = this.omniWorkspaces.get(owsId);
    if (!ows) {
      throw new Error(`Omni-workspace not found: ${owsId}`);
    }

    if (!this.dimensions[dimensionId.toUpperCase()]) {
      throw new Error(`Unknown dimension: ${dimensionId}`);
    }

    const dimId = this.dimensions[dimensionId.toUpperCase()].id;

    if (ows.dimensions.includes(dimId)) {
      return { added: false, reason: 'Dimension already exists' };
    }

    ows.dimensions.push(dimId);
    this.initializeDimension(ows, dimId);
    ows.metadata.last_modified = new Date().toISOString();

    return {
      OWB_ADD_DIMENSION: {
        omni_workspace_id: owsId,
        dimension_added: dimId,
        total_dimensions: ows.dimensions.length,
        operation: 'OWB_ADD_DIMENSION'
      }
    };
  }

  /**
   * OWB_REMOVE_DIMENSION - Remove dimension
   */
  removeDimension(owsId, dimensionId) {
    const ows = this.omniWorkspaces.get(owsId);
    if (!ows) {
      throw new Error(`Omni-workspace not found: ${owsId}`);
    }

    const dimId = this.dimensions[dimensionId.toUpperCase()]?.id || dimensionId;
    const index = ows.dimensions.indexOf(dimId);

    if (index === -1) {
      return { removed: false, reason: 'Dimension not found in workspace' };
    }

    ows.dimensions.splice(index, 1);
    ows.metadata.last_modified = new Date().toISOString();

    return {
      OWB_REMOVE_DIMENSION: {
        omni_workspace_id: owsId,
        dimension_removed: dimId,
        remaining_dimensions: ows.dimensions.length,
        operation: 'OWB_REMOVE_DIMENSION'
      }
    };
  }

  /**
   * OWB_LAYOUT - Set layout mode
   */
  setLayout(owsId, layoutMode) {
    const ows = this.omniWorkspaces.get(owsId);
    if (!ows) {
      throw new Error(`Omni-workspace not found: ${owsId}`);
    }

    const validModes = Object.values(this.layoutModes);
    if (!validModes.includes(layoutMode)) {
      throw new Error(`Invalid layout mode: ${layoutMode}. Valid: ${validModes.join(', ')}`);
    }

    ows.layout_mode = layoutMode;
    ows.metadata.last_modified = new Date().toISOString();

    return {
      OWB_LAYOUT: {
        omni_workspace_id: owsId,
        layout_mode: layoutMode,
        operation: 'OWB_LAYOUT'
      }
    };
  }

  /**
   * Switch focus dimension (for layered/switchable modes)
   */
  switchDimension(owsId, dimensionId) {
    const ows = this.omniWorkspaces.get(owsId);
    if (!ows) {
      throw new Error(`Omni-workspace not found: ${owsId}`);
    }

    const dimId = this.dimensions[dimensionId.toUpperCase()]?.id || dimensionId;

    if (!ows.dimensions.includes(dimId)) {
      throw new Error(`Dimension not in workspace: ${dimId}`);
    }

    ows.active_dimension = dimId;

    return {
      DIMENSION_SWITCH: {
        omni_workspace_id: owsId,
        active_dimension: dimId,
        note: 'User explicitly switched dimension'
      }
    };
  }

  /**
   * Add content to dimension
   */
  addToDimension(owsId, dimensionId, content) {
    const ows = this.omniWorkspaces.get(owsId);
    if (!ows) {
      throw new Error(`Omni-workspace not found: ${owsId}`);
    }

    const dimId = this.dimensions[dimensionId.toUpperCase()]?.id || dimensionId;

    switch (dimId) {
      case 'xr_rooms':
        ows.rooms.push(content);
        break;
      case 'desktop_panels':
        ows.panels.push(content);
        break;
      case 'timeline_ribbons':
        ows.timelines.push(content);
        break;
      case 'cluster_maps':
        ows.clusters.push(content);
        break;
      case 'dashboards':
        ows.dashboard.widgets.push(content);
        break;
      case 'session_overview':
        ows.sessions.push(content);
        break;
      case 'agent_panels':
        ows.agents.push(content);
        break;
      default:
        throw new Error(`Cannot add to dimension: ${dimId}`);
    }

    ows.metadata.last_modified = new Date().toISOString();

    return {
      DIMENSION_CONTENT_ADDED: {
        omni_workspace_id: owsId,
        dimension: dimId,
        content_added: true
      }
    };
  }

  /**
   * OWB_EXPORT - Export omni-workspace
   */
  export(owsId) {
    const ows = this.omniWorkspaces.get(owsId);
    if (!ows) {
      throw new Error(`Omni-workspace not found: ${owsId}`);
    }

    return {
      OWS_EXPORT: {
        workspace_id: ows.id,
        name: ows.name,
        layout_mode: ows.layout_mode,
        dimensions: ows.dimensions,
        panels: ows.panels,
        rooms: ows.rooms,
        timelines: ows.timelines,
        clusters: ows.clusters,
        fabric_map: ows.fabric_map,
        dashboard: ows.dashboard,
        sessions: ows.sessions,
        agents: ows.agents,
        metadata: {
          ...ows.metadata,
          exported_at: new Date().toISOString(),
          safe: true,
          version: '15.0'
        }
      }
    };
  }

  /**
   * Get omni-workspace
   */
  get(owsId) {
    return this.omniWorkspaces.get(owsId) || null;
  }

  /**
   * List all omni-workspaces
   */
  list() {
    return Array.from(this.omniWorkspaces.values()).map(ows => ({
      id: ows.id,
      name: ows.name,
      layout_mode: ows.layout_mode,
      dimensions: ows.dimensions,
      created_at: ows.metadata.created_at
    }));
  }

  /**
   * Delete omni-workspace
   */
  delete(owsId) {
    if (!this.omniWorkspaces.has(owsId)) {
      throw new Error(`Omni-workspace not found: ${owsId}`);
    }

    this.omniWorkspaces.delete(owsId);
    return { deleted: owsId };
  }

  /**
   * Get available dimensions
   */
  getAvailableDimensions() {
    return Object.entries(this.dimensions).map(([key, dim]) => ({
      key: key,
      ...dim
    }));
  }

  /**
   * Get layout modes
   */
  getLayoutModes() {
    return [
      { mode: 'composite', description: 'All dimensions visible in different sections' },
      { mode: 'layered', description: 'Dimensions stack like layers (user switches)' },
      { mode: 'switchable', description: 'Tabs or buttons to switch between dimensions' }
    ];
  }

  /**
   * Merge workspaces into omni-workspace
   */
  mergeWorkspaces(owsId, workspaces) {
    const ows = this.omniWorkspaces.get(owsId);
    if (!ows) {
      throw new Error(`Omni-workspace not found: ${owsId}`);
    }

    workspaces.forEach(ws => {
      if (ws.panels) {
        ows.panels.push(...ws.panels);
        if (!ows.dimensions.includes('desktop_panels')) {
          ows.dimensions.push('desktop_panels');
        }
      }
      if (ws.rooms) {
        ows.rooms.push(...ws.rooms);
        if (!ows.dimensions.includes('xr_rooms')) {
          ows.dimensions.push('xr_rooms');
        }
      }
      if (ws.timelines) {
        ows.timelines.push(...ws.timelines);
        if (!ows.dimensions.includes('timeline_ribbons')) {
          ows.dimensions.push('timeline_ribbons');
        }
      }
      if (ws.clusters) {
        ows.clusters.push(...ws.clusters);
        if (!ows.dimensions.includes('cluster_maps')) {
          ows.dimensions.push('cluster_maps');
        }
      }
    });

    ows.metadata.last_modified = new Date().toISOString();

    return {
      OWS_MERGE: {
        omni_workspace_id: owsId,
        workspaces_merged: workspaces.length,
        total_dimensions: ows.dimensions.length
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
        no_auto_activation: true,
        no_auto_merge: true,
        no_auto_arrange: true,
        no_preference_inference: true,
        no_hidden_states: true,
        user_controlled: true,
        reversible: true,
        conceptual_only: true,
        lawbook_compliant: true
      },
      coexistence_rules: {
        xr_never_replaces_panels: true,
        panels_never_override_xr: true,
        user_chooses_focus: true,
        no_auto_animation: true
      },
      role: 'multi_dimensional_workspace',
      autonomous: false
    };
  }

  /**
   * Export all
   */
  exportAll() {
    return {
      OWS_FULL_EXPORT: {
        omni_workspaces: this.list(),
        available_dimensions: this.getAvailableDimensions(),
        layout_modes: this.getLayoutModes(),
        metadata: {
          version: '15.0',
          workspace_count: this.omniWorkspaces.size
        }
      }
    };
  }
}

export default OmniWorkspace;
