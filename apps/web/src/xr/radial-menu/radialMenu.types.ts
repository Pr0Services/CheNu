/* =====================================================
   CHE·NU — XR Radial Menu Types
   
   Circular menu system for VR/AR interactions.
   ===================================================== */

// ─────────────────────────────────────────────────────
// MENU ITEM
// ─────────────────────────────────────────────────────

export interface RadialMenuItem {
  id: string;
  label: string;
  icon: string;
  
  // Appearance
  color?: string;
  backgroundColor?: string;
  
  // State
  disabled?: boolean;
  selected?: boolean;
  hidden?: boolean;
  
  // Action
  action?: () => void;
  
  // Sub-menu
  children?: RadialMenuItem[];
  
  // Keyboard shortcut
  shortcut?: string;
  
  // Metadata
  tooltip?: string;
  badge?: string | number;
}

// ─────────────────────────────────────────────────────
// MENU CONFIGURATION
// ─────────────────────────────────────────────────────

export interface RadialMenuConfig {
  // Size
  innerRadius: number;
  outerRadius: number;
  thickness: number;
  
  // Layout
  startAngle: number;       // degrees, 0 = right
  sweepAngle: number;       // degrees, 360 = full circle
  gapAngle: number;         // degrees between items
  
  // Animation
  animationDuration: number;
  easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
  
  // Appearance
  backgroundColor: string;
  hoverColor: string;
  selectedColor: string;
  disabledColor: string;
  textColor: string;
  iconSize: number;
  fontSize: number;
  
  // Behavior
  closeOnSelect: boolean;
  showLabels: boolean;
  showCenter: boolean;
  centerIcon?: string;
  centerLabel?: string;
  
  // Haptic
  hapticOnHover: boolean;
  hapticOnSelect: boolean;
  hapticIntensity: number;
  
  // Sound
  soundOnHover: boolean;
  soundOnSelect: boolean;
}

export const DEFAULT_RADIAL_CONFIG: RadialMenuConfig = {
  innerRadius: 0.15,
  outerRadius: 0.35,
  thickness: 0.02,
  startAngle: -90,
  sweepAngle: 360,
  gapAngle: 2,
  animationDuration: 200,
  easing: 'ease-out',
  backgroundColor: 'rgba(30, 30, 40, 0.9)',
  hoverColor: 'rgba(99, 102, 241, 0.9)',
  selectedColor: 'rgba(139, 92, 246, 0.9)',
  disabledColor: 'rgba(75, 75, 85, 0.5)',
  textColor: '#ffffff',
  iconSize: 28,
  fontSize: 11,
  closeOnSelect: true,
  showLabels: true,
  showCenter: true,
  centerIcon: '✕',
  centerLabel: 'Fermer',
  hapticOnHover: true,
  hapticOnSelect: true,
  hapticIntensity: 0.3,
  soundOnHover: true,
  soundOnSelect: true,
};

// ─────────────────────────────────────────────────────
// MENU STATE
// ─────────────────────────────────────────────────────

export interface RadialMenuState {
  isOpen: boolean;
  position: [number, number, number];
  items: RadialMenuItem[];
  
  // Navigation
  hoveredIndex: number | null;
  selectedIndex: number | null;
  activeSubmenu: string | null;
  
  // History for back navigation
  menuStack: { items: RadialMenuItem[]; title?: string }[];
  
  // Input
  inputAngle: number | null;
  inputDistance: number | null;
}

export const DEFAULT_RADIAL_STATE: RadialMenuState = {
  isOpen: false,
  position: [0, 1.2, -0.5],
  items: [],
  hoveredIndex: null,
  selectedIndex: null,
  activeSubmenu: null,
  menuStack: [],
  inputAngle: null,
  inputDistance: null,
};

// ─────────────────────────────────────────────────────
// MENU EVENTS
// ─────────────────────────────────────────────────────

export type RadialMenuEvent =
  | { type: 'OPEN'; position?: [number, number, number]; items?: RadialMenuItem[] }
  | { type: 'CLOSE' }
  | { type: 'TOGGLE' }
  | { type: 'HOVER'; index: number | null }
  | { type: 'SELECT'; index: number }
  | { type: 'ENTER_SUBMENU'; itemId: string }
  | { type: 'EXIT_SUBMENU' }
  | { type: 'UPDATE_INPUT'; angle: number; distance: number };

// ─────────────────────────────────────────────────────
// PRESETS
// ─────────────────────────────────────────────────────

export interface RadialMenuPreset {
  id: string;
  name: string;
  items: RadialMenuItem[];
  config?: Partial<RadialMenuConfig>;
}

export const NAVIGATION_PRESET: RadialMenuPreset = {
  id: 'navigation',
  name: 'Navigation',
  items: [
    { id: 'home', label: 'Accueil', icon: '🏠' },
    { id: 'back', label: 'Retour', icon: '⬅️' },
    { id: 'forward', label: 'Suivant', icon: '➡️' },
    { id: 'up', label: 'Monter', icon: '⬆️' },
    { id: 'search', label: 'Rechercher', icon: '🔍' },
    { id: 'settings', label: 'Paramètres', icon: '⚙️' },
  ],
};

export const MEETING_PRESET: RadialMenuPreset = {
  id: 'meeting',
  name: 'Réunion',
  items: [
    { id: 'ask', label: 'Demander', icon: '❓' },
    { id: 'vote', label: 'Voter', icon: '🗳️' },
    { id: 'approve', label: 'Approuver', icon: '✅' },
    { id: 'reject', label: 'Rejeter', icon: '❌' },
    { id: 'defer', label: 'Reporter', icon: '⏳' },
    { id: 'agents', label: 'Agents', icon: '🤖' },
    { id: 'timeline', label: 'Timeline', icon: '📊' },
    { id: 'end', label: 'Terminer', icon: '🏁' },
  ],
};

export const AGENT_PRESET: RadialMenuPreset = {
  id: 'agent',
  name: 'Agent',
  items: [
    { id: 'ask', label: 'Demander', icon: '💬' },
    { id: 'details', label: 'Détails', icon: 'ℹ️' },
    { id: 'history', label: 'Historique', icon: '📜' },
    { id: 'invite', label: 'Inviter', icon: '➕' },
    { id: 'dismiss', label: 'Renvoyer', icon: '👋' },
  ],
};

export const REPLAY_PRESET: RadialMenuPreset = {
  id: 'replay',
  name: 'Replay',
  items: [
    { id: 'play', label: 'Lecture', icon: '▶️' },
    { id: 'pause', label: 'Pause', icon: '⏸️' },
    { id: 'rewind', label: 'Rembobiner', icon: '⏪' },
    { id: 'forward', label: 'Avancer', icon: '⏩' },
    { id: 'speed', label: 'Vitesse', icon: '⚡' },
    { id: 'bookmark', label: 'Signet', icon: '🔖' },
  ],
};

// ─────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────

/**
 * Calculate item angle bounds based on index and total items.
 */
export function calculateItemAngles(
  index: number,
  totalItems: number,
  config: RadialMenuConfig
): { startAngle: number; endAngle: number; centerAngle: number } {
  const availableSweep = config.sweepAngle - (totalItems * config.gapAngle);
  const itemSweep = availableSweep / totalItems;
  
  const startAngle = config.startAngle + (index * (itemSweep + config.gapAngle));
  const endAngle = startAngle + itemSweep;
  const centerAngle = (startAngle + endAngle) / 2;

  return { startAngle, endAngle, centerAngle };
}

/**
 * Find which item is at a given angle.
 */
export function findItemAtAngle(
  angle: number,
  totalItems: number,
  config: RadialMenuConfig
): number | null {
  for (let i = 0; i < totalItems; i++) {
    const { startAngle, endAngle } = calculateItemAngles(i, totalItems, config);
    
    // Normalize angles
    let normalizedAngle = angle;
    let normalizedStart = startAngle;
    let normalizedEnd = endAngle;

    // Handle wrap-around
    if (normalizedEnd < normalizedStart) {
      if (normalizedAngle < normalizedStart) normalizedAngle += 360;
      normalizedEnd += 360;
    }

    if (normalizedAngle >= normalizedStart && normalizedAngle <= normalizedEnd) {
      return i;
    }
  }

  return null;
}

/**
 * Convert controller position to angle and distance.
 */
export function positionToAngleDistance(
  position: [number, number, number],
  menuCenter: [number, number, number]
): { angle: number; distance: number } {
  const dx = position[0] - menuCenter[0];
  const dy = position[1] - menuCenter[1];
  
  const distance = Math.sqrt(dx * dx + dy * dy);
  let angle = Math.atan2(dy, dx) * (180 / Math.PI);
  
  // Normalize to 0-360
  if (angle < 0) angle += 360;

  return { angle, distance };
}

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default {
  DEFAULT_RADIAL_CONFIG,
  DEFAULT_RADIAL_STATE,
  NAVIGATION_PRESET,
  MEETING_PRESET,
  AGENT_PRESET,
  REPLAY_PRESET,
};
