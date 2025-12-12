/* =====================================================
   CHE·NU — Sphere Node 3D
   PHASE 8: 3D Sphere component
   
   Renders individual spheres in the 3D universe with:
   - Theme-based colors
   - Activity-based glow
   - Hover/focus states
   - Labels
   ===================================================== */

import React, { useRef, useState, useMemo } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Sphere3D, Vector3 } from './universe3d.types';
import { Theme } from '../themes/theme.types';
import { getSphereColor } from '../themes/universeTheme';

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
// PROPS
// ─────────────────────────────────────────────────────

export interface SphereNodeProps {
  sphere: Sphere3D;
  theme?: Theme;
  position?: Vector3;
  
  // State
  isHovered?: boolean;
  isFocused?: boolean;
  isSelected?: boolean;
  
  // Callbacks
  onClick?: (sphereId: string) => void;
  onFocus?: (sphereId: string) => void;
  onEnter?: (sphereId: string) => void;     // Double-click: enter sphere
  onHover?: (sphereId: string | null) => void;
  onDoubleClick?: (sphereId: string) => void;
  
  // Options
  showLabel?: boolean;
  showNodeCount?: boolean;
  animationSpeed?: number;
}

// ─────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────

export const SphereNode: React.FC<SphereNodeProps> = ({
  sphere,
  theme,
  position,
  isHovered = false,
  isFocused = false,
  isSelected = false,
  onClick,
  onFocus,
  onEnter,
  onHover,
  onDoubleClick,
  showLabel = true,
  showNodeCount = true,
  animationSpeed = 1,
}) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);
  const [localHovered, setLocalHovered] = useState(false);
  
  const actualHovered = isHovered || localHovered;
  
  // Get colors from theme or defaults
  const colors = useMemo(() => {
    const defaultColor = getTypeColor(sphere.type);
    const baseColor = sphere.color || (theme ? getSphereColor(theme, sphere.type) : defaultColor);
    const emissiveColor = sphere.emissive || baseColor;
    
    return {
      base: baseColor,
      emissive: emissiveColor,
      hover: theme?.colors?.accent || '#ffd54f',
      focus: theme?.colors?.primary || '#6366f1',
    };
  }, [theme, sphere]);
  
  // Handle click — focus on sphere
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onClick?.(sphere.id);
    onFocus?.(sphere.id);
  };
  
  // Handle double-click — enter sphere (2D view or meeting)
  const handleDoubleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onDoubleClick?.(sphere.id);
    onEnter?.(sphere.id);
  };
  
  // Handle hover
  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setLocalHovered(true);
    onHover?.(sphere.id);
  };
  
  const handlePointerOut = () => {
    setLocalHovered(false);
    onHover?.(null);
  };
  
  // Calculate size based on state
  const scale = useMemo(() => {
    let s = 1;
    if (actualHovered) s = 1.15;
    if (isFocused) s = 1.25;
    if (isSelected) s = 1.1;
    return s;
  }, [actualHovered, isFocused, isSelected]);
  
  // Position
  const pos = position || sphere.position;
  
  // Animation
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    
    const time = clock.elapsedTime * animationSpeed;
    
    // Subtle rotation
    meshRef.current.rotation.y += 0.002 * animationSpeed;
    
    // Floating motion based on activity
    const floatAmplitude = 0.15 + sphere.activityLevel * 0.1;
    const floatSpeed = 0.5 + sphere.activityLevel * 0.5;
    meshRef.current.position.y = pos[1] + Math.sin(time * floatSpeed + sphere.id.charCodeAt(0)) * floatAmplitude;
    
    // Scale animation on hover
    const targetScale = scale;
    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.1
    );
    
    // Glow pulse
    if (glowRef.current) {
      const pulseIntensity = 0.3 + Math.sin(time * 2) * 0.1;
      const material = glowRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = (sphere.activityLevel * 0.4 + pulseIntensity) * (actualHovered ? 1.5 : 1);
    }
  });
  
  // Emissive intensity based on state
  const emissiveIntensity = useMemo(() => {
    let intensity = sphere.activityLevel * 0.3;
    if (actualHovered) intensity += 0.3;
    if (isFocused) intensity += 0.5;
    return Math.min(intensity, 1);
  }, [sphere.activityLevel, actualHovered, isFocused]);
  
  return (
    <group position={[pos[0], pos[1], pos[2]]}>
      {/* Glow sphere (larger, transparent) */}
      <mesh ref={glowRef} scale={[sphere.size * 1.5, sphere.size * 1.5, sphere.size * 1.5]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial
          color={colors.emissive}
          transparent
          opacity={sphere.activityLevel * 0.3}
          depthWrite={false}
        />
      </mesh>
      
      {/* Main sphere */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <sphereGeometry args={[sphere.size, 32, 32]} />
        <meshStandardMaterial
          color={actualHovered ? colors.hover : colors.base}
          emissive={colors.emissive}
          emissiveIntensity={emissiveIntensity}
          metalness={0.3}
          roughness={0.4}
          transparent
          opacity={sphere.opacity || 0.95}
        />
      </mesh>
      
      {/* Ring for focused/selected state */}
      {(isFocused || isSelected) && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[sphere.size * 1.3, sphere.size * 1.4, 64]} />
          <meshBasicMaterial
            color={isFocused ? colors.focus : colors.hover}
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
      
      {/* Label */}
      {showLabel && (
        <Text
          position={[0, sphere.size + 0.8, 0]}
          fontSize={0.5}
          color={theme.colors.textPrimary}
          anchorX="center"
          anchorY="bottom"
          font="/fonts/inter-medium.woff"
        >
          {sphere.label}
        </Text>
      )}
      
      {/* Node count badge */}
      {showNodeCount && sphere.nodeCount > 0 && (
        <Html
          position={[sphere.size * 0.7, -sphere.size * 0.7, sphere.size * 0.7]}
          center
          distanceFactor={15}
        >
          <div
            style={{
              background: theme.colors.surface,
              color: theme.colors.textPrimary,
              padding: '2px 6px',
              borderRadius: 10,
              fontSize: 10,
              fontWeight: 600,
              border: `1px solid ${colors.base}`,
              whiteSpace: 'nowrap',
            }}
          >
            {sphere.nodeCount}
          </div>
        </Html>
      )}
    </group>
  );
};

// ─────────────────────────────────────────────────────
// CENTER NODE (NOVA)
// ─────────────────────────────────────────────────────

export interface CenterNodeProps {
  label?: string;
  size?: number;
  color?: string;
  glowColor?: string;
  theme: Theme;
  onClick?: () => void;
  onHover?: (hovered: boolean) => void;
}

export const CenterNode: React.FC<CenterNodeProps> = ({
  label = 'NOVA',
  size = 1.5,
  color,
  glowColor,
  theme,
  onClick,
  onHover,
}) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  
  const actualColor = color || theme.colors.accent;
  const actualGlow = glowColor || actualColor;
  
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += 0.005;
    meshRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.3) * 0.1;
  });
  
  const handlePointerEnter = () => {
    setHovered(true);
    onHover?.(true);
    document.body.style.cursor = 'pointer';
  };
  
  const handlePointerLeave = () => {
    setHovered(false);
    onHover?.(false);
    document.body.style.cursor = 'auto';
  };
  
  return (
    <group>
      {/* Outer glow */}
      <mesh scale={[size * 2.5, size * 2.5, size * 2.5]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color={actualGlow}
          transparent
          opacity={0.15}
          depthWrite={false}
        />
      </mesh>
      
      {/* Inner glow */}
      <mesh scale={[size * 1.8, size * 1.8, size * 1.8]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color={actualGlow}
          transparent
          opacity={0.25}
          depthWrite={false}
        />
      </mesh>
      
      {/* Core sphere */}
      <mesh
        ref={meshRef}
        onClick={() => onClick?.()}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        scale={hovered ? [size * 1.1, size * 1.1, size * 1.1] : [size, size, size]}
      >
        <icosahedronGeometry args={[1, 2]} />
        <meshStandardMaterial
          color={actualColor}
          emissive={actualColor}
          emissiveIntensity={0.8}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Label */}
      <Text
        position={[0, size + 1, 0]}
        fontSize={0.6}
        color={theme.colors.textPrimary}
        anchorX="center"
        anchorY="bottom"
        fontWeight={700}
      >
        {label}
      </Text>
    </group>
  );
};

export default SphereNode;
