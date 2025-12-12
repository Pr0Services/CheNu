/* =====================================================
   CHE·NU — XR Agent Avatar
   
   Visual representation of an AI agent in VR/AR.
   
   Features:
   - Geometric core (icosahedron/octahedron/etc)
   - Glowing aura based on state
   - Orbital rings showing activity
   - Role-based coloring
   - Speaking/thinking animations
   ===================================================== */

import React, { useRef, useState, useMemo } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { Html, Billboard } from '@react-three/drei';
import * as THREE from 'three';

import {
  XRAgentAvatarProps,
  AgentAvatar,
  AvatarState,
  DEFAULT_AGENT_ANIMATION,
} from './avatar.types';
import {
  AvatarTheme,
  DEFAULT_AVATAR_THEME,
  getStateColor,
  getRoleColor,
  getGlowIntensity,
} from './avatarThemes';

// ─────────────────────────────────────────────────────
// GEOMETRY TYPES
// ─────────────────────────────────────────────────────

type GeometryType = 'icosahedron' | 'octahedron' | 'dodecahedron' | 'sphere';

function CoreGeometry({ 
  type, 
  size 
}: { 
  type: GeometryType; 
  size: number;
}) {
  switch (type) {
    case 'octahedron':
      return <octahedronGeometry args={[size]} />;
    case 'dodecahedron':
      return <dodecahedronGeometry args={[size]} />;
    case 'sphere':
      return <sphereGeometry args={[size, 24, 24]} />;
    case 'icosahedron':
    default:
      return <icosahedronGeometry args={[size, 1]} />;
  }
}

// ─────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────

export function XRAgentAvatar({
  avatar,
  position,
  rotation = [0, 0, 0],
  scale = 1,
  onClick,
  onHover,
  showName = true,
  showRole = true,
  showState = true,
  animate = true,
  showAura = true,
  showRings = true,
  pulseOnThinking = true,
}: XRAgentAvatarProps) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const auraRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  const theme = DEFAULT_AVATAR_THEME;
  const state = avatar.state || 'idle';
  const animation = DEFAULT_AGENT_ANIMATION;
  
  // Determine colors
  const colors = useMemo(() => {
    const roleColor = avatar.agentRole ? getRoleColor(avatar.agentRole) : theme.agent.coreColor;
    const stateColor = getStateColor(state);
    
    return {
      core: state !== 'idle' ? stateColor : roleColor,
      aura: state !== 'idle' ? stateColor : roleColor,
      ring: avatar.color || roleColor,
    };
  }, [avatar, theme, state]);
  
  // Glow intensity based on state and confidence
  const glowIntensity = useMemo(() => {
    const base = avatar.glowIntensity || theme.agent.glowIntensity;
    const stateMultiplier = getGlowIntensity(state, 1);
    const confidenceMultiplier = avatar.confidence !== undefined 
      ? 0.5 + avatar.confidence * 0.5 
      : 1;
    return base * stateMultiplier * confidenceMultiplier;
  }, [avatar, theme, state]);
  
  // Core size
  const coreSize = 0.2 * scale;
  const geometryType = avatar.geometryType || 'icosahedron';
  
  // Animation
  useFrame(({ clock }) => {
    if (!animate) return;
    
    const time = clock.elapsedTime;
    
    // Base position bobbing
    if (groupRef.current) {
      groupRef.current.position.y = 
        position[1] + Math.sin(time * animation.idle.bobSpeed) * animation.idle.bobAmplitude;
    }
    
    // Core rotation
    if (coreRef.current) {
      coreRef.current.rotation.y += animation.idle.rotationSpeed * 0.01;
      coreRef.current.rotation.x = Math.sin(time * 0.5) * 0.1;
      
      // Thinking pulse
      if (state === 'thinking' && pulseOnThinking) {
        const pulse = 1 + Math.sin(time * animation.thinking.pulseSpeed) * animation.thinking.pulseAmplitude;
        coreRef.current.scale.setScalar(pulse);
      } else {
        const targetScale = hovered ? 1.15 : 1;
        coreRef.current.scale.lerp(
          new THREE.Vector3(targetScale, targetScale, targetScale),
          0.1
        );
      }
    }
    
    // Aura pulsing
    if (auraRef.current) {
      const material = auraRef.current.material as THREE.MeshBasicMaterial;
      const baseOpacity = state === 'speaking' ? 0.4 : 0.2;
      material.opacity = baseOpacity + Math.sin(time * 2) * 0.1;
      
      // Scale aura on hover
      const auraScale = hovered ? 2.2 : 2;
      auraRef.current.scale.setScalar(auraScale);
    }
    
    // Ring rotations
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += 0.01;
      ring1Ref.current.rotation.x = Math.sin(time * 0.3) * 0.2;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= 0.008;
      ring2Ref.current.rotation.y = Math.cos(time * 0.4) * 0.2;
    }
  });
  
  // Handlers
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onClick?.();
  };
  
  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    onHover?.(true);
  };
  
  const handlePointerOut = () => {
    setHovered(false);
    onHover?.(false);
  };
  
  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation as [number, number, number]}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* Aura (outer glow) */}
      {showAura && (
        <mesh ref={auraRef} scale={2}>
          <sphereGeometry args={[coreSize, 16, 16]} />
          <meshBasicMaterial
            color={colors.aura}
            transparent
            opacity={0.2}
            depthWrite={false}
          />
        </mesh>
      )}
      
      {/* Orbital rings */}
      {showRings && (avatar.isActive || hovered) && (
        <>
          <mesh ref={ring1Ref} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[coreSize * 1.5, 0.01, 8, 32]} />
            <meshBasicMaterial
              color={colors.ring}
              transparent
              opacity={0.6}
            />
          </mesh>
          <mesh ref={ring2Ref} rotation={[Math.PI / 3, Math.PI / 4, 0]}>
            <torusGeometry args={[coreSize * 1.3, 0.008, 8, 32]} />
            <meshBasicMaterial
              color={colors.ring}
              transparent
              opacity={0.4}
            />
          </mesh>
        </>
      )}
      
      {/* Core (main geometry) */}
      <mesh ref={coreRef}>
        <CoreGeometry type={geometryType} size={coreSize} />
        <meshStandardMaterial
          color={colors.core}
          emissive={colors.core}
          emissiveIntensity={glowIntensity}
          metalness={0.4}
          roughness={0.3}
        />
      </mesh>
      
      {/* Inner glow point */}
      <mesh scale={0.5}>
        <sphereGeometry args={[coreSize * 0.5, 12, 12]} />
        <meshBasicMaterial
          color="white"
          transparent
          opacity={0.3 + glowIntensity * 0.2}
        />
      </mesh>
      
      {/* Speaking waves */}
      {state === 'speaking' && (
        <SpeakingWaves color={colors.core} size={coreSize} />
      )}
      
      {/* Thinking particles */}
      {state === 'thinking' && (
        <ThinkingParticles color={colors.core} size={coreSize} />
      )}
      
      {/* Warning indicator */}
      {state === 'warning' && (
        <WarningIndicator color={colors.core} size={coreSize} />
      )}
      
      {/* State indicator dot */}
      {showState && state !== 'idle' && (
        <mesh position={[coreSize + 0.05, coreSize + 0.05, 0]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color={colors.core} />
        </mesh>
      )}
      
      {/* Name label */}
      {showName && avatar.displayName && (
        <Billboard position={[0, coreSize + 0.2, 0]}>
          <Html center style={{ pointerEvents: 'none' }}>
            <div style={{
              color: 'white',
              fontSize: 11,
              fontWeight: 600,
              textShadow: '0 0 8px rgba(0,0,0,0.9)',
              whiteSpace: 'nowrap',
              opacity: hovered ? 1 : 0.8,
            }}>
              {avatar.displayName}
            </div>
          </Html>
        </Billboard>
      )}
      
      {/* Role label */}
      {showRole && avatar.agentRole && (
        <Billboard position={[0, coreSize + 0.35, 0]}>
          <Html center style={{ pointerEvents: 'none' }}>
            <div style={{
              color: colors.ring,
              fontSize: 9,
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: 1,
              opacity: hovered ? 1 : 0.6,
            }}>
              {avatar.agentRole}
            </div>
          </Html>
        </Billboard>
      )}
      
      {/* Confidence indicator */}
      {avatar.confidence !== undefined && hovered && (
        <Billboard position={[0, -coreSize - 0.15, 0]}>
          <Html center style={{ pointerEvents: 'none' }}>
            <div style={{
              color: '#9ca3af',
              fontSize: 9,
            }}>
              {Math.round(avatar.confidence * 100)}% confiance
            </div>
          </Html>
        </Billboard>
      )}
    </group>
  );
}

// ─────────────────────────────────────────────────────
// SPEAKING WAVES
// ─────────────────────────────────────────────────────

function SpeakingWaves({ color, size }: { color: string; size: number }) {
  const waves = useRef<THREE.Mesh[]>([]);
  
  useFrame(({ clock }) => {
    const time = clock.elapsedTime;
    waves.current.forEach((wave, i) => {
      if (wave) {
        const scale = 1.5 + i * 0.3 + Math.sin(time * 4 - i * 0.5) * 0.2;
        wave.scale.setScalar(scale);
        const material = wave.material as THREE.MeshBasicMaterial;
        material.opacity = 0.4 - i * 0.1;
      }
    });
  });
  
  return (
    <>
      {[0, 1, 2].map(i => (
        <mesh
          key={i}
          ref={el => { if (el) waves.current[i] = el; }}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[size, size * 1.1, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.4 - i * 0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </>
  );
}

// ─────────────────────────────────────────────────────
// THINKING PARTICLES
// ─────────────────────────────────────────────────────

function ThinkingParticles({ color, size }: { color: string; size: number }) {
  const particlesRef = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => {
    const count = 20;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = (i / count) * Math.PI * 2;
      const r = size * 1.5;
      pos[i * 3] = Math.cos(theta) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * size;
      pos[i * 3 + 2] = Math.sin(theta) * r;
    }
    return pos;
  }, [size]);
  
  useFrame(({ clock }) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.02;
      
      const pos = particlesRef.current.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const y = pos.getY(i);
        pos.setY(i, y + Math.sin(clock.elapsedTime * 3 + i) * 0.002);
      }
      pos.needsUpdate = true;
    }
  });
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.02}
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
}

// ─────────────────────────────────────────────────────
// WARNING INDICATOR
// ─────────────────────────────────────────────────────

function WarningIndicator({ color, size }: { color: string; size: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      const time = clock.elapsedTime;
      meshRef.current.visible = Math.sin(time * 6) > 0;
    }
  });
  
  return (
    <mesh ref={meshRef} position={[0, size + 0.15, 0]}>
      <coneGeometry args={[0.05, 0.1, 3]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default XRAgentAvatar;
