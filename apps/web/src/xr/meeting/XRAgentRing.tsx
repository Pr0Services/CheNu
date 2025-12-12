/* =====================================================
   CHE·NU — XR Agent Ring
   
   Circular arrangement of AI agents around the
   decision core. Each agent:
   - Has unique color based on role
   - Glows when speaking
   - Can be selected for direct questions
   - Shows activity indicator
   ===================================================== */

import React, { useRef, useState, useMemo } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { Html, Billboard } from '@react-three/drei';
import * as THREE from 'three';

import {
  XRMeetingContext,
  XRMeetingAgent,
  XRMeetingLayout,
  XRMeetingTheme,
  DEFAULT_MEETING_LAYOUT,
  DEFAULT_MEETING_THEME,
} from './xrMeeting.types';
import { AgentRole } from '../../agents/types';

// ─────────────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────────────

export interface XRAgentRingProps {
  context: XRMeetingContext;
  agents: XRMeetingAgent[];
  layout?: Partial<XRMeetingLayout>;
  theme?: Partial<XRMeetingTheme>;
  
  // Callbacks
  onAgentSelect?: (agentId: string) => void;
  onAgentAsk?: (agentId: string) => void;
  onAgentDismiss?: (agentId: string) => void;
}

// ─────────────────────────────────────────────────────
// ROLE COLORS
// ─────────────────────────────────────────────────────

const ROLE_COLORS: Record<AgentRole, string> = {
  orchestrator: '#8b5cf6',
  analyzer: '#3b82f6',
  evaluator: '#10b981',
  memory: '#f59e0b',
  methodology: '#ec4899',
  specialist: '#06b6d4',
  advisor: '#84cc16',
};

function getRoleColor(role: AgentRole): string {
  return ROLE_COLORS[role] || '#6ec6ff';
}

// ─────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────

export function XRAgentRing({
  context,
  agents,
  layout: layoutProp,
  theme: themeProp,
  onAgentSelect,
  onAgentAsk,
  onAgentDismiss,
}: XRAgentRingProps) {
  const layout = { ...DEFAULT_MEETING_LAYOUT, ...layoutProp };
  const theme = { ...DEFAULT_MEETING_THEME, ...themeProp };
  
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [hoveredAgentId, setHoveredAgentId] = useState<string | null>(null);
  
  // Calculate positions for agents in ring
  const agentPositions = useMemo(() => {
    const count = agents.length;
    if (count === 0) return [];
    
    return agents.map((agent, index) => {
      const angle = (index / count) * Math.PI * 2 - Math.PI / 2; // Start from front
      return {
        agent,
        position: [
          Math.cos(angle) * layout.agentRingRadius,
          layout.agentRingHeight,
          Math.sin(angle) * layout.agentRingRadius,
        ] as [number, number, number],
        angle,
      };
    });
  }, [agents, layout.agentRingRadius, layout.agentRingHeight]);
  
  const handleAgentClick = (agentId: string) => {
    setSelectedAgentId(agentId);
    onAgentSelect?.(agentId);
  };
  
  return (
    <group>
      {/* Ring base (visual guide) */}
      <mesh 
        position={[0, layout.agentRingHeight, 0]} 
        rotation={[Math.PI / 2, 0, 0]}
      >
        <torusGeometry args={[layout.agentRingRadius, 0.02, 8, 64]} />
        <meshBasicMaterial
          color={theme.agentDefaultColor}
          transparent
          opacity={0.2}
        />
      </mesh>
      
      {/* Agents */}
      {agentPositions.map(({ agent, position, angle }) => (
        <AgentNode
          key={agent.id}
          agent={agent}
          position={position}
          angle={angle}
          size={layout.agentSize}
          theme={theme}
          isSelected={selectedAgentId === agent.id}
          isHovered={hoveredAgentId === agent.id}
          canAsk={context.permissions.canAskAgents}
          canDismiss={context.permissions.canDismissAgents}
          onClick={() => handleAgentClick(agent.id)}
          onHover={(hovered) => setHoveredAgentId(hovered ? agent.id : null)}
          onAsk={() => onAgentAsk?.(agent.id)}
          onDismiss={() => onAgentDismiss?.(agent.id)}
        />
      ))}
      
      {/* Connection lines to center */}
      {agentPositions.map(({ agent, position }) => (
        <ConnectionLine
          key={`line-${agent.id}`}
          from={position}
          to={[0, layout.agentRingHeight - 0.2, 0]}
          color={agent.isSpeaking ? theme.agentSpeakingColor : theme.agentDefaultColor}
          opacity={agent.isSpeaking ? 0.5 : 0.1}
          active={agent.isSpeaking}
        />
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────────────
// AGENT NODE
// ─────────────────────────────────────────────────────

interface AgentNodeProps {
  agent: XRMeetingAgent;
  position: [number, number, number];
  angle: number;
  size: number;
  theme: XRMeetingTheme;
  isSelected: boolean;
  isHovered: boolean;
  canAsk: boolean;
  canDismiss: boolean;
  onClick: () => void;
  onHover: (hovered: boolean) => void;
  onAsk: () => void;
  onDismiss: () => void;
}

function AgentNode({
  agent,
  position,
  angle,
  size,
  theme,
  isSelected,
  isHovered,
  canAsk,
  canDismiss,
  onClick,
  onHover,
  onAsk,
  onDismiss,
}: AgentNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const orbitRef = useRef<THREE.Group>(null);
  
  const color = agent.color || getRoleColor(agent.role);
  
  // Animation
  useFrame(({ clock }) => {
    const time = clock.elapsedTime;
    
    if (meshRef.current) {
      // Gentle floating
      meshRef.current.position.y = position[1] + Math.sin(time * 1.5 + angle) * 0.05;
      
      // Scale on hover/select
      const targetScale = isSelected ? 1.3 : isHovered ? 1.15 : 1;
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );
    }
    
    // Glow pulsing when speaking
    if (glowRef.current && agent.isSpeaking) {
      const material = glowRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.4 + Math.sin(time * 4) * 0.2;
    }
    
    // Orbit rotation when active
    if (orbitRef.current && agent.isActive) {
      orbitRef.current.rotation.y += 0.02;
      orbitRef.current.rotation.x = Math.sin(time) * 0.1;
    }
  });
  
  return (
    <group position={position}>
      {/* Glow sphere (larger, behind) */}
      <mesh ref={glowRef} scale={agent.isSpeaking ? 2 : 1.5}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={agent.isSpeaking ? 0.4 : 0.15}
          depthWrite={false}
        />
      </mesh>
      
      {/* Orbiting ring when active */}
      {agent.isActive && (
        <group ref={orbitRef}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[size * 1.5, 0.01, 8, 32]} />
            <meshBasicMaterial color={color} transparent opacity={0.5} />
          </mesh>
        </group>
      )}
      
      {/* Main agent sphere */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(true);
        }}
        onPointerOut={() => onHover(false)}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={agent.isSpeaking ? 0.8 : agent.isActive ? 0.4 : 0.2}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>
      
      {/* Speaking indicator */}
      {agent.isSpeaking && (
        <SpeakingWaves position={[0, 0, 0]} color={color} size={size} />
      )}
      
      {/* Name label */}
      <Billboard position={[0, size + 0.15, 0]}>
        <Html center style={{ pointerEvents: 'none' }}>
          <div style={{
            color: 'white',
            fontSize: 11,
            fontWeight: 600,
            textShadow: '0 0 8px rgba(0,0,0,0.9)',
            whiteSpace: 'nowrap',
            opacity: isHovered || isSelected ? 1 : 0.7,
          }}>
            {agent.name}
          </div>
          <div style={{
            color: color,
            fontSize: 9,
            textTransform: 'uppercase',
            letterSpacing: 1,
            opacity: 0.8,
          }}>
            {agent.role}
          </div>
        </Html>
      </Billboard>
      
      {/* Action buttons (when selected) */}
      {isSelected && (
        <Html center position={[0, -size - 0.3, 0]}>
          <div style={{ display: 'flex', gap: 8 }}>
            {canAsk && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAsk();
                }}
                style={{
                  padding: '4px 12px',
                  fontSize: 10,
                  background: '#6366f1',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                }}
              >
                Demander
              </button>
            )}
            {canDismiss && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDismiss();
                }}
                style={{
                  padding: '4px 12px',
                  fontSize: 10,
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                }}
              >
                Renvoyer
              </button>
            )}
          </div>
        </Html>
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
  size 
}: { 
  position: [number, number, number]; 
  color: string;
  size: number;
}) {
  const wave1Ref = useRef<THREE.Mesh>(null);
  const wave2Ref = useRef<THREE.Mesh>(null);
  const wave3Ref = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    const time = clock.elapsedTime;
    
    [wave1Ref, wave2Ref, wave3Ref].forEach((ref, i) => {
      if (ref.current) {
        const scale = 1.5 + Math.sin(time * 3 + i * 0.5) * 0.3;
        ref.current.scale.set(scale, scale, scale);
        const material = ref.current.material as THREE.MeshBasicMaterial;
        material.opacity = 0.3 - i * 0.1;
      }
    });
  });
  
  return (
    <group position={position}>
      {[wave1Ref, wave2Ref, wave3Ref].map((ref, i) => (
        <mesh key={i} ref={ref} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[size * (1.2 + i * 0.3), size * (1.3 + i * 0.3), 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.3 - i * 0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────────────
// CONNECTION LINE
// ─────────────────────────────────────────────────────

function ConnectionLine({
  from,
  to,
  color,
  opacity,
  active,
}: {
  from: [number, number, number];
  to: [number, number, number];
  color: string;
  opacity: number;
  active: boolean;
}) {
  const lineRef = useRef<THREE.Line>(null);
  
  const geometry = useMemo(() => {
    const points = [new THREE.Vector3(...from), new THREE.Vector3(...to)];
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [from, to]);
  
  // Animate line when active
  useFrame(({ clock }) => {
    if (lineRef.current && active) {
      const material = lineRef.current.material as THREE.LineBasicMaterial;
      material.opacity = opacity + Math.sin(clock.elapsedTime * 5) * 0.2;
    }
  });
  
  return (
    <line ref={lineRef} geometry={geometry}>
      <lineBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        linewidth={active ? 2 : 1}
      />
    </line>
  );
}

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default XRAgentRing;
