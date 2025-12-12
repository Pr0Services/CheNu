// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU — MEMORY LAYERS HOOK
// Foundation Freeze V1
// 
// Temporal memory management: Short-term, Mid-term, Long-term
// Visual states: Solid (current), Faded (past), Ghosted (emerging)
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useCallback, useMemo, useEffect } from "react";
import type { MemoryLayer, MemoryItem, SphereId } from "../types";

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

export interface UseMemoryLayersProps {
  sphereId: SphereId;
  maxShortTermItems?: number;
  maxMidTermItems?: number;
  shortTermDurationMs?: number;  // Session-based
  midTermDurationMs?: number;    // Project/phase-based
}

export interface MemoryLayersState {
  shortTerm: MemoryItem[];
  midTerm: MemoryItem[];
  longTerm: MemoryItem[];
  
  // Visual helpers
  allItems: MemoryItem[];
  recentItems: MemoryItem[];
  fadedItems: MemoryItem[];
  ghostedItems: MemoryItem[];
}

export interface MemoryLayersActions {
  // Add items
  addToMemory: (item: Omit<MemoryItem, "id" | "layer" | "createdAt" | "lastAccessedAt" | "accessCount" | "visualState">, layer?: MemoryLayer) => void;
  
  // Access items (updates recency)
  accessItem: (itemId: string) => void;
  
  // Promote/demote
  promoteToMidTerm: (itemId: string) => void;
  promoteToLongTerm: (itemId: string) => void;
  demoteToShortTerm: (itemId: string) => void;
  
  // Remove
  removeItem: (itemId: string) => void;
  clearShortTerm: () => void;
  clearMidTerm: () => void;
  
  // Get items
  getItemsByContentType: (contentType: string) => MemoryItem[];
  getRecentItems: (count: number) => MemoryItem[];
  
  // Visual state
  getVisualState: (itemId: string) => "solid" | "faded" | "ghosted";
}

// ─────────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────────

const DEFAULT_SHORT_TERM_DURATION = 1000 * 60 * 30;  // 30 minutes
const DEFAULT_MID_TERM_DURATION = 1000 * 60 * 60 * 24 * 7;  // 7 days
const DEFAULT_MAX_SHORT_TERM = 50;
const DEFAULT_MAX_MID_TERM = 200;

// ─────────────────────────────────────────────────────────────────────────────────
// UTILITY FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────────

function generateId(): string {
  return `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function calculateImportance(item: MemoryItem): number {
  const recencyWeight = 0.4;
  const accessWeight = 0.4;
  const baseWeight = 0.2;
  
  const now = Date.now();
  const age = now - item.createdAt.getTime();
  const maxAge = 1000 * 60 * 60 * 24 * 30; // 30 days
  const recency = Math.max(0, 1 - (age / maxAge));
  
  const accessScore = Math.min(1, item.accessCount / 10);
  
  return (recency * recencyWeight) + (accessScore * accessWeight) + (item.importance * baseWeight);
}

function calculateVisualState(item: MemoryItem): "solid" | "faded" | "ghosted" {
  const now = Date.now();
  const lastAccess = item.lastAccessedAt.getTime();
  const timeSinceAccess = now - lastAccess;
  
  // Short-term items are solid
  if (item.layer === "short-term") {
    return "solid";
  }
  
  // Mid-term items fade based on recency
  if (item.layer === "mid-term") {
    if (timeSinceAccess < 1000 * 60 * 60) { // Within 1 hour
      return "solid";
    } else if (timeSinceAccess < 1000 * 60 * 60 * 24) { // Within 1 day
      return "faded";
    }
    return "ghosted";
  }
  
  // Long-term items are typically faded unless recently accessed
  if (timeSinceAccess < 1000 * 60 * 60 * 24) { // Within 1 day
    return "solid";
  } else if (timeSinceAccess < 1000 * 60 * 60 * 24 * 7) { // Within 1 week
    return "faded";
  }
  return "ghosted";
}

// ─────────────────────────────────────────────────────────────────────────────────
// MAIN HOOK
// ─────────────────────────────────────────────────────────────────────────────────

export function useMemoryLayers(props: UseMemoryLayersProps): [MemoryLayersState, MemoryLayersActions] {
  const {
    sphereId,
    maxShortTermItems = DEFAULT_MAX_SHORT_TERM,
    maxMidTermItems = DEFAULT_MAX_MID_TERM,
    shortTermDurationMs = DEFAULT_SHORT_TERM_DURATION,
    midTermDurationMs = DEFAULT_MID_TERM_DURATION
  } = props;

  // ─────────────────────────────────────────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────────────────────────────────────────

  const [items, setItems] = useState<Map<string, MemoryItem>>(new Map());

  // ─────────────────────────────────────────────────────────────────────────────
  // COMPUTED: Items by layer
  // ─────────────────────────────────────────────────────────────────────────────

  const itemsByLayer = useMemo(() => {
    const shortTerm: MemoryItem[] = [];
    const midTerm: MemoryItem[] = [];
    const longTerm: MemoryItem[] = [];

    items.forEach(item => {
      if (item.sphereId !== sphereId) return;
      
      // Update visual state
      const updatedItem = {
        ...item,
        visualState: calculateVisualState(item),
        importance: calculateImportance(item)
      };

      switch (item.layer) {
        case "short-term":
          shortTerm.push(updatedItem);
          break;
        case "mid-term":
          midTerm.push(updatedItem);
          break;
        case "long-term":
          longTerm.push(updatedItem);
          break;
      }
    });

    // Sort by recency within each layer
    const sortByRecency = (a: MemoryItem, b: MemoryItem) => 
      b.lastAccessedAt.getTime() - a.lastAccessedAt.getTime();

    return {
      shortTerm: shortTerm.sort(sortByRecency),
      midTerm: midTerm.sort(sortByRecency),
      longTerm: longTerm.sort(sortByRecency)
    };
  }, [items, sphereId]);

  // ─────────────────────────────────────────────────────────────────────────────
  // COMPUTED: Visual groupings
  // ─────────────────────────────────────────────────────────────────────────────

  const visualGroupings = useMemo(() => {
    const allItems = [...itemsByLayer.shortTerm, ...itemsByLayer.midTerm, ...itemsByLayer.longTerm];
    
    return {
      allItems: allItems.sort((a, b) => b.lastAccessedAt.getTime() - a.lastAccessedAt.getTime()),
      recentItems: allItems.filter(i => i.visualState === "solid"),
      fadedItems: allItems.filter(i => i.visualState === "faded"),
      ghostedItems: allItems.filter(i => i.visualState === "ghosted")
    };
  }, [itemsByLayer]);

  // ─────────────────────────────────────────────────────────────────────────────
  // CLEANUP: Auto-expire short-term items
  // ─────────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      
      setItems(prev => {
        const updated = new Map(prev);
        let changed = false;

        updated.forEach((item, id) => {
          const age = now - item.createdAt.getTime();
          
          // Expire old short-term items
          if (item.layer === "short-term" && age > shortTermDurationMs) {
            // Auto-promote important items to mid-term
            if (item.accessCount >= 3 || item.importance > 0.7) {
              updated.set(id, { ...item, layer: "mid-term" });
            } else {
              updated.delete(id);
            }
            changed = true;
          }
          
          // Expire old mid-term items
          if (item.layer === "mid-term" && age > midTermDurationMs) {
            // Auto-promote important items to long-term
            if (item.accessCount >= 5 || item.importance > 0.8) {
              updated.set(id, { ...item, layer: "long-term" });
            } else {
              // Demote to short-term for re-evaluation
              updated.set(id, { ...item, layer: "short-term", accessCount: 0 });
            }
            changed = true;
          }
        });

        return changed ? updated : prev;
      });
    }, 60000); // Check every minute

    return () => clearInterval(cleanup);
  }, [shortTermDurationMs, midTermDurationMs]);

  // ─────────────────────────────────────────────────────────────────────────────
  // CLEANUP: Limit items per layer
  // ─────────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (itemsByLayer.shortTerm.length > maxShortTermItems) {
      const toRemove = itemsByLayer.shortTerm
        .slice(maxShortTermItems)
        .filter(i => i.importance < 0.5);
      
      if (toRemove.length > 0) {
        setItems(prev => {
          const updated = new Map(prev);
          toRemove.forEach(item => updated.delete(item.id));
          return updated;
        });
      }
    }

    if (itemsByLayer.midTerm.length > maxMidTermItems) {
      const toRemove = itemsByLayer.midTerm
        .slice(maxMidTermItems)
        .filter(i => i.importance < 0.5);
      
      if (toRemove.length > 0) {
        setItems(prev => {
          const updated = new Map(prev);
          toRemove.forEach(item => updated.delete(item.id));
          return updated;
        });
      }
    }
  }, [itemsByLayer, maxShortTermItems, maxMidTermItems]);

  // ─────────────────────────────────────────────────────────────────────────────
  // ACTIONS
  // ─────────────────────────────────────────────────────────────────────────────

  const addToMemory = useCallback((
    itemData: Omit<MemoryItem, "id" | "layer" | "createdAt" | "lastAccessedAt" | "accessCount" | "visualState">,
    layer: MemoryLayer = "short-term"
  ) => {
    const now = new Date();
    const newItem: MemoryItem = {
      ...itemData,
      id: generateId(),
      layer,
      sphereId,
      createdAt: now,
      lastAccessedAt: now,
      accessCount: 1,
      importance: itemData.importance ?? 0.5,
      recency: 1,
      visualState: "solid"
    };

    setItems(prev => new Map(prev).set(newItem.id, newItem));
  }, [sphereId]);

  const accessItem = useCallback((itemId: string) => {
    setItems(prev => {
      const item = prev.get(itemId);
      if (!item) return prev;

      const updated = new Map(prev);
      updated.set(itemId, {
        ...item,
        lastAccessedAt: new Date(),
        accessCount: item.accessCount + 1,
        recency: 1
      });
      return updated;
    });
  }, []);

  const promoteToMidTerm = useCallback((itemId: string) => {
    setItems(prev => {
      const item = prev.get(itemId);
      if (!item || item.layer !== "short-term") return prev;

      const updated = new Map(prev);
      updated.set(itemId, { ...item, layer: "mid-term" });
      return updated;
    });
  }, []);

  const promoteToLongTerm = useCallback((itemId: string) => {
    setItems(prev => {
      const item = prev.get(itemId);
      if (!item || item.layer === "long-term") return prev;

      const updated = new Map(prev);
      updated.set(itemId, { ...item, layer: "long-term" });
      return updated;
    });
  }, []);

  const demoteToShortTerm = useCallback((itemId: string) => {
    setItems(prev => {
      const item = prev.get(itemId);
      if (!item || item.layer === "short-term") return prev;

      const updated = new Map(prev);
      updated.set(itemId, { ...item, layer: "short-term", accessCount: 0 });
      return updated;
    });
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setItems(prev => {
      const updated = new Map(prev);
      updated.delete(itemId);
      return updated;
    });
  }, []);

  const clearShortTerm = useCallback(() => {
    setItems(prev => {
      const updated = new Map(prev);
      updated.forEach((item, id) => {
        if (item.layer === "short-term" && item.sphereId === sphereId) {
          updated.delete(id);
        }
      });
      return updated;
    });
  }, [sphereId]);

  const clearMidTerm = useCallback(() => {
    setItems(prev => {
      const updated = new Map(prev);
      updated.forEach((item, id) => {
        if (item.layer === "mid-term" && item.sphereId === sphereId) {
          updated.delete(id);
        }
      });
      return updated;
    });
  }, [sphereId]);

  const getItemsByContentType = useCallback((contentType: string): MemoryItem[] => {
    return visualGroupings.allItems.filter(i => i.contentType === contentType);
  }, [visualGroupings]);

  const getRecentItems = useCallback((count: number): MemoryItem[] => {
    return visualGroupings.allItems.slice(0, count);
  }, [visualGroupings]);

  const getVisualState = useCallback((itemId: string): "solid" | "faded" | "ghosted" => {
    const item = items.get(itemId);
    return item ? calculateVisualState(item) : "ghosted";
  }, [items]);

  // ─────────────────────────────────────────────────────────────────────────────
  // RETURN
  // ─────────────────────────────────────────────────────────────────────────────

  const state: MemoryLayersState = {
    ...itemsByLayer,
    ...visualGroupings
  };

  const actions: MemoryLayersActions = {
    addToMemory,
    accessItem,
    promoteToMidTerm,
    promoteToLongTerm,
    demoteToShortTerm,
    removeItem,
    clearShortTerm,
    clearMidTerm,
    getItemsByContentType,
    getRecentItems,
    getVisualState
  };

  return [state, actions];
}

export default useMemoryLayers;
