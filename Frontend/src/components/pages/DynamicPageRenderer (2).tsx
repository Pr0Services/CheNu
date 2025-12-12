// =============================================================================
// CHE·NU — DynamicPageRenderer Component
// Foundation Freeze V1
// =============================================================================
// Rendu dynamique des pages basé sur la configuration
// Aucune page hardcodée - tout vient du JSON
// =============================================================================

import React, { useMemo, Suspense } from 'react';
import { MenuNode, SphereId, ViewMode } from '../../types';
import { MENU_NODE_MAP, SPHERE_CONFIGS } from '../../config';
import { UNIVERSE_COLORS } from '../../config';

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

export interface DynamicPageRendererProps {
  /** Path actuel */
  currentPath: string;
  /** ID de la sphère actuelle (si applicable) */
  currentSphereId: SphereId | null;
  /** ID de la catégorie actuelle (si applicable) */
  currentCategoryId: string | null;
  /** Mode de vue */
  viewMode: ViewMode;
  /** Contenu personnalisé (slot) */
  children?: React.ReactNode;
  /** Handler de navigation */
  onNavigate?: (path: string) => void;
  /** Classes CSS additionnelles */
  className?: string;
}

// -----------------------------------------------------------------------------
// STYLES
// -----------------------------------------------------------------------------

const pageStyles = {
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    minHeight: '100vh',
    backgroundColor: UNIVERSE_COLORS.background.dark,
    color: UNIVERSE_COLORS.text.primary,
  },
  header: {
    padding: '24px 32px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '8px',
  },
  headerEmoji: {
    fontSize: '32px',
  },
  headerText: {
    fontSize: '24px',
    fontWeight: 700,
    letterSpacing: '-0.5px',
  },
  headerDescription: {
    fontSize: '14px',
    color: UNIVERSE_COLORS.text.secondary,
    maxWidth: '600px',
  },
  content: {
    flex: 1,
    padding: '24px 32px',
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    minHeight: '300px',
  },
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(168, 85, 247, 0.2)',
    borderTopColor: '#A855F7',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    textAlign: 'center' as const,
  },
  emptyEmoji: {
    fontSize: '48px',
    marginBottom: '16px',
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: '18px',
    fontWeight: 600,
    marginBottom: '8px',
  },
  emptyDescription: {
    fontSize: '14px',
    color: UNIVERSE_COLORS.text.muted,
    maxWidth: '400px',
  },
  categoryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px',
    marginTop: '24px',
  },
  categoryCard: {
    padding: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    cursor: 'pointer',
    transition: 'all 0.2s ease-out',
  },
  categoryCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
  },
  categoryEmoji: {
    fontSize: '24px',
  },
  categoryTitle: {
    fontSize: '16px',
    fontWeight: 600,
  },
  categoryDescription: {
    fontSize: '13px',
    color: UNIVERSE_COLORS.text.secondary,
    lineHeight: 1.5,
  }
};

// -----------------------------------------------------------------------------
// SUB-COMPONENTS
// -----------------------------------------------------------------------------

const LoadingState: React.FC = () => (
  <div style={pageStyles.loadingContainer}>
    <div style={pageStyles.loadingSpinner} />
    <style>{`
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

interface EmptyStateProps {
  emoji: string;
  title: string;
  description: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ emoji, title, description }) => (
  <div style={pageStyles.emptyState}>
    <span style={pageStyles.emptyEmoji}>{emoji}</span>
    <h3 style={pageStyles.emptyTitle}>{title}</h3>
    <p style={pageStyles.emptyDescription}>{description}</p>
  </div>
);

interface CategoryCardProps {
  emoji: string;
  label: string;
  labelFr: string;
  description?: string;
  dataTypes?: string[];
  onClick?: () => void;
  color?: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  emoji,
  label,
  labelFr,
  description,
  dataTypes = [],
  onClick,
  color
}) => (
  <div
    style={{
      ...pageStyles.categoryCard,
      borderColor: color ? `${color}30` : 'rgba(255, 255, 255, 0.1)',
    }}
    onClick={onClick}
    role="button"
    tabIndex={0}
  >
    <div style={pageStyles.categoryCardHeader}>
      <span 
        style={{
          ...pageStyles.categoryEmoji,
          filter: color ? `drop-shadow(0 0 4px ${color})` : 'none',
        }}
      >
        {emoji}
      </span>
      <span style={pageStyles.categoryTitle}>{label}</span>
    </div>
    {description && (
      <p style={pageStyles.categoryDescription}>{description}</p>
    )}
    {dataTypes.length > 0 && (
      <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {dataTypes.slice(0, 4).map(type => (
          <span
            key={type}
            style={{
              padding: '2px 8px',
              fontSize: '11px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '4px',
              color: UNIVERSE_COLORS.text.muted,
            }}
          >
            {type}
          </span>
        ))}
      </div>
    )}
  </div>
);

// -----------------------------------------------------------------------------
// MAIN COMPONENT
// -----------------------------------------------------------------------------

export const DynamicPageRenderer: React.FC<DynamicPageRendererProps> = ({
  currentPath,
  currentSphereId,
  currentCategoryId,
  viewMode,
  children,
  onNavigate,
  className = ''
}) => {
  // Get page info from path
  const pageInfo = useMemo(() => {
    // Find matching menu node
    for (const node of Object.values(MENU_NODE_MAP)) {
      if (node.path === currentPath) {
        return {
          node,
          type: node.type,
        };
      }
    }
    
    // Default for sphere pages
    if (currentSphereId) {
      const sphereConfig = SPHERE_CONFIGS[currentSphereId];
      return {
        node: null,
        type: 'sphere' as const,
        sphere: sphereConfig,
      };
    }
    
    return { node: null, type: 'unknown' as const };
  }, [currentPath, currentSphereId]);

  // Render sphere home page
  const renderSphereHome = () => {
    if (!currentSphereId) return null;
    
    const sphereConfig = SPHERE_CONFIGS[currentSphereId];
    if (!sphereConfig) return null;

    return (
      <>
        {/* Header */}
        <header style={pageStyles.header}>
          <div style={pageStyles.headerTitle}>
            <span 
              style={{
                ...pageStyles.headerEmoji,
                filter: `drop-shadow(0 0 8px ${sphereConfig.color})`,
              }}
            >
              {sphereConfig.emoji}
            </span>
            <h1 style={pageStyles.headerText}>{sphereConfig.label}</h1>
          </div>
          <p style={pageStyles.headerDescription}>
            {sphereConfig.description}
          </p>
        </header>
        
        {/* Categories */}
        <div style={pageStyles.content}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>
            Categories
          </h2>
          <p style={{ fontSize: '13px', color: UNIVERSE_COLORS.text.muted, marginBottom: '16px' }}>
            Explore the different areas of your {sphereConfig.label.toLowerCase()} sphere
          </p>
          
          <div style={pageStyles.categoryGrid}>
            {sphereConfig.categories.map(category => (
              <CategoryCard
                key={category.id}
                emoji={category.emoji}
                label={category.label}
                labelFr={category.labelFr}
                description={category.description}
                dataTypes={category.dataTypes}
                color={sphereConfig.color}
                onClick={() => onNavigate?.(`/sphere/${currentSphereId}/${category.id}`)}
              />
            ))}
          </div>
        </div>
      </>
    );
  };

  // Render category page
  const renderCategoryPage = () => {
    if (!currentSphereId || !currentCategoryId) return null;
    
    const sphereConfig = SPHERE_CONFIGS[currentSphereId];
    const category = sphereConfig?.categories.find(c => c.id === currentCategoryId);
    
    if (!category) {
      return (
        <EmptyState
          emoji="🔍"
          title="Category Not Found"
          description="This category doesn't exist or has been moved."
        />
      );
    }

    return (
      <>
        {/* Header */}
        <header style={pageStyles.header}>
          <div style={pageStyles.headerTitle}>
            <span style={pageStyles.headerEmoji}>{category.emoji}</span>
            <h1 style={pageStyles.headerText}>{category.label}</h1>
          </div>
          <p style={pageStyles.headerDescription}>
            {category.description || `Manage your ${category.label.toLowerCase()} data`}
          </p>
        </header>
        
        {/* Content */}
        <div style={pageStyles.content}>
          {children || (
            <EmptyState
              emoji="📭"
              title="No Data Yet"
              description={`Start adding ${category.label.toLowerCase()} data to see it here.`}
            />
          )}
        </div>
      </>
    );
  };

  // Render dashboard
  const renderDashboard = () => (
    <>
      <header style={pageStyles.header}>
        <div style={pageStyles.headerTitle}>
          <span style={pageStyles.headerEmoji}>🏠</span>
          <h1 style={pageStyles.headerText}>Dashboard</h1>
        </div>
        <p style={pageStyles.headerDescription}>
          Welcome to CHE·NU. Your personal AI-powered universe.
        </p>
      </header>
      
      <div style={pageStyles.content}>
        {children || (
          <div style={pageStyles.categoryGrid}>
            {Object.values(SPHERE_CONFIGS).map(sphere => (
              <CategoryCard
                key={sphere.id}
                emoji={sphere.emoji}
                label={sphere.label}
                labelFr={sphere.labelFr}
                description={sphere.description}
                color={sphere.color}
                onClick={() => onNavigate?.(`/sphere/${sphere.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );

  // Main render logic
  const renderContent = () => {
    // Custom children take precedence
    if (children && !currentSphereId && !currentCategoryId) {
      return children;
    }

    // Dashboard
    if (currentPath === '/' || currentPath === '/dashboard') {
      return renderDashboard();
    }

    // Category page
    if (currentSphereId && currentCategoryId) {
      return renderCategoryPage();
    }

    // Sphere home
    if (currentSphereId) {
      return renderSphereHome();
    }

    // Unknown page
    return (
      <EmptyState
        emoji="🌌"
        title="Page Not Found"
        description="Navigate using the menu or return to the dashboard."
      />
    );
  };

  return (
    <main
      className={`chenu-page-renderer ${className}`}
      style={pageStyles.container}
    >
      <Suspense fallback={<LoadingState />}>
        {renderContent()}
      </Suspense>
    </main>
  );
};

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

export default DynamicPageRenderer;
