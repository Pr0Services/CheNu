# CHE·NU XR Meeting Room + Avatar Morphology

> **XR.v1.1**  
> Type: Foundation / Immersive / Non-Manipulative  
> Status: **CANONICAL**

Shared immersive space for discussion, visualization, decision review, and replay.

## ⚠️ STRICT RULE

```
XR Meeting Room = CONTEXT SPACE
NOT persuasion, NOT authority.
```

## Installation

```bash
npm install @chenu/xr-meeting
```

## Quick Start

```tsx
import {
  XRMeetingProvider,
  XRMeetingDashboard,
  useXRMeeting,
} from '@chenu/xr-meeting';

function App() {
  return (
    <XRMeetingProvider>
      <XRMeetingDashboard />
    </XRMeetingProvider>
  );
}
```

## Meeting Presets

| Preset | Purpose | Capacity | Voice Mode |
|--------|---------|----------|------------|
| 🏛️ **Classic** | General discussions | 2-12 | spatial_balanced |
| 📊 **Analysis** | Data review | 2-8 | clarity_boost |
| ⚖️ **Decision** | Strategic choices | 2-6 | presence_locked |
| 🎨 **Creative** | Brainstorming | 2-10 | free_spatial |

### Preset Details

```typescript
// Classic - General purpose
{
  id: 'xr_meeting_classic',
  lighting: 'neutral_soft',
  space: 'circular_room',
  focus: 'center_table',
  ui: 'floating_cards',
}

// Analysis - Data focused
{
  id: 'xr_meeting_analysis',
  lighting: 'cool_diffuse',
  space: 'layered_panels',
  focus: 'data_walls',
  ui: 'timeline_charts',
}

// Decision - Strategic
{
  id: 'xr_meeting_decision',
  lighting: 'warm_low',
  space: 'semi_enclosed',
  focus: 'decision_core',
  ui: 'summary_nodes',
}

// Creative - Brainstorming
{
  id: 'xr_meeting_creative',
  lighting: 'adaptive',
  space: 'open_hub',
  focus: 'shared_canvas',
  ui: 'sketch_media',
}
```

## Interaction Modes

| Mode | Icon | Description | Constraints |
|------|------|-------------|-------------|
| speak | 🎤 | Spatialized voice | No amplification |
| point | 👆 | 3D pointer | No persistent trails |
| pin | 📌 | Lock in space | Visible to all |
| timeline_scrub | ⏱️ | Navigate timeline | Bidirectional only |
| silent_review | 👁️ | Private review | No hidden notes |
| replay_mode | 🔄 | Read-only replay | Exact reproduction |

### Forbidden Interactions

```typescript
// NEVER allowed:
- Emotional amplification (no mood-altering visuals)
- Hidden nudging (no subliminal cues)  
- Forced flow (no mandatory sequences)
- Asymmetric view (all must see same space)
```

## Avatar Morphology

### Principle

```
Avatar = VISUAL PRESENCE ONLY
No intelligence. No authority. No persuasion.
```

### Morphology Dimensions

| Dimension | Options |
|-----------|---------|
| scale | small, normal, large |
| material | organic, stone, light, synthetic |
| opacity | solid, semi, outline |
| motion | static, slow, floating |
| aura | none, subtle, informational |
| posture | neutral, attentive, reflective |

### Avatar Roles

| Role | Color | Features |
|------|-------|----------|
| 👤 **User** | Green | Clear silhouette, neutral aura, expressive hands |
| 🤖 **Agent** | Blue | Simplified form, reduced motion, role glyph |
| 👁️ **Observer** | Gray | Low opacity, no aura, no interaction |

### Avatar Configuration

```typescript
{
  "avatar": {
    "role": "user",
    "morphology": {
      "scale": "normal",
      "material": "organic",
      "opacity": 1.0,
      "motion": "slow",
      "aura": "subtle",
      "posture": "neutral"
    },
    "theme_affinity": "xr_meeting_classic"
  }
}
```

## Meeting Data Model

```typescript
{
  "xr_meeting": {
    "id": "meeting-uuid",
    "preset": "classic",
    "participants": [
      { "id": "user_001", "role": "user" },
      { "id": "agent_001", "role": "agent" }
    ],
    "artifacts": [
      { "type": "notes", "content": "..." },
      { "type": "chart", "data": {...} }
    ],
    "mode": "live",
    "recording": {
      "enabled": true,
      "events": [...]
    },
    "export_formats": ["pdf", "timeline", "xr_replay"]
  }
}
```

## API Reference

### useXRMeeting()

```typescript
const {
  state,
  
  // Meeting
  createMeeting,
  joinMeeting,
  leaveMeeting,
  endMeeting,
  
  // Modes
  setMeetingMode,
  setInteractionMode,
  
  // Artifacts
  addArtifact,
  pinArtifact,
  unpinArtifact,
  
  // Recording
  addEvent,
  setActiveSpeaker,
  
  // Avatar
  createAvatar,
  updateAvatarMorphology,
  setCurrentAvatar,
  
  // Export
  exportMeeting,
} = useXRMeeting();
```

### Create Meeting

```typescript
const meetingId = createMeeting(
  'Q4 Planning Session',
  'xr_meeting_decision',
  'Alice'
);
```

### Join Meeting

```typescript
joinMeeting(meetingId, 'Claude', 'agent');
```

## Ethical Constraints

### Meeting Room Ethics

| Constraint | Implementation |
|------------|----------------|
| No emotional steering | Neutral palettes, no mood music |
| No forced sequences | All navigation voluntary |
| Symmetric visibility | All see identical space |
| Exact replay | Bit-perfect recordings |
| Recording indicator | Always visible when active |

### Avatar Ethics

| Constraint | Implementation |
|------------|----------------|
| No dominance visuals | Scale capped, neutral poses |
| No deceptive scale | Uniform per role |
| No authority signaling | Informational glyphs only |
| Accessibility first | High contrast, motion reduction |
| Consistent appearance | Synced across participants |

## Export Formats

| Format | Contents | Use Case |
|--------|----------|----------|
| PDF | Summary, decisions | Documentation |
| Timeline | Event sequence | Process review |
| XR Replay | Full spatial recording | Immersive review |

## Components

| Component | Description |
|-----------|-------------|
| `XRMeetingDashboard` | Full meeting interface |
| `CreateMeetingForm` | Meeting creation form |
| `ActiveMeetingDisplay` | Current meeting view |
| `InteractionModesPanel` | Mode selector |
| `AvatarSelector` | Avatar configuration |
| `EthicalConstraintsDisplay` | Constraint reference |

---

> *"XR becomes: clear, calm, accountable, replayable. NOT immersive manipulation."*

## License

MIT — CHE·NU Universal Cognitive Operating System
