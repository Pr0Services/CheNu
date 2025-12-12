/* =====================================================
   CHE·NU — XR Notification Types
   
   Spatial 3D notifications for VR/AR environment.
   ===================================================== */

// ─────────────────────────────────────────────────────
// NOTIFICATION TYPES
// ─────────────────────────────────────────────────────

export type NotificationType =
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'agent'
  | 'decision'
  | 'meeting'
  | 'system';

export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

export type NotificationPosition =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'center'
  | 'floating'
  | 'follow'      // Follows user gaze
  | 'wrist'       // On wrist (VR)
  | 'spatial';    // Fixed in 3D space

// ─────────────────────────────────────────────────────
// NOTIFICATION
// ─────────────────────────────────────────────────────

export interface XRNotification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  
  // Content
  title: string;
  message?: string;
  icon?: string;
  
  // Timing
  createdAt: number;
  duration: number;         // ms, 0 = persistent
  expiresAt?: number;
  
  // Display
  position: NotificationPosition;
  spatialPosition?: [number, number, number];
  
  // Interaction
  dismissible: boolean;
  actions?: NotificationAction[];
  
  // State
  isRead: boolean;
  isDismissed: boolean;
  
  // Animation
  animationIn?: NotificationAnimation;
  animationOut?: NotificationAnimation;
  
  // Sound
  sound?: NotificationSound;
  haptic?: HapticFeedback;
  
  // Metadata
  source?: string;
  data?: unknown;
}

export interface NotificationAction {
  id: string;
  label: string;
  icon?: string;
  variant: 'primary' | 'secondary' | 'danger';
  action: () => void;
}

export type NotificationAnimation =
  | 'fade'
  | 'slide'
  | 'scale'
  | 'pop'
  | 'float'
  | 'none';

export type NotificationSound =
  | 'default'
  | 'success'
  | 'error'
  | 'warning'
  | 'message'
  | 'alert'
  | 'chime'
  | 'none';

export interface HapticFeedback {
  enabled: boolean;
  intensity: number;       // 0-1
  duration: number;        // ms
  pattern?: number[];      // Vibration pattern
}

// ─────────────────────────────────────────────────────
// NOTIFICATION QUEUE
// ─────────────────────────────────────────────────────

export interface NotificationQueue {
  notifications: XRNotification[];
  maxVisible: number;
  maxHistory: number;
  history: XRNotification[];
}

export const DEFAULT_QUEUE: NotificationQueue = {
  notifications: [],
  maxVisible: 5,
  maxHistory: 50,
  history: [],
};

// ─────────────────────────────────────────────────────
// NOTIFICATION CONFIG
// ─────────────────────────────────────────────────────

export interface NotificationConfig {
  enabled: boolean;
  
  // Defaults
  defaultPosition: NotificationPosition;
  defaultDuration: number;
  defaultPriority: NotificationPriority;
  
  // Display
  maxVisible: number;
  stackDirection: 'up' | 'down';
  spacing: number;
  
  // Animation
  animationDuration: number;
  defaultAnimationIn: NotificationAnimation;
  defaultAnimationOut: NotificationAnimation;
  
  // Sound
  soundEnabled: boolean;
  soundVolume: number;
  
  // Haptic
  hapticEnabled: boolean;
  hapticIntensity: number;
  
  // Behavior
  pauseOnHover: boolean;
  groupSimilar: boolean;
  persistUrgent: boolean;
  
  // Do Not Disturb
  dndEnabled: boolean;
  dndAllowUrgent: boolean;
}

export const DEFAULT_NOTIFICATION_CONFIG: NotificationConfig = {
  enabled: true,
  defaultPosition: 'top',
  defaultDuration: 5000,
  defaultPriority: 'normal',
  maxVisible: 5,
  stackDirection: 'down',
  spacing: 0.15,
  animationDuration: 300,
  defaultAnimationIn: 'slide',
  defaultAnimationOut: 'fade',
  soundEnabled: true,
  soundVolume: 0.5,
  hapticEnabled: true,
  hapticIntensity: 0.5,
  pauseOnHover: true,
  groupSimilar: true,
  persistUrgent: true,
  dndEnabled: false,
  dndAllowUrgent: true,
};

// ─────────────────────────────────────────────────────
// THEME
// ─────────────────────────────────────────────────────

export interface NotificationTheme {
  colors: Record<NotificationType, {
    background: string;
    border: string;
    text: string;
    icon: string;
  }>;
  
  borderRadius: number;
  padding: number;
  fontSize: number;
  iconSize: number;
  
  backdrop: boolean;
  backdropBlur: number;
  shadow: boolean;
}

export const DEFAULT_NOTIFICATION_THEME: NotificationTheme = {
  colors: {
    info: {
      background: 'rgba(59, 130, 246, 0.9)',
      border: '#3b82f6',
      text: '#ffffff',
      icon: '#93c5fd',
    },
    success: {
      background: 'rgba(16, 185, 129, 0.9)',
      border: '#10b981',
      text: '#ffffff',
      icon: '#6ee7b7',
    },
    warning: {
      background: 'rgba(245, 158, 11, 0.9)',
      border: '#f59e0b',
      text: '#ffffff',
      icon: '#fcd34d',
    },
    error: {
      background: 'rgba(239, 68, 68, 0.9)',
      border: '#ef4444',
      text: '#ffffff',
      icon: '#fca5a5',
    },
    agent: {
      background: 'rgba(139, 92, 246, 0.9)',
      border: '#8b5cf6',
      text: '#ffffff',
      icon: '#c4b5fd',
    },
    decision: {
      background: 'rgba(251, 191, 36, 0.9)',
      border: '#fbbf24',
      text: '#1f2937',
      icon: '#fef3c7',
    },
    meeting: {
      background: 'rgba(99, 102, 241, 0.9)',
      border: '#6366f1',
      text: '#ffffff',
      icon: '#a5b4fc',
    },
    system: {
      background: 'rgba(107, 114, 128, 0.9)',
      border: '#6b7280',
      text: '#ffffff',
      icon: '#d1d5db',
    },
  },
  borderRadius: 12,
  padding: 16,
  fontSize: 14,
  iconSize: 24,
  backdrop: true,
  backdropBlur: 10,
  shadow: true,
};

// ─────────────────────────────────────────────────────
// NOTIFICATION ICONS
// ─────────────────────────────────────────────────────

export const NOTIFICATION_ICONS: Record<NotificationType, string> = {
  info: 'ℹ️',
  success: '✅',
  warning: '⚠️',
  error: '❌',
  agent: '🤖',
  decision: '📋',
  meeting: '👥',
  system: '⚙️',
};

// ─────────────────────────────────────────────────────
// HELPER: Create notification
// ─────────────────────────────────────────────────────

export function createNotification(
  params: Partial<XRNotification> & { title: string }
): XRNotification {
  const now = Date.now();
  
  return {
    id: `notif-${now}-${Math.random().toString(36).substr(2, 9)}`,
    type: params.type || 'info',
    priority: params.priority || 'normal',
    title: params.title,
    message: params.message,
    icon: params.icon || NOTIFICATION_ICONS[params.type || 'info'],
    createdAt: now,
    duration: params.duration ?? 5000,
    expiresAt: params.duration ? now + params.duration : undefined,
    position: params.position || 'top',
    spatialPosition: params.spatialPosition,
    dismissible: params.dismissible ?? true,
    actions: params.actions,
    isRead: false,
    isDismissed: false,
    animationIn: params.animationIn || 'slide',
    animationOut: params.animationOut || 'fade',
    sound: params.sound,
    haptic: params.haptic,
    source: params.source,
    data: params.data,
  };
}

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default {
  DEFAULT_QUEUE,
  DEFAULT_NOTIFICATION_CONFIG,
  DEFAULT_NOTIFICATION_THEME,
  NOTIFICATION_ICONS,
  createNotification,
};
