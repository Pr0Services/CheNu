import React, { useState, useMemo, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// ROADY V22 - SPRINT 2.1: PROJECTS AVANCÉ + MY ASSETS
// ═══════════════════════════════════════════════════════════════════════════════
// P1-01: Templates projets (Résidentiel, Commercial, Réno, Infrastructure)
// P1-02: Système de sous-projets / Phases
// P1-03: Budget tracking intégré par projet
// P1-04: Comparaison Estimé vs Réel avec graphiques
// P1-05: Import projets depuis Excel/CSV
// P1-06: Duplication projet en 1 clic
// P1-07: Archivage projets avec recherche
// P1-08: Tags/Labels personnalisables
// P1-09: Vue Portfolio - tous projets sur carte
// P1-10: Notifications jalons/échéances
// BONUS: My Assets Module
// ═══════════════════════════════════════════════════════════════════════════════

const T = {
  bg: { main: '#0a0a0f', card: '#12121a', hover: '#1a1a25', input: '#0d0d12' },
  text: { primary: '#ffffff', secondary: '#a0a0b0', muted: '#6b7280' },
  border: '#2a2a3a',
  accent: { primary: '#3b82f6', success: '#10b981', warning: '#f59e0b', danger: '#ef4444', purple: '#8b5cf6' }
};

// ═══════════════════════════════════════════════════════════════════════════════
// [P1-01] TEMPLATES PROJETS
// ═══════════════════════════════════════════════════════════════════════════════
const PROJECT_TEMPLATES = [
  { id: 'residential', icon: '🏠', name: 'Résidentiel', color: '#4ade80', 
    phases: ['Préparation', 'Fondation', 'Structure', 'Finition', 'Remise'],
    defaultBudget: 150000, defaultDuration: 90 },
  { id: 'commercial', icon: '🏢', name: 'Commercial', color: '#3b82f6',
    phases: ['Études', 'Démolition', 'Gros œuvre', 'Second œuvre', 'Aménagement', 'Réception'],
    defaultBudget: 500000, defaultDuration: 180 },
  { id: 'renovation', icon: '🔨', name: 'Rénovation', color: '#f59e0b',
    phases: ['Évaluation', 'Démolition', 'Travaux', 'Finitions', 'Nettoyage'],
    defaultBudget: 75000, defaultDuration: 45 },
  { id: 'infrastructure', icon: '🌉', name: 'Infrastructure', color: '#8b5cf6',
    phases: ['Planification', 'Terrassement', 'Construction', 'Installation', 'Tests', 'Mise en service'],
    defaultBudget: 2000000, defaultDuration: 365 },
  { id: 'landscaping', icon: '🌳', name: 'Aménagement', color: '#10b981',
    phases: ['Design', 'Préparation terrain', 'Plantation', 'Irrigation', 'Finitions'],
    defaultBudget: 25000, defaultDuration: 30 },
  { id: 'custom', icon: '⚡', name: 'Personnalisé', color: '#ec4899',
    phases: ['Phase 1', 'Phase 2', 'Phase 3'],
    defaultBudget: 100000, defaultDuration: 60 }
];

// ═══════════════════════════════════════════════════════════════════════════════
// [P1-08] TAGS SYSTÈME
// ═══════════════════════════════════════════════════════════════════════════════
const AVAILABLE_TAGS = [
  { id: 'urgent', label: 'Urgent', color: '#ef4444' },
  { id: 'priority', label: 'Prioritaire', color: '#f59e0b' },
  { id: 'onhold', label: 'En attente', color: '#6b7280' },
  { id: 'residential', label: 'Résidentiel', color: '#4ade80' },
  { id: 'commercial', label: 'Commercial', color: '#3b82f6' },
  { id: 'government', label: 'Gouvernement', color: '#8b5cf6' },
  { id: 'eco', label: 'Éco-responsable', color: '#10b981' }
];

// Sample Projects Data
const SAMPLE_PROJECTS = [
  { id: 1, name: 'Résidence Tremblay', template: 'residential', status: 'active', 
    budget: { estimated: 180000, spent: 95000 }, progress: 52, 
    phases: [
      { name: 'Préparation', status: 'done', budget: 15000, spent: 14500 },
      { name: 'Fondation', status: 'done', budget: 35000, spent: 38000 },
      { name: 'Structure', status: 'active', budget: 60000, spent: 42500 },
      { name: 'Finition', status: 'pending', budget: 55000, spent: 0 },
      { name: 'Remise', status: 'pending', budget: 15000, spent: 0 }
    ],
    tags: ['residential', 'priority'], 
    dueDate: '2025-03-15', address: '123 Rue Principale, Montréal', lat: 45.5017, lng: -73.5673 },
  { id: 2, name: 'Centre Commercial Laval', template: 'commercial', status: 'active',
    budget: { estimated: 850000, spent: 320000 }, progress: 38,
    phases: [
      { name: 'Études', status: 'done', budget: 50000, spent: 48000 },
      { name: 'Démolition', status: 'done', budget: 80000, spent: 75000 },
      { name: 'Gros œuvre', status: 'active', budget: 300000, spent: 197000 },
      { name: 'Second œuvre', status: 'pending', budget: 250000, spent: 0 },
      { name: 'Aménagement', status: 'pending', budget: 120000, spent: 0 },
      { name: 'Réception', status: 'pending', budget: 50000, spent: 0 }
    ],
    tags: ['commercial', 'urgent'],
    dueDate: '2025-08-01', address: '500 Boul. Laval, Laval', lat: 45.5577, lng: -73.7500 },
  { id: 3, name: 'Réno Cuisine Dupont', template: 'renovation', status: 'completed',
    budget: { estimated: 45000, spent: 42000 }, progress: 100,
    phases: [
      { name: 'Évaluation', status: 'done', budget: 2000, spent: 1800 },
      { name: 'Démolition', status: 'done', budget: 5000, spent: 5200 },
      { name: 'Travaux', status: 'done', budget: 28000, spent: 26000 },
      { name: 'Finitions', status: 'done', budget: 8000, spent: 7500 },
      { name: 'Nettoyage', status: 'done', budget: 2000, spent: 1500 }
    ],
    tags: ['residential'],
    dueDate: '2024-11-30', address: '789 Ave du Parc, Montréal', lat: 45.5200, lng: -73.6100 }
];

// ═══════════════════════════════════════════════════════════════════════════════
// MY ASSETS DATA
// ═══════════════════════════════════════════════════════════════════════════════
const SAMPLE_ASSETS = [
  { id: 1, type: 'vehicle', name: 'Ford F-150 2022', value: 55000, purchaseDate: '2022-03-15', 
    status: 'active', icon: '🚗', depreciation: 12, location: 'Garage principal' },
  { id: 2, type: 'equipment', name: 'Excavatrice CAT 320', value: 180000, purchaseDate: '2021-06-01',
    status: 'active', icon: '🚜', depreciation: 8, location: 'Chantier Laval' },
  { id: 3, type: 'property', name: 'Entrepôt St-Laurent', value: 450000, purchaseDate: '2019-01-10',
    status: 'active', icon: '🏭', appreciation: 5, location: '1500 Boul. St-Laurent' },
  { id: 4, type: 'vehicle', name: 'Camion Grue', value: 320000, purchaseDate: '2020-09-20',
    status: 'maintenance', icon: '🏗️', depreciation: 10, location: 'En réparation' },
  { id: 5, type: 'tool', name: 'Outils électriques (lot)', value: 15000, purchaseDate: '2023-01-05',
    status: 'active', icon: '🔧', depreciation: 20, location: 'Entrepôt' }
];

const ASSET_TYPES = [
  { id: 'vehicle', label: 'Véhicules', icon: '🚗', color: '#3b82f6' },
  { id: 'equipment', label: 'Équipements', icon: '🚜', color: '#f59e0b' },
  { id: 'property', label: 'Propriétés', icon: '🏭', color: '#8b5cf6' },
  { id: 'tool', label: 'Outils', icon: '🔧', color: '#10b981' },
  { id: 'other', label: 'Autres', icon: '📦', color: '#6b7280' }
];

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

const Card = ({ children, style = {}, onClick }) => (
  <div onClick={onClick} style={{
    background: T.bg.card, border: `1px solid ${T.border}`, borderRadius: 12,
    padding: 16, ...style, cursor: onClick ? 'pointer' : 'default',
    transition: 'all 0.2s', ...(onClick && { ':hover': { borderColor: T.accent.primary } })
  }}>{children}</div>
);

const Badge = ({ children, color = T.accent.primary }) => (
  <span style={{
    background: `${color}20`, color, padding: '4px 10px', borderRadius: 20,
    fontSize: 11, fontWeight: 600, textTransform: 'uppercase'
  }}>{children}</span>
);

const ProgressBar = ({ value, max, color = T.accent.primary, showLabel = true }) => {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: 12, color: T.text.muted }}>
                      <span>📍 {project.address?.substring(0, 25)}...</span>
                      <span>📅 {project.dueDate}</span>
                    </div>
                  </Card>
                );
              })}
            </div>
          </>
        )}

        {activeTab === 'assets' && <MyAssetsModule assets={assets} setAssets={setAssets} />}
        
        {activeTab === 'map' && <PortfolioMap projects={projects} />}
      </main>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            background: T.bg.card, borderRadius: 16, width: '90%', maxWidth: 800,
            maxHeight: '85vh', overflow: 'auto', border: `1px solid ${T.border}`
          }}>
            <div style={{ padding: 20, borderBottom: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 32 }}>{PROJECT_TEMPLATES.find(t => t.id === selectedProject.template)?.icon}</span>
                <div>
                  <h2 style={{ color: T.text.primary, margin: 0 }}>{selectedProject.name}</h2>
                  <div style={{ fontSize: 13, color: T.text.muted }}>{selectedProject.address}</div>
                </div>
              </div>
              <button onClick={() => setSelectedProject(null)} style={{
                background: 'none', border: 'none', color: T.text.muted, fontSize: 28, cursor: 'pointer'
              }}>×</button>
            </div>
            <div style={{ padding: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <BudgetTracker project={selectedProject} />
              <PhasesTimeline phases={selectedProject.phases} />
            </div>
            <div style={{ padding: 20, borderTop: `1px solid ${T.border}`, display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button style={{ padding: '10px 20px', background: T.bg.main, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text.secondary, cursor: 'pointer' }}>
                📋 Dupliquer
              </button>
              <button style={{ padding: '10px 20px', background: T.bg.main, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text.secondary, cursor: 'pointer' }}>
                📥 Archiver
              </button>
              <button style={{ padding: '10px 20px', background: T.accent.primary, border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer' }}>
                ✏️ Modifier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Project Modal */}
      {showNewProject && (
        <NewProjectModal 
          onClose={() => setShowNewProject(false)}
          onSave={(newProject) => {
            setProjects([...projects, { 
              id: Date.now(), 
              ...newProject,
              status: 'active',
              budget: { estimated: parseInt(newProject.budget), spent: 0 },
              progress: 0,
              phases: newProject.template.phases.map(p => ({ name: p, status: 'pending', budget: 0, spent: 0 }))
            }]);
            setShowNewProject(false);
          }}
        />
      )}
    </div>
  );
}Bottom: 4, fontSize: 12 }}>
        {showLabel && <span style={{ color: T.text.muted }}>${value.toLocaleString()} / ${max.toLocaleString()}</span>}
        <span style={{ color: pct > 100 ? T.accent.danger : T.text.secondary }}>{pct}%</span>
      </div>
      <div style={{ height: 8, background: T.bg.main, borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ 
          width: `${Math.min(pct, 100)}%`, height: '100%', borderRadius: 4,
          background: pct > 100 ? T.accent.danger : pct > 80 ? T.accent.warning : color,
          transition: 'width 0.5s ease'
        }} />
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// [P1-03] BUDGET TRACKING COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
const BudgetTracker = ({ project }) => {
  const variance = project.budget.spent - project.budget.estimated;
  const variancePct = ((variance / project.budget.estimated) * 100).toFixed(1);
  
  return (
    <Card style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 style={{ color: T.text.primary, fontSize: 16, fontWeight: 600 }}>💰 Budget Global</h3>
        <Badge color={variance > 0 ? T.accent.danger : T.accent.success}>
          {variance > 0 ? '+' : ''}{variancePct}%
        </Badge>
      </div>
      <ProgressBar value={project.budget.spent} max={project.budget.estimated} />
      
      {/* [P1-04] Comparaison par phase */}
      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: 13, color: T.text.muted, marginBottom: 8 }}>Par Phase:</div>
        {project.phases.map((phase, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 2 }}>
              <span style={{ color: T.text.secondary }}>
                {phase.status === 'done' ? '✅' : phase.status === 'active' ? '🔄' : '⏳'} {phase.name}
              </span>
              <span style={{ color: phase.spent > phase.budget ? T.accent.danger : T.text.muted }}>
                ${phase.spent.toLocaleString()} / ${phase.budget.toLocaleString()}
              </span>
            </div>
            <div style={{ height: 4, background: T.bg.main, borderRadius: 2 }}>
              <div style={{
                width: `${Math.min(100, (phase.spent / phase.budget) * 100)}%`,
                height: '100%', borderRadius: 2,
                background: phase.spent > phase.budget ? T.accent.danger : 
                  phase.status === 'done' ? T.accent.success : T.accent.primary
              }} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// [P1-02] PHASES COMPONENT (Sous-projets)
// ═══════════════════════════════════════════════════════════════════════════════
const PhasesTimeline = ({ phases }) => (
  <Card>
    <h3 style={{ color: T.text.primary, fontSize: 16, fontWeight: 600, marginBottom: 16 }}>📅 Phases du Projet</h3>
    <div style={{ position: 'relative' }}>
      {phases.map((phase, i) => (
        <div key={i} style={{ display: 'flex', gap: 12, marginBottom: i < phases.length - 1 ? 20 : 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: phase.status === 'done' ? T.accent.success : phase.status === 'active' ? T.accent.primary : T.bg.main,
              border: `2px solid ${phase.status === 'done' ? T.accent.success : phase.status === 'active' ? T.accent.primary : T.border}`
            }}>
              {phase.status === 'done' ? '✓' : phase.status === 'active' ? '●' : i + 1}
            </div>
            {i < phases.length - 1 && (
              <div style={{ width: 2, flex: 1, minHeight: 30, background: phase.status === 'done' ? T.accent.success : T.border }} />
            )}
          </div>
          <div style={{ flex: 1, paddingBottom: 8 }}>
            <div style={{ fontWeight: 500, color: T.text.primary }}>{phase.name}</div>
            <div style={{ fontSize: 12, color: T.text.muted }}>
              Budget: ${phase.budget.toLocaleString()} • Dépensé: ${phase.spent.toLocaleString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  </Card>
);

// ═══════════════════════════════════════════════════════════════════════════════
// MY ASSETS MODULE
// ═══════════════════════════════════════════════════════════════════════════════
const MyAssetsModule = ({ assets, setAssets }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState('all');
  
  const totalValue = useMemo(() => assets.reduce((sum, a) => sum + a.value, 0), [assets]);
  const filteredAssets = filter === 'all' ? assets : assets.filter(a => a.type === filter);
  
  const assetsByType = useMemo(() => {
    return ASSET_TYPES.map(type => ({
      ...type,
      count: assets.filter(a => a.type === type.id).length,
      value: assets.filter(a => a.type === type.id).reduce((sum, a) => sum + a.value, 0)
    }));
  }, [assets]);

  return (
    <div>
      {/* Header Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 20 }}>
        <Card style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 24, marginBottom: 4 }}>💎</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: T.accent.success }}>${totalValue.toLocaleString()}</div>
          <div style={{ fontSize: 12, color: T.text.muted }}>Valeur Totale</div>
        </Card>
        {assetsByType.filter(t => t.count > 0).map(type => (
          <Card key={type.id} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>{type.icon}</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: type.color }}>{type.count}</div>
            <div style={{ fontSize: 12, color: T.text.muted }}>{type.label}</div>
          </Card>
        ))}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <button onClick={() => setFilter('all')} style={{
          padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
          background: filter === 'all' ? T.accent.primary : T.bg.card,
          color: filter === 'all' ? '#fff' : T.text.secondary
        }}>Tous</button>
        {ASSET_TYPES.map(type => (
          <button key={type.id} onClick={() => setFilter(type.id)} style={{
            padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
            background: filter === type.id ? type.color : T.bg.card,
            color: filter === type.id ? '#fff' : T.text.secondary
          }}>{type.icon} {type.label}</button>
        ))}
      </div>

      {/* Assets List */}
      <div style={{ display: 'grid', gap: 12 }}>
        {filteredAssets.map(asset => (
          <Card key={asset.id} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 50, height: 50, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: `${ASSET_TYPES.find(t => t.id === asset.type)?.color}20`,
              fontSize: 24
            }}>{asset.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, color: T.text.primary }}>{asset.name}</div>
              <div style={{ fontSize: 12, color: T.text.muted }}>
                📍 {asset.location} • Acheté: {new Date(asset.purchaseDate).toLocaleDateString('fr-CA')}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 18, fontWeight: 600, color: T.accent.success }}>${asset.value.toLocaleString()}</div>
              <Badge color={asset.status === 'active' ? T.accent.success : T.accent.warning}>
                {asset.status === 'active' ? 'Actif' : 'Maintenance'}
              </Badge>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Button */}
      <button onClick={() => setShowAddModal(true)} style={{
        position: 'fixed', bottom: 24, right: 24, width: 56, height: 56, borderRadius: '50%',
        background: `linear-gradient(135deg, ${T.accent.primary}, ${T.accent.purple})`,
        border: 'none', color: '#fff', fontSize: 24, cursor: 'pointer',
        boxShadow: '0 4px 20px rgba(59,130,246,0.4)'
      }}>+</button>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// [P1-09] PORTFOLIO MAP VIEW
// ═══════════════════════════════════════════════════════════════════════════════
const PortfolioMap = ({ projects }) => (
  <Card style={{ height: 300, position: 'relative', overflow: 'hidden' }}>
    <div style={{
      position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${T.bg.main}, ${T.bg.card})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>🗺️</div>
        <div style={{ color: T.text.secondary }}>Vue Carte - {projects.length} projets</div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 12, flexWrap: 'wrap' }}>
          {projects.map(p => (
            <Badge key={p.id} color={PROJECT_TEMPLATES.find(t => t.id === p.template)?.color}>
              📍 {p.name.substring(0, 15)}...
            </Badge>
          ))}
        </div>
      </div>
    </div>
  </Card>
);

// ═══════════════════════════════════════════════════════════════════════════════
// [P1-01] NEW PROJECT MODAL
// ═══════════════════════════════════════════════════════════════════════════════
const NewProjectModal = ({ onClose, onSave }) => {
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [projectData, setProjectData] = useState({ name: '', budget: '', dueDate: '', tags: [] });

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        background: T.bg.card, borderRadius: 16, width: '90%', maxWidth: 600,
        maxHeight: '80vh', overflow: 'auto', border: `1px solid ${T.border}`
      }}>
        <div style={{ padding: 20, borderBottom: `1px solid ${T.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ color: T.text.primary }}>🚀 Nouveau Projet</h2>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: T.text.muted, fontSize: 24, cursor: 'pointer' }}>×</button>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            {[1, 2, 3].map(s => (
              <div key={s} style={{
                flex: 1, height: 4, borderRadius: 2,
                background: step >= s ? T.accent.primary : T.border
              }} />
            ))}
          </div>
        </div>

        <div style={{ padding: 20 }}>
          {step === 1 && (
            <>
              <h3 style={{ color: T.text.primary, marginBottom: 16 }}>Choisir un template</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                {PROJECT_TEMPLATES.map(tpl => (
                  <Card key={tpl.id} onClick={() => setSelectedTemplate(tpl)} style={{
                    border: selectedTemplate?.id === tpl.id ? `2px solid ${tpl.color}` : `1px solid ${T.border}`,
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>{tpl.icon}</div>
                    <div style={{ fontWeight: 600, color: T.text.primary }}>{tpl.name}</div>
                    <div style={{ fontSize: 11, color: T.text.muted }}>{tpl.phases.length} phases • ~{tpl.defaultDuration}j</div>
                  </Card>
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h3 style={{ color: T.text.primary, marginBottom: 16 }}>Détails du projet</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 6, color: T.text.secondary, fontSize: 13 }}>Nom du projet *</label>
                  <input
                    value={projectData.name}
                    onChange={e => setProjectData({...projectData, name: e.target.value})}
                    placeholder="Ex: Résidence Tremblay"
                    style={{ width: '100%', padding: 12, background: T.bg.input, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text.primary }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: 6, color: T.text.secondary, fontSize: 13 }}>Budget estimé</label>
                    <input
                      type="number"
                      value={projectData.budget || selectedTemplate?.defaultBudget}
                      onChange={e => setProjectData({...projectData, budget: e.target.value})}
                      style={{ width: '100%', padding: 12, background: T.bg.input, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text.primary }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: 6, color: T.text.secondary, fontSize: 13 }}>Date de fin</label>
                    <input
                      type="date"
                      value={projectData.dueDate}
                      onChange={e => setProjectData({...projectData, dueDate: e.target.value})}
                      style={{ width: '100%', padding: 12, background: T.bg.input, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text.primary }}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h3 style={{ color: T.text.primary, marginBottom: 16 }}>Tags & Labels</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {AVAILABLE_TAGS.map(tag => (
                  <button
                    key={tag.id}
                    onClick={() => {
                      const tags = projectData.tags.includes(tag.id)
                        ? projectData.tags.filter(t => t !== tag.id)
                        : [...projectData.tags, tag.id];
                      setProjectData({...projectData, tags});
                    }}
                    style={{
                      padding: '8px 16px', borderRadius: 20, border: 'none', cursor: 'pointer',
                      background: projectData.tags.includes(tag.id) ? tag.color : `${tag.color}20`,
                      color: projectData.tags.includes(tag.id) ? '#fff' : tag.color
                    }}
                  >{tag.label}</button>
                ))}
              </div>
            </>
          )}
        </div>

        <div style={{ padding: 20, borderTop: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between' }}>
          <button
            onClick={() => step > 1 ? setStep(step - 1) : onClose()}
            style={{ padding: '12px 24px', background: T.bg.main, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text.secondary, cursor: 'pointer' }}
          >{step > 1 ? '← Retour' : 'Annuler'}</button>
          <button
            onClick={() => step < 3 ? setStep(step + 1) : onSave({ ...projectData, template: selectedTemplate })}
            disabled={step === 1 && !selectedTemplate}
            style={{
              padding: '12px 24px', background: T.accent.primary, border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer',
              opacity: step === 1 && !selectedTemplate ? 0.5 : 1
            }}
          >{step < 3 ? 'Suivant →' : '✓ Créer le projet'}</button>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState(SAMPLE_PROJECTS);
  const [assets, setAssets] = useState(SAMPLE_ASSETS);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showNewProject, setShowNewProject] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  const tabs = [
    { id: 'projects', icon: '📁', label: 'Projets' },
    { id: 'assets', icon: '💎', label: 'Mes Actifs' },
    { id: 'map', icon: '🗺️', label: 'Carte' }
  ];

  return (
    <div style={{ minHeight: '100vh', background: T.bg.main, color: T.text.primary }}>
      {/* Header */}
      <header style={{
        background: T.bg.card, borderBottom: `1px solid ${T.border}`,
        padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 28 }}>🚀</span>
          <span style={{ fontWeight: 700, fontSize: 20 }}>ROADY V22</span>
          <Badge color={T.accent.success}>Sprint 2.1</Badge>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              padding: '10px 20px', borderRadius: 10, border: 'none', cursor: 'pointer',
              background: activeTab === tab.id ? T.accent.primary : T.bg.main,
              color: activeTab === tab.id ? '#fff' : T.text.secondary,
              display: 'flex', alignItems: 'center', gap: 8
            }}>{tab.icon} {tab.label}</button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: 24 }}>
        {activeTab === 'projects' && (
          <>
            {/* Projects Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h1 style={{ fontSize: 24 }}>📁 Mes Projets ({projects.length})</h1>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')} style={{
                  padding: '10px 16px', background: T.bg.card, border: `1px solid ${T.border}`, borderRadius: 8,
                  color: T.text.secondary, cursor: 'pointer'
                }}>{viewMode === 'grid' ? '📋 Liste' : '📊 Grille'}</button>
                <button onClick={() => setShowNewProject(true)} style={{
                  padding: '10px 20px', background: T.accent.primary, border: 'none', borderRadius: 8,
                  color: '#fff', cursor: 'pointer', fontWeight: 600
                }}>+ Nouveau Projet</button>
              </div>
            </div>

            {/* Projects Grid/List */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(350px, 1fr))' : '1fr',
              gap: 16 
            }}>
              {projects.map(project => {
                const template = PROJECT_TEMPLATES.find(t => t.id === project.template);
                return (
                  <Card key={project.id} onClick={() => setSelectedProject(project)} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 28 }}>{template?.icon}</span>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 16 }}>{project.name}</div>
                          <div style={{ fontSize: 12, color: T.text.muted }}>{template?.name}</div>
                        </div>
                      </div>
                      <Badge color={project.status === 'completed' ? T.accent.success : project.status === 'active' ? T.accent.primary : T.text.muted}>
                        {project.status === 'completed' ? 'Terminé' : project.status === 'active' ? 'En cours' : 'Archivé'}
                      </Badge>
                    </div>
                    
                    <ProgressBar value={project.budget.spent} max={project.budget.estimated} color={template?.color} />
                    
                    <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
                      {project.tags.map(tagId => {
                        const tag = AVAILABLE_TAGS.find(t => t.id === tagId);
                        return tag ? <Badge key={tagId} color={tag.color}>{tag.label}</Badge> : null;
                      })}
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', margin