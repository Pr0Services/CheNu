/**
 * CHE·NU — XR MEETING ROOM + AVATAR MORPHOLOGY
 * React UI Components
 * 
 * Non-manipulative meeting interfaces
 */

import React, { useState, CSSProperties } from 'react';
import { useXRMeeting } from './XRMeetingContext';
import {
  MeetingPresetConfig,
  MeetingPresetId,
  InteractionMode,
  AvatarRole,
  AvatarRoleConfig,
  Avatar,
  XRMeeting,
  MeetingParticipant,
} from './types';
import { INTERACTION_MODES, AVATAR_ROLE_LIST, MEETING_PRESET_LIST } from './presets';

// ============================================================
// STYLES
// ============================================================

const styles: Record<string, CSSProperties> = {
  container: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    padding: 20,
    maxWidth: 1000,
    margin: '0 auto',
  },
  card: {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 600,
    color: '#1f2937',
    margin: 0,
  },
  subtitle: {
    fontSize: 13,
    color: '#6b7280',
    margin: '4px 0 0 0',
  },
  button: {
    padding: '10px 20px',
    fontSize: 14,
    fontWeight: 500,
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  buttonPrimary: {
    background: '#8B5CF6',
    color: '#fff',
  },
  buttonSecondary: {
    background: '#f3f4f6',
    color: '#374151',
  },
  buttonDanger: {
    background: '#EF4444',
    color: '#fff',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 12,
  },
  badge: {
    display: 'inline-block',
    padding: '3px 10px',
    fontSize: 11,
    fontWeight: 600,
    borderRadius: 20,
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    fontSize: 14,
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    marginBottom: 12,
  },
};

// ============================================================
// MEETING PRESET CARD
// ============================================================

interface PresetCardProps {
  preset: MeetingPresetConfig;
  isSelected: boolean;
  onSelect: (id: MeetingPresetId) => void;
}

export function MeetingPresetCard({ preset, isSelected, onSelect }: PresetCardProps) {
  return (
    <div
      style={{
        ...styles.card,
        border: isSelected ? `2px solid ${preset.color}` : '1px solid #e5e7eb',
        cursor: 'pointer',
        padding: 14,
      }}
      onClick={() => onSelect(preset.id)}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: preset.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 20,
        }}>
          {preset.icon}
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{preset.name}</div>
          <div style={{ fontSize: 11, color: '#6b7280' }}>
            👥 {preset.capacity.min}-{preset.capacity.max}
          </div>
        </div>
      </div>
      
      <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>
        {preset.description}
      </div>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {[
          { icon: '💡', value: preset.lighting },
          { icon: '🎤', value: preset.voice.replace('_', ' ') },
        ].map((prop, i) => (
          <span key={i} style={{
            ...styles.badge,
            background: '#f3f4f6',
            color: '#374151',
            fontSize: 10,
          }}>
            {prop.icon} {prop.value}
          </span>
        ))}
      </div>
      
      {isSelected && (
        <div style={{
          marginTop: 10,
          padding: 6,
          background: `${preset.color}15`,
          borderRadius: 6,
          fontSize: 11,
          color: preset.color,
          textAlign: 'center',
          fontWeight: 600,
        }}>
          ✓ Selected
        </div>
      )}
    </div>
  );
}

// ============================================================
// CREATE MEETING FORM
// ============================================================

export function CreateMeetingForm() {
  const { state, createMeeting, selectPreset } = useXRMeeting();
  const [title, setTitle] = useState('');
  const [creatorName, setCreatorName] = useState('');
  
  const handleCreate = () => {
    if (!title || !state.selectedPreset || !creatorName) return;
    createMeeting(title, state.selectedPreset, creatorName);
    setTitle('');
    setCreatorName('');
  };
  
  return (
    <div style={styles.card}>
      <h2 style={{ ...styles.title, marginBottom: 16 }}>🏛️ Create Meeting Room</h2>
      
      <input
        type="text"
        placeholder="Meeting title..."
        value={title}
        onChange={e => setTitle(e.target.value)}
        style={styles.input}
      />
      
      <input
        type="text"
        placeholder="Your name..."
        value={creatorName}
        onChange={e => setCreatorName(e.target.value)}
        style={styles.input}
      />
      
      <h3 style={{ fontSize: 14, marginBottom: 12, color: '#374151' }}>Select Preset</h3>
      <div style={styles.grid}>
        {MEETING_PRESET_LIST.map(preset => (
          <MeetingPresetCard
            key={preset.id}
            preset={preset}
            isSelected={state.selectedPreset === preset.id}
            onSelect={selectPreset}
          />
        ))}
      </div>
      
      <button
        style={{
          ...styles.button,
          ...styles.buttonPrimary,
          width: '100%',
          marginTop: 16,
          opacity: (!title || !state.selectedPreset || !creatorName) ? 0.5 : 1,
        }}
        onClick={handleCreate}
        disabled={!title || !state.selectedPreset || !creatorName}
      >
        Create Meeting Room
      </button>
    </div>
  );
}

// ============================================================
// ACTIVE MEETING DISPLAY
// ============================================================

export function ActiveMeetingDisplay() {
  const { state, endMeeting, setMeetingMode } = useXRMeeting();
  const meeting = state.currentMeeting;
  
  if (!meeting) {
    return (
      <div style={{ ...styles.card, textAlign: 'center', padding: 40, color: '#6b7280' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🏛️</div>
        <p>No active meeting. Create one to begin.</p>
      </div>
    );
  }
  
  const presetConfig = MEETING_PRESET_LIST.find(p => p.id === meeting.preset);
  
  return (
    <div style={{ ...styles.card, border: `2px solid ${presetConfig?.color || '#8B5CF6'}` }}>
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 50,
            height: 50,
            borderRadius: 12,
            background: presetConfig?.color || '#8B5CF6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
          }}>
            {presetConfig?.icon || '🏛️'}
          </div>
          <div>
            <h2 style={{ ...styles.title, fontSize: 16 }}>{meeting.title}</h2>
            <p style={styles.subtitle}>{presetConfig?.name} • {meeting.mode}</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: 8 }}>
          {meeting.mode === 'live' && (
            <button
              style={{ ...styles.button, ...styles.buttonDanger, padding: '8px 16px', fontSize: 13 }}
              onClick={endMeeting}
            >
              End Meeting
            </button>
          )}
        </div>
      </div>
      
      {/* Recording indicator */}
      {state.meetingRuntime.is_recording && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 12px',
          background: '#FEE2E2',
          borderRadius: 8,
          marginBottom: 12,
          fontSize: 12,
          color: '#DC2626',
        }}>
          <span style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#DC2626',
            animation: 'pulse 1.5s infinite',
          }} />
          Recording in progress • All participants see this indicator
        </div>
      )}
      
      {/* Participants */}
      <div style={{ marginBottom: 16 }}>
        <h4 style={{ fontSize: 13, marginBottom: 8, color: '#374151' }}>
          👥 Participants ({meeting.participants.length})
        </h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {meeting.participants.map(p => (
            <ParticipantBadge key={p.id} participant={p} />
          ))}
        </div>
      </div>
      
      {/* Mode selector */}
      <div>
        <h4 style={{ fontSize: 13, marginBottom: 8, color: '#374151' }}>Meeting Mode</h4>
        <div style={{ display: 'flex', gap: 8 }}>
          {(['live', 'review', 'replay'] as const).map(mode => (
            <button
              key={mode}
              style={{
                ...styles.button,
                flex: 1,
                padding: '8px 12px',
                fontSize: 12,
                background: meeting.mode === mode ? '#8B5CF6' : '#f3f4f6',
                color: meeting.mode === mode ? '#fff' : '#374151',
              }}
              onClick={() => setMeetingMode(mode)}
            >
              {mode === 'live' && '🔴 '}{mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PARTICIPANT BADGE
// ============================================================

interface ParticipantBadgeProps {
  participant: MeetingParticipant;
}

function ParticipantBadge({ participant }: ParticipantBadgeProps) {
  const roleColors = {
    user: '#10B981',
    agent: '#3B82F6',
    observer: '#6B7280',
  };
  
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '6px 10px',
      background: '#f3f4f6',
      borderRadius: 20,
      fontSize: 12,
    }}>
      <span style={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: roleColors[participant.role],
      }} />
      {participant.name}
      <span style={{ color: '#9CA3AF', fontSize: 10 }}>({participant.role})</span>
      {participant.is_speaking && <span>🎤</span>}
    </div>
  );
}

// ============================================================
// INTERACTION MODES PANEL
// ============================================================

export function InteractionModesPanel() {
  const { state, setInteractionMode } = useXRMeeting();
  
  return (
    <div style={styles.card}>
      <h3 style={{ ...styles.title, fontSize: 14, marginBottom: 12 }}>
        🎮 Interaction Modes
      </h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {INTERACTION_MODES.map(mode => (
          <button
            key={mode.mode}
            style={{
              padding: 12,
              borderRadius: 8,
              border: state.interactionMode === mode.mode ? '2px solid #8B5CF6' : '1px solid #e5e7eb',
              background: state.interactionMode === mode.mode ? '#F3E8FF' : '#fff',
              cursor: 'pointer',
              textAlign: 'center',
            }}
            onClick={() => setInteractionMode(mode.mode)}
            title={mode.description}
          >
            <div style={{ fontSize: 24, marginBottom: 4 }}>{mode.icon}</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#374151' }}>{mode.name}</div>
          </button>
        ))}
      </div>
      
      {/* Current mode constraints */}
      {state.interactionMode && (
        <div style={{
          marginTop: 12,
          padding: 10,
          background: '#FEF3C7',
          borderRadius: 6,
          fontSize: 11,
        }}>
          <strong style={{ color: '#92400E' }}>⚠️ Constraints:</strong>
          <ul style={{ margin: '4px 0 0', paddingLeft: 16, color: '#78350F' }}>
            {INTERACTION_MODES.find(m => m.mode === state.interactionMode)?.constraints.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ============================================================
// AVATAR ROLE CARD
// ============================================================

interface AvatarRoleCardProps {
  roleConfig: AvatarRoleConfig;
  isSelected: boolean;
  onSelect: (role: AvatarRole) => void;
}

function AvatarRoleCard({ roleConfig, isSelected, onSelect }: AvatarRoleCardProps) {
  return (
    <div
      style={{
        padding: 14,
        borderRadius: 10,
        border: isSelected ? `2px solid ${roleConfig.color}` : '1px solid #e5e7eb',
        background: isSelected ? `${roleConfig.color}10` : '#fff',
        cursor: 'pointer',
        textAlign: 'center',
      }}
      onClick={() => onSelect(roleConfig.role)}
    >
      <div style={{
        width: 48,
        height: 48,
        borderRadius: '50%',
        background: roleConfig.color,
        margin: '0 auto 10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: 700,
        fontSize: 18,
      }}>
        {roleConfig.name.charAt(0)}
      </div>
      
      <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>{roleConfig.name}</div>
      
      <ul style={{
        margin: 0,
        padding: 0,
        listStyle: 'none',
        fontSize: 10,
        color: '#6b7280',
      }}>
        {roleConfig.features.map((f, i) => (
          <li key={i} style={{ marginBottom: 2 }}>{f}</li>
        ))}
      </ul>
    </div>
  );
}

// ============================================================
// AVATAR SELECTOR
// ============================================================

export function AvatarSelector() {
  const { createAvatar, setCurrentAvatar, state } = useXRMeeting();
  const [selectedRole, setSelectedRole] = useState<AvatarRole>('user');
  
  const handleCreateAvatar = () => {
    const avatarId = createAvatar('current_user', selectedRole);
    setCurrentAvatar(avatarId);
  };
  
  return (
    <div style={styles.card}>
      <h3 style={{ ...styles.title, fontSize: 14, marginBottom: 12 }}>
        👤 Avatar Configuration
      </h3>
      
      <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 12 }}>
        Avatar = Visual presence only. No intelligence. No authority. No persuasion.
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {AVATAR_ROLE_LIST.map(role => (
          <AvatarRoleCard
            key={role.role}
            roleConfig={role}
            isSelected={selectedRole === role.role}
            onSelect={setSelectedRole}
          />
        ))}
      </div>
      
      <button
        style={{ ...styles.button, ...styles.buttonPrimary, width: '100%', marginTop: 16 }}
        onClick={handleCreateAvatar}
      >
        Create Avatar as {selectedRole}
      </button>
      
      {/* Current avatar display */}
      {state.currentAvatar && (
        <div style={{
          marginTop: 16,
          padding: 12,
          background: '#F3E8FF',
          borderRadius: 8,
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#7C3AED', marginBottom: 4 }}>
            Current Avatar
          </div>
          <div style={{ fontSize: 11, color: '#6B21A8' }}>
            Role: {state.currentAvatar.role} • 
            Scale: {state.currentAvatar.morphology.scale} • 
            Material: {state.currentAvatar.morphology.material}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// ETHICAL CONSTRAINTS DISPLAY
// ============================================================

export function EthicalConstraintsDisplay() {
  return (
    <div style={styles.card}>
      <h3 style={{ ...styles.title, fontSize: 14, marginBottom: 12 }}>
        🛡️ Ethical Constraints
      </h3>
      
      <div style={{ marginBottom: 16 }}>
        <h4 style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
          Meeting Room
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            '❌ No emotional steering',
            '❌ No forced sequences',
            '✓ Symmetric visibility',
            '✓ Exact replay required',
            '✓ Clear recording indicator',
          ].map((item, i) => (
            <div key={i} style={{ fontSize: 11, color: item.startsWith('❌') ? '#DC2626' : '#059669' }}>
              {item}
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h4 style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
          Avatar
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            '❌ No dominance visuals',
            '❌ No deceptive scale',
            '❌ No authority signaling',
            '✓ Accessibility first',
            '✓ Consistent appearance',
          ].map((item, i) => (
            <div key={i} style={{ fontSize: 11, color: item.startsWith('❌') ? '#DC2626' : '#059669' }}>
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// FULL DASHBOARD
// ============================================================

export function XRMeetingDashboard() {
  const { state } = useXRMeeting();
  
  return (
    <div style={styles.container}>
      <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 4, color: '#1F2937' }}>
        🏛️ CHE·NU XR Meeting Room
      </h1>
      <p style={{ color: '#6b7280', marginBottom: 20 }}>
        Shared immersive space — Context only, not persuasion
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16 }}>
        <div>
          {state.currentMeeting ? (
            <>
              <ActiveMeetingDisplay />
              <InteractionModesPanel />
            </>
          ) : (
            <CreateMeetingForm />
          )}
        </div>
        
        <div>
          <AvatarSelector />
          <EthicalConstraintsDisplay />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// EXPORTS
// ============================================================

export {
  MeetingPresetCard,
  CreateMeetingForm,
  ActiveMeetingDisplay,
  ParticipantBadge,
  InteractionModesPanel,
  AvatarRoleCard,
  AvatarSelector,
  EthicalConstraintsDisplay,
  XRMeetingDashboard,
};
