/* =====================================================
   CHE·NU — Camera Controller (React Three Fiber)
   
   Smooth camera transitions between:
   - FREE mode: Overview of universe, centered on origin
   - FOCUS mode: Zoom to specific sphere
   
   Uses lerp for cinematic transitions.
   ===================================================== */

import { useRef, useCallback } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Sphere3D, Vector3 } from './universe3d.types';

// ─────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────

export type FocusMode = 'free' | 'focus';

export interface Universe3DFocus {
  sphereId?: string;
  mode: FocusMode;
}

export interface CameraControllerProps {
  spheres: Sphere3D[];
  focus: Universe3DFocus;
  
  // Options
  freeDistance?: number;        // Distance from origin in free mode
  focusDistanceMultiplier?: number; // sphere.size * this + offset
  focusDistanceOffset?: number; // Added to focus distance
  lerpSpeedFree?: number;       // Transition speed in free mode
  lerpSpeedFocus?: number;      // Transition speed in focus mode
}

// ─────────────────────────────────────────────────────
// DEFAULTS
// ─────────────────────────────────────────────────────

const DEFAULT_FREE_DISTANCE = 18;
const DEFAULT_FOCUS_MULTIPLIER = 5;
const DEFAULT_FOCUS_OFFSET = 6;
const DEFAULT_LERP_FREE = 0.02;
const DEFAULT_LERP_FOCUS = 0.08;

// ─────────────────────────────────────────────────────
// CAMERA CONTROLLER COMPONENT
// ─────────────────────────────────────────────────────

export function CameraController({
  spheres,
  focus,
  freeDistance = DEFAULT_FREE_DISTANCE,
  focusDistanceMultiplier = DEFAULT_FOCUS_MULTIPLIER,
  focusDistanceOffset = DEFAULT_FOCUS_OFFSET,
  lerpSpeedFree = DEFAULT_LERP_FREE,
  lerpSpeedFocus = DEFAULT_LERP_FOCUS,
}: CameraControllerProps) {
  const { camera } = useThree();
  
  // Smooth interpolation targets
  const targetPosition = useRef(new THREE.Vector3(0, 0, freeDistance));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    const { mode, sphereId } = focus;
    
    if (mode === 'free' || !sphereId) {
      // 🌍 FREE MODE — stabilize towards origin overview
      targetPosition.current.lerp(
        new THREE.Vector3(0, 2, freeDistance),
        lerpSpeedFree
      );
      targetLookAt.current.lerp(
        new THREE.Vector3(0, 0, 0),
        lerpSpeedFree
      );
    } else {
      // 🎯 FOCUS MODE — zoom to sphere
      const sphere = spheres.find((s) => s.id === sphereId);
      if (!sphere) return;

      const focusPos = new THREE.Vector3(
        sphere.position[0],
        sphere.position[1],
        sphere.position[2]
      );

      // Calculate camera distance based on sphere size
      const distance = sphere.size * focusDistanceMultiplier + focusDistanceOffset;

      // Position camera behind and slightly above sphere
      const cameraOffset = new THREE.Vector3(0, distance * 0.2, distance);
      
      targetPosition.current.lerp(
        focusPos.clone().add(cameraOffset),
        lerpSpeedFocus
      );
      targetLookAt.current.lerp(focusPos, lerpSpeedFocus);
    }

    // Apply camera transform
    camera.position.copy(targetPosition.current);
    camera.lookAt(targetLookAt.current);
  });

  return null;
}

// ─────────────────────────────────────────────────────
// HOOK FOR FOCUS STATE
// ─────────────────────────────────────────────────────

import { useState } from 'react';

export interface UseCameraFocusReturn {
  focus: Universe3DFocus;
  setFocus: (focus: Universe3DFocus) => void;
  focusOn: (sphereId: string) => void;
  clearFocus: () => void;
  toggleFocus: (sphereId: string) => void;
  isFocused: (sphereId: string) => boolean;
}

export function useCameraFocus(
  initialFocus: Universe3DFocus = { mode: 'free' }
): UseCameraFocusReturn {
  const [focus, setFocus] = useState<Universe3DFocus>(initialFocus);

  const focusOn = useCallback((sphereId: string) => {
    setFocus({ mode: 'focus', sphereId });
  }, []);

  const clearFocus = useCallback(() => {
    setFocus({ mode: 'free', sphereId: undefined });
  }, []);

  const toggleFocus = useCallback((sphereId: string) => {
    setFocus(prev => {
      if (prev.mode === 'focus' && prev.sphereId === sphereId) {
        return { mode: 'free', sphereId: undefined };
      }
      return { mode: 'focus', sphereId };
    });
  }, []);

  const isFocused = useCallback((sphereId: string) => {
    return focus.mode === 'focus' && focus.sphereId === sphereId;
  }, [focus]);

  return {
    focus,
    setFocus,
    focusOn,
    clearFocus,
    toggleFocus,
    isFocused,
  };
}

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default CameraController;
