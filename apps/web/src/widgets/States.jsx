import React from 'react';
import { colors, radius, space, typography, shadows } from '../design-system/tokens';
import { Button } from './Button';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — UI KIT: ÉTATS UI
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * États obligatoires selon le Developer Guide:
 * - Loading
 * - Empty
 * - Error
 * - Success
 * - No Results
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ─────────────────────────────────────────────────────────────────────────────
// LOADING STATE
// ─────────────────────────────────────────────────────────────────────────────

export function LoadingState({
  message = 'Chargement...',
  size = 'md', // sm, md, lg
  inline = false,
  style,
}) {
  const sizes = {
    sm: { spinner: '24px', fontSize: typography.fontSize.sm, padding: space.md },
    md: { spinner: '40px', fontSize: typography.fontSize.base, padding: space.xl },
    lg: { spinner: '56px', fontSize: typography.fontSize.lg, padding: space['2xl'] },
  };
  
  const s = sizes[size];

  if (inline) {
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: space.sm,
        color: colors.text.secondary,
        fontSize: s.fontSize,
        ...style,
      }}>
        <Spinner size={s.spinner} />
        {message}
      </span>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: s.padding,
      textAlign: 'center',
      ...style,
    }}>
      <Spinner size={s.spinner} />
      {message && (
        <p style={{
          margin: `${space.md} 0 0`,
          color: colors.text.secondary,
          fontSize: s.fontSize,
        }}>
          {message}
        </p>
      )}
    </div>
  );
}

// Spinner Component
function Spinner({ size = '40px', color = colors.sacredGold }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 50 50"
      style={{ animation: 'chenu-spinner 1s linear infinite' }}
    >
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke={colors.background.tertiary}
        strokeWidth="4"
      />
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeDasharray="31.4 94.2"
        strokeLinecap="round"
      />
      <style>
        {`
          @keyframes chenu-spinner {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON LOADING
// ─────────────────────────────────────────────────────────────────────────────

export function Skeleton({
  width = '100%',
  height = '20px',
  borderRadius = radius.md,
  style,
}) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        background: `linear-gradient(90deg, 
          ${colors.background.tertiary} 0%, 
          ${colors.background.elevated} 50%, 
          ${colors.background.tertiary} 100%)`,
        backgroundSize: '200% 100%',
        animation: 'chenu-skeleton 1.5s ease-in-out infinite',
        ...style,
      }}
    >
      <style>
        {`
          @keyframes chenu-skeleton {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}
      </style>
    </div>
  );
}

export function SkeletonText({ lines = 3, style }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: space.sm, ...style }}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          width={i === lines - 1 ? '60%' : '100%'} 
          height="16px"
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ style }) {
  return (
    <div style={{
      padding: space.lg,
      background: colors.background.secondary,
      borderRadius: radius.lg,
      border: `1px solid ${colors.border.default}`,
      ...style,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: space.md, marginBottom: space.md }}>
        <Skeleton width="48px" height="48px" borderRadius={radius.md} />
        <div style={{ flex: 1 }}>
          <Skeleton width="60%" height="18px" style={{ marginBottom: space.xs }} />
          <Skeleton width="40%" height="14px" />
        </div>
      </div>
      <SkeletonText lines={2} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EMPTY STATE
// ─────────────────────────────────────────────────────────────────────────────

export function EmptyState({
  icon = '📭',
  title = 'Aucun élément',
  description,
  action,
  actionLabel,
  onAction,
  style,
}) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: space['2xl'],
      textAlign: 'center',
      ...style,
    }}>
      <div style={{
        width: '80px',
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: colors.background.tertiary,
        borderRadius: radius.xl,
        marginBottom: space.lg,
      }}>
        <span style={{ fontSize: '36px', opacity: 0.7 }}>{icon}</span>
      </div>
      
      <h3 style={{
        margin: '0 0 8px',
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.semibold,
        color: colors.text.primary,
      }}>
        {title}
      </h3>
      
      {description && (
        <p style={{
          margin: '0 0 20px',
          fontSize: typography.fontSize.base,
          color: colors.text.secondary,
          maxWidth: '300px',
          lineHeight: 1.5,
        }}>
          {description}
        </p>
      )}
      
      {(action || onAction) && (
        <Button 
          variant="primary" 
          onClick={onAction}
          leftIcon="➕"
        >
          {actionLabel || action || 'Créer'}
        </Button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ERROR STATE
// ─────────────────────────────────────────────────────────────────────────────

export function ErrorState({
  icon = '⚠️',
  title = 'Une erreur est survenue',
  message,
  error,
  onRetry,
  retryLabel = 'Réessayer',
  style,
}) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: space['2xl'],
      textAlign: 'center',
      ...style,
    }}>
      <div style={{
        width: '80px',
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: colors.status.errorBg,
        borderRadius: radius.xl,
        marginBottom: space.lg,
      }}>
        <span style={{ fontSize: '36px' }}>{icon}</span>
      </div>
      
      <h3 style={{
        margin: '0 0 8px',
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.semibold,
        color: colors.status.error,
      }}>
        {title}
      </h3>
      
      {(message || error) && (
        <p style={{
          margin: '0 0 20px',
          fontSize: typography.fontSize.base,
          color: colors.text.secondary,
          maxWidth: '400px',
          lineHeight: 1.5,
        }}>
          {message || error?.message || String(error)}
        </p>
      )}
      
      {onRetry && (
        <Button 
          variant="secondary" 
          onClick={onRetry}
          leftIcon="🔄"
        >
          {retryLabel}
        </Button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUCCESS STATE
// ─────────────────────────────────────────────────────────────────────────────

export function SuccessState({
  icon = '✅',
  title = 'Succès!',
  message,
  action,
  actionLabel,
  onAction,
  style,
}) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: space['2xl'],
      textAlign: 'center',
      ...style,
    }}>
      <div style={{
        width: '80px',
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: colors.status.successBg,
        borderRadius: '50%',
        marginBottom: space.lg,
        animation: 'chenu-success-pop 400ms ease',
      }}>
        <span style={{ fontSize: '40px' }}>{icon}</span>
      </div>
      
      <h3 style={{
        margin: '0 0 8px',
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.semibold,
        color: colors.jungleEmerald,
      }}>
        {title}
      </h3>
      
      {message && (
        <p style={{
          margin: '0 0 20px',
          fontSize: typography.fontSize.base,
          color: colors.text.secondary,
          maxWidth: '300px',
          lineHeight: 1.5,
        }}>
          {message}
        </p>
      )}
      
      {(action || onAction) && (
        <Button 
          variant="success" 
          onClick={onAction}
        >
          {actionLabel || action || 'Continuer'}
        </Button>
      )}
      
      <style>
        {`
          @keyframes chenu-success-pop {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NO RESULTS STATE
// ─────────────────────────────────────────────────────────────────────────────

export function NoResultsState({
  query,
  icon = '🔍',
  title,
  suggestions = [],
  onClear,
  style,
}) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: space['2xl'],
      textAlign: 'center',
      ...style,
    }}>
      <div style={{
        width: '80px',
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: colors.background.tertiary,
        borderRadius: radius.xl,
        marginBottom: space.lg,
      }}>
        <span style={{ fontSize: '36px', opacity: 0.5 }}>{icon}</span>
      </div>
      
      <h3 style={{
        margin: '0 0 8px',
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.semibold,
        color: colors.text.primary,
      }}>
        {title || `Aucun résultat pour "${query}"`}
      </h3>
      
      <p style={{
        margin: '0 0 16px',
        fontSize: typography.fontSize.base,
        color: colors.text.secondary,
        maxWidth: '300px',
        lineHeight: 1.5,
      }}>
        Essayez avec d'autres termes ou vérifiez l'orthographe.
      </p>
      
      {suggestions.length > 0 && (
        <div style={{ marginBottom: space.md }}>
          <p style={{ 
            fontSize: typography.fontSize.sm, 
            color: colors.text.muted,
            marginBottom: space.sm,
          }}>
            Suggestions:
          </p>
          <div style={{ display: 'flex', gap: space.xs, flexWrap: 'wrap', justifyContent: 'center' }}>
            {suggestions.map((s, i) => (
              <span
                key={i}
                style={{
                  padding: '4px 12px',
                  background: colors.background.tertiary,
                  borderRadius: radius.full,
                  fontSize: typography.fontSize.sm,
                  color: colors.text.secondary,
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {onClear && (
        <Button 
          variant="ghost" 
          onClick={onClear}
          leftIcon="✕"
        >
          Effacer la recherche
        </Button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE LOADER (Full page)
// ─────────────────────────────────────────────────────────────────────────────

export function PageLoader({ message = 'Chargement...' }) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: colors.darkSlate,
      zIndex: 9999,
    }}>
      <div style={{
        width: '60px',
        height: '60px',
        marginBottom: space.lg,
      }}>
        <Spinner size="60px" />
      </div>
      
      <p style={{
        color: colors.text.secondary,
        fontSize: typography.fontSize.md,
      }}>
        {message}
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

export { Spinner };
export default LoadingState;
