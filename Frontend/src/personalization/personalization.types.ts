/* =====================================================
   CHE·NU — Personalization Types
   
   User preferences and customization settings.
   Persisted across sessions.
   ===================================================== */

// ─────────────────────────────────────────────────────
// DENSITY
// ─────────────────────────────────────────────────────

export type DensityLevel = "minimal" | "balanced" | "rich";

export const DENSITY_DESCRIPTIONS: Record<DensityLevel, string> = {
  minimal: "Interface épurée, informations essentielles",
  balanced: "Équilibre entre simplicité et détails",
  rich: "Informations détaillées, fonctionnalités avancées",
};

// ─────────────────────────────────────────────────────
// SPHERE PERSONALIZATION
// ─────────────────────────────────────────────────────

export interface SpherePersonalization {
  sphereId: string;
  visible: boolean;
  pinned: boolean;
  collapsed: boolean;
  sortOrder: number;
  themeOverride?: string;
  customName?: string;
  customIcon?: string;
  customColor?: string;
  notificationsEnabled: boolean;
  lastVisited?: number;
  visitCount: number;
}

export const DEFAULT_SPHERE_PERSONALIZATION: Omit<SpherePersonalization, 'sphereId'> = {
  visible: true,
  pinned: false,
  collapsed: false,
  sortOrder: 0,
  notificationsEnabled: true,
  visitCount: 0,
};

// ─────────────────────────────────────────────────────
// AGENT PERSONALIZATION
// ─────────────────────────────────────────────────────

export type AgentAvatarStyle = "glyph" | "abstract" | "semi-human" | "minimal";

export interface AgentPersonalization {
  agentId: string;
  visible: boolean;
  favorite: boolean;
  avatarStyle: AgentAvatarStyle;
  customName?: string;
  customColor?: string;
  voiceEnabled: boolean;
  voiceId?: string;
  responseStyle: "concise" | "detailed" | "balanced";
  lastInteraction?: number;
  interactionCount: number;
  trustLevel: number;  // 0-100, affects how much weight user gives to recommendations
}

export const DEFAULT_AGENT_PERSONALIZATION: Omit<AgentPersonalization, 'agentId'> = {
  visible: true,
  favorite: false,
  avatarStyle: "abstract",
  voiceEnabled: true,
  responseStyle: "balanced",
  interactionCount: 0,
  trustLevel: 50,
};

// ─────────────────────────────────────────────────────
// XR PERSONALIZATION
// ─────────────────────────────────────────────────────

export type XRAmbiance = "calm" | "focused" | "cosmic" | "nature" | "minimal";

export interface XRPersonalization {
  enabled: boolean;
  ambiance: XRAmbiance;
  
  // Visual
  showHands: boolean;
  showAvatars: boolean;
  particleEffects: boolean;
  bloomEffect: boolean;
  
  // Interaction
  gesturesEnabled: boolean;
  voiceEnabled: boolean;
  hapticFeedback: boolean;
  
  // Comfort
  teleportOnly: boolean;  // No smooth locomotion
  snapTurning: boolean;
  vignetteOnMove: boolean;
  sitScale: number;       // 0.5-1.5, adjust for sitting/standing
  
  // Performance
  qualityLevel: "low" | "medium" | "high" | "ultra";
}

export const DEFAULT_XR_PERSONALIZATION: XRPersonalization = {
  enabled: false,
  ambiance: "calm",
  showHands: true,
  showAvatars: true,
  particleEffects: true,
  bloomEffect: true,
  gesturesEnabled: true,
  voiceEnabled: true,
  hapticFeedback: true,
  teleportOnly: false,
  snapTurning: false,
  vignetteOnMove: true,
  sitScale: 1.0,
  qualityLevel: "medium",
};

// ─────────────────────────────────────────────────────
// UI PERSONALIZATION
// ─────────────────────────────────────────────────────

export interface UIPersonalization {
  // Layout
  sidebarPosition: "left" | "right" | "hidden";
  sidebarCollapsed: boolean;
  compactMode: boolean;
  
  // Typography
  fontSize: "small" | "medium" | "large";
  fontFamily: "system" | "inter" | "roboto" | "mono";
  
  // Animations
  reducedMotion: boolean;
  transitionSpeed: "slow" | "normal" | "fast" | "instant";
  
  // Accessibility
  highContrast: boolean;
  screenReaderOptimized: boolean;
  
  // Navigation
  rememberLastLocation: boolean;
  showBreadcrumbs: boolean;
  showMinimap: boolean;
}

export const DEFAULT_UI_PERSONALIZATION: UIPersonalization = {
  sidebarPosition: "left",
  sidebarCollapsed: false,
  compactMode: false,
  fontSize: "medium",
  fontFamily: "system",
  reducedMotion: false,
  transitionSpeed: "normal",
  highContrast: false,
  screenReaderOptimized: false,
  rememberLastLocation: true,
  showBreadcrumbs: true,
  showMinimap: false,
};

// ─────────────────────────────────────────────────────
// NOTIFICATION PERSONALIZATION
// ─────────────────────────────────────────────────────

export interface NotificationPersonalization {
  enabled: boolean;
  sound: boolean;
  vibration: boolean;
  
  // Types
  agentRecommendations: boolean;
  meetingReminders: boolean;
  decisionDeadlines: boolean;
  systemUpdates: boolean;
  
  // Quiet hours
  quietHoursEnabled: boolean;
  quietHoursStart: string;  // "22:00"
  quietHoursEnd: string;    // "08:00"
  
  // Urgency
  urgentOnly: boolean;
}

export const DEFAULT_NOTIFICATION_PERSONALIZATION: NotificationPersonalization = {
  enabled: true,
  sound: true,
  vibration: true,
  agentRecommendations: true,
  meetingReminders: true,
  decisionDeadlines: true,
  systemUpdates: false,
  quietHoursEnabled: false,
  quietHoursStart: "22:00",
  quietHoursEnd: "08:00",
  urgentOnly: false,
};

// ─────────────────────────────────────────────────────
// KEYBOARD SHORTCUTS
// ─────────────────────────────────────────────────────

export interface KeyboardShortcut {
  action: string;
  keys: string;  // "ctrl+shift+p"
  enabled: boolean;
}

export const DEFAULT_SHORTCUTS: KeyboardShortcut[] = [
  { action: "search", keys: "ctrl+k", enabled: true },
  { action: "home", keys: "ctrl+h", enabled: true },
  { action: "back", keys: "alt+left", enabled: true },
  { action: "forward", keys: "alt+right", enabled: true },
  { action: "meeting", keys: "ctrl+m", enabled: true },
  { action: "agents", keys: "ctrl+a", enabled: true },
  { action: "settings", keys: "ctrl+,", enabled: true },
  { action: "fullscreen", keys: "f11", enabled: true },
  { action: "xr_toggle", keys: "ctrl+shift+x", enabled: true },
];

// ─────────────────────────────────────────────────────
// MAIN PERSONALIZATION TYPE
// ─────────────────────────────────────────────────────

export interface CheNuPersonalization {
  version: number;
  
  // Global
  themeGlobal: string;
  density: DensityLevel;
  language: string;
  
  // Collections
  spheres: SpherePersonalization[];
  agents: AgentPersonalization[];
  
  // Modules
  xr: XRPersonalization;
  ui: UIPersonalization;
  notifications: NotificationPersonalization;
  shortcuts: KeyboardShortcut[];
  
  // Metadata
  createdAt: number;
  updatedAt: number;
  lastSyncedAt?: number;
}

// ─────────────────────────────────────────────────────
// EVENTS
// ─────────────────────────────────────────────────────

export type PersonalizationEvent =
  | { type: 'THEME_CHANGE'; themeId: string }
  | { type: 'DENSITY_CHANGE'; density: DensityLevel }
  | { type: 'SPHERE_UPDATE'; sphereId: string; updates: Partial<SpherePersonalization> }
  | { type: 'AGENT_UPDATE'; agentId: string; updates: Partial<AgentPersonalization> }
  | { type: 'XR_UPDATE'; updates: Partial<XRPersonalization> }
  | { type: 'UI_UPDATE'; updates: Partial<UIPersonalization> }
  | { type: 'NOTIFICATION_UPDATE'; updates: Partial<NotificationPersonalization> }
  | { type: 'SHORTCUT_UPDATE'; action: string; keys: string }
  | { type: 'RESET'; section?: string }
  | { type: 'IMPORT'; data: CheNuPersonalization }
  | { type: 'SYNC'; timestamp: number };

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default {
  DENSITY_DESCRIPTIONS,
  DEFAULT_SPHERE_PERSONALIZATION,
  DEFAULT_AGENT_PERSONALIZATION,
  DEFAULT_XR_PERSONALIZATION,
  DEFAULT_UI_PERSONALIZATION,
  DEFAULT_NOTIFICATION_PERSONALIZATION,
  DEFAULT_SHORTCUTS,
};
