/* =====================================================
   CHE·NU — Meeting Room Component
   ui/meetings/MeetingRoom.tsx
   ===================================================== */

import React, { useState } from 'react';
import { Meeting, MeetingPhase } from '@/core/meetings/meeting.types';
import { advanceMeetingPhase, getNextPhase } from '@/core/meetings/meeting.logic';
import { AgentOrbit } from '../agents/AgentOrbit';
import { getTheme } from '@/core/theme/themeEngine';

interface MeetingRoomProps {
  meeting: Meeting;
  onUpdateMeeting: (meeting: Meeting) => void;
  onClose: () => void;
}

const PHASE_LABELS: Record<MeetingPhase, string> = {
  setup: '⚙️ Setup',
  opening: '🎬 Opening',
  discussion: '💬 Discussion',
  analysis: '📊 Analysis',
  proposal: '💡 Proposal',
  voting: '🗳️ Voting',
  decision: '✅ Decision',
  action_planning: '📋 Action Planning',
  closing: '🏁 Closing',
  completed: '✨ Completed',
};

export const MeetingRoom: React.FC<MeetingRoomProps> = ({
  meeting,
  onUpdateMeeting,
  onClose,
}) => {
  const theme = getTheme();
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);

  const handleAdvancePhase = () => {
    const updated = advanceMeetingPhase(meeting);
    onUpdateMeeting(updated);
  };

  const nextPhase = getNextPhase(meeting.phase);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: theme.colors.background,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 100,
      }}
    >
      {/* Header */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: theme.spacing.md,
          borderBottom: `1px solid ${theme.colors.border}`,
          background: theme.colors.surface,
        }}
      >
        <div>
          <h1 style={{ 
            margin: 0, 
            fontSize: theme.typography.fontSizeLg,
            color: theme.colors.text,
          }}>
            {meeting.title}
          </h1>
          <p style={{ 
            margin: 0, 
            fontSize: theme.typography.fontSizeSm,
            color: theme.colors.textMuted,
          }}>
            {meeting.objective}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
          {/* Phase Indicator */}
          <div
            style={{
              padding: `${theme.spacing.xs} ${theme.spacing.md}`,
              background: theme.colors.primary,
              borderRadius: theme.radius.full,
              color: theme.colors.text,
              fontSize: theme.typography.fontSizeSm,
              fontWeight: theme.typography.fontWeightMedium,
            }}
          >
            {PHASE_LABELS[meeting.phase]}
          </div>

          <button
            onClick={onClose}
            style={{
              padding: `${theme.spacing.sm} ${theme.spacing.md}`,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.radius.md,
              background: 'transparent',
              color: theme.colors.text,
              cursor: 'pointer',
            }}
          >
            Exit Meeting
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '1fr 350px',
          overflow: 'hidden',
        }}
      >
        {/* Center: Agent Orbit */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          <AgentOrbit
            agents={meeting.agents}
            onAgentClick={(agent) => setSelectedAgentId(agent.id)}
          />

          {/* Decision Space Overlay */}
          {meeting.phase === 'decision' && meeting.decisions.length > 0 && (
            <div
              style={{
                position: 'absolute',
                bottom: theme.spacing.xl,
                left: '50%',
                transform: 'translateX(-50%)',
                background: theme.colors.surface,
                padding: theme.spacing.lg,
                borderRadius: theme.radius.lg,
                border: `1px solid ${theme.colors.secondary}`,
                boxShadow: theme.shadows.xl,
                maxWidth: 500,
              }}
            >
              <h3 style={{ 
                margin: 0, 
                marginBottom: theme.spacing.md,
                color: theme.colors.text,
              }}>
                Pending Decision
              </h3>
              {meeting.decisions
                .filter(d => !d.selectedOption)
                .slice(0, 1)
                .map(decision => (
                  <div key={decision.id}>
                    <p style={{ color: theme.colors.textSecondary }}>
                      {decision.title}
                    </p>
                    <div style={{ 
                      display: 'flex', 
                      gap: theme.spacing.sm,
                      marginTop: theme.spacing.md,
                    }}>
                      {decision.options.map(option => (
                        <button
                          key={option.id}
                          style={{
                            flex: 1,
                            padding: theme.spacing.md,
                            border: `1px solid ${theme.colors.border}`,
                            borderRadius: theme.radius.md,
                            background: theme.colors.surfaceHover,
                            color: theme.colors.text,
                            cursor: 'pointer',
                          }}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside
          style={{
            borderLeft: `1px solid ${theme.colors.border}`,
            background: theme.colors.surface,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Agenda */}
          <div
            style={{
              padding: theme.spacing.md,
              borderBottom: `1px solid ${theme.colors.border}`,
            }}
          >
            <h3 style={{ 
              margin: 0, 
              marginBottom: theme.spacing.sm,
              fontSize: theme.typography.fontSizeMd,
              color: theme.colors.text,
            }}>
              Agenda
            </h3>
            {meeting.agenda.length > 0 ? (
              <ul style={{ 
                margin: 0, 
                padding: 0, 
                listStyle: 'none',
              }}>
                {meeting.agenda.map((item, i) => (
                  <li
                    key={item.id}
                    style={{
                      padding: theme.spacing.sm,
                      borderRadius: theme.radius.sm,
                      background: item.status === 'in_progress' 
                        ? `${theme.colors.primary}20` 
                        : 'transparent',
                      color: item.status === 'completed' 
                        ? theme.colors.textMuted 
                        : theme.colors.text,
                      textDecoration: item.status === 'completed' 
                        ? 'line-through' 
                        : 'none',
                    }}
                  >
                    {i + 1}. {item.title}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: theme.colors.textMuted, margin: 0 }}>
                No agenda items
              </p>
            )}
          </div>

          {/* Participants */}
          <div
            style={{
              flex: 1,
              padding: theme.spacing.md,
              overflow: 'auto',
            }}
          >
            <h3 style={{ 
              margin: 0, 
              marginBottom: theme.spacing.sm,
              fontSize: theme.typography.fontSizeMd,
              color: theme.colors.text,
            }}>
              Participants ({meeting.agents.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.xs }}>
              {meeting.agents.map(agent => (
                <div
                  key={agent.id}
                  onClick={() => setSelectedAgentId(agent.id)}
                  style={{
                    padding: theme.spacing.sm,
                    borderRadius: theme.radius.sm,
                    background: selectedAgentId === agent.id 
                      ? theme.colors.surfaceHover 
                      : 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing.sm,
                  }}
                >
                  <span>{agent.avatar.icon || '🤖'}</span>
                  <div>
                    <div style={{ 
                      fontSize: theme.typography.fontSizeSm,
                      color: theme.colors.text,
                    }}>
                      {agent.displayName}
                    </div>
                    <div style={{ 
                      fontSize: theme.typography.fontSizeXs,
                      color: theme.colors.textMuted,
                    }}>
                      {agent.role}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div
            style={{
              padding: theme.spacing.md,
              borderTop: `1px solid ${theme.colors.border}`,
            }}
          >
            {nextPhase && (
              <button
                onClick={handleAdvancePhase}
                style={{
                  width: '100%',
                  padding: theme.spacing.md,
                  border: 'none',
                  borderRadius: theme.radius.md,
                  background: theme.colors.primary,
                  color: theme.colors.text,
                  cursor: 'pointer',
                  fontWeight: theme.typography.fontWeightMedium,
                }}
              >
                Advance to {PHASE_LABELS[nextPhase]}
              </button>
            )}
          </div>
        </aside>
      </div>

      {/* Phase Timeline */}
      <footer
        style={{
          padding: theme.spacing.md,
          borderTop: `1px solid ${theme.colors.border}`,
          background: theme.colors.surface,
        }}
      >
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center',
          gap: theme.spacing.xs,
        }}>
          {Object.entries(PHASE_LABELS).map(([phase, label]) => {
            const isActive = phase === meeting.phase;
            const isPast = Object.keys(PHASE_LABELS).indexOf(phase) < 
                          Object.keys(PHASE_LABELS).indexOf(meeting.phase);
            
            return (
              <div
                key={phase}
                style={{
                  padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                  borderRadius: theme.radius.sm,
                  fontSize: theme.typography.fontSizeXs,
                  background: isActive 
                    ? theme.colors.primary 
                    : isPast 
                      ? theme.colors.success 
                      : theme.colors.surfaceHover,
                  color: isActive || isPast 
                    ? theme.colors.text 
                    : theme.colors.textMuted,
                  opacity: isPast ? 0.7 : 1,
                }}
              >
                {label.split(' ')[0]}
              </div>
            );
          })}
        </div>
      </footer>
    </div>
  );
};

export default MeetingRoom;
