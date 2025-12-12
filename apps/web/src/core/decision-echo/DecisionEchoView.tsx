/**
 * CHE·NU — DECISION ECHO VIEW
 * 
 * Status: OBSERVATIONAL DECISION MEMORY
 * Authority: NONE
 * Intent: TRANSPARENCY WITHOUT INFLUENCE
 * 
 * Display Rules Enforced:
 * - Static entries
 * - Chronologically ordered
 * - No highlighting
 * - No emphasis
 * - No urgency
 * - No call-to-action
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';

import {
  DecisionEcho,
  DecisionScope,
  DecisionReversibility,
  ConfirmationMethod,
  DecisionContextType,
  DecisionWorkingMode,
  DecisionEchoQuery,
  EchoDisplayRules,
  DEFAULT_ECHO_DISPLAY_RULES,
  DECISION_ECHO_DECLARATION
} from './decisionEcho.types';

// =============================================================================
// STYLING CONSTANTS
// =============================================================================

/**
 * Neutral color palette - no emphasis, no highlighting
 */
const NEUTRAL_COLORS = {
  background: '#fafafa',
  backgroundAlt: '#f5f5f5',
  border: '#e0e0e0',
  text: '#424242',
  textSecondary: '#757575',
  textMuted: '#9e9e9e',
  divider: '#eeeeee'
} as const;

/**
 * Static styles - enforces display rules
 */
const staticStyles = {
  container: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: NEUTRAL_COLORS.background,
    color: NEUTRAL_COLORS.text,
    padding: '20px',
    maxWidth: '900px',
    margin: '0 auto'
  },
  header: {
    borderBottom: `1px solid ${NEUTRAL_COLORS.border}`,
    paddingBottom: '16px',
    marginBottom: '24px'
  },
  headerTitle: {
    fontSize: '18px',
    fontWeight: 500,
    color: NEUTRAL_COLORS.text,
    margin: 0
  },
  headerSubtitle: {
    fontSize: '13px',
    color: NEUTRAL_COLORS.textSecondary,
    marginTop: '4px'
  },
  filterSection: {
    backgroundColor: NEUTRAL_COLORS.backgroundAlt,
    padding: '12px 16px',
    borderRadius: '4px',
    marginBottom: '20px'
  },
  filterLabel: {
    fontSize: '12px',
    color: NEUTRAL_COLORS.textSecondary,
    marginRight: '8px'
  },
  filterSelect: {
    fontSize: '13px',
    padding: '4px 8px',
    border: `1px solid ${NEUTRAL_COLORS.border}`,
    borderRadius: '4px',
    backgroundColor: 'white',
    marginRight: '16px'
  },
  echoList: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  echoItem: {
    backgroundColor: 'white',
    border: `1px solid ${NEUTRAL_COLORS.border}`,
    borderRadius: '4px',
    padding: '16px',
    marginBottom: '12px'
  },
  echoTimestamp: {
    fontSize: '12px',
    color: NEUTRAL_COLORS.textMuted,
    marginBottom: '8px'
  },
  echoStatement: {
    fontSize: '14px',
    color: NEUTRAL_COLORS.text,
    lineHeight: 1.5,
    marginBottom: '12px'
  },
  echoObjective: {
    fontSize: '13px',
    color: NEUTRAL_COLORS.textSecondary,
    fontStyle: 'italic',
    marginBottom: '12px'
  },
  echoMeta: {
    fontSize: '12px',
    color: NEUTRAL_COLORS.textMuted,
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '16px'
  },
  echoMetaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  contextSection: {
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: `1px solid ${NEUTRAL_COLORS.divider}`
  },
  contextTitle: {
    fontSize: '12px',
    color: NEUTRAL_COLORS.textSecondary,
    marginBottom: '8px'
  },
  contextGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '8px'
  },
  contextItem: {
    fontSize: '12px',
    color: NEUTRAL_COLORS.textMuted
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '16px',
    marginTop: '20px',
    paddingTop: '16px',
    borderTop: `1px solid ${NEUTRAL_COLORS.border}`
  },
  paginationButton: {
    fontSize: '13px',
    padding: '6px 12px',
    border: `1px solid ${NEUTRAL_COLORS.border}`,
    borderRadius: '4px',
    backgroundColor: 'white',
    color: NEUTRAL_COLORS.text,
    cursor: 'pointer'
  },
  paginationButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed'
  },
  paginationInfo: {
    fontSize: '13px',
    color: NEUTRAL_COLORS.textSecondary
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '40px 20px',
    color: NEUTRAL_COLORS.textSecondary
  },
  declaration: {
    fontSize: '12px',
    color: NEUTRAL_COLORS.textMuted,
    fontStyle: 'italic',
    textAlign: 'center' as const,
    padding: '16px',
    marginTop: '24px',
    borderTop: `1px solid ${NEUTRAL_COLORS.border}`,
    whiteSpace: 'pre-line' as const
  },
  detail: {
    padding: '20px',
    backgroundColor: 'white',
    border: `1px solid ${NEUTRAL_COLORS.border}`,
    borderRadius: '4px'
  },
  detailSection: {
    marginBottom: '16px'
  },
  detailLabel: {
    fontSize: '11px',
    color: NEUTRAL_COLORS.textMuted,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    marginBottom: '4px'
  },
  detailValue: {
    fontSize: '14px',
    color: NEUTRAL_COLORS.text
  },
  backButton: {
    fontSize: '13px',
    color: NEUTRAL_COLORS.textSecondary,
    background: 'none',
    border: 'none',
    padding: '0',
    cursor: 'pointer',
    marginBottom: '16px'
  }
} as const;

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Format timestamp for display
 */
function formatTimestamp(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleString('fr-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

/**
 * Format scope for display
 */
function formatScope(scope: DecisionScope): string {
  const labels: Record<DecisionScope, string> = {
    [DecisionScope.SESSION]: 'Session',
    [DecisionScope.PROJECT]: 'Projet',
    [DecisionScope.SPHERE]: 'Sphère',
    [DecisionScope.SYSTEM]: 'Système'
  };
  return labels[scope] || scope;
}

/**
 * Format reversibility for display
 */
function formatReversibility(rev: DecisionReversibility): string {
  const labels: Record<DecisionReversibility, string> = {
    [DecisionReversibility.YES]: 'Réversible',
    [DecisionReversibility.PARTIAL]: 'Partiellement',
    [DecisionReversibility.NO]: 'Irréversible'
  };
  return labels[rev] || rev;
}

/**
 * Format confirmation method for display
 */
function formatConfirmation(method: ConfirmationMethod): string {
  const labels: Record<ConfirmationMethod, string> = {
    [ConfirmationMethod.EXPLICIT]: 'Explicite',
    [ConfirmationMethod.PROCEDURAL]: 'Procédural'
  };
  return labels[method] || method;
}

/**
 * Format context type for display
 */
function formatContextType(type: DecisionContextType): string {
  const labels: Record<DecisionContextType, string> = {
    [DecisionContextType.PLANNING]: 'Planification',
    [DecisionContextType.EXECUTION]: 'Exécution',
    [DecisionContextType.REVIEW]: 'Révision',
    [DecisionContextType.EMERGENCY]: 'Urgence',
    [DecisionContextType.STANDARD]: 'Standard'
  };
  return labels[type] || type;
}

/**
 * Format working mode for display
 */
function formatWorkingMode(mode: DecisionWorkingMode): string {
  const labels: Record<DecisionWorkingMode, string> = {
    [DecisionWorkingMode.SOLO]: 'Solo',
    [DecisionWorkingMode.COLLABORATIVE]: 'Collaboratif',
    [DecisionWorkingMode.SUPERVISED]: 'Supervisé',
    [DecisionWorkingMode.AUTONOMOUS_LIMITED]: 'Autonome limité'
  };
  return labels[mode] || mode;
}

// =============================================================================
// COMPONENT PROPS
// =============================================================================

export interface DecisionEchoViewProps {
  /** Echoes to display */
  echoes: ReadonlyArray<DecisionEcho>;
  
  /** Total count for pagination */
  totalCount?: number;
  
  /** Current offset */
  offset?: number;
  
  /** Page size */
  pageSize?: number;
  
  /** Callback when page changes */
  onPageChange?: (newOffset: number) => void;
  
  /** Callback when filter changes */
  onFilterChange?: (query: Partial<DecisionEchoQuery>) => void;
  
  /** Whether loading */
  loading?: boolean;
  
  /** Show filters */
  showFilters?: boolean;
  
  /** Show context details */
  showContextDetails?: boolean;
  
  /** Display rules override (still enforces core rules) */
  displayRules?: Partial<EchoDisplayRules>;
}

export interface DecisionEchoDetailProps {
  /** Echo to display */
  echo: DecisionEcho;
  
  /** Callback to go back */
  onBack?: () => void;
}

export interface DecisionEchoItemProps {
  /** Echo to display */
  echo: DecisionEcho;
  
  /** Callback when clicked */
  onClick?: (echoId: string) => void;
  
  /** Show context details */
  showContext?: boolean;
}

// =============================================================================
// SINGLE ECHO ITEM
// =============================================================================

/**
 * Single Decision Echo item
 * Static, no highlighting, no emphasis
 */
export const DecisionEchoItem: React.FC<DecisionEchoItemProps> = ({
  echo,
  onClick,
  showContext = false
}) => {
  const handleClick = useCallback(() => {
    if (onClick) {
      onClick(echo.decisionId);
    }
  }, [echo.decisionId, onClick]);
  
  return (
    <li 
      style={{
        ...staticStyles.echoItem,
        cursor: onClick ? 'pointer' : 'default'
      }}
      onClick={handleClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* Timestamp - factual, not emphasized */}
      <div style={staticStyles.echoTimestamp}>
        {formatTimestamp(echo.timestamp)}
      </div>
      
      {/* Decision Statement */}
      <div style={staticStyles.echoStatement}>
        {echo.decisionStatement}
      </div>
      
      {/* Declared Objective */}
      <div style={staticStyles.echoObjective}>
        Objectif: {echo.declaredObjective}
      </div>
      
      {/* Metadata - no emphasis */}
      <div style={staticStyles.echoMeta}>
        <span style={staticStyles.echoMetaItem}>
          <span>Portée:</span>
          <span>{formatScope(echo.scope)}</span>
        </span>
        <span style={staticStyles.echoMetaItem}>
          <span>Par:</span>
          <span>{echo.decidedBy}</span>
        </span>
        <span style={staticStyles.echoMetaItem}>
          <span>Réversibilité:</span>
          <span>{formatReversibility(echo.reversibility)}</span>
        </span>
        <span style={staticStyles.echoMetaItem}>
          <span>Confirmation:</span>
          <span>{formatConfirmation(echo.confirmationMethod)}</span>
        </span>
        {echo.domain && (
          <span style={staticStyles.echoMetaItem}>
            <span>Domaine:</span>
            <span>{echo.domain}</span>
          </span>
        )}
      </div>
      
      {/* Context Details (optional) */}
      {showContext && (
        <div style={staticStyles.contextSection}>
          <div style={staticStyles.contextTitle}>Contexte au moment de la décision</div>
          <div style={staticStyles.contextGrid}>
            <div style={staticStyles.contextItem}>
              Type: {formatContextType(echo.contextSnapshot.contextType)}
            </div>
            <div style={staticStyles.contextItem}>
              Mode: {formatWorkingMode(echo.contextSnapshot.workingMode)}
            </div>
            {echo.contextSnapshot.activeSphere && (
              <div style={staticStyles.contextItem}>
                Sphère: {echo.contextSnapshot.activeSphere}
              </div>
            )}
            {echo.contextSnapshot.activeProject && (
              <div style={staticStyles.contextItem}>
                Projet: {echo.contextSnapshot.activeProject}
              </div>
            )}
            <div style={staticStyles.contextItem}>
              Session: {echo.contextSnapshot.sessionId.substring(0, 8)}...
            </div>
          </div>
        </div>
      )}
    </li>
  );
};

// =============================================================================
// ECHO DETAIL VIEW
// =============================================================================

/**
 * Detailed view of a single Decision Echo
 * Complete record, no analysis, no recommendations
 */
export const DecisionEchoDetail: React.FC<DecisionEchoDetailProps> = ({
  echo,
  onBack
}) => {
  const constraints = echo.contextSnapshot.constraints;
  const allConstraints = [
    ...constraints.timeConstraints,
    ...constraints.resourceConstraints,
    ...constraints.regulatoryConstraints,
    ...constraints.technicalConstraints,
    ...constraints.declaredConstraints
  ];
  
  return (
    <div style={staticStyles.detail}>
      {/* Back button */}
      {onBack && (
        <button 
          style={staticStyles.backButton}
          onClick={onBack}
          type="button"
        >
          ← Retour à la liste
        </button>
      )}
      
      {/* Decision ID */}
      <div style={staticStyles.detailSection}>
        <div style={staticStyles.detailLabel}>Identifiant</div>
        <div style={staticStyles.detailValue}>{echo.decisionId}</div>
      </div>
      
      {/* Timestamp */}
      <div style={staticStyles.detailSection}>
        <div style={staticStyles.detailLabel}>Horodatage</div>
        <div style={staticStyles.detailValue}>{formatTimestamp(echo.timestamp)}</div>
      </div>
      
      {/* Decision Statement */}
      <div style={staticStyles.detailSection}>
        <div style={staticStyles.detailLabel}>Décision</div>
        <div style={staticStyles.detailValue}>{echo.decisionStatement}</div>
      </div>
      
      {/* Declared Objective */}
      <div style={staticStyles.detailSection}>
        <div style={staticStyles.detailLabel}>Objectif déclaré</div>
        <div style={staticStyles.detailValue}>{echo.declaredObjective}</div>
      </div>
      
      {/* Decided By */}
      <div style={staticStyles.detailSection}>
        <div style={staticStyles.detailLabel}>Décidé par</div>
        <div style={staticStyles.detailValue}>{echo.decidedBy}</div>
      </div>
      
      {/* Scope */}
      <div style={staticStyles.detailSection}>
        <div style={staticStyles.detailLabel}>Portée</div>
        <div style={staticStyles.detailValue}>{formatScope(echo.scope)}</div>
      </div>
      
      {/* Reversibility */}
      <div style={staticStyles.detailSection}>
        <div style={staticStyles.detailLabel}>Réversibilité</div>
        <div style={staticStyles.detailValue}>{formatReversibility(echo.reversibility)}</div>
      </div>
      
      {/* Confirmation Method */}
      <div style={staticStyles.detailSection}>
        <div style={staticStyles.detailLabel}>Méthode de confirmation</div>
        <div style={staticStyles.detailValue}>{formatConfirmation(echo.confirmationMethod)}</div>
      </div>
      
      {/* Domain */}
      {echo.domain && (
        <div style={staticStyles.detailSection}>
          <div style={staticStyles.detailLabel}>Domaine</div>
          <div style={staticStyles.detailValue}>{echo.domain}</div>
        </div>
      )}
      
      {/* Context Snapshot */}
      <div style={staticStyles.detailSection}>
        <div style={staticStyles.detailLabel}>Contexte</div>
        <div style={staticStyles.contextGrid}>
          <div style={staticStyles.contextItem}>
            Type: {formatContextType(echo.contextSnapshot.contextType)}
          </div>
          <div style={staticStyles.contextItem}>
            Mode: {formatWorkingMode(echo.contextSnapshot.workingMode)}
          </div>
          {echo.contextSnapshot.activeSphere && (
            <div style={staticStyles.contextItem}>
              Sphère: {echo.contextSnapshot.activeSphere}
            </div>
          )}
          {echo.contextSnapshot.activeProject && (
            <div style={staticStyles.contextItem}>
              Projet: {echo.contextSnapshot.activeProject}
            </div>
          )}
          <div style={staticStyles.contextItem}>
            Session: {echo.contextSnapshot.sessionId}
          </div>
        </div>
      </div>
      
      {/* Context Tags */}
      {echo.contextSnapshot.contextTags.length > 0 && (
        <div style={staticStyles.detailSection}>
          <div style={staticStyles.detailLabel}>Tags contextuels</div>
          <div style={staticStyles.detailValue}>
            {echo.contextSnapshot.contextTags.join(', ')}
          </div>
        </div>
      )}
      
      {/* Constraints */}
      {allConstraints.length > 0 && (
        <div style={staticStyles.detailSection}>
          <div style={staticStyles.detailLabel}>Contraintes actives</div>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {allConstraints.map((constraint, idx) => (
              <li key={idx} style={staticStyles.contextItem}>{constraint}</li>
            ))}
          </ul>
        </div>
      )}
      
      {/* References */}
      {echo.references && echo.references.length > 0 && (
        <div style={staticStyles.detailSection}>
          <div style={staticStyles.detailLabel}>Références</div>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {echo.references.map((ref, idx) => (
              <li key={idx} style={staticStyles.contextItem}>{ref}</li>
            ))}
          </ul>
        </div>
      )}
      
      {/* System Declaration */}
      <div style={staticStyles.declaration}>
        {DECISION_ECHO_DECLARATION}
      </div>
    </div>
  );
};

// =============================================================================
// FILTER BAR
// =============================================================================

interface FilterBarProps {
  onFilterChange?: (query: Partial<DecisionEchoQuery>) => void;
  currentFilters?: Partial<DecisionEchoQuery>;
}

const FilterBar: React.FC<FilterBarProps> = ({
  onFilterChange,
  currentFilters = {}
}) => {
  const handleScopeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onFilterChange?.({
      scope: value ? (value as DecisionScope) : undefined
    });
  }, [onFilterChange]);
  
  return (
    <div style={staticStyles.filterSection}>
      <span style={staticStyles.filterLabel}>Portée:</span>
      <select 
        style={staticStyles.filterSelect}
        onChange={handleScopeChange}
        value={currentFilters.scope || ''}
      >
        <option value="">Toutes</option>
        <option value={DecisionScope.SESSION}>Session</option>
        <option value={DecisionScope.PROJECT}>Projet</option>
        <option value={DecisionScope.SPHERE}>Sphère</option>
        <option value={DecisionScope.SYSTEM}>Système</option>
      </select>
    </div>
  );
};

// =============================================================================
// MAIN VIEW COMPONENT
// =============================================================================

/**
 * Decision Echo View
 * 
 * Main component for displaying Decision Echoes
 * Enforces display rules:
 * - Static entries
 * - Chronologically ordered
 * - No highlighting
 * - No emphasis
 * - No urgency
 * - No call-to-action
 */
export const DecisionEchoView: React.FC<DecisionEchoViewProps> = ({
  echoes,
  totalCount = echoes.length,
  offset = 0,
  pageSize = 20,
  onPageChange,
  onFilterChange,
  loading = false,
  showFilters = true,
  showContextDetails = false
}) => {
  const [selectedEchoId, setSelectedEchoId] = useState<string | null>(null);
  const [filters, setFilters] = useState<Partial<DecisionEchoQuery>>({});
  
  // Find selected echo
  const selectedEcho = useMemo(() => {
    if (!selectedEchoId) return null;
    return echoes.find(e => e.decisionId === selectedEchoId) || null;
  }, [echoes, selectedEchoId]);
  
  // Handle echo selection
  const handleEchoClick = useCallback((echoId: string) => {
    setSelectedEchoId(echoId);
  }, []);
  
  // Handle back from detail
  const handleBack = useCallback(() => {
    setSelectedEchoId(null);
  }, []);
  
  // Handle filter change
  const handleFilterChange = useCallback((newFilters: Partial<DecisionEchoQuery>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    onFilterChange?.(newFilters);
  }, [onFilterChange]);
  
  // Pagination
  const hasPrevPage = offset > 0;
  const hasNextPage = offset + pageSize < totalCount;
  
  const handlePrevPage = useCallback(() => {
    if (hasPrevPage && onPageChange) {
      onPageChange(Math.max(0, offset - pageSize));
    }
  }, [hasPrevPage, onPageChange, offset, pageSize]);
  
  const handleNextPage = useCallback(() => {
    if (hasNextPage && onPageChange) {
      onPageChange(offset + pageSize);
    }
  }, [hasNextPage, onPageChange, offset, pageSize]);
  
  // If detail view
  if (selectedEcho) {
    return (
      <div style={staticStyles.container}>
        <DecisionEchoDetail 
          echo={selectedEcho} 
          onBack={handleBack} 
        />
      </div>
    );
  }
  
  return (
    <div style={staticStyles.container}>
      {/* Header */}
      <header style={staticStyles.header}>
        <h1 style={staticStyles.headerTitle}>Decision Echo</h1>
        <p style={staticStyles.headerSubtitle}>
          Mémoire observationnelle des décisions — Transparence sans influence
        </p>
      </header>
      
      {/* Filters */}
      {showFilters && (
        <FilterBar 
          onFilterChange={handleFilterChange}
          currentFilters={filters}
        />
      )}
      
      {/* Loading */}
      {loading && (
        <div style={staticStyles.emptyState}>
          Chargement...
        </div>
      )}
      
      {/* Empty State */}
      {!loading && echoes.length === 0 && (
        <div style={staticStyles.emptyState}>
          Aucune décision enregistrée.
        </div>
      )}
      
      {/* Echo List - Chronologically ordered */}
      {!loading && echoes.length > 0 && (
        <ul style={staticStyles.echoList}>
          {echoes.map(echo => (
            <DecisionEchoItem
              key={echo.decisionId}
              echo={echo}
              onClick={handleEchoClick}
              showContext={showContextDetails}
            />
          ))}
        </ul>
      )}
      
      {/* Pagination */}
      {totalCount > pageSize && (
        <div style={staticStyles.pagination}>
          <button
            style={{
              ...staticStyles.paginationButton,
              ...(hasPrevPage ? {} : staticStyles.paginationButtonDisabled)
            }}
            onClick={handlePrevPage}
            disabled={!hasPrevPage}
            type="button"
          >
            ← Précédent
          </button>
          <span style={staticStyles.paginationInfo}>
            {offset + 1} - {Math.min(offset + pageSize, totalCount)} sur {totalCount}
          </span>
          <button
            style={{
              ...staticStyles.paginationButton,
              ...(hasNextPage ? {} : staticStyles.paginationButtonDisabled)
            }}
            onClick={handleNextPage}
            disabled={!hasNextPage}
            type="button"
          >
            Suivant →
          </button>
        </div>
      )}
      
      {/* System Declaration */}
      <div style={staticStyles.declaration}>
        {DECISION_ECHO_DECLARATION}
      </div>
    </div>
  );
};

// =============================================================================
// XR MARKER COMPONENT (Optional)
// =============================================================================

export interface EchoXRMarkerProps {
  /** Echo to display */
  echo: DecisionEcho;
  
  /** Position in 3D space */
  position: { x: number; y: number; z: number };
  
  /** Callback when marker is selected */
  onSelect?: (echoId: string) => void;
}

/**
 * XR Marker for Decision Echo
 * 
 * In XR:
 * - Appears as fixed marker
 * - No directional arrows
 * - No glow or reward signals
 * - Markers are landmarks, not milestones
 */
export const EchoXRMarker: React.FC<EchoXRMarkerProps> = ({
  echo,
  position,
  onSelect
}) => {
  // This would integrate with WebXR or Three.js
  // Placeholder for structure
  
  return (
    <div
      data-echo-marker
      data-echo-id={echo.decisionId}
      data-position={JSON.stringify(position)}
      style={{
        // Fixed marker style - neutral, no emphasis
        position: 'absolute',
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        backgroundColor: NEUTRAL_COLORS.textMuted,
        border: `2px solid ${NEUTRAL_COLORS.border}`,
        // No glow
        boxShadow: 'none',
        // No animation
        animation: 'none',
        cursor: onSelect ? 'pointer' : 'default'
      }}
      onClick={() => onSelect?.(echo.decisionId)}
      title={echo.decisionStatement}
    />
  );
};

// =============================================================================
// DEFAULT EXPORT
// =============================================================================

export default DecisionEchoView;
