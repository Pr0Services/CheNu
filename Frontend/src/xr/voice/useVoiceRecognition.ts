/* =====================================================
   CHE·NU — useVoiceRecognition Hook
   
   React hook wrapping Web Speech API for voice
   recognition with wake word detection.
   ===================================================== */

import { useState, useEffect, useCallback, useRef } from 'react';

import {
  VoiceRecognitionConfig,
  VoiceRecognitionState,
  VoiceRecognitionResult,
  VoiceError,
  VoiceErrorCode,
  DEFAULT_VOICE_CONFIG,
  INITIAL_VOICE_STATE,
} from './voice.types';

// ─────────────────────────────────────────────────────
// WEB SPEECH API TYPES
// ─────────────────────────────────────────────────────

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  isFinal: boolean;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

// ─────────────────────────────────────────────────────
// GET SPEECH RECOGNITION
// ─────────────────────────────────────────────────────

function getSpeechRecognition(): typeof SpeechRecognition | null {
  if (typeof window === 'undefined') return null;
  
  return (
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition ||
    null
  );
}

// ─────────────────────────────────────────────────────
// HOOK RETURN TYPE
// ─────────────────────────────────────────────────────

export interface UseVoiceRecognitionReturn {
  state: VoiceRecognitionState;
  
  // Controls
  start: () => void;
  stop: () => void;
  toggle: () => void;
  
  // Results
  lastTranscript: string;
  interimTranscript: string;
  
  // Status
  isSupported: boolean;
  isListening: boolean;
  
  // Config
  setLanguage: (language: string) => void;
  setWakeWord: (word: string | undefined) => void;
}

// ─────────────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────────────

export function useVoiceRecognition(
  config: Partial<VoiceRecognitionConfig> = {},
  onResult?: (result: VoiceRecognitionResult) => void,
  onError?: (error: VoiceError) => void
): UseVoiceRecognitionReturn {
  const mergedConfig = { ...DEFAULT_VOICE_CONFIG, ...config };
  
  // State
  const [state, setState] = useState<VoiceRecognitionState>(INITIAL_VOICE_STATE);
  const [lastTranscript, setLastTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [currentConfig, setCurrentConfig] = useState(mergedConfig);
  
  // Refs
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Check support
  const SpeechRecognitionClass = getSpeechRecognition();
  const isSupported = !!SpeechRecognitionClass;
  
  // Initialize recognition
  useEffect(() => {
    if (!isSupported || !SpeechRecognitionClass) {
      setState(prev => ({ ...prev, status: 'not-supported' }));
      return;
    }
    
    const recognition = new SpeechRecognitionClass();
    
    recognition.continuous = currentConfig.continuous;
    recognition.interimResults = currentConfig.interimResults;
    recognition.maxAlternatives = currentConfig.maxAlternatives;
    recognition.lang = currentConfig.language;
    
    // Handle results
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interim = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;
        
        if (result.isFinal) {
          finalTranscript += transcript;
        } else {
          interim += transcript;
        }
      }
      
      setInterimTranscript(interim);
      
      if (finalTranscript) {
        setLastTranscript(finalTranscript);
        
        // Check wake word
        const wakeWord = currentConfig.wakeWord?.toLowerCase();
        let awaitingCommand = state.awaitingCommand;
        let wakeWordDetected = state.wakeWordDetected;
        
        if (wakeWord && !awaitingCommand) {
          if (finalTranscript.toLowerCase().includes(wakeWord)) {
            wakeWordDetected = true;
            awaitingCommand = true;
            setState(prev => ({
              ...prev,
              wakeWordDetected: true,
              awaitingCommand: true,
            }));
          }
        }
        
        // Build result
        const voiceResult: VoiceRecognitionResult = {
          transcript: finalTranscript,
          confidence: event.results[event.results.length - 1][0].confidence,
          isFinal: true,
          alternatives: Array.from(
            { length: event.results[event.results.length - 1].length },
            (_, i) => ({
              transcript: event.results[event.results.length - 1][i].transcript,
              confidence: event.results[event.results.length - 1][i].confidence,
            })
          ),
          timestamp: Date.now(),
        };
        
        setState(prev => ({
          ...prev,
          lastResult: voiceResult,
          isSpeaking: true,
        }));
        
        onResult?.(voiceResult);
        
        // Reset silence timeout
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
        }
        silenceTimeoutRef.current = setTimeout(() => {
          setState(prev => ({
            ...prev,
            isSpeaking: false,
            awaitingCommand: false,
          }));
        }, currentConfig.silenceTimeout);
      }
    };
    
    // Handle errors
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      const errorCode = mapErrorCode(event.error);
      
      const error: VoiceError = {
        code: errorCode,
        message: event.message || event.error,
        timestamp: Date.now(),
      };
      
      setState(prev => ({
        ...prev,
        status: 'error',
        error,
        isListening: false,
      }));
      
      onError?.(error);
    };
    
    // Handle start
    recognition.onstart = () => {
      setState(prev => ({
        ...prev,
        status: 'listening',
        isListening: true,
        error: undefined,
      }));
    };
    
    // Handle end
    recognition.onend = () => {
      setState(prev => ({
        ...prev,
        status: 'idle',
        isListening: false,
      }));
      
      // Auto-restart if continuous mode
      if (currentConfig.continuous && state.isListening) {
        restartTimeoutRef.current = setTimeout(() => {
          try {
            recognition.start();
          } catch (e) {
            // Already started
          }
        }, 100);
      }
    };
    
    // Handle audio start
    recognition.onaudiostart = () => {
      setState(prev => ({ ...prev, isSpeaking: true }));
    };
    
    // Handle audio end
    recognition.onaudioend = () => {
      setState(prev => ({ ...prev, isSpeaking: false }));
    };
    
    recognitionRef.current = recognition;
    
    return () => {
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
      try {
        recognition.stop();
      } catch (e) {
        // Not started
      }
    };
  }, [isSupported, currentConfig, onResult, onError]);
  
  // Start recognition
  const start = useCallback(() => {
    if (!recognitionRef.current || !isSupported) return;
    
    try {
      recognitionRef.current.start();
    } catch (e) {
      // Already started, restart
      recognitionRef.current.stop();
      setTimeout(() => {
        recognitionRef.current?.start();
      }, 100);
    }
  }, [isSupported]);
  
  // Stop recognition
  const stop = useCallback(() => {
    if (!recognitionRef.current) return;
    
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
    }
    
    try {
      recognitionRef.current.stop();
    } catch (e) {
      // Not started
    }
    
    setState(prev => ({
      ...prev,
      isListening: false,
      status: 'idle',
    }));
  }, []);
  
  // Toggle
  const toggle = useCallback(() => {
    if (state.isListening) {
      stop();
    } else {
      start();
    }
  }, [state.isListening, start, stop]);
  
  // Set language
  const setLanguage = useCallback((language: string) => {
    setCurrentConfig(prev => ({ ...prev, language: language as any }));
    
    if (recognitionRef.current) {
      const wasListening = state.isListening;
      stop();
      recognitionRef.current.lang = language;
      if (wasListening) {
        setTimeout(start, 100);
      }
    }
  }, [state.isListening, stop, start]);
  
  // Set wake word
  const setWakeWord = useCallback((word: string | undefined) => {
    setCurrentConfig(prev => ({ ...prev, wakeWord: word }));
    setState(prev => ({
      ...prev,
      wakeWordDetected: false,
      awaitingCommand: false,
    }));
  }, []);
  
  return {
    state,
    start,
    stop,
    toggle,
    lastTranscript,
    interimTranscript,
    isSupported,
    isListening: state.isListening,
    setLanguage,
    setWakeWord,
  };
}

// ─────────────────────────────────────────────────────
// ERROR CODE MAPPING
// ─────────────────────────────────────────────────────

function mapErrorCode(error: string): VoiceErrorCode {
  switch (error) {
    case 'not-allowed':
    case 'permission-denied':
      return 'not-allowed';
    case 'no-speech':
      return 'no-speech';
    case 'audio-capture':
      return 'audio-capture';
    case 'network':
      return 'network';
    case 'aborted':
      return 'aborted';
    case 'language-not-supported':
      return 'language-not-supported';
    case 'service-not-allowed':
      return 'service-not-allowed';
    default:
      return 'unknown';
  }
}

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default useVoiceRecognition;
