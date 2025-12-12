/* =====================================================
   CHE·NU — XR Participant
   
   Visual representation of the human participant.
   In VR: represents where the user "is"
   On screen: shows avatar with status
   
   Features:
   - Position indicator
   - Speaking status
   - Action availability
   - Voice input indicator
   ===================================================== */

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Billboard } from '@react-three/drei';
import { useXR } from '@react-three/xr';
import * as THREE from 'three';

import {
  XRMeetingContext,
  XRMeetingLayout,
  DEFAULT_MEETING_LAYOUT,
} from './xrMeeting.types';

// ─────────────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────────────

export interface XRParticipantProps {
  context: XRMeetingContext;
  layout?: Partial<XRMeetingLayout>;
  
  // State
  isSpeaking?: boolean;
  isListening?: boolean;
  
  // Callbacks
  onStartSpeaking?: () => void;
  onStopSpeaking?: () => void;
}

// ─────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────

export function XRParticipant({
  context,
  layout: layoutProp,
  isSpeaking = false,
  isListening = false,
  onStartSpeaking,
  onStopSpeaking,
}: XRParticipantProps) {
  const layout = { ...DEFAULT_MEETING_LAYOUT, ...layoutProp };
  const { isPresenting, player } = useXR();
  
  const indicatorRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  const [micActive, setMicActive] = useState(false);
  
  // Animation
  useFrame(({ clock }) => {
    const time = clock.elapsedTime;
    
    // Position indicator pulse
    if (indicatorRef.current) {
      const scale = 1 + Math.sin(time * 2) * 0.05;
      indicatorRef.current.scale.set(scale, 1, scale);
    }
    
    // Speaking pulse
    if (pulseRef.current && isSpeaking) {
      const pulseScale = 1 + Math.sin(time * 6) * 0.2;
      pulseRef.current.scale.set(pulseScale, pulseScale, pulseScale);
      const material = pulseRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.3 + Math.sin(time * 6) * 0.2;
    }
  });
  
  const position = layout.humanPosition.position;
  
  // In VR, we don't render a visible avatar for the player
  // Instead, we show indicators around them
  
  return (
    <group position={isPresenting ? [0, 0, 0] : position}>
      {/* Floor position indicator */}
      <mesh
        ref={indicatorRef}
        position={[0, 0.01, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[0.4, 0.5, 32]} />
        <meshBasicMaterial
          color={context.permissions.canDecide ? '#10b981' : '#6366f1'}
          transparent
          opacity={0.6}
        />
      </mesh>
      
      {/* Inner circle */}
      <mesh
        position={[0, 0.01, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[0.35, 32]} />
        <meshBasicMaterial
          color="#1e1e2e"
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Speaking indicator */}
      {isSpeaking && (
        <group position={[0, 1.8, 0]}>
          <mesh ref={pulseRef}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshBasicMaterial
              color="#10b981"
              transparent
              opacity={0.5}
            />
          </mesh>
          
          {/* Sound waves */}
          <SoundWaves />
        </group>
      )}
      
      {/* Listening indicator */}
      {isListening && !isSpeaking && (
        <group position={[0, 1.8, 0]}>
          <mesh>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshBasicMaterial color="#f59e0b" />
          </mesh>
          <Html center position={[0, 0.15, 0]} style={{ pointerEvents: 'none' }}>
            <div style={{
              color: '#f59e0b',
              fontSize: 10,
              fontWeight: 600,
            }}>
              🎤 Écoute...
            </div>
          </Html>
        </group>
      )}
      
      {/* Name and status (non-VR or for other participants) */}
      {!isPresenting && (
        <Billboard position={[0, 2.2, 0]}>
          <Html center style={{ pointerEvents: 'none' }}>
            <div style={{
              textAlign: 'center',
            }}>
              <div style={{
                color: 'white',
                fontSize: 14,
                fontWeight: 700,
                textShadow: '0 0 10px rgba(0,0,0,0.9)',
              }}>
                {context.humanName || 'Vous'}
              </div>
              <div style={{
                color: context.permissions.canDecide ? '#10b981' : '#6b7280',
                fontSize: 10,
                marginTop: 4,
              }}>
                {context.permissions.canDecide ? '● Décideur' : '○ Observateur'}
              </div>
            </div>
          </Html>
        </Billboard>
      )}
      
      {/* Action prompts (in decision phase) */}
      {context.phase === 'decision' && context.permissions.canDecide && (
        <DecisionPrompt position={[0, 1.2, 0.5]} />
      )}
      
      {/* Voice control button (VR) */}
      {isPresenting && (
        <VoiceControlIndicator
          position={[0.5, 1, 0]}
          isActive={micActive}
          onToggle={() => {
            setMicActive(!micActive);
            if (micActive) {
              onStopSpeaking?.();
            } else {
              onStartSpeaking?.();
            }
          }}
        />
      )}
    </group>
  );
}

// ─────────────────────────────────────────────────────
// SOUND WAVES (speaking)
// ─────────────────────────────────────────────────────

function SoundWaves() {
  const wave1Ref = useRef<THREE.Mesh>(null);
  const wave2Ref = useRef<THREE.Mesh>(null);
  const wave3Ref = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    const time = clock.elapsedTime;
    
    [wave1Ref, wave2Ref, wave3Ref].forEach((ref, i) => {
      if (ref.current) {
        const scale = 0.15 + (i * 0.1) + Math.sin(time * 4 - i * 0.3) * 0.05;
        ref.current.scale.set(scale, scale, scale);
        const material = ref.current.material as THREE.MeshBasicMaterial;
        material.opacity = 0.4 - i * 0.1;
      }
    });
  });
  
  return (
    <>
      {[wave1Ref, wave2Ref, wave3Ref].map((ref, i) => (
        <mesh key={i} ref={ref}>
          <torusGeometry args={[1, 0.05, 8, 32]} />
          <meshBasicMaterial
            color="#10b981"
            transparent
            opacity={0.4 - i * 0.1}
          />
        </mesh>
      ))}
    </>
  );
}

// ─────────────────────────────────────────────────────
// DECISION PROMPT
// ─────────────────────────────────────────────────────

function DecisionPrompt({ 
  position 
}: { 
  position: [number, number, number];
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      const time = clock.elapsedTime;
      meshRef.current.position.y = position[1] + Math.sin(time * 2) * 0.05;
      meshRef.current.rotation.y += 0.01;
    }
  });
  
  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <octahedronGeometry args={[0.1]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#fbbf24"
          emissiveIntensity={0.5}
        />
      </mesh>
      
      <Html center position={[0, 0.2, 0]} style={{ pointerEvents: 'none' }}>
        <div style={{
          color: '#fbbf24',
          fontSize: 11,
          fontWeight: 600,
          textShadow: '0 0 10px rgba(0,0,0,0.9)',
          animation: 'pulse 2s infinite',
        }}>
          Prêt à décider
        </div>
      </Html>
    </group>
  );
}

// ─────────────────────────────────────────────────────
// VOICE CONTROL (VR)
// ─────────────────────────────────────────────────────

function VoiceControlIndicator({
  position,
  isActive,
  onToggle,
}: {
  position: [number, number, number];
  isActive: boolean;
  onToggle: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame(({ clock }) => {
    if (meshRef.current && isActive) {
      const time = clock.elapsedTime;
      meshRef.current.scale.setScalar(1 + Math.sin(time * 4) * 0.1);
    }
  });
  
  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={onToggle}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.1 : 1}
      >
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial
          color={isActive ? '#10b981' : '#6b7280'}
          emissive={isActive ? '#10b981' : '#000'}
          emissiveIntensity={isActive ? 0.5 : 0}
        />
      </mesh>
      
      <Html center position={[0, 0.12, 0]} style={{ pointerEvents: 'none' }}>
        <div style={{
          color: isActive ? '#10b981' : '#9ca3af',
          fontSize: 9,
          fontWeight: 500,
        }}>
          {isActive ? '🎤 ON' : '🎤 OFF'}
        </div>
      </Html>
    </group>
  );
}

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default XRParticipant;
