/* =====================================================
   CHE·NU — useTextToSpeech Hook
   
   React hook for text-to-speech using Web Speech API.
   Supports queue, priority, and voice selection.
   ===================================================== */

import { useState, useEffect, useCallback, useRef } from 'react';

import {
  TTSConfig,
  TTSState,
  TTSUtterance,
  VoiceLanguage,
  DEFAULT_TTS_CONFIG,
  INITIAL_TTS_STATE,
} from './voice.types';

// ─────────────────────────────────────────────────────
// HOOK RETURN TYPE
// ─────────────────────────────────────────────────────

export interface UseTextToSpeechReturn {
  state: TTSState;
  
  // Controls
  speak: (text: string, options?: Partial<TTSUtterance>) => string;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  cancel: (utteranceId: string) => void;
  clearQueue: () => void;
  
  // Status
  isSupported: boolean;
  isSpeaking: boolean;
  isPaused: boolean;
  
  // Voice selection
  voices: SpeechSynthesisVoice[];
  setVoice: (voiceId: string) => void;
  setLanguage: (language: VoiceLanguage) => void;
  
  // Config
  setRate: (rate: number) => void;
  setPitch: (pitch: number) => void;
  setVolume: (volume: number) => void;
}

// ─────────────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────────────

export function useTextToSpeech(
  config: Partial<TTSConfig> = {}
): UseTextToSpeechReturn {
  const mergedConfig = { ...DEFAULT_TTS_CONFIG, ...config };
  
  // State
  const [state, setState] = useState<TTSState>(INITIAL_TTS_STATE);
  const [currentConfig, setCurrentConfig] = useState(mergedConfig);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  
  // Refs
  const queueRef = useRef<TTSUtterance[]>([]);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const utteranceIdCounter = useRef(0);
  
  // Check support
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  
  // Load voices
  useEffect(() => {
    if (!isSupported) return;
    
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      setVoices(availableVoices);
      
      // Find voice for current language
      const languageVoice = availableVoices.find(
        v => v.lang.startsWith(currentConfig.language)
      );
      if (languageVoice && !selectedVoice) {
        setSelectedVoice(languageVoice);
      }
      
      setState(prev => ({ ...prev, availableVoices: availableVoices }));
    };
    
    loadVoices();
    
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
    
    return () => {
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [isSupported, currentConfig.language]);
  
  // Process queue
  const processQueue = useCallback(() => {
    if (!isSupported || state.isSpeaking || queueRef.current.length === 0) {
      return;
    }
    
    // Sort by priority
    queueRef.current.sort((a, b) => {
      const priorityOrder = { high: 0, normal: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    
    const nextUtterance = queueRef.current.shift();
    if (!nextUtterance) return;
    
    const utterance = new SpeechSynthesisUtterance(nextUtterance.text);
    
    // Apply config
    utterance.rate = currentConfig.rate;
    utterance.pitch = currentConfig.pitch;
    utterance.volume = currentConfig.volume;
    utterance.lang = currentConfig.language;
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    // Event handlers
    utterance.onstart = () => {
      setState(prev => ({
        ...prev,
        isSpeaking: true,
        currentUtterance: nextUtterance,
      }));
      nextUtterance.onStart?.();
    };
    
    utterance.onend = () => {
      setState(prev => ({
        ...prev,
        isSpeaking: false,
        currentUtterance: undefined,
        queue: [...queueRef.current],
      }));
      nextUtterance.onEnd?.();
      currentUtteranceRef.current = null;
      
      // Process next in queue
      setTimeout(processQueue, 50);
    };
    
    utterance.onerror = (event) => {
      setState(prev => ({
        ...prev,
        isSpeaking: false,
        currentUtterance: undefined,
      }));
      nextUtterance.onError?.(new Error(event.error));
      currentUtteranceRef.current = null;
      
      // Process next in queue
      setTimeout(processQueue, 50);
    };
    
    currentUtteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  }, [isSupported, state.isSpeaking, currentConfig, selectedVoice]);
  
  // Speak
  const speak = useCallback((
    text: string,
    options: Partial<TTSUtterance> = {}
  ): string => {
    if (!isSupported) return '';
    
    const id = `tts-${++utteranceIdCounter.current}`;
    
    const utterance: TTSUtterance = {
      id,
      text,
      priority: options.priority || 'normal',
      interruptible: options.interruptible ?? true,
      onStart: options.onStart,
      onEnd: options.onEnd,
      onError: options.onError,
    };
    
    // High priority can interrupt
    if (utterance.priority === 'high' && state.isSpeaking) {
      const current = state.currentUtterance;
      if (current?.interruptible) {
        speechSynthesis.cancel();
      }
    }
    
    queueRef.current.push(utterance);
    setState(prev => ({ ...prev, queue: [...queueRef.current] }));
    
    processQueue();
    
    return id;
  }, [isSupported, state.isSpeaking, state.currentUtterance, processQueue]);
  
  // Stop
  const stop = useCallback(() => {
    if (!isSupported) return;
    speechSynthesis.cancel();
    setState(prev => ({
      ...prev,
      isSpeaking: false,
      currentUtterance: undefined,
    }));
    currentUtteranceRef.current = null;
  }, [isSupported]);
  
  // Pause
  const pause = useCallback(() => {
    if (!isSupported) return;
    speechSynthesis.pause();
    setIsPaused(true);
  }, [isSupported]);
  
  // Resume
  const resume = useCallback(() => {
    if (!isSupported) return;
    speechSynthesis.resume();
    setIsPaused(false);
  }, [isSupported]);
  
  // Cancel specific utterance
  const cancel = useCallback((utteranceId: string) => {
    queueRef.current = queueRef.current.filter(u => u.id !== utteranceId);
    setState(prev => ({ ...prev, queue: [...queueRef.current] }));
    
    if (state.currentUtterance?.id === utteranceId) {
      speechSynthesis.cancel();
      processQueue();
    }
  }, [state.currentUtterance, processQueue]);
  
  // Clear queue
  const clearQueue = useCallback(() => {
    queueRef.current = [];
    setState(prev => ({ ...prev, queue: [] }));
  }, []);
  
  // Set voice
  const setVoice = useCallback((voiceId: string) => {
    const voice = voices.find(v => v.voiceURI === voiceId);
    if (voice) {
      setSelectedVoice(voice);
    }
  }, [voices]);
  
  // Set language
  const setLanguage = useCallback((language: VoiceLanguage) => {
    setCurrentConfig(prev => ({ ...prev, language }));
    
    // Find voice for new language
    const languageVoice = voices.find(v => v.lang.startsWith(language));
    if (languageVoice) {
      setSelectedVoice(languageVoice);
    }
  }, [voices]);
  
  // Set rate
  const setRate = useCallback((rate: number) => {
    setCurrentConfig(prev => ({ 
      ...prev, 
      rate: Math.max(0.5, Math.min(2, rate)) 
    }));
  }, []);
  
  // Set pitch
  const setPitch = useCallback((pitch: number) => {
    setCurrentConfig(prev => ({ 
      ...prev, 
      pitch: Math.max(0.5, Math.min(2, pitch)) 
    }));
  }, []);
  
  // Set volume
  const setVolume = useCallback((volume: number) => {
    setCurrentConfig(prev => ({ 
      ...prev, 
      volume: Math.max(0, Math.min(1, volume)) 
    }));
  }, []);
  
  return {
    state,
    speak,
    stop,
    pause,
    resume,
    cancel,
    clearQueue,
    isSupported,
    isSpeaking: state.isSpeaking,
    isPaused,
    voices,
    setVoice,
    setLanguage,
    setRate,
    setPitch,
    setVolume,
  };
}

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default useTextToSpeech;
