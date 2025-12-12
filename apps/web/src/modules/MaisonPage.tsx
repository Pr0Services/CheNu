/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║              CHE·NU V4.9 - ESPACE MAISON (Vie Personnelle)                   ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  L'espace "Maison" centralise toute la vie personnelle de l'utilisateur:    ║
 * ║  - Documents privés                                                          ║
 * ║  - Finances personnelles                                                     ║
 * ║  - Projets personnels                                                        ║
 * ║  - Famille & Contacts                                                        ║
 * ║  - Santé & Bien-être                                                         ║
 * ║  - Objectifs & Habitudes                                                     ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS CHE·NU
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
};

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'doc' | 'other';
  category: string;
  date: string;
  size: string;
}

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  progress: number;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
}

interface Contact {
  id: string;
  name: string;
  relation: string;
  avatar: string;
  lastContact: string;
}

interface Habit {
  id: string;
  name: string;
  icon: string;
  streak: number;
  completed: boolean;
  frequency: 'daily' | 'weekly';
}

interface HealthMetric {
  id: string;
  name: string;
  value: string;
  icon: string;
  trend: 'up' | 'down' | 'stable';
}

// ═══════════════════════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════════════════════

const mockDocuments: Document[] = [
  { id: '1', name: 'Passeport_2024.pdf', type: 'pdf', category: 'Identité', date: '2024-01-15', size: '2.3 MB' },
  { id: '2', name: 'Contrat_Location.pdf', type: 'pdf', category: 'Logement', date: '2024-03-01', size: '1.8 MB' },
  { id: '3', name: 'Assurance_Auto.pdf', type: 'pdf', category: 'Assurance', date: '2024-06-10', size: '890 KB' },
  { id: '4', name: 'Diplome_Universite.pdf', type: 'pdf', category: 'Éducation', date: '2020-06-15', size: '1.2 MB' },
  { id: '5', name: 'Certificat_Naissance.pdf', type: 'pdf', category: 'Identité', date: '2019-08-20', size: '450 KB' },
];

const mockTransactions: Transaction[] = [
  { id: '1', description: 'Salaire Décembre', amount: 5200, type: 'income', category: 'Salaire', date: '2024-12-01' },
  { id: '2', description: 'Loyer', amount: -1800, type: 'expense', category: 'Logement', date: '2024-12-01' },
  { id: '3', description: 'Épicerie Metro', amount: -245, type: 'expense', category: 'Alimentation', date: '2024-12-03' },
  { id: '4', description: 'Netflix', amount: -22.99, type: 'expense', category: 'Divertissement', date: '2024-12-05' },
  { id: '5', description: 'Vente Kijiji', amount: 150, type: 'income', category: 'Autre', date: '2024-12-04' },
];

const mockProjects: Project[] = [
  { id: '1', name: 'Rénovation Cuisine', description: 'Refaire les armoires et comptoirs', progress: 35, dueDate: '2025-03-01', priority: 'high' },
  { id: '2', name: 'Apprendre Piano', description: 'Cours en ligne + pratique quotidienne', progress: 60, dueDate: '2025-06-01', priority: 'medium' },
  { id: '3', name: 'Marathon 2025', description: 'Préparation course 42km', progress: 20, dueDate: '2025-09-15', priority: 'low' },
];

const mockContacts: Contact[] = [
  { id: '1', name: 'Marie Dupont', relation: 'Mère', avatar: '👩', lastContact: 'Hier' },
  { id: '2', name: 'Jean Dupont', relation: 'Père', avatar: '👨', lastContact: 'Il y a 3 jours' },
  { id: '3', name: 'Sophie Martin', relation: 'Sœur', avatar: '👧', lastContact: 'Cette semaine' },
  { id: '4', name: 'Dr. Tremblay', relation: 'Médecin', avatar: '👨‍⚕️', lastContact: 'Il y a 2 mois' },
];

const mockHabits: Habit[] = [
  { id: '1', name: 'Méditation', icon: '🧘', streak: 15, completed: true, frequency: 'daily' },
  { id: '2', name: 'Exercice', icon: '💪', streak: 8, completed: false, frequency: 'daily' },
  { id: '3', name: 'Lecture', icon: '📚', streak: 22, completed: true, frequency: 'daily' },
  { id: '4', name: 'Gratitude', icon: '🙏', streak: 30, completed: true, frequency: 'daily' },
  { id: '5', name: 'Ménage', icon: '🧹', streak: 4, completed: false, frequency: 'weekly' },
];

const mockHealth: HealthMetric[] = [
  { id: '1', name: 'Pas aujourd\'hui', value: '8,432', icon: '👟', trend: 'up' },
  { id: '2', name: 'Sommeil', value: '7h 23min', icon: '😴', trend: 'stable' },
  { id: '3', name: 'Eau', value: '1.8L', icon: '💧', trend: 'down' },
  { id: '4', name: 'Poids', value: '72 kg', icon: '⚖️', trend: 'stable' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

// Quick Stats Card
const QuickStatCard = ({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) => (
  <div style={{
    background: colors.card,
    border: `1px solid ${colors.border}`,
    borderRadius: 16,
    padding: 20,
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    transition: 'all 0.2s ease',
    cursor: 'pointer',
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.borderColor = color;
    e.currentTarget.style.transform = 'translateY(-2px)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.borderColor = colors.border;
    e.currentTarget.style.transform = 'translateY(0)';
  }}
  >
    <div style={{
      width: 48, height: 48,
      background: `${color}20`,
      borderRadius: 12,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 24,
    }}>{icon}</div>
    <div>
      <div style={{ color: colors.stone, fontSize: 13, marginBottom: 4 }}>{label}</div>
      <div style={{ color: colors.sand, fontSize: 20, fontWeight: 600 }}>{value}</div>
    </div>
  </div>
);

// Document Item
const DocumentItem = ({ doc }: { doc: Document }) => {
  const typeIcons: Record<string, string> = {
    pdf: '📄',
    image: '🖼️',
    doc: '📝',
    other: '📁',
  };
  
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      padding: '12px 16px',
      background: colors.slate,
      borderRadius: 12,
      marginBottom: 8,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    }}
    onMouseEnter={(e) => e.currentTarget.style.background = colors.moss}
    onMouseLeave={(e) => e.currentTarget.style.background = colors.slate}
    >
      <span style={{ fontSize: 24, marginRight: 12 }}>{typeIcons[doc.type]}</span>
      <div style={{ flex: 1 }}>
        <div style={{ color: colors.sand, fontSize: 14, fontWeight: 500 }}>{doc.name}</div>
        <div style={{ color: colors.stone, fontSize: 12 }}>{doc.category} • {doc.size}</div>
      </div>
      <div style={{ color: colors.stone, fontSize: 12 }}>{doc.date}</div>
    </div>
  );
};

// Transaction Item
const TransactionItem = ({ tx }: { tx: Transaction }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    background: colors.slate,
    borderRadius: 12,
    marginBottom: 8,
  }}>
    <div style={{
      width: 40, height: 40,
      background: tx.type === 'income' ? `${colors.emerald}30` : `${colors.ember}30`,
      borderRadius: 10,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      marginRight: 12,
      fontSize: 18,
    }}>
      {tx.type === 'income' ? '📈' : '📉'}
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ color: colors.sand, fontSize: 14, fontWeight: 500 }}>{tx.description}</div>
      <div style={{ color: colors.stone, fontSize: 12 }}>{tx.category} • {tx.date}</div>
    </div>
    <div style={{
      color: tx.type === 'income' ? colors.emerald : colors.ember,
      fontSize: 16,
      fontWeight: 600,
    }}>
      {tx.type === 'income' ? '+' : ''}{tx.amount.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
    </div>
  </div>
);

// Project Card
const ProjectCard = ({ project }: { project: Project }) => {
  const priorityColors = {
    low: colors.turquoise,
    medium: colors.gold,
    high: colors.ember,
  };
  
  return (
    <div style={{
      background: colors.card,
      border: `1px solid ${colors.border}`,
      borderRadius: 16,
      padding: 20,
      marginBottom: 12,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <div style={{ color: colors.sand, fontSize: 16, fontWeight: 600 }}>{project.name}</div>
          <div style={{ color: colors.stone, fontSize: 13, marginTop: 4 }}>{project.description}</div>
        </div>
        <span style={{
          padding: '4px 10px',
          background: `${priorityColors[project.priority]}20`,
          color: priorityColors[project.priority],
          borderRadius: 20,
          fontSize: 12,
          fontWeight: 500,
        }}>
          {project.priority === 'high' ? '🔴 Haute' : project.priority === 'medium' ? '🟡 Moyenne' : '🟢 Basse'}
        </span>
      </div>
      
      <div style={{ marginBottom: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ color: colors.stone, fontSize: 12 }}>Progression</span>
          <span style={{ color: colors.gold, fontSize: 12, fontWeight: 600 }}>{project.progress}%</span>
        </div>
        <div style={{ height: 6, background: colors.slate, borderRadius: 3 }}>
          <div style={{
            height: '100%',
            width: `${project.progress}%`,
            background: `linear-gradient(90deg, ${colors.emerald}, ${colors.turquoise})`,
            borderRadius: 3,
            transition: 'width 0.3s ease',
          }} />
        </div>
      </div>
      
      <div style={{ color: colors.stone, fontSize: 12 }}>
        📅 Échéance: {project.dueDate}
      </div>
    </div>
  );
};

// Contact Card
const ContactCard = ({ contact }: { contact: Contact }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    padding: 16,
    background: colors.slate,
    borderRadius: 12,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  }}
  onMouseEnter={(e) => e.currentTarget.style.background = colors.moss}
  onMouseLeave={(e) => e.currentTarget.style.background = colors.slate}
  >
    <div style={{
      width: 48, height: 48,
      background: `linear-gradient(135deg, ${colors.emerald}, ${colors.moss})`,
      borderRadius: '50%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 24,
      marginRight: 12,
    }}>{contact.avatar}</div>
    <div style={{ flex: 1 }}>
      <div style={{ color: colors.sand, fontSize: 14, fontWeight: 500 }}>{contact.name}</div>
      <div style={{ color: colors.stone, fontSize: 12 }}>{contact.relation}</div>
    </div>
    <div style={{ color: colors.stone, fontSize: 11 }}>{contact.lastContact}</div>
  </div>
);

// Habit Tracker
const HabitItem = ({ habit, onToggle }: { habit: Habit; onToggle: () => void }) => (
  <div 
    onClick={onToggle}
    style={{
      display: 'flex',
      alignItems: 'center',
      padding: '12px 16px',
      background: habit.completed ? `${colors.emerald}15` : colors.slate,
      border: `1px solid ${habit.completed ? colors.emerald : colors.border}`,
      borderRadius: 12,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    }}
  >
    <span style={{ fontSize: 24, marginRight: 12 }}>{habit.icon}</span>
    <div style={{ flex: 1 }}>
      <div style={{ 
        color: colors.sand, 
        fontSize: 14, 
        fontWeight: 500,
        textDecoration: habit.completed ? 'line-through' : 'none',
        opacity: habit.completed ? 0.7 : 1,
      }}>{habit.name}</div>
      <div style={{ color: colors.gold, fontSize: 12 }}>🔥 {habit.streak} jours</div>
    </div>
    <div style={{
      width: 28, height: 28,
      borderRadius: '50%',
      border: `2px solid ${habit.completed ? colors.emerald : colors.stone}`,
      background: habit.completed ? colors.emerald : 'transparent',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {habit.completed && <span style={{ color: '#fff', fontSize: 14 }}>✓</span>}
    </div>
  </div>
);

// Health Metric Card
const HealthMetricCard = ({ metric }: { metric: HealthMetric }) => {
  const trendIcons = { up: '↑', down: '↓', stable: '→' };
  const trendColors = { up: colors.emerald, down: colors.ember, stable: colors.turquoise };
  
  return (
    <div style={{
      background: colors.card,
      border: `1px solid ${colors.border}`,
      borderRadius: 12,
      padding: 16,
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 32, marginBottom: 8 }}>{metric.icon}</div>
      <div style={{ color: colors.sand, fontSize: 20, fontWeight: 600 }}>{metric.value}</div>
      <div style={{ color: colors.stone, fontSize: 12, marginTop: 4 }}>{metric.name}</div>
      <div style={{ 
        color: trendColors[metric.trend], 
        fontSize: 14, 
        marginTop: 8,
        fontWeight: 500,
      }}>
        {trendIcons[metric.trend]}
      </div>
    </div>
  );
};

// Section Header
const SectionHeader = ({ icon, title, action }: { icon: string; title: string; action?: { label: string; onClick: () => void } }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  }}>
    <h2 style={{
      color: colors.sand,
      fontSize: 18,
      fontWeight: 600,
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      margin: 0,
    }}>
      <span>{icon}</span> {title}
    </h2>
    {action && (
      <button
        onClick={action.onClick}
        style={{
          padding: '8px 16px',
          background: `${colors.gold}20`,
          border: `1px solid ${colors.gold}`,
          borderRadius: 8,
          color: colors.gold,
          fontSize: 13,
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = `${colors.gold}40`}
        onMouseLeave={(e) => e.currentTarget.style.background = `${colors.gold}20`}
      >
        {action.label}
      </button>
    )}
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

type TabType = 'overview' | 'documents' | 'finances' | 'projects' | 'family' | 'health';

const MaisonPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [habits, setHabits] = useState<Habit[]>(mockHabits);

  const toggleHabit = (id: string) => {
    setHabits(prev => prev.map(h => 
      h.id === id ? { ...h, completed: !h.completed } : h
    ));
  };

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'overview', label: 'Aperçu', icon: '🏠' },
    { id: 'documents', label: 'Documents', icon: '📁' },
    { id: 'finances', label: 'Finances', icon: '💰' },
    { id: 'projects', label: 'Projets', icon: '🎯' },
    { id: 'family', label: 'Famille', icon: '👨‍👩‍👧‍👦' },
    { id: 'health', label: 'Santé', icon: '❤️' },
  ];

  // Calculate totals
  const totalIncome = mockTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = Math.abs(mockTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));
  const balance = totalIncome - totalExpenses;
  const completedHabits = habits.filter(h => h.completed).length;

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.dark,
      color: colors.sand,
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Header */}
      <div style={{
        background: colors.card,
        borderBottom: `1px solid ${colors.border}`,
        padding: '20px 32px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{
              fontSize: 28,
              fontWeight: 700,
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}>
              🏠 Maison
            </h1>
            <p style={{ color: colors.stone, margin: '8px 0 0', fontSize: 14 }}>
              Votre espace personnel — Documents, finances, projets et famille
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: 12 }}>
            <button style={{
              padding: '10px 20px',
              background: colors.emerald,
              border: 'none',
              borderRadius: 10,
              color: '#fff',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              ➕ Ajouter
            </button>
            <button style={{
              padding: '10px 20px',
              background: `${colors.turquoise}20`,
              border: `1px solid ${colors.turquoise}`,
              borderRadius: 10,
              color: colors.turquoise,
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              🤖 Demander à Nova
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: 8,
          marginTop: 24,
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 20px',
                background: activeTab === tab.id ? colors.gold : 'transparent',
                border: `1px solid ${activeTab === tab.id ? colors.gold : colors.border}`,
                borderRadius: 10,
                color: activeTab === tab.id ? colors.dark : colors.sand,
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.2s ease',
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: 32 }}>
        
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Quick Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 20,
              marginBottom: 32,
            }}>
              <QuickStatCard 
                icon="📄" 
                label="Documents" 
                value={`${mockDocuments.length} fichiers`}
                color={colors.turquoise}
              />
              <QuickStatCard 
                icon="💰" 
                label="Balance" 
                value={balance.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                color={colors.emerald}
              />
              <QuickStatCard 
                icon="🎯" 
                label="Projets actifs" 
                value={`${mockProjects.length} en cours`}
                color={colors.gold}
              />
              <QuickStatCard 
                icon="✅" 
                label="Habitudes" 
                value={`${completedHabits}/${habits.length} aujourd'hui`}
                color={colors.emerald}
              />
            </div>

            {/* Two Column Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              
              {/* Left Column */}
              <div>
                {/* Recent Documents */}
                <div style={{
                  background: colors.card,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 16,
                  padding: 20,
                  marginBottom: 24,
                }}>
                  <SectionHeader 
                    icon="📁" 
                    title="Documents récents" 
                    action={{ label: 'Voir tout', onClick: () => setActiveTab('documents') }}
                  />
                  {mockDocuments.slice(0, 3).map(doc => (
                    <DocumentItem key={doc.id} doc={doc} />
                  ))}
                </div>

                {/* Recent Transactions */}
                <div style={{
                  background: colors.card,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 16,
                  padding: 20,
                }}>
                  <SectionHeader 
                    icon="💰" 
                    title="Transactions récentes" 
                    action={{ label: 'Voir tout', onClick: () => setActiveTab('finances') }}
                  />
                  {mockTransactions.slice(0, 4).map(tx => (
                    <TransactionItem key={tx.id} tx={tx} />
                  ))}
                </div>
              </div>

              {/* Right Column */}
              <div>
                {/* Habits Today */}
                <div style={{
                  background: colors.card,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 16,
                  padding: 20,
                  marginBottom: 24,
                }}>
                  <SectionHeader icon="✅" title="Habitudes du jour" />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {habits.filter(h => h.frequency === 'daily').map(habit => (
                      <HabitItem 
                        key={habit.id} 
                        habit={habit} 
                        onToggle={() => toggleHabit(habit.id)}
                      />
                    ))}
                  </div>
                </div>

                {/* Active Projects */}
                <div style={{
                  background: colors.card,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 16,
                  padding: 20,
                }}>
                  <SectionHeader 
                    icon="🎯" 
                    title="Projets en cours" 
                    action={{ label: 'Voir tout', onClick: () => setActiveTab('projects') }}
                  />
                  {mockProjects.slice(0, 2).map(project => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div style={{
            background: colors.card,
            border: `1px solid ${colors.border}`,
            borderRadius: 16,
            padding: 24,
          }}>
            <SectionHeader 
              icon="📁" 
              title="Tous les documents" 
              action={{ label: '+ Importer', onClick: () => {} }}
            />
            
            {/* Categories */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              {['Tous', 'Identité', 'Logement', 'Assurance', 'Éducation'].map(cat => (
                <button key={cat} style={{
                  padding: '8px 16px',
                  background: cat === 'Tous' ? colors.gold : colors.slate,
                  border: 'none',
                  borderRadius: 8,
                  color: cat === 'Tous' ? colors.dark : colors.sand,
                  fontSize: 13,
                  cursor: 'pointer',
                }}>
                  {cat}
                </button>
              ))}
            </div>
            
            {mockDocuments.map(doc => (
              <DocumentItem key={doc.id} doc={doc} />
            ))}
          </div>
        )}

        {/* Finances Tab */}
        {activeTab === 'finances' && (
          <>
            {/* Finance Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 20,
              marginBottom: 24,
            }}>
              <QuickStatCard icon="📈" label="Revenus (ce mois)" value={totalIncome.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })} color={colors.emerald} />
              <QuickStatCard icon="📉" label="Dépenses (ce mois)" value={totalExpenses.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })} color={colors.ember} />
              <QuickStatCard icon="💰" label="Balance" value={balance.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })} color={colors.gold} />
            </div>
            
            <div style={{
              background: colors.card,
              border: `1px solid ${colors.border}`,
              borderRadius: 16,
              padding: 24,
            }}>
              <SectionHeader 
                icon="💳" 
                title="Toutes les transactions" 
                action={{ label: '+ Ajouter', onClick: () => {} }}
              />
              {mockTransactions.map(tx => (
                <TransactionItem key={tx.id} tx={tx} />
              ))}
            </div>
          </>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div style={{
            background: colors.card,
            border: `1px solid ${colors.border}`,
            borderRadius: 16,
            padding: 24,
          }}>
            <SectionHeader 
              icon="🎯" 
              title="Mes projets personnels" 
              action={{ label: '+ Nouveau projet', onClick: () => {} }}
            />
            {mockProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}

        {/* Family Tab */}
        {activeTab === 'family' && (
          <div style={{
            background: colors.card,
            border: `1px solid ${colors.border}`,
            borderRadius: 16,
            padding: 24,
          }}>
            <SectionHeader 
              icon="👨‍👩‍👧‍👦" 
              title="Famille & Contacts" 
              action={{ label: '+ Ajouter', onClick: () => {} }}
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              {mockContacts.map(contact => (
                <ContactCard key={contact.id} contact={contact} />
              ))}
            </div>
          </div>
        )}

        {/* Health Tab */}
        {activeTab === 'health' && (
          <>
            {/* Health Metrics */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 16,
              marginBottom: 24,
            }}>
              {mockHealth.map(metric => (
                <HealthMetricCard key={metric.id} metric={metric} />
              ))}
            </div>
            
            {/* Habits */}
            <div style={{
              background: colors.card,
              border: `1px solid ${colors.border}`,
              borderRadius: 16,
              padding: 24,
            }}>
              <SectionHeader icon="✅" title="Suivi des habitudes" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                {habits.map(habit => (
                  <HabitItem 
                    key={habit.id} 
                    habit={habit} 
                    onToggle={() => toggleHabit(habit.id)}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MaisonPage;
