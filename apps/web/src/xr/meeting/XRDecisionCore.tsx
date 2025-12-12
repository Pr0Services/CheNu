/* =====================================================
   CHE·NU — XR Decision Core
   
   Central decision platform in VR meeting room.
   Visual states:
   - Idle: Subtle glow
   - Active (analysis): Blue pulsing
   - Decision: Golden glow, ready for input
   
   The human stands at the core to make decisions.
   ===================================================== */

import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Text } from '@react-three/drei';
import * as THREE from 'three';

import {
  XRMeetingContext,
  XRMeetingLayout,
  XRMeetingTheme,
  PendingDecision,
  DecisionOption,
  DEFAULT_MEETING_LAYOUT,
  DEFAULT_MEETING_THEME,
} from './xrMeeting.types';

// ─────────────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────────────

export interface XRDecisionCoreProps {
  context: XRMeetingContext;
  layout?: Partial<XRMeetingLayout>;
  theme?: Partial<XRMeetingTheme>;
  
  // Callbacks
  onDecisionSelect?: (optionId: string) => void;
  onCoreTouch?: () => void;
}

// ─────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────

export function XRDecisionCore({
  context,
  layout: layoutProp,
  theme: themeProp,
  onDecisionSelect,
  onCoreTouch,
}: XRDecisionCoreProps) {
  const layout = { ...DEFAULT_MEETING_LAYOUT, ...layoutProp };
  const theme = { ...DEFAULT_MEETING_THEME, ...themeProp };
  
  const coreRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  
  const [hovered, setHovered] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  // Determine glow color based on phase
  const glowColor = useMemo(() => {
    switch (context.phase) {
      case 'decision':
      case 'validation':
        return theme.coreDecisionColor;
      case 'analysis':
      case 'deliberation':
        return theme.coreActiveColor;
      default:
        return theme.coreIdleColor;
    }
  }, [context.phase, theme]);
  
  // Particles for ambient effect
  const particles = useMemo(() => {
    const count = theme.particleCount;
    const positions = new Float32Array(count * 3);
    const radius = layout.decisionCoreRadius * 2;
    
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * (0.5 + Math.random() * 0.5);
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    
    return positions;
  }, [layout.decisionCoreRadius, theme.particleCount]);
  
  // Animation
  useFrame(({ clock }) => {
    const time = clock.elapsedTime;
    
    // Core rotation
    if (coreRef.current) {
      coreRef.current.rotation.y += 0.005;
    }
    
    // Glow pulsing
    if (glowRef.current) {
      const material = glowRef.current.material as THREE.MeshBasicMaterial;
      const baseOpacity = context.phase === 'decision' ? 0.6 : 0.3;
      const pulse = Math.sin(time * 2) * 0.1;
      material.opacity = baseOpacity + pulse + (hovered ? 0.2 : 0);
    }
    
    // Ring rotation (opposite direction)
    if (ringRef.current) {
      ringRef.current.rotation.z -= 0.003;
    }
    
    // Particles floating
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.002;
      const positions = particlesRef.current.geometry.attributes.position;
      for (let i = 0; i < positions.count; i++) {
        const y = positions.getY(i);
        positions.setY(i, y + Math.sin(time + i) * 0.001);
      }
      positions.needsUpdate = true;
    }
  });
  
  // Handle option selection
  const handleOptionClick = (optionId: string) => {
    setSelectedOption(optionId);
    onDecisionSelect?.(optionId);
  };
  
  const position = layout.decisionCore.position;
  const radius = layout.decisionCoreRadius;
  
  return (
    <group position={position}>
      {/* Main platform (cylinder) */}
      <mesh
        ref={coreRef}
        onClick={() => onCoreTouch?.()}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <cylinderGeometry args={[radius, radius, 0.1, 64]} />
        <meshStandardMaterial
          color="#1e1e2e"
          emissive={glowColor}
          emissiveIntensity={theme.glowIntensity}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Glow sphere */}
      <mesh ref={glowRef} scale={[1.5, 0.5, 1.5]}>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={0.3}
          depthWrite={false}
        />
      </mesh>
      
      {/* Orbital ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius * 1.3, 0.02, 16, 100]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={0.5}
        />
      </mesh>
      
      {/* Second ring (tilted) */}
      <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]}>
        <torusGeometry args={[radius * 1.2, 0.015, 16, 100]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={0.3}
        />
      </mesh>
      
      {/* Ambient particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.length / 3}
            array={particles}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color={glowColor}
          size={0.03}
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>
      
      {/* Phase indicator */}
      <Html
        center
        position={[0, 0.3, 0]}
        style={{ pointerEvents: 'none' }}
      >
        <div style={{
          color: 'white',
          fontSize: 14,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: 2,
          textShadow: '0 0 10px rgba(0,0,0,0.9)',
          opacity: 0.9,
        }}>
          {context.phase}
        </div>
      </Html>
      
      {/* Decision options (when in decision phase) */}
      {context.phase === 'decision' && context.pendingDecision && (
        <DecisionOptions
          decision={context.pendingDecision}
          selectedOption={selectedOption}
          onSelect={handleOptionClick}
          radius={radius}
        />
      )}
    </group>
  );
}

// ─────────────────────────────────────────────────────
// DECISION OPTIONS SUB-COMPONENT
// ─────────────────────────────────────────────────────

interface DecisionOptionsProps {
  decision: PendingDecision;
  selectedOption: string | null;
  onSelect: (optionId: string) => void;
  radius: number;
}

function DecisionOptions({
  decision,
  selectedOption,
  onSelect,
  radius,
}: DecisionOptionsProps) {
  const optionCount = decision.options.length;
  
  return (
    <group position={[0, 0.5, 0]}>
      {/* Decision title */}
      <Html
        center
        position={[0, 0.8, 0]}
        style={{ pointerEvents: 'none' }}
      >
        <div style={{
          color: '#fbbf24',
          fontSize: 16,
          fontWeight: 700,
          textAlign: 'center',
          maxWidth: 300,
          textShadow: '0 0 15px rgba(0,0,0,0.9)',
        }}>
          {decision.title}
        </div>
      </Html>
      
      {/* Options arranged in arc */}
      {decision.options.map((option, index) => {
        const angle = ((index - (optionCount - 1) / 2) / optionCount) * Math.PI * 0.6;
        const x = Math.sin(angle) * (radius + 0.8);
        const z = Math.cos(angle) * (radius + 0.8) - radius;
        const isSelected = selectedOption === option.id;
        
        return (
          <group key={option.id} position={[x, 0, z]}>
            <mesh
              onClick={() => onSelect(option.id)}
              scale={isSelected ? 1.2 : 1}
            >
              <boxGeometry args={[0.4, 0.15, 0.1]} />
              <meshStandardMaterial
                color={isSelected ? '#fbbf24' : '#374151'}
                emissive={isSelected ? '#fbbf24' : '#6366f1'}
                emissiveIntensity={isSelected ? 0.5 : 0.2}
              />
            </mesh>
            
            <Html
              center
              position={[0, 0, 0.06]}
              style={{ pointerEvents: 'none' }}
            >
              <div style={{
                color: isSelected ? '#000' : '#fff',
                fontSize: 11,
                fontWeight: 600,
                whiteSpace: 'nowrap',
                padding: '4px 8px',
                background: isSelected ? '#fbbf24' : 'rgba(0,0,0,0.6)',
                borderRadius: 4,
              }}>
                {option.label}
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default XRDecisionCore;
