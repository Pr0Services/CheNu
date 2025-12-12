import React, { useState, useEffect } from 'react';
import { colors, typography, shadows, radius, transitions, zIndex } from '../design-system/tokens';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — SPLASH SCREEN ANIMÉ
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Écran d'accueil animé avec le logo CHE·NU™
 * 
 * Features:
 * - Animation pyramide avec glow
 * - Texte CHE·NU™ avec effet de reveal
 * - Progress bar
 * - Transition fluide vers l'app
 * 
 * Usage:
 *   <SplashScreen onComplete={() => setLoaded(true)} />
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

export default function SplashScreen({ 
  onComplete, 
  minDuration = 2000, // Durée minimum en ms
  showProgress = true,
}) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState('loading'); // loading, complete, exit
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Simuler le chargement
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / minDuration) * 100, 100);
      setProgress(newProgress);
      
      if (newProgress >= 100) {
        clearInterval(interval);
        setPhase('complete');
        
        // Transition de sortie
        setTimeout(() => {
          setPhase('exit');
          setTimeout(() => {
            setVisible(false);
            onComplete?.();
          }, 500);
        }, 500);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [minDuration, onComplete]);

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: colors.darkSlate,
      zIndex: zIndex.splash,
      opacity: phase === 'exit' ? 0 : 1,
      transition: 'opacity 500ms ease',
    }}>
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `radial-gradient(circle at 50% 50%, ${colors.sacredGold}08 0%, transparent 50%)`,
        pointerEvents: 'none',
      }} />

      {/* Logo Container */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        animation: phase === 'complete' ? 'chenu-logo-complete 500ms ease forwards' : undefined,
      }}>
        {/* Pyramide Logo */}
        <div style={{
          position: 'relative',
          width: '120px',
          height: '120px',
          marginBottom: '32px',
          animation: 'chenu-pyramid-float 3s ease-in-out infinite',
        }}>
          {/* Glow Effect */}
          <div style={{
            position: 'absolute',
            inset: '-20px',
            background: `radial-gradient(circle, ${colors.sacredGold}30 0%, transparent 70%)`,
            filter: 'blur(20px)',
            animation: 'chenu-glow-pulse 2s ease-in-out infinite',
          }} />
          
          {/* Pyramide SVG */}
          <svg
            viewBox="0 0 100 100"
            style={{
              width: '100%',
              height: '100%',
              filter: `drop-shadow(0 0 20px ${colors.sacredGold}50)`,
            }}
          >
            <defs>
              <linearGradient id="pyramidGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={colors.sacredGold} />
                <stop offset="100%" stopColor="#B8924A" />
              </linearGradient>
              <linearGradient id="pyramidShadow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={colors.sacredGold} stopOpacity="0.5" />
                <stop offset="100%" stopColor="#8A6A2A" />
              </linearGradient>
            </defs>
            
            {/* Face principale */}
            <path
              d="M50 10 L85 80 L15 80 Z"
              fill="url(#pyramidGradient)"
              style={{
                animation: 'chenu-pyramid-draw 1s ease forwards',
                strokeDasharray: 250,
                strokeDashoffset: 250,
              }}
            />
            
            {/* Ombre latérale */}
            <path
              d="M50 10 L85 80 L50 65 Z"
              fill="url(#pyramidShadow)"
              opacity="0.6"
            />
            
            {/* Détails intérieurs */}
            <path
              d="M50 25 L65 60 L35 60 Z"
              fill={colors.darkSlate}
              opacity="0.3"
            />
            
            {/* Ligne centrale lumineuse */}
            <line
              x1="50" y1="10"
              x2="50" y2="65"
              stroke={colors.sacredGold}
              strokeWidth="1"
              opacity="0.5"
              style={{
                animation: 'chenu-line-glow 2s ease-in-out infinite',
              }}
            />
          </svg>
        </div>

        {/* Logo Text CHE·NU™ */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '16px',
        }}>
          <span style={{
            fontFamily: typography.fontFamily.logo,
            fontSize: '48px',
            fontWeight: typography.fontWeight.bold,
            color: colors.sacredGold,
            letterSpacing: '-0.02em',
            animation: 'chenu-text-reveal 800ms ease forwards',
            animationDelay: '300ms',
            opacity: 0,
          }}>
            CHE
          </span>
          
          <span style={{
            width: '8px',
            height: '8px',
            background: colors.jungleEmerald,
            borderRadius: '50%',
            animation: 'chenu-dot-pop 400ms ease forwards',
            animationDelay: '600ms',
            opacity: 0,
            transform: 'scale(0)',
          }} />
          
          <span style={{
            fontFamily: typography.fontFamily.logo,
            fontSize: '48px',
            fontWeight: typography.fontWeight.bold,
            color: colors.text.primary,
            letterSpacing: '-0.02em',
            animation: 'chenu-text-reveal 800ms ease forwards',
            animationDelay: '500ms',
            opacity: 0,
          }}>
            NU
          </span>
          
          <span style={{
            fontFamily: typography.fontFamily.logo,
            fontSize: '20px',
            color: colors.sacredGold,
            marginLeft: '-4px',
            marginTop: '-16px',
            opacity: 0,
            animation: 'chenu-tm-reveal 500ms ease forwards',
            animationDelay: '800ms',
          }}>
            ™
          </span>
        </div>

        {/* Tagline */}
        <p style={{
          fontFamily: typography.fontFamily.body,
          fontSize: typography.fontSize.md,
          color: colors.text.secondary,
          marginBottom: '48px',
          opacity: 0,
          animation: 'chenu-text-reveal 800ms ease forwards',
          animationDelay: '1000ms',
        }}>
          Plateforme de gestion construction
        </p>

        {/* Progress Bar */}
        {showProgress && (
          <div style={{
            width: '200px',
            height: '4px',
            background: colors.background.tertiary,
            borderRadius: radius.full,
            overflow: 'hidden',
            opacity: phase === 'complete' ? 0 : 1,
            transition: 'opacity 300ms ease',
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              background: `linear-gradient(90deg, ${colors.sacredGold} 0%, ${colors.cenoteTurquoise} 100%)`,
              borderRadius: radius.full,
              transition: 'width 100ms ease',
              boxShadow: `0 0 10px ${colors.sacredGold}50`,
            }} />
          </div>
        )}

        {/* Loading Text */}
        {showProgress && (
          <p style={{
            marginTop: '16px',
            fontSize: typography.fontSize.sm,
            color: colors.text.muted,
            opacity: phase === 'complete' ? 0 : 1,
            transition: 'opacity 300ms ease',
          }}>
            {phase === 'loading' 
              ? `Chargement... ${Math.round(progress)}%`
              : 'Prêt!'
            }
          </p>
        )}
      </div>

      {/* Styles & Animations */}
      <style>
        {`
          @keyframes chenu-pyramid-float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          
          @keyframes chenu-glow-pulse {
            0%, 100% { opacity: 0.5; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.1); }
          }
          
          @keyframes chenu-pyramid-draw {
            to { stroke-dashoffset: 0; }
          }
          
          @keyframes chenu-line-glow {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.8; }
          }
          
          @keyframes chenu-text-reveal {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes chenu-dot-pop {
            from {
              opacity: 0;
              transform: scale(0);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          
          @keyframes chenu-tm-reveal {
            from {
              opacity: 0;
              transform: translateX(-10px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @keyframes chenu-logo-complete {
            to {
              transform: scale(0.95);
              opacity: 0.8;
            }
          }
        `}
      </style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MINI SPLASH (pour transitions entre pages)
// ─────────────────────────────────────────────────────────────────────────────

export function MiniLoader({ message }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px',
    }}>
      {/* Mini Pyramide */}
      <div style={{
        width: '48px',
        height: '48px',
        marginBottom: '16px',
        animation: 'chenu-pyramid-float 2s ease-in-out infinite',
      }}>
        <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
          <path
            d="M50 15 L80 75 L20 75 Z"
            fill={colors.sacredGold}
            opacity="0.8"
          />
          <path
            d="M50 15 L80 75 L50 60 Z"
            fill={colors.sacredGold}
            opacity="0.5"
          />
        </svg>
      </div>
      
      {message && (
        <p style={{
          color: colors.text.secondary,
          fontSize: typography.fontSize.sm,
        }}>
          {message}
        </p>
      )}
      
      <style>
        {`
          @keyframes chenu-pyramid-float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-5px) rotate(5deg); }
          }
        `}
      </style>
    </div>
  );
}
