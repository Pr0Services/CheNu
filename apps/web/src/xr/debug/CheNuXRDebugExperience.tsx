/* =========================================================
   CHE·NU — XR Debug Experience
   
   Immersive debugging interface for CHE·NU runtime.
   Visualizes:
   - Flow stages (pillar)
   - Agent activity (orbit)
   - Guard events (shields)
   - Process observations (ribbon)
   - Timeline (arc)
   
   📜 "Serve clarity, not control."
   ========================================================= */

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { XR, Controllers, Hands } from '@react-three/xr';
import { Text, Line } from '@react-three/drei';
import * as THREE from 'three';

/* -------------------------
   TYPES
------------------------- */

export type FlowStage =
  | 'user_intention'
  | 'parallel_analysis'
  | 'orchestration'
  | 'decision_clarification'
  | 'human_validation'
  | 'timeline_write';

export type Confidence = 'low' | 'medium' | 'high';

export interface AgentStatus {
  name: string;
  confidence: Confidence;
  summary: string;
  active?: boolean;
}

export interface GuardEvent {
  rule: string;
  reason: string;
  timestamp?: number;
  severity?: 'info' | 'warning' | 'violation';
}

export interface ProcessObservation {
  note: string;
  stage?: string;
  timestamp?: string;
}

export interface XRDebugProps {
  currentStage: FlowStage;
  agents: AgentStatus[];
  guardEvents: GuardEvent[];
  observations: ProcessObservation[];
}

/* -------------------------
   CONSTANTS
------------------------- */

const FLOW_STAGES: FlowStage[] = [
  'user_intention',
  'parallel_analysis',
  'orchestration',
  'decision_clarification',
  'human_validation',
  'timeline_write',
];

const STAGE_LABELS: Record<FlowStage, string> = {
  user_intention: 'Intention',
  parallel_analysis: 'Parallel',
  orchestration: 'Orchestrate',
  decision_clarification: 'Clarify',
  human_validation: 'Validate',
  timeline_write: 'Write',
};

const CONFIDENCE_COLORS: Record<Confidence, string> = {
  low: '#ff6b6b',
  medium: '#ffd93d',
  high: '#6bcb77',
};

const STAGE_COLORS = {
  active: '#4dabf7',
  inactive: '#495057',
  completed: '#51cf66',
};

/* =========================================================
   MAIN COMPONENT
   ========================================================= */

export const CheNuXRDebugExperience: React.FC<XRDebugProps> = ({
  currentStage,
  agents,
  guardEvents,
  observations,
}) => {
  return (
    <Canvas
      style={{ width: '100%', height: '100vh', background: '#0a0a0f' }}
      camera={{ position: [0, 1.6, 2], fov: 70 }}
    >
      <XR>
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[2, 4, 2]} intensity={0.8} />
        <pointLight position={[-2, 2, -2]} intensity={0.5} color="#4dabf7" />

        {/* Environment */}
        <fog attach="fog" args={['#0a0a0f', 5, 20]} />
        <GridFloor />

        {/* User reference point */}
        <UserAnchor />

        {/* Flow visualization pillar */}
        <FlowPillar currentStage={currentStage} />

        {/* Agents orbiting */}
        <AgentsOrbit agents={agents} />

        {/* Guard shields */}
        <GuardShields guardEvents={guardEvents} />

        {/* Observations ribbon */}
        <ObservationsRibbon observations={observations} />

        {/* Timeline arc */}
        <TimelineArc currentStage={currentStage} />

        {/* XR Controllers */}
        <Controllers />
        <Hands />
      </XR>
    </Canvas>
  );
};

/* =========================================================
   GRID FLOOR
   ========================================================= */

const GridFloor: React.FC = () => {
  return (
    <group position={[0, 0, 0]}>
      <gridHelper args={[20, 40, '#1a1a2e', '#16213e']} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
          color="#0a0a0f"
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  );
};

/* =========================================================
   USER ANCHOR
   ========================================================= */

const UserAnchor: React.FC = () => {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group position={[0, 0.01, 0]}>
      {/* Center marker */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.15, 0.2, 32]} />
        <meshStandardMaterial
          color="#4dabf7"
          emissive="#4dabf7"
          emissiveIntensity={0.3}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Rotating outer ring */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.3, 0.32, 6]} />
        <meshStandardMaterial
          color="#748ffc"
          emissive="#748ffc"
          emissiveIntensity={0.2}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Label */}
      <Text
        position={[0, 0.1, 0.4]}
        fontSize={0.08}
        color="#868e96"
        anchorX="center"
      >
        YOU
      </Text>
    </group>
  );
};

/* =========================================================
   FLOW PILLAR
   ========================================================= */

interface FlowPillarProps {
  currentStage: FlowStage;
}

const FlowPillar: React.FC<FlowPillarProps> = ({ currentStage }) => {
  const currentIndex = FLOW_STAGES.indexOf(currentStage);
  const segmentHeight = 0.3;
  const gap = 0.05;

  return (
    <group position={[0, 0.5, -2]}>
      {/* Title */}
      <Text
        position={[0, FLOW_STAGES.length * (segmentHeight + gap) + 0.3, 0]}
        fontSize={0.12}
        color="#e9ecef"
        anchorX="center"
      >
        FLOW STAGE
      </Text>

      {/* Segments */}
      {FLOW_STAGES.map((stage, i) => {
        const isActive = i === currentIndex;
        const isCompleted = i < currentIndex;
        const y = i * (segmentHeight + gap);

        return (
          <FlowSegment
            key={stage}
            stage={stage}
            position={[0, y, 0]}
            isActive={isActive}
            isCompleted={isCompleted}
            height={segmentHeight}
          />
        );
      })}

      {/* Connection line */}
      <mesh position={[0, (FLOW_STAGES.length * (segmentHeight + gap)) / 2 - 0.15, -0.1]}>
        <boxGeometry args={[0.02, FLOW_STAGES.length * (segmentHeight + gap), 0.02]} />
        <meshStandardMaterial color="#495057" />
      </mesh>
    </group>
  );
};

interface FlowSegmentProps {
  stage: FlowStage;
  position: [number, number, number];
  isActive: boolean;
  isCompleted: boolean;
  height: number;
}

const FlowSegment: React.FC<FlowSegmentProps> = ({
  stage,
  position,
  isActive,
  isCompleted,
  height,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  const color = isActive
    ? STAGE_COLORS.active
    : isCompleted
    ? STAGE_COLORS.completed
    : STAGE_COLORS.inactive;

  useFrame((state) => {
    if (meshRef.current && isActive) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.05;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group position={position}>
      {/* Segment box */}
      <mesh ref={meshRef}>
        <boxGeometry args={[0.6, height, 0.1]} />
        <meshStandardMaterial
          color={color}
          emissive={isActive ? color : '#000000'}
          emissiveIntensity={isActive ? 0.5 : 0}
          transparent
          opacity={isActive ? 1 : 0.7}
        />
      </mesh>

      {/* Label */}
      <Text
        position={[0, 0, 0.06]}
        fontSize={0.06}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {STAGE_LABELS[stage]}
      </Text>

      {/* Active indicator */}
      {isActive && (
        <mesh position={[-0.4, 0, 0]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={1}
          />
        </mesh>
      )}
    </group>
  );
};

/* =========================================================
   AGENTS ORBIT
   ========================================================= */

interface AgentsOrbitProps {
  agents: AgentStatus[];
}

const AgentsOrbit: React.FC<AgentsOrbitProps> = ({ agents }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[0, 1.4, 0]}>
      {agents.map((agent, i) => {
        const angle = (i / agents.length) * Math.PI * 2;
        const radius = 1.5;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        return (
          <AgentNode
            key={agent.name}
            agent={agent}
            position={[x, 0, z]}
            angle={angle}
          />
        );
      })}

      {/* Orbit ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.45, 1.55, 64]} />
        <meshStandardMaterial
          color="#495057"
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
};

interface AgentNodeProps {
  agent: AgentStatus;
  position: [number, number, number];
  angle: number;
}

const AgentNode: React.FC<AgentNodeProps> = ({ agent, position, angle }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const color = CONFIDENCE_COLORS[agent.confidence];

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2 + angle) * 0.05;

      // Pulse if active
      if (agent.active) {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.1;
        meshRef.current.scale.setScalar(scale);
      }
    }
  });

  return (
    <group position={position}>
      {/* Agent sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={agent.active ? 0.5 : 0.2}
        />
      </mesh>

      {/* Name label */}
      <Text
        position={[0, 0.25, 0]}
        fontSize={0.06}
        color="#e9ecef"
        anchorX="center"
      >
        {agent.name}
      </Text>

      {/* Confidence indicator */}
      <Text
        position={[0, -0.2, 0]}
        fontSize={0.04}
        color={color}
        anchorX="center"
      >
        {agent.confidence.toUpperCase()}
      </Text>

      {/* Connection line to center */}
      <Line
        points={[
          [0, 0, 0],
          [-position[0] * 0.7, -position[1], -position[2] * 0.7],
        ]}
        color="#495057"
        lineWidth={1}
        transparent
        opacity={0.3}
      />
    </group>
  );
};

/* =========================================================
   GUARD SHIELDS
   ========================================================= */

interface GuardShieldsProps {
  guardEvents: GuardEvent[];
}

const GuardShields: React.FC<GuardShieldsProps> = ({ guardEvents }) => {
  const hasViolations = guardEvents.some((e) => e.severity === 'violation');
  const hasWarnings = guardEvents.some((e) => e.severity === 'warning');

  const shieldColor = hasViolations
    ? '#ff6b6b'
    : hasWarnings
    ? '#ffd93d'
    : '#51cf66';

  return (
    <group position={[0, 1.2, -1]}>
      {/* Main shield */}
      <ShieldRing
        radius={0.5}
        color={shieldColor}
        pulse={guardEvents.length > 0}
      />

      {/* Shield label */}
      <Text
        position={[0, 0.7, 0]}
        fontSize={0.08}
        color="#e9ecef"
        anchorX="center"
      >
        GUARDS
      </Text>

      {/* Event count */}
      <Text
        position={[0, -0.6, 0]}
        fontSize={0.06}
        color={shieldColor}
        anchorX="center"
      >
        {guardEvents.length} events
      </Text>

      {/* Individual event indicators */}
      {guardEvents.slice(0, 5).map((event, i) => (
        <GuardEventIndicator
          key={i}
          event={event}
          position={[0.8, 0.3 - i * 0.25, 0]}
        />
      ))}
    </group>
  );
};

interface ShieldRingProps {
  radius: number;
  color: string;
  pulse: boolean;
}

const ShieldRing: React.FC<ShieldRingProps> = ({ radius, color, pulse }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current && pulse) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <mesh ref={meshRef}>
      <torusGeometry args={[radius, 0.02, 16, 64]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={pulse ? 0.5 : 0.2}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
};

interface GuardEventIndicatorProps {
  event: GuardEvent;
  position: [number, number, number];
}

const GuardEventIndicator: React.FC<GuardEventIndicatorProps> = ({
  event,
  position,
}) => {
  const color =
    event.severity === 'violation'
      ? '#ff6b6b'
      : event.severity === 'warning'
      ? '#ffd93d'
      : '#868e96';

  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.02, 0.02, 0.02]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
      </mesh>
      <Text
        position={[0.1, 0, 0]}
        fontSize={0.04}
        color={color}
        anchorX="left"
      >
        {event.rule}
      </Text>
    </group>
  );
};

/* =========================================================
   OBSERVATIONS RIBBON
   ========================================================= */

interface ObservationsRibbonProps {
  observations: ProcessObservation[];
}

const ObservationsRibbon: React.FC<ObservationsRibbonProps> = ({
  observations,
}) => {
  return (
    <group position={[1.8, 1.5, -0.5]}>
      {/* Title */}
      <Text
        position={[0, 0.5, 0]}
        fontSize={0.08}
        color="#e9ecef"
        anchorX="center"
      >
        OBSERVATIONS
      </Text>

      {/* Observation cards */}
      {observations.slice(0, 5).map((obs, i) => (
        <ObservationCard
          key={i}
          observation={obs}
          position={[0, 0.3 - i * 0.2, 0]}
        />
      ))}

      {/* Background panel */}
      <mesh position={[0, 0, -0.05]}>
        <planeGeometry args={[1.2, 1.5]} />
        <meshStandardMaterial
          color="#1a1a2e"
          transparent
          opacity={0.5}
        />
      </mesh>
    </group>
  );
};

interface ObservationCardProps {
  observation: ProcessObservation;
  position: [number, number, number];
}

const ObservationCard: React.FC<ObservationCardProps> = ({
  observation,
  position,
}) => {
  // Truncate note if too long
  const displayNote =
    observation.note.length > 40
      ? observation.note.substring(0, 37) + '...'
      : observation.note;

  return (
    <group position={position}>
      <Text
        fontSize={0.04}
        color="#adb5bd"
        anchorX="center"
        maxWidth={1}
      >
        {displayNote}
      </Text>
    </group>
  );
};

/* =========================================================
   TIMELINE ARC
   ========================================================= */

interface TimelineArcProps {
  currentStage: FlowStage;
}

const TimelineArc: React.FC<TimelineArcProps> = ({ currentStage }) => {
  const currentIndex = FLOW_STAGES.indexOf(currentStage);

  // Generate arc points
  const points = useMemo(() => {
    const arcPoints: THREE.Vector3[] = [];
    const radius = 2;
    const startAngle = -Math.PI / 3;
    const endAngle = Math.PI / 3;
    const segments = 60;

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const angle = startAngle + (endAngle - startAngle) * t;
      arcPoints.push(
        new THREE.Vector3(Math.sin(angle) * radius, 0, -Math.cos(angle) * radius)
      );
    }

    return arcPoints;
  }, []);

  return (
    <group position={[0, 0.02, 0]}>
      {/* Arc line */}
      <Line
        points={points}
        color="#495057"
        lineWidth={2}
      />

      {/* Stage markers on arc */}
      {FLOW_STAGES.map((stage, i) => {
        const t = i / (FLOW_STAGES.length - 1);
        const startAngle = -Math.PI / 3;
        const endAngle = Math.PI / 3;
        const angle = startAngle + (endAngle - startAngle) * t;
        const radius = 2;
        const x = Math.sin(angle) * radius;
        const z = -Math.cos(angle) * radius;

        const isActive = i === currentIndex;
        const isCompleted = i < currentIndex;

        return (
          <group key={stage} position={[x, 0, z]}>
            <mesh>
              <sphereGeometry args={[isActive ? 0.08 : 0.05, 16, 16]} />
              <meshStandardMaterial
                color={
                  isActive
                    ? STAGE_COLORS.active
                    : isCompleted
                    ? STAGE_COLORS.completed
                    : STAGE_COLORS.inactive
                }
                emissive={isActive ? STAGE_COLORS.active : '#000000'}
                emissiveIntensity={isActive ? 0.5 : 0}
              />
            </mesh>
          </group>
        );
      })}

      {/* Current position indicator */}
      <TimelinePointer currentIndex={currentIndex} />
    </group>
  );
};

interface TimelinePointerProps {
  currentIndex: number;
}

const TimelinePointer: React.FC<TimelinePointerProps> = ({ currentIndex }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  const t = currentIndex / (FLOW_STAGES.length - 1);
  const startAngle = -Math.PI / 3;
  const endAngle = Math.PI / 3;
  const angle = startAngle + (endAngle - startAngle) * t;
  const radius = 2;
  const x = Math.sin(angle) * radius;
  const z = -Math.cos(angle) * radius;

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = 0.2 + Math.sin(state.clock.elapsedTime * 3) * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} position={[x, 0.2, z]}>
      <coneGeometry args={[0.05, 0.1, 4]} />
      <meshStandardMaterial
        color={STAGE_COLORS.active}
        emissive={STAGE_COLORS.active}
        emissiveIntensity={0.5}
      />
    </mesh>
  );
};

/* =========================================================
   EXPORTS
   ========================================================= */

export default CheNuXRDebugExperience;
