# CHE·NU — API ENDPOINTS PACK (v1.0 Canonical)
**VERSION:** API.v1.0-canonical  
**MODE:** PRODUCTION / REST / OPENAPI-STYLE

---

## 1) BASE CONFIGURATION ⚡

```yaml
CHE-NU_API_PACK:
  version: "1.0-canonical"
  base_url: "https://api.che-nu.local/v1"
  
  auth:
    type: "bearer"
    header: "Authorization"
    format: "Bearer <token>"
    
  conventions:
    response_envelope:
      success:
        ok: true
        data: <any>
      error:
        ok: false
        error: <object>
    pagination:
      query_params: ["page", "page_size"]
      default_page_size: 25
```

---

## 2) ENDPOINTS: USER & SESSION ⚡

### 2.1 Get Current User ⚡

```yaml
get_me:
  method: "GET"
  path: "/me"
  summary: "Get current authenticated user profile"
  auth: required
  response:
    type: User
    example:
      id: "uuid"
      email: "user@example.com"
      name: "John Doe"
      settings: {}
```

### 2.2 Update User ⚡

```yaml
update_me:
  method: "PATCH"
  path: "/me"
  summary: "Update user settings"
  auth: required
  body:
    type: object
    properties:
      name: string
      settings: object
  response:
    type: User
```

---

## 3) ENDPOINTS: SPHERES & CATEGORIES ⚡

### 3.1 List Spheres ⚡

```yaml
list_spheres:
  method: "GET"
  path: "/spheres"
  summary: "List all spheres for current user"
  auth: required
  response:
    type: array
    items: Sphere
  example_response:
    - id: "uuid-1"
      code: "PERSONAL"
      name: "Personnel"
    - id: "uuid-2"
      code: "BUSINESS"
      name: "Business"
```

### 3.2 Create Sphere ⚡

```yaml
create_sphere:
  method: "POST"
  path: "/spheres"
  summary: "Create new sphere (custom or CHE·NU standard)"
  auth: required
  body:
    type: object
    required: [code, name]
    properties:
      code: string
      name: string
      description: string
  response:
    type: Sphere
```

### 3.3 List Categories ⚡

```yaml
list_categories:
  method: "GET"
  path: "/spheres/{sphere_id}/categories"
  summary: "List categories in sphere (tree-capable)"
  auth: required
  params:
    - name: sphere_id
      in: path
      required: true
      type: uuid
  response:
    type: array
    items: Category
```

### 3.4 Create Category ⚡

```yaml
create_category:
  method: "POST"
  path: "/spheres/{sphere_id}/categories"
  summary: "Create category"
  auth: required
  params:
    - name: sphere_id
      in: path
      required: true
  body:
    type: object
    required: [name]
    properties:
      name: string
      parent_id: uuid  # For nested categories
      code: string
      metadata: object
  response:
    type: Category
```

---

## 4) ENDPOINTS: ITEMS ⚡

### 4.1 List Items ⚡

```yaml
list_items:
  method: "GET"
  path: "/spheres/{sphere_id}/items"
  summary: "List items in a sphere, filterable"
  auth: required
  params:
    - name: sphere_id
      in: path
      required: true
    - name: type
      in: query
      description: "Filter by type (task, note, document, etc.)"
    - name: status
      in: query
      description: "Filter by status (draft, active, completed, archived)"
    - name: category_id
      in: query
      description: "Filter by category"
  response:
    type: array
    items: Item
```

### 4.2 Create Item ⚡

```yaml
create_item:
  method: "POST"
  path: "/spheres/{sphere_id}/items"
  summary: "Create item (task, note, document, etc.)"
  auth: required
  params:
    - name: sphere_id
      in: path
      required: true
  body:
    type: ItemInput
    required: [type]
    properties:
      type: string        # task, note, document, project, contact, event, goal, metric
      title: string
      body: string
      status: string      # draft, active, in_progress, completed, archived
      priority: integer   # 1-5
      due_at: datetime
      category_id: uuid
      data: object        # Flexible additional data
  response:
    type: Item
```

### 4.3 Update Item ⚡

```yaml
update_item:
  method: "PATCH"
  path: "/items/{item_id}"
  summary: "Update an item"
  auth: required
  params:
    - name: item_id
      in: path
      required: true
  body:
    type: ItemUpdate
    properties:
      title: string
      body: string
      status: string
      priority: integer
      due_at: datetime
      category_id: uuid
      data: object
  response:
    type: Item
```

---

## 5) ENDPOINTS: AGENTS ⚡

### 5.1 List Agent Types ⚡

```yaml
list_agent_types:
  method: "GET"
  path: "/agent-types"
  summary: "List canonical agent types (business.organizer, personal.wellness, etc.)"
  auth: required
  response:
    type: array
    items: AgentType
  example_response:
    - code: "personal.organizer"
      sphere: "PERSONAL"
      description: "Structural maintenance of Personal Sphere"
    - code: "business.strategy"
      sphere: "BUSINESS"
      description: "Strategic planning & scenario modeling"
```

### 5.2 List User Agents ⚡

```yaml
list_agents:
  method: "GET"
  path: "/agents"
  summary: "List configured agents for current user"
  auth: required
  response:
    type: array
    items: Agent
```

### 5.3 Create Agent ⚡

```yaml
create_agent:
  method: "POST"
  path: "/agents"
  summary: "Create/configure an agent instance"
  auth: required
  body:
    type: object
    required: [agent_type_code]
    properties:
      agent_type_code: string  # e.g., "business.strategy"
      name: string
      config: object
  response:
    type: Agent
```

### 5.4 Invoke Agent ⚡

```yaml
invoke_agent:
  method: "POST"
  path: "/agents/{agent_id}/invoke"
  summary: "Invoke a domain agent with structured payload"
  auth: required
  params:
    - name: agent_id
      in: path
      required: true
  body:
    type: object
    properties:
      input: object
  response:
    type: AgentExecution
    properties:
      id: uuid
      agent_id: uuid
      status: string  # running, success, error, cancelled
      input: object
      output: object
```

---

## 6) ENDPOINTS: NOVA 2.0 ORCHESTRATOR ⚡

### 6.1 Nova Context (Main Entry Point) ⚡

```yaml
nova_context:
  method: "POST"
  path: "/nova/context"
  summary: "Send natural language input to Nova 2.0 (core orchestrator)"
  auth: required
  body:
    type: object
    required: [message]
    properties:
      message: string
      mode:
        type: string
        enum: ["ask", "plan", "create", "decide", "debug"]
        default: "ask"
      sphere_hint: string  # Optional hint for sphere context
  response:
    type: NovaResponse
    properties:
      answer: string
      plan: object
      decisions:
        type: array
        items: DecisionBranch
  example_request:
    message: "Help me plan my Q1 goals"
    mode: "plan"
    sphere_hint: "BUSINESS"
```

### 6.2 Nova Impact Preview ⚡

```yaml
nova_impact_preview:
  method: "POST"
  path: "/nova/impact-preview"
  summary: "Ask Nova for impact preview of a plan"
  auth: required
  body:
    type: object
    properties:
      plan: object
  response:
    type: object
    properties:
      branches:
        type: array
        items: DecisionBranch
  description: |
    Used before executing irreversible actions.
    Returns multiple branches (A, B, C) with impact analysis.
```

### 6.3 Nova Replay ⚡

```yaml
nova_replay:
  method: "GET"
  path: "/nova/replay"
  summary: "Replay a decision / session / thread"
  auth: required
  params:
    - name: thread_id
      in: query
      type: uuid
    - name: mode
      in: query
      type: string
      enum: ["timeline", "decision", "narrative", "xr"]
  response:
    type: object
    properties:
      replay_payload: object
```

---

## 7) ENDPOINTS: MEMORY & THREADS ⚡

### 7.1 Search Memory ⚡

```yaml
search_memory:
  method: "GET"
  path: "/memory"
  summary: "Search or list memories"
  auth: required
  params:
    - name: query
      in: query
      description: "Semantic search query"
    - name: layer
      in: query
      description: "Filter by layer (session, operational, long_term, archive)"
    - name: sphere_id
      in: query
      description: "Filter by sphere"
  response:
    type: array
    items: Memory
```

### 7.2 Create Memory ⚡

```yaml
create_memory:
  method: "POST"
  path: "/memory"
  summary: "Store new memory"
  auth: required
  body:
    type: MemoryInput
    properties:
      layer: string       # session, operational, long_term, archive
      sphere_id: uuid
      source_item: uuid
      content: string
      anchored: boolean   # Protected from archival if true
      metadata: object
  response:
    type: Memory
```

### 7.3 List Knowledge Threads ⚡

```yaml
list_threads:
  method: "GET"
  path: "/threads"
  summary: "List knowledge threads"
  auth: required
  response:
    type: array
    items: KnowledgeThread
```

### 7.4 Append Thread Event ⚡

```yaml
append_thread_event:
  method: "POST"
  path: "/threads/{thread_id}/events"
  summary: "Append an event to a knowledge thread"
  auth: required
  params:
    - name: thread_id
      in: path
      required: true
  body:
    type: ThreadEventInput
    properties:
      event_type: string    # fact_added, link_created, context_changed
      ref_item: uuid
      ref_memory: uuid
      data: object
  response:
    type: ThreadEvent
```

---

## 8) ENDPOINTS: DECISIONS ⚡

### 8.1 Create Decision ⚡

```yaml
create_decision:
  method: "POST"
  path: "/decisions"
  summary: "Record a decision + branches"
  auth: required
  body:
    type: object
    required: [title]
    properties:
      title: string
      sphere_id: uuid
      context: object
      branches:
        type: array
        items:
          type: object
          properties:
            code: string        # A, B, C
            description: string
            impact: object
  response:
    type: Decision
```

---

## 9) ENDPOINTS: XR ⚡

### 9.1 List XR Spaces ⚡

```yaml
list_xr_spaces:
  method: "GET"
  path: "/xr/spaces"
  summary: "List XR spaces"
  auth: required
  response:
    type: array
    items: XrSpace
```

### 9.2 Create XR Space ⚡

```yaml
create_xr_space:
  method: "POST"
  path: "/xr/spaces"
  summary: "Create XR space"
  auth: required
  body:
    type: XrSpaceInput
    properties:
      name: string
      room_type: string   # meeting, workshop, meditation, study, creative, social
      layout: object
      theme: object       # ancient, giant_tree, futuristic, cosmic
  response:
    type: XrSpace
```

### 9.3 Start XR Session ⚡

```yaml
start_xr_session:
  method: "POST"
  path: "/xr/sessions"
  summary: "Start XR session"
  auth: required
  body:
    type: object
    properties:
      xr_space_id: uuid
  response:
    type: XrSession
```

---

## 10) ENDPOINTS: AUDIT & ETHICS ⚡

### 10.1 List Audit Log ⚡

```yaml
list_audit:
  method: "GET"
  path: "/audit"
  summary: "List recent actions"
  auth: required
  response:
    type: array
    items: AuditLog
    example:
      - id: "uuid"
        actor: "nova"
        action_type: "create"
        payload: {}
```

### 10.2 List Ethics Events ⚡

```yaml
list_ethics_events:
  method: "GET"
  path: "/ethics"
  summary: "List ethics guard events"
  auth: required
  response:
    type: array
    items: EthicsEvent
    example:
      - id: "uuid"
        event_type: "blocked"
        reason: "Requires user approval for irreversible action"
```

---

## 11) API SCHEMAS ⚡

### 11.1 Core Schemas ⚡

```yaml
schemas:

  User:
    type: object
    properties:
      id: { type: string, format: uuid }
      email: { type: string }
      name: { type: string }
      settings: { type: object }

  Sphere:
    type: object
    properties:
      id: { type: string, format: uuid }
      code: { type: string }
      name: { type: string }

  Category:
    type: object
    properties:
      id: { type: string, format: uuid }
      sphere_id: { type: string, format: uuid }
      parent_id: { type: string, format: uuid }
      name: { type: string }
      code: { type: string }
      metadata: { type: object }

  Item:
    type: object
    properties:
      id: { type: string, format: uuid }
      sphere_id: { type: string, format: uuid }
      category_id: { type: string, format: uuid }
      type: { type: string }
      title: { type: string }
      body: { type: string }
      status: { type: string }
      data: { type: object }

  ItemInput:
    type: object
    required: [type]
    properties:
      type: { type: string }
      title: { type: string }
      body: { type: string }
      status: { type: string }
      priority: { type: integer }
      due_at: { type: string, format: date-time }
      category_id: { type: string, format: uuid }
      data: { type: object }

  ItemUpdate:
    type: object
    properties:
      title: { type: string }
      body: { type: string }
      status: { type: string }
      priority: { type: integer }
      due_at: { type: string, format: date-time }
      category_id: { type: string, format: uuid }
      data: { type: object }
```

### 11.2 Agent Schemas ⚡

```yaml
schemas:

  AgentType:
    type: object
    properties:
      code: { type: string }
      sphere: { type: string }
      description: { type: string }

  Agent:
    type: object
    properties:
      id: { type: string, format: uuid }
      agent_type_code: { type: string }
      config: { type: object }

  AgentExecution:
    type: object
    properties:
      id: { type: string, format: uuid }
      agent_id: { type: string, format: uuid }
      status: { type: string }
      input: { type: object }
      output: { type: object }
```

### 11.3 Nova & Decision Schemas ⚡

```yaml
schemas:

  NovaResponse:
    type: object
    properties:
      answer: { type: string }
      plan: { type: object }
      decisions:
        type: array
        items: { $ref: DecisionBranch }

  Decision:
    type: object
    properties:
      id: { type: string, format: uuid }
      title: { type: string }
      context: { type: object }

  DecisionBranch:
    type: object
    properties:
      code: { type: string }
      description: { type: string }
      impact: { type: object }
```

### 11.4 Memory & Thread Schemas ⚡

```yaml
schemas:

  Memory:
    type: object
    properties:
      id: { type: string, format: uuid }
      layer: { type: string }
      content: { type: string }
      metadata: { type: object }

  MemoryInput:
    type: object
    properties:
      layer: { type: string }
      sphere_id: { type: string, format: uuid }
      source_item: { type: string, format: uuid }
      content: { type: string }
      anchored: { type: boolean }
      metadata: { type: object }

  KnowledgeThread:
    type: object
    properties:
      id: { type: string, format: uuid }
      code: { type: string }
      name: { type: string }
      config: { type: object }

  ThreadEvent:
    type: object
    properties:
      id: { type: string, format: uuid }
      event_type: { type: string }
      timestamp: { type: string, format: date-time }
      data: { type: object }

  ThreadEventInput:
    type: object
    properties:
      event_type: { type: string }
      ref_item: { type: string, format: uuid }
      ref_memory: { type: string, format: uuid }
      data: { type: object }
```

### 11.5 XR & Audit Schemas ⚡

```yaml
schemas:

  XrSpace:
    type: object
    properties:
      id: { type: string, format: uuid }
      name: { type: string }
      room_type: { type: string }
      layout: { type: object }

  XrSpaceInput:
    type: object
    properties:
      name: { type: string }
      room_type: { type: string }
      layout: { type: object }
      theme: { type: object }

  XrSession:
    type: object
    properties:
      id: { type: string, format: uuid }
      xr_space_id: { type: string, format: uuid }
      started_at: { type: string, format: date-time }
      metadata: { type: object }

  AuditLog:
    type: object
    properties:
      id: { type: string, format: uuid }
      actor: { type: string }
      action_type: { type: string }
      payload: { type: object }

  EthicsEvent:
    type: object
    properties:
      id: { type: string, format: uuid }
      event_type: { type: string }
      reason: { type: string }
```

---

## 12) ENDPOINT SUMMARY TABLE ⚡

```
┌──────────────────────────────────────────────────────────────────────────┐
│                      CHE·NU API ENDPOINTS SUMMARY                         │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  USER & SESSION                                                           │
│  ├─ GET  /me                         Get current user                    │
│  └─ PATCH /me                        Update user settings                │
│                                                                           │
│  SPHERES & CATEGORIES                                                     │
│  ├─ GET  /spheres                    List all spheres                    │
│  ├─ POST /spheres                    Create sphere                       │
│  ├─ GET  /spheres/{id}/categories    List categories                     │
│  └─ POST /spheres/{id}/categories    Create category                     │
│                                                                           │
│  ITEMS                                                                    │
│  ├─ GET  /spheres/{id}/items         List items (filterable)             │
│  ├─ POST /spheres/{id}/items         Create item                         │
│  └─ PATCH /items/{id}                Update item                         │
│                                                                           │
│  AGENTS                                                                   │
│  ├─ GET  /agent-types                List agent types                    │
│  ├─ GET  /agents                     List user agents                    │
│  ├─ POST /agents                     Create agent                        │
│  └─ POST /agents/{id}/invoke         Invoke agent                        │
│                                                                           │
│  NOVA 2.0 ORCHESTRATOR                                                    │
│  ├─ POST /nova/context               Main entry point                    │
│  ├─ POST /nova/impact-preview        Get impact preview                  │
│  └─ GET  /nova/replay                Replay session/thread               │
│                                                                           │
│  MEMORY & THREADS                                                         │
│  ├─ GET  /memory                     Search/list memories                │
│  ├─ POST /memory                     Create memory                       │
│  ├─ GET  /threads                    List knowledge threads              │
│  └─ POST /threads/{id}/events        Append thread event                 │
│                                                                           │
│  DECISIONS                                                                │
│  └─ POST /decisions                  Create decision + branches          │
│                                                                           │
│  XR                                                                       │
│  ├─ GET  /xr/spaces                  List XR spaces                      │
│  ├─ POST /xr/spaces                  Create XR space                     │
│  └─ POST /xr/sessions                Start XR session                    │
│                                                                           │
│  AUDIT & ETHICS                                                           │
│  ├─ GET  /audit                      List audit log                      │
│  └─ GET  /ethics                     List ethics events                  │
│                                                                           │
│  TOTAL: 22 ENDPOINTS                                                      │
└──────────────────────────────────────────────────────────────────────────┘
```

---

**END — API ENDPOINTS PACK v1.0**
