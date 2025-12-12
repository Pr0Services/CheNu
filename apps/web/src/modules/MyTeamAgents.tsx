/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║              CHE·NU V25 - MY TEAM / AGENTS HIERARCHY                         ║
 * ║              Complete Agent Management System                                 ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from 'react';

const colors = {
  gold: '#D8B26A', goldDark: '#B89040', stone: '#8D8371', emerald: '#3F7249',
  turquoise: '#3EB4A2', moss: '#2F4C39', slate: '#1E1F22', card: '#242424',
  sand: '#E9E4D6', border: '#2A2A2A',
  direction: '#F59E0B', projet: '#3B82F6', estimation: '#10B981',
  architecture: '#8B5CF6', conformite: '#EF4444', ingenierie: '#EC4899', qualite: '#14B8A6'
};

// Agent Data Structure
const DEPARTMENTS = [
  {
    id: 'direction', name: 'Direction Générale', icon: '👑', color: colors.direction,
    agents: [
      { id: 'director', name: 'Directeur Construction', icon: '🏗️', level: 'L1', status: 'active', speciality: 'Stratégie', tools: ['project_overview', 'resource_allocator', 'risk_analyzer', 'budget_master'], responsibilities: ['Vision stratégique', 'Allocation ressources', 'Relations clients', 'Décisions critiques'], delegatesTo: ['project_manager', 'estimation_lead', 'architecture_lead'], tasksCompleted: 1247, accuracy: 98, avgResponseTime: '0.8s' }
    ]
  },
  {
    id: 'projet', name: 'Gestion de Projet', icon: '📋', color: colors.projet,
    agents: [
      { id: 'project_manager', name: 'Gérant de Projet', icon: '📋', level: 'L2', status: 'active', speciality: 'Coordination', tools: ['schedule_builder', 'gantt_generator', 'milestone_tracker', 'team_coordinator'], responsibilities: ['Planification', 'Coordination équipes', 'Suivi budgétaire', 'Communication client'], delegatesTo: ['site_supervisor', 'scheduler', 'procurement'], reportsTo: 'director', tasksCompleted: 892, accuracy: 96, avgResponseTime: '1.2s' },
      { id: 'site_supervisor', name: 'Superviseur Chantier', icon: '👷', level: 'L3', status: 'busy', speciality: 'Terrain', tools: ['daily_log', 'crew_manager', 'safety_checklist', 'progress_reporter'], responsibilities: ['Supervision quotidienne', 'Gestion équipes', 'Rapports journaliers'], reportsTo: 'project_manager', tasksCompleted: 2341, accuracy: 94, avgResponseTime: '0.5s' },
      { id: 'scheduler', name: 'Planificateur', icon: '📅', level: 'L3', status: 'active', speciality: 'Planning', tools: ['critical_path_analyzer', 'resource_leveler', 'delay_predictor'], responsibilities: ['Échéanciers', 'Chemin critique', 'Optimisation délais'], reportsTo: 'project_manager', tasksCompleted: 567, accuracy: 97, avgResponseTime: '2.1s' },
      { id: 'procurement', name: 'Approvisionnement', icon: '📦', level: 'L3', status: 'idle', speciality: 'Achats', tools: ['supplier_database', 'order_tracker', 'inventory_manager', 'price_comparator'], responsibilities: ['Commandes', 'Fournisseurs', 'Stocks'], reportsTo: 'project_manager', tasksCompleted: 1123, accuracy: 95, avgResponseTime: '1.8s' }
    ]
  },
  {
    id: 'estimation', name: 'Estimation & Coûts', icon: '💰', color: colors.estimation,
    agents: [
      { id: 'estimation_lead', name: 'Chef Estimation', icon: '💰', level: 'L2', status: 'active', speciality: 'Coûts', tools: ['cost_database', 'estimate_validator', 'margin_calculator', 'bid_analyzer'], responsibilities: ['Validation estimations', 'Stratégie soumission', 'Analyse rentabilité'], delegatesTo: ['quantity_surveyor', 'cost_estimator', 'bid_specialist'], reportsTo: 'director', tasksCompleted: 678, accuracy: 97, avgResponseTime: '3.2s' },
      { id: 'quantity_surveyor', name: 'Métreur', icon: '📐', level: 'L3', status: 'active', speciality: 'Quantités', tools: ['takeoff_calculator', 'material_lister', 'labor_estimator'], responsibilities: ['Relevés quantités', 'Listes matériaux', 'Calculs surfaces'], reportsTo: 'estimation_lead', tasksCompleted: 1456, accuracy: 98, avgResponseTime: '2.5s' },
      { id: 'cost_estimator', name: 'Estimateur Coûts', icon: '🧮', level: 'L3', status: 'busy', speciality: 'Prix', tools: ['pricing_engine', 'labor_rates', 'equipment_costs'], responsibilities: ['Estimation coûts', 'Analyse prix', 'Budgets'], reportsTo: 'estimation_lead', tasksCompleted: 934, accuracy: 96, avgResponseTime: '4.1s' },
      { id: 'bid_specialist', name: 'Soumissions', icon: '📝', level: 'L3', status: 'idle', speciality: 'Offres', tools: ['bid_template', 'competitor_analyzer', 'proposal_generator'], responsibilities: ['Préparation offres', 'Analyse concurrence', 'Documentation'], reportsTo: 'estimation_lead', tasksCompleted: 234, accuracy: 94, avgResponseTime: '5.2s' }
    ]
  },
  {
    id: 'architecture', name: 'Architecture & Design', icon: '🏛️', color: colors.architecture,
    agents: [
      { id: 'architecture_lead', name: 'Chef Architecture', icon: '🏛️', level: 'L2', status: 'active', speciality: 'Design', tools: ['design_reviewer', 'code_checker', 'space_planner'], responsibilities: ['Direction artistique', 'Validation designs', 'Innovation'], delegatesTo: ['architect', 'interior_designer', 'bim_specialist'], reportsTo: 'director', tasksCompleted: 445, accuracy: 99, avgResponseTime: '2.8s' },
      { id: 'architect', name: 'Architecte', icon: '🏠', level: 'L3', status: 'active', speciality: 'Conception', tools: ['floor_plan_generator', 'elevation_creator', '3d_modeler', 'rendering_engine'], responsibilities: ['Plans architecturaux', 'Élévations', 'Rendus 3D'], reportsTo: 'architecture_lead', tasksCompleted: 567, accuracy: 97, avgResponseTime: '6.5s' },
      { id: 'interior_designer', name: 'Designer Intérieur', icon: '🛋️', level: 'L3', status: 'idle', speciality: 'Intérieurs', tools: ['material_selector', 'color_palette', 'furniture_planner'], responsibilities: ['Aménagement', 'Finitions', 'Éclairage'], reportsTo: 'architecture_lead', tasksCompleted: 312, accuracy: 95, avgResponseTime: '3.2s' },
      { id: 'bim_specialist', name: 'Spécialiste BIM', icon: '💻', level: 'L3', status: 'busy', speciality: 'BIM', tools: ['revit_automator', 'clash_detector', 'model_coordinator'], responsibilities: ['Modèles BIM', 'Coordination 3D', 'Détection conflits'], reportsTo: 'architecture_lead', tasksCompleted: 789, accuracy: 98, avgResponseTime: '4.8s' }
    ]
  },
  {
    id: 'conformite', name: 'Conformité & Légal', icon: '⚖️', color: colors.conformite,
    agents: [
      { id: 'compliance_lead', name: 'Chef Conformité', icon: '⚖️', level: 'L2', status: 'active', speciality: 'Réglementation', tools: ['regulation_checker', 'permit_tracker', 'compliance_reporter'], responsibilities: ['Conformité codes', 'Gestion permis', 'Audits'], delegatesTo: ['permit_coordinator', 'safety_officer', 'legal_specialist'], reportsTo: 'director', tasksCompleted: 345, accuracy: 99, avgResponseTime: '1.5s' },
      { id: 'permit_coordinator', name: 'Coordonnateur Permis', icon: '📋', level: 'L3', status: 'active', speciality: 'Permis', tools: ['permit_application', 'status_tracker', 'document_compiler'], responsibilities: ['Demandes permis', 'Suivi approbations', 'Documentation'], reportsTo: 'compliance_lead', tasksCompleted: 456, accuracy: 97, avgResponseTime: '2.1s' },
      { id: 'safety_officer', name: 'Agent Sécurité', icon: '🦺', level: 'L3', status: 'active', speciality: 'SST', tools: ['hazard_identifier', 'incident_reporter', 'training_tracker'], responsibilities: ['Inspections sécurité', 'Formation SST', 'Rapports incidents'], reportsTo: 'compliance_lead', tasksCompleted: 1234, accuracy: 98, avgResponseTime: '0.8s' }
    ]
  },
  {
    id: 'qualite', name: 'Qualité & Contrôle', icon: '✅', color: colors.qualite,
    agents: [
      { id: 'quality_controller', name: 'Contrôleur Qualité', icon: '✅', level: 'L3', status: 'active', speciality: 'Qualité', tools: ['inspection_checklist', 'deficiency_tracker', 'photo_documenter'], responsibilities: ['Inspections', 'Déficiences', 'Rapports qualité'], reportsTo: 'project_manager', tasksCompleted: 2345, accuracy: 96, avgResponseTime: '1.2s' },
      { id: 'commissioning', name: 'Mise en Service', icon: '🔧', level: 'L3', status: 'idle', speciality: 'Commissioning', tools: ['test_protocol', 'performance_verifier', 'documentation_compiler'], responsibilities: ['Tests systèmes', 'Mise en service', 'Formation'], reportsTo: 'project_manager', tasksCompleted: 178, accuracy: 99, avgResponseTime: '3.5s' }
    ]
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// STATUS BADGE
// ═══════════════════════════════════════════════════════════════════════════════

const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig: Record<string, { color: string; label: string; pulse: boolean }> = {
    active: { color: '#10B981', label: 'Actif', pulse: true },
    busy: { color: '#F59E0B', label: 'Occupé', pulse: true },
    idle: { color: '#6B7280', label: 'En attente', pulse: false },
    offline: { color: '#EF4444', label: 'Hors ligne', pulse: false }
  };
  const config = statusConfig[status] || statusConfig.offline;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ position: 'relative' }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: config.color }} />
        {config.pulse && (
          <div style={{ position: 'absolute', inset: -2, borderRadius: '50%', background: config.color, opacity: 0.3, animation: 'pulse 2s infinite' }} />
        )}
      </div>
      <span style={{ fontSize: 11, color: config.color, fontWeight: 500 }}>{config.label}</span>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT CARD
// ═══════════════════════════════════════════════════════════════════════════════

const AgentCard = ({ agent, departmentColor, isSelected, onClick }: { agent: any; departmentColor: string; isSelected: boolean; onClick: () => void }) => {
  return (
    <div
      onClick={onClick}
      style={{
        background: isSelected ? `${departmentColor}15` : colors.slate,
        border: `2px solid ${isSelected ? departmentColor : colors.border}`,
        borderRadius: 12, padding: 16, cursor: 'pointer',
        transition: 'all 0.2s ease',
        transform: isSelected ? 'scale(1.02)' : 'scale(1)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: `linear-gradient(135deg, ${departmentColor}, ${departmentColor}80)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24
        }}>{agent.icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <h4 style={{ color: colors.sand, margin: 0, fontSize: 14, fontWeight: 600 }}>{agent.name}</h4>
            <span style={{
              background: agent.level === 'L1' ? colors.direction : agent.level === 'L2' ? colors.projet : colors.stone,
              color: 'white', padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 600
            }}>{agent.level}</span>
          </div>
          <StatusBadge status={agent.status} />
          {agent.speciality && (
            <span style={{ display: 'inline-block', marginTop: 8, background: `${departmentColor}30`, color: departmentColor, padding: '3px 8px', borderRadius: 6, fontSize: 11 }}>
              {agent.speciality}
            </span>
          )}
        </div>
      </div>
      
      {/* Tools Preview */}
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 12 }}>
        {agent.tools.slice(0, 3).map((tool: string) => (
          <span key={tool} style={{ background: colors.card, color: colors.stone, padding: '4px 8px', borderRadius: 6, fontSize: 10 }}>
            🔧 {tool.replace(/_/g, ' ')}
          </span>
        ))}
        {agent.tools.length > 3 && (
          <span style={{ background: colors.card, color: colors.stone, padding: '4px 8px', borderRadius: 6, fontSize: 10 }}>
            +{agent.tools.length - 3}
          </span>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 16, marginTop: 12, paddingTop: 12, borderTop: `1px solid ${colors.border}` }}>
        <div>
          <div style={{ color: colors.sand, fontSize: 14, fontWeight: 600 }}>{agent.tasksCompleted.toLocaleString()}</div>
          <div style={{ color: colors.stone, fontSize: 10 }}>Tâches</div>
        </div>
        <div>
          <div style={{ color: colors.sand, fontSize: 14, fontWeight: 600 }}>{agent.accuracy}%</div>
          <div style={{ color: colors.stone, fontSize: 10 }}>Précision</div>
        </div>
        <div>
          <div style={{ color: colors.sand, fontSize: 14, fontWeight: 600 }}>{agent.avgResponseTime}</div>
          <div style={{ color: colors.stone, fontSize: 10 }}>Temps rép.</div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT DETAIL PANEL
// ═══════════════════════════════════════════════════════════════════════════════

const AgentDetailPanel = ({ agent, departmentColor, onClose }: { agent: any; departmentColor: string; onClose: () => void }) => {
  const [activeSection, setActiveSection] = useState<'overview' | 'tools' | 'tasks' | 'analytics'>('overview');

  return (
    <div style={{ background: colors.slate, border: `1px solid ${colors.moss}`, borderRadius: 16, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${departmentColor}, ${departmentColor}80)`, padding: 24, position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(0,0,0,0.3)', border: 'none', color: 'white', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', fontSize: 18 }}>×</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 72, height: 72, background: 'rgba(255,255,255,0.2)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>{agent.icon}</div>
          <div>
            <h2 style={{ color: 'white', margin: 0, fontSize: 20 }}>{agent.name}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
              <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', padding: '4px 10px', borderRadius: 6, fontSize: 12 }}>Niveau {agent.level}</span>
              {agent.speciality && <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', padding: '4px 10px', borderRadius: 6, fontSize: 12 }}>{agent.speciality}</span>}
              <StatusBadge status={agent.status} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${colors.border}` }}>
        {[
          { id: 'overview', label: '📋 Aperçu' },
          { id: 'tools', label: '🔧 Outils' },
          { id: 'tasks', label: '✅ Tâches' },
          { id: 'analytics', label: '📊 Analytics' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id as any)}
            style={{
              flex: 1, padding: 14, background: 'transparent', border: 'none',
              borderBottom: activeSection === tab.id ? `2px solid ${departmentColor}` : '2px solid transparent',
              color: activeSection === tab.id ? departmentColor : colors.stone,
              cursor: 'pointer', fontSize: 13, fontWeight: activeSection === tab.id ? 600 : 400
            }}
          >{tab.label}</button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: 20 }}>
        {activeSection === 'overview' && (
          <>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
              {[
                { label: 'Tâches complétées', value: agent.tasksCompleted.toLocaleString(), icon: '✅' },
                { label: 'Précision', value: `${agent.accuracy}%`, icon: '🎯' },
                { label: 'Temps de réponse', value: agent.avgResponseTime, icon: '⚡' }
              ].map((stat, i) => (
                <div key={i} style={{ background: colors.card, borderRadius: 12, padding: 16, textAlign: 'center' }}>
                  <span style={{ fontSize: 24 }}>{stat.icon}</span>
                  <div style={{ color: colors.sand, fontSize: 20, fontWeight: 700, marginTop: 8 }}>{stat.value}</div>
                  <div style={{ color: colors.stone, fontSize: 11 }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Responsibilities */}
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ color: colors.sand, margin: '0 0 12px', fontSize: 14 }}>📋 Responsabilités</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {agent.responsibilities.map((resp: string, i: number) => (
                  <div key={i} style={{ background: colors.card, padding: '10px 14px', borderRadius: 8, color: colors.sand, fontSize: 13 }}>
                    • {resp}
                  </div>
                ))}
              </div>
            </div>

            {/* Delegation */}
            {agent.delegatesTo && (
              <div>
                <h4 style={{ color: colors.sand, margin: '0 0 12px', fontSize: 14 }}>👥 Délègue à</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {agent.delegatesTo.map((sub: string) => (
                    <span key={sub} style={{ background: `${departmentColor}20`, color: departmentColor, padding: '6px 12px', borderRadius: 8, fontSize: 12 }}>
                      → {sub.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {activeSection === 'tools' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            {agent.tools.map((tool: string) => (
              <div key={tool} style={{ background: colors.card, borderRadius: 12, padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 24 }}>🔧</span>
                  <div>
                    <div style={{ color: colors.sand, fontSize: 13, fontWeight: 500 }}>{tool.replace(/_/g, ' ')}</div>
                    <div style={{ color: colors.stone, fontSize: 11 }}>Outil actif</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeSection === 'tasks' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <h4 style={{ color: colors.sand, margin: 0 }}>Tâches récentes</h4>
              <button style={{ background: departmentColor, border: 'none', color: 'white', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 12 }}>+ Assigner tâche</button>
            </div>
            {[
              { task: 'Analyse du projet Laval', status: 'completed', time: 'il y a 2h' },
              { task: 'Estimation coûts Phase 2', status: 'in_progress', time: 'En cours' },
              { task: 'Revue documentation', status: 'pending', time: 'En attente' }
            ].map((task, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: colors.card, borderRadius: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 18 }}>
                  {task.status === 'completed' ? '✅' : task.status === 'in_progress' ? '🔄' : '⏳'}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ color: colors.sand, fontSize: 13 }}>{task.task}</div>
                  <div style={{ color: colors.stone, fontSize: 11 }}>{task.time}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeSection === 'analytics' && (
          <div>
            <div style={{ background: colors.card, borderRadius: 12, padding: 20, marginBottom: 16 }}>
              <h4 style={{ color: colors.sand, margin: '0 0 16px' }}>Performance (7 derniers jours)</h4>
              <div style={{ height: 120, display: 'flex', alignItems: 'flex-end', gap: 8 }}>
                {[65, 82, 74, 91, 88, 95, 89].map((value, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: '100%', height: value, background: `linear-gradient(180deg, ${departmentColor}, ${departmentColor}60)`, borderRadius: 4 }} />
                    <span style={{ color: colors.stone, fontSize: 10 }}>{['L', 'M', 'M', 'J', 'V', 'S', 'D'][i]}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              <div style={{ background: colors.card, borderRadius: 12, padding: 16 }}>
                <div style={{ color: colors.stone, fontSize: 12 }}>Tâches cette semaine</div>
                <div style={{ color: colors.sand, fontSize: 24, fontWeight: 700 }}>47</div>
                <div style={{ color: '#10B981', fontSize: 12 }}>+12% vs semaine dernière</div>
              </div>
              <div style={{ background: colors.card, borderRadius: 12, padding: 16 }}>
                <div style={{ color: colors.stone, fontSize: 12 }}>Temps moyen</div>
                <div style={{ color: colors.sand, fontSize: 24, fontWeight: 700 }}>{agent.avgResponseTime}</div>
                <div style={{ color: '#10B981', fontSize: 12 }}>-0.3s amélioration</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div style={{ padding: 20, borderTop: `1px solid ${colors.border}`, display: 'flex', gap: 12 }}>
        <button style={{ flex: 1, padding: 12, background: departmentColor, border: 'none', borderRadius: 8, color: 'white', fontWeight: 600, cursor: 'pointer' }}>💬 Interagir</button>
        <button style={{ flex: 1, padding: 12, background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 8, color: colors.sand, fontWeight: 500, cursor: 'pointer' }}>⚙️ Configurer</button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// HIERARCHY TREE VIEW
// ═══════════════════════════════════════════════════════════════════════════════

const HierarchyTree = ({ onSelectAgent }: { onSelectAgent: (agent: any, color: string) => void }) => {
  const director = DEPARTMENTS[0].agents[0];
  const l2Agents = DEPARTMENTS.slice(1).flatMap(d => d.agents.filter(a => a.level === 'L2').map(a => ({ ...a, color: d.color })));

  return (
    <div style={{ padding: 24, background: colors.slate, borderRadius: 16, border: `1px solid ${colors.moss}` }}>
      <h3 style={{ color: colors.sand, margin: '0 0 24px', display: 'flex', alignItems: 'center', gap: 8 }}>
        🌳 Vue hiérarchique
      </h3>
      
      {/* Level 1 - Director */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
        <div
          onClick={() => onSelectAgent(director, colors.direction)}
          style={{
            background: `linear-gradient(135deg, ${colors.direction}, ${colors.direction}80)`,
            padding: 16, borderRadius: 12, cursor: 'pointer', textAlign: 'center', minWidth: 160
          }}
        >
          <span style={{ fontSize: 32 }}>{director.icon}</span>
          <div style={{ color: 'white', fontWeight: 600, marginTop: 8 }}>{director.name}</div>
          <StatusBadge status={director.status} />
        </div>
      </div>

      {/* Connection Line */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
        <div style={{ width: 2, height: 24, background: colors.border }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
        <div style={{ width: '80%', height: 2, background: colors.border, position: 'relative' }}>
          {l2Agents.map((_, i) => (
            <div key={i} style={{
              position: 'absolute', top: 0, left: `${(100 / (l2Agents.length + 1)) * (i + 1)}%`,
              width: 2, height: 24, background: colors.border
            }} />
          ))}
        </div>
      </div>

      {/* Level 2 */}
      <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 16 }}>
        {l2Agents.map(agent => (
          <div
            key={agent.id}
            onClick={() => onSelectAgent(agent, agent.color)}
            style={{
              background: colors.card, border: `2px solid ${agent.color}`,
              padding: 12, borderRadius: 12, cursor: 'pointer', textAlign: 'center', minWidth: 120
            }}
          >
            <span style={{ fontSize: 24 }}>{agent.icon}</span>
            <div style={{ color: colors.sand, fontWeight: 500, fontSize: 12, marginTop: 4 }}>{agent.name}</div>
            <StatusBadge status={agent.status} />
          </div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export default function MyTeamAgents() {
  const [selectedDepartment, setSelectedDepartment] = useState(DEPARTMENTS[0].id);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [selectedColor, setSelectedColor] = useState(colors.direction);
  const [viewMode, setViewMode] = useState<'grid' | 'hierarchy'>('grid');

  const currentDepartment = DEPARTMENTS.find(d => d.id === selectedDepartment)!;
  const totalAgents = DEPARTMENTS.reduce((sum, d) => sum + d.agents.length, 0);
  const activeAgents = DEPARTMENTS.reduce((sum, d) => sum + d.agents.filter(a => a.status === 'active').length, 0);

  const handleSelectAgent = (agent: any, color: string) => {
    setSelectedAgent(agent);
    setSelectedColor(color);
  };

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ color: colors.sand, fontSize: 26, fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
            👥 My Team
            <span style={{ background: colors.gold, color: colors.slate, padding: '4px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600 }}>{totalAgents} agents</span>
          </h1>
          <p style={{ color: colors.stone, margin: '4px 0 0', fontSize: 14 }}>
            Gérez votre équipe d'agents IA · <span style={{ color: '#10B981' }}>{activeAgents} actifs</span>
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ display: 'flex', background: colors.card, borderRadius: 8, padding: 4 }}>
            <button onClick={() => setViewMode('grid')} style={{ padding: '8px 16px', background: viewMode === 'grid' ? colors.moss : 'transparent', border: 'none', borderRadius: 6, color: viewMode === 'grid' ? colors.gold : colors.stone, cursor: 'pointer' }}>▦ Grille</button>
            <button onClick={() => setViewMode('hierarchy')} style={{ padding: '8px 16px', background: viewMode === 'hierarchy' ? colors.moss : 'transparent', border: 'none', borderRadius: 6, color: viewMode === 'hierarchy' ? colors.gold : colors.stone, cursor: 'pointer' }}>🌳 Hiérarchie</button>
          </div>
          <button style={{ padding: '10px 20px', background: colors.gold, border: 'none', borderRadius: 8, color: colors.slate, fontWeight: 600, cursor: 'pointer' }}>+ Créer un agent</button>
        </div>
      </div>

      {viewMode === 'hierarchy' ? (
        <HierarchyTree onSelectAgent={handleSelectAgent} />
      ) : (
        <>
          {/* Department Tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
            {DEPARTMENTS.map(dept => (
              <button
                key={dept.id}
                onClick={() => { setSelectedDepartment(dept.id); setSelectedAgent(null); }}
                style={{
                  padding: '10px 16px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 500,
                  background: selectedDepartment === dept.id ? dept.color : colors.card,
                  border: `1px solid ${selectedDepartment === dept.id ? dept.color : colors.border}`,
                  color: selectedDepartment === dept.id ? 'white' : colors.sand,
                  display: 'flex', alignItems: 'center', gap: 8
                }}
              >
                <span>{dept.icon}</span>
                {dept.name}
                <span style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: 10, fontSize: 11 }}>
                  {dept.agents.length}
                </span>
              </button>
            ))}
          </div>

          {/* Content Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: selectedAgent ? '1fr 400px' : '1fr', gap: 24 }}>
            {/* Agents Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16, alignContent: 'start' }}>
              {currentDepartment.agents.map(agent => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  departmentColor={currentDepartment.color}
                  isSelected={selectedAgent?.id === agent.id}
                  onClick={() => handleSelectAgent(agent, currentDepartment.color)}
                />
              ))}
            </div>

            {/* Agent Detail Panel */}
            {selectedAgent && (
              <AgentDetailPanel
                agent={selectedAgent}
                departmentColor={selectedColor}
                onClose={() => setSelectedAgent(null)}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
