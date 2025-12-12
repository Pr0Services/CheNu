-- ============================================================================
-- CHE·NU - MIGRATION: IA Labs & Scholars
-- Version: 1.0
-- Description: Tables pour les modules IA Labs et Scholars
-- ============================================================================

-- ============================================================================
-- IA LABS
-- ============================================================================

-- Templates de prompts
CREATE TABLE IF NOT EXISTS prompt_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    name VARCHAR(200) NOT NULL,
    description TEXT,
    system_prompt TEXT,
    user_prompt TEXT NOT NULL,
    variables TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    
    -- Statistiques
    use_count INTEGER DEFAULT 0,
    avg_rating FLOAT,
    
    -- Métadonnées
    is_public BOOLEAN DEFAULT false,
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_prompt_templates_owner ON prompt_templates(owner_id);
CREATE INDEX idx_prompt_templates_tags ON prompt_templates USING GIN(tags);

-- Expérimentations IA
CREATE TABLE IF NOT EXISTS ia_experiments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    name VARCHAR(200) NOT NULL,
    description TEXT,
    
    -- Prompts
    prompt_template_id UUID REFERENCES prompt_templates(id),
    system_prompt TEXT,
    user_prompt TEXT NOT NULL,
    variables JSONB DEFAULT '{}',
    
    -- Configuration
    llm_configs JSONB NOT NULL,  -- Liste des configs LLM à tester
    iterations INTEGER DEFAULT 1,
    
    -- État
    status VARCHAR(20) DEFAULT 'draft',
    results JSONB,
    
    -- Métadonnées
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_experiment_status CHECK (status IN ('draft', 'running', 'completed', 'failed', 'cancelled'))
);

CREATE INDEX idx_ia_experiments_owner ON ia_experiments(owner_id);
CREATE INDEX idx_ia_experiments_status ON ia_experiments(status);

-- Historique des appels LLM
CREATE TABLE IF NOT EXISTS llm_call_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    experiment_id UUID REFERENCES ia_experiments(id) ON DELETE SET NULL,
    
    provider VARCHAR(50) NOT NULL,
    model VARCHAR(100) NOT NULL,
    
    -- Input/Output
    system_prompt TEXT,
    user_prompt TEXT NOT NULL,
    response TEXT,
    
    -- Métriques
    tokens_input INTEGER,
    tokens_output INTEGER,
    latency_ms INTEGER,
    cost_estimate FLOAT,
    
    -- Métadonnées
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_llm_history_owner ON llm_call_history(owner_id);
CREATE INDEX idx_llm_history_model ON llm_call_history(model);

-- ============================================================================
-- SCHOLARS
-- ============================================================================

-- Cours
CREATE TABLE IF NOT EXISTS scholar_courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    title VARCHAR(300) NOT NULL,
    description TEXT,
    source TEXT,                        -- URL du cours
    provider VARCHAR(100),              -- Coursera, Udemy, etc.
    
    duration_hours FLOAT,
    topics TEXT[] DEFAULT '{}',
    difficulty VARCHAR(20) DEFAULT 'intermediate',
    
    -- Progression
    status VARCHAR(20) DEFAULT 'not_started',
    progress_percent FLOAT DEFAULT 0,
    notes TEXT,
    
    -- Dates
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_course_status CHECK (status IN ('not_started', 'in_progress', 'completed', 'paused')),
    CONSTRAINT valid_difficulty CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'expert'))
);

CREATE INDEX idx_scholar_courses_owner ON scholar_courses(owner_id);
CREATE INDEX idx_scholar_courses_status ON scholar_courses(status);
CREATE INDEX idx_scholar_courses_topics ON scholar_courses USING GIN(topics);

-- Bibliothèque
CREATE TABLE IF NOT EXISTS scholar_library (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    title VARCHAR(500) NOT NULL,
    content_type VARCHAR(30) NOT NULL,  -- video, article, book, paper, podcast, course
    authors TEXT[] DEFAULT '{}',
    
    source_url TEXT,
    publication_date DATE,
    
    abstract TEXT,
    tags TEXT[] DEFAULT '{}',
    notes TEXT,
    
    -- Lecture
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    rating INTEGER,                     -- 1-5
    
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_content_type CHECK (content_type IN ('video', 'article', 'book', 'paper', 'podcast', 'course'))
);

CREATE INDEX idx_scholar_library_owner ON scholar_library(owner_id);
CREATE INDEX idx_scholar_library_type ON scholar_library(content_type);
CREATE INDEX idx_scholar_library_tags ON scholar_library USING GIN(tags);

-- Annotations
CREATE TABLE IF NOT EXISTS scholar_annotations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    library_item_id UUID NOT NULL REFERENCES scholar_library(id) ON DELETE CASCADE,
    
    highlight TEXT NOT NULL,
    note TEXT,
    page_number INTEGER,
    position JSONB,                     -- Pour les positions dans les documents
    
    color VARCHAR(7) DEFAULT '#FFEB3B',
    
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_scholar_annotations_item ON scholar_annotations(library_item_id);
CREATE INDEX idx_scholar_annotations_owner ON scholar_annotations(owner_id);

-- Projets de recherche
CREATE TABLE IF NOT EXISTS scholar_research (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    title VARCHAR(300) NOT NULL,
    description TEXT,
    hypothesis TEXT,
    methodology TEXT,
    
    keywords TEXT[] DEFAULT '{}',
    collaborators TEXT[] DEFAULT '{}',  -- UUIDs des collaborateurs
    
    status VARCHAR(20) DEFAULT 'planning',
    deadline TIMESTAMP WITH TIME ZONE,
    
    -- Documents liés
    documents JSONB DEFAULT '[]',       -- IDs des documents liés
    
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_research_status CHECK (status IN ('planning', 'collecting', 'analyzing', 'writing', 'review', 'published'))
);

CREATE INDEX idx_scholar_research_owner ON scholar_research(owner_id);
CREATE INDEX idx_scholar_research_status ON scholar_research(status);
CREATE INDEX idx_scholar_research_keywords ON scholar_research USING GIN(keywords);

-- Decks de flashcards
CREATE TABLE IF NOT EXISTS scholar_flashcard_decks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    name VARCHAR(200) NOT NULL,
    description TEXT,
    tags TEXT[] DEFAULT '{}',
    
    course_id UUID REFERENCES scholar_courses(id) ON DELETE SET NULL,
    
    card_count INTEGER DEFAULT 0,
    
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_flashcard_decks_owner ON scholar_flashcard_decks(owner_id);

-- Flashcards
CREATE TABLE IF NOT EXISTS scholar_flashcards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    deck_id UUID REFERENCES scholar_flashcard_decks(id) ON DELETE CASCADE,
    
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    difficulty INTEGER DEFAULT 3,       -- 1-5
    
    -- Spaced Repetition (SM-2 algorithm)
    review_count INTEGER DEFAULT 0,
    last_reviewed TIMESTAMP WITH TIME ZONE,
    next_review TIMESTAMP WITH TIME ZONE,
    interval_days INTEGER DEFAULT 1,
    easiness_factor FLOAT DEFAULT 2.5,
    
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_difficulty CHECK (difficulty >= 1 AND difficulty <= 5)
);

CREATE INDEX idx_flashcards_deck ON scholar_flashcards(deck_id);
CREATE INDEX idx_flashcards_owner ON scholar_flashcards(owner_id);
CREATE INDEX idx_flashcards_next_review ON scholar_flashcards(next_review);

-- Sessions d'étude
CREATE TABLE IF NOT EXISTS scholar_study_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    course_id UUID REFERENCES scholar_courses(id) ON DELETE SET NULL,
    
    topic VARCHAR(300),
    duration_minutes INTEGER NOT NULL,
    notes TEXT,
    progress_percent FLOAT DEFAULT 0,
    
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_study_sessions_owner ON scholar_study_sessions(owner_id);
CREATE INDEX idx_study_sessions_course ON scholar_study_sessions(course_id);
CREATE INDEX idx_study_sessions_date ON scholar_study_sessions(created_at DESC);

-- Stats globales d'étude
CREATE TABLE IF NOT EXISTS scholar_stats (
    owner_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    
    total_study_minutes INTEGER DEFAULT 0,
    total_cards_reviewed INTEGER DEFAULT 0,
    current_streak_days INTEGER DEFAULT 0,
    longest_streak_days INTEGER DEFAULT 0,
    
    last_study_date DATE,
    
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Certifications et badges
CREATE TABLE IF NOT EXISTS scholar_certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    title VARCHAR(300) NOT NULL,
    issuer VARCHAR(200),
    course_id UUID REFERENCES scholar_courses(id),
    
    credential_id VARCHAR(200),
    credential_url TEXT,
    
    issued_at DATE,
    expires_at DATE,
    
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_certifications_owner ON scholar_certifications(owner_id);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Mise à jour timestamp pour prompt_templates
CREATE TRIGGER trigger_update_prompt_template_timestamp
    BEFORE UPDATE ON prompt_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_dynamic_module_timestamp();

-- Mise à jour timestamp pour scholar_courses
CREATE TRIGGER trigger_update_scholar_course_timestamp
    BEFORE UPDATE ON scholar_courses
    FOR EACH ROW
    EXECUTE FUNCTION update_dynamic_module_timestamp();

-- Compteur de cartes dans les decks
CREATE OR REPLACE FUNCTION update_deck_card_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE scholar_flashcard_decks SET card_count = card_count + 1 WHERE id = NEW.deck_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE scholar_flashcard_decks SET card_count = card_count - 1 WHERE id = OLD.deck_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_deck_card_count
    AFTER INSERT OR DELETE ON scholar_flashcards
    FOR EACH ROW
    EXECUTE FUNCTION update_deck_card_count();

COMMENT ON TABLE prompt_templates IS 'Templates de prompts pour IA Labs';
COMMENT ON TABLE ia_experiments IS 'Expérimentations et benchmarks LLM';
COMMENT ON TABLE scholar_courses IS 'Cours et parcours d''apprentissage';
COMMENT ON TABLE scholar_library IS 'Bibliothèque personnelle';
COMMENT ON TABLE scholar_flashcards IS 'Cartes mémoire avec répétition espacée';
COMMENT ON TABLE scholar_research IS 'Projets de recherche';
