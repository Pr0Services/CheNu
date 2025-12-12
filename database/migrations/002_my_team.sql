-- ============================================================================
-- CHE·NU - MIGRATION: My Team (Agent Hierarchy)
-- Version: 1.0
-- Description: Tables pour la gestion de l'équipe d'agents IA
-- ============================================================================

-- Table principale des agents
CREATE TABLE IF NOT EXISTS agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Identité
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL,          -- master, director, specialist, assistant, worker
    department VARCHAR(50) NOT NULL,     -- finance, hr, marketing, etc.
    description TEXT,
    avatar_url TEXT,
    
    -- Configuration IA
    personality TEXT,                    -- Prompt de personnalité
    capabilities JSONB DEFAULT '[]',     -- Liste des capacités
    llm_model VARCHAR(100) DEFAULT 'claude-3-sonnet',
    temperature FLOAT DEFAULT 0.7,
    
    -- Hiérarchie
    parent_agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
    scopes TEXT[] DEFAULT '{}',          -- Espaces assignés
    
    -- État
    status VARCHAR(20) DEFAULT 'idle',   -- active, idle, busy, offline, learning
    current_task UUID,
    
    -- Métriques
    tasks_completed INTEGER DEFAULT 0,
    performance_score FLOAT DEFAULT 0.8,
    total_tokens_used BIGINT DEFAULT 0,
    
    -- Propriétaire
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active_at TIMESTAMP WITH TIME ZONE,
    
    -- Contraintes
    CONSTRAINT valid_role CHECK (role IN ('master', 'director', 'specialist', 'assistant', 'worker')),
    CONSTRAINT valid_status CHECK (status IN ('active', 'idle', 'busy', 'offline', 'learning')),
    CONSTRAINT valid_department CHECK (department IN (
        'general', 'finance', 'hr', 'marketing', 'sales', 
        'operations', 'it', 'creative', 'legal', 'research'
    ))
);

-- Index pour les recherches
CREATE INDEX idx_agents_owner ON agents(owner_id);
CREATE INDEX idx_agents_parent ON agents(parent_agent_id);
CREATE INDEX idx_agents_department ON agents(department);
CREATE INDEX idx_agents_status ON agents(status);
CREATE INDEX idx_agents_scopes ON agents USING GIN(scopes);

-- Table des tâches assignées aux agents
CREATE TABLE IF NOT EXISTS agent_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    
    -- Détails de la tâche
    task_type VARCHAR(50) NOT NULL,      -- 'analyze', 'generate', 'search', 'process', etc.
    task_data JSONB NOT NULL,
    
    -- Priorité et deadline
    priority INTEGER DEFAULT 3,          -- 1-5 (5 = urgent)
    deadline TIMESTAMP WITH TIME ZONE,
    
    -- État
    status VARCHAR(20) DEFAULT 'pending', -- pending, in_progress, completed, failed, cancelled
    progress INTEGER DEFAULT 0,          -- 0-100
    
    -- Résultat
    result JSONB,
    error_message TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT valid_priority CHECK (priority >= 1 AND priority <= 5),
    CONSTRAINT valid_task_status CHECK (status IN ('pending', 'in_progress', 'completed', 'failed', 'cancelled'))
);

CREATE INDEX idx_agent_tasks_agent ON agent_tasks(agent_id);
CREATE INDEX idx_agent_tasks_status ON agent_tasks(status);
CREATE INDEX idx_agent_tasks_priority ON agent_tasks(priority DESC, created_at);

-- Table des messages inter-agents
CREATE TABLE IF NOT EXISTS agent_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    from_agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    to_agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    
    -- Contenu
    message_type VARCHAR(30) NOT NULL,   -- task, report, question, update, alert
    content JSONB NOT NULL,
    
    -- État
    requires_response BOOLEAN DEFAULT false,
    response_id UUID REFERENCES agent_messages(id),
    read_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_message_type CHECK (message_type IN ('task', 'report', 'question', 'update', 'alert'))
);

CREATE INDEX idx_agent_messages_to ON agent_messages(to_agent_id, read_at);
CREATE INDEX idx_agent_messages_from ON agent_messages(from_agent_id);
CREATE INDEX idx_agent_messages_type ON agent_messages(message_type);

-- Table des logs d'activité des agents
CREATE TABLE IF NOT EXISTS agent_activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    
    activity_type VARCHAR(50) NOT NULL,  -- 'task_start', 'task_complete', 'message', 'error', etc.
    activity_data JSONB DEFAULT '{}',
    
    tokens_used INTEGER DEFAULT 0,
    duration_ms INTEGER,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_agent_activity_agent ON agent_activity_logs(agent_id);
CREATE INDEX idx_agent_activity_type ON agent_activity_logs(activity_type);
CREATE INDEX idx_agent_activity_time ON agent_activity_logs(created_at DESC);

-- Table des templates d'agents prédéfinis
CREATE TABLE IF NOT EXISTS agent_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL,
    department VARCHAR(50) NOT NULL,
    description TEXT,
    
    personality TEXT,
    capabilities JSONB DEFAULT '[]',
    
    avatar_url TEXT,
    is_premium BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insérer les templates d'agents par défaut
INSERT INTO agent_templates (name, role, department, description, personality, capabilities, avatar_url) VALUES
-- Nova - Agent Master
('Nova', 'master', 'general', 
 'Votre assistant personnel principal. Nova coordonne tous les autres agents et vous assiste au quotidien.',
 'Tu es Nova, l''assistant principal de CHE·NU. Tu es bienveillant, efficace et proactif. Tu coordonnes les autres agents et anticipes les besoins de l''utilisateur.',
 '[{"key": "coordination", "label": "Coordination d''équipe", "proficiency": 1.0},
   {"key": "planning", "label": "Planification", "proficiency": 0.95},
   {"key": "communication", "label": "Communication", "proficiency": 1.0}]',
 '/avatars/nova.png'),

-- Directeurs
('Marcus', 'director', 'finance',
 'Directeur financier. Gère la comptabilité, les budgets et les analyses financières.',
 'Tu es Marcus, le directeur financier. Tu es précis, analytique et prudent. Tu fournis des conseils financiers basés sur les données.',
 '[{"key": "accounting", "label": "Comptabilité", "proficiency": 0.95},
   {"key": "budgeting", "label": "Gestion budgétaire", "proficiency": 0.9},
   {"key": "forecasting", "label": "Prévisions", "proficiency": 0.85}]',
 '/avatars/marcus.png'),

('Sophie', 'director', 'hr',
 'Directrice des ressources humaines. Gère le recrutement, la formation et le bien-être.',
 'Tu es Sophie, la directrice RH. Tu es empathique, organisée et attentive au bien-être. Tu aides à gérer les équipes et développer les talents.',
 '[{"key": "recruitment", "label": "Recrutement", "proficiency": 0.9},
   {"key": "training", "label": "Formation", "proficiency": 0.85},
   {"key": "wellbeing", "label": "Bien-être", "proficiency": 0.95}]',
 '/avatars/sophie.png'),

('Alex', 'director', 'marketing',
 'Directeur marketing. Gère les campagnes, l''image de marque et la stratégie digitale.',
 'Tu es Alex, le directeur marketing. Tu es créatif, tendance et orienté résultats. Tu conçois des stratégies marketing percutantes.',
 '[{"key": "branding", "label": "Image de marque", "proficiency": 0.9},
   {"key": "campaigns", "label": "Campagnes", "proficiency": 0.9},
   {"key": "analytics", "label": "Analytics marketing", "proficiency": 0.85}]',
 '/avatars/alex.png'),

('Jordan', 'director', 'sales',
 'Directeur commercial. Gère les ventes, les relations clients et les négociations.',
 'Tu es Jordan, le directeur commercial. Tu es persuasif, relationnel et orienté objectifs. Tu développes les ventes et fidélises les clients.',
 '[{"key": "negotiation", "label": "Négociation", "proficiency": 0.95},
   {"key": "crm", "label": "Gestion relation client", "proficiency": 0.9},
   {"key": "pipeline", "label": "Pipeline commercial", "proficiency": 0.9}]',
 '/avatars/jordan.png'),

('Morgan', 'director', 'operations',
 'Directeur des opérations. Gère la logistique, les processus et l''efficacité.',
 'Tu es Morgan, le directeur des opérations. Tu es méthodique, efficace et orienté processus. Tu optimises les flux et réduis les coûts.',
 '[{"key": "logistics", "label": "Logistique", "proficiency": 0.9},
   {"key": "process", "label": "Optimisation processus", "proficiency": 0.95},
   {"key": "quality", "label": "Contrôle qualité", "proficiency": 0.85}]',
 '/avatars/morgan.png'),

('Sam', 'director', 'it',
 'Directeur IT. Gère l''infrastructure, la sécurité et les projets technologiques.',
 'Tu es Sam, le directeur IT. Tu es technique, sécuritaire et innovant. Tu maintiens les systèmes et guides les choix technologiques.',
 '[{"key": "security", "label": "Cybersécurité", "proficiency": 0.95},
   {"key": "infrastructure", "label": "Infrastructure", "proficiency": 0.9},
   {"key": "development", "label": "Développement", "proficiency": 0.85}]',
 '/avatars/sam.png'),

('Luna', 'director', 'creative',
 'Directrice créative. Gère le design, le contenu et l''identité visuelle.',
 'Tu es Luna, la directrice créative. Tu es artistique, inspirée et visionnaire. Tu crées des contenus et designs mémorables.',
 '[{"key": "design", "label": "Design graphique", "proficiency": 0.95},
   {"key": "content", "label": "Création de contenu", "proficiency": 0.9},
   {"key": "video", "label": "Production vidéo", "proficiency": 0.85}]',
 '/avatars/luna.png'),

-- Spécialistes
('Emma', 'specialist', 'research',
 'Chercheuse. Effectue des recherches approfondies et analyses de données.',
 'Tu es Emma, chercheuse spécialisée. Tu es curieuse, rigoureuse et méthodique. Tu fournis des analyses détaillées et sourcées.',
 '[{"key": "research", "label": "Recherche", "proficiency": 0.95},
   {"key": "analysis", "label": "Analyse de données", "proficiency": 0.9},
   {"key": "reports", "label": "Rédaction de rapports", "proficiency": 0.85}]',
 '/avatars/emma.png'),

('Leo', 'specialist', 'legal',
 'Conseiller juridique. Aide sur les questions légales et la conformité.',
 'Tu es Leo, conseiller juridique. Tu es précis, prudent et à jour sur la législation. Tu fournis des conseils légaux généraux (pas d''avis juridique formel).',
 '[{"key": "contracts", "label": "Contrats", "proficiency": 0.9},
   {"key": "compliance", "label": "Conformité", "proficiency": 0.95},
   {"key": "legal_research", "label": "Recherche juridique", "proficiency": 0.85}]',
 '/avatars/leo.png')

ON CONFLICT DO NOTHING;

-- Vue pour l'arbre hiérarchique
CREATE OR REPLACE VIEW agent_hierarchy AS
WITH RECURSIVE agent_tree AS (
    -- Agents racines (sans parent ou masters)
    SELECT 
        id, name, role, department, parent_agent_id, owner_id,
        0 as depth,
        ARRAY[id] as path,
        name as full_path
    FROM agents
    WHERE parent_agent_id IS NULL OR role = 'master'
    
    UNION ALL
    
    -- Agents enfants
    SELECT 
        a.id, a.name, a.role, a.department, a.parent_agent_id, a.owner_id,
        t.depth + 1,
        t.path || a.id,
        t.full_path || ' > ' || a.name
    FROM agents a
    JOIN agent_tree t ON a.parent_agent_id = t.id
    WHERE NOT a.id = ANY(t.path)  -- Éviter les cycles
)
SELECT * FROM agent_tree;

-- Fonction pour mettre à jour les timestamps
CREATE OR REPLACE FUNCTION update_agent_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_agent_timestamp
    BEFORE UPDATE ON agents
    FOR EACH ROW
    EXECUTE FUNCTION update_agent_timestamp();

-- Fonction pour recalculer le score de performance
CREATE OR REPLACE FUNCTION recalculate_agent_performance(p_agent_id UUID)
RETURNS FLOAT AS $$
DECLARE
    v_score FLOAT;
BEGIN
    SELECT 
        CASE 
            WHEN COUNT(*) = 0 THEN 0.8
            ELSE LEAST(1.0, 0.5 + (
                COUNT(*) FILTER (WHERE status = 'completed')::FLOAT / 
                NULLIF(COUNT(*), 0) * 0.5
            ))
        END
    INTO v_score
    FROM agent_tasks
    WHERE agent_id = p_agent_id
    AND created_at > NOW() - INTERVAL '30 days';
    
    UPDATE agents SET performance_score = v_score WHERE id = p_agent_id;
    
    RETURN v_score;
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE agents IS 'Équipe d''agents IA de l''utilisateur';
COMMENT ON TABLE agent_tasks IS 'Tâches assignées aux agents';
COMMENT ON TABLE agent_messages IS 'Communication entre agents';
COMMENT ON TABLE agent_templates IS 'Templates d''agents prédéfinis';
