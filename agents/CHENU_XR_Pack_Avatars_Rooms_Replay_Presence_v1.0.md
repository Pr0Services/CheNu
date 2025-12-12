# CHE·NU — XR PACK: Avatars, Rooms, Replay, Presence (v1.0 Canonical)
**VERSION:** XR.v1.0-canonical  
**MODE:** PRODUCTION / IMMERSIVE / SPATIAL

---

## 1) PRINCIPES XR ⚡

```yaml
CHE-NU_XR_PACK:
  version: "1.0-canonical"
  description: "Canonical XR architecture for CHE·NU. Includes Avatars, Rooms, Replay, Presence, Interactions."

  principles:
    - xr_is_extension_not_separate_ui
    - transitions_are_smooth_and_reversible
    - sovereignty_respected_in_xr
    - agent_presence_is_non_intrusive
    - spatial_memory_enhances_understanding
    - rooms_reflect_purpose_not_decoration
    - replay_is_first_class_feature
```

---

## 2) XR AVATAR SYSTEM ⚡

### 2.1 Design ⚡

```yaml
avatars:
  style: "Minimal luminous silhouette"
  
  design_goals:
    - avoid uncanny valley
    - identity via silhouette + aura color
    - readable gestures
    - low cognitive load
    
  elements:
    head: "Soft sphere with faint glow"
    body: "Transparent abstract form"
    hands: "Light contours for interaction"
```

### 2.2 États d'Avatar ⚡

```yaml
avatar_states:
  speaking:
    glow: "strong"
    pulse_rate: "fast"
    
  thinking:
    glow: "medium"
    pulse_rate: "slow"
    
  idle:
    glow: "dim"
    pulse_rate: "very_slow"
    
  agent_state_low_trust:
    flicker: true
    color_shift: "toward_amber"
    
  agent_state_high_trust:
    saturation: "up"
    stability: "locked"
```

### 2.3 Couleurs d'Identité ⚡

```yaml
avatar_colors:
  user: "#76E6C7"           # Vert menthe (utilisateur)
  nova: "#FFFFFF"           # Blanc pur (orchestrateur)
  architect_sigma: "#5BA9FF" # Bleu structural
  thread_weaver: "#FF5FFF"   # Rose/Magenta
  memory_manager: "#E0C46B"  # Or/Jaune
  ethics_guard: "#FF4444"    # Rouge alerté
  drift_detector: "#FFAA33"  # Orange warning
```

---

## 3) XR PRESENCE MANAGER ⚡

```yaml
presence_manager:
  responsibilities:
    - map_users_and_agents_to_avatars
    - track_attention_focus
    - animate_agent_aura_states
    - show_who_is_speaking
    - show_decision_branch_focus
    - avoid_intrusive_agent_behavior
    
  focus_indicators:
    user_focus_beam: "light ray pointing to object"
    agent_focus_halo: "soft halo around referenced object"
    
  positioning:
    algorithm: "circle-around-center"
    spacing: "adaptive"
    user_priority_zone: "front-facing center"
```

---

## 4) XR ROOMS (CANONICAL TYPES) ⚡

### 4.1 Decision Room ⚡

```yaml
decision_room:
  purpose: "Multi-path decision visualization"
  
  layout:
    center: "decision root node"
    branches: "3D branching paths"
    impact_panels: "floating side panels"
    agent_positions: "behind branches to advise"
    
  interactions:
    - grab_branch
    - walk_path
    - compare_two_branches
    - show_impact_preview_3d
```

### 4.2 Collaboration Room ⚡

```yaml
collaboration_room:
  purpose: "Work room for shared objects & notes"
  
  layout:
    table: "central shared holographic table"
    walls: ["task wall", "content wall", "timeline wall"]
    floor_grid: "spatial landmarks"
    
  interactions:
    - place_objects
    - group_items
    - agent_suggestions_float_in
```

### 4.3 Presentation Room ⚡

```yaml
presentation_room:
  purpose: "One-way structured presentation"
  
  layout:
    stage: "presenter area"
    audience_arc: "semi-circle"
    projection_plane: "curved screen"
    
  interactions:
    - slide_air_swipe
    - anchor_points
    - highlight_zone
```

### 4.4 Brainstorm Room ⚡

```yaml
brainstorm_room:
  purpose: "Idea explosion & clustering"
  
  layout:
    free_space: "infinite white void"
    idea_nodes: "float as colored spheres"
    
  interactions:
    - generate_node
    - cluster_nodes
    - link_nodes
    - throw_nodes_to_trash
```

### 4.5 Review Room ⚡

```yaml
review_room:
  purpose: "Retrospectives & post-mortems"
  
  layout:
    timeline_lane: "long strip"
    event_markers: "tiles"
    replay_portals: "teleportation points"
    
  interactions:
    - jump_to_past
    - compare_versions
    - highlight_consequences
```

### 4.6 Negotiation Room ⚡

```yaml
negotiation_room:
  purpose: "Conflict or alignment resolution"
  
  layout:
    positions: "pods representing each participant"
    proposal_board: "center"
    tension_lines: "glowing threads"
    
  interactions:
    - weigh_proposals
    - inspect_tension_line
    - merge_positions
```

---

## 5) ROOM LAYOUT FORMAT (JSON) ⚡

```yaml
room_layout_format:
  version: "1.0"
  
  fields:
    id: "uuid"
    room_type: "decision | collaboration | presentation | brainstorm | review | negotiation"
    
    anchors:
      - id: "string"
        type: "wall | table | center | branch_node | projection | timeline_lane"
        position: { x: number, y: number, z: number }
        rotation: { x: number, y: number, z: number }
        scale: { x: number, y: number, z: number }
        
    theme:
      primary_color: "hex"
      secondary_color: "hex"
      ambient_light: "float"
      fx_options:
        fog: "bool"
        glow: "bool"
        particles: "bool"
```

---

## 6) XR INTERACTION MODEL ⚡

### 6.1 Navigation ⚡

```yaml
navigation:
  teleport_dash: "point + trigger"
  orbit_pan: "grab + drag"
  zoom: "pinch or wheel"
```

### 6.2 Object Interaction ⚡

```yaml
object_interaction:
  grab: "pinch or hold"
  throw: "release with velocity"
  scale: "two-finger pinch"
  duplicate: "double-tap"
```

### 6.3 Agent Interactions ⚡

```yaml
agent_interactions:
  summon_nova: "look at Nova orb + tap"
  ask_nova: "speech or gesture"
  ask_architect: "point at structure + tap"
  ask_thread_weaver: "tap timeline stream"
```

### 6.4 Safety ⚡

```yaml
safety:
  - always_show_exit_portal
  - no_forced_movement
  - soft_edges_on_all_interactions
```

---

## 7) XR REPLAY SYSTEM ⚡

### 7.1 Modes de Replay ⚡

```yaml
replay_modes:
  timeline_replay: "linear playback of events"
  decision_replay: "branches appear as holograms"
  xr_session_replay: "walk inside past meeting"
  diff_replay: "side-by-side comparison snapshots"
  narrative_replay: "XR storytelling of key events"
```

### 7.2 Éléments de Replay ⚡

```yaml
replay_elements:
  replay_scrubber: "floating control bar"
  bookmarks: "glowing nodes along timeline"
  
  portals:
    past_portal: "step into a past moment"
    future_portal: "impact preview portal"
```

### 7.3 Données Requises ⚡

```yaml
replay_data_required:
  - thread_events
  - agent_actions
  - xr_recordings
  - decisions
```

### 7.4 Contrôles ⚡

```yaml
replay_controls:
  - play_pause
  - seek
  - slow_motion
  - branch_swap
  - annotate_replay
```

---

## 8) SPATIAL MEMORY ANCHORS ⚡

```yaml
memory_anchors:
  definition: "Memories pinned inside XR space"
  
  types:
    sticky_note: "floating memo"
    item_card: "3D version of item"
    moment_orb: "anchor event"
    
  behaviors:
    - attach_to_wall
    - float_in_space
    - group_into_clusters
    - convert_anchor_to_memory_object
```

---

## 9) 2D ↔ XR TRANSITIONS ⚡

### 9.1 From 2D to XR ⚡

```yaml
from_2d_to_xr:
  - dim_screen
  - elevate_sphere_color
  - pull_center_ui_forward
  - open_spatial_gate
  - fade_to_room
```

### 9.2 From XR to 2D ⚡

```yaml
from_xr_to_2d:
  - collapse_room
  - fade_out_spatial_elements
  - reassemble_panel_layout
  - re_enter_UI
```

---

## 10) AGENTS IN XR ⚡

### 10.1 Nova 2.0 in XR ⚡

```yaml
nova_in_xr:
  appearance: "White orb, gentle glow"
  
  behaviors:
    - floats_near_user
    - enlarges_when_speaking
    - projects_plan_in_3d
    - ensures_reversibility
```

### 10.2 Architect Σ in XR ⚡

```yaml
architect_in_xr:
  appearance: "Blue structural grid figure"
  
  behaviors:
    - draws_trees_in_mid_air
    - expands_workflows
    - auto_aligns_floating_nodes
    - repairs_broken_structures_visually
```

### 10.3 Thread Weaver in XR ⚡

```yaml
thread_weaver_in_xr:
  appearance: "Pink luminous thread serpent"
  
  behaviors:
    - links_memories
    - highlights_event_chains
    - shows_past_future_relations
```

---

## 11) XR ROOM SUMMARY ⚡

```
┌──────────────────────────────────────────────────────────────────────────┐
│                      CHE·NU XR ROOMS SUMMARY                              │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ROOM TYPE           │ PURPOSE                    │ KEY FEATURE           │
│  ────────────────────┼────────────────────────────┼─────────────────────  │
│  Decision Room       │ Multi-path decisions       │ 3D branching paths    │
│  Collaboration Room  │ Shared work space          │ Holographic table     │
│  Presentation Room   │ Structured presentations   │ Curved projection     │
│  Brainstorm Room     │ Idea explosion             │ Infinite white void   │
│  Review Room         │ Retrospectives             │ Timeline lane         │
│  Negotiation Room    │ Conflict resolution        │ Tension lines         │
│                                                                           │
│  TOTAL: 6 CANONICAL ROOM TYPES                                            │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 12) XR AVATAR SUMMARY ⚡

```
┌──────────────────────────────────────────────────────────────────────────┐
│                      CHE·NU XR AVATARS SUMMARY                            │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ENTITY              │ COLOR       │ APPEARANCE                          │
│  ────────────────────┼─────────────┼──────────────────────────────────── │
│  User                │ #76E6C7     │ Minimal luminous silhouette         │
│  Nova 2.0            │ #FFFFFF     │ White orb, gentle glow              │
│  Architect Σ         │ #5BA9FF     │ Blue structural grid figure         │
│  Thread Weaver       │ #FF5FFF     │ Pink luminous thread serpent        │
│  Memory Manager      │ #E0C46B     │ Golden memory keeper                │
│  Ethics Guard        │ #FF4444     │ Red alert sentinel                  │
│  Drift Detector      │ #FFAA33     │ Orange warning watcher              │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘
```

---

**END — XR PACK v1.0**
