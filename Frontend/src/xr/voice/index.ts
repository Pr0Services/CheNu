/* =====================================================
   CHE·NU — XR Voice Module
   
   Voice recognition and text-to-speech for VR/AR.
   Supports French Canadian (fr-CA) with wake word.
   ===================================================== */

// Types
export * from './voice.types';

// Commands
export {
  BUILTIN_COMMANDS,
  matchCommand,
  getCommandsByCategory,
  getHelpPhrases,
} from './voiceCommands';

// Hooks
export { useVoiceRecognition } from './useVoiceRecognition';
export type { UseVoiceRecognitionReturn } from './useVoiceRecognition';

export { useTextToSpeech } from './useTextToSpeech';
export type { UseTextToSpeechReturn } from './useTextToSpeech';

// Components
export { 
  XRVoiceIndicator,
  XRVoiceIndicatorCompact,
} from './XRVoiceIndicator';
export type { 
  XRVoiceIndicatorProps,
  XRVoiceIndicatorCompactProps,
} from './XRVoiceIndicator';

export { 
  XRVoiceController,
  useXRVoiceController,
} from './XRVoiceController';
export type { 
  XRVoiceControllerProps,
  UseXRVoiceControllerReturn,
} from './XRVoiceController';

// Re-export defaults
export {
  DEFAULT_VOICE_CONFIG,
  DEFAULT_TTS_CONFIG,
  INITIAL_VOICE_STATE,
  INITIAL_TTS_STATE,
} from './voice.types';
