/* =====================================================
   CHE·NU — XR Interactions
   
   Handles VR/AR interactions:
   - Controller raycasting to spheres
   - Hand tracking gestures
   - Haptic feedback
   - Selection and grab mechanics
   ===================================================== */

import React, { useRef, useCallback, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { 
  useXR, 
  useController, 
  useXREvent,
  XRInteractionEvent,
} from '@react-three/xr';
import * as THREE from 'three';

import {
  XRInteractionConfig,
  XRInteractionEvent as ChenuXREvent,
  XRHandedness,
  DEFAULT_XR_INTERACTION,
} from './xr.types';
import { Sphere3D, SphereCluster, UniverseNode } from '../universe3d/universe3d.types';

// ─────────────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────────────

export interface XRInteractionsProps {
  nodes: UniverseNode[];
  config?: Partial<XRInteractionConfig>;
  
  // Callbacks
  onSelect?: (nodeId: string, handedness: XRHandedness) => void;
  onHover?: (nodeId: string | null, handedness: XRHandedness) => void;
  onGrab?: (nodeId: string, handedness: XRHandedness) => void;
  onRelease?: (nodeId: string, handedness: XRHandedness) => void;
  onPinch?: (nodeId: string, handedness: XRHandedness) => void;
  
  // Visual options
  showRay?: boolean;
  rayColor?: string;
  rayHoverColor?: string;
}

// ─────────────────────────────────────────────────────
// RAYCASTER HELPER
// ─────────────────────────────────────────────────────

interface RaycastResult {
  nodeId: string;
  distance: number;
  point: THREE.Vector3;
}

function raycastToNodes(
  raycaster: THREE.Raycaster,
  nodes: UniverseNode[],
  scene: THREE.Scene
): RaycastResult | null {
  // Get all mesh objects that represent nodes
  const meshes: THREE.Object3D[] = [];
  
  scene.traverse((object) => {
    if (object.userData?.nodeId) {
      meshes.push(object);
    }
  });
  
  const intersects = raycaster.intersectObjects(meshes, true);
  
  if (intersects.length > 0) {
    const hit = intersects[0];
    let nodeId = hit.object.userData?.nodeId;
    
    // Walk up to find nodeId if not on direct hit
    if (!nodeId) {
      let parent = hit.object.parent;
      while (parent && !nodeId) {
        nodeId = parent.userData?.nodeId;
        parent = parent.parent;
      }
    }
    
    if (nodeId) {
      return {
        nodeId,
        distance: hit.distance,
        point: hit.point,
      };
    }
  }
  
  return null;
}

// ─────────────────────────────────────────────────────
// CONTROLLER RAY COMPONENT
// ─────────────────────────────────────────────────────

interface ControllerRayProps {
  handedness: 'left' | 'right';
  length: number;
  color: string;
  hoverColor: string;
  isHovering: boolean;
}

function ControllerRay({ 
  handedness, 
  length, 
  color, 
  hoverColor,
  isHovering 
}: ControllerRayProps) {
  const controller = useController(handedness);
  const lineRef = useRef<THREE.Line>(null);
  
  useFrame(() => {
    if (!controller || !lineRef.current) return;
    
    const positions = lineRef.current.geometry.attributes.position;
    positions.setXYZ(0, 0, 0, 0);
    positions.setXYZ(1, 0, 0, -length);
    positions.needsUpdate = true;
    
    // Update color based on hover
    const material = lineRef.current.material as THREE.LineBasicMaterial;
    material.color.set(isHovering ? hoverColor : color);
  });
  
  if (!controller) return null;
  
  return (
    <primitive object={controller.controller}>
      <line ref={lineRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([0, 0, 0, 0, 0, -length])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color={color} linewidth={2} />
      </line>
    </primitive>
  );
}

// ─────────────────────────────────────────────────────
// MAIN INTERACTIONS COMPONENT
// ─────────────────────────────────────────────────────

export function XRInteractions({
  nodes,
  config: configProp,
  onSelect,
  onHover,
  onGrab,
  onRelease,
  onPinch,
  showRay = true,
  rayColor = '#6366f1',
  rayHoverColor = '#fbbf24',
}: XRInteractionsProps) {
  const config = { ...DEFAULT_XR_INTERACTION, ...configProp };
  const { scene } = useThree();
  const { isPresenting } = useXR();
  
  const leftController = useController('left');
  const rightController = useController('right');
  
  // Hover state per controller
  const [leftHover, setLeftHover] = useState<string | null>(null);
  const [rightHover, setRightHover] = useState<string | null>(null);
  
  // Raycasters
  const leftRaycaster = useRef(new THREE.Raycaster());
  const rightRaycaster = useRef(new THREE.Raycaster());
  
  // Temp vectors
  const tempMatrix = useRef(new THREE.Matrix4());
  const tempDirection = useRef(new THREE.Vector3(0, 0, -1));
  
  // Update raycaster from controller
  const updateRaycaster = useCallback((
    controller: ReturnType<typeof useController>,
    raycaster: THREE.Raycaster
  ) => {
    if (!controller) return;
    
    tempMatrix.current.identity().extractRotation(controller.controller.matrixWorld);
    tempDirection.current.set(0, 0, -1).applyMatrix4(tempMatrix.current);
    
    raycaster.set(
      controller.controller.position,
      tempDirection.current
    );
    raycaster.far = config.rayLength || 10;
  }, [config.rayLength]);
  
  // Haptic feedback
  const triggerHaptic = useCallback((
    controller: ReturnType<typeof useController>,
    intensity: number = 0.5,
    duration: number = 50
  ) => {
    if (!config.hapticFeedback || !controller) return;
    
    const gamepad = controller.inputSource?.gamepad;
    if (gamepad?.hapticActuators?.[0]) {
      (gamepad.hapticActuators[0] as any).pulse(intensity, duration);
    }
  }, [config.hapticFeedback]);
  
  // Handle select event
  useXREvent('select', (event: XRInteractionEvent) => {
    const handedness = event.controller?.inputSource?.handedness as XRHandedness || 'none';
    const hoveredId = handedness === 'left' ? leftHover : rightHover;
    
    if (hoveredId && onSelect) {
      onSelect(hoveredId, handedness);
      triggerHaptic(
        handedness === 'left' ? leftController : rightController,
        config.hapticIntensity,
        config.hapticDuration
      );
    }
  });
  
  // Handle squeeze (grab)
  useXREvent('squeezestart', (event: XRInteractionEvent) => {
    const handedness = event.controller?.inputSource?.handedness as XRHandedness || 'none';
    const hoveredId = handedness === 'left' ? leftHover : rightHover;
    
    if (hoveredId && onGrab) {
      onGrab(hoveredId, handedness);
      triggerHaptic(
        handedness === 'left' ? leftController : rightController,
        0.8,
        100
      );
    }
  });
  
  useXREvent('squeezeend', (event: XRInteractionEvent) => {
    const handedness = event.controller?.inputSource?.handedness as XRHandedness || 'none';
    const hoveredId = handedness === 'left' ? leftHover : rightHover;
    
    if (hoveredId && onRelease) {
      onRelease(hoveredId, handedness);
    }
  });
  
  // Raycast every frame
  useFrame(() => {
    if (!isPresenting) return;
    
    // Left controller
    if (leftController) {
      updateRaycaster(leftController, leftRaycaster.current);
      const hit = raycastToNodes(leftRaycaster.current, nodes, scene);
      const newHover = hit?.nodeId || null;
      
      if (newHover !== leftHover) {
        setLeftHover(newHover);
        onHover?.(newHover, 'left');
        
        if (newHover && !leftHover) {
          // Just started hovering
          triggerHaptic(leftController, 0.2, 20);
        }
      }
    }
    
    // Right controller
    if (rightController) {
      updateRaycaster(rightController, rightRaycaster.current);
      const hit = raycastToNodes(rightRaycaster.current, nodes, scene);
      const newHover = hit?.nodeId || null;
      
      if (newHover !== rightHover) {
        setRightHover(newHover);
        onHover?.(newHover, 'right');
        
        if (newHover && !rightHover) {
          triggerHaptic(rightController, 0.2, 20);
        }
      }
    }
  });
  
  if (!isPresenting) return null;
  
  return (
    <>
      {/* Controller rays */}
      {showRay && (
        <>
          <ControllerRay
            handedness="left"
            length={config.rayLength || 10}
            color={rayColor}
            hoverColor={rayHoverColor}
            isHovering={!!leftHover}
          />
          <ControllerRay
            handedness="right"
            length={config.rayLength || 10}
            color={rayColor}
            hoverColor={rayHoverColor}
            isHovering={!!rightHover}
          />
        </>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────
// HAND TRACKING INTERACTIONS
// ─────────────────────────────────────────────────────

export interface XRHandInteractionsProps {
  nodes: UniverseNode[];
  onPinch?: (nodeId: string, handedness: XRHandedness) => void;
  onGrab?: (nodeId: string, handedness: XRHandedness) => void;
  pinchThreshold?: number;
}

export function XRHandInteractions({
  nodes,
  onPinch,
  onGrab,
  pinchThreshold = 0.8,
}: XRHandInteractionsProps) {
  const { isPresenting } = useXR();
  const [lastPinchLeft, setLastPinchLeft] = useState(false);
  const [lastPinchRight, setLastPinchRight] = useState(false);
  
  // Hand tracking is handled by @react-three/xr Hands component
  // This would need access to hand joint data for pinch detection
  
  useFrame(() => {
    if (!isPresenting) return;
    
    // TODO: Implement hand tracking pinch detection
    // Requires access to XRHand joint data
  });
  
  return null;
}

// ─────────────────────────────────────────────────────
// TELEPORT LOCOMOTION
// ─────────────────────────────────────────────────────

export interface XRTeleportProps {
  floorY?: number;
  maxDistance?: number;
  curvePoints?: number;
  validColor?: string;
  invalidColor?: string;
}

export function XRTeleport({
  floorY = 0,
  maxDistance = 10,
  curvePoints = 20,
  validColor = '#10b981',
  invalidColor = '#ef4444',
}: XRTeleportProps) {
  const rightController = useController('right');
  const { player, isPresenting } = useXR();
  const [teleportValid, setTeleportValid] = useState(false);
  const [teleportPoint, setTeleportPoint] = useState<THREE.Vector3 | null>(null);
  
  // Handle thumbstick for teleport
  useFrame(() => {
    if (!isPresenting || !rightController) return;
    
    const gamepad = rightController.inputSource?.gamepad;
    if (!gamepad) return;
    
    // Check if thumbstick pushed forward
    const axes = gamepad.axes;
    if (axes[3] < -0.5) { // Forward on right stick
      // Calculate teleport arc
      // Simplified: just raycast down from controller direction
      const direction = new THREE.Vector3(0, 0, -1);
      direction.applyQuaternion(rightController.controller.quaternion);
      
      const targetPoint = rightController.controller.position.clone()
        .add(direction.multiplyScalar(5));
      targetPoint.y = floorY;
      
      setTeleportPoint(targetPoint);
      setTeleportValid(targetPoint.distanceTo(rightController.controller.position) < maxDistance);
    } else {
      setTeleportPoint(null);
    }
  });
  
  // Execute teleport on trigger release
  useXREvent('selectend', () => {
    if (teleportValid && teleportPoint && player) {
      player.position.copy(teleportPoint);
      setTeleportPoint(null);
    }
  });
  
  if (!teleportPoint || !isPresenting) return null;
  
  return (
    <mesh position={teleportPoint}>
      <ringGeometry args={[0.3, 0.4, 32]} rotation-x={-Math.PI / 2} />
      <meshBasicMaterial 
        color={teleportValid ? validColor : invalidColor}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default XRInteractions;
