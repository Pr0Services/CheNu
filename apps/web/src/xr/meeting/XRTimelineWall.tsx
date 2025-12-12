/* =====================================================
   CHE·NU — XR Timeline Wall
   
   Large curved wall behind the meeting showing:
   - Chronological events
   - Agent contributions
   - Decisions made
   - Phase transitions
   
   Interactive: can rewind to past states.
   ===================================================== */

import React, { useRef, useState, useMemo, useCallback } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { Html, Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

import {
  XRMeetingLayout,
  XRMeetingTheme,
  XRTimelineEvent,
  TimelineEventType,
  DEFAULT_MEETING_LAYOUT,
  DEFAULT_MEETING_THEME,
} from './xrMeeting.types';

// ─────────────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────────────

export interface XRTimelineWallProps {
  meetingId: string;
  events: XRTimelineEvent[];
  currentEventId?: string;
  layout?: Partial<XRMeetingLayout>;
  theme?: Partial<XRMeetingTheme>;
  
  // Callbacks
  onEventSelect?: (eventId: string) => void;
  onRewindTo?: (eventId: string) => void;
}

// ─────────────────────────────────────────────────────
// EVENT ICONS
// ─────────────────────────────────────────────────────

const EVENT_ICONS: Record<TimelineEventType, string> = {
  meeting_started: '🚀',
  agent_joined: '🤖',
  agent_spoke: '💬',
  human_asked: '❓',
  decision_proposed: '📋',
  decision_made: '✅',
  phase_changed: '🔄',
  meeting_ended: '🏁',
};

const EVENT_COLORS: Record<TimelineEventType, string> = {
  meeting_started: '#10b981',
  agent_joined: '#6366f1',
  agent_spoke: '#3b82f6',
  human_asked: '#f59e0b',
  decision_proposed: '#8b5cf6',
  decision_made: '#10b981',
  phase_changed: '#ec4899',
  meeting_ended: '#6b7280',
};

// ─────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────

export function XRTimelineWall({
  meetingId,
  events,
  currentEventId,
  layout: layoutProp,
  theme: themeProp,
  onEventSelect,
  onRewindTo,
}: XRTimelineWallProps) {
  const layout = { ...DEFAULT_MEETING_LAYOUT, ...layoutProp };
  const theme = { ...DEFAULT_MEETING_THEME, ...themeProp };
  
  const wallRef = useRef<THREE.Mesh>(null);
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);
  const [scrollOffset, setScrollOffset] = useState(0);
  
  const position = layout.timelineWall.position;
  const [width, height] = layout.timelineWallSize;
  
  // Calculate event positions on wall
  const eventLayout = useMemo(() => {
    const maxVisible = 8;
    const eventHeight = 0.28;
    const padding = 0.15;
    
    return events.slice(-maxVisible - Math.floor(scrollOffset)).map((event, index) => {
      const y = height / 2 - padding - (index + 0.5) * eventHeight;
      return {
        event,
        y,
        isLatest: index === 0 && scrollOffset === 0,
      };
    });
  }, [events, height, scrollOffset]);
  
  // Format timestamp
  const formatTime = useCallback((timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('fr-CA', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
    });
  }, []);
  
  // Handle scroll (with controllers or hand gestures)
  const handleScroll = useCallback((delta: number) => {
    setScrollOffset(prev => 
      Math.max(0, Math.min(events.length - 8, prev + delta))
    );
  }, [events.length]);
  
  return (
    <group position={position}>
      {/* Wall background */}
      <mesh ref={wallRef}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          color={theme.timelineBackground}
          metalness={0.1}
          roughness={0.9}
        />
      </mesh>
      
      {/* Wall frame */}
      <WallFrame width={width} height={height} color={theme.timelineEventColor} />
      
      {/* Title */}
      <Html
        center
        position={[0, height / 2 - 0.12, 0.01]}
        style={{ pointerEvents: 'none' }}
      >
        <div style={{
          color: 'white',
          fontSize: 14,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: 3,
        }}>
          Timeline
        </div>
      </Html>
      
      {/* Events */}
      {eventLayout.map(({ event, y, isLatest }) => (
        <TimelineEventCard
          key={event.id}
          event={event}
          y={y}
          width={width - 0.4}
          theme={theme}
          isLatest={isLatest}
          isCurrent={currentEventId === event.id}
          isHovered={hoveredEventId === event.id}
          formatTime={formatTime}
          onHover={(hovered) => setHoveredEventId(hovered ? event.id : null)}
          onClick={() => onEventSelect?.(event.id)}
          onRewind={() => onRewindTo?.(event.id)}
        />
      ))}
      
      {/* Scroll indicators */}
      {events.length > 8 && (
        <>
          {scrollOffset > 0 && (
            <mesh
              position={[width / 2 - 0.15, 0, 0.02]}
              onClick={() => handleScroll(-1)}
            >
              <planeGeometry args={[0.2, 0.3]} />
              <meshBasicMaterial color="#6366f1" transparent opacity={0.8} />
            </mesh>
          )}
          {scrollOffset < events.length - 8 && (
            <mesh
              position={[width / 2 - 0.15, -height / 2 + 0.2, 0.02]}
              onClick={() => handleScroll(1)}
            >
              <planeGeometry args={[0.2, 0.3]} />
              <meshBasicMaterial color="#6366f1" transparent opacity={0.8} />
            </mesh>
          )}
        </>
      )}
      
      {/* Progress bar */}
      <ProgressBar
        current={events.findIndex(e => e.id === currentEventId) + 1}
        total={events.length}
        width={width - 0.4}
        y={-height / 2 + 0.1}
        color={theme.timelineEventColor}
      />
    </group>
  );
}

// ─────────────────────────────────────────────────────
// WALL FRAME
// ─────────────────────────────────────────────────────

function WallFrame({ 
  width, 
  height, 
  color 
}: { 
  width: number; 
  height: number; 
  color: string;
}) {
  const thickness = 0.03;
  
  return (
    <group position={[0, 0, 0.005]}>
      {/* Top */}
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[width + thickness * 2, thickness, thickness]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {/* Bottom */}
      <mesh position={[0, -height / 2, 0]}>
        <boxGeometry args={[width + thickness * 2, thickness, thickness]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {/* Left */}
      <mesh position={[-width / 2, 0, 0]}>
        <boxGeometry args={[thickness, height, thickness]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {/* Right */}
      <mesh position={[width / 2, 0, 0]}>
        <boxGeometry args={[thickness, height, thickness]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────────────
// TIMELINE EVENT CARD
// ─────────────────────────────────────────────────────

interface TimelineEventCardProps {
  event: XRTimelineEvent;
  y: number;
  width: number;
  theme: XRMeetingTheme;
  isLatest: boolean;
  isCurrent: boolean;
  isHovered: boolean;
  formatTime: (timestamp: number) => string;
  onHover: (hovered: boolean) => void;
  onClick: () => void;
  onRewind: () => void;
}

function TimelineEventCard({
  event,
  y,
  width,
  theme,
  isLatest,
  isCurrent,
  isHovered,
  formatTime,
  onHover,
  onClick,
  onRewind,
}: TimelineEventCardProps) {
  const cardRef = useRef<THREE.Mesh>(null);
  const color = EVENT_COLORS[event.type];
  const icon = EVENT_ICONS[event.type];
  
  // Animation
  useFrame(() => {
    if (cardRef.current) {
      const targetZ = isHovered ? 0.05 : 0.02;
      cardRef.current.position.z = THREE.MathUtils.lerp(
        cardRef.current.position.z,
        targetZ,
        0.1
      );
    }
  });
  
  return (
    <group position={[0, y, 0]}>
      {/* Card background */}
      <mesh
        ref={cardRef}
        position={[0, 0, 0.02]}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(true);
        }}
        onPointerOut={() => onHover(false)}
      >
        <planeGeometry args={[width, 0.22]} />
        <meshStandardMaterial
          color={isCurrent ? color : isHovered ? '#374151' : '#1f2937'}
          emissive={isCurrent ? color : 'black'}
          emissiveIntensity={isCurrent ? 0.3 : 0}
        />
      </mesh>
      
      {/* Indicator line */}
      <mesh position={[-width / 2 + 0.02, 0, 0.025]}>
        <planeGeometry args={[0.04, 0.18]} />
        <meshBasicMaterial color={color} />
      </mesh>
      
      {/* Content */}
      <Html
        center
        position={[0, 0, 0.03]}
        style={{ pointerEvents: isHovered ? 'auto' : 'none' }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          width: width * 100 - 20,
          padding: '4px 8px',
        }}>
          {/* Icon */}
          <span style={{ fontSize: 16 }}>{icon}</span>
          
          {/* Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              color: 'white',
              fontSize: 10,
              fontWeight: 500,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {event.content}
            </div>
            <div style={{
              color: '#9ca3af',
              fontSize: 8,
              marginTop: 2,
            }}>
              {formatTime(event.timestamp)} • {event.actorType}
            </div>
          </div>
          
          {/* Rewind button (on hover, not current) */}
          {isHovered && !isCurrent && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRewind();
              }}
              style={{
                padding: '2px 8px',
                fontSize: 9,
                background: theme.timelineHighlightColor,
                color: 'black',
                border: 'none',
                borderRadius: 3,
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              ⏪ Revenir
            </button>
          )}
          
          {/* Latest indicator */}
          {isLatest && (
            <span style={{
              padding: '2px 6px',
              fontSize: 8,
              background: '#10b981',
              color: 'white',
              borderRadius: 3,
              fontWeight: 600,
            }}>
              DERNIER
            </span>
          )}
        </div>
      </Html>
    </group>
  );
}

// ─────────────────────────────────────────────────────
// PROGRESS BAR
// ─────────────────────────────────────────────────────

function ProgressBar({
  current,
  total,
  width,
  y,
  color,
}: {
  current: number;
  total: number;
  width: number;
  y: number;
  color: string;
}) {
  const progress = total > 0 ? current / total : 0;
  const progressWidth = width * progress;
  
  return (
    <group position={[0, y, 0.02]}>
      {/* Background */}
      <mesh>
        <planeGeometry args={[width, 0.04]} />
        <meshBasicMaterial color="#374151" />
      </mesh>
      
      {/* Progress */}
      <mesh position={[-(width - progressWidth) / 2, 0, 0.001]}>
        <planeGeometry args={[progressWidth, 0.04]} />
        <meshBasicMaterial color={color} />
      </mesh>
      
      {/* Label */}
      <Html center position={[width / 2 + 0.15, 0, 0]} style={{ pointerEvents: 'none' }}>
        <div style={{
          color: '#9ca3af',
          fontSize: 9,
          whiteSpace: 'nowrap',
        }}>
          {current}/{total}
        </div>
      </Html>
    </group>
  );
}

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default XRTimelineWall;
