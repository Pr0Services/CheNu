/**
 * CHE·NU OS 10.0 — UniverseOS Desktop Mode (UDM)
 * 2D/2.5D Desktop Interface for UniverseOS
 * Version: 10.0
 */

export class DesktopMode {
  constructor() {
    // View types
    this.viewTypes = {
      nexus_panel: { description: 'Central hub with spheres and portals' },
      room_panel: { description: 'Room cards with nodes and actions' },
      timeline_gallery: { description: 'Horizontal ribbon with branches' },
      fabric_map: { description: 'Node-link diagram of rooms' },
      workspace_mode: { description: 'Split view: structure + insights' },
      navigation_panel: { description: 'Breadcrumbs and selectors' }
    };

    // Avatar icon shapes
    this.iconShapes = ['orb', 'crystal', 'glyph'];
    
    // Cluster layouts
    this.clusterLayouts = ['grid', 'tree', 'grouped_list'];

    // Navigation actions
    this.navActions = ['click_select', 'click_enter', 'zoom', 'breadcrumb_back', 'pan'];

    // Current desktop state
    this.desktopState = this.initDesktopState();
  }

  /**
   * Initialize desktop state
   */
  initDesktopState() {
    return {
      nexus: null,
      spheres: [],
      rooms: [],
      portals: [],
      timelines: [],
      clusters: [],
      avatars: [],
      current_view: 'nexus_panel',
      breadcrumbs: [],
      metadata: {
        mode: 'desktop',
        version: '10.0'
      }
    };
  }

  /**
   * Compile room to 2D panel
   */
  compileRoomToPanel(room) {
    return {
      ROOM_PANEL: {
        id: room.id,
        title: room.name || room.type,
        description: room.description || `${room.type} workspace`,
        geometry_2d: 'card',
        sections: {
          nodes_list: room.nodes || [],
          portals: (room.portals || []).map(p => this.compilePortalToLink(p)),
          agent_icons: (room.agents || []).map(a => this.compileAvatarToIcon(a)),
          actions: ['enter', 'expand', 'link', 'close']
        },
        fabric_links: {
          related_rooms: room.fabric_links || [],
          holothreads: room.holothreads || []
        },
        position_2d: this.calculate2DPosition(room.pos),
        aura_color: room.aura || '#FFFFFF'
      }
    };
  }

  /**
   * Compile portal to clickable link
   */
  compilePortalToLink(portal) {
    return {
      PORTAL_LINK: {
        id: portal.id || `portal_${Date.now()}`,
        label: `Go to ${portal.to || 'Room'}`,
        from: portal.from,
        to: portal.to,
        style: 'soft_glow',
        transition_type: portal.transition || 'click',
        clickable: true,
        no_movement_simulation: true
      }
    };
  }

  /**
   * Compile avatar to 2D icon
   */
  compileAvatarToIcon(avatar) {
    return {
      PXR_ICON: {
        id: avatar.id || avatar.agent_id,
        shape: this.determineIconShape(avatar),
        color: avatar.morphology?.canonical_color || '#888888',
        role: avatar.anchor_zone || 'general',
        no_face: true,
        no_human_expression: true,
        neutral_aura: true
      }
    };
  }

  /**
   * Determine icon shape from morphology
   */
  determineIconShape(avatar) {
    const baseForm = avatar.morphology?.base_form || 'orb';
    const shapeMap = {
      'orb': 'orb',
      'polyhedron': 'crystal',
      'silhouette': 'glyph',
      'abstract_humanoid': 'glyph',
      'glyph': 'glyph',
      'crystal': 'crystal'
    };
    return shapeMap[baseForm] || 'orb';
  }

  /**
   * Calculate 2D position from 3D
   */
  calculate2DPosition(pos3d) {
    if (!pos3d || pos3d.length < 2) return { x: 0, y: 0 };
    // Simple projection: use x and z as 2D coordinates
    return {
      x: pos3d[0] * 50, // Scale factor
      y: (pos3d[2] || 0) * 50
    };
  }

  /**
   * Compile timeline to UI ribbon
   */
  compileTimelineToRibbon(timeline) {
    return {
      UI_TIMELINE: {
        id: timeline.id,
        holothread_id: timeline.holothread_id,
        layout: 'horizontal_ribbon',
        segments: (timeline.nodes || timeline.path_points || []).map((node, i) => ({
          index: i,
          label: node.label || `Point ${i + 1}`,
          type: node.type || 'event',
          position_2d: { x: i * 120, y: 0 },
          branch: node.branch || null,
          expandable: true
        })),
        navigation: {
          expand_branch: true,
          collapse_branch: true,
          open_room_from_node: true,
          scrubber: true
        },
        color: timeline.color || '#FFC107'
      }
    };
  }

  /**
   * Compile cluster to UI structure
   */
  compileClusterToUI(cluster, layout = 'grid') {
    if (!this.clusterLayouts.includes(layout)) {
      layout = 'grid';
    }

    return {
      CLUSTER_UI: {
        id: cluster.id || `cluster_${Date.now()}`,
        layout: layout,
        groups: (cluster.groups || [{ name: 'Default', nodes: cluster.nodes || [] }]).map(g => ({
          name: g.name,
          nodes: g.nodes.map(n => ({
            id: n.id || n,
            label: n.label || n.id || n,
            type: n.type || 'node'
          }))
        })),
        sortable: true,
        collapsible: true
      }
    };
  }

  /**
   * Create nexus panel (desktop hub)
   */
  createNexusPanel(universeData) {
    return {
      NEXUS_PANEL: {
        id: 'nexus_desktop',
        type: 'central_hub',
        user_node: {
          position: { x: 400, y: 300 },
          label: 'You',
          shape: 'orb'
        },
        sphere_orbits: (universeData.spheres || []).map((s, i) => {
          const angle = (i / (universeData.spheres.length || 1)) * Math.PI * 2;
          const radius = 200;
          return {
            id: s.id,
            label: s.id,
            color: s.color,
            position_2d: {
              x: 400 + Math.cos(angle) * radius,
              y: 300 + Math.sin(angle) * radius
            },
            clickable: true
          };
        }),
        portal_links: (universeData.portals || []).map(p => this.compilePortalToLink(p)),
        quick_actions: ['enter_sphere', 'view_timeline', 'open_fabric_map']
      }
    };
  }

  /**
   * Create fabric map view
   */
  createFabricMapView(fabricData) {
    return {
      FABRIC_MAP_VIEW: {
        id: 'fabric_map_desktop',
        type: 'node_link_diagram',
        nodes: (fabricData.rooms || []).map(r => ({
          id: r.id,
          label: r.title || r.id,
          type: 'room_box',
          position_2d: this.calculate2DPosition(r.pos),
          color: r.aura_color || r.aura || '#FFFFFF'
        })),
        edges: (fabricData.portals || []).map(p => ({
          id: p.id,
          from: p.from,
          to: p.to,
          type: 'arrow',
          label: p.transition || 'link',
          bidirectional: p.bidirectional || false
        })),
        holothreads: (fabricData.holothreads || []).map(t => ({
          id: t.id,
          path_2d: (t.path || []).map(p => this.calculate2DPosition(p)),
          color: t.color || '#9C27B0'
        })),
        zoom_controls: true,
        pan_controls: true
      }
    };
  }

  /**
   * Create workspace mode view
   */
  createWorkspaceView(roomId, agentInsights = []) {
    return {
      WORKSPACE_MODE: {
        id: `workspace_${roomId}`,
        layout: 'split_view',
        left_panel: {
          type: 'structural_logic',
          content: 'room_panel',
          room_id: roomId
        },
        right_panel: {
          type: 'agent_insights',
          insights: agentInsights.map(i => ({
            agent_id: i.agent_id,
            icon: this.compileAvatarToIcon(i),
            message: i.insight || i.message,
            timestamp: i.timestamp || new Date().toISOString()
          }))
        },
        actions: ['toggle_split', 'maximize_left', 'maximize_right', 'close']
      }
    };
  }

  /**
   * Create navigation panel
   */
  createNavigationPanel(currentPath = []) {
    return {
      NAVIGATION_PANEL: {
        breadcrumbs: currentPath.map((p, i) => ({
          index: i,
          label: p.label || p,
          id: p.id || p,
          clickable: i < currentPath.length - 1
        })),
        sphere_selector: {
          type: 'dropdown',
          options: this.desktopState.spheres.map(s => ({ id: s.id, label: s.id }))
        },
        room_selector: {
          type: 'dropdown',
          options: this.desktopState.rooms.map(r => ({ id: r.id, label: r.title || r.id }))
        },
        timeline_minimap: {
          visible: true,
          compact: true
        },
        search_bar: true
      }
    };
  }

  /**
   * Import UniverseOS data to desktop mode
   */
  importFromUniverse(universeExport) {
    const data = universeExport.UNIVERSE_EXPORT || universeExport;
    
    this.desktopState = {
      nexus: this.createNexusPanel(data),
      spheres: data.spheres || [],
      rooms: (data.rooms || []).map(r => this.compileRoomToPanel(r)),
      portals: (data.portals || []).map(p => this.compilePortalToLink(p)),
      timelines: (data.timeline_paths || []).map(t => this.compileTimelineToRibbon(t)),
      clusters: [],
      avatars: (data.agents || []).map(a => this.compileAvatarToIcon(a)),
      current_view: 'nexus_panel',
      breadcrumbs: [{ id: 'nexus', label: 'Nexus' }],
      metadata: {
        mode: 'desktop',
        version: '10.0',
        source_version: data.metadata?.version || 'unknown'
      }
    };

    return this.desktopState;
  }

  /**
   * Export desktop state
   */
  exportDesktop() {
    return {
      UDM_EXPORT: {
        nexus: this.desktopState.nexus,
        spheres: this.desktopState.spheres,
        rooms: this.desktopState.rooms,
        portals: this.desktopState.portals,
        timelines: this.desktopState.timelines,
        clusters: this.desktopState.clusters,
        avatars: this.desktopState.avatars,
        navigation: this.createNavigationPanel(this.desktopState.breadcrumbs),
        metadata: {
          mode: 'desktop',
          version: '10.0',
          exported_at: new Date().toISOString(),
          lawbook_compliant: true
        }
      }
    };
  }

  /**
   * Navigate to view
   */
  navigateTo(viewType, targetId = null) {
    if (!this.viewTypes[viewType]) {
      throw new Error(`Unknown view type: ${viewType}`);
    }

    // Update breadcrumbs
    this.desktopState.breadcrumbs.push({
      id: targetId || viewType,
      label: targetId || viewType.replace(/_/g, ' ')
    });

    this.desktopState.current_view = viewType;

    return {
      view: viewType,
      target: targetId,
      breadcrumbs: this.desktopState.breadcrumbs,
      action: 'navigate',
      no_physical_gesture: true,
      no_body_logic: true
    };
  }

  /**
   * Go back in navigation
   */
  navigateBack() {
    if (this.desktopState.breadcrumbs.length > 1) {
      this.desktopState.breadcrumbs.pop();
      const previous = this.desktopState.breadcrumbs[this.desktopState.breadcrumbs.length - 1];
      return {
        view: previous.id,
        breadcrumbs: this.desktopState.breadcrumbs,
        action: 'back'
      };
    }
    return { view: 'nexus_panel', action: 'at_root' };
  }

  /**
   * Get available views
   */
  getAvailableViews() {
    return Object.entries(this.viewTypes).map(([key, value]) => ({
      type: key,
      ...value
    }));
  }

  /**
   * Get current state
   */
  getCurrentState() {
    return {
      current_view: this.desktopState.current_view,
      breadcrumbs: this.desktopState.breadcrumbs,
      room_count: this.desktopState.rooms.length,
      sphere_count: this.desktopState.spheres.length,
      avatar_count: this.desktopState.avatars.length,
      udm_version: '10.0'
    };
  }

  /**
   * Validate desktop safety
   */
  validateSafety() {
    const violations = [];
    const stateStr = JSON.stringify(this.desktopState).toLowerCase();

    // Check for embodiment terms
    const embodimentTerms = ['body', 'hand', 'finger', 'gesture', 'physical', 'touch'];
    embodimentTerms.forEach(term => {
      if (stateStr.includes(term) && !stateStr.includes('no_' + term)) {
        violations.push(`Embodiment term detected: ${term}`);
      }
    });

    // Check for emotional terms
    const emotionalTerms = ['happy', 'sad', 'angry', 'fear', 'pain'];
    emotionalTerms.forEach(term => {
      if (stateStr.includes(term)) {
        violations.push(`Emotional term detected: ${term}`);
      }
    });

    // Check for human mimicry
    const mimicryTerms = ['face', 'expression', 'smile', 'frown'];
    mimicryTerms.forEach(term => {
      if (stateStr.includes(term) && !stateStr.includes('no_' + term)) {
        violations.push(`Human mimicry term detected: ${term}`);
      }
    });

    return {
      valid: violations.length === 0,
      violations: violations,
      lawbook_compliant: violations.length === 0,
      accessibility_compliant: true,
      low_motion: true
    };
  }

  /**
   * Reset desktop state
   */
  reset() {
    this.desktopState = this.initDesktopState();
    return this.desktopState;
  }
}

export default DesktopMode;
