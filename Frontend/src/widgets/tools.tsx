import React, { useState } from 'react';

const constructionTools = {
  "Estimation & Coûts": {
    icon: "💰",
    color: "green",
    tools: [
      { id: "takeoff_calculator", name: "Calculateur de Quantités", icon: "📐", cost: 100, desc: "Calcule surfaces, volumes et longueurs à partir des plans", inputs: ["plans_pdf", "échelle"], outputs: ["quantités_détaillées", "liste_matériaux"] },
      { id: "pricing_engine", name: "Moteur de Prix", icon: "💵", cost: 150, desc: "Applique les prix unitaires aux quantités", inputs: ["quantités", "région", "année"], outputs: ["coûts_détaillés", "ventilation_CSI"] },
      { id: "labor_rate_calculator", name: "Calculateur Taux Horaires", icon: "👷", cost: 80, desc: "Calcule les taux chargés avec avantages sociaux", inputs: ["taux_base", "région", "métier"], outputs: ["taux_chargé", "détail_charges"] },
      { id: "contingency_calculator", name: "Calculateur Contingence", icon: "📊", cost: 60, desc: "Détermine les contingences selon le niveau de risque", inputs: ["phase_projet", "complexité", "historique"], outputs: ["pourcentage_recommandé", "justification"] },
      { id: "bid_analyzer", name: "Analyseur de Soumissions", icon: "📝", cost: 200, desc: "Compare et analyse les soumissions concurrentes", inputs: ["soumissions_historiques", "projet_actuel"], outputs: ["positionnement", "recommandation_prix"] },
      { id: "cost_database", name: "Base de Données Coûts", icon: "🗄️", cost: 50, desc: "Accès aux prix unitaires historiques", inputs: ["item", "région", "période"], outputs: ["prix_moyen", "tendance", "sources"] },
    ]
  },
  "Architecture & Design": {
    icon: "🏛️",
    color: "purple",
    tools: [
      { id: "floor_plan_generator", name: "Générateur Plans d'Étage", icon: "🏠", cost: 300, desc: "Génère des plans d'étage optimisés selon le programme", inputs: ["programme_fonctionnel", "dimensions_terrain"], outputs: ["plans_options", "surfaces_calculées"] },
      { id: "3d_modeler", name: "Modélisateur 3D", icon: "🎮", cost: 400, desc: "Crée des modèles 3D à partir des plans", inputs: ["plans_2d", "hauteurs", "matériaux"], outputs: ["modèle_3d", "vues_isométriques"] },
      { id: "rendering_engine", name: "Moteur de Rendu", icon: "🖼️", cost: 500, desc: "Génère des rendus photoréalistes", inputs: ["modèle_3d", "matériaux", "éclairage"], outputs: ["images_HD", "animations"] },
      { id: "space_planner", name: "Planificateur d'Espaces", icon: "📏", cost: 200, desc: "Optimise l'aménagement des espaces", inputs: ["besoins", "contraintes", "normes"], outputs: ["layout_optimisé", "circulation"] },
      { id: "material_specifier", name: "Spécificateur Matériaux", icon: "🧱", cost: 150, desc: "Sélectionne et spécifie les matériaux appropriés", inputs: ["usage", "budget", "esthétique"], outputs: ["spécifications", "alternatives"] },
      { id: "bim_coordinator", name: "Coordinateur BIM", icon: "💻", cost: 350, desc: "Coordonne les modèles multidisciplinaires", inputs: ["modèles_discipline"], outputs: ["modèle_fédéré", "rapport_clashes"] },
    ]
  },
  "Ingénierie": {
    icon: "⚙️",
    color: "red",
    tools: [
      { id: "load_calculator", name: "Calculateur de Charges", icon: "⚖️", cost: 200, desc: "Calcule les charges mortes, vives, neige, vent, séisme", inputs: ["usage", "localisation", "dimensions"], outputs: ["charges_factorées", "combinaisons"] },
      { id: "beam_designer", name: "Dimensionneur Poutres", icon: "📏", cost: 250, desc: "Dimensionne les poutres selon les charges", inputs: ["portée", "charges", "matériau"], outputs: ["section_requise", "vérifications"] },
      { id: "hvac_load_calculator", name: "Calcul Charges CVAC", icon: "❄️", cost: 300, desc: "Calcule les charges de chauffage et climatisation", inputs: ["enveloppe", "usage", "climat"], outputs: ["BTU_requis", "équipements_suggérés"] },
      { id: "electrical_load_calculator", name: "Calcul Charge Électrique", icon: "⚡", cost: 200, desc: "Calcule la demande électrique totale", inputs: ["équipements", "éclairage", "usage"], outputs: ["kW_total", "ampérage", "panneau_requis"] },
      { id: "pipe_sizer", name: "Dimensionneur Tuyauterie", icon: "🔧", cost: 150, desc: "Dimensionne les tuyaux selon le débit", inputs: ["débit", "pression", "matériau"], outputs: ["diamètre_requis", "perte_charge"] },
      { id: "seismic_analyzer", name: "Analyseur Sismique", icon: "📈", cost: 400, desc: "Évalue les forces sismiques selon le CNB", inputs: ["localisation", "sol", "structure"], outputs: ["forces_latérales", "catégorie_bâtiment"] },
    ]
  },
  "Conformité & Codes": {
    icon: "⚖️",
    color: "orange",
    tools: [
      { id: "code_searcher", name: "Recherche de Codes", icon: "📚", cost: 100, desc: "Recherche les articles pertinents dans les codes", inputs: ["sujet", "code", "édition"], outputs: ["articles_pertinents", "interprétations"] },
      { id: "permit_application_generator", name: "Générateur Demande Permis", icon: "📜", cost: 200, desc: "Génère les formulaires de demande de permis", inputs: ["type_projet", "municipalité", "informations"], outputs: ["formulaires_complétés", "liste_documents"] },
      { id: "fire_separation_calculator", name: "Calcul Séparations Coupe-feu", icon: "🔥", cost: 150, desc: "Détermine les degrés de résistance au feu requis", inputs: ["usages", "aire", "hauteur"], outputs: ["DRF_requis", "assemblages_conformes"] },
      { id: "egress_analyzer", name: "Analyseur Moyens d'Évacuation", icon: "🚪", cost: 180, desc: "Vérifie la conformité des issues", inputs: ["occupation", "distances", "largeurs"], outputs: ["conformité", "recommandations"] },
      { id: "accessibility_checker", name: "Vérificateur Accessibilité", icon: "♿", cost: 120, desc: "Vérifie la conformité aux normes d'accessibilité", inputs: ["plans", "usage"], outputs: ["rapport_conformité", "corrections_requises"] },
      { id: "zoning_analyzer", name: "Analyseur de Zonage", icon: "🗺️", cost: 100, desc: "Vérifie la conformité au zonage municipal", inputs: ["adresse", "projet"], outputs: ["usages_permis", "normes_applicables"] },
    ]
  },
  "Gestion de Projet": {
    icon: "📋",
    color: "blue",
    tools: [
      { id: "schedule_builder", name: "Constructeur d'Échéancier", icon: "📅", cost: 250, desc: "Crée des échéanciers de construction détaillés", inputs: ["activités", "durées", "dépendances"], outputs: ["diagramme_gantt", "chemin_critique"] },
      { id: "progress_tracker", name: "Suivi d'Avancement", icon: "📊", cost: 150, desc: "Suit l'avancement réel vs planifié", inputs: ["activités_complétées", "dates"], outputs: ["courbe_s", "écart_échéancier"] },
      { id: "budget_tracker", name: "Suivi Budgétaire", icon: "💳", cost: 200, desc: "Suit les coûts réels vs budget", inputs: ["factures", "engagements"], outputs: ["écart_budget", "prévision_finale"] },
      { id: "rfi_manager", name: "Gestionnaire RFI", icon: "❓", cost: 100, desc: "Gère les demandes d'information", inputs: ["question", "discipline", "priorité"], outputs: ["rfi_formaté", "suivi_réponse"] },
      { id: "change_order_processor", name: "Processeur d'Avenants", icon: "📝", cost: 180, desc: "Traite les demandes de changement", inputs: ["description", "impact_coût", "impact_délai"], outputs: ["avenant_formaté", "approbations_requises"] },
      { id: "daily_log_generator", name: "Générateur Journal Chantier", icon: "📓", cost: 80, desc: "Génère les rapports journaliers", inputs: ["météo", "main_oeuvre", "activités", "incidents"], outputs: ["journal_formaté", "photos_annotées"] },
    ]
  },
  "Sécurité & Qualité": {
    icon: "🦺",
    color: "teal",
    tools: [
      { id: "safety_plan_generator", name: "Générateur Plan Sécurité", icon: "📋", cost: 200, desc: "Génère des plans de sécurité personnalisés", inputs: ["type_travaux", "risques", "effectifs"], outputs: ["plan_sécurité", "procédures"] },
      { id: "hazard_identifier", name: "Identificateur de Dangers", icon: "⚠️", cost: 150, desc: "Identifie les dangers potentiels", inputs: ["activité", "environnement"], outputs: ["liste_dangers", "mesures_contrôle"] },
      { id: "inspection_checklist", name: "Check-list Inspection", icon: "✅", cost: 80, desc: "Génère des check-lists d'inspection", inputs: ["type_inspection", "phase"], outputs: ["checklist", "critères_acceptation"] },
      { id: "incident_reporter", name: "Rapporteur d'Incidents", icon: "🚨", cost: 100, desc: "Documente et analyse les incidents", inputs: ["type_incident", "circonstances"], outputs: ["rapport_incident", "actions_correctives"] },
      { id: "deficiency_tracker", name: "Suivi des Déficiences", icon: "🔍", cost: 120, desc: "Gère la liste des déficiences", inputs: ["déficiences", "photos"], outputs: ["liste_priorisée", "suivi_correction"] },
      { id: "quality_report_generator", name: "Générateur Rapport Qualité", icon: "📊", cost: 150, desc: "Génère des rapports de contrôle qualité", inputs: ["inspections", "tests"], outputs: ["rapport_qualité", "statistiques"] },
    ]
  }
};

export default function ConstructionTools() {
  const [selectedCategory, setSelectedCategory] = useState("Estimation & Coûts");
  const [selectedTool, setSelectedTool] = useState(null);

  const totalTools = Object.values(constructionTools).reduce((sum, cat) => sum + cat.tools.length, 0);

  const getColorClass = (color