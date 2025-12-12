/* =====================================================
   CHE·NU — XR Universe View
   
   Complete XR-enabled universe visualization.
   Wraps Universe3D with VR/AR capabilities.
   
   Features:
   - VR/AR mode switching
   - Controller interactions
   - Hand tracking
   - Teleport locomotion
   - Immersive sphere exploration
   ===================================================== */

import React, { useState, useCallback, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';

import { XRProvider, useXRContext } from './XRProvider';
import { XRInteractions, XRTeleport } from './XRInteractions';
import { 
  XRUniverseConfig, 
  XRHandedness,
  DEFAULT_XR_UNIVERSE,
} from './xr.types';

import { 
  Sphere3D, 
  SphereRelation, 
  CenterNode3D,
  UniverseNode,
  DEFAULT_CENTER,
  DEFAULT_EFFECTS,
} from '../universe3d/universe3d.types';
import { 
  computeUniverseLayout, 
  isLayoutStable,
  initializeSpherePositions,
  DEFAULT_FORCES,
} from '../universe3d/computeLayout';
import { useClustering } from '../universe3d/clusterUniverse';
import { useFrame } from '@react-three/fiber';

// ─────────────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────────────

export interface XRUniverseViewProps {
  spheres: Sphere3D[];
  relations: SphereRelation[];
  center?: CenterNode3D;
  
  // XR options
  xrEnabled?: boolean;
  xrConfig?: Partial<XRUniverseConfig>;
  
  // Callbacks
  onSphereSelect?: (sphereId: string) => void;
  onSphereEnter?: (sphereId: string) => void;
  onCenterSelect?: () => void;
  
  // Visual options
  showStars?: boolean;
  enableClustering?: boolean;
  autoAnimate?: boolean;
}

// ─────────────────────────────────────────────────────
// UNIVERSE CONTENT (inside Canvas)
// ─────────────────────────────────────────────────────

interface UniverseContentProps {
  spheres: Sphere3D[];
  relations: SphereRelation[];
  center: CenterNode3D;
  xrConfig: XRUniverseConfig;
  enableClustering: boolean;
  autoAnimate: boolean;
  onSphereSelect?: (sphereId: string) => void;
  onSphereEnter?: (sphereId: string) => void;
  onCenterSelect?: () => void;
}

function UniverseContent({
  spheres: initialSpheres,
  relations,
  center,
  xrConfig,
  enableClustering,
  autoAnimate,
  onSphereSelect,
  onSphereEnter,
  onCenterSelect,
}: UniverseContentProps) {
  // Initialize positions
  const [spheres, setSpheres] = useState<Sphere3D[]>(() => {
    const needsInit = initialSpheres.every(
      s => s.position[0] === 0 && s.position[1] === 0 && s.position[2] === 0
    );
    return needsInit
      ? initializeSpherePositions(initialSpheres, 6 * xrConfig.scale, 'sphere')
      : initialSpheres.map(s => ({
          ...s,
          position: [
            s.position[0] * xrConfig.scale,
            s.position[1] * xrConfig.scale,
            s.position[2] * xrConfig.scale,
          ] as [number, number, number],
        }));
  });
  
  const [layoutStable, setLayoutStable] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  // Clustering
  const { visibleNodes, toggleCluster, isExpanded } = useClustering(
    spheres,
    { enabled: enableClustering }
  );
  
  // Layout animation
  useFrame(() => {
    if (!autoAnimate || layoutStable) return;
    
    setSpheres(prev => {
      const next = computeUniverseLayout(prev, relations, DEFAULT_FORCES);
      if (isLayoutStable(next, 0.0001)) {
        setLayoutStable(true);
      }
      return next;
    });
  });
  
  // XR interaction handlers
  const handleXRSelect = useCallback((nodeId: string, handedness: XRHandedness) => {
    setSelectedId(nodeId);
    onSphereSelect?.(nodeId);
  }, [onSphereSelect]);
  
  const handleXRHover = useCallback((nodeId: string | null, handedness: XRHandedness) => {
    setHoveredId(nodeId);
  }, []);
  
  const handleXRGrab = useCallback((nodeId: string, handedness: XRHandedness) => {
    // Double-grab to enter sphere
    onSphereEnter?.(nodeId);
  }, [onSphereEnter]);
  
  // Scale sphere size for XR
  const scaledSphereSize = useCallback((size: number) => {
    const scaled = size * xrConfig.scale;
    return Math.max(
      xrConfig.sphereMinSize,
      Math.min(xrConfig.sphereMaxSize, scaled)
    );
  }, [xrConfig]);
  
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#6366f1" />
      
      {/* Stars */}
      <Stars radius={100} depth={50} count={5000} factor={4} fade />
      
      {/* XR Interactions */}
      <XRInteractions
        nodes={visibleNodes}
        onSelect={handleXRSelect}
        onHover={handleXRHover}
        onGrab={handleXRGrab}
        showRay
      />
      
      {/* Teleport (only in VR) */}
      <XRTeleport floorY={0} maxDistance={15} />
      
      {/* Center Node (NOVA) */}
      <group 
        position={[
          center.position[0] * xrConfig.scale,
          center.position[1] * xrConfig.scale,
          center.position[2] * xrConfig.scale,
        ]}
        userData={{ nodeId: 'center' }}
        onClick={onCenterSelect}
      >
        <mesh>
          <icosahedronGeometry args={[center.size * xrConfig.scale, 2]} />
          <meshStandardMaterial
            color={center.color}
            emissive={center.glowColor}
            emissiveIntensity={center.glowIntensity}
            metalness={0.4}
            roughness={0.3}
          />
        </mesh>
        
        {/* Glow */}
        <mesh scale={1.5}>
          <sphereGeometry args={[center.size * xrConfig.scale, 32, 32]} />
          <meshBasicMaterial
            color={center.glowColor}
            transparent
            opacity={0.2}
            depthWrite={false}
          />
        </mesh>
      </group>
      
      {/* Spheres */}
      {spheres.map(sphere => (
        <XRSphere
          key={sphere.id}
          sphere={sphere}
          scale={xrConfig.scale}
          minSize={xrConfig.sphereMinSize}
          maxSize={xrConfig.sphereMaxSize}
          isHovered={hoveredId === sphere.id}
          isSelected={selectedId === sphere.id}
        />
      ))}
      
      {/* Relations */}
      {relations.map((rel, i) => {
        const from = spheres.find(s => s.id === rel.from);
        const to = spheres.find(s => s.id === rel.to);
        if (!from || !to) return null;
        
        return (
          <XRRelation
            key={`${rel.from}-${rel.to}-${i}`}
            from={from.position}
            to={to.position}
            strength={rel.strength}
            scale={xrConfig.scale}
            isHighlighted={hoveredId === rel.from || hoveredId === rel.to}
          />
        );
      })}
    </>
  );
}

// ─────────────────────────────────────────────────────
// XR SPHERE COMPONENT
// ─────────────────────────────────────────────────────

interface XRSphereProps {
  sphere: Sphere3D;
  scale: number;
  minSize: number;
  maxSize: number;
  isHovered: boolean;
  isSelected: boolean;
}

function XRSphere({ 
  sphere, 
  scale, 
  minSize, 
  maxSize,
  isHovered,
  isSelected,
}: XRSphereProps) {
  const size = Math.max(minSize, Math.min(maxSize, sphere.size * scale));
  
  const color = useMemo(() => {
    switch (sphere.type) {
      case 'business': return '#2196f3';
      case 'creative': return '#9c27b0';
      case 'personal': return '#4caf50';
      case 'scholar': return '#ff9800';
      default: return '#6366f1';
    }
  }, [sphere.type]);
  
  return (
    <group
      position={sphere.position}
      userData={{ nodeId: sphere.id }}
    >
      {/* Glow */}
      <mesh scale={1.5}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={sphere.activityLevel * 0.3}
          depthWrite={false}
        />
      </mesh>
      
      {/* Main sphere */}
      <mesh scale={isHovered ? 1.15 : isSelected ? 1.1 : 1}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={
            sphere.activityLevel * 0.3 + 
            (isHovered ? 0.3 : 0) + 
            (isSelected ? 0.5 : 0)
          }
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>
      
      {/* Selection ring */}
      {isSelected && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[size * 1.3, size * 1.4, 64]} />
          <meshBasicMaterial
            color="#fbbf24"
            transparent
            opacity={0.8}
          />
        </mesh>
      )}
    </group>
  );
}

// ─────────────────────────────────────────────────────
// XR RELATION LINE
// ─────────────────────────────────────────────────────

interface XRRelationProps {
  from: [number, number, number];
  to: [number, number, number];
  strength: number;
  scale: number;
  isHighlighted: boolean;
}

function XRRelation({ from, to, strength, scale, isHighlighted }: XRRelationProps) {
  const points = useMemo(() => [
    new THREE.Vector3(...from),
    new THREE.Vector3(...to),
  ], [from, to]);
  
  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);
  
  return (
    <line geometry={geometry}>
      <lineBasicMaterial
        color={isHighlighted ? '#fbbf24' : '#6366f1'}
        transparent
        opacity={isHighlighted ? 0.8 : strength * 0.4}
      />
    </line>
  );
}

// ─────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────

export function XRUniverseView({
  spheres,
  relations,
  center = DEFAULT_CENTER,
  xrEnabled = true,
  xrConfig: xrConfigProp,
  onSphereSelect,
  onSphereEnter,
  onCenterSelect,
  showStars = true,
  enableClustering = false,
  autoAnimate = true,
}: XRUniverseViewProps) {
  const xrConfig: XRUniverseConfig = {
    ...DEFAULT_XR_UNIVERSE,
    ...xrConfigProp,
  };
  
  return (
    <Canvas
      camera={{
        position: [0, xrConfig.playerHeight, 8],
        fov: 75,
      }}
      style={{ width: '100%', height: '100%' }}
    >
      <XRProvider
        enabled={xrEnabled}
        referenceSpace="local-floor"
        optionalFeatures={['hand-tracking']}
        config={xrConfig}
        showControllers
        showHands
      >
        <UniverseContent
          spheres={spheres}
          relations={relations}
          center={center}
          xrConfig={xrConfig}
          enableClustering={enableClustering}
          autoAnimate={autoAnimate}
          onSphereSelect={onSphereSelect}
          onSphereEnter={onSphereEnter}
          onCenterSelect={onCenterSelect}
        />
      </XRProvider>
    </Canvas>
  );
}

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default XRUniverseView;
