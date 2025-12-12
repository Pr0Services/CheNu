import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const usageData = [
  { name: 'Lun', calls: 245, tokens: 12500, errors: 12 },
  { name: 'Mar', calls: 312, tokens: 15800, errors: 8 },
  { name: 'Mer', calls: 287, tokens: 14200, errors: 15 },
  { name: 'Jeu', calls: 398, tokens: 19500, errors: 5 },
  { name: 'Ven', calls: 456, tokens: 22800, errors: 9 },
  { name: 'Sam', calls: 189, tokens: 9400, errors: 3 },
  { name: 'Dim', calls: 156, tokens: 7800, errors: 4 },
];

const toolStats = [
  { id: "chatbot_engine", name: "Chatbot Engine", icon: "🤖", calls: 1250, tokens: 62500, avgTime: 1.2, successRate: 98.5 },
  { id: "sentiment_analyzer", name: "Sentiment Analyzer", icon: "😊", calls: 890, tokens: 17800, avgTime: 0.3, successRate: 99.2 },
  { id: "email_sender", name: "Email Sender", icon: "📧", calls: 654, tokens: 13080, avgTime: 0.8, successRate: 97.8 },
  { id: "csv_parser", name: "CSV Parser", icon: "📊", calls: 523, tokens: 10460, avgTime: 0.5, successRate: 99.5 },
  { id: "slack_poster", name: "Slack Poster", icon: "💬", calls: 445, tokens: 8900, avgTime: 0.4, successRate: 98.9 },
  { id: "pdf_extractor", name: "PDF Extractor", icon: "📄", calls: 312, tokens: 15600, avgTime: 2.1, successRate: 96.2 },
  { id: "social_poster", name: "Social Poster", icon: "📱", calls: 287, tokens: 11480, avgTime: 1.5, successRate: 95.8 },
  { id: "webhook_caller", name: "Webhook Caller", icon: "🔗", calls: 198, tokens: 3960, avgTime: 0.6, successRate: 97.5 },
];

const categoryData = [
  { name: 'AI & ML', value: 35, color: '#8B5CF6' },
  { name: 'Communication', value: 25, color: '#3B82F6' },
  { name: 'Data Processing', value: 20, color: '#10B981' },
  { name: 'Marketing', value: 12, color: '#F59E0B' },
  { name: 'Autres', value: 8, color: '#6B7280' },
];

const hourlyData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}h`,
  calls: Math.floor(Math.random() * 50 + (i >= 9 && i <= 18 ? 80 : 20)),
}));

export default function ToolAnalytics() {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('calls');

  const totalCalls = usageData.reduce((sum, d) => sum + d.calls, 0);
  const totalTokens = usageData.reduce((sum, d) => sum + d.tokens, 0);
  const totalErrors = usageData.reduce((sum, d) => sum + d.errors, 0);
  const avgSuccessRate = ((totalCalls - totalErrors) / totalCalls * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📊</span>
            <h1 className="text-2xl font-bold">Tool Analytics Dashboard</h1>
          </div>
          <div className="flex gap-2">
            {['24h', '7d', '30d'].map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded transition ${
                  timeRange === range ? 'bg-purple-600' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg p-4">
            <div className="text-3xl font-bold">{totalCalls.toLocaleString()}</div>
            <div className="text-purple-200">Appels totaux</div>
            <div className="text-sm text-green-300 mt-1">↑ 12% vs semaine dernière</div>
          </div>
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-4">
            <div className="text-3xl font-bold">{(totalTokens/1000).toFixed(1)}k</div>
            <div className="text-blue-200">Tokens utilisés</div>
            <div className="text-sm text-green-300 mt-1">↑ 8% vs semaine dernière</div>
          </div>
          <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-lg p-4">
            <div className="text-3xl font-bold">{avgSuccessRate}%</div>
            <div className="text-green-200">Taux de succès</div>
            <div className="text-sm text-green-300 mt-1">↑ 0.5% vs semaine dernière</div>
          </div>
          <div className="bg-gradient-to-br from-orange-600 to-orange-800 rounded-lg p-4">
            <div className="text-3xl font-bold">0.8s</div>
            <div className="text-orange-200">Temps moyen</div>
            <div className="text-sm text-green-300 mt-1">↓ 15% vs semaine dernière</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Usage Over Time */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4 text-purple-400">📈 Utilisation par jour</h2>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                <Area type="monotone" dataKey="calls" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
                <Area type="monotone" dataKey="tokens" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Category Distribution */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4 text-blue-400">🥧 Répartition par catégorie</h2>
            <div className="flex items-center">
              <ResponsiveContainer width="50%" height={200}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {categoryData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {categoryData.map(cat => (
                  <div key={cat.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: cat.color }}></div>
                    <span className="text-sm">{cat.name}</span>
                    <span className="ml-auto text-gray-400">{cat.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tool Performance Table */}
        <div className="bg-gray-800 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4 text-green-400">🏆 Performance des outils</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-700">
                  <th className="pb-3">Outil</th>
                  <th className="pb-3 text-right">Appels</th>
                  <th className="pb-3 text-right">Tokens</th>
                  <th className="pb-3 text-right">Temps moy.</th>
                  <th className="pb-3 text-right">Succès</th>
                  <th className="pb-3">Performance</th>
                </tr>
              </thead>
              <tbody>
                {toolStats.map(tool => (
                  <tr key={tool.id} className="border-b border-gray-700 hover:bg-gray-750">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{tool.icon}</span>
                        <span>{tool.name}</span>
                      </div>
                    </td>
                    <td className="text-right">{tool.calls.toLocaleString()}</td>
                    <td className="text-right text-purple-400">{tool.tokens.toLocaleString()}</td>
                    <td className="text-right">{tool.avgTime}s</td>
                    <td className="text-right">
                      <span className={tool.successRate >= 98 ? 'text-green-400' : 'text-yellow-400'}>
                        {tool.successRate}%
                      </span>
                    </td>
                    <td>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                          style={{ width: `${tool.successRate}%` }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Hourly Distribution */}
        <div className="bg-gray-800 rounded-lg p-4 mt-4">
          <h2 className="text-lg font-semibold mb-4 text-orange-400">🕐 Distribution horaire</h2>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="hour" stroke="#9CA3AF" fontSize={10} />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
              <Bar dataKey="calls" fill="#F59E0B" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
