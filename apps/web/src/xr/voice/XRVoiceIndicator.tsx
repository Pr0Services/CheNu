/* =====================================================
   CHE·NU — XR Voice Indicator
   
   Visual indicator for voice recognition status in VR.
   Shows: listening, speaking, processing, wake word.
   ===================================================== */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Billboard } from '@react-three/drei';
import * as THREE from 'three';

import { VoiceRecognitionState } from './voice.types';

// ─────────────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────────────

export interface XRVoiceIndicatorProps {
  state: VoiceRecognitionState;
  position?: [number, number, number];
  size?: number;
  showTranscript?: boolean;
  transcript?: string;
  interimTranscript?: string;
  
  // Colors
  idleColor?: string;
  listeningColor?: string;
  speakingColor?: string;
  processingColor?: string;
  wakeWordColor?: string;
  errorColor?: string;
}

// ─────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────

export function XRVoiceIndicator({
  state,
  position = [0, 2.2, -0.5],
  size = 0.08,
  showTranscript = true,
  transcript = '',
  interimTranscript = '',
  idleColor = '#6b7280',
  listeningColor = '#3b82f6',
  speakingColor = '#10b981',
  processingColor = '#f59e0b',
  wakeWordColor = '#8b5cf6',
  errorColor = '#ef4444',
}: XRVoiceIndicatorProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const waveRef1 = useRef<THREE.Mesh>(null);
  const waveRef2 = useRef<THREE.Mesh>(null);
  const waveRef3 = useRef<THREE.Mesh>(null);
  
  // Determine color based on state
  const currentColor = useMemo(() => {
    if (state.error) return errorColor;
    if (state.awaitingCommand) return wakeWordColor;
    if (state.isSpeaking) return speakingColor;
    if (state.status === 'processing') return processingColor;
    if (state.isListening) return listeningColor;
    return idleColor;
  }, [state, idleColor, listeningColor, speakingColor, processingColor, wakeWordColor, errorColor]);
  
  // Animation
  useFrame(({ clock }) => {
    const time = clock.elapsedTime;
    
    // Main indicator pulse
    if (meshRef.current) {
      const baseScale = state.isListening ? 1.1 : 1.0;
      const pulse = state.isSpeaking 
        ? Math.sin(time * 6) * 0.15 
        : Math.sin(time * 2) * 0.05;
      meshRef.current.scale.setScalar(size * (baseScale + pulse));
      
      // Rotation when processing
      if (state.status === 'processing') {
        meshRef.current.rotation.y += 0.05;
      }
    }
    
    // Glow intensity
    if (glowRef.current) {
      const material = glowRef.current.material as THREE.MeshBasicMaterial;
      const baseOpacity = state.isListening ? 0.4 : 0.2;
      const pulse = state.isSpeaking 
        ? Math.sin(time * 6) * 0.2 
        : 0;
      material.opacity = baseOpacity + pulse;
    }
    
    // Sound waves when speaking
    if (state.isSpeaking) {
      [waveRef1, waveRef2, waveRef3].forEach((ref, i) => {
        if (ref.current) {
          const scale = 1 + (i * 0.3) + Math.sin(time * 4 - i * 0.5) * 0.2;
          ref.current.scale.setScalar(scale);
          const material = ref.current.material as THREE.MeshBasicMaterial;
          material.opacity = 0.4 - i * 0.1;
        }
      });
    }
  });
  
  // Status text
  const statusText = useMemo(() => {
    if (state.error) return '❌ Erreur';
    if (state.awaitingCommand) return '🎤 À l\'écoute...';
    if (state.isSpeaking) return '🗣️ Parole détectée';
    if (state.status === 'processing') return '⏳ Traitement...';
    if (state.isListening) return '🎤 Écoute active';
    if (state.status === 'not-supported') return '⚠️ Non supporté';
    return '🔇 Inactif';
  }, [state]);
  
  return (
    <group position={position}>
      {/* Glow */}
      <mesh ref={glowRef} scale={2.5}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshBasicMaterial
          color={currentColor}
          transparent
          opacity={0.3}
          depthWrite={false}
        />
      </mesh>
      
      {/* Main indicator */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={currentColor}
          emissive={currentColor}
          emissiveIntensity={state.isListening ? 0.5 : 0.2}
          metalness={0.3}
          roughness={0.5}
        />
      </mesh>
      
      {/* Sound waves (when speaking) */}
      {state.isSpeaking && (
        <>
          {[waveRef1, waveRef2, waveRef3].map((ref, i) => (
            <mesh key={i} ref={ref}>
              <torusGeometry args={[size * (1.5 + i * 0.5), 0.005, 8, 32]} />
              <meshBasicMaterial
                color={currentColor}
                transparent
                opacity={0.4 - i * 0.1}
              />
            </mesh>
          ))}
        </>
      )}
      
      {/* Microphone icon */}
      <Billboard position={[0, size * 2, 0]}>
        <Html center style={{ pointerEvents: 'none' }}>
          <div style={{
            fontSize: 16,
            filter: state.isListening ? 'none' : 'grayscale(1)',
          }}>
            {state.isListening ? '🎤' : '🔇'}
          </div>
        </Html>
      </Billboard>
      
      {/* Status text */}
      <Html center position={[0, -size * 3, 0]} style={{ pointerEvents: 'none' }}>
        <div style={{
          color: currentColor,
          fontSize: 10,
          fontWeight: 600,
          textShadow: '0 0 8px rgba(0,0,0,0.9)',
          whiteSpace: 'nowrap',
        }}>
          {statusText}
        </div>
      </Html>
      
      {/* Transcript */}
      {showTranscript && (transcript || interimTranscript) && (
        <Html
          center
          position={[0, -size * 5, 0]}
          style={{ pointerEvents: 'none' }}
        >
          <div style={{
            maxWidth: 300,
            padding: '8px 12px',
            background: 'rgba(0,0,0,0.8)',
            borderRadius: 8,
            borderLeft: `3px solid ${currentColor}`,
          }}>
            {/* Final transcript */}
            {transcript && (
              <div style={{
                color: '#fff',
                fontSize: 12,
                marginBottom: interimTranscript ? 4 : 0,
              }}>
                {transcript}
              </div>
            )}
            
            {/* Interim transcript */}
            {interimTranscript && (
              <div style={{
                color: '#9ca3af',
                fontSize: 11,
                fontStyle: 'italic',
              }}>
                {interimTranscript}...
              </div>
            )}
          </div>
        </Html>
      )}
      
      {/* Audio level bar */}
      {state.isListening && (
        <group position={[0, -size * 1.5, 0]}>
          <mesh>
            <planeGeometry args={[0.1, 0.02]} />
            <meshBasicMaterial color="#374151" />
          </mesh>
          <mesh position={[(state.audioLevel - 0.5) * 0.05, 0, 0.001]}>
            <planeGeometry args={[0.1 * state.audioLevel, 0.02]} />
            <meshBasicMaterial color={currentColor} />
          </mesh>
        </group>
      )}
    </group>
  );
}

// ─────────────────────────────────────────────────────
// COMPACT VERSION
// ─────────────────────────────────────────────────────

export interface XRVoiceIndicatorCompactProps {
  isListening: boolean;
  isSpeaking: boolean;
  position?: [number, number, number];
  size?: number;
}

export function XRVoiceIndicatorCompact({
  isListening,
  isSpeaking,
  position = [0.4, -0.3, -0.5],
  size = 0.03,
}: XRVoiceIndicatorCompactProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const color = isSpeaking ? '#10b981' : isListening ? '#3b82f6' : '#6b7280';
  
  useFrame(({ clock }) => {
    if (meshRef.current && isSpeaking) {
      const pulse = Math.sin(clock.elapsedTime * 8) * 0.3;
      meshRef.current.scale.setScalar(size * (1 + pulse));
    }
  });
  
  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={isListening ? 1 : 0.5}
      />
    </mesh>
  );
}

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default XRVoiceIndicator;
