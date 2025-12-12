/* =====================================================
   CHE·NU — XR Voice Controller
   
   Main voice control component integrating:
   - Voice recognition
   - Command matching
   - Text-to-speech feedback
   - Visual indicators
   ===================================================== */

import React, { useCallback, useEffect, useState } from 'react';

import { useVoiceRecognition } from './useVoiceRecognition';
import { useTextToSpeech } from './useTextToSpeech';
import { XRVoiceIndicator } from './XRVoiceIndicator';
import { matchCommand, BUILTIN_COMMANDS, getHelpPhrases } from './voiceCommands';

import {
  VoiceRecognitionConfig,
  VoiceCommand,
  VoiceCommandMatch,
  VoiceCommandAction,
  VoiceFeedback,
  VoiceLanguage,
  DEFAULT_VOICE_CONFIG,
} from './voice.types';

// ─────────────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────────────

export interface XRVoiceControllerProps {
  // Config
  config?: Partial<VoiceRecognitionConfig>;
  customCommands?: VoiceCommand[];
  context?: string[];
  
  // State
  enabled?: boolean;
  autoStart?: boolean;
  
  // Callbacks
  onCommand?: (action: VoiceCommandAction, match: VoiceCommandMatch) => void;
  onTranscript?: (transcript: string, isFinal: boolean) => void;
  onListeningChange?: (isListening: boolean) => void;
  onError?: (error: Error) => void;
  
  // Visual
  showIndicator?: boolean;
  indicatorPosition?: [number, number, number];
  
  // Audio feedback
  speakFeedback?: boolean;
  feedbackVoice?: string;
}

// ─────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────

export function XRVoiceController({
  config = {},
  customCommands = [],
  context = [],
  enabled = true,
  autoStart = false,
  onCommand,
  onTranscript,
  onListeningChange,
  onError,
  showIndicator = true,
  indicatorPosition = [0, 2.2, -0.5],
  speakFeedback = true,
  feedbackVoice,
}: XRVoiceControllerProps) {
  // Merge commands
  const allCommands = [...BUILTIN_COMMANDS, ...customCommands];
  
  // Voice recognition
  const {
    state: recognitionState,
    start: startRecognition,
    stop: stopRecognition,
    lastTranscript,
    interimTranscript,
    isSupported,
    isListening,
    setLanguage,
  } = useVoiceRecognition(
    { ...DEFAULT_VOICE_CONFIG, ...config },
    (result) => {
      onTranscript?.(result.transcript, result.isFinal);
      
      if (result.isFinal) {
        // Try to match command
        const match = matchCommand(
          result.transcript,
          allCommands,
          context,
          result.confidence
        );
        
        if (match) {
          handleCommand(match);
        }
      }
    },
    (error) => {
      onError?.(new Error(error.message));
    }
  );
  
  // Text-to-speech
  const {
    speak,
    stop: stopSpeaking,
    isSpeaking,
    setLanguage: setTTSLanguage,
  } = useTextToSpeech({
    language: config.language || 'fr-CA',
    voice: feedbackVoice,
  });
  
  // Track listening state changes
  useEffect(() => {
    onListeningChange?.(isListening);
  }, [isListening, onListeningChange]);
  
  // Auto-start
  useEffect(() => {
    if (enabled && autoStart && isSupported) {
      startRecognition();
    }
    
    return () => {
      if (isListening) {
        stopRecognition();
      }
    };
  }, [enabled, autoStart, isSupported]);
  
  // Handle matched command
  const handleCommand = useCallback((match: VoiceCommandMatch) => {
    const { command, confidence } = match;
    
    // Special handling for HELP command
    if (command.action.type === 'HELP') {
      const helpPhrases = getHelpPhrases();
      const helpText = helpPhrases
        .map(({ category, phrases }) => 
          `${category}: ${phrases.slice(0, 3).join(', ')}`
        )
        .join('. ');
      
      if (speakFeedback) {
        speak(`Commandes disponibles: ${helpText}`, { priority: 'high' });
      }
    }
    
    // Speak confirmation if available
    if (speakFeedback && command.confirmationMessage) {
      speak(command.confirmationMessage, { priority: 'normal' });
    }
    
    // Trigger callback
    onCommand?.(command.action, match);
  }, [onCommand, speak, speakFeedback]);
  
  // Give voice feedback
  const giveFeedback = useCallback((feedback: VoiceFeedback) => {
    if (feedback.speak && speakFeedback) {
      speak(feedback.message, {
        priority: feedback.type === 'error' ? 'high' : 'normal',
      });
    }
  }, [speak, speakFeedback]);
  
  // Change language
  const changeLanguage = useCallback((language: VoiceLanguage) => {
    setLanguage(language);
    setTTSLanguage(language);
  }, [setLanguage, setTTSLanguage]);
  
  // Don't render if not supported or disabled
  if (!isSupported || !enabled) {
    return null;
  }
  
  return (
    <>
      {/* Visual indicator */}
      {showIndicator && (
        <XRVoiceIndicator
          state={recognitionState}
          position={indicatorPosition}
          showTranscript
          transcript={lastTranscript}
          interimTranscript={interimTranscript}
        />
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────
// HOOK FOR EXTERNAL CONTROL
// ─────────────────────────────────────────────────────

export interface UseXRVoiceControllerReturn {
  // Voice recognition
  startListening: () => void;
  stopListening: () => void;
  isListening: boolean;
  isSupported: boolean;
  
  // Text-to-speech
  speak: (text: string) => void;
  stopSpeaking: () => void;
  isSpeaking: boolean;
  
  // State
  lastTranscript: string;
  lastCommand?: VoiceCommandMatch;
  
  // Config
  setLanguage: (language: VoiceLanguage) => void;
}

export function useXRVoiceController(
  config: Partial<VoiceRecognitionConfig> = {},
  customCommands: VoiceCommand[] = [],
  context: string[] = []
): UseXRVoiceControllerReturn {
  const allCommands = [...BUILTIN_COMMANDS, ...customCommands];
  const [lastCommand, setLastCommand] = useState<VoiceCommandMatch | undefined>();
  
  const {
    start: startListening,
    stop: stopListening,
    isListening,
    isSupported,
    lastTranscript,
    setLanguage: setRecognitionLanguage,
  } = useVoiceRecognition(
    { ...DEFAULT_VOICE_CONFIG, ...config },
    (result) => {
      if (result.isFinal) {
        const match = matchCommand(
          result.transcript,
          allCommands,
          context,
          result.confidence
        );
        if (match) {
          setLastCommand(match);
        }
      }
    }
  );
  
  const {
    speak: ttsSpeak,
    stop: stopSpeaking,
    isSpeaking,
    setLanguage: setTTSLanguage,
  } = useTextToSpeech({
    language: config.language || 'fr-CA',
  });
  
  const speak = useCallback((text: string) => {
    ttsSpeak(text, { priority: 'normal' });
  }, [ttsSpeak]);
  
  const setLanguage = useCallback((language: VoiceLanguage) => {
    setRecognitionLanguage(language);
    setTTSLanguage(language);
  }, [setRecognitionLanguage, setTTSLanguage]);
  
  return {
    startListening,
    stopListening,
    isListening,
    isSupported,
    speak,
    stopSpeaking,
    isSpeaking,
    lastTranscript,
    lastCommand,
    setLanguage,
  };
}

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default XRVoiceController;
