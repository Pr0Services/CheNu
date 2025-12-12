/* =====================================================
   CHE·NU — useMultiplayer Hook
   
   React hook for multiplayer room management.
   ===================================================== */

import { useState, useCallback, useEffect, useRef } from 'react';

import {
  MultiplayerUser,
  MultiplayerRoom,
  RoomSettings,
  SyncMessage,
  ConnectionState,
  ConnectionStatus,
  MultiplayerConfig,
  MultiplayerEvents,
  DEFAULT_CONNECTION_STATE,
  DEFAULT_MULTIPLAYER_CONFIG,
  DEFAULT_ROOM_SETTINGS,
  createDefaultUser,
  generateRoomCode,
  getUserColor,
} from './multiplayer.types';

// ─────────────────────────────────────────────────────
// HOOK OPTIONS
// ─────────────────────────────────────────────────────

export interface UseMultiplayerOptions {
  config?: Partial<MultiplayerConfig>;
  events?: Partial<MultiplayerEvents>;
  autoConnect?: boolean;
}

// ─────────────────────────────────────────────────────
// HOOK RETURN
// ─────────────────────────────────────────────────────

export interface UseMultiplayerReturn {
  // State
  connection: ConnectionState;
  room: MultiplayerRoom | null;
  users: MultiplayerUser[];
  localUser: MultiplayerUser | null;
  
  // Room management
  createRoom: (name: string, settings?: Partial<RoomSettings>) => Promise<string>;
  joinRoom: (codeOrId: string, userName: string) => Promise<void>;
  leaveRoom: () => void;
  
  // User actions
  updatePosition: (position: [number, number, number], rotation: [number, number, number, number]) => void;
  updateHand: (hand: 'left' | 'right', pose: any) => void;
  setMuted: (muted: boolean) => void;
  sendReaction: (emoji: string) => void;
  sendChat: (message: string) => void;
  
  // Host actions
  kickUser: (userId: string) => void;
  updateSettings: (settings: Partial<RoomSettings>) => void;
  
  // Computed
  isConnected: boolean;
  isHost: boolean;
  userCount: number;
  latency: number;
}

// ─────────────────────────────────────────────────────
// MAIN HOOK
// ─────────────────────────────────────────────────────

export function useMultiplayer(
  options: UseMultiplayerOptions = {}
): UseMultiplayerReturn {
  const {
    config: configOverride,
    events,
    autoConnect = false,
  } = options;

  const config: MultiplayerConfig = {
    ...DEFAULT_MULTIPLAYER_CONFIG,
    ...configOverride,
  };

  // State
  const [connection, setConnection] = useState<ConnectionState>(DEFAULT_CONNECTION_STATE);
  const [room, setRoom] = useState<MultiplayerRoom | null>(null);
  const [localUser, setLocalUser] = useState<MultiplayerUser | null>(null);

  // Refs
  const wsRef = useRef<WebSocket | null>(null);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const updateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pendingPositionRef = useRef<{ position: [number, number, number]; rotation: [number, number, number, number] } | null>(null);

  // Connect to server
  const connect = useCallback(async () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    setConnection(prev => ({ ...prev, status: 'connecting' }));

    try {
      // In real implementation, connect to WebSocket
      // For now, simulate connection
      await new Promise(resolve => setTimeout(resolve, 500));

      setConnection(prev => ({
        ...prev,
        status: 'connected',
        latency: 50,
      }));

      events?.onConnect?.();

      // Start ping interval
      pingIntervalRef.current = setInterval(() => {
        sendMessage({ type: 'PING' });
      }, 5000);

    } catch (error) {
      setConnection(prev => ({
        ...prev,
        status: 'error',
        error: (error as Error).message,
      }));
      events?.onError?.(error as Error);
    }
  }, [config.serverUrl, events]);

  // Disconnect
  const disconnect = useCallback(() => {
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
    }
    if (updateIntervalRef.current) {
      clearInterval(updateIntervalRef.current);
    }

    wsRef.current?.close();
    wsRef.current = null;

    setConnection(DEFAULT_CONNECTION_STATE);
    setRoom(null);
    setLocalUser(null);

    events?.onDisconnect?.();
  }, [events]);

  // Send message
  const sendMessage = useCallback((message: SyncMessage) => {
    if (connection.status !== 'connected') return;

    // In real implementation, send via WebSocket
    console.log('[Multiplayer] Send:', message.type);

    // Simulate latency for local testing
    setTimeout(() => {
      handleMessage(message);
    }, config.interpolationDelay);
  }, [connection.status, config.interpolationDelay]);

  // Handle incoming message
  const handleMessage = useCallback((message: SyncMessage) => {
    events?.onMessage?.(message);

    switch (message.type) {
      case 'USER_JOIN':
        setRoom(prev => {
          if (!prev) return prev;
          const users = new Map(prev.users);
          users.set(message.user.id, message.user);
          return { ...prev, users };
        });
        events?.onUserJoin?.(message.user);
        break;

      case 'USER_LEAVE':
        setRoom(prev => {
          if (!prev) return prev;
          const users = new Map(prev.users);
          users.delete(message.userId);
          return { ...prev, users };
        });
        events?.onUserLeave?.(message.userId);
        break;

      case 'USER_UPDATE':
        setRoom(prev => {
          if (!prev) return prev;
          const users = new Map(prev.users);
          const user = users.get(message.userId);
          if (user) {
            users.set(message.userId, { ...user, ...message.updates });
          }
          return { ...prev, users };
        });
        events?.onUserUpdate?.(message.userId, message.updates);
        break;

      case 'POSITION_UPDATE':
        setRoom(prev => {
          if (!prev) return prev;
          const users = new Map(prev.users);
          const user = users.get(message.userId);
          if (user) {
            users.set(message.userId, {
              ...user,
              position: message.position,
              rotation: message.rotation,
            });
          }
          return { ...prev, users };
        });
        break;

      case 'PONG':
        setConnection(prev => ({
          ...prev,
          latency: message.latency,
          lastPing: Date.now(),
        }));
        break;

      case 'ROOM_UPDATE':
        setRoom(prev => prev ? { ...prev, ...message.updates } : prev);
        events?.onRoomUpdate?.(message.updates);
        break;
    }
  }, [events]);

  // Create room
  const createRoom = useCallback(async (
    name: string,
    settings?: Partial<RoomSettings>
  ): Promise<string> => {
    if (connection.status !== 'connected') {
      await connect();
    }

    const roomId = `room-${Date.now()}`;
    const code = generateRoomCode();
    const userId = `user-${Date.now()}`;

    const user = createDefaultUser(userId, 'Hôte', 0);
    user.isHost = true;
    user.permissions = {
      canSpeak: true,
      canVote: true,
      canEdit: true,
      canInvite: true,
      canKick: true,
      canManageAgents: true,
    };

    const newRoom: MultiplayerRoom = {
      id: roomId,
      name,
      code,
      status: 'waiting',
      createdAt: Date.now(),
      hostId: userId,
      users: new Map([[userId, user]]),
      maxUsers: 10,
      settings: { ...DEFAULT_ROOM_SETTINGS, ...settings },
    };

    setRoom(newRoom);
    setLocalUser(user);
    setConnection(prev => ({ ...prev, roomId, userId }));

    // Start position update interval
    startUpdateInterval();

    return code;
  }, [connection.status, connect]);

  // Join room
  const joinRoom = useCallback(async (
    codeOrId: string,
    userName: string
  ): Promise<void> => {
    if (connection.status !== 'connected') {
      await connect();
    }

    // In real implementation, send join request to server
    const userId = `user-${Date.now()}`;
    const userIndex = room ? room.users.size : 0;
    const user = createDefaultUser(userId, userName, userIndex);

    setLocalUser(user);
    setConnection(prev => ({ ...prev, userId }));

    // Simulate joining
    sendMessage({ type: 'USER_JOIN', user });

    startUpdateInterval();
  }, [connection.status, connect, room, sendMessage]);

  // Leave room
  const leaveRoom = useCallback(() => {
    if (localUser) {
      sendMessage({ type: 'USER_LEAVE', userId: localUser.id });
    }

    if (updateIntervalRef.current) {
      clearInterval(updateIntervalRef.current);
    }

    setRoom(null);
    setLocalUser(null);
    setConnection(prev => ({ ...prev, roomId: undefined, userId: undefined }));
  }, [localUser, sendMessage]);

  // Start position update interval
  const startUpdateInterval = useCallback(() => {
    if (updateIntervalRef.current) {
      clearInterval(updateIntervalRef.current);
    }

    updateIntervalRef.current = setInterval(() => {
      if (pendingPositionRef.current && localUser) {
        sendMessage({
          type: 'POSITION_UPDATE',
          userId: localUser.id,
          ...pendingPositionRef.current,
        });
        pendingPositionRef.current = null;
      }
    }, config.positionUpdateRate);
  }, [config.positionUpdateRate, localUser, sendMessage]);

  // Update position (batched)
  const updatePosition = useCallback((
    position: [number, number, number],
    rotation: [number, number, number, number]
  ) => {
    pendingPositionRef.current = { position, rotation };

    // Update local user immediately
    setLocalUser(prev => prev ? { ...prev, position, rotation } : prev);
  }, []);

  // Update hand
  const updateHand = useCallback((hand: 'left' | 'right', pose: any) => {
    if (!localUser) return;
    sendMessage({
      type: 'HAND_UPDATE',
      userId: localUser.id,
      hand,
      pose,
    });
  }, [localUser, sendMessage]);

  // Set muted
  const setMuted = useCallback((muted: boolean) => {
    setLocalUser(prev => prev ? { ...prev, isMuted: muted } : prev);
    if (localUser) {
      sendMessage({
        type: 'USER_UPDATE',
        userId: localUser.id,
        updates: { isMuted: muted },
      });
    }
  }, [localUser, sendMessage]);

  // Send reaction
  const sendReaction = useCallback((emoji: string) => {
    if (!localUser) return;
    sendMessage({
      type: 'REACTION',
      userId: localUser.id,
      emoji,
      position: localUser.position,
    });
  }, [localUser, sendMessage]);

  // Send chat
  const sendChat = useCallback((message: string) => {
    if (!localUser) return;
    sendMessage({
      type: 'CHAT',
      userId: localUser.id,
      message,
    });
  }, [localUser, sendMessage]);

  // Kick user (host only)
  const kickUser = useCallback((userId: string) => {
    if (!localUser?.isHost) return;
    sendMessage({ type: 'USER_LEAVE', userId });
  }, [localUser, sendMessage]);

  // Update settings (host only)
  const updateSettings = useCallback((settings: Partial<RoomSettings>) => {
    if (!localUser?.isHost || !room) return;
    sendMessage({
      type: 'ROOM_UPDATE',
      updates: { settings: { ...room.settings, ...settings } },
    });
  }, [localUser, room, sendMessage]);

  // Cleanup
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  // Auto-connect
  useEffect(() => {
    if (autoConnect) {
      connect();
    }
  }, [autoConnect, connect]);

  // Computed
  const users = room ? Array.from(room.users.values()) : [];
  const isConnected = connection.status === 'connected';
  const isHost = localUser?.isHost ?? false;

  return {
    connection,
    room,
    users,
    localUser,
    createRoom,
    joinRoom,
    leaveRoom,
    updatePosition,
    updateHand,
    setMuted,
    sendReaction,
    sendChat,
    kickUser,
    updateSettings,
    isConnected,
    isHost,
    userCount: users.length,
    latency: connection.latency,
  };
}

export default useMultiplayer;
