import React, { useState } from 'react';

const creativeAgents = {
  "Direction Créative": [
    { id: "creative_director", name: "Directeur Créatif", icon: "🎬", role: "L2", desc: "Supervise toute la production créative", tools: ["brief_analyzer", "quality_checker", "brand_guardian"], delegatesTo: ["content_lead", "visual_lead", "audio_lead"] },
    { id: "content_lead", name: "Lead Contenu", icon: "📝", role: "L2", desc: "Gère l'équipe de rédaction", tools: ["content_planner", "seo_optimizer"], delegatesTo: ["copywriter", "blogger", "scriptwriter"] },
    { id: "visual_lead", name: "Lead Visuel", icon: "🎨", role: "L2", desc: "Gère l'équipe graphique", tools: ["design_system", "asset_manager"], delegatesTo: ["graphic_designer", "ui_designer", "illustrator"] },
    { id: "audio_lead", name: "Lead Audio/Vidéo", icon: "🎥", role: "L2", desc: "Gère production multimédia", tools: ["media_pipeline", "render_queue"], delegatesTo: ["video_editor", "audio_engineer", "animator"] },
  ],
  "Rédaction & Copywriting": [
    { id: "copywriter", name: "Copywriter", icon: "✍️", role: "L3", desc: "Textes publicitaires percutants", tools: ["headline_generator", "cta_optimizer", "tone_analyzer"], speciality: "Conversion" },
    { id: "blogger", name: "Blogueur", icon: "📰", role: "L3", desc: "Articles de blog SEO", tools: ["keyword_researcher", "readability_checker", "plagiarism_detector"], speciality: "SEO" },
    { id: "scriptwriter", name: "Scénariste", icon: "🎭", role: "L3", desc: "Scripts vidéo et podcasts", tools: ["story_structure", "dialogue_generator", "timing_calculator"], speciality: "Storytelling" },
    { id: "technical_writer", name: "Rédacteur Technique", icon: "📚", role: "L3", desc: "Documentation et guides", tools: ["doc_formatter", "terminology_manager", "version_control"], speciality: "Clarté" },
    { id: "social_writer", name: "Rédacteur Social", icon: "📱", role: "L3", desc: "Posts réseaux sociaux", tools: ["hashtag_generator", "emoji_optimizer", "character_counter"], speciality: "Engagement" },
    { id: "email_writer", name: "Email Marketer", icon: "📧", role: "L3", desc: "Séquences email", tools: ["subject_tester", "personalization_engine", "spam_checker"], speciality: "Nurturing" },
    { id: "press_writer", name: "Attaché de Presse", icon: "🗞️", role: "L3", desc: "Communiqués de presse", tools: ["press_formatter", "media_database", "distribution_scheduler"], speciality: "Relations Presse" },
    { id: "ux_writer", name: "UX Writer", icon: "💬", role: "L3", desc: "Microcopy et interfaces", tools: ["ui_text_checker", "accessibility_validator", "localization_helper"], speciality: "UX" },
  ],
  "Design & Visuel": [
    { id: "graphic_designer", name: "Graphiste", icon: "🖼️", role: "L3", desc: "Visuels marketing", tools: ["image_generator", "color_palette", "layout_builder"], speciality: "Branding" },
    { id: "ui_designer", name: "UI Designer", icon: "📐", role: "L3", desc: "Interfaces utilisateur", tools: ["component_library", "prototype_builder", "design_tokens"], speciality: "Interfaces" },
    { id: "illustrator", name: "Illustrateur", icon: "🎨", role: "L3", desc: "Illustrations custom", tools: ["vector_generator", "style_transfer", "character_creator"], speciality: "Art" },
    { id: "infographic_designer", name: "Infographiste", icon: "📊", role: "L3", desc: "Infographies data", tools: ["data_visualizer", "chart_generator", "icon_library"], speciality: "Data Viz" },
    { id: "motion_designer", name: "Motion Designer", icon: "✨", role: "L3", desc: "Animations et transitions", tools: ["animation_timeline", "easing_library", "particle_system"], speciality: "Animation" },
    { id: "3d_artist", name: "Artiste 3D", icon: "🎮", role: "L3", desc: "Modèles et rendus 3D", tools: ["model_generator", "texture_library", "render_engine"], speciality: "3D" },
    { id: "photo_editor", name: "Retoucheur Photo", icon: "📷", role: "L3", desc: "Retouche et montage", tools: ["auto_enhance", "background_remover", "face_editor"], speciality: "Photo" },
    { id: "brand_designer", name: "Brand Designer", icon: "™️", role: "L3", desc: "Identité visuelle", tools: ["logo_generator", "brand_book_builder", "mockup_creator"], speciality: "Identité" },
  ],
  "Audio & Vidéo": [
    { id: "video_editor", name: "Monteur Vidéo", icon: "🎬", role: "L3", desc: "Montage et post-prod", tools: ["video_cutter", "transition_library", "color_grader"], speciality: "Montage" },
    { id: "audio_engineer", name: "Ingénieur Son", icon: "🎧", role: "L3", desc: "Production audio", tools: ["audio_mixer", "noise_reducer", "voice_enhancer"], speciality: "Audio" },
    { id: "animator", name: "Animateur", icon: "🎞️", role: "L3", desc: "Animations 2D/3D", tools: ["keyframe_editor", "rigging_system", "render_farm"], speciality: "Animation" },
    { id: "voiceover_director", name: "Directeur Voix", icon: "🎤", role: "L3", desc: "Direction voix-off", tools: ["tts_engine", "voice_cloner", "script_prompter"], speciality: "Voix" },
    { id: "podcast_producer", name: "Producteur Podcast", icon: "🎙️", role: "L3", desc: "Production podcast", tools: ["podcast_editor", "intro_generator", "rss_manager"], speciality: "Podcast" },
    { id: "music_composer", name: "Compositeur", icon: "🎵", role: "L3", desc: "Musique et jingles", tools: ["music_generator", "stem_separator", "mastering_suite"], speciality: "Musique" },
  ],
  "Stratégie & Optimisation": [
    { id: "content_strategist", name: "Stratège Contenu", icon: "🧠", role: "L3", desc: "Stratégie éditoriale", tools: ["content_calendar", "competitor_analyzer", "trend_detector"], speciality: "Stratégie" },
    { id: "seo_specialist", name: "Spécialiste SEO", icon: "🔍", role: "L3", desc: "Optimisation moteurs", tools: ["keyword_tracker", "backlink_analyzer", "serp_monitor"], speciality: "SEO" },
    { id: "social_strategist", name: "Stratège Social", icon: "📲", role: "L3", desc: "Stratégie réseaux", tools: ["social_scheduler", "engagement_tracker", "influencer_finder"], speciality: "Social" },
    { id: "performance_analyst", name: "Analyste Performance", icon: "📈", role: "L3", desc: "Analytics contenu", tools: ["content_scorer", "ab_tester", "roi_calculator"], speciality: "Analytics" },
    { id: "localization_manager", name: "Responsable Localisation", icon: "🌍", role: "L3", desc: "Traduction et adaptation", tools: ["translation_engine", "cultural_adapter", "market_researcher"], speciality: "i18n" },
    { id: "compliance_officer", name: "Responsable Conformité", icon: "⚖️", role: "L3", desc: "Conformité légale", tools: ["legal_checker", "disclaimer_generator", "gdpr_validator"], speciality: "Légal" },
    { id: "quality_assurance", name: "QA Contenu", icon: "✅", role: "L3", desc: "Contrôle qualité", tools: ["grammar_checker", "fact_verifier", "consistency_checker"], speciality: "Qualité" },
    { id: "asset_manager", name: "Gestionnaire Assets", icon: "📁", role: "L3", desc: "Gestion bibliothèque", tools: ["dam_system", "metadata_tagger", "version_controller"], speciality: "DAM" },
  ]
};

export default function CreativeStudioAgents() {
  const [selectedCategory, setSelectedCategory] = useState("Direction Créative");
  const [selectedAgent, setSelectedAgent] = useState(null);

  const totalAgents = Object.values(creativeAgents).flat().length;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">🎨</span>
          <h1 className="text-2xl font-bold">Creative Content Studio</h1>
          <span className="ml-auto bg-purple-600 px-3 py-1 rounded-full text-sm">
            {totalAgents} agents
          </span>
        </div>

        {/* Categories */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {Object.keys(creativeAgents).map(cat => (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat); setSelectedAgent(null); }}
              className={`px-4 py-2 rounded-lg transition ${
                selectedCategory === cat ? 'bg-purple-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {cat} ({creativeAgents[cat].length})
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* Agents Grid */}
          <div className="col-span-2 grid grid-cols-2 gap-3">
            {creativeAgents[selectedCategory]?.map(agent => (
              <div
                key={agent.id}
                onClick={() => setSelectedAgent(agent)}
                className={`bg-gray-800 rounded-lg p-4 cursor-pointer transition border-2 ${
                  selectedAgent?.id === agent.id ? 'border-purple-500' : 'border-transparent hover:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{agent.icon}</span>
                  <div>
                    <h3 className="font-bold">{agent.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      agent.role === 'L2' ? 'bg-purple-600' : 'bg-blue-600'
                    }`}>
                      {agent.role}
                    </span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mb-2">{agent.desc}</p>
                <div className="flex gap-1 flex-wrap">
                  {agent.tools.slice(0, 3).map(tool => (
                    <span key={tool} className="text-xs bg-gray-700 px-2 py-1 rounded">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Agent Details */}
          <div className="bg-gray-800 rounded-lg p-4">
            {selectedAgent ? (
              <>
                <div className="text-center mb-4 pb-4 border-b border-gray-700">
                  <span className="text-5xl block mb-2">{selectedAgent.icon}</span>
                  <h2 className="text-xl font-bold">{selectedAgent.name}</h2>
                  <span className={`text-sm px-3 py-1 rounded ${
                    selectedAgent.role === 'L2' ? 'bg-purple-600' : 'bg-blue-600'
                  }`}>
                    Niveau {selectedAgent.role}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm text-gray-400 mb-1">Description</h3>
                    <p>{selectedAgent.desc}</p>
                  </div>

                  {selectedAgent.speciality && (
                    <div>
                      <h3 className="text-sm text-gray-400 mb-1">Spécialité</h3>
                      <span className="bg-yellow-600 px-3 py-1 rounded">{selectedAgent.speciality}</span>
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm text-gray-400 mb-2">Outils</h3>
                    <div className="space-y-1">
                      {selectedAgent.tools.map(tool => (
                        <div key={tool} className="bg-gray-700 px-3 py-2 rounded text-sm">
                          🔧 {tool}
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedAgent.delegatesTo && (
                    <div>
                      <h3 className="text-sm text-gray-400 mb-2">Délègue à</h3>
                      <div className="space-y-1">
                        {selectedAgent.delegatesTo.map(sub => (
                          <div key={sub} className="bg-blue-900 px-3 py-2 rounded text-sm">
                            👤 {sub}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                ← Sélectionne un agent
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
