# CHE·NU — DATABASE SCHEMA & DATA MODEL
**VERSION:** DATABASE.v2.0-canonical-final  
**MODE:** FOUNDATION / POSTGRESQL / PRODUCTION

---

## 1) ARCHITECTURE BASE DE DONNÉES ⚡

### 1.1 Vue d'Ensemble ⚡

```
┌─────────────────────────────────────────────────────────────────┐
│                    CHE·NU DATABASE ARCHITECTURE                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                      USERS                               │    │
│  │   id • email • name • settings • created_at             │    │
│  └─────────────────────────┬───────────────────────────────┘    │
│                            │                                     │
│           ┌────────────────┼────────────────┐                   │
│           │                │                │                   │
│           ▼                ▼                ▼                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │  SPHERES    │  │   AGENTS    │  │  MEMORIES   │             │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘             │
│         │                │                │                     │
│         ▼                ▼                ▼                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │ CATEGORIES  │  │ AGENT_EXEC  │  │MEMORY_LINKS │             │
│  └──────┬──────┘  └─────────────┘  └─────────────┘             │
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────┐                                                │
│  │   ITEMS     │◄────────────────────────────────┐             │
│  └─────────────┘                                 │             │
│                                                  │             │
│  ┌─────────────────────────────────────────────┐│             │
│  │           KNOWLEDGE THREADS                  ││             │
│  │  ┌─────────────┐  ┌─────────────┐           ││             │
│  │  │   THREADS   │──│THREAD_EVENTS│───────────┘│             │
│  │  └─────────────┘  └─────────────┘            │             │
│  └──────────────────────────────────────────────┘             │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    XR SYSTEM                             │    │
│  │  XR_SPACES ────► XR_SESSIONS                            │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              DECISIONS & GOVERNANCE                      │    │
│  │  DECISIONS ──► DECISION_BRANCHES                        │    │
│  │  AUDIT_LOG ──► ETHICS_EVENTS                            │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2) SCHÉMA SQL COMPLET ⚡

### 2.1 USERS ⚡

```sql
-- ================================================
-- USERS
-- ================================================
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  settings JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Index pour recherche par email
CREATE INDEX idx_users_email ON users(email);
```

### 2.2 SPHERES ⚡

```sql
-- ================================================
-- SPHERES (11 sphères par utilisateur)
-- ================================================
CREATE TABLE spheres (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  code VARCHAR(64) NOT NULL,  -- PERSONAL, BUSINESS, SCHOLAR, etc.
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, code)
);

-- Index pour recherche par utilisateur
CREATE INDEX idx_spheres_user ON spheres(user_id);
```

### 2.3 CATEGORIES & ITEMS ⚡

```sql
-- ================================================
-- CATEGORIES (hiérarchie dans chaque sphère)
-- ================================================
CREATE TABLE categories (
  id UUID PRIMARY KEY,
  sphere_id UUID REFERENCES spheres(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES categories(id),  -- Self-reference pour hiérarchie
  name VARCHAR(255),
  code VARCHAR(64),
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_categories_sphere ON categories(sphere_id);
CREATE INDEX idx_categories_parent ON categories(parent_id);

-- ================================================
-- ITEMS (données universelles)
-- ================================================
CREATE TABLE items (
  id UUID PRIMARY KEY,
  sphere_id UUID REFERENCES spheres(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id),
  type VARCHAR(64),           -- task, note, document, project, etc.
  title VARCHAR(255),
  body TEXT,
  status VARCHAR(64),         -- draft, active, completed, archived
  priority INT,               -- 1-5
  due_at TIMESTAMP,
  data JSONB DEFAULT '{}'::JSONB,  -- Données flexibles
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_items_sphere ON items(sphere_id);
CREATE INDEX idx_items_category ON items(category_id);
CREATE INDEX idx_items_type ON items(type);
CREATE INDEX idx_items_status ON items(status);
CREATE INDEX idx_items_due ON items(due_at);
```

### 2.4 AGENTS & EXECUTIONS ⚡

```sql
-- ================================================
-- AGENT TYPES (catalogue des types d'agents)
-- ================================================
CREATE TABLE agent_types (
  id SERIAL PRIMARY KEY,
  code VARCHAR(128) UNIQUE NOT NULL,  -- personal.organizer, business.strategy, etc.
  sphere VARCHAR(64),                  -- Sphère d'appartenance
  description TEXT
);

-- ================================================
-- AGENTS (instances par utilisateur)
-- ================================================
CREATE TABLE agents (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  agent_type_id INT REFERENCES agent_types(id),
  config JSONB DEFAULT '{}'::JSONB,   -- Configuration personnalisée
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_agents_user ON agents(user_id);
CREATE INDEX idx_agents_type ON agents(agent_type_id);

-- ================================================
-- AGENT EXECUTIONS (historique des exécutions)
-- ================================================
CREATE TABLE agent_exec (
  id UUID PRIMARY KEY,
  agent_id UUID REFERENCES agents(id),
  input JSONB,                -- Entrée de l'exécution
  output JSONB,               -- Sortie de l'exécution
  started_at TIMESTAMP DEFAULT NOW(),
  finished_at TIMESTAMP,
  status VARCHAR(32),         -- running, success, error, cancelled
  log JSONB                   -- Logs détaillés
);

CREATE INDEX idx_agent_exec_agent ON agent_exec(agent_id);
CREATE INDEX idx_agent_exec_status ON agent_exec(status);
CREATE INDEX idx_agent_exec_started ON agent_exec(started_at);
```

### 2.5 KNOWLEDGE THREADS ⚡

```sql
-- ================================================
-- KNOWLEDGE THREADS (fils de connaissances)
-- ================================================
CREATE TABLE knowledge_threads (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  code VARCHAR(64),           -- FACTUAL, CONTEXTUAL, INTENT_SAFE
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, code)
);

CREATE INDEX idx_threads_user ON knowledge_threads(user_id);

-- ================================================
-- THREAD EVENTS (événements dans les fils)
-- ================================================
CREATE TABLE thread_events (
  id UUID PRIMARY KEY,
  thread_id UUID REFERENCES knowledge_threads(id) ON DELETE CASCADE,
  event_type VARCHAR(64),     -- fact_added, link_created, etc.
  timestamp TIMESTAMP DEFAULT NOW(),
  ref_item UUID REFERENCES items(id),
  ref_memory UUID,
  data JSONB
);

CREATE INDEX idx_thread_events_thread ON thread_events(thread_id);
CREATE INDEX idx_thread_events_time ON thread_events(timestamp);
```

### 2.6 MEMORY LAYERS ⚡

```sql
-- ================================================
-- MEMORIES (couches de mémoire)
-- ================================================
CREATE TABLE memories (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  layer VARCHAR(32),          -- session, operational, long_term, archive
  sphere_id UUID REFERENCES spheres(id),
  source_item UUID REFERENCES items(id),
  content TEXT,
  metadata JSONB,
  anchored BOOLEAN DEFAULT FALSE,  -- Protection contre archivage
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_memories_user ON memories(user_id);
CREATE INDEX idx_memories_layer ON memories(layer);
CREATE INDEX idx_memories_sphere ON memories(sphere_id);
CREATE INDEX idx_memories_anchored ON memories(anchored);

-- ================================================
-- MEMORY LINKS (liens entre mémoires)
-- ================================================
CREATE TABLE memory_links (
  id UUID PRIMARY KEY,
  from_memory UUID REFERENCES memories(id) ON DELETE CASCADE,
  to_memory UUID REFERENCES memories(id) ON DELETE CASCADE,
  relation VARCHAR(64),       -- causal, temporal, categorical, reference
  weight REAL DEFAULT 1.0     -- Force du lien
);

CREATE INDEX idx_memory_links_from ON memory_links(from_memory);
CREATE INDEX idx_memory_links_to ON memory_links(to_memory);
```

### 2.7 DECISIONS & IMPACT PREVIEWS ⚡

```sql
-- ================================================
-- DECISIONS (points de décision)
-- ================================================
CREATE TABLE decisions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  sphere_id UUID REFERENCES spheres(id),
  title VARCHAR(255),
  context JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_decisions_user ON decisions(user_id);
CREATE INDEX idx_decisions_sphere ON decisions(sphere_id);

-- ================================================
-- DECISION BRANCHES (branches de décision)
-- ================================================
CREATE TABLE decision_branches (
  id UUID PRIMARY KEY,
  decision_id UUID REFERENCES decisions(id) ON DELETE CASCADE,
  code VARCHAR(16),           -- A, B, C...
  description TEXT,
  impact JSONB,               -- Impact prévu
  selected BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_branches_decision ON decision_branches(decision_id);
```

### 2.8 XR SYSTEM ⚡

```sql
-- ================================================
-- XR SPACES (espaces XR)
-- ================================================
CREATE TABLE xr_spaces (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  sphere_id UUID REFERENCES spheres(id),
  name VARCHAR(255),
  room_type VARCHAR(64),      -- meeting, workshop, meditation, etc.
  layout JSONB,               -- Configuration spatiale
  theme JSONB,                -- ancient, giant_tree, futuristic, cosmic
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_xr_spaces_user ON xr_spaces(user_id);
CREATE INDEX idx_xr_spaces_sphere ON xr_spaces(sphere_id);

-- ================================================
-- XR SESSIONS (sessions XR)
-- ================================================
CREATE TABLE xr_sessions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  xr_space_id UUID REFERENCES xr_spaces(id),
  started_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP,
  recording_ref TEXT,         -- Référence à l'enregistrement
  summary_item UUID REFERENCES items(id),
  metadata JSONB
);

CREATE INDEX idx_xr_sessions_user ON xr_sessions(user_id);
CREATE INDEX idx_xr_sessions_space ON xr_sessions(xr_space_id);
```

### 2.9 AUDIT & ETHICS ⚡

```sql
-- ================================================
-- AUDIT LOG (journal d'audit complet)
-- ================================================
CREATE TABLE audit_log (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  actor VARCHAR(64),          -- user, nova, agent_id
  agent_id UUID,
  action_type VARCHAR(64),    -- create, read, update, delete, execute
  payload JSONB,
  reversible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_user ON audit_log(user_id);
CREATE INDEX idx_audit_actor ON audit_log(actor);
CREATE INDEX idx_audit_action ON audit_log(action_type);
CREATE INDEX idx_audit_time ON audit_log(created_at);

-- ================================================
-- ETHICS EVENTS (événements éthiques)
-- ================================================
CREATE TABLE ethics_events (
  id UUID PRIMARY KEY,
  event_type VARCHAR(32),     -- approved, blocked, warning
  reason TEXT,
  related_action UUID REFERENCES audit_log(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_ethics_type ON ethics_events(event_type);
CREATE INDEX idx_ethics_time ON ethics_events(created_at);
```

---

## 3) DATA MODEL JSON SCHEMAS ⚡

### 3.1 Sphere Schema ⚡

```yaml
Sphere:
  type: object
  required: [id, code, name]
  properties:
    id:
      type: string
      format: uuid
    code:
      type: string
      enum:
        - PERSONAL
        - SOCIAL
        - SCHOLAR
        - BUSINESS
        - CREATIVE
        - INSTITUTIONS
        - METHODOLOGY
        - XR
        - ENTERTAINMENT
        - AI_LAB
        - MY_TEAM
    name:
      type: string
    metadata:
      type: object
```

### 3.2 Item Schema ⚡

```yaml
Item:
  type: object
  required: [id, type]
  properties:
    id:
      type: string
      format: uuid
    sphere_id:
      type: string
      format: uuid
    category_id:
      type: string
      format: uuid
    type:
      type: string
      enum:
        - task
        - note
        - document
        - project
        - contact
        - event
        - goal
        - metric
    title:
      type: string
    body:
      type: string
    status:
      type: string
      enum: [draft, active, in_progress, completed, archived]
    priority:
      type: integer
      minimum: 1
      maximum: 5
    due_at:
      type: string
      format: date-time
    data:
      type: object
```

### 3.3 Agent Schema ⚡

```yaml
Agent:
  type: object
  required: [id, type]
  properties:
    id:
      type: string
      format: uuid
    type:
      type: string
      description: "Agent type code (e.g., personal.organizer)"
    config:
      type: object
      properties:
        enabled_features:
          type: array
          items:
            type: string
        notification_preferences:
          type: object
        custom_rules:
          type: array
```

### 3.4 KnowledgeThread Schema ⚡

```yaml
KnowledgeThread:
  type: object
  required: [id, code]
  properties:
    id:
      type: string
      format: uuid
    code:
      type: string
      enum: [FACTUAL, CONTEXTUAL, INTENT_SAFE]
    name:
      type: string
    config:
      type: object
```

### 3.5 ThreadEvent Schema ⚡

```yaml
ThreadEvent:
  type: object
  required: [id, thread_id, event_type]
  properties:
    id:
      type: string
      format: uuid
    thread_id:
      type: string
      format: uuid
    event_type:
      type: string
      enum:
        - fact_added
        - fact_updated
        - link_created
        - link_removed
        - context_changed
    timestamp:
      type: string
      format: date-time
    data:
      type: object
```

### 3.6 Memory Schema ⚡

```yaml
Memory:
  type: object
  required: [id, layer]
  properties:
    id:
      type: string
      format: uuid
    layer:
      type: string
      enum: [session, operational, long_term, archive]
    content:
      type: string
    metadata:
      type: object
      properties:
        source:
          type: string
        confidence:
          type: number
        tags:
          type: array
    anchored:
      type: boolean
      default: false
```

### 3.7 XrSpace Schema ⚡

```yaml
XrSpace:
  type: object
  required: [id, name]
  properties:
    id:
      type: string
      format: uuid
    name:
      type: string
    room_type:
      type: string
      enum: [meeting, workshop, meditation, study, creative, social]
    layout:
      type: object
      properties:
        shape:
          type: string
        dimensions:
          type: object
        furniture:
          type: array
    theme:
      type: object
      properties:
        style:
          type: string
          enum: [ancient, giant_tree, futuristic, cosmic]
        lighting:
          type: string
        ambiance:
          type: string
```

### 3.8 XrSession Schema ⚡

```yaml
XrSession:
  type: object
  required: [id, xr_space_id]
  properties:
    id:
      type: string
      format: uuid
    xr_space_id:
      type: string
      format: uuid
    started_at:
      type: string
      format: date-time
    ended_at:
      type: string
      format: date-time
    recording_ref:
      type: string
    metadata:
      type: object
      properties:
        participants:
          type: array
        duration_minutes:
          type: integer
        tags:
          type: array
```

---

## 4) RELATIONS ENTRE TABLES ⚡

```
┌─────────────────────────────────────────────────────────────────┐
│                    ENTITY RELATIONSHIP DIAGRAM                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  USERS ─────┬────► SPHERES ─────► CATEGORIES ─────► ITEMS       │
│             │                                         │         │
│             ├────► AGENTS ─────► AGENT_EXEC          │         │
│             │                                         │         │
│             ├────► KNOWLEDGE_THREADS ─► THREAD_EVENTS─┘         │
│             │                               │                   │
│             ├────► MEMORIES ◄───────────────┘                   │
│             │         │                                         │
│             │         └────► MEMORY_LINKS                       │
│             │                                                   │
│             ├────► DECISIONS ─────► DECISION_BRANCHES           │
│             │                                                   │
│             ├────► XR_SPACES ─────► XR_SESSIONS                 │
│             │                                                   │
│             └────► AUDIT_LOG ─────► ETHICS_EVENTS               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5) SEED DATA: AGENT TYPES ⚡

```sql
-- ================================================
-- SEED: Agent Types par Sphère
-- ================================================

-- PERSONAL
INSERT INTO agent_types (code, sphere, description) VALUES
('personal.organizer', 'PERSONAL', 'Structural maintenance of Personal Sphere'),
('personal.wellness', 'PERSONAL', 'Health & habit observation'),
('personal.goals', 'PERSONAL', 'Goal structuring & milestone engineering');

-- SOCIAL
INSERT INTO agent_types (code, sphere, description) VALUES
('social.organizer', 'SOCIAL', 'Contacts & communication structuring'),
('social.relationships', 'SOCIAL', 'Relationship health & reconnection logic'),
('social.content', 'SOCIAL', 'Social content planning (non-addictive)');

-- SCHOLAR
INSERT INTO agent_types (code, sphere, description) VALUES
('scholar.organizer', 'SCHOLAR', 'Academic structuring & knowledge taxonomy'),
('scholar.research', 'SCHOLAR', 'Source comparison & research synthesis'),
('scholar.study', 'SCHOLAR', 'Retention optimization & study scheduling'),
('scholar.synthesizer', 'SCHOLAR', 'Concept map generation & insight linking');

-- BUSINESS
INSERT INTO agent_types (code, sphere, description) VALUES
('business.organizer', 'BUSINESS', 'Maintains Business Sphere coherence'),
('business.strategy', 'BUSINESS', 'Strategic planning & scenario modeling'),
('business.crm', 'BUSINESS', 'Client relationship intelligence'),
('business.operations', 'BUSINESS', 'Process efficiency & bottleneck detection'),
('business.finance', 'BUSINESS', 'Financial analysis & anomaly detection');

-- CREATIVE
INSERT INTO agent_types (code, sphere, description) VALUES
('creative.organizer', 'CREATIVE', 'Creative asset categorization & version control'),
('creative.muse', 'CREATIVE', 'Idea generation & cross-style blending'),
('creative.critic', 'CREATIVE', 'Feedback and quality evaluation'),
('creative.curator', 'CREATIVE', 'Portfolio building & showcase engineering');

-- INSTITUTIONS
INSERT INTO agent_types (code, sphere, description) VALUES
('institutions.organizer', 'INSTITUTIONS', 'Legal, government & compliance structuring'),
('institutions.compliance', 'INSTITUTIONS', 'Deadline & requirement monitoring'),
('institutions.filing', 'INSTITUTIONS', 'Form preparation (no silent submission)');

-- METHODOLOGY
INSERT INTO agent_types (code, sphere, description) VALUES
('methodology.core', 'METHODOLOGY', 'Applies working systems (GTD, Agile, Zettelkasten)'),
('methodology.optimizer', 'METHODOLOGY', 'Workflow friction analysis & improvement'),
('methodology.templates', 'METHODOLOGY', 'Template suggestion & standardization');

-- XR
INSERT INTO agent_types (code, sphere, description) VALUES
('xr.guide', 'XR', 'Spatial navigation guidance'),
('xr.architect', 'XR', 'Room layout & environment engineering'),
('xr.recorder', 'XR', 'Replayable session capture'),
('xr.presence', 'XR', 'Avatar logic & state representation');

-- ENTERTAINMENT
INSERT INTO agent_types (code, sphere, description) VALUES
('entertainment.curator', 'ENTERTAINMENT', 'Non-addictive leisure recommendations'),
('entertainment.tracker', 'ENTERTAINMENT', 'Completion tracking'),
('entertainment.documenter', 'ENTERTAINMENT', 'Experience memorization');

-- AI_LAB
INSERT INTO agent_types (code, sphere, description) VALUES
('ailab.organizer', 'AI_LAB', 'Prompt & experiment indexing'),
('ailab.optimizer', 'AI_LAB', 'Prompt improvement & cleanup'),
('ailab.debugger', 'AI_LAB', 'Agent behavior troubleshooting');

-- MY_TEAM
INSERT INTO agent_types (code, sphere, description) VALUES
('team.organizer', 'MY_TEAM', 'Team resource structuring'),
('team.delegation', 'MY_TEAM', 'Task owner suggestion & handoff clarity'),
('team.collab', 'MY_TEAM', 'Meeting prep, follow-ups, checkpoints'),
('team.permissions', 'MY_TEAM', 'Access control recommendations');
```

---

## 6) SEED DATA: DEFAULT SPHERES ⚡

```sql
-- ================================================
-- Function to create default spheres for new user
-- ================================================
CREATE OR REPLACE FUNCTION create_default_spheres(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO spheres (id, user_id, code, name) VALUES
    (gen_random_uuid(), p_user_id, 'PERSONAL', 'Personnel'),
    (gen_random_uuid(), p_user_id, 'SOCIAL', 'Social & Media'),
    (gen_random_uuid(), p_user_id, 'SCHOLAR', 'Scholar'),
    (gen_random_uuid(), p_user_id, 'BUSINESS', 'Business'),
    (gen_random_uuid(), p_user_id, 'CREATIVE', 'Creative Studio'),
    (gen_random_uuid(), p_user_id, 'INSTITUTIONS', 'Institutions'),
    (gen_random_uuid(), p_user_id, 'METHODOLOGY', 'Methodology'),
    (gen_random_uuid(), p_user_id, 'XR', 'XR Immersive'),
    (gen_random_uuid(), p_user_id, 'ENTERTAINMENT', 'Entertainment'),
    (gen_random_uuid(), p_user_id, 'AI_LAB', 'IA Laboratory'),
    (gen_random_uuid(), p_user_id, 'MY_TEAM', 'My Team');
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-create spheres on user creation
CREATE OR REPLACE FUNCTION trigger_create_user_spheres()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM create_default_spheres(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_user_insert
AFTER INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION trigger_create_user_spheres();
```

---

## 7) VIEWS UTILES ⚡

```sql
-- ================================================
-- VIEW: Agent Activity Summary
-- ================================================
CREATE VIEW v_agent_activity AS
SELECT 
  a.id AS agent_id,
  at.code AS agent_type,
  at.sphere,
  u.email AS user_email,
  COUNT(ae.id) AS total_executions,
  COUNT(CASE WHEN ae.status = 'success' THEN 1 END) AS successful,
  COUNT(CASE WHEN ae.status = 'error' THEN 1 END) AS errors,
  MAX(ae.started_at) AS last_execution
FROM agents a
JOIN agent_types at ON a.agent_type_id = at.id
JOIN users u ON a.user_id = u.id
LEFT JOIN agent_exec ae ON a.id = ae.agent_id
GROUP BY a.id, at.code, at.sphere, u.email;

-- ================================================
-- VIEW: Memory Layer Summary
-- ================================================
CREATE VIEW v_memory_summary AS
SELECT 
  u.email,
  m.layer,
  COUNT(*) AS memory_count,
  COUNT(CASE WHEN m.anchored THEN 1 END) AS anchored_count
FROM memories m
JOIN users u ON m.user_id = u.id
GROUP BY u.email, m.layer;

-- ================================================
-- VIEW: Ethics Overview
-- ================================================
CREATE VIEW v_ethics_overview AS
SELECT 
  DATE(ee.created_at) AS date,
  ee.event_type,
  COUNT(*) AS count
FROM ethics_events ee
GROUP BY DATE(ee.created_at), ee.event_type
ORDER BY date DESC;
```

---

**END — DATABASE SCHEMA & DATA MODEL v2.0**
