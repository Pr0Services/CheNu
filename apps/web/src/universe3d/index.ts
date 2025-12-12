/* =====================================================
   CHE·NU — Universe 3D Module
   
   3D visualization system for spheres and relations.
   Includes physics-based force-directed layout.
   ===================================================== */

// Types
export * from './universe3d.types';

// Simple layout computation (for useFrame)
export {
  computeUniverseLayout,
  isLayoutStable,
  getSystemEnergy,
  initializeSpherePositions,
  useUniverseLayoutState,
  DEFAULT_FORCES,
} from './computeLayout';
export type { LayoutForces, UseUniverseLayoutOptions } from './computeLayout';

// Full physics engine (for complex simulations)
export { PhysicsEngine, usePhysics } from './physicsEngine';
export type { UsePhysicsOptions } from './physicsEngine';

// Layout algorithms hook
export { useUniverseLayout } from './useUniverseLayout';

// Re-export defaults
export {
  DEFAULT_LAYOUT,
  DEFAULT_EFFECTS,
  DEFAULT_CENTER,
  DEFAULT_PHYSICS,
} from './universe3d.types';

// R3F Components
export { UniverseScene } from './UniverseScene';
export type { UniverseSceneProps } from './UniverseScene';

// Camera Controller
export { 
  CameraController, 
  useCameraFocus,
} from './CameraController';
export type { 
  Universe3DFocus, 
  FocusMode, 
  CameraControllerProps,
  UseCameraFocusReturn,
} from './CameraController';

// Sphere Node
export { SphereNode } from './SphereNode';
export type { SphereNodeProps } from './SphereNode';

// Complete App
export { Universe3DApp } from './Universe3DApp';
export type { Universe3DAppProps } from './Universe3DApp';

// Clustering
export {
  clusterSpheres,
  getVisibleNodes,
  expandClusterPositions,
  useClustering,
  DEFAULT_CLUSTER_CONFIG,
} from './clusterUniverse';
export type { ClusterConfig, ClusterResult, UseClusteringOptions } from './clusterUniverse';

// Cluster Node
export { ClusterNode } from './ClusterNode';
export type { ClusterNodeProps } from './ClusterNode';

// Clustered Universe App
export { ClusteredUniverseApp } from './ClusteredUniverseApp';
export type { ClusteredUniverseAppProps } from './ClusteredUniverseApp';
