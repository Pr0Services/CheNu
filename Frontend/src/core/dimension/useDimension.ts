/* =====================================================
   CHE·NU — useDimension Hook
   core/dimension/useDimension.ts
   
   CONNECTOR HOOK
   This hook connects React components to the Dimension
   Resolver. It collects context and returns resolved
   dimensions.
   ===================================================== */

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ResolutionContext,
  ResolvedDimension,
  SphereConfig,
  ContentMetrics,
  ActivityMetrics,
  UserContext,
} from './dimension.types';
import { resolveDimension, loadSphereConfig } from './dimensionResolver';

// ─────────────────────────────────────────────────────
// Hook: useDimension
// ─────────────────────────────────────────────────────

interface UseDimensionOptions {
  sphereId: string;
  sphereConfig?: SphereConfig;  // Can provide directly or load
  contentMetrics?: Partial<ContentMetrics>;
  userContext: UserContext;
  depth?: number;
}

interface UseDimensionResult {
  dimension: ResolvedDimension | null;
  isLoading: boolean;
  error: Error | null;
  recordActivity: () => void;
  updateContent: (metrics: Partial<ContentMetrics>) => void;
}

export function useDimension(options: UseDimensionOptions): UseDimensionResult {
  const { sphereId, sphereConfig: providedConfig, userContext, depth = 0 } = options;
  
  // State
  const [sphereConfig, setSphereConfig] = useState<SphereConfig | null>(providedConfig || null);
  const [isLoading, setIsLoading] = useState(!providedConfig);
  const [error, setError] = useState<Error | null>(null);
  
  // Activity tracking
  const [lastInteraction, setLastInteraction] = useState(Date.now());
  const [actionsInLastMinute, setActionsInLastMinute] = useState(0);
  
  // Content metrics
  const [contentMetrics, setContentMetrics] = useState<ContentMetrics>({
    itemCount: options.contentMetrics?.itemCount ?? 0,
    agentCount: options.contentMetrics?.agentCount ?? 0,
    activeProcesses: options.contentMetrics?.activeProcesses ?? 0,
    pendingDecisions: options.contentMetrics?.pendingDecisions ?? 0,
  });
  
  // Load sphere config if not provided
  useEffect(() => {
    if (providedConfig) {
      setSphereConfig(providedConfig);
      setIsLoading(false);
      return;
    }
    
    let cancelled = false;
    
    loadSphereConfig(sphereId)
      .then(config => {
        if (!cancelled) {
          setSphereConfig(config);
          setIsLoading(false);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err);
          setIsLoading(false);
        }
      });
    
    return () => { cancelled = true; };
  }, [sphereId, providedConfig]);
  
  // Action counter decay (reset every minute)
  useEffect(() => {
    const interval = setInterval(() => {
      setActionsInLastMinute(0);
    }, 60000);
    return () => clearInterval(interval);
  }, []);
  
  // Record activity
  const recordActivity = useCallback(() => {
    setLastInteraction(Date.now());
    setActionsInLastMinute(prev => prev + 1);
  }, []);
  
  // Update content metrics
  const updateContent = useCallback((metrics: Partial<ContentMetrics>) => {
    setContentMetrics(prev => ({ ...prev, ...metrics }));
  }, []);
  
  // Build activity metrics
  const activityMetrics: ActivityMetrics = useMemo(() => ({
    lastInteraction,
    actionsPerMinute: actionsInLastMinute,
    hasUrgent: contentMetrics.pendingDecisions > 0,
    conditions: contentMetrics.pendingDecisions > 0 ? ['pendingApproval'] : [],
  }), [lastInteraction, actionsInLastMinute, contentMetrics.pendingDecisions]);
  
  // Resolve dimension
  const dimension = useMemo((): ResolvedDimension | null => {
    if (!sphereConfig) return null;
    
    const context: ResolutionContext = {
      contentVolume: contentMetrics,
      activityLevel: activityMetrics,
      sphereConfig,
      userContext,
      depth,
    };
    
    return resolveDimension(context);
  }, [sphereConfig, contentMetrics, activityMetrics, userContext, depth]);
  
  return {
    dimension,
    isLoading,
    error,
    recordActivity,
    updateContent,
  };
}

// ─────────────────────────────────────────────────────
// Hook: useActivityTracker
// ─────────────────────────────────────────────────────

export function useActivityTracker() {
  const [lastInteraction, setLastInteraction] = useState(Date.now());
  const [actionsCount, setActionsCount] = useState(0);
  
  const recordAction = useCallback(() => {
    setLastInteraction(Date.now());
    setActionsCount(prev => prev + 1);
  }, []);
  
  // Decay actions every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setActionsCount(0);
    }, 60000);
    return () => clearInterval(interval);
  }, []);
  
  const metrics: ActivityMetrics = useMemo(() => ({
    lastInteraction,
    actionsPerMinute: actionsCount,
    hasUrgent: false,
    conditions: [],
  }), [lastInteraction, actionsCount]);
  
  return { metrics, recordAction };
}

// ─────────────────────────────────────────────────────
// Hook: useContentMetrics
// ─────────────────────────────────────────────────────

interface UseContentMetricsOptions {
  items?: unknown[];
  agents?: unknown[];
  processes?: unknown[];
  decisions?: unknown[];
}

export function useContentMetrics(options: UseContentMetricsOptions): ContentMetrics {
  return useMemo(() => ({
    itemCount: options.items?.length ?? 0,
    agentCount: options.agents?.length ?? 0,
    activeProcesses: options.processes?.filter((p: any) => p?.status === 'active')?.length ?? 0,
    pendingDecisions: options.decisions?.filter((d: any) => !d?.resolved)?.length ?? 0,
  }), [options.items, options.agents, options.processes, options.decisions]);
}

// ─────────────────────────────────────────────────────
// Hook: useUserContext
// ─────────────────────────────────────────────────────

interface UseUserContextOptions {
  userId?: string;
  role?: string;
  permissions?: string[];
  reducedMotion?: boolean;
}

export function useUserContext(options: UseUserContextOptions = {}): UserContext {
  // Check system preferences
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;
  
  return useMemo(() => ({
    userId: options.userId || 'anonymous',
    role: options.role || 'viewer',
    permissions: options.permissions || ['read'],
    preferences: {
      reducedMotion: options.reducedMotion ?? prefersReducedMotion,
      highContrast: false,
      compactMode: false,
    },
  }), [options.userId, options.role, options.permissions, options.reducedMotion, prefersReducedMotion]);
}

// ─────────────────────────────────────────────────────
// Export
// ─────────────────────────────────────────────────────

export default {
  useDimension,
  useActivityTracker,
  useContentMetrics,
  useUserContext,
};
