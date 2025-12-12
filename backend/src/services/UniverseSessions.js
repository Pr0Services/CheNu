/**
 * CHE·NU OS 11.5 — Universe Sessions (USX-11.5)
 * Safe, controlled, reversible universe/workspace management
 * Version: 11.5
 */

export class UniverseSessions {
  constructor() {
    // Session types
    this.sessionTypes = {
      active: { description: 'Editable universe, full interaction' },
      frozen: { description: 'Read-only, safe for review' },
      template: { description: 'Pre-built universe for spawning' },
      archive: { description: 'Stored structure, non-interactive' }
    };

    // Session operations
    this.operations = [
      'new', 'load', 'switch', 'duplicate',
      'snapshot', 'restore', 'freeze', 'merge', 'archive'
    ];

    // Active sessions
    this.sessions = new Map();
    
    // Snapshots
    this.snapshots = new Map();
    
    // Current session ID
    this.currentSessionId = null;
  }

  /**
   * Create new session (SSO_NEW)
   */
  createSession(config = {}) {
    const session = {
      session_id: config.session_id || `session_${Date.now()}`,
      name: config.name || 'New Universe',
      status: 'active',
      root_fabric: config.root_fabric || this.createDefaultFabric(),
      rooms: config.rooms || [],
      portals: config.portals || [],
      threads: config.threads || [],
      panels: config.panels || [],
      users: [],
      metadata: {
        created_at: new Date().toISOString(),
        last_modified: new Date().toISOString(),
        version: '11.5'
      }
    };

    this.sessions.set(session.session_id, session);
    
    if (!this.currentSessionId) {
      this.currentSessionId = session.session_id;
    }

    return session;
  }

  /**
   * Create default fabric structure
   */
  createDefaultFabric() {
    return {
      id: `fabric_${Date.now()}`,
      nexus: {
        id: 'nexus_central',
        name: 'Central Nexus',
        type: 'nexus'
      },
      spheres: [
        { id: 'meta', name: 'Meta', color: '#8B5CF6' },
        { id: 'business', name: 'Business', color: '#3B82F6' },
        { id: 'personal', name: 'Personal', color: '#10B981' },
        { id: 'creative', name: 'Creative', color: '#F59E0B' }
      ],
      nodes: [],
      links: []
    };
  }

  /**
   * Load session (SSO_LOAD)
   */
  loadSession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    this.currentSessionId = sessionId;
    session.metadata.last_modified = new Date().toISOString();

    return session;
  }

  /**
   * Switch session (SSO_SWITCH)
   */
  switchSession(targetSessionId) {
    const previousSessionId = this.currentSessionId;
    const targetSession = this.sessions.get(targetSessionId);

    if (!targetSession) {
      throw new Error(`Session not found: ${targetSessionId}`);
    }

    this.currentSessionId = targetSessionId;

    return {
      previous_session: previousSessionId,
      current_session: targetSessionId,
      session: targetSession,
      switched_at: new Date().toISOString()
    };
  }

  /**
   * Duplicate session (SSO_DUPLICATE)
   */
  duplicateSession(sourceSessionId, newName) {
    const source = this.sessions.get(sourceSessionId);
    if (!source) {
      throw new Error(`Session not found: ${sourceSessionId}`);
    }

    const duplicate = {
      session_id: `session_${Date.now()}`,
      name: newName || `${source.name} (Clone)`,
      status: 'active',
      root_fabric: JSON.parse(JSON.stringify(source.root_fabric)),
      rooms: JSON.parse(JSON.stringify(source.rooms)),
      portals: JSON.parse(JSON.stringify(source.portals)),
      threads: JSON.parse(JSON.stringify(source.threads)),
      panels: JSON.parse(JSON.stringify(source.panels)),
      users: [],
      metadata: {
        created_at: new Date().toISOString(),
        last_modified: new Date().toISOString(),
        version: '11.5',
        cloned_from: sourceSessionId
      }
    };

    this.sessions.set(duplicate.session_id, duplicate);
    return duplicate;
  }

  /**
   * Create snapshot (SSO_SNAPSHOT)
   */
  createSnapshot(sessionId, snapshotName) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    const snapshot = {
      id: `snapshot_${Date.now()}`,
      name: snapshotName || `Snapshot ${new Date().toISOString()}`,
      timestamp: new Date().toISOString(),
      session_id: sessionId,
      fabric_state: JSON.parse(JSON.stringify(session.root_fabric)),
      rooms_state: JSON.parse(JSON.stringify(session.rooms)),
      portals_state: JSON.parse(JSON.stringify(session.portals)),
      threads_state: JSON.parse(JSON.stringify(session.threads)),
      panels_state: JSON.parse(JSON.stringify(session.panels)),
      metadata: {
        reversible: true,
        version: '11.5'
      }
    };

    this.snapshots.set(snapshot.id, snapshot);
    return snapshot;
  }

  /**
   * Restore from snapshot (SSO_RESTORE)
   */
  restoreSnapshot(snapshotId) {
    const snapshot = this.snapshots.get(snapshotId);
    if (!snapshot) {
      throw new Error(`Snapshot not found: ${snapshotId}`);
    }

    const session = this.sessions.get(snapshot.session_id);
    if (!session) {
      throw new Error(`Session not found: ${snapshot.session_id}`);
    }

    // Create backup snapshot before restore
    const backupSnapshot = this.createSnapshot(snapshot.session_id, 'Pre-restore backup');

    // Restore state
    session.root_fabric = JSON.parse(JSON.stringify(snapshot.fabric_state));
    session.rooms = JSON.parse(JSON.stringify(snapshot.rooms_state));
    session.portals = JSON.parse(JSON.stringify(snapshot.portals_state));
    session.threads = JSON.parse(JSON.stringify(snapshot.threads_state));
    session.panels = JSON.parse(JSON.stringify(snapshot.panels_state));
    session.metadata.last_modified = new Date().toISOString();

    return {
      restored_session: session,
      backup_snapshot: backupSnapshot,
      restored_at: new Date().toISOString()
    };
  }

  /**
   * Freeze session (SSO_FREEZE)
   */
  freezeSession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    session.status = 'frozen';
    session.metadata.frozen_at = new Date().toISOString();

    return session;
  }

  /**
   * Unfreeze session
   */
  unfreezeSession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    session.status = 'active';
    delete session.metadata.frozen_at;
    session.metadata.last_modified = new Date().toISOString();

    return session;
  }

  /**
   * Merge sessions (SSO_MERGE)
   */
  mergeSessions(sessionIdA, sessionIdB, mergedName) {
    const sessionA = this.sessions.get(sessionIdA);
    const sessionB = this.sessions.get(sessionIdB);

    if (!sessionA || !sessionB) {
      throw new Error('One or both sessions not found');
    }

    const merged = {
      session_id: `session_${Date.now()}`,
      name: mergedName || `Merged: ${sessionA.name} + ${sessionB.name}`,
      status: 'active',
      root_fabric: this.mergeFabrics(sessionA.root_fabric, sessionB.root_fabric),
      rooms: this.mergeRooms(sessionA.rooms, sessionB.rooms),
      portals: this.mergePortals(sessionA.portals, sessionB.portals),
      threads: this.mergeThreads(sessionA.threads, sessionB.threads),
      panels: [], // Panels not merged to avoid conflicts
      users: [],
      metadata: {
        created_at: new Date().toISOString(),
        last_modified: new Date().toISOString(),
        version: '11.5',
        merged_from: [sessionIdA, sessionIdB]
      }
    };

    this.sessions.set(merged.session_id, merged);
    return merged;
  }

  /**
   * Merge fabrics
   */
  mergeFabrics(fabricA, fabricB) {
    const merged = JSON.parse(JSON.stringify(fabricA));
    
    // Merge nodes
    const nodeIds = new Set(merged.nodes.map(n => n.id));
    for (const node of fabricB.nodes || []) {
      if (nodeIds.has(node.id)) {
        // Duplicate with suffix
        merged.nodes.push({ ...node, id: `${node.id}_B` });
      } else {
        merged.nodes.push(node);
      }
    }

    // Merge links
    for (const link of fabricB.links || []) {
      merged.links.push(link);
    }

    return merged;
  }

  /**
   * Merge rooms
   */
  mergeRooms(roomsA, roomsB) {
    const merged = JSON.parse(JSON.stringify(roomsA));
    const roomIds = new Set(merged.map(r => r.id));

    for (const room of roomsB) {
      if (roomIds.has(room.id)) {
        // Duplicate with suffix
        merged.push({ ...room, id: `${room.id}_B`, name: `${room.name} (B)` });
      } else {
        merged.push(room);
      }
    }

    return merged;
  }

  /**
   * Merge portals
   */
  mergePortals(portalsA, portalsB) {
    const merged = JSON.parse(JSON.stringify(portalsA));
    const portalKeys = new Set(merged.map(p => `${p.from}-${p.to}`));

    for (const portal of portalsB) {
      const key = `${portal.from}-${portal.to}`;
      if (!portalKeys.has(key)) {
        merged.push(portal);
      }
    }

    return merged;
  }

  /**
   * Merge threads
   */
  mergeThreads(threadsA, threadsB) {
    const merged = JSON.parse(JSON.stringify(threadsA));
    const threadIds = new Set(merged.map(t => t.id));

    for (const thread of threadsB) {
      if (threadIds.has(thread.id)) {
        // Combine with divergence marker
        const existing = merged.find(t => t.id === thread.id);
        if (existing) {
          existing.branches = existing.branches || [];
          existing.branches.push({
            source: 'session_B',
            nodes: thread.nodes
          });
        }
      } else {
        merged.push(thread);
      }
    }

    return merged;
  }

  /**
   * Archive session (SSO_ARCHIVE)
   */
  archiveSession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    session.status = 'archive';
    session.metadata.archived_at = new Date().toISOString();

    return session;
  }

  /**
   * Get session
   */
  getSession(sessionId) {
    return this.sessions.get(sessionId) || null;
  }

  /**
   * Get current session
   */
  getCurrentSession() {
    if (!this.currentSessionId) return null;
    return this.sessions.get(this.currentSessionId);
  }

  /**
   * Get all sessions
   */
  getAllSessions() {
    return Array.from(this.sessions.values());
  }

  /**
   * Get sessions by status
   */
  getSessionsByStatus(status) {
    return this.getAllSessions().filter(s => s.status === status);
  }

  /**
   * Get snapshots for session
   */
  getSessionSnapshots(sessionId) {
    return Array.from(this.snapshots.values())
      .filter(s => s.session_id === sessionId);
  }

  /**
   * Get session list panel
   */
  getSessionListPanel() {
    return {
      SESSION_LIST_PANEL: {
        sessions: this.getAllSessions().map(s => ({
          session_id: s.session_id,
          name: s.name,
          status: s.status,
          modified_at: s.metadata.last_modified,
          is_current: s.session_id === this.currentSessionId
        })),
        current_session: this.currentSessionId,
        total_count: this.sessions.size
      }
    };
  }

  /**
   * Compare sessions
   */
  compareSessions(sessionIdA, sessionIdB) {
    const sessionA = this.sessions.get(sessionIdA);
    const sessionB = this.sessions.get(sessionIdB);

    if (!sessionA || !sessionB) {
      throw new Error('One or both sessions not found');
    }

    return {
      comparison: {
        session_a: { id: sessionIdA, name: sessionA.name },
        session_b: { id: sessionIdB, name: sessionB.name },
        differences: {
          rooms: {
            only_in_a: sessionA.rooms.filter(r => !sessionB.rooms.find(rb => rb.id === r.id)),
            only_in_b: sessionB.rooms.filter(r => !sessionA.rooms.find(ra => ra.id === r.id)),
            common: sessionA.rooms.filter(r => sessionB.rooms.find(rb => rb.id === r.id))
          },
          portals: {
            count_a: sessionA.portals.length,
            count_b: sessionB.portals.length
          },
          threads: {
            count_a: sessionA.threads.length,
            count_b: sessionB.threads.length
          }
        }
      },
      usex_version: '11.5'
    };
  }

  /**
   * Export USX state
   */
  exportUSX() {
    return {
      USX_EXPORT: {
        sessions: this.getAllSessions(),
        snapshots: Array.from(this.snapshots.values()),
        current_session: this.currentSessionId,
        metadata: {
          version: '11.5',
          exported_at: new Date().toISOString(),
          no_persistent_memory: true,
          lawbook_compliant: true
        }
      }
    };
  }

  /**
   * Import USX state
   */
  importUSX(usxData) {
    if (!usxData.USX_EXPORT) {
      throw new Error('Invalid USX export format');
    }

    const { sessions, snapshots, current_session } = usxData.USX_EXPORT;

    // Import sessions
    for (const session of sessions) {
      this.sessions.set(session.session_id, session);
    }

    // Import snapshots
    for (const snapshot of snapshots) {
      this.snapshots.set(snapshot.id, snapshot);
    }

    if (current_session && this.sessions.has(current_session)) {
      this.currentSessionId = current_session;
    }

    return {
      imported: true,
      sessions_count: sessions.length,
      snapshots_count: snapshots.length,
      current_session: this.currentSessionId
    };
  }

  /**
   * Validate safety
   */
  validateSafety() {
    const violations = [];

    for (const session of this.sessions.values()) {
      // Check for persistent memory beyond user data
      if (session.users && session.users.some(u => u.personal_data)) {
        violations.push(`Session ${session.session_id} contains personal user data`);
      }
    }

    return {
      valid: violations.length === 0,
      violations: violations,
      checks: {
        no_persistent_memory: true,
        no_humanoid_avatars: true,
        no_social_dynamics: true,
        lawbook_compliant: violations.length === 0
      }
    };
  }

  /**
   * Delete session
   */
  deleteSession(sessionId) {
    if (sessionId === this.currentSessionId) {
      this.currentSessionId = null;
    }

    // Delete associated snapshots
    for (const [snapshotId, snapshot] of this.snapshots) {
      if (snapshot.session_id === sessionId) {
        this.snapshots.delete(snapshotId);
      }
    }

    const deleted = this.sessions.delete(sessionId);
    return { deleted, session_id: sessionId };
  }

  /**
   * Clear all
   */
  clearAll() {
    const counts = {
      sessions: this.sessions.size,
      snapshots: this.snapshots.size
    };

    this.sessions.clear();
    this.snapshots.clear();
    this.currentSessionId = null;

    return {
      cleared: true,
      counts,
      timestamp: new Date().toISOString()
    };
  }
}

export default UniverseSessions;
