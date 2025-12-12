import React, { useEffect, useCallback } from 'react';
import { colors, radius, shadows, transitions, space, zIndex, typography } from '../design-system/tokens';
import { Button, IconButton } from './Button';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — UI KIT: MODAL
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Sizes: sm, md, lg, xl, full
 * 
 * Usage:
 *   <Modal isOpen={open} onClose={close} title="Titre">
 *     <ModalBody>Contenu</ModalBody>
 *     <ModalFooter>Actions</ModalFooter>
 *   </Modal>
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ─────────────────────────────────────────────────────────────────────────────
// MODAL SIZES
// ─────────────────────────────────────────────────────────────────────────────

const sizes = {
  sm: { width: '400px', maxHeight: '50vh' },
  md: { width: '560px', maxHeight: '70vh' },
  lg: { width: '720px', maxHeight: '80vh' },
  xl: { width: '900px', maxHeight: '85vh' },
  full: { width: '95vw', maxHeight: '95vh' },
};

// ─────────────────────────────────────────────────────────────────────────────
// MODAL COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  size = 'md',
  closeOnOverlay = true,
  closeOnEscape = true,
  showCloseButton = true,
  children,
  style,
  ...props
}) {
  const s = sizes[size] || sizes.md;

  // Fermer avec Escape
  useEffect(() => {
    if (!closeOnEscape || !isOpen) return;
    
    const handler = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose, closeOnEscape]);

  // Bloquer le scroll du body
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle overlay click
  const handleOverlayClick = useCallback((e) => {
    if (closeOnOverlay && e.target === e.currentTarget) {
      onClose?.();
    }
  }, [closeOnOverlay, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: space.lg,
        zIndex: zIndex.modal,
      }}
      onClick={handleOverlayClick}
      {...props}
    >
      {/* Backdrop */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(4px)',
          animation: 'chenu-fade-in 200ms ease',
        }}
      />
      
      {/* Modal Content */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: s.width,
          maxHeight: s.maxHeight,
          background: colors.background.secondary,
          borderRadius: radius.lg,
          boxShadow: shadows.modal,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'chenu-slide-up 200ms ease',
          ...style,
        }}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            padding: space.lg,
            borderBottom: `1px solid ${colors.border.default}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: space.sm }}>
              {icon && (
                <span style={{ fontSize: '24px', color: colors.sacredGold }}>
                  {icon}
                </span>
              )}
              <div>
                {title && (
                  <h2 id="modal-title" style={{
                    margin: 0,
                    fontSize: typography.fontSize.xl,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.text.primary,
                  }}>
                    {title}
                  </h2>
                )}
                {subtitle && (
                  <p style={{
                    margin: '4px 0 0',
                    fontSize: typography.fontSize.sm,
                    color: colors.text.secondary,
                  }}>
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
            
            {showCloseButton && (
              <IconButton
                icon="✕"
                variant="ghost"
                size="sm"
                onClick={onClose}
                tooltip="Fermer"
              />
            )}
          </div>
        )}
        
        {/* Content */}
        {children}
      </div>
      
      {/* Animations */}
      <style>
        {`
          @keyframes chenu-fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes chenu-slide-up {
            from { 
              opacity: 0;
              transform: translateY(20px) scale(0.98);
            }
            to { 
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}
      </style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MODAL BODY
// ─────────────────────────────────────────────────────────────────────────────

export function ModalBody({ children, style, ...props }) {
  return (
    <div
      style={{
        flex: 1,
        padding: space.lg,
        overflow: 'auto',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MODAL FOOTER
// ─────────────────────────────────────────────────────────────────────────────

export function ModalFooter({ 
  children, 
  align = 'right',
  divider = true,
  style, 
  ...props 
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: align === 'right' ? 'flex-end' : 
                       align === 'center' ? 'center' : 
                       align === 'between' ? 'space-between' : 'flex-start',
        gap: space.sm,
        padding: space.lg,
        borderTop: divider ? `1px solid ${colors.border.default}` : 'none',
        background: colors.background.primary,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONFIRM MODAL
// ─────────────────────────────────────────────────────────────────────────────

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmer',
  message,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  variant = 'primary', // primary, danger
  loading = false,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      icon={variant === 'danger' ? '⚠️' : '❓'}
    >
      <ModalBody>
        <p style={{
          margin: 0,
          fontSize: typography.fontSize.base,
          color: colors.text.secondary,
          lineHeight: 1.6,
        }}>
          {message}
        </p>
      </ModalBody>
      
      <ModalFooter>
        <Button 
          variant="ghost" 
          onClick={onClose}
          disabled={loading}
        >
          {cancelText}
        </Button>
        <Button 
          variant={variant === 'danger' ? 'danger' : 'primary'}
          onClick={onConfirm}
          loading={loading}
        >
          {confirmText}
        </Button>
      </ModalFooter>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ALERT MODAL
// ─────────────────────────────────────────────────────────────────────────────

export function AlertModal({
  isOpen,
  onClose,
  title,
  message,
  type = 'info', // info, success, warning, error
  buttonText = 'OK',
}) {
  const icons = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌',
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      icon={icons[type]}
    >
      <ModalBody>
        <p style={{
          margin: 0,
          fontSize: typography.fontSize.base,
          color: colors.text.secondary,
          lineHeight: 1.6,
        }}>
          {message}
        </p>
      </ModalBody>
      
      <ModalFooter>
        <Button variant="primary" onClick={onClose}>
          {buttonText}
        </Button>
      </ModalFooter>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DRAWER (Side Panel)
// ─────────────────────────────────────────────────────────────────────────────

export function Drawer({
  isOpen,
  onClose,
  title,
  position = 'right', // left, right
  width = '400px',
  children,
  showCloseButton = true,
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: zIndex.modal,
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          animation: 'chenu-fade-in 200ms ease',
        }}
      />
      
      {/* Drawer Content */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          [position]: 0,
          width,
          maxWidth: '100vw',
          background: colors.background.secondary,
          boxShadow: shadows.xl,
          display: 'flex',
          flexDirection: 'column',
          animation: `chenu-slide-${position === 'right' ? 'left' : 'right'} 200ms ease`,
        }}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: space.lg,
            borderBottom: `1px solid ${colors.border.default}`,
          }}>
            {title && (
              <h2 style={{
                margin: 0,
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight.semibold,
                color: colors.text.primary,
              }}>
                {title}
              </h2>
            )}
            
            {showCloseButton && (
              <IconButton
                icon="✕"
                variant="ghost"
                size="sm"
                onClick={onClose}
              />
            )}
          </div>
        )}
        
        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          {children}
        </div>
      </div>
      
      <style>
        {`
          @keyframes chenu-slide-left {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
          @keyframes chenu-slide-right {
            from { transform: translateX(-100%); }
            to { transform: translateX(0); }
          }
        `}
      </style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

export default Modal;
