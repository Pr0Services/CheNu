/* =====================================================
   CHE·NU — XR Voice Types
   
   Types for voice recognition, commands, and
   text-to-speech in VR/AR environment.
   ===================================================== */

// ─────────────────────────────────────────────────────
// VOICE RECOGNITION CONFIG
// ─────────────────────────────────────────────────────

export type VoiceLanguage = 
  | 'fr-CA'
  | 'fr-FR'
  | 'en-US'
  | 'en-GB'
  | 'es-ES'
  | 'de-DE';

export interface VoiceRecognitionConfig {
  language: VoiceLanguage;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  noiseThreshold: number;
  silenceTimeout: number;
  wakeWord?: string;
  wakeWordSensitivity: number;
}

export const DEFAULT_VOICE_CONFIG: VoiceRecognitionConfig = {
  language: 'fr-CA',
  continuous: true,
  interimResults: true,
  maxAlternatives: 3,
  noiseThreshold: 0.3,
  silenceTimeout: 2000,
  wakeWord: 'Nova',
  wakeWordSensitivity: 0.7,
};

// ─────────────────────────────────────────────────────
// RECOGNITION STATE
// ─────────────────────────────────────────────────────

export interface VoiceRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
  alternatives: VoiceAlternative[];
  timestamp: number;
}

export interface VoiceAlternative {
  transcript: string;
  confidence: number;
}

export type VoiceStatus = 
  | 'idle'
  | 'listening'
  | 'processing'
  | 'speaking'
  | 'error'
  | 'not-supported';

export interface VoiceState {
  status: VoiceStatus;
  isListening: boolean;
  isSpeaking: boolean;
  lastResult?: VoiceRecognitionResult;
  error?: VoiceError;
  audioLevel: number;
  wakeWordDetected: boolean;
  awaitingCommand: boolean;
}

export const DEFAULT_VOICE_STATE: VoiceState = {
  status: 'idle',
  isListening: false,
  isSpeaking: false,
  audioLevel: 0,
  wakeWordDetected: false,
  awaitingCommand: false,
};

export interface VoiceError {
  code: VoiceErrorCode;
  message: string;
  timestamp: number;
}

export type VoiceErrorCode =
  | 'not-allowed'
  | 'no-speech'
  | 'audio-capture'
  | 'network'
  | 'aborted'
  | 'language-not-supported'
  | 'not-supported'
  | 'unknown';

// ─────────────────────────────────────────────────────
// VOICE COMMANDS
// ─────────────────────────────────────────────────────

export interface VoiceCommand {
  id: string;
  phrases: string[];
  action: VoiceCommandAction;
  category: VoiceCommandCategory;
  fuzzyMatch: boolean;
  minConfidence: number;
  contextRequired?: string[];
  confirmationMessage?: string;
  soundEffect?: VoiceSoundEffect;
}

export type VoiceCommandCategory =
  | 'navigation'
  | 'selection'
  | 'meeting'
  | 'agent'
  | 'decision'
  | 'system'
  | 'replay'
  | 'custom';

export type VoiceCommandAction =
  | { type: 'NAVIGATE_TO'; target: string }
  | { type: 'SELECT_SPHERE'; sphereId: string }
  | { type: 'ENTER_SPHERE'; sphereId: string }
  | { type: 'GO_BACK' }
  | { type: 'GO_HOME' }
  | { type: 'START_MEETING' }
  | { type: 'END_MEETING' }
  | { type: 'ASK_AGENT'; agentId?: string; question: string }
  | { type: 'ASK_ALL_AGENTS'; question: string }
  | { type: 'MAKE_DECISION'; optionId: string }
  | { type: 'CONFIRM' }
  | { type: 'CANCEL' }
  | { type: 'PLAY' }
  | { type: 'PAUSE' }
  | { type: 'REWIND' }
  | { type: 'MUTE' }
  | { type: 'UNMUTE' }
  | { type: 'HELP' }
  | { type: 'REPEAT' }
  | { type: 'CUSTOM'; payload: unknown };

export interface VoiceCommandMatch {
  command: VoiceCommand;
  transcript: string;
  confidence: number;
  matchedPhrase: string;
  extractedParams?: Record<string, string>;
}

// ─────────────────────────────────────────────────────
// TEXT TO SPEECH
// ─────────────────────────────────────────────────────

export interface TTSConfig {
  language: VoiceLanguage;
  voiceId?: string;
  rate: number;
  pitch: number;
  volume: number;
}

export const DEFAULT_TTS_CONFIG: TTSConfig = {
  language: 'fr-CA',
  rate: 1.0,
  pitch: 1.0,
  volume: 0.8,
};

export interface TTSUtterance {
  id: string;
  text: string;
  priority: 'high' | 'normal' | 'low';
  interruptible: boolean;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: Error) => void;
}

export interface TTSVoice {
  id: string;
  name: string;
  language: VoiceLanguage;
  gender: 'male' | 'female' | 'neutral';
  isDefault: boolean;
}

// ─────────────────────────────────────────────────────
// SOUND EFFECTS
// ─────────────────────────────────────────────────────

export type VoiceSoundEffect =
  | 'wake'
  | 'listening'
  | 'success'
  | 'error'
  | 'confirm'
  | 'cancel'
  | 'notification';

// ─────────────────────────────────────────────────────
// TRANSCRIPTION
// ─────────────────────────────────────────────────────

export interface TranscriptEntry {
  id: string;
  speaker: 'human' | 'agent' | 'system';
  speakerId?: string;
  speakerName?: string;
  text: string;
  timestamp: number;
  confidence?: number;
  isFinal: boolean;
}

export interface TranscriptSession {
  id: string;
  meetingId?: string;
  startedAt: number;
  endedAt?: number;
  entries: TranscriptEntry[];
  language: VoiceLanguage;
}

// ─────────────────────────────────────────────────────
// XR FEEDBACK
// ─────────────────────────────────────────────────────

export interface VoiceFeedbackConfig {
  showWaveform: boolean;
  showTranscript: boolean;
  showConfidence: boolean;
  position: 'bottom' | 'top' | 'floating' | 'wrist';
  waveformColor: string;
  transcriptColor: string;
}

export const DEFAULT_FEEDBACK_CONFIG: VoiceFeedbackConfig = {
  showWaveform: true,
  showTranscript: true,
  showConfidence: false,
  position: 'bottom',
  waveformColor: '#6366f1',
  transcriptColor: '#ffffff',
};
