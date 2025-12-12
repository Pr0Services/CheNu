/* =====================================================
   CHE·NU — XR Human Avatar
   
   Visual representation of a human participant in VR/AR.
   
   Features:
   - Stylized body and head
   - Name tag display
   - Speaking/listening indicators
   - Role badge
   - Animation states
   ===================================================== */

import React, { useRef, useState, useMemo } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { Html, Billboard, Text } from '@react-three/drei';
import * as THREE from 'three';

import {
  XRHumanAvatarProps,
  HumanAvatar,
  AvatarState,
  DEFAULT_HUMAN_ANIMATION,
} from './avatar.types';
import {
  AvatarTheme,
  DEFAULT_AVATAR_THEME,
  getStateColor,
} from './avatarThemes';

// ─────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────

export function XRHumanAvatar({
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
  showBody = true,
  showHead = true,
  isLocalPlayer = false,
}: XRHumanAvatarProps) {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  const theme = DEFAULT_AVATAR_THEME;
  const state = avatar.state || 'idle';
  const animation = DEFAULT_HUMAN_ANIMATION;
  
  // Colors
  const colors = useMemo(() => ({
    body: avatar.bodyColor || theme.human.bodyColor,
    head: avatar.headColor || theme.human.headColor,
    accent: avatar.accentColor || theme.human.accentColor,
    state: getStateColor(state),
  }), [avatar, theme, state]);
  
  // Animation
  useFrame(({ clock }) => {
    if (!animate || !groupRef.current) return;
    
    const time = clock.elapsedTime;
    
    // Idle bobbing
    if (state === 'idle' || state === 'listening') {
      groupRef.current.position.y = 
        position[1] + Math.sin(time * animation.idle.bobSpeed) * animation.idle.bobAmplitude;
    }
    
    // Thinking pulse
    if (state === 'thinking' && headRef.current) {
      const pulse = 1 + Math.sin(time * animation.thinking.pulseSpeed) * animation.thinking.pulseAmplitude;
      headRef.current.scale.setScalar(pulse);
    }
    
    // Speaking animation handled by SpeakingIndicator
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
  
  // Don't render body for local player in VR (they can't see themselves)
  const renderBody = showBody && !isLocalPlayer;
  
  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation as [number, number, number]}
      scale={scale}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* Body */}
      {renderBody && (
        <mesh ref={bodyRef} position={[0, 0.9, 0]}>
          <capsuleGeometry args={[0.25, 0.9, 6, 12]} />
          <meshStandardMaterial
            color={colors.body}
            metalness={0.1}
            roughness={0.8}
          />
        </mesh>
      )}
      
      {/* Head */}
      {showHead && !isLocalPlayer && (
        <mesh ref={headRef} position={[0, 1.5, 0]}>
          <sphereGeometry args={[0.22, 24, 24]} />
          <meshStandardMaterial
            color={colors.head}
            metalness={0.1}
            roughness={0.7}
          />
        </mesh>
      )}
      
      {/* Face indicator (eyes) */}
      {showHead && !isLocalPlayer && (
        <group position={[0, 1.5, 0.18]}>
          <mesh position={[-0.08, 0.02, 0]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshBasicMaterial color="#333" />
          </mesh>
          <mesh position={[0.08, 0.02, 0]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshBasicMaterial color="#333" />
          </mesh>
        </group>
      )}
      
      {/* State indicator ring (at feet) */}
      {showState && (
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.35, 0.4, 32]} />
          <meshBasicMaterial
            color={colors.state}
            transparent
            opacity={0.6}
          />
        </mesh>
      )}
      
      {/* Speaking waves */}
      {state === 'speaking' && (
        <SpeakingWaves
          position={[0, 1.7, 0]}
          color={colors.state}
          animation={animation}
        />
      )}
      
      {/* Listening indicator */}
      {state === 'listening' && (
        <ListeningIndicator
          position={[0.35, 1.5, 0]}
          color={colors.state}
        />
      )}
      
      {/* Name tag */}
      {showName && avatar.displayName && (
        <Billboard position={[0, 1.95, 0]}>
          <Html center style={{ pointerEvents: 'none' }}>
            <div style={{
              background: theme.human.nameTagBg,
              color: theme.human.nameTagText,
              padding: '4px 12px',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600,
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              opacity: hovered ? 1 : 0.85,
              transform: hovered ? 'scale(1.05)' : 'scale(1)',
              transition: 'all 0.2s',
            }}>
              {avatar.displayName}
            </div>
          </Html>
        </Billboard>
      )}
      
      {/* Role badge */}
      {showRole && avatar.role && (
        <Billboard position={[0, 1.75, 0]}>
          <Html center style={{ pointerEvents: 'none' }}>
            <div style={{
              color: colors.accent,
              fontSize: 9,
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: 1,
              opacity: hovered ? 1 : 0.7,
            }}>
              {avatar.role}
            </div>
          </Html>
        </Billboard>
      )}
      
      {/* Owner badge */}
      {avatar.isOwner && (
        <mesh position={[0.3, 1.65, 0]}>
          <octahedronGeometry args={[0.05]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#fbbf24"
            emissiveIntensity={0.5}
          />
        </mesh>
      )}
      
      {/* Hover highlight */}
      {hovered && (
        <mesh position={[0, 0.9, 0]}>
          <capsuleGeometry args={[0.28, 0.95, 6, 12]} />
          <meshBasicMaterial
            color={colors.accent}
            transparent
            opacity={0.15}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}

// ─────────────────────────────────────────────────────
// SPEAKING WAVES
// ─────────────────────────────────────────────────────

function SpeakingWaves({
  position,
  color,
  animation,
}: {
  position: [number, number, number];
  color: string;
  animation: typeof DEFAULT_HUMAN_ANIMATION;
}) {
  const wave1Ref = useRef<THREE.Mesh>(null);
  const wave2Ref = useRef<THREE.Mesh>(null);
  const wave3Ref = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    const time = clock.elapsedTime * animation.speaking.waveSpeed;
    
    [wave1Ref, wave2Ref, wave3Ref].forEach((ref, i) => {
      if (ref.current) {
        const scale = 0.1 + (i * 0.05) + Math.sin(time - i * 0.4) * 0.03;
        ref.current.scale.set(scale, scale, scale);
        const material = ref.current.material as THREE.MeshBasicMaterial;
        material.opacity = 0.5 - i * 0.15 - Math.sin(time - i * 0.4) * 0.1;
      }
    });
  });
  
  return (
    <group position={position}>
      {[wave1Ref, wave2Ref, wave3Ref].map((ref, i) => (
        <mesh key={i} ref={ref}>
          <ringGeometry args={[1, 1.2, 16]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.5 - i * 0.15}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────────────
// LISTENING INDICATOR
// ─────────────────────────────────────────────────────

function ListeningIndicator({
  position,
  color,
}: {
  position: [number, number, number];
  color: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      const time = clock.elapsedTime;
      meshRef.current.scale.setScalar(0.8 + Math.sin(time * 3) * 0.2);
    }
  });
  
  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
        />
      </mesh>
      <Html center position={[0, 0.12, 0]} style={{ pointerEvents: 'none' }}>
        <span style={{ fontSize: 12 }}>🎤</span>
      </Html>
    </group>
  );
}

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default XRHumanAvatar;
