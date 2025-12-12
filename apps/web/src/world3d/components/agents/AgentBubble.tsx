/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ 3D - AGENT BUBBLE COMPONENT
 * Bulles 3D flottantes pour représenter les agents IA
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

type AgentExpression = 'idle' | 'thinking' | 'speaking' | 'listening' | 'happy' | 'error';

interface AgentBubbleProps {
  id: string;
  name: string;
  position: [number, number, number];
  color?: string;
  expression?: AgentExpression;
  isActive?: boolean;
  size?: number;
  onClick?: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPRESSION CONFIGS
// ─────────────────────────────────────────────────────────────────────────────

const EXPRESSIONS: Record<AgentExpression, { emoji: string; glowIntensity: number; pulseSpeed: number }> = {
  idle: { emoji: '🤖', glowIntensity: 0.3, pulseSpeed: 2 },
  thinking: { emoji: '🤔', glowIntensity: 0.5, pulseSpeed: 1 },
  speaking: { emoji: '💬', glowIntensity: 0.6, pulseSpeed: 0.5 },
  listening: { emoji: '👂', glowIntensity: 0.4, pulseSpeed: 1.5 },
  happy: { emoji: '😊', glowIntensity: 0.7, pulseSpeed: 1.2 },
  error: { emoji: '😰', glowIntensity: 0.8, pulseSpeed: 0.3 }
};

// ─────────────────────────────────────────────────────────────────────────────
// AGENT BUBBLE
// ─────────────────────────────────────────────────────────────────────────────

export function AgentBubble({
  id,
  name,
  position,
  color = '#D8B26A',
  expression = 'idle',
  isActive = false,
  size = 0.8,
  onClick
}: AgentBubbleProps) {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  const expressionConfig = EXPRESSIONS[expression];
  
  // Animation
  useFrame((state) => {
    if (groupRef.current) {
      // Floating animation
      const t = state.clock.elapsedTime;
      groupRef.current.position.y = position[1] + Math.sin(t * expressionConfig.pulseSpeed) * 0.2;
      groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.1;
      
      // Scale on hover
      const targetScale = hovered ? 1.2 : 1;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
    
    if (glowRef.current) {
      // Glow pulse
      const material = glowRef.current.material as THREE.MeshBasicMaterial;
      const pulse = (Math.sin(state.clock.elapsedTime * 3) + 1) / 2;
      material.opacity = expressionConfig.glowIntensity * (0.5 + pulse * 0.5);
    }
  });
  
  return (
    <group
      ref={groupRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      onPointerOver={() => {
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'default';
      }}
    >
      {/* Main sphere */}
      <mesh castShadow>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={color}
          roughness={0.2}
          metalness={0.8}
          emissive={color}
          emissiveIntensity={isActive ? 0.3 : 0.1}
        />
      </mesh>
      
      {/* Glow ring */}
      <mesh ref={glowRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[size * 1.2, size * 1.5, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Orbital ring */}
      {isActive && (
        <mesh rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[size * 1.3, 0.03, 8, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.6} />
        </mesh>
      )}
      
      {/* Label */}
      <Html
        position={[0, size + 0.5, 0]}
        center
        style={{
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.3s',
          pointerEvents: 'none'
        }}
      >
        <div style={{
          background: 'rgba(26, 26, 26, 0.95)',
          padding: '8px 16px',
          borderRadius: 8,
          border: `1px solid ${color}40`,
          whiteSpace: 'nowrap'
        }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#E9E4D6' }}>
            {expressionConfig.emoji} {name}
          </div>
          {isActive && (
            <div style={{ fontSize: 11, color: color, marginTop: 2 }}>
              Actif
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NOVA AGENT (Special)
// ─────────────────────────────────────────────────────────────────────────────

interface NovaAgentProps {
  position: [number, number, number];
  expression?: AgentExpression;
  isActive?: boolean;
  onClick?: () => void;
}

export function NovaAgent({ position, expression = 'idle', isActive = true, onClick }: NovaAgentProps) {
  return (
    <AgentBubble
      id="nova"
      name="Nova"
      position={position}
      color="#D8B26A"
      expression={expression}
      isActive={isActive}
      size={1}
      onClick={onClick}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AGENTS CONSTELLATION
// ─────────────────────────────────────────────────────────────────────────────

interface AgentData {
  id: string;
  name: string;
  color: string;
  expression: AgentExpression;
  isActive: boolean;
}

interface AgentsConstellationProps {
  centerPosition: [number, number, number];
  agents: AgentData[];
  radius?: number;
  onAgentClick?: (agentId: string) => void;
}

export function AgentsConstellation({
  centerPosition,
  agents,
  radius = 3,
  onAgentClick
}: AgentsConstellationProps) {
  return (
    <group position={centerPosition}>
      {/* Central Nova */}
      <NovaAgent
        position={[0, 0, 0]}
        expression="idle"
        isActive={true}
        onClick={() => onAgentClick?.('nova')}
      />
      
      {/* Surrounding agents */}
      {agents.map((agent, index) => {
        const angle = (index / agents.length) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = Math.sin(index) * 0.5; // Slight vertical variation
        
        return (
          <AgentBubble
            key={agent.id}
            id={agent.id}
            name={agent.name}
            position={[x, y, z]}
            color={agent.color}
            expression={agent.expression}
            isActive={agent.isActive}
            size={0.5}
            onClick={() => onAgentClick?.(agent.id)}
          />
        );
      })}
    </group>
  );
}

export default AgentBubble;
