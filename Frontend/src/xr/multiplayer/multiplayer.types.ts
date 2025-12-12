/* =====================================================
   CHE·NU — XR Multiplayer Types
   
   Real-time multi-user synchronization for VR/AR.
   ===================================================== */

// ─────────────────────────────────────────────────────
// USER / PARTICIPANT
// ─────────────────────────────────────────────────────

export interface MultiplayerUser {
  id: string;
  name: string;
  avatar: UserAvatar;
  
  // Status
  status: UserStatus;
  isHost: boolean;
  joinedAt: number;
  lastSeen: number;
  
  // Position
  position: [number, number, number];
  rotation: [number, number, number, number];  // quaternion
  
  // Hand tracking
  leftHand?: HandPose;
  rightHand?: HandPose;
  
  // Voice
  isSpeaking: boolean;
  isMuted: boolean;
  audioLevel: number;
  
  // Metadata
  color: string;
  role?: string;
  permissions: UserPermissions;
}

export interface UserAvatar {
  type: 'default' | 'custom' | 'photo';
  url?: string;
  initials?: string;
  color: string;
  model?: string;
}

export type UserStatus = 
  | 'active'
  | 'idle'
  | 'away'
  | 'busy'
  | 'offline';

export interface HandPose {
  position: [number, number, number];
  rotation: [number, number, number, number];
  gesture?: string;
  isPointing: boolean;
  pointTarget?: [number, number, number];
}

export interface UserPermissions {
  canSpeak: boolean;
  canVote: boolean;
  canEdit: boolean;
  canInvite: boolean;
  canKick: boolean;
  canManageAgents: boolean;
}

// ─────────────────────────────────────────────────────
// ROOM
// ─────────────────────────────────────────────────────

export interface MultiplayerRoom {
  id: string;
  name: string;
  code: string;          // Short join code
  
  // State
  status: RoomStatus;
  createdAt: number;
  
  // Participants
  hostId: string;
  users: Map<string, MultiplayerUser>;
  maxUsers: number;
  
  // Settings
  settings: RoomSettings;
  
  // Context
  sphereId?: string;
  meetingId?: string;
}

export type RoomStatus = 
  | 'waiting'
  | 'active'
  | 'paused'
  | 'closed';

export interface RoomSettings {
  isPublic: boolean;
  requireApproval: boolean;
  allowVoice: boolean;
  allowVideo: boolean;
  allowHandTracking: boolean;
  syncCursors: boolean;
  syncNavigation: boolean;
  syncDecisions: boolean;
}

export const DEFAULT_ROOM_SETTINGS: RoomSettings = {
  isPublic: false,
  requireApproval: true,
  allowVoice: true,
  allowVideo: false,
  allowHandTracking: true,
  syncCursors: true,
  syncNavigation: true,
  syncDecisions: true,
};

// ─────────────────────────────────────────────────────
// SYNC MESSAGES
// ─────────────────────────────────────────────────────

export type SyncMessage =
  | { type: 'USER_JOIN'; user: MultiplayerUser }
  | { type: 'USER_LEAVE'; userId: string }
  | { type: 'USER_UPDATE'; userId: string; updates: Partial<MultiplayerUser> }
  | { type: 'POSITION_UPDATE'; userId: string; position: [number, number, number]; rotation: [number, number, number, number] }
  | { type: 'HAND_UPDATE'; userId: string; hand: 'left' | 'right'; pose: HandPose }
  | { type: 'VOICE_STATE'; userId: string; isSpeaking: boolean; audioLevel: number }
  | { type: 'CURSOR_MOVE'; userId: string; position: [number, number, number]; target?: string }
  | { type: 'NAVIGATE'; userId: string; sphereId: string }
  | { type: 'MEETING_ACTION'; userId: string; action: string; payload?: unknown }
  | { type: 'DECISION_VOTE'; userId: string; decisionId: string; optionId: string }
  | { type: 'REACTION'; userId: string; emoji: string; position: [number, number, number] }
  | { type: 'CHAT'; userId: string; message: string }
  | { type: 'ROOM_UPDATE'; updates: Partial<MultiplayerRoom> }
  | { type: 'PING' }
  | { type: 'PONG'; latency: number };

// ─────────────────────────────────────────────────────
// CONNECTION
// ─────────────────────────────────────────────────────

export type ConnectionStatus =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'error';

export interface ConnectionState {
  status: ConnectionStatus;
  roomId?: string;
  userId?: string;
  latency: number;
  lastPing: number;
  error?: string;
}

export const DEFAULT_CONNECTION_STATE: ConnectionState = {
  status: 'disconnected',
  latency: 0,
  lastPing: 0,
};

// ─────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────

export interface MultiplayerConfig {
  serverUrl: string;
  
  // Updates
  positionUpdateRate: number;     // ms
  handUpdateRate: number;         // ms
  voiceUpdateRate: number;        // ms
  
  // Interpolation
  interpolationDelay: number;     // ms
  
  // Reconnection
  reconnectAttempts: number;
  reconnectDelay: number;         // ms
  
  // Voice
  voiceEnabled: boolean;
  voiceCodec: 'opus' | 'pcm';
  
  // Debug
  showLatency: boolean;
  showUserBounds: boolean;
}

export const DEFAULT_MULTIPLAYER_CONFIG: MultiplayerConfig = {
  serverUrl: 'wss://chenu.io/multiplayer',
  positionUpdateRate: 50,
  handUpdateRate: 33,
  voiceUpdateRate: 20,
  interpolationDelay: 100,
  reconnectAttempts: 5,
  reconnectDelay: 2000,
  voiceEnabled: true,
  voiceCodec: 'opus',
  showLatency: false,
  showUserBounds: false,
};

// ─────────────────────────────────────────────────────
// EVENTS
// ─────────────────────────────────────────────────────

export interface MultiplayerEvents {
  onConnect: () => void;
  onDisconnect: (reason?: string) => void;
  onError: (error: Error) => void;
  onUserJoin: (user: MultiplayerUser) => void;
  onUserLeave: (userId: string) => void;
  onUserUpdate: (userId: string, updates: Partial<MultiplayerUser>) => void;
  onMessage: (message: SyncMessage) => void;
  onRoomUpdate: (room: Partial<MultiplayerRoom>) => void;
}

// ─────────────────────────────────────────────────────
// COLORS FOR USERS
// ─────────────────────────────────────────────────────

export const USER_COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#14b8a6', // teal
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#6366f1', // indigo
  '#06b6d4', // cyan
];

export function getUserColor(index: number): string {
  return USER_COLORS[index % USER_COLORS.length];
}

// ─────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────

export function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function createDefaultUser(id: string, name: string, index: number): MultiplayerUser {
  return {
    id,
    name,
    avatar: {
      type: 'default',
      initials: name.slice(0, 2).toUpperCase(),
      color: getUserColor(index),
    },
    status: 'active',
    isHost: false,
    joinedAt: Date.now(),
    lastSeen: Date.now(),
    position: [0, 1.6, 0],
    rotation: [0, 0, 0, 1],
    isSpeaking: false,
    isMuted: false,
    audioLevel: 0,
    color: getUserColor(index),
    permissions: {
      canSpeak: true,
      canVote: true,
      canEdit: false,
      canInvite: false,
      canKick: false,
      canManageAgents: false,
    },
  };
}
