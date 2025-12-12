/* =====================================================
   CHE·NU — Cluster Universe
   
   Groups nearby spheres into clusters for better
   visualization of dense universes. Clusters can
   be expanded to reveal individual spheres.
   
   Algorithm:
   1. Find spheres within CLUSTER_DISTANCE
   2. Group up to MAX_CLUSTER_SIZE spheres
   3. Calculate center position
   4. Aggregate activity levels
   ===================================================== */

import { Sphere3D, SphereCluster, UniverseNode, Vector3 } from './universe3d.types';

// ─────────────────────────────────────────────────────
// CONFIGURATION
// ─────────────────────────────────────────────────────

export interface ClusterConfig {
  clusterDistance: number;    // Max distance to cluster
  maxClusterSize: number;     // Max spheres per cluster
  minClusterSize: number;     // Min spheres to form cluster
}

export const DEFAULT_CLUSTER_CONFIG: ClusterConfig = {
  clusterDistance: 4,
  maxClusterSize: 6,
  minClusterSize: 3,
};

// ─────────────────────────────────────────────────────
// RESULT TYPE
// ─────────────────────────────────────────────────────

export interface ClusterResult {
  nodes: UniverseNode[];
  clusters: SphereCluster[];
  unclustered: Sphere3D[];
  sphereToCluster: Map<string, string>;  // sphereId → clusterId
}

// ─────────────────────────────────────────────────────
// MAIN CLUSTERING FUNCTION
// ─────────────────────────────────────────────────────

/**
 * Groups nearby spheres into clusters.
 * Returns mixed array of clusters and individual spheres.
 */
export function clusterSpheres(
  spheres: Sphere3D[],
  config: Partial<ClusterConfig> = {}
): ClusterResult {
  const { clusterDistance, maxClusterSize, minClusterSize } = {
    ...DEFAULT_CLUSTER_CONFIG,
    ...config,
  };
  
  const clusters: SphereCluster[] = [];
  const unclustered: Sphere3D[] = [];
  const used = new Set<string>();
  const sphereToCluster = new Map<string, string>();

  for (const sphere of spheres) {
    if (used.has(sphere.id)) continue;

    // Find nearby spheres
    const nearby = spheres.filter((other) => {
      if (used.has(other.id) || other.id === sphere.id) return false;
      return distance3D(sphere.position, other.position) < clusterDistance;
    });

    // Form cluster if enough nearby
    if (nearby.length >= minClusterSize - 1) {
      const clusterSpheres = [sphere, ...nearby].slice(0, maxClusterSize);
      clusterSpheres.forEach((s) => used.add(s.id));

      // Calculate center position
      const center = calculateCenter(clusterSpheres);

      // Create cluster
      const cluster: SphereCluster = {
        id: `cluster_${sphere.id}`,
        sphereIds: clusterSpheres.map((s) => s.id),
        position: center,
        size: Math.sqrt(clusterSpheres.length) * 1.2,
        activityLevel: average(clusterSpheres.map((s) => s.activityLevel)),
        themeId: sphere.themeId,
        expanded: false,
        label: `${clusterSpheres.length} spheres`,
        nodeCount: clusterSpheres.length,
      };

      clusters.push(cluster);
      
      // Map spheres to cluster
      clusterSpheres.forEach((s) => {
        sphereToCluster.set(s.id, cluster.id);
      });
    } else {
      // Keep as individual sphere
      used.add(sphere.id);
      unclustered.push(sphere);
    }
  }

  // Combine clusters and unclustered spheres
  const nodes: UniverseNode[] = [...clusters, ...unclustered];

  return {
    nodes,
    clusters,
    unclustered,
    sphereToCluster,
  };
}

// ─────────────────────────────────────────────────────
// EXPAND/COLLAPSE CLUSTERS
// ─────────────────────────────────────────────────────

/**
 * Get visible nodes based on expanded clusters.
 */
export function getVisibleNodes(
  spheres: Sphere3D[],
  clusterResult: ClusterResult,
  expandedClusterIds: string[]
): UniverseNode[] {
  const visible: UniverseNode[] = [];
  const expandedSet = new Set(expandedClusterIds);

  for (const node of clusterResult.nodes) {
    if ('sphereIds' in node) {
      // It's a cluster
      if (expandedSet.has(node.id)) {
        // Show individual spheres
        const clusterSpheres = spheres.filter((s) =>
          node.sphereIds.includes(s.id)
        );
        visible.push(...clusterSpheres);
      } else {
        // Show cluster
        visible.push(node);
      }
    } else {
      // It's an individual sphere
      visible.push(node);
    }
  }

  return visible;
}

/**
 * Position spheres around cluster center when expanded.
 */
export function expandClusterPositions(
  spheres: Sphere3D[],
  cluster: SphereCluster,
  radius: number = 3
): Sphere3D[] {
  const count = spheres.length;
  const angleStep = (Math.PI * 2) / count;
  
  return spheres.map((sphere, i) => {
    const angle = angleStep * i;
    const offset: Vector3 = [
      Math.cos(angle) * radius,
      (Math.random() - 0.5) * 0.5,
      Math.sin(angle) * radius,
    ];
    
    return {
      ...sphere,
      position: [
        cluster.position[0] + offset[0],
        cluster.position[1] + offset[1],
        cluster.position[2] + offset[2],
      ] as Vector3,
    };
  });
}

// ─────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────

function distance3D(a: Vector3, b: Vector3): number {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  const dz = a[2] - b[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function calculateCenter(spheres: Sphere3D[]): Vector3 {
  const center: Vector3 = [0, 0, 0];
  
  for (const s of spheres) {
    center[0] += s.position[0];
    center[1] += s.position[1];
    center[2] += s.position[2];
  }
  
  center[0] /= spheres.length;
  center[1] /= spheres.length;
  center[2] /= spheres.length;
  
  return center;
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

// ─────────────────────────────────────────────────────
// REACT HOOK
// ─────────────────────────────────────────────────────

import { useState, useMemo, useCallback } from 'react';

export interface UseClusteringOptions {
  config?: Partial<ClusterConfig>;
  initialExpanded?: string[];
}

export function useClustering(
  spheres: Sphere3D[],
  options: UseClusteringOptions = {}
) {
  const { config, initialExpanded = [] } = options;
  
  // Cluster result
  const clusterResult = useMemo(() => {
    return clusterSpheres(spheres, config);
  }, [spheres, config]);
  
  // Expanded state
  const [expandedClusters, setExpandedClusters] = useState<string[]>(initialExpanded);
  
  // Visible nodes
  const visibleNodes = useMemo(() => {
    return getVisibleNodes(spheres, clusterResult, expandedClusters);
  }, [spheres, clusterResult, expandedClusters]);
  
  // Actions
  const expandCluster = useCallback((clusterId: string) => {
    setExpandedClusters((prev) =>
      prev.includes(clusterId) ? prev : [...prev, clusterId]
    );
  }, []);
  
  const collapseCluster = useCallback((clusterId: string) => {
    setExpandedClusters((prev) =>
      prev.filter((id) => id !== clusterId)
    );
  }, []);
  
  const toggleCluster = useCallback((clusterId: string) => {
    setExpandedClusters((prev) =>
      prev.includes(clusterId)
        ? prev.filter((id) => id !== clusterId)
        : [...prev, clusterId]
    );
  }, []);
  
  const expandAll = useCallback(() => {
    setExpandedClusters(clusterResult.clusters.map((c) => c.id));
  }, [clusterResult.clusters]);
  
  const collapseAll = useCallback(() => {
    setExpandedClusters([]);
  }, []);
  
  const isExpanded = useCallback((clusterId: string) => {
    return expandedClusters.includes(clusterId);
  }, [expandedClusters]);
  
  return {
    // Data
    clusterResult,
    visibleNodes,
    expandedClusters,
    
    // Actions
    expandCluster,
    collapseCluster,
    toggleCluster,
    expandAll,
    collapseAll,
    isExpanded,
    
    // Stats
    totalClusters: clusterResult.clusters.length,
    expandedCount: expandedClusters.length,
  };
}

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default clusterSpheres;
