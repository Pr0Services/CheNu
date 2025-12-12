/* =====================================================
   CHE·NU — XR Gesture Indicator
   
   Visual feedback for detected gestures in VR/AR.
   Shows current pose, gesture recognition status.
   ===================================================== */

import React, { useMemo } from 'react';
import { Html, Billboard } from '@react-three/drei';
import * as THREE from 'three';

import {
  Hand,
  GesturePose,
  GestureMotion,
  GestureFeedbackConfig,
  DEFAULT_FEEDBACK_CONFIG,
} from './gesture.types';
import { GESTURE_POSES } from './gesturePoses';
import { GESTURE_MOTIONS } from './gestureMotions';

// ─────────────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────────────

export interface XRGestureIndicatorProps {
  hand: Hand;
  position: [number, number, number];
  currentPose: GesturePose | null;
  currentMotion?: GestureMotion | null;
  confidence: number;
  isActive: boolean;
  config?: Partial<GestureFeedbackConfig>;
}

// ─────────────────────────────────────────────────────
// POSE ICONS
// ─────────────────────────────────────────────────────

const POSE_ICONS: Record<GesturePose, string> = {
  open_hand: '🖐️',
  fist: '✊',
  point: '👆',
  thumbs_up: '👍',
  thumbs_down: '👎',
  peace: '✌️',
  ok: '👌',
  pinch: '🤏',
  grab: '🤲',
  phone: '🤙',
  rock: '🤘',
  gun: '👉',
  l_shape: '🤙',
  palm_up: '🖐️',
  palm_down: '🖐️',
  stop: '✋',
  wave: '👋',
};

const MOTION_ICONS: Record<GestureMotion, string> = {
  swipe_left: '👈',
  swipe_right: '👉',
  swipe_up: '👆',
  swipe_down: '👇',
  push: '🤚',
  pull: '🤏',
  rotate_cw: '🔃',
  rotate_ccw: '🔄',
  wave: '👋',
  pinch_in: '🤏',
  pinch_out: '🤲',
  grab_pull: '✊',
  throw: '🤾',
  tap: '👆',
  double_tap: '👆👆',
  hold: '✊',
};

// ─────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────

export function XRGestureIndicator({
  hand,
  position,
  currentPose,
  currentMotion,
  confidence,
  isActive,
  config: configOverride,
}: XRGestureIndicatorProps) {
  const config: GestureFeedbackConfig = {
    ...DEFAULT_FEEDBACK_CONFIG,
    ...configOverride,
  };

  if (!config.showGestureIndicator || !isActive) {
    return null;
  }

  const gesture = currentMotion || currentPose;
  const icon = currentMotion 
    ? MOTION_ICONS[currentMotion] 
    : currentPose 
      ? POSE_ICONS[currentPose] 
      : '❓';

  const label = currentMotion
    ? GESTURE_MOTIONS[currentMotion]?.nameFr
    : currentPose
      ? GESTURE_POSES[currentPose]?.nameFr
      : null;

  return (
    <group position={position}>
      {/* Background glow */}
      <mesh>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial
          color={config.indicatorColor}
          transparent
          opacity={0.3 * confidence}
        />
      </mesh>

      {/* Confidence ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.045, 0.055, 32, 1, 0, Math.PI * 2 * confidence]} />
        <meshBasicMaterial
          color={config.indicatorColor}
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Label */}
      <Billboard>
        <Html
          center
          distanceFactor={8}
          style={{
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            padding: '6px 10px',
            borderRadius: 8,
            background: 'rgba(0,0,0,0.75)',
            color: '#fff',
            fontSize: 12,
            whiteSpace: 'nowrap',
          }}>
            <span style={{ fontSize: 24 }}>{icon}</span>
            {label && (
              <span style={{ opacity: 0.8 }}>{label}</span>
            )}
            <span style={{
              fontSize: 10,
              opacity: 0.6,
            }}>
              {Math.round(confidence * 100)}%
            </span>
          </div>
        </Html>
      </Billboard>
    </group>
  );
}

// ─────────────────────────────────────────────────────
// GESTURE TRAIL
// ─────────────────────────────────────────────────────

export interface XRGestureTrailProps {
  points: [number, number, number][];
  color?: string;
  opacity?: number;
  width?: number;
}

export function XRGestureTrail({
  points,
  color = '#8b5cf6',
  opacity = 0.6,
  width = 0.01,
}: XRGestureTrailProps) {
  const curve = useMemo(() => {
    if (points.length < 2) return null;
    
    const vectors = points.map(p => new THREE.Vector3(p[0], p[1], p[2]));
    return new THREE.CatmullRomCurve3(vectors);
  }, [points]);

  if (!curve || points.length < 2) return null;

  return (
    <mesh>
      <tubeGeometry args={[curve, 64, width, 8, false]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
      />
    </mesh>
  );
}

// ─────────────────────────────────────────────────────
// HAND SKELETON
// ─────────────────────────────────────────────────────

export interface XRHandSkeletonProps {
  hand: Hand;
  joints: Map<string, { position: [number, number, number] }>;
  color?: string;
  opacity?: number;
}

export function XRHandSkeleton({
  hand,
  joints,
  color = '#ffffff',
  opacity = 0.6,
}: XRHandSkeletonProps) {
  // Connection pairs for skeleton
  const connections = [
    ['wrist', 'thumb-metacarpal'],
    ['thumb-metacarpal', 'thumb-phalanx-proximal'],
    ['thumb-phalanx-proximal', 'thumb-phalanx-distal'],
    ['thumb-phalanx-distal', 'thumb-tip'],
    
    ['wrist', 'index-finger-metacarpal'],
    ['index-finger-metacarpal', 'index-finger-phalanx-proximal'],
    ['index-finger-phalanx-proximal', 'index-finger-phalanx-intermediate'],
    ['index-finger-phalanx-intermediate', 'index-finger-phalanx-distal'],
    ['index-finger-phalanx-distal', 'index-finger-tip'],
    
    // ... more connections for other fingers
  ];

  return (
    <group>
      {/* Joint spheres */}
      {Array.from(joints.entries()).map(([name, joint]) => (
        <mesh key={name} position={joint.position}>
          <sphereGeometry args={[0.005, 8, 8]} />
          <meshBasicMaterial color={color} transparent opacity={opacity} />
        </mesh>
      ))}

      {/* Connection lines */}
      {connections.map(([from, to], i) => {
        const fromJoint = joints.get(from);
        const toJoint = joints.get(to);
        if (!fromJoint || !toJoint) return null;

        const start = new THREE.Vector3(...fromJoint.position);
        const end = new THREE.Vector3(...toJoint.position);

        return (
          <line key={i}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([...fromJoint.position, ...toJoint.position])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color={color} transparent opacity={opacity * 0.5} />
          </line>
        );
      })}
    </group>
  );
}

// ─────────────────────────────────────────────────────
// GESTURE HINT
// ─────────────────────────────────────────────────────

export interface XRGestureHintProps {
  gesture: GesturePose | GestureMotion;
  position: [number, number, number];
  visible: boolean;
}

export function XRGestureHint({
  gesture,
  position,
  visible,
}: XRGestureHintProps) {
  if (!visible) return null;

  const isPose = gesture in GESTURE_POSES;
  const icon = isPose 
    ? POSE_ICONS[gesture as GesturePose]
    : MOTION_ICONS[gesture as GestureMotion];
  const label = isPose
    ? GESTURE_POSES[gesture as GesturePose]?.nameFr
    : GESTURE_MOTIONS[gesture as GestureMotion]?.nameFr;

  return (
    <group position={position}>
      <Billboard>
        <Html
          center
          distanceFactor={10}
          style={{
            pointerEvents: 'none',
          }}
        >
          <div style={{
            padding: '12px 20px',
            borderRadius: 12,
            background: 'linear-gradient(135deg, rgba(99,102,241,0.9), rgba(139,92,246,0.9))',
            color: '#fff',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>{icon}</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{label}</div>
            <div style={{ fontSize: 11, opacity: 0.8, marginTop: 4 }}>
              Faites ce geste
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

export default XRGestureIndicator;
