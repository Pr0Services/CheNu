import React, { useState } from 'react';

const templateCategories = {
  "Administration": {
    icon: "📂",
    templates: [
      { id: "contract", name: "Contrat de Construction", icon: "📑", format: "docx", dept: "Conformité", fields: ["client", "project", "montant", "date_debut", "date_fin"] },
      { id: "meeting_minutes", name: "Procès-verbal de Réunion", icon: "📝", format: "docx", dept: "Gestion", fields: ["projet", "date", "participants", "sujets", "actions"] },
      { id: "letter_template", name: "Lettre Officielle", icon: "✉️", format: "docx", dept: "Administration", fields: ["destinataire", "objet", "contenu"] },
      { id: "change_order", name: "Avenant / Change Order", icon: "📋", format: "docx", dept: "Gestion", fields: ["projet", "description", "impact_cout", "impact_delai"] },
    ]
  },
  "Estimation": {
    icon: "💰",
    templates: [
      { id: "bid_form", name: "Formulaire de Soumission", icon: "📝", format: "xlsx", dept: "Estimation", fields: ["projet", "client", "prix_total", "validite", "conditions"] },
      { id: "cost_estimate", name: "Estimation Détaillée", icon: "🧮", format: "xlsx", dept: "Estimation", fields: ["divisions_csi", "quantites", "prix_unitaires", "totaux"] },
      { id: "quantity_takeoff", name: "Relevé de Quantités", icon: "📐", format: "xlsx", dept: "Estimation", fields: ["element", "quantite", "unite", "notes"] },
      { id: "subcontractor_comparison", name: "Comparatif Sous-traitants", icon: "⚖️", format: "xlsx", dept: "Estimation", fields: ["discipline", "soumissionnaires", "prix", "notes"] },
    ]
  },
  "Chantier": {
    icon: "👷",
    templates: [
      { id: "daily_report", name: "Rapport Journalier", icon: "📓", format: "docx", dept: "Chantier", fields: ["date", "meteo", "effectifs", "activites", "problemes", "photos"] },
      { id: "weekly_report", name: "Rapport Hebdomadaire", icon: "📊", format: "docx", dept: "Gestion", fields: ["semaine", "avancement", "budget", "enjeux", "prochaines_etapes"] },
      { id: "site_inspection", name: "Rapport d'Inspection", icon: "🔍", format: "docx", dept: "Qualité", fields: ["zone", "elements", "conformite", "deficiences", "photos"] },
      { id: "delivery_receipt", name: "Bon de Réception", icon: "🚚", format: "docx", dept: "Chantier", fields: ["fournisseur", "materiaux", "quantites", "etat", "signature"] },
    ]
  },
  "SST": {
    icon: "🦺",
    templates: [
      { id: "safety_plan", name: "Plan de Sécurité", icon: "📋", format: "docx", dept: "Conformité", fields: ["projet", "risques", "mesures", "responsables", "urgences"] },
      { id: "incident_report", name: "Rapport d'Incident", icon: "🚨", format: "docx", dept: "Conformité", fields: ["date", "lieu", "description", "temoins", "actions"] },
      { id: "toolbox_talk", name: "Causerie Sécurité", icon: "💬", format: "docx", dept: "Chantier", fields: ["sujet", "points_cles", "participants", "signatures"] },
      { id: "jsa", name: "Analyse Sécuritaire (JSA)", icon: "⚠️", format: "xlsx", dept: "Conformité", fields: ["tache", "etapes", "dangers", "mesures"] },
    ]
  },
  "Qualité": {
    icon: "✅",
    templates: [
      { id: "deficiency_list", name: "Liste de Déficiences", icon: "📝", format: "xlsx", dept: "Qualité", fields: ["zone", "deficience", "responsable", "date_limite", "statut"] },
      { id: "qc_checklist", name: "Check-list Qualité", icon: "✅", format: "xlsx", dept: "Qualité", fields: ["element", "critere", "conforme", "notes"] },
      { id: "test_report", name: "Rapport d'Essai", icon: "🧪", format: "docx", dept: "Qualité", fields: ["type_essai", "resultats", "normes", "conclusion"] },
      { id: "ncr", name: "Non-Conformité (NCR)", icon: "❌", format: "docx", dept: "Qualité", fields: ["description", "cause", "action_corrective", "verification"] },
    ]
  },
  "Permis": {
    icon: "📜",
    templates: [
      { id: "permit_application", name: "Demande de Permis", icon: "📄", format: "docx", dept: "Conformité", fields: ["type_permis", "adresse", "description", "plans_joints"] },
      { id: "inspection_request", name: "Demande d'Inspection", icon: "🔍", format: "docx", dept: "Conformité", fields: ["type_inspection", "date_souhaitee", "travaux_completes"] },
      { id: "occupancy_request", name: "Demande Certificat Occupation", icon: "🏠", format: "docx", dept: "Conformité", fields: ["adresse", "usage", "documents_joints"] },
    ]
  },
  "Fermeture": {
    icon: "🏁",
    templates: [
      { id: "substantial_completion", name: "Certificat Achèvement Substantiel", icon: "📜", format: "docx", dept: "Gestion", fields: ["projet", "date", "travaux_restants", "retenues"] },
      { id: "warranty_letter", name: "Lettre de Garantie", icon: "🛡️", format: "docx", dept: "Administration", fields: ["elements", "duree", "conditions"] },
      { id: "asbuilt_index", name: "Index Plans As-Built", icon: "📋", format: "xlsx", dept: "Architecture", fields: ["discipline", "numero_plan", "date", "revision"] },
      { id: "closeout_checklist", name: "Check-list Fermeture", icon: "✅", format: "xlsx", dept: "Gestion", fields: ["item", "responsable", "statut", "date"] },
    ]
  }
};

// Exemple de template généré
const sampleDailyReport = `
RAPPORT JOURNALIER DE CHANTIER
==============================

Projet: {{projet.nom}}
No. Projet: {{projet.numero}}
Date: {{date}}
Jour: {{jour_semaine}}

MÉTÉO
-----
Température: {{meteo.temperature}}°C
Conditions: {{meteo.conditions}}
Vent: {{meteo.vent}} km/h

EFFECTIFS SUR LE CHANTIER
-------------------------
{{#each effectifs}}
- {{metier}}: {{nombre}} personnes ({{heures}}h)
{{/each}}

Total: {{effectifs_total}} personnes

TRAVAUX RÉALISÉS
----------------
{{#each activites}}
{{index}}. {{zone}} - {{description}}
   Avancement: {{avancement}}%
{{/each}}

ÉQUIPEMENTS UTILISÉS
--------------------
{{#each equipements}}
- {{nom}} ({{heures}}h)
{{/each}}

LIVRAISONS REÇUES
-----------------
{{#each livraisons}}
- {{fournisseur}}: {{materiau}} ({{quantite}})
{{/each}}

PROBLÈMES / ENJEUX
------------------
{{#each problemes}}
- {{description}}
  Impact: {{impact}}
  Action: {{action}}
{{/each}}

NOTES ADDITIONNELLES
--------------------
{{notes}}

PHOTOS DU JOUR
--------------
{{photos.count}} photos jointes

Préparé par: {{auteur}}
Signature: _________________
`;

export default function ConstructionTemplates() {
  const [selectedCategory, setSelectedCategory] = useState("Chantier");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  // Contexte d'utilisation
  const [useContext, setUseContext] = useState({
    level: 'project', // 'enterprise', 'department', 'project', 'task'
    project: 'PRJ-2024-001',
    task: null,
  });

  const projects = [
    { id: "PRJ-2024-001", name: "Centre Commercial Phase 2" },
    { id: "PRJ-2024-002", name: "Tour Résidentielle" },
    { id: "PRJ-2024-003", name: "École Primaire" },
  ];

  const allTemplates = Object.entries(templateCategories).flatMap(([cat, data]) =>
    data.templates.map(t => ({ ...t, category: cat }))
  );

  const filteredTemplates = searchTerm
    ? allTemplates.filter(t => 
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.dept.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : templateCategories[selectedCategory]?.templates || [];

  const handleFieldChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const generateDocument = () => {
    alert(`Document "${selectedTemplate?.name}" généré avec succès!\n\nContexte: ${useContext.level}\nProjet: ${useContext.project}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📄</span>
            <div>
              <h1 className="text-2xl font-bold">Templates Documents</h1>
              <p className="text-gray-400">Bibliothèque de documents standardisés</p>
            </div>
          </div>
          
          {/* Context Selector */}
          <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-2">
            <span className="text-sm text-gray-400">Contexte:</span>
            <select
              value={useContext.level}
              onChange={(e) => setUseContext({...useContext, level: e.target.value})}
              className="bg-gray-700 rounded px-2 py-1 text-sm"
            >
              <option value="enterprise">🏢 Entreprise</option>
              <option value="department">🏛️ Département</option>
              <option value="project">📁 Projet</option>
              <option value="task">✅ Tâche</option>
            </select>
            {(useContext.level === 'project' || useContext.level === 'task') && (
              <select
                value={useContext.project}
                onChange={(e) => setUseContext({...useContext, project: e.target.value})}
                className="bg-gray-700 rounded px-2 py-1 text-sm"
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 Rechercher un template..."
            className="w-full bg-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="grid grid-cols-4 gap-4">
          {/* Categories */}
          <div className="bg-gray-800 rounded-xl p-4">
            <h2 className="text-lg font-semibold mb-4">📁 Catégories</h2>
            {Object.entries(templateCategories).map(([catName, catData]) => (
              <button
                key={catName}
                onClick={() => { setSelectedCategory(catName); setSelectedTemplate(null); setSearchTerm(''); }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg mb-1 transition ${
                  selectedCategory === catName && !searchTerm ? 'bg-amber-600' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{catData.icon}</span>
                  <span>{catName}</span>
                </div>
                <span className="text-xs bg-gray-600 px-2 py-0.5 rounded">
                  {catData.templates.length}
                </span>
              </button>
            ))}
          </div>

          {/* Templates List */}
          <div className="bg-gray-800 rounded-xl p-4">
            <h2 className="text-lg font-semibold mb-4">
              {searchTerm ? `🔍 Résultats (${filteredTemplates.length})` : `📋 ${selectedCategory}`}
            </h2>
            <div className="space-y-2">
              {filteredTemplates.map(template => (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className={`p-3 rounded-lg cursor-pointer transition ${
                    selectedTemplate?.id === template.id ? 'bg-amber-600' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{template.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{template.name}</h3>
                      <div className="flex gap-2 mt-1">
                        <span className="text-xs bg-gray-600 px-1 rounded">{template.format}</span>
                        <span className="text-xs text-gray-400">{template.dept}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Template Detail & Form */}
          <div className="col-span-2 bg-gray-800 rounded-xl p-4">
            {selectedTemplate ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{selectedTemplate.icon}</span>
                    <div>
                      <h2 className="text-xl font-bold">{selectedTemplate.name}</h2>
                      <div className="flex gap-2 mt-1">
                        <span className="text-sm bg-blue-600 px-2 py-0.5 rounded">{selectedTemplate.format.toUpperCase()}</span>
                        <span className="text-sm bg-gray-600 px-2 py-0.5 rounded">{selectedTemplate.dept}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setPreviewMode(!previewMode)}
                    className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm"
                  >
                    {previewMode ? '📝 Formulaire' : '👁️ Aperçu'}
                  </button>
                </div>

                {previewMode ? (
                  /* Preview Mode */
                  <div className="bg-gray-900 rounded-lg p-4 font-mono text-xs overflow-auto max-h-96">
                    <pre className="whitespace-pre-wrap text-gray-300">
                      {selectedTemplate.id === 'daily_report' ? sampleDailyReport : 
                       `Template: ${selectedTemplate.name}\n\nChamps disponibles:\n${selectedTemplate.fields?.map(f => `- {{${f}}}`).join('\n')}`}
                    </pre>
                  </div>
                ) : (
                  /* Form Mode */
                  <div className="space-y-4">
                    {/* Auto-filled context */}
                    <div className="bg-gray-700 rounded-lg p-3">
                      <h3 className="text-sm text-amber-400 mb-2">📍 Contexte (auto-rempli)</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-400">Entreprise:</span>
                          <span className="ml-2">Construction ABC Inc.</span>
                        </div>
                        {useContext.project && (
                          <div>
                            <span className="text-gray-400">Projet:</span>
                            <span className="ml-2">{projects.find(p => p.id === useContext.project)?.name}</span>
                          </div>
                        )}
                        <div>
                          <span className="text-gray-400">Date:</span>
                          <span className="ml-2">{new Date().toLocaleDateString('fr-CA')}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Auteur:</span>
                          <span className="ml-2">Agent ROADY</span>
                        </div>
                      </div>
                    </div>

                    {/* Dynamic Fields */}
                    <div>
                      <h3 className="text-sm text-gray-400 mb-2">📝 Champs à remplir</h3>
                      <div className="space-y-3">
                        {selectedTemplate.fields?.filter(f => !['projet', 'date', 'auteur'].includes(f)).map(field => (
                          <div key={field}>
                            <label className="block text-sm text-gray-400 mb-1 capitalize">
                              {field.replace(/_/g, ' ')}
                            </label>
                            {field.includes('description') || field.includes('contenu') || field.includes('notes') ? (
                              <textarea
                                value={formData[field] || ''}
                                onChange={(e) => handleFieldChange(field, e.target.value)}
                                className="w-full bg-gray-700 rounded-lg px-3 py-2 h-24"
                                placeholder={`Entrez ${field.replace(/_/g, ' ')}...`}
                              />
                            ) : (
                              <input
                                type="text"
                                value={formData[field] || ''}
                                onChange={(e) => handleFieldChange(field, e.target.value)}
                                className="w-full bg-gray-700 rounded-lg px-3 py-2"
                                placeholder={`Entrez ${field.replace(/_/g, ' ')}...`}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t border-gray-700">
                      <button
                        onClick={generateDocument}
                        className="flex-1 bg-amber-600 hover:bg-amber-700 py-3 rounded-lg font-semibold"
                      >
                        📄 Générer Document
                      </button>
                      <button className="bg-gray-700 hover:bg-gray-600 px-4 py-3 rounded-lg">
                        💾 Sauvegarder Brouillon
                      </button>
                    </div>

                    {/* Integration Options */}
                    <div className="bg-gray-700 rounded-lg p-3 mt-4">
                      <h3 className="text-sm text-gray-400 mb-2">🔗 Destination</h3>
                      <div className="flex gap-2 flex-wrap">
                        <label className="flex items-center gap-2 bg-gray-600 px-3 py-1 rounded cursor-pointer">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <span className="text-sm">📁 Google Drive</span>
                        </label>
                        <label className="flex items-center gap-2 bg-gray-600 px-3 py-1 rounded cursor-pointer">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">🐙 GitHub</span>
                        </label>
                        <label className="flex items-center gap-2 bg-gray-600 px-3 py-1 rounded cursor-pointer">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">📧 Email</span>
                        </label>
                        <label className="flex items-center gap-2 bg-gray-600 px-3 py-1 rounded cursor-pointer">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">💬 Slack</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                ← Sélectionnez un template
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-4 gap-4">
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-amber-400">{allTemplates.length}</div>
            <div className="text-sm text-gray-400">Templates disponibles</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">7</div>
            <div className="text-sm text-gray-400">Catégories</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">156</div>
            <div className="text-sm text-gray-400">Générés ce mois</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">3</div>
            <div className="text-sm text-gray-400">Intégrations actives</div>
          </div>
        </div>
      </div>
    </div>
  );
}
