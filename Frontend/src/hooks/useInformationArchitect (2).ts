// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU — INFORMATION ARCHITECT HOOK
// Foundation Freeze V1
// 
// Per-sphere adaptive layout based on user behavior
// CRITICAL: This agent changes PRESENTATION only, never HIERARCHY
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useCallback, useMemo, useEffect } from "react";
import type { SphereId, InformationArchitectState, SphereCategory } from "../types";
import { getSphereById } from "../config/spheres.config";

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

export interface UseInformationArchitectProps {
  sphereId: SphereId;
  userId: string;
}

export interface CategoryVisualState {
  category: SphereCategory;
  
  // Visual properties (adaptive, not structural)
  visualWeight: number;      // 0-1, affects size/prominence
  orderIndex: number;        // Display order
  isCollapsed: boolean;
  
  // Grouping (visual only)
  groupId?: string;
  
  // User behavior metrics
  accessCount: number;
  lastAccessed: Date | null;
  avgTimeSpent: number;      // seconds
}

export interface InformationArchitectHookState {
  // Base config
  sphereId: SphereId;
  userId: string;
  
  // Adaptive state
  categoryStates: CategoryVisualState[];
  
  // Preferences
  preferredOrdering: "alphabetical" | "frequency" | "recency" | "importance";
  
  // Computed
  orderedCategories: CategoryVisualState[];
  collapsedIds: Set<string>;
  emphasisMap: Map<string, number>;
}

export interface InformationArchitectActions {
  // User interactions (feeds learning)
  recordCategoryAccess: (categoryId: string, timeSpent: number) => void;
  
  // User preferences (explicit)
  setPreferredOrdering: (ordering: "alphabetical" | "frequency" | "recency" | "importance") => void;
  toggleCategoryCollapse: (categoryId: string) => void;
  collapseCategory: (categoryId: string) => void;
  expandCategory: (categoryId: string) => void;
  
  // Visual adjustments
  adjustCategoryWeight: (categoryId: string, delta: number) => void;
  
  // Groups (visual organization)
  createGroup: (groupId: string, categoryIds: string[]) => void;
  removeGroup: (groupId: string) => void;
  
  // Reset
  resetToDefaults: () => void;
  
  // Getters
  getCategoryState: (categoryId: string) => CategoryVisualState | undefined;
  getVisualWeight: (categoryId: string) => number;
}

// ─────────────────────────────────────────────────────────────────────────────────
// STORAGE KEYS
// ─────────────────────────────────────────────────────────────────────────────────

const getStorageKey = (sphereId: SphereId, userId: string) => 
  `chenu_ia_${sphereId}_${userId}`;

// ─────────────────────────────────────────────────────────────────────────────────
// MAIN HOOK
// ─────────────────────────────────────────────────────────────────────────────────

export function useInformationArchitect(
  props: UseInformationArchitectProps
): [InformationArchitectHookState, InformationArchitectActions] {
  const { sphereId, userId } = props;

  // ─────────────────────────────────────────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────────────────────────────────────────

  const sphere = useMemo(() => getSphereById(sphereId), [sphereId]);

  const [categoryStates, setCategoryStates] = useState<Map<string, CategoryVisualState>>(() => {
    // Initialize from sphere config
    const initial = new Map<string, CategoryVisualState>();
    
    sphere.categories.forEach((category, index) => {
      initial.set(category.id, {
        category,
        visualWeight: category.isCore ? 0.8 : 0.5,
        orderIndex: index,
        isCollapsed: false,
        accessCount: 0,
        lastAccessed: null,
        avgTimeSpent: 0
      });
    });
    
    return initial;
  });

  const [preferredOrdering, setPreferredOrderingState] = useState<
    "alphabetical" | "frequency" | "recency" | "importance"
  >("importance");

  const [groups, setGroups] = useState<Map<string, string[]>>(new Map());

  // ─────────────────────────────────────────────────────────────────────────────
  // LOAD PERSISTED STATE
  // ─────────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    try {
      const key = getStorageKey(sphereId, userId);
      const stored = localStorage.getItem(key);
      
      if (stored) {
        const parsed = JSON.parse(stored);
        
        // Restore category states
        if (parsed.categoryStates) {
          setCategoryStates(prev => {
            const updated = new Map(prev);
            Object.entries(parsed.categoryStates).forEach(([id, state]) => {
              const existing = updated.get(id);
              if (existing) {
                updated.set(id, {
                  ...existing,
                  ...(state as Partial<CategoryVisualState>),
                  lastAccessed: (state as any).lastAccessed 
                    ? new Date((state as any).lastAccessed) 
                    : null
                });
              }
            });
            return updated;
          });
        }
        
        // Restore preferences
        if (parsed.preferredOrdering) {
          setPreferredOrderingState(parsed.preferredOrdering);
        }
        
        // Restore groups
        if (parsed.groups) {
          setGroups(new Map(Object.entries(parsed.groups)));
        }
      }
    } catch (e) {
      console.warn("Failed to load Information Architect state:", e);
    }
  }, [sphereId, userId]);

  // ─────────────────────────────────────────────────────────────────────────────
  // PERSIST STATE
  // ─────────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    try {
      const key = getStorageKey(sphereId, userId);
      const toStore = {
        categoryStates: Object.fromEntries(
          Array.from(categoryStates.entries()).map(([id, state]) => [
            id,
            {
              visualWeight: state.visualWeight,
              orderIndex: state.orderIndex,
              isCollapsed: state.isCollapsed,
              accessCount: state.accessCount,
              lastAccessed: state.lastAccessed?.toISOString() ?? null,
              avgTimeSpent: state.avgTimeSpent,
              groupId: state.groupId
            }
          ])
        ),
        preferredOrdering,
        groups: Object.fromEntries(groups)
      };
      localStorage.setItem(key, JSON.stringify(toStore));
    } catch (e) {
      console.warn("Failed to persist Information Architect state:", e);
    }
  }, [categoryStates, preferredOrdering, groups, sphereId, userId]);

  // ─────────────────────────────────────────────────────────────────────────────
  // COMPUTED: Ordered categories
  // ─────────────────────────────────────────────────────────────────────────────

  const orderedCategories = useMemo(() => {
    const states = Array.from(categoryStates.values());
    
    switch (preferredOrdering) {
      case "alphabetical":
        return states.sort((a, b) => a.category.label.localeCompare(b.category.label));
      
      case "frequency":
        return states.sort((a, b) => b.accessCount - a.accessCount);
      
      case "recency":
        return states.sort((a, b) => {
          if (!a.lastAccessed && !b.lastAccessed) return 0;
          if (!a.lastAccessed) return 1;
          if (!b.lastAccessed) return -1;
          return b.lastAccessed.getTime() - a.lastAccessed.getTime();
        });
      
      case "importance":
      default:
        // Core categories first, then by visual weight
        return states.sort((a, b) => {
          if (a.category.isCore !== b.category.isCore) {
            return a.category.isCore ? -1 : 1;
          }
          return b.visualWeight - a.visualWeight;
        });
    }
  }, [categoryStates, preferredOrdering]);

  const collapsedIds = useMemo(() => {
    const collapsed = new Set<string>();
    categoryStates.forEach((state, id) => {
      if (state.isCollapsed) collapsed.add(id);
    });
    return collapsed;
  }, [categoryStates]);

  const emphasisMap = useMemo(() => {
    const map = new Map<string, number>();
    categoryStates.forEach((state, id) => {
      map.set(id, state.visualWeight);
    });
    return map;
  }, [categoryStates]);

  // ─────────────────────────────────────────────────────────────────────────────
  // ACTIONS
  // ─────────────────────────────────────────────────────────────────────────────

  const recordCategoryAccess = useCallback((categoryId: string, timeSpent: number) => {
    setCategoryStates(prev => {
      const state = prev.get(categoryId);
      if (!state) return prev;

      const updated = new Map(prev);
      const newAccessCount = state.accessCount + 1;
      const newAvgTime = ((state.avgTimeSpent * state.accessCount) + timeSpent) / newAccessCount;
      
      // Increase visual weight based on usage (bounded)
      const weightIncrease = Math.min(0.02, timeSpent / 600); // Max +0.02 per access
      const newWeight = Math.min(1, state.visualWeight + weightIncrease);

      updated.set(categoryId, {
        ...state,
        accessCount: newAccessCount,
        lastAccessed: new Date(),
        avgTimeSpent: newAvgTime,
        visualWeight: newWeight
      });

      return updated;
    });
  }, []);

  const setPreferredOrdering = useCallback((
    ordering: "alphabetical" | "frequency" | "recency" | "importance"
  ) => {
    setPreferredOrderingState(ordering);
  }, []);

  const toggleCategoryCollapse = useCallback((categoryId: string) => {
    setCategoryStates(prev => {
      const state = prev.get(categoryId);
      if (!state) return prev;

      const updated = new Map(prev);
      updated.set(categoryId, {
        ...state,
        isCollapsed: !state.isCollapsed
      });
      return updated;
    });
  }, []);

  const collapseCategory = useCallback((categoryId: string) => {
    setCategoryStates(prev => {
      const state = prev.get(categoryId);
      if (!state || state.isCollapsed) return prev;

      const updated = new Map(prev);
      updated.set(categoryId, { ...state, isCollapsed: true });
      return updated;
    });
  }, []);

  const expandCategory = useCallback((categoryId: string) => {
    setCategoryStates(prev => {
      const state = prev.get(categoryId);
      if (!state || !state.isCollapsed) return prev;

      const updated = new Map(prev);
      updated.set(categoryId, { ...state, isCollapsed: false });
      return updated;
    });
  }, []);

  const adjustCategoryWeight = useCallback((categoryId: string, delta: number) => {
    setCategoryStates(prev => {
      const state = prev.get(categoryId);
      if (!state) return prev;

      const updated = new Map(prev);
      const newWeight = Math.max(0.1, Math.min(1, state.visualWeight + delta));
      updated.set(categoryId, { ...state, visualWeight: newWeight });
      return updated;
    });
  }, []);

  const createGroup = useCallback((groupId: string, categoryIds: string[]) => {
    // Update groups
    setGroups(prev => new Map(prev).set(groupId, categoryIds));
    
    // Update category states with group assignment
    setCategoryStates(prev => {
      const updated = new Map(prev);
      categoryIds.forEach(catId => {
        const state = updated.get(catId);
        if (state) {
          updated.set(catId, { ...state, groupId });
        }
      });
      return updated;
    });
  }, []);

  const removeGroup = useCallback((groupId: string) => {
    const categoryIds = groups.get(groupId) ?? [];
    
    // Remove group
    setGroups(prev => {
      const updated = new Map(prev);
      updated.delete(groupId);
      return updated;
    });
    
    // Clear group from categories
    setCategoryStates(prev => {
      const updated = new Map(prev);
      categoryIds.forEach(catId => {
        const state = updated.get(catId);
        if (state && state.groupId === groupId) {
          const { groupId: _, ...rest } = state;
          updated.set(catId, rest as CategoryVisualState);
        }
      });
      return updated;
    });
  }, [groups]);

  const resetToDefaults = useCallback(() => {
    // Reset to initial state from sphere config
    const initial = new Map<string, CategoryVisualState>();
    
    sphere.categories.forEach((category, index) => {
      initial.set(category.id, {
        category,
        visualWeight: category.isCore ? 0.8 : 0.5,
        orderIndex: index,
        isCollapsed: false,
        accessCount: 0,
        lastAccessed: null,
        avgTimeSpent: 0
      });
    });
    
    setCategoryStates(initial);
    setPreferredOrderingState("importance");
    setGroups(new Map());
    
    // Clear localStorage
    try {
      localStorage.removeItem(getStorageKey(sphereId, userId));
    } catch (e) {
      console.warn("Failed to clear Information Architect storage:", e);
    }
  }, [sphere, sphereId, userId]);

  const getCategoryState = useCallback((categoryId: string) => {
    return categoryStates.get(categoryId);
  }, [categoryStates]);

  const getVisualWeight = useCallback((categoryId: string) => {
    return categoryStates.get(categoryId)?.visualWeight ?? 0.5;
  }, [categoryStates]);

  // ─────────────────────────────────────────────────────────────────────────────
  // RETURN
  // ─────────────────────────────────────────────────────────────────────────────

  const state: InformationArchitectHookState = {
    sphereId,
    userId,
    categoryStates: Array.from(categoryStates.values()),
    preferredOrdering,
    orderedCategories,
    collapsedIds,
    emphasisMap
  };

  const actions: InformationArchitectActions = {
    recordCategoryAccess,
    setPreferredOrdering,
    toggleCategoryCollapse,
    collapseCategory,
    expandCategory,
    adjustCategoryWeight,
    createGroup,
    removeGroup,
    resetToDefaults,
    getCategoryState,
    getVisualWeight
  };

  return [state, actions];
}

export default useInformationArchitect;
