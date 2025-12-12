/**
 * CHE·NU™ B27 - 3D Effects & Polish
 * Animations avancées et finitions UI
 * 
 * Features:
 * - 3D Card Effects (tilt, depth, reflections)
 * - Page Transitions (smooth navigation)
 * - Micro-interactions (buttons, inputs, feedback)
 * - Loading States (skeletons, spinners, progress)
 * - Scroll Animations (reveal, parallax)
 * - Haptic Feedback patterns
 * 
 * Author: CHE·NU Dev Team
 * Date: December 2024
 * Lines: ~650
 */

import React, { useState, useRef, useEffect, useCallback, createContext, useContext } from 'react';

// =============================================================================
// DESIGN TOKENS - ANIMATIONS
// =============================================================================

const animationTokens = {
  // Durations
  duration: {
    instant: 50,
    fast: 150,
    normal: 300,
    slow: 500,
    slower: 800,
  },
  
  // Easings
  easing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    bounce: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
    smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  },
  
  // 3D
  perspective: 1000,
  tiltMax: 15,
  
  // Shadows for depth
  shadows: {
    flat: 'none',
    raised: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
    floating: '0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
    elevated: '0 20px 40px -10px rgba(0, 0, 0, 0.5), 0 15px 20px -10px rgba(0, 0, 0, 0.4)',
    glow: '0 0 30px rgba(216, 178, 106, 0.4)',
  }
};

// =============================================================================
// ANIMATION CONTEXT
// =============================================================================

const AnimationContext = createContext({
  reducedMotion: false,
  animationsEnabled: true,
  setAnimationsEnabled: () => {},
});

export const AnimationProvider = ({ children }) => {
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  
  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    const handler = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  return (
    <AnimationContext.Provider value={{ reducedMotion, animationsEnabled, setAnimationsEnabled }}>
      {children}
    </AnimationContext.Provider>
  );
};

export const useAnimation = () => useContext(AnimationContext);

// =============================================================================
// 3D TILT CARD
// =============================================================================

export const TiltCard = ({ 
  children, 
  className = '',
  maxTilt = 15,
  scale = 1.02,
  perspective = 1000,
  glare = true,
  glareMaxOpacity = 0.2,
  disabled = false,
  onTilt,
  style = {}
}) => {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);
  const { reducedMotion } = useAnimation();
  
  const handleMouseMove = useCallback((e) => {
    if (disabled || reducedMotion || !cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    const tiltX = (mouseY / (rect.height / 2)) * -maxTilt;
    const tiltY = (mouseX / (rect.width / 2)) * maxTilt;
    
    setTilt({ x: tiltX, y: tiltY });
    
    // Glare position
    const glareX = ((e.clientX - rect.left) / rect.width) * 100;
    const glareY = ((e.clientY - rect.top) / rect.height) * 100;
    setGlarePosition({ x: glareX, y: glareY });
    
    onTilt?.({ tiltX, tiltY, percentX: glareX, percentY: glareY });
  }, [disabled, reducedMotion, maxTilt, onTilt]);
  
  const handleMouseEnter = () => setIsHovering(true);
  
  const handleMouseLeave = () => {
    setIsHovering(false);
    setTilt({ x: 0, y: 0 });
    setGlarePosition({ x: 50, y: 50 });
  };
  
  const cardStyle = {
    perspective: `${perspective}px`,
    transformStyle: 'preserve-3d',
    ...style
  };
  
  const innerStyle = {
    transform: isHovering && !reducedMotion
      ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${scale})`
      : 'rotateX(0) rotateY(0) scale(1)',
    transition: isHovering 
      ? 'transform 0.1s ease-out' 
      : 'transform 0.5s ease-out',
    transformStyle: 'preserve-3d',
    position: 'relative',
    width: '100%',
    height: '100%',
  };
  
  const glareStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,${glareMaxOpacity}), transparent 60%)`,
    opacity: isHovering ? 1 : 0,
    transition: 'opacity 0.3s ease',
    pointerEvents: 'none',
    borderRadius: 'inherit',
  };
  
  return (
    <div 
      ref={cardRef}
      className={className}
      style={cardStyle}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div style={innerStyle}>
        {children}
        {glare && <div style={glareStyle} />}
      </div>
    </div>
  );
};

// =============================================================================
// FLOATING ELEMENT (Parallax)
// =============================================================================

export const FloatingElement = ({
  children,
  amplitude = 10,
  duration = 3000,
  delay = 0,
  style = {}
}) => {
  const [offset, setOffset] = useState(0);
  const { reducedMotion } = useAnimation();
  
  useEffect(() => {
    if (reducedMotion) return;
    
    let startTime;
    let animationFrame;
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime + delay;
      const newOffset = Math.sin((elapsed / duration) * Math.PI * 2) * amplitude;
      setOffset(newOffset);
      animationFrame = requestAnimationFrame(animate);
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [amplitude, duration, delay, reducedMotion]);
  
  return (
    <div style={{
      transform: `translateY(${offset}px)`,
      ...style
    }}>
      {children}
    </div>
  );
};

// =============================================================================
// PAGE TRANSITION
// =============================================================================

export const PageTransition = ({ 
  children, 
  type = 'fade', // fade, slide, scale, slideUp
  duration = 300,
  show = true 
}) => {
  const [shouldRender, setShouldRender] = useState(show);
  const [animationState, setAnimationState] = useState(show ? 'entered' : 'exited');
  const { reducedMotion } = useAnimation();
  
  useEffect(() => {
    if (show) {
      setShouldRender(true);
      requestAnimationFrame(() => setAnimationState('entering'));
      setTimeout(() => setAnimationState('entered'), duration);
    } else {
      setAnimationState('exiting');
      setTimeout(() => {
        setAnimationState('exited');
        setShouldRender(false);
      }, duration);
    }
  }, [show, duration]);
  
  if (!shouldRender) return null;
  
  const getStyles = () => {
    if (reducedMotion) return {};
    
    const baseStyle = {
      transition: `all ${duration}ms ${animationTokens.easing.easeInOut}`,
    };
    
    const states = {
      fade: {
        entering: { opacity: 0 },
        entered: { opacity: 1 },
        exiting: { opacity: 0 },
        exited: { opacity: 0 },
      },
      slide: {
        entering: { opacity: 0, transform: 'translateX(20px)' },
        entered: { opacity: 1, transform: 'translateX(0)' },
        exiting: { opacity: 0, transform: 'translateX(-20px)' },
        exited: { opacity: 0, transform: 'translateX(-20px)' },
      },
      slideUp: {
        entering: { opacity: 0, transform: 'translateY(20px)' },
        entered: { opacity: 1, transform: 'translateY(0)' },
        exiting: { opacity: 0, transform: 'translateY(-20px)' },
        exited: { opacity: 0, transform: 'translateY(-20px)' },
      },
      scale: {
        entering: { opacity: 0, transform: 'scale(0.95)' },
        entered: { opacity: 1, transform: 'scale(1)' },
        exiting: { opacity: 0, transform: 'scale(0.95)' },
        exited: { opacity: 0, transform: 'scale(0.95)' },
      },
    };
    
    return { ...baseStyle, ...states[type][animationState] };
  };
  
  return <div style={getStyles()}>{children}</div>;
};

// =============================================================================
// SCROLL REVEAL
// =============================================================================

export const ScrollReveal = ({
  children,
  threshold = 0.1,
  delay = 0,
  duration = 500,
  direction = 'up', // up, down, left, right, none
  distance = 30,
  once = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);
  const { reducedMotion } = useAnimation();
  
  useEffect(() => {
    if (reducedMotion) {
      setIsVisible(true);
      return;
    }
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          if (once) observer.disconnect();
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold }
    );
    
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, delay, once, reducedMotion]);
  
  const getInitialTransform = () => {
    switch (direction) {
      case 'up': return `translateY(${distance}px)`;
      case 'down': return `translateY(-${distance}px)`;
      case 'left': return `translateX(${distance}px)`;
      case 'right': return `translateX(-${distance}px)`;
      default: return 'none';
    }
  };
  
  const style = reducedMotion ? {} : {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'none' : getInitialTransform(),
    transition: `opacity ${duration}ms ${animationTokens.easing.easeOut}, transform ${duration}ms ${animationTokens.easing.easeOut}`,
  };
  
  return <div ref={ref} style={style}>{children}</div>;
};

// =============================================================================
// SKELETON LOADER
// =============================================================================

export const Skeleton = ({
  width = '100%',
  height = 20,
  borderRadius = 8,
  animate = true,
  style = {}
}) => {
  const { reducedMotion } = useAnimation();
  
  const skeletonStyle = {
    width,
    height,
    borderRadius,
    background: 'linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 50%, #2a2a2a 75%)',
    backgroundSize: '200% 100%',
    animation: animate && !reducedMotion ? 'shimmer 1.5s infinite' : 'none',
    ...style
  };
  
  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
      <div style={skeletonStyle} />
    </>
  );
};

export const SkeletonText = ({ lines = 3, lastLineWidth = '60%' }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton 
        key={i} 
        height={16} 
        width={i === lines - 1 ? lastLineWidth : '100%'} 
      />
    ))}
  </div>
);

export const SkeletonCard = ({ height = 200 }) => (
  <div style={{ 
    background: '#242424', 
    borderRadius: 12, 
    padding: 16,
    border: '1px solid #333'
  }}>
    <Skeleton height={height * 0.5} borderRadius={8} style={{ marginBottom: 16 }} />
    <Skeleton height={20} width="70%" style={{ marginBottom: 8 }} />
    <Skeleton height={16} width="90%" style={{ marginBottom: 8 }} />
    <Skeleton height={16} width="50%" />
  </div>
);

// =============================================================================
// PROGRESS INDICATORS
// =============================================================================

export const CircularProgress = ({
  value = 0,
  size = 48,
  strokeWidth = 4,
  color = '#D8B26A',
  trackColor = '#333',
  showValue = false,
  animate = true,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;
  const { reducedMotion } = useAnimation();
  
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: animate && !reducedMotion ? 'stroke-dashoffset 0.5s ease' : 'none'
          }}
        />
      </svg>
      {showValue && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: size * 0.25,
          fontWeight: 600,
          color: '#E8E4DC'
        }}>
          {Math.round(value)}%
        </div>
      )}
    </div>
  );
};

export const LinearProgress = ({
  value = 0,
  height = 4,
  color = '#D8B26A',
  trackColor = '#333',
  animated = true,
  indeterminate = false,
}) => {
  const { reducedMotion } = useAnimation();
  
  return (
    <>
      {indeterminate && !reducedMotion && (
        <style>{`
          @keyframes indeterminate {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(400%); }
          }
        `}</style>
      )}
      <div style={{
        width: '100%',
        height,
        background: trackColor,
        borderRadius: height / 2,
        overflow: 'hidden',
      }}>
        <div style={{
          width: indeterminate ? '25%' : `${value}%`,
          height: '100%',
          background: color,
          borderRadius: height / 2,
          transition: animated && !reducedMotion && !indeterminate ? 'width 0.3s ease' : 'none',
          animation: indeterminate && !reducedMotion ? 'indeterminate 1.5s infinite ease-in-out' : 'none',
        }} />
      </div>
    </>
  );
};

// =============================================================================
// ANIMATED BUTTON
// =============================================================================

export const AnimatedButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  style = {}
}) => {
  const [ripples, setRipples] = useState([]);
  const [isPressed, setIsPressed] = useState(false);
  const { reducedMotion } = useAnimation();
  
  const handleClick = (e) => {
    if (disabled || loading) return;
    
    // Create ripple
    if (!reducedMotion) {
      const rect = e.currentTarget.getBoundingClientRect();
      const ripple = {
        id: Date.now(),
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      setRipples(prev => [...prev, ripple]);
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== ripple.id));
      }, 600);
    }
    
    onClick?.(e);
  };
  
  const variants = {
    primary: { bg: '#D8B26A', color: '#1A1A1A', hoverBg: '#E8C88A' },
    secondary: { bg: 'transparent', color: '#E8E4DC', border: '1px solid #444', hoverBg: '#2E2E2E' },
    ghost: { bg: 'transparent', color: '#A09080', hoverBg: 'rgba(216,178,106,0.1)' },
    danger: { bg: '#EF4444', color: '#fff', hoverBg: '#F87171' },
  };
  
  const sizes = {
    sm: { padding: '6px 12px', fontSize: 13 },
    md: { padding: '10px 18px', fontSize: 14 },
    lg: { padding: '14px 24px', fontSize: 16 },
  };
  
  const v = variants[variant];
  const s = sizes[size];
  
  const buttonStyle = {
    position: 'relative',
    overflow: 'hidden',
    background: v.bg,
    color: v.color,
    border: v.border || 'none',
    borderRadius: 8,
    padding: s.padding,
    fontSize: s.fontSize,
    fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transform: isPressed && !reducedMotion ? 'scale(0.98)' : 'scale(1)',
    transition: 'transform 0.1s ease, background 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    ...style
  };
  
  return (
    <>
      <style>{`
        @keyframes ripple {
          to { transform: scale(4); opacity: 0; }
        }
      `}</style>
      <button
        style={buttonStyle}
        onClick={handleClick}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        disabled={disabled}
      >
        {loading ? (
          <CircularProgress size={s.fontSize + 4} strokeWidth={2} color={v.color} />
        ) : (
          <>
            {icon && <span>{icon}</span>}
            {children}
          </>
        )}
        
        {/* Ripples */}
        {ripples.map(ripple => (
          <span
            key={ripple.id}
            style={{
              position: 'absolute',
              left: ripple.x,
              top: ripple.y,
              width: 10,
              height: 10,
              background: 'rgba(255,255,255,0.4)',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%) scale(0)',
              animation: 'ripple 0.6s ease-out',
              pointerEvents: 'none',
            }}
          />
        ))}
      </button>
    </>
  );
};

// =============================================================================
// ANIMATED INPUT
// =============================================================================

export const AnimatedInput = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  error,
  disabled = false,
  style = {}
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!value);
  const { reducedMotion } = useAnimation();
  
  useEffect(() => {
    setHasValue(!!value);
  }, [value]);
  
  const isLabelFloated = isFocused || hasValue;
  
  return (
    <div style={{ position: 'relative', ...style }}>
      {label && (
        <label style={{
          position: 'absolute',
          left: 12,
          top: isLabelFloated ? -8 : 14,
          fontSize: isLabelFloated ? 11 : 14,
          color: error ? '#EF4444' : isFocused ? '#D8B26A' : '#6B6560',
          background: isLabelFloated ? '#1A1A1A' : 'transparent',
          padding: isLabelFloated ? '0 4px' : 0,
          transition: reducedMotion ? 'none' : 'all 0.2s ease',
          pointerEvents: 'none',
          zIndex: 1,
        }}>
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => {
          setHasValue(!!e.target.value);
          onChange?.(e);
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={isLabelFloated ? placeholder : ''}
        disabled={disabled}
        style={{
          width: '100%',
          padding: '14px 12px',
          background: '#1E1E1E',
          border: `1px solid ${error ? '#EF4444' : isFocused ? '#D8B26A' : '#333'}`,
          borderRadius: 8,
          color: '#E8E4DC',
          fontSize: 14,
          outline: 'none',
          transition: reducedMotion ? 'none' : 'border-color 0.2s ease, box-shadow 0.2s ease',
          boxShadow: isFocused ? '0 0 0 3px rgba(216,178,106,0.1)' : 'none',
        }}
      />
      {error && (
        <span style={{ 
          display: 'block', 
          marginTop: 4, 
          fontSize: 12, 
          color: '#EF4444' 
        }}>
          {error}
        </span>
      )}
    </div>
  );
};

// =============================================================================
// TOAST NOTIFICATIONS
// =============================================================================

export const Toast = ({
  message,
  type = 'info', // info, success, warning, error
  show = true,
  onClose,
  duration = 4000,
  position = 'bottom-right'
}) => {
  const [isVisible, setIsVisible] = useState(show);
  const { reducedMotion } = useAnimation();
  
  useEffect(() => {
    if (show) {
      setIsVisible(true);
      if (duration > 0) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          setTimeout(() => onClose?.(), 300);
        }, duration);
        return () => clearTimeout(timer);
      }
    }
  }, [show, duration, onClose]);
  
  const types = {
    info: { bg: '#3EB4A2', icon: 'ℹ️' },
    success: { bg: '#3F7249', icon: '✅' },
    warning: { bg: '#F59E0B', icon: '⚠️' },
    error: { bg: '#EF4444', icon: '❌' },
  };
  
  const positions = {
    'top-right': { top: 20, right: 20 },
    'top-left': { top: 20, left: 20 },
    'bottom-right': { bottom: 20, right: 20 },
    'bottom-left': { bottom: 20, left: 20 },
  };
  
  const t = types[type];
  
  if (!show && !isVisible) return null;
  
  return (
    <div style={{
      position: 'fixed',
      ...positions[position],
      background: '#242424',
      borderRadius: 8,
      padding: '12px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      boxShadow: animationTokens.shadows.floating,
      borderLeft: `4px solid ${t.bg}`,
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
      transition: reducedMotion ? 'none' : 'opacity 0.3s ease, transform 0.3s ease',
      zIndex: 9999,
    }}>
      <span style={{ fontSize: 18 }}>{t.icon}</span>
      <span style={{ color: '#E8E4DC', fontSize: 14 }}>{message}</span>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => onClose?.(), 300);
        }}
        style={{
          background: 'none',
          border: 'none',
          color: '#6B6560',
          cursor: 'pointer',
          padding: 4,
          marginLeft: 8,
        }}
      >
        ✕
      </button>
    </div>
  );
};

// =============================================================================
// CONFETTI EFFECT
// =============================================================================

export const Confetti = ({ active = false, duration = 3000 }) => {
  const [particles, setParticles] = useState([]);
  const { reducedMotion } = useAnimation();
  
  useEffect(() => {
    if (active && !reducedMotion) {
      const colors = ['#D8B26A', '#3EB4A2', '#8B5CF6', '#F59E0B', '#EF4444', '#3F7249'];
      const newParticles = Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 500,
        duration: 2000 + Math.random() * 1000,
      }));
      setParticles(newParticles);
      
      setTimeout(() => setParticles([]), duration);
    }
  }, [active, duration, reducedMotion]);
  
  if (!active || particles.length === 0) return null;
  
  return (
    <>
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        overflow: 'hidden',
      }}>
        {particles.map(p => (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: `${p.x}%`,
              top: 0,
              width: 10,
              height: 10,
              background: p.color,
              borderRadius: Math.random() > 0.5 ? '50%' : 2,
              animation: `confetti-fall ${p.duration}ms ease-out ${p.delay}ms forwards`,
            }}
          />
        ))}
      </div>
    </>
  );
};

// =============================================================================
// EXPORT ALL
// =============================================================================

export default {
  animationTokens,
  AnimationProvider,
  useAnimation,
  TiltCard,
  FloatingElement,
  PageTransition,
  ScrollReveal,
  Skeleton,
  SkeletonText,
  SkeletonCard,
  CircularProgress,
  LinearProgress,
  AnimatedButton,
  AnimatedInput,
  Toast,
  Confetti,
};
