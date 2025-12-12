import React, { useState, useMemo } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// ROADY V22 - SPRINT 2.3: TEAM & RH
// ═══════════════════════════════════════════════════════════════════════════════
// T1-01: Organigramme visuel interactif
// T1-02: Indicateurs charge de travail par agent
// T1-03: Profil compétences/certifications par employé
// T1-04: Intégration CCQ API - validation cartes compétences
// T1-05: Chat direct avec agents depuis leur profil
// T1-06: Planification automatique selon skills
// T1-07: Historique performance par employé
// T1-08: Intégration BambooHR API
// T1-09: Intégration Deputy API - scheduling
// T1-10: Export feuilles de temps pour paie
// ═══════════════════════════════════════════════════════════════════════════════

const T = {
  bg: { main: '#0a0a0f', card: '#12121a', hover: '#1a1a25', input: '#0d0d12' },
  text: { primary: '#ffffff', secondary: '#a0a0b0', muted: '#6b7280' },
  border: '#2a2a3a',
  accent: { primary: '#3b82f6', success: '#10b981', warning: '#f59e0b', danger: '#ef4444', purple: '#8b5cf6' }
};

// ═══════════════════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════════════════
const EMPLOYEES = [
  {
    id: 1, name: 'Jean Tremblay', role: 'Chef de projet', department: 'Direction',
    avatar: '👷', email: 'jean@roady.ca', phone: '514-555-0101',
    status: 'active', hireDate: '2019-03-15', salary: 85000,
    manager: null, directReports: [2, 3, 4],
    workload: 85, hoursThisWeek: 42,
    skills: ['Gestion projet', 'Estimation', 'Lecture plans', 'Négociation'],
    certifications: [
      { name: 'Carte CCQ - Surintendant', number: 'CCQ-2019-45678', expires: '2025-06-30', status: 'valid' },
      { name: 'ASP Construction', number: 'ASP-2022-1234', expires: '2027-01-15', status: 'valid' }
    ],
    performance: { rating: 4.5, reviews: 12, lastReview: '2024-09-15' },
    timesheet: { regular: 40, overtime: 2, vacation: 0 }
  },
  {
    id: 2, name: 'Marie Dubois', role: 'Architecte', department: 'Design',
    avatar: '👩‍💼', email: 'marie@roady.ca', phone: '514-555-0102',
    status: 'active', hireDate: '2020-06-01', salary: 78000,
    manager: 1, directReports: [],
    workload: 92, hoursThisWeek: 45,
    skills: ['AutoCAD', 'Revit', 'Design 3D', 'Codes bâtiment', 'Développement durable'],
    certifications: [
      { name: 'OAQ - Architecte', number: 'OAQ-12345', expires: '2025-12-31', status: 'valid' },
      { name: 'LEED AP', number: 'LEED-2021-789', expires: '2026-03-01', status: 'valid' }
    ],
    performance: { rating: 4.8, reviews: 8, lastReview: '2024-10-01' },
    timesheet: { regular: 40, overtime: 5, vacation: 0 }
  },
  {
    id: 3, name: 'Pierre Gagnon', role: 'Électricien', department: 'Terrain',
    avatar: '⚡', email: 'pierre@roady.ca', phone: '514-555-0103',
    status: 'active', hireDate: '2021-02-15', salary: 62000,
    manager: 1, directReports: [5],
    workload: 78, hoursThisWeek: 38,
    skills: ['Électricité résidentielle', 'Électricité commerciale', 'Domotique', 'Panneaux solaires'],
    certifications: [
      { name: 'Carte CCQ - Électricien', number: 'CCQ-2021-78901', expires: '2024-12-15', status: 'expiring' },
      { name: 'Licence RBQ', number: 'RBQ-5678', expires: '2025-09-30', status: 'valid' }
    ],
    performance: { rating: 4.2, reviews: 6, lastReview: '2024-08-20' },
    timesheet: { regular: 38, overtime: 0, vacation: 0 }
  },
  {
    id: 4, name: 'Sophie Martin', role: 'Plombière', department: 'Terrain',
    avatar: '🔧', email: 'sophie@roady.ca', phone: '514-555-0104',
    status: 'active', hireDate: '2022-01-10', salary: 58000,
    manager: 1, directReports: [],
    workload: 65, hoursThisWeek: 35,
    skills: ['Plomberie résidentielle', 'Plomberie commerciale', 'Chauffage', 'Gaz naturel'],
    certifications: [
      { name: 'Carte CCQ - Plombier', number: 'CCQ-2022-11111', expires: '2026-01-10', status: 'valid' },
      { name: 'Licence gaz', number: 'GAZ-2023-456', expires: '2025-06-01', status: 'valid' }
    ],
    performance: { rating: 4.0, reviews: 4, lastReview: '2024-07-15' },
    timesheet: { regular: 35, overtime: 0, vacation: 0 }
  },
  {
    id: 5, name: 'Luc Bergeron', role: 'Apprenti électricien', department: 'Terrain',
    avatar: '🪚', email: 'luc@roady.ca', phone: '514-555-0105',
    status: 'active', hireDate: '2023-09-01', salary: 42000,
    manager: 3, directReports: [],
    workload: 70, hoursThisWeek: 40,
    skills: ['Électricité base', 'Câblage', 'Installation prises'],
    certifications: [
      { name: 'Carte CCQ - Apprenti 2e année', number: 'CCQ-2023-99999', expires: '2025-09-01', status: 'valid' },
      { name: 'ASP Construction', number: 'ASP-2023-5555', expires: '2028-09-01', status: 'valid' }
    ],
    performance: { rating: 3.8, reviews: 2, lastReview: '2024-06-01' },
    timesheet: { regular: 40, overtime: 0, vacation: 0 }
  },
  {
    id: 6, name: 'Isabelle Roy', role: 'Comptable', department: 'Admin',
    avatar: '💼', email: 'isabelle@roady.ca', phone: '514-555-0106',
    status: 'vacation', hireDate: '2020-04-01', salary: 65000,
    manager: 1, directReports: [],
    workload: 0, hoursThisWeek: 0,
    skills: ['Comptabilité', 'Paie', 'Fiscalité', 'QuickBooks', 'Excel avancé'],
    certifications: [
      { name: 'CPA', number: 'CPA-QC-12345', expires: '2025-12-31', status: 'valid' }
    ],
    performance: { rating: 4.6, reviews: 8, lastReview: '2024-09-01' },
    timesheet: { regular: 0, overtime: 0, vacation: 40 }
  }
];

const DEPARTMENTS = [
  { id: 'direction', name: 'Direction', color: '#3b82f6', icon: '👔' },
  { id: 'design', name: 'Design', color: '#8b5cf6', icon: '🎨' },
  { id: 'terrain', name: 'Terrain', color: '#f59e0b', icon: '🏗️' },
  { id: 'admin', name: 'Administration', color: '#10b981', icon: '💼' }
];

const HR_INTEGRATIONS = [
  { id: 'ccq', name: 'CCQ API', icon: '🎓', status: 'connected', lastSync: '2024-12-03 09:00' },
  { id: 'bamboohr', name: 'BambooHR', icon: '🎋', status: 'connected', lastSync: '2024-12-03 08:30' },
  { id: 'deputy', name: 'Deputy', icon: '📅', status: 'pending', lastSync: null },
  { id: 'cnesst', name: 'CNESST', icon: '⛑️', status: 'connected', lastSync: '2024-12-02 14:00' }
];

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════
const Card = ({ children, style = {}, onClick }) => (
  <div onClick={onClick} style={{
    background: T.bg.card, border: `1px solid ${T.border}`, borderRadius: 12,
    padding: 16, cursor: onClick ? 'pointer' : 'default', ...style
  }}>{children}</div>
);

const Badge = ({ children, color = T.accent.primary }) => (
  <span style={{ background: `${color}20`, color, padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
    {children}
  </span>
);

const ProgressRing = ({ value, size = 60, color = T.accent.primary }) => {
  const radius = (size - 8) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;
  
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={T.bg.main} strokeWidth="6" />
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 14, fontWeight: 600, color: T.text.primary
      }}>{value}%</div>
    </div>
  );
};

// [T1-01] Organigramme
const OrgChart = ({ employees, onSelect }) => {
  const ceo = employees.find(e => !e.manager);
  
  const renderNode = (emp, level = 0) => {
    const reports = employees.filter(e => e.manager === emp.id);
    const dept = DEPARTMENTS.find(d => d.id === emp.department.toLowerCase());
    
    return (
      <div key={emp.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div onClick={() => onSelect(emp)} style={{
          padding: 12, background: T.bg.card, border: `2px solid ${dept?.color || T.border}`,
          borderRadius: 12, cursor: 'pointer', textAlign: 'center', minWidth: 140
        }}>
          <div style={{ fontSize: 32, marginBottom: 4 }}>{emp.avatar}</div>
          <div style={{ fontWeight: 600, color: T.text.primary, fontSize: 13 }}>{emp.name}</div>
          <div style={{ fontSize: 11, color: T.text.muted }}>{emp.role}</div>
          <Badge color={emp.status === 'vacation' ? T.accent.warning : T.accent.success}>
            {emp.status === 'vacation' ? 'Vacances' : 'Actif'}
          </Badge>
        </div>
        
        {reports.length > 0 && (
          <>
            <div style={{ width: 2, height: 20, background: T.border }} />
            <div style={{ display: 'flex', gap: 16, position: 'relative' }}>
              {reports.length > 1 && (
                <div style={{
                  position: 'absolute', top: 0, left: '25%', right: '25%',
                  height: 2, background: T.border
                }} />
              )}
              {reports.map(r => (
                <div key={r.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: 2, height: 20, background: T.border }} />
                  {renderNode(r, level + 1)}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <Card style={{ overflow: 'auto', padding: 24 }}>
      <h3 style={{ color: T.text.primary, marginBottom: 20 }}>🏢 Organigramme</h3>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {ceo && renderNode(ceo)}
      </div>
    </Card>
  );
};

// [T1-02] Workload Dashboard
const WorkloadDashboard = ({ employees }) => (
  <Card>
    <h3 style={{ color: T.text.primary, marginBottom: 16 }}>📊 Charge de Travail</h3>
    <div style={{ display: 'grid', gap: 12 }}>
      {employees.filter(e => e.status === 'active').map(emp => (
        <div key={emp.id} style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: 12,
          background: T.bg.main, borderRadius: 8
        }}>
          <span style={{ fontSize: 24 }}>{emp.avatar}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 500, color: T.text.primary }}>{emp.name}</div>
            <div style={{ fontSize: 12, color: T.text.muted }}>{emp.hoursThisWeek}h cette semaine</div>
          </div>
          <ProgressRing 
            value={emp.workload} 
            color={emp.workload > 90 ? T.accent.danger : emp.workload > 75 ? T.accent.warning : T.accent.success} 
          />
        </div>
      ))}
    </div>
  </Card>
);

// [T1-03] Employee Profile
const EmployeeProfile = ({ employee, onClose, onChat }) => {
  if (!employee) return null;
  const dept = DEPARTMENTS.find(d => d.id === employee.department.toLowerCase());

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        background: T.bg.card, borderRadius: 16, width: '90%', maxWidth: 700,
        maxHeight: '85vh', overflow: 'auto', border: `1px solid ${T.border}`
      }}>
        {/* Header */}
        <div style={{
          padding: 24, background: `linear-gradient(135deg, ${dept?.color}30, ${T.bg.card})`,
          display: 'flex', justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%', background: T.bg.main,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40
            }}>{employee.avatar}</div>
            <div>
              <h2 style={{ color: T.text.primary, margin: 0 }}>{employee.name}</h2>
              <div style={{ color: T.text.secondary }}>{employee.role}</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <Badge color={dept?.color}>{employee.department}</Badge>
                <Badge color={employee.status === 'vacation' ? T.accent.warning : T.accent.success}>
                  {employee.status === 'vacation' ? '🏖️ Vacances' : '✓ Actif'}
                </Badge>
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: T.text.muted, fontSize: 28, cursor: 'pointer'
          }}>×</button>
        </div>

        <div style={{ padding: 24 }}>
          {/* Contact + Quick Actions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            <Card>
              <h4 style={{ color: T.text.muted, fontSize: 12, marginBottom: 12 }}>CONTACT</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontSize: 13, color: T.text.secondary }}>📧 {employee.email}</div>
                <div style={{ fontSize: 13, color: T.text.secondary }}>📱 {employee.phone}</div>
              </div>
            </Card>
            <Card>
              <h4 style={{ color: T.text.muted, fontSize: 12, marginBottom: 12 }}>ACTIONS</h4>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => onChat(employee)} style={{
                  flex: 1, padding: 10, background: T.accent.primary, border: 'none',
                  borderRadius: 8, color: '#fff', cursor: 'pointer', fontSize: 13
                }}>💬 Chat</button>
                <button style={{
                  flex: 1, padding: 10, background: T.bg.main, border: `1px solid ${T.border}`,
                  borderRadius: 8, color: T.text.secondary, cursor: 'pointer', fontSize: 13
                }}>📞 Appeler</button>
              </div>
            </Card>
          </div>

          {/* [T1-03] Skills */}
          <Card style={{ marginBottom: 16 }}>
            <h4 style={{ color: T.text.primary, marginBottom: 12 }}>🎯 Compétences</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {employee.skills.map((skill, i) => (
                <Badge key={i} color={T.accent.purple}>{skill}</Badge>
              ))}
            </div>
          </Card>

          {/* [T1-04] CCQ Certifications */}
          <Card style={{ marginBottom: 16 }}>
            <h4 style={{ color: T.text.primary, marginBottom: 12 }}>🎓 Certifications CCQ</h4>
            <div style={{ display: 'grid', gap: 12 }}>
              {employee.certifications.map((cert, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: 12, background: T.bg.main, borderRadius: 8,
                  borderLeft: `3px solid ${cert.status === 'valid' ? T.accent.success : T.accent.warning}`
                }}>
                  <div>
                    <div style={{ fontWeight: 500, color: T.text.primary }}>{cert.name}</div>
                    <div style={{ fontSize: 12, color: T.text.muted }}>#{cert.number}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <Badge color={cert.status === 'valid' ? T.accent.success : T.accent.warning}>
                      {cert.status === 'valid' ? '✓ Valide' : '⚠️ Expire bientôt'}
                    </Badge>
                    <div style={{ fontSize: 11, color: T.text.muted, marginTop: 4 }}>
                      Exp: {new Date(cert.expires).toLocaleDateString('fr-CA')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* [T1-07] Performance */}
          <Card style={{ marginBottom: 16 }}>
            <h4 style={{ color: T.text.primary, marginBottom: 12 }}>📈 Performance</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: 28, fontWeight: 700, color: T.accent.success }}>
                  {employee.performance.rating}/5
                </div>
                <div style={{ fontSize: 12, color: T.text.muted }}>Note moyenne</div>
              </div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 700, color: T.accent.primary }}>
                  {employee.performance.reviews}
                </div>
                <div style={{ fontSize: 12, color: T.text.muted }}>Évaluations</div>
              </div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 700, color: T.accent.purple }}>
                  {Math.floor((new Date() - new Date(employee.hireDate)) / (365.25 * 24 * 60 * 60 * 1000))}
                </div>
                <div style={{ fontSize: 12, color: T.text.muted }}>Années</div>
              </div>
            </div>
          </Card>

          {/* [T1-10] Timesheet */}
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h4 style={{ color: T.text.primary }}>⏱️ Feuille de temps (semaine)</h4>
              <button style={{
                padding: '6px 12px', background: T.accent.primary, border: 'none',
                borderRadius: 6, color: '#fff', cursor: 'pointer', fontSize: 12
              }}>📥 Exporter</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              <div style={{ padding: 12, background: T.bg.main, borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 600, color: T.text.primary }}>{employee.timesheet.regular}h</div>
                <div style={{ fontSize: 11, color: T.text.muted }}>Régulier</div>
              </div>
              <div style={{ padding: 12, background: T.bg.main, borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 600, color: T.accent.warning }}>{employee.timesheet.overtime}h</div>
                <div style={{ fontSize: 11, color: T.text.muted }}>Supplémentaire</div>
              </div>
              <div style={{ padding: 12, background: T.bg.main, borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 600, color: T.accent.purple }}>{employee.timesheet.vacation}h</div>
                <div style={{ fontSize: 11, color: T.text.muted }}>Vacances</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

// [T1-06] Auto-Planning
const AutoPlanning = ({ employees }) => {
  const [selectedSkill, setSelectedSkill] = useState('');
  const allSkills = [...new Set(employees.flatMap(e => e.skills))];
  
  const matchingEmployees = selectedSkill 
    ? employees.filter(e => e.skills.includes(selectedSkill) && e.status === 'active')
        .sort((a, b) => a.workload - b.workload)
    : [];

  return (
    <Card>
      <h3 style={{ color: T.text.primary, marginBottom: 16 }}>🤖 Planification Auto</h3>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 8, color: T.text.secondary, fontSize: 13 }}>
          Compétence requise:
        </label>
        <select
          value={selectedSkill}
          onChange={e => setSelectedSkill(e.target.value)}
          style={{
            width: '100%', padding: 12, background: T.bg.input, border: `1px solid ${T.border}`,
            borderRadius: 8, color: T.text.primary
          }}
        >
          <option value="">Sélectionner une compétence...</option>
          {allSkills.map(skill => (
            <option key={skill} value={skill}>{skill}</option>
          ))}
        </select>
      </div>

      {matchingEmployees.length > 0 && (
        <div>
          <div style={{ fontSize: 12, color: T.text.muted, marginBottom: 8 }}>
            Recommandations (par disponibilité):
          </div>
          {matchingEmployees.map((emp, i) => (
            <div key={emp.id} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: 12,
              background: i === 0 ? `${T.accent.success}15` : T.bg.main,
              border: i === 0 ? `1px solid ${T.accent.success}40` : 'none',
              borderRadius: 8, marginBottom: 8
            }}>
              {i === 0 && <span>⭐</span>}
              <span style={{ fontSize: 20 }}>{emp.avatar}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, color: T.text.primary }}>{emp.name}</div>
                <div style={{ fontSize: 12, color: T.text.muted }}>{emp.role}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, color: emp.workload < 70 ? T.accent.success : T.accent.warning }}>
                  {emp.workload}% charge
                </div>
                <button style={{
                  marginTop: 4, padding: '4px 12px', background: T.accent.primary, border: 'none',
                  borderRadius: 6, color: '#fff', cursor: 'pointer', fontSize: 11
                }}>Assigner</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

// HR Integrations Panel
const HRIntegrations = () => (
  <Card>
    <h3 style={{ color: T.text.primary, marginBottom: 16 }}>🔌 Intégrations RH</h3>
    <div style={{ display: 'grid', gap: 12 }}>
      {HR_INTEGRATIONS.map(int => (
        <div key={int.id} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: 12, background: T.bg.main, borderRadius: 8
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 24 }}>{int.icon}</span>
            <div>
              <div style={{ fontWeight: 500, color: T.text.primary }}>{int.name}</div>
              {int.lastSync && (
                <div style={{ fontSize: 11, color: T.text.muted }}>Sync: {int.lastSync}</div>
              )}
            </div>
          </div>
          <Badge color={int.status === 'connected' ? T.accent.success : T.accent.warning}>
            {int.status === 'connected' ? '✓ Connecté' : 'En attente'}
          </Badge>
        </div>
      ))}
    </div>
  </Card>
);

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════════
export default function TeamHR() {
  const [view, setView] = useState('org');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showChat, setShowChat] = useState(null);

  const views = [
    { id: 'org', icon: '🏢', label: 'Organigramme' },
    { id: 'workload', icon: '📊', label: 'Charge' },
    { id: 'planning', icon: '🤖', label: 'Auto-Planning' },
    { id: 'integrations', icon: '🔌', label: 'Intégrations' }
  ];

  const stats = {
    total: EMPLOYEES.length,
    active: EMPLOYEES.filter(e => e.status === 'active').length,
    expiring: EMPLOYEES.filter(e => e.certifications.some(c => c.status === 'expiring')).length,
    avgWorkload: Math.round(EMPLOYEES.filter(e => e.status === 'active').reduce((s, e) => s + e.workload, 0) / EMPLOYEES.filter(e => e.status === 'active').length)
  };

  return (
    <div style={{ minHeight: '100vh', background: T.bg.main, color: T.text.primary }}>
      {/* Header */}
      <header style={{
        background: T.bg.card, borderBottom: `1px solid ${T.border}`,
        padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 28 }}>👥</span>
          <span style={{ fontWeight: 700, fontSize: 20 }}>Team & RH</span>
          <Badge color={T.accent.purple}>Sprint 2.3</Badge>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {views.map(v => (
            <button key={v.id} onClick={() => setView(v.id)} style={{
              padding: '10px 20px', borderRadius: 10, border: 'none', cursor: 'pointer',
              background: view === v.id ? T.accent.primary : T.bg.main,
              color: view === v.id ? '#fff' : T.text.secondary
            }}>{v.icon} {v.label}</button>
          ))}
        </div>
      </header>

      {/* Stats Bar */}
      <div style={{ padding: '16px 24px', display: 'flex', gap: 16, borderBottom: `1px solid ${T.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>👤</span>
          <span style={{ color: T.text.secondary }}>{stats.total} employés</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>✅</span>
          <span style={{ color: T.accent.success }}>{stats.active} actifs</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>⚠️</span>
          <span style={{ color: T.accent.warning }}>{stats.expiring} certifs à renouveler</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>📊</span>
          <span style={{ color: T.text.secondary }}>Charge moy: {stats.avgWorkload}%</span>
        </div>
      </div>

      {/* Main */}
      <main style={{ padding: 24 }}>
        {view === 'integrations' && <HRIntegrations />}
      </main>

      {/* Employee Profile Modal */}
      {selectedEmployee && (
        <EmployeeProfile 
          employee={selectedEmployee} 
          onClose={() => setSelectedEmployee(null)}
          onChat={(emp) => { setShowChat(emp); setSelectedEmployee(null); }}
        />
      )}

      {/* [T1-05] Chat Modal */}
      {showChat && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, width: 350, height: 450,
          background: T.bg.card, borderRadius: 16, border: `1px solid ${T.border}`,
          display: 'flex', flexDirection: 'column', zIndex: 1000,
          boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
        }}>
          <div style={{
            padding: 16, borderBottom: `1px solid ${T.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 24 }}>{showChat.avatar}</span>
              <div>
                <div style={{ fontWeight: 600, color: T.text.primary }}>{showChat.name}</div>
                <div style={{ fontSize: 11, color: T.accent.success }}>● En ligne</div>
              </div>
            </div>
            <button onClick={() => setShowChat(null)} style={{
              background: 'none', border: 'none', color: T.text.muted, fontSize: 20, cursor: 'pointer'
            }}>×</button>
          </div>
          <div style={{ flex: 1, padding: 16, overflowY: 'auto' }}>
            <div style={{
              background: T.bg.main, padding: 12, borderRadius: 12, marginBottom: 8, maxWidth: '80%'
            }}>
              <div style={{ fontSize: 13, color: T.text.primary }}>Salut! Comment puis-je t'aider?</div>
              <div style={{ fontSize: 10, color: T.text.muted, marginTop: 4 }}>09:30</div>
            </div>
          </div>
          <div style={{ padding: 12, borderTop: `1px solid ${T.border}` }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                placeholder="Écrire un message..."
                style={{
                  flex: 1, padding: 12, background: T.bg.input, border: `1px solid ${T.border}`,
                  borderRadius: 8, color: T.text.primary
                }}
              />
              <button style={{
                padding: '12px 16px', background: T.accent.primary, border: 'none',
                borderRadius: 8, color: '#fff', cursor: 'pointer'
              }}>➤</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}'org' && <OrgChart employees={EMPLOYEES} onSelect={setSelectedEmployee} />}
        {view === 'workload' && <WorkloadDashboard employees={EMPLOYEES} />}
        {view === 'planning' && <AutoPlanning employees={EMPLOYEES} />}
        {view === 