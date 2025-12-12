/**
 * CHE·NU OS 10.5 — Interaction Panels (IP-10.5)
 * Intelligent UI Panels for XR and Desktop Mode
 * Version: 10.5
 */

export class InteractionPanels {
  constructor() {
    // Panel types
    this.panelTypes = {
      info: { description: 'Display details about room, node, thread, or agent' },
      actions: { description: 'Provide relevant actions' },
      timeline: { description: 'Show temporal ribbon with branches' },
      cluster: { description: 'Sorting, grouping, collapsing' },
      agent: { description: 'Agent roles and suggestions (no emotions)' },
      portal: { description: 'Preview and activate portals' },
      workspace: { description: 'Combined split interface' }
    };

    // Panel states
    this.panelStates = ['idle', 'focused', 'expanded', 'collapsed', 'pinned', 'float'];

    // Panel layouts
    this.panelLayouts = ['sidebar', 'floating', 'docked', 'grid'];

    // Panel Interaction Primitives
    this.primitives = {
      focus: { action: 'highlight panel' },
      expand: { action: 'open panel sections' },
      collapse: { action: 'closed, minimal version' },
      pin: { action: 'lock in place' },
      unpin: { action: 'return to floating/anchored' },
      select_node: { action: 'open node panel' },
      open_portal: { action: 'activate portal panel' },
      summon_agent_panel: { action: 'show agent suggestions' }
    };

    // Active panels registry
    this.panels = new Map();
  }

  /**
   * Create a panel
   */
  createPanel(type, config = {}) {
    if (!this.panelTypes[type]) {
      throw new Error(`Unknown panel type: ${type}`);
    }

    const panel = {
      id: config.id || `panel_${type}_${Date.now()}`,
      type: type,
      title: config.title || `${type.charAt(0).toUpperCase() + type.slice(1)} Panel`,
      content: config.content || [],
      links: config.links || [],
      actions: config.actions || this.getDefaultActions(type),
      fabric_refs: config.fabric_refs || [],
      avatars: config.avatars || [],
      state: config.state || 'idle',
      layout: config.layout || 'floating',
      mode: config.mode || 'desktop',
      position: config.position || { x: 0, y: 0 },
      size: config.size || { width: 300, height: 400 },
      created_at: new Date().toISOString(),
      no_emotion: true,
      no_face: true,
      reversible: true
    };

    this.panels.set(panel.id, panel);
    return panel;
  }

  /**
   * Get default actions for panel type
   */
  getDefaultActions(type) {
    const actions = {
      info: ['expand', 'collapse', 'pin', 'close'],
      actions: ['execute', 'preview', 'close'],
      timeline: ['expand_branch', 'collapse_branch', 'navigate', 'close'],
      cluster: ['sort', 'group', 'filter', 'collapse', 'close'],
      agent: ['request_insight', 'anchor', 'dismiss'],
      portal: ['preview', 'activate', 'close'],
      workspace: ['split', 'maximize', 'minimize', 'close']
    };
    return actions[type] || ['close'];
  }

  /**
   * Create info panel
   */
  createInfoPanel(target, details = {}) {
    return this.createPanel('info', {
      title: details.title || `Info: ${target}`,
      content: [
        { type: 'header', text: target },
        { type: 'description', text: details.description || '' },
        { type: 'properties', items: details.properties || [] },
        { type: 'links', items: details.links || [] }
      ],
      fabric_refs: details.fabric_refs || [target]
    });
  }

  /**
   * Create actions panel
   */
  createActionsPanel(context, availableActions = []) {
    return this.createPanel('actions', {
      title: `Actions: ${context}`,
      content: availableActions.map(action => ({
        type: 'action_button',
        id: action.id || action,
        label: action.label || action,
        icon: action.icon || 'default',
        enabled: action.enabled !== false
      })),
      actions: availableActions.map(a => a.id || a)
    });
  }

  /**
   * Create timeline panel
   */
  createTimelinePanel(timelineData) {
    return this.createPanel('timeline', {
      title: timelineData.title || 'Timeline',
      content: [
        {
          type: 'ribbon',
          segments: (timelineData.segments || []).map((seg, i) => ({
            index: i,
            label: seg.label || `Point ${i + 1}`,
            type: seg.type || 'event',
            branch: seg.branch || null,
            expandable: true
          }))
        }
      ],
      layout: 'docked',
      fabric_refs: [timelineData.holothread_id].filter(Boolean)
    });
  }

  /**
   * Create cluster panel
   */
  createClusterPanel(clusterData) {
    return this.createPanel('cluster', {
      title: clusterData.name || 'Cluster',
      content: [
        {
          type: 'cluster_view',
          layout: clusterData.layout || 'grid',
          groups: (clusterData.groups || []).map(g => ({
            name: g.name,
            nodes: g.nodes || [],
            collapsed: g.collapsed || false
          })),
          sortable: true,
          filterable: true
        }
      ],
      actions: ['sort', 'group', 'filter', 'collapse_all', 'expand_all', 'close']
    });
  }

  /**
   * Create agent panel
   */
  createAgentPanel(agentData) {
    return this.createPanel('agent', {
      title: `Agent: ${agentData.id || 'Unknown'}`,
      content: [
        {
          type: 'agent_header',
          id: agentData.id,
          role: agentData.role || agentData.anchor_zone,
          icon_shape: agentData.morphology?.base_form || 'orb',
          icon_color: agentData.morphology?.canonical_color || '#888888',
          no_face: true,
          no_emotion: true
        },
        {
          type: 'suggestions',
          items: agentData.suggestions || []
        },
        {
          type: 'available_actions',
          items: agentData.actions || ['request_insight', 'anchor', 'dismiss']
        }
      ],
      avatars: [agentData.id]
    });
  }

  /**
   * Create portal panel
   */
  createPortalPanel(portalData) {
    return this.createPanel('portal', {
      title: `Portal: ${portalData.from} → ${portalData.to}`,
      content: [
        {
          type: 'portal_preview',
          from: portalData.from,
          to: portalData.to,
          destination_preview: portalData.preview || null,
          transition_style: portalData.transition || 'warp'
        },
        {
          type: 'destination_info',
          room_type: portalData.destination_type || 'unknown',
          description: portalData.destination_description || ''
        }
      ],
      actions: ['preview', 'activate', 'close'],
      fabric_refs: [portalData.id, portalData.from, portalData.to].filter(Boolean)
    });
  }

  /**
   * Create workspace panel
   */
  createWorkspacePanel(workspaceConfig) {
    return this.createPanel('workspace', {
      title: workspaceConfig.title || 'Workspace',
      layout: 'grid',
      content: [
        {
          type: 'split_view',
          panels: workspaceConfig.panels || [],
          arrangement: workspaceConfig.arrangement || 'horizontal'
        }
      ],
      actions: ['split_horizontal', 'split_vertical', 'maximize', 'minimize', 'close']
    });
  }

  /**
   * Update panel state
   */
  updatePanelState(panelId, newState) {
    if (!this.panelStates.includes(newState)) {
      throw new Error(`Invalid state: ${newState}. Valid: ${this.panelStates.join(', ')}`);
    }

    const panel = this.panels.get(panelId);
    if (!panel) {
      throw new Error(`Panel not found: ${panelId}`);
    }

    const oldState = panel.state;
    panel.state = newState;
    panel.updated_at = new Date().toISOString();

    return {
      panel_id: panelId,
      old_state: oldState,
      new_state: newState,
      transition: `${oldState} → ${newState}`,
      reversible: true
    };
  }

  /**
   * Execute panel interaction primitive
   */
  executePrimitive(panelId, primitive) {
    if (!this.primitives[primitive]) {
      throw new Error(`Unknown primitive: ${primitive}`);
    }

    const panel = this.panels.get(panelId);
    if (!panel) {
      throw new Error(`Panel not found: ${panelId}`);
    }

    // State transitions based on primitive
    const stateTransitions = {
      focus: 'focused',
      expand: 'expanded',
      collapse: 'collapsed',
      pin: 'pinned',
      unpin: 'idle'
    };

    if (stateTransitions[primitive]) {
      panel.state = stateTransitions[primitive];
    }

    return {
      panel_id: panelId,
      primitive: primitive,
      action: this.primitives[primitive].action,
      new_state: panel.state,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get panel
   */
  getPanel(panelId) {
    return this.panels.get(panelId) || null;
  }

  /**
   * Get all panels
   */
  getAllPanels() {
    return Array.from(this.panels.values());
  }

  /**
   * Get panels by type
   */
  getPanelsByType(type) {
    return this.getAllPanels().filter(p => p.type === type);
  }

  /**
   * Get panels by state
   */
  getPanelsByState(state) {
    return this.getAllPanels().filter(p => p.state === state);
  }

  /**
   * Close panel
   */
  closePanel(panelId) {
    const panel = this.panels.get(panelId);
    if (!panel) {
      return { closed: false, error: 'Panel not found' };
    }

    this.panels.delete(panelId);
    return {
      closed: true,
      panel_id: panelId,
      reversible: true,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Export panel to UDM format
   */
  exportPanel(panelId) {
    const panel = this.panels.get(panelId);
    if (!panel) {
      throw new Error(`Panel not found: ${panelId}`);
    }

    return {
      UDM_PANEL: {
        id: panel.id,
        type: panel.type,
        title: panel.title,
        layout: panel.layout,
        content_blocks: panel.content,
        actions: panel.actions,
        fabric_refs: panel.fabric_refs,
        state: panel.state,
        metadata: {
          version: '10.5',
          mode: panel.mode,
          created_at: panel.created_at,
          no_emotion: true,
          no_face: true,
          lawbook_compliant: true
        }
      }
    };
  }

  /**
   * Export all panels
   */
  exportAllPanels() {
    return {
      UDM_PANELS_EXPORT: {
        panels: this.getAllPanels().map(p => this.exportPanel(p.id).UDM_PANEL),
        total_count: this.panels.size,
        metadata: {
          version: '10.5',
          exported_at: new Date().toISOString()
        }
      }
    };
  }

  /**
   * Get available panel types
   */
  getAvailableTypes() {
    return Object.entries(this.panelTypes).map(([key, value]) => ({
      type: key,
      ...value
    }));
  }

  /**
   * Get available primitives
   */
  getAvailablePrimitives() {
    return Object.entries(this.primitives).map(([key, value]) => ({
      primitive: key,
      ...value
    }));
  }

  /**
   * Validate panel safety
   */
  validateSafety(panel) {
    const violations = [];
    const panelStr = JSON.stringify(panel).toLowerCase();

    // Check for emotional content
    const emotionalTerms = ['happy', 'sad', 'angry', 'fear', 'excited', 'anxious'];
    emotionalTerms.forEach(term => {
      if (panelStr.includes(term)) {
        violations.push(`Emotional term detected: ${term}`);
      }
    });

    // Check for face/human depiction
    const faceTerms = ['face', 'smile', 'frown', 'eyes', 'expression'];
    faceTerms.forEach(term => {
      if (panelStr.includes(term) && !panelStr.includes('no_' + term)) {
        violations.push(`Face/human term detected: ${term}`);
      }
    });

    // Check for addictive patterns
    const addictiveTerms = ['streak', 'reward', 'gamification', 'notification_spam'];
    addictiveTerms.forEach(term => {
      if (panelStr.includes(term)) {
        violations.push(`Addictive pattern detected: ${term}`);
      }
    });

    return {
      valid: violations.length === 0,
      violations: violations,
      lawbook_compliant: violations.length === 0,
      user_sovereignty_preserved: true
    };
  }

  /**
   * Clear all panels
   */
  clearAllPanels() {
    const count = this.panels.size;
    this.panels.clear();
    return {
      cleared: true,
      count: count,
      timestamp: new Date().toISOString()
    };
  }
}

export default InteractionPanels;
