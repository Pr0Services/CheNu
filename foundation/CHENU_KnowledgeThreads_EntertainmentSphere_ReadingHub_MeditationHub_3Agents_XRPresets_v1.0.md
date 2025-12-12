# CHE·NU — ENTERTAINMENT SPHERE EXTENSIONS
**MODULES:** READING HUB + MEDITATION HUB  
**VERSION:** ENT.v1.0  
**MODE:** BUILD-READY / NON-MANIPULATIVE / CALM-TECH

---

## SPHERE: ENTERTAINMENT EXTENSIONS ⚡

### Purpose
> **Provide calm, restorative, intellectually enriching features that do NOT influence mood, beliefs, or decisions. Only offer clarity, comfort, and structured exploration.**

---

## MODULE 1 — READING HUB (LECTURE) ⚡

### GOAL
> **A peaceful, customizable reading environment:** import books/articles, clean reading UI, optional summaries (neutral), bookmarking + organization, **NO sentiment shaping or recommendation bias.**

### 3 Reading Modes ⚡
| Mode | Description |
|------|-------------|
| **FOCUS** | plain text, no animation, neutral font, light highlight for progress ⚡ |
| **IMMERSIVE** | **XR page room**, floating book panel, minimal motion page turning, glare-free lighting ⚡ |
| **SCHOLAR** | side-by-side (text + notes + context), **cross-reference tool (non-inferential)** ⚡ |

### Reading Hub Features ⚡
| Feature | Status |
|---------|--------|
| ✔ Import (PDF, EPUB, TXT) | ⚡ |
| ✔ **Neutral summarizer (fact-only)** | ⚡ |
| ✔ Vocabulary lookup (non-interpretive) | ⚡ |
| ✔ Bookmarks tree | ⚡ |
| ✔ **"Reading Path" timeline (purely chronological)** | ⚡ |
| ✔ **Quiet Mode (removes UI elements)** | ⚡ |
| ✔ Export progress notes | ⚡ |

### Reading Hub JSON ⚡
```json
{
  "reading_hub": {
    "items": [
      {
        "id": "uuid",
        "type": "book|article",
        "title": "string",
        "source": "upload|link",
        "progress": "0.0-1.0",
        "notes": [],
        "xr_enabled": true
      }
    ]
  }
}
```

### XR Reading Room Preset ⚡
| Feature | Description |
|---------|-------------|
| warm low lighting | ⚡ |
| **floating adjustable text slab** | ⚡ |
| quiet ambient | ⚡ |
| **comfort-locked camera** | ⚡ |
| **no avatar expressivity** | ⚡ |

---

## MODULE 2 — MEDITATION HUB (MÉDITATION) ⚡

### GOAL
> **A non-influential, purely calming space for:** grounding, breath pacing, visual rest **WITHOUT emotional steering or psychological modeling.**

### 4 Meditation Modes ⚡
| Mode | Description |
|------|-------------|
| **BREATH PACER** | neutral ring expanding/contracting, no sound by default, optional soft pulse ⚡ |
| **STILLNESS ROOM** | XR or 2D, minimal visuals, soft background lighting ⚡ |
| **FOCUS POINT** | single geometric form, slow rotation (optional), **no color shifts** ⚡ |
| **BODY SCAN (NON-GUIDED)** | static silhouette, **user taps zones manually**, no instructions or suggestions ⚡ |

### Meditation Hub Features ⚡
| Feature | Status |
|---------|--------|
| ✔ Time tracker | ⚡ |
| ✔ **Session history (local only)** | ⚡ |
| ✔ Minimal XR room | ⚡ |
| ✔ **"Visual Silence Mode"** | ⚡ |
| ✔ User-chosen presets only | ⚡ |
| ✔ **No voice guidance (to avoid influence)** | ⚡ |

### Meditation Hub JSON ⚡
```json
{
  "meditation_hub": {
    "sessions": [
      {
        "id": "uuid",
        "type": "breath|stillness|focus|scan",
        "duration_sec": 600,
        "timestamp": 1712345678,
        "notes": "string|optional"
      }
    ],
    "preferences": {
      "ambient": "none|soft",
      "motion": "none|slow",
      "color": "neutral"
    }
  }
}
```

### 3 XR Meditation Presets ⚡ (NOUVEAU!)
| Preset | Description |
|--------|-------------|
| **QUIET SANCTUM** | neutral greys, soft radial light, zero motion, **floating quiet timer** ⚡ |
| **GEOMETRIC REST** | polyhedral focus object, no audio, slow rotation (optional) ⚡ |
| **BREATH CHAMBER** | expanding ring, **comfort-locked camera**, dim background ⚡ |

---

## 3 AGENTS FOR ENTERTAINMENT SPHERE ⚡

| Agent | Role |
|-------|------|
| `AGENT_READING_ORGANIZER` | organizes library, creates neutral summaries, **never recommends based on psychology** ⚡ |
| `AGENT_MEDITATION_SCHEDULER` | optional reminders (user opt-in), session tracking, **never suggests emotional content** ⚡ |
| `AGENT_DISPLAY_OPTIMIZER` | improves readability or comfort, **ensures accessibility compliance** ⚡ |

---

## UI INTEGRATION ⚡

### Sphere Menu ⚡
```
SPHERE MENU → ENTERTAINMENT
  → Reading Hub
  → Meditation Hub
```

### XR Menu ⚡
```
→ Enter Reading Room
→ Enter Meditation Room
```

### Icons ⚡
| Icon | Section |
|------|---------|
| 📘 | Reading |
| 🧘‍♂️ (neutral silhouette) | Meditation |

---

## SAFETY & ETHICS ⚡

| Rule | Status |
|------|--------|
| **No mood analysis** | ✅ ⚡ |
| **No emotional reinforcement** | ✅ ⚡ |
| **No persuasive cueing** | ✅ ⚡ |
| **User always chooses session start** | ✅ ⚡ |
| **All data local unless user exports manually** | ✅ ⚡ |

---

**END — READY FOR CLAUDE / COPILOT**
