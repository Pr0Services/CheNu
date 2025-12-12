/* =====================================================
   CHE·NU — Dimension Container
   
   PHASE 2: PURE RENDERER COMPONENT
   
   This component applies ResolvedDimension to its children.
   It does NOT make decisions — it renders what the 
   resolver computed.
   
   Usage:
   
   <DimensionContainer sphereId="business" permission="write">
     <YourContent />
   </DimensionContainer>
   
   ===================================================== */

import React, { useEffect, ReactNode, forwardRef } from 'react';
import { useDimension, useSphere } from './useResolvedDimension';
import { mapDimensionToStyles, injectKeyframes, getDetailConfig } from './styleMapper';
import { ContentContext, ComplexityLevel, PermissionLevel } from '../../core-reference/resolver/types';

// ─────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────

interface DimensionContainerProps {
  // Resolution inputs
  sphereId?: string;
  content?: ContentContext;
  complexity?: ComplexityLevel;
  permission?: PermissionLevel;
  depth?: number;
  triggers?: string[];
  
  // Rendering
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  
  // Events
  onClick?: () => void;
  onDoubleClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onFocus?: () => void;
  
  // Options
  as?: keyof JSX.IntrinsicElements;
  trackActivity?: boolean;
  
  // Testing
  testId?: string;
}

// ─────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────

export const DimensionContainer = forwardRef<HTMLElement, DimensionContainerProps>(
  function DimensionContainer(props, ref) {
    const {
      sphereId,
      content,
      complexity,
      permission,
      depth,
      triggers,
      children,
      className = '',
      style = {},
      onClick,
      onDoubleClick,
      onMouseEnter,
      onMouseLeave,
      onFocus,
      as: Component = 'div',
      trackActivity = true,
      testId,
    } = props;
    
    // Inject keyframes once
    useEffect(() => {
      injectKeyframes();
    }, []);
    
    // Resolve dimension
    const { dimension, isLoading, error, recordAction } = useDimension({
      sphereId,
      content,
      complexity,
      permission,
      depth,
      triggers,
    });
    
    // Handle loading state
    if (isLoading) {
      return (
        <Component
          className={`chenu-dimension chenu-loading ${className}`}
          style={{ opacity: 0.5, ...style }}
          data-testid={testId}
        >
          {children}
        </Component>
      );
    }
    
    // Handle error state
    if (error) {
      console.error('[CHE·NU] Dimension resolution error:', error);
      return (
        <Component
          className={`chenu-dimension chenu-error ${className}`}
          style={{ opacity: 0.3, ...style }}
          data-testid={testId}
        >
          {children}
        </Component>
      );
    }
    
    // Handle null dimension (shouldn't happen after loading)
    if (!dimension) {
      return null;
    }
    
    // Map dimension to styles
    const mappedStyles = mapDimensionToStyles(dimension);
    
    // Combine styles
    const combinedStyle: React.CSSProperties = {
      ...mappedStyles.container,
      animation: mappedStyles.animation,
      transition: mappedStyles.transition,
      ...style,
    };
    
    // Event handlers with activity tracking
    const handleClick = () => {
      if (trackActivity) recordAction();
      onClick?.();
    };
    
    const handleDoubleClick = () => {
      if (trackActivity) recordAction();
      onDoubleClick?.();
    };
    
    const handleMouseEnter = () => {
      onMouseEnter?.();
    };
    
    const handleMouseLeave = () => {
      onMouseLeave?.();
    };
    
    const handleFocus = () => {
      if (trackActivity) recordAction();
      onFocus?.();
    };
    
    // Don't render if not visible
    if (!dimension.visible) {
      return null;
    }
    
    return (
      <Component
        ref={ref as any}
        className={`${mappedStyles.className} ${className}`}
        style={combinedStyle}
        onClick={dimension.interactable ? handleClick : undefined}
        onDoubleClick={dimension.interactable ? handleDoubleClick : undefined}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        tabIndex={dimension.interactable ? 0 : -1}
        data-testid={testId}
        data-activity={dimension.activityState}
        data-content={dimension.contentLevel}
        data-density={dimension.density.level}
        data-depth={dimension.currentDepth}
        data-interactable={dimension.interactable}
      >
        {children}
      </Component>
    );
  }
);

// ─────────────────────────────────────────────────────
// SPHERE CONTAINER (Convenience wrapper)
// ─────────────────────────────────────────────────────

interface SphereContainerProps {
  sphereId: string;
  items?: unknown[];
  agents?: unknown[];
  processes?: { status?: string }[];
  decisions?: { resolved?: boolean }[];
  complexity?: ComplexityLevel;
  permission?: PermissionLevel;
  depth?: number;
  triggers?: string[];
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  onDoubleClick?: () => void;
  testId?: string;
}

export const SphereContainer = forwardRef<HTMLElement, SphereContainerProps>(
  function SphereContainer(props, ref) {
    const {
      sphereId,
      items,
      agents,
      processes,
      decisions,
      complexity,
      permission,
      depth,
      triggers,
      children,
      ...rest
    } = props;
    
    // Use sphere hook for content metrics
    const { dimension, isLoading, error, recordAction, sphereConfig } = useSphere({
      sphereId,
      items,
      agents,
      processes,
      decisions,
      complexity,
      permission,
      depth,
      triggers,
    });
    
    // Inject keyframes once
    useEffect(() => {
      injectKeyframes();
    }, []);
    
    if (isLoading || !dimension) {
      return (
        <div 
          className="chenu-dimension chenu-loading" 
          style={{ opacity: 0.5 }}
          data-testid={rest.testId}
        >
          {children}
        </div>
      );
    }
    
    if (error) {
      console.error('[CHE·NU] Sphere resolution error:', error);
      return null;
    }
    
    const mappedStyles = mapDimensionToStyles(dimension);
    const detailConfig = getDetailConfig(dimension.density.level);
    
    const combinedStyle: React.CSSProperties = {
      ...mappedStyles.container,
      animation: mappedStyles.animation,
      transition: mappedStyles.transition,
      ...rest.style,
    };
    
    if (!dimension.visible) return null;
    
    return (
      <div
        ref={ref as any}
        className={`${mappedStyles.className} ${rest.className || ''}`}
        style={combinedStyle}
        onClick={dimension.interactable ? rest.onClick : undefined}
        onDoubleClick={dimension.interactable ? rest.onDoubleClick : undefined}
        data-testid={rest.testId}
        data-sphere={sphereId}
        data-activity={dimension.activityState}
      >
        {/* Render children with detail config context */}
        {typeof children === 'function' 
          ? (children as (config: typeof detailConfig) => ReactNode)(detailConfig)
          : children
        }
      </div>
    );
  }
);

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default DimensionContainer;
