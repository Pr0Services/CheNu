/* =====================================================
   CHE·NU — Personalization Engine
   
   Pure functions for manipulating personalization state.
   Immutable operations, no side effects.
   ===================================================== */

import {
  CheNuPersonalization,
  SpherePersonalization,
  AgentPersonalization,
  XRPersonalization,
  UIPersonalization,
  NotificationPersonalization,
  KeyboardShortcut,
  DensityLevel,
  AgentAvatarStyle,
  XRAmbiance,
  DEFAULT_SPHERE_PERSONALIZATION,
  DEFAULT_AGENT_PERSONALIZATION,
  PersonalizationEvent,
} from './personalization.types';

// ─────────────────────────────────────────────────────
// GLOBAL SETTINGS
// ─────────────────────────────────────────────────────

/**
 * Set global theme.
 */
export function setGlobalTheme(
  state: CheNuPersonalization,
  themeId: string
): CheNuPersonalization {
  return {
    ...state,
    themeGlobal: themeId,
    updatedAt: Date.now(),
  };
}

/**
 * Set density level.
 */
export function setDensity(
  state: CheNuPersonalization,
  density: DensityLevel
): CheNuPersonalization {
  return {
    ...state,
    density,
    updatedAt: Date.now(),
  };
}

/**
 * Set language.
 */
export function setLanguage(
  state: CheNuPersonalization,
  language: string
): CheNuPersonalization {
  return {
    ...state,
    language,
    updatedAt: Date.now(),
  };
}

// ─────────────────────────────────────────────────────
// SPHERE PERSONALIZATION
// ─────────────────────────────────────────────────────

/**
 * Get or create sphere personalization.
 */
export function getSpherePersonalization(
  state: CheNuPersonalization,
  sphereId: string
): SpherePersonalization {
  const existing = state.spheres.find(s => s.sphereId === sphereId);
  if (existing) return existing;
  
  return {
    ...DEFAULT_SPHERE_PERSONALIZATION,
    sphereId,
  };
}

/**
 * Update sphere personalization.
 */
export function updateSphere(
  state: CheNuPersonalization,
  sphereId: string,
  updates: Partial<SpherePersonalization>
): CheNuPersonalization {
  const existing = state.spheres.find(s => s.sphereId === sphereId);
  
  let spheres: SpherePersonalization[];
  
  if (existing) {
    spheres = state.spheres.map(s =>
      s.sphereId === sphereId
        ? { ...s, ...updates }
        : s
    );
  } else {
    spheres = [
      ...state.spheres,
      { ...DEFAULT_SPHERE_PERSONALIZATION, sphereId, ...updates },
    ];
  }

  return {
    ...state,
    spheres,
    updatedAt: Date.now(),
  };
}

/**
 * Toggle sphere visibility.
 */
export function toggleSphereVisibility(
  state: CheNuPersonalization,
  sphereId: string
): CheNuPersonalization {
  const sphere = getSpherePersonalization(state, sphereId);
  return updateSphere(state, sphereId, { visible: !sphere.visible });
}

/**
 * Pin/unpin sphere.
 */
export function toggleSpherePinned(
  state: CheNuPersonalization,
  sphereId: string
): CheNuPersonalization {
  const sphere = getSpherePersonalization(state, sphereId);
  return updateSphere(state, sphereId, { pinned: !sphere.pinned });
}

/**
 * Pin sphere (set pinned = true).
 */
export function pinSphere(
  state: CheNuPersonalization,
  sphereId: string
): CheNuPersonalization {
  return updateSphere(state, sphereId, { pinned: true });
}

/**
 * Unpin sphere.
 */
export function unpinSphere(
  state: CheNuPersonalization,
  sphereId: string
): CheNuPersonalization {
  return updateSphere(state, sphereId, { pinned: false });
}

/**
 * Set sphere theme override.
 */
export function setSphereTheme(
  state: CheNuPersonalization,
  sphereId: string,
  themeId: string | undefined
): CheNuPersonalization {
  return updateSphere(state, sphereId, { themeOverride: themeId });
}

/**
 * Record sphere visit.
 */
export function recordSphereVisit(
  state: CheNuPersonalization,
  sphereId: string
): CheNuPersonalization {
  const sphere = getSpherePersonalization(state, sphereId);
  return updateSphere(state, sphereId, {
    lastVisited: Date.now(),
    visitCount: sphere.visitCount + 1,
  });
}

/**
 * Reorder spheres.
 */
export function reorderSpheres(
  state: CheNuPersonalization,
  sphereIds: string[]
): CheNuPersonalization {
  const spheres = sphereIds.map((id, index) => {
    const existing = state.spheres.find(s => s.sphereId === id);
    return existing
      ? { ...existing, sortOrder: index }
      : { ...DEFAULT_SPHERE_PERSONALIZATION, sphereId: id, sortOrder: index };
  });

  return {
    ...state,
    spheres,
    updatedAt: Date.now(),
  };
}

/**
 * Get visible spheres sorted by sortOrder.
 */
export function getVisibleSpheres(
  state: CheNuPersonalization,
  allSphereIds: string[]
): string[] {
  // First, get all sphere personalizations (or defaults)
  const spherePrefs = allSphereIds.map(id => getSpherePersonalization(state, id));
  
  // Filter visible, sort by pinned then sortOrder
  return spherePrefs
    .filter(s => s.visible)
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return a.sortOrder - b.sortOrder;
    })
    .map(s => s.sphereId);
}

// ─────────────────────────────────────────────────────
// AGENT PERSONALIZATION
// ─────────────────────────────────────────────────────

/**
 * Get or create agent personalization.
 */
export function getAgentPersonalization(
  state: CheNuPersonalization,
  agentId: string
): AgentPersonalization {
  const existing = state.agents.find(a => a.agentId === agentId);
  if (existing) return existing;
  
  return {
    ...DEFAULT_AGENT_PERSONALIZATION,
    agentId,
  };
}

/**
 * Update agent personalization.
 */
export function updateAgent(
  state: CheNuPersonalization,
  agentId: string,
  updates: Partial<AgentPersonalization>
): CheNuPersonalization {
  const existing = state.agents.find(a => a.agentId === agentId);
  
  let agents: AgentPersonalization[];
  
  if (existing) {
    agents = state.agents.map(a =>
      a.agentId === agentId
        ? { ...a, ...updates }
        : a
    );
  } else {
    agents = [
      ...state.agents,
      { ...DEFAULT_AGENT_PERSONALIZATION, agentId, ...updates },
    ];
  }

  return {
    ...state,
    agents,
    updatedAt: Date.now(),
  };
}

/**
 * Toggle agent visibility.
 */
export function toggleAgentVisibility(
  state: CheNuPersonalization,
  agentId: string
): CheNuPersonalization {
  const agent = getAgentPersonalization(state, agentId);
  return updateAgent(state, agentId, { visible: !agent.visible });
}

/**
 * Toggle agent favorite.
 */
export function toggleAgentFavorite(
  state: CheNuPersonalization,
  agentId: string
): CheNuPersonalization {
  const agent = getAgentPersonalization(state, agentId);
  return updateAgent(state, agentId, { favorite: !agent.favorite });
}

/**
 * Set agent avatar style.
 */
export function setAgentAvatarStyle(
  state: CheNuPersonalization,
  agentId: string,
  style: AgentAvatarStyle
): CheNuPersonalization {
  return updateAgent(state, agentId, { avatarStyle: style });
}

/**
 * Record agent interaction.
 */
export function recordAgentInteraction(
  state: CheNuPersonalization,
  agentId: string
): CheNuPersonalization {
  const agent = getAgentPersonalization(state, agentId);
  return updateAgent(state, agentId, {
    lastInteraction: Date.now(),
    interactionCount: agent.interactionCount + 1,
  });
}

/**
 * Adjust agent trust level.
 */
export function adjustAgentTrust(
  state: CheNuPersonalization,
  agentId: string,
  delta: number
): CheNuPersonalization {
  const agent = getAgentPersonalization(state, agentId);
  const newTrust = Math.max(0, Math.min(100, agent.trustLevel + delta));
  return updateAgent(state, agentId, { trustLevel: newTrust });
}

/**
 * Get favorite agents.
 */
export function getFavoriteAgents(state: CheNuPersonalization): string[] {
  return state.agents
    .filter(a => a.favorite)
    .map(a => a.agentId);
}

/**
 * Get visible agents.
 */
export function getVisibleAgents(
  state: CheNuPersonalization,
  allAgentIds: string[]
): string[] {
  return allAgentIds.filter(id => {
    const pref = getAgentPersonalization(state, id);
    return pref.visible;
  });
}

// ─────────────────────────────────────────────────────
// XR SETTINGS
// ─────────────────────────────────────────────────────

/**
 * Update XR settings.
 */
export function updateXRSettings(
  state: CheNuPersonalization,
  updates: Partial<XRPersonalization>
): CheNuPersonalization {
  return {
    ...state,
    xr: { ...state.xr, ...updates },
    updatedAt: Date.now(),
  };
}

/**
 * Toggle XR enabled.
 */
export function toggleXREnabled(
  state: CheNuPersonalization
): CheNuPersonalization {
  return updateXRSettings(state, { enabled: !state.xr.enabled });
}

/**
 * Set XR ambiance.
 */
export function setXRAmbiance(
  state: CheNuPersonalization,
  ambiance: XRAmbiance
): CheNuPersonalization {
  return updateXRSettings(state, { ambiance });
}

/**
 * Set XR quality.
 */
export function setXRQuality(
  state: CheNuPersonalization,
  qualityLevel: XRPersonalization['qualityLevel']
): CheNuPersonalization {
  return updateXRSettings(state, { qualityLevel });
}

// ─────────────────────────────────────────────────────
// UI SETTINGS
// ─────────────────────────────────────────────────────

/**
 * Update UI settings.
 */
export function updateUISettings(
  state: CheNuPersonalization,
  updates: Partial<UIPersonalization>
): CheNuPersonalization {
  return {
    ...state,
    ui: { ...state.ui, ...updates },
    updatedAt: Date.now(),
  };
}

/**
 * Toggle sidebar collapsed.
 */
export function toggleSidebar(
  state: CheNuPersonalization
): CheNuPersonalization {
  return updateUISettings(state, { sidebarCollapsed: !state.ui.sidebarCollapsed });
}

/**
 * Set sidebar position.
 */
export function setSidebarPosition(
  state: CheNuPersonalization,
  position: UIPersonalization['sidebarPosition']
): CheNuPersonalization {
  return updateUISettings(state, { sidebarPosition: position });
}

/**
 * Set font size.
 */
export function setFontSize(
  state: CheNuPersonalization,
  fontSize: UIPersonalization['fontSize']
): CheNuPersonalization {
  return updateUISettings(state, { fontSize });
}

/**
 * Toggle reduced motion.
 */
export function toggleReducedMotion(
  state: CheNuPersonalization
): CheNuPersonalization {
  return updateUISettings(state, { reducedMotion: !state.ui.reducedMotion });
}

/**
 * Toggle high contrast.
 */
export function toggleHighContrast(
  state: CheNuPersonalization
): CheNuPersonalization {
  return updateUISettings(state, { highContrast: !state.ui.highContrast });
}

// ─────────────────────────────────────────────────────
// NOTIFICATION SETTINGS
// ─────────────────────────────────────────────────────

/**
 * Update notification settings.
 */
export function updateNotificationSettings(
  state: CheNuPersonalization,
  updates: Partial<NotificationPersonalization>
): CheNuPersonalization {
  return {
    ...state,
    notifications: { ...state.notifications, ...updates },
    updatedAt: Date.now(),
  };
}

/**
 * Toggle notifications enabled.
 */
export function toggleNotifications(
  state: CheNuPersonalization
): CheNuPersonalization {
  return updateNotificationSettings(state, { enabled: !state.notifications.enabled });
}

/**
 * Set quiet hours.
 */
export function setQuietHours(
  state: CheNuPersonalization,
  enabled: boolean,
  start?: string,
  end?: string
): CheNuPersonalization {
  return updateNotificationSettings(state, {
    quietHoursEnabled: enabled,
    ...(start && { quietHoursStart: start }),
    ...(end && { quietHoursEnd: end }),
  });
}

// ─────────────────────────────────────────────────────
// KEYBOARD SHORTCUTS
// ─────────────────────────────────────────────────────

/**
 * Update keyboard shortcut.
 */
export function updateShortcut(
  state: CheNuPersonalization,
  action: string,
  keys: string
): CheNuPersonalization {
  const shortcuts = state.shortcuts.map(s =>
    s.action === action ? { ...s, keys } : s
  );

  return {
    ...state,
    shortcuts,
    updatedAt: Date.now(),
  };
}

/**
 * Toggle shortcut enabled.
 */
export function toggleShortcut(
  state: CheNuPersonalization,
  action: string
): CheNuPersonalization {
  const shortcuts = state.shortcuts.map(s =>
    s.action === action ? { ...s, enabled: !s.enabled } : s
  );

  return {
    ...state,
    shortcuts,
    updatedAt: Date.now(),
  };
}

/**
 * Reset shortcuts to defaults.
 */
export function resetShortcuts(
  state: CheNuPersonalization,
  defaults: KeyboardShortcut[]
): CheNuPersonalization {
  return {
    ...state,
    shortcuts: [...defaults],
    updatedAt: Date.now(),
  };
}

// ─────────────────────────────────────────────────────
// EVENT REDUCER
// ─────────────────────────────────────────────────────

import { DEFAULT_PERSONALIZATION, createPersonalization } from './personalization.defaults';

/**
 * Reduce personalization state from event.
 */
export function reducePersonalization(
  state: CheNuPersonalization,
  event: PersonalizationEvent
): CheNuPersonalization {
  switch (event.type) {
    case 'THEME_CHANGE':
      return setGlobalTheme(state, event.themeId);
    
    case 'DENSITY_CHANGE':
      return setDensity(state, event.density);
    
    case 'SPHERE_UPDATE':
      return updateSphere(state, event.sphereId, event.updates);
    
    case 'AGENT_UPDATE':
      return updateAgent(state, event.agentId, event.updates);
    
    case 'XR_UPDATE':
      return updateXRSettings(state, event.updates);
    
    case 'UI_UPDATE':
      return updateUISettings(state, event.updates);
    
    case 'NOTIFICATION_UPDATE':
      return updateNotificationSettings(state, event.updates);
    
    case 'SHORTCUT_UPDATE':
      return updateShortcut(state, event.action, event.keys);
    
    case 'RESET':
      if (event.section) {
        // Reset specific section
        return {
          ...state,
          ...(event.section === 'spheres' && { spheres: [] }),
          ...(event.section === 'agents' && { agents: [] }),
          ...(event.section === 'xr' && { xr: DEFAULT_PERSONALIZATION.xr }),
          ...(event.section === 'ui' && { ui: DEFAULT_PERSONALIZATION.ui }),
          ...(event.section === 'notifications' && { notifications: DEFAULT_PERSONALIZATION.notifications }),
          ...(event.section === 'shortcuts' && { shortcuts: DEFAULT_PERSONALIZATION.shortcuts }),
          updatedAt: Date.now(),
        };
      }
      // Full reset
      return createPersonalization();
    
    case 'IMPORT':
      return {
        ...event.data,
        updatedAt: Date.now(),
      };
    
    case 'SYNC':
      return {
        ...state,
        lastSyncedAt: event.timestamp,
      };
    
    default:
      return state;
  }
}

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default {
  // Global
  setGlobalTheme,
  setDensity,
  setLanguage,
  
  // Spheres
  getSpherePersonalization,
  updateSphere,
  toggleSphereVisibility,
  toggleSpherePinned,
  pinSphere,
  unpinSphere,
  setSphereTheme,
  recordSphereVisit,
  reorderSpheres,
  getVisibleSpheres,
  
  // Agents
  getAgentPersonalization,
  updateAgent,
  toggleAgentVisibility,
  toggleAgentFavorite,
  setAgentAvatarStyle,
  recordAgentInteraction,
  adjustAgentTrust,
  getFavoriteAgents,
  getVisibleAgents,
  
  // XR
  updateXRSettings,
  toggleXREnabled,
  setXRAmbiance,
  setXRQuality,
  
  // UI
  updateUISettings,
  toggleSidebar,
  setSidebarPosition,
  setFontSize,
  toggleReducedMotion,
  toggleHighContrast,
  
  // Notifications
  updateNotificationSettings,
  toggleNotifications,
  setQuietHours,
  
  // Shortcuts
  updateShortcut,
  toggleShortcut,
  resetShortcuts,
  
  // Reducer
  reducePersonalization,
};
