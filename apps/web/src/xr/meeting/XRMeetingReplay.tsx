/* =====================================================
   CHE·NU — XR Meeting Replay
   
   Replay past meetings in VR/AR with full controls:
   - Play/Pause
   - Step forward/back
   - Speed control (0.25x to 8x)
   - Jump to markers
   - Timeline scrubbing
   
   Perfect for audit, review, and learning.
   ===================================================== */

import React, { useState, useEffect, useCallback, useMemo, useReducer } from 'react';
import { Html } from '@react-three/drei';

import { XRMeetingRoom } from './XRMeetingRoom';
import { XRMeetingContext, XRMeetingAgent } from './xrMeeting.types';
import {
  TimelineXREvent,
  XRReplayState,
  XRReplaySnapshot,
  ReplayAction,
  ReplaySpeed,
  ReplayMode,
  ReplayMarker,
  DEFAULT_REPLAY_STATE,
} from './xrReplay.types';
import {
  buildXRMeetingSnapshotFromEvents,
  buildAgentStatesAtIndex,
  generateAutoMarkers,
  calculateEventsDuration,
  calculateDurationToIndex,
  findEventIndex,
} from './buildReplaySnapshot';

// ─────────────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────────────

export interface XRMeetingReplayProps {
  baseContext: XRMeetingContext;
  baseAgents: XRMeetingAgent[];
  events: TimelineXREvent[];
  
  // Options
  autoPlay?: boolean;
  initialSpeed?: ReplaySpeed;
  showHUD?: boolean;
  showMarkers?: boolean;
  hudPosition?: 'bottom' | 'top' | 'floating';
  
  // Callbacks
  onEventChange?: (event: TimelineXREvent, index: number) => void;
  onReplayEnd?: () => void;
  onBookmark?: (index: number) => void;
}

// ─────────────────────────────────────────────────────
// REPLAY REDUCER
// ─────────────────────────────────────────────────────

function replayReducer(
  state: XRReplayState,
  action: ReplayAction
): XRReplayState {
  switch (action.type) {
    case 'PLAY':
      return { ...state, isPlaying: true };
      
    case 'PAUSE':
      return { ...state, isPlaying: false };
      
    case 'TOGGLE_PLAY':
      return { ...state, isPlaying: !state.isPlaying };
      
    case 'STEP_FORWARD':
      return {
        ...state,
        isPlaying: false,
        currentIndex: Math.min(
          state.currentIndex + 1,
          state.endIndex >= 0 ? state.endIndex : Infinity
        ),
      };
      
    case 'STEP_BACK':
      return {
        ...state,
        isPlaying: false,
        currentIndex: Math.max(state.currentIndex - 1, state.startIndex),
      };
      
    case 'JUMP_TO':
      return {
        ...state,
        currentIndex: Math.max(
          state.startIndex,
          Math.min(action.index, state.endIndex >= 0 ? state.endIndex : action.index)
        ),
      };
      
    case 'JUMP_TO_EVENT':
      // This needs events array, handle in component
      return state;
      
    case 'SET_SPEED':
      return { ...state, speed: action.speed };
      
    case 'SET_MODE':
      return { ...state, mode: action.mode };
      
    case 'SET_LOOP':
      return { ...state, loop: action.loop };
      
    case 'SET_BOUNDS':
      return {
        ...state,
        startIndex: action.start,
        endIndex: action.end,
        currentIndex: Math.max(state.currentIndex, action.start),
      };
      
    case 'RESET':
      return {
        ...DEFAULT_REPLAY_STATE,
        endIndex: state.endIndex,
      };
      
    default:
      return state;
  }
}

// ─────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────

export function XRMeetingReplay({
  baseContext,
  baseAgents,
  events,
  autoPlay = false,
  initialSpeed = 1,
  showHUD = true,
  showMarkers = true,
  hudPosition = 'bottom',
  onEventChange,
  onReplayEnd,
  onBookmark,
}: XRMeetingReplayProps) {
  // Replay state
  const [replay, dispatch] = useReducer(replayReducer, {
    ...DEFAULT_REPLAY_STATE,
    isPlaying: autoPlay,
    speed: initialSpeed,
    endIndex: events.length - 1,
  });
  
  // Current snapshot
  const [snapshot, setSnapshot] = useState<XRReplaySnapshot>(() =>
    buildXRMeetingSnapshotFromEvents(events, 0, baseContext)
  );
  
  // Current agents state
  const [agents, setAgents] = useState<XRMeetingAgent[]>(() =>
    buildAgentStatesAtIndex(events, 0, baseAgents)
  );
  
  // Auto-generated markers
  const markers = useMemo(() => 
    showMarkers ? generateAutoMarkers(events) : [],
    [events, showMarkers]
  );
  
  // Total duration
  const totalDuration = useMemo(() => 
    calculateEventsDuration(events),
    [events]
  );
  
  // Auto-advance effect
  useEffect(() => {
    if (!replay.isPlaying || events.length === 0) return;
    
    // Calculate interval based on speed
    // Base: 1 second per event at 1x speed
    const intervalMs = 1000 / replay.speed;
    
    const interval = setInterval(() => {
      dispatch({ type: 'STEP_FORWARD' });
    }, intervalMs);
    
    return () => clearInterval(interval);
  }, [replay.isPlaying, replay.speed, events.length]);
  
  // Check for end of replay
  useEffect(() => {
    const maxIndex = replay.endIndex >= 0 ? replay.endIndex : events.length - 1;
    
    if (replay.currentIndex >= maxIndex) {
      if (replay.loop) {
        dispatch({ type: 'JUMP_TO', index: replay.startIndex });
      } else {
        dispatch({ type: 'PAUSE' });
        onReplayEnd?.();
      }
    }
  }, [replay.currentIndex, replay.endIndex, replay.loop, replay.startIndex, events.length, onReplayEnd]);
  
  // Update snapshot when index changes
  useEffect(() => {
    if (events.length === 0) return;
    
    const safeIndex = Math.min(replay.currentIndex, events.length - 1);
    
    const newSnapshot = buildXRMeetingSnapshotFromEvents(
      events,
      safeIndex,
      baseContext
    );
    setSnapshot(newSnapshot);
    
    const newAgents = buildAgentStatesAtIndex(
      events,
      safeIndex,
      baseAgents
    );
    setAgents(newAgents);
    
    // Callback
    const currentEvent = events[safeIndex];
    if (currentEvent) {
      onEventChange?.(currentEvent, safeIndex);
    }
  }, [replay.currentIndex, events, baseContext, baseAgents, onEventChange]);
  
  // Handlers
  const handleJumpToEvent = useCallback((eventId: string) => {
    const index = findEventIndex(events, eventId);
    if (index >= 0) {
      dispatch({ type: 'JUMP_TO', index });
    }
  }, [events]);
  
  const handleMarkerClick = useCallback((marker: ReplayMarker) => {
    dispatch({ type: 'JUMP_TO', index: marker.eventIndex });
  }, []);
  
  const handleBookmark = useCallback(() => {
    onBookmark?.(replay.currentIndex);
  }, [replay.currentIndex, onBookmark]);
  
  const handleScrub = useCallback((index: number) => {
    dispatch({ type: 'JUMP_TO', index });
  }, []);
  
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* XR Meeting Room with current state */}
      <XRMeetingRoom
        context={snapshot.context}
        agents={agents}
        events={events.slice(0, replay.currentIndex + 1)}
        xrEnabled={true}
      />
      
      {/* Replay HUD */}
      {showHUD && (
        <ReplayHUD
          replay={replay}
          events={events}
          markers={markers}
          totalDuration={totalDuration}
          position={hudPosition}
          onTogglePlay={() => dispatch({ type: 'TOGGLE_PLAY' })}
          onStepForward={() => dispatch({ type: 'STEP_FORWARD' })}
          onStepBack={() => dispatch({ type: 'STEP_BACK' })}
          onChangeSpeed={(speed) => dispatch({ type: 'SET_SPEED', speed })}
          onJumpTo={handleScrub}
          onMarkerClick={handleMarkerClick}
          onToggleLoop={() => dispatch({ type: 'SET_LOOP', loop: !replay.loop })}
          onBookmark={handleBookmark}
          onReset={() => dispatch({ type: 'RESET' })}
        />
      )}
      
      {/* Current event indicator */}
      <CurrentEventIndicator
        event={events[replay.currentIndex]}
        position={hudPosition === 'bottom' ? 'top' : 'bottom'}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────
// REPLAY HUD
// ─────────────────────────────────────────────────────

interface ReplayHUDProps {
  replay: XRReplayState;
  events: TimelineXREvent[];
  markers: ReplayMarker[];
  totalDuration: number;
  position: 'bottom' | 'top' | 'floating';
  onTogglePlay: () => void;
  onStepForward: () => void;
  onStepBack: () => void;
  onChangeSpeed: (speed: ReplaySpeed) => void;
  onJumpTo: (index: number) => void;
  onMarkerClick: (marker: ReplayMarker) => void;
  onToggleLoop: () => void;
  onBookmark: () => void;
  onReset: () => void;
}

function ReplayHUD({
  replay,
  events,
  markers,
  totalDuration,
  position,
  onTogglePlay,
  onStepForward,
  onStepBack,
  onChangeSpeed,
  onJumpTo,
  onMarkerClick,
  onToggleLoop,
  onBookmark,
  onReset,
}: ReplayHUDProps) {
  const positionStyles: React.CSSProperties = {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    ...(position === 'bottom' ? { bottom: 20 } : { top: 20 }),
  };
  
  const progress = events.length > 0 
    ? (replay.currentIndex + 1) / events.length 
    : 0;
  
  const currentTime = events[replay.currentIndex]?.timestamp;
  const startTime = events[0]?.timestamp || 0;
  const elapsed = currentTime ? currentTime - startTime : 0;
  
  return (
    <div style={{
      ...positionStyles,
      padding: '12px 20px',
      borderRadius: 12,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(10px)',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      minWidth: 400,
      boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
    }}>
      {/* Timeline scrubber */}
      <div style={{ position: 'relative' }}>
        {/* Progress bar background */}
        <div 
          style={{
            height: 8,
            background: '#374151',
            borderRadius: 4,
            cursor: 'pointer',
            position: 'relative',
          }}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percent = x / rect.width;
            const index = Math.floor(percent * events.length);
            onJumpTo(Math.max(0, Math.min(index, events.length - 1)));
          }}
        >
          {/* Progress fill */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: `${progress * 100}%`,
            background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
            borderRadius: 4,
            transition: 'width 0.1s',
          }} />
          
          {/* Markers */}
          {markers.map(marker => (
            <div
              key={marker.id}
              style={{
                position: 'absolute',
                top: -4,
                left: `${(marker.eventIndex / events.length) * 100}%`,
                transform: 'translateX(-50%)',
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: marker.color || '#fbbf24',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 10,
              }}
              onClick={(e) => {
                e.stopPropagation();
                onMarkerClick(marker);
              }}
              title={marker.label}
            >
              {marker.icon}
            </div>
          ))}
          
          {/* Current position indicator */}
          <div style={{
            position: 'absolute',
            top: -3,
            left: `${progress * 100}%`,
            transform: 'translateX(-50%)',
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: '#fff',
            border: '2px solid #6366f1',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }} />
        </div>
      </div>
      
      {/* Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
      }}>
        {/* Left: Time info */}
        <div style={{ fontSize: 12, color: '#9ca3af', minWidth: 100 }}>
          <span style={{ color: '#fff', fontWeight: 600 }}>
            {replay.currentIndex + 1}
          </span>
          {' / '}
          {events.length}
          <span style={{ marginLeft: 8, fontSize: 10 }}>
            {formatDuration(elapsed)}
          </span>
        </div>
        
        {/* Center: Playback controls */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <ControlButton onClick={onReset} title="Reset">
            ⏮️
          </ControlButton>
          <ControlButton onClick={onStepBack} title="Reculer">
            ⏪
          </ControlButton>
          <ControlButton 
            onClick={onTogglePlay} 
            large
            active={replay.isPlaying}
            title={replay.isPlaying ? 'Pause' : 'Play'}
          >
            {replay.isPlaying ? '⏸️' : '▶️'}
          </ControlButton>
          <ControlButton onClick={onStepForward} title="Avancer">
            ⏩
          </ControlButton>
          <ControlButton 
            onClick={onToggleLoop} 
            active={replay.loop}
            title="Boucle"
          >
            🔁
          </ControlButton>
        </div>
        
        {/* Right: Speed + bookmark */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <select
            value={replay.speed}
            onChange={(e) => onChangeSpeed(Number(e.target.value) as ReplaySpeed)}
            style={{
              padding: '4px 8px',
              fontSize: 11,
              background: '#374151',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            <option value={0.25}>0.25x</option>
            <option value={0.5}>0.5x</option>
            <option value={1}>1x</option>
            <option value={2}>2x</option>
            <option value={4}>4x</option>
            <option value={8}>8x</option>
          </select>
          
          <ControlButton onClick={onBookmark} title="Ajouter un signet">
            🔖
          </ControlButton>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────
// CONTROL BUTTON
// ─────────────────────────────────────────────────────

function ControlButton({
  children,
  onClick,
  large = false,
  active = false,
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  large?: boolean;
  active?: boolean;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: large ? 44 : 32,
        height: large ? 44 : 32,
        borderRadius: large ? 22 : 6,
        border: 'none',
        background: active ? '#6366f1' : '#374151',
        color: '#fff',
        fontSize: large ? 18 : 14,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.15s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = active ? '#818cf8' : '#4b5563';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = active ? '#6366f1' : '#374151';
      }}
    >
      {children}
    </button>
  );
}

// ─────────────────────────────────────────────────────
// CURRENT EVENT INDICATOR
// ─────────────────────────────────────────────────────

function CurrentEventIndicator({
  event,
  position,
}: {
  event?: TimelineXREvent;
  position: 'top' | 'bottom';
}) {
  if (!event) return null;
  
  return (
    <div style={{
      position: 'absolute',
      left: 20,
      ...(position === 'top' ? { top: 20 } : { bottom: 100 }),
      padding: '10px 16px',
      borderRadius: 8,
      background: 'rgba(0, 0, 0, 0.75)',
      color: '#fff',
      maxWidth: 300,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
      }}>
        <span style={{
          padding: '2px 6px',
          borderRadius: 4,
          background: '#6366f1',
          fontSize: 10,
          fontWeight: 600,
          textTransform: 'uppercase',
        }}>
          {event.type.replace(/_/g, ' ')}
        </span>
        <span style={{ fontSize: 10, color: '#9ca3af' }}>
          {event.actorType}
        </span>
      </div>
      <div style={{ fontSize: 13 }}>
        {event.summary}
      </div>
      {event.actorName && (
        <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
          — {event.actorName}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
}

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default XRMeetingReplay;
