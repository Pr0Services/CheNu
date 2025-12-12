import React, { useState } from 'react';

const workflows = [
  {
    id: "content_creation",
    name: "🎨 Création de Contenu",
    desc: "Pipeline complet de création de contenu",
    trigger: "Demande utilisateur ou calendrier",
    steps: [
      { agent: "Core Orchestrator", action: "Analyse la demande", icon: "🧠", output: "Brief structuré" },
      { agent: "Creative Director", action: "Définit la stratégie", icon: "🎬", output: "Plan créatif" },
      { agent: "Content Lead", action: "Assigne les tâches", icon: "📝", output: "Tâches distribuées" },
      { agent: "Copywriter", action: "Rédige le contenu", icon: "✍️", output: "Texte brut" },
      { agent: "SEO Specialist", action: "Optimise pour SEO", icon: "🔍", output: "Contenu optimisé" },
      { agent: "Graphic Designer", action: "Crée les visuels", icon: "🖼️", output: "Assets visuels" },
      { agent: "Quality Assurance", action: "Vérifie la qualité", icon: "✅", output: "Contenu validé" },
      { agent: "Social Writer", action: "Adapte pour réseaux", icon: "📱", output: "Posts prêts" },
    ]
  },
  {
    id: "marketing_campaign",
    name: "📣 Campagne Marketing",
    desc: "Lancement d'une campagne multi-canal",
    trigger: "Brief marketing ou objectif business",
    steps: [
      { agent: "Core Orchestrator", action: "Parse les objectifs", icon: "🧠", output: "KPIs définis" },
      { agent: "Marketing Director", action: "Stratégie globale", icon: "📊", output: "Plan campagne" },
      { agent: "Content Strategist", action: "Calendrier éditorial", icon: "📅", output: "Planning" },
      { agent: "Copywriter", action: "Messages clés", icon: "✍️", output: "Copy ads" },
      { agent: "Graphic Designer", action: "Créas publicitaires", icon: "🎨", output: "Bannières/Visuels" },
      { agent: "Video Editor", action: "Spots vidéo", icon: "🎬", output: "Vidéos ads" },
      { agent: "Social Strategist", action: "Plan réseaux sociaux", icon: "📲", output: "Calendrier social" },
      { agent: "Email Writer", action: "Séquences email", icon: "📧", output: "Emails prêts" },
      { agent: "Performance Analyst", action: "Setup tracking", icon: "📈", output: "Dashboard analytics" },
    ]
  },
  {
    id: "data_analysis",
    name: "📊 Analyse de Données",
    desc: "Extraction et analyse de données business",
    trigger: "Requête d'analyse ou rapport planifié",
    steps: [
      { agent: "Core Orchestrator", action: "Comprend la requête", icon: "🧠", output: "Query structurée" },
      { agent: "Data Director", action: "Plan d'analyse", icon: "📊", output: "Méthodologie" },
      { agent: "Data Collector", action: "Collecte les données", icon: "🔍", output: "Dataset brut" },
      { agent: "Data Cleaner", action: "Nettoie les données", icon: "🧹", output: "Dataset propre" },
      { agent: "Data Analyst", action: "Analyse statistique", icon: "📈", output: "Insights" },
      { agent: "Infographic Designer", action: "Visualisations", icon: "📊", output: "Graphiques" },
      { agent: "Technical Writer", action: "Rédige le rapport", icon: "📚", output: "Rapport final" },
    ]
  },
  {
    id: "customer_support",
    name: "🎧 Support Client",
    desc: "Gestion automatisée du support",
    trigger: "Ticket client ou message",
    steps: [
      { agent: "Core Orchestrator", action: "Triage du ticket", icon: "🧠", output: "Catégorie + Priorité" },
      { agent: "Support Director", action: "Routing intelligent", icon: "🎧", output: "Agent assigné" },
      { agent: "Chatbot Engine", action: "Réponse initiale", icon: "🤖", output: "Message auto" },
      { agent: "Sentiment Analyzer", action: "Analyse le ton", icon: "😊", output: "Score sentiment" },
      { agent: "Knowledge Base", action: "Recherche solutions", icon: "📚", output: "Articles pertinents" },
      { agent: "Support Agent", action: "Résolution personnalisée", icon: "👤", output: "Réponse finale" },
      { agent: "Quality Assurance", action: "Vérifie la réponse", icon: "✅", output: "Ticket résolu" },
    ]
  },
  {
    id: "video_production",
    name: "🎬 Production Vidéo",
    desc: "Pipeline de création vidéo",
    trigger: "Brief vidéo",
    steps: [
      { agent: "Core Orchestrator", action: "Analyse le brief", icon: "🧠", output: "Specs vidéo" },
      { agent: "Audio Lead", action: "Planning production", icon: "🎥", output: "Storyboard" },
      { agent: "Scriptwriter", action: "Écrit le script", icon: "🎭", output: "Script validé" },
      { agent: "Voiceover Director", action: "Génère la voix", icon: "🎤", output: "Audio voix-off" },
      { agent: "Video Editor", action: "Montage vidéo", icon: "🎬", output: "Vidéo montée" },
      { agent: "Motion Designer", action: "Animations", icon: "✨", output: "Motion graphics" },
      { agent: "Music Composer", action: "Musique/Sound design", icon: "🎵", output: "Bande son" },
      { agent: "Audio Engineer", action: "Mixage final", icon: "🎧", output: "Vidéo finale" },
    ]
  },
  {
    id: "social_management",
    name: "📱 Gestion Réseaux Sociaux",
    desc: "Publication et engagement automatisés",
    trigger: "Calendrier ou événement",
    steps: [
      { agent: "Core Orchestrator", action: "Détecte le trigger", icon: "🧠", output: "Action requise" },
      { agent: "Social Strategist", action: "Sélectionne le contenu", icon: "📲", output: "Contenu à publier" },
      { agent: "Social Writer", action: "Adapte le message", icon: "📱", output: "Posts formatés" },
      { agent: "Graphic Designer", action: "Redimensionne visuels", icon: "🖼️", output: "Images optimisées" },
      { agent: "Hashtag Generator", action: "Génère hashtags", icon: "#️⃣", output: "Hashtags pertinents" },
      { agent: "Social Poster", action: "Publie le contenu", icon: "📤", output: "Posts publiés" },
      { agent: "Engagement Tracker", action: "Monitore les réactions", icon: "💬", output: "Métriques temps réel" },
    ]
  }
];

export default function RoadyWorkflows() {
  const [selectedWorkflow, setSelectedWorkflow] = useState(workflows[0]);
  const [activeStep, setActiveStep] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([]);

  const simulateWorkflow = async () => {
    setIsRunning(true);
    setCompletedSteps([]);
    
    for (let i = 0; i < selectedWorkflow.steps.length; i++) {
      setActiveStep(i);
      await new Promise(r => setTimeout(r, 800));
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
          <h1 className="text-2xl font-bold">Workflows ROADY</h1>
        </div>

        {/* Workflow Selector */}
        <div className="grid grid-cols-6 gap-2 mb-6">
          {workflows.map(wf => (
            <button
              key={wf.id}
              onClick={() => { setSelectedWorkflow(wf); setCompletedSteps([]); setActiveStep(null); }}
              className={`p-3 rounded-lg text-center transition ${
                selectedWorkflow.id === wf.id ? 'bg-purple-600' : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              <div className="text-2xl mb-1">{wf.name.split(' ')[0]}</div>
              <div className="text-xs">{wf.name.split(' ').slice(1).join(' ')}</div>
            </button>
          ))}
        </div>

        {/* Workflow Details */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">{selectedWorkflow.name}</h2>
              <p className="text-gray-400">{selectedWorkflow.desc}</p>
              <p className="text-sm text-purple-400 mt-1">⚡ Trigger: {selectedWorkflow.trigger}</p>
            </div>
            <button
              onClick={simulateWorkflow}
              disabled={isRunning}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                isRunning ? 'bg-gray-600' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isRunning ? '⏳ En cours...' : '▶️ Simuler'}
            </button>
          </div>

          {/* Steps */}
          <div className="space-y-3">
            {selectedWorkflow.steps.map((step, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-4 p-4 rounded-lg transition ${
                  activeStep === idx ? 'bg-blue-600 animate-pulse' :
                  completedSteps.includes(idx) ? 'bg-green-900' : 'bg-gray-700'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center font-bold">
                  {completedSteps.includes(idx) ? '✓' : idx + 1}
                </div>
                <span className="text-3xl">{step.icon}</span>
                <div className="flex-1">
                  <div className="font-semibold">{step.agent}</div>
                  <div className="text-sm text-gray-400">{step.action}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400">Output</div>
                  <div className="text-sm text-purple-300">{step.output}</div>
                </div>
                {idx < selectedWorkflow.steps.length - 1 && (
                  <div className="absolute left-12 mt-16 text-gray-500 hidden">↓</div>
                )}
              </div>
            ))}
          </div>

          {completedSteps.length === selectedWorkflow.steps.length && (
            <div className="mt-6 p-4 bg-green-900 rounded-lg text-center">
              ✅ Workflow terminé avec succès ! {selectedWorkflow.steps.length} étapes complétées.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
