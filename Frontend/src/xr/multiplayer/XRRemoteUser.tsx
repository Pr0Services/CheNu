/* =====================================================
   CHE·NU — XR Remote User Component
   
   Displays remote users in VR/AR space.
   ===================================================== */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Billboard } from '@react-three/drei';
import * as THREE from 'three';

import { MultiplayerUser, HandPose } from './multiplayer.types';

// ─────────────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────────────

export interface XRRemoteUserProps {
  user: MultiplayerUser;
  showName?: boolean;
  showHands?: boolean;
  showVoiceIndicator?: boolean;
  interpolate?: boolean;
  interpolationSpeed?: number;
}

// ─────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────

export function XRRemoteUser({
  user,
  showName = true,
  showHands = true,
  showVoiceIndicator = true,
  interpolate = true,
  interpolationSpeed = 10,
}: XRRemoteUserProps) {
  const groupRef = useRef<THREE.Group>(null);
  const targetPosition = useRef(new THREE.Vector3(...user.position));
  const targetQuaternion = useRef(new THREE.Quaternion(...user.rotation));

  // Update targets when user position changes
  useMemo(() => {
    targetPosition.current.set(...user.position);
    targetQuaternion.current.set(...user.rotation);
  }, [user.position, user.rotation]);

  // Smooth interpolation
  useFrame((_, delta) => {
    if (!groupRef.current || !interpolate) return;

    groupRef.current.position.lerp(targetPosition.current, interpolationSpeed * delta);
    groupRef.current.quaternion.slerp(targetQuaternion.current, interpolationSpeed * delta);
  });

  return (
    <group
      ref={groupRef}
      position={user.position}
      quaternion={new THREE.Quaternion(...user.rotation)}
    >
      {/* Avatar body */}
      <RemoteUserAvatar user={user} />

      {/* Name tag */}
      {showName && (
        <RemoteUserNameTag
          name={user.name}
          color={user.color}
          isHost={user.isHost}
        />
      )}

      {/* Voice indicator */}
      {showVoiceIndicator && user.isSpeaking && (
        <VoiceIndicator
          audioLevel={user.audioLevel}
          color={user.color}
        />
      )}

      {/* Hands */}
      {showHands && (
        <>
          {user.leftHand && (
            <RemoteHand
              pose={user.leftHand}
              hand="left"
              color={user.color}
            />
          )}
          {user.rightHand && (
            <RemoteHand
              pose={user.rightHand}
              hand="right"
              color={user.color}
            />
          )}
        </>
      )}

      {/* Pointing ray */}
      {user.rightHand?.isPointing && user.rightHand.pointTarget && (
        <PointingRay
          start={user.rightHand.position}
          end={user.rightHand.pointTarget}
          color={user.color}
        />
      )}
    </group>
  );
}

// ─────────────────────────────────────────────────────
// AVATAR
// ─────────────────────────────────────────────────────

function RemoteUserAvatar({ user }: { user: MultiplayerUser }) {
  const headRef = useRef<THREE.Mesh>(null);

  // Subtle idle animation
  useFrame((state) => {
    if (!headRef.current) return;
    headRef.current.position.y = 0.05 + Math.sin(state.clock.elapsedTime * 2) * 0.01;
  });

  return (
    <group>
      {/* Body (simple capsule) */}
      <mesh position={[0, -0.4, 0]}>
        <capsuleGeometry args={[0.15, 0.5, 8, 16]} />
        <meshStandardMaterial
          color={user.color}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Head */}
      <mesh ref={headRef} position={[0, 0.05, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color={user.color} />
      </mesh>

      {/* Face indicator (direction) */}
      <mesh position={[0, 0.05, 0.1]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Avatar initials or photo */}
      <Billboard position={[0, 0.05, 0.13]}>
        <Html
          center
          distanceFactor={10}
          style={{ pointerEvents: 'none' }}
        >
          <div style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: user.avatar.type === 'photo' && user.avatar.url
              ? `url(${user.avatar.url}) center/cover`
              : user.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: 20,
            fontWeight: 600,
            border: `3px solid ${user.color}`,
          }}>
            {user.avatar.type !== 'photo' && user.avatar.initials}
          </div>
        </Html>
      </Billboard>
    </group>
  );
}

// ─────────────────────────────────────────────────────
// NAME TAG
// ─────────────────────────────────────────────────────

function RemoteUserNameTag({
  name,
  color,
  isHost,
}: {
  name: string;
  color: string;
  isHost: boolean;
}) {
  return (
    <Billboard position={[0, 0.35, 0]}>
      <Html
        center
        distanceFactor={8}
        style={{ pointerEvents: 'none' }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 10px',
          borderRadius: 12,
          background: 'rgba(0,0,0,0.7)',
          color: '#fff',
          fontSize: 12,
          whiteSpace: 'nowrap',
        }}>
          {isHost && <span>👑</span>}
          <span style={{ color }}>{name}</span>
        </div>
      </Html>
    </Billboard>
  );
}

// ─────────────────────────────────────────────────────
// VOICE INDICATOR
// ─────────────────────────────────────────────────────

function VoiceIndicator({
  audioLevel,
  color,
}: {
  audioLevel: number;
  color: string;
}) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!ringRef.current) return;
    const scale = 1 + audioLevel * 0.5;
    ringRef.current.scale.setScalar(scale);
  });

  return (
    <mesh ref={ringRef} position={[0, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.18, 0.22, 32]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.6}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// ─────────────────────────────────────────────────────
// REMOTE HAND
// ─────────────────────────────────────────────────────

function RemoteHand({
  pose,
  hand,
  color,
}: {
  pose: HandPose;
  hand: 'left' | 'right';
  color: string;
}) {
  return (
    <group
      position={pose.position}
      quaternion={new THREE.Quaternion(...pose.rotation)}
    >
      {/* Simple hand representation */}
      <mesh>
        <boxGeometry args={[0.08, 0.02, 0.1]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Gesture indicator */}
      {pose.gesture && (
        <Billboard position={[0, 0.05, 0]}>
          <Html center distanceFactor={15} style={{ pointerEvents: 'none' }}>
            <span style={{ fontSize: 16 }}>
              {pose.gesture === 'point' ? '👆' : 
               pose.gesture === 'grab' ? '✊' :
               pose.gesture === 'wave' ? '👋' : '🖐️'}
            </span>
          </Html>
        </Billboard>
      )}
    </group>
  );
}

// ─────────────────────────────────────────────────────
// POINTING RAY
// ─────────────────────────────────────────────────────

function PointingRay({
  start,
  end,
  color,
}: {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
}) {
  const points = useMemo(() => {
    return [
      new THREE.Vector3(...start),
      new THREE.Vector3(...end),
    ];
  }, [start, end]);

  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return geometry;
  }, [points]);

  return (
    <group>
      <line geometry={lineGeometry}>
        <lineBasicMaterial color={color} transparent opacity={0.5} />
      </line>

      {/* End point indicator */}
      <mesh position={end}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────────────
// USER LIST PANEL
// ─────────────────────────────────────────────────────

export interface XRUserListPanelProps {
  users: MultiplayerUser[];
  localUserId?: string;
  position?: [number, number, number];
  onKick?: (userId: string) => void;
}

export function XRUserListPanel({
  users,
  localUserId,
  position = [-1.5, 1.5, -2],
  onKick,
}: XRUserListPanelProps) {
  return (
    <group position={position}>
      <Billboard>
        <Html
          center
          distanceFactor={6}
          style={{ pointerEvents: 'auto' }}
        >
          <div style={{
            width: 200,
            padding: 12,
            borderRadius: 12,
            background: 'rgba(0,0,0,0.85)',
            color: '#fff',
          }}>
            <div style={{
              fontSize: 14,
              fontWeight: 600,
              marginBottom: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}>
              👥 Participants ({users.length})
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {users.map(user => (
                <div
                  key={user.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: 6,
                    borderRadius: 6,
                    background: user.id === localUserId 
                      ? 'rgba(99,102,241,0.3)' 
                      : 'rgba(255,255,255,0.05)',
                  }}
                >
                  <div style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: user.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 10,
                    fontWeight: 600,
                  }}>
                    {user.avatar.initials}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 500 }}>
                      {user.isHost && '👑 '}
                      {user.name}
                      {user.id === localUserId && ' (vous)'}
                    </div>
                    <div style={{ fontSize: 10, opacity: 0.6 }}>
                      {user.isSpeaking ? '🎤 Parle...' : 
                       user.isMuted ? '🔇 Muet' :
                       user.status}
                    </div>
                  </div>

                  {onKick && user.id !== localUserId && (
                    <button
                      onClick={() => onKick(user.id)}
                      style={{
                        background: 'rgba(239,68,68,0.2)',
                        border: 'none',
                        borderRadius: 4,
                        padding: '2px 6px',
                        color: '#ef4444',
                        fontSize: 10,
                        cursor: 'pointer',
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Html>
      </Billboard>
    </group>
  );
}

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default XRRemoteUser;
