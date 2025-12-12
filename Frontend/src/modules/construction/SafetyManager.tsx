/**
 * CHE·NU V5.0 - SAFETY MANAGER (Gestion SST/CNESST)
 */

import React, { useState, useMemo } from 'react';

const colors = {
  gold: '#D8B26A', stone: '#8D8371', emerald: '#3F7249', turquoise: '#3EB4A2',
  moss: '#2F4C39', slate: '#1E1F22', sand: '#E9E4D6', dark: '#0f1217',
  card: 'rgba(22, 27, 34, 0.95)', border: 'rgba(216, 178, 106, 0.15)',
  red: '#E54D4D', blue: '#4D8BE5', orange: '#F97316', yellow: '#EAB308',
};

interface Inspection { id: string; date: string; siteId: string; inspector: string; type: string; status: 'passed' | 'failed' | 'pending'; score: number; items: { category: string; item: string; status: 'ok' | 'warning' | 'danger'; notes: string }[]; }
interface Incident { id: string; date: string; siteId: string; type: string; severity: 'low' | 'medium' | 'high' | 'critical'; description: string; injuredWorker?: string; rootCause: string; correctiveActions: string[]; reportedToCnesst: boolean; status: 'open' | 'investigating' | 'closed'; }
interface Training { id: string; workerId: string; workerName: string; certification: string; issueDate: string; expiryDate: string; status: 'valid' | 'expiring' | 'expired'; }

const mockSites = [
  { id: 's1', name: 'Résidence Tremblay', address: 'Montréal', riskLevel: 'medium' },
  { id: 's2', name: 'Commercial Plaza', address: 'Laval', riskLevel: 'high' },
];

const mockInspections: Inspection[] = [
  { id: 'insp-1', date: '2024-12-05', siteId: 's1', inspector: 'Jean Gagnon', type: 'routine', status: 'passed', score: 92, items: [
    { category: 'EPI', item: 'Casques', status: 'ok', notes: 'Conformes' },
    { category: 'EPI', item: 'Bottes', status: 'ok', notes: '' },
    { category: 'Échafaudages', item: 'Stabilité', status: 'warning', notes: 'À resserrer' },
    { category: 'Électricité', item: 'Câblage', status: 'ok', notes: '' },
  ]},
  { id: 'insp-2', date: '2024-12-03', siteId: 's2', inspector: 'Marc Dubois', type: 'cnesst', status: 'failed', score: 68, items: [
    { category: 'Signalisation', item: 'Panneaux', status: 'danger', notes: 'Manquants zone C' },
    { category: 'EPI', item: 'Harnais', status: 'warning', notes: '2 expirés' },
  ]},
];

const mockIncidents: Incident[] = [
  { id: 'inc-1', date: '2024-12-04', siteId: 's1', type: 'near-miss', severity: 'medium', description: 'Chute d\'outil du 3e étage - aucun blessé', rootCause: 'Mauvaise fixation', correctiveActions: ['Formation rappel', 'Filets de protection'], reportedToCnesst: false, status: 'closed' },
  { id: 'inc-2', date: '2024-12-02', siteId: 's2', type: 'first-aid', severity: 'low', description: 'Coupure mineure à la main', injuredWorker: 'Pierre Roy', rootCause: 'Gants non portés', correctiveActions: ['Rappel EPI obligatoire'], reportedToCnesst: false, status: 'closed' },
];

const mockTrainings: Training[] = [
  { id: 't1', workerId: 'w1', workerName: 'Jean Gagnon', certification: 'Carte ASP Construction', issueDate: '2023-06-15', expiryDate: '2025-06-15', status: 'valid' },
  { id: 't2', workerId: 'w2', workerName: 'Marc Dubois', certification: 'Travail en hauteur', issueDate: '2022-03-10', expiryDate: '2024-12-10', status: 'expiring' },
  { id: 't3', workerId: 'w3', workerName: 'Pierre Roy', certification: 'SIMDUT 2015', issueDate: '2021-09-20', expiryDate: '2024-09-20', status: 'expired' },
  { id: 't4', workerId: 'w4', workerName: 'Luc Tremblay', certification: 'Carte ASP Construction', issueDate: '2024-01-05', expiryDate: '2026-01-05', status: 'valid' },
  { id: 't5', workerId: 'w2', workerName: 'Marc Dubois', certification: 'Secourisme', issueDate: '2023-11-15', expiryDate: '2025-11-15', status: 'valid' },
];

const StatusBadge = ({ status, type }: { status: string; type: 'inspection' | 'incident' | 'training' }) => {
  const configs: Record<string, Record<string, { label: string; color: string }>> = {
    inspection: { passed: { label: '✅ Réussi', color: colors.emerald }, failed: { label: '❌ Échoué', color: colors.red }, pending: { label: '⏳ En cours', color: colors.orange } },
    incident: { open: { label: '🔴 Ouvert', color: colors.red }, investigating: { label: '🔍 Enquête', color: colors.orange }, closed: { label: '✅ Fermé', color: colors.emerald } },
    training: { valid: { label: '✅ Valide', color: colors.emerald }, expiring: { label: '⚠️ Expire bientôt', color: colors.orange }, expired: { label: '❌ Expiré', color: colors.red } },
  };
  const cfg = configs[type][status] || { label: status, color: colors.stone };
  return <span style={{ padding: '4px 10px', background: `${cfg.color}20`, color: cfg.color, borderRadius: 20, fontSize: 11, fontWeight: 500 }}>{cfg.label}</span>;
};

const SeverityBadge = ({ severity }: { severity: string }) => {
  const cfg: Record<string, { label: string; color: string }> = {
    low: { label: 'Faible', color: colors.emerald },
    medium: { label: 'Moyen', color: colors.yellow },
    high: { label: 'Élevé', color: colors.orange },
    critical: { label: 'Critique', color: colors.red },
  };
  const c = cfg[severity] || cfg.low;
  return <span style={{ padding: '3px 8px', background: `${c.color}20`, color: c.color, borderRadius: 6, fontSize: 10, fontWeight: 600 }}>{c.label}</span>;
};

const StatCard = ({ icon, value, label, color, trend }: { icon: string; value: string | number; label: string; color: string; trend?: string }) => (
  <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 12, padding: 20 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <span style={{ fontSize: 28 }}>{icon}</span>
      {trend && <span style={{ fontSize: 11, color: trend.startsWith('+') ? colors.red : colors.emerald }}>{trend}</span>}
    </div>
    <div style={{ color, fontSize: 32, fontWeight: 700, margin: '8px 0' }}>{value}</div>
    <div style={{ color: colors.stone, fontSize: 12 }}>{label}</div>
  </div>
);

const SafetyManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inspections' | 'incidents' | 'training'>('dashboard');
  const [inspections] = useState(mockInspections);
  const [incidents] = useState(mockIncidents);
  const [trainings] = useState(mockTrainings);

  const stats = useMemo(() => ({
    daysWithoutIncident: 15,
    inspectionsThisMonth: inspections.length,
    passRate: Math.round(inspections.filter(i => i.status === 'passed').length / inspections.length * 100),
    openIncidents: incidents.filter(i => i.status !== 'closed').length,
    expiringCerts: trainings.filter(t => t.status === 'expiring').length,
    expiredCerts: trainings.filter(t => t.status === 'expired').length,
  }), [inspections, incidents, trainings]);

  const tabs = [
    { id: 'dashboard', label: '📊 Tableau de bord', icon: '📊' },
    { id: 'inspections', label: '🔍 Inspections', icon: '🔍' },
    { id: 'incidents', label: '⚠️ Incidents', icon: '⚠️' },
    { id: 'training', label: '📚 Formations', icon: '📚' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: colors.dark, color: colors.sand, fontFamily: 'Inter' }}>
      {/* Header */}
      <div style={{ padding: '20px 32px', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>🦺 Gestion SST</h1>
          <p style={{ color: colors.stone, margin: '4px 0 0', fontSize: 13 }}>Sécurité, inspections et conformité CNESST</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button style={{ padding: '10px 20px', background: colors.red, border: 'none', borderRadius: 10, color: '#fff', fontSize: 14, cursor: 'pointer' }}>🚨 Déclarer incident</button>
          <button style={{ padding: '10px 20px', background: colors.gold, border: 'none', borderRadius: 10, color: colors.dark, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>+ Nouvelle inspection</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ padding: '0 32px', borderBottom: `1px solid ${colors.border}`, display: 'flex', gap: 8 }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} style={{
            padding: '16px 20px', background: 'none', border: 'none', borderBottom: `2px solid ${activeTab === tab.id ? colors.gold : 'transparent'}`,
            color: activeTab === tab.id ? colors.gold : colors.stone, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s',
          }}>{tab.label}</button>
        ))}
      </div>

      <div style={{ padding: 32 }}>
        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div>
            {/* Main Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 32 }}>
              <StatCard icon="🛡️" value={stats.daysWithoutIncident} label="Jours sans incident" color={colors.emerald} />
              <StatCard icon="🔍" value={stats.inspectionsThisMonth} label="Inspections ce mois" color={colors.turquoise} />
              <StatCard icon="✅" value={`${stats.passRate}%`} label="Taux de conformité" color={stats.passRate >= 80 ? colors.emerald : colors.orange} />
              <StatCard icon="⚠️" value={stats.openIncidents} label="Incidents ouverts" color={stats.openIncidents > 0 ? colors.red : colors.emerald} />
            </div>

            {/* Alerts */}
            {(stats.expiringCerts > 0 || stats.expiredCerts > 0) && (
              <div style={{ background: `${colors.orange}15`, border: `1px solid ${colors.orange}40`, borderRadius: 12, padding: 20, marginBottom: 24 }}>
                <h3 style={{ margin: '0 0 12px', fontSize: 16, color: colors.orange }}>⚠️ Alertes de formation</h3>
                <div style={{ display: 'flex', gap: 24 }}>
                  {stats.expiredCerts > 0 && <div style={{ color: colors.red }}>❌ {stats.expiredCerts} certification(s) expirée(s)</div>}
                  {stats.expiringCerts > 0 && <div style={{ color: colors.orange }}>⏰ {stats.expiringCerts} certification(s) expire(nt) bientôt</div>}
                </div>
              </div>
            )}

            {/* Recent Activity */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 12, padding: 20 }}>
                <h3 style={{ margin: '0 0 16px', fontSize: 16 }}>🔍 Dernières inspections</h3>
                {inspections.slice(0, 3).map(insp => (
                  <div key={insp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${colors.border}` }}>
                    <div>
                      <div style={{ color: colors.sand, fontSize: 14 }}>{mockSites.find(s => s.id === insp.siteId)?.name}</div>
                      <div style={{ color: colors.stone, fontSize: 12 }}>{insp.date} • {insp.inspector}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ color: insp.score >= 80 ? colors.emerald : colors.orange, fontWeight: 600 }}>{insp.score}%</span>
                      <StatusBadge status={insp.status} type="inspection" />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 12, padding: 20 }}>
                <h3 style={{ margin: '0 0 16px', fontSize: 16 }}>⚠️ Incidents récents</h3>
                {incidents.slice(0, 3).map(inc => (
                  <div key={inc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${colors.border}` }}>
                    <div>
                      <div style={{ color: colors.sand, fontSize: 14 }}>{inc.description.slice(0, 40)}...</div>
                      <div style={{ color: colors.stone, fontSize: 12 }}>{inc.date} • {mockSites.find(s => s.id === inc.siteId)?.name}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <SeverityBadge severity={inc.severity} />
                      <StatusBadge status={inc.status} type="incident" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Inspections Tab */}
        {activeTab === 'inspections' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
              <h2 style={{ margin: 0 }}>🔍 Inspections</h2>
              <input type="text" placeholder="🔍 Rechercher..." style={{ padding: '10px 16px', background: colors.slate, border: `1px solid ${colors.border}`, borderRadius: 8, color: colors.sand, width: 250 }} />
            </div>
            <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 12, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: colors.slate }}>
                    <th style={{ padding: 14, textAlign: 'left', color: colors.stone, fontSize: 12 }}>DATE</th>
                    <th style={{ padding: 14, textAlign: 'left', color: colors.stone, fontSize: 12 }}>SITE</th>
                    <th style={{ padding: 14, textAlign: 'left', color: colors.stone, fontSize: 12 }}>TYPE</th>
                    <th style={{ padding: 14, textAlign: 'left', color: colors.stone, fontSize: 12 }}>INSPECTEUR</th>
                    <th style={{ padding: 14, textAlign: 'center', color: colors.stone, fontSize: 12 }}>SCORE</th>
                    <th style={{ padding: 14, textAlign: 'center', color: colors.stone, fontSize: 12 }}>STATUT</th>
                    <th style={{ padding: 14 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {inspections.map(insp => (
                    <tr key={insp.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                      <td style={{ padding: 14, color: colors.sand }}>{insp.date}</td>
                      <td style={{ padding: 14, color: colors.sand }}>{mockSites.find(s => s.id === insp.siteId)?.name}</td>
                      <td style={{ padding: 14, color: colors.stone, textTransform: 'capitalize' }}>{insp.type}</td>
                      <td style={{ padding: 14, color: colors.sand }}>{insp.inspector}</td>
                      <td style={{ padding: 14, textAlign: 'center' }}>
                        <span style={{ padding: '4px 10px', background: insp.score >= 80 ? `${colors.emerald}20` : `${colors.orange}20`, color: insp.score >= 80 ? colors.emerald : colors.orange, borderRadius: 20, fontSize: 13, fontWeight: 600 }}>{insp.score}%</span>
                      </td>
                      <td style={{ padding: 14, textAlign: 'center' }}><StatusBadge status={insp.status} type="inspection" /></td>
                      <td style={{ padding: 14 }}><button style={{ background: 'none', border: 'none', color: colors.gold, cursor: 'pointer' }}>Voir →</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Incidents Tab */}
        {activeTab === 'incidents' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
              <h2 style={{ margin: 0 }}>⚠️ Incidents</h2>
              <button style={{ padding: '10px 20px', background: colors.red, border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer' }}>+ Déclarer incident</button>
            </div>
            {incidents.map(inc => (
              <div key={inc.id} style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 12, padding: 20, marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 24 }}>{ inc.type === 'near-miss' ? '👁️' : inc.type === 'first-aid' ? '🩹' : '🚑' }</span>
                    <div>
                      <div style={{ color: colors.sand, fontSize: 15, fontWeight: 600 }}>{inc.type === 'near-miss' ? 'Quasi-accident' : inc.type === 'first-aid' ? 'Premiers soins' : 'Accident'}</div>
                      <div style={{ color: colors.stone, fontSize: 12 }}>{inc.date} • {mockSites.find(s => s.id === inc.siteId)?.name}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <SeverityBadge severity={inc.severity} />
                    <StatusBadge status={inc.status} type="incident" />
                    {inc.reportedToCnesst && <span style={{ padding: '4px 10px', background: `${colors.blue}20`, color: colors.blue, borderRadius: 20, fontSize: 11 }}>📋 CNESST</span>}
                  </div>
                </div>
                <p style={{ margin: '0 0 12px', color: colors.sand }}>{inc.description}</p>
                {inc.injuredWorker && <div style={{ color: colors.orange, fontSize: 13, marginBottom: 8 }}>👤 Travailleur: {inc.injuredWorker}</div>}
                <div style={{ color: colors.stone, fontSize: 13 }}><strong>Cause:</strong> {inc.rootCause}</div>
                {inc.correctiveActions.length > 0 && (
                  <div style={{ marginTop: 12 }}>
                    <div style={{ color: colors.stone, fontSize: 12, marginBottom: 6 }}>Actions correctives:</div>
                    {inc.correctiveActions.map((action, i) => (
                      <span key={i} style={{ display: 'inline-block', padding: '4px 10px', background: colors.slate, borderRadius: 6, fontSize: 12, marginRight: 8, marginBottom: 4, color: colors.sand }}>✓ {action}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Training Tab */}
        {activeTab === 'training' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
              <h2 style={{ margin: 0 }}>📚 Formations & Certifications</h2>
              <button style={{ padding: '10px 20px', background: colors.gold, border: 'none', borderRadius: 8, color: colors.dark, fontWeight: 600, cursor: 'pointer' }}>+ Ajouter certification</button>
            </div>

            {/* Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
              <div style={{ background: `${colors.emerald}15`, border: `1px solid ${colors.emerald}40`, borderRadius: 12, padding: 16, textAlign: 'center' }}>
                <div style={{ color: colors.emerald, fontSize: 28, fontWeight: 700 }}>{trainings.filter(t => t.status === 'valid').length}</div>
                <div style={{ color: colors.stone, fontSize: 12 }}>Certifications valides</div>
              </div>
              <div style={{ background: `${colors.orange}15`, border: `1px solid ${colors.orange}40`, borderRadius: 12, padding: 16, textAlign: 'center' }}>
                <div style={{ color: colors.orange, fontSize: 28, fontWeight: 700 }}>{trainings.filter(t => t.status === 'expiring').length}</div>
                <div style={{ color: colors.stone, fontSize: 12 }}>Expirent bientôt</div>
              </div>
              <div style={{ background: `${colors.red}15`, border: `1px solid ${colors.red}40`, borderRadius: 12, padding: 16, textAlign: 'center' }}>
                <div style={{ color: colors.red, fontSize: 28, fontWeight: 700 }}>{trainings.filter(t => t.status === 'expired').length}</div>
                <div style={{ color: colors.stone, fontSize: 12 }}>Expirées</div>
              </div>
            </div>

            {/* Table */}
            <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 12, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: colors.slate }}>
                    <th style={{ padding: 14, textAlign: 'left', color: colors.stone, fontSize: 12 }}>TRAVAILLEUR</th>
                    <th style={{ padding: 14, textAlign: 'left', color: colors.stone, fontSize: 12 }}>CERTIFICATION</th>
                    <th style={{ padding: 14, textAlign: 'left', color: colors.stone, fontSize: 12 }}>ÉMISSION</th>
                    <th style={{ padding: 14, textAlign: 'left', color: colors.stone, fontSize: 12 }}>EXPIRATION</th>
                    <th style={{ padding: 14, textAlign: 'center', color: colors.stone, fontSize: 12 }}>STATUT</th>
                  </tr>
                </thead>
                <tbody>
                  {trainings.map(t => (
                    <tr key={t.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                      <td style={{ padding: 14 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 32, height: 32, background: `linear-gradient(135deg, ${colors.emerald}, ${colors.moss})`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>👷</div>
                          <span style={{ color: colors.sand }}>{t.workerName}</span>
                        </div>
                      </td>
                      <td style={{ padding: 14, color: colors.sand }}>{t.certification}</td>
                      <td style={{ padding: 14, color: colors.stone }}>{t.issueDate}</td>
                      <td style={{ padding: 14, color: t.status === 'expired' ? colors.red : t.status === 'expiring' ? colors.orange : colors.sand }}>{t.expiryDate}</td>
                      <td style={{ padding: 14, textAlign: 'center' }}><StatusBadge status={t.status} type="training" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SafetyManager;
