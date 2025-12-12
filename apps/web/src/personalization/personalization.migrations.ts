/* =====================================================
   CHE·NU — Personalization Migrations
   
   Handle version upgrades for personalization data.
   Each migration transforms from version N to N+1.
   ===================================================== */

import {
  CheNuPersonalization,
  XRPersonalization,
  UIPersonalization,
  NotificationPersonalization,
  DEFAULT_XR_PERSONALIZATION,
  DEFAULT_UI_PERSONALIZATION,
  DEFAULT_NOTIFICATION_PERSONALIZATION,
  DEFAULT_SHORTCUTS,
} from './personalization.types';

// ─────────────────────────────────────────────────────
// VERSION
// ─────────────────────────────────────────────────────

export const CURRENT_VERSION = 3;

// ─────────────────────────────────────────────────────
// MIGRATION FUNCTIONS
// ─────────────────────────────────────────────────────

type MigrationFn = (data: any) => any;

const migrations: Record<number, MigrationFn> = {
  // v1 → v2: Add UI personalization
  1: (data: any) => {
    return {
      ...data,
      version: 2,
      ui: DEFAULT_UI_PERSONALIZATION,
      notifications: DEFAULT_NOTIFICATION_PERSONALIZATION,
    };
  },

  // v2 → v3: Add keyboard shortcuts, XR quality settings
  2: (data: any) => {
    const xr: XRPersonalization = {
      ...DEFAULT_XR_PERSONALIZATION,
      ...data.xr,
      // New fields
      qualityLevel: data.xr?.qualityLevel ?? 'medium',
      showHands: data.xr?.showHands ?? true,
      showAvatars: data.xr?.showAvatars ?? true,
      particleEffects: data.xr?.particleEffects ?? true,
      bloomEffect: data.xr?.bloomEffect ?? true,
    };

    // Migrate spheres: add new fields
    const spheres = (data.spheres || []).map((s: any) => ({
      ...s,
      collapsed: s.collapsed ?? false,
      sortOrder: s.sortOrder ?? 0,
      notificationsEnabled: s.notificationsEnabled ?? true,
      visitCount: s.visitCount ?? 0,
    }));

    // Migrate agents: add new fields
    const agents = (data.agents || []).map((a: any) => ({
      ...a,
      avatarStyle: a.avatarStyle ?? 'abstract',
      voiceEnabled: a.voiceEnabled ?? true,
      responseStyle: a.responseStyle ?? 'balanced',
      interactionCount: a.interactionCount ?? 0,
      trustLevel: a.trustLevel ?? 50,
    }));

    return {
      ...data,
      version: 3,
      xr,
      spheres,
      agents,
      shortcuts: DEFAULT_SHORTCUTS,
      language: data.language ?? 'fr-CA',
    };
  },
};

// ─────────────────────────────────────────────────────
// MIGRATE FUNCTION
// ─────────────────────────────────────────────────────

/**
 * Migrate personalization data to current version.
 */
export function migratePersonalization(data: any): CheNuPersonalization {
  let current = { ...data };
  let version = current.version || 1;

  // Apply migrations sequentially
  while (version < CURRENT_VERSION) {
    const migration = migrations[version];
    if (!migration) {
      console.warn(`[Personalization] No migration for version ${version}`);
      break;
    }

    console.log(`[Personalization] Migrating v${version} → v${version + 1}`);
    current = migration(current);
    version = current.version;
  }

  // Ensure all required fields exist
  return ensureRequiredFields(current);
}

/**
 * Ensure all required fields exist with defaults.
 */
function ensureRequiredFields(data: any): CheNuPersonalization {
  const now = Date.now();

  return {
    // Version
    version: data.version ?? CURRENT_VERSION,

    // Global
    themeGlobal: data.themeGlobal ?? 'realistic',
    density: data.density ?? 'balanced',
    language: data.language ?? 'fr-CA',

    // Collections
    spheres: Array.isArray(data.spheres) ? data.spheres : [],
    agents: Array.isArray(data.agents) ? data.agents : [],

    // Modules
    xr: {
      ...DEFAULT_XR_PERSONALIZATION,
      ...data.xr,
    },
    ui: {
      ...DEFAULT_UI_PERSONALIZATION,
      ...data.ui,
    },
    notifications: {
      ...DEFAULT_NOTIFICATION_PERSONALIZATION,
      ...data.notifications,
    },
    shortcuts: Array.isArray(data.shortcuts) && data.shortcuts.length > 0
      ? data.shortcuts
      : DEFAULT_SHORTCUTS,

    // Metadata
    createdAt: data.createdAt ?? now,
    updatedAt: data.updatedAt ?? now,
    lastSyncedAt: data.lastSyncedAt,
  };
}

// ─────────────────────────────────────────────────────
// VALIDATION
// ─────────────────────────────────────────────────────

/**
 * Validate personalization data structure.
 */
export function validatePersonalization(data: any): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check version
  if (typeof data.version !== 'number') {
    errors.push('Missing or invalid version');
  }

  // Check global fields
  if (typeof data.themeGlobal !== 'string') {
    errors.push('Missing or invalid themeGlobal');
  }
  if (!['minimal', 'balanced', 'rich'].includes(data.density)) {
    errors.push('Invalid density value');
  }

  // Check arrays
  if (!Array.isArray(data.spheres)) {
    errors.push('Spheres must be an array');
  }
  if (!Array.isArray(data.agents)) {
    errors.push('Agents must be an array');
  }

  // Check XR
  if (data.xr && typeof data.xr !== 'object') {
    errors.push('Invalid XR settings');
  }

  // Check UI
  if (data.ui && typeof data.ui !== 'object') {
    errors.push('Invalid UI settings');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ─────────────────────────────────────────────────────
// CLEANUP
// ─────────────────────────────────────────────────────

/**
 * Clean up personalization data (remove unused entries).
 */
export function cleanupPersonalization(
  data: CheNuPersonalization,
  activeSphereIds: string[],
  activeAgentIds: string[]
): CheNuPersonalization {
  // Remove entries for spheres that no longer exist
  const spheres = data.spheres.filter(s => 
    activeSphereIds.includes(s.sphereId)
  );

  // Remove entries for agents that no longer exist
  const agents = data.agents.filter(a => 
    activeAgentIds.includes(a.agentId)
  );

  return {
    ...data,
    spheres,
    agents,
    updatedAt: Date.now(),
  };
}

// ─────────────────────────────────────────────────────
// DEBUG
// ─────────────────────────────────────────────────────

/**
 * Get migration info for debugging.
 */
export function getMigrationInfo(): {
  currentVersion: number;
  availableMigrations: number[];
} {
  return {
    currentVersion: CURRENT_VERSION,
    availableMigrations: Object.keys(migrations).map(Number).sort((a, b) => a - b),
  };
}

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default {
  CURRENT_VERSION,
  migratePersonalization,
  validatePersonalization,
  cleanupPersonalization,
  getMigrationInfo,
};
