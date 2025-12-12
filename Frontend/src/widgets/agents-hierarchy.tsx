import React, { useState } from 'react';

const constructionAgents = {
  "Direction Générale": {
    color: "from-amber-600 to-amber-800",
    agents: [
      { 
        id: "construction_director", 
        name: "Directeur Construction", 
        icon: "🏗️", 
        level: "L1",
        desc: "Supervise l'ensemble des opérations de construction",
        tools: ["project_overview", "resource_allocator", "risk_analyzer", "budget_master"],
        delegatesTo: ["project_manager", "estimation_lead", "architecture_lead", "compliance_lead", "engineering_lead"],
        responsibilities: [
          "Vision stratégique des projets",
          "Allocation des ressources majeures",
          "Relations avec les clients",
          "Décisions critiques"
        ]
      }
    ]
  },
  "Gestion de Projet": {
    color: "from-blue-600 to-blue-800",
    agents: [
      { 
        id: "project_manager", 
        name: "Gérant de Projet", 
        icon: "📋", 
        level: "L2",
        desc: "Coordonne l'exécution complète du projet",
        tools: ["schedule_builder", "gantt_generator", "milestone_tracker", "team_coordinator"],
        delegatesTo: ["site_supervisor", "scheduler", "procurement_manager", "quality_controller"],
        responsibilities: [
          "Planification et échéanciers",
          "Coordination des équipes",
          "Suivi budgétaire",
          "Communication client"
        ]
      },
      { 
        id: "site_supervisor", 
        name: "Superviseur de Chantier", 
        icon: "👷", 
        level: "L3",
        desc: "Gère les opérations quotidiennes sur le terrain",
        tools: ["daily_log", "crew_manager", "safety_checklist", "progress_reporter"],
        speciality: "Terrain",
        responsibilities: ["Supervision quotidienne", "Gestion des équipes", "Rapports journaliers"]
      },
      { 
        id: "scheduler", 
        name: "Planificateur", 
        icon: "📅", 
        level: "L3",
        desc: "Crée et optimise les calendriers de construction",
        tools: ["critical_path_analyzer", "resource_leveler", "delay_predictor", "schedule_optimizer"],
        speciality: "Planning",
        responsibilities: ["Échéanciers détaillés", "Analyse du chemin critique", "Optimisation des délais"]
      },
      { 
        id: "procurement_manager", 
        name: "Gestionnaire Approvisionnement", 
        icon: "📦", 
        level: "L3",
        desc: "Gère les achats et la chaîne d'approvisionnement",
        tools: ["supplier_database", "order_tracker", "inventory_manager", "price_comparator"],
        speciality: "Achats",
        responsibilities: ["Commandes matériaux", "Relations fournisseurs", "Gestion des stocks"]
      }
    ]
  },
  "Estimation & Coûts": {
    color: "from-green-600 to-green-800",
    agents: [
      { 
        id: "estimation_lead", 
        name: "Chef Estimation", 
        icon: "💰", 
        level: "L2",
        desc: "Supervise toutes les estimations et analyses de coûts",
        tools: ["cost_database", "estimate_validator", "margin_calculator", "bid_analyzer"],
        delegatesTo: ["quantity_surveyor", "cost_estimator", "bid_specialist", "value_engineer"],
        responsibilities: [
          "Validation des estimations",
          "Stratégie de soumission",
          "Analyse de rentabilité",
          "Contrôle des coûts"
        ]
      },
      { 
        id: "quantity_surveyor", 
        name: "Métreur / Quantity Surveyor", 
        icon: "📐", 
        level: "L3",
        desc: "Calcule les quantités de matériaux et main-d'œuvre",
        tools: ["takeoff_calculator", "material_lister", "labor_estimator", "unit_converter"],
        speciality: "Quantités",
        responsibilities: ["Relevés de quantités", "Listes de matériaux", "Calculs de surfaces/volumes"]
      },
      { 
        id: "cost_estimator", 
        name: "Estimateur de Coûts", 
        icon: "🧮", 
        level: "L3",
        desc: "Établit les prix et budgets détaillés",
        tools: ["pricing_engine", "labor_rates", "equipment_costs", "overhead_calculator"],
        speciality: "Prix",
        responsibilities: ["Estimation des coûts", "Analyse des prix", "Budgets préliminaires"]
      },
      { 
        id: "bid_specialist", 
        name: "Spécialiste Soumissions", 
        icon: "📝", 
        level: "L3",
        desc: "Prépare et analyse les appels d'offres",
        tools: ["bid_template", "competitor_analyzer", "proposal_generator", "win_rate_tracker"],
        speciality: "Soumissions",
        responsibilities: ["Préparation des offres", "Analyse concurrentielle", "Documentation"]
      },
      { 
        id: "value_engineer", 
        name: "Ingénieur Valeur", 
        icon: "⚖️", 
        level: "L3",
        desc: "Optimise le rapport qualité/prix des solutions",
        tools: ["alternative_finder", "cost_benefit_analyzer", "lifecycle_calculator", "savings_tracker"],
        speciality: "Optimisation",
        responsibilities: ["Analyse de valeur", "Alternatives économiques", "Optimisation des coûts"]
      }
    ]
  },
  "Architecture & Design": {
    color: "from-purple-600 to-purple-800",
    agents: [
      { 
        id: "architecture_lead", 
        name: "Chef Architecture", 
        icon: "🏛️", 
        level: "L2",
        desc: "Dirige la conception architecturale",
        tools: ["design_reviewer", "code_checker", "space_planner", "aesthetic_analyzer"],
        delegatesTo: ["architect", "interior_designer", "landscape_architect", "bim_specialist", "drafter"],
        responsibilities: [
          "Direction artistique",
          "Validation des designs",
          "Conformité architecturale",
          "Innovation design"
        ]
      },
      { 
        id: "architect", 
        name: "Architecte", 
        icon: "🏠", 
        level: "L3",
        desc: "Conçoit les plans et l'esthétique du bâtiment",
        tools: ["floor_plan_generator", "elevation_creator", "3d_modeler", "rendering_engine"],
        speciality: "Conception",
        responsibilities: ["Plans architecturaux", "Élévations", "Rendus 3D"]
      },
      { 
        id: "interior_designer", 
        name: "Designer d'Intérieur", 
        icon: "🛋️", 
        level: "L3",
        desc: "Conçoit les espaces intérieurs",
        tools: ["material_selector", "color_palette", "furniture_planner", "lighting_designer"],
        speciality: "Intérieurs",
        responsibilities: ["Aménagement intérieur", "Choix des finitions", "Éclairage"]
      },
      { 
        id: "landscape_architect", 
        name: "Architecte Paysagiste", 
        icon: "🌳", 
        level: "L3",
        desc: "Conçoit les aménagements extérieurs",
        tools: ["terrain_analyzer", "plant_database", "irrigation_planner", "hardscape_designer"],
        speciality: "Extérieurs",
        responsibilities: ["Aménagement paysager", "Espaces verts", "Stationnements"]
      },
      { 
        id: "bim_specialist", 
        name: "Spécialiste BIM", 
        icon: "💻", 
        level: "L3",
        desc: "Gère la modélisation des données du bâtiment",
        tools: ["revit_automator", "clash_detector", "model_coordinator", "data_extractor"],
        speciality: "BIM",
        responsibilities: ["Modèles BIM", "Coordination 3D", "Détection de conflits"]
      },
      { 
        id: "drafter", 
        name: "Dessinateur", 
        icon: "✏️", 
        level: "L3",
        desc: "Produit les dessins techniques détaillés",
        tools: ["cad_automator", "detail_library", "annotation_tool", "sheet_organizer"],
        speciality: "Dessins",
        responsibilities: ["Dessins d'exécution", "Détails techniques", "Plans as-built"]
      }
    ]
  },
  "Ingénierie": {
    color: "from-red-600 to-red-800",
    agents: [
      { 
        id: "engineering_lead", 
        name: "Chef Ingénierie", 
        icon: "⚙️", 
        level: "L2",
        desc: "Coordonne toutes les disciplines d'ingénierie",
        tools: ["engineering_coordinator", "calculation_validator", "spec_reviewer", "standards_checker"],
        delegatesTo: ["structural_engineer", "mep_engineer", "civil_engineer", "geotechnical_engineer", "environmental_engineer"],
        responsibilities: [
          "Coordination MEP",
          "Validation technique",
          "Normes et standards",
          "Innovation technique"
        ]
      },
      { 
        id: "structural_engineer", 
        name: "Ingénieur Structure", 
        icon: "🏢", 
        level: "L3",
        desc: "Conçoit la structure porteuse",
        tools: ["load_calculator", "beam_designer", "foundation_analyzer", "seismic_checker"],
        speciality: "Structure",
        responsibilities: ["Calculs structuraux", "Fondations", "Charpente"]
      },
      { 
        id: "mep_engineer", 
        name: "Ingénieur MEP", 
        icon: "🔌", 
        level: "L3",
        desc: "Conçoit les systèmes mécaniques, électriques, plomberie",
        tools: ["hvac_calculator", "electrical_load", "plumbing_sizer", "energy_modeler"],
        speciality: "MEP",
        responsibilities: ["CVAC", "Électricité", "Plomberie"]
      },
      { 
        id: "civil_engineer", 
        name: "Ingénieur Civil", 
        icon: "🛤️", 
        level: "L3",
        desc: "Conçoit les infrastructures civiles",
        tools: ["grading_calculator", "drainage_designer", "road_planner", "utility_coordinator"],
        speciality: "Civil",
        responsibilities: ["Terrassement", "Drainage", "Infrastructures"]
      },
      { 
        id: "geotechnical_engineer", 
        name: "Ingénieur Géotechnique", 
        icon: "🪨", 
        level: "L3",
        desc: "Analyse les sols et recommande les fondations",
        tools: ["soil_analyzer", "bearing_calculator", "settlement_predictor", "groundwater_assessor"],
        speciality: "Sols",
        responsibilities: ["Études de sol", "Recommandations fondations", "Analyse géologique"]
      },
      { 
        id: "environmental_engineer", 
        name: "Ingénieur Environnement", 
        icon: "🌿", 
        level: "L3",
        desc: "Gère les aspects environnementaux",
        tools: ["impact_assessor", "contamination_checker", "remediation_planner", "sustainability_scorer"],
        speciality: "Environnement",
        responsibilities: ["Études d'impact", "Décontamination", "LEED/Durabilité"]
      }
    ]
  },
  "Conformité & Légal": {
    color: "from-orange-600 to-orange-800",
    agents: [
      { 
        id: "compliance_lead", 
        name: "Chef Conformité", 
        icon: "⚖️", 
        level: "L2",
        desc: "Assure la conformité légale et réglementaire",
        tools: ["regulation_database", "permit_tracker", "inspection_scheduler", "compliance_auditor"],
        delegatesTo: ["permit_specialist", "code_analyst", "safety_officer", "contract_manager", "insurance_specialist"],
        responsibilities: [
          "Conformité globale",
          "Relations autorités",
          "Gestion des risques légaux",
          "Audits"
        ]
      },
      { 
        id: "permit_specialist", 
        name: "Spécialiste Permis", 
        icon: "📜", 
        level: "L3",
        desc: "Gère les demandes de permis et autorisations",
        tools: ["permit_application_generator", "submission_tracker", "document_compiler", "authority_database"],
        speciality: "Permis",
        responsibilities: ["Demandes de permis", "Suivi des approbations", "Documentation municipale"]
      },
      { 
        id: "code_analyst", 
        name: "Analyste Codes & Normes", 
        icon: "📚", 
        level: "L3",
        desc: "Interprète et applique les codes du bâtiment",
        tools: ["code_searcher", "requirement_extractor", "compliance_checker", "code_updater"],
        speciality: "Codes",
        responsibilities: ["Interprétation des codes", "Conformité CCQ/CNB", "Normes de sécurité"]
      },
      { 
        id: "safety_officer", 
        name: "Agent de Sécurité", 
        icon: "🦺", 
        level: "L3",
        desc: "Gère la santé et sécurité au travail",
        tools: ["hazard_identifier", "safety_plan_generator", "incident_reporter", "training_tracker"],
        speciality: "SST",
        responsibilities: ["Plans de sécurité", "Formation SST", "Rapports d'incidents"]
      },
      { 
        id: "contract_manager", 
        name: "Gestionnaire de Contrats", 
        icon: "📑", 
        level: "L3",
        desc: "Gère les contrats et ententes légales",
        tools: ["contract_generator", "clause_library", "change_order_processor", "dispute_resolver"],
        speciality: "Contrats",
        responsibilities: ["Rédaction de contrats", "Avenants", "Réclamations"]
      },
      { 
        id: "insurance_specialist", 
        name: "Spécialiste Assurances", 
        icon: "🛡️", 
        level: "L3",
        desc: "Gère les assurances et cautionnements",
        tools: ["coverage_analyzer", "claim_processor", "bond_tracker", "risk_assessor"],
        speciality: "Assurances",
        responsibilities: ["Polices d'assurance", "Cautionnements", "Réclamations"]
      }
    ]
  },
  "Qualité & Contrôle": {
    color: "from-teal-600 to-teal-800",
    agents: [
      { 
        id: "quality_controller", 
        name: "Contrôleur Qualité", 
        icon: "✅", 
        level: "L3",
        desc: "Assure la qualité de la construction",
        tools: ["inspection_checklist", "deficiency_tracker", "photo_documenter", "report_generator"],
        speciality: "Qualité",
        responsibilities: ["Inspections", "Liste de déficiences", "Rapports qualité"]
      },
      { 
        id: "commissioning_agent", 
        name: "Agent de Mise en Service", 
        icon: "🔧", 
        level: "L3",
        desc: "Valide le bon fonctionnement des systèmes",
        tools: ["test_protocol_generator", "performance_verifier", "documentation_compiler", "training_planner"],
        speciality: "Commissioning",
        responsibilities: ["Tests de systèmes", "Mise en service", "Formation client"]
      }
    ]
  }
};

export default function ConstructionAgentsHierarchy() {
  const [selectedDept, setSelectedDept] = useState("Direction Générale");
  const [selectedAgent, setSelectedAgent] = useState(null);

  const totalAgents = Object.values(constructionAgents).reduce((sum, dept) => sum + dept.agents.length, 0);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-4xl">🏗️</span>
          <div>
            <h1 className="text-2xl font-bold">ROADY Construction</h1>
            <p className="text-gray-400">Équipe d'agents spécialisés en construction</p>
          </div>
          <span className="ml-auto bg-amber-600 px-4 py-2 rounded-full text-sm font-semibold">
            {totalAgents} agents
          </span>
        </div>

        {/* Department Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {Object.entries(constructionAgents).map(([dept, data]) => (
            <button
              key={dept}
              onClick={() => { setSelectedDept(dept); setSelectedAgent(null); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                selectedDept === dept 
                  ? `bg-gradient-to-r ${data.color}` 
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {dept} ({data.agents.length})
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* Agents List */}
          <div className="col-span-2 space-y-3">
            {constructionAgents[selectedDept]?.agents.map(agent => (
              <div
                key={agent.id}
                onClick={() => setSelectedAgent(agent)}
                className={`bg-gray-800 rounded-lg p-4 cursor-pointer transition border-2 ${
                  selectedAgent?.id === agent.id ? 'border-amber-500' : 'border-transparent hover:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{agent.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg">{agent.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded font-semibold ${
                        agent.level === 'L1' ? 'bg-amber-600' : 
                        agent.level === 'L2' ? 'bg-blue-600' : 'bg-gray-600'
                      }`}>
                        {agent.level}
                      </span>
                      {agent.speciality && (
                        <span className="text-xs px-2 py-1 rounded bg-purple-600">
                          {agent.speciality}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm mt-1">{agent.desc}</p>
                  </div>
                </div>
                
                {/* Tools Preview */}
                <div className="mt-3 flex gap-1 flex-wrap">
                  {agent.tools.slice(0, 4).map(tool => (
                    <span key={tool} className="text-xs bg-gray-700 px-2 py-1 rounded">
                      🔧 {tool}
                    </span>
                  ))}
                  {agent.tools.length > 4 && (
                    <span className="text-xs bg-gray-600 px-2 py-1 rounded">
                      +{agent.tools.length - 4}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Agent Details */}
          <div className="bg-gray-800 rounded-lg p-4 h-fit sticky top-4">
            {selectedAgent ? (
              <>
                <div className="text-center pb-4 border-b border-gray-700">
                  <span className="text-6xl">{selectedAgent.icon}</span>
                  <h2 className="text-xl font-bold mt-2">{selectedAgent.name}</h2>
                  <div className="flex justify-center gap-2 mt-2">
                    <span className={`text-sm px-3 py-1 rounded ${
                      selectedAgent.level === 'L1' ? 'bg-amber-600' : 
                      selectedAgent.level === 'L2' ? 'bg-blue-600' : 'bg-gray-600'
                    }`}>
                      Niveau {selectedAgent.level}
                    </span>
                    {selectedAgent.speciality && (
                      <span className="text-sm px-3 py-1 rounded bg-purple-600">
                        {selectedAgent.speciality}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 space-y-4">
                  <div>
                    <h3 className="text-sm text-gray-400 mb-2">📋 Responsabilités</h3>
                    <ul className="space-y-1">
                      {selectedAgent.responsibilities.map((resp, idx) => (
                        <li key={idx} className="text-sm bg-gray-700 px-3 py-2 rounded">
                          • {resp}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-sm text-gray-400 mb-2">🔧 Outils ({selectedAgent.tools.length})</h3>
                    <div className="flex flex-wrap gap-1">
                      {selectedAgent.tools.map(tool => (
                        <span key={tool} className="text-xs bg-amber-900 text-amber-200 px-2 py-1 rounded">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  {selectedAgent.delegatesTo && (
                    <div>
                      <h3 className="text-sm text-gray-400 mb-2">👥 Délègue à</h3>
                      <div className="space-y-1">
                        {selectedAgent.delegatesTo.map(sub => (
                          <div key={sub} className="text-sm bg-blue-900 text-blue-200 px-3 py-2 rounded">
                            → {sub}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                ← Sélectionne un agent pour voir les détails
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
