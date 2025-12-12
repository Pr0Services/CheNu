import React, { useState } from 'react';

const constructionWorkflows = [
  {
    id: "estimation_workflow",
    name: "📊 Estimation de Projet",
    desc: "Pipeline complet d'estimation des coûts",
    trigger: "Réception des plans ou appel d'offres",
    duration: "3-10 jours",
    steps: [
      { agent: "Chef Estimation", action: "Analyse des documents d'appel d'offres", icon: "💰", output: "Go/No-Go décision", duration: "2h" },
      { agent: "Métreur", action: "Relevé des quantités (takeoff)", icon: "📐", output: "Liste des quantités", duration: "2-5 jours" },
      { agent: "Estimateur de Coûts", action: "Application des prix unitaires", icon: "🧮", output: "Estimation détaillée", duration: "1-2 jours" },
      { agent: "Ingénieur Valeur", action: "Optimisation et alternatives", icon: "⚖️", output: "Options de valeur", duration: "4h" },
      { agent: "Chef Estimation", action: "Validation et ajustements", icon: "💰", output: "Estimation finale", duration: "2h" },
      { agent: "Spécialiste Soumissions", action: "Préparation de la soumission", icon: "📝", output: "Dossier complet", duration: "4h" },
      { agent: "Directeur Construction", action: "Approbation et signature", icon: "🏗️", output: "Soumission approuvée", duration: "1h" },
    ]
  },
  {
    id: "permit_workflow",
    name: "📜 Obtention des Permis",
    desc: "Processus de demande et suivi des permis",
    trigger: "Plans complétés à 60%+",
    duration: "4-12 semaines",
    steps: [
      { agent: "Chef Conformité", action: "Évaluation des permis requis", icon: "⚖️", output: "Liste des permis", duration: "4h" },
      { agent: "Analyste Codes", action: "Vérification de conformité", icon: "📚", output: "Rapport de conformité", duration: "1-2 jours" },
      { agent: "Architecte", action: "Préparation des plans pour permis", icon: "🏠", output: "Plans scellés", duration: "2-3 jours" },
      { agent: "Spécialiste Permis", action: "Compilation du dossier", icon: "📜", output: "Dossier complet", duration: "1 jour" },
      { agent: "Spécialiste Permis", action: "Soumission aux autorités", icon: "📜", output: "Numéro de dossier", duration: "1h" },
      { agent: "Spécialiste Permis", action: "Suivi et réponses aux questions", icon: "📜", output: "Corrections si nécessaire", duration: "Variable" },
      { agent: "Chef Conformité", action: "Réception et distribution du permis", icon: "⚖️", output: "Permis obtenu ✓", duration: "1h" },
    ]
  },
  {
    id: "design_workflow",
    name: "🏛️ Conception Architecturale",
    desc: "Pipeline de design du concept aux plans d'exécution",
    trigger: "Programme fonctionnel approuvé",
    duration: "8-16 semaines",
    steps: [
      { agent: "Chef Architecture", action: "Analyse du programme et site", icon: "🏛️", output: "Brief de design", duration: "1 semaine" },
      { agent: "Architecte", action: "Esquisses conceptuelles", icon: "🏠", output: "Options de concept", duration: "2 semaines" },
      { agent: "Chef Architecture", action: "Présentation client et choix", icon: "🏛️", output: "Concept approuvé", duration: "3 jours" },
      { agent: "Architecte", action: "Plans préliminaires (30%)", icon: "🏠", output: "Plans 30%", duration: "3 semaines" },
      { agent: "Spécialiste BIM", action: "Modélisation 3D", icon: "💻", output: "Modèle BIM", duration: "2 semaines" },
      { agent: "Designer Intérieur", action: "Concept d'aménagement intérieur", icon: "🛋️", output: "Plans intérieurs", duration: "2 semaines" },
      { agent: "Chef Ingénierie", action: "Coordination technique", icon: "⚙️", output: "Intégration MEP/Structure", duration: "1 semaine" },
      { agent: "Spécialiste BIM", action: "Clash detection", icon: "💻", output: "Rapport de conflits", duration: "2 jours" },
      { agent: "Dessinateur", action: "Plans d'exécution (100%)", icon: "✏️", output: "Plans complets", duration: "3 semaines" },
    ]
  },
  {
    id: "project_execution",
    name: "👷 Exécution du Projet",
    desc: "Gestion de la phase construction",
    trigger: "Permis obtenu et contrat signé",
    duration: "Variable (projet)",
    steps: [
      { agent: "Gérant de Projet", action: "Planification détaillée", icon: "📋", output: "Échéancier maître", duration: "1-2 semaines" },
      { agent: "Gestionnaire Approvisionnement", action: "Commandes matériaux critiques", icon: "📦", output: "Bons de commande", duration: "1 semaine" },
      { agent: "Agent de Sécurité", action: "Plan de sécurité du chantier", icon: "🦺", output: "Plan SST", duration: "3 jours" },
      { agent: "Superviseur Chantier", action: "Mobilisation et installation", icon: "👷", output: "Chantier prêt", duration: "1 semaine" },
      { agent: "Superviseur Chantier", action: "Coordination quotidienne", icon: "👷", output: "Rapports journaliers", duration: "Continu" },
      { agent: "Contrôleur Qualité", action: "Inspections périodiques", icon: "✅", output: "Rapports qualité", duration: "Continu" },
      { agent: "Gérant de Projet", action: "Réunions de chantier hebdo", icon: "📋", output: "PV de réunion", duration: "Hebdomadaire" },
      { agent: "Gérant de Projet", action: "Rapports d'avancement client", icon: "📋", output: "Rapport mensuel", duration: "Mensuel" },
    ]
  },
  {
    id: "engineering_coordination",
    name: "⚙️ Coordination Ingénierie",
    desc: "Intégration des disciplines techniques",
    trigger: "Plans architecture 30%+",
    duration: "4-8 semaines",
    steps: [
      { agent: "Chef Ingénierie", action: "Distribution des plans aux disciplines", icon: "⚙️", output: "Assignation", duration: "1 jour" },
      { agent: "Ingénieur Géotechnique", action: "Étude de sol et recommandations", icon: "🪨", output: "Rapport géotech", duration: "2 semaines" },
      { agent: "Ingénieur Structure", action: "Calculs et plans structure", icon: "🏢", output: "Plans structure", duration: "3-4 semaines" },
      { agent: "Ingénieur MEP", action: "Design CVAC-É-P", icon: "🔌", output: "Plans MEP", duration: "3-4 semaines" },
      { agent: "Ingénieur Civil", action: "Plans de site et drainage", icon: "🛤️", output: "Plans civils", duration: "2 semaines" },
      { agent: "Spécialiste BIM", action: "Fédération des modèles", icon: "💻", output: "Modèle combiné", duration: "3 jours" },
      { agent: "Spécialiste BIM", action: "Détection des conflits", icon: "💻", output: "Liste des clashes", duration: "2 jours" },
      { agent: "Chef Ingénierie", action: "Réunion de coordination", icon: "⚙️", output: "Résolution conflits", duration: "1 semaine" },
    ]
  },
  {
    id: "closeout_workflow",
    name: "🏁 Fermeture de Projet",
    desc: "Livraison et clôture administrative",
    trigger: "Construction substantiellement complète",
    duration: "4-8 semaines",
    steps: [
      { agent: "Contrôleur Qualité", action: "Inspection finale", icon: "✅", output: "Liste de déficiences", duration: "2-3 jours" },
      { agent: "Superviseur Chantier", action: "Correction des déficiences", icon: "👷", output: "Déficiences corrigées", duration: "2-4 semaines" },
      { agent: "Agent Mise en Service", action: "Tests et mise en service", icon: "🔧", output: "Systèmes fonctionnels", duration: "1-2 semaines" },
      { agent: "Spécialiste Permis", action: "Demande certificat d'occupation", icon: "📜", output: "Certificat obtenu", duration: "1-2 semaines" },
      { agent: "Spécialiste BIM", action: "Plans as-built", icon: "💻", output: "Documentation finale", duration: "1 semaine" },
      { agent: "Agent Mise en Service", action: "Formation du propriétaire", icon: "🔧", output: "Formation complétée", duration: "2-3 jours" },
      { agent: "Gestionnaire Contrats", action: "Documentation de fermeture", icon: "📑", output: "Dossier complet", duration: "3-5 jours" },
      { agent: "Gérant de Projet", action: "Remise des clés et réception", icon: "📋", output: "Projet livré ✓", duration: "1 jour" },
    ]
  }
];

export default function ConstructionWorkflows() {
  const [selectedWorkflow, setSelectedWorkflow] = useState(constructionWorkflows[0]);
  const [activeStep, setActiveStep] = useState(null);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const simulateWorkflow = async () => {
    setIsRunning(true);
    setCompletedSteps([]);
    
    for (let i = 0; i < selectedWorkflow.steps.length; i++) {
      setActiveStep(i);
      await new Promise(r => setTimeout(r, 600));
      setCompletedSteps(prev => [...prev, i]);
    }
    
    setActiveStep(null);
    setIsRunning(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">🔄</span>
          <h1 className="text-2xl font-bold">Workflows Construction</h1>
        </div>

        {/* Workflow Selector */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {constructionWorkflows.map(wf => (
            <button
              key={wf.id}
              onClick={() => { setSelectedWorkflow(wf); setCompletedSteps([]); setActiveStep(null); }}
              className={`p-4 rounded-lg text-left transition ${
                selectedWorkflow.id === wf.id 
                  ? 'bg-amber-600' 
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              <div className="text-lg font-semibold">{wf.name}</div>
              <div className="text-sm text-gray-300 mt-1">{wf.steps.length} étapes</div>
              <div className="text-xs text-gray-400 mt-1">⏱️ {wf.duration}</div>
            </button>
          ))}
        </div>

        {/* Workflow Details */}
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">{selectedWorkflow.name}</h2>
              <p className="text-gray-400 mt-1">{selectedWorkflow.desc}</p>
              <div className="flex gap-4 mt-2">
                <span className="text-sm text-amber-400">⚡ Trigger: {selectedWorkflow.trigger}</span>
                <span className="text-sm text-blue-400">⏱️ Durée: {selectedWorkflow.duration}</span>
              </div>
            </div>
            <button
              onClick={simulateWorkflow}
              disabled={isRunning}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                isRunning ? 'bg-gray-600' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isRunning ? '⏳ Simulation...' : '▶️ Simuler'}
            </button>
          </div>

          {/* Steps */}
          <div className="space-y-3">
            {selectedWorkflow.steps.map((step, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-4 p-4 rounded-lg transition ${
                  activeStep === idx 
                    ? 'bg-amber-600 animate-pulse' 
                    : completedSteps.includes(idx) 
                      ? 'bg-green-900' 
                      : 'bg-gray-700'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  completedSteps.includes(idx) ? 'bg-green-600' : 'bg-gray-600'
                }`}>
                  {completedSteps.includes(idx) ? '✓' : idx + 1}
                </div>
                <span className="text-3xl">{step.icon}</span>
                <div className="flex-1">
                  <div className="font-semibold">{step.agent}</div>
                  <div className="text-sm text-gray-300">{step.action}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400">Output</div>
                  <div className="text-sm text-amber-300">{step.output}</div>
                  <div className="text-xs text-gray-500 mt-1">{step.duration}</div>
                </div>
              </div>
            ))}
          </div>

          {completedSteps.length === selectedWorkflow.steps.length && (
            <div className="mt-6 p-4 bg-green-900 rounded-lg text-center">
              ✅ Workflow terminé ! {selectedWorkflow.steps.length} étapes complétées.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
