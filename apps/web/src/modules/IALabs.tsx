/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║              CHE·NU V25 - IA LABS                                            ║
 * ║              Multi-LLM Comparison & Prompt Engineering Studio                ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * Features:
 * - Multi-LLM simultaneous testing (GPT-4, Claude, Gemini, Llama, Mistral)
 * - Side-by-side response comparison
 * - Prompt templates library
 * - Token usage & cost tracking
 * - Response quality scoring
 * - Prompt history & favorites
 * - Export results
 */

import React, { useState } from 'react';

const colors = {
  gold: '#D8B26A', goldDark: '#B89040', stone: '#8D8371', emerald: '#3F7249',
  turquoise: '#3EB4A2', moss: '#2F4C39', slate: '#1E1F22', card: '#242424',
  sand: '#E9E4D6', border: '#2A2A2A',
  openai: '#10A37F', anthropic: '#D4A27F', google: '#4285F4',
  meta: '#0668E1', mistral: '#FF7000'
};

// LLM Models Configuration
const LLM_MODELS = [
  { id: 'gpt4', name: 'GPT-4 Turbo', provider: 'OpenAI', icon: '🤖', color: colors.openai, costPer1k: 0.01, maxTokens: 128000 },
  { id: 'gpt35', name: 'GPT-3.5 Turbo', provider: 'OpenAI', icon: '⚡', color: colors.openai, costPer1k: 0.0005, maxTokens: 16000 },
  { id: 'claude3', name: 'Claude 3 Opus', provider: 'Anthropic', icon: '🎭', color: colors.anthropic, costPer1k: 0.015, maxTokens: 200000 },
  { id: 'claude35', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', icon: '🎵', color: colors.anthropic, costPer1k: 0.003, maxTokens: 200000 },
  { id: 'gemini', name: 'Gemini Pro', provider: 'Google', icon: '💎', color: colors.google, costPer1k: 0.00025, maxTokens: 32000 },
  { id: 'llama3', name: 'Llama 3 70B', provider: 'Meta', icon: '🦙', color: colors.meta, costPer1k: 0.0008, maxTokens: 8000 },
  { id: 'mistral', name: 'Mistral Large', provider: 'Mistral', icon: '🌬️', color: colors.mistral, costPer1k: 0.002, maxTokens: 32000 }
];

// Prompt Templates
const PROMPT_TEMPLATES = [
  { id: 'analysis', name: 'Analyse de document', icon: '📄', category: 'Business', prompt: 'Analysez le document suivant et fournissez un résumé structuré avec les points clés:\n\n{input}' },
  { id: 'code', name: 'Génération de code', icon: '💻', category: 'Dev', prompt: 'Écrivez du code {language} pour:\n\n{input}\n\nIncluez des commentaires et gérez les erreurs.' },
  { id: 'translate', name: 'Traduction', icon: '🌍', category: 'Langue', prompt: 'Traduisez le texte suivant de {source} vers {target}, en préservant le ton et le style:\n\n{input}' },
  { id: 'summarize', name: 'Résumé', icon: '📝', category: 'Writing', prompt: 'Résumez le texte suivant en {length} points clés:\n\n{input}' },
  { id: 'email', name: 'Rédaction email', icon: '✉️', category: 'Business', prompt: 'Rédigez un email professionnel pour {purpose}. Ton: {tone}.\n\nContexte: {input}' },
  { id: 'creative', name: 'Écriture créative', icon: '✨', category: 'Creative', prompt: 'Écrivez {type} sur le thème suivant:\n\n{input}\n\nStyle: {style}' },
  { id: 'sql', name: 'Requête SQL', icon: '🗃️', category: 'Dev', prompt: 'Générez une requête SQL pour:\n\n{input}\n\nBase de données: {database}' },
  { id: 'explain', name: 'Explication simple', icon: '🎓', category: 'Education', prompt: 'Expliquez le concept suivant comme si vous parliez à {audience}:\n\n{input}' }
];

// ═══════════════════════════════════════════════════════════════════════════════
// MODEL SELECTOR
// ═══════════════════════════════════════════════════════════════════════════════

const ModelSelector = ({ selectedModels, onToggle }: { selectedModels: string[]; onToggle: (id: string) => void }) => {
  return (
    <div style={{ marginBottom: 20 }}>
      <h4 style={{ color: colors.sand, margin: '0 0 12px', fontSize: 14 }}>🤖 Modèles à comparer</h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {LLM_MODELS.map(model => (
          <button
            key={model.id}
            onClick={() => onToggle(model.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px',
              background: selectedModels.includes(model.id) ? model.color : colors.card,
              border: `2px solid ${selectedModels.includes(model.id) ? model.color : colors.border}`,
              borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s'
            }}
          >
            <span style={{ fontSize: 18 }}>{model.icon}</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ color: selectedModels.includes(model.id) ? 'white' : colors.sand, fontSize: 13, fontWeight: 500 }}>{model.name}</div>
              <div style={{ color: selectedModels.includes(model.id) ? 'rgba(255,255,255,0.7)' : colors.stone, fontSize: 10 }}>{model.provider}</div>
            </div>
            {selectedModels.includes(model.id) && <span style={{ color: 'white', marginLeft: 4 }}>✓</span>}
          </button>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// PROMPT INPUT
// ═══════════════════════════════════════════════════════════════════════════════

const PromptInput = ({ value, onChange, onSubmit, isLoading }: { value: string; onChange: (v: string) => void; onSubmit: () => void; isLoading: boolean }) => {
  const [showTemplates, setShowTemplates] = useState(false);

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h4 style={{ color: colors.sand, margin: 0, fontSize: 14 }}>💬 Prompt</h4>
        <button
          onClick={() => setShowTemplates(!showTemplates)}
          style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 8, padding: '6px 12px', color: colors.sand, cursor: 'pointer', fontSize: 12 }}
        >
          📚 Templates {showTemplates ? '▲' : '▼'}
        </button>
      </div>

      {showTemplates && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 12, padding: 12, background: colors.card, borderRadius: 12 }}>
          {PROMPT_TEMPLATES.map(template => (
            <button
              key={template.id}
              onClick={() => { onChange(template.prompt); setShowTemplates(false); }}
              style={{ padding: 12, background: colors.slate, border: `1px solid ${colors.border}`, borderRadius: 8, cursor: 'pointer', textAlign: 'left' }}
            >
              <span style={{ fontSize: 20 }}>{template.icon}</span>
              <div style={{ color: colors.sand, fontSize: 12, fontWeight: 500, marginTop: 4 }}>{template.name}</div>
              <div style={{ color: colors.stone, fontSize: 10 }}>{template.category}</div>
            </button>
          ))}
        </div>
      )}

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Entrez votre prompt ici... Utilisez {variables} pour les templates."
        style={{
          width: '100%', minHeight: 120, padding: 16, background: colors.slate,
          border: `1px solid ${colors.moss}`, borderRadius: 12, color: colors.sand,
          fontSize: 14, resize: 'vertical', fontFamily: 'inherit', outline: 'none'
        }}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
        <div style={{ color: colors.stone, fontSize: 12 }}>
          {value.length} caractères · ~{Math.ceil(value.length / 4)} tokens estimés
        </div>
        <button
          onClick={onSubmit}
          disabled={!value.trim() || isLoading}
          style={{
            padding: '12px 32px', background: value.trim() && !isLoading ? colors.gold : colors.moss,
            border: 'none', borderRadius: 10, color: value.trim() && !isLoading ? colors.slate : colors.stone,
            fontWeight: 600, cursor: value.trim() && !isLoading ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', gap: 8
          }}
        >
          {isLoading ? '⏳ Génération...' : '🚀 Lancer la comparaison'}
        </button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// RESPONSE CARD
// ═══════════════════════════════════════════════════════════════════════════════

const ResponseCard = ({ model, response, isLoading }: { model: any; response: any; isLoading: boolean }) => {
  const [expanded, setExpanded] = useState(true);
  const [rating, setRating] = useState(0);

  return (
    <div style={{ background: colors.slate, border: `2px solid ${model.color}30`, borderRadius: 16, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ background: `${model.color}20`, padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 28 }}>{model.icon}</span>
          <div>
            <div style={{ color: colors.sand, fontWeight: 600, fontSize: 14 }}>{model.name}</div>
            <div style={{ color: colors.stone, fontSize: 11 }}>{model.provider}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {response && (
            <>
              <span style={{ background: colors.card, padding: '4px 8px', borderRadius: 6, color: colors.stone, fontSize: 11 }}>
                {response.tokens} tokens
              </span>
              <span style={{ background: colors.card, padding: '4px 8px', borderRadius: 6, color: colors.stone, fontSize: 11 }}>
                {response.time}s
              </span>
              <span style={{ background: colors.emerald, padding: '4px 8px', borderRadius: 6, color: 'white', fontSize: 11 }}>
                ${response.cost.toFixed(4)}
              </span>
            </>
          )}
          <button onClick={() => setExpanded(!expanded)} style={{ background: 'none', border: 'none', color: colors.stone, cursor: 'pointer', fontSize: 18 }}>
            {expanded ? '▼' : '▶'}
          </button>
        </div>
      </div>

      {/* Content */}
      {expanded && (
        <div style={{ padding: 16 }}>
          {isLoading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: 12, height: 12, borderRadius: '50%', background: model.color,
                    animation: `pulse 1s ease-in-out ${i * 0.2}s infinite`
                  }} />
                ))}
              </div>
            </div>
          ) : response ? (
            <>
              <div style={{ color: colors.sand, fontSize: 14, lineHeight: 1.7, whiteSpace: 'pre-wrap', marginBottom: 16 }}>
                {response.text}
              </div>

              {/* Rating */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: `1px solid ${colors.border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: colors.stone, fontSize: 12 }}>Qualité:</span>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, opacity: star <= rating ? 1 : 0.3 }}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button style={{ background: colors.card, border: 'none', borderRadius: 6, padding: '6px 12px', color: colors.sand, cursor: 'pointer', fontSize: 12 }}>📋 Copier</button>
                  <button style={{ background: colors.card, border: 'none', borderRadius: 6, padding: '6px 12px', color: colors.sand, cursor: 'pointer', fontSize: 12 }}>💾 Sauver</button>
                </div>
              </div>
            </>
          ) : (
            <div style={{ color: colors.stone, textAlign: 'center', padding: 40 }}>
              En attente du prompt...
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPARISON STATS
// ═══════════════════════════════════════════════════════════════════════════════

const ComparisonStats = ({ responses }: { responses: any[] }) => {
  if (responses.length === 0) return null;

  const fastest = responses.reduce((a, b) => a.time < b.time ? a : b);
  const cheapest = responses.reduce((a, b) => a.cost < b.cost ? a : b);
  const totalCost = responses.reduce((sum, r) => sum + r.cost, 0);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
      {[
        { label: 'Plus rapide', value: fastest.model, sub: `${fastest.time}s`, icon: '⚡' },
        { label: 'Moins cher', value: cheapest.model, sub: `$${cheapest.cost.toFixed(4)}`, icon: '💰' },
        { label: 'Coût total', value: `$${totalCost.toFixed(4)}`, sub: `${responses.length} modèles`, icon: '📊' },
        { label: 'Tokens totaux', value: responses.reduce((s, r) => s + r.tokens, 0).toLocaleString(), sub: 'tokens utilisés', icon: '🔢' }
      ].map((stat, i) => (
        <div key={i} style={{ background: colors.slate, border: `1px solid ${colors.moss}`, borderRadius: 12, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 20 }}>{stat.icon}</span>
            <span style={{ color: colors.stone, fontSize: 12 }}>{stat.label}</span>
          </div>
          <div style={{ color: colors.sand, fontSize: 18, fontWeight: 700 }}>{stat.value}</div>
          <div style={{ color: colors.stone, fontSize: 11 }}>{stat.sub}</div>
        </div>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// HISTORY SIDEBAR
// ═══════════════════════════════════════════════════════════════════════════════

const HistorySidebar = ({ history, onSelect }: { history: any[]; onSelect: (item: any) => void }) => {
  return (
    <div style={{ background: colors.slate, border: `1px solid ${colors.moss}`, borderRadius: 16, padding: 16 }}>
      <h4 style={{ color: colors.sand, margin: '0 0 16px', fontSize: 14 }}>📜 Historique</h4>
      {history.length === 0 ? (
        <p style={{ color: colors.stone, fontSize: 13, textAlign: 'center', padding: 20 }}>Aucun historique</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {history.map((item, i) => (
            <button
              key={i}
              onClick={() => onSelect(item)}
              style={{
                background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 8,
                padding: 12, cursor: 'pointer', textAlign: 'left'
              }}
            >
              <div style={{ color: colors.sand, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {item.prompt.slice(0, 50)}...
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                <span style={{ color: colors.stone, fontSize: 11 }}>{item.models.length} modèles</span>
                <span style={{ color: colors.stone, fontSize: 11 }}>{item.time}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export default function IALabs() {
  const [selectedModels, setSelectedModels] = useState<string[]>(['gpt4', 'claude35', 'gemini']);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [responses, setResponses] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([
    { prompt: 'Explique-moi la relativité générale simplement', models: ['gpt4', 'claude35'], time: 'il y a 2h' },
    { prompt: 'Génère un script Python pour analyser des CSV', models: ['gpt4', 'claude35', 'gemini'], time: 'il y a 5h' }
  ]);

  const toggleModel = (id: string) => {
    setSelectedModels(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);
  };

  const handleSubmit = async () => {
    if (!prompt.trim() || selectedModels.length === 0) return;
    
    setIsLoading(true);
    setResponses([]);

    // Simulate API calls with mock responses
    setTimeout(() => {
      const mockResponses = selectedModels.map(modelId => {
        const model = LLM_MODELS.find(m => m.id === modelId)!;
        const tokens = Math.floor(Math.random() * 500) + 200;
        return {
          modelId,
          model: model.name,
          text: `[Réponse simulée de ${model.name}]\n\nVoici une réponse détaillée à votre question. Cette réponse a été générée pour démontrer les capacités du modèle ${model.name} par ${model.provider}.\n\nLes points clés sont:\n1. Premier point important\n2. Deuxième point d'analyse\n3. Conclusion et recommandations\n\nN'hésitez pas à poser des questions de suivi.`,
          tokens,
          time: (Math.random() * 3 + 0.5).toFixed(2),
          cost: tokens * model.costPer1k / 1000
        };
      });
      
      setResponses(mockResponses);
      setIsLoading(false);
      setHistory(prev => [{ prompt, models: selectedModels, time: 'maintenant' }, ...prev]);
    }, 2000);
  };

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ color: colors.sand, fontSize: 26, fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
          🧪 IA Labs
          <span style={{ background: colors.gold, color: colors.slate, padding: '4px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600 }}>BETA</span>
        </h1>
        <p style={{ color: colors.stone, margin: '4px 0 0', fontSize: 14 }}>
          Comparez les réponses de plusieurs LLMs simultanément
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24 }}>
        {/* Main Content */}
        <div>
          <ModelSelector selectedModels={selectedModels} onToggle={toggleModel} />
          <PromptInput value={prompt} onChange={setPrompt} onSubmit={handleSubmit} isLoading={isLoading} />
          
          {responses.length > 0 && <ComparisonStats responses={responses} />}

          {/* Responses Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(selectedModels.length, 3)}, 1fr)`, gap: 16 }}>
            {selectedModels.map(modelId => {
              const model = LLM_MODELS.find(m => m.id === modelId)!;
              const response = responses.find(r => r.modelId === modelId);
              return (
                <ResponseCard key={modelId} model={model} response={response} isLoading={isLoading} />
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <HistorySidebar history={history} onSelect={(item) => setPrompt(item.prompt)} />
          
          {/* Quick Stats */}
          <div style={{ background: colors.slate, border: `1px solid ${colors.moss}`, borderRadius: 16, padding: 16, marginTop: 16 }}>
            <h4 style={{ color: colors.sand, margin: '0 0 16px', fontSize: 14 }}>📊 Statistiques</h4>
            {[
              { label: 'Requêtes aujourd\'hui', value: '24' },
              { label: 'Tokens utilisés', value: '45,230' },
              { label: 'Coût ce mois', value: '$12.45' },
              { label: 'Modèle préféré', value: 'Claude 3.5' }
            ].map((stat, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < 3 ? `1px solid ${colors.border}` : 'none' }}>
                <span style={{ color: colors.stone, fontSize: 12 }}>{stat.label}</span>
                <span style={{ color: colors.sand, fontSize: 12, fontWeight: 500 }}>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
