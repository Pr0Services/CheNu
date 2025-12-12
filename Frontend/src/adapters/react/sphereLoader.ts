/* =====================================================
   CHE·NU — Sphere Loader
   
   PHASE 2: DYNAMIC SPHERE LOADING
   
   Handles:
   - Lazy loading of sphere configs
   - Preloading strategies
   - Config validation
   - Cache management
   ===================================================== */

import { SphereConfig } from '../../core-reference/resolver/types';

// ─────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────

export interface SphereRegistry {
  spheres: Record<string, string>;  // id → path
  defaultOrder: string[];
  categories: Record<string, string[]>;
}

export interface LoadedSphere {
  config: SphereConfig;
  loadedAt: number;
  source: 'cache' | 'network' | 'bundle';
}

export interface SphereLoaderOptions {
  preload?: string[];
  cacheTimeout?: number;  // ms, 0 = infinite
  validateOnLoad?: boolean;
}

// ─────────────────────────────────────────────────────
// CACHE
// ─────────────────────────────────────────────────────

const sphereCache = new Map<string, LoadedSphere>();
let registryCache: SphereRegistry | null = null;

// ─────────────────────────────────────────────────────
// REGISTRY LOADER
// ─────────────────────────────────────────────────────

/**
 * Loads the sphere registry (index of all spheres).
 */
export async function loadRegistry(): Promise<SphereRegistry> {
  if (registryCache) return registryCache;
  
  try {
    const registry = await import('../../core-reference/spheres/index.json');
    registryCache = registry.default || registry;
    return registryCache;
  } catch (e) {
    console.error('[CHE·NU] Failed to load sphere registry:', e);
    // Return minimal registry
    return {
      spheres: {},
      defaultOrder: [],
      categories: {},
    };
  }
}

/**
 * Gets all available sphere IDs.
 */
export async function getAvailableSpheres(): Promise<string[]> {
  const registry = await loadRegistry();
  return registry.defaultOrder;
}

/**
 * Gets spheres by category.
 */
export async function getSpheresByCategory(category: string): Promise<string[]> {
  const registry = await loadRegistry();
  return registry.categories[category] || [];
}

// ─────────────────────────────────────────────────────
// SPHERE LOADER
// ─────────────────────────────────────────────────────

/**
 * Loads a single sphere config by ID.
 */
export async function loadSphere(
  sphereId: string,
  options: SphereLoaderOptions = {}
): Promise<LoadedSphere> {
  const { cacheTimeout = 0, validateOnLoad = true } = options;
  
  // Check cache
  const cached = sphereCache.get(sphereId);
  if (cached) {
    const age = Date.now() - cached.loadedAt;
    if (cacheTimeout === 0 || age < cacheTimeout) {
      return { ...cached, source: 'cache' };
    }
  }
  
  // Load from bundle/network
  try {
    const config = await import(`../../core-reference/spheres/${sphereId}.json`);
    const sphereConfig: SphereConfig = config.default || config;
    
    // Validate if enabled
    if (validateOnLoad) {
      validateSphereConfig(sphereConfig, sphereId);
    }
    
    const loaded: LoadedSphere = {
      config: sphereConfig,
      loadedAt: Date.now(),
      source: 'bundle',
    };
    
    // Cache
    sphereCache.set(sphereId, loaded);
    
    return loaded;
  } catch (e) {
    throw new Error(`[CHE·NU] Failed to load sphere: ${sphereId}`);
  }
}

/**
 * Loads multiple spheres in parallel.
 */
export async function loadSpheres(
  sphereIds: string[],
  options: SphereLoaderOptions = {}
): Promise<Map<string, LoadedSphere>> {
  const results = new Map<string, LoadedSphere>();
  
  const loads = sphereIds.map(async (id) => {
    try {
      const loaded = await loadSphere(id, options);
      results.set(id, loaded);
    } catch (e) {
      console.error(`[CHE·NU] Failed to load sphere ${id}:`, e);
    }
  });
  
  await Promise.all(loads);
  return results;
}

/**
 * Preloads spheres for faster access later.
 */
export async function preloadSpheres(
  sphereIds?: string[],
  options: SphereLoaderOptions = {}
): Promise<void> {
  const ids = sphereIds || (await getAvailableSpheres());
  await loadSpheres(ids, options);
}

// ─────────────────────────────────────────────────────
// VALIDATION
// ─────────────────────────────────────────────────────

interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validates a sphere config against the schema.
 */
export function validateSphereConfig(
  config: unknown,
  sphereId: string
): ValidationError[] {
  const errors: ValidationError[] = [];
  
  if (!config || typeof config !== 'object') {
    errors.push({ field: 'root', message: 'Config must be an object' });
    return errors;
  }
  
  const c = config as Record<string, unknown>;
  
  // Required fields
  if (!c.id) errors.push({ field: 'id', message: 'Missing required field: id' });
  if (!c.name) errors.push({ field: 'name', message: 'Missing required field: name' });
  if (!c.type) errors.push({ field: 'type', message: 'Missing required field: type' });
  if (!c.visual) errors.push({ field: 'visual', message: 'Missing required field: visual' });
  if (!c.rules) errors.push({ field: 'rules', message: 'Missing required field: rules' });
  
  // Visual validation
  if (c.visual && typeof c.visual === 'object') {
    const v = c.visual as Record<string, unknown>;
    if (!v.baseShape) errors.push({ field: 'visual.baseShape', message: 'Missing baseShape' });
    if (!v.color) errors.push({ field: 'visual.color', message: 'Missing color' });
    if (!v.growthAxis) errors.push({ field: 'visual.growthAxis', message: 'Missing growthAxis' });
  }
  
  // Rules validation
  if (c.rules && typeof c.rules === 'object') {
    const r = c.rules as Record<string, unknown>;
    if (typeof r.sizeByContent !== 'boolean') {
      errors.push({ field: 'rules.sizeByContent', message: 'Must be boolean' });
    }
    if (typeof r.motionByActivity !== 'boolean') {
      errors.push({ field: 'rules.motionByActivity', message: 'Must be boolean' });
    }
  }
  
  if (errors.length > 0) {
    console.warn(`[CHE·NU] Validation errors in sphere ${sphereId}:`, errors);
  }
  
  return errors;
}

// ─────────────────────────────────────────────────────
// CACHE MANAGEMENT
// ─────────────────────────────────────────────────────

/**
 * Clears the sphere cache.
 */
export function clearCache(sphereId?: string): void {
  if (sphereId) {
    sphereCache.delete(sphereId);
  } else {
    sphereCache.clear();
  }
}

/**
 * Gets cache stats.
 */
export function getCacheStats(): {
  size: number;
  spheres: string[];
  oldestEntry: number | null;
} {
  const spheres = Array.from(sphereCache.keys());
  let oldestEntry: number | null = null;
  
  for (const [_, loaded] of sphereCache) {
    if (oldestEntry === null || loaded.loadedAt < oldestEntry) {
      oldestEntry = loaded.loadedAt;
    }
  }
  
  return {
    size: sphereCache.size,
    spheres,
    oldestEntry,
  };
}

// ─────────────────────────────────────────────────────
// SPHERE CONFIG HELPERS
// ─────────────────────────────────────────────────────

/**
 * Gets a specific property from a loaded sphere config.
 */
export function getSphereProperty<K extends keyof SphereConfig>(
  sphereId: string,
  property: K
): SphereConfig[K] | undefined {
  const cached = sphereCache.get(sphereId);
  return cached?.config[property];
}

/**
 * Checks if a sphere is loaded.
 */
export function isSphereLoaded(sphereId: string): boolean {
  return sphereCache.has(sphereId);
}

/**
 * Gets all loaded sphere configs.
 */
export function getAllLoadedSpheres(): Map<string, SphereConfig> {
  const result = new Map<string, SphereConfig>();
  for (const [id, loaded] of sphereCache) {
    result.set(id, loaded.config);
  }
  return result;
}

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default {
  loadRegistry,
  getAvailableSpheres,
  getSpheresByCategory,
  loadSphere,
  loadSpheres,
  preloadSpheres,
  validateSphereConfig,
  clearCache,
  getCacheStats,
  getSphereProperty,
  isSphereLoaded,
  getAllLoadedSpheres,
};
