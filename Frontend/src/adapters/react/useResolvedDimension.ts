/* =====================================================
   CHE·NU — React Adapter
   
   PHASE 2: BRIDGE LAYER
   
   This module connects the pure DimensionResolver 
   to React components. It handles:
   - Loading JSON configs
   - React state management
   - Context collection
   - Memoization
   
   The resolver itself remains pure and framework-agnostic.
   ===================================================== */

import { 
  useState, 
  useEffect, 
  useMemo, 
  useCallback, 
  useRef,
  createContext,
  useContext,
  ReactNode,
} from 'react';

import {
  DimensionContext,
  ResolvedDimension,
  EngineConfig,
  SphereConfig,
  ContentContext,
  ActivityContext,
  ComplexityLevel,
  PermissionLevel,
} from '../../core-reference/resolver/types';

import { resolveDimension } from '../../core-reference/resolver/dimensionResolver';

// ─────────────────────────────────────────────────────
// CONFIG LOADING
// ─────────────────────────────────────────────────────

let engineConfigCache: EngineConfig | null = null;
const sphereConfigCache = new Map<string, SphereConfig>();

/**
 * Loads the engine config (singleton pattern).
 * In production, this would be bundled or fetched once.
 */
export async function loadEngineConfig(): Promise<EngineConfig> {
  if (engineConfigCache) return engineConfigCache;
  
  // Dynamic import from core-reference
  const config = await import('../../core-reference/dimension.engine.json');
  engineConfigCache = config.default || config;
  return engineConfigCache;
}

/**
 * Loads a sphere config by ID.
 * Cached after first load.
 */
export async function loadSphereConfig(sphereId: string): Promise<SphereConfig> {
  if (sphereConfigCache.has(sphereId)) {
    return sphereConfigCache.get(sphereId)!;
  }
  
  try {
    const config = await import(`../../core-reference/spheres/${sphereId}.json`);
    const sphereConfig = config.default || config;
    sphereConfigCache.set(sphereId, sphereConfig);
    return sphereConfig;
  } catch (e) {
    throw new Error(`[CHE·NU] Sphere config not found: ${sphereId}`);
  }
}

/**
 * Preloads all sphere configs.
 */
export async function preloadAllSpheres(sphereIds: string[]): Promise<void> {
  await Promise.all(sphereIds.map(loadSphereConfig));
}

// ─────────────────────────────────────────────────────
// ENGINE CONTEXT (React Context)
// ─────────────────────────────────────────────────────

interface EngineContextValue {
  engine: EngineConfig | null;
  isLoading: boolean;
  error: Error | null;
}

const EngineContext = createContext<EngineContextValue>({
  engine: null,
  isLoading: true,
  error: null,
});

interface EngineProviderProps {
  children: ReactNode;
}

/**
 * Provides engine config to all child components.
 * Must wrap the application root.
 */
export function EngineProvider({ children }: EngineProviderProps) {
  const [engine, setEngine] = useState<EngineConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    loadEngineConfig()
      .then(setEngine)
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, []);
  
  const value = useMemo(() => ({ engine, isLoading, error }), [engine, isLoading, error]);
  
  return (
    <EngineContext.Provider value={value}>
      {children}
    </EngineContext.Provider>
  );
}

/**
 * Hook to access engine config.
 */
export function useEngine(): EngineContextValue {
  return useContext(EngineContext);
}

// ─────────────────────────────────────────────────────
// ACTIVITY TRACKER HOOK
// ─────────────────────────────────────────────────────

interface ActivityState {
  lastInteractionMs: number;
  actionsPerMinute: number;
  triggers: string[];
}

/**
 * Tracks user activity for dimension resolution.
 * Returns activity metrics and a function to record actions.
 */
export function useActivityTracker(triggers: string[] = []) {
  const [activity, setActivity] = useState<ActivityState>({
    lastInteractionMs: 0,
    actionsPerMinute: 0,
    triggers,
  });
  
  const actionsRef = useRef<number[]>([]);
  const lastInteractionRef = useRef(Date.now());
  
  // Update triggers when they change
  useEffect(() => {
    setActivity(prev => ({ ...prev, triggers }));
  }, [triggers.join(',')]);
  
  // Calculate actions per minute every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const oneMinuteAgo = now - 60000;
      
      // Filter actions within last minute
      actionsRef.current = actionsRef.current.filter(t => t > oneMinuteAgo);
      
      setActivity(prev => ({
        ...prev,
        lastInteractionMs: now - lastInteractionRef.current,
        actionsPerMinute: actionsRef.current.length,
      }));
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const recordAction = useCallback(() => {
    const now = Date.now();
    lastInteractionRef.current = now;
    actionsRef.current.push(now);
    
    setActivity(prev => ({
      ...prev,
      lastInteractionMs: 0,
      actionsPerMinute: actionsRef.current.length,
    }));
  }, []);
  
  const addTrigger = useCallback((trigger: string) => {
    setActivity(prev => ({
      ...prev,
      triggers: [...prev.triggers, trigger],
    }));
  }, []);
  
  const removeTrigger = useCallback((trigger: string) => {
    setActivity(prev => ({
      ...prev,
      triggers: prev.triggers.filter(t => t !== trigger),
    }));
  }, []);
  
  return {
    activity,
    recordAction,
    addTrigger,
    removeTrigger,
  };
}

// ─────────────────────────────────────────────────────
// CONTENT METRICS HOOK
// ─────────────────────────────────────────────────────

interface ContentMetricsInput {
  items?: unknown[];
  agents?: unknown[];
  processes?: { status?: string }[];
  decisions?: { resolved?: boolean }[];
}

/**
 * Computes content metrics from data arrays.
 * Memoized for performance.
 */
export function useContentMetrics(input: ContentMetricsInput): ContentContext {
  return useMemo(() => ({
    items: input.items?.length ?? 0,
    agents: input.agents?.length ?? 0,
    processes: input.processes?.filter(p => p.status === 'active').length ?? 0,
    decisions: input.decisions?.filter(d => !d.resolved).length ?? 0,
  }), [
    input.items?.length,
    input.agents?.length,
    input.processes,
    input.decisions,
  ]);
}

// ─────────────────────────────────────────────────────
// MAIN DIMENSION HOOK
// ─────────────────────────────────────────────────────

interface UseDimensionOptions {
  sphereId?: string;
  content?: ContentContext;
  complexity?: ComplexityLevel;
  permission?: PermissionLevel;
  depth?: number;
  triggers?: string[];
}

interface UseDimensionResult {
  dimension: ResolvedDimension | null;
  isLoading: boolean;
  error: Error | null;
  recordAction: () => void;
  sphereConfig: SphereConfig | null;
}

/**
 * Main hook for dimension resolution.
 * Connects all context to the pure resolver.
 */
export function useDimension(options: UseDimensionOptions): UseDimensionResult {
  const { engine, isLoading: engineLoading, error: engineError } = useEngine();
  const [sphereConfig, setSphereConfig] = useState<SphereConfig | null>(null);
  const [sphereLoading, setSphereLoading] = useState(!!options.sphereId);
  const [sphereError, setSphereError] = useState<Error | null>(null);
  
  // Activity tracking
  const { activity, recordAction } = useActivityTracker(options.triggers);
  
  // Load sphere config if specified
  useEffect(() => {
    if (!options.sphereId) {
      setSphereConfig(null);
      setSphereLoading(false);
      return;
    }
    
    setSphereLoading(true);
    loadSphereConfig(options.sphereId)
      .then(setSphereConfig)
      .catch(setSphereError)
      .finally(() => setSphereLoading(false));
  }, [options.sphereId]);
  
  // Build context
  const context: DimensionContext = useMemo(() => ({
    content: options.content,
    activity: {
      lastInteractionMs: activity.lastInteractionMs,
      actionsPerMinute: activity.actionsPerMinute,
      triggers: activity.triggers,
    },
    complexity: options.complexity,
    permission: options.permission,
    depth: options.depth,
    sphereId: options.sphereId,
  }), [
    options.content,
    options.complexity,
    options.permission,
    options.depth,
    options.sphereId,
    activity,
  ]);
  
  // Resolve dimension (memoized)
  const dimension = useMemo(() => {
    if (!engine) return null;
    return resolveDimension(context, engine, sphereConfig ?? undefined);
  }, [context, engine, sphereConfig]);
  
  return {
    dimension,
    isLoading: engineLoading || sphereLoading,
    error: engineError || sphereError,
    recordAction,
    sphereConfig,
  };
}

// ─────────────────────────────────────────────────────
// SPHERE HOOK (Convenience wrapper)
// ─────────────────────────────────────────────────────

interface UseSphereOptions {
  sphereId: string;
  items?: unknown[];
  agents?: unknown[];
  processes?: { status?: string }[];
  decisions?: { resolved?: boolean }[];
  complexity?: ComplexityLevel;
  permission?: PermissionLevel;
  depth?: number;
  triggers?: string[];
}

/**
 * Convenience hook for sphere-specific dimension resolution.
 * Combines content metrics with dimension resolution.
 */
export function useSphere(options: UseSphereOptions) {
  const content = useContentMetrics({
    items: options.items,
    agents: options.agents,
    processes: options.processes,
    decisions: options.decisions,
  });
  
  return useDimension({
    sphereId: options.sphereId,
    content,
    complexity: options.complexity,
    permission: options.permission,
    depth: options.depth,
    triggers: options.triggers,
  });
}

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default {
  EngineProvider,
  useEngine,
  useDimension,
  useSphere,
  useActivityTracker,
  useContentMetrics,
  loadEngineConfig,
  loadSphereConfig,
  preloadAllSpheres,
};
