/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ 3D - SPACE BASE COMPONENT
 * Composant de base réutilisable pour tous les espaces
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useRef, useState, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import * as THREE from 'three';

import { useWorld3DStore, SpaceId } from '../../stores/world3DStore';
import { SPACES_CONFIG, SpaceConfig } from '../../config/spacesConfig';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface SpaceBaseProps {
  spaceId: SpaceId;
  children: React.ReactNode;
}

// ─────────────────────────────────────────────────────────────────────────────
// GLOW RING
// ─────────────────────────────────────────────────────────────────────────────

function GlowRing({ color, isVisible }: { color: number; isVisible: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = THREE.MathUtils.lerp(
        material.opacity,
        isVisible ? 0.6 : 0,
        0.1
      );
    }
  });
  
  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
      <ringGeometry args={[3.2, 3.8, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0} side={THREE.DoubleSide} />
    </mesh>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PLATFORM
// ─────────────────────────────────────────────────────────────────────────────

function Platform() {
  return (
    <mesh position={[0, -0.15, 0]} receiveShadow>
      <cylinderGeometry args={[3, 3.5, 0.3, 32]} />
      <meshStandardMaterial color="#2A2A2A" roughness={0.8} metalness={0.2} />
    </mesh>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FLOATING LABEL
// ─────────────────────────────────────────────────────────────────────────────

function FloatingLabel({ name, isVisible }: { name: string; isVisible: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.scale.setScalar(
        THREE.MathUtils.lerp(groupRef.current.scale.x, isVisible ? 1 : 0, 0.1)
      );
    }
  });
  
  return (
    <group ref={groupRef} position={[0, 4.5, 0]} scale={0}>
      <Text
        fontSize={0.5}
        color="#E9E4D6"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-SemiBold.woff"
      >
        {name}
      </Text>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SPACE BASE
// ─────────────────────────────────────────────────────────────────────────────

export function SpaceBase({ spaceId, children }: SpaceBaseProps) {
  const groupRef = useRef<THREE.Group>(null);
  const config = SPACES_CONFIG[spaceId];
  
  const { 
    hoveredSpace, 
    selectedSpace,
    setHoveredSpace, 
    selectSpace,
    focusOnSpace 
  } = useWorld3DStore();
  
  const isHovered = hoveredSpace === spaceId;
  const isSelected = selectedSpace === spaceId;
  
  // Animation
  useFrame((state) => {
    if (groupRef.current) {
      // Breathing animation
      const breathe = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      groupRef.current.position.y = config.position[1] + breathe;
      
      // Scale on hover
      const targetScale = isHovered ? 1.05 : 1;
      groupRef.current.scale.setScalar(
        THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.1)
      );
    }
  });
  
  // Events
  const handlePointerOver = useCallback((e: any) => {
    e.stopPropagation();
    setHoveredSpace(spaceId);
    document.body.style.cursor = 'pointer';
  }, [spaceId, setHoveredSpace]);
  
  const handlePointerOut = useCallback(() => {
    setHoveredSpace(null);
    document.body.style.cursor = 'default';
  }, [setHoveredSpace]);
  
  const handleClick = useCallback((e: any) => {
    e.stopPropagation();
    selectSpace(spaceId);
  }, [spaceId, selectSpace]);
  
  const handleDoubleClick = useCallback((e: any) => {
    e.stopPropagation();
    focusOnSpace(spaceId);
  }, [spaceId, focusOnSpace]);
  
  return (
    <group
      ref={groupRef}
      position={config.position}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {/* Platform */}
      <Platform />
      
      {/* Glow ring */}
      <GlowRing color={config.color} isVisible={isHovered || isSelected} />
      
      {/* Floating label */}
      <FloatingLabel name={config.name} isVisible={isHovered} />
      
      {/* Space-specific 3D model */}
      {children}
    </group>
  );
}

export default SpaceBase;
