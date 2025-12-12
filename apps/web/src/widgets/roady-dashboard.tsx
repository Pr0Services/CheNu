import React, { useState } from 'react';

const mockTasks = [
  { id: 1, title: "Article blog IA", status: "completed", agent: "Copywriter", priority: "high" },
  { id: 2, title: "Campagne LinkedIn", status: "in_progress", agent: "Social Writer", priority: "medium" },
  { id: 3, title: "Analyse Q4", status: "in_progress", agent: "Data Analyst", priority: "high" },
  { id: 4, title: "Newsletter Décembre", status: "pending", agent: "Email Writer", priority: "low" },
  { id: 5, title: "Vidéo produit", status: "pending", agent: "Video Editor", priority: "medium" },
];

const mockAgents = [
  { id: 1, name: "Creative Director", icon: "🎬", status: "active", tasks: 3 },
  { id: 2, name: "Copywriter", icon: "✍️", status: "active", tasks: 5 },
  { id: 3, name: "Graphic Designer", icon: "🎨", status: "active", tasks: 2 },
  { id: 4, name: "Data Analyst", icon: "📊", status: "busy", tasks: 4 },
  { id: 5, name: "Social Writer", icon: "📱", status: "active", tasks: 1 },
  { id: 6, name: "SEO Specialist", icon: "🔍", status: "idle", tasks: 0 },
];

const mockActivity = [
  { time: "14:32", event: "✅ Article blog terminé", agent: "Copywriter" },
  { time: "14:28", event: "🚀 Campagne LinkedIn lancée", agent: "Social Writer" },
  { time: "14:15", event: "📊 Rapport Q4 en cours", agent: "Data Analyst" },
  { time: "14:02", event: "🎨 Visuels approuvés", agent: "Graphic Designer" },
  { time: "13:45", event: "📝 Nouveau brief reçu", agent: "Creative Director" },
];

export default function RoadyDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Bonjour ! Je suis ROADY, ton assistant créatif. Comment puis-je t\'aider ?' }
  ]);

  const tabs = [
    { id: 'dashboard', icon: '🏠', label: 'Dashboard' },
    { id: 'agents', icon: '👥', label: 'Agents' },
    { id: 'tasks', icon: '📋', label: 'Tâches' },
    { id: 'workflows', icon: '🔄', label: 'Workflows' },
    { id: 'tools', icon: '🔧', label: 'Outils' },
    { id: 'analytics', icon: '📊', label: 'Analytics' },
  ];

  const sendMessage = () => {
    if (!inputValue.trim()) return;
    setMessages([...messages, 
      { role: 'user', content: inputValue },
      { role: 'assistant', content: `🧠 Analyse de votre demande...\n\n📋 Tâche créée: "${inputValue}"\n👤 Assignée à: Creative Director\n⚡ Priorité: Medium\n\nLe workflow de création de contenu a été lancé !` }
    ]);
    setInputValue('');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 p-4 flex flex-col">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-xl font-bold">R</div>
          <div>
            <h1 className="font-bold text-lg">ROADY</h1>
            <p className="text-xs text-gray-400">AI Creative Suite</p>
          </div>
        </div>

        <nav className="flex-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition ${
                activeTab === tab.id ? 'bg-purple-600' : 'hover:bg-gray-700'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="pt-4 border-t border-gray-700">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">J</div>
            <div>
              <p className="text-sm font-medium">Jo</p>
              <p className="text-xs text-gray-400">Admin</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Bienvenue, Jo 👋</h2>
            <p className="text-gray-400">Voici l'état de ton équipe créative</p>
          </div>
          <div className="flex gap-2">
            <span className="bg-green-600 px-3 py-1 rounded-full text-sm">● Système actif</span>
            <span className="bg-purple-600 px-3 py-1 rounded-full text-sm">140 agents</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-4">
            <div className="text-3xl font-bold">12</div>
            <div className="text-purple-200">Tâches actives</div>
          </div>
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-4">
            <div className="text-3xl font-bold">47</div>
            <div className="text-blue-200">Complétées aujourd'hui</div>
          </div>
          <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-4">
            <div className="text-3xl font-bold">98%</div>
            <div className="text-green-200">Taux de succès</div>
          </div>
          <div className="bg-gradient-to-br from-orange-600 to-orange-800 rounded-xl p-4">
            <div className="text-3xl font-bold">24k</div>
            <div className="text-orange-200">Tokens utilisés</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Chat Interface */}
          <div className="col-span-2 bg-gray-800 rounded-xl p-4 flex flex-col h-96">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <span>💬</span> Commander ROADY
            </h3>
            
            <div className="flex-1 overflow-auto space-y-3 mb-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs p-3 rounded-lg ${
                    msg.role === 'user' ? 'bg-purple-600' : 'bg-gray-700'
                  }`}>
                    <p className="text-sm whitespace-pre-line">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Demande quelque chose à ROADY..."
                className="flex-1 bg-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={sendMessage}
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition"
              >
                Envoyer
              </button>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-gray-800 rounded-xl p-4 h-96 overflow-auto">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <span>📜</span> Activité récente
            </h3>
            <div className="space-y-3">
              {mockActivity.map((activity, idx) => (
                <div key={idx} className="flex gap-3 text-sm">
                  <span className="text-gray-500 w-12">{activity.time}</span>
                  <div>
                    <p>{activity.event}</p>
                    <p className="text-gray-500 text-xs">{activity.agent}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Active Agents */}
        <div className="mt-6 bg-gray-800 rounded-xl p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <span>👥</span> Agents actifs
          </h3>
          <div className="grid grid-cols-6 gap-3">
            {mockAgents.map(agent => (
              <div key={agent.id} className="bg-gray-700 rounded-lg p-3 text-center">
                <div className="text-3xl mb-2">{agent.icon}</div>
                <div className="text-sm font-medium truncate">{agent.name}</div>
                <div className={`text-xs mt-1 ${
                  agent.status === 'active' ? 'text-green-400' :
                  agent.status === 'busy' ? 'text-orange-400' : 'text-gray-400'
                }`}>
                  {agent.status === 'active' ? `● ${agent.tasks} tâches` :
                   agent.status === 'busy' ? '● Occupé' : '○ Disponible'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tasks Table */}
        <div className="mt-6 bg-gray-800 rounded-xl p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <span>📋</span> Tâches en cours
          </h3>
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400 text-sm">
                <th className="pb-3">Tâche</th>
                <th className="pb-3">Agent</th>
                <th className="pb-3">Priorité</th>
                <th className="pb-3">Statut</th>
              </tr>
            </thead>
            <tbody>
              {mockTasks.map(task => (
                <tr key={task.id} className="border-t border-gray-700">
                  <td className="py-3">{task.title}</td>
                  <td className="py-3 text-gray-400">{task.agent}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      task.priority === 'high' ? 'bg-red-600' :
                      task.priority === 'medium' ? 'bg-yellow-600' : 'bg-gray-600'
                    }`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      task.status === 'completed' ? 'bg-green-600' :
                      task.status === 'in_progress' ? 'bg-blue-600' : 'bg-gray-600'
                    }`}>
                      {task.status === 'completed' ? '✓ Terminé' :
                       task.status === 'in_progress' ? '⏳ En cours' : '○ En attente'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
