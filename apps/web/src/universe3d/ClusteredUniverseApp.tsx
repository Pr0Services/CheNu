/* =====================================================
   CHE·NU — Clustered Universe App
   
   Complete 3D universe with automatic clustering.
   Nearby spheres are grouped into expandable clusters
   for better visualization of dense universes.
   
   Features:
   - Automatic clustering based on distance
   - Expand/collapse clusters
   - Smooth camera transitions
   - Force-directed layout
   ===================================================== */

import React, { useState, useCallback, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

import {
  Sphere3D,
  SphereRelation,
  CenterNode3D,
  DEFAULT_CENTER,
  DEFAULT_EFFECTS,
  UniverseEffects,
  isCluster,
  isSphere,
} from './universe3d.types';
import {
  computeUniverseLayout,
  isLayoutStable,
  initializeSpherePositions,
  DEFAULT_FORCES,
  LayoutForces,
} from './computeLayout';
import {
  CameraController,
  useCameraFocus,
} from './CameraController';
import {
  useClustering,
  ClusterConfig,
  DEFAULT_CLUSTER_CONFIG,
  expandClusterPositions,
} from './clusterUniverse';
import { SphereNode } from './SphereNode';
import { ClusterNode } from './ClusterNode';

// ─────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────

export interface ClusteredUniverseAppProps {
  spheres: Sphere3D[];
  relations: SphereRelation[];
  center?: CenterNode3D;
  effects?: Partial<UniverseEffects>;
  forces?: Partial<LayoutForces>;
  clusterConfig?: Partial<ClusterConfig>;
  
  // Callbacks
  onFocusSphere?: (sphereId: string | undefined) => void;
  onEnterSphere?: (sphereId: string) => void;
  onClickCenter?: () => void;
  
  // Options
  autoAnimate?: boolean;
  enableClustering?: boolean;
  showLabels?: boolean;
  showRelations?: boolean;
}

// ─────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────

export const ClusteredUniverseApp: React.FC<ClusteredUniverseAppProps> = ({
  spheres: initialSpheres,
  relations,
  center = DEFAULT_CENTER,
  effects = {},
  forces = {},
  clusterConfig = {},
  onFocusSphere,
  onEnterSphere,
  onClickCenter,
  autoAnimate = true,
  enableClustering = true,
  showLabels = true,
  showRelations = true,
}) => {
  const mergedEffects = { ...DEFAULT_EFFECTS, ...effects };
  const mergedForces = { ...DEFAULT_FORCES, ...forces };
  
  // Initialize sphere positions
  const [spheres, setSpheres] = useState<Sphere3D[]>(() => {
    const needsInit = initialSpheres.every(
      s => s.position[0] === 0 && s.position[1] === 0 && s.position[2] === 0
    );
    return needsInit
      ? initializeSpherePositions(initialSpheres, 6, 'ring')
      : initialSpheres;
  });
  
  // Clustering
  const {
    visibleNodes,
    clusterResult,
    expandedClusters,
    toggleCluster,
    isExpanded,
  } = useClustering(spheres, { config: clusterConfig });
  
  // Focus state
  const { focus, focusOn, clearFocus, isFocused } = useCameraFocus();
  const [layoutStable, setLayoutStable] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  
  // Get spheres to display (considering expanded clusters)
  const displayNodes = useMemo(() => {
    if (!enableClustering) return spheres;
    
    const nodes: (Sphere3D | typeof clusterResult.clusters[0])[] = [];
    
    for (const node of visibleNodes) {
      if (isCluster(node)) {
        if (expandedClusters.includes(node.id)) {
          // Show individual spheres with positions around cluster
          const clusterSpheres = spheres.filter(s => 
            node.sphereIds.includes(s.id)
          );
          const expanded = expandClusterPositions(clusterSpheres, node, 2);
          nodes.push(...expanded);
        } else {
          nodes.push(node);
        }
      } else {
        nodes.push(node);
      }
    }
    
    return nodes;
  }, [enableClustering, visibleNodes, expandedClusters, spheres, clusterResult]);
  
  // Layout animation
  useFrame(() => {
    if (!autoAnimate || layoutStable) return;
    
    setSpheres(prev => {
      const next = computeUniverseLayout(prev, relations, mergedForces);
      
      if (isLayoutStable(next, 0.0001)) {
        setLayoutStable(true);
      }
      
      return next;
    });
  });
  
  // Handlers
  const handleSphereFocus = useCallback((sphereId: string) => {
    focusOn(sphereId);
    onFocusSphere?.(sphereId);
  }, [focusOn, onFocusSphere]);
  
  const handleClusterExpand = useCallback((clusterId: string) => {
    toggleCluster(clusterId);
  }, [toggleCluster]);
  
  const handlePointerMissed = useCallback(() => {
    clearFocus();
    onFocusSphere?.(undefined);
  }, [clearFocus, onFocusSphere]);
  
  const handleCenterClick = useCallback(() => {
    clearFocus();
    onClickCenter?.();
  }, [clearFocus, onClickCenter]);
  
  // Render spheres for camera controller
  const allSpheres = useMemo(() => {
    return displayNodes.filter(isSphere) as Sphere3D[];
  }, [displayNodes]);
  
  return (
    <group onPointerMissed={handlePointerMissed}>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#6366f1" />
      
      {/* Stars */}
      {mergedEffects.stars.enabled && (
        <Stars
          radius={mergedEffects.stars.radius}
          depth={mergedEffects.stars.depth}
          count={mergedEffects.stars.count}
          factor={4}
          saturation={0}
          fade={mergedEffects.stars.fade}
        />
      )}
      
      {/* Camera */}
      <CameraController spheres={allSpheres} focus={focus} />
      
      {/* Center */}
      <CenterNodeMesh center={center} onClick={handleCenterClick} />
      
      {/* Relations (only between visible spheres) */}
      {showRelations && relations.map((rel, i) => {
        const from = allSpheres.find(s => s.id === rel.from);
        const to = allSpheres.find(s => s.id === rel.to);
        if (!from || !to) return null;
        
        return (
          <RelationLine
            key={`${rel.from}-${rel.to}-${i}`}
            from={from.position}
            to={to.position}
            strength={rel.strength}
            isHighlighted={hoveredId === rel.from || hoveredId === rel.to}
          />
        );
      })}
      
      {/* Nodes (spheres and clusters) */}
      {displayNodes.map(node => {
        if (isCluster(node)) {
          return (
            <ClusterNode
              key={node.id}
              cluster={node}
              isExpanded={isExpanded(node.id)}
              isHovered={hoveredId === node.id}
              onExpand={handleClusterExpand}
              onHover={setHoveredId}
              showLabel={showLabels}
            />
          );
        } else {
          return (
            <SphereNode
              key={node.id}
              sphere={node}
              position={node.position}
              isFocused={isFocused(node.id)}
              isHovered={hoveredId === node.id}
              showLabel={showLabels}
              onFocus={handleSphereFocus}
              onEnter={onEnterSphere}
              onHover={setHoveredId}
            />
          );
        }
      })}
      
      {/* Controls */}
      {focus.mode === 'free' && (
        <OrbitControls
          enablePan
          enableZoom
          enableRotate
          minDistance={5}
          maxDistance={50}
          autoRotate={layoutStable}
          autoRotateSpeed={0.3}
        />
      )}
    </group>
  );
};

// ─────────────────────────────────────────────────────
// CENTER NODE
// ─────────────────────────────────────────────────────

const CenterNodeMesh: React.FC<{
  center: CenterNode3D;
  onClick?: () => void;
}> = ({ center, onClick }) => {
  const meshRef = React.useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += center.rotationSpeed;
    }
  });
  
  return (
    <group position={center.position as [number, number, number]}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.1 : 1}
      >
        <icosahedronGeometry args={[center.size, 2]} />
        <meshStandardMaterial
          color={center.color as THREE.ColorRepresentation}
          emissive={center.glowColor as THREE.ColorRepresentation}
          emissiveIntensity={center.glowIntensity}
          metalness={0.4}
          roughness={0.3}
        />
      </mesh>
    </group>
  );
};

// ─────────────────────────────────────────────────────
// RELATION LINE
// ─────────────────────────────────────────────────────

const RelationLine: React.FC<{
  from: [number, number, number];
  to: [number, number, number];
  strength: number;
  isHighlighted: boolean;
}> = ({ from, to, strength, isHighlighted }) => {
  const lineGeometry = React.useMemo(() => {
    const points = [
      new THREE.Vector3(...from),
      new THREE.Vector3(...to),
    ];
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [from, to]);
  
  return (
    <line geometry={lineGeometry}>
      <lineBasicMaterial
        color={isHighlighted ? '#ffd54f' : '#6366f1'}
        transparent
        opacity={isHighlighted ? 0.7 : strength * 0.3}
      />
    </line>
  );
};

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default ClusteredUniverseApp;
