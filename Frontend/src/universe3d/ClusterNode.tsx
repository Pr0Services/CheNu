/* =====================================================
   CHE·NU — Cluster Node (React Three Fiber)
   
   Visual representation of a sphere cluster.
   Shows aggregated view that can be expanded
   to reveal individual spheres.
   
   Features:
   - Pulsing glow based on activity
   - Count indicator
   - Click to expand
   - Hover effects
   ===================================================== */

import React, { useRef, useState, useMemo } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import * as THREE from 'three';

import { SphereCluster, Vector3 } from './universe3d.types';
import { Theme } from '../themes/theme.types';

// ─────────────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────────────

export interface ClusterNodeProps {
  cluster: SphereCluster;
  theme?: Theme;
  
  // Callbacks
  onExpand?: (clusterId: string) => void;
  onCollapse?: (clusterId: string) => void;
  onHover?: (clusterId: string | null) => void;
  
  // State
  isHovered?: boolean;
  isExpanded?: boolean;
  
  // Options
  showLabel?: boolean;
  showCount?: boolean;
  animationSpeed?: number;
}

// ─────────────────────────────────────────────────────
// DEFAULT COLORS
// ─────────────────────────────────────────────────────

const DEFAULT_COLORS = {
  surface: '#1e1e2e',
  accent: '#6366f1',
  text: '#ffffff',
  glow: '#818cf8',
};

// ─────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────

export function ClusterNode({
  cluster,
  theme,
  onExpand,
  onCollapse,
  onHover,
  isHovered = false,
  isExpanded = false,
  showLabel = true,
  showCount = true,
  animationSpeed = 1,
}: ClusterNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);
  const ringsRef = useRef<THREE.Group>(null!);
  const [localHovered, setLocalHovered] = useState(false);
  
  const actualHovered = isHovered || localHovered;
  
  // Colors from theme or defaults
  const colors = useMemo(() => ({
    surface: theme?.colors?.surface || DEFAULT_COLORS.surface,
    accent: theme?.colors?.accent || DEFAULT_COLORS.accent,
    text: theme?.colors?.textPrimary || DEFAULT_COLORS.text,
    glow: theme?.colors?.primary || DEFAULT_COLORS.glow,
  }), [theme]);
  
  // Animation
  useFrame(({ clock }) => {
    const time = clock.elapsedTime * animationSpeed;
    
    if (meshRef.current) {
      // Gentle rotation
      meshRef.current.rotation.y += 0.003;
      meshRef.current.rotation.x = Math.sin(time * 0.5) * 0.1;
      
      // Scale on hover
      const targetScale = actualHovered ? 1.15 : 1;
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );
    }
    
    // Glow pulse
    if (glowRef.current) {
      const pulse = 0.3 + Math.sin(time * 2) * 0.15;
      const material = glowRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = (cluster.activityLevel * 0.5 + pulse) * (actualHovered ? 1.3 : 1);
    }
    
    // Rings rotation
    if (ringsRef.current) {
      ringsRef.current.rotation.z += 0.005;
      ringsRef.current.rotation.x = Math.sin(time * 0.3) * 0.2;
    }
  });
  
  // Handlers
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (isExpanded) {
      onCollapse?.(cluster.id);
    } else {
      onExpand?.(cluster.id);
    }
  };
  
  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setLocalHovered(true);
    onHover?.(cluster.id);
  };
  
  const handlePointerOut = () => {
    setLocalHovered(false);
    onHover?.(null);
  };
  
  const sphereCount = cluster.sphereIds.length;
  
  return (
    <group position={cluster.position as [number, number, number]}>
      {/* Outer glow */}
      <mesh ref={glowRef} scale={[cluster.size * 1.8, cluster.size * 1.8, cluster.size * 1.8]}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial
          color={colors.glow}
          transparent
          opacity={cluster.activityLevel * 0.25}
          depthWrite={false}
        />
      </mesh>
      
      {/* Orbital rings (indicates cluster) */}
      <group ref={ringsRef}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[cluster.size * 1.3, 0.02, 8, 64]} />
          <meshBasicMaterial
            color={colors.accent}
            transparent
            opacity={0.4}
          />
        </mesh>
        <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]}>
          <torusGeometry args={[cluster.size * 1.2, 0.015, 8, 64]} />
          <meshBasicMaterial
            color={colors.accent}
            transparent
            opacity={0.3}
          />
        </mesh>
      </group>
      
      {/* Main cluster sphere */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <sphereGeometry args={[cluster.size, 24, 24]} />
        <meshStandardMaterial
          color={colors.surface}
          emissive={colors.accent}
          emissiveIntensity={cluster.activityLevel * 0.3 + (actualHovered ? 0.2 : 0)}
          metalness={0.4}
          roughness={0.5}
          transparent
          opacity={0.85}
        />
      </mesh>
      
      {/* Inner spheres indicator */}
      {sphereCount > 0 && (
        <group>
          {Array.from({ length: Math.min(sphereCount, 5) }).map((_, i) => {
            const angle = (Math.PI * 2 * i) / Math.min(sphereCount, 5);
            const r = cluster.size * 0.5;
            return (
              <mesh
                key={i}
                position={[
                  Math.cos(angle) * r,
                  0,
                  Math.sin(angle) * r,
                ]}
                scale={0.15}
              >
                <sphereGeometry args={[1, 8, 8]} />
                <meshBasicMaterial
                  color={colors.accent}
                  transparent
                  opacity={0.6}
                />
              </mesh>
            );
          })}
        </group>
      )}
      
      {/* Count badge */}
      {showCount && (
        <Html
          center
          distanceFactor={8}
          position={[0, 0, 0]}
          style={{ pointerEvents: 'none' }}
        >
          <div style={{
            background: colors.accent,
            color: '#fff',
            borderRadius: '50%',
            width: 28,
            height: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: 700,
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }}>
            {sphereCount}
          </div>
        </Html>
      )}
      
      {/* Label */}
      {showLabel && actualHovered && (
        <Html
          center
          distanceFactor={8}
          position={[0, cluster.size + 0.8, 0]}
          style={{ pointerEvents: 'none' }}
        >
          <div style={{
            color: colors.text,
            fontSize: 12,
            fontWeight: 500,
            textShadow: '0 0 10px rgba(0,0,0,0.9)',
            whiteSpace: 'nowrap',
            background: 'rgba(0,0,0,0.6)',
            padding: '4px 8px',
            borderRadius: 4,
          }}>
            {cluster.label || `${sphereCount} spheres`}
            <span style={{ opacity: 0.7, marginLeft: 8 }}>
              Click to expand
            </span>
          </div>
        </Html>
      )}
    </group>
  );
}

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default ClusterNode;
