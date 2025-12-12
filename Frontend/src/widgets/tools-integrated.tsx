import React, { useState } from 'react';

// Structure organisationnelle
const organizationStructure = {
  company: {
    name: "Construction ABC Inc.",
    departments: ["Estimation", "Architecture", "Ingénierie", "Gestion de Projet", "Conformité", "Chantier"]
  },
  projects: [
    { id: "PRJ-2024-001", name: "Centre Commercial Phase 2", status: "active", phase: "construction" },
    { id: "PRJ-2024-002", name: "Tour Résidentielle", status: "active", phase: "design" },
    { id: "PRJ-2024-003", name: "École Primaire", status: "bidding", phase: "estimation" },
  ]
};

// Outils organisés par contexte d'utilisation
const toolsLibrary = {
  // NIVEAU ENTREPRISE - Outils globaux
  enterprise: {
    name: "🏢 Outils Entreprise",
    desc: "Disponibles pour toute l'organisation",
    tools: [
      { id: "cost_database", name: "Base de Données Coûts", icon: "🗄️", desc: "Prix unitaires historiques", scope: "global" },
      { id: "supplier_directory", name: "Répertoire Fournisseurs", icon: "📇", desc: "Liste des fournisseurs approuvés", scope: "global" },
      { id: "employee_directory", name: "Répertoire Employés", icon: "👥", desc: "Compétences et disponibilités", scope: "global" },
      { id: "equipment_inventory", name: "Inventaire Équipements", icon: "🚜", desc: "Équipements et disponibilités", scope: "global" },
      { id: "template_library", name: "Bibliothèque Templates", icon: "📚", desc: "Documents et formulaires standards", scope: "global" },
    ]
  },
  
  // NIVEAU DÉPARTEMENT
  departments: {
    "Estimation": {
      name: "💰 Département Estimation",
      tools: [
        { id: "takeoff_calculator", name: "Calculateur Quantités", icon: "📐", desc: "Relevé de quantités depuis plans", forTasks: ["Relevé quantités", "Estimation"] },
        { id: "pricing_engine", name: "Moteur de Prix", icon: "💵", desc: "Application des prix unitaires", forTasks: ["Estimation coûts"] },
        { id: "bid_analyzer", name: "Analyseur Soumissions", icon: "📊", desc: "Analyse compétitive", forTasks: ["Préparation soumission"] },
        { id: "margin_calculator", name: "Calculateur Marge", icon: "📈", desc: "Calcul profit et contingence", forTasks: ["Révision prix"] },
        { id: "comparison_tool", name: "Comparateur Prix", icon: "⚖️", desc: "Compare soumissions sous-traitants", forTasks: ["Analyse sous-traitants"] },
      ]
    },
    "Architecture": {
      name: "🏛️ Département Architecture",
      tools: [
        { id: "space_planner", name: "Planificateur Espaces", icon: "📏", desc: "Optimisation des layouts", forTasks: ["Programmation", "Design concept"] },
        { id: "code_checker", name: "Vérificateur Codes", icon: "📚", desc: "Conformité CCQ/CNB", forTasks: ["Revue design", "Permis"] },
        { id: "material_selector", name: "Sélecteur Matériaux", icon: "🧱", desc: "Choix et specs matériaux", forTasks: ["Devis descriptif"] },
        { id: "rendering_engine", name: "Moteur Rendu", icon: "🖼️", desc: "Visualisations 3D", forTasks: ["Présentation client"] },
        { id: "area_calculator", name: "Calculateur Surfaces", icon: "📐", desc: "Calcul des aires", forTasks: ["Plans d'étage"] },
      ]
    },
    "Ingénierie": {
      name: "⚙️ Département Ingénierie",
      tools: [
        { id: "structural_calc", name: "Calculs Structure", icon: "🏗️", desc: "Dimensionnement structural", forTasks: ["Design structure"] },
        { id: "mep_sizer", name: "Dimensionneur MEP", icon: "🔧", desc: "Calculs CVAC-É-P", forTasks: ["Design MEP"] },
        { id: "load_calculator", name: "Calculateur Charges", icon: "⚖️", desc: "Charges et combinaisons", forTasks: ["Analyse charges"] },
        { id: "clash_detector", name: "Détecteur Conflits", icon: "💥", desc: "Clash detection BIM", forTasks: ["Coordination"] },
        { id: "energy_modeler", name: "Modélisateur Énergie", icon: "⚡", desc: "Simulation énergétique", forTasks: ["Efficacité énergétique"] },
      ]
    },
    "Gestion de Projet": {
      name: "📋 Département Gestion de Projet",
      tools: [
        { id: "schedule_builder", name: "Constructeur Échéancier", icon: "📅", desc: "Création Gantt", forTasks: ["Planification"] },
        { id: "budget_tracker", name: "Suivi Budget", icon: "💳", desc: "Coûts réels vs prévus", forTasks: ["Contrôle coûts"] },
        { id: "rfi_manager", name: "Gestionnaire RFI", icon: "❓", desc: "Demandes d'information", forTasks: ["Coordination"] },
        { id: "change_order", name: "Avenants", icon: "📝", desc: "Gestion des changements", forTasks: ["Gestion changements"] },
        { id: "progress_reporter", name: "Rapporteur Avancement", icon: "📊", desc: "Rapports périodiques", forTasks: ["Suivi avancement"] },
      ]
    },
    "Conformité": {
      name: "⚖️ Département Conformité",
      tools: [
        { id: "permit_generator", name: "Générateur Permis", icon: "📜", desc: "Formulaires de demande", forTasks: ["Demande permis"] },
        { id: "inspection_checklist", name: "Check-list Inspection", icon: "✅", desc: "Listes de vérification", forTasks: ["Inspection"] },
        { id: "safety_planner", name: "Planificateur SST", icon: "🦺", desc: "Plans de sécurité", forTasks: ["Plan sécurité"] },
        { id: "contract_analyzer", name: "Analyseur Contrats", icon: "📑", desc: "Revue clauses", forTasks: ["Revue contrat"] },
        { id: "compliance_auditor", name: "Auditeur Conformité", icon: "🔍", desc: "Vérification conformité", forTasks: ["Audit"] },
      ]
    },
    "Chantier": {
      name: "👷 Département Chantier",
      tools: [
        { id: "daily_log", name: "Journal Quotidien", icon: "📓", desc: "Rapports journaliers", forTasks: ["Rapport quotidien"] },
        { id: "photo_documenter", name: "Documentation Photo", icon: "📷", desc: "Photos annotées", forTasks: ["Documentation"] },
        { id: "crew_manager", name: "Gestion Équipes", icon: "👥", desc: "Assignation main-d'œuvre", forTasks: ["Coordination terrain"] },
        { id: "delivery_tracker", name: "Suivi Livraisons", icon: "🚚", desc: "Matériaux et équipements", forTasks: ["Réception matériaux"] },
        { id: "deficiency_tracker", name: "Suivi Déficiences", icon: "🔧", desc: "Liste des déficiences", forTasks: ["Contrôle qualité"] },
      ]
    }
  },

  // NIVEAU PROJET - Outils spécifiques par phase
  projectPhases: {
    "estimation": ["takeoff_calculator", "pricing_engine", "bid_analyzer", "margin_calculator"],
    "design": ["space_planner", "code_checker", "material_selector", "clash_detector", "rendering_engine"],
    "permitting": ["permit_generator", "code_checker", "compliance_auditor"],
    "construction": ["daily_log", "photo_documenter", "crew_manager", "delivery_tracker", "progress_reporter"],
    "closeout": ["deficiency_tracker", "inspection_checklist", "photo_documenter"]
  }
};

export default function ConstructionToolsIntegrated() {
  const [viewMode, setViewMode] = useState('department'); // 'department', 'project', 'task'
  const [selectedDept, setSelectedDept] = useState('Estimation');
  const [selectedProject, setSelectedProject] = useState(organizationStructure.projects[0]);
  const [selectedTool, setSelectedTool] = useState(null);
  const [expandedTask, setExpandedTask] = useState(null);

  // Tâches exemple pour un projet
  const projectTasks = {
    "PRJ-2024-001": [
      { id: "T1", name: "Coordination MEP", phase: "construction", subtasks: [
        { id: "T1.1", name: "Revue modèles BIM", tools: ["clash_detector"] },
        { id: "T1.2", name: "Résolution conflits", tools: ["clash_detector", "rfi_manager"] },
      ]},
      { id: "T2", name: "Rapport hebdomadaire", phase: "construction", subtasks: [
        { id: "T2.1", name: "Collecte données", tools: ["daily_log", "photo_documenter"] },
        { id: "T2.2", name: "Compilation rapport", tools: ["progress_reporter"] },
      ]},
      { id: "T3", name: "Suivi budget", phase: "construction", subtasks: [
        { id: "T3.1", name: "Mise à jour coûts", tools: ["budget_tracker"] },
        { id: "T3.2", name: "Analyse écarts", tools: ["budget_tracker", "change_order"] },
      ]},
    ],
    "PRJ-2024-003": [
      { id: "T1", name: "Relevé quantités", phase: "estimation", subtasks: [
        { id: "T1.1", name: "Quantités structure", tools: ["takeoff_calculator"] },
        { id: "T1.2", name: "Quantités architecture", tools: ["takeoff_calculator", "area_calculator"] },
        { id: "T1.3", name: "Quantités MEP", tools: ["takeoff_calculator"] },
      ]},
      { id: "T2", name: "Estimation coûts", phase: "estimation", subtasks: [
        { id: "T2.1", name: "Prix matériaux", tools: ["pricing_engine", "cost_database"] },
        { id: "T2.2", name: "Prix main-d'œuvre", tools: ["pricing_engine"] },
        { id: "T2.3", name: "Frais généraux", tools: ["margin_calculator"] },
      ]},
      { id: "T3", name: "Préparation soumission", phase: "estimation", subtasks: [
        { id: "T3.1", name: "Analyse compétitive", tools: ["bid_analyzer"] },
        { id: "T3.2", name: "Révision finale", tools: ["margin_calculator"] },
      ]},
    ]
  };

  const getAllToolsFlat = () => {
    const tools = [];
    Object.values(toolsLibrary.departments).forEach(dept => {
      dept.tools.forEach(tool => tools.push(tool));
    });
    return tools;
  };

  const getToolById = (toolId) => {
    return getAllToolsFlat().find(t => t.id === toolId) || 
           toolsLibrary.enterprise.tools.find(t => t.id === toolId);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🔧</span>
            <div>
              <h1 className="text-2xl font-bold">Outils Construction</h1>
              <p className="text-gray-400">{organizationStructure.company.name}</p>
            </div>
          </div>
          
          {/* View Mode Selector */}
          <div className="flex bg-gray-800 rounded-lg p-1">
            {[
              { id: 'department', label: '🏢 Département', icon: '🏢' },
              { id: 'project', label: '📁 Projet', icon: '📁' },
              { id: 'task', label: '✅ Tâche', icon: '✅' },
            ].map(mode => (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id)}
                className={`px-4 py-2 rounded-lg transition ${
                  viewMode === mode.id ? 'bg-amber-600' : 'hover:bg-gray-700'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        {/* VIEW: DEPARTMENT */}
        {viewMode === 'department' && (
          <div className="grid grid-cols-4 gap-4">
            {/* Department List */}
            <div className="bg-gray-800 rounded-xl p-4">
              <h2 className="text-lg font-semibold mb-4 text-amber-400">🏢 Départements</h2>
              
              {/* Enterprise Tools */}
              <div 
                onClick={() => setSelectedDept('enterprise')}
                className={`p-3 rounded-lg mb-2 cursor-pointer transition ${
                  selectedDept === 'enterprise' ? 'bg-amber-600' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>🏢</span>
                  <span>Outils Globaux</span>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {toolsLibrary.enterprise.tools.length} outils
                </div>
              </div>

              <div className="border-t border-gray-700 my-3" />

              {Object.entries(toolsLibrary.departments).map(([deptName, dept]) => (
                <div
                  key={deptName}
                  onClick={() => setSelectedDept(deptName)}
                  className={`p-3 rounded-lg mb-2 cursor-pointer transition ${
                    selectedDept === deptName ? 'bg-amber-600' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  <div className="font-medium">{dept.name}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {dept.tools.length} outils
                  </div>
                </div>
              ))}
            </div>

            {/* Tools Grid */}
            <div className="col-span-2 bg-gray-800 rounded-xl p-4">
              <h2 className="text-lg font-semibold mb-4 text-blue-400">
                🔧 {selectedDept === 'enterprise' ? 'Outils Globaux' : toolsLibrary.departments[selectedDept]?.name}
              </h2>
              
              <div className="grid grid-cols-2 gap-3">
                {(selectedDept === 'enterprise' 
                  ? toolsLibrary.enterprise.tools 
                  : toolsLibrary.departments[selectedDept]?.tools || []
                ).map(tool => (
                  <div
                    key={tool.id}
                    onClick={() => setSelectedTool(tool)}
                    className={`bg-gray-700 rounded-lg p-4 cursor-pointer transition border-2 ${
                      selectedTool?.id === tool.id ? 'border-amber-500' : 'border-transparent hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{tool.icon}</span>
                      <h3 className="font-semibold">{tool.name}</h3>
                    </div>
                    <p className="text-sm text-gray-400">{tool.desc}</p>
                    {tool.forTasks && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {tool.forTasks.slice(0, 2).map(task => (
                          <span key={task} className="text-xs bg-gray-600 px-2 py-1 rounded">
                            {task}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Tool Detail */}
            <div className="bg-gray-800 rounded-xl p-4">
              {selectedTool ? (
                <>
                  <div className="text-center pb-4 border-b border-gray-700">
                    <span className="text-5xl">{selectedTool.icon}</span>
                    <h2 className="text-xl font-bold mt-2">{selectedTool.name}</h2>
                  </div>
                  <div className="mt-4 space-y-4">
                    <p className="text-gray-300">{selectedTool.desc}</p>
                    
                    {selectedTool.forTasks && (
                      <div>
                        <h3 className="text-sm text-gray-400 mb-2">📋 Utilisé pour:</h3>
                        {selectedTool.forTasks.map(task => (
                          <div key={task} className="bg-gray-700 px-3 py-2 rounded mb-1 text-sm">
                            ✓ {task}
                          </div>
                        ))}
                      </div>
                    )}

                    <button className="w-full bg-amber-600 hover:bg-amber-700 py-3 rounded-lg font-semibold transition">
                      ▶️ Lancer l'outil
                    </button>
                  </div>
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  ← Sélectionnez un outil
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW: PROJECT */}
        {viewMode === 'project' && (
          <div className="grid grid-cols-4 gap-4">
            {/* Project List */}
            <div className="bg-gray-800 rounded-xl p-4">
              <h2 className="text-lg font-semibold mb-4 text-amber-400">📁 Projets</h2>
              {organizationStructure.projects.map(project => (
                <div
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className={`p-3 rounded-lg mb-2 cursor-pointer transition ${
                    selectedProject?.id === project.id ? 'bg-amber-600' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  <div className="font-medium">{project.name}</div>
                  <div className="flex gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      project.status === 'active' ? 'bg-green-600' : 'bg-blue-600'
                    }`}>
                      {project.status}
                    </span>
                    <span className="text-xs bg-gray-600 px-2 py-0.5 rounded">
                      {project.phase}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Project Tools */}
            <div className="col-span-3 bg-gray-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-blue-400">
                  🔧 Outils - {selectedProject?.name}
                </h2>
                <span className="bg-purple-600 px-3 py-1 rounded text-sm">
                  Phase: {selectedProject?.phase}
                </span>
              </div>

              <p className="text-gray-400 mb-4">
                Outils recommandés pour la phase <strong>{selectedProject?.phase}</strong>
              </p>

              <div className="grid grid-cols-4 gap-3">
                {toolsLibrary.projectPhases[selectedProject?.phase]?.map(toolId => {
                  const tool = getToolById(toolId);
                  if (!tool) return null;
                  return (
                    <div key={toolId} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 cursor-pointer transition">
                      <div className="text-center">
                        <span className="text-3xl">{tool.icon}</span>
                        <h3 className="font-semibold mt-2">{tool.name}</h3>
                        <p className="text-xs text-gray-400 mt-1">{tool.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* VIEW: TASK */}
        {viewMode === 'task' && (
          <div className="grid grid-cols-3 gap-4">
            {/* Project & Task Selection */}
            <div className="bg-gray-800 rounded-xl p-4">
              <h2 className="text-lg font-semibold mb-4 text-amber-400">📁 Projet & Tâches</h2>
              
              {/* Project Selector */}
              <select 
                value={selectedProject?.id}
                onChange={(e) => setSelectedProject(organizationStructure.projects.find(p => p.id === e.target.value))}
                className="w-full bg-gray-700 rounded-lg px-4 py-2 mb-4"
              >
                {organizationStructure.projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>

              {/* Task Tree */}
              <div className="space-y-2">
                {(projectTasks[selectedProject?.id] || []).map(task => (
                  <div key={task.id} className="bg-gray-700 rounded-lg overflow-hidden">
                    <div 
                      onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                      className="p-3 cursor-pointer hover:bg-gray-600 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span>{expandedTask === task.id ? '📂' : '📁'}</span>
                        <span className="font-medium">{task.name}</span>
                      </div>
                      <span className="text-xs bg-gray-600 px-2 py-1 rounded">
                        {task.subtasks.length} sous-tâches
                      </span>
                    </div>
                    
                    {expandedTask === task.id && (
                      <div className="bg-gray-800 p-2 space-y-1">
                        {task.subtasks.map(subtask => (
                          <div 
                            key={subtask.id}
                            className="flex items-center justify-between p-2 bg-gray-700 rounded text-sm hover:bg-gray-600 cursor-pointer"
                          >
                            <span>└ {subtask.name}</span>
                            <div className="flex gap-1">
                              {subtask.tools.map(toolId => {
                                const tool = getToolById(toolId);
                                return tool ? (
                                  <span key={toolId} title={tool.name}>{tool.icon}</span>
                                ) : null;
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Task Tools */}
            <div className="col-span-2 bg-gray-800 rounded-xl p-4">
              <h2 className="text-lg font-semibold mb-4 text-blue-400">
                🔧 Outils par Tâche
              </h2>

              {expandedTask ? (
                <div className="space-y-4">
                  {projectTasks[selectedProject?.id]
                    ?.find(t => t.id === expandedTask)
                    ?.subtasks.map(subtask => (
                      <div key={subtask.id} className="bg-gray-700 rounded-lg p-4">
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <span>✅</span> {subtask.name}
                        </h3>
                        <div className="grid grid-cols-3 gap-3">
                          {subtask.tools.map(toolId => {
                            const tool = getToolById(toolId);
                            if (!tool) return null;
                            return (
                              <div key={toolId} className="bg-gray-600 rounded-lg p-3 hover:bg-gray-500 cursor-pointer transition">
                                <div className="flex items-center gap-2">
                                  <span className="text-2xl">{tool.icon}</span>
                                  <div>
                                    <div className="font-medium text-sm">{tool.name}</div>
                                    <div className="text-xs text-gray-400">{tool.desc}</div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))
                  }
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-500">
                  ← Sélectionnez une tâche pour voir les outils associés
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
