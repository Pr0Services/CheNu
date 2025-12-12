/* =====================================================
   CHE·NU — Transition Components
   
   PHASE 4: ANIMATED TRANSITIONS
   ===================================================== */

import React, { memo, useRef, useEffect, useState, ReactNode, CSSProperties } from 'react';
import { useTransition, useNavigation } from './useNavigation';
import { TransitionConfig, TransitionKeyframe } from './types';

export interface TransitionLayerProps { children: ReactNode; className?: string; }

export const TransitionLayer = memo(function TransitionLayer({ children, className = '' }: TransitionLayerProps) {
  const { isTransitioning, config } = useTransition();
  const [phase, setPhase] = useState<'idle' | 'exit' | 'enter'>('idle');
  const prevChildren = useRef<ReactNode>(children);
  
  useEffect(() => {
    if (isTransitioning && config) {
      setPhase('exit');
      const exitTimer = setTimeout(() => { prevChildren.current = children; setPhase('enter'); }, config.duration / 2);
      const enterTimer = setTimeout(() => { setPhase('idle'); }, config.duration);
      return () => { clearTimeout(exitTimer); clearTimeout(enterTimer); };
    }
  }, [isTransitioning, config, children]);
  
  const getStyles = (): CSSProperties => {
    if (!config || phase === 'idle') return {};
    const keyframe = phase === 'exit' ? config.exit.to : phase === 'enter' ? config.enter.from : {};
    return keyframeToStyle(keyframe, config);
  };
  
  return (
    <div className={`transition-layer ${className}`} style={{ ...getStyles(), transition: config ? `all ${config.duration / 2}ms ${config.easing}` : 'none' }}>
      {phase === 'exit' ? prevChildren.current : children}
    </div>
  );
});

export interface AnimatedViewProps { children: ReactNode; isActive: boolean; transition?: TransitionConfig; className?: string; onEnterStart?: () => void; onEnterEnd?: () => void; onExitStart?: () => void; onExitEnd?: () => void; }

export const AnimatedView = memo(function AnimatedView({ children, isActive, transition, className = '', onEnterStart, onEnterEnd, onExitStart, onExitEnd }: AnimatedViewProps) {
  const [state, setState] = useState<'hidden' | 'entering' | 'visible' | 'exiting'>(isActive ? 'visible' : 'hidden');
  const { config: navConfig } = useNavigation();
  const transitionConfig = transition || navConfig.transitions.default;
  
  useEffect(() => {
    if (isActive && (state === 'hidden' || state === 'exiting')) {
      setState('entering'); onEnterStart?.();
      const timer = setTimeout(() => { setState('visible'); onEnterEnd?.(); }, transitionConfig.duration);
      return () => clearTimeout(timer);
    }
    if (!isActive && (state === 'visible' || state === 'entering')) {
      setState('exiting'); onExitStart?.();
      const timer = setTimeout(() => { setState('hidden'); onExitEnd?.(); }, transitionConfig.duration);
      return () => clearTimeout(timer);
    }
  }, [isActive, state, transitionConfig, onEnterStart, onEnterEnd, onExitStart, onExitEnd]);
  
  if (state === 'hidden') return null;
  
  const getKeyframe = (): TransitionKeyframe => {
    if (state === 'entering') return transitionConfig.enter.from;
    if (state === 'exiting') return transitionConfig.exit.to;
    return {};
  };
  
  return (
    <div className={`animated-view animated-view--${state} ${className}`} style={{ ...keyframeToStyle(getKeyframe(), transitionConfig), transition: `all ${transitionConfig.duration}ms ${transitionConfig.easing}` }}>
      {children}
    </div>
  );
});

export interface ViewSwitcherProps { views: { key: string; render: () => ReactNode; isActive: boolean; }[]; className?: string; }

export const ViewSwitcher = memo(function ViewSwitcher({ views, className = '' }: ViewSwitcherProps) {
  const { config } = useTransition();
  const [activeKey, setActiveKey] = useState<string | null>(views.find(v => v.isActive)?.key || null);
  const [exitingKey, setExitingKey] = useState<string | null>(null);
  
  useEffect(() => {
    const newActive = views.find(v => v.isActive)?.key || null;
    if (newActive !== activeKey) {
      setExitingKey(activeKey);
      setActiveKey(newActive);
      if (config) { const timer = setTimeout(() => setExitingKey(null), config.duration); return () => clearTimeout(timer); }
    }
  }, [views, activeKey, config]);
  
  return (
    <div className={`view-switcher ${className}`}>
      {views.map(view => {
        const isVisible = view.key === activeKey || view.key === exitingKey;
        if (!isVisible) return null;
        const isEntering = view.key === activeKey && exitingKey !== null;
        const isExiting = view.key === exitingKey;
        return (
          <div key={view.key} className={`view-switcher__view ${isEntering ? 'view-switcher__view--entering' : ''} ${isExiting ? 'view-switcher__view--exiting' : ''}`}
            style={{ position: exitingKey ? 'absolute' : 'relative', inset: exitingKey ? 0 : undefined, zIndex: isExiting ? 1 : 2 }}>
            {view.render()}
          </div>
        );
      })}
    </div>
  );
});

export interface SphereZoomProps { children: ReactNode; sphereId: string; isExpanded: boolean; originX?: number; originY?: number; className?: string; }

export const SphereZoom = memo(function SphereZoom({ children, sphereId, isExpanded, originX = 0.5, originY = 0.5, className = '' }: SphereZoomProps) {
  const { config } = useNavigation();
  const transition = config.transitions.byAction['ENTER_SPHERE'];
  return (
    <div className={`sphere-zoom ${className}`} style={{ transformOrigin: `${originX * 100}% ${originY * 100}%`, transform: isExpanded ? 'scale(1)' : 'scale(0.8)', opacity: isExpanded ? 1 : 0, transition: transition ? `all ${transition.duration}ms ${transition.easing}` : 'all 500ms ease' }} data-sphere={sphereId} data-expanded={isExpanded}>
      {children}
    </div>
  );
});

export interface StaggerContainerProps { children: ReactNode[]; isVisible: boolean; staggerDelay?: number; transition?: TransitionConfig; className?: string; }

export const StaggerContainer = memo(function StaggerContainer({ children, isVisible, staggerDelay = 50, transition, className = '' }: StaggerContainerProps) {
  const { config } = useNavigation();
  const transitionConfig = transition || config.transitions.default;
  return (
    <div className={`stagger-container ${className}`}>
      {React.Children.map(children, (child, index) => (
        <div className="stagger-container__item" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(20px)', transition: `all ${transitionConfig.duration}ms ${transitionConfig.easing}`, transitionDelay: isVisible ? `${index * staggerDelay}ms` : '0ms' }}>
          {child}
        </div>
      ))}
    </div>
  );
});

export interface CrossfadeProps { children: ReactNode; transitionKey: string; duration?: number; className?: string; }

export const Crossfade = memo(function Crossfade({ children, transitionKey, duration = 300, className = '' }: CrossfadeProps) {
  const [items, setItems] = useState<{ key: string; content: ReactNode }[]>([{ key: transitionKey, content: children }]);
  useEffect(() => {
    if (transitionKey !== items[items.length - 1]?.key) {
      setItems(prev => [...prev, { key: transitionKey, content: children }]);
      const timer = setTimeout(() => setItems(prev => prev.slice(-1)), duration);
      return () => clearTimeout(timer);
    }
  }, [transitionKey, children, duration, items]);
  return (
    <div className={`crossfade ${className}`} style={{ position: 'relative' }}>
      {items.map((item, index) => (
        <div key={item.key} style={{ position: index === items.length - 1 ? 'relative' : 'absolute', inset: index === items.length - 1 ? undefined : 0, opacity: index === items.length - 1 ? 1 : 0, transition: `opacity ${duration}ms ease` }}>
          {item.content}
        </div>
      ))}
    </div>
  );
});

function keyframeToStyle(keyframe: TransitionKeyframe, config: TransitionConfig): CSSProperties {
  const transforms: string[] = [];
  const style: CSSProperties = {};
  if (keyframe.opacity !== undefined) style.opacity = keyframe.opacity;
  if (keyframe.scale !== undefined) transforms.push(`scale(${keyframe.scale})`);
  if (keyframe.translateX !== undefined) transforms.push(`translateX(${keyframe.translateX}px)`);
  if (keyframe.translateY !== undefined) transforms.push(`translateY(${keyframe.translateY}px)`);
  if (keyframe.translateZ !== undefined) transforms.push(`translateZ(${keyframe.translateZ}px)`);
  if (keyframe.rotateX !== undefined) transforms.push(`rotateX(${keyframe.rotateX}deg)`);
  if (keyframe.rotateY !== undefined) transforms.push(`rotateY(${keyframe.rotateY}deg)`);
  if (keyframe.rotateZ !== undefined) transforms.push(`rotateZ(${keyframe.rotateZ}deg)`);
  if (transforms.length > 0) style.transform = transforms.join(' ');
  if (keyframe.blur !== undefined) style.filter = `blur(${keyframe.blur}px)`;
  return style;
}

export const transitionStyles = `
.transition-layer { position: relative; width: 100%; height: 100%; }
.animated-view { width: 100%; height: 100%; }
.view-switcher { position: relative; width: 100%; height: 100%; overflow: hidden; }
.view-switcher__view { width: 100%; height: 100%; }
.sphere-zoom { width: 100%; height: 100%; }
.stagger-container { width: 100%; }
.crossfade { width: 100%; }
@media (prefers-reduced-motion: reduce) {
  .transition-layer, .animated-view, .view-switcher__view, .sphere-zoom, .stagger-container__item, .crossfade > div {
    transition: opacity 0ms !important; transform: none !important;
  }
}`;

export default TransitionLayer;
