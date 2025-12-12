/* =====================================================
   CHE·NU — Adaptive Pages
   
   PHASE 3: PAGE ORCHESTRATORS
   
   These are NOT views with hardcoded content.
   They are orchestrators that:
   1. Collect context
   2. Call the composition engine
   3. Render the result
   
   All three pages share the SAME rendering logic.
   The only difference is their position in the hierarchy.
   ===================================================== */

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useDimension } from '../../adapters/react/useResolvedDimension';
import { composePage } from './pageComposer';
import { AdaptivePage } from './PageComponents';
import {
  PageContext,
  PageComposition,
  ContentNode,
  UserContext,
  NavigationContext,
  DisplayPreferences,
} from './page.types';
import { ResolvedDimension } from '../../core-reference/resolver/types';

// ─────────────────────────────────────────────────────
// SHARED PAGE HOOK
// ─────────────────────────────────────────────────────

interface UseAdaptivePageOptions {
  // Identity
  nodeId: string;
  depth: number;
  path: string[];
  
  // Content
  content: ContentNode;
  
  // User
  user: UserContext;
  preferences?: Partial<DisplayPreferences>;
  
  // Navigation
  onNavigate?: (path: string[]) => void;
}

interface UseAdaptivePageResult {
  composition: PageComposition | null;
  isLoading: boolean;
  error: Error | null;
  navigate: (path: string[]) => void;
  focus: (nodeId: string) => void;
  select: (nodeId: string) => void;
}

/**
 * Shared hook for all adaptive pages.
 * Handles context collection and composition.
 */
export function useAdaptivePage(options: UseAdaptivePageOptions): UseAdaptivePageResult {
  const { nodeId, depth, path, content, user, preferences = {}, onNavigate } = options;
  
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Get dimension from resolver
  const { dimension, isLoading, error } = useDimension({
    sphereId: nodeId,
    content: content.metrics ? {
      items: content.metrics.itemCount,
      agents: content.metrics.agentCount,
      processes: content.metrics.activeCount,
      decisions: content.metrics.pendingCount,
    } : undefined,
    permission: user.permissions.includes('admin') ? 'admin' : 
                user.permissions.includes('write') ? 'write' : 
                user.permissions.includes('read') ? 'read' : 'view',
    depth,
  });
  
  // Build page context
  const pageContext: PageContext | null = useMemo(() => {
    if (!dimension) return null;
    
    return {
      user,
      navigation: {
        path,
        depth,
        canGoBack: depth > 0,
        canGoDeeper: depth < dimension.depthAllowed,
        focusedId,
        selectedIds,
      },
      dimension,
      content,
      preferences: {
        reducedMotion: preferences.reducedMotion ?? false,
        highContrast: preferences.highContrast ?? false,
        compactMode: preferences.compactMode ?? false,
        showDebug: preferences.showDebug ?? false,
      },
    };
  }, [dimension, user, path, depth, focusedId, selectedIds, content, preferences]);
  
  // Compose page
  const composition = useMemo(() => {
    if (!pageContext) return null;
    return composePage(pageContext);
  }, [pageContext]);
  
  // Navigation handlers
  const navigate = useCallback((newPath: string[]) => {
    onNavigate?.(newPath);
  }, [onNavigate]);
  
  const focus = useCallback((id: string) => {
    setFocusedId(prev => prev === id ? null : id);
  }, []);
  
  const select = useCallback((id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  }, []);
  
  return {
    composition,
    isLoading,
    error,
    navigate,
    focus,
    select,
  };
}

// ─────────────────────────────────────────────────────
// UNIVERSE PAGE (Depth 0)
// ─────────────────────────────────────────────────────

interface UniversePageProps {
  content: ContentNode;
  user: UserContext;
  preferences?: Partial<DisplayPreferences>;
  onNavigate?: (path: string[]) => void;
  onSphereClick?: (sphere: ContentNode) => void;
  onSphereEnter?: (sphere: ContentNode) => void;
}

/**
 * Universe Page — Root level view.
 * Shows all spheres, knows nothing about their specific types.
 */
export const UniversePage: React.FC<UniversePageProps> = ({
  content,
  user,
  preferences,
  onNavigate,
  onSphereClick,
  onSphereEnter,
}) => {
  const {
    composition,
    isLoading,
    error,
    navigate,
    focus,
  } = useAdaptivePage({
    nodeId: 'universe',
    depth: 0,
    path: ['universe'],
    content,
    user,
    preferences,
    onNavigate,
  });
  
  if (isLoading) {
    return <div className="chenu-loading">Loading Universe...</div>;
  }
  
  if (error || !composition) {
    return <div className="chenu-error">Failed to load Universe</div>;
  }
  
  return (
    <AdaptivePage
      composition={composition}
      onNavigate={navigate}
      onItemClick={(node) => {
        focus(node.id);
        onSphereClick?.(node);
      }}
      onItemEnter={(node) => {
        onSphereEnter?.(node);
        navigate([...composition.navigation.breadcrumb.map(b => b.id), node.id]);
      }}
      className="chenu-universe-page"
    />
  );
};

// ─────────────────────────────────────────────────────
// SPHERE PAGE (Depth 1)
// ─────────────────────────────────────────────────────

interface SpherePageProps {
  sphereId: string;
  content: ContentNode;
  user: UserContext;
  preferences?: Partial<DisplayPreferences>;
  onNavigate?: (path: string[]) => void;
  onNodeClick?: (node: ContentNode) => void;
  onNodeEnter?: (node: ContentNode) => void;
  onBack?: () => void;
}

/**
 * Sphere Page — First level view.
 * Shows contents of a sphere, knows nothing about sphere type.
 */
export const SpherePage: React.FC<SpherePageProps> = ({
  sphereId,
  content,
  user,
  preferences,
  onNavigate,
  onNodeClick,
  onNodeEnter,
  onBack,
}) => {
  const {
    composition,
    isLoading,
    error,
    navigate,
    focus,
  } = useAdaptivePage({
    nodeId: sphereId,
    depth: 1,
    path: ['universe', sphereId],
    content,
    user,
    preferences,
    onNavigate,
  });
  
  if (isLoading) {
    return <div className="chenu-loading">Loading Sphere...</div>;
  }
  
  if (error || !composition) {
    return <div className="chenu-error">Failed to load Sphere</div>;
  }
  
  return (
    <AdaptivePage
      composition={composition}
      onNavigate={(path) => {
        if (path.length < 2) {
          onBack?.();
        } else {
          navigate(path);
        }
      }}
      onItemClick={(node) => {
        focus(node.id);
        onNodeClick?.(node);
      }}
      onItemEnter={(node) => {
        onNodeEnter?.(node);
        navigate(['universe', sphereId, node.id]);
      }}
      className="chenu-sphere-page"
    />
  );
};

// ─────────────────────────────────────────────────────
// NODE PAGE (Depth 2+)
// ─────────────────────────────────────────────────────

interface NodePageProps {
  path: string[];
  content: ContentNode;
  user: UserContext;
  preferences?: Partial<DisplayPreferences>;
  onNavigate?: (path: string[]) => void;
  onNodeClick?: (node: ContentNode) => void;
  onNodeEnter?: (node: ContentNode) => void;
  onBack?: () => void;
}

/**
 * Node Page — Deep level view.
 * Shows contents of any node, fully generic.
 */
export const NodePage: React.FC<NodePageProps> = ({
  path,
  content,
  user,
  preferences,
  onNavigate,
  onNodeClick,
  onNodeEnter,
  onBack,
}) => {
  const depth = path.length - 1;
  const nodeId = path[path.length - 1];
  
  const {
    composition,
    isLoading,
    error,
    navigate,
    focus,
  } = useAdaptivePage({
    nodeId,
    depth,
    path,
    content,
    user,
    preferences,
    onNavigate,
  });
  
  if (isLoading) {
    return <div className="chenu-loading">Loading...</div>;
  }
  
  if (error || !composition) {
    return <div className="chenu-error">Failed to load content</div>;
  }
  
  return (
    <AdaptivePage
      composition={composition}
      onNavigate={(newPath) => {
        if (newPath.length < path.length) {
          onBack?.();
        } else {
          navigate(newPath);
        }
      }}
      onItemClick={(node) => {
        focus(node.id);
        onNodeClick?.(node);
      }}
      onItemEnter={(node) => {
        onNodeEnter?.(node);
        navigate([...path, node.id]);
      }}
      className="chenu-node-page"
    />
  );
};

// ─────────────────────────────────────────────────────
// UNIFIED ADAPTIVE PAGE (Auto-selects based on depth)
// ─────────────────────────────────────────────────────

interface AdaptivePageRouterProps {
  path: string[];
  content: ContentNode;
  user: UserContext;
  preferences?: Partial<DisplayPreferences>;
  onNavigate?: (path: string[]) => void;
  onClick?: (node: ContentNode) => void;
  onEnter?: (node: ContentNode) => void;
}

/**
 * Unified page that auto-selects renderer based on depth.
 * This is what applications should use.
 */
export const AdaptivePageRouter: React.FC<AdaptivePageRouterProps> = ({
  path,
  content,
  user,
  preferences,
  onNavigate,
  onClick,
  onEnter,
}) => {
  const depth = path.length - 1;
  
  const handleBack = useCallback(() => {
    onNavigate?.(path.slice(0, -1));
  }, [path, onNavigate]);
  
  // All pages use the same component, just with different depths
  // This proves that page type doesn't matter — only depth and content do
  
  if (depth === 0) {
    return (
      <UniversePage
        content={content}
        user={user}
        preferences={preferences}
        onNavigate={onNavigate}
        onSphereClick={onClick}
        onSphereEnter={onEnter}
      />
    );
  }
  
  if (depth === 1) {
    return (
      <SpherePage
        sphereId={path[1]}
        content={content}
        user={user}
        preferences={preferences}
        onNavigate={onNavigate}
        onNodeClick={onClick}
        onNodeEnter={onEnter}
        onBack={handleBack}
      />
    );
  }
  
  return (
    <NodePage
      path={path}
      content={content}
      user={user}
      preferences={preferences}
      onNavigate={onNavigate}
      onNodeClick={onClick}
      onNodeEnter={onEnter}
      onBack={handleBack}
    />
  );
};

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default {
  useAdaptivePage,
  UniversePage,
  SpherePage,
  NodePage,
  AdaptivePageRouter,
};
