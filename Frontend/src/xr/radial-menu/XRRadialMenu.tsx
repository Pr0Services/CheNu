/* =====================================================
   CHE·NU — XR Radial Menu Component
   
   Circular menu display for VR/AR.
   ===================================================== */

import React, { useMemo, useState, useEffect } from 'react';
import { Html, Billboard } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import {
  RadialMenuItem,
  RadialMenuConfig,
  RadialMenuState,
  DEFAULT_RADIAL_CONFIG,
  calculateItemAngles,
} from './radialMenu.types';

// ─────────────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────────────

export interface XRRadialMenuProps {
  state: RadialMenuState;
  config?: Partial<RadialMenuConfig>;
  onHover: (index: number | null) => void;
  onSelect: (index: number) => void;
  onClose: () => void;
  onBack?: () => void;
}

// ─────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────

export function XRRadialMenu({
  state,
  config: configOverride,
  onHover,
  onSelect,
  onClose,
  onBack,
}: XRRadialMenuProps) {
  const config: RadialMenuConfig = {
    ...DEFAULT_RADIAL_CONFIG,
    ...configOverride,
  };

  const [animationProgress, setAnimationProgress] = useState(0);

  // Open animation
  useEffect(() => {
    if (!state.isOpen) {
      setAnimationProgress(0);
      return;
    }

    const duration = config.animationDuration;
    const start = Date.now();

    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      setAnimationProgress(easeOutBack(progress));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [state.isOpen, config.animationDuration]);

  if (!state.isOpen) return null;

  const scale = animationProgress;
  const opacity = animationProgress;

  return (
    <group position={state.position} scale={scale}>
      {/* Background disc */}
      <mesh rotation={[0, 0, 0]}>
        <ringGeometry args={[
          config.innerRadius - 0.02,
          config.outerRadius + 0.02,
          64,
        ]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={opacity * 0.5}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Items */}
      {state.items.map((item, index) => (
        <RadialMenuItemComponent
          key={item.id}
          item={item}
          index={index}
          totalItems={state.items.length}
          config={config}
          isHovered={state.hoveredIndex === index}
          isSelected={state.selectedIndex === index}
          opacity={opacity}
          onHover={() => onHover(index)}
          onHoverEnd={() => onHover(null)}
          onSelect={() => onSelect(index)}
        />
      ))}

      {/* Center button */}
      {config.showCenter && (
        <CenterButton
          icon={onBack && state.menuStack.length > 0 ? '⬅️' : config.centerIcon || '✕'}
          label={onBack && state.menuStack.length > 0 ? 'Retour' : config.centerLabel}
          radius={config.innerRadius - 0.03}
          config={config}
          opacity={opacity}
          onClick={onBack && state.menuStack.length > 0 ? onBack : onClose}
        />
      )}
    </group>
  );
}

// ─────────────────────────────────────────────────────
// MENU ITEM
// ─────────────────────────────────────────────────────

interface RadialMenuItemComponentProps {
  item: RadialMenuItem;
  index: number;
  totalItems: number;
  config: RadialMenuConfig;
  isHovered: boolean;
  isSelected: boolean;
  opacity: number;
  onHover: () => void;
  onHoverEnd: () => void;
  onSelect: () => void;
}

function RadialMenuItemComponent({
  item,
  index,
  totalItems,
  config,
  isHovered,
  isSelected,
  opacity,
  onHover,
  onHoverEnd,
  onSelect,
}: RadialMenuItemComponentProps) {
  const { startAngle, endAngle, centerAngle } = useMemo(
    () => calculateItemAngles(index, totalItems, config),
    [index, totalItems, config]
  );

  // Convert to radians
  const startRad = (startAngle * Math.PI) / 180;
  const endRad = (endAngle * Math.PI) / 180;
  const centerRad = (centerAngle * Math.PI) / 180;

  // Calculate arc shape
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    
    const innerR = config.innerRadius;
    const outerR = config.outerRadius;
    
    // Start from inner arc
    s.moveTo(
      Math.cos(startRad) * innerR,
      Math.sin(startRad) * innerR
    );
    
    // Line to outer arc start
    s.lineTo(
      Math.cos(startRad) * outerR,
      Math.sin(startRad) * outerR
    );
    
    // Outer arc
    s.absarc(0, 0, outerR, startRad, endRad, false);
    
    // Line to inner arc end
    s.lineTo(
      Math.cos(endRad) * innerR,
      Math.sin(endRad) * innerR
    );
    
    // Inner arc (reverse)
    s.absarc(0, 0, innerR, endRad, startRad, true);
    
    return s;
  }, [config.innerRadius, config.outerRadius, startRad, endRad]);

  // Colors
  const backgroundColor = item.disabled
    ? config.disabledColor
    : isSelected
      ? config.selectedColor
      : isHovered
        ? config.hoverColor
        : item.backgroundColor || config.backgroundColor;

  // Icon position
  const iconRadius = (config.innerRadius + config.outerRadius) / 2;
  const iconX = Math.cos(centerRad) * iconRadius;
  const iconY = Math.sin(centerRad) * iconRadius;

  // Label position
  const labelRadius = config.outerRadius + 0.05;
  const labelX = Math.cos(centerRad) * labelRadius;
  const labelY = Math.sin(centerRad) * labelRadius;

  return (
    <group>
      {/* Arc segment */}
      <mesh
        onPointerEnter={onHover}
        onPointerLeave={onHoverEnd}
        onClick={onSelect}
      >
        <shapeGeometry args={[shape]} />
        <meshBasicMaterial
          color={backgroundColor}
          transparent
          opacity={opacity * (item.disabled ? 0.5 : 1)}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Hover highlight */}
      {isHovered && !item.disabled && (
        <mesh>
          <shapeGeometry args={[shape]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Icon */}
      <Billboard position={[iconX, iconY, 0.01]}>
        <Html
          center
          distanceFactor={5}
          style={{ pointerEvents: 'none' }}
        >
          <div style={{
            fontSize: config.iconSize,
            opacity: item.disabled ? 0.5 : 1,
            filter: isHovered ? 'brightness(1.2)' : 'none',
            transition: 'filter 0.15s',
          }}>
            {item.icon}
          </div>
        </Html>
      </Billboard>

      {/* Label */}
      {config.showLabels && (
        <Billboard position={[labelX, labelY, 0.01]}>
          <Html
            center
            distanceFactor={6}
            style={{ pointerEvents: 'none' }}
          >
            <div style={{
              fontSize: config.fontSize,
              color: config.textColor,
              opacity: (isHovered ? 1 : 0.7) * (item.disabled ? 0.5 : 1),
              whiteSpace: 'nowrap',
              textShadow: '0 1px 3px rgba(0,0,0,0.5)',
              fontWeight: isHovered ? 600 : 400,
              transition: 'all 0.15s',
            }}>
              {item.label}
            </div>
          </Html>
        </Billboard>
      )}

      {/* Badge */}
      {item.badge && (
        <Billboard position={[iconX + 0.03, iconY + 0.03, 0.02]}>
          <Html
            center
            distanceFactor={8}
            style={{ pointerEvents: 'none' }}
          >
            <div style={{
              padding: '2px 6px',
              borderRadius: 10,
              background: '#ef4444',
              color: '#ffffff',
              fontSize: 10,
              fontWeight: 600,
            }}>
              {item.badge}
            </div>
          </Html>
        </Billboard>
      )}

      {/* Submenu indicator */}
      {item.children && item.children.length > 0 && (
        <Billboard position={[iconX + 0.04, iconY - 0.02, 0.02]}>
          <Html
            center
            distanceFactor={8}
            style={{ pointerEvents: 'none' }}
          >
            <div style={{ fontSize: 10, opacity: 0.7 }}>▶</div>
          </Html>
        </Billboard>
      )}
    </group>
  );
}

// ─────────────────────────────────────────────────────
// CENTER BUTTON
// ─────────────────────────────────────────────────────

interface CenterButtonProps {
  icon?: string;
  label?: string;
  radius: number;
  config: RadialMenuConfig;
  opacity: number;
  onClick: () => void;
}

function CenterButton({
  icon = '✕',
  label,
  radius,
  config,
  opacity,
  onClick,
}: CenterButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <group>
      <mesh
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
        onClick={onClick}
      >
        <circleGeometry args={[radius, 32]} />
        <meshBasicMaterial
          color={isHovered ? config.hoverColor : config.backgroundColor}
          transparent
          opacity={opacity}
        />
      </mesh>

      <Billboard position={[0, 0, 0.01]}>
        <Html
          center
          distanceFactor={5}
          style={{ pointerEvents: 'none' }}
        >
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}>
            <span style={{
              fontSize: config.iconSize * 0.8,
              opacity: isHovered ? 1 : 0.8,
            }}>
              {icon}
            </span>
            {label && (
              <span style={{
                fontSize: config.fontSize - 2,
                color: config.textColor,
                opacity: 0.7,
              }}>
                {label}
              </span>
            )}
          </div>
        </Html>
      </Billboard>
    </group>
  );
}

// ─────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────

function easeOutBack(t: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default XRRadialMenu;
