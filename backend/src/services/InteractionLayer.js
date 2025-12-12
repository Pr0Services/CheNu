/**
 * CHE·NU OS 9.5 — Interaction Layer (IL-9.5)
 * Interaction Capabilities for Spatial Universe Manipulation
 * Version: 9.5
 */

export class InteractionLayer {
  constructor() {
    // Universal Interaction Primitives
    this.primitives = {
      select: {
        id: 'UIP_SELECT',
        action: 'highlight node or room',
        effect: 'subtle aura brightening',
        rule: 'never snap aggressively'
      },
      focus: {
        id: 'UIP_FOCUS',
        action: 'center view on target',
        effect: 'smooth zoom'
      },
      expand: {
        id: 'UIP_EXPAND',
        action: 'enlarge concept or room',
        effect: 'room blooming animation',
        rule: 'reversible'
      },
      collapse: {
        id: 'UIP_COLLAPSE',
        action: 'shrink/close area',
        effect: 'dissolve inward'
      },
      navigate: {
        id: 'UIP_NAVIGATE',
        action: 'move viewpoint',
        modes: ['orbit', 'glide', 'pivot', 'portal']
      },
      link: {
        id: 'UIP_LINK',
        action: 'connect two nodes',
        effect: 'soft line forming'
      },
      unlink: {
        id: 'UIP_UNLINK',
        action: 'remove conceptual link',
        effect: 'fade line'
      },
      summon_agent: {
        id: 'UIP_SUMMON_AGENT',
        action: 'call PXR-3 avatar to location',
        effect: 'soft appearance, symbolic, never humanoid'
      },
      pin_panel: {
        id: 'UIP_PIN_PANEL',
        action: 'attach UI surface to room',
        effect: 'floating panel appears'
      }
    };

    // Portal interaction types
    this.portalInteractions = {
      activate: {
        effect: 'transition to another room',
        styles: ['warp', 'fade', 'slide', 'bloom'],
        conditions: ['user-initiated', 'reversible', 'no forced teleports']
      },
      preview: {
        effect: 'shows ghost outline of destination'
      },
      link_create: {
        effect: 'creates portal edge in fabric'
      }
    };

    // Timeline interactions
    this.timelineInteractions = {
      expand_node: {
        action: 'zoom into decision point',
        effect: 'becomes micro-room'
      },
      branch_view: {
        action: 'show multiple future outcomes',
        effect: 'conceptual branching'
      },
      stitch: {
        action: 'connect two timeline points',
        effect: 'holothread formation'
      },
      slide: {
        action: 'move along timeline path',
        effect: 'smooth traversal'
      },
      collapse: {
        action: 'collapse thread',
        effect: 'return to ribbon'
      }
    };

    // Cluster interaction types
    this.clusterInteractions = {
      gather: { effect: 'pulls related elements closer' },
      scatter: { effect: 'spreads to reveal structure' },
      sort_by: {
        options: ['timeline', 'priority', 'dependency', 'sphere', 'agent']
      },
      promote: { effect: 'lifts node visually = priority boost' }
    };

    // Room manipulation types
    this.roomManipulations = {
      open: { effect: 'expands chamber in space' },
      close: { effect: 'collapses to node' },
      duplicate_view: { effect: 'creates second view panel' },
      merge: { effect: 'blends two related rooms' },
      portalize: { effect: 'creates portal in/out' }
    };

    // Interaction history for reversibility
    this.history = [];
  }

  /**
   * Execute interaction primitive
   */
  execute(primitiveType, target, options = {}) {
    const primitive = this.primitives[primitiveType];
    if (!primitive) {
      throw new Error(`Unknown primitive: ${primitiveType}`);
    }

    const interaction = {
      id: `interaction_${Date.now()}`,
      primitive: primitive.id,
      target: target,
      options: options,
      effect: primitive.effect,
      timestamp: new Date().toISOString(),
      reversible: true,
      executed: true
    };

    // Add to history for undo
    this.history.push(interaction);

    return {
      interaction,
      il_version: '9.5'
    };
  }

  /**
   * Select node or room
   */
  select(targetId) {
    return this.execute('select', targetId, {
      highlight: 'aura',
      intensity: 0.3
    });
  }

  /**
   * Focus on target
   */
  focus(targetId, zoomLevel = 1) {
    return this.execute('focus', targetId, {
      zoom: zoomLevel,
      transition: 'smooth'
    });
  }

  /**
   * Expand node/room
   */
  expand(targetId) {
    return this.execute('expand', targetId, {
      animation: 'bloom',
      duration: 0.5
    });
  }

  /**
   * Collapse node/room
   */
  collapse(targetId) {
    return this.execute('collapse', targetId, {
      animation: 'dissolve',
      duration: 0.3
    });
  }

  /**
   * Navigate in universe
   */
  navigate(mode, destination = null) {
    const validModes = this.primitives.navigate.modes;
    if (!validModes.includes(mode)) {
      throw new Error(`Invalid navigation mode: ${mode}. Valid: ${validModes.join(', ')}`);
    }

    return this.execute('navigate', destination, {
      mode: mode,
      reversible: true
    });
  }

  /**
   * Link two nodes
   */
  link(sourceId, targetId) {
    return this.execute('link', { source: sourceId, target: targetId }, {
      animation: 'soft_line',
      bidirectional: true
    });
  }

  /**
   * Unlink nodes
   */
  unlink(sourceId, targetId) {
    return this.execute('unlink', { source: sourceId, target: targetId }, {
      animation: 'fade'
    });
  }

  /**
   * Summon agent to location
   */
  summonAgent(agentId, location) {
    return this.execute('summon_agent', agentId, {
      location: location,
      entry: 'soft_pulse',
      autonomous: false // NEVER autonomous
    });
  }

  /**
   * Pin UI panel
   */
  pinPanel(panelConfig, roomId) {
    return this.execute('pin_panel', roomId, {
      panel: panelConfig,
      floating: true
    });
  }

  /**
   * Activate portal
   */
  activatePortal(portalId, style = 'warp') {
    const validStyles = this.portalInteractions.activate.styles;
    if (!validStyles.includes(style)) {
      style = 'warp';
    }

    return {
      action: 'portal_activate',
      portal_id: portalId,
      style: style,
      user_initiated: true,
      reversible: true,
      timestamp: new Date().toISOString(),
      il_version: '9.5'
    };
  }

  /**
   * Preview portal destination
   */
  previewPortal(portalId) {
    return {
      action: 'portal_preview',
      portal_id: portalId,
      effect: 'ghost_outline',
      il_version: '9.5'
    };
  }

  /**
   * Timeline expand node
   */
  timelineExpandNode(nodeId) {
    return {
      action: 'timeline_expand_node',
      node_id: nodeId,
      effect: 'becomes_micro_room',
      reversible: true,
      il_version: '9.5'
    };
  }

  /**
   * Timeline branch view
   */
  timelineBranchView(nodeId) {
    return {
      action: 'timeline_branch_view',
      node_id: nodeId,
      effect: 'show_outcomes',
      conceptual: true,
      il_version: '9.5'
    };
  }

  /**
   * Timeline stitch
   */
  timelineStitch(pointA, pointB) {
    return {
      action: 'timeline_stitch',
      points: [pointA, pointB],
      effect: 'holothread_formation',
      reversible: true,
      il_version: '9.5'
    };
  }

  /**
   * Cluster gather
   */
  clusterGather(clusterId) {
    return {
      action: 'cluster_gather',
      cluster_id: clusterId,
      effect: 'pulls_closer',
      reversible: true,
      il_version: '9.5'
    };
  }

  /**
   * Cluster scatter
   */
  clusterScatter(clusterId) {
    return {
      action: 'cluster_scatter',
      cluster_id: clusterId,
      effect: 'reveals_structure',
      reversible: true,
      il_version: '9.5'
    };
  }

  /**
   * Cluster sort
   */
  clusterSort(clusterId, sortBy) {
    const validOptions = this.clusterInteractions.sort_by.options;
    if (!validOptions.includes(sortBy)) {
      throw new Error(`Invalid sort option: ${sortBy}. Valid: ${validOptions.join(', ')}`);
    }

    return {
      action: 'cluster_sort',
      cluster_id: clusterId,
      sort_by: sortBy,
      reversible: true,
      il_version: '9.5'
    };
  }

  /**
   * Room manipulation
   */
  manipulateRoom(roomId, action) {
    const manipulation = this.roomManipulations[action];
    if (!manipulation) {
      throw new Error(`Invalid room manipulation: ${action}`);
    }

    return {
      action: `room_${action}`,
      room_id: roomId,
      effect: manipulation.effect,
      reversible: true,
      il_version: '9.5'
    };
  }

  /**
   * Undo last interaction
   */
  undo() {
    if (this.history.length === 0) {
      return { undone: false, message: 'No interactions to undo' };
    }

    const lastInteraction = this.history.pop();
    return {
      undone: true,
      interaction: lastInteraction,
      remaining_history: this.history.length,
      il_version: '9.5'
    };
  }

  /**
   * Get interaction history
   */
  getHistory(limit = 10) {
    return {
      history: this.history.slice(-limit),
      total: this.history.length,
      il_version: '9.5'
    };
  }

  /**
   * Clear history
   */
  clearHistory() {
    this.history = [];
    return { cleared: true, il_version: '9.5' };
  }

  /**
   * Get available primitives
   */
  getAvailablePrimitives() {
    return {
      primitives: Object.entries(this.primitives).map(([key, value]) => ({
        name: key,
        ...value
      })),
      il_version: '9.5'
    };
  }

  /**
   * Get all interaction types
   */
  getAllInteractionTypes() {
    return {
      primitives: Object.keys(this.primitives),
      portal_interactions: Object.keys(this.portalInteractions),
      timeline_interactions: Object.keys(this.timelineInteractions),
      cluster_interactions: Object.keys(this.clusterInteractions),
      room_manipulations: Object.keys(this.roomManipulations),
      il_version: '9.5'
    };
  }

  /**
   * Validate interaction safety
   */
  validateSafety(interaction) {
    const violations = [];

    // Check for physical simulation
    const physicalTerms = ['hand', 'body', 'finger', 'touch', 'grab', 'hold'];
    const interactionStr = JSON.stringify(interaction).toLowerCase();
    
    physicalTerms.forEach(term => {
      if (interactionStr.includes(term)) {
        violations.push(`Physical term detected: ${term}`);
      }
    });

    // Check for emotional content
    const emotionalTerms = ['happy', 'sad', 'angry', 'fear', 'pain', 'fatigue'];
    emotionalTerms.forEach(term => {
      if (interactionStr.includes(term)) {
        violations.push(`Emotional term detected: ${term}`);
      }
    });

    // Check for autonomous behavior
    if (interaction.autonomous === true) {
      violations.push('Autonomous behavior detected');
    }

    return {
      valid: violations.length === 0,
      violations: violations,
      lawbook_compliant: violations.length === 0
    };
  }
}

export default InteractionLayer;
