# CHE·NU — UI/UX DESIGN SYSTEM (v1.0 Canonical)
**VERSION:** UI.v1.0-canonical  
**MODE:** PRODUCTION / DESIGN-SYSTEM / COMPONENTS

---

## 1) DESIGN PHILOSOPHY ⚡

```yaml
CHE-NU_UI_UX:
  version: "1.0-canonical"
  
  philosophy: |
    The UI must express clarity, sovereignty, structure, and calm.
    No dark patterns. No noise. Everything visible, reversible,
    explainable, and user-controlled.
    
  core_principles:
    - hierarchy_visible        # Clear information hierarchy
    - elegance_over_density    # Clean, not cluttered
    - reversible_actions       # Everything can be undone
    - explicit_ownership       # Clear responsibility
    - strong_theming_per_sphere # Visual sphere identity
    - universal_navigation_from_center # Orbit-based nav
    - seamless_2D_to_3D_transition # Smooth XR transition
    - agent_presence_non_intrusive # Subtle agent UI
    - timeline_and_threads_always_reachable # Context accessible
```

---

## 2) NAVIGATION HIERARCHY ⚡

```
┌─────────────────────────────────────────────────────────────────┐
│                    CHE·NU NAVIGATION FLOW                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  HOME                                                            │
│    │                                                             │
│    └──► ORBIT VIEW (12 Spheres)                                 │
│              │                                                   │
│              └──► SPHERE VIEW                                   │
│                       │                                          │
│                       └──► CATEGORY TREE                        │
│                                │                                 │
│                                └──► ITEM VIEW                   │
│                                        │                         │
│                                        ├──► AGENT PANEL         │
│                                        │                         │
│                                        ├──► THREAD VIEW         │
│                                        │                         │
│                                        ├──► TIMELINE / REPLAY   │
│                                        │                         │
│                                        └──► XR PORTAL           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3) COLOR SYSTEM ⚡

### 3.1 Base Colors ⚡

```yaml
color_system:

  neutral:
    bg: "#0E0F12"          # Deep background
    surface: "#1A1C20"      # Card/panel background
    elevated: "#22252B"     # Elevated elements
    
  text:
    primary: "#FFFFFF"      # Main text
    secondary: "#C8C8C8"    # Secondary text
    muted: "#888888"        # Disabled/hint text
    
  borders:
    default: "#2C2F33"      # Standard borders
```

### 3.2 Sphere Colors ⚡

```yaml
spheres:
  personal:      "#76E6C7"   # Teal/Mint
  business:      "#5BA9FF"   # Blue
  scholar:       "#E0C46B"   # Gold/Yellow
  creative:      "#FF8BAA"   # Pink
  social:        "#66D06F"   # Green
  institutions:  "#D08FFF"   # Purple
  methodology:   "#59D0C6"   # Cyan
  xr:            "#8EC8FF"   # Light Blue
  entertainment: "#FFB04D"   # Orange
  ai_lab:        "#FF5FFF"   # Magenta
  my_team:       "#5ED8FF"   # Sky Blue
```

### 3.3 Color Palette Visual ⚡

```
┌─────────────────────────────────────────────────────────────────┐
│                    SPHERE COLOR PALETTE                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ████ PERSONAL      #76E6C7    ████ BUSINESS     #5BA9FF       │
│                                                                  │
│  ████ SCHOLAR       #E0C46B    ████ CREATIVE     #FF8BAA       │
│                                                                  │
│  ████ SOCIAL        #66D06F    ████ INSTITUTIONS #D08FFF       │
│                                                                  │
│  ████ METHODOLOGY   #59D0C6    ████ XR           #8EC8FF       │
│                                                                  │
│  ████ ENTERTAINMENT #FFB04D    ████ AI_LAB       #FF5FFF       │
│                                                                  │
│  ████ MY_TEAM       #5ED8FF                                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4) TYPOGRAPHY ⚡

```yaml
typography:
  
  font_family: "Inter, SF Pro, Roboto"
  
  sizes:
    h1: "32px"      # Main titles
    h2: "24px"      # Section headers
    h3: "18px"      # Subsections
    body: "15px"    # Regular text
    small: "13px"   # Captions, hints
    
  weights:
    regular: 400
    medium: 500
    semibold: 600
    bold: 700
    
  line_heights:
    tight: 1.2
    normal: 1.5
    relaxed: 1.7
```

---

## 5) LAYOUT SYSTEM ⚡

```yaml
layout:

  spacing:
    xs: "4px"       # Tight spacing
    sm: "8px"       # Small gaps
    md: "16px"      # Standard spacing
    lg: "24px"      # Section spacing
    xl: "40px"      # Large gaps
    
  corner_radius:
    sm: "6px"       # Buttons, small elements
    md: "10px"      # Cards, panels
    lg: "16px"      # Modals, large containers
    
  shadow:
    default: "0px 4px 12px rgba(0,0,0,0.35)"
    elevated: "0px 8px 24px rgba(0,0,0,0.45)"
    subtle: "0px 2px 6px rgba(0,0,0,0.25)"
```

---

## 6) COMPONENT: ORBIT NAVIGATION ⚡

### 6.1 Definition ⚡

```yaml
orbit_navigation:
  description: "A radial orbit UI showing the 12 spheres"
  
  structure:
    center: "Nova 2.0 access point"
    orbit_ring: "11 sphere nodes in circular arrangement"
    outer_ring: "Quick actions & search"
    
  interaction:
    tap_or_click_sphere: "Zoom into sphere"
    long_press: "View sphere options"
    drag: "Rotate orbit"
    scroll: "Zoom levels (overview → detail)"
    center_tap: "Open Nova panel"
    
  states:
    default: "Dimmed spheres with subtle glow"
    focused: "Highlighted sphere + muted others"
    cross_links: "Luminous threads between related spheres"
    
  animations:
    hover: "Gentle scale up (1.1x)"
    select: "Pulse + zoom transition"
    rotate: "Smooth orbital rotation"
```

### 6.2 Visual Structure ⚡

```
┌─────────────────────────────────────────────────────────────────┐
│                       ORBIT NAVIGATION                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│                        ○ SCHOLAR                                 │
│                   ○                  ○                           │
│               PERSONAL            BUSINESS                       │
│                                                                  │
│           ○                              ○                       │
│       CREATIVE                       SOCIAL                      │
│                                                                  │
│                      ┌─────────┐                                │
│           ○          │  NOVA   │          ○                     │
│       INSTITUTIONS   │   2.0   │     METHODOLOGY                │
│                      └─────────┘                                │
│                                                                  │
│           ○                              ○                       │
│          XR                        ENTERTAINMENT                 │
│                                                                  │
│               ○                  ○                               │
│            AI_LAB             MY_TEAM                           │
│                                                                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7) COMPONENT: SPHERE HOME SCREEN ⚡

### 7.1 Definition ⚡

```yaml
sphere_home:

  header:
    icon: "sphere_color_circle"
    title: "Sphere Name"
    contextual_actions:
      - search: "Search within sphere"
      - create_item: "Quick create"
      - view_threads: "Knowledge threads"
      
  main_sections:
  
    quick_actions:
      layout: "Horizontal button row"
      items:
        - new_task
        - new_note
        - new_memory
        - start_xr_session
        
    categories_panel:
      type: "collapsible_tree"
      interactions:
        - expand: "Show children"
        - collapse: "Hide children"
        - drag_to_reorder: "Reorganize structure"
      visual: "Indented tree with expand icons"
      
    items_feed:
      filters:
        - type: "task, note, document, etc."
        - status: "active, completed, archived"
        - agent_assigned: "Which agent owns it"
        - priority: "1-5"
      views:
        - list: "Compact list view"
        - board: "Kanban-style columns"
        - timeline: "Chronological view"
```

### 7.2 Layout ⚡

```
┌─────────────────────────────────────────────────────────────────┐
│  ○ BUSINESS                              🔍  ➕  📚             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐                        │
│  │+ Task│  │+ Note│  │+Memory│ │+ XR  │   ← Quick Actions      │
│  └──────┘  └──────┘  └──────┘  └──────┘                        │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ 📁 Categories                                    [▼]        ││
│  │   ├─ 📁 Clients                                             ││
│  │   │    ├─ 📁 Active                                         ││
│  │   │    └─ 📁 Archived                                       ││
│  │   ├─ 📁 Projects                                            ││
│  │   └─ 📁 Finance                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Type: All ▼  Status: Active ▼  Priority: All ▼   [≡][▦][📅]││
│  ├─────────────────────────────────────────────────────────────┤│
│  │ ☑ Q1 Strategy Review          ★★★   Due: Jan 15   🤖       ││
│  │ ☐ Client proposal draft       ★★    Due: Jan 12   🤖       ││
│  │ ☐ Budget analysis             ★★★   Due: Jan 20   🤖       ││
│  │ ...                                                         ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 8) COMPONENT: ITEM VIEW ⚡

### 8.1 Definition ⚡

```yaml
item_view:

  structure:
  
    top_bar:
      - back_button: "Return to previous view"
      - type_icon: "Visual item type indicator"
      - title_field: "Editable title"
      
    body:
      - rich_text_body: "Main content editor"
      - category_selector: "Assign to category"
      - agent_owner_badge: "Which agent manages this"
      - timeline_history: "Item history timeline"
      - linked_items_block: "Related items"
      - memory_anchors_section: "Connected memories"
      
    footer:
      - save: "Save changes"
      - archive: "Archive item"
      - delegate_to_agent: "Assign to agent"
      - replay_item_history: "View full history"
```

### 8.2 Layout ⚡

```
┌─────────────────────────────────────────────────────────────────┐
│  ← Back    📋 Task    Q1 Strategy Review                   ✓ ⋮ │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                                                             ││
│  │  Review the Q1 strategy document and prepare               ││
│  │  recommendations for the board meeting.                    ││
│  │                                                             ││
│  │  Key points:                                                ││
│  │  - Revenue targets                                          ││
│  │  - Market expansion                                         ││
│  │  - Resource allocation                                      ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  Category: 📁 Projects > Q1 Planning                            │
│  Owner: 🤖 business.strategy                                    │
│  Priority: ★★★                                                  │
│  Due: January 15, 2025                                          │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ 🔗 Linked Items                                             ││
│  │   • Budget Analysis (Task)                                  ││
│  │   • Q1 Strategy Doc (Document)                              ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ 📌 Memory Anchors                                           ││
│  │   • "Board prefers conservative targets" (long_term)        ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│  [Save]    [Archive]    [Delegate to Agent]    [View History]  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 9) COMPONENT: AGENT PRESENCE UI ⚡

### 9.1 Agent Avatar ⚡

```yaml
agent_presence:

  style:
    avatar: "minimal_glow_orb"
    size: "32px default, 48px expanded"
    
    aura_indicator:
      glow_intensity: "Based on trust level (0-100%)"
      pulse: "Based on activity state"
      color: "Agent domain color"
      
  behaviors:
    agent_speaks: "Orb vibrates gently, message appears"
    agent_waiting: "Slow pulse animation"
    agent_uncertain: "Flickering saturation"
    agent_error: "Red pulse"
    agent_success: "Green flash"
    
  access:
    tap_or_click: "Open agent panel"
    drag_into_item: "Delegate task to agent"
    long_press: "Quick agent actions"
```

### 9.2 Agent Panel ⚡

```yaml
agent_panel:

  tabs:
    - overview: "Agent summary and current state"
    - responsibilities: "What this agent does"
    - recent_actions: "Action history"
    - trust_metrics: "Performance indicators"
    
  quick_actions:
    - invoke: "Ask agent to do something"
    - pass_context: "Share context with agent"
    - show_history: "Full action log"
    
  metrics:
    trust:
      accuracy: "% of correct outputs"
      approval_rate: "% of approved actions"
      consistency: "% of consistent behavior"
    logs:
      visible_actions: true
      audit_trail: true
```

### 9.3 Agent Panel Layout ⚡

```
┌─────────────────────────────────────────────────────────────────┐
│  🤖 business.strategy                                      [×]  │
├─────────────────────────────────────────────────────────────────┤
│  [Overview] [Responsibilities] [Actions] [Trust]                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Role: Strategic planning & scenario modeling                   │
│  Sphere: BUSINESS                                               │
│  Status: ● Active                                               │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Trust Metrics                                               ││
│  │   Accuracy:     ████████░░  82%                            ││
│  │   Approval:     █████████░  91%                            ││
│  │   Consistency:  ████████░░  85%                            ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Recent Actions                                              ││
│  │   • Generated Q1 scenarios (2h ago)                        ││
│  │   • Analyzed market data (yesterday)                       ││
│  │   • Created decision branches (2 days ago)                 ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│  [Invoke Agent]    [Pass Context]    [View Full History]       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 10) COMPONENT: NOVA 2.0 PANEL ⚡

### 10.1 Definition ⚡

```yaml
nova_panel:

  input_box:
    placeholder: "Ask Nova anything…"
    modes:
      - ask: "General questions"
      - decide: "Decision support"
      - plan: "Planning assistance"
      - create: "Content creation"
      - debug: "Troubleshooting"
      
  body:
    sections:
      - interpretation: "Nova explains its understanding"
      - plan_preview: "Proposed action plan"
      - agent_candidates: "Agents that could help"
      - impact_preview_button: "See impact analysis"
      - decision_branches: "Options A, B, C"
      - explainability_zone: "Why Nova proposes this"
      
  confirmations:
    irreversible_actions: "Require explicit button"
    preview_required: true
    sovereignty_checkpoint: true
```

### 10.2 Nova Panel Layout ⚡

```
┌─────────────────────────────────────────────────────────────────┐
│  ◉ NOVA 2.0                                                [×]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Ask Nova anything…                                    [▼ ask]││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ 💭 Understanding                                            ││
│  │                                                             ││
│  │ You want to plan your Q1 strategy review, focusing on      ││
│  │ budget allocation and market expansion decisions.          ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ 📋 Proposed Plan                                            ││
│  │                                                             ││
│  │ 1. Gather financial data from business.finance             ││
│  │ 2. Generate scenario analysis with business.strategy       ││
│  │ 3. Create decision branches for board review               ││
│  │ 4. Prepare presentation document                           ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ 🤖 Suggested Agents                                         ││
│  │   • business.strategy                                       ││
│  │   • business.finance                                        ││
│  │   • business.operations                                     ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ ⚡ Decision Branches                                        ││
│  │                                                             ││
│  │   [A] Conservative approach - Low risk, steady growth      ││
│  │   [B] Balanced approach - Moderate risk, good growth       ││
│  │   [C] Aggressive approach - High risk, high growth         ││
│  │                                                             ││
│  │   [View Impact Preview]                                     ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ ❓ Why This Plan                                            ││
│  │                                                             ││
│  │ Based on your previous Q1 reviews and board preferences    ││
│  │ for data-driven decisions, this approach ensures all       ││
│  │ stakeholders have the information they need.               ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│  [Cancel]                           [Execute Plan ▶]            │
│                    ⚠️ Will create 4 items - Confirm?            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 11) COMPONENT: ARCHITECT Σ PANEL ⚡

### 11.1 Definition ⚡

```yaml
architect_panel:

  visuals:
    - tree_view: "Mega-tree visualization of structures"
    - workflow_map: "Visual workflow diagram"
    - relationship_graph: "Entity relationship view"
    
  interactions:
    - auto_fix_structure: "Automatic cleanup"
    - propose_reorg: "Suggest reorganization"
    - validate_dependencies: "Check integrity"
    
  states:
    clean:
      indicator: "Green"
      message: "Everything coherent"
    warning:
      indicator: "Yellow"
      message: "Fragmentation detected"
    error:
      indicator: "Red"
      message: "Conflicting structures"
```

### 11.2 Architect Panel Layout ⚡

```
┌─────────────────────────────────────────────────────────────────┐
│  Σ ARCHITECT                                               [×]  │
├─────────────────────────────────────────────────────────────────┤
│  [Tree View] [Workflow Map] [Relationships]                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Structure Health: ● Clean                                      │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                                                             ││
│  │  BUSINESS                                                   ││
│  │    ├── Clients                                              ││
│  │    │     ├── Active (12)                                    ││
│  │    │     └── Archived (45)                                  ││
│  │    ├── Projects                                             ││
│  │    │     ├── Q1 Planning (3)                                ││
│  │    │     ├── Product Launch (8)                             ││
│  │    │     └── Operations (5)                                 ││
│  │    └── Finance                                              ││
│  │          ├── Budgets (4)                                    ││
│  │          └── Reports (12)                                   ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Suggestions                                                 ││
│  │   • 3 orphan items detected in Projects                    ││
│  │   • Consider merging "Q1 Planning" with "Budgets"          ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│  [Auto-Fix]    [Propose Reorg]    [Validate All]               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 12) COMPONENT: TIMELINE & REPLAY VIEW ⚡

### 12.1 Definition ⚡

```yaml
timeline_view:

  modes:
    - timeline: "Chronological event view"
    - decision_replay: "Replay decision points"
    - narrative_replay: "Story-like playback"
    - diff_replay: "Compare changes over time"
    
  components:
    scrubber: "Smooth horizontal timeline"
    markers:
      - decisions: "🔀 Branch points"
      - memories: "💭 Memory anchors"
      - xr_sessions: "🥽 XR sessions"
      - agent_actions: "🤖 Agent activities"
      
  actions:
    - replay_from_here: "Start replay at point"
    - compare_two_points: "Diff between moments"
    - annotate_event: "Add notes to event"
    - pin_event_to_thread: "Link to knowledge thread"
```

### 12.2 Timeline Layout ⚡

```
┌─────────────────────────────────────────────────────────────────┐
│  📅 TIMELINE                                               [×]  │
├─────────────────────────────────────────────────────────────────┤
│  [Timeline] [Decision Replay] [Narrative] [Diff]                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Jan 1    Jan 5     Jan 10    Jan 15    Jan 20    Today        │
│  ──●────────●─────────●─────────●─────────●─────────●──►        │
│    │        │         │         │         │         │           │
│    🔀       💭        🤖        🔀        🥽        💭          │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Selected: Jan 15 - Decision Point                          ││
│  │                                                             ││
│  │ 🔀 Q1 Strategy Decision                                    ││
│  │    Branch selected: [B] Balanced approach                  ││
│  │    Impact: 3 new projects created                          ││
│  │    Approved by: User                                        ││
│  │                                                             ││
│  │ [Replay] [Compare with Jan 10] [Add Note] [Pin to Thread]  ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Events on Jan 15                                            ││
│  │   • 09:15 - Nova generated decision branches               ││
│  │   • 10:30 - User reviewed impact preview                   ││
│  │   • 11:00 - Branch B selected                              ││
│  │   • 11:05 - business.strategy executed plan                ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 13) COMPONENT: KNOWLEDGE THREADS VIEW ⚡

### 13.1 Definition ⚡

```yaml
threads_view:

  style:
    thread_line: "Luminescent path connecting events"
    event_nodes: "Capsules on the timeline"
    
  interactions:
    - click_event: "Open its source"
    - drag_event: "Reassign to another thread"
    - add_event: "Create new event"
    - merge_threads: "Combine threads"
    
  views:
    - compact: "Dense overview"
    - narrative: "Story-like flow"
    - tree: "Hierarchical structure"
```

### 13.2 Threads Layout ⚡

```
┌─────────────────────────────────────────────────────────────────┐
│  📚 KNOWLEDGE THREADS                                      [×]  │
├─────────────────────────────────────────────────────────────────┤
│  [Compact] [Narrative] [Tree]                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ 🧵 FACTUAL (Business Strategy)                              ││
│  │                                                             ││
│  │    ●────●────●────●────●                                    ││
│  │    │    │    │    │    │                                    ││
│  │   Q4   Q1   Market Budget Board                            ││
│  │   Rev  Goals Analysis Draft  Pres                          ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ 🧵 CONTEXTUAL (Client Relations)                            ││
│  │                                                             ││
│  │    ●────●────●                                              ││
│  │    │    │    │                                              ││
│  │   First Follow Risk                                        ││
│  │   Meet  Up    Flag                                         ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ 🧵 INTENT_SAFE (Technical Decisions)                        ││
│  │                                                             ││
│  │    ●────●────●────●                                         ││
│  │    │    │    │    │                                         ││
│  │   Arch  Stack Deploy Scale                                  ││
│  │   Plan  Choice  v1   Plan                                   ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│  [Add Event]    [Merge Threads]    [Export Thread]             │
└─────────────────────────────────────────────────────────────────┘
```

---

## 14) COMPONENT: XR TRANSITION UI ⚡

### 14.1 Definition ⚡

```yaml
xr_transition:
  description: "2D → XR smooth transformation"
  
  stages:
    1_dim_ui: "Fade current 2D interface"
    2_center_focus: "Focus on transition point"
    3_sphere_merge_animation: "Spheres converge"
    4_enter_room_portal: "Portal opens to XR space"
    
  essential_controls:
    left: "Room navigation"
    right: "Participants/agents"
    bottom: "Timeline"
    top: "Context needle"
    
  duration: "1.5s total transition"
```

### 14.2 XR Controls Layout ⚡

```
┌─────────────────────────────────────────────────────────────────┐
│                    XR IMMERSIVE VIEW                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                     CONTEXT NEEDLE                          ││
│  │              "Q1 Strategy Review Meeting"                   ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌──────────┐                              ┌──────────┐         │
│  │          │                              │          │         │
│  │   ROOM   │                              │ AGENTS & │         │
│  │   NAV    │                              │ PEOPLE   │         │
│  │          │                              │          │         │
│  │  • Main  │      ╔═══════════════╗      │  👤 You  │         │
│  │  • Side  │      ║               ║      │  🤖 Nova │         │
│  │  • Focus │      ║   XR SPACE    ║      │  🤖 Arch │         │
│  │          │      ║               ║      │          │         │
│  │          │      ╚═══════════════╝      │          │         │
│  └──────────┘                              └──────────┘         │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                       TIMELINE                              ││
│  │  ────●────────●────────●────────●────────●────►             ││
│  │     Start   Topic1   Topic2   Decision  Now                ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 15) MOBILE UX ⚡

### 15.1 Mobile Patterns ⚡

```yaml
mobile_responsiveness:

  patterns:
    - bottom_nav_for_spheres: "Tab bar with sphere icons"
    - swipe_for_agents: "Swipe to access agent panel"
    - long_press_for_context_menu: "Actions on hold"
    - foldable_optimized_layout: "Adaptive to foldables"
    
  navigation:
    bottom_bar:
      - home_orbit
      - current_sphere
      - nova_access
      - threads
      - profile
      
  gestures:
    swipe_right: "Back/previous"
    swipe_left: "Agent panel"
    swipe_up: "Quick actions"
    swipe_down: "Search"
    pinch: "Zoom timeline"
```

### 15.2 Mobile Layout ⚡

```
┌─────────────────────────┐
│  ○ BUSINESS       🔍 ⋮ │
├─────────────────────────┤
│                         │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐│
│  │+📋│ │+📝│ │+💭│ │+🥽││
│  └───┘ └───┘ └───┘ └───┘│
│                         │
│  📁 Categories    [▼]   │
│    ├─ Clients           │
│    └─ Projects          │
│                         │
│  ┌─────────────────────┐│
│  │ ☑ Q1 Review   ★★★  ││
│  │ ☐ Proposal    ★★   ││
│  │ ☐ Budget      ★★★  ││
│  │ ...                 ││
│  └─────────────────────┘│
│                         │
├─────────────────────────┤
│  🏠  ○  ◉  📚  👤      │
│ Home Sph Nova Thrd Prof │
└─────────────────────────┘
```

---

## 16) COMPONENT SUMMARY ⚡

```
┌─────────────────────────────────────────────────────────────────┐
│                    CHE·NU UI COMPONENTS                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  NAVIGATION                                                      │
│  ├─ Orbit Navigation      Radial sphere selector                │
│  └─ Mobile Bottom Nav     Tab-based navigation                  │
│                                                                  │
│  CONTENT VIEWS                                                   │
│  ├─ Sphere Home           Main sphere dashboard                 │
│  ├─ Category Tree         Hierarchical structure                │
│  ├─ Item View             Universal item interface              │
│  └─ Items Feed            Filterable list/board/timeline        │
│                                                                  │
│  AGENT UI                                                        │
│  ├─ Agent Presence        Glow orb indicator                    │
│  ├─ Agent Panel           Agent details & actions               │
│  └─ Nova Panel            Core orchestrator interface           │
│                                                                  │
│  STRUCTURE                                                       │
│  ├─ Architect Panel       Structure visualization               │
│  └─ Threads View          Knowledge thread management           │
│                                                                  │
│  TEMPORAL                                                        │
│  ├─ Timeline View         Chronological events                  │
│  └─ Replay View           Decision/session replay               │
│                                                                  │
│  IMMERSIVE                                                       │
│  ├─ XR Transition         2D→3D smooth transition               │
│  └─ XR Controls           In-VR navigation                      │
│                                                                  │
│  TOTAL: 12 MAJOR COMPONENTS                                      │
└─────────────────────────────────────────────────────────────────┘
```

---

**END — UI/UX DESIGN SYSTEM v1.0**
