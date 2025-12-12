/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                       CHE·NU - IA APPRENTISSAGE                              ║
 * ║                                                                              ║
 * ║  Centre d'apprentissage et fine-tuning IA spécialisé                         ║
 * ║  - Modules d'apprentissage pré-configurés                                    ║
 * ║  - Datasets personnalisés                                                    ║
 * ║  - Fine-tuning de modèles                                                    ║
 * ║  - RAG (Retrieval Augmented Generation)                                      ║
 * ║  - Upload de documents                                                       ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface LearningModule {
  id: string;
  name: string;
  icon: string;
  category: string;
  description: string;
  skills: string[];
  examples: number;
  status: 'available' | 'installed' | 'training';
  progress?: number;
}

interface Dataset {
  id: string;
  name: string;
  type: 'documents' | 'qa' | 'conversations' | 'code' | 'mixed';
  size: number;
  status: 'ready' | 'processing' | 'error';
  lastUpdated: string;
  tags: string[];
}

interface TrainingJob {
  id: string;
  name: string;
  baseModel: string;
  dataset: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  progress: number;
  metrics?: { loss: number; accuracy: number; epochs: number };
}

interface KnowledgeBase {
  id: string;
  name: string;
  documentCount: number;
  chunkCount: number;
  status: 'active' | 'indexing' | 'error';
  sources: string[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════════════════

const LEARNING_MODULES: LearningModule[] = [
  { id: 'mod_estimation', name: 'Estimation de Coûts', icon: '🧮', category: 'Finance', description: 'Maîtrise l\'estimation des coûts de construction québécois', skills: ['Calcul matériaux', 'Main d\'œuvre', 'Frais généraux', 'Marges bénéficiaires'], examples: 1250, status: 'installed' },
  { id: 'mod_rbq', name: 'Expert RBQ', icon: '🏛️', category: 'Conformité', description: 'Réglementation complète de la Régie du bâtiment', skills: ['Licences', 'Codes', 'Inspections', 'Permis'], examples: 3420, status: 'installed' },
  { id: 'mod_cnesst', name: 'Sécurité CNESST', icon: '⚠️', category: 'Sécurité', description: 'Normes SST et prévention des accidents', skills: ['EPI', 'Signalisation', 'Procédures', 'Enquêtes'], examples: 2180, status: 'training', progress: 67 },
  { id: 'mod_ccq', name: 'Expert CCQ', icon: '👷', category: 'Relations', description: 'Conventions collectives et juridiction des métiers', skills: ['Conventions', 'Salaires', 'Juridiction', 'Cartes'], examples: 1890, status: 'available' },
  { id: 'mod_planification', name: 'Planification Pro', icon: '📅', category: 'Gestion', description: 'Planification et ordonnancement optimisés', skills: ['Gantt', 'Ressources', 'Chemin critique', 'Risques'], examples: 890, status: 'available' },
  { id: 'mod_communication', name: 'Communication Client', icon: '💬', category: 'Relations', description: 'Rédaction professionnelle adaptée', skills: ['Emails', 'Rapports', 'Présentations', 'Négociation'], examples: 2340, status: 'installed' },
  { id: 'mod_devis', name: 'Générateur de Devis', icon: '📄', category: 'Finance', description: 'Création automatique de devis conformes', skills: ['Templates', 'Calculs', 'Formatage', 'PDF'], examples: 1560, status: 'installed' },
  { id: 'mod_technique', name: 'Expertise Technique', icon: '🔧', category: 'Technique', description: 'Connaissances techniques construction', skills: ['Structures', 'MEP', 'Finitions', 'Matériaux'], examples: 4500, status: 'available' },
];

const DATASETS: Dataset[] = [
  { id: 'ds_devis', name: 'Devis Construction QC', type: 'documents', size: 1250, status: 'ready', lastUpdated: '2024-12-01', tags: ['devis', 'construction', 'RBQ'] },
  { id: 'ds_rbq', name: 'Réglementations RBQ', type: 'qa', size: 3420, status: 'ready', lastUpdated: '2024-11-28', tags: ['RBQ', 'conformité', 'licences'] },
  { id: 'ds_cnesst', name: 'Normes CNESST', type: 'qa', size: 2180, status: 'ready', lastUpdated: '2024-11-25', tags: ['CNESST', 'sécurité', 'SST'] },
  { id: 'ds_ccq', name: 'Conventions CCQ', type: 'documents', size: 890, status: 'processing', lastUpdated: '2024-12-05', tags: ['CCQ', 'conventions'] },
  { id: 'ds_projets', name: 'Historique Projets', type: 'mixed', size: 456, status: 'ready', lastUpdated: '2024-12-03', tags: ['projets', 'interne'] },
];

const TRAINING_JOBS: TrainingJob[] = [
  { id: 'job_001', name: 'Nova-Construction-v2', baseModel: 'claude-3-haiku', dataset: 'ds_devis', status: 'completed', progress: 100, metrics: { loss: 0.023, accuracy: 0.94, epochs: 5 } },
  { id: 'job_002', name: 'Compliance-Expert-v1', baseModel: 'gpt-3.5-turbo', dataset: 'ds_rbq', status: 'running', progress: 67 },
  { id: 'job_003', name: 'Safety-Advisor-v1', baseModel: 'mistral-7b', dataset: 'ds_cnesst', status: 'queued', progress: 0 },
];

const KNOWLEDGE_BASES: KnowledgeBase[] = [
  { id: 'kb_construction', name: 'Base Construction QC', documentCount: 1542, chunkCount: 45230, status: 'active', sources: ['RBQ', 'CNESST', 'CCQ', 'Code du bâtiment'] },
  { id: 'kb_interne', name: 'Base Interne Pro-Service', documentCount: 234, chunkCount: 8920, status: 'active', sources: ['Procédures', 'Politiques', 'Templates'] },
  { id: 'kb_projets', name: 'Historique Projets', documentCount: 567, chunkCount: 23450, status: 'indexing', sources: ['Rapports', 'Plans', 'Budgets'] },
];

// ═══════════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    ready: '#4ade80', active: '#4ade80', completed: '#4ade80', installed: '#4ade80',
    processing: '#f59e0b', indexing: '#f59e0b', running: '#f59e0b', training: '#f59e0b',
    queued: '#3b82f6', available: '#3b82f6',
    error: '#ef4444', failed: '#ef4444',
  };
  return colors[status] || '#6B7B6B';
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    ready: 'Prêt', active: 'Actif', completed: 'Terminé', installed: 'Installé',
    processing: 'Traitement...', indexing: 'Indexation...', running: 'En cours...', training: 'Entraînement...',
    queued: 'En attente', available: 'Disponible',
    error: 'Erreur', failed: 'Échoué',
  };
  return labels[status] || status;
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

type LearningTab = 'modules' | 'datasets' | 'training' | 'rag' | 'upload';

export const IALearningPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<LearningTab>('modules');
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [datasetName, setDatasetName] = useState('');
  const [datasetType, setDatasetType] = useState('documents');

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER SECTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  const renderModules = () => (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: '#D8B26A', marginBottom: 8 }}>🎓 Modules d'Apprentissage Spécialisé</h3>
        <p style={{ fontSize: 11, color: '#8B9B8B' }}>Activez des modules pré-entraînés pour donner à Nova des compétences spécifiques construction.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {LEARNING_MODULES.map(mod => (
          <div key={mod.id} style={{
            background: mod.status === 'installed' ? 'rgba(63, 114, 73, 0.1)' : 'rgba(255,255,255,0.03)',
            borderRadius: 12, padding: 20,
            border: mod.status === 'installed' ? '1px solid rgba(63, 114, 73, 0.3)' : '1px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 10, background: 'rgba(216,178,106,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{mod.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#E8F0E8' }}>{mod.name}</span>
                  <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 9, background: `${getStatusColor(mod.status)}20`, color: getStatusColor(mod.status) }}>{getStatusLabel(mod.status)}</span>
                </div>
                <div style={{ fontSize: 9, color: '#D8B26A' }}>{mod.category}</div>
              </div>
            </div>
            <p style={{ fontSize: 10, color: '#8B9B8B', marginBottom: 12 }}>{mod.description}</p>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 12 }}>
              {mod.skills.map(s => <span key={s} style={{ padding: '3px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: 4, fontSize: 9, color: '#A8B8A8' }}>{s}</span>)}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 9, color: '#6B7B6B' }}>📚 {mod.examples.toLocaleString()} exemples</span>
              {mod.status === 'available' && <button style={{ padding: '8px 16px', background: 'linear-gradient(135deg, #D8B26A 0%, #C9A35B 100%)', border: 'none', borderRadius: 6, color: '#1A1A1A', fontSize: 10, fontWeight: 600, cursor: 'pointer' }}>Installer →</button>}
              {mod.status === 'installed' && <button style={{ padding: '8px 16px', background: 'rgba(63, 114, 73, 0.2)', border: '1px solid rgba(63, 114, 73, 0.3)', borderRadius: 6, color: '#A8C8A8', fontSize: 10, cursor: 'pointer' }}>✓ Actif</button>}
              {mod.status === 'training' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 60, height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                    <div style={{ width: `${mod.progress}%`, height: '100%', background: '#f59e0b', borderRadius: 2 }} />
                  </div>
                  <span style={{ fontSize: 9, color: '#f59e0b' }}>{mod.progress}%</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDatasets = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#D8B26A', marginBottom: 8 }}>📊 Datasets d'Entraînement</h3>
          <p style={{ fontSize: 11, color: '#8B9B8B' }}>Gérez vos jeux de données pour l'entraînement</p>
        </div>
        <button onClick={() => setActiveTab('upload')} style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #D8B26A 0%, #C9A35B 100%)', border: 'none', borderRadius: 8, color: '#1A1A1A', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>+ Nouveau Dataset</button>
      </div>
      <div style={{ display: 'grid', gap: 12 }}>
        {DATASETS.map(ds => (
          <div key={ds.id} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 16, border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(216,178,106,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
              {ds.type === 'documents' ? '📄' : ds.type === 'qa' ? '❓' : ds.type === 'conversations' ? '💬' : '📦'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#E8F0E8' }}>{ds.name}</span>
                <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 9, background: `${getStatusColor(ds.status)}20`, color: getStatusColor(ds.status) }}>{getStatusLabel(ds.status)}</span>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                {ds.tags.map(t => <span key={t} style={{ padding: '2px 6px', background: 'rgba(63, 114, 73, 0.2)', borderRadius: 4, fontSize: 8, color: '#A8C8A8' }}>{t}</span>)}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#D8B26A' }}>{ds.size.toLocaleString()}</div>
              <div style={{ fontSize: 9, color: '#6B7B6B' }}>exemples</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTraining = () => (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: '#D8B26A', marginBottom: 8 }}>🔄 Jobs d'Entraînement</h3>
        <p style={{ fontSize: 11, color: '#8B9B8B' }}>Suivez vos entraînements et fine-tuning en cours</p>
      </div>
      <div style={{ display: 'grid', gap: 12 }}>
        {TRAINING_JOBS.map(job => (
          <div key={job.id} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 20, border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#E8F0E8' }}>{job.name}</span>
                <span style={{ marginLeft: 12, padding: '2px 8px', borderRadius: 4, fontSize: 9, background: `${getStatusColor(job.status)}20`, color: getStatusColor(job.status) }}>{getStatusLabel(job.status)}</span>
              </div>
              {job.metrics && (
                <div style={{ display: 'flex', gap: 16, fontSize: 10, color: '#8B9B8B' }}>
                  <span>Loss: <strong style={{ color: '#4ade80' }}>{job.metrics.loss}</strong></span>
                  <span>Accuracy: <strong style={{ color: '#4ade80' }}>{(job.metrics.accuracy * 100).toFixed(0)}%</strong></span>
                  <span>Epochs: <strong>{job.metrics.epochs}</strong></span>
                </div>
              )}
            </div>
            <div style={{ fontSize: 10, color: '#6B7B6B', marginBottom: 12 }}>
              Base: <strong>{job.baseModel}</strong> • Dataset: <strong>{job.dataset}</strong>
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3 }}>
              <div style={{ width: `${job.progress}%`, height: '100%', background: job.status === 'completed' ? '#4ade80' : job.status === 'running' ? '#D8B26A' : '#3b82f6', borderRadius: 3, transition: 'width 0.3s ease' }} />
            </div>
          </div>
        ))}
      </div>
      <button style={{ marginTop: 20, padding: '12px 24px', background: 'linear-gradient(135deg, #3F7249 0%, #2F5A39 100%)', border: 'none', borderRadius: 8, color: '#E8F0E8', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>+ Nouveau Fine-Tuning</button>
    </div>
  );

  const renderRAG = () => (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: '#D8B26A', marginBottom: 8 }}>🔍 Bases de Connaissances (RAG)</h3>
        <p style={{ fontSize: 11, color: '#8B9B8B' }}>Vos documents indexés pour la génération augmentée</p>
      </div>
      <div style={{ display: 'grid', gap: 16 }}>
        {KNOWLEDGE_BASES.map(kb => (
          <div key={kb.id} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 20, border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#E8F0E8' }}>{kb.name}</span>
                <span style={{ marginLeft: 12, padding: '2px 8px', borderRadius: 4, fontSize: 9, background: `${getStatusColor(kb.status)}20`, color: getStatusColor(kb.status) }}>{getStatusLabel(kb.status)}</span>
              </div>
              <button style={{ padding: '6px 12px', background: 'rgba(216,178,106,0.2)', border: '1px solid rgba(216,178,106,0.3)', borderRadius: 6, color: '#D8B26A', fontSize: 10, cursor: 'pointer' }}>🔄 Sync</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 16 }}>
              <div><div style={{ fontSize: 20, fontWeight: 700, color: '#D8B26A' }}>{kb.documentCount}</div><div style={{ fontSize: 9, color: '#6B7B6B' }}>Documents</div></div>
              <div><div style={{ fontSize: 20, fontWeight: 700, color: '#3F7249' }}>{(kb.chunkCount / 1000).toFixed(1)}K</div><div style={{ fontSize: 9, color: '#6B7B6B' }}>Chunks</div></div>
              <div><div style={{ fontSize: 20, fontWeight: 700, color: '#8B9B8B' }}>{kb.sources.length}</div><div style={{ fontSize: 9, color: '#6B7B6B' }}>Sources</div></div>
            </div>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {kb.sources.map(s => <span key={s} style={{ padding: '3px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: 4, fontSize: 9, color: '#8B9B8B' }}>{s}</span>)}
            </div>
          </div>
        ))}
      </div>
      <button style={{ marginTop: 20, padding: '12px 24px', background: 'linear-gradient(135deg, #D8B26A 0%, #C9A35B 100%)', border: 'none', borderRadius: 8, color: '#1A1A1A', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>+ Nouvelle Base de Connaissances</button>
    </div>
  );

  const renderUpload = () => (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: '#D8B26A', marginBottom: 8 }}>📤 Upload de Documents</h3>
        <p style={{ fontSize: 11, color: '#8B9B8B' }}>Ajoutez vos documents pour créer un nouveau dataset d'entraînement</p>
      </div>
      
      {/* Dataset Config */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div>
          <label style={{ display: 'block', fontSize: 11, color: '#8B9B8B', marginBottom: 8 }}>Nom du Dataset</label>
          <input type="text" value={datasetName} onChange={e => setDatasetName(e.target.value)} placeholder="Mon nouveau dataset..." style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(216,178,106,0.2)', borderRadius: 8, color: '#E8F0E8', fontSize: 12, outline: 'none' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 11, color: '#8B9B8B', marginBottom: 8 }}>Type de données</label>
          <select value={datasetType} onChange={e => setDatasetType(e.target.value)} style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(216,178,106,0.2)', borderRadius: 8, color: '#E8F0E8', fontSize: 12, outline: 'none' }}>
            <option value="documents">📄 Documents</option>
            <option value="qa">❓ Questions/Réponses</option>
            <option value="conversations">💬 Conversations</option>
            <option value="code">💻 Code</option>
            <option value="mixed">📦 Mixte</option>
          </select>
        </div>
      </div>

      {/* Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${dragActive ? '#D8B26A' : 'rgba(216,178,106,0.3)'}`,
          borderRadius: 16,
          padding: 48,
          textAlign: 'center',
          background: dragActive ? 'rgba(216,178,106,0.1)' : 'rgba(255,255,255,0.02)',
          transition: 'all 0.2s ease',
          cursor: 'pointer',
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 16 }}>📁</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#E8F0E8', marginBottom: 8 }}>
          Glissez vos fichiers ici
        </div>
        <div style={{ fontSize: 11, color: '#8B9B8B', marginBottom: 16 }}>
          ou cliquez pour sélectionner
        </div>
        <input type="file" multiple onChange={e => e.target.files && setUploadedFiles(Array.from(e.target.files))} style={{ display: 'none' }} id="file-upload" />
        <label htmlFor="file-upload" style={{ padding: '10px 24px', background: 'rgba(216,178,106,0.2)', border: '1px solid rgba(216,178,106,0.3)', borderRadius: 8, color: '#D8B26A', fontSize: 11, cursor: 'pointer' }}>Parcourir</label>
        <div style={{ fontSize: 9, color: '#6B7B6B', marginTop: 16 }}>
          Formats supportés: PDF, DOCX, TXT, CSV, JSON, MD
        </div>
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h4 style={{ fontSize: 12, fontWeight: 600, color: '#E8F0E8', marginBottom: 12 }}>Fichiers sélectionnés ({uploadedFiles.length})</h4>
          <div style={{ display: 'grid', gap: 8 }}>
            {uploadedFiles.map((file, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: 16 }}>📄</span>
                <span style={{ flex: 1, fontSize: 11, color: '#E8F0E8' }}>{file.name}</span>
                <span style={{ fontSize: 10, color: '#6B7B6B' }}>{(file.size / 1024).toFixed(1)} KB</span>
                <button onClick={() => setUploadedFiles(files => files.filter((_, idx) => idx !== i))} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 14 }}>×</button>
              </div>
            ))}
          </div>
          <button style={{ marginTop: 20, padding: '12px 32px', background: 'linear-gradient(135deg, #D8B26A 0%, #C9A35B 100%)', border: 'none', borderRadius: 8, color: '#1A1A1A', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
            🚀 Créer le Dataset
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(145deg, #0D1210 0%, #121816 50%, #0F1512 100%)', color: '#E8F0E8', fontFamily: "'Inter', sans-serif", padding: 24 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#E8F0E8', marginBottom: 8 }}>🎓 IA Apprentissage</h1>
        <p style={{ fontSize: 11, color: '#8B9B8B' }}>Centre de fine-tuning et d'apprentissage spécialisé pour Nova</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {[
          { id: 'modules' as LearningTab, label: '🎓 Modules' },
          { id: 'datasets' as LearningTab, label: '📊 Datasets' },
          { id: 'training' as LearningTab, label: '🔄 Training' },
          { id: 'rag' as LearningTab, label: '🔍 RAG' },
          { id: 'upload' as LearningTab, label: '📤 Upload' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: '10px 16px', background: activeTab === tab.id ? 'rgba(216,178,106,0.15)' : 'transparent', border: activeTab === tab.id ? '1px solid rgba(216,178,106,0.3)' : '1px solid rgba(255,255,255,0.06)', borderRadius: 8, color: activeTab === tab.id ? '#D8B26A' : '#8B9B8B', fontSize: 11, cursor: 'pointer' }}>{tab.label}</button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'modules' && renderModules()}
      {activeTab === 'datasets' && renderDatasets()}
      {activeTab === 'training' && renderTraining()}
      {activeTab === 'rag' && renderRAG()}
      {activeTab === 'upload' && renderUpload()}
    </div>
  );
};

export default IALearningPage;
