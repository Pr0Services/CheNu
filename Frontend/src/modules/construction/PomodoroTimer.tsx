/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║              CHE·NU V5.0 - POMODORO TIMER                                    ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  Timer de productivité avec:                                                 ║
 * ║  - Sessions focus 25min / pause 5min                                         ║
 * ║  - Long breaks après 4 sessions                                              ║
 * ║  - Stats journalières et historique                                          ║
 * ║  - Sons ambiants optionnels                                                  ║
 * ║  - Mode focus (masque distractions)                                          ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════════════════════════════════════

const colors = {
  gold: '#D8B26A',
  stone: '#8D8371',
  emerald: '#3F7249',
  turquoise: '#3EB4A2',
  moss: '#2F4C39',
  ember: '#7A593A',
  slate: '#1E1F22',
  sand: '#E9E4D6',
  dark: '#0f1217',
  card: 'rgba(22, 27, 34, 0.95)',
  border: 'rgba(216, 178, 106, 0.15)',
  red: '#E54D4D',
};

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

interface PomodoroSettings {
  focusDuration: number; // minutes
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
  autoStartBreaks: boolean;
  autoStartFocus: boolean;
  soundEnabled: boolean;
  ambientSound: string | null;
}

interface SessionLog {
  id: string;
  mode: TimerMode;
  duration: number;
  completedAt: Date;
  task?: string;
}

interface DailyStats {
  date: string;
  focusSessions: number;
  totalFocusMinutes: number;
  breaks: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DEFAULT SETTINGS
// ═══════════════════════════════════════════════════════════════════════════════

const defaultSettings: PomodoroSettings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsBeforeLongBreak: 4,
  autoStartBreaks: false,
  autoStartFocus: false,
  soundEnabled: true,
  ambientSound: null,
};

const ambientSounds = [
  { id: 'rain', name: 'Pluie', icon: '🌧️' },
  { id: 'forest', name: 'Forêt', icon: '🌲' },
  { id: 'ocean', name: 'Océan', icon: '🌊' },
  { id: 'fire', name: 'Feu de camp', icon: '🔥' },
  { id: 'cafe', name: 'Café', icon: '☕' },
  { id: 'white-noise', name: 'Bruit blanc', icon: '📻' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const getModeColor = (mode: TimerMode): string => {
  switch (mode) {
    case 'focus': return colors.red;
    case 'shortBreak': return colors.emerald;
    case 'longBreak': return colors.turquoise;
  }
};

const getModeLabel = (mode: TimerMode): string => {
  switch (mode) {
    case 'focus': return '🎯 Focus';
    case 'shortBreak': return '☕ Pause courte';
    case 'longBreak': return '🌴 Pause longue';
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

// Circular Progress Ring
const ProgressRing = ({ 
  progress, 
  size = 300, 
  strokeWidth = 8, 
  color 
}: { 
  progress: number; 
  size?: number; 
  strokeWidth?: number; 
  color: string;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={colors.slate}
        strokeWidth={strokeWidth}
      />
      {/* Progress circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
      />
    </svg>
  );
};

// Mode Selector Button
const ModeButton = ({ 
  mode, 
  currentMode, 
  onClick, 
  disabled 
}: { 
  mode: TimerMode; 
  currentMode: TimerMode; 
  onClick: () => void;
  disabled: boolean;
}) => {
  const isActive = mode === currentMode;
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '10px 20px',
        background: isActive ? getModeColor(mode) : 'transparent',
        border: `1px solid ${isActive ? getModeColor(mode) : colors.border}`,
        borderRadius: 10,
        color: isActive ? '#fff' : colors.sand,
        fontSize: 14,
        fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.2s ease',
      }}
    >
      {getModeLabel(mode)}
    </button>
  );
};

// Stats Card
const StatsCard = ({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) => (
  <div style={{
    background: colors.card,
    border: `1px solid ${colors.border}`,
    borderRadius: 12,
    padding: 16,
    textAlign: 'center',
    flex: 1,
  }}>
    <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
    <div style={{ color, fontSize: 24, fontWeight: 700 }}>{value}</div>
    <div style={{ color: colors.stone, fontSize: 12, marginTop: 4 }}>{label}</div>
  </div>
);

// Session History Item
const SessionItem = ({ session }: { session: SessionLog }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    padding: '10px 14px',
    background: colors.slate,
    borderRadius: 8,
    marginBottom: 6,
  }}>
    <div style={{
      width: 36, height: 36,
      background: `${getModeColor(session.mode)}20`,
      borderRadius: 8,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      marginRight: 12,
      fontSize: 16,
    }}>
      {session.mode === 'focus' ? '🎯' : session.mode === 'shortBreak' ? '☕' : '🌴'}
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ color: colors.sand, fontSize: 13, fontWeight: 500 }}>
        {getModeLabel(session.mode)}
      </div>
      <div style={{ color: colors.stone, fontSize: 11 }}>
        {session.duration} min • {new Date(session.completedAt).toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
    {session.task && (
      <div style={{ color: colors.gold, fontSize: 11 }}>📝 {session.task}</div>
    )}
  </div>
);

// Settings Panel
const SettingsPanel = ({ 
  settings, 
  onUpdate, 
  onClose 
}: { 
  settings: PomodoroSettings; 
  onUpdate: (settings: PomodoroSettings) => void;
  onClose: () => void;
}) => {
  const [local, setLocal] = useState(settings);

  const handleSave = () => {
    onUpdate(local);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: colors.dark,
        border: `1px solid ${colors.border}`,
        borderRadius: 16,
        padding: 24,
        width: 400,
        maxHeight: '80vh',
        overflow: 'auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h3 style={{ color: colors.sand, margin: 0 }}>⚙️ Paramètres</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: colors.stone, fontSize: 20, cursor: 'pointer' }}>✕</button>
        </div>

        {/* Duration Settings */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ color: colors.sand, fontSize: 14, display: 'block', marginBottom: 8 }}>
            🎯 Durée Focus (minutes)
          </label>
          <input
            type="number"
            value={local.focusDuration}
            onChange={(e) => setLocal({ ...local, focusDuration: parseInt(e.target.value) || 25 })}
            min={1}
            max={120}
            style={{
              width: '100%',
              padding: '10px 14px',
              background: colors.slate,
              border: `1px solid ${colors.border}`,
              borderRadius: 8,
              color: colors.sand,
              fontSize: 14,
            }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ color: colors.sand, fontSize: 14, display: 'block', marginBottom: 8 }}>
            ☕ Pause courte (minutes)
          </label>
          <input
            type="number"
            value={local.shortBreakDuration}
            onChange={(e) => setLocal({ ...local, shortBreakDuration: parseInt(e.target.value) || 5 })}
            min={1}
            max={30}
            style={{
              width: '100%',
              padding: '10px 14px',
              background: colors.slate,
              border: `1px solid ${colors.border}`,
              borderRadius: 8,
              color: colors.sand,
              fontSize: 14,
            }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ color: colors.sand, fontSize: 14, display: 'block', marginBottom: 8 }}>
            🌴 Pause longue (minutes)
          </label>
          <input
            type="number"
            value={local.longBreakDuration}
            onChange={(e) => setLocal({ ...local, longBreakDuration: parseInt(e.target.value) || 15 })}
            min={1}
            max={60}
            style={{
              width: '100%',
              padding: '10px 14px',
              background: colors.slate,
              border: `1px solid ${colors.border}`,
              borderRadius: 8,
              color: colors.sand,
              fontSize: 14,
            }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ color: colors.sand, fontSize: 14, display: 'block', marginBottom: 8 }}>
            🔄 Sessions avant pause longue
          </label>
          <input
            type="number"
            value={local.sessionsBeforeLongBreak}
            onChange={(e) => setLocal({ ...local, sessionsBeforeLongBreak: parseInt(e.target.value) || 4 })}
            min={1}
            max={10}
            style={{
              width: '100%',
              padding: '10px 14px',
              background: colors.slate,
              border: `1px solid ${colors.border}`,
              borderRadius: 8,
              color: colors.sand,
              fontSize: 14,
            }}
          />
        </div>

        {/* Toggle Settings */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ color: colors.sand, fontSize: 14, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={local.autoStartBreaks}
              onChange={(e) => setLocal({ ...local, autoStartBreaks: e.target.checked })}
              style={{ width: 18, height: 18 }}
            />
            Démarrer automatiquement les pauses
          </label>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ color: colors.sand, fontSize: 14, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={local.autoStartFocus}
              onChange={(e) => setLocal({ ...local, autoStartFocus: e.target.checked })}
              style={{ width: 18, height: 18 }}
            />
            Démarrer automatiquement le focus
          </label>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ color: colors.sand, fontSize: 14, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={local.soundEnabled}
              onChange={(e) => setLocal({ ...local, soundEnabled: e.target.checked })}
              style={{ width: 18, height: 18 }}
            />
            🔔 Sons activés
          </label>
        </div>

        <button
          onClick={handleSave}
          style={{
            width: '100%',
            padding: '12px 20px',
            background: colors.gold,
            border: 'none',
            borderRadius: 10,
            color: colors.dark,
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          💾 Sauvegarder
        </button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const PomodoroTimer: React.FC = () => {
  const [settings, setSettings] = useState<PomodoroSettings>(defaultSettings);
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(settings.focusDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [currentTask, setCurrentTask] = useState('');
  const [sessionLogs, setSessionLogs] = useState<SessionLog[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedAmbient, setSelectedAmbient] = useState<string | null>(null);
  const [focusMode, setFocusMode] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate total duration for current mode
  const getTotalDuration = useCallback(() => {
    switch (mode) {
      case 'focus': return settings.focusDuration * 60;
      case 'shortBreak': return settings.shortBreakDuration * 60;
      case 'longBreak': return settings.longBreakDuration * 60;
    }
  }, [mode, settings]);

  // Progress percentage
  const progress = ((getTotalDuration() - timeLeft) / getTotalDuration()) * 100;

  // Timer tick
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft]);

  // Handle timer completion
  const handleTimerComplete = () => {
    setIsRunning(false);
    
    // Log session
    const newLog: SessionLog = {
      id: Date.now().toString(),
      mode,
      duration: mode === 'focus' ? settings.focusDuration : mode === 'shortBreak' ? settings.shortBreakDuration : settings.longBreakDuration,
      completedAt: new Date(),
      task: mode === 'focus' ? currentTask : undefined,
    };
    setSessionLogs(prev => [newLog, ...prev].slice(0, 50));

    // Play sound
    if (settings.soundEnabled) {
      // Would play sound here
      console.log('🔔 Timer complete!');
    }

    // Update sessions and switch mode
    if (mode === 'focus') {
      const newSessionCount = sessionsCompleted + 1;
      setSessionsCompleted(newSessionCount);
      
      // Determine next break type
      const nextMode = newSessionCount % settings.sessionsBeforeLongBreak === 0 ? 'longBreak' : 'shortBreak';
      setMode(nextMode);
      setTimeLeft(nextMode === 'longBreak' ? settings.longBreakDuration * 60 : settings.shortBreakDuration * 60);
      
      if (settings.autoStartBreaks) {
        setIsRunning(true);
      }
    } else {
      setMode('focus');
      setTimeLeft(settings.focusDuration * 60);
      
      if (settings.autoStartFocus) {
        setIsRunning(true);
      }
    }
  };

  // Mode change
  const handleModeChange = (newMode: TimerMode) => {
    if (isRunning) return;
    setMode(newMode);
    switch (newMode) {
      case 'focus': setTimeLeft(settings.focusDuration * 60); break;
      case 'shortBreak': setTimeLeft(settings.shortBreakDuration * 60); break;
      case 'longBreak': setTimeLeft(settings.longBreakDuration * 60); break;
    }
  };

  // Reset timer
  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(getTotalDuration());
  };

  // Calculate today's stats
  const todayStats = sessionLogs.filter(log => {
    const today = new Date();
    const logDate = new Date(log.completedAt);
    return logDate.toDateString() === today.toDateString();
  });

  const todayFocusSessions = todayStats.filter(l => l.mode === 'focus').length;
  const todayFocusMinutes = todayStats.filter(l => l.mode === 'focus').reduce((sum, l) => sum + l.duration, 0);

  // Focus mode overlay
  if (focusMode && isRunning) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        background: colors.dark,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}>
        <div style={{ position: 'relative', marginBottom: 40 }}>
          <ProgressRing progress={progress} size={350} strokeWidth={10} color={getModeColor(mode)} />
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{ color: getModeColor(mode), fontSize: 14, marginBottom: 8 }}>{getModeLabel(mode)}</div>
            <div style={{ color: colors.sand, fontSize: 72, fontWeight: 700, fontFamily: 'monospace' }}>
              {formatTime(timeLeft)}
            </div>
            {currentTask && <div style={{ color: colors.stone, fontSize: 14, marginTop: 8 }}>📝 {currentTask}</div>}
          </div>
        </div>
        
        <button
          onClick={() => setFocusMode(false)}
          style={{
            padding: '12px 24px',
            background: colors.slate,
            border: `1px solid ${colors.border}`,
            borderRadius: 10,
            color: colors.sand,
            fontSize: 14,
            cursor: 'pointer',
          }}
        >
          Quitter le mode focus
        </button>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.dark,
      color: colors.sand,
      fontFamily: "'Inter', sans-serif",
      padding: 32,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
          🍅 Pomodoro Timer
        </h1>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={() => setFocusMode(true)}
            style={{
              padding: '10px 20px',
              background: `${colors.moss}40`,
              border: `1px solid ${colors.moss}`,
              borderRadius: 10,
              color: colors.emerald,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            🧘 Mode Focus
          </button>
          <button
            onClick={() => setShowSettings(true)}
            style={{
              padding: '10px 20px',
              background: colors.slate,
              border: `1px solid ${colors.border}`,
              borderRadius: 10,
              color: colors.sand,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            ⚙️ Paramètres
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: 32 }}>
        {/* Main Timer */}
        <div style={{
          background: colors.card,
          border: `1px solid ${colors.border}`,
          borderRadius: 20,
          padding: 40,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          {/* Mode Selector */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 40 }}>
            <ModeButton mode="focus" currentMode={mode} onClick={() => handleModeChange('focus')} disabled={isRunning} />
            <ModeButton mode="shortBreak" currentMode={mode} onClick={() => handleModeChange('shortBreak')} disabled={isRunning} />
            <ModeButton mode="longBreak" currentMode={mode} onClick={() => handleModeChange('longBreak')} disabled={isRunning} />
          </div>

          {/* Timer Display */}
          <div style={{ position: 'relative', marginBottom: 40 }}>
            <ProgressRing progress={progress} size={300} strokeWidth={8} color={getModeColor(mode)} />
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <div style={{ color: colors.sand, fontSize: 64, fontWeight: 700, fontFamily: 'monospace' }}>
                {formatTime(timeLeft)}
              </div>
              <div style={{ color: colors.stone, fontSize: 14 }}>
                Session {sessionsCompleted + 1} / {settings.sessionsBeforeLongBreak}
              </div>
            </div>
          </div>

          {/* Task Input */}
          <input
            type="text"
            value={currentTask}
            onChange={(e) => setCurrentTask(e.target.value)}
            placeholder="Sur quoi travaillez-vous?"
            disabled={isRunning}
            style={{
              width: '100%',
              maxWidth: 350,
              padding: '12px 16px',
              background: colors.slate,
              border: `1px solid ${colors.border}`,
              borderRadius: 10,
              color: colors.sand,
              fontSize: 14,
              textAlign: 'center',
              marginBottom: 24,
            }}
          />

          {/* Control Buttons */}
          <div style={{ display: 'flex', gap: 16 }}>
            <button
              onClick={() => setIsRunning(!isRunning)}
              style={{
                padding: '14px 48px',
                background: isRunning ? colors.ember : getModeColor(mode),
                border: 'none',
                borderRadius: 12,
                color: '#fff',
                fontSize: 16,
                fontWeight: 600,
                cursor: 'pointer',
                minWidth: 150,
              }}
            >
              {isRunning ? '⏸️ Pause' : '▶️ Démarrer'}
            </button>
            <button
              onClick={handleReset}
              style={{
                padding: '14px 24px',
                background: colors.slate,
                border: `1px solid ${colors.border}`,
                borderRadius: 12,
                color: colors.sand,
                fontSize: 16,
                cursor: 'pointer',
              }}
            >
              🔄 Reset
            </button>
          </div>

          {/* Ambient Sounds */}
          <div style={{ marginTop: 32, width: '100%', maxWidth: 400 }}>
            <div style={{ color: colors.stone, fontSize: 13, marginBottom: 12, textAlign: 'center' }}>
              🎵 Sons ambiants
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
              {ambientSounds.map(sound => (
                <button
                  key={sound.id}
                  onClick={() => setSelectedAmbient(selectedAmbient === sound.id ? null : sound.id)}
                  style={{
                    padding: '8px 14px',
                    background: selectedAmbient === sound.id ? colors.moss : colors.slate,
                    border: `1px solid ${selectedAmbient === sound.id ? colors.emerald : colors.border}`,
                    borderRadius: 8,
                    color: colors.sand,
                    fontSize: 12,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  {sound.icon} {sound.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar - Stats & History */}
        <div>
          {/* Today's Stats */}
          <div style={{
            background: colors.card,
            border: `1px solid ${colors.border}`,
            borderRadius: 16,
            padding: 20,
            marginBottom: 20,
          }}>
            <h3 style={{ color: colors.sand, fontSize: 16, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              📊 Aujourd'hui
            </h3>
            <div style={{ display: 'flex', gap: 12 }}>
              <StatsCard icon="🎯" label="Sessions" value={todayFocusSessions.toString()} color={colors.red} />
              <StatsCard icon="⏱️" label="Minutes" value={todayFocusMinutes.toString()} color={colors.turquoise} />
            </div>
          </div>

          {/* Session History */}
          <div style={{
            background: colors.card,
            border: `1px solid ${colors.border}`,
            borderRadius: 16,
            padding: 20,
          }}>
            <h3 style={{ color: colors.sand, fontSize: 16, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              📜 Historique
            </h3>
            <div style={{ maxHeight: 400, overflow: 'auto' }}>
              {sessionLogs.length === 0 ? (
                <div style={{ color: colors.stone, textAlign: 'center', padding: 20 }}>
                  Aucune session complétée
                </div>
              ) : (
                sessionLogs.slice(0, 10).map(session => (
                  <SessionItem key={session.id} session={session} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <SettingsPanel
          settings={settings}
          onUpdate={setSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
};

export default PomodoroTimer;
