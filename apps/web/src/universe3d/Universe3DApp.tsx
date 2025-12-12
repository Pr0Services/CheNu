/* =====================================================
   CHE·NU — Universe 3D App
   
   Complete 3D universe application integrating:
   - Force-directed layout
   - Camera focus/free modes
   - Sphere interactions
   - Theme integration
   
   Usage:
   <Canvas>
     <Universe3DApp
       spheres={spheres}
       relations={relations}
       onEnterSphere={(id) => openMeetingRoom(id)}
     />
   </Canvas>
   ===================================================== */

import React, { useState, useCallback } from 'react';
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
  Universe3DFocus,
} from './CameraController';
import { SphereNode } from './SphereNode';

// ─────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────

export interface Universe3DAppProps {
  spheres: Sphere3D[];
  relations: SphereRelation[];
  center?: CenterNode3D;
  effects?: Partial<UniverseEffects>;
  forces?: Partial<LayoutForces>;
  
  // Callbacks
  onFocusSphere?: (sphereId: string | undefined) => void;
  onEnterSphere?: (sphereId: string) => void;
  onClickCenter?: () => void;
  
  // Options
  autoAnimate?: boolean;
  showLabels?: boolean;
  showRelations?: boolean;
  enableOrbitControls?: boolean;
}

// ─────────────────────────────────────────────────────
// MAIN APP COMPONENT
// ─────────────────────────────────────────────────────

export const Universe3DApp: React.FC<Universe3DAppProps> = ({
  spheres: initialSpheres,
  relations,
  center = DEFAULT_CENTER,
  effects = {},
  forces = {},
  onFocusSphere,
  onEnterSphere,
  onClickCenter,
  autoAnimate = true,
  showLabels = true,
  showRelations = true,
  enableOrbitControls = true,
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
  
  // Focus state
  const { focus, setFocus, focusOn, clearFocus, isFocused } = useCameraFocus();
  const [layoutStable, setLayoutStable] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  
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
  
  const handleSphereEnter = useCallback((sphereId: string) => {
    onEnterSphere?.(sphereId);
  }, [onEnterSphere]);
  
  const handlePointerMissed = useCallback(() => {
    clearFocus();
    onFocusSphere?.(undefined);
  }, [clearFocus, onFocusSphere]);
  
  const handleCenterClick = useCallback(() => {
    clearFocus();
    onClickCenter?.();
  }, [clearFocus, onClickCenter]);
  
  return (
    <group onPointerMissed={handlePointerMissed}>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#6366f1" />
      
      {/* Stars background */}
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
      
      {/* Camera Controller */}
      <CameraController
        spheres={spheres}
        focus={focus}
      />
      
      {/* Center Node (NOVA) */}
      <CenterNodeMesh
        center={center}
        onClick={handleCenterClick}
      />
      
      {/* Relations */}
      {showRelations && relations.map((rel, i) => {
        const from = spheres.find(s => s.id === rel.from);
        const to = spheres.find(s => s.id === rel.to);
        if (!from || !to) return null;
        
        const isHighlighted = 
          hoveredId === rel.from || 
          hoveredId === rel.to ||
          focus.sphereId === rel.from ||
          focus.sphereId === rel.to;
        
        return (
          <RelationLine
            key={`${rel.from}-${rel.to}-${i}`}
            from={from.position}
            to={to.position}
            strength={rel.strength}
            isHighlighted={isHighlighted}
          />
        );
      })}
      
      {/* Spheres */}
      {spheres.map(sphere => (
        <SphereNode
          key={sphere.id}
          sphere={sphere}
          position={sphere.position}
          isFocused={isFocused(sphere.id)}
          isHovered={hoveredId === sphere.id}
          showLabel={showLabels}
          onFocus={handleSphereFocus}
          onEnter={handleSphereEnter}
          onHover={setHoveredId}
        />
      ))}
      
      {/* Orbit Controls (disabled when focused) */}
      {enableOrbitControls && focus.mode === 'free' && (
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
      
      {/* Orbital ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[center.size * 1.8, 0.03, 16, 100]} />
        <meshBasicMaterial
          color={center.glowColor as THREE.ColorRepresentation}
          transparent
          opacity={0.4}
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
  const points = React.useMemo(() => [
    new THREE.Vector3(...from),
    new THREE.Vector3(...to),
  ], [from, to]);
  
  const lineGeometry = React.useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);
  
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

export default Universe3DApp;
