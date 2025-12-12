/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║              CHE·NU V25 - DATABASE MANAGER                                   ║
 * ║              Connections, Queries, Backups & Data Explorer                   ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from 'react';

const colors = {
  gold: '#D8B26A', goldDark: '#B89040', stone: '#8D8371', emerald: '#3F7249',
  turquoise: '#3EB4A2', moss: '#2F4C39', slate: '#1E1F22', card: '#242424',
  sand: '#E9E4D6', border: '#2A2A2A',
  postgres: '#336791', mysql: '#4479A1', mongodb: '#47A248', redis: '#DC382D', sqlite: '#003B57'
};

const CONNECTIONS = [
  { id: '1', name: 'Production DB', type: 'postgresql', host: 'db.chenu.cloud', status: 'connected', tables: 48, size: '2.4 GB', icon: '🐘', color: colors.postgres },
  { id: '2', name: 'Analytics', type: 'mongodb', host: 'analytics.chenu.cloud', status: 'connected', collections: 24, size: '5.1 GB', icon: '🍃', color: colors.mongodb },
  { id: '3', name: 'Cache', type: 'redis', host: 'cache.chenu.cloud', status: 'connected', keys: 12450, size: '512 MB', icon: '⚡', color: colors.redis },
  { id: '4', name: 'Local Dev', type: 'sqlite', host: 'localhost', status: 'disconnected', tables: 32, size: '156 MB', icon: '📦', color: colors.sqlite }
];

const TABLES = [
  { name: 'users', rows: 12450, size: '45 MB', lastModified: 'il y a 2min' },
  { name: 'projects', rows: 3456, size: '128 MB', lastModified: 'il y a 5min' },
  { name: 'tasks', rows: 45670, size: '256 MB', lastModified: 'il y a 1min' },
  { name: 'documents', rows: 8901, size: '1.2 GB', lastModified: 'il y a 10min' },
  { name: 'invoices', rows: 2345, size: '67 MB', lastModified: 'il y a 1h' },
  { name: 'audit_logs', rows: 234567, size: '890 MB', lastModified: 'il y a 30s' }
];

const ConnectionCard = ({ conn, isSelected, onClick }: { conn: any; isSelected: boolean; onClick: () => void }) => (
  <div onClick={onClick} style={{ background: isSelected ? `${conn.color}20` : colors.slate, border: `2px solid ${isSelected ? conn.color : colors.border}`, borderRadius: 12, padding: 16, cursor: 'pointer' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 44, height: 44, background: conn.color, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{conn.icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ color: colors.sand, fontWeight: 600, fontSize: 14 }}>{conn.name}</div>
        <div style={{ color: colors.stone, fontSize: 11 }}>{conn.host}</div>
      </div>
      <div style={{ width: 10, height: 10, borderRadius: '50%', background: conn.status === 'connected' ? '#10B981' : colors.stone }} />
    </div>
    <div style={{ display: 'flex', gap: 16, marginTop: 12, paddingTop: 12, borderTop: `1px solid ${colors.border}` }}>
      <div><span style={{ color: colors.sand, fontWeight: 600 }}>{conn.tables || conn.collections || conn.keys?.toLocaleString()}</span><span style={{ color: colors.stone, fontSize: 11, marginLeft: 4 }}>{conn.tables ? 'tables' : conn.collections ? 'collections' : 'keys'}</span></div>
      <div><span style={{ color: colors.sand, fontWeight: 600 }}>{conn.size}</span><span style={{ color: colors.stone, fontSize: 11, marginLeft: 4 }}>size</span></div>
    </div>
  </div>
);

const QueryEditor = () => {
  const [query, setQuery] = useState('SELECT * FROM users WHERE created_at > NOW() - INTERVAL \'7 days\' LIMIT 100;');
  const [results, setResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runQuery = () => {
    setIsRunning(true);
    setTimeout(() => {
      setResults([
        { id: 1, name: 'Jean Tremblay', email: 'jean@example.com', created_at: '2024-01-15' },
        { id: 2, name: 'Marie Dubois', email: 'marie@example.com', created_at: '2024-01-14' },
        { id: 3, name: 'Pierre Martin', email: 'pierre@example.com', created_at: '2024-01-13' }
      ]);
      setIsRunning(false);
    }, 800);
  };

  return (
    <div style={{ background: colors.slate, border: `1px solid ${colors.moss}`, borderRadius: 16, overflow: 'hidden' }}>
      <div style={{ padding: 16, borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ color: colors.sand, margin: 0, fontSize: 14 }}>📝 Query Editor</h4>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ padding: '8px 12px', background: colors.card, border: 'none', borderRadius: 6, color: colors.stone, cursor: 'pointer', fontSize: 12 }}>💾 Sauver</button>
          <button style={{ padding: '8px 12px', background: colors.card, border: 'none', borderRadius: 6, color: colors.stone, cursor: 'pointer', fontSize: 12 }}>📋 Format</button>
        </div>
      </div>
      <textarea value={query} onChange={e => setQuery(e.target.value)} style={{ width: '100%', minHeight: 120, padding: 16, background: '#1a1a1a', border: 'none', color: colors.turquoise, fontSize: 13, fontFamily: 'monospace', resize: 'vertical' }} />
      <div style={{ padding: 12, borderTop: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: colors.stone, fontSize: 12 }}>PostgreSQL · Production DB</span>
        <button onClick={runQuery} disabled={isRunning} style={{ padding: '10px 24px', background: colors.emerald, border: 'none', borderRadius: 8, color: 'white', fontWeight: 600, cursor: 'pointer' }}>
          {isRunning ? '⏳ Exécution...' : '▶ Exécuter'}
        </button>
      </div>
      {results.length > 0 && (
        <div style={{ borderTop: `1px solid ${colors.border}` }}>
          <div style={{ padding: 12, background: colors.card, display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: colors.stone, fontSize: 12 }}>{results.length} résultats · 0.023s</span>
            <button style={{ background: 'none', border: 'none', color: colors.turquoise, cursor: 'pointer', fontSize: 12 }}>📥 Exporter CSV</button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: colors.card }}>{Object.keys(results[0]).map(key => <th key={key} style={{ padding: 12, color: colors.sand, fontSize: 12, textAlign: 'left', borderBottom: `1px solid ${colors.border}` }}>{key}</th>)}</tr>
              </thead>
              <tbody>
                {results.map((row, i) => <tr key={i} style={{ background: i % 2 ? colors.slate : colors.card }}>{Object.values(row).map((val: any, j) => <td key={j} style={{ padding: 12, color: colors.sand, fontSize: 12, borderBottom: `1px solid ${colors.border}` }}>{val}</td>)}</tr>)}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default function DatabaseManager() {
  const [selectedConn, setSelectedConn] = useState(CONNECTIONS[0]);
  const [activeTab, setActiveTab] = useState<'explorer' | 'query' | 'backups'>('explorer');

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ color: colors.sand, fontSize: 26, fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
            🗄️ Database Manager
            <span style={{ background: colors.emerald, color: 'white', padding: '4px 10px', borderRadius: 12, fontSize: 12 }}>{CONNECTIONS.filter(c => c.status === 'connected').length} connectées</span>
          </h1>
          <p style={{ color: colors.stone, margin: '4px 0 0', fontSize: 14 }}>Gérez vos bases de données et exécutez des requêtes</p>
        </div>
        <button style={{ padding: '12px 24px', background: colors.gold, border: 'none', borderRadius: 10, color: colors.slate, fontWeight: 600, cursor: 'pointer' }}>+ Nouvelle connexion</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24 }}>
        {/* Connections Sidebar */}
        <div>
          <h4 style={{ color: colors.sand, margin: '0 0 16px', fontSize: 14 }}>📡 Connexions</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {CONNECTIONS.map(conn => <ConnectionCard key={conn.id} conn={conn} isSelected={selectedConn.id === conn.id} onClick={() => setSelectedConn(conn)} />)}
          </div>
        </div>

        {/* Main Content */}
        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 20, background: colors.slate, padding: 8, borderRadius: 12 }}>
            {[{ id: 'explorer', icon: '📂', label: 'Explorateur' }, { id: 'query', icon: '📝', label: 'Requêtes' }, { id: 'backups', icon: '💾', label: 'Backups' }].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} style={{ flex: 1, padding: 12, background: activeTab === tab.id ? colors.moss : 'transparent', border: 'none', borderRadius: 8, color: activeTab === tab.id ? colors.gold : colors.stone, cursor: 'pointer', fontWeight: activeTab === tab.id ? 600 : 400 }}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'explorer' && (
            <div style={{ background: colors.slate, border: `1px solid ${colors.moss}`, borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ padding: 16, borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ color: colors.sand, margin: 0, fontSize: 14 }}>📊 Tables ({TABLES.length})</h4>
                <input placeholder="🔍 Rechercher..." style={{ padding: 8, background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 6, color: colors.sand, fontSize: 12, width: 200 }} />
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: colors.card }}>
                    {['Table', 'Lignes', 'Taille', 'Modifié'].map(h => <th key={h} style={{ padding: 12, color: colors.stone, fontSize: 12, textAlign: 'left', fontWeight: 500 }}>{h}</th>)}
                    <th style={{ padding: 12, width: 100 }} />
                  </tr>
                </thead>
                <tbody>
                  {TABLES.map((table, i) => (
                    <tr key={table.name} style={{ borderTop: `1px solid ${colors.border}` }}>
                      <td style={{ padding: 12 }}><span style={{ color: colors.turquoise, fontSize: 13, fontFamily: 'monospace' }}>📋 {table.name}</span></td>
                      <td style={{ padding: 12, color: colors.sand, fontSize: 13 }}>{table.rows.toLocaleString()}</td>
                      <td style={{ padding: 12, color: colors.sand, fontSize: 13 }}>{table.size}</td>
                      <td style={{ padding: 12, color: colors.stone, fontSize: 12 }}>{table.lastModified}</td>
                      <td style={{ padding: 12 }}><button style={{ background: colors.card, border: 'none', borderRadius: 6, padding: '6px 12px', color: colors.sand, cursor: 'pointer', fontSize: 11 }}>Voir</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'query' && <QueryEditor />}

          {activeTab === 'backups' && (
            <div style={{ background: colors.slate, border: `1px solid ${colors.moss}`, borderRadius: 16, padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h4 style={{ color: colors.sand, margin: 0 }}>💾 Backups récents</h4>
                <button style={{ padding: '10px 20px', background: colors.gold, border: 'none', borderRadius: 8, color: colors.slate, fontWeight: 600, cursor: 'pointer' }}>+ Créer backup</button>
              </div>
              {[
                { name: 'backup_2024-01-15_auto.sql.gz', size: '1.2 GB', date: 'il y a 2h', type: 'Auto' },
                { name: 'backup_2024-01-14_manual.sql.gz', size: '1.1 GB', date: 'il y a 1j', type: 'Manuel' },
                { name: 'backup_2024-01-13_auto.sql.gz', size: '1.1 GB', date: 'il y a 2j', type: 'Auto' }
              ].map((backup, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, background: colors.card, borderRadius: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 24 }}>📦</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: colors.sand, fontSize: 13, fontFamily: 'monospace' }}>{backup.name}</div>
                    <div style={{ color: colors.stone, fontSize: 11 }}>{backup.size} · {backup.date}</div>
                  </div>
                  <span style={{ background: backup.type === 'Auto' ? colors.emerald : colors.turquoise, color: 'white', padding: '4px 10px', borderRadius: 6, fontSize: 10 }}>{backup.type}</span>
                  <button style={{ background: colors.slate, border: `1px solid ${colors.border}`, borderRadius: 6, padding: '6px 12px', color: colors.sand, cursor: 'pointer', fontSize: 11 }}>⬇ Télécharger</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
