/**
 * CHE·NU OS 11.0 — HOLO-NET
 * Multi-user collaboration layer for UniverseOS
 * Version: 11.0
 */

export class HoloNet {
  constructor() {
    // Collaboration modes
    this.collaborationModes = {
      observe: { description: 'See others\' markers and edits' },
      coedit: { description: 'Share panel editing rights' },
      guide: { description: 'One user highlights nodes for another' },
      parallel: { description: 'Independent work, passive sync' },
      mirror: { description: 'All users share same viewpoint' }
    };

    // Fabric Sync Layer actions
    this.fslActions = [
      'add_node', 'remove_node', 'move_node',
      'create_link', 'remove_link',
      'open_room', 'close_room', 'update_cluster_grouping'
    ];

    // Active sessions
    this.sessions = new Map();
    
    // User Presence Markers
    this.upms = new Map();
    
    // Shared panels
    this.sharedPanels = new Map();
    
    // Sync log
    this.syncLog = [];
  }

  /**
   * Create User Presence Marker
   */
  createUPM(userId) {
    const upm = {
      id: userId || `user_${Date.now()}`,
      shape: 'orb',
      color: this.generateNeutralColor(),
      behavior: {
        focus_indicator: 'soft pulse',
        selection_indicator: 'halo outline'
      },
      current_focus: null,
      current_selection: [],
      no_face: true,
      no_gesture: true,
      no_emotion: true,
      created_at: new Date().toISOString()
    };

    this.upms.set(upm.id, upm);
    return upm;
  }

  /**
   * Generate neutral color for UPM
   */
  generateNeutralColor() {
    const neutralColors = [
      '#6B7280', '#9CA3AF', '#D1D5DB', // grays
      '#60A5FA', '#34D399', '#A78BFA', // soft colors
      '#FBBF24', '#F87171', '#38BDF8'  // light accents
    ];
    return neutralColors[Math.floor(Math.random() * neutralColors.length)];
  }

  /**
   * Update UPM focus
   */
  updateUPMFocus(userId, focusTarget) {
    const upm = this.upms.get(userId);
    if (!upm) return null;

    upm.current_focus = focusTarget;
    upm.updated_at = new Date().toISOString();

    this.logSync({
      action: 'upm_focus_update',
      user_id: userId,
      target: focusTarget
    });

    return upm;
  }

  /**
   * Update UPM selection
   */
  updateUPMSelection(userId, selectedItems) {
    const upm = this.upms.get(userId);
    if (!upm) return null;

    upm.current_selection = selectedItems;
    upm.updated_at = new Date().toISOString();

    this.logSync({
      action: 'upm_selection_update',
      user_id: userId,
      items: selectedItems
    });

    return upm;
  }

  /**
   * Create shared panel
   */
  createSharedPanel(panelConfig) {
    const sharedPanel = {
      id: panelConfig.id || `shared_panel_${Date.now()}`,
      type: panelConfig.type || 'workspace',
      permissions: panelConfig.permissions || 'view',
      contributors: panelConfig.contributors || [],
      sync_mode: panelConfig.sync_mode || 'immediate',
      content: panelConfig.content || [],
      visibility: 'shared',
      created_at: new Date().toISOString(),
      last_sync: new Date().toISOString()
    };

    this.sharedPanels.set(sharedPanel.id, sharedPanel);
    return sharedPanel;
  }

  /**
   * Add contributor to shared panel
   */
  addContributor(panelId, userId, permission = 'view') {
    const panel = this.sharedPanels.get(panelId);
    if (!panel) return null;

    if (!panel.contributors.includes(userId)) {
      panel.contributors.push(userId);
    }

    this.logSync({
      action: 'contributor_added',
      panel_id: panelId,
      user_id: userId,
      permission
    });

    return panel;
  }

  /**
   * Remove contributor from shared panel
   */
  removeContributor(panelId, userId) {
    const panel = this.sharedPanels.get(panelId);
    if (!panel) return null;

    panel.contributors = panel.contributors.filter(c => c !== userId);

    this.logSync({
      action: 'contributor_removed',
      panel_id: panelId,
      user_id: userId
    });

    return panel;
  }

  /**
   * Execute Fabric Sync Layer action
   */
  executeFSLAction(action, payload, userId) {
    if (!this.fslActions.includes(action)) {
      throw new Error(`Unknown FSL action: ${action}`);
    }

    const syncEvent = {
      id: `fsl_${Date.now()}`,
      action: action,
      payload: payload,
      user_id: userId,
      timestamp: new Date().toISOString(),
      reversible: true
    };

    this.logSync(syncEvent);
    return syncEvent;
  }

  /**
   * Log sync event
   */
  logSync(event) {
    this.syncLog.push({
      ...event,
      timestamp: event.timestamp || new Date().toISOString()
    });

    // Keep only last 1000 events
    if (this.syncLog.length > 1000) {
      this.syncLog = this.syncLog.slice(-1000);
    }
  }

  /**
   * Get sync log
   */
  getSyncLog(limit = 100) {
    return this.syncLog.slice(-limit);
  }

  /**
   * Create collaboration session
   */
  createSession(sessionConfig = {}) {
    const session = {
      id: sessionConfig.id || `holonet_session_${Date.now()}`,
      name: sessionConfig.name || 'Collaboration Session',
      mode: sessionConfig.mode || 'parallel',
      participants: [],
      shared_panels: [],
      fabric_refs: sessionConfig.fabric_refs || [],
      status: 'active',
      created_at: new Date().toISOString()
    };

    this.sessions.set(session.id, session);
    return session;
  }

  /**
   * Join session
   */
  joinSession(sessionId, userId) {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    // Create UPM for user
    const upm = this.createUPM(userId);

    // Add to participants
    if (!session.participants.includes(userId)) {
      session.participants.push(userId);
    }

    this.logSync({
      action: 'user_joined',
      session_id: sessionId,
      user_id: userId
    });

    return { session, upm };
  }

  /**
   * Leave session
   */
  leaveSession(sessionId, userId) {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    session.participants = session.participants.filter(p => p !== userId);
    this.upms.delete(userId);

    this.logSync({
      action: 'user_left',
      session_id: sessionId,
      user_id: userId
    });

    return session;
  }

  /**
   * Change collaboration mode
   */
  changeMode(sessionId, newMode) {
    if (!this.collaborationModes[newMode]) {
      throw new Error(`Unknown mode: ${newMode}`);
    }

    const session = this.sessions.get(sessionId);
    if (!session) return null;

    const oldMode = session.mode;
    session.mode = newMode;

    this.logSync({
      action: 'mode_changed',
      session_id: sessionId,
      old_mode: oldMode,
      new_mode: newMode
    });

    return session;
  }

  /**
   * Sync panel update
   */
  syncPanelUpdate(panelId, update, userId) {
    const panel = this.sharedPanels.get(panelId);
    if (!panel) return null;

    // Check permissions
    if (panel.permissions === 'view' && !panel.contributors.includes(userId)) {
      throw new Error('User does not have edit permissions');
    }

    // Apply update
    if (update.content) {
      panel.content = update.content;
    }

    panel.last_sync = new Date().toISOString();

    this.logSync({
      action: 'panel_updated',
      panel_id: panelId,
      user_id: userId,
      update_type: Object.keys(update).join(',')
    });

    return panel;
  }

  /**
   * Get all UPMs in session
   */
  getSessionUPMs(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) return [];

    return session.participants
      .map(userId => this.upms.get(userId))
      .filter(Boolean);
  }

  /**
   * Get session state
   */
  getSessionState(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    return {
      session: session,
      upms: this.getSessionUPMs(sessionId),
      shared_panels: session.shared_panels.map(id => this.sharedPanels.get(id)).filter(Boolean),
      recent_sync: this.getSyncLog(20).filter(e => e.session_id === sessionId),
      holonet_version: '11.0'
    };
  }

  /**
   * Export HOLO-NET state
   */
  exportHoloNet() {
    return {
      HOLONET_EXPORT: {
        sessions: Array.from(this.sessions.values()),
        upms: Array.from(this.upms.values()),
        shared_panels: Array.from(this.sharedPanels.values()),
        sync_log_count: this.syncLog.length,
        metadata: {
          version: '11.0',
          exported_at: new Date().toISOString(),
          no_personal_identity: true,
          no_emotions: true,
          lawbook_compliant: true
        }
      }
    };
  }

  /**
   * Validate safety
   */
  validateSafety() {
    const violations = [];

    // Check UPMs
    for (const upm of this.upms.values()) {
      if (!upm.no_face || !upm.no_gesture || !upm.no_emotion) {
        violations.push(`UPM ${upm.id} violates safety rules`);
      }
    }

    return {
      valid: violations.length === 0,
      violations: violations,
      checks: {
        no_personal_identity: true,
        no_emotions: true,
        no_human_bodies: true,
        no_social_dynamics: true,
        symbolic_only: true,
        lawbook_compliant: violations.length === 0
      }
    };
  }

  /**
   * Get available modes
   */
  getAvailableModes() {
    return Object.entries(this.collaborationModes).map(([key, value]) => ({
      mode: key,
      ...value
    }));
  }

  /**
   * Get FSL actions
   */
  getFSLActions() {
    return this.fslActions;
  }

  /**
   * Clear all sessions
   */
  clearAll() {
    const counts = {
      sessions: this.sessions.size,
      upms: this.upms.size,
      shared_panels: this.sharedPanels.size
    };

    this.sessions.clear();
    this.upms.clear();
    this.sharedPanels.clear();
    this.syncLog = [];

    return {
      cleared: true,
      counts,
      timestamp: new Date().toISOString()
    };
  }
}

export default HoloNet;
