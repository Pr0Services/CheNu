/* =====================================================
   CHE·NU — Navigation UI Components
   
   PHASE 4: NAV UI
   ===================================================== */

import React, { memo } from 'react';
import { useBreadcrumbs, useNavigation, useCanNavigate, useCurrentView, useKeyboardNavigation } from './useNavigation';

export interface BreadcrumbProps { maxVisible?: number; showIcons?: boolean; separator?: string; className?: string; }

export const Breadcrumb = memo(function Breadcrumb({ maxVisible = 4, showIcons = true, separator = '›', className = '' }: BreadcrumbProps) {
  const { items } = useBreadcrumbs();
  const { config } = useNavigation();
  const max = maxVisible || config.breadcrumb.maxVisible;
  const displayItems = items.length > max ? [items[0], { type: 'ellipsis' as const, id: 'ellipsis', label: '...', depth: 0 as const, isActive: false, onClick: () => {} }, ...items.slice(-(max - 1))] : items;
  
  const icons: Record<string, string> = { universe: '🌌', sphere: '🔮', branch: '🌿', leaf: '🍃', 'agent-chat': '🤖' };
  
  return (
    <nav className={`breadcrumb ${className}`} aria-label="Navigation">
      <ol className="breadcrumb__list">
        {displayItems.map((item, index) => (
          <li key={item.id} className={`breadcrumb__item ${item.isActive ? 'breadcrumb__item--active' : ''}`}>
            {index > 0 && <span className="breadcrumb__separator" aria-hidden="true">{separator}</span>}
            {item.type === 'ellipsis' ? <span className="breadcrumb__ellipsis">...</span> : (
              <button className="breadcrumb__link" onClick={item.onClick} disabled={item.isActive} aria-current={item.isActive ? 'page' : undefined}>
                {showIcons && <span className="breadcrumb__icon" aria-hidden="true">{icons[item.type] || '📍'}</span>}
                <span className="breadcrumb__label">{item.label}</span>
              </button>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
});

export interface NavigationBarProps { showBreadcrumb?: boolean; showBackForward?: boolean; showHomeButton?: boolean; showViewInfo?: boolean; className?: string; }

export const NavigationBar = memo(function NavigationBar({ showBreadcrumb = true, showBackForward = true, showHomeButton = true, showViewInfo = true, className = '' }: NavigationBarProps) {
  const { goBack, goForward, goToRoot, isAtRoot } = useNavigation();
  const { back: canGoBack, forward: canGoForward } = useCanNavigate();
  const { view, depth, sphereId } = useCurrentView();
  useKeyboardNavigation();
  
  const viewLabels: Record<string, string> = { universe: 'Universe View', sphere: 'Sphere View', branch: 'Branch View', leaf: 'Detail View', 'agent-chat': 'Agent Chat' };
  
  return (
    <header className={`navigation-bar ${className}`}>
      {showBackForward && (
        <div className="navigation-bar__controls">
          <button className="navigation-bar__button" onClick={goBack} disabled={!canGoBack} aria-label="Go back" title="Go back (←)">←</button>
          <button className="navigation-bar__button" onClick={goForward} disabled={!canGoForward} aria-label="Go forward" title="Go forward (→)">→</button>
        </div>
      )}
      {showHomeButton && <button className="navigation-bar__button navigation-bar__home" onClick={goToRoot} disabled={isAtRoot()} aria-label="Go to universe" title="Go to universe (Home)">🏠</button>}
      {showBreadcrumb && <div className="navigation-bar__breadcrumb"><Breadcrumb /></div>}
      {showViewInfo && (
        <div className="navigation-bar__info">
          <div className="view-indicator">
            <span className="view-indicator__depth">L{depth}</span>
            <span className="view-indicator__view">{viewLabels[view] || view}</span>
            {sphereId && <span className="view-indicator__sphere">{sphereId}</span>}
          </div>
        </div>
      )}
    </header>
  );
});

export interface QuickNavProps { spheres: { id: string; icon: string; label: string }[]; className?: string; }

export const QuickNav = memo(function QuickNav({ spheres, className = '' }: QuickNavProps) {
  const { enterSphere, state } = useNavigation();
  return (
    <nav className={`quick-nav ${className}`} aria-label="Quick navigation">
      {spheres.map(sphere => (
        <button key={sphere.id} className={`quick-nav__item ${state.activeSphereId === sphere.id ? 'quick-nav__item--active' : ''}`} onClick={() => enterSphere(sphere.id)} aria-label={`Go to ${sphere.label}`} title={sphere.label}>
          <span className="quick-nav__icon">{sphere.icon}</span>
        </button>
      ))}
    </nav>
  );
});

export interface BackButtonProps { label?: string; showLabel?: boolean; className?: string; }

export const BackButton = memo(function BackButton({ label = 'Back', showLabel = true, className = '' }: BackButtonProps) {
  const { goBack, state } = useNavigation();
  if (!state.canGoBack) return null;
  return (
    <button className={`back-button ${className}`} onClick={goBack} aria-label={label}>
      <span className="back-button__icon">←</span>
      {showLabel && <span className="back-button__label">{label}</span>}
    </button>
  );
});

export const navigationUIStyles = `
.breadcrumb { font-size: 0.875rem; }
.breadcrumb__list { display: flex; align-items: center; gap: 4px; list-style: none; margin: 0; padding: 0; }
.breadcrumb__item { display: flex; align-items: center; }
.breadcrumb__separator { margin: 0 8px; color: rgba(255, 255, 255, 0.3); }
.breadcrumb__link { display: flex; align-items: center; gap: 6px; padding: 4px 8px; background: transparent; border: none; border-radius: 4px; color: rgba(255, 255, 255, 0.7); cursor: pointer; transition: background 0.2s, color 0.2s; }
.breadcrumb__link:hover:not(:disabled) { background: rgba(255, 255, 255, 0.1); color: #fff; }
.breadcrumb__link:disabled { color: #fff; cursor: default; }
.breadcrumb__icon { font-size: 1em; }
.breadcrumb__item--active .breadcrumb__link { font-weight: 600; }
.navigation-bar { display: flex; align-items: center; gap: 16px; padding: 12px 20px; background: rgba(0, 0, 0, 0.5); border-bottom: 1px solid rgba(74, 124, 74, 0.2); }
.navigation-bar__controls { display: flex; gap: 4px; }
.navigation-bar__button { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; background: rgba(255, 255, 255, 0.1); border: none; border-radius: 6px; color: #fff; font-size: 1rem; cursor: pointer; transition: background 0.2s; }
.navigation-bar__button:hover:not(:disabled) { background: rgba(255, 255, 255, 0.2); }
.navigation-bar__button:disabled { opacity: 0.3; cursor: not-allowed; }
.navigation-bar__breadcrumb { flex: 1; }
.navigation-bar__info { margin-left: auto; }
.view-indicator { display: flex; align-items: center; gap: 8px; font-size: 0.75rem; }
.view-indicator__depth { padding: 2px 6px; background: rgba(74, 124, 74, 0.3); border-radius: 4px; font-weight: 700; color: #4a7c4a; }
.view-indicator__view { color: rgba(255, 255, 255, 0.6); }
.view-indicator__sphere { padding: 2px 8px; background: rgba(255, 255, 255, 0.1); border-radius: 10px; text-transform: capitalize; }
.quick-nav { display: flex; gap: 8px; padding: 8px; }
.quick-nav__item { width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; background: rgba(255, 255, 255, 0.1); border: 2px solid transparent; border-radius: 12px; font-size: 1.25rem; cursor: pointer; transition: all 0.2s; }
.quick-nav__item:hover { background: rgba(255, 255, 255, 0.2); transform: scale(1.1); }
.quick-nav__item--active { border-color: #4a7c4a; background: rgba(74, 124, 74, 0.3); }
.back-button { display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: rgba(255, 255, 255, 0.1); border: none; border-radius: 8px; color: #fff; font-size: 0.875rem; cursor: pointer; transition: background 0.2s; }
.back-button:hover { background: rgba(255, 255, 255, 0.2); }
.back-button__icon { font-size: 1.25em; }`;

export default NavigationBar;
