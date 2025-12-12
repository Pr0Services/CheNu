/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ 3D - INDIVIDUAL SPACE COMPONENTS
 * Les 7 espaces 3D avec leurs modèles uniques
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SpaceBase } from './SpaceBase';
import { SPACES_CONFIG } from '../../config/spacesConfig';

// ═══════════════════════════════════════════════════════════════════════════════
// MAISON - Cozy House
// ═══════════════════════════════════════════════════════════════════════════════

export function MaisonSpace() {
  const config = SPACES_CONFIG.maison;
  
  return (
    <SpaceBase spaceId="maison">
      <group>
        {/* Base */}
        <mesh position={[0, 0.75, 0]} castShadow>
          <boxGeometry args={[2.5, 1.5, 2]} />
          <meshStandardMaterial color={config.color} roughness={0.6} metalness={0.1} />
        </mesh>
        
        {/* Roof */}
        <mesh position={[0, 2.1, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[2, 1.2, 4]} />
          <meshStandardMaterial color="#8B4513" roughness={0.7} />
        </mesh>
        
        {/* Door */}
        <mesh position={[0, 0.4, 1.01]}>
          <boxGeometry args={[0.5, 0.8, 0.1]} />
          <meshStandardMaterial color="#4A3728" roughness={0.8} />
        </mesh>
        
        {/* Windows */}
        <mesh position={[-0.7, 1.1, 1.01]}>
          <boxGeometry args={[0.4, 0.4, 0.1]} />
          <meshStandardMaterial color="#FFE4B5" emissive="#FFE4B5" emissiveIntensity={0.3} />
        </mesh>
        <mesh position={[0.7, 1.1, 1.01]}>
          <boxGeometry args={[0.4, 0.4, 0.1]} />
          <meshStandardMaterial color="#FFE4B5" emissive="#FFE4B5" emissiveIntensity={0.3} />
        </mesh>
        
        {/* Chimney */}
        <mesh position={[0.7, 2.4, -0.3]} castShadow>
          <boxGeometry args={[0.4, 0.8, 0.4]} />
          <meshStandardMaterial color="#8B4513" roughness={0.7} />
        </mesh>
      </group>
    </SpaceBase>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ENTREPRISE - Office Tower
// ═══════════════════════════════════════════════════════════════════════════════

export function EntrepriseSpace() {
  const config = SPACES_CONFIG.entreprise;
  
  return (
    <SpaceBase spaceId="entreprise">
      <group>
        {/* Main tower */}
        <mesh position={[0, 2, 0]} castShadow>
          <boxGeometry args={[2, 4, 2]} />
          <meshStandardMaterial color={config.color} roughness={0.3} metalness={0.6} />
        </mesh>
        
        {/* Glass windows */}
        {[0, 1, 2, 3].map((floor) => (
          [0, 1, 2, 3].map((side) => {
            const angle = (side * Math.PI) / 2;
            return (
              <mesh 
                key={`${floor}-${side}`}
                position={[
                  Math.sin(angle) * 1.01,
                  0.5 + floor * 0.9,
                  Math.cos(angle) * 1.01
                ]}
                rotation={[0, angle, 0]}
              >
                <planeGeometry args={[0.35, 0.6]} />
                <meshStandardMaterial 
                  color="#87CEEB" 
                  roughness={0.1} 
                  metalness={0.9}
                  transparent
                  opacity={0.7}
                />
              </mesh>
            );
          })
        )).flat()}
        
        {/* Top */}
        <mesh position={[0, 4.1, 0]}>
          <boxGeometry args={[2.2, 0.2, 2.2]} />
          <meshStandardMaterial color={config.color} roughness={0.3} metalness={0.6} />
        </mesh>
        
        {/* Antenna */}
        <mesh position={[0, 4.7, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 1, 8]} />
          <meshStandardMaterial color="#CCCCCC" />
        </mesh>
      </group>
    </SpaceBase>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROJETS - Holographic Table
// ═══════════════════════════════════════════════════════════════════════════════

export function ProjetsSpace() {
  const config = SPACES_CONFIG.projets;
  const barsRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.5;
    }
  });
  
  const barHeights = [0.8, 1.2, 0.6, 1.5, 1.0];
  
  return (
    <SpaceBase spaceId="projets">
      <group>
        {/* Table base */}
        <mesh position={[0, 0.8, 0]} castShadow>
          <cylinderGeometry args={[1.5, 1.5, 0.3, 32]} />
          <meshStandardMaterial color="#333333" roughness={0.4} metalness={0.6} />
        </mesh>
        
        {/* Table leg */}
        <mesh position={[0, 0.35, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.5, 0.7, 16]} />
          <meshStandardMaterial color="#333333" roughness={0.4} metalness={0.6} />
        </mesh>
        
        {/* Hologram ring */}
        <mesh ref={ringRef} position={[0, 1.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.2, 0.05, 8, 32]} />
          <meshBasicMaterial color={config.color} transparent opacity={0.8} />
        </mesh>
        
        {/* Hologram bars */}
        <group ref={barsRef}>
          {barHeights.map((height, i) => (
            <mesh key={i} position={[-0.5 + i * 0.25, 1 + height / 2, 0]}>
              <boxGeometry args={[0.2, height, 0.2]} />
              <meshBasicMaterial color={config.color} transparent opacity={0.6} />
            </mesh>
          ))}
        </group>
        
        {/* Floating particles */}
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={20}
              array={new Float32Array(
                Array(60).fill(0).map((_, i) => {
                  if (i % 3 === 1) return 1.2 + Math.random() * 1.5;
                  return (Math.random() - 0.5) * 2;
                })
              )}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial color={config.color} size={0.08} transparent opacity={0.8} />
        </points>
      </group>
    </SpaceBase>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// GOUVERNEMENT - Institutional Dome
// ═══════════════════════════════════════════════════════════════════════════════

export function GouvernementSpace() {
  const config = SPACES_CONFIG.gouvernement;
  
  return (
    <SpaceBase spaceId="gouvernement">
      <group>
        {/* Columns */}
        {Array(8).fill(0).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          return (
            <mesh 
              key={i} 
              position={[Math.cos(angle) * 1.8, 1, Math.sin(angle) * 1.8]}
              castShadow
            >
              <cylinderGeometry args={[0.15, 0.2, 2, 16]} />
              <meshStandardMaterial color={config.color} roughness={0.5} metalness={0.2} />
            </mesh>
          );
        })}
        
        {/* Dome */}
        <mesh position={[0, 2, 0]} castShadow>
          <sphereGeometry args={[2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial 
            color={config.color} 
            roughness={0.3} 
            metalness={0.4}
            side={THREE.DoubleSide}
          />
        </mesh>
        
        {/* Base ring */}
        <mesh position={[0, 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2, 0.15, 8, 32]} />
          <meshStandardMaterial color={config.color} roughness={0.5} metalness={0.2} />
        </mesh>
        
        {/* Steps */}
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[0, i * 0.1, 0]} receiveShadow>
            <cylinderGeometry args={[2.3 - i * 0.2, 2.3 - i * 0.2, 0.1, 32]} />
            <meshStandardMaterial color={config.color} roughness={0.5} metalness={0.2} />
          </mesh>
        ))}
      </group>
    </SpaceBase>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// IMMOBILIER - Modern Building
// ═══════════════════════════════════════════════════════════════════════════════

export function ImmobilierSpace() {
  const config = SPACES_CONFIG.immobilier;
  
  return (
    <SpaceBase spaceId="immobilier">
      <group>
        {/* Main building */}
        <mesh position={[0, 1.75, 0]} castShadow>
          <boxGeometry args={[2, 3.5, 1.5]} />
          <meshStandardMaterial color={config.color} roughness={0.4} metalness={0.3} />
        </mesh>
        
        {/* Balconies */}
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[0, 0.8 + i * 1.2, 0.95]} castShadow>
            <boxGeometry args={[2.2, 0.1, 0.4]} />
            <meshStandardMaterial color="#444444" roughness={0.6} />
          </mesh>
        ))}
        
        {/* Windows */}
        {[0, 1, 2].map((floor) => (
          [0, 1].map((col) => (
            <mesh 
              key={`${floor}-${col}`} 
              position={[-0.4 + col * 0.8, 0.7 + floor * 1.2, 0.76]}
            >
              <planeGeometry args={[0.5, 0.8]} />
              <meshStandardMaterial 
                color="#87CEEB" 
                roughness={0.1} 
                metalness={0.8}
                transparent
                opacity={0.6}
              />
            </mesh>
          ))
        )).flat()}
        
        {/* Roof garden */}
        <mesh position={[0, 3.55, 0]}>
          <boxGeometry args={[2.2, 0.1, 1.7]} />
          <meshStandardMaterial color="#228B22" roughness={0.9} />
        </mesh>
        
        {/* Construction crane */}
        <group position={[-1.5, 0, 0.5]}>
          <mesh position={[0, 0.75, 0]}>
            <boxGeometry args={[0.2, 1.5, 0.2]} />
            <meshStandardMaterial color="#FFCC00" />
          </mesh>
          <mesh position={[0.6, 1.5, 0]}>
            <boxGeometry args={[1.2, 0.1, 0.1]} />
            <meshStandardMaterial color="#FFCC00" />
          </mesh>
        </group>
      </group>
    </SpaceBase>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ASSOCIATIONS - Community Pavilion
// ═══════════════════════════════════════════════════════════════════════════════

export function AssociationsSpace() {
  const config = SPACES_CONFIG.associations;
  
  return (
    <SpaceBase spaceId="associations">
      <group>
        {/* Circular base */}
        <mesh position={[0, 0.25, 0]} castShadow>
          <cylinderGeometry args={[1.8, 2, 0.5, 8]} />
          <meshStandardMaterial color={config.color} roughness={0.5} metalness={0.2} />
        </mesh>
        
        {/* Central pillar */}
        <mesh position={[0, 1.75, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.4, 2.5, 16]} />
          <meshStandardMaterial color="#444444" roughness={0.4} metalness={0.4} />
        </mesh>
        
        {/* Roof */}
        <mesh position={[0, 3.5, 0]} castShadow>
          <coneGeometry args={[2.2, 1, 8]} />
          <meshStandardMaterial color={config.color} roughness={0.6} metalness={0.1} />
        </mesh>
        
        {/* Benches */}
        {[0, 1, 2, 3].map((i) => {
          const angle = (i / 4) * Math.PI * 2;
          return (
            <mesh 
              key={i}
              position={[Math.cos(angle) * 1.2, 0.6, Math.sin(angle) * 1.2]}
              rotation={[0, angle + Math.PI / 2, 0]}
            >
              <boxGeometry args={[0.8, 0.15, 0.3]} />
              <meshStandardMaterial color="#8B4513" roughness={0.8} />
            </mesh>
          );
        })}
        
        {/* People silhouettes */}
        {[-0.3, 0, 0.3].map((x, i) => (
          <mesh key={i} position={[x, 0.8, 0.3]}>
            <capsuleGeometry args={[0.1, 0.4, 4, 8]} />
            <meshStandardMaterial color="#333333" roughness={0.9} />
          </mesh>
        ))}
      </group>
    </SpaceBase>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CREATIVE STUDIO - Golden Open Cube
// ═══════════════════════════════════════════════════════════════════════════════

export function CreativeSpace() {
  const config = SPACES_CONFIG.creative;
  const iconsRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (iconsRef.current) {
      iconsRef.current.children.forEach((child, i) => {
        child.position.y = 2.2 + i * 0.2 + Math.sin(state.clock.elapsedTime * 1.5 + i) * 0.15;
        child.rotation.y = state.clock.elapsedTime * 0.5;
      });
    }
  });
  
  const splashColors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3'];
  
  return (
    <SpaceBase spaceId="creative">
      <group>
        {/* Bottom */}
        <mesh position={[0, 0.075, 0]} castShadow>
          <boxGeometry args={[2.5, 0.15, 2.5]} />
          <meshStandardMaterial color={config.color} roughness={0.3} metalness={0.7} />
        </mesh>
        
        {/* Back wall */}
        <mesh position={[0, 1.25, -1.25]} castShadow>
          <boxGeometry args={[2.5, 2.5, 0.15]} />
          <meshStandardMaterial color={config.color} roughness={0.3} metalness={0.7} />
        </mesh>
        
        {/* Left wall */}
        <mesh position={[-1.25, 1.25, 0]} castShadow>
          <boxGeometry args={[0.15, 2.5, 2.5]} />
          <meshStandardMaterial color={config.color} roughness={0.3} metalness={0.7} />
        </mesh>
        
        {/* Right wall */}
        <mesh position={[1.25, 1.25, 0]} castShadow>
          <boxGeometry args={[0.15, 2.5, 2.5]} />
          <meshStandardMaterial color={config.color} roughness={0.3} metalness={0.7} />
        </mesh>
        
        {/* Canvas */}
        <mesh position={[0, 1.3, -1.1]}>
          <planeGeometry args={[1.5, 1.2]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
        
        {/* Paint splashes */}
        {splashColors.map((color, i) => (
          <mesh 
            key={i} 
            position={[-0.5 + Math.random(), 0.8 + Math.random() * 0.8, -1.08]}
          >
            <circleGeometry args={[0.15 + Math.random() * 0.15, 8]} />
            <meshBasicMaterial color={color} />
          </mesh>
        ))}
        
        {/* Floating icons */}
        <group ref={iconsRef}>
          <mesh position={[-0.6, 2.2, 0]}>
            <boxGeometry args={[0.3, 0.3, 0.1]} />
            <meshBasicMaterial color="#FF6B6B" />
          </mesh>
          <mesh position={[0.6, 2.4, 0.3]}>
            <sphereGeometry args={[0.15, 8, 8]} />
            <meshBasicMaterial color="#4ECDC4" />
          </mesh>
          <mesh position={[0, 2.6, -0.3]}>
            <tetrahedronGeometry args={[0.2]} />
            <meshBasicMaterial color="#FFE66D" />
          </mesh>
        </group>
      </group>
    </SpaceBase>
  );
}
