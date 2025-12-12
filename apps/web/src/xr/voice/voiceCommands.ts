/* =====================================================
   CHE·NU — Voice Commands Registry
   
   Built-in voice commands for navigation, meetings,
   agent interaction, and system control.
   Optimized for French Canadian (fr-CA).
   ===================================================== */

import {
  VoiceCommand,
  VoiceCommandMatch,
  VoiceCommandCategory,
} from './voice.types';

// ─────────────────────────────────────────────────────
// NAVIGATION COMMANDS
// ─────────────────────────────────────────────────────

const NAVIGATION_COMMANDS: VoiceCommand[] = [
  {
    id: 'nav-home',
    phrases: [
      'retour à la maison',
      'aller à l\'accueil',
      'accueil',
      'go home',
      'home',
    ],
    action: { type: 'GO_HOME' },
    category: 'navigation',
    fuzzyMatch: true,
    minConfidence: 0.7,
    confirmationMessage: 'Retour à l\'accueil',
  },
  {
    id: 'nav-back',
    phrases: [
      'retour',
      'revenir',
      'précédent',
      'go back',
      'back',
    ],
    action: { type: 'GO_BACK' },
    category: 'navigation',
    fuzzyMatch: true,
    minConfidence: 0.7,
  },
  {
    id: 'nav-business',
    phrases: [
      'aller à business',
      'sphère business',
      'affaires',
      'go to business',
    ],
    action: { type: 'NAVIGATE_TO', target: 'business' },
    category: 'navigation',
    fuzzyMatch: true,
    minConfidence: 0.7,
  },
  {
    id: 'nav-creative',
    phrases: [
      'aller à créatif',
      'sphère créative',
      'créativité',
      'go to creative',
    ],
    action: { type: 'NAVIGATE_TO', target: 'creative' },
    category: 'navigation',
    fuzzyMatch: true,
    minConfidence: 0.7,
  },
  {
    id: 'nav-personal',
    phrases: [
      'aller à personnel',
      'sphère personnelle',
      'go to personal',
    ],
    action: { type: 'NAVIGATE_TO', target: 'personal' },
    category: 'navigation',
    fuzzyMatch: true,
    minConfidence: 0.7,
  },
  {
    id: 'nav-scholar',
    phrases: [
      'aller à scholar',
      'sphère savante',
      'apprentissage',
      'go to scholar',
    ],
    action: { type: 'NAVIGATE_TO', target: 'scholar' },
    category: 'navigation',
    fuzzyMatch: true,
    minConfidence: 0.7,
  },
];

// ─────────────────────────────────────────────────────
// MEETING COMMANDS
// ─────────────────────────────────────────────────────

const MEETING_COMMANDS: VoiceCommand[] = [
  {
    id: 'meeting-start',
    phrases: [
      'commencer la réunion',
      'démarrer la réunion',
      'ouvrir une réunion',
      'start meeting',
      'begin meeting',
    ],
    action: { type: 'START_MEETING' },
    category: 'meeting',
    fuzzyMatch: true,
    minConfidence: 0.75,
    confirmationMessage: 'Réunion démarrée',
  },
  {
    id: 'meeting-end',
    phrases: [
      'terminer la réunion',
      'fermer la réunion',
      'fin de réunion',
      'end meeting',
      'close meeting',
    ],
    action: { type: 'END_MEETING' },
    category: 'meeting',
    fuzzyMatch: true,
    minConfidence: 0.75,
    confirmationMessage: 'Réunion terminée',
  },
];

// ─────────────────────────────────────────────────────
// AGENT COMMANDS
// ─────────────────────────────────────────────────────

const AGENT_COMMANDS: VoiceCommand[] = [
  {
    id: 'agent-ask-all',
    phrases: [
      'demander à tous',
      'poser une question à tous',
      'que pensez-vous',
      'ask everyone',
      'ask all agents',
    ],
    action: { type: 'ASK_ALL_AGENTS', question: '' }, // Question extracted from context
    category: 'agent',
    fuzzyMatch: true,
    minConfidence: 0.7,
    contextRequired: ['meeting'],
  },
  {
    id: 'agent-ask-analyzer',
    phrases: [
      'demander à l\'analyseur',
      'analyste',
      'ask analyzer',
    ],
    action: { type: 'ASK_AGENT', agentId: 'analyzer', question: '' },
    category: 'agent',
    fuzzyMatch: true,
    minConfidence: 0.7,
    contextRequired: ['meeting'],
  },
  {
    id: 'agent-ask-evaluator',
    phrases: [
      'demander à l\'évaluateur',
      'évaluateur',
      'ask evaluator',
    ],
    action: { type: 'ASK_AGENT', agentId: 'evaluator', question: '' },
    category: 'agent',
    fuzzyMatch: true,
    minConfidence: 0.7,
    contextRequired: ['meeting'],
  },
];

// ─────────────────────────────────────────────────────
// DECISION COMMANDS
// ─────────────────────────────────────────────────────

const DECISION_COMMANDS: VoiceCommand[] = [
  {
    id: 'decision-confirm',
    phrases: [
      'confirmer',
      'je confirme',
      'oui',
      'approuver',
      'confirm',
      'yes',
      'approve',
    ],
    action: { type: 'CONFIRM_DECISION' },
    category: 'decision',
    fuzzyMatch: false,
    minConfidence: 0.85,
    contextRequired: ['decision'],
    confirmationMessage: 'Décision confirmée',
  },
  {
    id: 'decision-cancel',
    phrases: [
      'annuler',
      'non',
      'refuser',
      'rejeter',
      'cancel',
      'no',
      'reject',
    ],
    action: { type: 'CANCEL_DECISION' },
    category: 'decision',
    fuzzyMatch: false,
    minConfidence: 0.85,
    contextRequired: ['decision'],
    confirmationMessage: 'Décision annulée',
  },
  {
    id: 'decision-option-1',
    phrases: [
      'option un',
      'option une',
      'premier choix',
      'première option',
      'option one',
      'first option',
    ],
    action: { type: 'MAKE_DECISION', optionId: '1' },
    category: 'decision',
    fuzzyMatch: true,
    minConfidence: 0.8,
    contextRequired: ['decision'],
  },
  {
    id: 'decision-option-2',
    phrases: [
      'option deux',
      'deuxième choix',
      'deuxième option',
      'option two',
      'second option',
    ],
    action: { type: 'MAKE_DECISION', optionId: '2' },
    category: 'decision',
    fuzzyMatch: true,
    minConfidence: 0.8,
    contextRequired: ['decision'],
  },
  {
    id: 'decision-option-3',
    phrases: [
      'option trois',
      'troisième choix',
      'troisième option',
      'option three',
      'third option',
    ],
    action: { type: 'MAKE_DECISION', optionId: '3' },
    category: 'decision',
    fuzzyMatch: true,
    minConfidence: 0.8,
    contextRequired: ['decision'],
  },
];

// ─────────────────────────────────────────────────────
// REPLAY COMMANDS
// ─────────────────────────────────────────────────────

const REPLAY_COMMANDS: VoiceCommand[] = [
  {
    id: 'replay-play',
    phrases: [
      'jouer',
      'lecture',
      'play',
      'continuer',
    ],
    action: { type: 'PLAY_REPLAY' },
    category: 'replay',
    fuzzyMatch: true,
    minConfidence: 0.7,
    contextRequired: ['replay'],
  },
  {
    id: 'replay-pause',
    phrases: [
      'pause',
      'arrêter',
      'stop',
    ],
    action: { type: 'PAUSE_REPLAY' },
    category: 'replay',
    fuzzyMatch: true,
    minConfidence: 0.7,
    contextRequired: ['replay'],
  },
  {
    id: 'replay-rewind',
    phrases: [
      'rembobiner',
      'revenir en arrière',
      'rewind',
    ],
    action: { type: 'REWIND_REPLAY' },
    category: 'replay',
    fuzzyMatch: true,
    minConfidence: 0.7,
    contextRequired: ['replay'],
  },
];

// ─────────────────────────────────────────────────────
// SYSTEM COMMANDS
// ─────────────────────────────────────────────────────

const SYSTEM_COMMANDS: VoiceCommand[] = [
  {
    id: 'system-mute',
    phrases: [
      'muet',
      'couper le son',
      'silence',
      'mute',
    ],
    action: { type: 'MUTE' },
    category: 'system',
    fuzzyMatch: true,
    minConfidence: 0.7,
  },
  {
    id: 'system-unmute',
    phrases: [
      'activer le son',
      'remettre le son',
      'unmute',
    ],
    action: { type: 'UNMUTE' },
    category: 'system',
    fuzzyMatch: true,
    minConfidence: 0.7,
  },
  {
    id: 'system-help',
    phrases: [
      'aide',
      'help',
      'qu\'est-ce que je peux dire',
      'commandes disponibles',
    ],
    action: { type: 'HELP' },
    category: 'system',
    fuzzyMatch: true,
    minConfidence: 0.6,
  },
];

// ─────────────────────────────────────────────────────
// COMMAND REGISTRY
// ─────────────────────────────────────────────────────

export const BUILTIN_COMMANDS: VoiceCommand[] = [
  ...NAVIGATION_COMMANDS,
  ...MEETING_COMMANDS,
  ...AGENT_COMMANDS,
  ...DECISION_COMMANDS,
  ...REPLAY_COMMANDS,
  ...SYSTEM_COMMANDS,
];

// ─────────────────────────────────────────────────────
// COMMAND MATCHING
// ─────────────────────────────────────────────────────

/**
 * Normalize text for matching (lowercase, remove accents, trim)
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Calculate similarity between two strings (Levenshtein-based)
 */
function calculateSimilarity(a: string, b: string): number {
  const aLen = a.length;
  const bLen = b.length;
  
  if (aLen === 0) return bLen === 0 ? 1 : 0;
  if (bLen === 0) return 0;
  
  const matrix: number[][] = [];
  
  for (let i = 0; i <= bLen; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= aLen; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= bLen; i++) {
    for (let j = 1; j <= aLen; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  const maxLen = Math.max(aLen, bLen);
  return 1 - matrix[bLen][aLen] / maxLen;
}

/**
 * Check if transcript contains phrase (with fuzzy matching)
 */
function matchPhrase(
  transcript: string,
  phrase: string,
  fuzzy: boolean
): { matched: boolean; similarity: number } {
  const normTranscript = normalizeText(transcript);
  const normPhrase = normalizeText(phrase);
  
  // Exact match
  if (normTranscript.includes(normPhrase)) {
    return { matched: true, similarity: 1.0 };
  }
  
  // Fuzzy match
  if (fuzzy) {
    const similarity = calculateSimilarity(normTranscript, normPhrase);
    if (similarity >= 0.75) {
      return { matched: true, similarity };
    }
    
    // Check if words are present
    const phraseWords = normPhrase.split(' ');
    const transcriptWords = normTranscript.split(' ');
    const matchedWords = phraseWords.filter(w => 
      transcriptWords.some(tw => calculateSimilarity(tw, w) >= 0.8)
    );
    
    if (matchedWords.length >= phraseWords.length * 0.7) {
      return { 
        matched: true, 
        similarity: matchedWords.length / phraseWords.length 
      };
    }
  }
  
  return { matched: false, similarity: 0 };
}

/**
 * Find matching command for transcript
 */
export function matchCommand(
  transcript: string,
  commands: VoiceCommand[] = BUILTIN_COMMANDS,
  context?: string[],
  confidence: number = 1.0
): VoiceCommandMatch | null {
  let bestMatch: VoiceCommandMatch | null = null;
  let bestScore = 0;
  
  for (const command of commands) {
    // Check context requirement
    if (command.contextRequired && command.contextRequired.length > 0) {
      if (!context || !command.contextRequired.some(c => context.includes(c))) {
        continue;
      }
    }
    
    // Check confidence threshold
    if (confidence < command.minConfidence) {
      continue;
    }
    
    // Try each phrase
    for (const phrase of command.phrases) {
      const { matched, similarity } = matchPhrase(
        transcript,
        phrase,
        command.fuzzyMatch
      );
      
      if (matched) {
        const score = similarity * confidence;
        
        if (score > bestScore) {
          bestScore = score;
          bestMatch = {
            command,
            transcript,
            confidence: score,
            matchedPhrase: phrase,
          };
        }
      }
    }
  }
  
  return bestMatch;
}

/**
 * Get commands by category
 */
export function getCommandsByCategory(
  category: VoiceCommandCategory
): VoiceCommand[] {
  return BUILTIN_COMMANDS.filter(c => c.category === category);
}

/**
 * Get all available command phrases for help
 */
export function getHelpPhrases(): { category: string; phrases: string[] }[] {
  const categories = new Map<string, string[]>();
  
  for (const command of BUILTIN_COMMANDS) {
    const existing = categories.get(command.category) || [];
    existing.push(command.phrases[0]); // First phrase is primary
    categories.set(command.category, existing);
  }
  
  return Array.from(categories.entries()).map(([category, phrases]) => ({
    category,
    phrases,
  }));
}

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default {
  BUILTIN_COMMANDS,
  matchCommand,
  getCommandsByCategory,
  getHelpPhrases,
};
