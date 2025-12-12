/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ 3D - IMMOBILIER VIEWER
 * Visualisation 3D des propriétés et chantiers de construction
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { Suspense, useState, useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Environment, Html, useGLTF, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom, SSAO } from '@react-three/postprocessing';
import * as THREE from 'three';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface PropertyModel {
  id: string;
  name: string;
  type: 'house' | 'apartment' | 'commercial' | 'land';
  modelUrl?: string;
  address: string;
  specs: {
    area: number;
    rooms?: number;
    floors?: number;
  };
}

interface ConstructionPhase {
  id: string;
  name: string;
  status: 'pending' | 'active' | 'completed';
  progress: number;
  color: string;
  meshIds: string[];
}

interface ImmobilierViewerProps {
  property?: PropertyModel;
  phases?: ConstructionPhase[];
  onPhaseSelect?: (phaseId: string) => void;
  showAnnotations?: boolean;
  mode?: 'view' | 'edit' | 'construction';
}

// ─────────────────────────────────────────────────────────────────────────────
// PLACEHOLDER BUILDING (when no model loaded)
// ─────────────────────────────────────────────────────────────────────────────

function PlaceholderBuilding({ type }: { type: string }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });
  
  if (type === 'house') {
    return (
      <group ref={groupRef}>
        {/* Base */}
        <mesh position={[0, 1, 0]} castShadow>
          <boxGeometry args={[4, 2, 3]} />
          <meshStandardMaterial color="#E8E4DC" roughness={0.8} />
        </mesh>
        {/* Roof */}
        <mesh position={[0, 2.8, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[3.5, 1.5, 4]} />
          <meshStandardMaterial color="#8B4513" roughness={0.9} />
        </mesh>
        {/* Door */}
        <mesh position={[0, 0.6, 1.51]}>
          <boxGeometry args={[0.8, 1.2, 0.1]} />
          <meshStandardMaterial color="#4A3728" />
        </mesh>
        {/* Windows */}
        {[[-1.2, 1.2], [1.2, 1.2]].map(([x, y], i) => (
          <mesh key={i} position={[x, y, 1.51]}>
            <boxGeometry args={[0.6, 0.6, 0.1]} />
            <meshStandardMaterial color="#87CEEB" metalness={0.5} />
          </mesh>
        ))}
      </group>
    );
  }
  
  if (type === 'apartment') {
    return (
      <group ref={groupRef}>
        {/* Main building */}
        <mesh position={[0, 3, 0]} castShadow>
          <boxGeometry args={[5, 6, 4]} />
          <meshStandardMaterial color="#9CA3AF" roughness={0.4} metalness={0.3} />
        </mesh>
        {/* Floors */}
        {[0, 1, 2, 3, 4].map((floor) => (
          <group key={floor}>
            {/* Floor line */}
            <mesh position={[0, floor * 1.2 + 0.5, 2.01]}>
              <boxGeometry args={[5, 0.05, 0.1]} />
              <meshStandardMaterial color="#6B7280" />
            </mesh>
            {/* Windows */}
            {[-1.5, 0, 1.5].map((x, i) => (
              <mesh key={i} position={[x, floor * 1.2 + 1, 2.01]}>
                <boxGeometry args={[0.8, 0.9, 0.1]} />
                <meshStandardMaterial color="#87CEEB" metalness={0.6} transparent opacity={0.7} />
              </mesh>
            ))}
          </group>
        ))}
        {/* Balconies */}
        {[1, 2, 3, 4].map((floor) => (
          <mesh key={floor} position={[0, floor * 1.2 + 0.3, 2.3]} castShadow>
            <boxGeometry args={[5.2, 0.1, 0.6]} />
            <meshStandardMaterial color="#4B5563" />
          </mesh>
        ))}
      </group>
    );
  }
  
  // Commercial / Default
  return (
    <group ref={groupRef}>
      <mesh position={[0, 2.5, 0]} castShadow>
        <boxGeometry args={[6, 5, 5]} />
        <meshStandardMaterial color="#374151" roughness={0.3} metalness={0.5} />
      </mesh>
      {/* Glass facade */}
      <mesh position={[0, 2.5, 2.51]}>
        <planeGeometry args={[5.8, 4.8]} />
        <meshStandardMaterial color="#60A5FA" metalness={0.8} transparent opacity={0.6} />
      </mesh>
      {/* Entrance */}
      <mesh position={[0, 0.75, 2.51]}>
        <boxGeometry args={[2, 1.5, 0.1]} />
        <meshStandardMaterial color="#1F2937" />
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONSTRUCTION PHASE OVERLAY
// ─────────────────────────────────────────────────────────────────────────────

interface PhaseOverlayProps {
  phases: ConstructionPhase[];
  activePhaseId?: string;
  onSelect: (id: string) => void;
}

function ConstructionPhaseOverlay({ phases, activePhaseId, onSelect }: PhaseOverlayProps) {
  return (
    <div style={{
      position: 'absolute',
      top: 80,
      left: 20,
      background: 'rgba(26, 26, 26, 0.95)',
      padding: 20,
      borderRadius: 12,
      border: '1px solid rgba(255,255,255,0.1)',
      maxWidth: 280
    }}>
      <h3 style={{ 
        color: '#D8B26A', 
        margin: '0 0 16px 0',
        fontSize: 14,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: 1
      }}>
        Phases de Construction
      </h3>
      
      {phases.map((phase) => (
        <div
          key={phase.id}
          onClick={() => onSelect(phase.id)}
          style={{
            padding: '12px 16px',
            marginBottom: 8,
            borderRadius: 8,
            background: activePhaseId === phase.id ? `${phase.color}20` : 'rgba(255,255,255,0.03)',
            border: `1px solid ${activePhaseId === phase.id ? phase.color : 'transparent'}`,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#E9E4D6', fontSize: 14 }}>{phase.name}</span>
            <span style={{
              fontSize: 11,
              padding: '2px 8px',
              borderRadius: 4,
              background: phase.status === 'completed' ? '#10B98130' : 
                         phase.status === 'active' ? '#F59E0B30' : '#6B728030',
              color: phase.status === 'completed' ? '#10B981' : 
                     phase.status === 'active' ? '#F59E0B' : '#6B7280'
            }}>
              {phase.status === 'completed' ? 'Terminé' : 
               phase.status === 'active' ? 'En cours' : 'À venir'}
            </span>
          </div>
          
          {/* Progress bar */}
          <div style={{
            marginTop: 8,
            height: 4,
            background: 'rgba(255,255,255,0.1)',
            borderRadius: 2,
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${phase.progress}%`,
              height: '100%',
              background: phase.color,
              transition: 'width 0.3s'
            }} />
          </div>
          <div style={{ fontSize: 11, color: '#8D8371', marginTop: 4 }}>
            {phase.progress}% complété
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PROPERTY INFO PANEL
// ─────────────────────────────────────────────────────────────────────────────

function PropertyInfoPanel({ property }: { property: PropertyModel }) {
  return (
    <div style={{
      position: 'absolute',
      top: 80,
      right: 20,
      background: 'rgba(26, 26, 26, 0.95)',
      padding: 20,
      borderRadius: 12,
      border: '1px solid rgba(255,255,255,0.1)',
      width: 280
    }}>
      <h2 style={{ color: '#E9E4D6', margin: '0 0 8px 0', fontSize: 18 }}>
        {property.name}
      </h2>
      <p style={{ color: '#8D8371', margin: '0 0 16px 0', fontSize: 13 }}>
        {property.address}
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          padding: 12,
          borderRadius: 8,
          textAlign: 'center'
        }}>
          <div style={{ color: '#D8B26A', fontSize: 20, fontWeight: 700 }}>
            {property.specs.area}
          </div>
          <div style={{ color: '#8D8371', fontSize: 11 }}>m² surface</div>
        </div>
        
        {property.specs.rooms && (
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            padding: 12,
            borderRadius: 8,
            textAlign: 'center'
          }}>
            <div style={{ color: '#D8B26A', fontSize: 20, fontWeight: 700 }}>
              {property.specs.rooms}
            </div>
            <div style={{ color: '#8D8371', fontSize: 11 }}>pièces</div>
          </div>
        )}
        
        {property.specs.floors && (
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            padding: 12,
            borderRadius: 8,
            textAlign: 'center'
          }}>
            <div style={{ color: '#D8B26A', fontSize: 20, fontWeight: 700 }}>
              {property.specs.floors}
            </div>
            <div style={{ color: '#8D8371', fontSize: 11 }}>étages</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN VIEWER
// ─────────────────────────────────────────────────────────────────────────────

export function ImmobilierViewer({
  property,
  phases = [],
  onPhaseSelect,
  showAnnotations = true,
  mode = 'view'
}: ImmobilierViewerProps) {
  const [activePhase, setActivePhase] = useState<string | undefined>();
  
  const handlePhaseSelect = (id: string) => {
    setActivePhase(id);
    onPhaseSelect?.(id);
  };
  
  // Default property for demo
  const displayProperty = property || {
    id: 'demo',
    name: 'Projet Résidentiel CHE·NU',
    type: 'apartment' as const,
    address: '123 Rue de la Construction, Montréal',
    specs: { area: 450, rooms: 12, floors: 5 }
  };
  
  // Default phases for demo
  const displayPhases = phases.length > 0 ? phases : [
    { id: 'foundation', name: 'Fondations', status: 'completed' as const, progress: 100, color: '#10B981', meshIds: [] },
    { id: 'structure', name: 'Structure', status: 'completed' as const, progress: 100, color: '#3B82F6', meshIds: [] },
    { id: 'envelope', name: 'Enveloppe', status: 'active' as const, progress: 65, color: '#F59E0B', meshIds: [] },
    { id: 'interior', name: 'Intérieur', status: 'pending' as const, progress: 10, color: '#8B5CF6', meshIds: [] },
    { id: 'finishing', name: 'Finitions', status: 'pending' as const, progress: 0, color: '#EC4899', meshIds: [] }
  ];
  
  return (
    <div style={{ 
      width: '100%', 
      height: '100vh', 
      position: 'relative',
      background: '#0D0D0D'
    }}>
      {/* Header */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 64,
        background: 'rgba(26, 26, 26, 0.95)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 24 }}>🏗️</span>
          <div>
            <div style={{ color: '#E9E4D6', fontWeight: 600 }}>Viewer Immobilier</div>
            <div style={{ color: '#8D8371', fontSize: 12 }}>Mode: {mode}</div>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: 12 }}>
          {['view', 'edit', 'construction'].map((m) => (
            <button
              key={m}
              style={{
                padding: '8px 16px',
                background: mode === m ? '#D8B26A' : 'transparent',
                border: `1px solid ${mode === m ? '#D8B26A' : 'rgba(255,255,255,0.2)'}`,
                borderRadius: 6,
                color: mode === m ? '#1A1A1A' : '#E9E4D6',
                fontSize: 13,
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
      
      {/* 3D Canvas */}
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[10, 8, 10]} fov={50} />
        
        <ambientLight intensity={0.4} />
        <hemisphereLight args={['#87CEEB', '#362312', 0.5]} />
        <directionalLight
          position={[10, 20, 10]}
          intensity={1}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        
        {/* Ground */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial color="#1A1A1A" roughness={0.9} />
        </mesh>
        <gridHelper args={[50, 50, '#2A2A2A', '#1F1F1F']} />
        
        {/* Building */}
        <Suspense fallback={null}>
          <PlaceholderBuilding type={displayProperty.type} />
        </Suspense>
        
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={5}
          maxDistance={30}
          maxPolarAngle={Math.PI / 2.1}
        />
        
        <EffectComposer>
          <Bloom luminanceThreshold={0.8} intensity={0.3} />
        </EffectComposer>
      </Canvas>
      
      {/* UI Overlays */}
      {mode === 'construction' && (
        <ConstructionPhaseOverlay
          phases={displayPhases}
          activePhaseId={activePhase}
          onSelect={handlePhaseSelect}
        />
      )}
      
      {showAnnotations && (
        <PropertyInfoPanel property={displayProperty} />
      )}
      
      {/* Controls hint */}
      <div style={{
        position: 'absolute',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(26, 26, 26, 0.9)',
        padding: '8px 16px',
        borderRadius: 20,
        fontSize: 12,
        color: '#8D8371'
      }}>
        🖱️ Glisser: Rotation • Scroll: Zoom • Clic droit: Pan
      </div>
    </div>
  );
}

export default ImmobilierViewer;
