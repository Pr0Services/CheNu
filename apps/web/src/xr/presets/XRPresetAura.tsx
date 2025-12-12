/* =========================================================
   CHE·NU — XR PRESET AURA
   
   Composant Three.js/React-Three-Fiber pour afficher
   l'aura visuelle du preset actif en environnement XR.
   ========================================================= */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import {
  XRPresetVisual,
  XRPresetAnimation,
  ALL_XR_PRESET_VISUALS,
  getPresetVisualOrDefault,
  calculateAuraOpacity,
  calculateEmissiveIntensity,
  getAnimationParams,
  combineWithSphere,
} from './xrPresetVisuals';

// ─────────────────────────────────────────────────────────
// 1. TYPES
// ─────────────────────────────────────────────────────────

export interface XRPresetAuraProps {
  /** ID du preset actif */
  presetId?: string;
  /** Position de l'aura [x, y, z] */
  position?: [number, number, number];
  /** Sphère active (pour blend visuel) */
  sphereId?: string;
  /** Visibilité */
  visible?: boolean;
  /** Échelle globale */
  scale?: number;
  /** Callback quand l'aura est cliquée */
  onClick?: () => void;
}

// ─────────────────────────────────────────────────────────
// 2. ANIMATION HELPERS
// ─────────────────────────────────────────────────────────

/**
 * Calcule la valeur d'animation pulse.
 */
function pulseAnimation(time: number, speed: number): number {
  return 1 + Math.sin(time * speed * 2) * 0.1;
}

/**
 * Calcule la valeur d'animation wave.
 */
function waveAnimation(time: number, speed: number): number {
  return 1 + Math.sin(time * speed) * 0.05 + Math.cos(time * speed * 1.5) * 0.03;
}

/**
 * Calcule la valeur d'animation breathe.
 */
function breatheAnimation(time: number, speed: number): number {
  const breath = Math.sin(time * speed * 0.5);
  return 1 + breath * breath * 0.15;
}

/**
 * Calcule la valeur d'animation shimmer.
 */
function shimmerAnimation(time: number, speed: number): number {
  return 1 + Math.sin(time * speed * 3) * 0.02 + Math.random() * 0.01;
}

/**
 * Obtient la fonction d'animation appropriée.
 */
function getAnimationFunction(
  type: XRPresetAnimation
): (time: number, speed: number) => number {
  switch (type) {
    case 'pulse':
      return pulseAnimation;
    case 'wave':
      return waveAnimation;
    case 'breathe':
      return breatheAnimation;
    case 'shimmer':
      return shimmerAnimation;
    default:
      return () => 1;
  }
}

// ─────────────────────────────────────────────────────────
// 3. XR PRESET AURA COMPONENT
// ─────────────────────────────────────────────────────────

/**
 * Composant d'aura visuelle pour le preset actif.
 * Affiche une sphère semi-transparente avec effets lumineux.
 */
export function XRPresetAura({
  presetId,
  position = [0, 1.6, 0],
  sphereId,
  visible = true,
  scale = 1,
  onClick,
}: XRPresetAuraProps) {
  // Refs
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  // Get visual config
  const visual = useMemo(() => {
    if (!presetId) return null;
    
    let baseVisual = getPresetVisualOrDefault(presetId);
    
    // Combine avec la sphère si spécifiée
    if (sphereId) {
      baseVisual = combineWithSphere(baseVisual, sphereId);
    }
    
    return baseVisual;
  }, [presetId, sphereId]);

  // Animation params
  const animParams = useMemo(() => {
    if (!visual) return { type: 'static' as XRPresetAnimation, speed: 1, enabled: false };
    return getAnimationParams(visual);
  }, [visual]);

  // Animation frame
  useFrame((state) => {
    if (!meshRef.current || !materialRef.current || !visual) return;
    if (!animParams.enabled) return;

    const time = state.clock.getElapsedTime();
    const animFn = getAnimationFunction(animParams.type);
    const animValue = animFn(time, animParams.speed);

    // Animate scale
    meshRef.current.scale.setScalar(visual.radius * scale * animValue);

    // Animate opacity slightly
    const baseOpacity = calculateAuraOpacity(visual);
    materialRef.current.opacity = baseOpacity * (0.9 + animValue * 0.1);
  });

  // Don't render if no preset or not visible
  if (!presetId || !visual || !visible) return null;

  const opacity = calculateAuraOpacity(visual);
  const emissiveIntensity = calculateEmissiveIntensity(visual);

  return (
    <group position={position}>
      {/* Main Aura Sphere */}
      <mesh
        ref={meshRef}
        scale={visual.radius * scale}
        onClick={onClick}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          ref={materialRef}
          color={visual.color}
          transparent
          opacity={opacity}
          emissive={visual.color}
          emissiveIntensity={emissiveIntensity}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Inner Glow */}
      <mesh scale={visual.radius * scale * 0.8}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshStandardMaterial
          color={visual.secondaryColor || visual.color}
          transparent
          opacity={opacity * 0.5}
          emissive={visual.secondaryColor || visual.color}
          emissiveIntensity={emissiveIntensity * 0.6}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Core Point Light */}
      <pointLight
        color={visual.color}
        intensity={visual.intensity * 0.5}
        distance={visual.radius * 3}
        decay={2}
      />
    </group>
  );
}

// ─────────────────────────────────────────────────────────
// 4. XR PRESET AURA PARTICLES
// ─────────────────────────────────────────────────────────

interface XRPresetAuraParticlesProps {
  visual: XRPresetVisual;
  position: [number, number, number];
  scale: number;
}

/**
 * Particules optionnelles autour de l'aura.
 */
export function XRPresetAuraParticles({
  visual,
  position,
  scale,
}: XRPresetAuraParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate particle positions
  const particles = useMemo(() => {
    const count = visual.particleCount || 30;
    const positions = new Float32Array(count * 3);
    const radius = visual.radius * scale * 1.2;

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * (0.8 + Math.random() * 0.4);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }

    return positions;
  }, [visual.particleCount, visual.radius, scale]);

  // Animate particles
  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();
    pointsRef.current.rotation.y = time * 0.1;
    pointsRef.current.rotation.x = Math.sin(time * 0.05) * 0.1;
  });

  if (!visual.particles) return null;

  return (
    <points ref={pointsRef} position={position}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={particles}
          count={particles.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={visual.color}
        size={0.02}
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// ─────────────────────────────────────────────────────────
// 5. COMPLETE XR PRESET AURA WITH PARTICLES
// ─────────────────────────────────────────────────────────

/**
 * Aura complète avec particules optionnelles.
 */
export function XRPresetAuraComplete({
  presetId,
  position = [0, 1.6, 0],
  sphereId,
  visible = true,
  scale = 1,
  onClick,
}: XRPresetAuraProps) {
  const visual = useMemo(() => {
    if (!presetId) return null;
    let baseVisual = getPresetVisualOrDefault(presetId);
    if (sphereId) {
      baseVisual = combineWithSphere(baseVisual, sphereId);
    }
    return baseVisual;
  }, [presetId, sphereId]);

  if (!presetId || !visual || !visible) return null;

  return (
    <>
      <XRPresetAura
        presetId={presetId}
        position={position}
        sphereId={sphereId}
        visible={visible}
        scale={scale}
        onClick={onClick}
      />
      {visual.particles && (
        <XRPresetAuraParticles
          visual={visual}
          position={position}
          scale={scale}
        />
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────
// 6. EXPORTS
// ─────────────────────────────────────────────────────────

export default XRPresetAura;
