/* =====================================================
   CHE·NU — Breadcrumbs Component
   
   PHASE 4: NAVIGATION BREADCRUMBS
   
   Renders breadcrumb trail based on current route.
   Consumes data from useBreadcrumbs hook.
   ===================================================== */

import React, { memo } from 'react';
import { useBreadcrumbs } from './useNavigation';
import { BreadcrumbItem } from './types';

// ─────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────

export interface BreadcrumbsProps {
  separator?: string;
  className?: string;
  maxItems?: number;
  showHome?: boolean;
  onNavigate?: (path: string) => void;
}

// ─────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────

export const Breadcrumbs = memo(function Breadcrumbs({
  separator = '›',
  className = '',
  maxItems = 5,
  showHome = true,
  onNavigate: customNavigate,
}: BreadcrumbsProps) {
  const { breadcrumbs, onNavigate: hookNavigate } = useBreadcrumbs();
  
  const handleNavigate = customNavigate || hookNavigate;
  
  // Filter if too many items
  let displayItems = breadcrumbs;
  if (!showHome && displayItems.length > 0 && displayItems[0].routeId === 'universe') {
    displayItems = displayItems.slice(1);
  }
  
  // Collapse middle items if needed
  if (displayItems.length > maxItems) {
    const first = displayItems.slice(0, 1);
    const last = displayItems.slice(-maxItems + 2);
    displayItems = [
      ...first,
      {
        routeId: 'collapsed',
        label: '...',
        path: '',
        isActive: false,
      },
      ...last,
    ];
  }
  
  if (displayItems.length === 0) {
    return null;
  }
  
  return (
    <nav 
      className={`breadcrumbs ${className}`}
      aria-label="Breadcrumb navigation"
    >
      <ol className="breadcrumbs__list">
        {displayItems.map((item, index) => (
          <BreadcrumbItemComponent
            key={`${item.routeId}-${index}`}
            item={item}
            isLast={index === displayItems.length - 1}
            separator={separator}
            onNavigate={handleNavigate}
          />
        ))}
      </ol>
    </nav>
  );
});

// ─────────────────────────────────────────────────────
// BREADCRUMB ITEM
// ─────────────────────────────────────────────────────

interface BreadcrumbItemComponentProps {
  item: BreadcrumbItem;
  isLast: boolean;
  separator: string;
  onNavigate: (path: string) => void;
}

const BreadcrumbItemComponent = memo(function BreadcrumbItemComponent({
  item,
  isLast,
  separator,
  onNavigate,
}: BreadcrumbItemComponentProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!item.isActive && item.path) {
      onNavigate(item.path);
    }
  };
  
  const isCollapsed = item.routeId === 'collapsed';
  
  return (
    <li className={`breadcrumbs__item ${item.isActive ? 'breadcrumbs__item--active' : ''}`}>
      {isCollapsed ? (
        <span className="breadcrumbs__collapsed" aria-hidden="true">
          {item.label}
        </span>
      ) : item.isActive ? (
        <span className="breadcrumbs__current" aria-current="page">
          {item.icon && <span className="breadcrumbs__icon">{item.icon}</span>}
          {item.label}
        </span>
      ) : (
        <a
          href={item.path}
          className="breadcrumbs__link"
          onClick={handleClick}
        >
          {item.icon && <span className="breadcrumbs__icon">{item.icon}</span>}
          {item.label}
        </a>
      )}
      
      {!isLast && (
        <span className="breadcrumbs__separator" aria-hidden="true">
          {separator}
        </span>
      )}
    </li>
  );
});

// ─────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────

export const breadcrumbsStyles = `
  .breadcrumbs {
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.6);
  }
  
  .breadcrumbs__list {
    display: flex;
    align-items: center;
    gap: 0;
    list-style: none;
    margin: 0;
    padding: 0;
    flex-wrap: wrap;
  }
  
  .breadcrumbs__item {
    display: flex;
    align-items: center;
  }
  
  .breadcrumbs__link {
    color: rgba(255, 255, 255, 0.6);
    text-decoration: none;
    padding: 4px 8px;
    border-radius: 4px;
    transition: color 0.2s, background 0.2s;
  }
  
  .breadcrumbs__link:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.1);
  }
  
  .breadcrumbs__current {
    color: #fff;
    font-weight: 500;
    padding: 4px 8px;
  }
  
  .breadcrumbs__collapsed {
    padding: 4px 8px;
    color: rgba(255, 255, 255, 0.4);
  }
  
  .breadcrumbs__icon {
    margin-right: 4px;
  }
  
  .breadcrumbs__separator {
    color: rgba(255, 255, 255, 0.3);
    margin: 0 2px;
    user-select: none;
  }
  
  .breadcrumbs__item--active .breadcrumbs__current {
    color: var(--sphere-primary, #4a7c4a);
  }
`;

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default Breadcrumbs;
