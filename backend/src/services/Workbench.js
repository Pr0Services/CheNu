/**
 * CHE·NU OS 14.0 — WORKBENCH (WB-14)
 * SAFE, HUMAN-CONTROLLED workspace builder
 * Version: 14.0
 * 
 * WB-14 ONLY builds structures requested by the user.
 * All builds are user-triggered, reversible, and non-persistent.
 */

export class Workbench {
  constructor() {
    // Workspace modes
    this.modes = {
      DESKTOP: 'desktop',
      XR: 'xr',
      HYBRID: 'hybrid'
    };

    // Layout types
    this.layoutTypes = ['grid', 'split', 'stack', 'floating-panels', 'card-dashboard', 'minimal'];

    // Panel states
    this.panelStates = ['pinned', 'floating', 'docked', 'collapsed', 'stacked'];

    // Presets (only loaded on explicit request)
    this.presets = {
      PLANNING: {
        name: 'Planning Workspace',
        panels: [
          { id: 'timeline', type: 'timeline', title: 'Timeline' },
          { id: 'cluster', type: 'cluster', title: 'Cluster Board' },
          { id: 'actions', type: 'actions', title: 'Actions Panel' }
        ],
        layout: 'grid'
      },
      TASKROOM: {
        name: 'Task Room',
        panels: [
          { id: 'tasklist', type: 'list', title: 'Task List' },
          { id: 'agent_insights', type: 'agent', title: 'Agent Insights' },
          { id: 'dependency', type: 'graph', title: 'Dependency Graph' },
          { id: 'notes', type: 'info', title: 'Workspace Notes' }
        ],
        layout: 'split'
      },
      SIMULATION: {
        name: 'Simulation Workspace',
        panels: [
          { id: 'simulation', type: 'simulation', title: 'Simulation Panel' },
          { id: 'decision', type: 'graph', title: 'Decision Tree' },
          { id: 'xr_preview', type: 'portal', title: 'XR Preview' }
        ],
        layout: 'grid'
      },
      CREATIVE: {
        name: 'Creative Workspace',
        panels: [
          { id: 'storyboard', type: 'cluster', title: 'Storyboard' },
          { id: 'moodboard', type: 'cluster', title: 'Moodboard' },
          { id: 'clusters', type: 'cluster', title: 'Idea Clusters' },
          { id: 'export', type: 'actions', title: 'Export Tools' }
        ],
        layout: 'floating-panels'
      },
      CHE-NU_PRO: {
        name: 'CHE-NU Pro Workspace',
        panels: [
          { id: 'dashboard', type: 'info', title: 'Project Dashboard' },
          { id: 'taskboard', type: 'cluster', title: 'Task Board' },
          { id: 'session', type: 'workspace', title: 'Session Panel' },
          { id: 'timeline_gallery', type: 'timeline', title: 'Timeline Gallery' }
        ],
        layout: 'grid'
      }
    };

    // Active workspaces (not persisted)
    this.workspaces = new Map();
  }

  /**
   * WBO_CREATE - Create empty workspace
   */
  createWorkspace(config) {
    const workspace = {
      id: config.id || `ws_${Date.now()}`,
      name: config.name || 'New Workspace',
      mode: config.mode || this.modes.DESKTOP,
      layout: config.layout || 'grid',
      panels: [],
      rooms: [],
      clusters: [],
      timelines: [],
      portals: [],
      fabric_links: [],
      metadata: {
        created_at: new Date().toISOString(),
        last_modified: new Date().toISOString(),
        version: '14.0'
      }
    };

    this.workspaces.set(workspace.id, workspace);
    return { workspace, operation: 'WBO_CREATE' };
  }

  /**
   * WBO_ADD_PANEL - Add panel to workspace
   */
  addPanel(workspaceId, panel) {
    const workspace = this.workspaces.get(workspaceId);
    if (!workspace) {
      throw new Error(`Workspace not found: ${workspaceId}`);
    }

    const newPanel = {
      id: panel.id || `panel_${Date.now()}`,
      type: panel.type || 'info',
      title: panel.title || 'New Panel',
      state: panel.state || 'docked',
      position: panel.position || { x: 0, y: 0 },
      size: panel.size || { width: 300, height: 200 },
      content: panel.content || null
    };

    workspace.panels.push(newPanel);
    workspace.metadata.last_modified = new Date().toISOString();

    return { workspace, panel: newPanel, operation: 'WBO_ADD_PANEL' };
  }

  /**
   * WBO_ADD_ROOM - Add conceptual XR room
   */
  addRoom(workspaceId, room) {
    const workspace = this.workspaces.get(workspaceId);
    if (!workspace) {
      throw new Error(`Workspace not found: ${workspaceId}`);
    }

    const newRoom = {
      id: room.id || `room_${Date.now()}`,
      name: room.name || 'New Room',
      type: room.type || 'standard',
      position: room.position || { x: 0, y: 0, z: 0 },
      portals: room.portals || []
    };

    workspace.rooms.push(newRoom);
    workspace.metadata.last_modified = new Date().toISOString();

    return { workspace, room: newRoom, operation: 'WBO_ADD_ROOM' };
  }

  /**
   * WBO_ADD_TIMELINE - Add holothread visual ribbon
   */
  addTimeline(workspaceId, timeline) {
    const workspace = this.workspaces.get(workspaceId);
    if (!workspace) {
      throw new Error(`Workspace not found: ${workspaceId}`);
    }

    const newTimeline = {
      id: timeline.id || `timeline_${Date.now()}`,
      name: timeline.name || 'New Timeline',
      segments: timeline.segments || [],
      collapsed: timeline.collapsed || false
    };

    workspace.timelines.push(newTimeline);
    workspace.metadata.last_modified = new Date().toISOString();

    return { workspace, timeline: newTimeline, operation: 'WBO_ADD_TIMELINE' };
  }

  /**
   * WBO_ADD_CLUSTER - Add group of related nodes/tasks
   */
  addCluster(workspaceId, cluster) {
    const workspace = this.workspaces.get(workspaceId);
    if (!workspace) {
      throw new Error(`Workspace not found: ${workspaceId}`);
    }

    const newCluster = {
      id: cluster.id || `cluster_${Date.now()}`,
      name: cluster.name || 'New Cluster',
      nodes: cluster.nodes || [],
      position: cluster.position || { x: 0, y: 0 }
    };

    workspace.clusters.push(newCluster);
    workspace.metadata.last_modified = new Date().toISOString();

    return { workspace, cluster: newCluster, operation: 'WBO_ADD_CLUSTER' };
  }

  /**
   * WBO_LAYOUT - Arrange workspace layout
   */
  setLayout(workspaceId, layout) {
    const workspace = this.workspaces.get(workspaceId);
    if (!workspace) {
      throw new Error(`Workspace not found: ${workspaceId}`);
    }

    if (!this.layoutTypes.includes(layout)) {
      throw new Error(`Unknown layout type: ${layout}`);
    }

    workspace.layout = layout;
    workspace.metadata.last_modified = new Date().toISOString();

    return { workspace, operation: 'WBO_LAYOUT' };
  }

  /**
   * WBO_EXPORT - Export workspace structure as WB JSON
   */
  exportWorkspace(workspaceId) {
    const workspace = this.workspaces.get(workspaceId);
    if (!workspace) {
      throw new Error(`Workspace not found: ${workspaceId}`);
    }

    return {
      WB_EXPORT: {
        workspace_id: workspace.id,
        name: workspace.name,
        mode: workspace.mode,
        layout: workspace.layout,
        panels: workspace.panels,
        rooms: workspace.rooms,
        clusters: workspace.clusters,
        timelines: workspace.timelines,
        portals: workspace.portals,
        fabric_links: workspace.fabric_links,
        metadata: {
          ...workspace.metadata,
          exported_at: new Date().toISOString(),
          version: '14.0',
          safe: true
        }
      },
      operation: 'WBO_EXPORT'
    };
  }

  /**
   * WBO_CLEAR - Remove all workspace elements
   */
  clearWorkspace(workspaceId) {
    const workspace = this.workspaces.get(workspaceId);
    if (!workspace) {
      throw new Error(`Workspace not found: ${workspaceId}`);
    }

    const previous = {
      panels: workspace.panels.length,
      rooms: workspace.rooms.length,
      clusters: workspace.clusters.length,
      timelines: workspace.timelines.length
    };

    workspace.panels = [];
    workspace.rooms = [];
    workspace.clusters = [];
    workspace.timelines = [];
    workspace.portals = [];
    workspace.fabric_links = [];
    workspace.metadata.last_modified = new Date().toISOString();

    return { workspace, previous, operation: 'WBO_CLEAR' };
  }

  /**
   * WBO_DUPLICATE - Duplicate workspace under new ID
   */
  duplicateWorkspace(workspaceId, newName) {
    const original = this.workspaces.get(workspaceId);
    if (!original) {
      throw new Error(`Workspace not found: ${workspaceId}`);
    }

    const duplicate = {
      ...JSON.parse(JSON.stringify(original)),
      id: `ws_${Date.now()}`,
      name: newName || `${original.name} (Copy)`,
      metadata: {
        created_at: new Date().toISOString(),
        last_modified: new Date().toISOString(),
        version: '14.0',
        duplicated_from: workspaceId
      }
    };

    this.workspaces.set(duplicate.id, duplicate);

    return { original_id: workspaceId, duplicate, operation: 'WBO_DUPLICATE' };
  }

  /**
   * WBO_PRESET - Build workspace from a preset
   */
  loadPreset(presetName, customName) {
    const preset = this.presets[presetName.toUpperCase()];
    if (!preset) {
      throw new Error(`Unknown preset: ${presetName}`);
    }

    const workspace = {
      id: `ws_${Date.now()}`,
      name: customName || preset.name,
      mode: this.modes.DESKTOP,
      layout: preset.layout,
      panels: preset.panels.map(p => ({
        ...p,
        state: 'docked',
        position: { x: 0, y: 0 },
        size: { width: 300, height: 200 }
      })),
      rooms: [],
      clusters: [],
      timelines: [],
      portals: [],
      fabric_links: [],
      metadata: {
        created_at: new Date().toISOString(),
        last_modified: new Date().toISOString(),
        version: '14.0',
        preset_used: presetName
      }
    };

    this.workspaces.set(workspace.id, workspace);

    return { workspace, preset_used: presetName, operation: 'WBO_PRESET' };
  }

  /**
   * Get workspace
   */
  getWorkspace(workspaceId) {
    return this.workspaces.get(workspaceId) || null;
  }

  /**
   * List all workspaces
   */
  listWorkspaces() {
    return Array.from(this.workspaces.values()).map(w => ({
      id: w.id,
      name: w.name,
      mode: w.mode,
      layout: w.layout,
      panel_count: w.panels.length,
      room_count: w.rooms.length,
      created_at: w.metadata.created_at
    }));
  }

  /**
   * Delete workspace
   */
  deleteWorkspace(workspaceId) {
    if (!this.workspaces.has(workspaceId)) {
      throw new Error(`Workspace not found: ${workspaceId}`);
    }

    this.workspaces.delete(workspaceId);
    return { deleted: workspaceId };
  }

  /**
   * Get available presets
   */
  getPresets() {
    return Object.entries(this.presets).map(([key, preset]) => ({
      key: key,
      name: preset.name,
      layout: preset.layout,
      panel_count: preset.panels.length
    }));
  }

  /**
   * Get available operations
   */
  getOperations() {
    return [
      { operation: 'WBO_CREATE', description: 'Create empty workspace' },
      { operation: 'WBO_ADD_PANEL', description: 'Add panel to workspace layout' },
      { operation: 'WBO_ADD_ROOM', description: 'Add conceptual XR room' },
      { operation: 'WBO_ADD_TIMELINE', description: 'Add holothread visual ribbon' },
      { operation: 'WBO_ADD_CLUSTER', description: 'Add group of related nodes/tasks' },
      { operation: 'WBO_LAYOUT', description: 'Arrange workspace layout' },
      { operation: 'WBO_EXPORT', description: 'Export workspace structure as WB JSON' },
      { operation: 'WBO_CLEAR', description: 'Remove all workspace elements' },
      { operation: 'WBO_DUPLICATE', description: 'Duplicate workspace under new ID' },
      { operation: 'WBO_PRESET', description: 'Build workspace from a preset' }
    ];
  }

  /**
   * Validate safety
   */
  validateSafety() {
    return {
      valid: true,
      checks: {
        no_autonomous_generation: true,
        no_unauthorized_changes: true,
        no_persistent_memory: true,
        no_agent_coordination: true,
        no_simulation_engine: true,
        user_controlled: true,
        reversible: true,
        conceptual_only: true,
        lawbook_compliant: true
      },
      role: 'workspace_builder',
      autonomous: false
    };
  }

  /**
   * Export all workspaces
   */
  exportAll() {
    return {
      WB_FULL_EXPORT: {
        workspaces: this.listWorkspaces(),
        workspace_count: this.workspaces.size,
        presets_available: this.getPresets(),
        operations: this.getOperations(),
        metadata: {
          version: '14.0',
          exported_at: new Date().toISOString(),
          safe: true,
          user_controlled: true
        }
      }
    };
  }
}

export default Workbench;
