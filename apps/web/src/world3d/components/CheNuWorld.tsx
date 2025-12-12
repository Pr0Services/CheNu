/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ 3D WORLD - MAIN COMPONENT
 * Composant principal React Three Fiber
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

import { useWorld3DStore, SpaceId } from '../stores/world3DStore';
import { SPACES_CONFIG, CAMERA_CONFIG, TOKENS } from '../config/spacesConfig';

// Spaces
import {
  MaisonSpace,
  EntrepriseSpace,
  ProjetsSpace,
  GouvernementSpace,
  ImmobilierSpace,
  AssociationsSpace,
  CreativeSpace
} from './spaces/AllSpaces';

// UI
import { 
  SpacePanel, 
  SpaceIndicators, 
  NovaButton, 
  ControlsHint,
  Header 
} from './ui/UIComponents';

// ─────────────────────────────────────────────────────────────────────────────
// GROUND COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

function Ground() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <circleGeometry args={[50, 64]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.9} metalness={0.1} />
      </mesh>
      
      <gridHelper args={[60, 30, '#2A2A2A', '#1F1F1F']} position={[0, 0, 0]} />
      
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[6, 6.2, 64]} />
        <meshBasicMaterial color="#D8B26A" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LIGHTING
// ─────────────────────────────────────────────────────────────────────────────

function Lighting() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <hemisphereLight args={['#87CEEB', '#362312', 0.6]} />
      
      <directionalLight
        position={[20, 30, 10]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={100}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />
      
      <directionalLight position={[-10, 10, -10]} intensity={0.3} color="#D8B26A" />
      <directionalLight position={[0, 5, -20]} intensity={0.2} color="#3EB4A2" />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// POST PROCESSING
// ─────────────────────────────────────────────────────────────────────────────

function PostProcessing() {
  const { quality } = useWorld3DStore();
  
  if (quality === 'low') return null;
  
  return (
    <EffectComposer>
      <Bloom 
        luminanceThreshold={0.6} 
        luminanceSmoothing={0.9} 
        intensity={quality === 'high' ? 0.5 : 0.3}
      />
      <Vignette darkness={0.4} offset={0.3} />
    </EffectComposer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LOADING FALLBACK
// ─────────────────────────────────────────────────────────────────────────────

function LoadingFallback() {
  return (
    <Html center>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: '#E9E4D6'
      }}>
        <div style={{
          fontSize: 32,
          fontWeight: 700,
          color: '#D8B26A',
          marginBottom: 16,
          fontFamily: "'Lora', serif"
        }}>
          CHE·NU
        </div>
        <div style={{ fontSize: 14 }}>Chargement du monde 3D...</div>
      </div>
    </Html>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SCENE
// ─────────────────────────────────────────────────────────────────────────────

function Scene() {
  return (
    <>
      <Lighting />
      <Ground />
      
      {/* All 7 Spaces */}
      <MaisonSpace />
      <EntrepriseSpace />
      <ProjetsSpace />
      <GouvernementSpace />
      <ImmobilierSpace />
      <AssociationsSpace />
      <CreativeSpace />
      
      {/* Background */}
      <Stars radius={100} depth={50} count={1000} factor={4} fade speed={0.5} />
      
      {/* Camera Controls */}
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.5}
        zoomSpeed={0.8}
        minDistance={CAMERA_CONFIG.minDistance}
        maxDistance={CAMERA_CONFIG.maxDistance}
        minPolarAngle={CAMERA_CONFIG.minPolarAngle}
        maxPolarAngle={CAMERA_CONFIG.maxPolarAngle}
      />
      
      {/* Post-processing Effects */}
      <PostProcessing />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────────────────

interface CheNuWorldProps {
  onSpaceSelect?: (spaceId: SpaceId) => void;
  onNavigate?: (route: string) => void;
  onDashboard?: () => void;
  showAgents?: boolean;
  className?: string;
}

export function CheNuWorld({ 
  onSpaceSelect, 
  onNavigate,
  onDashboard,
  showAgents = true,
  className = ''
}: CheNuWorldProps) {
  const { selectedSpace, isPanelOpen, closePanel, resetView } = useWorld3DStore();
  
  const handleEnterSpace = () => {
    if (selectedSpace) {
      const config = SPACES_CONFIG[selectedSpace];
      onNavigate?.(config.route);
      onSpaceSelect?.(selectedSpace);
    }
  };
  
  return (
    <div className={`chenu-world-container ${className}`} style={{
      position: 'relative',
      width: '100%',
      height: '100vh',
      background: TOKENS.colors.darkSlate
    }}>
      {/* Header */}
      <Header onResetView={resetView} onDashboard={onDashboard} />
      
      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{
          fov: CAMERA_CONFIG.fov,
          near: CAMERA_CONFIG.near,
          far: CAMERA_CONFIG.far,
          position: CAMERA_CONFIG.initialPosition
        }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        style={{ paddingTop: 64 }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <Scene />
        </Suspense>
      </Canvas>
      
      {/* UI Overlays */}
      <SpacePanel 
        isOpen={isPanelOpen}
        spaceId={selectedSpace}
        onClose={closePanel}
        onEnter={handleEnterSpace}
      />
      
      <SpaceIndicators />
      <NovaButton />
      <ControlsHint />
    </div>
  );
}

export default CheNuWorld;
