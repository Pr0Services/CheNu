/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                       CHE·NU - IA LABORATOIRE                                ║
 * ║                                                                              ║
 * ║  Centre de contrôle et d'expérimentation des agents IA                       ║
 * ║  - Playground de prompts multi-LLM                                           ║
 * ║  - Configuration et test des agents                                          ║
 * ║  - Métriques et monitoring                                                   ║
 * ║  - Bibliothèque de prompts                                                   ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useRef, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface LLMProvider {
  id: string;
  name: string;
  icon: string;
  color: string;
  models: LLMModel[];
  enabled: boolean;
  apiKeyConfigured: boolean;
}

interface LLMModel {
  id: string;
  name: string;
  contextWindow: number;
  costPer1kInput: number;
  costPer1kOutput: number;
}

interface Agent {
  id: string;
  name: string;
  level: 'L0' | 'L1' | 'L2' | 'L3';
  department: string;
  icon: string;
  description: string;
  status: 'active' | 'idle' | 'disabled';
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  model?: string;
  tokens?: number;
  latency?: number;
  timestamp: Date;
}

interface PromptTemplate {
  id: string;
  name: string;
  icon: string;
  category: string;
  prompt: string;
  variables: string[];
}

interface ExperimentResult {
  modelId: string;
  response: string;
  tokens: number;
  latency: number;
  cost: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════════════════

const LLM_PROVIDERS: LLMProvider[] = [
  {
    id: 'anthropic',
    name: 'Anthropic',
    icon: '🎭',
    color: '#D4A27F',
    enabled: true,
    apiKeyConfigured: true,
    models: [
      { id: 'claude-3-opus', name: 'Claude 3 Opus', contextWindow: 200000, costPer1kInput: 0.015, costPer1kOutput: 0.075 },
      { id: 'claude-3-sonnet', name: 'Claude 3.5 Sonnet', contextWindow: 200000, costPer1kInput: 0.003, costPer1kOutput: 0.015 },
      { id: 'claude-3-haiku', name: 'Claude 3 Haiku', contextWindow: 200000, costPer1kInput: 0.00025, costPer1kOutput: 0.00125 },
    ],
  },
  {
    id: 'openai',
    name: 'OpenAI',
    icon: '🤖',
    color: '#10A37F',
    enabled: true,
    apiKeyConfigured: true,
    models: [
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', contextWindow: 128000, costPer1kInput: 0.01, costPer1kOutput: 0.03 },
      { id: 'gpt-4o', name: 'GPT-4o', contextWindow: 128000, costPer1kInput: 0.005, costPer1kOutput: 0.015 },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', contextWindow: 16000, costPer1kInput: 0.0005, costPer1kOutput: 0.0015 },
    ],
  },
  {
    id: 'google',
    name: 'Google',
    icon: '💎',
    color: '#4285F4',
    enabled: false,
    apiKeyConfigured: false,
    models: [
      { id: 'gemini-pro', name: 'Gemini Pro', contextWindow: 32000, costPer1kInput: 0.00025, costPer1kOutput: 0.0005 },
      { id: 'gemini-ultra', name: 'Gemini Ultra', contextWindow: 32000, costPer1kInput: 0.00125, costPer1kOutput: 0.00375 },
    ],
  },
  {
    id: 'mistral',
    name: 'Mistral',
    icon: '🌬️',
    color: '#FF7000',
    enabled: false,
    apiKeyConfigured: false,
    models: [
      { id: 'mistral-large', name: 'Mistral Large', contextWindow: 32000, costPer1kInput: 0.002, costPer1kOutput: 0.006 },
      { id: 'mistral-medium', name: 'Mistral Medium', contextWindow: 32000, costPer1kInput: 0.0027, costPer1kOutput: 0.0081 },
    ],
  },
  {
    id: 'local',
    name: 'Local (Ollama)',
    icon: '🦙',
    color: '#8B5CF6',
    enabled: true,
    apiKeyConfigured: true,
    models: [
      { id: 'llama3-70b', name: 'Llama 3 70B', contextWindow: 8000, costPer1kInput: 0, costPer1kOutput: 0 },
      { id: 'mixtral-8x7b', name: 'Mixtral 8x7B', contextWindow: 32000, costPer1kInput: 0, costPer1kOutput: 0 },
    ],
  },
];

const AGENTS: Agent[] = [
  { id: 'nova', name: 'Nova', level: 'L0', department: 'Core', icon: '✨', description: 'Intelligence Centrale', status: 'active' },
  { id: 'master_mind', name: 'Master Mind', level: 'L0', department: 'Core', icon: '🧠', description: 'Orchestrateur Principal', status: 'active' },
  { id: 'construction_director', name: 'Dir. Construction', level: 'L1', department: 'Construction', icon: '🏗️', description: 'Directeur Construction', status: 'active' },
  { id: 'finance_director', name: 'Dir. Finances', level: 'L1', department: 'Finance', icon: '💰', description: 'Directeur Finances', status: 'active' },
  { id: 'compliance_director', name: 'Dir. Conformité', level: 'L1', department: 'Compliance', icon: '📋', description: 'Directeur Conformité', status: 'active' },
  { id: 'safety_director', name: 'Dir. Sécurité', level: 'L1', department: 'Safety', icon: '⚠️', description: 'Directeur Sécurité', status: 'idle' },
  { id: 'project_manager', name: 'Gérant Projet', level: 'L2', department: 'Construction', icon: '📊', description: 'Gestionnaire de Projets', status: 'active' },
  { id: 'estimator', name: 'Estimateur', level: 'L2', department: 'Sales', icon: '🧮', description: 'Spécialiste Estimation', status: 'active' },
  { id: 'rbq_specialist', name: 'Spécialiste RBQ', level: 'L3', department: 'Compliance', icon: '🏛️', description: 'Expert RBQ', status: 'idle' },
  { id: 'cnesst_specialist', name: 'Spécialiste CNESST', level: 'L3', department: 'Compliance', icon: '🛡️', description: 'Expert CNESST', status: 'idle' },
];

const PROMPT_TEMPLATES: PromptTemplate[] = [
  { id: 'devis', name: 'Génération de Devis', icon: '📄', category: 'Construction', prompt: 'Génère un devis détaillé pour: {description}. Budget estimé: {budget}. Inclus main d\'œuvre et matériaux.', variables: ['description', 'budget'] },
  { id: 'inspection', name: 'Rapport d\'Inspection', icon: '🔍', category: 'Qualité', prompt: 'Crée un rapport d\'inspection pour le chantier {projet}. Points à vérifier: {points}', variables: ['projet', 'points'] },
  { id: 'conformite', name: 'Vérification Conformité', icon: '✅', category: 'Compliance', prompt: 'Vérifie la conformité {type} pour le projet {projet}. Réglementations: RBQ, CNESST, CCQ.', variables: ['type', 'projet'] },
  { id: 'planification', name: 'Plan de Projet', icon: '📅', category: 'Gestion', prompt: 'Crée un plan de projet détaillé pour: {description}. Durée: {duree}. Équipe: {equipe} personnes.', variables: ['description', 'duree', 'equipe'] },
  { id: 'securite', name: 'Analyse Sécurité', icon: '⚠️', category: 'Sécurité', prompt: 'Analyse les risques de sécurité pour {activite} sur le chantier {chantier}. Propose des mesures préventives.', variables: ['activite', 'chantier'] },
  { id: 'client', name: 'Communication Client', icon: '📧', category: 'Communication', prompt: 'Rédige un {type_comm} professionnel pour informer le client {client} de: {sujet}', variables: ['type_comm', 'client', 'sujet'] },
];

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

type LabTab = 'playground' | 'agents' | 'templates' | 'compare' | 'metrics';

export const IALaboratoryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<LabTab>('playground');
  const [selectedModels, setSelectedModels] = useState<string[]>(['claude-3-sonnet']);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('Tu es un assistant IA spécialisé dans la construction au Québec.');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2000);
  const [compareResults, setCompareResults] = useState<ExperimentResult[]>([]);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!prompt.trim()) return;
    
    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: prompt,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setPrompt('');
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(r => setTimeout(r, 1500));
    
    const assistantMessage: ChatMessage = {
      id: `msg_${Date.now()}_assistant`,
      role: 'assistant',
      content: `[${selectedModels[0]}] Voici ma réponse à votre demande concernant "${prompt.slice(0, 50)}...":\n\nJe suis prêt à vous aider avec vos projets de construction. Cette réponse est générée depuis le IA Lab de CHE·NU.`,
      model: selectedModels[0],
      tokens: Math.floor(Math.random() * 500) + 100,
      latency: Math.floor(Math.random() * 2000) + 500,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const handleCompare = async () => {
    if (!prompt.trim() || selectedModels.length < 2) return;
    
    setIsLoading(true);
    setCompareResults([]);
    
    // Simulate parallel API calls
    await new Promise(r => setTimeout(r, 2000));
    
    const results: ExperimentResult[] = selectedModels.map(modelId => ({
      modelId,
      response: `[${modelId}] Réponse simulée pour la comparaison. En production, ceci serait la vraie réponse du modèle.`,
      tokens: Math.floor(Math.random() * 500) + 100,
      latency: Math.floor(Math.random() * 3000) + 500,
      cost: Math.random() * 0.05,
    }));
    
    setCompareResults(results);
    setIsLoading(false);
  };

  const toggleModel = (modelId: string) => {
    setSelectedModels(prev => 
      prev.includes(modelId)
        ? prev.filter(id => id !== modelId)
        : [...prev, modelId]
    );
  };

  const applyTemplate = (template: PromptTemplate) => {
    setPrompt(template.prompt);
  };

  // Render tabs
  const renderPlayground = () => (
    <div style={{ display: 'flex', gap: 20, height: 'calc(100vh - 180px)' }}>
      {/* Left Panel - Config */}
      <div style={{ width: 280, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Model Selection */}
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 16, border: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 style={{ fontSize: 12, fontWeight: 600, color: '#D8B26A', marginBottom: 12 }}>🤖 Modèles LLM</h3>
          {LLM_PROVIDERS.filter(p => p.enabled).map(provider => (
            <div key={provider.id} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: '#8B9B8B', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>{provider.icon}</span>
                {provider.name}
              </div>
              {provider.models.map(model => (
                <button
                  key={model.id}
                  onClick={() => toggleModel(model.id)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    marginBottom: 4,
                    background: selectedModels.includes(model.id) ? `${provider.color}30` : 'rgba(255,255,255,0.02)',
                    border: selectedModels.includes(model.id) ? `1px solid ${provider.color}` : '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 6,
                    color: selectedModels.includes(model.id) ? '#E8F0E8' : '#8B9B8B',
                    fontSize: 10,
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>{model.name}</span>
                  <span style={{ fontSize: 9, opacity: 0.7 }}>{model.contextWindow/1000}K</span>
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Parameters */}
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 16, border: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 style={{ fontSize: 12, fontWeight: 600, color: '#D8B26A', marginBottom: 12 }}>⚙️ Paramètres</h3>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 10, color: '#8B9B8B', display: 'block', marginBottom: 4 }}>
              Température: {temperature}
            </label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={temperature}
              onChange={e => setTemperature(parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <label style={{ fontSize: 10, color: '#8B9B8B', display: 'block', marginBottom: 4 }}>
              Max Tokens: {maxTokens}
            </label>
            <input
              type="range"
              min="100"
              max="4000"
              step="100"
              value={maxTokens}
              onChange={e => setMaxTokens(parseInt(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
        </div>

        {/* System Prompt */}
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 16, border: '1px solid rgba(255,255,255,0.06)', flex: 1 }}>
          <h3 style={{ fontSize: 12, fontWeight: 600, color: '#D8B26A', marginBottom: 12 }}>📝 System Prompt</h3>
          <textarea
            value={systemPrompt}
            onChange={e => setSystemPrompt(e.target.value)}
            style={{
              width: '100%',
              height: 120,
              padding: 10,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8,
              color: '#E8F0E8',
              fontSize: 10,
              resize: 'none',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Right Panel - Chat */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
        {/* Messages */}
        <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
          {messages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#6B7B6B' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🧪</div>
              <div style={{ fontSize: 14 }}>IA Laboratory</div>
              <div style={{ fontSize: 11, marginTop: 8 }}>Sélectionnez un modèle et commencez à expérimenter</div>
            </div>
          ) : (
            messages.map(msg => (
              <div
                key={msg.id}
                style={{
                  marginBottom: 16,
                  display: 'flex',
                  flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                  gap: 10,
                }}
              >
                <div
                  style={{
                    maxWidth: '75%',
                    padding: 12,
                    borderRadius: msg.role === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                    background: msg.role === 'user' ? 'rgba(63, 114, 73, 0.3)' : 'rgba(216, 178, 106, 0.1)',
                    border: msg.role === 'assistant' ? '1px solid rgba(216, 178, 106, 0.2)' : 'none',
                  }}
                >
                  <div style={{ fontSize: 11, color: '#E8F0E8', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                    {msg.content}
                  </div>
                  {msg.model && (
                    <div style={{ fontSize: 9, color: '#6B7B6B', marginTop: 8, display: 'flex', gap: 12 }}>
                      <span>🤖 {msg.model}</span>
                      {msg.tokens && <span>📊 {msg.tokens} tokens</span>}
                      {msg.latency && <span>⚡ {msg.latency}ms</span>}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div style={{ padding: 12, color: '#D8B26A', fontSize: 11 }}>
              ⏳ Génération en cours...
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div style={{ padding: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Entrez votre prompt..."
              style={{
                flex: 1,
                padding: 12,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(216, 178, 106, 0.2)',
                borderRadius: 8,
                color: '#E8F0E8',
                fontSize: 11,
                resize: 'none',
                height: 60,
                outline: 'none',
              }}
            />
            <button
              onClick={handleSend}
              disabled={!prompt.trim() || isLoading}
              style={{
                padding: '12px 20px',
                background: prompt.trim() && !isLoading ? 'linear-gradient(135deg, #D8B26A 0%, #C9A35B 100%)' : 'rgba(216,178,106,0.2)',
                border: 'none',
                borderRadius: 8,
                color: prompt.trim() && !isLoading ? '#1A1A1A' : '#6B7B6B',
                fontSize: 11,
                fontWeight: 600,
                cursor: prompt.trim() && !isLoading ? 'pointer' : 'not-allowed',
              }}
            >
              Envoyer ↗
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAgents = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
      {AGENTS.map(agent => (
        <div
          key={agent.id}
          onClick={() => setSelectedAgent(agent.id === selectedAgent ? null : agent.id)}
          style={{
            background: selectedAgent === agent.id ? 'rgba(216,178,106,0.1)' : 'rgba(255,255,255,0.03)',
            borderRadius: 12,
            padding: 16,
            border: selectedAgent === agent.id ? '1px solid rgba(216,178,106,0.3)' : '1px solid rgba(255,255,255,0.06)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: 'rgba(216,178,106,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
            }}>
              {agent.icon}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#E8F0E8' }}>{agent.name}</div>
              <div style={{ fontSize: 9, color: '#6B7B6B' }}>{agent.level} • {agent.department}</div>
            </div>
            <div style={{
              marginLeft: 'auto',
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: agent.status === 'active' ? '#4ade80' : agent.status === 'idle' ? '#f59e0b' : '#6B7B6B',
            }} />
          </div>
          <div style={{ fontSize: 10, color: '#8B9B8B' }}>{agent.description}</div>
          {selectedAgent === agent.id && (
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <button
                style={{
                  padding: '8px 12px',
                  background: 'linear-gradient(135deg, #3F7249 0%, #2F5A39 100%)',
                  border: 'none',
                  borderRadius: 6,
                  color: '#E8F0E8',
                  fontSize: 10,
                  cursor: 'pointer',
                  marginRight: 8,
                }}
              >
                💬 Tester
              </button>
              <button
                style={{
                  padding: '8px 12px',
                  background: 'rgba(216,178,106,0.2)',
                  border: '1px solid rgba(216,178,106,0.3)',
                  borderRadius: 6,
                  color: '#D8B26A',
                  fontSize: 10,
                  cursor: 'pointer',
                }}
              >
                ⚙️ Configurer
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderTemplates = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
      {PROMPT_TEMPLATES.map(template => (
        <div
          key={template.id}
          style={{
            background: 'rgba(255,255,255,0.03)',
            borderRadius: 12,
            padding: 16,
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 20 }}>{template.icon}</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#E8F0E8' }}>{template.name}</div>
              <div style={{ fontSize: 9, color: '#D8B26A' }}>{template.category}</div>
            </div>
          </div>
          <div style={{
            fontSize: 10,
            color: '#8B9B8B',
            background: 'rgba(0,0,0,0.2)',
            padding: 10,
            borderRadius: 6,
            marginBottom: 12,
            fontFamily: 'monospace',
            lineHeight: 1.4,
          }}>
            {template.prompt.slice(0, 150)}...
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
            {template.variables.map(v => (
              <span key={v} style={{
                padding: '2px 8px',
                background: 'rgba(63,114,73,0.2)',
                borderRadius: 4,
                fontSize: 9,
                color: '#A8C8A8',
              }}>
                {`{${v}}`}
              </span>
            ))}
          </div>
          <button
            onClick={() => applyTemplate(template)}
            style={{
              padding: '8px 16px',
              background: 'linear-gradient(135deg, #D8B26A 0%, #C9A35B 100%)',
              border: 'none',
              borderRadius: 6,
              color: '#1A1A1A',
              fontSize: 10,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Utiliser →
          </button>
        </div>
      ))}
    </div>
  );

  const renderCompare = () => (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: '#D8B26A', marginBottom: 12 }}>⚔️ Comparaison Multi-Modèles</h3>
        <p style={{ fontSize: 11, color: '#8B9B8B', marginBottom: 16 }}>
          Sélectionnez plusieurs modèles et comparez leurs réponses côte à côte.
        </p>
        
        {/* Model chips */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          {LLM_PROVIDERS.filter(p => p.enabled).flatMap(p => p.models).map(model => (
            <button
              key={model.id}
              onClick={() => toggleModel(model.id)}
              style={{
                padding: '6px 12px',
                background: selectedModels.includes(model.id) ? 'rgba(63,114,73,0.3)' : 'rgba(255,255,255,0.05)',
                border: selectedModels.includes(model.id) ? '1px solid #3F7249' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: 20,
                color: selectedModels.includes(model.id) ? '#A8C8A8' : '#8B9B8B',
                fontSize: 10,
                cursor: 'pointer',
              }}
            >
              {model.name}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Entrez le prompt à comparer..."
            style={{
              flex: 1,
              padding: 12,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(216, 178, 106, 0.2)',
              borderRadius: 8,
              color: '#E8F0E8',
              fontSize: 11,
              resize: 'none',
              height: 80,
              outline: 'none',
            }}
          />
          <button
            onClick={handleCompare}
            disabled={selectedModels.length < 2 || !prompt.trim() || isLoading}
            style={{
              padding: '12px 24px',
              background: selectedModels.length >= 2 && prompt.trim() && !isLoading ? 'linear-gradient(135deg, #D8B26A 0%, #C9A35B 100%)' : 'rgba(216,178,106,0.2)',
              border: 'none',
              borderRadius: 8,
              color: selectedModels.length >= 2 && prompt.trim() && !isLoading ? '#1A1A1A' : '#6B7B6B',
              fontSize: 11,
              fontWeight: 600,
              cursor: selectedModels.length >= 2 && prompt.trim() && !isLoading ? 'pointer' : 'not-allowed',
            }}
          >
            {isLoading ? '⏳ Comparaison...' : '⚔️ Comparer'}
          </button>
        </div>
      </div>

      {/* Results */}
      {compareResults.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${compareResults.length}, 1fr)`, gap: 16 }}>
          {compareResults.map(result => (
            <div
              key={result.modelId}
              style={{
                background: 'rgba(255,255,255,0.03)',
                borderRadius: 12,
                padding: 16,
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 600, color: '#D8B26A', marginBottom: 8 }}>
                {result.modelId}
              </div>
              <div style={{ fontSize: 10, color: '#8B9B8B', marginBottom: 12, display: 'flex', gap: 12 }}>
                <span>📊 {result.tokens} tokens</span>
                <span>⚡ {result.latency}ms</span>
                <span>💰 ${result.cost.toFixed(4)}</span>
              </div>
              <div style={{
                fontSize: 11,
                color: '#E8F0E8',
                lineHeight: 1.5,
                maxHeight: 300,
                overflow: 'auto',
              }}>
                {result.response}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderMetrics = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
      {[
        { icon: '🧪', label: 'Expériences', value: '127', trend: '+12 cette semaine' },
        { icon: '💬', label: 'Requêtes API', value: '3,842', trend: '+234 aujourd\'hui' },
        { icon: '📊', label: 'Tokens utilisés', value: '1.2M', trend: '~$45 ce mois' },
        { icon: '⚡', label: 'Latence moyenne', value: '892ms', trend: '-15% vs semaine dernière' },
      ].map((stat, i) => (
        <div key={i} style={{
          background: 'rgba(255,255,255,0.03)',
          borderRadius: 12,
          padding: 20,
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>{stat.icon}</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#E8F0E8' }}>{stat.value}</div>
          <div style={{ fontSize: 11, color: '#8B9B8B' }}>{stat.label}</div>
          <div style={{ fontSize: 9, color: '#4ade80', marginTop: 4 }}>{stat.trend}</div>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(145deg, #0D1210 0%, #121816 50%, #0F1512 100%)',
      color: '#E8F0E8',
      fontFamily: "'Inter', sans-serif",
      padding: 24,
    }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#E8F0E8', marginBottom: 8 }}>
          🧪 IA Laboratory
        </h1>
        <p style={{ fontSize: 11, color: '#8B9B8B' }}>
          Expérimentez avec les modèles LLM et testez vos agents CHE·NU
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {[
          { id: 'playground' as LabTab, label: '🎮 Playground', icon: '🎮' },
          { id: 'agents' as LabTab, label: '🤖 Agents', icon: '🤖' },
          { id: 'templates' as LabTab, label: '📋 Templates', icon: '📋' },
          { id: 'compare' as LabTab, label: '⚔️ Comparer', icon: '⚔️' },
          { id: 'metrics' as LabTab, label: '📊 Métriques', icon: '📊' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 16px',
              background: activeTab === tab.id ? 'rgba(216,178,106,0.15)' : 'transparent',
              border: activeTab === tab.id ? '1px solid rgba(216,178,106,0.3)' : '1px solid rgba(255,255,255,0.06)',
              borderRadius: 8,
              color: activeTab === tab.id ? '#D8B26A' : '#8B9B8B',
              fontSize: 11,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'playground' && renderPlayground()}
      {activeTab === 'agents' && renderAgents()}
      {activeTab === 'templates' && renderTemplates()}
      {activeTab === 'compare' && renderCompare()}
      {activeTab === 'metrics' && renderMetrics()}
    </div>
  );
};

export default IALaboratoryPage;
