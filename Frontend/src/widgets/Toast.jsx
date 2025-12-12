import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { colors, radius, shadows, transitions, space, typography, zIndex } from '../design-system/tokens';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — SYSTÈME DE NOTIFICATIONS / TOAST
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Features:
 * - Types: success, error, warning, info, loading
 * - Position configurable
 * - Auto-dismiss avec timer
 * - Actions intégrées
 * - Stacking intelligent
 * - Animations fluides
 * 
 * Usage:
 *   const { toast } = useToast();
 *   toast.success('Projet créé avec succès!');
 *   toast.error('Une erreur est survenue', { action: { label: 'Réessayer', onClick: retry } });
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ─────────────────────────────────────────────────────────────────────────────
// TOAST CONTEXT
// ─────────────────────────────────────────────────────────────────────────────

const ToastContext = createContext(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

// ─────────────────────────────────────────────────────────────────────────────
// TOAST PROVIDER
// ─────────────────────────────────────────────────────────────────────────────

export function ToastProvider({ 
  children, 
  position = 'bottom-right',
  maxToasts = 5,
}) {
  const [toasts, setToasts] = useState([]);

  // Ajouter un toast
  const addToast = useCallback((toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast = {
      id,
      duration: 5000,
      ...toast,
    };

    setToasts(prev => {
      const updated = [newToast, ...prev];
      return updated.slice(0, maxToasts);
    });

    return id;
  }, [maxToasts]);

  // Supprimer un toast
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Mettre à jour un toast
  const updateToast = useCallback((id, updates) => {
    setToasts(prev => prev.map(t => 
      t.id === id ? { ...t, ...updates } : t
    ));
  }, []);

  // Supprimer tous les toasts
  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // API simplifiée
  const toast = {
    show: (message, options = {}) => addToast({ message, type: 'info', ...options }),
    success: (message, options = {}) => addToast({ message, type: 'success', ...options }),
    error: (message, options = {}) => addToast({ message, type: 'error', duration: 8000, ...options }),
    warning: (message, options = {}) => addToast({ message, type: 'warning', ...options }),
    info: (message, options = {}) => addToast({ message, type: 'info', ...options }),
    loading: (message, options = {}) => addToast({ message, type: 'loading', duration: null, ...options }),
    promise: async (promise, { loading, success, error }) => {
      const id = addToast({ message: loading, type: 'loading', duration: null });
      try {
        const result = await promise;
        updateToast(id, { 
          message: typeof success === 'function' ? success(result) : success, 
          type: 'success',
          duration: 5000,
        });
        return result;
      } catch (err) {
        updateToast(id, { 
          message: typeof error === 'function' ? error(err) : error, 
          type: 'error',
          duration: 8000,
        });
        throw err;
      }
    },
    dismiss: removeToast,
    clear: clearToasts,
  };

  return (
    <ToastContext.Provider value={{ toast, toasts, removeToast }}>
      {children}
      <ToastContainer 
        toasts={toasts} 
        position={position} 
        onRemove={removeToast} 
      />
    </ToastContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TOAST CONTAINER
// ─────────────────────────────────────────────────────────────────────────────

function ToastContainer({ toasts, position, onRemove }) {
  const positions = {
    'top-left': { top: space.lg, left: space.lg },
    'top-center': { top: space.lg, left: '50%', transform: 'translateX(-50%)' },
    'top-right': { top: space.lg, right: space.lg },
    'bottom-left': { bottom: space.lg, left: space.lg },
    'bottom-center': { bottom: space.lg, left: '50%', transform: 'translateX(-50%)' },
    'bottom-right': { bottom: space.lg, right: space.lg },
  };

  const isTop = position.startsWith('top');

  return (
    <div
      role="region"
      aria-label="Notifications"
      aria-live="polite"
      style={{
        position: 'fixed',
        ...positions[position],
        display: 'flex',
        flexDirection: isTop ? 'column' : 'column-reverse',
        gap: space.sm,
        zIndex: zIndex.toast,
        pointerEvents: 'none',
      }}
    >
      {toasts.map((toast, index) => (
        <Toast
          key={toast.id}
          {...toast}
          index={index}
          onRemove={() => onRemove(toast.id)}
          isTop={isTop}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TOAST COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

function Toast({
  id,
  message,
  title,
  type = 'info',
  duration = 5000,
  action,
  onRemove,
  index,
  isTop,
}) {
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);

  // Auto-dismiss
  useEffect(() => {
    if (!duration) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      
      if (remaining <= 0) {
        clearInterval(interval);
        handleClose();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onRemove, 200);
  };

  // Styles par type
  const typeStyles = {
    success: {
      icon: '✓',
      iconBg: colors.status.successBg,
      iconColor: colors.jungleEmerald,
      borderColor: colors.jungleEmerald,
    },
    error: {
      icon: '✕',
      iconBg: colors.status.errorBg,
      iconColor: colors.status.error,
      borderColor: colors.status.error,
    },
    warning: {
      icon: '⚠',
      iconBg: colors.status.warningBg,
      iconColor: colors.sacredGold,
      borderColor: colors.sacredGold,
    },
    info: {
      icon: 'ℹ',
      iconBg: colors.status.infoBg,
      iconColor: colors.cenoteTurquoise,
      borderColor: colors.cenoteTurquoise,
    },
    loading: {
      icon: null,
      iconBg: colors.background.tertiary,
      iconColor: colors.sacredGold,
      borderColor: colors.sacredGold,
    },
  };

  const style = typeStyles[type] || typeStyles.info;

  return (
    <div
      role="alert"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: space.sm,
        padding: space.md,
        minWidth: '320px',
        maxWidth: '420px',
        background: colors.background.secondary,
        borderRadius: radius.lg,
        boxShadow: shadows.lg,
        borderLeft: `4px solid ${style.borderColor}`,
        pointerEvents: 'auto',
        animation: isExiting 
          ? 'chenu-toast-exit 200ms ease forwards'
          : `chenu-toast-enter 200ms ease`,
        opacity: isExiting ? 0 : 1,
        transform: isExiting ? 'translateX(100%)' : 'translateX(0)',
      }}
    >
      {/* Icon */}
      <div style={{
        width: '32px',
        height: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: style.iconBg,
        borderRadius: radius.md,
        flexShrink: 0,
      }}>
        {type === 'loading' ? (
          <Spinner size="18px" color={style.iconColor} />
        ) : (
          <span style={{ 
            color: style.iconColor, 
            fontSize: '16px',
            fontWeight: 'bold',
          }}>
            {style.icon}
          </span>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && (
          <div style={{
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.semibold,
            color: colors.text.primary,
            marginBottom: '2px',
          }}>
            {title}
          </div>
        )}
        <div style={{
          fontSize: typography.fontSize.sm,
          color: title ? colors.text.secondary : colors.text.primary,
          lineHeight: 1.4,
          wordBreak: 'break-word',
        }}>
          {message}
        </div>
        
        {/* Action */}
        {action && (
          <button
            onClick={() => {
              action.onClick?.();
              if (action.dismissOnClick !== false) handleClose();
            }}
            style={{
              marginTop: space.xs,
              padding: '4px 0',
              background: 'none',
              border: 'none',
              color: style.iconColor,
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.medium,
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            {action.label}
          </button>
        )}
      </div>

      {/* Close button */}
      <button
        onClick={handleClose}
        aria-label="Fermer"
        style={{
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'none',
          border: 'none',
          borderRadius: radius.sm,
          color: colors.text.muted,
          cursor: 'pointer',
          flexShrink: 0,
          transition: transitions.fast,
        }}
        onMouseEnter={e => e.target.style.background = colors.background.tertiary}
        onMouseLeave={e => e.target.style.background = 'none'}
      >
        ✕
      </button>

      {/* Progress bar */}
      {duration && (
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: colors.background.tertiary,
          borderRadius: `0 0 ${radius.lg} ${radius.lg}`,
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            background: style.borderColor,
            transition: 'width 50ms linear',
          }} />
        </div>
      )}

      {/* Animations */}
      <style>
        {`
          @keyframes chenu-toast-enter {
            from {
              opacity: 0;
              transform: translateX(100%);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @keyframes chenu-toast-exit {
            from {
              opacity: 1;
              transform: translateX(0);
            }
            to {
              opacity: 0;
              transform: translateX(100%);
            }
          }
        `}
      </style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SPINNER (pour loading toast)
// ─────────────────────────────────────────────────────────────────────────────

function Spinner({ size = '18px', color = colors.sacredGold }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ animation: 'chenu-spin 1s linear infinite' }}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="none"
        stroke={colors.background.tertiary}
        strokeWidth="3"
      />
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeDasharray="31.4 31.4"
        strokeLinecap="round"
      />
      <style>
        {`@keyframes chenu-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}
      </style>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NOTIFICATION BADGE
// ─────────────────────────────────────────────────────────────────────────────

export function NotificationBadge({ count, max = 99, style }) {
  if (!count || count <= 0) return null;
  
  const displayCount = count > max ? `${max}+` : count;
  
  return (
    <span style={{
      position: 'absolute',
      top: '-4px',
      right: '-4px',
      minWidth: '18px',
      height: '18px',
      padding: '0 5px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: colors.status.error,
      color: '#FFFFFF',
      borderRadius: radius.full,
      fontSize: '11px',
      fontWeight: typography.fontWeight.semibold,
      lineHeight: 1,
      ...style,
    }}>
      {displayCount}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NOTIFICATION CENTER
// ─────────────────────────────────────────────────────────────────────────────

export function NotificationCenter({
  notifications = [],
  onMarkRead,
  onMarkAllRead,
  onClear,
  isOpen,
  onClose,
}) {
  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: zIndex.dropdown - 1,
        }}
      />
      
      {/* Panel */}
      <div style={{
        position: 'absolute',
        top: '100%',
        right: 0,
        marginTop: space.sm,
        width: '380px',
        maxHeight: '480px',
        background: colors.background.secondary,
        borderRadius: radius.lg,
        boxShadow: shadows.xl,
        border: `1px solid ${colors.border.default}`,
        overflow: 'hidden',
        zIndex: zIndex.dropdown,
        animation: 'chenu-slide-down 200ms ease',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: space.md,
          borderBottom: `1px solid ${colors.border.default}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: space.sm }}>
            <span style={{ fontSize: '18px' }}>🔔</span>
            <span style={{
              fontSize: typography.fontSize.md,
              fontWeight: typography.fontWeight.semibold,
              color: colors.text.primary,
            }}>
              Notifications
            </span>
            {unreadCount > 0 && (
              <span style={{
                padding: '2px 8px',
                background: colors.status.infoBg,
                color: colors.cenoteTurquoise,
                borderRadius: radius.full,
                fontSize: typography.fontSize.xs,
                fontWeight: typography.fontWeight.semibold,
              }}>
                {unreadCount} nouvelles
              </span>
            )}
          </div>
          
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              style={{
                background: 'none',
                border: 'none',
                color: colors.text.muted,
                fontSize: typography.fontSize.sm,
                cursor: 'pointer',
              }}
            >
              Tout marquer lu
            </button>
          )}
        </div>

        {/* List */}
        <div style={{
          maxHeight: '360px',
          overflow: 'auto',
        }}>
          {notifications.length === 0 ? (
            <div style={{
              padding: space.xl,
              textAlign: 'center',
              color: colors.text.muted,
            }}>
              <span style={{ fontSize: '32px', opacity: 0.5 }}>🔔</span>
              <p style={{ margin: `${space.sm} 0 0` }}>Aucune notification</p>
            </div>
          ) : (
            notifications.map(notif => (
              <NotificationItem
                key={notif.id}
                {...notif}
                onMarkRead={() => onMarkRead?.(notif.id)}
              />
            ))
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div style={{
            padding: space.sm,
            borderTop: `1px solid ${colors.border.default}`,
            textAlign: 'center',
          }}>
            <button
              onClick={onClear}
              style={{
                background: 'none',
                border: 'none',
                color: colors.text.muted,
                fontSize: typography.fontSize.sm,
                cursor: 'pointer',
              }}
            >
              Effacer tout
            </button>
          </div>
        )}

        <style>
          {`
            @keyframes chenu-slide-down {
              from { opacity: 0; transform: translateY(-10px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}
        </style>
      </div>
    </>
  );
}

// Notification Item
function NotificationItem({ title, message, time, read, type, onMarkRead }) {
  const typeIcons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
    task: '☑️',
    message: '💬',
    project: '📁',
  };

  return (
    <div
      onClick={onMarkRead}
      style={{
        display: 'flex',
        gap: space.sm,
        padding: space.md,
        background: read ? 'transparent' : `${colors.sacredGold}08`,
        borderBottom: `1px solid ${colors.border.subtle}`,
        cursor: 'pointer',
        transition: transitions.fast,
      }}
    >
      <span style={{ fontSize: '20px' }}>
        {typeIcons[type] || typeIcons.info}
      </span>
      
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: typography.fontSize.sm,
          fontWeight: read ? typography.fontWeight.normal : typography.fontWeight.medium,
          color: colors.text.primary,
          marginBottom: '2px',
        }}>
          {title}
        </div>
        {message && (
          <div style={{
            fontSize: typography.fontSize.sm,
            color: colors.text.secondary,
            lineHeight: 1.4,
          }}>
            {message}
          </div>
        )}
        <div style={{
          fontSize: typography.fontSize.xs,
          color: colors.text.muted,
          marginTop: '4px',
        }}>
          {time}
        </div>
      </div>
      
      {!read && (
        <span style={{
          width: '8px',
          height: '8px',
          background: colors.sacredGold,
          borderRadius: '50%',
          flexShrink: 0,
          marginTop: '6px',
        }} />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

export default ToastProvider;
