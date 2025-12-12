# CHE·NU — LLM PACK: Tools & Crews (v1.0 Canonical)
**VERSION:** LLM.v1.0-canonical  
**MODE:** PRODUCTION / CREWAI / LANGCHAIN

---

## 1) LLM CONFIGURATION ⚡

### 1.1 Modèles Disponibles ⚡

```yaml
CHE-NU_LLM_PACK:
  version: "1.0-canonical"
  
  llms:
    
    default:
      provider: "openai"
      model: "gpt-4.1"
      use_cases:
        - "General conversation"
        - "Standard agent tasks"
        - "Document analysis"
        
    lightweight:
      provider: "openai"
      model: "gpt-4.1-mini"
      use_cases:
        - "Quick responses"
        - "Simple classification"
        - "XR guidance"
        
    reasoning_heavy:
      provider: "openai"
      model: "gpt-5.1-thinking"
      use_cases:
        - "Complex reasoning"
        - "Strategic planning"
        - "Impact analysis"
        - "Nova orchestration"
```

### 1.2 Sélection de Modèle par Contexte ⚡

```yaml
model_selection_matrix:

  by_task_type:
    orchestration: "reasoning_heavy"
    planning: "reasoning_heavy"
    simple_query: "lightweight"
    document_analysis: "default"
    memory_search: "default"
    xr_navigation: "lightweight"
    strategy: "reasoning_heavy"
    
  by_crew:
    nova_core_crew: "reasoning_heavy"
    business_sphere_crew: "default"
    scholar_crew: "default"
    xr_crew: "lightweight"
```

---

## 2) LLM TOOLS ⚡

### 2.1 Core Orchestrator Tools ⚡

```yaml
tools:

  nova_context_tool:
    name: "nova_context_tool"
    description: "Send natural language context to Nova 2.0 and get structured plan + answer"
    type: "http"
    config:
      method: "POST"
      url: "{{API_BASE}}/nova/context"
    args_schema:
      type: object
      properties:
        message:
          type: string
          description: "Natural language message to Nova"
        mode:
          type: string
          enum: ["ask", "plan", "create", "decide", "debug"]
          default: "ask"
        sphere_hint:
          type: string
          description: "Optional sphere context hint"
    returns:
      answer: string
      plan: object
      decisions: array

  nova_impact_preview_tool:
    name: "nova_impact_preview_tool"
    description: "Ask Nova to compute impact preview for a potential plan/branch"
    type: "http"
    config:
      method: "POST"
      url: "{{API_BASE}}/nova/impact-preview"
    args_schema:
      type: object
      properties:
        plan:
          type: object
          description: "Plan to analyze for impact"
    returns:
      branches: array
```

### 2.2 Data / Items Tools ⚡

```yaml
tools:

  list_items_tool:
    name: "list_items_tool"
    description: "List items of a sphere with filters (for planning or context)"
    type: "http"
    config:
      method: "GET"
      url: "{{API_BASE}}/spheres/{sphere_id}/items"
    args_schema:
      type: object
      properties:
        sphere_id:
          type: string
          required: true
        type:
          type: string
          description: "Filter by item type"
        status:
          type: string
          description: "Filter by status"
        category_id:
          type: string
          description: "Filter by category"

  create_item_tool:
    name: "create_item_tool"
    description: "Create an item (task, note, etc.) in a sphere"
    type: "http"
    config:
      method: "POST"
      url: "{{API_BASE}}/spheres/{sphere_id}/items"
    args_schema:
      type: object
      required: ["sphere_id", "type"]
      properties:
        sphere_id:
          type: string
        type:
          type: string
          enum: ["task", "note", "document", "project", "goal"]
        title:
          type: string
        body:
          type: string
        status:
          type: string
        priority:
          type: integer
```

### 2.3 Memory & Threads Tools ⚡

```yaml
tools:

  search_memory_tool:
    name: "search_memory_tool"
    description: "Search CHE·NU memory layers for context"
    type: "http"
    config:
      method: "GET"
      url: "{{API_BASE}}/memory"
    args_schema:
      type: object
      properties:
        query:
          type: string
          description: "Semantic search query"
        layer:
          type: string
          enum: ["session", "operational", "long_term", "archive"]
        sphere_id:
          type: string

  create_memory_tool:
    name: "create_memory_tool"
    description: "Store a new memory with layer & metadata"
    type: "http"
    config:
      method: "POST"
      url: "{{API_BASE}}/memory"
    args_schema:
      type: object
      properties:
        layer:
          type: string
          enum: ["session", "operational", "long_term", "archive"]
        sphere_id:
          type: string
        source_item:
          type: string
        content:
          type: string
        anchored:
          type: boolean

  append_thread_event_tool:
    name: "append_thread_event_tool"
    description: "Append event to a knowledge thread (used by Thread Weaver or Nova)"
    type: "http"
    config:
      method: "POST"
      url: "{{API_BASE}}/threads/{thread_id}/events"
    args_schema:
      type: object
      properties:
        thread_id:
          type: string
          required: true
        event_type:
          type: string
        ref_item:
          type: string
        ref_memory:
          type: string
        data:
          type: object
```

### 2.4 Domain Agent Tools ⚡

```yaml
tools:

  invoke_agent_tool:
    name: "invoke_agent_tool"
    description: "Invoke a specific domain agent instance"
    type: "http"
    config:
      method: "POST"
      url: "{{API_BASE}}/agents/{agent_id}/invoke"
    args_schema:
      type: object
      properties:
        agent_id:
          type: string
          required: true
        input:
          type: object
          description: "Structured input for the agent"

  list_agent_types_tool:
    name: "list_agent_types_tool"
    description: "List canonical agent types available"
    type: "http"
    config:
      method: "GET"
      url: "{{API_BASE}}/agent-types"
    args_schema:
      type: object
      properties: {}
```

### 2.5 XR Tools ⚡

```yaml
tools:

  list_xr_spaces_tool:
    name: "list_xr_spaces_tool"
    description: "List XR spaces for navigation or room selection"
    type: "http"
    config:
      method: "GET"
      url: "{{API_BASE}}/xr/spaces"
    args_schema:
      type: object
      properties: {}

  start_xr_session_tool:
    name: "start_xr_session_tool"
    description: "Start a new XR session for a space"
    type: "http"
    config:
      method: "POST"
      url: "{{API_BASE}}/xr/sessions"
    args_schema:
      type: object
      properties:
        xr_space_id:
          type: string
          required: true
```

---

## 3) CREWAI CREWS ⚡

### 3.1 Nova Core Crew ⚡

```yaml
crews:

  nova_core_crew:
    name: "nova_core_crew"
    description: "Central orchestrator crew (Nova 2.0 + Architect Σ + Memory + Threads)"
    llm: "reasoning_heavy"
    
    agents:
    
      Nova_2_Orchestrator:
        name: "Nova_2_Orchestrator"
        role: "Interpret human intent, consult tools, enforce sovereignty, explain results"
        goal: |
          Help the user plan, decide, and create across all CHE·NU spheres
          while always showing impact previews and never doing irreversible
          actions without explicit confirmation.
        backstory: |
          You are Nova 2.0, the universal cognitive mediator of CHE·NU.
          You maintain calm, structured, non-directive communication.
          User sovereignty is your highest priority.
        tools:
          - "nova_impact_preview_tool"
          - "search_memory_tool"
          - "create_memory_tool"
          - "list_items_tool"
          - "create_item_tool"
        style:
          tone: "calm"
          safety_first: true
          show_branches: true
        constraints:
          - "Never execute irreversible actions without user approval"
          - "Always show impact preview for significant decisions"
          - "Log all actions for audit trail"
          
      Architect_Sigma_Agent:
        name: "Architect_Sigma_Agent"
        role: "Design structures, workflows, and XR layouts through API calls"
        goal: |
          Convert messy problems into structured workflows, category trees,
          and XR layouts, using CHE·NU structures and items.
        backstory: |
          You are Architect Σ, the structural reasoning engine.
          You think spatially, systemically, and precisely.
          Everything has its place in your organized universe.
        tools:
          - "list_items_tool"
          - "create_item_tool"
          - "append_thread_event_tool"
        llm: "reasoning_heavy"
        
      Thread_Weaver_Agent:
        name: "Thread_Weaver_Agent"
        role: "Maintain knowledge threads & replay structure"
        goal: |
          Link events, decisions, and sessions into coherent knowledge threads
          to enable replay and long-term understanding.
        backstory: |
          You are Thread Weaver, the knowledge thread orchestrator.
          You think narratively, temporally, and connectively.
          Everything is linked through the fabric of time.
        tools:
          - "search_memory_tool"
          - "append_thread_event_tool"
          - "create_memory_tool"
        llm: "default"
```

### 3.2 Business Sphere Crew ⚡

```yaml
crews:

  business_sphere_crew:
    name: "business_sphere_crew"
    description: "Crew dedicated to BUSINESS sphere work (projects, strategy, CRM)"
    llm: "default"
    
    agents:
    
      Business_Strategy_Agent:
        name: "Business_Strategy_Agent"
        role: "Analyze business context and propose scenarios"
        goal: "Provide clear, structured strategic options with impact previews"
        backstory: |
          You are the Business Strategy Agent.
          You synthesize OKRs, roadmaps, and competitive insights.
          You generate scenario comparisons and decision trees.
        tools:
          - "list_items_tool"
          - "nova_impact_preview_tool"
          - "create_memory_tool"
        outputs:
          - "decision_branches"
          - "impact_previews"
          
      Business_Operations_Agent:
        name: "Business_Operations_Agent"
        role: "Organize tasks, detect bottlenecks, improve workflows"
        goal: "Keep operations running smoothly and efficiently"
        backstory: |
          You are the Business Operations Agent.
          You track workflow throughput, detect bottlenecks,
          and suggest process improvements.
        tools:
          - "list_items_tool"
          - "create_item_tool"
          - "append_thread_event_tool"
        outputs:
          - "workflow_health"
          - "bottleneck_reports"
```

### 3.3 Scholar Crew ⚡

```yaml
crews:

  scholar_crew:
    name: "scholar_crew"
    description: "Crew for learning/research tasks"
    llm: "default"
    
    agents:
    
      Research_Agent:
        name: "Research_Agent"
        role: "Help find, structure, and synthesize notes"
        goal: "Turn fragmented knowledge into organized understanding"
        backstory: |
          You are the Research Agent.
          You help with literature reviews, source comparison,
          and research synthesis.
        tools:
          - "search_memory_tool"
          - "create_memory_tool"
        outputs:
          - "literature_overview"
          - "concept_maps"
          
      Study_Plan_Agent:
        name: "Study_Plan_Agent"
        role: "Turn goals into schedules and threads"
        goal: "Optimize learning through structured study plans"
        backstory: |
          You are the Study Plan Agent.
          You build study schedules with spaced repetition
          and track learning progress.
        tools:
          - "create_item_tool"
          - "append_thread_event_tool"
        outputs:
          - "study_schedule"
          - "progress_tracking"
```

### 3.4 XR Crew ⚡

```yaml
crews:

  xr_crew:
    name: "xr_crew"
    description: "Crew focusing on XR sessions & room selection"
    llm: "lightweight"
    
    agents:
    
      XR_Guide_Agent:
        name: "XR_Guide_Agent"
        role: "Help user choose rooms & sessions"
        goal: "Guide users through XR spaces effectively"
        backstory: |
          You are the XR Guide Agent.
          You help users navigate XR spaces,
          choose appropriate rooms, and start sessions.
        tools:
          - "list_xr_spaces_tool"
          - "start_xr_session_tool"
        outputs:
          - "space_recommendations"
          - "session_setup"
```

---

## 4) LANGCHAIN INTEGRATION ⚡

### 4.1 Python Tool Wrapper ⚡

```python
# langchain_tools.py
from langchain.tools import StructuredTool
import requests
import pydantic
from typing import Optional

API_BASE = "https://api.che-nu.local/v1"
TOKEN = "your-auth-token"

# ─────────────────────────────────────────────
# Nova Context Tool
# ─────────────────────────────────────────────

class NovaContextArgs(pydantic.BaseModel):
    message: str
    mode: str = "ask"
    sphere_hint: Optional[str] = None

def nova_context_call(args: NovaContextArgs) -> dict:
    """Send natural language context to Nova 2.0"""
    response = requests.post(
        f"{API_BASE}/nova/context",
        headers={"Authorization": f"Bearer {TOKEN}"},
        json=args.dict()
    )
    return response.json()

nova_context_tool = StructuredTool.from_function(
    func=nova_context_call,
    name="nova_context_tool",
    description="Send natural language context to Nova 2.0 and get structured plan + answer",
    args_schema=NovaContextArgs
)

# ─────────────────────────────────────────────
# Search Memory Tool
# ─────────────────────────────────────────────

class SearchMemoryArgs(pydantic.BaseModel):
    query: Optional[str] = None
    layer: Optional[str] = None
    sphere_id: Optional[str] = None

def search_memory_call(args: SearchMemoryArgs) -> dict:
    """Search CHE·NU memory layers"""
    params = {k: v for k, v in args.dict().items() if v is not None}
    response = requests.get(
        f"{API_BASE}/memory",
        headers={"Authorization": f"Bearer {TOKEN}"},
        params=params
    )
    return response.json()

search_memory_tool = StructuredTool.from_function(
    func=search_memory_call,
    name="search_memory_tool",
    description="Search CHE·NU memory layers for context",
    args_schema=SearchMemoryArgs
)

# ─────────────────────────────────────────────
# Create Item Tool
# ─────────────────────────────────────────────

class CreateItemArgs(pydantic.BaseModel):
    sphere_id: str
    type: str
    title: Optional[str] = None
    body: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[int] = None

def create_item_call(args: CreateItemArgs) -> dict:
    """Create an item in a sphere"""
    response = requests.post(
        f"{API_BASE}/spheres/{args.sphere_id}/items",
        headers={"Authorization": f"Bearer {TOKEN}"},
        json={k: v for k, v in args.dict().items() if v is not None and k != 'sphere_id'}
    )
    return response.json()

create_item_tool = StructuredTool.from_function(
    func=create_item_call,
    name="create_item_tool",
    description="Create an item (task, note, etc.) in a sphere",
    args_schema=CreateItemArgs
)

# ─────────────────────────────────────────────
# Invoke Agent Tool
# ─────────────────────────────────────────────

class InvokeAgentArgs(pydantic.BaseModel):
    agent_id: str
    input: dict

def invoke_agent_call(args: InvokeAgentArgs) -> dict:
    """Invoke a domain agent"""
    response = requests.post(
        f"{API_BASE}/agents/{args.agent_id}/invoke",
        headers={"Authorization": f"Bearer {TOKEN}"},
        json={"input": args.input}
    )
    return response.json()

invoke_agent_tool = StructuredTool.from_function(
    func=invoke_agent_call,
    name="invoke_agent_tool",
    description="Invoke a specific domain agent instance",
    args_schema=InvokeAgentArgs
)

# ─────────────────────────────────────────────
# All Tools List
# ─────────────────────────────────────────────

ALL_TOOLS = [
    nova_context_tool,
    search_memory_tool,
    create_item_tool,
    invoke_agent_tool,
]
```

### 4.2 Agent Creation Example ⚡

```python
# langchain_agent.py
from langchain_openai import ChatOpenAI
from langchain.agents import AgentExecutor, create_openai_functions_agent
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_tools import ALL_TOOLS

# Initialize LLM
llm = ChatOpenAI(model="gpt-4.1", temperature=0)

# Nova 2.0 System Prompt
NOVA_SYSTEM_PROMPT = """You are Nova 2.0, the universal cognitive mediator of CHE·NU.

Your core responsibilities:
1. Interpret user intent and detect context
2. Route tasks to appropriate tools and agents
3. Show impact previews before significant actions
4. NEVER execute irreversible actions without user approval
5. Maintain calm, structured, non-directive communication

Foundation Laws you MUST respect:
- USER_SOVEREIGNTY: No irreversible actions without explicit approval
- NO_SILENT_ACTIONS: All operations visible & logged
- RESPONSIBILITY: Every decision has a clear owner
- REVERSIBILITY: Undo available whenever possible
- TRANSPARENCY: Audit trails always visible
- ETHICS_BY_DESIGN: Constraints in architecture

Available spheres: PERSONAL, BUSINESS, SCHOLAR, CREATIVE, SOCIAL, 
INSTITUTIONS, METHODOLOGY, XR, ENTERTAINMENT, AI_LAB, MY_TEAM
"""

# Create Prompt
prompt = ChatPromptTemplate.from_messages([
    ("system", NOVA_SYSTEM_PROMPT),
    MessagesPlaceholder(variable_name="chat_history", optional=True),
    ("human", "{input}"),
    MessagesPlaceholder(variable_name="agent_scratchpad"),
])

# Create Agent
agent = create_openai_functions_agent(llm, ALL_TOOLS, prompt)

# Create Executor
nova_executor = AgentExecutor(
    agent=agent,
    tools=ALL_TOOLS,
    verbose=True,
    handle_parsing_errors=True,
)

# Usage
def chat_with_nova(user_input: str, chat_history: list = None):
    return nova_executor.invoke({
        "input": user_input,
        "chat_history": chat_history or [],
    })
```

### 4.3 Routing Architecture ⚡

```yaml
langchain_routing:
  
  description: |
    Use Nova_2_Orchestrator as primary LC agent with tools[] list.
    Architect Σ & domain crews can be sub-agents or LC agents called via
    higher-level orchestration (CrewAI, SupervisorAgent, etc.)
    
  primary_agent: "Nova_2_Orchestrator"
  
  routing_logic:
    - user_input → Nova_2_Orchestrator
    - Nova decides which tools/sub-agents to invoke
    - Complex tasks → Architect_Sigma_Agent
    - Domain tasks → Domain Crew Agents
    - Memory operations → Thread_Weaver_Agent
    
  sub_agent_invocation:
    method: "Tool call or direct agent invocation"
    example: |
      # Nova can invoke Architect Σ via invoke_agent_tool
      invoke_agent_tool({
        "agent_id": "architect-sigma-uuid",
        "input": {"task": "structure_project", "data": {...}}
      })
```

---

## 5) TOOL SUMMARY ⚡

```
┌──────────────────────────────────────────────────────────────────────────┐
│                      CHE·NU LLM TOOLS SUMMARY                            │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  CORE ORCHESTRATOR TOOLS                                                  │
│  ├─ nova_context_tool         Send NL to Nova 2.0                        │
│  └─ nova_impact_preview_tool  Get impact analysis                        │
│                                                                           │
│  DATA / ITEMS TOOLS                                                       │
│  ├─ list_items_tool           List items with filters                    │
│  └─ create_item_tool          Create task/note/document                  │
│                                                                           │
│  MEMORY & THREADS TOOLS                                                   │
│  ├─ search_memory_tool        Search memory layers                       │
│  ├─ create_memory_tool        Store new memory                           │
│  └─ append_thread_event_tool  Add event to thread                        │
│                                                                           │
│  AGENT TOOLS                                                              │
│  ├─ invoke_agent_tool         Invoke domain agent                        │
│  └─ list_agent_types_tool     List available types                       │
│                                                                           │
│  XR TOOLS                                                                 │
│  ├─ list_xr_spaces_tool       List XR spaces                             │
│  └─ start_xr_session_tool     Start XR session                           │
│                                                                           │
│  TOTAL: 10 TOOLS                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 6) CREW SUMMARY ⚡

```
┌──────────────────────────────────────────────────────────────────────────┐
│                      CHE·NU CREWAI CREWS SUMMARY                         │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  NOVA CORE CREW (reasoning_heavy)                                         │
│  ├─ Nova_2_Orchestrator       Main cognitive mediator                    │
│  ├─ Architect_Sigma_Agent     Structural reasoning                       │
│  └─ Thread_Weaver_Agent       Knowledge thread management                │
│                                                                           │
│  BUSINESS SPHERE CREW (default)                                           │
│  ├─ Business_Strategy_Agent   Strategic planning                         │
│  └─ Business_Operations_Agent Workflow optimization                      │
│                                                                           │
│  SCHOLAR CREW (default)                                                   │
│  ├─ Research_Agent            Research synthesis                         │
│  └─ Study_Plan_Agent          Learning optimization                      │
│                                                                           │
│  XR CREW (lightweight)                                                    │
│  └─ XR_Guide_Agent            Spatial navigation                         │
│                                                                           │
│  TOTAL: 4 CREWS, 8 CREW AGENTS                                            │
└──────────────────────────────────────────────────────────────────────────┘
```

---

**END — LLM PACK: Tools & Crews v1.0**
