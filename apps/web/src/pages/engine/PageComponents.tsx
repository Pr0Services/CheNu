/* =====================================================
   CHE·NU — Generic UI Components
   
   PHASE 3: PURE RENDERERS
   
   These components render PageComposition.
   They don't know WHAT they're displaying —
   they render based on composition properties.
   
   Components:
   - PageContainer: Main page wrapper
   - PageSection: Section renderer
   - PageItem: Individual item renderer
   ===================================================== */

import React, { ReactNode, forwardRef, useMemo } from 'react';
import {
  PageComposition,
  LayoutComposition,
  SectionComposition,
  ItemComposition,
  ContentNode,
} from './page.types';

// ─────────────────────────────────────────────────────
// SPACING TOKENS (would come from theme in production)
// ─────────────────────────────────────────────────────

const SPACING = {
  minimal: '4px',
  compact: '8px',
  standard: '16px',
  expanded: '24px',
};

const COLORS = {
  background: '#0A0E0A',
  surface: '#121812',
  surfaceHover: '#1A241A',
  border: '#2A3A2A',
  text: '#E8F0E8',
  textMuted: '#788878',
};

// ─────────────────────────────────────────────────────
// PAGE CONTAINER
// ─────────────────────────────────────────────────────

interface PageContainerProps {
  composition: PageComposition;
  children?: ReactNode;
  onNavigate?: (path: string[]) => void;
  className?: string;
}

export const PageContainer = forwardRef<HTMLDivElement, PageContainerProps>(
  function PageContainer({ composition, children, onNavigate, className = '' }, ref) {
    const { layout, navigation, state } = composition;
    
    const containerStyle = useMemo((): React.CSSProperties => ({
      display: 'flex',
      flexDirection: layout.direction === 'horizontal' ? 'row' : 'column',
      gap: SPACING[layout.spacing],
      padding: SPACING[layout.spacing],
      maxWidth: layout.maxWidth || 'none',
      margin: layout.type === 'centered' ? '0 auto' : undefined,
      minHeight: '100vh',
      background: layout.background === 'prominent' 
        ? COLORS.surface 
        : layout.background === 'subtle' 
          ? COLORS.background 
          : 'transparent',
      opacity: state.isLoading ? 0.6 : 1,
      transition: 'opacity 300ms ease',
    }), [layout, state.isLoading]);
    
    // Breadcrumb
    const breadcrumbElement = useMemo(() => {
      if (navigation.breadcrumb.length <= 1) return null;
      
      return (
        <nav style={{ 
          display: 'flex', 
          gap: '8px', 
          padding: SPACING[layout.spacing],
          color: COLORS.textMuted,
          fontSize: '14px',
        }}>
          {navigation.breadcrumb.map((item, i) => (
            <React.Fragment key={item.id}>
              {i > 0 && <span>/</span>}
              <button
                onClick={() => onNavigate?.(item.path)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: i === navigation.breadcrumb.length - 1 ? COLORS.text : COLORS.textMuted,
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                {item.icon && <span style={{ marginRight: '4px' }}>{item.icon}</span>}
                {item.label}
              </button>
            </React.Fragment>
          ))}
        </nav>
      );
    }, [navigation.breadcrumb, layout.spacing, onNavigate]);
    
    return (
      <div ref={ref} style={containerStyle} className={`chenu-page ${className}`}>
        {breadcrumbElement}
        {children}
      </div>
    );
  }
);

// ─────────────────────────────────────────────────────
// PAGE SECTION
// ─────────────────────────────────────────────────────

interface PageSectionProps {
  section: SectionComposition;
  renderItem: (item: ItemComposition, index: number) => ReactNode;
  onToggleCollapse?: () => void;
  className?: string;
}

export const PageSection = forwardRef<HTMLElement, PageSectionProps>(
  function PageSection({ section, renderItem, onToggleCollapse, className = '' }, ref) {
    if (!section.visible) return null;
    
    const sectionStyle = useMemo((): React.CSSProperties => {
      // Grid layout
      if (section.layout === 'grid') {
        return {
          display: 'grid',
          gridTemplateColumns: `repeat(${section.columns}, 1fr)`,
          gap: '16px',
        };
      }
      
      // List layout
      if (section.layout === 'list') {
        return {
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        };
      }
      
      // Orbital layout
      if (section.layout === 'orbital') {
        return {
          position: 'relative',
          width: '100%',
          minHeight: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        };
      }
      
      // Stack layout
      return {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
      };
    }, [section.layout, section.columns]);
    
    const labelElement = section.showLabel && section.label && (
      <header 
        style={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px',
        }}
      >
        <h2 style={{ 
          margin: 0, 
          fontSize: '14px', 
          fontWeight: 500,
          color: COLORS.textMuted,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          {section.label}
        </h2>
        
        {section.expandable && (
          <button
            onClick={onToggleCollapse}
            style={{
              background: 'none',
              border: 'none',
              color: COLORS.textMuted,
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            {section.collapsed ? 'Show more' : 'Show less'}
          </button>
        )}
      </header>
    );
    
    const items = section.collapsed 
      ? section.items.slice(0, 4) 
      : section.items;
    
    return (
      <section 
        ref={ref as any}
        className={`chenu-section chenu-section-${section.layout} ${className}`}
        data-section-id={section.id}
      >
        {labelElement}
        <div style={sectionStyle}>
          {items.map((item, i) => renderItem(item, i))}
        </div>
      </section>
    );
  }
);

// ─────────────────────────────────────────────────────
// PAGE ITEM
// ─────────────────────────────────────────────────────

interface PageItemProps {
  item: ItemComposition;
  onClick?: () => void;
  onDoubleClick?: () => void;
  className?: string;
}

export const PageItem = forwardRef<HTMLDivElement, PageItemProps>(
  function PageItem({ item, onClick, onDoubleClick, className = '' }, ref) {
    const { node, dimension, size, showDetails, showMetrics, showActions, position } = item;
    
    // Size mapping
    const sizeMap = {
      xs: { width: '60px', height: '60px', fontSize: '12px' },
      sm: { width: '100px', height: '100px', fontSize: '14px' },
      md: { width: '140px', height: '140px', fontSize: '16px' },
      lg: { width: '180px', height: '180px', fontSize: '18px' },
      xl: { width: '220px', height: '220px', fontSize: '20px' },
    };
    
    const sizeProps = sizeMap[size] || sizeMap.md;
    
    const itemStyle = useMemo((): React.CSSProperties => {
      const base: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        borderRadius: node.visual.shape === 'organic' ? '50%' : '12px',
        background: `linear-gradient(135deg, ${node.visual.colorPrimary}, ${node.visual.colorSecondary})`,
        color: COLORS.text,
        cursor: dimension.interactable ? 'pointer' : 'default',
        opacity: dimension.visibility,
        transform: `scale(${dimension.scale})`,
        transition: 'transform 300ms ease, opacity 300ms ease, box-shadow 300ms ease',
        ...sizeProps,
      };
      
      // Position for orbital layout
      if (position) {
        base.position = 'absolute';
        base.left = `calc(50% + ${position.x}px)`;
        base.top = `calc(50% + ${position.y}px)`;
        base.transform = `translate(-50%, -50%) scale(${dimension.scale})`;
      }
      
      // Glow effect
      if (node.visual.glowEnabled) {
        base.boxShadow = `0 0 ${20 * node.visual.glowIntensity}px ${node.visual.colorPrimary}`;
      }
      
      // Locked state
      if (node.state.isLocked) {
        base.filter = 'grayscale(50%)';
      }
      
      // Focused state
      if (node.state.isFocused) {
        base.boxShadow = `0 0 0 3px ${node.visual.colorAccent}, ${base.boxShadow || 'none'}`;
      }
      
      return base;
    }, [node, dimension, position, sizeProps]);
    
    return (
      <div
        ref={ref}
        style={itemStyle}
        onClick={dimension.interactable ? onClick : undefined}
        onDoubleClick={dimension.interactable ? onDoubleClick : undefined}
        className={`chenu-item chenu-item-${size} ${className}`}
        data-node-id={node.id}
        data-node-type={node.type}
      >
        {/* Icon */}
        {node.icon && (
          <span style={{ fontSize: `calc(${sizeProps.fontSize} * 1.5)`, marginBottom: '8px' }}>
            {node.icon}
          </span>
        )}
        
        {/* Label */}
        <span style={{ 
          fontSize: sizeProps.fontSize, 
          fontWeight: 500,
          textAlign: 'center',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          maxWidth: '90%',
        }}>
          {node.label}
        </span>
        
        {/* Description */}
        {showDetails && node.description && (
          <span style={{ 
            fontSize: '12px', 
            color: 'rgba(255,255,255,0.7)',
            marginTop: '4px',
            textAlign: 'center',
          }}>
            {node.description}
          </span>
        )}
        
        {/* Metrics badge */}
        {showMetrics && node.metrics && (
          <div style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            background: node.visual.colorAccent,
            borderRadius: '12px',
            padding: '2px 8px',
            fontSize: '11px',
            fontWeight: 600,
          }}>
            {node.metrics.itemCount}
          </div>
        )}
        
        {/* Locked overlay */}
        {node.state.isLocked && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.5)',
            borderRadius: 'inherit',
            fontSize: '24px',
          }}>
            🔒
          </div>
        )}
        
        {/* Activity indicator */}
        {node.state.activityLevel === 'busy' || node.state.activityLevel === 'critical' && (
          <div style={{
            position: 'absolute',
            bottom: '-4px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: node.state.activityLevel === 'critical' ? '#EF5350' : '#4CAF50',
            animation: 'pulse 1s infinite',
          }} />
        )}
      </div>
    );
  }
);

// ─────────────────────────────────────────────────────
// COMPOSED PAGE RENDERER
// ─────────────────────────────────────────────────────

interface AdaptivePageProps {
  composition: PageComposition;
  onNavigate?: (path: string[]) => void;
  onItemClick?: (node: ContentNode) => void;
  onItemEnter?: (node: ContentNode) => void;
  className?: string;
}

export const AdaptivePage: React.FC<AdaptivePageProps> = ({
  composition,
  onNavigate,
  onItemClick,
  onItemEnter,
  className = '',
}) => {
  const renderItem = (item: ItemComposition, index: number) => (
    <PageItem
      key={item.node.id}
      item={item}
      onClick={() => onItemClick?.(item.node)}
      onDoubleClick={() => onItemEnter?.(item.node)}
    />
  );
  
  return (
    <PageContainer
      composition={composition}
      onNavigate={onNavigate}
      className={className}
    >
      {composition.sections.map(section => (
        <PageSection
          key={section.id}
          section={section}
          renderItem={renderItem}
        />
      ))}
    </PageContainer>
  );
};

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default {
  PageContainer,
  PageSection,
  PageItem,
  AdaptivePage,
};
