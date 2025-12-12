/* =====================================================
   CHE·NU — Personalization Store
   
   Persistence layer for personalization settings.
   Supports localStorage, sessionStorage, and sync.
   ===================================================== */

import { CheNuPersonalization } from './personalization.types';
import { DEFAULT_PERSONALIZATION, createPersonalization } from './personalization.defaults';
import { migratePersonalization, CURRENT_VERSION } from './personalization.migrations';

// ─────────────────────────────────────────────────────
// STORAGE KEYS
// ─────────────────────────────────────────────────────

const STORAGE_KEY = "che-nu.personalization";
const BACKUP_KEY = "che-nu.personalization.backup";
const SYNC_KEY = "che-nu.personalization.sync-status";

// ─────────────────────────────────────────────────────
// LOAD
// ─────────────────────────────────────────────────────

/**
 * Load personalization from localStorage.
 * Returns null if not found or invalid.
 */
export function loadPersonalization(): CheNuPersonalization | null {
  if (typeof localStorage === 'undefined') return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const data = JSON.parse(raw);
    
    // Validate basic structure
    if (!data || typeof data !== 'object') return null;
    if (typeof data.version !== 'number') return null;

    // Migrate if needed
    const migrated = migratePersonalization(data);
    
    // Save migrated version if different
    if (migrated.version !== data.version) {
      savePersonalization(migrated);
    }

    return migrated;
  } catch (error) {
    console.error('[Personalization] Failed to load:', error);
    return null;
  }
}

/**
 * Load or create default personalization.
 */
export function loadOrCreatePersonalization(): CheNuPersonalization {
  const loaded = loadPersonalization();
  if (loaded) return loaded;
  
  const fresh = createPersonalization();
  savePersonalization(fresh);
  return fresh;
}

// ─────────────────────────────────────────────────────
// SAVE
// ─────────────────────────────────────────────────────

/**
 * Save personalization to localStorage.
 */
export function savePersonalization(state: CheNuPersonalization): boolean {
  if (typeof localStorage === 'undefined') return false;

  try {
    const data = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, data);
    return true;
  } catch (error) {
    console.error('[Personalization] Failed to save:', error);
    
    // Try to free up space
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      clearOldBackups();
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        return true;
      } catch {
        return false;
      }
    }
    
    return false;
  }
}

/**
 * Save with debounce for frequent updates.
 */
let saveTimeout: NodeJS.Timeout | null = null;

export function savePersonalizationDebounced(
  state: CheNuPersonalization,
  delay: number = 500
): void {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }
  
  saveTimeout = setTimeout(() => {
    savePersonalization(state);
    saveTimeout = null;
  }, delay);
}

// ─────────────────────────────────────────────────────
// BACKUP
// ─────────────────────────────────────────────────────

/**
 * Create a backup of current personalization.
 */
export function createBackup(): boolean {
  if (typeof localStorage === 'undefined') return false;

  try {
    const current = localStorage.getItem(STORAGE_KEY);
    if (!current) return false;

    const backup = {
      data: current,
      timestamp: Date.now(),
    };

    localStorage.setItem(BACKUP_KEY, JSON.stringify(backup));
    return true;
  } catch (error) {
    console.error('[Personalization] Failed to create backup:', error);
    return false;
  }
}

/**
 * Restore from backup.
 */
export function restoreFromBackup(): CheNuPersonalization | null {
  if (typeof localStorage === 'undefined') return null;

  try {
    const backupRaw = localStorage.getItem(BACKUP_KEY);
    if (!backupRaw) return null;

    const backup = JSON.parse(backupRaw);
    if (!backup.data) return null;

    const data = JSON.parse(backup.data);
    const migrated = migratePersonalization(data);
    
    // Restore
    savePersonalization(migrated);
    
    return migrated;
  } catch (error) {
    console.error('[Personalization] Failed to restore backup:', error);
    return null;
  }
}

/**
 * Clear old backups to free space.
 */
function clearOldBackups(): void {
  if (typeof localStorage === 'undefined') return;

  try {
    localStorage.removeItem(BACKUP_KEY);
  } catch {
    // Ignore
  }
}

// ─────────────────────────────────────────────────────
// CLEAR / RESET
// ─────────────────────────────────────────────────────

/**
 * Clear all personalization data.
 */
export function clearPersonalization(): void {
  if (typeof localStorage === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(BACKUP_KEY);
    localStorage.removeItem(SYNC_KEY);
  } catch (error) {
    console.error('[Personalization] Failed to clear:', error);
  }
}

/**
 * Reset to defaults but preserve some settings.
 */
export function resetPersonalization(
  preserveKeys: (keyof CheNuPersonalization)[] = []
): CheNuPersonalization {
  const current = loadPersonalization();
  const fresh = createPersonalization();

  // Preserve specified keys
  if (current && preserveKeys.length > 0) {
    for (const key of preserveKeys) {
      if (key in current) {
        (fresh as any)[key] = (current as any)[key];
      }
    }
  }

  savePersonalization(fresh);
  return fresh;
}

// ─────────────────────────────────────────────────────
// EXPORT / IMPORT
// ─────────────────────────────────────────────────────

/**
 * Export personalization as JSON string.
 */
export function exportPersonalization(): string | null {
  const state = loadPersonalization();
  if (!state) return null;

  return JSON.stringify(state, null, 2);
}

/**
 * Export as downloadable file.
 */
export function downloadPersonalization(): void {
  const json = exportPersonalization();
  if (!json) return;

  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `che-nu-settings-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Import personalization from JSON string.
 */
export function importPersonalization(json: string): CheNuPersonalization | null {
  try {
    const data = JSON.parse(json);
    
    // Validate
    if (!data || typeof data !== 'object') return null;
    if (typeof data.version !== 'number') return null;

    // Backup current before import
    createBackup();

    // Migrate and save
    const migrated = migratePersonalization(data);
    migrated.updatedAt = Date.now();
    
    savePersonalization(migrated);
    
    return migrated;
  } catch (error) {
    console.error('[Personalization] Failed to import:', error);
    return null;
  }
}

// ─────────────────────────────────────────────────────
// SYNC STATUS
// ─────────────────────────────────────────────────────

export interface SyncStatus {
  lastSynced: number | null;
  pending: boolean;
  error: string | null;
}

/**
 * Get sync status.
 */
export function getSyncStatus(): SyncStatus {
  if (typeof localStorage === 'undefined') {
    return { lastSynced: null, pending: false, error: null };
  }

  try {
    const raw = localStorage.getItem(SYNC_KEY);
    if (!raw) return { lastSynced: null, pending: false, error: null };
    return JSON.parse(raw);
  } catch {
    return { lastSynced: null, pending: false, error: null };
  }
}

/**
 * Update sync status.
 */
export function updateSyncStatus(status: Partial<SyncStatus>): void {
  if (typeof localStorage === 'undefined') return;

  try {
    const current = getSyncStatus();
    const updated = { ...current, ...status };
    localStorage.setItem(SYNC_KEY, JSON.stringify(updated));
  } catch {
    // Ignore
  }
}

// ─────────────────────────────────────────────────────
// STORAGE EVENTS
// ─────────────────────────────────────────────────────

type PersonalizationChangeHandler = (state: CheNuPersonalization) => void;

const changeHandlers: Set<PersonalizationChangeHandler> = new Set();

/**
 * Subscribe to personalization changes (from other tabs).
 */
export function onPersonalizationChange(handler: PersonalizationChangeHandler): () => void {
  changeHandlers.add(handler);
  return () => changeHandlers.delete(handler);
}

// Listen for storage events from other tabs
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY && event.newValue) {
      try {
        const state = JSON.parse(event.newValue);
        const migrated = migratePersonalization(state);
        changeHandlers.forEach(handler => handler(migrated));
      } catch {
        // Ignore invalid data
      }
    }
  });
}

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default {
  loadPersonalization,
  loadOrCreatePersonalization,
  savePersonalization,
  savePersonalizationDebounced,
  createBackup,
  restoreFromBackup,
  clearPersonalization,
  resetPersonalization,
  exportPersonalization,
  downloadPersonalization,
  importPersonalization,
  getSyncStatus,
  updateSyncStatus,
  onPersonalizationChange,
  STORAGE_KEY,
};
