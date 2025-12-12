# CHE·NU — Ethics Checkpoints Specification

## 🔒 VERSION: 1.0 (FROZEN)

This specification is frozen and aligned with Ethical Foundation v1.0.
Any evolution requires a new version and must remain conceptually compatible.

---

## 🧭 OFFICIAL ICON

### Icon
```
🧭
```

### Name
**Compass**

### Meaning
- Orientation without prohibition
- Direction without judgment
- Human sovereignty

### Usage Rules
- ✅ Discreet UI element
- ✅ Context indicator
- ❌ Never blinking
- ❌ Never alarming
- ❌ Never blocking

---

## 📝 MICRO-COPY (FINAL FROZEN VERSION)

### Primary Micro-Copy
```
Responsabilité humaine active · Assistance optionnelle
```

### Contextual Tooltip
```
Vous opérez dans un cadre que vous avez défini.
Le système vous assiste, sans décider pour vous.
```

### XR / Meeting
```
Cadre actif · Responsabilité humaine maintenue
```

### Replay / Export
```
Cette action reflète un choix humain conscient
dans un cadre explicitement défini.
```

---

## 🔤 LANGUAGE RULES

### ✅ AUTHORIZED LANGUAGE

| French | English |
|--------|---------|
| responsabilité | responsibility |
| cadre | frame / context |
| clarté | clarity |
| optionnel | optional |
| conscience | awareness |
| actif | active |
| humain | human |
| assistance | assistance |
| explicite | explicit |
| défini | defined |

### ❌ FORBIDDEN LANGUAGE

| French | English |
|--------|---------|
| avertissement | warning |
| risque | risk |
| recommandation | recommendation |
| conformité | compliance |
| moralité | morality |
| danger | danger |
| problème | problem |
| erreur | error |
| violation | violation |
| alerte | alert |

**NO VARIATION AUTHORIZED.**

---

## 🎨 UI INTEGRATION RULES

### Core Principles

1. **The 🧭 icon never blocks any action**
2. **The text never asks for a response**
3. **The checkpoint can always be ignored**
4. **Silence mode hides all appearances**

### Visual Specifications

| Property | Value |
|----------|-------|
| Icon size | 14-16px |
| Text size | 11-12px |
| Color | Muted gray (#6c757d) |
| Background | Light gray (#f8f9fa) |
| Border | Subtle (#e9ecef) |
| Border radius | 4px |
| Opacity | 0.6-0.8 |

### Behavior

| Property | Value |
|----------|-------|
| Blocking | ❌ Never |
| Persistent state | ❌ None |
| Insistence | ❌ Never |
| Auto-hide | ✅ Optional (5s default) |
| Dismissible | ✅ Always |
| Animation | ❌ None (no blink, no pulse) |

---

## 📍 PLACEMENT (4 LOCATIONS ONLY)

| Location | Trigger | Micro-Copy |
|----------|---------|------------|
| Task Creation | `task_init` | Primary |
| Context Change | `context_change` | Primary |
| XR / Meeting | `xr_meeting` | XR / Meeting |
| Replay / Export | `replay_export` | Replay / Export |

**NO other placement is authorized.**

---

## 🔕 SILENCE MODE

When Silence Mode is enabled:
- All Ethics Checkpoints are hidden
- No micro-copy is displayed
- No icon is shown
- System continues normally

Silence Mode is the user's sovereign choice to disable all ethical observations.

---

## ✅ COMPLIANCE CHECKLIST

Before implementing an Ethics Checkpoint, verify:

- [ ] Location is one of the 4 authorized
- [ ] Icon is 🧭 only
- [ ] Micro-copy is from frozen list only
- [ ] No forbidden language used
- [ ] No blocking behavior
- [ ] No persistent state
- [ ] Silence mode respected
- [ ] Dismissible without consequence

---

## 🎯 KEY PRINCIPLE

> CHE·NU is not an AI that tells users what to do.
> It is a system that ensures users always know what they are doing.

---

## 📊 STATUS

Ethics Checkpoints are:
- ✅ Frozen
- ✅ Non-extensible without versioning
- ✅ Purely informative
- ✅ Aligned with Ethical Foundation v1.0

---

*CHE·NU — Ethics by Architecture, not Policy*
