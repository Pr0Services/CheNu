import React, { useState, useMemo } from 'react';

/**
 * CHE·NU™ V2 - Interactive Progress Tracker
 * Batches B17-B28 - De Construction à Écosystème IA Unifié
 */

// Design Tokens CHE·NU™
const T = {
  bg: { main: '#1A1A1A', card: '#242424', hover: '#2E2E2E' },
  text: { primary: '#E8E4DC', secondary: '#A09080', muted: '#6B6560' },
  border: '#333333',
  accent: { 
    gold: '#D8B26A', 
    emerald: '#3F7249', 
    turquoise: '#3EB4A2',
    purple: '#8B5CF6',
    amber: '#F59E0B',
    danger: '#EF4444'
  }
};

// Données complètes V2
const V2_DATA = {
  phases: [
    {
      id: 7,
      name: 'Fondations V2',
      icon: '🧠',
      batches: [
        {
          id: 'B17',
          name: 'CHE·Learn + Orchestrateur V2',
          status: 'todo',
          modules: [
            { name: 'CHE·Learn Core', lines: 600, status: 'todo', priority: 'high' },
            { name: 'Learning Events API', lines: 400, status: 'todo', priority: 'high' },
            { name: 'Agent Rules System', lines: 450, status: 'todo', priority: 'high' },
            { name: 'Orchestrator V2', lines: 500, status: 'todo', priority: 'high' }
          ]
        },
        {
          id: 'B18',
          name: 'Design System V2 + Navigation',
          status: 'todo',
          modules: [
            { name: 'Design Tokens V2', lines: 300, status: 'todo', priority: 'high' },
            { name: 'UI Kit Extended', lines: 800, status: 'todo', priority: 'high' },
            { name: 'Space Navigator', lines: 500, status: 'todo', priority: 'high' },
            { name: 'Breadcrumbs Dynamic', lines: 250, status: 'todo', priority: 'med' },
            { name: 'States System', lines: 300, status: 'todo', priority: 'high' }
          ]
        }
      ]
    },
    {
      id: 8,
      name: 'Plateformes Sociales',
      icon: '🌐',
      batches: [
        {
          id: 'B19',
          name: 'Réseau Social',
          status: 'todo',
          modules: [
            { name: 'Social Feed API', lines: 600, status: 'todo', priority: 'high' },
            { name: 'PostCard Component', lines: 350, status: 'todo', priority: 'high' },
            { name: 'FeedList Virtualized', lines: 400, status: 'todo', priority: 'high' },
            { name: 'Post Creator', lines: 350, status: 'todo', priority: 'high' },
            { name: 'Reactions System', lines: 300, status: 'todo', priority: 'med' },
            { name: 'Trending/Hashtags', lines: 300, status: 'todo', priority: 'med' }
          ]
        },
        {
          id: 'B20',
          name: 'Forum Style Reddit',
          status: 'todo',
          modules: [
            { name: 'Forum API', lines: 550, status: 'todo', priority: 'high' },
            { name: 'ThreadCard', lines: 300, status: 'todo', priority: 'high' },
            { name: 'ThreadPage', lines: 450, status: 'todo', priority: 'high' },
            { name: 'Vote System', lines: 250, status: 'todo', priority: 'high' },
            { name: 'Sorting Algorithms', lines: 200, status: 'todo', priority: 'med' },
            { name: 'Subforum Manager', lines: 300, status: 'todo', priority: 'med' },
            { name: 'Flair System', lines: 200, status: 'todo', priority: 'low' }
          ]
        }
      ]
    },
    {
      id: 9,
      name: 'Streaming & Creative',
      icon: '🎬',
      batches: [
        {
          id: 'B21',
          name: 'Plateforme Streaming',
          status: 'todo',
          modules: [
            { name: 'Streaming API', lines: 700, status: 'todo', priority: 'high' },
            { name: 'Video Player', lines: 500, status: 'todo', priority: 'high' },
            { name: 'Mini Player', lines: 250, status: 'todo', priority: 'med' },
            { name: 'Chapters AI', lines: 350, status: 'todo', priority: 'med' },
            { name: 'Creator Studio', lines: 450, status: 'todo', priority: 'high' },
            { name: 'Recommendations', lines: 300, status: 'todo', priority: 'med' }
          ]
        },
        {
          id: 'B22',
          name: 'Creative Studio Global',
          status: 'todo',
          modules: [
            { name: 'Creative Studio Core', lines: 500, status: 'todo', priority: 'high' },
            { name: 'Asset Manager', lines: 450, status: 'todo', priority: 'high' },
            { name: 'Template Engine', lines: 400, status: 'todo', priority: 'med' },
            { name: 'Brand Kit Manager', lines: 350, status: 'todo', priority: 'med' },
            { name: 'Export System', lines: 300, status: 'todo', priority: 'high' },
            { name: 'Creative Agents', lines: 400, status: 'todo', priority: 'med' }
          ]
        }
      ]
    },
    {
      id: 10,
      name: 'Agents & APIs V2',
      icon: '🤖',
      batches: [
        {
          id: 'B23',
          name: 'Agents Avancés',
          status: 'todo',
          modules: [
            { name: 'Agent Guide', lines: 400, status: 'todo', priority: 'high' },
            { name: 'Agent Architecte UI', lines: 450, status: 'todo', priority: 'med' },
            { name: 'Agent Scribe', lines: 350, status: 'todo', priority: 'med' },
            { name: 'Agent Vision', lines: 500, status: 'todo', priority: 'high' },
            { name: 'Agent UX Reviewer', lines: 350, status: 'todo', priority: 'med' },
            { name: 'Agent Code Refactor', lines: 300, status: 'todo', priority: 'low' }
          ]
        },
        {
          id: 'B24',
          name: 'APIs V2 Advanced',
          status: 'todo',
          modules: [
            { name: 'Knowledge Map API', lines: 450, status: 'todo', priority: 'med' },
            { name: 'Personality V2 API', lines: 400, status: 'todo', priority: 'high' },
            { name: 'Workflows IA API', lines: 500, status: 'todo', priority: 'high' },
            { name: 'Historical Memory API', lines: 400, status: 'todo', priority: 'med' },
            { name: 'Predictive Roadmap API', lines: 350, status: 'todo', priority: 'med' }
          ]
        }
      ]
    },
    {
      id: 11,
      name: 'Espaces Spécialisés',
      icon: '🏛️',
      batches: [
        {
          id: 'B25',
          name: 'Gouvernement + Immobilier',
          status: 'todo',
          modules: [
            { name: 'Gouvernement Core', lines: 500, status: 'todo', priority: 'high' },
            { name: 'Tax Manager', lines: 450, status: 'todo', priority: 'high' },
            { name: 'Permit Tracker', lines: 350, status: 'todo', priority: 'med' },
            { name: 'Immobilier Core', lines: 450, status: 'todo', priority: 'high' },
            { name: 'Property Analytics', lines: 400, status: 'todo', priority: 'med' },
            { name: 'Contract Manager', lines: 350, status: 'todo', priority: 'med' }
          ]
        },
        {
          id: 'B26',
          name: 'Associations + Collaboration',
          status: 'todo',
          modules: [
            { name: 'Associations Core', lines: 400, status: 'todo', priority: 'med' },
            { name: 'Membership Manager', lines: 350, status: 'todo', priority: 'med' },
            { name: 'Group Communications', lines: 350, status: 'todo', priority: 'med' },
            { name: 'Real-time Collab', lines: 500, status: 'todo', priority: 'high' },
            { name: 'Advanced Permissions', lines: 400, status: 'todo', priority: 'high' },
            { name: 'Audit Logging', lines: 300, status: 'todo', priority: 'med' }
          ]
        }
      ]
    },
    {
      id: 12,
      name: 'Polish & Scale',
      icon: '✨',
      batches: [
        {
          id: 'B27',
          name: '3D & Effets Avancés',
          status: 'todo',
          modules: [
            { name: 'Three.js Engine', lines: 600, status: 'todo', priority: 'med' },
            { name: '3D Avatars', lines: 400, status: 'todo', priority: 'low' },
            { name: 'Temple Effects', lines: 350, status: 'todo', priority: 'low' },
            { name: 'Sound Effects', lines: 200, status: 'todo', priority: 'low' },
            { name: 'Micro-interactions', lines: 300, status: 'todo', priority: 'med' }
          ]
        },
        {
          id: 'B28',
          name: 'Scale & Performance',
          status: 'todo',
          modules: [
            { name: 'Virtual Scrolling', lines: 300, status: 'todo', priority: 'high' },
            { name: 'Cache System', lines: 350, status: 'todo', priority: 'high' },
            { name: 'CDN Integration', lines: 250, status: 'todo', priority: 'med' },
            { name: 'Micro-services', lines: 400, status: 'todo', priority: 'med' },
            { name: 'Load Testing', lines: 300, status: 'todo', priority: 'med' }
          ]
        }
      ]
    }
  ]
};

// Status colors
const statusColors = {
  done: T.accent.emerald,
  wip: T.accent.amber,
  todo: T.text.muted
};

const priorityColors = {
  high: T.accent.danger,
  med: T.accent.amber,
  low: T.accent.turquoise
};

// Components
const ProgressBar = ({ value, max, color = T.accent.gold }) => (
  <div style={{
    width: '100%',
    height: 8,
    background: T.bg.card,
    borderRadius: 4,
    overflow: 'hidden'
  }}>
    <div style={{
      width: `${(value / max) * 100}%`,
      height: '100%',
      background: color,
      transition: 'width 0.3s ease'
    }} />
  </div>
);

const StatusBadge = ({ status }) => (
  <span style={{
    padding: '2px 8px',
    borderRadius: 4,
    fontSize: 11,
    fontWeight: 600,
    textTransform: 'uppercase',
    background: statusColors[status] + '20',
    color: statusColors[status]
  }}>
    {status === 'done' ? '✅ DONE' : status === 'wip' ? '🔄 WIP' : '⬜ TODO'}
  </span>
);

const PriorityDot = ({ priority }) => (
  <span style={{
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: priorityColors[priority],
    display: 'inline-block',
    marginRight: 6
  }} />
);

const ModuleRow = ({ module, onToggle }) => (
  <div 
    onClick={() => onToggle(module.name)}
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '8px 12px',
      background: module.status === 'done' ? T.accent.emerald + '10' : 'transparent',
      borderRadius: 6,
      cursor: 'pointer',
      transition: 'background 0.15s'
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <PriorityDot priority={module.priority} />
      <span style={{ 
        color: module.status === 'done' ? T.accent.emerald : T.text.primary,
        textDecoration: module.status === 'done' ? 'line-through' : 'none'
      }}>
        {module.name}
      </span>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{ color: T.text.muted, fontSize: 12 }}>{module.lines} lignes</span>
      <StatusBadge status={module.status} />
    </div>
  </div>
);

const BatchCard = ({ batch, expanded, onToggle, onModuleToggle }) => {
  const doneModules = batch.modules.filter(m => m.status === 'done').length;
  const totalLines = batch.modules.reduce((sum, m) => sum + m.lines, 0);
  const doneLines = batch.modules.filter(m => m.status === 'done').reduce((sum, m) => sum + m.lines, 0);
  
  return (
    <div style={{
      background: T.bg.card,
      borderRadius: 12,
      border: `1px solid ${batch.status === 'done' ? T.accent.emerald : T.border}`,
      overflow: 'hidden',
      marginBottom: 12
    }}>
      <div 
        onClick={onToggle}
        style={{
          padding: 16,
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <span style={{ 
              color: T.accent.gold, 
              fontWeight: 700,
              fontSize: 14
            }}>
              {batch.id}
            </span>
            <span style={{ color: T.text.primary, fontWeight: 600 }}>{batch.name}</span>
            <StatusBadge status={batch.status} />
          </div>
          <div style={{ color: T.text.muted, fontSize: 12 }}>
            {doneModules}/{batch.modules.length} modules • {doneLines.toLocaleString()}/{totalLines.toLocaleString()} lignes
          </div>
        </div>
        <span style={{ color: T.text.muted, fontSize: 18 }}>{expanded ? '▼' : '▶'}</span>
      </div>
      
      {expanded && (
        <div style={{ padding: '0 16px 16px', borderTop: `1px solid ${T.border}` }}>
          <div style={{ paddingTop: 12 }}>
            <ProgressBar value={doneModules} max={batch.modules.length} />
          </div>
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {batch.modules.map(module => (
              <ModuleRow 
                key={module.name} 
                module={module} 
                onToggle={(name) => onModuleToggle(batch.id, name)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const PhaseSection = ({ phase, expandedBatches, onBatchToggle, onModuleToggle }) => {
  const allModules = phase.batches.flatMap(b => b.modules);
  const doneModules = allModules.filter(m => m.status === 'done').length;
  const totalLines = allModules.reduce((sum, m) => sum + m.lines, 0);
  
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 12, 
        marginBottom: 16,
        padding: '12px 16px',
        background: T.bg.card,
        borderRadius: 8,
        borderLeft: `4px solid ${T.accent.gold}`
      }}>
        <span style={{ fontSize: 24 }}>{phase.icon}</span>
        <div>
          <div style={{ color: T.text.primary, fontWeight: 700 }}>
            Phase {phase.id}: {phase.name}
          </div>
          <div style={{ color: T.text.muted, fontSize: 12 }}>
            {doneModules}/{allModules.length} modules • ~{totalLines.toLocaleString()} lignes
          </div>
        </div>
        <div style={{ marginLeft: 'auto', width: 120 }}>
          <ProgressBar value={doneModules} max={allModules.length} />
        </div>
      </div>
      
      {phase.batches.map(batch => (
        <BatchCard
          key={batch.id}
          batch={batch}
          expanded={expandedBatches.includes(batch.id)}
          onToggle={() => onBatchToggle(batch.id)}
          onModuleToggle={onModuleToggle}
        />
      ))}
    </div>
  );
};

// Main App
export default function ChenuV2Tracker() {
  const [data, setData] = useState(V2_DATA);
  const [expandedBatches, setExpandedBatches] = useState(['B17']);
  const [filter, setFilter] = useState('all');
  
  // Stats
  const stats = useMemo(() => {
    const allModules = data.phases.flatMap(p => p.batches.flatMap(b => b.modules));
    const done = allModules.filter(m => m.status === 'done');
    const wip = allModules.filter(m => m.status === 'wip');
    const totalLines = allModules.reduce((sum, m) => sum + m.lines, 0);
    const doneLines = done.reduce((sum, m) => sum + m.lines, 0);
    
    return {
      totalModules: allModules.length,
      doneModules: done.length,
      wipModules: wip.length,
      totalLines,
      doneLines,
      progress: Math.round((done.length / allModules.length) * 100)
    };
  }, [data]);
  
  const toggleBatch = (batchId) => {
    setExpandedBatches(prev => 
      prev.includes(batchId) 
        ? prev.filter(id => id !== batchId)
        : [...prev, batchId]
    );
  };
  
  const toggleModule = (batchId, moduleName) => {
    setData(prev => ({
      ...prev,
      phases: prev.phases.map(phase => ({
        ...phase,
        batches: phase.batches.map(batch => {
          if (batch.id !== batchId) return batch;
          
          const updatedModules = batch.modules.map(module => {
            if (module.name !== moduleName) return module;
            const nextStatus = module.status === 'todo' ? 'wip' : module.status === 'wip' ? 'done' : 'todo';
            return { ...module, status: nextStatus };
          });
          
          const allDone = updatedModules.every(m => m.status === 'done');
          const anyWip = updatedModules.some(m => m.status === 'wip');
          
          return {
            ...batch,
            modules: updatedModules,
            status: allDone ? 'done' : anyWip ? 'wip' : 'todo'
          };
        })
      }))
    }));
  };
  
  return (
    <div style={{
      minHeight: '100vh',
      background: T.bg.main,
      color: T.text.primary,
      fontFamily: 'Inter, system-ui, sans-serif',
      padding: 24
    }}>
      {/* Header */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: 32,
        padding: 24,
        background: `linear-gradient(135deg, ${T.bg.card} 0%, ${T.bg.main} 100%)`,
        borderRadius: 16,
        border: `1px solid ${T.accent.gold}40`
      }}>
        <h1 style={{ 
          color: T.accent.gold, 
          fontSize: 32, 
          marginBottom: 8,
          fontWeight: 700,
          letterSpacing: '-0.5px'
        }}>
          CHE·NU™ V2 Progress Tracker
        </h1>
        <p style={{ color: T.text.secondary, marginBottom: 16 }}>
          De Construction à Écosystème IA Unifié • Batches B17-B28
        </p>
        
        {/* Progress Overview */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 16,
          marginTop: 24
        }}>
          {[
            { label: 'Progression', value: `${stats.progress}%`, color: T.accent.gold },
            { label: 'Modules', value: `${stats.doneModules}/${stats.totalModules}`, color: T.accent.emerald },
            { label: 'En cours', value: stats.wipModules, color: T.accent.amber },
            { label: 'Lignes', value: `~${stats.totalLines.toLocaleString()}`, color: T.accent.turquoise }
          ].map(stat => (
            <div key={stat.label} style={{
              background: T.bg.card,
              padding: 16,
              borderRadius: 12,
              border: `1px solid ${T.border}`
            }}>
              <div style={{ color: stat.color, fontSize: 24, fontWeight: 700 }}>
                {stat.value}
              </div>
              <div style={{ color: T.text.muted, fontSize: 12, marginTop: 4 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
        
        {/* Global Progress Bar */}
        <div style={{ marginTop: 24 }}>
          <ProgressBar value={stats.doneModules} max={stats.totalModules} />
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginTop: 8,
            color: T.text.muted,
            fontSize: 12
          }}>
            <span>V1 Complete: ~32,400 lignes</span>
            <span>V2 Target: ~26,300 lignes</span>
            <span>Total: ~58,700 lignes</span>
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div style={{
        display: 'flex',
        gap: 16,
        marginBottom: 24,
        padding: 12,
        background: T.bg.card,
        borderRadius: 8,
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <span style={{ color: T.text.muted, fontSize: 12 }}>Priorité:</span>
        <span style={{ fontSize: 12, display: 'flex', alignItems: 'center' }}>
          <PriorityDot priority="high" /> HIGH
        </span>
        <span style={{ fontSize: 12, display: 'flex', alignItems: 'center' }}>
          <PriorityDot priority="med" /> MED
        </span>
        <span style={{ fontSize: 12, display: 'flex', alignItems: 'center' }}>
          <PriorityDot priority="low" /> LOW
        </span>
        <span style={{ color: T.border }}>|</span>
        <span style={{ color: T.text.muted, fontSize: 12 }}>Cliquer module = changer status</span>
      </div>
      
      {/* Phases */}
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {data.phases.map(phase => (
          <PhaseSection
            key={phase.id}
            phase={phase}
            expandedBatches={expandedBatches}
            onBatchToggle={toggleBatch}
            onModuleToggle={toggleModule}
          />
        ))}
      </div>
      
      {/* Footer */}
      <div style={{
        textAlign: 'center',
        padding: 24,
        marginTop: 32,
        borderTop: `1px solid ${T.border}`,
        color: T.text.muted,
        fontSize: 12
      }}>
        <p>CHE·NU™ V2 • 12 Batches • 69 Modules • ~26,300 lignes</p>
        <p style={{ marginTop: 4, color: T.accent.gold }}>
          🏛️ De la construction à l'écosystème IA unifié
        </p>
      </div>
    </div>
  );
}
