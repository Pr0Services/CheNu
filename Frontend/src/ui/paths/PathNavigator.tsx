/* =========================================
   CHE·NU — PATH NAVIGATOR
   
   Interface utilisateur pour la navigation par chemins.
   
   📜 Le système guide sans jamais contraindre.
   ========================================= */

import React, { useState, useCallback } from 'react';

import {
  usePath,
  PathType,
  PathOption,
  PATHS,
  OPTIONS,
} from '../../core/paths';

// ============================================
// STYLES
// ============================================

const styles = {
  container: {
    padding: '1.5rem',
    backgroundColor: '#1a1a2e',
    borderRadius: '12px',
    color: '#f0f0ff',
    fontFamily: "'Inter', -apple-system, sans-serif",
    maxWidth: '600px',
  } as React.CSSProperties,
  
  header: {
    marginBottom: '1.5rem',
  } as React.CSSProperties,
  
  intention: {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: '#f39c12',
    marginBottom: '0.5rem',
  } as React.CSSProperties,
  
  pathLabel: {
    fontSize: '0.875rem',
    color: '#888',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  } as React.CSSProperties,
  
  pathSelector: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1.5rem',
  } as React.CSSProperties,
  
  pathButton: {
    flex: 1,
    padding: '0.75rem 1rem',
    border: '2px solid #333',
    borderRadius: '8px',
    backgroundColor: 'transparent',
    color: '#aaa',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontSize: '0.875rem',
  } as React.CSSProperties,
  
  pathButtonActive: {
    backgroundColor: '#f39c12',
    borderColor: '#f39c12',
    color: '#1a1a2e',
    fontWeight: 600,
  } as React.CSSProperties,
  
  optionsSection: {
    marginBottom: '1.5rem',
  } as React.CSSProperties,
  
  sectionTitle: {
    fontSize: '0.875rem',
    color: '#666',
    marginBottom: '0.75rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  } as React.CSSProperties,
  
  optionButton: {
    display: 'block',
    width: '100%',
    padding: '1rem',
    marginBottom: '0.5rem',
    border: '1px solid #333',
    borderRadius: '8px',
    backgroundColor: '#252542',
    color: '#e0e0ff',
    textAlign: 'left' as const,
    cursor: 'pointer',
    transition: 'all 0.2s',
  } as React.CSSProperties,
  
  optionQuestion: {
    fontSize: '1rem',
    fontWeight: 500,
    marginBottom: '0.25rem',
  } as React.CSSProperties,
  
  optionDescription: {
    fontSize: '0.875rem',
    color: '#888',
  } as React.CSSProperties,
  
  validationModal: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  } as React.CSSProperties,
  
  validationContent: {
    backgroundColor: '#1a1a2e',
    borderRadius: '16px',
    padding: '2rem',
    maxWidth: '400px',
    textAlign: 'center' as const,
  } as React.CSSProperties,
  
  validationTitle: {
    fontSize: '1.25rem',
    fontWeight: 600,
    marginBottom: '1rem',
    color: '#f39c12',
  } as React.CSSProperties,
  
  validationDescription: {
    marginBottom: '1.5rem',
    color: '#ccc',
  } as React.CSSProperties,
  
  validationButtons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
  } as React.CSSProperties,
  
  confirmButton: {
    padding: '0.75rem 2rem',
    backgroundColor: '#27ae60',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    fontWeight: 600,
    cursor: 'pointer',
  } as React.CSSProperties,
  
  cancelButton: {
    padding: '0.75rem 2rem',
    backgroundColor: 'transparent',
    border: '1px solid #666',
    borderRadius: '8px',
    color: '#aaa',
    cursor: 'pointer',
  } as React.CSSProperties,
  
  retreatButton: {
    padding: '0.5rem 1rem',
    backgroundColor: 'transparent',
    border: '1px solid #666',
    borderRadius: '6px',
    color: '#888',
    cursor: 'pointer',
    fontSize: '0.875rem',
  } as React.CSSProperties,
  
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '1rem',
    borderTop: '1px solid #333',
  } as React.CSSProperties,
  
  law: {
    fontSize: '0.75rem',
    color: '#666',
    fontStyle: 'italic' as const,
  } as React.CSSProperties,
};

// ============================================
// PATH ICONS
// ============================================

const pathIcons: Record<PathType, string> = {
  reprise: '↩️',
  objectif: '🎯',
  exploration: '🔍',
  decision: '⚖️',
};

// ============================================
// COMPONENTS
// ============================================

interface PathButtonProps {
  path: PathType;
  isActive: boolean;
  onClick: () => void;
}

const PathButton: React.FC<PathButtonProps> = ({ path, isActive, onClick }) => {
  const config = PATHS[path];
  
  return (
    <button
      style={{
        ...styles.pathButton,
        ...(isActive ? styles.pathButtonActive : {}),
      }}
      onClick={onClick}
      title={config.intention}
    >
      {pathIcons[path]} {path.charAt(0).toUpperCase()}
    </button>
  );
};

interface OptionButtonProps {
  option: PathOption;
  onClick: () => void;
}

const OptionButton: React.FC<OptionButtonProps> = ({ option, onClick }) => {
  const config = OPTIONS[option];
  
  return (
    <button style={styles.optionButton} onClick={onClick}>
      <div style={styles.optionQuestion}>{config.question}</div>
      <div style={styles.optionDescription}>{config.description}</div>
    </button>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

export const PathNavigator: React.FC = () => {
  const {
    path,
    intention,
    options,
    hasPending,
    pendingValidation,
    enter,
    execute,
    confirm,
    cancel,
    retreat,
    canRetreat,
  } = usePath();
  
  // Handler pour changement de chemin
  const handlePathChange = useCallback((newPath: PathType) => {
    const intentionPhrase = PATHS[newPath].intention;
    enter(newPath, intentionPhrase);
  }, [enter]);
  
  // Handler pour exécution d'option
  const handleOptionClick = useCallback((option: PathOption) => {
    execute(option);
  }, [execute]);
  
  return (
    <div style={styles.container}>
      {/* Header avec intention */}
      <div style={styles.header}>
        <div style={styles.pathLabel}>Chemin actif</div>
        <div style={styles.intention}>
          {pathIcons[path]} {intention}
        </div>
      </div>
      
      {/* Sélecteur de chemins */}
      <div style={styles.pathSelector}>
        {(['reprise', 'objectif', 'exploration', 'decision'] as PathType[]).map((p) => (
          <PathButton
            key={p}
            path={p}
            isActive={path === p}
            onClick={() => handlePathChange(p)}
          />
        ))}
      </div>
      
      {/* Options disponibles */}
      <div style={styles.optionsSection}>
        <div style={styles.sectionTitle}>Options</div>
        {options.map((opt) => (
          <OptionButton
            key={opt}
            option={opt}
            onClick={() => handleOptionClick(opt)}
          />
        ))}
      </div>
      
      {/* Footer */}
      <div style={styles.footer}>
        <span style={styles.law}>📜 Humain {'>'} Système, Toujours</span>
        {canRetreat && (
          <button style={styles.retreatButton} onClick={retreat}>
            ← Reculer
          </button>
        )}
      </div>
      
      {/* Modal de validation */}
      {hasPending && pendingValidation && (
        <div style={styles.validationModal}>
          <div style={styles.validationContent}>
            <div style={styles.validationTitle}>
              Validation requise
            </div>
            <div style={styles.validationDescription}>
              {pendingValidation.description}
            </div>
            <div style={styles.validationButtons}>
              <button style={styles.cancelButton} onClick={cancel}>
                Annuler
              </button>
              <button style={styles.confirmButton} onClick={confirm}>
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PathNavigator;
