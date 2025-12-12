import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Structure complète de l'entreprise
const companyData = {
  name: "Construction ABC Inc.",
  stats: {
    activeProjects: 8,
    totalBudget: 45000000,
    employees: 156,
    onTimeRate: 87
  },
  departments: [
    { id: "estimation", name: "Estimation", icon: "💰", head: "Marc Tremblay", agents: 8, activeProjects: 3 },
    { id: "architecture", name: "Architecture", icon: "🏛️", head: "Sophie Lavoie", agents: 12, activeProjects: 5 },
    { id: "engineering", name: "Ingénierie", icon: "⚙️", head: "Jean-Pierre Roy", agents: 15, activeProjects: 6 },
    { id: "project_mgmt", name: "Gestion de Projet", icon: "📋", head: "Marie Côté", agents: 10, activeProjects: 8 },
    { id: "compliance", name: "Conformité", icon: "⚖️", head: "Pierre Gagnon", agents: 6, activeProjects: 4 },
    { id: "site", name: "Chantier", icon: "👷", head: "Luc Bélanger", agents: 25, activeProjects: 5 },
  ]
};

const projects = [
  {
    id: "PRJ-2024-001",
    name: "Centre Commercial Phase 2",
    client: "Groupe Immobilier XYZ",
    status: "active",
    phase: "construction",
    progress: 67,
    budget: { total: 15000000, spent: 9800000, committed: 2100000 },
    schedule: { start: "2024-03-01", end: "2025-06-30", daysRemaining: 180 },
    team: { pm: "Marie Côté", superintendent: "Luc Bélanger" },
    kpis: { onTime: true, onBudget: true, safety: 0, quality: 98 },
    tasks: { total: 245, completed: 164, inProgress: 52, pending: 29 },
    departments: ["architecture", "engineering", "project_mgmt", "site"]
  },
  {
    id: "PRJ-2024-002",
    name: "Tour Résidentielle Montréal",
    client: "Développements MTL",
    status: "active",
    phase: "design",
    progress: 35,
    budget: { total: 28000000, spent: 1200000, committed: 800000 },
    schedule: { start: "2024-06-01", end: "2026-12-31", daysRemaining: 730 },
    team: { pm: "André Martin", superintendent: "TBD" },
    kpis: { onTime: true, onBudget: true, safety: 0, quality: 100 },
    tasks: { total: 89, completed: 31, inProgress: 28, pending: 30 },
    departments: ["architecture", "engineering", "estimation"]
  },
  {
    id: "PRJ-2024-003",
    name: "École Primaire Laval",
    client: "CSSPI",
    status: "bidding",
    phase: "estimation",
    progress: 80,
    budget: { total: 8500000, spent: 45000, committed: 0 },
    schedule: { start: "2025-01-15", end: "2026-08-15", daysRemaining: null },
    team: { pm: "TBD", superintendent: "TBD" },
    kpis: { onTime: true, onBudget: true, safety: 0, quality: 100 },
    tasks: { total: 12, completed: 9, inProgress: 3, pending: 0 },
    departments: ["estimation", "architecture"]
  }
];

const recentActivity = [
  { time: "14:45", event: "✅ Soumission envoyée", project: "École Primaire", agent: "Estimateur", dept: "Estimation" },
  { time: "14:30", event: "📊 Rapport hebdo généré", project: "Centre Commercial", agent: "Gérant de Projet", dept: "Gestion" },
  { time: "14:15", event: "🔧 Clash résolu (#23)", project: "Tour Résidentielle", agent: "BIM Specialist", dept: "Ingénierie" },
  { time: "13:55", event: "📸 45 photos uploadées", project: "Centre Commercial", agent: "Superviseur", dept: "Chantier" },
  { time: "13:30", event: "📋 Permis approuvé", project: "Tour Résidentielle", agent: "Spécialiste Permis", dept: "Conformité" },
  { time: "13:00", event: "💰 Budget mis à jour", project: "Centre Commercial", agent: "Contrôleur Coûts", dept: "Estimation" },
];

const budgetTrend = [
  { month: "Jan", prévu: 1200000, réel: 1150000 },
  { month: "Fév", prévu: 2400000, réel: 2380000 },
  { month: "Mar", prévu: 3800000, réel: 3950000 },
  { month: "Avr", prévu: 5200000, réel: 5400000 },
  { month: "Mai", prévu: 6800000, réel: 7100000 },
  { month: "Jun", prévu: 8500000, réel: 8900000 },
];

const phaseDistribution = [
  { name: "Estimation", value: 2, color: "#F59E0B" },
  { name: "Design", value: 3, color: "#8B5CF6" },
  { name: "Construction", value: 5, color: "#10B981" },
  { name: "Fermeture", value: 1, color: "#3B82F6" },
];

export default function ConstructionDashboard() {
  const [selectedView, setSelectedView] = useState('company'); // 'company', 'department', 'project'
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Sidebar Navigation */}
      <div className={`${sidebarOpen ? 'w-72' : 'w-16'} bg-gray-800 transition-all duration-300 flex flex-col`}>
        {/* Company Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center text-xl font-bold">
              🏗️
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="font-bold">ROADY Construction</h1>
                <p className="text-xs text-gray-400">{companyData.name}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {/* Company Level */}
          <button
            onClick={() => { setSelectedView('company'); setSelectedDept(null); setSelectedProject(null); }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition ${
              selectedView === 'company' && !selectedDept ? 'bg-amber-600' : 'hover:bg-gray-700'
            }`}
          >
            <span>🏢</span>
            {sidebarOpen && <span>Vue Entreprise</span>}
          </button>

          {/* Departments */}
          {sidebarOpen && <div className="text-xs text-gray-500 uppercase mt-4 mb-2">Départements</div>}
          {companyData.departments.map(dept => (
            <button
              key={dept.id}
              onClick={() => { setSelectedView('department'); setSelectedDept(dept); setSelectedProject(null); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                selectedDept?.id === dept.id ? 'bg-amber-600' : 'hover:bg-gray-700'
              }`}
            >
              <span>{dept.icon}</span>
              {sidebarOpen && (
                <>
                  <span className="flex-1 text-left">{dept.name}</span>
                  <span className="text-xs bg-gray-600 px-2 py-0.5 rounded">{dept.activeProjects}</span>
                </>
              )}
            </button>
          ))}

          {/* Projects */}
          {sidebarOpen && <div className="text-xs text-gray-500 uppercase mt-4 mb-2">Projets Actifs</div>}
          {projects.filter(p => p.status === 'active').map(project => (
            <button
              key={project.id}
              onClick={() => { setSelectedView('project'); setSelectedProject(project); setSelectedDept(null); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                selectedProject?.id === project.id ? 'bg-amber-600' : 'hover:bg-gray-700'
              }`}
            >
              <span>📁</span>
              {sidebarOpen && (
                <div className="flex-1 text-left">
                  <div className="text-sm truncate">{project.name}</div>
                  <div className="text-xs text-gray-400">{project.progress}%</div>
                </div>
              )}
            </button>
          ))}
        </nav>

        {/* Collapse Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-4 border-t border-gray-700 text-gray-400 hover:text-white"
        >
          {sidebarOpen ? '◀ Réduire' : '▶'}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        {/* COMPANY VIEW */}
        {selectedView === 'company' && !selectedDept && !selectedProject && (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-amber-600 to-amber-800 rounded-xl p-4">
                <div className="text-3xl font-bold">{companyData.stats.activeProjects}</div>
                <div className="text-amber-200">Projets actifs</div>
              </div>
              <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-4">
                <div className="text-3xl font-bold">${(companyData.stats.totalBudget/1000000).toFixed(0)}M</div>
                <div className="text-green-200">Budget total</div>
              </div>
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-4">
                <div className="text-3xl font-bold">{companyData.stats.employees}</div>
                <div className="text-blue-200">Employés</div>
              </div>
              <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-4">
                <div className="text-3xl font-bold">{companyData.stats.onTimeRate}%</div>
                <div className="text-purple-200">Taux à temps</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {/* Projects Overview */}
              <div className="col-span-2 bg-gray-800 rounded-xl p-4">
                <h2 className="text-lg font-semibold mb-4">📁 Projets</h2>
                <div className="space-y-3">
                  {projects.map(project => (
                    <div 
                      key={project.id}
                      onClick={() => { setSelectedView('project'); setSelectedProject(project); }}
                      className="bg-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-600 transition"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{project.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded ${
                          project.phase === 'construction' ? 'bg-green-600' :
                          project.phase === 'design' ? 'bg-purple-600' : 'bg-amber-600'
                        }`}>
                          {project.phase}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                        <span>🏢 {project.client}</span>
                        <span>👤 {project.team.pm}</span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-2">
                        <div 
                          className="bg-amber-500 h-2 rounded-full"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between mt-2 text-xs text-gray-400">
                        <span>{project.progress}% complété</span>
                        <span>{project.tasks.completed}/{project.tasks.total} tâches</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity Feed & Charts */}
              <div className="space-y-4">
                {/* Phase Distribution */}
                <div className="bg-gray-800 rounded-xl p-4">
                  <h2 className="text-lg font-semibold mb-4">📊 Par Phase</h2>
                  <ResponsiveContainer width="100%" height={150}>
                    <PieChart>
                      <Pie data={phaseDistribution} dataKey="value" cx="50%" cy="50%" innerRadius={30} outerRadius={60}>
                        {phaseDistribution.map((entry, idx) => (
                          <Cell key={idx} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap gap-2 justify-center mt-2">
                    {phaseDistribution.map(p => (
                      <span key={p.name} className="text-xs flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                        {p.name}: {p.value}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-gray-800 rounded-xl p-4">
                  <h2 className="text-lg font-semibold mb-4">📜 Activité Récente</h2>
                  <div className="space-y-3 max-h-64 overflow-auto">
                    {recentActivity.map((activity, idx) => (
                      <div key={idx} className="flex gap-3 text-sm">
                        <span className="text-gray-500 w-12">{activity.time}</span>
                        <div>
                          <p>{activity.event}</p>
                          <p className="text-xs text-gray-500">{activity.project} • {activity.dept}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Budget Chart */}
            <div className="bg-gray-800 rounded-xl p-4 mt-6">
              <h2 className="text-lg font-semibold mb-4">💰 Tendance Budget Global</h2>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={budgetTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" tickFormatter={v => `$${v/1000000}M`} />
                  <Tooltip formatter={v => `$${(v/1000000).toFixed(2)}M`} />
                  <Line type="monotone" dataKey="prévu" stroke="#8B5CF6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="réel" stroke="#F59E0B" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {/* DEPARTMENT VIEW */}
        {selectedView === 'department' && selectedDept && (
          <>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl">{selectedDept.icon}</span>
              <div>
                <h1 className="text-2xl font-bold">{selectedDept.name}</h1>
                <p className="text-gray-400">Responsable: {selectedDept.head}</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-800 rounded-xl p-4">
                <div className="text-3xl font-bold text-amber-400">{selectedDept.agents}</div>
                <div className="text-gray-400">Agents ROADY</div>
              </div>
              <div className="bg-gray-800 rounded-xl p-4">
                <div className="text-3xl font-bold text-green-400">{selectedDept.activeProjects}</div>
                <div className="text-gray-400">Projets actifs</div>
              </div>
              <div className="bg-gray-800 rounded-xl p-4">
                <div className="text-3xl font-bold text-blue-400">24</div>
                <div className="text-gray-400">Tâches en cours</div>
              </div>
              <div className="bg-gray-800 rounded-xl p-4">
                <div className="text-3xl font-bold text-purple-400">156</div>
                <div className="text-gray-400">Complétées ce mois</div>
              </div>
            </div>

            {/* Department Projects */}
            <div className="bg-gray-800 rounded-xl p-4">
              <h2 className="text-lg font-semibold mb-4">📁 Projets du département</h2>
              <div className="grid grid-cols-2 gap-4">
                {projects.filter(p => p.departments.includes(selectedDept.id)).map(project => (
                  <div 
                    key={project.id}
                    onClick={() => { setSelectedView('project'); setSelectedProject(project); }}
                    className="bg-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-600"
                  >
                    <h3 className="font-semibold">{project.name}</h3>
                    <div className="text-sm text-gray-400 mt-1">{project.phase}</div>
                    <div className="mt-2 w-full bg-gray-600 rounded-full h-2">
                      <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${project.progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* PROJECT VIEW */}
        {selectedView === 'project' && selectedProject && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold">{selectedProject.name}</h1>
                <p className="text-gray-400">{selectedProject.client} • {selectedProject.id}</p>
              </div>
              <span className={`px-4 py-2 rounded-lg text-lg font-semibold ${
                selectedProject.phase === 'construction' ? 'bg-green-600' :
                selectedProject.phase === 'design' ? 'bg-purple-600' : 'bg-amber-600'
              }`}>
                {selectedProject.phase.toUpperCase()}
              </span>
            </div>

            {/* Project KPIs */}
            <div className="grid grid-cols-5 gap-4 mb-6">
              <div className="bg-gray-800 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-amber-400">{selectedProject.progress}%</div>
                <div className="text-gray-400 text-sm">Avancement</div>
              </div>
              <div className="bg-gray-800 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-green-400">${(selectedProject.budget.spent/1000000).toFixed(1)}M</div>
                <div className="text-gray-400 text-sm">Dépensé / ${(selectedProject.budget.total/1000000).toFixed(0)}M</div>
              </div>
              <div className="bg-gray-800 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-blue-400">{selectedProject.schedule.daysRemaining || 'N/A'}</div>
                <div className="text-gray-400 text-sm">Jours restants</div>
              </div>
              <div className="bg-gray-800 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-purple-400">{selectedProject.tasks.inProgress}</div>
                <div className="text-gray-400 text-sm">Tâches en cours</div>
              </div>
              <div className="bg-gray-800 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-teal-400">{selectedProject.kpis.quality}%</div>
                <div className="text-gray-400 text-sm">Score Qualité</div>
              </div>
            </div>

            {/* Project Tasks */}
            <div className="bg-gray-800 rounded-xl p-4">
              <h2 className="text-lg font-semibold mb-4">✅ Tâches du Projet</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-green-400 font-semibold mb-2">✓ Complétées ({selectedProject.tasks.completed})</h3>
                  <div className="text-4xl font-bold">{Math.round(selectedProject.tasks.completed / selectedProject.tasks.total * 100)}%</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-amber-400 font-semibold mb-2">⏳ En cours ({selectedProject.tasks.inProgress})</h3>
                  <div className="text-4xl font-bold">{Math.round(selectedProject.tasks.inProgress / selectedProject.tasks.total * 100)}%</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-gray-400 font-semibold mb-2">○ En attente ({selectedProject.tasks.pending})</h3>
                  <div className="text-4xl font-bold">{Math.round(selectedProject.tasks.pending / selectedProject.tasks.total * 100)}%</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
