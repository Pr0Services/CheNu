-- ============================================================================
-- CHE·NU - MIGRATION: Dynamic Modules System
-- Version: 1.0
-- Description: Permet aux agents IA de créer des modules personnalisés
--              sans modifier les modules noyau
-- ============================================================================

-- Table principale des modules dynamiques
CREATE TABLE IF NOT EXISTS dynamic_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Localisation dans l'architecture CHE·NU
    scope VARCHAR(50) NOT NULL,           -- Espace CHE·NU (personal, enterprise, etc.)
    category VARCHAR(100) NOT NULL,       -- Catégorie dans l'espace
    
    -- Identification du module
    key VARCHAR(100) NOT NULL,            -- Nom machine (snake_case, unique par scope)
    label VARCHAR(200) NOT NULL,          -- Nom humain affiché
    description TEXT,                     -- Description du module
    icon VARCHAR(50) DEFAULT 'puzzle',    -- Icône Lucide React
    color VARCHAR(7) DEFAULT '#3EB4A2',   -- Couleur hex (cenote-turquoise par défaut)
    
    -- Métadonnées de création
    created_by_agent VARCHAR(100),        -- ID de l'agent IA créateur
    created_by_user UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Configuration du module
    config JSONB DEFAULT '{}',            -- Configuration flexible
    actions JSONB DEFAULT '[]',           -- Liste des actions disponibles
    permissions JSONB DEFAULT '{}',       -- Permissions requises
    
    -- État
    is_enabled BOOLEAN DEFAULT true,
    is_approved BOOLEAN DEFAULT false,    -- Nécessite approbation user
    approval_mode VARCHAR(20) DEFAULT 'manual', -- 'manual', 'auto', 'admin_only'
    
    -- Statistiques
    usage_count INTEGER DEFAULT 0,
    last_used_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Contraintes
    CONSTRAINT unique_module_key_per_scope UNIQUE (scope, key),
    CONSTRAINT valid_scope CHECK (scope IN (
        'personal', 'social', 'scholar', 'home', 'enterprise',
        'projects', 'creative_studio', 'government', 'immobilier', 'associations'
    )),
    CONSTRAINT valid_approval_mode CHECK (approval_mode IN ('manual', 'auto', 'admin_only'))
);

-- Index pour les recherches fréquentes
CREATE INDEX idx_dynamic_modules_scope ON dynamic_modules(scope);
CREATE INDEX idx_dynamic_modules_scope_category ON dynamic_modules(scope, category);
CREATE INDEX idx_dynamic_modules_enabled ON dynamic_modules(is_enabled, is_approved);
CREATE INDEX idx_dynamic_modules_created_by_user ON dynamic_modules(created_by_user);
CREATE INDEX idx_dynamic_modules_created_by_agent ON dynamic_modules(created_by_agent);

-- Table des propositions de modules (avant approbation)
CREATE TABLE IF NOT EXISTS dynamic_module_proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Données du module proposé
    scope VARCHAR(50) NOT NULL,
    category VARCHAR(100) NOT NULL,
    key VARCHAR(100) NOT NULL,
    label VARCHAR(200) NOT NULL,
    description TEXT,
    icon VARCHAR(50) DEFAULT 'puzzle',
    color VARCHAR(7) DEFAULT '#3EB4A2',
    
    -- Qui propose
    proposed_by_agent VARCHAR(100) NOT NULL,
    proposed_for_user UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Contexte de la proposition
    reason TEXT,                          -- Pourquoi l'IA propose ce module
    conversation_context JSONB,           -- Contexte de la conversation
    
    -- État de la proposition
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'expired'
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES users(id),
    rejection_reason TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
    
    CONSTRAINT valid_proposal_status CHECK (status IN ('pending', 'approved', 'rejected', 'expired'))
);

CREATE INDEX idx_proposals_user_status ON dynamic_module_proposals(proposed_for_user, status);
CREATE INDEX idx_proposals_expires ON dynamic_module_proposals(expires_at) WHERE status = 'pending';

-- Table de log des actions sur les modules dynamiques
CREATE TABLE IF NOT EXISTS dynamic_module_actions_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID REFERENCES dynamic_modules(id) ON DELETE CASCADE,
    
    action_type VARCHAR(50) NOT NULL,     -- 'created', 'enabled', 'disabled', 'used', 'modified'
    action_data JSONB DEFAULT '{}',
    
    performed_by_user UUID REFERENCES users(id),
    performed_by_agent VARCHAR(100),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_module_actions_module ON dynamic_module_actions_log(module_id);
CREATE INDEX idx_module_actions_type ON dynamic_module_actions_log(action_type);

-- Table de configuration des scopes (quelles catégories sont valides par scope)
CREATE TABLE IF NOT EXISTS scope_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scope VARCHAR(50) NOT NULL,
    category VARCHAR(100) NOT NULL,
    label VARCHAR(200) NOT NULL,
    description TEXT,
    is_core BOOLEAN DEFAULT false,        -- Catégorie noyau (non modifiable)
    sort_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT unique_scope_category UNIQUE (scope, category)
);

-- Insérer les catégories par défaut pour chaque scope
INSERT INTO scope_categories (scope, category, label, is_core, sort_order) VALUES
-- Personal
('personal', 'assistant', 'Assistant Personnel', true, 1),
('personal', 'notes', 'Notes & Documents', true, 2),
('personal', 'calendar', 'Calendrier', true, 3),
('personal', 'tasks', 'Tâches', true, 4),
('personal', 'health', 'Santé & Bien-être', true, 5),
('personal', 'finance', 'Finances Personnelles', true, 6),
('personal', 'custom', 'Personnalisé', false, 99),

-- Social
('social', 'network', 'Réseau Social', true, 1),
('social', 'messaging', 'Messagerie', true, 2),
('social', 'forum', 'Forum', true, 3),
('social', 'events', 'Événements', true, 4),
('social', 'custom', 'Personnalisé', false, 99),

-- Scholar
('scholar', 'courses', 'Cours', true, 1),
('scholar', 'research', 'Recherche', true, 2),
('scholar', 'library', 'Bibliothèque', true, 3),
('scholar', 'certifications', 'Certifications', true, 4),
('scholar', 'custom', 'Personnalisé', false, 99),

-- Home
('home', 'inventory', 'Inventaire', true, 1),
('home', 'maintenance', 'Entretien', true, 2),
('home', 'smart_home', 'Maison Connectée', true, 3),
('home', 'budget', 'Budget Maison', true, 4),
('home', 'custom', 'Personnalisé', false, 99),

-- Enterprise
('enterprise', 'dashboard', 'Tableau de Bord', true, 1),
('enterprise', 'hr', 'Ressources Humaines', true, 2),
('enterprise', 'finance', 'Finance', true, 3),
('enterprise', 'operations', 'Opérations', true, 4),
('enterprise', 'sales', 'Ventes & CRM', true, 5),
('enterprise', 'custom', 'Personnalisé', false, 99),

-- Projects
('projects', 'management', 'Gestion de Projets', true, 1),
('projects', 'tasks', 'Tâches & Sprints', true, 2),
('projects', 'documents', 'Documentation', true, 3),
('projects', 'collaboration', 'Collaboration', true, 4),
('projects', 'custom', 'Personnalisé', false, 99),

-- Creative Studio
('creative_studio', 'design', 'Design & Graphisme', true, 1),
('creative_studio', 'video', 'Vidéo & Animation', true, 2),
('creative_studio', 'audio', 'Audio & Musique', true, 3),
('creative_studio', 'writing', 'Écriture & Contenu', true, 4),
('creative_studio', 'ai_tools', 'Outils IA', true, 5),
('creative_studio', 'custom', 'Personnalisé', false, 99),

-- Government
('government', 'documents', 'Documents Officiels', true, 1),
('government', 'taxes', 'Impôts & Taxes', true, 2),
('government', 'permits', 'Permis & Licences', true, 3),
('government', 'voting', 'Vote & Citoyenneté', true, 4),
('government', 'custom', 'Personnalisé', false, 99),

-- Immobilier
('immobilier', 'properties', 'Propriétés', true, 1),
('immobilier', 'transactions', 'Transactions', true, 2),
('immobilier', 'rentals', 'Locations', true, 3),
('immobilier', 'construction', 'Construction', true, 4),
('immobilier', 'custom', 'Personnalisé', false, 99),

-- Associations
('associations', 'members', 'Membres', true, 1),
('associations', 'events', 'Événements', true, 2),
('associations', 'treasury', 'Trésorerie', true, 3),
('associations', 'communication', 'Communication', true, 4),
('associations', 'custom', 'Personnalisé', false, 99)

ON CONFLICT (scope, category) DO NOTHING;

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_dynamic_module_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_dynamic_module_timestamp
    BEFORE UPDATE ON dynamic_modules
    FOR EACH ROW
    EXECUTE FUNCTION update_dynamic_module_timestamp();

-- Fonction pour expirer les propositions anciennes
CREATE OR REPLACE FUNCTION expire_old_proposals()
RETURNS void AS $$
BEGIN
    UPDATE dynamic_module_proposals
    SET status = 'expired'
    WHERE status = 'pending' AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Vue pour les modules actifs avec leurs catégories
CREATE OR REPLACE VIEW active_dynamic_modules AS
SELECT 
    dm.*,
    sc.label as category_label,
    sc.is_core as is_core_category
FROM dynamic_modules dm
JOIN scope_categories sc ON dm.scope = sc.scope AND dm.category = sc.category
WHERE dm.is_enabled = true AND dm.is_approved = true;

-- Vue pour les propositions en attente par utilisateur
CREATE OR REPLACE VIEW pending_proposals_by_user AS
SELECT 
    proposed_for_user,
    COUNT(*) as pending_count,
    array_agg(json_build_object(
        'id', id,
        'scope', scope,
        'label', label,
        'reason', reason,
        'expires_at', expires_at
    )) as proposals
FROM dynamic_module_proposals
WHERE status = 'pending' AND expires_at > NOW()
GROUP BY proposed_for_user;

COMMENT ON TABLE dynamic_modules IS 'Modules créés dynamiquement par les agents IA';
COMMENT ON TABLE dynamic_module_proposals IS 'Propositions de modules en attente d''approbation';
COMMENT ON TABLE scope_categories IS 'Catégories valides par espace CHE·NU';
