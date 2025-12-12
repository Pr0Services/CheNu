import React, { useState, useEffect, useCallback } from 'react';
import { colors, radius, shadows, transitions, space, typography, zIndex } from '../design-system/tokens';
import { Button } from './Button';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — ONBOARDING INTERACTIF
 * ═══════════════════════════════════════════════════════════════════════════════
 * P2-05: Tour guidé pour nouveaux utilisateurs
 * 
 * Features:
 * - Highlights des éléments UI
 * - Steps progressifs
 * - Tooltips positionnées
 * - Skip / Next / Back navigation
 * - Persistence localStorage
 * 
 * Usage:
 *   <OnboardingTour 
 *     steps={tourSteps} 
 *     onComplete={() => setFirstVisit(false)} 
 *   />
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ─────────────────────────────────────────────────────────────────────────────
// TOUR STEPS EXEMPLE
// ─────────────────────────────────────────────────────────────────────────────

export const defaultTourSteps = [
  {
    id: 'welcome',
    title: 'Bienvenue sur CHE·NU™!',
    content: 'Découvrez votre nouvelle plateforme de gestion construction. Ce tour rapide vous montrera les fonctionnalités essentielles.',
    target: null, // Pas de target = modal centré
    placement: 'center',
    icon: '👋',
  },
  {
    id: 'sidebar',
    title: 'Navigation principale',
    content: 'Accédez à tous vos modules depuis la barre latérale : Projets, Calendrier, Équipe, Finance et plus encore.',
    target: '[data-tour="sidebar"]',
    placement: 'right',
    icon: '📚',
  },
  {
    id: 'search',
    title: 'Recherche rapide',
    content: 'Appuyez sur ⌘K pour rechercher instantanément dans vos projets, contacts et documents.',
    target: '[data-tour="search"]',
    placement: 'bottom',
    icon: '🔍',
  },
  {
    id: 'nova',
    title: 'Nova, votre assistant IA',
    content: 'Cliquez sur Nova pour obtenir de l\'aide, créer des tâches ou analyser vos données automatiquement.',
    target: '[data-tour="nova"]',
    placement: 'left',
    icon: '🧠',
  },
  {
    id: 'theme',
    title: 'Personnalisez votre interface',
    content: 'Changez le thème (Sombre, Clair, Nature) et la langue selon vos préférences.',
    target: '[data-tour="theme"]',
    placement: 'bottom',
    icon: '🎨',
  },
  {
    id: 'complete',
    title: 'Vous êtes prêt!',
    content: 'Explorez CHE·NU™ à votre rythme. Vous pouvez relancer ce tour depuis les paramètres à tout moment.',
    target: null,
    placement: 'center',
    icon: '🎉',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// ONBOARDING TOUR COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function OnboardingTour({
  steps = defaultTourSteps,
  isOpen = true,
  onComplete,
  onSkip,
  storageKey = 'chenu-onboarding-completed',
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState(null);
  const [isVisible, setIsVisible] = useState(isOpen);

  const step = steps[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;
  const progress = ((currentStep + 1) / steps.length) * 100;

  // Vérifier si déjà complété
  useEffect(() => {
    const completed = localStorage.getItem(storageKey);
    if (completed === 'true') {
      setIsVisible(false);
    }
  }, [storageKey]);

  // Trouver la position du target
  useEffect(() => {
    if (!step?.target) {
      setTargetRect(null);
      return;
    }

    const findTarget = () => {
      const element = document.querySelector(step.target);
      if (element) {
        const rect = element.getBoundingClientRect();
        setTargetRect(rect);
        
        // Scroll into view si nécessaire
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        setTargetRect(null);
      }
    };

    findTarget();
    window.addEventListener('resize', findTarget);
    return () => window.removeEventListener('resize', findTarget);
  }, [step]);

  // Navigation
  const handleNext = useCallback(() => {
    if (isLast) {
      handleComplete();
    } else {
      setCurrentStep(c => c + 1);
    }
  }, [isLast]);

  const handleBack = useCallback(() => {
    if (!isFirst) {
      setCurrentStep(c => c - 1);
    }
  }, [isFirst]);

  const handleSkip = useCallback(() => {
    localStorage.setItem(storageKey, 'true');
    setIsVisible(false);
    onSkip?.();
  }, [storageKey, onSkip]);

  const handleComplete = useCallback(() => {
    localStorage.setItem(storageKey, 'true');
    setIsVisible(false);
    onComplete?.();
  }, [storageKey, onComplete]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (!isVisible) return;
      if (e.key === 'Escape') handleSkip();
      if (e.key === 'ArrowRight' || e.key === 'Enter') handleNext();
      if (e.key === 'ArrowLeft') handleBack();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isVisible, handleNext, handleBack, handleSkip]);

  if (!isVisible) return null;

  // Calculer la position du tooltip
  const getTooltipPosition = () => {
    if (!targetRect || step.placement === 'center') {
      return {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      };
    }

    const padding = 16;
    const tooltipWidth = 360;
    const tooltipHeight = 200;

    switch (step.placement) {
      case 'top':
        return {
          position: 'fixed',
          top: targetRect.top - tooltipHeight - padding,
          left: targetRect.left + targetRect.width / 2 - tooltipWidth / 2,
        };
      case 'bottom':
        return {
          position: 'fixed',
          top: targetRect.bottom + padding,
          left: targetRect.left + targetRect.width / 2 - tooltipWidth / 2,
        };
      case 'left':
        return {
          position: 'fixed',
          top: targetRect.top + targetRect.height / 2 - tooltipHeight / 2,
          left: targetRect.left - tooltipWidth - padding,
        };
      case 'right':
        return {
          position: 'fixed',
          top: targetRect.top + targetRect.height / 2 - tooltipHeight / 2,
          left: targetRect.right + padding,
        };
      default:
        return {
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        };
    }
  };

  return (
    <>
      {/* Overlay */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.75)',
        zIndex: zIndex.modal,
        transition: 'opacity 300ms ease',
      }} />

      {/* Spotlight sur le target */}
      {targetRect && (
        <div style={{
          position: 'fixed',
          top: targetRect.top - 8,
          left: targetRect.left - 8,
          width: targetRect.width + 16,
          height: targetRect.height + 16,
          borderRadius: radius.lg,
          boxShadow: `0 0 0 9999px rgba(0, 0, 0, 0.75), 0 0 20px ${colors.sacredGold}50`,
          border: `2px solid ${colors.sacredGold}`,
          zIndex: zIndex.modal + 1,
          pointerEvents: 'none',
          animation: 'chenu-spotlight-pulse 2s ease-in-out infinite',
        }} />
      )}

      {/* Tooltip */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={step.title}
        style={{
          ...getTooltipPosition(),
          width: '360px',
          background: colors.background.secondary,
          borderRadius: radius.lg,
          boxShadow: shadows.xl,
          border: `1px solid ${colors.border.gold}`,
          zIndex: zIndex.modal + 2,
          animation: 'chenu-tooltip-appear 300ms ease',
          overflow: 'hidden',
        }}
      >
        {/* Progress bar */}
        <div style={{
          height: '3px',
          background: colors.background.tertiary,
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${colors.sacredGold} 0%, ${colors.cenoteTurquoise} 100%)`,
            transition: 'width 300ms ease',
          }} />
        </div>

        {/* Content */}
        <div style={{ padding: space.lg }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: space.sm,
            marginBottom: space.md,
          }}>
            <span style={{
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `${colors.sacredGold}15`,
              borderRadius: radius.md,
              fontSize: '24px',
            }}>
              {step.icon}
            </span>
            <div>
              <h3 style={{
                margin: 0,
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight.semibold,
                color: colors.text.primary,
              }}>
                {step.title}
              </h3>
              <span style={{
                fontSize: typography.fontSize.xs,
                color: colors.text.muted,
              }}>
                Étape {currentStep + 1} sur {steps.length}
              </span>
            </div>
          </div>

          {/* Description */}
          <p style={{
            margin: '0 0 20px',
            fontSize: typography.fontSize.base,
            color: colors.text.secondary,
            lineHeight: 1.6,
          }}>
            {step.content}
          </p>

          {/* Actions */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <button
              onClick={handleSkip}
              style={{
                background: 'none',
                border: 'none',
                color: colors.text.muted,
                fontSize: typography.fontSize.sm,
                cursor: 'pointer',
                padding: '8px',
              }}
            >
              Passer le tour
            </button>

            <div style={{ display: 'flex', gap: space.sm }}>
              {!isFirst && (
                <Button variant="ghost" size="sm" onClick={handleBack}>
                  ← Précédent
                </Button>
              )}
              <Button 
                variant="primary" 
                size="sm" 
                onClick={handleNext}
              >
                {isLast ? 'Terminer ✓' : 'Suivant →'}
              </Button>
            </div>
          </div>
        </div>

        {/* Step dots */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '6px',
          padding: `0 ${space.lg} ${space.md}`,
        }}>
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentStep(i)}
              aria-label={`Aller à l'étape ${i + 1}`}
              style={{
                width: i === currentStep ? '24px' : '8px',
                height: '8px',
                borderRadius: radius.full,
                background: i === currentStep ? colors.sacredGold : colors.background.tertiary,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 200ms ease',
              }}
            />
          ))}
        </div>
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes chenu-spotlight-pulse {
            0%, 100% { box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.75), 0 0 20px rgba(216, 178, 106, 0.3); }
            50% { box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.75), 0 0 40px rgba(216, 178, 106, 0.5); }
          }
          
          @keyframes chenu-tooltip-appear {
            from {
              opacity: 0;
              transform: translate(-50%, -50%) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1);
            }
          }
        `}
      </style>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HOOK: useOnboarding
// ─────────────────────────────────────────────────────────────────────────────

export function useOnboarding(storageKey = 'chenu-onboarding-completed') {
  const [showTour, setShowTour] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem(storageKey);
    if (completed !== 'true') {
      setIsFirstVisit(true);
      setShowTour(true);
    }
  }, [storageKey]);

  const startTour = useCallback(() => {
    setShowTour(true);
  }, []);

  const completeTour = useCallback(() => {
    localStorage.setItem(storageKey, 'true');
    setShowTour(false);
    setIsFirstVisit(false);
  }, [storageKey]);

  const resetTour = useCallback(() => {
    localStorage.removeItem(storageKey);
    setIsFirstVisit(true);
  }, [storageKey]);

  return {
    showTour,
    isFirstVisit,
    startTour,
    completeTour,
    resetTour,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// FEATURE HIGHLIGHT (pour highlights individuels)
// ─────────────────────────────────────────────────────────────────────────────

export function FeatureHighlight({
  children,
  title,
  description,
  isNew = false,
  showOnce = true,
  storageKey,
  placement = 'bottom',
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (showOnce && storageKey) {
      const seen = localStorage.getItem(`chenu-highlight-${storageKey}`);
      if (seen === 'true') {
        setDismissed(true);
      }
    }
  }, [showOnce, storageKey]);

  const handleDismiss = () => {
    if (showOnce && storageKey) {
      localStorage.setItem(`chenu-highlight-${storageKey}`, 'true');
    }
    setDismissed(true);
  };

  if (dismissed) {
    return children;
  }

  return (
    <div
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      
      {/* New badge */}
      {isNew && (
        <span style={{
          position: 'absolute',
          top: '-4px',
          right: '-4px',
          width: '8px',
          height: '8px',
          background: colors.sacredGold,
          borderRadius: '50%',
          animation: 'chenu-pulse 2s ease-in-out infinite',
        }} />
      )}

      {/* Tooltip */}
      {isVisible && (
        <div style={{
          position: 'absolute',
          [placement === 'top' ? 'bottom' : 'top']: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginTop: placement === 'bottom' ? '8px' : undefined,
          marginBottom: placement === 'top' ? '8px' : undefined,
          padding: space.md,
          background: colors.background.elevated,
          borderRadius: radius.md,
          boxShadow: shadows.lg,
          border: `1px solid ${colors.border.gold}`,
          width: '200px',
          zIndex: zIndex.tooltip,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: space.xs,
          }}>
            <span style={{
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.semibold,
              color: colors.text.primary,
            }}>
              {title}
            </span>
            {isNew && (
              <span style={{
                padding: '2px 6px',
                background: colors.sacredGold,
                color: colors.darkSlate,
                borderRadius: radius.sm,
                fontSize: '10px',
                fontWeight: 600,
              }}>
                NOUVEAU
              </span>
            )}
          </div>
          <p style={{
            margin: 0,
            fontSize: typography.fontSize.sm,
            color: colors.text.secondary,
            lineHeight: 1.4,
          }}>
            {description}
          </p>
          <button
            onClick={handleDismiss}
            style={{
              marginTop: space.sm,
              padding: '4px 8px',
              background: 'none',
              border: 'none',
              color: colors.text.muted,
              fontSize: typography.fontSize.xs,
              cursor: 'pointer',
            }}
          >
            Ne plus afficher
          </button>
        </div>
      )}

      <style>
        {`
          @keyframes chenu-pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.2); opacity: 0.7; }
          }
        `}
      </style>
    </div>
  );
}
