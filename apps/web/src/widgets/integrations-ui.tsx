import React, { useState } from 'react';

const integrations = [
  {
    id: "github",
    name: "GitHub",
    icon: "🐙",
    color: "from-gray-700 to-gray-900",
    status: "connected",
    description: "Versioning des configurations et templates",
    features: [
      "Configs des agents construction",
      "Templates d'estimation",
      "Documentation technique",
      "Historique des versions"
    ],
    stats: { repos: 12, commits: 234, branches: 5 },
    config: {
      owner: "construction-company",
      defaultRepo: "roady-configs",
      autoPush: true
    }
  },
  {
    id: "google_drive",
    name: "Google Drive",
    icon: "📁",
    color: "from-yellow-500 to-yellow-700",
    status: "connected",
    description: "Stockage des documents et plans de projet",
    features: [
      "Structure dossiers automatique",
      "Gestion des plans (PDF, DWG)",
      "Photos de chantier",
      "Rapports et soumissions"
    ],
    stats: { files: 1523, folders: 89, storage: "45.2 GB" },
    config: {
      rootFolder: "ROADY_Projects",
      autoSync: true,
      versionControl: true
    }
  },
  {
    id: "autodesk",
    name: "Autodesk BIM 360",
    icon: "🏗️",
    color: "from-blue-600 to-blue-800",
    status: "connected",
    description: "Coordination BIM et modèles 3D",
    features: [
      "Modèles Revit/Navisworks",
      "Clash Detection automatique",
      "Issues et RFI",
      "Coordination multi-discipline"
    ],
    stats: { models: 8, clashes: 23, issues: 45 },
    config: {
      hubId: "hub_123",
      autoClashCheck: true,
      notifyOnClash: true
    }
  },
  {
    id: "procore",
    name: "Procore",
    icon: "📋",
    color: "from-orange-500 to-orange-700",
    status: "disconnected",
    description: "Gestion de projet construction",
    features: [
      "Daily Logs automatiques",
      "RFI et Submittals",
      "Change Orders",
      "Budget tracking"
    ],
    stats: { projects: 0, rfis: 0, logs: 0 },
    config: {
      companyId: null,
      autoSync: false
    }
  },
  {
    id: "clickup",
    name: "ClickUp",
    icon: "✅",
    color: "from-purple-600 to-purple-800",
    status: "connected",
    description: "Gestion des tâches et équipes",
    features: [
      "Sync tâches ROADY",
      "Assignation automatique",
      "Suivi d'avancement",
      "Notifications"
    ],
    stats: { tasks: 156, completed: 134, active: 22 },
    config: {
      workspaceId: "team_456",
      defaultList: "Construction",
      autoCreate: true
    }
  },
  {
    id: "slack",
    name: "Slack",
    icon: "💬",
    color: "from-pink-600 to-pink-800",
    status: "connected",
    description: "Notifications et alertes",
    features: [
      "Alertes tâches complétées",
      "Notifications de clashes BIM",
      "Rapports quotidiens",
      "Alertes SST"
    ],
    stats: { messages: 892, channels: 5, alerts: 45 },
    config: {
      defaultChannel: "#construction",
      alertChannel: "#alerts",
      dailyReport: true
    }
  }
];

const folderStructure = [
  { name: "00_ADMINISTRATION", icon: "📂", subfolders: ["Contrats", "Correspondance", "Réunions", "Permis"] },
  { name: "01_DESIGN", icon: "📐", subfolders: ["Architecture", "Structure", "MEP", "Civil", "BIM"] },
  { name: "02_ESTIMATION", icon: "💰", subfolders: ["Quantités", "Soumissions", "Comparatifs"] },
  { name: "03_PLANIFICATION", icon: "📅", subfolders: ["Échéanciers", "Ressources", "Budgets"] },
  { name: "04_CONSTRUCTION", icon: "👷", subfolders: ["Journaux", "Photos", "Rapports_Qualité", "SST"] },
  { name: "05_FERMETURE", icon: "🏁", subfolders: ["As-Built", "Manuels", "Garanties", "Déficiences"] },
];

export default function ConstructionIntegrations() {
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showFolderStructure, setShowFolderStructure] = useState(false);

  const connectedCount = integrations.filter(i => i.status === 'connected').length;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">🔗</span>
          <div>
            <h1 className="text-2xl font-bold">Intégrations Construction</h1>
            <p className="text-gray-400">Connectez vos outils de gestion de projet</p>
          </div>
          <span className="ml-auto bg-green-600 px-4 py-2 rounded-full text-sm font-semibold">
            {connectedCount}/{integrations.length} connectées
          </span>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {['overview', 'drive', 'github', 'sync'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg transition ${
                activeTab === tab ? 'bg-amber-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {tab === 'overview' ? '📊 Vue d\'ensemble' :
               tab === 'drive' ? '📁 Drive Structure' :
               tab === 'github' ? '🐙 GitHub Repos' : '🔄 Synchronisation'}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-3 gap-4">
            {/* Integrations Grid */}
            <div className="col-span-2 grid grid-cols-2 gap-4">
              {integrations.map(integration => (
                <div
                  key={integration.id}
                  onClick={() => setSelectedIntegration(integration)}
                  className={`bg-gradient-to-br ${integration.color} rounded-xl p-4 cursor-pointer transition transform hover:scale-102 border-2 ${
                    selectedIntegration?.id === integration.id ? 'border-white' : 'border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{integration.icon}</span>
                      <div>
                        <h3 className="font-bold text-lg">{integration.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded ${
                          integration.status === 'connected' ? 'bg-green-500' : 'bg-red-500'
                        }`}>
                          {integration.status === 'connected' ? '● Connecté' : '○ Déconnecté'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-white/80 mb-3">{integration.description}</p>
                  <div className="flex gap-2 flex-wrap">
                    {Object.entries(integration.stats).slice(0, 3).map(([key, value]) => (
                      <span key={key} className="text-xs bg-black/30 px-2 py-1 rounded">
                        {key}: {value}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Detail Panel */}
            <div className="bg-gray-800 rounded-xl p-4">
              {selectedIntegration ? (
                <>
                  <div className="text-center pb-4 border-b border-gray-700">
                    <span className="text-5xl">{selectedIntegration.icon}</span>
                    <h2 className="text-xl font-bold mt-2">{selectedIntegration.name}</h2>
                    <span className={`text-sm px-3 py-1 rounded ${
                      selectedIntegration.status === 'connected' ? 'bg-green-600' : 'bg-red-600'
                    }`}>
                      {selectedIntegration.status === 'connected' ? '● Connecté' : '○ Déconnecté'}
                    </span>
                  </div>

                  <div className="mt-4 space-y-4">
                    <div>
                      <h3 className="text-sm text-gray-400 mb-2">📋 Fonctionnalités</h3>
                      {selectedIntegration.features.map((feature, idx) => (
                        <div key={idx} className="text-sm bg-gray-700 px-3 py-2 rounded mb-1">
                          ✓ {feature}
                        </div>
                      ))}
                    </div>

                    <div>
                      <h3 className="text-sm text-gray-400 mb-2">⚙️ Configuration</h3>
                      {Object.entries(selectedIntegration.config).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm bg-gray-700 px-3 py-2 rounded mb-1">
                          <span className="text-gray-400">{key}</span>
                          <span>{String(value)}</span>
                        </div>
                      ))}
                    </div>

                    <button className={`w-full py-3 rounded-lg font-semibold transition ${
                      selectedIntegration.status === 'connected' 
                        ? 'bg-red-600 hover:bg-red-700' 
                        : 'bg-green-600 hover:bg-green-700'
                    }`}>
                      {selectedIntegration.status === 'connected' ? 'Déconnecter' : 'Connecter'}
                    </button>
                  </div>
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  ← Sélectionnez une intégration
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'drive' && (
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">📁 Structure de Dossiers Projet</h2>
              <button className="bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-lg transition">
                + Créer Structure Projet
              </button>
            </div>
            <p className="text-gray-400 mb-6">
              Cette structure est automatiquement créée pour chaque nouveau projet de construction.
            </p>
            
            <div className="grid grid-cols-3 gap-4">
              {folderStructure.map(folder => (
                <div key={folder.name} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{folder.icon}</span>
                    <h3 className="font-semibold">{folder.name}</h3>
                  </div>
                  <div className="space-y-1">
                    {folder.subfolders.map(sub => (
                      <div key={sub} className="text-sm text-gray-400 pl-4 flex items-center gap-2">
                        <span>📄</span> {sub}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'github' && (
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">🐙 Repositories GitHub</h2>
              <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition">
                + Nouveau Repo
              </button>
            </div>
            
            <div className="space-y-3">
              {[
                { name: "roady-agent-configs", desc: "Configurations des agents construction", commits: 156, branch: "main" },
                { name: "estimation-templates", desc: "Templates d'estimation et prix unitaires", commits: 89, branch: "main" },
                { name: "project-PRJ-2024-001", desc: "Centre Commercial Phase 2", commits: 234, branch: "dev" },
                { name: "project-PRJ-2024-002", desc: "Tour Résidentielle Montréal", commits: 167, branch: "main" },
                { name: "construction-docs", desc: "Documentation technique ROADY", commits: 45, branch: "main" },
              ].map(repo => (
                <div key={repo.name} className="bg-gray-700 rounded-lg p-4 flex items-center gap-4">
                  <span className="text-2xl">📦</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-blue-400">{repo.name}</h3>
                    <p className="text-sm text-gray-400">{repo.desc}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">{repo.commits} commits</div>
                    <div className="text-xs text-gray-400">branch: {repo.branch}</div>
                  </div>
                  <button className="bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded text-sm">
                    Voir
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'sync' && (
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">🔄 État de Synchronisation</h2>
            
            <div className="space-y-4">
              {[
                { source: "ROADY", target: "GitHub", type: "Agent Configs", lastSync: "Il y a 5 min", status: "success" },
                { source: "ROADY", target: "Google Drive", type: "Rapports journaliers", lastSync: "Il y a 15 min", status: "success" },
                { source: "BIM 360", target: "ROADY", type: "Clash Reports", lastSync: "Il y a 1 heure", status: "success" },
                { source: "ROADY", target: "ClickUp", type: "Tâches", lastSync: "Il y a 30 min", status: "success" },
                { source: "ROADY", target: "Slack", type: "Notifications", lastSync: "Temps réel", status: "active" },
                { source: "ROADY", target: "Procore", type: "Daily Logs", lastSync: "Non connecté", status: "error" },
              ].map((sync, idx) => (
                <div key={idx} className="bg-gray-700 rounded-lg p-4 flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="bg-gray-600 px-3 py-1 rounded">{sync.source}</span>
                    <span className="text-gray-400">→</span>
                    <span className="bg-gray-600 px-3 py-1 rounded">{sync.target}</span>
                  </div>
                  <div className="flex-1">
                    <span className="text-gray-300">{sync.type}</span>
                  </div>
                  <div className="text-sm text-gray-400">{sync.lastSync}</div>
                  <div className={`w-3 h-3 rounded-full ${
                    sync.status === 'success' ? 'bg-green-500' :
                    sync.status === 'active' ? 'bg-blue-500 animate-pulse' : 'bg-red-500'
                  }`} />
                </div>
              ))}
            </div>

            <button className="mt-6 w-full bg-amber-600 hover:bg-amber-700 py-3 rounded-lg font-semibold transition">
              🔄 Synchroniser Tout Maintenant
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
