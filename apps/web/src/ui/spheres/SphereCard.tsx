/* =====================================================
   CHE·NU — Sphere Card Component
   ui/spheres/SphereCard.tsx
   ===================================================== */

import React, { useState, useMemo } from 'react';
import { SphereCardProps, SphereData } from './sphereCard.types';
import { 
  getCardStyle, 
  getCardHoverStyle, 
  getCardFocusedStyle,
  getCardLockedStyle,
  getStylesForDimension 
} from './sphereCard.styles';
import { getTheme } from '@/core/theme/themeEngine';
import { useElementLayout, useActivityState } from '@/core/layout/useLayout';
import { ContentVolumeLevel, ComplexityLevel } from '@/core/layout/layout.types';

export const SphereCard: React.FC<SphereCardProps> = ({
  sphere,
  isFocused = false,
  isMinimized = false,
  onFocus,
  onEnter,
  onAction,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const theme = getTheme();
  const dimStyles = getStylesForDimension(sphere.dimensionClass);
  
  // Compute content volume based on sphere data
  const contentVolume: ContentVolumeLevel = useMemo(() => {
    const agentCount = sphere.agents?.length || 0;
    const indicatorCount = sphere.indicators?.length || 0;
    const total = agentCount + indicatorCount;
    if (total > 8) return 'high';
    if (total > 3) return 'medium';
    return 'low';
  }, [sphere.agents, sphere.indicators]);
  
  // Activity tracking
  const { activity, recordAction } = useActivityState({ idleDelay: 5000 });
  
  // Adaptive layout
  const { cssStyle: layoutStyle, isAnimated } = useElementLayout({
    contentVolume,
    activity: sphere.isActive ? activity : 'idle',
    complexity: sphere.dimensionClass === 'XL' || sphere.dimensionClass === 'L' ? 'advanced' : 'simple',
    depth: 0,
    isVisible: !sphere.isLocked,
    isFocused,
  });
  
  const baseStyle = getCardStyle(
    sphere.dimensionClass,
    sphere.normalizedDimension,
    sphere.color
  );
  
  const computedStyle: React.CSSProperties = {
    ...baseStyle,
    ...layoutStyle,  // Apply adaptive layout
    ...(isHovered && !sphere.isLocked ? getCardHoverStyle() : {}),
    ...(isFocused ? getCardFocusedStyle(sphere.color) : {}),
    ...(sphere.isLocked ? getCardLockedStyle() : {}),
  };
  
  const handleClick = () => {
    if (!sphere.isLocked) {
      recordAction();  // Track activity
      onFocus?.(sphere.id);
      onAction?.({ type: 'focus', sphereId: sphere.id });
    }
  };
  
  const handleDoubleClick = () => {
    if (!sphere.isLocked) {
      recordAction();  // Track activity
      onEnter?.(sphere.id);
      onAction?.({ type: 'enter', sphereId: sphere.id });
    }
  };
  
  return (
    <div
      style={computedStyle}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      aria-label={`${sphere.name} sphere`}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
        {dimStyles.showIcon && (
          <span style={{ fontSize: dimStyles.iconSize }}>{sphere.icon}</span>
        )}
        <div>
          <strong style={{ 
            fontSize: dimStyles.titleSize, 
            color: theme.colors.text,
            display: 'block',
          }}>
            {sphere.name}
          </strong>
          {dimStyles.showSubtitle && (
            <span style={{ 
              fontSize: theme.typography.fontSizeXs, 
              color: theme.colors.textMuted,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              {sphere.type}
            </span>
          )}
        </div>
      </div>
      
      {/* Indicators */}
      {dimStyles.showIndicators && sphere.indicators && (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: theme.spacing.xs,
          marginTop: 'auto',
        }}>
          {sphere.indicators.slice(0, dimStyles.maxIndicators).map((indicator) => (
            <div 
              key={indicator.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: theme.typography.fontSizeXs,
                color: theme.colors.textSecondary,
              }}
            >
              <span>{indicator.label}</span>
              <span style={{ 
                fontWeight: theme.typography.fontWeightMedium,
                color: indicator.trend === 'up' ? theme.colors.success : 
                       indicator.trend === 'down' ? theme.colors.error : 
                       theme.colors.text,
              }}>
                {indicator.value}
              </span>
            </div>
          ))}
        </div>
      )}
      
      {/* Lock Overlay */}
      {sphere.isLocked && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.3)',
          borderRadius: 'inherit',
        }}>
          <span style={{ fontSize: 24 }}>🔒</span>
        </div>
      )}
    </div>
  );
};

export default SphereCard;
