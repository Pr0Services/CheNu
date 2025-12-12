# CHE·NU — XR PACK COMPLETE
**VERSION:** XR.v1.0-canonical  
**MODE:** FOUNDATION / IMMERSIVE / PRODUCTION

---

## 1) XR PRINCIPLES ⚡

### 1.1 Core Philosophy

```
┌─────────────────────────────────────────────────────────────────┐
│                   CHE·NU XR PHILOSOPHY                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │           XR IS EXTENSION, NOT SEPARATE UI               │    │
│  │         Transitions smooth • Reversible always          │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐       │
│  │  SOVEREIGNTY  │  │   PRESENCE    │  │    SPATIAL    │       │
│  │  respected    │  │  non-intrusive│  │   = memory    │       │
│  └───────────────┘  └───────────────┘  └───────────────┘       │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  ROOMS REFLECT PURPOSE • REPLAY IS FIRST-CLASS FEATURE  │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Principles List

| # | Principle | Description |
|---|-----------|-------------|
| 1 | **XR = Extension** | Not a separate interface |
| 2 | **Smooth Transitions** | Always reversible |
| 3 | **Sovereignty Respected** | User control preserved in XR |
| 4 | **Non-Intrusive Presence** | Agents don't overwhelm |
| 5 | **Spatial Memory** | Location enhances understanding |
| 6 | **Purpose-Driven Rooms** | Function over decoration |
| 7 | **Replay First-Class** | Core feature, not afterthought |

---

## 2) XR AVATAR SYSTEM ⚡

### 2.1 Design Philosophy

```
┌─────────────────────────────────────────────────────────────────┐
│                    AVATAR DESIGN GOALS                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ✓ Avoid uncanny valley                                         │
│  ✓ Identity via silhouette + aura color                         │
│  ✓ Readable gestures                                            │
│  ✓ Low cognitive load                                           │
│                                                                  │
│  STYLE: "Minimal luminous silhouette"                           │
│                                                                  │
│              ╭───────╮                                          │
│              │  ◉◉   │  ← Soft sphere head with glow           │
│              ╰───┬───╯                                          │
│                  │                                               │
│              ╭───┴───╮                                          │
│              │       │  ← Transparent abstract body             │
│              │       │                                          │
│              ╰───────╯                                          │
│              ╱       ╲                                          │
│             ╱         ╲  ← Light contour hands                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Avatar Elements

| Element | Description |
|---------|-------------|
| **Head** | Soft sphere with faint glow |
| **Body** | Transparent abstract form |
| **Hands** | Light contours for interaction |

### 2.3 Avatar States

```typescript
// avatar-states.config.ts
export const AVATAR_STATES = {
  speaking: {
    glow: 'strong',
    pulseRate: 'fast',
    scale: 1.05
  },
  
  thinking: {
    glow: 'medium',
    pulseRate: 'slow',
    scale: 1.0
  },
  
  idle: {
    glow: 'dim',
    pulseRate: 'very_slow',
    scale: 1.0
  },
  
  agentLowTrust: {
    flicker: true,
    colorShift: 'toward_amber',
    stability: 'low'
  },
  
  agentHighTrust: {
    saturation: 'up',
    stability: 'locked',
    glow: 'strong'
  }
} as const;

export type AvatarState = keyof typeof AVATAR_STATES;
```

### 2.4 Avatar Color Logic

```typescript
// avatar-colors.config.ts
export const AVATAR_COLORS = {
  // User
  user: '#76E6C7',
  
  // Core Agents
  nova: '#FFFFFF',
  architect_sigma: '#5BA9FF',
  thread_weaver: '#FF5FFF',
  memory_manager: '#E0C46B',
  ethics_guard: '#FF4444',
  drift_detector: '#FFAA33'
} as const;

export type AvatarColorKey = keyof typeof AVATAR_COLORS;
```

### 2.5 Avatar Component

```typescript
// components/XRAvatar.tsx
import React from 'react';
import { AVATAR_COLORS, AVATAR_STATES } from '../config';

interface XRAvatarProps {
  type: 'user' | 'nova' | 'architect_sigma' | 'thread_weaver' | 
        'memory_manager' | 'ethics_guard' | 'drift_detector';
  state: 'speaking' | 'thinking' | 'idle' | 'agentLowTrust' | 'agentHighTrust';
  position: [number, number, number];
}

export const XRAvatar: React.FC<XRAvatarProps> = ({ type, state, position }) => {
  const color = AVATAR_COLORS[type];
  const stateConfig = AVATAR_STATES[state];
  
  return (
    <group position={position}>
      {/* Head */}
      <mesh>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial 
          color={color}
          emissive={color}
          emissiveIntensity={stateConfig.glow === 'strong' ? 1.5 : 0.5}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Body (abstract) */}
      <mesh position={[0, -0.3, 0]}>
        <capsuleGeometry args={[0.08, 0.3, 8, 16]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.3}
        />
      </mesh>
      
      {/* Aura Glow */}
      <pointLight 
        color={color} 
        intensity={stateConfig.glow === 'strong' ? 2 : 0.5}
        distance={1}
      />
    </group>
  );
};
```

---

## 3) XR PRESENCE MANAGER ⚡

### 3.1 Responsibilities

```
┌─────────────────────────────────────────────────────────────────┐
│                 PRESENCE MANAGER DUTIES                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │ Map Users/Agents│  │ Track Attention │  │ Animate Auras   │ │
│  │   to Avatars    │  │     Focus       │  │    States       │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                                                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │ Show Who Is     │  │ Show Decision   │  │ Avoid Intrusive │ │
│  │    Speaking     │  │  Branch Focus   │  │ Agent Behavior  │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Focus Indicators

```typescript
// presence/focus.config.ts
export const FOCUS_INDICATORS = {
  userFocusBeam: {
    type: 'ray',
    description: 'Light ray pointing to object',
    color: '#76E6C7',
    opacity: 0.4,
    width: 0.02
  },
  
  agentFocusHalo: {
    type: 'halo',
    description: 'Soft halo around referenced object',
    color: 'agent_color',
    opacity: 0.3,
    radius: 0.5
  }
} as const;
```

### 3.3 Positioning Algorithm

```typescript
// presence/positioning.ts
export const POSITIONING_CONFIG = {
  algorithm: 'circle-around-center',
  spacing: 'adaptive',
  userPriorityZone: 'front-facing-center'
} as const;

export function calculatePositions(
  participants: Participant[],
  roomCenter: Vector3,
  roomRadius: number
): Map<string, Vector3> {
  const positions = new Map<string, Vector3>();
  const userCount = participants.filter(p => p.type === 'user').length;
  const agentCount = participants.filter(p => p.type === 'agent').length;
  
  // Users get front-facing positions
  participants
    .filter(p => p.type === 'user')
    .forEach((user, i) => {
      const angle = (Math.PI / 4) * (i - (userCount - 1) / 2);
      positions.set(user.id, {
        x: roomCenter.x + Math.sin(angle) * roomRadius * 0.6,
        y: roomCenter.y,
        z: roomCenter.z + Math.cos(angle) * roomRadius * 0.6
      });
    });
  
  // Agents positioned behind/around
  participants
    .filter(p => p.type === 'agent')
    .forEach((agent, i) => {
      const angle = Math.PI + (Math.PI / (agentCount + 1)) * (i + 1);
      positions.set(agent.id, {
        x: roomCenter.x + Math.sin(angle) * roomRadius * 0.8,
        y: roomCenter.y + 0.2, // Slightly elevated
        z: roomCenter.z + Math.cos(angle) * roomRadius * 0.8
      });
    });
  
  return positions;
}
```

### 3.4 Presence Manager Service

```typescript
// services/PresenceManager.ts
interface Participant {
  id: string;
  type: 'user' | 'agent';
  name: string;
  avatarType: string;
  state: AvatarState;
  focusTarget?: string;
}

export class PresenceManager {
  private participants: Map<string, Participant> = new Map();
  private focusTargets: Map<string, string> = new Map();
  
  addParticipant(participant: Participant): void {
    this.participants.set(participant.id, participant);
    this.recalculatePositions();
  }
  
  removeParticipant(id: string): void {
    this.participants.delete(id);
    this.focusTargets.delete(id);
    this.recalculatePositions();
  }
  
  updateState(id: string, state: AvatarState): void {
    const p = this.participants.get(id);
    if (p) {
      p.state = state;
      this.emit('stateChanged', { id, state });
    }
  }
  
  setFocus(participantId: string, targetId: string): void {
    this.focusTargets.set(participantId, targetId);
    this.emit('focusChanged', { participantId, targetId });
  }
  
  setSpeaking(id: string): void {
    // Dim all others, highlight speaker
    this.participants.forEach((p, pid) => {
      if (pid === id) {
        this.updateState(pid, 'speaking');
      } else if (p.state === 'speaking') {
        this.updateState(pid, 'idle');
      }
    });
  }
  
  private recalculatePositions(): void {
    // Trigger position recalculation
    this.emit('positionsChanged', this.getPositions());
  }
  
  private emit(event: string, data: any): void {
    // Event emission logic
  }
  
  getPositions(): Map<string, Vector3> {
    return calculatePositions(
      Array.from(this.participants.values()),
      { x: 0, y: 0, z: 0 },
      3.0
    );
  }
}
```

---

## 4) XR ROOMS (CANONICAL) ⚡

### 4.1 Room Types Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    XR ROOM TYPES                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │  DECISION   │  │ COLLABORATION│  │ PRESENTATION│             │
│  │    ROOM     │  │    ROOM     │  │    ROOM     │             │
│  │  ◇ ◇ ◇     │  │  ┌───────┐  │  │   ╭───────╮ │             │
│  │   ╲│╱      │  │  │ TABLE │  │  │   │ STAGE │ │             │
│  │    ●       │  │  └───────┘  │  │   ╰───────╯ │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │ BRAINSTORM  │  │   REVIEW    │  │ NEGOTIATION │             │
│  │    ROOM     │  │    ROOM     │  │    ROOM     │             │
│  │  ○ ○ ○ ○   │  │  ──────────  │  │   ◯   ◯    │             │
│  │   ○ ○ ○    │  │  │ │ │ │ │  │  │     ▣      │             │
│  │    ○ ○     │  │  ──────────  │  │   ◯   ◯    │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Decision Room

```typescript
// rooms/DecisionRoom.ts
export const DECISION_ROOM = {
  type: 'decision',
  purpose: 'Multi-path decision visualization',
  
  layout: {
    center: {
      type: 'decision_root_node',
      position: [0, 1, 0],
      description: 'Central decision point'
    },
    branches: {
      type: '3d_branching_paths',
      spreadAngle: 120, // degrees
      branchLength: 2.5,
      description: '3D branching paths radiating outward'
    },
    impactPanels: {
      type: 'floating_side_panels',
      position: 'beside_each_branch',
      description: 'Show impact preview for each branch'
    },
    agentPositions: {
      type: 'behind_branches',
      purpose: 'Advisors positioned behind relevant branches'
    }
  },
  
  interactions: [
    {
      name: 'grab_branch',
      gesture: 'pinch',
      description: 'Grab and inspect a decision branch'
    },
    {
      name: 'walk_path',
      gesture: 'teleport',
      description: 'Walk along a decision path'
    },
    {
      name: 'compare_two_branches',
      gesture: 'dual_select',
      description: 'Select two branches to compare side-by-side'
    },
    {
      name: 'show_impact_preview_3d',
      gesture: 'expand',
      description: 'Expand impact visualization in 3D'
    }
  ]
} as const;
```

### 4.3 Collaboration Room

```typescript
// rooms/CollaborationRoom.ts
export const COLLABORATION_ROOM = {
  type: 'collaboration',
  purpose: 'Work room for shared objects & notes',
  
  layout: {
    table: {
      type: 'central_holographic_table',
      position: [0, 0.8, 0],
      radius: 1.5,
      description: 'Central shared workspace'
    },
    walls: [
      { name: 'task_wall', position: [-3, 1.5, 0], rotation: [0, 90, 0] },
      { name: 'content_wall', position: [0, 1.5, -3], rotation: [0, 0, 0] },
      { name: 'timeline_wall', position: [3, 1.5, 0], rotation: [0, -90, 0] }
    ],
    floorGrid: {
      type: 'spatial_landmarks',
      spacing: 1.0,
      opacity: 0.1
    }
  },
  
  interactions: [
    {
      name: 'place_objects',
      gesture: 'drop',
      description: 'Place items on table or walls'
    },
    {
      name: 'group_items',
      gesture: 'lasso',
      description: 'Group related items together'
    },
    {
      name: 'agent_suggestions_float_in',
      trigger: 'automatic',
      description: 'Agent suggestions appear as floating cards'
    }
  ]
} as const;
```

### 4.4 Presentation Room

```typescript
// rooms/PresentationRoom.ts
export const PRESENTATION_ROOM = {
  type: 'presentation',
  purpose: 'One-way structured presentation',
  
  layout: {
    stage: {
      type: 'presenter_area',
      position: [0, 0, -2],
      size: [3, 0.1, 2]
    },
    audienceArc: {
      type: 'semi_circle',
      radius: 4,
      seatCount: 12
    },
    projectionPlane: {
      type: 'curved_screen',
      position: [0, 2, -4],
      width: 6,
      height: 3,
      curvature: 0.1
    }
  },
  
  interactions: [
    {
      name: 'slide_air_swipe',
      gesture: 'swipe',
      description: 'Swipe to change slides'
    },
    {
      name: 'anchor_points',
      gesture: 'tap',
      description: 'Create anchor points in presentation'
    },
    {
      name: 'highlight_zone',
      gesture: 'point',
      description: 'Highlight area of presentation'
    }
  ]
} as const;
```

### 4.5 Brainstorm Room

```typescript
// rooms/BrainstormRoom.ts
export const BRAINSTORM_ROOM = {
  type: 'brainstorm',
  purpose: 'Idea explosion & clustering',
  
  layout: {
    freeSpace: {
      type: 'infinite_white_void',
      description: 'Open space for idea generation'
    },
    ideaNodes: {
      type: 'floating_colored_spheres',
      defaultSize: 0.15,
      colorByCategory: true
    }
  },
  
  interactions: [
    {
      name: 'generate_node',
      gesture: 'voice_or_tap',
      description: 'Create new idea node'
    },
    {
      name: 'cluster_nodes',
      gesture: 'gather',
      description: 'Group related ideas'
    },
    {
      name: 'link_nodes',
      gesture: 'draw_line',
      description: 'Create connection between ideas'
    },
    {
      name: 'throw_nodes_to_trash',
      gesture: 'throw',
      description: 'Discard unwanted ideas'
    }
  ]
} as const;
```

### 4.6 Review Room

```typescript
// rooms/ReviewRoom.ts
export const REVIEW_ROOM = {
  type: 'review',
  purpose: 'Retrospectives & post-mortems',
  
  layout: {
    timelineLane: {
      type: 'long_strip',
      position: [0, 1, 0],
      length: 20,
      description: 'Horizontal timeline strip'
    },
    eventMarkers: {
      type: 'tiles',
      attachTo: 'timeline_lane',
      spacing: 'proportional_to_time'
    },
    replayPortals: {
      type: 'teleportation_points',
      atMajorEvents: true
    }
  },
  
  interactions: [
    {
      name: 'jump_to_past',
      gesture: 'portal_step',
      description: 'Step through portal to past moment'
    },
    {
      name: 'compare_versions',
      gesture: 'dual_select',
      description: 'Compare two timeline points'
    },
    {
      name: 'highlight_consequences',
      gesture: 'trace',
      description: 'Show ripple effects from event'
    }
  ]
} as const;
```

### 4.7 Negotiation Room

```typescript
// rooms/NegotiationRoom.ts
export const NEGOTIATION_ROOM = {
  type: 'negotiation',
  purpose: 'Conflict or alignment resolution',
  
  layout: {
    positions: {
      type: 'pods',
      description: 'Pods representing each participant',
      arrangement: 'circular',
      count: 'dynamic'
    },
    proposalBoard: {
      type: 'center_display',
      position: [0, 1.2, 0],
      description: 'Central proposal visualization'
    },
    tensionLines: {
      type: 'glowing_threads',
      connectParticipants: true,
      colorByTension: true // red=high, green=aligned
    }
  },
  
  interactions: [
    {
      name: 'weigh_proposals',
      gesture: 'scale_gesture',
      description: 'Compare weight of proposals'
    },
    {
      name: 'inspect_tension_line',
      gesture: 'tap_line',
      description: 'Examine source of tension'
    },
    {
      name: 'merge_positions',
      gesture: 'push_together',
      description: 'Combine aligned positions'
    }
  ]
} as const;
```

---

## 5) ROOM LAYOUT JSON FORMAT ⚡

### 5.1 Schema Definition

```typescript
// types/room-layout.ts
export interface RoomLayout {
  id: string;
  version: '1.0';
  roomType: 'decision' | 'collaboration' | 'presentation' | 
            'brainstorm' | 'review' | 'negotiation';
  
  anchors: Anchor[];
  theme: RoomTheme;
}

export interface Anchor {
  id: string;
  type: 'wall' | 'table' | 'center' | 'branch_node' | 
        'projection' | 'timeline_lane';
  position: Vector3;
  rotation: Vector3;
  scale: Vector3;
}

export interface RoomTheme {
  primaryColor: string;
  secondaryColor: string;
  ambientLight: number;
  fxOptions: {
    fog: boolean;
    glow: boolean;
    particles: boolean;
  };
}

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}
```

### 5.2 Example Room JSON

```json
{
  "id": "decision-room-001",
  "version": "1.0",
  "roomType": "decision",
  "anchors": [
    {
      "id": "root-node",
      "type": "center",
      "position": { "x": 0, "y": 1, "z": 0 },
      "rotation": { "x": 0, "y": 0, "z": 0 },
      "scale": { "x": 1, "y": 1, "z": 1 }
    },
    {
      "id": "branch-a",
      "type": "branch_node",
      "position": { "x": -2, "y": 1.5, "z": -2 },
      "rotation": { "x": 0, "y": 45, "z": 0 },
      "scale": { "x": 1, "y": 1, "z": 1 }
    },
    {
      "id": "branch-b",
      "type": "branch_node",
      "position": { "x": 2, "y": 1.5, "z": -2 },
      "rotation": { "x": 0, "y": -45, "z": 0 },
      "scale": { "x": 1, "y": 1, "z": 1 }
    }
  ],
  "theme": {
    "primaryColor": "#5BA9FF",
    "secondaryColor": "#8EC8FF",
    "ambientLight": 0.3,
    "fxOptions": {
      "fog": true,
      "glow": true,
      "particles": false
    }
  }
}
```

---

## 6) XR INTERACTION MODEL ⚡

### 6.1 Navigation

```typescript
// interactions/navigation.config.ts
export const XR_NAVIGATION = {
  teleportDash: {
    trigger: 'point + trigger',
    description: 'Point to location and press trigger to teleport',
    maxDistance: 10,
    showPreview: true
  },
  
  orbitPan: {
    trigger: 'grab + drag',
    description: 'Grab space and drag to orbit/pan view',
    sensitivity: 1.0
  },
  
  zoom: {
    trigger: 'pinch or wheel',
    description: 'Pinch gesture or scroll to zoom',
    minZoom: 0.5,
    maxZoom: 3.0
  }
} as const;
```

### 6.2 Object Interaction

```typescript
// interactions/objects.config.ts
export const XR_OBJECT_INTERACTIONS = {
  grab: {
    trigger: 'pinch or hold',
    description: 'Pinch or hold to grab object',
    hapticFeedback: true
  },
  
  throw: {
    trigger: 'release with velocity',
    description: 'Release grabbed object with momentum',
    physicsEnabled: true
  },
  
  scale: {
    trigger: 'two-finger pinch',
    description: 'Pinch with two hands to scale object',
    minScale: 0.1,
    maxScale: 10.0
  },
  
  duplicate: {
    trigger: 'double-tap',
    description: 'Double-tap object to duplicate',
    confirmRequired: false
  }
} as const;
```

### 6.3 Agent Interactions

```typescript
// interactions/agents.config.ts
export const XR_AGENT_INTERACTIONS = {
  summonNova: {
    trigger: 'look at Nova orb + tap',
    description: 'Look at Nova and tap to summon',
    response: 'Nova floats closer'
  },
  
  askNova: {
    trigger: 'speech or gesture',
    description: 'Voice command or gesture to ask Nova',
    voiceKeyword: 'Nova'
  },
  
  askArchitect: {
    trigger: 'point at structure + tap',
    description: 'Point at structure and tap to ask Architect Σ',
    contextAware: true
  },
  
  askThreadWeaver: {
    trigger: 'tap timeline stream',
    description: 'Tap on thread/timeline to invoke Thread Weaver',
    showsConnections: true
  }
} as const;
```

### 6.4 Safety Rules

```typescript
// interactions/safety.config.ts
export const XR_SAFETY = {
  rules: [
    {
      rule: 'always_show_exit_portal',
      description: 'Exit portal always visible',
      position: 'bottom-left peripheral'
    },
    {
      rule: 'no_forced_movement',
      description: 'Never move user without consent',
      requireConfirmation: true
    },
    {
      rule: 'soft_edges_on_all_interactions',
      description: 'All interactions have smooth transitions',
      transitionDuration: 300
    }
  ]
} as const;
```

---

## 7) XR REPLAY SYSTEM ⚡

### 7.1 Replay Modes

```typescript
// replay/modes.config.ts
export const REPLAY_MODES = {
  timeline: {
    type: 'timeline_replay',
    description: 'Linear playback of events',
    controls: ['play', 'pause', 'seek', 'speed']
  },
  
  decision: {
    type: 'decision_replay',
    description: 'Branches appear as holograms',
    showAllPaths: true,
    highlightChosen: true
  },
  
  xrSession: {
    type: 'xr_session_replay',
    description: 'Walk inside past meeting',
    fullImmersion: true,
    avatarsReplay: true
  },
  
  diff: {
    type: 'diff_replay',
    description: 'Side-by-side comparison snapshots',
    splitView: true
  },
  
  narrative: {
    type: 'narrative_replay',
    description: 'XR storytelling of key events',
    voiceoverEnabled: true,
    cinematicMode: true
  }
} as const;
```

### 7.2 Replay Elements

```typescript
// replay/elements.config.ts
export const REPLAY_ELEMENTS = {
  scrubber: {
    type: 'floating_control_bar',
    position: 'user_waist_height',
    followsUser: true
  },
  
  bookmarks: {
    type: 'glowing_nodes',
    placement: 'along_timeline',
    interactive: true
  },
  
  portals: {
    past: {
      type: 'step_into_past',
      visualStyle: 'blue_shimmer',
      description: 'Step into a past moment'
    },
    future: {
      type: 'impact_preview',
      visualStyle: 'amber_glow',
      description: 'Preview future impact'
    }
  }
} as const;
```

### 7.3 Data Requirements

```typescript
// replay/data.config.ts
export const REPLAY_DATA_REQUIREMENTS = {
  required: [
    'thread_events',
    'agent_actions',
    'xr_recordings',
    'decisions'
  ],
  
  optional: [
    'voice_transcripts',
    'gesture_logs',
    'emotion_markers'
  ]
} as const;
```

### 7.4 Replay Controls

```typescript
// replay/controls.ts
export interface ReplayControls {
  playPause(): void;
  seek(timestamp: number): void;
  setSpeed(speed: number): void; // 0.25x - 4x
  slowMotion(): void;
  branchSwap(branchId: string): void;
  annotateReplay(annotation: Annotation): void;
  jumpToBookmark(bookmarkId: string): void;
}

export class XRReplayController implements ReplayControls {
  private currentTime: number = 0;
  private isPlaying: boolean = false;
  private speed: number = 1.0;
  
  playPause(): void {
    this.isPlaying = !this.isPlaying;
    this.emit('playStateChanged', this.isPlaying);
  }
  
  seek(timestamp: number): void {
    this.currentTime = timestamp;
    this.emit('seeked', timestamp);
  }
  
  setSpeed(speed: number): void {
    this.speed = Math.max(0.25, Math.min(4, speed));
    this.emit('speedChanged', this.speed);
  }
  
  slowMotion(): void {
    this.setSpeed(0.25);
  }
  
  branchSwap(branchId: string): void {
    // Switch to viewing alternate decision branch
    this.emit('branchSwapped', branchId);
  }
  
  annotateReplay(annotation: Annotation): void {
    // Add annotation at current time
    this.emit('annotationAdded', { ...annotation, time: this.currentTime });
  }
  
  jumpToBookmark(bookmarkId: string): void {
    // Jump to bookmark timestamp
    const bookmark = this.getBookmark(bookmarkId);
    if (bookmark) {
      this.seek(bookmark.timestamp);
    }
  }
  
  private emit(event: string, data: any): void {}
  private getBookmark(id: string): Bookmark | null { return null; }
}
```

---

## 8) SPATIAL MEMORY ANCHORS ⚡

### 8.1 Anchor Types

```typescript
// anchors/types.config.ts
export const MEMORY_ANCHOR_TYPES = {
  stickyNote: {
    type: 'floating_memo',
    defaultSize: [0.2, 0.15, 0.01],
    maxCharacters: 200,
    color: '#FFE066'
  },
  
  itemCard: {
    type: '3d_item_card',
    defaultSize: [0.3, 0.2, 0.02],
    showsPreview: true
  },
  
  momentOrb: {
    type: 'anchor_event',
    defaultSize: 0.1,
    glowIntensity: 0.5,
    showsTimestamp: true
  }
} as const;
```

### 8.2 Anchor Behaviors

```typescript
// anchors/behaviors.config.ts
export const ANCHOR_BEHAVIORS = {
  attachToWall: {
    snapDistance: 0.5,
    alignToSurface: true
  },
  
  floatInSpace: {
    physics: 'gentle_drift',
    returnToPosition: true
  },
  
  groupIntoClusters: {
    magneticRadius: 0.3,
    maxClusterSize: 10
  },
  
  convertToMemoryObject: {
    createsMemory: true,
    linkToThread: true
  }
} as const;
```

---

## 9) 2D ↔ XR TRANSITIONS ⚡

### 9.1 Transition Pipeline

```typescript
// transitions/pipeline.config.ts
export const TRANSITION_PIPELINE = {
  from2DToXR: [
    {
      step: 1,
      action: 'dim_screen',
      duration: 200,
      description: 'Fade 2D interface to 50% opacity'
    },
    {
      step: 2,
      action: 'elevate_sphere_color',
      duration: 300,
      description: 'Sphere accent color intensifies'
    },
    {
      step: 3,
      action: 'pull_center_ui_forward',
      duration: 400,
      description: 'Central UI elements move toward user'
    },
    {
      step: 4,
      action: 'open_spatial_gate',
      duration: 500,
      description: 'XR portal opens in center'
    },
    {
      step: 5,
      action: 'fade_to_room',
      duration: 600,
      description: 'Environment fades into XR room'
    }
  ],
  
  fromXRTo2D: [
    {
      step: 1,
      action: 'collapse_room',
      duration: 400,
      description: 'XR room elements contract'
    },
    {
      step: 2,
      action: 'fade_out_spatial_elements',
      duration: 300,
      description: 'Spatial objects dissolve'
    },
    {
      step: 3,
      action: 'reassemble_panel_layout',
      duration: 400,
      description: '2D panels reconstruct'
    },
    {
      step: 4,
      action: 'reenter_ui',
      duration: 200,
      description: 'Full 2D interface restored'
    }
  ]
} as const;
```

### 9.2 Transition Component

```typescript
// components/XRTransition.tsx
import React, { useState } from 'react';
import { TRANSITION_PIPELINE } from '../config';

interface XRTransitionProps {
  direction: '2d-to-xr' | 'xr-to-2d';
  onComplete: () => void;
}

export const XRTransition: React.FC<XRTransitionProps> = ({ 
  direction, 
  onComplete 
}) => {
  const pipeline = direction === '2d-to-xr' 
    ? TRANSITION_PIPELINE.from2DToXR 
    : TRANSITION_PIPELINE.fromXRTo2D;
  
  const [currentStep, setCurrentStep] = useState(0);
  
  React.useEffect(() => {
    let totalDelay = 0;
    
    pipeline.forEach((step, index) => {
      setTimeout(() => {
        setCurrentStep(index);
        executeStep(step.action);
        
        if (index === pipeline.length - 1) {
          setTimeout(onComplete, step.duration);
        }
      }, totalDelay);
      
      totalDelay += step.duration;
    });
  }, [direction]);
  
  const executeStep = (action: string) => {
    // Execute transition step animation
    console.log(`Executing: ${action}`);
  };
  
  return (
    <div className="xr-transition">
      {/* Transition visual overlay */}
      <div className={`transition-step step-${currentStep}`} />
    </div>
  );
};
```

---

## 10) AGENTS IN XR ⚡

### 10.1 Nova in XR

```typescript
// agents/NovaXR.config.ts
export const NOVA_XR = {
  appearance: {
    shape: 'orb',
    color: '#FFFFFF',
    glowType: 'gentle',
    size: 0.2
  },
  
  behaviors: [
    {
      name: 'floats_near_user',
      distance: 1.5,
      height: 'eye_level',
      followSmoothing: 0.1
    },
    {
      name: 'enlarges_when_speaking',
      scaleMultiplier: 1.3,
      transitionDuration: 200
    },
    {
      name: 'projects_plan_in_3d',
      projectionType: 'holographic_cards',
      arrangementType: 'arc'
    },
    {
      name: 'ensures_reversibility',
      showsUndoOption: true,
      confirmationRequired: 'for_major_actions'
    }
  ]
} as const;
```

### 10.2 Architect Σ in XR

```typescript
// agents/ArchitectXR.config.ts
export const ARCHITECT_XR = {
  appearance: {
    shape: 'structural_grid_figure',
    color: '#5BA9FF',
    pattern: 'wireframe_humanoid',
    size: 1.8
  },
  
  behaviors: [
    {
      name: 'draws_trees_in_midair',
      toolType: 'light_pen',
      structureType: 'hierarchical'
    },
    {
      name: 'expands_workflows',
      animationType: 'unfold',
      detailLevel: 'progressive'
    },
    {
      name: 'auto_aligns_floating_nodes',
      gridSnap: true,
      alignmentForce: 0.3
    },
    {
      name: 'repairs_broken_structures_visually',
      showsRepairAnimation: true,
      highlightsBrokenParts: true
    }
  ]
} as const;
```

### 10.3 Thread Weaver in XR

```typescript
// agents/ThreadWeaverXR.config.ts
export const THREAD_WEAVER_XR = {
  appearance: {
    shape: 'luminous_thread_serpent',
    color: '#FF5FFF',
    pattern: 'flowing',
    trailLength: 2.0
  },
  
  behaviors: [
    {
      name: 'links_memories',
      connectionType: 'glowing_thread',
      animationType: 'weave'
    },
    {
      name: 'highlights_event_chains',
      pulseEffect: true,
      showsDirection: true
    },
    {
      name: 'shows_past_future_relations',
      pastColor: '#8EC8FF',
      futureColor: '#FFB04D',
      convergencePoint: 'current_moment'
    }
  ]
} as const;
```

---

## 11) COMPLETE XR CONFIG EXPORT ⚡

```typescript
// index.ts - XR Pack Complete Export
export * from './avatars';
export * from './presence';
export * from './rooms';
export * from './interactions';
export * from './replay';
export * from './anchors';
export * from './transitions';
export * from './agents';

// Master config
export const CHENU_XR_PACK = {
  version: '1.0-canonical',
  
  principles: [
    'xr_is_extension_not_separate_ui',
    'transitions_are_smooth_and_reversible',
    'sovereignty_respected_in_xr',
    'agent_presence_is_non_intrusive',
    'spatial_memory_enhances_understanding',
    'rooms_reflect_purpose_not_decoration',
    'replay_is_first_class_feature'
  ],
  
  avatars: AVATAR_COLORS,
  avatarStates: AVATAR_STATES,
  
  rooms: {
    decision: DECISION_ROOM,
    collaboration: COLLABORATION_ROOM,
    presentation: PRESENTATION_ROOM,
    brainstorm: BRAINSTORM_ROOM,
    review: REVIEW_ROOM,
    negotiation: NEGOTIATION_ROOM
  },
  
  interactions: {
    navigation: XR_NAVIGATION,
    objects: XR_OBJECT_INTERACTIONS,
    agents: XR_AGENT_INTERACTIONS,
    safety: XR_SAFETY
  },
  
  replay: {
    modes: REPLAY_MODES,
    elements: REPLAY_ELEMENTS,
    dataRequirements: REPLAY_DATA_REQUIREMENTS
  },
  
  anchors: {
    types: MEMORY_ANCHOR_TYPES,
    behaviors: ANCHOR_BEHAVIORS
  },
  
  transitions: TRANSITION_PIPELINE,
  
  agentsXR: {
    nova: NOVA_XR,
    architect: ARCHITECT_XR,
    threadWeaver: THREAD_WEAVER_XR
  }
} as const;

export type XRPackConfig = typeof CHENU_XR_PACK;
```

---

**FIN DU DOCUMENT** — CHE·NU XR Pack Complete v1.0
