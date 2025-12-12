import React, { useState, useEffect, useCallback, useRef } from 'react';
import { colors, radius, shadows, transitions, space, typography, zIndex } from '../design-system/tokens';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — VOICE NAVIGATION & COMMANDS
 * ═══════════════════════════════════════════════════════════════════════════════
 * P3-06: Navigation vocale via Nova
 * 
 * Features:
 * - Reconnaissance vocale (Web Speech API)
 * - Commandes vocales pour navigation
 * - Dictée pour inputs
 * - Feedback vocal (Text-to-Speech)
 * - Indicateur visuel d'écoute
 * - Multi-langues (FR/EN/ES)
 * 
 * Usage:
 *   const { startListening, isListening, transcript } = useVoiceNavigation({
 *     onCommand: handleVoiceCommand,
 *     language: 'fr-CA',
 *   });
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ─────────────────────────────────────────────────────────────────────────────
// VOICE COMMANDS MAPPING
// ─────────────────────────────────────────────────────────────────────────────

export const voiceCommands = {
  // Navigation (FR)
  'aller au tableau de bord': { action: 'navigate', target: 'dashboard' },
  'aller aux projets': { action: 'navigate', target: 'projects' },
  'aller au calendrier': { action: 'navigate', target: 'calendar' },
  'aller aux courriels': { action: 'navigate', target: 'email' },
  'aller à l\'équipe': { action: 'navigate', target: 'team' },
  'aller aux finances': { action: 'navigate', target: 'finance' },
  'aller aux documents': { action: 'navigate', target: 'documents' },
  'aller aux paramètres': { action: 'navigate', target: 'settings' },
  'retour': { action: 'navigate', target: 'back' },
  'accueil': { action: 'navigate', target: 'dashboard' },
  
  // Actions (FR)
  'nouveau projet': { action: 'create', target: 'project' },
  'nouvelle tâche': { action: 'create', target: 'task' },
  'nouveau devis': { action: 'create', target: 'quote' },
  'nouvelle facture': { action: 'create', target: 'invoice' },
  'nouveau rendez-vous': { action: 'create', target: 'event' },
  'nouveau contact': { action: 'create', target: 'contact' },
  
  // Recherche (FR)
  'rechercher': { action: 'open', target: 'search' },
  'ouvrir la recherche': { action: 'open', target: 'search' },
  
  // Nova (FR)
  'nova': { action: 'open', target: 'nova' },
  'appeler nova': { action: 'open', target: 'nova' },
  'aide': { action: 'open', target: 'nova' },
  
  // UI Controls (FR)
  'thème sombre': { action: 'theme', target: 'dark' },
  'thème clair': { action: 'theme', target: 'light' },
  'plein écran': { action: 'toggle', target: 'fullscreen' },
  'fermer': { action: 'close', target: 'modal' },
  'annuler': { action: 'cancel' },
  'sauvegarder': { action: 'save' },
  
  // English commands
  'go to dashboard': { action: 'navigate', target: 'dashboard' },
  'go to projects': { action: 'navigate', target: 'projects' },
  'go to calendar': { action: 'navigate', target: 'calendar' },
  'go to email': { action: 'navigate', target: 'email' },
  'new project': { action: 'create', target: 'project' },
  'new task': { action: 'create', target: 'task' },
  'search': { action: 'open', target: 'search' },
  'help': { action: 'open', target: 'nova' },
  
  // Spanish commands
  'ir al tablero': { action: 'navigate', target: 'dashboard' },
  'ir a proyectos': { action: 'navigate', target: 'projects' },
  'nuevo proyecto': { action: 'create', target: 'project' },
  'buscar': { action: 'open', target: 'search' },
  'ayuda': { action: 'open', target: 'nova' },
};

// Command aliases and fuzzy matching
const commandAliases = {
  'tableau': 'tableau de bord',
  'dashboard': 'tableau de bord',
  'projet': 'projets',
  'mail': 'courriels',
  'email': 'courriels',
  'courriel': 'courriels',
  'équipe': 'équipe',
  'team': 'équipe',
  'finance': 'finances',
  'money': 'finances',
  'argent': 'finances',
  'settings': 'paramètres',
  'config': 'paramètres',
};

// ─────────────────────────────────────────────────────────────────────────────
// VOICE RECOGNITION HOOK
// ─────────────────────────────────────────────────────────────────────────────

export function useVoiceNavigation({
  onCommand,
  onTranscript,
  onError,
  language = 'fr-CA',
  continuous = false,
  interimResults = true,
} = {}) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  // Check browser support
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = continuous;
      recognitionRef.current.interimResults = interimResults;
      recognitionRef.current.lang = language;
    }
  }, [continuous, interimResults, language]);

  // Start listening
  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListening) return;

    setError(null);
    setTranscript('');
    setInterimTranscript('');

    recognitionRef.current.onstart = () => {
      setIsListening(true);
    };

    recognitionRef.current.onresult = (event) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }

      setInterimTranscript(interim);
      
      if (final) {
        setTranscript(final);
        onTranscript?.(final);
        
        // Try to match command
        const command = matchCommand(final.toLowerCase().trim());
        if (command) {
          onCommand?.(command, final);
        }
      }
    };

    recognitionRef.current.onerror = (event) => {
      const errorMsg = getErrorMessage(event.error);
      setError(errorMsg);
      onError?.(errorMsg, event.error);
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
      setInterimTranscript('');
    };

    try {
      recognitionRef.current.start();
    } catch (err) {
      setError('Impossible de démarrer la reconnaissance vocale');
      onError?.('Impossible de démarrer la reconnaissance vocale', err);
    }
  }, [isListening, onCommand, onTranscript, onError]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, []);

  // Toggle listening
  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  // Change language
  const setLanguage = useCallback((lang) => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = lang;
    }
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  return {
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    error,
    startListening,
    stopListening,
    toggleListening,
    setLanguage,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// TEXT-TO-SPEECH HOOK
// ─────────────────────────────────────────────────────────────────────────────

export function useTextToSpeech({ language = 'fr-CA', rate = 1, pitch = 1 } = {}) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [voices, setVoices] = useState([]);
  const utteranceRef = useRef(null);

  useEffect(() => {
    setIsSupported('speechSynthesis' in window);
    
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        const availableVoices = speechSynthesis.getVoices();
        setVoices(availableVoices);
      };
      
      loadVoices();
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const speak = useCallback((text, options = {}) => {
    if (!('speechSynthesis' in window)) return;

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = options.language || language;
    utterance.rate = options.rate || rate;
    utterance.pitch = options.pitch || pitch;

    // Try to find a matching voice
    const preferredVoice = voices.find(v => 
      v.lang.startsWith(language.split('-')[0]) && v.localService
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  }, [language, rate, pitch, voices]);

  const stop = useCallback(() => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return {
    speak,
    stop,
    isSpeaking,
    isSupported,
    voices,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// VOICE BUTTON COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function VoiceButton({
  onCommand,
  size = 'md',
  language = 'fr-CA',
  showTranscript = true,
  position,
  style,
}) {
  const {
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    error,
    toggleListening,
  } = useVoiceNavigation({ onCommand, language });

  const { speak } = useTextToSpeech({ language });

  const sizes = {
    sm: { button: '36px', icon: '18px' },
    md: { button: '48px', icon: '24px' },
    lg: { button: '60px', icon: '32px' },
  };

  const s = sizes[size];

  // Announce when listening starts
  useEffect(() => {
    if (isListening) {
      speak('Je vous écoute');
    }
  }, [isListening, speak]);

  if (!isSupported) {
    return null; // Don't show if not supported
  }

  return (
    <div style={{ position: 'relative', ...style }}>
      <button
        onClick={toggleListening}
        aria-label={isListening ? 'Arrêter l\'écoute vocale' : 'Démarrer l\'écoute vocale'}
        aria-pressed={isListening}
        style={{
          width: s.button,
          height: s.button,
          borderRadius: '50%',
          background: isListening 
            ? `linear-gradient(135deg, ${colors.status.error} 0%, ${colors.sacredGold} 100%)`
            : colors.background.tertiary,
          border: `2px solid ${isListening ? colors.status.error : colors.border.default}`,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: transitions.smooth,
          position: 'relative',
          overflow: 'hidden',
          ...position,
        }}
      >
        {/* Pulse animation when listening */}
        {isListening && (
          <>
            <span style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              background: colors.status.error,
              animation: 'voice-pulse 1.5s ease-in-out infinite',
              opacity: 0.3,
            }} />
            <span style={{
              position: 'absolute',
              inset: '4px',
              borderRadius: '50%',
              background: colors.status.error,
              animation: 'voice-pulse 1.5s ease-in-out infinite 0.3s',
              opacity: 0.2,
            }} />
          </>
        )}
        
        {/* Microphone icon */}
        <svg
          width={s.icon}
          height={s.icon}
          viewBox="0 0 24 24"
          fill="none"
          stroke={isListening ? '#FFFFFF' : colors.text.secondary}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ position: 'relative', zIndex: 1 }}
        >
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="23" />
          <line x1="8" y1="23" x2="16" y2="23" />
        </svg>
      </button>

      {/* Transcript popup */}
      {showTranscript && isListening && (interimTranscript || transcript) && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: space.sm,
          padding: `${space.sm} ${space.md}`,
          background: colors.background.secondary,
          borderRadius: radius.lg,
          boxShadow: shadows.lg,
          border: `1px solid ${colors.border.default}`,
          minWidth: '200px',
          maxWidth: '300px',
          textAlign: 'center',
          animation: 'voice-appear 200ms ease',
        }}>
          <div style={{
            fontSize: typography.fontSize.sm,
            color: interimTranscript ? colors.text.muted : colors.text.primary,
            fontStyle: interimTranscript ? 'italic' : 'normal',
          }}>
            {interimTranscript || transcript || 'En écoute...'}
          </div>
          
          {/* Visual indicator */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '4px',
            marginTop: space.xs,
          }}>
            {[0, 1, 2, 3, 4].map(i => (
              <span
                key={i}
                style={{
                  width: '4px',
                  height: '16px',
                  background: colors.sacredGold,
                  borderRadius: '2px',
                  animation: `voice-bar ${0.5 + i * 0.1}s ease-in-out infinite alternate`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: space.sm,
          padding: `${space.xs} ${space.sm}`,
          background: colors.status.errorBg,
          color: colors.status.error,
          borderRadius: radius.md,
          fontSize: typography.fontSize.xs,
          whiteSpace: 'nowrap',
        }}>
          {error}
        </div>
      )}

      <style>
        {`
          @keyframes voice-pulse {
            0%, 100% { transform: scale(1); opacity: 0.3; }
            50% { transform: scale(1.2); opacity: 0; }
          }
          
          @keyframes voice-appear {
            from { opacity: 0; transform: translateX(-50%) translateY(10px); }
            to { opacity: 1; transform: translateX(-50%) translateY(0); }
          }
          
          @keyframes voice-bar {
            from { height: 4px; }
            to { height: 16px; }
          }
        `}
      </style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// VOICE INDICATOR (for continuous listening mode)
// ─────────────────────────────────────────────────────────────────────────────

export function VoiceIndicator({ isListening, transcript, style }) {
  if (!isListening) return null;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: space.sm,
      padding: `${space.sm} ${space.md}`,
      background: `${colors.status.error}15`,
      border: `1px solid ${colors.status.error}30`,
      borderRadius: radius.full,
      ...style,
    }}>
      {/* Recording dot */}
      <span style={{
        width: '10px',
        height: '10px',
        background: colors.status.error,
        borderRadius: '50%',
        animation: 'voice-blink 1s ease-in-out infinite',
      }} />
      
      <span style={{
        fontSize: typography.fontSize.sm,
        color: colors.text.secondary,
      }}>
        {transcript || 'En écoute...'}
      </span>

      <style>
        {`
          @keyframes voice-blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
          }
        `}
      </style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DICTATION INPUT
// ─────────────────────────────────────────────────────────────────────────────

export function DictationInput({
  value,
  onChange,
  placeholder,
  language = 'fr-CA',
  multiline = false,
  style,
  ...props
}) {
  const [localValue, setLocalValue] = useState(value || '');
  const inputRef = useRef(null);

  const handleVoiceTranscript = useCallback((text) => {
    const newValue = localValue + (localValue ? ' ' : '') + text;
    setLocalValue(newValue);
    onChange?.({ target: { value: newValue } });
  }, [localValue, onChange]);

  const {
    isListening,
    isSupported,
    interimTranscript,
    toggleListening,
  } = useVoiceNavigation({
    onTranscript: handleVoiceTranscript,
    language,
    continuous: true,
  });

  useEffect(() => {
    if (value !== undefined) {
      setLocalValue(value);
    }
  }, [value]);

  const InputComponent = multiline ? 'textarea' : 'input';

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <InputComponent
        ref={inputRef}
        value={localValue + (interimTranscript ? ` ${interimTranscript}` : '')}
        onChange={(e) => {
          setLocalValue(e.target.value);
          onChange?.(e);
        }}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: `${space.sm} ${space.md}`,
          paddingRight: isSupported ? '48px' : space.md,
          background: colors.background.input,
          border: `1px solid ${isListening ? colors.sacredGold : colors.border.default}`,
          borderRadius: radius.md,
          fontSize: typography.fontSize.base,
          color: colors.text.primary,
          outline: 'none',
          resize: multiline ? 'vertical' : 'none',
          minHeight: multiline ? '100px' : 'auto',
          fontFamily: typography.fontFamily.body,
          transition: transitions.fast,
          ...style,
        }}
        {...props}
      />
      
      {isSupported && (
        <button
          type="button"
          onClick={toggleListening}
          aria-label={isListening ? 'Arrêter la dictée' : 'Démarrer la dictée'}
          style={{
            position: 'absolute',
            right: '8px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '32px',
            height: '32px',
            background: isListening ? colors.status.error : 'transparent',
            border: 'none',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: transitions.fast,
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke={isListening ? '#FFFFFF' : colors.text.muted}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function matchCommand(text) {
  // Direct match
  if (voiceCommands[text]) {
    return voiceCommands[text];
  }

  // Check aliases
  for (const [alias, full] of Object.entries(commandAliases)) {
    if (text.includes(alias)) {
      const fullCommand = `aller aux ${full}`;
      if (voiceCommands[fullCommand]) {
        return voiceCommands[fullCommand];
      }
      // Try other patterns
      for (const [cmd, action] of Object.entries(voiceCommands)) {
        if (cmd.includes(full)) {
          return action;
        }
      }
    }
  }

  // Fuzzy match
  const words = text.split(' ');
  for (const [cmd, action] of Object.entries(voiceCommands)) {
    const cmdWords = cmd.split(' ');
    const matchCount = words.filter(w => cmdWords.some(cw => cw.includes(w) || w.includes(cw))).length;
    if (matchCount >= Math.ceil(cmdWords.length * 0.6)) {
      return action;
    }
  }

  return null;
}

function getErrorMessage(error) {
  const messages = {
    'no-speech': 'Aucune parole détectée',
    'audio-capture': 'Impossible d\'accéder au microphone',
    'not-allowed': 'Permission microphone refusée',
    'network': 'Erreur réseau',
    'aborted': 'Reconnaissance annulée',
    'language-not-supported': 'Langue non supportée',
  };
  return messages[error] || 'Erreur de reconnaissance vocale';
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

export default VoiceButton;
