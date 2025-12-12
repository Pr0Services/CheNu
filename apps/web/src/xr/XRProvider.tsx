/* =====================================================
   CHE·NU — XR Provider
   
   Wraps @react-three/xr to provide VR/AR capabilities.
   Conditionally enables XR based on props and device.
   
   Features:
   - Auto-detection of WebXR support
   - Hand tracking support
   - Session management
   - Graceful fallback
   ===================================================== */

import React, { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  useCallback,
  ReactNode,
} from 'react';
import { XR, Controllers, Hands, useXR } from '@react-three/xr';

import {
  XRSessionMode,
  XRReferenceSpace,
  XRFeature,
  XRState,
  XRUniverseConfig,
  INITIAL_XR_STATE,
  DEFAULT_XR_UNIVERSE,
} from './xr.types';

// ─────────────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────────────

interface XRContextValue {
  state: XRState;
  config: XRUniverseConfig;
  enterVR: () => Promise<void>;
  enterAR: () => Promise<void>;
  exitXR: () => void;
  setConfig: (config: Partial<XRUniverseConfig>) => void;
}

const XRContext = createContext<XRContextValue | null>(null);

// ─────────────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────────────

export function useXRContext(): XRContextValue {
  const ctx = useContext(XRContext);
  if (!ctx) {
    throw new Error('useXRContext must be used within XRProvider');
  }
  return ctx;
}

// ─────────────────────────────────────────────────────
// PROVIDER PROPS
// ─────────────────────────────────────────────────────

export interface XRProviderProps {
  children: ReactNode;
  enabled?: boolean;
  
  // Session config
  referenceSpace?: XRReferenceSpace;
  optionalFeatures?: XRFeature[];
  requiredFeatures?: XRFeature[];
  
  // Universe config
  config?: Partial<XRUniverseConfig>;
  
  // Render options
  showControllers?: boolean;
  showHands?: boolean;
  
  // Callbacks
  onSessionStart?: (mode: XRSessionMode) => void;
  onSessionEnd?: () => void;
  onError?: (error: Error) => void;
}

// ─────────────────────────────────────────────────────
// INNER COMPONENT (needs to be inside XR)
// ─────────────────────────────────────────────────────

interface XRInnerProps {
  showControllers: boolean;
  showHands: boolean;
  onStateChange: (state: Partial<XRState>) => void;
  children: ReactNode;
}

function XRInner({ 
  showControllers, 
  showHands, 
  onStateChange,
  children 
}: XRInnerProps) {
  const { isPresenting, player } = useXR();
  
  // Update state when presenting changes
  useEffect(() => {
    onStateChange({ isPresenting });
  }, [isPresenting, onStateChange]);
  
  return (
    <>
      {/* Controllers visualization */}
      {showControllers && <Controllers />}
      
      {/* Hand tracking visualization */}
      {showHands && <Hands />}
      
      {/* Universe content */}
      {children}
    </>
  );
}

// ─────────────────────────────────────────────────────
// MAIN PROVIDER
// ─────────────────────────────────────────────────────

export function XRProvider({
  children,
  enabled = true,
  referenceSpace = 'local-floor',
  optionalFeatures = ['hand-tracking'],
  requiredFeatures = [],
  config: configProp,
  showControllers = true,
  showHands = true,
  onSessionStart,
  onSessionEnd,
  onError,
}: XRProviderProps) {
  // State
  const [state, setState] = useState<XRState>(INITIAL_XR_STATE);
  const [config, setConfigState] = useState<XRUniverseConfig>({
    ...DEFAULT_XR_UNIVERSE,
    ...configProp,
  });
  
  // Check WebXR support
  useEffect(() => {
    const checkSupport = async () => {
      if (typeof navigator !== 'undefined' && 'xr' in navigator) {
        try {
          const supported = await (navigator as any).xr.isSessionSupported('immersive-vr');
          setState(prev => ({ ...prev, isSupported: supported }));
        } catch (e) {
          setState(prev => ({ ...prev, isSupported: false }));
        }
      }
    };
    checkSupport();
  }, []);
  
  // State change handler
  const handleStateChange = useCallback((partial: Partial<XRState>) => {
    setState(prev => ({ ...prev, ...partial }));
    
    if (partial.isPresenting === true) {
      onSessionStart?.('immersive-vr');
    } else if (partial.isPresenting === false && state.isPresenting) {
      onSessionEnd?.();
    }
  }, [state.isPresenting, onSessionStart, onSessionEnd]);
  
  // Session control functions
  const enterVR = useCallback(async () => {
    // VR entry is handled by XRButton from @react-three/xr
    // This is a placeholder for programmatic entry
    console.log('Enter VR requested');
  }, []);
  
  const enterAR = useCallback(async () => {
    console.log('Enter AR requested');
  }, []);
  
  const exitXR = useCallback(() => {
    console.log('Exit XR requested');
  }, []);
  
  const setConfig = useCallback((partial: Partial<XRUniverseConfig>) => {
    setConfigState(prev => ({ ...prev, ...partial }));
  }, []);
  
  // Context value
  const contextValue: XRContextValue = {
    state,
    config,
    enterVR,
    enterAR,
    exitXR,
    setConfig,
  };
  
  // If XR is disabled, just render children
  if (!enabled) {
    return (
      <XRContext.Provider value={contextValue}>
        {children}
      </XRContext.Provider>
    );
  }
  
  // Session init options
  const sessionInit: XRSessionInit = {
    optionalFeatures: optionalFeatures as string[],
    requiredFeatures: requiredFeatures as string[],
  };
  
  return (
    <XRContext.Provider value={contextValue}>
      <XR
        referenceSpace={referenceSpace}
        sessionInit={sessionInit}
        onError={(error) => {
          console.error('XR Error:', error);
          onError?.(error instanceof Error ? error : new Error(String(error)));
        }}
      >
        <XRInner
          showControllers={showControllers}
          showHands={showHands}
          onStateChange={handleStateChange}
        >
          {children}
        </XRInner>
      </XR>
    </XRContext.Provider>
  );
}

// ─────────────────────────────────────────────────────
// VR/AR BUTTON COMPONENTS
// ─────────────────────────────────────────────────────

export interface XRButtonProps {
  mode: 'vr' | 'ar';
  className?: string;
  style?: React.CSSProperties;
  children?: ReactNode;
}

export function XRButton({ 
  mode, 
  className, 
  style,
  children 
}: XRButtonProps) {
  const [supported, setSupported] = useState(false);
  const [entering, setEntering] = useState(false);
  
  useEffect(() => {
    const check = async () => {
      if ('xr' in navigator) {
        const sessionType = mode === 'vr' ? 'immersive-vr' : 'immersive-ar';
        const isSupported = await (navigator as any).xr.isSessionSupported(sessionType);
        setSupported(isSupported);
      }
    };
    check();
  }, [mode]);
  
  if (!supported) {
    return null;
  }
  
  const defaultStyle: React.CSSProperties = {
    padding: '12px 24px',
    fontSize: 14,
    fontWeight: 600,
    background: mode === 'vr' ? '#6366f1' : '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    ...style,
  };
  
  return (
    <button
      className={className}
      style={defaultStyle}
      disabled={entering}
    >
      {children || (mode === 'vr' ? '🥽 Entrer en VR' : '📱 Entrer en AR')}
    </button>
  );
}

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default XRProvider;
