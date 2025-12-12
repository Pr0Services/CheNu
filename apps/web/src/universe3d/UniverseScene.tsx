/* =====================================================
   CHE·NU — Universe Scene (React Three Fiber)
   
   Main 3D scene component with:
   - Animated force-directed layout
   - Interactive spheres
   - Theme integration
   - Orbital controls
   ===================================================== */

import React, { useRef, useMemo, useState, useCallback } from 'react';
import { useFrame, ThreeElements } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import * as THREE from 'three';

import {
  Sphere3D,
  SphereRelation,
  CenterNode3D,
  DEFAULT_CENTER,
  UniverseEffects,
  DEFAULT_EFFECTS,
} from './universe3d.types';
import {
  computeUniverseLayout,
  isLayoutStable,
  initializeSpherePositions,
  DEFAULT_FORCES,
  LayoutForces,
} from './computeLayout';

// ─────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────

export interface UniverseSceneProps {
  spheres: Sphere3D[];
  relations: SphereRelation[];
  center?: CenterNode3D;
  effects?: Partial<UniverseEffects>;
  forces?: Partial<LayoutForces>;
  
  // Callbacks
  onSphereClick?: (sphere: Sphere3D) => void;
  onSphereHover?: (sphere: Sphere3D | null) => void;
  onCenterClick?: () => void;
  
  // Options
  autoAnimate?: boolean;
  showLabels?: boolean;
  showRelations?: boolean;
}

// ─────────────────────────────────────────────────────
// MAIN SCENE
// ─────────────────────────────────────────────────────

export const UniverseScene: React.FC<UniverseSceneProps> = ({
  spheres: initialSpheres,
  relations,
  center = DEFAULT_CENTER,
  effects = {},
  forces = {},
  onSphereClick,
  onSphereHover,
  onCenterClick,
  autoAnimate = true,
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
      ? initializeSpherePositions(initialSpheres, 5, 'ring')
      : initialSpheres;
  });
  
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isStable, setIsStable] = useState(false);
  
  // Animation loop
  useFrame(() => {
    if (!autoAnimate || isStable) return;
    
    setSpheres(prev => {
      const next = computeUniverseLayout(prev, relations, mergedForces);
      
      // Check stability
      if (isLayoutStable(next, 0.0001)) {
        setIsStable(true);
      }
      
      return next;
    });
  });
  
  // Hover handlers
  const handleSphereHover = useCallback((sphere: Sphere3D | null) => {
    setHoveredId(sphere?.id || null);
    onSphereHover?.(sphere);
  }, [onSphereHover]);
  
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} />
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
      
      {/* Center node (NOVA) */}
      <CenterNodeMesh
        center={center}
        onClick={onCenterClick}
      />
      
      {/* Relations */}
      {showRelations && relations.map((rel, i) => {
        const from = spheres.find(s => s.id === rel.from);
        const to = spheres.find(s => s.id === rel.to);
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
      
      {/* Spheres */}
      {spheres.map(sphere => (
        <SphereMesh
          key={sphere.id}
          sphere={sphere}
          isHovered={hoveredId === sphere.id}
          showLabel={showLabels}
          onClick={() => onSphereClick?.(sphere)}
          onHover={handleSphereHover}
        />
      ))}
      
      {/* Controls */}
      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        minDistance={3}
        maxDistance={50}
        autoRotate={isStable}
        autoRotateSpeed={0.5}
      />
    </>
  );
};

// ─────────────────────────────────────────────────────
// CENTER NODE
// ─────────────────────────────────────────────────────

const CenterNodeMesh: React.FC<{
  center: CenterNode3D;
  onClick?: () => void;
}> = ({ center, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += center.rotationSpeed;
    }
  });
  
  return (
    <group position={center.position as [number, number, number]}>
      {/* Core */}
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
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>
      
      {/* Glow ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[center.size * 1.5, 0.05, 16, 100]} />
        <meshBasicMaterial
          color={center.glowColor as THREE.ColorRepresentation}
          transparent
          opacity={0.3}
        />
      </mesh>
      
      {/* Label */}
      <Html center distanceFactor={10} position={[0, center.size + 0.5, 0]}>
        <div style={{
          color: '#fff',
          fontSize: 14,
          fontWeight: 700,
          textShadow: '0 0 10px rgba(0,0,0,0.8)',
          whiteSpace: 'nowrap',
        }}>
          {center.label}
        </div>
      </Html>
    </group>
  );
};

// ─────────────────────────────────────────────────────
// SPHERE MESH
// ─────────────────────────────────────────────────────

const SphereMesh: React.FC<{
  sphere: Sphere3D;
  isHovered: boolean;
  showLabel: boolean;
  onClick: () => void;
  onHover: (sphere: Sphere3D | null) => void;
}> = ({ sphere, isHovered, showLabel, onClick, onHover }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Animate scale on hover
  useFrame(() => {
    if (meshRef.current) {
      const targetScale = isHovered ? 1.2 : 1;
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );
    }
  });
  
  // Get color from sphere or type
  const color = sphere.color || getTypeColor(sphere.type);
  const emissiveIntensity = sphere.activityLevel * 0.5;
  
  return (
    <group position={sphere.position as [number, number, number]}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => onHover(sphere)}
        onPointerOut={() => onHover(null)}
      >
        <sphereGeometry args={[sphere.size, 32, 32]} />
        <meshStandardMaterial
          color={color as THREE.ColorRepresentation}
          emissive={color as THREE.ColorRepresentation}
          emissiveIntensity={emissiveIntensity}
          metalness={0.2}
          roughness={0.6}
          transparent
          opacity={sphere.opacity ?? 0.9}
        />
      </mesh>
      
      {/* Activity glow */}
      {sphere.activityLevel > 0.5 && (
        <mesh>
          <sphereGeometry args={[sphere.size * 1.2, 16, 16]} />
          <meshBasicMaterial
            color={color as THREE.ColorRepresentation}
            transparent
            opacity={sphere.activityLevel * 0.2}
            side={THREE.BackSide}
          />
        </mesh>
      )}
      
      {/* Label */}
      {showLabel && (
        <Html
          center
          distanceFactor={8}
          position={[0, sphere.size + 0.3, 0]}
          style={{ pointerEvents: 'none' }}
        >
          <div style={{
            color: '#fff',
            fontSize: 11,
            fontWeight: 500,
            textShadow: '0 0 8px rgba(0,0,0,0.9)',
            whiteSpace: 'nowrap',
            opacity: isHovered ? 1 : 0.7,
            transition: 'opacity 0.2s',
          }}>
            {sphere.label}
          </div>
        </Html>
      )}
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
  const points = useMemo(() => {
    return [
      new THREE.Vector3(...from),
      new THREE.Vector3(...to),
    ];
  }, [from, to]);
  
  const lineGeometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);
  
  return (
    <line geometry={lineGeometry}>
      <lineBasicMaterial
        color={isHighlighted ? '#ffd54f' : '#6366f1'}
        transparent
        opacity={isHighlighted ? 0.8 : strength * 0.4}
        linewidth={strength * 2}
      />
    </line>
  );
};

// ─────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────

function getTypeColor(type: string): string {
  switch (type) {
    case 'business': return '#2196f3';
    case 'creative': return '#9c27b0';
    case 'personal': return '#4caf50';
    case 'scholar': return '#ff9800';
    default: return '#6366f1';
  }
}

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default UniverseScene;
