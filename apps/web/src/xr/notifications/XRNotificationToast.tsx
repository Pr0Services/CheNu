/* =====================================================
   CHE·NU — XR Notification Toast
   
   Spatial 3D notification display for VR/AR.
   ===================================================== */

import React, { useState, useEffect, useMemo } from 'react';
import { Html, Billboard } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import {
  XRNotification,
  NotificationTheme,
  DEFAULT_NOTIFICATION_THEME,
  NOTIFICATION_ICONS,
} from './notification.types';

// ─────────────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────────────

export interface XRNotificationToastProps {
  notification: XRNotification;
  index: number;
  onDismiss: (id: string) => void;
  onAction: (notificationId: string, actionId: string) => void;
  theme?: Partial<NotificationTheme>;
  stackDirection?: 'up' | 'down';
  spacing?: number;
}

// ─────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────

export function XRNotificationToast({
  notification,
  index,
  onDismiss,
  onAction,
  theme: themeOverride,
  stackDirection = 'down',
  spacing = 0.15,
}: XRNotificationToastProps) {
  const theme: NotificationTheme = {
    ...DEFAULT_NOTIFICATION_THEME,
    ...themeOverride,
  };

  const [animationProgress, setAnimationProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Animation
  useEffect(() => {
    const duration = 300;
    const start = Date.now();

    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      setAnimationProgress(easeOutCubic(progress));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, []);

  // Exit animation
  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      onDismiss(notification.id);
    }, 200);
  };

  // Calculate position
  const yOffset = index * spacing * (stackDirection === 'down' ? -1 : 1);
  const xOffset = isExiting ? 0.3 : 0;
  const opacity = isExiting ? 0 : animationProgress;

  const colors = theme.colors[notification.type];
  const icon = notification.icon || NOTIFICATION_ICONS[notification.type];

  return (
    <group position={[xOffset * animationProgress, yOffset, 0]}>
      <Billboard>
        <Html
          center
          distanceFactor={8}
          style={{
            opacity,
            transform: `translateX(${(1 - animationProgress) * 100}px)`,
            transition: isExiting ? 'all 0.2s ease-in' : 'none',
            pointerEvents: 'auto',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              padding: theme.padding,
              borderRadius: theme.borderRadius,
              background: colors.background,
              border: `1px solid ${colors.border}`,
              color: colors.text,
              minWidth: 280,
              maxWidth: 360,
              boxShadow: theme.shadow ? '0 4px 20px rgba(0,0,0,0.3)' : 'none',
              backdropFilter: theme.backdrop ? `blur(${theme.backdropBlur}px)` : 'none',
              cursor: 'pointer',
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Icon */}
            <div style={{
              fontSize: theme.iconSize,
              flexShrink: 0,
            }}>
              {icon}
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontWeight: 600,
                fontSize: theme.fontSize,
                marginBottom: notification.message ? 4 : 0,
              }}>
                {notification.title}
              </div>
              
              {notification.message && (
                <div style={{
                  fontSize: theme.fontSize - 2,
                  opacity: 0.85,
                  lineHeight: 1.4,
                }}>
                  {notification.message}
                </div>
              )}

              {/* Actions */}
              {notification.actions && notification.actions.length > 0 && (
                <div style={{
                  display: 'flex',
                  gap: 8,
                  marginTop: 12,
                }}>
                  {notification.actions.map(action => (
                    <button
                      key={action.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        action.action();
                        onAction(notification.id, action.id);
                      }}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 6,
                        border: 'none',
                        background: action.variant === 'primary' 
                          ? 'rgba(255,255,255,0.2)'
                          : action.variant === 'danger'
                            ? 'rgba(239,68,68,0.3)'
                            : 'rgba(255,255,255,0.1)',
                        color: colors.text,
                        fontSize: 12,
                        fontWeight: 500,
                        cursor: 'pointer',
                      }}
                    >
                      {action.icon && <span style={{ marginRight: 4 }}>{action.icon}</span>}
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dismiss button */}
            {notification.dismissible && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDismiss();
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: colors.text,
                  opacity: isHovered ? 1 : 0.5,
                  cursor: 'pointer',
                  padding: 4,
                  fontSize: 16,
                  transition: 'opacity 0.2s',
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Progress bar for timed notifications */}
          {notification.duration > 0 && (
            <NotificationProgress
              duration={notification.duration}
              createdAt={notification.createdAt}
              isPaused={isHovered}
              color={colors.border}
            />
          )}
        </Html>
      </Billboard>
    </group>
  );
}

// ─────────────────────────────────────────────────────
// PROGRESS BAR
// ─────────────────────────────────────────────────────

function NotificationProgress({
  duration,
  createdAt,
  isPaused,
  color,
}: {
  duration: number;
  createdAt: number;
  isPaused: boolean;
  color: string;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isPaused) return;

    const update = () => {
      const elapsed = Date.now() - createdAt;
      setProgress(Math.min(elapsed / duration, 1));
    };

    const interval = setInterval(update, 50);
    return () => clearInterval(interval);
  }, [duration, createdAt, isPaused]);

  return (
    <div style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 3,
      background: 'rgba(255,255,255,0.1)',
      borderRadius: '0 0 12px 12px',
      overflow: 'hidden',
    }}>
      <div style={{
        width: `${(1 - progress) * 100}%`,
        height: '100%',
        background: color,
        transition: isPaused ? 'none' : 'width 0.05s linear',
      }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────
// NOTIFICATION CONTAINER
// ─────────────────────────────────────────────────────

export interface XRNotificationContainerProps {
  notifications: XRNotification[];
  position?: [number, number, number];
  onDismiss: (id: string) => void;
  onAction: (notificationId: string, actionId: string) => void;
  theme?: Partial<NotificationTheme>;
  stackDirection?: 'up' | 'down';
  spacing?: number;
}

export function XRNotificationContainer({
  notifications,
  position = [0, 1.5, -2],
  onDismiss,
  onAction,
  theme,
  stackDirection = 'down',
  spacing = 0.15,
}: XRNotificationContainerProps) {
  return (
    <group position={position}>
      {notifications.map((notification, index) => (
        <XRNotificationToast
          key={notification.id}
          notification={notification}
          index={index}
          onDismiss={onDismiss}
          onAction={onAction}
          theme={theme}
          stackDirection={stackDirection}
          spacing={spacing}
        />
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────────────
// SPATIAL NOTIFICATION
// ─────────────────────────────────────────────────────

export interface XRSpatialNotificationProps {
  notification: XRNotification;
  onDismiss: (id: string) => void;
}

export function XRSpatialNotification({
  notification,
  onDismiss,
}: XRSpatialNotificationProps) {
  const position = notification.spatialPosition || [0, 1.5, -2];
  const colors = DEFAULT_NOTIFICATION_THEME.colors[notification.type];
  const icon = notification.icon || NOTIFICATION_ICONS[notification.type];

  // Pulsing animation
  const [scale, setScale] = useState(1);
  
  useFrame((state) => {
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.05;
    setScale(pulse);
  });

  return (
    <group position={position}>
      {/* Glow sphere */}
      <mesh scale={scale * 0.15}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial
          color={colors.border}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Core */}
      <mesh scale={0.08}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color={colors.background.replace('0.9)', '1)')} />
      </mesh>

      {/* Label */}
      <Billboard>
        <Html
          center
          distanceFactor={10}
          position={[0, 0.15, 0]}
          style={{ pointerEvents: 'none' }}
        >
          <div style={{
            padding: '8px 14px',
            borderRadius: 8,
            background: colors.background,
            color: colors.text,
            fontSize: 12,
            whiteSpace: 'nowrap',
            textAlign: 'center',
          }}>
            <span style={{ marginRight: 6 }}>{icon}</span>
            {notification.title}
          </div>
        </Html>
      </Billboard>
    </group>
  );
}

// ─────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default XRNotificationToast;
