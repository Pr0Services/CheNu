-- ============================================================
-- CHE·NU DATABASE — COMPLETE SCHEMA v2.0
-- PostgreSQL Production-Ready
-- ============================================================
-- VERSION: 2.0-canonical
-- DATE: 2025-01
-- MODE: PRODUCTION
-- ============================================================

-- ============================================================
-- EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- For text search

-- ============================================================
-- ENUMS
-- ============================================================

-- Sphere codes
CREATE TYPE sphere_code AS ENUM (
    'PERSONAL', 'BUSINESS', 'SCHOLAR', 'CREATIVE', 'SOCIAL',
    'INSTITUTIONS', 'METHODOLOGY', 'XR', 'ENTERTAINMENT',
    'AI_LAB', 'MY_TEAM'
);

-- Item types
CREATE TYPE item_type AS ENUM (
    'task', 'note', 'document', 'project', 'contact',
    'event', 'goal', 'metric', 'habit', 'resource'
);

-- Item status
CREATE TYPE item_status AS ENUM (
    'draft', 'active', 'in_progress', 'completed',
    'archived', 'cancelled', 'blocked'
);

-- Memory layers
CREATE TYPE memory_layer AS ENUM (
    'session', 'operational', 'long_term', 'archive'
);

-- Thread types
CREATE TYPE thread_type AS ENUM (
    'factual', 'contextual', 'intent_safe'
);

-- Agent levels
CREATE TYPE agent_level AS ENUM (
    'L0', 'L1', 'L2', 'L3'
);

-- Decision status
CREATE TYPE decision_status AS ENUM (
    'pending', 'approved', 'rejected', 'executed'
);

-- XR room types
CREATE TYPE xr_room_type AS ENUM (
    'meeting', 'workshop', 'meditation', 'study',
    'creative', 'social', 'presentation'
);

-- XR themes
CREATE TYPE xr_theme AS ENUM (
    'ancient', 'giant_tree', 'futuristic', 'cosmic',
    'nature', 'minimalist', 'cozy'
);

-- ============================================================
-- CORE TABLES
-- ============================================================

-- ------------------------------------------------------------
-- USERS
-- ------------------------------------------------------------
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    name VARCHAR(255),
    avatar_url TEXT,
    settings JSONB DEFAULT '{}'::JSONB,
    preferences JSONB DEFAULT '{}'::JSONB,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    last_active_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_last_active ON users(last_active_at);

-- ------------------------------------------------------------
-- SPHERES
-- ------------------------------------------------------------
CREATE TABLE spheres (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    code sphere_code NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(64),
    color VARCHAR(7),  -- Hex color
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    settings JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, code)
);

CREATE INDEX idx_spheres_user ON spheres(user_id);
CREATE INDEX idx_spheres_code ON spheres(code);

-- ------------------------------------------------------------
-- CATEGORIES (Hierarchical)
-- ------------------------------------------------------------
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sphere_id UUID NOT NULL REFERENCES spheres(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(64),
    description TEXT,
    icon VARCHAR(64),
    color VARCHAR(7),
    sort_order INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_categories_sphere ON categories(sphere_id);
CREATE INDEX idx_categories_parent ON categories(parent_id);

-- ------------------------------------------------------------
-- ITEMS (Universal Item Model)
-- ------------------------------------------------------------
CREATE TABLE items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sphere_id UUID NOT NULL REFERENCES spheres(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    type item_type NOT NULL,
    title VARCHAR(500),
    body TEXT,
    status item_status DEFAULT 'draft',
    priority INTEGER DEFAULT 3 CHECK (priority >= 1 AND priority <= 5),
    due_at TIMESTAMP,
    completed_at TIMESTAMP,
    agent_owner_id UUID,  -- FK added after agents table
    assigned_to UUID REFERENCES users(id),
    tags TEXT[] DEFAULT '{}',
    data JSONB DEFAULT '{}'::JSONB,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_items_sphere ON items(sphere_id);
CREATE INDEX idx_items_category ON items(category_id);
CREATE INDEX idx_items_type ON items(type);
CREATE INDEX idx_items_status ON items(status);
CREATE INDEX idx_items_due ON items(due_at);
CREATE INDEX idx_items_tags ON items USING GIN(tags);
CREATE INDEX idx_items_data ON items USING GIN(data);
CREATE INDEX idx_items_search ON items USING GIN(to_tsvector('french', COALESCE(title, '') || ' ' || COALESCE(body, '')));

-- ============================================================
-- AGENT SYSTEM
-- ============================================================

-- ------------------------------------------------------------
-- AGENT TYPES (Canonical Agent Definitions)
-- ------------------------------------------------------------
CREATE TABLE agent_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(128) UNIQUE NOT NULL,  -- e.g., 'personal.organizer'
    name VARCHAR(255) NOT NULL,
    sphere_code sphere_code,
    level agent_level NOT NULL DEFAULT 'L3',
    department VARCHAR(64),
    description TEXT,
    role TEXT,
    goal TEXT,
    backstory TEXT,
    tools TEXT[] DEFAULT '{}',
    constraints TEXT[] DEFAULT '{}',
    trust_config JSONB DEFAULT '{
        "initial_trust": 0.5,
        "max_trust": 1.0,
        "decay_rate": 0.01
    }'::JSONB,
    is_core BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_agent_types_code ON agent_types(code);
CREATE INDEX idx_agent_types_sphere ON agent_types(sphere_code);
CREATE INDEX idx_agent_types_level ON agent_types(level);

-- ------------------------------------------------------------
-- AGENTS (User-Configured Instances)
-- ------------------------------------------------------------
CREATE TABLE agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    agent_type_id UUID NOT NULL REFERENCES agent_types(id),
    name VARCHAR(255),
    config JSONB DEFAULT '{}'::JSONB,
    trust_score DECIMAL(3,2) DEFAULT 0.50 CHECK (trust_score >= 0 AND trust_score <= 1),
    accuracy_score DECIMAL(3,2) DEFAULT 0.50,
    approval_rate DECIMAL(3,2) DEFAULT 0.50,
    consistency_score DECIMAL(3,2) DEFAULT 0.50,
    total_executions INTEGER DEFAULT 0,
    successful_executions INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    last_active_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_agents_user ON agents(user_id);
CREATE INDEX idx_agents_type ON agents(agent_type_id);
CREATE INDEX idx_agents_trust ON agents(trust_score);

-- Add FK for items.agent_owner_id
ALTER TABLE items ADD CONSTRAINT fk_items_agent 
    FOREIGN KEY (agent_owner_id) REFERENCES agents(id) ON DELETE SET NULL;

-- ------------------------------------------------------------
-- AGENT EXECUTIONS (Action Log)
-- ------------------------------------------------------------
CREATE TABLE agent_executions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    action_type VARCHAR(64) NOT NULL,
    input JSONB,
    output JSONB,
    status VARCHAR(32) DEFAULT 'pending',  -- pending, running, success, error, cancelled
    error_message TEXT,
    duration_ms INTEGER,
    tokens_used INTEGER,
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP,
    started_at TIMESTAMP NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP
);

CREATE INDEX idx_agent_exec_agent ON agent_executions(agent_id);
CREATE INDEX idx_agent_exec_status ON agent_executions(status);
CREATE INDEX idx_agent_exec_started ON agent_executions(started_at);

-- ============================================================
-- MEMORY SYSTEM
-- ============================================================

-- ------------------------------------------------------------
-- MEMORIES
-- ------------------------------------------------------------
CREATE TABLE memories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sphere_id UUID REFERENCES spheres(id) ON DELETE SET NULL,
    layer memory_layer NOT NULL DEFAULT 'operational',
    source_item_id UUID REFERENCES items(id) ON DELETE SET NULL,
    source_agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    embedding VECTOR(1536),  -- For pgvector if installed
    importance_score DECIMAL(3,2) DEFAULT 0.50,
    access_count INTEGER DEFAULT 0,
    last_accessed_at TIMESTAMP,
    anchored BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP,
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_memories_user ON memories(user_id);
CREATE INDEX idx_memories_sphere ON memories(sphere_id);
CREATE INDEX idx_memories_layer ON memories(layer);
CREATE INDEX idx_memories_anchored ON memories(anchored);
CREATE INDEX idx_memories_search ON memories USING GIN(to_tsvector('french', content));

-- ------------------------------------------------------------
-- MEMORY LINKS (Connections between memories)
-- ------------------------------------------------------------
CREATE TABLE memory_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_memory_id UUID NOT NULL REFERENCES memories(id) ON DELETE CASCADE,
    target_memory_id UUID NOT NULL REFERENCES memories(id) ON DELETE CASCADE,
    link_type VARCHAR(64) DEFAULT 'related',  -- related, causes, contradicts, supports
    strength DECIMAL(3,2) DEFAULT 0.50,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(source_memory_id, target_memory_id)
);

CREATE INDEX idx_memory_links_source ON memory_links(source_memory_id);
CREATE INDEX idx_memory_links_target ON memory_links(target_memory_id);

-- ============================================================
-- KNOWLEDGE THREADS
-- ============================================================

-- ------------------------------------------------------------
-- KNOWLEDGE THREADS
-- ------------------------------------------------------------
CREATE TABLE knowledge_threads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sphere_id UUID REFERENCES spheres(id) ON DELETE SET NULL,
    code VARCHAR(64),
    name VARCHAR(255) NOT NULL,
    type thread_type NOT NULL DEFAULT 'factual',
    description TEXT,
    config JSONB DEFAULT '{}'::JSONB,
    event_count INTEGER DEFAULT 0,
    last_event_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_threads_user ON knowledge_threads(user_id);
CREATE INDEX idx_threads_sphere ON knowledge_threads(sphere_id);
CREATE INDEX idx_threads_type ON knowledge_threads(type);

-- ------------------------------------------------------------
-- THREAD EVENTS
-- ------------------------------------------------------------
CREATE TABLE thread_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    thread_id UUID NOT NULL REFERENCES knowledge_threads(id) ON DELETE CASCADE,
    event_type VARCHAR(64) NOT NULL,  -- fact_added, link_created, context_changed, decision_made
    ref_item_id UUID REFERENCES items(id) ON DELETE SET NULL,
    ref_memory_id UUID REFERENCES memories(id) ON DELETE SET NULL,
    ref_decision_id UUID,  -- FK added after decisions table
    data JSONB DEFAULT '{}'::JSONB,
    sequence_num INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_thread_events_thread ON thread_events(thread_id);
CREATE INDEX idx_thread_events_type ON thread_events(event_type);
CREATE INDEX idx_thread_events_created ON thread_events(created_at);

-- ============================================================
-- DECISIONS
-- ============================================================

-- ------------------------------------------------------------
-- DECISIONS
-- ------------------------------------------------------------
CREATE TABLE decisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sphere_id UUID REFERENCES spheres(id) ON DELETE SET NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    context JSONB DEFAULT '{}'::JSONB,
    status decision_status DEFAULT 'pending',
    selected_branch_id UUID,  -- FK added after branches table
    decided_at TIMESTAMP,
    decided_by UUID REFERENCES users(id),
    impact_preview JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_decisions_user ON decisions(user_id);
CREATE INDEX idx_decisions_sphere ON decisions(sphere_id);
CREATE INDEX idx_decisions_status ON decisions(status);

-- ------------------------------------------------------------
-- DECISION BRANCHES
-- ------------------------------------------------------------
CREATE TABLE decision_branches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    decision_id UUID NOT NULL REFERENCES decisions(id) ON DELETE CASCADE,
    code VARCHAR(8) NOT NULL,  -- A, B, C, etc.
    title VARCHAR(255),
    description TEXT,
    impact JSONB DEFAULT '{}'::JSONB,
    probability DECIMAL(3,2),
    risk_level INTEGER DEFAULT 2 CHECK (risk_level >= 1 AND risk_level <= 5),
    is_recommended BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_branches_decision ON decision_branches(decision_id);

-- Add FKs
ALTER TABLE decisions ADD CONSTRAINT fk_decisions_branch 
    FOREIGN KEY (selected_branch_id) REFERENCES decision_branches(id) ON DELETE SET NULL;
    
ALTER TABLE thread_events ADD CONSTRAINT fk_thread_events_decision 
    FOREIGN KEY (ref_decision_id) REFERENCES decisions(id) ON DELETE SET NULL;

-- ============================================================
-- XR SYSTEM
-- ============================================================

-- ------------------------------------------------------------
-- XR SPACES
-- ------------------------------------------------------------
CREATE TABLE xr_spaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sphere_id UUID REFERENCES spheres(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    room_type xr_room_type NOT NULL DEFAULT 'meeting',
    theme xr_theme DEFAULT 'minimalist',
    layout JSONB DEFAULT '{}'::JSONB,
    capacity INTEGER DEFAULT 10,
    is_public BOOLEAN DEFAULT FALSE,
    settings JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_xr_spaces_user ON xr_spaces(user_id);
CREATE INDEX idx_xr_spaces_sphere ON xr_spaces(sphere_id);
CREATE INDEX idx_xr_spaces_type ON xr_spaces(room_type);

-- ------------------------------------------------------------
-- XR SESSIONS
-- ------------------------------------------------------------
CREATE TABLE xr_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    xr_space_id UUID NOT NULL REFERENCES xr_spaces(id) ON DELETE CASCADE,
    host_user_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(255),
    started_at TIMESTAMP NOT NULL DEFAULT NOW(),
    ended_at TIMESTAMP,
    duration_minutes INTEGER,
    participant_count INTEGER DEFAULT 1,
    recording_url TEXT,
    transcript TEXT,
    summary TEXT,
    metadata JSONB DEFAULT '{}'::JSONB
);

CREATE INDEX idx_xr_sessions_space ON xr_sessions(xr_space_id);
CREATE INDEX idx_xr_sessions_host ON xr_sessions(host_user_id);
CREATE INDEX idx_xr_sessions_started ON xr_sessions(started_at);

-- ------------------------------------------------------------
-- XR SESSION PARTICIPANTS
-- ------------------------------------------------------------
CREATE TABLE xr_session_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES xr_sessions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
    role VARCHAR(64) DEFAULT 'participant',  -- host, participant, observer, agent
    joined_at TIMESTAMP NOT NULL DEFAULT NOW(),
    left_at TIMESTAMP,
    CONSTRAINT chk_participant CHECK (user_id IS NOT NULL OR agent_id IS NOT NULL)
);

CREATE INDEX idx_xr_participants_session ON xr_session_participants(session_id);

-- ============================================================
-- AUDIT & GOVERNANCE
-- ============================================================

-- ------------------------------------------------------------
-- AUDIT LOG
-- ------------------------------------------------------------
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
    actor_type VARCHAR(32) NOT NULL,  -- user, agent, system, nova
    action_type VARCHAR(64) NOT NULL,
    resource_type VARCHAR(64),
    resource_id UUID,
    old_value JSONB,
    new_value JSONB,
    ip_address INET,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_user ON audit_log(user_id);
CREATE INDEX idx_audit_agent ON audit_log(agent_id);
CREATE INDEX idx_audit_action ON audit_log(action_type);
CREATE INDEX idx_audit_resource ON audit_log(resource_type, resource_id);
CREATE INDEX idx_audit_created ON audit_log(created_at);

-- ------------------------------------------------------------
-- ETHICS EVENTS
-- ------------------------------------------------------------
CREATE TABLE ethics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
    event_type VARCHAR(64) NOT NULL,  -- blocked, warning, override, approval_required
    severity INTEGER DEFAULT 2 CHECK (severity >= 1 AND severity <= 5),
    reason TEXT NOT NULL,
    context JSONB DEFAULT '{}'::JSONB,
    resolution VARCHAR(64),  -- approved, denied, escalated, auto_resolved
    resolved_by UUID REFERENCES users(id),
    resolved_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ethics_user ON ethics_events(user_id);
CREATE INDEX idx_ethics_agent ON ethics_events(agent_id);
CREATE INDEX idx_ethics_type ON ethics_events(event_type);
CREATE INDEX idx_ethics_created ON ethics_events(created_at);

-- ============================================================
-- ITEM RELATIONSHIPS
-- ============================================================

CREATE TABLE item_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    target_item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    link_type VARCHAR(64) DEFAULT 'related',  -- related, blocks, parent, child, duplicate
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(source_item_id, target_item_id, link_type)
);

CREATE INDEX idx_item_links_source ON item_links(source_item_id);
CREATE INDEX idx_item_links_target ON item_links(target_item_id);

-- ============================================================
-- CONSTRUCTION SPECIFIC (Quebec Compliance)
-- ============================================================

-- ------------------------------------------------------------
-- CONSTRUCTION PROJECTS
-- ------------------------------------------------------------
CREATE TABLE construction_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    item_id UUID REFERENCES items(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    project_number VARCHAR(64),
    client_name VARCHAR(255),
    address TEXT,
    city VARCHAR(128),
    postal_code VARCHAR(10),
    rbq_license VARCHAR(32),
    cnesst_registration VARCHAR(32),
    ccq_compliance JSONB DEFAULT '{}'::JSONB,
    estimated_value DECIMAL(15,2),
    start_date DATE,
    end_date DATE,
    status VARCHAR(32) DEFAULT 'planning',
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_construction_user ON construction_projects(user_id);
CREATE INDEX idx_construction_status ON construction_projects(status);

-- ------------------------------------------------------------
-- COMPLIANCE DOCUMENTS
-- ------------------------------------------------------------
CREATE TABLE compliance_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES construction_projects(id) ON DELETE CASCADE,
    document_type VARCHAR(64) NOT NULL,  -- rbq_permit, cnesst_form, ccq_declaration, inspection
    document_number VARCHAR(128),
    file_url TEXT,
    status VARCHAR(32) DEFAULT 'draft',
    issued_at TIMESTAMP,
    expires_at TIMESTAMP,
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_compliance_project ON compliance_documents(project_id);
CREATE INDEX idx_compliance_type ON compliance_documents(document_type);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
    type VARCHAR(64) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    link TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at);

-- ============================================================
-- SESSIONS / TOKENS
-- ============================================================

CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    device_info JSONB,
    ip_address INET,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_used_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sessions_user ON user_sessions(user_id);
CREATE INDEX idx_sessions_token ON user_sessions(token_hash);
CREATE INDEX idx_sessions_expires ON user_sessions(expires_at);

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_users_updated BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_spheres_updated BEFORE UPDATE ON spheres 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_categories_updated BEFORE UPDATE ON categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_items_updated BEFORE UPDATE ON items 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_agents_updated BEFORE UPDATE ON agents 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_memories_updated BEFORE UPDATE ON memories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_threads_updated BEFORE UPDATE ON knowledge_threads 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_decisions_updated BEFORE UPDATE ON decisions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_xr_spaces_updated BEFORE UPDATE ON xr_spaces 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_construction_updated BEFORE UPDATE ON construction_projects 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-increment thread event_count
CREATE OR REPLACE FUNCTION increment_thread_event_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE knowledge_threads 
    SET event_count = event_count + 1,
        last_event_at = NOW()
    WHERE id = NEW.thread_id;
    
    -- Set sequence number
    NEW.sequence_num = (
        SELECT COALESCE(MAX(sequence_num), 0) + 1 
        FROM thread_events 
        WHERE thread_id = NEW.thread_id
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_thread_events_count BEFORE INSERT ON thread_events 
    FOR EACH ROW EXECUTE FUNCTION increment_thread_event_count();

-- ============================================================
-- SEED DATA: CORE AGENT TYPES
-- ============================================================

INSERT INTO agent_types (code, name, sphere_code, level, is_core, description, role, goal) VALUES
-- CORE 6 AGENTS
('core.nova', 'Nova 2.0', NULL, 'L0', TRUE, 
 'Universal cognitive mediator', 
 'Interpret intent, route tasks, enforce sovereignty',
 'Help user plan, decide, and create across all spheres'),
 
('core.architect', 'Architect Σ', NULL, 'L0', TRUE,
 'Structural reasoning engine',
 'Design structures, workflows, and XR layouts',
 'Convert problems into organized workflows'),
 
('core.ethics', 'Ethics Guardian', NULL, 'L0', TRUE,
 'Ethical oversight',
 'Monitor actions for ethical compliance',
 'Ensure all operations respect Tree Laws'),
 
('core.drift', 'Drift Detector', NULL, 'L0', TRUE,
 'Behavioral drift detection',
 'Monitor agent behavior for anomalies',
 'Maintain agent consistency and reliability'),
 
('core.memory', 'Memory Manager', NULL, 'L0', TRUE,
 'Memory system orchestration',
 'Manage memory layers and archival',
 'Optimize memory storage and retrieval'),
 
('core.thread', 'Thread Weaver', NULL, 'L0', TRUE,
 'Knowledge thread management',
 'Link events into coherent threads',
 'Enable replay and long-term understanding'),

-- PERSONAL SPHERE
('personal.organizer', 'Personal Organizer', 'PERSONAL', 'L2', FALSE,
 'Personal life organization', 
 'Organize personal tasks and routines',
 'Keep personal life structured and efficient'),
 
('personal.wellness', 'Wellness Coach', 'PERSONAL', 'L2', FALSE,
 'Health and wellness tracking',
 'Monitor habits and health goals',
 'Support healthy lifestyle choices'),

-- BUSINESS SPHERE  
('business.strategy', 'Strategy Advisor', 'BUSINESS', 'L2', FALSE,
 'Business strategic planning',
 'Analyze context and propose scenarios',
 'Provide clear strategic options'),
 
('business.operations', 'Operations Manager', 'BUSINESS', 'L2', FALSE,
 'Business workflow optimization',
 'Organize tasks and detect bottlenecks',
 'Keep operations running smoothly'),
 
('business.finance', 'Finance Analyst', 'BUSINESS', 'L2', FALSE,
 'Financial analysis',
 'Track budgets and financial metrics',
 'Ensure financial health'),
 
('business.crm', 'CRM Manager', 'BUSINESS', 'L2', FALSE,
 'Client relationship management',
 'Manage contacts and communications',
 'Build strong client relationships'),

-- SCHOLAR SPHERE
('scholar.research', 'Research Assistant', 'SCHOLAR', 'L2', FALSE,
 'Research support',
 'Find and synthesize information',
 'Turn knowledge into understanding'),
 
('scholar.study', 'Study Planner', 'SCHOLAR', 'L2', FALSE,
 'Learning optimization',
 'Build study plans and track progress',
 'Optimize learning outcomes'),

-- CREATIVE SPHERE
('creative.ideation', 'Ideation Partner', 'CREATIVE', 'L2', FALSE,
 'Creative brainstorming',
 'Generate and develop ideas',
 'Spark creativity and innovation'),
 
('creative.writing', 'Writing Assistant', 'CREATIVE', 'L2', FALSE,
 'Writing support',
 'Help with drafts and editing',
 'Improve writing quality'),

-- CONSTRUCTION SPECIFIC
('business.construction.rbq', 'RBQ Compliance', 'BUSINESS', 'L3', FALSE,
 'RBQ license compliance',
 'Validate RBQ requirements',
 'Ensure RBQ regulatory compliance'),
 
('business.construction.cnesst', 'CNESST Compliance', 'BUSINESS', 'L3', FALSE,
 'CNESST safety compliance',
 'Monitor workplace safety',
 'Maintain CNESST standards'),
 
('business.construction.ccq', 'CCQ Compliance', 'BUSINESS', 'L3', FALSE,
 'CCQ labor compliance',
 'Validate CCQ requirements',
 'Ensure proper labor practices');

-- ============================================================
-- VIEWS
-- ============================================================

-- User dashboard view
CREATE VIEW v_user_dashboard AS
SELECT 
    u.id AS user_id,
    u.name,
    u.email,
    COUNT(DISTINCT s.id) AS sphere_count,
    COUNT(DISTINCT i.id) FILTER (WHERE i.status = 'active') AS active_items,
    COUNT(DISTINCT i.id) FILTER (WHERE i.status = 'completed') AS completed_items,
    COUNT(DISTINCT m.id) AS memory_count,
    COUNT(DISTINCT kt.id) AS thread_count
FROM users u
LEFT JOIN spheres s ON s.user_id = u.id
LEFT JOIN items i ON i.sphere_id = s.id
LEFT JOIN memories m ON m.user_id = u.id
LEFT JOIN knowledge_threads kt ON kt.user_id = u.id
GROUP BY u.id, u.name, u.email;

-- Agent performance view
CREATE VIEW v_agent_performance AS
SELECT 
    a.id AS agent_id,
    at.code AS agent_type,
    at.name AS agent_name,
    a.trust_score,
    a.accuracy_score,
    a.approval_rate,
    a.total_executions,
    a.successful_executions,
    CASE WHEN a.total_executions > 0 
        THEN ROUND(a.successful_executions::DECIMAL / a.total_executions * 100, 2)
        ELSE 0 
    END AS success_rate,
    a.last_active_at
FROM agents a
JOIN agent_types at ON at.id = a.agent_type_id;

-- ============================================================
-- END OF SCHEMA
-- ============================================================
