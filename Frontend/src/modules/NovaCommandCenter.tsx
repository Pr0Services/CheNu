/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║              CHE·NU V25 - NOVA COMMAND CENTER                                ║
 * ║              🚀 CLAUDE'S SIGNATURE PIECE 🚀                                  ║
 * ║              AI Mission Control - The Brain of CHE·NU                        ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * This is the central nervous system of CHE·NU - a real-time mission control
 * dashboard that monitors all AI agents, workflows, system health, and provides
 * a stunning visual representation of the entire platform's intelligence layer.
 * 
 * Features:
 * - Real-time AI agent monitoring with neural network visualization
 * - Live system pulse with heartbeat animation
 * - Mission briefings & active operations tracker
 * - Anomaly detection radar
 * - Performance metrics constellation
 * - Voice command interface
 * - Emergency protocols
 * - Time-travel audit log
 */

import React, { useState, useEffect, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS - COMMAND CENTER THEME
// ═══════════════════════════════════════════════════════════════════════════════

const colors = {
  // Core palette
  void: '#0a0a0f',
  deepSpace: '#12121a',
  nebula: '#1a1a2e',
  stardust: '#252538',
  
  // Accent colors
  novaGold: '#D8B26A',
  plasmaCyan: '#00d4ff',
  quantumGreen: '#00ff88',
  alertRed: '#ff4757',
  warningOrange: '#ffa502',
  cosmicPurple: '#a855f7',
  
  // Text
  starlight: '#ffffff',
  moonlight: '#e0e0e0',
  asteroid: '#888899'
};

// ═══════════════════════════════════════════════════════════════════════════════
// NEURAL NETWORK VISUALIZATION
// ═══════════════════════════════════════════════════════════════════════════════

const NeuralNetwork = () => {
  const [pulsePhase, setPulsePhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setPulsePhase(p => (p + 1) % 360), 50);
    return () => clearInterval(interval);
  }, []);

  const nodes = [
    { x: 150, y: 100, label: 'NOVA', type: 'core', status: 'active' },
    { x: 80, y: 180, label: 'Vision', type: 'module', status: 'active' },
    { x: 220, y: 180, label: 'Language', type: 'module', status: 'active' },
    { x: 50, y: 260, label: 'Memory', type: 'sub', status: 'processing' },
    { x: 150, y: 260, label: 'Reasoning', type: 'sub', status: 'active' },
    { x: 250, y: 260, label: 'Learning', type: 'sub', status: 'idle' }
  ];

  const connections = [
    [0, 1], [0, 2], [1, 3], [1, 4], [2, 4], [2, 5], [3, 4], [4, 5]
  ];

  return (
    <svg width="300" height="320" style={{ overflow: 'visible' }}>
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={colors.plasmaCyan} stopOpacity="0.2"/>
          <stop offset={`${(pulsePhase % 100)}%`} stopColor={colors.plasmaCyan} stopOpacity="1"/>
          <stop offset="100%" stopColor={colors.plasmaCyan} stopOpacity="0.2"/>
        </linearGradient>
      </defs>

      {/* Connections */}
      {connections.map(([from, to], i) => (
        <line
          key={i}
          x1={nodes[from].x} y1={nodes[from].y}
          x2={nodes[to].x} y2={nodes[to].y}
          stroke="url(#connectionGradient)"
          strokeWidth="2"
          opacity="0.6"
        />
      ))}

      {/* Nodes */}
      {nodes.map((node, i) => {
        const size = node.type === 'core' ? 40 : node.type === 'module' ? 30 : 22;
        const color = node.status === 'active' ? colors.quantumGreen : node.status === 'processing' ? colors.warningOrange : colors.asteroid;
        
        return (
          <g key={i} filter="url(#glow)">
            <circle cx={node.x} cy={node.y} r={size} fill={colors.deepSpace} stroke={color} strokeWidth="2"/>
            {node.type === 'core' && (
              <circle cx={node.x} cy={node.y} r={size + 8} fill="none" stroke={colors.novaGold} strokeWidth="1" opacity="0.5" strokeDasharray="4 4">
                <animateTransform attributeName="transform" type="rotate" from={`0 ${node.x} ${node.y}`} to={`360 ${node.x} ${node.y}`} dur="10s" repeatCount="indefinite"/>
              </circle>
            )}
            <text x={node.x} y={node.y + 4} textAnchor="middle" fill={colors.starlight} fontSize={node.type === 'core' ? 12 : 9} fontWeight="bold">{node.label}</text>
          </g>
        );
      })}
    </svg>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SYSTEM PULSE MONITOR
// ═══════════════════════════════════════════════════════════════════════════════

const SystemPulse = () => {
  const [points, setPoints] = useState<number[]>([50, 50, 50, 50, 50, 50, 50, 50, 50, 50]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPoints(prev => {
        const newPoints = [...prev.slice(1)];
        const spike = Math.random() > 0.7;
        newPoints.push(spike ? 20 + Math.random() * 60 : 45 + Math.random() * 10);
        return newPoints;
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const pathD = `M 0 ${100 - points[0]} ` + points.map((p, i) => `L ${i * 30} ${100 - p}`).join(' ');

  return (
    <div style={{ background: colors.deepSpace, borderRadius: 12, padding: 16, border: `1px solid ${colors.stardust}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ color: colors.moonlight, fontSize: 12, fontWeight: 600 }}>💓 SYSTEM PULSE</span>
        <span style={{ color: colors.quantumGreen, fontSize: 12 }}>● NOMINAL</span>
      </div>
      <svg width="100%" height="100" style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="pulseGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.quantumGreen} stopOpacity="0.5"/>
            <stop offset="100%" stopColor={colors.quantumGreen} stopOpacity="0"/>
          </linearGradient>
        </defs>
        <path d={pathD + ` L 270 100 L 0 100 Z`} fill="url(#pulseGradient)"/>
        <path d={pathD} fill="none" stroke={colors.quantumGreen} strokeWidth="2"/>
        <circle cx="270" cy={100 - points[points.length - 1]} r="4" fill={colors.quantumGreen}>
          <animate attributeName="r" values="4;6;4" dur="1s" repeatCount="indefinite"/>
        </circle>
      </svg>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MISSION CARD
// ═══════════════════════════════════════════════════════════════════════════════

const MissionCard = ({ mission }: { mission: any }) => {
  const priorityColors: Record<string, string> = {
    critical: colors.alertRed,
    high: colors.warningOrange,
    medium: colors.plasmaCyan,
    low: colors.asteroid
  };

  return (
    <div style={{
      background: `linear-gradient(135deg, ${colors.nebula}, ${colors.deepSpace})`,
      border: `1px solid ${priorityColors[mission.priority]}40`,
      borderLeft: `4px solid ${priorityColors[mission.priority]}`,
      borderRadius: 12, padding: 16, marginBottom: 12
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ color: colors.starlight, fontWeight: 600, fontSize: 14 }}>{mission.code}</span>
        <span style={{ color: priorityColors[mission.priority], fontSize: 11, textTransform: 'uppercase' }}>{mission.priority}</span>
      </div>
      <p style={{ color: colors.moonlight, fontSize: 13, margin: '0 0 12px', lineHeight: 1.4 }}>{mission.description}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {mission.agents.map((agent: string, i: number) => (
            <span key={i} style={{ background: colors.stardust, color: colors.plasmaCyan, padding: '3px 8px', borderRadius: 6, fontSize: 10 }}>🤖 {agent}</span>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 60, height: 4, background: colors.stardust, borderRadius: 2 }}>
            <div style={{ width: `${mission.progress}%`, height: '100%', background: colors.quantumGreen, borderRadius: 2 }} />
          </div>
          <span style={{ color: colors.quantumGreen, fontSize: 11 }}>{mission.progress}%</span>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ANOMALY RADAR
// ═══════════════════════════════════════════════════════════════════════════════

const AnomalyRadar = () => {
  const [rotation, setRotation] = useState(0);
  const [blips, setBlips] = useState([
    { angle: 45, distance: 60, type: 'warning' },
    { angle: 180, distance: 40, type: 'info' },
    { angle: 270, distance: 80, type: 'critical' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => setRotation(r => (r + 2) % 360), 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ background: colors.deepSpace, borderRadius: 12, padding: 16, border: `1px solid ${colors.stardust}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ color: colors.moonlight, fontSize: 12, fontWeight: 600 }}>🛡️ ANOMALY RADAR</span>
        <span style={{ color: colors.warningOrange, fontSize: 12 }}>3 détectées</span>
      </div>
      <svg width="200" height="200" viewBox="-100 -100 200 200" style={{ display: 'block', margin: '0 auto' }}>
        {/* Grid circles */}
        {[30, 60, 90].map(r => <circle key={r} cx="0" cy="0" r={r} fill="none" stroke={colors.stardust} strokeWidth="1" opacity="0.3"/>)}
        
        {/* Cross lines */}
        <line x1="-90" y1="0" x2="90" y2="0" stroke={colors.stardust} strokeWidth="1" opacity="0.3"/>
        <line x1="0" y1="-90" x2="0" y2="90" stroke={colors.stardust} strokeWidth="1" opacity="0.3"/>
        
        {/* Sweep */}
        <g transform={`rotate(${rotation})`}>
          <line x1="0" y1="0" x2="0" y2="-90" stroke={colors.quantumGreen} strokeWidth="2" opacity="0.8"/>
          <path d="M 0 0 L 15 -90 A 90 90 0 0 0 -15 -90 Z" fill={colors.quantumGreen} opacity="0.2"/>
        </g>
        
        {/* Blips */}
        {blips.map((blip, i) => {
          const x = Math.cos((blip.angle - 90) * Math.PI / 180) * blip.distance;
          const y = Math.sin((blip.angle - 90) * Math.PI / 180) * blip.distance;
          const color = blip.type === 'critical' ? colors.alertRed : blip.type === 'warning' ? colors.warningOrange : colors.plasmaCyan;
          return (
            <circle key={i} cx={x} cy={y} r="5" fill={color}>
              <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite"/>
            </circle>
          );
        })}
      </svg>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// STATS CONSTELLATION
// ═══════════════════════════════════════════════════════════════════════════════

const StatsConstellation = () => {
  const stats = [
    { label: 'Requêtes/min', value: '2,847', trend: '+12%', icon: '⚡' },
    { label: 'Agents actifs', value: '24/28', trend: '86%', icon: '🤖' },
    { label: 'Temps réponse', value: '0.23s', trend: '-8%', icon: '⏱️' },
    { label: 'Précision IA', value: '97.8%', trend: '+0.3%', icon: '🎯' },
    { label: 'Mémoire', value: '12.4 GB', trend: '62%', icon: '💾' },
    { label: 'Uptime', value: '99.99%', trend: '30j', icon: '🔋' }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
      {stats.map((stat, i) => (
        <div key={i} style={{
          background: `linear-gradient(135deg, ${colors.nebula}, ${colors.deepSpace})`,
          border: `1px solid ${colors.stardust}`,
          borderRadius: 12, padding: 16, textAlign: 'center'
        }}>
          <span style={{ fontSize: 24 }}>{stat.icon}</span>
          <div style={{ color: colors.starlight, fontSize: 20, fontWeight: 700, margin: '8px 0 4px' }}>{stat.value}</div>
          <div style={{ color: colors.asteroid, fontSize: 11 }}>{stat.label}</div>
          <div style={{ color: stat.trend.startsWith('+') || stat.trend.startsWith('-') ? (stat.trend.startsWith('+') ? colors.quantumGreen : colors.alertRed) : colors.plasmaCyan, fontSize: 11, marginTop: 4 }}>{stat.trend}</div>
        </div>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// VOICE COMMAND
// ═══════════════════════════════════════════════════════════════════════════════

const VoiceCommand = () => {
  const [isListening, setIsListening] = useState(false);
  const [command, setCommand] = useState('');

  return (
    <div style={{
      background: `linear-gradient(135deg, ${colors.cosmicPurple}20, ${colors.deepSpace})`,
      border: `1px solid ${colors.cosmicPurple}40`,
      borderRadius: 16, padding: 20
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          onClick={() => setIsListening(!isListening)}
          style={{
            width: 56, height: 56, borderRadius: '50%',
            background: isListening ? colors.alertRed : colors.cosmicPurple,
            border: 'none', cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: 24,
            boxShadow: isListening ? `0 0 20px ${colors.alertRed}` : 'none'
          }}
        >
          {isListening ? '⏹️' : '🎙️'}
        </button>
        <div style={{ flex: 1 }}>
          <input
            value={command}
            onChange={e => setCommand(e.target.value)}
            placeholder={isListening ? "J'écoute..." : "Commande vocale ou texte..."}
            style={{
              width: '100%', padding: 14, background: colors.nebula,
              border: `1px solid ${isListening ? colors.cosmicPurple : colors.stardust}`,
              borderRadius: 10, color: colors.starlight, fontSize: 14
            }}
          />
        </div>
        <button style={{ padding: '14px 24px', background: colors.novaGold, border: 'none', borderRadius: 10, color: colors.void, fontWeight: 600, cursor: 'pointer' }}>
          Exécuter
        </button>
      </div>
      {isListening && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginTop: 16 }}>
          {[...Array(12)].map((_, i) => (
            <div key={i} style={{
              width: 4, height: 20 + Math.random() * 20,
              background: colors.cosmicPurple, borderRadius: 2,
              animation: 'pulse 0.5s ease-in-out infinite',
              animationDelay: `${i * 0.1}s`
            }} />
          ))}
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// EMERGENCY PROTOCOLS
// ═══════════════════════════════════════════════════════════════════════════════

const EmergencyProtocols = () => {
  const protocols = [
    { code: 'ALPHA', name: 'Pause tous agents', icon: '⏸️', status: 'ready' },
    { code: 'BETA', name: 'Mode maintenance', icon: '🔧', status: 'ready' },
    { code: 'GAMMA', name: 'Rollback système', icon: '⏪', status: 'ready' },
    { code: 'OMEGA', name: 'Arrêt d\'urgence', icon: '🛑', status: 'armed' }
  ];

  return (
    <div style={{ background: colors.deepSpace, border: `1px solid ${colors.alertRed}30`, borderRadius: 12, padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <span style={{ color: colors.alertRed, fontSize: 16 }}>⚠️</span>
        <span style={{ color: colors.alertRed, fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>EMERGENCY PROTOCOLS</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
        {protocols.map(protocol => (
          <button key={protocol.code} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: 12,
            background: protocol.status === 'armed' ? `${colors.alertRed}20` : colors.nebula,
            border: `1px solid ${protocol.status === 'armed' ? colors.alertRed : colors.stardust}`,
            borderRadius: 8, cursor: 'pointer', textAlign: 'left'
          }}>
            <span style={{ fontSize: 20 }}>{protocol.icon}</span>
            <div>
              <div style={{ color: colors.starlight, fontSize: 11, fontWeight: 600 }}>{protocol.code}</div>
              <div style={{ color: colors.asteroid, fontSize: 10 }}>{protocol.name}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMMAND CENTER
// ═══════════════════════════════════════════════════════════════════════════════

export default function NovaCommandCenter() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const missions = [
    { code: 'MISSION-001', description: 'Analyse automatique des documents du projet Laval', priority: 'high', agents: ['DocAnalyzer', 'Extractor'], progress: 78 },
    { code: 'MISSION-002', description: 'Génération du rapport financier mensuel', priority: 'medium', agents: ['FinanceBot', 'Reporter'], progress: 45 },
    { code: 'MISSION-003', description: 'Détection d\'anomalies dans les factures', priority: 'critical', agents: ['AuditAI'], progress: 92 }
  ];

  return (
    <div style={{ minHeight: '100vh', background: colors.void, padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: `linear-gradient(135deg, ${colors.novaGold}, ${colors.cosmicPurple})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28
          }}>🚀</div>
          <div>
            <h1 style={{ color: colors.starlight, fontSize: 28, fontWeight: 700, margin: 0, letterSpacing: -1 }}>
              NOVA <span style={{ color: colors.novaGold }}>COMMAND CENTER</span>
            </h1>
            <p style={{ color: colors.asteroid, margin: '4px 0 0', fontSize: 13 }}>
              Mission Control · AI Operations · System Intelligence
            </p>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: colors.plasmaCyan, fontSize: 24, fontFamily: 'monospace', fontWeight: 700 }}>
            {currentTime.toLocaleTimeString()}
          </div>
          <div style={{ color: colors.asteroid, fontSize: 12 }}>
            {currentTime.toLocaleDateString('fr-CA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr 320px', gap: 24 }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: colors.deepSpace, borderRadius: 16, padding: 20, border: `1px solid ${colors.stardust}` }}>
            <h3 style={{ color: colors.moonlight, margin: '0 0 16px', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              🧠 NEURAL NETWORK
            </h3>
            <NeuralNetwork />
          </div>
          <AnomalyRadar />
          <EmergencyProtocols />
        </div>

        {/* Center Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <VoiceCommand />
          <StatsConstellation />
          <div style={{ background: colors.deepSpace, borderRadius: 16, padding: 20, border: `1px solid ${colors.stardust}`, flex: 1 }}>
            <h3 style={{ color: colors.moonlight, margin: '0 0 16px', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              🎯 ACTIVE MISSIONS
            </h3>
            {missions.map(mission => <MissionCard key={mission.code} mission={mission} />)}
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <SystemPulse />
          <div style={{ background: colors.deepSpace, borderRadius: 16, padding: 20, border: `1px solid ${colors.stardust}`, flex: 1 }}>
            <h3 style={{ color: colors.moonlight, margin: '0 0 16px', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              📜 ACTIVITY LOG
            </h3>
            {[
              { time: '14:32:45', event: 'Mission-001 progression: 78%', type: 'info' },
              { time: '14:31:22', event: 'Agent AuditAI: anomalie détectée', type: 'warning' },
              { time: '14:30:01', event: 'Nouveau document uploadé', type: 'info' },
              { time: '14:28:55', event: 'Backup automatique complété', type: 'success' },
              { time: '14:25:33', event: 'Agent DocAnalyzer: démarré', type: 'info' }
            ].map((log, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: i < 4 ? `1px solid ${colors.stardust}` : 'none' }}>
                <span style={{ color: colors.asteroid, fontSize: 11, fontFamily: 'monospace' }}>{log.time}</span>
                <span style={{
                  color: log.type === 'warning' ? colors.warningOrange : log.type === 'success' ? colors.quantumGreen : colors.moonlight,
                  fontSize: 12
                }}>{log.event}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CSS Keyframes */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scaleY(1); }
          50% { opacity: 0.5; transform: scaleY(0.5); }
        }
      `}</style>
    </div>
  );
}
