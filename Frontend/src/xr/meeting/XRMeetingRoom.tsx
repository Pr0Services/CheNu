/* =====================================================
   CHE·NU — XR Meeting Room
   
   Complete immersive meeting room combining:
   - Decision Core (center)
   - Agent Ring (surrounding)
   - Timeline Wall (behind)
   - Human Participant (position)
   - Room Environment
   
   Layout:
   
         [ TIMELINE WALL ]
               │
        ┌──────┴──────┐
        │   AGENTS    │
        │  ●  ●  ●    │
        │ ●       ●   │
        │  ● [■] ●    │  ← Decision Core
        │   ●   ●     │
        │    ● ●      │
        └──────┬──────┘
               │
           [ HUMAN ]
   ===================================================== */

import React, { useState, useCallback, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows, Float } from '@react-three/drei';
import * as THREE from 'three';

import { XRProvider } from '../XRProvider';
import { XRInteractions, XRTeleport } from '../XRInteractions';

import { XRDecisionCore } from './XRDecisionCore';
import { XRAgentRing } from './XRAgentRing';
import { XRTimelineWall } from './XRTimelineWall';
import { XRParticipant } from './XRParticipant';

import {
  XRMeetingContext,
  XRMeetingAgent,
  XRTimelineEvent,
  XRMeetingLayout,
  XRMeetingTheme,
  XRMeetingAction,
  MeetingPhase,
  DEFAULT_MEETING_LAYOUT,
  DEFAULT_MEETING_THEME,
  DEFAULT_PERMISSIONS,
} from './xrMeeting.types';

// ─────────────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────────────

export interface XRMeetingRoomProps {
  context: XRMeetingContext;
  agents: XRMeetingAgent[];
  events: XRTimelineEvent[];
  
  // Configuration
  layout?: Partial<XRMeetingLayout>;
  theme?: Partial<XRMeetingTheme>;
  xrEnabled?: boolean;
  
  // Callbacks
  onAction?: (action: XRMeetingAction) => void;
  onPhaseChange?: (phase: MeetingPhase) => void;
  onAgentAsk?: (agentId: string, question: string) => void;
  onDecision?: (optionId: string, reasoning?: string) => void;
  onRewind?: (eventId: string) => void;
}

// ─────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────

export function XRMeetingRoom({
  context,
  agents,
  events,
  layout: layoutProp,
  theme: themeProp,
  xrEnabled = true,
  onAction,
  onPhaseChange,
  onAgentAsk,
  onDecision,
  onRewind,
}: XRMeetingRoomProps) {
  const layout = { ...DEFAULT_MEETING_LAYOUT, ...layoutProp };
  const theme = { ...DEFAULT_MEETING_THEME, ...themeProp };
  
  return (
    <Canvas
      camera={{
        position: [0, layout.humanPosition.position[1] + 1.6, layout.humanPosition.position[2]],
        fov: 70,
      }}
      shadows
      style={{ width: '100%', height: '100%', background: '#0a0a0f' }}
    >
      <XRProvider
        enabled={xrEnabled}
        referenceSpace="local-floor"
        optionalFeatures={['hand-tracking']}
        showControllers
        showHands
      >
        <MeetingRoomContent
          context={context}
          agents={agents}
          events={events}
          layout={layout}
          theme={theme}
          onAction={onAction}
          onPhaseChange={onPhaseChange}
          onAgentAsk={onAgentAsk}
          onDecision={onDecision}
          onRewind={onRewind}
        />
      </XRProvider>
    </Canvas>
  );
}

// ─────────────────────────────────────────────────────
// ROOM CONTENT (inside Canvas)
// ─────────────────────────────────────────────────────

interface MeetingRoomContentProps {
  context: XRMeetingContext;
  agents: XRMeetingAgent[];
  events: XRTimelineEvent[];
  layout: XRMeetingLayout;
  theme: XRMeetingTheme;
  onAction?: (action: XRMeetingAction) => void;
  onPhaseChange?: (phase: MeetingPhase) => void;
  onAgentAsk?: (agentId: string, question: string) => void;
  onDecision?: (optionId: string, reasoning?: string) => void;
  onRewind?: (eventId: string) => void;
}

function MeetingRoomContent({
  context,
  agents,
  events,
  layout,
  theme,
  onAction,
  onPhaseChange,
  onAgentAsk,
  onDecision,
  onRewind,
}: MeetingRoomContentProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentEventId, setCurrentEventId] = useState<string | undefined>(
    events.length > 0 ? events[events.length - 1].id : undefined
  );
  
  // Handlers
  const handleDecisionSelect = useCallback((optionId: string) => {
    onDecision?.(optionId);
    onAction?.({ type: 'MAKE_DECISION', optionId });
  }, [onDecision, onAction]);
  
  const handleAgentAsk = useCallback((agentId: string) => {
    // In real implementation, would open voice/text input
    const question = 'Que recommandez-vous?';
    onAgentAsk?.(agentId, question);
    onAction?.({ type: 'ASK_AGENT', agentId, question });
  }, [onAgentAsk, onAction]);
  
  const handleAgentDismiss = useCallback((agentId: string) => {
    onAction?.({ type: 'DISMISS_AGENT', agentId });
  }, [onAction]);
  
  const handleRewind = useCallback((eventId: string) => {
    setCurrentEventId(eventId);
    onRewind?.(eventId);
    onAction?.({ type: 'REWIND_TO', eventId });
  }, [onRewind, onAction]);
  
  const handleEventSelect = useCallback((eventId: string) => {
    setCurrentEventId(eventId);
  }, []);
  
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 4, 0]} intensity={0.5} color="#6366f1" />
      <pointLight position={[3, 2, 3]} intensity={0.3} color="#10b981" />
      <pointLight position={[-3, 2, -3]} intensity={0.3} color="#f59e0b" />
      <spotLight
        position={[0, 5, 0]}
        angle={0.5}
        penumbra={0.5}
        intensity={0.5}
        castShadow
      />
      
      {/* Environment */}
      <RoomEnvironment layout={layout} theme={theme} />
      
      {/* Decision Core */}
      <XRDecisionCore
        context={context}
        layout={layout}
        theme={theme}
        onDecisionSelect={handleDecisionSelect}
      />
      
      {/* Agent Ring */}
      <XRAgentRing
        context={context}
        agents={agents}
        layout={layout}
        theme={theme}
        onAgentAsk={handleAgentAsk}
        onAgentDismiss={handleAgentDismiss}
      />
      
      {/* Timeline Wall */}
      <XRTimelineWall
        meetingId={context.meetingId}
        events={events}
        currentEventId={currentEventId}
        layout={layout}
        theme={theme}
        onEventSelect={handleEventSelect}
        onRewindTo={handleRewind}
      />
      
      {/* Human Participant */}
      <XRParticipant
        context={context}
        layout={layout}
        isSpeaking={isSpeaking}
        isListening={isListening}
        onStartSpeaking={() => setIsSpeaking(true)}
        onStopSpeaking={() => setIsSpeaking(false)}
      />
      
      {/* XR Interactions */}
      <XRInteractions
        nodes={[]}
        onSelect={(id) => console.log('Selected:', id)}
      />
      
      {/* Teleport (VR) */}
      <XRTeleport floorY={layout.floorY} maxDistance={layout.roomRadius} />
      
      {/* Contact shadows */}
      <ContactShadows
        position={[0, layout.floorY, 0]}
        opacity={0.4}
        scale={10}
        blur={2}
        far={4}
      />
    </>
  );
}

// ─────────────────────────────────────────────────────
// ROOM ENVIRONMENT
// ─────────────────────────────────────────────────────

function RoomEnvironment({
  layout,
  theme,
}: {
  layout: XRMeetingLayout;
  theme: XRMeetingTheme;
}) {
  const floorRef = React.useRef<THREE.Mesh>(null);
  
  // Animated floor glow
  useFrame(({ clock }) => {
    if (floorRef.current) {
      const material = floorRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.05 + Math.sin(clock.elapsedTime * 0.5) * 0.02;
    }
  });
  
  return (
    <group>
      {/* Floor */}
      <mesh
        ref={floorRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, layout.floorY, 0]}
        receiveShadow
      >
        <circleGeometry args={[layout.roomRadius, 64]} />
        <meshStandardMaterial
          color={theme.floorColor}
          emissive={theme.ambientColor}
          emissiveIntensity={0.05}
          metalness={0.8}
          roughness={0.4}
        />
      </mesh>
      
      {/* Floor grid lines */}
      <FloorGrid radius={layout.roomRadius} color={theme.ambientColor} />
      
      {/* Dome ceiling */}
      <mesh position={[0, layout.ceilingHeight, 0]}>
        <sphereGeometry args={[layout.roomRadius * 1.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshBasicMaterial
          color={theme.wallColor}
          side={THREE.BackSide}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Ambient particles */}
      <AmbientParticles
        count={50}
        radius={layout.roomRadius}
        height={layout.ceilingHeight}
        color={theme.ambientColor}
      />
    </group>
  );
}

// ─────────────────────────────────────────────────────
// FLOOR GRID
// ─────────────────────────────────────────────────────

function FloorGrid({ 
  radius, 
  color 
}: { 
  radius: number; 
  color: string;
}) {
  const rings = useMemo(() => {
    const count = 5;
    return Array.from({ length: count }, (_, i) => ({
      radius: (radius / count) * (i + 1),
      opacity: 0.1 - i * 0.015,
    }));
  }, [radius]);
  
  return (
    <group position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {rings.map((ring, i) => (
        <mesh key={i}>
          <ringGeometry args={[ring.radius - 0.02, ring.radius, 64]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={ring.opacity}
          />
        </mesh>
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────────────
// AMBIENT PARTICLES
// ─────────────────────────────────────────────────────

function AmbientParticles({
  count,
  radius,
  height,
  color,
}: {
  count: number;
  radius: number;
  height: number;
  color: string;
}) {
  const pointsRef = React.useRef<THREE.Points>(null);
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = Math.random() * radius * 0.8;
      pos[i * 3] = Math.cos(theta) * r;
      pos[i * 3 + 1] = Math.random() * height * 0.8 + 0.5;
      pos[i * 3 + 2] = Math.sin(theta) * r;
    }
    return pos;
  }, [count, radius, height]);
  
  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0005;
      
      const pos = pointsRef.current.geometry.attributes.position;
      for (let i = 0; i < count; i++) {
        const y = pos.getY(i);
        pos.setY(i, y + Math.sin(clock.elapsedTime + i) * 0.001);
      }
      pos.needsUpdate = true;
    }
  });
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.03}
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default XRMeetingRoom;
